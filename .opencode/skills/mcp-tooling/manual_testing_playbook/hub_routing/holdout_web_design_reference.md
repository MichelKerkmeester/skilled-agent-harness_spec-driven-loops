---
id: MT-H05
category: hub_routing
stage: holdout
title: "Blind holdout: shipped-product UI reference search routes to mcp-refero"
expected_intent: mcp-refero
expected_resources:
  - mcp-refero/SKILL.md
expected_workflow_mode: mcp-refero
expected_leaf_resources: []
blindToRouterKeywords: true
blindExceptions:
  - "web products"
version: 1.1.0.0
---
# MT-H05: Blind holdout — shipped-product UI references

Prompt: Show me how shipped web products design their checkout pages — concrete screenshots and the styles they use — so I can compare against our redesign.

## Expected Behavior

Natural-language design-reference-search intent (no "Refero" alias) anchored on WEB products and styles should resolve `mcp-refero`. `mcp-figma` must not win (nothing references our own design file); `mcp-mobbin` is the adjacent transport but is mobile-app-anchored — a defer between the two research transports is a tolerable secondary outcome, `mcp-figma` or a workflow mode is a failure.

## Route Binding

Bound to `mcp-refero` by the `design-reference-research` keyword "web products" (added during routing remediation, F004) — the web-anchor that separates Refero from the mobile-anchored `mcp-mobbin`. The holdout stays blind to all Refero aliases but is no longer blind for the term "web products" — recorded in `blindExceptions` above.
