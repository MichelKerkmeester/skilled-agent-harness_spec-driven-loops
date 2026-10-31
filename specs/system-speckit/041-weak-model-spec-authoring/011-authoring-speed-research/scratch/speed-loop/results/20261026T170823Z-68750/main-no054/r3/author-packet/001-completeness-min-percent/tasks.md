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

- [ ] T001 Capture a baseline: run the script against a known packet with no flags and save stdout, stderr and exit status for the later diff (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T002 Add `MIN_PERCENT=""` to the globals block beside `SINGLE_FILE` and `SPEC_FOLDER`, so `set -u` sees a defined variable on every path (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the `--min-percent` case arm to the argument loop, storing the value and shifting two arguments, matching the existing `--file` arm (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T004 Validate the stored value after the loop: a missing value, a non-integer, or a value outside 0 to 100 exits 1 with a stderr message naming the offending input, before any calculation runs (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T005 Reject `--min-percent` combined with `--file` with exit 1 and a message stating that the option requires a spec folder (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T006 Add the threshold gate after the `output_text` or `output_json` call and before the final `exit 0`: exit 3 when `OVERALL_PERCENTAGE` is below `MIN_PERCENT`, written as an explicit `if` so `set -e` is not tripped (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T007 Add the option and one example to `show_help`, and record exit 3 in the trailing exit-code comment block (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Diff the unflagged report against the T001 baseline and confirm stdout is byte-identical and the exit status is still 0 (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T009 Run the threshold matrix - below, equal, 0, 100, `--json`, `--verbose`, and no flag - recording the exit status of each run (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T010 Run the invalid-input cases - `abc`, `-1`, `101`, a trailing `--min-percent`, and `--file` with the flag - and confirm each exits 1 with a message on stderr and no report (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T011 Run the existing `calculate-completeness-script.vitest.ts` suite and confirm it passes without edits (`runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T012 Confirm `archive.sh` and `completion-state.cjs` still exit 0, since neither passes the new flag (`.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Report diff against the baseline shows no change
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

