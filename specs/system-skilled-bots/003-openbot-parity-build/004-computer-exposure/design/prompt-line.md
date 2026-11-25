---
title: "Design: the working-place prompt line"
description: "The one prompt line this phase adds: its two literal shapes, the exported builder and prefix constant, its exact slot in the shared section order with the assertion a test makes, the three outcomes of the resumed-prompt check and the insertion point it uses."
trigger_phrases:
  - "working place prompt line"
  - "workingPlaceLine"
  - "resumed prompt working place"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The working-place prompt line

This note fixes everything a builder needs to write the line, so no decision is left to the builder. The block's place in the shared order, its literal text and its budget row are owned by [`contracts/prompt-sections.md`](../../contracts/prompt-sections.md) section 1.3 and section 4.2, and this note cites them rather than copying them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:63-77]

Paths are repository-relative. `L/` means `.skilled/skills/system-skilled-bots/runtime/lib/`.

---

## 1. THE TWO SHAPES

The line is one line of the prompt, built by one exported function so a resumed run can find it by exact text and never by a pattern. The function sits beside `checkoutLine`, which is the same kind of builder for the same kind of fact. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:301-308]

| Shape | Literal text |
|-------|--------------|
| A branch is known | `Your working place is <path> on branch <branch>. This run's folder is <runFolder>.` |
| The branch is null | `Your working place is <path>. This run's folder is <runFolder>.` |

The second shape is the first with the clause ` on branch <branch>` removed and nothing else changed. A test asserts that relation rather than two independent strings, so a later edit to one shape cannot leave the other behind.

**The prefix constant.** One exported constant holds the text every shape starts with, `Your working place is `, with the trailing space and no full stop. The resumed-prompt check in section 4 matches on this prefix. Nothing else in the runtime may hold a copy of it.

**What each placeholder is.** The three values are inputs, never reads. The builder takes them as one object so a caller cannot pass two of the three.

| Placeholder | Value | Where the runner gets it |
|-------------|-------|--------------------------|
| `<path>` | The absolute directory the child starts in | `workDir`, the same value handed to the child as `cwd` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1038] |
| `<branch>` | The branch that directory is on, or null | The tree's branch for a worktree run, else `checkoutBranch(checkoutRoot, env)` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1033] |
| `<runFolder>` | The absolute run folder in the Skilled tree | `evidence.runFolder`, which is never null [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:335-345] |

`<runFolder>` is always present, so the line never drops its second sentence. Only the branch clause is conditional.

**No escaping.** The line is trusted text the runtime composes, so the escape form in [`contracts/prompt-sections.md`](../../contracts/prompt-sections.md) section 3 does not apply to it. A path holding `<` is written as it is. The escape exists for non-authored blocks, and this is not one.

---

## 2. THE SLOT

The order is exemption, spec folder, working place, checkout, memory, skills, decision marker, body, conversation. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:19] The line is the third element of the list `buildBotPrompt` joins with one newline, so it is the third line of every prompt this phase produces. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:321-331]

### 2.1 The assertion a test makes

An index comparison against a fixed number would break the moment 005 or 009 adds a block above it, so the test compares the line against its two neighbours by name. Four assertions, all of them on the split prompt:

| # | Assertion | Holds when |
|---|-----------|------------|
| 1 | The index of the working-place line is the index of the spec-folder line plus one | Always |
| 2 | The index of the working-place line is less than the index of the decision-marker line | Always |
| 3 | The index of the working-place line is less than the index of the checkout line | The prompt carries a checkout line |
| 4 | The index of the working-place line is less than the index of the first line that starts with `[NEEDS-DECISION]` | The prompt carries one, which is the body's own text and not the marker block |

Assertion 1 is the one that survives 005 and 009, because both add their block after the checkout slot and neither moves the spec-folder line. Assertion 3 is the one that fails if the line is written after the checkout line, which is the mistake the slot rule exists to prevent.

