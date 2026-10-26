---
title: "Implementation Plan: Phase 3: config-and-doctor"
description: "Adds a layered repository config reader, argv-only configured checks behind a content-hash mutation guard, a read-only quality leg in the sk-code battery and an approval-gated route that creates the config."
trigger_phrases:
  - "config and doctor plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 3: config-and-doctor

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) for the runner, the config module and the doctor scripts. Python 3 is unchanged and only runs the hygiene checker |
| **Framework** | None. The scripts use Node built-ins (`node:fs`, `node:path`, `node:child_process`, `node:crypto`) |
| **Storage** | One committed JSON file, `.sk-code/quality.json`, at the repository root. No database |
| **Testing** | `node --test` for the quality and doctor suites, plus the existing bash suites and `route-validate.sh` |

### Overview
This phase reads one optional repository config, validates it before anything runs, merges it over the shipped base layer and turns its checks into argv entries with timeouts. Every spawned command is bracketed by a content-hash snapshot of the workspace, so a check that rewrites a file ends the run. The doctor gets a read-only `quality` leg in the battery and a separate `quality` target whose `init` is a dry run until `--apply`. Each step below has an acceptance line and one verify command, and the commands are the proof.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 and phase 002 files exist, and task T001 prints `present` for each of them
- [ ] Phase 1 checker flag names are recorded in `scratch/checker-args.md` (task T002)
- [ ] The design citations this phase repeats are re-checked at the current tree (task T003)

### Definition of Done
- [ ] All acceptance criteria in `acceptance-criteria.md` are `Met`
- [ ] `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` prints `# fail 0`
- [ ] `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends with `STATUS=OK legs=9`
- [ ] The packet gates print `RESULT: PASSED` and the five document validators exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered config reader with a single spawn path. Discovery picks one file, validation rejects it before any spawn, the merge combines it with the base layer, and one function spawns each command under the guard.

### Key Components
- **`lib/quality-config.cjs`**: discovery, JSON parse, schema validation, merge and suggestion reading. The runner and the doctor script both call it, so the doctor reads what the gate reads.
- **`lib/run-check.cjs`** (phase 2 file): the argv spawn with `shell: false`, the timeout and the process-group kill. This phase adds the content-hash snapshot around each configured spawn.
- **`scripts/quality-gate.cjs`** (phase 2 file): reads the config through `quality-config.cjs`, passes commentHygiene values to the checker, and writes `config` and `suggested_checks` into the verdict.
- **`.skilled/commands/doctor/scripts/sk-code-quality-config.cjs`**: `status`, `init` (dry run until `--apply`) and `check`. It uses `quality-config.cjs` and never spawns a configured command.
- **`.skilled/commands/doctor/scripts/sk-code-setup-check.cjs`**: one more entry in the LEGS array, which runs the quality checks in their check-only form.
- **Route surface**: a `quality` target in `_routes.yaml`, `doctor-sk-code-quality.yaml`, the shared presentation file and the command doc.

### Data Flow
Discovery returns one source and never falls back silently. Validation runs over the whole file and collects errors. Any repository config error exits 3 before a spawn. The merge keeps checks from the repository layer only. Each configured check becomes an argv array, a path match and a timeout. The guard takes a snapshot before and after each spawn, and a changed snapshot ends the run with exit 3. The verdict carries `config.source`, `config.errors` and `suggested_checks`.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is not a fix. The inventory below covers the consumers that the new route and the bridge rename touch. Each row names the grep that proves the change landed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scoring-compatibility.json` (advisor) | Maps each doctor bridge id to a `inventoryId`, and the deriver throws on an unknown one | update: replace `command-doctor-sk-code` with the two target ids | `rg -n '"command-doctor-sk-code"' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` prints nothing |
| `projection.ts`, `render.ts`, `skill_advisor.py` | Hardcode the old bridge id and its label | update to the new ids | `rg -n "command-doctor-sk-code['\"]" .skilled/skills/system-skill-advisor/runtime/lib .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` prints nothing |
| `doctor-ordering.vitest.ts`, `test_skill_advisor.py` | Assert the old id in ordering and recommendation tests | update | `rg -n "command-doctor-sk-code['\"]" .skilled/skills/system-skill-advisor/runtime/tests` prints nothing |
| `sk-code-setup-check.test.cjs` | Asserts eight PASS lines and `STATUS=OK legs=8` | update to nine and `legs=9` | `node --test .skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` prints `# fail 0` |
| `doctor-sk-code-setup.yaml`, `doctor-commands/doctor-sk-code-setup.md`, `manual-testing-playbook.md` DOC-382 | Describe eight legs and `legs=8` | update to nine and `legs=9` | `rg -n "legs=8\|eight legs" .skilled/skills/sk-code/manual-testing-playbook .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml` prints nothing |
| `check-comment-hygiene.sh` and the post-edit router | Phase 1 consumers of the checker | not changed by this phase | The checker call in each reader keeps its phase 1 form |
| `.github/workflows/comment-hygiene.yml` and pre-commit | Enforce the core hygiene set on whole files | not changed (ADR-003) | `rg -n "check-comment-hygiene" .github/workflows/comment-hygiene.yml` shows the same call as before the phase |
| Runtime prompt mirrors `.codex`, `.pi`, `.hermes` | Generated copies of the doctor command | regenerate with their sync scripts | Each sync script run with `--check` exits 0 |
| `.claude/commands/doctor/sk-code.md` | Symlink into `.skilled/commands/doctor` | none, it follows the edited source | `ls -l .claude/commands/doctor/sk-code.md` shows a link |

