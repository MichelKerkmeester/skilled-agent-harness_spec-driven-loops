---
title: "Implementation Plan: Packed In-Memory BM25 Engine with Field Weights"
description: "Implement the reserved packed-inmemory engine (term dictionary + typed-array postings), add BM25F per-field weighting from the exported weights, and gate on measured RAM/warmup budgets plus the bm25-baseline eval."
trigger_phrases:
  - "014-packed-bm25-field-weights plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights"
    last_updated_at: "2026-06-10T20:40:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Plan executed and verified"
    next_safe_action: "Use packed-inmemory for fallback validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-packed-bm25-field-weights"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Packed In-Memory BM25 Engine with Field Weights

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server), better-sqlite3 |
| **Framework** | Spec Kit Memory MCP daemon |
| **Storage** | SQLite (context-index + vector shards) |
| **Testing** | vitest + eval harness fixtures |

### Overview
Implement the reserved packed-inmemory engine (term dictionary + typed-array postings), add BM25F per-field weighting from the exported weights, and gate on measured RAM/warmup budgets plus the bm25-baseline eval.
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
- [x] Tests passing: `npm run build` and `npx vitest run tests/bm25-packed-inmemory.vitest.ts`
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical refinement of existing mcp_server modules; additive and flag-gated until verification gates pass.

### Key Components
- **Packed engine**: Typed-array postings; docs hold term freqs + lengths only
- **BM25F scoring**: Per-field weights, query-time tunable
- **Budget gates**: RSS <= 150MB, warmup <= 10s at current corpus

### Data Flow
warmup batches -> packed postings build -> search() inverted-index lookups -> BM25F scores -> existing fusion channel unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug-fix packet; surfaces and verification live in the spec Files-to-Change table and the phase checklist below. No security/path/schema-boundary findings in scope.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| See spec.md Files to Change | Read/write paths named there | Modify/Create per spec | Tests + benchmarks listed in Phase 3 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] RAM/warmup spike on packed layout at 1x and 3x corpus
- [x] Eval baseline run (legacy + FTS5)

### Phase 2: Core
- [x] Packed engine in reserved slot
- [x] BM25F field weighting
- [x] Engine selection logging

### Phase 3: Verification
- [x] Budget gates measured (realistic-fixture re-validation: 686.8 MB warmup spike BREACHED the 150 MB budget; original 111 MB pass superseded — see spec.md §7)
- [x] Eval parity vs legacy and FTS5 recorded
- [x] Contingency decision: the realistic-fixture breach FIRED the contingency; closed by phase 017 at a 136.5 MB peak-sampled spike. 3x projection (247 MB) recorded as a follow-up scale risk
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New/changed modules | vitest |
| Integration | End-to-end path on fixtures | vitest + fixture DBs |
| Benchmark | Latency/RAM gates named in spec | recorded in implementation-summary |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bm25-baseline eval harness | Internal | Pending | Relevance gate |
| Fusion pipeline | Internal | Pending | Channel wiring unchanged |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verification gate failure or behavior drift.
- **Procedure**: Engine flag keeps legacy as default until parity + budgets pass; packed engine is additive.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
