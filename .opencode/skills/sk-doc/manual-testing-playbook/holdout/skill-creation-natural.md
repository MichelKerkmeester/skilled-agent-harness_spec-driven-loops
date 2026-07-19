---
id: SD-H01
category: holdout
title: 'Holdout — SKILL_CREATION via natural phrasing'
expected_intent: create-skill
expected_resources:
  - create-skill/references/skill/creation-workflow.md
  - create-skill/assets/skill/skill-md-template.md
  - create-skill/assets/skill/skill-readme-template.md
  - create-skill/assets/skill/skill-reference-template.md
expected_workflow_mode: create-skill
expected_leaf_resources:
  - workflow_mode: create-skill
    leaf_resource_id: references/skill/creation-workflow.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-md-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-readme-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-reference-template.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H01: SKILL_CREATION Held-Out (decontaminated phrasing)

## Purpose

Generalization probe. The correct answer is identical to the fitted SKILL_CREATION
scenario, but the request is phrased the way a real user would ask WITHOUT the
router's keyword vocabulary (no "sk-skill", no "SKILL.md scaffold", no "create
sk-"). It measures whether intent detection survives unseen phrasing instead of
memorized triggers.

## Scenario Contract

- Prompt: `I'm packaging a new reusable capability for the assistant and need its main definition file plus the starter support docs laid out.`
- Expected intent: `SKILL_CREATION`
- Stage: holdout (excluded from the fitted aggregate; scored only for the generalization gap)
