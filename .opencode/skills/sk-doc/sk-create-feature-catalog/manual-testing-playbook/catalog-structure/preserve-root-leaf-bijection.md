---
title: "FCR-002 -- Preserve root-to-leaf bijection"
description: "This scenario validates root-to-leaf bijection for FCR-002. Every root link resolves to one per-feature file and every per-feature file appears in the root inventory."
version: 1.0.0.1
---

# FCR-002 -- Preserve root-to-leaf bijection

This document captures the operator contract for catalog parity.

## 1. OVERVIEW

This scenario validates root-to-leaf bijection for `FCR-002`. It focuses on the two-way link invariant.

### Why This Matters

A root catalog can look complete while a leaf file is orphaned or a root link points at a missing file. The package validator checks both directions. The root is the navigation authority, so a leaf that is not linked is not part of the catalog.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FCR-002` and confirm the parity check.

- Objective: prove that root links and per-feature files form a one-to-one set
- Realistic user request: `Review this catalog for missing or orphaned feature pages before I publish it.`
- Prompt: `Check the feature-catalog root against its category files. Find missing links and orphaned leaves in both directions, then report the exact files that need repair.`
- Expected execution process: the root and package tree are read, each local Markdown link is resolved, the root set is compared with the leaf set and any mismatch is reported before publication.
- Expected signals: missing root targets and unlinked leaves are distinct findings. A clean package has equal root-link and leaf sets.
- Desired user-visible outcome: a precise parity report that names every mismatch.
- Pass/fail: PASS if both directions are checked and the result is explicit. FAIL if only root links or only leaf files are inspected.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check the feature-catalog root against its category files. Find missing links and orphaned leaves in both directions, then report the exact files that need repair.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FCR-002 | Preserve root-to-leaf bijection | Check missing root targets and orphaned leaves in both directions | `Check the feature-catalog root against its category files. Find missing links and orphaned leaves in both directions, then report the exact files that need repair.` | 1. `agent: Read SKILL.md section 7 and scripts/README.md` -> 2. `agent: List every Markdown link from the root catalog to a category file` -> 3. `agent: List every per-feature Markdown file below the catalog root` -> 4. `agent: Compare both sets and report missing targets and orphaned leaves` | Step 1 identifies package-level bijection. Step 2 produces root link set. Step 3 produces leaf set. Step 4 reports both mismatch directions or confirms equal sets | Exact prompt, source sections, root-link list, leaf list, comparison and named findings | PASS if both sets are compared and every mismatch is named. FAIL if a root-only or leaf-only check is used | 1. Resolve links relative to the root file. 2. Exclude the root file itself from the leaf set. 3. Fix each mismatch before publication |

### Commands

1. `agent: Read SKILL.md section 7 and scripts/README.md`
2. `agent: List every Markdown link from the root catalog to a category file`
3. `agent: List every per-feature Markdown file below the catalog root`
4. `agent: Compare both sets and report missing targets and orphaned leaves`

### Expected

The root-link set and the per-feature file set are compared in both directions. A missing target is different from an orphaned leaf. A clean result has one root link for each leaf and no extra leaf file.

### Evidence

Capture the prompt, package-level rule, root-link list, leaf list, comparison and every mismatch or clean result.

### Pass / Fail

- **Pass**: both directions are checked and the exact parity result is reported.
- **Fail**: the run checks only links, checks only files or accepts a mismatch without naming it.

### Failure Triage

1. Normalize local links from the root directory.
2. Remove the root catalog from the leaf inventory.
3. Add or remove the exact missing link or file and run the comparison again.

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
| [`SKILL.md`](../../SKILL.md) | Root and leaf invariants |
| [`scripts/validate_catalog_package.py`](../../scripts/validate_catalog_package.py) | Package-level bijection enforcement |
| [`scripts/README.md`](../../scripts/README.md) | Validator scope and command |

---

## 5. SOURCE METADATA

- Group: CATALOG STRUCTURE
- Playbook ID: FCR-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `catalog-structure/preserve-root-leaf-bijection.md`
