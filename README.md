# 📋 Task Manager App

A full-stack Task Manager application built as part of an internship assessment. Users can register, login, and manage tasks across a Kanban-style board with drag-and-drop functionality.

## 🌐 Live Demo

- **Frontend:** [Coming Soon - Vercel]
- **Backend:** [Coming Soon - Render]

---

## ✨ Features

### Authentication

- User registration with name, email, password
- Secure login with JWT tokens
- Protected routes — each user sees only their own tasks
- Logout functionality

### Task Management

- Create tasks with title, description, priority, and stage
- Edit existing tasks
- Delete tasks
- Move tasks between stages (Todo → In Progress → Done)
- Drag and drop tasks between columns

### Dashboard

- Real-time stats (Total, Todo, In Progress, Done)
- Search tasks by title
- Filter tasks by priority (Low, Medium, High)
- Kanban board with 3 columns
- Responsive design (Mobile, Tablet, Desktop)

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose       |
| ---------------- | ------------- |
| React + Vite     | UI Framework  |
| Tailwind CSS     | Styling       |
| React Router DOM | Navigation    |
| Axios            | API calls     |
| React Hot Toast  | Notifications |
| @dnd-kit/core    | Drag and Drop |

### Backend

| Technology           | Purpose          |
| -------------------- | ---------------- |
| Node.js + Express.js | REST API Server  |
| MySQL                | Database         |
| Sequelize            | ORM              |
| JWT                  | Authentication   |
| bcryptjs             | Password Hashing |
| express-validator    | Input Validation |
| helmet               | Security Headers |
| express-rate-limit   | Rate Limiting    |

---

## 📁 Folder Structure

task-manager/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Navbar.jsx
│ │ │ ├── StatsCards.jsx
│ │ │ ├── TaskCard.jsx
│ │ │ ├── TaskColumn.jsx
│ │ │ └── TaskModal.jsx
│ │ ├── context/
│ │ │ └── AuthContext.jsx
│ │ ├── pages/
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ └── Dashboard.jsx
│ │ ├── routes/
│ │ │ └── ProtectedRoute.jsx
│ │ ├── services/
│ │ │ ├── authApi.js
│ │ │ └── taskApi.js
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
└── backend/
├── config/
│ └── db.js
├── controllers/
│ ├── authController.js
│ └── taskController.js
├── middleware/
│ ├── authMiddleware.js
│ └── errorMiddleware.js
├── models/
│ ├── User.js
│ └── Task.js
├── routes/
│ ├── authRoutes.js
│ └── taskRoutes.js
├── utils/
│ └── generateToken.js
└── server.js

## 🗄️ Database Schema

### Users Table

| Column    | Type        | Description      |
| --------- | ----------- | ---------------- |
| id        | INT (PK)    | Auto increment   |
| name      | VARCHAR(50) | User's full name |
| email     | VARCHAR     | Unique email     |
| password  | VARCHAR     | Bcrypt hashed    |
| createdAt | DATETIME    | Auto generated   |
| updatedAt | DATETIME    | Auto generated   |

### Tasks Table

| Column      | Type         | Description             |
| ----------- | ------------ | ----------------------- |
| id          | INT (PK)     | Auto increment          |
| title       | VARCHAR(100) | Task title              |
| description | TEXT         | Task description        |
| priority    | ENUM         | Low, Medium, High       |
| stage       | ENUM         | Todo, In Progress, Done |
| userId      | INT (FK)     | References users.id     |
| createdAt   | DATETIME     | Auto generated          |
| updatedAt   | DATETIME     | Auto generated          |

---

## 🔌 API Documentation

### Auth Routes

| Method | Endpoint           | Description       | Access  |
| ------ | ------------------ | ----------------- | ------- |
| POST   | /api/auth/register | Register new user | Public  |
| POST   | /api/auth/login    | Login user        | Public  |
| GET    | /api/auth/me       | Get current user  | Private |

### Task Routes

| Method | Endpoint             | Description        | Access  |
| ------ | -------------------- | ------------------ | ------- |
| GET    | /api/tasks           | Get all user tasks | Private |
| POST   | /api/tasks           | Create new task    | Private |
| PUT    | /api/tasks/:id       | Update task        | Private |
| DELETE | /api/tasks/:id       | Delete task        | Private |
| PATCH  | /api/tasks/:id/stage | Update task stage  | Private |

### Request/Response Examples

#### Register

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}

Response:
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Login

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "123456"
}

