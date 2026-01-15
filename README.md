# 📋 Admin Discord Task Management System - Backend

A robust, scalable **task management REST API** built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.  
Designed for efficient task tracking, user management, category organization, and automated Discord notifications. Perfect for teams seeking a reliable backend solution for collaborative task management with real-time notifications.

---

## 🚀 Overview

**Admin Discord Task Management System Backend** is a comprehensive RESTful API that powers a complete task management ecosystem. This backend handles everything from user authentication to automated Discord notifications, making team coordination seamless and efficient.

**Key Capabilities:**

- Secure user authentication with JWT tokens
- Full CRUD operations for tasks, users, and categories
- Automated Discord webhook notifications for task reminders
- Task completion tracking and recurring task management
- Priority-based task organization
- Rate limiting and request validation
- Background job processing with Bull queues
- Scheduled cron jobs for automated task notifications

---

## 🛠️ Technologies Used

### Core Technologies

- **Node.js & Express** – High-performance server and routing
- **TypeScript** – Type-safe development with enhanced IDE support
- **MongoDB & Mongoose** – Flexible NoSQL database with ODM
- **Redis & Bull** – Queue management for background jobs
- **JWT** – Secure authentication and authorization

### Key Libraries

- **Zod** – Runtime type validation and schema parsing
- **Axios** – HTTP client for Discord webhook integration
- **Node-cron** – Scheduled task execution
- **bcryptjs** – Secure password hashing
- **Morgan** – HTTP request logging
- **Compression** – Response compression middleware

---

## ✨ Key Features

- ✅ **JWT Authentication** – Secure user login and token-based sessions
- 📝 **Task Management** – Create, read, update, and delete tasks with comprehensive details
- 👥 **User Management** – Admin controls for managing system users
- 🗂️ **Category Organization** – Organize tasks into custom categories
- 🔔 **Discord Integration** – Automated webhook notifications for task reminders
- 🔁 **Recurring Tasks** – Daily, weekly, and monthly task repetition
- 🎯 **Priority Levels** – Color-coded task priorities (Easy, Medium, Hard)
- ⏰ **Scheduled Notifications** – Cron jobs for automated task reminders
- 🔐 **Rate Limiting** – API protection against abuse
- ✔️ **Input Validation** – Zod-powered request validation
- 📊 **Error Handling** – Comprehensive custom error classes
- 🚀 **Background Jobs** – Bull queue for asynchronous task processing

---

## 📥 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Redis (for queue management)
- npm or yarn

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/iyanubruce/Admin-Discord-Task-Management-System-Backend.git
cd Admin-Discord-Task-Management-System-Backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Application
APP_NAME=Discord Task Manager
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:5000

# Database
MONGODB_URI=your_mongodb_connection_string
DB_SELECTION_TIMEOUT=30000
DB_SOCKET_TIMEOUT=45000
DB_MAX_POOL_SIZE=10
DB_MIN_POOL_SIZE=2

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=3600

# Discord Webhooks
DISCORD_WEBHOOK_REMINDER=your_discord_reminder_webhook_url
DISCORD_WEBHOOK_COMPLETE=your_discord_complete_webhook_url
DISCORD_WEBHOOK_DELETE=your_discord_delete_webhook_url

# Cron Jobs
CRON_DAILY_CHECK=0 9 * * *
CRON_SIX_HOURLY=0 */6 * * *

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Timezone
TIMEZONE=Asia/Kolkata
```

4. **Build the project**

```bash
npm run build
```

5. **Seed the database (optional)**

```bash
npm run seed
```

6. **Start the server**

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` 🎉

---

## 📂 Project Structure

