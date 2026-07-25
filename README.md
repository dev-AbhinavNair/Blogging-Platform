# BlogPlatform

A full-stack blogging platform built with the MERN stack (MongoDB, Express, React, Node.js). Features include user authentication via OTP, blog post creation with a rich text editor, categories, comments, likes, and a user dashboard.

## Tech Stack

**Frontend:** React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios, React Quill (rich text editor)

**Backend:** Express 4, Mongoose 9, MongoDB, JWT authentication, Nodemailer (OTP emails)

## Features

- Passwordless OTP-based authentication (email verification)
- Create, edit, and delete blog posts with a rich text editor (React Quill)
- Category-based post organization and filtering
- Full-text search across post titles and content
- Like/unlike posts (toggle)
- Comment on posts (authenticated users only)
- User dashboard with stats (total posts, likes, comments)
- Responsive UI across all screen sizes
- JWT token refresh with automatic retry

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Gmail account with App Password (for OTP emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/dev-AbhinavNair/blogging-platform.git
cd blogging-platform

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bloggingplatform
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

### Running the App

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend on port 5000.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/request-otp` | Request OTP via email |
| POST | `/api/auth/verify-otp` | Verify OTP and get tokens |
| POST | `/api/auth/refresh` | Refresh access token |

### Blog Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | List all posts (supports `?search`, `?category`, `?page`) |
| GET | `/api/blogs/:id` | Get single post |
| POST | `/api/blogs` | Create new post |
| PUT | `/api/blogs/:id` | Update post (owner only) |
| DELETE | `/api/blogs/:id` | Delete post (owner only) |
| POST | `/api/blogs/:id/like` | Toggle like on post |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/:blogId` | Get comments for a post |
| POST | `/api/comments/:blogId` | Add comment to a post |
| DELETE | `/api/comments/:id` | Delete comment (owner only) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories with post counts |
| POST | `/api/categories` | Create new category |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get user's posts and stats |

## Project Structure

```
blogging-platform/
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── models/        (User, BlogPost, Category, Comment)
│   ├── controllers/   (auth, blog, comment, category, dashboard)
│   ├── routes/        (auth, blog, comment, category, dashboard)
│   ├── middleware/     (authMiddleware)
│   └── utils/         (sendEmail)
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── components/ (Navbar, ProtectedRoute)
│       ├── context/    (AuthContext)
│       └── pages/      (Home, PostDetail, CreatePost, EditPost, Dashboard, Categories, Login)
```

## License

MIT
