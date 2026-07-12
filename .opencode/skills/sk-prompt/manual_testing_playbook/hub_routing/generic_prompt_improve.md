---
id: SP-001
category: hub_routing
stage: routing
title: "Generic prompt-improvement request routes to prompt-improve"
expected_intent: prompt-improve
expected_resources:
  - prompt-improve/SKILL.md
created: 2026-07-09
version: 1.0.0.0
---

# SP-001: Generic prompt-improvement request routes to prompt-improve

Prompt: Help me write a better prompt for a customer support chatbot.

## Expected Behavior

`workflowMode` resolves to `prompt-improve` (the `routerPolicy.defaultMode`); the hub loads `prompt-improve/SKILL.md`; the response follows the DEPTH/CLEAR pipeline.

## Success Criteria

The router selects `prompt-improve`, not `prompt-models`, for a request that names no specific model.
