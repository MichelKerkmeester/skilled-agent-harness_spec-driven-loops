---
title: "Contract: Durable records of the OpenBot parity build"
description: "One section per record more than one phase reads or writes: a field table with type, null rule, owner phase, landing phase and absent-key default, one literal sample and the schemaVersion rule. Closes with the keys the phase documents left open and the choice taken for each."
trigger_phrases:
  - "parity build records"
  - "needs-you item keys"
  - "run record additions"
  - "routine state file"
  - "secrets index shape"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Durable records of the OpenBot parity build

Every record below lives under the user-level state root, `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots`, in the identity folder `encodeURIComponent(identity.toLowerCase())` unless the section says otherwise. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:100-110] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:102-104] A phase that changes a shape here edits this file in the same change (see `README.md`). How a version moves is `versioning.md`. What a `--json` verb prints is `cli-json.md`. Refusal names are `refusals.md`.

Each field table has the same columns:

| Column | Meaning |
|--------|---------|
| Key | The JSON key, dotted for a nested one |
| Type | JSON type, with the value set for an enum |
| Null | Whether `null` is a legal stored value, and when |
| Owner | The phase that fixes the key's meaning |
| Lands | The phase that adds the key to the runtime. `today` means it ships now |
| Absent reads as | What a reader does with a record written before the key existed |

Samples use the screen's one data set: clock `2026-11-25T21:14:04Z`, identity `skilled-scratch/hello`, checkout `/Users/ada/code/hello`, operator `ada`, bots `archive`, `digest`, `hello` and `nightly-report`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md, section "1. THE SAMPLE FILES AND THE ONE DATA SET"] Each sample is also a golden file in `fixtures/`.

---

## 1. NEEDS-YOU ITEM

File: `<identity>/needs-you/<item id>.json`, written by temp file and rename. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:181-182] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:159-166] The key list is closed: a key outside `ITEM_KEYS` refuses the whole item as `unknown-key`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51-65] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:97-98] So every key a phase adds goes into `ITEM_KEYS` and `validateNeedsYouItem` in the same commit as its writer. State (`open`, `answered`, `expired`) is derived on read and never stored. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:135-138]

Thirteen keys ship today. Four phases add six more: 001 lands `kind` as a key, 005 gives `kind` its values and adds three proposal keys, 006 adds `grants` and 010 adds `conversationId`. 009 adds a `kind` value and no key. 002's fatigue item uses today's keys.

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `id` | string, a safe segment | no | today | today | required. Equals `runId` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:103-104] |
| `runId` | string | no | today | today | required |
| `botId` | string, a bot id or a reserved sentinel (`memory-proposals`, `skill-proposals`) | no | today, sentinels 005 and 009 | today | required |
| `identity` | string, `owner/name` | no | today | today | required |
| `question` | string | no | today | today | required |
| `options` | string array | yes, no options | today | today | required |
| `createdAt` | string, ISO 8601 UTC | no | today | today | required |
| `expiresAt` | string, ISO 8601 UTC, `createdAt` plus `needsYou.expiryDays` | no | today | today | required [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:145-147] |
| `evidence` | string array | no | today | today | required |
| `prompt` | string, the parked run's exact prompt | no | today | today | required |
| `specFolder` | string | yes, an unbound run | today | today | required |
| `answer` | object, section 2 | yes, until answered | today, `by` and `scope` 001 | today | required |
| `resumeRequestId` | string | yes, until the resume is queued | today | today | required |
| `kind` | string: `decision`, `memory-proposal`, `skill-proposal` | yes, read as `decision` | 005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "Shared Records"] | 001 as a key [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, section "Files to Change"], values 005 and 009 | `decision` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, section "10. OPEN QUESTIONS"] |
| `proposalType` | string: `user`, `general`, `feedback`, `reference` | yes, on every item whose `kind` is not `memory-proposal` | 005 | 005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-007] | `null` |
| `proposalFact` | string, at most 400 characters | yes, as `proposalType` | 005 | 005 | `null` |
| `proposalBotId` | string, the bot the fact is for | yes, as `proposalType` | 005 | 005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-009] | `null` |
| `grants` | object, section 3 | yes, an item written before 006 | 006 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "Shared Records"] | 006 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-001] | `null` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-008] |
| `conversationId` | string, a safe segment | yes, a run that came from no conversation | 010 | 010 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:121] | `null` |

Two reading rules for `kind`, both binding. `bots inbox --json` prints the stored value, so a stored `null` or an absent key prints `null` and the screen draws it as `decision`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-003] Every runtime filter (`holdForBot`, `itemAwaitingResume`, the review seam) reads `null` and absent as `decision`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-009]

