---
title: "Implementation Plan: Phase 8: cleanup-wiring-and-gating"
description: "Harden the lane cleanup tool, give it a one-run shared-model answer and an askFirst report field, run it from /doctor:update apply right after the rebuild prompt, and make its repo mode block in a new advisory-checks.yml job and a doctor node:test. Proof: repo mode 0 on the phase commit, the planted-term fixture 1, machine mode 0 on a fixture, and two fixture runs that each ask once and leave nothing behind."
trigger_phrases:
  - "cleanup wiring and gating plan"
  - "lane cleanup doctor wiring plan"
  - "residue gate ci job plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: cleanup-wiring-and-gating

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`sweep-lane-residue.mjs`, Node built-ins and `node:sqlite` only), TypeScript under Vitest for its test, CommonJS node:test for the doctor tests, YAML and text for the doctor workflow and presentation, GitHub Actions YAML, Markdown |
| **Framework** | The `/doctor:update` workflow contract (one startup approval, a post-apply battery, a rebuild prompt, a state log), the repository's switch convention for CI jobs (`vars.SKILLED_CI` and a group variable), the doctor test runner `run-all.sh` |
| **Storage** | None of its own. The tool reads SQLite files read-only in machine mode and deletes fixed file names in apply mode; the doctor state log gains one field |
| **Testing** | The sweep Vitest suite (51 cases at the start), `doctor-update-contract.test.cjs`, a new `lane-residue-gate.test.cjs`, `run-all.sh`, `route-validate.sh`, `actionlint`, `check-gate-inputs.sh`, `ci-report.cjs`, the mirror and link checks, the generator check modes and the advisor behavior probes |

### Overview
The tool changes first: the four hardening items, the `--shared-model delete|keep` answer for apply, an `askFirst` list in its reports and the index check in repo mode, each with a Vitest case and the two goal proofs (machine mode 0 on a fixture, two runs that each ask). The doctor workflow then calls it after the rebuild prompt, asking the tool's own question when `askFirst` is not empty and passing the answer for that run only. Repo mode becomes a gate last, in a new `advisory-checks.yml` job and a doctor node:test, after a repo-mode run on the final tree has printed `live        : 0`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node T repo` exits 0 with `live        : 0`; the sweep suite passes 51 plus the new cases three runs in a row; `node --test D/scripts/tests/doctor-update-contract.test.cjs D/scripts/tests/lane-residue-gate.test.cjs` passes; `run-all.sh` prints `node:test (56 files)` and `7 suite(s) passed, 0 failed`; `route-validate.sh` prints `OK`; `actionlint W/advisory-checks.yml` exits 0; `check-gate-inputs.sh` prints `RESULT: PASSED`; `ci-report.cjs --json --no-gh` shows `advisory-checks.yml` with 3 jobs and no flags; the mirror check prints `PASS`; the link check prints `0 broken`; the spawned `machine` run on a clean fixture exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Report, ask, then apply: a read-only report decides whether to ask, the caller asks once, and one apply run carries the answer and forgets it.

### Key Components
- **The cleanup tool** (`K/runtime/cli/retrieval/sweep-lane-residue.mjs`): owns the vocabulary, every check, every delete and the question text. It gains the four hardening items, `--shared-model delete|keep` for apply, `askFirst` in its reports and the index check. Without the answer flag, no agent-run update can ask the question decision Q006 chose, because the tool asks only on a terminal.
- **The doctor update workflow** (`D/assets/doctor-update-apply.yaml` and its presentation): gains `phase_7_lane_cleanup`, which runs the tool after the rebuild prompt. Without it, nothing runs the cleanup on any user machine.
- **The gates** (a `lane-residue` job in `W/advisory-checks.yml`, `D/scripts/tests/lane-residue-gate.test.cjs`): run repo mode and fail on exit 1. Without them a returning lane term passes every check, because no existing workflow runs the tool.
- **The contract test** (`D/scripts/tests/doctor-update-contract.test.cjs`): pins the cleanup phase's order, its command and the rule that no answer is stored or read.

