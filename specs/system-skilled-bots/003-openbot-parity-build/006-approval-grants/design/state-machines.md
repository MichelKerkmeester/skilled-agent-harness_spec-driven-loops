---
title: "Design: state machines and sequences of the approval grant"
description: "The grant lifecycle, the item and lock machine, the answer sequence, the gate sequence, the classifier flow and the ladder flow, drawn in Mermaid, with the rule each diagram fixes."
trigger_phrases:
  - "grant lifecycle diagram"
  - "answer sequence diagram"
  - "classifier flow"
  - "approval ladder flow"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# State machines and sequences of the approval grant

Six diagrams. The first two are state machines, the next two are sequences and the last two are decision flows. Each one closes a question the phase documents leave open: what a grant's states are, what the lock does to the item's states, which write happens in which order, and which of the six kinds wins when a question names more than one.

The step numbers in the answer sequence are `contracts/answer-seam.md` section 1's and are not renumbered here. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE"] The item's own transitions are `contracts/answer-seam.md` section 2's. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "2. ITEM STATE TRANSITIONS"]

---

## 1. THE GRANT LIFECYCLE

Four states and no fifth. A grant is never a standing allow in this packet, so there is no `allowed-always` state and no transition to one. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "3. GRANT LIFECYCLE"]

```mermaid
stateDiagram-v2
  [*] --> BornOpen: the item is written, by the gate, the memory-proposal branch, the skill proposal or the fatigue item
  BornOpen --> Granted: step 11, scope once
  BornOpen --> Denied: step 11, scope deny, given or derived from a NO
  BornOpen --> ExpiredWithItem: now reaches expiresAt with no answer
  Granted --> Granted: the same text and scope again, the duplicate path
  Denied --> Denied: the same text and scope again, the duplicate path
  Granted --> Granted: another text or scope, refused item-answered-differently, nothing written
  Denied --> Denied: another text or scope, refused item-answered-differently, nothing written
  ExpiredWithItem --> ExpiredWithItem: any answer, refused item-expired, nothing written
  Granted --> [*]
  Denied --> [*]
  ExpiredWithItem --> [*]

  state BornOpen {
    scope: null
    grantedBy: null
    grantedAt: null
  }
  state Granted {
    scope: once
    grantedBy: the actor
    grantedAt: the answer's answeredAt
  }
  state Denied {
    scope: deny
    grantedBy: the actor
    grantedAt: the answer's answeredAt
  }
  state ExpiredWithItem {
    scope: null
    grantedBy: null
    grantedAt: null
  }
```

Rules the diagram fixes:

- `kind`, `action` and `rung` are set at birth and never change. No transition above touches them.
- A refused answer is a self-transition that writes nothing, so a refusal can never move a grant out of `BornOpen`.
- `ExpiredWithItem` is derived on read and never stored, the same way the item's `expired` state is. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:135]
- There is no `Revoked` state. A grant lives and dies with its item, and the packet records no standing allow to revoke.

---

## 2. THE ITEM AND THE LOCK

The item's state is derived and the lock is stored, so they are two machines that meet at one point: the lock is held across the read, the judgement and the write.

```mermaid
stateDiagram-v2
  state "Item: open" as Open
  state "Item: answered" as Answered
  state "Item: expired" as Expired
  state "Lock: free" as Free
  state "Lock: held" as Held
  state "Lock: stale" as Stale

  [*] --> Free
  Free --> Held: step 6, exclusive create succeeds
  Free --> Held: step 6, a stale lock was renamed away and the create retried
  Held --> Free: step 18, released on every exit path
  Held --> Stale: the process is killed outright
  Stale --> Free: the next answer finds the pid gone or the age past 60 s
  Held --> Held: a second answer waits up to 2,000 ms, then item-busy

  [*] --> Open: a writer writes the item
  Open --> Answered: step 11, one atomic write
  Open --> Expired: now reaches expiresAt, derived on read
  Answered --> Answered: the same text and scope, the duplicate path
  Answered --> Answered: another text or scope, refused item-answered-differently
  Expired --> Expired: any answer, refused item-expired

  note right of Held
    The lock is taken before the read, not before the write.
    Two answers that both read open before either locks
    would both write, which is the race this phase closes.
  end note
```

Rules the diagram fixes:

