---
title: "Design: Runtime payload contracts for the terminal screen"
description: "The four JSON payloads the screen polls, one literal sample and one field table per verb, how each drawn string is derived, the versioning rule, the failed-read shape, the refresh-on-read rule, and the edits the producing phases must adopt."
trigger_phrases:
  - "terminal screen contracts"
  - "bots json payloads"
  - "status activity inbox routines json"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Runtime payload contracts for the terminal screen

The screen reads four verbs and nothing else: `bots status --json`, `bots activity --json`, `bots inbox --json` and `bots routines --json`. This file fixes each payload by key, type, nullability and format, and names the frame cell that draws each key. A payload change is a change to this file first, then to the four sample files, then to the producing phase.

Three of the four verbs do not exist yet. `bots.cjs` knows eleven verbs and `activity` and `routines` are not among them, and `inbox` takes no option of its own. [SOURCE: .skilled/bin/bots.cjs:64-76] So everything below for those three is a contract the producing phase adopts through section 13, not a description of shipped code. `status` is described from its code.

Frame numbers are the state index in `001-ux-and-component-map/design/mockups.md` section 2. [SOURCE: 001-ux-and-component-map/design/mockups.md:45-73]

---

## 1. THE SAMPLE FILES AND THE ONE DATA SET

The four samples live beside this file in `design/payloads/`: `status.json`, `activity.json`, `inbox.json` and `routines.json`. The build copies them into `crates/bots-tui/tests/fixtures/payloads/`, and the fixture script prints the file for the verb it is asked for. The literal blocks in sections 4 to 7 are copies of those files. Each block is preceded by a `payload:<verb>` comment so a check can pair it with its file:

```bash
cd specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design
node - <<'EOF'
const fs = require('fs')
const assert = require('assert')
const md = fs.readFileSync('contracts.md', 'utf8')
const blocks = [...md.matchAll(/<!-- payload:(\w+) -->\n```json\n([\s\S]*?)```/g)]
assert.strictEqual(blocks.length, 4)
for (const [, verb, text] of blocks) assert.deepStrictEqual(JSON.parse(text), JSON.parse(fs.readFileSync(`payloads/${verb}.json`, 'utf8')))
console.log('4 samples match')
EOF
```

The four files are one data set at one instant, so frames 1, 2 and 3 all draw from them together (R8 in `research/fable-review-1.md`). [SOURCE: research/fable-review-1.md:87]

| Fixed fact | Value |
|------------|-------|
| The clock every frame is drawn at | `2026-11-25T21:14:04Z` |
| The machine time zone the fixture assumes | UTC, so a cron start's local time reads the same as UTC |
| The repository identity | `skilled-scratch/hello`, shared by all four bots because identity is per repository |
| The operator | `ada` |
| The repository's `needsYou.expiryDays` | `1`, the smallest value the config accepts, which the 24-hour gap between hello's `at` and `expiresAt` in frame 2 already implies [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts:199] [SOURCE: 001-ux-and-component-map/design/mockups.md:202-203] |
| The four bots | `archive`, `digest`, `hello`, `nightly-report` |
| The three needs-you items | hello open, digest open with two options, archive expired |

Run ids follow `newRunId`, a compact UTC stamp, a dash and eight hex digits, for example `20261125T211204Z-7c1e9a40`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:312-315] An item's `id` equals the `runId` of the run it parked, because the validator refuses any other id. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:103] So the same string appears as the activity row's `runId`, the inbox item's `id`, the status bot row's `heldBy` and `lastRun.needsYouItemId`, and the status item row's `itemId`.

Rendering these four files at the fixed clock with the rules in section 3 gives frames 1 to 3 after the mockups edits in section 13.6. I checked that with a throwaway script that applies the section 3 rules to the four files. It printed the header, the banner, each pane's title and body lines at 80x24 and the detail-column lines at 120x40, and each matched section 13.6. It did not draw footers or the 120x40 padding, which the 120x40 block in section 13.6 was generated separately for.

---

## 2. HOW THE SCREEN READS A PAYLOAD

- Every verb is called as `<program> <verb> --json --repo <repo>` with stdin null and no `--as`, on the worker thread. [SOURCE: 002-architecture-and-contracts/spec.md:189]
- A read is good when the child exits 0 and stdout parses as the payload object for that verb. Section 9 covers every other outcome.
- Each payload is a JSON object with a top-level `version`. Section 8 has the rule.
- The screen keeps no field it does not draw or select by, and ignores keys it does not know.

---

## 3. SHARED FORMATS AND DERIVATIONS

### Instants

Every instant in every payload is ISO 8601 in UTC with a `Z` suffix, as `Date.prototype.toISOString` writes it, for example `2026-11-25T21:12:04.000Z`. The runtime already writes item instants this way. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:145-147] The screen parses only this shape, by hand with `std` and no time crate (A6): four digits, then `-MM-DDTHH:MM:SS`, an optional fraction, and `Z`. Any other shape is a parse failure of that field, drawn as `?` in its cell. The row itself is still drawn.

