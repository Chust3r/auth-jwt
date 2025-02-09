# Authentication API Documentation

## 📌 Overview

This API provides a robust authentication system using JWT (JSON Web Tokens) with access and refresh tokens. Users can log in from multiple devices, and each session is tracked securely.

## 🚀 Authentication Flow

1. **Sign Up (`POST /auth/signup`)**
   -  Users create an account with an email and password.
2. **Sign In (`POST /auth/signin`)**

   -  Users authenticate and receive an access token and a refresh token.
   -  The refresh token is stored in an **HTTP-only secure cookie**.

3. **Refresh Token (`POST /auth/refresh`)**

   -  Generates a new access token using the refresh token.
   -  If the refresh token expires in **less than an hour**, a new refresh token is issued.

4. **Sign Out (`POST /auth/logout`)**

   -  Deletes the refresh token from the database and invalidates the session.
   -  Removes the refresh token cookie.

5. **Get Current User (`GET /auth/me`)**

   -  Retrieves the authenticated user's profile based on the access token.

6. **Manage Sessions (`GET /auth/sessions`)**

   -  Lists all active sessions for the authenticated user.

7. **Revoke a Specific Session (`POST /auth/revoke-session`)**

   -  Allows users to revoke a session from a specific device.

8. **Change Password (`POST /auth/change-password`)**

   -  Allows users to update their password.

9. **Forgot Password (`POST /auth/forgot-password`)**

   -  Sends a password reset link via email.

10.   **Reset Password (`POST /auth/reset-password`)**

      -  Resets the user's password using a secure token.

11.   **Delete Account (`DELETE /auth/delete-account`)**
      -  Permanently removes the user's account and all associated sessions.

## 🔗 API Endpoints

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/auth/signup`          | Register a new user         |
| POST   | `/auth/signin`          | Log in and get tokens       |
| POST   | `/auth/refresh`         | Get a new access token      |
| POST   | `/auth/logout`          | Log out and revoke tokens   |
| GET    | `/auth/me`              | Get the authenticated user  |
| GET    | `/auth/sessions`        | Get active user sessions    |
| POST   | `/auth/revoke-session`  | Revoke a session            |
| POST   | `/auth/change-password` | Update user password        |
| POST   | `/auth/forgot-password` | Request password reset      |
| POST   | `/auth/reset-password`  | Reset password with a token |
| DELETE | `/auth/delete-account`  | Delete user account         |

## 🗄️ Database Models

### **Users**

| Field       | Type   | Description           |
| ----------- | ------ | --------------------- |
| `id`        | UUID   | Unique user ID        |
| `email`     | String | User email (unique)   |
| `password`  | String | Hashed password       |
| `createdAt` | Date   | Account creation date |
| `updatedAt` | Date   | Last update date      |

### **Devices**

| Field        | Type   | Description                     |
| ------------ | ------ | ------------------------------- |
| `id`         | UUID   | Unique device ID                |
| `device_id`  | String | Device identifier (fingerprint) |
| `createdAt`  | Date   | First time used                 |
| `lastUsedAt` | Date   | Last time used                  |

### **Sessions**

| Field        | Type | Description                |
| ------------ | ---- | -------------------------- |
| `id`         | UUID | Unique session ID          |
| `user_id`    | UUID | Reference to `users.id`    |
| `device_id`  | UUID | Reference to `devices.id`  |
| `createdAt`  | Date | Session creation timestamp |
| `lastUsedAt` | Date | Last active timestamp      |

### **Tokens**

| Field       | Type   | Description               |
| ----------- | ------ | ------------------------- |
| `id`        | UUID   | Unique token ID           |
| `user_id`   | UUID   | Reference to `users.id`   |
| `device_id` | UUID   | Reference to `devices.id` |
| `value`     | String | Refresh token value       |
| `createdAt` | Date   | Token creation timestamp  |
| `updatedAt` | Date   | Last time updated         |

## 🔄 Relationships

-  A **user** can have multiple **sessions**.
-  A **session** belongs to a **device**.
-  A **user** can log in from multiple **devices**.
-  A **device** can be used by multiple **users**.
-  A **session** is linked to a **refresh token**.
-  A **refresh token** is linked to a specific **user** and **device**.

## 🛠️ Technologies Used

-  **Hono** (Fast, small, and modern web framework for the Edge)
-  **Drizzle ORM** (TypeScript ORM for SQLite & PostgreSQL)
-  **SQLite** (Lightweight database engine)
-  **Argon2** (Secure password hashing algorithm)
-  **Fast-JWT** (High-performance JWT handling)
-  **Day.js** (Date and time manipulation)
-  **Zod** (Schema validation for TypeScript)
-  **Nanoid** (Unique ID generation)
-  **Dotenv** (Environment variable management)

## 🔒 Security Considerations

✅ **HTTP-only Secure Cookies** → Refresh tokens are stored securely to prevent XSS attacks.  
✅ **JWT Expiration Policies** → Access tokens have short lifetimes, refresh tokens are rotated when close to expiration.  
✅ **Session Management** → Users can revoke sessions manually.  
✅ **Brute-force Protection** → Implement login attempt limits.  
✅ **Password Hashing** → Store passwords securely using bcrypt.
