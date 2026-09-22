import React, { useState } from 'react';
import { X, Dices, Sparkles, RefreshCw, ShoppingCart, Check, Volume2, ShieldCheck } from 'lucide-react';
import { Product, ProductVariant, Language, CartItem } from '../types';
import { fireGrandFireworks, fireCelebrationBurst } from '../utils/fireworks';

interface SurpriseItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
}

interface SurpriseMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddCustomBundleToCart: (bundleItem: CartItem) => void;
  language: Language;
}

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddCustomBundleToCart,
  language,
}) => {
  if (!isOpen) return null;

  const isHi = language === 'hi';

  const [budget, setBudget] = useState<number>(1500);
  const [preference, setPreference] = useState<'family' | 'kids' | 'loud' | 'aerial'>('family');
  const [generatedMix, setGeneratedMix] = useState<SurpriseItem[]>([]);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const generateMix = () => {
    let candidatePool = [...products].filter((p) => p.inStock);

    if (preference === 'kids') {
      candidatePool = candidatePool.filter((p) => p.soundLevel === 'Low' || p.category === 'kids');
    } else if (preference === 'loud') {
      candidatePool = candidatePool.filter((p) => p.soundLevel === 'High' || p.category === 'sound');
    } else if (preference === 'aerial') {
      candidatePool = candidatePool.filter((p) => p.category === 'rockets' || p.category === 'multishots');
    }

    if (candidatePool.length === 0) {
      candidatePool = [...products].filter((p) => p.inStock);
    }

    // Shuffle pool
    const shuffled = candidatePool.sort(() => 0.5 - Math.random());

    let currentTotal = 0;
    const selected: SurpriseItem[] = [];

    // Prioritize variety first
    for (const prod of shuffled) {
      // Pick variant (prefer boxes for larger budgets, pieces for smaller)
      const canAffordBox = budget > 2000 && prod.pricePerBox <= budget - currentTotal;
      const variant: ProductVariant = canAffordBox ? 'box' : 'piece';
      const price = variant === 'box' ? prod.pricePerBox : prod.pricePerPiece;

      if (currentTotal + price <= budget) {
        selected.push({
          product: prod,
          variant,
          quantity: 1,
          unitPrice: price,
        });
        currentTotal += price;
      }
    }

    // Top up remaining budget with affordable items
    const affordablePieces = candidatePool
      .map((p) => ({ product: p, price: p.pricePerPiece }))
      .sort((a, b) => a.price - b.price);

    for (const item of affordablePieces) {
      if (currentTotal + item.price <= budget) {
        const exist = selected.find((s) => s.product.id === item.product.id && s.variant === 'piece');
        if (exist) {
          exist.quantity += 1;
        } else {
          selected.push({
            product: item.product,
            variant: 'piece',
            quantity: 1,
            unitPrice: item.price,
          });
        }
        currentTotal += item.price;
      }
    }

    setGeneratedMix(selected);
    setIsGenerated(true);
    fireCelebrationBurst();
  };

  const currentTotal = generatedMix.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleAddBundle = () => {
    if (generatedMix.length === 0) return;

    const summary = generatedMix
      .map((i) => `${i.product.name} (${i.variant === 'box' ? 'Box' : 'Pc'} × ${i.quantity})`)
      .join(', ');

    const prefLabel =
      preference === 'kids'
        ? 'Kids Special'
        : preference === 'loud'
        ? 'Thunder Sound'
        : preference === 'aerial'
        ? 'Sky Fireworks'
        : 'Family Festive';

    const bundleCartItem: CartItem = {
      id: `surprise-${Date.now()}`,
      productId: 'surprise-bundle',
      productName: `🎲 Surprise Me: ${prefLabel} Pack (₹${budget} Budget) [${summary}]`,
      productNameHindi: `🎲 सरप्राइज मी: ${prefLabel} पैक (बजट ₹${budget}) [${summary}]`,
      variant: 'box',
      quantity: 1,
      unitPrice: currentTotal,
      boxQuantity: generatedMix.reduce((acc, i) => acc + i.quantity, 0),
      image: generatedMix[0]?.product.image || products[0]?.image || '',
    };

    onAddCustomBundleToCart(bundleCartItem);
    fireGrandFireworks();
    onClose();
  };

  return (
    <div
      id="surprise-me-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="surprise-me-modal-content"
        className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl my-auto text-gray-900 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Dices className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-950 font-festive flex items-center gap-2">
                <span>{isHi ? '🎲 सरप्राइज मी — स्मार्ट बजट पैक' : '🎲 Surprise Me — Smart Budget Mix'}</span>
              </h2>
              <p className="text-xs text-gray-500">
                {isHi
                  ? 'अपना बजट बताएं, हमारा सिस्टम आपके लिए बेहतरीन पटाखों का कॉम्बिनेशन तैयार करेगा!'
                  : 'Enter your budget and preference; we randomly pick a balanced variety pack for you!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Row */}
        <div className="p-4 sm:p-5 bg-white border-b border-gray-100 space-y-4">
          {/* Budget Presets */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              {isHi ? 'अपना बजट चुनें (Enter Budget in ₹):' : 'Enter Your Budget (₹):'}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[1000, 1500, 2500, 5000].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-colors border ${
                    budget === b
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  ₹{b}
                </button>
              ))}

              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
                <span className="text-gray-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Math.max(100, parseInt(e.target.value) || 0))}
                  className="w-20 bg-transparent text-xs text-gray-800 focus:outline-none font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Vibe Preference */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              {isHi ? 'पटाखा प्राथमिकता (Vibe):' : 'Select Celebration Vibe:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'family', label: isHi ? 'पारिवारिक मिक्स' : 'Family Mix', icon: '🪔' },
                { id: 'kids', label: isHi ? 'बच्चों के अनुकूल' : 'Kids Friendly', icon: '✨' },
                { id: 'loud', label: isHi ? 'तेज धमाका' : 'Loud & Thunder', icon: '💥' },
                { id: 'aerial', label: isHi ? 'आसमानी शो' : 'Aerial Sky Show', icon: '🚀' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setPreference(v.id as any)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs font-bold flex items-center gap-1.5 ${
                    preference === v.id
                      ? 'bg-amber-50 border-amber-400 text-amber-900'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span>{v.icon}</span>
                  <span className="truncate">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="roll-surprise-mix-btn"
            type="button"
            onClick={generateMix}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all active:scale-98"
          >
            <Dices className="w-4 h-4" />
            <span>
              {isGenerated
                ? isHi ? '🔄 दोबारा नया पैक बनाएं (Re-Roll Mix)' : '🔄 Re-Roll Surprise Mix'
                : isHi ? '✨ सरप्राइज पैक तैयार करें (Generate Mix)' : '✨ Generate Surprise Mix'}
            </span>
          </button>
        </div>

        {/* Generated Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-white">
          {!isGenerated ? (
            <div className="text-center py-10 text-gray-400 space-y-2">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
              <p className="text-xs text-gray-500">
                {isHi
                  ? 'ऊपर बजट सेट करें और "सरप्राइज पैक तैयार करें" पर क्लिक करें!'
                  : 'Set your budget above and hit Generate to see your curated Diwali basket!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                <span className="text-amber-700 font-bold flex items-center gap-1">
                  <span>🎉</span>
                  <span>
                    {isHi ? 'तैयार किया गया पैक:' : 'Your Curated Pataka Hamper:'}
                  </span>
                </span>
                <span className="font-mono text-sm font-bold text-amber-700">
                  ₹{currentTotal} / ₹{budget}
                </span>
              </div>

              <div className="space-y-2">
                {generatedMix.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${idx}`}
                    className="bg-white border border-gray-100 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shadow-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate font-festive">
                          {isHi && item.product.nameHindi ? item.product.nameHindi : item.product.name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {item.variant === 'box'
                            ? `Box (${item.product.boxQuantity}pc)`
                            : 'Single Piece'}{' '}
                          × {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono font-bold text-amber-700">
                      ₹{item.unitPrice * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isGenerated && generatedMix.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-gray-500">{isHi ? 'कुल मूल्य' : 'Total Price'}:</p>
              <p className="text-lg font-bold text-amber-700 font-mono">
                ₹{currentTotal.toLocaleString('en-IN')}
              </p>
            </div>

            <button
              id="add-surprise-bundle-to-cart-btn"
              onClick={handleAddBundle}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isHi ? 'कार्ट में जोड़ें' : 'Add Pack to Cart'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
