---
title: "sk-create-manual-testing-playbook: Manual Testing Playbook"
description: "Operator-facing scenarios for authoring deterministic playbook packages, keeping operator checks in scope and storing run evidence."
version: 1.0.0.0
---

# sk-create-manual-testing-playbook: Manual Testing Playbook

This playbook defines the operator contract for `sk-create-manual-testing-playbook`. It covers package shape, deterministic scenario content, operator-contract boundaries and durable run evidence.

The root file owns package policy. Category files own scenario execution truth. This package has no feature catalog. Each scenario says so in its source table.

Canonical package artifacts:

- `manual-testing-playbook.md`
- `package-authoring/`
- `operator-contract/`

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into the owning skill's benchmark report folder. Use `SKIP` only with a specific sandbox or runtime blocker.

---

## 1. OVERVIEW

This package tests whether the mode creates a reusable manual-validation corpus when the work needs one. It also tests the boundaries that keep a playbook from becoming a checklist, a benchmark-only corpus or a collection of sidecar policy files.

Coverage is split into five scenarios across two categories. Three scenarios cover package authoring. Two cover the operator contract and result storage.

### Realistic Test Model

1. A user describes a validation need in ordinary language.
2. The mode decides whether a reusable playbook is warranted.
3. The operator checks the root policy and the per-scenario execution truth.
4. The operator validates the package and records the result.

### Coverage Boundary

The mode must create a root playbook plus root-level category folders when several features need repeatable manual checks. It must leave one-off checks in the simpler document or checklist workflow. It must keep operator scenarios outside the routing-gold contract.

---

## 2. GLOBAL PRECONDITIONS

1. Run commands from the repository root.
2. Keep the target skill directory available so links and validator commands resolve.
3. Use a clean working tree for any scenario that creates a temporary artifact.
4. Treat the playbook corpus as input. Do not write benchmark reports by hand.
5. A scenario may end as `SKIP` only when a named sandbox or runtime blocker prevents execution.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact user request
- The exact operator or orchestrator prompt
- The command transcript and exit status
- The chosen package boundary
- The root index and per-scenario paths
- The operator count and routing-gold exclusion count
- The captured outcome and reason
- The final scoped working-tree state

An answer without the package validator output is not enough. A zero exit can still describe a skipped operator corpus.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands use `bash: <command>`.
- Agent actions use `agent: <instruction>`.
- The arrow `->` separates ordered steps.
- Paths are repository-relative.
- Each scenario has one exact prompt in its contract and its execution table.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. This root playbook
2. Every linked scenario file
3. Validator output for the selected package
4. Result evidence for each executed scenario
5. Triage notes for every non-pass outcome

### Scenario Acceptance Rules

1. Run the prompt and command sequence as written.
2. Confirm each expected signal from observed output.
3. Confirm the scenario keeps its stated scope.
4. Record `PASS`, `FAIL` or `SKIP` with the required reason.

`PASS` requires all checks to agree. `FAIL` covers missing behavior, contradictory output or a failed critical check. `SKIP` requires a specific sandbox or runtime blocker.

### Feature Verdict Rules

- `PASS`: every mapped scenario passes.
- `FAIL`: one mapped scenario fails.
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker.

### Release Readiness Rule

Release is ready only when the package validator reports `PASS`, the operator count is non-zero, `routing_gold_excluded=0`, every root index link resolves and no required scenario remains unexecuted without a named blocker.

### Root-vs-Feature Rule

The root owns shared policy, review rules, orchestration guidance and release criteria. A scenario file owns its prompt, command sequence, expected signals, evidence, pass/fail rule and failure triage.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

Wave planning keeps package authoring and package review separate. It does not replace the scenario contract.

### Operational Rules

1. Assign package-shape scenarios before operator-contract scenarios.
2. Keep the operator-contract validator run after all scenario files exist.
3. Run result-persistence checks after the package has a passing structure.
4. Capture the exact command and exit status for every validator run.
5. Keep any temporary output outside the corpus or remove it before grading.

### What Belongs In Per-Feature Files

- The realistic user request
- The operator prompt
- The expected execution process
- The desired user-visible outcome
- The implementation anchors
- The exact pass and fail conditions

---

## 7. PACKAGE AUTHORING (`MTP-001..MTP-003`)

### MTP-001 | Create a reusable package

#### Description

Verify that the mode selects a reusable playbook when several features need repeatable manual validation and release evidence.

