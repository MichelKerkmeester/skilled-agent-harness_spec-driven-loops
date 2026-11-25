---
title: "Design: memory state machines and sequences"
description: "The memory file state machine, the proposal item state machine, the append and forget write protocol machines, and four Mermaid sequences for bots remember, a proposing run, a confirm and a reject, each with the test it gives."
trigger_phrases:
  - "memory state machine"
  - "memory proposal item lifecycle"
  - "remember sequence"
  - "confirm reject sequence"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Memory state machines and sequences

Three machines and four sequences. Each one is drawn from the contracts rather than invented here, and each one names the test that proves it. The item's own transitions are the packet's, so this note draws only the part this phase adds and cites the rest. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md:38]

---

## 1. THE MEMORY FILE STATE MACHINE

A file is absent, present or over its bound. Nothing in this phase deletes one.

```mermaid
stateDiagram-v2
  [*] --> Absent
  Absent --> Absent: a read, which creates nothing
  Absent --> Present: the first append creates the folder 0700 and the file 0600
  Present --> Present: an append that passes both bounds
  Present --> Present: a forget of an entry that exists
  Present --> Present: a hand edit that leaves a line the parser skips
  Present --> Refused: an append at 60 entries or at 3600 bytes
  Refused --> Present: nothing was written, the file is byte for byte unchanged
  Present --> Present: two appends race and the file ends one line over its bound
  Present --> [*]: never deleted by this phase

  note right of Absent
    A read of an absent file returns
    no entries and a byteCount of 0.
    The path is still printed.
  end note
  note left of Present
    A skipped line is counted and never
    printed. The rest of the file still
    reaches the prompt.
  end note
  note right of Refused
    The detail names the path and the
    counts the check saw, so the operator
    knows which bound was reached.
  end note
```

| From | Event | To | Writer | Test |
|------|-------|----|--------|------|
| Absent | A read | Absent | none | `memory.vitest.ts`, `absent file` |
| Absent | The first append | Present | `appendMemoryEntry` | `memory.vitest.ts`, `owner-only` |
| Present | An append under both bounds | Present | `appendMemoryEntry` | `memory.vitest.ts`, `shared append` |
| Present | A forget of an entry that exists | Present | `forgetMemoryEntry` | `memory.vitest.ts`, `forget` |
| Present | A hand edit that leaves a bad line | Present | the operator | `memory.vitest.ts`, `torn line` |
| Present | An append at a bound | Refused | none | `memory.vitest.ts`, `bound` |
| Present | Two appends at once | Present, one line over | `appendMemoryEntry` twice | `memory.vitest.ts`, `two appends` |

The over-bound state is the one the protocol accepts rather than prevents. Section 4 of [`module-contract.md`](module-contract.md) states the bound and the reason.

---

## 2. THE PROPOSAL ITEM STATE MACHINE

The item's states are the packet's three, derived on every read and never stored. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md:38] This machine draws the `memory-proposal` kind only.

```mermaid
stateDiagram-v2
  [*] --> None
  None --> Open: a clean run prints a valid remember line
  None --> None: the line names no type, so remember-type-invalid is recorded
  None --> None: the fact holds a secret literal, so memory-proposal-secret is recorded
  None --> None: the run failed, or the answer also holds a decision line
  Open --> Open: a refusal in steps 1 to 10, the item stays open
  Open --> Answered: steps 11 and 13, the answer and the grant written, then the settle
  Open --> Expired: now reaches expiresAt
  Answered --> Answered: the same text and scope again, the duplicate path
  Answered --> Answered: another text or scope, refused item-answered-differently
  Expired --> Expired: any answer, refused item-expired
  Answered --> [*]: settled, and it holds no bot at any point
  Expired --> [*]

  note right of Open
    botId is the sentinel memory-proposals.
    options is confirm and reject.
    holdForBot and itemAwaitingResume
    skip it because kind is not decision.
  end note
  note left of Answered
    resumeRequestId is the derived id,
    which names no queued file. No resume
    request is built for a review item.
  end note
```

| From | Event | To | Writer | Holds the bot's unattended runs |
|------|-------|----|--------|---------------------------------|
| None | A clean run prints `[REMEMBER] <type> <fact>` | Open | `runner.ts` | No |
| None | The line names no type or a type outside the four | None | `runner.ts` records `remember-type-invalid` | No |
| None | The fact holds a known secret literal | None | `runner.ts` records `memory-proposal-secret` | No |
| None | The answer also holds a `[NEEDS-DECISION]` line | None | the runner's gate parks the run instead | Yes, as a decision item |
| Open | A refusal in steps 1 to 10 | Open | none | No |
| Open | Steps 11 and 13 | Answered, settled | `answerItem` | No |
| Open | `now` reaches `expiresAt` | Expired | none, derived | No |
| Answered | The same text and scope again | Answered | `answerItem`, duplicate path | No |
| Answered | Another text or scope | Answered | none, refused `item-answered-differently` | No |
| Expired | Any answer | Expired | none, refused `item-expired` | No |

