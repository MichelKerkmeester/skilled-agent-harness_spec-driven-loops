---
title: "Feature Specification: Phase 1: activity-and-actor"
description: "Adds a bots activity read grouped by OpenBot's seven activity ids with a source for every group, a JSON form of the needs-you inbox, a status index that is current on every read, a by: actor on needs-you answers and run records and a --scope once|deny on an answer, so a shared identity no longer erases who answered and the terminal screen reads payloads that match its contract."
trigger_phrases:
  - "activity and actor"
  - "phase 1 activity and actor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: activity-and-actor

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 10 |
| **Predecessor** | None |
| **Successor** | 002-routine-layer |
| **Handoff Criteria** | `bots activity`, `bots activity --json`, `bots inbox --json`, the refresh on read, the `by:` actor and `bots answer --scope once\|deny` pass every acceptance criterion, and `bots status` still reads an index built before this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification.

**Scope Boundary**: The activity read and the sources of its seven groups, the JSON form of the inbox, the refresh that keeps the status index current on read, the `version` and `updatedAt` keys on `bots status --json`, the actor field on needs-you answers and run records, the `--scope once|deny` flag on `bots answer` with the answer's `scope` field and the install-time full-access flag the sandbox cap reads. The approval `grants` object, the precedence ladder, per-action policy inside the executor, the two-role `operators.json` roster and the shared-host mode are other phases: 006 extends this phase's answer scope with `grants` and the ladder, 011 lands the roster its channel approver check needs, and no phase builds the shared-host mode.

**Design**: `design/` holds what a builder needs and the requirements below point at it. [data-model.md](design/data-model.md) fixes every row source, the group mapping, the order, the text forms, the refresh, the next fire, the actor and every record delta. [state-machines.md](design/state-machines.md) draws them. [refusals.md](design/refusals.md) holds each refusal's exact line and exit. [fixtures/](design/fixtures/README.md) holds the inputs that reproduce the screen's sample payloads. Payload shapes are the screen contract's, `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` sections 4 to 6 and 10, and shared record shapes are `../contracts/records.md`. Neither is copied here.

**Dependencies**:
- The status index's run, delivery and item rows, which the activity read groups [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:165]
- The lease side file, which names a run in flight before its record exists [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:220-225]
- The install record and the hub's one cron reader, which give an installed schedule and its next fire [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:182-216] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:7-10]
- The needs-you item file and `bots answer`, which the actor field extends [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29]
- The installer's job environment, which carries the operator a scheduled run records [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts:177]

**Deliverables**:
- `bots activity` and `bots activity --json`, grouped under OpenBot's seven ids, each group with a named source
- `bots inbox --json` and `--all`
- A status index brought up to date on every `status` and `activity` read, with no retention. `version` and `updatedAt` on `bots status --json`
- `by:` on a needs-you answer and `actor` on a run record, from the OS user or `--as`, and the installing operator for a scheduled run
- `--scope once|deny` on `bots answer`, recorded on the answer as `scope` and defaulting to `once`
- `bots schedule install <id> --full-access`, the only way a definition's `danger-full-access` is honored
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The status index already holds a row for every run, delivery and needs-you item, but nothing shows them as a timeline: `bots status` prints one line per bot and one line per open item, so a reader cannot tell what is waiting, what is running and what ended without reading three surfaces [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:470]. Three of the seven groups a timeline needs have no source in the index at all, because the runner writes a record only at its terminal write and the installer never computes a next fire [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:409-412] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:93-94]. An existing index is never rebuilt by a read, so a run that ends while the screen is open would never appear [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:363-366]. The inbox has no machine-readable form, so a terminal client or a script must parse tab-separated prose [SOURCE: .skilled/bin/bots.cjs:458]. And state is keyed by repository identity `owner/name` with no sign-in, so when two people share a checkout the answer on a needs-you item names nobody [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:102].

