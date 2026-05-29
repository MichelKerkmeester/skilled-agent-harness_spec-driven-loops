---
title: "Feature Specification: Add launcher supervision for the hf model server"
description: "Lazy-spawn the hf model server as a launcher-supervised sibling child with a second crash-loop guard, generalized RSS watchdog, modelServerPid lease field, health probe, and respawn lock."
trigger_phrases:
  - "launchModelServer"
  - "modelServerPid lease"
  - "probeModelServer"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-embedding-consolidation-hf-local-server/004-launcher-supervision"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deferred spec for launcher-owned lazy model-server supervision"
    next_safe_action: "Implement after hf-local can call the model server"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000294"
      session_id: "029-004-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "dependsOn: 003-hf-local-http-client."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Add launcher supervision for the hf model server

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Spec ready (implementation pending) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-hf-local-http-client |
| **Successor** | 005-retire-sidecar |
| **Handoff Criteria** | First embed can cause a launcher-owned model-server spawn. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4 of 6** of the embedding-consolidation and hf-local-server decomposition: Lazy-spawn the hf model server as a launcher-supervised sibling child with a second crash-loop guard, generalized RSS watchdog, modelServerPid lease field, health probe, and respawn lock.

**Scope Boundary**: launchModelServer() lazy sibling-child spawn from mk-spec-memory-launcher.cjs. Does NOT include Model-server endpoint implementation (phase 002).

**Dependencies**:
- Parent packet: `../spec.md`.
- dependsOn: 003-hf-local-http-client.

**Deliverables**:
- launchModelServer() lazy sibling-child spawn from mk-spec-memory-launcher.cjs.
- Second createCrashLoopGuard(getCrashLoopConfig()) and model-server relaunch timer.
- Generalized RSS watchdog with SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB and self-exit env.
- Additive modelServerPid lease field and signal teardown/reap.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A standalone model server solves the execution boundary but not lifecycle. Without launcher ownership, crash-loop handling, RSS enforcement, lease state, and dead-socket respawn would be reimplemented or absent, undermining the F1/F3 reuse mandate.

### Purpose
Have the launcher lazily spawn and supervise hf-model-server.cjs as a sibling child on first embed demand, using existing supervision algorithms with separate model-server state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- launchModelServer() lazy sibling-child spawn from mk-spec-memory-launcher.cjs.
- Second createCrashLoopGuard(getCrashLoopConfig()) and model-server relaunch timer.
- Generalized RSS watchdog with SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB and self-exit env.
- Additive modelServerPid lease field and signal teardown/reap.
- probeModelServer(socketPath) plus hf-embed-respawn.lock for dead-socket race serialization.

### Out of Scope
- Model-server endpoint implementation (phase 002).
- HTTP client rewrite (phase 003).
- Deleting sidecar router/files (phase 005).
- Detached background model server ownership.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | `Add lazy spawn, second guard/timer, generalized watchdog, lease pid, and teardown` |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify | Add model-server probe and respawn lock path |
| `mcp_server/tests/*launcher*.vitest.ts` | `Modify/Add` | Lazy spawn, guard, watchdog, lease, signal, and probe tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Model server must be launcher-owned but lazy | Read-only sessions do not spawn it; first embed demand spawns a sibling child through the launcher |
| REQ-002 | Crash-loop supervision must reuse the existing decision tree | A second guard drives superviseChildExit() with backoff and give-up behavior |
| REQ-003 | RSS watchdog must target the model-server pid | Generalized watchdog samples the model-server process tree and honors model-server env ceilings |
| REQ-004 | Lease state must record modelServerPid | Lease payload adds the field without breaking existing child pid consumers |
| REQ-005 | Signal teardown must reap the model server | `SIGINT/SIGTERM/SIGHUP/SIGQUIT cascade clears lease and reaps model server process tree` |
| REQ-006 | Bridge liveness must treat loading as alive | `probeModelServer returns alive for health ready or loading; error/connect failure is dead` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Dead-socket respawn must be single-winner | `hf-embed-respawn.lock ports wx stale-lock semantics keyed by socket` |
| REQ-008 | Respawn must reap stale pid before relaunch | `modelServerPid is terminated/reaped before a new model server starts` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: First embed can cause a launcher-owned model-server spawn.
- **SC-002**: Crash-loop, RSS, lease, signal, and probe behaviors are covered with focused tests.
- **SC-003**: Loading health state is considered alive.
- **SC-004**: No detached model-server process is introduced.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Launcher state surface grows and becomes hard to reason about | High | Instantiate existing guard/watchdog patterns instead of copying algorithms |
| Risk | Lazy first-embed spawn can race across consumers | High | Use socket-keyed respawn lock and existing single-winner lease assumptions |
| Risk | RSS watchdog could watch the wrong process | Med | Require target pid parameter and tests against modelServerPid |
| Dependency | Phase 003 client readiness | High | Client must retry while launcher spawns and server loads |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should first-embed demand signal the launcher through an existing lease/state channel or a tiny request listener?
- What is the initial default for SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB?
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
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

