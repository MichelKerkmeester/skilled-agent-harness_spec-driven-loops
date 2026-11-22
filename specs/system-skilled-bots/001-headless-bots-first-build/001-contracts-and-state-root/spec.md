---
title: "Feature Specification: Phase 1: contracts-and-state-root"
description: "No bot has a definition format, a run record or a place to keep its state, so no later phase can be built. This phase fixes the run record, the BOT.md format, bots/config.json, repository identity, the needs-you item and the state layout as tested libraries."
trigger_phrases:
  - "contracts and state root"
  - "phase 1 contracts and state root"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 1: contracts-and-state-root

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY
<!-- FILL: Write three sentences: the problem, the change and the proof. GOOD: Nothing deletes old archives, so `logs/archive` grows without limit. The `--keep <n>` option keeps only the newest n. With 10 archives, `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: This document describes the feature. -->

No bot definition, run record or state location exists today, so no later phase of the bots hub can be built. This phase writes the contracts as tested libraries: the run record, `BOT.md`, `bots/config.json`, repository identity, the needs-you item and a split state layout. Run folders go into the Skilled tree's gitignored `.state`, and everything a run must not write stays under the user-level state root. `npm test` in the new runtime folder proves each contract, with state pointed at temp folders and the checkout left unchanged.

**Key Decisions**: run folders live in the Skilled tree's gitignored `.state` while the record, queue, leases, switches and needs-you items stay user-level (ADR-001, operator D2). A repository with no remote needs an explicit `identity` field, and install and enqueue refuse while identity is unknown (ADR-002, operator D3). A run that needs a human ends `awaiting-decision` and writes one needs-you item (ADR-010, operator D1, design Proposed).

**Critical Dependencies**: `currentRepository` in sk-code's `repository-identity.cjs` and `writeStateAtomic` in the deep-loop `atomic-state.ts`, both imported and never edited.

---
<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-11-22 |
| **Branch** | `scaffold/001-contracts-and-state-root` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-schedule-predicates-and-checker |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the record, definition, config, identity, state-root and needs-you libraries pass their tests and the Q3 and Q5 decisions sit in the parent `decision-record.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Build system-skilled-bots: file-defined headless agent bots run on a schedule or event specification.

**Scope Boundary**: Contracts and the state layout only. This phase writes libraries and tests that parse, validate, store and locate. It dispatches nothing, schedules nothing and ships no checker CLI.

**Dependencies**:
- None. This is the first phase. Phases 2 and 3 both start from its libraries.
- Reused code that already exists: `.skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs` (`currentRepository`) and `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts` (`writeStateAtomic`).

