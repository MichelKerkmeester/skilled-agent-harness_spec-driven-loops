---
title: "Feature Specification: Live validation + bench + perimeter hardening"
description: "Add a live two-launcher integration test that gates flipping SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED to default ON, a q8-vs-fp16 bench, default-off idle eviction, socket-dir ownership + sun_path guard, and staged deprecated-env removal."
trigger_phrases:
  - "live two-launcher integration test flag flip"
  - "q8 fp16 bench idle eviction"
  - "socket-dir ownership sun_path guard deprecated env removal"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/005-live-validation-bench-hardening"
    last_updated_at: "2026-05-29T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped perimeter + idle + live-test + cleanup; flag-flip + dtype + live numbers gated"
    next_safe_action: "Reconcile 031 + 026/007 parent packets, then the 20-iter deep review"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003151"
      session_id: "031-005-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Predecessor: 004-perf-instrumentation-batching; the live test gates the advisor flag flip and is the final phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Live validation + bench + perimeter hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Implemented — perimeter + idle + live-test + cleanup shipped; flag-flip + dtype + live numbers gated on a working onnxruntime tree (2026-05-29) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-perf-instrumentation-batching |
| **Successor** | None |
| **Handoff Criteria** | The live two-launcher integration test passes, the advisor flag is flipped to default ON, the bench + idle-eviction + perimeter hardening land, and deprecated envs are removed on the staged schedule. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5 of 5** of the embedding-stack hardening decomposition: validate the two-launcher residency live, flip the advisor flag on, benchmark the dtype, and close the perimeter + cleanup. This is the only phase that can close the spawn→bind + cold-load + perf items, and it gates the flag flip.

**Scope Boundary**: Add the live two-launcher integration test (gates the flag flip to default ON), the q8-vs-fp16/MPS bench, default-off idle eviction, socket-dir ownership + sun_path guard, and staged deprecated-env removal. Does NOT re-open earlier phases' code beyond the flag flip and perimeter touches.

**Dependencies**:
- Parent packet: `../spec.md`.
- Predecessor: 004-perf-instrumentation-batching; idle eviction gates on the phase-002 `lastSuccessfulEmbedAt`, the bench uses the phase-004 instrumentation, and the live test exercises the phase-001 shared socket.

**Deliverables**:
- Live two-launcher integration test (real node + real `hf-model-server` behind a CI lane): spawn→bind window, EADDRINUSE/wx races, SIGKILL reclaim, 404 contract end-to-end. Gates the flag flip — flip `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` to default ON once green.
- q8-vs-fp16 + MPS/CPU bench: measure p50/p95 + a small recall delta; make `DEFAULT_DTYPE` device-aware via `HF_EMBEDDINGS_DTYPE` only if fp16/MPS wins.
- Idle eviction: `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` (default 0/off), gated on `lastSuccessfulEmbedAt`; keep demand re-arm so re-spawn stays lazy.
- Perimeter hardening: socket-dir ownership (fstat uid-owned, reject symlinks, assert ownership before EADDRINUSE reclaim `model-server-supervision.cjs:882-896`); `sun_path > 104` fail-fast + ENV row.
- Staged deprecated-env removal: delete the 2 dead `SPECKIT_EMBEDDER_SIDECAR_*` doc rows now; keep `SPECKIT_EMBEDDER_EXECUTION` warn-once one release then remove fn+row+test together; drop dead `RERANKER_CANONICAL` (`registry.ts:181-194`).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cross-launcher residency, spawn→bind window, real EADDRINUSE/wx races, SIGKILL reclaim, and the 404 contract have never been validated live, so `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` stays default OFF. The dtype choice is unmeasured, idle eviction does not exist, the socket dir is not ownership-checked before reclaim, an over-long `sun_path` is not caught fast, and dead/deprecated envs (`SPECKIT_EMBEDDER_SIDECAR_*`, `SPECKIT_EMBEDDER_EXECUTION`, `RERANKER_CANONICAL`) still linger.

### Purpose
Validate the two-launcher residency live and flip the advisor flag on, benchmark the dtype on the real device, add safe default-off idle eviction, harden the socket perimeter, and remove dead/deprecated envs on a staged schedule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Live two-launcher integration test (real node + real `hf-model-server`): spawn→bind window, EADDRINUSE/wx races, SIGKILL reclaim, 404 contract end-to-end. Gates the flag flip.
- Flip `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` to default ON once the live test is green.
- q8-vs-fp16 + MPS/CPU bench; device-aware `DEFAULT_DTYPE` via `HF_EMBEDDINGS_DTYPE` only if fp16/MPS wins.
- Idle eviction: `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` (default 0/off), gated on `lastSuccessfulEmbedAt`; demand re-arm stays lazy.
- Socket-dir ownership (fstat uid-owned, reject symlinks, assert ownership before EADDRINUSE reclaim `model-server-supervision.cjs:882-896`); `sun_path > 104` fail-fast + ENV row.
- Staged deprecated-env removal: delete 2 dead `SPECKIT_EMBEDDER_SIDECAR_*` doc rows; `SPECKIT_EMBEDDER_EXECUTION` warn-once one release then remove fn+row+test; drop dead `RERANKER_CANONICAL` (`registry.ts:181-194`).

