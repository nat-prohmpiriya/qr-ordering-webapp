import mongoose, { Schema, model, models } from 'mongoose';
import { IUser } from '@/types';

const UserSchema = new Schema<IUser>(
  {
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      default: null,
      // null for owner, required for staff (validated in application logic)
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['staff', 'owner'],
      required: [true, 'Role is required'],
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

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ branchId: 1 });
UserSchema.index({ role: 1 });

const User = models.User || model<IUser>('User', UserSchema);

export default User;
