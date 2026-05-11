# Uniconnect

A full-stack web application that enables users to connect, search, and manage their professional networks.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

## ✨ Features

- **User Authentication**: Secure login and registration with password reset functionality
- **User Profiles**: Create and manage user profiles with profile pictures
- **Connections**: Connect with other users and manage your network
- **Search**: Search for users across the platform
- **Image Management**: Upload and manage profile images using Cloudinary
- **Protected Routes**: Secure application routes with token-based authentication
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary
- **File Handling**: Multer

### Frontend
- **Library**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router

## 📁 Project Structure

```
uniconnect/
├── backend/
│   ├── config/              # Configuration files (database, cloudinary)
│   ├── controllers/         # Request handlers for routes
│   ├── middleware/          # Custom middleware (auth, upload, error handling)
│   ├── models/              # Database schemas
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic and external service integrations
│   ├── server.js            # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components for different routes
│   │   ├── routes/          # Route configuration
│   │   ├── services/        # API service calls and utilities
│   │   └── main.jsx         # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uniconnect
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Configuration** - Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CORS_ORIGIN=http://localhost:5173
   ```

2. **Frontend Configuration** - Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

### Running the Application

#### Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the Frontend Development Server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

#### Production Build

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy Backend** - Configure your hosting platform with the environment variables and deploy the `backend` directory.

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset

### User Routes
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users` - List all users

### Connection Routes
- `POST /api/connections` - Create a new connection
- `GET /api/connections` - Get user's connections
- `DELETE /api/connections/:id` - Remove a connection

### Search Routes
- `GET /api/search` - Search for users

## 🔐 Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token generation |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CORS_ORIGIN` | Frontend URL for CORS configuration |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please contact the development team.
