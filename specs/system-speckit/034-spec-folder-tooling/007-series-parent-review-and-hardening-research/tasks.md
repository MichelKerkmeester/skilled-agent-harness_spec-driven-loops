---
title: "Tasks: Review and hardening research for the series parent rule"
description: "Setup, the two parallel deep loops and their synthesis, then verification of the reports and the packet."
trigger_phrases:
  - "series parent review tasks"
  - "series parent hardening research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Review and hardening research for the series parent rule

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

- [x] T001 Scaffold this phase under the 034 parent (`spec.md`)
- [x] T002 [P] Write and validate the review config, executor cli-pi DeepSeek V4.1 Flash, 3 iterations, max-iterations stop (`review/deep-review-config.json`)
- [x] T003 [P] Write and validate the research config, same executor, 10 iterations, max-iterations stop (`research/deep-research-config.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Run review iterations 1 to 3 (`review/iterations/`)
- [x] T005 [P] Run research iterations 1 to 10 (`research/iterations/`)
- [x] T006 Write the review report, verdict and planning packet (`review/review-report.md`)
- [x] T007 Write the research report with ranked recommendations (`research/research.md`)
- [x] T008 Record research closeout and the spec findings fence (`spec.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Every iteration passed `verify-iteration.cjs`
- [x] T010 Orchestrator opened every cited `file:line` in both reports
- [x] T011 `validate.sh --strict` returns `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