The two filters are what keep the bot free. `holdForBot` and `itemAwaitingResume` both skip every item whose `kind` is not `decision`, so the sentinel never has to be special-cased and a later review kind inherits the same rule. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md:38]

---

## 3. THE WRITE PROTOCOL MACHINES

### 3.1 The append

```mermaid
stateDiagram-v2
  [*] --> Reading
  Reading --> Bounded: the file parsed, the entry count and the byte count known
  Bounded --> Refused: the count is 60 or more, or the size plus the line is over 3600
  Bounded --> Appending: both bounds pass
  Appending --> Done: one appendFileSync of one whole line
  Refused --> [*]
  Done --> [*]

  note right of Reading
    An absent file reads as empty
    and is not created here.
  end note
  note left of Appending
    The folder is created 0700 first
    when it is absent. The file is
    created 0600 by the same call.
  end note
```

### 3.2 The forget

```mermaid
stateDiagram-v2
  [*] --> Reading
  Reading --> Unknown: the index is below 1 or above the entry count
  Reading --> Building: the index names an entry
  Building --> Copying: the temp file holds every entry but one
  Copying --> Copying: the original grew, so the new bytes are appended to the temp
  Copying --> Renaming: the original's size is unchanged
  Renaming --> Done: the temp file replaces the original
  Unknown --> [*]
  Done --> [*]

  note right of Copying
    At most three copy-forward passes.
    This is what makes an append during
    a forget survive.
  end note
  note left of Renaming
    An append that lands between the final
    stat and the rename is lost. The window
    is one syscall wide.
  end note
```

---

## 4. THE SEQUENCES

### 4.1 `bots remember`

```mermaid
sequenceDiagram
  autonumber
  participant Cl as bots.cjs
  participant Sr as state-root.ts
  participant Mm as memory.ts
  participant Fs as the memory file
  Cl->>Cl: parse the verb, the fact, --bot, --type and --as
  Cl->>Cl: refuse a fact over 400 characters as memory-entry-too-long, exit 2
  Cl->>Sr: resolve the state root and the identity
  Cl->>Mm: sharedMemoryFile, or botMemoryFile with the bot id
  Mm-->>Cl: the absolute path, or bot-id-invalid at exit 2
  Cl->>Cl: check the fact for a known secret literal, refuse memory-secret at exit 4
  Cl->>Mm: appendMemoryEntry with the type, the date, the actor, the source and the text
  Mm->>Fs: read, parse, check both bounds
  alt a bound is reached
    Mm-->>Cl: memory-full with the path and the counts
    Cl-->>Cl: print bots: memory-full: path (n entries, b bytes), exit 4
  else both bounds pass
    Mm->>Fs: one appendFileSync of one whole line
    Mm-->>Cl: the index, the entry count and the byte count
    Cl-->>Cl: print bots: entry n in path (count entries, bytes bytes), exit 0
  end
```

### 4.2 A run that proposes a fact

```mermaid
sequenceDiagram
  autonumber
  participant Rn as runner.ts
  participant Mm as memory.ts
  participant Dp as dispatch.ts
  participant Ch as the child
  participant Ny as needs-you.ts
  Rn->>Mm: readMemoryFile for the shared file and the bot's own file
  Mm-->>Rn: the entries and the skipped counts
  Rn->>Mm: renderMemoryBlock for each file that holds an entry
  Mm-->>Rn: the blocks, the shared file's first
  Rn->>Dp: buildBotPrompt with the blocks and the request prompt
  Dp-->>Rn: the prompt, or prompt-over-budget at exit 4
  Rn->>Rn: body-secret over every block, labelled memory path
  Rn->>Ch: dispatch
  Ch-->>Rn: the output and the exit
  Rn->>Rn: parseDecisionMarker finds no decision line
  Rn->>Rn: parse the remember line
  alt the line names no type, or a type outside the four
    Rn->>Rn: record remember-type-invalid, write no item, the run stays completed
  else the fact holds a known secret literal
    Rn->>Rn: record memory-proposal-secret, write no item, the run stays completed
  else the line is valid
    Rn->>Ny: writeNeedsYouItem with kind memory-proposal, botId memory-proposals and the three proposal keys
    Rn->>Rn: the run ends completed, never awaiting-decision
  end
```

