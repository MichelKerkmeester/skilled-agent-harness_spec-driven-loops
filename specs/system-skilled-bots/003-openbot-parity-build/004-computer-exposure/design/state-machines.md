---
title: "Design: the four state machines of computer exposure"
description: "The branch resolution machine, the fresh prompt line machine, the resumed prompt machine and the status row part machine, each drawn in Mermaid with every edge and every guard, plus the index summary read machine."
trigger_phrases:
  - "working place state machine"
  - "branch resolution machine"
  - "status row part machine"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The four state machines

Four machines decide what this phase writes. Each one is small, and each one has a case the prose in `spec.md` leaves to a builder. The machines below decide those cases.

The field names are [`records.md`](records.md)'s. The literal prompt text is [`prompt-line.md`](prompt-line.md)'s. The row grammar is [`status-row.md`](status-row.md)'s. Nothing here restates a contract.

---

## 1. THE BRANCH RESOLUTION MACHINE

One value, resolved once per dispatched run, from two inputs: the isolation answer and what git says. The machine runs after the posture resolves and before the record is written.

```mermaid
stateDiagram-v2
  [*] --> Unresolved: the posture resolved and workDir is known

  Unresolved --> TreeBranch: the isolation answer is worktree and a tree exists
  Unresolved --> ReadingCheckout: the isolation answer is shared

  TreeBranch --> Resolved: the tree's own branch, no git call
  TreeBranch --> Resolved: a resumed run, the parked tree's branch

  ReadingCheckout --> Resolved: git printed a branch name
  ReadingCheckout --> Detached: git printed the literal HEAD
  ReadingCheckout --> Unreadable: a non-zero status
  ReadingCheckout --> Unreadable: a null status, meaning a spawn failure or the 30 s timeout
  ReadingCheckout --> Unreadable: a zero status with empty stdout

  Detached --> Resolved: the branch is null
  Unreadable --> Resolved: the branch is null

  Resolved --> [*]: one value feeds the record and the prompt

  note right of ReadingCheckout
    git -C <checkoutRoot> rev-parse --abbrev-ref HEAD
    through isolation.ts's own git helper,
    which sets the timeout and normalises
    a spawn failure to a null status.
  end note
  note right of Detached
    rev-parse --abbrev-ref prints HEAD
    on a detached HEAD, so the literal
    is the test and no second command runs.
  end note
  note right of Unreadable
    Never a refusal. A null branch is a
    legal record value, so a failed read
    costs one row part and never a run.
  end note
```

**The one case the prose left open.** A zero status with empty stdout. Git does not produce it for this command on a real repository, and the machine still routes it to `Unreadable` rather than to a branch named by an empty string, because an empty string would print as `branch ` on a status row and read as a branch with no name.

**The guard the machine does not have.** There is no edge from `Unresolved` to a refusal. A branch read can never refuse a run, which is D2 and NFR-R01.

---

## 2. THE FRESH PROMPT LINE MACHINE

`buildBotPrompt` is a pure function of its inputs, so this machine has no I/O and no failure edge. It decides only whether the line is emitted and in which shape.

```mermaid
stateDiagram-v2
  [*] --> Composing: buildBotPrompt is called

  Composing --> NoLine: the caller passed no working place
  Composing --> WithBranch: a working place with a branch
  Composing --> WithoutBranch: a working place with a null branch

  NoLine --> Joined: the exemption, the spec folder, the checkout when given, the marker and the body
  WithBranch --> Joined: the line is the third element, after the spec folder and before the checkout
  WithoutBranch --> Joined: the same slot, the branch clause removed

  Joined --> [*]: one string, lines joined with one newline

  note right of NoLine
    Kept so a test that does not care about
    the working place can call the builder.
    No production caller passes none.
  end note
  note right of WithBranch
    Your working place is <path> on branch <branch>.
    This run's folder is <runFolder>.
  end note
  note right of WithoutBranch
    Your working place is <path>.
    This run's folder is <runFolder>.
  end note
```

**Why `NoLine` exists.** The builder is called by tests that assert the exemption line, the spec-folder line and the decision marker, and by the resume path's own tests. Making the working place a required input would force every one of them to invent a path. The absent case is therefore a legal input and it emits nothing, which is the absent-block rule of [`contracts/prompt-sections.md`](../../contracts/prompt-sections.md) section 5 applied to this block alone.

---

## 3. THE RESUMED PROMPT MACHINE

A resumed run is dispatched with the parked prompt, so the line may be absent, present or wrong. This machine runs before the budget check and before dispatch.

```mermaid
stateDiagram-v2
  [*] --> Parked: buildResumedPrompt returned the parked prompt and its trailer

  Parked --> Scanning: find the first line that starts with the prefix constant

  Scanning --> Absent: no line starts with it
  Scanning --> SamePath: the text before `. This run's folder is ` equals the current line's
  Scanning --> OtherPath: that text differs from the current line's

  Absent --> Inserted: insert the current line after the spec-folder line
  Absent --> Inserted: no spec-folder line, so insert it after the first line

  SamePath --> Replaced: the parked line becomes the current line
  Inserted --> Dispatched: the prompt now names the place this run works in
  Replaced --> Dispatched: the prompt names the current run folder and the current branch
  OtherPath --> Refused: resume-item-invalid, the parked prompt names another working place

  Dispatched --> [*]: the budget check runs on the prompt as it now stands
  Refused --> [*]: no child starts, the record carries the cause

  note right of Absent
    A prompt parked before this phase.
    The insertion point is a position,
    never a string replacement, because
    the body after it may hold anything.
  end note
  note right of SamePath
    A resume always gets a new run id,
    so the run folder always differs.
    The path is the fact the line exists
    for, so the comparison stops at
    `. This run's folder is `.
  end note
  note right of OtherPath
    Nearly unreachable: a resumed tree
    reopens at the same path and
    reopenBotWorktree refuses a moved tree
    first. It exists so a child is never
    told to work where it does not stand.
  end note
  note right of Dispatched
    Insert or replace, then check the budget.
    A line that pushes the prompt over
    32,000 characters refuses the run
    prompt-over-budget, which is 005's cause.
  end note
