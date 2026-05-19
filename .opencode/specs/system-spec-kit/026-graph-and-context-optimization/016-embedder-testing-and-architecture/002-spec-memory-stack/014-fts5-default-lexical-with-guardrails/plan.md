---
title: "Implementation Plan: FTS5 Default Lexical With Guardrails"
description: "Plan for implementing Option B from packet 013 with shared normalization, engine routing, golden-query tests, and documentation."
trigger_phrases:
  - "fts5 default lexical plan"
  - "speckit bm25 engine plan"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned FTS5 lexical default implementation"
    next_safe_action: "Complete verification gates"
    blockers: []
    key_files:
      - "plan.md"
---
# Implementation Plan: FTS5 Default Lexical With Guardrails

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---
<!-- ANCHOR:summary -->
## 1. SUMMARY

Implement the packet-013 Option B recommendation as a scoped source change: keep JS BM25 available, move shared lexical behavior into one normalizer, make FTS5 the default lexical rank provider when available, and add a deterministic golden-query overlap gate.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec folder supplied by user.
- [x] Frozen file list supplied by user.
- [x] Predecessor research read.
- [x] Scope excludes deletes, RRF weight changes, packed storage, and `dist/`.

### Definition of Done
- [ ] Strict spec validation passes.
- [ ] MCP server typecheck passes.
- [ ] Targeted Vitest suites pass.
- [ ] MCP server build passes.
- [ ] Integration probe verifies warmup routing.
<!-- /ANCHOR:quality-gates -->

---
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The change separates lexical preprocessing from the in-memory index. `lexical-normalizer.ts` owns synonyms, stop words, stemming, FTS-safe query construction, and BM25 query tokens. `bm25-index.ts` keeps the legacy index and re-exports the normalizer for existing callers.

The engine resolver lives beside the BM25 singleton because startup warmup, hybrid search, health reporting, and tests all need the same policy. `hybrid-search.ts` preserves the `bm25Search()` API: in `auto`/`sqlite` with FTS5 available, the BM25 lane is populated from FTS5 results tagged as `bm25`.
<!-- /ANCHOR:architecture -->

---
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read packet 013 recommendation, golden queries, fixture assessment, and RRF analysis.
- Read the active BM25, FTS5, hybrid-search, context-server, and target test files.
- Confirm the dirty worktree and ignore unrelated changes.

### Phase 2: Implementation
- Extract the normalizer and re-export compatibility APIs.
- Add `SPECKIT_BM25_ENGINE` policy and startup warmup gate.
- Route `bm25Search()` to FTS5 under `auto`/`sqlite`.
- Add golden fixture and overlap quality gate.
- Pin singleton tests to `legacy-inmemory`.
- Extend health and docs.

### Phase 3: Verification
- Run strict spec validation.
- Run typecheck, targeted tests, build, and integration probe.
- Update checklist and implementation summary with evidence.
<!-- /ANCHOR:phases -->

---
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Gate | Command |
|------|---------|
| Spec validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <014> --strict` |
| Typecheck | `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` |
| Golden gate | `npx vitest --run lexical-overlap-quality-gate` |
| BM25 tests | `npx vitest --run bm25-index` |
| Hybrid tests | `npx vitest --run hybrid-search` |
| FTS tests | `npx vitest --run sqlite-fts` |
| Build | `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` |
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Notes |
|------------|--------|-------|
| Packet 013 | Available | Source of Option B guardrails and 30 queries. |
| SQLite FTS5 | Existing | Required for default `auto` memory savings. |
| Vitest | Existing | Used for deterministic fixture gate. |
| Better SQLite3 | Existing | Used by the fixture test DB. |
<!-- /ANCHOR:dependencies -->

---
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Set `SPECKIT_BM25_ENGINE=legacy-inmemory` to restore the old warm JS singleton without reverting code. If the golden gate shows clustered identifier/stemmer regressions, revisit packet-013 Option C with targeted routing rather than deleting the FTS5 default.
<!-- /ANCHOR:rollback -->

---
<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
013 research -> shared normalizer -> engine routing -> golden gate -> docs/verification
```
<!-- /ANCHOR:phase-deps -->

---
<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Effort |
|-------|------------|--------|
| Source routing | Medium | 2-3 hours |
| Fixture gate | Medium | 1-2 hours |
| Docs and validation | Low-Medium | 1 hour |
<!-- /ANCHOR:effort -->

---
<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

1. Export `SPECKIT_BM25_ENGINE=legacy-inmemory`.
2. Restart the MCP server.
3. Re-run `bm25-index`, `hybrid-search`, and `sqlite-fts` tests.
4. Open a follow-up packet only if measured golden failures justify Option C.
<!-- /ANCHOR:enhanced-rollback -->
