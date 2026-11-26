---
title: "Design: Activity and actor data model"
description: "Where every activity row comes from, how a run row lands in one of the seven groups, the order and text forms of the activity and inbox reads, the refresh-on-read steps, the next-fire computation, the actor and full-access sources and every record delta this phase writes."
trigger_phrases:
  - "activity row sources"
  - "activity group mapping"
  - "refresh on read steps"
  - "actor resolution order"
  - "full access install flag"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Activity and actor data model

This file fixes every choice the producer of `bots activity`, `bots inbox --json`, the `status` additions and the actor field would otherwise make while building. The payload shapes themselves are not here. They live in the screen contract, `003-terminal-screen/002-architecture-and-contracts/design/contracts.md`, sections 4 to 6 and section 10, and this file cites them by section and copies no field table. The shared record shapes live in `contracts/records.md` and the refusals in `contracts/refusals.md` section 3.1. Paths below are relative to the repository root unless they start with `contracts/` or a phase folder, which are relative to `specs/system-skilled-bots/003-openbot-parity-build/`.

The diagrams for everything below are in [state-machines.md](state-machines.md). The refusal rows are in [refusals.md](refusals.md). The literal inputs and outputs are in [fixtures/](fixtures/README.md).

---

## 1. MODULE BOUNDARY

`contracts/runtime-architecture.md` section 1.2 lets `activity.ts` import `status-index` and nothing else from `lib/`. So the work splits in two.

| Module | Owns | Reads files |
|--------|------|-------------|
| `activity.ts` | The seven ids and titles, their order, the run-row mapping in section 3, the sort in section 5, the empty-group filter and the text lines in section 7 | No. It takes an `ActivitySources` value and returns the payload object, so it is pure and a test feeds it rows directly |
| `status.ts` | The refresh in section 6, opening the index, and gathering the three live sources in section 4 into `ActivitySources` | Yes |
| `actor.ts` | The name pattern, the trim, the precedence in section 8 | Only `node:os` for the OS user |

`ActivitySources` is the input type `activity.ts` exports: the index snapshot, the list of live runs, the list of queued requests, the list of installed schedule fires, the clock and an optional `describe` function that turns a cron expression into a summary phrase. It imports `IndexSnapshot` and `RunSummary` from `status-index.ts` as types.

Gathering the schedule fires makes `status.ts` import `translateCron` from `cron-translator.ts` and `listSlots` from `slot-lister.ts`, reading the queued requests makes it import `validateRequest` from `request-record.ts` and reading a lease makes it import `processAlive` from the deep-loop loop lock [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:623]. None of the four closes a cycle, because none of those modules imports `status.ts`. `contracts/runtime-architecture.md` section 1.3 lists no new edge for `status.ts`, so this is reported as an amendment to that table in section 12 below rather than written into it.

---

## 2. THE SEVEN GROUPS AND THEIR SOURCES

The ids and titles are OpenBot's, in OpenBot's order [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/context/openbot-activity-groups.ts:15-40]. The row keys and their types are the screen contract's section 5 field table. This table says only where each row comes from.

| Group | Source | One row per | `at` | `actor` | `runId` | `schedule` |
|-------|--------|-------------|------|---------|---------|------------|
| `needs_you` | Index item rows that are open: `answeredAt` is null and the clock is before `expiresAt` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:303-316] | open item | the item's `createdAt` | the `actor` in the summary of the index run row whose `runId` equals the item's `runId`, null when that row is absent | the item's `runId` | null |
| `working` | Lease side files, section 4.1 | live run | the seed's `dispatchedAt` | the seed's `actor`, null when the side file has none | the seed's `runId` | null |
| `scheduled` | Queued requests in `requests/inbox/`, section 4.2, and the next fire of each installed schedule, section 4.3 | queued request or installed schedule | the request's `enqueuedAt`, or the next fire | null on a request, the install record's `operator` on a schedule | null | null on a request, `describe(expression)` on a schedule |
| `done` | Index run rows, section 3 | run | the summary's `dispatchedAt` | the summary's `actor` | the summary's `runId` | null |
| `stopped` | Index run rows, section 3 | run | as `done` | as `done` | as `done` | null |
| `failed` | Index run rows, section 3 | run | as `done` | as `done` | as `done` | null |
| `recurring` | Installed schedules, section 4.3 | installed schedule | the next fire | the install record's `operator` | null | `describe(expression)` |

