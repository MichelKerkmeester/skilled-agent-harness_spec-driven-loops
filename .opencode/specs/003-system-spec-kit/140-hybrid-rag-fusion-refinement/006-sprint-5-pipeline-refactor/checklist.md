---
title: "Verification Checklist: Sprint 5 — Pipeline Refactor"
description: "Verification checklist for 4-stage pipeline refactor, spec folder pre-filter, query expansion, and spec-kit retrieval metadata."
trigger_phrases:
  - "sprint 5 checklist"
  - "pipeline refactor checklist"
  - "sprint 5 verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Sprint 5 — Pipeline Refactor

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

- [ ] CHK-001 [P0] Sprint 4 exit gate verified (predecessor complete)
- [ ] CHK-002 [P0] Checkpoint created before R6 work (`pre-pipeline-refactor`)
- [ ] CHK-003 [P0] Requirements documented in spec.md
- [ ] CHK-004 [P0] Technical approach defined in plan.md
- [ ] CHK-005 [P1] Dependencies identified and available
- [ ] CHK-006 [P1] All 158+ existing tests green before starting
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
- [ ] CHK-014 [P1] Stage interfaces documented with JSDoc
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:sprint-5-verification -->
## Sprint 5 Specific Verification

### R6 — 4-Stage Pipeline
- [ ] CHK-020 [P0] Checkpoint created before R6 work
- [ ] CHK-021 [P1] R6 dark-run: 0 ordering differences on full eval corpus
- [ ] CHK-022 [P1] All 158+ tests pass with `SPECKIT_PIPELINE_V2` enabled
- [ ] CHK-023 [P1] Stage 4 invariant verified: no score modifications in Stage 4
- [ ] CHK-024 [P1] Intent weights applied ONCE in Stage 2 (prevents G2 recurrence)

### R9 — Spec Folder Pre-Filter
- [ ] CHK-030 [P1] R9 cross-folder queries identical to without pre-filter

### R12 — Query Expansion
- [ ] CHK-040 [P1] R12+R15 mutual exclusion: R12 suppressed when R15="simple"
- [ ] CHK-041 [P1] R12 no degradation of simple query latency

### S2/S3 — Spec-Kit Retrieval Metadata
- [ ] CHK-050 [P1] S2 anchor-aware retrieval metadata present in results
- [ ] CHK-051 [P1] S3 validation metadata integrated into scoring

### TM-05 — Dual-Scope Auto-Surface Hooks
- [ ] CHK-055 [P1] TM-05 auto-surface hook fires at tool dispatch lifecycle point
- [ ] CHK-056 [P1] TM-05 auto-surface hook fires at session compaction lifecycle point
- [ ] CHK-057 [P1] TM-05 per-point token budget of 4000 enforced — no overrun
- [ ] CHK-058 [P1] TM-05 no regression in existing auto-surface behavior (`hooks/auto-surface.ts`)
<!-- /ANCHOR:sprint-5-verification -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-060 [P0] All acceptance criteria met (REQ-S5-001 through REQ-S5-005)
- [ ] CHK-061 [P1] 15-20 new tests passing (500-700 LOC)
- [ ] CHK-062 [P1] Edge cases tested (empty pre-filter, empty expansion, missing S2/S3 data)
- [ ] CHK-063 [P1] Full regression: all 158+ existing tests pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-070 [P1] Spec/plan/tasks synchronized
- [ ] CHK-071 [P1] Code comments adequate
- [ ] CHK-072 [P1] Feature flags documented
- [ ] CHK-073 [P1] Stage architecture documented in code
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
| P0 Items | 8 | [ ]/8 |
| P1 Items | 27 | [ ]/27 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 6 of 8
Sprint 5: Pipeline Refactor
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
