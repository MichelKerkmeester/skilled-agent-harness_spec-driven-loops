---
title: "FTS5 Default Lexical With Guardrails"
description: "Flipped the default lexical BM25 provider to SQLite FTS5 by extracting a shared normalizer, adding a 30-query golden fixture with an overlap quality gate. All six guardrails shipped atomically so the default switch landed with rollback capability."
trigger_phrases:
  - "fts5 lexical default guardrails"
  - "speckit bm25 engine sqlite"
  - "golden query overlap gate"
  - "lexical normalizer fts5"
  - "bm25 engine flip fts5"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

The spec-memory stack warmed a resident JavaScript in-memory BM25 index by default, adding startup overhead and diverging from the SQLite FTS5 index that already existed. Packet 013 investigated Option B and found that RRF fusion needs a lexical rank list, not specifically the JS engine, so FTS5 could safely feed the keyword lane.

This packet implemented Option B atomically across six guardrails: a shared lexical normalizer, a 30-query golden fixture, an overlap quality gate, explicit identifier and stemmer fixture rows, updated tests pinning legacy mode for singleton assertions. An env flag with gated warmup completes the set. The `auto` mode now skips JS BM25 warmup when `memory_fts` exists. Operators can restore the old behavior with one env var.

### Added

- `lib/search/lexical-normalizer.ts` (NEW) as the single source of truth for synonyms, stop-word lists, lightweight stemming. FTS5-safe query expansion is also centralized here.
- `tests/fixtures/golden-queries.json` (NEW) with 30 queries across 6 classes. 20-plus fixture documents cover prose, synonym, phrase, stemmer, tokenization-edge and RRF-stressing scenarios.
- `tests/lexical-overlap-quality-gate.vitest.ts` (NEW) asserting overlap@5 at 0.8 or above for prose, synonym, RRF and the title/trigger/file-path gate group
- Lexical engine status field in `memory_health` full reports via `memory-crud-health.ts`
- `SPECKIT_BM25_ENGINE` env flag documented in `ENV_REFERENCE.md` covering `auto`, `sqlite`, `packed-inmemory` and `legacy-inmemory` modes

### Changed

- `bm25-index.ts` updated to import from `lexical-normalizer.ts`, re-export the legacy public API for backward compatibility. `SPECKIT_BM25_ENGINE` policy helpers are also added.
- `sqlite-fts.ts` updated to import the shared normalizer instead of defining its own normalization inline
- `hybrid-search.ts` updated so the BM25 lane uses FTS5 results under `auto` and `sqlite` engine modes
- `context-server.ts` updated to gate startup BM25 warmup via `shouldWarmInMemoryBm25(database)`
- `tests/bm25-index.vitest.ts` updated to force `SPECKIT_BM25_ENGINE=legacy-inmemory` so warm singleton assertions remain about the legacy JS engine
- `tests/hybrid-search.vitest.ts` updated to force `SPECKIT_BM25_ENGINE=legacy-inmemory` for BM25 availability, scoped lookup and channel-disable test coverage
- `references/memory/embedder_architecture.md` updated to document rollback behavior and FTS5 default rationale

### Fixed

- Default startup no longer warms the JS in-memory BM25 index when `memory_fts` exists, removing redundant resident-index overhead
- `sqlite` forced mode now throws a clear error when `memory_fts` is absent rather than silently falling back to JS BM25 warmup

### Verification

| Check | Result |
|-------|--------|
| Spec validation | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails --strict` |
| Typecheck | PASS: `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` |
| `lexical-overlap-quality-gate` Vitest | PASS: `npx vitest --run lexical-overlap-quality-gate` |
| `bm25-index` Vitest | PASS: `npx vitest --run bm25-index` |
| `hybrid-search` Vitest | PASS: `npx vitest --run hybrid-search` |
| `sqlite-fts` Vitest | PASS: `npx vitest --run sqlite-fts` |
| Build | PASS: `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` |
| Warmup integration probe | PASS: `auto_with_fts_rebuild_calls=0`, `legacy_rebuild_calls=1` |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/search/lexical-normalizer.ts` | Added (NEW) | Shared synonym expansion, stop words, lightweight stemming. FTS5-safe query token normalization centralized here. |
| `mcp_server/tests/fixtures/golden-queries.json` | Added (NEW) | 30-query golden fixture with 20-plus fixture documents across 6 query classes |
| `mcp_server/tests/lexical-overlap-quality-gate.vitest.ts` | Added (NEW) | Quality gate asserting overlap@5 at 0.8 or above for prose, synonym, RRF and the title/trigger/file-path group |
| `mcp_server/lib/search/bm25-index.ts` | Modified | Imports normalizer, adds engine policy helpers, re-exports legacy API |
| `mcp_server/lib/search/sqlite-fts.ts` | Modified | Imports shared normalizer replacing inline normalization |
| `mcp_server/lib/search/hybrid-search.ts` | Modified | BM25 lane now uses FTS5 results under `auto` and `sqlite` modes |
| `mcp_server/context-server.ts` | Modified | Startup warmup gated by `shouldWarmInMemoryBm25(database)` |
| `mcp_server/tests/bm25-index.vitest.ts` | Modified | Forces `legacy-inmemory` mode to preserve singleton assertion semantics |
| `mcp_server/tests/hybrid-search.vitest.ts` | Modified | Forces `legacy-inmemory` mode for BM25 availability and channel assertions |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | Adds lexical engine and warm status to full health reports |
| `mcp_server/ENV_REFERENCE.md` | Modified | Documents `SPECKIT_BM25_ENGINE` flag, all modes and rollback behavior |
| `references/memory/embedder_architecture.md` | Modified | Describes FTS5 default rationale and rollback path |

### Follow-Ups

- Evaluate whether a future packet should enable FTS5 `tokenchars` or Porter stemming if golden-query clustering shows failures concentrated in identifier or suffix-heavy classes.
- Decide whether `packed-inmemory` remains in the same `SPECKIT_BM25_ENGINE` enum after its future implementation or moves behind a separate experimental flag.
