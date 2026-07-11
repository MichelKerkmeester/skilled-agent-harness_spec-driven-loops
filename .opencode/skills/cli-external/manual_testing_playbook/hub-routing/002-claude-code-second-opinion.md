---
id: CE-002
category: hub-routing
title: "Anthropic-backed second-opinion request routes to cli-claude-code"
expected_intent: cli-claude-code
expected_resources:
  - cli-claude-code/SKILL.md
created: 2026-07-10
version: 1.0.0.0
---

# CE-002: Anthropic-backed second-opinion request routes to cli-claude-code

Prompt: Get an Anthropic CLI second opinion on this refactor with extended thinking before I merge.

## Expected Behavior

Strong `cli-claude-code-aliases`/`claude-dispatch` signal (Anthropic CLI, extended thinking) resolves `workflowMode: cli-claude-code`; the hub loads `cli-claude-code/SKILL.md`, not the hub's own thin `SKILL.md` or the sibling packet.

## Success Criteria

The router resolves `cli-claude-code` as a single dominant mode, not an ordered bundle or a deferred disambiguation.