Two keys named `kind` sit in one item and do not share a vocabulary. `kind` is the review kind above. `grants.kind` is the action kind in section 3. A reader that means the action says `grants.kind`. The status report's row `kind` (`bot`, `needs-you`) and the request's `kind` are a third and a fourth vocabulary in other records.

The proposal keys are written only on a `memory-proposal` item. A `skill-proposal` item carries all three as `null` and names its draft in `evidence`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-005]

Sample, today's thirteen keys (`fixtures/needs-you-item.today.json`):

```json
{
  "id": "20261125T211204Z-7c1e9a40",
  "runId": "20261125T211204Z-7c1e9a40",
  "botId": "hello",
  "identity": "skilled-scratch/hello",
  "question": "Ship the release?",
  "options": null,
  "createdAt": "2026-11-25T21:12:04.000Z",
  "expiresAt": "2026-11-26T21:12:04.000Z",
  "evidence": ["/Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40"],
  "prompt": "Ship the release when the checks pass.",
  "specFolder": null,
  "answer": null,
  "resumeRequestId": null
}
```

The final nineteen-key shape after 010, the same item answered with a denial, is `fixtures/needs-you-item.final.json`. It does not pass today's validator, which is the point of the split.

**schemaVersion rule.** The item carries no version key. See `versioning.md` rule 4.

---

## 2. ANSWER OBJECT

The value of the item's `answer` key. Today it holds `text` and `answeredAt` and the validator checks only those two. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:24-27] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:116-121]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `text` | string | no | today | today | required |
| `answeredAt` | string, ISO 8601 UTC | no | today | today | required |
| `by` | string, an actor name, compared by exact match after trimming | yes, an answer stored before 001 | 001 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-004] | 001 | `null` |
| `scope` | string: `once`, `deny` | no once written | 001, extended by 006 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-010] | 001 | `once` |

An answer with no `--scope` records `once`, except a NO (`deny`, `no` or `n`, case-insensitive and trimmed), which records `deny` from 006 on. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-005] An answer's identity is its text and its scope together. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-013]

Sample:

```json
{ "text": "no", "answeredAt": "2026-11-25T21:13:10.000Z", "by": "ada", "scope": "deny" }
```

**schemaVersion rule.** None of its own. It is part of the item.

---

## 3. GRANT OBJECT

The value of the item's `grants` key. Every item writer fills it from 006 on: the needs-you gate, the answer, the resume stamp, 005's memory-proposal branch, 002's fatigue item and 009's review item. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-004] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-005]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `kind` | string: `pay`, `credentials`, `delete`, `send`, `share`, `post`, `other` | no | 006 | 006 | the whole object is required once present |
| `action` | string, the question clipped to 120 characters | no | 006 | 006 | required |
| `rung` | string: `kind`, `rule`, `auto-review`, `extra-vigilant`, `bot`. Only `kind` and `bot` are returned in 006 | no | 006 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-003] | 006 | required |
| `scope` | string: `once`, `deny` | yes, while the item is open | 006, equal to `answer.scope` and written in the same write | 006 | required |
| `grantedBy` | string, equal to `answer.by` | yes, while open | 006 | 006 | required |
| `grantedAt` | string, ISO 8601 UTC, equal to `answer.answeredAt` | yes, while open | 006 | 006 | required |

Sample, born open:

```json
{ "kind": "send", "action": "Ship the release?", "rung": "kind", "scope": null, "grantedBy": null, "grantedAt": null }
```

The grant's lifecycle (born open, granted, denied, expired with its item) is `answer-seam.md`.

---

## 4. RUN RECORD ADDITIONS

