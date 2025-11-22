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
- [x] Install and configure Socket.io

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

## Phase 4: Public API Endpoints (Guest) ✅

### 4.1 Branch Endpoints
- [x] `GET /api/branches` - List all active branches
- [x] `GET /api/branches/:id` - Get branch by ID or slug

### 4.2 Menu & Category Endpoints
- [x] `GET /api/menu` - Get menu items with branch filtering
- [x] `GET /api/menu/:id` - Get single menu item
- [x] `GET /api/categories` - Get all categories

### 4.3 Table Endpoints
- [x] `GET /api/tables/:qrCode` - Get table info by QR code

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
- [x] `GET /api/admin/menu` - List menu items
- [x] `POST /api/admin/menu` - Create menu item
- [x] `PUT /api/admin/menu/:id` - Update menu item
- [x] `DELETE /api/admin/menu/:id` - Delete menu item
- [ ] `POST /api/admin/categories` - Create category
- [ ] `PUT /api/admin/categories/:id` - Update category

### 5.3 Order Management (Staff & Owner)
- [x] `GET /api/admin/orders` - List orders with filters
- [x] `GET /api/admin/orders/:id` - Get order details
- [x] `PATCH /api/admin/orders/:id/status` - Update order status
- [ ] `POST /api/admin/orders` - Create order via staff (cash)
- [ ] `DELETE /api/admin/orders/:id` - Cancel order

### 5.4 Table Management (Owner)
- [x] `GET /api/admin/tables` - List tables
- [x] `POST /api/admin/tables` - Create table
- [x] `PUT /api/admin/tables/:id` - Update table
- [x] `DELETE /api/admin/tables/:id` - Delete table
- [x] `GET /api/admin/tables/:id/qr` - Generate QR code (implemented in UI)

### 5.5 User Management (Owner)
- [x] `GET /api/admin/users` - List users with branch filter
- [x] `POST /api/admin/users` - Create user
- [x] `PUT /api/admin/users/:id` - Update user
- [x] `DELETE /api/admin/users/:id` - Delete user

### 5.6 Branch Management (Owner)
- [x] `GET /api/admin/branches` - List branches
- [x] `GET /api/admin/branches/:id` - Get branch details
- [x] `POST /api/admin/branches` - Create branch
- [x] `PUT /api/admin/branches/:id` - Update branch
- [x] `DELETE /api/admin/branches/:id` - Delete branch

### 5.7 Branch Menu Management (Owner)
- [x] `PUT /api/admin/branches/:branchId/menu` - Update branch menu items (bulk)
- [x] Branch menu selection implemented via Transfer UI component
- [ ] `PATCH /api/admin/branches/:branchId/menu/:menuItemId` - Toggle item availability (optional)

### 5.8 Reports (Owner)
- [x] `GET /api/admin/reports` - Comprehensive reports with analytics
  - [x] Sales summary (total orders, revenue, avg order value)
  - [x] Orders by status breakdown
  - [x] Orders by payment status
  - [x] Daily revenue report
  - [x] Top selling items
  - [x] Branch filtering support
  - [x] Date range filtering support

---

## Phase 6: Real-time Features (Socket.io) ✅

### 6.1 Socket.io Server Setup
- [x] Configure Socket.io server (custom `server.js` with Next.js)
- [x] Implement connection handling
- [x] Create room management (`branch:${branchId}`, `order:${orderId}`)
- [x] Created global.io instance for API routes

### 6.2 Socket Events
- [x] Implement `join-branch` event handler
- [x] Implement `join-order` event handler
- [x] Emit `new-order` event to branch staff
- [x] Emit `order-status-update` event to customers
- [x] Socket.io helper functions in `/lib/socket.ts`

### 6.3 Client Integration
- [ ] Create Socket.io client hook (`useSocket`)
- [ ] Integrate Socket.io with order status updates on client
- [ ] Add real-time notifications to admin dashboard UI

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

