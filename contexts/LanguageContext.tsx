'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  th: {
    // Header
    cart: 'ตะกร้า',
    table: 'โต๊ะ',

    // Menu
    'no-menu': 'ไม่มีเมนูในหมวดนี้',
    'no-image': 'ไม่มีรูปภาพ',
    vegetarian: 'เมนูเจ/มังสวิรัติ',

    // Item Modal
    price: 'ราคา',
    spicy: 'ความเผ็ด',
    allergens: 'สารก่อภูมิแพ้',
    'prep-time': 'เวลาเตรียม',
    minutes: 'นาที',
    quantity: 'จำนวน',
    'special-instructions': 'คำขอพิเศษ',
    'special-instructions-placeholder': 'เช่น ไม่ใส่ผัก, เผ็ดน้อย, ฯลฯ',
    'add-to-cart': 'เพิ่มลงตะกร้า',

    // Cart
    'cart-title': 'ตะกร้าสินค้า',
    'cart-empty': 'ตะกร้าว่างเปล่า',
    note: 'หมายเหตุ',
    total: 'รวม',
    checkout: 'ยืนยันและสั่งอาหาร',
    'select-menu-first': 'กรุณาเลือกเมนูก่อนสั่งอาหาร',
    'added-to-cart': 'เพิ่มลงตะกร้าแล้ว',

    // QR Scan
    'qr-scan-message': 'สแกน QR Code เพื่อเปิดเมนูสำหรับโต๊ะนี้',

    // Checkout Page
    back: 'กลับ',
    'confirm-order': 'ยืนยันคำสั่งซื้อ',
    subtotal: 'ราคารวม',
    tax: 'ภาษี',
    'grand-total': 'ยอดรวมสุทธิ',
    'customer-info': 'ข้อมูลลูกค้า',
    'optional': 'ไม่บังคับ',
    'customer-name': 'ชื่อ',
    'customer-name-placeholder': 'กรอกชื่อของคุณ (ไม่บังคับ)',
    'customer-name-max-error': 'ชื่อต้องไม่เกิน 100 ตัวอักษร',
    'customer-phone': 'เบอร์โทรศัพท์',
    'customer-phone-placeholder': 'กรอกเบอร์โทรศัพท์ (ไม่บังคับ)',
    'customer-phone-error': 'กรุณากรอกเบอร์โทรศัพท์ 10 หลัก',
    'confirm-submit': 'ยืนยันและสั่งอาหาร',
    'order-success': 'สั่งอาหารสำเร็จ!',
    'order-number': 'หมายเลขคำสั่งซื้อ',
    'track-order': 'ติดตามสถานะออเดอร์',
    'back-to-menu': 'กลับไปที่เมนู',
    'order-wait-message': 'กรุณารอสักครู่ พนักงานจะนำอาหารมาเสิร์ฟให้ท่าน',
    'cart-empty-message': 'ตะกร้าสินค้าว่างเปล่า',
    'order-submit-success': 'สั่งอาหารสำเร็จ!',
    'order-submit-error': 'ไม่สามารถสั่งอาหารได้',
    'order-error': 'เกิดข้อผิดพลาดในการสั่งอาหาร',

    // Order Tracking
    'order-status': 'สถานะคำสั่งซื้อ',
    'order-details': 'รายละเอียดคำสั่งซื้อ',
    'order-items': 'รายการอาหาร',
    'status-pending': 'รอดำเนินการ',
    'status-confirmed': 'ยืนยันแล้ว',
    'status-preparing': 'กำลังเตรียม',
    'status-ready': 'พร้อมเสิร์ฟ',
    'status-served': 'เสิร์ฟแล้ว',
    'status-completed': 'เสร็จสิ้น',
    'status-cancelled': 'ยกเลิก',
    'order-not-found': 'ไม่พบคำสั่งซื้อ',
    'order-loading': 'กำลังโหลดข้อมูล...',
    'refresh': 'รีเฟรช',
    'branch': 'สาขา',
    'customer-name-label': 'ชื่อลูกค้า',
    'customer-phone-label': 'เบอร์โทร',
    'order-cancelled-title': 'คำสั่งซื้อถูกยกเลิก',
    'order-cancelled-message': 'คำสั่งซื้อของคุณถูกยกเลิกแล้ว กรุณาติดต่อพนักงานหากมีข้อสงสัย',
    'contact-info': 'ข้อมูลติดต่อสาขา',
    'address': 'ที่อยู่',
    'phone': 'โทรศัพท์',
    'payment-status': 'ชำระเงิน',
    'back-home': 'กลับหน้าหลัก',
    'order-not-found-subtitle': 'ขอโทษครับ ไม่พบคำสั่งซื้อที่คุณค้นหา',

    // Status Steps
    'step-pending-title': 'รอยืนยัน',
    'step-pending-desc': 'รอพนักงานยืนยันคำสั่งซื้อ',
    'step-confirmed-title': 'ยืนยันแล้ว',
    'step-confirmed-desc': 'พนักงานยืนยันคำสั่งซื้อแล้ว',
    'step-preparing-title': 'กำลังเตรียม',
    'step-preparing-desc': 'กำลังเตรียมอาหารของคุณ',
    'step-ready-title': 'พร้อมเสิร์ฟ',
    'step-ready-desc': 'อาหารพร้อมเสิร์ฟแล้ว',
    'step-served-title': 'เสิร์ฟแล้ว',
    'step-served-desc': 'ขอให้รับประทานอาหารอร่อย',
  },
  en: {
    // Header
    cart: 'Cart',
    table: 'Table',

    // Menu
    'no-menu': 'No menu items in this category',
    'no-image': 'No image',
    vegetarian: 'Vegetarian',

    // Item Modal
    price: 'Price',
    spicy: 'Spicy Level',
    allergens: 'Allergens',
    'prep-time': 'Preparation Time',
    minutes: 'min',
    quantity: 'Quantity',
    'special-instructions': 'Special Instructions',
    'special-instructions-placeholder': 'e.g., No vegetables, Less spicy, etc.',
    'add-to-cart': 'Add to Cart',

    // Cart
    'cart-title': 'Shopping Cart',
    'cart-empty': 'Cart is empty',
    note: 'Note',
    total: 'Total',
    checkout: 'Confirm Order',
    'select-menu-first': 'Please select menu items before ordering',
    'added-to-cart': 'Added to cart',

    // QR Scan
    'qr-scan-message': 'Scan this QR code to open the menu for this table',

    // Checkout Page
    back: 'Back',
    'confirm-order': 'Confirm Order',
    subtotal: 'Subtotal',
    tax: 'Tax',
    'grand-total': 'Grand Total',
    'customer-info': 'Customer Information',
    'optional': 'Optional',
    'customer-name': 'Name',
    'customer-name-placeholder': 'Enter your name (optional)',
    'customer-name-max-error': 'Name must not exceed 100 characters',
    'customer-phone': 'Phone Number',
    'customer-phone-placeholder': 'Enter phone number (optional)',
    'customer-phone-error': 'Please enter a 10-digit phone number',
    'confirm-submit': 'Confirm & Order',
    'order-success': 'Order Successful!',
    'order-number': 'Order Number',
    'track-order': 'Track Order',
    'back-to-menu': 'Back to Menu',
    'order-wait-message': 'Please wait, our staff will serve your food shortly',
    'cart-empty-message': 'Cart is empty',
    'order-submit-success': 'Order placed successfully!',
    'order-submit-error': 'Unable to place order',
    'order-error': 'An error occurred while placing order',

    // Order Tracking
    'order-status': 'Order Status',
    'order-details': 'Order Details',
    'order-items': 'Order Items',
    'status-pending': 'Pending',
    'status-confirmed': 'Confirmed',
    'status-preparing': 'Preparing',
    'status-ready': 'Ready',
    'status-served': 'Served',
    'status-completed': 'Completed',
    'status-cancelled': 'Cancelled',
    'order-not-found': 'Order not found',
    'order-loading': 'Loading...',
    'refresh': 'Refresh',
    'branch': 'Branch',
    'customer-name-label': 'Customer Name',
    'customer-phone-label': 'Phone',
    'order-cancelled-title': 'Order Cancelled',
    'order-cancelled-message': 'Your order has been cancelled. Please contact our staff if you have any questions',
    'contact-info': 'Branch Contact Information',
    'address': 'Address',
    'phone': 'Phone',
    'payment-status': 'Payment',
    'back-home': 'Back to Home',
    'order-not-found-subtitle': 'Sorry, we could not find the order you are looking for',

    // Status Steps
    'step-pending-title': 'Pending',
    'step-pending-desc': 'Waiting for staff confirmation',
    'step-confirmed-title': 'Confirmed',
    'step-confirmed-desc': 'Order confirmed by staff',
    'step-preparing-title': 'Preparing',
    'step-preparing-desc': 'Preparing your food',
    'step-ready-title': 'Ready',
    'step-ready-desc': 'Food is ready to serve',
    'step-served-title': 'Served',
    'step-served-desc': 'Enjoy your meal',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('th');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'th' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
