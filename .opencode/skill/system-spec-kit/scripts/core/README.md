---
title: "Core System Scripts"
description: "Core TypeScript workflow modules for context generation, scoring, writing, and indexing."
trigger_phrases:
  - "core workflow"
  - "memory workflow"
  - "subfolder resolution"
importance_tier: "normal"
---

# Core System Scripts

The `core/` directory contains orchestration modules used by `dist/memory/generate-context.js`.

## Current Inventory

- `workflow.ts` - main orchestration flow
- `config.ts` - config loading and path/constants wiring
- `subfolder-utils.ts` - spec folder and child-folder resolution helpers
- `topic-extractor.ts` - derive topic signals from folder/content inputs
- `quality-scorer.ts` - quality scoring support for generated artifacts
- `file-writer.ts` - write/validation helpers for generated files
- `memory-indexer.ts` - indexing hooks and metadata preparation
- `index.ts` - barrel exports

## Runtime Model

- Source of truth: `core/*.ts`
- Runtime: `dist/core/*.js`
- Build command:

```bash
cd .opencode/skill/system-spec-kit/scripts && npm run build
```

## Workflow Notes

- `workflow.ts` composes loaders, extractors, renderers, and lib utilities.
- `subfolder-utils.ts` supports subfolder-aware operations used by memory save flows.
- `file-writer.ts` and `memory-indexer.ts` keep generated context output consistent with indexing expectations.

## Quick Verification

```bash
node -e "const core=require('./.opencode/skill/system-spec-kit/scripts/dist/core'); console.log(Object.keys(core))"
```
