---
title: "Tasks: Phase 7: ci-rule-set-comparison"
description: "The task list for Phase 7: ci-rule-set-comparison, each task naming its file. Every task is open because the phase is planned, not built."
trigger_phrases:
  - "ci rule set comparison tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: ci-rule-set-comparison

<!-- SPECKIT_LEVEL: 2 -->

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
## Phase 1: Implementation

- [ ] T001 [P0] Extract rule names from the changed-packet validator output at base and head (`.github/workflows/changed-packet-validation.yml` lines 131-147)
- [ ] T002 [P0] Compare rule sets instead of verdicts to detect regressions (lines 131-147) (`.github/workflows/changed-packet-validation.yml`)
- [ ] T003 [P0] Add logic to detect when rule sets differ, even if both pass or both fail (lines 131-147) (`.github/workflows/changed-packet-validation.yml`)
- [ ] T004 [P0] Pass the previous sweep artifact as `--baseline` to the weekly sweep (line 56) (`.github/workflows/strict-pass-freshness-report.yml`)
- [ ] T005 [P0] Handle the case when no previous artifact exists (first run) (`.github/workflows/strict-pass-freshness-report.yml`)
- [ ] T006 [P1] Update the gate documentation with examples (`.github/workflows/README.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Verification

- [ ] T007 [P0] Create a test PR with a packet that fails different rules at base and head, verify it is reported as a regression
- [ ] T008 [P0] Run the weekly sweep with a baseline and verify it compares with the previous artifact
- [ ] T009 [P0] Verify the first run of the weekly sweep handles missing baseline gracefully
- [ ] T010 [P1] Verify the extraction and comparison logic with multiple failure scenarios
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1 tasks marked `[x]`
- [ ] All Phase 2 verification tasks marked `[x]`
- [ ] Acceptance criteria in `acceptance-criteria.md` show all rows passing
<!-- /ANCHOR:completion -->

---
