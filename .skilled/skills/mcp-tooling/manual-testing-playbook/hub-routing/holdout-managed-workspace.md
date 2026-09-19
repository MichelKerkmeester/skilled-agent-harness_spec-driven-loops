---
id: MT-H08
category: hub_routing
stage: holdout
title: "Blind holdout: managed worktree and paired terminal state routes to mcp-orca-cli"
expected_intent: mcp-orca-cli
expected_resources:
  - mcp-orca-cli/references/orca-cli-reference.md
  - mcp-orca-cli/references/mutation-and-browser-boundaries.md
expected_workflow_mode: mcp-orca-cli
expected_leaf_resources:
  - workflow_mode: mcp-orca-cli
    leaf_resource_id: references/orca-cli-reference.md
  - workflow_mode: mcp-orca-cli
    leaf_resource_id: references/mutation-and-browser-boundaries.md
blindToRouterKeywords: true
blindExceptions:
  - "managed worktree"
  - "paired terminal"
version: 1.0.0.0
---

# MT-H08: Blind holdout — managed worktree and paired terminal state

Prompt: Inspect the managed worktree record and its paired terminal sessions before I continue.

## Expected Behavior

Natural-language managed-workspace intent must resolve to `mcp-orca-cli` even though the prompt does not name Orca, the CLI, a provider alias, or an Orca subcommand. The `managed worktree` and `paired terminal` phrases are recorded as the holdout's narrow binding exceptions. Generic Git worktree and ordinary shell-terminal requests remain outside this mode.

## Route Binding

The holdout is bound through `hub-router.json` to the `orca-worktree-terminal` vocabulary class. It stays blind to the explicit provider aliases and validates that Orca-specific workflow ownership can be expressed without making a bare `orca` alias routable.
