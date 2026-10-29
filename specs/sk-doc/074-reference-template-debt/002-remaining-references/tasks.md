---
title: "Tasks: Phase 2: remaining-references"
description: "Ordered tasks and verification checklist for remaining-references."
trigger_phrases:
  - "remaining references tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: remaining-references

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

- [x] T001 Rerun the validator over all 454 tracked references. Verify: `validate-all.py` prints 389 OK, 61 FAIL and 4 SKIPPED
- [x] T002 Split the 27 failures outside sk-design-diagram into fix and exempt. Verify: 22 files go to `phase2-files.txt` and the four sample `DESIGN.md` files plus `design-md-format.md` stay as exemption candidates
- [x] T003 Capture the routing baseline (`leaf-route-replay.cjs --report`). Verify: the totals line reads `gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write `scratch/edits.json` for the citations the script cannot place. Verify: it holds 23 entries that expand to 33 number pairs
- [x] T005 Run the script's `plan` over the 22 references and the 11 citing files. Verify: `summary.txt` reads `files=33 rows=36 mismatches=0`
- [x] T006 Apply, then check the left-alone list by hand. Verify: 16 references stay, all of them to `REPO RULES.md`, `AGENTS.md`, `RULES.md`, `evidence-and-proof.md`, `uncertainty-and-honesty.md`, `blast-radius.md` or `state-format.md`
- [x] T007 Add one bullet to the newest changelog entry of each touched skill. Verify: 12 entries validate with `Total issues: 0`
- [x] T008 Regenerate the Hermes copy of the edited skill contract (`.hermes/skills/sk-create-repo-rule/SKILL.md`). Verify: the sync check prints `PASS: 65 Hermes skill copies in sync`
- [x] T009 Write `decision-record.md` for the five files that stay on the failing list. Verify: ADR-001 and ADR-002 each name the exact change that would clear their files
- [x] T017 Add `FORMAT_SPEC_FILES` (five exact path suffixes) and its check in `should_exclude_path` (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`), with `test_format_spec_exclusion.py`. Verify: `pytest -q` over it and `test_instruction_file_exclusion.py` prints `4 passed`
- [x] T018 Mark ADR-001 and ADR-002 Accepted, ADR-001 amended from a folder pattern to exact suffixes (`decision-record.md`). Verify: both Status cells read `Accepted`
- [x] T019 Add one bullet for the validator change to sk-doc's newest untagged changelog entry. Verify: the entry prints `Total issues: 0`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Validate the 33 changed docs. Verify: `validate-after-2.tsv` lists 33 OK rows with 0 issues
- [x] T011 Rescan the references inside the changed docs. Verify: `verify-2/verify-disk.txt` reads `checked=3 dangling=0`
- [x] T012 Compare each changed doc with its HEAD version after removing the allowed edits. Verify: `preserved` prints `files=33 differing=0`
- [x] T013 Search for anchor links into the renumbered docs. Verify: `rg` finds 0 and finds the known `ROUTER.md#3-machine-router` links as a control
- [x] T014 Rerun the validator over all 454 references. Verify: 445 OK, 5 FAIL, 4 SKIPPED, and no file that passed before fails now
- [x] T015 Rerun the replay and compare. Verify: same totals line and `cmp` prints nothing
- [x] T016 Run the package checks. Verify: `package_skill.py --check --strict` prints `Result: PASS` for all 12 skills, `parent-skill-check.cjs` on sk-design prints `OK`, and `generate-leaf-manifest.cjs --check` finds no stale manifest
- [x] T020 Rerun the validator over all 454 references after the exemption. Verify: `scratch/validate-after-exemption.tsv` reads 445 OK, 0 FAIL, 9 SKIPPED, and only the five named rows changed from `final-validate.tsv`
- [x] T021 Run `package_skill.py --check --strict` on sk-doc. Verify: `Result: PASS`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: plan.md section 6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Edited files pass their validator. Evidence: 33 of 33 report `Total issues: 0`
- [x] CHK-011 [P0] No section citation moved to a different heading. Evidence: 36 rows, 0 mismatches
- [x] CHK-012 [P1] Failure path handled: a citation with no matching section stops `plan`. Evidence: the first run stopped on `decision-tests.md` line 50 until it was pinned to `AGENTS.md`
- [x] CHK-013 [P1] Edits follow the owning template. Evidence: `skill-reference-template.md` shape, overview first and a rule between sections
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md
- [x] CHK-021 [P0] Content outside the allowed edits is unchanged. Evidence: `preserved` prints `files=33 differing=0`
- [x] CHK-022 [P1] Edge cases checked. Evidence: bare bullet lists, 0-based numbering, a section gap and bare `§N` aimed at other rule files
- [x] CHK-023 [P1] Before and after counts measured from reruns. Evidence: 61 FAIL before, 5 FAIL after the fixes and 0 FAIL after the exemption, over the same 454 files
- [x] CHK-024 [P0] The exemption skips only the five named files. Evidence: `test_format_spec_exclusion.py` asserts `writing-notes.md` is still validated, and the four notes report 0 issues, not skipped
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the diff is docs plus a five-entry path list and one test
- [x] CHK-031 [P0] Input validation: N/A, the validator change only adds a path-suffix skip
- [x] CHK-032 [P1] Auth/authz: N/A, no product code changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: validate.sh strict
- [x] CHK-041 [P1] Code comments carry the reason only, with no packet or ADR id. Evidence: the `FORMAT_SPEC_FILES` comment and the test docstring
- [x] CHK-042 [P2] README updated where in scope. Evidence: Files Changed table in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files kept in this packet's scratch/ folders. Evidence: the edits file, tables and reports sit under `scratch/`
- [x] CHK-051 [P1] No stray files outside the packet, the 33 docs, the 12 changelog entries, the Hermes copy, `validate_document.py`, its new test and the sk-doc changelog entry. Evidence: `git status` lists only those paths for this phase
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:summary -->
