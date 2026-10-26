---
title: "Tasks: Phase 3: config-and-doctor"
description: "Task Format: T### [P?] Description (file path). Verify: command prints expected output"
trigger_phrases:
  - "config and doctor tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 3: config-and-doctor

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

Shell variables used below. `Q` is `.skilled/skills/sk-code/sk-code-quality`. `P` is `specs/sk-code/015-quality-agnostic-gate/003-config-and-doctor`. `D` is `.skilled/commands/doctor`.

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every task that creates code states that its comments hold the durable reason only. No packet path, phase number, REQ, ADR or task id goes into a code comment.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the phase 001 and phase 002 files this phase extends are present (`Q/scripts/quality-gate.cjs`, `Q/scripts/lib/run-check.cjs`, `Q/assets/quality-defaults.json`, `Q/references/runner-contract.md`, `Q/scripts/tests/fixtures.cjs`). Verify: `test -f Q/scripts/quality-gate.cjs && echo present && test -f Q/scripts/lib/run-check.cjs && echo present && test -f Q/assets/quality-defaults.json && echo present && test -f Q/references/runner-contract.md && echo present && test -f Q/scripts/tests/fixtures.cjs && echo present` prints `present` five times.
- [ ] T002 Record the phase 001 checker flag names for ticket prefixes, extension families and extra patterns in `P/scratch/checker-args.md` (read only: `Q/scripts/check-comment-hygiene.sh`). Verify: `rg -n '^- `--' P/scratch/checker-args.md` prints three lines, one per flag.
- [ ] T003 [P] Re-check each design citation this phase repeats against the current tree, and record any moved line in `P/scratch/citations.md` (read only: `D/scripts/sk-code-setup-check.cjs`, `D/_routes.yaml`, `D/sk-code.md`). Verify: `rg -n "const LEGS" .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` prints `97:const LEGS = [`.
- [ ] T004 [P] Confirm the empty-tree object id the mutation snapshot uses in a repository with no commit (read only, no file written). Verify: `git hash-object -t tree /dev/null` prints `4b825dc642cb6eb9a060e54bf8d69288fbee4904`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Create discovery and file reading in `Q/scripts/lib/quality-config.cjs`: the four sources in order (`--config PATH` relative to the working directory, file-scoped `skcode.qualityConfig` from `git config --show-scope --get-all`, `.sk-code/quality.json` at the repository root, none), with `command`-scope values ignored (REQ-001, REQ-002). In the same change, replace the phase 002 rejection of `--config` in `Q/scripts/quality-gate.cjs` with a call into this discovery, so the flag sets `config.source` to `cli`. Verify: `node --check Q/scripts/lib/quality-config.cjs` exits 0 with no output, and `node Q/scripts/quality-gate.cjs --config /nonexistent/quality.json --no-run || echo "exit=$?"` prints `CONFIG_PATH_MISSING` in its JSON and then `exit=3`.
- [ ] T006 [P] Create `Q/scripts/tests/quality-config.test.cjs` with one discovery case per source, the `CONFIG_PATH_MISSING` case, and the F11 case where a `git -c` value is ignored (REQ-001, REQ-002, REQ-016). Update the phase 002 `unit: flags` case in `Q/scripts/tests/quality-gate.test.cjs`, so `--config` with an existing file no longer exits 3. Verify: `node --test --test-name-pattern="unit: flags" Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`, and `node --test --test-name-pattern="discovery|CONFIG_PATH_MISSING" Q/scripts/tests/quality-config.test.cjs` prints `# fail 0`.
- [ ] T007 Add schema validation and the merge rules of design section 4.2 to `Q/scripts/lib/quality-config.cjs`: `schemaVersion` 1, unknown keys and malformed fields into `config.errors`, `CONFIG_INVALID` for any repository error, and the ticket-prefix and extra-pattern checks (REQ-003, REQ-004, REQ-013). Verify: `node --check Q/scripts/lib/quality-config.cjs` exits 0 with no output.
- [ ] T008 [P] Add the validation and merge cases to `Q/scripts/tests/quality-config.test.cjs`: a duplicate check id, `enabled: false` on an exact sensor, a ticket prefix with a symbol, an extra pattern over 200 characters, and an empty config file, which is a parse error (REQ-003, REQ-004, REQ-013). Verify: `node --test --test-name-pattern="CONFIG_INVALID|merge|ticket|extraPatterns" Q/scripts/tests/quality-config.test.cjs` prints `# fail 0`.
- [ ] T009 Add the argv spawn with `shell: false`, the per-check timeout and the process-group kill to `Q/scripts/lib/run-check.cjs` (REQ-005, REQ-009). In the same change, match each configured check to in-scope files by `languages` and `paths`, expand `{files}` relative to the check's `cwd`, run a check with no `{files}` once per `cwd` group (`"."` or the nearest `"package"` folder holding `package.json`, `pyproject.toml`, `Cargo.toml` or `go.mod`), report `NOT_APPLICABLE` with no match, and default `required` to true for P0 and false for P1 and P2, as design section 4.3 states. Verify: `rg -n "shell: *true" Q/scripts/lib/run-check.cjs` prints nothing and exits 1.
- [ ] T010 Wire the content-hash snapshot around each configured spawn in `Q/scripts/lib/run-check.cjs`: `git diff --binary HEAD`, the untracked list from `git ls-files --others --exclude-standard -z`, `git hash-object` without `-w`, the empty tree when no commit exists, and `GUARD_UNAVAILABLE` without git (REQ-006). Verify: `rg -n "hash-object" Q/scripts/lib/run-check.cjs` prints at least one line, and `rg -n "hash-object.* -w" Q/scripts/lib/run-check.cjs` prints nothing.
- [ ] T011 Add `suggested_checks` reading to `Q/scripts/quality-gate.cjs` for `package.json` scripts, `pyproject.toml` tools, `Cargo.toml`, `go.mod`, the workflow files and a Makefile `lint` target, and exclude `test`, `fix`, `format`, and any script containing `--write` or `--fix` (REQ-007). Verify: `node --check Q/scripts/quality-gate.cjs` exits 0 with no output.
- [ ] T012 Pass the validated `commentHygiene` values to the checker in `Q/scripts/quality-gate.cjs`, using only the flag names recorded in T002 (REQ-013). Verify: `rg -n "ticketPrefixes|extraPatterns" Q/scripts/quality-gate.cjs` prints at least two lines.
- [ ] T013 Add `generated` rows as path-scoped configured checks in `Q/scripts/quality-gate.cjs`, under the same argv and guard path as `checks` (REQ-014). Verify: `rg -n "generated" Q/scripts/quality-gate.cjs` prints at least one line.
- [ ] T014 [P] Create `Q/scripts/tests/configured-checks.test.cjs` with F06 (absent required tool), F07 (failing required P0 check), F08 (mutating check), F09 (suggestion only, no canary file), a no-git run where a configured check reports `GUARD_UNAVAILABLE`, an argv element with shell metacharacters that reaches the program as literal text, a timeout that reports `TIMEOUT`, a `--no-run` listing that spawns nothing, a `{files}` check under `cwd: "package"` that receives only the files of its package, a check with no matching file that reports `NOT_APPLICABLE`, and a `generated` row whose path matches a changed file. Built with the phase 002 fixture helper and secret-free strings (REQ-005 to REQ-009, REQ-014, REQ-016). Verify: `node --test Q/scripts/tests/configured-checks.test.cjs` prints `# fail 0`.
- [ ] T015 Create `D/scripts/sk-code-quality-config.cjs` with `status`, `init` (a dry run until `--apply`, which writes a temporary file and hard-links it to the target, and refuses when `.sk-code` resolves outside the repository) and `check`, each with `--json`, using `Q/scripts/lib/quality-config.cjs` and spawning no configured command (REQ-010, NFR-S02). Verify: `node --check D/scripts/sk-code-quality-config.cjs` exits 0 with no output.
- [ ] T016 [P] Create `D/scripts/tests/sk-code-quality-config.test.cjs` for the dry run that writes nothing, the apply that creates the file once, the second apply that refuses with `CONFIG_EXISTS` and exit 1 and leaves the file byte-identical, and the no-spawn guarantee (REQ-010, NFR-R01). Verify: `node --test D/scripts/tests/sk-code-quality-config.test.cjs` prints `# fail 0`.
- [ ] T017 Create `Q/assets/quality-config.template.json` with `schemaVersion` 1, the schema keys and no comment keys, so that the file passes the schema (REQ-017). Verify: `python3 -m json.tool Q/assets/quality-config.template.json > /dev/null && echo parsed` prints `parsed`.
- [ ] T018 [P] Create `Q/references/quality-config.md` covering the schema, the discovery order, the merge rule, the error codes, the trust boundary and the residual regex cost (REQ-017). Verify: `rg -o "CONFIG_PATH_MISSING|CONFIG_INVALID|CHECK_MUTATED_WORKSPACE|GUARD_UNAVAILABLE" Q/references/quality-config.md | sort -u | wc -l` prints `4`.
- [ ] T019 Add the quality leg with its five sub-checks to `D/scripts/sk-code-setup-check.cjs`, after the probe entry in the LEGS array (lines 97 to 149), read only, with a repair line for each failing sub-check (REQ-011). Verify: `node D/scripts/sk-code-setup-check.cjs` prints a line that starts with `PASS  quality`.
- [ ] T020 Update `D/scripts/tests/sk-code-setup-check.test.cjs` from eight PASS lines and `legs=8` to nine PASS lines and `legs=9`, at its header comment, the happy-path test and the summary assertion (REQ-011, REQ-020). Verify: `node --test D/scripts/tests/sk-code-setup-check.test.cjs` prints `# fail 0`.
- [ ] T021 Add the `quality` target to `D/_routes.yaml` after the `/doctor:sk-code setup` route (after line 241). Set `mutating: mutates`, a `gate3_location` that names `.sk-code/` at the repository root, `allowed_flags: ["--dry-run"]` and three or more word trigger phrases (REQ-012). Verify: `rg -n "target: quality" D/_routes.yaml` prints one line.
- [ ] T022 Create `D/assets/doctor-sk-code-quality.yaml`, modeled on `D/assets/doctor-git-standards.yaml`, with the status step, the dry-run init step, the approval step and the apply step, and a mutation boundary that names `.sk-code/quality.json` only (REQ-012). Verify: `bash D/scripts/route-validate.sh` exits 0.
- [ ] T023 Extend `D/assets/doctor-sk-code-presentation.txt` with the argument wording for `setup` or `quality`, the quality result table, the quality result templates and the troubleshooting rows for the route (REQ-012). Verify: `rg -c "quality" D/assets/doctor-sk-code-presentation.txt` prints a count of at least 5.
- [ ] T024 Update `D/assets/doctor-sk-code-setup.yaml` at lines 49, 50 and 58 from eight legs and `legs=8` to nine legs and `legs=9`, and name the quality leg in the leg list (REQ-011, REQ-020). Verify: `rg -n "eight|legs=8" D/assets/doctor-sk-code-setup.yaml` prints nothing and exits 1.
- [ ] T025 Add the `/doctor:sk-code quality` row beside `/doctor:sk-code setup` in the target list of `D/assets/doctor-setup-presentation.txt` (REQ-012). Verify: `rg -n "doctor:sk-code quality" D/assets/doctor-setup-presentation.txt` prints one line.
- [ ] T026 Update `D/sk-code.md`: the argument hint on line 3, the mode routing lines 31 to 34 (setup stays the default), the execution target table at lines 43 to 45 with a `quality` row, and the workflow summary at line 61 (REQ-012). Verify: `rg -c "quality" D/sk-code.md` prints a count of at least 4.
- [ ] T027 Replace the `command-doctor-sk-code` entries at lines 165 to 167 and 452 to 454 of `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` with the two new ids, `command-doctor-sk-code-setup` and `command-doctor-sk-code-quality`, and keep each inventory id equal to its id (REQ-015). Verify: `rg -n '"command-doctor-sk-code"' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` prints nothing and exits 1.
- [ ] T028 Update the hardcoded bridge id and label in `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` (lines 368 to 370) and `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` (line 126) to the two new ids (REQ-015). Verify: `rg -n "'command-doctor-sk-code'" .skilled/skills/system-skill-advisor/runtime/lib` prints nothing and exits 1.
- [ ] T029 Update the hardcoded bridge id in `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` (lines 2596 to 2599) to the two new ids (REQ-015). Verify: `rg -n '"command-doctor-sk-code"' .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` prints nothing and exits 1.
- [ ] T030 Update the assertions that name the old id in `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-ordering.vitest.ts` (lines 215 and 221) and `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` (lines 1120 and 1162) (REQ-015). Verify: `rg -n "command-doctor-sk-code['\"]" .skilled/skills/system-skill-advisor/runtime/tests` prints nothing and exits 1.
- [ ] T031 Regenerate `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` with `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs`, which runs after T027 (REQ-015). Verify: the command exits 0, and `rg -c "command-doctor-sk-code-quality" .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` prints a count of at least 1.
- [ ] T032 Update `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md` from eight legs and `legs=8` to nine legs and `legs=9`, at every occurrence (REQ-020). Verify: `rg -n "legs=8|eight legs|eight PASS" .skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md` prints nothing and exits 1.
- [ ] T033 Update the DOC-382 row at line 269 and the battery overview at line 48 of `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` from eight legs and `legs=8` to nine and `legs=9` (REQ-020). Verify: `rg -n "legs=8|eight legs" .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` prints nothing and exits 1.
- [ ] T034 Regenerate the Codex prompt mirror `.codex/prompts/doctor-sk-code.md` with `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs`, and never edit the mirror by hand (REQ-019). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check` exits 0.
- [ ] T035 Regenerate the Pi prompt mirror `.pi/prompts/doctor-sk-code.md` with `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs` (REQ-019). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check` exits 0.
- [ ] T036 Regenerate the Hermes prompt mirror `.hermes/prompts/doctor-sk-code.md` with `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs` (REQ-019). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check` exits 0.
- [ ] T037 Write the sk-code-quality changelog entry for the next minor version after the version current at landing (1.6.0.0 once phases 001 and 002 land, so 1.7.0.0) in `Q/changelog/`, and bump `Q/SKILL.md` to that version with one reference line for `references/quality-config.md` (REQ-017, REQ-018). Verify: `ls Q/changelog | sort -V | tail -1` prints the new file, and `rg -n "^version:" Q/SKILL.md` prints the same version.
- [ ] T038 Write the sk-code hub changelog entry in `.skilled/skills/sk-code/changelog/` for the next minor version after the hub version current at landing (3.2.0.0 once phases 001 and 002 land, so 3.3.0.0), and bump the four version carriers, `.skilled/skills/sk-code/SKILL.md` line 5, `.skilled/skills/sk-code/hub-router.json` line 3, `.skilled/skills/sk-code/mode-registry.json` line 3 and `.skilled/skills/sk-code/description.json` line 4, to that version (REQ-018). Verify: `rg -c '"version": "3\.3\.0\.0"|^version: 3\.3\.0\.0' .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json .skilled/skills/sk-code/description.json` prints `1` for each file.
- [ ] T039 Write `.skilled/skills/system-skill-advisor/changelog/v0.17.1.0.md` as a patch entry for the bridge rename, and bump `.skilled/skills/system-skill-advisor/SKILL.md` from 0.17.0.0 to 0.17.1.0 (REQ-018). Verify: `rg -n "^version:" .skilled/skills/system-skill-advisor/SKILL.md` prints `version: 0.17.1.0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T040 Run the quality suite with `node --test Q/scripts/tests/*.test.cjs` (REQ-016). Verify: the output ends with `# fail 0`.
- [ ] T041 Run the battery and prove the repository is unchanged. Capture `git status --porcelain` into two files in a directory from `mktemp -d`, outside the repository, before and after `node D/scripts/sk-code-setup-check.cjs`, and record the battery wall time in `implementation-summary.md` (REQ-011, NFR-P02). Verify: the battery ends with `STATUS=OK legs=9`, and `cmp` on the two captures exits 0.
- [ ] T042 Run `init` in a temporary git repository: a dry run, an apply, then a second apply (REQ-010, NFR-R01). Verify: the dry run prints `STATUS=OK MODE=DRY_RUN` and leaves `git status --porcelain` empty, the apply prints `STATUS=OK MODE=APPLIED`, and the second apply prints `STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS` with exit 1.
- [ ] T043 Run the route validator and the command catalog check (REQ-012, REQ-019). Verify: `bash D/scripts/route-validate.sh` exits 0 and `node D/scripts/command-catalog-mirror-check.cjs` exits 0.
- [ ] T044 Run the three prompt mirror checks (REQ-019). Verify: each of `sync-prompts.cjs --check`, `sync-prompts-pi.cjs --check` and `sync-prompts-hermes.cjs --check` exits 0.
- [ ] T045 Run the doctor phrase probe (REQ-015). Verify: `node D/scripts/doctor-phrase-reach.cjs` exits 0 and reports the phrases of the `quality` bridge as reaching it.
- [ ] T046 Run the hygiene checker over the new `.cjs` files created by this phase (REQ-016 comment rule). Verify: `python3 Q/scripts/check-comment-hygiene.sh Q/scripts/lib/quality-config.cjs D/scripts/sk-code-quality-config.cjs` exits 0 and prints no finding line.
- [ ] T047 Run the packet gates on `P`: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder P --apply`, then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh P --strict --no-recursive`, then `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py --type spec` on each of the five spec documents. Verify: the validator prints `RESULT: PASSED`, and each command exits 0.
- [ ] T048 Mark each acceptance row `Met` only where its verification was observed, write `changelog/changelog-015-003-config-and-doctor.md` in the parent packet, and fill `implementation-summary.md` with the observed results (REQ-018). Verify: `rg -c "Unmet" P/acceptance-criteria.md` prints `0`, and `ls specs/sk-code/015-quality-agnostic-gate/changelog/` lists the changelog file.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T041 and T042)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](spec.md)
- **Plan**: See [plan.md](plan.md)
- **Acceptance criteria**: See [acceptance-criteria.md](acceptance-criteria.md)
- **Decisions**: See [decision-record.md](decision-record.md)
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

