---
title: "Design: the four sequences of computer exposure"
description: "Four Mermaid sequence diagrams: a worktree run, a shared run, a resumed run whose parked prompt lacks the line and a status read over an index built before this phase and one built after it."
trigger_phrases:
  - "working place sequence"
  - "shared run branch sequence"
  - "status read sequence"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The four sequences

Each diagram covers one path this phase touches, from the caller to the file on disk. The participants are the real modules. The order is the order the code runs in, and where this phase inserts a step the diagram says so.

The run's own fixed order is [`contracts/runtime-architecture.md`](../../contracts/runtime-architecture.md) section 3.1 and these diagrams are the same run with this phase's two steps marked. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md, section "3.1 A run"]

---

## 1. A WORKTREE RUN

The tree is made, its branch is already known and no git read happens. The line and the record take the same value.

```mermaid
sequenceDiagram
  autonumber
  participant Cl as launchd or bots.cjs
  participant Rn as runner.ts
  participant Po as posture.ts
  participant Is as isolation.ts
  participant Dp as dispatch.ts
  participant Ch as executor child
  participant Rc as run-record.ts
  participant Ix as status-index.ts
  participant St as status.ts

  Cl->>Rn: runBot with a request kind
  Rn->>Po: resolve the isolation answer
  Po-->>Rn: worktree
  Rn->>Is: createBotWorktree
  Is-->>Rn: the tree, its path and its branch
  Note over Rn: 004 step one. The branch is the tree's own, so no git read runs.
  Rn->>Rn: workDir is the tree's path, branch is the tree's branch
  Rn->>Rn: seed.evidence.worktreePath and seed.evidence.branch are set
  Rn->>Dp: buildBotPrompt with the working place
  Dp-->>Rn: the prompt, the line third
  Note over Rn: 005's budget check runs here, after the tree exists. A refusal finishes the fresh tree or returns a resumed one to kept, so no refusal leaves a tree recorded as active.
  Rn->>Ch: dispatch with cwd equal to workDir
  Ch-->>Rn: output and exit
  Rn->>Rc: writeRunRecord
  Rc->>Rc: validateRunRecord, which requires both strings inside the tree block
  Rc-->>Rn: the record path
  Rn->>Ix: addRun with summarizeRecord
  Ix->>Ix: the summary carries worktreePath and branch
  St->>Ix: read the run row
  St->>St: append branch then worktree to the row
```

**What the diagram fixes.** The branch is read from the tree and never from git, so a rebase between the tree's creation and the dispatch cannot make the prompt and the record disagree. The validator's string requirement is satisfied because the tree block is present.

---

## 2. A SHARED RUN

No tree is made, so the branch comes from one git read. This is the path the phase exists for: today it records null and the prompt names nothing.

```mermaid
sequenceDiagram
  autonumber
  participant Cl as launchd or bots.cjs
  participant Rn as runner.ts
  participant Po as posture.ts
  participant Is as isolation.ts
  participant Gt as git
  participant Dp as dispatch.ts
  participant Ch as executor child
  participant Rc as run-record.ts

  Cl->>Rn: runBot with a request kind
  Rn->>Po: resolve the isolation answer
  Po-->>Rn: shared
  Note over Rn: no tree is made, so workDir is the checkout root
  Rn->>Rn: workDir is context.checkoutRoot
  Note over Rn,Is: 004 step one. One git read, and it never refuses the run.
  Rn->>Is: checkoutBranch(checkoutRoot, env)
  Is->>Gt: rev-parse --abbrev-ref HEAD
  alt a branch name
    Gt-->>Is: main
    Is-->>Rn: main
  else the literal HEAD
    Gt-->>Is: HEAD
    Is-->>Rn: null
  else a non-zero status, a null status or empty stdout
    Gt-->>Is: nothing usable
    Is-->>Rn: null
  end
  Rn->>Rn: seed.evidence.branch is the value, worktreePath stays null
  Rn->>Dp: buildBotPrompt with the working place
  Dp-->>Rn: the prompt, the line third, the branch clause present or absent
  Rn->>Ch: dispatch with cwd equal to the checkout root
  Ch-->>Rn: output and exit
  Rn->>Rc: writeRunRecord
  Rc->>Rc: validateRunRecord, no tree block, so no string requirement
  Rc-->>Rn: the record path
```

