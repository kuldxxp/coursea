import express from 'express';
import passport from 'passport';

import {
    signupSchema,
    loginSchema,
    paginationSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    sendSignupOtpSchema,
    verifySignupOtpSchema,
} from '../validation/schemas.ts';
// import { auth } from '../middlewares/auth.js';
import { auth } from '../middlewares/newAuth.js';
import {
    loginLimiter,
    otpSendLimiter,
    otpVerifyLimiter,
    otpVerifySlowdown,
    forgotResetLimiter,
    verifyPaymentsLimiter,
} from '../middlewares/rateLimit.js';
import { validate } from '../validation/validate.js';
import { signupHandler } from './handlers/signupHandler.js';
// import { loginHandler } from './handlers/loginHandler.js';
import { getPurchasesHandler } from './handlers/getPurchasesHandler.js';
import { getPurchasedCourseById } from './handlers/getPurchasedCourseByIdHandler.js';
import {
    forgotPasswordHandler,
    resetPasswordHandler
} from './handlers/forgotPasswordHandler.js'
import { changePasswordHandler } from './handlers/changePasswordHandler.js';
import { verifyRazorpayHandler } from './handlers/verifyRazorpayHandler.js';
import { sendSignupOtp } from './handlers/sendSignupOtp.js';
import { verifySignupOtp } from './handlers/verifySignupOtp.js';

const userRouter = express.Router();

userRouter.get('/dashboard', (req, res) => {
    res.status(200).json({ message: 'Successful!' });
});

userRouter.post(
    '/signup',
    validate(signupSchema),
    signupHandler
);

userRouter.post(
    '/login',
    loginLimiter,
    validate(loginSchema),
    passport.authenticate('local'),
    (req, res) => {
        const nextUrl = req.session.returnTo || null;

        if (nextUrl) {
            delete req.session.returnTo;
        }

        res.status(200).json({
            message: 'Logged in',
            nextUrl,
            user: { id: req.user._id, username: req.user.username }
        });
    }
);

userRouter.post('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }

        req.session.destroy(() => {
            res.clearCookie('sid');

            res.status(200).json({ message: 'Logged out' });
        });
    });
});

userRouter.get(
    '/purchases',
    auth,
    validate(paginationSchema, 'query'),
    getPurchasesHandler
);

userRouter.get(
    '/purchases/:courseId',
    auth,
    getPurchasedCourseById
);

userRouter.post(
    '/signup/otp',
    otpSendLimiter,
    validate(sendSignupOtpSchema),
    sendSignupOtp
);

userRouter.post(
    '/signup/verify',
    otpVerifyLimiter,
    otpVerifySlowdown,
    validate(verifySignupOtpSchema),
    verifySignupOtp
);

userRouter.post(
    '/payments/verify',
    auth,
    verifyRazorpayHandler
);

userRouter.post(
    '/forgot-password',
    forgotResetLimiter,
    validate(forgotPasswordSchema),
    forgotPasswordHandler
);

userRouter.post(
    '/reset-password/:token',
    forgotResetLimiter,
    validate(resetPasswordSchema),
    resetPasswordHandler
);

userRouter.post(
    '/change-password',
    auth,
    verifyPaymentsLimiter,
    validate(changePasswordSchema),
    changePasswordHandler
);

export default userRouter;

