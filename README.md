# Authentication API Documentation

## 📌 Overview

This API provides a robust authentication system using JWT (JSON Web Tokens) with access and refresh tokens. Users can log in from multiple devices, and each session is tracked securely. The system offers features like account registration, sign-in, session management, and session revocation.

## 🚀 Authentication Flow

### 1. **Sign Up** (`POST /auth/signup`)

Users create an account with an email and password.

### 2. **Sign In** (`POST /auth/signin`)

-  Users authenticate and receive an **Access Token** and a **Refresh Token**.
-  The **Refresh Token** is stored securely in an **HTTP-only cookie**.

### 3. **Refresh Token** (`POST /auth/refresh`)

-  Generates a new **Access Token** using the **Refresh Token**.
-  If the **Refresh Token** expires in **less than an hour**, a new refresh token is issued.

### 4. **Sign Out** (`POST /auth/logout`)

-  Deletes the **Refresh Token** from the database and invalidates the session.
-  Removes the **Refresh Token** cookie.

### 5. **Get Current User** (`GET /auth/me`)

-  Retrieves the authenticated user's profile based on the **Access Token**.

### 6. **Manage Sessions** (`GET /auth/sessions`)

-  Lists all active sessions for the authenticated user.

### 7. **Revoke a Specific Session** (`POST /auth/revoke-session`)

-  Allows users to revoke a session from a specific device.

### 8. **Change Password** (`PATCH /auth/change-password`)

-  Allows users to update their password.

---

## 🔗 API Endpoints

| Method | Endpoint                | Description                          | Required Headers                                                       |
| ------ | ----------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| `POST` | `/auth/signup`          | Register a new user                  | None                                                                   |
| `POST` | `/auth/signin`          | Log in and receive tokens            | None                                                                   |
| `POST` | `/auth/refresh`         | Get a new **Access Token**           | `Authorization: Bearer <access_token>`                                 |
| `POST` | `/auth/logout`          | Log out and revoke tokens            | `Authorization: Bearer <access_token>` <br> `X-Device-ID: <device_id>` |
| `GET`  | `/auth/me`              | Get the authenticated user's profile | `Authorization: Bearer <access_token>` <br> `X-Device-ID: <device_id>` |
| `GET`  | `/auth/sessions`        | Get active user sessions             | `Authorization: Bearer <access_token>` <br> `X-Device-ID: <device_id>` |
| `POST` | `/auth/revoke-session`  | Revoke a session from a device       | `Authorization: Bearer <access_token>` <br> `X-Device-ID: <device_id>` |
| `PATCH` | `/auth/change-password` | Update user password                 | `Authorization: Bearer <access_token>` <br> `X-Device-ID: <device_id>` |

---

## 🔒 Protected Routes

### **Authorization**

To access protected routes, you must include the following headers:

1. **Authorization Header**

   -  Format: `Authorization: Bearer <access_token>`
   -  The **Access Token** obtained during the sign-in process.

2. **Device Header**
   -  Format: `X-Device-ID: <device_id>`
   -  The **device_id** is a unique identifier for the user's device, which can be generated when the device is first used (for example, through a device fingerprint or unique ID).

### **Routes requiring both Access Token and Device ID in headers**

The following routes require both the **Access Token** in the `Authorization` header and the **Device ID** in the `X-Device-ID` header:

-  `GET /auth/me`
-  `POST /auth/refresh`
-  `POST /auth/revoke-session`
-  `GET /auth/sessions`
-  `POST /auth/logout`
-  `POST /auth/change-password`

---

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

---

## 🔄 Relationships

-  A **user** can have multiple **sessions**.
-  A **session** belongs to a **device**.
-  A **user** can log in from multiple **devices**.
-  A **device** can be used by multiple **users**.
-  A **session** is linked to a **refresh token**.
-  A **refresh token** is linked to a specific **user** and **device**.

---

## 🛠️ Technologies Used

-  **Hono**: Fast, small, and modern web framework for the Edge
-  **Drizzle ORM**: TypeScript ORM for SQLite & PostgreSQL
-  **SQLite**: Lightweight database engine
-  **Argon2**: Secure password hashing algorithm
-  **Fast-JWT**: High-performance JWT handling
-  **Day.js**: Date and time manipulation
-  **Zod**: Schema validation for TypeScript
-  **Nanoid**: Unique ID generation
-  **Dotenv**: Environment variable management

---

## 🔒 Security Considerations

-  ✅ **HTTP-only Secure Cookies**: Refresh tokens are stored securely to prevent XSS attacks.
-  ✅ **JWT Expiration Policies**: Access tokens have short lifetimes, refresh tokens are rotated when close to expiration.
-  ✅ **Session Management**: Users can revoke sessions manually.
-  ✅ **Brute-force Protection**: Implement login attempt limits.
-  ✅ **Password Hashing**: Store passwords securely using bcrypt.

---

## 📊 Database Diagram

![Authentication System Database Model](/models.svg)

This diagram represents the relationships between the **Users**, **Devices**, **Sessions**, and **Tokens** in the authentication system. You can modify and expand it based on your application's needs.
