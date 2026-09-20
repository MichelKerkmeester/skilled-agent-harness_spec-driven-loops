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

Prompt: Use jev to decide whether this incident is urgent, and give me the probability.

## Expected Behavior

The `jev` alias plus a judgment noun is a `cli-usage-aliases` / `jev-dispatch` signal, so the hub resolves `workflowMode: cli-usage` and loads `cli-usage/SKILL.md`. The hub is single-mode, so the answer is a single dominant mode rather than an ordered bundle or a deferred disambiguation.

## Success Criteria

The resolved workflow mode is `cli-usage` and the loaded packet is `cli-usage/SKILL.md`. Before the hub joins the compiled serving closure, the compiled-route CLI reports `{"servingAuthority":"legacy","hubId":"cli-jev"}` for this hub, which is a SKIP with that blocker rather than a failure.
