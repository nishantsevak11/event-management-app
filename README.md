#  Event Management App

A full-stack event management application built with **React.js, Node.js, Express.js, and MongoDB Atlas**.  

Users can **create, edit, delete, and join events** with real-time updates and filtering options.

---

##  Features

- **User Authentication** (Register, Login, Guest Access)  
- **Create, Edit & Delete Events**  
- **Filter Events by Category & Date**  
- **Join Events (Prevents Joining Past Events)**  
- **Real-Time Updates using WebSockets**  
- **Mobile-Friendly & Responsive UI**  

---

##  Tech Stack

### **Frontend (React)**
- ⚛ **React.js** (Vite)
-  **TailwindCSS** (Styled UI)
-  **Axios** (API Requests)
-  **React Router** (Navigation)

### **Backend (Node.js & Express)**
-  **Node.js** (Server-side)
-  **Express.js** (REST API)
-  **MongoDB Atlas** (Database)
-  **JWT Authentication** (Secure Login)

### **Deployment**
-  **Frontend** → [Vercel]([https://vercel.com/](https://event-management-app-mauve.vercel.app/))  
-  **Database** → MongoDB Atlas  

---

##  Installation & Setup

### **1️ Clone the Repository**
```sh
git clone https://github.com/your-username/event-management-app.git
cd event-management-app
```

### **2️ Install Dependencies**
```sh
npm install    # Install frontend dependencies
cd backend && npm install  # Install backend dependencies
```

### **3️ Set Up Environment Variables**
Create a `.env` file inside the **backend** folder:
```env
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret_key
```

### **4️ Run Locally**
#### **Frontend (React)**
```sh
npm start
```
#### **Backend (Express.js)**
```sh
cd backend
node server.js
```

---
##  Deployment Guide

### **Deploy Backend (Render)**
1. **Push your code to GitHub**
2. **Go to** [Render](https://render.com/) → **Create New Web Service**
3. **Connect GitHub Repo** → Select your project
4. **Set Environment Variables (`MONGO_URI`, `JWT_SECRET`)**
5. **Deploy!**

### **Deploy Frontend (Vercel)**
1. **Go to** [Vercel](https://vercel.com/) → **Create a New Project**
2. **Import from GitHub** → Select your repo
3. **Deploy!**

---

## 🛠️ API Endpoints

| Endpoint              | Method | Description              |
|----------------------|--------|--------------------------|
| `/auth/login`       | `POST` | User Login               |
| `/auth/register`    | `POST` | User Registration        |
| `/auth/guest-login` | `POST` | Guest Login              |
| `/events`          | `GET`  | Fetch all events        |
| `/events/join/:id` | `POST` | Join an event            |
| `/events/:id`      | `PUT`  | Update event             |
| `/events/:id`      | `DELETE` | Delete event          |

---

##  Test User Credentials
Use these credentials to test the app:

| Role  | Email                     | Password  |
|-------|---------------------------|----------|
| User  | test@test.com             | 123123 |
| Guest | (No email needed)         | (Guest Login) |

**Guest Login** allows users to explore without an account.

---


---

##  Future Improvements
- 🌟 **Event Reviews & Ratings**
- 🌟 **User Profiles**
- 🌟 **Payment Integration for Paid Events**
- 🌟 **Email Notifications for Event Updates**