Where a frame draws an instant itself (the detail column's `at` and `expiresAt`), it drops the fraction: `2026-11-25T21:12:04.000Z` draws as `2026-11-25T21:12:04Z`. [SOURCE: 001-ux-and-component-map/design/mockups.md:125] [SOURCE: 001-ux-and-component-map/design/mockups.md:202-203]

### The age formatter

One formatter, `stale_label` in `view/header.rs`, turns an instant into an age for the header and for every pane. [SOURCE: 003-shell-and-navigation/spec.md:136] With `d = now - at`:

| Magnitude of `d` | Unit drawn | Example |
|------------------|------------|---------|
| under 60 s | whole seconds, `s` | `12s` |
| under 60 min | whole minutes, `m` | `2m` |
| under 24 h | whole hours, `h` | `3h` |
| 24 h or more | whole days, `d` | `2d` |

The count is always rounded down. A past instant (`d >= 0`) draws `<age> ago` and a future one draws `in <age>`. So `2026-11-26T00:15:00.000Z` at the fixed clock is 3 h 0 min 56 s ahead and draws `in 3h`.

### Strings

Every runtime string is sanitized before it is drawn: each control character, line breaks included, becomes `?`, and other Unicode is kept. [SOURCE: 001-ux-and-component-map/design/component-inventory.md:79] A null string draws as `-` unless the field table names another word.

### Ordering and selection

The screen draws groups, rows, items and routines in payload order, and never re-sorts. Each producer fixes the order in its section. The selection is held by a key, never by a row index, because the poll reorders rows. [SOURCE: 001-ux-and-component-map/design/component-inventory.md:72] The key per pane is in sections 5 to 7.

---

## 4. `bots status --json`

### Sample

<!-- payload:status -->
```json
{
  "version": 1,
  "indexPath": "/Users/ada/.local/state/system-skilled-bots/index/status.sqlite",
  "builtAt": "2026-11-25T09:00:00.000Z",
  "updatedAt": "2026-11-25T21:13:52.000Z",
  "stale": false,
  "staleIdentities": [],
  "rows": [
    {
      "kind": "bot",
      "identity": "skilled-scratch/hello",
      "botId": "archive",
      "state": "ok",
      "flags": ["ok"],
      "path": "/Users/ada/code/hello",
      "pathState": "present",
      "previousPath": null,
      "installed": true,
      "labels": ["com.skilled.bots.skilled-scratch_2fhello.archive.0"],
      "launchd": [
        {
          "label": "com.skilled.bots.skilled-scratch_2fhello.archive.0",
          "presence": "not-loaded",
          "state": "not loaded",
          "runs": 0,
          "lastExitCode": null
        }
      ],
      "reinstall": [],
      "fix": null,
      "heldBy": null,
      "lastRun": {
        "runId": "20261125T201404Z-9d2c7e15",
        "dispatchedAt": "2026-11-25T20:14:04.000Z",
        "exitReason": "disabled",
        "exitClass": null,
        "needsYouItemId": null,
        "delivery": [],
        "branch": null,
        "worktreePath": null
      }
    },
    {
      "kind": "bot",
      "identity": "skilled-scratch/hello",
      "botId": "digest",
      "state": "held",
      "flags": ["held"],
      "path": "/Users/ada/code/hello",
      "pathState": "present",
      "previousPath": null,
      "installed": true,
      "labels": ["com.skilled.bots.skilled-scratch_2fhello.digest.0"],
      "launchd": [
        {
          "label": "com.skilled.bots.skilled-scratch_2fhello.digest.0",
          "presence": "loaded",
          "state": "not running",
          "runs": 12,
          "lastExitCode": 5
        }
      ],
      "reinstall": [],
      "fix": null,
      "heldBy": "20261125T210504Z-3f9d2b11",
      "lastRun": {
        "runId": "20261125T210504Z-3f9d2b11",
        "dispatchedAt": "2026-11-25T21:05:04.000Z",
        "exitReason": "awaiting-decision",
        "exitClass": "operator",
        "needsYouItemId": "20261125T210504Z-3f9d2b11",
        "delivery": [],
        "branch": null,
        "worktreePath": null
      }
    },
    {
      "kind": "bot",
      "identity": "skilled-scratch/hello",
      "botId": "hello",
      "state": "held",
      "flags": ["held"],
      "path": "/Users/ada/code/hello",
      "pathState": "present",
      "previousPath": null,
      "installed": false,
      "labels": [],
      "launchd": [],
      "reinstall": [],
      "fix": null,
      "heldBy": "20261125T211204Z-7c1e9a40",
      "lastRun": {
        "runId": "20261125T211204Z-7c1e9a40",
        "dispatchedAt": "2026-11-25T21:12:04.000Z",
        "exitReason": "awaiting-decision",
        "exitClass": "operator",
        "needsYouItemId": "20261125T211204Z-7c1e9a40",
        "delivery": [],
        "branch": null,
        "worktreePath": null
      }
    },
    {
      "kind": "bot",
      "identity": "skilled-scratch/hello",
      "botId": "nightly-report",
      "state": "ok",
      "flags": ["ok"],
      "path": "/Users/ada/code/hello",
      "pathState": "present",
      "previousPath": null,
      "installed": true,
      "labels": ["com.skilled.bots.skilled-scratch_2fhello.nightly-report.0"],
      "launchd": [
        {
          "label": "com.skilled.bots.skilled-scratch_2fhello.nightly-report.0",
          "presence": "loaded",
          "state": "running",
          "runs": 30,
          "lastExitCode": 1
        }
      ],
      "reinstall": [],
      "fix": null,
      "heldBy": null,
      "lastRun": {
        "runId": "20261125T211004Z-5e1a8b39",
        "dispatchedAt": "2026-11-25T21:10:04.000Z",
        "exitReason": "error",
        "exitClass": "environment",
        "needsYouItemId": null,
        "delivery": [
          { "channel": "webhook", "state": "not-attempted" }
        ],
        "branch": null,
        "worktreePath": null
      }
    },
    {
      "kind": "needs-you",
      "identity": "skilled-scratch/hello",
      "itemId": "20261124T201404Z-c8f3a6e2",
      "botId": "archive",
      "runId": "20261124T201404Z-c8f3a6e2",
      "state": "expired",
      "createdAt": "2026-11-24T20:14:04.000Z",
      "expiresAt": "2026-11-25T20:14:04.000Z"
    },
    {
      "kind": "needs-you",
      "identity": "skilled-scratch/hello",
      "itemId": "20261125T210504Z-3f9d2b11",
      "botId": "digest",
      "runId": "20261125T210504Z-3f9d2b11",
      "state": "needs-you",
      "createdAt": "2026-11-25T21:05:04.000Z",
      "expiresAt": "2026-11-26T21:05:04.000Z"
    },
    {
      "kind": "needs-you",
      "identity": "skilled-scratch/hello",
      "itemId": "20261125T211204Z-7c1e9a40",
      "botId": "hello",
      "runId": "20261125T211204Z-7c1e9a40",
      "state": "needs-you",
      "createdAt": "2026-11-25T21:12:04.000Z",
      "expiresAt": "2026-11-26T21:12:04.000Z"
    }
  ],
  "duplicateRoots": [],
  "notes": []
}
```

### Fields

"Today" in the producer column means the key ships now, read from `StatusReport`, `BotStatusRow`, `LastRun`, `ItemStatusRow` and `LaunchdPrint`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:42-114] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/launchctl-print.ts:30-39] The real payload is pretty-printed with two-space indent. [SOURCE: .skilled/bin/bots.cjs:386-388]

| Key | Type | Null | Format | Producer | Drawn by |
|-----|------|------|--------|----------|----------|
| `version` | integer | absent today, read as `1` | contract major, section 8 | packet 001 | not drawn, checked on read |
| `indexPath` | string | no | absolute path | today | not drawn |
| `builtAt` | string | yes, before the first build | ISO 8601 UTC | today | header index age, only when `updatedAt` is absent |
| `updatedAt` | string | yes, before the first build | ISO 8601 UTC, the last instant a build or a refresh wrote a row | packet 001, new | header `index 12s ago`, frames 1 to 26 |
| `stale` | boolean | no | | today, meaning narrowed by section 10 | header `stale <n>m` |
| `staleIdentities` | string array | no | `owner/name` | today | not drawn |
| `rows` | array of bot rows and item rows | no | tagged by `kind` | today | header bot count |
| `duplicateRoots` | array of `{identity, paths}` | no | | today | not drawn |
| `notes` | string array | no | free text | today | not drawn |

Bot row (`kind` is `bot`):

