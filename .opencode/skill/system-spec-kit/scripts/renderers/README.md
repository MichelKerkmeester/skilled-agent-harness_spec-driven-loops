---
title: "Template Renderers"
description: "Renderer modules for Mustache-like template population and output cleanup."
trigger_phrases:
  - "template renderer"
  - "populate template"
  - "spec template rendering"
importance_tier: "normal"
---

# Template Renderers

The `renderers/` directory turns extracted session data into markdown output for memory and spec-context documents.

## Current Inventory

- `template-renderer.ts` - variable substitution, sections, loops, and cleanup
- `index.ts` - public export surface for renderer functions

## Behavior

- Supports Mustache-like placeholders and section blocks.
- Handles conditional and inverted blocks.
- Cleans template-only artifacts before final write.
- Works with extractor output and core write/index steps.

## Runtime

Compile TypeScript and use runtime output from `dist/renderers/`.

```bash
cd .opencode/skill/system-spec-kit/scripts && npm run build
node -e "const r=require('./.opencode/skill/system-spec-kit/scripts/dist/renderers'); console.log(Object.keys(r))"
```
