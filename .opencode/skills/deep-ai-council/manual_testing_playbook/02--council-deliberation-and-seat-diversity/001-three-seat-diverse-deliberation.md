---
title: "DAC-003 -- Three-seat diverse deliberation"
description: "This scenario validates three-seat diverse deliberation for DAC-003."
---

# DAC-003 -- Three-seat diverse deliberation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-003`.

---

## 1. OVERVIEW

This scenario validates that a council run selects distinct seats, lenses, and mandates.

### Why This Matters

Council value comes from useful disagreement, not repeated copies of one default plan.

---

## 2. SCENARIO CONTRACT

- Objective: Verify three distinct seat lenses are required.
- Real user request: Run a deep AI council to compare these two implementation plans and persist the artifacts.
- Prompt: `Run a deep AI council to compare these two implementation plans and show the distinct seat lenses.`
- Expected execution process: Inspect seat diversity guidance and agent strategy routing; confirm max 3 seats and distinct mandates.
- Expected signals: Analytical, critical, pragmatic or equivalent distinct lenses are documented for the task type.
- Desired user-visible outcome: The user sees three materially different planning perspectives.
- Pass/fail: PASS if diversity is explicit; FAIL if seats can be duplicates.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the diversity reference.
2. Grep the runtime agent for strategy and diversity requirements.
3. Confirm the operator can explain each seat's distinct role.

### Prompt

`Run a deep AI council to compare these two implementation plans and show the distinct seat lenses.`

### Commands

1. `bash: sed -n '1,140p' .opencode/skills/deep-ai-council/references/seat_diversity_patterns.md`
2. `bash: rg -n "DIVERSIFY|Lens diversity|Mandate diversity|N=3|max 3" .opencode/agents/deep-ai-council.md`

### Expected

Reference and agent text require distinct lenses, distinct mandates, and a maximum of 3 seats.

### Evidence

Capture cited lines from the reference and runtime agent.

### Pass / Fail

- **Pass**: Distinct seat rules are present and actionable.
- **Fail**: Guidance allows duplicate seats without critique.

### Failure Triage

Check the reference first, then the agent strategy section, then runtime mirrors if parity is suspect.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-003 | Three-seat diverse deliberation | Verify diverse seats | `Run a deep AI council to compare these two implementation plans and show the distinct seat lenses.` | `bash: sed -n '1,140p' .opencode/skills/deep-ai-council/references/seat_diversity_patterns.md -> bash: rg -n "DIVERSIFY|Lens diversity|Mandate diversity|N=3|max 3" .opencode/agents/deep-ai-council.md` | Distinct lens and mandate rules | Cited lines | PASS if diversity is explicit | Inspect agent strategy section |

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
| `.opencode/skills/deep-ai-council/references/seat_diversity_patterns.md` | Seat diversity contract |
| `.opencode/agents/deep-ai-council.md` | Runtime strategy rules |

---

## 5. SOURCE METADATA

- Group: COUNCIL DELIBERATION AND SEAT DIVERSITY
- Playbook ID: DAC-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--council-deliberation-and-seat-diversity/001-three-seat-diverse-deliberation.md`
