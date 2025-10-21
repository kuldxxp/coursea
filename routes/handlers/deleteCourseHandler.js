import mongoose from 'mongoose';

import { CourseModel } from '../../db/schema.js';

export const deleteCourseHandler = async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.isValidObject(courseId)) {
    return res.status(400).json({ error: 'Invalid course Id' });
  }

  try {
    const deleted = await CourseModel.findByIdAndDelete(courseId);

    if (!deleted) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error(`Error deleting course: ${err}`);
    return res.status(500).json({ error: 'Failed to delete course' });
  }
};