### Data Flow
After `phase_6_rebuild_prompt`, the workflow runs `node T machine --json`. Exit 0 records `lane_cleanup=clean` and ends the phase. Exit 2 with nothing found records `failed` with the tool's notes. Exit 1 with a non-empty `askFirst` shows the tool's question verbatim and waits for yes or no; the answer is bound to the next command line only. The workflow then runs `node T apply --json [--shared-model delete|keep] </dev/null`, which deletes the leftovers this checkout owns (the database and its copies, the fixed compiled paths, the model server's files once no server may use them, the package-local model cache), acts on the shared model only as the answer says, reports what only the user can remove (module folders, stale compiled files, dotenv keys, linked worktrees, a running `ollama serve`), and checks again. Its after-check decides `cleaned` (exit 0) or `remaining` (exit 1). `phase_8_state_log` writes the outcome, never the answer. In CI and the doctor tests, repo mode reads every tracked file outside `specs/`, applies the allowlist, checks the trigger index's lane phrases against `specs/` and the allowlist, and exits 1 on any live path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `T` M4 `resolveModelServerDirs` and `checkModelServer` | Probes four fixed names in each candidate folder | Update (H1): also the exact socket file a unix `HF_EMBED_SERVER_URL` names | REQ-007 case |
| `T` `isOwnedModelServer` and `runsModelServer` | Owns a process whose command line ends with the script path; lists any process with a word ending in the script name | Update (H2): first script argument, through the folder's real path for ownership and without it for listing | REQ-008 table |
| `T` `runApply` | Deletes M1, M3, M4 and M5 items in any checkout | Update (H3): no change in a checkout that holds a lane source | REQ-009 case |
| `T` M5 `checkHfCache`, `resolveHfHubRoot`, `--hf-home`, `HF_MODEL_FOLDER` | Asks before deleting a hub-cache folder the lane never wrote | Update (H4): package-local cache, owned delete; the hub path, prompt and flag go | REQ-010 case; `git grep -n -E 'hf-home\|HF_MODEL_FOLDER\|resolveHfHubRoot' -- ':!specs'` lists only lines in the tool at the start and nothing afterwards |
| `T` `runApply` M6 branch and `confirmOnTerminal` | Asks only on a terminal | Update: `--shared-model` answer; `askFirst` built from the same question string | REQ-005, REQ-006 |
| `T` `scanRepo` | Content, path and symlink scan of tracked files | Update: the four index outputs read by structure (ADR-007) | REQ-013 |
| `T` `SCHEMA_VERSION`, `USAGE`, header | Version 1, `--hf-home` listed | Update: version 2, usage without `--hf-home`, with `--shared-model` | `node T` usage text |
| `K/runtime/cli/tests/sweep-lane-residue.vitest.ts` | 51 cases, scrubs 11 variables | Update: new cases; scrub `HF_EMBED_SERVER_URL` | Suite output |
| `K/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` | 46 rows with 006 in flight; 007 adds four for the index outputs | Delete 007's four index-output rows; add rows only for T001's classified paths | `counts.allowlistRows` |
| `D/assets/doctor-update-apply.yaml` | Ends with the rebuild prompt and the state log | Update: cleanup phase, boundary, schema field | Contract test; YAML parse |
| `D/assets/doctor-update-presentation.txt` | Plan, battery, rebuild prompt, results | Update: disclosure line, section 9, result line | Contract test; `rg -n '^## '` |
| `D/scripts/tests/doctor-update-contract.test.cjs`, `lane-residue-gate.test.cjs` | Static contract checks; no residue gate | Update; create | `node --test` |
| `W/advisory-checks.yml`, `W/README.md` | Two jobs; README row names them | Update | actionlint, gate inputs, ci-report |
| `K/runtime/cli/retrieval/README.md` | Says the tool is not wired | Update | `rg -n 'Not wired'` prints nothing |
| Two `/doctor:update apply` playbook entries | Expected signals end at the rebuild outcome | Update | Residue patterns print 0 lines |
| `A/changelog/v2.0.0.0.md` (phase 006) | Tells users to run `/doctor:update apply` | Check; update only if it disagrees | T024 |
| `.skilled/bin/lib/launcher-ipc-bridge.cjs`, `.skilled/hooks/env-secret-guard/cli/env-secret.cjs` | Loaded by machine mode | Not a consumer of the change; must still exist after 005 | REQ-015 |
| `doctor-update-check.yaml`, `doctor-update-align.yaml`, `update.md` | Other `/doctor:update` actions and the router | Not a consumer: the cleanup belongs to apply only | Contract test runs unchanged for them |
| Codex and Pi prompt mirrors of the router | Copy `update.md` | Not a consumer: `update.md` does not change | Their `--check` modes in the battery |

Required inventories:
- Same-class producers: every place the tool decides what to delete or ask: `rg -n 'deleteContained|removeEmptyDir|stopProcess|confirm\(' T`.
- Consumers of changed names: `git grep -n -E 'sweep-lane-residue|hf-home|HF_MODEL_FOLDER|resolveHfHubRoot' -- ':!specs'`, which at the start lists only the tool itself, its allowlist and the retrieval README; `hubRoot` is matched only as the tool's own context key, because other files use the same word for a skill hub.
- Matrix axes: mode (repo, machine, apply) by checkout state (clean, leftovers, lane source present) by terminal (none, present) by answer (none, delete, keep) by model server (down, up and listing, up and not listing). The rows each case covers are listed in `tasks.md` T013 to T015.
- Invariant: apply deletes only fixed names under resolved roots, never follows a symlink, never touches the shared model without an answer given on this run, and never changes a checkout that still holds a lane source. Adversarial cases: a later argument naming the script, a symlinked socket folder, a socket URL naming a file outside the four fixed names, a planted lane source, a closed input, an answer flag outside apply.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: confirm phase 007 is committed, record the start commit `S`, run repo mode and classify any live path, record every gate baseline, record the operator's machine read-only, and audit what machine mode loads.
- **Implementation**: change the tool and its test, then the allowlist rows T001 named, then the doctor workflow, presentation and tests, then the READMEs, playbooks and changelog check, then run repo mode on the final tree and only then write the CI job.
- **Verification**: rerun both gates, both goal proofs, the generator checks and probes, every start-commit gate and the boundary checks, then validate this folder.

The ordered work and each task's verify command are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each hardening item, the answer flag, `askFirst`, the index check, the two-run case, the end-to-end fixture case, the spawned-binary machine run and a pseudo-terminal apply run; all on fixture roots, fixture HOME, a fake model server and an injected process list | Vitest in the spec-kit `cli` project; `python3` with `os.openpty` for the terminal case |
| Integration | The doctor contract (phase order, command, no stored answer, state log, presentation), the doctor gate test, `run-all.sh`, route-validate, the CI job's run block executed locally, `actionlint`, the gate-input check, `ci-report.cjs` | node:test, the doctor scripts, actionlint |
| Manual | Read the cleanup section and the question as an operator would see them; read the removal changelog's upgrade step beside the wiring | `sed -n` on the presentation and the entry |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 committed, repo mode at exit 0, its four index-output rows in place | Internal | Yellow | The gate cannot land; 005 is committed (`1f85a9dd6dd`) and 006 is being built in this worktree |
| Phase 006's removal changelog entry | Internal | Yellow | T024 has nothing to check; the entry is written by 006 |
| The conductor's readings of D5 and goal criterion 2 | Internal | Yellow | ADR-001 and ADR-010 stay Proposed; criteria 2 and 5 read Met only under those readings |
| `python3` on the CI runner | External | Green | The terminal case is skipped and the goal proof rests on the injected-confirm case alone |
| `actionlint` on this machine | External | Green | `/opt/homebrew/bin/actionlint`; no repository workflow runs it, so it is a local check only |
| The operator, after merge | External | Yellow | The CI job first runs on the operator's push; the job-name question waits for the operator |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the CI job or the doctor gate fails on a tree where repo mode passes locally; the cleanup deletes a path outside its fixed names in any test; or the contract test can be satisfied while an answer is stored.
- **Procedure**: before the commit, `git restore` the changed paths and delete `D/scripts/tests/lane-residue-gate.test.cjs`. After the commit, revert the one phase commit. This phase changes no user machine, tag or release, so nothing else needs undoing. After merge, setting the repository variable `SKILLED_CI_FRESHNESS` to `off` switches the job off with its group while a revert is prepared.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (start commit, repo mode, baselines, machine read-only, load audit) | Phase 007 committed | Implementation |
| Implementation (tool and test, allowlist, workflow, presentation, doctor tests, docs, final repo run, CI job) | Setup | Verification |
| Verification (both gates, both goal proofs, generator checks, probes, start-commit gates, boundary, validate) | Implementation | Parent close-out |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ Setup: S,    │──►│ Tool: H1 to H4,  │──►│ Tool tests and   │
│ repo, gates, │   │ answer, askFirst,│   │ both goal proofs │
│ machine read │   │ index check      │   └────────┬─────────┘
└──────────────┘   └────────┬─────────┘            │
                            │             ┌────────▼─────────┐
                            ├────────────►│ Doctor workflow, │
                            │             │ presentation,    │
                            │             │ contract test    │
                            │             └────────┬─────────┘
                   ┌────────▼─────────┐            │
                   │ Allowlist rows,  │            │
                   │ READMEs, docs    │            │
                   └────────┬─────────┘            │
                            │             ┌────────▼─────────┐
                            └────────────►│ Final repo run,  │
                                          │ then the gates   │
                                          └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Phase 007 commit | `S`, the classified live list, baselines, the machine snapshot | Everything |
| Tool changes | Setup | H1 to H4, `--shared-model`, `askFirst`, the index check, schema 2 | Tests, workflow |
| Tool tests | Tool changes | Cases for every change and both goal proofs | Verification |
| Doctor workflow and contract test | Tool changes (`askFirst`, the flag) | The cleanup phase, the presentation, the contract | Verification |
| Allowlist, READMEs, playbooks, changelog check | Setup, tool changes | A tree with no live path | Final repo run |
| Final repo run, then the gates | Everything above | The CI job and the doctor gate on a green tree | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Tool changes and their cases** - about 3 hours, most of it the ownership table, the guard and the two goal proofs - CRITICAL
2. **Doctor workflow, presentation and contract test** - about 90 minutes - CRITICAL
3. **Final repo run, the CI job, the doctor gate and the full gate rerun** - about 45 minutes - CRITICAL

**Total Critical Path**: about 5 hours and 15 minutes, one agent.

**Parallel Opportunities**:
- The READMEs, playbooks and changelog check touch no file the tool tasks touch and can run beside them
- The workflow and presentation tasks can start once the flag and `askFirst` names are fixed in T009, before the other tool cases are written
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | T001 shows repo mode at exit 0, or every live path classified; T002 to T004 recorded | Setup |
| M2 | Tool ready | The sweep suite passes three runs in a row with every new case | Implementation, T016 |
| M3 | Wired and gated | The contract test passes, `node T repo` prints `live        : 0` on the final tree, and the CI job and doctor gate both pass on it | Implementation, T027 |
| M4 | Proven | Every verification task prints its expected line and `validate.sh --strict` prints `RESULT: PASSED` | Verification |
<!-- /ANCHOR:milestones -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read `spec.md` scope and open questions, and check whether the conductor has answered open questions 1 and 2
- [ ] Confirm phase 007 is committed and record `S` before T001
- [ ] Confirm the next task's dependencies in the L3 dependency matrix are done
- [ ] Confirm the task's command touches only fixture paths when it runs `apply` (parent decision D6)
- [ ] Read the file the task edits before editing it

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Run tasks in `tasks.md` order; T026 and T027 never start before T025 prints `live        : 0` |
| TASK-SCOPE | Change only the files in `spec.md` Files to Change and this folder; phase 007's generated outputs are read, never edited |
| TASK-VERIFY | A task is done when its Verify command prints the expected line, read with its exit status |
| TASK-DOC | Record each verify output in `implementation-summary.md` as the task closes |

### Status Reporting Format
After each task: `T### done: <verify command> printed <line>, exit <n>; files changed: <list>`.

### Blocked Task Protocol
BLOCKED when a live path at T001 or T025 is lane residue, when an apply would touch the operator's HOME or this checkout, or when a start-commit gate is worse at the end. Stop, mark the task `[B]` with the command and its output, name the owning phase or decision, and ask the conductor; never add an allowlist row to unblock a gate.

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The doctor workflow asks the shared-model question for the tool and passes the answer for one run

**Status**: Accepted

**Context**: Decision Q006 asked "What should `/doctor:update apply` do?" about the pulled model and chose "Ask every run (Recommended)" over "Remove without asking" and "Only print the command". The tool asks only on a terminal, and `/doctor:update apply` runs through an agent's shell, which has none, so in that command the tool would keep the model and print a command: the rejected option. Goal decision D5 says the cleanup tool asks on every run and remembers no answer.

**Decision**: Add `--shared-model delete|keep` to apply mode only. When present it is this run's answer: the tool never prompts and sends DELETE only on `delete`. When absent the tool behaves as today: it asks on a terminal and keeps the model without one. The workflow runs `machine --json`, and when `askFirst` lists a question it shows that text verbatim, waits for yes or no, and passes the answer on the one `apply` command that follows. It asks on every run, never reads an earlier state log or answer to decide, and writes no answer anywhere.

**Consequences**:
- An agent-run update asks the question Q006 chose, on every run where the local model server lists the model.
- The question text stays in the tool, so a terminal run and a doctor run ask the same words.
- An agent could pass the flag without asking. Mitigation: the contract test pins ask-then-pass on one command and the absence of a stored answer, and open question 1 puts this reading of D5 to the conductor.

**Alternatives Rejected**:
- Run apply with no terminal and hand the operator a command to run in their own terminal: this is "Only print the command" for the command Q006 was asked about.
- Pipe the operator's answer into the tool's stdin with a flag that reads it without a terminal: the same answer path with more machinery and no added check.
- A two-value flag: a runtime that attaches a terminal would then ask a second time after a no.

---

### ADR-002: The cleanup runs after the rebuild prompt under the one startup approval

**Status**: Accepted

**Context**: Goal decision D1 puts the cleanup after the rebuild prompt so it deletes the `.bak` copy the rebuild made. Each rebuild writes a new timestamped copy (`doctor-skill-advisor-rebuild.yaml` phase 3), so a separate cleanup prompt would fire on every update. The apply workflow's `mutation_boundaries` forbid any path outside the engine plan except an approved post-apply counterpart, and research 5.4 deletes the checkout's own leftovers without asking.

**Decision**: Add `phase_7_lane_cleanup` after `phase_6_rebuild_prompt` and rename the state-log phase `phase_8_state_log`. The cleanup runs on every path that reached the rebuild prompt, whether the rebuild ran, was skipped or failed, and on no other path: not on DRY_RUN, DECLINED, CANCELLED, or a failure or rollback before the rebuild prompt. The startup plan shows one disclosure line, so the one startup approval covers the owned deletes. `mutation_boundaries.allowed_targets` gains one entry that refers to the cleanup by its report: the targets listed as `deleted` in the tool's `apply --json` actions for this checkout (its advisor database files and their copies, the fixed compiled lane paths, the package-local model cache and the model server's fixed file names). The entry names no literal path, file name or command, because those names match the residue patterns (ADR-008). A missing tool records `not_applicable`, because an update scope can exclude spec-kit.

