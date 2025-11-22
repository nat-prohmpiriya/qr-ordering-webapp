import mongoose, { Schema, model, models } from 'mongoose';
import { IBranchMenuItem } from '@/types';

const BranchMenuItemSchema = new Schema<IBranchMenuItem>(
  {
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: [true, 'Branch ID is required'],
      index: true,
    },
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: [true, 'Menu Item ID is required'],
      index: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
BranchMenuItemSchema.index({ branchId: 1, menuItemId: 1 }, { unique: true });

const BranchMenuItem =
  models.BranchMenuItem || model<IBranchMenuItem>('BranchMenuItem', BranchMenuItemSchema);

export default BranchMenuItem;
