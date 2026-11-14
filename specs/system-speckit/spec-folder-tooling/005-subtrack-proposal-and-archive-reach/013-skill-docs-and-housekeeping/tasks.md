---
title: "Tasks: Phase 13: skill-docs-and-housekeeping"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skill docs and housekeeping tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: skill-docs-and-housekeeping

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

`S` is `.skilled/skills/system-spec-kit`. `C` is `$S/runtime/cli`. `PKT` is this packet's parent folder, `..`. Every Verify that names a saved file writes it in this folder's `scratch/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Write the per-root next-number command from the rule at `create.sh:1637-1661`, and re-read every cited line (`scratch/setup-notes.md`). Verify: the file names the command REQ-001 will publish and each In Scope line with its current number.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Publish the next-number command that counts archived packets (`$S/SKILL.md`). Verify: in a `mktemp` copy with `specs/demo/001-a` live and `specs/demo/z_archive/008-b` archived, the command for `specs/demo` prints 9, the number `create.sh --track demo --skip-branch` gives.
- [ ] T003 Add `relocate.mjs`, `suggest-subtracks.mjs` and `archive.sh` to the script list (`$S/SKILL.md`). Verify: `rg -n 'suggest-subtracks.mjs' $S/SKILL.md` prints a line in the script list.
- [ ] T004 State `archivedPaths` on the path recipe (`$S/references/retrieval/retrieval-conventions.md`). Verify: `rg -n 'archivedPaths' $S/references/retrieval/retrieval-conventions.md` prints a line.
- [ ] T005 Add the NNN-slug refusal as a fourth no-map case (`$S/references/structure/folder-structure.md`). Verify: `rg -n 'four cases' $S/references/structure/folder-structure.md` prints a line.
- [ ] T006 Say an archived phase counts when a new phase is numbered (`$S/references/structure/phase-definitions.md`). Verify: `rg -n 'z_archive' $S/references/structure/phase-definitions.md` prints the numbering sentence.
- [ ] T007 Add the mixed-track refusal and status 3 to the `archive.sh` row, and to the `relocate.mjs` row the untracked-stop limit and exit 3's narrowed condition (`$C/spec/README.md`). Verify: the two `archive.sh` row checks of REQ-002 each print a line, and `rg -n 'RESULT: FAILED' $C/spec/README.md` prints a line.
- [ ] T008 Add status 3 to the relocation summary (`$S/README.md`). Verify: `rg -n 'relocate.mjs.*(status 3|exits? 3)' $S/README.md` prints a line.
- [ ] T009 Write the `v2.13.1.0` entry and move the `SKILL.md` version (`$S/changelog/v2.13.1.0.md`). Verify: the file exists and `sed -n '5p' $S/SKILL.md` prints `version: 2.13.1.0`.
- [ ] T010 Add the untracked-stop limitation (`PKT/006-relocate-resume-and-preflight/implementation-summary.md`). Verify: `rg -n 'untracked' PKT/006-relocate-resume-and-preflight/implementation-summary.md` prints a line under Known Limitations.
- [ ] T011 Point each Verify clause that names a missing evidence file at the file that holds the evidence (`PKT/00[6-9]-*/tasks.md`, `PKT/010-*/tasks.md`). Verify: a loop over every `scratch/*.txt` name in those files finds each one with `ls`, or the clause no longer names it.
- [ ] T012 Confirm the continuity line (`PKT/decision-record.md`). Verify: `sed -n '13p' PKT/decision-record.md` names the id `rg -o '^\| Q[0-9]+' PKT/decision-record.md | tail -1` prints.
- [ ] T013 Add the three routing files to the manifest and review the phase 009 routing change (`scratch/routing-review.md`). Verify: `PKT/goal-file-manifest.txt` lists all three files, and the review file holds the `0701a31ae5` diff, three advisor runs with their top skill, and a verdict line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run the sk-doc skill, README and changelog validators on every changed skill document (`scratch/validators.txt`). Verify: each run in the file exits 0.
- [ ] T015 Run the advisor suite if T013 changed routing (`scratch/advisor-suite.txt`). Verify: the suite exits 0 with no failure absent from the baseline, or the file records that routing was not changed.
- [ ] T016 After the last edit, validate the parent and all its children as a regression gate (`PKT/spec.md`). Verify: `bash $C/spec/validate.sh PKT --strict --recursive` prints `RESULT: PASSED` 14 times.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every remaining row of both reviews is fixed or recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `../review/review-report.md` and `../review/fable-5-2-review.md`
<!-- /ANCHOR:cross-refs -->

---