**Consequences**:
- Owned deletes need no extra question, and the startup plan says they will happen.
- The update's `STATUS` stays decided by the release write and its battery.

**Alternatives Rejected**:
- A cleanup approval prompt: fires on every update for the new `.bak` copy.
- Running the cleanup before the rebuild prompt: leaves the rebuild's copy behind, against D1.

---

### ADR-003: M5 moves to the package-local model cache and becomes an owned delete

**Status**: Accepted

**Context**: Phase 001's M5 asks before deleting `models--nomic-ai--nomic-embed-text-v1.5` in the HuggingFace hub cache. `@huggingface/transformers` 3.8.1 sets its default cache to the package folder's `.cache` (`src/env.js` 96 to 98 and 153), no lane code overrode it (0 matches for `cacheDir`, `cache_dir`, `localModelPath` or the HuggingFace cache variables at `cf702d3fb9e`, the last commit with the lane code), the primary checkout holds 132 MB at `system-spec-kit/node_modules/@huggingface/transformers/.cache/nomic-ai/nomic-embed-text-v1.5`, and the hub cache holds no matching folder. Research 5.4 listed the HuggingFace store as ask-first because it is shared.

**Decision**: M5 checks `node_modules/@huggingface/transformers/.cache/nomic-ai/nomic-embed-text-v1.5` under the advisor runtime and the spec-kit package, and apply deletes it as a contained folder without asking, under ADR-004's guard. The hub-cache check, its question, `resolveHfHubRoot`, `HF_MODEL_FOLDER` and `--hf-home` go. M2 keeps reporting the package folder that holds the cache until `npm ci` removes it.

