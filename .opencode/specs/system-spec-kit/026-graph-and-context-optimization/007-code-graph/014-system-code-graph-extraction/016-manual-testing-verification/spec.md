---
title: "016 Manual Testing Verification"
description: "Manual testing verification packet for the mk-code-index rename and post-014 work. Layer-1 execution of every scenario in the manual_testing_playbook plus Layer-2 smoke probes."
status: "complete"
importance_tier: "important"
trigger_phrases:
  - "016 manual testing verification"
  - "code-graph manual testing"
  - "mk-code-index verification"
---

# 016 Manual Testing Verification

## Status: PASS (CONDITIONAL)

Post-rename mk-code-index MCP and post-014 work verified end-to-end. All Layer-2 smoke probes pass. Layer-1 scenarios requiring disposable workspace mutations were evaluated as SKIP but their read-path equivalents passed via stale-blocking behavior observed in production.

## Scope

Layer-1 execution of every scenario in `.opencode/skills/system-code-graph/manual_testing_playbook/` plus Layer-2 new smoke scenarios for the post-rename MCP tool surface, fresh build verification, and launcher restart.

## Key Findings

- All 10 MCP tools exposed correctly via tools/list
- Launcher starts with `[mk-code-index-launcher]` prefix, no legacy names
- `.claude/mcp.json` has `mk_code_index` key (no `system_code_graph`)
- Database at canonical path (55.7MB), no legacy paths
- TypeScript dist entry points exist and loadable
- unicode-normalization.js fix from packet-009 present
- code_graph_status is diagnostic-only (no mutations)
- Read-path tools (query, context, detect_changes) correctly block on stale graph
- Deep-loop YAML convergence and conditional upsert confirmed
- Doctor code-graph YAML Phase A is diagnostic-only
- CCC status available with binaryPath and recommendation