```

**The guard on `SamePath`.** The comparison is on the text before `. This run's folder is `, not on the whole line. A parked prompt whose line names the same path is the same working place even though the run folder differs, because the run folder is the parked run's and a resume continues that run. The parked line is then replaced with the current line, so the prompt names the current run folder and the current branch. A test asserts this by parking a prompt, resuming it and asserting the line appears exactly once.

**A shared run whose operator switched branch.** The path is the checkout in both lines, so the machine takes `SamePath` and replaces the line. The replacement carries the branch the checkout is on now, which is the branch the child edits and the branch `evidence.branch` records. A worktree run cannot reach the case, because `reopenBotWorktree` refuses a tree that moved and the tree's branch is the one it was made on.

---

## 4. THE STATUS ROW PART MACHINE

`formatStatus` builds one row as a list of parts joined by a tab. This machine decides which of the two new parts a row carries. It runs per row, after every existing part is decided.

```mermaid
stateDiagram-v2
  [*] --> RowKind: one report row

  RowKind --> ItemRow: the row kind is needs-you
  RowKind --> BotRow: the row kind is bot

  ItemRow --> [*]: the item line, unchanged, no new part

  BotRow --> NoLastRun: lastRun is null
  BotRow --> HasLastRun: lastRun is present

  NoLastRun --> [*]: the existing parts, then no run, and neither new part

  HasLastRun --> BranchPart: lastRun.branch is a string
  HasLastRun --> NoBranchPart: lastRun.branch is null

  BranchPart --> WorktreePart: append branch <name>
  NoBranchPart --> WorktreePart: append nothing

  WorktreePart --> BothParts: lastRun.worktreePath is a string
  WorktreePart --> BranchOnly: lastRun.worktreePath is null

  BothParts --> [*]: append worktree <path>, the row ends here
  BranchOnly --> [*]: the row ends after branch <name>

  note right of BranchPart
    Appended after every part the row
    already prints, so no existing
    position moves. D3.
  end note
  note right of WorktreePart
    branch comes before worktree.
    A shared run prints branch alone.
    A worktree run prints both.
  end note
```

**The case the prose left open.** A row whose last run recorded a tree and no branch. The machine prints `worktree <path>` alone, because the two parts are decided independently. It cannot happen for a tree this runtime made, since a tree is always made on a branch, and the machine still has the edge so a hand-edited record cannot produce a row with a dangling `branch ` part.

**The item row.** A needs-you row is a different line with its own fixed parts and it gains neither part. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:479-486]

---

## 5. THE INDEX SUMMARY READ MACHINE

The summary is a JSON string. A summary written before this phase has neither key, and `JSON.parse` yields `undefined` rather than `null`. This machine is the coalescing rule of [`records.md`](records.md) section 2.1 drawn out.

```mermaid
stateDiagram-v2
  [*] --> Parsed: the run row's summary string parsed

  Parsed --> BranchString: the branch value is a string
  Parsed --> BranchNull: the branch value is absent
  Parsed --> BranchNull: the branch value is null
  Parsed --> BranchNull: the branch value is any other type

  BranchString --> LastRunBranch: lastRun.branch is that string
  BranchNull --> LastRunBranch: lastRun.branch is null

  LastRunBranch --> WorktreeString: the worktreePath value is a string
  LastRunBranch --> WorktreeNull: the worktreePath value is absent
  LastRunBranch --> WorktreeNull: the worktreePath value is null
  LastRunBranch --> WorktreeNull: the worktreePath value is any other type

  WorktreeString --> [*]: lastRun.worktreePath is that string
  WorktreeNull --> [*]: lastRun.worktreePath is null

  note right of BranchNull
    An index built before this phase
    lands here for both fields.
    Without this edge the key would be
    undefined and JSON.stringify would
    drop it from the payload.
  end note
```

**Why the third edge on each pair.** A summary is a JSON column, so a hand-edited or a newer runtime's value can be a number or an object. The machine reads any non-string as null rather than passing it through, which keeps `LastRun`'s type true and keeps `bots status --json` printable.

---

## 6. THE TESTS THESE MACHINES GIVE

| Machine | Test | File |
|---------|------|------|
| Branch resolution | A shared run on a branch records it | `tests/runner.vitest.ts` |
| Branch resolution | A detached HEAD records null and the run still dispatches | `tests/runner.vitest.ts` |
| Branch resolution | A git read that fails records null and the run still dispatches | `tests/isolation.vitest.ts` |
| Fresh prompt line | Both shapes and the slot assertions | `tests/dispatch.vitest.ts` |
| Fresh prompt line | No working place given emits no line | `tests/dispatch.vitest.ts` |
| Resumed prompt | Absent, so the line is inserted and appears once | `tests/runner.vitest.ts` |
| Resumed prompt | The same path, so the parked line is replaced and appears once | `tests/runner.vitest.ts` |
| Resumed prompt | Another path, so the run is refused `resume-item-invalid` | `tests/runner.vitest.ts` |
| Status row parts | Both parts, branch alone, neither | `tests/status.vitest.ts` |
| Index summary read | A summary with neither key reads back as two nulls | `tests/status-index.vitest.ts` |
