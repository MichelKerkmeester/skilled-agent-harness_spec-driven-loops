---
title: "Contract: The --json output of every bots verb"
description: "One rule for every bots verb that prints JSON, one row per verb with its envelope key, empty shape and field table location, the field tables for the verbs the screen does not read and the four state vocabularies that share one key name."
trigger_phrases:
  - "bots json envelope"
  - "chat transcript json"
  - "remember list json"
  - "channel list json"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The `--json` output of every `bots` verb

## 1. THE RULE

1. Every `--json` verb prints one JSON object with a top-level integer `version`. Version 1 is this file and the screen contract. A bare array is never a payload, because it has no place for a version or a later sibling key. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:740]
2. On a successful read stdout carries that one document and nothing else. Every human line, a progress note or a warning, goes to stderr. `status --json` already routes its info lines this way. [SOURCE: .skilled/bin/bots.cjs:376] [SOURCE: .skilled/bin/bots.cjs:386-388]
3. A non-zero exit prints nothing on stdout. Its reason is the first stderr line, in the `bots: <reason>: <detail>` form the exit table of the screen contract lists. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:671-680]
4. Instants are ISO 8601 UTC with a `Z`, as `toISOString` writes them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:71]
5. A reader ignores keys it does not know and reads an absent `version` as `1`. How a version moves is `versioning.md` rule 5.

D2 in `decisions.md` records this rule as taken for the verbs outside the screen.

## 2. ONE ROW PER VERB

| Verb | Envelope key | Empty shape | Field table | Owner |
|------|--------------|-------------|-------------|-------|
| `bots status --json` | `rows`, beside the report's other top-level keys | the report with no rows, as the screen contract's status table fixes it | screen contract section 4 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:98] | today, `version` and `updatedAt` from 001 |
| `bots activity --json` | `groups` | `{"version": 1, "groups": []}` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:457] | screen contract section 5 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:330] | 001 |
| `bots inbox --json [--all]` | `items` | `{"version": 1, "items": []}` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:543] | screen contract section 6 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:494] | 001 |
| `bots routines --json` | `routines` | `{"version": 1, "routines": []}` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:621] | screen contract section 7 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:584] | 002 |
| `bots chat <id> --transcript --json` | `messages` | `{"version": 1, "conversationId": "<id>", "messages": []}` | section 3.1 below | 010 |
| `bots remember --list [--bot <id>] --json` | `entries` | `{"version": 1, "botId": null, "path": "<path>", "entries": [], "entryCount": 0, "byteCount": 0, "skippedLines": 0}` | section 3.2 below | 005 |
| `bots channel list --json` | `channels` | `{"version": 1, "channels": []}` | section 3.3 below | 011 |

The four screen verbs are fixed in the screen contract and this file copies nothing from it. A change to one of them is a change to that file first. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:15]

No other verb takes `--json` in any phase. `bots secret list` prints names and metadata as text only. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:148] A phase that gives a verb `--json` adds its row here in the same change.

## 3. FIELD TABLES FOR THE VERBS THE SCREEN DOES NOT READ

### 3.1 `bots chat <id> --transcript --json`

The messages in file order, each one line of the conversation file printed as stored. The torn-line report goes to stderr. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:153] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:157]

| Key | Type | Null | Format |
|-----|------|------|--------|
| `version` | integer | no | `1` |
| `conversationId` | string | no | the conversation the verb read |
| `messages` | array | no | file order, oldest first. Each entry is the nine-key message of `records.md` section 10 |

A human message with no later bot message is unanswered. The state is derived by the reader and never printed as a key. A missing conversation file prints the empty shape and creates nothing.

Golden: `fixtures/chat-transcript.json`.

### 3.2 `bots remember --list [--bot <id>] --json`

One file, the shared file without `--bot` and the bot's file with it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:149]

| Key | Type | Null | Format |
|-----|------|------|--------|
| `version` | integer | no | `1` |
| `botId` | string | yes, the shared file | the `--bot` value |
| `path` | string | no | absolute path of the file read, printed even when the file is absent |
| `entries` | array | no | file order. Each entry is `{index, type, date, actor, source, text}`, `index` a 1-based integer and the rest strings in the `records.md` section 7 formats |
| `entryCount` | integer | no | `entries.length`, against the 60-entry bound |
| `byteCount` | integer | no | the file's size in bytes, against the 3,600-byte bound |
| `skippedLines` | integer | no | lines that did not parse, counted and not printed [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:220] |

Golden: `fixtures/remember-list.json`.

### 3.3 `bots channel list --json`

Every channel `channels/config.json` names, sorted by name. A channel the file does not name is not printed. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:206] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:210]

| Key | Type | Null | Format |
|-----|------|------|--------|
| `version` | integer | no | `1` |
| `channels` | array | no | sorted by `name` |
| `channels[].name` | string | no | the channel name |
| `channels[].enabled` | boolean | no | from the config entry |
| `channels[].secret` | string | no | the secret name, never a value |
| `channels[].linkedChats` | integer | no | links in `links.json` for that channel |
| `channels[].queueDepth` | integer | no | queue entries for that channel whose `state` is `queued` or `sending` |

Golden: `fixtures/channel-list.json`.

## 4. FOUR VOCABULARIES UNDER ONE KEY NAME

`state` means four different things across the payloads. A reader resolves it by the payload and never by the value alone.

| Where | Values | Source |
|-------|--------|--------|
| `activity` row `state` | the seven group ids: `needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed`, `recurring` | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:152] |
| `inbox` item `state` | `open`, `answered`, `expired` | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153] |
| `status` bot row `state` | the bot row values, plus `completed` from 002 | screen contract section 4, bot row table |
| `status` item row `state` | the item row values | screen contract section 4, item row line |

`needs_you` with an underscore is an activity group id. The status item row's own value is spelled with a hyphen. They are two values, never one spelled two ways.
