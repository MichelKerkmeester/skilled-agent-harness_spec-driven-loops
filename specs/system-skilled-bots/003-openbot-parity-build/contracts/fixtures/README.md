---
title: "Fixtures: Golden records and payloads of the parity build"
description: "One golden file per durable record and per --json verb the screen's design/payloads/ folder does not hold, with the vitest file that reads each and whether that test exists today."
trigger_phrases:
  - "parity build fixtures"
  - "golden records"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
---

# Golden records and payloads

Each file is the literal sample of one section of `../records.md` or `../cli-json.md`, on the screen's one data set (clock `2026-11-25T21:14:04Z`, identity `skilled-scratch/hello`, operator `ada`). The four screen verbs are not here: their samples are `003-terminal-screen/002-architecture-and-contracts/design/payloads/`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md, section "1. THE SAMPLE FILES AND THE ONE DATA SET"]

A test reads a golden in one of two ways. A **record** golden is fed to the module's validator or reader. A **payload** golden is compared key by key and type by type against the verb's real `--json` output, the type check the screen contract runs for its own four. A phase that changes a shape edits the golden in the same change.

Today's runtime tests live in `.skilled/skills/system-skilled-bots/runtime/tests/`. "Exists" means the file is there now. "Created by" means the owning phase's Files to Change creates it.

| Golden | Section | Read by | Test file |
|--------|---------|---------|-----------|
| `needs-you-item.today.json` | records 1 | `validateNeedsYouItem` accepts it, before and after every phase | `needs-you.vitest.ts`, exists |
| `needs-you-item.final.json` | records 1 to 3 | `validateNeedsYouItem` after 010 accepts it, today's refuses it `unknown-key` | `needs-you.vitest.ts`, exists |
| `run-record.additions.json` | records 4 | `validateRunRecord` accepts it today and after every phase | `run-record.vitest.ts`, exists |
| `request-record.json` | records 5 | `validateRequest` after 010 accepts it, today's refuses it `unknown-key` | `request-record.vitest.ts`, exists |
| `routine-state.json` | records 6 | `readRoutineState` | `routine-state.vitest.ts`, created by 002 |
| `remember-list.json` | cli-json 3.2 | type check of `bots remember --list --json` | `memory.vitest.ts`, created by 005 |
| `secrets-index.json` | records 8 | the index reader in `secrets.ts` | `secrets.vitest.ts`, created by 008 |
| `proposal.json` | records 9 | type check of the file `bots skill propose` writes | `skill-proposal.vitest.ts`, created by 009 |
| `conversation.jsonl` | records 10 | the conversation reader, one parse per line | `conversation.vitest.ts`, created by 010 |
| `chat-transcript.json` | cli-json 3.1 | type check of `bots chat <id> --transcript --json` | `cli-chat.vitest.ts`, created by 010 |
| `channels-config.json` | records 11 | `readChannelConfig` | `channel.vitest.ts`, created by 011 |
| `channel-links.json` | records 12 | the link reader in `channel-link.ts` | `channel-link.vitest.ts`, created by 011 |
| `operators.json` | records 16 | the roster reader in `channel-link.ts` | `channel-link.vitest.ts`, created by 011 |
| `channel-approvals.json` | records 13 | the index reader in `channel-approval.ts` | `channel-approval.vitest.ts`, created by 011 |
| `channel-queue-entry.json` | records 14 | the queue reader in `channel-queue.ts` | `channel-queue.vitest.ts`, created by 011 |
| `channel-seen.json` | records 15 | the seen check of the inbound sink | `channel-conformance.vitest.ts`, created by 011 |
| `channel-list.json` | cli-json 3.3 | type check of `bots channel list --json` | `cli-channel.vitest.ts`, created by 011 |

The test file names come from each phase's Files to Change table. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, section "Files to Change"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, section "Files to Change"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:155-161] 008, 009 and 010 name theirs in the same table of their own `spec.md`.

Two values in the goldens are illustrative and a test compares their type only: the SHA-256 digest under `posture.skills` and the message ids in the conversation files. Every other value is a real shape the runtime produces. The request record's `id` and `idempotencyKey` are what `buildRequest` returns for this answer.

Check every file parses:

```bash
cd specs/system-skilled-bots/003-openbot-parity-build/contracts/fixtures
for f in *.json; do node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$f" || echo "BAD $f"; done
node -e 'require("fs").readFileSync("conversation.jsonl", "utf8").trim().split("\n").forEach((l) => JSON.parse(l))'
```
