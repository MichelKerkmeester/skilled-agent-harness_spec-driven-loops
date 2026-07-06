---
title: Document Quality Workflows - Execution Modes (Mode 1)
description: The four execution modes and mode selection for Mode 1 document-quality workflows, with a route map to the validation, enforcement, and example overflow.
trigger_phrases:
  - "document quality workflows"
  - "doc improvement modes"
  - "validation first workflow"
  - "mode one document quality"
importance_tier: normal
contextType: implementation
version: 1.8.0.20
---

# Document Quality Workflows - Execution Modes (Mode 1)

The four execution modes and how to pick one, for Mode 1 (Document Quality) workflows. `SKILL.md` §2 Step 1 owns mode selection at runtime; this file is the overflow reference — the mode/script/phase/output mapping, plus a route map to the validation sequence, enforcement prompts, and worked examples.

---

## 1. OVERVIEW

### What Are Workflows?

Workflows define the execution patterns and operational modes for the markdown documentation workflow. These workflows orchestrate structure checks, AI-assisted review, and (when desired) content improvement.

**Core Purpose**:
- **Mode selection** - Four execution modes for different use cases
- **Validation workflow** - Post-operation and pre-submission validation patterns
- **Phase orchestration** - Sequential or independent phase execution
- **Error handling** - Graceful degradation with clear error messages

> **📍 Context**: This is a Level 3 reference file (loaded on-demand). For the complete progressive disclosure architecture, see [skill_creation/overview.md § Skill Structure System](../../create-skill/references/shared/overview.md#3-skill-structure-system).

**Scope Note**: This reference covers Mode 1 (Document Quality) workflows only. For other modes, see:
- Mode 2 (Skill Creation): [skill_creation.md](../../create-skill/references/README.md)
- Mode 3 (Flowcharts): [create-flowchart/assets/flowcharts/](../../create-flowchart/assets/flowcharts/)
- Mode 4 (Install Guides): [create-readme references](../../create-readme/references/README.md)
- Mode 5 (Playbooks): [create-manual-testing-playbook references](../../create-manual-testing-playbook/references/README.md), [manual_testing_playbook_template.md](../../create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md), and [manual_testing_playbook_snippet_template.md](../../create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_snippet_template.md)
- Companion catalog workflow: [create-feature-catalog references](../../create-feature-catalog/references/README.md) plus the [feature catalog template bundle](../../create-feature-catalog/assets/feature_catalog/)

The playbook workflow assumes a root directory playbook plus required per-feature files in numbered category folders at the playbook root. Current validation remains root-doc focused and does not recurse into those category folders.

### Core Principle

**"Structure first, optimize second, validate always"** - Enforce valid markdown structure before content optimization, then verify quality at every stage.

---

## 2. FOUR EXECUTION MODES

| Workflow | Phases | Command | Use When | Output |
| --- | --- | --- | --- | --- |
| **Script-assisted review** | 1+2 | `python ../shared/scripts/extract_structure.py` + AI eval | Critical docs (specs, skills, READMEs) | JSON output + qualitative assessment + recommendations |
| **Structure checks** | 1 | `python ../shared/scripts/quick_validate.py` | File save, structural validation | Checklist results + fix list |
| **Content optimization** | 2 | `python ../shared/scripts/extract_structure.py` + AI eval | Improve existing docs for AI | Recommendations for clarity + AI-friendliness |
| **Audit snapshot** | 1 (JSON only) | `python ../shared/scripts/extract_structure.py` | Quality audit, no changes | JSON report for another agent |

**Mode selection**:
- Creating new SKILL/Knowledge → Script-assisted review
- Saving files → Structure checks
- Improving README → Content optimization
- Pre-release check → Structure checks + review

---

## 3. WHERE THE REST LIVES

The validation sequence, enforcement prompts, phase chaining, worked examples, and batch recipes moved to single-concern siblings so this file stays focused on modes:

| Need | Reference |
| --- | --- |
| Validation touchpoints, enforcement approval prompts, phase interactions, troubleshooting | [validation_and_enforcement.md](./validation_and_enforcement.md) |
| Worked command examples and batch/multi-file processing | [workflow_examples.md](./workflow_examples.md) |
| Content transformation procedure and the 16-pattern catalog | [optimization.md](./optimization.md) / [transformation_patterns.md](./transformation_patterns.md) |

---

## 4. RELATED RESOURCES

### Reference Files
- [README.md](./README.md) - doc-quality reference route map
- [validation_and_enforcement.md](./validation_and_enforcement.md) - Validation, enforcement prompts, phase chaining, troubleshooting
- [workflow_examples.md](./workflow_examples.md) - Worked command examples and batch processing
- [optimization.md](./optimization.md) - Content transformation procedure
- [core_standards.md](../../shared/references/global/core_standards.md) - Document type rules and structural requirements
- [validation.md](../../shared/references/global/validation.md) - Quality scoring and validation workflows
- [quick_reference.md](../../shared/references/global/quick_reference.md) - Quick command reference
- [skill_creation.md](../../create-skill/references/README.md) - Skill creation workflow
- [create-readme references](../../create-readme/references/README.md) - Install guide standards and workflow

### Templates
- [skill_md_template.md](../../create-skill/assets/skill/skill_md_template.md) - SKILL.md file templates
- [command_template.md](../../create-command/assets/command/command_template.md) - Command file templates
