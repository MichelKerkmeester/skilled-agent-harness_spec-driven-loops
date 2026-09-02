---
title: "MTP-001 -- Create a reusable package"
description: "This scenario validates reusable playbook selection for `MTP-001`. It focuses on several features, deterministic evidence and release review."
version: 1.0.0.1
---

# MTP-001 -- Create a reusable package

This document captures the operator contract for `MTP-001`.

---

## 1. OVERVIEW

This scenario validates the decision to create a reusable manual testing package when several operator-visible features need repeatable checks. It checks the root index, category folders, per-feature files, evidence rules and release review guidance.

### Why This Matters

A one-off checklist cannot carry shared evidence rules for several features. The mode exists to make repeated operator checks reproducible. The root must explain package policy while each scenario carries execution truth.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MTP-001` and compare each expected signal with the output.

- Objective: create a reusable package for several features with deterministic scenarios and shared review policy
- Realistic user request: `We have six operator-visible features to check before release. Create a manual testing playbook with repeatable scenarios.`
- Prompt: `We have six operator-visible features to check before release. Create a manual testing playbook with repeatable scenarios.`
- Expected execution process: read the mode's decision rule, identify the reusable validation need, group features into meaningful categories, write the root policy, write one scenario file per feature and validate the package.
- Expected signals: the root file is named `manual-testing-playbook.md`, categories use bare kebab-case names, every feature maps to one file, prompts and commands are exact and review rules stay in the root.
- Desired user-visible outcome: a readable package with repeatable checks for all six features.
- Pass/fail: PASS if the package shape and deterministic fields are present and the validator passes. FAIL if the mode creates a one-off checklist, duplicates scenario truth or leaves a feature without a linked file.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `We have six operator-visible features to check before release. Create a manual testing playbook with repeatable scenarios.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MTP-001 | Create a reusable package | Create a reusable package for several features with deterministic scenarios and shared review policy | `We have six operator-visible features to check before release. Create a manual testing playbook with repeatable scenarios.` | 1. `agent: Read WHEN TO USE and the decision rule in SKILL.md` -> 2. `agent: Group six features into meaningful category folders` -> 3. `agent: Write the root policy and one scenario file per feature` -> 4. `bash: node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .opencode/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook` | Step 1: reusable validation is selected. Step 2: category names have meaning. Step 3: root policy and one file per feature exist. Step 4: the package reports PASS with a non-zero operator count and `routing_gold_excluded=0` | The exact prompt, the category map, the root and scenario paths, the validator output and its exit status | PASS if all six features map to one linked scenario file and the validator reports PASS. FAIL if the package is a one-off checklist, a category is numeric or a feature has no canonical file | 1. Check whether the mode first decided that repeatable evidence was needed. 2. Check the root index for one link per scenario. 3. Compare scenario commands with the exact prompt before rerunning the validator |

### Commands

1. `agent: Read WHEN TO USE and the decision rule in SKILL.md`
2. `agent: Group six features into meaningful category folders`
3. `agent: Write the root policy and one scenario file per feature`
4. `bash: node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .opencode/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook`

### Expected

Step 1 selects a playbook because the request names several repeatable operator checks. Step 2 creates descriptive root-level categories. Step 3 keeps shared policy in the root and execution truth in one file per feature. Step 4 reports a passing operator contract with a non-zero count and no routing-gold exclusions.

### Evidence

Capture the prompt, the category map, the root index links, the per-feature paths, the literal validator output and the exit status.

### Pass / Fail

- **Pass**: reusable validation is selected, every feature has one linked scenario file and the validator reports PASS with a non-zero operator count.
- **Fail**: the mode creates a one-off checklist, puts canonical files under `snippets/`, duplicates a scenario or leaves the validator with zero operator scenarios.

### Failure Triage

1. Re-read the decision rule and identify the repeated evidence need.
2. Count the root links and compare them with the scenario files on disk.
3. Check each scenario for an exact prompt, exact commands, expected signals, evidence, pass/fail criteria and failure triage.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Decision rule, package shape and authoring workflow |
| [`assets/manual-testing-playbook-template.md`](../../assets/manual-testing-playbook-template.md) | Root package structure and review sections |
| [`scripts/validate-playbook-package.cjs`](../../scripts/validate-playbook-package.cjs) | Operator-contract validator |

---

## 5. SOURCE METADATA

- Group: PACKAGE AUTHORING
- Playbook ID: MTP-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `package-authoring/create-a-reusable-package.md`
