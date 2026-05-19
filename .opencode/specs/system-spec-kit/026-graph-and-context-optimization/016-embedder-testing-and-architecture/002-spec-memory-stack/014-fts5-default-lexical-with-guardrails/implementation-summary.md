---
title: "Implementation Summary: FTS5 Default Lexical With Guardrails"
description: "Implementation summary for flipping the default lexical BM25 provider to SQLite FTS5 with guardrails."
trigger_phrases:
  - "fts5 lexical default implementation summary"
  - "speckit bm25 engine commit handoff"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed FTS5 lexical default implementation and verification"
    next_safe_action: "Stage source-only handoff paths if committing"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/lexical-normalizer.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/lexical-overlap-quality-gate.vitest.ts"
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails` |
| **Updated** | 2026-05-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:what-built -->
## What Was Built

Implemented packet-013 Option B with guardrails:

- Extracted `lexical-normalizer.ts` as the shared home for synonyms, stop words, lightweight stemming, BM25 query tokens, and FTS5-safe query expansion.
- Kept `bm25-index.ts` and its legacy exports, while adding `SPECKIT_BM25_ENGINE` policy helpers.
- Switched startup warmup to `shouldWarmInMemoryBm25(database)`.
- Preserved `bm25Search()` compatibility by tagging FTS5 results as `bm25` when `auto` or `sqlite` selects FTS5.
- Added the 30-query golden fixture and overlap@5 Vitest quality gate.
- Updated `bm25-index.vitest.ts` and `hybrid-search.vitest.ts` so warm singleton assertions run under `legacy-inmemory`.
- Added lexical engine status to `memory_health` full reports.
- Documented `SPECKIT_BM25_ENGINE` in the environment reference and architecture docs.

### Updated Existing Tests

| Test File | Update |
|-----------|--------|
| `tests/bm25-index.vitest.ts` | Forces `SPECKIT_BM25_ENGINE=legacy-inmemory` so tokenizer, stemmer, singleton, warmup, and re-index assertions remain about the legacy JS engine. |
| `tests/hybrid-search.vitest.ts` | Forces `SPECKIT_BM25_ENGINE=legacy-inmemory` for existing BM25 availability, scoped lookup, combined lexical, and channel-disable assertions. |
<!-- /ANCHOR:what-built -->

---
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed on `main`, edited only frozen source/doc paths, and avoided `dist/`. The new default is controlled by an env flag rather than deleting legacy code, which gives operators a one-line rollback path.
<!-- /ANCHOR:how-delivered -->

---
<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| FTS5 results populate the BM25 lane in `auto`/`sqlite` | Preserves `bm25Search()` callers and the keyword lane shape without warming the JS singleton. |
| `sqlite` throws when `memory_fts` is missing | Forced mode should fail clearly instead of silently changing to legacy warmup. |
| Stemmer and identifier golden classes are observable but not gated | Packet 013 predicted divergence there; failures should drive Option C, not block the initial safe default. |
| `packed-inmemory` is a warning fallback | The packed format belongs to a future packet and is not implemented here. |
<!-- /ANCHOR:decisions -->

---
<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Spec validation | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails --strict` |
| Typecheck | PASS: `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` |
| `lexical-overlap-quality-gate` | PASS: `npx vitest --run lexical-overlap-quality-gate` |
| `bm25-index` Vitest | PASS: `npx vitest --run bm25-index` |
| `hybrid-search` Vitest | PASS: `npx vitest --run hybrid-search` |
| `sqlite-fts` Vitest | PASS: `npx vitest --run sqlite-fts` |
| Build | PASS: `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` |
| Warmup integration probe | PASS: `auto_with_fts_rebuild_calls=0`; `legacy_rebuild_calls=1` |
<!-- /ANCHOR:verification -->

---
<!-- ANCHOR:limitations -->
## Known Limitations

The FTS5 default intentionally does not reproduce every JS tokenizer/stemmer quirk. The golden suite keeps those divergences visible, and `legacy-inmemory` remains available for rollback or future targeted routing.

## Commit Handoff

Source-only staging list, excluding `dist/`:

```bash
git add .opencode/skills/system-spec-kit/mcp_server/lib/search/lexical-normalizer.ts
git add .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts
git add .opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts
git add .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
git add .opencode/skills/system-spec-kit/mcp_server/context-server.ts
git add .opencode/skills/system-spec-kit/mcp_server/tests/fixtures/golden-queries.json
git add .opencode/skills/system-spec-kit/mcp_server/tests/lexical-overlap-quality-gate.vitest.ts
git add .opencode/skills/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts
git add .opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts
git add .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
git add .opencode/skills/system-spec-kit/references/memory/embedder_architecture.md
git add .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails/spec.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails/plan.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails/tasks.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails/checklist.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails/implementation-summary.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails/description.json
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails/graph-metadata.json
```

Commit subject:

```text
feat(016/002/014): flip lexical default to SQLite FTS5 with golden-suite guardrails
```
<!-- /ANCHOR:limitations -->
