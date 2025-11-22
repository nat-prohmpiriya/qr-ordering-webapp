import mongoose, { Schema, model, models } from 'mongoose';
import { ICategory } from '@/types';

const CategorySchema = new Schema<ICategory>(
  {
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
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      th: String,
      en: String,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting and filtering
CategorySchema.index({ displayOrder: 1, isActive: 1 });

const Category = models.Category || model<ICategory>('Category', CategorySchema);

export default Category;
