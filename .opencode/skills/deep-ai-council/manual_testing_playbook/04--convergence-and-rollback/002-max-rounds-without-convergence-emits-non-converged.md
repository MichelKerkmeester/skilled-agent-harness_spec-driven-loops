---
title: "DAC-009 -- Max rounds without convergence emits non-converged"
description: "This scenario validates non-converged max-round behavior for DAC-009."
---

# DAC-009 -- Max rounds without convergence emits non-converged

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-009`.

---

## 1. OVERVIEW

This scenario validates the max-round escape hatch.

### Why This Matters

The council must stop truthfully when agreement fails instead of forcing a fake consensus.

---

## 2. SCENARIO CONTRACT

- Objective: Verify non-converged completion behavior.
- Real user request: Tell me what happens if the council reaches max rounds without agreement.
- Prompt: `Tell me what happens if the council reaches max rounds without agreement and what artifacts should remain.`
- Expected execution process: Inspect convergence and state references for non-converged behavior.
- Expected signals: Guidance emits `council_complete` with `convergence:false` and preserves competing plans.
- Desired user-visible outcome: The user gets a non-converged status and next decision point.
- Pass/fail: PASS if max rounds do not fabricate convergence; FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Inspect convergence escape hatches.
2. Inspect state completion semantics.
3. Explain non-converged output.

### Prompt

`Tell me what happens if the council reaches max rounds without agreement and what artifacts should remain.`

### Commands

1. `bash: rg -n "max_rounds|max rounds|convergence:false|non-converged|council_complete" .opencode/skills/deep-ai-council/references/convergence/convergence_signals.md .opencode/skills/deep-ai-council/references/structure/state_format.md`

### Expected

The references describe non-converged completion and preserved competing plans.

### Evidence

Capture grep output.

### Pass / Fail

- **Pass**: Non-converged status is documented.
- **Fail**: Max rounds forces convergence or lacks guidance.

### Failure Triage

Check convergence signals and state format before agent prose.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-009 | Max-round non-convergence | Verify non-converged output | `Tell me what happens if the council reaches max rounds without agreement and what artifacts should remain.` | `bash: rg -n "max_rounds|max rounds|convergence:false|non-converged|council_complete" .opencode/skills/deep-ai-council/references/convergence/convergence_signals.md .opencode/skills/deep-ai-council/references/structure/state_format.md` | Non-converged completion guidance | Grep output | PASS if convergence is not fabricated | Inspect convergence reference |

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
| `.opencode/skills/deep-ai-council/references/convergence/convergence_signals.md` | Escape hatch guidance |
| `.opencode/skills/deep-ai-council/references/structure/state_format.md` | Completion event semantics |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND ROLLBACK
- Playbook ID: DAC-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-rollback/002-max-rounds-without-convergence-emits-non-converged.md`
