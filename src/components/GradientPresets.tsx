'use client';

import { GRADIENT_PRESETS, GradientPreset } from '@/types';

interface GradientPresetsProps {
  selectedColors: string[];
  onSelect: (colors: string[]) => void;
}

export default function GradientPresets({ selectedColors, onSelect }: GradientPresetsProps) {
  const isSelected = (preset: GradientPreset) => {
    return JSON.stringify(preset.colors) === JSON.stringify(selectedColors);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-400">Presets</label>
      <div className="flex flex-wrap gap-2">
        {GRADIENT_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onSelect(preset.colors)}
            className={`
              relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${isSelected(preset)
                ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900'
                : 'hover:scale-105'
              }
            `}
            style={{
              background: `linear-gradient(135deg, ${preset.colors.join(', ')})`,
            }}
          >
            <span className="relative z-10 text-white drop-shadow-md">
              {preset.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
