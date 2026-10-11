---
title: "Tasks: Post-merge deep review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "post merge deep review tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Post-merge deep review

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

- [x] T001 Scaffold the packet and add phase 12 to the parent map and goal (`spec.md`, `goal.md`)
- [x] T002 Initialize review state: config, run-open ledger event, registry, strategy with the focus plan, coverage seed (`review/`)
- [x] T003 Smoke the DevPass route with a one-turn PONG (`pi -p --offline --model llmgateway/deepseek-v4.1-flash`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run ten review iterations through the auto workflow steps (`review/iterations/`)
- [x] T005 [P] Rerun the known open items and the merge checks independently (`review/review-report.md`)
- [x] T006 Confirm or drop each executor finding by rerun or read (`review/review-report.md`)
- [x] T007 Write the review report with ranked recommendations (`review/review-report.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Check that no product file changed (`git status --short`)
- [x] T009 Strict-validate this packet and recursively validate the parent
- [x] T010 Fill `implementation-summary.md` and the goal log
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every goal criterion rerun and passing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



