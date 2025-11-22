import mongoose, { Schema, model, models } from 'mongoose';
import { IOrder } from '@/types';

const OrderItemSchema = new Schema(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: {
      th: String,
      en: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    specialInstructions: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: [true, 'Branch ID is required'],
      index: true,
    },
    tableId: {
      type: Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'Table ID is required'],
      index: true,
    },
    sessionId: {
      type: String,
      required: [true, 'Session ID is required'],
      index: true,
    },
    items: {
      type: [OrderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: function (items: any[]) {
          return items.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    tax: {
      type: Number,
      required: [true, 'Tax is required'],
      min: [0, 'Tax cannot be negative'],
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'],
      default: 'pending',
      required: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      required: true,
    },
    customerNote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient querying
OrderSchema.index({ branchId: 1, createdAt: -1 });
OrderSchema.index({ branchId: 1, status: 1 });
OrderSchema.index({ sessionId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
