# OVERVIEW 
## working flow 1: สั่งอาหารผ่าน QR Code
- ลูกค้า เข้าร้าน สแกน QR Code ที่โต๊ะ
- ระบบ ดึงข้อมูลโต๊ะจาก QR Code มาแสดงเมนูอาหาร
- ลูกค้า เลือกอาหารที่ต้องการสั่ง
- ลูกค้า ยืนยันคำสั่งซื้อ และชำระเงินผ่านระบบออนไลน์
- ระบบ บันทึกคำสั่งซื้อและแจ้งให้พนักงานทราบ
- พนักงาน เตรียมอาหารตามคำสั่งซื้อ
- ลูกค้า รับอาหารที่โต๊ะเมื่อพร้อม
## working flow 2: สั่งอาหารผ่านพนักงาน
- ลูกค้า เข้าร้านสั่งอาหารกับพนักงาน ที่เคาน์เตอร์
- พนักงาน รับคำสั่งซื้อจากลูกค้า
- พนักงาน บันทึกคำสั่งซื้อในระบบ
- ลูกค้า ชำระเงินผ่านพนักงาน
- พนักงาน แจ้งให้ครัวเตรียมอาหารตามคำสั่งซื้อ
- ลูกค้า รับอาหารที่โต๊ะเมื่อพร้อม
## working flow 3: การจัดการเมนูอาหารโดยเจ้าของร้าน
- เจ้าของร้าน เข้าสู่ระบบจัดการเมนูอาหาร
- เจ้าของร้าน เพิ่ม แก้ไข หรือลบเมนูอาหารตามต้องการ
- เจ้าของร้าน บันทึกการเปลี่ยนแปลงเมนูอาหารในระบบ
- ระบบ อัปเดตเมนูอาหารที่แสดงให้ลูกค้า
## working flow 4: การจัดการคำสั่งซื้อโดยพนักงาน
- พนักงาน เข้าสู่ระบบจัดการคำสั่งซื้อ
- พนักงาน ดูรายการคำสั่งซื้อที่ลูกค้าสั่งเข้ามา
- พนักงาน อัปเดตสถานะคำสั่งซื้อ (เช่น กำลังเตรียม ส่งมอบ เสร็จสิ้น)
- ระบบ แจ้งสถานะคำสั่งซื้อให้ลูกค้าทราบ
## working flow 5: การจัดการรายงานโดยเจ้าของร้าน
- เจ้าของร้าน เข้าสู่ระบบรายงาน
- เจ้าของร้าน ดูรายงานยอดขาย รายการคำสั่งซื้อ และข้อมูลลูกค้า
- เจ้าของร้าน วิเคราะห์ข้อมูลเพื่อปรับปรุงการบริการและเมนูอาหาร 
- เจ้าของร้าน บันทึกและจัดเก็บรายงานในระบบ
# REQUIREMENTS
## Functional Requirements
1. ระบบต้องสามารถสร้างและแสดง QR Code สำหรับแต่ละโต๊ะในร้านอาหาร
2. ระบบต้องสามารถแสดงเมนูอาหารให้ลูกค้าดูผ่านการสแกน QR Code
3. ระบบต้องสามารถรับคำสั่งซื้ออาหารจากลูกค้าและบันทึกลงในฐานข้อมูล
4. ระบบต้องสามารถประมวลผลการชำระเงินออนไลน์ได้อย่างปลอดภัย
5. ระบบต้องสามารถแจ้งเตือนพนักงานเมื่อมีคำสั่งซื้อใหม่เข้ามา
6. ระบบต้องสามารถจัดการเมนูอาหารโดยเจ้าของร้านได้ (เพิ่ม แก้ไข ลบ)
7. ระบบต้องสามารถจัดการคำสั่งซื้อโดยพนักงานได้ (ดู อัปเดตสถานะ)
8. ระบบต้องสามารถสร้างรายงานยอดขายและคำสั่งซื้อสำหรับเจ้าของร้านได้
## Non-Functional Requirements
1. ระบบต้องมีความปลอดภัยสูงในการจัดการข้อมูลลูกค้าและการชำระเงิน
2. ระบบต้องมีความเสถียรและสามารถรองรับการใช้งานพร้อมกันได้หลายคน
3. ระบบต้องมีอินเทอร์เฟซที่ใช้งานง่ายและเป็นมิตรกับผู้ใช้
4. ระบบต้องสามารถเข้าถึงได้จากอุปกรณ์หลากหลายประเภท (สมาร์ทโฟน แท็บเล็ต คอมพิวเตอร์)
5. ระบบต้องมีการสำรองข้อมูลอย่างสม่ำเสมอเพื่อป้องกันการสูญหายของข้อมูล
6. ระบบต้องมีประสิทธิภาพในการประมวลผลคำสั่งซื้อและการแสดงผลเมนูอาหารอย่างรวดเร็ว
7. ระบบต้องสามารถปรับขนาดได้ง่ายเมื่อต้องการเพิ่มฟีเจอร์หรือรองรับผู้ใช้มากขึ้นในอนาคต
# USER STORIES
1. ในฐานะลูกค้า ฉันต้องการสแกน QR Code ที่โต๊ะเพื่อดูเมนูอาหารและสั่งอาหารได้อย่างรวดเร็ว
2. ในฐานะลูกค้า ฉันต้องการชำระเงินออนไลน์เพื่อความสะดวกและปลอดภัย
3. ในฐานะพนักงาน ฉันต้องการได้รับแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่เพื่อเตรียมอาหารให้ทันเวลา
4. ในฐานะเจ้าของร้าน ฉันต้องการจัดการเมนูอาหารได้อย่างง่ายดายเพื่อให้ทันสมัยและตอบสนองความต้องการของลูกค้า
5. ในฐานะพนักงาน ฉันต้องการดูและอัปเดตสถานะคำสั่งซื้อเพื่อให้ลูกค้าทราบความคืบหน้า
6. ในฐานะเจ้าของร้าน ฉันต้องการดูรายงานยอดขายเพื่อวิเคราะห์และปรับปรุงการบริการของร้าน
7. ในฐานะลูกค้า ฉันต้องการให้ระบบมีอินเทอร์เฟซที่ใช้งานง่ายเพื่อให้ฉันสามารถสั่งอาหารได้โดยไม่ยุ่งยาก
8. ในฐานะเจ้าของร้าน ฉันต้องการให้ระบบมีความปลอดภัยสูงเพื่อปกป้องข้อมูลลูกค้าและการชำระเงิน
9. ในฐานะพนักงาน ฉันต้องการให้ระบบมีประสิทธิภาพในการประมวลผลคำสั่งซื้อเพื่อให้ฉันสามารถทำงานได้อย่างรวดเร็ว
10. ในฐานะเจ้าของร้าน ฉันต้องการให้ระบบสามารถปรับขนาดได้ง่ายเพื่อรองรับการเติบโตของธุรกิจในอนาคต      
# TECHNICAL SPECIFICATIONS
- Frontend: Next.js 16 (App Router), TailwindCSS, TypeScript
- Backend: Next.js API Routes + MongoDB (Mongoose)
- Payment Gateway: Stripe (Test Mode for demo)
- QR Code Generation: qrcode.react
- Authentication: NextAuth.js v5 (staff/owner only, JWT-based)
  - Roles: staff, owner
  - Guest checkout for customers (no auth required)
