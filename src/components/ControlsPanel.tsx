'use client';

import { FrameSettings } from '@/types';
import GradientPresets from './GradientPresets';

interface ControlsPanelProps {
  settings: FrameSettings;
  onSettingsChange: (settings: FrameSettings) => void;
  scalingRequired: boolean;
  onConfirmScaling: () => void;
}

export default function ControlsPanel({
  settings,
  onSettingsChange,
  scalingRequired,
  onConfirmScaling
}: ControlsPanelProps) {
  const update = <K extends keyof FrameSettings>(key: K, value: FrameSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleNumberInput = (
    key: keyof FrameSettings,
    value: string,
    min: number,
    max: number
  ) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      update(key, Math.min(max, Math.max(min, num)) as FrameSettings[typeof key]);
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...settings.gradientColors];
    newColors[index] = color;
    onSettingsChange({ ...settings, gradientColors: newColors });
  };

  const addColor = () => {
    if (settings.gradientColors.length < 3) {
      onSettingsChange({
        ...settings,
        gradientColors: [...settings.gradientColors, '#ffffff'],
      });
    }
  };

  const removeColor = (index: number) => {
    if (settings.gradientColors.length > 2) {
      const newColors = settings.gradientColors.filter((_, i) => i !== index);
      onSettingsChange({ ...settings, gradientColors: newColors });
    }
  };

  return (
    <div className="space-y-6">
      {/* Padding */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <label className="text-zinc-400">Padding</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max="200"
              value={settings.padding}
              onChange={(e) => handleNumberInput('padding', e.target.value, 0, 200)}
              className="w-16 bg-zinc-800 text-zinc-200 text-right px-2 py-1 rounded border border-zinc-700 focus:border-blue-500 focus:outline-none"
            />
            <span className="text-zinc-500">px</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          value={settings.padding}
          onChange={(e) => update('padding', Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Border Radius */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <label className="text-zinc-400">Corner Radius</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max="60"
              value={settings.borderRadius}
              onChange={(e) => handleNumberInput('borderRadius', e.target.value, 0, 60)}
              className="w-16 bg-zinc-800 text-zinc-200 text-right px-2 py-1 rounded border border-zinc-700 focus:border-blue-500 focus:outline-none"
            />
            <span className="text-zinc-500">px</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="60"
          value={settings.borderRadius}
          onChange={(e) => update('borderRadius', Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <hr className="border-zinc-800" />

      {/* Gradient Presets */}
      <GradientPresets
        selectedColors={settings.gradientColors}
        onSelect={(colors) => update('gradientColors', colors)}
      />

      {/* Gradient Type */}
      <div className="space-y-2">
        <label className="text-sm text-zinc-400">Gradient Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => update('gradientType', 'linear')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              settings.gradientType === 'linear'
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700/50'
            }`}
          >
            Linear
          </button>
          <button
            onClick={() => update('gradientType', 'radial')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              settings.gradientType === 'radial'
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700/50'
            }`}
          >
            Radial
          </button>
        </div>
      </div>

      {/* Gradient Angle (only for linear) */}
      {settings.gradientType === 'linear' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <label className="text-zinc-400">Angle</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="360"
                value={settings.gradientAngle}
                onChange={(e) => handleNumberInput('gradientAngle', e.target.value, 0, 360)}
                className="w-16 bg-zinc-800 text-zinc-200 text-right px-2 py-1 rounded border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
              <span className="text-zinc-500">°</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={settings.gradientAngle}
            onChange={(e) => update('gradientAngle', Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      )}

      {/* Color Stops */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm text-zinc-400">Colors</label>
          {settings.gradientColors.length < 3 && (
            <button
              onClick={addColor}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              + Add color
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {settings.gradientColors.map((color, index) => (
            <div key={index} className="relative">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-zinc-700 bg-transparent"
              />
              {settings.gradientColors.length > 2 && (
                <button
                  onClick={() => removeColor(index)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-400"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="border-zinc-800" />

      {/* Noise Toggle */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm text-zinc-400">Noise / Grain</label>
          <button
            onClick={() => update('noiseEnabled', !settings.noiseEnabled)}
            className={`w-10 h-6 rounded-full transition-all ${
              settings.noiseEnabled ? 'bg-blue-500' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${
                settings.noiseEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        {settings.noiseEnabled && (
          <input
            type="range"
            min="0.01"
            max="0.15"
            step="0.01"
            value={settings.noiseOpacity}
            onChange={(e) => update('noiseOpacity', Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        )}
      </div>

      {/* Shadow Toggle */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm text-zinc-400">Shadow</label>
          <button
            onClick={() => update('shadowEnabled', !settings.shadowEnabled)}
            className={`w-10 h-6 rounded-full transition-all ${
              settings.shadowEnabled ? 'bg-blue-500' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${
                settings.shadowEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        {settings.shadowEnabled && (
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={settings.shadowIntensity}
            onChange={(e) => update('shadowIntensity', Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        )}
      </div>

      {/* Glow Toggle */}
      <div className="flex justify-between items-center">
        <label className="text-sm text-zinc-400">Background Glow</label>
        <button
          onClick={() => update('glowEnabled', !settings.glowEnabled)}
          className={`w-10 h-6 rounded-full transition-all ${
            settings.glowEnabled ? 'bg-blue-500' : 'bg-zinc-700'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${
              settings.glowEnabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <hr className="border-zinc-800" />

      {/* Size Mode */}
      <div className="space-y-2">
        <label className="text-sm text-zinc-400">Output Size</label>
        <div className="flex gap-2">
          <button
            onClick={() => update('sizeMode', 'match')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              settings.sizeMode === 'match'
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700/50'
            }`}
          >
            Match Image
          </button>
          <button
            onClick={() => update('sizeMode', 'fixed')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              settings.sizeMode === 'fixed'
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700/50'
            }`}
          >
            Fixed Width
          </button>
        </div>
      </div>

      {settings.sizeMode === 'fixed' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <label className="text-zinc-400">Width</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="400"
                max="4000"
                value={settings.fixedWidth}
                onChange={(e) => handleNumberInput('fixedWidth', e.target.value, 400, 4000)}
                className="w-20 bg-zinc-800 text-zinc-200 text-right px-2 py-1 rounded border border-zinc-700 focus:border-blue-500 focus:outline-none"
              />
              <span className="text-zinc-500">px</span>
            </div>
          </div>
          <input
            type="range"
            min="400"
            max="4000"
            step="10"
            value={settings.fixedWidth}
            onChange={(e) => update('fixedWidth', Number(e.target.value))}
            className="w-full accent-blue-500"
          />

          {scalingRequired && !settings.scalingConfirmed && (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-400 text-sm mb-2">
                Image will be scaled down to fit. Original pixels will be modified.
              </p>
              <button
                onClick={onConfirmScaling}
                className="w-full py-2 bg-amber-500 text-black text-sm font-medium rounded-lg hover:bg-amber-400 transition-colors"
              >
                Confirm Scaling
              </button>
            </div>
          )}
        </div>
      )}

      <hr className="border-zinc-800" />

      {/* Export Scale */}
      <div className="space-y-2">
        <label className="text-sm text-zinc-400">Export Scale (HiDPI)</label>
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((scale) => (
            <button
              key={scale}
              onClick={() => update('exportScale', scale)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                settings.exportScale === scale
                  ? 'bg-zinc-700 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700/50'
              }`}
            >
              {scale}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
