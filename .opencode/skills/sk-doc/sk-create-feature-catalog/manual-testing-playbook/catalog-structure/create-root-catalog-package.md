---
title: "FCR-001 -- Create the root catalog package"
description: "This scenario validates root catalog package shape for FCR-001. The root inventory uses numbered sections and each entry maps to a per-feature file in a descriptive category folder."
version: 1.0.0.1
---

# FCR-001 -- Create the root catalog package

This document captures the operator contract for creating a feature-catalog package.

## 1. OVERVIEW

This scenario validates root catalog package shape for `FCR-001`. It focuses on the root inventory and its category folders.

### Why This Matters

The catalog separates orientation from proof. The root file lists current capabilities by category. The per-feature files carry behavior and source anchors. A flat README or a root-only list cannot provide the same stable navigation.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FCR-001` and confirm the expected package shape.

- Objective: create a root catalog and one linked per-feature file for each category entry
- Realistic user request: `Build a feature catalog for this skill. Group the shipped capabilities and give each one a source-backed detail page.`
- Prompt: `Create a feature-catalog package for this skill. Start with the root inventory, define descriptive categories and create one source-backed per-feature file for every root entry.`
- Expected execution process: the feature-catalog skill and templates are read, the target surface is inspected, categories and slugs are stabilized, the root is authored first and each root row receives one leaf file.
- Expected signals: the package contains `feature-catalog/feature-catalog.md`, bare kebab-case category folders and bare kebab-case per-feature files. The root has numbered H2 sections and each entry has Description, Current Reality and Source Files.
- Desired user-visible outcome: a navigable current-state catalog with one detail file behind each entry.
- Pass/fail: PASS if the canonical shape and root entry fields are present. FAIL if the root is a roadmap, a category has a numeric prefix or a root entry has no leaf.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a feature-catalog package for this skill. Start with the root inventory, define descriptive categories and create one source-backed per-feature file for every root entry.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FCR-001 | Create the root catalog package | Build the canonical root and leaf package shape | `Create a feature-catalog package for this skill. Start with the root inventory, define descriptive categories and create one source-backed per-feature file for every root entry.` | 1. `agent: Read SKILL.md sections 3 through 6 and both catalog templates` -> 2. `agent: State the root file, category and per-feature naming rules` -> 3. `agent: Inspect the drafted root entries and linked category files` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/check_no_hyphenated_catalog_content.py .opencode/skills/sk-doc/sk-create-feature-catalog/manual-testing-playbook` | Step 1 identifies the canonical shape. Step 2 names bare kebab-case categories and leaves. Step 3 finds one leaf per root entry. Step 4 passes the new-content naming guard with exit status 0 | Exact prompt, skill and template paths, naming rules, root-to-leaf inventory and guard output and exit status | PASS if the root and leaves follow the canonical shape. FAIL if an entry lacks a leaf or a path uses a numeric prefix or underscore | 1. Compare root links with files on disk. 2. Check category and filename slugs. 3. Keep display order in the root index |

### Commands

1. `agent: Read SKILL.md sections 3 through 6 and both catalog templates`
2. `agent: State the root file, category and per-feature naming rules`
3. `agent: Inspect the drafted root entries and linked category files`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/check_no_hyphenated_catalog_content.py .opencode/skills/sk-doc/sk-create-feature-catalog/manual-testing-playbook`

### Expected

The canonical root is `feature-catalog/feature-catalog.md`. Category folders and per-feature files use descriptive kebab-case slugs without numeric prefixes. The root uses numbered H2 sections. Every entry links to a single per-feature file with the required detail sections.

### Evidence

Capture the prompt, skill and template paths, naming rule, root links and leaf inventory and guard output and exit status.

### Pass / Fail

- **Pass**: root, category and leaf shape match the templates and every root entry has one linked leaf.
- **Fail**: the root has an orphan row, a numeric or underscore path or execution-heavy content that belongs in a playbook.

### Failure Triage

1. Read the root template again.
2. Build the root-link to leaf map.
3. Rename only before publication if a slug violates the naming rule.
4. Move execution detail to a manual playbook.

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
| [`SKILL.md`](../../SKILL.md) | Package contract and creation workflow |
| [`assets/feature-catalog-template.md`](../../assets/feature-catalog-template.md) | Root and leaf scaffold |
| [`README.md`](../../README.md) | Package overview and quick-start validation |

---

## 5. SOURCE METADATA

- Group: CATALOG STRUCTURE
- Playbook ID: FCR-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `catalog-structure/create-root-catalog-package.md`