#### Scenario Contract

Prompt: `We have six operator-visible features to check before release. Create a manual testing playbook with repeatable scenarios.`

The mode should identify the reusable-validation need, define meaningful categories, create the root file and create one scenario file per feature. It should place shared review and orchestration rules in the root.

Desired user-visible outcome: a package with a readable index and deterministic scenario files.

#### Test Execution

> **Feature File:** [MTP-001](package-authoring/create-a-reusable-package.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

### MTP-002 | Leave a one-off check alone

#### Description

Verify that the mode leaves a one-off or experimental test in a simpler checklist or spec workflow when reusable playbook evidence is not needed.

#### Scenario Contract

Prompt: `I need to check one markdown change once. Add a full playbook package for it.`

The mode should explain that a full package is not warranted for one short-lived check. It should route the work to a checklist or spec task and create no playbook package.

Desired user-visible outcome: the user gets the smallest suitable test artifact and no unused package structure.

#### Test Execution

> **Feature File:** [MTP-002](package-authoring/leave-one-off-check-alone.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

### MTP-003 | Keep policy in the root

#### Description

Verify that shared review, orchestration and release rules stay in the root rather than in forbidden sidecar files or a `snippets/` tree.

#### Scenario Contract

Prompt: `Split the playbook review rules into review_protocol.md and put each scenario under snippets so the root stays short.`

The mode should keep one root index, root-level category folders and one canonical file per scenario. It should explain that the root owns shared policy and that sidecar review files and `snippets/` are outside the package contract.

Desired user-visible outcome: the package stays navigable and has one source of truth for review policy.

#### Test Execution

> **Feature File:** [MTP-003](package-authoring/keep-policy-in-root.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

## 8. OPERATOR CONTRACT (`MTP-004..MTP-005`)

### MTP-004 | Keep operator scenarios in scope

#### Description

Verify that a mode playbook scenario uses the operator-scenario frontmatter contract and omits routing-gold fields so the validator counts it.

#### Scenario Contract

Prompt: `Author one scenario for this mode playbook and make sure the operator validator actually checks it.`

The scenario should carry `title`, `description` and a four-part `version`. It should not carry `expected_workflow_mode` or `expected_leaf_resources`. The validator should report a non-zero operator count and `routing_gold_excluded=0`.

Desired user-visible outcome: the scenario is checked as an operator scenario instead of silently excluded.

#### Test Execution

> **Feature File:** [MTP-004](operator-contract/keep-operator-scenarios-in-scope.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

### MTP-005 | Persist the scenario result

#### Description

Verify that a manual run stores its verdict and reason through the canonical wrapper in the owning skill's benchmark report folder.

#### Scenario Contract

Prompt: `The operator ran MTP-004. Record its PASS result with the evidence path so the run can be audited later.`

The mode should use `run-manual-playbook-scenario.cjs` with the scenario ID, variant, verdict, reason, stage and durable outcome evidence. It should not hand-author renderer-owned report Markdown.

Desired user-visible outcome: the run folder contains the recorded outcome and the renderer can produce its report.

#### Test Execution

> **Feature File:** [MTP-005](operator-contract/persist-scenario-result.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

## 9. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `validate-playbook-package.cjs` | Operator-scenario structure, local links, IDs, root index membership and routing-gold exclusion | MTP-003 and MTP-004 |
| `run-manual-playbook-scenario.cjs` | Durable manual outcome storage and evidence metadata | MTP-005 |

The package validator does not execute the mode. It checks the authored scenario contract. The wrapper stores results after an operator runs a scenario.

---

## 10. FEATURE CATALOG CROSS-REFERENCE INDEX

This package has no feature catalog. The root index below is the source of scenario membership.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| MTP-001 | Create a reusable package | PACKAGE AUTHORING | [MTP-001](package-authoring/create-a-reusable-package.md) |
| MTP-002 | Leave a one-off check alone | PACKAGE AUTHORING | [MTP-002](package-authoring/leave-one-off-check-alone.md) |
| MTP-003 | Keep policy in the root | PACKAGE AUTHORING | [MTP-003](package-authoring/keep-policy-in-root.md) |
| MTP-004 | Keep operator scenarios in scope | OPERATOR CONTRACT | [MTP-004](operator-contract/keep-operator-scenarios-in-scope.md) |
| MTP-005 | Persist the scenario result | OPERATOR CONTRACT | [MTP-005](operator-contract/persist-scenario-result.md) |
