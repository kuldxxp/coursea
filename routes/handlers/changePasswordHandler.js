import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import { UserModel } from '../../db/schema.js';

dotenv.config();

export const changePasswordHandler = async (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const ok = await bcrypt.compare(currentPassword, user.password);

    if (!ok) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS ?? '12', 10));
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(`Error changing password: ${err}`);
    return res.status(500).json({ error: 'Failed to change the password' });
  }
};