- Real-time: Socket.io (for order notifications & status updates)
- Database: MongoDB Atlas (Free tier - 512MB)
- Deployment: DigitalOcean App Platform (Basic - $5/month)
- CI/CD: GitHub Actions + DO Auto-deploy
- Monitoring: Sentry (error tracking), DigitalOcean Metrics (resource monitoring)

# DATABASE SCHEMA DESIGN
## Collections

### 1. branches
```javascript
{
  _id: ObjectId,
  name: String,            // required (e.g., "สาขาสยาม", "สาขาเอกมัย")
  slug: String,            // unique, required (e.g., "siam", "ekkamai")
  location: {
    address: String,
    district: String,
    city: String,
    province: String,
    postalCode: String,
    lat: Number,           // optional
    lng: Number            // optional
  },
  contact: {
    phone: String,
    email: String          // optional
  },
  settings: {
    openingHours: Object,  // { monday: { open: "09:00", close: "22:00" }, ... }
    timezone: String,      // "Asia/Bangkok"
    taxRate: Number        // e.g., 7 (for 7% VAT)
  },
  isActive: Boolean,       // default: true
  createdAt: Date,
  updatedAt: Date
}
```

### 2. users
```javascript
{
  _id: ObjectId,
  branchId: ObjectId,      // ref: branches (null for owner, required for staff)
  email: String,           // unique, required
  password: String,        // hashed with bcrypt
  name: String,            // required
  role: String,            // "staff" | "owner"
  isActive: Boolean,       // default: true
  createdAt: Date,
  updatedAt: Date
}
```

### 3. branchMenuItems
```javascript
{
  _id: ObjectId,
  branchId: ObjectId,      // ref: branches, required
  menuItemId: ObjectId,    // ref: menuItems, required
  isAvailable: Boolean,    // whether this branch sells this item, default: true
  createdAt: Date,
  updatedAt: Date
}
// Compound index: { branchId: 1, menuItemId: 1 } - unique
// Note: If no record exists for a branch-menuItem pair, assume available
```

### 4. tables
```javascript
{
  _id: ObjectId,
  branchId: ObjectId,      // ref: branches, required
  tableNumber: String,     // required (e.g., "T01", "T02")
  qrCode: String,          // unique QR code identifier
  capacity: Number,        // number of seats
  isAvailable: Boolean,    // default: true
  createdAt: Date,
  updatedAt: Date
}
// Compound index: { branchId: 1, tableNumber: 1 } - unique
// Single index: { qrCode: 1 } - unique
```

### 5. categories
```javascript
{
  _id: ObjectId,
  name: String,            // unique, required (e.g., "Appetizers", "Main Course")
  description: String,
  displayOrder: Number,    // for sorting
  isActive: Boolean,       // default: true
  createdAt: Date,
  updatedAt: Date
}
```

### 6. menuItems
```javascript
{
  _id: ObjectId,
  name: String,            // required
  description: String,
  price: Number,           // required, in cents (e.g., 15000 = 150.00 THB)
  categoryId: ObjectId,    // ref: categories
  imageUrl: String,        // optional
  isAvailable: Boolean,    // default: true (global availability)
  preparationTime: Number, // in minutes
  allergens: [String],     // e.g., ["peanuts", "dairy"]
  spicyLevel: Number,      // 0-5 scale
  createdAt: Date,
  updatedAt: Date
}
// Note: Branch-specific availability is managed via branchMenuItems collection
```

