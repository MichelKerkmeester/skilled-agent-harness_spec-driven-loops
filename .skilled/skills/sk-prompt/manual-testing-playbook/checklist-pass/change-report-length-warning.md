---
title: "SP-014 -- Change report and length warning"
description: "This scenario validates the closing change report for `SP-014`. It focuses on the Added, Changed, Removed and Skipped headings and the warning that fires when a prompt grows past about 3 times its original length."
version: 3.0.0.0
---

# SP-014 -- Change report and length warning

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-014`.

---

## 1. OVERVIEW

This scenario validates that every reply ends with a change report under four fixed headings, and that a prompt grown past about 3 times the original length carries a growth warning. The operator hands over a two-line haiku prompt and asks for the best version the check can produce.

### Why This Matters

The change report is how an operator audits a rewrite without diffing two prompts by hand. Four headings say what entered the prompt, what moved, what left, and what was deliberately left out, so a large silent edit cannot pass as a small one.

The length warning covers the failure the headings cannot show. A prompt that triples in size has usually absorbed material the task never asked for, even when every individual addition looks reasonable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-014` and confirm the expected signals without contradictory evidence.

- Objective: Confirm every reply ends with an Added, Changed, Removed and Skipped change report, and warns when the prompt grows past about 3 times the original.
- Real user request: `Make this two-line prompt as good as possible: Write a haiku about rain. Keep it gentle.`
- Prompt: `Make this two-line prompt as good as possible: Write a haiku about rain. Keep it gentle.`
- Expected execution process: `@prompt-improver` marks the ten checklist rows, writes the improved prompt once, self-checks it, then delivers the prompt followed by the four-heading change report.
- Expected signals: A change report with all four headings, short entries or an explicit `none` under each; a growth warning whenever the delivered prompt is longer than about 3 times the original; the words `haiku`, `rain` and `gentle` still carrying the user's own phrasing.
- Desired user-visible outcome: The improved haiku prompt, a numbered list of defaults and assumptions, and a change report closing the reply.
- Pass/fail: PASS if the change report is present and an oversized prompt carries the warning; FAIL if the report is missing or large growth passes without a warning.

---

## 3. TEST EXECUTION

### Prompt

```
Make this two-line prompt as good as possible: Write a haiku about rain. Keep it gentle.
```

### Commands

1. `sk-prompt: Make this two-line prompt as good as possible: Write a haiku about rain. Keep it gentle.`
2. `agent: @prompt-improver raw_task="Improve a two-line haiku prompt as far as it goes." task_type=generation target_cli=opencode complexity_hint=3 constraints="End with an Added, Changed, Removed, Skipped change report. Warn when the prompt grows past about 3 times the original. Keep the user's own wording."`
3. `bash: rg -n 'Warn when the prompt grows|End with a change report' .skilled/skills/sk-prompt/references/improvement-checklist.md`

### Expected

The reply ends with a change report carrying four headings, and any prompt longer than about 3 times the original arrives with a growth warning beside it.

### Evidence

Capture the improved prompt, the numbered assumption list, the change report block, and the growth warning line when one appears.

### Pass / Fail

- **Pass**: All four headings appear with a short entry or an explicit `none`, and a prompt over about 3 times the original length carries the warning.
- **Fail**: A heading is missing, the report is absent, or a substantially larger prompt arrives with no warning.

### Failure Triage

1. Read section 7 of `improvement-checklist.md` for the change report headings and the growth warning sentence.
2. Compare the delivered reply against the rule: four headings, a warning above about 3 times the original, the user's wording intact.
3. Re-dispatch to `@prompt-improver` with `constraints="print the change report after the prompt and warn on growth past 3 times the original"`.

### Optional Supplemental Checks

Send the same request with a constraint that forces expansion, such as "include a worked example and a full output schema", and confirm the warning appears on the larger prompt. Then repeat at quick effort and confirm the report shape survives the shorter checklist.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: checklist pass, effort levels and the `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/improvement-checklist.md` | Section 7 owns the delivery order, the growth warning and the four change report headings |
| `../../SKILL.md` | Declares the reply shape an operator sees, including the closing change report |

---

## 5. SOURCE METADATA

- Group: Checklist Pass
- Playbook ID: SP-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `checklist-pass/change-report-length-warning.md`