The summary keeps no end instant, so a past run row reports when it was dispatched [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:266-292]. That is also what the sample shows: nightly-report's failed row is four minutes old at the fixed clock, and its run was dispatched at `21:10:04` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/activity.json:95].

Rows of every identity the index holds are listed, in the same identity set `bots status` shows, so a retired identity is left out [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:389-402]. `bots activity` takes no `--all`.

---

## 3. A RUN ROW'S GROUP

Each index run row is placed by its summary's `exitReason`, `exitClass` and `refusalCause`, read in this order. The first rule that matches wins.

| # | Summary | Group | Why |
|---|---------|-------|-----|
| 1 | `exitReason` is `awaiting-decision` | no row | The parked run is drawn as its open item while the item is open. Once the item is answered the resumed run is its own row, and an expired item draws nothing. That is what the sample shows: hello's and digest's parked runs appear only as their items, and archive's expired item appears nowhere [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/activity.json:4-28] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:34] |
| 2 | `refusalCause` is not null and `exitClass` is null | `stopped` | A refusal with no class is a stop switch, a held lease, a needs-you hold or a precheck that found nothing to do, never a fault [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:122-149]. archive's `disabled` run is the sample's `stopped` row [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/status.json:35] |
| 3 | `refusalCause` is not null | `failed` | A refusal with a class is a fault someone has to fix |
| 4 | `exitClass` is null | `done` | A clean run records the reason `converged` with a null class [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1130-1132] |
| 5 | anything else | `failed` | A dispatched run with a class failed, a killed run closes as `unknown` with class `environment` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:464-470] |

The rule reads the class and not the reason text, so `contracts/fixtures/run-record.additions.json`, whose exit reason is `completed` with a null class, also lands in `done`.

---

## 4. THE THREE LIVE SOURCES

### 4.1 A run in flight

The index holds terminal records only, because the runner writes a record at its terminal write and nowhere else [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:409-412]. A run in flight is visible through its lease: the runner keeps `<lease>.run.json` beside the lease file while the lease is held, holding the owner pid, the nonce and the record seed [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:220-225] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:916-925].

For each identity, `status.ts` lists `leases/*.lock.run.json` under the identity's state folder [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:125]. A side file gives a `working` row when all four hold:

1. It parses as JSON with a whole-number `ownerPid` and a `seed` holding string `identity`, `botId`, `runId` and `dispatchedAt`.
2. The lease file it sits beside exists.
3. `processAlive(ownerPid)` is true.
4. No run record exists yet for `seed.runId`.

A side file that fails any check is skipped with no message, the same way the reclaimer treats a side file that does not read [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:444-453]. A leases folder that cannot be listed gives no rows.

This phase adds `actor` to the record seed, so the side file carries it and the record built from the seed carries it too. A side file written before this phase has no `seed.actor` and its row reads `actor: null`. `LeaseSideFile` is exported from `runner.ts` as a type and imported by `status.ts` as a type only, so no runtime edge to the runner is added.

### 4.2 A queued request

`status.ts` lists `requests/inbox/*.json` for each identity [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:51] and keeps each file that passes `validateRequest` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:188]. A claimed request is not listed: its run holds the lease, so it is already a `working` row. A file that does not validate is skipped, because the drain quarantines it rather than running it [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:200-205].

The row's `identity` is the request's `target.identity`, its `botId` is the request's `workflowId` and its `at` is `enqueuedAt`, which is in the past. The request record's key list is closed and holds no actor [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:80-94], so the row's `actor` is null. The screen contract's section 5 describes a future `at` and a null actor for a different reason, so both are reported as amendments in section 12.

### 4.3 An installed schedule and its next fire

For each identity folder, `status.ts` reads every install record through `readInstallRecord` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:641-651] and keeps one when all three hold:

1. `agent` is `bot`, so the drain job is left out.
2. `schedule` is not null, so its `expression` is the cron the job was installed from [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:1027].
3. `hold` is null. A held job does not fire: install holds it until `bots enable` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:137] and `bots disable` sets the hold `operator` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:1148].

A needs-you hold or an awaiting-resume hold does not drop the rows. The job still fires, and the runner records the held slot. That is why digest, which the sample's status payload shows `held`, still has its `scheduled` and `recurring` rows [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/activity.json:43-57].

The next fire uses the hub's one cron reader, never a second parser [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:7-10]:

