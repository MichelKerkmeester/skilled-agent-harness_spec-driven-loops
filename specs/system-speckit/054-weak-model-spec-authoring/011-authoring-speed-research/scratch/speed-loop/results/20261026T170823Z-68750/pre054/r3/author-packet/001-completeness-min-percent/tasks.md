---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "completeness min percent tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the current script end to end and confirm the argument loop, the two percentage variables and the final `exit 0` are the only surfaces the change touches (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T002 Capture baseline stdout for a folder in default, `--verbose` and `--json` modes, and for a `--file` run, saving each to a scratch file for the parity diff (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/`)
- [ ] T003 Record the baseline exit status of a normal run and confirm it is 0 (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/`)
- [ ] T004 Build two fixture packets in a temporary directory: one reporting a known low percentage, one reporting 100% (temporary directory outside the repository)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the `MIN_PERCENT` global beside `VERBOSE`, `JSON_OUTPUT`, `QUALITY_CHECK` and `SINGLE_FILE`, defaulting to empty so an absent option is distinguishable from a passed `0` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T006 Add the `--min-percent` arm to the argument `case`: reject a missing next argument, then store the value and `shift 2` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T007 Add the range and integer check for the stored value, printing `ERROR: --min-percent must be an integer between 0 and 100` to stderr followed by the usage hint and `exit 1` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T008 Document the option in `show_help`, stating the range and that exit status 3 means the reported percentage fell below it (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T009 Add the exit gate after the output function returns: resolve the reported percentage for folder or `--file` mode, compare it inside an `if` block so a failing test cannot trip `set -e`, and exit 3 on a shortfall (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run `bash -n` on the script and confirm it parses; run `shellcheck` if it is installed and resolve anything it reports (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T011 Diff stdout against the T002 baselines for default, `--verbose`, `--json` and `--file`, each run with `--min-percent 50` added, and confirm every diff is empty (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T012 Verify the threshold boundary on the low fixture: an `N` above the reported percentage exits 3, an `N` equal to it exits 0, an `N` below it exits 0 (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T013 Verify the 100% fixture exits 0 at `--min-percent 100`, and that a folder with a remaining placeholder exits 3 at the same threshold (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T014 Verify `--min-percent` with no value, `abc`, `-1` and `101` each exit 1 with a stderr message and print no report (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T015 Verify `--json --min-percent`, `--verbose --min-percent` and `--quality --min-percent` return the same status as the corresponding text run (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T016 Confirm a run with no `--min-percent` still exits 0 and that `--help` lists the new option (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T017 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-completeness-min-percent --strict` and require `RESULT: PASSED` (`specs/zz-bench-authoring/001-completeness-min-percent/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
