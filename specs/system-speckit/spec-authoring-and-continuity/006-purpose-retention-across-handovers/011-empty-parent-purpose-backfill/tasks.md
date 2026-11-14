---
title: "Tasks: Phase 11: empty-parent-purpose-backfill"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "empty parent purpose backfill tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: empty-parent-purpose-backfill

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

Shell variables, set from the worktree root before the first task:
- `C=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/011-empty-parent-purpose-backfill`
- `RT=.skilled/skills/system-spec-kit/runtime`

`plan.md` section 3 holds the rule for writing each sentence and where it goes. Every `Verify:` runs from the worktree root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Build the runtime and capture the purpose baseline (`$C/scratch/check-backfill.mjs`). Verify: `(cd $RT && npm run build)` exits 0, then `node $C/scratch/check-backfill.mjs | tail -1` prints `own purpose: 0 of 21`.
- [ ] T002 Capture a strict-validate baseline for each parent (`$C/scratch/parents.txt`). Verify: for each `spec.md` path in the list, `CI=1 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <its folder> --strict` prints a first `Summary` line, and all 21 lines are copied into `$C/scratch/validate-baseline.txt`.
- [ ] T003 Confirm the two file shapes (`$C/scratch/parents.txt`). Verify: `rg -c '^### Purpose\s*$'` prints `1` for each of the ten files under the placeholder heading in the list, and prints nothing for the eleven under the no-purpose-text heading.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T004 Write the 21 sentences (`$C/scratch/sentences.md`). Verify: the file holds 21 sections, one per folder in the list, each with the sentence and the files read, and `rg -c '—' $C/scratch/sentences.md` prints nothing.
- [ ] T005 Apply the ten placeholder replacements (the ten files under the placeholder heading in `$C/scratch/parents.txt`). Verify: for each file, the line after `### Purpose` is its sentence from `sentences.md` and `rg -c '^\[' <file>` prints no more than before.
- [ ] T006 Insert the eleven new purpose blocks (the eleven files under the no-purpose-text heading). Verify: for each file, `rg -c '^### Purpose\s*$' <file>` prints `1` and the next line is its sentence from `sentences.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T007 REQ-001: every parent shows its own purpose (`$C/scratch/check-backfill.mjs`). Verify: `node $C/scratch/check-backfill.mjs` prints `packet` on all 21 folder lines and `own purpose: 21 of 21`.
- [ ] T008 REQ-002: no parent validates worse (`$C/scratch/validate-baseline.txt`). Verify: each T002 command prints a first `Summary` line with no more errors or warnings than its baseline line.
- [ ] T009 Confirm only the 21 files changed (`git status`). Verify: `git status --short` lists the 21 `spec.md` files and this packet's own docs, and nothing else.
- [ ] T010 REQ-003: the operator approves the sentences (`$C/scratch/sentences.md`). Verify: the operator's answer is recorded in `implementation-summary.md`. This task is the operator's, and the phase is not committed before it.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



