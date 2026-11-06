---
title: "Doctor Commands: Manual Testing Playbook"
description: "Operator-facing manual validation for the /doctor command surface: shared test environments, execution and evidence policy, review protocol and one index row per scenario file across the seventeen doctor routers."
version: 1.0.0.0
---

# Doctor Commands: Manual Testing Playbook

This document is the operator directory for the `/doctor` command surface. It says how the scenarios are run, where they run, what counts as evidence and where each scenario file lives. The scenario files carry the execution truth for one scenario each: the realistic request, the exact prompt, the exact commands, the expected signals, the pass and fail rule and the failure triage.

---

This package keeps shared rules in the root and execution truth in the category folder, the split the sk-doc manual testing playbook template asks for. Every scenario file sits in `doctor-commands/`.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `doctor-commands/`
- `doctor-commands/README.md`

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome, its reason and its evidence paths are recorded into the `benchmark/reports/<dated-run-label>/` folder of the skill the scenario validates. Generated report Markdown is renderer-owned and never hand-authored.

---

## 1. OVERVIEW

This playbook covers every `/doctor` command. Seventeen routers under `.skilled/commands/doctor/` each own a command: the router binds a target from `.skilled/commands/doctor/_routes.yaml`, loads that target's workflow YAML and renders through the command's presentation contract. A scenario tests what an operator sees when a target runs against a real repository: the plan a plan-first route prints, the table a report route renders, the refusal an unknown flag gets, and the state a writing route leaves behind.

The corpus holds 62 scenario files in the one category folder. Section 8 lists every file once, under the command it exercises. Four commands hold the widest sets: `/doctor:update` because each verb is its own risky operation, `/doctor:git` because it switches gates and edits rules, `/doctor:skill-advisor` because each audit reads a different graph fact, and `/doctor:agents-md` because two of its rows need a live session on another runtime.

Coverage note: every router except `/doctor:overlay` has at least one scenario here. Its first scenario lives in the `system-skilled-doctor` playbook, as noted in its section below. The `/doctor:sk-skill` rows and the `/doctor:agents-md` check and embed rows are the newest additions, and each names its own precondition in its file. Scenario counts are derived from the folder at validation time, so this document is not the census.

### Realistic Test Model

1. A realistic user request is given to an operator or to an AI session.
2. The operator decides whether the command is run directly, resubmitted after a display artifact, or repaired before retrying.
3. The operator captures the command transcript, the rendered output and the state of the tree.
4. The scenario passes only when the rendered output matches the command's contract and the tree is where it started.

### What Each Scenario File Explains

- The realistic request that should reach the command.
- The exact prompt and the exact command sequence, in order.
- The expected signals per step, including exit codes and exact wording.
- The evidence to capture and where it comes from.
- The pass/fail rule and the failure triage order.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. Node.js, Python 3 and `git` are available, because most steps run a script directly.
3. The tree starts clean: `git status --porcelain` prints nothing.
4. A route that loads the advisor runtime has that runtime built: `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`.
5. No scenario pushes. Neither test worktree branch is pushed, and the `v4.0.0.3-fixture` tag is never pushed.
6. One scenario at a time in each long-lived environment named in section 7.
7. A scenario that writes restores the tree before the verdict. `update` resets through its fixture rollback until `restored` and `skipped` are empty, `/doctor:symlink` prints the undo for every link it writes, and `/doctor:agents-md` restores what it embedded.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript, with the exit code of every step.
- The user request and the prompt as sent.
- The plan and its digest where the route is plan-first.
- The JSON envelope where the route has a `--json` form.
- `git status --porcelain` before and after every run that writes.
- Output snippets as rendered, not retyped.
- The verdict with its rationale, and the evidence paths.

---

## 4. DETERMINISTIC COMMAND NOTATION

