---
title: "Tasks: Phase 9: rename-rule-and-test-root-fixes"
description: "Ordered tasks for the historical locator rule, two shell test root fixes and the v2.12.45.0 release entry, with supplied verification results recorded as evidence."
trigger_phrases:
  - "rename rule and test root fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: rename-rule-and-test-root-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

`R` is `.skilled/skills/system-spec-kit/references/workflows/rename-pattern.md`. `T` is `.skilled/skills/system-spec-kit/runtime/cli/tests/`.

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the Phase 8 origin and approval date (`spec.md`). Verify: `rg -n '174 packets|ten spec tracks|2026-11-10' spec.md` prints the origin and approval lines. Evidence: the supplied facts identify the regrouping, moved-packet count and approval date.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T002 Update the `Historical spec docs` row with the approved live-locator exception (`R`). Verify: `rg -n 'PRESERVE the content. Update a moved path only where it acts as a live locator and the link check would otherwise fail' R` prints the row. Evidence: the approved wording preserves content and allows only the specified moved-path update.
- [x] T003 Add one `/..` to the `REPO` line (`T/fingerprint-docset-generation.sh`). Verify: the supplied completed result is 7 passed and 0 failed. Evidence: before the fix, 4 passed and 3 failed because the validator path did not exist and counts read 0. After the fix, the supplied result is 7 passed and 0 failed.
- [x] T004 Add one `/..` to the `REPO` line (`T/graph-metadata-write-containment.sh`). Verify: the supplied completed result is 7 passed and 0 failed, with one skip for `symlinked sibling-repo track, none present`. Evidence: before the fix it reported `SKIP: compiled parser absent` on every run. The supplied after result includes the one named skip.
- [x] T005 Add the `v2.12.45.0` changelog entry (`.skilled/skills/system-spec-kit/changelog/v2.12.45.0.md`). Verify: `check_changelog_shape.py` prints `PASS`. Evidence: the supplied shape-check result is `PASS`.
- [x] T006 Raise the system-spec-kit version to `2.12.45.0` (`.skilled/skills/system-spec-kit/SKILL.md`). Verify: `rg -n '2.12.45.0' .skilled/skills/system-spec-kit/SKILL.md` prints the version line. Evidence: the supplied change raises it from `2.12.44.0` to `2.12.45.0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T007 Confirm the completed fingerprint test result (`T/fingerprint-docset-generation.sh`). Verify: the supplied result is 7 passed and 0 failed. Evidence: its baseline was 4 passed and 3 failed, with the same three failures on the pre-regroup layout.
- [x] T008 Confirm the completed graph containment test result (`T/graph-metadata-write-containment.sh`). Verify: the supplied result is 7 passed and 0 failed, with one skipped sibling-repo case. Evidence: the skip is `symlinked sibling-repo track, none present`.
- [x] T009 Confirm changelog shape (`.skilled/skills/system-spec-kit/changelog/v2.12.45.0.md`). Verify: `check_changelog_shape.py` prints `PASS`. Evidence: the supplied result is `PASS`.
- [x] T010 Validate this packet (`specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/009-rename-rule-and-test-root-fixes`). Verify: `validate.sh` with `--strict` prints `RESULT: PASSED`. Evidence: final-state validation is recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Supplied shell-test and changelog-check results are recorded with evidence
- [x] Strict validation prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



