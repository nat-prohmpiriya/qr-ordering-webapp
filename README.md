# QR Ordering Web Application

A modern QR code-based restaurant ordering system built with Next.js 15, MongoDB, and Ant Design. This application allows customers to scan QR codes at their tables to browse menus and place orders, while restaurant staff can manage orders in real-time through an admin dashboard.

## Features

### Customer Features
- 🔍 **QR Code Ordering** - Scan table QR codes to access menu
- 🌐 **Bilingual Support** - Switch between Thai and English
- 🛒 **Shopping Cart** - Add items with special instructions
- 📱 **Responsive Design** - Works on mobile and desktop
- 📦 **Order Tracking** - Track order status in real-time
- 💳 **Order Confirmation** - Review order before submission

### Admin Features
- 🏢 **Branch Management** - Manage multiple restaurant branches
- 🪑 **Table Management** - Configure tables with QR codes
- 📋 **Menu Management** - Create and organize menu items with categories
- 📊 **Order Management** - View and update order status
- 📈 **Reports Dashboard** - View sales analytics and statistics
- 🔐 **Authentication** - Secure admin access with NextAuth

### Technical Features
- ⚡ **Real-time Updates** - Socket.io integration for live order updates
- 🗄️ **MongoDB Database** - Scalable NoSQL database
- 🎨 **Ant Design UI** - Professional component library
- 🔒 **Type Safety** - Full TypeScript support
- 🌍 **i18n Ready** - Custom language context with localStorage

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **UI Library**: Ant Design 6.0
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io
- **State Management**: React Context API

## Prerequisites

