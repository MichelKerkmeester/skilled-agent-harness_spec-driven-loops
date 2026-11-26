---
title: "Design: record schemas of phase 5, memory"
description: "Every field of every record this phase owns or extends: the two memory files and their entry line, the remember list payload, the four needs-you item keys, the memory definition key and the remember line grammar, each with its type, null rule, absent-key default and version rule."
trigger_phrases:
  - "memory entry line schema"
  - "remember list payload"
  - "memory proposal item keys"
  - "remember line grammar"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Record schemas of phase 5

This note writes down every field this phase owns or extends, so a builder reads one table per record and makes no choice. The packet-level contracts own the shapes that more than one phase writes, and this note cites them rather than copying them:

| Shape | Owner file | Section |
|-------|------------|---------|
| The memory entry line | [`../contracts/records.md`](../../contracts/records.md) | 7 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "7. MEMORY ENTRY LINE"] |
| The `remember --list --json` payload | [`../contracts/cli-json.md`](../../contracts/cli-json.md) | 3.2 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md, section "3.2 `bots remember --list [--bot <id>] --json`"] |
| The needs-you item and its closed key list | [`../contracts/records.md`](../../contracts/records.md) | 1 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "1. NEEDS-YOU ITEM"] |
| The memory prompt block | [`../contracts/prompt-sections.md`](../../contracts/prompt-sections.md) | 1.5 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md, section "1.5 Memory"] |
| The refusal names and their exits | [`../contracts/refusals.md`](../../contracts/refusals.md) | 3.4 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.4 Phase 005, memory"] |

What this note adds is the part the contracts leave to the phase: the exact values this phase writes into those shapes, the grammar of the line a bot prints to propose a fact, and the version rule for each.

---

## 1. THE TWO FILES

| Property | Shared file | Per-bot file |
|----------|-------------|--------------|
| Path | `<stateRoot>/memory/shared.md` | `<stateRoot>/<identityKey>/memory/<botId>.md` |
| Folder mode | 0700 | 0700 |
| File mode | 0600 | 0600 |
| Created by | The first append, never a read | The first append, never a read |
| Read by | `bots remember --list` with no `--bot`, and every run whose definition reads `memory: true` | `bots remember --list --bot <id>`, and every run of that bot whose definition reads `memory: true` |
| Written by | `bots remember`, and `bots answer confirm` when `proposalBotId` is the shared scope | `bots remember --bot <id>`, and `bots answer confirm` for that bot |
| `schemaVersion` | None | None |
| Path helper | `sharedMemoryFile(stateRoot)`, declared in `state-root.ts` and re-exported by `memory.ts` | `botMemoryFile(stateRoot, identity, botId)`, declared in `memory.ts` |

The folder modes and the file modes are the ones the state root already gives its own folders and the ones the packet's tree records. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md, section "2.1 The user state root"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md, section "2.1 The user state root"] The state root's folder mode is 0700 [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46].

**Why no `schemaVersion`.** The packet's rule is that every new state file carries `schemaVersion: 1`, and the memory files are its one stated exception. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"] A version line would either reach the prompt as a fact or need a second parser rule, and a later grammar change ships a new delimiter instead. A line in the old form then reads as skipped and counted, never as a wrong fact.

**The identity key.** `<identityKey>` is `encodeURIComponent(identity.toLowerCase())`, the folder the state root already uses for every per-identity file. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117]

---

## 2. THE ENTRY LINE

One entry is one line with five fields. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "7. MEMORY ENTRY LINE"]

```text
- <type> | <YYYY-MM-DD> | <actor> | <source> | <text>
```

| Field | Type | Null | Format | Written by |
|-------|------|------|--------|------------|
| `type` | string, one of four | no | `user`, `general`, `feedback`, `reference` | `bots remember --type`, or `general` when the flag is absent, or the type a `[REMEMBER]` line names |
| `date` | string | no | `YYYY-MM-DD`, the UTC date of the append, from `toISOString().slice(0, 10)` | The append |
| `actor` | string | no | An actor name. It holds no `\|` and no newline | `--as`, else the OS user, else the operator who confirmed a proposal |
| `source` | string | no | `bots remember`, or `bot:<botId> (run <runId>)` | The verb, or the review settle |
| `text` | string | no | At most 400 characters, every whitespace run collapsed to one space | The verb's argument, or `proposalFact` |

### 2.1 The split rule