| Key | Type | Null | Format | Producer | Drawn by |
|-----|------|------|--------|----------|----------|
| `kind` | string | no | `bot` | today | counted by the header |
| `identity` | string | no | `owner/name` | today | not drawn |
| `botId` | string | no | `^[a-z0-9][a-z0-9-]*$` | today | not drawn |
| `state` | string | no | one of `retired`, `missing`, `unreadable`, `needs-reinstall`, `held`, `launchd-failed`, `run-folder-gone`, `unknown`, `never-run`, `ok` | today, packet 002 adds the `completed` switch as a state | not drawn |
| `flags` | string array | no | values of `state`, never empty | today | not drawn |
| `path`, `previousPath` | string | yes | absolute path | today | not drawn |
| `pathState` | string | yes | `present`, `missing`, `unreadable` | today | not drawn |
| `installed` | boolean | no | | today | not drawn |
| `labels` | string array | no | `com.skilled.bots.<owner>_2f<name>.<botId>.<n>` | today | not drawn |
| `launchd` | array of `{label, presence, state, runs, lastExitCode}` | no | `presence` is `loaded`, `not-loaded` or `unknown`, `runs` and `lastExitCode` may be the string `unknown`, `lastExitCode` may be null | today | not drawn |
| `reinstall` | string array | no | reason names | today | not drawn |
| `fix` | string | yes | a command line | today | not drawn |
| `heldBy` | string | yes | item id | today | not drawn |
| `lastRun` | object | yes, for a bot that never ran | | today | not drawn |
| `lastRun.runId`, `.dispatchedAt`, `.exitReason` | string | no | id, ISO 8601 UTC, reason name | today | not drawn |
| `lastRun.exitClass`, `.needsYouItemId` | string | yes | | today | not drawn |
| `lastRun.delivery` | array of `{channel, state}` | no | | today | not drawn |
| `lastRun.branch`, `.worktreePath` | string | yes | | packet 004 | not drawn [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:55] |

Item row (`kind` is `needs-you`): `kind`, `identity`, `itemId`, `botId`, `runId`, `state` (`needs-you` or `expired`), `createdAt`, `expiresAt`. All are non-null strings, the two times ISO 8601 UTC. None is drawn. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:90-99]

### Derived strings

| Drawn | From | Rule |
|-------|------|------|
| `4 bots` | `rows` | count the rows whose `kind` is `bot`, never `rows.length`, which is 7 here [SOURCE: spec.md:126] |
| `index 12s ago` | `updatedAt`, else `builtAt` | the age formatter. `never` when both are null |
| `stale 2m` at the header's right | `stale` and `updatedAt` | drawn only when `stale` is true, as `stale` and then the age formatter's output for `updatedAt` |
| `status failed` at the header's right | the last status read | drawn when the last read failed, with the last good count and age kept (frame 17) [SOURCE: 001-ux-and-component-map/design/mockups.md:1304] |

---

## 5. `bots activity --json`

### Sample

<!-- payload:activity -->
```json
{
  "version": 1,
  "groups": [
    {
      "id": "needs_you",
      "title": "Needs you",
      "rows": [
        {
          "botId": "hello",
          "identity": "skilled-scratch/hello",
          "state": "needs_you",
          "at": "2026-11-25T21:12:04.000Z",
          "actor": "ada",
          "runId": "20261125T211204Z-7c1e9a40",
          "schedule": null
        },
        {
          "botId": "digest",
          "identity": "skilled-scratch/hello",
          "state": "needs_you",
          "at": "2026-11-25T21:05:04.000Z",
          "actor": "ada",
          "runId": "20261125T210504Z-3f9d2b11",
          "schedule": null
        }
      ]
    },
    {
      "id": "working",
      "title": "Working",
      "rows": [
        {
          "botId": "nightly-report",
          "identity": "skilled-scratch/hello",
          "state": "working",
          "at": "2026-11-25T21:13:40.000Z",
          "actor": "ada",
          "runId": "20261125T211340Z-a4b8c2d0",
          "schedule": null
        }
      ]
    },
    {
      "id": "scheduled",
      "title": "Scheduled",
      "rows": [
        {
          "botId": "digest",
          "identity": "skilled-scratch/hello",
          "state": "scheduled",
          "at": "2026-11-26T00:15:00.000Z",
          "actor": "ada",
          "runId": null,
          "schedule": "every 6h"
        }
      ]
    },
    {
      "id": "done",
      "title": "Done",
      "rows": [
        {
          "botId": "hello",
          "identity": "skilled-scratch/hello",
          "state": "done",
          "at": "2026-11-25T21:02:04.000Z",
          "actor": "ada",
          "runId": "20261125T210204Z-0b6e5f72",
          "schedule": null
        }
      ]
    },
    {
      "id": "stopped",
      "title": "Stopped",
      "rows": [
        {
          "botId": "archive",
          "identity": "skilled-scratch/hello",
          "state": "stopped",
          "at": "2026-11-25T20:14:04.000Z",
          "actor": null,
          "runId": "20261125T201404Z-9d2c7e15",
          "schedule": null
        }
      ]
    },
    {
      "id": "failed",
      "title": "Failed",
      "rows": [
        {
          "botId": "nightly-report",
          "identity": "skilled-scratch/hello",
          "state": "failed",
          "at": "2026-11-25T21:10:04.000Z",
          "actor": "ada",
          "runId": "20261125T211004Z-5e1a8b39",
          "schedule": null
        }
      ]
    },
    {
      "id": "recurring",
      "title": "Recurring",
      "rows": [
        {
          "botId": "digest",
          "identity": "skilled-scratch/hello",
          "state": "recurring",
          "at": "2026-11-26T00:15:00.000Z",
          "actor": "ada",
          "runId": null,
          "schedule": "every 6h"
        }
      ]
    }
  ]
}
```

The empty payload is `{"version": 1, "groups": []}`, which draws frame 6.

### Fields

