---
title: "BMR-003 -- Author a behavior benchmark package"
description: "This scenario validates behavior-benchmark authoring for BMR-003. The package contains an index, scenario contracts and a Claude baseline while run fixtures and evidence stay with the executing packet."
version: 1.5.0.3
---

# BMR-003 -- Author a behavior benchmark package

This document captures the operator contract for authoring a behavior-benchmark package.

## 1. OVERVIEW

This scenario validates behavior-benchmark authoring for `BMR-003`. It focuses on package shape, scenario axes and the boundary between contract and evidence.

### Why This Matters

Behavior benchmarks measure executor behavior at a deep-loop mode invocation surface. The package must describe the contract without carrying fixtures, transcripts or scorecards. A package that writes run evidence beside the scenario files makes the authoring surface responsible for measurement state it does not own.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BMR-003` and confirm the expected package design.

- Objective: define a behavior-benchmark package with an index, scenario files and a baseline
- Realistic user request: `Create a behavior benchmark for this deep-loop mode. Cover the bare command and a vague natural-language ask.`
- Prompt: `Author a behavior-benchmark package for this mode. Cover its real entry surfaces and clarity levels. Keep fixtures, transcripts and scorecards with the executing packet.`
- Expected execution process: the behavior guide and framework are read, the mode entry surfaces and adjacent boundaries are identified, the matrix is designed, the index and scenario files are synchronized and the baseline uses pending cells when no Claude leg exists.
- Expected signals: the package shape is `behavior-benchmark.md`, `scenarios/` and `baselines/claude-baseline.md`. Under-specified cells use `question_halt`. Run evidence is excluded.
- Desired user-visible outcome: a package another lane can execute without confusing its contract with its evidence.
- Pass/fail: PASS if the package shape, matrix axes and lane boundary are all stated with source evidence. FAIL if fixtures or scorecards are added to the package or the framework is redefined.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Author a behavior-benchmark package for this mode. Cover its real entry surfaces and clarity levels. Keep fixtures, transcripts and scorecards with the executing packet.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BMR-003 | Author a behavior benchmark package | Build the contract package and keep run evidence outside it | `Author a behavior-benchmark package for this mode. Cover its real entry surfaces and clarity levels. Keep fixtures, transcripts and scorecards with the executing packet.` | 1. `agent: Read references/behavior-benchmark/behavior-benchmark-guide.md section 2` -> 2. `agent: Read the shared behavior framework named by the guide` -> 3. `agent: List the package files and the entry-surface and clarity axes` -> 4. `agent: State which fixtures and run outputs must stay outside the package` | Step 1 names the three package artifacts. Step 2 identifies the shared rubric authority. Step 3 covers real surfaces and C1 to C3 clarity. Step 4 excludes fixtures, transcripts, result JSON and scorecards | Exact prompt, package layout, matrix axes, baseline treatment and excluded artifact list | PASS if the package is a contract only and its matrix uses the shared framework. FAIL if the run evidence is shipped or the framework is copied into the package | 1. Check the package layout against the guide. 2. Confirm one scenario file per index row. 3. Remove any fixture or scorecard from the authored package |

### Commands

1. `agent: Read references/behavior-benchmark/behavior-benchmark-guide.md section 2`
2. `agent: Read the shared behavior framework named by the guide`
3. `agent: List the package files and the entry-surface and clarity axes`
4. `agent: State which fixtures and run outputs must stay outside the package`

### Expected

The package has an index, one scenario file per row and a Claude baseline. The guide points to the shared framework for the normative rubric and enums. The scenario matrix covers the mode's real entry surfaces and clarity levels. Fixtures, lane configs, transcripts, result JSON and scorecards stay in the executing spec packet.

### Evidence

Capture the prompt, the guide and framework paths, the package tree, the axis coverage statement and the excluded artifact list.

### Pass / Fail

- **Pass**: the package is a contract with synchronized index, scenarios and baseline and no run evidence.
- **Fail**: the package ships fixtures or scores behavior, omits the baseline or redefines the shared framework.

### Failure Triage

1. Confirm the guide section was read in full enough to identify the package boundary.
2. Compare the index rows with the scenario files.
3. Check that a Claude baseline uses `pending` or `not_captured` when no leg exists.
4. Move evidence to the executing packet.

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
| [`SKILL.md`](../../SKILL.md) | Behavior-benchmark family contract |
| [`references/behavior-benchmark/behavior-benchmark-guide.md`](../../references/behavior-benchmark/behavior-benchmark-guide.md) | Package shape and authoring workflow |
| [`assets/behavior-benchmark/behavior-benchmark-index-template.md`](../../assets/behavior-benchmark/behavior-benchmark-index-template.md) | Index scaffold |

---

## 5. SOURCE METADATA

- Group: BENCHMARK FAMILIES
- Playbook ID: BMR-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `benchmark-families/author-behavior-package.md`
