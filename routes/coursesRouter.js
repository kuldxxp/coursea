import express from 'express';

import { paginationSchema } from '../validation/schemas.ts';
import { validate } from '../validation/validate.js';
import { previewCoursesHandler } from './handlers/previewCoursesHandler.js';

const coursesRouter = express.Router();

coursesRouter.get(
    '/preview',
    validate(paginationSchema),
    previewCoursesHandler
);

// coursesRouter.post('/purchase/:courseId', (req, res) => {});

export default coursesRouter;