1. `translateCron(expression)`. A refusal gives no row for that schedule.
2. For a `calendar` translation, `listSlots(translation, now, end)` with `end` tried at `now` plus 1 day, then 32 days, then 366 days, then 1,462 days, stopping at the first window that returns a slot. The first slot is the next fire. Calendar keys are read as local wall-clock values, so the fire is computed in the machine's local time and written as an ISO 8601 UTC instant [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-lister.ts:11-14]. The last window covers a February 29 schedule.
3. For an `interval` translation, the only one the translator makes is every minute [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:277-280], and launchd counts it from the job's load, not from a calendar. The next fire is the newest `dispatchedAt` among the bot's index run rows whose `source` is `schedule`, plus the interval, stepped forward by whole intervals until it is after `now`. With no such row it is `now` plus the interval.
4. No slot in any window gives no row for that schedule, and nothing is printed.

A schedule row's `identity` is the identity of the folder its install record was read from, and its `botId` is the record's `botId`. One installed schedule gives two rows with the same `at`: one in `scheduled` and one in `recurring`. That is the sample's digest [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/activity.json:43-57] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/activity.json:103-117].

`schedule` on both rows is `describe(expression)`. 002-routine-layer owns the phrase through `describeStart` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:862]. This phase lands first, so `status.ts` passes no `describe` and every live `schedule` is null until 002 wires `describeStart` into `activityReport`. A test passes a stub `describe` to prove the field is filled, which is how AC-013 is met in this phase.

---

## 5. ORDER

Groups follow section 2's order and a group with no rows is left out. Inside a group:

| Group | Order |
|-------|-------|
| `needs_you`, `working`, `done`, `stopped`, `failed` | newest `at` first |
| `scheduled`, `recurring` | soonest `at` first, so a queued request, whose `at` is past, comes before every future fire |

Ties break by `identity`, then `botId`, then `runId` with null last, each compared as plain strings. The order never depends on the order files were listed.

`bots inbox --json` prints open items newest `createdAt` first, then expired items newest first, then, under `--all` only, answered items newest first. `listNeedsYouItems` sorts oldest first [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:239], so the verb re-sorts. Ties break by `id`.

---

## 6. REFRESH ON READ

The rule is the screen contract's section 10, steps 1 to 5 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:711-715]. Three points it leaves to this phase are fixed here.

**One transaction holds steps 2 to 4.** Indexing, the item rows, the generation and `updatedAt` commit together, as section 10 step 4 says. The REQ-011 row the contract wrote says "the last three", which this phase reads as steps 2 to 4 to agree with section 10.

**Every listed record goes through `indexRunRecord`, not only new ones.** The contract asked whether a record is rewritten under the same id after its terminal write [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:719]. It is, twice. Delivery rewrites the record with each entry's outcome and advances the stamp [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:296-300] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:364], and this phase's answer stamps `answeredBy` on the parked run's record. Neither changes a summary field: the summary carries no delivery state and this phase keeps `answeredBy` out of it [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:266-292]. `indexRunRecord` already keeps an existing run row and replaces its delivery rows [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:304-317], so calling it on every record of a stale identity indexes the new ones and refreshes the delivery of the old ones, with no insert-or-replace. A record that does not validate is skipped and named nowhere on this path.

**`updatedAt` lives in the `meta` table.** A build writes `updatedAt` equal to `builtAt`. A refresh that ran step 2 for at least one identity writes `updatedAt` as the clock it read at. `readIndex` returns it beside `builtAt`, null when the row is absent, which is the case for an index built before this phase until its first refresh [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:365-367]. The DDL does not change, because `meta` is already a key and value table.

**A missing index is built once, as `bots status` builds it today.** `statusReport` builds the index when none exists and that build applies retention [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:370-376]. `activityReport` shares the same open path, so the first read of either verb on a fresh state root builds it. The refresh rule governs an index that exists.

**A refresh that cannot complete.** When the transaction throws, for example on a busy index past the five-second timeout [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:53], or `refreshItemRows` cannot list the item folder, that identity stays in `staleIdentities` and `stale` is true. The read still answers from the rows it has, writes nothing to stderr and exits 0. A failure to open or read the index at all is the existing exit 1 with the rebuild hint [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:339-353] [SOURCE: .skilled/bin/bots.cjs:364-367].

Both forms of both verbs refresh: `bots status`, `bots status --json`, `bots activity` and `bots activity --json`. The refresh is one function in `status.ts` that `statusReport` and `activityReport` call, so the two verbs cannot drift.

