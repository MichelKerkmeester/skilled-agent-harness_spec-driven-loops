---
title: "SP-016 -- CLEAR dimension floors trigger re-score"
description: "This scenario validates CLEAR dimension-floor enforcement for `SP-016`. It focuses on re-iteration when any dimension falls below its floor."
version: 2.3.0.5
---

# SP-016 -- CLEAR dimension floors trigger re-score

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-016`.

---

## 1. OVERVIEW

This scenario validates that CLEAR dimension floors are blocking even when the total score looks acceptable. The operator asks for user-story prompt improvement and verifies that `@prompt-improver` re-iterates when C<7, L<7, E<10, A<7, or R<3.

### Why This Matters

Dimension floors prevent a high total from masking a critical weakness. This keeps prompts from passing while one quality area is unusable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-016` and confirm the expected signals without contradictory evidence.

- Objective: Confirm any CLEAR floor breach triggers targeted improvement and re-score.
- Real user request: `If any CLEAR dimension scores below its floor, re-iterate. Apply this to my prompt for generating user stories.`
- Prompt: `Improve my user-story prompt; verify any CLEAR dimension below its floor triggers another improvement cycle even when total score passes.`
- Expected execution process: `@prompt-improver` calculates all dimensions, compares each with its floor, applies targeted improvement on breach, and re-scores.
- Expected signals: Re-score reason explicitly names the breached dimension and floor.
- Desired user-visible outcome: Transparency report stating either `all dimension floors met` or `re-score reason: dimension floor breach`.
- Pass/fail: PASS if floor breach causes re-score; FAIL if a breached dimension passes because total score is high.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my user-story prompt; verify any CLEAR dimension below its floor triggers another improvement cycle even when total score passes.
```

### Commands

1. `sk-prompt: If any CLEAR dimension scores below its floor, re-iterate. Apply this to my prompt for generating user stories.`
2. `agent: @prompt-improver raw_task="Improve a user-story generation prompt and enforce CLEAR dimension floors." task_type=generation target_cli=opencode complexity_hint=7 constraints="Re-score if C<7, L<7, E<10, A<7, or R<3."`
3. `bash: rg 'Floor|dimension falls below floor|C >= 7|E >= 10' .opencode/skills/sk-prompt/prompt-improve/references/depth_framework.md .opencode/skills/sk-prompt/prompt-improve/references/patterns_evaluation.md`

### Expected

The output names floor status for all dimensions and re-scores if any dimension is below its floor.

### Evidence

Capture initial CLEAR score, floor comparison, re-score reason, and final score.

### Pass / Fail

- **Pass**: Any floor breach triggers a re-score and the reason names the dimension and threshold.
- **Fail**: A floor breach is ignored or only the total score is checked.

### Failure Triage

1. Inspect CLEAR Dimensions in `patterns_evaluation.md` for floor values.
2. Inspect `depth_framework.md` Test phase for improvement triggers.
3. Re-run through `@prompt-improver` with a deliberately weak Expression section and require `floor_status` output.

### Optional Supplemental Checks

Verify the re-score targets the breached dimension rather than rewriting unrelated prompt sections.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §7 `@prompt-improver` dimension-floor rule |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/patterns_evaluation.md` | CLEAR dimension floors and thresholds |
| `../../references/depth_framework.md` | Improvement trigger on floor breach |

---

## 5. SOURCE METADATA

- Group: CLEAR Scoring
- Playbook ID: SP-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--clear-scoring/dimension-floors-block.md`
