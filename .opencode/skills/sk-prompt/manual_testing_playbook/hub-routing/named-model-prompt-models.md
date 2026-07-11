---
id: SP-002
category: hub-routing
stage: routing
title: "Named small-model request routes to prompt-models"
expected_intent: prompt-models
expected_resources:
  - prompt-models/SKILL.md
created: 2026-07-09
version: 1.0.0.0
---

# SP-002: Named small-model request routes to prompt-models

Prompt: What framework and scaffold does DeepSeek-v4-pro want for a coding task?

## Expected Behavior

`workflowMode` resolves to `prompt-models`; the hub loads `prompt-models/SKILL.md`; the response cites `references/models/deepseek-v4-pro.md`, not the generic 7-framework set.

## Success Criteria

The router selects `prompt-models` when a specific small model is named by id.