- Node.js 18+
- MongoDB 7.0+
- npm or yarn

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd qr-ordering-webapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://admin:admin123@localhost:27017/qr-ordering?authSource=admin

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Admin Credentials (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

4. **Start MongoDB**

Using Docker:
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:7
```

Or use your local MongoDB installation.

5. **Seed the database**

```bash
npm run seed
```

This will create:
- Admin user account
- Sample branches (Central World, Siam Paragon)
- Sample menu categories and items
- Sample tables with QR codes

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
qr-ordering-webapp/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── branches/             # Branch management
│   │   ├── menu-items/           # Menu item management
│   │   ├── orders/               # Order management
│   │   └── tables/               # Table management
│   ├── admin/                    # Admin dashboard pages
│   │   ├── branches/
│   │   ├── menu/
│   │   ├── orders/
│   │   ├── reports/
│   │   └── tables/
│   ├── order/                    # Customer-facing pages
│   │   ├── [qrCode]/             # Menu page (QR code based)
│   │   │   └── checkout/         # Checkout page
│   │   └── track/[orderId]/      # Order tracking page
│   └── layout.tsx                # Root layout
├── components/                   # Reusable components
│   ├── AdminLayout.tsx           # Admin dashboard layout
│   └── SessionProvider.tsx       # NextAuth session provider
├── contexts/                     # React Context providers
│   ├── CartContext.tsx           # Shopping cart state
│   └── LanguageContext.tsx       # Bilingual support
├── lib/                          # Utility libraries
│   ├── mongodb.ts                # MongoDB connection
│   └── socket.ts                 # Socket.io setup
├── models/                       # Mongoose models
│   ├── Branch.ts
│   ├── Category.ts
│   ├── MenuItem.ts
│   ├── Order.ts
│   ├── Table.ts
│   └── User.ts
├── scripts/                      # Database scripts
│   └── seed.ts                   # Seed data script
├── types/                        # TypeScript type definitions
│   └── index.ts
└── public/                       # Static assets
```

## Usage

### Customer Flow

1. **Scan QR Code** - Customer scans QR code on their table
2. **Browse Menu** - View menu items by category (Thai/English)
3. **Add to Cart** - Select items and add special instructions
4. **Checkout** - Review order and provide optional contact info
5. **Track Order** - Monitor order status through preparation stages

### Admin Flow

1. **Login** - Access admin dashboard at `/admin`
   - Default: admin@example.com / admin123

2. **Manage Branches** - Create and configure restaurant locations

3. **Setup Tables** - Add tables and generate QR codes

4. **Create Menu** - Add categories and menu items with:
   - Bilingual names and descriptions
   - Prices and preparation time
   - Images, allergens, spicy level
   - Availability status

5. **Process Orders** - View incoming orders and update status:
   - Pending → Confirmed → Preparing → Ready → Served

6. **View Reports** - Monitor sales, popular items, and trends

## API Endpoints

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders?orderId={id}` - Get order by ID
- `GET /api/orders/branch/{slug}` - Get branch orders
- `PATCH /api/orders/{id}` - Update order status

### Menu Items
- `GET /api/menu-items?branchId={id}` - Get menu items
- `POST /api/menu-items` - Create menu item
- `PUT /api/menu-items/{id}` - Update menu item
- `DELETE /api/menu-items/{id}` - Delete menu item

### Branches
- `GET /api/branches` - List all branches
- `GET /api/branches/{slug}` - Get branch details
- `POST /api/branches` - Create branch
- `PUT /api/branches/{id}` - Update branch

### Tables
- `GET /api/tables?branchId={id}` - Get branch tables
- `POST /api/tables` - Create table
- `PUT /api/tables/{id}` - Update table
- `DELETE /api/tables/{id}` - Delete table

## Database Schema

### Order Status Flow
```
pending → confirmed → preparing → ready → served
                    ↓
                cancelled
```

### Payment Status
- `pending` - Awaiting payment
- `paid` - Payment completed
- `failed` - Payment failed
- `refunded` - Payment refunded

## Bilingual Support

The application supports Thai and English languages:

- Language preference stored in localStorage
- Translation keys in `contexts/LanguageContext.tsx`
- Menu items stored with both languages: `{ th: string, en: string }`
- Language toggle available on all customer pages

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
npm run seed

# Type checking
npm run type-check

# Linting
npm run lint
```

### Adding New Translations

Edit `contexts/LanguageContext.tsx`:

```typescript
const translations: Record<Language, Record<string, string>> = {
  th: {
    'your-key': 'ข้อความภาษาไทย',
  },
  en: {
    'your-key': 'English text',
  },
};
```

Use in components:
```typescript
const { t } = useLanguage();
return <div>{t('your-key')}</div>;
```

## Configuration

### MongoDB Indexes

The application creates indexes for optimal performance:
- Orders: `branchId`, `status`, `orderNumber`, `sessionId`
- Tables: `qrCode`, `branchId + tableNumber`
- MenuItems: `branchId`, `category`

### Socket.io Events

Real-time events for order updates:
- `new-order` - New order created
- `order-updated` - Order status changed
- Room: `branch:{branchId}` - Branch-specific updates

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### MongoDB Atlas

1. Create MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Whitelist Vercel IP addresses

## Security Considerations

- ✅ NextAuth for secure authentication
- ✅ Environment variables for sensitive data
- ✅ MongoDB connection with authentication
- ✅ Input validation on API routes
- ✅ TypeScript for type safety
- ⚠️ Add rate limiting for production
- ⚠️ Implement CSRF protection
- ⚠️ Add API authentication for admin routes

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB is running
docker ps

# View MongoDB logs
docker logs mongodb

# Test connection
mongosh "mongodb://admin:admin123@localhost:27017"
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
```

### Clear Browser Storage

If language or cart state is corrupted:
```javascript
// In browser console
localStorage.clear();
location.reload();
```

## Future Enhancements

- [ ] Payment integration (Stripe, PromptPay)
- [ ] SMS/Email notifications
- [ ] Multi-branch analytics
- [ ] Inventory management
- [ ] Customer loyalty program
- [ ] Table reservations
- [ ] Kitchen display system
- [ ] Print integration for receipts

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include error messages and screenshots

## Contributors

Built with ❤️ using Next.js and modern web technologies.

---

**Version**: 1.0.0
**Last Updated**: 2025-11-23
