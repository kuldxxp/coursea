import { UserModel } from "../db/schema.js";

export const isAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        next();
    } catch (err) {
        console.error(`Error verifying admin: ${err}`);
        res.status(500).json({ error: 'Failed to verify admin privileges.' });
    }
};  