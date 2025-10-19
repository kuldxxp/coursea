import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { userRouter } from './routes/userRouter.js';
import { coursesRouter } from './routes/coursesRouter.js';
import { adminRouter } from './routes/adminRouter.js';

dotenv.config();

PORT = process.env.PORT || 8000;
SALT_ROUNDS = process.env.SALT_ROUNDS || 12;
MONGO_URI = process.env.MONGO_URI;

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
    } catch (err) {
        console.error(`Failed to connect to db: ${err}`);
        process.exit(1);
    }
})();

const app = express();

app.use(express.json());

app.use('/user', userRouter);

app.use('/courses', coursesRouter);

app.use('/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});