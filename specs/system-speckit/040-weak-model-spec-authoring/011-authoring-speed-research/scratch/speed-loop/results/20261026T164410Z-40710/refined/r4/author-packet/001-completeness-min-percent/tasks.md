---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "completeness min percent tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Add a min-percent option to calculate-completeness.sh

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

Two shell variables appear below. `S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. `D` is a one-file fixture folder holding three `[TODO: ...]` markers and four content lines, which the script scores at `Overall Completion: 25%`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Build the 25% fixture and record the current behavior (`$D`). Verify: `bash "$S" "$D"` prints `Overall Completion: 25%` and exits 0.
- [ ] T002 Confirm the option is absent today (`$S`). Verify: `bash "$S" --min-percent 90 "$D"` prints `ERROR: Unexpected argument: 90` and exits 1.
- [ ] T003 [P] Confirm the existing suite is green (`tests/calculate-completeness-script.vitest.ts`). Verify: `npx vitest run tests/calculate-completeness-script.vitest.ts --config ../vitest.config.ts --root .` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Declare the threshold global beside the other option globals (`$S`). Verify: `rg -n 'MIN_PERCENT=' "$S"` prints the empty default declaration.
- [ ] T005 Add the `--min-percent` case to the argument loop with a value validation that exits 1 on a missing, non-integer or out-of-range value (`$S`). Verify: `bash "$S" --min-percent` with no value, `--min-percent abc`, `--min-percent -1` and `--min-percent 101` each print an error and exit 1.
- [ ] T006 Compare the reported integer against the threshold after the output call and exit 3 when it is lower (`$S`). Verify: `bash "$S" --min-percent 90 "$D"` still prints the full report and exits 3.
- [ ] T007 Add the `--min-percent <N>` line to `show_help` and record exit 3 in the trailing exit-code comment block (`$S`). Verify: `bash "$S" --help` prints the `--min-percent <N>` line, and `rg -n 'below --min-percent threshold' "$S"` prints one line.
- [ ] T008 Add vitest cases for exit 3 below the threshold, exit 0 at and above it, and exit 1 for an invalid value (`tests/calculate-completeness-script.vitest.ts`). Verify: `npx vitest run tests/calculate-completeness-script.vitest.ts --config ../vitest.config.ts --root .` exits 0 with the new cases listed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Capture both reports on one folder and diff them (`$S`). Verify: `diff` of the `--min-percent 50` capture and the plain capture prints nothing, with exit statuses 3 and 0.
- [ ] T010 Check the boundary where the threshold equals the printed percentage (`$S`). Verify: `bash "$S" --min-percent 25 "$D"` exits 0 and `bash "$S" --min-percent 26 "$D"` exits 3.
- [ ] T011 Check the `--file` path (`$S`). Verify: `bash "$S" --file "$D/spec.md" --min-percent 90` prints the single-file report and exits 3.
- [ ] T012 Run the whole cli test project (`runtime/cli`). Verify: `npm test` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The two captured reports are byte-identical and the gate exits 3 on the 25% fixture
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
