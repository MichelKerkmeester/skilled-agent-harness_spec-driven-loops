---
title: "SKL-001 -- Scaffold a standalone skill"
description: "This scenario validates standalone skill scaffolding for `SKL-001`. It focuses on concrete use cases, generated shape, cleanup and strict validation."
version: 1.0.0.0
---

# SKL-001 -- Scaffold a standalone skill

This document captures the operator contract for `SKL-001`.

---

## 1. OVERVIEW

This scenario validates the standalone creation workflow for a new skill named `invoice-review`. It checks understanding, reusable-resource planning, initialization, cleanup, normalization, strict validation and packaging order.

### Why This Matters

The scaffold is only a starting point. It can contain example files and TODO text that do not belong in a shipped skill. Strict validation must pass before packaging so the archive does not preserve an incomplete root.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-001` and compare the final package with the selected standalone workflow.

- Objective: scaffold and package a valid standalone skill after removing unused generated examples
- Realistic user request: `Create a standalone OpenCode skill named invoice-review under .opencode/skills and package it.`
- Prompt: `Create a standalone OpenCode skill named invoice-review under .opencode/skills and package it.`
- Expected execution process: understand concrete invoice-review examples, plan resources, run `init_skill.py`, normalize the root sections, delete unused examples, run strict package validation and package only after the check passes.
- Expected signals: the folder name and frontmatter name match, the SKILL file has all required sections, no TODO or unused example remains, strict validation passes and the package command runs after validation.
- Desired user-visible outcome: a usable standalone skill package with a clear runtime contract.
- Pass/fail: PASS if strict validation passes before packaging and the final folder has no unused scaffold examples. FAIL if packaging runs first, placeholders remain or the root class is ambiguous.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a standalone OpenCode skill named invoice-review under .opencode/skills and package it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-001 | Scaffold a standalone skill | Scaffold and package a valid standalone skill after removing unused generated examples | `Create a standalone OpenCode skill named invoice-review under .opencode/skills and package it.` | 1. `agent: Identify concrete invoice-review use cases, triggers, output contract and boundaries` -> 2. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py invoice-review --path .opencode/skills` -> 3. `agent: Normalize SKILL.md, add needed resources and delete unused example files` -> 4. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/invoice-review --check --strict` -> 5. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/invoice-review ./dist` | Step 1: the supported use cases and boundaries are concrete. Step 2: a standalone scaffold is created. Step 3: required sections and resources remain with no unused examples. Step 4: strict validation passes. Step 5: packaging runs after validation | The exact prompt, use-case notes, init transcript, final file list, strict validation output and exit status and package path | PASS if the root is valid before packaging and the final package has no placeholders or unused examples. FAIL if packaging precedes validation or the scaffold ships unchanged | 1. Inspect the final file list for generated examples and TODO text. 2. Confirm `name` matches `invoice-review`. 3. Read the strict validation output before accepting the package |

### Commands

1. `agent: Identify concrete invoice-review use cases, triggers, output contract and boundaries`
2. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py invoice-review --path .opencode/skills`
3. `agent: Normalize SKILL.md, add needed resources and delete unused example files`
4. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/invoice-review --check --strict`
5. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/invoice-review ./dist`

### Expected

Step 1 defines the skill before files are authored. Step 2 creates the starter shape. Step 3 turns the starter into a focused skill and removes files that the final package does not need. Step 4 is the authoritative strict check. Step 5 packages the validated result.

### Evidence

Capture the prompt, use-case notes, init output, final file list, strict validation output with exit status and package path.

### Pass / Fail

- **Pass**: the standalone root is normalized, strict validation passes before packaging and no unused scaffold example remains.
- **Fail**: packaging runs before validation, placeholders remain, the folder and `name` differ or the root lacks the required workflow sections.

### Failure Triage

1. Inspect the root folder and frontmatter name.
2. Search the final tree for TODO text and generated example files.
3. Re-run strict validation and read its output and exit status.

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
| [`SKILL.md`](../../SKILL.md) | Standalone creation workflow and package order |
| [`references/skill/creation-workflow.md`](../../references/skill/creation-workflow.md) | Six-step creation process |
| [`scripts/init_skill.py`](../../scripts/init_skill.py) | Standalone scaffold producer |
| [`scripts/package_skill.py`](../../scripts/package_skill.py) | Strict validation and packaging gate |

---

## 5. SOURCE METADATA

- Group: STANDALONE SKILL
- Playbook ID: SKL-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `standalone-skill/scaffold-a-standalone-skill.md`
