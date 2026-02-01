#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { writeFile } from 'node:fs/promises';
import { resolve, dirname, basename, extname, join } from 'node:path';
import { renderFramedImage } from './renderer.js';
import { DEFAULT_SETTINGS, GRADIENT_PRESETS, type FrameSettings } from './types.js';

const server = new McpServer({
  name: 'framo',
  version: '1.0.0',
});

const presetNames = GRADIENT_PRESETS.map((p) => p.name);

server.registerTool(
  'frame-screenshot',
  {
    title: 'Frame Screenshot',
    description:
      'Add a gradient frame/background to a screenshot image. Returns the path to the framed output image.',
    inputSchema: {
      imagePath: z.string().describe('Absolute path to the input screenshot image'),
      outputPath: z
        .string()
        .optional()
        .describe('Output path for the framed image. Defaults to <imagePath>-framed.png'),
      preset: z
        .string()
        .optional()
        .describe(
          `Gradient preset name. Available: ${presetNames.join(', ')}`
        ),
      padding: z.number().optional().describe('Padding around the image in pixels (default: 64)'),
      borderRadius: z
        .number()
        .optional()
        .describe('Corner radius for the image and background (default: 20)'),
      exportScale: z
        .union([z.literal(1), z.literal(2), z.literal(3)])
        .optional()
        .describe('Export scale multiplier: 1, 2, or 3 (default: 2)'),
      shadowEnabled: z
        .boolean()
        .optional()
        .describe('Enable drop shadow behind the image (default: true)'),
      shadowIntensity: z
        .number()
        .min(0)
        .max(1)
        .optional()
        .describe('Shadow intensity from 0 to 1 (default: 0.3)'),
      noiseEnabled: z
        .boolean()
        .optional()
        .describe('Enable noise texture on the gradient background (default: false)'),
      glowEnabled: z
        .boolean()
        .optional()
        .describe('Enable glow effect behind the image (default: false)'),
    },
  },
  async (params) => {
    const imagePath = resolve(params.imagePath);

    // Determine output path
    const ext = extname(imagePath);
    const base = basename(imagePath, ext);
    const dir = dirname(imagePath);
    const outputPath = params.outputPath
      ? resolve(params.outputPath)
      : join(dir, `${base}-framed.png`);

    // Build settings from defaults + params
    const settings: FrameSettings = {
      ...DEFAULT_SETTINGS,
      exportScale: params.exportScale ?? 2,
    };

    if (params.padding !== undefined) settings.padding = params.padding;
    if (params.borderRadius !== undefined) settings.borderRadius = params.borderRadius;
    if (params.shadowEnabled !== undefined) settings.shadowEnabled = params.shadowEnabled;
    if (params.shadowIntensity !== undefined) settings.shadowIntensity = params.shadowIntensity;
    if (params.noiseEnabled !== undefined) settings.noiseEnabled = params.noiseEnabled;
    if (params.glowEnabled !== undefined) settings.glowEnabled = params.glowEnabled;

    // Apply preset if specified
    if (params.preset) {
      const preset = GRADIENT_PRESETS.find(
        (p) => p.name.toLowerCase() === params.preset!.toLowerCase()
      );
      if (!preset) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Unknown preset "${params.preset}". Available presets: ${presetNames.join(', ')}`,
            },
          ],
          isError: true,
        };
      }
      settings.gradientColors = preset.colors;
    }

    try {
      const buffer = await renderFramedImage(imagePath, settings);
      await writeFile(outputPath, buffer);

      return {
        content: [
          {
            type: 'text' as const,
            text: `Framed image saved to: ${outputPath}`,
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error framing image: ${message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
