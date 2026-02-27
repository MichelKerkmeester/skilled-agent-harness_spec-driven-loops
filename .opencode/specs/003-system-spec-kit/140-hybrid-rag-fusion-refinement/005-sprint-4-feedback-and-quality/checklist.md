---
title: "Verification Checklist: Sprint 4 — Feedback and Quality"
description: "Verification checklist for MPAB chunk aggregation, learned relevance feedback, and shadow scoring."
trigger_phrases:
  - "sprint 4 checklist"
  - "feedback and quality checklist"
  - "sprint 4 verification"
importance_tier: "important"
contextType: "implementation"
---
# Verification Checklist: Sprint 4 — Feedback and Quality

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

- [ ] CHK-S4-001 [P0] Sprint 3 exit gate verified (predecessor complete)
- [ ] CHK-S4-002 [P0] R13 completed 2+ eval cycles (prerequisite for R11)
- [ ] CHK-S4-003 [P0] Checkpoint created before sprint start
- [ ] CHK-S4-004 [P0] Requirements documented in spec.md
- [ ] CHK-S4-005 [P0] Technical approach defined in plan.md
- [ ] CHK-S4-006 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-S4-010 [P0] Code passes lint/format checks
- [ ] CHK-S4-011 [P0] No console errors or warnings
- [ ] CHK-S4-012 [P1] Error handling implemented
- [ ] CHK-S4-013 [P1] Code follows project patterns (feature flag gating, pipeline extension)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:sprint-4-verification -->
## Sprint 4 Specific Verification

### R1 — MPAB Chunk Aggregation
- [ ] CHK-S4-020 [P1] R1 dark-run: MRR@5 within 2% of baseline
- [ ] CHK-S4-021 [P1] R1 N=1 no regression (single chunk = raw score)
- [ ] CHK-S4-022 [P1] R1 N=0 returns 0 (no div-by-zero)
- [ ] CHK-S4-023 [P1] R1 `_chunkHits` metadata preserved in results

### R11 — Learned Relevance Feedback
- [ ] CHK-S4-030 [P1] R11 shadow log: noise rate <5%
- [ ] CHK-S4-031 [P0] R11 FTS5 contamination test: `learned_triggers` NOT in FTS5 index
- [ ] CHK-S4-032 [P1] R11 denylist contains 100+ stop words
- [ ] CHK-S4-033 [P1] R11 cap enforced: max 3 terms/selection, max 8 per memory
- [ ] CHK-S4-034 [P1] R11 TTL: 30-day expiry on learned terms
- [ ] CHK-S4-035 [P1] R11 eligibility: memories <72h excluded
- [ ] CHK-S4-036 [P1] R11 shadow period: 1-week log-only before mutations
- [ ] CHK-S4-037 [P1] R1+R11 interaction verified: MPAB operates on post-fusion scores, not on pre-boosted R11 scores
- [ ] CHK-S4-038 [P1] R13 eval cycle defined: minimum 100 query evaluations AND 14+ calendar days constitutes one eval cycle for the R11 prerequisite (both conditions must be met)

### R13-S2 — Shadow Scoring
- [ ] CHK-S4-040 [P1] R13-S2 operational: full A/B comparison infrastructure working
- [ ] CHK-S4-041 [P1] Channel attribution present in eval results

### A4 — Negative Feedback Confidence
- [ ] CHK-S4-042 [P1] A4 negative feedback confidence demotion verified — bad memories score reduced, floor at 0.3

### B2 — Chunk Ordering
- [ ] CHK-S4-043 [P1] B2 chunk ordering verified — multi-chunk reassembly in document order, not score order

### TM-04 — Pre-Storage Quality Gate
- [ ] CHK-S4-044 [P1] TM-04 Layer 1 structural validation passes for valid memories and fails for structurally invalid ones
- [ ] CHK-S4-045 [P1] TM-04 Layer 2 content quality scoring — signal density < 0.4 threshold rejects low-quality saves; high-quality saves pass
- [ ] CHK-S4-046 [P1] TM-04 Layer 3 semantic dedup — cosine similarity >0.92 rejects near-duplicates; distinct content at <0.92 passes
- [ ] CHK-S4-047 [P1] TM-04 behind `SPECKIT_SAVE_QUALITY_GATE` flag — disabled state = no behavior change from pre-Sprint-4
- [ ] CHK-S4-047a [P1] TM-04 warn-only mode (MR12): for first 2 weeks after activation, quality scores logged and would-reject decisions recorded but saves NOT blocked; enforcement enabled only after false-rejection rate review

