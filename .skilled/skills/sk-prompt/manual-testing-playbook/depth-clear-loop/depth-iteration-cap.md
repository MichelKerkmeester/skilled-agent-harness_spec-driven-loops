---
title: "SP-011 -- DEPTH iteration cap at one CLEAR retry"
description: "This scenario validates CLEAR re-score loop capping for `SP-011`. It focuses on delivering the best version with a quality note after one failed retry."
version: 2.3.0.5
---

# SP-011 -- DEPTH iteration cap at one CLEAR retry

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-011`.

---

## 1. OVERVIEW

This scenario validates that CLEAR-driven improvement stops after one retry. The operator asks for technical-writing prompt improvement and verifies that `@prompt-improver` delivers the best version with an explicit quality note if the score cannot reach 40/50 after one retry.

### Why This Matters

Unbounded prompt-improvement loops waste runtime and hide quality failure. A deterministic cap gives operators a useful result plus honest uncertainty.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm improvement stops after one retry and delivers best-version evidence when CLEAR remains below target.
- Real user request: `Improve my prompt for technical writing — but if it can't hit 40/50 after one retry, just give me the best version with notes.`
- Prompt: `Improve my technical-writing prompt; verify CLEAR improvement stops after one retry and returns the best version with a quality note.`
- Expected execution process: `@prompt-improver` scores, applies targeted improvement, re-scores, stops after one retry, and returns best observed CLEAR score with notes.
- Expected signals: Improvement cycles <= 1; best CLEAR score shown; quality note present when target is unmet.
- Desired user-visible outcome: Enhanced prompt plus transparency report stating `Improvement cycles: 1 max`, `Best CLEAR: <score>/50`, and `quality note`.
- Pass/fail: PASS if no second retry starts and unresolved quality is disclosed; FAIL if a second retry starts or target failure is hidden.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my technical-writing prompt; verify CLEAR improvement stops after one retry and returns the best version with a quality note.
```

### Commands

1. `sk-prompt: Improve my prompt for technical writing — but if it can't hit 40/50 after one retry, just give me the best version with notes.`
2. `agent: @prompt-improver raw_task="Improve a technical-writing prompt under a strict one-retry CLEAR cap." task_type=edit target_cli=opencode complexity_hint=8 constraints="If CLEAR cannot reach 40/50 after one retry, deliver the best version with notes."`
3. `bash: rg 'max_iterations: 1|on_exceed|Deliver best version' .skilled/skills/sk-prompt/references/depth-framework.md`

### Expected

The output shows at most one improvement cycle. If quality remains below threshold after it, the final response includes a best-version note rather than another retry.

### Evidence

Capture iteration count, score progression, final best score, and the quality note.

### Pass / Fail

- **Pass**: `Improvement cycles` is 0 or 1; unresolved quality is disclosed when present.
- **Fail**: A second improvement cycle starts, iteration count is absent, or a below-threshold result is presented as fully passing.

### Failure Triage

1. Inspect the Improvement Protocol in `depth-framework.md` for the one-retry rule.
2. Check whether `@prompt-improver` returned a structured `ESCALATION_NOTES` field with quality caveats.
3. Re-run with an intentionally underspecified prompt and require score progression to be printed.

### Optional Supplemental Checks

Compare the best-version note with the weakest CLEAR dimension to confirm the note names the remaining risk.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §4 escalation and §7 `@prompt-improver` deterministic rules |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth-framework.md` | Improvement-cycle cap and on-exceed behavior |
| `../../references/patterns-evaluation.md` | CLEAR threshold and scoring dimensions |

---

## 5. SOURCE METADATA

- Group: DEPTH+CLEAR Loop
- Playbook ID: SP-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `depth-clear-loop/depth-iteration-cap.md`
