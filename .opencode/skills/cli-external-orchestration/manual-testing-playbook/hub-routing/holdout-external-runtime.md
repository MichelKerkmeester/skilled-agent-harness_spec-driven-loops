---
id: CE-H01
category: hub_routing
stage: holdout
title: "Blind holdout: full-runtime handoff routes to cli-opencode"
expected_intent: cli-opencode
expected_resources:
  - cli-opencode/references/cli-reference.md
  - cli-opencode/references/integration-patterns.md
expected_workflow_mode: cli-opencode
expected_leaf_resources:
  - workflow_mode: cli-opencode
    leaf_resource_id: references/cli-reference.md
  - workflow_mode: cli-opencode
    leaf_resource_id: references/integration-patterns.md
blindToRouterKeywords: true
version: 1.0.0.1
---
# CE-H01: Blind holdout — external full-runtime handoff
Prompt: Hand this whole task to a separate autonomous coding session that has the full plugin and memory stack and let it run unattended.
## Expected Behavior
Natural-language external-full-runtime-dispatch intent (no "OpenCode" alias) should still resolve `cli-opencode`. The full plugin and memory stack handoff loads `cli-opencode/references/cli-reference.md` and `cli-opencode/references/integration-patterns.md`.
