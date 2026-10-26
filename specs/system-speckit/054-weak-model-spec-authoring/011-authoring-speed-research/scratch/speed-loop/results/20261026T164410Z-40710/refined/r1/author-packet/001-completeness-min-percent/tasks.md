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

Two shell variables shorten the verify commands. Set them once in the shell first:

| Variable | Value |
|----------|-------|
| `S` | `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` |
| `P` | `specs/zz-bench-authoring/001-completeness-min-percent` |

`F` is the fixture folder, `$P/scratch/fixture-low`. Every write stays inside `$P/scratch/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Reproduce the unparsed flag (`$S`). Verify: `bash $S --min-percent 90 $P` prints `ERROR: Unexpected argument: 90` and exits 1.
- [ ] T002 Build the 86% fixture, 18 plain lines plus three placeholder lines (`$F/spec.md`). Verify: `bash $S $F | grep 'Overall Completion'` prints `Overall Completion: 86%`.
- [ ] T003 Capture the packet's current report as the comparison baseline (`$P/scratch/baseline.txt`). Verify: `bash $S $P > $P/scratch/baseline.txt` exits 0 and `wc -l < $P/scratch/baseline.txt` prints a number greater than 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a `--min-percent` branch to the option loop with a missing-value guard (`$S`). Verify: `bash $S --min-percent` prints an error and exits 1 instead of failing on an unbound variable.
- [ ] T005 Validate N as an integer from 0 to 100 and reject everything else (`$S`). Verify: `bash $S --min-percent abc $P` and `bash $S --min-percent 101 $P` each exit 1.
- [ ] T006 Compare the reported percentage against N after the report and exit 3 when it is lower (`$S`). Verify: `bash $S --min-percent 90 $F` exits 3 and `bash $S --min-percent 50 $F` exits 0.
- [ ] T007 Document the option in `--help` and exit code 3 in the footer comment (`$S`). Verify: `bash $S --help | grep -- '--min-percent'` prints one line and `rg -n '^#   3 - ' $S` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Prove the text report is unchanged by the option (`$S`). Verify: `diff <(bash $S --min-percent 90 $P) $P/scratch/baseline.txt` prints nothing.
- [ ] T009 Prove the JSON report is unchanged by the option (`$S`). Verify: `diff <(bash $S --json --min-percent 90 $F) <(bash $S --json $F)` prints nothing.
- [ ] T010 Prove the comparison also covers `--file` mode (`$S`). Verify: `bash $S --file $F/spec.md --min-percent 90` exits 3 and `bash $S --file $F/spec.md --min-percent 80` exits 0.
- [ ] T011 Check the script still parses under Bash 3.2 syntax rules (`$S`). Verify: `bash -n $S` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `--min-percent 90` exits 3 on the 86% fixture and 0 on the packet, with the report unchanged in both text and JSON
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
