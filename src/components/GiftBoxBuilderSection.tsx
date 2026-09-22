import React, { useState, useMemo } from 'react';
import {
  Gift,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Trash2,
  AlertCircle,
  Check,
  Search,
  ArrowRight,
  Package,
  Layers,
} from 'lucide-react';
import { Product, ProductVariant, Language, CartItem } from '../types';
import { fireCelebrationBurst } from '../utils/fireworks';
import { seedCategories } from '../data/seedProducts';

interface GiftBoxItemEntry {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
}

interface GiftBoxBuilderSectionProps {
  products: Product[];
  onAddCustomBundleToCart: (bundleItem: CartItem) => void;
  onOpenCart: () => void;
  language: Language;
}

export const GiftBoxBuilderSection: React.FC<GiftBoxBuilderSectionProps> = ({
  products,
  onAddCustomBundleToCart,
  onOpenCart,
  language,
}) => {
  const isHi = language === 'hi';

  const [budget, setBudget] = useState<number>(2500);
  const [customBudgetInput, setCustomBudgetInput] = useState<string>('');
  const [boxName, setBoxName] = useState<string>(isHi ? 'पारिवारिक दिवाली गिफ्ट बॉक्स' : 'Family Diwali Hamper');
  const [selectedItems, setSelectedItems] = useState<Record<string, GiftBoxItemEntry>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  const presetBudgets = [1000, 2000, 3000, 5000, 10000];

  const handleUpdateItem = (product: Product, variant: ProductVariant, delta: number) => {
    const key = `${product.id}-${variant}`;
    const unitPrice = variant === 'piece' ? product.pricePerPiece : product.pricePerBox;
    const existing = selectedItems[key];
    const currentQty = existing ? existing.quantity : 0;
    const nextQty = currentQty + delta;

    const next = { ...selectedItems };
    if (nextQty <= 0) {
      delete next[key];
    } else {
      next[key] = {
        product,
        variant,
        quantity: nextQty,
        unitPrice,
      };
    }
    setSelectedItems(next);
  };

  const currentTotal = useMemo(() => {
    return Object.values(selectedItems).reduce((sum, entry) => {
      return sum + entry.unitPrice * entry.quantity;
    }, 0);
  }, [selectedItems]);

  const totalItemsCount = useMemo(() => {
    return Object.values(selectedItems).reduce((sum, entry) => sum + entry.quantity, 0);
  }, [selectedItems]);

  const progressPercent = Math.min(100, Math.round((currentTotal / Math.max(1, budget)) * 100));
  const isOverBudget = currentTotal > budget;

  const handleAddBoxToCart = () => {
    const itemsList = Object.values(selectedItems);
    if (itemsList.length === 0) return;

    // Detailed description of contents
    const detailedDescription = itemsList
      .map(
        (i) =>
          `${i.quantity}x ${i.product.name} (${i.variant === 'box' ? `Box of ${i.product.boxQuantity}` : 'Piece'} @ ₹${i.unitPrice})`
      )
      .join(', ');

    const bundleCartItem: CartItem = {
      id: `giftbox-${Date.now()}`,
      productId: 'custom-gift-box',
      productName: 'Custom Gift Box',
      productNameHindi: 'कस्टम गिफ्ट बॉक्स',
      variant: 'box',
      quantity: 1,
      unitPrice: currentTotal,
      boxQuantity: itemsList.reduce((acc, i) => acc + i.quantity, 0),
      image: itemsList[0]?.product.image || products[0]?.image || '',
      description: `Includes: ${detailedDescription}`,
      isGiftBox: true,
      boxName: boxName.trim() || 'Custom Gift Box',
      giftBoxContents: itemsList.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        variant: i.variant,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    };

    onAddCustomBundleToCart(bundleCartItem);
    fireCelebrationBurst();
    setSelectedItems({});
    onOpenCart();
  };

  const handleClearBox = () => {
    if (window.confirm(isHi ? 'क्या आप गिफ्ट बॉक्स खाली करना चाहते हैं?' : 'Remove all items from this gift box?')) {
      setSelectedItems({});
    }
  };

  // Filter products for the builder catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchQuery =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        p.nameHindi?.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCat && matchQuery;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <section
      id="build-your-own-gift-box-section"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 scroll-mt-20"
    >
      {/* Decorative Fireworks Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/15 via-[#080D1A] to-[#060913] rounded-3xl -z-10 border border-amber-500/20" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Gift className="w-4 h-4 text-amber-400" />
          <span>{isHi ? 'कस्टम दिवाली कॉम्बो' : 'Build Your Own Gift Box'}</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-festive tracking-tight">
          {isHi ? 'अपने मनपसंद पटाखों का गिफ्ट पैक बनाएं' : 'Craft Your Custom Family Gift Box'}
        </h2>

        <p className="text-sm text-gray-300 leading-relaxed">
          {isHi
            ? 'अपना अधिकतम बजट तय करें, कैटलॉग से पटाखे जोड़ें, और लाइव रनिंग टोटल देखें। तैयार होने पर पूरा बॉक्स एक ही "कस्टम गिफ्ट बॉक्स" के रूप में कार्ट में जुड़ जाएगा।'
            : 'Set your budget, handpick individual firecrackers from our catalog, and watch your running total in real-time. Once ready, add your entire personalized hamper to cart as a single "Custom Gift Box" item with all contents listed.'}
        </p>
      </div>

      {/* Budget Selector & Hamper Name Controls */}
      <div className="bg-[#05070E] border border-gray-800 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
          {/* Box Name input */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
              {isHi ? 'गिफ्ट बॉक्स का नाम (वैकल्पिक)' : 'Hamper / Box Name:'}
            </label>
            <input
              type="text"
              id="giftbox-name-input"
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              placeholder={isHi ? 'जैसे: शर्मा जी का दीवाली पैक' : 'e.g. Family Celebration Pack'}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090E1B] border border-gray-700 text-white text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-festive"
            />
          </div>

          {/* Budget Preset and Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                {isHi ? 'अधिकतम बजट निर्धारित करें (Budget Target):' : 'Set Your Maximum Budget:'}
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono">₹{budget.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {presetBudgets.map((b) => (
                <button
                  key={b}
                  type="button"
                  id={`giftbox-budget-preset-${b}`}
                  onClick={() => {
                    setBudget(b);
                    setCustomBudgetInput('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    budget === b && !customBudgetInput
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  ₹{b.toLocaleString('en-IN')}
                </button>
              ))}

              {/* Custom budget input */}
              <div className="relative flex-1 min-w-[120px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-mono">₹</span>
                <input
                  type="number"
                  id="giftbox-custom-budget-input"
                  value={customBudgetInput}
                  onChange={(e) => {
                    setCustomBudgetInput(e.target.value);
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) {
                      setBudget(val);
                    }
                  }}
                  placeholder={isHi ? 'कस्टम' : 'Custom'}
                  className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-[#090E1B] border border-gray-700 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Running Total Tracker & Progress Bar */}
        <div className="pt-5 border-t border-gray-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-300 font-semibold flex items-center gap-2">
                <span>{isHi ? 'लाइव रनिंग टोटल:' : 'Live Running Total:'}</span>
                <strong className="text-lg font-mono font-extrabold text-white">
                  ₹{currentTotal.toLocaleString('en-IN')}
                </strong>
                <span className="text-gray-500 text-xs font-mono">/ ₹{budget.toLocaleString('en-IN')}</span>
              </span>

              {isOverBudget ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>
                    ₹{(currentTotal - budget).toLocaleString('en-IN')} {isHi ? 'बजट से अधिक' : 'over budget'}
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    ₹{(budget - currentTotal).toLocaleString('en-IN')} {isHi ? 'शेष बजट' : 'remaining'}
                  </span>
                </span>
              )}
            </div>

            {/* Visual Budget Progress Bar */}
            <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverBudget
                    ? 'bg-red-500'
                    : progressPercent > 85
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Action: Add Box to Cart */}
          <div className="flex items-center gap-2 shrink-0">
            {totalItemsCount > 0 && (
              <button
                type="button"
                id="giftbox-clear-all-btn"
                onClick={handleClearBox}
                className="p-2.5 text-gray-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
                title="Clear box"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              id="giftbox-add-to-cart-btn"
              disabled={totalItemsCount === 0}
              onClick={handleAddBoxToCart}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all ${
                totalItemsCount === 0
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black shadow-amber-500/25 active:scale-95'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {totalItemsCount === 0
                  ? isHi
                    ? 'पटाखे चुनें'
                    : 'Select Items'
                  : `${isHi ? 'कार्ट में "कस्टम गिफ्ट बॉक्स" जोड़ें' : 'Add Single "Custom Gift Box" to Cart'} • ₹${currentTotal.toLocaleString('en-IN')}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Search & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        {/* Category horizontal pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-black shadow'
                : 'bg-[#05070E] text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {isHi ? 'सभी पटाखे' : 'All Crackers'}
          </button>
          {seedCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-black shadow'
                  : 'bg-[#05070E] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {cat.icon} {isHi && cat.nameHindi ? cat.nameHindi : cat.name}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHi ? 'पटाखा खोजें...' : 'Search cracker...'}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#05070E] border border-gray-800 text-xs text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Catalog Grid for Selecting Crackers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const pieceKey = `${product.id}-piece`;
          const boxKey = `${product.id}-box`;
          const pieceQty = selectedItems[pieceKey]?.quantity || 0;
          const boxQty = selectedItems[boxKey]?.quantity || 0;
          const totalThisProductInBox = pieceQty + boxQty;

          return (
            <div
              key={product.id}
              id={`giftbox-item-card-${product.id}`}
              className={`bg-[#05070E] border rounded-2xl p-3.5 flex flex-col justify-between transition-all ${
                totalThisProductInBox > 0
                  ? 'border-amber-500/70 shadow-lg shadow-amber-500/10 bg-[#090E1B]'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div>
                {/* Header with image, sound level and selected badge */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/50 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {totalThisProductInBox > 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                      <Check className="w-3 h-3" />
                      <span>{totalThisProductInBox} {isHi ? 'बॉक्स में शामिल' : 'in box'}</span>
                    </div>
                  )}

                  <span className="absolute bottom-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-gray-300 border border-white/10 backdrop-blur-sm">
                    {product.soundLevel} Sound
                  </span>
                </div>

                <h3 className="font-bold text-xs sm:text-sm text-white font-festive truncate">
                  {isHi && product.nameHindi ? product.nameHindi : product.name}
                </h3>
                <p className="text-[11px] text-gray-400 line-clamp-1 mb-3">
                  {isHi && product.shortDescriptionHindi ? product.shortDescriptionHindi : product.shortDescription}
                </p>
              </div>

              {/* Selector Controls for Piece and Box */}
              <div className="space-y-2 pt-2 border-t border-gray-800/80 text-xs">
                {/* Single Piece Option */}
                <div className="flex items-center justify-between p-1.5 rounded-xl bg-black/40 border border-gray-800/60">
                  <div>
                    <span className="font-semibold text-gray-200 block text-[11px]">{isHi ? 'पीस' : 'Piece'}</span>
                    <span className="font-mono text-amber-400 font-bold text-xs">₹{product.pricePerPiece}</span>
                  </div>

                  <div className="flex items-center bg-[#05070E] border border-gray-700 rounded-lg p-0.5">
                    <button
                      type="button"
                      id={`giftbox-minus-pc-${product.id}`}
                      disabled={pieceQty === 0}
                      onClick={() => handleUpdateItem(product, 'piece', -1)}
                      className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                        pieceQty === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-xs text-white">
                      {pieceQty}
                    </span>
                    <button
                      type="button"
                      id={`giftbox-plus-pc-${product.id}`}
                      onClick={() => handleUpdateItem(product, 'piece', 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Full Box Option */}
                <div className="flex items-center justify-between p-1.5 rounded-xl bg-black/40 border border-gray-800/60">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-200 text-[11px]">{isHi ? 'डब्बा' : 'Box'}</span>
                      <span className="text-[9px] text-gray-500 font-mono">({product.boxQuantity} pcs)</span>
                    </div>
                    <span className="font-mono text-amber-400 font-bold text-xs">₹{product.pricePerBox}</span>
                  </div>

                  <div className="flex items-center bg-[#05070E] border border-gray-700 rounded-lg p-0.5">
                    <button
                      type="button"
                      id={`giftbox-minus-box-${product.id}`}
                      disabled={boxQty === 0}
                      onClick={() => handleUpdateItem(product, 'box', -1)}
                      className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                        boxQty === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-xs text-white">
                      {boxQty}
                    </span>
                    <button
                      type="button"
                      id={`giftbox-plus-box-${product.id}`}
                      onClick={() => handleUpdateItem(product, 'box', 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Floating Bar when items are selected */}
      {totalItemsCount > 0 && (
        <div className="sticky bottom-4 z-30 mt-8">
          <div className="bg-[#090E1B]/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-white flex items-center gap-2 font-festive">
                  <span>{boxName || (isHi ? 'कस्टम गिफ्ट बॉक्स' : 'Custom Gift Box')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    {totalItemsCount} {isHi ? 'सामग्री' : 'items'}
                  </span>
                </p>
                <p className="text-[11px] text-gray-300">
                  {isHi ? 'कुल मूल्य:' : 'Running Total:'}{' '}
                  <strong className="text-amber-400 font-mono text-sm">₹{currentTotal.toLocaleString('en-IN')}</strong>
                  {budget > 0 && (
                    <span className="text-gray-400 text-[10px] ml-1.5">
                      ({isOverBudget ? `₹${currentTotal - budget} over` : `₹${budget - currentTotal} left`})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleAddBoxToCart}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{isHi ? 'कार्ट में "कस्टम गिफ्ट बॉक्स" जोड़ें' : 'Add Single "Custom Gift Box" to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
