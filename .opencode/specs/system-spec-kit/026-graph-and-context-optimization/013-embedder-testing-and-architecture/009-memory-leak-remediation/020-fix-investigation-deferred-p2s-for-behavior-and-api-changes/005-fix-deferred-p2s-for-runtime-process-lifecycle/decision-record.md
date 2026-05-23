---
title: "Decision Record: Runtime Process Lifecycle Closure"
description: "ADRs for F41, F43, F51, F90, and F110 runtime lifecycle remediation."
trigger_phrases:
  - "020 005 ADR"
  - "runtime lifecycle decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/005-fix-deferred-p2s-for-runtime-process-lifecycle"
    last_updated_at: "2026-05-23T10:55:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded lifecycle ADRs"
    next_safe_action: "Review and optionally commit packet"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0200050200050200050200050200050200050200050200050200050200050200"
      session_id: "020-005-runtime-process-lifecycle"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Runtime Process Lifecycle Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: Gate paused reindex startup behind testables

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F43

### Decision
Production `startReindex()` always queues and starts work. The paused `autoStart=false` path is reachable only through `reindex.testables.ts`, which calls an internal runtime seam for fixtures.

### Rationale
- `autoStart=false` had only test consumers.
- Keeping it in the production call shape made a fixture control look like runtime API.
- The F37 precedent favors explicit testables modules for test-only behavior.

### Alternatives Considered
- Delete paused startup entirely: rejected because existing reindex fixtures need to inspect queued jobs.
- Keep `autoStart` on production options: rejected because it leaves F43 open.

### Compatibility Contract
Production callers get immediate enqueue behavior. Tests that need a queued-but-paused job import `__embedderReindexTestables.startReindex()`.

---

## ADR-002: Keep and document cancellation lifecycle

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F41

### Decision
Keep `cancelJob()` exported from `reindex.ts` because `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts` is a live barrel consumer and is explicitly out of scope for this bucket. Move test imports to `reindex.testables.ts` and document that cancellation is currently a queued/running job-state operation, not a public MCP tool.

### Rationale
- The prompt forbids modifying `index.ts`, and removing the source export would break typecheck through the live barrel.
- Tests should still avoid importing lifecycle helpers directly from production when a testables seam exists.
- The cancellation behavior is useful and deterministic: terminal jobs are returned unchanged; queued/running jobs become `cancelled`.

### Alternatives Considered
- Remove `cancelJob` from production and edit the barrel: rejected by explicit scope constraints.
- Delete cancellation tests: rejected because it would reduce lifecycle coverage.

### Compatibility Contract
`cancelJob(jobId, db?)` remains available for existing barrel consumers. This packet does not add a new MCP-facing cancel endpoint.

---

## ADR-003: Fail fast on missing database directory

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F110

### Decision
Validate the main database directory before reindex job construction and resume. In-memory or anonymous databases throw `InvalidDatabaseDirError` with a file-backed database message.

### Rationale
- Reindex writes vector shards beside the main database.
- The old `writeVectorsToShard()` null return silently skipped shard writes.
- Failing before job construction gives operators a clear startup error instead of a partially successful job.

### Alternatives Considered
- Keep silent return: rejected because it leaves F110 open.
- Defer shard write only for tests: rejected because tests should mirror runtime with file-backed temp databases.

### Compatibility Contract
File-backed SQLite databases continue to work. `:memory:` databases are unsupported for reindex startup/resume.

---

## ADR-004: Duplicate signals no-op while shutdown is in flight

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F51

### Decision
Keep the F53 best-effort shutdown hook model, but add a `shutdownSignalInFlight` guard. The first signal starts sidecar shutdown and schedules signal replay; duplicate signals warn and return without replaying again.

### Rationale
- The F53 baseline says callers needing deterministic cleanup must call `shutdownAllSidecars()` directly.
- Awaiting cleanup inside a signal handler can imply a stronger shutdown guarantee than Node can provide.
- Replaying the signal more than once risks recursion or duplicate process termination paths.

### Alternatives Considered
- Remove signal replay: rejected because it would alter the F53 baseline.
- Await shutdown before replay: rejected because it can block the shutdown promise chain.

### Compatibility Contract
Hooks register once. The first SIGINT/SIGTERM/SIGHUP starts best-effort cleanup and replays the signal after the promise settles. Duplicate re-entry during that window is a warning-only no-op.

---

## ADR-005: Direct provider credential cache invalidates on adapter rotation

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F90

### Decision
Track the active adapter key in `execution-router.ts`. When `getEmbedderAdapter()` resolves a different provider/model key, clear the direct provider adapter map and emit a `CredentialCacheInvalidationEvent` with previous key, next key, cleared direct keys, and the stale window label `until-next-adapter-resolution`.

### Rationale
- `DirectProviderAdapter` caches the provider promise, which can capture stale credentials.
- Rotation is the narrowest reliable invalidation signal available in this file without adding timers or editing credential providers.
- Emitting an event makes the invalidation observable and testable without logging secrets.

### Alternatives Considered
- TTL-based adapter recreation: rejected for this packet because it adds timing behavior and test flake risk.
- Restart sidecar workers on rotation: rejected because `sidecar-client.ts` and `sidecar-worker.ts` are out of scope.
- Document restart-only behavior: rejected because the prompt requires a cache invalidation event.

### Compatibility Contract
Direct provider credential staleness is bounded until the next adapter resolution after a provider/model rotation. Sidecar worker credential refresh remains out of scope for this bucket and may require a later sidecar-specific packet.

---

## Verification Notes

- 2026-05-23: Scaffold strict validation passed with errors 0, warnings 0.
- 2026-05-23: Focused touched vitest files passed: 2 files, 14 tests.
- 2026-05-23: Requested embedders vitest first run hit known F48 flake; allowed rerun passed: 4 files, 49 tests.
- 2026-05-23: `npm run typecheck --workspace=@spec-kit/mcp-server` exited 0.
- 2026-05-23: Final strict validation passed with errors 0, warnings 0.

## DEFERRED

- None.