- A route step is written `/doctor:<command> <target> [flags]`.
- A shell step is written `bash: <command>`.
- A script step is written `node <script> [flags]`.
- An AI-session step is written `agent: <instruction>`.
- `->` separates sequential steps, and each step's exit code is captured before the next one runs.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. The scenario files it links under `doctor-commands/`
3. Execution evidence per scenario
4. A command-to-scenario coverage map
5. Triage notes for every non-pass outcome

### Scenario Acceptance Rules

For each executed scenario, check:

1. The preconditions were satisfied.
2. The prompt and command sequence were executed as written.
3. The expected signals are present.
4. The evidence is complete and readable.
5. The outcome rationale is explicit.

Scenario verdict:
- `PASS`: every acceptance check is true.
- `FAIL`: expected behaviour is missing, the output contradicts it, or a critical check failed.
- `SKIP`: a named sandbox or runtime blocker prevents the run, such as a missing live session, an unauthenticated `gh`, or an absent credential.

### Command Verdict Rules

- `PASS`: every mapped scenario for the command is `PASS`.
- `FAIL`: any mapped scenario is `FAIL`.
- `SKIP`: every mapped scenario is blocked by a named blocker.

Hard rule: a `FAIL` on a route's refusal path, the error an operator meets most often, forces the command verdict to `FAIL`.

### Release Readiness Rule

Release is ready only when:

1. No command verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Every scenario file is linked from section 8 and no link is dangling.
4. No blocking triage item is open.

### Root-vs-Scenario Rule

Keep verdict logic here. Put the command-specific caveat, such as a fixture unit that is expected to conflict, in the scenario file.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

Wave planning for this package. It is capacity guidance, not a runtime support matrix.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Fill the remaining worker slots.
4. Assign scenario IDs and their files before a wave starts.
5. Serialize every wave that writes: the two long-lived environments in section 7 take one scenario at a time, so two writing scenarios never share one.
6. Run the `update` fixture scenarios in their own wave, because each one mutates the fixture and resets it.
7. After a wave, save the evidence, then start the next wave.

### What Belongs In Scenario Files

- The real user request and the prompt.
- The expected routing decision, including any display artifact that needs a resubmission.
- The desired user-visible outcome.
- Command-specific acceptance caveats and isolation constraints.

---

## 7. TEST ENVIRONMENTS

Scenarios that change state run in one of two long-lived local worktrees instead of a throwaway copy. Both stay local: never push their branches, and never push the `v4.0.0.3-fixture` tag. Run one scenario at a time in each environment.

### 7.1 Current-code environment

| Field | Value |
|---|---|
| Path | `.worktrees/.doctor-test-environment`, a symlink to the numbered worktree directory |
| Branch | `worktrees/<NNN>-doctor-test-environment`, the number the recreate step allocated, following `origin/main` |
| Used by | every scenario whose steps need the shipped tree |

- **Before a scenario:** run `git -C .worktrees/.doctor-test-environment fetch origin` and `git -C .worktrees/.doctor-test-environment merge --ff-only origin/main`, then confirm `git status --porcelain` prints nothing.
- **Dependencies:** the worktree is created without dependencies. A scenario that needs a built runtime runs `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .worktrees/.doctor-test-environment` once first.
- **Advisor state:** an advisor rebuild, which DOC-348 and DOC-362 both run, leaves `advisor_recommend` reporting `stale` with reason `advisor_rebuild` until the next trusted scan. Before DOC-364, run `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --json '{}'` in the environment, or every router-reach probe fails as `probe-error`.
- **After a scenario:** restore every file it changed with `git checkout -- <path>`, remove any file it added, and confirm `git status --porcelain` prints nothing.
- **Recreate:** `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create doctor-test-environment origin/main --no-provision`, then point the `.doctor-test-environment` symlink at the new numbered directory.

### 7.2 `/doctor:update` fixture

| Field | Value |
|---|---|
| Path | `.worktrees/.doctor-update-test-environment`, a symlink to the numbered worktree directory |
| Branch | `worktrees/087-doctor-update-test-environment`, created from `v4.0.0.0` |
| Used by | DOC-357 to DOC-361 and DOC-379 |