### G-NEW-3 — Context-Type Boost (Phase C)
- [ ] CHK-S4-GNEW3 [P1] G-NEW-3 Phase C: LLM-judge ground truth generation operational with >=80% agreement with manual labels

### TM-06 — Reconsolidation-on-Save
- [ ] CHK-S4-048 [P0] TM-06 checkpoint created before first enable (`pre-reconsolidation`)
- [ ] CHK-S4-049 [P1] TM-06 merge path (>=0.88): duplicate memories merged, frequency counter incremented
- [ ] CHK-S4-050 [P1] TM-06 conflict path (0.75–0.88): memory replaced, causal `supersedes` edge added
- [ ] CHK-S4-051 [P1] TM-06 complement path (<0.75): new memory stored without modification
- [ ] CHK-S4-052 [P1] TM-06 behind `SPECKIT_RECONSOLIDATION` flag — disabled state = normal store behavior
- [ ] CHK-S4-052a [P1] TM-04/TM-06 threshold interaction: save with similarity in [0.88, 0.92] passes TM-04, triggers TM-06 merge — verify save-then-merge behavior with frequency increment
<!-- /ANCHOR:sprint-4-verification -->

---

<!-- ANCHOR:pageindex-verification -->
## PageIndex Verification

> **PI-A4 deferred to Sprint 5** — CHK-PI-A4-001 through CHK-PI-A4-008 moved to Sprint 5 checklist per ultra-think review REC-07.
<!-- /ANCHOR:pageindex-verification -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-S4-054 [P0] All acceptance criteria met (REQ-S4-001 through REQ-S4-005)
- [ ] CHK-S4-055 [P1] 22-32 new tests passing (800-1100 LOC)
- [ ] CHK-S4-056 [P1] Edge cases tested (N=0, N=1, empty channels, <72h memories)
- [ ] CHK-S4-053 [P1] Existing tests still pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:schema -->
## Schema Migration

- [ ] CHK-S4-060 [P1] Schema migration follows protocol (backup, nullable default, atomic)
- [ ] CHK-S4-061 [P1] `learned_triggers` column added with `TEXT DEFAULT '[]'`
- [ ] CHK-S4-062 [P1] Rollback path verified: `DROP COLUMN` on SQLite 3.35.0+
- [ ] CHK-S4-063 [P1] Checkpoint restored successfully in test (rollback validation)
<!-- /ANCHOR:schema -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-S4-070 [P1] Spec/plan/tasks synchronized
- [ ] CHK-S4-071 [P1] Code comments adequate
- [ ] CHK-S4-072 [P1] Feature flags documented
- [ ] CHK-S4-073 [P1] Schema change documented

## Feature Flag Audit

- [ ] CHK-S4-074 [P1] **Feature flag count at Sprint 4 exit ≤6 verified**: List all active flags with names. Evidence: explicit flag inventory at exit gate.
  - Flags added this sprint: `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_LEARN_FROM_SELECTION`, `SPECKIT_SAVE_QUALITY_GATE`, `SPECKIT_RECONSOLIDATION`
  - Verify prior sprint flags still active or document sunset decision
- [ ] CHK-S4-075 [P1] **Flag sunset decisions documented**: Any flag retired has metric evidence supporting the decision recorded (e.g., "RSF rejected at tau=0.32, flag SPECKIT_RSF_FUSION disabled").

## Calendar Dependency Verification

- [ ] CHK-S4-076 [P0] **R11 calendar prerequisite met**: Confirm ≥28 calendar days have elapsed since Sprint 3 completion AND R13 completed ≥2 full eval cycles (each cycle = 100+ queries AND 14+ calendar days; both conditions must be met). Evidence: date stamps from eval cycle logs.
- [ ] CHK-S4-076a [P1] **14-day mid-window checkpoint**: After 14 calendar days (1 complete eval cycle), verify R13 eval infrastructure is collecting valid data and shadow scoring produces usable A/B comparisons. An early failure at day 14 is recoverable; a failure discovered at day 28 wastes the full idle window.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-S4-080 [P1] Temp files in scratch/ only
- [ ] CHK-S4-081 [P1] scratch/ cleaned before completion
- [ ] CHK-S4-082 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [ ]/11 |
| P1 Items | 46 | [ ]/46 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 5 of 8
Sprint 4: Feedback and Quality
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
