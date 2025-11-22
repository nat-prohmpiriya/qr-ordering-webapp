/**
 * Generate order number
 * Format: ORD-YYYYMMDD-XXX
 * Example: ORD-20251122-001
 */
export function generateOrderNumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

  return `ORD-${year}${month}${day}-${random}`;
}

/**
 * Calculate order total with tax
 */
export function calculateOrderTotal(
  subtotal: number,
  taxRate: number = 7
): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const tax = Math.round(subtotal * (taxRate / 100));
  const total = subtotal + tax;

  return {
    subtotal,
    tax,
    total,
  };
}

/**
 * Format price in cents to THB
 * Example: 15000 => "150.00"
 */
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Convert THB to cents
 * Example: 150.00 => 15000
 */
export function toCents(thb: number): number {
  return Math.round(thb * 100);
}