| Key | Type | Null | Format | Producer | Drawn by |
|-----|------|------|--------|----------|----------|
| `version` | integer | no | `1` | packet 001 | checked on read |
| `groups` | array | no | in the fixed order `needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed`, `recurring`, an empty group left out | packet 001 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:151] | pane title count `7 groups` |
| `groups[].id` | string | no | one of the seven ids | packet 001 | not drawn, selects the glyph with `state` |
| `groups[].title` | string | no | `Needs you`, `Working`, `Scheduled`, `Done`, `Stopped`, `Failed`, `Recurring` | packet 001, from OpenBot's titles | group heading line, frames 1, 7, 17 |
| `groups[].rows` | array | no, never empty | newest `at` first, and soonest first in `scheduled` and `recurring` | packet 001. `needs_you`, `done`, `stopped` and `failed` rows come from the index. `working`, `scheduled` and `recurring` rows have no index source today and need the sources in section 13.1 item 4 | pane title count `8 rows` |
| `botId` | string | no | bot id | packet 001 | row column 1, padded to 17, and detail `bot` |
| `identity` | string | no | `owner/name` | packet 001 | detail `identity` at 120 |
| `state` | string | no | equal to its group's `id` | packet 001 | row glyph and row column 2, detail `state` |
| `at` | string | no | ISO 8601 UTC. The event time on a past row, the next fire on a `scheduled` or `recurring` row, so it is in the future there | packet 001, a future `at` from the next-fire computation REQ-012 adds (section 13.1 item 4) | row column 3 and detail `at` |
| `actor` | string | yes, for a run recorded before packet 001 | an actor name | packet 001 | detail `actor` at 120, `-` when null |
| `runId` | string | yes, on `scheduled` and `recurring` rows, which have no run yet | run id | packet 001 | detail `runId` at 120, `-` when null |
| `schedule` | string | yes, on every row that does not come from an installed schedule | the start's `summary` phrase from section 7 | packet 002, through 001's row | row column 3 on a `recurring` row (`every 6h`) |

A state outside the seven draws `?` and the raw value as its label. [SOURCE: 001-ux-and-component-map/design/glyph-table.md:32] A group whose `id` the screen does not know is drawn in payload order under its own `title`.

### Derived strings

| Drawn | Rule |
|-------|------|
| `Activity · 7 groups · 8 rows` | `groups.length` and the sum of `rows.length` |
| `Needs you` | `title` verbatim |
| the glyph | from `state` through the glyph table [SOURCE: 001-ux-and-component-map/design/glyph-table.md:25-31] |
| `2m ago`, `12m ago`, `1h ago`, `4m ago` | the age formatter on `at` |
| `now` | every `working` row draws `now`, whatever its `at`, because the run is in flight |
| `in 3h` | the age formatter on a future `at`, on a `scheduled` row |
| `every 6h` | `schedule` verbatim on a `recurring` row, `at` when `schedule` is null |

Selection key: `ActivityKey` as `architecture.md` section 1 defines it. A row with a `runId` is keyed by `identity`, `botId` and `runId`, so the selection follows a run from Working to Done. A row whose `runId` is null is keyed by `identity`, `botId` and its group, one per bot per group.

---

## 6. `bots inbox --json`

### Sample

<!-- payload:inbox -->
```json
{
  "version": 1,
  "items": [
    {
      "id": "20261125T211204Z-7c1e9a40",
      "botId": "hello",
      "kind": null,
      "question": "Ship the release?",
      "state": "open",
      "at": "2026-11-25T21:12:04.000Z",
      "options": null,
      "createdAt": "2026-11-25T21:12:04.000Z",
      "expiresAt": "2026-11-26T21:12:04.000Z",
      "answer": null
    },
    {
      "id": "20261125T210504Z-3f9d2b11",
      "botId": "digest",
      "kind": null,
      "question": "Which channel?",
      "state": "open",
      "at": "2026-11-25T21:05:04.000Z",
      "options": ["email", "chat"],
      "createdAt": "2026-11-25T21:05:04.000Z",
      "expiresAt": "2026-11-26T21:05:04.000Z",
      "answer": null
    },
    {
      "id": "20261124T201404Z-c8f3a6e2",
      "botId": "archive",
      "kind": null,
      "question": "Delete the old runs?",
      "state": "expired",
      "at": "2026-11-24T20:14:04.000Z",
      "options": null,
      "createdAt": "2026-11-24T20:14:04.000Z",
      "expiresAt": "2026-11-25T20:14:04.000Z",
      "answer": null
    }
  ]
}
```

The empty payload is `{"version": 1, "items": []}`, which draws frame 10.

### Fields

The ten item keys are packet 001's. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153] The item file holds more (`runId`, `identity`, `evidence`, `prompt`, `specFolder`, `resumeRequestId`), and the inbox prints none of them. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29-47]

| Key | Type | Null | Format | Producer | Drawn by |
|-----|------|------|--------|----------|----------|
| `version` | integer | no | `1` | packet 001 | checked on read |
| `items` | array | no | open items newest first, then expired items newest first. The screen never asks for `--all` | packet 001 | pane title counts, banner |
| `id` | string | no | equal to the parked run's id | packet 001 | detail `id`, the overlay's captured id, the answer argv |
| `botId` | string | no | bot id, or a reserved sentinel such as `memory-proposals` after packet 005 | packet 001 | row column 1, detail `botId`, overlay title line |
| `kind` | string | yes, until packet 005 | `decision`, `memory-proposal`, `skill-proposal` | key packet 001, values packet 005 and 009 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:265] | detail `kind`, null drawn as `decision`, the absent-means-decision default |
| `question` | string | no | free text, sanitized | packet 001 | row column 4, overlay question line |
| `state` | string | no | `open`, `expired`, and `answered` only under `--all` | packet 001 | row glyph `!` when `open`, none when `expired`, row column 2, detail `state` |
| `at` | string | no | ISO 8601 UTC, equal to `createdAt` | packet 001 | row column 3 on an open item, detail `at`, overlay age |
| `options` | string array | yes | a list of strings | today in the item file, printed by packet 001 [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:109] | detail `options`, choice overlay rows, frame 24 |
| `createdAt` | string | no | ISO 8601 UTC | today in the item file | not drawn, `at` is drawn instead |
| `expiresAt` | string | no | ISO 8601 UTC, `createdAt` plus `expiryDays` days | today [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:145-147] | row column 3 on an expired item, detail `expiresAt` |
| `answer` | object | yes, until answered | `{text, answeredAt, by, scope}`, `scope` is `once` or `deny` | today `text` and `answeredAt`, packet 001 adds `by` and `scope` | not drawn, the screen lists no answered item |
| `grants` | object | absent until packet 006 | `{kind, action, rung, scope, grantedBy, grantedAt}` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:152] | packet 006 | the overlay's `grant kind <kind> · rung <rung>` line, frame 23, and the same line in the detail column, only when present |

### Derived strings

| Drawn | Rule |
|-------|------|
| `Inbox · 2 open · 1 expired` | counts of `state` |
| `! 2 pending approvals · Alt+2 → inbox` | the banner counts items whose `state` is `open`, `approval` when the count is 1, hidden at 0 [SOURCE: 001-ux-and-component-map/design/component-inventory.md:31] |
| `2m ago` on an open row | the age formatter on `at` |
| `1h ago` on an expired row | the age formatter on `expiresAt`, so an expired row says how long ago it closed. Its `at` is a day older and would draw `1d ago` |
| `Expired items stay listed and cannot be answered.` | drawn under the list when any item is `expired` |
| `options   none` | `options` null or empty draws `none`, a list draws its entries joined by `, ` |
| `1  email`, `2  chat` | `options` in order, numbered from 1, in the choice overlay |
| `hello · open · 2m ago` | the overlay's first line: `botId`, `state` and the row's age, frames 18 to 24 [SOURCE: 001-ux-and-component-map/design/mockups.md:1384] |
| `Ship the release?` | `question` verbatim, sanitized, in the overlay |
| `grant    kind send · rung kind` | `grants.kind` and `grants.rung`, drawn only when `grants` is present, frame 23 [SOURCE: 001-ux-and-component-map/design/mockups.md:1769] |

