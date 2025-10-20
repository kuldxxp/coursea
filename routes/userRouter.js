import express from 'express';

import { signupSchema, loginSchema, paginationSchema } from '../validation/schemas.ts';
import { auth } from '../middlewares/auth.js';
import { validate } from '../validation/validate.js';
import { signupHandler } from './handlers/signupHandler.js';
import { loginHandler } from './handlers/loginHandler.js';
import { getPurchasesHandler } from './handlers/getPurchasesHandler.js';
import { getPurchasedCourseById } from './handlers/getPurchasedCourseByIdHandler.js';

const userRouter = express.Router();

userRouter.post('/signup', validate(signupSchema), signupHandler);

userRouter.post('/login', validate(loginSchema), loginHandler);

userRouter.get('/purchases', auth, validate(paginationSchema), getPurchasesHandler);

userRouter.get('/purchases/:courseId', auth, getPurchasedCourseById);

export default userRouter;
