# QR Ordering Web App - TODO List

## Phase 1: Project Setup & Infrastructure ✅

### 1.1 Initial Setup
- [x] Initialize Next.js 16 project with TypeScript
- [x] Configure TailwindCSS
- [x] Setup project folder structure (Modified to root-level)
  ```
  /app                 # Next.js 16 App Router
  /components          # React components
  /lib                 # Utilities & configs
  /models              # Mongoose models
  /types               # TypeScript types
  /utils               # Utility functions
  ```
- [x] Setup ESLint and Prettier
- [x] Create `.env.local` template
- [x] Initialize Git repository and create `.gitignore`

### 1.2 Database Setup
- [x] Setup database and get connection string (Using Docker MongoDB local)
- [x] Install Mongoose and configure connection
- [x] Create database connection utility (`/lib/mongodb.ts`)

### 1.3 Third-party Services Setup
- [ ] Setup Stripe account (Test mode)
- [ ] Get Stripe API keys (publishable & secret)
- [x] Setup NextAuth.js v5 configuration
- [x] Generate JWT secret for NextAuth
- [ ] Install and configure Socket.io

### 1.4 Development Tools
- [ ] Install and configure Sentry for error tracking
- [x] Setup environment variables management
- [x] Create development npm scripts

---

## Phase 2: Database Models & Schemas ✅

### 2.1 Create Mongoose Models
- [x] Create `Branch` model (`/models/Branch.ts`)
- [x] Create `User` model (`/models/User.ts`)
- [x] Create `BranchMenuItem` model (`/models/BranchMenuItem.ts`)
- [x] Create `Table` model (`/models/Table.ts`)
- [x] Create `Category` model (`/models/Category.ts`)
- [x] Create `MenuItem` model (`/models/MenuItem.ts`)
- [x] Create `Order` model (`/models/Order.ts`)
- [x] Create `Payment` model (`/models/Payment.ts`)

### 2.2 Create Database Indexes
- [x] Add indexes to Branch model (slug, isActive)
- [x] Add indexes to User model (email, branchId, role)
- [x] Add indexes to BranchMenuItem model (compound: branchId + menuItemId)
- [x] Add indexes to Table model (compound: branchId + tableNumber, qrCode)
- [x] Add indexes to Category model (displayOrder, isActive)
- [x] Add indexes to MenuItem model (categoryId, isAvailable)
- [x] Add indexes to Order model (orderNumber, branchId, tableId, sessionId, status)
- [x] Add indexes to Payment model (orderId, stripePaymentIntentId)

### 2.3 Create TypeScript Types
- [x] Create shared types (`/types/index.ts`)
- [x] Create API response types
- [x] Create NextAuth type extensions (`/types/next-auth.d.ts`)
- [ ] Create form validation schemas (using Zod)

---

## Phase 3: Authentication & Authorization ✅

### 3.1 NextAuth.js Setup
- [x] Configure NextAuth.js v5 (`/app/api/auth/[...nextauth]/route.ts`)
- [x] Implement Credentials provider for staff/owner login (Email/Password only)
- [x] Create JWT token strategy
- [x] Implement session management
- [x] Create login page (`/app/login/page.tsx`)
- [x] Create dashboard page (`/app/dashboard/page.tsx`)

### 3.2 Middleware & Guards
- [x] Create authentication middleware (Edge-compatible version in `middleware.ts`)
- [x] Create role-based authorization utilities (`/lib/rbac.ts`)
- [x] Protect admin API routes

### 3.3 Password Security
- [x] Implement bcrypt password hashing (`/utils/password.ts`)
- [x] Create password validation utility
- [x] Add password strength requirements (min 8 characters)

---

## Phase 4: Public API Endpoints (Guest)

### 4.1 Branch Endpoints
- [ ] `GET /api/branches` - List all active branches
- [ ] `GET /api/branches/:slug` - Get branch by slug

### 4.2 Menu & Category Endpoints
- [ ] `GET /api/menu` - Get menu items with branch filtering
- [ ] `GET /api/menu/:id` - Get single menu item
- [ ] `GET /api/categories` - Get all categories

### 4.3 Table Endpoints
- [ ] `GET /api/tables/:qrCode` - Get table info by QR code

### 4.4 Order Endpoints (Guest)
- [ ] `POST /api/orders` - Create new order (guest checkout)
- [ ] `GET /api/orders/session/:sessionId` - Get order by session
- [ ] `GET /api/orders/:id/status` - Get order status

