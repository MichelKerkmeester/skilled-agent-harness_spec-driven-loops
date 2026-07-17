---
id: SP-004
category: hub_routing
stage: routing
title: "Second named model (GLM-5.2) also routes to prompt-models"
expected_intent: prompt-models
expected_resources:
  - prompt-models/SKILL.md
expected_workflow_mode: prompt-models
expected_leaf_resources:
  - workflow_mode: prompt-models
    leaf_resource_id: references/models/glm-5.2.md
created: 2026-07-09
version: 1.0.0.0
---

# SP-004: Second named model (GLM-5.2) also routes to prompt-models

Prompt: What prompt-craft profile does GLM-5.2 use for the Z.AI Coding Plan?

## Expected Behavior

`workflowMode` resolves to `prompt-models` for a second, distinct named model — confirms the routing signal generalizes beyond a single example model, not just DeepSeek.

## Success Criteria

The router selects `prompt-models` for GLM-5.2 exactly as it does for DeepSeek-v4-pro (SP-002).
