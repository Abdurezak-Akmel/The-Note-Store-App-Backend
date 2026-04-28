# The Note Store API - Backend

A robust RESTful API built with Node.js, Express, and PostgreSQL, designed to power the Note Store application. This backend handles user authentication, note management, and administrative tasks with secure practices.

## 🚀 Features

- **User Authentication**: Secure signup and login using JWT (JSON Web Tokens).
- **Note Management**: CRUD operations for user notes.
- **Role-Based Access**: Support for administrative roles and permissions.
- **Admin Seeding**: Automatically creates an admin account on the first run.
- **Security**: Password hashing with Bcrypt and CORS protection.
- **Error Handling**: Centralized error handling middleware.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Encryption**: Bcrypt
- **Development**: Nodemon, Dotenv

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- npm (Node Package Manager)

## ⚙️ Configuration

1.  **Clone the repository**:
    ```bash
    git clone <https://github.com/Abdurezak-Akmel/The-Note-Store-App-Backend.git>
    cd backend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory and add the following configurations:

    ```env
    PORT=3000
    
    # Database Configuration
    PGHOST=localhost
    PGUSER=your_db_user
    PGPASSWORD=your_db_password
    PGDATABASE=your_db_name
    PGPORT=5432
    
    # Admin Seeding
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=your_secure_password
    ADMIN_ROLE=ADMIN
    
    # JWT Configuration
    JWT_SECRET=your_super_secret_key
    ```

## 🚀 Running the App

### Development Mode
Runs the server with `nodemon` for automatic restarts on file changes:
```bash
npm run dev
```

### Production Mode
Starts the server normally:
```bash
npm start
```

The server will be available at `http://localhost:3000` (or your configured `PORT`).

## 🛣️ API Endpoints

### Auth Routes (`/api/v1/auth`)
- `POST /login` - User login
- `POST /register` - User registration

### User Routes (`/api/v1/users`)
- `GET /` - List users (Admin only)
- `GET /profile` - Get current user profile

### Note Routes (`/api/v1/notes`)
- `GET /` - Fetch all notes for the logged-in user
- `POST /` - Create a new note
- `PUT /:id` - Update an existing note
- `DELETE /:id` - Delete a note

## 📂 Project Structure

```text
backend/
├── db/              # Database migration or schema files
├── src/
│   ├── config/      # Configuration files (DB, etc.)
│   ├── controllers/ # Request handlers
│   ├── middlewares/ # Express middlewares (Auth, Error)
│   ├── models/      # Database queries/models
│   ├── routes/      # API route definitions
│   ├── utils/       # Utility functions
│   └── app.js       # Main application entry point
├── .env             # Environment variables
└── package.json     # Project dependencies and scripts
```

## 🛡️ Security

- **JWT**: Stateless authentication for secure client-server communication.
- **Bcrypt**: Industrial-strength hashing for user passwords.
- **CORS**: Configured to prevent unauthorized cross-origin requests.

---

Built by [Abdurezak Akmel](https://github.com/Abdurezak-Akmel)
