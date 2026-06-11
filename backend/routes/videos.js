import express from 'express';
import mongoose from 'mongoose';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// GET /api/videos - fetch all videos (with optional search & category filter)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const videos = await Video.find(query).sort({ createdAt: -1 });
    res.json(videos);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/videos/:id - fetch single video
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Video not found' });
    }
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    // increment view count
    video.views += 1;
    await video.save();
    res.json(video);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/videos - create a video (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoUrl, channelId, category } = req.body;

    if (!title || !channelId) {
      return res.status(400).json({ message: 'Title and channel are required' });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const video = await Video.create({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      channelId,
      channelName: channel.channelName,
      uploader: req.user._id,
      category: category || 'All',
    });

    channel.videos.push(video._id);
    await channel.save();

    res.status(201).json(video);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/videos/:id - update a video (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, thumbnailUrl, videoUrl, category } = req.body;
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (thumbnailUrl !== undefined) video.thumbnailUrl = thumbnailUrl;
    if (videoUrl !== undefined) video.videoUrl = videoUrl;
    if (category) video.category = category;

    const updated = await video.save();
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/videos/:id - delete a video (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videos: video._id },
    });

    await video.deleteOne();
    res.json({ message: 'Video deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/videos/:id/like - toggle like (protected)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id;
    const alreadyLiked = video.likes.some((id) => id.equals(userId));
    const alreadyDisliked = video.dislikes.some((id) => id.equals(userId));

    if (alreadyLiked) {
      video.likes = video.likes.filter((id) => !id.equals(userId));
    } else {
      video.likes.push(userId);
      if (alreadyDisliked) {
        video.dislikes = video.dislikes.filter((id) => !id.equals(userId));
      }
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/videos/:id/dislike - toggle dislike (protected)
router.post('/:id/dislike', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id;
    const alreadyDisliked = video.dislikes.some((id) => id.equals(userId));
    const alreadyLiked = video.likes.some((id) => id.equals(userId));

    if (alreadyDisliked) {
      video.dislikes = video.dislikes.filter((id) => !id.equals(userId));
    } else {
      video.dislikes.push(userId);
      if (alreadyLiked) {
        video.likes = video.likes.filter((id) => !id.equals(userId));
      }
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/videos/:id/comments - add a comment (protected)
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const comment = {
      userId: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar,
      text: text.trim(),
    };

    video.comments.push(comment);
    await video.save();

    const saved = video.comments[video.comments.length - 1];
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/videos/:id/comments/:commentId - edit a comment (protected)
router.put('/:id/comments/:commentId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const comment = video.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.text = text.trim();
    await video.save();
    res.json(comment);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/videos/:id/comments/:commentId - delete a comment (protected)
router.delete('/:id/comments/:commentId', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const comment = video.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.deleteOne();
    await video.save();
    res.json({ message: 'Comment deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
