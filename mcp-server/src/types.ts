export interface GradientPreset {
  name: string;
  colors: string[];
}

export interface FrameSettings {
  padding: number;
  borderRadius: number;
  gradientType: 'linear' | 'radial';
  gradientAngle: number;
  gradientColors: string[];
  noiseEnabled: boolean;
  noiseOpacity: number;
  shadowEnabled: boolean;
  shadowIntensity: number;
  glowEnabled: boolean;
  sizeMode: 'match' | 'fixed';
  fixedWidth: number;
  exportScale: 1 | 2 | 3;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  // Warm
  { name: 'Sunset', colors: ['#FF512F', '#F09819', '#DD2476'] },
  { name: 'Peach', colors: ['#FFE29F', '#FFA99F', '#FF719A'] },
  { name: 'Fire', colors: ['#f12711', '#f5af19'] },
  { name: 'Mango', colors: ['#ffe259', '#ffa751'] },

  // Cool
  { name: 'Ocean', colors: ['#2193b0', '#6dd5ed', '#00d2ff'] },
  { name: 'Sky', colors: ['#89F7FE', '#66A6FF'] },
  { name: 'Frost', colors: ['#000428', '#004e92'] },
  { name: 'Arctic', colors: ['#E0EAFC', '#CFDEF3'] },

  // Purple/Pink
  { name: 'Aurora', colors: ['#00c6ff', '#0072ff', '#7209b7'] },
  { name: 'Candy', colors: ['#D299C2', '#FEF9D7', '#FFB7B2'] },
  { name: 'Grape', colors: ['#8E2DE2', '#4A00E0'] },
  { name: 'Rose', colors: ['#ee9ca7', '#ffdde1'] },
  { name: 'Lavender', colors: ['#C9D6FF', '#E2E2E2'] },

  // Nature
  { name: 'Forest', colors: ['#134E5E', '#71B280'] },
  { name: 'Mint', colors: ['#00b09b', '#96c93d'] },
  { name: 'Emerald', colors: ['#348F50', '#56B4D3'] },

  // Dark/Neutral
  { name: 'Mono', colors: ['#434343', '#000000', '#1a1a1a'] },
  { name: 'Slate', colors: ['#2c3e50', '#4ca1af'] },
  { name: 'Noir', colors: ['#0f0c29', '#302b63', '#24243e'] },
  { name: 'Steel', colors: ['#485563', '#29323c'] },

  // Vibrant
  { name: 'Neon', colors: ['#00F260', '#0575E6'] },
  { name: 'Electric', colors: ['#a8ff78', '#78ffd6'] },
  { name: 'Cosmic', colors: ['#ff00cc', '#333399'] },
  { name: 'Rainbow', colors: ['#f953c6', '#b91d73', '#00d4ff'] },
];

export const DEFAULT_SETTINGS: FrameSettings = {
  padding: 64,
  borderRadius: 20,
  gradientType: 'linear',
  gradientAngle: 135,
  gradientColors: ['#FF512F', '#F09819', '#DD2476'],
  noiseEnabled: false,
  noiseOpacity: 0.05,
  shadowEnabled: true,
  shadowIntensity: 0.3,
  glowEnabled: false,
  sizeMode: 'match',
  fixedWidth: 1080,
  exportScale: 1,
};
