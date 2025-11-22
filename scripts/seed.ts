/**
 * Seed script for QR Ordering Web App
 *
 * This script populates the database with sample data:
 * - Owner and Staff users
 * - Branches
 * - Categories
 * - Menu items
 * - Tables with QR codes
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 */

import mongoose from 'mongoose';
import { hashPassword } from '@/utils/password';
import User from '@/models/User';
import Branch from '@/models/Branch';
import Category from '@/models/Category';
import MenuItem from '@/models/MenuItem';
import Table from '@/models/Table';
import BranchMenuItem from '@/models/BranchMenuItem';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/qr-ordering?authSource=admin';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  console.log('\n🗑️  Clearing existing data...');
  await User.deleteMany({});
  await Branch.deleteMany({});
  await Category.deleteMany({});
  await MenuItem.deleteMany({});
  await Table.deleteMany({});
  await BranchMenuItem.deleteMany({});
  console.log('✅ Database cleared');
}

async function seedUsers() {
  console.log('\n👤 Seeding users...');

  const hashedPassword = await hashPassword('password123');

  const users = [
    {
      email: 'owner@example.com',
      password: hashedPassword,
      name: 'John Doe (Owner)',
      role: 'owner',
      isActive: true,
    },
    {
      email: 'staff1@example.com',
      password: hashedPassword,
      name: 'Jane Smith (Staff)',
      role: 'staff',
      branchId: null, // Will be updated after branches are created
      isActive: true,
    },
    {
      email: 'staff2@example.com',
      password: hashedPassword,
      name: 'Bob Wilson (Staff)',
      role: 'staff',
      branchId: null, // Will be updated after branches are created
      isActive: true,
    },
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);
  console.log('   📧 Login credentials:');
  console.log('      Owner: owner@example.com / password123');
  console.log('      Staff 1: staff1@example.com / password123');
  console.log('      Staff 2: staff2@example.com / password123');

  return createdUsers;
}

async function seedBranches() {
  console.log('\n🏢 Seeding branches...');

  const branches = [
    {
      name: 'Siam Paragon Branch',
      slug: 'siam-paragon',
      location: {
        address: '991 Rama I Rd, Pathum Wan, Bangkok 10330',
        district: 'Pathum Wan',
        city: 'Bangkok',
        province: 'Bangkok',
        postalCode: '10330',
        lat: 13.7467,
        lng: 100.5345,
      },
      contact: {
        phone: '02-123-4567',
        email: 'siam@qrordering.com',
      },
      settings: {
        openingHours: {
          monday: { open: '10:00', close: '22:00' },
          tuesday: { open: '10:00', close: '22:00' },
          wednesday: { open: '10:00', close: '22:00' },
          thursday: { open: '10:00', close: '22:00' },
          friday: { open: '10:00', close: '23:00' },
          saturday: { open: '10:00', close: '23:00' },
          sunday: { open: '10:00', close: '22:00' },
        },
        timezone: 'Asia/Bangkok',
        taxRate: 7, // 7% VAT
      },
      isActive: true,
    },
    {
      name: 'Sukhumvit Branch',
      slug: 'sukhumvit',
      location: {
        address: '123 Sukhumvit Rd, Khlong Toei, Bangkok 10110',
        district: 'Khlong Toei',
        city: 'Bangkok',
        province: 'Bangkok',
        postalCode: '10110',
        lat: 13.7307,
        lng: 100.5418,
      },
      contact: {
        phone: '02-234-5678',
        email: 'sukhumvit@qrordering.com',
      },
      settings: {
        openingHours: {
          monday: { open: '11:00', close: '22:00' },
          tuesday: { open: '11:00', close: '22:00' },
          wednesday: { open: '11:00', close: '22:00' },
          thursday: { open: '11:00', close: '22:00' },
          friday: { open: '11:00', close: '23:00' },
          saturday: { open: '11:00', close: '23:00' },
          sunday: { open: '11:00', close: '22:00' },
        },
        timezone: 'Asia/Bangkok',
        taxRate: 7,
      },
      isActive: true,
    },
  ];

  const createdBranches = await Branch.insertMany(branches);
  console.log(`✅ Created ${createdBranches.length} branches`);
  console.log(`   🏢 ${createdBranches[0].name} (${createdBranches[0].slug})`);
  console.log(`   🏢 ${createdBranches[1].name} (${createdBranches[1].slug})`);

  return createdBranches;
}

