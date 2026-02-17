import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import { UserModel } from '../../db/schema.js';

dotenv.config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? '12', 10);

export const sendSignupOtp = async (req, res) => {
    const { name, username, emailId, password } = req.body;

    try {
        let user = await UserModel.findOne({ emailId }).select('+otpHash');

        if (user && user.emailVerified) {
            return res.status(409).json({ error: 'Email already registered and verified' });
        }

        if (!user) {
            const existingUsername = await UserModel.findOne({ username });
            if (existingUsername) {
                return res.status(409).json({ error: 'Username already taken' });
            }

            const hash = await bcrypt.hash(password, SALT_ROUNDS);

            user = await UserModel.create({
                name, username, emailId,
                password: hash,
                emailVerified: false,
            });
        } else {
            if (password) {
                user.password = await bcrypt.hash(password, SALT_ROUNDS);
            }
        }

        const n = crypto.randomInt(0, 1_000_000);
        const code = String(n).padStart(6, '0');

        user.otpHash = await bcrypt.hash(code, SALT_ROUNDS);
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        user.otpAttempts = 0;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.GMAIL, pass: process.env.PASS },
        });

        await transporter.sendMail({
            from: process.env.GMAIL,
            to: emailId,
            subject: 'Your Coursea verification code',
            text: `Your verification code is ${code}. It expires in 10 minutes.`
        });

        return res.status(200).json({ message: 'Verification code sent' });
    } catch (err) {
        console.error(`Error sending signup otp: ${err}`);
        return res.status(500).json({ error: 'Failed to send verification code' });
    }
};
