---
id: SD-H08
category: holdout
title: 'Independent holdout — README_CREATION (keyword-blind)'
expected_intent: README_CREATION
expected_resources:
  - references/README.md
  - assets/readme_template.md
expected_workflow_mode: create-readme
expected_leaf_resources:
  - workflow_mode: create-readme
    leaf_resource_id: references/README.md
  - workflow_mode: create-readme
    leaf_resource_id: assets/readme_template.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H08: README_CREATION Independent Holdout

Authored blind to the router keyword list.

## Scenario Contract

- Prompt: `Can you write up a clear front-page overview for this project that explains what it actually does and how a brand-new person would get set up and start using it? Right now someone landing here has no idea where to begin.`
- Expected intent: `README_CREATION`
- Stage: holdout
