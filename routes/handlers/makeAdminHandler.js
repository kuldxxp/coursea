import { UserModel } from "../../db/schema.js";

export const makeAdminHandler = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            { isAdmin: true },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(`Error promoting user: ${err}`);
        res.status(500).json({ error: 'Failed to promote user.' });
    }
};  