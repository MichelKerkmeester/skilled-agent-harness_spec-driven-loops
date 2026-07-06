---
title: Skill Creation Workflow
description: Complete guide for creating, validating, and distributing AI agent skills with bundled resources.
trigger_phrases:
  - "skill creation workflow"
  - "create new skill"
  - "skill validation standards"
  - "skill packaging distribution"
  - "progressive disclosure skills"
importance_tier: normal
contextType: implementation
version: 1.8.0.35
---

# Skill Creation Workflow - Complete Development Guide

Routing hub for the full skill lifecycle. The depth lives in three grouped subfolders — `shared/` (concepts common to both), `skill/` (standalone-skill creation), and `parent_skill/` (parent-hub pattern); this file maps each concern to its focused reference.

---

## 1. OVERVIEW

This file is a thin index over the skill-creation reference set. Each stage of the lifecycle — what a skill is, how to build one, how to validate and ship it, the pitfalls to avoid, worked examples and maintenance, and the parent-hub pattern — lives in its own single-concern file, grouped under `shared/`, `skill/`, and `parent_skill/`.

**Core Principle**: Progressive disclosure maximizes value, minimizes cost — for the skill being built and for this documentation set.

```
Level 1: SKILL.md metadata (name + description) — Always in context (~100 words)
Level 2: SKILL.md body — When skill triggers (<5k words)
Level 3: Bundled resources (the shared/, skill/, parent_skill/ groups) — Loaded as needed
```

Skills are modular packages that extend an AI agent with specialized workflows, tool integrations, domain expertise, and bundled resources (scripts, references, assets). Open only the subfolder file the current task needs.

---

## 2. REFERENCE MAP

Load the file that matches the current task:

| Concern | Reference | Load When |
| --- | --- | --- |
| **What a skill is** — anatomy, SKILL.md required sections, bundled-resource directories, layered-doc structure system | [overview.md](shared/overview.md) | Orienting on skill structure, or deciding where content belongs (SKILL.md vs references vs assets) |
| **The create workflow** — the six ordered steps from concept to packaged skill, SKILL.md authoring questions, frontmatter completion | [creation_workflow.md](skill/creation_workflow.md) | Building a new skill or rebuilding an existing one |
| **Validation and packaging** — minimal vs comprehensive validation, distribution checklist, installation | [validation_and_packaging.md](shared/validation_and_packaging.md) | Before packaging, releasing, or diagnosing a rejected skill |
| **Common pitfalls** — eight recurring defects (generic/bloated description, oversized SKILL.md, missing resources, unclear triggers, second-person voice, platform assumptions, multiline YAML, misplaced references) | [common_pitfalls.md](shared/common_pitfalls.md) | A skill does not trigger, bloats context, or fails budget checks; reviewing fresh authored skills |
| **Examples and maintenance** — worked example skill layouts (PDF editor, brand guidelines, database query) and the update/versioning workflow | [examples_and_maintenance.md](skill/examples_and_maintenance.md) | Modeling a new skill on a proven layout, or maintaining and versioning a shipped skill |
| **Parent hubs with nested mode packets** — one advisor identity dispatching to workflow and surface packets through a two-axis `modes[]` registry with `packetKind`, named extensions, and required hub-router metadata | [parent_skills_nested_packets.md](parent_skill/parent_skills_nested_packets.md) | Designing or repairing a parent skill, parent hub, mode packet, surface packet, mode registry, or hub router |
| **Parent hub router schema** — detailed schema companion for `mode-registry.json`, `hub-router.json`, `packetKind`, `surfaceBundle`, router signals, vocabulary classes, and named extensions | [parent_hub_router_schema.md](parent_skill/parent_hub_router_schema.md) | Validating or authoring parent-hub router metadata and two-axis mode declarations |

---

## 3. RELATED RESOURCES

### Skill-Creation Subfolder
- [overview.md](shared/overview.md) - Skill anatomy, SKILL.md requirements, and layered structure system
- [creation_workflow.md](skill/creation_workflow.md) - The six-step skill creation process
- [validation_and_packaging.md](shared/validation_and_packaging.md) - Validation requirements and distribution
- [common_pitfalls.md](shared/common_pitfalls.md) - Common skill-creation pitfalls and fixes
- [examples_and_maintenance.md](skill/examples_and_maintenance.md) - Example skills and maintenance workflow
- [parent_skills_nested_packets.md](parent_skill/parent_skills_nested_packets.md) - Parent hubs with nested workflow and surface packets
- [parent_hub_router_schema.md](parent_skill/parent_hub_router_schema.md) - Parent hub router and two-axis mode schema

### Templates
- [skill_md_template.md](../assets/skill/skill_md_template.md) - SKILL.md file templates
- [skill_readme_template.md](../assets/skill/skill_readme_template.md) - Skill README file template
- [skill_reference_template.md](../assets/skill/skill_reference_template.md) - Reference file templates
- [skill_asset_template.md](../assets/skill/skill_asset_template.md) - Asset file templates
- [parent_skill_hub_template.md](../assets/parent_skill/parent_skill_hub_template.md) - Parent-skill routing hub SKILL.md
- [parent_skill_registry_template.json](../assets/parent_skill/parent_skill_registry_template.json) - Parent-skill mode-registry.json
- [frontmatter_templates.md](../../shared/assets/frontmatter_templates.md) - Frontmatter by document type

### Reference Files
- [core_standards.md](../../shared/references/global/core_standards.md) - Document type rules and structural requirements
- [validation.md](../../shared/references/global/validation.md) - Quality scoring and validation workflows
- [quick_reference.md](../../shared/references/global/quick_reference.md) - Quick command reference
- [install_guide_creation.md](../../create-readme/references/install_guide_creation.md) - Install guide standards and workflow

---

*End of Skill Creation Workflow hub — depth lives in the `shared/`, `skill/`, and `parent_skill/` groups.*
