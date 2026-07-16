---
title: "Plan: Layer B Sidecar Self-Check and In-Flight Gate"
description: "Canonical-anchor implementation plan for rerank_sidecar Layer B owner self-check, Layer A idle timeout, in-flight gate, and telemetry."
trigger_phrases:
  - "arc 010 005 002 plan"
  - "rerank sidecar self reaper plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/002-implement-layer-b-sidecar-self-check-and-in-flight-gate"
    last_updated_at: "2026-05-23T12:00:00Z"
    last_updated_by: "codex"
    recent_action: "completed-rerank-sidecar-reaper-plan"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "plan.md"
      - ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py"
      - ".opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py"
    session_dedup:
      fingerprint: "sha256:0100050020100050020100050020100050020100050020100050020100050020"
      session_id: "010-005-002-rerank-sidecar-self-reaper"
      parent_session_id: null
    completion_pct: 100
---
# Plan: Layer B Sidecar Self-Check and In-Flight Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11, FastAPI, uvicorn lifespan, pytest |
| **Source Scope** | `rerank_sidecar.py`, `test_rerank_sidecar.py` |
| **Evidence** | Arc 010/004/001 ADR-001, ADR-006, ADR-007; 010/005/001 ledger helpers |

This child phase adds the app-local reaper for owner death and idle timeout while preserving warm-model reuse and avoiding mid-request termination.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Pre-approved child packet path provided by user.
- [x] 010/004/001 ADRs and Files-to-Change handoff read.
- [x] 010/005/001 ledger helper docs and current `sidecar_ledger.py` read.
- [x] Current `rerank_sidecar.py` and `test_rerank_sidecar.py` read before editing.
- [x] Level 2 scaffold strict-validated before source edits.

### Definition of Done
- [x] Reaper is lifespan-managed and async-native.
- [x] `/warmup` and `/rerank` are in-flight gated; `/health` does not refresh idle.
- [x] Telemetry JSONL is written for reap/idle decisions.
- [x] Targeted tests pass with model loading mocked.
- [x] Alignment drift and strict spec validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Invariants Enforced
- `InFlightGate` is the only app-local request counter; decrement happens in endpoint `finally` blocks.
- `evaluate_reaper_once()` checks owner liveness for rows matching the current `PORT`, then idle timeout.
- Reaper decisions use `os.kill(os.getpid(), signal.SIGTERM)` after telemetry write so uvicorn can run lifespan shutdown.
- Telemetry writes use a synchronous helper for testability and an async executor wrapper from the reaper path.
- Manual debug opt-out skips task creation entirely.

### Affected Surfaces

| Surface | Invariant |
|---------|-----------|
| `rerank_sidecar.py` env config | Heartbeat default 45s, idle default 1800s, telemetry default `~/Library/Logs/spec-kit/sidecar-reaper.jsonl`. |
| `rerank_sidecar.py` lifespan | Create/cancel one reaper task; clear loaded model registry on shutdown. |
| `rerank_sidecar.py` endpoints | `/warmup` and `/rerank` refresh idle and gate in-flight; `/health` stays pure. |
| `test_rerank_sidecar.py` | Tests import fake `sentence_transformers` and directly exercise reaper evaluation. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Read the predecessor ADRs, sibling ledger docs, current sidecar code, current tests, and canonical anchor sibling. Scaffold this child packet and strict-validate before source edits.

### Phase 2: Core Implementation
Add env knobs, in-flight gate, idle tracking, locked ledger read, owner-state evaluation, telemetry helper, async executor wrapper, pending shutdown handling, lifespan task management, and endpoint `try/finally` gates.

### Phase 3: Verification
Rewrite/extend tests with mocked model loading, run targeted sidecar pytest, run alignment drift, run py_compile, update checklist/summary/decision record, and strict-validate this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Behavior | Required Test |
|----------|---------------|
| In-flight gate | Dead-owner reaper condition while in-flight stores pending shutdown; SIGTERM occurs only after drain. |
| Health idle policy | Repeated `/health` calls do not refresh `_last_request_at`; idle reaper still fires. |
| Owner liveness | All owners dead triggers reap; mixed live/dead owners do not reap. |
| Idle timeout | Zero in-flight with stale `_last_request_at` triggers `idle-exit`. |
| Telemetry | JSONL line contains structured fields and evidence. |
| Manual opt-out | `RERANK_SIDECAR_REAPER_DISABLE=1` prevents reaper loop startup. |
| Existing behavior | Health, rerank bounds, auth, payload cap, request log redaction, allowlist validation, and lifespan cleanup remain covered. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 010/005/001 `sidecar_ledger.py` | Runtime helper | Available | Supplies ledger rows and identity-verified `process_liveness`. |
| FastAPI lifespan | Runtime lifecycle | Available | Owns reaper task startup/cancel and model cleanup. |
| Sidecar `.venv` | Test runtime | Available | Contains FastAPI/httpx/pytest deps missing from system `python3`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If the reaper behavior regresses, revert only the `rerank_sidecar.py` and `test_rerank_sidecar.py` hunks from this child phase and reset packet docs to incomplete. Do not touch `sidecar_ledger.py`, launcher twins, `start.sh`, README/SKILL docs, or arc review artifacts.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | 010/004/001 ADRs and 010/005/001 ledger helpers | Phase 2 implementation |
| Phase 2: Core Implementation | Current source/test files | Phase 3 verification |
| Phase 3: Verification | Successful code/test edits | Parent handoff and commit by parent agent |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Reaper implementation | Medium | App lifecycle, SIGTERM, and request draining interact. |
| Test rewrite/extension | Medium | Existing subprocess tests were replaced with model-mocked in-process tests. |
| Documentation and validation | Small | Level 2 docs plus decision refinements. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Record failed verification commands in `implementation-summary.md` with exit code and stderr summary. Parent phase should not advance if targeted pytest, alignment drift, py_compile, or strict validation fails.
<!-- /ANCHOR:enhanced-rollback -->
