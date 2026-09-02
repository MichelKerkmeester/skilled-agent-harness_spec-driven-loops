---
title: "RME-002 -- Code-folder navigation shape"
description: "This scenario validates choosing a directory tree for nested code folders or a complete direct-file inventory for flat folders."
version: 1.1.0.1
---

# RME-002 -- Code-folder navigation shape

This document captures the code-folder README navigation contract.

---

## 1. OVERVIEW

This scenario validates code-folder README structure for `RME-002`. It focuses on the actual immediate-subdirectory count and the matching navigation artifact.

### Why This Matters

The mode has two named navigation branches. Nested folders need a fenced directory tree. Flat folders need a complete `KEY FILES`, `CONTENTS` or `FILES` table. The operator must inspect the folder instead of choosing the shape by preference.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RME-002`.

- Objective: choose the code-folder navigation shape from the target folder's actual structure.
- Realistic user request: `Write a README for this source folder. Use the actual folder shape to decide between a directory tree and a complete direct-file table.`
- Prompt: `Write a README for this source folder. Use the actual folder shape to decide between a directory tree and a complete direct-file table.`
- Expected execution process: read the code-folder rules, count immediate subdirectories and draft the matching navigation block.
- Expected signals: nested folders produce a fenced tree, flat folders produce a complete direct-file inventory and direct files are named accurately.
- Desired user-visible outcome: a developer can navigate the folder from its README.
- Pass/fail: PASS if the navigation shape follows the count. FAIL if a tree is omitted for a nested folder or a flat folder lacks a complete file table.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Write a README for this source folder. Use the actual folder shape to decide between a directory tree and a complete direct-file table.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RME-002 | Code-folder navigation shape | Match tree or file inventory to the actual folder shape | `Write a README for this source folder. Use the actual folder shape to decide between a directory tree and a complete direct-file table.` | 1. `agent: Read SKILL.md Section 6 and state the two navigation branches` -> 2. `bash: find .opencode/skills/sk-doc/sk-create-readme -mindepth 1 -maxdepth 1 -type d -print` -> 3. `agent: Select the tree or direct-file inventory branch from the observed count` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-readme/SKILL.md` | Step 1: both branches are stated. Step 2: the immediate-directory output is captured. Step 3: the selected shape matches the count. Step 4: validator output and exit status are captured | The prompt, navigation rule, directory listing, selected branch and validator transcript | PASS if the shape matches the observed folder structure. FAIL if the mode chooses by preference or omits the required navigation artifact | 1. Count only immediate subdirectories. 2. List every direct file when the folder is flat. 3. Use a fenced tree when at least one immediate subdirectory exists |

### Commands

1. `agent: Read SKILL.md Section 6 and state the two navigation branches`
2. `bash: find .opencode/skills/sk-doc/sk-create-readme -mindepth 1 -maxdepth 1 -type d -print`
3. `agent: Select the tree or direct-file inventory branch from the observed count`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-readme/SKILL.md`

### Expected

Step 1 names the nested and flat branches. Step 2 counts the actual immediate directories. Step 3 selects the corresponding navigation block. Step 4 records a real structure check.

### Evidence

Capture the prompt, branch rule, directory listing, selected navigation block and validator output with its exit status.

### Pass / Fail

- **Pass**: the README has a fenced tree for a nested folder or a complete direct-file table for a flat folder.
- **Fail**: the navigation shape does not follow the observed count or omits a direct file.

### Failure Triage

1. Re-run the immediate-directory listing.
2. Check the README for the required tree or inventory.
3. Compare every listed file with the target folder.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory and scenario summary |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Code-folder README shape |
| [`../../assets/readme-code-template.md`](../../assets/readme-code-template.md) | Code-folder README scaffold |
| [`../../references/readme/quality-and-checklist.md`](../../references/readme/quality-and-checklist.md) | Navigation quality checks |

---

## 5. SOURCE METADATA

- Group: EVIDENCE AND SHAPE
- Playbook ID: RME-002
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `evidence-and-shape/code-folder-navigation-shape.md`
