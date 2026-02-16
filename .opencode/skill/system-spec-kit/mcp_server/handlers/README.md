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

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📌 IMPLEMENTED STATE](#2--implemented-state)
- [3. 📝 HARDENING NOTES](#3--hardening-notes)
- [4. 📚 RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. 📖 OVERVIEW

This section provides an overview of the Handlers directory.

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

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. 📌 IMPLEMENTED STATE


- Handlers export camelCase primary APIs and snake_case compatibility aliases.
- Tool domains cover L1-L7 behavior through the dispatch layer in `tools/`.
- Core persistence uses `memory_index` (not `memories`) with FTS/vector/checkpoint support.
- Spec 126 alignment:
  - `memory-index` supports `includeSpecDocs` and indexes spec docs plus memory files.
  - `memory-save` preserves `document_type` and `spec_level` across create/update/reinforce flows.
  - scan flow can build spec-document causal chains after indexing.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. 📝 HARDENING NOTES


- Index mtime updates occur only after successful indexing (retry-safe behavior).
- Spec-folder filtering in scan logic is boundary-safe (no prefix bleed).
- File descriptor reads for spec-level detection are `finally`-closed.
- Deferred embedding paths preserve indexability via BM25/FTS and retry manager handoff.


<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:related -->
## 4. 📚 RELATED


- `../tools/README.md`
- `../core/README.md`
- `../database/README.md`
- `../../references/memory/memory_system.md`
<!-- /ANCHOR:related -->
