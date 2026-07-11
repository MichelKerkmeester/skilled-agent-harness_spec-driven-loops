---
title: "SP-024 -- Escalation trigger thresholds"
description: "This scenario validates deep-path escalation to `@prompt-improver` for `SP-024`. It focuses on complexity, sensitivity, multi-stakeholder, and ambiguity routing to the deep path."
version: 2.3.0.7
---

# SP-024 -- Escalation trigger thresholds

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-024`.

---

## 1. OVERVIEW

This scenario validates that a high-risk prompt routes to `@prompt-improver` (the deep path) instead of being handled inline. The operator gives a HIPAA-sensitive data-handling prompt and verifies escalation occurs and names the reason.

### Why This Matters

Escalation protects complex, regulated, or ambiguous prompts from shallow treatment. Missing this routing can produce unsafe downstream instructions.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-024` and confirm the expected signals without contradictory evidence.

- Objective: Confirm high complexity, compliance sensitivity, multi-stakeholder needs, or ambiguity route to `@prompt-improver` rather than inline handling.
- Real user request: `Help with a compliance-sensitive prompt for HIPAA-bound data handling -- escalate to @prompt-improver.`
- Prompt: `Run sk-prompt on a HIPAA-bound, high-complexity prompt. Verify it escalates to @prompt-improver and the routing decision names the reason. Return the escalation payload.`
- Expected execution process: sk-prompt detects the complexity and compliance sensitivity, bypasses inline handling, and dispatches `@prompt-improver` with the input payload (`raw_task`, `complexity_hint`, `constraints`).
- Expected signals: `Escalation: @prompt-improver (compliance)` or equivalent.
- Desired user-visible outcome: Routing decision plus payload summary for `@prompt-improver`.
- Pass/fail: PASS if the high-risk prompt escalates with a named reason; FAIL if the HIPAA request is handled inline.

---

## 3. TEST EXECUTION

### Prompt

```
Run sk-prompt on a HIPAA-bound, high-complexity prompt. Verify it escalates to @prompt-improver and the routing decision names the reason. Return the escalation payload.
```

### Commands

1. `sk-prompt: Help with a compliance-sensitive prompt for HIPAA-bound data handling -- escalate to @prompt-improver.`
2. `agent: @prompt-improver raw_task="Enhance a HIPAA-bound data-handling prompt for safe dispatch." task_type=review target_cli=opencode complexity_hint=8 constraints="HIPAA compliance; preserve privacy and safety requirements."`
3. `bash: rg 'ESCALATE IF|@prompt-improver|complexity_hint|Standard DEPTH energy' .opencode/skills/sk-prompt/SKILL.md`

### Expected

The routing decision escalates to `@prompt-improver` and names the complexity or compliance sensitivity as the reason.

### Evidence

Capture the routing decision, escalation reason, and the `@prompt-improver` input payload.

### Pass / Fail

- **Pass**: HIPAA/compliance or high-complexity language triggers `@prompt-improver` and the reason is logged.
- **Fail**: The request is handled inline or the escalation reason is missing.

### Failure Triage

1. Inspect `SKILL.md` §7 `@prompt-improver` contract (`complexity_hint`, Standard DEPTH energy for escalated prompts) and §4 ESCALATE IF.
2. Confirm the operator input contains compliance-sensitive or high-complexity language.
3. Re-run with `complexity_hint=8` and explicit `constraints="HIPAA compliance"` in the payload.

### Optional Supplemental Checks

Run a multi-stakeholder variant and verify it also escalates with a different reason.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §7 `@prompt-improver` contract and §4 ESCALATE IF |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/patterns_evaluation.md` | CLEAR floors that, when unmet, justify escalation |
| `../../references/depth_framework.md` | Deep-path DEPTH processing after escalation |

---

## 5. SOURCE METADATA

- Group: Escalation Tiers
- Playbook ID: SP-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `escalation-tiers/escalation-trigger-thresholds.md`
