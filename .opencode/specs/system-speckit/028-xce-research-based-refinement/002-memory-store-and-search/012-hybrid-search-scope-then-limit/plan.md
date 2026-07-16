---
title: "Implementation Plan: Hybrid Search Scope Then Limit"
description: "Update the in-memory BM25 search path to gather a corpus-bounded candidate set before applying spec-folder and deprecated-tier filters. Add focused vitest regressions and document the completed verification evidence."
trigger_phrases:
  - "bm25 scope then limit plan"
  - "hybrid search regression plan"
  - "lexical candidate pool"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit"
    last_updated_at: "2026-06-11T09:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Planned and delivered a bounded candidate-pool fix for in-memory BM25 filtering."
    next_safe_action: "Review implementation-summary.md for final command outputs."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts"
    session_dedup:
      fingerprint: "sha256:a19fcaf7360a27290ddf97f2a12b846f0f9c9f2b77e8dfbe38f8fe5dd5f7e74c"
      session_id: "2026-06-11-hybrid-search-scope-then-limit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use the BM25 index document count as the hard candidate bound when metadata filters can drop results."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Hybrid Search Scope Then Limit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Vitest for tests, Spec Kit MCP server runtime |
| **Storage** | Mocked `better-sqlite3` database interface for tests; no live database writes |
| **Testing** | `npx tsc --noEmit`, `npx vitest run tests/hybrid-search.vitest.ts`, strict spec validation |

### Overview
The implementation changes only the legacy in-memory BM25 path inside `bm25Search`. When spec-folder filtering or deprecated-tier metadata filtering can remove ranked hits, the path asks the BM25 index for a corpus-bounded candidate set, applies the existing metadata predicate, and then slices to the requested limit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [x] All acceptance criteria met by code and tests.
- [x] Hybrid-search vitest file passes with the added regression tests.
- [x] Spec, plan, tasks, and implementation summary are filled with completed content.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small corrective change in an existing search helper.

### Key Components
- **`bm25Search`**: Owns the in-memory BM25 lane exposed to hybrid lexical search.
- **BM25 index**: Provides ranked search results and `documentCount` for a hard corpus bound.
- **Memory metadata lookup**: Resolves `spec_folder` and `importance_tier` for candidate filtering.
- **FTS5 delegated lane**: Uses SQL-backed filtering and remains unchanged.

### Data Flow
The caller provides a query, limit, and optional spec folder. `bm25Search` gets a ranked candidate pool from the BM25 index, resolves metadata for those candidates, removes deprecated or out-of-scope rows, slices survivors to the caller limit, and returns BM25-tagged results in score order.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hybrid-search.ts:bm25Search` | In-memory BM25 result collection and metadata filtering | Updated candidate pool sizing and final survivor slicing | New scoped, deprecated, and unscoped regression tests pass |
| `sqlite-fts.ts:fts5Bm25Search` | SQL-backed FTS5 lexical ranking | Unchanged after audit | SQL applies `spec_folder`, deprecated-tier predicate, `ORDER BY`, then `LIMIT` |
| `hybrid-search.vitest.ts` | Existing hybrid search regression suite | Added focused in-memory fixtures | `npx vitest run tests/hybrid-search.vitest.ts` passed with 97 tests |

Required inventories:
- Same-class producers checked: `bm25Search`, `ftsSearch`, `fts5Bm25Search`, and `BM25Index.search`.
- Consumers of changed behavior checked through the existing exported `bm25Search` test path.
- Input axes covered: `specFolder` present, deprecated rows present, and no filter removing results.
- Algorithm invariant: BM25 score order is preserved; metadata filters decide eligibility; final limit truncates only eligible survivors.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the current BM25 implementation and existing test structure.
- [x] Read the phase scaffold docs and confirmed the required Level 1 surfaces.
- [x] Audited the FTS5 delegated lane before changing code.

### Phase 2: Core Implementation
- [x] Added corpus-bounded candidate fetching to `bm25Search` when metadata filters can remove candidates.
- [x] Kept the existing fail-closed metadata lookup behavior.
- [x] Left FTS5 unchanged because its SQL filters precede `LIMIT`.

### Phase 3: Verification
- [x] Added regression tests for scoped survivor count, deprecated survivor count, and unscoped order preservation.
- [x] Ran the hybrid-search test file successfully.
- [x] Ran TypeScript successfully.
- [x] Filled phase documentation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | In-memory BM25 scope filtering, deprecated filtering, unscoped order preservation | Vitest |
| Type check | MCP server TypeScript project | `npx tsc --noEmit` |
| Documentation validation | Level 1 packet docs | `validate.sh --strict` |
| Comment hygiene | Added code comments and changed code diff | Diff grep for banned ephemeral comment labels |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| BM25 index `getStats().documentCount` | Internal | Green | Without a corpus bound, over-fetch sizing would need an arbitrary multiplier. |
| Memory metadata lookup query | Internal | Green | Scoped searches must return `[]` on lookup failure to avoid leaking unscoped candidates. |
| Vitest fixture isolation | Internal | Green | Regression tests must avoid live shards and host daemons. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Type checking, hybrid-search tests, strict spec validation, or comment-hygiene checks fail and cannot be repaired within this scoped change.
- **Procedure**: Revert the `bm25Search` candidate-pool change and the three added tests, then restore the previous scaffold documentation only if the implementation is not delivered.
<!-- /ANCHOR:rollback -->
