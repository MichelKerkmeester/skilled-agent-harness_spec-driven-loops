---
title: "Handlers"
description: "MCP tool handlers for context, search, CRUD, indexing, checkpoints, learning, and causal graph operations."
trigger_phrases:
  - "MCP handlers"
  - "memory handlers"
  - "request handlers"
importance_tier: "normal"
---

# Handlers

## Overview

`handlers/` is the business-logic layer behind the MCP tool surface.

Current modules:
- `memory-context.ts`
- `memory-search.ts`
- `memory-triggers.ts`
- `memory-save.ts`
- `memory-crud.ts`
- `memory-index.ts`
- `checkpoints.ts`
- `session-learning.ts`
- `causal-graph.ts`
- `types.ts`
- `index.ts`

## Implemented State

- Handlers export camelCase primary APIs and snake_case compatibility aliases.
- Tool domains cover L1-L7 behavior through the dispatch layer in `tools/`.
- Core persistence uses `memory_index` (not `memories`) with FTS/vector/checkpoint support.
- Spec 126 alignment:
  - `memory-index` supports `includeSpecDocs` and indexes spec docs plus memory files.
  - `memory-save` preserves `document_type` and `spec_level` across create/update/reinforce flows.
  - scan flow can build spec-document causal chains after indexing.

## Hardening Notes

- Index mtime updates occur only after successful indexing (retry-safe behavior).
- Spec-folder filtering in scan logic is boundary-safe (no prefix bleed).
- File descriptor reads for spec-level detection are `finally`-closed.
- Deferred embedding paths preserve indexability via BM25/FTS and retry manager handoff.

## Related

- `../tools/README.md`
- `../core/README.md`
- `../database/README.md`
- `../../references/memory/memory_system.md`
