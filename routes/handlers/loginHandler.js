import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { UserModel } from "../../db/schema.js";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'dev_secret';

export const loginHandler = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username }).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Incorrect credentials.' });
        }

        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
            return res.status(401).json({ error: 'Incorrect credentials.' });
        }

        const payload = { id: user._id.toString() };
        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '7d' });

        res.status(200).json({
            message: 'You are logged in.',
            token
        });
    } catch (err) {
        console.error(`Error logging in: ${err}`);

        return res.status(500).json({ error: 'Failed to login.' });
    }
} 