Selection key: `id`.

---

## 7. `bots routines --json`

### Sample

<!-- payload:routines -->
```json
{
  "version": 1,
  "routines": [
    {
      "botId": "digest",
      "what": "the morning digest",
      "starts": [
        { "kind": "cron", "expression": "15 */6 * * *", "summary": "every 6h" }
      ],
      "does": "tell",
      "until": "the digest is sent",
      "untilMetAt": null,
      "failureStreak": 0,
      "switch": "enabled"
    },
    {
      "botId": "nightly-report",
      "what": "the nightly report",
      "starts": [
        { "kind": "cron", "expression": "0 2 * * *", "summary": "daily 02:00" }
      ],
      "does": "act",
      "until": "the report is filed",
      "untilMetAt": null,
      "failureStreak": 1,
      "switch": "enabled"
    }
  ]
}
```

The empty payload is `{"version": 1, "routines": []}`, which draws frame 14.

### Fields

Packet 002 names seven parts and gives three of them no key. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:173] The keys below fix them.

| Key | Type | Null | Format | Producer | Drawn by |
|-----|------|------|--------|----------|----------|
| `version` | integer | no | `1` | packet 002 | checked on read |
| `routines` | array | no | sorted by `botId`, only bots with a `routine` block | packet 002 | pane title `2 routines` |
| `botId` | string | no | bot id | packet 002 | row first line, detail `botId` |
| `what` | string | no | free text | packet 002 | detail `what` at 120 |
| `starts` | array | no, exactly one entry in v1 | each is the parsed trigger, `{kind: "cron", expression}`, `{kind: "queue", name}`, `{kind: "git-hook"}` or `{kind: "manual"}`, plus `summary` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:29-33] | packet 002 | through `summary` |
| `starts[].summary` | string | yes, when the runtime cannot phrase the start | a short phrase in the machine's local time, such as `every 6h`, `daily 02:00`, `on queue <name>`, `on commit`, `by hand` | packet 002, new | row `starts every 6h`, detail `starts` |
| `does` | string | no | `act` or `tell` | packet 002 | row `does tell`, detail `does` |
| `until` | string | yes, for a routine with no outcome | free text, never executed | packet 002 | row `until "…"` in quotes, detail `until` bare, `-` when null |
| `untilMetAt` | string | yes, until `until_check` exits 0 | ISO 8601 UTC | packet 002 | detail `untilMetAt`, `-` when null |
| `failureStreak` | integer | no | 0 or more, counted from the newest record back to the first that is not a failed run | packet 002 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:167] | row `streak 0`, detail `streak` |
| `switch` | string | no | `enabled`, `paused`, `completed`, `disabled` or `fatigued`, the first that applies in the order `fatigued`, `disabled`, `completed`, `paused`, else `enabled` | packet 002 | row `state enabled`, detail `switch` |

`fatigued` is the `disabled` switch set by the ten-failure rule with `fatiguedAt` recorded, so the operator can tell a bot the runtime stopped from one they stopped. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:167]

### Derived strings

| Drawn | Rule |
|-------|------|
| `Routines · 2 routines` | `routines.length`, `routine` when it is 1 |
| `starts  every 6h · does tell · until "the digest is sent"` | `starts[0].summary`, else `starts[0].expression`, else `starts[0].kind`, then `does`, then `until` in double quotes. The `until` part is left out when `until` is null |
| `state   enabled · streak 0` | `switch`, then `failureStreak` |
| `untilMetAt -` | the fraction-free instant, `-` when null |

Selection key: `botId`.

---

## 8. VERSIONING AND UNKNOWN FIELDS

- The binary's contract number is this major. `bots-ui --version` prints `bots-ui <crate version> contract 1`, and the `ui` verb compares the last field with its own copy of the number.
- Every payload object carries `version`, an integer contract major. Version 1 is this file. `status` ships without it today, and the screen reads an absent `version` as `1`.
- Adding a key, or adding a value to an enum, is not a version change. The producer adds it here and to the sample in the same change.
- Removing a key, renaming one, changing its type or making a non-null key nullable bumps `version`. The screen knows one major. A payload with a higher `version` is a failed read whose status row line is `bots-ui: <verb> --json speaks version <n>, the screen reads version 1`. The rows from the last good read stay.
- The screen ignores every key it does not know. Its serde types never use `deny_unknown_fields`, and a missing optional key takes its default. So packet 004's `lastRun.branch` and packet 006's `grants` arrive without a screen change.
- An enum value the screen does not know is kept as `Unknown(raw)` and drawn as its raw text with the `?` glyph. It is never a failed read. [SOURCE: 001-ux-and-component-map/design/glyph-table.md:32]
- A runtime older than the verb answers `bots: unknown verb: <verb>` with exit 2. [SOURCE: .skilled/bin/bots.cjs:142] The screen treats it as a failed read like any other, so a screen built ahead of packet phases 001 and 002 shows the error state on Activity, Inbox and Routines and still draws its header.

---

## 9. A FAILED READ

What each exit means, from the code for `status` and `inbox`, and from packet 001's edge cases for `activity`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:229]

| Exit | When | Stderr shape | Source |
|------|------|--------------|--------|
| 0 | a good read | empty | [SOURCE: .skilled/bin/bots.cjs:386-391] |
| 0 | inbox read with an unreadable item file | one `bots: item <id> did not read` line per item, the good items still printed | [SOURCE: .skilled/bin/bots.cjs:472] |
| 1 | the status index cannot be opened, read or built | `bots: <reason>: <detail>` followed by the rebuild hint `run bots status --rebuild` | [SOURCE: .skilled/bin/bots.cjs:364-367] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:323] |
| 1 | the status modules failed to load | `bots: the status modules did not load: <message>` | [SOURCE: .skilled/bin/bots.cjs:352-354] |
| 1 | the needs-you folder cannot be listed | `bots: the needs-you folder could not be listed (<error>)` and then `open items may be hidden` | [SOURCE: .skilled/bin/bots.cjs:462-463] |
| 1 | an uncaught error | `bots: <message>` | [SOURCE: .skilled/bin/bots.cjs:541-546] |
| 2 | a usage error, an unknown verb or option included | `bots: <message>` and then the whole usage text | [SOURCE: .skilled/bin/bots.cjs:94-98] |
| 4 | the repository config or identity refuses | `bots: <reason>: <detail>`, or the identity-unknown sentence | [SOURCE: .skilled/bin/bots.cjs:208-214] [SOURCE: .skilled/bin/bots.cjs:356-360] [SOURCE: .skilled/bin/bots.cjs:452-455] |