The fixture's commits, in order:

1. The current updater copied over the v4.0.0.0 tree, because the old tags ship only the legacy `doctor-update.yaml`.
2. A local edit to the `sk-code-webflow` skill, and a new local packet `sk-code/sk-code-web-dev`.
3. sk-git replaced by the 10-file Barter skill.
4. The release base record (`base.json` in the release folder) recorded for `v4.0.0.0` with `--offline --trust-release`, so it reports `verified: false`.
5. The updater that reports a release path below a local symlink as a `symlink-parent` conflict, copied over the first one. An unscoped check therefore finishes, and `directory:changelog` reports `conflict` because v4.0.0.0 keeps `.skilled/changelog/sk-design` as a symlink.

The local tag `v4.0.0.3-fixture` is `v4.0.0.2` with `sk-code/sk-code-obsidian` deleted.

| Unit | Release | Expected status |
|---|---|---|
| `skill:sk-code/sk-code-webflow` | `v4.0.0.2` | `customized` |
| `skill:sk-code/sk-code-web-dev` | `v4.0.0.2` | `local` |
| `skill:sk-git` | `v4.0.0.2` | `conflict` |
| `skill:sk-code/sk-code-obsidian` | `v4.0.0.3-fixture` with `--include-prerelease` | `removed` |

- **Always** pass `--offline` and a `--scope` naming fixture units. The copied updater forms one `command:commands/doctor` unit that no scenario asserts.
- **Every file needs an explicit answer.** The engine ignores the prefilled decisions in `decisions.json`, so record each one with `decide`.
- **Reset after apply:** run `rollback --run=<runDir>`, require every written path under `restored` and `skipped` empty, confirm `git status --porcelain` prints nothing, then delete the run directory under `.skilled/release/runs/`. Never apply the same run twice.
- **Commits in the fixture:** the v4.0.0.0 hooks need dependencies the fixture does not have, so fixture commits set `SPECKIT_SKIP_MIRROR_PARITY=1 SPECKIT_SKIP_ROUTE_REMINT=1`, the two bypasses those hooks name. Never use `--no-verify`.
- **Recreate:** DOC-379 lists every build step.

### 7.3 Runs outside both environments

A scenario whose steps do not fit either environment says so in its own file, and the run is disposable:

- **Any working copy.** Scenarios that change nothing run where you are: the menu, refusal, list and read-only report rows.
- **A disposable clone.** DOC-370 runs on a clone, because a linked worktree shares the main checkout's `.git/config` and `git config --local` would change the real repository.
- **A throwaway folder or copy.** DOC-331 to DOC-333 need their own empty or seeded graph state, DOC-381 builds its own v3 fixture because the compat move renames the spec roots, DOC-383 uses a shallow clone of `v3.6.0.0`, and DOC-395 writes only in the scratch repository it creates. DOC-396 and DOC-397 compose the `adopted` fixture into their own throwaway folder outside the checkout.
- **A live session beside the folder.** DOC-396 needs a Devin session and DOC-397 a Cursor window. Until one is available, the row records `UNKNOWN` with its reason rather than a default pass.

Every disposable run is deleted afterwards, and the tree is checked with `git status --porcelain` before the verdict.

---

## 8. DOCTOR COMMAND INDEX

Every scenario file in `doctor-commands/` appears exactly once below, under the command it exercises. The ID, the folder and the file name are the identity of a scenario; the section is the grouping an operator starts from. The seven routing probes sit under `/doctor:skill-advisor`, because each one runs the advisor hook and reads the doctor line it prints, whatever command that line names.

### 8.1 `/doctor:agents-md`

