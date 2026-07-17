---
id: MT-H01
category: hub_routing
stage: holdout
title: "Blind holdout: browser inspection routes to mcp-chrome-devtools"
expected_intent: mcp-chrome-devtools
expected_resources:
  - mcp-chrome-devtools/SKILL.md
expected_workflow_mode: mcp-chrome-devtools
expected_leaf_resources: []
blindToRouterKeywords: true
version: 1.1.0.0
---
# MT-H01: Blind holdout — browser inspection
Prompt: The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.
## Expected Behavior
Natural-language browser-inspection intent (no "Chrome DevTools"/"HAR" alias) should still resolve `mcp-chrome-devtools`.

## Boundary (six-mode hub)
With `mcp-aside-devtools` in the hub, this prompt is the chrome-vs-aside boundary case: it must STILL resolve `mcp-chrome-devtools` because it describes developer-driven inspection primitives (network requests, live DOM) with no agentic/AI-browser vocabulary. `mcp-aside-devtools` wins only when the prompt asks the browser to act autonomously (natural-language tasks, sign-in-and-do flows, agent-captured evidence). If the router returns `mcp-aside-devtools` or a defer here, that is a routing regression.
