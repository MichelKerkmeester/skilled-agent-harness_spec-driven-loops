---
title: "FCR-006 -- Validate a leaf from the repository root"
description: "This scenario validates repository-root validation for FCR-006. The root catalog and each per-feature leaf are checked with the shared validator and the package validator."
version: 1.0.0.0
---

# FCR-006 -- Validate a leaf from the repository root

This document captures the operator contract for catalog validation commands.

## 1. OVERVIEW

This scenario validates repository-root validation for `FCR-006`. It focuses on the path context needed to detect a per-feature catalog leaf.

### Why This Matters

The shared validator detects the leaf document type from the repository-root-relative path. Running the same file from the wrong directory can miss the leaf-specific table checks. The package validator then covers the cross-file rules that a single-file check cannot see.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FCR-006` and confirm the validation path.

- Objective: validate the root and leaf with the correct repository-root path context
- Realistic user request: `Run the catalog checks and make sure the per-feature source tables are included.`
- Prompt: `Validate this feature catalog from the repository root. Run the shared validator on the root and a leaf, then run the package validator for cross-file parity and source-path checks.`
- Expected execution process: the validation workflow is read, the root and leaf commands are run from the repository root and the package validator checks bijection, source paths and validation taxonomy.
- Expected signals: root validation uses the root catalog path. Leaf validation uses the full `feature-catalog/<category>/<feature>.md` path. Package validation reports its package result.
- Desired user-visible outcome: structural and cross-file checks that actually exercise the leaf contract.
- Pass/fail: PASS if all commands use repository-root paths and pass. FAIL if the leaf is validated from a context that misses its document type or if package parity is skipped.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Validate this feature catalog from the repository root. Run the shared validator on the root and a leaf, then run the package validator for cross-file parity and source-path checks.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FCR-006 | Validate a leaf from the repository root | Run root, leaf and package checks with the correct path context | `Validate this feature catalog from the repository root. Run the shared validator on the root and a leaf, then run the package validator for cross-file parity and source-path checks.` | 1. `agent: Read SKILL.md section 7 and README.md verification` -> 2. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-feature-catalog/manual-testing-playbook/manual-testing-playbook.md` -> 3. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-feature-catalog/manual-testing-playbook/catalog-structure/create-root-catalog-package.md` -> 4. `bash: python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package sk-doc` | Step 1 names root, leaf and package checks. Step 2 runs the root check. Step 3 runs the leaf check with the repository-root-relative path. Step 4 checks cross-file rules and returns its result and exit status | Exact prompt, source sections, three command transcripts with exit statuses and package result | PASS if the root, leaf and package commands all run from the repository root and pass. FAIL if a check is skipped or run against the wrong path context | 1. Confirm the working directory. 2. Re-run the leaf with its full path. 3. Run the package validator after single-file checks |

### Commands

1. `agent: Read SKILL.md section 7 and README.md verification`
2. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-feature-catalog/manual-testing-playbook/manual-testing-playbook.md`
3. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-feature-catalog/manual-testing-playbook/catalog-structure/create-root-catalog-package.md`
4. `bash: python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package sk-doc`

### Expected

The root command validates the package root. The leaf command uses the repository-root-relative path so the feature-catalog document type and its Validation And Tests table are detected. The package validator checks cross-file parity, source paths and taxonomy.

### Evidence

Capture the prompt, validation guidance, all three command outputs and exit statuses and the package result.

### Pass / Fail

- **Pass**: root, leaf and package checks run from the repository root and pass.
- **Fail**: the leaf check uses an incomplete path, package validation is omitted or any required check fails.

### Failure Triage

1. Confirm the working directory is the repository root.
2. Re-run the root and leaf commands with full paths.
3. Run the package validator to expose cross-file defects.

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
| [`SKILL.md`](../../SKILL.md) | Validation workflow and path context |
| [`README.md`](../../README.md) | Verification commands and expected results |
| [`scripts/validate_catalog_package.py`](../../scripts/validate_catalog_package.py) | Cross-file package validator |

---

## 5. SOURCE METADATA

- Group: SCOPE AND VALIDATION
- Playbook ID: FCR-006
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `scope-and-validation/validate-leaf-from-repository-root.md`
