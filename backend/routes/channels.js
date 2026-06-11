import express from 'express';
import Channel from '../models/Channel.js';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// GET /api/channels/:id - get channel info with videos
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate('videos');
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/channels - create a channel (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { channelName, description, channelBanner, channelAvatar } = req.body;

    if (!channelName?.trim()) {
      return res.status(400).json({ message: 'Channel name is required' });
    }

    const handle =
      '@' +
      channelName
        .trim()
        .replace(/\s+/g, '')
        .toLowerCase()
        .slice(0, 20) +
      Math.random().toString(36).slice(2, 6);

    const channel = await Channel.create({
      channelName: channelName.trim(),
      handle,
      description: description || '',
      channelBanner: channelBanner || '',
      channelAvatar: channelAvatar || '',
      owner: req.user._id,
    });

    // link channel to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id },
    });

    res.status(201).json(channel);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/channels/:id - update channel (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { channelName, description, channelBanner, channelAvatar } = req.body;
    if (channelName) channel.channelName = channelName;
    if (description !== undefined) channel.description = description;
    if (channelBanner !== undefined) channel.channelBanner = channelBanner;
    if (channelAvatar !== undefined) channel.channelAvatar = channelAvatar;

    const updated = await channel.save();
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
