---
title: "Tasks: Triage and fix the README reference and derived-count check failures across the root and hub READMEs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "readme reference debt tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Triage and fix the README reference and derived-count check failures across the root and hub READMEs

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

`R` is `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` and `C` is `.skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record both checks on the 12 READMEs (`scratch/baseline-refs.txt`, `scratch/baseline-counts.txt`). Verify: the files end in `SUMMARY files=12 pass=0 fail=12`.
- [x] T002 Record both checks over all 977 tracked READMEs before any checker change. Verify: `SUMMARY files=977 pass=419 fail=558` and `pass=705 fail=272`.
- [x] T003 Group the 573 reference failures by token shape and read each group's lines. Verify: every failure carries one class in the tally in `implementation-summary.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Stop `R` reading slash commands, home paths, non-repo absolute paths, file types, slashed words without a suffix, `<placeholder>` tokens, shell assignments and quoted multi-word arguments as paths (`R`). Verify: `python3 R --self-test` prints `SELF-TEST PASS`.
- [x] T005 Resolve bare names from tracked names and `.tmpl` templates, skill-relative paths from the skill folder, `specs/` and runtime folders from the repository root, and fenced tree entries under their tree root (`R`). Verify: `python3 R --self-test` keeps the four broken-path cases failing.
- [x] T006 Count a number only when an agreeing count term follows in the same clause, skip labels, bounds and `one`, and derive a claim from a folder its sentence names (`C`). Verify: `python3 C --self-test` prints `SELF-TEST PASS`.
- [x] T007 Fix the README text: `checklist.md` to `acceptance-criteria.md`, two placeholders to `<...>` (`.skilled/skills/sk-doc/README.md`); the phase tree fence to `text example`, the value list to its skill path (`README.md`). Verify: `git diff --stat` shows 4 and 6 changed lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun both checks on the 12 READMEs (`scratch/after-refs.txt`, `scratch/after-counts.txt`). Verify: references `unresolved` totals 36, counts `failures` totals 4.
- [x] T009 Run old and new checkers over all 977 READMEs on one tree and diff failing lines. Verify: both diffs print `lines failing now on a line with no old failure: 0`.
- [x] T010 Validate each edited README (`README.md`, `.skilled/skills/sk-doc/README.md`). Verify: `validate_document.py` prints `VALID` and exits 0.
- [x] T011 Run the sk-doc script suite (`.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh`). Verify: 38 PASS; the one FAIL, `test_rename_tooling_fixture_harness.py`, comes from a file deleted in the working tree before this packet and is unrelated to the checkers; `test_validation_switch.py` passes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Follow-up

- [x] T012 Add a README-level `readme-check` block both checkers read: `allow-ref` and `allow-count` entries each suppress one exact token or phrase in that README, need a reason, and fail when unused (`R`, `C`). Verify: `python3 R --self-test` and `python3 C --self-test` print `SELF-TEST PASS`, with the marker-scope case leaving the broken path or count beside the marker failing.
- [x] T013 Add four absent-by-design classes to `R`: a path the tracked `.gitignore` excludes (not applied when the README's own folder is ignored), a bare `name.js` with a tracked `name.ts`, a hub path every child mode holds, and the two exact on-demand config tokens; skip an output flag's argument. Verify: `python3 R --self-test` keeps one ordinary missing path per class failing.
- [x] T014 Write the marker blocks in `README.md` and `.skilled/skills/sk-git/README.md`. Verify: both checks print `PASS` on each, and `validate_document.py` prints `VALID`, exit 0.
- [x] T015 Rerun both checks on the 12 READMEs (`scratch/followup-after-12.txt`). Verify: references `pass=10 fail=2`, counts `pass=10 fail=2`.
- [x] T016 Rerun old against new over every tracked README on one tree (`scratch/followup-regression-diff.txt`). Verify: `new_failing_lines=0 newly_failing_files=0` for both checks.
- [x] T017 Make `test_rename_tooling_fixture_harness.py` hermetic (sibling worker). Verify: the test alone runs 4 tests OK, and `run-script-tests.sh` exits 0 with 39 PASS.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: each remaining failure was read in context
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `specs/sk-doc/070-repo-doc-debt`
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
- [x] CHK-003 [P1] Dependencies identified and available: `git ls-files` runs in this checkout
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both checkers parse: `--self-test` runs to `SELF-TEST PASS`
- [x] CHK-011 [P0] No traceback in any checker run over 977 READMEs
- [x] CHK-012 [P1] A missing `git` result leaves a bare name unresolved, so it fails closed
- [x] CHK-013 [P1] Code follows the checkers' existing dataclass and function style, and comments carry no packet ids
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Each remaining failure line read in context with `sed -n`
- [x] CHK-022 [P1] Edge cases tested: stale tree root, `#` inside a folder name, placeholder folder in a tree
- [x] CHK-023 [P1] Broken paths still fail: untracked bare name, unanchored missing file, missing tree entry, machine path, stale named-folder count
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: the checker rules are `class-of-bug`, the README edits are `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class inventory: the repo-wide run over 977 READMEs is the producer inventory for each rule.
- [x] CHK-FIX-003 [P0] Consumer inventory: `test_validation_switch.py` is the only other caller of both checkers.
- [x] CHK-FIX-004 [P0] Path fixes carry adversarial cases: outside-root `/dev/null`, machine path `/Users/...`, `../` traversal still checked, stale tree root.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: reference kind by token shape.
- [x] CHK-FIX-006 [P1] Global state: the tracked-name cache is keyed by repository root and the self-test clears it after adding fixture files.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the uncommitted diff of the four files named in `spec.md`, against HEAD `bd57319633`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation: `git ls-files` takes the root as an argument list, never a shell string
- [x] CHK-032 [P1] Auth/authz: N/A, the checkers read local files only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Each checker's module docstring states the new rules
- [x] CHK-042 [P2] README updated: the two edited READMEs validate
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: baseline and after outputs, `regression-diff.txt`, `verification.txt`, and the follow-up's `followup-after-12.txt`, `followup-regression-diff.txt`, `followup-verification.txt`
- [x] CHK-051 [P1] scratch/ holds only those nine evidence files
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
