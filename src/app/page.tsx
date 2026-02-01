'use client';

import { useState, useCallback, useEffect } from 'react';
import UploadDropzone from '@/components/UploadDropzone';
import PreviewCanvas from '@/components/PreviewCanvas';
import ControlsPanel from '@/components/ControlsPanel';
import ExportButtons from '@/components/ExportButtons';
import { DEFAULT_SETTINGS, FrameSettings, ImageData } from '@/types';
import { RenderResult } from '@/utils/canvasRenderer';

export default function Home() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [settings, setSettings] = useState<FrameSettings>(DEFAULT_SETTINGS);
  const [renderResult, setRenderResult] = useState<RenderResult | null>(null);

  const handleImageLoad = useCallback((data: ImageData) => {
    setImageData(data);
    setSettings((prev) => ({ ...prev, scalingConfirmed: false }));
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (ev) => {
            const src = ev.target?.result as string;
            const img = new window.Image();
            img.onload = () => {
              handleImageLoad({
                src,
                width: img.width,
                height: img.height,
                name: 'pasted-image',
              });
            };
            img.src = src;
          };
          reader.readAsDataURL(file);
          return;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleImageLoad]);

  const handleSettingsChange = useCallback((newSettings: FrameSettings) => {
    // Reset scaling confirmation when size settings change
    if (
      newSettings.sizeMode !== settings.sizeMode ||
      newSettings.fixedWidth !== settings.fixedWidth
    ) {
      newSettings.scalingConfirmed = false;
    }
    setSettings(newSettings);
  }, [settings]);

  const handleConfirmScaling = useCallback(() => {
    setSettings((prev) => ({ ...prev, scalingConfirmed: true }));
  }, []);

  const handleRenderResult = useCallback((result: RenderResult | null) => {
    setRenderResult(result);
  }, []);

  const scalingRequired =
    settings.sizeMode === 'fixed' &&
    imageData !== null &&
    imageData.width > settings.fixedWidth - settings.padding * 2;

  const canExport =
    imageData !== null &&
    renderResult !== null &&
    (!scalingRequired || settings.scalingConfirmed);

  const handleReset = () => {
    setImageData(null);
    setSettings(DEFAULT_SETTINGS);
    setRenderResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Framo</h1>
            <p className="text-sm text-zinc-500">Frame screenshots. Nothing else.</p>
          </div>
{/* Start over button moved to floating position */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {!imageData ? (
          /* Upload State */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-lg">
              <UploadDropzone onImageLoad={handleImageLoad} />
              <p className="text-center text-zinc-600 text-sm mt-4">
                Your images never leave your browser.
              </p>
            </div>
          </div>
        ) : (
          /* Editor State */
          <div className="flex-1 flex">
            {/* Controls Panel */}
            <aside className="w-80 flex-shrink-0 border-r border-zinc-800 overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                  <div className="w-10 h-10 rounded bg-zinc-800 overflow-hidden flex-shrink-0">
                    <img
                      src={imageData.src}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{imageData.name}</p>
                    <p className="text-xs text-zinc-500">
                      {imageData.width} × {imageData.height}px
                    </p>
                  </div>
                </div>

                <ControlsPanel
                  settings={settings}
                  onSettingsChange={handleSettingsChange}
                  scalingRequired={scalingRequired}
                  onConfirmScaling={handleConfirmScaling}
                />

                <ExportButtons
                  canvas={renderResult?.canvas ?? null}
                  filename={imageData.name}
                  disabled={!canExport}
                />
              </div>
            </aside>

            {/* Preview Area */}
            <div className="flex-1 bg-zinc-900/50 checkerboard overflow-hidden relative">
              <PreviewCanvas
                imageData={imageData}
                settings={settings}
                onRenderResult={handleRenderResult}
              />
              <button
                onClick={handleReset}
                className="absolute top-4 right-4 px-3 py-1.5 text-sm text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm border border-zinc-700 rounded-lg transition-all shadow-lg"
              >
                Start over
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
