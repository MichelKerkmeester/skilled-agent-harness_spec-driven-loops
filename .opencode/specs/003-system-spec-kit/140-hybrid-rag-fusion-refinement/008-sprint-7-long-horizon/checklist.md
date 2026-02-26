---
title: "Verification Checklist: Sprint 7 — Long Horizon"
description: "Verification checklist for Sprint 7: memory summaries, content generation, entity linking, full reporting, R5 INT8 evaluation"
trigger_phrases:
  - "sprint 7 checklist"
  - "long horizon checklist"
  - "sprint 7 verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Sprint 7 — Long Horizon

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

- [ ] CHK-001 [P0] Sprint 6 exit gate verified — graph deepening complete
- [ ] CHK-002 [P1] Gating criteria measured: memory count (R8), latency/dimensions (R5)
- [ ] CHK-003 [P1] Prior sprint feature flags inventoried for sunset audit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P2] R13-S3 full reporting dashboard implemented
- [ ] CHK-011 [P2] R13-S3 ablation study framework functional
- [ ] CHK-012 [P3] R8 gating condition correctly evaluated (>5K memories)
- [ ] CHK-013 [P3] S1 content extraction improvements implemented
- [ ] CHK-014 [P3] S5 entity linking coordinates with R10 output
- [ ] CHK-015 [P3] R5 decision documented with measured activation criteria
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P2] R13-S3 full reporting operational — verified via test run
- [ ] CHK-021 [P2] R13-S3 ablation study framework functional — verified via test ablation
- [ ] CHK-022 [P3] R8 gating verified: only implemented if >5K memories
- [ ] CHK-023 [P3] S1 content generation quality improved (manual review)
- [ ] CHK-024 [P3] S5 entity links established across documents
- [ ] CHK-025 [P3] R5 decision documented with activation criteria
- [ ] CHK-026 [P1] All existing tests still pass after all changes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P3] R5 INT8 uses custom quantized BLOB (NOT `vec_quantize_i8`) — if implemented
- [ ] CHK-031 [P3] R5 preserves KL-divergence calibration from Spec 140 — if implemented
- [ ] CHK-032 [P2] R13-S3 ablation framework does not interfere with production retrieval
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized and reflect final implementation
- [ ] CHK-041 [P2] R5 decision documented with measured criteria and rationale
- [ ] CHK-042 [P2] Program completion documented — all sprints summarized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Sprint 7 findings saved to memory/
<!-- /ANCHOR:file-org -->

---

## Program Completion Gate

> **Note:** Sprint 7 is entirely optional (P2/P3 gated). The true program completion gate is Sprint 6 (graph deepening). Sprint 7 items activate only when gating criteria are met (>5K memories for R8, activation thresholds for R5). R13-S3 full reporting is the capstone of the evaluation infrastructure established in Sprint 1.

- [ ] CHK-060 [P1] R13-S3 full reporting operational — capstone of Sprint 1 eval infrastructure
- [ ] CHK-061 [P1] R13-S3 ablation study framework functional — required for program-level attribution reporting
- [ ] CHK-062 [P2] R8 gating verified: only implemented if >5K memories
- [ ] CHK-063 [P2] S1 content generation quality improved (manual review)
- [ ] CHK-064 [P2] S5 entity links established across documents
- [ ] CHK-065 [P2] R5 decision documented with activation criteria
- [ ] CHK-066 [P2] Program completion: all health dashboard targets reviewed
- [ ] CHK-067 [P2] Final feature flag audit: sunset all sprint-specific flags

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 1 | [ ]/1 |
| P1 Items | 8 | [ ]/8 |
| P2 Items | 14 | [ ]/14 |
| P3 Items | 10 | [ ]/10 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 8 of 8 (FINAL)
Program completion gate items
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Final sprint — includes program completion and flag sunset audit
-->