### Purpose
Give the operator one grouped read of what the bots are doing that is current when it is read, a JSON inbox and a name on every answer and run, so a shared identity stops erasing who did what.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ node .skilled/bin/bots.cjs activity
bots: unknown verb: activity
exit=2
$ node .skilled/bin/bots.cjs inbox --json
bots: inbox takes no --json
exit=2
$ node .skilled/bin/bots.cjs answer item-1 yes --as michel
bots: unknown option: --as
exit=2
$ node .skilled/bin/bots.cjs answer item-1 yes --scope once
bots: unknown option: --scope
exit=2
$ XDG_STATE_HOME=<scratch> node .skilled/bin/bots.cjs status --json | grep -c '"actor"'
0
```

Each block is the first stderr line and the exit status, read on 2026-11-26 at commit `79519553b62`. The four refusals are the measured behavior the Problem Statement rests on: the CLI has no `activity` verb, `inbox` accepts no `--json` and no verb accepts `--as` or `--scope` [SOURCE: .skilled/bin/bots.cjs:64-76]. The `0` is the fifth: no row `bots status --json` prints carries an actor, so the index has nowhere to put one [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:68-86]. It ran against an empty scratch state home, because a first `status` read builds the index and a build applies retention [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:16-20].
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `bots activity` and `bots activity --json`, which print rows under OpenBot's seven ids in OpenBot's order, leaving out a group with nothing in it, with each group's source fixed in `design/data-model.md` sections 2 to 4
- Bring the status index up to date on every `bots status` and `bots activity` read, incrementally and with no retention, and add `version` and `updatedAt` to `bots status --json`
- Add `bots inbox --json`, which prints the open and expired needs-you items as JSON, and `--all`, which adds the answered ones so a reader sees the answer an item carries [SOURCE: .skilled/bin/bots.cjs:465]
- Add `by:` to a needs-you answer and `actor` to a run record, filled from the OS user or `--as <name>`
- Add `--scope once|deny` to `bots answer`, recorded on the answer as `scope` and defaulting to `once`, so a caller records a denial without the grants phase
- Refuse `bots answer --as` and `bots run --as` outside a tty unless the name matches the OS user, in the CLI alone so a channel or a test passes the actor to `answerItem` with no tty, and cap a definition's declared sandbox at `workspace-write` unless the operator installed the bot with `--full-access`, so neither an actor nor a posture is self-declared
- Pin the installing operator into a job's environment and its install record, so a scheduled run records that operator rather than the launchd user
- Carry the actor inside the status index's run summary JSON, so the activity read needs no second pass over run records and the DDL does not move

### Out of Scope
- The `grants` object on a needs-you item and the approval precedence ladder - phase 006-approval-grants owns both and extends this phase's answer `scope` with them, and the research ranks them item 5 [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:145]
- Deriving the scope `deny` from a NO answer text - `contracts/answer-seam.md` step 8 gives that derivation to 006, so in this phase an answer with no `--scope` records `once` whatever its text
- Per-action policy inside the executor (send, delete, pay) - the research defers it to a later packet with OpenGhost's rules engine as the liftable layer [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:93]
- The two-role `operators.json` roster and the shared-host 0770 mode - 011 lands the roster its channel approver check needs, and no phase builds the shared-host mode. Neither is needed to record an actor [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:103-104]
- A `by:` on secret records - the vault is phase 008, and no secret record exists yet [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:147]
- The terminal screen's activity pane - phase 003-terminal-screen draws it over this verb, and the research moves that screen up to follow items 1 and 2 [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:155]
- The routine layer's `recurring` rows - phase 002-routine-layer supplies the start summary their `schedule` carries. This phase builds the rows from the installed schedules, as REQ-012 says, and an empty `recurring` group is left out
- Writing a `kind` value on any item - 005-memory owns the values and the absent-means-`decision` default. This phase accepts the key and writes none, as `design/data-model.md` section 9.1 says

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/activity.ts` | Create | The seven group ids and titles, their order, the run-row mapping, the sort, the empty-group filter and the text lines, as a pure function over `ActivitySources` that imports `status-index` types only |
| `.skilled/skills/system-skilled-bots/runtime/lib/actor.ts` | Create | `ACTOR_PATTERN`, the trim and `resolveActor` over `--as`, the pinned operator in `env` and the OS user |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Modify | Refresh a stale identity's run and item rows on read with no retention, shared by `status` and `activity`, and add `version` and `updatedAt` to the report. Also gather the live leases, queued requests and installed schedules with their next fire into `ActivitySources`, and export `activityReport` |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Modify | Add `by` and `scope` to `NeedsYouAnswer` and validate both, normalize an older answer on read and land `kind` in the item's key list as a key only. The item and answer key sets are `../contracts/records.md` sections 1 and 2 |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modify | Accept an actor and a scope, write them as the answer's `by` and `scope`, judge a duplicate by text and scope and stamp `answeredBy` on the parked run's record |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modify | Add `actor` and `answeredBy` to the record, validate both and read a record written before them as `null` |
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Modify | Add `actor` to the run summary JSON, keep `SCHEMA_VERSION` at `'2'` and the DDL unchanged, write and read the `updatedAt` meta row |
| `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts` | Modify | Take the install's `fullAccess` and cap a declared `danger-full-access` at `workspace-write` without it |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Carry the resolved actor on the record seed and the record, copy `answer.by` into a resumed run's `answeredBy`, read `fullAccess` from the install record for `validatePosture` and export the `LeaseSideFile` type |
| `.skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts` | Modify | Render and read back `SKILLED_BOTS_OPERATOR` and `SKILLED_BOTS_FULL_ACCESS` in a job's environment |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Modify | Pass the installing operator and the full-access flag into the pinned job values and the install record, and carry both through `jobFileEnv` and `pinsOf` |
| `.skilled/bin/bots.cjs` | Modify | Add the `activity` verb, `--json` and `--all` on `inbox`, `--as` and `--scope` on `answer`, `--as` on `run`, `--full-access` on `schedule install` and the tty refusals, which live here alone |
| `.skilled/skills/system-skilled-bots/runtime/tests/activity.vitest.ts` | Create | Group order, empty-group omission, the seven row keys, the row sources, the refresh on read and the one data set against the screen's sample |
| `.skilled/skills/system-skilled-bots/runtime/tests/actor.vitest.ts` | Create | `--as` precedence, OS-user fallback, the pinned operator and the trim-then-exact-match comparison |
| `.skilled/skills/system-skilled-bots/runtime/tests/needs-you.vitest.ts` | Modify | The answer's `by` and `scope` fields and their validation, the old-answer read and the item's `kind` key accepted with no value rule |
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Modify | The actor and the scope written by `bots answer`, the scope in the duplicate check, the `answeredBy` stamp and an `answerItem` call with an explicit actor and no tty |
| `.skilled/skills/system-skilled-bots/runtime/tests/run-record.vitest.ts` | Modify | The record's `actor` and `answeredBy`, and the pre-phase record that reads as `null` |
| `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts` | Modify | The `actor` summary field, the `updatedAt` meta row and a write into an index built by the old DDL |
| `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts` | Modify | `version` and `updatedAt` on the report, and `stale` only after a refresh that could not complete |
| `.skilled/skills/system-skilled-bots/runtime/tests/posture.vitest.ts` | Modify | The sandbox cap and the install-time full-access flag |
| `.skilled/skills/system-skilled-bots/runtime/tests/resume.vitest.ts` | Modify | A full-access bot whose parked run the drain resumes keeps `danger-full-access` |
| `.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts` | Modify | The operator and full-access values in the rendered job, the install record and `jobEnv` |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-run.vitest.ts` | Modify | The `activity` verb, `inbox --json` and `--all` over an open and an answered item, `--as` and `--scope` parsing, the tty refusals and the payload type check |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | Add the two new modules to the module table |
| `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` | Modify | Name `bots activity` and `bots inbox --json` in the verb table |
| `.skilled/skills/system-skilled-bots/bots-status/SKILL.md` | Modify | Add the activity verb to the mode's allowed Bash |
| `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` | Modify | Document `--as` and `--scope` on `bots answer` and `--full-access` on `bots schedule install` |
| `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` | Create | The MIT notice for the two lifted OpenBot files, one entry per file with its source path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `bots activity` reads the status index and the live sources REQ-012 names and prints its rows under the seven ids `needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed` and `recurring`, in that order, leaving out a group with no rows. The text form is `design/data-model.md` section 7 |
| REQ-002 | `bots activity --json` prints one object `{"version": 1, "groups": [...]}`, each group carrying its `id`, its `title` and its `rows`, and each row carrying `botId`, `identity`, `state`, `at`, `actor`, `runId` and `schedule`. `state` is one of the seven group ids. `at` is an ISO 8601 UTC instant: the event time on a past row, the next fire on a `scheduled` or `recurring` row. `actor` is null for a run recorded before this phase. `runId` is null on a `scheduled` or `recurring` row. `schedule` is the start's `summary` from 002 on a row that comes from an installed schedule, and null otherwise. Rows run newest first, and soonest first in `scheduled` and `recurring`. The field table is `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 5 |
| REQ-003 | `bots inbox --json` prints one object `{"version": 1, "items": [...]}` holding the open and expired needs-you items, open first and each part newest first, and `bots inbox --json --all` adds the answered ones, so a reader sees the answer an item carries. Each item carries `id`, `botId`, `kind`, `question`, `state`, `at`, `options`, `createdAt`, `expiresAt` and `answer`, where `state` is `open`, `answered` or `expired`, `at` is the item's `createdAt`, `kind` is `null` until 005-memory writes a value, `options` is null or a list of strings, `answer` is null until answered and every instant is ISO 8601 UTC. An unreadable item is left out and named on stderr as `bots: item <id> did not read`, with exit 0. The field table is `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 6 |
| REQ-004 | `bots answer <item-id> <text>` records the actor on the item's answer under the JSON key `by`, filled from `--as <name>` when given and from the OS user otherwise. Two actor names compare by exact match after trimming surrounding whitespace, so `Ada` and `ada` are different actors. An answer stored before this phase reads `by: null` and `scope: "once"`, and its file is not rewritten by the read |
| REQ-005 | Every run record carries `actor`: the OS user for an interactive run, and the operator pinned into the job's environment at install for a scheduled or drained run. A run requested by one person and answered by another carries both names, `actor` for the requester and `answeredBy` for the approver, stamped on the parked run's record by the answer and on the resumed run's record by the runner, and `bots activity` prints `actor` |
| REQ-010 | `bots answer <item-id> <text> --scope once\|deny` records the scope on the item's answer under the JSON key `scope`, an answer with no `--scope` records `once`, `--scope always` and `--scope conversation` are refused `bots: grant-scope-unsupported` and any other value `bots: --scope takes once or deny`, both exiting 2, and the scope is written before the resume request is built, so a caller records a denial without the grants phase. An answer's identity is its text and its scope: the same text with the same scope is a duplicate, the same text with another scope is refused `item-answered-differently`, and an answer stored before this phase reads `scope: "once"` |
| REQ-011 | `bots status --json` and `bots activity --json` bring the status index up to date before they answer. For each identity whose generation stamp is ahead of the one the index consumed, the read reads the stamp, then passes every run record of the identity through `indexRunRecord`, which inserts the ones not yet in the index and refreshes the delivery rows of the rest, replaces the identity's item rows through `refreshItemRows`, records the stamp it read and writes `updatedAt`, every step after the stamp read in one transaction. The read never applies retention, never rebuilds the whole index and writes nothing to stderr when it succeeds. `bots status --json` also carries `version` and `updatedAt`. The rule is `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 10, and the points it leaves open are `design/data-model.md` section 6 |
| REQ-012 | `bots activity` names the source of each group's rows. `needs_you`, `done`, `stopped` and `failed` come from the status index. `working` comes from a run in flight, read from the bot's held lease side file, never from the index, which holds terminal records only. `scheduled` comes from a queued run request not yet claimed, and from an installed cron schedule's next fire. `recurring` comes from each installed cron schedule. A next fire is computed from the cron expression in the machine's local time and written as an ISO 8601 UTC instant, because no launchd surface reports one. The checks per source and the mapping of a run row to its group are `design/data-model.md` sections 3 and 4 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The lifted grouping and row rules carry an MIT notice in `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md`, one entry per lifted file naming its source path, `app/src/lib/bot-lifecycle/activity-groups.ts` and `shared/activity-rows.ts`, with OpenBot's copyright line `Copyright (c) 2026 CopilotKit` [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1-3] |
| REQ-007 | The status index carries the actor inside each run row's `summary` JSON, so `bots activity` reads it without opening a run record and neither the DDL nor `SCHEMA_VERSION` moves |
| REQ-008 | The tty refusal lives in `bots.cjs` alone: `bots answer --as <name>` and `bots run --as <name>` are refused `bots: --as needs a tty` outside a tty unless the name matches the OS user, and `bots schedule install <id> --full-access` is refused `bots: --full-access needs a tty` outside a tty, so a script cannot claim another person's name or grant full access, while `answerItem` takes the actor as an argument so a channel daemon or a test passes it with no tty |
| REQ-009 | A definition's declared sandbox is capped at `workspace-write`: `danger-full-access` is honored only when the operator installed the bot with `--full-access`, recorded as `fullAccess` in the install record and as `SKILLED_BOTS_FULL_ACCESS` beside the pinned operator in the job's environment, and read from the install record for every run kind, so a definition cannot grant itself full access and a resumed run keeps the posture its parked run had |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a state root holding one open item, one running run and one completed run, `bots activity` prints exactly three groups in the order `needs_you`, `working`, `done`
- **SC-002**: `bots answer <item-id> yes --as ada` from a tty, or `answerItem` called with `ada` and no tty, writes `"by": "ada"` on the item's answer, and `bots inbox --json --all` prints that `by` on the item's row
- **SC-003**: A scheduled run's record names the operator pinned at install, not the launchd user, and `bots activity --json` prints that name on the run's row
- **SC-004**: `bots answer item-1 yes --as ada` from a script exits 2 with `bots: --as needs a tty`, and a definition declaring `danger-full-access` on a bot installed without `--full-access` dispatches at `workspace-write`
- **SC-005**: `bots answer <item-id> yes --scope deny` writes `"scope": "deny"` on the item's answer, the same answer with no `--scope` writes `"scope": "once"` and `--scope always` exits 2 with `bots: grant-scope-unsupported`
- **SC-006**: The one data set in `design/fixtures/one-data-set.json`, read at its clock with a stub `describe`, gives exactly the screen's `payloads/activity.json`, and its items give exactly `payloads/inbox.json`
- **SC-007**: A run that completes after the index was built is listed by the next `bots activity --json` with no `--rebuild`, and `bots status --json` then prints `"stale": false`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The status index's SQLite schema | The activity read has no rows to group | The read opens the index through `openIndex`, which refuses a different schema version by name, and builds it once when it is missing, as `bots status` does |
| Dependency | The installer's job environment | A scheduled run records no operator | Pin the operator beside the state root and identity the job already carries, and read it back in `pinnedFromPlist` |
| Dependency | 002-routine-layer's `describeStart` | Every live `schedule` is null | `activityReport` takes `describe` as an argument, a test passes a stub and 002 wires `describeStart` in |
| Risk | The `actor` field changes the index row | An index built before this phase cannot be read | Keep `SCHEMA_VERSION` at `'2'` and the DDL unchanged, and add `actor` as a nullable field inside the `summary` JSON, so an index built before this phase still opens. Prove it with a test that writes into an index built by the old DDL |
| Risk | A record written before this phase has no `actor` or `answeredBy` | `bots status --rebuild` refuses every old record | Read a missing `actor` or `answeredBy` as `null` rather than rejecting the record, and test one |
| Risk | The refresh deletes files from a read verb | A poll every 5 seconds applies retention | The refresh never calls `rebuildIndex` and never plans retention, and a test asserts no run folder is removed |
| Risk | A record is rewritten after its terminal write | The index keeps stale delivery rows | Every record of a stale identity goes through `indexRunRecord`, which replaces delivery rows and keeps the summary |
| Risk | `--as` reaches a path or a shell | A crafted name writes outside the state root | Validate the name against a fixed pattern and use it only as a stored string |
| Risk | The answer's `scope` and 006's `grants.scope` disagree | A denial reads back as an allow | 006 fills `grants.scope` from the answer's `scope` at answer time, so one write sets both and no item is rewritten twice |
| Risk | A definition declares `danger-full-access` and answers its own item | A bot approves its own delete as `owner` | Cap the declared sandbox at `workspace-write` unless the operator installed the bot with `--full-access` from a tty, and refuse `bots answer --as` outside a tty unless it matches the OS user, in the CLI alone |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `bots activity` over 1,000 run rows prints in under 500 ms on the reference machine, measured with `time`
- **NFR-P02**: The activity read opens the index once and runs one query per table, so the row count does not multiply the queries
- **NFR-P03**: An identity whose generation stamp did not move costs one stamp read on a refresh, and a stale identity costs one parse per run record it holds

