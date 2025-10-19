import { UserModel } from "../db/schema.js";

export const isAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findOne(req.userId);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        next();
    } catch (err) {
        console.error(`Error verifying admin: ${err}`);
        res.status(500).json({ error: 'Failede to verify admin privileges.' });
    }
};  