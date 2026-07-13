---
id: CE-H01
category: hub_routing
stage: holdout
title: "Blind holdout: full-runtime handoff routes to cli-opencode"
expected_intent: cli-opencode
expected_resources:
  - cli-opencode/SKILL.md
blindToRouterKeywords: true
version: 1.0.0.0
---
# CE-H01: Blind holdout — external full-runtime handoff
Prompt: Hand this whole task to a separate autonomous coding session that has the full plugin and memory stack and let it run unattended.
## Expected Behavior
Natural-language external-full-runtime-dispatch intent (no "OpenCode" alias) should still resolve `cli-opencode`.
