---
title: "Hooks"
description: "Memory-surface helper functions for context hint extraction and optional auto-surfacing."
trigger_phrases:
  - "hooks"
  - "memory surfacing"
  - "context injection"
importance_tier: "normal"
---

# Hooks

## Overview

`hooks/` currently provides one helper module, `memory-surface.ts`, exported via `index.ts`.

- It is a utility layer for memory-aware context surfacing.
- It is not a standalone MCP hook registration system.

## Implemented State

Main exports (camelCase):
- `extractContextHint(args)`
- `getConstitutionalMemories()`
- `clearConstitutionalCache()`
- `autoSurfaceMemories(contextHint)`
- `isMemoryAwareTool(toolName)`

Data shape:
- auto-surface output includes `constitutional`, `triggered`, `surfaced_at`, and `latencyMs`.
- `MEMORY_AWARE_TOOLS` currently includes `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.

## Hardening Notes

- Constitutional cache uses a short TTL (60s) to reduce DB churn.
- Trigger matching uses fast phrase matching and returns empty/null safely on failures.
- Hook output remains compatible with current formatter and tool response contracts.

## Related

- `../handlers/memory-triggers.ts`
- `../lib/parsing/trigger-matcher.ts`
- `../core/README.md`
