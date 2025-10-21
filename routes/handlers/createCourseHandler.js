import { CourseModel } from '../../db/schema.js';

export const createCourseHandler = async (req, res) => {
  try {
    const payload = req.body;
    const doc = await CourseModel.create(payload);

    return res.status(201).json(doc);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Duplicate key', details: err.keyValue });
    }

    console.error(`Create course error: ${err}`);
    return res.status().json({ error: 'Failed to create course' });
  }
};
