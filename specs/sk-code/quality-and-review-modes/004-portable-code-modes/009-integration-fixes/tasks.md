---
title: "Tasks: Integration fixes: doctor quality shows applied rules, implement dashboard uses runner verdicts, outside-repository surface rules documented"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "integration fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Integration fixes: doctor quality shows applied rules, implement dashboard uses runner verdicts, outside-repository surface rules documented

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

`D` is `.skilled/commands/doctor`. `Q` is `.skilled/skills/sk-code/sk-code-quality`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the sample against the full tree (scratch union script over `git ls-files`). Verify: the depth-three sample of 1512 files and all 120,280 tracked regular files print the same 15 checklist lines, in 550 ms against 33,707 ms.
- [x] T002 Confirm the dashboard field is not filled from the YAML (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `rg -n -i 'not-run|blocked|quality gate' speckit-implement.yaml` prints only the scored `quality_gates` block, with no dashboard value list.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Status resolves the applied rules through the runner (`D/scripts/sk-code-quality-config.cjs`). Verify: `node D/scripts/sk-code-quality-config.cjs status` in this repository prints `Checklists: 15` and ends `STATUS=OK SOURCE="none" TRUST=none`.
- [x] T004 Status prints each override row, each refusal reason and the hygiene rules (`D/scripts/sk-code-quality-config.cjs`). Verify: on the scratch fixture it prints `override floor.documentation none`, `overrides REFUSED, none of its rows apply:` with the floor reason, and `Hygiene rules: 20 apply (...), disabled hygiene.task`.
- [x] T005 A broken declared checklist fails the status (`D/scripts/sk-code-quality-config.cjs`). Verify: the missing-checklist case ends `STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CHECKLIST_MISSING`, exit 1.
- [x] T006 Add three cases and restate the process invariant (`D/scripts/tests/sk-code-quality-config.test.cjs`). Verify: `node --test` against the `HEAD` script prints `fail 4`, and against the first-round script `pass 14`, `fail 0` (15 of 15 after the review round, T019).
- [x] T007 [P] Workflow keeps and renders the `applies` block (`D/assets/doctor-sk-code-quality.yaml`). Verify: `/usr/bin/python3 -c "import yaml; yaml.safe_load(open(...))"` prints `yaml ok`.
- [x] T008 [P] Presentation gains the Hygiene line, the Applied Rules block, a summary line and two troubleshooting rows (`D/assets/doctor-sk-code-presentation.txt`). Verify: `bash D/scripts/route-validate.sh` ends `OK: route-validate`.
- [x] T009 [P] Dashboard quality gate takes the runner's gate values (`.skilled/commands/speckit/assets/speckit-implement-presentation.txt`). Verify: `rg -n 'Quality gate:'` prints `[not-run|NO_BLOCKER_FOUND|BLOCKED|UNVERIFIED|NOTHING_CHECKED|ERROR]`.
- [x] T010 [P] Document the outside-repository limit and the way around it (`Q/SKILL.md`, `Q/references/quality-config.md`). Verify: `validate_document.py --json` reports `total_issues: 0` on both.
- [x] T011 Changelogs and carriers (`Q/changelog/v1.13.7.0.md`, `.skilled/skills/system-spec-kit/changelog/v2.12.15.0.md`, both `SKILL.md` versions, the `quality-config.md` version). Verify: `validate_document.py --json` reports `total_issues: 0` on both entries and `hvr_scan.py` reports `hard blockers: 0`.
- [x] T012 Sync the Hermes mirrors. Verify: `sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run every doctor suite. Verify: `node --test D/scripts/tests/*.test.cjs` prints `tests 491`, `pass 491`, `fail 0`.
- [x] T014 Run the quality runner suite and the setup battery. Verify: `node --test Q/scripts/tests/*.test.cjs` prints `pass 143`, `fail 0`, and `sk-code-setup-check.cjs` ends `STATUS=OK legs=9`.
- [x] T015 Run the speckit presentation contract. Verify: `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` prints `pass 5`, `fail 0`.
- [x] T017 Run path reads each loaded checklist's override section (`Q/scripts/quality-gate.cjs`). Verify: the two `run overrides` cases fail against the `HEAD` runner (`fail 2`) and pass against the changed one (`pass 2`).
- [x] T018 Document the run-path contract (`Q/references/runner-contract.md`, `Q/SKILL.md`, `Q/references/quality-config.md`). Verify: `validate_document.py --json` reports `total_issues: 0` on each.
- [x] T019 Doctor lists and checks unreached repository rows and fails on a refused section (`D/scripts/sk-code-quality-config.cjs`). Verify: against the previous doctor script three cases fail (`fail 3`), against the changed one `pass 15`.
- [x] T020 No-process test runs trusted and pins `RUNNER` (`D/scripts/tests/sk-code-quality-config.test.cjs`). Verify: the case asserts `TRUST=trusted`, the canary is absent and `RUNNER` ends in `sk-code-quality/scripts/quality-gate.cjs`.
- [x] T021 Widen the sample wording and fix the process claims (`D/assets/doctor-sk-code-quality.yaml`, `D/assets/doctor-sk-code-presentation.txt`, `D/scripts/tests/README.markdown`, `Q/references/quality-config.md`). Verify: `/usr/bin/python3` YAML load prints `yaml ok`, `route-validate.sh` ends OK.
- [x] T022 Build the rule id registry (`.skilled/skills/sk-code/shared/scripts/lib/rule-registry.cjs`). Verify: it reads 19 runner ids, 21 hygiene ids, 16 floor ids and 29 review ids, 85 in all.
- [x] T023 Refuse unknown ids and resolve precedence in the run path (`Q/scripts/quality-gate.cjs`). Verify: the three new `run overrides` cases fail against the round-one runner and pass against the changed one, and the runner suite prints `pass 142`.
- [x] T024 Registry tests (`.skilled/skills/sk-code/shared/scripts/tests/rule-registry.test.cjs`). Verify: with the module absent the file fails, with it the three cases pass, and the shared suite prints `pass 21`.
- [x] T025 Doctor refuses unknown ids (`D/scripts/sk-code-quality-config.cjs`). Verify: the new case fails against the round-one script and the doctor quality file passes 16 of 16.
- [x] T026 Hub version 3.9.13.0 and the compiled manifest refresh. Verify: `parent-skill-check.cjs` OK, `compiled-route-guard.cjs --json` reports `failures: 0`, setup battery `STATUS=OK legs=9`.
- [x] T027 Explain reports per-file `rule_conflicts` and the doctor prints them (`Q/scripts/quality-gate.cjs`, `D/scripts/sk-code-quality-config.cjs`, `Q/references/runner-contract.md`, `D/assets/doctor-sk-code-presentation.txt`, `D/assets/doctor-sk-code-quality.yaml`). Verify: the two new cases fail before (`fail 2`) and pass after, and the doctor quality file passes 17 of 17.
- [x] T028 The registry throws on a row with no id and on a reworded hygiene template (`.skilled/skills/sk-code/shared/scripts/lib/rule-registry.cjs`). Verify: the new case fails against the round-two registry and the shared suite prints `pass 22`.
- [x] T029 UNVERIFIED wording covers a conflicting rule id (`Q/SKILL.md`, `Q/references/runner-contract.md`). Verify: `validate_document.py` 0 issues.
- [x] T016 Validate this folder. Verify: `validate.sh <this folder> --recursive --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: status on this repository and on the scratch fixture
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-008 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3 data flow.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: multi-file `--explain` printed `sources` and `overrides` on the scratch fixture.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check D/scripts/sk-code-quality-config.cjs` exits 0.
- [x] CHK-011 [P0] No new warning in any doctor suite. Evidence: 488 of 488 pass.
- [x] CHK-012 [P1] A runner that does not answer reads `DEGRADED` with its reason. Evidence: `explainBatch` returns the stopped row's code and message, and `appliedRules` marks the result `failed`.
- [x] CHK-013 [P1] Code follows the file's own section layout and comment style, with no ephemeral label in a comment. Evidence: `git diff` of the script.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] Manual testing complete. Evidence: status on this repository and on the scratch fixture, quoted in `implementation-summary.md`.
- [x] CHK-022 [P1] Edge cases tested: a missing checklist and an invalid config. Evidence: the third new case.
- [x] CHK-023 [P1] Error scenarios validated: a refused override section. Evidence: the first new case.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class. The doctor gap is `instance-only` (one reader of the resolver), the dashboard value is `instance-only` and the discovery limit is `matrix/evidence` (documented, not changed).
- [x] CHK-FIX-002 [P0] Same-class producer inventory. Evidence: `rg -n 'not-run\|pass\|blocked' .skilled/commands/speckit/assets/*presentation.txt` shows the other `pass` values belong to `Validation:` lines, which report `validate.sh`, not the runner.
- [x] CHK-FIX-003 [P0] Consumer inventory for the status. Evidence: `rg -l sk-code-quality-config` lists the YAML, the tests, the quality reference, the `/doctor:sk-code` command doc, `_routes.yaml`, the two doctor READMEs, the quality `scripts/lib/README.md` and the doctor feature-catalog entry. The YAML, tests and reference are updated here, and the READMEs, the command doc and the catalog entry are left to the docs-alignment lane.
- [x] CHK-FIX-004 [P0] Path handling: a sampled name that starts with a dash is passed as `./name`, and links and deleted paths are skipped before the runner sees them.
- [x] CHK-FIX-005 [P1] Matrix axes: config valid or invalid, override section valid, refused or absent, checklist present or missing, hygiene rule disabled or not. Each axis has a case.
- [x] CHK-FIX-006 [P1] Hostile environment: the fixtures run with git variables dropped and global config hidden, through the shared fixture builder.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working tree over `HEAD` `5b1e143ced`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the changed files.
- [x] CHK-031 [P0] Input validation: the runner receives an argv array with no shell, and the config path is resolved to an absolute path first.
- [x] CHK-032 [P1] Auth and authz: N/A, the doctor has no auth surface. The configured-check trust rule is untouched, and the canary case proves no configured check runs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files and the same `applies` block.
- [x] CHK-041 [P1] Code comments state why the sample and the batch size exist.
- [x] CHK-042 [P2] README updated: N/A here, the docs-alignment lane owns the doctor READMEs.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only, outside the worktree.
- [x] CHK-051 [P1] The temporary `HEAD` copy of the script was removed. Evidence: `git status --short` lists no extra file under `D/scripts`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->

---