---

## 7. TEXT AND JSON FORMS

The JSON forms are the screen contract's sections 4 to 6, printed with `JSON.stringify(value, null, 2)` as `status --json` prints today [SOURCE: .skilled/bin/bots.cjs:386-388], one document on stdout and nothing else.

**`bots activity`**, one heading line per group, then one line per row. Fields are tab-separated. A null `actor` or `runId` prints `-`, and the `schedule` field is printed only when it is not null.

```text
needs_you	Needs you
	hello	skilled-scratch/hello	2026-11-25T21:12:04.000Z	actor ada	run 20261125T211204Z-7c1e9a40
recurring	Recurring
	digest	skilled-scratch/hello	2026-11-26T00:15:00.000Z	actor ada	run -	schedule every 6h
```

A heading line starts with the group id, so `bots activity | cut -f1 | grep -v '^$'` prints the ids in order. With no rows at all the verb prints `bots: no activity` and exits 0, and `bots activity --json` prints `{"version": 1, "groups": []}`.

**`bots inbox`** keeps today's text lines for open and expired items [SOURCE: .skilled/bin/bots.cjs:466-471]. `--all` adds each answered item as the same two lines with the state `answered`, then one line `\tanswered <answeredAt> by <by or -> scope <scope>`. The answer text is not printed in the text form. With `--all` and no item at all the line is `bots: no needs-you items`.

**`bots inbox --json [--all]`** prints the ten keys of the screen contract's section 6 per item, in the order section 5 above gives. `kind` prints the stored value, and an absent key prints `null` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:62]. `answer` prints the normalized four-key object of section 9.2.

---

## 8. THE ACTOR

`actor.ts` exports `resolveActor` and `ACTOR_PATTERN`, the pattern `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$`. A name is trimmed of surrounding whitespace, then tested against the pattern, then stored as the trimmed string. Two names compare by exact match after the trim, so `Ada` and `ada` are two actors.

`resolveActor({ as, env })` takes the first source that gives a name:

1. `as`, the trimmed `--as` value or the actor a library caller such as a channel passes. A value that fails the pattern is a refusal, never a fallback.
2. `env.SKILLED_BOTS_OPERATOR`, the operator pinned into a job's environment at install. A value that fails the pattern is ignored.
3. `os.userInfo().username`. A lookup that throws or a name that fails the pattern gives `null`.

It reads `env`, the environment the run executes under, and never `resolveEnv`. `bots.cjs` resolves identity and the state root under the job's environment for every verb [SOURCE: .skilled/bin/bots.cjs:429-432], and that environment carries the pinned operator after this phase, so reading it would name the installing operator on an answer typed at a terminal. A launchd fire runs with the job file's environment as its own, so a scheduled run and a drained run find the pinned operator in `env` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:349-355].

| Caller | `as` | `env` holds an operator | Actor |
|--------|------|-------------------------|-------|
| `bots answer` or `bots run` at a terminal | `--as` or absent | no | `--as`, else the OS user |
| A launchd fire of a bot's job | absent | yes, the bot's installer | the pinned operator |
| A drain job's run of a queued request or a resume | absent | yes, the drain's installer | the pinned operator |
| A channel transport or a test calling `answerItem` | the actor it holds | any | that actor |

A resumed run's record also carries `answeredBy`, copied from the answered item's `answer.by` when the runner loads the item to resume [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:648-656]. That satisfies `contracts/records.md` section 4, whose null rule for `answeredBy` is "every run no answer continued".

---

## 9. RECORD DELTAS THIS PHASE WRITES

### 9.1 Needs-you item

`kind` joins `ITEM_KEYS` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51-65] and the validator accepts `kind` absent, `null` or any non-empty string. 005-memory adds the value rule. **No writer in this phase writes `kind`**: the gate leaves the key out. `contracts/versioning.md` section 2, row 001, leaves open whether 001 writes `kind: null` or omits it. Omitting it means every item this phase writes still reads on a runtime from before this phase, so reverting this phase strips nothing.

### 9.2 Answer object

The shape is `contracts/records.md` section 2. The validator checks `by` as absent, `null` or a string matching `ACTOR_PATTERN`, and `scope` as absent or one of `once` and `deny` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:116-121]. `readNeedsYouItem` returns every answer normalized to four keys: an absent `by` reads `null` and an absent `scope` reads `once`. The file on disk is not rewritten by a read.