**Consequences**:
- The tool no longer offers to delete a user's own hub copy of a model the lane never wrote.
- The shared model becomes the only ask-first item, so one answer flag covers every question.
- 132 MB goes on the first cleanup, before `npm ci` runs.
- This departs from research 5.4's ask-first listing for the HuggingFace store, because the lane's copy is not in the shared store.

**Alternatives Rejected**:
- Keep the hub check beside the new one: asks about a folder the lane never wrote.
- Drop M5 and rely on M2: correct, but the cache stays until `npm ci`, which the operator has not approved here.

---

### ADR-004: A checkout that still holds a lane source gets no change from apply

**Status**: Accepted

**Context**: The third review asked to skip compiled deletes while the lane sources exist. After phase 005 this checkout holds none, but apply takes `--root`, and M8 tells the user to run apply inside each linked worktree: all 24 other worktrees here still hold `semantic-shadow.ts`, `lib/embedders/`, `shared/embeddings/` or `hf-model-server.cjs`. Old code in such a checkout still uses its compiled output, its database tables, its model server and its model cache.

**Decision**: Keep the guard and widen it. When any of `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/embedders/`, `.skilled/skills/system-spec-kit/shared/embeddings/` or `.skilled/bin/hf-model-server.cjs` exists under the root, apply deletes, stops and asks nothing, records each item as `kept` with a reason naming the source, and exits on its after-check. Repo mode already proves the sources absent from this tree, so no separate assertion is added.

