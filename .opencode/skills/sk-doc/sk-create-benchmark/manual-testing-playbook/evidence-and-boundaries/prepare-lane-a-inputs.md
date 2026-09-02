---
title: "BMR-007 -- Prepare Lane A inputs without scoring"
description: "This scenario validates Lane A authoring for BMR-007. The author fills the charter, strategy, config copy and bounded candidate while scoring and promotion remain in deep-improvement."
version: 1.5.0.3
---

# BMR-007 -- Prepare Lane A inputs without scoring

This document captures the operator contract for preparing agent-improvement inputs.

## 1. OVERVIEW

This scenario validates Lane A authoring for `BMR-007`. It focuses on operator-owned setup fields and the proposal-only boundary.

### Why This Matters

Lane A improves a bounded agent through evaluator-first proposals. The author supplies setup documents and one bounded candidate. The lane owns scoring, promotion gates and mirror handling. A setup workflow that edits the canonical target or copies the scoring rubric into the packet crosses the authoring boundary.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BMR-007` and confirm the expected boundary.

- Objective: prepare Lane A inputs while leaving the canonical target and scoring contracts untouched
- Realistic user request: `Set up an agent-improvement run for this bounded agent. Propose one rule change but do not score or ship it.`
- Prompt: `Prepare the Lane A inputs for this bounded agent. Fill the strategy and config copy, create one candidate with a single bounded mutation and leave scoring and promotion to deep-improvement.`
- Expected execution process: the agent-improvement guide is read, target class and preconditions are checked, the charter is adopted, operator-owned fields are filled, the config copy sets only `target`, `specFolder` and `lineage.sessionId` and the candidate stays packet-local.
- Expected signals: the canonical target is not mutated. The candidate uses the documented proposal fields and mutation vocabulary. The lane authorities are linked rather than copied.
- Desired user-visible outcome: a valid proposal package ready for the Lane A runner.
- Pass/fail: PASS if setup inputs are bounded and scoring remains lane-owned. FAIL if the target is edited, machine-owned fields are changed or promotion is claimed.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Prepare the Lane A inputs for this bounded agent. Fill the strategy and config copy, create one candidate with a single bounded mutation and leave scoring and promotion to deep-improvement.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BMR-007 | Prepare Lane A inputs without scoring | Prepare a proposal-only input set for a bounded agent | `Prepare the Lane A inputs for this bounded agent. Fill the strategy and config copy, create one candidate with a single bounded mutation and leave scoring and promotion to deep-improvement.` | 1. `agent: Read references/agent-improvement/agent-improvement-authoring-guide.md sections 1 through 4` -> 2. `agent: List the operator-owned setup fields and candidate proposal fields` -> 3. `agent: State which scoring, gate and promotion contracts remain lane-owned` -> 4. `agent: Compare the candidate scope with the canonical target and state the recovery path` | Step 1 identifies the bounded-agent preconditions. Step 2 names target, goal, constraints, candidate focus, target, specFolder, lineage.sessionId and proposal fields. Step 3 leaves scoring and promotion in deep-improvement. Step 4 confirms one mutation and no target edit | Exact prompt, guide sections, field list, lane-owned list, candidate comparison and recovery path | PASS if the proposal is packet-local and one bounded mutation leaves the target unchanged. FAIL if the canonical target is edited or scoring and promotion are claimed | 1. Check candidate scope against the target. 2. Confirm only operator-owned config fields changed. 3. Remove any copied rubric or promotion rule |

### Commands

1. `agent: Read references/agent-improvement/agent-improvement-authoring-guide.md sections 1 through 4`
2. `agent: List the operator-owned setup fields and candidate proposal fields`
3. `agent: State which scoring, gate and promotion contracts remain lane-owned`
4. `agent: Compare the candidate scope with the canonical target and state the recovery path`

### Expected

The guide distinguishes the immutable charter, operator-owned strategy fields, config copy fields and candidate proposal format. The candidate has one mutation and lives under the packet-local improvement area. Scoring, evaluation and promotion remain in deep-improvement. The canonical target is unchanged.

### Evidence

Capture the prompt, guide paths, field list, ownership statement, candidate-to-target comparison and recovery path.

### Pass / Fail

- **Pass**: the setup is proposal-only, the candidate is bounded and the target and lane-owned contracts are untouched.
- **Fail**: the target is edited, machine-owned fields are changed or the author claims a score or promotion result.

### Failure Triage

1. Re-read the setup field table.
2. Compare the candidate with the target and isolate one mutation.
3. Check the config copy for changes outside the three operator-owned fields.
4. Remove copied scoring or promotion content.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| No feature-catalog entry | This mode has no catalog package for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Agent-improvement family boundary |
| [`references/agent-improvement/agent-improvement-authoring-guide.md`](../../references/agent-improvement/agent-improvement-authoring-guide.md) | Setup and candidate authoring contract |
| [`references/agent-improvement/agent-improvement-authoring-guide.md`](../../references/agent-improvement/agent-improvement-authoring-guide.md) | Lane-owned contract links and proposal-only rules |

---

## 5. SOURCE METADATA

- Group: EVIDENCE AND BOUNDARIES
- Playbook ID: BMR-007
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `evidence-and-boundaries/prepare-lane-a-inputs.md`
