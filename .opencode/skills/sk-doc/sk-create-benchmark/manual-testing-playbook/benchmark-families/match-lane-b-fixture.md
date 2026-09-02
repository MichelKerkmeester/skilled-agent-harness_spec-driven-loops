---
title: "BMR-005 -- Match a Lane B fixture to its scorer"
description: "This scenario validates Lane B fixture authoring for BMR-005. Code-task, evidence-contract and reviewer-prompt shapes have distinct consumers and the profile must not point a scorer at the wrong shape."
version: 1.5.0.1
---

# BMR-005 -- Match a Lane B fixture to its scorer

This document captures the operator contract for authoring a Lane B fixture and profile.

## 1. OVERVIEW

This scenario validates Lane B fixture authoring for `BMR-005`. It focuses on shape detection, held-out oracle cases and the scorer boundary.

### Why This Matters

Fixtures are data-only inputs. A code-task fixture needs `fn_name`, visible tests and hidden tests. An evidence contract needs required headings and patterns. A reviewer prompt is a separate gated lane. A profile that sends one shape to the wrong scorer produces a run with nothing valid to grade.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BMR-005` and confirm the expected shape match.

- Objective: identify a Lane B fixture family and pair it with the scorer that reads that shape
- Realistic user request: `Add a strict validation task to the model benchmark and include a profile that can score it.`
- Prompt: `Author a Lane B code-task fixture for this strict validation task. Generate visible and hidden oracle cases from a verified reference. Then show which profile path and scorer can consume it.`
- Expected execution process: the model-benchmark guide is read, the fixture is identified as a code-task oracle, expected values are generated from a verified reference, the profile points to the fixture ID and the sweep scorer is selected. The fixture and profile remain pure JSON inputs.
- Expected signals: `tests[]` calibrate, `hidden_tests[]` guard against overfit and `scoreCodeTask` is used on the sweep path. Pattern and reviewer scorers are not substituted.
- Desired user-visible outcome: a data-only fixture and a profile choice that the Lane B runner can grade.
- Pass/fail: PASS if shape, oracle source and scorer path match. FAIL if expected values are guessed, hidden tests are absent or a code-task fixture is sent to the pattern path.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Author a Lane B code-task fixture for this strict validation task. Generate visible and hidden oracle cases from a verified reference. Then show which profile path and scorer can consume it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BMR-005 | Match a Lane B fixture to its scorer | Pair a code-task fixture with its valid sweep scorer | `Author a Lane B code-task fixture for this strict validation task. Generate visible and hidden oracle cases from a verified reference. Then show which profile path and scorer can consume it.` | 1. `agent: Read references/model-benchmark/model-benchmark-fixture-guide.md sections 3 and 5` -> 2. `agent: State the code-task shape markers and oracle requirements` -> 3. `agent: State the scorer path for code-task fixtures` -> 4. `agent: Parse the fixture and profile JSON after authoring them` | Step 1 distinguishes fixture families. Step 2 names `fn_name`, `tests[]` and `hidden_tests[]`. Step 3 selects `scoreCodeTask` on the sweep path. Step 4 prints `OK` or an equivalent parse success | Exact prompt, guide sections, shape markers, scorer path and JSON parse output with exit status | PASS if the fixture has held-out oracle cases and the profile uses the matching path. FAIL if the values are guessed or the pattern path is used | 1. Check the fixture shape before checking the profile. 2. Confirm every profile ID matches an on-disk fixture ID. 3. Move scoring mechanics back to deep-improvement |

### Commands

1. `agent: Read references/model-benchmark/model-benchmark-fixture-guide.md sections 3 and 5`
2. `agent: State the code-task shape markers and oracle requirements`
3. `agent: State the scorer path for code-task fixtures`
4. `agent: Parse the fixture and profile JSON after authoring them`

### Expected

The fixture is a code-task oracle. Its expected values come from a verified reference. Visible tests calibrate and hidden tests guard against overfit. The profile resolves the fixture by its `id` and uses the sweep path with `scoreCodeTask`. The authoring packet does not copy the evaluator or scorer contract.

### Evidence

Capture the prompt, the guide sections, the field shape, the scorer-path decision and the JSON parse output and exit status.

### Pass / Fail

- **Pass**: fixture shape, oracle generation, profile ID and scorer path agree.
- **Fail**: hidden tests are missing, expected values are guessed or a code-task fixture is scored by the evidence-contract path.

### Failure Triage

1. Inspect `fn_name`, `tests[]` and `hidden_tests[]` first.
2. Verify the oracle values against the reference implementation.
3. Check the profile fixture ID and scorer.
4. Keep evaluator mechanics in the Lane B owner.

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
| [`SKILL.md`](../../SKILL.md) | Model-benchmark family boundary |
| [`references/model-benchmark/model-benchmark-fixture-guide.md`](../../references/model-benchmark/model-benchmark-fixture-guide.md) | Fixture families, profiles and scorer wayfinding |
| [`assets/model-benchmark/model-benchmark-code-task-fixture-template.md`](../../assets/model-benchmark/model-benchmark-code-task-fixture-template.md) | Code-task fixture scaffold |

---

## 5. SOURCE METADATA

- Group: BENCHMARK FAMILIES
- Playbook ID: BMR-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `benchmark-families/match-lane-b-fixture.md`
