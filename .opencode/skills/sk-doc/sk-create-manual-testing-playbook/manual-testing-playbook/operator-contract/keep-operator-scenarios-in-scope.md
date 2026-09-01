---
title: "MTP-004 -- Keep operator scenarios in scope"
description: "This scenario validates the operator-scenario boundary for `MTP-004`. It focuses on frontmatter that the operator validator must count."
version: 1.0.0.0
---

# MTP-004 -- Keep operator scenarios in scope

This document captures the operator contract for `MTP-004`.

---

## 1. OVERVIEW

This scenario validates the boundary between an operator-scenario corpus and a routing-gold corpus. It checks that a mode playbook omits the routing-gold signature so the operator validator actually exercises the scenario.

### Why This Matters

The validator excludes any scenario carrying both `expected_workflow_mode` and a valid `expected_leaf_resources` block. That exclusion is correct for routing gold and wrong for a pure operator playbook. A zero operator count can therefore look like success while no operator scenario was checked.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MTP-004` and read the count fields in the validator output.

- Objective: author a pure operator scenario and prove that it remains included in the operator contract
- Realistic user request: `Author one scenario for this mode playbook and make sure the operator validator actually checks it.`
- Prompt: `Author one scenario for this mode playbook and make sure the operator validator actually checks it.`
- Expected execution process: write only `title`, `description` and a four-part `version` in scenario frontmatter, include the required five sections and execution fields, omit `expected_workflow_mode` and `expected_leaf_resources`, then run the package validator.
- Expected signals: the validator reports `PASS`, operator is greater than zero and `routing_gold_excluded=0`.
- Desired user-visible outcome: the scenario is structurally checked as an operator scenario.
- Pass/fail: PASS if the output has a non-zero operator count and zero routing-gold exclusions. FAIL if the scenario is excluded or the validator reports zero operator scenarios.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Author one scenario for this mode playbook and make sure the operator validator actually checks it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MTP-004 | Keep operator scenarios in scope | Author a pure operator scenario and prove that the validator includes it | `Author one scenario for this mode playbook and make sure the operator validator actually checks it.` | 1. `agent: Read the operator-scenario frontmatter rule in SKILL.md` -> 2. `agent: Write a scenario with title, description and a four-part version only` -> 3. `agent: Confirm expected_workflow_mode and expected_leaf_resources are absent` -> 4. `bash: node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .opencode/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook` | Step 1: the operator contract is named. Step 2: the frontmatter has the required three fields. Step 3: both routing-gold signature fields are absent. Step 4: the validator reports PASS with operator greater than zero and `routing_gold_excluded=0` | The exact prompt, the frontmatter block, the absent-field check, the full validator line and its exit status | PASS if the scenario is included and the validator reports PASS with non-zero operator and zero exclusions. FAIL if either signature field makes it routing gold or the operator count is zero | 1. Inspect the frontmatter block for `expected_workflow_mode`. 2. Inspect the block-form `expected_leaf_resources` signature. 3. Read the operator and exclusion counts instead of relying on exit zero |

### Commands

1. `agent: Read the operator-scenario frontmatter rule in SKILL.md`
2. `agent: Write a scenario with title, description and a four-part version only`
3. `agent: Confirm expected_workflow_mode and expected_leaf_resources are absent`
4. `bash: node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .opencode/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook`

### Expected

Step 1 identifies the five-section scenario contract and the frontmatter fields required by the operator validator. Step 2 authors the scenario without Lane C fields. Step 3 confirms that the routing-gold signature is absent. Step 4 reports a passing package with operator scenarios included and no routing-gold exclusions.

### Evidence

Capture the exact prompt, the scenario frontmatter, the absent-field check and the literal validator output line with its exit status.

### Pass / Fail

- **Pass**: the validator includes the scenario and reports `PASS` with operator greater than zero and `routing_gold_excluded=0`.
- **Fail**: a routing-gold field excludes the scenario, the operator count is zero or the result is judged from exit zero alone.

### Failure Triage

1. Search every scenario frontmatter block for `expected_workflow_mode`.
2. Search for the block-form `expected_leaf_resources` signature.
3. Read the counts on the validator line and compare them with the scenario files on disk.

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
| [`SKILL.md`](../../SKILL.md) | Operator-scenario contract boundary |
| [`scripts/validate-playbook-package.cjs`](../../scripts/validate-playbook-package.cjs) | Operator and routing-gold count logic |
| [`assets/manual-testing-playbook-snippet-template.md`](../../assets/manual-testing-playbook-snippet-template.md) | Scenario frontmatter and five-section shape |

---

## 5. SOURCE METADATA

- Group: OPERATOR CONTRACT
- Playbook ID: MTP-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `operator-contract/keep-operator-scenarios-in-scope.md`
