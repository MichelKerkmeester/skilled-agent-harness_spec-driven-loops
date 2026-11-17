---
title: "Tasks: Phase 54: handover-review-remediation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "handover review remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 54: handover-review-remediation

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`H` is `.skilled/hooks/session-handover/`. Every edit ran as a literal brief on Vibe `deepseek-flash`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the five withdraw copies and the cited doc lines. Verify: OpenCode and Pi end in a bare `catch` that logs nothing.
- [x] T002 Baseline both suites with the loop variables removed. Verify: node prints `pass 1051` and `fail 0`, vitest prints `509 passed`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Correct `state-files.md`, `troubleshooting.md` and `history/README.md` (`H`). Verify: each new line greps once.
- [x] T004 Add `withdrawOnPrompt` and four tests (`H/lib/withdraw.cjs`, `H/tests/withdraw.test.cjs`). Verify: the test file prints `pass 9` and `fail 0`.
- [x] T005 Point the Claude, Codex, Vibe and OpenCode adapters at the helper. Verify: `node --check` exits 0 for each and none calls `withdrawHandOver`.
- [x] T006 Point the Pi adapter at the helper and drop its own logger (`H/pi/session-handover.ts`). Verify: `tsc` reports the same single pre-existing error as the original.
- [x] T007 Name the helper in `H/lib/README.md` and `H/handoff-protocol.md`. Verify: each greps `withdrawOnPrompt` once.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the node suite (`H/tests/*.test.cjs`). Verify: prints `pass 1055` and `fail 0`.
- [x] T009 Run the hooks vitest config. Verify: prints `509 passed`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every diff read line by line against its brief
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `../053-handover-and-history-deep-review/review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---
