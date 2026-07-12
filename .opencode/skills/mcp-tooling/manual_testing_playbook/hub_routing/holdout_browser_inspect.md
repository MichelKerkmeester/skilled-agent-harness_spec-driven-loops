---
id: MT-H01
category: hub_routing
stage: holdout
title: "Blind holdout: browser inspection routes to mcp-chrome-devtools"
expected_intent: mcp-chrome-devtools
expected_resources:
  - mcp-chrome-devtools/SKILL.md
blindToRouterKeywords: true
version: 1.0.0.0
---
# MT-H01: Blind holdout — browser inspection
Prompt: The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.
## Expected Behavior
Natural-language browser-inspection intent (no "Chrome DevTools"/"HAR" alias) should still resolve `mcp-chrome-devtools`.
