---
title: "system-skilled-doctor Manual Testing Playbook"
description: "Operator scenarios for system-skilled-doctor and every /doctor command it owns, and the corpus its benchmark runs score against."
trigger_phrases:
  - "system-skilled-doctor manual testing"
  - "system-skilled-doctor playbook"
  - "doctor commands manual testing playbook"
importance_tier: "important"
contextType: "general"
version: 1.1.2.0
---

# system-skilled-doctor Manual Testing Playbook

> Operator scenarios for this skill and every `/doctor` command it owns. This corpus is an input: a benchmark run reads it and
> never rewrites it, so a later run can be compared against an earlier one.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome, its reason and its evidence paths are recorded under the skill's `benchmark/reports/` directory by `record-playbook-run.cjs`, never by hand.

---

## 1. OVERVIEW

The package has three categories. `routing/` checks that Skilled integration requests route here, `overlays/` checks the overlay engine on temporary trees, and `doctor-commands/` checks every `/doctor` command as an operator runs it: the plan a plan-first route prints, the table a report route renders, the refusal an unknown flag gets, and the state a writing route leaves behind. Scenario counts are derived from the folders at validation time, so this document is not the census.

The doctor contract tests remain authoritative for each command's full behavior. These scenarios check what an operator sees.

### Realistic Test Model

1. Begin with the exact prompt in the selected scenario file.
2. Run the listed command sequence without substituting a broader or weaker check.
3. Compare the output with the expected signals.
4. Capture the transcript, exit status and a short signal summary.
5. Assign only `PASS`, `FAIL` or `SKIP`, then record the result under `benchmark/reports/`.

### Package Boundaries

- The `routing/` and `overlays/` scenarios write only inside a temporary tree. A scenario that writes builds that tree in a folder from `mktemp -d` and names no repository path.
- The `doctor-commands/` scenarios that change state run in the environments section 9 names, and each one restores its environment before the verdict.
- A `SKIP` needs a named environment blocker, such as a missing Node runtime, a missing live session or an unauthenticated `gh`.

---

## 2. GLOBAL PRECONDITIONS

1. Start at the repository root.
2. Use a current Node.js runtime. Python 3 and `git` are available, because most doctor steps run a script directly.
3. Confirm the referenced scenario files exist before execution.
4. Preserve unrelated working-tree changes. A doctor scenario that writes starts from a tree where `git status --porcelain` prints nothing.
5. A route that loads the advisor runtime has that runtime built: `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`.
6. No scenario pushes. Neither test worktree branch is pushed, and the `v4.0.0.3-fixture` tag is never pushed.
7. One scenario at a time in each long-lived environment named in section 9.
8. A scenario that writes restores the tree before the verdict. `update` resets through its fixture rollback until `restored` and `skipped` are empty, `/doctor:symlink` prints the undo for every link it writes, and `/doctor:agents-md` restores what it embedded.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

Capture the following for every scenario:

- Feature ID and per-feature file path.
- Exact prompt, copied without paraphrase, and the user request it stands for.
- Command transcript with the exit status of every step.
- The plan and its digest where the route is plan-first, and the JSON envelope where the route has a `--json` form.
- `git status --porcelain` before and after every run that writes.
- Expected signals and observed signals as rendered, not retyped, including any contradiction.
- Final `PASS`, `FAIL` or `SKIP` verdict with a one-sentence reason and the evidence paths.

---

## 4. DETERMINISTIC COMMAND NOTATION

- `bash: <command>` means run the command exactly in a POSIX-compatible shell from the repository root.
- A route step is written `/doctor:<command> <target> [flags]`.
- A script step is written `node <script> [flags]`.
- An AI-session step is written `agent: <instruction>`.
- `->` separates sequential steps in a single operator session, and each step's exit code is captured before the next one runs.
- An exit status of zero is required unless the scenario names a different observable result.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Scenario Acceptance Rules

