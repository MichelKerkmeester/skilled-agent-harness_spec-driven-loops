---
title: "Tasks: Phase 1: run-recorder-and-validator"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "run recorder and validator tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: run-recorder-and-validator

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

- [x] T001 Baseline the fleet and the tests (`scripts/`). Verify: the fleet validator and both node test files exit 0. Evidence: 59 packages, 0 violations, 11 `RESULT_PERSISTENCE_MARKER_MISSING` warnings. Both test files `pass 1, fail 0`.
- [x] T002 Read the runner's result shape (`run-conversation-scenario.cjs`). Verify: `writeResult` names the fields. Evidence: `result.json` holds `runtime`, `verdict`, `blocker` and `turns`, and no scenario id.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the recorder (`scripts/record-playbook-run.cjs`). Verify: `node tests/record-playbook-run.test.cjs` exits 0. Evidence: three PASS lines, 21 assertions, including no absolute runner path in the written files.
- [x] T004 Write `scenario.json` and print the recorder command (`scripts/run-conversation-scenario.cjs`). Verify: the runner test file exits 0. Evidence: `pass 1, fail 0`, with the new `scenario_path` and `save results:` assertions.
- [x] T005 Make the missing marker an error and add `--coverage` (`scripts/validate-playbook-package.cjs`). Verify: the validator test file exits 0. Evidence: `result contract regressions: PASS (6 assertions)`.
- [x] T006 Add the marker to both test fixtures (`scripts/tests/fixtures/*/manual-testing-playbook.md`). Verify: the clean fixture still passes. Evidence: `fixture suite: PASS (35 negative/positive assertions)`.
- [x] T007 Rewrite the results contract (`SKILL.md`, `README.md`, `assets/*template.md`, `references/conversation-scenarios.md`). Verify: `validate_document.py` reports 0 issues on each. Evidence: 0 issues on all six files, and `rg 'by hand until|renderer-owned'` finds nothing.
- [x] T013 Rewrite MTP-005 for the recorder (`manual-testing-playbook/operator-contract/persist-scenario-result.md`). Verify: the mode package passes and no doc names the retired wrapper. Evidence: `PASS package=sk-doc/sk-create-manual-testing-playbook ... violations=0 warnings=0`, and `rg 'retired scenario-persistence|renderer-owned'` exits 1.
- [x] T008 Add the release entry and bump the mode (`changelog/v1.2.0.0.md`, `SKILL.md`). Verify: `check_changelog_shape.py` passes. Evidence: `SUMMARY files=1 pass=1 fail=0`, and `SKILL.md` reads `version: 1.2.0.0`.
- [x] T014 Fix the review findings in the recorder, runner and coverage (`scripts/*.cjs`). Verify: the recorder and validator test files exit 0, and the new assertions fail against the v1.2.0.0 recorder. Evidence: four PASS lines, 36 assertions. The old recorder fails `only the played runtime is saved` and the second-variant label.
- [x] T015 Align the playbook docs the doc-alignment lanes flagged (SKILL.md, MTP-005, sk-doc's report index, 25 playbook roots, the advisor playbook test and the `init_skill.py` docstring). Verify: no edited doc's `validate_document.py` count rises above the base, the deep-loop facts check exits 0 and the advisor playbook test passes. Evidence: `worse=0` over 30 docs, `facts=0`, `Tests 2 passed (2)`.
- [x] T016 Add the release entry and bump the mode (`changelog/v1.2.1.0.md`, `SKILL.md`). Verify: `check_changelog_shape.py` passes. Evidence: `SUMMARY files=1 pass=1 fail=0`, `version: 1.2.1.0`.
- [x] T009 Regenerate the README audit manifest (`sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`). Verify: `test_readme_manifest.py` exits 0. Evidence: `manifest=reproducible`, 859 directories.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the sk-doc script suite (`sk-doc/scripts/tests/run-script-tests.sh`). Verify: exit 0. Evidence: exit 0 with 58 PASS lines.
- [x] T011 Run the per-hub gates (`.skilled/skills/sk-doc`). Verify: parent-skill check `OK`, signals `RESULT: PASSED`, route guard exit 0. Evidence: as stated, after one `sk-doc` re-mint.
- [x] T012 Run the comment hygiene check on the six changed scripts. Verify: exit 0. Evidence: exit 0, no finding.
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `node -e require(...)` loads both scripts, and the comment hygiene check exits 0.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the three test files print no stack trace.
- [x] CHK-012 [P1] Error handling implemented. Evidence: every refusal exits 1 and names its cause, usage errors exit 2.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: module header, numbered section dividers, JSDoc and the validator's exit-code constants.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested. Evidence: a quoted field with a comma, a second run into an existing index, an existing folder.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: an unknown id, a reasonless `FAIL` and a missing label each fail with the documented code.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: the missing writer is `class-of-bug`, since every playbook lacked it.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: no other script writes run folders. Harness runs keep their own set.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: CI's fleet step and the three test files read the changed validator.
- [x] CHK-FIX-004 [P0] Adversarial cases. Evidence: an id outside the playbook, an existing folder and a malformed index are refused before any write.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: CSV and runner inputs, each against a new and an existing index.
- [x] CHK-FIX-006 [P1] Hostile env variant. N/A: the recorder reads no environment variable.
- [x] CHK-FIX-007 [P1] Evidence pinned. Evidence: worktree 514 from `920be184c8c` with this phase's changes.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the recorder writes only verdict text the caller supplies.
- [x] CHK-031 [P0] Input validation implemented. Evidence: label and date patterns, verdict vocabulary and the id check.
- [x] CHK-032 [P1] Auth/authz. N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. Evidence: each non-obvious block states its reason, with no packet ids.
- [x] CHK-042 [P2] README updated. Evidence: the mode README names the recorder in its flow and key-file table.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files outside the repository. Evidence: tests write into `os.tmpdir()`, and run output went to the session scratch folder.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-22
<!-- /ANCHOR:summary -->

---