### 4.3 `bots answer confirm`

```mermaid
sequenceDiagram
  autonumber
  participant Cl as bots.cjs
  participant An as answer.ts
  participant It as the item and its lock
  participant Mm as memory.ts
  participant Fs as the memory file
  Cl->>An: answerItem with the text confirm
  An->>It: take the lock, read the item, judge the state
  An->>An: the secret check over the answer text
  An->>An: the review claim, which refuses any text but confirm or reject
  An->>It: one write of the answer and the grant
  An->>An: stamp answeredBy on the run record
  An->>An: the review settle
  An->>Fs: read the target file and look for the source bot:botId (run runId)
  alt the source is already there
    An->>An: the effect already landed, so append nothing
  else the source is absent
    An->>An: check the fact for a known secret literal, refuse memory-secret at exit 4
    An->>Mm: appendMemoryEntry with the operator as actor and the run source
    Mm->>Fs: one appendFileSync of one whole line
  end
  An->>It: write the derived resumeRequestId, stamp the generation, release the lock
  An-->>Cl: reviewed
  Cl-->>Cl: print bots: item id answered; memory-proposal review recorded, exit 0
```

### 4.4 `bots answer reject`

```mermaid
sequenceDiagram
  autonumber
  participant Cl as bots.cjs
  participant An as answer.ts
  participant It as the item and its lock
  participant Fs as the memory file
  Cl->>An: answerItem with the text reject, or with deny, no or n
  An->>It: take the lock, read the item, judge the state
  An->>An: the review claim reads a NO as reject with the scope deny
  An->>It: one write of the answer and the grant, scope deny
  An->>An: stamp answeredBy on the run record
  An->>An: the review settle appends nothing and touches no file
  An->>It: write the derived resumeRequestId, stamp the generation, release the lock
  An-->>Cl: reviewed
  Cl-->>Cl: print bots: item id answered; memory-proposal review recorded, exit 0
```

The reject path reads the file only to confirm the fact is not already there, and it writes nothing either way. A reject is the operator saying the fact is wrong, so the file must be byte for byte unchanged.

---

## 5. THE TESTS THESE MACHINES GIVE

| Machine | Test | What it asserts |
|---------|------|-----------------|
| The file machine | `memory.vitest.ts`, `absent file` | A read of an absent file returns no entries, a byte count of 0 and creates nothing |
| The file machine | `memory.vitest.ts`, `owner-only` | The first append makes the folder 0700 and the file 0600 |
| The file machine | `memory.vitest.ts`, `bound` | An append at 60 entries or 3,600 bytes refuses `memory-full` and leaves the bytes unchanged |
| The file machine | `memory.vitest.ts`, `two appends` | Two appends at 59 entries both succeed and the file ends at 61 |
| The item machine | `needs-you.vitest.ts`, `proposal` | `holdForBot` and `itemAwaitingResume` both return null for a `memory-proposal` item |
| The item machine | `runner.vitest.ts`, `remember` | A clean run with a valid line writes one open item with the three keys and the sentinel |
| The item machine | `runner.vitest.ts`, `remember type` | A line naming no type writes no item and records `remember-type-invalid` |
| The append machine | `memory.vitest.ts`, `shared append` | One append writes one line and returns index 1 |
| The forget machine | `memory.vitest.ts`, `forget` | Entry 1 is gone, entry 2 keeps its text and its index becomes 1 |
| The forget machine | `memory.vitest.ts`, `append during forget` | An append that lands during a forget survives the rename |
| The confirm sequence | `answer.vitest.ts`, `proposal` | The fact lands in `proposalBotId`'s file with the operator as actor and the run source |
| The confirm sequence | `answer.vitest.ts`, `proposal settle twice` | A second confirm appends nothing, because the source is already there |
| The reject sequence | `answer.vitest.ts`, `proposal` | A reject appends nothing and the file is unchanged |

---

## 6. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The settle's idempotency check is the entry's source, `bot:<botId> (run <runId>)` | The source is already unique per proposing run, so no extra key and no extra file is needed to tell whether the effect landed |
| A reject reads the file and writes nothing | The check costs one read and makes the "unchanged" claim testable |
| The over-bound state is drawn rather than hidden | Two racing appends can produce it, and a builder who does not know will add a lock the protocol forbids |
| The item machine draws only the `memory-proposal` kind | The `decision` and `skill-proposal` kinds are the packet's, and 009 draws its own |
