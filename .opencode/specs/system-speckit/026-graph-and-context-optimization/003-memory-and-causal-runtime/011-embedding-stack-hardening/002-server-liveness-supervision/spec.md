---
title: "Feature Specification: Server liveness + supervision hardening"
description: "Add wedged-but-loading detection, inference-liveness health fields with a bounded dispose-drain, a crash-loop give-up cooldown, and ENOSPC-resilient pid/lease/lock writes so the model server fails safe under wedges, hangs, crash loops, and disk-full."
trigger_phrases:
  - "wedged but loading detection"
  - "inference liveness health fields"
  - "crash-loop cooldown ENOSPC resilient writes"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/002-server-liveness-supervision"
    last_updated_at: "2026-05-29T11:46:56Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified phase 002 server liveness + supervision hardening"
    next_safe_action: "Continue to successor phase 003-observability-model-switch when ready"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003121"
      session_id: "031-002-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Predecessor: 001-selector-and-shared-socket (depends on the shared socket)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Server liveness + supervision hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete — implemented and verified |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-selector-and-shared-socket |
| **Successor** | 003-observability-model-switch |
| **Handoff Criteria** | A stuck cold-load is reaped, health reflects inference liveness with a bounded dispose-drain, and crash loops give up under a cooldown with ENOSPC-resilient pid/lease/lock writes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2 of 5** of the embedding-stack hardening decomposition: make the model server fail safe under wedges, hung inference, crash loops, and disk-full. These are the silent-failure killers — a server that looks alive but is not.

**Scope Boundary**: Add loading-age and inference-liveness health fields, bound the dispose-drain, persist a crash-loop give-up cooldown, and make launcher pid/lease/lock writes survive ENOSPC. Does NOT include observability surfaces, model-switch, perf, or batching (later phases).

**Dependencies**:
- Parent packet: `../spec.md`.
- Predecessor: 001-selector-and-shared-socket — supervision coordination depends on the shared socket pinned in phase 001.

**Deliverables**:
- Add `loadStartedAt` to the server `healthPayload` and bound the loading-age in `probeModelServer`/`prepareModelServerDemandTarget` so a stuck cold-load is reaped.
- Add `lastSuccessfulEmbedAt` + `inFlightRawRuns.size` to the health payload and bound the dispose-drain down from 120s.
- Persist a crash-loop "give-up until" cooldown and return 503 with reason during cooldown.
- Make pid/lease/lock writes catch `ENOSPC`/`EDQUOT`/`EROFS` and degrade to no-respawn/report + tmp cleanup instead of crashing the launcher.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The supervision layer cannot tell a healthy server from a wedged one. `launcher-ipc-bridge.cjs:239-240` treats `loading` as alive forever, so a stuck cold-load is never reaped. Health (`hf-model-server.cjs:543-547`) reflects only `serverState`, so a hung native inference run keeps reporting `ready`. The demand-listener re-arm (`model-server-supervision.cjs:655-658` → launch @854-865) can spawn-storm a deterministic failure with no give-up. And pid/lease/lock writes (`model-server-supervision.cjs:429-431`, `mk-spec-memory-launcher.cjs:351/374-380`) crash the launcher on disk-full instead of degrading.

### Purpose
Make the server fail safe: reap stuck cold-loads, reflect real inference liveness in health, give up on crash loops under a cooldown, and survive disk-full without crashing the launcher.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `loadStartedAt` to the health payload; bound the loading-age in `probeModelServer`/`prepareModelServerDemandTarget`.
- Add `lastSuccessfulEmbedAt` + `inFlightRawRuns.size` to the health payload; bound the dispose-drain down from 120s.
- Persist a crash-loop give-up cooldown; return 503 with reason during cooldown.
- Make pid/lease/lock writes catch `ENOSPC`/`EDQUOT`/`EROFS` → degrade to no-respawn/report + tmp cleanup.

### Out of Scope
- Read-only observability route or `embedder_status` surface (phase 003).
- Model-switch allowlist, 404 loadedModel surfacing, or dim-drift warn (phase 003).
- Perf instrumentation rollups, batching, latch, or cache (phase 004).
- Live two-launcher validation or the advisor flag flip (phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/hf-model-server.cjs` | Modify | Add `loadStartedAt`, `lastSuccessfulEmbedAt`, `inFlightRawRuns.size` to the health payload; bound the dispose-drain down from 120s |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify | Bound the loading-age in `probeModelServer`/`prepareModelServerDemandTarget` so a stuck cold-load is reaped |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modify | Persist a crash-loop give-up cooldown; ENOSPC/EDQUOT/EROFS-resilient pid/lease/lock writes |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | ENOSPC-resilient lease/lock writes; degrade to no-respawn/report + tmp cleanup |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A stuck cold-load must be reaped | `loadStartedAt` is in the health payload and `probeModelServer`/`prepareModelServerDemandTarget` reap a server whose loading-age exceeds the bound instead of treating `loading` as alive forever |
| REQ-002 | Health must reflect inference liveness | The payload reports `lastSuccessfulEmbedAt` and `inFlightRawRuns.size`, and a hung native run no longer keeps `ready` indefinitely |
| REQ-003 | The dispose-drain must be bounded | The dispose-drain is bounded down from 120s so shutdown cannot hang on a stuck run |
| REQ-004 | Crash loops must give up under a cooldown | A persisted "give-up until" cooldown stops the demand re-arm from spawn-storming a deterministic failure; requests during cooldown return 503 with the reason |
| REQ-005 | Disk-full must not crash the launcher | pid/lease/lock writes catch `ENOSPC`/`EDQUOT`/`EROFS` and degrade to no-respawn/report + tmp cleanup |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The loading-age bound must not falsely reap a slow download | The bound is large enough to tolerate a first-embed model download and pairs with the phase-003 cold-start timeout alignment |
| REQ-007 | Cooldown state must clear cleanly on recovery | Once the failure clears, the cooldown is cleared so normal lazy re-spawn resumes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A server stuck in `loading` past the bound is reaped instead of being treated as alive forever.
- **SC-002**: A hung native inference run is visible in health via `inFlightRawRuns.size` and a stale `lastSuccessfulEmbedAt`.
- **SC-003**: A deterministic crash loop gives up under cooldown and returns 503 with a reason rather than spawn-storming.
- **SC-004**: A disk-full condition degrades to no-respawn/report instead of crashing the launcher.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An over-tight loading-age bound could reap a legitimately slow download | High | Size the bound to tolerate a first-embed download; pair with phase-003 cold-start alignment |
| Risk | Cooldown could strand a recoverable server | Med | Clear the cooldown on recovery (REQ-007) and keep demand re-arm lazy |
| Risk | ENOSPC degrade path could mask a persistent disk problem | Med | Report the degrade explicitly and clean up tmp so the operator sees the cause |
| Dependency | 001 shared socket | High | Cross-launcher supervision coordination assumes one resolved socket |
| Dependency | 029 supervision lib (RSS watchdog, crash-loop guard) | High | Reuse the shipped primitives rather than reinventing them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the right default loading-age bound that tolerates a cold model download without stranding a wedged load?
- Should the give-up cooldown duration be fixed or back off exponentially across repeated crash loops?
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
