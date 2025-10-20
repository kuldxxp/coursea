import * as z from 'zod';

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const adminLessonsSchema = z.object({
    title: z.string().trim().min(1),
    videoUrl: z.url(),
    durationSec: z.number().int().min(0).default(0),
});

export const adminCourseCreateSchema = z.object({
    name: z.string().trim().min(3),
    description: z.string().trim().min(10),
    category: z.enum(["Programming", "System Design", "Quant/Finance", "AI/ML"]),
    thumbnail: z.url(),
    instructor: objectId,
    price: z.number().min(0),
    lessons: z.array(adminLessonsSchema).default([]),
    slug: z.string().trim().min(3).optional(),
    status: z.enum(["draft", "published"]).optional(),
});

export const adminCourseUpdateSchema = adminCourseCreateSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: "Provide atleast one field to update." }
);

export const courseIdParamSchema = z.object({
    courseId: objectId,
});

export const adminCourseListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    status: z.enum(["draft", "published"]).optional(),
    category: z.enum(["Programming", "System Design", "Quant/Finance", "AI/ML"]).optional(),
    q: z.string().trim().min(1).optional(),
});

export const adminCourseStatusSchema = z.object({
    status: z.enum(["draft", "published"]),
});