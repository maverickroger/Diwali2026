import React from 'react';
import { MapPin, Clock, Phone, Navigation, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { SiteSettings, Language } from '../types';

interface StallTrustSectionProps {
  settings: SiteSettings;
  language: Language;
}

export const StallTrustSection: React.FC<StallTrustSectionProps> = ({ settings, language }) => {
  const isHi = language === 'hi';

  const handleDirections = () => {
    const query = encodeURIComponent(`${settings.businessName} ${settings.stallLocation}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <section
      id="stall-location-section"
      className="py-12 sm:py-16 bg-white border-t border-b border-gray-100 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHi ? 'हमारा असली जमीनी स्टॉल' : 'Visit Our Physical Stall'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-festive">
            {isHi ? 'मेले में हमारे स्टॉल पर पधारें' : 'As Seen at Our Diwali Mela Stall'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            {isHi
              ? '15 वर्षों से शहर के सबसे भरोसेमंद और असली ग्रीन पटाखों का केंद्र। ऑनलाइन ऑर्डर करें और काउंटर पर बिना कतार के पिकअप करें!'
              : 'Browse online from the comfort of home, send your WhatsApp cart, and pick up your pre-packed carton in seconds.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Stall Photo / Visual Mockup */}
          <div className="lg:col-span-6 relative group rounded-3xl overflow-hidden border border-gray-100 shadow-lg bg-gray-50">
            {/* High-res Diwali Mela Stall Graphic */}
            <svg
              viewBox="0 0 600 400"
              className="w-full h-auto object-cover"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#EFF6FF" />
                </linearGradient>
                <linearGradient id="stallTent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
                <linearGradient id="counterWood" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
              </defs>

              <rect width="600" height="400" fill="url(#nightSky)" />

              {/* Sky firework bursts */}
              <circle cx="120" cy="80" r="40" fill="#F59E0B" opacity="0.1" />
              <circle cx="480" cy="90" r="50" fill="#EC4899" opacity="0.08" />
              <circle cx="300" cy="50" r="30" fill="#10B981" opacity="0.08" />

              {/* Festoon / Toran Lights String */}
              <path
                d="M0 40 Q 150 70 300 40 T 600 40"
                fill="none"
                stroke="#FCD34D"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
              <circle cx="75" cy="50" r="5" fill="#EF4444" />
              <circle cx="150" cy="55" r="5" fill="#F59E0B" />
              <circle cx="225" cy="50" r="5" fill="#10B981" />
              <circle cx="300" cy="40" r="6" fill="#3B82F6" />
              <circle cx="375" cy="50" r="5" fill="#F59E0B" />
              <circle cx="450" cy="55" r="5" fill="#EF4444" />
              <circle cx="525" cy="50" r="5" fill="#10B981" />

              {/* Stall Canopy / Awning */}
              <polygon points="50,110 550,110 580,180 20,180" fill="url(#stallTent)" />
              {/* Awning stripes */}
              <polygon points="100,110 150,110 160,180 110,180" fill="#FFF" opacity="0.7" />
              <polygon points="220,110 270,110 280,180 230,180" fill="#FFF" opacity="0.7" />
              <polygon points="340,110 390,110 400,180 350,180" fill="#FFF" opacity="0.7" />
              <polygon points="460,110 510,110 520,180 470,180" fill="#FFF" opacity="0.7" />

              {/* Stall Main Board */}
              <rect x="120" y="125" width="360" height="40" rx="8" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
              <text
                x="300"
                y="149"
                fill="#B45309"
                fontSize="15"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="Cinzel, serif"
              >
                STALL NO. 14 • GREEN FESTIVE WORLD
              </text>
              <text x="300" y="160" fill="#D97706" fontSize="8" fontWeight="bold" textAnchor="middle">
                CSIR-NEERI &amp; PESO CERTIFIED PATAKAS
              </text>

              {/* Cracker Shelves in Stall */}
              <rect x="70" y="180" width="460" height="150" fill="#F8FAFC" stroke="#E2E8F0" />
              {/* Stacked Cracker Boxes */}
              <rect x="90" y="200" width="60" height="35" rx="3" fill="#FCA5A5" />
              <rect x="95" y="205" width="50" height="10" fill="#FEF08A" />
              <rect x="160" y="195" width="70" height="40" rx="3" fill="#A7F3D0" />
              <rect x="240" y="200" width="80" height="35" rx="3" fill="#C084FC" />
              <rect x="330" y="195" width="90" height="40" rx="3" fill="#FDE047" />
              <rect x="430" y="200" width="70" height="35" rx="3" fill="#FDA4AF" />

              {/* Second row of boxes */}
              <rect x="85" y="245" width="75" height="35" rx="3" fill="#93C5FD" />
              <rect x="170" y="245" width="80" height="35" rx="3" fill="#FED7AA" />
              <rect x="260" y="245" width="70" height="35" rx="3" fill="#99F6E4" />
              <rect x="340" y="245" width="80" height="35" rx="3" fill="#FCA5A5" />
              <rect x="430" y="245" width="75" height="35" rx="3" fill="#FEF08A" />

              {/* Counter desk */}
              <rect x="50" y="290" width="500" height="90" rx="6" fill="url(#counterWood)" />
              <rect x="60" y="295" width="480" height="6" fill="#F59E0B" opacity="0.6" />

              {/* Glowing Diyas on Counter */}
              <ellipse cx="120" cy="310" rx="14" ry="7" fill="#78350F" />
              <circle cx="120" cy="303" r="5" fill="#F59E0B" />
              <circle cx="120" cy="301" r="2.5" fill="#FEF08A" />

              <ellipse cx="480" cy="310" rx="14" ry="7" fill="#78350F" />
              <circle cx="480" cy="303" r="5" fill="#F59E0B" />
              <circle cx="480" cy="301" r="2.5" fill="#FEF08A" />

              {/* Sign on Counter */}
              <rect x="200" y="320" width="200" height="40" rx="6" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
              <text x="300" y="337" fill="#B45309" fontSize="10" fontWeight="bold" textAnchor="middle">
                ⚡ WHATSAPP EXPRESS PICKUP
              </text>
              <text x="300" y="349" fill="#78350F" fontSize="8" textAnchor="middle">
                SHOW YOUR MESSAGE &amp; TAKE YOUR BOX
              </text>
            </svg>

            {/* Overlay Badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-gray-100 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-xs font-bold text-gray-900">Stall #14 • Grand Diwali Mela Ground</p>
                  <p className="text-[10px] text-amber-600 font-semibold">Open 7 Days a Week during Diwali Season</p>
                </div>
              </div>
              <button
                onClick={handleDirections}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isHi ? 'रास्ता देखें' : 'Get Directions'}</span>
              </button>
            </div>
          </div>

          {/* Right: Stall Hours, Phone & Zero-Dud Policy */}
          <div className="lg:col-span-6 space-y-5">
            {/* Info cards */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-950">
                    {isHi ? 'स्टॉल का पता और स्थान' : 'Physical Stall Location'}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    {isHi && settings.stallLocationHindi ? settings.stallLocationHindi : settings.stallLocation}
                  </p>
                  <p className="text-[11px] text-amber-700 font-semibold mt-1">
                    {isHi ? 'समीप: गेट नंबर 2, मुख्य पार्किंग के पास' : 'Near Gate #2, Main Vehicle Parking Area'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-950">
                    {isHi ? 'स्टॉल का समय (दिवाली सप्ताह)' : 'Festival Working Hours'}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {settings.businessHours} (Daily without holidays)
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    {isHi ? 'धनतेरस और दीवाली की रात 12:30 बजे तक खुला रहेगा' : 'Open till 12:30 AM on Dhanteras & Diwali Night'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-950">
                    {isHi ? 'स्टॉल संपर्क व हेल्पलाइन' : 'Direct Stall Inquiries'}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 font-mono">
                    {settings.contactPhone} / WhatsApp: {settings.whatsappPhone}
                  </p>
                </div>
              </div>
            </div>

            {/* Zero Dud Guarantee Box */}
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4.5 flex items-start gap-3 shadow-sm">
              <Award className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                  {isHi ? '100% जीरो-फुस (Zero-Dud) गारंटी' : 'Zero-Dud Replacement Guarantee'}
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {isHi
                    ? 'यदि कोई पटाखा नहीं जलता है, तो खाली खोल हमारे काउंटर पर लाएं — हम बिना किसी सवाल के उसे तुरंत बदल कर देंगे।'
                    : 'If any piece fails to ignite, bring the casing back to our stall counter for an instant, no-questions-asked replacement.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
