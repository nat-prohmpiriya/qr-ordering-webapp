import mongoose, { Schema, model, models } from 'mongoose';
import { ITable } from '@/types';

const TableSchema = new Schema<ITable>(
  {
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: [true, 'Branch ID is required'],
      index: true,
    },
    tableNumber: {
      type: String,
      required: [true, 'Table number is required'],
      trim: true,
    },
    zone: {
      type: String,
      trim: true,
    },
    qrCode: {
      type: String,
      required: [true, 'QR code is required'],
      unique: true,
      index: true,
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
      default: 4,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for branchId + tableNumber (unique per branch)
TableSchema.index({ branchId: 1, tableNumber: 1 }, { unique: true });

// Index for QR code lookups
TableSchema.index({ qrCode: 1 }, { unique: true });

const Table = models.Table || model<ITable>('Table', TableSchema);

export default Table;
