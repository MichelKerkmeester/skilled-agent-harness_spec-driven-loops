---
title: "FCR-005 -- Leave execution matrices to the playbook"
description: "This scenario validates the catalog and playbook boundary for FCR-005. The catalog states current behavior and links to manual validation instead of embedding step-by-step scenarios."
version: 1.0.0.0
---

# FCR-005 -- Leave execution matrices to the playbook

This document captures the operator contract for the catalog and playbook boundary.

## 1. OVERVIEW

This scenario validates the catalog and playbook boundary for `FCR-005`. It focuses on leaving execution detail in the manual testing package.

### Why This Matters

A catalog answers what the system does today. A playbook answers how to validate it manually. Putting command sequences and pass criteria in the catalog makes the inventory hard to scan and creates two competing execution contracts.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FCR-005` and confirm the leave-alone decision.

- Objective: keep step-by-step manual validation out of the feature catalog
- Realistic user request: `Add every manual test step to the feature catalog so nobody needs another document.`
- Prompt: `Review this catalog addition. Keep current behavior and source anchors in the catalog, but move manual command sequences, evidence rules and pass criteria to the matching manual testing playbook.`
- Expected execution process: the catalog/playbook boundary is read, the proposed scenario matrix is identified as execution detail and the catalog is kept to current behavior, source anchors and a playbook link.
- Expected signals: the catalog does not contain a nine-column execution table. The playbook carries the prompt, commands, evidence and verdict rules.
- Desired user-visible outcome: a concise catalog entry with a clear validation link.
- Pass/fail: PASS if execution detail is left to the playbook. FAIL if the catalog duplicates the scenario matrix or hides current behavior behind test steps.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this catalog addition. Keep current behavior and source anchors in the catalog, but move manual command sequences, evidence rules and pass criteria to the matching manual testing playbook.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FCR-005 | Leave execution matrices to the playbook | Keep manual test detail outside the catalog | `Review this catalog addition. Keep current behavior and source anchors in the catalog, but move manual command sequences, evidence rules and pass criteria to the matching manual testing playbook.` | 1. `agent: Read SKILL.md section 7 and README.md section 5` -> 2. `agent: Inspect the proposed catalog addition for commands, evidence fields and verdict rules` -> 3. `agent: Separate current behavior from manual execution detail` -> 4. `agent: State the catalog edit and the playbook link required` | Step 1 states the boundary. Step 2 finds execution-heavy material. Step 3 keeps behavior and anchors in the catalog. Step 4 moves commands, evidence and verdict rules to the playbook | Exact prompt, boundary source, proposed content, separated content decision and required link | PASS if the catalog stays inventory-first and the playbook receives execution detail. FAIL if the catalog retains a scenario matrix or loses the behavior summary | 1. Remove step-by-step instructions from the catalog. 2. Keep source anchors in the leaf. 3. Link the matching playbook scenario |

### Commands

1. `agent: Read SKILL.md section 7 and README.md section 5`
2. `agent: Inspect the proposed catalog addition for commands, evidence fields and verdict rules`
3. `agent: Separate current behavior from manual execution detail`
4. `agent: State the catalog edit and the playbook link required`

### Expected

The catalog keeps a current-state description and source anchors. The manual playbook owns exact prompts, command sequences, expected signals, evidence, pass or fail criteria and failure triage. The two documents cross-link without duplicating execution truth.

### Evidence

Capture the prompt, boundary references, proposed content, separation decision and the final catalog-to-playbook link.

### Pass / Fail

- **Pass**: the catalog stays inventory-first and the execution matrix moves to the playbook.
- **Fail**: the catalog contains step-by-step test execution or omits the current behavior summary.

### Failure Triage

1. Mark every command and verdict field in the proposed catalog.
2. Move those fields to the playbook.
3. Restore a concise current-state description and source anchors.

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
| [`SKILL.md`](../../SKILL.md) | Catalog and playbook boundary |
| [`README.md`](../../README.md) | Boundary overview |
| [`../../sk-create-manual-testing-playbook/SKILL.md`](../../../sk-create-manual-testing-playbook/SKILL.md) | Manual execution contract |

---

## 5. SOURCE METADATA

- Group: SCOPE AND VALIDATION
- Playbook ID: FCR-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `scope-and-validation/leave-execution-matrices-to-playbook.md`