A scenario is `PASS` only when its preconditions hold, the exact prompts and commands were used, every expected signal is present and no contradictory signal appears. It is `FAIL` when a command fails, an expected signal is absent or a contradictory signal appears. It is `SKIP` only when a specific environment blocker prevents execution and the blocker is recorded.

### Command Verdict Rules

- `PASS`: every mapped scenario for the command is `PASS`.
- `FAIL`: any mapped scenario is `FAIL`.
- `SKIP`: every mapped scenario is blocked by a named blocker.

Hard rule: a `FAIL` on a route's refusal path, the error an operator meets most often, forces the command verdict to `FAIL`.

### Release Review Rules

1. Every root-indexed scenario maps to exactly one per-feature file, and no index link is dangling.
2. All critical-path scenarios must be `PASS`. Any `FAIL` prevents a release recommendation.
3. No command verdict is `FAIL`, and no blocking triage item is open.
4. A `SKIP` does not count as passing release evidence.

### Root-vs-Scenario Rule

Keep verdict logic here. Put the command-specific caveat, such as a fixture unit that is expected to conflict, in the scenario file.

### Result Persistence

Save each verdict into the skill's `benchmark/reports/` with `record-playbook-run.cjs`: one row holds the verdict, a one-sentence reason and the evidence path, and the transcript and exit status are the evidence that path names.

---

## 6. OPERATOR EXECUTION WAVES

| Wave | Category | Scenario IDs | Purpose |
|---|---|---|---|
| 1 | Routing | `SKD-001`, `SKD-002` | Confirm integration requests route here and the owned commands kept their behavior. |
| 2 | Overlays | `SKD-003`, `SKD-004` | Confirm the overlay check names a missing manifest and writes nothing, and that a directory entry refuses an unprotected token-named file. |
| 3 | Overlays | `SKD-005`, `SKD-006`, `SKD-007`, `SKD-008`, `SKD-009` | Confirm the guard refuses an unowned write and allows a generated or excluded path, that adopt and the commit check close the gap, that a stale lock is taken over, and that an off-layout source moves. |
| 4 | Overlays | `SKD-010`, `SKD-011`, `SKD-012`, `SKD-013`, `SKD-014` | Confirm the audit lists the drift no overlay owns and fails while its README check stays advisory, that an owned root file upstream changed after the pin fails status, that a dropped appended item leaves the live file while a hand-edited one is refused, that a sibling overlay folder's old-layout sources stop at 20 layout lines, list whole in `offLayout` and move in one run, and that a removed upstream item leaves the file in its own layout. |
| 5 | Doctor commands | the `DOC` rows in section 10 | Confirm every doctor command's plan, report, refusal and restored tree. |

Waves 1 to 4 write only in temporary trees. Wave 5 follows these rules:

1. Probe runtime capacity at start, reserve one coordinator and fill the remaining worker slots.
2. Assign scenario IDs and their files before a wave starts.
3. Serialize every wave that writes: the two long-lived environments in section 9 take one scenario at a time, so two writing scenarios never share one.
4. Run the `update` fixture scenarios in their own wave, because each one mutates the fixture and resets it.
5. After a wave, save the evidence, then start the next wave.

---

## 7. ROUTING

### SKD-001 | An integration request routes to system-skilled-doctor

Verify the advisor ranks this skill first for a request to put Skilled into a project.

Prompt: `put Skilled into my project repo`

> **Feature File:** [SKD-001](routing/integration-request-routing.md)

### SKD-002 | A moved doctor command keeps its name and behavior

Verify the owned commands pass their contract tests and credit this skill.

Prompt: `check that the doctor commands still work after the ownership move`

> **Feature File:** [SKD-002](routing/moved-command-contract.md)

---

## 8. OVERLAYS

### SKD-003 | Overlay status on a tree with no overlays names the missing manifest

Verify `status` on an empty tree exits 2, names the default manifest path and writes nothing.

