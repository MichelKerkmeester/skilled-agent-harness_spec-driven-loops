---
id: MT-008
category: hub_routing
stage: routing
title: "Design-reference search routes to mcp-refero"
expected_intent: mcp-refero
expected_resources:
  - mcp-refero/references/tool-surface.md
  - mcp-refero/references/mcp-wiring.md
expected_workflow_mode: mcp-refero
expected_leaf_resources:
  - workflow_mode: mcp-refero
    leaf_resource_id: references/tool-surface.md
  - workflow_mode: mcp-refero
    leaf_resource_id: references/mcp-wiring.md
created: 2026-07-16
version: 1.0.0.0
---

# MT-008: Design-reference search routes to mcp-refero

Prompt: Search Refero for real-app checkout flow screens and pull style references for the redesign.

## Expected Behavior

Strong `refero-aliases`/`design-reference-research` signal (Refero, real-app screens, style references) resolves `workflowMode: mcp-refero`; the hub loads `mcp-refero/SKILL.md`, not `mcp-figma` (which owns Figma Desktop operations) and not the hub's own thin `SKILL.md`. The transport pairing rule still applies: any design DECISION taken from the references loads `sk-design` first.

## Success Criteria

The router resolves `mcp-refero` as a single dominant mode. Figma-specific phrasing (render, export tokens, Figma Desktop) must keep resolving `mcp-figma`; a prompt mixing both tools explicitly yields an `orderedBundle` in tie-break order (figma before refero).
