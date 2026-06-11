import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    channelName: { type: String, required: true, trim: true },
    handle: { type: String, unique: true, trim: true },
    description: { type: String, default: '' },
    channelBanner: { type: String, default: '' },
    channelAvatar: { type: String, default: '' },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  },
  { timestamps: true }
);

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;
