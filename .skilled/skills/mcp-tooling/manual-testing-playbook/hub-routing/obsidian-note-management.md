---
id: MT-010
category: hub_routing
stage: routing
title: "Obsidian note-management request routes to mcp-obsidian"
expected_intent: mcp-obsidian
expected_resources:
  - mcp-obsidian/references/mcp-tools.md
  - mcp-obsidian/references/obsidian-cli-commands.md
expected_workflow_mode: mcp-obsidian
expected_leaf_resources:
  - workflow_mode: mcp-obsidian
    leaf_resource_id: references/mcp-tools.md
  - workflow_mode: mcp-obsidian
    leaf_resource_id: references/obsidian-cli-commands.md
created: 2026-08-02
version: 1.0.0.0
---

# MT-010: Obsidian note-management request routes to mcp-obsidian

Prompt: Create a daily note in my Obsidian vault and search my notes.

## Expected Behavior

Strong `obsidian-aliases`/`note-management` signal (Obsidian, daily note) in `hub-router.json`, matched to the registered `mcp-obsidian` workflow in `mode-registry.json`, resolves `workflowMode: mcp-obsidian`; the hub loads `mcp-obsidian/SKILL.md` and exactly its selected packet resources.

## Success Criteria

The router resolves `mcp-obsidian` as a single dominant mode and does not union the fallback-only `routerPolicy.defaultResource` into its selected packet resources.
