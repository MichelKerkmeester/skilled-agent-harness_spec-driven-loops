---
id: SD-H07
category: holdout
title: 'Independent holdout — DOC_QUALITY (keyword-blind)'
expected_intent: create-quality-control
expected_resources:
  - shared/references/validation.md
  - create-quality-control/references/workflows.md
  - shared/references/core_standards.md
  - shared/references/evergreen_packet_id_rule.md
expected_workflow_mode: create-quality-control
expected_leaf_resources:
  - workflow_mode: create-quality-control
    leaf_resource_id: references/validation.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/workflows.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/core_standards.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/evergreen_packet_id_rule.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H07: DOC_QUALITY Independent Holdout

Authored blind to the router keyword list.

## Scenario Contract

- Prompt: `Before we ship our new changelog-helper skill, can you go through its docs and flag anything that wouldn't hold up to our quality bar? I'd rather catch the problems now than after it's out.`
- Expected intent: `DOC_QUALITY`
- Stage: holdout