Prompt: `check my vendored skilled overlays in a folder that has none`

> **Feature File:** [SKD-003](overlays/status-without-overlays.md)

### SKD-004 | Overlay status refuses a token-named file a directory entry does not protect

Verify `status` reports one MISS line for the entry that walks an unprotected token-named file, names the `protectedPaths` fix, exits 1 and writes nothing.

Prompt: `check my own overlay folder with an unprotected tokens.css file`

> **Feature File:** [SKD-004](overlays/adopt-with-protected-file.md)

### SKD-005 | Overlay guard refuses a write under a vendored root that no overlay owns

Verify `--guard` on a manifest with `strictWrites` on exits 1 for a new file and for an unowned upstream file, and prints `allow` for a generated path and a path under `repin.exclude`.

Prompt: `stop me writing into the vendored skilled tree where no overlay owns the file`

> **Feature File:** [SKD-005](overlays/strict-guard-refuses-unowned-write.md)

### SKD-006 | Overlay adopt takes an unowned upstream file into the overlay folder

Verify `apply --adopt` on an unowned upstream file appends its manifest entry, copies the edited file into the overlay folder, pins upstream's bytes and leaves `status` passing.

Prompt: `adopt an upstream skill file i edited in place so a re-pin keeps my change`

> **Feature File:** [SKD-006](overlays/adopt-an-unowned-file.md)

### SKD-007 | Overlay pre-commit refuses a staged change no overlay owns

Verify `pre-commit` exits 1 naming a staged unowned vendored change, and exits 0 once that change is adopted.

Prompt: `block the commit while a vendored file no overlay owns is staged`

> **Feature File:** [SKD-007](overlays/pre-commit-refuses-unowned-change.md)

### SKD-008 | Overlay apply takes over a dead run's lock and repin --stage runs past it

Verify `apply` takes over a lock naming a dead process on this host with one `note:` line and removes the file, and refuses a lock naming a live process. Verify `repin --stage` reads the same dead lock, prints its own `note:` line, stages and leaves the file in place.

Prompt: `my overlay run died and left a lock file, can a new run take it over`

> **Feature File:** [SKD-008](overlays/stale-lock-takeover.md)

### SKD-009 | Overlay relayout moves an off-layout source onto its layout path

Verify `status` prints a `LAYOUT` line for an off-layout source and still passes, `apply --relayout` moves the copy and rewrites the manifest, and the `apply` and `status` that follow both pass.

Prompt: `move my overlay sources onto the layout folder`

> **Feature File:** [SKD-009](overlays/relayout-moves-sources.md)

### SKD-010 | Audit lists the vendored drift no overlay owns

Verify plain `status` passes while `status --audit` prints one `AUDIT` line for an unowned vendored file whose bytes differ from upstream and one for a tracked file upstream never had, prints `audit=2` and fails. Verify the same audit lists each overlay folder that lacks a README on a `DOCS` line and counts them in `docs=`, and that the README check never changes the result or the exit.

Prompt: `list the vendored files that drifted from upstream without an agent touching them`

> **Feature File:** [SKD-010](overlays/status-audit-lists-unowned-drift.md)

### SKD-011 | Status names a root file upstream changed since the pin

Verify `status` passes while an overlay's pinned root file matches upstream's copy at the pin, then prints one `STALE    root-file` line and fails once a re-pin moves the pin onto a commit that changed the file.

Prompt: `why does status call my agents overlay stale after a re-pin`

> **Feature File:** [SKD-011](overlays/stale-root-file-fails-status.md)

### SKD-012 | Apply removes an appended item its entry set drops

Verify `apply` records the two items a `json-entry` entry set appends, removes one from the live array once the entry set drops it, and refuses a dropped item that was edited by hand after it was applied.

Prompt: `an overlay item i appended is still in my registry file after i dropped it from the overlay`

> **Feature File:** [SKD-012](overlays/dropped-item-is-removed.md)

