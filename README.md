# YouTube Clone

A full-stack YouTube clone application built with modern web technologies including Node.js, Express, MongoDB, React, and Vite.

## Features

### Frontend
- **Responsive Design**: Fully responsive UI that works seamlessly on desktop, tablet, and mobile devices
- **Video Player**: Full-featured video player with comments, likes/dislikes, and metadata
- **Search Functionality**: Real-time auto-search as you type - results update automatically
- **Category Filtering**: Browse videos by categories with symmetrical filter chips
- **Channel Pages**: View channel information and all videos from a channel
- **Authentication**: User authentication with JWT tokens
- **Sidebar Navigation**: Fixed sidebar that floats above content on desktop (doesn't push content)
- **Related Videos**: Optimized layout showing thumbnails alongside video metadata

### Backend
- **RESTful API**: Complete REST API for all operations
- **Authentication**: JWT-based authentication and authorization
- **Database**: MongoDB for data persistence
- **User Management**: Register, login, and user profiles
- **Video Management**: Upload, view, and manage videos
- **Comments System**: Add, edit, and delete comments on videos
- **Channel Management**: Create and manage channels

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- React Router (navigation)
- Axios (HTTP client)
- CSS3 (styling)

### Backend
- Node.js
- Express.js
- MongoDB
- JWT (authentication)
- CORS enabled

## Project Structure

```
yt clone/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Channel.js            # Channel schema
│   │   └── Video.js              # Video schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── channels.js           # Channel routes
│   │   └── videos.js             # Video routes
│   ├── package.json
│   ├── server.js                 # Main server file
│   └── seed.js                   # Database seeding script
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # Axios configuration
    │   ├── components/
    │   │   ├── Header.jsx        # Header with search
    │   │   ├── Sidebar.jsx       # Navigation sidebar
    │   │   ├── FilterBar.jsx     # Category filter chips
    │   │   └── VideoCard.jsx     # Video card component
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Authentication context
    │   │   └── SidebarContext.jsx # Sidebar state context
    │   ├── pages/
    │   │   ├── Home.jsx          # Home page with video grid
    │   │   ├── VideoPlayer.jsx   # Video player page
    │   │   ├── AuthPage.jsx      # Login/Register page
    │   │   └── ChannelPage.jsx   # Channel page
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # Entry point
    │   └── index.css             # Global styles
    ├── package.json
    └── vite.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Seed the database with sample data:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```
VITE_API_BASE_URL=http://localhost:5000
```

Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### Creating an Account
1. Click on the profile icon in the header
2. Click "Sign in"
3. Create a new account with username and password
4. Log in with your credentials

### Searching Videos
- Type in the search bar at the top - results will update automatically as you type
- Clear the search to return to the homepage with all videos
- Results are sorted by relevance

### Filtering by Category
- Use the category filter chips on the homepage
- Chips are symmetrical and styled consistently
- Selecting a category automatically clears any active search

### Watching Videos
- Click on any video card to open the video player
- View video details including title, channel, views, and upload date
- Like/dislike videos and leave comments
- Browse related videos on the right sidebar (shows thumbnail, title, channel, views, and upload time)

### Channel Management
- Visit a channel by clicking on the channel name
- View all videos from that channel
- Subscribe to channels (if logged in)

## Responsive Design

The application is fully responsive with optimized layouts for:

### Desktop (1024px+)
- Fixed sidebar floats above content without pushing it
- Video player page has ample width with related videos on the right
- Multi-column video grid
- All navigation and features fully accessible

### Tablet (768px - 1023px)
- Sidebar collapses to icon-only mode
- Adjusted video grid columns
- Related videos remain visible on the side
- Optimized spacing and padding

### Mobile (< 768px)
- Sidebar becomes hidden by default
- Full-width content layout
- Single-column video grid
- Related videos stack below the player
- Touch-friendly UI elements

## Search Functionality

### Real-time Auto-Search
- Search results update automatically as you type
- No need to press Enter
- Results show videos matching your query
- Empty searches return all videos

### Search Clearing
- When you clear the search input completely, the homepage resets to show all videos
- Selecting a category automatically clears any active search
- Click the YouTube logo to return to the homepage at any time

## Recent Improvements

- **Sidebar Behavior**: Fixed sidebar now floats above content on large screens using CSS `position: fixed` instead of pushing content with margins
- **Video Player Width**: Increased video player area with optimized right-sidebar sizing for different screen sizes
- **Related Videos Layout**: Improved layout showing thumbnail alongside video metadata (title, channel, views, time) in a compact grid format
- **Category Chips**: Symmetrical filter buttons with consistent padding and border styling
- **Auto-Search**: Typing in the search bar now triggers automatic filtering without needing to press Enter
- **Center Content**: All content is properly centered on large screens with responsive max-widths

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Videos
- `GET /videos` - Get all videos (supports search and category filters)
- `GET /videos/:id` - Get single video
- `POST /videos/:id/comments` - Add comment
- `PUT /videos/:id/comments/:commentId` - Edit comment
- `DELETE /videos/:id/comments/:commentId` - Delete comment
- `POST /videos/:id/like` - Like a video
- `POST /videos/:id/dislike` - Dislike a video

### Channels
- `GET /channels/:id` - Get channel info
- `GET /channels/:id/videos` - Get channel videos

## Troubleshooting

### Backend not connecting
- Ensure MongoDB is running
- Check the MONGODB_URI in .env file
- Verify backend is running on the correct port

### Frontend not loading
- Clear browser cache
- Check VITE_API_BASE_URL in frontend .env
- Ensure backend is running before accessing the frontend

### Search not working
- Make sure backend is running
- Check browser console for errors
- Verify axios configuration

## Future Enhancements

- [ ] Video upload functionality
- [ ] Watch history and recommendations
- [ ] Playlist creation
- [ ] Video analytics and statistics
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts
- [ ] Captions/subtitles support
- [ ] Video quality selection

## License

MIT License

## Author

Shubham Pandey
