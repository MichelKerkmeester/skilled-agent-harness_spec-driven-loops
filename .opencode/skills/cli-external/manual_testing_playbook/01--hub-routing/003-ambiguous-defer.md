---
id: CE-003
category: hub-routing
title: "Ambiguous CLI-dispatch request defers instead of silently defaulting"
expected_intent: defer
expected_resources: []
created: 2026-07-10
version: 1.0.0.0
---

# CE-003: Ambiguous CLI-dispatch request defers instead of silently defaulting

Prompt: Dispatch this to a CLI executor.

## Expected Behavior

No strong `cli-opencode-aliases` or `cli-claude-code-aliases` signal is present — just the bare "CLI executor" phrase. The router must defer and ask which executor, not silently default to `cli-opencode` (`routerPolicy.defaultMode`) on genuine ambiguity.

## Success Criteria

The router resolves `defer`, not a single mode; the response asks the operator to name `cli-opencode` or `cli-claude-code` explicitly.