### SKD-013 | Overlay relayout moves a sibling folder's old-layout sources onto their layout paths

Verify `status` on a tree whose overlay folder sits beside it prints 20 `LAYOUT` lines and one overflow line and still passes, `status --json` lists all 21 sources in `offLayout`, and one `apply --relayout` backs them up beside the tree and moves them, after which `apply` and `status` both pass with no `LAYOUT` line.

Prompt: `move the sources in the overlay folder beside my tree onto the layout paths`

> **Feature File:** [SKD-013](overlays/sibling-folder-relayout.md)

### SKD-014 | Apply removes the upstream array items a removeItems names

Verify `apply` deletes the items a `removeItems` names from an upstream array while the rest of the file keeps its bytes, a second `apply` changes nothing, and `status` reads the file as in sync and notes a name the pinned copy never held.

Prompt: `my vendored utcp config still lists manuals we do not use and i do not want to carry the whole file`

> **Feature File:** [SKD-014](overlays/removed-items-leave-the-file.md)

---

## 9. TEST ENVIRONMENTS

Scenarios that change state run in one of two long-lived local worktrees instead of a throwaway copy. Both stay local: never push their branches, and never push the `v4.0.0.3-fixture` tag. Run one scenario at a time in each environment.

### 9.1 Current-code environment

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

### 9.2 `/doctor:update` fixture

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
- **Reset after apply:** run `rollback --run=<runDir>`, require every written path under `restored` and `skipped` empty, confirm `git status --porcelain` prints nothing, then delete the run directory under `.skilled/skills/.state/doctor-update/runs/`. Never apply the same run twice.
- **Commits in the fixture:** the v4.0.0.0 hooks need dependencies the fixture does not have, so fixture commits set `SPECKIT_SKIP_MIRROR_PARITY=1 SPECKIT_SKIP_ROUTE_REMINT=1`, the two bypasses those hooks name. Never use `--no-verify`.
- **Recreate:** DOC-379 lists every build step.

### 9.3 Runs outside both environments

A scenario whose steps do not fit either environment says so in its own file, and the run is disposable:

- **Any working copy.** Scenarios that change nothing run where you are: the menu, refusal, list and read-only report rows.
- **A disposable clone.** DOC-370 runs on a clone, because a linked worktree shares the main checkout's `.git/config` and `git config --local` would change the real repository.
- **A throwaway folder or copy.** DOC-331 to DOC-333 need their own empty or seeded graph state, DOC-381 builds its own v3 fixture because the compat move renames the spec roots, DOC-383 uses a shallow clone of `v3.6.0.0`, and DOC-395 writes only in the scratch repository it creates. DOC-396 and DOC-397 compose the `adopted` fixture into their own throwaway folder outside the checkout.
- **A live session beside the folder.** DOC-396 needs a Devin session and DOC-397 a Cursor window. Until one is available, the row records `UNKNOWN` with its reason rather than a default pass.

Every disposable run is deleted afterwards, and the tree is checked with `git status --porcelain` before the verdict.

---

## 10. DOCTOR COMMAND INDEX

Every scenario file in `doctor-commands/` appears exactly once below, under the command it exercises. The ID, the folder and the file name are the identity of a scenario; the section is the grouping an operator starts from. The seven routing probes sit under `/doctor:skill-advisor`, because each one runs the advisor hook and reads the doctor line it prints, whatever command that line names.

### 10.1 `/doctor:agents-md`

Checks, embeds or restores the shipped AGENTS.md sections, plan first. Two rows need a live session on the runtime they check; two check and restore in a folder the operator names.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-396 | Doctor agents md block reaches a live Devin session | [DOC-396](doctor-commands/doctor-agents-md-block-devin-quote.md) |
| DOC-397 | Doctor agents md mirror loads in Cursor | [DOC-397](doctor-commands/doctor-agents-md-cursor-mirror-load.md) |
| DOC-404 | Doctor agents md check | [DOC-404](doctor-commands/doctor-agents-md-check.md) |
| DOC-405 | Doctor agents md embed and restore | [DOC-405](doctor-commands/doctor-agents-md-embed-restore.md) |

