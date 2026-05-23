---
title: "Decision Record: Filesystem Durability Closure for F22 F28 F59 F66 F67 F72 F89 F103 F104"
description: "ADRs for rerank sidecar directory fsync, random temp naming, state-dir validation, log file permissions, stdio shape, health payload normalization, DI, and helper extraction."
trigger_phrases:
  - "020 003 ADR"
  - "filesystem durability ADR"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/003-fix-deferred-p2s-for-filesystem-durability"
    last_updated_at: "2026-05-23T10:31:09Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified"
    next_safe_action: "Parent agent may review and commit packet"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0200030200030200030200030200030200030200030200030200030200030200"
      session_id: "020-003-filesystem-durability"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Filesystem Durability Closure for F22 F28 F59 F66 F67 F72 F89 F103 F104

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: Directory fsync after atomic rename

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F72

### Decision
Extend the existing atomic write helper so successful temp-file rename is followed by `fsync` on the containing directory.

### Rationale
- The F15 baseline protects file contents with exclusive temp create, file fsync, and rename.
- Directory fsync closes the remaining crash window where the renamed directory entry may not be durable.

### Alternatives Considered
- File fsync only: rejected because it does not guarantee rename metadata durability.
- Best-effort warning-only directory fsync: rejected because callers would assume durability that was not achieved.

### Durability Contract
Safe after this change: crash after a successful atomic write returns should preserve both file contents and the renamed directory entry on platforms supporting directory fsync.
Unchanged: crash before rename may leave a temp file; crash during unsupported platform behavior follows the OS filesystem contract.

### Backward Compatibility
Successful writes may now fail if directory fsync fails. That is intentional because the write cannot honestly claim durable persistence.

---

## ADR-002: Crypto-random temp file suffixes

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F104

### Decision
Use `crypto.randomBytes(16).toString('hex')` for persistent temp file suffixes.

### Rationale
- Random suffixes avoid PID/time collisions across concurrent launcher instances.
- The choice matches the F15 atomic-write baseline and keeps temp naming non-predictable.

### Alternatives Considered
- PID plus timestamp: rejected because it is predictable and can collide in fast retries.
- Deterministic sequence: rejected because concurrent processes cannot coordinate safely without extra state.

### Durability Contract
Safe after this change: concurrent writers are less likely to collide before exclusive `wx` create.
Unchanged: `wx` remains the final collision guard.

### Backward Compatibility
Temp file names change but are internal. Existing final state file paths remain unchanged.

---

## ADR-003: State directory validation boundary

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F89

### Decision
Validate `RERANK_SIDECAR_STATE_DIR` at launcher entry. Reject relative paths, traversal segments, paths outside `$HOME`, and non-writable directories.

### Rationale
- The launcher writes owner and health state; path confusion here can write outside the intended user sandbox.
- Failing early gives operators a clear correction point before any partial state is created.

### Alternatives Considered
- Normalize relative paths against CWD: rejected because CWD differs between callers and scripts.
- Allow `/tmp`: rejected for this bucket because the prompt names `$HOME` as the documented sandbox.

### Durability Contract
Safe after this change: durable writes are limited to validated owner-writable state directories under `$HOME`.
Unchanged: callers can still use the default launcher state directory when no env override is provided.

### Backward Compatibility
Operators using relative or outside-home `RERANK_SIDECAR_STATE_DIR` must move to an absolute under-home path.

---

## ADR-004: Owner-only log files and stable fd stdio

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F66, F103

### Decision
Open sidecar log files with mode `0600` and pass the same log fd to child stdout and stderr via `stdio: ['ignore', logFd, logFd]`.

### Rationale
- Sidecar logs can include local paths and operational context, so owner-only mode is safer than group/world-readable logs.
- Passing the fd explicitly for both stdout and stderr avoids mixed inherit/file behavior and makes spawn tests deterministic.

### Alternatives Considered
- Mode `0644`: rejected because ops readability does not outweigh sensitive local process details.
- Keep inherited stderr: rejected because logging-enabled spawns should keep both child streams in the configured log.

### Durability Contract
Safe after this change: log file creation has predictable permissions and child output routing.
Unchanged: log writes themselves are not fsync-on-every-line durable.

### Backward Compatibility
Other users on the same machine may no longer read sidecar logs without owner mediation.

---

## ADR-005: Health payload normalization

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F59

### Decision
Normalize health probe responses to `{ status, port, ownerCount, lastReapTs }` with stable field names and types.

### Rationale
- Consumers need one shape regardless of whether the sidecar is already running, newly spawned, or unhealthy.
- Type-stable fields make restart diagnostics easier to assert in tests.

### Alternatives Considered
- Preserve branch-specific payloads: rejected because callers must then know launcher internals.
- Add optional fields per health source: rejected for this bucket because the finding asks for stable shape.

### Durability Contract
Safe after this change: persisted owner count and reap timestamp are reported consistently after restarts.
Unchanged: the health endpoint still reflects current process reachability rather than a durable transaction log.

### Backward Compatibility
Callers using old ad hoc field names must read the normalized names.

---

## ADR-006: Internal dependency injection with stable public API

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F22, F28, F67

### Decision
Keep `ensureRerankSidecar` callable as before while adding an internal options/deps resolution path for tests. Split the largest orchestration body into helpers for disabled handling, health probing, spawn planning, and state writes.

### Rationale
- DI lets tests cover spawn, fetch, fs, and process behavior without brittle global monkey-patching.
- Helper extraction reduces the risk of future durability changes hiding inside one large function.
- Consistent disabled handling belongs at the same entry boundary as dependency resolution.

### Alternatives Considered
- Public signature change: rejected because this packet forbids public API changes.
- Keep monkey-patched globals in tests: rejected because it is fragile for filesystem durability semantics.
- Broad class rewrite: rejected because this bucket calls for conservative helper extraction.

### Durability Contract
Safe after this change: tests can deterministically inject fsync, rename, spawn, and health failures.
Unchanged: production callers keep the same API and default dependencies.

### Backward Compatibility
Public imports and normal call sites remain stable.

---

## Verification Notes

- 2026-05-23: The prompt's bin command failed before executing tests because `.opencode/skills/system-spec-kit/node_modules/vitest/vitest.mjs` is absent in this checkout. Equivalent local runner passed from `.opencode`: `node skills/system-spec-kit/scripts/node_modules/vitest/vitest.mjs run bin/lib/ensure-rerank-sidecar.vitest.ts --config vitest.config.bin.ts` => 1 file, 37 passed, 5 skipped, exit 0.
- 2026-05-23: Embedders vitest passed with 4 files and 43 tests; no F48 monotonic-ID flake occurred.
- 2026-05-23: `npm run typecheck --workspace=@spec-kit/mcp-server` exited 0.

## DEFERRED

- None.
