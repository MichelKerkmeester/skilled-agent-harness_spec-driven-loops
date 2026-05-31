---
title: "SP-022 -- Framework switch mid-flight"
description: "This scenario validates framework switching for `SP-022`. It focuses on switching frameworks and restarting when the first framework underdelivers at Test."
---

# SP-022 -- Framework switch mid-flight

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-022`.

---

## 1. OVERVIEW

This scenario validates that a below-threshold Test result can trigger a framework switch rather than repeated local polishing. The operator asks for sentiment-analysis prompt improvement and verifies that `@prompt-improver` switches frameworks when the first one fails CLEAR.

### Why This Matters

Some prompt failures are structural. Switching frameworks after Test failure prevents repeated edits inside the wrong shape.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-022` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Test-phase underdelivery can trigger framework switch and restart from Engineer.
- Real user request: `Improve my prompt for sentiment analysis — if the first framework you try doesn't hit CLEAR 40, switch and try another.`
- Prompt: `Improve my sentiment-analysis prompt; verify a failing first framework switches to another and restarts from Engineer before final delivery.`
- Expected execution process: `@prompt-improver` selects a first framework, scores it at Test, switches on failure, restarts at Engineer, and logs first -> second framework.
- Expected signals: `Framework switch: <first> -> <second>` with reason such as `CLEAR <40` or `dimension floor breach`.
- Desired user-visible outcome: Enhanced prompt plus framework-switch note when first attempt underdelivers.
- Pass/fail: PASS if Test failure triggers a switch/restart or success is justified by CLEAR >=40 and floors met; FAIL if underdelivery is accepted without switch or notes.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my sentiment-analysis prompt; verify a failing first framework switches to another and restarts from Engineer before final delivery.
```

### Commands

1. `sk-prompt: Improve my prompt for sentiment analysis — if the first framework you try doesn't hit CLEAR 40, switch and try another.`
2. `agent: @prompt-improver raw_task="Improve a sentiment-analysis prompt and switch frameworks if first attempt fails CLEAR." task_type=analyze target_cli=codex complexity_hint=8 constraints="If first framework fails Test, log first->second framework and restart from Engineer."`
3. `bash: rg 'Try alternative framework|Framework selected|Test|CLEAR 40' .opencode/skills/sk-prompt/references/depth_framework.md .opencode/skills/sk-prompt/references/patterns_evaluation.md`

### Expected

If the first framework fails CLEAR, the report names the framework switch and shows a second attempt before final delivery.

### Evidence

Capture first framework, first CLEAR score, switch reason, second framework, and final CLEAR score.

### Pass / Fail

- **Pass**: Under-threshold first attempt triggers framework switch and Engineer restart, or no switch is needed because first attempt meets all gates.
- **Fail**: First attempt fails CLEAR but final delivery proceeds without switch, retry, or quality note.

### Failure Triage

1. Inspect `depth_framework.md` Improvement Protocol for the third-cycle alternative-framework rule.
2. Inspect `patterns_evaluation.md` framework alternatives for sentiment-analysis fit.
3. Re-run through `@prompt-improver` with `constraints="print first framework, first score, switch decision"`.

### Optional Supplemental Checks

Verify the second framework is meaningfully different from the first, not a renamed same structure.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §7 `@prompt-improver` deterministic rules |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | Improvement cycle and Test-phase gates |
| `../../references/patterns_evaluation.md` | Framework alternatives and selection criteria |

---

## 5. SOURCE METADATA

- Group: Framework Selection
- Playbook ID: SP-022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--framework-selection/022-framework-switch-mid-flight.md`
