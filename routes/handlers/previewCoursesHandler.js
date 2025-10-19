import { CourseModel } from "../../db/schema.js";

export const previewCoursesHandler = async (req, res) => {
    const { page, limit } = req.validatedQuery;
    const skip = (page - 1) * limit; 

    try {
        const [items, total] = await Promise.all([
            CourseModel.find({})
                .select('name description category thumbnail price instructor')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            CourseModel.countDocuments({}),
        ]);

        return res.status(200).json({
            items,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error(`Error fetching courses: ${err}`);
        return res.status(500).json({ error: 'There was an error fetching the courses.' });
    }
};