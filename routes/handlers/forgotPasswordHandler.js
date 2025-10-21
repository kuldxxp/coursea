import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import { UserModel } from '../../db/schema.js';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'dev_secret';

export const forgotPasswordHandler = async (req, res) => {
  const { emailId } = req.body;

  try {
    const user = await UserModel.findOne({ emailId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const payload = { id: user._id.toString() };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASS,
      },
    });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const receiver = {
      from: process.env.GMAIL,
      to: emailId,
      subject: 'Password reset request',
      text: `Click on this link to generate a new password: ${resetUrl} `,
    };

    await transporter.sendMail(receiver);

    return res.status(200).json({ message: 'Password reset link sent successfully' });
  } catch (err) {
    console.error(`Error sending password reset link: ${err}`);
    return res.status(500).json({ error: 'Failed to send password reset link' });
  }
};

export const resetPasswordHandler = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY);
    const user = await UserModel.findById(payload.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newHashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

    user.password = newHashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    if (err?.name === 'TokenExpiredError' || err?.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    console.error(`Error resetting password: ${err}`);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
};
