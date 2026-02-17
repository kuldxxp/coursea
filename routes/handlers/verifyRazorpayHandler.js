import crypto from 'crypto';
import mongoose from 'mongoose';

import { EnrollmentModel, CourseModel } from '../../db/schema.js';

export const verifyRazorpayHandler = async (req, res) => {
  const userId = req.user._id.toString();
  const { courseId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ error: 'Invalid course Id' });
  }

  const sign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (sign !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment signature mismatch' });
  }

  const course = await CourseModel.findById(courseId);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  try {
    const enrollment = await EnrollmentModel.create({
      userId,
      courseId,
      pricePaid: course.price,
      purchasedAt: new Date(),
    });

    return res.status(201).json({
      message: 'Payment verified, enrolled',
      enrollment: enrollment._id
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(200).json({ message: 'Already enrolled' });
    }

    console.error(`Enrollment create error: ${err}`);
    return res.status(500).json({ error: 'Failed to enroll after payment' });
  }
};

