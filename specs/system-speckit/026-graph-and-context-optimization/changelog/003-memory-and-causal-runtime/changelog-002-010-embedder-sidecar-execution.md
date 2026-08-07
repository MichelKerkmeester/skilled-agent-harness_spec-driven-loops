---
title: "Embedder Sidecar Execution: Process-Isolated Local Embedding"
description: "Heavy local embedder runtimes now route through lazy child-process sidecars. hf-local model state stays out of the MCP daemon RSS and is evicted after idle. Cache writes, vector writes and database ownership remain in the MCP process."
trigger_phrases:
  - "embedder sidecar execution"
  - "hf-local sidecar isolation"
  - "sidecar_workers memory health"
  - "execution router embedder policy"
  - "local embedder process boundary"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

The `hf-local` embedder loaded Transformers.js model state directly into the MCP daemon. That kept daemon RSS elevated after local embedding use while Ollama, Voyage and OpenAI already kept model memory outside the process. Deep-research-005 iteration 010 Finding 5 recommended process isolation for local in-process backends.

Three new modules shipped a JSONL stdio sidecar layer. `sidecar-client.ts` implements `EmbedderAdapter` with lazy fork, numeric request correlation, pre-request ping, idle eviction and graceful shutdown. `sidecar-worker.ts` runs in the child process, lazily creates a shared provider and returns structured error responses instead of crashing. `execution-router.ts` reads `SPECKIT_EMBEDDER_EXECUTION` policy and routes `auto`, `direct` or `sidecar` decisions per provider, caching one sidecar per provider/model tuple. Query embedding and reindex jobs now acquire their adapters through the router. Cache writes, vector table writes and reindex job state remain in the MCP process. Full `memory_health` reports expose a `sidecar_workers` map with pid, model, idle age and request count for each live worker.

### Added

- `sidecar-client.ts` implementing `EmbedderAdapter` over JSONL stdio with lazy fork, numeric id correlation, ping timeout, idle eviction, stderr prefixing and shutdown hooks
- `sidecar-worker.ts` child-process runner with lazy shared provider creation and structured error responses
- `execution-router.ts` with `auto`, `direct` and `sidecar` policy routing and one sidecar per provider/model tuple
- 10-test Vitest suite covering sidecar lifecycle and execution router policy in `embedder-sidecar.vitest.ts`
- Three new env vars in `ENV_REFERENCE.md` covering idle timeout, ping timeout and execution policy
- Sidecar execution section in `embedder_architecture.md` with the auto-routing table

### Changed

- Query embedding in `vector-index-queries.ts` now acquires its adapter through the execution router
- Reindex jobs in `reindex.ts` now acquire their adapters through the execution router
- Full `memory_health` reports include `sidecar_workers` keyed by provider/model with pid, model, last request time, idle age and request count

### Fixed

- None. Additive execution layer with no prior bug in scope.

### Verification

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS |
| `npx vitest --run embedder-sidecar` | PASS, 1 file / 10 tests |
| `npx vitest --run embedder` | PASS, 10 files / 64 tests |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| Integration probe: 5 requests on one worker, idle eviction, respawn on next request | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <010> --strict` | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` (NEW) | Created | Sidecar client lifecycle and JSONL protocol |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` (NEW) | Created | Child-process provider runner |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` (NEW) | Created | Direct/sidecar policy routing with provider/model cache |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modified | Query embedding acquires adapter through execution router |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified | Reindex jobs acquire adapter through execution router |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Full `memory_health` response includes `sidecar_workers` map |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-sidecar.vitest.ts` (NEW) | Created | Sidecar lifecycle and router policy tests |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modified | Sidecar execution section and auto-routing table |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Three new sidecar env vars documented |

### Follow-Ups

- First local embedding after idle pays spawn and model load. `SPECKIT_EMBEDDER_EXECUTION=direct` is available for debugging or latency-sensitive local sessions.
- Future local providers such as `sentence-transformers` and `llama-cpp` need concrete provider implementations before the router policy reaches them. The sidecar path is already reserved for both.
