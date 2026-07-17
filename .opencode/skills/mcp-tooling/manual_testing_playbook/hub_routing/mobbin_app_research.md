---
id: MT-009
category: hub_routing
stage: routing
title: "App design research routes to mcp-mobbin"
expected_intent: mcp-mobbin
expected_resources:
  - mcp-mobbin/SKILL.md
expected_workflow_mode: mcp-mobbin
expected_leaf_resources:
  - workflow_mode: mcp-mobbin
    leaf_resource_id: references/tool-surface.md
  - workflow_mode: mcp-mobbin
    leaf_resource_id: references/mcp-wiring.md
created: 2026-07-16
version: 1.0.0.0
---

# MT-009: App design research routes to mcp-mobbin

Prompt: Research onboarding flow patterns from real iOS apps on Mobbin and collect screen examples for the signup redesign.

## Expected Behavior

Strong `mobbin-aliases`/`app-design-research` signal (Mobbin, real-app screens, onboarding flow patterns) resolves `workflowMode: mcp-mobbin`; the hub loads `mcp-mobbin/SKILL.md`, not `mcp-refero` (its design-reference sibling — distinguished by tool vocabulary) and not the hub's own thin `SKILL.md`. The transport pairing rule applies: design DECISIONS from the research load `sk-design` first.

## Success Criteria

The router resolves `mcp-mobbin` as a single dominant mode. Refero-specific phrasing keeps resolving `mcp-refero`; generic "design reference" phrasing naming NEITHER tool may defer for disambiguation between the two research transports rather than silently picking one.
