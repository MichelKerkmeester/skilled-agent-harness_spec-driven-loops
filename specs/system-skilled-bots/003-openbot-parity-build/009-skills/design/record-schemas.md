---
title: "Design: the records phase 9 writes and adds"
description: "Every field of the proposals folder, proposal.json, the settle record, the skill-proposal review item, posture.skills on the run record and skillDigests on the install record, with a sample for each and the version rule that governs it."
trigger_phrases:
  - "proposal.json fields"
  - "skill proposal review item"
  - "posture.skills digest"
  - "skillDigests install record"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The records phase 9 writes and adds

This note fixes every field of every record this phase writes, so a builder copies a table rather than choosing a key name. The packet-level shapes live in `contracts/records.md` and are cited, never copied. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "9. `proposal.json`"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "1. NEEDS-YOU ITEM"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "4. RUN RECORD ADDITIONS", section "Install record addition"]

Paths are relative to the repository root. `$R` is `.skilled/skills/system-skilled-bots/runtime` and `$F` is `.skilled/skills/system-skilled-bots/scripts/fixtures`, the two variables `tasks.md` uses.

---

## 1. THE PROPOSALS FOLDER

`<stateRoot>/<identityKey>/proposals/<runId>/` holds three files at most. The folder is created on the first proposal for that run and never removed by this phase. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md, section "2.1 The user state root"]

```text
<stateRoot>/<identityKey>/proposals/<runId>/     0700   009
  SKILL.md                                       umask  009, the draft
  proposal.json                                  umask  009, what the draft was built from
  answer.json                                    umask  009, the decision, written by the settle
```

`<identityKey>` is the value `identityKey(identity)` returns, the same key every other identity folder uses. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117-131] `<runId>` is the run record's `identity.runId`. The verb checks the id is a safe path segment before it reads the record, so no id can leave the proposals folder, and `validateRunRecord` checks it again on the way in. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:250]

The pin reads the target under the skilled tree root, which is the same root the loader reads: `<skilledTree>/.skilled/skills/<name>/SKILL.md`. `targetPath` stays checkout-relative because that is the form `contracts/records.md` section 9 fixes, and the claim resolves it against the skilled tree root rather than against the process's working directory. A pin that read a different file would pass a body the loader never loads.

The folder is never inside a checkout. A worktree run's tree is thrown away, and unreviewed content must not land in the repository before review. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:263]

---

## 2. `proposal.json`

The five keys and `schemaVersion` are `contracts/records.md` section 9. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "9. `proposal.json`"] This table adds the value rule each key carries, which that section leaves to this phase.

| Key | Type | Null | Value rule | Written by |
|-----|------|------|------------|------------|
| `schemaVersion` | integer | no | the literal `1` | `writeProposal` |
| `targetPath` | string | no | `.skilled/skills/<name>/SKILL.md`, forward slashes, checkout-relative, never absolute | `writeProposal` |
| `revisionRead` | string or `null` | yes | the SHA-256 hex of the target body's bytes as read at proposal time, lower case, 64 characters. `null` when the target file did not exist | `writeProposal` |
| `runId` | string | no | the record's `identity.runId` | `writeProposal` |
| `botId` | string | no | the record's `identity.botId`, the proposing bot | `writeProposal` |
| `createdAt` | string | no | ISO 8601 UTC with a `Z`, the instant the draft was written | `writeProposal` |

`<name>` is the `--name` value when given and the record's `identity.botId` when not. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "9. `proposal.json`"]

Sample, a new skill (`$F/proposal.json`):

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

Sample, a target that already existed:

```json
{
  "schemaVersion": 1,
  "targetPath": ".skilled/skills/sk-doc/SKILL.md",
  "revisionRead": "3b1f0c4e9a2d7b6e5f8c1a0d9e4b7c2f6a3d8e1b0c5f9a2e7d4b6c1f8a3e0d5b",
  "runId": "20261125T210204Z-0b6e5f72",
  "botId": "hello",
  "createdAt": "2026-11-25T21:13:30.000Z"
}
```

**Version rule.** `schemaVersion` is `1` and moves only when a key is removed, renamed or retyped, or when a non-null key becomes nullable. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"] A reader that meets a higher `schemaVersion` refuses the file and the review reads as not a proposal, which is the fallback `spec.md` NFR-R02 requires.

---

## 3. `answer.json`

The settle's effect. `contracts/answer-seam.md` step 13 requires a skill decision to be recorded beside `proposal.json` and names no file. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE", row 13] This section fixes the file and its keys.