The spec-folder line is found by its own prefix, `Bound spec folder: `, and the decision-marker line by the text `If you reach a decision only a person can make`. Both are fixed text the runtime owns. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:323-327]

### 2.2 The four prompt shapes

| Shape | Lines, in order | The line's index |
|-------|-----------------|------------------|
| No checkout, no request | exemption, spec folder, working place, decision marker, blank, body | 2 |
| Checkout, no request | exemption, spec folder, working place, checkout, decision marker, blank, body | 2 |
| No checkout, with a request prompt | the first shape, then blank, the request header, the request prompt | 2 |
| Checkout, with a request prompt | the second shape, then blank, the request header, the request prompt | 2 |

The request prompt is joined by the builder itself, per [`contracts/prompt-sections.md`](../../contracts/prompt-sections.md) section 6, so the line's index is the same in all four. A mockup of the first and second shapes is in [`status-row.md`](status-row.md) section 5.

### 2.3 The absent-block rule

The working-place block is never absent once this phase lands, so the prompt a run gets is never byte-identical to today's. That is the one place this phase departs from the absent-block rule in [`contracts/prompt-sections.md`](../../contracts/prompt-sections.md) section 5, and the contract says so in its own row. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:213]

---

## 3. THE BRANCH VALUE

The line's branch clause and the record's `evidence.branch` are one value, resolved once. Two resolutions exist and the runner picks one by the isolation answer.

| Isolation answer | Branch source | Cost |
|------------------|---------------|------|
| `worktree` | `tree.branch`, the branch the tree was made on | None, the value is already in hand |
| `shared` | `checkoutBranch(context.checkoutRoot, env)` | One `git rev-parse`, under 20 ms on this repository |

`checkoutBranch` is the one git read of a checkout's branch and it lives in `isolation.ts`, the module that already reads every git fact about where a run works. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:3-30] It runs `git -C <root> rev-parse --abbrev-ref HEAD` through the module's existing `git` helper, which already sets the timeout, disables the filesystem monitor and normalises a spawn failure to a null status. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:171-181]

| Git answer | `checkoutBranch` returns | Why |
|------------|--------------------------|-----|
| A branch name on stdout | That name, trimmed | The ordinary case |
| `HEAD` on stdout | null | `rev-parse --abbrev-ref` prints the literal `HEAD` on a detached HEAD, so the literal is the test and no second command is needed |
| A non-zero status | null | An unreadable checkout is not a reason to refuse a run |
| A null status, meaning the spawn failed or the 30 s timeout fired | null | Same rule |
| Empty stdout with a zero status | null | Defensive, and it keeps the return type honest |

The function never throws and never returns a refusal. A null branch is a legal record value, so a failed read costs the operator one missing row part and never a run. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:196]

**Where the runner calls it.** Three steps, in this order, immediately after `workDir` is computed and before the record is written:

1. Resolve the branch as the tree's own branch when there is a tree, else as `checkoutBranch(context.checkoutRoot, env)`.
2. Write it into `seed.evidence.branch`.
3. Pass it, with `workDir` and `evidence.runFolder`, to the builder.

For a worktree run step 1 is the tree's own branch and the git call never happens. For a shared run it is the one call. One variable feeds both the record and the builder, so the two cannot disagree.

**Why not read the branch from the tree's path.** A tree's branch is known when the tree is made and a second read could disagree with it after a rebase. The tree's own value is the truth for a tree run.

---

## 4. THE RESUMED PROMPT

A resumed run is dispatched with the parked prompt, not a recomposed one, so a prompt parked before this phase carries no working-place line. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:139-141] The runner therefore inspects the parked prompt before dispatch and takes one of three outcomes.

| Outcome | Test | Action |
|---------|------|--------|
| Absent | No line of the parked prompt starts with the prefix constant | Insert the current line at the insertion point in section 4.1 |
| Present and equal | One line starts with the prefix and equals the current line exactly | Nothing. The parked prompt already names the place this run works in |
| Present and different | One line starts with the prefix and differs from the current line | Refuse the run `resume-item-invalid` with the detail `the parked prompt names another working place` |

