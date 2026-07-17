---
id: MT-H06
category: hub_routing
stage: holdout
title: "Blind holdout: mobile app pattern research routes to mcp-mobbin"
expected_intent: mcp-mobbin
expected_resources:
  - mcp-mobbin/SKILL.md
expected_workflow_mode: mcp-mobbin
expected_leaf_resources: []
blindToRouterKeywords: true
blindExceptions:
  - "phone apps"
version: 1.1.0.0
---
# MT-H06: Blind holdout — mobile app pattern research

Prompt: Collect how popular phone apps welcome first-time users — real product walkthroughs, not mockups — so we can rework our signup.

## Expected Behavior

Natural-language MOBILE-app pattern-research intent (no "Mobbin" alias) should resolve `mcp-mobbin`: phone apps + first-run walkthroughs from real products is its app/flow research surface. `mcp-refero` is the adjacent transport but is web/styles-anchored — a defer between the two research transports is a tolerable secondary outcome; `mcp-figma` or a workflow mode is a failure.

## Route Binding

Bound to `mcp-mobbin` by the `app-design-research` keyword "phone apps" (added during routing remediation, F004) — the mobile-anchor that separates Mobbin from the web-anchored `mcp-refero`. The holdout stays blind to all Mobbin aliases but is no longer blind for the term "phone apps" — recorded in `blindExceptions` above.
