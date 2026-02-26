---
title: "Verification Checklist: Sprint 4 — Feedback Loop"
description: "Verification checklist for MPAB chunk aggregation, learned relevance feedback, and shadow scoring."
trigger_phrases:
  - "sprint 4 checklist"
  - "feedback loop checklist"
  - "sprint 4 verification"
importance_tier: "important"
contextType: "implementation"
---
# Verification Checklist: Sprint 4 — Feedback Loop

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

- [ ] CHK-001 [P0] Sprint 3 exit gate verified (predecessor complete)
- [ ] CHK-002 [P0] R13 completed 2+ eval cycles (prerequisite for R11)
- [ ] CHK-003 [P0] Checkpoint created before sprint start
- [ ] CHK-004 [P0] Requirements documented in spec.md
- [ ] CHK-005 [P0] Technical approach defined in plan.md
- [ ] CHK-006 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns (feature flag gating, pipeline extension)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:sprint-4-verification -->
## Sprint 4 Specific Verification

### R1 — MPAB Chunk Aggregation
- [ ] CHK-020 [P1] R1 dark-run: MRR@5 within 2% of baseline
- [ ] CHK-021 [P1] R1 N=1 no regression (single chunk = raw score)
- [ ] CHK-022 [P1] R1 N=0 returns 0 (no div-by-zero)
- [ ] CHK-023 [P1] R1 `_chunkHits` metadata preserved in results

### R11 — Learned Relevance Feedback
- [ ] CHK-030 [P1] R11 shadow log: noise rate <5%
- [ ] CHK-031 [P0] R11 FTS5 contamination test: `learned_triggers` NOT in FTS5 index
- [ ] CHK-032 [P1] R11 denylist contains 100+ stop words
- [ ] CHK-033 [P1] R11 cap enforced: max 3 terms/selection, max 8 per memory
- [ ] CHK-034 [P1] R11 TTL: 30-day expiry on learned terms
- [ ] CHK-035 [P1] R11 eligibility: memories <72h excluded
- [ ] CHK-036 [P1] R11 shadow period: 1-week log-only before mutations
- [ ] CHK-037 [P1] R1+R11 interaction verified: MPAB operates on post-fusion scores, not on pre-boosted R11 scores
- [ ] CHK-038 [P1] R13 eval cycle defined: minimum 50 query evaluations over 7+ days constitutes one eval cycle for the R11 prerequisite

### R13-S2 — Shadow Scoring
- [ ] CHK-040 [P1] R13-S2 operational: full A/B comparison infrastructure working
- [ ] CHK-041 [P1] Channel attribution present in eval results

### A4 — Negative Feedback Confidence
- [ ] CHK-042 [P1] A4 negative feedback confidence demotion verified — bad memories score reduced, floor at 0.3

### B2 — Chunk Ordering
- [ ] CHK-043 [P1] B2 chunk ordering verified — multi-chunk reassembly in document order, not score order

### TM-04 — Pre-Storage Quality Gate
- [ ] CHK-044 [P1] TM-04 Layer 1 structural validation passes for valid memories and fails for structurally invalid ones
- [ ] CHK-045 [P1] TM-04 Layer 2 content quality scoring — signal density < 0.4 threshold rejects low-quality saves; high-quality saves pass
- [ ] CHK-046 [P1] TM-04 Layer 3 semantic dedup — cosine similarity >0.92 rejects near-duplicates; distinct content at <0.92 passes
- [ ] CHK-047 [P1] TM-04 behind `SPECKIT_SAVE_QUALITY_GATE` flag — disabled state = no behavior change from pre-Sprint-4

### TM-06 — Reconsolidation-on-Save
- [ ] CHK-048 [P0] TM-06 checkpoint created before first enable (`pre-reconsolidation`)
- [ ] CHK-049 [P1] TM-06 merge path (>=0.88): duplicate memories merged, frequency counter incremented
- [ ] CHK-050 [P1] TM-06 conflict path (0.75–0.88): memory replaced, causal `supersedes` edge added
- [ ] CHK-051 [P1] TM-06 complement path (<0.75): new memory stored without modification
- [ ] CHK-052 [P1] TM-06 behind `SPECKIT_RECONSOLIDATION` flag — disabled state = normal store behavior
<!-- /ANCHOR:sprint-4-verification -->

---

<!-- ANCHOR:pageindex-verification -->
## PageIndex Verification

### PI-A4 — Constitutional Memory as Expert Knowledge Injection
- [ ] CHK-PI-A4-001 [P1] search_directive: true metadata tag added to constitutional memories and detectable by orchestration layer
- [ ] CHK-PI-A4-002 [P1] memory_context orchestration layer detects search_directive tag before retrieval executes
- [ ] CHK-PI-A4-003 [P1] Search-relevant instructions (channels, term expansions, tier priorities) extracted from tagged constitutional memories
- [ ] CHK-PI-A4-004 [P1] Extracted instructions injected into query expansion step before vector search
- [ ] CHK-PI-A4-005 [P1] Tagged constitutional memories do NOT appear as content items in retrieval results
- [ ] CHK-PI-A4-006 [P1] Non-tagged constitutional memories continue surfacing as content items (no regression)
- [ ] CHK-PI-A4-007 [P1] R-015 context-aware retrieval extended, not replaced — existing behavior preserved for non-directive retrieval
- [ ] CHK-PI-A4-008 [P2] Rollback path: removing search_directive tag restores content-item surfacing behavior
<!-- /ANCHOR:pageindex-verification -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-050 [P0] All acceptance criteria met (REQ-S4-001 through REQ-S4-003)
- [ ] CHK-051 [P1] 10-15 new tests passing (400-550 LOC)
- [ ] CHK-052 [P1] Edge cases tested (N=0, N=1, empty channels, <72h memories)
- [ ] CHK-053 [P1] Existing tests still pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:schema -->
## Schema Migration

- [ ] CHK-060 [P1] Schema migration follows protocol (backup, nullable default, atomic)
- [ ] CHK-061 [P1] `learned_triggers` column added with `TEXT DEFAULT '[]'`
- [ ] CHK-062 [P1] Rollback path verified: `DROP COLUMN` on SQLite 3.35.0+
- [ ] CHK-063 [P1] Checkpoint restored successfully in test (rollback validation)
<!-- /ANCHOR:schema -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-070 [P1] Spec/plan/tasks synchronized
- [ ] CHK-071 [P1] Code comments adequate
- [ ] CHK-072 [P1] Feature flags documented
- [ ] CHK-073 [P1] Schema change documented
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-080 [P1] Temp files in scratch/ only
- [ ] CHK-081 [P1] scratch/ cleaned before completion
- [ ] CHK-082 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | [ ]/10 |
| P1 Items | 41 | [ ]/41 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 5 of 8
Sprint 4: Feedback Loop
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
