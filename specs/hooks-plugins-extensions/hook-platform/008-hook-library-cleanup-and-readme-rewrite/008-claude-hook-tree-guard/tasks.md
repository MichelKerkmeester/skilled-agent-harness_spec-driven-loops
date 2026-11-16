---
title: "Tasks: Phase 8: claude-hook-tree-guard"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "claude hook tree guard tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: claude-hook-tree-guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/`. `CMD` is the first Stop command in `.claude/settings.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the failure with the real Stop command in a temp folder that holds only `.skilled/.labels` (`.claude/settings.json`). Verify: `bash -c "$CMD"` there prints `Cannot find module`.
- [x] T002 Record the test baseline (`R/../tests/hook-registration-sync.vitest.ts`, `.skilled/bin/tests/sync-claude-user-hooks.test.cjs`). Verify: 9 passed and pass 8.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the data-only `.skilled` case and the new guard string to the registry test (`.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts`). Verify: on the old registry it prints `expected '.skilled' to be '.skilled/hooks'` and 1 failed.
- [x] T004 Update the pinned guard string (`.skilled/bin/tests/sync-claude-user-hooks.test.cjs`). Verify: `grep -c "\[ -e .skilled/hooks \]" <file>` prints 1.
- [x] T005 Set Claude's `requireTree` to `.skilled/hooks` (`R/hook-registry.json`). Verify: `grep -n requireTree R/hook-registry.json` prints `.skilled/hooks`.
- [x] T006 Regenerate the registrations (`.claude/settings.json`). Verify: `grep -c "\[ -e .skilled/hooks \] || exit 0" .claude/settings.json` prints 36 and `grep -c "\[ -e .skilled \]"` prints 0.
- [x] T007 Correct the guard comment, the sync header and the README row (`R/sync-hook-registrations.cjs`, `.skilled/bin/sync-claude-user-hooks.mjs`, `.skilled/bin/README.md`). Verify: `node --check` passes on both scripts and `validate_document.py .skilled/bin/README.md` prints `VALID`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun both test files. Verify: 9 passed and pass 8, fail 0.
- [x] T009 Run both sync checks (`R`). Verify: each prints PASS.
- [x] T010 Rerun the reproduction in a data-only folder and in a folder with `.skilled/hooks`. Verify: the first exits 0 and prints nothing, the second prints the drift error.
- [x] T011 Run the quality gate over the changed files. Verify: `quality-gate.cjs` reports `NO_BLOCKER_FOUND` with 0 findings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the reproduction is silent in a data-only folder and still reports drift in a Skilled folder
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
