---
title: "Verification Checklist: Sprint 0 — Epistemological Foundation"
description: "Verification checklist for Sprint 0: graph ID fix, chunk collapse, eval infrastructure, BM25 baseline"
trigger_phrases:
  - "sprint 0 checklist"
  - "epistemological foundation checklist"
  - "sprint 0 verification"
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: Sprint 0 — Epistemological Foundation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Bug fix code locations verified — `graph-search-fn.ts` lines 110 AND 151 (G1 has TWO occurrences), `memory-search.ts` ~line 1002 (G3 conditional gating at the call site, not line 303 which is the function definition)
- [ ] CHK-002 [P0] Eval DB 5-table schema designed and reviewed
- [ ] CHK-003 [P1] 142 research analysis and recommendations reviewed for Sprint 0 scope
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] G1 produces numeric memory IDs (not `mem:${edgeId}` strings)
- [ ] CHK-011 [P0] G3 chunk dedup runs on ALL code paths (including `includeContent=false`)
- [ ] CHK-012 [P1] R17 fan-effect divisor has proper bounds (no division by zero, capped output)
- [ ] CHK-013 [P1] Eval logging hooks are non-blocking (async or fire-and-forget)
- [ ] CHK-014 [P2] Code follows existing TypeScript patterns in the codebase
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] 8-12 new tests added covering: G1 numeric IDs, G3 all code paths, R17 bounds, R13-S1 schema/hooks/metrics, BM25 path
- [ ] CHK-021 [P0] 158+ existing tests still pass after all changes
- [ ] CHK-022 [P1] BM25 baseline path tested independently (FTS5 only, no vector/graph channels)
- [ ] CHK-023 [P1] Eval metric computation verified against known test data
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Eval DB (`speckit-eval.db`) is a separate file from primary database
- [ ] CHK-031 [P1] No eval queries read from or write to primary DB
- [ ] CHK-032 [P2] Eval DB file permissions match primary DB
- [ ] CHK-033 [P1] NFR-P01: Eval logging adds ≤5ms p95 to search latency — measured before/after
- [ ] CHK-034 [P1] NFR-R02: Search continues normally if eval DB is unavailable — graceful degradation verified
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized and reflect final implementation
- [ ] CHK-041 [P1] BM25 contingency decision documented with rationale
- [ ] CHK-042 [P2] Eval DB schema documented for future sprint reference
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Sprint 0 findings saved to memory/
<!-- /ANCHOR:file-org -->

---

## Sprint 0 Exit Gate

- [ ] CHK-060 [P0] Graph hit rate > 0% — verified via eval telemetry or manual query inspection
- [ ] CHK-061 [P0] No duplicate chunk rows in default search mode (`includeContent=false`)
- [ ] CHK-062 [P0] Baseline MRR@5, NDCG@10, Recall@20, Hit Rate@1 computed for 50+ queries
- [ ] CHK-063 [P0] BM25 baseline MRR@5 recorded and compared to hybrid
- [ ] CHK-064 [P0] BM25 contingency decision made (PAUSE / rationalize / PROCEED)
- [ ] CHK-065 [P1] R17 hub domination reduced — verified via co-activation result diversity

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | [ ]/8 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 3 | [ ]/3 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 1 of 8
Sprint 0 exit gate items are P0 HARD BLOCKERS
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
