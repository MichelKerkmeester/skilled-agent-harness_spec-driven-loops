---
title: "Design: Activity and actor sequences and state machines"
description: "Mermaid diagrams for the activity read, the refresh on read, the run row mapping, the live sources, the actor resolution, the answer verb's check order, this phase's slice of the answer seam, the answer states and the sandbox cap."
trigger_phrases:
  - "activity read sequence"
  - "refresh on read sequence"
  - "answer check order"
  - "actor resolution flow"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Activity and actor sequences and state machines

Each diagram draws a rule [data-model.md](data-model.md) states in prose. Where the two disagree the prose wins and the diagram is fixed. The whole answer path after every phase is `contracts/answer-seam.md`, and section 7 here draws only the steps this phase owns.

---

## 1. THE ACTIVITY READ

```mermaid
sequenceDiagram
  autonumber
  participant Cli as bots.cjs
  participant St as status.ts
  participant Ix as status-index.ts
  participant Fs as state root files
  participant Ac as activity.ts
  Cli->>Cli: parse activity and --json, refuse an id or an unknown option with exit 2
  Cli->>St: activityReport with the state root and the clock
  St->>Ix: openIndex
  alt the index is missing
    St->>Ix: rebuildIndex once, as statusReport does today
  end
  St->>St: refreshStale, section 2
  St->>Ix: readIndex for runs, items, generations and updatedAt
  St->>Fs: list leases, requests inbox and install records per identity
  St->>St: keep live side files, valid requests and unheld bot schedules
  St->>St: next fire per schedule through translateCron and listSlots
  St->>Ac: buildActivity with the snapshot, the three live lists, the clock and describe
  Ac->>Ac: map run rows, add item rows, sort each group, drop empty groups
  Ac-->>St: the payload object with version 1
  St-->>Cli: Result with the payload
  alt --json
    Cli->>Cli: print the payload with two-space indent to stdout
  else text
    Cli->>Cli: print the heading and row lines, or bots no activity
  end
  Cli-->>Cli: exit 0, or exit 1 with the reason and the rebuild hint
```

---

## 2. THE REFRESH ON READ

One pass per call, shared by `statusReport` and `activityReport`. The five steps are the screen contract's section 10.

```mermaid
flowchart TD
  A["for each identity key the state root holds"] --> B{"generation stamp ahead of the consumed one?"}
  B -- no --> Z["next identity, cost one stamp read"]
  B -- yes --> C["step 1: read the stamp, then list the identity's run records"]
  C --> D["begin one transaction"]
  D --> E["step 2: indexRunRecord on every listed record that validates"]
  E --> F["step 3: refreshItemRows for the identity"]
  F --> G{"item folder listed?"}
  G -- no --> R["roll back, the identity stays stale"]
  G -- yes --> H["step 4: recordGeneration with the stamp from step 1, write meta updatedAt"]
  H --> I["commit"]
  I --> Z
  D -. "a throw, a busy index past five seconds" .-> R
  R --> Z
  Z --> Y["stale is true only for identities that rolled back"]
  Y --> X["step 5: no retention, no rebuild, nothing on stderr"]
```

---

## 3. A RUN ROW'S GROUP

```mermaid
flowchart TD
  S["index run row, its summary JSON"] --> A{"exitReason is awaiting-decision?"}
  A -- yes --> N["no row, the open item stands for it"]
  A -- no --> B{"refusalCause is not null?"}
  B -- yes --> C{"exitClass is null?"}
  C -- yes --> ST["stopped"]
  C -- no --> FA["failed"]
  B -- no --> D{"exitClass is null?"}
  D -- yes --> DO["done"]
  D -- no --> FA
```

Item rows give `needs_you` only while open. An answered or expired item gives no row.

---

## 4. THE LIVE SOURCES

```mermaid
flowchart TD
  L["leases star lock run json"] --> L1{"parses with ownerPid and seed ids?"}
  L1 -- no --> SK["skip, no message"]
  L1 -- yes --> L2{"lease file beside it exists?"}
  L2 -- no --> SK
  L2 -- yes --> L3{"processAlive ownerPid?"}
  L3 -- no --> SK
  L3 -- yes --> L4{"a run record exists for seed runId?"}
  L4 -- yes --> SK
  L4 -- no --> W["working row"]

  Q["requests inbox star json"] --> Q1{"validateRequest ok?"}
  Q1 -- no --> SK
  Q1 -- yes --> QS["scheduled row, at enqueuedAt, actor null"]

  I["installs star json"] --> I1{"agent bot, schedule set, hold null?"}
  I1 -- no --> SK
  I1 -- yes --> I2{"translateCron ok?"}
  I2 -- no --> SK
  I2 -- yes --> I3{"a slot in the 1, 32, 366 or 1462 day window?"}
  I3 -- no --> SK
  I3 -- yes --> IR["scheduled row and recurring row, same at, actor from the install record"]
```

---

## 5. THE ACTOR

```mermaid
flowchart TD
  A["resolveActor with as, env and scheduled"] --> B{"as given?"}
  B -- yes --> C["trim"]
  C --> D{"matches ACTOR_PATTERN?"}
  D -- no --> RF["refusal, the CLI prints bots --as takes a name"]
  D -- yes --> OK["actor is the trimmed as"]
  B -- no --> E{"env SKILLED_BOTS_OPERATOR set, matching and scheduled?"}
  E -- yes --> OP["actor is the pinned operator"]
  E -- no --> E2{"env SKILLED_BOTS_OPERATOR set and matching, but not scheduled?"}
  E2 -- yes --> TTY{"stdin a tty, or the name is the OS user?"}
  TTY -- yes --> OP
  TTY -- no --> RF2["refusal, the CLI prints bots --as needs a tty"]
  E2 -- no --> F{"os userInfo username resolves and matches?"}
  F -- yes --> OS["actor is the OS user"]
  F -- no --> NU["actor is null"]
```

