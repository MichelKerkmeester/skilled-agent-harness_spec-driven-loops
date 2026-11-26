---
title: "Design: the records this phase writes"
description: "Every field of the grant object, the answer's scope and actor, the lock file, the run record's grant line, the ACTION line and the resumed prompt line, with the validation order and the refusal detail for each."
trigger_phrases:
  - "grant object fields"
  - "item lock file"
  - "action kind line"
  - "resumed prompt scope"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The records this phase writes

Six shapes carry this phase's work: the grant object on the item, the answer's `scope` and `by`, the lock file beside the item, the grant line on the run record, the `[ACTION: <kind>]` line in a question and the scope line in the resumed prompt. The first two are shared shapes and their field tables are `contracts/records.md` sections 2 and 3. This file adds what those tables leave to the builder: the validation order, the exact refusal detail, the lock file's contents and lifetime, the line grammar and the prompt text.

Every sample here is a golden in [`fixtures/`](fixtures/README.md). The clock, the identity, the operator and the bot are the packet's one data set. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "Durable records of the OpenBot parity build"]

---

## 1. THE GRANT OBJECT

The shape is `contracts/records.md` section 3. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "3. GRANT OBJECT"] It is the value of the item's `grants` key, and the item's key list is closed, so `grants` joins `ITEM_KEYS` in the same commit as its writer. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51]

| Key | Type | Null | Written by | Validation |
|-----|------|------|------------|------------|
| `kind` | string, one of `pay`, `credentials`, `delete`, `send`, `share`, `post`, `other` | no | the item's writer, from `classifyAction` | membership in the seven |
| `action` | string, 1 to 120 characters | no | the item's writer, from the question | length after the clip |
| `rung` | string, one of `kind`, `rule`, `auto-review`, `extra-vigilant`, `bot` | no | the item's writer, from `decideApproval` | membership in the five |
| `scope` | string, `once` or `deny` | yes, while the item is open | `answerItem`, step 11 of `contracts/answer-seam.md` section 1 | membership in the two, or `null` |
| `grantedBy` | string, an actor name | yes, while the item is open | `answerItem`, step 11 | a non-empty string, or `null` |
| `grantedAt` | string, ISO 8601 UTC | yes, while the item is open | `answerItem`, step 11 | an instant, or `null` |

### 1.1 The validation order

`validateNeedsYouItem` checks `grants` after `resumeRequestId` and before it returns. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:95] The checks run in this order, and the first that fails refuses the item with `item-field-invalid` and the detail `grants`.

1. `grants` is `null` or a plain object.
2. Every key of the object is one of the six above. A seventh key is refused, so a later phase that adds one edits `contracts/records.md` section 3 first.
3. `kind` is one of the seven.
4. `action` is a string of 1 to 120 characters.
5. `rung` is one of the five.
6. `scope` is `null`, `once` or `deny`.
7. `grantedBy` is `null` or a non-empty string.
8. `grantedAt` is `null` or an instant.
9. The three answer-derived keys agree: all three are `null`, or all three are set. A grant with a scope and no actor is a torn record and is refused.
10. When the item also carries an answer, `grants.scope` equals `answer.scope`. The two are written in one write, so a stored disagreement means a writer bypassed step 11.

Check 10 is the one that makes the contract's "written in the same write, so the two cannot disagree" a property a test can read rather than a promise. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "3. GRANT OBJECT", row `scope`]

### 1.2 The two `kind` vocabularies

The item carries two keys named `kind` and they do not share a vocabulary. The item's `kind` is the review kind, one of `decision`, `memory-proposal` or `skill-proposal`. `grants.kind` is the action kind, one of the seven above. A reader that means the action says `grants.kind`. The status report's row `kind` and the request record's `kind` are a third and a fourth vocabulary in other records. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "1. NEEDS-YOU ITEM"]

### 1.3 The three samples

| State | `scope` | `grantedBy` | `grantedAt` | Golden |
|-------|---------|-------------|-------------|--------|
| Born open | `null` | `null` | `null` | `fixtures/grant.born-open.json` |
| Granted | `once` | `ada` | `2026-11-25T21:13:10.000Z` | `fixtures/grant.granted.json` |
| Denied | `deny` | `ada` | `2026-11-25T21:13:10.000Z` | `fixtures/grant.denied.json` |

