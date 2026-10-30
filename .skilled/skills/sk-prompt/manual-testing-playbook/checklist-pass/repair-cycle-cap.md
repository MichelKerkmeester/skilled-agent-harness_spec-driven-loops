---
title: "SP-011 -- CLEAR repair stops after 3 cycles"
description: "This scenario validates CLEAR repair capping for `SP-011`. It focuses on stopping after at most 3 repair cycles and delivering the best version with a note naming the weakest dimension."
version: 3.0.0.0
---

# SP-011 -- CLEAR repair stops after 3 cycles

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-011`.

---

## 1. OVERVIEW

This scenario validates that CLEAR-driven repair is bounded at 3 cycles. The operator asks for a technical-writing prompt improvement and verifies that `@prompt-improver` stops revising after at most 3 cycles and, when the score stays below 40 of 50, delivers the best version it reached with a note naming the weakest dimension.

### Why This Matters

An unbounded repair loop spends runtime on a score that may never move and hides the failure behind more attempts. A fixed cap gives the operator a usable prompt plus an honest statement of what stayed weak, which is more useful than a fifth rewrite.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm CLEAR-driven repair stops after at most 3 cycles and delivers the best version with a note naming the weakest dimension.
- Real user request: `Improve my prompt for technical writing, and if it cannot reach 40/50 just give me the best version with notes.`
- Prompt: `Improve my technical-writing prompt; verify CLEAR repair stops after at most 3 cycles and returns the best version with a note naming the weakest dimension.`
- Expected execution process: `@prompt-improver` scores the prompt on CLEAR, revises the weakest dimension, re-scores, and stops once the score reaches 40/50 or 3 repair cycles have run, then returns the best observed version.
- Expected signals: Repair cycles 3 or fewer; best CLEAR score shown; a note naming the weakest dimension present when the threshold is unmet.
- Desired user-visible outcome: Enhanced prompt plus `CLEAR_SCORE` showing the best score reached, and a note in `ESCALATION_NOTES` or the open items saying the 3-cycle repair cap was reached and naming the weakest dimension whenever the score stays below 40.
- Pass/fail: PASS if no fourth repair cycle starts and an unmet threshold is disclosed; FAIL if a fourth cycle starts or a below-threshold result is presented as passing.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my technical-writing prompt; verify CLEAR repair stops after at most 3 cycles and returns the best version with a note naming the weakest dimension.
```

### Commands

1. `sk-prompt: Improve my prompt for technical writing, and if it cannot reach 40/50 just give me the best version with notes.`
2. `agent: @prompt-improver raw_task="Improve a technical-writing prompt under a CLEAR repair cap of 3 cycles." task_type=edit target_cli=opencode complexity_hint=8 constraints="Stop after at most 3 repair cycles; if CLEAR stays below 40/50, deliver the best version with a note naming the weakest dimension."`
3. `bash: rg 'up to 3 repair cycles' .skilled/skills/sk-prompt/references/improvement-checklist.md`

### Expected

The output shows at most three repair cycles. If quality stays below 40/50 after them, the final response states that the threshold was not met, names the weakest dimension, and delivers the highest-scoring version rather than starting a fourth cycle.

### Evidence

Capture the repair cycle count, the CLEAR score after each cycle, the final best score, and the note naming the weakest dimension.

### Pass / Fail

- **Pass**: `Repair cycles` is 3 or fewer; an unmet 40/50 threshold is disclosed with the weakest dimension named.
- **Fail**: A fourth repair cycle starts, the cycle count is absent, or a below-threshold result is presented as fully passing.

### Failure Triage

1. Check section 6 of `../../references/improvement-checklist.md` for the pass mark, the 3-cycle cap and the on-exceed rule.
2. Check whether each cycle named a weakest dimension before revising it; a cycle with no named dimension is a re-score, not a repair.
3. Re-run with an intentionally underspecified prompt and require the score progression and cycle count to be printed.

### Optional Supplemental Checks

Compare the closing note with the last cycle's lowest CLEAR dimension to confirm both name the same dimension, and confirm the delivered prompt is the highest-scoring version, not the last one written.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: mode routing, escalation and the `@prompt-improver` delivery rules |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/improvement-checklist.md` | CLEAR pass mark at 40 of 50, the 3-cycle repair cap and the note delivered when the cap is reached |
| `../../SKILL.md` | Skill-level contract for capped repair, score reporting and delivery of the best version |

---

## 5. SOURCE METADATA

- Group: Checklist Pass
- Playbook ID: SP-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `checklist-pass/repair-cycle-cap.md`