- The lock is taken at step 6 and released at step 18, so it spans the read at step 7, the judgement at step 8 and the write at step 11. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE"]
- A stale lock never blocks the next answer. The reclaim in `design/records.md` section 3.2 is the only edge out of `Stale`.
- The item's three states are derived on every read and never stored, so a lock cannot leave an item in a fourth state.
- `item-busy` is the only refusal the lock itself raises, and a retry with the same text and scope is safe because the answer is idempotent for one text and one scope.

---

## 3. THE ANSWER SEQUENCE

Seven lanes. The operator, the CLI, `answerItem`, the lock file, the item file, the request queue and the run record. The sequence opens on an open item whose grant is born open.

```mermaid
sequenceDiagram
  autonumber
  actor Op as Operator
  participant Cli as bots.cjs
  participant An as answerItem
  participant Lk as needs-you item-id.lock
  participant It as needs-you item-id.json
  participant Rq as requests queue
  participant Rr as run record

  Op->>Cli: answer ITEM yes --scope deny --as ada
  Cli->>Cli: step 1, parse --scope and --as, refuse always and conversation as grant-scope-unsupported, exit 2
  Cli->>An: answerItem with the text, the scope and the actor
  An->>An: step 2, blank text refuses answer-empty
  An->>An: step 3, queueContext resolves the identity and the state root
  An->>An: step 4, the actor is --as, then the pinned operator, then the OS user
  An->>An: step 5, a present roster must name the actor, else answer-not-approver
  An->>Lk: step 6, exclusive create with pid, nonce and createdAt
  alt the lock is held by a live owner
    An->>Lk: poll every 50 ms for up to 2,000 ms
    An-->>Cli: item-busy, exit 4
  else the owner is gone or the lock is past 60 s
    An->>Lk: rename to item-id.lock.nonce.stale, unlink, create again
  end
  An->>It: step 7, read and validate
  An->>An: step 8, derive the scope, then judge the state
  alt the item is expired
    An-->>Cli: item-expired, exit 4
  else the item is answered with another text or another scope
    An-->>Cli: item-answered-differently, exit 4
  else the item is answered with the same text and scope
    An->>An: the duplicate path, steps 9 to 11 are skipped
  end
  An->>An: step 9, the secret-literal scan refuses answer-secret
  An->>An: step 10, the review claim, a review kind checks the answer before anything is written
  An->>It: step 11, one atomic write of answer text, answeredAt, by, scope and grant scope, grantedBy, grantedAt
  An->>Rr: step 12, stamp answeredBy on the run the item names
  An->>An: step 13, the review settle, or the no-resume option, then skip to step 16
  An->>Rq: step 15, write the seen marker, then rename the request into the watched folder
  An->>It: step 16, write resumeRequestId
  An->>An: step 17, advance the generation stamp
  An->>Lk: step 18, remove the lock on every exit path
  An-->>Cli: enqueued, duplicate or reviewed
  Cli-->>Op: bots: item ITEM answered, resume request RID enqueued, exit 0
```

Rules the sequence fixes:

- The scope is derived at step 8 and written at step 11, so a refusal at steps 1 to 10 leaves the grant born open.
- The grant and the answer are one write. A stop between them is impossible, which is why `grantedAt` can equal `answeredAt` without a second read.
- The lock is released at step 18 on every path, including the three refusals drawn above and a throw.
- A refusal at steps 1 to 10 writes nothing, so the item stays open and the bot stays held.
- The duplicate path skips steps 9 to 11 and still reaches step 15, which returns `duplicate` because the seen marker exists.

---

## 4. THE GATE SEQUENCE

Five lanes. The child, the runner, the classifier, the ladder and the item file. The sequence opens after the child has exited and the runner has read its final answer text.

```mermaid
sequenceDiagram
  autonumber
  participant Ch as the child
  participant Ru as runner.ts
  participant Ak as action-kind.ts
  participant Al as approval-ladder.ts
  participant It as needs-you item-id.json

  Ch-->>Ru: final answer text carrying [NEEDS-DECISION] delete the stale branch?
  Ru->>Ru: parseDecisionMarker reads the question and the option lines
  alt the marker carries no question
    Ru->>Ru: decision-marker-empty, the run fails with class author
  else the marker carries a question
    Ru->>Ak: classifyAction over the whole question
    Ak->>Ak: test pay, credentials, delete, send, share, post in that order
    Ak-->>Ru: delete
    Ru->>Ak: read one [ACTION: kind] line, if the question carries one
    alt the declared kind is outside the six
      Ak-->>Ru: action-kind-invalid, no item is written, the run fails with class author
    else the declared kind is one of the six
      Ak-->>Ru: the earlier of the declared and the classified kind in the order
    end
    Ru->>Al: decideApproval with the kind
    alt a kind was found
      Al-->>Ru: asks true, rung kind
    else no kind was found
      Al-->>Ru: asks true, rung bot
    end
    Ru->>It: write the item with grants kind, action, rung and three nulls
    Ru->>Ru: exit awaiting-decision, class operator, exit code 5
  end
```

