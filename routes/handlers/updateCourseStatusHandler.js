import mongoose from 'mongoose';

import { CourseModel } from '../../db/schema.js';

export const updateCourseStatusHandler = async (req, res) => {
  const { courseId } = req.params;
  const { status } = req.body;

  if (!mongoose.isValidObject(courseId)) {
    return res.status(400).json({ error: 'Invalid course Id' });
  }

  try {
    const updated = await CourseModel.findByIdAndUpdate(
      courseId,
      status,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.json(updated);
  } catch (err) {
    console.error(`Error updating course status: ${err}`);
    return res.status(500).json({ error: 'Failed to update course status' });
  }
};
