import mongoose, { Schema, model, models } from 'mongoose';
import { IBranch } from '@/types';

const BranchSchema = new Schema<IBranch>(
  {
    name: {
      type: String,
      required: [true, 'Branch name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Branch slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      district: String,
      city: String,
      province: String,
      postalCode: String,
      lat: Number,
      lng: Number,
    },
    contact: {
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
      },
      email: String,
    },
    settings: {
      openingHours: {
        type: Schema.Types.Mixed,
        default: {},
      },
      timezone: {
        type: String,
        default: 'Asia/Bangkok',
      },
      taxRate: {
        type: Number,
        default: 7, // 7% VAT
        min: 0,
        max: 100,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    menuItems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
BranchSchema.index({ slug: 1 }, { unique: true });
BranchSchema.index({ isActive: 1 });

const Branch = models.Branch || model<IBranch>('Branch', BranchSchema);

export default Branch;
