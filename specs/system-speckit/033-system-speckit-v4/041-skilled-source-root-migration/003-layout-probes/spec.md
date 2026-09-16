---
title: "Feature Specification: Layout Probes for the Skilled Source-Root Move"
description: "Settle by live probe the runtime and git behaviors that decide what .opencode becomes once .skilled holds the authored tree, in disposable clones that leave the real checkouts and home config untouched."
trigger_phrases:
  - "skilled layout probes"
  - "runtime symlink resolution probe"
  - "dangling git hook probe"
  - "skilled rename rehearsal"
  - "opencode compat link shape"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Layout Probes for the Skilled Source-Root Move

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-16 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 11 |
| **Predecessor** | 002-per-runtime-reference-map |
| **Successor** | 004-migration-design |
| **Handoff Criteria** | Every question that decides the layout has a probe result, or a recorded reason it cannot be probed (`../spec.md:142`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Skilled Source-Root Migration specification.

**Scope Boundary**: Probes and records only. Every live probe runs in a disposable clone under `/tmp/skilled-probes-003/`. The repository gains this phase's probe records under `probes/` and its own planning documents, nothing else. Choosing the layout belongs to phase 004.

**Dependencies**:
- Phase 001 findings, whose open questions this phase closes (`../001-deep-research/research/research.md:160-167`)
- Phase 002 maps and findings, which add four questions and supply the fixture and home-level rows (`../002-per-runtime-reference-map/research/research.md:167-176`)
- The seven runtime CLIs installed on this machine, at the versions recorded when the probes run

**Deliverables**:
- Nine probe records, one per question, plus an environment record, under `probes/`
- Raw `--help` captures and two path listings under `probes/captures/`
- One implication line per candidate shape at the end of every probe record

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 004 cannot choose what `.opencode/` becomes until nine runtime and git behaviors are measured, and the two research phases left every one of them open. Neither research lane could say whether any of the seven runtimes can load its assets from a directory other than its own name, or whether opencode's plugin glob and Devin's skill scan follow a symlink (`../001-deep-research/research/research.md:162-163`). Git's handling of a dangling global hook, the gates' path filters under a linked root and rename detection across 17,767 tracked files are unmeasured too (`../001-deep-research/research/research.md:164-166`). Phase 002 added the SQLite rebuild command, the fixture assertions, Pi's extension imports and the ignored files (`../002-per-runtime-reference-map/research/research.md:170-176`). Phase 004 has to choose what `.opencode/` becomes, and each answer can rule a candidate shape in or out.

### Purpose
Answer each question with an observation from a live probe or a cited line from an installed runtime, and state what the answer means for each candidate shape, so phase 004 chooses from evidence.

These are the shapes the probes distinguish. The parent's open question names the choice between a full link farm and a minimal `.opencode/` (`../spec.md:157`), and D5 keeps `.opencode/` resolvable in every case (`../goal.md:50`):

- **Shape A**: `.opencode` is one link to `.skilled`.
- **Shape B**: `.opencode/` is a real directory whose `skills`, `commands`, `agents`, `hooks`, `plugins`, `bin` and `scripts` entries link into `.skilled/`.
- **Shape C**: `.opencode/` keeps only the entry points the opencode runtime itself reads.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Q1** Runtime root configurability for Claude Code, Codex, Cursor Agent, Devin, Pi, Hermes and opencode, from each installed CLI's loader source or documented flags.
- **Q2** Symlink resolution in opencode's flat plugin glob, Devin's skill scan and Pi's extension imports after relocation, plus command and agent discovery in Claude Code, Cursor Agent and Codex through linked directories.
- **Q3** What git does when a hook under `core.hooksPath` dangles.
- **Q4** Whether gate scripts run while their staged-path filters miss `.skilled` changes, under shapes A and B.
- **Q5** A rename-only commit of the 17,767 tracked `.opencode` files: rename detection, `git log --follow` and the pre-push mass-deletion ceiling of 100 deletions (`.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh:17`).
- **Q6** The command that rebuilds the tracked `council-graph.sqlite`.
- **Q7** Whether tests assert absolute paths beside the 35 recorded fixtures.
- **Q8** This machine's home-level state that names the repository or `.opencode`, as counts and keys only.
- **Q9** Untracked and ignored files that name `.opencode`, in worktree 055 and the main checkout.

### Out of Scope
- Choosing the layout, the cutover order or the rollback, because phase 004 owns them (`../spec.md:119`).
- Changing hooks, CI or workflow path filters, because phase 005 owns them (`../spec.md:120`). GitHub Actions filter matching is not probed locally.
- Changing root discovery, launchers or installers, because phase 006 owns them (`../spec.md:121`).
- Running any test suite. Phase 006 runs suites against both roots, and a suite run inside a skill here would leave caches in a real checkout.
- Editing home configs or reinstalling the global hooks, because phase 010 owns them (`../spec.md:125`).
- Home-level state on other machines, which stays UNKNOWN (`../001-deep-research/research/research.md:167`), and whether anything on another machine bootstraps the hand-made whole-directory links (`../002-per-runtime-reference-map/research/research.md:175`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `probes/probe-environment.md` | Create | Base SHA, runtime and git versions, effective git config and the before-and-after status and home-hash comparisons |
| `probes/runtime-root-configurability.md` | Create | Q1, one section per runtime |
| `probes/runtime-symlink-resolution.md` | Create | Q2, 11 surface rows across baseline, shape A and shape B clones |
| `probes/dangling-hook-behavior.md` | Create | Q3 |
| `probes/gate-filters-under-linked-root.md` | Create | Q4, 12 hook gates under shapes A and B |
| `probes/rename-rehearsal.md` | Create | Q5 |
| `probes/council-graph-rebuild.md` | Create | Q6 |
| `probes/fixture-path-assertions.md` | Create | Q7, one row per recorded fixture |
| `probes/home-state-enumeration.md` | Create | Q8 |
| `probes/untracked-ignored-files.md` | Create | Q9, one table per checkout |
| `probes/captures/*.txt` | Create | Raw `--help` output for each CLI and subcommand the Q1 units read, plus the Devin and opencode path listings |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` | Modify | This plan, then evidence as probes land |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Q1: for each of the seven runtimes and each asset surface it loads, record `configurable`, `fixed name` or `UNKNOWN`, backed by a `path:line` in installed source or a flag in a captured `--help` file. |
| REQ-002 | Q2: run the 11 surface rows in plan.md P2 in a baseline, a shape A and a shape B clone, with the baseline as positive control, and record loaded, not loaded, blind or a named reason for each of the 33 runs. |
| REQ-003 | Q3: record exit status, stderr and whether the commit or push landed when `pre-commit` and `pre-push` under `core.hooksPath` dangle, beside a non-executable control and a failing-hook control. |
| REQ-004 | Q4: for the 12 hook gates under shapes A and B, record whether the gate's script path resolves, how many staged `.skilled` changes its path filter matches and which branch the hook took. |
| REQ-005 | Q5: in a full disposable clone, record rename and deletion counts for a rename-only commit and a rename-plus-link commit at three `diff.renameLimit` settings, the mass-deletion verdict from the hook's own functions, the pre-push outcome, `git log --follow` counts for five files and the result of checking the move out over ignored files. |
| REQ-006 | Q8: enumerate home-level files that name `.opencode`, the main checkout path or the worktree path, as file path, match counts and key paths, with no values. |
| REQ-007 | Q9: enumerate untracked and ignored entries in worktree 055 and the main checkout that sit under `.opencode/` or name it in content, each classified by what produces it. |
| REQ-008 | No probe changes either checkout, the global hooks or a home config file, shown by status and hash comparisons taken before and after the probes. |
| REQ-009 | Every record written from a DeepSeek unit carries the brief verbatim, the dispatch command, the exit status and one row per returned citation marked matched or struck. |
| REQ-010 | Every probe record ends with one implication line each for shapes A, B and C. |

### P1 - Required (complete OR user-approved deferral)

Q6 and Q7 decide cutover work inside a chosen layout rather than which layout, so they sit one tier lower.

| ID | Requirement |
|----|-------------|
| REQ-011 | Q6: name the command that creates or rebuilds `council-graph.sqlite`, its inputs and whether it derives stored paths at rebuild time, with citations, plus per-column counts of path-bearing cells in a copy of the database. |
| REQ-012 | Q7: classify the assertion beside each of the 35 recorded fixtures as absolute, repo-relative literal, fragment, no path assertion or unread, with the test's `path:line`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 004 can cite a probe record for each of the nine questions, and no question is answered by inference alone.
- **SC-002**: Both checkouts' status differs from its pre-probe capture only by `probes/` and this folder's documents, and every guarded home file keeps its hash.
- **SC-003**: The orchestrator opened every citation a DeepSeek unit returned, and each lane-produced record shows how many matched and how many were struck.
- **SC-004**: `validate.sh --strict` on this folder ends with `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The seven runtime CLIs at their installed versions | A version change between planning and probing changes loader behavior | T001 re-reads versions, and any changed CLI gets a fresh help capture |
| Dependency | LLM Gateway access for `llmgateway/deepseek-v4.1-flash` (`.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:113`) | Units U1 to U10 cannot run on the lane | The orchestrator runs the unit itself and logs the deviation in `goal.md` |
| Risk | A clone's default `origin` is the main repository, so a push from a clone writes real refs | High | Remove `origin` right after each clone, and run `pre-push` by feeding it stdin, never by pushing |
| Risk | Clone commits run the main checkout's hooks through the global `core.hooksPath` (`~/.gitconfig:12`) | High | Pass `-c core.hooksPath=/tmp/skilled-probes-003/empty-hooks` on every clone write that is not itself the probe |
| Risk | Live runtime runs write trust entries or project registries into home config | High | Verified isolation directories per runtime, a hash guard around every run and a recorded reason instead of a run when isolation breaks authentication |
| Risk | A DeepSeek unit returns a citation that does not say what it claims | Medium | The orchestrator opens every citation before it enters a record |
| Risk | Fan-out, naming, validation and cache traps | Medium | plan.md §6 lists each trap with its evidence and mitigation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A live runtime run that has not exited after 10 minutes is stopped and recorded as stalled, and is not retried silently.
- **NFR-P02**: Every DeepSeek unit passes `--offline`, because Pi's startup network probes are not bounded by the dispatch timeout (`.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:15-17`).

### Security
- **NFR-S01**: No record holds a credential or a config value. The home enumeration emits file paths, match counts and key paths only.
- **NFR-S02**: No home-config content and no ignored-file content reaches a remote model. Lanes read tracked source, installed runtime source and path lists.

### Reliability
- **NFR-R01**: Every live row runs on an unmodified baseline clone first. A baseline that shows nothing marks the observation method blind instead of recording "not loaded".
- **NFR-R02**: A record alone reproduces its probe: base SHA, exact commands, runtime versions and effective git config.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a listing or marker check that returns nothing on the baseline clone means the method cannot see the surface. The row gets a new observation method and is never read as a negative.
- Maximum length: the rename rehearsal moves 17,767 tracked files in one commit and measures detection at `diff.renameLimit` 1, the default and 60000. The main repository sets 60000 in `.git/config:18-20`, and a fresh clone does not inherit that file.
- Invalid format: a lane reply without `path:line` citations is re-dispatched once with the brief corrected. A second reply without citations is recorded as a failed unit.

### Error Scenarios
- External service failure: when the gateway is unreachable, the orchestrator runs the unit and logs the deviation.
- Network timeout: lane dispatches pass `--offline`, and a runtime run that stalls on the network is recorded as stalled under NFR-P01.
- Concurrent access: operator sessions write the same home files during live runs. The guard reports changed key paths that name `/tmp/skilled-probes-003` and never restores a home file automatically.

### State Transitions
- Partial completion: each probe writes its own record, so a stopped session resumes at the first question without one.
- Session expiry: `/tmp` clones may not survive a reboot. The setup commands in plan.md rebuild them from the base SHA recorded in `probes/probe-environment.md`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Ten record files, no code change, seven runtimes and two checkouts observed |
| Risk | 15/25 | Live runtime runs sit next to home config, and a clone's default remote is the real repository |
| Research | 17/20 | Four of the seven runtimes ship compiled binaries, so their loader answers come from flags and live runs |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Can Claude Code, Cursor Agent and Codex authenticate with their config directories pointed under `/tmp`? `strings` on the installed binaries finds `CLAUDE_CONFIG_DIR`, `CURSOR_CONFIG_DIR` and `CODEX_HOME` as literals, but whether authentication survives the redirect stays UNKNOWN until T010 runs.
- Which no-model command makes opencode instantiate its plugins, and which makes Pi load project extensions? The baseline marker run decides for opencode. The Pi unit decides for Pi from `dist/core/extensions/loader.js`.
- Does Pi resolve an extension's relative imports from the link location or from the real file? `.opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:6` imports `../../.opencode/hooks/shared/hook-flags.mjs`, a path that resolves only from `.pi/extensions/`. The baseline run shows whether today's extensions load at all.
<!-- /ANCHOR:questions -->

---
