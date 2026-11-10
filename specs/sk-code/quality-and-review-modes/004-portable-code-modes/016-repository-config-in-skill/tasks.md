---
title: "Tasks: Repository config inside the owning skill folder"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "repository config in skill tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Repository config inside the owning skill folder

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

`D` is `.skilled/commands/doctor/scripts`. `T` is `$D/tests`. `Q` is `.skilled/skills/sk-code/sk-code-quality/scripts`. `S` is `.skilled/skills/sk-code/shared/scripts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline report. Verify: `node $D/ci-report.cjs --no-gh --json` saved to scratch reads `"workflowCount": 32`, `"errors": []` and `"path": ".sk-code/ci.json"`.
- [x] T002 Read the current lookup order and the init target. Verify: `ci-profile.cjs` and `quality-config.cjs` both name `.sk-code/`, and `repoConfigTarget` has no skill-folder candidate.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the shared identity module and its suite (`$S/lib/repository-identity.cjs`, `$S/tests/repository-identity.test.cjs`). Verify: `node --test $S/tests/repository-identity.test.cjs` prints `tests 9 pass 9 fail 0`.
- [x] T004 Move the CI profile default, add the `repository` field, the `ignored` result and the legacy refusal (`$D/lib/ci-profile.cjs`). Verify: `ci-profile.test.cjs` "a profile left at the old repository-root path is refused with its move target", "a profile written for another repository is reported and ignored", "a profile with no repository field applies here" and "a repository that installs the skills under .opencode/ reads the same path there" pass.
- [x] T005 Carry `ignored` into the three CI readers (`$D/ci-report.cjs`, `ci-toggle.cjs`, `ci-scaffold.cjs`). Verify: `ci-report.test.cjs` "a skill-folder profile written for another repository is ignored and named in the report" prints `profile: default; ignored .skilled/skills/sk-code/sk-code-ci/repository/ci.json, written for someone/else, this repository is acme/widgets`; `ci-toggle.test.cjs` "a skill-folder profile written for another repository is ignored and named in the plan" passes; `ci-scaffold.cjs` writes `note: ignored …` to stderr.
- [x] T006 Move the quality config default, add the field check, the `ignored` result, the legacy refusal and the init target (`$Q/lib/quality-config.cjs`). Verify: `quality-config.test.cjs` "discovery: a config left at the old root-level path is refused, and the message names where it belongs", "discovery: a repository field decides whether the config applies, and a mismatch names both repositories" and "discovery: a repository that installs skills under .opencode/ keeps the config at the same path there" pass.
- [x] T007 Give the legacy code its own gate error and follow the loader from the hygiene helper (`$Q/quality-gate.cjs`, `$Q/hygiene-config-flags.cjs`). Verify: the gate's repair table reads `CONFIG_LEGACY_LOCATION: 'move .sk-code/quality.json to the path the message names inside the sk-code-quality skill folder, then delete the .sk-code folder'`, and a config fault carries its own code instead of `GIT_FAILED`.
- [x] T008 Move this repository's profile and delete the root folder (`.skilled/skills/sk-code/sk-code-ci/repository/ci.json`). Verify: `ls .sk-code` prints `No such file or directory`; the file carries `"repository": "MichelKerkmeester/skilled-agent-harness_spec-driven-loops"`; `doctor-ci-contract.test.cjs` "this repository commits the CI profile that keeps its protections" passes.
- [x] T009 Sweep the doctor commands and assets (`$D/../assets/doctor-ci-*.yaml`, `doctor-ci-presentation.txt`, `doctor-setup-presentation.txt`, `doctor-sk-code-presentation.txt`, `doctor-sk-code-quality.yaml`, `ci.md`, `sk-code.md`, `_routes.yaml`, `.skilled/commands/README.txt`). Verify: `rg -n '\.sk-code/' .skilled/commands` prints the refusal and move wording, the `LEGACY_PROFILE_FILE` constant and the one fixture that proves the refusal.
- [x] T010 Sweep the hub docs (`README.md`, `.skilled/skills/sk-code/README.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `description.json`, the shared references, the feature catalog and the doctor playbook). Verify: each names the skill-folder path, and `rg` finds no stale path outside the refusal.
- [x] T011 Sweep the quality, ci and review READMEs, references, playbooks and fixtures (`.skilled/skills/sk-code/sk-code-quality/**`, `sk-code-ci/**`, `sk-code-review/**`). Verify: the same `rg` sweep prints the refusal and move wording, the `LEGACY_CONFIG_FILE` constant, the repair line and the one test constant.
- [x] T012 Update the README checker and its self-test (`.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py`). Verify: `python3 … --self-test` prints `SELF-TEST PASS` and `PASS self-test-root-config-folder`.
- [x] T013 Write the five changelogs and step the carriers (`.skilled/skills/sk-code/changelog/v3.9.15.0.md`, `sk-code-ci/changelog/v1.1.7.0.md`, `sk-code-quality/changelog/v1.13.9.0.md`, `sk-code-review/changelog/v1.9.8.0.md`, `.skilled/skills/sk-doc/sk-create-readme/changelog/v1.3.7.0.md`, both `SKILL.md` files). Verify: each file exists and each `SKILL.md:5` carries the same version as its changelog.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run the five CI suites. Verify: `node --test $T/ci-profile.test.cjs $T/ci-report.test.cjs $T/ci-scaffold.test.cjs $T/ci-toggle.test.cjs $T/doctor-ci-contract.test.cjs` prints `tests 73 pass 73 fail 0`, exit 0.
- [x] T015 Run the quality, doctor-quality, shared and CI suites together. Verify: the combined `node --test` run prints `tests 270 pass 270 fail 0`, exit 0.
- [x] T016 Run the pre-commit hook suite. Verify: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` prints `pre-commit gates: 152 passed, 0 failed`, exit 0.
- [x] T017 Run the rule canary suite and the README checker self-test. Verify: `bash .skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh` prints `All rule-canary test cases passed`; the checker prints `SELF-TEST PASS`.
- [x] T018 Confirm the report is unchanged apart from the profile path. Verify: `node $D/ci-report.cjs --no-gh --json` reads `"path": ".skilled/skills/sk-code/sk-code-ci/repository/ci.json"`, `"workflowCount": 32` and `"errors": []`.
- [x] T019 Confirm the docs sweep. Verify: `rg -n '\.sk-code/'` outside `specs/` and `**/changelog/**` leaves the refusal and move wording in the docs, the two `LEGACY_*` constants, the gate's repair line, the README checker's two allowlist entries, and the fixtures and tests that prove the refusal.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The five CI suites pass 73 of 73 and the combined run passes 270 of 270
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-012 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `currentRepository()` reads `{"identity":"MichelKerkmeester/skilled-agent-harness_spec-driven-loops","source":"origin"}` from the origin remote.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script parses. Evidence: `node --check` on the shared module, both loaders, the gate and the hygiene helper exits 0.
- [x] CHK-011 [P0] No new warnings in the test output. Evidence: T014 to T017 print `fail 0` and no warning line.
- [x] CHK-012 [P1] Error handling: the legacy file throws its own code, the CI readers and the quality gate exit 3 with the move named, the doctor reports the same message as a config error, and a missing or malformed remote is an unknown repository, not a throw. Evidence: the loader and doctor runs in `acceptance-criteria.md` AC-002, and `repository-identity.test.cjs` "a repository with no origin remote reports nothing".
- [x] CHK-013 [P1] Code follows the existing module header, numbered sections and comment style, and names no spec id. Evidence: the comment-hygiene scan finds no tracker id, and `doctor-ci-contract.test.cjs` "no file the command ships names a requirement, decision or phase id" passes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] Each behavior change has a case: legacy refusal, foreign file, absent field, case-insensitive match, environment-first identity, the `.opencode/` twin and the init target. Evidence: the case names in T003 to T006.
- [x] CHK-022 [P1] Edge cases: https, ssh, scp-like, trailing slash and nested remote paths, a malformed remote, an unknown repository and a bad `repository` value each have a case.
- [x] CHK-023 [P1] Every fixture lives under `os.tmpdir()` and is removed after the case; `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding classes: the root path is `class-of-bug` across both loaders, and the silent cross-repository application is `cross-consumer` because the CI and quality readers both inherit it.
- [x] CHK-FIX-002 [P0] Same-class producers: `ci-profile.cjs`, `quality-config.cjs`, `ci-report.cjs`, `ci-toggle.cjs`, `ci-scaffold.cjs` and `quality-gate.cjs` all read or print the new path; `rg -n '\.sk-code/(ci|quality)\.json'` over the scripts hits only the refusal constants.
- [x] CHK-FIX-003 [P0] Consumers: the report, toggle, scaffold, quality gate and doctor quality each carry the field or the code, and the docs sweep names the new path.
- [x] CHK-FIX-004 [P0] Security: the identity is compared and never interpolated into a path or a command, and `GITHUB_REPOSITORY` must match `owner/name` before it is trusted.
- [x] CHK-FIX-005 [P1] Matrix: each loader runs against this repository, a foreign file, an absent field, a legacy file and the `.opencode/` twin, all green.
- [x] CHK-FIX-006 [P1] Hostile state: `GITHUB_REPOSITORY` set to a non-`owner/name` value is refused and the origin remote is read instead.
- [x] CHK-FIX-007 [P1] Evidence is against the worktree at `ae08ed911f` plus the uncommitted docs sweep in `worktrees/252-hub-config-in-skill-folder`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the identity is only compared.
- [x] CHK-031 [P0] Input validation: `repository` must match `owner/name`, and `GITHUB_REPOSITORY` is tested against the same pattern before use.
- [x] CHK-032 [P1] N/A: no auth surface beyond the operator's own git checkout.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files.
- [x] CHK-041 [P1] Code comments state why the identity is read before the file is trusted and why the old path is refused.
- [x] CHK-042 [P2] Five changelog entries written and the carriers stepped.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baselines and temp roots lived in the session scratchpad or `os.tmpdir()` only.
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

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->

---