The third outcome is nearly unreachable, because a resumed worktree run reopens the same tree at the same path and `reopenBotWorktree` already refuses a tree that moved. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:577-590] It exists because the alternative is a child told to work in a directory it is not standing in, and the existing checkout check refuses exactly that case for the same reason. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:994-1000]

`resume-item-invalid` is an existing cause with class `operator` and exit 4, so this phase adds no registry entry. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:135]

### 4.1 The insertion point

The parked prompt is not recomposed, so the line is spliced in at a position the prompt itself determines:

1. Find the first line that starts with `Bound spec folder: `.
2. Insert the current line directly after it.
3. When no such line exists, insert the current line directly after the first line.

Step 3 is defensive. The spec-folder line is always present in a prompt this runtime composed, so step 2 is the only path a real parked prompt takes. The rule is written as a position rather than as a string replacement because the parked prompt's first two lines are fixed text and the rest is the bot's own body, which may hold anything.

### 4.2 The order against the budget check

The line is inserted before the budget check runs, so a resumed prompt that the line pushes over 32,000 characters is refused `prompt-over-budget` rather than dispatched. The budget rule and its overflow order are [`contracts/prompt-sections.md`](../../contracts/prompt-sections.md) section 4.3, and the check is 005's to land. This phase only fixes the order: insert, then check.

### 4.3 The order against the secret check

The secret-literal check runs over the bot body, the resume question, the resume answer and the request prompt, and never over the composed prompt. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:941-953] So the working-place line is outside that check by construction, exactly as the checkout line is, and a path the runner produced can never be the reason a run is refused. That is the whole of NFR-S02 and it needs no new code.

---

## 5. WHAT THE BUILDER MUST NOT DO

| Temptation | Why it is wrong |
|------------|-----------------|
| Read the branch inside `buildBotPrompt` | The builder stays a pure function of what the runner resolved, so the prompt and the `cwd` cannot disagree [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:315-334] |
| Emit the line only for a worktree run | The gap this phase closes is that a shared run's prompt names nothing, and a worktree bot dispatched through a kind outside `LINEAGE_FOLDER_KINDS` is told nothing about its tree [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:171] |
| Reuse `checkoutLine` for the working place | The checkout line says the child starts outside the checkout and must read files through an absolute path. The working-place line says where the child starts. A child inside the checkout needs the second and not the first |
| Add a second builder for the resumed case | One builder and one prefix constant, so the exact-text check has one source |
| Put the line after the checkout line | The slot is fixed by D1 and by the contract, so 005's memory block and 009's skills block land after it without moving it |
| Truncate a long path | The line is one line and is never wrapped or cut. A 4,096 character path is carried verbatim |

---

## 6. THE TESTS THIS NOTE GIVES

| Test | File | What it asserts |
|------|------|-----------------|
| Both shapes | `tests/dispatch.vitest.ts` | The branch shape and the null-branch shape, and that the second is the first with the branch clause removed |
| The slot | `tests/dispatch.vitest.ts` | Assertions 1 to 4 of section 2.1, on a prompt with a checkout line and on one without |
| No working place given | `tests/dispatch.vitest.ts` | A caller that passes no working place gets no line, so the builder stays usable by a test that does not care |
| A worktree run | `tests/isolation.vitest.ts` | The prompt holds `evidence.worktreePath` and the stub's `cwd` equals it, in the suite that already asserts both [SOURCE: .skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:411-425] |
| A shared run | `tests/runner.vitest.ts` | The prompt names the checkout and the record's `evidence.branch` is the checkout's branch |
| A parked prompt without the line | `tests/runner.vitest.ts` | The dispatched prompt holds the line and the record names the parked tree |
| A parked prompt with another place | `tests/runner.vitest.ts` | The run is refused `resume-item-invalid` and no child starts |
