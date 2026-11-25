---
title: "Design: the status row grammar and its mockups"
description: "The exact part order a bots status row prints today, the two parts this phase appends, the four row mockups before and after, the needs-you row that gains nothing, the --json shape and the two documentation lines the phase owes."
trigger_phrases:
  - "bots status row parts"
  - "status row mockup"
  - "branch worktree row"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The status row grammar and its mockups

The row is the one user-facing surface this phase changes, so it gets a mockup for every shape it can take. The grammar is fixed by `formatStatus`, which builds a list of parts and joins them with one tab. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:479-486]

The rule this phase follows is D3: both parts are appended after every part the row already prints, so no existing position moves and no consumer parses a new one.

---

## 1. THE PART ORDER TODAY

Nine parts, in this order, each conditional except the first four.

| # | Part | Printed when | Source |
|---|------|--------------|--------|
| 1 | `<state>` | Always | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:480] |
| 2 | `<identity>` | Always | Same line |
| 3 | `<botId>` | Always | Same line |
| 4 | `<path>` or `-` | Always, `-` when the path is null | Same line |
| 5 | `previous <path>` | The bot's checkout moved | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:481] |
| 6 | `last <runId> <exitReason>` or `no run` | Always, one of the two | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:482] |
| 7 | `delivery <channel>:<state>,...` | The last run has at least one delivery entry | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:483] |
| 8 | `flags <a>,<b>` | The row carries more than one flag | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:484] |
| 9 | `held by <botId>` | An open item holds the bot | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:485] |
| 10 | `needs-reinstall (<labels>): <fix>` | The definition changed since install | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:486] |

The list is longer than nine because part 6 is always present and parts 5 and 7 to 10 are not. The two new parts are 11 and 12.

---

## 2. THE TWO APPENDED PARTS

| # | Part | Printed when | Value |
|---|------|--------------|-------|
| 11 | `branch <name>` | The last run recorded a branch | `lastRun.branch` |
| 12 | `worktree <path>` | The last run recorded a tree | `lastRun.worktreePath` |

`branch` comes before `worktree`, and both come after `needs-reinstall`. A row whose last run recorded neither prints neither, so a row for a bot that never ran is byte-identical to today's.

**Why the order is branch then worktree.** The branch is the fact an operator asks for first, because it says where the edits landed. The tree path is the second question, and it is the longer string, so putting it last keeps the row readable when a terminal truncates it.

**Why neither part is a flag.** A flag changes the row's `state` and its `flags` list, and both are read by the terminal screen. These two parts are facts about the last run, not conditions on the bot, so they are parts and not flags.

---

## 3. THE MOCKUPS

Each block is the literal output of `node .skilled/bin/bots.cjs status`, with the header line and the tab separators as the verb prints them. A tab is shown as a tab, so a reader who copies a block into a terminal sees the same columns.

### 3.1 Before this phase, a shared run

```text
index built 2026-11-25T21:14:04.000Z (/Users/ada/.local/state/system-skilled-bots/index/status.sqlite)
ok	skilled-scratch/hello	hello	/Users/ada/code/hello	last 20261125T211204Z-7c1e9a40 completed
```

The row ends at the exit reason. Nothing says the run worked on `main`.

### 3.2 After this phase, the same shared run

```text
index built 2026-11-25T21:14:04.000Z (/Users/ada/.local/state/system-skilled-bots/index/status.sqlite)
ok	skilled-scratch/hello	hello	/Users/ada/code/hello	last 20261125T211204Z-7c1e9a40 completed	branch main
```

One part is added and every earlier part keeps its position.

### 3.3 After this phase, a worktree run

```text
index built 2026-11-25T21:14:04.000Z (/Users/ada/.local/state/system-skilled-bots/index/status.sqlite)
ok	skilled-scratch/hello	hello	/Users/ada/code/hello	last 20261125T211204Z-7c1e9a40 completed	branch worktrees/004-bot-hello	worktree /Users/ada/worktrees/004-bot-hello
```

Both parts, branch first.

### 3.4 After this phase, a run on a detached HEAD

```text
index built 2026-11-25T21:14:04.000Z (/Users/ada/.local/state/system-skilled-bots/index/status.sqlite)
ok	skilled-scratch/hello	hello	/Users/ada/code/hello	last 20261125T211204Z-7c1e9a40 completed
```

Neither part, because git reported a detached HEAD and the record holds null. The row is byte-identical to section 3.1.

### 3.5 After this phase, a bot that never ran

```text
index built 2026-11-25T21:14:04.000Z (/Users/ada/.local/state/system-skilled-bots/index/status.sqlite)
ok	skilled-scratch/hello	digest	/Users/ada/code/hello	no run
```

Neither part, because there is no last run to read.

### 3.6 After this phase, a row that already carries every part

```text
index built 2026-11-25T21:14:04.000Z (/Users/ada/.local/state/system-skilled-bots/index/status.sqlite)
needs-reinstall	skilled-scratch/hello	hello	/Users/ada/code/hello	previous /Users/ada/code/hello-old	last 20261125T211204Z-7c1e9a40 completed	delivery local-only:not-attempted	flags needs-reinstall,held	held by hello	needs-reinstall (com.skilled.bots.skilled-scratch_2fhello.hello.0): the definition changed	branch worktrees/004-bot-hello	worktree /Users/ada/worktrees/004-bot-hello
```