Required inventories:
- Same-class producers: `rg -n "command-doctor-sk-code|legs=8|eight legs" .skilled specs/system-skill-advisor` lists the live consumers. Historical packet records are left unchanged.
- Consumers of changed symbols: the bridge ids and the battery leg count listed above.
- Matrix axes: config state (absent, valid, invalid, path missing) by source (`--config`, git config file scope, git config command scope, repository file) by check outcome (absent tool, failing command, mutating command, passing command, suggested only).
- Algorithm invariant: discovery returns exactly one source, and a named path that is missing never falls back to the next source. Adversarial cases: a `--config` path outside the repository, a `skcode.qualityConfig` set with `git -c`, an argv element containing shell metacharacters that must reach the program as literal text, a ticket prefix containing regex metacharacters, an extra pattern that does not compile, and a `.sk-code` path that is a symlink to another folder.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

The four steps below group the ordered tasks in `tasks.md`. That file owns the checkboxes and the task state.

### Step 1: Config discovery and loading
What it does: adds `lib/quality-config.cjs` with the four-source discovery and the parse step, and proves each source in a test.
Acceptance: the discovery returns one source for each input state, and a named missing path exits 3 with `CONFIG_PATH_MISSING`.
Verify: `node --test --test-name-pattern="discovery|CONFIG_PATH_MISSING" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs` prints `# fail 0`.

### Step 2: Validation, merge, configured checks and the guard
What it does: adds schema validation and the merge rules, the argv spawn with timeouts, the content-hash guard, suggestions and the `generated` rows, then the F06 to F09 and F11 cases.
Acceptance: a configured check that rewrites a tracked file ends the run with `CHECK_MUTATED_WORKSPACE` and exit 3, a missing required tool exits 4, and a failing required P0 check exits 1.
Verify: `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` prints `# fail 0`.

### Step 3: Doctor script, battery leg and route
What it does: adds `sk-code-quality-config.cjs` with `status`, `init` and `check`, adds the quality leg to the battery, and adds the `quality` target with its YAML, presentation and command doc.
Acceptance: the battery lists a passing quality leg and ends with `STATUS=OK legs=9`, and `init` writes nothing until `--apply`, which refuses on the second run.
Verify: `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends with `STATUS=OK legs=9`, and `node --test .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` prints `# fail 0`.

