---
title: "Feature Specification: Phase 3: manual-runner"
description: "No command runs a BOT.md definition today. This phase builds `bots run <id>` for the manual trigger in a shared checkout, with the run and invocation stop layers, posture validation, secret refusals, one complete run record and a needs-you decision queue."
trigger_phrases:
  - "manual runner"
  - "phase 3 manual runner"
  - "bots run"
  - "bot runner kill switches"
  - "bots inbox"
  - "needs-you hold"
  - "needs-you decision queue"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 3: manual-runner

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

A bot is a `BOT.md` file, and nothing can run one today: `.skilled/bin/bots.cjs` does not exist. This phase builds `bots run <id>` for the manual trigger in a shared checkout, with the stop layers, posture checks and secret refusals a later scheduler depends on. A run that needs a person parks as `awaiting-decision` with one needs-you item. While that item is open, the bot's other runs are held. Phase 5's `bots answer` turns the answer into a `resume` request, and this runner starts the resumed run. A fixture bot proves each path with one terminal record.

**Key Decisions**: a decision queue for human-decision stops (ADR-001, Accepted by the operator), the posture matrix from `executor-config.ts` (ADR-002), the run marker `SKILLED_BOT_RUN_ID` through one allowlist entry (ADR-005, Accepted by the operator), run folders in the Skilled tree's gitignored `.state` (operator decision D2).

**Critical Dependencies**: phase 1's record schema and state-root layout. Nothing from phase 5: phase 5 owns `bots answer` and calls into this runner (operator decision D12).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-11-22 |
| **Branch** | `scaffold/003-manual-runner` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 8 |
| **Predecessor** | 002-schedule-predicates-and-checker |
| **Successor** | 004-worktree-isolation-and-delivery |
| **Handoff Criteria** | `bots run <id>` runs a manual bot end to end and leaves one terminal run record. Phases 4 and 5 may start once every row in `acceptance-criteria.md` is `Met` or `Superseded`, which also closes this phase. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Build system-skilled-bots: file-defined headless agent bots run on a schedule or event specification.

**Scope Boundary**: The manual trigger in a shared checkout, plus the needs-you items a run opens, the hold an open item puts on its bot and the verb that lists items. No queue claim, no scheduler, no worktree and no external delivery channel. The Predecessor row is folder order. Build dependencies are: phase 1 alone. Phase 2 runs in parallel with this one. `bots answer` belongs to phase 5 (operator decision D12), so this phase waits on no later phase.

**Dependencies**:
- `001-contracts-and-state-root`: the run record schema, the `BOT.md` field set, `bots/config.json`, repository identity, the state-root layout, the `awaiting-decision` exit value and the needs-you item schema. This phase writes records and items in that schema and reads definitions in that format.
- `005-request-pipeline` is not a dependency. It owns `bots answer` and the `resume` request kind, and its drain hands a `resume` request to this runner. This phase tests the resumed run with a direct runner call (operator decision D12).
- Phase 2 is not a dependency. The runner needs the record and the definition, not the cron translator (phase advice §4 item 6).

**Deliverables**:
- A `bots` CLI with the verbs `run`, `disable`, `enable`, `pause`, `resume` and `inbox`. Phase 5 adds `answer`.
- A runner that follows the research.md §8 order from the disable switch to the lease release.
- Posture validation, the environment allowlist and the three secret refusals.
- The run and invocation stop layers, with switches under the state root.
- A run record with the failure class and the audit evidence pointers filled.
- The needs-you item a parked run writes, the hold an open item puts on its bot, and the resumed run built from a `resume` request.

