---
title: "SP-010 -- Early exit returns a good prompt unchanged"
description: "This scenario validates the early exit for `SP-010`. It focuses on returning a prompt that already covers its needed checklist rows unchanged or minimally edited, with a statement that no broader improvement was needed."
version: 3.0.0.0
---

# SP-010 -- Early exit returns a good prompt unchanged

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-010`.

---

## 1. OVERVIEW

This scenario validates that sk-prompt returns a prompt that already covers every row it needs without a rewrite. The operator hands over a prompt that states its task, supplies context, lists constraints and fixes an output format, then watches whether `@prompt-improver` delivers it back unchanged or with one small edit, naming the covered rows rather than inventing work.

### Why This Matters

An early exit is the difference between a prompt improver and a prompt rewriter. A prompt that already names its task, supplies its context, states its constraints and fixes its output format is usually complete, and adding a role or a worked example changes the response more often than it improves it. This scenario locks the good-prompt path so the check cannot justify itself by producing edits.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a prompt that already covers every needed row comes back unchanged or minimally edited, with a statement that no broader improvement was needed.
- Real user request: `Here is my prompt, it already has a task, context, constraints and an output format. Improve it if it needs it.`
- Prompt: `Here is my prompt, it already has a task, context, constraints and an output format. Improve it if it needs it.`
- Expected execution process: `@prompt-improver` reads the prompt once against the ten-row checklist, marks the covered rows present, finds no absent row worth adding, and exits early with the prompt preserved.
- Expected signals: The prompt comes back unchanged or with a minimal edit; the covered rows are named; the reply states that no broader improvement was needed.
- Desired user-visible outcome: The delivered prompt, followed by a short list of the rows already covered and one sentence saying no broader improvement was needed.
- Pass/fail: PASS if the prompt is unchanged or minimally changed and the statement is present; FAIL if it is rewritten wholesale or padded with a role or examples it did not need.

---

## 3. TEST EXECUTION

### Prompt

```
Here is my prompt, it already has a task, context, constraints and an output format. Improve it if it needs it.
```

### Commands

1. `sk-prompt: Here is my prompt, it already has a task, context, constraints and an output format. Improve it if it needs it.`
2. `agent: @prompt-improver raw_task="Review an already complete prompt and return it unchanged or minimally edited." task_type=improve target_cli=opencode complexity_hint=3 constraints="Preserve the prompt as written when it covers its rows; name the rows already covered; state that no broader improvement was needed; add no role, examples or process steps."`
3. `bash: rg -n -A 4 '^## 3\. EARLY EXIT' .skilled/skills/sk-prompt/references/improvement-checklist.md`

### Expected

The reply returns the prompt unchanged or with one minimal edit, names the checklist rows the prompt already covers, and states that no broader improvement was needed.

### Evidence

Capture the returned prompt, a diff against the original text, the list of covered rows, and the sentence stating that no broader improvement was needed.

### Pass / Fail

- **Pass**: The prompt returns unchanged or with a minimal edit, the covered rows are named, and the reply states no broader improvement was needed.
- **Fail**: The prompt is rewritten wholesale, or it gains a role, examples or process steps the task never asked for.

### Failure Triage

1. Confirm the run used standard effort and that the early exit was applied rather than treated as a starting point for edits.
2. Re-read section 3 of `improvement-checklist.md` and confirm the rule "do not invent work to justify the pass" is being followed.
3. Re-dispatch to `@prompt-improver` with a hard constraint to print the original prompt verbatim first, then justify each proposed edit in one line.

### Optional Supplemental Checks

Measure the added text. A minimal edit touches one or two lines, so anything past roughly a tenth of the original is a rewrite. Also check that the covered-row list names rows rather than asserting the prompt is fine.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: early exit and the `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/improvement-checklist.md` | Ten-row checklist, early exit and effort levels: source of truth |
| `../../SKILL.md` | Skill entry that routes the checklist pass and defines `@prompt-improver` |

---

## 5. SOURCE METADATA

- Group: Checklist Pass
- Playbook ID: SP-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `checklist-pass/early-exit-good-prompt.md`