Checks, embeds or restores the shipped AGENTS.md sections, plan first. Two rows need a live session on the runtime they check; two check and restore in a folder the operator names.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-396 | Doctor agents md block reaches a live Devin session | [DOC-396](doctor-commands/doctor-agents-md-block-devin-quote.md) |
| DOC-397 | Doctor agents md mirror loads in Cursor | [DOC-397](doctor-commands/doctor-agents-md-cursor-mirror-load.md) |
| DOC-404 | Doctor agents md check | [DOC-404](doctor-commands/doctor-agents-md-check.md) |
| DOC-405 | Doctor agents md embed and restore | [DOC-405](doctor-commands/doctor-agents-md-embed-restore.md) |

### 8.2 `/doctor:ci`

Lists GitHub Actions workflows with their switch state, scaffolds a new workflow, or toggles one CI switch. Four rows cover the report, scaffold refusals, the toggle round trip and a conversation that proves a declined toggle leaves local and remote state unchanged.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-392 | Doctor CI report | [DOC-392](doctor-commands/doctor-ci-report.md) |
| DOC-393 | Doctor CI scaffold | [DOC-393](doctor-commands/doctor-ci-scaffold.md) |
| DOC-394 | Doctor CI toggle | [DOC-394](doctor-commands/doctor-ci-toggle.md) |
| DOC-410 | Doctor CI toggle conversation | [DOC-410](doctor-commands/doctor-ci-toggle-conversation.md) |

### 8.3 `/doctor:deep-loop`

Diagnoses deep-loop coverage graphs and convergence. Three rows need their own empty or seeded graph state; the fourth selects a scope and refuses an unknown value.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-331 | Doctor deep-loop lazy init | [DOC-331](doctor-commands/doctor-deep-loop-lazy-init.md) |
| DOC-332 | Doctor deep-loop empty no source | [DOC-332](doctor-commands/doctor-deep-loop-empty-no-source.md) |
| DOC-333 | Doctor deep-loop convergence | [DOC-333](doctor-commands/doctor-deep-loop-convergence.md) |
| DOC-368 | Doctor deep-loop scope | [DOC-368](doctor-commands/doctor-deep-loop-scope.md) |

### 8.4 `/doctor:env`

Inspects documented environment switches and confirms a preference change. One row reads, one writes a saved preference behind a yes, and one proves secrets and per-invocation switches are never saved.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-354 | Doctor env inspect | [DOC-354](doctor-commands/doctor-env-inspect.md) |
| DOC-355 | Doctor env save preference | [DOC-355](doctor-commands/doctor-env-save-preference.md) |
| DOC-356 | Doctor env secret and per-invocation | [DOC-356](doctor-commands/doctor-env-secret-and-per-invocation.md) |

### 8.5 `/doctor:git`

Switches sk-git hook gates, edits the commit, PR and branch rules in `.sk-git/` and checks which settings are live.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-369 | Doctor git hooks list | [DOC-369](doctor-commands/doctor-git-hooks-list.md) |
| DOC-370 | Doctor git hooks switch gate | [DOC-370](doctor-commands/doctor-git-hooks-switch-gate.md) |
| DOC-407 | Doctor git hooks switch gate conversation | [DOC-407](doctor-commands/doctor-git-hooks-switch-gate-conversation.md) |
| DOC-371 | Doctor git standards copy once | [DOC-371](doctor-commands/doctor-git-standards-copy-once.md) |
| DOC-372 | Doctor git standards change rule | [DOC-372](doctor-commands/doctor-git-standards-change-rule.md) |
| DOC-408 | Doctor git standards change rule conversation | [DOC-408](doctor-commands/doctor-git-standards-change-rule-conversation.md) |
| DOC-373 | Doctor git standards refuse invalid | [DOC-373](doctor-commands/doctor-git-standards-refuse-invalid.md) |
| DOC-374 | Doctor git target menu | [DOC-374](doctor-commands/doctor-git-target-menu.md) |
| DOC-384 | Doctor git setup check | [DOC-384](doctor-commands/doctor-git-setup-check.md) |

### 8.6 `/doctor:helper`

