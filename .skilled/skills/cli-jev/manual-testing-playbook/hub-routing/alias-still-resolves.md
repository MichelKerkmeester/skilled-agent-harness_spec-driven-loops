---
id: CJ-002
category: hub_routing
stage: routing
title: "The retired cli-jev mode name still resolves the transport"
expected_intent: cli-usage
expected_resources:
  - cli-usage/SKILL.md
expected_workflow_mode: cli-usage
expected_leaf_resources: []
created: 2026-09-20
version: 1.0.0.0
---

# CJ-002: The retired cli-jev mode name still resolves the transport

Prompt: cli-jev noul for this question.

## Expected Behavior

`cli-jev` was the mode's name before the hub took the id, so it survives as a mode alias and as a hub vocabulary entry. A request that still names it resolves the same single mode, `cli-usage`, and loads the same packet.

## Success Criteria

The resolved workflow mode is `cli-usage`, not `cli-jev` and not a defer. The alias resolves from `mode-registry.json` `aliases[]` and the hub router's `vocabularyClasses`, so the registration is the evidence when the runtime route is unavailable.