### 4.5 Payment Endpoints
- [ ] `POST /api/payments/create-intent` - Create Stripe PaymentIntent
- [ ] `POST /api/payments/webhook` - Stripe webhook handler
- [ ] Implement webhook signature verification
- [ ] Handle payment success/failure events

---

## Phase 5: Protected API Endpoints (Admin)

### 5.1 Auth Endpoints
- [ ] `POST /api/auth/login` - Staff/Owner login
- [ ] `POST /api/auth/logout` - Logout
- [ ] `GET /api/auth/me` - Get current user

### 5.2 Menu Management (Owner)
- [ ] `POST /api/admin/menu` - Create menu item
- [ ] `PUT /api/admin/menu/:id` - Update menu item
- [ ] `DELETE /api/admin/menu/:id` - Delete menu item
- [ ] `POST /api/admin/categories` - Create category
- [ ] `PUT /api/admin/categories/:id` - Update category

### 5.3 Order Management (Staff & Owner)
- [ ] `GET /api/admin/orders` - List orders with filters
- [ ] `GET /api/admin/orders/:id` - Get order details
- [ ] `PATCH /api/admin/orders/:id/status` - Update order status
- [ ] `POST /api/admin/orders` - Create order via staff (cash)
- [ ] `DELETE /api/admin/orders/:id` - Cancel order

### 5.4 Table Management (Owner)
- [ ] `GET /api/admin/tables` - List tables
- [ ] `POST /api/admin/tables` - Create table
- [ ] `PUT /api/admin/tables/:id` - Update table
- [ ] `DELETE /api/admin/tables/:id` - Delete table
- [ ] `GET /api/admin/tables/:id/qr` - Generate QR code

### 5.5 User Management (Owner)
- [ ] `GET /api/admin/users` - List users with branch filter
- [ ] `POST /api/admin/users` - Create user
- [ ] `PUT /api/admin/users/:id` - Update user
- [ ] `DELETE /api/admin/users/:id` - Delete user

### 5.6 Branch Management (Owner)
- [ ] `GET /api/admin/branches` - List branches
- [ ] `GET /api/admin/branches/:id` - Get branch details
- [ ] `POST /api/admin/branches` - Create branch
- [ ] `PUT /api/admin/branches/:id` - Update branch
- [ ] `DELETE /api/admin/branches/:id` - Delete branch

### 5.7 Branch Menu Management (Owner)
- [ ] `GET /api/admin/branches/:branchId/menu` - Get branch menu availability
- [ ] `PATCH /api/admin/branches/:branchId/menu/:menuItemId` - Toggle item availability
- [ ] `POST /api/admin/branches/:branchId/menu/bulk-update` - Bulk update availability

### 5.8 Reports (Owner)
- [ ] `GET /api/admin/reports/sales` - Sales report with branch filter
- [ ] `GET /api/admin/reports/popular-items` - Popular items report
- [ ] `GET /api/admin/reports/orders` - Orders report
- [ ] `GET /api/admin/reports/branches` - Branch comparison report

---

## Phase 6: Real-time Features (Socket.io)

### 6.1 Socket.io Server Setup
- [ ] Configure Socket.io server (`/lib/socket.ts`)
- [ ] Implement connection handling
- [ ] Create room management (staff room, order rooms)

### 6.2 Socket Events
- [ ] Implement `join-staff-room` event handler
- [ ] Implement `join-order-room` event handler
- [ ] Emit `new-order` event to staff
- [ ] Emit `order-status-updated` event to customers
- [ ] Emit `order-cancelled` event

### 6.3 Client Integration
- [ ] Create Socket.io client hook (`useSocket`)
- [ ] Integrate Socket.io with order status updates
- [ ] Add real-time notifications to admin dashboard

---

## Phase 7: Frontend - Customer Pages

### 7.1 Layout & Components
- [ ] Create main layout with mobile-first design
- [ ] Create header/navigation component
- [ ] Create loading states and skeletons
- [ ] Create error boundaries

### 7.2 Menu Pages
- [ ] Create menu page (`/app/menu/page.tsx`)
- [ ] Display menu items by category
- [ ] Implement category filtering
- [ ] Add menu item detail modal
- [ ] Show allergens and spicy level

### 7.3 Cart & Checkout
- [ ] Create cart state management (Context or Zustand)
- [ ] Create cart component with add/remove items
- [ ] Create checkout page
- [ ] Integrate Stripe Elements for payment
- [ ] Implement special instructions input

### 7.4 Order Tracking
- [ ] Create order confirmation page
- [ ] Create order status tracking page
- [ ] Implement real-time status updates via Socket.io
- [ ] Show order timeline (pending → preparing → ready → served)

