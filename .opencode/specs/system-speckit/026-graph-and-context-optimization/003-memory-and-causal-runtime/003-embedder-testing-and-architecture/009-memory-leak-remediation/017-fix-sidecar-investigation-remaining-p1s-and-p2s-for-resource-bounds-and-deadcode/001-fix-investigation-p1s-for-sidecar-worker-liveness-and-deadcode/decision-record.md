---
title: "Decision Record: Sidecar-Worker P1 Liveness and Parse Policy"
description: "ADRs for F14, F94, and F95 behavioral fixes in sidecar-worker.ts."
trigger_phrases:
  - "arc 010 003 001 decisions"
  - "sidecar-worker liveness parse cache adr"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode"
    last_updated_at: "2026-05-23T06:20:00Z"
    last_updated_by: "codex"
    recent_action: "recorded-sidecar-worker-p1-adrs"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0100030010100030010100030010100030010100030010100030010100030010"
      session_id: "010-003-001-sidecar-worker-p1"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Sidecar-Worker P1 Liveness and Parse Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: Structured Parent Liveness for Worker Polling

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F14 - Incorrect parent liveness detection in sidecar-worker

### Decision
Replace boolean `parentProcessAlive()` with `parentProcessLiveness()` returning `{ alive, reason, errorCode }`. The reasons are `pid-1-orphaned`, `kill-0-eperm`, `kill-0-esrch`, `ok`, and `unknown`. PID 1, ESRCH, invalid pids, and unknown errors are not alive for worker polling. EPERM is alive because the process exists but is not signalable by this process.

### Rationale
- Boolean liveness hid the distinction between alive, permission-denied, missing, orphaned, and unknown states.
- PID 1 means the worker is orphaned from its owning parent and must not be treated as healthy ownership.
- Unknown errors are warning-backed and fail closed for the worker to avoid indefinite orphan resource use.

### Consequences
- Worker polling now exits on orphaned, missing, invalid, or unknown parent state.
- Operators get stderr warnings for unknown liveness errors.
- Tests pin PID 1, EPERM, and ESRCH behavior.

---

## ADR-002: Pre-Parse Failure Id Policy

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F94 - Sidecar-worker pre-parse errors used `id: 0` and were silently dropped by clients

### Decision
Never emit synthetic `id: 0` for worker parse failures. If malformed input includes a recoverable numeric `id`, respond with that id and a canonical `{ phase: "parse", code, detail }` error. If input is unparseable and has no recoverable id, write `sidecar-worker: pre-parse failure ...` to stderr and exit 1.

### Rationale
- The client only resolves or rejects pending requests by matching ids.
- `id: 0` is not a real pending request id and can silently disappear.
- Terminating no-id unparseable input lets the parent observe worker failure through existing lifecycle paths.

### Consequences
- Partial JSON with an id gives the caller a direct error response.
- No-id unparseable input is a process-level protocol failure.
- Error responses carry explicit `phase`, `code`, and `detail` fields.

---

## ADR-003: Provider Promise Rejection Eviction

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F95 - Cached rejected provider promise persists indefinitely in sidecar-worker

### Decision
Wrap the cached provider creation promise with a rejection branch that clears `providerPromise` when the cached promise rejects. Resolved provider promises stay cached.

### Rationale
- A transient provider initialization failure should not poison all future requests for the lifetime of the worker.
- Keeping successful provider cache permanence avoids extra warmup and preserves existing steady-state behavior.
- The policy is local to the worker provider cache and does not change sidecar-client lifecycle behavior.

### Consequences
- The next request after a provider initialization rejection retries provider construction.
- A successful retry is cached and reused.
- Fixture tests cover both retry-after-rejection and success-cache permanence.

---

## Summary

The accepted decisions close the three behavioral P1 findings in this phase:

- F14: structured parent liveness with orphan detection.
- F94: request-id preserving parse failures and exit 1 for no-id unparseable input.
- F95: rejected-promise eviction with success-cache permanence.
