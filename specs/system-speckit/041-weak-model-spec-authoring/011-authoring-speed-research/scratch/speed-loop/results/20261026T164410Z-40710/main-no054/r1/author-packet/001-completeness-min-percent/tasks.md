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

- [ ] T001 Record the baseline: run the existing vitest file and save the text and JSON stdout for one fixture packet (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T002 Confirm which variable holds the figure each reporter prints, and note that `output_text` keeps it in a function local (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Declare `MIN_PERCENT=""` beside the other option globals in section 3 (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T004 Add the `--min-percent` arm to the argument loop, testing `$#` before reading `$2` so `set -u` cannot abort on a missing value (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T005 Reject a non-integer and anything outside 0-100 with an `ERROR:` line on stderr and exit 1 before any file is read (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T006 Document the option and both exit statuses in `show_help` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T007 Replace the final `exit 0` with an explicit `if` that exits 3 below the threshold and 0 at or above it, reading the same figure the reporter printed (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T008 Add vitest cases for below, equal, above, invalid value, missing value, output equality and a missing `--file` target (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run the vitest file from `.skilled/skills/system-spec-kit/runtime` and confirm every case passes
- [ ] T010 Run the script with and without the flag on the same packet and confirm an empty `diff` for both the text and `--json` reports
- [ ] T011 Run `validate.sh --strict` on this packet and reconcile any deviation back into `spec.md` and `plan.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Threshold behavior demonstrated on a real packet: exit 3 below the threshold, exit 0 at or above it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Script under change**: `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`
<!-- /ANCHOR:cross-refs -->

---
