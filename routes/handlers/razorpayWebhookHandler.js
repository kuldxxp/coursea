import crypto from 'crypto';
import mongoose from 'mongoose';

import { EnrollmentModel, CourseModel } from '../../db/schema.js';

const ok = () => ({ received: true });

export const razorpayWebhookHandler = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!webhookSecret|| !signature) {
      return res.status(400).json({ error: 'Missing webhook secret/signature' });
    }

    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body)
      .digest('hex');

    if (expected !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(req.body.toString('utf-8'));
    const event = payload?.event;

    if (event !== 'payment.captured' && event !== 'order.paid') {
      return res.status(200).json(ok());
    }

    const payment = payload?.payload?.payment?.entity || {};
    const notes = payment?.notes || {};
    const courseId = notes.courseId;
    const userId = notes.userId;

    if (!courseId || !userId) {
      return res.status(200).json(ok());
    }

    if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(userId)) {
      return res.status(200).json(ok());
    }

    const course = await CourseModel.findById(courseId).lean();

    if (!course) {
      return res.status(200).json(ok());
    }

    await EnrollmentModel.updateOne(
      { userId, courseId },
      {
        $setOnInsert: {
          userId,
          courseId,
          pricePaid: course.price ?? 0,
          purchasedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return res.status(200).json(ok());
  } catch (err) {
    console.error(`Razorpay webhook error: ${err}`);
    return res.status(200).json({ received: true });
  }
};
