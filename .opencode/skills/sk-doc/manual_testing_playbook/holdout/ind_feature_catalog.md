---
id: SD-H13
category: holdout
title: 'Independent holdout — FEATURE_CATALOG (keyword-blind)'
expected_intent: FEATURE_CATALOG
expected_resources:
  - references/README.md
expected_workflow_mode: create-feature-catalog
expected_leaf_resources:
  - workflow_mode: create-feature-catalog
    leaf_resource_id: references/README.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H13: FEATURE_CATALOG Independent Holdout

Authored blind to the router keyword list.

## Scenario Contract

- Prompt: `Can you go through the payments service and write up everything it can actually do, grouped by area, so a new engineer has one place to understand all its capabilities? Right now that knowledge is scattered across the code and a few people's heads.`
- Expected intent: `FEATURE_CATALOG`
- Stage: holdout
