---
title: "Tasks: Phase 5: setup-check-hardening"
description: "Ordered briefs for hardening the /doctor:git setup battery: status model, the two review P1 fixes, truthful checks, safe repairs with round-trip proof, trust-boundary hardening, stronger tests, CI and docs."
trigger_phrases:
  - "setup check hardening tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: setup-check-hardening

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

**Task Format**: `T### [P?] Description (file path)`

Each implementation task is one brief to the cli-pi executor. The battery is `.skilled/commands/doctor/scripts/git-setup-check.cjs` and its suite is `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs`, shortened below to "the battery" and "the suite". Every code task writes its failing test first, and its evidence records the mutation check: fix reverted, test failing, fix restored, test passing.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` pass and fail counts, the battery's `--tool claude` output and exit code on this checkout, and the failing `test_readme_manifest.py` and `validate_catalog_package.py` lines, each recorded in this task's evidence with the command that reproduces it (`.skilled/commands/doctor/scripts/tests/run-all.sh`)
- [ ] T002 Run the three inventories from `plan.md`'s FIX ADDENDUM and record each hit list in the task evidence (`plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Status model (REQ-003)
- [ ] T003 Add the `degraded` verdict constructor and fold rows into OK, DEGRADED or FAIL with exits 0, 3 and 1 in `renderHuman` and `main`. Print `repair:` for FAIL and DEGRADED rows, and update the header comment and the JSDoc return line (the battery)
- [ ] T004 Replace the self-deriving outcome assertions with the twelve-row status matrix from `plan.md`, and update the `RESULTS` list and the two last-line assertions that pin the old contract (the suite, REQ-003, REQ-020)

### Review P1 fixes
- [ ] T005 Add the hook-flags resolver and parser, then rewrite `checkSuppression` to merge environment over file with per-value sources, the two aliases and a source-specific repair. Test with the master switch in a fixture `hook-flags.env` and absent from the environment, plus an empty environment value overriding a truthy file value (the battery and the suite, REQ-001)
- [ ] T006 Make `registersAdvisory` event- and matcher-aware per runtime. Move the Codex fixture from `SessionStart` to `PreToolUse` with matcher `exec|Bash`, and add for each of Claude, Codex, Devin and Cursor a real-shape PASS, a wrong-event FAIL and a wrong-matcher FAIL (the battery and the suite, REQ-002)
- [ ] T007 Correct the Claude and Codex rows of section 3 to the wiring T006 enforces: Claude matcher `Bash`, Codex matcher `exec|Bash` (`.skilled/skills/sk-git/scripts/hooks/README.md`, REQ-002)

### Truthful checks
- [ ] T008 Gates row: UNKNOWN with no repair for a helper error, an unparsable report or a report without `gates`. DEGRADED with `/doctor:git hooks` for a saved-off gate. Drop `GATE_REGISTRY` from the helper's environment. One test per case (the battery and the suite, REQ-004)
- [ ] T009 AI-tool row: UNKNOWN with a `--tool` hint when no tool is active and nothing is broken, plus OpenCode and Pi content anchors. Tests for a tool-less run and for OpenCode and Pi files without their anchors (the battery and the suite, REQ-005)
- [ ] T010 Worktree row: judge the base itself, fail a file at the base, and name the winning source in the repair. Tests for an existing unwritable base, a file at the base path and an environment-sourced base (the battery and the suite, REQ-006)

### Repairs
- [ ] T011 Install repair: name each missing path in a `git -C <own checkout> restore --source=HEAD -- <path>` command, or reinstalling when the root is not a git work tree. Drop bare `/doctor:update` (the battery and the suite, REQ-008)
- [ ] T012 Standards repair: for the missing `skgit.contractDir` case, name `git config --<scope> --unset skgit.contractDir` with the scope read through `--show-scope`, or creating the directory. Keep `/doctor:git standards` for a malformed block (the battery and the suite, REQ-009)
- [ ] T013 Hooks repair per option A: when the inspected repository shares this checkout's git common dir, name `bash <this checkout's root>/scripts/install-git-hooks.sh` by absolute path. Otherwise name `git config core.hooksPath <this checkout's root>/scripts/git-hooks`. Never name the inspected repository's installer. Tests assert both strings, including a foreign fixture that carries the toolchain sentinel (the battery and the suite, REQ-007)
- [ ] T014 Repair round trips: for every repair line the battery can print, build the failing fixture, apply the repair as printed (or run the script its slash command runs), rerun the battery and assert the row is PASS. Rows covered are install, hooks, gates, standards, worktrees, commit-id, advisory-rules, suppression from the environment or the file and ai-tool-hooks for each runtime. The hooks case runs both branches of T013. For this checkout, the fixture is a repository holding a copy of the battery's install root, with its hook sources and the sentinel, so the battery's root shares the fixture's common dir. Running the printed installer there turns the row PASS. For another repository, a plain fixture gets the printed `git config core.hooksPath` command, and the row turns PASS (the suite, REQ-010)

