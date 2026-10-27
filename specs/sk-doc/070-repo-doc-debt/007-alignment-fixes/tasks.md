---
title: "Tasks: doc checker accuracy and README debt fixes"
description: "Ordered tasks and verification checklist for the document validator, README checker and README line fixes."
trigger_phrases:
  - "alignment fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: doc checker accuracy and README debt fixes

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

`T` is `.skilled/skills/sk-doc/scripts/tests/`. `R` is `.skilled/skills/sk-doc/sk-create-readme/scripts/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the three checkers over the unchanged tree. Verify: validate_document exit 1 on 4,075 of 9,381 files; references `pass=394 fail=459`, 5,760 unresolved; counts `pass=629 fail=224`, 801 failing claims
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Type benchmark companion files and skip singular `-fixture` folders (`validate_document.py`, `template-rules.json`). Verify: `pytest T/test_benchmark_companion_typing.py` 4 passed
- [x] T003 Read references by the audit's rules, keep every link target, inventory row and tree line checked, and clear git-ignored paths in one batched call (`R/check_readme_references.py`, `R/audit_readmes.py`). Verify: `pytest T/test_readme_reference_checker.py` 6 passed; `--self-test` prints `SELF-TEST PASS`
- [x] T004 Count only provable claims, skipping only the sentence that names another path (`R/check_derived_readme_counts.py`). Verify: `pytest T/test_derived_readme_counts.py` 5 passed; `--self-test` prints `SELF-TEST PASS`
- [x] T005 Replace the stale spec path (`.skilled/bin/README.md`). Verify: `rg 050-validate-sh .skilled/bin/README.md` prints nothing; the new link resolves
- [x] T006 Fix the checklist label (`.skilled/skills/sk-code/sk-code-quality/README.md`). Verify: label and link both read `../sk-code-skilled/assets/checklists/`
- [x] T007 Rebuild the README verdict baseline after the deliberate fixture skip (`T/code-folder/baseline-readme-verdicts.json`). Verify: the only changed entry is `rule-experiment-fixture/README.md`
- [x] T008 Write changelog entries and step carriers for every touched skill, regenerate Hermes copies. Verify: `validate_document.py --json` 0 issues on all twelve entries; Hermes sync regenerated the copies
- [x] T013 [P] Repoint the flowchart validator test at sk-design-diagram and drop the stale scripts README row (`T/test-flowchart-validator.sh`, `.skilled/skills/sk-doc/scripts/README.md`). Verify: the test exits 1 before and 0 after
- [x] T014 [P] Correct the system-spec-kit READMEs: the skill README, `runtime/`, `runtime/cli/` and its `core/`, `lib/`, `ops/` and `optimizer/` READMEs, and `runtime/tests/` with its `embedders/` and `local-llm-features/` READMEs. Verify: the reference checker passes each, except the legacy `.opencode/specs` mentions classified in the implementation summary
- [x] T015 [P] Correct the system-skill-advisor runtime READMEs: `runtime/`, `bench/`, `data/`, `stress-test/skill-advisor/` and `tests/legacy/`. Verify: the reference checker passes each
- [x] T016 [P] Correct the system-deep-loop fixtures README, the sk-prompt, mcp-tooling and sk-code benchmark READMEs and the sk-design-md-generator styles scripts README. Verify: the reference checker passes each
- [x] T017 [P] Correct the hook and command READMEs: `.skilled/hooks/post-edit-quality/`, `permission-policy/` and `directive-lifecycle/`, and `.skilled/commands/doctor/scripts/README.markdown`. Verify: the reference checker passes each
- [x] T018 [P] Correct stale counts: `.claude/hooks/README.md` (27 symlinks, all listed) and the sk-design-md-generator backend and tests READMEs (28 modules, 20 suites, 176 tests as `npx vitest run` prints). Verify: `find .claude/hooks -maxdepth 1 -type l` lists 27, and every listed file exists
- [x] T019 [P] Correct the evidence-marker audit row in the system-spec-kit README (a standalone on-demand CLI with `--rewrap`, called by no validator) and the stale counts in `sk-create-diff/scripts/README.md` and `sk-design-chart/references/README.md`, then re-sweep the remaining own-folder counts. Verify: `python3 scripts/test_create_diff.py` prints `Ran 59 tests`; `ls references/` lists four files beside the README
- [x] T020 Document both gates in `sk-create-readme/scripts/README.md`: what each checks, usage, `--self-test`, exit codes, git-ignore and fsmonitor behavior, suite coverage. Verify: `validate_document.py` 0 issues; both checkers print `SUMMARY files=1 pass=1 fail=0`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the new tests against the HEAD scripts copied into the scratchpad. Verify: 3 of 4 typing tests and 6 of 11 checker tests fail before; all 15 pass after
- [x] T010 Rerun the three checkers, before the merge in T021. Verify: exit 1 on 2,900 files with no 0 to 1 change, and every edited `.md` exits 0; 9 unresolved, `fail=4`; 76 failing claims, `fail=50`
- [x] T011 Classify the removed and remaining hits. Verify: removed references are slash commands, names that exist elsewhere, import specifiers, home or absolute paths, build outputs or prose, plus the corrected README debt; the 9 remaining are a negative fixture, legacy-layout mentions and an on-demand folder; sampled remaining counts are true on disk
- [x] T012 Run the sk-doc script suite with fsmonitor off (`GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`). Verify: 42 of 42 suite files pass, `all sk-doc script tests passed`, exit 0
- [x] T021 Merge both checkers with main's false-positive release `0830f0bc0d` during the rebase (`R/check_readme_references.py`, `R/check_derived_readme_counts.py`, `R/README.md`, `changelog/v1.3.3.0.md`). Verify: both `--self-test` print `SELF-TEST PASS`; the four checker pytest files 27 passed; over 979 READMEs the merged reference checker prints `pass=653 fail=326` and the count checker `pass=924 fail=55`, no README fails that main's checker passes, and the root README passes both
- [x] T022 [P] Add the marker entries the merged checkers need: drop the stale `allow-ref work/` from `.skilled/skills/sk-git/README.md`, and add `allow-count` entries for five correct counts no folder listing proves (`81 tests`, `four files`, `116 tests`, `5 template files`, `300 files`). Verify: `npx vitest run` in the fast-mode extension prints `81 passed (81)`; `harness-diagram/` holds four files; both checkers pass the six READMEs
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

- [x] CHK-010 [P0] Edited files pass their checks. Evidence: 42 of 42 suite files pass, `all sk-doc script tests passed`, exit 0 with fsmonitor off
- [x] CHK-011 [P0] No new validator warnings on edited docs. Evidence: `validate_document.py` exits 0 on all 57 edited or new non-spec `.md` files
- [x] CHK-012 [P1] Failure path handled. Evidence: a missing README still prints `README is missing or unreadable` in both checkers
- [x] CHK-013 [P1] Code follows the file's existing style. Evidence: diff review
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md
- [x] CHK-021 [P0] Each change has a test that fails before. Evidence: 9 new tests fail on the HEAD scripts; the own-folder count test passes on HEAD and guards the sentence rule, and the flowchart test exits 1 before
- [x] CHK-022 [P1] Edge cases checked. Evidence: grouped run folders, companion names outside a run folder, numbered `-fixture` spec folders, a real broken path still failing
- [x] CHK-023 [P1] Before and after counts measured. Evidence: tasks T001 and T010
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class. Evidence: three checker findings are class-of-bug; the two README findings are single-line fixes
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: both README checkers now import their path rules from `audit_readmes.py`
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: plan.md affected surfaces
- [x] CHK-FIX-004 [P0] Path handling has adversarial tests. Evidence: slash commands, slashed prose, model ids, package-root links, missing dotted paths
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: token source (link, inline, command, table row, tree line) by shape (prefixed, bare, slash command, glob, git-ignored)
- [x] CHK-FIX-006 [P1] Hostile global state: N/A, the tests build their own git repos under tmp_path
- [x] CHK-FIX-007 [P1] Evidence pinned to a diff range. Evidence: working tree over `ee64a63b2c`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: diff review
- [x] CHK-031 [P0] Input validation: a reference resolving outside the repo still fails. Evidence: `resolve_reference` keeps the outside-root check
- [x] CHK-032 [P1] Auth/authz: N/A, local checker only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: validate.sh strict
- [x] CHK-041 [P1] Code comments carry the durable why. Evidence: diff review
- [x] CHK-042 [P2] README updated where in scope. Evidence: `scripts/tests/README.md` lists the three tests; tasks T014 to T019 list the README fixes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept outside the repo, in the session scratchpad. Evidence: `git status`
- [x] CHK-051 [P1] scratch/ holds only its .gitkeep. Evidence: `ls scratch`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
