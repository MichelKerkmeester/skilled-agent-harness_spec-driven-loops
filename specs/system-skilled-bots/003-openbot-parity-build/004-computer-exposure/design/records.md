---
title: "Design: the record, index and payload fields this phase adds"
description: "Every field this phase adds or fills, with its type, null rule, owner, landing phase and absent-key default, the read coalescing rule that keeps an older index readable, the version rule for all three surfaces and the validator fact that no validator changes."
trigger_phrases:
  - "working place record fields"
  - "run summary branch"
  - "lastRun branch worktreePath"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The record, index and payload fields

Three surfaces gain the same two facts. The run record already has both keys and this phase fills one of them for every dispatched run. The status index's run summary gains both inside its JSON column. The `bots status --json` payload gains both under `lastRun`. This note fixes every field, so a builder writes no shape of its own.

The record's own field table is [`contracts/records.md`](../../contracts/records.md) section 4 and the payload's is the screen contract's section 4. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "4. RUN RECORD ADDITIONS"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:315] This note adds the columns those two leave to the builder: what an absent key reads as on each surface, and what the reader does about it.

---

## 1. THE RUN RECORD

File: `<stateRoot>/<identityKey>/records/<runId>.json`, the path `recordFile(stateRoot, identity, runId)` returns. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:176-178] A proof reads that path and never a copy inside the run folder.

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `evidence.branch` | string, the branch name git prints, or the tree's branch | yes, only on a detached HEAD or when git does not answer | 004 | today as a key, 004 widens the fill from worktree runs to every dispatched run | `null` |
| `evidence.worktreePath` | string, absolute | yes, a shared run | today | today, unchanged | `null` |

Both keys already exist on `EvidenceLocations` and both are already nullable. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:151-157] This phase adds no key to the record, so the record's `schemaVersion` stays `1` and no reader changes. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"]

### 1.1 The fill rule

| Run shape | `evidence.worktreePath` | `evidence.branch` |
|-----------|-------------------------|-------------------|
| A worktree run that made its tree | The tree's path | The tree's branch |
| A worktree run that resumed a parked tree | The parked tree's path | The parked tree's branch |
| A shared run | null | The checkout's branch, or null when git does not answer |
| A run refused before the isolation step | null | null |
| A run refused at the isolation step, having kept a half-provisioned tree | The kept tree's path | The kept tree's branch |

The last row is today's behavior and it stays. `worktree-setup-failed` and `worktree-refused` write the kept tree into the seed before they refuse, so their records carry both values. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1017-1030] A requirement that said every refusal carries neither would be false against the code, so REQ-008 says what is true: a refusal that happens before the isolation step carries neither.

### 1.2 No validator change

`validateRunRecord` requires both keys to be strings only inside its `evidence.worktree` block, which is present only for a run that made or kept a tree. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:319-338] A shared run carries `worktreePath: null` and no `worktree` key, so it passes today's validator unchanged. A shared run with a branch string also passes, because the string requirement is scoped to the tree block. So this phase edits no validator and adds no validation reason.

That is worth stating because the obvious reading of the code is the wrong one. A builder who adds a `branch` check outside the tree block would refuse every shared run.

---

## 2. THE STATUS INDEX RUN SUMMARY

The summary is one JSON string in the index's run row, so a field costs no column and no migration. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:266-292] `SCHEMA_VERSION` stays `'2'`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `worktreePath` | string, absolute | yes, a shared run | 004 | 004 | `null` |
| `branch` | string | yes, a detached HEAD or a git read that did not answer | 004 | 004 | `null` |

Both are filled by `summarizeRecord` from `record.evidence`, beside the `runFolder` it already copies. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:266-292]

### 2.1 The read coalescing rule

This is the one rule that makes an index built before this phase readable, and the documents did not state it.

A summary written before this phase has no `branch` and no `worktreePath` key. `JSON.parse` yields `undefined` for an absent key, not `null`. `LastRun` types both as `string | null`, so an `undefined` would violate the type and `JSON.stringify` would drop the key from `bots status --json`, which breaks REQ-005's promise that both keys are present as a string or null.

So the reader coalesces. `lastRunOf` reads each field as the summary's value when it is a string and as `null` otherwise. The same rule covers a summary written by a newer runtime that a reader does not understand, which is the forward case [`contracts/versioning.md`](../../contracts/versioning.md) rule 1 already requires.

| Summary on disk | `lastRun.branch` | `lastRun.worktreePath` |
|-----------------|------------------|------------------------|
| Written by this phase, a shared run on `main` | `"main"` | `null` |
| Written by this phase, a worktree run | the tree's branch | the tree's path |
| Written before this phase | `null` | `null` |
| Written by this phase, a detached HEAD | `null` | `null` |

