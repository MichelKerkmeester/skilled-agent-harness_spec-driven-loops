---
title: "SP-009 -- One-pass checklist marks every row"
description: "This scenario validates single-pass checklist marking for `SP-009`. It focuses on proving all ten rows are marked with a reason and that only absent rows reach the prompt."
version: 3.0.0.0
---

# SP-009 -- One-pass checklist marks every row

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-009`.

---

## 1. OVERVIEW

This scenario validates that one improvement pass ends with all ten checklist rows marked present, absent or not needed, each carrying a one-line reason. The operator uses a realistic onboarding-email prompt and asks to see what was checked, so the marking list itself is the evidence.

### Why This Matters

The marking list is what makes an improvement pass auditable. A marked row can be argued with; a silent one cannot. If rows go unmarked, or a row judged not needed is written into the prompt anyway, the operator gets additions nobody asked for and cannot tell which judgment produced them. A single pass also has to read as one pass, so the reply states what it checked once and delivers, rather than counting stages the work never went through.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that one improvement pass marks all ten checklist rows present, absent or not needed with a one-line reason each, and that the reply presents the check as a single pass rather than a counted sequence of stages.
- Real user request: `Improve my onboarding-email prompt and show me what you checked.`
- Prompt: `Improve my onboarding-email prompt and show me what you checked.`
- Expected execution process: `@prompt-improver` loads the checklist reference, reads the onboarding-email prompt once against the ten rows, marks each row with a one-line reason, writes the improved prompt from the rows marked absent, then delivers the prompt first and a change report after it.
- Expected signals: Ten rows appear in the reply in checklist order; every row carries a mark of present, absent or not needed plus a reason; the improved prompt contains only rows marked absent; the change report separates Added, Changed, Removed and Skipped; no counted sequence of stages appears anywhere in the reply.
- Desired user-visible outcome: The improved onboarding-email prompt, the full ten-row marking list with reasons, and a change report naming which rows were skipped and why.
- Pass/fail: PASS if all ten rows are marked with reasons and the prompt adds only absent rows; FAIL if rows are missing, unreasoned, or a not-needed row was added anyway.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my onboarding-email prompt and show me what you checked.
```

### Commands

1. `sk-prompt: Improve my onboarding-email prompt and show me what you checked.`
2. `agent: @prompt-improver raw_task="Improve a prompt that writes onboarding emails while proving every checklist row is marked with a reason." task_type=generation target_cli=opencode complexity_hint=5 constraints="Show all ten rows, mark each present, absent or not needed with a one-line reason, and add only the absent rows."`
3. `bash: rg '## 2\. THE CHECKLIST|Mark every row present' .skilled/skills/sk-prompt/references/improvement-checklist.md`

### Expected

The response lists the ten checklist rows in order, each marked present, absent or not needed with a one-line reason, then gives the improved onboarding-email prompt built only from the rows marked absent, then a change report with Added, Changed, Removed and Skipped lines.

### Evidence

Capture the full `@prompt-improver` response, the ten-row marking list, the improved prompt, and the `rg` output proving the marking rule sits in section 2 of the checklist reference.

### Pass / Fail

- **Pass**: All ten rows are marked with a one-line reason, and material added to the prompt matches rows marked absent.
- **Fail**: Any row is unmarked, any mark carries no reason, or a row marked not needed still appears in the improved prompt.

### Failure Triage

1. Confirm the operator request did not use `$raw`, which intentionally skips the pass, or `$short`, which checks only four rows.
2. Inspect `references/improvement-checklist.md` section 2 for the ten rows and the marking rule.
3. Re-run through `@prompt-improver` with `constraints="include a one-line reason for every row"` and compare the marking list against the prompt additions.

### Optional Supplemental Checks

Check that every row marked not needed is listed under Skipped in the change report with its reason kept short, and that no such row has a matching addition in the prompt.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: the one-pass improvement contract and `@prompt-improver` handoff |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/improvement-checklist.md` | Ten checklist rows in order, the mark-with-reason rule and the change report labels |
| `../../SKILL.md` | Mode command table and the one-pass workflow the contract points at |

---

## 5. SOURCE METADATA

- Group: Checklist Pass
- Playbook ID: SP-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `checklist-pass/one-pass-checklist-rows.md`