- [ ] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001 to REQ-020). Verify: `rg -c "^\| REQ-0" spec.md` prints 20.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`, with four steps. Verify: `rg -c "^### Step " plan.md` prints 4.
- [ ] CHK-003 [P1] Phase 001 and phase 002 files present, and phase 001 flag names recorded. Verify: T001 and T002 print their expected output.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every new or changed `.cjs` file in this phase passes `node --check`, including `run-check.cjs`, `quality-gate.cjs` and `sk-code-setup-check.cjs`. Verify: `node --check` exits 0 for each file.
- [ ] CHK-011 [P0] The quality suite and the doctor suites report no failure. Verify: `node --test` on each suite prints `# fail 0`.
- [ ] CHK-012 [P1] Each config error and each exit code has one named code that a test asserts (`CONFIG_PATH_MISSING`, `CONFIG_INVALID`, `CHECK_MUTATED_WORKSPACE`, `GUARD_UNAVAILABLE`, `CONFIG_EXISTS`). Verify: `rg -c` for each code in the tests prints at least 1.
- [ ] CHK-013 [P1] New code follows the sk-git resolver and the `git-standards.cjs` dry-run pattern. Verify: a reviewer reads both files against the new module and records the result in `implementation-summary.md`.
- [ ] CHK-014 [P0] New code comments state the durable reason only. Verify: T046 exits 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c "Unmet" acceptance-criteria.md` prints 0 at close.
- [ ] CHK-021 [P0] Manual testing complete. Verify: T041 and T042 print their expected output.
- [ ] CHK-022 [P1] Edge cases tested: a missing path, a `git -c` value, a symlinked `.sk-code` folder, and an empty config file. Verify: the four named cases appear in the test names.
- [ ] CHK-023 [P1] Error scenarios validated: a required tool absent, a failing command, a mutating command and no git repository. Verify: F06, F07, F08 and the no-git case pass in `configured-checks.test.cjs`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for the bridge id and the leg count. Verify: the grep in the affected-surfaces table prints nothing for the old id and the old count.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the bridge id, the battery output, the playbook pins and the mirrors. Verify: the affected-surfaces table lists each row with a verification command.
- [ ] CHK-FIX-004 [P0] Argv, path and parser cases have adversarial tests: a `--config` path outside the repository recorded with source `cli`, a shell metacharacter in an argv element that reaches the program as literal text, a ticket prefix with a symbol, and an extra pattern that does not compile. Verify: each case exists in the test files.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: the matrix axes in `plan.md` section 1 are the ones the tests cover.
- [ ] CHK-FIX-006 [P1] Hostile environment variant executed: a `skcode.qualityConfig` value supplied with `git -c`. Verify: F11 passes in `quality-config.test.cjs`.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a commit SHA recorded in `implementation-summary.md`, not a moving branch range. Verify: the summary names one SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret appears in any fixture or config. Verify: `rg -n -e "PRIVATE KEY" -e "AKIA" -e "ghp_" D/scripts/tests Q/scripts/tests` prints nothing and exits 1.
- [ ] CHK-031 [P0] Input validation implemented for every config field (T007). Verify: the `CONFIG_INVALID` tests pass.
- [ ] CHK-032 [P0] The trust boundary holds: only the repository layer names commands, and the doctor never spawns one. Verify: `rg -n "spawn|execFile|exec(Sync)?\(" D/scripts/sk-code-quality-config.cjs` prints nothing and exits 1.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same phase dependencies and the same task range. Verify: `rg -n "001-honest-checker|002-builtin-runner" spec.md plan.md` lists both files.
- [ ] CHK-041 [P1] Code comments are adequate and state the durable reason. Verify: CHK-014 passes.
- [ ] CHK-042 [P1] README updated if applicable. Verify: the quality README is unchanged in this phase, and `references/quality-config.md` is the reference for the config.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary files live in `P/scratch/` or in a `mktemp -d` folder outside the repository. Verify: `git status --porcelain` lists no temporary file outside `scratch/`.
- [ ] CHK-051 [P1] `P/scratch/` is cleaned before completion, and only `.gitkeep` remains there. Verify: `ls -A P/scratch` prints `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | [ ]/14 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

