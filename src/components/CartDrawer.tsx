import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Truck,
  Store,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Send,
  HelpCircle,
} from 'lucide-react';
import { CartItem, SiteSettings, Language } from '../types';
import { generateWhatsAppMessage, createWhatsAppUrl } from '../utils/whatsapp';
import { fireGrandFireworks } from '../utils/fireworks';
import { recordOrderCheckout } from '../services/storage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: SiteSettings;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  language: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  language,
}) => {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('pickup');
  const [customerName, setCustomerName] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryLandmark, setDeliveryLandmark] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [referredBy, setReferredBy] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  if (!isOpen) return null;

  const isHi = language === 'hi';
  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isBelowMin = settings.minOrderAmount > 0 && cartTotal < settings.minOrderAmount;

  const handleCheckout = () => {
    // Validation
    if (cart.length === 0) {
      setValidationError(isHi ? 'आपकी कार्ट खाली है!' : 'Your cart is empty!');
      return;
    }

    if (orderType === 'delivery' && (!deliveryAddress || deliveryAddress.trim().length < 5)) {
      setValidationError(
        isHi
          ? 'कृपया डिलीवरी के लिए पूरा पता दर्ज करें।'
          : 'Please provide a valid delivery address for home delivery.'
      );
      return;
    }

    setValidationError('');
    fireGrandFireworks();

    // Record checkout analytics
    recordOrderCheckout(cart);

    // Generate WhatsApp text and URL
    const message = generateWhatsAppMessage(
      cart,
      settings,
      {
        customerName: customerName.trim(),
        orderType,
        deliveryAddress: deliveryAddress.trim(),
        deliveryLandmark: deliveryLandmark.trim(),
        pickupTime: pickupTime.trim(),
        notes: notes.trim(),
        referredBy: referredBy.trim(),
      },
      language
    );

    const whatsappUrl = createWhatsAppUrl(settings.whatsappPhone, message);

    // Open WhatsApp in new tab / app
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-lg bg-white border-l border-gray-100 h-full flex flex-col shadow-2xl text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-gray-950 font-festive flex items-center gap-2">
                <span>{isHi ? 'आपकी पटाखा कार्ट' : 'Your Pataka Cart'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono font-bold">
                  {totalItemCount} {isHi ? 'वस्तुएं' : 'items'}
                </span>
              </h2>
              <p className="text-[11px] text-gray-500">
                {isHi ? 'सीधे व्हाट्सएप से स्टॉल पर ऑर्डर भेजें' : 'Pre-filled WhatsApp Checkout directly to Stall'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                title="Clear all items"
              >
                {isHi ? 'खाली करें' : 'Clear'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Minimum Order Warning / Progress */}
        {settings.minOrderAmount > 0 && (
          <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 text-xs flex items-center justify-between">
            <span className="text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                {isHi ? 'न्यूनतम ऑर्डर राशि:' : 'Minimum order requirement:'}{' '}
                <strong className="text-amber-950 font-bold">₹{settings.minOrderAmount}</strong>
              </span>
            </span>
            {isBelowMin ? (
              <span className="text-red-600 font-bold text-[11px]">
                ₹{settings.minOrderAmount - cartTotal} {isHi ? 'और जोड़ें' : 'more needed'}
              </span>
            ) : (
              <span className="text-emerald-700 font-extrabold text-[11px]">
                ✓ {isHi ? 'पात्र' : 'Eligible'}
              </span>
            )}
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-4xl shadow-sm">
                🪔
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 font-festive">
                  {isHi ? 'आपकी कार्ट अभी खाली है' : 'Your cart is looking quiet'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                  {isHi
                    ? 'अनार, चकरी, सुतली बम या 50-शॉट स्काई शॉट जोड़ें और त्योहार मनाएं!'
                    : 'Add colorful Anars, whistling rockets, or customized family gift hampers!'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-sm"
              >
                {isHi ? 'पटाखें ब्राउज़ करें' : 'Browse Patakas'}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="bg-white border border-gray-200/80 rounded-2xl p-3 flex items-center gap-3 transition-colors hover:border-amber-300 shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-14 h-14 rounded-xl object-cover bg-gray-50 shrink-0 border border-gray-100"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate font-festive">
                      {isHi && item.productNameHindi ? item.productNameHindi : item.productName}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {(item.isGiftBox || item.productId === 'custom-gift-box') ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200 flex items-center gap-1">
                        🎁 {isHi ? 'कस्टम गिफ्ट बॉक्स' : 'Custom Gift Box'}
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
                        {item.variant === 'box'
                          ? isHi
                            ? `डब्बा (${item.boxQuantity} पीस)`
                            : `Box (${item.boxQuantity} pcs)`
                          : isHi
                          ? 'प्रति पीस'
                          : 'Single Piece'}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 font-mono">
                      ₹{item.unitPrice} each
                    </span>
                  </div>

                  {/* Detailed Gift Box Contents Description */}
                  {item.description && (
                    <div className="mt-1.5 p-2 rounded-lg bg-gray-50 border border-gray-100 text-[11px] text-gray-600 leading-relaxed">
                      <span className="text-amber-800 font-bold block mb-0.5 text-[10px] uppercase tracking-wider">
                        {isHi ? 'बॉक्स सामग्री विवरण:' : 'Box Contents:'}
                      </span>
                      <p className="line-clamp-3 hover:line-clamp-none transition-all">{item.description}</p>
                    </div>
                  )}

                  {/* Quantity & Item Total Row */}
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100">
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-800 rounded hover:bg-white transition-colors"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-800 rounded hover:bg-white transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <div className="text-xs sm:text-sm font-bold text-amber-700 font-mono">
                      ₹{item.unitPrice * item.quantity}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Delivery & Checkout Details Form */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-gray-200 space-y-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isHi ? 'ऑर्डर और संपर्क विवरण' : 'Checkout & Delivery Options'}</span>
              </h3>

              {/* Delivery vs Pickup Toggle (Requirement 13) */}
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200/60">
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    orderType === 'pickup'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{isHi ? 'स्टॉल से पिकअप' : 'Stall Self-Pickup'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    orderType === 'delivery'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{isHi ? 'होम डिलीवरी' : 'Express Delivery'}</span>
                </button>
              </div>

              {/* Customer Name */}
              <div>
                <label className="text-[11px] text-gray-600 font-bold block mb-1">
                  {isHi ? 'आपका नाम (वैकल्पिक):' : 'Your Name (Optional):'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isHi ? 'उदा: राहुल शर्मा' : 'e.g. Rahul Sharma'}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Conditional Fields based on Delivery vs Pickup */}
              {orderType === 'delivery' ? (
                <div className="space-y-2 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-amber-950">
                  <div>
                    <label className="text-[11px] text-amber-800 font-bold block mb-1">
                      {isHi ? 'डिलीवरी का पूरा पता (आवश्यक):' : 'Full Delivery Address (Required):'} *
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder={isHi ? 'मकान नं., गली, सोसाइटी/मोहल्ला, शहर' : 'House/Flat No., Street, Colony, Landmark'}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-amber-800 font-bold block mb-1">
                      {isHi ? 'निकटतम लैंडमार्क:' : 'Nearest Landmark:'}
                    </label>
                    <input
                      type="text"
                      value={deliveryLandmark}
                      onChange={(e) => setDeliveryLandmark(e.target.value)}
                      placeholder={isHi ? 'उदा: मेन मंदिर के सामने, सेक्टर 18' : 'e.g. Opp. Main Temple, Sector 18'}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-gray-700">
                  <div className="text-[11px] text-amber-800 font-bold flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isHi ? 'स्टॉल पर आने का अनुमानित समय:' : 'Estimated Pickup Time:'}</span>
                  </div>
                  <input
                    type="text"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    placeholder={isHi ? 'उदा: आज शाम 6:30 बजे' : 'e.g. Today around 6:30 PM'}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-gray-500">
                    📍 {settings.stallLocation}
                  </p>
                </div>
              )}

              {/* Notes Field (Requirement 11) */}
              <div>
                <label className="text-[11px] text-gray-600 font-bold block mb-1">
                  {isHi ? 'विशेष निर्देश / नोट (वैकल्पिक):' : 'Special Notes / Preferred Time (Optional):'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isHi ? 'उदा: गिफ्ट पैकिंग कर दें, शाम 7 बजे से पहले चाहिए...' : 'e.g. Please pack in a waterproof bag, need by 7 PM...'}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Who Referred You (Requirement 22) */}
              <div>
                <label className="text-[11px] text-gray-600 font-bold flex items-center gap-1 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isHi ? 'आपको हमारे बारे में किसने बताया? (वैकल्पिक):' : 'Who referred you? (Optional):'}</span>
                </label>
                <input
                  type="text"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  placeholder={isHi ? 'उदा: शर्मा जी, इंस्टाग्राम, दोस्त' : 'e.g. Sharma Ji, Instagram, Friend'}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & WhatsApp Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white space-y-3">
            {/* Live Running Total (Requirement 14) */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-bold">{isHi ? 'कुल सामग्री मूल्य:' : 'Running Subtotal:'}</span>
              <span className="font-mono font-bold text-gray-900 text-base">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between text-base border-t border-gray-100 pt-2 font-bold">
              <span className="text-amber-800 font-bold">{isHi ? 'कुल देय राशि:' : 'Total Payable:'}</span>
              <span className="font-mono text-xl text-amber-700">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            {validationError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Direct WhatsApp Checkout Button (Requirement 10) */}
            <button
              id="whatsapp-checkout-btn"
              onClick={handleCheckout}
              disabled={isBelowMin}
              className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-md ${
                isBelowMin
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white transform active:scale-98'
              }`}
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>
                {isHi
                  ? `व्हाट्सएप पर ऑर्डर भेजें (₹${cartTotal.toLocaleString('en-IN')})`
                  : `Send Order via WhatsApp (₹${cartTotal.toLocaleString('en-IN')})`}
              </span>
              <Send className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-gray-400 leading-tight">
              {isHi
                ? 'व्हाट्सएप चैट खुलेगी जहां आप एक क्लिक में अपना ऑर्डर स्टॉल को भेज सकते हैं।'
                : 'Directly opens WhatsApp addressed to the stall with items, quantities & total formatted.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