The parser splits the line on the first four occurrences of the three-character delimiter ` | `, a space, a pipe and a space. Everything after the fourth delimiter is the text, so a `|` inside the text needs no escape and no quoting rule. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "7. MEMORY ENTRY LINE"]

| Input line | Fields the parser reads |
|------------|-------------------------|
| `- general \| 2026-11-25 \| ada \| bots remember \| the sales sheet is Q3` | type `general`, date `2026-11-25`, actor `ada`, source `bots remember`, text `the sales sheet is Q3` |
| `- general \| 2026-11-25 \| ada \| bots remember \| the sales sheet is Q3 \| not Q2` | the same five, text `the sales sheet is Q3 \| not Q2` |
| `- user \| 2026-11-25 \| ada \| bot:hello (run 20261125T210204Z-0b6e5f72) \| Prefers ISO dates.` | type `user`, source `bot:hello (run 20261125T210204Z-0b6e5f72)`, text `Prefers ISO dates.` |

A line that does not begin with `- ` is skipped. A line that splits into fewer than five fields is skipped. A line whose `type` is not one of the four is skipped. A line whose `date` is not `YYYY-MM-DD` is skipped. A skipped line is counted and never printed, and the count is the payload's `skippedLines`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md, section "3.2 `bots remember --list [--bot <id>] --json`"]

### 2.2 The collapse rule

Every whitespace run in the text becomes one space before the line is written, so a newline in a fact can never split one entry into two lines. The rule is OpenGhost's `clean` helper, which the reference applies to every fact it stores. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:17] The collapse applies to the text only. The actor and the source are checked instead of collapsed, because a `|` or a newline in either would move a field boundary.

| Input text | Stored text |
|------------|-------------|
| `the sales sheet is Q3\nnot Q2` | `the sales sheet is Q3 not Q2` |
| `Prefers   ISO\t dates.` | `Prefers ISO dates.` |
| `  leading and trailing  ` | `leading and trailing` |

### 2.3 The index rule

An entry's index is its 1-based position in file order. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "7. MEMORY ENTRY LINE"] A forget removes one line and every later entry's index shifts down by one, so an index names an entry only for the read that produced it. `--forget` therefore takes the index the operator just saw in `--list`, and a second `--forget` in the same breath names a different entry.

### 2.4 The bounds

| Bound | Value | Unit | Enforced at | On overflow |
|-------|-------|------|-------------|-------------|
| Entries per file | 60 | lines that parse | The append, before the write | `memory-full`, exit 4 |
| Bytes per file | 3,600 | UTF-8 bytes of the whole file | The append, before the write | `memory-full`, exit 4 |
| Characters per text | 400 | UTF-16 code units | `bots.cjs` on the argument, and the review claim on a fact | `memory-entry-too-long`, exit 2, or `review-answer-invalid` |

The three numbers are the phase's own and the packet's budget table repeats them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md, section "4.2 The table"] The byte bound is measured on the file as it would be after the append, so a file at 3,599 bytes refuses a 40-byte line and accepts a 1-byte one. A refused append leaves the file byte for byte unchanged.

---

## 3. THE `remember --list --json` PAYLOAD

The payload is one object with seven keys. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md, section "3.2 `bots remember --list [--bot <id>] --json`"]

| Key | Type | Null | Format | Source |
|-----|------|------|--------|--------|
| `version` | integer | no | `1` | The packet's `--json` rule |
| `botId` | string | yes, the shared file | The `--bot` value, echoed | The verb's argument |
| `path` | string | no | The absolute path of the file read, printed even when the file is absent | `sharedMemoryFile` or `botMemoryFile` |
| `entries` | array | no | File order, oldest first | The parser |
| `entries[].index` | integer | no | 1-based position in file order | The parser |
| `entries[].type` | string | no | One of the four | The line |
| `entries[].date` | string | no | `YYYY-MM-DD` | The line |
| `entries[].actor` | string | no | The actor name | The line |
| `entries[].source` | string | no | `bots remember` or `bot:<botId> (run <runId>)` | The line |
| `entries[].text` | string | no | The collapsed text, verbatim and unescaped | The line |
| `entryCount` | integer | no | `entries.length` | Derived |
| `byteCount` | integer | no | The file's size in bytes, `0` for an absent file | `statSync` |
| `skippedLines` | integer | no | Lines that did not parse | The parser |

