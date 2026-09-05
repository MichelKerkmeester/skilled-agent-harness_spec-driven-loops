---
title: "Tasks: deep-loop-test-debt"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "deep loop test debt"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: deep-loop-test-debt

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

- [ ] T001 Baseline: run the deep-loop runtime vitest suite and `tsc --noEmit`; record every failing file and error count (`.opencode/skills/system-deep-loop/runtime`)
- [ ] T002 Baseline: run the four named spec-kit CLI tests under the projects config and capture the failure text (`.opencode/skills/system-spec-kit/runtime/cli/tests`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Fix the council persist-artifacts containment check and fixture vantage at the producer (`.opencode/skills/system-deep-loop/runtime/lib/ai-council/`)
- [ ] T004 [P] Make the review reducer throw a descriptive error when a machine-owned strategy anchor is missing (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/`)
- [ ] T005 [P] Expose restart as a first-class auto setup input in the deep-review command contract, or report the contract conflict (`.opencode/commands/deep/review.md`)
- [ ] T006 Clear the runtime typecheck errors without changing runtime behavior (`.opencode/skills/system-deep-loop/runtime`)
- [ ] T007 Fix the remaining red files from the T001 baseline at their producers
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Rerun each named test and the whole deep-loop suite; all green
- [ ] T009 Rerun `tsc --noEmit`; exit 0
- [ ] T010 Record each test, root cause, and fix in `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
