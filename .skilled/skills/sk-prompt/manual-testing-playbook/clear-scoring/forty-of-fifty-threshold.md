---
title: "SP-017 -- Total below 40/50 triggers targeted repair"
description: "This scenario validates targeted CLEAR repair for `SP-017`. It focuses on a total below 40 of 50 sending the prompt to its weakest dimension, capped at 3 repair cycles, with an honest best-version note when the target is not reached."
version: 3.0.0.0
---

# SP-017 -- Total below 40/50 triggers targeted repair

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-017`.

---

## 1. OVERVIEW

This scenario validates that a CLEAR total below 40 of 50 sends the prompt into targeted repair instead of straight delivery. The operator asks for an ML hyperparameter tuning prompt and states that nothing ships until CLEAR reaches 40, so the run has to show the starting total, the dimension repaired each cycle, and where the progression stopped.

### Why This Matters

The 40 of 50 pass mark is the delivery bar, and repair is how a prompt under the bar gets a fair chance at it inside a bounded pass. Repair aimed at the weakest dimension moves the total by the largest step available. Repair that rewrites everything moves the total in both directions at once. The cap at 3 cycles keeps an answer arriving, and the closing note keeps an unmet target visible instead of rounded up into a pass.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a CLEAR total below 40 of 50 triggers repair of the weakest dimension, up to 3 cycles, and that the reason is written before each score.
- Real user request: `Improve my prompt for ML hyperparameter tuning and only deliver if it reaches CLEAR 40.`
- Prompt: `Improve my ML hyperparameter tuning prompt; only deliver it at CLEAR 40, and repair the weakest dimension while the total stays below that.`
- Expected execution process: `@prompt-improver` writes a reason for each dimension, scores, checks whether the total reaches 40, repairs the weakest dimension, and repeats no more than 3 times.
- Expected signals: Score progression shows the initial total, the dimension repaired in each cycle and the final total; the run stops by cycle 3; a note names what stayed weak when 40 is not reached.
- Desired user-visible outcome: The improved prompt, the reason written before each score, the dimension named weakest per cycle, and an honest final status.
- Pass/fail: PASS if repair targets the weakest dimension and stops by cycle 3 with an honest note; FAIL if repair is untargeted, exceeds 3 cycles, or a sub-40 result is presented as passing.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my prompt for ML hyperparameter tuning and only deliver if it reaches CLEAR 40.
```

### Commands

1. `sk-prompt: Improve my prompt for ML hyperparameter tuning and only deliver if it reaches CLEAR 40.`
2. `agent: @prompt-improver raw_task="Improve an ML hyperparameter tuning prompt and reach a CLEAR total of 40 of 50 before delivery." task_type=generation target_cli=opencode complexity_hint=8 constraints="Repair the weakest dimension only; at most 3 repair cycles; write the reason before each score; if 40 is still not reached, deliver the best version with a note naming what stayed weak."`
3. `bash: rg '40 of 50|weakest dimension|3 repair cycles|best version' .skilled/skills/sk-prompt/references/improvement-checklist.md`

### Expected

The report shows the initial total, the dimension named weakest in each repair cycle, and the final total, each one preceded by its reason. Delivery happens at or above 40, or with the best version plus a note naming what stayed weak.

### Evidence

Capture the reason written before each score, the initial total, the dimension repaired per cycle, the cycle count, the final total, and the best-version note when the target is unmet.

### Pass / Fail

- **Pass**: Repair targets the weakest dimension, stops by cycle 3, and an unmet target is reported with a note.
- **Fail**: Repair is untargeted, a fourth cycle starts, or a total under 40 is reported as passing.

### Failure Triage

1. Inspect the CLEAR screen in `../../references/improvement-checklist.md` section 6 for the pass mark, the weakest-dimension rule and the cycle cap.
2. Check that a reason was written before each score. A total with no argument behind it cannot point at a weakest dimension.
3. Re-dispatch to `@prompt-improver` with `constraints="print the reason per dimension, the total, the weakest dimension and the cycle count before delivering"`.

### Optional Supplemental Checks

Feed a prompt that already scores at or above 40 and confirm it is delivered with its score and no repair cycle.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Skill source the scenario contract mirrors: workflow, mode commands and dispatch rules |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/improvement-checklist.md` | Section 6 carries the 40 of 50 pass mark, the weakest-dimension repair rule and the 3-cycle cap |
| `../../references/patterns-evaluation.md` | The CLEAR screen, defined once in section 10 |
| `../../ROUTER.md` | Routes a request to the mode that owns the work |
| `../../SKILL.md` | One-pass workflow and the `@prompt-improver` dispatch contract |

---

## 5. SOURCE METADATA

- Group: CLEAR Scoring
- Playbook ID: SP-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `clear-scoring/forty-of-fifty-threshold.md`
