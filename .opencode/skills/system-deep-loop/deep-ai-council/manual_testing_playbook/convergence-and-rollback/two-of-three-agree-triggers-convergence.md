---
title: "DAC-008 -- Two-of-three agree triggers convergence"
description: "This scenario validates two-of-three convergence guidance for DAC-008."
version: 2.3.0.7
---

# DAC-008 -- Two-of-three agree triggers convergence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-008`.

---

## 1. OVERVIEW

This scenario validates the lightweight convergence rule.

### Why This Matters

Operators need a clear stop rule that does not pretend unanimity is required.

---

## 2. SCENARIO CONTRACT

- Objective: Verify two-of-three agreement triggers convergence.
- Real user request: Check whether this council has enough agreement to proceed.
- Prompt: `Check whether this council has enough agreement to proceed and cite the convergence rule.`
- Expected execution process: Inspect `references/convergence/convergence_signals.md` and cite the two-of-three rule.
- Expected signals: Reference states 2 of 3 seats can declare convergence after critique.
- Desired user-visible outcome: The user gets a clear convergence verdict and rule citation.
- Pass/fail: PASS if the rule is explicit; FAIL if convergence is undefined.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the convergence reference.
2. Cite the rule and caveat about high-severity findings.
3. Return a short verdict.

### Prompt

`Check whether this council has enough agreement to proceed and cite the convergence rule.`

### Commands

1. `bash: sed -n '1,120p' .opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md`
2. `bash: rg -n "two-of-three|2 of 3|convergence" .opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md`

### Expected

The rule states that 2 of 3 seats can converge when critique finds no high-severity blocker.

### Evidence

Capture the cited reference lines.

### Pass / Fail

- **Pass**: Two-of-three convergence is explicit.
- **Fail**: No deterministic convergence signal exists.

### Failure Triage

Check the convergence reference first, then the SKILL.md success criteria.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-008 | Two-of-three convergence | Verify convergence trigger | `Check whether this council has enough agreement to proceed and cite the convergence rule.` | `bash: sed -n '1,120p' .opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md -> bash: rg -n "two-of-three|2 of 3|convergence" .opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md` | Two-of-three rule present | Reference lines | PASS if explicit | Inspect convergence reference |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md` | Convergence rule |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND ROLLBACK
- Playbook ID: DAC-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `convergence-and-rollback/two-of-three-agree-triggers-convergence.md`