File: `<identity>/records/<runId>.json`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:176-178] The record has a version (`schemaVersion: 1`) and its validator checks the eight field groups and named fields only, so a key it does not know is kept and ignored. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:196-206] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:237-245] That is why every addition below keeps `schemaVersion` at `1`.

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `actor` | string, an actor name | yes, a record written before 001 | 001 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-005] | 001 | `null`. Top level, see Decisions taken |
| `answeredBy` | string | yes, every run no answer continued | 001 | 001 | `null`. Top level |
| `until` | object `{met}` with `met` a boolean and no other key | absent on a run with no `until_check` | 002 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-004] | 002 | no observation |
| `evidence.branch` | string | yes, only on a detached HEAD or when git does not answer | 004 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md, REQ-003] | today, 004 widens the fill from worktree runs to every dispatched run [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:155-156] | `null` |
| `evidence.worktreePath` | string, absolute | yes, a shared run | today | today | `null` |
| `posture.apps` | string array, the honored server names, `[]` when none declared | no | 007 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md, REQ-004] | 007 | `[]` |
| `posture.secretsUsed` | string array, secret names, never values | no | 008 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-008] | 008 | `[]` |
| `posture.skills` | array of `{name, digest}`, `digest` the SHA-256 hex of the loaded body | no | 009 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-011] | 009 | `[]` |
| `request.grant` | object `{itemId, kind, scope, by}` | absent or `null` on every run that is not a resume of a granted item | 006 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-005] | 006 | `null`. Name decided below |
| `postRunCauses` | array of `{cause, names, detail}`. `cause` is a post-run cause name from `refusals.md` (`secret-in-output`, `memory-proposal-secret`, `remember-type-invalid`), `names` lists secret names and never values, `detail` is a string or `null` | no, `[]` when nothing was found | 008 for `secret-in-output` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-014], reused by 010 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:170], 005 for its two causes | 005 or 008, whichever lands first | `[]`. Name decided below |
| `delivery[].state` value `unknown` | existing enum value | no | 011 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:195] | today, `unknown` is already in `DELIVERY_STATES` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:55] | not applicable |
| `delivery[].channel` values `telegram`, `slack`, `signal`, `whatsapp` | string | no | 011 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:203] | 011, on `DELIVERY_CHANNELS` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45] | not applicable |

011 adds no state value: an uncertain send writes the `unknown` that already exists. The status index carries `actor`, `branch` and `worktreePath` inside each run row's `summary` JSON, so `SCHEMA_VERSION` stays `'2'`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-007] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md, REQ-006]

Sample of the added keys on one resumed run (`fixtures/run-record.additions.json` holds the full record):

```json
{
  "actor": "ada",
  "answeredBy": "ada",
  "until": { "met": false },
  "posture": { "apps": [], "secretsUsed": ["demo"], "skills": [{ "name": "sk-doc", "digest": "3b1f0c4e9a2d7b6e5f8c1a0d9e4b7c2f6a3d8e1b0c5f9a2e7d4b6c1f8a3e0d5b" }] },
  "request": { "grant": { "itemId": "20261125T211204Z-7c1e9a40", "kind": "send", "scope": "deny", "by": "ada" } },
  "postRunCauses": []
}
```

**schemaVersion rule.** Stays `1` for every key in this table. `versioning.md` rule 1.

### Install record addition

File: `<identity>/installs/<botId>.json`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:212-213] Its reader checks `schemaVersion` and the labels and keeps any other key, so an added key needs no version. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:641-651] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:182-199]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `skillDigests` | object keyed by skill name, each value the SHA-256 hex of the body `bots install` read | no | 009 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-011] | 009 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, section "Files to Change"] | `{}`, so a bot installed before 009 that now names a skill refuses `skill-changed` until it is reinstalled |
| `operator` | string, the installing operator as `resolveActor` gives it with no `--as` | yes, when no actor resolves | 001 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/data-model.md, section "9. RECORD DELTAS THIS PHASE WRITES"] | 001 | `null`, so a scheduled row's `actor` is null |
| `fullAccess` | boolean, `true` only for a bot installed with `--full-access` | no | 001 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-009] | 001 | `false`, so a declared `danger-full-access` is capped at `workspace-write` |

`skill-changed` compares each `posture.skills[].digest` the loader computes against `skillDigests[name]`. The job's environment carries the same operator as `SKILLED_BOTS_OPERATOR`, and the activity read takes a schedule row's `actor` from `operator`. Sample: `{ "operator": "ada", "fullAccess": false, "skillDigests": { "sk-doc": "3b1f0c4e9a2d7b6e5f8c1a0d9e4b7c2f6a3d8e1b0c5f9a2e7d4b6c1f8a3e0d5b" } }`.

---

## 5. REQUEST RECORD

File: one JSON file per request under `<identity>/requests/<folder>/`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:51] The key list is closed and the drain quarantines a request that does not validate. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:80-94] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:190-191] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:200-205]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| the thirteen keys of `RECORD_KEYS` | unchanged | unchanged | today | today | required |
| `conversationId` | string, a safe segment | yes, a request from no conversation | 010 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:168] | 010, stamped by `answerItem` after the review seam | `null` |

A chat request carries `source: "chat"` and its message `id` as the event id, so a re-sent message is a queue duplicate. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:167]

Sample (`fixtures/request-record.json`):