async function updateStaffBranches(staffUsers: any[], branches: any[]) {
  console.log('\n🔗 Assigning staff to branches...');

  // Assign staff1 to Siam Paragon
  await User.findByIdAndUpdate(staffUsers[1]._id, {
    branchId: branches[0]._id,
  });
  console.log(`   ✅ ${staffUsers[1].name} → ${branches[0].name}`);

  // Assign staff2 to Sukhumvit
  await User.findByIdAndUpdate(staffUsers[2]._id, {
    branchId: branches[1]._id,
  });
  console.log(`   ✅ ${staffUsers[2].name} → ${branches[1].name}`);
}

async function seedCategories() {
  console.log('\n🗂️  Seeding categories...');

  const categories = [
    {
      name: { th: 'เครื่องดื่ม', en: 'Beverages' },
      slug: 'beverages',
      description: {
        th: 'เครื่องดื่มสดชื่น ชาและกาแฟ',
        en: 'Refreshing drinks, tea and coffee',
      },
      displayOrder: 1,
      isActive: true,
    },
    {
      name: { th: 'ของทานเล่น', en: 'Appetizers' },
      slug: 'appetizers',
      description: {
        th: 'อาหารเรียกน้ำย่อย',
        en: 'Light bites to start your meal',
      },
      displayOrder: 2,
      isActive: true,
    },
    {
      name: { th: 'อาหารจานหลัก', en: 'Main Course' },
      slug: 'main-course',
      description: {
        th: 'อาหารจานหลักรสชาติเข้มข้น',
        en: 'Hearty main dishes',
      },
      displayOrder: 3,
      isActive: true,
    },
    {
      name: { th: 'ข้าวและเส้น', en: 'Rice & Noodles' },
      slug: 'rice-noodles',
      description: {
        th: 'ข้าว ผัด และก๋วยเตี๋ยว',
        en: 'Rice dishes and noodles',
      },
      displayOrder: 4,
      isActive: true,
    },
    {
      name: { th: 'ของหวาน', en: 'Desserts' },
      slug: 'desserts',
      description: {
        th: 'ของหวานไทยและสากล',
        en: 'Thai and international desserts',
      },
      displayOrder: 5,
      isActive: true,
    },
  ];

  const createdCategories = await Category.insertMany(categories);
  console.log(`✅ Created ${createdCategories.length} categories`);
  createdCategories.forEach(cat => {
    console.log(`   📂 ${cat.name.th} (${cat.name.en})`);
  });

  return createdCategories;
}

