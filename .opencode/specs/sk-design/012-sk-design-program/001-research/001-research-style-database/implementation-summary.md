---
title: "Implementation Summary: Deep research — style database architecture"
description: "Converged recommendation for the sk-design style database, and handoff to phase 003-style-database."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/001-research/001-research-style-database"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "deep-research-orchestrator"
    recent_action: "Promoted 7-iter SOL style-DB synthesis"
    next_safe_action: "Plan phase 003 from recommendation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/search/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-research-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "DB technology: SQLite + FTS5 + vector (not a graph engine)"
      - "Source of truth: flat style files stay authoritative; DB is a rebuildable, generation-stamped projection"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: Deep research — style database architecture

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 1 of 4 (research) |
| **Status** | Complete |
| **Executor** | GPT-5.6-SOL (high, fast) via cli-opencode — 7 iterations, `max-iterations` policy |
| **Artifact** | `research/research.md` (single-lineage synthesis, promoted) |
| **Completed** | 2026-07-19 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A converged, evidence-grounded architecture recommendation for turning the flat 1,290-style library into a real indexed database. **Recommendation: one published SQLite generation** containing normalized style state + FTS5 + indexed relationship edges, with **profile-addressed vectors as a rebuildable projection** — mirroring `system-spec-kit`'s sqlite+FTS5+vector *lifecycle* (not its domain tables) and explicitly **not** a dedicated graph engine.

### Files Created / Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Progressive synthesis answering Q1–Q5 (tech, schema, sync, retrieval, migration) |
| `research/lineages/sol/**` | Create | SOL lineage state, deltas, iterations (deep-research artifacts) |
| `implementation-summary.md` | Create | This recommendation + phase-003 handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A single-lineage `/deep:research` fan-out via `runtime/scripts/fanout-run.cjs`, executor `cli-opencode` model `openai/gpt-5.6-sol-fast --variant high` (the codex-self-invocation guard blocks `cli-codex` from this launch context; opencode is the framework's supported detached launcher for the same GPT-5.6-SOL model). Ran 7 iterations before a lineage stall closed the loop; the synthesis was already complete (all five research questions answered). Each iteration wrote hash-verified evidence with real in-repo benchmarks (a full-corpus query measured at 6,246.5 ms; in-memory `DatabaseSync` pressure tests; canonical aggregate-hash tests).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **SQLite + FTS5 + vector, narrow style schema.** Adopt system-speckit's lifecycle boundaries (versioned schema module, trigger-synchronized external-content FTS5, profile-addressed vector shard + content-addressed embedding cache, hash-verified incremental scans) but own a style-specific schema: UUID-first identity + surrogate rowid for FTS/vector joins; normalized artifacts/terms/token-axes/sections; derived-vs-authoritative separation.
- **No graph engine.** The deep-loop "graph DBs" are SQLite adjacency projections; graph-shaped relationships (styles' `designSystem.similar`, 5,812 labels across 1,290 styles) become a normalized, generation-bound relationship table, not a traversal service. A graph is future/optional only if a concrete variable-depth workload appears and indexed SQLite misses its SLO.
- **Generation-consistent + fail-closed.** DISCOVER→VERIFY→PARSE_VALIDATE→COMMIT→VECTOR_DRAIN→PUBLISH indexer; hash-authoritative freshness; immutable corpus-generation rows with atomic pointer switch; queries bind one snapshot; missing/invalid generation fails closed. Weighted RRF fusion over ranks (not raw BM25/cosine addition); channel-local degradation (hybrid → structured+FTS → structured+vector → structured-only).
- **Source of truth stays the flat files.** The DB is a rebuildable projection; corpus walking is legal only in explicit migration/rollback mode behind a `legacy|shadow|persistent` adapter over the current `runQuery`/`runHydrate`/CLI surface.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Citations vetted (finding = hypothesis):** every load-bearing path confirmed real on disk — `system-spec-kit/mcp-server/lib/search/vector-index-schema.ts`, `.../lib/storage/incremental-index.ts`, `sk-design/styles/_engine/{manifest,rank-fts,eligibility,hydrate,style-library}.mjs`, `styles/_retrieval-manifest.json`, `system-deep-loop/runtime/lib/council/council-graph-db.ts`. No hallucinated references.
- **All five research questions answered** with a single, non-menu recommendation.
- **Real benchmarks**, not assertions: 6,246.5 ms full-corpus query baseline; in-memory SQLite pressure tests for duplicate-slug rejection, tombstone consistency, cascading tables, FTS triggers, partial-index selection; RRF/filter/cursor determinism test.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The loop ran **7 iterations, not 10** (a stall closed it early); coverage is nonetheless complete — Q1–Q5 all resolved. If phase 003 surfaces a gap, a targeted follow-up research pass can extend it.
- **Single lineage** (SOL only) — no cross-model corroboration for this thread (unlike phase 002's SOL+GLM). The recommendation is heavily in-repo-grounded, which mitigates single-lineage risk.
- **Handoff to phase 003-style-database:** implement the published-SQLite-generation design above — schema + DISCOVER→…→PUBLISH indexer + eligibility-first RRF retrieval wired into `styles/_engine` behind the `legacy|shadow|persistent` adapter, keeping the flat files authoritative.
<!-- /ANCHOR:limitations -->
