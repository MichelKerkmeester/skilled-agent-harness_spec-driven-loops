---
id: MT-H07
category: hub_routing
stage: holdout
title: "Blind holdout: knowledge-base note management routes to mcp-obsidian"
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
blindToRouterKeywords: true
blindExceptions:
  - "knowledge base"
version: 1.1.0.0
---
# MT-H07: Blind holdout — knowledge-base note management

Prompt: I keep my personal knowledge base as linked markdown files — help me capture a note and link it to related ones.

## Expected Behavior

Natural-language note intent (no "Obsidian"/"notesmd-cli" alias, no literal "note management" vocabulary) must still resolve `mcp-obsidian` — capturing linked markdown notes belongs to its vault surface. Note/vault/knowledge-base/markdown-linking intent is not ClickUp task, project, or ticket tracking; an `mcp-click-up` or `defer` result is a routing regression.

## Route Binding

Bound through `hub-router.json` to the registered `mcp-obsidian` workflow in `mode-registry.json` by the `note-management` keyword "knowledge base". The holdout stays blind to the provider aliases ("obsidian", "notesmd-cli") and to the literal "note management" phrase, while recording its `knowledge base` binding in `blindExceptions` above.
