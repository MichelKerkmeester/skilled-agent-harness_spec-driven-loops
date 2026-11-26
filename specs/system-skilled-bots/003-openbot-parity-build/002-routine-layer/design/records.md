---
title: "Design: the records phase 2 owns"
description: "Every field of the routine state file, the run record's until object, the fatigue needs-you item and the routines payload row, with the mode, the write protocol, the absent and damaged read rules and the one contract line this phase asks to change."
trigger_phrases:
  - "routine state file schema"
  - "routine record fields"
  - "fatigue item keys"
  - "routines payload row"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The records phase 2 owns

Four records carry this phase's work: the routine state file, the run record's `until` object, the fatigue needs-you item and the `routines --json` row. This file fixes every field of each one, so a builder writes a shape rather than choosing one.

The packet-level contracts own the shapes more than one phase writes. This file cites them and copies nothing. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/README.md, section "The rule"]

| Record | Owner | Where its shape is fixed |
|--------|-------|--------------------------|
| Routine state file | 002 | `contracts/records.md` section 6, and section 1 below for the mode and the write protocol |
| Run record `until` object | 002 | Section 2 below, and `contracts/records.md` section 4 for the record it sits on |
| Fatigue needs-you item | 002 writes it, 001 owns the item | `contracts/records.md` section 1 for the key set, section 3 below for the values 002 fixes |
| `routines --json` row | 002 | `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 7 for the field table, section 4 below for the derivations |
| The authored `routine` block | 002 | Section 5 below |

---

## 1. THE ROUTINE STATE FILE

**Path.** `<stateRoot>/<identityKey>/routines/<botId>.json`. The folder is created by `ensureIdentityState` at 0700, the mode every identity folder gets. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:148-163]

**Mode.** 0600. `writeStateAtomic` writes through a temp file and a rename and sets no mode, so the file would carry the process umask inside its 0700 folder. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts:413-415] The writer therefore calls `chmodSync(file, 0o600)` after every successful write, not only the first, so a file an older runtime created is repaired on the next write. The mode is the one `contracts/records.md` section 6 requires and the one `spec.md` NFR-S02 states.

**Write protocol.** One `writeStateAtomic` call of the whole object, then the chmod. A reader never sees a half-written file, because the rename is atomic. A write that throws leaves the previous file in place.

**Read rules.** A missing file reads as every field `null` except `schemaVersion`, which reads as `1`. A file that does not parse, or that fails the field checks below, reads the same way and never as met. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:224] The reader reports the damage on stderr as `bots: routine state <botId> did not read` and keeps going, the way `bots inbox` reports an unreadable item. [SOURCE: .skilled/bin/bots.cjs:472]

### Fields

| Key | Type | Null | Absent reads as | Written by | Read by |
|-----|------|------|-----------------|------------|---------|
| `schemaVersion` | integer, exactly `1` | no | `1` | every write | the reader, which refuses any other value as damaged |
| `untilMetAt` | string, ISO 8601 UTC with a `Z` | yes, until `until_check` exits 0 | `null` | `recordUntilOutcome` after a completed run | `bots routines`, the `completed` switch reader |
| `fatiguedAt` | string, ISO 8601 UTC with a `Z` | yes, until the tenth consecutive failure | `null` | `evaluateFatigue` | the `disabled` check, which names `routine-fatigued` when this is set, and `bots routines` |
| `fatigueItemId` | string, the fatigue item's id | yes, as `fatiguedAt` | `null` | `evaluateFatigue` | `bots enable`, which answers that item |
| `enabledAt` | string, ISO 8601 UTC with a `Z` | yes, a bot never re-enabled | `null`, so every run counts | `bots enable` | `failureStreak`, which counts only runs dispatched later than this instant |

The five keys are the whole file. An unknown key is refused as damaged rather than ignored, because this file is written by one module and a stray key means a second writer exists.

**Sample.** The packet's golden is `contracts/fixtures/routine-state.json` and it is this literal. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/fixtures/routine-state.json:1]

```json
{
  "schemaVersion": 1,
  "untilMetAt": null,
  "fatiguedAt": null,
  "fatigueItemId": null,
  "enabledAt": "2026-11-25T09:00:00.000Z"
}
```

**schemaVersion rule.** Stays `1`. Adding a key is a change to this file and to `contracts/records.md` section 6 in the same change, and an older runtime reads the added key as its default. Removing, renaming or retyping a key bumps it, per `contracts/versioning.md` rule 2.

---

## 2. THE RUN RECORD'S `until` OBJECT

The run record gains one optional key, `until`. Its value is an object with exactly one key, `met`, a boolean. Nothing else goes in it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "4. RUN RECORD ADDITIONS"]

| Key | Type | Null | Absent reads as | Written when |
|-----|------|------|-----------------|--------------|
| `until` | object | yes | `null` | a run that completed and whose bot carries an `until_check` |
| `until.met` | boolean | no | not applicable, the parent is null | `true` when the check exited 0, `false` for any other outcome |

**When it is `null`.** Three cases: the bot carries no `routine` block, the bot carries a routine with no `until_check`, or the run did not complete. A refused run, a parked run and a failed run all leave it `null`, because the check runs only after a completed run.

**Why one key.** The outcome is a fact about one run. The durable record of the outcome is `untilMetAt` in the state file, and a second copy on the record would be a second truth. The record's key exists so a reader can tell what this run measured without opening the state file.

**Validation.** `validateRunRecord` accepts `until` as `null` or as an object whose only key is `met`, a boolean. Any other shape is refused `record-field-invalid` with detail `until`. The record's `schemaVersion` stays `1`, because an added key is not a version change.

---

## 3. THE FATIGUE NEEDS-YOU ITEM

The item is a needs-you item like any other, so its key set is `contracts/records.md` section 1 and this phase adds no key. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "1. NEEDS-YOU ITEM"] What this phase fixes is the value of each key it writes.

| Key | Value 002 writes | Why |
|-----|------------------|-----|
| `id` | the tenth failed run's id | An item's id must equal its `runId`, so one run writes at most one item and a repeated evaluation rewrites the same file. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:103] |
| `runId` | the tenth failed run's id | The same rule, from the other side |
| `botId` | the bot's own id | So `bots inbox` lists the item under that bot and `bots enable <bot>` finds it. A sentinel would hide it from the operator who has to act on it |
| `identity` | the identity the run resolved | The item lives under that identity's folder |
| `kind` | `decision` | The item asks the operator to act. It is not a review, so no review kind claims it and no settle runs |
| `question` | `This bot failed 10 runs in a row. Enable it again?` | One fixed sentence, so the inbox line is stable and a test can assert it |
| `prompt` | the prompt the tenth failed run dispatched with | The runner already holds it when it evaluates the fatigue rule [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:957] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1043-1054]. No resume is ever queued for this item, so the value is a faithful record rather than a rendered prompt |
| `options` | `null` | A notice offers no choice. The operator's action is `bots enable`, not an answer text |
| `createdAt` | the instant the tenth failure was recorded | The item is written once, at that instant |
| `expiresAt` | `createdAt` plus the repository's `expiryDays` | The same rule every item follows [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:145-147] |
| `answer` | `null` at birth | `bots enable` writes it through `answerItem` |
| `resumeRequestId` | `null` at birth | The no-resume path writes the id the request would have had, so the item never waits on a request that does not exist |
| `grants` | absent | 006 adds the key. This phase writes no grant, and an absent key reads as no grant |

**The item holds the bot.** An open `decision` item holds the bot's unattended runs, and the `disabled` switch stops it as well. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:287-298] Both are cleared by `bots enable`, in the order `design/state-machines.md` section 3 fixes.

---

## 4. THE `routines --json` ROW

The field table is `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 7 and this file copies none of it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:584] What this phase owns is how each value is derived, and the derivations are below.

