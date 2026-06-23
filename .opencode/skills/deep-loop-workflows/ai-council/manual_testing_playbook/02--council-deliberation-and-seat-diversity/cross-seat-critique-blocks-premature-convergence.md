---
title: "DAC-004 -- Cross-seat critique blocks premature convergence"
description: "This scenario validates that cross-seat critique prevents premature convergence."
version: 2.3.0.8
---

# DAC-004 -- Cross-seat critique blocks premature convergence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-004`.

---

## 1. OVERVIEW

This scenario validates that agreement is checked by critique before convergence.

### Why This Matters

Immediate agreement can hide shared assumptions; critique forces the council to test that agreement.

---

## 2. SCENARIO CONTRACT

- Objective: Verify cross-seat critique is required before convergence.
- Real user request: Use the council to pressure-test this plan before we implement it.
- Prompt: `Use the council to pressure-test this plan before we implement it and call out whether convergence is real.`
- Expected execution process: Inspect the agent deliberation steps and convergence reference.
- Expected signals: Cross-seat critique precedes recommendation; single-seat or uncriticized agreement is not enough.
- Desired user-visible outcome: The user receives a plan only after critique has checked failure modes.
- Pass/fail: PASS if critique gates convergence; FAIL if agreement alone can ship.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Inspect deliberation instructions.
2. Inspect convergence escape hatches.
3. Confirm premature agreement triggers critique.

### Prompt

`Use the council to pressure-test this plan before we implement it and call out whether convergence is real.`

### Commands

1. `bash: rg -n "cross-critique|critique|premature|convergence" .opencode/agents/ai-council.md .opencode/skills/deep-loop-workflows/ai-council/references/convergence/convergence_signals.md .opencode/skills/deep-loop-workflows/ai-council/references/patterns/seat_diversity_patterns.md`

### Expected

The grep output shows critique before convergence and escape hatches for insufficient diversity.

### Evidence

Capture cited lines for critique and convergence rules.

### Pass / Fail

- **Pass**: Cross-seat critique blocks premature convergence.
- **Fail**: The council can converge without critique.

### Failure Triage

Check convergence signals, then seat diversity, then agent workflow.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-004 | Cross-seat critique | Verify critique before convergence | `Use the council to pressure-test this plan before we implement it and call out whether convergence is real.` | `bash: rg -n "cross-critique|critique|premature|convergence" .opencode/agents/ai-council.md .opencode/skills/deep-loop-workflows/ai-council/references/convergence/convergence_signals.md .opencode/skills/deep-loop-workflows/ai-council/references/patterns/seat_diversity_patterns.md` | Critique and escape-hatch rules present | Grep transcript | PASS if critique gates convergence | Inspect convergence guidance |

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
| `.opencode/agents/ai-council.md` | Deliberation workflow |
| `.opencode/skills/deep-loop-workflows/ai-council/references/convergence/convergence_signals.md` | Convergence escape hatches |

---

## 5. SOURCE METADATA

- Group: COUNCIL DELIBERATION AND SEAT DIVERSITY
- Playbook ID: DAC-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--council-deliberation-and-seat-diversity/cross-seat-critique-blocks-premature-convergence.md`
