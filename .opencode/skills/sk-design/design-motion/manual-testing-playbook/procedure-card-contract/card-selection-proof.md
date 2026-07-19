---
title: Motion Procedure Card Selection Proof Scenario
description: Manual scenario verifying motion selects the interaction-states procedure card when state feedback dominates.
trigger_phrases:
  - "test motion procedure card"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: PROCEDURE_CARD_SELECTION
expected_resources:
  - SKILL.md
  - procedures/interaction-states-pass.md
---

**Exact prompt**

```text
motion: define hover, focus, active, loading, selected, disabled, and reduced-motion behavior for this toolbar. State the selected private procedure card and proof line first.
```

# MOTION-PROCCARD-001 | Motion Procedure Card Selection Proof

## 1. OVERVIEW

This scenario validates that the single motion-owned private card, `procedures/interaction-states-pass.md`, is selected for state-feedback requests.

## 2. SCENARIO CONTRACT

- Objective: Confirm motion selects `interaction_states_pass.md` and cites interaction matrix, visible focus, feedback coverage, timing, and reduced motion before guidance.
- Real user request: `Tune every visible state for a toolbar interaction.`
- Prompt: `motion: define hover, focus, active, loading, selected, disabled, and reduced-motion behavior for this toolbar. State the selected private procedure card and proof line first.`
- Expected execution process: Read `SKILL.md`; select `procedures/interaction-states-pass.md`; record public mode, affected states, motion budget, reduced-motion bar, timing/easing decisions, and verification risks.
- Expected signals: Exact card path appears before motion guidance; no public card route; no mutating tools.
- Desired user-visible outcome: State-by-state motion plan with proof and reduced-motion path.
- Pass/fail: PASS if the card is selected and proof appears before guidance; FAIL if omitted or replaced by generic motion advice.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-PROCCARD-001 | Motion card selection | Verify interaction-states card selection | `motion: define hover, focus, active, loading, selected, disabled, and reduced-motion behavior for this toolbar. State the selected private procedure card and proof line first.` | grep table in `SKILL.md` -> agent: run exact prompt -> inspect selected card | Card path `procedures/interaction-states-pass.md`; proof cites states, focus, timing, reduced motion | Transcript, response, proof line | PASS if exact card selected; FAIL if missing/wrong/no proof | 1. Re-read `SKILL.md` row; 2. Confirm prompt uses state-feedback vocabulary; 3. Check tool boundary |

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Motion procedure table |
| `../../procedures/interaction-states-pass.md` | Interaction-state procedure card |

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: MOTION-PROCCARD-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `procedure-card-contract/card-selection-proof.md`
