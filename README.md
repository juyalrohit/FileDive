# DobbyAds Assignment - Folder & Image Management System

## Overview

A full-stack folder and image management application built with React, Node.js, Express, MongoDB, and Cloudinary.

Users can create nested folders, upload images, organize content, track storage usage, and manage files through a clean dashboard interface.

---

## Features

### Authentication

* User Signup
* User Login
* Secure JWT Authentication
* HTTP-Only Cookie Based Sessions
* Protected Routes

### Folder Management

* Create Folders
* Nested Folder Support
* Rename Folders
* Delete Folders
* Recursive Folder Deletion
* Folder Size Calculation

### Image Management

* Upload Images
* Cloudinary Integration
* Delete Images
* View Images by Folder
* View All Images

### Dashboard

* Total Folders Count
* Total Images Count
* Total Storage Used
* Recent Uploads
* Root Folder Navigation

---

## Tech Stack

### Frontend

* React
* React Router
* Axios
* React Hot Toast
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Cookie Parser
* Multer

### Storage

* Cloudinary

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## Project Structure

```text
DobbyAdsAssignment/

├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Environment Variables

### Backend (.env)

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

CLIENT_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (.env)

```env
VITE_API_URL=
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>

cd DobbyAdsAssignment
```

### Backend Setup

```bash
cd server

npm install

npm run dev
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/signup

POST /api/auth/login

POST /api/auth/logout

GET /api/auth/me
```

### Folder Management

```http
GET    /api/folders

POST   /api/folders

GET    /api/folders/:id

PATCH  /api/folders/:id

DELETE /api/folders/:id
```

### Images

```http
POST   /api/images/upload

GET    /api/images

DELETE /api/images/:id
```

### Dashboard Stats

```http
GET /api/stats
```

---

## Folder Size Calculation

Folder sizes are automatically maintained whenever:

* An image is uploaded
* An image is deleted
* A folder is deleted

The size update propagates recursively through parent folders to ensure accurate storage calculations.

---

## Recursive Folder Deletion

When a folder is deleted:

1. All images inside the folder are removed.
2. Cloudinary assets are deleted.
3. All child folders are recursively deleted.
4. Folder sizes are updated.
5. The folder itself is removed.

---

## Future Improvements

* Search Functionality
* Drag and Drop Uploads
* File Preview
* Trash / Restore System
* Sharing Support
* MCP Tool Integration

---

## Author

Rohit Juyal

Full Stack Developer | MERN Stack Developer

