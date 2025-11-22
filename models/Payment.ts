import mongoose, { Schema, model, models } from 'mongoose';
import { IPayment } from '@/types';

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
      required: [true, 'Stripe Payment Intent ID is required'],
      unique: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      uppercase: true,
      default: 'THB',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'promptpay', 'cash'],
      required: [true, 'Payment method is required'],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    errorMessage: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ stripePaymentIntentId: 1 }, { unique: true });
PaymentSchema.index({ status: 1 });

const Payment = models.Payment || model<IPayment>('Payment', PaymentSchema);

export default Payment;