How the screen draws them:

- **Exit 0 with stdout that parses.** The rows are replaced. When stderr is not empty, its first line goes to the status row, and the pane state stays `rows`.
- **Exit 0 with stdout that does not parse.** A failed read with the line `bots-ui: <verb> --json printed no payload: <parser message>`.
- **Any non-zero exit.** A failed read. The status row line is `bots: <verb> --json exited <code>: <first stderr line with a leading "bots: " removed>`, which is the line frame 8 draws. [SOURCE: 001-ux-and-component-map/design/mockups.md:625] Only the first line is kept, so the usage text after a usage error never reaches the screen. [SOURCE: 001-ux-and-component-map/design/component-inventory.md:61]
- **A child killed by the read timeout.** A failed read with the line `bots-ui: <verb> timed out after 10s`. The timeout and the kill are the architecture file's (R5).
- **A failed read on a pane with rows** keeps the rows and draws `stale <n>m` in the pane title. **A failed read with no rows** draws the line in the body. [SOURCE: 001-ux-and-component-map/design/component-inventory.md:51-57]

The frames' `index locked` line is the fixture's `fail-<verb>` text for every verb, not a runtime message for `inbox` or `routines`.

---

## 10. REFRESH ON READ

Decision A2: the runtime brings the status index up to date on every read the screen polls, the screen never rebuilds, and it draws no refresh key. Packet phase 001-activity-and-actor owns the runtime half.

**Why it is needed.** An existing index is never rebuilt by `status`: its run rows stay as they are, and only a stale identity's item rows are refreshed. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:363-366] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:335-338] So a run that finishes while the screen is open would never appear in Activity at a 5-second poll.

**Which verbs it touches.** Only two of the four read the index.

| Verb | Reads the index | What fresh means |
|------|-----------------|------------------|
| `status --json` | yes | the refresh below runs before the report is built |
| `activity --json` | yes [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:151] | the same refresh runs before the groups are built |
| `inbox --json` | no, it lists the item files on every call [SOURCE: .skilled/bin/bots.cjs:458-459] | fresh by construction, A2 holds with no change |
| `routines --json` | no, and must not, because it opens no SQLite index [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:216] | fresh by construction, it reads BOT.md, the routine state file and at most ten run records per bot |

**Why not a full rebuild per read.** Every build applies retention, which deletes run folders and closed needs-you item files past their bounds. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:16-20] A rebuild on each poll would make a read verb delete files every 5 seconds, from two verbs at once. That is a correctness objection, so it needs no timing to settle it. I did not time a rebuild, because running one against the live state root would apply that retention.

**The rule, the cheapest correct variant.** For each identity whose generation stamp is ahead of the generation the index consumed:

1. Read the stamp first, then list the identity's run records. A record written after the stamp read leaves the identity stale for the next poll and is never lost. The full build reads in the same order. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:681-683]
2. Index each record not yet in the index with `indexRunRecord`, which inserts or ignores by run id and so is safe to repeat. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:304-317]
3. Replace the identity's item rows with `refreshItemRows`, as status already does. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:337]
4. Record the stamp read in step 1 with `recordGeneration`, and write `updatedAt`. Steps 2 to 4 run in one transaction, so two verbs polling together cannot record a generation whose rows the other has not written. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:349-350]
5. Never apply retention and never rebuild on this path. A successful refresh writes nothing to stderr, or the screen would draw it in the status row (section 9).

An identity whose stamp did not move costs one stamp read, which status already pays. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:326-332] The runner writes the stamp each time it writes a terminal record. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:409-412] After the rule, `stale` is true only when a refresh could not complete, for example a locked index, and `bots status --rebuild` stays the one full rebuild.

One gap for packet 001 to close: `indexRunRecord` ignores a run id it already holds, so a record that is rewritten under the same id keeps its old summary. Whether the runner rewrites a record after its terminal write is not settled by what I read. If it does, step 2 needs an insert-or-replace for that case.

**The proof packet 001 owes.** With an index built, a run finishes, and the next `bots activity --json`, with no `--rebuild`, lists that run's row while `bots status --json` prints `"stale": false`. The criterion is in section 13.1.

---

## 11. THE ANSWER CALL

The screen writes through one verb, `bots answer`, and this file keeps no second copy of its argv or its refusal table. `005-answer-flow/design/state-machines.md` section 4 owns both: the argv `answer --scope <scope> --repo <repo> -- <item-id> <text>`, the exit codes, the refusal names and the class each one falls in. `architecture.md` section 1.8 owns the `Effect::Answer` the reducer returns, and section 2.3 owns the worker rule that runs it ahead of queued reads.

Two rules belong here because they decide what the screen reads next.

- A successful answer issues no read of its own. The row keeps its outcome word and the answered item stays drawn until the next 5-second poll's successful inbox read, because `bots inbox --json` lists no answered item and an immediate read would drop the item at once. `architecture.md` section 1.6 carries the mark and the inbox generation it was set at.
- The answer names the checkout the reads name. `--repo <repo>` is on the argv, so a write cannot land in a different repository from the one the screen draws.

---

## 12. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| Every payload is an object with a top-level `version`, and `routines` becomes `{"version", "routines"}` instead of a bare array | A bare array has no place for a version or a later sibling key, and the other three verbs are already objects. Packet 002's criteria test a bare array today, so section 13.2 changes them |
| An absent `version` reads as `1` | `status` ships without it, and a screen built today must read it |
| `updatedAt` on the status report, and the header ages it, not `builtAt` | With refresh on read `builtAt` stays at the last full build, so `index 9h ago` would be drawn over an index that is current. `builtAt` keeps its meaning |
| Packet 001 names a source for `working`, `scheduled` and `recurring` rows, and computes a next fire | The runner writes a record only at its terminal write and the installer never computes a next fire, so the index cannot hold an in-flight run or a future fire [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:409-412] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:93-94] |
| `schedule` on every activity row, a string or null | `every 6h` on a `recurring` row had no source key. The six row keys carry no period [SOURCE: research/fable-review-1.md:37]. A phrase rendered by the runtime keeps cron parsing out of the screen (A6) |
| A future `at` on `scheduled` and `recurring` rows, and no new key for `in 3h` | `at` already exists, and a row that has not run has no past event to report |
| A null `runId` on `scheduled` and `recurring` rows, a nullable `actor` on every row | A lined-up row has no run yet, and a record written before packet 001 has no actor [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:193] |
| `starts[]` is the parsed trigger plus `summary` | Packet 002 renders `starts[0]` into a trigger, so the trigger is the rendered start. `summary` is the one phrase the frames draw |
| `failureStreak`, an integer | Packet 002 says "failure streak" and names no key. The frame draws `streak` |
| `switch`, five values in a fixed precedence | Packet 002 says "switch state" and names no key or values. `fatigued` is its own value because a stopped-by-the-runtime bot needs a different action from a stopped-by-you bot |
| `kind` null draws `decision` | Packet 005 reads an absent `kind` as `decision` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:196] |
| An expired inbox row ages `expiresAt`, an open one ages `at` | The repository's expiry is whole days, so an expired item's `at` is at least a day old and frame 2's `1h ago` can only be the expiry. `at` stays `createdAt` as packet 001 defines it |
| A working row draws `now` | The run is in flight, and an age of its dispatch would contradict the header's own seconds |
| One age formatter, rounded down, `s`, `m`, `h`, `d` | The header draws `12s ago` and the rows draw minutes and hours, so one unit ladder serves both |
| Instants keep their fraction in the payload and lose it in a drawn cell | `toISOString` writes milliseconds, and the frames draw none |
| Run ids in the samples use the runtime's real shape | The mockups' `01JC7Q4M2X9V` is not a shape `newRunId` produces, and a runtime test compares against these samples |
| Refresh on read is incremental and never applies retention | A full build deletes files (section 10) |

