import mongoose from 'mongoose';

import { CourseModel } from '../../db/schema.js';

export const updateCourseHandler = async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.isValidObject(courseId)) {
    return res.status(400).json({ error: 'Invalid course Id' });
  }

  try {
    const updates = req.body;

    const updated = await CourseModel.findByIdAndUpdate(
      courseId,
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.json(updated);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Duplicate key', details: err.keyValue });
    }

    console.error(`Error updating course: ${err}`);
    return res.status(500).json({ error: 'Failed to update course' });
  }
};