```plaintext
Admin-Discord-Task-Management-System-Backend/
├── src/                          # TypeScript source code
│   ├── api/
│   │   ├── middlewares/          # Custom middleware (auth, validation, rate limiting)
│   │   ├── request-handlers/     # Route handlers for API endpoints
│   │   └── v1/                   # API v1 routes
│   ├── config/
│   │   ├── database.ts           # MongoDB connection setup
│   │   └── env.ts                # Environment configuration
│   ├── controllers/              # Business logic layer
│   │   ├── admin.ts
│   │   ├── categories.ts
│   │   ├── tasks.ts
│   │   └── users.ts
│   ├── cron/
│   │   ├── index.ts              # Cron job initialization
│   │   └── tasks/                # Scheduled task definitions
│   ├── database/
│   │   ├── models/               # Mongoose schemas and models
│   │   ├── repositories/         # Data access layer
│   │   └── seeds/                # Database seeding scripts
│   ├── errors/                   # Custom error classes
│   │   ├── badRequestError.ts
│   │   ├── notAuthenticatedError.ts
│   │   ├── resourceNotFoundError.ts
│   │   └── ...                   # Other error types
│   ├── helpers/
│   │   ├── discord-notifications.ts  # Discord webhook integration
│   │   ├── jwt.ts                    # JWT token utilities
│   │   └── utilities.ts              # General helper functions
│   ├── queues/
│   │   └── notification-queue.ts     # Bull queue for notifications
│   ├── scripts/                  # Utility scripts
│   ├── utils/
│   │   ├── logger.ts             # Logging utility
│   │   ├── redis.ts              # Redis client setup
│   │   └── response.ts           # Standardized API responses
│   ├── validations/              # Zod validation schemas
│   │   ├── admin.ts
│   │   ├── categories.ts
│   │   ├── tasks.ts
│   │   └── users.ts
│   ├── app.ts                    # Express app configuration
│   └── server.ts                 # Server entry point
├── build/                        # Compiled JavaScript output (generated)
├── logs/                         # Application logs
├── node_modules/                 # Dependencies
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## 🔌 API Endpoints

### Authentication

- `POST /api/v1/admin/login` – Admin login with JWT token

### Users

- `GET /api/v1/users` – Get all users
- `POST /api/v1/users` – Create a new user
- `GET /api/v1/users/:id` – Get user by ID
- `PUT /api/v1/users/:id` – Update user
- `DELETE /api/v1/users/:id` – Delete user

### Categories

- `GET /api/v1/categories` – Get all categories
- `POST /api/v1/categories` – Create a new category
- `PUT /api/v1/categories/:id` – Update category
- `DELETE /api/v1/categories/:id` – Delete category

### Tasks

- `GET /api/v1/tasks` – Get all tasks
- `POST /api/v1/tasks` – Create a new task
- `GET /api/v1/tasks/:id` – Get task by ID
- `PUT /api/v1/tasks/:id` – Update task
- `DELETE /api/v1/tasks/:id` – Delete task
- `PATCH /api/v1/tasks/:id/complete` – Mark task as complete

---

## 🔔 Discord Integration

The system sends automated Discord notifications for:

- **Task Reminders** – Scheduled notifications for upcoming tasks
- **Task Completion** – Alerts when tasks are marked complete
- **Task Deletion** – Notifications when tasks are deleted

Notifications are sent via Discord webhooks with embedded messages including:

- Color-coded by priority
- Task details (name, due date, category)
- User mentions via Discord ID
- Automatic repeat tracking for recurring tasks

---

## ⚙️ Scheduled Jobs

### Cron Jobs

- **Daily Notification Check** – Runs at 9 AM IST daily
- **Six-Hourly Check** – Runs every 6 hours

These jobs scan for tasks due for notification and dispatch Discord webhooks automatically.

---

## 🎯 Key Features Explained

### JWT Authentication

Secure token-based authentication with configurable expiration. Middleware validates tokens on protected routes.

### Rate Limiting

API endpoints are protected with rate limiters to prevent abuse and ensure fair usage.

### Input Validation

All incoming requests are validated using Zod schemas, ensuring type safety and data integrity.

### Error Handling

Comprehensive custom error classes provide detailed error messages and appropriate HTTP status codes:

- `BadRequestError` (400)
- `NotAuthenticatedError` (401)
- `NotAuthorizedError` (403)
- `ResourceNotFoundError` (404)
- `ConflictError` (409)
- `InternalServerError` (500)

### Background Job Processing

Bull queues handle asynchronous tasks like sending Discord notifications without blocking the main thread.

---

## 📝 Available Scripts

- `npm start` – Start the production server
- `npm run dev` – Start development server with hot reload
- `npm run build` – Compile TypeScript to JavaScript
- `npm run seed` – Seed the database with initial data
- `npm test` – Run tests with Jest

---

## 🗄️ Database Structure

### Collections

- **Users** – User details with Discord IDs
- **Categories** – Task categories (including system categories)
- **Tasks** – Comprehensive task information with status tracking

### Special Categories

- **Completed Tasks** – Non-deletable system category
- **Deleted Tasks** – Non-deletable system category

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to your branch: `git push origin feature/YourFeature`
5. Open a pull request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Iyanuoluwa Ikechukwu Taiwo**  
🔗 [GitHub Profile](https://github.com/iyanubruce)  
💼 Connect on [LinkedIn](https://www.linkedin.com/in/iyanuoluwa-taiwo)  
📧 Contact: [iyanubruce@example.com](mailto:iyanubruce@example.com)

---

## 🌟 Acknowledgments

Built with ❤️ for efficient task management and seamless team coordination.

---

**Note**: This is the backend API. Pair it with the frontend application for a complete task management solution with a beautiful UI and drag-and-drop functionality.