Rules the sequence fixes:

- The classifier reads the question the runner already holds, so the gate adds no file read and no process.
- The `[ACTION: <kind>]` line is read after the classification and never instead of it, which is what makes it a floor.
- `decideApproval` is called with the kind and returns rung 1 or the `bot` fallback. It is never called with a rule, an auto-review switch or an extra-vigilant switch, because no store supplies them.
- A refused `[ACTION: <kind>]` line writes no item, so the run cannot park and the failure is the run's own.

---

## 5. THE CLASSIFIER

The six kinds in OpenBot's order, then the declaration floor, then `other`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:5]

```mermaid
flowchart TD
  A[the whole question] --> B{pay words anywhere}
  B -- yes --> P[kind pay]
  B -- no --> C{credentials words anywhere}
  C -- yes --> Q[kind credentials]
  C -- no --> D{delete words anywhere}
  D -- yes --> R[kind delete]
  D -- no --> E{send words anywhere}
  E -- yes --> S[kind send]
  E -- no --> F{share words anywhere}
  F -- yes --> T[kind share]
  F -- no --> G{post words anywhere}
  G -- yes --> U[kind post]
  G -- no --> V[kind other]
  P --> W{an ACTION line names a kind}
  Q --> W
  R --> W
  S --> W
  T --> W
  U --> W
  V --> W
  W -- no --> X[the classified kind stands]
  W -- yes, earlier in the order --> Y[the declared kind wins]
  W -- yes, later in the order --> X
  W -- yes, outside the six --> Z[action-kind-invalid, no item]
```

Rules the flow fixes:

- The first match wins, so a payment that also deletes reads as `pay`.
- The scan is over the whole question, so a benign first sentence cannot hide a delete in the second.
- The declaration is compared after the scan and can only move the kind earlier in the order.
- `other` is a result and never a declaration.

---

## 6. THE LADDER

Four rungs and a fallback. Only rung 1 and the fallback are implemented, and the diagram marks the three that are not. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3]

```mermaid
flowchart TD
  A[a parked question] --> B{rung 1, a kind of action asks}
  B -- yes --> C[rung kind, the bot asks]
  B -- no --> D{rung 2, a rule matches}
  D -- not implemented in this phase --> E[rung rule]
  D -- no store --> F{rung 3, auto-review is on}
  F -- not implemented in this phase --> G[rung auto-review]
  F -- no store --> H{rung 4, extra vigilant is on}
  H -- not implemented in this phase --> I[rung extra-vigilant]
  H -- no store --> J[the bot fallback, rung bot]
  C --> K[the grant records the rung]
  J --> K
  E -.-> L[never returned in this phase]
  G -.-> L
  I -.-> L
```

Rules the flow fixes:

- The first answer wins, so a kind beats a rule and a rule beats auto-review.
- Rungs 2 to 4 are drawn so the order is readable and marked so no builder implements them.
- The fallback is `bot` and not a fifth rung. The `rung` enum holds five values and the ladder holds four rungs, which is one list read two ways.
- `decideApproval` returns `kind` or `bot` and nothing else, so a test can assert the closed set.

---

## 7. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The grant's lifecycle is four states with no `Revoked` | The packet records no standing allow, so there is nothing to revoke [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "3. GRANT LIFECYCLE"] |
| The lock is drawn as its own machine rather than as a fourth item state | The item's state is derived and the lock is stored, so one machine cannot hold both without storing a derived value |
| The answer sequence draws the lock before the read | Two answers that both read `open` before either locks would both write, which is the race this phase closes |
| The gate sequence reads the declaration after the classification | Reading it first would make it an override rather than a floor |
| The ladder draws rungs 2 to 4 and marks them | A reader must see the order OpenBot uses, and a builder must not implement what no store supplies |
| The classifier's flow ends at one kind and never at a set | The grant holds one `kind`, so a question naming two kinds must resolve to one |
