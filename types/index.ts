import { Types } from 'mongoose';

// User Types
export type UserRole = 'staff' | 'owner';

export interface IUser {
  _id: Types.ObjectId;
  branchId?: Types.ObjectId | null;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Branch Types
export interface IBranch {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  location: {
    address: string;
    district?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    lat?: number;
    lng?: number;
  };
  contact: {
    phone: string;
    email?: string;
  };
  settings: {
    openingHours?: Record<string, { open: string; close: string }>;
    timezone: string;
    taxRate: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Table Types
export interface ITable {
  _id: Types.ObjectId;
  branchId: Types.ObjectId;
  tableNumber: string;
  qrCode: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Category Types
export interface ICategory {
  _id: Types.ObjectId;
  name: {
    th: string;
    en: string;
  };
  slug: string;
  description?: {
    th?: string;
    en?: string;
  };
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// MenuItem Types
export interface IMenuItem {
  _id: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: {
    th: string;
    en: string;
  };
  description?: {
    th?: string;
    en?: string;
  };
  price: number;
  image?: string | null;
  spicyLevel: number; // 0-3
  allergens: string[];
  isAvailable: boolean;
  isVegetarian: boolean;
  preparationTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

// BranchMenuItem Types
export interface IBranchMenuItem {
  _id: Types.ObjectId;
  branchId: Types.ObjectId;
  menuItemId: Types.ObjectId;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type PaymentMethod = 'stripe' | 'cash';

export interface OrderItem {
  menuItemId: Types.ObjectId;
  name: {
    th: string;
    en: string;
  };
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface IOrder {
  _id: Types.ObjectId;
  orderNumber: string;
  branchId: Types.ObjectId;
  tableId: Types.ObjectId;
  sessionId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  customerNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export type PaymentMethodType = 'card' | 'promptpay' | 'cash';

export type PaymentStatusType =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface IPayment {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatusType;
  paymentMethod: PaymentMethodType;
  metadata?: Record<string, any>;
  errorMessage?: string | null;
  paidAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

// Session Types
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  branchId?: string;
}
