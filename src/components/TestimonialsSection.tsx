import React from 'react';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface Testimonial {
  id: string;
  name: string;
  nameHindi: string;
  location: string;
  rating: number;
  yearsCustomer: string;
  reviewEn: string;
  reviewHi: string;
  purchasedItem: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rahul Verma',
    nameHindi: 'राहुल वर्मा',
    location: 'Sector 14, Resident',
    rating: 5,
    yearsCustomer: '4 Diwalis in a row',
    reviewEn:
      'Bought here for 4 Diwalis in a row! Zero duds in the entire 50-shot cake. The WhatsApp checkout was a game changer — sent the message at 3 PM and collected my packed carton from Stall 14 at 6 PM without waiting in line.',
    reviewHi:
      'लगातार 4 साल से यहीं से पटाखे खरीद रहे हैं। 50-शॉट स्काई शॉट में एक भी फुस नहीं निकला। व्हाट्सएप चेकआउट बहुत आसान था — 3 बजे मैसेज भेजा और शाम 6 बजे स्टॉल 14 से बिना लाइन के पैक डिब्बा ले लिया।',
    purchasedItem: '50-Shot Sky Symphony & Sutli Special',
  },
  {
    id: '2',
    name: 'Priya Malhotra',
    nameHindi: 'प्रिया मल्होत्रा',
    location: 'Green Glen Colony',
    rating: 5,
    yearsCustomer: '2nd Year Customer',
    reviewEn:
      'We have small kids and an elderly pet, so sound was our biggest worry. Their low-sound filter made it so easy to pick peacock anars and color sparklers. Completely smokeless and sparkling bright!',
    reviewHi:
      'हमारे घर में छोटे बच्चे और कुत्ता है, इसलिए तेज आवाज की चिंता थी। वेबसाइट पर धीमी आवाज वाले फिल्टर से मयूर अनार और कलर फुलझड़ियां चुनना बहुत आसान रहा। कम धुआं और बेहद खूबसूरत रोशनी!',
    purchasedItem: 'Kids Joy Sparkler & Deluxe Anar Set',
  },
  {
    id: '3',
    name: 'Vikram Singhal',
    nameHindi: 'विक्रम सिंघल',
    location: 'Model Town',
    rating: 5,
    yearsCustomer: '3 Diwalis in a row',
    reviewEn:
      'Their custom Gift Box builder saved me so much hassle for corporate gifts. I built 10 custom hampers under ₹2,000 each and sent the whole list directly on WhatsApp. Everything was packed in waterproof boxes.',
    reviewHi:
      'गिफ्ट बॉक्स बिल्डर की मदद से मैंने अपनी ऑफिस टीम के लिए ₹2,000 के अंदर 10 गिफ्ट हैंपर बनाए और सीधे व्हाट्सएप पर ऑर्डर दिया। सभी पटाखे वाटरप्रूफ बॉक्स में बहुत सुंदर पैक होकर मिले।',
    purchasedItem: '10x Custom Diwali Gift Hampers',
  },
  {
    id: '4',
    name: 'Amit Patel',
    nameHindi: 'अमित पटेल',
    location: 'Civil Lines',
    rating: 5,
    yearsCustomer: 'Regular Customer',
    reviewEn:
      'Genuine green crackers with the CSIR-NEERI green logo on every single box. Transparent piece and box pricing meant no bargaining headache at the stall. Best pataka store in the city.',
    reviewHi:
      'हर डिब्बे पर CSIR-NEERI का असली ग्रीन लोगो लगा हुआ था। प्रति पीस और डब्बे का भाव पहले से तय होने के कारण स्टॉल पर मोलभाव का कोई चक्कर नहीं पड़ा। शहर की सबसे बेहतरीन पटाखा दुकान!',
    purchasedItem: 'Chakri, Rockets & Lakshmi Bomb',
  },
];

interface TestimonialsSectionProps {
  language: Language;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ language }) => {
  const isHi = language === 'hi';

  return (
    <section
      id="customer-testimonials-section"
      className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-gray-100 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHi ? 'ग्राहकों का अनुभव और विश्वास' : 'Loved by 5,000+ Families'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-festive">
            {isHi ? 'हमारे खुशहाल ग्राहकों की जुबानी' : 'What Our Patrons Say Every Diwali'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            {isHi
              ? 'हर साल हजारों परिवार हमारे स्टॉल पर भरोसा करते हैं। देखिए वे क्या कहते हैं:'
              : 'Zero duds, genuine green formulations, and zero stall waiting lines.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-300 transition-colors shadow-sm"
            >
              <div>
                {/* Stars and customer tenure badge */}
                <div className="flex items-center justify-between gap-1 mb-3">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                    {t.yearsCustomer}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{isHi ? t.reviewHi : t.reviewEn}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                      <span>{isHi ? t.nameHindi : t.name}</span>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    </h4>
                    <p className="text-[10px] text-gray-400">{t.location}</p>
                  </div>
                </div>
                <p className="text-[10px] text-amber-700 font-semibold mt-1 truncate">
                  Ordered: {t.purchasedItem}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
