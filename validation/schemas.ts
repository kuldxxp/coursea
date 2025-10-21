import * as z  from 'zod';

export const signupSchema = z.object({
    name: z.string().trim().min(3).max(30).optional(),
    username: z.string().trim().min(5).max(18),
    emailId: z.email(),
    age: z.number().int().min(15).optional(),
    password: z
        .string()
        .min(8)
        .max(20)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&][A-Za-z\d@$!%*?&]+$)/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character"
        ),
});

export const loginSchema = z.object({
    username: z.string().trim().min(5).max(18),
    password: z
        .string()
        .min(8)
        .max(20)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&][A-Za-z\d@$!%*?&]+$)/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character"
        ),
});

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(36).default(18),
});

export const forgotPasswordSchema = z.object({
    emailId: z.email(),
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8)
        .max(20)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&][A-Za-z\d@$!%*?&]+$)/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character"
        ),
});

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(8)
        .max(20)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&][A-Za-z\d@$!%*?&]+$)/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character"
        ),
    newPassword: z
        .string()
        .min(8)
        .max(20)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&][A-Za-z\d@$!%*?&]+$)/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character"
        ), 
});