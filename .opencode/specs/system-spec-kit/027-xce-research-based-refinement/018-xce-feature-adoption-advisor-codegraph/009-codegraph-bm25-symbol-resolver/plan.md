---
title: "Implementation Plan: Phase 9: codegraph-bm25-symbol-resolver [template:level_1/plan.md]"
description: "Implemented an optional default-off BM25 symbol resolver for code-graph disambiguation suggestions without changing exact structural matching."
trigger_phrases:
  - "implementation"
  - "plan"
  - "code graph symbol resolver"
  - "BM25 fuzzy symbol lookup"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver"
    last_updated_at: "2026-06-10T21:38:20Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Delivered optional fallback-only BM25 symbol resolver"
    next_safe_action: "Keep BM25 resolver default-off"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/symbol-bm25-resolver.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-codegraph-bm25-symbol-resolver"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "BM25 resolver runs only after exact subject matching misses."
      - "The feature is enabled only by SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: codegraph-bm25-symbol-resolver

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node) |
| **Framework** | mk_code_index MCP daemon |
| **Storage** | code-graph SQLite (read-only symbol rows for this phase) |
| **Testing** | vitest, TypeScript typecheck, TypeScript build |

### Overview
Implemented an optional default-off BM25 symbol resolver for code-graph disambiguation suggestions. Exact `symbol_id`, `fq_name`, and `name` matching remains the only structural resolution path; BM25 only supplies candidates after exact resolution misses.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing: targeted resolver/query tests, query-related suites, typecheck, and build
- [x] Docs updated: spec, plan, tasks, implementation summary, metadata
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Default-off fallback resolver with packed BM25F postings over indexed symbol metadata.

### Key Components
- **`symbol-bm25-resolver.ts`**: Builds a packed in-memory BM25F index over symbol fields and returns symbol candidates only.
- **`query.ts` exact resolver**: Preserves exact resolution and calls BM25 only on unresolved subjects when the feature flag is enabled.
- **`code-graph-db.ts` accessor**: Exposes symbol rows for the fallback index without mutating graph storage.

### Data Flow
Query subject -> exact `symbol_id` lookup -> exact `fq_name` lookup -> exact `name` lookup -> unchanged structural query when any exact match exists. Only when all exact paths miss and `SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER` is enabled, `query.ts` loads symbol-field rows and returns BM25 candidate suggestions in the unresolved-subject error payload.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `query.ts` subject resolution | Owns exact `symbol_id` / `fq_name` / `name` matching | Updated only after exact miss | Byte-identical exact-match test in `code-graph-query-handler.vitest.ts` |
| `symbol-bm25-resolver.ts` | Scores symbol candidates | New default-off fallback helper | `symbol-bm25-resolver.vitest.ts` covers weights, trigrams, packed arrays, and flag parser |
| `code-graph-db.ts` | Reads graph rows | Additive read-only accessor | Typecheck and query tests |

Required inventories:
- Same-class producers checked: existing exact matching in `handlers/query.ts`; packed BM25 pattern in advisor scorer.
- Consumers of changed symbols: query handler uses `querySymbolIndexRows()` only inside the flagged fallback branch; no existing structural caller changed.
- Matrix axes: flag off/on, exact hit/miss, field weights, near-miss token overlap, packed-array footprint.
- Algorithm invariant: BM25 returns candidates only and never selects a structural `symbolId` for query execution.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read phase scaffold and existing query handler resolution path
- [x] Reused packed BM25F pattern without adding dependencies
- [x] Confirmed allowed write scope before edits

### Phase 2: Core Implementation
- [x] Added packed BM25F symbol resolver over `name`, `fqName`, `signature`, `docstring`, and `filePath`
- [x] Added read-only `querySymbolIndexRows()` accessor
- [x] Wired query fallback only after exact subject matching misses and feature flag is enabled

### Phase 3: Verification
- [x] Added resolver unit tests for default-off, field weighting, trigrams, and packed postings
- [x] Added query handler tests proving exact-match byte identity and fallback-only behavior
- [x] Ran typecheck, build, targeted tests, query suites, and strict phase validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Resolver scoring, flag parser, packed postings | Vitest |
| Integration | Query handler exact-hit and exact-miss behavior | Vitest |
| Manual | Not applicable; no UI/runtime daemon mutation | N/A |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 packed BM25 pattern | Internal pattern | Green | Used as a shape reference; no dependency import required |
| Existing code graph exact matching | Internal behavior | Green | Preserved by byte-identical exact-match test |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any evidence that BM25 suggestions alter exact subject resolution or become a general text-search path.
- **Procedure**: Disable `SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER`; if needed, remove the additive resolver import, unresolved-subject suggestion branch, read-only accessor, and resolver tests.
<!-- /ANCHOR:rollback -->
