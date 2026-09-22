import React from 'react';
import { Gift, Dices, ShieldCheck, Sparkles, MessageCircle, ArrowDown } from 'lucide-react';
import { Language } from '../types';

interface HeroSectionProps {
  language: Language;
  onOpenGiftBoxBuilder: () => void;
  onOpenSurpriseMe: () => void;
  onScrollToCatalog: () => void;
  isFestiveMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onOpenGiftBoxBuilder,
  onOpenSurpriseMe,
  onScrollToCatalog,
  isFestiveMode,
}) => {
  const isHi = language === 'hi';

  return (
    <section
      id="hero-fireworks-section"
      className="relative overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-16 border-b border-gray-100 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Trust Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>{isHi ? '100% ओरिजिनल ग्रीन पटाखे • CSIR-NEERI & PESO प्रमाणित' : '100% Original Green Crackers • CSIR-NEERI & PESO Certified'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>

        {/* Hero Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto font-festive">
          {isHi ? (
            <>
              रोशनी, उमंग और खुशियों भरी <br />
              <span className="text-amber-600">
                शुभ दीपावली 2026
              </span>
            </>
          ) : (
            <>
              Celebrate Diwali with Pure Radiance <br />
              <span className="text-amber-600">
                Direct WhatsApp Stall Checkout
              </span>
            </>
          )}
        </h2>

        {/* Hero Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {isHi
            ? 'अपनी पसंद के पटाखे कार्ट में जोड़ें और सीधे हमारे स्टॉल व्हाट्सएप पर भेजें। कोई पेमेंट गेटवे का झंझट नहीं — स्टॉल से तैयार पिकअप या होम डिलीवरी!'
            : 'Select individual patakas or boxes, build custom family hampers, and tap once to send your complete order directly to our physical stall over WhatsApp.'}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Build Custom Gift Box */}
          <button
            id="hero-gift-box-builder-btn"
            onClick={onOpenGiftBoxBuilder}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Gift className="w-4 h-4 text-white" />
            <span>{isHi ? '🎁 अपना गिफ्ट बॉक्स बनाएं' : '🎁 Build Custom Gift Box'}</span>
          </button>

          {/* Surprise Me Budget Generator */}
          <button
            id="hero-surprise-me-btn"
            onClick={onOpenSurpriseMe}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-semibold text-sm shadow-sm transition-all active:scale-95"
          >
            <Dices className="w-4 h-4 text-purple-600" />
            <span>{isHi ? '🎲 सरप्राइज मी (बजट पैक)' : '🎲 Surprise Me (Smart Mix)'}</span>
          </button>

          {/* WhatsApp Direct Inquiries */}
          <button
            id="hero-browse-catalog-btn"
            onClick={onScrollToCatalog}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-medium text-sm shadow-sm transition-colors"
          >
            <span>{isHi ? 'पटाखा सूची देखें' : 'Browse Catalog (23 Items)'}</span>
            <ArrowDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-2.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <span className="text-xl">🌿</span>
            <div>
              <p className="text-xs font-semibold text-gray-800">{isHi ? 'कम धुआं' : 'Low Smoke'}</p>
              <p className="text-[10px] text-gray-500">{isHi ? '30% कम उत्सर्जन' : '30% Less Emission'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <span className="text-xl">🏪</span>
            <div>
              <p className="text-xs font-semibold text-gray-800">{isHi ? 'लोकल स्टॉल' : 'Physical Stall'}</p>
              <p className="text-[10px] text-gray-500">{isHi ? 'हाथों-हाथ पैकिंग' : 'Live Order Packing'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <span className="text-xl">💬</span>
            <div>
              <p className="text-xs font-semibold text-gray-800">{isHi ? 'व्हाट्सएप चेकआउट' : 'WhatsApp Checkout'}</p>
              <p className="text-[10px] text-gray-500">{isHi ? 'नो पेमेंट गेटवे' : 'No Gateway / Pure Ease'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <span className="text-xl">📦</span>
            <div>
              <p className="text-xs font-semibold text-gray-800">{isHi ? 'पारदर्शी दाम' : 'Dual Pricing'}</p>
              <p className="text-[10px] text-gray-500">{isHi ? 'पीस व डब्बा भाव' : 'Per Piece & Box Rates'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
