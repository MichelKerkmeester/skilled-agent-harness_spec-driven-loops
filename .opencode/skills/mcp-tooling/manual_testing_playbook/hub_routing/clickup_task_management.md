---
id: MT-002
category: hub_routing
stage: routing
title: "ClickUp task request routes to mcp-click-up"
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
created: 2026-07-10
version: 1.0.0.0
---

# MT-002: ClickUp task request routes to mcp-click-up

Prompt: Mark the ClickUp task done and add a note that it shipped.

## Expected Behavior

Strong `clickup-aliases`/`task-management` signal (ClickUp, mark done) resolves `workflowMode: mcp-click-up`; the hub loads `mcp-click-up/SKILL.md`.

## Success Criteria

The router resolves `mcp-click-up` as a single dominant mode without needing the `mcp-chrome-devtools` default.
