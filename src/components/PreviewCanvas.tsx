'use client';

import { useEffect, useRef, useState } from 'react';
import { FrameSettings, ImageData } from '@/types';
import { renderToCanvas, RenderResult } from '@/utils/canvasRenderer';

interface PreviewCanvasProps {
  imageData: ImageData | null;
  settings: FrameSettings;
  onRenderResult: (result: RenderResult | null) => void;
}

export default function PreviewCanvas({ imageData, settings, onRenderResult }: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    if (!imageData || !canvasRef.current) {
      onRenderResult(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const result = renderToCanvas(img, settings);
      onRenderResult(result);

      // Copy rendered canvas to preview canvas
      const previewCanvas = canvasRef.current!;
      const previewCtx = previewCanvas.getContext('2d')!;

      // Set canvas size to match render result
      previewCanvas.width = result.canvas.width;
      previewCanvas.height = result.canvas.height;

      previewCtx.drawImage(result.canvas, 0, 0);

      // Calculate scale to fit preview in container
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48;
        const containerHeight = containerRef.current.clientHeight - 48;
        const canvasWidth = result.canvas.width;
        const canvasHeight = result.canvas.height;

        const scale = Math.min(
          containerWidth / canvasWidth,
          containerHeight / canvasHeight,
          1
        );
        setPreviewScale(scale);
      }
    };
    img.src = imageData.src;
  }, [imageData, settings, onRenderResult]);

  if (!imageData) {
    return null;
  }

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-6">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full rounded-lg shadow-2xl"
        style={{
          transform: `scale(${previewScale})`,
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
}
