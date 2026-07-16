---
id: MT-H04
category: hub_routing
stage: holdout
title: "Blind holdout: autonomous browser task routes to mcp-aside-devtools"
expected_intent: mcp-aside-devtools
expected_resources:
  - mcp-aside-devtools/SKILL.md
blindToRouterKeywords: true
version: 1.0.0.0
---
# MT-H04: Blind holdout — autonomous browser task

Prompt: Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes.

## Expected Behavior

Natural-language AUTONOMOUS-browser intent (no "Aside"/"agentic browser" alias) should resolve `mcp-aside-devtools`: the browser is asked to act by itself (sign in, click through, capture evidence), which is the agentic surface — not developer-driven inspection primitives, so `mcp-chrome-devtools` must NOT win. This is the inverse of MT-H01's boundary.