**Consequences**:
- Running the cleanup in an older worktree cannot break it.
- `askFirst` is empty in such a checkout, so the workflow asks nothing there.

**Alternatives Rejected**:
- Drop the guard as dead after 005: wrong for every older worktree M8 points at.
- Guard only the compiled deletes: the database discard and the model server stop would still break an older checkout.

---

### ADR-005: Model-server ownership follows the first script argument, through the folder's real path

**Status**: Accepted

**Context**: Ownership today is a command line that ends with this checkout's script path, so `node /other.js /checkout/.skilled/bin/hf-model-server.cjs` counts as owned and would be signalled. The supervisor started the server as `spawn(process.execPath, [modelServerPath])`. After phase 005 the script file is gone, so its own real path cannot be resolved, but a server started before the update keeps running from it.

**Decision**: A process is owned when its executable's base name is `node`, the first argument after any leading `-` options is the script, and that argument's folder resolves to the same real path as this checkout's `.skilled/bin`, with the same base name. A command line the tool cannot read that way is not owned, which leaves the process running and reported. The same parse, without the folder comparison, decides what M4 lists at all: node running any checkout's server script as its first argument. During planning, a `/bin/zsh -c` process whose command line only contained the script's name was listed under M4 and turned a clean fixture to exit 1 (`spec.md` Measured Behavior), so a mention is no longer enough to be listed.

