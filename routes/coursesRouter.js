import express from 'express';

import { paginationSchema } from '../validation/schemas.ts';
import { validate } from '../validation/validate.js';
// import { tryAuth } from '../middlewares/tryAuth.js';
import { tryAuth } from '../middlewares/newTryAuth.js';
import { previewCoursesHandler } from './handlers/previewCoursesHandler.js';
import { previewCourseDetailHandler } from './handlers/previewCourseDetailHandler.js';

const coursesRouter = express.Router();

coursesRouter.get(
    '/preview',
    validate(paginationSchema, 'query'),
    previewCoursesHandler
);

coursesRouter.get(
    '/:idOrSlug',
    tryAuth,
    previewCourseDetailHandler
);

// coursesRouter.post('/purchase/:courseId', (req, res) => {});

export default coursesRouter;