---
title: "Feature Specification: Layer D Launcher Pre-Flight Reap and Parity Fixtures"
description: "Implement launcher-side stale rerank sidecar cleanup in JS and Python, with shared fixture parity proving identical owner-liveness and reap decisions."
trigger_phrases:
  - "arc 010 005 003"
  - "layer d launcher preflight reap"
  - "rerank sidecar parity fixtures"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures"
    last_updated_at: "2026-05-23T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "implemented-layer-d-launcher-reap"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py"
      - ".opencode/bin/lib/ensure-rerank-sidecar.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0100050030100050030100050030100050030100050030100050030100050030"
      session_id: "010-005-003-layer-d-launcher-reap"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Layer D Launcher Pre-Flight Reap and Parity Fixtures

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The detached rerank sidecar launchers could reuse or spawn sidecars without first removing rows whose registered launcher owners were all dead. That left failed-start, hung, or ownerless stale rows able to accumulate until a later cleanup path noticed them.

### Purpose
Add Layer D pre-flight cleanup to both launcher twins and prove JS/Python reap decisions stay identical on the shared 010/005/001 fixture matrix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add JS launcher pre-flight reap before reuse or spawn.
- Add Python launcher pre-flight reap before reuse or spawn.
- Register the current launcher owner identity on reused and newly spawned rows.
- Extend Vitest coverage to consume `system-rerank-sidecar/tests/fixtures/reaper-ledger-cases.json`.
- Document parity verdicts and verification evidence in this packet.

### Out of Scope
- `rerank_sidecar.py` Layer B/Layer A behavior, owned by 010/005/002.
- `sidecar_ledger.py` schema/helper changes, owned by 010/005/001.
- `start.sh`, `SKILL.md`, and README env forwarding/docs, owned by later phases.
- Git commit or PR creation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modify | Add JS pre-flight reap, v2 ledger write, owner registration, telemetry, and parity exports. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Modify | Mirror pre-flight reap and owner registration using Python ledger helpers. |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modify | Add shared fixture parity, identity reasons, legacy migration, dead-owner reap, and live-owner no-kill coverage. |
| This packet folder | Create | Level 2 packet docs plus decision record and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | JS launcher runs pre-flight reap before reuse/spawn. | `reapStaleSidecars()` is called after the disabled gate and before `findReusableSidecar()`. |
| REQ-002 | Python launcher mirrors JS pre-flight behavior. | `preflight_reap_sidecars()` runs before `find_reusable_sidecar()`. |
| REQ-003 | Reap only when all owners are dead and `/health` is unreachable. | Vitest covers dead-owner health failure and live-owner no-kill. |
| REQ-004 | Debug/manual rows without an `owners` field are not killed by Layer D. | JS and Python preserve missing-owner rows during pre-flight. |
| REQ-005 | Reused and spawned rows register the launcher owner identity. | JS legacy migration test asserts owner append; Python spawn row includes `current_owner_identity()`. |
| REQ-006 | JS and Python decisions match shared fixtures. | JS Vitest and Python pytest consume the same fixture names and expected decisions. |
| REQ-007 | Detached launch behavior is preserved. | JS keeps `detached: true` plus `child.unref()`; Python keeps `start_new_session=True`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `python3 -m pytest tests/test_sidecar_ledger.py -v` passes in `.opencode/skills/system-rerank-sidecar`.
- Vitest passes for `bin/lib/ensure-rerank-sidecar.vitest.ts`.
- JS and Python fixture verdicts match for every case in `reaper-ledger-cases.json`.
- Spec validation passes with zero warnings under `--strict`.
- No files outside the approved three implementation files and this packet are modified by this work.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| False-positive kill of a manual debug sidecar | Rows missing the `owners` field are skipped during pre-flight. |
| PID reuse misclassifies a live owner | JS now verifies PID identity with the same lstart/comm semantics as Python. |
| Launcher latency increases too much | Reap health probe uses a short 100 ms default timeout. |
| JS/Python semantic drift | Shared fixture matrix is consumed by both pytest and Vitest. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No open questions remain for this child phase. The later docs/env-forwarding packet still owns operator-facing documentation.

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Evidence |
|----|-------------|----------|
| NFR-P02 | Pre-flight reap adds no more than 200 ms to cold-launch path. | JS and Python use `RERANK_SIDECAR_REAPER_HEALTH_TIMEOUT_MS` with 100 ms default. |
| NFR-S01 | Reaping must not kill debug rows without owner identity. | Missing-owner rows are skipped. |
| NFR-M01 | Ledger writes remain locked/atomic. | JS keeps lock-file guarded writes; Python uses `sidecar_ledger._locked_ledger()`. |
| NFR-T01 | Reaper telemetry is best-effort and non-blocking. | Both launchers swallow telemetry write failures. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

| Edge Case | Expected Handling |
|-----------|-------------------|
| All owners dead, health unreachable | SIGTERM sidecar PID and remove ledger row. |
| All owners dead, health reachable | Keep row because a live sidecar is still answering. |
| One owner live, health unreachable | Keep row and do not signal sidecar. |
| Owner PID recycled | Treat owner as dead when lstart or comm differs. |
| EPERM owner | Treat owner as alive and do not reap. |
| Missing `owners` field | Treat as debug/legacy manual row and skip pre-flight reap. |
| Legacy healthy matching row | Reuse and register current owner, migrating it to owners v2. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY & IMPACT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Runtime complexity | Medium | Two launcher implementations must stay semantically aligned. |
| Blast radius | Medium | Changes affect sidecar startup and stale-process cleanup only. |
| Verification burden | High | Cross-runtime parity is required by ADR-005. |
| Rollback difficulty | Low | Revert the three scoped implementation files and packet docs. |
<!-- /ANCHOR:complexity -->

<!-- /ANCHOR:questions -->