The two new parts are the last two, after `needs-reinstall`. This is the row that proves D3: every earlier part keeps its index.

### 3.7 A needs-you row, unchanged

```text
index built 2026-11-25T21:14:04.000Z (/Users/ada/.local/state/system-skilled-bots/index/status.sqlite)
open	skilled-scratch/hello	hello	item 20261125T211204Z-7c1e9a40	run 20261125T211204Z-7c1e9a40	expires 2026-11-26T21:12:04.000Z	see bots inbox
```

An item row is a different line with its own fixed parts. It gains neither part, because it names no run's working place. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:477-479]

---

## 4. THE `--json` SHAPE

The same rows as data. `lastRun` gains two keys and no other key on a row changes.

```json
{
  "version": 1,
  "indexPath": "/Users/ada/.local/state/system-skilled-bots/index/status.sqlite",
  "builtAt": "2026-11-25T21:14:04.000Z",
  "updatedAt": "2026-11-25T21:14:04.000Z",
  "stale": false,
  "staleIdentities": [],
  "rows": [
    {
      "kind": "bot",
      "identity": "skilled-scratch/hello",
      "botId": "hello",
      "state": "ok",
      "flags": ["ok"],
      "path": "/Users/ada/code/hello",
      "pathState": "present",
      "previousPath": null,
      "installed": true,
      "labels": ["com.skilled.bots.skilled-scratch_2fhello.hello.0"],
      "launchd": [],
      "reinstall": [],
      "fix": null,
      "heldBy": null,
      "lastRun": {
        "runId": "20261125T211204Z-7c1e9a40",
        "dispatchedAt": "2026-11-25T21:12:04.000Z",
        "exitReason": "completed",
        "exitClass": null,
        "needsYouItemId": null,
        "delivery": [],
        "branch": "worktrees/004-bot-hello",
        "worktreePath": "/Users/ada/worktrees/004-bot-hello"
      }
    }
  ]
}
```

The row's other keys are the screen contract's and this phase changes none of them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:311-315] The `launchd` array is shortened here and the golden file in [`fixtures/`](fixtures/README.md) holds the full shape.

**The key set assertion.** A test compares the sorted key list of `lastRun` against the six keys it had plus the two it gains, so a third key added by a later phase fails this phase's test and has to be recorded.

---

## 5. THE PROMPT MOCKUPS

The line is user-facing in the sense that the bot reads it, so it gets the same treatment. Both blocks are the composed prompt with the body shortened to one line.

### 5.1 A shared run, no checkout line

```text
You are a non-interactive bot run: AI_SESSION_CHILD=1 is set, which AGENTS.md defines as the autonomous child-dispatch exemption. Nobody is at a prompt, so no answer can reach you.
Bound spec folder: none. Write no spec documents.
Your working place is /Users/ada/code/hello on branch main. This run's folder is /Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40.
If you reach a decision only a person can make, print one line that starts with [NEEDS-DECISION] followed by the question, then optionally one [OPTION] line per choice, and stop. Do not guess.

<the BOT.md body>
```

### 5.2 A worktree run through a lineage kind, with the checkout line

```text
You are a non-interactive bot run: AI_SESSION_CHILD=1 is set, which AGENTS.md defines as the autonomous child-dispatch exemption. Nobody is at a prompt, so no answer can reach you.
Bound spec folder: none. Write no spec documents.
Your working place is /Users/ada/worktrees/004-bot-hello on branch worktrees/004-bot-hello. This run's folder is /Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40.
The repository checkout is /Users/ada/worktrees/004-bot-hello. You start outside it, so read every repository file through that absolute path; a relative path resolves somewhere else.
If you reach a decision only a person can make, print one line that starts with [NEEDS-DECISION] followed by the question, then optionally one [OPTION] line per choice, and stop. Do not guess.

<the BOT.md body>
```

The checkout line's semicolon is the runtime's own text and is quoted exactly, as [`contracts/prompt-sections.md`](../../contracts/prompt-sections.md) section 1 requires. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:21]

### 5.3 A detached HEAD

```text
You are a non-interactive bot run: AI_SESSION_CHILD=1 is set, which AGENTS.md defines as the autonomous child-dispatch exemption. Nobody is at a prompt, so no answer can reach you.
Bound spec folder: none. Write no spec documents.
Your working place is /Users/ada/code/hello. This run's folder is /Users/ada/code/hello/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fhello/runs/20261125T211204Z-7c1e9a40.
If you reach a decision only a person can make, print one line that starts with [NEEDS-DECISION] followed by the question, then optionally one [OPTION] line per choice, and stop. Do not guess.

<the BOT.md body>
```

The branch clause is gone and the rest of the line is unchanged.

---

## 6. THE TWO DOCUMENTATION LINES

| File | What it gains | Verify |
|------|---------------|--------|
| `runtime/lib/README.md` | The `dispatch.ts` row names the working place, the `isolation.ts` row names the checkout branch, the `status.ts` row names the two appended parts | `rg -n 'working place' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints one line |
| `bots-status/references/status-and-inbox.md` | What a row shows, with `branch <name>` and `worktree <path>` named | `rg -n 'branch <name>' .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints one line |

The README's file table is the runtime's own map of its modules, so the three rows are edited in place and no row is added. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:45-74] The status reference is the operator-facing description of the verb, so it gains the two parts in the same list it already uses for the others.