The fourth lifecycle row, expired with its item, writes nothing. The grant stays born open and is never written again. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "3. GRANT LIFECYCLE"]

---

## 2. THE ANSWER'S SCOPE AND ACTOR

The shape is `contracts/records.md` section 2. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "2. ANSWER OBJECT"] This phase adds the derivation rule and the write.

### 2.1 The derivation, in order

`answerItem` derives the scope before it judges the item's state, so a refusal never depends on the scope. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:65]

1. An explicit `--scope once` or `--scope deny` is the scope.
2. Otherwise, a text that is `deny`, `no` or `n` after trim and in any case is `deny`. The set is closed and holds three spellings.
3. Otherwise the scope is `once`.

The rule lives in `answerItem` and not in `bots.cjs`, so a channel transport that calls `answerItem` directly with the text `no` records `deny` too. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE"]

### 2.2 The write

Step 11 writes the answer and the grant in one atomic write. The answer gains `by` and `scope`, and the grant gains `scope`, `grantedBy` and `grantedAt`. `grantedBy` is the answer's `by` and `grantedAt` is the answer's `answeredAt`, so the two objects cannot disagree. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "4. DECISIONS TAKEN"]

The write is the one `writeNeedsYouItem` already makes, by temp file and rename. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:159] This phase adds the lock in front of it and no second write path.

---

## 3. THE LOCK FILE

File: `<identity>/needs-you/<item-id>.lock`, beside the item file the same folder holds. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:181] It is not a record. It carries no `schemaVersion` and no reader outside `answerItem` reads it.

| Key | Type | Null | Meaning |
|-----|------|------|---------|
| `pid` | integer | no | the writing process's id, so a lock left by a killed process is reclaimable |
| `nonce` | string, 32 hex characters | no | a value unique to this acquisition, so two reclaimers cannot both believe they won |
| `createdAt` | string, ISO 8601 UTC | no | the instant the lock was created, so a lock with no live owner still expires |

Sample: `fixtures/lock.file.json`.

### 3.1 The acquisition

1. Create the file with the exclusive flag, so a second creator fails rather than overwriting.
2. Write the three keys and close.
3. Set the mode to `0600`, because the file names a process and the folder is owner-only.

### 3.2 The lifetime

A lock is reclaimed when either condition holds.

- Its `pid` names no live process. The check is a signal 0 probe, which answers whether the process exists without touching it.
- Its `createdAt` is more than 60 seconds before now. The bound is 60 s because an answer holds the lock for milliseconds and a clock that jumped must not hold an item forever.

A lock whose owner is alive and whose age is under 60 s is waited on for up to 2,000 ms, polled every 50 ms. When the wait runs out the answer is refused `item-busy`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "4. DECISIONS TAKEN"]

The model is the run lease's, which reclaims by owner pid and nonce rather than by age alone. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:12]

### 3.3 The reclaim

A reclaimer renames the lock to `<item-id>.lock.<nonce>.stale` and then unlinks it, and only the process whose rename succeeded proceeds. A rename is atomic, so two reclaimers cannot both win and the loser retries the acquisition rather than the reclaim.

### 3.4 The release

Step 18 removes the lock on every exit path after step 6, including a refusal and a throw. A process killed outright leaves the file, and the next answer reclaims it by section 3.2. The inbox ignores it, because the listing reads `.json` files only. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE"]

---

## 4. THE RUN RECORD'S GRANT LINE

The key is `request.grant`, one object, and its name is `contracts/records.md` section 17's. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "17. DECISIONS TAKEN"] It sits beside `resumedItemId` on the request join. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:73]

| Key | Type | Null | Source |
|-----|------|------|--------|
| `itemId` | string | no | the item's `id` |
| `kind` | string, the seven action kinds | no | `grants.kind` |
| `scope` | string, `once` or `deny` | no | `grants.scope` |
| `by` | string, an actor name | no | `grants.grantedBy` |