**Handoffs this phase owns**:
- For phase 5: a refusal outcome that tells disabled, paused, failing precheck and malformed definition apart from a run failure, returned by the CLI exit code and by the runner function (REQ-013).
- For phase 5: the run marker `SKILLED_BOT_RUN_ID` the runner exports to its child (REQ-014, ADR-005).
- For phase 5: a runner entry that takes a `resume` request and builds the resumed prompt (REQ-020), the refusal cause `awaiting-decision-hold` (REQ-022), and the body-secret predicate and generation stamp writer that phase 5's `bots answer` calls.
- For phases 5, 6 and 7: the CLI entry path, `.skilled/bin/bots.cjs`. In this packet `bots` means that entry.
- For phase 7: a generation stamp file written under `<state root>/<repository identity>/` after each terminal record and each needs-you item (REQ-015). Phase 5's `bots answer` calls the same writer after each recorded answer.
- For phase 7: needs-you items in `<state root>/<repository identity>/needs-you/`, which status shows as their own rows, and the hold, which status shows on the bot's row (operator decision D9).
- For phase 2: the body-secret literal detector, exported as one predicate the checker imports (REQ-005, ADR-003).

**Standing rules**: the scheduling invariant and the seven first-build invariants in parent spec §6 bind this phase. They are not repeated here.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A bot is a `BOT.md` file, but nothing can run one. The deep-loop runtime has a lease, an executor audit and an append gateway, and no entry point ties them into one run of one definition (research.md §8). Until a runner exists with its stop layers, no scheduler may be installed, because nothing would stop an unattended fire (research.md §15).

### Purpose
`bots run <id>` runs a manual bot end to end in a shared checkout, refuses what it cannot honor and leaves one terminal run record that says what ran, how it was confined and where its evidence lives. A run that needs a person waits as a needs-you item, not as a live process.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/bin/bots.cjs; echo "exit=$?"
ls: .skilled/bin/bots.cjs: No such file or directory
exit=1
$ find .skilled/skills/system-skilled-bots -type f | wc -l
       0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `bots run <id>` in the research.md §8 order: disable switch, lease, pause file, precheck, posture validation, dispatch snapshot, headless dispatch, budget, one result event, lease release on every exit path. Request claim, step 1 of that order, belongs to phase 5.
- Take the lease on `loop-lock`, keyed by workflow, repository and spec target, never by a worktree path (research.md §8).
- Dispatch headless through the `cli-external-orchestration` packets with `AI_SESSION_CHILD=1` in the environment and the exemption plus the bound spec folder in the prompt (research.md §8).
- Pass the child an allowlisted environment and enforce the three secret refusals (research.md §13).
- Add the run and invocation stop layers. `bots disable`, `bots enable`, `bots pause` and `bots resume` write switches under the state root (research.md §13).
- Write the failure class beside the raw reason and fill the audit evidence pointers now (research.md §10, §12).
- Write run folders under the resolved Skilled tree at `.skilled/skills/.state/system-skilled-bots/<identity key>/runs/<run id>/`. The repository `.gitignore` already ignores `.skilled/skills/.state/*/*`. Everything else stays under the user-level state root (operator decision D2).
- Park a run that needs a decision as `awaiting-decision`, write one needs-you item, release the lease and exit. Add `bots inbox` (operator decision D1, ADR-001). `bots answer` is phase 5's (operator decision D12).
- Hold a bot while it has an open needs-you item. The runner refuses the bot's other runs before dispatch with the cause `awaiting-decision-hold` until the item is answered or expires (operator decision D9).
- Build the resumed prompt when the runner gets a `resume` request: the original prompt plus the question and the answer, bound to the same spec folder.
- Add `SKILLED_BOT_RUN_ID` to `EXECUTOR_COMMON_ENV_ALLOWLIST` in `executor-audit.ts` (operator decision D7, ADR-005).
- Accept `isolation: shared` only. Refuse a definition that declares `worktree` as a posture the runner cannot honor yet.
- Limit the delivery record to `not-attempted` and the local-only value.