---

## 13. EDITS THE OTHER DOCS NEED

The edits inside this phase were applied in commit cf6bb92a5ce. Line numbers are the pre-edit lines and are kept as a record. Sections 13.1 and 13.2 target packet phases 001-activity-and-actor and 002-routine-layer and are not applied yet.

Line numbers are from the tree at commit `69ecfd0b1f9`. Paths are relative to `specs/system-skilled-bots/003-openbot-parity-build/`. Every search string and every replacement is in its own fenced block, verbatim, so an Edit tool can apply it as written.

### 13.1 `001-activity-and-actor/` (the producer of `activity`, `inbox`, the `status` additions and the refresh)

**1. `spec.md:152`, REQ-002.** Replace the whole row with:

```text
| REQ-002 | `bots activity --json` prints one object `{"version": 1, "groups": [...]}`, each group carrying its `id`, its `title` and its `rows`, and each row carrying `botId`, `identity`, `state`, `at`, `actor`, `runId` and `schedule`. `state` is one of the seven group ids. `at` is an ISO 8601 UTC instant: the event time on a past row, the next fire on a `scheduled` or `recurring` row. `actor` is null for a run recorded before this phase. `runId` is null on a `scheduled` or `recurring` row. `schedule` is the start's `summary` from 002 on a row that comes from an installed schedule, and null otherwise. Rows run newest first, and soonest first in `scheduled` and `recurring`. The field table is `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 5 |
```

**2. `spec.md:153`, REQ-003.** Replace the whole row with:

```text
| REQ-003 | `bots inbox --json` prints one object `{"version": 1, "items": [...]}` holding the open and expired needs-you items, open first and each part newest first, and `bots inbox --json --all` adds the answered ones, so a reader sees the answer an item carries. Each item carries `id`, `botId`, `kind`, `question`, `state`, `at`, `options`, `createdAt`, `expiresAt` and `answer`, where `state` is `open`, `answered` or `expired`, `at` is the item's `createdAt`, `kind` is `null` until 005-memory writes a value, `options` is null or a list of strings, `answer` is null until answered, and every instant is ISO 8601 UTC. An unreadable item is left out and named on stderr as `bots: item <id> did not read`, with exit 0. The field table is `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 6 |
```

**3. `spec.md`, a new P0 row after line 156.** Insert:

```text
| REQ-011 | `bots status --json` and `bots activity --json` bring the status index up to date before they answer. For each identity whose generation stamp is ahead of the one the index consumed, the read reads the stamp, then indexes every run record not yet in the index through `indexRunRecord`, replaces the identity's item rows through `refreshItemRows`, records the stamp it read, and writes `updatedAt`, the last three in one transaction. The read never applies retention, never rebuilds the whole index and writes nothing to stderr when it succeeds. `bots status --json` also carries `version` and `updatedAt`. The rule is `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 10 |
```

**4. `spec.md`, a second new P0 row, after the REQ-011 row.** The index holds terminal run records and needs-you items only, so three of the seven groups have no index source today. The runner writes a run record only at its terminal write [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:409-412], and the installer computes no next fire: "The next fire time is never computed: no launchd surface reports it." [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:93-94] Insert:

```text
| REQ-012 | `bots activity` names the source of each group's rows. `needs_you`, `done`, `stopped` and `failed` come from the status index. `working` comes from a run in flight, read from the bot's held lease or the run's liveness evidence, never from the index, which holds terminal records only. `scheduled` comes from a queued run request not yet claimed, and from an installed cron schedule's next fire. `recurring` comes from each installed cron schedule. A next fire is computed from the cron expression in the machine's local time and written as an ISO 8601 UTC instant, because no launchd surface reports one |
```

**5. `spec.md`, a new Files to Change row after line 120.** Insert:

```text
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Modify | Refresh a stale identity's run and item rows on read with no retention, shared by `status` and `activity`, and add `version` and `updatedAt` to the report |
```

**6. `spec.md:109`, Out of Scope.** Replace the line with:

```text
- The routine layer's `recurring` rows - phase 002-routine-layer supplies the start summary their `schedule` carries. This phase builds the rows from the installed schedules, as REQ-012 says, and an empty `recurring` group is left out
```

**7. `spec.md:227`, Edge Cases.** Replace:

```text
`bots activity --json` prints `{"groups":[]}`
```

with:

```text
`bots activity --json` prints `{"version":1,"groups":[]}`
```

**8. `acceptance-criteria.md:55`, AC-002.** Replace:

```text
each row carries `botId`, `identity`, `state`, `at`, `actor` and `runId`
```

with:

```text
each row carries `botId`, `identity`, `state`, `at`, `actor`, `runId` and `schedule`
```

and replace:

```text
prints the six row keys
```

with:

```text
prints the seven row keys
```

**9. `acceptance-criteria.md`, two new rows after line 64.** Insert, renumbering if those ids are taken:

```text
| AC-012 | REQ-011 | Given an index already built and a run that completes after it, When `bots activity --json` runs with no `--rebuild`, Then that run's row is listed and `bots status --json` prints `"stale": false` and an `updatedAt` no older than the run's record | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts -t "refresh on read"` prints one passing test | Unmet | - |
| AC-013 | REQ-012 | Given a run in flight and an installed cron schedule, When `bots activity --json` runs, Then a `working` row names the run in flight and a `recurring` row carries a future `at` and a non-null `schedule` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts -t "row sources"` prints one passing test | Unmet | - |
```

**10. `tasks.md:75`, T033.** Append to the task line:

```text
 Also check that every key in `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/activity.json`, `inbox.json` and `status.json` appears in the real output with the same JSON type, so the screen's fixture and the runtime cannot drift.