### 7.5 QR Code Scanning Flow
- [ ] Create QR landing page (`/app/table/[qrCode]/page.tsx`)
- [ ] Fetch table and branch info
- [ ] Redirect to menu with table context
- [ ] Handle invalid QR codes

---

## Phase 8: Frontend - Admin Dashboard

### 8.1 Auth Pages
- [x] Create login page (`/app/login/page.tsx`)
- [x] Implement login form with validation
- [x] Add error handling and loading states
- [x] Implement logout functionality

### 8.2 Dashboard Layout
- [ ] Create admin layout with sidebar navigation
- [ ] Add role-based menu (staff vs owner)
- [x] Create dashboard overview page (basic version in `/app/dashboard/page.tsx`)
- [ ] Show key metrics (today's orders, sales, etc.)

### 8.3 Order Management
- [ ] Create orders list page (`/app/admin/orders/page.tsx`)
- [ ] Add filters (status, date, branch)
- [ ] Implement order status update
- [ ] Show real-time new orders via Socket.io
- [ ] Add order details modal
- [ ] Implement order cancellation

### 8.4 Menu Management (Owner)
- [ ] Create menu items list page
- [ ] Create add/edit menu item form
- [ ] Implement image upload for menu items
- [ ] Create categories management page
- [ ] Add category reordering (displayOrder)

### 8.5 Table Management (Owner)
- [ ] Create tables list page
- [ ] Create add/edit table form
- [ ] Generate and display QR codes
- [ ] Add QR code download/print functionality

### 8.6 User Management (Owner)
- [ ] Create users list page
- [ ] Create add/edit user form
- [ ] Assign users to branches
- [ ] Implement user activation/deactivation

### 8.7 Branch Management (Owner)
- [ ] Create branches list page
- [ ] Create add/edit branch form
- [ ] Configure branch settings (opening hours, tax rate)
- [ ] Manage branch menu availability

### 8.8 Reports (Owner)
- [ ] Create sales report page with date picker
- [ ] Create popular items report with charts
- [ ] Create branch comparison report
- [ ] Add export to CSV functionality
- [ ] Implement date range filtering

---

## Phase 9: QR Code Generation

### 9.1 QR Code Utilities
- [ ] Install `qrcode.react` library
- [ ] Create QR code generator utility
- [ ] Generate unique QR identifiers per table
- [ ] Create QR code display component

### 9.2 Printable QR Codes
- [ ] Create printable QR code template
- [ ] Add table number and branch info
- [ ] Implement print styles
- [ ] Add download as PNG/PDF

---

## Phase 10: Error Handling & Validation

### 10.1 Input Validation
- [ ] Create Zod schemas for all forms
- [ ] Implement API request validation
- [ ] Add client-side form validation
- [ ] Show user-friendly error messages

### 10.2 Error Handling
- [ ] Implement global error handler
- [ ] Create error response format
- [ ] Handle Stripe errors gracefully
- [ ] Add retry logic for failed requests

### 10.3 Edge Cases
- [ ] Handle duplicate order prevention
- [ ] Handle out-of-stock items
- [ ] Handle session timeout (15 minutes)
- [ ] Handle payment failures and retries
- [ ] Handle invalid QR codes

---

## Phase 11: Security Implementation

### 11.1 API Security
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Configure CORS properly
- [ ] Add request size limits
- [ ] Implement security headers (Helmet.js)

### 11.2 Data Security
- [ ] Sanitize all user inputs
- [ ] Prevent NoSQL injection
- [ ] Hash sensitive data
- [ ] Implement HTTPS (in production)

### 11.3 Payment Security
- [ ] Verify Stripe webhook signatures
- [ ] Never log sensitive payment data
- [ ] Implement idempotency for payments
- [ ] Validate amounts on backend

### 11.4 Session Security
- [ ] Generate secure session IDs
- [ ] Implement session expiration
- [ ] Rate limit orders per session

---

## Phase 12: Performance Optimization

### 12.1 Frontend Optimization
- [ ] Implement image optimization (next/image)
- [ ] Add lazy loading for images
- [ ] Optimize bundle size with code splitting
- [ ] Implement caching strategies

### 12.2 Backend Optimization
- [ ] Add database query optimization
- [ ] Implement API response caching
- [ ] Use connection pooling for MongoDB
- [ ] Optimize aggregation queries for reports

### 12.3 Real-time Optimization
- [ ] Use Socket.io rooms efficiently
- [ ] Throttle status update events
- [ ] Compress Socket.io messages

---

## Phase 13: Testing

### 13.1 Unit Tests
- [ ] Setup testing framework (Jest + React Testing Library)
- [ ] Write tests for utility functions
- [ ] Write tests for React components
- [ ] Write tests for API route handlers

### 13.2 Integration Tests
- [ ] Test API endpoints end-to-end
- [ ] Test payment flow
- [ ] Test order creation flow
- [ ] Test authentication flow

### 13.3 E2E Tests
- [ ] Setup Playwright or Cypress
- [ ] Test customer ordering flow
- [ ] Test staff order management
- [ ] Test admin dashboard flows

---

## Phase 14: Deployment Preparation

### 14.1 Environment Configuration
- [ ] Setup production environment variables
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Setup Stripe production keys
- [ ] Configure Sentry for production

### 14.2 Build & Deploy
- [ ] Create production build
- [ ] Test production build locally
- [ ] Setup DigitalOcean App Platform account
- [ ] Configure deployment settings

### 14.3 CI/CD Pipeline
- [ ] Create GitHub Actions workflow
- [ ] Setup automated tests in CI
- [ ] Configure auto-deploy to DigitalOcean
- [ ] Add deployment status badges

### 14.4 Monitoring & Logging
- [ ] Configure Sentry error tracking
- [ ] Setup DigitalOcean Metrics
- [ ] Implement custom logging
- [ ] Create health check endpoint

---

## Phase 15: Documentation & Polish

### 15.1 Code Documentation
- [ ] Add JSDoc comments to key functions
- [ ] Document API endpoints in code
- [ ] Create component documentation

### 15.2 User Documentation
- [ ] Create README.md with setup instructions
- [ ] Create deployment guide
- [ ] Create API documentation (optional: Swagger)
- [ ] Create user guide for admin panel

### 15.3 Final Polish
- [ ] Add loading states everywhere
- [ ] Improve error messages
- [ ] Add confirmation dialogs for destructive actions
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Fix any UI/UX issues

---

## Phase 16: Seed Data & Demo Setup

### 16.1 Create Seed Scripts
- [ ] Create seed script for branches
- [ ] Create seed script for categories
- [ ] Create seed script for menu items
- [ ] Create seed script for tables
- [ ] Create seed script for owner/staff users

### 16.2 Demo Data
- [ ] Seed realistic menu data (Thai restaurant)
- [ ] Generate QR codes for demo tables
- [ ] Create demo orders for testing
- [ ] Setup demo admin accounts

---

## Future Enhancements (Post-MVP)

### Nice to Have Features
- [ ] Multi-language support (EN/TH)
- [ ] Custom theming per restaurant
- [ ] Branch-specific pricing (not just availability)
- [ ] Loyalty program / points system
- [ ] SMS notifications for order status
- [ ] Kitchen display system (KDS)
- [ ] Inventory management
- [ ] Employee shift management
- [ ] Customer reviews and ratings
- [ ] Promotions and discounts
- [ ] Table reservation system
- [ ] Offline mode with service workers
- [ ] Push notifications
- [ ] Analytics dashboard with charts
- [ ] Export reports to Excel/PDF

---

## Notes

### Completed Phases Summary
✅ **Phase 1**: Project Setup & Infrastructure (Database: Docker MongoDB)
✅ **Phase 2**: Database Models & Schemas (All 8 models with indexes)
✅ **Phase 3**: Authentication & Authorization (NextAuth.js with Email/Password, RBAC)

### Next Steps
🎯 **Recommended**: Start with Phase 16.1 (Seed Scripts) to create test data
🎯 **Alternative**: Start with Phase 4 (Public API Endpoints)

### Priority Levels
- **P0 (Critical)**: Must have for MVP
- **P1 (High)**: Important for launch
- **P2 (Medium)**: Nice to have
- **P3 (Low)**: Future enhancement

### Development Approach
1. ✅ Build database layer first (models + schemas)
2. ✅ Setup authentication & authorization
3. 🔄 Build seed data for testing
4. 📝 Build API layer (start with public endpoints)
5. 📝 Build frontend incrementally (customer pages → admin pages)
6. 📝 Test each feature thoroughly before moving on
7. 📝 Deploy early and often

### Tips for Portfolio
- Write clean, well-documented code
- Use TypeScript strictly
- Follow Next.js 16 best practices
- Implement proper error handling
- Add loading states and good UX
- Make it mobile-responsive
- Deploy with custom domain (optional)
- Add a demo mode with seed data
