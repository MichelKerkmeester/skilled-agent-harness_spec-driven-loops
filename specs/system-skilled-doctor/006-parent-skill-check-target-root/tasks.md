---
title: "Tasks: parent-skill-check reads a hub's canary fixture, commands and guards from the hub's own repository"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "parent skill check target root tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: parent-skill-check reads a hub's canary fixture, commands and guards from the hub's own repository

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

`C` is `.skilled/commands/doctor/scripts/parent-skill-check.cjs`. `H` is `barter/ai-speckit/skilled/.skilled/skills/sk-code`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the canary failure (`C`). Verify: `node C H` prints 13 `FAIL: 5k-canary` lines and exits 1.
- [x] T002 Record a baseline for every Skilled hub (`.skilled/skills/*`). Verify: each of the 7 hubs exits 0 with 0 FAIL lines.
- [x] T003 Record the test baseline (`.skilled/commands/doctor/scripts/tests/parent-skill-check-*.test.cjs`). Verify: `node --test` prints `pass 114`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Split the checker root from the hub's data root (`C`). Verify: `rg -n "\bREPO_ROOT\b" C` prints nothing and `node --check C` exits 0.
- [x] T005 Name the hub's repository in the not-applicable line (`C`). Verify: the no-fixture test matches `in <project>, leg not applicable`.
- [x] T006 Add four tests for the hub's repository root (`.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs`). Verify: all four fail against the unfixed checker and pass against the fixed one.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rerun the reproduction (`C`). Verify: `node C H` prints `PASS: 5k-canary` and exits 0, 4b prints `registry declares no lexical modes`, and a `find -newer` scan of the project finds no new file.
- [x] T008 Rerun every Skilled hub (`.skilled/skills/*`). Verify: every PASS, FAIL and WARN line matches the baseline.
- [x] T009 Run the doctor test suite (`.skilled/commands/doctor/scripts/tests/*.test.cjs`). Verify: `node --test` prints `pass 1336` and `fail 0`.
- [x] T010 Say which root each lookup uses (`.skilled/commands/doctor/scripts/README.markdown`). Verify: `rg -n "repository that holds the hub" .skilled/commands/doctor/scripts/README.markdown` prints one line.
- [x] T011 Write the changelog entry (`.skilled/skills/system-skilled-doctor/changelog/v1.1.8.0.md`). Verify: `check_changelog_shape.py` prints `PASS` for it.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the reproduction exits 0 with `PASS: 5k-canary`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
