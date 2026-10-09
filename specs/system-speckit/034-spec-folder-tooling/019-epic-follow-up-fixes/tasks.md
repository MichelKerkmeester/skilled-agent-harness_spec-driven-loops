---
title: "Tasks: Phase 19: epic-follow-up-fixes"
description: "Task list for the eleven follow-ups, with the evidence file that proves each one."
trigger_phrases:
  - "epic follow up fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 19: epic-follow-up-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed, with the evidence named on the line |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`. Evidence paths are relative to this packet's `scratch/evidence/` folder unless a full path is given.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `scratch/follow-ups.md` and the cited line of each follow-up before editing (`scratch/follow-ups.md`)
- [x] T002 Confirm the git state and record the base for the closeout: HEAD `dd6f9316a3`, with the gates recorded after the last commit (`gate-*.log` headers, `git reflog`)
- [x] T003 [P] Locate the gate tools named in the closeout: vitest config, hook test glob, comment-hygiene checker, leaf manifest generator (paths in each `gate-*.log` `CMD:` line)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Docs (U01 to U04)
- [x] T004 U01 ENV-REFERENCE: the `SYSTEM_SPEC_GATE_DISABLED` row at line 209 now agrees with its twin at line 76 on default and type, and `doctor-env.yaml` accepts legacy label rows, boolean polarity and rejects wrong-cell rows (`ENV-REFERENCE.md`, `commands/doctor/assets/doctor-env.yaml`, `u01-doctor-env-probe-after.json`, `u01-env-probe-rerun.txt`)
- [x] T005 U02 spec README: the manifest field list includes `completedAt` (`runtime/cli/spec/README.md`, source `upgrade-legacy.mjs:494`)
- [x] T006 U03 reference fixes: four references fixed in four READMEs, and `../../vitest.config.ts` left unchanged because it resolves from the run directory `runtime/cli` (`u03-markdown-links-after.txt`, `gate-07-markdown-links.log`)
- [x] T007 U04 index READMEs: the system-spec-kit doctor-commands README and the doctor tests README validate with 0 issues (`u04-validate-document-readmes-rerun.txt`)

### Compat workflow (U05 to U07)
- [x] T008 U05 owed-step exemption: an owed `link-legacy-path` step is not a planned move for the dirty-roots check, and only the porcelain lines ` D specs` and `D  specs` are dropped for a deleted specs link. The DOC-381 scenario expects the resume to proceed (`commands/doctor/assets/doctor-update-compat-action.yaml`, `manual-testing-playbook/doctor-commands/doctor-update-compat.md`, `u05-u07-doctor-tests.txt`)
- [x] T009 U06 run-complete: every terminal status reached after run-started appends run-complete. The exception is a step-failed line in phase_4_move, which leaves the run open so recovery lists the step as owed. A no-move run opens with run-started before upgrade-started, and phase 8 writes run-complete only when the run logged a line (`doctor-update-compat-action.yaml` `close_rule`, `u05-u07-doctor-tests.txt`)
- [x] T010 U07 layout map JSON: the map must print parseable JSON on stdout whatever its exit code. Without it, the step stops with STATUS=FAILED (`doctor-update-compat-action.yaml` `exit_policy`, `u05-u07-doctor-tests.txt`)

### Tests and generated files (U08 to U10)
- [x] T011 U08 Gate 3 parity: `GATE_3_MENU_FILES` lists 17 files, 5 more than before, including `create-agent-presentation.txt` and `create-command-presentation.txt` with aligned option C lines (`runtime/tests/hooks/gate-3-menu-parity.test.mjs`, `u08-gate3-parity-final.txt`, `u08-gate3-parity-planted-drift-agent.txt`, `u08-gate3-parity-planted-drift-command.txt`)
- [x] T012 U09 CLI test isolation: `repair-derived`, `scaffold-passes-its-own-gate` and `scaffold-golden-snapshots` run in OS temp sandboxes. Teardown removes the tool-tree link with `rmSync` force before the recursive remove. Two helpers have containment guards (`runtime/cli/tests/*.vitest.ts`, `u09-cli-sandbox-vitest.txt`, `u09-containment-guard-cases.txt`, `u09-specs-root-before.txt`, `u09-specs-root-after.txt`)
- [x] T013 U10 leaf manifest: the generator skips dot-named directories, and a new scope test pins that a `.pytest_cache` does not change a manifest while `.gitkeep` stays a leaf. The sk-code manifest was already clean in git and was not regenerated (`generate-leaf-manifest.cjs`, `generate-leaf-manifest-scopes.test.cjs`, `u10-leaf-manifest-scope-test.txt`, `gate-08-leaf-manifests.log`)

