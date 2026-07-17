---
id: MT-H03
category: hub_routing
stage: holdout
title: "Blind holdout: task tracking routes to mcp-click-up"
expected_intent: mcp-click-up
expected_resources:
  - mcp-click-up/references/cupt_commands.md
  - mcp-click-up/references/mcp_tools.md
expected_workflow_mode: mcp-click-up
expected_leaf_resources:
  - workflow_mode: mcp-click-up
    leaf_resource_id: references/cupt_commands.md
  - workflow_mode: mcp-click-up
    leaf_resource_id: references/mcp_tools.md
blindToRouterKeywords: true
blindExceptions:
  - "project tracker"
version: 1.1.0.0
---
# MT-H03: Blind holdout — task tracking

Prompt: Close out yesterday's two open items in our project tracker, add a short note on what shipped, and log the hour I spent.

## Expected Behavior

Natural-language task-tracker intent (no "ClickUp"/"cupt" alias, no literal "task management"/"time tracking" vocabulary) should still resolve `mcp-click-up` — closing items, adding notes, and logging time are its daily-ops surface. No other hub mode manages work items.

## Route Binding

Bound to `mcp-click-up` by the `clickup-aliases` keyword "project tracker" (added during routing remediation, F004). The holdout stays blind to provider aliases ("clickup", "cupt") and to the literal "task management"/"time tracking" phrases, but is no longer blind for the term "project tracker" — recorded in `blindExceptions` above.