```json
{
  "schemaVersion": 1,
  "id": "rq-aafe0522ffd550ba61ea1d9bb914aea0",
  "kind": "resume",
  "workflowId": "hello",
  "prompt": "",
  "source": "answer",
  "origin": "needs-you item 20261125T211204Z-7c1e9a40",
  "enqueuedAt": "2026-11-25T21:13:10.000Z",
  "target": { "identity": "skilled-scratch/hello", "path": "/Users/ada/code/hello" },
  "firedSlot": null,
  "idempotencyKey": "20261125T211204Z-7c1e9a40",
  "delivery": null,
  "attempts": 0,
  "conversationId": "hello"
}
```

The sample is what `buildRequest` returns for this answer at `2026-11-25T21:13:10.000Z`, plus 010's key. Without `conversationId` it passes today's `validateRequest`, and with it today's validator refuses `unknown-key`, which is the row `versioning.md` gives 010.

**schemaVersion rule.** Stays `1`. Adding `conversationId` breaks an older runtime's read, which `versioning.md` table row 010 covers.

---

## 6. ROUTINE STATE

File: `<identity>/routines/<botId>.json`, owner-only, written by temp file and rename through `writeStateAtomic`, the writer every state file here uses. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, section "Files to Change"] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:14] A missing file reads as every field `null`. A damaged file reads the same and never as met. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, section "Reliability"]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `schemaVersion` | integer `1` | no | 002 | 002 | `1` |
| `untilMetAt` | string, ISO 8601 UTC | yes, until `until_check` exits 0 | 002 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-004] | 002 | `null` |
| `fatiguedAt` | string, ISO 8601 UTC | yes, until the tenth failure | 002 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-006] | 002 | `null` |
| `fatigueItemId` | string, the fatigue item's id | yes, as `fatiguedAt` | 002 | 002 | `null` |
| `enabledAt` | string, ISO 8601 UTC, written by `bots enable` | yes, a bot never re-enabled | 002, per D9 in `decisions.md` | 002 | `null`, so every run counts |

The failure streak counts only runs whose `dispatch.dispatchedAt` is later than `enabledAt`. `bots enable` writes `enabledAt` and clears `fatiguedAt` and `fatigueItemId`.

Sample (`fixtures/routine-state.json`):

```json
{ "schemaVersion": 1, "untilMetAt": null, "fatiguedAt": null, "fatigueItemId": null, "enabledAt": "2026-11-25T09:00:00.000Z" }
```

---

## 7. MEMORY ENTRY LINE

Files: the shared file `<stateRoot>/memory/shared.md` and the per-bot file `<identity>/memory/<botId>.md`, a 0700 folder and 0600 files. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-001 and REQ-002] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-012] One entry is one line with five fields. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md, section "Key Components"]

```text
- <type> | <YYYY-MM-DD> | <actor> | <source> | <text>
```

| Field | Format | Owner |
|-------|--------|-------|
| `type` | `user`, `general`, `feedback`, `reference` | 005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-001] |
| date | `YYYY-MM-DD`, the UTC date of the append | 005 |
| `actor` | an actor name, which holds no `|` | 005 |
| `source` | `bots remember`, or `bot:<botId> (run <runId>)` for a confirmed proposal | 005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-008] |
| `text` | at most 400 characters, every whitespace run collapsed to one space, so the entry is one line | 005, the collapse rule from OpenGhost's `clean` [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:17] |

The parser splits on the first four ` | ` delimiters, so a `|` inside the text needs no escape. Indexes are 1-based in file order and shift down after a forget. A line that does not split into five fields is skipped and counted. A torn last line is one such line.

Sample:

```text
- general | 2026-11-25 | ada | bots remember | the sales sheet is Q3 | not Q2
- user | 2026-11-25 | ada | bot:hello (run 20261125T210204Z-0b6e5f72) | Prefers ISO dates.
```

The first line's text is `the sales sheet is Q3 | not Q2`. `bots remember --list --json` prints these entries in the shape `cli-json.md` section 3 fixes.

**schemaVersion rule.** The memory files carry no version. They are line files the prompt renders verbatim, and a version line would either reach the prompt or need a second parser rule. A later grammar change ships a new delimiter, and a line in the old form then reads as skipped and counted, never as a wrong fact.

---

## 8. SECRETS INDEX

