import React from 'react';
import { ShieldCheck, Flame, Heart, AlertTriangle, Phone, MessageCircle } from 'lucide-react';
import { SiteSettings, Language } from '../types';

interface FooterProps {
  settings: SiteSettings;
  language: Language;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, language, onOpenAdmin }) => {
  const isHi = language === 'hi';

  return (
    <footer id="main-footer" className="bg-white border-t border-gray-100 text-gray-500 text-xs">
      {/* Safety Guidelines Banner */}
      <div className="border-b border-gray-100 py-8 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-800 font-bold uppercase tracking-wider text-xs mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{isHi ? 'सुरक्षित एवं हरित दीपावली संकल्प' : 'Safe & Eco-Responsible Diwali Guidelines'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-700">
            <div className="p-3.5 rounded-xl bg-white border border-gray-150 shadow-sm">
              <span className="text-amber-800 font-bold block mb-1">🪔 {isHi ? 'खुला मैदान' : 'Open Ground'}</span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {isHi ? 'पटाखों को हमेशा खुले मैदान में ही जलाएं, बालकनी या घर के अंदर कदापि नहीं।' : 'Always ignite crackers in open outdoor areas, never on balconies or indoors.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-gray-150 shadow-sm">
              <span className="text-amber-800 font-bold block mb-1">🪣 {isHi ? 'पानी की बाल्टी' : 'Water Standby'}</span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {isHi ? 'आसपास पानी और रेत की बाल्टी हमेशा तैयार रखें।' : 'Keep buckets of water and sand readily accessible at the lighting spot.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-gray-150 shadow-sm">
              <span className="text-amber-800 font-bold block mb-1">👕 {isHi ? 'सूती वस्त्र' : 'Cotton Clothes'}</span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {isHi ? 'पटाखे जलाते समय केवल सूती (कॉटन) कपड़े और जूते पहनें।' : 'Wear comfortable cotton clothing and footwear; avoid synthetic fabrics.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-gray-150 shadow-sm">
              <span className="text-amber-800 font-bold block mb-1">🌿 {isHi ? 'ग्रीन फॉर्मूलेशन' : 'PESO Certified'}</span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {isHi ? 'हमारे सभी पटाखे CSIR-NEERI द्वारा अनुमोदित ग्रीन पटाखे हैं।' : 'All our crackers use barium-free green formulations certified by CSIR-NEERI.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-gray-900 font-festive text-base font-bold mb-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>{isHi ? 'सुरक्षित ग्रीन पटाखे' : 'Safe Green Crackers'}</span>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
            {isHi
              ? 'आपके परिवार की दीवाली को सुरक्षित, चमकदार और यादगार बनाने के लिए प्रमाणित ग्रीन पटाखों का संपूर्ण संग्रह।'
              : 'Empowering families with genuine, low-smoke, certified green fireworks directly through physical stall and express WhatsApp booking.'}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              CSIR-NEERI Approved
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-3">
            {isHi ? 'स्टॉल विवरण एवं संपर्क' : 'Stall Information'}
          </h4>
          <ul className="space-y-2 text-xs text-gray-600">
            <li>📍 {settings.stallLocation}</li>
            <li>⏰ {settings.businessHours}</li>
            <li>📞 {settings.contactPhone}</li>
            <li className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {settings.whatsappPhone}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-3">
            {isHi ? 'ऑर्डर एवं चेकआउट प्रक्रिया' : 'How Checkout Works'}
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            {isHi
              ? 'वेबसाइट पर कोई ऑनलाइन भुगतान या कार्ड विवरण नहीं देना होता। आपकी चुनी हुई सामग्री की लिस्ट सीधे हमारे व्हाट्सएप पर भेजी जाती है।'
              : 'Zero payment gateways or credit cards required. Your cart opens directly in WhatsApp with items and total pre-calculated for stall confirmation.'}
          </p>
          <button
            onClick={onOpenAdmin}
            className="text-[11px] text-gray-400 hover:text-amber-600 font-semibold transition-colors"
          >
            Stall Management Login
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 py-4 text-center text-[11px] text-gray-400">
        © {new Date().getFullYear()}. {isHi ? 'शुभ दीपावली!' : 'Happy Diwali! Wish you health, peace and prosperity.'}
      </div>
    </footer>
  );
};