**Operator decisions (2026-11-22)**: D2 moves run folders into the resolved Skilled tree under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/<run id>/`, which git ignores. D3 accepts the explicit `identity` field. D1 adds the decision queue: a terminal exit `awaiting-decision` and a needs-you item. D5 accepts the retention defaults 1,000, 200 and 100. D8 raises this phase to Level 3. D10 adds two config keys: `needsYou.expiryDays` (default 7) and `retention.closedNeedsYouPerIdentity` (default 200).

**Deliverables**:
- Run record schema with read and write, covering every field group of research.md §10, stored under the user-level state root.
- `BOT.md` parser and field predicates (research.md §5).
- `bots/config.json` reader, including the identity field, the git-hook opt-in and the retention keys (research.md §5).
- Repository identity for the hub, with the explicit identity rule for a repository that has no remote (research.md §12, §16 Q5, operator D3).
- State layout: the user-level state root and the in-tree run folder root (research.md §11, operator D2).
- The needs-you item record schema and its folder (operator D1).
- The missing-isolation rule and the git-hook opt-in key that phases 4 and 5 read.
- One `BOT.md` template for authors.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
No bot definition format, run record or state location exists in the repository today, so the runner, the checker, the installer and the status index have nothing to read or write (research.md §5, §10). The research found that the record, delivery, budget reporting and the failure classes were each specified in terms of fields the others need, so the record has to be fixed first (research.md §10, §15 step 1). The identity resolver returns `null` for a repository with no remote, and two such repositories would share a label prefix and a state folder (research.md §16 Q5).

### Purpose
Every later phase imports one tested set of contracts: a run record, a `BOT.md` definition, a repository config, a repository identity, a needs-you item and a state layout. Nothing lands in a checkout's git status. Run evidence goes to the Skilled tree's gitignored `.state`, and everything a run must not write stays under the user-level state root.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ find .skilled/skills/system-skilled-bots -mindepth 1 | wc -l
       0

$ T=$(mktemp -d); git -C "$T" init -q
$ node -e "const {currentRepository}=require('./.skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs'); console.log(JSON.stringify(currentRepository({root: process.argv[1], env: {PATH: process.env.PATH, HOME: process.env.HOME}})))" "$T"
{"identity":null,"source":null}

$ node -e "const {currentRepository}=require('./.skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs'); console.log(JSON.stringify(currentRepository({root: process.cwd()})))"
{"identity":"MichelKerkmeester/skilled-agent-harness_spec-driven-loops","source":"origin"}

$ git check-ignore -v .skilled/skills/.state/system-skilled-bots/x/runs/r1/record.json
.gitignore:135:.skilled/skills/.state/*/*	.skilled/skills/.state/system-skilled-bots/x/runs/r1/record.json

$ rg -n "awaiting-decision" .skilled; echo "rg_exit=$?"
rg_exit=1
```
The skill folder exists and holds 0 entries. A fresh repository with no remote resolves to `identity: null`. This checkout resolves from its origin remote. In this checkout, `.gitignore` line 135 ignores a file under `.skilled/skills/.state/system-skilled-bots/`. No file under `.skilled` uses the string `awaiting-decision` yet. Run on 2026-11-22 from the repository root.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Define the run record with identity, request join, dispatch snapshot, budget, honored posture, exit, evidence locations and delivery, with write and read helpers (research.md §10). Without it no later phase can store or report a run. The record lives under the user-level state root and points to its run folder.
- Parse `BOT.md` frontmatter and body and expose the field predicates: required, defaulted, posture, trigger kinds and delivery fields (research.md §5). The checker in phase 2 and the runner in phase 3 import these predicates and restate none of them (research.md §6).
- Read `bots/config.json`: allowed executor kinds, state-root override, default isolation (research.md §5), the explicit identity field (research.md §16 Q5, operator D3), the git-hook opt-in key that phase 5 reads (ADR-009), the four retention keys (operator D5 and D10, ADR-011) and the needs-you expiry key (operator D10).
- Resolve two roots. The user-level state root is `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots/` and holds requests, leases, switches, needs-you items, run records, install records, the index and registered roots. The in-tree run root is `<Skilled tree>/.skilled/skills/.state/system-skilled-bots/` and holds run folders only (research.md §11, operator D2, ADR-001, ADR-008).
- Build repository identity for the hub on top of `currentRepository`, and refuse to resolve a state folder while identity is unknown (research.md §12, §16 Q5). Two clones of one repository share one identity folder, by a tested rule (ADR-006).
- Resolve the isolation posture from the definition, then the repository default, else refuse with a named reason (research.md §5, ADR-007).
- Define the terminal exit value `awaiting-decision` and the needs-you item record, with read and write helpers, under `<state root>/<identity key>/needs-you/` (operator D1, ADR-010).
- Ship one `BOT.md` template for authors under the skill's assets.

