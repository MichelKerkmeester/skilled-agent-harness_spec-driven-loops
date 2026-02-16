---
title: "Data Loaders"
description: "Data loader modules that normalize input from JSON, OpenCode capture, or simulation fallback."
trigger_phrases:
  - "data loaders"
  - "load collected data"
  - "context loading"
importance_tier: "normal"
---

# Data Loaders

The `loaders/` directory provides the ingestion layer for memory generation.

## Current Inventory

- `data-loader.ts` - source loading, path checks, normalization, fallback handling
- `index.ts` - public exports for loader API

## Source Priority

`data-loader.ts` loads in this order:
1. Explicit JSON data file
2. OpenCode capture input
3. Simulation fallback

## Security and Path Handling

- Path checks restrict data file access to expected safe base locations.
- macOS `/tmp` and `/private/tmp` handling is normalized.
- Invalid or unsafe paths fail fast instead of silently falling through.

## Quick Usage

```bash
node -e "const l=require('./.opencode/skill/system-spec-kit/scripts/dist/loaders'); console.log(Object.keys(l))"
```
