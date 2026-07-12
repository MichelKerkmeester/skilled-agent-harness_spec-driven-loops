---
title: "SP-017 -- CLEAR 40/50 threshold triggers improvement"
description: "This scenario validates total CLEAR threshold enforcement for `SP-017`. It focuses on iterating when total score is below 40/50, capped at 3 attempts."
version: 2.3.0.5
---

# SP-017 -- CLEAR 40/50 threshold triggers improvement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-017`.

---

## 1. OVERVIEW

This scenario validates that a total CLEAR score below 40 triggers an improvement cycle. The operator asks for ML hyperparameter tuning prompt improvement and verifies that `@prompt-improver` iterates up to 3 times before delivering the best version with notes.

### Why This Matters

The 40/50 threshold is the delivery quality bar. Without it, below-target prompts can ship without any repair attempt.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm total CLEAR <40 triggers improvement cycles capped at 3.
- Real user request: `Improve my prompt for ML hyperparameter tuning — only deliver if you can hit CLEAR >= 40, otherwise iterate up to 3 times.`
- Prompt: `Improve my ML hyperparameter tuning prompt; verify CLEAR below 40 triggers another cycle and stops after 3 total attempts.`
- Expected execution process: `@prompt-improver` scores the prompt, checks total >=40, iterates on failure, and stops after 3 attempts if needed.
- Expected signals: Score progression shows initial score and subsequent score(s); final status says pass or max-3 best-version delivery.
- Desired user-visible outcome: Enhanced prompt plus CLEAR progression and final threshold status.
- Pass/fail: PASS if total <40 triggers iteration and cap is honored; FAIL if a below-40 result ships as pass or loops beyond 3.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my ML hyperparameter tuning prompt; verify CLEAR below 40 triggers another cycle and stops after 3 total attempts.
```

### Commands

1. `sk-prompt: Improve my prompt for ML hyperparameter tuning — only deliver if you can hit CLEAR >= 40, otherwise iterate up to 3 times.`
2. `agent: @prompt-improver raw_task="Improve an ML hyperparameter tuning prompt and enforce CLEAR >= 40 before success." task_type=generation target_cli=opencode complexity_hint=8 constraints="Iterate on total CLEAR <40; cap at 3 attempts."`
3. `bash: rg '40\\+/50|required|30-39|Max 3 iterations|CLEAR >= 40' .opencode/skills/sk-prompt/prompt-improve/references/depth_framework.md .opencode/skills/sk-prompt/prompt-improve/references/patterns_evaluation.md`

### Expected

The transparency report shows CLEAR >=40 on success, or iteration count up to 3 plus best-version notes on failure.

### Evidence

Capture score progression, iteration count, final threshold status, and `ESCALATION_NOTES` if target is unmet.

### Pass / Fail

- **Pass**: Total <40 causes at least one improvement cycle and never exceeds 3 attempts.
- **Fail**: Below-40 output is marked successful or a fourth attempt begins.

### Failure Triage

1. Inspect CLEAR Thresholds in `patterns_evaluation.md`.
2. Inspect Improvement Protocol in `depth_framework.md`.
3. Re-dispatch to `@prompt-improver` with `constraints="print score_before, score_after, iteration_count"`.

### Optional Supplemental Checks

Verify a final score >=40 also satisfies all dimension floors from SP-016.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 scoring systems and §7 `@prompt-improver` deterministic rules |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/patterns_evaluation.md` | CLEAR threshold table |
| `../../references/depth_framework.md` | Max-3 improvement-cycle protocol |

---

## 5. SOURCE METADATA

- Group: CLEAR Scoring
- Playbook ID: SP-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `clear_scoring/forty_of_fifty_threshold.md`
