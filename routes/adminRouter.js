import express from 'express';

import { validate } from '../validation/validate.js';
import { loginSchema } from '../validation/schemas.ts';
import {
    adminCourseCreateSchema,
    adminCourseUpdateSchema,
    courseIdParamSchema,
    adminCourseListQuerySchema,
    adminCourseStatusSchema,
} from '../validation/adminCoursesSchemas.ts';
import { auth } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { adminLoginHandler } from './handlers/adminLoginHandler.js';
import { makeAdminHandler } from './handlers/makeAdminHandler.js';

const adminRouter = express.Router();

adminRouter.post(
    '/login',
    validate(loginSchema),
    adminLoginHandler
);

adminRouter.use(auth);
adminRouter.use(isAdmin);

adminRouter.get('/dashboard', (req, res) => {
    res.status(200).send({ message: 'Success!' });
});

adminRouter.post(
    '/courses',
    validate(adminCourseCreateSchema),
    (req, res) => {}
);

adminRouter.get(
    '/courses',
    validate(adminCourseListQuerySchema, 'query'),
    (req, res) => {}
);

adminRouter.get(
    '/courses/:courseId',
    validate(courseIdParamSchema, 'params'),
    (req, res) => {}
);

adminRouter.patch(
    '/courses/:courseId',
    validate(courseIdParamSchema, 'params'),
    validate(adminCourseUpdateSchema),
    (req, res) => {}
);

adminRouter.patch(
    '/courses/:courseId/status',
    validate(courseIdParamSchema, 'params'),
    validate(adminCourseStatusSchema),
    (req, res) => {}
);

adminRouter.delete(
    '/courses/:courseId',
    validate(courseIdParamSchema, 'params'),
    (req, res) => {}
);

adminRouter.patch(
    '/make-admin/:id',
    makeAdminHandler
);

export default adminRouter;