`env` is the environment the run or the answer executes under, never `resolveEnv`. [data-model.md](data-model.md) section 8 says why. `scheduled` is true on a scheduled fire or a scheduled drain, so a shell that exports the pinned name takes the tty rule instead of the name.

---

## 6. THE ANSWER VERB'S CHECK ORDER

Every check here runs in `bots.cjs` before the runtime loads, so each refusal exits 2 and touches no file. The messages are [refusals.md](refusals.md) section 1.

```mermaid
flowchart TD
  P["parseArgs"] --> C0{"SKILLED_BOT_RUN_ID or AI_SESSION_CHILD=1 in the environment?"}
  C0 -- yes --> U0["child-write-refused, exit 2"]
  C0 -- no --> P1{"known options only, answer takes as and scope?"}
  P1 -- no --> U1["unknown option or answer takes no option, exit 2"]
  P1 -- yes --> P2{"item id and non-blank text?"}
  P2 -- no --> U2["answer needs the answer text, exit 2"]
  P2 -- yes --> A1{"--as given?"}
  A1 -- yes --> A2{"value blank after trim?"}
  A2 -- yes --> U3["option --as needs a value, exit 2"]
  A2 -- no --> A3{"matches ACTOR_PATTERN?"}
  A3 -- no --> U4["--as takes a name, exit 2"]
  A3 -- yes --> S1
  A1 -- no --> S1{"--scope given?"}
  S1 -- no --> T1
  S1 -- yes --> S2{"value always or conversation?"}
  S2 -- yes --> U5["grant-scope-unsupported, exit 2"]
  S2 -- no --> S3{"value once or deny, exact case?"}
  S3 -- no --> U6["--scope takes once or deny, exit 2"]
  S3 -- yes --> T1{"--as given and not the OS user and stdin not a tty?"}
  T1 -- yes --> U7["--as needs a tty, exit 2"]
  T1 -- no --> T2{"SKILLED_BOTS_OPERATOR set, not a scheduled fire or drain, not the OS user and stdin not a tty?"}
  T2 -- yes --> U7
  T2 -- no --> RT["load the runtime and call answerItem with actor and scope"]
```

`bots run --as` takes the same `--as` branch and the same tty check. `bots schedule install --full-access` takes the tty check alone, with the message `bots: --full-access needs a tty`. `bots enable` takes the child check alone, because it writes the fatigue item's answer and takes no `--as`.

---

## 7. THIS PHASE'S SLICE OF THE ANSWER SEAM

Step numbers are `contracts/answer-seam.md` section 1. Steps this phase does not touch are drawn as one line each.

```mermaid
sequenceDiagram
  autonumber
  participant Cli as bots.cjs
  participant An as answer.ts
  participant Ac as actor.ts
  participant It as needs-you item
  participant Rr as run record
  participant Qu as request-queue.ts
  Cli->>An: answerItem with itemId, text, scope, actor and env
  Note over Cli,An: step 1 ran in bots.cjs, section 6
  An->>An: step 2 blank text, step 3 repository
  An->>Ac: step 4 resolveActor with the actor passed and env
  An->>It: step 7 read and validate, an old answer reads by null and scope once
  An->>An: step 8 expired refuses, same text and scope is the duplicate path, other text or scope refuses
  An->>An: step 9 secret check over the text
  alt the item is open
    An->>It: step 11 write answer text, answeredAt, by and scope in one write
  end
  An->>Rr: step 12 read the record the item runId names
  alt the record exists and answeredBy differs
    An->>Rr: write answeredBy
  else no record yet
    An->>An: skip, no refusal
  end
  An->>Qu: steps 14 and 15 build and enqueue the resume
  An->>It: step 16 resumeRequestId when unset
  An->>An: step 17 generation stamp when anything changed
  An-->>Cli: enqueued or duplicate
```

---

## 8. THE ANSWER'S STATES

This phase's view of `contracts/answer-seam.md` section 2. The grant columns land with 006.

```mermaid
stateDiagram-v2
  [*] --> Open: the gate parks a question, no kind key written
  Open --> AnsweredOnce: answer with scope once or no scope
  Open --> AnsweredDeny: answer with scope deny
  Open --> Expired: the clock reaches expiresAt
  AnsweredOnce --> AnsweredOnce: same text and scope once, duplicate
  AnsweredDeny --> AnsweredDeny: same text and scope deny, duplicate
  AnsweredOnce --> AnsweredOnce: other text or scope, refused item-answered-differently
  AnsweredDeny --> AnsweredDeny: other text or scope, refused item-answered-differently
  Expired --> Expired: any answer, refused item-expired
  Legacy --> AnsweredOnce: an answer stored before this phase reads by null and scope once
```

---

## 9. THE SANDBOX CAP

| Declared sandbox | Install record `fullAccess` | Honored and recorded as `posture.sandbox` |
|------------------|-----------------------------|--------------------------------------------|
| `read-only` | either | `read-only` |
| `workspace-write` | either | `workspace-write` |
| `danger-full-access` | `false`, or no install record | `workspace-write` |
| `danger-full-access` | `true` | `danger-full-access` |
| none declared | either | unchanged from today's rule |

```mermaid
flowchart LR
  D["declared sandbox"] --> X{"danger-full-access?"}
  X -- no --> K["keep as declared"]
  X -- yes --> Y{"install record fullAccess true?"}
  Y -- yes --> K
  Y -- no --> C["honor workspace-write, record workspace-write"]
```