`answerItem` writes all four keys. With no scope passed it writes `once`. The derivation of `deny` from a NO text is 006's, per `contracts/answer-seam.md` step 8, so in this phase `bots answer x no` records `once`. The answer's identity is its text and its scope from this phase on: the same text with the same scope is the duplicate path, and the same text with another scope is refused `item-answered-differently` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:82-86]. An answer stored before this phase reads `scope: "once"`, so re-sending its text with no `--scope` is still a duplicate.

### 9.3 Run record

`actor` and `answeredBy` are top-level, nullable and absent-reads-null, as `contracts/records.md` section 4 and its decision row fix them. `schemaVersion` stays `1`.

`answerItem` stamps `answeredBy` on the record its item's `runId` names, after the answer write and before the resume is built (`contracts/answer-seam.md` step 12). It reads the record first. A record that does not exist yet, because the answer landed between the item write and the parked run's terminal write [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1116-1120], is skipped with no refusal, and the item's `answer.by` and the resumed run's own `answeredBy` still name the approver. A record whose `answeredBy` already equals the actor is not rewritten. A stamp that loses a race with a delivery rewrite is lost the same way, with the same two copies left.

### 9.4 Status index

`RunSummary` gains `actor: string | null`, filled by `summarizeRecord` from the record's `actor`. `SCHEMA_VERSION` stays `'2'` and the DDL does not move. A summary JSON written before this phase has no `actor` and `activity.ts` reads it as null. `meta` gains the `updatedAt` row of section 6.

### 9.5 Status report

`StatusReport` gains `version: 1` and `updatedAt`. The screen contract's section 4 is the field table.

### 9.6 Job environment and install record

| Where | Key | Value | Absent reads as |
|-------|-----|-------|-----------------|
| A bot's and the drain's job environment | `SKILLED_BOTS_OPERATOR` | the installing operator, resolved by `resolveActor` with no `as` | no pinned operator |
| A bot's job environment | `SKILLED_BOTS_FULL_ACCESS` | `1`, written only when `bots schedule install <id> --full-access` ran | not granted |
| The install record | `operator` | string or null, as above | null |
| The install record | `fullAccess` | boolean | `false` |

`PinnedJobValues` gains `operator` and `fullAccess` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts:41-45], `environmentValue` renders them [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts:177-187], `pinnedFromPlist` reads them back [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts:287-293], and `jobFileEnv` and `pinsOf` carry them into a resolved job environment [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:723-740].

The install record keeps the two values as well, because the drain runs a queued or resumed run under the drain's environment, not the bot's [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:183] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:222]. A cap read from that environment would cap a full-access bot's resume, which the runner then refuses `resume-posture-changed`. The runner cannot import the installer, because the installer imports the drain, which imports the runner. So the runner reads the install record file directly through `installFile` from `state-root.ts` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:212-213] and passes `fullAccess` to `validatePosture`. The install record reader keeps any key it does not check [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:641-651], so neither key moves its `schemaVersion`.

### 9.7 The sandbox cap

`validatePosture` gains a third argument, `{ fullAccess: boolean }`. A declared `danger-full-access` with `fullAccess` false is honored as `workspace-write`, and the record's `posture.sandbox` names `workspace-write`. With `fullAccess` true it is honored as declared. `read-only` and `workspace-write` pass unchanged. A bot with no install record has `fullAccess` false. The cap is not a refusal: the run dispatches at the capped value.

---

## 10. WHAT EACH CHANGE COSTS ON REVERT

| Change | An older runtime does | Manual step |
|--------|-----------------------|-------------|
| `kind` in `ITEM_KEYS` | Nothing, because no item this phase writes carries `kind` | None |
| Answer `by` and `scope` | Reads the item, because its validator checks only `text` and `answeredAt` | None |
| Run record `actor` and `answeredBy` | Keeps and ignores them [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:237-245] | None |
| Summary `actor`, meta `updatedAt` | Ignores both, the DDL and `SCHEMA_VERSION` are unchanged | None |
| Job environment keys | Ignores them | None |
| Install record `operator` and `fullAccess` | Keeps and ignores them | A full-access bot runs capped again only under this phase. An older runtime honors its declared sandbox with no cap, so revert only after `bots disable` on every bot whose definition declares `danger-full-access` |

---

