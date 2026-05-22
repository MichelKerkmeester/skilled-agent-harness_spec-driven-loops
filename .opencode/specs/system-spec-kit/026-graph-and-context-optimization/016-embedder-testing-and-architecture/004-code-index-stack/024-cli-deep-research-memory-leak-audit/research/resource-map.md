---
title: "Research Resource Map: 024 CLI Deep Research Memory Leak Audit"
description: "Research artifact ledger for the completed 10-iteration memory-leak audit."
trigger_phrases:
  - "024 research resource map"
  - "memory leak audit research artifacts"
importance_tier: "normal"
contextType: "research"
---
# Research Resource Map: 024 CLI Deep Research Memory Leak Audit

## Summary

- **Total iterations**: 10
- **Final synthesis**: `research/research.md`
- **Primary state**: `deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, `deep-research-strategy.md`
- **Runtime measurement log**: `logs/iteration-007-runtime-measurement.json`
- **Status**: synthesis complete; cleanup and RSS-growth verification remain follow-up gates.

## Iteration Artifacts

| Iteration | Executor | Narrative | Delta |
|-----------|----------|-----------|-------|
| 001 | cli-claude-code | `iterations/iteration-001.md` | `deltas/iter-001.jsonl` |
| 002 | cli-claude-code | `iterations/iteration-002.md` | `deltas/iter-002.jsonl` |
| 003 | cli-claude-code | `iterations/iteration-003.md` | `deltas/iter-003.jsonl` |
| 004 | cli-claude-code | `iterations/iteration-004.md` | `deltas/iter-004.jsonl` |
| 005 | cli-claude-code | `iterations/iteration-005.md` | `deltas/iter-005.jsonl` |
| 006 | cli-codex | `iterations/iteration-006.md` | `deltas/iter-006.jsonl` |
| 007 | cli-codex | `iterations/iteration-007.md` | `deltas/iter-007.jsonl` |
| 008 | cli-codex | `iterations/iteration-008.md` | `deltas/iter-008.jsonl` |
| 009 | cli-codex | `iterations/iteration-009.md` | `deltas/iter-009.jsonl` |
| 010 | cli-codex | `iterations/iteration-010.md` | `deltas/iter-010.jsonl` |

## Final Outputs

| Path | Role |
|------|------|
| `research.md` | Final synthesis, F-ID matrix, remediation order, downgrade notes, references. |
| `deep-research-state.jsonl` | Append-only iteration state log with 10 complete iteration records. |
| `findings-registry.json` | Reducer-owned registry compiled from iteration and delta artifacts. |
| `deep-research-dashboard.md` | Reducer-owned status dashboard. |
| `logs/iteration-007-runtime-measurement.json` | Native process/RSS/VM inventory used to refine severity. |

## Primary Source Surfaces

| Path | Role |
|------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Daemon lifecycle, project registry, indexing, remove-project races. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py` | Blocking daemon client and missing cancel surface. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/protocol.py` | Protocol request/response surface. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py` | Project close and update-index lifecycle. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | MCP startup and background index task. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Alternate MCP server background task and timeouts. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | Adapter cache, sidecar client, fallback/local model lifecycle. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Code-graph launcher lease, child process, signal handling. |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | Code-graph MCP shutdown path. |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Singleton DB and `closeDb()` lifecycle. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Detached sidecar spawn and startup cleanup boundary. |
