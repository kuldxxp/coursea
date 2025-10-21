import express from 'express';

import {
    signupSchema,
    loginSchema,
    paginationSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
} from '../validation/schemas.ts';
import { auth } from '../middlewares/auth.js';
import { validate } from '../validation/validate.js';
import { signupHandler } from './handlers/signupHandler.js';
import { loginHandler } from './handlers/loginHandler.js';
import { getPurchasesHandler } from './handlers/getPurchasesHandler.js';
import { getPurchasedCourseById } from './handlers/getPurchasedCourseByIdHandler.js';
import { forgotPasswordHandler, resetPasswordHandler } from './handlers/forgotPasswordHandler.js'
import { changePasswordHandler } from './handlers/changePasswordHandler.js';

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
    validate(loginSchema),
    loginHandler
);

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
    '/forgot-password',
    validate(forgotPasswordSchema),
    forgotPasswordHandler
);

userRouter.post(
    '/reset-password/:token',
    validate(resetPasswordSchema),
    resetPasswordHandler
);

userRouter.post(
    '/change-password',
    auth,
    validate(changePasswordSchema),
    changePasswordHandler
);

export default userRouter;