### Out of Scope
- Re-opening phases 001-004 code beyond the flag flip and perimeter touches.
- Multi-model residency.
- Removing `SPECKIT_EMBEDDER_EXECUTION` before its one-release warn-once window ends.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/tests/embedders/*live-two-launcher*.vitest.ts` | Add | Live integration test (CI lane): spawn→bind, EADDRINUSE/wx, SIGKILL reclaim, 404 contract |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Flip `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` to default ON once the live test is green |
| `.opencode/bin/hf-model-server.cjs` | Modify | Device-aware `DEFAULT_DTYPE` via `HF_EMBEDDINGS_DTYPE` (only if fp16/MPS wins) |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modify | Socket-dir ownership (fstat uid-owned, reject symlinks, assert before reclaim); `sun_path > 104` fail-fast; idle eviction on `lastSuccessfulEmbedAt` |
| `shared/embeddings/registry.ts` | Modify | Drop dead `RERANKER_CANONICAL` (`181-194`) |
| `ENV_REFERENCE.md` | Modify | Add `sun_path` + idle-eviction rows; stage `SPECKIT_EMBEDDER_SIDECAR_*` / `_EXECUTION` removal |
| bench scripts | Add | q8-vs-fp16 + MPS/CPU bench harness |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A live two-launcher test must exist and pass | A real node + real `hf-model-server` CI lane exercises the spawn→bind window, EADDRINUSE/wx races, SIGKILL reclaim, and the 404 contract end-to-end, and passes |
| REQ-002 | The advisor flag must flip ON only after the live test is green | `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` defaults to ON only once REQ-001 passes |
| REQ-003 | The socket perimeter must be hardened | The socket dir is fstat uid-owned with symlinks rejected and ownership asserted before EADDRINUSE reclaim, and a `sun_path > 104` path fails fast with an ENV row |
| REQ-004 | Idle eviction must be safe and default-off | `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` defaults to 0/off, evicts on `lastSuccessfulEmbedAt`, and keeps demand re-arm lazy |
| REQ-005 | Deprecated envs must be removed on a staged schedule | The 2 dead `SPECKIT_EMBEDDER_SIDECAR_*` rows are deleted now, `SPECKIT_EMBEDDER_EXECUTION` warns-once for one release before removal, and dead `RERANKER_CANONICAL` is dropped |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The dtype must be benchmarked before any change | A q8-vs-fp16 + MPS/CPU bench measures p50/p95 + a small recall delta; `DEFAULT_DTYPE` becomes device-aware only if fp16/MPS wins |
| REQ-007 | Live-vs-script status must be reported honestly | If this environment cannot run a live daemon + model download, the live test + bench ship as runnable scripts + gated code with measured-vs-script-only reported |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live two-launcher test exercises the spawn→bind window, races, SIGKILL reclaim, and 404 contract and passes (or ships as a runnable script with status reported).
- **SC-002**: `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` defaults ON only after the live test is green.
- **SC-003**: The socket perimeter rejects unowned/symlinked dirs and over-long `sun_path` before reclaim.
- **SC-004**: Idle eviction is default-off and safe, and dead/deprecated envs are removed on the staged schedule.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | This environment may not support a live daemon + model download | High | Ship the live test + bench as runnable scripts + gated code; report measured-vs-script-only honestly (REQ-007) |
| Risk | Flipping the advisor flag ON before the live test could ship a broken default | High | Gate the flip strictly on a green REQ-001 |
| Risk | Removing `SPECKIT_EMBEDDER_EXECUTION` too early could break consumers | Med | Keep warn-once for one release, then remove fn+row+test together |
| Risk | Ownership/symlink rejection could break legitimate shared-host setups | Med | Reject only unowned/symlinked dirs; keep the canonical path documented |
| Dependency | 004 instrumentation | High | The bench reads the phase-004 p50/p95 instrumentation |
| Dependency | 002 `lastSuccessfulEmbedAt` | High | Idle eviction gates on the phase-002 field |
| Dependency | 001 shared socket | High | The live test exercises the phase-001 pinned socket |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the live two-launcher test run in the default CI lane or a separate opt-in lane given its model-download cost?
- After the warn-once release, who owns scheduling the final `SPECKIT_EMBEDDER_EXECUTION` removal?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
**Given**
**Given**
**Given**
**Given**
**Given**
-->