Files: `<identity>/secrets/index.json` (0600) and, for the file backend, `<identity>/secrets/<name>.value` (0600). [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md, AC-002] The index holds metadata and never a value. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md, section "Data Flow"]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `schemaVersion` | integer `1` | no | 008 | 008 | `1` |
| `entries` | object keyed by secret name | no | 008 | 008 | `{}` for a missing file |
| `entries.<name>.backend` | string: `keychain`, `file` | no | 008 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-002] | 008 | required |
| `entries.<name>.createdAt` | string, ISO 8601 UTC | no | 008 | 008 | required |
| `entries.<name>.updatedAt` | string, ISO 8601 UTC | no | 008 | 008 | required |

**Name grammar.** `^[a-z0-9][a-z0-9-]*$`, the bot id pattern, at most 64 characters. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:88] **Environment key.** `SKILLED_BOT_SECRET_` plus the name upper-cased with each hyphen turned into an underscore: `demo` becomes `SKILLED_BOT_SECRET_DEMO` and `slack-app-token` becomes `SKILLED_BOT_SECRET_SLACK_APP_TOKEN`. The map cannot collide, because the grammar admits no underscore. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-007] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/acceptance-criteria.md:76]

Sample (`fixtures/secrets-index.json`):

```json
{
  "schemaVersion": 1,
  "entries": {
    "demo": { "backend": "file", "createdAt": "2026-11-25T20:00:00.000Z", "updatedAt": "2026-11-25T20:00:00.000Z" },
    "telegram": { "backend": "keychain", "createdAt": "2026-11-25T20:01:00.000Z", "updatedAt": "2026-11-25T20:01:00.000Z" }
  }
}
```

The keychain read and delete commands, the write order and the orphan rule are 008's plan to state under its own work order. This section fixes the shape they write.

---

## 9. `proposal.json`

File: `<identity>/proposals/<runId>/proposal.json`, beside the draft `SKILL.md`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-004]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `schemaVersion` | integer `1` | no | 009 | 009 | `1` |
| `targetPath` | string, checkout-relative, `.skilled/skills/<name>/SKILL.md` | no | 009 | 009 | required |
| `revisionRead` | string, the SHA-256 hex of the target body read at proposal time | yes, the target did not exist | 009 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-006] | 009 | required |
| `runId` | string, the run the proposal reads | no | 009 | 009 | required |
| `botId` | string, the proposing bot | no | 009 | 009 | required |
| `createdAt` | string, ISO 8601 UTC | no | 009 | 009 | required |

With no `--name`, the target name is the proposing bot's id.

Sample (`fixtures/proposal.json`):

```json
{
  "schemaVersion": 1,
  "targetPath": ".skilled/skills/report/SKILL.md",
  "revisionRead": null,
  "runId": "20261125T210204Z-0b6e5f72",
  "botId": "hello",
  "createdAt": "2026-11-25T21:13:30.000Z"
}
```

---

## 10. CONVERSATION MESSAGE

File: `<identity>/conversations/<conversationId>.jsonl`, append-only, one JSON object per line, a torn last line skipped on read and reported on stderr. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:152-153] Each line carries exactly nine keys. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:154]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `schemaVersion` | integer `1` | no | 010 | 010 | `1` |
| `id` | string, the client message id, which is the request's event id | no | 010 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:167] | 010 | required |
| `conversationId` | string, equal to the file name | no | 010 | 010 | required |
| `botId` | string, the addressed bot on a human message, the replying bot on a bot message | no | 010 | 010 | required |
| `role` | string: `human`, `bot` | no | 010 | 010 | required |
| `text` | string. Every control character but the line feed is dropped, the carriage return included, so a CRLF is stored as LF (D10 in `decisions.md`). A secret literal is replaced by `[redacted: <name>]` | no | 010 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:170] | 010 | required |
| `at` | string, ISO 8601 UTC | no | 010 | 010 | required |
| `runId` | string | yes, every human message | 010 | 010 | required |
| `by` | string, the actor on a human message, the literal `bot` on a bot message | no | 010 | 010 | required |

A line feed kept in `text` is written as `\n` inside the JSON string, so the file still holds one message per line. The chat pane draws each line of `text`, and the prompt renderer turns each line feed into one space (`prompt-sections.md` section 1.9).

A parked run's message and a failed run's message carry the item id and the reason inside `text`, in the fixed forms `needs you: <question> (item <itemId>)` and `failed: <exit reason>`. See Decisions taken.

Sample (`fixtures/conversation.jsonl`, two lines):

```text
{"schemaVersion":1,"id":"msg-20261125T211200Z-1a2b3c4d","conversationId":"hello","botId":"hello","role":"human","text":"@hello is the release ready?","at":"2026-11-25T21:12:00.000Z","runId":null,"by":"ada"}
{"schemaVersion":1,"id":"msg-20261125T211204Z-7c1e9a40","conversationId":"hello","botId":"hello","role":"bot","text":"needs you: Ship the release? (item 20261125T211204Z-7c1e9a40)","at":"2026-11-25T21:12:04.000Z","runId":"20261125T211204Z-7c1e9a40","by":"bot"}
```

