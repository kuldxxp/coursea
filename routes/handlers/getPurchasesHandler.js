import { EnrollmentModel } from "../../db/schema.js";

export const getPurchasesHandler = async (req, res) => {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.validatedQuery || {};
    const skip = (page - 1) * limit;

    try {
        const [items, total] = await Promise.all([
            EnrollmentModel.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('courseId', 'name slug thumbnail price')
                .lean(),
            EnrollmentModel.countDocuments({ userId }),
        ]);

        return res.status(200).json({
            items,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error(`Error fetching courses: ${err}`);
        return res.status(500).json({ error: 'Failed to fetch courses.' });
    }
}