---
title: Document Quality Workflows - Execution Modes
description: The four execution modes and mode selection for create-quality-control runs, with a route map to the validation, enforcement, and example overflow.
trigger_phrases:
  - "document quality workflows"
  - "doc improvement modes"
  - "validation first workflow"
  - "mode one document quality"
importance_tier: normal
contextType: implementation
version: 1.0.0.35
---

# Document Quality Workflows - Execution Modes

The four execution modes and how to pick one. `SKILL.md` §3 Step 1 owns mode selection at runtime and names these same four modes; this file is the overflow reference — the mode/script/phase/output mapping, plus a route map to the validation sequence, enforcement prompts, and worked examples.

---

## 1. OVERVIEW

### What Are Workflows?

Workflows define the execution patterns and operational modes for the markdown documentation workflow. These workflows orchestrate structure checks, AI-assisted review, and (when desired) content improvement.

**Core Purpose**:
- **Mode selection** - Four execution modes for different use cases
- **Validation workflow** - Post-operation and pre-submission validation patterns
- **Phase orchestration** - Sequential or independent phase execution
- **Error handling** - Graceful degradation with clear error messages

> **📍 Context**: This is a Level 3 reference file (loaded on-demand). For the complete progressive disclosure architecture, see [skill_creation/overview.md § Skill Structure System](../../sk-create-skill/references/shared/overview.md#3-skill-structure-system).

**Scope Note**: This reference covers create-quality-control runs only. For other documentation work, see:
Other documentation workflows are separate `sk-doc` packets rather than numbered modes in this reference: [skill creation](../../sk-create-skill/references/README.md), [diagrams and flowcharts](../../sk-design-diagram/README.md), [README and install guides](../../sk-create-readme/references/README.md), [manual testing playbooks](../../sk-create-manual-testing-playbook/references/README.md), and [feature catalogs](../../sk-create-feature-catalog/references/README.md). Benchmarks, changelogs, diffs, and the quality-control packet are likewise selected through `mode-registry.json`.

The playbook workflow assumes a root directory playbook plus required per-feature files in category folders at the playbook root. Current validation remains root-doc focused and does not recurse into those category folders.

### Core Principle

**"Structure first, optimize second, validate always"** - Enforce valid markdown structure before content optimization, then verify quality at every stage.

---

## 2. FOUR EXECUTION MODES

| Workflow | Phases | Command | Use When | Output |
| --- | --- | --- | --- | --- |
| **Report-only audit** | 1+2 | `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py` + AI eval | Default for `/doc:quality`; critical docs (specs, skills, READMEs) | JSON output + qualitative assessment + recommendations, no edits |
| **Structure validation** | 1 | `python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py` | Readiness or blocking-issue questions, post-save checks | Checklist results + fix list |
| **Content optimization** | 2 | `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py` + AI eval | Improve existing docs for AI | Recommendations for clarity + AI-friendliness |
| **Batch snapshot** | 1 (JSON only) | `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py` per file | Assessing several docs at once, no changes | Per-file JSON report for another agent |

**Mode selection**:
- Auditing an existing SKILL/README/knowledge doc → Report-only audit
- Answering "is this ready to ship" → Structure validation
- Improving an existing README → Content optimization
- Assessing a whole doc set → Batch snapshot

---

## 3. WHERE THE REST LIVES

The validation sequence, enforcement prompts, phase chaining, worked examples, and batch recipes moved to single-concern siblings so this file stays focused on modes:

| Need | Reference |
| --- | --- |
| Validation touchpoints, enforcement approval prompts, phase interactions, troubleshooting | [validation-and-enforcement.md](./validation-and-enforcement.md) |
| Worked command examples and batch/multi-file processing | [workflow-examples.md](./workflow-examples.md) |
| Content transformation procedure and the 16-pattern catalog | [optimization.md](./optimization.md) / [transformation-patterns.md](./transformation-patterns.md) |

---

## 4. RELATED RESOURCES

### Reference Files
- [README.md](./README.md) - create-quality-control reference route map
- [validation-and-enforcement.md](./validation-and-enforcement.md) - Validation, enforcement prompts, phase chaining, troubleshooting
- [workflow-examples.md](./workflow-examples.md) - Worked command examples and batch processing
- [optimization.md](./optimization.md) - Content transformation procedure
- [core-standards.md](../../shared/references/core-standards.md) - Document type rules and structural requirements
- [validation.md](../../shared/references/validation.md) - Quality scoring and validation workflows
- [quick-reference.md](../../shared/references/quick-reference.md) - Quick command reference
- [skill-creation.md](../../sk-create-skill/references/README.md) - Skill creation workflow
- [create-readme references](../../sk-create-readme/references/README.md) - Install guide standards and workflow

### Templates
- [skill-md-template.md](../../sk-create-skill/assets/skill/skill-md-template.md) - SKILL.md file templates
- [command-template.md](../../sk-create-command/assets/command-template.md) - Command file templates
