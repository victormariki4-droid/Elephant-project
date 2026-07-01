export const colors = {
  primary: { main: '#16a34a', light: '#dcfce7', dark: '#14532d' },
  danger:  { main: '#ef4444', light: '#fee2e2', dark: '#b91c1c' },
  amber:   { main: '#f59e0b', light: '#fef3c7', dark: '#92400e' },
  brown:   { main: '#c2410c', light: '#fff7ed', dark: '#7c2d12' },
  dark:    { bg: '#0f172a', card: '#1e293b', border: '#334155', text: '#94a3b8' },
  white:   '#ffffff',
  slate:   { 50: '#f8fafc', 100: '#f1f5f9', 500: '#64748b', 700: '#334155', 900: '#0f172a' },
};

export const alertTypes = {
  sighting: {
    label: 'Sighting',
    swahili: 'Tembo Kaonekana',
    emoji: '🐘',
    color: colors.amber.main,
    bgColor: colors.amber.light,
  },
  crop_damage: {
    label: 'Crop Damage',
    swahili: 'Uharibifu wa Mazao',
    emoji: '🌾',
    color: colors.brown.main,
    bgColor: colors.brown.light,
  },
  immediate_danger: {
    label: 'Immediate Danger',
    swahili: 'Hatari ya Haraka',
    emoji: '⚠️',
    color: colors.danger.main,
    bgColor: colors.danger.light,
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
