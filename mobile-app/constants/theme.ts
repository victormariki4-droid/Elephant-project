export const colors = {
  primary: { main: '#16a34a', light: '#dcfce7', dark: '#14532d' },
  danger:  { main: '#ef4444', light: '#fee2e2', dark: '#b91c1c' },
  amber:   { main: '#f59e0b', light: '#fef3c7', dark: '#92400e' },
  brown:   { main: '#c2410c', light: '#fff7ed', dark: '#7c2d12' },
  glass:   { bg: '#f0f4f8', card: 'rgba(255,255,255,0.85)', border: 'rgba(0,0,0,0.08)' },
  white:   '#ffffff',
  slate:   { 50: '#f8fafc', 100: '#f1f5f9', 500: '#64748b', 700: '#334155', 900: '#0f172a' },
};

export const alertTypes = {
  sighting: {
    label: 'Sighting / Normal Movement',
    swahili: 'Tembo Kaonekana',
    emoji: '🐘',
    color: '#f59e0b',
    bgGradient: ['#fef3c7', '#fde68a'],
    accentColor: '#d97706',
  },
  property_damage: {
    label: 'Property Damage',
    swahili: 'Uharibifu wa Mali',
    emoji: '🏚️',
    color: '#c2410c',
    bgGradient: ['#fff7ed', '#fed7aa'],
    accentColor: '#ea580c',
  },
  crop_damage: {
    label: 'Crop Damage',
    swahili: 'Uharibifu wa Mazao',
    emoji: '🌾',
    color: '#16a34a',
    bgGradient: ['#dcfce7', '#bbf7d0'],
    accentColor: '#15803d',
  },
  livestock_killing: {
    label: 'Livestock Depredation',
    swahili: 'Uwindaji wa Mifugo',
    emoji: '🐄',
    color: '#92400e',
    bgGradient: ['#fef3c7', '#fde68a'],
    accentColor: '#78350f',
  },
  human_injury: {
    label: 'Human Injury',
    swahili: 'Mtu Amejeruhiwa',
    emoji: '🩹',
    color: '#7c3aed',
    bgGradient: ['#f5f3ff', '#ddd6fe'],
    accentColor: '#6d28d9',
  },
  human_death: {
    label: 'Human Death',
    swahili: 'Kifo cha Mtu',
    emoji: '☠️',
    color: '#dc2626',
    bgGradient: ['#fef2f2', '#fecaca'],
    accentColor: '#b91c1c',
  },
} as const;

export const mitigationMethods = [
  { id: 'air_horns', label: 'Air Horns', emoji: '📯' },
  { id: 'chili_flashlights', label: 'Chili Flashlights', emoji: '🌶️' },
  { id: 'firecrackers', label: 'Firecrackers', emoji: '🧨' },
  { id: 'chili_fences', label: 'Chili Fences', emoji: '🚧' },
  { id: 'beehive_fences', label: 'Beehive Fences', emoji: '🐝' },
  { id: 'flashlights', label: 'Flashlights', emoji: '🔦' },
  { id: 'vehicle_patrol', label: 'Vehicle Patrol', emoji: '🚗' },
] as const;
