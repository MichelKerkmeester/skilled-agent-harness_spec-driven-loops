---
id: CE-H02
category: hub_routing
stage: holdout
title: "Blind holdout: deep second opinion routes to cli-claude-code"
expected_intent: cli-claude-code
expected_resources:
  - cli-claude-code/references/cli-reference.md
  - cli-claude-code/references/integration-patterns.md
expected_workflow_mode: cli-claude-code
expected_leaf_resources:
  - workflow_mode: cli-claude-code
    leaf_resource_id: references/cli-reference.md
  - workflow_mode: cli-claude-code
    leaf_resource_id: references/integration-patterns.md
blindToRouterKeywords: true
version: 1.0.0.1
---
# CE-H02: Blind holdout — deep second opinion
Prompt: Get a second, deeply-reasoned opinion on this architecture decision from a different assistant model.
## Expected Behavior
Natural-language deep-reasoning-second-opinion intent (no "Claude Code" alias) should still resolve `cli-claude-code`. The deeply-reasoned second-opinion handoff loads `cli-claude-code/references/cli-reference.md` and `cli-claude-code/references/integration-patterns.md`.
