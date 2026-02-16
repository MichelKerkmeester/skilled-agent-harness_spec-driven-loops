---
title: "Memory Scripts"
description: "TypeScript CLIs for memory context generation, ranking, and vector cleanup."
trigger_phrases:
  - "memory scripts"
  - "generate context"
  - "rank memories"
  - "cleanup orphaned vectors"
importance_tier: "normal"
---

# Memory Scripts

The `memory/` directory contains the CLI entrypoints for the Spec Kit memory pipeline.

## Current Inventory

- `generate-context.ts` - generate memory output from spec folder or JSON input
- `rank-memories.ts` - rank memory candidates by scoring rules
- `cleanup-orphaned-vectors.ts` - remove stale vector rows not linked to active memories

Runtime files are compiled into `../dist/memory/`.

## Memory Save Rule Commands

Direct spec-folder mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/003-system-spec-kit/130-memory-overhaul-and-agent-upgrade-release
```

JSON input mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/003-system-spec-kit/130-memory-overhaul-and-agent-upgrade-release
```

## Maintenance Commands

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js /tmp/memories.json
node .opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js
```

## Workflow Alignment

- Uses the modular core/extractors/loaders/renderers/lib pipeline.
- Supports subfolder-aware spec path handling through core utilities.
- Produces ANCHOR-structured markdown expected by downstream validation and indexing.
