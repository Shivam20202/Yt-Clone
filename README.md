# YouTube Clone

A full-stack YouTube clone application built using modern web technologies including Node.js, Express.js, MongoDB, React, and Vite.

# Video Link (Google drive)

 **Link**- https://drive.google.com/file/d/1hPA1d0x-vxedR8yJcw-leY61h6Xb82XK/view?usp=sharing

# Github Link

 **Github Link**- https://github.com/Shivam20202/Yt-Clone

## Features

### Frontend

* Responsive design for desktop, tablet, and mobile devices
* Video player with comments, likes/dislikes, and metadata
* Real-time search functionality
* Category-based video filtering
* Channel pages displaying channel information and videos
* JWT-based authentication
* Sidebar navigation
* Related videos section

### Backend

* RESTful API architecture
* JWT authentication and authorization
* MongoDB database integration
* User registration and login
* Video management system
* Comment management
* Channel management

## Tech Stack

### Frontend

* React 18
* Vite
* React Router
* Axios
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB
* JSON Web Token (JWT)
* CORS

## Project Structure

```text
yt-clone/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Channel.js
│   │   └── Video.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── channels.js
│   │   └── videos.js
│   │
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── seed.js
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   └── VideoCard.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SidebarContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── ChannelPage.jsx
│   │   │   └── AuthPage.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── package.json
```

## Installation & Setup

### Prerequisites

* Node.js (v14 or higher)
* MongoDB (Local or MongoDB Atlas)
* npm or yarn

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Seed the database:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Usage

### Authentication

* Register a new account
* Login with credentials
* Access protected features

### Search Videos

* Search videos in real time
* Results update automatically while typing

### Browse Categories

* Filter videos by category
* Clear filters to view all videos

### Watch Videos

* Play videos
* Like or dislike videos
* View video details
* Add and manage comments

### Channel Pages

* View channel information
* Browse channel videos

## API Endpoints

### Authentication

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register a new user |
| POST   | `/auth/login`    | Login user          |
| POST   | `/auth/logout`   | Logout user         |

### Videos

| Method | Endpoint                          | Description        |
| ------ | --------------------------------- | ------------------ |
| GET    | `/videos`                         | Get all videos     |
| GET    | `/videos/:id`                     | Get a single video |
| POST   | `/videos/:id/comments`            | Add comment        |
| PUT    | `/videos/:id/comments/:commentId` | Update comment     |
| DELETE | `/videos/:id/comments/:commentId` | Delete comment     |
| POST   | `/videos/:id/like`                | Like a video       |
| POST   | `/videos/:id/dislike`             | Dislike a video    |

### Channels

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| GET    | `/channels/:id`        | Get channel details     |
| GET    | `/channels/:id/videos` | Get videos of a channel |

## Troubleshooting

### Backend Connection Issues

* Verify MongoDB is running
* Check the MongoDB connection string
* Ensure environment variables are configured correctly

### Frontend Issues

* Verify backend server is running
* Check API base URL configuration
* Clear browser cache if necessary

## License

MIT License

## Author

**Shivam Pandey**
