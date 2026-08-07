---
title: "Spec: Layer B Sidecar Self-Check and In-Flight Gate"
description: "Level 2 child phase implementing rerank_sidecar Layer B owner self-check, Layer A idle backstop, in-flight gate, and telemetry JSONL."
trigger_phrases:
  - "arc 010 005 002 rerank sidecar self check"
  - "layer b layer a telemetry in flight gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/002-implement-layer-b-sidecar-self-check-and-in-flight-gate"
    last_updated_at: "2026-05-23T12:00:00Z"
    last_updated_by: "codex"
    recent_action: "implemented-rerank-sidecar-self-reaper"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py"
      - ".opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0100050020100050020100050020100050020100050020100050020100050020"
      session_id: "010-005-002-rerank-sidecar-self-reaper"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Telemetry env uses RERANK_SIDECAR_REAPER_TELEMETRY_PATH per this child packet."
      - "Legacy empty-owner rows are not self-reaped by the app until launcher owner registration lands."
---

# Spec: Layer B Sidecar Self-Check and In-Flight Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (010/005) |
| **Handoff Criteria** | `test_rerank_sidecar.py` green in sidecar venv; alignment drift PASS; strict validate PASS |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The rerank FastAPI sidecar can remain alive after owners disappear because the current app has no background owner-liveness self-check, no app-level in-flight request gate, no idle timeout backstop, and no process-lifecycle telemetry. Arc 010/004/001 ADR-001, ADR-006, and ADR-007 require an async-native Layer B self-check, Layer A idle exit, structured telemetry, and graceful self-SIGTERM after active requests drain.

### Purpose
Implement the app-local self-reaper in `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` and extend `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` with model-loading mocked so no real sentence-transformers model is loaded.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add reaper env knobs, in-flight gate, idle tracking, telemetry JSONL, and graceful SIGTERM to `rerank_sidecar.py`.
- Run the reaper as a FastAPI lifespan-managed asyncio task.
- Gate `/warmup` and `/rerank`; keep `/health` from refreshing idle state.
- Add focused tests for owner-death reap, partial-owner no-reap, idle timeout, health idle behavior, telemetry JSONL, manual opt-out, and in-flight pending shutdown.
- Maintain packet docs in this folder.

### Out of Scope
- Modifying `sidecar_ledger.py`; this phase consumes the 010/005/001 helpers.
- Modifying launcher twins, `start.sh`, operator docs, README/SKILL docs, or arc review artifacts.
- Commit, branch, or PR mutation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | Modify | Lifespan reaper task, in-flight gate, idle timeout, telemetry JSONL, self-SIGTERM |
| `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` | Modify | Mocked sidecar tests for reaper, idle, telemetry, and existing endpoint behavior |
| `<this-folder>/*.md` and metadata JSON | Create/Modify | Level 2 packet documentation and validation evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reaper is lifespan-managed and async-native. | `lifespan()` creates/cancels an `asyncio` task; no daemon thread is introduced. |
| REQ-002 | Owner-death self-check exits only after active work drains. | In-flight counter defers SIGTERM; request completion triggers pending exit. |
| REQ-003 | Idle backstop exits after configured threshold. | `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS` defaults to 1800 and `0` disables idle exit. |
| REQ-004 | `/health` does not refresh idle state. | Health probes past threshold still allow idle reaper to fire. |
| REQ-005 | Telemetry JSONL records reaper decisions. | Reap/idle events include `ts`, `event_type`, `sidecar_pid`, `port`, `owners_state`, `in_flight_count`, `idle_seconds`, and `reason`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Manual debug opt-out disables reaper task startup. | `RERANK_SIDECAR_REAPER_DISABLE=1` prevents `reaper_loop()` from starting. |
| REQ-007 | Tests avoid real model loading. | `sentence_transformers.CrossEncoder` is replaced with a fake in tests. |
| REQ-008 | Existing endpoint behavior remains covered. | Health, rerank scoring, auth, payload cap, request logging, model allowlist, and lifespan cleanup tests pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Layer B owner-death self-check sends graceful SIGTERM when all registered owners are dead.
- **SC-002**: Layer A idle timeout sends graceful SIGTERM when idle threshold is exceeded and in-flight is zero.
- **SC-003**: `/warmup` and `/rerank` increment/decrement the shared in-flight gate in `finally`.
- **SC-004**: `/health` remains a pure probe and does not refresh `last_request_at`.
- **SC-005**: Telemetry JSONL writes structured lifecycle evidence without blocking the reaper loop.
- **SC-006**: Strict spec validation exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Legacy ledger rows can have empty owner sets until launcher phases register owners. | Premature self-reap could kill freshly spawned sidecars. | App self-reaper requires at least one owner state before all-dead Layer B reap; recorded in decision-record.md. |
| Risk | SIGTERM from a background task can interrupt active requests. | Mid-request failure. | Shared `InFlightGate` stores pending shutdown and sends SIGTERM only after count returns to zero. |
| Risk | Telemetry I/O can block the event loop. | Heartbeat latency or request impact. | Reaper path writes through `run_in_executor`; sync helper remains directly testable. |
| Dependency | Ledger v2 helpers from 010/005/001. | Owner identity evidence. | Use `sidecar_ledger` dataclasses, locked ledger helpers, and `process_liveness`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Reaper cancellation during FastAPI shutdown must not leak background tasks.
- **NFR-R02**: Telemetry write failures must not corrupt existing log content.

### Maintainability
- **NFR-M01**: Reaper evaluation is exposed as `evaluate_reaper_once()` for deterministic unit tests.
- **NFR-M02**: Test fixtures mock the model boundary and avoid subprocess sidecars.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS=0` disables idle exit.
- `RERANK_SIDECAR_REAPER_DISABLE=1` disables task startup.
- Empty owner state from a legacy row does not trigger Layer B app self-reap in this child phase.

### Error Scenarios
- All owners dead while request is in-flight stores a pending decision, writes telemetry after drain, then sends SIGTERM.
- Mixed live/dead owners do not reap.
- `/health` probes do not hide a stale idle timer.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Two source/test files plus packet docs. |
| Risk | 18/25 | Process lifetime, SIGTERM, and request gating are correctness-sensitive. |
| Research | 6/20 | ADRs and ledger helpers already exist. |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None remaining for this child phase. Launcher owner-registration and env forwarding are owned by later 010/005 child phases.
<!-- /ANCHOR:questions -->