### Out of Scope
- Queue claims, `bots enqueue`, `bots drain` and `bots answer` - phase 5 owns the request pipeline (research.md §9) and the answer verb (operator decision D12). This phase adds no queue code.
- Any scheduler, plist or `launchctl` call - phase 6 owns them, and the scheduling invariant forbids them before the runner exists.
- Worktree isolation - phase 4 owns it, with its link and removal hazards (research.md §13).
- External delivery channels and the one notification when an item opens - phase 4 owns them (research.md §10).
- `bots status`, its needs-you rows, the SQLite index and item retention - phase 7 owns them (research.md §12).
- Multi-question dialogs and answering from a phone or a chat channel - not in the first build (D1).
- Routing the four modes - phase 8 owns it. No mode is reported as routed here.

The verb `bots resume <id>` lifts a pause. The request kind `resume` restarts a parked run after an answer. They share a word and nothing else.

### Files to Change

New paths sit under the skill layout that phase 1 fixes. The skill folder `.skilled/skills/system-skilled-bots/` holds no files today (see Measured Behavior). Module names and the `.ts` extension match what phases 4 and 6 expect, and stay provisional until phase 1 fixes the layout and language. The CLI entry follows `.skilled/bin/`, where every entry is a `.cjs` file.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/bots.cjs` | Create | Thin CLI over one resolver, modeled on `.skilled/bin/compiled-route.cjs`. Exits loudly on a misspelled option. Phases 5, 6 and 7 add verbs to it |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Create | The §8 run order, the lease release on every exit path, the refusal outcome, the hold check, the `awaiting-decision` exit and the generation stamp |
| `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts` | Create | The posture matrix and the refusal before dispatch |
| `.skilled/skills/system-skilled-bots/runtime/lib/switches.ts` | Create | Disable and pause files under the state root |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Create | Headless dispatch, environment allowlist, secret refusals, the run marker, budget and the decision-marker parser. Exports the body-secret predicate |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Create | Item write, read with expiry, the open-item check for the hold and the resumed prompt builder |
| `.skilled/skills/system-skilled-bots/runtime/tests/` | Create | Unit and integration tests with fixture bots |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | One entry, `SKILLED_BOT_RUN_ID`, in `EXECUTOR_COMMON_ENV_ALLOWLIST` (line 150). Owner and callers are named in ADR-005. Everything else is imported only |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts` | Import only | Lease acquire, refresh, release and `startHeartbeat` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Import only | Executor kinds, `sandboxMode` and `timeoutSeconds` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs` | Import only | The stop reasons `blockedStop` (line 48) and `userPaused` |
| `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts` | Import only | The append gateway that stores a re-sent event once |
| `.skilled/skills/system-deep-loop/runtime/scripts/loop-heartbeat.cjs` | Import only | One liveness row per phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `bots run <id>` on a manual fixture bot dispatches once, exits 0 and leaves one terminal run record at `<state root>/<identity key>/records/<run id>.json`, with the request join, honored posture and evidence locations filled. The evidence files sit in its run folder. |
| REQ-002 | A disabled bot, a paused bot and a precheck that exits non-zero or prints `[SILENT]` each end without dispatch and leave a record whose exit reason says which. |
| REQ-003 | A declared posture the chosen executor cannot honor, including `isolation: worktree`, is refused before dispatch with a record. A second concurrent run of the same bot is refused at the lease. |
| REQ-004 | A run killed mid-dispatch releases its lease or leaves it reclaimable by the owner pid, nonce and heartbeat rule. Its record ends as `unknown` only after the owner process is proved gone. |
| REQ-005 | The child receives only allowlisted environment keys. The runner refuses a definition body that holds a secret literal, through one exported predicate that phase 2's checker imports. The same predicate checks the question and the answer before a resumed run is dispatched. No command line or environment value appears in any log the runner writes. |
| REQ-006 | The disable and pause files and the needs-you items live under the user-level state root. A test proves a child with checkout write access cannot reach them through the checkout. |
| REQ-007 | No code path in this phase calls `launchctl bootstrap` or writes a plist. |
| REQ-013 | A refusal before dispatch returns an outcome apart from a run failure, through a distinct CLI exit code and the runner function's return value. Its cause names disabled, paused, failing precheck, `[SILENT]` precheck, malformed definition, refused posture, held lease or an open needs-you item (`awaiting-decision-hold`). Paused uses the existing `userPaused` stop reason. Phase 1's record schema fixes the field. |
| REQ-016 | A run whose child signals a decision ends with the terminal exit `awaiting-decision` and a CLI exit code apart from 0, the refusal code and the run-failure code. It writes exactly one needs-you item under `<state root>/<identity key>/needs-you/`, by temp file and rename, holding the run id, bot id, question text, options if any, `created_at`, the prompt the run was dispatched with and the evidence pointers. The lease is released and no process waits. |
| REQ-017 | The child signals a decision with a line that starts `[NEEDS-DECISION] ` followed by the question, and optional `[OPTION] ` lines after it, in its captured output. The first marker wins. A marker with an empty question ends the run as a run failure classed `author`, with no item. A run stopped by `timeoutSeconds` or the budget keeps that class even when a marker was printed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `timeoutSeconds` stops a stuck invocation, and reaching the budget is recorded as its own class apart from a timeout. |
| REQ-009 | Every terminal record carries a failure class (author, operator, environment or hub) beside the raw reason. Stop reasons come from `lifecycle-taxonomy.cjs` and none is added. The record exit value `awaiting-decision` is phase 1's, added by operator decision D1. |
| REQ-010 | A run that needs a human decision records stop reason `blockedStop`, failure class `operator` and exit `awaiting-decision` (ADR-001). |
| REQ-011 | Retry happens by ledger replay through the append gateway only, never by a second dispatch. |
| REQ-012 | Unknown cost is written as `null`, never zero, and delivery is `not-attempted` or the local-only value. |
| REQ-014 | The runner sets `SKILLED_BOT_RUN_ID` to the run id on its child, so phase 5's post-commit leg can skip a commit made inside a bot run. The key passes through one new entry in `EXECUTOR_COMMON_ENV_ALLOWLIST` (ADR-005). |
| REQ-015 | The runner writes a generation stamp file under `<state root>/<repository identity>/` by temp file and rename after each terminal record and after each needs-you item it writes, for phase 7's stale check. It exports the writer, so phase 5's `bots answer` rewrites the stamp after each recorded answer. |
| REQ-018 | `bots inbox` lists open and expired items for the repository. An item's `expiresAt` is its `createdAt` plus `needsYou.expiryDays` from `bots/config.json` (default 7, operator decision D10). An unanswered item past `expiresAt` reads and is reported as `expired`. The state is derived, so the item file is not rewritten. No item is ever answered automatically. |
| REQ-019 | Moved to phase 5 by operator decision D12. `bots answer` is 005 REQ-016. This phase keeps no answer code. |
| REQ-020 | When the runner gets a `resume` request, it starts a new run with a new run id, joined to its item. Its prompt is the item's prompt plus the question and the answer, and it binds the same spec folder. The body-secret predicate runs over the question and the answer before dispatch. A resumed run that asks again opens a new item. A test hands the runner a `resume` request directly, without phase 5's drain. |
| REQ-021 | Run folders resolve to `<skilled tree>/.skilled/skills/.state/system-skilled-bots/<identity key>/runs/<run id>/`, where the Skilled tree is the `.skilled` the runner resolves at run time. Tests point the root at a temp folder. `git check-ignore` reports every run folder path as ignored. |
| REQ-022 | While a bot has an open needs-you item, meaning unanswered and not past `expiresAt`, the runner refuses every other run of that bot before dispatch. The refusal cause is `awaiting-decision-hold` and the stop reason is the existing `blockedStop`, so no stop or status value is added. The record names the item id, and the run takes no lease. The `resume` request keyed by that item passes, because phase 5 records the answer before it enqueues. An answered or expired item holds nothing (operator decision D9). A hand-typed `bots run <id>` is held too, and its refusal points at `bots inbox` (operator decision D13). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bots run <fixture-id>` exits 0, `records/` under the identity folder holds exactly one new terminal record for that run, and the record points to its run folder.
- **SC-002**: Each refusal fixture (disabled, paused, failing precheck, `[SILENT]` precheck, unhonorable posture, concurrent run) ends with no dispatch receipt and one record naming the reason.
- **SC-003**: A search of every log the runner wrote for the fixture's prompt text and a planted environment value returns no match.
- **SC-004**: `rg -n 'launchctl|\.plist' .skilled/skills/system-skilled-bots/ .skilled/bin/bots.cjs` prints nothing.
- **SC-005**: A fixture child that prints `[NEEDS-DECISION]` leaves one open item in `bots inbox`, no held lease, and a record with exit `awaiting-decision`.
- **SC-006**: With one open item for a bot, a second run of that bot ends with the refusal cause `awaiting-decision-hold` and no dispatch receipt. Once the item is answered or expired, the same run dispatches.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 record schema, state-root layout, `awaiting-decision` and the item schema | High: the runner cannot write a record or an item without them | Start only after phase 1 closes. Record changes go back through phase 1's spec |
| Dependency | Phase 5's drain hands this runner a `resume` request after `bots answer` | Low: the resumed run is tested here with a direct runner call | Phase 5 owns `bots answer` and its end-to-end test (operator decision D12) |
| Dependency | `system-deep-loop` runtime libraries | High: lease, audit and gateway behavior come from them | Import, do not modify, except the one allowlist entry ADR-005 accepts. Owner and callers are named there |
| Risk | A run is called contained on a kind with no preventive sandbox | High | Posture is declared and validated. The record states the honored posture (research.md §13) |
| Risk | A child stops to ask and exits 0 | High | The decision marker and the exemption sit in the prompt as well as the environment. The marker wins over a clean exit (research.md §8) |
| Risk | The prompt is visible in the process table for five of nine kinds | Med | Body-secret refusal before dispatch, also over the question and answer. Logs never echo the command line (research.md §13) |
| Risk | A stuck invocation outlives the run budget | Med | `timeoutSeconds` bounds the invocation. Budget reach is its own class (research.md §8) |
| Risk | The run marker never reaches the child | High: a bot that commits re-enqueues itself | The allowlist entry passes the key. T025 shows it missing before the entry and present after |
| Risk | The child can write its own run folder, which now sits in the Skilled tree | Med | The run folder is evidence, not authority. The runner writes the record after the child exits, and the index row in phase 7 is the source of truth |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The runner's own work before dispatch (switch read, lease, posture check) adds under 2 seconds, excluding the precheck command.
- **NFR-P02**: N/A for throughput. One run handles one bot. Concurrency is refused at the lease.

