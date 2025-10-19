import mongoose from "mongoose";

import { EnrollmentModel } from "../../db/schema.js";

export const getPurchasedCourseById = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.userId;

    if (!mongoose.isValidObjectId(courseId)) {
        return res.status(400).json({ error: 'Invalid course Id.' });
    }

    try {
        const enrollment = await EnrollmentModel.findOne({ userId, courseId }).populate('courseId');

        if (!enrollment) {
            return res.status(404).json({ error: 'Course not found in your purchases.' });
        }

        return res.json({ course: enrollment.courseId });
    } catch (err) {
        console.error(`Error fetching course: ${err}`);
        return res.status(500).json({ error: 'Failed to fetch course.' });
    }
}