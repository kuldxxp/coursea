import { CourseModel } from '../../db/schema.js';

export const listCoursesHandler = async (req, res) => {
  const { page, limit, status, category, q } = req.validatedQuery;
  const skip = (page - 1) * limit;
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (category) {
    filter.category = category;
  }

  if (q) {
    const re = new RegExp(q, "i");
    filter.$or = [{ name: re }, { description: re }];
  }

  try {
    const [items, count] = await Promise.all([
      CourseModel.find(filter)
        .select("name slug status price category updatedAt thumbnail instructor")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CourseModel.countDocuments(filter),
    ]);

    return res.json({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(`Error listing courses: ${err}`);
    return res.status(500).json({ error: 'Failed to list courses' });
  }
};