```

### 13.2 `002-routine-layer/` (the producer of `routines` and the start summary)

**1. `spec.md:173`, REQ-007.** Replace the whole row with:

```text
| REQ-007 | `bots routines [--json]` lists every bot in the checkout that carries a routine block and exits 0. `--json` prints one object `{"version": 1, "routines": [...]}` sorted by `botId`, each row carrying `botId`, `what`, `starts` (each start's parsed trigger plus `summary`, a short local-time phrase such as `every 6h` or `daily 02:00`), `does` (`act` or `tell`), `until` (string or null), `untilMetAt` (ISO 8601 UTC or null), `failureStreak` (an integer, 0 or more) and `switch` (`enabled`, `paused`, `completed`, `disabled` or `fatigued`, the first that applies in the order `fatigued`, `disabled`, `completed`, `paused`). The field table is `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 7 |
```

**2. `spec.md:125`, the `routine.ts` row.** Replace its description cell with:

```text
The block: `parseRoutine`, `renderTrigger`, `describeStart` (the `summary` phrase that `bots routines --json` prints and an activity `recurring` or `scheduled` row carries as `schedule`), `checkRoutineFloor`, `routineDelivery`, the `until`/`until_check` pairing rule and the refusal names.
```

**3. `acceptance-criteria.md:62`, AC-007.** Replace:

```text
jq -e 'length == 2 and (.[0].botId != null)'
```

with:

```text
jq -e '.version == 1 and (.routines | length == 2) and (.routines[0].botId != null)'
```

**4. `tasks.md:106`, T031.** Replace:

```text
jq -e 'length == 2 and (.[0].botId != null) and (.[0].untilMetAt == null)'
```

with:

```text
jq -e '(.routines | length == 2) and (.routines[0].botId != null) and (.routines[0].untilMetAt == null)'
```

and append to the task line:

```text
 Also check that every key in `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/routines.json` appears in the real output with the same JSON type.
```

### 13.3 `003-terminal-screen/002-architecture-and-contracts/`

**1. `tasks.md:60`, T010.** Replace:

```text
with the payloads phases 001 and 002 of the parent build ship
```

with:

```text
by printing the files in `$CRATE/tests/fixtures/payloads/`, copied from `design/payloads/`
```

and replace:

```text
routines --json | jq -e 'type == "array"'
```

with:

```text
routines --json | jq -e '.routines | type == "array"'
```

**2. `plan.md:182`.** Replace:

```text
Every payload sits inline in the script, one branch per verb, so a phase that adds a key greps the script for it rather than a sibling file.
```

with:

```text
Every payload is a file under `tests/fixtures/payloads/`, copied from `design/payloads/`, and the script prints the file for its verb, so the crate and the runtime tests read the same samples.
```

### 13.4 `003-terminal-screen/spec.md`

**1. Line 184.** Replace:

```text
`routines --json` as an array
```

with:

```text
`routines --json` with its `routines` array, each payload under a top-level `version`
```

### 13.5 `003-terminal-screen/003-shell-and-navigation/spec.md`

**1. Line 136, REQ-013.** Replace:

```text
the index age from `builtAt`
```

with:

```text
the index age from `updatedAt`, or from `builtAt` when `updatedAt` is absent
```

### 13.6 `003-terminal-screen/001-ux-and-component-map/design/mockups.md`

The frames disagree with each other in four places and with the runtime in three, so no single data set produces them as drawn. These edits make frames 1 to 3 the rendering of the samples.

1. **Every banner line.** Replace each `! 1 pending approval · Alt+2 → inbox` with `! 2 pending approvals · Alt+2 → inbox` (22 lines, from line 107 to line 1368). Frame 2 already counts two open items, and the banner reads the inbox. [SOURCE: 001-ux-and-component-map/design/mockups.md:184]
2. **Lines 90 to 106, frame 1 at 80x24.** Replace the 17 body lines with the block below. The added row is digest's open item, which frames 2 and 24 draw and frame 1 left out.

```text
Activity · 7 groups · 8 rows

Needs you
  ! hello            needs_you   2m ago
  ! digest           needs_you   9m ago
Working
  · nightly-report   working     now
Scheduled
  ○ digest           scheduled   in 3h
Done
  ✓ hello            done        12m ago
Stopped
  – archive          stopped     1h ago
Failed
  ✗ nightly-report   failed      4m ago
Recurring
  ↻ digest           recurring   every 6h
```

3. **Lines 119 to 135, frame 1 at 120x40.** Replace the 17 lines with the block below. It also restores the `Done` row and the `Stopped` heading, which lines 128 and 129 draw blank, and it uses the real run id.

```text
Activity · 7 groups · 8 rows                                            │Detail
                                                                        │
Needs you                                                               │bot       hello
  ! hello            needs_you   2m ago                                 │identity  skilled-scratch/hello
  ! digest           needs_you   9m ago                                 │state     needs_you
Working                                                                 │at        2026-11-25T21:12:04Z
  · nightly-report   working     now                                    │actor     ada
Scheduled                                                               │runId     20261125T211204Z-7c1e9a40
  ○ digest           scheduled   in 3h                                  │
Done                                                                    │
  ✓ hello            done        12m ago                                │
Stopped                                                                 │
  – archive          stopped     1h ago                                 │
Failed                                                                  │
  ✗ nightly-report   failed      4m ago                                 │
Recurring                                                               │
  ↻ digest           recurring   every 6h                               │
```

4. **Line 197, frame 2 at 120x40.** Replace `│id        hello` with `│id        20261125T211204Z-7c1e9a40`. An item id is its run id. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:103]
5. **Line 199, frame 2 at 120x40.** Replace `│kind      send` with `│kind      decision`. `send` is a grant kind, and the frame's item carries no grant. [SOURCE: 001-ux-and-component-map/design/mockups.md:2087]
6. **Line 250, frame 3 at 80x24, and line 279, frame 3 at 120x40.** On nightly-report's state line, replace `streak 0` with `streak 1`. Its last finished run failed 4 minutes ago (frame 1), so the streak is one. At line 279 only the left-hand `streak 0` changes, and the detail column's `streak    0` is digest's and stays.
7. **Frame 17, lines 1306 to 1322 at 80x24 and lines 1335 to 1351 at 120x40.** Apply the same bodies as items 2 and 3. Frame 17 draws the same rows as frame 1 and carries the same missing row, blank lines and run id.

### 13.7 Left for other files

- The answer contract (argv with `--`, refusal classes, the race with a refresh) is R6. Section 11 now points at `005-answer-flow/design/state-machines.md` section 4 for the argv and the refusal table rather than keeping a second copy, so a change to either is made there first.
- The selection keys above are stated per payload. The `State` fields that hold them belong to `architecture.md` (R1, R10).
