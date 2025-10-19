import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: String,
        username: { type: String, unique: true, required: true  },
        emailId: { type: String, unique: true, required: true },
        age: Number,
        password: { type: String, required: true, select: false },
        isAdmin: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    }, { timestamps: true }
);

const lessonSchema = new Schema(
    {
        title: { type: String, required: true },
        videoUrl: { type: String, required: true },
        durationSec: { type: Number, default: 0 },
    }, { _id: true }
);

const courseSchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ['Programming', 'System Design', 'Quant/Finance', 'AI/ML'],
        },
        thumbnail: { type: String, required: true },
        instructor: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        lessons: { type: [lessonSchema], default: [] },
        price: { type: Number, required: true, min: 0 },
        status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    }, { timestamps: true }
);

const enrollmentSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'courses', required: true, index: true },
        purchasedAt: { type: Date, default: Date.now },
        pricePaid: { type: Number, required: true, min: 0 },
    }, { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const UserModel = mongoose.model('users', userSchema);
export const CourseModel = mongoose.model('courses', courseSchema);
export const EnrollmentModel = mongoose.model('enrollments', enrollmentSchema);