async function seedMenuItems(categories: any[]) {
  console.log('\n🍽️  Seeding menu items...');

  const menuItems = [
    // Beverages
    {
      categoryId: categories[0]._id,
      name: { th: 'ชาเย็น', en: 'Thai Iced Tea' },
      description: {
        th: 'ชาไทยเย็นๆ หอมหวาน',
        en: 'Sweet and creamy Thai iced tea',
      },
      price: 45,
      spicyLevel: 0,
      allergens: ['dairy'],
      isAvailable: true,
      isVegetarian: true,
      preparationTime: 5,
    },
    {
      categoryId: categories[0]._id,
      name: { th: 'น้ำมะนาว', en: 'Fresh Lime Juice' },
      description: {
        th: 'น้ำมะนาวสดใหม่',
        en: 'Freshly squeezed lime juice',
      },
      price: 40,
      spicyLevel: 0,
      allergens: [],
      isAvailable: true,
      isVegetarian: true,
      preparationTime: 5,
    },
    {
      categoryId: categories[0]._id,
      name: { th: 'กาแฟเย็น', en: 'Iced Coffee' },
      description: {
        th: 'กาแฟเย็นหอมกรุ่น',
        en: 'Smooth iced coffee',
      },
      price: 50,
      spicyLevel: 0,
      allergens: ['dairy'],
      isAvailable: true,
      isVegetarian: true,
      preparationTime: 5,
    },

    // Appetizers
    {
      categoryId: categories[1]._id,
      name: { th: 'ปอเปี๊ยะทอด', en: 'Spring Rolls' },
      description: {
        th: 'ปอเปี๊ยะทอดกรอบ ไส้ผัก',
        en: 'Crispy vegetable spring rolls',
      },
      price: 80,
      spicyLevel: 0,
      allergens: ['gluten'],
      isAvailable: true,
      isVegetarian: true,
      preparationTime: 10,
    },
    {
      categoryId: categories[1]._id,
      name: { th: 'ทอดมันกุ้ง', en: 'Shrimp Cakes' },
      description: {
        th: 'ทอดมันกุ้งสูตรพิเศษ',
        en: 'Special recipe shrimp cakes',
      },
      price: 120,
      spicyLevel: 1,
      allergens: ['shellfish', 'gluten'],
      isAvailable: true,
      isVegetarian: false,
      preparationTime: 12,
    },
    {
      categoryId: categories[1]._id,
      name: { th: 'สลัดผัก', en: 'Garden Salad' },
      description: {
        th: 'สลัดผักสดน้ำสลัดพิเศษ',
        en: 'Fresh garden salad with house dressing',
      },
      price: 90,
      spicyLevel: 0,
      allergens: [],
      isAvailable: true,
      isVegetarian: true,
      preparationTime: 8,
    },

    // Main Course
    {
      categoryId: categories[2]._id,
      name: { th: 'ต้มยำกุ้ง', en: 'Tom Yum Goong' },
      description: {
        th: 'ต้มยำกุ้งรสจัดจ้าน',
        en: 'Spicy and sour shrimp soup',
      },
      price: 180,
      spicyLevel: 3,
      allergens: ['shellfish'],
      isAvailable: true,
      isVegetarian: false,
      preparationTime: 15,
    },
    {
      categoryId: categories[2]._id,
      name: { th: 'แกงเขียวหวานไก่', en: 'Green Curry Chicken' },
      description: {
        th: 'แกงเขียวหวานไก่เนื้อนุ่ม',
        en: 'Tender chicken in green curry',
      },
      price: 150,
      spicyLevel: 2,
      allergens: ['dairy'],
      isAvailable: true,
      isVegetarian: false,
      preparationTime: 18,
    },
    {
      categoryId: categories[2]._id,
      name: { th: 'ปลากะพงทอดน้ำปลา', en: 'Fried Sea Bass' },
      description: {
        th: 'ปลากะพงทอดกรอบราดน้ำปลา',
        en: 'Crispy fried sea bass with fish sauce',
      },
      price: 280,
      spicyLevel: 1,
      allergens: ['fish'],
      isAvailable: true,
      isVegetarian: false,
      preparationTime: 20,
    },

    // Rice & Noodles
    {
      categoryId: categories[3]._id,
      name: { th: 'ผัดไทย', en: 'Pad Thai' },
      description: {
        th: 'ผัดไทยกุ้งสด',
        en: 'Classic Thai stir-fried noodles with shrimp',
      },
      price: 120,
      spicyLevel: 1,
      allergens: ['shellfish', 'peanuts', 'gluten'],
      isAvailable: true,
      isVegetarian: false,
      preparationTime: 15,
    },
    {
      categoryId: categories[3]._id,
      name: { th: 'ข้าวผัดกะเพรา', en: 'Basil Fried Rice' },
      description: {
        th: 'ข้าวผัดกะเพราหมูสับไข่ดาว',
        en: 'Spicy basil fried rice with pork and fried egg',
      },
      price: 110,
      spicyLevel: 2,
      allergens: ['eggs'],
      isAvailable: true,
      isVegetarian: false,
      preparationTime: 12,
    },
    {
      categoryId: categories[3]._id,
      name: { th: 'ก๋วยเตี๋ยวน้ำ', en: 'Thai Noodle Soup' },
      description: {
        th: 'ก๋วยเตี๋ยวหมูน้ำใส',
        en: 'Clear pork noodle soup',
      },
      price: 90,
      spicyLevel: 0,
      allergens: ['gluten'],
      isAvailable: true,
      isVegetarian: false,
      preparationTime: 12,
    },

    // Desserts
    {
      categoryId: categories[4]._id,
      name: { th: 'มะม่วงข้าวเหนียว', en: 'Mango Sticky Rice' },
      description: {
        th: 'ข้าวเหนียวมะม่วงหวาน',
        en: 'Sweet sticky rice with fresh mango',
      },
      price: 95,
      spicyLevel: 0,
      allergens: ['dairy'],
      isAvailable: true,
      isVegetarian: true,
      preparationTime: 10,
    },
    {
      categoryId: categories[4]._id,
      name: { th: 'ไอศกรีมกะทิ', en: 'Coconut Ice Cream' },
      description: {
        th: 'ไอศกรีมกะทิโรยถั่ว',
        en: 'Coconut ice cream with peanut topping',
      },
      price: 70,
      spicyLevel: 0,
      allergens: ['peanuts', 'dairy'],
      isAvailable: true,
      isVegetarian: true,
      preparationTime: 5,
    },
    {
      categoryId: categories[4]._id,
      name: { th: 'ทับทิมกรอบ', en: 'Red Rubies' },
      description: {
        th: 'ทับทิมกรอบน้ำกะทิ',
        en: 'Water chestnuts in coconut milk',
      },
      price: 65,
      spicyLevel: 0,
      allergens: ['dairy'],
      isAvailable: true,
      isVegetarian: true,
      preparationTime: 8,
    },
  ];

  const createdItems = await MenuItem.insertMany(menuItems);
  console.log(`✅ Created ${createdItems.length} menu items`);

  const itemsByCategory = createdItems.reduce((acc: any, item: any) => {
    const catId = item.categoryId.toString();
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(item);
    return acc;
  }, {});

  categories.forEach(cat => {
    const items = itemsByCategory[cat._id.toString()] || [];
    console.log(`   📂 ${cat.name.th}: ${items.length} items`);
  });

  return createdItems;
}