A test writes a summary object with neither key into a fixture index and asserts both payload keys are present and null. That is the only test that proves the coalescing rule, because a rebuilt index always has the keys.

---

## 3. THE `bots status --json` PAYLOAD

`lastRun` gains exactly two keys and no other key on a row changes. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:311-315]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `lastRun.branch` | string | yes | 004 | 004 | `null` |
| `lastRun.worktreePath` | string, absolute | yes | 004 | 004 | `null` |

The payload's own `version` stays `1`, because adding a key is not a change under [`contracts/cli-json.md`](../../contracts/cli-json.md) section 1 rule 5 and [`contracts/versioning.md`](../../contracts/versioning.md) rule 5. The screen ignores a key it does not know, so it gains both without an edit. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md, section "8. VERSIONING AND UNKNOWN FIELDS"]

The two keys are appended after `delivery`, which keeps the existing key order and adds no reordering. Key order is not a contract, so a test compares the key set and the types and never the order.

---

## 4. THE VERSION RULE, ALL THREE SURFACES

| Surface | Version key | Value before | Value after | Why it does not move |
|---------|-------------|--------------|-------------|----------------------|
| Run record | `schemaVersion` | `1` | `1` | No key is added, removed, renamed or retyped. One existing nullable key gains more writers |
| Status index | `SCHEMA_VERSION` | `'2'` | `'2'` | The two fields ride inside the summary's JSON column, so the table shape is unchanged |
| `bots status --json` | `version` | `1` | `1` | Two keys are added to an object, which rule 5 of `cli-json.md` calls no change |

No revert step is needed for this phase, because no closed key list gains a key. [`contracts/versioning.md`](../../contracts/versioning.md) section 2 has no row for 004 and this phase adds none.

---

## 5. SAMPLES

Each sample is a golden file in [`fixtures/`](fixtures/README.md), on the contracts' one data set: clock `2026-11-25T21:14:04Z`, identity `skilled-scratch/hello`, checkout `/Users/ada/code/hello`, operator `ada`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "1. NEEDS-YOU ITEM"]

### 5.1 A shared run's evidence

```json
{
  "runFolder": "/Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40",
  "ledgerDir": "/Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40/ledger",
  "receiptDir": "/Users/ada/.local/state/system-skilled-bots/skilled-scratch%2Fhello/receipts/20261125T211204Z-7c1e9a40",
  "observabilityStream": "/Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40/observability.jsonl",
  "worktreePath": null,
  "branch": "main"
}
```

### 5.2 A worktree run's evidence

```json
{
  "runFolder": "/Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40",
  "ledgerDir": "/Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40/ledger",
  "receiptDir": "/Users/ada/.local/state/system-skilled-bots/skilled-scratch%2Fhello/receipts/20261125T211204Z-7c1e9a40",
  "observabilityStream": "/Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40/observability.jsonl",
  "worktreePath": "/Users/ada/worktrees/004-bot-hello",
  "branch": "worktrees/004-bot-hello"
}
```

### 5.3 The run summary, both fields present

```json
{
  "runId": "20261125T211204Z-7c1e9a40",
  "botId": "hello",
  "identity": "skilled-scratch/hello",
  "repositoryPath": "/Users/ada/code/hello",
  "definitionDigest": "9f2c1a7b4e8d3c6a0b5f9e2d7c4a1b8e6f3d0c9a2b7e4f1d8c5a3b0e9f6d2c4a",
  "source": "manual",
  "scheduledAt": null,
  "dispatchedAt": "2026-11-25T21:12:04.000Z",
  "latenessClass": null,
  "skippedSlots": null,
  "heldSlot": null,
  "exitReason": "completed",
  "exitClass": null,
  "needsYouItemId": null,
  "refusalCause": null,
  "runFolder": "/Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40",
  "requestId": null,
  "worktreePath": "/Users/ada/worktrees/004-bot-hello",
  "branch": "worktrees/004-bot-hello"
}
```

### 5.4 The `lastRun` object

```json
{
  "runId": "20261125T211204Z-7c1e9a40",
  "dispatchedAt": "2026-11-25T21:12:04.000Z",
  "exitReason": "completed",
  "exitClass": null,
  "needsYouItemId": null,
  "delivery": [],
  "branch": "worktrees/004-bot-hello",
  "worktreePath": "/Users/ada/worktrees/004-bot-hello"
}
```

The `definitionDigest` value is illustrative and a test compares its type only, as the contracts' fixture README already rules for a digest. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/fixtures/README.md, section "Golden records and payloads"]
