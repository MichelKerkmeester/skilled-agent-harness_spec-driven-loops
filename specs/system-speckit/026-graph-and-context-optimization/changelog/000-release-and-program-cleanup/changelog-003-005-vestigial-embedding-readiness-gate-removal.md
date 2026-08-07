---
title: "Cleanup: Delete Vestigial Embedding-Readiness Gate from memory-search.ts"
description: "Removed the dead isEmbeddingModelReady and waitForEmbeddingModel gate from the memory-search handler cache-miss branch. After the T016-T019 lazy-loading migration the gate was a no-op in production and a 30-second timeout bomb for any direct in-process caller."
trigger_phrases:
  - "embedding readiness gate removal"
  - "vestigial embedding gate deleted"
  - "memory-search readiness timeout fix"
  - "waitForEmbeddingModel gate cleanup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/005-vestigial-embedding-readiness-gate-removal` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The `handleMemorySearch` handler in `mcp_server/handlers/memory-search.ts` contained a readiness gate at lines 927-932 that polled a module-level boolean (`embeddingModelReady`) for up to 30 seconds before proceeding. After the T016-T019 lazy-loading migration, the embedding model self-initializes on first use and the flag is always flipped to `true` by `context-server.ts` at server bootstrap. In production the gate was dead code. In any direct in-process caller (vitest harnesses, packet-local stress runners, the v1.0.3 live-handler probe) the flag was never set, so the gate invariably timed out with `Embedding model not ready after 30s timeout. Try again later.`

The six gate lines were deleted and the corresponding import on line 61 was reduced to `{ checkDatabaseUpdated }`. Direct in-process probes can now invoke `handleMemorySearch` without server bootstrap and without hitting the timeout. Production behavior is unchanged because the gate was a no-op there.

### Added

None.

### Changed

- `memory-search.ts` import on line 61 reduced to `{ checkDatabaseUpdated }`, removing the unused `isEmbeddingModelReady` and `waitForEmbeddingModel` references.
- Cache-miss branch in `handleMemorySearch` now proceeds directly to pipeline configuration. The `waitForEmbeddingModel(30000)` polling block at former lines 927-932 is gone.

### Fixed

- Direct in-process calls to `handleMemorySearch` (vitest harnesses, packet-local stress runners, the v1.0.3 live-handler probe) no longer hit `Embedding model not ready after 30s timeout. Try again later.` The 30-second stall and throw are eliminated.

### Verification

| Check | Result |
|-------|--------|
| `npx tsc` (TypeScript compile) | PASS, clean |
| `npx vitest run tests/handler-memory-search.vitest.ts tests/memory-search-integration.vitest.ts stress_test/search-quality/` | PASS, 16 files / 97 passed / 5 todo / 0 failed |
| `npx vitest run` on 6 readiness-mock parity suites | PASS, 6 files / 57 passed / 0 failed |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS, exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modified | Import on line 61 reduced to `{ checkDatabaseUpdated }`. Readiness gate deleted at former lines 927-932. |

### Follow-Ups

- `db-state.ts` still exports `isEmbeddingModelReady`, `setEmbeddingModelReady`, `waitForEmbeddingModel`. `context-server.ts` still calls them. Those are no-ops in lazy-loading runtime but remain as vestigial scaffold. A follow-up Level 1 packet can complete the full deprecation.
- Test mocks in 8 vitest files still set the readiness functions to `() => true`. These are now unnecessary noise but do not break anything. Removal is mechanical and belongs in the same follow-up that retires the `db-state.ts` exports.
- The "user cancelled MCP tool call" symptom seen in the v1.0.3 stress test was an MCP transport-layer cancellation from the orchestrator (Codex client), not a server-side bug. It was not caused by or addressed by this gate removal.
