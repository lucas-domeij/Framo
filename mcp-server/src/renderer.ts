import { createCanvas, loadImage, type SKRSContext2D, type Canvas } from '@napi-rs/canvas';
import { readFile } from 'node:fs/promises';
import type { FrameSettings } from './types.js';

export async function renderFramedImage(
  imagePath: string,
  settings: FrameSettings
): Promise<Buffer> {
  const imageBuffer = await readFile(imagePath);
  const image = await loadImage(imageBuffer);

  const imgWidth = image.width;
  const imgHeight = image.height;

  let outputWidth: number;
  let outputHeight: number;
  let imageDrawWidth: number;
  let imageDrawHeight: number;
  let scaleFactor = 1;

  const { exportScale } = settings;

  if (settings.sizeMode === 'match') {
    outputWidth = imgWidth + settings.padding * 2;
    outputHeight = imgHeight + settings.padding * 2;
    imageDrawWidth = imgWidth;
    imageDrawHeight = imgHeight;
  } else {
    const availableWidth = settings.fixedWidth - settings.padding * 2;
    if (imgWidth > availableWidth) {
      scaleFactor = availableWidth / imgWidth;
    }
    imageDrawWidth = imgWidth * scaleFactor;
    imageDrawHeight = imgHeight * scaleFactor;
    outputWidth = settings.fixedWidth;
    outputHeight = imageDrawHeight + settings.padding * 2;
  }

  const canvas = createCanvas(outputWidth * exportScale, outputHeight * exportScale);
  const ctx = canvas.getContext('2d');
  ctx.scale(exportScale, exportScale);

  // Draw gradient background (clipped to rounded rect if needed)
  if (settings.borderRadius > 0) {
    ctx.save();
    ctx.beginPath();
    drawRoundedRect(ctx, 0, 0, outputWidth, outputHeight, settings.borderRadius);
    ctx.clip();
    drawGradient(ctx, outputWidth, outputHeight, settings);
    ctx.restore();
  } else {
    drawGradient(ctx, outputWidth, outputHeight, settings);
  }

  // Draw noise if enabled
  if (settings.noiseEnabled) {
    drawNoise(ctx, outputWidth * exportScale, outputHeight * exportScale, settings.noiseOpacity, exportScale);
  }

  // Draw glow if enabled
  if (settings.glowEnabled) {
    drawGlow(ctx, settings.padding, settings.padding, imageDrawWidth, imageDrawHeight, settings);
  }

  // Draw shadow if enabled
  if (settings.shadowEnabled) {
    drawShadow(ctx, settings.padding, settings.padding, imageDrawWidth, imageDrawHeight, settings);
  }

  // Draw rounded card background behind image if radius > 0
  if (settings.borderRadius > 0) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    drawRoundedRect(ctx, settings.padding, settings.padding, imageDrawWidth, imageDrawHeight, settings.borderRadius);
    ctx.fill();
    ctx.restore();
  }

  // Draw the image (clipped to rounded rect if needed)
  ctx.save();
  if (settings.borderRadius > 0) {
    ctx.beginPath();
    drawRoundedRect(ctx, settings.padding, settings.padding, imageDrawWidth, imageDrawHeight, settings.borderRadius);
    ctx.clip();
  }
  ctx.drawImage(image, settings.padding, settings.padding, imageDrawWidth, imageDrawHeight);
  ctx.restore();

  return canvasToPngBuffer(canvas);
}

function drawGradient(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  settings: FrameSettings
) {
  let gradient;

  if (settings.gradientType === 'linear') {
    const angleRad = (settings.gradientAngle * Math.PI) / 180;
    const x1 = width / 2 - Math.cos(angleRad) * width;
    const y1 = height / 2 - Math.sin(angleRad) * height;
    const x2 = width / 2 + Math.cos(angleRad) * width;
    const y2 = height / 2 + Math.sin(angleRad) * height;
    gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  } else {
    gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 1.5
    );
  }

  const colors = settings.gradientColors;
  const step = 1 / (colors.length - 1);
  colors.forEach((color, index) => {
    gradient.addColorStop(index * step, color);
  });

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawNoise(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  opacity: number,
  exportScale: number
) {
  // Save current transform then reset for pixel-level manipulation
  ctx.save();
  ctx.resetTransform();

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 255 * opacity;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
  ctx.restore();
  ctx.scale(exportScale, exportScale);
}

function drawShadow(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  settings: FrameSettings
) {
  ctx.save();
  ctx.shadowColor = `rgba(0, 0, 0, ${settings.shadowIntensity})`;
  ctx.shadowBlur = 40 * settings.shadowIntensity;
  ctx.shadowOffsetY = 20 * settings.shadowIntensity;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
  drawRoundedRect(ctx, x, y, width, height, settings.borderRadius);
  ctx.fill();
  ctx.restore();
}

function drawGlow(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  settings: FrameSettings
) {
  ctx.save();
  ctx.shadowColor = settings.gradientColors[0];
  ctx.shadowBlur = 60;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
  drawRoundedRect(ctx, x, y, width, height, settings.borderRadius);
  ctx.fill();
  ctx.restore();
}

function drawRoundedRect(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function canvasToPngBuffer(canvas: Canvas): Buffer {
  return canvas.toBuffer('image/png');
}
