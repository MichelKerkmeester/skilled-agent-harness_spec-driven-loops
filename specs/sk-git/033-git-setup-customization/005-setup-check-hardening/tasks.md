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

- [x] T001 Record the baseline: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` pass and fail counts, the battery's `--tool claude` output and exit code on this checkout, and the failing `test_readme_manifest.py` and `validate_catalog_package.py` lines, each recorded in this task's evidence with the command that reproduces it (`.skilled/commands/doctor/scripts/tests/run-all.sh`) [EVIDENCE: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exit 0, 7 suites passed, node tests 302 of 302. `node .skilled/commands/doctor/scripts/git-setup-check.cjs --tool claude` ended `STATUS=OK checks=11`, exit 0, 0.61 s. `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py` exit 1, "frozen durable-directory manifest is not reproducible (added: .skilled/skills/sk-code/manual-testing-playbook/doctor-commands)". `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` exit 1, `root_leaf_title_mismatch` for `sk-git/doctor-git-settings.md`]
- [x] T002 Run the three inventories from `plan.md`'s FIX ADDENDUM and record each hit list in the task evidence (`plan.md`) [EVIDENCE: producers, 33 hits for `readFileSync|existsSync|spawnSync|runCommand(` in the battery, every repository read now goes through `readRepoFile` and every child through `GIT_BIN`, `BASH_BIN` or `process.execPath`. Consumers, 10 files name `git-setup-check`: the battery, its suite, `doctor-git-setup.yaml`, `_routes.yaml`, the root README, the catalog leaf, DOC-384, the playbook index, `scripts/README.md` and `tests/README.md`. The last two state no exit code or STATUS line, and `_routes.yaml` belongs to the parallel doctor routing build, so none of the three changed. Matrix axes as listed in `plan.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Status model (REQ-003)
- [x] T003 Add the `degraded` verdict constructor and fold rows into OK, DEGRADED or FAIL with exits 0, 3 and 1 in `renderHuman` and `main`. Print `repair:` for FAIL and DEGRADED rows, and update the header comment and the JSDoc return line (the battery) [EVIDENCE: `statusOf` folds FAIL to exit 1, UNKNOWN or DEGRADED to exit 3, else exit 0, and `repair:` prints for FAIL and DEGRADED rows. Mutation: the old fold restored made 2 tests fail, the fix restored passed]
- [x] T004 Replace the self-deriving outcome assertions with the twelve-row status matrix from `plan.md`, and update the `RESULTS` list and the two last-line assertions that pin the old contract (the suite, REQ-003, REQ-020) [EVIDENCE: test "the status fold maps rows to OK 0, DEGRADED 3 and FAIL 1 in both modes" runs the real `main()` with stubbed checks in a child process, six cases in two modes. Mutation as T003]

### Review P1 fixes
- [x] T005 Add the hook-flags resolver and parser, then rewrite `checkSuppression` to merge environment over file with per-value sources, the two aliases and a source-specific repair. Test with the master switch in a fixture `hook-flags.env` and absent from the environment, plus an empty environment value overriding a truthy file value (the battery and the suite, REQ-001) [EVIDENCE: tests "a master switch saved in hook-flags.env fails suppression and names its line" and "hook-flags.env parsing matches the hooks: BOM, quotes, trailing comment and HOOK_FLAGS_CONFIG". Mutation: old `checkSuppression` made 3 tests fail]
- [x] T006 Make `registersAdvisory` event- and matcher-aware per runtime. Move the Codex fixture from `SessionStart` to `PreToolUse` with matcher `exec|Bash`, and add for each of Claude, Codex, Devin and Cursor a real-shape PASS, a wrong-event FAIL and a wrong-matcher FAIL (the battery and the suite, REQ-002) [EVIDENCE: test "ai-tool-hooks accepts each runtime's real wiring and refuses a wrong event or matcher", 12 runs over four real configs. Mutation A, the old substring match, failed it at the wrong event. Mutation B, the matcher check replaced by `return true`, failed it at "claude: a matcher that misses the shell tool must not count"]
- [x] T007 Correct the Claude and Codex rows of section 3 to the wiring T006 enforces: Claude matcher `Bash`, Codex matcher `exec|Bash` (`.skilled/skills/sk-git/scripts/hooks/README.md`, REQ-002) [EVIDENCE: diff of `.skilled/skills/sk-git/scripts/hooks/README.md` changes only the Claude and Codex Event cells to matcher `Bash` and matcher `exec\|Bash`, column count unchanged]

### Truthful checks
- [x] T008 Gates row: UNKNOWN with no repair for a helper error, an unparsable report or a report without `gates`. DEGRADED with `/doctor:git hooks` for a saved-off gate. Drop `GATE_REGISTRY` from the helper's environment. One test per case (the battery and the suite, REQ-004) [EVIDENCE: tests "gates reports UNKNOWN with no repair when the helper fails or its report has no gates", "a gate saved off degrades the run to exit 3 with the hooks repair" and "gates ignores a GATE_REGISTRY inherited from the environment". Mutation A, old `checkGates`, failed 3. Mutation B, `GATE_REGISTRY` kept, failed the last one]
- [x] T009 AI-tool row: UNKNOWN with a `--tool` hint when no tool is active and nothing is broken, plus OpenCode and Pi content anchors. Tests for a tool-less run and for OpenCode and Pi files without their anchors (the battery and the suite, REQ-005) [EVIDENCE: tests "a run with no active tool and nothing broken is UNKNOWN and names --tool" and "opencode and pi pass only when the adapter registers its event and imports git-rule-checks.mjs". Mutation: old row failed 3 tests. A tool-less run outside Claude Code on this checkout exits 3]
- [x] T010 Worktree row: judge the base itself, fail a file at the base, and name the winning source in the repair. Tests for an existing unwritable base, a file at the base path and an environment-sourced base (the battery and the suite, REQ-006) [EVIDENCE: test "worktrees fails an unwritable base and a file at the base, and names the variable that set it". Mutation: old `checkWorktrees` failed it]

### Repairs
- [x] T011 Install repair: name each missing path in a `git -C <own checkout> restore --source=HEAD -- <path>` command, or reinstalling when the root is not a git work tree. Drop bare `/doctor:update` (the battery and the suite, REQ-008) [EVIDENCE: tests "install names a repair that restores missing sk-git files" and "install restores exactly the missing path of a git install root, and the restore turns the row PASS". Mutation: old `INSTALL_REPAIR` failed both]
- [x] T012 Standards repair: for the missing `skgit.contractDir` case, name `git config --<scope> --unset skgit.contractDir` with the scope read through `--show-scope`, or creating the directory. Keep `/doctor:git standards` for a malformed block (the battery and the suite, REQ-009) [EVIDENCE: tests "standards fails a missing configured contract dir and reports an absent contract", which applies the printed unset, and "standards names the global scope when the missing contract dir is set globally". Mutation: old repair failed both. The malformed block keeps `/doctor:git standards`]
- [x] T013 Hooks repair per option A: when the inspected repository shares this checkout's git common dir, name `bash <this checkout's root>/scripts/install-git-hooks.sh` by absolute path. Otherwise name `git config core.hooksPath <this checkout's root>/scripts/git-hooks`. Never name the inspected repository's installer. Tests assert both strings, including a foreign fixture that carries the toolchain sentinel (the battery and the suite, REQ-007) [EVIDENCE: tests "hooks accepts links into the repository's own hook sources and names a repair that exists", which asserts a sentinel clone still gets `core.hooksPath`, "hooks names this checkout's installer by absolute path when the inspected repository is the battery's own checkout" and "a foreign repository applying the printed core.hooksPath repair turns hooks PASS". Mutation: the old `repoTree` repair failed the first two]
- [x] T014 Repair round trips: for every repair line the battery can print, build the failing fixture, apply the repair as printed (or run the script its slash command runs), rerun the battery and assert the row is PASS. Rows covered are install, hooks, gates, standards, worktrees, commit-id, advisory-rules, suppression from the environment or the file and ai-tool-hooks for each runtime. The hooks case runs both branches of T013. For this checkout, the fixture is a repository holding a copy of the battery's install root, with its hook sources and the sentinel, so the battery's root shares the fixture's common dir. Running the printed installer there turns the row PASS. For another repository, a plain fixture gets the printed `git config core.hooksPath` command, and the row turns PASS (the suite, REQ-010) [EVIDENCE: one round trip per printable repair: install (T011 test), hooks both branches (T013 tests), standards (T012 test), and the six "round trip:" tests for gates, worktrees from git config and from the environment, commit-id, advisory-rules, suppression from the environment and from hook-flags.env, and ai-tool-hooks for all six runtimes. Mutations: a commit-id repair naming `--global` failed its round trip, a suppression repair naming the wrong line failed its round trip]

### Trust-boundary hardening
- [x] T015 [P] Delete `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and `GIT_COMMON_DIR` in `safeGitEnv`. Test with `GIT_DIR` exported to a second repository (the battery and the suite, REQ-017) [EVIDENCE: test "an exported GIT_DIR cannot point the probes at another repository". Mutation: old `safeGitEnv` failed it]
- [x] T016 Resolve `git` and `bash` once to absolute paths from absolute `PATH` entries, and use them in every child process. Test with `.`, an empty entry and a trailing `:` in `PATH` and a planted `./git` that writes a marker (the battery and the suite, REQ-018) [EVIDENCE: test "a relative or empty PATH entry cannot run a git or bash planted in the inspected repository" with `.`, an empty entry and a trailing `:`. Mutation: bare names failed it, and so did removing the `narrowPath()` call, which the build added because child scripts and in-process modules also look up git through PATH]
- [x] T017 Add the safe reader (regular file, size cap, optional symlink refusal) and route the adapter-config, hook-flags and allowlist reads through it. Test with a FIFO at a hook config path under a run timeout (the battery and the suite, REQ-016) [EVIDENCE: tests "readRepoFile reads only a regular file under the cap", eight adversarial cases, and "a FIFO at an adapter config path is reported, not read, and the run finishes". Mutation: plain reads failed both, the FIFO run was killed by its 20 s timeout]
- [x] T018 Refuse a symlinked or oversized allowlist and report it without echoing lines. Test with a symlink to a file outside the repository (the battery and the suite, REQ-019) [EVIDENCE: test "a symlinked allowlist is refused and none of its target lines are shown". Mutation: the read without `refuseSymlink` failed it]

### Test strength
- [x] T019 [P] No-write test: also snapshot the battery's own `skills/sk-git` and `commands/doctor` trees and a private `TMPDIR` passed to the child (the suite, REQ-022) [EVIDENCE: the no-write test now snapshots `skills/sk-git`, `commands/doctor` and a private TMPDIR. Mutation A, a write into the battery's own doctor tree, and mutation B, a write into the temp dir, each failed it]
- [x] T020 [P] Planted-helper test: plant `message-contract.mjs` under the fixture's `.skilled/skills/sk-git/scripts/lib/`, assert the standards row reached a contract verdict, then assert the marker is absent (the suite, REQ-023) [EVIDENCE: the untrusted-clone test plants `message-contract.mjs` and `git-rule-checks.mjs` and asserts the standards and advisory-rules rows were reached. Mutation: `checkStandards` importing from the inspected repository failed it]
- [x] T021 [P] Allowlist test with files under both `.skilled` and `.opencode` that carry different patterns, asserting the shown patterns are the matcher's file (the suite, REQ-024) [EVIDENCE: test "allowlist shows the patterns of the file the matcher used when both roots carry one". Mutation: the candidate order swapped failed it]
- [x] T022 Human-mode test asserting every row line and every `repair:` line for a fixture with several failures (the suite, REQ-021) [EVIDENCE: test "human mode prints every row and every repair line for a run with several failures". Mutation: the repair line printed for FAIL only failed it]

### CI fixes
- [x] T023 [P] Add a setup-node step and an install step that mirrors `sk-doc-script-tests.yml:42-48` (install system-spec-kit, build its `shared` package, install sk-doc) before the hook test scripts run (`.github/workflows/gate-inputs.yml`, REQ-011) [EVIDENCE: diff adds Setup Node and the install step before the hook tests. `bash .github/scripts/check-gate-inputs.sh` RESULT: PASSED, inputs resolved 215 to 218, failures=0. `bash .github/scripts/tests/check-gate-inputs.test.sh` 50 passed, 0 failed. The CI run itself needs a push, see T035]
- [x] T024 [P] Regenerate the manifest with `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write` and confirm the diff adds only `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands` (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, REQ-012) [EVIDENCE: `--write` run by the orchestrator, a scripted regeneration. The diff adds only `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands` and moves `derived_count` from 777 to 778. The test then exits 0, `reproduced=True`]
- [x] T025 [P] Set the leaf title to the root H3 text (`.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md:2`, REQ-013) [EVIDENCE: title is now "Repository settings and setup check". `validate_catalog_package.py` exits 0 with 0 violations]

### Docs
- [x] T026 Map exit 3 to a DEGRADED route status, print the three `STATUS=` lines and narrow the adapter promise to what T009 checks (`.skilled/commands/doctor/assets/doctor-git-setup.yaml`, REQ-003, REQ-005) [EVIDENCE: diff of `doctor-git-setup.yaml` lines 6, 41, 49, 50, 52 and 58-61. YAML parses. Exit 3 maps to DEGRADED]
- [x] T027 Print the target's real mutation class in the setup dashboard, and add the DEGRADED close and the DEGRADED row result to the setup result block (`.skilled/commands/doctor/assets/doctor-git-presentation.txt`, REQ-014, REQ-003) [EVIDENCE: diff of `doctor-git-presentation.txt` lines 89, 247, 251, 253 and 256. `route-validate.sh` exit 0]
- [x] T028 Fix DOC-384's precondition and exit codes, and the playbook summary row (`.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md`, `manual-testing-playbook.md:947`, REQ-015, REQ-003) [EVIDENCE: DOC-384 lines 26, 28 and 30 and playbook line 947 now state the precondition and the 0, 3, 1 and 2 exits]
- [x] T029 Update the exit-code sentences in the catalog leaf and the root README, and show `--tool` in the README's verify line (`doctor-git-settings.md:29`, `README.md:1505`, REQ-003) [EVIDENCE: catalog leaf line 29 and `README.md:1505` state 0, 3, 1 and 2 and the three STATUS closes, and the README shows `--tool`]
- [x] T030 Re-cite 002's AC-002 and AC-007 to the T006 and T022 tests, and replace the scratch-only evidence in 002 T002 and 034 T001 and T003 with rerunnable commands (`specs/sk-git/033-git-setup-customization/002-doctor-git-setup/`, `specs/sk-git/034-standards-template-round-trip/tasks.md`, REQ-021, REQ-025) [EVIDENCE: 002 AC-002 and AC-007 cite the T022 and T006 tests by name and line. 002 T002, 034 T001 and 034 T003 cite rerunnable commands. The 034 commands were rerun: the parsed contract hashes match at `6c2c3304d3^` and `6c2c3304d3`, and `git-standards.test.cjs` gives 8 of 10 at the parent and 10 of 10 at the fix. `repair-derived.cjs --apply` refreshed the graph metadata of 002 and 034 after the edits]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T031 Run `bash .skilled/commands/doctor/scripts/tests/run-all.sh` on the final state and report the delta against T001 [EVIDENCE: `run-all.sh` exit 0, 7 suites passed, 0 failed. Node tests 329 of 329 against 302 at T001, all 27 new tests in `git-setup-check.test.cjs` (17 to 44). Python 10, shell 35, 18 and 21, vitest 18, all unchanged. The warning lines match the baseline]
- [x] T032 Run `bash .skilled/commands/doctor/scripts/route-validate.sh`, `bash .github/scripts/tests/check-gate-inputs.test.sh` and `bash .github/scripts/check-gate-inputs.sh` [EVIDENCE: `route-validate.sh` "OK: route-validate - 14 routes validated, 2 warnings", the two H1 `--dry-run` notes. `check-gate-inputs.test.sh` 50 passed, 0 failed. `check-gate-inputs.sh` RESULT: PASSED]
- [x] T033 Run `hvr_scan.py` on every touched Markdown and text doc, and rerun `test_readme_manifest.py` and `validate_catalog_package.py` [EVIDENCE: `hvr_scan.py` hard blockers: catalog leaf 0, DOC-384 0, setup YAML 0, `README.md` 0, all added lines of the playbook and the presentation 0. Three files carried blockers before this phase and keep the same count: the hooks README 32, the playbook 53 and the presentation 4. `test_readme_manifest.py` exit 0, `validate_catalog_package.py` exit 0, its fixture tests ALL PASS]
- [x] T034 Run the battery with `--tool claude` on this checkout and confirm `STATUS=OK checks=11` and exit 0, then run DOC-384 through the real runtime [EVIDENCE: battery part done: `--tool claude` ends `STATUS=OK checks=11`, exit 0, 0.57 s against 0.61 s at T001, `--json` gives 11 rows with all five keys, `--tool nope` exits 2, and `git status --porcelain` and `git config --list --local` match before and after. DOC-384 run 2026-10-15 by the orchestrator in Claude Code through `/doctor:git setup`: eleven PASS rows with a source each, result block `Target: setup`, `Changed: none`, `STATUS=OK`; battery `--tool=claude` exit 0 `STATUS=OK checks=11`, `--json` 11 rows with all five keys, `--tool nope` exit 2 with the usage line, and `git config --list --local` and `git status --porcelain` identical before and after]
- [x] T035 Push only on the operator's instruction, then read the Gate Inputs, sk-doc Script Tests and Feature catalog runs with `gh run view` and record their conclusions [EVIDENCE: pushed `73e4bb6e06` on 2026-10-15: Gate Inputs run 38785057616 success with 0 `ERR_MODULE_NOT_FOUND` lines in its log, sk-doc Script Tests run 38785057551 success (it carries the catalog validator), Spec-Kit Check run 38785057574 success. No separate Feature catalog workflow exists, the catalog check runs inside sk-doc Script Tests]
- [x] T036 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-git/033-git-setup-customization --strict` and require `RESULT: PASSED` [EVIDENCE: `validate.sh specs/sk-git/033-git-setup-customization --strict` RESULT: PASSED for the parent and every phase]
- [x] T037 Record the `/doctor:git` work in the sk-git changelog and a new skilled release entry, added at the operator's request on 2026-10-15 [EVIDENCE: `.skilled/skills/sk-git/changelog/v1.9.0.0.md` (minor, new command) and `.skilled/changelog/skilled/v4.0.0.11.md`, both compact; `hvr_scan.py` hard blockers 0 and `validate_document.py` Total issues 0 on each; sk-git `SKILL.md` version 1.9.0.0 and its Hermes mirror synced]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (DOC-384 in Claude Code and by Luna through cli-codex)
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

- [x] CHK-010 [P0] `node --check` passes on the battery and the suite [EVIDENCE: `node --check` exit 0 on `git-setup-check.cjs` and on `git-setup-check.test.cjs`]
- [x] CHK-011 [P0] No new warning in `run-all.sh` output [EVIDENCE: the `run-all.sh` warning lines match the T001 baseline, no new one]
- [x] CHK-012 [P1] Every unreadable or unexpected input becomes a detail line, never a throw out of `main` [EVIDENCE: `readRepoFile` returns `{text, problem}` and never throws, a failed helper is UNKNOWN, a malformed hook-flags.env line is a detail, and the FIFO and symlink tests finish with detail lines]
- [x] CHK-013 [P1] Code follows the battery's existing patterns: verdict constructors, `runCommand` and comments that state the durable reason [EVIDENCE: new verdicts use the `degraded` constructor beside `pass`, `fail`, `skip` and `unknown`, every child goes through `runCommand`, new comments state the reason the code reads what it reads]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: 25 of 25 Met in acceptance-criteria.md]
- [x] CHK-021 [P0] DOC-384 run through the real runtime [EVIDENCE: run 2026-10-15 by the orchestrator in Claude Code through `/doctor:git setup`: eleven PASS rows with a source each, result block `Target: setup`, `Changed: none`, `STATUS=OK`; battery `--tool=claude` exit 0 `STATUS=OK checks=11`, `--json` 11 rows with all five keys, `--tool nope` exit 2 with the usage line, and `git config --list --local` and `git status --porcelain` identical before and after]
- [x] CHK-022 [P1] Edge cases tested: FIFO, symlink, empty env value, file at the base path, tool-less run [EVIDENCE: FIFO (T017), symlinked allowlist and the readRepoFile table (T017, T018), empty env value (suppression and `HOOK_FLAGS_CONFIG` tests), file at the base path (T010), tool-less run (T009)]
- [x] CHK-023 [P1] Each code fix has a recorded mutation check [EVIDENCE: every code fix task from T003 to T022 names its mutation in the task evidence, and each mutation failed at least one test, the original code then restored and compared with `cmp`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class [EVIDENCE: `plan.md` FIX ADDENDUM table, classes cross-consumer, matrix/evidence and trust-boundary]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (T002) [EVIDENCE: T002 evidence: 33 producer hits, every repository read goes through `readRepoFile`, every child through `GIT_BIN`, `BASH_BIN` or `process.execPath`]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the status line, the exit codes and every repair string (T002) [EVIDENCE: T002 evidence: 10 consumer files. The yaml, presentation, DOC-384, playbook index, catalog leaf and root README were updated. `scripts/README.md` and `tests/README.md` state no exit code, and `_routes.yaml` belongs to the parallel routing build]
- [x] CHK-FIX-004 [P0] The safe reader, the binary resolution and the matcher carry adversarial table tests (T006, T016, T017) [EVIDENCE: the matcher table (T006, 12 runs), the binary-resolution test with `.`, empty and trailing PATH entries (T016) and the eight-case readRepoFile table plus the FIFO test (T017)]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed [EVIDENCE: `plan.md` FIX ADDENDUM, status matrix of six rows by two modes, registration matrix of four runtimes by event by matcher]
- [x] CHK-FIX-006 [P1] Hostile env variant executed: `GIT_DIR`, `GATE_REGISTRY`, `HOOK_FLAGS_CONFIG`, `SPECKIT_WORKTREE_BASE` and a relative `PATH` entry (T008, T010, T015, T016) [EVIDENCE: `GIT_DIR` (T015), `GATE_REGISTRY` (T008), `HOOK_FLAGS_CONFIG` (T005), `SPECKIT_WORKTREE_BASE` (T010 and its round trip) and relative PATH entries (T016), each with a mutation that failed it]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range [EVIDENCE: the evidence is the working-tree diff against HEAD `828cb749da`, which touched none of the changed files. Nothing was committed in this phase]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: a grep of the added lines for key, secret, token and password finds nothing]
- [x] CHK-031 [P0] Every repository-sourced read goes through the safe reader, and every child process starts from an absolute binary [EVIDENCE: the only `readFileSync` calls left read `hard-rules.json` and `worktree-provision-paths.txt` under the battery's own root. Every repository file goes through `readRepoFile`, and `runCommand` starts `GIT_BIN`, `BASH_BIN` or `process.execPath`, refusing a null binary]
- [x] CHK-032 [P1] No repair line names code from the inspected repository [EVIDENCE: the hooks repair names this checkout's installer by absolute path or `git config core.hooksPath <own dir>`, the install repair is a `git restore` or a reinstall note, and the planted-helper test (T020) passes]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized [EVIDENCE: every file changed outside this folder is a row in `spec.md` Files to Change, and plan and tasks name the same set]
- [x] CHK-041 [P1] Code comments state the durable reason and carry no packet or finding IDs [EVIDENCE: a grep of the added code and test lines for REQ, AC, CHK, ADR, DOC ids, `specs/`, packet and phase finds nothing]
- [x] CHK-042 [P2] Every doc that states the exit codes shows 0, 1, 2 and 3 [EVIDENCE: the setup YAML, the presentation, DOC-384, the playbook row, the catalog leaf and `README.md:1505` all state 0, 3, 1 and 2]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: build temp files lived in the session scratchpad outside the repository. This folder's `scratch/` holds only `.gitkeep`]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `scratch/` holds only `.gitkeep`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 10/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-15
<!-- /ANCHOR:summary -->

---
