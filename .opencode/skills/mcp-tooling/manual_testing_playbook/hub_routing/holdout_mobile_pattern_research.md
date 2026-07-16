---
id: MT-H06
category: hub_routing
stage: holdout
title: "Blind holdout: mobile app pattern research routes to mcp-mobbin"
expected_intent: mcp-mobbin
expected_resources:
  - mcp-mobbin/SKILL.md
blindToRouterKeywords: true
version: 1.0.0.0
---
# MT-H06: Blind holdout — mobile app pattern research

Prompt: Collect how popular phone apps welcome first-time users — real product walkthroughs, not mockups — so we can rework our signup.

## Expected Behavior

Natural-language MOBILE-app pattern-research intent (no "Mobbin" alias) should resolve `mcp-mobbin`: phone apps + first-run walkthroughs from real products is its app/flow research surface. `mcp-refero` is the adjacent transport but is web/styles-anchored — a defer between the two research transports is a tolerable secondary outcome; `mcp-figma` or a workflow mode is a failure.