The empty shape is `{"version": 1, "botId": null, "path": "<path>", "entries": [], "entryCount": 0, "byteCount": 0, "skippedLines": 0}`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md, section "3.2 `bots remember --list [--bot <id>] --json`"]

Two rules a builder must not improvise. The text is printed as stored, so the escape form of the prompt block never reaches this payload. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md, section "3. THE ESCAPE FORM"] And `byteCount` is the file's real size, not the sum of the entry lengths, so a torn line counts toward it.

Golden: [`fixtures/remember-list.json`](fixtures/remember-list.json) for the shared file and [`fixtures/remember-list-bot.json`](fixtures/remember-list-bot.json) for a per-bot file.

---

## 4. THE NEEDS-YOU ITEM KEYS THIS PHASE ADDS

The item's key list is closed, so every key below enters `ITEM_KEYS` and `validateNeedsYouItem` in the same change as its writer. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "1. NEEDS-YOU ITEM"] 001 lands `kind` as a key with no value rule. This phase gives `kind` its values and adds three keys.

| Key | Type | Null | Absent reads as | Written by |
|-----|------|------|-----------------|------------|
| `kind` | string, one of `decision`, `memory-proposal`, `skill-proposal` | yes | `decision` | Every item writer. This phase writes `memory-proposal` |
| `proposalType` | string, one of the four entry types | yes, on every item whose `kind` is not `memory-proposal` | `null` | The proposal branch in `runner.ts` |
| `proposalFact` | string, at most 400 characters | yes, as `proposalType` | `null` | The proposal branch in `runner.ts` |
| `proposalBotId` | string, a bot id | yes, as `proposalType` | `null` | The proposal branch in `runner.ts` |

### 4.1 The values a `memory-proposal` item carries

| Key | Value |
|-----|-------|
| `id` | The proposing run's id, because the item's id equals its `runId` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:103-104]. No other item can already hold that id when this branch writes. Every run, a resumed one included, takes a fresh id from `newRunId` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:719], and a run that parks a question writes no proposal item, by the precedence rule in section 6. So this branch reads no existing item's `kind` before it writes. 009's `bots skill propose` verb writes an item for a run that has already finished, so that verb does read the existing item's `kind` first and refuses `review-already-exists` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-005] |
| `runId` | The proposing run's id |
| `botId` | The reserved sentinel `memory-proposals` |
| `identity` | The proposing run's identity |
| `question` | `Remember this fact for <proposalBotId>: <proposalFact>` |
| `options` | `["confirm", "reject"]` |
| `createdAt` | The instant the item is written |
| `expiresAt` | `createdAt` plus `needsYou.expiryDays` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:145-147] |
| `evidence` | The proposing run's folder, one element |
| `prompt` | The exact prompt the proposing run was dispatched with |
| `specFolder` | The proposing run's spec folder, or `null` |
| `answer` | `null` until answered |
| `resumeRequestId` | `null` until step 16 of the answer seam writes the derived id |
| `kind` | `memory-proposal` |
| `proposalType` | The type the `[REMEMBER]` line named |
| `proposalFact` | The fact, collapsed and at most 400 characters |
| `proposalBotId` | The bot the fact is for |

The question repeats the fact on purpose. `bots inbox`, the delivery notice and the screen all print the question and none of them prints `proposalFact`, so a question without the fact would ask the operator to approve something they cannot see. The fact is checked for secret literals before the item is written, so the repetition adds no exposure.

`grants` is absent. 006 owns that key and adds it to this writer, and `validateNeedsYouItem` refuses a key it does not know until 006 lands it. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:97-98]

### 4.2 The two reading rules for `kind`

`bots inbox --json` prints the stored value, so a stored `null` or an absent key prints `null` and the screen draws it as `decision`. Every runtime filter reads `null` and absent as `decision`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "1. NEEDS-YOU ITEM"]

The two filters this phase changes are `holdForBot` and `itemAwaitingResume`. Both skip every item whose `kind` is not `decision`, so a review item holds no bot and a later review kind needs no second filter. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE", row 10]

### 4.3 The sentinel

`memory-proposals` enters `RESERVED_BOT_IDS`, so no definition can take it. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/label.ts:28] The sentinel is not what keeps the hold off, the `kind` filter is. 009 keeps `skill-proposals` beside it, which is the packet's decision D1. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md, D1]

---

## 5. THE `memory` DEFINITION KEY