| Key | Type | Null | Value rule |
|-----|------|------|------------|
| `schemaVersion` | integer | no | the literal `1` |
| `decision` | string | no | `confirm` or `reject`, the decision word the claim derived |
| `text` | string | no | the answer's `text`, verbatim, so a `yes` and a `confirm` stay distinguishable |
| `by` | string | no | the answer's `by`, the actor who decided |
| `scope` | string | no | `once` or `deny`, the answer's `scope` |
| `answeredAt` | string | no | the answer's `answeredAt`, ISO 8601 UTC |
| `revisionRead` | string or `null` | yes | the `revisionRead` the claim verified, copied from `proposal.json` |

Sample:

```json
{
  "schemaVersion": 1,
  "decision": "confirm",
  "text": "confirm",
  "by": "ada",
  "scope": "once",
  "answeredAt": "2026-11-25T21:14:02.000Z",
  "revisionRead": null
}
```

**Why a third file.** The item's `answer` object records the answer, and the item is the review's own record. `answer.json` records the decision beside the draft, so a reader of the proposals folder sees what was decided without reading the state root's item folder, and the settle's idempotence check is one file read. A settle that runs twice writes the same bytes, because every value is copied from the answer and the proposal.

**Contract gap this phase leaves.** `contracts/records.md` section 9 holds `proposal.json` and not this file. The contract's own rule says the contract file is edited first. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/README.md, section "The rule"] This phase cannot edit a frozen contract, so the shape is fixed here and the amendment is named in `goal.md` section 4: a section 9.1 holding this table, added in the same change that lands the code.

---

## 4. THE REVIEW ITEM

The item's key list is closed and `contracts/records.md` section 1 holds every key. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "1. NEEDS-YOU ITEM"] This table gives the value a `skill-proposal` item carries for each key, so the writer fills nineteen keys and chooses none.

| Key | Value on a `skill-proposal` item |
|-----|----------------------------------|
| `id` | the run id. The validator requires `id === runId` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:103]. A run that parked a question already owns the item file with that id, so the verb reads the existing item's `kind` before it writes: a `skill-proposal` refuses `review-already-exists`, and any other kind refuses with that kind as the detail. Such a run cannot be proposed from, which is the limit `spec.md` REQ-005 states |
| `runId` | the run id |
| `botId` | the literal `skill-proposals`, the reserved sentinel |
| `identity` | the record's `identity.repository`, an `owner/name` identity |
| `question` | `Propose skill <name>?` |
| `options` | `["confirm", "reject"]` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "4. DECISIONS TAKEN"] |
| `createdAt` | the instant the item is written, ISO 8601 UTC |
| `expiresAt` | `createdAt` plus the repository's `needsYou.expiryDays` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:145-147] |
| `evidence` | three absolute paths in this order: the draft, the `proposal.json`, the run folder from the record's `evidence.runFolder` |
| `prompt` | the `question` value. No run is parked, and the validator refuses an empty `prompt` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:100-101] |
| `specFolder` | `null`. The run record carries no spec folder |
| `answer` | `null` until answered |
| `resumeRequestId` | `null`. A review never queues a resume |
| `kind` | the literal `skill-proposal` |
| `proposalType` | `null` |
| `proposalFact` | `null` |
| `proposalBotId` | `null` |
| `grants` | `{kind, action, rung, scope: null, grantedBy: null, grantedAt: null}` where `kind` is `classifyAction(question)`, `action` is `question` clipped to 120 characters and `rung` is the `rung` `decideApproval` returns [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "3. GRANT OBJECT"] |
| `conversationId` | `null` |

The three proposal keys are `null` on this item, as `contracts/records.md` section 1 requires, and the draft is named in `evidence` instead. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "1. NEEDS-YOU ITEM"]

Sample (`$F/needs-you-item.skill-proposal.json`):

```json
{
  "id": "20261125T210204Z-0b6e5f72",
  "runId": "20261125T210204Z-0b6e5f72",
  "botId": "skill-proposals",
  "identity": "skilled-scratch/hello",
  "question": "Propose skill report?",
  "options": ["confirm", "reject"],
  "createdAt": "2026-11-25T21:13:30.000Z",
  "expiresAt": "2026-11-26T21:13:30.000Z",
  "evidence": [
    "/Users/ada/.local/state/skilled-bots/skilled-scratch%2Fhello/proposals/20261125T210204Z-0b6e5f72/SKILL.md",
    "/Users/ada/.local/state/skilled-bots/skilled-scratch%2Fhello/proposals/20261125T210204Z-0b6e5f72/proposal.json",
    "/Users/ada/code/skilled/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T210204Z-0b6e5f72"
  ],
  "prompt": "Propose skill report?",
  "specFolder": null,
  "answer": null,
  "resumeRequestId": null,
  "kind": "skill-proposal",
  "proposalType": null,
  "proposalFact": null,
  "proposalBotId": null,
  "grants": {
    "kind": "other",
    "action": "Propose skill report?",
    "rung": "bot",
    "scope": null,
    "grantedBy": null,
    "grantedAt": null
  },
  "conversationId": null
}
```

