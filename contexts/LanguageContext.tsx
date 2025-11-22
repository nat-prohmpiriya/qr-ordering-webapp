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