### Security
- **NFR-S01**: `--as` is validated against `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$` and is stored as a string only. It never becomes a path segment or a shell word. Two names compare by exact match after trimming surrounding whitespace, so `Ada` and `ada` are different actors
- **NFR-S02**: The actor is a name, never a credential. No secret is read to fill it, and no secret value reaches a record
- **NFR-S03**: `bots answer --as`, `bots run --as` and `bots schedule install --full-access` are refused outside a tty, the first two unless the name matches the OS user, in `bots.cjs` alone, and a definition's declared sandbox is capped at `workspace-write` unless the install record says `fullAccess: true`

### Reliability
- **NFR-R01**: An index written before this phase still opens and still accepts a write, because `SCHEMA_VERSION` does not move, the DDL does not change and `actor` is a nullable field inside the `summary` JSON, so no rebuild is needed and no row is misread
- **NFR-R02**: A run record written before this phase reads with `actor: null` and `answeredBy: null` and still validates, so `bots status --rebuild` over existing state succeeds
- **NFR-R03**: An answer written with no `--scope` records `once`, so a reader never has to treat a missing scope as an allow
- **NFR-R04**: The refresh never applies retention, so `bots status` and `bots activity` on an existing index delete no file
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a state root with no runs, no items, no live lease, no queued request and no installed schedule prints `bots: no activity` and exits 0, and `bots activity --json` prints `{"version":1,"groups":[]}`
- Maximum input: 1,000 run rows group in one pass. A group holding more rows than the terminal shows is printed in full, because the verb pages nothing
- Failure path: an index that cannot be opened prints `bots: <reason>` and exits 1, the same code `bots status` uses for an index failure
- Failure path: a refresh that cannot complete leaves that identity in `staleIdentities` with `"stale": true`, prints nothing on stderr and exits 0
- Failure path: `bots answer <item-id> yes --as ''` exits 2 with `bots: option --as needs a value`, and `--as 'a/b'` exits 2 with `bots: --as takes a name`
- Failure path: `bots answer <item-id> yes --as ada` with stdin not a tty and `ada` not the OS user exits 2 with `bots: --as needs a tty`
- Failure path: `bots answer <item-id> yes --scope always` exits 2 with `bots: grant-scope-unsupported`, and `--scope sometimes` exits 2 with `bots: --scope takes once or deny`
- Failure path: a definition declaring `danger-full-access` on a bot installed without `--full-access` dispatches at `workspace-write`, and the run record's `posture.sandbox` names the capped value
- Race: an answer that lands before the parked run's terminal record exists skips the `answeredBy` stamp and still succeeds, and the resumed run's record carries `answeredBy`
- Stale side file: a lease side file whose owner pid is gone, or whose run already has a record, gives no `working` row
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 28 files, about 950 lines, one CLI, one index summary field and meta row, one answer field, two record fields, two job environment keys and three live sources |
| Risk | 11/25 | An index row field, two record fields and a refresh on a read path. No auth, no network, no migration of stored files |
| Research | 4/20 | The 002 packet and the screen contract name the lift, the seven ids, the sources and the actor. No new investigation |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a run record's actor belong on `identity` or in its own field group? Decision: its own top-level `actor` field, because `identity` names the repository and the actor names a person.
- Should `bots activity` show a run whose bot was unregistered? Decision: no, it reads the same identities `bots status` reads, so `bots status --all` stays the one way to see a hidden identity.
- Is the OS user the right actor for a queued run a git hook started? Decision: the drain job runs it, so the record names the operator pinned in the drain job, and a drain run by hand names the OS user.
- Does a run record carry one actor or two? Decision: two, `actor` for the requester and `answeredBy` for the approver, because a run requested by one person and approved by another cannot otherwise answer who approved it. `bots activity` prints `actor`.
- Is a definition's declared sandbox trusted? Decision: no. It is capped at `workspace-write`, and `danger-full-access` needs the operator's install-time flag, because a bot that can grant itself full access can answer its own item.
- Does the answer's scope live on the answer or on the item? Decision: on the answer as `scope`, because 006 owns the item's `grants` object and fills `grants.scope` from the answer's scope, so one write sets both and no item is rewritten twice.
- Does the tty rule belong in `answerItem` or in the CLI? Decision: in `bots.cjs` alone, because a channel daemon and a test call `answerItem` with an actor they already hold, and a tty check there would refuse every check run without a terminal.
- Does `bots inbox --json` filter out the answered items the text form leaves out? Decision: yes by default, and `--all` adds them. The default form answers what needs me, the same question the text form answers, and `--all` is the readback that shows the answer an item carries.
- Where does each activity group come from, and when is a design choice not settled by the screen contract? Decision: `design/data-model.md` fixes every source and choice, and section 12 there lists the amendments the frozen contracts need.
<!-- /ANCHOR:questions -->

---
