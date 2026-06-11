import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import VideoPlayer from './pages/VideoPlayer.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ChannelPage from './pages/ChannelPage.jsx';

//Main App file with all routes
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/watch/:id" element={<VideoPlayer />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/channel/:id" element={<ChannelPage />} />
    </Routes>
  );
}