### 7. orders
```javascript
{
  _id: ObjectId,
  orderNumber: String,     // unique, auto-generated (e.g., "ORD-20251122-001")
  branchId: ObjectId,      // ref: branches, required
  tableId: ObjectId,       // ref: tables
  items: [{
    menuItemId: ObjectId,  // ref: menuItems
    name: String,          // snapshot of menu item name
    price: Number,         // snapshot of price at order time
    quantity: Number,
    specialInstructions: String
  }],
  subtotal: Number,        // in cents
  tax: Number,             // in cents
  total: Number,           // in cents
  status: String,          // "pending" | "confirmed" | "preparing" | "ready" | "served" | "cancelled"
  paymentStatus: String,   // "pending" | "completed" | "failed" | "refunded"
  paymentMethod: String,   // "stripe" | "cash"
  stripePaymentIntentId: String, // if paid via Stripe
  sessionId: String,       // for guest order tracking
  staffId: ObjectId,       // ref: users (if ordered via staff)
  notes: String,           // internal notes
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

### 8. payments
```javascript
{
  _id: ObjectId,
  orderId: ObjectId,       // ref: orders
  amount: Number,          // in cents
  currency: String,        // "THB"
  paymentMethod: String,   // "stripe" | "cash"
  stripePaymentIntentId: String,
  stripeChargeId: String,
  status: String,          // "pending" | "succeeded" | "failed" | "refunded"
  metadata: Object,        // additional Stripe data
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes (for performance)
```javascript
// branches
{ slug: 1 } - unique
{ isActive: 1 }

// users
{ email: 1 } - unique
{ branchId: 1 }

// branchMenuItems
{ branchId: 1, menuItemId: 1 } - unique (compound)
{ menuItemId: 1 }

// tables
{ branchId: 1, tableNumber: 1 } - unique (compound)
{ qrCode: 1 } - unique
{ branchId: 1, isAvailable: 1 }

// categories
{ displayOrder: 1 }
{ isActive: 1 }

// menuItems
{ categoryId: 1 }
{ isAvailable: 1 }

// orders
{ orderNumber: 1 } - unique
{ branchId: 1, createdAt: -1 }
{ tableId: 1, createdAt: -1 }
{ sessionId: 1 }
{ status: 1, createdAt: -1 }
{ branchId: 1, status: 1, createdAt: -1 }

// payments
{ orderId: 1 }
{ stripePaymentIntentId: 1 }
```

# API ENDPOINTS DOCUMENTATION

## Public Endpoints (No Auth Required)

### Branches
```
GET  /api/branches
     - Get all active branches
     - Response: { branches: [...] }

GET  /api/branches/:slug
     - Get branch by slug
     - Response: { branch: {...} }
```

### Menu & Categories
```
GET  /api/menu
     - Get all active menu items with categories
     - Query params: ?branchId=xxx&categoryId=xxx
     - Response: { categories: [...], menuItems: [...] }
     - Note: Filters by branch availability if branchId provided

GET  /api/menu/:id
     - Get single menu item details
     - Query params: ?branchId=xxx
     - Response: { menuItem: {...} }

GET  /api/categories
     - Get all active categories
     - Response: { categories: [...] }
```

### Tables
```
GET  /api/tables/:qrCode
     - Get table info by QR code
     - Response: { table: {...} }
```

### Orders (Guest)
```
POST /api/orders
     - Create new order (guest checkout)
     - Body: { tableId, items: [...], sessionId }
     - Response: { order: {...}, sessionId }

GET  /api/orders/session/:sessionId
     - Get order by session ID (for guest tracking)
     - Response: { order: {...} }

GET  /api/orders/:id/status
     - Get order status
     - Response: { status, updatedAt }
```

### Payments
```
POST /api/payments/create-intent
     - Create Stripe payment intent
     - Body: { orderId, amount }
     - Response: { clientSecret, paymentIntentId }

POST /api/payments/webhook
     - Stripe webhook handler
     - Handles: payment_intent.succeeded, payment_intent.failed
```

## Protected Endpoints (Auth Required)

### Auth
```
POST /api/auth/login
     - Staff/Owner login
     - Body: { email, password }
     - Response: { user: {...}, token }

POST /api/auth/logout
     - Logout current user
     - Response: { success: true }

GET  /api/auth/me
     - Get current user info
     - Response: { user: {...} }
```

### Menu Management (Owner only)
```
POST /api/admin/menu
     - Create new menu item
     - Body: { name, description, price, categoryId, ... }
     - Response: { menuItem: {...} }

PUT  /api/admin/menu/:id
     - Update menu item
     - Body: { name, price, isAvailable, ... }
     - Response: { menuItem: {...} }

DELETE /api/admin/menu/:id
     - Delete menu item (soft delete)
     - Response: { success: true }

POST /api/admin/categories
     - Create new category
     - Body: { name, description, displayOrder }
     - Response: { category: {...} }

PUT  /api/admin/categories/:id
     - Update category
     - Response: { category: {...} }
```

### Order Management (Staff & Owner)
```
GET  /api/admin/orders
     - Get all orders
     - Query params: ?status=pending&date=2025-11-22&limit=50
     - Response: { orders: [...], total, page }

GET  /api/admin/orders/:id
     - Get order details
     - Response: { order: {...} }

PATCH /api/admin/orders/:id/status
      - Update order status
      - Body: { status: "preparing" | "ready" | "served" }
      - Response: { order: {...} }
      - Triggers: Socket.io event to notify client

POST /api/admin/orders
     - Create order via staff (cash payment)
     - Body: { tableId, items: [...], paymentMethod: "cash" }
     - Response: { order: {...} }

DELETE /api/admin/orders/:id
       - Cancel order
       - Response: { success: true }
```

### Table Management (Owner only)
```
GET  /api/admin/tables
     - Get all tables
     - Response: { tables: [...] }

POST /api/admin/tables
     - Create new table
     - Body: { tableNumber, capacity }
     - Response: { table: {...}, qrCode }

PUT  /api/admin/tables/:id
     - Update table
     - Body: { tableNumber, capacity, isAvailable }
     - Response: { table: {...} }

DELETE /api/admin/tables/:id
       - Delete table
       - Response: { success: true }

GET  /api/admin/tables/:id/qr
     - Generate/regenerate QR code
     - Response: { qrCodeDataUrl, qrCode }
```

### User Management (Owner only)
```
GET  /api/admin/users
     - Get all staff/owner users
     - Query params: ?branchId=xxx (filter by branch)
     - Response: { users: [...] }

POST /api/admin/users
     - Create new user
     - Body: { email, password, name, role, branchId }
     - Response: { user: {...} }

PUT  /api/admin/users/:id
     - Update user
     - Body: { name, role, branchId, isActive }
     - Response: { user: {...} }

DELETE /api/admin/users/:id
       - Delete user (soft delete)
       - Response: { success: true }
```

### Branch Management (Owner only)
```
GET  /api/admin/branches
     - Get all branches
     - Response: { branches: [...] }

GET  /api/admin/branches/:id
     - Get branch details
     - Response: { branch: {...} }

POST /api/admin/branches
     - Create new branch
     - Body: { name, slug, location, contact, settings }
     - Response: { branch: {...} }

PUT  /api/admin/branches/:id
     - Update branch
     - Body: { name, location, contact, settings, isActive }
     - Response: { branch: {...} }

DELETE /api/admin/branches/:id
       - Delete branch (soft delete)
       - Response: { success: true }
```

### Branch Menu Management (Owner only)
```
GET  /api/admin/branches/:branchId/menu
     - Get branch menu availability
     - Response: { menuItems: [{ menuItem: {...}, isAvailable: true/false }] }

PATCH /api/admin/branches/:branchId/menu/:menuItemId
      - Toggle menu item availability for branch
      - Body: { isAvailable: true/false }
      - Response: { branchMenuItem: {...} }

POST /api/admin/branches/:branchId/menu/bulk-update
     - Bulk update menu availability for branch
     - Body: { updates: [{ menuItemId, isAvailable }, ...] }
     - Response: { updated: number }
```

### Reports (Owner only)
```
GET  /api/admin/reports/sales
     - Get sales report
     - Query params: ?branchId=xxx&startDate=2025-11-01&endDate=2025-11-30
     - Response: {
         totalSales,
         totalOrders,
         averageOrderValue,
         dailyBreakdown: [...],
         branchBreakdown: [...] // if no branchId specified
       }

GET  /api/admin/reports/popular-items
     - Get popular menu items
     - Query params: ?branchId=xxx&startDate=xxx&endDate=xxx&limit=10
     - Response: { items: [{menuItem, orderCount, revenue}] }

GET  /api/admin/reports/orders
     - Get orders report
     - Query params: ?branchId=xxx&startDate=xxx&endDate=xxx
     - Response: { orders: [...], summary: {...} }

GET  /api/admin/reports/branches
     - Get branch comparison report
     - Query params: ?startDate=xxx&endDate=xxx
     - Response: {
         branches: [{
           branchId,
           branchName,
           totalSales,
           totalOrders,
           averageOrderValue,
           topItems: [...]
         }]
       }
```

## WebSocket Events (Socket.io)

### Client → Server
```
'join-staff-room'
  - Staff joins to receive order notifications
  - Data: { userId, role }

'join-order-room'
  - Guest joins to receive their order updates
  - Data: { sessionId }
```

### Server → Client
```
'new-order'
  - Emitted to staff when new order is placed
  - Data: { order: {...} }

'order-status-updated'
  - Emitted to client when order status changes
  - Data: { orderId, status, updatedAt }

'order-cancelled'
  - Emitted when order is cancelled
  - Data: { orderId }
```

## Response Status Codes
```
200 - OK
201 - Created
400 - Bad Request (validation error)
401 - Unauthorized (not authenticated)
403 - Forbidden (not authorized for this action)
404 - Not Found
409 - Conflict (duplicate resource)
500 - Internal Server Error
```

## Error Response Format
```javascript
{
  error: {
    message: "Detailed error message",
    code: "ERROR_CODE",
    details: {...} // optional
  }
}
```

# PAYMENT FLOW & ERROR HANDLING

## Payment Flow (Stripe)

### 1. Guest Order Flow
```
1. Customer selects items → Add to cart
2. Customer proceeds to checkout
3. Frontend → POST /api/orders (without payment)
   - Creates order with status: "pending"
   - Returns orderId and sessionId

4. Frontend → POST /api/payments/create-intent
   - Body: { orderId, amount }
   - Backend creates Stripe PaymentIntent
   - Returns clientSecret

5. Frontend shows Stripe Elements (card input)
6. Customer enters card details
7. Frontend calls stripe.confirmCardPayment(clientSecret)

8. Success scenario:
   - Stripe processes payment
   - Stripe calls webhook: POST /api/payments/webhook
   - Backend updates order status: "confirmed"
   - Backend updates payment status: "completed"
   - Backend emits Socket.io event: 'new-order' to staff
   - Frontend redirects to success page

9. Failure scenario:
   - Stripe returns error
   - Frontend shows error message
   - Order remains in "pending" status
   - Customer can retry payment
```

### 2. Staff Order Flow (Cash Payment)
```
1. Staff enters order via admin panel
2. Staff selects "Cash Payment"
3. Frontend → POST /api/admin/orders
   - Body: { tableId, items, paymentMethod: "cash" }
   - Backend creates order with status: "confirmed"
   - Backend creates payment record with status: "completed"
   - Backend emits Socket.io event: 'new-order'
4. Staff collects cash from customer
5. Staff marks order as completed when food is served
```

## Error Handling Scenarios

### 1. Payment Failures
```javascript
// Stripe payment declined
- Display user-friendly error: "Payment declined. Please try another card."
- Keep order in "pending" status
- Allow retry with different payment method
- Log error to Sentry

// Network error during payment
- Show: "Connection lost. Please check your payment status before retrying."
- Provide link to check order status via sessionId
- Do not create duplicate orders
```

### 2. Duplicate Order Prevention
```javascript
// Check for duplicate orders
- Use sessionId + tableId + timestamp to detect duplicates
- If same sessionId has pending order within 5 minutes → reject
- Return 409 Conflict with existing order info

// Idempotency for payment intent
- Use orderId as idempotency_key in Stripe
- If payment intent exists for orderId → return existing clientSecret
```

### 3. Out of Stock Items
```javascript
// Before order creation
- Check menuItem.isAvailable for all items
- If any item unavailable → return 400 Bad Request
- Response: { error: "Item 'Pad Thai' is currently unavailable" }

// During order preparation
- If item becomes unavailable after order placed
- Staff can cancel specific items
- Backend recalculates total
- Partial refund via Stripe if already paid
```

### 4. Invalid QR Code
```javascript
// Customer scans invalid/deleted QR code
GET /api/tables/:qrCode
- If table not found → 404 Not Found
- Response: { error: "Invalid table QR code. Please ask staff for assistance." }
- Frontend shows helpful error with support contact
```

### 5. Order Cancellation & Refund
```javascript
// Before payment completion
- Simply delete order (status: "cancelled")
- No refund needed

// After payment completion (within 1 hour)
- Staff/Owner can cancel order
- Backend creates Stripe refund
- Update payment status: "refunded"
- Emit Socket.io event to customer
- Show refund confirmation

// After food preparation started
- Show warning: "Food is already being prepared. Cancellation may not be possible."
- Require owner approval
- Partial refund if applicable
```

### 6. Session Timeout
```javascript
// Order not paid within 15 minutes
- Cron job checks for pending orders older than 15 minutes
- Auto-cancel order
- Send notification if contact info available
- Clean up sessionId
```

### 7. Stripe Webhook Failures
```javascript
// Webhook not received or fails
- Implement webhook retry logic (Stripe auto-retries)
- Fallback: Poll Stripe API for payment status
- Log webhook failures to Sentry
- Alert admin if webhook down for > 5 minutes

// Webhook signature validation
- Always verify webhook signature
- Reject invalid signatures (prevent fraud)
- Log suspicious webhook attempts
```

## Error Codes Reference
```javascript
// Payment Errors
PAYMENT_FAILED: "Payment processing failed"
PAYMENT_DECLINED: "Payment was declined"
INSUFFICIENT_FUNDS: "Insufficient funds"
CARD_EXPIRED: "Card has expired"

// Order Errors
ORDER_NOT_FOUND: "Order not found"
DUPLICATE_ORDER: "Duplicate order detected"
INVALID_ORDER_STATUS: "Cannot perform action on order with current status"
ITEMS_UNAVAILABLE: "One or more items are unavailable"

// Validation Errors
INVALID_INPUT: "Invalid input data"
MISSING_REQUIRED_FIELD: "Required field is missing"
INVALID_TABLE: "Invalid table QR code"

// System Errors
DATABASE_ERROR: "Database operation failed"
EXTERNAL_SERVICE_ERROR: "External service unavailable"
RATE_LIMIT_EXCEEDED: "Too many requests"
```

## Retry Logic
```javascript
// Payment retry
- Allow up to 3 payment attempts per order
- After 3 failures → suggest cash payment or contact staff
- Track failed attempts in order metadata

// API retry (client-side)
- Implement exponential backoff
- Retry on 5xx errors (max 3 times)
- Don't retry on 4xx errors (client errors)

// Webhook retry (Stripe)
- Stripe automatically retries for 3 days
- We log each attempt
- Manual reconciliation available in admin panel
```

# SECURITY REQUIREMENTS

## Authentication & Authorization

### 1. Password Security
```javascript
// Password hashing
- Use bcrypt with salt rounds = 12
- Never store plain text passwords
- Minimum password requirements:
  * Length: 8+ characters
  * Must include: uppercase, lowercase, number
  * Optional: special characters for extra security

// Password reset (future feature)
- Send reset token via email
- Token expires in 1 hour
- One-time use only
```

### 2. JWT Token Security
```javascript
// Token configuration
- Algorithm: HS256
- Expiration: 24 hours (access token)
- Store in httpOnly cookies (prevent XSS)
- Include: { userId, role, email }

// Token validation
- Verify signature on every request
- Check expiration
- Validate role for protected routes
- Implement token blacklist for logout
```

### 3. Role-Based Access Control (RBAC)
```javascript
// Middleware: requireAuth
- Verify JWT token exists and valid
- Attach user info to request

// Middleware: requireRole(['owner'])
- Check user.role matches required roles
- Return 403 Forbidden if unauthorized

// Route protection example:
POST /api/admin/users → requireAuth + requireRole(['owner'])
PATCH /api/admin/orders/:id/status → requireAuth + requireRole(['staff', 'owner'])
```

## Data Security

### 1. Input Validation & Sanitization
```javascript
// Use validation library (Zod or Joi)
- Validate all user inputs
- Sanitize strings to prevent XSS
- Validate email format
- Validate price/amount (positive numbers only)
- Limit string lengths

// Example validations:
email: z.string().email()
price: z.number().positive().int() // in cents
orderItems: z.array(z.object({...})).min(1).max(50)
```

### 2. SQL/NoSQL Injection Prevention
```javascript
// MongoDB injection prevention
- Use Mongoose schema validation
- Never use raw queries with user input
- Sanitize query parameters
- Use parameterized queries

// Example: NEVER do this
db.users.find({ email: req.body.email }) // vulnerable

// Example: DO this instead
const user = await User.findOne({ email: sanitized(req.body.email) })
```

### 3. Sensitive Data Protection
```javascript
// Environment variables
- Store in .env file (never commit to git)
- Required secrets:
  * DATABASE_URL
  * JWT_SECRET (generate with crypto.randomBytes(64))
  * STRIPE_SECRET_KEY
  * STRIPE_WEBHOOK_SECRET
  * NEXTAUTH_SECRET

// Data encryption
- HTTPS only (enforce SSL/TLS)
- Encrypt sensitive data at rest (if needed)
- Mask credit card numbers in logs
- Never log passwords or tokens
```

## API Security

### 1. Rate Limiting
```javascript
// Implement rate limiting middleware
- General API: 100 requests per 15 minutes per IP
- Login endpoint: 5 attempts per 15 minutes per IP
- Payment endpoint: 10 requests per hour per session
- Use: express-rate-limit or upstash-ratelimit

// Response when rate limited:
429 Too Many Requests
{ error: "Too many requests. Please try again later." }
```

### 2. CORS Configuration
```javascript
// Allow specific origins only
const corsOptions = {
  origin: process.env.FRONTEND_URL, // e.g., https://yourapp.com
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// For development: allow localhost
// For production: whitelist specific domains only
```

### 3. Request Size Limits
```javascript
// Prevent large payload attacks
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// File upload limits (if implemented)
- Max file size: 5MB per image
- Allowed types: jpg, png, webp only
- Scan uploads for malware (if needed)
```

### 4. Security Headers
```javascript
// Use Helmet.js for security headers
- X-Frame-Options: DENY (prevent clickjacking)
- X-Content-Type-Options: nosniff
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy: default-src 'self'
- X-XSS-Protection: 1; mode=block
```

## Payment Security

### 1. Stripe Security
```javascript
// Never expose secret keys
- Use publishable key in frontend only
- Secret key stays in backend environment variables
- Use Stripe Elements (PCI compliant)
- Never handle raw card data

// Webhook signature verification
const sig = request.headers['stripe-signature']
const event = stripe.webhooks.constructEvent(
  request.body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
)
// Reject if signature invalid
```

### 2. Transaction Security
```javascript
// Idempotency
- Use orderId as idempotency key
- Prevent duplicate charges
- Handle retry scenarios safely

// Amount verification
- Always verify amount on backend
- Never trust frontend calculations
- Recalculate total from menuItems prices

// Audit trail
- Log all payment attempts
- Store payment metadata
- Track refunds and cancellations
```

## Guest Order Security

### 1. Session Management
```javascript
// Generate secure sessionId
- Use crypto.randomUUID() or nanoid
- Store in httpOnly cookie (if possible)
- Or localStorage with expiration
- Format: "session_" + randomString(32)

// Session validation
- Verify sessionId format
- Check session not expired (15 min timeout)
- Rate limit orders per session (max 5 per hour)
```

### 2. Anonymous Data Collection (Privacy-friendly)
```javascript
// Data we CAN collect from guests (no PII):
- Device type: "mobile" | "tablet" | "desktop" (from User-Agent)
- Browser: "Chrome", "Safari", etc.
- Screen size: viewport dimensions
- Order timestamp
- IP address (hashed for analytics, not stored raw)
- Locale/language preference

// Data stored in orders collection:
{
  sessionId: "session_abc123",
  deviceInfo: {
    deviceType: "mobile",    // from User-Agent parsing
    browser: "Chrome",
    viewport: "390x844",
    os: "iOS"
  },
  ipHash: "hashed_ip",       // for fraud detection only
  locale: "th-TH",
  createdAt: Date
}

// Analytics we can derive:
- Popular menu items
- Peak ordering times
- Mobile vs desktop usage
- Average order value
- Order completion rate

// Optional: Ask for phone number
- Only if customer wants order updates via SMS
- Make it optional, not required
- Show clear privacy notice
- Allow opt-out anytime
```

### 3. Privacy Compliance
```javascript
// PDPA compliance (Thailand)
- Display privacy policy link
- Explain what data is collected and why
- No tracking without consent
- Provide data deletion option (for registered users in future)

// Cookie consent
- Show cookie banner for analytics cookies
- Required cookies: session, auth (no consent needed)
- Optional cookies: analytics, preferences (require consent)
```

## System Security

### 1. Database Security
```javascript
// MongoDB Atlas security
- Enable IP whitelist (production only)
- Use strong password (generated)
- Enable audit logs
- Regular automated backups
- Encrypt data at rest (Atlas default)

// Connection security
- Use mongodb+srv:// (TLS/SSL)
- Never expose connection string
- Use separate DB for dev/staging/production
```

### 2. Secrets Management
```javascript
// Development
- Use .env file (add to .gitignore)
- Share secrets securely (1Password, encrypted)

// Production (DigitalOcean App Platform)
- Store in environment variables
- Use DO's encrypted secrets storage
- Rotate secrets periodically (every 90 days)
- Never commit .env to git
```

### 3. Logging & Monitoring
```javascript
// What to log:
- Failed login attempts (potential brute force)
- Payment failures
- API errors (500s)
- Suspicious activities (rate limit hits)
- Webhook failures

// What NOT to log:
- Passwords (even hashed)
- Full credit card numbers
- JWT tokens
- API keys
- Personal identifiable information (PII)

// Log format:
{
  timestamp: "2025-11-22T10:30:00Z",
  level: "error",
  message: "Payment failed",
  orderId: "ORD-123",
  errorCode: "PAYMENT_DECLINED",
  // NO sensitive data
}
```

### 4. Error Handling
```javascript
// Production error responses
- Hide internal error details
- Return generic messages to users
- Log full error details server-side

// Example:
// DON'T: "MongoDB connection failed at 10.0.1.5:27017"
// DO: "Service temporarily unavailable. Please try again."

// Sentry configuration
- Filter sensitive data before sending
- Set environment (development/production)
- Set release version
- Enable source maps
```

## Mobile-First Security Considerations
```javascript
// Since customers use mobile devices:
1. HTTPS mandatory (prevent MITM attacks)
2. Responsive UI won't accidentally expose sensitive data
3. Touch-friendly buttons prevent misclicks
4. Clear confirmation dialogs before payment
5. Timeout warnings before session expires
6. Option to "Continue on another device" with QR code
7. Secure QR code generation (prevent guessing)
```

# PERFORMANCE METRICS & REQUIREMENTS

## Response Time Targets

### Frontend Performance
```javascript
// Page Load Times (Mobile 4G)
- Menu page (initial load): < 2 seconds
- Order status page: < 1.5 seconds
- Admin dashboard: < 3 seconds
- QR scan → menu display: < 1 second

// Time to Interactive (TTI)
- Menu page: < 3 seconds
- Checkout flow: < 2.5 seconds

// Core Web Vitals
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

// Bundle Size
- Initial JS bundle: < 200KB (gzipped)
- CSS bundle: < 50KB (gzipped)
- Menu images: < 100KB each (optimized WebP)
```

### API Performance
```javascript
// Response Times (95th percentile)
GET  /api/menu                    < 200ms
POST /api/orders                  < 300ms
GET  /api/orders/:id/status       < 100ms
PATCH /api/admin/orders/:id       < 200ms
GET  /api/admin/reports/sales     < 500ms

// Database Query Performance
- Simple find queries: < 50ms
- Aggregation queries: < 200ms
- Write operations: < 100ms

// Real-time Updates (Socket.io)
- Event emission to client: < 100ms
- Connection establishment: < 500ms
```

## Scalability Targets

### Concurrent Users
```javascript
// Expected Load (per restaurant)
- Peak hours: 50 concurrent orders
- Average: 10-20 concurrent users
- Staff/Admin: 5-10 concurrent users

// System Capacity (MVP)
- Handle 100 concurrent connections
- Process 200 requests/minute
- Support 10 restaurants (multi-tenant ready)
```

### Database Performance
```javascript
// MongoDB Atlas Free Tier
- Storage: 512MB (sufficient for ~10,000 orders)
- Connections: 500 max
- Backup: Automated daily

// Query Optimization
- Index coverage: 95%+ queries use indexes
- Query execution time: < 50ms average
- Connection pooling: 10-20 connections
```

### WebSocket Performance
```javascript
// Socket.io Metrics
- Max concurrent connections: 200
- Event latency: < 100ms
- Reconnection time: < 2 seconds
- Message delivery guarantee: at-least-once
```

## Resource Usage Targets

### Server Resources (DigitalOcean App Platform)
```javascript
// Basic Plan ($5/month)
- Memory: 512MB - 1GB
- CPU: Shared vCPU
- Disk: 10GB

// Target Resource Usage
- Average memory: < 400MB
- Peak memory: < 800MB
- CPU usage: < 50% average
- Disk usage: < 2GB (mostly logs & cache)
```

### Browser Resource Usage
```javascript
// Mobile Devices (Target: mid-range phones from 2020+)
- Memory footprint: < 100MB
- CPU usage: < 30% during interactions
- Battery impact: Minimal (efficient JS, optimized images)

// Offline Capability (Future Enhancement)
- Cache menu data for offline viewing
- Queue orders when offline (submit when online)
```

## Network Performance

### Data Transfer
```javascript
// Initial Page Load
- HTML: < 20KB
- CSS: < 50KB
- JavaScript: < 200KB
- Images (lazy loaded): 50-100KB each

// API Request/Response Sizes
POST /api/orders → Request: ~2KB, Response: ~1KB
GET /api/menu → Response: ~50KB (compressed)

// Optimization Techniques
- Gzip/Brotli compression
- Image optimization (WebP, lazy loading)
- Code splitting (Next.js automatic)
- CDN for static assets (optional)
```

### Mobile Network Support
```javascript
// Minimum Supported Connection
- 3G (1 Mbps) should be usable
- Optimize for 4G (10+ Mbps)
- Prepare for 5G (100+ Mbps)

// Progressive Enhancement
- Works on slow connections (degraded experience)
- Optimal on 4G+
- Show loading states clearly
- Offline message when disconnected
```

## Availability & Reliability

### Uptime Targets
```javascript
// Service Level Objectives (SLO)
- Uptime: 99.5% (MVP) → 43.8 hours downtime/year
- Database uptime: 99.9% (MongoDB Atlas SLA)
- Payment gateway: 99.99% (Stripe SLA)

// Planned Maintenance
- Schedule during off-peak hours
- Notify users 24 hours in advance
- Max 2 hours maintenance window
```

### Error Rates
```javascript
// Acceptable Error Rates
- API errors (5xx): < 0.5%
- Payment failures (system): < 0.1%
- Failed order submissions: < 1%

// Monitoring Thresholds (trigger alerts)
- Error rate > 5% for 5 minutes
- API response time > 2s for 5 minutes
- Memory usage > 90% for 10 minutes
- Disk usage > 80%
```

## Testing Performance Benchmarks

### Load Testing Scenarios
```javascript
// Test Scenario 1: Peak Lunch Rush
- 50 concurrent users
- 100 orders per hour
- Duration: 2 hours
- Expected: < 5% error rate, < 2s response time

// Test Scenario 2: Menu Browsing
- 100 concurrent users browsing menu
- Duration: 30 minutes
- Expected: < 1s page load time

// Test Scenario 3: Staff Dashboard
- 5 concurrent staff updating orders
- 20 status updates per minute
- Expected: Real-time updates < 500ms delay
```

### Performance Testing Tools
```javascript
// Load Testing
- Artillery or k6 for API load testing
- Lighthouse for frontend performance
- Chrome DevTools for profiling

// Monitoring (Production)
- Vercel Analytics (if using Vercel)
- DigitalOcean Metrics (CPU, Memory, Network)
- Sentry Performance Monitoring
- Custom logging for business metrics
```

## Optimization Strategies

### Frontend Optimizations
```javascript
1. Next.js 16 Features
   - Turbopack for faster builds
   - Automatic code splitting
   - Image optimization (next/image)
   - Font optimization

2. React Optimizations
   - Memoization (useMemo, React.memo)
   - Lazy loading components
   - Virtual scrolling for long lists (if needed)

3. Caching Strategy
   - Static pages: ISR (Incremental Static Regeneration)
   - API responses: Cache-Control headers
   - Menu data: Cache for 5 minutes
   - Order status: No cache (real-time)
```

### Backend Optimizations
```javascript
1. Database Optimizations
   - Proper indexing (defined in schema)
   - Query projection (select only needed fields)
   - Aggregation pipelines for reports
   - Connection pooling

2. API Optimizations
   - Pagination for list endpoints (default: 50 items)
   - Compression (gzip/brotli)
   - Response caching where appropriate
   - Batch operations when possible

3. Real-time Optimizations
   - Room-based Socket.io (not broadcast to all)
   - Compress Socket.io messages
   - Throttle status updates (max 1/sec per order)
```

## Mobile-First Performance Considerations
```javascript
// Design for mobile users first
1. Touch-optimized UI (44x44px minimum tap targets)
2. Reduced animations on low-end devices
3. Lazy load images below the fold
4. Progressive image loading (blur-up technique)
5. Minimize main thread work
6. Use CSS containment for better rendering
7. Prefetch critical resources
8. Service Worker for offline support (future)

// Responsive Images
- Use next/image with multiple sizes
- Format: WebP with JPG fallback
- Lazy loading by default
- Blur placeholder while loading
```

## Success Metrics (KPIs)

### User Experience Metrics
```javascript
// Track in analytics
- Average time from QR scan to order placed: < 3 minutes
- Order completion rate: > 85%
- Payment success rate: > 95%
- Customer returns to track order: < 30%
  (means status updates are working well)
```

### Technical Metrics
```javascript
// Monitor continuously
- API p95 response time: < 500ms
- Error rate: < 1%
- Real-time event delivery: > 99%
- Database query performance: < 100ms p95
```

### Business Metrics
```javascript
// Report to stakeholders
- Orders per day (track growth)
- Average order value
- Peak ordering hours
- Popular menu items
- Staff efficiency (time to mark order ready)
``` 