**Consequences**:
- A later argument naming the script no longer counts.
- A server started through a symlinked path, or from a script already deleted, is still recognized.
- A shell or pager that merely names the script is neither listed nor signalled, so it cannot hold machine mode at exit 1.

**Alternatives Rejected**:
- Keep the suffix match and add a prefix check: still owns `node /other.js <script>` when the script comes last.

---

### ADR-006: Repo mode gates in a new `advisory-checks.yml` job and a doctor node:test, not in pre-commit

**Status**: Accepted

**Context**: A lane term can return in any tracked file, so a path-filtered workflow would miss most of them. `advisory-checks.yml` runs on every push to `main` and `skilled/**` and on every pull request, with no path filter, and its `gate-critical` job installs and builds two workspaces first. Repo mode needs only Node built-ins and git, and took 8.15 s here. The pre-commit hook's header sends checks that only need to run once per change, and cost more than they catch, to CI. Goal decision D2 names CI and the doctor tests.

**Decision**: Add a `lane-residue` job to `advisory-checks.yml` with the file's switch condition (`vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'`), the same pinned checkout and setup-node actions as its siblings, a fail-closed check that the tool exists, and `node T repo`, with no `continue-on-error`. Add `D/scripts/tests/lane-residue-gate.test.cjs`, which `run-all.sh` picks up inside its node:test suite. Both land in the same commit as the cleanup wiring, after T025 has shown `live        : 0` on that tree. No new workflow file is created, so `/doctor:ci scaffold` is not needed; `/doctor:ci report` reads the new job's switch by its shape.

**Consequences**:
- Every push and pull request runs the gate in about a minute without an install.
- The doctor test adds about 8 s to `run-all.sh`, and the suite count stays 7.
- `SKILLED_CI_FRESHNESS=off` switches the gate off with its group.

**Alternatives Rejected**:
- A step in `gate-critical`: waits for two installs and builds it does not need.
- `spec-kit-check.yml`: path-filtered.
- Pre-commit: 8.15 s on every commit.

---

### ADR-007: The four index outputs get a target check; generator check modes and behavior probes stay where they gate

**Status**: Accepted

**Context**: Phase 001 deferred research items R3 (generator check modes), R4 (trigger index assertions) and R7 (`advisor_status` probes) here. The trigger index generator reads every doc, `specs/` included, so its four outputs (the index, the corpus manifest, the generation diagnostics and the phrase variants) always match the vocabulary. Phase 007 found that regeneration alone cannot clear them, allowlists all four by exact path guarded by a hand-run `derived` check, and proposed in its open question 2 that this phase build that rule into repo mode and drop the rows. A whole-file row would hide a lane phrase that resolves to a live doc. The tracked index, still the pre-removal build, carries 334 lane phrases with 30 references outside `specs/` to 13 paths: 10 no longer on disk, two changelog entries phase 006 is rewriting, and one allowlisted file. Each generator's check mode already runs where it gates: leaf manifests in the pre-commit hook, `skill-graph-freshness.cjs` and the router intent signals in `routing-registry-drift.yml`, cite drift in `sk-doc-script-tests.yml`, the command bridges in the advisor's drift-guard test, and the trigger index report-only in `advisory-checks.yml`, rebuilt after merge by `trigger-index-rebuild.yml`. The probes exist: `cli-exit-taxonomy.vitest.ts` 79 pins exit 64 for the removed flag, `handlers/advisor-status.vitest.ts` 322 and 333 pin four lane weights and the refused flags, and `_routes.yaml` holds six `/doctor:skill-advisor` targets.

**Decision**: Repo mode reads the four outputs by structure, with `derived`'s rule: an index path that matches either pattern, and every target of an index phrase whose key or any of its phrase-variant spellings matches, is live only when it lies outside `specs/` and is not an allowlist row; every matching string in the corpus manifest and the generation diagnostics is held to the same rule. The four files are otherwise exempt from the content scan. Delete 007's four rows. Run each generator check and probe once on the final tree and record where it gates; do not repeat them in the residue job.

**Consequences**:
- No whole-file row hides the index outputs, and the gate stays an install-free job.
- A lane phrase whose doc is deleted fails the gate until the index is regenerated; the error names the command.

**Alternatives Rejected**:
- Keep 007's four rows and leave `derived` a hand-run check: nothing would run it on a later push.
- Gate `generate-trigger-index.mjs --check` in the residue job: fails every push between a doc edit and the post-merge rebuild.
- Make the residue tool run the advisor probes: it would need a built advisor.

---

### ADR-008: No wiring file names a residue term; the question reaches the workflow through `askFirst`

**Status**: Accepted

**Context**: The question names the model and its server, and both names match the identifier pattern case-insensitively, as does the report's host key. If the workflow, presentation, CI job, doctor tests, README or playbooks quoted them, repo mode would list those files as live and need whole-file rows that would hide any later lane line in the update workflow.

**Decision**: The tool adds `askFirst: [{ check, question }]` to its machine and apply reports, built from the same string its terminal prompt uses, and listed only when the server listed the model and the checkout holds no lane source. The workflow shows `askFirst[].question` verbatim and passes `--shared-model`. Every wiring file says "the pulled shared model" and "the retired embedding lane", and the doctor gate test reads its planted term from the tool's `IDENTIFIER_TERMS`. Each wiring task runs the patterns on its file.

**Consequences**:
- The tool, its test and its allowlist stay the one place the vocabulary lives, as research 5.5 asks.
- `SCHEMA_VERSION` goes to 2, because the report shape changes (`askFirst` added, `hubRoot` removed), as the constant's own comment requires.

**Alternatives Rejected**:
- Allowlist the doctor files: whole-file rows on the update workflow.
- Read the host and model fields from the report in the workflow: the field name itself matches.

---

### ADR-009: Module folders and stale compiled files stay report-only

**Status**: Accepted

**Context**: Research 5.4 lists `npm ci` and a rebuild among the cleanup's no-question actions; phase 001 made them report lines. An install reaches the network, needs its own yes under the repository's blast-radius rule, and the update's rollback cannot undo it.

**Decision**: The cleanup reports M2 with `npm --prefix <package> ci` and stale compiled files with the package's build command, and the presentation shows those lines. The workflow runs neither.

**Consequences**:
- Machine mode stays at exit 1 after an update until the user reinstalls, and the report says why.

**Alternatives Rejected**:
- Offer `npm ci` as a battery repair with approval: widens `/doctor:update apply` into installs for one feature's leftovers.

---

### ADR-010: Goal criterion 2 is evidenced on fixtures; the operator's machine is read and left alone

**Status**: Accepted

**Context**: Parent decision D6 forbids apply on the operator's machine, which reads exit 1 for M2, M6 and M8 (M3 cleared on 2026-11-21 when this worktree's database was rewritten). Machine mode is read-only, so it may run there; apply may not.

**Decision**: Evidence criterion 2 by REQ-003: an in-process fixture cleaned by apply then read at exit 0, and the spawned binary on a clean fixture with the exit code taken from the process. Record the operator's machine read-only at the start and end (REQ-017) and name each blocker and its remedy in the implementation summary. Ask the conductor to read criterion 2 as fixture evidence (open question 2).

**Consequences**:
- Criterion 2 is Met on fixtures and stated as not met on the operator's machine; neither is presented as the other.

**Alternatives Rejected**:
- Run apply on the operator's machine: breaks D6.
- Point machine mode at a fixture and call it the operator's machine: false.

---

### ADR-011: Planning ran inline, at Level 3, and stops after the task breakdown

**Status**: Accepted

**Context**: `speckit-plan.yaml` step 5 dispatches four `@context` agents; this plan was written by a leaf worker that may not dispatch agents. The level helper printed Level 2 for about 700 lines and 13 files, and the conductor scaffolded this phase at Level 3 like its siblings. The brief covers steps 1 to 5.5.

**Decision**: Use the step's inline fallback: the repo and machine runs, the per-file pattern checks, the gate baselines, the trigger index count and the terminal driver prototype ran in this worker, with their output in `spec.md`'s Measured Behavior. Keep Level 3. Do not run step 6's context save.

**Consequences**:
- One reader's view; every Measured Behavior command can be rerun.

**Alternatives Rejected**:
- Dispatch the agents, or drop to Level 2: the brief forbids the first and fixes the second.
