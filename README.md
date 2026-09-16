# 📁 Temporary File Transfer

A simple web application that allows you to transfer small files between devices using a **6-digit transfer code**.

No account or login is required. Upload a file from one device, get a temporary code, and use that code on another device to download the file.

## ✨ Features

* 📤 Upload files up to **2 MB**
* 🔢 Generate a unique **6-digit transfer code**
* 📥 Download files using the code
* ⏱️ Temporary file storage with automatic expiration
* 🗑️ Automatic cleanup of expired files
* 📱 Responsive design for mobile and desktop
* 🚫 No login or account required

## 🔄 How It Works

```text
Upload File
     ↓
Backend
     ↓
Cloud Storage
     ↓
Generate 6-Digit Code
     ↓
Share Code
     ↓
Enter Code on Another Device
     ↓
Download File
     ↓
File Expires Automatically
```

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer
* Cloudinary
* Node-Cron

## 📂 Project Structure

```text
Temporary-File-Transfer/
│
├── frontend/
│   └── React + Vite application
│
└── backend/
    └── Node.js + Express API
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Temporary-File-Transfer
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Backend

```bash
cd backend
npm install
npm run dev
```

## 🔐 Environment Variables

Create a `.env` file in the backend:

```env
PORT=8000

MONGO_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📡 API Endpoints

### Upload File

```http
POST /api/v1/files/upload
```

Upload a file using `multipart/form-data` with the field:

```text
file
```

### Download File

```http
GET /api/v1/files/download/:token
```

Example:

```http
GET /api/v1/files/download/482173
```

## 🔒 Temporary Files

Each uploaded file receives a 6-digit transfer code and an expiration time.

After expiration, the backend automatically removes the file from cloud storage and deletes its metadata from MongoDB.

## 🎯 Purpose

This project was built to make **quick file transfers between personal devices** simple without requiring accounts, USB drives, or permanently stored files.

## 📌 Future Improvements

* Increase transfer speed
* Add QR code sharing
* Add download progress
* Support larger files
* Improve security with signed download URLs
* Add optional custom expiration times

## 👨‍💻 Author

**Subham Sinha**

Built as a personal full-stack web development project.