### 10.2 `/doctor:ci`

Lists GitHub Actions workflows with their switch state, scaffolds a new workflow, or toggles one CI switch. Four rows cover the report, scaffold refusals, the toggle round trip and a conversation that proves a declined toggle leaves local and remote state unchanged.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-392 | Doctor CI report | [DOC-392](doctor-commands/doctor-ci-report.md) |
| DOC-393 | Doctor CI scaffold | [DOC-393](doctor-commands/doctor-ci-scaffold.md) |
| DOC-394 | Doctor CI toggle | [DOC-394](doctor-commands/doctor-ci-toggle.md) |
| DOC-410 | Doctor CI toggle conversation | [DOC-410](doctor-commands/doctor-ci-toggle-conversation.md) |

### 10.3 `/doctor:deep-loop`

Diagnoses deep-loop coverage graphs and convergence. Three rows need their own empty or seeded graph state; the fourth selects a scope and refuses an unknown value.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-331 | Doctor deep-loop lazy init | [DOC-331](doctor-commands/doctor-deep-loop-lazy-init.md) |
| DOC-332 | Doctor deep-loop empty no source | [DOC-332](doctor-commands/doctor-deep-loop-empty-no-source.md) |
| DOC-333 | Doctor deep-loop convergence | [DOC-333](doctor-commands/doctor-deep-loop-convergence.md) |
| DOC-368 | Doctor deep-loop scope | [DOC-368](doctor-commands/doctor-deep-loop-scope.md) |

### 10.4 `/doctor:env`

Inspects documented environment switches and confirms a preference change. One row reads, one writes a saved preference behind a yes, and one proves secrets and per-invocation switches are never saved.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-354 | Doctor env inspect | [DOC-354](doctor-commands/doctor-env-inspect.md) |
| DOC-355 | Doctor env save preference | [DOC-355](doctor-commands/doctor-env-save-preference.md) |
| DOC-356 | Doctor env secret and per-invocation | [DOC-356](doctor-commands/doctor-env-secret-and-per-invocation.md) |

### 10.5 `/doctor:git`

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

### 10.6 `/doctor:helper`

Ranks the doctor command that fits a described problem, with why, ready to run. One row runs a read-only pick in place; the other hands a writing pick back with the no-match fallback.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-400 | Doctor helper ranks a problem and runs a read-only pick | [DOC-400](doctor-commands/doctor-helper-read-only-pick.md) |
| DOC-401 | Doctor helper hands a writing pick back and offers the fallback | [DOC-401](doctor-commands/doctor-helper-writing-handoff.md) |

### 10.7 `/doctor:install`

Gets the ordered steps that put Skilled into a project repo. One row covers the five ordered steps from `list` and a guided run that checks the two builds and the target, then prints the checklist without writing.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-399 | Doctor install | [DOC-399](doctor-commands/doctor-install.md) |

### 10.8 `/doctor:mcp`

Installs or debugs Code Mode, its UTCP configuration and runtime registration. Two rows stop before any workflow loads and run in any working copy; the other three need the shipped tree.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-375 | Doctor mcp install | [DOC-375](doctor-commands/doctor-mcp-install.md) |
| DOC-376 | Doctor mcp debug | [DOC-376](doctor-commands/doctor-mcp-debug.md) |
| DOC-377 | Doctor mcp debug fix | [DOC-377](doctor-commands/doctor-mcp-debug-fix.md) |
| DOC-378 | Doctor mcp target menu | [DOC-378](doctor-commands/doctor-mcp-target-menu.md) |
| DOC-380 | Doctor mcp unknown flag | [DOC-380](doctor-commands/doctor-mcp-unknown-flag.md) |

