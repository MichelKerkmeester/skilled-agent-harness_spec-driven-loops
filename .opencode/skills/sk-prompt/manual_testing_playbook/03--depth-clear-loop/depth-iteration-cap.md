---
title: "SP-011 -- DEPTH iteration cap at 3 CLEAR loops"
description: "This scenario validates CLEAR re-score loop capping for `SP-011`. It focuses on delivering the best version with a quality note after 3 failed improvement cycles."
---

# SP-011 -- DEPTH iteration cap at 3 CLEAR loops

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-011`.

---

## 1. OVERVIEW

This scenario validates that CLEAR-driven improvement loops stop after 3 attempts. The operator asks for technical-writing prompt improvement and verifies that `@prompt-improver` delivers the best version with an explicit quality note if the score cannot reach 40/50 in 3 tries.

### Why This Matters

Unbounded prompt-improvement loops waste runtime and hide quality failure. A deterministic cap gives operators a useful result plus honest uncertainty.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm improvement cycles stop at 3 and deliver best-version evidence when CLEAR remains below target.
- Real user request: `Improve my prompt for technical writing — but if it can't hit 40/50 in 3 tries, just give me the best version with notes.`
- Prompt: `Improve my technical-writing prompt; verify CLEAR loops stop after 3 attempts and return the best version with a quality note.`
- Expected execution process: `@prompt-improver` scores, applies targeted improvement, re-scores, caps at 3 cycles, and returns best observed CLEAR score with notes.
- Expected signals: Iteration count <= 3; best CLEAR score shown; quality note present when target is unmet.
- Desired user-visible outcome: Enhanced prompt plus transparency report stating `Improvement cycles: 3 max`, `Best CLEAR: <score>/50`, and `quality note`.
- Pass/fail: PASS if the loop never exceeds 3 and unresolved quality is disclosed; FAIL if a fourth loop starts or target failure is hidden.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my technical-writing prompt; verify CLEAR loops stop after 3 attempts and return the best version with a quality note.
```

### Commands

1. `sk-prompt: Improve my prompt for technical writing — but if it can't hit 40/50 in 3 tries, just give me the best version with notes.`
2. `agent: @prompt-improver raw_task="Improve a technical-writing prompt under a strict max-3 CLEAR iteration cap." task_type=edit target_cli=codex complexity_hint=8 constraints="If CLEAR cannot reach 40/50 in 3 attempts, deliver the best version with notes."`
3. `bash: rg 'max 3 iterations|on_exceed|Deliver best version' .opencode/skills/sk-prompt/references/depth_framework.md`

### Expected

The output shows at most 3 improvement cycles. If quality remains below threshold, the final response includes a best-version note rather than another retry.

### Evidence

Capture iteration count, score progression, final best score, and the quality note.

### Pass / Fail

- **Pass**: `Improvement cycles` is 1, 2, or 3; unresolved quality is disclosed when present.
- **Fail**: A fourth improvement cycle starts, iteration count is absent, or a below-threshold result is presented as fully passing.

### Failure Triage

1. Inspect the Improvement Protocol in `depth_framework.md` for the max-3 rule.
2. Check whether `@prompt-improver` returned a structured `ESCALATION_NOTES` field with quality caveats.
3. Re-run with an intentionally underspecified prompt and require score progression to be printed.

### Optional Supplemental Checks

Compare the best-version note with the weakest CLEAR dimension to confirm the note names the remaining risk.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §4 escalation and §7 `@prompt-improver` deterministic rules |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | Improvement-cycle cap and on-exceed behavior |
| `../../references/patterns_evaluation.md` | CLEAR threshold and scoring dimensions |

---

## 5. SOURCE METADATA

- Group: DEPTH+CLEAR Loop
- Playbook ID: SP-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--depth-clear-loop/depth-iteration-cap.md`