## Phase 8: Frontend - Admin Dashboard ✅

### 8.1 Auth Pages
- [x] Create login page (`/app/login/page.tsx`)
- [x] Implement login form with validation
- [x] Add error handling and loading states
- [x] Implement logout functionality

### 8.2 Dashboard Layout
- [x] Create admin layout with sidebar navigation (`/components/AdminLayout.tsx`)
- [x] Add role-based menu (staff vs owner)
- [x] Create dashboard overview page (`/app/dashboard/page.tsx`)
- [x] Show key metrics with statistics cards

### 8.3 Order Management
- [x] Create orders list page (`/app/admin/orders/page.tsx`)
- [x] Add filters (status, branch)
- [x] Implement order status update with dropdown
- [x] Show order details in expandable rows
- [x] Real-time Socket.io events configured (client integration pending)

### 8.4 Menu Management (Owner)
- [x] Create menu items list page (`/app/admin/menu/page.tsx`)
- [x] Create add/edit menu item form with modal
- [x] Category dropdown selection
- [x] Full CRUD operations for menu items
- [ ] Implement image upload for menu items (optional)
- [x] Categories fetched from API

### 8.5 Table Management (Owner)
- [x] Create tables list page (`/app/admin/tables/page.tsx`)
- [x] Create add/edit table form with modal
- [x] Generate and display QR codes in modal
- [x] Add QR code download functionality
- [x] Branch-specific table management

### 8.6 User Management (Owner)
- [x] Create users list page (`/app/admin/users/page.tsx`)
- [x] Create add/edit user form with modal
- [x] Assign users to branches via dropdown
- [x] Implement user activation/deactivation with switch
- [x] Role selection (Owner/Staff)

### 8.7 Branch Management (Owner)
- [x] Create branches list page (`/app/admin/branches/page.tsx`)
- [x] Create add/edit branch form with modal
- [x] Manage branch menu availability (`/app/admin/branch/[id]/page.tsx`)
- [x] Branch-specific table management in detail page
- [x] Transfer component for menu selection
- [x] Full CRUD operations for branches
- [ ] Configure opening hours UI (data structure exists)
- [ ] Configure tax rate UI (data structure exists)

### 8.8 Reports (Owner)
- [x] Create reports page with analytics (`/app/admin/reports/page.tsx`)
- [x] Statistics cards (total orders, revenue, avg order value)
- [x] Orders by status breakdown
- [x] Orders by payment status breakdown
- [x] Daily revenue table
- [x] Top selling items table
- [x] Branch filter dropdown
- [x] Date range picker with filtering
- [ ] Add export to CSV functionality (optional)
- [ ] Add charts visualization (optional)

---

## Phase 9: QR Code Generation ✅

### 9.1 QR Code Utilities
- [x] Install `qrcode.react` library
- [x] QR codes generated automatically on table creation
- [x] Generate unique QR identifiers per table (nanoid)
- [x] QR code display component in tables management

### 9.2 Printable QR Codes
- [x] Create QR code modal with preview
- [x] Add table number and branch info to QR display
- [x] Implement download as PNG functionality
- [ ] Add print styles for direct printing (optional)
- [ ] Add download as PDF (optional)

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

## Phase 16: Seed Data & Demo Setup ✅

### 16.1 Create Seed Scripts
- [x] Create comprehensive seed script (`scripts/seed.ts`)
- [x] Seed branches (2 branches)
- [x] Seed categories (5 categories)
- [x] Seed menu items (15 items)
- [x] Seed tables (18 tables with QR codes)
- [x] Seed owner/staff users (3 users)

### 16.2 Demo Data
- [x] Realistic Thai restaurant menu data
- [x] QR codes auto-generated for all tables
- [x] Demo admin accounts:
  - Owner: owner@restaurant.com / password123
  - Staff 1: staff1@restaurant.com / password123
  - Staff 2: staff2@restaurant.com / password123
- [ ] Create demo orders for testing (optional)

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