### 10.9 `/doctor:overlay`

Checks whether a vendored Skilled tree still carries its overlays, puts them back, or re-pins the tree to a newer upstream commit, after one yes. Its scenarios are `SKD-003` to `SKD-014`, indexed once in section 8, so no `DOC` row repeats them here.

### 10.10 `/doctor:runtime-mirrors`

Checks that the agent, command, prompt and hook mirrors in each runtime directory match `.skilled`. One row is a tree in sync and one is a single drifted mirror.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-352 | Doctor runtime mirrors in sync | [DOC-352](doctor-commands/doctor-runtime-mirrors-in-sync.md) |
| DOC-353 | Doctor runtime mirrors drift | [DOC-353](doctor-commands/doctor-runtime-mirrors-drift.md) |

### 10.11 `/doctor:setup`

The umbrella: lists every doctor target and runs the read-only setup checks, naming the repair command for each failing leg.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-391 | Doctor setup umbrella run | [DOC-391](doctor-commands/doctor-setup-run.md) |

### 10.12 `/doctor:sk-code`

Runs the sk-code setup battery, or checks and creates the repository quality config. One row runs the battery on a pre-v4 checkout, where no leg runs and provisioning fails with the v4-layout repair.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-382 | Doctor sk-code setup | [DOC-382](doctor-commands/doctor-sk-code-setup.md) |
| DOC-383 | Doctor sk-code on a pre-v4 checkout | [DOC-383](doctor-commands/doctor-sk-code-pre-v4-checkout.md) |
| DOC-395 | Doctor sk-code quality | [DOC-395](doctor-commands/doctor-sk-code-quality.md) |

### 10.13 `/doctor:sk-skill`

Checks a skill against the Skilled format, or converts one to it, plan first. The check route reads and writes nothing; the convert route prints a plan and writes only after an explicit yes.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-402 | Doctor sk-skill check | [DOC-402](doctor-commands/doctor-sk-skill-check.md) |
| DOC-403 | Doctor sk-skill convert | [DOC-403](doctor-commands/doctor-sk-skill-convert.md) |

### 10.14 `/doctor:skill-advisor`

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

### 10.15 `/doctor:speckit`

Diagnoses spec-kit retrieval: the generated trigger index, its lookup and the ripgrep recipes.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-349 | Doctor speckit retrieval healthy | [DOC-349](doctor-commands/doctor-speckit-retrieval-healthy.md) |
| DOC-350 | Doctor speckit stale index | [DOC-350](doctor-commands/doctor-speckit-stale-index.md) |
| DOC-351 | Doctor speckit legacy target | [DOC-351](doctor-commands/doctor-speckit-legacy-target.md) |

### 10.16 `/doctor:symlink`

Checks, links or unlinks the Skilled checkout in a project repo, plan first. The row covers the plan and its digest, a merged folder that keeps the repo's own file, and the printed undo.

| ID | Scenario | Scenario File |
|---|---|---|
| DOC-398 | Doctor symlink | [DOC-398](doctor-commands/doctor-symlink.md) |

### 10.17 `/doctor:update`

Routes `check`, `align`, `apply`, `rollback`, `record-base` and `compat` for a spec-kit release. Five rows run against the update fixture in section 9.2, one builds and resets that fixture, and DOC-381 builds its own throwaway v3 fixture. DOC-409 replays the declined and approved apply path and restores its scratch clone.

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

## 11. AUTOMATED TEST CROSS-REFERENCE

The script tests cover the engine contracts. A scenario covers what the operator sees around them: the plan, the table, the refusal wording and the untouched tree.