**What the diagram fixes.** The git read sits after the posture resolves and before the builder runs, so a shared run pays for it once and a worktree run never pays. The three git answers are the three edges of the branch resolution machine, and none of them refuses the run.

---

## 3. A RESUMED RUN WHOSE PARKED PROMPT LACKS THE LINE

The parked prompt was composed before this phase, so it names no working place. The runner inserts the current line before the budget check.

```mermaid
sequenceDiagram
  autonumber
  participant Dr as request-drain.ts
  participant Rn as runner.ts
  participant Ny as needs-you.ts
  participant Is as isolation.ts
  participant Dp as dispatch.ts
  participant Ch as executor child

  Dr->>Rn: runBot with a resume request
  Rn->>Ny: read the item and buildResumedPrompt
  Ny-->>Rn: the parked prompt and its trailer
  Rn->>Is: reopenBotWorktree for the parked tree, when there is one
  Is-->>Rn: the tree, or a refusal parked-worktree-missing
  Note over Rn: 004 step two. The parked prompt is inspected, never recomposed.
  Rn->>Rn: find the first line that starts with the working-place prefix
  alt no such line
    Rn->>Rn: insert the current line after the spec-folder line
    Rn->>Rn: the prompt now names the place this run works in
  else the line equals the current line
    Rn->>Rn: nothing changes
  else the line differs from the current line
    Rn-->>Dr: refused resume-item-invalid, no child starts
  end
  Rn->>Rn: the budget check runs on the prompt as it now stands
  Rn->>Dp: buildBotPrompt is not called, the parked prompt is dispatched
  Rn->>Ch: dispatch with cwd equal to workDir
  Ch-->>Rn: output and exit
```

**What the diagram fixes.** The builder is not called on a resume, so the line cannot be recomposed and the parked prompt's other blocks stay as they were parked. The insertion is a position in the parked prompt, and the budget check runs after it.

---

## 4. A STATUS READ, OVER AN OLD INDEX AND A NEW ONE

Two reads of the same verb. The first meets an index built before this phase, the second an index built after it. Both exit 0 and both print the two keys.

```mermaid
sequenceDiagram
  autonumber
  actor Op as Operator
  participant Cl as bots.cjs status
  participant St as status.ts
  participant Ix as status-index.ts
  participant Sq as status.sqlite

  Op->>Cl: bots status
  Cl->>St: statusReport
  St->>Ix: openIndex, no rebuild
  Ix->>Sq: open the existing file
  alt an index built before this phase
    Sq-->>Ix: run rows whose summary has neither key
    Ix-->>St: the snapshot
    St->>St: lastRunOf coalesces both to null
    St-->>Cl: rows with lastRun.branch null and lastRun.worktreePath null
    Cl-->>Op: the row, with neither new part, exit 0
  else an index built after this phase
    Sq-->>Ix: run rows whose summary has both keys
    Ix-->>St: the snapshot
    St->>St: lastRunOf reads both as they are
    St-->>Cl: rows with the two values
    Cl-->>Op: the row, ending branch then worktree, exit 0
  end
  Op->>Cl: bots status --json
  Cl->>St: the same report
  St-->>Cl: the report object
  Cl-->>Op: one JSON document with lastRun.branch and lastRun.worktreePath on every row
```

**What the diagram fixes.** No `--rebuild` is needed and no schema version moves. The coalescing happens in `lastRunOf`, which is the only place that turns a summary into a payload, so the text row and the JSON row cannot disagree about a missing key.

---

## 5. WHERE THIS PHASE SITS IN THE RUN

| Step of the run | This phase's part |
|-----------------|-------------------|
| Approval, switches, holds, lease, pause, precheck | None |
| Posture | Read, never decided here |
| Secret check | None. The check never sees the composed prompt |
| Isolation | Read. A tree's branch is taken, a shared run's branch is read |
| Prompt build | The line is emitted, third |
| Prompt budget | 005's check, after the build and before dispatch. A refusal finishes the tree it made |
| Dispatch | `cwd` is the same value the line names |
| Record write | `evidence.branch` is filled for every dispatched run |
| Index write | The summary carries both fields |
| Status read | The row appends both parts and the payload carries both keys |
