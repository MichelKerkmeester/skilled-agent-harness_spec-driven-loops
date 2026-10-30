---
title: "SP-001 -- Default mode runs the standard checklist"
description: "This scenario validates default-mode routing for `SP-001`. It focuses on confirming that a request with no mode token runs standard effort: all ten checklist rows, the CLEAR screen, and the prompt delivered first."
version: 3.0.0.0
---

# SP-001 -- Default mode runs the standard checklist

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-001`.

---

## 1. OVERVIEW

This scenario validates default-mode routing for `SP-001`. It focuses on confirming that an operator request carrying no mode token runs standard effort, marks all ten checklist rows with a reason, writes the CLEAR screen with a reason before each dimension, and delivers the improved prompt before any commentary.

### Why This Matters

Default mode is the most common entry path for operators who never type a mode token. A regression here is silent: the reply still looks like an improvement, but fewer rows run and the operator receives a thinner prompt with no signal that anything was skipped. The delivery order matters for the same reason. A prompt buried under commentary costs a manual copy every time, and a question asked before delivery stalls work the skill could have completed with a stated assumption.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a request with no mode token runs standard effort, the full ten-row checklist, the CLEAR screen, and prompt-first delivery
- Real user request: `Improve my meeting-notes action-item prompt.`
- Prompt: `Run sk-prompt on my meeting-notes action-item prompt in default mode; confirm all ten checklist rows run with reasons, the CLEAR screen appears with a reason before each dimension, and the prompt is delivered before any commentary.`
- Expected execution process: sk-prompt finds no mode token, selects standard effort, reads the prompt once against all ten rows, writes the prompt from the component skeleton, runs the CLEAR screen with the reason stated before each dimension, then delivers the prompt followed by numbered open items and the change report.
- Expected signals: Effort: standard. Ten rows each marked present, absent or not needed with a one-line reason. A CLEAR score with reasons, written before the dimensions it explains. The prompt as the first deliverable.
- Desired user-visible outcome: The improved prompt first, then a numbered open-items list, then a change report under Added, Changed, Removed and Skipped.
- Pass/fail: PASS if the report shows standard effort, all ten rows with reasons, and the CLEAR screen. FAIL if fewer than ten rows run, no screen appears, or the reply asks a question before delivering.

---

## 3. TEST EXECUTION

### Prompt

```
Run sk-prompt on my meeting-notes action-item prompt in default mode; confirm all ten checklist rows run with reasons, the CLEAR screen appears with a reason before each dimension, and the prompt is delivered before any commentary.
```

### Commands

1. `sk-prompt: Improve my meeting-notes action-item prompt.`
2. `agent: @prompt-improver improve my meeting-notes action-item prompt in default mode; keep all ten checklist rows with a reason each, write the CLEAR screen with the reason before each dimension, and deliver the prompt before any commentary` (confirm standard effort, ten rows, screen, prompt-first order)
3. `bash: rg -n 'Standard' .skilled/skills/sk-prompt/references/improvement-checklist.md` (confirm section 4 names standard as the default and ties it to all ten rows)

### Expected

Effort resolved as standard, with no mode token consumed. All ten rows marked and each mark carrying a reason. The CLEAR screen scored out of 50 with a reason written before each dimension and a pass mark of 40. The prompt appears before the open items and the change report, and no question is asked.

### Evidence

Capture the full reply in order: the prompt body first, the numbered open items, the change report lines, the ten checklist rows with their reasons, and the CLEAR screen with its reasons and total.

### Pass / Fail

- **Pass**: Standard effort, all ten rows marked with reasons, CLEAR screen present with reasons and a total, and the prompt delivered before commentary.
- **Fail**: Rows fewer than ten, no screen, a question asked before delivery, or the prompt arriving after commentary.

### Failure Triage

1. Confirm the operator input carries no mode token and no override directive.
2. Inspect section 4 of the checklist reference to confirm standard is the default and covers all ten rows.
3. Re-dispatch with an explicit standard token and compare the row count against the first run.
4. Check the reply order directly: front-loaded commentary or an early question is a delivery failure, not a style preference.

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill entry point: triggers, workflow and effort table |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/improvement-checklist.md` | Ten-row checklist, effort levels and delivery order |
| `../../references/patterns-evaluation.md` | CLEAR screen defined in section 10 |
| `../../ROUTER.md` | Mode and effort token routing for the skill |

---

## 5. SOURCE METADATA

- Group: Mode Detection
- Playbook ID: SP-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mode-detection/default-mode-routing.md`