### Trust-boundary hardening
- [ ] T015 [P] Delete `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and `GIT_COMMON_DIR` in `safeGitEnv`. Test with `GIT_DIR` exported to a second repository (the battery and the suite, REQ-017)
- [ ] T016 Resolve `git` and `bash` once to absolute paths from absolute `PATH` entries, and use them in every child process. Test with `.`, an empty entry and a trailing `:` in `PATH` and a planted `./git` that writes a marker (the battery and the suite, REQ-018)
- [ ] T017 Add the safe reader (regular file, size cap, optional symlink refusal) and route the adapter-config, hook-flags and allowlist reads through it. Test with a FIFO at a hook config path under a run timeout (the battery and the suite, REQ-016)
- [ ] T018 Refuse a symlinked or oversized allowlist and report it without echoing lines. Test with a symlink to a file outside the repository (the battery and the suite, REQ-019)

### Test strength
- [ ] T019 [P] No-write test: also snapshot the battery's own `skills/sk-git` and `commands/doctor` trees and a private `TMPDIR` passed to the child (the suite, REQ-022)
- [ ] T020 [P] Planted-helper test: plant `message-contract.mjs` under the fixture's `.skilled/skills/sk-git/scripts/lib/`, assert the standards row reached a contract verdict, then assert the marker is absent (the suite, REQ-023)
- [ ] T021 [P] Allowlist test with files under both `.skilled` and `.opencode` that carry different patterns, asserting the shown patterns are the matcher's file (the suite, REQ-024)
- [ ] T022 Human-mode test asserting every row line and every `repair:` line for a fixture with several failures (the suite, REQ-021)

### CI fixes
- [ ] T023 [P] Add a setup-node step and an install step that mirrors `sk-doc-script-tests.yml:42-48` (install system-spec-kit, build its `shared` package, install sk-doc) before the hook test scripts run (`.github/workflows/gate-inputs.yml`, REQ-011)
- [ ] T024 [P] Regenerate the manifest with `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write` and confirm the diff adds only `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands` (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, REQ-012)
- [ ] T025 [P] Set the leaf title to the root H3 text (`.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md:2`, REQ-013)

### Docs
- [ ] T026 Map exit 3 to a DEGRADED route status, print the three `STATUS=` lines and narrow the adapter promise to what T009 checks (`.skilled/commands/doctor/assets/doctor-git-setup.yaml`, REQ-003, REQ-005)
- [ ] T027 Print the target's real mutation class in the setup dashboard, and add the DEGRADED close and the DEGRADED row result to the setup result block (`.skilled/commands/doctor/assets/doctor-git-presentation.txt`, REQ-014, REQ-003)
- [ ] T028 Fix DOC-384's precondition and exit codes, and the playbook summary row (`.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md`, `manual-testing-playbook.md:947`, REQ-015, REQ-003)
- [ ] T029 Update the exit-code sentences in the catalog leaf and the root README, and show `--tool` in the README's verify line (`doctor-git-settings.md:29`, `README.md:1505`, REQ-003)
- [ ] T030 Re-cite 002's AC-002 and AC-007 to the T006 and T022 tests, and replace the scratch-only evidence in 002 T002 and 034 T001 and T003 with rerunnable commands (`specs/sk-git/033-git-setup-customization/002-doctor-git-setup/`, `specs/sk-git/034-standards-template-round-trip/tasks.md`, REQ-021, REQ-025)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T031 Run `bash .skilled/commands/doctor/scripts/tests/run-all.sh` on the final state and report the delta against T001
- [ ] T032 Run `bash .skilled/commands/doctor/scripts/route-validate.sh`, `bash .github/scripts/tests/check-gate-inputs.test.sh` and `bash .github/scripts/check-gate-inputs.sh`
- [ ] T033 Run `hvr_scan.py` on every touched Markdown and text doc, and rerun `test_readme_manifest.py` and `validate_catalog_package.py`
- [ ] T034 Run the battery with `--tool claude` on this checkout and confirm `STATUS=OK checks=11` and exit 0, then run DOC-384 through the real runtime
- [ ] T035 Push only on the operator's instruction, then read the Gate Inputs, sk-doc Script Tests and Feature catalog runs with `gh run view` and record their conclusions
- [ ] T036 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-git/033-git-setup-customization --strict` and require `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: `spec.md` section 4, REQ-001 to REQ-025 with cited lines]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: `plan.md` sections 3 and 4]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: the hooks-repair question was resolved on 2026-10-15 with option A, `spec.md` section 10]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` passes on the battery and the suite
- [ ] CHK-011 [P0] No new warning in `run-all.sh` output
- [ ] CHK-012 [P1] Every unreadable or unexpected input becomes a detail line, never a throw out of `main`
- [ ] CHK-013 [P1] Code follows the battery's existing patterns: verdict constructors, `runCommand` and comments that state the durable reason
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] DOC-384 run through the real runtime
- [ ] CHK-022 [P1] Edge cases tested: FIFO, symlink, empty env value, file at the base path, tool-less run
- [ ] CHK-023 [P1] Each code fix has a recorded mutation check
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class [EVIDENCE: `plan.md` FIX ADDENDUM table, classes cross-consumer, matrix/evidence and trust-boundary]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (T002)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the status line, the exit codes and every repair string (T002)
- [ ] CHK-FIX-004 [P0] The safe reader, the binary resolution and the matcher carry adversarial table tests (T006, T016, T017)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed [EVIDENCE: `plan.md` FIX ADDENDUM, status matrix of six rows by two modes, registration matrix of four runtimes by event by matcher]
- [ ] CHK-FIX-006 [P1] Hostile env variant executed: `GIT_DIR`, `GATE_REGISTRY`, `HOOK_FLAGS_CONFIG`, `SPECKIT_WORKTREE_BASE` and a relative `PATH` entry (T008, T010, T015, T016)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Every repository-sourced read goes through the safe reader, and every child process starts from an absolute binary
- [ ] CHK-032 [P1] No repair line names code from the inspected repository
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] Code comments state the durable reason and carry no packet or finding IDs
- [ ] CHK-042 [P2] Every doc that states the exit codes shows 0, 1, 2 and 3
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 3/12 |
| P1 Items | 13 | 2/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-15
<!-- /ANCHOR:summary -->

---
