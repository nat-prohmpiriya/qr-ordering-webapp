import mongoose, { Schema, model, models } from 'mongoose';
import { IMenuItem } from '@/types';

const MenuItemSchema = new Schema<IMenuItem>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
      index: true,
    },
    name: {
      th: {
        type: String,
        required: [true, 'Thai name is required'],
        trim: true,
      },
      en: {
        type: String,
        required: [true, 'English name is required'],
        trim: true,
      },
    },
    description: {
      th: String,
      en: String,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: null,
    },
    spicyLevel: {
      type: Number,
      min: 0,
      max: 3,
      default: 0,
    },
    allergens: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    preparationTime: {
      type: Number,
      default: 15,
      min: [1, 'Preparation time must be at least 1 minute'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
MenuItemSchema.index({ categoryId: 1, isAvailable: 1 });
MenuItemSchema.index({ isAvailable: 1 });

const MenuItem = models.MenuItem || model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;
