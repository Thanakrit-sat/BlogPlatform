# Blog Platform

A full-stack blogging application built with React on the frontend and Spring Boot on the backend, backed by a PostgreSQL database. Users can register, write posts, comment, like, and share content through a clean editorial interface with dark mode support.

---

## Features

- User registration and authentication via JWT
- Create, read, update, and delete blog posts
- Comment system on individual posts
- Like and unlike posts with real-time count
- Share post URL to clipboard
- Sidebar navigation with dark and light mode toggle
- Protected routes — write and manage content only when signed in
- Responsive layout that stacks on mobile screens

---

## Tech Stack

**Frontend**
- React 18 (via Vite)
- React Router v6
- Axios with JWT request interceptor
- Plain CSS with CSS custom properties for theming

**Backend**
- Java 17
- Spring Boot 3
- Spring Security with stateless JWT authentication
- Spring Data JPA with Hibernate
- Maven

**Database**
- PostgreSQL 15+

---

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- Maven 3.8 or higher
- PostgreSQL 15 or higher

---

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:Thanakrit-sat/blog-platform.git
cd blog-platform
```

### 2. Set up the database

Open pgAdmin or psql and run the following:

```sql
CREATE DATABASE blog_db;
CREATE USER blog_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE blog_db TO blog_user;
GRANT ALL ON SCHEMA public TO blog_user;
```

### 3. Configure the backend

Copy the example config and fill in your values:

```bash
cd backend/src/main/resources
cp application-local.properties.example application-local.properties
```

Open `application-local.properties` and set:

```properties
DB_USERNAME=blog_user
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
```

### 5. Run the application

Open two terminal windows.

**Terminal 1 — Backend:**
```bash
cd backend
mvn spring-boot:run
```

The server starts at `http://localhost:8080`. Hibernate will create all database tables automatically on first run.

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

The application is available at `http://localhost:5173`.

---

## API Endpoints

All write operations require a Bearer token in the `Authorization` header obtained from `/api/auth/login`.

**Authentication**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT token |

**Posts**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/posts` | No | List all posts |
| GET | `/api/posts/{id}` | No | Get a single post |
| POST | `/api/posts` | Yes | Create a post |
| PUT | `/api/posts/{id}` | Yes | Update a post (owner only) |
| DELETE | `/api/posts/{id}` | Yes | Delete a post (owner only) |

**Comments**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/posts/{id}/comments` | No | List comments on a post |
| POST | `/api/posts/{id}/comments` | Yes | Add a comment |
| DELETE | `/api/posts/comments/{commentId}` | Yes | Delete a comment (owner only) |

**Likes and Sharing**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/posts/{id}/like` | Yes | Toggle like or unlike |
| GET | `/api/posts/{id}/share` | No | Get shareable URL |

---

## Environment Variables

**Backend** — set in `application-local.properties`

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_USERNAME` | Yes | PostgreSQL username |
| `DB_PASSWORD` | Yes | PostgreSQL password |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens (min 32 characters) |

---

## Security Notes

- Passwords are hashed with BCrypt before being stored. Plain text passwords are never persisted.
- JWT tokens expire after 7 days.
- The API key and database credentials are stored in `application-local.properties` which is excluded from version control via `.gitignore`.
- All mutating operations verify that the authenticated user is the owner of the resource before proceeding.
- CORS is configured to allow requests from `http://localhost:5173` only. Update `SecurityConfig.java` before deploying to production.

---