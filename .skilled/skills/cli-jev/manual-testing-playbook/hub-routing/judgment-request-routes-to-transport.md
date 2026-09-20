---
id: CJ-001
category: hub_routing
stage: routing
title: "A Jev judgment request resolves cli-usage"
expected_intent: cli-usage
expected_resources:
  - cli-usage/SKILL.md
expected_workflow_mode: cli-usage
expected_leaf_resources: []
created: 2026-09-20
version: 1.0.0.0
---

# CJ-001: A Jev judgment request resolves cli-usage

Prompt: Use jev judgment to decide whether this incident is urgent, and give me the probability.

## Expected Behavior

The `jev judgment` phrase is a `cli-usage-aliases` signal, so the hub resolves `workflowMode: cli-usage` and loads `cli-usage/SKILL.md`. The hub is single-mode, so the answer is a single dominant mode rather than an ordered bundle or a deferred disambiguation.

## Success Criteria

The resolved workflow mode is `cli-usage` and the loaded packet is `cli-usage/SKILL.md`. The phrase has to be one the hub vocabulary actually carries: a bare `jev` with a distant `probability` is a defer, not a route, because a multi-word detector only spans two intervening words. Now that the hub has joined the compiled serving closure the compiled-route CLI returns a route whose target is `cli-usage`, so the scenario is executed rather than SKIPped on a legacy sentinel.
