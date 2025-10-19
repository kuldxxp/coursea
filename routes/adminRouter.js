import express from 'express';

import { loginSchema } from '../validation/schemas.js';
import { validate } from '../middlewares/validate.js';
import { loginHandler } from './handlers/loginHandler.js';
import { auth } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { makeAdminHandler } from './handlers/makeAdminHandler.js';

const adminRouter = express.Router();

adminRouter.post('/login', validate(loginSchema), loginHandler);

adminRouter.get('/dashboard', (req, res) => {});

adminRouter.post('/course/create', (req, res) => {});

adminRouter.get('/course/preview', (req, res) => {});

adminRouter.get('/course/:name', (req, res) => {});

adminRouter.put('/course/change', (req, res) => {});

adminRouter.delete('/course/remove', (req, res) => {});

adminRouter.patch('/make-admin/:id', auth, isAdmin, makeAdminHandler);

export default adminRouter;