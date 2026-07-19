---
id: SD-H11
category: holdout
title: 'Independent holdout — OPTIMIZATION (keyword-blind)'
expected_intent: create-quality-control
expected_resources:
  - create-quality-control/references/optimization.md
  - shared/assets/llmstxt-templates.md
expected_workflow_mode: create-quality-control
expected_leaf_resources:
  - workflow_mode: create-quality-control
    leaf_resource_id: references/optimization.md
  - workflow_mode: create-quality-control
    leaf_resource_id: assets/llmstxt-templates.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H11: OPTIMIZATION Independent Holdout

Authored blind to the router keyword list.

## Scenario Contract

- Prompt: `Our main setup guide has ballooned into this huge wall of repetitive text and it's eating way too much of the model's budget every time — can you trim it down hard so it's tight and skimmable? Also drop a slim little index at the top level that lists what lives where, so an assistant can jump to the right section instead of reading the whole thing.`
- Expected intent: `OPTIMIZATION`
- Stage: holdout