Whether the `@<bot-id>` prefix stays in `text`, and the default conversation id of `bots chat <id>`, are the routing grammar's to fix in 010's design child. The sample keeps the prefix and uses the bot id as the conversation id, and a test reads neither as a rule.

---

## 11. `channels/config.json`

File: `<identity>/channels/config.json`, read and written only by `channel.ts`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:210]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `schemaVersion` | integer `1` | no | 011 | 011 | `1` |
| `channels` | object keyed by channel name (`telegram`, `slack`, `signal`, `whatsapp`). The terminal transport needs no entry | no | 011 | 011 | `{}` for a missing file, so no channel is configured |
| `channels.<name>.secret` | string, a secret name in the section 8 grammar, never a value | no | 011 | 011 | required |
| `channels.<name>.enabled` | boolean | no | 011 | 011 | required |

No chat id, queue state or token lives in this file.

**Derived secret names.** A channel that needs more than one credential derives every further name from its configured `secret` by a fixed suffix, so this file keeps one `secret` per channel and gains no key. The names are the ones `011-messaging-channels/002-adapter-and-record-contracts/design/records.md` section 1.1 fixes:

- `telegram` reads `<secret>`, the bot token.
- `slack` reads `<secret>` for the app-level token and `<secret>-bot` for the bot token. With the sample below that is `slack-app-token` and `slack-app-token-bot`.
- `signal` reads `<secret>`, the registered account number in E.164 form.
- `whatsapp` reads `<secret>` for the Cloud API access token, `<secret>-app-secret` for the Meta app secret, `<secret>-verify-token` for the subscription handshake and `<secret>-phone-number-id` for the sending number's id.

A suffix adds only lowercase letters and hyphens, so a derived name stays inside the section 8 grammar as long as it stays within 64 characters. The longest suffix is `-phone-number-id`, 16 characters, so a `whatsapp` entry's `secret` must be at most 48 characters. A longer one derives a name the vault cannot hold: `bots secret set` refuses it `secret-name-invalid`, and `bots channel listen whatsapp` then refuses `secret-unknown`. 011 names no check for the bound at `channel link`. A missing derived name refuses `secret-unknown` before any I/O, the same as a missing primary name. The account number and the phone number id are not credentials. They sit in the vault because this file has no other place for them and the vault keeps them off every log.

**Fixed addresses.** Two addresses are fixed rather than configured, for the same reason: the Signal daemon at `http://127.0.0.1:8080` and the WhatsApp webhook listener at `127.0.0.1:8787`. A later key for either is an added key under `versioning.md` rule 1.

Sample (`fixtures/channels-config.json`):

```json
{ "schemaVersion": 1, "channels": { "telegram": { "secret": "telegram", "enabled": true }, "slack": { "secret": "slack-app-token", "enabled": false } } }
```

---

## 12. LINK RECORD

File: `<identity>/channels/links.json`, written only by `channel-link.ts`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md:62] A link records the actor who ran `bots channel link` and the provider-asserted sender id. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185] Pending codes and lockouts live in the same file, so one writer owns every pairing fact.

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `schemaVersion` | integer `1` | no | 011 | 011 | `1` |
| `links` | object keyed `<channel>:<chatId>` | no | 011 | 011 | `{}` |
| `links.<key>.channel`, `.chatId`, `.senderId`, `.actor` | string | no | 011 | 011 | required |
| `links.<key>.linkedAt` | string, ISO 8601 UTC | no | 011 | 011 | required |
| `codes` | object keyed by channel name, each `{code, actor, expiresAt}`, `code` six digits | no | 011 | 011 | `{}` |
| `lockouts` | object keyed `<channel>:<chatId>`, each `{failures, lockedUntil}` | no | 011 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:186] | 011 | `{}` |

A code expires five minutes after it is issued and is removed on first use. Five failures from one chat set `lockedUntil` to 300 s ahead. Failures counted per actor after a link (`answer-not-approver`) live in the approval index, not here.

Sample: `fixtures/channel-links.json`.

---

## 13. APPROVAL INDEX

