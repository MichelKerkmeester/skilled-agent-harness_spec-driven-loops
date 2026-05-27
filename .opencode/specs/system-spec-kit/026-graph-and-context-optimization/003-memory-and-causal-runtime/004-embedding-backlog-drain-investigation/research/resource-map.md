---
title: "Resource Map: embedding-backlog drain investigation"
description: "Coverage map of artifacts produced by the deep-research loop and the primary code surfaces investigated."
---

# Resource Map — Embedding-Backlog Drain Investigation

Emitted at convergence (10 iterations, maxIterationsReached). Inventory of packet artifacts and the code/DB surfaces the research cites. The canonical narrative is `research/research.md`.

## Packet Artifacts (this folder)

| Path | Role |
|------|------|
| `spec.md` | DR-seeded Level 1 spec (problem, scope, requirements) + generated findings fence |
| `research/research.md` | Canonical synthesis (17 sections) — the deliverable |
| `research/resource-map.md` | This file |
| `research/deep-research-strategy.md` | Strategy: 6 key questions, non-goals, stop conditions, machine-owned sections |
| `research/deep-research-state.jsonl` | Event/iteration state log (config, spec_check, 10 iterations, graph_convergence, synthesis_complete) |
| `research/findings-registry.json` | Reducer-owned registry: 81 key findings, 6 questions |
| `research/deep-research-dashboard.md` | Auto-generated progress dashboard |
| `research/iterations/iteration-001..010.md` | Per-iteration narratives |
| `research/deltas/iter-001..010.jsonl` | Per-iteration structured deltas |
| `research/prompts/iteration-*.md` | Rendered dispatch prompt packs + codex stdout/stderr logs |

## Code Surfaces Investigated (read-only)

| Path | Why it matters |
|------|----------------|
| `mcp_server/lib/providers/retry-manager.ts` | Retention parking (`enforceRetryRetentionLimits`), `pending→retry→success`, module-load env freeze |
| `mcp_server/lib/embedders/reindex.ts` (`dist/lib/embedders/reindex.js:316-318`) | **Root cause**: completion txn writes vectors + active pointer but not `embedding_status` |
| `mcp_server/handlers/embedder-set.ts`, `embedder-status.ts` | `embedder_set` queues reindex only; `embedder_status` read-only |
| `mcp_server/handlers/memory-index.ts` | `reindex --force` is scan/save-driven, not a status reset |
| `mcp_server/handlers/save/embedding-pipeline.ts`, `lib/search/vector-index-mutations.ts` | Initial `success`/`pending` writers |
| `mcp_server/lib/search/vector-index-store.ts` | Active-shard path resolution for reconcile |
| `mcp_server/context-server.ts` | Hardcoded retry loop interval/batch (bypasses env) |
| `.opencode/bin/mk-spec-memory-launcher.cjs`, `lib/launcher-ipc-bridge.cjs` | Daemon lease/bridge: no env-reload on reconnect |
| `mcp_server/lib/embedders/sidecar-client.ts` | Sidecars inherit stale daemon env on respawn |

## Databases

| Path | Role |
|------|------|
| `mcp_server/database/context-index.sqlite` | `memory_index.embedding_status` (the backlog) |
| `mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` | Active vector shard (`vec_768`, `vec_memories`) — proven to already hold all 17,326 backlog vectors |

## Proposed (not yet existing)

| Surface | Status |
|---------|--------|
| `memory_embedding_reconcile()` MCP tool | Acceptance spec defined (iter 8); implementation deferred to follow-on packet |
| Reindex status-commit fix (`reindex.ts:440`) | Highest-priority durable fix; deferred to implementation packet |
