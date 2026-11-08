---
title: "Tasks: Phase 4: doctor-symlink-gaps"
description: "Ordered tasks for the doctor symlink gaps: baseline, the P2-10b test and decision comment, the whole-link doc notes, the 044 limitation fix and the rerun of both doctor test files."
trigger_phrases:
  - "doctor symlink gaps tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: doctor-symlink-gaps

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`D` is `.skilled/commands/doctor`. `T` is the test command in `plan.md` section 5, run from the repository root.

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

- [x] T001 Record the baseline pass and fail counts of both test files in `T` (`scratch/baseline.txt`). Verify: `cat scratch/baseline.txt` shows one total per file.
  - Evidence: `scratch/baseline.txt` records `symlink-engine.test.cjs` 16/0 and `doctor-symlink-contract.test.cjs` 34/0 (50/0 combined), the packet vitest suite at 178/0 across 10 files, and validate `RESULT: PASSED` at HEAD `230d22ba88`.
- [x] T002 Record the operator's answers to D-004a and D-004b (`spec.md` section 7). Verify: `rg -n 'Status: answered' spec.md` prints two lines.
  - Evidence: both lines now carry `Decided 2026-11-07 by operator`; D-004a took the recommended Option B (document and pin) and D-004b took the recommended document-only answer.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the P2-10b case beside the specs-alias cases: plan a host that has a `specs/` folder and assert the plan's ignore entries for `.skilled/specs` in the direction D-004a chose (`D/scripts/tests/symlink-engine.test.cjs`). Verify: under Option A the case fails on the unchanged engine with the entry absent, and under Option B it passes, by design, because it pins existing behavior.
  - Evidence: `scratch/red-host-relative-ignore.log` holds the negative control: the same case with the Option A expectation failed on the unchanged engine (`false !== true`), and its plan line shows the alias missing from `ignore-add`. The chosen Option B assertion then passed on the unchanged engine at 17/17 (`scratch/green-before-comment.log`); the phase's Option B case cannot be failing-first, as D-004a says.
- [x] T004 Apply D-004a at the host-relative branch: a comment stating why the alias is not ignored (Option B), or the `ignoreCandidates.push` (Option A) (`D/scripts/symlink-engine.cjs`). Verify: the T003 case passes, and `rg -n 'host-relative' D/scripts/symlink-engine.cjs` shows the comment inside lines 814-822.
  - Evidence: the comment sits at `symlink-engine.cjs:820` and names the portable relative text as the reason it stays out of the ignore file. `scratch/green-host-relative-ignore.log` shows 17/17 after the comment.
- [x] T005 [P] Add the whole-link sentence to the `linked-whole` row and the `--mode` row (`D/assets/doctor-symlink-presentation.txt`, `D/symlink.md`). Verify: `rg -n 'specs' D/assets/doctor-symlink-presentation.txt D/symlink.md` prints the new sentence in both files, and before the edit it printed no match for it.
  - Evidence: `scratch/doc-pre-edit.log` shows both rows without the sentence at HEAD, and `scratch/doc-rows.log` shows it in the `linked-whole` row (presentation line 87) and the `--mode` row (`symlink.md:60`) after the edit.
- [x] T006 [P] Correct the Known Limitations item about the `.skilled/` shape so it states that a whole-linked `.skilled` reads the checkout's `specs/` (`specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md`). Verify: `rg -n 'whole' implementation-summary.md` prints the item with `specs/` named, and the item sits in the limitations list, not at the line the review cites unless that line holds it.
  - Evidence: `scratch/doc-pre-edit.log` shows the old item 3 without the `specs/` consequence; `scratch/limitation-row.log` shows the corrected item 3 at line 131. The review's line 130 holds item 2, so item 3 was the one corrected.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run `T` and the doctor mirror checks after the doc edit (`D/scripts/tests/`). Verify: `T` prints zero failures and the baseline totals plus the new case, and `node --test D/scripts/tests/command-catalog-mirror-check.test.cjs` exits 0.
  - Evidence: `scratch/doctor-suite.log` shows 64/64 pass and exit 0 across the two required files plus the mirror check. The two required files move from 50/50 to 51/51 with the one new case; the mirror check contributes the other 13.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/doctor-suite.log` 64/64, `scratch/vitest-suite.log` 10 files 182/182, and validate `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
