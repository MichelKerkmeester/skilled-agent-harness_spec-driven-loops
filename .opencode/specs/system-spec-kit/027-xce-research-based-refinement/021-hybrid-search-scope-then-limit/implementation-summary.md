---
title: "Implementation Summary: Hybrid Search Scope Then Limit"
description: "In-memory BM25 now filters scope and deprecated rows before final limit truncation, preventing valid lexical matches from being hidden behind excluded candidates. Regression tests cover scoped, deprecated, and unfiltered behavior without touching live shards."
trigger_phrases:
  - "bm25 scope then limit summary"
  - "hybrid search under return fixed"
  - "bm25 deprecated filter regression"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/021-hybrid-search-scope-then-limit"
    last_updated_at: "2026-06-11T09:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed the BM25 scope-then-limit fix and documented verification evidence."
    next_safe_action: "Ready for review or commit after confirming final validation output remains green."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts"
      - ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/021-hybrid-search-scope-then-limit/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:e9f73bd68f282c3b4334c03c3e22758fd546d3b72af7dd0ca12d803376335058"
      session_id: "2026-06-11-hybrid-search-scope-then-limit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The FTS5 lane already scopes and excludes deprecated rows in SQL before limiting."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/027-xce-research-based-refinement/021-hybrid-search-scope-then-limit` |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

In-memory BM25 now returns valid lexical survivors up to the caller limit after applying spec-folder and deprecated-tier filters. A scoped query no longer loses recall just because excluded documents ranked above valid documents in the raw BM25 window.

### Scope-Then-Limit BM25 Candidate Collection

`bm25Search` now asks the BM25 index for the full corpus-bounded candidate set when metadata filters can remove hits. It then reuses the existing metadata filter and slices the eligible survivors to the requested limit, preserving BM25 ranking math and fail-closed scoped lookup behavior.

### Regression Coverage

The hybrid-search vitest file now covers three cases: higher-ranked out-of-scope hits, higher-ranked deprecated hits, and unscoped searches where metadata filtering removes nothing. The fixtures use the in-memory BM25 index plus mocked database metadata, so no live memory shard or host daemon participates.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modified | Fetch a corpus-bounded BM25 candidate set before metadata filtering and final limit slicing. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts` | Modified | Add real regression tests for scoped, deprecated, and unscoped BM25 behavior. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/021-hybrid-search-scope-then-limit/spec.md` | Modified | Replace scaffold specification content with the completed phase spec. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/021-hybrid-search-scope-then-limit/plan.md` | Modified | Replace scaffold plan content with the completed implementation plan. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/021-hybrid-search-scope-then-limit/tasks.md` | Modified | Replace scaffold tasks with completed task evidence. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/021-hybrid-search-scope-then-limit/implementation-summary.md` | Modified | Record implementation details and verification evidence. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix was delivered as a narrow TypeScript change plus focused in-memory regression tests. FTS5 was audited and left unchanged because its SQL query applies spec-folder and deprecated-tier predicates before `LIMIT`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fetch all indexed BM25 candidates when metadata filters can remove results. | The BM25 index already computes ranked matches and exposes document count, so the candidate pool is bounded by corpus size instead of an arbitrary multiplier. |
| Keep BM25 scoring and sorting untouched. | The bug was result-window truncation, not ranking quality. Preserving scoring minimizes regression risk. |
| Leave FTS5 code unchanged. | `fts5Bm25Search` includes spec-folder and deprecated-tier predicates in the SQL `WHERE` clause before `ORDER BY fts_score DESC LIMIT ?`. |
| Use mocked database metadata in tests. | The regression needs deterministic metadata filtering and must not touch live shards or host daemons. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` from `.opencode/skills/system-spec-kit/mcp_server` | PASS, exit 0, no output. |
| `npx vitest run tests/hybrid-search.vitest.ts` from `.opencode/skills/system-spec-kit/mcp_server` | PASS, exit 0, 1 test file passed, 98 tests passed (adds a combined scope+deprecated regression test). |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/021-hybrid-search-scope-then-limit --strict` | PASS, exit 0, 0 errors, 0 warnings. |
| Changed-code comment-hygiene grep on `hybrid-search.ts` and `hybrid-search.vitest.ts` diff | PASS, exit 0, no banned ephemeral comment labels in added code lines. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Metadata-filtered in-memory BM25 can examine more candidates for broad queries.** The pool is bounded by `index.getStats().documentCount` and only expands when scope or deprecated-tier filtering can otherwise under-return. The metadata lookup resolves ids in batches of 500, so a corpus-sized candidate set never exceeds SQLite's bind-parameter limit (a single oversized `IN (...)` would otherwise throw and drop every result).
2. **FTS5 behavior is unchanged.** The audited SQL lane already filters before limiting, so this phase does not alter SQL-backed lexical search.
3. **Pre-existing follow-up (out of this phase's scope).** The FTS5 lane builds its spec-folder predicate as `spec_folder LIKE ? || '/%'` with the raw scope value, so a scope containing SQL `LIKE` metacharacters (`%` / `_`) could widen the match. Current spec-folder identifiers are restricted to digits, lowercase, and hyphens, so there is no real exposure today; escaping the prefix is tracked as a separate hardening item.
<!-- /ANCHOR:limitations -->