File: `<identity>/channels/approvals.json`, written only by `channel-approval.ts` before the prompt is sent. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:188] It is not the definition-approval folder `<identity>/approvals/<botId>.json`, which hashes BOT.md for unattended runs. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:207-208]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `schemaVersion` | integer `1` | no | 011 | 011 | `1` |
| `prompts` | object keyed by item id, one entry per prompt sent | no | 011 | 011 | `{}` |
| `prompts.<itemId>.channel`, `.conversation` | string | no | 011 | 011 | required |
| `prompts.<itemId>.choices` | string array, the item's `options`, or `["YES", "NO"]` for an item with none | no | 011 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:189] | 011 | required |
| `prompts.<itemId>.expiresAt` | string, the item's `expiresAt` | no | 011 | 011 | required |
| `prompts.<itemId>.sentAt` | string, ISO 8601 UTC | no | 011 | 011 | required |
| `notApprover` | object keyed by actor, each `{failures, lastAt}` | no | 011 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:186] | 011 | `{}` |

The action id is derived, never stored: `approval-v1:<itemId>:<index>`, where `index` is the 1-based position in `choices`, the same number a numbered reply sends. An entry past `expiresAt` is removed on the next read.

Sample: `fixtures/channel-approvals.json`.

---

## 14. QUEUE ENTRY

File: one JSON file per outbound message under `<identity>/channels/queue/`, written before the I/O. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:145] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:195]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `schemaVersion` | integer `1` | no | 011 | 011 | `1` |
| `idempotencyKey` | string, also the file name | no | 011 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:184] | 011 | required |
| `channel`, `conversationId`, `text` | string. `text` is the `deliveryMessage()` output after the literal check | no | 011 | 011 | required |
| `itemId`, `runId` | string | yes, a message for no item or no run | 011 | 011 | `null` |
| `state` | string: `queued`, `sending`, `delivered`, `failed`, `unknown` | no | 011 | 011 | required |
| `attempts` | integer | no | 011 | 011 | `0` |
| `nextAttemptAt` | string, ISO 8601 UTC | yes, a terminal state | 011 | 011 | `null` |
| `enqueuedAt`, `updatedAt` | string, ISO 8601 UTC | no | 011 | 011 | required |
| `error` | object `{kind, message, unsupported, retryable, sentBeforeError}`, the send-error shape [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:184] | yes, no failure yet | 011 | 011 | `null` |

`unknown` and `failed` with `retryable: false` are terminal and never retried. A retryable failure waits by attempt from `BACKOFF_MS = [0, 5000, 25000, 120000, 600000]`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md:67] No token appears in `text` or `error.message`, and every URL renders the token as `bot<redacted>`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:201]

Sample: `fixtures/channel-queue-entry.json`. Its `text` is the M02 golden of `011-messaging-channels/001-channel-ux-and-message-map/design/golden/M02-prompt-options-buttons.txt` without the file's final line feed.

---

## 15. SEEN RECORD

File: one JSON file per inbound provider message under `<identity>/channels/seen/<channel>/`, named by the SHA-256 hex of the provider message id. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:151] It is not the request queue's `requests/seen/` folder. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:51]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `schemaVersion` | integer `1` | no | 011 | 011 | `1` |
| `channel`, `messageId` | string | no | 011 | 011 | required |
| `requestId` | string, the request the message became | yes, a message refused before enqueue | 011 | 011 | `null` |
| `seenAt` | string, ISO 8601 UTC | no | 011 | 011 | required |

The record is written after the durable enqueue and before the provider is acknowledged, so a redelivery finds it and enqueues nothing. The per-transport acknowledge sequence is 011's design child to fix.

Sample: `fixtures/channel-seen.json`.

---

## 16. `operators.json`

File: `<identity>/operators.json`, written only by `bots channel roster add|remove`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:187] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:207]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `schemaVersion` | integer `1` | no | 011 | 011 | `1` |
| `owner` | string, an actor name | no | 011 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "Shared Records"] | 011 | the roster is missing |
| `members` | string array of actor names | no | 011 | 011 | `[]` |

An absent, unreadable or empty roster refuses every channel answer `channel-roster-missing` and refuses nothing on the terminal surface. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:208]

Sample (`fixtures/operators.json`):

```json
{ "schemaVersion": 1, "owner": "ada", "members": ["grace"] }
```

---

## 17. DECISIONS TAKEN

Keys the phase documents leave open, the choice made here and why. Each is open for the owner phase to override in this file.

