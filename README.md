# 🚀 ThoughtStream

> A **Full Stack Social Media Platform** inspired by **Twitter** and **Instagram**, featuring secure authentication, user profiles, image uploads, follow requests, comments, likes, and responsive UI.

---

## 🌟 Overview

ThoughtStream is a modern social networking web application that enables users to:

* 🔐 Sign Up, Login, and Logout securely
* 👤 Create and manage personal profiles
* 📝 Create posts with text and images
* ❤️ Like and save posts
* 💬 Comment on posts
* 👥 Send and manage follow requests
* 🔎 Search users and posts
* 📱 Enjoy a responsive experience across desktop and mobile devices

---

## 📸 Screenshots

### 🏠 Home Page

<!-- Add Home Page Screenshot Here -->

```md
![assets/home_page.png]
```

---

### 👤 User Profile

<!-- Add Profile Screenshot Here -->

```md
![assets/Profile-page.png]
```

---

### 📝 Create Post

<!-- Add Create Post Screenshot Here -->

```md
![assets/Create_post.png]
```

---

### 🔔 Post Detail

<!-- Add Follow Requests Screenshot Here -->

```md
![assets/Post_detail.png]
```

---

## ✨ Features

### 🔐 Authentication & Authorization

* Secure User Signup and Login
* Session Management using Passport.js
* Password Hashing with bcrypt
* Ownership Authorization (Only post owner can edit/delete posts)

### 👤 User Profile

* Editable Bio
* Profile Picture Upload
* Followers & Following System
* Notification-based Follow Requests

### 📝 Posts

* Create Posts with Text and Images
* Cloud Image Storage
* Edit and Delete Posts
* View Post Details

### 💬 Social Features

* Like Posts
* Save Posts
* Comment System
* Follow Requests (Instagram Style)

### 🔍 Search

* Search by Username
* Search by Post Content

### 📱 Responsive Design

* Mobile Friendly UI
* Flexbox and Media Queries
* Modern Twitter/Instagram Inspired Interface

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* EJS
* Flexbox
* Media Queries

### Backend

* Node.js
* Express.js
* Passport.js
* Express Session
* bcrypt

### Database

* MongoDB Atlas
* Mongoose

### Cloud Storage

* Cloudinary
* Multer

### Tools

* Git
* GitHub
* MongoDB Compass
* Visual Studio Code

---

## 📂 Project Structure

```bash
ThoughtStream/
│
├── models/
│   ├── user.js
│   └── post.js
│
├── views/
│   ├── index.ejs
│   ├── show.ejs
│   ├── profile.ejs
│   ├── comment.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   └── editProfile.ejs
│
├── public/
│   ├── index.css
│   ├── show.css
│   ├── profile.css
│   └── images/
│
├── cloudConfig.js
├── index.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ThoughtStream.git

cd ThoughtStream
```

### Install Dependencies

```bash
npm install
```

### Create `.env` File

```env
MONGO_URL=YOUR_MONGODB_ATLAS_URL

SESSION_SECRET=YOUR_SECRET

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME

CLOUDINARY_API_KEY=YOUR_API_KEY

CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

### Run the Project


nodemon index.js


or


node index.js


Open:


http://localhost:8080


## 🎯 Future Improvements

* Real-time notifications using Socket.IO
* Dark Mode
* Infinite Scrolling
* Chat/Messaging System
* Email Verification
* AI-based Content Recommendation

---

## 👩‍💻 Author

**Nikita Kumawat**

* CSE Dual Degree (B.Tech + M.Tech)
* National Institute of Technology Patna
* Interested in Full Stack Development, Cyber Security, and Machine Learning


