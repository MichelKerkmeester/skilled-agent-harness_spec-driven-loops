---
title: "Design: the skills loader and the proposal lifecycle"
description: "Three Mermaid state machines: the loader's decision path per skill name, the proposal's lifecycle from no proposal to a settled review, and the review answer path through the claim and the settle."
trigger_phrases:
  - "skills loader state machine"
  - "proposal lifecycle"
  - "skill review answer path"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The skills loader and the proposal lifecycle

Three machines, one per decision this phase makes. Each is drawn so a builder writes the branches in the order drawn, and each names the refusal on the edge that produces it. The refusal catalogue is `design/refusals.md`. The records are `design/record-schemas.md`.

Paths are relative to the repository root. `$R` is `.skilled/skills/system-skilled-bots/runtime`.

---

## 1. THE LOADER'S DECISION PATH

`loadSkills` walks the list in the order the definition wrote it and stops at the first refusal, so a run never dispatches with a partial list. The order of the four checks per name is fixed here and is not the builder's to choose.

```mermaid
stateDiagram-v2
  [*] --> Empty: the definition carries no skills key, or an empty list
  Empty --> [*]: renderSkillsPrompt returns no block, the prompt is today's byte for byte

  [*] --> NextName: the list names at least one skill
  NextName --> Resolve: take the next name in list order
  Resolve --> Unknown: the file does not exist
  Unknown --> [*]: refuse skill-unknown, class author, exit 4, no child starts

  Resolve --> Read: the file exists
  Read --> Unreadable: the read fails for any reason other than absence
  Unreadable --> [*]: refuse skill-unreadable, class environment, exit 4

  Read --> Measure: the bytes are in hand
  Measure --> TooLarge: the body is over 16384 bytes
  TooLarge --> [*]: refuse skill-too-large, class author, exit 4, naming the skill and its size

  Measure --> Total: the body is at most 16384 bytes
  Total --> OverBudget: the running total is over 24576 bytes
  OverBudget --> [*]: refuse skills-over-budget, class author, exit 4, naming the skill that crossed the line

  Total --> Digest: the running total is at most 24576 bytes
  Digest --> Changed: the digest differs from skillDigests for that name, or no digest is recorded
  Changed --> [*]: refuse skill-changed, class operator, exit 4, naming the skill

  Digest --> Keep: the digest equals the installed one
  Keep --> NextName: one entry appended to posture.skills
  Keep --> [*]: the list is exhausted, renderSkillsPrompt returns one block per kept entry
```

**Why size before digest.** A body over the per-skill cap can never have an installed digest, because `bots install` runs the checker and the checker refuses `skills-too-large` before the install record is written. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:569-572] So the size check is the one that can fire first in practice, and naming the bound a body broke is more use to the author than naming a digest mismatch the author cannot fix.

**Why the total is measured as the list is walked.** The refusal must name the skill that crossed the line, and the running total at that name is the only value that names it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:162]

**Why no name needs a traversal check.** `SKILL_NAME_PATTERN` is the bot-id grammar, which admits no dot, no slash and no uppercase letter, so a name can never leave `<skilledTree>/.skilled/skills/`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:88] A name outside the grammar is refused at parse time as `skills-name-invalid`, before the loader runs.

---

## 2. THE PROPOSAL'S LIFECYCLE

The proposal is three writes and one review. The write order is fixed: the draft, then `proposal.json`, then the review item last, so an interrupted run leaves files a re-run can repair and never an item pointing at a draft that does not exist.

```mermaid
stateDiagram-v2
  [*] --> NoProposal: no folder for this run id
  NoProposal --> Refused: the run record does not read
  Refused --> [*]: refuse run-record-missing or the reader's own reason, exit 4, nothing written

  NoProposal --> DraftWritten: the draft is written first
  DraftWritten --> FilesWritten: proposal.json is written second
  FilesWritten --> Open: the review item is written last
  DraftWritten --> Interrupted: the process stops
  FilesWritten --> Interrupted: the process stops
  Interrupted --> FilesWritten: a re-run with no item overwrites both files and writes the item
  Interrupted --> Open: a re-run with no item writes the item

  FilesWritten --> AlreadyExists: the review item already exists
  AlreadyExists --> [*]: refuse review-already-exists, exit 4, nothing overwritten

  Open --> Stale: an answer arrives and the target digest differs from revisionRead
  Stale --> Open: refuse proposal-stale, exit 4, nothing written, the item stays open
  Open --> Answered: an answer arrives and the digest matches
  Answered --> Settled: the settle writes answer.json
  Open --> Expired: now reaches expiresAt
  Expired --> [*]: derived on read, never answered

  Settled --> [*]: the operator moves the draft into the checkout by hand
```

