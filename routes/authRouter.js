import express from "express";
import passport from "passport";
import dotenv from "dotenv";

const authRouter = express.Router();

dotenv.config();

authRouter.get(
    '/',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
    '/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=google' }),
    (req, res) => {
        res.redirect(`${process.env.CLIENT_URL}/api/v1/user/dashboard` || '/');
    }
);

export default authRouter;
