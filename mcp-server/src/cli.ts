#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { writeFile } from 'node:fs/promises';
import { resolve, basename, dirname, extname } from 'node:path';
import { existsSync } from 'node:fs';
import { renderFramedImage } from './renderer.js';
import { GRADIENT_PRESETS, DEFAULT_SETTINGS, type FrameSettings } from './types.js';

const HELP = `
  framo - Frame screenshots with beautiful gradients

  Usage:
    framo <image> [options]

  Options:
    -o, --output <path>         Output file path (default: <name>-framed.png)
    -p, --preset <name>         Gradient preset (default: Sunset)
    --padding <px>              Padding in pixels (default: 64)
    --radius <px>               Border radius (default: 20)
    --no-shadow                 Disable drop shadow
    --shadow-intensity <n>      Shadow intensity 0-1 (default: 0.3)
    --noise                     Enable noise texture
    --noise-opacity <n>         Noise opacity 0-1 (default: 0.05)
    --glow                      Enable glow effect
    --gradient-type <type>      linear or radial (default: linear)
    --gradient-angle <deg>      Gradient angle 0-360 (default: 135)
    --colors <hex,hex,...>       Custom gradient colors (e.g. "#ff0000,#0000ff")
    --scale <n>                 Export scale: 1, 2, or 3 (default: 1)
    --width <px>                Fixed width mode (auto-scales image)
    --list-presets              List available gradient presets
    -h, --help                  Show this help

  Examples:
    framo screenshot.png
    framo screenshot.png -p Ocean --padding 80
    framo screenshot.png --colors "#ff0000,#00ff00" --radius 30
    framo screenshot.png -o framed.png --scale 2
`;

function listPresets() {
  console.log('\n  Available gradient presets:\n');
  const categories: Record<string, string[]> = {
    'Warm': [], 'Cool': [], 'Purple/Pink': [],
    'Nature': [], 'Dark/Neutral': [], 'Vibrant': [],
  };
  const catNames = Object.keys(categories);
  const catRanges = [
    [0, 4], [4, 8], [8, 13], [13, 16], [16, 20], [20, 24],
  ];
  catRanges.forEach(([start, end], i) => {
    for (let j = start; j < end && j < GRADIENT_PRESETS.length; j++) {
      const p = GRADIENT_PRESETS[j];
      categories[catNames[i]].push(`${p.name.padEnd(12)} ${p.colors.join(' → ')}`);
    }
  });
  for (const [cat, presets] of Object.entries(categories)) {
    console.log(`  ${cat}:`);
    presets.forEach(p => console.log(`    ${p}`));
    console.log();
  }
}

function fail(msg: string): never {
  console.error(`\n  Error: ${msg}\n`);
  process.exit(1);
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      output:            { type: 'string',  short: 'o' },
      preset:            { type: 'string',  short: 'p' },
      padding:           { type: 'string' },
      radius:            { type: 'string' },
      'no-shadow':       { type: 'boolean' },
      'shadow-intensity':{ type: 'string' },
      noise:             { type: 'boolean' },
      'noise-opacity':   { type: 'string' },
      glow:              { type: 'boolean' },
      'gradient-type':   { type: 'string' },
      'gradient-angle':  { type: 'string' },
      colors:            { type: 'string' },
      scale:             { type: 'string' },
      width:             { type: 'string' },
      'list-presets':    { type: 'boolean' },
      help:              { type: 'boolean', short: 'h' },
    },
  });

  if (values.help) {
    console.log(HELP);
    process.exit(0);
  }

  if (values['list-presets']) {
    listPresets();
    process.exit(0);
  }

  const imagePath = positionals[0];
  if (!imagePath) {
    console.log(HELP);
    fail('No image path provided');
  }

  const absPath = resolve(imagePath);
  if (!existsSync(absPath)) {
    fail(`File not found: ${absPath}`);
  }

  // Build settings from defaults + flags
  const settings: FrameSettings = { ...DEFAULT_SETTINGS };

  // Preset
  if (values.preset) {
    const preset = GRADIENT_PRESETS.find(
      p => p.name.toLowerCase() === values.preset!.toLowerCase()
    );
    if (!preset) {
      fail(`Unknown preset "${values.preset}". Use --list-presets to see available presets.`);
    }
    settings.gradientColors = preset.colors;
  }

  // Custom colors override preset
  if (values.colors) {
    const colors = values.colors.split(',').map(c => c.trim());
    if (colors.length < 2) fail('Need at least 2 colors');
    settings.gradientColors = colors;
  }

  if (values.padding !== undefined) {
    const n = parseInt(values.padding);
    if (isNaN(n) || n < 0 || n > 200) fail('Padding must be 0-200');
    settings.padding = n;
  }

  if (values.radius !== undefined) {
    const n = parseInt(values.radius);
    if (isNaN(n) || n < 0 || n > 60) fail('Radius must be 0-60');
    settings.borderRadius = n;
  }

  if (values['no-shadow']) {
    settings.shadowEnabled = false;
  }

  if (values['shadow-intensity'] !== undefined) {
    const n = parseFloat(values['shadow-intensity']);
    if (isNaN(n) || n < 0 || n > 1) fail('Shadow intensity must be 0-1');
    settings.shadowIntensity = n;
    settings.shadowEnabled = true;
  }

  if (values.noise) {
    settings.noiseEnabled = true;
  }

  if (values['noise-opacity'] !== undefined) {
    const n = parseFloat(values['noise-opacity']);
    if (isNaN(n) || n < 0 || n > 1) fail('Noise opacity must be 0-1');
    settings.noiseOpacity = n;
    settings.noiseEnabled = true;
  }

  if (values.glow) {
    settings.glowEnabled = true;
  }

  if (values['gradient-type'] !== undefined) {
    if (values['gradient-type'] !== 'linear' && values['gradient-type'] !== 'radial') {
      fail('Gradient type must be "linear" or "radial"');
    }
    settings.gradientType = values['gradient-type'];
  }

  if (values['gradient-angle'] !== undefined) {
    const n = parseInt(values['gradient-angle']);
    if (isNaN(n) || n < 0 || n > 360) fail('Gradient angle must be 0-360');
    settings.gradientAngle = n;
  }

  if (values.scale !== undefined) {
    const n = parseInt(values.scale);
    if (n !== 1 && n !== 2 && n !== 3) fail('Scale must be 1, 2, or 3');
    settings.exportScale = n as 1 | 2 | 3;
  }

  if (values.width !== undefined) {
    const n = parseInt(values.width);
    if (isNaN(n) || n < 400 || n > 4000) fail('Width must be 400-4000');
    settings.sizeMode = 'fixed';
    settings.fixedWidth = n;
  }

  // Output path
  const name = basename(absPath, extname(absPath));
  const outputPath = values.output
    ? resolve(values.output)
    : resolve(dirname(absPath), `${name}-framed.png`);

  // Render
  console.log(`  Framing ${basename(absPath)}...`);
  const buffer = await renderFramedImage(absPath, settings);
  await writeFile(outputPath, buffer);
  console.log(`  Done → ${outputPath}`);
}

main().catch((err: Error) => {
  fail(err.message);
});
