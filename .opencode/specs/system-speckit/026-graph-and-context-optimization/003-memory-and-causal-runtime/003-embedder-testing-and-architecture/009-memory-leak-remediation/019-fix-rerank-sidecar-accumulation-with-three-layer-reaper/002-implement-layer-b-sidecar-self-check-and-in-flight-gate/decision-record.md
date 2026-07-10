---
title: "Decision Record: Layer B Sidecar Self-Check and In-Flight Gate"
description: "ADRs and packet-local refinements for rerank_sidecar Layer B owner self-check, Layer A idle timeout, telemetry path, and legacy owner policy."
trigger_phrases:
  - "arc 010 005 002 decisions"
  - "rerank sidecar reaper adr"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/002-implement-layer-b-sidecar-self-check-and-in-flight-gate"
    last_updated_at: "2026-05-23T12:00:00Z"
    last_updated_by: "codex"
    recent_action: "recorded-rerank-sidecar-reaper-adrs"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0100050020100050020100050020100050020100050020100050020100050020"
      session_id: "010-005-002-rerank-sidecar-self-reaper"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Layer B Sidecar Self-Check and In-Flight Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: Lifespan-Managed Async Reaper

**Status:** Accepted
**Date:** 2026-05-23
**Context:** Implements ADR-001 Layer B and Layer A inside `rerank_sidecar.py`.

### Decision
Run the reaper as a FastAPI lifespan-managed `asyncio.create_task(reaper_loop())`, cancel it on lifespan shutdown, and keep the existing model cleanup in the same shutdown path.

### Rationale
- The predecessor ADR explicitly rejected daemon-thread cleanup.
- Uvicorn lifespan shutdown is the right boundary for clearing loaded model references.
- A single asyncio task keeps app lifetime observable and testable.

### Consequences
- Manual debug opt-out can prevent task startup entirely.
- Reaper evaluation can be tested directly through `evaluate_reaper_once()`.
- Later launcher phases do not need to know app internals.

---

## ADR-002: Pending Shutdown When Requests Are In Flight

**Status:** Accepted
**Date:** 2026-05-23
**Context:** Implements ADR-007 in-flight request gate.

### Decision
Use a shared `InFlightGate` counter around `/warmup` and `/rerank`. If owner-death or idle conditions fire while the counter is non-zero, store a `ReaperDecision` and send SIGTERM only after the counter drains.

### Rationale
- `/warmup` and `/rerank` both load or use models and must not be interrupted mid-request.
- A shared app-level counter is simpler and safer than coordinating per-model locks.
- `finally` blocks guarantee decrement even when validation or model work raises.

### Consequences
- Reaper action can lag one request completion.
- Telemetry records the in-flight count that caused deferral.
- `/health` remains outside the gate because it is a probe and does not refresh idle.

---

## ADR-003: Packet Telemetry Env Name Refinement

**Status:** Accepted
**Date:** 2026-05-23
**Context:** 010/004/001 ADR-006 named `RERANK_SIDECAR_REAPER_LOG_PATH`, while this child packet explicitly requires `RERANK_SIDECAR_REAPER_TELEMETRY_PATH`.

### Decision
Use `RERANK_SIDECAR_REAPER_TELEMETRY_PATH` in `rerank_sidecar.py`, defaulting to `~/Library/Logs/spec-kit/sidecar-reaper.jsonl`.

### Rationale
- The child packet is the more specific implementation contract for this phase.
- The telemetry name is clearer because this log records process-lifecycle events, not request logs.
- Request scoring logs remain owned by existing `RERANK_LOG_PATH`.

### Consequences
- Later launcher/docs phases must forward and document the telemetry env name from this child packet.
- ADR-006 remains conceptually intact: separate lifecycle JSONL telemetry with structured owner evidence.

---

## ADR-004: Legacy Empty-Owner Rows Do Not Trigger App Self-Reap Yet

**Status:** Accepted
**Date:** 2026-05-23
**Context:** 010/005/001 intentionally reads legacy rows as v2 rows with empty owner sets, and its spec notes this app phase owns legacy self-check policy.

### Decision
The app self-reaper requires at least one owner state before Layer B `all-owners-dead` exit. Empty owner sets do not trigger Layer B app self-reap in this child phase.

### Rationale
- Launcher owner registration is owned by a later 010/005 child phase and is not in this phase's write scope.
- Treating empty owners as dead in the app could kill sidecars spawned by the current launcher before owner registration is integrated.
- Idle timeout still provides Layer A cleanup for legacy/ownerless rows.

### Consequences
- This differs from the ledger-level `should_reap_row()` fixture for empty legacy rows, which remains useful for launcher pre-flight cleanup.
- App Layer B becomes fully effective once launcher owner-registration phases land.
- The decision is intentionally packet-local and can be revisited after launcher phases complete.

---

## Summary

The accepted decisions preserve the three-layer architecture while making this child phase safe under current launcher state:

- Layer B owner-death reaper runs inside FastAPI lifespan.
- Layer A idle backstop shares the same in-flight safety gate.
- Telemetry uses the packet-required env name and structured JSONL schema.
- Empty legacy owner rows are not app-self-reaped until owner registration is integrated.