| Key or rule | Choice | Why |
|-------------|--------|-----|
| Where `actor` and `answeredBy` sit on the run record | Top level, beside `schemaVersion` | 001 says only "every run record carries `actor`". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-005] 002's `until` is top level too [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md, AC-004], and no field group means "who". The validator ignores an extra top-level key, so the place costs no version |
| The name of 006's per-grant line on the request join | `request.grant`, one object `{itemId, kind, scope, by}` | 006 names "one line per grant" as an optional field on the request join and gives no name. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/tasks.md, T022] A resumed run continues one item, the one `request.resumedItemId` names [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:78-79], so one object, not an array |
| Which run-record field holds a post-run cause | A new top-level `postRunCauses` array of `{cause, names, detail}` | The run is dispatched and finished, so `exit.refusal` (refused before dispatch) is the wrong place [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:137-138] and `exit.reason` keeps the stop reason verbatim [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:131-132]. `refusals.md` records three post-run causes on the run record beside each other, so one array holds all three and one run can carry more than one |
| `skillDigests` on a record installed before 009 | `{}`, so a named skill refuses `skill-changed` until reinstall | A missing digest cannot prove the body unchanged, and 009 makes a differing body refuse before dispatch [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-011] |
| Extra credentials and the Signal and WhatsApp addresses | Derived secret names by suffix and two fixed loopback addresses, with no new key in `channels/config.json` | 011 chose the suffix rule inside the frozen shape [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/records.md, section "1.1 Secret names a transport derives"]. One `secret` per channel keeps the config free of credentials, and the vault already resolves and redacts every name |
| `channels.terminal` | Not a key of `channels/config.json` | The terminal transport reads stdin and needs no token, while `secret` is required on every entry [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:202] |
| Redaction token wording | `[redacted: <name>]`, where the name is the secret's name | 010 writes `[redacted: <key>]` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:170]. The key a detector names is the secret's name, so the two spellings are one token |
| 010's item id and failure reason on a bot message | Inside `text`, as `needs you: <question> (item <itemId>)` and `failed: <exit reason>`, with no tenth key | 010 fixes nine keys and its AC-003 counts them [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/acceptance-criteria.md:56], while REQ-007 asks for the item id and the reason [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:158]. A new key would contradict AC-003, a fixed text form does not |
| `posture.apps` on a record written before 007 | `[]` | A bot before 007 declared no app, which is what `[]` means [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md, REQ-004] |
| `posture.skills` key shape | `{name, digest}` with `digest` the full SHA-256 hex | 009 says "each loaded body's name and digest". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, section "Files to Change"] The install record's `skillDigests` uses the same digest, so the two compare by string |
| `enabledAt` in the routine state file | An ISO instant written by `bots enable`, the streak counts runs after it | D9 in `decisions.md`, from OpenBot's restart of the count at re-enable [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:118-123] |
| Memory line grammar | `- <type> \| <YYYY-MM-DD> \| <actor> \| <source> \| <text>`, split on the first four delimiters, whitespace collapsed | WO-04's recommended default. A pipe in the text is the adversarial case 005 lists [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md, section "FIX ADDENDUM: AFFECTED SURFACES"] |
| The memory files carry no version | No version line | A version line would reach the prompt or need a second parser rule. A changed grammar reads as skipped lines, never as wrong facts |
| Secret name grammar and environment key | `^[a-z0-9][a-z0-9-]*$` up to 64 characters, upper-case and hyphen to underscore | WO-06's recommended default. 011 already uses `slack-app-token` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/acceptance-criteria.md:76] |
| `proposal.json` `targetPath` form | Checkout-relative path | The proposal lives in the state root and the checkout path can move. `revisionRead` is the digest or `null`, per WO-07 |
| The default proposal name | The proposing bot's id | WO-07's recommended default. 009 leaves `--name` optional with no default [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-004] |
| `schemaVersion` on `channels/config.json` and `operators.json` | Present, `1` | `versioning.md` rule 3. 011 writes both literals without it, which is listed as a contradiction in `README.md` |
| Link codes and lockouts | In `links.json` beside the links | One writer, `channel-link.ts`, owns every pairing fact, so no second file is added |
| Approval index key structure | Keyed by item id, the action id derived from the choice's 1-based index | 011 gap 9 asks for the key structure. One item has one prompt, and a 1-based index makes the button and the numbered reply send the same number |
| Per-actor `answer-not-approver` counter | `notApprover` in the approval index | 011 counts it per actor after a link and names no file [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:186] |
| Queue entry `state` enum | `queued`, `sending`, `delivered`, `failed`, `unknown` | 011 names `unknown` and enqueue before I/O. `sending` marks a send in flight so a restart turns it into `unknown`, never a resend |
| Seen record placement | Per channel, file named by the SHA-256 of the provider message id | 011 names `seen/` once with no content. A hash keeps any provider id a safe segment |
