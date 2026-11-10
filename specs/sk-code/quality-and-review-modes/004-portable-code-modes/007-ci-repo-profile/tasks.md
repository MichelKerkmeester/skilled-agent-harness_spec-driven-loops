---
title: "Tasks: CI repository profile for sk-code-ci and doctor ci"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ci repo profile tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: CI repository profile for sk-code-ci and doctor ci

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

`D` is `.skilled/commands/doctor/scripts`. `T` is `$D/tests`. `BEFORE` is a scratch copy of the HEAD doctor folder and sk-code-ci packet with the new test files and the new loader copied in, run with `node --test`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baselines. Verify: `node $D/ci-report.cjs --json` and `--json --no-gh` saved to scratch, `exit=0`, `STATUS=OK workflows=32 on=32 off=0 partial=0 missing=0 unknown=0`; `node --test $T/ci-report.test.cjs $T/doctor-ci-contract.test.cjs` printed `tests 26 pass 26 fail 0`; both templates copied to scratch.
- [x] T002 Read the live ruleset shape. Verify: `gh api 'repos/{owner}/{repo}/rules/branches/main'` returned a `required_status_checks` rule whose one context is `Commit messages, branch names and PR description follow the templates`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the profile loader and its template (`$D/lib/ci-profile.cjs`, `sk-code-ci/assets/ci-profile.template.json`). Verify: `node --test $T/ci-profile.test.cjs` prints `pass 8 fail 0`.
- [x] T004 Read switches by shape and every convention from the profile, add the `profile` field (`$D/ci-report.cjs`). Verify: the HEAD script and the new one run back to back give JSON that is equal after removing `profile` and `repoRoot`, live (`equal_rest True`, both naming `f291d28f8a`) and with `--no-gh` (`equal_rest True`); `profile` reads `{"source": "repo", "path": ".sk-code/ci.json"}`.
- [x] T005 Commit this repository's profile (`.sk-code/ci.json`). Verify: `ci-profile.test.cjs` "this repository commits its CI profile and it keeps every protection" and `doctor-ci-contract.test.cjs` "this repository commits the CI profile that keeps its protections" pass, and both fail in `BEFORE`.
- [x] T006 Add profile slots to the templates and the renderer (`workflow-template.yml`, `job-block-template.yml`, `$D/ci-scaffold.cjs`). Verify: `node $D/ci-scaffold.cjs | diff today-workflow-template.yml -` and `--job | diff today-job-block-template.yml -` print nothing (`WF-IDENTICAL`, `JOB-IDENTICAL`); both templates parse as YAML; `ci-scaffold.test.cjs` prints `pass 7 fail 0`.
- [x] T007 Plan the toggle with every refusal in code (`$D/ci-toggle.cjs`, `doctor-ci-toggle.yaml`, `doctor-ci-presentation.txt`). Verify: `ci-toggle.test.cjs` prints `pass 11 fail 0` with no `variable set` or `variable delete` in the stub log; a live read-only run here refuses `SKILLED_CI_MESSAGES` and `SKILLED_CI` with the exact strings and plans `SKILLED_CI_FRESHNESS` with a second confirmation naming `gate-inputs.yml`, `dispatch-enforcement-guard.yml` and `naming-standard-guard.yml`.
- [x] T008 Route the scaffold and toggle through their scripts (`doctor-ci-scaffold.yaml`, `doctor-ci-report.yaml`, `_routes.yaml`, `ci.md`). Verify: `bash $D/route-validate.sh` prints `PASS: L1: all 44 route script invocations are invoked by their workflow YAML` and `OK: route-validate - 18 routes validated, 2 warnings` (both warnings predate this change).
- [x] T009 Update the toggle rows (`sk-create-command/assets/command-contract.json`, `README.md`). Verify: the JSON parses and the README `/doctor:ci` block names the profile, the ruleset refusal and the second confirmation.
- [x] T010 Rewrite the references as universal guidance (`references/ci-workflow-standards.md`, `trigger-and-filter-rules.md`, `job-shape-rules.md`, `protected-set.md`). Verify: `rg -n` for `SKILLED_CI`, `.opencode` and `skilled/**` over the first three, filtered with `rg -v "Skilled example"`, prints nothing; `git diff -U0` on `job-shape-rules.md` shows no hunk in its concurrency count lines; `validate_document.py` reports 0 issues on all four.
- [x] T011 Regenerate the sk-code leaf manifest for the new asset (`leaf-manifest.json`). Verify: `parent-skill-check.cjs .skilled/skills/sk-code` prints `OK: parent-skill-check - all hard invariants passed, 0 warnings`.
- [x] T012 Write the changelog entries and step the carriers (`sk-code-ci/changelog/v1.1.5.0.md`, moved from 1.1.4.0 because origin/main already holds that version, `sk-create-command/changelog/v1.0.6.0.md`, both `SKILL.md`). Verify: `validate_document.py --json` prints `valid True`, 0 issues, for both; `sync-skills-hermes.cjs` wrote 2 copies and `--check` prints `PASS: 67 Hermes skill copies in sync`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the five CI suites before and after. Verify: `BEFORE` prints `tests 62 pass 33 fail 29`, exit 1; the worktree prints `tests 62 pass 62 fail 0`, exit 0.
- [x] T014 Run the doctor suite runner. Verify: `bash $T/run-all.sh` prints `node:test (27 files)` PASS and `7 suite(s) passed, 0 failed`, exit 0.
- [x] T015 Run the repository gates that must not regress. Verify: `bash .github/scripts/check-gate-inputs.sh .` prints `RESULT: PASSED`; `vitest run runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts` prints `Tests 60 passed | 1 skipped (61)`.
- [x] T016 Run the quality gate on the changed code and config. Verify: `quality-gate.cjs --files` on 19 files prints `NO_BLOCKER_FOUND`, `p0_blocking 0`, `p1_open 0`, exit 0.
- [x] T017 Print the unread-ruleset line in the toggle's text plan (`$D/ci-toggle.cjs`, `doctor-ci-presentation.txt`, `doctor-ci-toggle.yaml`). Verify: `node --test --test-name-pattern="unreadable ruleset" $T/ci-toggle.test.cjs` prints `fail 1`, exit 1, against a scratch copy with the old renderer and `pass 1 fail 0`, exit 0, now; `ci-toggle.cjs --variable=SKILLED_CI_TESTS --state=off --no-gh` prints `Required checks: not read (gh disabled by --no-gh); the ruleset refusal was not applied`.
- [x] T018 Accept `--profile=<path>` on the three CI routes (`_routes.yaml`, `ci.md`, the three `doctor-ci-*.yaml`, `doctor-ci-presentation.txt`, `command-contract.json`). Verify: the new `doctor-ci-contract.test.cjs` case exits 1 before the route edits and the suite prints `tests 15 pass 15 fail 0` after; `route-validate.sh` prints `OK: route-validate - 18 routes validated, 3 warnings`, the third an informational H1 note that `--profile` sits on all three targets; `validate_document.py` on `ci.md` prints 0 issues once the argument hint is the `[flags]` summary.
- [x] T019 Check the runtime mirrors of `ci.md`. Verify: `sync-runtime-mirrors.cjs --check`, codex `sync-prompts.cjs --check`, `sync-prompts-pi.cjs --check` and `sync-prompts-hermes.cjs --check` each print PASS, because the mirrors are symlinks or pointer stubs that carry no flag text.
- [x] T020 Make the README checkers pass on the READMEs this child changed. The reference checker resolved a `.sk-code/` path only from the README's folder, so the doctor scripts README failed on the committed `.sk-code/ci.json`; `.sk-code/` joins its repository-root prefixes (sk-create-readme v1.3.5.0). The tests README now names `../lib/ci-profile.cjs`, and a tree comment no longer reads as a count claim. Verify: the new `self-test-root-config-folder` case fails before the prefix and `--self-test` passes after; `check_readme_references.py` and `check_derived_readme_counts.py` print `SUMMARY files=3 pass=3 fail=0` on the root README and both doctor READMEs.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The five CI suites pass 62 of 62 and 29 of them fail before
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-011 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: T002 read the live ruleset.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `quality-gate.cjs --files` on the changed code and config prints `NO_BLOCKER_FOUND` with 0 findings. Evidence: T016.
- [x] CHK-011 [P0] No new warnings in the test output. Evidence: T013 and T014 output.
- [x] CHK-012 [P1] Error handling: a missing named profile throws, a parse or schema fault is collected and every script exits 3 with the field named. Evidence: `ci-report.test.cjs` "--profile reads the named file" and "an unknown profile key exits 3".
- [x] CHK-013 [P1] Code follows the existing module header, numbered sections and comment style of `ci-report.cjs`, and names no spec id. Evidence: `doctor-ci-contract.test.cjs` "no file the command ships names a requirement, decision or phase id" passes over the new files.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] Each behavior change fails before and passes after. Evidence: T013, 29 failing cases in `BEFORE`.
- [x] CHK-022 [P1] Edge cases: no profile, no README, another branch, a missing named profile, an unknown key, an unreadable ruleset and a no-op change each have a case.
- [x] CHK-023 [P1] Every fixture lives under `os.tmpdir()` and is removed by `t.after`; the scratch manifests the version tool wrote were deleted.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding classes: the hard-coded conventions are `class-of-bug` (every CI route), the missing second confirmation is `instance-only` (the toggle).
- [x] CHK-FIX-002 [P0] Same-class producers: `ci-report.cjs`, the toggle, the scaffold YAML and both templates all read the profile now; `rg -n "SKILLED_CI" $D/*.cjs $D/lib` hits no constant.
- [x] CHK-FIX-003 [P0] Consumers: the scaffold route's read-back runs `ci-report.cjs --json --no-gh`, which this repository's profile keeps identical.
- [x] CHK-FIX-004 [P0] Security: every gh call is an argument array, a variable value is never printed and the planner never writes; a `-c` git value cannot name the profile.
- [x] CHK-FIX-005 [P1] Matrix: report, toggle and scaffold, each against a foreign fixture and this repository, all green.
- [x] CHK-FIX-006 [P1] N/A: no process-wide state is read beyond `PATH` for gh.
- [x] CHK-FIX-007 [P1] Evidence is against base `48f6a5392d` plus the uncommitted diff in worktree `241-ci-repo-profile`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the quality gate's secrets sensor ran clean.
- [x] CHK-031 [P0] Input validation: the loader rejects unknown keys, bad variable names, absolute or `..` paths and non-integer timeouts.
- [x] CHK-032 [P1] N/A: no auth surface beyond the operator's own gh login.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files.
- [x] CHK-041 [P1] Code comments state why each refusal source exists and why the template directives sit in YAML comments.
- [x] CHK-042 [P2] Changelog entries written for sk-code-ci and sk-create-command.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baselines, the HEAD copy and logs lived in the session scratchpad only.
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep`.
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
