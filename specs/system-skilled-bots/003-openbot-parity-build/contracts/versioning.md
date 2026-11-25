---
title: "Contract: Record and payload versioning"
description: "The rules for when a record or a --json payload changes its version, why the needs-you item carries none and, for each phase that adds a closed-list key, what an older runtime does with a newer record and the manual step a revert needs."
trigger_phrases:
  - "record versioning rules"
  - "schemaVersion rule"
  - "revert newer needs-you item"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Record and payload versioning

## 1. THE RULES

1. **An added key keeps the version.** A reader takes the absent key as the default `records.md` names for it. The run record already works this way: its validator checks its groups and named fields and keeps any other key. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:237-245]
2. **A removed, renamed or retyped key bumps the version.** So does a non-null key becoming nullable. A reader that meets a higher version than it knows refuses the record by name, the way the run record refuses `record-schema-unsupported` and the request `request-schema-unsupported`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:239] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:192]
3. **Every new state file carries `schemaVersion: 1`.** That covers the routine state file, the secrets index, `proposal.json`, every conversation line, `channels/config.json`, `links.json`, `approvals.json`, a queue entry, a seen record and `operators.json`. The memory files are the one exception, and `records.md` section 7 states why.
4. **The needs-you item gains no version key.** Its key list is closed and every runtime before this packet refuses a key it does not know. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:97-98] A `schemaVersion` key would itself be such a key, so adding it would make every item written after the change unreadable to every older runtime, not only the items that use a new field. The item's shape is versioned by its key list instead, and the table in section 2 says what each addition costs.
5. **A `--json` payload follows the same rules with `version`.** Adding a key or an enum value is not a change. Removing, renaming or retyping one bumps `version`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:658-660]

## 2. AN OLDER RUNTIME MEETS A NEWER RECORD

Two records hold a closed key list: the needs-you item and the request record. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51-65] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:80-94] A runtime built before a phase refuses an item or request that holds that phase's key, and what follows is fixed by today's code:

- **A refused item** is listed as unreadable. `bots inbox` prints `bots: item <id> did not read` and keeps going. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:233-235] [SOURCE: .skilled/bin/bots.cjs:472]
- **A refused item holds a bot.** `holdForBot` holds the bot the damaged file still names in `botId`, and holds any bot when no `botId` can be read. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:287-298] So an answered or expired item still holds its bot after a revert, until the file reads again.
- **A refused request** is quarantined as malformed and never run. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:200-205]
- **The run record and every new state file** are not refused for an added key. A file an older runtime has no reader for is left alone.

| Phase | Closed-list key it adds | What an older runtime does | Manual step a revert needs |
|-------|-------------------------|----------------------------|----------------------------|
| 001 | item `kind`, answer `by` and `scope` | Refuses every item 001 wrote with a `kind` key, `null` included. Whether 001's writers write `kind: null` or leave it out is inferred, not settled by 001's documents. The answer's extra keys alone are not refused, because the validator checks only `text` and `answeredAt` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:116-121] | Strip `kind` from each item: `jq 'del(.kind)'` into a temp file, then rename it over the item |
| 005 | item `proposalType`, `proposalFact` and `proposalBotId`, with the `kind` values | Refuses each item that carries them. A `memory-proposal` item names the sentinel `memory-proposals`, so it holds no real bot | Remove each `memory-proposal` item file, after appending any fact still wanted by hand. Strip the three keys from every other item |
| 006 | item `grants` | Refuses every item 006 wrote. Each holds the bot it names | Strip `grants` from each item. The grant's scope survives in `answer.scope` |
| 009 | the `skill-proposal` value of `kind`, the sentinel `skill-proposals` | A runtime before 001 refuses the review item for its `kind` key. A runtime from 005 to 008 refuses it only if its validator checks `kind` against a closed value list, which 005 does not settle. Either way the item holds no real bot | Remove each review item file. The draft and `proposal.json` stay in `proposals/` |
| 010 | item `conversationId`, request `conversationId` | Refuses each item that carries it, and quarantines each queued request that carries it | Strip `conversationId` from items. Re-send a quarantined chat request by hand with `bots enqueue` |

Before a revert the order is: `bots disable` on each bot so no run starts, strip or remove the files above, install the older runtime, then `bots enable` each bot. A forward upgrade needs no step, because every phase reads the absent key as its default.

The two `fixtures/needs-you-item.*.json` files are the today and final shapes a test can feed to either validator to prove the table's first column.