**Why `other` and `bot`.** The question names no pay, credentials, delete, send, share or post word, so `classifyAction` returns `other`, and `decideApproval` falls through to the `bot` rung. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-002 to REQ-003] A proposal is a repository change, and the ladder has no rung for one, so the fallback is the honest answer and this phase adds no rung of its own.

**Version rule.** The item carries no version key. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"] A runtime built before 001 refuses this item for its `kind` key, and the item holds no real bot, so the revert step is to remove the item file and leave the proposals folder. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "2. AN OLDER RUNTIME MEETS A NEWER RECORD", row 009]

---

## 5. `posture.skills` ON THE RUN RECORD

`contracts/records.md` section 4 fixes the key. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "4. RUN RECORD ADDITIONS", row `posture.skills`] This table fixes the entry.

| Field | Type | Null | Value rule |
|-------|------|------|------------|
| `name` | string | no | the skill name as the `skills` list wrote it, in list order |
| `digest` | string | no | the SHA-256 hex of the body's bytes as the loader read them, lower case, 64 characters |

The array is `[]` on a run whose definition names no skill, and on a run refused before dispatch, because no body was loaded. The array holds one entry per loaded body and never a body's text, so the record names what the child saw without copying it.

Sample, one loaded body:

```json
{ "posture": { "skills": [{ "name": "sk-doc", "digest": "3b1f0c4e9a2d7b6e5f8c1a0d9e4b7c2f6a3d8e1b0c5f9a2e7d4b6c1f8a3e0d5b" }] } }
```

**Version rule.** `schemaVersion` stays `1`, because the run record's validator checks its eight field groups and named fields and keeps any other key. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "4. RUN RECORD ADDITIONS"]

---

## 6. `skillDigests` ON THE INSTALL RECORD

`contracts/records.md` section 4's install-record addition fixes the key. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "Install record addition", row `skillDigests`] This table fixes the value.

| Field | Type | Null | Value rule |
|-------|------|------|------------|
| `skillDigests` | object | no | keyed by skill name, each value the SHA-256 hex of the body `bots schedule install <id>` read |
| `skillDigests.<name>` | string | no | lower case, 64 characters |

The object is `{}` on a bot installed before this phase, and the loader then refuses `skill-changed` for every name the definition carries until the bot is reinstalled. That is the intended upgrade step and it is named in the author reference. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "Install record addition", row `skillDigests`]

Sample:

```json
{ "skillDigests": { "sk-doc": "3b1f0c4e9a2d7b6e5f8c1a0d9e4b7c2f6a3d8e1b0c5f9a2e7d4b6c1f8a3e0d5b" } }
```

**Version rule.** The install record's reader checks `schemaVersion` and the labels and keeps any other key, so the added key needs no version. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:641-651]

---

## 7. THE DRAFT `SKILL.md`

The draft is a Markdown file with a YAML frontmatter block and five sections. `design/draft-template.md` holds the literal template, the field table that names which run-record field fills each value and the validator proof. This section fixes only its place in the record set: it is written first, it is never read by the runtime, and it is the file the operator moves into the checkout after an accepted review.

---

## 8. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The settle writes `answer.json` beside `proposal.json` | `contracts/answer-seam.md` step 13 requires a skill decision recorded beside the proposal and names no file. The item's `answer` object is the answer's record, and a reader of the proposals folder would otherwise have to read the item folder to learn what was decided |
| The review item's `prompt` is its `question` | The validator refuses an empty `prompt` and no run is parked, so the field cannot hold a parked prompt. Copying the question keeps one text in two fields rather than inventing a placeholder |
| The review item's `specFolder` is `null` | The run record carries no spec folder, and a review writes no spec document |
| `revisionRead` is the digest of the bytes read, not of the parsed body | The pin must catch any change to the file, including a whitespace edit, and a digest over bytes is the only form that does |
| `posture.skills` holds no body text | The prompt is already recorded on a parked item, and a second copy would be a second truth. `spec.md` puts a per-run copy of the bodies out of scope |
| The question is `Propose skill <name>?` and names no run id | The item's `id` is the run id and the screen's row draws it, so a longer question would be clipped in the 80x24 row and would repeat what the row already shows |
| The review item's `grants.kind` is `other` and its `rung` is `bot` | The question names no action kind and the ladder has no rung for a repository change, so the fallback is the honest answer and this phase adds no rung |
