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
version: 1.8.0.36
---

# Skill Creation Workflow - Complete Development Guide

Routing hub for the full skill lifecycle. The depth lives in three grouped subfolders — `shared/` (concepts common to both), `skill/` (standalone-skill creation), and `parent-skill/` (parent-hub pattern); this file maps each concern to its focused reference.

---

## 1. OVERVIEW

This file is a thin index over the skill-creation reference set. Each stage of the lifecycle — what a skill is, how to build one, how to validate and ship it, the pitfalls to avoid, worked examples and maintenance, and the parent-hub pattern — lives in its own single-concern file, grouped under `shared/`, `skill/`, and `parent-skill/`.

**Core Principle**: Progressive disclosure maximizes value, minimizes cost — for the skill being built and for this documentation set.

```
Level 1: SKILL.md metadata (name + description) — Always in context (~100 words)
Level 2: SKILL.md body — When skill triggers (<5k words)
Level 3: Bundled resources (the shared/, skill/, parent-skill/ groups) — Loaded as needed
```

Skills are modular packages that extend an AI agent with specialized workflows, tool integrations, domain expertise, and bundled resources (scripts, references, assets). Open only the subfolder file the current task needs.

---

## 2. REFERENCE MAP

Load the file that matches the current task:

| Concern | Reference | Load When |
| --- | --- | --- |
| **What a skill is** — anatomy, SKILL.md required sections, bundled-resource directories, layered-doc structure system | [overview.md](shared/overview.md) | Orienting on skill structure, or deciding where content belongs (SKILL.md vs references vs assets) |
| **The create workflow** — the six ordered steps from concept to packaged skill, SKILL.md authoring questions, frontmatter completion | [creation-workflow.md](skill/creation-workflow.md) | Building a new skill or rebuilding an existing one |
| **Validation and packaging** — minimal vs comprehensive validation, distribution checklist, installation | [validation-and-packaging.md](shared/validation-and-packaging.md) | Before packaging, releasing, or diagnosing a rejected skill |
| **Common pitfalls** — eight recurring defects (generic/bloated description, oversized SKILL.md, missing resources, unclear triggers, second-person voice, platform assumptions, multiline YAML, misplaced references) | [common-pitfalls.md](shared/common-pitfalls.md) | A skill does not trigger, bloats context, or fails budget checks; reviewing fresh authored skills |
| **Examples and maintenance** — worked example skill layouts (PDF editor, brand guidelines, database query) and the update/versioning workflow | [examples-and-maintenance.md](skill/examples-and-maintenance.md) | Modeling a new skill on a proven layout, or maintaining and versioning a shipped skill |
| **Parent hubs with nested mode packets** — one advisor identity dispatching to workflow and surface packets through a two-axis `modes[]` registry with `packetKind`, named extensions, and required hub-router metadata | [parent-skills-nested-packets.md](parent-skill/parent-skills-nested-packets.md) | Designing or repairing a parent skill, parent hub, mode packet, surface packet, mode registry, or hub router |
| **Parent hub router schema** — detailed schema companion for `mode-registry.json`, `hub-router.json`, `packetKind`, `surfaceBundle`, router signals, vocabulary classes, and named extensions | [parent-hub-router-schema.md](parent-skill/parent-hub-router-schema.md) | Validating or authoring parent-hub router metadata and two-axis mode declarations |
| **Compiled-routing architecture** — which seven hubs the compiled router serves and why, the shadow-child-to-cohort chain, the compiled-serving parity bar, and why a fresh `--compiled-routing ready` manifest is onboarding evidence, not a working compiled route | [compiled-routing-architecture.md](parent-skill/compiled-routing-architecture.md) | Deciding or explaining `--compiled-routing legacy\|ready`, or a parent hub's path toward the compiled router |

---

## 3. RELATED RESOURCES

### Skill-Creation Subfolder
- [overview.md](shared/overview.md) - Skill anatomy, SKILL.md requirements, and layered structure system
- [creation-workflow.md](skill/creation-workflow.md) - The six-step skill creation process
- [validation-and-packaging.md](shared/validation-and-packaging.md) - Validation requirements and distribution
- [common-pitfalls.md](shared/common-pitfalls.md) - Common skill-creation pitfalls and fixes
- [examples-and-maintenance.md](skill/examples-and-maintenance.md) - Example skills and maintenance workflow
- [parent-skills-nested-packets.md](parent-skill/parent-skills-nested-packets.md) - Parent hubs with nested workflow and surface packets
- [parent-hub-router-schema.md](parent-skill/parent-hub-router-schema.md) - Parent hub router and two-axis mode schema
- [compiled-routing-architecture.md](parent-skill/compiled-routing-architecture.md) - Compiled router scope, shadow-child-to-cohort chain, and the ready-vs-compiled-serving boundary

### Templates
- [skill-md-template.md](../assets/skill/skill-md-template.md) - SKILL.md file templates
- [skill-readme-template.md](../assets/skill/skill-readme-template.md) - Skill README file template
- [skill-reference-template.md](../assets/skill/skill-reference-template.md) - Reference file templates
- [skill-asset-template.md](../assets/skill/skill-asset-template.md) - Asset file templates
- [skill-procedure-template.md](../assets/skill/skill-procedure-template.md) - Private procedure card templates and guidelines
- [parent-skill-hub-template.md](../assets/parent-skill/parent-skill-hub-template.md) - Parent-skill routing hub SKILL.md
- [parent-skill-registry-template.json](../assets/parent-skill/parent-skill-registry-template.json) - Parent-skill mode-registry.json
- [frontmatter-templates.md](../../shared/assets/frontmatter-templates.md) - Frontmatter by document type

### Reference Files
- [core-standards.md](../../shared/references/core-standards.md) - Document type rules and structural requirements
- [validation.md](../../shared/references/validation.md) - Quality scoring and validation workflows
- [quick-reference.md](../../shared/references/quick-reference.md) - Quick command reference
- [references/README.md](../../create-readme/references/README.md) - Install guide standards and workflow

---

*End of Skill Creation Workflow hub — depth lives in the `shared/`, `skill/`, and `parent-skill/` groups.*
