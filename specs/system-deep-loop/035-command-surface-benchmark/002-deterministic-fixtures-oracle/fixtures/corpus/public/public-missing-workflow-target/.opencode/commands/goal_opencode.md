---
description: Route goal actions directly to bounded plugin tools.
argument-hint: "<start|status>"
allowed-tools: mk_goal, mk_goal_status
---

# Goal Router

This direct-tool/plugin router owns no workflow YAML. It maps `start` to
`mk_goal` and `status` to `mk_goal_status`, then returns the tool result.

## 1. ACTION ROUTING

- `start` invokes `mk_goal`.
- `status` invokes `mk_goal_status`.
- Any other action stops without a tool call.
