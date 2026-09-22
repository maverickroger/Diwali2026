import { CartItem, SiteSettings } from '../types';

export interface CheckoutDetails {
  customerName: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  deliveryLandmark?: string;
  pickupTime?: string;
  notes?: string;
  referredBy?: string;
}

export function generateWhatsAppMessage(
  cart: CartItem[],
  settings: SiteSettings,
  details: CheckoutDetails,
  language: 'en' | 'hi' = 'en'
): string {
  const isHi = language === 'hi';
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const totalAmount = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const lines: string[] = [];

  // Header
  lines.push(`🪔 *${settings.businessName.toUpperCase()}* 🪔`);
  lines.push(`✨ *${isHi ? 'दिवाली पटाखा ऑर्डर' : 'DIWALI PATAKA ORDER'}* [${orderId}] ✨`);
  lines.push('────────────────────────');

  // Customer info
  lines.push(`👤 *${isHi ? 'ग्राहक' : 'Customer'}:* ${details.customerName || (isHi ? 'दिवाली ग्राहक' : 'Diwali Patron')}`);
  lines.push(
    `📦 *${isHi ? 'ऑर्डर का प्रकार' : 'Fulfillment'}:* ${
      details.orderType === 'delivery'
        ? `🚚 ${isHi ? 'होम डिलीवरी' : 'Home Delivery'}`
        : `🏪 ${isHi ? 'स्टॉल से पिकअप' : 'Stall Self-Pickup'}`
    }`
  );

  if (details.orderType === 'delivery') {
    lines.push(`📍 *${isHi ? 'डिलीवरी का पता' : 'Delivery Address'}:* ${details.deliveryAddress || 'Not specified'}`);
    if (details.deliveryLandmark) {
      lines.push(`🏛️ *${isHi ? 'लैंडमार्क' : 'Landmark'}:* ${details.deliveryLandmark}`);
    }
  } else {
    lines.push(`⏰ *${isHi ? 'पिकअप समय' : 'Estimated Pickup'}:* ${details.pickupTime || 'Today during stall hours'}`);
    lines.push(`🎪 *${isHi ? 'स्टॉल स्थान' : 'Stall'}:* ${settings.stallLocation}`);
  }

  if (details.referredBy && details.referredBy.trim()) {
    lines.push(`🤝 *${isHi ? 'रेफरल' : 'Referred By'}:* ${details.referredBy.trim()}`);
  }

  if (details.notes && details.notes.trim()) {
    lines.push(`📝 *${isHi ? 'विशेष निर्देश' : 'Notes/Requests'}:* ${details.notes.trim()}`);
  }

  lines.push('────────────────────────');
  lines.push(`🛒 *${isHi ? 'सामग्री विवरण (आइटम्स)' : 'ITEMS ORDERED'}:*`);

  cart.forEach((item, index) => {
    const itemTotal = item.unitPrice * item.quantity;
    const name = isHi && item.productNameHindi ? item.productNameHindi : item.productName;

    if (item.isGiftBox || item.productId === 'custom-gift-box') {
      lines.push(`${index + 1}. *🎁 ${name}*`);
      if (item.description) {
        lines.push(`   📋 *Contents:* ${item.description}`);
      }
      if (item.giftBoxContents && item.giftBoxContents.length > 0) {
        item.giftBoxContents.forEach((c) => {
          lines.push(`     • ${c.quantity}x ${c.productName} (${c.variant}) @ ₹${c.unitPrice}`);
        });
      }
      lines.push(`   ▸ 1 Box = ₹${itemTotal}`);
    } else {
      const variantLabel =
        item.variant === 'box'
          ? isHi
            ? `डब्बा (${item.boxQuantity} पीस)`
            : `Box (${item.boxQuantity} pcs)`
          : isHi
          ? 'पीस'
          : 'Piece';

      lines.push(`${index + 1}. *${name}*`);
      lines.push(`   ▸ ${variantLabel} × ${item.quantity} = ₹${itemTotal}`);
    }
  });

  lines.push('────────────────────────');
  lines.push(`💰 *${isHi ? 'कुल राशि' : 'TOTAL AMOUNT'}: ₹${totalAmount.toLocaleString('en-IN')}*`);
  lines.push('────────────────────────');
  lines.push(
    isHi
      ? '🙏 कृपया ऑर्डर कन्फर्म करें और उपलब्धता बताएं। शुभ दीपावली!'
      : '🙏 Please confirm this order and let me know the preparation time. Happy Diwali!'
  );

  return lines.join('\n');
}

export function createWhatsAppUrl(phoneNumber: string, message: string): string {
  // Strip non-digit characters except leading plus if any
  const cleanedPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
}
