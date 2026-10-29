---
id: MT-011
category: hub_routing
stage: routing
title: "Notion database request routes to mcp-notion"
expected_intent: mcp-notion
expected_resources:
  - mcp-notion/references/mcp-tools.md
  - mcp-notion/references/api-gap-tools.md
expected_workflow_mode: mcp-notion
expected_leaf_resources:
  - workflow_mode: mcp-notion
    leaf_resource_id: references/mcp-tools.md
  - workflow_mode: mcp-notion
    leaf_resource_id: references/api-gap-tools.md
created: 2026-10-29
version: 1.0.0.0
---

# MT-011: Notion database request routes to mcp-notion

Prompt: Query my Notion database for rows whose status is open and update the matching page.

## Expected Behavior

Strong `notion-aliases`/`notion-data` signal (Notion, Notion database) in `hub-router.json`, matched to the registered `mcp-notion` workflow in `mode-registry.json`, resolves `workflowMode: mcp-notion`; the hub loads `mcp-notion/SKILL.md` and exactly its selected packet resources.

## Success Criteria

The router resolves `mcp-notion` as a single dominant mode, the open-status rows do not pull the `mcp-click-up` task vocabulary into the route, and the fallback-only `routerPolicy.defaultResource` is not unioned into the selected packet resources.