| Coverage Area | Automated Or Structural Anchor | Scenario IDs |
|---|---|---|
| Advisor routing | [Skill graph metadata](../graph-metadata.json) | `SKD-001` |
| Doctor command contracts | `.skilled/commands/doctor/scripts/tests/` | `SKD-002` |
| Overlay engine | `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` | `SKD-003`, `SKD-004`, `SKD-005`, `SKD-006`, `SKD-007`, `SKD-008`, `SKD-009`, `SKD-010`, `SKD-011`, `SKD-012`, `SKD-013`, `SKD-014` |
| Route manifest against the on-disk YAML assets and each router's tool list | `.skilled/commands/doctor/scripts/route-validate.sh` | Every route row |
| CI route contract | `.skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` | DOC-392 to DOC-394 |
| Workflow report JSON | `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs` | DOC-392 |
| AGENTS.md route contract | `.skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` | DOC-396, DOC-397, DOC-404, DOC-405 |
| AGENTS.md check engine | `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` | DOC-404 |
| Helper route contract | `.skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` | DOC-400, DOC-401 |
| Helper ranking | `.skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` | DOC-400, DOC-401 |
| sk-skill route contract | `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | DOC-402, DOC-403 |
| Orphan summary line in the setup output | `.skilled/commands/doctor/scripts/tests/doctor-setup-orphan-line.test.cjs` | DOC-391 |
| Update route contract | `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` | DOC-357 to DOC-361, DOC-381 |
| Compat classification | `.skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs` | DOC-381 |
| Hook gate switching | `.skilled/commands/doctor/scripts/tests/git-hook-gates.test.cjs` | DOC-369, DOC-370 |
| Retrieval route contract | `.skilled/commands/doctor/scripts/tests/doctor-speckit-contract.test.cjs` | DOC-349 to DOC-351 |
| Mirror comparison | `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` | DOC-352, DOC-353 |
| Symlink plan and digest | `.skilled/commands/doctor/scripts/tests/doctor-symlink-contract.test.cjs` | DOC-398 |
| Install checklist | `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | DOC-399 |
| MCP route contract | `.skilled/commands/doctor/scripts/tests/doctor-mcp-contract.test.cjs` | DOC-375 to DOC-378, DOC-380 |

---

## 12. SOURCE METADATA

### Routers

- Seventeen router sources, one per command, under `.skilled/commands/doctor/`.
- Route manifest: `.skilled/commands/doctor/_routes.yaml`
- Route assertion: `.skilled/commands/doctor/scripts/route-validate.sh`
- Category notes and per-command ID lists: [`doctor-commands/README.md`](doctor-commands/README.md)

### Feature catalog

Feature catalogs stay with the skill that owns the engine or capability a command drives, not with the command's owner, so this skill keeps no catalog of its own. The catalog entry the doctor rows cite is `.skilled/skills/system-spec-kit/feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md`, and each scenario file carries its own catalog link where one applies.

### Numbering

- DOC numbers run in one shared series across every doctor scenario. DOC-407 to DOC-410 are conversation companions, and the next free number is DOC-411.
- The two `/doctor:helper` scenarios were renumbered: DOC-393 is now DOC-400 and DOC-394 is now DOC-401. `/doctor:ci scaffold` and `/doctor:ci toggle` already held those two numbers in the same series, and those rows keep them. No other ID moved.
- `/doctor:ci scaffold` and `/doctor:ci toggle` were listed as unscripted in the older skill READMEs; they now have DOC-393 and DOC-394.

### Retired IDs

Docs are retired by removing their scenario, not by reusing their number.

- DOC-323 to DOC-330: the memory and causal-graph doctor scenarios, removed with the memory server they diagnosed.
- DOC-338 to DOC-342 and DOC-344 to DOC-347: the standalone rebuild-orchestrator and version-migration scenarios, removed with that command.

### Provenance

Provenance: manual only - the skill's own scenarios plus every doctor command scenario

Manual only. The `doctor-commands/` scenarios were first gathered from six skill playbooks into one package outside every skill, and now live in this skill because it owns every doctor command. Each scenario file is the canonical row for its ID; this root is the index, the review protocol and the environment guide.
