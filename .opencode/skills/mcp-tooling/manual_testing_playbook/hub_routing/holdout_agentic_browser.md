---
id: MT-H04
category: hub_routing
stage: holdout
title: "Blind holdout: autonomous browser task routes to mcp-aside-devtools"
expected_intent: mcp-aside-devtools
expected_resources:
  - mcp-aside-devtools/SKILL.md
expected_workflow_mode: mcp-aside-devtools
expected_leaf_resources: []
blindToRouterKeywords: true
blindExceptions:
  - "click through"
  - "on its own"
version: 1.1.0.0
---
# MT-H04: Blind holdout — autonomous browser task

Prompt: Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes.

## Expected Behavior

Natural-language AUTONOMOUS-browser intent (no "Aside"/"agentic browser" alias) should resolve `mcp-aside-devtools`: the browser is asked to act by itself (sign in, click through, capture evidence), which is the agentic surface — not developer-driven inspection primitives, so `mcp-chrome-devtools` must NOT win. This is the inverse of MT-H01's boundary.

## Route Binding

Bound to `mcp-aside-devtools` by the `agentic-browser` keywords "click through" and "on its own" (added during routing remediation, F004) — both are autonomy markers, not tool aliases. The holdout stays blind to all Aside aliases ("aside", "agentic browser", ...) but is no longer blind for those two phrases — recorded in `blindExceptions` above.
