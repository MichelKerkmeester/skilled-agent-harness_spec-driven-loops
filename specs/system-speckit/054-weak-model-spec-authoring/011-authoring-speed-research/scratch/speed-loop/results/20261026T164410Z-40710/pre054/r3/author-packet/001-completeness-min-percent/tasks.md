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

- [ ] T001 Capture the baseline: run the script on a fixture folder and record stdout, stderr and exit `0` for both the text and `--json` forms (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T002 Add failing cases for the threshold, the invalid values and output stability to the existing suite (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the `--min-percent` branch to the argument loop, guarding `$#` before reading `$2` so a bare trailing flag reports a usage error instead of tripping `set -u` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T004 Validate the value as an integer in 0-100 beside the existing startup guards, exiting `1` with a message on stderr when it fails (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T005 Select the reported completion: `OVERALL_PERCENTAGE` for a folder run, the re-sourced per-file `percentage` for a `--file` run (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T006 Replace the unconditional `exit 0` with the gate: exit `3` when the selected completion is below `MIN_PERCENT`, `0` otherwise, after the report has been written (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T007 Document the option in `show_help` and add exit code `3` to the header's exit-code comment block (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run `bash -n` on the script and the vitest suite for it, confirming the new cases pass and the pre-existing ones still do (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T009 Diff the text and JSON reports produced with and without `--min-percent` against the T001 baseline and confirm both are empty (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T010 Exercise the boundary by hand: a value one above the reported completion exits `3`, the reported value itself exits `0`, and `0` exits `0` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T011 Record the delivered behavior, the decisions from `plan.md` §3 and the verification results (`specs/zz-bench-authoring/001-completeness-min-percent/implementation-summary.md`)
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
