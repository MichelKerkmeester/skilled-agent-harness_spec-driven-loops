---
id: CE-H02
category: hub-routing
title: "Blind holdout: deep second opinion routes to cli-claude-code"
expected_intent: cli-claude-code
expected_resources:
  - cli-claude-code/SKILL.md
blindToRouterKeywords: true
version: 1.0.0.0
---
# CE-H02: Blind holdout — deep second opinion
Prompt: Get a second, deeply-reasoned opinion on this architecture decision from a different assistant model.
## Expected Behavior
Natural-language deep-reasoning-second-opinion intent (no "Claude Code" alias) should still resolve `cli-claude-code`.
