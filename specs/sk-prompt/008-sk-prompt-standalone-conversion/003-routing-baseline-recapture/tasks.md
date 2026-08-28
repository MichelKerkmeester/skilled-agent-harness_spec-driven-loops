---
title: "Tasks: Phase 3: routing-baseline-recapture"
description: "Ordered tasks for routing-baseline-recapture, each closed with recorded command evidence."
trigger_phrases:
  - "008 phase 003 tasks"
  - "routing-baseline-recapture tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: routing-baseline-recapture

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Observe the ratchet failing for the predicted reasons — evidence: `expected 55` versus `received 53` on holdout_top1.correct, and `expected 9 to be greater than or equal to 11` on delegationTotal
- [x] T002 Confirm which corpus the failure came from — evidence: `grep -c` on the labeled corpus returned 0 small-model rows; the two affected rows are in the holdout corpus
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove the two model-alias holdout rows — evidence: Row count 72 to 70; a case-insensitive search for the five model families returns 0
- [x] T004 Lower the delegation bucket minimum to the new fixture size — evidence: `DELEGATION_MIN_N` 11 to 9, matching the 9-case fixture
- [x] T005 Recapture the scorer-eval baseline — evidence: `capture-scorer-eval-baseline.mjs --write` wrote holdout 53/70, delegation 9/9 at accuracy 1.0, full corpus unchanged at 153/195
- [x] T006 Re-pin the drifted corpus hash — evidence: Holdout pin updated to the new sha256 with rows 72 to 70; the labeled and ambiguity pins were already correct and left untouched
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the ratchet — evidence: `Test Files 1 passed (1) | Tests 7 passed (7)`
- [x] T008 Run the CI hash-check loop — evidence: `corpus matches the pinned baseline hashes`, exit 0
- [x] T009 Run the scorer with the exact CI thresholds — evidence: `overall_pass: true`, `threshold_failures: []`
- [x] T010 Confirm the zero-headroom counts were not spent — evidence: Joint FT=3 and FF=1, identical to the phase-001 baseline
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — evidence: every task above carries a recorded command result
- [x] No `[B]` blocked tasks remaining — evidence: no task in this phase entered a blocked state
- [x] Manual verification passed — evidence: see the Verification table in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
