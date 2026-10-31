---
title: Spec Authoring Card
description: The short path a model follows to write one spec packet that passes strict validation with no unfilled tokens.
trigger_phrases:
  - "spec authoring card"
  - "write a spec packet"
  - "spec folder authoring steps"
  - "fill a spec scaffold"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Spec Authoring Card

This card is the short path. Follow the steps in order. Each step has one action, one acceptance line and one command. When the command prints what the acceptance line says, go to the next step.

`references/templates/template-guide.md` is the long guide. Read it only when this card sends you there.

## 1. BOUNDS

You write one packet, in one folder. The folder is the one `create.sh` prints.

Allowed writes: the packet folder and its `scratch/` folder.
Forbidden: `git commit`, `git push`, `git checkout`, `git switch`, `git branch`, `git reset`, `git stash`, `generate-context.js`, `/speckit:save`. Do not edit `.skilled/`, another packet or a source file. Do not run `create.sh` twice.

Acceptance: you can name the packet folder and the one command you will run to check it.
Verify: `pwd` prints the repository root, and `ls <packet folder>` lists `spec.md`.

## 2. PICK THE LEVEL

Run the level helper first.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc <lines> --files <count>
```

Use the level it prints. Do not raise the level yourself. The level decides which files the packet needs.

| Level | Files the packet needs |
|-------|------------------------|
| 1 | `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` once implementation starts |
| 2 | the Level 1 files plus `acceptance-criteria.md` |
| 3 | the Level 2 files plus the architecture sections and a decision record when one is written |

Acceptance: the level in the scaffold header matches the level the helper printed.
Verify: `rg -n 'SPECKIT_LEVEL' <packet folder>/spec.md` prints one line with that level.

## 3. SCAFFOLD

Create the packet with one command. Keep `--skip-branch` so no git state changes.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level <level> --track <track> --short-name <two-to-four-words> "<one sentence>"
```

The command prints the folder it made. Use that path for every later command.

Acceptance: the folder holds `spec.md`, `plan.md`, `tasks.md` and `scratch/`.
Verify: `ls <packet folder>` lists those names.

## 4. READ BEFORE YOU WRITE

Open one rendered example at the same level under `.skilled/skills/system-spec-kit/templates/examples/level-<level>/`. Read `spec.md` and `tasks.md`.

Do not copy from a `.tmpl` file. A `.tmpl` file carries tokens and gate markers. The examples are filled and safe to imitate for shape.

Each section of your scaffold carries a fill note. The note says what that section needs. Read the note before you write the section. The note is the contract for that section.

Acceptance: you can say, in one sentence, what the first section of `spec.md` must contain.
Verify: `sed -n '1,40p' <packet folder>/spec.md` shows the fill notes.

## 5. ONE ACTION PER SECTION

Each section does one job. Write one idea per paragraph. Do not repeat the same fact in two sections.

- `spec.md` states the problem, the scope, the requirements and the success criteria.
- `plan.md` states the approach, the files to change, the test plan and the dependencies.
- `tasks.md` states the ordered actions.
- `implementation-summary.md` states what changed and how it was checked. Write it last.

Do not put a task list in `spec.md`. Do not put requirements in `plan.md`.

Acceptance: every heading in the packet has content under it, and no heading holds content that belongs to another heading.
Verify: `rg -n '^## ' <packet folder>/spec.md <packet folder>/plan.md` lists the headings you filled.

## 6. THE PLAN SHAPE

A plan has 3 or 4 steps. More than 4 steps means the feature is too large for one packet. Split it or raise the level.

Each step carries three lines:
1. What the step does.
2. The acceptance line: what is true when the step is done.
3. The verify command: the command a reader runs, and the text it prints.

```markdown
### Step 1: Add the flag parser

Acceptance: `--quiet` is accepted and the default output is unchanged.
Verify: `bash script.sh --quiet` prints one line.
```

Acceptance: `plan.md` holds 3 or 4 steps, and each step has an acceptance line and a verify command.
Verify: `rg -c '^### Step ' <packet folder>/plan.md` prints 3 or 4.

## 7. TASK LINES

Every task line has one action, one file and one verify clause.

```markdown
- [ ] T001 Add the quiet flag to the option parser (`runtime/cli/spec/script.sh`). Verify: `bash runtime/cli/spec/script.sh --quiet` prints one line.
```

Rules:
- One action per task.
- Name the file in parentheses.
- End with `Verify:` and the command plus its expected output.
- Put the tasks in the order you will run them.
- Mark a task `[x]` only after its verify command printed the expected output.

Acceptance: every task line ends with a `Verify:` clause.
Verify: `rg -c 'Verify: ' <packet folder>/tasks.md` and `rg -c '^- \[ \] T[0-9]' <packet folder>/tasks.md` print the same number.

## 8. FILL EVERY TOKEN

A scaffold stamped `v2.3` or later carries tokens. A token starts with `[YOUR_VALUE_HERE:` and ends at the next closing bracket. Replace the whole token, brackets included, with real content. Do not leave a token in a finished packet.

If you cannot answer a question the token asks, write `UNKNOWN` in its place and write an open question in `goal.md` section 4.

A token in a packet whose `spec.md` says `Status: Draft` is a warning, so strict validation can pass with tokens still in the file. A token in any other status is an error. Do not use the warning as permission. Count the tokens.

Acceptance: the count is 0.
Verify: `rg -o '\[YOUR_VALUE_HERE: ' <packet folder>/spec.md <packet folder>/plan.md <packet folder>/tasks.md | wc -l` prints 0.

## 9. VALIDATE

Run the validator before you claim the packet is done.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet folder> --strict
```

The last line must be `RESULT: PASSED`. Read the summary line above it. `Errors: 0` is the pass condition. Warnings do not block the pass, but read them.

When it fails, read the first failing rule. Fix that rule only. Run the command again. Stop after three fixes on the same rule and write the rule and the error in the packet's `goal.md`.

Acceptance: the command prints `RESULT: PASSED` and `Errors: 0`.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet folder> --strict | tail -1` prints `RESULT: PASSED`.

## 10. CLOSE

A packet is closeable when:
- every required file exists for its level
- every token is filled, or replaced with `UNKNOWN` and an open question in `goal.md`
- `tasks.md` has no `[B]` line
- `implementation-summary.md` names the files that changed
- `validate.sh --strict` prints `RESULT: PASSED`

Acceptance: all five are true.
Verify: run the five commands in this card in order, then run the validator once more. The last line prints `RESULT: PASSED`.

## 11. WHEN TO STOP AND ASK

Stop and write the question in `goal.md` when:
- two documents in the packet state opposite rules
- a command in the plan would write outside the packet folder
- the validator fails on the same rule after three fixes
- the feature needs more than 4 plan steps

Acceptance: the question is written in `goal.md` as `Open question:` under the rule or command that raised it.
Verify: `rg -n 'Open question:' <packet folder>/goal.md` prints at least one line.
Do not guess. A written question is a finished step. A guess is a defect.
