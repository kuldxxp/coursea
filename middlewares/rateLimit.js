import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import slowDown from "express-slow-down";

const buildLimiter = ({
  windowMs,
  max,
  message = "Too many requests",
  keyFn,
} = {}) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message,
    keyGenerator: (req) => {
      if (keyFn) return keyFn(req);
      return ipKeyGenerator(req); // ✅ SAFE IPv6 handling
    },
  });

const buildSlowdown = ({
  windowMs,
  delayAfter,
  delayMs,
  keyFn,
} = {}) =>
  slowDown({
    windowMs,
    delayAfter,
    delayMs: () => delayMs || 500, // ✅ v2 correct format
    keyGenerator: (req) => {
      if (keyFn) return keyFn(req);
      return ipKeyGenerator(req); // ✅ SAFE IPv6 handling
    },
  });

export const loginLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many login attempts. Please try again later.",
});

export const otpSendLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many OTP requests. Please try again later.",
  keyFn: (req) =>
    `${ipKeyGenerator(req)}:${(req.body?.emailId || "").toLowerCase()}`,
});

export const otpVerifyLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: "Too many OTP verification requests. Please try again later.",
  keyFn: (req) =>
    `${ipKeyGenerator(req)}:${(req.body?.emailId || "").toLowerCase()}`,
});

export const forgotResetLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: "Too many password reset requests. Please try again later.",
  keyFn: (req) =>
    `${ipKeyGenerator(req)}:${(req.body?.emailId || "").toLowerCase()}`,
});

export const otpVerifySlowdown = buildSlowdown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,
  delayMs: 500,
  keyFn: (req) =>
    `${ipKeyGenerator(req)}:${(req.body?.emailId || "").toLowerCase()}`,
});

export const checkoutLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many checkout requests. Please try again later.",
  keyFn: (req) =>
    req.user?._id?.toString() || ipKeyGenerator(req),
});

export const verifyPaymentsLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many payment verifications. Please try again later.",
  keyFn: (req) =>
    req.user?._id?.toString() || ipKeyGenerator(req),
});

export const webhookLimiter = buildLimiter({
  windowMs: 60 * 1000,
  max: 120,
  message: "Webhook rate limit exceeded.",
});

export const adminWriteLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: "Too many admin changes. Please try again later.",
  keyFn: (req) =>
    req.user?._id?.toString() || ipKeyGenerator(req),
});