### Out of Scope
- Any dispatch, lease or budget enforcement - the runner is phase 3.
- Writing a needs-you item from a live run, `bots inbox` and `bots answer` - phase 3 owns them. The `resume` request kind and its idempotency key - phase 5 owns them. Status rows and retention for items - phase 7 owns them.
- Any scheduler, plist or `launchctl` call - the installer is phase 6, and the scheduling invariant bars it here.
- The cron translator, label grammar and checker CLI - phase 2 owns them.
- Hub registry files (`mode-registry.json`, `hub-router.json`, mode packets) - phase 8 owns them, and no mode is routed before then.
- Any file under a consumer's `bots/` folder - the hub writes nothing into a checkout's tracked files (research.md §11).
- Any edit to the doctor overlay engine - this phase only reads it and records what a re-pin does to `.skilled/skills/.state/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Create | Record schema, field groups, write by temp file and rename, read and validate, run folder pointer |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Create | `BOT.md` parser, defaults and field predicates |
| `.skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts` | Create | `bots/config.json` reader |
| `.skilled/skills/system-skilled-bots/runtime/lib/identity.ts` | Create | Hub identity over `currentRepository`, with the explicit identity rule and the guard install and enqueue call |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Create | User-level state root, in-tree run root and the folder layout |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Create | Needs-you item schema, write by temp file and rename, read and the derived item state |
| `.skilled/skills/system-skilled-bots/runtime/tests/*.vitest.ts` | Create | One test file per library, with fixtures |
| `.skilled/skills/system-skilled-bots/runtime/package.json` | Create | Self-contained dependency root with `tsx` and `vitest`, the shape of the deep-loop runtime |
| `.skilled/skills/system-skilled-bots/assets/bot-template.md` | Create | The `BOT.md` template for authors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A run record written with every research.md §10 field group, including the worktree path and branch and the absolute run folder path under evidence locations, reads back equal, and an unknown cost reads back as `null`, never `0`. The record is stored at `<state root>/<identity key>/records/<run id>.json`, never inside the run folder. Proven by the `run-record` test file under `npm test`. |
| REQ-002 | The three worked shapes of research.md §5 (scheduled deep review, queued event, manual) parse. A definition with no `id`, no `trigger` or an empty body is rejected with a named reason per case. |
| REQ-003 | The user-level state root resolves to `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots/` and honors the `bots/config.json` `stateRoot` override. The in-tree run root resolves to `<Skilled tree>/.skilled/skills/.state/system-skilled-bots/` from an explicit Skilled tree input, and the override never moves it. Every derived file is written by temp file and rename. |
| REQ-004 | No test writes inside the checkout or a vendored tree. Every test points `XDG_STATE_HOME` at a temp folder and passes a temp Skilled tree to the run-root resolver. `git status --short` is unchanged after the suite, and the real checkout's `.skilled/skills/.state/system-skilled-bots` is absent before and after the suite, because gitignored writes never show in `git status`. |
| REQ-005 | Two repositories with unknown identity can never resolve to the same state folder. A repository with no remote and no declared identity resolves to a refusal with the reason `identity-unknown`, not a path. The identity library exports one guard that install (phase 6) and enqueue (phase 5) call, and it refuses while identity is unknown (operator D3). |
| REQ-010 | Two clones of one repository with the same origin remote resolve to one identity folder, and both checkout paths appear in `registered-roots` under that identity (ADR-006). |
| REQ-014 | A run folder resolves to `<Skilled tree>/.skilled/skills/.state/system-skilled-bots/<identity key>/runs/<run id>/`, where the Skilled tree is the one the registered checkout resolves, never the run's worktree. Before it creates the folder the resolver asks git whether the path is ignored, and it refuses with `run-folder-not-ignored` when it is not. Reading a record whose run folder has vanished returns the record and reports the folder as missing, and never throws (operator D2, ADR-001). |
| REQ-015 | The record's exit accepts the terminal value `awaiting-decision` with class `operator` and the id of one needs-you item. A needs-you item written with run id, bot id, identity, question, options, created and expiry instants and evidence pointers reads back equal from `<state root>/<identity key>/needs-you/<item id>.json`. Its state (open, answered or expired) is derived from its fields and never stored (operator D1, ADR-010). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The Q3 (run directory location) and Q5 (identity with no remote) decisions are recorded in the parent `decision-record.md` as operator decisions. |
| REQ-007 | The record's status, stop and delivery fields use only the five existing vocabularies (research.md §10), plus exactly one operator-decided exit value, `awaiting-decision` (ADR-010). A grep of the hub runtime finds no new status enum and no other new value. |
| REQ-008 | A skill folder at `.skilled/skills/system-skilled-bots/` with runtime code and no registered modes does not fail the existing skill and advisor checks. The layout this phase picks is the one those checks accept. |
| REQ-009 | No code path in this phase calls `launchctl` or writes a plist. A grep of the hub runtime for `launchctl` and `LaunchAgents` finds no match. |
| REQ-011 | Isolation resolves from the definition's `isolation` field, then the config's `defaultIsolation`, else to a refusal with the reason `isolation-undeclared`. No code path picks `shared` or `worktree` by itself (ADR-007). |
| REQ-012 | The config reader exposes `gitHookTrigger` as a boolean that defaults to `false` when the key or the file is absent, and rejects a non-boolean value by name (ADR-009). |
| REQ-013 | The config reader accepts an `identity` field only in the `owner/name` shape `currentRepository` returns, and rejects any other value with the reason `identity-invalid`. A declared identity wins over the remote (ADR-002). A repository with no remote gets its identity this way, in the same shape: `"identity": "local/tool"` is valid, and the guard returns it. |
| REQ-016 | The config reader exposes `retention.indexRowsPerIdentity`, `retention.runFoldersPerBot`, `retention.skippedSlotsPerSummary` and `retention.closedNeedsYouPerIdentity` with the defaults 1000, 200, 100 and 200, and `needsYou.expiryDays` with the default 7, when the key or file is absent. It rejects a value that is not a positive integer by name (operator D5 and D10, ADR-011). |
| REQ-017 | What a doctor overlay re-pin does to `.skilled/skills/.state/` is checked and recorded in `scratch/overlay-repin-state.md`, with the code lines read and the staged re-pin result, before phase 3 writes its first run folder. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `npm test` in `.skilled/skills/system-skilled-bots/runtime/` passes, and it includes the record round trip, the three worked shapes, the three rejected definitions, the two-repositories identity case, the two-clones case, the missing-isolation refusal, the needs-you round trip, the vanished run folder read and the not-ignored run folder refusal.
- **SC-002**: `git status --short` prints the same lines before and after the suite. The state files the tests wrote all sit under the temp `XDG_STATE_HOME` or the temp Skilled tree, and the real `.skilled/skills/.state/system-skilled-bots` does not exist after the suite.
- **SC-003**: Phases 2 and 3 can start with no change to the contracts. Any later change to the record, the definition or the needs-you item goes back through this phase's spec.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `currentRepository` in `repository-identity.cjs` (owned by sk-code) | If its return shape changes, hub identity breaks | Import it, never copy or edit it. Pin its `{identity, source}` shape in one test |
| Dependency | `writeStateAtomic` in the deep-loop `atomic-state.ts` | A TypeScript import needs the `tsx` loader | Use the deep-loop pattern: a self-contained runtime `package.json` and the `runtime-bootstrap.cjs` loader approach. Proposed in ADR-004 |
| Dependency | The `.gitignore` of the repository that holds the Skilled tree | A vendored tree in a consumer repository without the ignore line would put run files in its git status | The resolver refuses with `run-folder-not-ignored` (REQ-014). T023 checks whether the doctor install flow adds the line |
| Risk | Two clones of one repository share an identity, so they share labels and state | High | Sharing is intended and tested (REQ-010). Proposed in ADR-006 |
| Risk | Contract drift after this phase | High | Later phases import the predicates and never restate them. A change to the record, the definition or the item reopens this spec |
| Risk | A re-pin, reinstall or symlink retarget of the Skilled tree loses or hides run folders | Med | The record and the index live user-level, so a lost run folder never loses the record. Run evidence in the tree is best-effort. T018 records what a re-pin does |
| Risk | A skill folder with no registry fails existing checks before phase 8 | Med | Run the skill and advisor checks in setup and pick the layout they accept (REQ-008) |
| Risk | A test writes real state under `~/.local/state` or the real checkout's `.state` | Med | Every test sets `XDG_STATE_HOME` and the Skilled tree to temp folders. Guard tests fail when a resolved path sits under the real home or the real checkout |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->

### Performance
- **NFR-P01**: N/A. These are libraries called once per run. No service runs.
- **NFR-P02**: N/A. No throughput target applies to a parser.

### Security
- **NFR-S01**: The user-level state root, the in-tree run root and every run folder are created with owner-only permissions (`0700`), the same rule the env-secret guard uses for its state.
- **NFR-S02**: No library logs a command line or an environment value.
- **NFR-S03**: Nothing a run must not write sits in the run root. Requests, leases, switches, needs-you items, run records, install records, the index and registered roots all resolve under the user-level state root (research.md §13: a switch the run can write is no switch).

### Reliability
- **NFR-R01**: A crash mid-write leaves either the old file or the new file, never a partial one, because every derived file is written by temp file and rename.
- **NFR-R02**: A missing path is not a failure, and an unreadable path is not reported as missing (research.md §15 invariants). A vanished run folder is reported as missing on the record read, never as a crash.

---

## 8. EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Missing posture: a definition with no `isolation` field in a repository with no `defaultIsolation` resolves to the refusal `isolation-undeclared`. It still parses, because the three worked shapes of research.md §5 declare no isolation.
- Empty input: a `BOT.md` with valid frontmatter and an empty body is rejected with the reason `empty-body`. A missing `bots/config.json` is not an error and yields the defaults, including the four retention numbers and the 7-day needs-you expiry.
- Maximum input: a record with a delivery list of many targets keeps one delivery entry per target in order. Frontmatter with unknown keys is rejected by name so a typo never passes silently.
- Failure path: a repository with no remote and no declared identity makes the resolver return a refusal with the reason `identity-unknown`, and no state folder is created.
- Not ignored: a run root whose path git does not ignore makes the resolver refuse with `run-folder-not-ignored`, and no run folder is created.
- Vanished run folder: a record whose run folder was removed by a re-pin, a reinstall or by hand reads back whole, with the folder reported missing.
- Needs-you item past expiry with no answer reads as expired. It is never answered automatically.
- Symlinked `.skilled`: several consumer repositories share one Skilled checkout's run root, split by identity key.

---

## 9. COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 17/25 | About 14 new files: six libraries, their tests, fixtures, a package root and one template. One new skill folder |
| Risk | 15/25 | No runtime behavior, but every later phase builds on these contracts. The identity rule decides whether two repositories collide, and the run root writes into the Skilled tree |
| Research | 9/20 | The fields are researched (research.md §5, §10, §11). The no-remote identity rule and the needs-you queue were operator decisions, not research. The overlay re-pin effect is read from code |
| Multi-Agent | 6/15 | One author per phase. Phases 2 to 8 are written by other agents against these contracts |
| Coordination | 12/15 | Phases 2, 3, 4, 5, 6 and 7 read the layout, the record, the config keys or the needs-you item |
| **Total** | **59/100** | **Level 3** |

---

## 10. RISK MATRIX
<!-- FILL: List each risk with impact, likelihood and one mitigation. GOOD: R1: a missing `--keep` value deletes every archive. Impact H, likelihood L. Mitigation: a test pins exit 2 before any delete. WEAK: Some risks exist. -->

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Two remote-less repositories share one state folder | H | L | No declared identity means a refusal, never a path (REQ-005) |
| R-002 | A test writes into the real checkout's gitignored `.state`, which `git status` cannot see | M | M | Tests pass a temp Skilled tree, and T013 checks the real folder is absent before and after (REQ-004) |
| R-003 | A vendored tree in a consumer repository is not gitignored, so run files show in its git status | M | M | Refuse with `run-folder-not-ignored` (REQ-014). T023 checks the doctor install flow |
| R-004 | A re-pin or reinstall loses run folders | M | L | The record and index are user-level. T018 records the re-pin effect (REQ-017) |
| R-005 | `awaiting-decision` grows into a sixth vocabulary | M | L | One value, mapped to `blockedStop`, pinned by a test, and the item state is derived, not stored (ADR-010) |
| R-006 | The run root is resolved from the run's worktree, so worktree cleanup deletes the evidence | H | L | The resolver takes the registered checkout's Skilled tree only (REQ-014) |

---

## 11. USER STORIES
<!-- FILL: Write one story per user. Name the actor, the want and the benefit. GOOD: As a backup host, I want `--keep 3` to leave 3 archives, so that `logs/archive` stays under its quota. WEAK: Users want the feature. -->

### US-001: Author a bot in one file (Priority: P0)

**As a** bot author, **I want** a `BOT.md` template and a parser that names each defect, **so that** a typo or a missing field is caught before anything runs.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Keep run evidence out of git (Priority: P0)

**As a** repository owner, **I want** run folders to live in the Skilled tree's gitignored `.state` and the rest of the bot state outside the checkout, **so that** no number of runs changes my git status.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Never mix up two repositories (Priority: P0)

**As an** operator with a repository that has no remote, **I want** the hub to refuse until I declare an `identity` in `bots/config.json`, **so that** two such repositories never share labels, queues or state.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-004: Answer a parked run later (Priority: P1)

**As an** operator, **I want** a run that needs my decision to end as `awaiting-decision` with one needs-you item I can read, **so that** no process waits for me and I can answer when I am back.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-005: Build later phases on fixed contracts (Priority: P1)

**As the** author of a later phase, **I want** one module per contract with tested paths, keys and fields, **so that** I import them and never restate a rule or join a path by hand.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## Decisions This Phase Must Settle

Each is written in `decision-record.md`. ADR-001, ADR-002 and ADR-011 are Accepted by the operator. The rest are Proposed.
- **§16 Q3, operator-decided (D2):** run folders live in the resolved Skilled tree under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/<run id>/`, gitignored, and nothing is committed. The record and everything a run must not write stay user-level. This overrides research.md §11's inference for run folders. Parent ADR-002. Local copy: ADR-001, Accepted.
- **§16 Q5, operator-decided (D3):** an explicit `identity` field in `bots/config.json`, and install and enqueue refuse while identity is unknown. Parent ADR-003. Local copy: ADR-002, Accepted.
- Where the code lives before the hub exists: `.skilled/skills/system-skilled-bots/runtime/` plus a thin CLI in `.skilled/bin/`, modeled on `compiled-route.cjs` (research.md §8). ADR-003.
- Language and build: how the hub imports the TypeScript libraries and `.cjs` scripts it reuses (research.md §15 recommendation 6). ADR-004.
- Reuse the five existing status vocabularies and add no sixth (research.md §10). ADR-005, with the one exception ADR-010 names.
- Two clones of one repository share one identity. Not covered by the research. ADR-006.
- A bot with no `isolation` value and no repository default is refused. Inferred from research.md §5. ADR-007.
- The state-root folder name and the closed list of subfolders across both roots. ADR-008.
- The git-hook opt-in key in `bots/config.json`. Not named by the research. ADR-009.
- **§16 Q2, operator-decided (D1):** a decision queue. The exit value `awaiting-decision` and the needs-you item schema. The operator chose the queue; the design is Proposed. ADR-010.
- **§16 Q8, operator-decided (D5):** the three retention keys and their defaults. ADR-011, Accepted.
- **Needs-you expiry and history, operator-decided (D10):** `needsYou.expiryDays` (default 7) and a fourth retention key `retention.closedNeedsYouPerIdentity` (default 200). ADR-011, Accepted, and ADR-010's expiry rule.
- §16 Q10 is settled: the names are `system-skilled-bots` and `bots/` (parent ADR-007).

---

## Contracts Handed to Later Phases

Later phases take these from this spec. A change to any row reopens this phase. Rows tied to ADR-001, ADR-002 and ADR-011 are Accepted. Every other row is Proposed until this phase closes.

| Contract | Value | Read by |
|----------|-------|---------|
| State root (user-level) | `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots/`, or the `stateRoot` override in `bots/config.json`. Holds everything a run must not be able to write | All |
| Per-repository folder | `<state root>/<identity key>/`, where the key is a one-to-one, filesystem-safe encoding of the identity | 003, 005, 006, 007 |
| Run root (in the Skilled tree) | `<Skilled tree>/.skilled/skills/.state/system-skilled-bots/`, gitignored. The Skilled tree is the `.skilled` the registered checkout resolves at run time: the checkout itself here, the vendored or symlinked `.skilled` in a consumer. Never the run's worktree. `stateRoot` does not move it | 003, 004, 007 |
| Run folders | `<run root>/<identity key>/runs/<run id>/`. Evidence files only: ledger, receipts, logs and transcripts. Best-effort: a re-pin, reinstall or symlink retarget may lose or hide them. The resolver refuses with `run-folder-not-ignored` when git does not ignore the path | 003, 004, 007 |
| Install records | `<state root>/<identity key>/installs/<bot-id>.json`, user-level. Phase 6 writes one per bot at install, with the resolved runner path and the `.skilled` kind | 006, 007 |
| Run record and request join | `<state root>/<identity key>/records/<run id>.json`, user-level. Never inside the run folder, so losing a run folder never loses the record. It holds the absolute run folder path, and a read reports a vanished folder as missing | 003, 005, 007 |
| Leases and switches | `<state root>/<identity key>/leases/` and `<state root>/<identity key>/switches/` | 003, 006 |
| Request queue | `<state root>/<identity key>/requests/` with the siblings `inbox/`, `tmp/`, `claimed/`, `done/`, `quarantine/` and `seen/`. Only `inbox/` is watched (phase 5 ADR-003) | 005, 006 |
| Needs-you items | `<state root>/<identity key>/needs-you/<item id>.json`, user-level, so a run cannot forge or clear one. Fields: `id` (the parked run's id, one item per run), `runId`, `botId`, `identity`, `question`, `options` (list or `null`), `createdAt`, `expiresAt`, `evidence` (list of paths), `answer` (`null` or `{text, answeredAt}`) and `resumeRequestId` (`null` until answered). State is derived: answered when `answer` is set, expired when unanswered past `expiresAt`, else open | 003, 005, 007, 008 |
| Exit value for a parked run | `exit.reason` is `awaiting-decision`, `exit.class` is `operator`, `exit.needsYouItemId` names the item. Terminal. A resume is a new request of kind `resume`, never a state change. Maps to `blockedStop` for readers of the stop-reason vocabulary (ADR-010) | 003, 005, 007 |
| Shared entries | `<state root>/index/` and `<state root>/registered-roots`, beside the identity folders | 007 |
| Config keys | `allowedExecutorKinds`, `stateRoot`, `defaultIsolation`, `identity` (`owner/name`, also for a repository with no remote), `gitHookTrigger` (boolean, default `false`), `needsYou` with `expiryDays` (default 7) and `retention` with `indexRowsPerIdentity` (default 1000), `runFoldersPerBot` (default 200), `skippedSlotsPerSummary` (default 100) and `closedNeedsYouPerIdentity` (default 200). An unknown key is rejected by name | 003, 004, 005, 007 |
| Identity guard | One exported guard that returns the identity or the refusal `identity-unknown`. Install and enqueue call it and refuse on the refusal | 005, 006 |
| Missing isolation | Definition field, then `defaultIsolation`, else the refusal `isolation-undeclared` | 002, 003, 004 |
| Two clones | Share one identity folder. Each checkout path is listed in `registered-roots` | 006, 007 |
| Code layout | TypeScript libraries in `.skilled/skills/system-skilled-bots/runtime/lib/`, tests named `*.vitest.ts` in `runtime/tests/` run by vitest through `npm test`, and a thin CLI in `.skilled/bin/` from phase 3 (ADR-003, ADR-004) | 002 to 007 |

A file a later phase adds under either root, such as phase 3's index stamp, is added to this list through this spec.

## Standing Rules

The scheduling invariant, the seven first-build invariants and the routing-claims rule bind this phase as written in parent spec §6. REQ-004 and REQ-009 are this phase's checks for them.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Do the existing skill and advisor checks accept a skill folder that has runtime code and no registered modes? UNKNOWN until setup task T003 runs them.
- Which five files define the existing status vocabularies? research.md §10 names them by kind and cites `verify-iteration.cjs`. Setup task T004 lists each by path.
- Does a re-pin keep gitignored files under `.skilled/skills/.state/`? Inferred yes from a code read of the overlay engine's `touchedPaths`. T018 confirms it with a staged re-pin.
- Does the doctor install flow add `.skilled/skills/.state/` to a consumer's `.gitignore`? UNKNOWN. A doctor test fixture writes that line (`overlay-engine-strict-writes.test.cjs:94`), which suggests it is expected. T023 checks it.
- Answered by the operator (D10): the needs-you expiry is the config key `needsYou.expiryDays`, default 7.
- Answered by the operator (D10): phase 7's bound on closed needs-you items is the fourth retention key `retention.closedNeedsYouPerIdentity`, default 200.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
<!-- FILL: Leave the three links in place. Add `decision-record.md` when the packet has one. GOOD: Plan: See `plan.md`. WEAK: See the other docs. -->

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Record**: See `decision-record.md`
- **Closure gate**: See `acceptance-criteria.md`

---
