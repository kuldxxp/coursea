import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

const buildLimiter = ({ windowMs, max, message = 'Too many requests', keyFn } = {}) => 
    rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message,
        keyGenerator: (req, _res) => (keyFn ? keyFn(req) : req.ip),
    });

const buildSlowdown = ({ windowMs, delayAfter, delayMs, keyFn } = {}) => 
    slowDown({
        windowMs,
        delayAfter,
        delayMs,
        keyGenerator: (req, _res) => (keyFn ? keyFn(req) : req.ip),
    });

export const loginLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many login attempts. Please try again later.',
});

export const otpSendLimiter = buildLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many OTP requests. Please try again later.',
    keyFn: (req) => `${req.ip}:${(req.body?.emailId || '').toLowerCase()}`,
});

export const otpVerifyLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000,
    max: 25,
    message: 'Too many OTP verification requests. Please try again later.',
    keyFn: (req) => `${req.ip}:${(req.body?.emailId || '').toLowerCase()}`,
});

export const forgotResetLimiter = buildLimiter({
    windowMs: 60 * 60 * 1000,
    max: 8,
    message: 'Too many password reset requests. Please try again later.',
    keyFn: (req) => `${req.ip}:${(req.body?.emailId || '').toLowerCase()}`,
});

export const otpVerifySlowdown = buildSlowdown({
    windowMs: 15 * 60 * 1000,
    max: 5,
    delayMs: 500,
    keyFn: (req) => `${req.ip}:${(req.body?.emailId || '').toLowerCase()}`,
});

export const checkoutLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: 'Too many checkout requests. Please try again later.',
    keyFn: (req) => req.user?._id.toString() || req.ip,
});

export const verifyPaymentsLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'Too many payment verifications. Please try again later.',
    keyFn: (req) => req.user?._id.toString() || req.ip,
});

export const webhookLimiter = buildLimiter({
    windowMs: 60 * 1000,
    max: 120,
    message: 'Webhook rate limit exceeded.',
});

export const adminWriteLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: 'Too many admin changes. Please try again later.',
    keyFn: (req) => req.user?._id.toString() || req.ip,
});
