import { loginHandler } from "./loginHandler.js";
import { UserModel } from "../../db/schema.js";

export const adminLoginHandler = async (req, res, next) => {
    const user = await UserModel.findOne({ username: req.body.username });

    if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Not an admin account.' });
    }

    return loginHandler(req, res, next);
};