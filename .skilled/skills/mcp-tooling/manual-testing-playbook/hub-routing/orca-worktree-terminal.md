---
id: MT-012
category: hub_routing
stage: routing
title: "Orca worktree and terminal inspection routes to mcp-orca-cli"
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
created: 2026-09-19
version: 1.0.0.0
---

# MT-012: Orca worktree and terminal inspection routes to mcp-orca-cli

Prompt: Use the Orca CLI to inspect the current worktree and its terminals.

## Expected Behavior

The `orca-cli-aliases` and `orca-worktree-terminal` signals resolve one dominant `workflowMode: mcp-orca-cli`. Stage two loads the version-matched command reference and the mutation/browser boundary reference. The route must not fall through to generic Git worktree handling, ordinary shell-terminal handling, Chrome/CDP, or Aside browser automation.

This is a read-only inspection request. It must not create a worktree, send terminal input, or change browser state merely because the selected packet is a workflow mode.

## Success Criteria

The router returns the two typed Orca leaf pairs and no fallback resource. A prompt that names a generic Git worktree or ordinary shell terminal without Orca-specific ownership remains outside this mode.
