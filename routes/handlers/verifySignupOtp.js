import bcrypt from 'bcrypt';

import { UserModel } from '../../db/schema.js';

export const verifySignupOtp = async (req, res) => {
    const { emailId, code } = req.body;

    try {
        const user = await UserModel
            .findOne({ emailId })
            .select('+otpHash +password');

        if (!user) {
            return res.status(404).json({ error: 'Invalid code' });
        }

        if (user.emailVerified) {
            return res.status(200).json({ message: 'Already verified' });
        }

        if (!user.otpHash || !user.otpExpiresAt || user.otpAttempts >= 5) {
            return res.status(400).json({ error: 'Code invalid or too many attempts' });
        }

        if (Date.now() > user.otpExpiresAt.getTime()) {
            return res.status(400).json({ error: 'Code expired' });
        }

        const ok = await bcrypt.compare(code, user.otpHash);

        if (!ok) {
            user.otpAttempts += 1;
            await user.save();

            return res.status(400).json({ error: 'Incorrect code' });
        }

        user.emailVerified = true;
        user.otpHash = undefined;
        user.otpExpiresAt = undefined;
        user.otpAttempts = 0;
        await user.save();

        return res.status(200).json({ message: 'Email verified' });
    } catch (err) {
        console.error(`Error verifying signup otp: ${err}`);
        return res.status(500).json({ error: 'Failed to verify code' });
    }
};