Ranks the doctor command that fits a described problem, with why, ready to run. One row runs a read-only pick in place; the other hands a writing pick back with the no-match fallback.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-400 | Doctor helper ranks a problem and runs a read-only pick | [DOC-400](doctor-commands/doctor-helper-read-only-pick.md) |
| DOC-401 | Doctor helper hands a writing pick back and offers the fallback | [DOC-401](doctor-commands/doctor-helper-writing-handoff.md) |

### 8.7 `/doctor:install`

Gets the ordered steps that put Skilled into a project repo. One row covers the five ordered steps from `list` and a guided run that checks the two builds and the target, then prints the checklist without writing.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-399 | Doctor install | [DOC-399](doctor-commands/doctor-install.md) |

### 8.8 `/doctor:mcp`

Installs or debugs Code Mode, its UTCP configuration and runtime registration. Two rows stop before any workflow loads and run in any working copy; the other three need the shipped tree.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-375 | Doctor mcp install | [DOC-375](doctor-commands/doctor-mcp-install.md) |
| DOC-376 | Doctor mcp debug | [DOC-376](doctor-commands/doctor-mcp-debug.md) |
| DOC-377 | Doctor mcp debug fix | [DOC-377](doctor-commands/doctor-mcp-debug-fix.md) |
| DOC-378 | Doctor mcp target menu | [DOC-378](doctor-commands/doctor-mcp-target-menu.md) |
| DOC-380 | Doctor mcp unknown flag | [DOC-380](doctor-commands/doctor-mcp-unknown-flag.md) |

### 8.9 `/doctor:overlay`

Checks whether a vendored Skilled tree still carries its overlays, and puts them back after one yes. No `DOC` scenario covers it yet. The `system-skilled-doctor` playbook holds its first scenario, `SKD-003`, which runs `status` on a tree with no overlays and confirms nothing is written.

| ID | Scenario | Scenario File |
|---|---|---|
| SKD-003 | Overlay status on a tree with no overlays names the missing manifest | [SKD-003](../skills/system-skilled-doctor/manual-testing-playbook/overlays/status-without-overlays.md) |

### 8.10 `/doctor:runtime-mirrors`

Checks that the agent, command, prompt and hook mirrors in each runtime directory match `.skilled`. One row is a tree in sync and one is a single drifted mirror.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-352 | Doctor runtime mirrors in sync | [DOC-352](doctor-commands/doctor-runtime-mirrors-in-sync.md) |
| DOC-353 | Doctor runtime mirrors drift | [DOC-353](doctor-commands/doctor-runtime-mirrors-drift.md) |

### 8.11 `/doctor:setup`

The umbrella: lists every doctor target and runs the read-only setup checks, naming the repair command for each failing leg.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-391 | Doctor setup umbrella run | [DOC-391](doctor-commands/doctor-setup-run.md) |

### 8.12 `/doctor:sk-code`

Runs the sk-code setup battery, or checks and creates the repository quality config. One row runs the battery on a pre-v4 checkout, where no leg runs and provisioning fails with the v4-layout repair.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-382 | Doctor sk-code setup | [DOC-382](doctor-commands/doctor-sk-code-setup.md) |
| DOC-383 | Doctor sk-code on a pre-v4 checkout | [DOC-383](doctor-commands/doctor-sk-code-pre-v4-checkout.md) |
| DOC-395 | Doctor sk-code quality | [DOC-395](doctor-commands/doctor-sk-code-quality.md) |

### 8.13 `/doctor:sk-skill`

Checks a skill against the Skilled format, or converts one to it, plan first. The check route reads and writes nothing; the convert route prints a plan and writes only after an explicit yes.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-402 | Doctor sk-skill check | [DOC-402](doctor-commands/doctor-sk-skill-check.md) |
| DOC-403 | Doctor sk-skill convert | [DOC-403](doctor-commands/doctor-sk-skill-convert.md) |

### 8.14 `/doctor:skill-advisor`

