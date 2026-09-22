import { Product, Category, CustomerReview, SiteSettings } from '../types';

// Helper to generate distinct celebratory SVG firecracker illustrations in a light minimalist theme
export function getProductPlaceholderSvg(type: string, color: string = '#E11D48', accent: string = '#F59E0B'): string {
  // Soft, gorgeous pastel backgrounds for categories
  const bgColors: Record<string, string> = {
    anar: '#FEF2F2', // Soft red-rose
    chakri: '#FFFBEB', // Soft amber-yellow
    rocket: '#EFF6FF', // Soft blue
    phuljhari: '#F5F3FF', // Soft purple
    skyshot: '#ECFDF5', // Soft emerald-green
    bomb: '#F0FDF4', // Soft green
    sutli: '#F0FDF4',
    gun: '#FFF1F2', // Soft rose-red
    multishot: '#FAF5FF', // Soft purple
    peacock: '#F0FDFA', // Soft teal
  };
  const bg = bgColors[type] || '#F9FAFB';

  const encoded = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="${bg}" rx="16" />
      
      <!-- Elegant subtle background circles -->
      <circle cx="200" cy="140" r="75" fill="none" stroke="${color}" stroke-opacity="0.08" stroke-width="3" stroke-dasharray="10 8" />
      <circle cx="200" cy="140" r="55" fill="none" stroke="${accent}" stroke-opacity="0.1" stroke-width="2" />
      
      <!-- Simple minimalist artwork graphic -->
      <g transform="translate(150, 75)">
        ${getGraphicByType(type, color, accent)}
      </g>
      
      <!-- Clean, ultra-minimal footer -->
      <text x="200" y="265" fill="#9CA3AF" font-family="sans-serif" font-size="10" font-weight="700" text-anchor="middle" letter-spacing="1.5">
        ECO-FRIENDLY GREEN PATAKA
      </text>
    </svg>
  `);
  return `data:image/svg+xml;utf8,${encoded}`;
}

function getGraphicByType(type: string, color: string, accent: string): string {
  switch (type) {
    case 'anar':
      return `
        <!-- Anar Fountain -->
        <polygon points="50,20 15,110 85,110" fill="${color}" stroke="${accent}" stroke-width="2" opacity="0.9" />
        <rect x="42" y="10" width="16" height="12" fill="#E2E8F0" rx="2" stroke="#94A3B8" stroke-width="1" />
        <path d="M50 8 Q45 -20 30 -35 M50 8 Q50 -30 50 -45 M50 8 Q55 -20 70 -35 M50 8 Q65 -15 85 -20 M50 8 Q35 -15 15 -20" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <circle cx="50" cy="-45" r="4" fill="${accent}" />
        <circle cx="30" cy="-35" r="3.5" fill="${accent}" />
        <circle cx="70" cy="-35" r="3.5" fill="${accent}" />
      `;
    case 'chakri':
      return `
        <!-- Ground Chakri Spinner -->
        <circle cx="50" cy="55" r="42" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="10 6" />
        <circle cx="50" cy="55" r="28" fill="none" stroke="${accent}" stroke-width="2" />
        <circle cx="50" cy="55" r="10" fill="${color}" />
        <path d="M50 13 Q75 13 85 33" stroke="${accent}" stroke-width="2" fill="none" />
        <path d="M87 55 Q87 80 67 90" stroke="${accent}" stroke-width="2" fill="none" />
        <path d="M50 97 Q25 97 15 77" stroke="${accent}" stroke-width="2" fill="none" />
        <path d="M13 55 Q13 30 33 20" stroke="${accent}" stroke-width="2" fill="none" />
      `;
    case 'rocket':
      return `
        <!-- Rocket -->
        <g transform="rotate(-30 50 60)">
          <rect x="44" y="20" width="12" height="60" fill="${color}" rx="2" stroke="${accent}" stroke-width="1.5" />
          <polygon points="50,0 38,20 62,20" fill="#EF4444" stroke="${accent}" stroke-width="1" />
          <rect x="48" y="78" width="4" height="60" fill="#B45309" />
          <path d="M50 78 Q45 100 55 120" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 2" fill="none" />
          <circle cx="50" cy="10" r="3" fill="${accent}" />
        </g>
      `;
    case 'phuljhari':
      return `
        <!-- Sparklers / Phuljhari -->
        <g transform="rotate(25 50 60)">
          <rect x="48" y="10" width="4" height="55" fill="#94A3B8" />
          <rect x="48" y="65" width="4" height="55" fill="#475569" />
          <path d="M50 10 L30 -5 M50 15 L75 0 M50 25 L20 20 M50 35 L80 35 M50 45 L25 50 M50 55 L75 60" stroke="${color}" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="30" cy="-5" r="2.5" fill="${accent}" />
          <circle cx="75" cy="0" r="2.5" fill="${accent}" />
          <circle cx="20" cy="20" r="2" fill="${accent}" />
          <circle cx="80" cy="35" r="2" fill="${accent}" />
        </g>
      `;
    case 'skyshot':
      return `
        <!-- Aerial Sky Shot / Shell -->
        <rect x="35" y="25" width="30" height="90" fill="${color}" stroke="${accent}" stroke-width="2" rx="4" />
        <rect x="42" y="10" width="16" height="15" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1" rx="3" />
        <path d="M50 10 Q50 -10 65 -25" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" />
        <circle cx="65" cy="-25" r="4" fill="${accent}" />
        <circle cx="50" cy="45" r="8" fill="#FFF" opacity="0.8" />
        <circle cx="50" cy="75" r="8" fill="#FFF" opacity="0.8" />
      `;
    case 'bomb':
    case 'sutli':
      return `
        <!-- Sutli / Green Twine Bomb -->
        <rect x="25" y="30" width="50" height="55" fill="#16A34A" stroke="#4ADE80" stroke-width="2" rx="8" />
        <line x1="25" y1="45" x2="75" y2="45" stroke="#FFF" stroke-width="2" opacity="0.6" />
        <line x1="25" y1="60" x2="75" y2="60" stroke="#FFF" stroke-width="2" opacity="0.6" />
        <line x1="25" y1="72" x2="75" y2="72" stroke="#FFF" stroke-width="2" opacity="0.6" />
        <line x1="45" y1="30" x2="45" y2="85" stroke="#FFF" stroke-width="1.5" opacity="0.6" />
        <path d="M50 30 Q45 10 60 -5" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" />
        <circle cx="60" cy="-5" r="3" fill="${accent}" />
      `;
    case 'gun':
      return `
        <!-- Toy Gun / Pop Gun -->
        <path d="M15 40 L65 40 L65 60 L50 60 L45 85 L25 85 L32 60 L15 60 Z" fill="${color}" stroke="${accent}" stroke-width="2" />
        <rect x="65" y="44" width="25" height="8" fill="#475569" rx="1" />
        <circle cx="40" cy="55" r="5" fill="#FFF" opacity="0.9" />
      `;
    case 'multishot':
      return `
        <!-- Multi Shots Box Cake -->
        <rect x="15" y="30" width="70" height="70" fill="${color}" stroke="${accent}" stroke-width="2" rx="6" />
        <circle cx="32" cy="48" r="5" fill="#FFF" opacity="0.9" />
        <circle cx="50" cy="48" r="5" fill="#FFF" opacity="0.9" />
        <circle cx="68" cy="48" r="5" fill="#FFF" opacity="0.9" />
        <circle cx="32" cy="65" r="5" fill="#FFF" opacity="0.9" />
        <circle cx="50" cy="65" r="5" fill="#FFF" opacity="0.9" />
        <circle cx="68" cy="65" r="5" fill="#FFF" opacity="0.9" />
      `;
    case 'peacock':
      return `
        <!-- Peacock Feather Fountain -->
        <path d="M50 90 Q20 50 30 20 Q50 35 50 90 Q50 35 70 20 Q80 50 50 90 Z" fill="#0D9488" stroke="${accent}" stroke-width="2" />
        <circle cx="35" cy="30" r="5" fill="#1E3A8A" />
        <circle cx="65" cy="30" r="5" fill="#1E3A8A" />
        <circle cx="35" cy="30" r="2.5" fill="${accent}" />
        <circle cx="65" cy="30" r="2.5" fill="${accent}" />
      `;
    case 'ladi':
      return `
        <!-- Garland / Line Cracker (Ladi) -->
        <line x1="50" y1="5" x2="50" y2="120" stroke="#D97706" stroke-width="2" />
        <rect x="25" y="15" width="22" height="10" fill="${color}" rx="2" stroke="${accent}" stroke-width="1" />
        <rect x="53" y="25" width="22" height="10" fill="${color}" rx="2" stroke="${accent}" stroke-width="1" />
        <rect x="25" y="40" width="22" height="10" fill="${color}" rx="2" stroke="${accent}" stroke-width="1" />
        <rect x="53" y="52" width="22" height="10" fill="${color}" rx="2" stroke="${accent}" stroke-width="1" />
        <rect x="25" y="68" width="22" height="10" fill="${color}" rx="2" stroke="${accent}" stroke-width="1" />
        <rect x="53" y="82" width="22" height="10" fill="${color}" rx="2" stroke="${accent}" stroke-width="1" />
        <circle cx="50" cy="5" r="3" fill="${accent}" />
      `;
    default:
      return `
        <rect x="25" y="30" width="50" height="60" fill="${color}" stroke="${accent}" stroke-width="2" rx="6" />
        <circle cx="50" cy="60" r="12" fill="#FFF" opacity="0.9" />
        <path d="M50 30 Q45 15 55 5" stroke="${accent}" stroke-width="2" fill="none" />
      `;
  }
}

export const SEED_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Patakas', nameHindi: 'सभी पटाखे', icon: 'Sparkles', description: 'Browse our complete festive catalog' },
  { id: 'sparklers', name: 'Sparklers & Phuljhari', nameHindi: 'फूलझड़ी व स्पार्कलर्स', icon: 'Wand2', description: 'Safe, beautiful golden and multicolor sparklers for all ages' },
  { id: 'chakri', name: 'Chakris & Spinners', nameHindi: 'चकरी व चक्कर', icon: 'Disc3', description: 'High-speed dazzling ground spinners with silver & gold trails' },
  { id: 'rockets', name: 'Rockets & Aerial', nameHindi: 'रॉकेट व स्काई शॉट', icon: 'Rocket', description: 'High-flying rockets bursting into vibrant umbrella flares' },
  { id: 'fountains', name: 'Anar & Fountains', nameHindi: 'अनार व फव्वारे', icon: 'Flame', description: 'Towering shower of golden glitter, crackling pearls & colors' },
  { id: 'sound', name: 'Sound & Bombs', nameHindi: 'धमाका व बम', icon: 'Volume2', description: 'Deep bass thunder claps, Sutli bombs, and ladi crackers' },
  { id: 'kids', name: 'Kids & Novelty', nameHindi: 'बच्चों के पटाखे', icon: 'Smile', description: 'Low sound, colorful pops, toy guns, and magic snakes' },
  { id: 'multishots', name: 'Multi-Shots Cakes', nameHindi: 'मल्टी-शॉट केक', icon: 'Layers', description: 'Continuous rapid-fire aerial fireworks displays for grand celebrations' },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'sutli',
    name: 'Sutli',
    nameHindi: 'सुतली बम (छोटा)',
    category: 'sound',
    pricePerPiece: 30,
    pricePerBox: 270,
    boxQuantity: 10,
    shortDescription: 'Classic tight jute cord wrapper with a crisp, punchy blast. Authentic green formulation.',
    shortDescriptionHindi: 'मजबूत जूट डोरी से बंधा क्लासिक पटाखा। तेज और स्पष्ट धमाका।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('sutli', '#16A34A', '#FACC15'),
    inStock: true,
    isBestSeller: true,
    isNewThisYear: false,
    relatedProductIds: ['sutli-bomb', 'badi-sutli', 'lakshmi-bomb'],
    viewCount: 142,
    cartAddCount: 68,
    isGreenCertified: true,
  },
  {
    id: 'anar',
    name: 'Anar',
    nameHindi: 'क्लासिक अनार',
    category: 'fountains',
    pricePerPiece: 45,
    pricePerBox: 400,
    boxQuantity: 10,
    shortDescription: 'Majestic 8-foot golden flower fountain with crackling silver stars. Low smoke emission.',
    shortDescriptionHindi: '8 फीट ऊंची सुनहरी फव्वारा और चांदी की चिंगारियां। कम धुआं।',
    soundLevel: 'Low',
    image: getProductPlaceholderSvg('anar', '#DC2626', '#F59E0B'),
    inStock: true,
    isBestSeller: true,
    isNewThisYear: false,
    relatedProductIds: ['deluxe-anar', 'anar-bomb', 'peacock'],
    viewCount: 215,
    cartAddCount: 112,
    isGreenCertified: true,
  },
  {
    id: 'chakri',
    name: 'Chakri',
    nameHindi: 'जमीन चकरी',
    category: 'chakri',
    pricePerPiece: 25,
    pricePerBox: 220,
    boxQuantity: 10,
    shortDescription: 'Smooth ground spinner emitting vivid emerald and ruby rings with zero wobbling.',
    shortDescriptionHindi: 'जमीन पर तेजी से घूमने वाली चकरी जो हरे और लाल छल्ले बनाती है।',
    soundLevel: 'Low',
    image: getProductPlaceholderSvg('chakri', '#E11D48', '#38BDF8'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: false,
    relatedProductIds: ['fancy-chakri', 'phuljhari', 'anar'],
    viewCount: 180,
    cartAddCount: 85,
    isGreenCertified: true,
  },
  {
    id: 'rocket',
    name: 'Rocket',
    nameHindi: 'रॉकेट (विसलिंग)',
    category: 'rockets',
    pricePerPiece: 50,
    pricePerBox: 450,
    boxQuantity: 10,
    shortDescription: 'Whistling ascent reaching 120+ feet before a golden palm explosion.',
    shortDescriptionHindi: 'सीटी की आवाज के साथ 120 फीट ऊपर जाकर सुनहरे बादलों में फूटता है।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('rocket', '#9333EA', '#FDE047'),
    inStock: true,
    isBestSeller: true,
    isNewThisYear: false,
    relatedProductIds: ['sky-shot', 'missile-gun', 'star-bomb'],
    viewCount: 164,
    cartAddCount: 79,
    isGreenCertified: true,
  },
  {
    id: 'phuljhari',
    name: 'Phuljhari',
    nameHindi: 'फूलझड़ी (15 सेमी)',
    category: 'sparklers',
    pricePerPiece: 15,
    pricePerBox: 140,
    boxQuantity: 10,
    shortDescription: '15cm smokeless sparkling wire with long burning duration and safe, cool handling.',
    shortDescriptionHindi: '15 सेमी लंबी सुरक्षित फूलझड़ी, धीमी और मनमोहक सुनहरी रोशनी।',
    soundLevel: 'Low',
    image: getProductPlaceholderSvg('phuljhari', '#D97706', '#FFFFFF'),
    inStock: true,
    isBestSeller: true,
    isNewThisYear: false,
    relatedProductIds: ['chakri', 'anar', 'pop-pop'],
    viewCount: 310,
    cartAddCount: 184,
    isGreenCertified: true,
  },
  {
    id: 'sky-shot',
    name: 'Sky Shot',
    nameHindi: 'सिंगल स्काई शॉट',
    category: 'rockets',
    pricePerPiece: 120,
    pricePerBox: 550,
    boxQuantity: 5,
    shortDescription: 'Heavy aerial shell with double break: brilliant crimson peony followed by titanium thunder.',
    shortDescriptionHindi: 'आसमान में जाकर दो बार फूटने वाला शॉट: पहले लाल रंग फिर तेज गूंज।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('skyshot', '#0284C7', '#F59E0B'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: false,
    relatedProductIds: ['sky-shot-25', 'sky-shot-50', 'rocket'],
    viewCount: 195,
    cartAddCount: 90,
    isGreenCertified: true,
  },
  {
    id: 'lakshmi-bomb',
    name: 'Lakshmi Bomb',
    nameHindi: 'लक्ष्मी बम',
    category: 'sound',
    pricePerPiece: 35,
    pricePerBox: 320,
    boxQuantity: 10,
    shortDescription: 'Traditional favorite paper-wrapped cracker with deep bass resonance and rapid ignition.',
    shortDescriptionHindi: 'दिवाली का पारंपरिक सबसे पसंदीदा बम। दमदार और साफ आवाज।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('bomb', '#BE123C', '#FEF08A'),
    inStock: true,
    isBestSeller: true,
    isNewThisYear: false,
    relatedProductIds: ['sutli', 'star-bomb', 'bullet-bomb'],
    viewCount: 240,
    cartAddCount: 130,
    isGreenCertified: true,
  },
  {
    id: 'bijli',
    name: 'Bijli',
    nameHindi: 'बिजली क्रैकर',
    category: 'sound',
    pricePerPiece: 20,
    pricePerBox: 180,
    boxQuantity: 10,
    shortDescription: 'Fast, sharp crackling red tubes designed for spirited festive celebrations.',
    shortDescriptionHindi: 'तेज और तीखी चटखने वाली आवाज, मध्यम डेसिबल।',
    soundLevel: 'Medium',
    image: getProductPlaceholderSvg('bomb', '#EA580C', '#FEF08A'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: false,
    relatedProductIds: ['line-cracker', 'pop-pop', 'bullet-bomb'],
    viewCount: 95,
    cartAddCount: 38,
    isGreenCertified: true,
  },
  {
    id: 'star-bomb',
    name: 'Star Bomb',
    nameHindi: 'स्टार बम',
    category: 'sound',
    pricePerPiece: 40,
    pricePerBox: 360,
    boxQuantity: 10,
    shortDescription: 'High-decibel ground thunder with an initial shower of silver stars.',
    shortDescriptionHindi: 'पहले चमकदार तारों की फुहार फिर जोरदार गूंज।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('bomb', '#4338CA', '#FDE047'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: true,
    relatedProductIds: ['lakshmi-bomb', 'sutli', 'anar-bomb'],
    viewCount: 110,
    cartAddCount: 45,
    isGreenCertified: true,
  },
  {
    id: 'pop-pop',
    name: 'Pop Pop',
    nameHindi: 'पॉप पॉप (स्नैपर्स)',
    category: 'kids',
    pricePerPiece: 10,
    pricePerBox: 80,
    boxQuantity: 10,
    shortDescription: 'Friction-sensitive throw-down snappers. Completely fire-free and child safe.',
    shortDescriptionHindi: 'बिना माचिस के जमीन पर फेंकने से फूटने वाले सुरक्षित पटाखे।',
    soundLevel: 'Low',
    image: getProductPlaceholderSvg('gun', '#059669', '#FDE047'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: false,
    relatedProductIds: ['gun', 'phuljhari', 'bijli'],
    viewCount: 155,
    cartAddCount: 82,
    isGreenCertified: true,
  },
  {
    id: 'gun',
    name: 'Gun',
    nameHindi: 'रिंग कैप गन',
    category: 'kids',
    pricePerPiece: 90,
    pricePerBox: 160,
    boxQuantity: 2,
    shortDescription: 'Heavy-duty metallic-look toy pistol with 12-round rotary ring cap loader.',
    shortDescriptionHindi: 'बच्चों की रिवॉल्वर गन, 12 राउंड कैप्स के साथ। सुरक्षित और मजेदार।',
    soundLevel: 'Medium',
    image: getProductPlaceholderSvg('gun', '#B91C1C', '#E2E8F0'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: false,
    relatedProductIds: ['missile-gun', 'pop-pop', 'phuljhari'],
    viewCount: 120,
    cartAddCount: 50,
    isGreenCertified: true,
  },
  {
    id: 'missile-gun',
    name: 'Missile Gun',
    nameHindi: 'मिसाइल गन',
    category: 'kids',
    pricePerPiece: 180,
    pricePerBox: 340,
    boxQuantity: 2,
    shortDescription: 'Shoulder-mount launcher releasing 6 rapid tracer mini-missiles into the sky.',
    shortDescriptionHindi: 'आसमान में लगातार 6 मिसाइल छोड़ने वाली फैंसी गन।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('gun', '#7C2D12', '#FDE047'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: true,
    relatedProductIds: ['gun', 'sky-shot', 'rocket'],
    viewCount: 140,
    cartAddCount: 62,
    isGreenCertified: true,
  },
  {
    id: 'anar-bomb',
    name: 'Anar Bomb',
    nameHindi: 'अनार बम',
    category: 'fountains',
    pricePerPiece: 55,
    pricePerBox: 500,
    boxQuantity: 10,
    shortDescription: 'Dual action: begins as a gentle silver fountain and concludes with an energetic pop.',
    shortDescriptionHindi: 'पहले सुंदर फव्वारा फिर अंत में एक मजेदार धमाका।',
    soundLevel: 'Medium',
    image: getProductPlaceholderSvg('anar', '#9D174D', '#FBBF24'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: false,
    relatedProductIds: ['anar', 'deluxe-anar', 'sutli'],
    viewCount: 130,
    cartAddCount: 58,
    isGreenCertified: true,
  },
  {
    id: 'bullet-bomb',
    name: 'Bullet Bomb',
    nameHindi: 'बुलेट बम',
    category: 'sound',
    pricePerPiece: 40,
    pricePerBox: 380,
    boxQuantity: 10,
    shortDescription: 'Aerodynamic cylindrical bomb engineered for deep, vibrating bass echoing.',
    shortDescriptionHindi: 'सिलेंडर के आकार का बुलेट बम, गूंजने वाली गहरी आवाज।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('bomb', '#1E3A8A', '#F59E0B'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: false,
    relatedProductIds: ['sutli', 'lakshmi-bomb', 'aloo-bomb'],
    viewCount: 105,
    cartAddCount: 42,
    isGreenCertified: true,
  },
  {
    id: 'sutli-bomb',
    name: 'Sutli Bomb',
    nameHindi: 'सुतली बम (मीडियम)',
    category: 'sound',
    pricePerPiece: 50,
    pricePerBox: 460,
    boxQuantity: 10,
    shortDescription: 'Heavyweight reinforced jute bomb. Our signature festival crowd roar maker.',
    shortDescriptionHindi: 'हमारा सबसे प्रसिद्ध सुतली बम। मजबूत पैकिंग और तेज आवाज।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('sutli', '#047857', '#FDE047'),
    inStock: true,
    isBestSeller: true,
    isNewThisYear: false,
    relatedProductIds: ['badi-sutli', 'sutli', 'aloo-bomb'],
    viewCount: 290,
    cartAddCount: 165,
    isGreenCertified: true,
  },
  {
    id: 'badi-sutli',
    name: 'Badi Sutli',
    nameHindi: 'बड़ी सुतli (जंबो)',
    category: 'sound',
    pricePerPiece: 75,
    pricePerBox: 700,
    boxQuantity: 10,
    shortDescription: 'Jumbo size triple-bound jute bomb for outdoor open-ground celebrations.',
    shortDescriptionHindi: 'जंबो साइज ट्रिपल वाउंड सुतली बम, केवल खुले मैदान के लिए।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('sutli', '#065F46', '#FEF08A'),
    inStock: true,
    isBestSeller: true,
    isNewThisYear: false,
    relatedProductIds: ['sutli-bomb', 'aloo-bomb', 'line-cracker'],
    viewCount: 220,
    cartAddCount: 110,
    isGreenCertified: true,
  },
  {
    id: 'aloo-bomb',
    name: 'Aloo Bomb',
    nameHindi: 'आलू बम (सुपर लाउड)',
    category: 'sound',
    pricePerPiece: 85,
    pricePerBox: 800,
    boxQuantity: 10,
    shortDescription: 'High density round explosive shell with seismic ground-shaking blast.',
    shortDescriptionHindi: 'गोल आकार का शक्तिशाली आलू बम। तीव्र ध्वनि और कंपन।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('bomb', '#854D0E', '#FEF08A'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: false,
    relatedProductIds: ['badi-sutli', 'sutli-bomb', 'lakshmi-bomb'],
    viewCount: 175,
    cartAddCount: 78,
    isGreenCertified: true,
  },
  {
    id: 'sky-shot-25',
    name: 'Sky Shot 25 Shots',
    nameHindi: '25 शॉट्स स्काई शॉट केक',
    category: 'multishots',
    pricePerPiece: 650,
    pricePerBox: 1200,
    boxQuantity: 2,
    shortDescription: '25 continuous timed aerial shots painting the night sky with multicolored brocades.',
    shortDescriptionHindi: '25 लगातार रंग-बिरंगे आसमानी धमाके, पूरे परिवार के लिए शानदार शो।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('multishot', '#6D28D9', '#38BDF8'),
    inStock: true,
    isBestSeller: true,
    isNewThisYear: true,
    relatedProductIds: ['sky-shot-50', 'sky-shot', 'rocket'],
    viewCount: 260,
    cartAddCount: 135,
    isGreenCertified: true,
  },
  {
    id: 'sky-shot-50',
    name: 'Sky Shot 50 Shots',
    nameHindi: '50 शॉट्स ग्रैंड फिनाले केक',
    category: 'multishots',
    pricePerPiece: 1250,
    pricePerBox: 2400,
    boxQuantity: 2,
    shortDescription: 'Grand finale cake! 50 rapid-fire aerial shells with silver glittering willow willow tail.',
    shortDescriptionHindi: 'त्योहार का सबसे बड़ा धमाका! 50 तेज तर्रार आसमानी पटाखे।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('multishot', '#581C87', '#FDE047'),
    inStock: true,
    isBestSeller: true,
    isNewThisYear: true,
    relatedProductIds: ['sky-shot-25', 'sky-shot', 'peacock'],
    viewCount: 320,
    cartAddCount: 140,
    isGreenCertified: true,
  },
  {
    id: 'peacock',
    name: 'Peacock',
    nameHindi: 'मोर फव्वारा (पीकॉक)',
    category: 'fountains',
    pricePerPiece: 160,
    pricePerBox: 750,
    boxQuantity: 5,
    shortDescription: 'Spectacular multi-angle fountain shaped like a peacock spreading glittering plumage.',
    shortDescriptionHindi: 'मोर के पंखों जैसा चौड़ा और बहु-रंगीन फव्वारा, बेहद खूबसूरत दृश्य।',
    soundLevel: 'Low',
    image: getProductPlaceholderSvg('peacock', '#0F766E', '#FDE047'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: true,
    relatedProductIds: ['deluxe-anar', 'anar', 'fancy-chakri'],
    viewCount: 190,
    cartAddCount: 88,
    isGreenCertified: true,
  },
  {
    id: 'deluxe-anar',
    name: 'Deluxe Anar',
    nameHindi: 'डीलक्स अनार (बड़ा)',
    category: 'fountains',
    pricePerPiece: 80,
    pricePerBox: 750,
    boxQuantity: 10,
    shortDescription: 'Giant cone generating a 15-foot continuous fountain of golden pearls and crackles.',
    shortDescriptionHindi: '15 फीट ऊंचा विशाल अनार, लंबे समय तक जलने वाली सुनहरी फुहार।',
    soundLevel: 'Low',
    image: getProductPlaceholderSvg('anar', '#B91C1C', '#F59E0B'),
    inStock: true,
    isBestSeller: true,
    isNewThisYear: false,
    relatedProductIds: ['anar', 'peacock', 'chakri'],
    viewCount: 205,
    cartAddCount: 98,
    isGreenCertified: true,
  },
  {
    id: 'fancy-chakri',
    name: 'Fancy Chakri',
    nameHindi: 'फैंसी चकरी (डीलक्स)',
    category: 'chakri',
    pricePerPiece: 60,
    pricePerBox: 550,
    boxQuantity: 10,
    shortDescription: 'Deluxe ground spinner with color change: starts ruby red, transitions to electric blue.',
    shortDescriptionHindi: 'रंग बदलने वाली आधुनिक चकरी: पहले लाल फिर जादुई नीली रोशनी।',
    soundLevel: 'Low',
    image: getProductPlaceholderSvg('chakri', '#BE185D', '#38BDF8'),
    inStock: true,
    isBestSeller: false,
    isNewThisYear: true,
    relatedProductIds: ['chakri', 'phuljhari', 'deluxe-anar'],
    viewCount: 145,
    cartAddCount: 65,
    isGreenCertified: true,
  },
  {
    id: 'line-cracker',
    name: 'Line Cracker',
    nameHindi: 'लड़ी पटाखा (100 व 1000)',
    category: 'sound',
    pricePerPiece: 110,
    pricePerBox: 950,
    boxQuantity: 10,
    shortDescription: 'Synchronized chain garland cracker delivering rapid celebratory rhythm.',
    shortDescriptionHindi: 'लगातार बजने वाली लड़ी, त्योहार की असली खुशियों भरी गूंज।',
    soundLevel: 'High',
    image: getProductPlaceholderSvg('ladi', '#C2410C', '#FEF08A'),
    inStock: true,
    isBestSeller: true,
    isNewThisYear: false,
    relatedProductIds: ['sutli', 'lakshmi-bomb', 'bijli'],
    viewCount: 275,
    cartAddCount: 145,
    isGreenCertified: true,
  },
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  businessName: 'Shri Ganesh Pataka Bhandar',
  businessNameHindi: 'श्री गणेश पटाखा भंडार',
  whatsappPhone: '+919876543210',
  contactPhone: '+919876543210',
  stallLocation: 'Stall #14, Diwali Mela Ground, Near Ramlila Manch, Main Market',
  stallLocationHindi: 'स्टॉल #14, दिवाली मेला ग्राउंड, रामलीला मंच के पास, मुख्य बाजार',
  businessHours: '9:00 AM - 11:30 PM (Daily till Bhai Dooj)',
  businessHoursHindi: 'सुबह 9:00 से रात 11:30 बजे तक (भाई दूज तक निरंतर)',
  minOrderAmount: 500,
  diwaliDate: '2026-11-08',
  currencySymbol: '₹',
  adminPin: 'diwali2026',
  adminPassword: 'diwali2026',
  festiveThemeMode: 'auto',
};

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Rahul Sharma',
    location: 'Civil Lines',
    rating: 5,
    quote: 'Ordered the 50-shot cake and Deluxe Anars on WhatsApp. Picked them up packed and ready within 20 mins at the stall. Zero waiting!',
    quoteHindi: 'व्हाट्सएप पर 50-शॉट और डीलक्स अनार ऑर्डर किए। स्टॉल पर 20 मिनट में पैक मिले। कोई लाइन नहीं!',
    year: 2025,
  },
  {
    id: 'rev-2',
    customerName: 'Priya Mehra',
    location: 'Sector 15',
    rating: 5,
    quote: 'Green PESO certified crackers. The sparklers had virtually no bad smoke and burned for over a minute. Kids loved the Pop Pops and toy gun.',
    quoteHindi: 'असली ग्रीन पटाखे। फूलझड़ियों में धुआं बिल्कुल नहीं था। बच्चों को रिंग गन बहुत पसंद आई।',
    year: 2025,
  },
  {
    id: 'rev-3',
    customerName: 'Amit Verma',
    location: 'Model Town',
    rating: 5,
    quote: 'The Custom Gift Box builder feature is so helpful. Built a ₹3,000 family hamper in 2 minutes and sent it over WhatsApp. Very transparent pricing.',
    quoteHindi: 'गिफ्ट बॉक्स बिल्डर बहुत बढ़िया है। 2 मिनट में ₹3,000 का गिफ्ट पैक तैयार करके ऑर्डर कर दिया।',
    year: 2025,
  },
  {
    id: 'rev-4',
    customerName: 'Vikram Patel',
    location: 'Station Road',
    rating: 5,
    quote: 'Best quality Sutli Bombs in town. Clean loud blast without duds. Will always buy from here.',
    quoteHindi: 'शहर में सबसे बेहतरीन सुतली बम। एक भी पटाखा फुस नहीं निकला। बहुत शानदार!',
    year: 2025,
  },
];

export const seedCategories = SEED_CATEGORIES;
