---
title: "SP-010 -- Discover blocks below 3 perspectives"
description: "This scenario validates Discover perspective-floor enforcement for `SP-010`. It focuses on blocking advancement when fewer than 3 perspectives are evaluated."
version: 2.3.0.5
---

# SP-010 -- Discover blocks below 3 perspectives

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-010`.

---

## 1. OVERVIEW

This scenario validates that standard DEPTH cannot leave Discover with fewer than 3 perspectives. The operator asks for code-review prompt improvement and verifies that `@prompt-improver` either collects at least 3 perspectives or logs a blocked/re-run Discover gate.

### Why This Matters

Perspective-floor regressions make sk-prompt appear rigorous while actually running a shallow first pass. The minimum 3-perspective gate is a deterministic quality floor.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Discover enforces the 3-perspective minimum before downstream DEPTH phases.
- Real user request: `Tighten my prompt for code review feedback — I want at least 3 perspectives evaluated before you commit.`
- Prompt: `Tighten my code-review feedback prompt; verify Discover evaluates at least 3 perspectives before Engineer starts or blocks for a rerun.`
- Expected execution process: `@prompt-improver` runs standard DEPTH, counts named Discover perspectives, blocks below 3, then proceeds only after the floor is satisfied.
- Expected signals: Perspective count >= 3; perspectives are named; Engineer phase begins only after the floor passes.
- Desired user-visible outcome: Transparency report stating `Discover perspectives: 3+` with the names of the evaluated perspectives.
- Pass/fail: PASS if 3 or more named perspectives appear before Engineer; FAIL if fewer than 3 appear, the count is missing, or Engineer starts before the gate passes.

---

## 3. TEST EXECUTION

### Prompt

```
Tighten my code-review feedback prompt; verify Discover evaluates at least 3 perspectives before Engineer starts or blocks for a rerun.
```

### Commands

1. `sk-prompt: Tighten my prompt for code review feedback — I want at least 3 perspectives evaluated before you commit.`
2. `agent: @prompt-improver raw_task="Improve a code review feedback prompt with explicit Discover perspective evidence." task_type=review target_cli=codex complexity_hint=7 constraints="Do not proceed past Discover with fewer than 3 named perspectives."`
3. `bash: rg '3 minimum|Perspectives|BLOCKING' .opencode/skills/sk-prompt/references/depth_framework.md`

### Expected

The response names at least 3 perspectives, reports the Discover gate as passed or re-run, and then continues through the remaining DEPTH phases.

### Evidence

Capture the perspective list, perspective count, Discover gate status, and the phase log showing Engineer begins after Discover passes.

### Pass / Fail

- **Pass**: Transparency report lists >=3 named perspectives before Engineer.
- **Fail**: Fewer than 3 perspectives are listed, no count is shown, or the workflow advances despite an unmet floor.

### Failure Triage

1. Confirm the request is standard or escalated depth, not `$short` quick mode.
2. Inspect DEPTH Energy Levels and Standard Perspectives in `depth_framework.md`.
3. Re-dispatch to `@prompt-improver` with a hard constraint to print `perspectives_count` and `perspectives_list`.

### Optional Supplemental Checks

Verify the listed perspectives are semantically distinct, not the same perspective restated three times.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §4 perspective minimum and §7 `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | Perspective-floor and energy-level source of truth |
| `../../references/patterns_evaluation.md` | CLEAR validation that follows the Discover gate |

---

## 5. SOURCE METADATA

- Group: DEPTH+CLEAR Loop
- Playbook ID: SP-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--depth-clear-loop/perspectives-floor-three.md`