### Step 4: Documents, advisor bridge, mirrors and versions
What it does: writes the template and its reference, renames the advisor bridge for the two targets, updates the hub playbook pins, regenerates the mirrors, and writes the changelogs and version bumps.
Acceptance: the route validator passes, every mirror `--check` exits 0, the old bridge id is gone from the runtime, and each newest changelog file matches its SKILL.md version.
Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0, and `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check` exits 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Discovery, JSON parse, schema validation, merge rules, ticket and extra-pattern checks, suggestion reading, the snapshot function | `node:test` in `tests/quality-config.test.cjs` and `tests/configured-checks.test.cjs` |
| Integration | F06, F07, F08, F09 and F11 against temporary git repositories built by the phase 2 fixture helper, plus the doctor script's dry run, apply and refusal | `node:test` in the quality suite and `tests/sk-code-quality-config.test.cjs` |
| Battery | The read-only setup battery with its new quality leg, and the repository status before and after the run | `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` and `git status --porcelain` |
| Manual | `init` against a temporary repository, then `init --apply` twice, reading each output line | Shell in a temporary folder |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 checker and its flag names | Internal | Yellow until T002 records the names | commentHygiene values cannot reach the checker, so REQ-013 waits |
| Phase 002 runner, layer probe, verdict, fixture helper and quality-defaults | Internal | Yellow until T001 prints `present` for each file | This phase has no base to extend |
| Node 22 in CI, `node:test` and `--test-name-pattern` | External | Green on this machine (Node v26.8.2), Green in CI (`node-version: '22'`) | Test selection fails on older Node |
| python3 on PATH | External | Green on this machine | The checker reports UNVERIFIED, and the battery's quality leg fails check 2 |
| PyYAML for `route-validate.sh` | External | Yellow until the verify step runs | The route validator cannot parse `_routes.yaml` |
| Git | External | Green | Without git, configured checks report `GUARD_UNAVAILABLE` |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a configured command rewrites tracked files in a real repository, the battery turns red after the phase lands, or the advisor stops recommending `/doctor:sk-code` for setup requests.
- **Procedure**: revert the phase commits with `git revert` on the landing commits. Repositories without `.sk-code/quality.json` see no change after a revert, because the file is opt-in. For the advisor, restore the single `command-doctor-sk-code` id in `scoring-compatibility.json`, regenerate `command-bridges.generated.json`, and rerun `doctor-phrase-reach.cjs`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-honest-checker ──► 002-builtin-runner ──► 003-config-and-doctor ──► 004-doctrine
                                                    │
                                                    ├──► 005-consumers-and-routing
                                                    └──► 006-measurement
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-honest-checker | None | 002-builtin-runner, 003-config-and-doctor (flag names) |
| 002-builtin-runner | 001-honest-checker | 003-config-and-doctor, 004-doctrine (build order) |
| 003-config-and-doctor | 001-honest-checker, 002-builtin-runner | 005-consumers-and-routing, 006-measurement |
| 004-doctrine | 002-builtin-runner (build order only, needs operator decisions D4 and D12) | 005-consumers-and-routing |
| 005-consumers-and-routing | 003-config-and-doctor, 004-doctrine | 006-measurement |
| 006-measurement | 003-config-and-doctor, 005-consumers-and-routing | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Assumption, not measured: the design rates this phase size M.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (T001 to T004) | Low | Under one hour |
| Core Implementation (T005 to T039) | Medium | Most of a working day, mainly the guard and the route files |
| Verification (T040 to T048) | Medium | About two hours, including the battery run and the packet gates |
| **Total** | | **About one working day (assumption)** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 001 and phase 002 files are present (T001)
- [ ] `git status --porcelain` is clean for the phase 002 files before this phase edits them
- [ ] A temporary repository is ready for the `init` run (T042)

### Rollback Procedure
1. Stop any run of the gate on the affected repository, so a half-applied check is not reused.
2. Revert the phase commits with `git revert`, then rerun `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs`.
3. Confirm the battery ends with `STATUS=OK legs=8` after the revert, which is the pre-phase count.
4. Remove any `.sk-code/quality.json` that an operator created during the trial, and name it in the operator note.

### Data Reversal
- **Has data migrations?** No. The config file is new and opt-in, and no existing file changes format.
- **Reversal procedure**: delete `.sk-code/quality.json` only where the operator confirms it was created by this phase. Git history shows the creation commit.
<!-- /ANCHOR:enhanced-rollback -->

---

