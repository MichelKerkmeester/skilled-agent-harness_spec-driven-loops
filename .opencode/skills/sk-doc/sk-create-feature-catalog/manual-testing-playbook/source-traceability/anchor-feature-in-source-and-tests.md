---
title: "FCR-003 -- Anchor a feature in source and tests"
description: "This scenario validates source traceability for FCR-003. Every feature claim has a real implementation row and a validation or test anchor in its per-feature file."
version: 1.0.0.0
---

# FCR-003 -- Anchor a feature in source and tests

This document captures the operator contract for source-backed catalog claims.

## 1. OVERVIEW

This scenario validates source traceability for `FCR-003`. It focuses on implementation and validation tables in a per-feature file.

### Why This Matters

A feature page is useful because a reviewer can follow its claim to a real source file and a real test or validation surface. Vague anchors make the catalog look complete while leaving its claims unauditable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FCR-003` and confirm the anchors.

- Objective: attach a feature claim to real implementation and validation paths
- Realistic user request: `Add this shipped capability to the catalog and show me where the code and tests prove it.`
- Prompt: `Document this shipped feature in a per-feature catalog file. Add an implementation table and a Validation And Tests table with real stable paths. Do not use placeholders.`
- Expected execution process: the snippet template and current target files are read, the feature is described from the caller perspective, source rows use `File | Layer | Role` and validation rows use `File | Type | Role`, then each path is checked.
- Expected signals: the tables name stable existing files. The feature behavior is current-state prose. Placeholder rows are not used when implementation exists.
- Desired user-visible outcome: a catalog leaf that a reviewer can verify without guessing.
- Pass/fail: PASS if implementation and validation anchors are real and typed correctly. FAIL if paths are vague, missing or fabricated.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Document this shipped feature in a per-feature catalog file. Add an implementation table and a Validation And Tests table with real stable paths. Do not use placeholders.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FCR-003 | Anchor a feature in source and tests | Add real implementation and validation anchors | `Document this shipped feature in a per-feature catalog file. Add an implementation table and a Validation And Tests table with real stable paths. Do not use placeholders.` | 1. `agent: Read SKILL.md section 6 and assets/feature-catalog-snippet-template.md` -> 2. `agent: Fill the Implementation and Validation And Tests tables for the supplied feature` -> 3. `agent: Check that every cited path exists and that each validation Type is canonical` -> 4. `bash: python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package sk-doc` | Step 1 identifies the two table taxonomies. Step 2 fills stable paths. Step 3 confirms path existence and type values. Step 4 reports the package result and exit status | Exact prompt, template, filled tables, path checks, package validator output and exit status | PASS if every claim has real implementation and validation anchors. FAIL if the tables are missing, paths are invented or validation types are outside the canonical taxonomy | 1. Recheck each path from the repository root. 2. Compare validation types with the snippet template. 3. Remove any measurement snapshot or placeholder |

### Commands

1. `agent: Read SKILL.md section 6 and assets/feature-catalog-snippet-template.md`
2. `agent: Fill the Implementation and Validation And Tests tables for the supplied feature`
3. `agent: Check that every cited path exists and that each validation Type is canonical`
4. `bash: python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package sk-doc`

### Expected

The implementation table uses `File | Layer | Role`. The validation table uses `File | Type | Role`. Paths exist and types come from the template taxonomy. The leaf describes shipped behavior and does not rely on placeholders or guessed files.

### Evidence

Capture the prompt, template path, both tables, path checks and package-validator output and exit status.

### Pass / Fail

- **Pass**: every feature claim has real source and validation anchors with valid table taxonomy.
- **Fail**: an anchor is fabricated, a validation type is invented or the feature has no test or validation evidence.

### Failure Triage

1. Check the source path from the repository root.
2. Check the Layer and Type values against the template.
3. If no implementation exists, state that current reality instead of inventing a row.

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
| [`SKILL.md`](../../SKILL.md) | Per-feature source and validation requirements |
| [`assets/feature-catalog-snippet-template.md`](../../assets/feature-catalog-snippet-template.md) | Table taxonomies and leaf scaffold |
| [`scripts/validate_catalog_package.py`](../../scripts/validate_catalog_package.py) | Source path and validation taxonomy checks |

---

## 5. SOURCE METADATA

- Group: SOURCE TRACEABILITY
- Playbook ID: FCR-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `source-traceability/anchor-feature-in-source-and-tests.md`