### Security
- **NFR-S01**: The child environment holds only the allowlisted keys from `executor-audit.ts`. A new key needs an observed failure as evidence (research.md §13). `buildExecutorDispatchEnv` returns the full parent environment for the `native` kind (`executor-audit.ts:1146`), so the runner does not admit `native` (ADR-002).
- **NFR-S02**: Reports on keys name which keys are defined plus a fingerprint, never the value, as the env-secret guard does.
- **NFR-S03**: Needs-you items are created owner-only (`0700` folder), as phase 1 fixes for the state root.

### Reliability
- **NFR-R01**: The lease is released or reclaimable on every exit path, including a kill signal and `awaiting-decision`.
- **NFR-R02**: Terminal states never change after they are written (research.md §10). An item moves only from `open` to `answered` or `expired`.

---

## 8. EDGE CASES

- Empty input: `bots run` with no id exits 2 with usage. An unknown id exits non-zero and writes no record, because no definition digest exists to key it.
- Maximum input: an invocation that hits `timeoutSeconds` (at most 3,600 per `executor-config.ts`) is stopped and recorded as a timeout.
- Failure path: a dispatch refused by the recursion guard exits 3, so it never reads as a clean run, and the record names the refusal.
- Vanished run folder: a record pointer to a run folder that is gone is reported as missing, never a crash. A tree re-pin can remove `.state`.
- Held bot: a run of a bot with an open item is refused with `awaiting-decision-hold`. An item past `expiresAt` holds nothing, so an unanswered item cannot hold a bot past its expiry.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | One CLI with six verbs, five runtime modules and tests. Imports five deep-loop modules, edits one line in a sixth |
| Risk | 22/25 | Unattended-style dispatch, secrets in argv for five kinds, no preventive sandbox for six kinds, a shared allowlist edit |
| Research | 12/20 | The order and the stop layers are researched. The posture matrix, secret detection and the decision queue still need design |
| Multi-Agent | 4/15 | One workstream. Tests can run beside the modules |
| Coordination | 12/15 | Handoffs to phases 2, 4, 5 and 7, a dependency on phase 1 and a runner entry that phase 5's drain and answer verb rely on |
| **Total** | **70/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A child asks a question and exits 0, so the run reads as clean | H | M | The decision marker rule in the prompt. The marker wins over exit 0. T013 proves it |
| R-002 | A secret in a body, question or answer reaches argv | H | L | One body-secret predicate runs before every dispatch, resumed ones included. T009 and T029 |
| R-003 | A switch or item is forged or cleared from the checkout | H | L | Both live under the user-level state root. T020 proves a child cannot reach them |
| R-004 | The allowlist edit changes a deep-loop dispatch | M | L | One entry only. The deep-loop suite is compared before and after (T023) |
| R-005 | An answer is applied twice and starts two resumed runs | M | M | Phase 5 owns the guard: the item id is the idempotency key and a different second answer is refused (005 REQ-016) |
| R-006 | An open item sits unanswered forever | L | H | Expiry after 7 days by default, reported by `bots inbox` and later by status. Never auto-answered |
| R-007 | A re-pin of a vendored tree wipes run folders under `.state` | M | M | Run history in the tree is best-effort. Pointers to a missing folder are reported, never fatal. Phase 1 records what a re-pin does |
| R-008 | An open item holds a bot and its schedule stops doing work | M | M | The hold ends when the item is answered or expires. Status shows the bot as held (phase 7). T034 |

