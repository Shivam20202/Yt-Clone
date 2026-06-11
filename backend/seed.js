/**
 * Seed script: populates MongoDB with sample users, channels, and videos.
 * Run: node seed.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Channel from './models/Channel.js';
import Video from './models/Video.js';

dotenv.config();
await connectDB();

await Video.deleteMany();
await Channel.deleteMany();
await User.deleteMany();

const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash('password123', salt);

const user1 = await User.create({
  username: 'JohnDoe',
  email: 'john@example.com',
  password: hashed,
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop',
});

const user2 = await User.create({
  username: 'JaneSmith',
  email: 'jane@example.com',
  password: hashed,
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop',
});

const channel1 = await Channel.create({
  channelName: 'Code with John',
  handle: '@codewithjohn',
  description: 'Coding tutorials and tech reviews by John Doe.',
  channelBanner: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?w=1200&h=300&fit=crop',
  channelAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop',
  owner: user1._id,
});

const channel2 = await Channel.create({
  channelName: 'Jane Codes',
  handle: '@janecodes',
  description: 'Full stack development with Jane.',
  channelBanner: 'https://images.pexels.com/photos/574069/pexels-photo-574069.jpeg?w=1200&h=300&fit=crop',
  channelAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop',
  owner: user2._id,
});

user1.channels.push(channel1._id);
user2.channels.push(channel2._id);
await user1.save();
await user2.save();

const videosData = [
  {
    title: 'Learn React in 30 Minutes',
    description: 'A quick tutorial to get started with React. We cover components, state, and props.',
    thumbnailUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelId: channel1._id,
    channelName: channel1.channelName,
    uploader: user1._id,
    category: 'Web Development',
    views: 15200,
  },
  {
    title: 'JavaScript ES6 Features Explained',
    description: 'Deep dive into modern JavaScript features including arrow functions, destructuring, and more.',
    thumbnailUrl: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelId: channel1._id,
    channelName: channel1.channelName,
    uploader: user1._id,
    category: 'JavaScript',
    views: 23400,
  },
  {
    title: 'Data Structures & Algorithms in JS',
    description: 'Complete guide to data structures and algorithms using JavaScript.',
    thumbnailUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelId: channel2._id,
    channelName: channel2.channelName,
    uploader: user2._id,
    category: 'Data Structures',
    views: 8700,
  },
  {
    title: 'Node.js & Express Complete Course',
    description: 'Build RESTful APIs with Node.js and Express from scratch.',
    thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelId: channel2._id,
    channelName: channel2.channelName,
    uploader: user2._id,
    category: 'Server',
    views: 34100,
  },
  {
    title: 'Lo-fi Study Music Mix 2024',
    description: 'Chill beats to study and relax. Perfect for coding sessions.',
    thumbnailUrl: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelId: channel1._id,
    channelName: channel1.channelName,
    uploader: user1._id,
    category: 'Music',
    views: 91000,
  },
  {
    title: 'Spring Framework Tutorial for Beginners',
    description: 'Learn Spring Boot and build your first enterprise application.',
    thumbnailUrl: 'https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelId: channel2._id,
    channelName: channel2.channelName,
    uploader: user2._id,
    category: 'Spring Framework',
    views: 5600,
  },
  {
    title: 'MongoDB Atlas Full Tutorial',
    description: 'Master MongoDB Atlas and build cloud-hosted databases for your applications.',
    thumbnailUrl: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelId: channel1._id,
    channelName: channel1.channelName,
    uploader: user1._id,
    category: 'Information Technology',
    views: 12300,
  },
  {
    title: 'Top 10 Gaming Setups 2024',
    description: 'Showcase of amazing gaming setups from around the world.',
    thumbnailUrl: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?w=640&h=360&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    channelId: channel2._id,
    channelName: channel2.channelName,
    uploader: user2._id,
    category: 'Gaming',
    views: 44200,
  },
];

const createdVideos = await Video.insertMany(videosData);

channel1.videos = createdVideos.filter((v) => v.channelId.equals(channel1._id)).map((v) => v._id);
channel2.videos = createdVideos.filter((v) => v.channelId.equals(channel2._id)).map((v) => v._id);
await channel1.save();
await channel2.save();

console.log('Database seeded successfully!');
console.log(`Users: john@example.com / jane@example.com  (password: password123)`);
mongoose.connection.close();