| Key | Derivation |
|-----|------------|
| `version` | the integer `1` |
| `routines` | every bot in the checkout whose BOT.md carries a `routine` block, sorted by `botId` in byte order. A bot with no block is not a row |
| `botId` | the definition's `id` |
| `what` | the block's `what`, verbatim |
| `starts` | one entry, the parsed `starts[0]`, plus `summary` |
| `starts[].summary` | `describeStart(starts[0])`, the phrase `routine.ts` renders. `null` when the runtime cannot phrase the start |
| `does` | the block's `does`, `act` or `tell` |
| `until` | the block's `until`, or `null` when the block has none |
| `untilMetAt` | the state file's `untilMetAt`, or `null` |
| `failureStreak` | `failureStreak(botId)`, the count section 1's `enabledAt` bounds |
| `switch` | the first of `fatigued`, `disabled`, `completed`, `paused` that applies, else `enabled` |

**The `switch` derivation.** `fatigued` applies when the `disabled` switch is set and the state file's `fatiguedAt` is non-null. `disabled` applies when the `disabled` switch is set and `fatiguedAt` is null. `completed` applies when the `completed` switch is set. `paused` applies when the `paused` switch is set. A `fatiguedAt` with no `disabled` switch is not `fatigued`, because the operator cleared the switch and the bot is running.

**The empty shape.** `{"version": 1, "routines": []}`. A checkout with no routine bot prints it and exits 0.

**What the verb reads.** One BOT.md per bot, one state file per routine bot, the three switch files per routine bot and at most ten run records per routine bot. It opens no run folder and no SQLite index, so it is fresh by construction and needs no refresh rule. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md, section "10. REFRESH ON READ", row `routines --json`]

---

## 5. THE AUTHORED `routine` BLOCK

