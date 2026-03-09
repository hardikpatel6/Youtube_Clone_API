<div align="center">
  <img src="https://raw.githubusercontent.com/hardikpatel6/Youtube_Clone_API/main/frontend/public/youtube-logo-placeholder.png" alt="YouTube Clone API Logo" width="150" />
  
  # 📺 YouTube Clone API & Frontend
  
  **A full-stack, feature-rich YouTube clone built with the MERN stack.**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

</div>

---

## 📖 Overview

This project is a sophisticated, full-stack video-sharing application inspired by YouTube. It offers a robust RESTful API built with **Node.js, Express, and TypeScript**, backed by **MongoDB**. The visually appealing, highly responsive user interface is constructed using **React 19, Vite, and Tailwind CSS v4**.

It supports end-to-end functionality including secure user authentication (JWT + Google OAuth), video uploading and streaming (via Cloudinary), engagement systems (likes, comments, subscriptions), and a beautifully crafted frontend experience.

## ✨ Key Features

- **🔐 Secure Authentication**: Email/Password registration with `bcryptjs` and session management via JWT. Google OAuth integration out of the box.
- **🎥 Video Management**: Seamless video and thumbnail uploading, processing, and cloud storage powered by Cloudinary.
- **💬 Engagement & Interactions**: Full comment system, liking/disliking videos, and subscribing to channels.
- **⚡ High Performance**: Blazing fast frontend builds using Vite and responsive styling with TailwindCSS.
- **🛡️ Type-Safe Backend**: The entire server architecture is written in TypeScript for reliability, fewer bugs, and better developer experience.
- **✉️ Email Notifications**: Ready-to-use mail integration through SendGrid/Nodemailer.

---

## 🛠️ Tech Stack

### 💻 Frontend
- **Framework**: React.js 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Auth**: Google OAuth Integration (`@react-oauth/google`)

### ⚙️ Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB & Mongoose ORM
- **Media Storage**: Cloudinary
- **Authentication**: JSON Web Tokens (JWT) & Google Auth Library
- **Security**: bcryptjs
- **Mailer**: Nodemailer & SendGrid

---

## 📁 Project Structure

```bash
Youtube_Clone_API/
├── backend/                  # TypeScript & Express Server
│   ├── src/
│   │   ├── config/           # Database and 3rd party configurations
│   │   ├── controllers/      # API Route controllers
│   │   ├── middlewares/      # Express middlewares (Auth, Error handling)
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API Endpoints
│   │   ├── types/            # TypeScript interface definitions
│   │   ├── utils/            # Helper functions
│   │   └── server.ts         # Entry point for the server
│   └── package.json
│
└── frontend/                 # React & Vite Client App
    ├── src/
    │   ├── api/              # Axios API setup
    │   ├── component/        # Reusable React components (Navbar, VideoCard, etc.)
    │   ├── context/          # React Context providers (AuthContext)
    │   ├── pages/            # Top-level route pages (Home, Login, Video)
    │   ├── App.jsx           # Main App component
    │   └── main.jsx          # Entry point for the React app
    ├── index.html
    ├── tailwind.config.js    # (or part of vite config in v4)
    └── package.json
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed to run this project:
- **Node.js** (v18.0.0 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas)
- **Cloudinary Account** (For media storage)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/hardikpatel6/Youtube_Clone_API.git
cd Youtube_Clone_API
```

### 2️⃣ Backend Setup (API)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create a .env file based on the environment variables required
touch .env
```

**Backend Environment Variables (`backend/.env`)**:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Optional: Google / Mailer config
GOOGLE_CLIENT_ID=your_google_client_id
SENDGRID_API_KEY=your_sendgrid_key
```

**Run the Backend Development Server:**
```bash
npm run dev
# Server should now be running on http://localhost:5000
```

### 3️⃣ Frontend Setup (Client)

Open a new terminal window / tab.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env file 
touch .env
```

**Frontend Environment Variables (`frontend/.env`)**:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Google OAuth Client ID for React
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

**Run the Frontend Development Server:**
```bash
npm run dev
# App should now be running on http://localhost:5173
```

---

## 🔌 Core API Endpoints

Here is a quick overview of the major REST endpoints provided by the backend.

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user & return token |

### Users (`/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/find/:id` | Get details of a specific user |
| `PUT` | `/api/users/sub/:id` | Subscribe to a user/channel |
| `PUT` | `/api/users/unsub/:id` | Unsubscribe from a user/channel |

### Videos (`/api/videos`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/videos` | Upload a newly created video |
| `GET` | `/api/videos/random` | Get a random listing of videos (Home page) |
| `GET` | `/api/videos/trend` | Get trending videos |
| `GET` | `/api/videos/find/:id` | Get single video details |

### Comments (`/api/comments`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/comments` | Add a comment to a video |
| `GET` | `/api/comments/:videoId` | Get all comments on a video |

---

## 🤝 Contributing

Contributions are always welcome! Whether it's adding new features, fixing bugs, or improving documentation, we appreciate your help.

1. Fork the repository
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <b>Developed with ❤️ by <a href="https://github.com/hardikpatel6">hardikpatel6</a></b>
</div>
