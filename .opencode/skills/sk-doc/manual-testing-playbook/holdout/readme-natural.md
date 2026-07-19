---
id: SD-H03
category: holdout
title: 'Holdout — README_CREATION via natural phrasing'
expected_intent: create-readme
expected_resources:
  - create-readme/references/README.md
  - create-readme/assets/readme-template.md
expected_workflow_mode: create-readme
expected_leaf_resources:
  - workflow_mode: create-readme
    leaf_resource_id: references/README.md
  - workflow_mode: create-readme
    leaf_resource_id: assets/readme-template.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H03: README_CREATION Held-Out (decontaminated phrasing)

## Purpose

Generalization probe for the front-page-doc intent. Same correct answer as the
fitted README_CREATION scenario, but phrased as a real onboarding request with
none of the trigger phrases ("create a readme", "readme for", "a readme").

## Scenario Contract

- Prompt: `Draft the front-page overview for this project so a newcomer understands what it does and how to get started.`
- Expected intent: `README_CREATION`
- Stage: holdout (excluded from the fitted aggregate; scored only for the generalization gap)
