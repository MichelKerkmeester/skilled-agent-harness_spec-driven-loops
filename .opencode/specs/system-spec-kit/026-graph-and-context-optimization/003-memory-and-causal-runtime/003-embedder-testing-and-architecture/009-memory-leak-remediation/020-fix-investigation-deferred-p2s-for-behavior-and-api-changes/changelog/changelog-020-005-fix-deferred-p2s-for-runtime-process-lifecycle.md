---
title: "Changelog 020-005: Runtime Process Lifecycle Closure for F41 F43 F51 F90 F110"
description: "Five deferred P2 lifecycle findings closed in reindex.ts and execution-router.ts. DB-dir validation now fails fast before job construction. Paused startup moved behind a testables seam. Shutdown signal handling became idempotent. Credential cache entries clear on active adapter rotation."
trigger_phrases:
  - "runtime process lifecycle closure"
  - "F41 F43 F51 F90 F110 fix"
  - "reindex execution-router lifecycle"
  - "InvalidDatabaseDirError reindex"
  - "adapter rotation credential cache clear"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/005-fix-deferred-p2s-for-runtime-process-lifecycle` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes`

### Summary

Five deferred P2 lifecycle findings in `reindex.ts` and `execution-router.ts` had left runtime behavior implicit and error-prone. The reindex startup path silently skipped vector shard creation when the database had no file-backed directory. Test-only paused startup was reachable from production code. Duplicate shutdown signal re-entry could recurse. Direct provider credential caches persisted across active adapter rotation.

All five findings shipped in commit `e189ecde5b`. Reindex startup now validates the database directory and throws `InvalidDatabaseDirError` before constructing any job. Paused startup moved to `reindex.testables.ts` and is no longer reachable from production. Shutdown signal handlers register once and warn on re-entry without replaying. Adapter rotation clears the direct provider cache and emits a structured invalidation event. Regression fixtures cover all five findings across two vitest files.

### Added

- `InvalidDatabaseDirError` error type in `reindex.ts` with a clear file-backed DB message for `:memory:` databases
- `reindex.testables.ts` (new file) exposing paused-startup and cancel helpers for test use only
- Signal re-entry guard in `execution-router.ts` that warns and no-ops on duplicate SIGTERM/SIGINT/SIGHUP
- Credential-cache invalidation event emitted on active adapter key rotation in `execution-router.ts`
- F41/F43/F110 regression fixtures in `embedder-reindex.vitest.ts`
- F51/F90 regression fixtures in `execution-router.vitest.ts`

### Changed

- `startReindex()` now validates file-backed database directory availability before job construction. Previously proceeded silently with vector shard skips on `:memory:` databases.
- Paused startup control moved from an inline `autoStart` flag in `reindex.ts` to `reindex.testables.ts`. Production `startReindex()` always auto-starts.
- `getEmbedderAdapter()` in `execution-router.ts` now tracks the active adapter key and clears direct provider entries on rotation.
- `execution-router.testables.ts` extended with test seams for invalidation listener and cache keys.

### Fixed

- Reindex silently skipped vector shard creation when a `:memory:` database was used. Startup now throws before job construction.
- Test-only paused startup was reachable from production code via the `autoStart` parameter. Production path now auto-starts unconditionally.
- Duplicate SIGTERM/SIGINT/SIGHUP re-entry could recurse into the shutdown chain. Handlers now register once and warn on repeat invocation.
- Direct provider credential cache entries persisted after the active adapter key rotated. Cache now clears on key rotation with a structured event.

### Verification

| Check | Result |
|-------|--------|
| Scaffold strict validation | PASS, errors 0 warnings 0 |
| Focused vitest run (touched files) | PASS, 2 files, 14 tests |
| Embedders vitest suite | PASS (one F48 flake on first run, rerun PASS), 4 files, 49 tests |
| `npm run typecheck --workspace=@spec-kit/mcp-server` | PASS, exit 0 |
| Final strict validation | PASS, errors 0 warnings 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified | DB-dir validation before job construction, internal paused-start seam, `InvalidDatabaseDirError` export |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.testables.ts` | Created (NEW) | Test-only paused-startup and cancel helpers |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modified | Signal re-entry guard and adapter-rotation credential-cache invalidation |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.testables.ts` | Modified | Test seams for invalidation listener and cache key access |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-reindex.vitest.ts` | Modified | F41/F43/F110 regression fixtures |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts` | Modified | F51/F90 regression fixtures |

### Follow-Ups

- Sidecar worker processes are not restarted when the active adapter rotates. The credential-cache invalidation event is visible but force-restart of `sidecar-worker.ts` and `sidecar-client.ts` was explicitly out of scope. A follow-on packet should evaluate whether a restart is needed.
- `cancelJob` remains a production export because `index.ts` is a frozen live barrel consumer. ADR-002 documents the cancellation lifecycle. A future cleanup pass can remove the export once the barrel is no longer frozen.