The block is optional. A BOT.md without one behaves exactly as it does today.

| Key | Type | Required | Refused when | Default |
|-----|------|----------|--------------|---------|
| `what` | non-empty string | yes | absent or empty, as `routine-field-invalid` with detail `what` | none |
| `starts` | array of trigger objects | yes | empty, as `routine-starts-empty` | none |
| `starts[]` | one trigger the parser already knows | yes | a shape `parseTrigger` refuses, with that parser's own reason as the detail | none |
| `does` | `act` or `tell` | yes | any other value, as `routine-field-invalid` with detail `does` | none |
| `until` | non-empty string | no | a shell metacharacter, as `routine-until-shell-metacharacters` | `null` |
| `until_check` | non-empty string | no | present with no `until`, as `routine-until-check-without-outcome` | `null` |

**The block's key set is closed.** An unknown key is refused `unknown-key` with detail `routine.<key>`, the shape `parseTrigger` already uses for a trigger key. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:150]

**The shell metacharacter set.** `;`, `|`, `&`, `$`, a backtick, `(`, `)`, `<`, `>`, a newline and a carriage return. `until` is prose and never reaches a shell, so a character that would mean something to a shell is refused rather than escaped. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/goal.md:48]

**`starts` holds exactly one entry.** A second entry is refused by name and never dropped. The three names are `routine-starts-multiple-cron` for a second cron entry, `routine-starts-cron-not-first` for a cron entry past index 0 and `routine-starts-multiple` for any other second entry. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/goal.md:47]

**`starts[0]` is the only source of `trigger`.** `renderTrigger` returns it and `definition.ts` fills `trigger` from it, so the installer, slot accounting and status keep reading the field they read today. A BOT.md carrying both `routine` and `trigger` is refused `routine-trigger-conflict`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/goal.md:49]

**`does: tell` sets delivery to local-only.** `routineDelivery` returns `local-only` for `tell` and the definition's own `delivery` for `act`. `tell` beside a `delivery` key is refused `routine-tell-with-targets`, because two keys would then name one policy.

---

## 6. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The routine state file is 0600 and the writer chmods after every write | `contracts/records.md` section 6 calls it owner-only and `writeStateAtomic` sets no mode [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts:413-415]. A chmod on every write also repairs a file an older runtime created |
| An unknown key in the state file reads as damaged, not as ignored | One module writes the file, so a stray key means a second writer exists. `contracts/versioning.md` rule 1 covers records more than one phase writes, and this one is not |
| The run record's `until` object holds one key | The durable outcome is `untilMetAt`. A second copy on the record would be a second truth |
| The fatigue item's `kind` is `decision` | A review kind would be claimed by 005's or 009's seam and settled, and the item is a notice the operator acts on with `bots enable` |
| The fatigue item's `options` is `null` | The item offers no choice. `bots enable` is the action, and an option list would invite an answer text that `answerItem` would then have to judge |
| The fatigue item's `prompt` is the tenth failed run's prompt | The runner holds it at the point it evaluates the fatigue rule, so no new field is needed and the item records what failed |
| `describeStart` lives in `routine.ts` | The screen contract's section 13.2 item 2 puts it there, and the phrase is the same one `bots routines --json` prints [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md, section "13.2 `002-routine-layer/` (the producer of `routines` and the start summary)"] |
| `checkRoutineFloor` takes the period as an argument | `routine.ts` is a contracts module and may import nothing outside its group, and `slot-accounting.ts` already imports `definition.ts`, so a direct import would close a cycle [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:39] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md, section "1.2 New modules"] |

---

## 7. EDITS THE OTHER DOCS NEED

**1. `contracts/runtime-architecture.md` section 2.1, the `routines/<botId>.json` line.** It reads `umask`. It must read `0600`, because `contracts/records.md` section 6 calls the file owner-only and this phase writes it at 0600. The line is at [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md, section "2.1 The user state root"]. This phase cannot edit the contract folder, so the operator makes this one-line change, per the same-change rule in `contracts/README.md`.

**2. `001-activity-and-actor`, the `activity` row's `schedule`.** The screen contract says an activity `recurring` or `scheduled` row carries `describeStart`'s phrase as `schedule`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md, section "13.2 `002-routine-layer/` (the producer of `routines` and the start summary)"] `routine.ts` exports the function. Whether 001's `activity.ts` imports it or receives the phrase another way is 001's row, because `contracts/runtime-architecture.md` section 1.2 lists `status-index` as that module's only import. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md, section "1.2 New modules"] This phase ships the function and decides nothing about 001's import.

---

## 8. CHECK THIS FILE

Each command prints the number on the line after it.

```bash
rg -c '^## ' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/records.md
# prints 8
rg -c '^\| `(schemaVersion|untilMetAt|fatiguedAt|fatigueItemId|enabledAt)` \| (integer|string)' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/records.md
# prints 5
```
