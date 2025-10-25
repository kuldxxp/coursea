# Coursea

Coursea is a Bun.js and Express-based platform for managing and selling online courses.  
It supports user and admin roles, secure session-based authentication with Passport.js, Google OAuth login, and Razorpay integration for handling course payments.

---

## Overview

Coursea allows users to browse, preview, and purchase courses, while admins can create, update, and manage course content.  
The project uses cookie-based authentication (via express-session and connect-mongo), Zod for validation, and Razorpay for payment and enrollment management.

---

## Features

### User
- Sign up, log in, and log out
- Google OAuth login via Passport
- Browse and preview all courses
- Purchase courses through Razorpay
- View purchased courses and lessons
- Change or reset passwords

### Admin
- Log in with email and password
- Create, update, and delete courses
- Manage lessons and course details
- Grant admin privileges to users

### General
- Session-based authentication with cookies
- Input validation using Zod
- MongoDB persistence through Mongoose
- Secure password hashing with bcrypt
- Password reset via Nodemailer

---

## Tech Stack

**Backend:** Bun.js, Express.js  
**Database:** MongoDB (Mongoose)  
**Auth:** Passport.js (Local & Google OAuth 2.0), express-session, connect-mongo, cookie-parser  
**Payments:** Razorpay Orders + Webhooks  
**Validation:** Zod  
**Mail:** Nodemailer  
**Utilities:** bcrypt, dotenv

---

## Directory Structure

```
.
├── db/
│   ├── schema.js
│   └── seed.js
├── middlewares/
│   ├── auth.js
│   ├── isAdmin.js
│   ├── tryAuth.js
│   └── requireAuthOrRemember.js
├── routes/
│   ├── adminRouter.js
│   ├── coursesRouter.js
│   ├── userRouter.js
|   ├── authRouter.js
│   └── handlers/
│       ├── createCourseHandler.js
│       ├── deleteCourseHandler.js
│       ├── getCourseByIdHandler.js
│       ├── listCoursesHandler.js
│       ├── previewCoursesHandler.js
│       ├── previewCourseDetailHandler.js
│       ├── signupHandler.js
│       ├── loginHandler.js
│       ├── forgotPasswordHandler.js
│       ├── changePasswordHandler.js
│       ├── makeAdminHandler.js
│       ├── updateCourseHandler.js
│       └── updateCourseStatusHandler.js
├── validation/
│   ├── schemas.ts
│   ├── adminCoursesSchemas.ts
│   └── validate.js
├── passport/
│   └── index.js
├── lib/
│   └── razorpay.js
├── server.js
├── package.json
```

---

## Setup and Installation

### 1. Clone the repository
```bash
git clone https://github.com/kuldxxp/coursea.git
cd coursea
```

### 2. Install dependencies
```bash
bun install
# or
npm install
```

### 3. Configure environment variables  
Create a `.env` file at the root and define the variables listed below.

### 4. Start the server
```bash
bun dev
# or
npm run dev
```

Server will start at [http://localhost:8000](http://localhost:8000).

---

## Environment Variables

```
# General
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster-url/coursea
SESSION_SECRET=supersecret
SALT_ROUNDS=12
CLIENT_URL=http://localhost:3000

# JWT (for password reset only)
JWT_SECRET_KEY=dev_secret

# Admin seed
ADMIN_EMAIL=admin@coursea.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123

# Gmail credentials
GMAIL=youremail@gmail.com
PASS=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=<client_id>
GOOGLE_CLIENT_SECRET=<client_secret>
GOOGLE_CALLBACK_URL=http://localhost:8000/user/auth/google/callback

# Razorpay
RAZORPAY_KEY_ID=<key_id>
RAZORPAY_KEY_SECRET=<key_secret>
RAZORPAY_WEBHOOK_SECRET=<webhook_secret>
CURRENCY=INR
```

---

## Database Seeding

To create the initial admin account:
```bash
bun run db/seed.js
# or
node db/seed.js
```

The script checks if an admin exists; if not, it creates one using the credentials in `.env`.

---

## Authentication Flow

1. **Local Login**
   - Passport Local validates credentials and establishes a session.
   - Session ID is stored in a cookie (`sid`).

2. **Google OAuth**
   - User logs in via Google.
   - If new, a user is created automatically.
   - Session cookie is created for subsequent requests.

3. **Forgot/Reset Password**
   - Nodemailer sends a temporary JWT reset link.
   - The user sets a new password via `/reset-password/:token`.

4. **Change Password**
   - Logged-in users can update their password directly from the dashboard.

---

## Razorpay Payment Flow

1. User clicks "Buy" on a course.
2. If not logged in:
   - `requireAuthOrRemember` stores `req.session.returnTo` and returns a redirect path.
3. After login:
   - `POST /courses/:courseId/checkout` creates a Razorpay order.
   - Razorpay Checkout opens on the frontend.
4. On successful payment:
   - Client calls `POST /user/payments/verify` with payment details.
   - Server verifies the signature and creates an enrollment.
5. Razorpay also triggers `/user/payments/webhook` for redundancy.

---

## Scripts

| Command | Description |
|----------|-------------|
| `bun dev` / `npm run dev` | Run development server |
| `bun start` / `npm start` | Run in production mode |
| `bun run db/seed.js` | Seed initial admin user |
| `bun install` | Install dependencies |

---

## License

This project is licensed under the MIT License.