| Property | Value |
|----------|-------|
| Key | `memory` |
| Type | boolean |
| Default | `true` |
| Absent reads as | `true` |
| Refusal | `memory-invalid` when the value is not a boolean |
| Effect of `false` | Neither file's block reaches that bot's prompt. The files are still written and still listed |

The key enters `FRONTMATTER_KEYS` in `definition.ts`, which is the closed list a definition's frontmatter is checked against. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92] The template gains a commented line so an author sees the key without having to read the parser.

---

## 6. THE `[REMEMBER]` LINE

A bot proposes a fact by printing one line. The line is the phase's own grammar and no contract fixes it.

```text
[REMEMBER] <type> <fact>
```

| Part | Rule |
|------|------|
| Marker | The literal `[REMEMBER] `, one space after the bracket |
| Type | One of `user`, `general`, `feedback`, `reference`, followed by one space |
| Fact | The rest of the line, trimmed, collapsed and at most 400 characters |

| Input line | Result |
|------------|--------|
| `[REMEMBER] user Prefers ISO dates.` | A proposal with `proposalType` `user` and `proposalFact` `Prefers ISO dates.` |
| `[REMEMBER] Prefers ISO dates.` | No item. The run records `remember-type-invalid` |
| `[REMEMBER] maybe Prefers ISO dates.` | No item. The run records `remember-type-invalid` |
| `[REMEMBER] user ` | No item. The run records `remember-type-invalid` |
| `[REMEMBER] user Prefers ISO dates.` twice | One item, from the first line. A second line is ignored |
| `[REMEMBER] user ` followed by 401 characters | No item. The run records `remember-fact-too-long` |

The type is never guessed. A line that names no type, or names one outside the four, is refused `remember-type-invalid` rather than defaulted to `general`, because a guessed type is a wrong fact about where the fact came from. The refusal is a post-run cause: the child already ran, so the run stays `completed` and no item is written. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.4 Phase 005, memory"]

**An over-long fact.** A fact over 400 characters is refused `remember-fact-too-long` on the same terms: no item, the run stays `completed`, and the cause is recorded. The alternative is to cut the fact to 400 characters, and a cut fact is a wrong fact that reads as a whole one, so the line is reported and dropped. The bound is the same 400 characters `appendMemoryEntry` enforces, so a fact that passes here cannot fail the append on length.

**Precedence.** A `[NEEDS-DECISION]` line in the same answer outranks a `[REMEMBER]` line. The run parks and no proposal item is written, because a parked run has not finished and its fact may be about work it did not do. A `[REMEMBER]` line in a failed run writes no item for the same reason.

---

## 7. VERSION RULES

| Record | Version key | When it moves | What an older runtime does |
|--------|-------------|---------------|----------------------------|
| The two memory files | None | A grammar change ships a new delimiter | A line in the old form reads as skipped and counted |
| The `remember --list --json` payload | `version`, integer `1` | A removed, renamed or retyped key bumps it | A reader ignores a key it does not know and reads an absent `version` as `1` |
| The needs-you item | None, its key list is the version | A new key is a new shape | A runtime before this phase refuses an item carrying `proposalType`, `proposalFact` or `proposalBotId` as `unknown-key` |
| The `memory` definition key | None | Not applicable | An older runtime refuses the definition as `unknown-key` |

The item's revert step is the packet's: remove each `memory-proposal` item file after appending any fact still wanted by hand, then strip the three keys from every other item. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"]

---

## 8. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The entry line is the contract's five-field form, split on the first four delimiters | The research found five named fields and no serialization, and the phase's own test list names a line whose text holds a pipe [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:117] |
| The text collapses whitespace and the actor and source are checked instead | A newline in a fact would split one entry into two lines, and a `\|` in the actor or the source would move a field boundary |
| A line whose type or date does not parse is skipped and counted, never refused | A hand-edited file must not lose the entries around the bad line |
| The proposal item's question repeats the fact | No surface prints `proposalFact`, so a question without the fact asks the operator to approve something they cannot see |
| The proposal item's `prompt` is the proposing run's prompt | The key is required and non-empty, and the proposing run's prompt is the only true value for it |
| `[REMEMBER]` names its own type and a line naming none is refused | A guessed type is a wrong fact about the fact's origin, which is the one thing the type records |
| A second `[REMEMBER]` line in one answer is ignored | One run proposes one fact, and two items from one run would share an id |
