---
title: "Tasks: Phase 8: readme-html-conventions"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "readme html conventions tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: readme-html-conventions

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Count alerts and folds in the 905 tracked READMEs (`git ls-files '*README.md'`). Verify: the counts print. Evidence: 0 files with an alert, 1 with `<details>`.
- [x] T002 Scan every tracked `.md` file for broken folds, tags alone on their line, outside fences. Verify: the scan prints its counts. Evidence: `{'live': 113, 'folds': 677, 'specs': 144}`, with 0 broken live folds.
- [x] T003 Show the gap on a probe copy of `.claude/hooks/README.md` with `<details>` never closed (`scratch` of this session). Verify: `validate_document.py --type readme` prints `VALID`. Evidence: `✅ VALID`, `Total issues: 0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the Alerts and Folded Tables rule (`references/readme/writing-patterns.md`). Verify: `rg -n 'Alerts and Folded Tables' writing-patterns.md` prints one line. Evidence: the subsection sits in §3 before Blockquote Tagline.
- [x] T005 Add the checklist line (`references/readme/quality-and-checklist.md`). Verify: `rg -n 'WARNING\]` alert marks only' quality-and-checklist.md` prints one line. Evidence: the line closes the Style list.
- [x] T006 Add `validate_folds` and call it for every document type (`shared/scripts/validate_document.py`). Verify: `python3 -m py_compile` exits 0. Evidence: the unclosed probe now prints `❌ INVALID` with `[fold_unclosed]`.
- [x] T007 Add three tests (`scripts/tests/test_structure_validation.py`). Verify: pytest on the file passes. Evidence: `12 passed`.
- [x] T008 [P] Turn the hand-edit warnings into alerts (`.codex/SYNC.md`, `.devin/SYNC.md`). Verify: `rg -n 'WARNING' ` on each prints one line. Evidence: each KNOWN GAPS section opens with the alert.
- [x] T009 [P] Fold the entry maps (`.claude/hooks/README.md`, `.devin/hooks/README.md`). Verify: each holds one `<details>` with a `<summary>` line. Evidence: `All 33 entries` and `All 29 entries`, with the intro sentence above each fold.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Gate the four pilot files. Verify: each prints `VALID` with 0 hard voice blockers and both README checkers pass. Evidence: 4 `✅ VALID`, `hard blockers: 0` and ceiling 100/100 on each, both checkers `SUMMARY files=4 pass=4 fail=0`, `readme_links.py` `0 problems`. A bad path put inside the fold failed `check_readme_references.py`, and the restored file passed.
- [x] T011 Render the pilot files through GitHub (`gh api markdown`). Verify: the alert and the folded table appear. Evidence: `markdown-alert markdown-alert-warning` in the SYNC render, and `<details>` holding `<summary>All 33 entries</summary>` and a table of 34 rows in the hooks render. A fold with no blank line after `<summary>` rendered its table as raw pipes.
- [x] T012 Run the fold check over every tracked `.md` file, then the suite, parity and links. Verify: 0 fold issues and every gate exits 0. Evidence: 64,445 files, 0 issues. `all sk-doc script tests passed`, 58 PASS, exit 0. `PARITY PASS`. `0 broken markdown links`.
- [x] T013 Validate the phase (`008-readme-html-conventions/`). Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED` on the phase and on the program recursively.
- [ ] T014 Commit, merge origin/main and push under sk-git. Verify: `git rev-parse HEAD origin/main` prints the same hash twice.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the GitHub render shows the alert and the fold
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: the Architecture section
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `gh api markdown` answered both renders
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `py_compile` exits 0 and the sk-doc suite passes
- [x] CHK-011 [P0] No console errors or warnings. Evidence: pytest prints `12 passed` and nothing else
- [x] CHK-012 [P1] Error handling implemented. Evidence: each broken shape reports one blocking issue with a fix hint, tested per rule id
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the check sits beside `validate_general_structure`, reuses `_fenced_line_numbers` and uses the `blocking` severity
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: every row in `acceptance-criteria.md` is Met
- [x] CHK-021 [P0] Manual testing complete. Evidence: T011
- [x] CHK-022 [P1] Edge cases tested. Evidence: a fenced fold, `<details>` in inline code and a one-line fold all pass
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the four broken shapes each report their rule id
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: `class-of-bug`, since any document can hold a broken fold
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: the fold scan over every tracked `.md` file, T002 and T012
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: the two README checkers read fold rows, proven by the bad-path control in T010
- [x] CHK-FIX-004 [P0] Parser fixes include adversarial cases. Evidence: fence, inline code, one-line fold, stray close and a missing summary are each tested or scanned
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed. Evidence: four broken shapes and three non-fold shapes, seven rows
- [x] CHK-FIX-006 [P1] Hostile env variant executed when code reads process-wide state. Evidence: not applicable, `validate_folds` reads only the text it is given
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the diff holds no key, token or path outside the repository
- [x] CHK-031 [P0] Input validation implemented. Evidence: the check reads lines only and never runs or loads what it reads
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: not applicable, no access control is involved
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all three name the same four pilot files and the same check
- [x] CHK-041 [P1] Code comments adequate. Evidence: the `validate_folds` docstring says why each shape blocks
- [x] CHK-042 [P2] README updated (if applicable). Evidence: the four pilot files are the README change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: probes and renders sit in the session scratchpad, not the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: the packet `scratch/` holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-18
<!-- /ANCHOR:summary -->

---
