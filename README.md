# Framo

A simple tool to frame your screenshots with beautiful gradient backgrounds. Everything runs in your browser - your images never leave your device.

## Features

- Drag and drop image upload
- Gradient background presets
- Adjustable padding and corner radius
- Fixed or auto-sizing modes
- Export to PNG or copy to clipboard

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:4729](http://localhost:4729) in your browser.

## MCP Server

Framo includes an MCP (Model Context Protocol) server so AI agents can programmatically frame screenshots.

### Setup

```bash
cd mcp-server
npm install
npm run build
```

### Claude Code Configuration

Add to your `.claude/settings.json`:

```json
{
  "mcpServers": {
    "framo": {
      "command": "node",
      "args": ["/path/to/Framo/mcp-server/dist/index.js"]
    }
  }
}
```

### Tool: `frame-screenshot`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `imagePath` | string | *(required)* | Absolute path to the input screenshot |
| `outputPath` | string | `<imagePath>-framed.png` | Output path for the framed image |
| `preset` | string | `"Sunset"` | Gradient preset name (e.g. Sunset, Ocean, Noir) |
| `padding` | number | `64` | Padding around the image in pixels |
| `borderRadius` | number | `20` | Corner radius |
| `exportScale` | 1 \| 2 \| 3 | `2` | Export scale multiplier |
| `shadowEnabled` | boolean | `true` | Enable drop shadow |
| `shadowIntensity` | number | `0.3` | Shadow intensity (0–1) |
| `noiseEnabled` | boolean | `false` | Enable noise texture |
| `glowEnabled` | boolean | `false` | Enable glow effect |

## Tech Stack

- Next.js 16
- React 18
- TypeScript
- Tailwind CSS