Response:
{
  "success": true,
  "message": "Logged in successfully.",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Create Task

```json
POST /api/tasks
Authorization: Bearer <token>
{
  "title": "Build login page",
  "description": "Create responsive login UI",
  "priority": "High",
  "stage": "Todo"
}

Response:
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "task": {
      "id": 1,
      "title": "Build login page",
      "description": "Create responsive login UI",
      "priority": "High",
      "stage": "Todo",
      "userId": 1,
      "createdAt": "2026-05-30T00:00:00.000Z"
    }
  }
}
```

#### Update Task Stage

```json
PATCH /api/tasks/1/stage
Authorization: Bearer <token>
{
  "stage": "In Progress"
}

Response:
{
  "success": true,
  "message": "Task stage updated successfully.",
  "data": { "task": { ... } }
}
```

---

## ⚙️ Local Setup Instructions

### Prerequisites

- Node.js v18+
- MySQL installed and running
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/bakliwalkshitiz/task-manager.git
cd task-manager
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=task_manager
DB_USER=root
DB_PASS=yourpassword
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Create MySQL database:

```sql
CREATE DATABASE task_manager;
```

Start backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

### 4. Open Browser

http://localhost:5173

---

## 🔐 Environment Variables

### Backend `.env`

| Variable       | Description              |
| -------------- | ------------------------ |
| NODE_ENV       | development / production |
| PORT           | Server port (5000)       |
| DB_HOST        | MySQL host               |
| DB_PORT        | MySQL port (3306)        |
| DB_NAME        | Database name            |
| DB_USER        | MySQL username           |
| DB_PASS        | MySQL password           |
| JWT_SECRET     | Secret key for JWT       |
| JWT_EXPIRES_IN | Token expiry (7d)        |
| CLIENT_URL     | Frontend URL             |

### Frontend `.env`

| Variable     | Description     |
| ------------ | --------------- |
| VITE_API_URL | Backend API URL |

---

## 🚀 Deployment Guide

### Frontend — Vercel

Push code to GitHub
Go to vercel.com → New Project
Import your GitHub repository
Set Root Directory → frontend
Add Environment Variable:
VITE_API_URL = https://your-backend.onrender.com/api
Click Deploy

### Backend — Render

Go to render.com → New Web Service
Connect your GitHub repository
Set Root Directory → backend
Build Command → npm install
Start Command → node server.js
Add Environment Variables:
NODE_ENV = production
PORT = 5000
DB_HOST = your_mysql_host
DB_PORT = 3306
DB_NAME = task_manager
DB_USER = your_mysql_user
DB_PASS = your_mysql_password
JWT_SECRET = your_secret_key
JWT_EXPIRES_IN = 7d
CLIENT_URL = https://your-app.vercel.app
Click Deploy

### Database — Railway

Go to railway.app
New Project → MySQL
Copy connection credentials
Update backend environment variables on Render

---

## 💡 Assumptions

1. Each user can only see and manage their own tasks
2. Tasks are sorted by creation date (newest first)
3. Password minimum length is 6 characters
4. Task title is required, description is optional
5. Default priority is Medium, default stage is Todo
6. JWT token expires in 7 days
7. One user account per email address
8. Tasks are permanently deleted (no soft delete)

---

## ⚖️ Tradeoffs

| Decision                  | Reason                                                                      |
| ------------------------- | --------------------------------------------------------------------------- |
| MySQL over MongoDB        | Better relational structure for user-task relationships and data integrity  |
| Sequelize ORM             | Cleaner code, auto table creation, built-in validation                      |
| JWT in localStorage       | Simpler implementation; httpOnly cookies would be more secure in production |
| Client-side search/filter | Faster UX without extra API calls for small datasets                        |
| Optimistic UI updates     | Better drag-and-drop experience, automatically reverts on API failure       |
| Tailwind CSS              | Faster styling, no context switching, consistent design system              |
| Vite over CRA             | Faster builds, better developer experience                                  |

---

## 🔮 Future Improvements

1. Due dates and deadline reminders for tasks
2. Task comments and activity log
3. Team collaboration and task sharing
4. Email notifications for task updates
5. Dark mode support
6. Mobile app using React Native
7. File attachments on tasks
8. Analytics and productivity dashboard
9. Recurring tasks
10. Export tasks to CSV or PDF

---

## 📝 Note on AI Usage

As per the assignment requirements — since AI tools (Claude) were used during development, the backend implementation has been completed with:

- Custom REST APIs (Express.js)
- MySQL database integration (Sequelize ORM)
- JWT authentication with bcrypt password hashing
- Full CRUD operations for tasks
- Input validation and error handling
- Security middleware (Helmet, Rate Limiting, CORS)

---

## 👨‍💻 Author

**Kshitiz Bakliwal**

- GitHub: [@bakliwalkshitiz](https://github.com/bakliwalkshitiz)

---

_Built with ❤️ for INDPRO Internship Assessment_
