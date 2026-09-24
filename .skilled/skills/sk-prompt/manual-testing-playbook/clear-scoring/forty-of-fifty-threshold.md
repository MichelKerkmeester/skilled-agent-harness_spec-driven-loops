---
title: "SP-017 -- CLEAR 40/50 threshold triggers improvement"
description: "This scenario validates total CLEAR threshold enforcement for `SP-017`. It focuses on iterating when total score is below 40/50, capped at one retry."
version: 2.3.0.5
---

# SP-017 -- CLEAR 40/50 threshold triggers improvement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-017`.

---

## 1. OVERVIEW

This scenario validates that a total CLEAR score below 40 triggers an improvement cycle. The operator asks for ML hyperparameter tuning prompt improvement and verifies that `@prompt-improver` retries once before delivering the best version with notes.

### Why This Matters

The 40/50 threshold is the delivery quality bar. Without it, below-target prompts can ship without any repair attempt.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm total CLEAR <40 triggers one improvement cycle and no more.
- Real user request: `Improve my prompt for ML hyperparameter tuning — only deliver if you can hit CLEAR >= 40, otherwise retry once.`
- Prompt: `Improve my ML hyperparameter tuning prompt; verify CLEAR below 40 triggers one retry and stops there.`
- Expected execution process: `@prompt-improver` scores the prompt, checks total >=40, retries once on failure, and then stops.
- Expected signals: Score progression shows initial score and subsequent score(s); final status says pass or best-version delivery after one retry.
- Desired user-visible outcome: Enhanced prompt plus CLEAR progression and final threshold status.
- Pass/fail: PASS if total <40 triggers a retry and the one-retry cap is honored; FAIL if a below-40 result ships as pass or a second retry starts.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my ML hyperparameter tuning prompt; verify CLEAR below 40 triggers one retry and stops there.
```

### Commands

1. `sk-prompt: Improve my prompt for ML hyperparameter tuning — only deliver if you can hit CLEAR >= 40, otherwise retry once.`
2. `agent: @prompt-improver raw_task="Improve an ML hyperparameter tuning prompt and enforce CLEAR >= 40 before success." task_type=generation target_cli=opencode complexity_hint=8 constraints="Retry once on total CLEAR <40."`
3. `bash: rg '40\\+/50|required|30-39|One retry at most|CLEAR >= 40' .skilled/skills/sk-prompt/references/depth-framework.md .skilled/skills/sk-prompt/references/patterns-evaluation.md`

### Expected

The transparency report shows CLEAR >=40 on success, or one retry plus best-version notes on failure.

### Evidence

Capture score progression, iteration count, final threshold status, and `ESCALATION_NOTES` if target is unmet.

### Pass / Fail

- **Pass**: Total <40 causes one improvement cycle and never a second.
- **Fail**: Below-40 output is marked successful or a second retry begins.

### Failure Triage

1. Inspect CLEAR Thresholds in `patterns-evaluation.md`.
2. Inspect Improvement Protocol in `depth-framework.md`.
3. Re-dispatch to `@prompt-improver` with `constraints="print score_before, score_after, iteration_count"`.

### Optional Supplemental Checks

Verify a final score >=40 also satisfies all dimension floors from SP-016.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 scoring systems and §7 `@prompt-improver` deterministic rules |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/patterns-evaluation.md` | CLEAR threshold table |
| `../../references/depth-framework.md` | One-retry improvement protocol |

---

## 5. SOURCE METADATA

- Group: CLEAR Scoring
- Playbook ID: SP-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `clear-scoring/forty-of-fifty-threshold.md`
