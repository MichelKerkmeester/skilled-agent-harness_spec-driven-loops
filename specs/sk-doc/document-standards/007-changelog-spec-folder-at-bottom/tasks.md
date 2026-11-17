---
title: "Tasks: Move the changelog spec-folder blockquote from under the summary to the end of the entry in the template and in every existing changelog"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "changelog spec folder at bottom tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Move the changelog spec-folder blockquote from under the summary to the end of the entry in the template and in every existing changelog

<!-- SPECKIT_LEVEL: 2 -->

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

`M` is `scratch/move_spec_block.py`. `F` is `scratch/changelog-files.txt`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 List every changelog with a spec-folder line (`F`). Verify: `wc -l F` prints 2815.
- [x] T002 Record the gate baseline over the 1,181 `.skilled` changelogs. Verify: 264 pass both gates and 917 fail only the shape gate.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write and dry-run the script (`M`). Verify: `python3 M F` prints `{'moved': 2795, 'spec lines': 19, 'already last': 1}`.
- [x] T004 Apply it. Verify: a second dry run prints `{'already last': 2796, 'spec lines': 19}`.
- [x] T005 Move the blocks in the 19 multi-block files with Hy4 Flash Free at high, on copies. Verify: all 19 runs exit 0.
- [x] T006 Put the blockquote last in the template, the SKILL.md contract and the worked example. Verify: `validate_document.py` reports 0 issues on each.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Check the 19 Hy4 outputs against their inputs. Verify: same lines apart from blank and `&nbsp;` lines, and each block last in its section.
- [x] T008 Rerun both gates and diff against the baseline. Verify: `diff before.txt after.txt` prints nothing.
- [x] T009 Validate the packet. Verify: `validate.sh <packet> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the gate results diff clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Every changelog is tracked with no local edits, so git can undo the run. `git ls-files -m` and `--others` over `F` printed 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `M` runs clean in dry-run and apply modes
- [x] CHK-011 [P0] `M` is idempotent: a second run moves nothing
- [x] CHK-012 [P1] `M` skips a fenced spec line and a multi-block file instead of guessing
- [x] CHK-013 [P1] A quote line above the spec line, such as a release link, stays in place
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] One sample per block shape diffed by hand before apply
- [x] CHK-022 [P1] The quote-above case failed first and passed after the fix
- [x] CHK-023 [P1] One Hy4 output was misplaced, and was corrected by hand
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A. The packet changes a format and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] N/A. The script reads and writes local Markdown only and holds no credential.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same 2,815 files and the same position
- [x] CHK-041 [P1] The template, SKILL.md and worked example agree on the position
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The script and file list live in `scratch/` only
- [x] CHK-051 [P1] `scratch/` keeps only the script and its file list, the record of how the migration ran
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-17
<!-- /ANCHOR:summary -->

---