## 11. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| `activity.ts` is pure and `status.ts` gathers the sources | `contracts/runtime-architecture.md` section 1.2 gives `activity.ts` the one import `status-index` |
| An `awaiting-decision` record gives no row | The sample draws a parked run only as its open item and draws the expired item's run nowhere |
| A refusal with a null class is `stopped`, with a class `failed` | The registry's null-class causes are every stop switch and hold. OpenBot keeps "stopped by you" apart from "failed" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/context/openbot-activity-groups.ts:79-84] |
| A past row's `at` is `dispatchedAt` | The summary holds no end instant, and the sample's ages match `dispatchedAt` |
| `working` comes from a live lease side file with no record | The side file is the one place a run in flight writes its run id before its terminal write |
| A queued request row has `at` `enqueuedAt` and a null actor | A request has no future instant and no actor key, and the request key list is closed |
| A held install record gives no `scheduled` or `recurring` row, a needs-you hold does | A held job never fires. A needs-you hold still lets the job fire and records the held slot |
| The schedule's actor is the install record's `operator` | Reading it back from the job file through `jobEnv` would need the checkout per identity and a plist read per bot, and the install record already holds every other install fact |
| `describe` is an argument and null until 002 | 002 owns the phrase, 001 lands first, and an injected stub lets this phase prove the field |
| Every listed record of a stale identity goes through `indexRunRecord` | Delivery and the `answeredBy` stamp rewrite a record after its terminal write. Neither touches the summary, and the call already refreshes delivery rows |
| A refresh that fails leaves the identity stale and prints nothing | Section 10 of the screen contract wants no stderr on success, and `stale` already says the rows are old |
| `kind` is accepted and never written in this phase | It keeps every item this phase writes readable by an older runtime |
| Scope joins the answer's identity now | The answer carries a scope from this phase on, and a second answer with another scope must not pass as a duplicate |
| `fullAccess` and `operator` are also kept in the install record | The drain runs queued and resumed runs under its own environment, and the runner cannot import the installer |
| `--full-access` needs a tty | A bot that can run `bots schedule install` from a script would otherwise grant itself full access |
| The verbatim REQ-003 and REQ-011 rows lose their serial commas | The packet's style rule forbids a serial comma. Every token is kept |

---

## 12. AMENDMENTS THIS PHASE NEEDS FROM FROZEN FILES

These files are outside this phase's folder and frozen. Each row is the fix, for the owner to apply. Until it is applied this file wins for this phase's build, and the contract wins everywhere else. The contract reconciliation pass of 2026-11-26 applied every row below, so the frozen files now agree with this file. The refusal rows landed as R6, R7 and R8 of `refusals.md` in this folder.

| File and section | What it says | The one-line fix |
|------------------|--------------|------------------|
| `contracts/runtime-architecture.md` section 1.3 | No row for `status.ts` | Add `status.ts`, new imports `cron-translator`, `slot-lister`, `request-record` and the deep-loop `processAlive`, phase 001, "the live activity sources and the next fire" |
| `contracts/records.md` section 4, Install record addition | One row, 009's `skillDigests` | Add `operator` (string, null when unresolved, owner 001, absent reads null) and `fullAccess` (boolean, owner 001, absent reads `false`) |
| `contracts/versioning.md` section 2, row 001 | Whether 001 writes `kind: null` is inferred | Replace with "001 accepts `kind` and writes none, so no item 001 writes is refused and the revert step is none" |
| `contracts/refusals.md` section 3.1 | No row for `--full-access` or `--all` | Add `bots: --full-access needs a tty` and `bots: <verb> takes no --<option>` for `activity`, both verb refusals with exit 2 |
| Screen contract section 5, the `at` and `actor` rows | `at` is future on every `scheduled` row, `actor` is null only for a run recorded before 001 | `at` is `enqueuedAt` on a `scheduled` row from a queued request, and `actor` is also null on that row |
| Screen contract section 10 step 2, and section 13.1 item 3 | "Index each record not yet in the index with `indexRunRecord`", and REQ-011's "the last three in one transaction" | Step 2 becomes "Pass every listed record of the identity through `indexRunRecord`, which inserts a new run row and replaces an indexed run's delivery rows". The gap paragraph after step 5 is closed by section 6 of this file, and item 3's REQ-011 text says every step after the stamp read is one transaction |
| Screen contract section 13.1 item 9, AC-013 | "a non-null `schedule`" | Met in 001 with a stub `describe`, and live from 002 on |
