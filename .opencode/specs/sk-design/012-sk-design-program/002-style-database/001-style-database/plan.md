---
title: "Implementation Plan: sk-design style database"
description: "Build plan for the SQLite+FTS5+vector style database per the 001 recommendation."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/001-style-database"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author phase-003 plan"
    next_safe_action: "Dispatch SOL implementer in an isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: sk-design style database

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Node ESM (`.mjs`) under `.opencode/skills/sk-design/styles/`, using Node's built-in `node:sqlite` `DatabaseSync` (already used in the 001 pressure tests) + FTS5. Mirrors system-speckit's `mcp-server/lib/search` (schema, hybrid, RRF) and `lib/embedders` patterns without copying its domain tables. The authoritative design is `../001-research-style-database/research/research.md`.

### Overview

Build the schema, indexer, retrieval, and vector queue as new `_db/` modules; add a `legacy|shadow|persistent` adapter into `_engine`; prove with a node --test suite; keep flat files authoritative.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- 001 research recommendation available; `styles/_engine` and the style corpus readable; system-speckit search/embedder references readable.

### Definition of Done

- P0 requirements met; shadow parity holds; `node --test` green; persistent query beats the 6,246.5 ms baseline; `validate.sh --strict` = 0 errors.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Published-generation SQLite (normalized state + FTS5 + relationships), rebuildable vector projection, incremental hash-authoritative indexer, eligibility-first weighted-RRF retrieval, adapter-gated cutover.

### Key Components

- `_db/schema.mjs`, `_db/indexer.mjs`, `_db/retrieval.mjs`, `_db/vectors.mjs` (new).
- `_engine/*` adapter (`legacy|shadow|persistent`).
- Reference: system-speckit `mcp-server/lib/search/{vector-index-schema,hybrid-search}.ts`, `lib/storage/incremental-index.ts`, `shared/algorithms/rrf-fusion.ts`.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Schema + indexer
- [ ] Author `_db/schema.mjs` (tables, FTS5 triggers, generations, indexes).
- [ ] Author `_db/indexer.mjs` (DISCOVER→…→PUBLISH, hash freshness, tombstones).

### Phase 2: Retrieval + vectors + adapter
- [ ] Author `_db/retrieval.mjs` (eligibility-first RRF, generation snapshot, degradation).
- [ ] Author `_db/vectors.mjs` (non-blocking queue, embedding cache) + `_engine` `legacy|shadow|persistent` adapter.

### Phase 3: Verify
- [ ] node --test suite (schema/indexer/retrieval/parity) green; shadow parity + SLO measured; `validate.sh --strict`.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `node --test` over `_db/__tests__/`: schema pressure (duplicate-slug, tombstone, cascades, FTS triggers, partial index), indexer crash-safety (simulated mid-commit), RRF/cursor determinism, degradation fallback, shadow-vs-legacy parity, and a persistent-vs-baseline timing check.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Flat style library + `styles/_engine` (packet 011); 001 research design; system-speckit search/storage/embedder patterns; Node `node:sqlite`.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- New `_db/` code is additive; the adapter defaults to `legacy`. Rollback = leave the adapter in `legacy` mode (flat-file engine unchanged) or delete `_db/`. No generation is published to readers until explicit cutover.

<!-- /ANCHOR:rollback -->
