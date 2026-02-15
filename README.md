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

## CLI

Frame screenshots directly from the terminal — no browser or server needed.

### Install

```bash
cd mcp-server
npm install
npm run build
npm link
```

### Usage

```bash
framo screenshot.png                              # Default Sunset gradient
framo screenshot.png -p Ocean --padding 80         # Ocean preset, more padding
framo screenshot.png --colors "#ff0000,#00ff00"    # Custom gradient colors
framo screenshot.png -o output.png --scale 2       # Custom output, 2x resolution
framo screenshot.png --glow --noise --radius 30    # All the effects
```

### Options

| Flag | Description | Default |
|---|---|---|
| `-o, --output <path>` | Output file path | `<name>-framed.png` |
| `-p, --preset <name>` | Gradient preset | `Sunset` |
| `--padding <px>` | Padding in pixels (0-200) | `64` |
| `--radius <px>` | Border radius (0-60) | `20` |
| `--no-shadow` | Disable drop shadow | — |
| `--shadow-intensity <n>` | Shadow intensity (0-1) | `0.3` |
| `--noise` | Enable noise texture | — |
| `--noise-opacity <n>` | Noise opacity (0-1) | `0.05` |
| `--glow` | Enable glow effect | — |
| `--gradient-type <type>` | `linear` or `radial` | `linear` |
| `--gradient-angle <deg>` | Gradient angle (0-360) | `135` |
| `--colors <hex,hex,...>` | Custom gradient colors | — |
| `--scale <n>` | Export scale: 1, 2, or 3 | `1` |
| `--width <px>` | Fixed width mode (400-4000) | — |
| `--list-presets` | List available presets | — |

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
