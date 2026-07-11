---
id: CE-001
category: hub-routing
stage: routing
title: "Full-runtime dispatch request routes to cli-opencode"
expected_intent: cli-opencode
expected_resources:
  - cli-opencode/SKILL.md
created: 2026-07-10
version: 1.0.0.0
---

# CE-001: Full-runtime dispatch request routes to cli-opencode

Prompt: Delegate this to OpenCode and run the ablation suite with full plugin and Spec Kit Memory runtime.

## Expected Behavior

Strong `cli-opencode-aliases`/`opencode-dispatch` signal (OpenCode, full plugin runtime, ablation suite) resolves `workflowMode: cli-opencode`; the hub loads `cli-opencode/SKILL.md`, not the hub's own thin `SKILL.md` or the sibling packet.

## Success Criteria

The router resolves `cli-opencode` as a single dominant mode, not an ordered bundle or a deferred disambiguation.
