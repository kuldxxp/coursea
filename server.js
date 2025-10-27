import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';

import userRouter from './routes/userRouter.js';
import coursesRouter from './routes/coursesRouter.js';
import adminRouter from './routes/adminRouter.js';
import authRouter from './routes/authRouter.js';
import { webhookLimiter } from './middlewares/rateLimit.js';
import { razorpayWebhookHandler } from './routes/handlers/razorpayWebhookHandler.js';

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
    } catch (err) {
        console.error(`Failed to connect to db: ${err}`);
        process.exit(1);
    }
})();

const app = express();

app.post(
    '/user/payments/webhook',
    webhookLimiter,
    express.raw({ type: 'application/json' }),
    razorpayWebhookHandler
);

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(
    session({
        name: 'sid',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGO_URI,
            ttl: 60 * 60 * 24 * 7,
        }),
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7, 
        },
    })
);

import './passport/ppix.js';

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/user', userRouter);

app.use('/api/v1/courses', coursesRouter);

app.use('/api/v1/admin', adminRouter);

app.use('/auth/google', authRouter);

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