---

## 11. USER STORIES

### US-001: Run one bot by hand (Priority: P0)

**As an** operator, **I want** `bots run <id>` to run one bot once and stop safely on every failure, **so that** I can trust it before any scheduler fires it unattended.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Stop a bot without editing the checkout (Priority: P0)

**As an** operator, **I want** `bots disable` and `bots pause` to stop a bot through files the bot cannot touch, **so that** a misbehaving bot cannot switch its own stop back off.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Answer a parked run later (Priority: P1)

**As an** operator, **I want** a run that needs my call to park as a needs-you item I list with `bots inbox` and answer with phase 5's `bots answer`, **so that** the work resumes with my answer instead of starting over or guessing.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Which declared sandbox class can each of the nine executor kinds honor, and which kinds does the first build admit? See ADR-002.
- How does the body-secret refusal detect a literal? See ADR-003.
- Phase 1 lists the generation stamp file, the switch files, the needs-you folder and the item schema in its state-root layout. Until it does, their names here are provisional. The expiry key is `needsYou.expiryDays`, default 7 (operator decision D10).
- Does the hold also refuse a hand-typed `bots run <id>`? Answered: yes, with a pointer to `bots inbox` (operator decision D13, 2026-11-22).

Decided: the human-decision stop (operator decision D1, ADR-001), the run marker (D7, ADR-005), run-folder location (D2), the level (D8, raised to 3), the hold while an item is open (D9), the expiry key (D10) and the move of `bots answer` to phase 5 (D12).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Record**: See `decision-record.md`
- **Closure Gate**: See `acceptance-criteria.md`

---