The object is written only on a resumed run, from the item the resume continues. Every other run carries `request.grant` absent or `null`. The key is `by` and not `grantedBy` because the contract chose the shorter name for this join, and the two values are equal by section 2.2.

Sample: `fixtures/run-record.request-grant.json`.

---

## 5. THE `[ACTION: <kind>]` LINE

A bot that knows what kind of action it is asking about may say so on one line of its question. The gate reads it and takes it as a floor.

### 5.1 The grammar

```text
[ACTION: <kind>]
```

- The line starts at the beginning of a line after a trim, the same rule the decision marker follows. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:432]
- `<kind>` is one of the six action kinds. `other` is not a declaration, because `other` is what the classifier returns when it finds nothing.
- The line may appear anywhere in the question text the child printed after `[NEEDS-DECISION] `. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:42]
- Two lines: the first wins and the second is ignored.
- A `<kind>` outside the six refuses the run `action-kind-invalid` and no item is written.

### 5.2 The floor rule

The recorded kind is the earlier of the declared kind and the classified kind in `classifyAction`'s order. The order is `pay`, `credentials`, `delete`, `send`, `share`, `post`, `other`. So a declaration can raise a kind and never lower it, and `[ACTION: other]` on a question that names a delete records `delete`.

### 5.3 What `action` holds

`action` is the question verbatim, clipped to 120 characters, with the `[ACTION: <kind>]` line left in place. The contract says the question, and a reader that stripped the line would disagree with the stored `question`. The consequence is that the inbox line shows the bot's own declaration, which tells the operator what the bot believed it was asking about.

---

## 6. THE RESUMED PROMPT LINE

`buildResumedPrompt` gains one line after the answer line and before the closing instruction. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:335]

```text
Granted scope: <scope>
```

- The line is written when the item carries a grant whose `scope` is not `null`.
- The line is absent when `grants` is `null` or its `scope` is `null`, so an item written before this phase produces today's prompt unchanged.
- `<scope>` is the stored value, `once` or `deny`, and never a word derived from it.

Sample: `fixtures/resumed-prompt.txt`.

---

## 7. VERSIONS

None of the six shapes moves a version.

- The item gains no version key, and `grants` is an added key, so `contracts/versioning.md` rule 4 and rule 1 apply. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"]
- The run record keeps `schemaVersion` at `1`, because its validator checks named fields and keeps an unknown key. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "4. RUN RECORD ADDITIONS"]
- The lock file is not a record and carries no version.
- The `[ACTION: <kind>]` line and the prompt line are text, not records.

What an older runtime does with an item that carries `grants`, and the manual step a revert needs, are `contracts/versioning.md` section 2's row for this phase. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "2. AN OLDER RUNTIME MEETS A NEWER RECORD"]

---

## 8. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The grant's validation runs ten checks in the order of section 1.1, and every failure is `item-field-invalid: grants` | The item's validator already names the first bad field and no more, so one detail for the whole object keeps the refusal vocabulary closed [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:95] |
| The validator refuses a grant whose `scope` disagrees with `answer.scope` | The contract's "one write, so the two cannot disagree" is otherwise a promise no test can read [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "3. GRANT OBJECT", row `scope`] |
| The lock holds `pid`, `nonce` and `createdAt` and is reclaimed by pid or by a 60 s age | The run lease already reclaims by owner pid and nonce, and an answer holds the lock for milliseconds [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:12] |
| The reclaim renames before it unlinks | A rename is atomic, so two reclaimers cannot both proceed and the loser retries the acquisition |
| The wait is 2,000 ms polled every 50 ms, then `item-busy` | The bound is the contract's, and a poll interval short enough to feel instant keeps a contended answer under a second in practice [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "4. DECISIONS TAKEN"] |
| `action` keeps the `[ACTION: <kind>]` line | The contract says the question, and stripping it would make `action` disagree with the stored `question` |
| The resumed prompt line is `Granted scope: <scope>` and is absent when no scope was granted | An item written before this phase must produce today's prompt unchanged, so the line cannot be unconditional |
| The run record's key is `by` and not `grantedBy` | The contract fixed the shorter name for this join, and the two values are equal by construction [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "17. DECISIONS TAKEN"] |
