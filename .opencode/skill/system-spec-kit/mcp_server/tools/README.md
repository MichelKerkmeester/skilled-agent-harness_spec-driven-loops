---
title: "Tools: Dispatch Layer"
description: "Dispatcher modules that route MCP tool names to typed handler calls."
trigger_phrases:
  - "tool dispatch"
  - "MCP tools"
  - "dispatch layer"
importance_tier: "normal"
---

# Tools: Dispatch Layer

## Overview

`tools/` maps MCP tool names to handler functions.

- Central router: `dispatchTool()` in `index.ts`.
- Domain dispatchers: `context-tools.ts`, `memory-tools.ts`, `causal-tools.ts`, `checkpoint-tools.ts`, `lifecycle-tools.ts`.
- Shared typing and argument parsing: `types.ts`.

## Implemented State

- Current footprint: 22 tools across 5 dispatch modules.
- Routing model: first dispatcher with `TOOL_NAMES.has(name)` handles the call.
- `parseArgs<T>()` is the single protocol-boundary cast point.
- Tool args include recent fields such as:
  - `includeSpecDocs` for `memory_index_scan` (Spec 126)
  - `asyncEmbedding` for `memory_save`
  - cognitive/intent-related flags on search/context flows

## Hardening Notes

- Dispatch remains modular so new tools can be added without monolithic switch growth.
- Typed arg interfaces in `types.ts` reduce drift between schemas and handlers.
- L6/L7 lifecycle and causal tooling is now part of the default dispatcher chain.

## Related

- `../handlers/README.md`
- `../definitions/README.md`
- `../../shared/types.ts`
