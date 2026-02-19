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

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT INVENTORY](#2--current-inventory)
- [3. MEMORY SAVE RULE COMMANDS](#3--memory-save-rule-commands)
- [4. MAINTENANCE COMMANDS](#4--maintenance-commands)
- [5. WORKFLOW ALIGNMENT](#5--workflow-alignment)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `memory/` directory contains the CLI entrypoints for the Spec Kit memory pipeline.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY


- `generate-context.ts` - generate memory output from spec folder or JSON input
- `rank-memories.ts` - rank memory candidates by scoring rules
- `cleanup-orphaned-vectors.ts` - remove stale vector rows not linked to active memories
- `validate-memory-quality.ts` - validates memory entry quality against scoring thresholds

Runtime files are compiled into `../dist/memory/`.


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:memory-save-rule-commands -->
## 3. MEMORY SAVE RULE COMMANDS


Direct spec-folder mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/003-system-spec-kit/130-memory-overhaul-and-agent-upgrade-release
```

JSON input mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/003-system-spec-kit/130-memory-overhaul-and-agent-upgrade-release
```


<!-- /ANCHOR:memory-save-rule-commands -->
<!-- ANCHOR:maintenance-commands -->
## 4. MAINTENANCE COMMANDS


```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js /tmp/memories.json
node .opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js
```


<!-- /ANCHOR:maintenance-commands -->
<!-- ANCHOR:workflow-alignment -->
## 5. WORKFLOW ALIGNMENT


- Uses the modular core/extractors/loaders/renderers/lib pipeline.
- Supports subfolder-aware spec path handling through core utilities.
- Produces ANCHOR-structured markdown expected by downstream validation and indexing.
<!-- /ANCHOR:workflow-alignment -->
