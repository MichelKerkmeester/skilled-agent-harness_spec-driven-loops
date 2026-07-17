---
id: MT-001
category: hub_routing
stage: routing
title: "Browser debugging request routes to mcp-chrome-devtools"
expected_intent: mcp-chrome-devtools
expected_resources:
  - mcp-chrome-devtools/references/cdp_patterns.md
  - mcp-chrome-devtools/references/session_management.md
expected_workflow_mode: mcp-chrome-devtools
expected_leaf_resources:
  - workflow_mode: mcp-chrome-devtools
    leaf_resource_id: references/cdp_patterns.md
  - workflow_mode: mcp-chrome-devtools
    leaf_resource_id: references/session_management.md
created: 2026-07-10
version: 1.0.0.0
---

# MT-001: Browser debugging request routes to mcp-chrome-devtools

Prompt: Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging.

## Expected Behavior

Strong `chrome-devtools-aliases`/`browser-debug` signal (Chrome DevTools, HAR capture) resolves `workflowMode: mcp-chrome-devtools`; the hub loads `mcp-chrome-devtools/SKILL.md`, not the hub's own thin `SKILL.md` or a sibling packet.

## Success Criteria

The router resolves `mcp-chrome-devtools` as a single dominant mode, not an ordered bundle or a deferred disambiguation.
