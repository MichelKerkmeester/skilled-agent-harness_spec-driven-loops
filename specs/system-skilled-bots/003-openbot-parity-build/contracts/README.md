---
title: "Contracts: Index of the parity build's shared shapes"
description: "The index of the packet-level contracts folder: one row per contract file with its owner and the phases that cite it, the same-change rule and the phase document lines that still contradict a contract."
trigger_phrases:
  - "parity build contracts"
  - "contracts index"
  - "shared shapes owner"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Contracts of the OpenBot parity build

The parent's Shared Records table names an owner for each shape more than one phase writes, and shows none of the shapes. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:122-138] This folder holds them, as the plan-depth research's work order WO-01 asks. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:306-319]

## The rule

**A phase that changes a shape edits the contract file in the same change.** The contract file first, then its golden in `fixtures/`, then the phase's code and documents. A phase document that disagrees with a contract here is wrong until the contract is changed, and the disagreement is recorded in the last section below until it is fixed.

The four payloads the terminal screen reads keep their own contract, `003-terminal-screen/002-architecture-and-contracts/design/contracts.md`, and the same rule applies to it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:15] Nothing here copies it.

## The nine entries

| File | Holds | Owner | Cited by |
|------|-------|-------|----------|
| [`decisions.md`](decisions.md) | D1 to D9, the choice taken for each, the date and the documents it changes | The operator. The assistant recorded the defaults on 2026-11-25 | 002, 005, 007, 008, 009, 010, 011, 012, 014 |
| [`records.md`](records.md) | One field table, sample and version rule per durable record, plus the keys decided where the phases left them open | The packet keeps the file. Each section's owner phase fixes its keys, as its Owner column says | 001, 002, 004, 005, 006, 007, 008, 009, 010, 011 |
| [`cli-json.md`](cli-json.md) | The `--json` rule, one row per verb, the field tables for the verbs the screen does not read, the four `state` vocabularies | The packet keeps the rule. Each verb's row belongs to the phase that adds the verb (001, 002, 005, 010, 011) | 001, 002, 003, 005, 010, 011, 012 |
| [`versioning.md`](versioning.md) | When a version moves, why the item has none, what an older runtime does with a newer record and the revert step per phase | The packet | 001, 002, 005, 006, 008, 009, 010, 011 |
| [`refusals.md`](refusals.md) | Every refusal the packet adds with its layer, failure class, exit code and registry entry, plus the existing exit codes | The packet keeps the table. Each row belongs to the phase that adds the refusal | 002, 005, 006, 007, 008, 009, 010, 011, 014 |
| [`prompt-sections.md`](prompt-sections.md) | The nine prompt blocks in order, their literal delimiters and untrusted labels, the escape form and the budget table | 005, which owns `buildBotPrompt`'s section order [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:134] | 004, 005, 009, 010, 011 |
| [`answer-seam.md`](answer-seam.md) | The numbered `answerItem` sequence, the item state transitions and the grant lifecycle | 005 for the review seam, 006 for the guarded write [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:135-136] | 001, 002, 005, 006, 009, 010, 011 |
| [`runtime-architecture.md`](runtime-architecture.md) | The target module list and import edges, the final state-root tree and four sequence diagrams | The packet | 001 to 011 |
| [`fixtures/`](fixtures/README.md) | One golden per record and per `--json` verb the screen's samples do not hold, with the vitest file that reads each | Each golden belongs to its record's owner phase | 002, 005, 008, 009, 010, 011, and 001, 006 and 010 for the item |

"Cited by" lists the phases whose work orders or documents read the file. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:280-296]

## Phase document lines that contradict a contract

Each line below is wrong against the contract named beside it. The work order in brackets is the one that fixes it.

| Phase document | What it says | Contract it contradicts |
|----------------|--------------|-------------------------|
| `001-activity-and-actor/spec.md:227` | `bots activity --json` prints `{"groups":[]}` on an empty state root | `cli-json.md` section 2: the empty shape carries `version` (WO-02) |
| `002-routine-layer/acceptance-criteria.md:62`, `plan.md:297`, `tasks.md:106`, `goal.md:61` | `jq -e 'length == 2 and (.[0].botId != null)'`, a bare array | `cli-json.md` section 2: `{"version", "routines"}` (WO-03) |
| `005-memory/spec.md:265` | "009 sets `kind` to `skill-proposal` and adds no id of its own" | `decisions.md` D1: two sentinels (WO-04) |
| `009-skills/acceptance-criteria.md:60` | `jq -e '.targetPath and .revisionRead and ...'`, which fails when `revisionRead` is `null` for a new skill | `records.md` section 9: `revisionRead` is nullable (WO-07) |
| `010-conversations/spec.md:157` | REQ-006: `--json` prints the messages as a JSON array | `cli-json.md` section 3.1 and D2 (WO-08) |
| `010-conversations/acceptance-criteria.md:56` and `:59` | `jq -r '.[0] \| keys \| length'` and `jq 'length'`, a bare array | `cli-json.md` section 3.1 (WO-08) |
| `011-messaging-channels/spec.md:187`, `:210` and `acceptance-criteria.md:76` | The literal `operators.json` and `channels/config.json` shapes, with no `schemaVersion` | `versioning.md` rule 3 and `records.md` sections 11 and 16 (WO-09) |
| `012-manual-testing-scenarios/spec.md:261` | An empty inbox makes `bots inbox --json` print `[]` | `cli-json.md` section 2: `{"version": 1, "items": []}` (WO-10) |
