---
title: "Tasks: Phase 6: remediation-deep-review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "remediation deep review tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: remediation-deep-review

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

- [x] T001 Scaffold the child with `create.sh --phase --parent` and add its parent binding row
- [x] T002 Initialize `review/`: config, ledger run-open event, findings registry, strategy, coverage graph seed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run five iterations on cli-pi DeepSeek V4.1 Flash at max, one focus each: hook deadlines, Webflow and drift guard, doc pointers and claims, versions and hygiene, security and regressions
- [x] T004 [P] Rerun each new test against a pre-fix copy of its hook
- [x] T005 [P] Rerun every neighbouring suite, the drift guards, the route guard, Hermes `--check` and the trigger index `--check`
- [x] T006 Prove or refute each iteration finding, then write `review/review-report.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm five iteration records and five cli-pi completion receipts
- [x] T008 Run strict validation on this phase and recursively on the 012 parent
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



