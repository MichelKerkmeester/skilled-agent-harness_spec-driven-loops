---
id: SD-H06
category: holdout
title: 'Independent holdout — SKILL_CREATION (keyword-blind)'
expected_intent: create-skill
expected_resources:
  - create-skill/references/skill/creation_workflow.md
  - create-skill/assets/skill/skill_md_template.md
  - create-skill/assets/skill/skill_readme_template.md
  - create-skill/assets/skill/skill_reference_template.md
expected_workflow_mode: create-skill
expected_leaf_resources:
  - workflow_mode: create-skill
    leaf_resource_id: references/skill/creation_workflow.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_md_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_readme_template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill_reference_template.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H06: SKILL_CREATION Independent Holdout

Authored by an agent blind to the router keyword list — a fair generalization probe.

## Scenario Contract

- Prompt: `I keep re-explaining the same steps every time I want you to help draft our release notes — can you set up a reusable helper so you just know how to do this going forward, with a main how-to guide plus a couple of starter reference docs?`
- Expected intent: `SKILL_CREATION`
- Stage: holdout
