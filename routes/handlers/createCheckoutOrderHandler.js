import mongoose from 'mongoose';

import { razorpay } from '../../lib/razorpay.js';
import { CourseModel } from '../../db/schema.js';

export const createCheckoutOrderHandler = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id.toString();

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(200).json({ error: 'Invalid course Id' });
  }

  const course = await CourseModel.findById(courseId).lean();

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  try {
    const amount = Math.round((course.price || 0) * 100);
    const order = await razorpay.orders.create({
      amount,
      currency: process.env.CURRENCY || 'INR',
      receipt: `course_${courseId}_user_${userId}_${Date.now()}`,
      notes: { courseId, userId },
    });

    return res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      course: { id: course._id, name: course.name },
    });
  } catch (err) {
    console.error(`Error creating Razorpay order: ${err}`);
    return res.status(500).json({ error: 'Failed to create orders' });
  }
};
