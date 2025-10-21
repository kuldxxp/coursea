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
import { createCourseHandler } from './handlers/createCourseHandler.js';
import { listCoursesHandler } from './handlers/listCoursesHandler.js';
import { getCourseByIdHandler } from './handlers/getCourseByIdHandler.js';
import { updateCourseHandler } from './handlers/updateCourseHandler.js';
import { updateCourseStatusHandler } from './handlers/updateCourseStatusHandler.js';
import { deleteCourseHandler } from './handlers/deleteCourseHandler.js'; 

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
    createCourseHandler
);

adminRouter.get(
    '/courses',
    validate(adminCourseListQuerySchema, 'query'),
    listCoursesHandler
);

adminRouter.get(
    '/courses/:courseId',
    validate(courseIdParamSchema, 'params'),
    getCourseByIdHandler
);

adminRouter.patch(
    '/courses/:courseId',
    validate(courseIdParamSchema, 'params'),
    validate(adminCourseUpdateSchema),
    updateCourseHandler
);

adminRouter.patch(
    '/courses/:courseId/status',
    validate(courseIdParamSchema, 'params'),
    validate(adminCourseStatusSchema),
    updateCourseStatusHandler
);

adminRouter.delete(
    '/courses/:courseId',
    validate(courseIdParamSchema, 'params'),
    deleteCourseHandler
);

adminRouter.patch(
    '/make-admin/:id',
    makeAdminHandler
);

export default adminRouter;