**Why the item is last.** The item is the only thing a person sees. An item written before its draft would offer a review of a file that does not exist, and the answer would then read a missing `proposal.json` and fall back to not-a-proposal, which loses the review silently. Writing the item last makes an interrupted proposal invisible rather than wrong.

**Why a re-run overwrites.** The one existing guard covers an item that already exists. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:231] A re-run with files present and no item is the repair path, and it must overwrite rather than refuse, because the files it finds are the interrupted run's own output for the same run id and the same target name. A re-run with an item present refuses as today, so an open question is never erased.

**Why a stale answer leaves the item open.** The pin is checked in the claim half of the review seam, before the answer and the scope are written. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE", row 13] A refusal there writes nothing, so the item is still `open` and a fresh proposal can be reviewed against the new revision.

---

## 3. THE REVIEW ANSWER PATH

The seam has two halves. The claim runs before the write and may refuse with the item untouched. The settle runs after the write and applies the effect. `contracts/answer-seam.md` owns the numbered sequence and this machine draws only the branch this phase adds. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE"]

```mermaid
stateDiagram-v2
  [*] --> Claim: answerItem reaches step 10 with the item read
  Claim --> NotAProposal: the item's kind is not skill-proposal
  NotAProposal --> [*]: the next registered review kind is asked, or a decision item takes the existing path

  Claim --> NotAProposal: proposal.json is absent, unreadable or invalid
  Claim --> InvalidText: the text is not confirm, reject or a NO
  InvalidText --> [*]: refuse review-answer-invalid, exit 4, the item stays open

  Claim --> Stale: the target digest differs from revisionRead
  Claim --> Stale: revisionRead is null and the target now exists
  Claim --> Stale: revisionRead is not null and the target is now absent
  Stale --> [*]: refuse proposal-stale, exit 4, the item stays open

  Claim --> Claimed: the digest matches and the text is confirm or reject
  Claimed --> Written: step 11 writes the answer and the grant
  Written --> Settled: step 13 writes answer.json
  Settled --> [*]: step 16 writes resumeRequestId as the id the resume would have had, and no request is queued

  Written --> SettleInterrupted: the process stops between the write and the settle
  SettleInterrupted --> Settled: the same answer is sent again and the settle finds answer.json absent, so it writes it
```

**Why the NO set reads as `reject`.** `contracts/answer-seam.md` fixes it, so a channel answer that sends `no` records a denial rather than an approval. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "4. DECISIONS TAKEN"] The scope is `deny` and the decision word is `reject`.

**Why a damaged `proposal.json` is not a refusal.** `spec.md` NFR-R02 requires it to read as not a proposal review, so the answer path falls back to its existing behaviour rather than refusing every answer on the item. A damaged file is the operator's to repair, and refusing the answer would leave the item open with no way to close it.

**Why the settle is idempotent.** It writes `answer.json` only when the file is absent or holds a different decision. Every value it writes is copied from the answer and the proposal, so a second run writes the same bytes.

---

## 4. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The loader stops at the first refusal and returns no partial list | A run with three of four bodies is a run whose instructions are silently incomplete, which is the outcome both caps exist to prevent |
| The four checks run in the order resolve, read, size, total, digest | Each check needs the previous one's result, and the size check must precede the digest check because a body over the cap can never have an installed digest |
| The proposal writes the draft, then `proposal.json`, then the item | An item is the only thing a person sees, so it must never name a file that does not exist |
| A re-run with files and no item overwrites, and a re-run with an item refuses | The first repairs an interrupted proposal and the second protects an open question |
| The pin is checked in the claim, not the settle | A refusal in the claim writes nothing, which is what leaves the item open for a fresh proposal |
| A damaged `proposal.json` reads as not a proposal | `spec.md` NFR-R02 requires the fallback, and a refusal would leave the item open with no way to close it |