### Housekeeping (U11) and added items
- [x] T014 U11 commit the 018 push receipt `specs/system-speckit/034-spec-folder-tooling/018-epic-docs-alignment/scratch/evidence/push.txt`. Committed in `9bd0eecc44`, and `git ls-files` lists the file. Owner: orchestrator
- [x] T015 Added: the doctor scripts READMEs and the three sibling doctor-commands playbook READMEs (mcp-code-mode, sk-git, system-deep-loop) validate with 0 issues (`u04-validate-*.txt`, `u04-validate-document-readmes-rerun.txt`)
- [x] T016 Added: the three playbook prompt files `create-agent-presentation.txt`, `create-command-presentation.txt` and `doctor-update-presentation.txt` aligned with their YAML and test rules (`git diff`, `u08-gate3-parity-final.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Gates 2 to 12 run on the working tree at HEAD `dd6f9316a3`, each with its log and exit code under `scratch/evidence/gate-*` (see implementation-summary.md, Verification)
- [x] T018 Full CLI suite with `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000`. Result: 1776 passed, 19 skipped, 0 failed, exit 0, matching the baseline (`gate-01-cli-suite.log`, `gate-01-cli-suite.exit`)
- [x] T019 `validate.sh --strict` on this folder and on the 034 parent prints `RESULT: PASSED` (`scratch/evidence/validate-019-strict-final.txt`, `scratch/evidence/validate-034-strict-final.txt`). The earlier run that failed on AC_CLOSURE is `scratch/evidence/validate-019-strict.txt`
- [x] T020 Mark every acceptance row in `acceptance-criteria.md` with evidence or a reason
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. T014 is closed by commit `9bd0eecc44`, and T019 by the final strict runs
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification: the DOC-381 scenario was not run by hand, so this stays open. It needs a v3 fixture repository, and the automated contract tests pin the same rule (see plan.md, section 5)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Evidence and outcome**: See `implementation-summary.md`
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
- [x] CHK-003 [P1] Dependencies identified and available (plan.md, section 6)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: comment hygiene on the 8 modified code files exits 0 and `git diff --check` exits 0 (`gate-11-comment-hygiene.log`, `gate-12-git-diff-check.log`). No formatter is configured for the YAML and Markdown files changed.
- [x] CHK-011 [P0] No console errors or warnings introduced: the suite prints one vitest configLoader notice from `../../vitest.config.ts`. This closeout did not compare it with HEAD, so the notice is recorded, not claimed as pre-existing (`gate-01-cli-suite.log`).
- [x] CHK-012 [P1] Error handling implemented: the step-failed exception, the failed post-check and the layout map without JSON each have a contract test (`u05-u07-doctor-tests.txt`)
- [x] CHK-013 [P1] Code follows project patterns: the new tests use the style of the existing compat and scaffold tests, and every validator passes (`gate-05a` to `gate-09`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: AC-001 to AC-014 are Met. AC-011 is committed in `9bd0eecc44`, AC-012 is the CLI suite result in `gate-01-cli-suite.log`, and AC-014 is the strict runs in `validate-019-strict-final.txt` and `validate-034-strict-final.txt`
- [ ] CHK-021 [P0] Manual testing complete. Not done, and left unticked: the DOC-381 manual run needs a v3 fixture repository. The contract tests pin the same rules, so the resume behavior is covered automatically, and the manual run stays open for the operator.
- [x] CHK-022 [P1] Edge cases tested: an owed step with a dirty tree, a declined upgrade and a run with no logged line (`u05-u07-doctor-tests.txt`)
- [x] CHK-023 [P1] Error scenarios validated: a missing layout-map script, a failed post-check and a step-failed run (`u05-u07-doctor-tests.txt`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. U01 `instance-only`, U02 `instance-only`, U03 `instance-only`, U04 `instance-only`, U05 `cross-consumer`, U06 `class-of-bug`, U07 `algorithmic`, U08 `matrix/evidence`, U09 `test-isolation`, U10 `class-of-bug`, U11 `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the env probe read all 177 data rows across every table in ENV-REFERENCE.md (`u01-doctor-env-probe-after.json`). The reference fixes were checked by reading each README, and the link checker covered the 7945 Markdown files (`u03-markdown-links-after.txt`). Plain-text paths are not covered by a tool, which is recorded in implementation-summary.md.
- [x] CHK-FIX-003 [P0] Consumer inventory: the compat YAML is consumed by the two compat test files, the DOC-381 playbook scenario and `doctor-update-presentation.txt`, and all four were updated together. The leaf manifest is consumed by the eight hub gates (`gate-08-leaf-manifests.log`).
- [x] CHK-FIX-004 [P0] Path containment: the sandbox helpers accept only paths under `<sandbox>/specs/`. The probe covers an absolute inside path, a relative inside path, an absolute outside path and a sibling-prefix path (`u09-containment-guard-cases.txt`). The delimiter, joined-input, no-op and fallback classes do not arise in this containment check.
- [x] CHK-FIX-005 [P1] Matrix axes listed: the parity list has 17 files (implementation-summary.md, Key Decisions) and the compat terminal statuses are 8, COMPATIBLE, UPGRADED, PARTIAL, BLOCKED, DRY_RUN, DECLINED, CANCELLED and FAILED.
- [x] CHK-FIX-006 [P1] N/A. The changed code adds no read of process-wide state. The sandboxed tests keep the existing env handling.
- [x] CHK-FIX-007 [P1] Evidence pinned to HEAD `dd6f9316a3` and to the working tree diff hash recorded in implementation-summary.md, not to a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the changed files and every copied evidence file were scanned for token, secret, key, bearer and password strings, with no hits outside folder names
- [x] CHK-031 [P0] Input validation: the repair-derived CLI refuses a target outside the packet tree, and the test output shows the refusal (`u09-cli-sandbox-vitest.txt`)
- [x] CHK-032 [P1] N/A. The changed surfaces have no authentication or authorization path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized, with the acceptance criteria and the 034 parent row updated to match
- [x] CHK-041 [P1] Code comments adequate: the generator comment explains why dot-named directories are skipped, and the scope test comment explains why `.gitkeep` stays a leaf
- [x] CHK-042 [P2] README updated: U02, U03, U04, and the doctor scripts READMEs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: closeout proof is in `scratch/evidence/`, and every intermediate file is in the session scratchpad
- [x] CHK-051 [P1] scratch/ cleaned before completion: `scratch/` holds `follow-ups.md` (the source list), `evidence/` (the proof) and `.gitkeep`. No temporary file from this closeout is left in it.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 (CHK-021 manual DOC-381 run not done, left unticked) |
| P1 Items | 13 | 11/13 verified, 2 N/A (CHK-032 and CHK-FIX-006) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-09
<!-- /ANCHOR:summary -->

---
