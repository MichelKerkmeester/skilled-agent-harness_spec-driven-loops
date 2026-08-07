---
title: "Implementation Plan: 034 Query Expansion Context Size"
description: "Add a consumer-side character cap for embedding expansion combinedQuery construction and verify the boundary behavior with focused vitest coverage."
trigger_phrases:
  - "034 query expansion plan"
  - "combinedQuery cap plan"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/034-query-expansion-context-size"
    last_updated_at: "2026-05-14T15:40:13Z"
    last_updated_by: "main-agent"
    recent_action: "Executed build, targeted vitest, equivalent stage1 regression, and strict validation"
    next_safe_action: "No 034 action needed"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 034 Query Expansion Context Size

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node.js |
| **Framework** | Spec Kit MCP server search pipeline |
| **Storage** | None for this patch |
| **Testing** | Vitest |

### Overview

The implementation adds a small `buildBoundedCombinedQuery()` helper in `embedding-expansion.ts`. It uses the existing priority order of `expanded` terms, keeps the base query verbatim, and appends terms only while the resulting string remains within a 6500-character budget. This chooses the dispatch-approved character proxy instead of threading tokenizer access through the pipeline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified as 037 and 039.

### Definition of Done

- [x] `npm run build` exits 0 in `mcp_server`.
- [x] `npx vitest run tests/embedding-expansion-bound.vitest.ts` passes.
- [x] `npx vitest run tests/stage1-expansion.vitest.ts` passes as the available stage1 regression; the requested `tests/stage1-candidate-gen.vitest.ts` file is absent.
- [x] Strict spec validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Local pure helper inside the existing query-expansion module.

### Key Components

- **`buildBoundedCombinedQuery()`**: preserves base query, appends prioritized terms while under the cap, returns base unchanged if it is already over budget.
- **`COMBINED_QUERY_CHAR_BUDGET`**: named 6500-character cap derived from the dispatch's conservative char-proxy guidance.
- **`expandQueryWithEmbeddings()`**: continues extracting and ordering expansion terms as before, then calls the bounded builder.

### Data Flow

`expandQueryWithEmbeddings()` receives the original query and query embedding, mines expansion terms, sorts them by existing frequency-based priority, and calls `buildBoundedCombinedQuery(query, expanded)`. The resulting string is sent downstream without letting tail expansion terms exceed the practical llama-cpp query embedding budget.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `embedding-expansion.ts` | Builds `combinedQuery` from original query and expansion terms | Add bounded builder and use it at construction site | Targeted vitest and build |
| `embedding-expansion-bound.vitest.ts` | New regression coverage | Cover short, long-synonym, and long-base cases | Targeted vitest |
| `stage1-candidate-gen.ts` | Calls expansion output downstream | No source change | Existing stage1 regression test |
| `llama-cpp.ts` worker | Worker-side tokenizer truncation fallback | Explicitly unchanged | Git/source scope review |

Matrix axes:

| Axis | Values |
|------|--------|
| Base query size | under cap, over cap |
| Expansion term size | short, long |
| Expansion inclusion | all terms fit, tail terms dropped, no terms |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Scaffold 034 packet.
- [x] Read current expansion logic around `combinedQuery`.
- [x] Inspect nearby packet metadata format.

### Phase 2: Core Implementation

- [x] Add 6500-character budget constant.
- [x] Add bounded combined-query helper.
- [x] Replace unbounded string concatenation in `expandQueryWithEmbeddings()`.
- [x] Add targeted 034 vitest.

### Phase 3: Verification

- [ ] Run build.
- [ ] Run targeted vitest.
- [ ] Run stage1 regression vitest.
- [ ] Run strict spec validation.
- [ ] Record results in `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `buildBoundedCombinedQuery()` boundary behavior | Vitest |
| Regression | Stage 1 candidate generation still passes | Vitest |
| Build | TypeScript and dist finalization | `npm run build` |
| Spec validation | Packet completeness | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 037 worker diagnosis | Packet context | Complete | Explains why consumer cap matters. |
| 039 worker token truncation | Packet context | Complete | Remains final fallback for oversized base queries. |
| Vitest | Local dev dependency | Available in package | Required for requested test. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Build or regression test failure caused by bounded combinedQuery behavior.
- **Procedure**: Revert `embedding-expansion.ts` helper/use-site and remove the new vitest, then re-run build and regression.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup -> Core implementation -> Verification -> Summary
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Gate 3 packet answer | Core implementation |
| Core implementation | Source read | Verification |
| Verification | Source and tests patched | Summary |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | One packet scaffold and source read |
| Core Implementation | Low | One helper and one call-site replacement |
| Verification | Medium | Build, targeted test, regression, strict validation |
| **Total** | | **Small bounded patch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No data migration.
- [x] No provider dependency change.
- [x] Worker file is out of scope and untouched.

### Rollback Procedure

1. Revert `embedding-expansion.ts` to unbounded construction.
2. Remove `embedding-expansion-bound.vitest.ts`.
3. Re-run `npm run build` and stage1 regression.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
