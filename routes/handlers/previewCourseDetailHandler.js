import mongoose from 'mongoose';

import { CourseModel, EnrollmentModel } from '../../db/schema.js';

export const previewCourseDetailHandler = async (req, res) => {
    const { idOrSlug } = req.params;
    const userId = req.userId;
    
    const filter = mongoose.isValidObjectId(idOrSlug)
        ? { _id: idOrSlug }
        : { slug: idOrSlug };

    try {
        const course = await CourseModel.findOne(filter).lean();

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        let owned = false;

        if (userId) {
            const enrollment = await EnrollmentModel.findOne({
                userId,
                courseId: course._id,
            }).lean();

            owned = !!enrollment;
        }

        const safeLessons = owned
            ? (course.lessons || [])
            : (course.lessons || []).map(lesson => ({
                _id: lesson._id,
                title: lesson.title,
                durationSec: lesson.durationSec,
            }));
        
        return res.status(200).json({
            _id: course._id,
            name: course.name,
            slug: course.slug,
            description: course.description,
            category: course.category,
            thumbnail: course.thumbnail,
            price: course.price,
            instructor: course.instructor,
            owned,
            lessons: safeLessons,
            updatedAt: course.updatedAt,
            createdAt: course.createdAt,
        });
    } catch (err) {
        console.error(`Error fetching course detail: ${err}`);
        return res.status(500).json({ error: 'Failed to fetch course details' });
    }
};