Tunes and rebuilds the skill advisor, and audits graph freshness, router reach, budgets and parent hubs. The seven routing probes also live here, because each runs the advisor hook and reads the doctor line it prints. DOC-367 now replays the target menu's cancel, invalid, help and numeric-answer path.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-348 | Doctor skill-advisor rebuild | [DOC-348](doctor-commands/doctor-skill-advisor-rebuild.md) |
| DOC-362 | Doctor skill-advisor tune | [DOC-362](doctor-commands/doctor-skill-advisor-tune.md) |
| DOC-363 | Doctor skill-advisor graph freshness | [DOC-363](doctor-commands/doctor-skill-advisor-graph-freshness.md) |
| DOC-364 | Doctor skill-advisor router reach | [DOC-364](doctor-commands/doctor-skill-advisor-router-reach.md) |
| DOC-365 | Doctor skill-advisor skill budget | [DOC-365](doctor-commands/doctor-skill-advisor-skill-budget.md) |
| DOC-366 | Doctor skill-advisor parent skill | [DOC-366](doctor-commands/doctor-skill-advisor-parent-skill.md) |
| DOC-367 | Doctor skill-advisor target menu conversation | [DOC-367](doctor-commands/doctor-skill-advisor-target-menu.md) |
| DOC-385 | Doctor routing setup onboarding prompt | [DOC-385](doctor-commands/doctor-routing-setup-onboarding.md) |
| DOC-386 | Doctor routing environment variables prompt | [DOC-386](doctor-commands/doctor-routing-env-prompt.md) |
| DOC-387 | Doctor routing contested prompt second line | [DOC-387](doctor-commands/doctor-routing-contested-second-line.md) |
| DOC-388 | Doctor routing typed command in the Python fallback | [DOC-388](doctor-commands/doctor-routing-python-typed-command.md) |
| DOC-389 | Doctor routing setup hint on a no-match | [DOC-389](doctor-commands/doctor-routing-setup-hint.md) |
| DOC-390 | Doctor routing no hint on an unrelated prompt | [DOC-390](doctor-commands/doctor-routing-no-hint-unrelated.md) |
| DOC-406 | Doctor routing hands a reworded problem to /doctor:helper | [DOC-406](doctor-commands/doctor-routing-helper-handoff.md) |

### 8.15 `/doctor:speckit`

Diagnoses spec-kit retrieval: the generated trigger index, its lookup and the ripgrep recipes.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-349 | Doctor speckit retrieval healthy | [DOC-349](doctor-commands/doctor-speckit-retrieval-healthy.md) |
| DOC-350 | Doctor speckit stale index | [DOC-350](doctor-commands/doctor-speckit-stale-index.md) |
| DOC-351 | Doctor speckit legacy target | [DOC-351](doctor-commands/doctor-speckit-legacy-target.md) |

### 8.16 `/doctor:symlink`

Checks, links or unlinks the Skilled checkout in a project repo, plan first. The row covers the plan and its digest, a merged folder that keeps the repo's own file, and the printed undo.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-398 | Doctor symlink | [DOC-398](doctor-commands/doctor-symlink.md) |

### 8.17 `/doctor:update`

Routes `check`, `align`, `apply`, `rollback`, `record-base` and `compat` for a spec-kit release. Seven rows run against the update fixture in section 7.2; one builds and resets that fixture. DOC-409 replays the declined and approved apply path and restores its scratch clone.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-357 | Doctor update check | [DOC-357](doctor-commands/doctor-update-check.md) |
| DOC-358 | Doctor update align | [DOC-358](doctor-commands/doctor-update-align.md) |
| DOC-359 | Doctor update apply | [DOC-359](doctor-commands/doctor-update-apply.md) |
| DOC-409 | Doctor update apply conversation | [DOC-409](doctor-commands/doctor-update-apply-conversation.md) |
| DOC-360 | Doctor update rollback | [DOC-360](doctor-commands/doctor-update-rollback.md) |
| DOC-361 | Doctor update record base | [DOC-361](doctor-commands/doctor-update-record-base.md) |
| DOC-379 | Doctor update test environment | [DOC-379](doctor-commands/doctor-update-test-environment.md) |
| DOC-381 | Doctor update compat | [DOC-381](doctor-commands/doctor-update-compat.md) |