async function linkMenuItemsToBranches(branches: any[], menuItems: any[]) {
  console.log('\n🔗 Linking menu items to branches...');

  const branchMenuItems = [];

  // Link all menu items to both branches (all available)
  for (const branch of branches) {
    for (const menuItem of menuItems) {
      branchMenuItems.push({
        branchId: branch._id,
        menuItemId: menuItem._id,
        isAvailable: true,
      });
    }
  }

  // Make some items unavailable at Sukhumvit branch (for testing)
  const sukhumvitBranch = branches[1];
  const unavailableItems = menuItems.slice(0, 3); // First 3 items

  for (const item of unavailableItems) {
    const index = branchMenuItems.findIndex(
      bmi => bmi.branchId.toString() === sukhumvitBranch._id.toString() &&
             bmi.menuItemId.toString() === item._id.toString()
    );
    if (index !== -1) {
      branchMenuItems[index].isAvailable = false;
    }
  }

  await BranchMenuItem.insertMany(branchMenuItems);
  console.log(`✅ Created ${branchMenuItems.length} branch-menu item links`);
  console.log(`   ℹ️  ${unavailableItems.length} items unavailable at ${sukhumvitBranch.name}`);
}

async function seedTables(branches: any[]) {
  console.log('\n🪑 Seeding tables...');

  const tables = [];

  // Create 10 tables for Siam Paragon
  for (let i = 1; i <= 10; i++) {
    tables.push({
      branchId: branches[0]._id,
      tableNumber: `SP-${i.toString().padStart(2, '0')}`,
      qrCode: `qr_siam_table_${i}`,
      capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6,
      isActive: true,
    });
  }

  // Create 8 tables for Sukhumvit
  for (let i = 1; i <= 8; i++) {
    tables.push({
      branchId: branches[1]._id,
      tableNumber: `SK-${i.toString().padStart(2, '0')}`,
      qrCode: `qr_sukhumvit_table_${i}`,
      capacity: i <= 3 ? 2 : i <= 6 ? 4 : 6,
      isActive: true,
    });
  }

  const createdTables = await Table.insertMany(tables);
  console.log(`✅ Created ${createdTables.length} tables`);
  console.log(`   🏢 ${branches[0].name}: 10 tables (SP-01 to SP-10)`);
  console.log(`   🏢 ${branches[1].name}: 8 tables (SK-01 to SK-08)`);

  return createdTables;
}

async function main() {
  console.log('🌱 Starting seed process...\n');
  console.log('=' .repeat(50));

  await connectDB();
  await clearDatabase();

  const users = await seedUsers();
  const branches = await seedBranches();
  await updateStaffBranches(users, branches);
  const categories = await seedCategories();
  const menuItems = await seedMenuItems(categories);
  await linkMenuItemsToBranches(branches, menuItems);
  const tables = await seedTables(branches);

  console.log('\n' + '='.repeat(50));
  console.log('\n✨ Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   👤 Users: ${users.length} (1 owner, 2 staff)`);
  console.log(`   🏢 Branches: ${branches.length}`);
  console.log(`   📂 Categories: ${categories.length}`);
  console.log(`   🍽️  Menu Items: ${menuItems.length}`);
  console.log(`   🪑 Tables: ${tables.length}`);
  console.log(`   🔗 Branch-Menu Links: ${branches.length * menuItems.length}`);

  console.log('\n🔐 Login Credentials:');
  console.log('   Owner:   owner@example.com / password123');
  console.log('   Staff 1: staff1@example.com / password123 (Siam Paragon)');
  console.log('   Staff 2: staff2@example.com / password123 (Sukhumvit)');

  console.log('\n🎯 Next Steps:');
  console.log('   1. Start dev server: npm run dev');
  console.log('   2. Login at: http://localhost:3000/login');
  console.log('   3. Test QR codes: qr_siam_table_1, qr_sukhumvit_table_1, etc.');

  await mongoose.disconnect();
  console.log('\n✅ Disconnected from MongoDB\n');
}

main().catch((error) => {
  console.error('\n❌ Seed failed:', error);
  process.exit(1);
});
