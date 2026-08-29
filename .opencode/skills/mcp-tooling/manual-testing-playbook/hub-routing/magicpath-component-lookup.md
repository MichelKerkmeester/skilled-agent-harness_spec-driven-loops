---
id: MT-011
category: hub_routing
stage: routing
title: "MagicPath component lookup routes to mcp-magicpath"
expected_intent: mcp-magicpath
expected_resources:
  - mcp-magicpath/references/tool-surface.md
  - mcp-magicpath/references/credential-setup.md
expected_workflow_mode: mcp-magicpath
expected_leaf_resources:
  - workflow_mode: mcp-magicpath
    leaf_resource_id: references/tool-surface.md
  - workflow_mode: mcp-magicpath
    leaf_resource_id: references/credential-setup.md
created: 2026-08-29
version: 1.0.0.0
---

# MT-011: MagicPath component lookup routes to mcp-magicpath

Prompt: Search MagicPath for a saved hero card component and show me its source before I reuse it.

## Expected Behavior

A `magicpath-aliases` signal (MagicPath, saved component, component source) resolves `workflowMode: mcp-magicpath`; the hub loads `mcp-magicpath/SKILL.md`, not `mcp-refero` (which owns real-shipped-web-product reference search) and not the hub's own thin `SKILL.md`. The transport pairing rule still applies: turning a retrieved component into a measured Style Reference (design tokens) pairs `sk-design-md-generator` against a live source.

Reading a component is `inspect_component`, which writes nothing. The provider's `add` command, which writes `.tsx` files and installs npm packages into the calling project, is deliberately absent from the registered manual, so no routing outcome can reach it.

## Success Criteria

The router resolves `mcp-magicpath` as a single dominant mode. Refero-specific phrasing (real shipped app screens, style references) must keep resolving `mcp-refero`, and Mobbin phrasing `mcp-mobbin`; a prompt naming both MagicPath and Refero explicitly yields an `orderedBundle` in tie-break order.

## Known Gap

Hub-level resolution is what this scenario validates and it holds. Advisor-level precedence does not: a cold MagicPath request that names neither the hub nor the mode has been observed returning no recommendation at all. Treat an abstain at the advisor layer as the known state rather than a regression in this scenario.