---

## 9. AUTOMATED TEST CROSS-REFERENCE

The script tests cover the engine contracts. A scenario covers what the operator sees around them: the plan, the table, the refusal wording and the untouched tree.

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `.skilled/commands/doctor/scripts/route-validate.sh` | Route manifest against the on-disk YAML assets and each router's tool list | Every route row |
| `.skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` | CI route contract | DOC-392 to DOC-394 |
| `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs` | Workflow report JSON | DOC-392 |
| `.skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` | AGENTS.md route contract | DOC-396, DOC-397, DOC-404, DOC-405 |
| `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` | AGENTS.md check engine | DOC-404 |
| `.skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` | Helper route contract | DOC-400, DOC-401 |
| `.skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` | Helper ranking | DOC-400, DOC-401 |
| `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | sk-skill route contract | DOC-402, DOC-403 |
| `.skilled/commands/doctor/scripts/tests/doctor-setup-orphan-line.test.cjs` | Orphan summary line in the setup output | DOC-391 |
| `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` | Update route contract | DOC-357 to DOC-361, DOC-381 |
| `.skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs` | Compat classification | DOC-381 |
| `.skilled/commands/doctor/scripts/tests/git-hook-gates.test.cjs` | Hook gate switching | DOC-369, DOC-370 |
| `.skilled/commands/doctor/scripts/tests/doctor-speckit-contract.test.cjs` | Retrieval route contract | DOC-349 to DOC-351 |
| `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` | Mirror comparison | DOC-352, DOC-353 |
| `.skilled/commands/doctor/scripts/tests/doctor-symlink-contract.test.cjs` | Symlink plan and digest | DOC-398 |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | Install checklist | DOC-399 |
| `.skilled/commands/doctor/scripts/tests/doctor-mcp-contract.test.cjs` | MCP route contract | DOC-375 to DOC-378, DOC-380 |

---

## 10. SOURCE METADATA

### Routers

- Seventeen router sources, one per command, under `.skilled/commands/doctor/`.
- Route manifest: `.skilled/commands/doctor/_routes.yaml`
- Route assertion: `.skilled/commands/doctor/scripts/route-validate.sh`
- Category notes and per-command ID lists: `doctor-commands/README.md`

### Feature catalog

Feature catalogs stay in the skill that owns the feature. The catalog entry the doctor rows in the skill playbooks cited is `.skilled/skills/system-spec-kit/feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md`, and each scenario file carries its own catalog link where one applies.

### Numbering

- DOC numbers run in one shared series across every doctor scenario and every skill playbook that still links one. DOC-407 to DOC-410 are conversation companions, and the next free number is DOC-411.
- The two `/doctor:helper` scenarios were renumbered: DOC-393 is now DOC-400 and DOC-394 is now DOC-401. `/doctor:ci scaffold` and `/doctor:ci toggle` already held those two numbers in the same series, and those rows keep them. No other ID moved.
- `/doctor:ci scaffold` and `/doctor:ci toggle` were listed as unscripted in the older skill READMEs; they now have DOC-393 and DOC-394.

### Retired IDs

Docs are retired by removing their scenario, not by reusing their number.

- DOC-323 to DOC-330: the memory and causal-graph doctor scenarios, removed with the memory server they diagnosed.
- DOC-338 to DOC-342 and DOC-344 to DOC-347: the standalone rebuild-orchestrator and version-migration scenarios, removed with that command.

### Provenance

Provenance: manual only - root index of the doctor command scenarios

Manual only. The scenarios moved here from six skill playbooks, and the five category READMEs they shipped under are consolidated into `doctor-commands/README.md`. Each scenario file is the canonical row for its ID; this root is the index, the review protocol and the environment guide.
