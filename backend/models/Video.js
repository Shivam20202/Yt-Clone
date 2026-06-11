import mongoose from 'mongoose';

//Defined videoschema

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: { type: String, required: true },
    avatar: { type: String, default: '' },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);


const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
    channelName: { type: String, required: true },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      default: 'All',
      enum: [
        'All',
        'Web Development',
        'JavaScript',
        'Data Structures',
        'Server',
        'Music',
        'Information Technology',
        'Gaming',
        'Live',
        'Spring Framework',
        'Education',
        'Entertainment',
      ],
    },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    uploadDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Video = mongoose.model('Video', videoSchema);
export default Video;
