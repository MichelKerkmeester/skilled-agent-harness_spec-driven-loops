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

- [ ] CHK-001 [P0] Bug fix code locations verified — `graph-search-fn.ts` lines 110 AND 151 (G1 has TWO occurrences), `memory-search.ts` ~line 1002 (G3 conditional gating at the call site, not line 303 which is the function definition) — HOW: Open each file, search for `mem:${` (G1) and chunk collapse conditional (G3); confirm line numbers match. Cross-ref T001, T002.
- [ ] CHK-002 [P0] Eval DB 5-table schema designed and reviewed — HOW: Verify schema defines `eval_queries`, `eval_relevance`, `eval_results`, `eval_metrics`, `eval_runs` tables with appropriate columns and foreign keys. Cross-ref T004.
- [ ] CHK-003 [P1] 142 research analysis and recommendations reviewed for Sprint 0 scope — HOW: Confirm R-001 through R-017 items relevant to Sprint 0 are addressed in spec.md scope section.
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

- [ ] CHK-020 [P0] 8-12 new tests added covering: G1 numeric IDs, G3 all code paths, R17 bounds, R13-S1 schema/hooks/metrics, BM25 path — HOW: Run `npx vitest --reporter=verbose`; count new test cases; verify each subsystem has >=1 test. Cross-ref T001-T008.
- [ ] CHK-021 [P0] 158+ existing tests still pass after all changes — HOW: Run full test suite; compare pass count to pre-change baseline (>=158). Evidence required: test output showing pass count.
- [ ] CHK-022 [P1] BM25 baseline path tested independently (FTS5 only, no vector/graph channels)
- [ ] CHK-023 [P1] Eval metric computation verified against known test data
- [ ] CHK-024 [P1] Constitutional Surfacing Rate metric computes correctly (known constitutional memories surface in top-K)
- [ ] CHK-025 [P1] Cold-Start Detection Rate metric computes correctly (memories <48h correctly identified)
- [ ] CHK-026 [P1] Full-context ceiling metric (A2) computed for 50+ queries and recorded alongside baseline
- [ ] CHK-027 [P1] Quality proxy formula (B7) produces scores in [0,1] range and correlates with manual evaluation
- [ ] CHK-028 [P1] Observer effect mitigation (D4) verified — search p95 increase ≤10% with eval logging enabled
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

## PageIndex Integration

- [ ] PI-A5 [P1]: Verify-Fix-Verify quality gate active in `memory-save.ts` — cosine self-similarity > 0.7 and title-content alignment > 0.5 enforced post-embedding; re-generation triggered on first failure; `quality_flag=low` set and eval-logged after second failure (max 2 retries, bounded)

---

## Sprint 0 Exit Gate

- [ ] CHK-060 [P0] Graph hit rate > 0% — verified via eval telemetry or manual query inspection
- [ ] CHK-061 [P0] No duplicate chunk rows in default search mode (`includeContent=false`)
- [ ] CHK-062 [P0] Baseline MRR@5, NDCG@10, Recall@20, Hit Rate@1 computed for 50+ queries — HOW: Run `eval_metrics` query against `speckit-eval.db`; verify row count >=50 in `eval_results` table; cross-ref T006, T007
- [ ] CHK-062b [P0] Ground truth query diversity verified — >=5 queries per intent type, >=3 query complexity tiers (simple, moderate, complex), >=3 hard negatives. HARD GATE. — HOW: Count distinct intent_type tags and complexity_tier tags in `eval_queries` table; verify thresholds. Evidence required: query distribution table showing counts per intent type and tier.
- [ ] CHK-062c [P1] G-NEW-2 pre-analysis completed — agent consumption pattern report produced with >=5 identified consumption patterns; findings incorporated into ground truth query design (T007). Cross-ref T007b.
- [ ] CHK-063 [P0] BM25 baseline MRR@5 recorded and compared to hybrid — HOW: Compare `eval_metrics` rows for BM25-only vs hybrid runs; cross-ref T008
- [ ] CHK-064 [P0] BM25 contingency decision made (PAUSE / rationalize / PROCEED) — Evidence required: documented comparison ratio and selected decision path
- [ ] CHK-S0B [P0] TM-02 content-hash dedup active — exact duplicate saves rejected without embedding generation; distinct content passes without false-positive rejection (`memory-save.ts`) — HOW: Re-save identical content, verify no embedding API call; modify content, verify embedding is generated; cross-ref T054
- [ ] CHK-065 [P1] R17 hub domination reduced — verified via co-activation result diversity — HOW: Run 10+ queries, check no single memory appears in >60% of co-activation results; cross-ref T003
- [ ] CHK-066 [P1] Full-context ceiling metric recorded and 2x2 decision matrix evaluated — cross-ref T006f
- [ ] CHK-067 [P1] Quality proxy formula operational for automated regression checks — cross-ref T006g
- [ ] CHK-068 [P1] Active feature flag count <=6 verified at sprint exit — HOW: grep codebase for `SPECKIT_` env var flags; count active (non-deprecated) flags; document list. Evidence required: flag inventory list with count.

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | [ ]/10 |
| P1 Items | 23 | [ ]/23 |
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
