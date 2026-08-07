---
title: "016/003: Embedder MCP tools and re-index orchestrator"
description: "Three MCP tools (embedder_list, embedder_set, embedder_status) and a background re-index orchestrator shipped. Batched embedding, job persistence, crash-resume, cancellation plus atomic two-phase pointer swap all verified. Tool count rose from 39 to 42."
trigger_phrases:
  - "016/003 embedder mcp tools"
  - "embedder_list embedder_set embedder_status"
  - "reindex orchestrator mcp"
  - "embedder tool registration"
  - "two-phase active pointer swap"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/003-mcp-tools-and-reindex`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

The swap mechanism built in phase 002 had no operator-facing surface. Calling `embedder_set` required direct database access. There was no way to list available embedders, monitor re-index progress or cancel a running job from the MCP protocol layer.

Phase 003 wired the swap mechanism into three new MCP tools and a background orchestrator. `embedder_list` returns all registered manifests with the active embedder flagged and adapter readiness probed. `embedder_set` validates the requested manifest, lazily creates the target dim table, launches a background re-index job and returns a job ID. `embedder_status` reports progress, ETA plus status for a given job or for the currently active queued or running job. The re-index orchestrator batches embedding work in configurable groups of 50, persists progress to `embedder_jobs` after every batch, resumes automatically on MCP server restart and flips the active pointer only after full completion to guarantee the old `vec_<dim>` corpus remains queryable until swap-over. All three handlers plus the orchestrator state machine are covered by four new vitest suites.

### Added

- `mcp_server/handlers/embedder-list.ts`: handler returning all registered manifests, the active embedder flag plus bounded-timeout readiness probes per adapter
- `mcp_server/handlers/embedder-set.ts`: handler validating manifest names, creating the target dim table, starting a background re-index job and returning job status metadata
- `mcp_server/handlers/embedder-status.ts`: handler reporting an explicit job or the active queued or running job
- `mcp_server/lib/embedders/reindex.ts`: orchestrator persisting `embedder_jobs`, batching embedding work, writing to `vec_<dim>`, supporting cancel and resume plus performing a two-phase active pointer flip
- `mcp_server/tests/embedder-list.vitest.ts`, `embedder-set.vitest.ts`, `embedder-status.vitest.ts`, `embedder-reindex.vitest.ts`: four handler and orchestrator test suites including a 10-memory fixture and mocked `OllamaAdapter`
- Three tool schemas (`embedder_list`, `embedder_set`, `embedder_status`) in `tool-schemas.ts` and `tool-input-schemas.ts`, raising the registered tool count from 39 to 42

### Changed

- `mcp_server/handlers/index.ts`: lazy handler exports extended to include the three new embedder handlers
- `mcp_server/lib/embedders/index.ts`: barrel exports updated to expose the re-index orchestrator
- `mcp_server/context-server.ts`: MCP startup path extended to call `resumeReindexJobs(database)` for crash-resume on server start
- `mcp_server/tools/memory-tools.ts` and `tools/types.ts`: dispatcher wiring and tool-type registry updated for the three new tools
- `mcp_server/tests/context-server.vitest.ts`: cat-18 tool-count assertion updated from 39 to 42

### Fixed

- No regressions targeted in this phase. Work was net-new implementation building on the interface and schema layer from phases 001 and 002.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS |
| `npx tsc --noEmit` | PASS |
| `npx vitest run tests/embedder-list.vitest.ts` | PASS |
| `npx vitest run tests/embedder-set.vitest.ts` | PASS |
| `npx vitest run tests/embedder-status.vitest.ts` | PASS |
| `npx vitest run tests/embedder-reindex.vitest.ts` | PASS |
| `npx vitest run tests/context-server.vitest.ts` | PASS. 42 tools. |
| `npx vitest run tests/embedder-registry.vitest.ts` | PASS |
| `npx vitest run tests/embedder-ollama.vitest.ts` | PASS |
| `npx vitest run tests/embedder-schema.vitest.ts` | PASS |
| `validate.sh .../003-embedder-mcp-tools-and-reindex --strict` | PASS. 0 errors, 0 warnings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/handlers/embedder-list.ts` (NEW) | Created | Manifest listing handler with readiness probes |
| `mcp_server/handlers/embedder-set.ts` (NEW) | Created | Embedder selection handler that starts re-index and returns job ID |
| `mcp_server/handlers/embedder-status.ts` (NEW) | Created | Job status polling handler |
| `mcp_server/lib/embedders/reindex.ts` (NEW) | Created | Background orchestrator with batch embedding, job persistence, cancel, resume, two-phase pointer flip |
| `mcp_server/tests/embedder-list.vitest.ts` (NEW) | Created | Handler test suite |
| `mcp_server/tests/embedder-set.vitest.ts` (NEW) | Created | Handler test suite |
| `mcp_server/tests/embedder-status.vitest.ts` (NEW) | Created | Handler test suite |
| `mcp_server/tests/embedder-reindex.vitest.ts` (NEW) | Created | Orchestrator state machine suite with 10-memory fixture |
| `mcp_server/tool-schemas.ts` | Updated | Three new tool schema registrations. Tool count 39 to 42. |
| `mcp_server/schemas/tool-input-schemas.ts` | Updated | Input schemas for `embedder_list`, `embedder_set`, `embedder_status` |
| `mcp_server/handlers/index.ts` | Updated | Lazy exports extended for three new handlers |
| `mcp_server/lib/embedders/index.ts` | Updated | Barrel exports include reindex orchestrator |
| `mcp_server/context-server.ts` | Updated | Startup path calls `resumeReindexJobs` for crash-resume |
| `mcp_server/tests/context-server.vitest.ts` | Updated | Cat-18 tool count assertion raised to 42 |

### Follow-Ups

- Re-index pauses when Ollama is unreachable mid-run. Implement a retry budget so transient network outages do not stall long-running jobs permanently.
- Cancel does not roll back partial writes to `vec_<newdim>`. Document that partial tables are safe to overwrite on retry. Add a cleanup sweep for orphaned partial tables on startup.
- Large corpora above 100k memories may require tuning the default batch size of 50 via `EMBEDDER_REINDEX_BATCH_SIZE` to avoid OOM or timeout pressure.
