import mongoose from 'mongoose';

import { CourseModel } from '../../db/schema.js';

export const getCourseByIdHandler = async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.isValidObject(courseId)) {
    return res.status(400).json({ error: 'Invalid course Id' });
  }

  try {
    const doc = await CourseModel.findById(courseId).lean();

    if (!doc) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.json(doc);
  } catch (err) {
    console.error(`Error getting course by Id: ${err}`);
    return res.status(500).json({ error: 'Failed to get course' });
  }
};
