---
title: "Feature Specification: Phase 3: reap-orphaned-model-server"
description: "A launcher that dies leaves its model server loaded with no owner, and the next launcher backs off from it, so it never unloads. This phase makes a starting supervisor reap a model server whose parent is PID 1, after confirming it really is the model server, so a supervised one takes its place."
trigger_phrases:
  - "reap orphaned model server"
  - "orphaned hf model server"
  - "model server parent pid 1"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: reap-orphaned-model-server

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `main` (planning only) |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-lighter-advisor-launcher |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met or closed by a recorded decision, and strict validation of this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Advisor daemon memory specification.

**Scope Boundary**: What a starting supervisor does when the recorded model server is alive but orphaned. Supervised servers, the eviction timer and the model server itself do not change.

**Dependencies**:
- Phase 001, whose idle eviction applies only to a supervised server.
- The reap path `reapRecordedModelServerBeforeRespawn` and `readProcessParentPid` in `.skilled/bin/lib/model-server-supervision.cjs`.

**Deliverables**:
- An orphan check in `prepareModelServerDemandTarget`.
- Tests for orphaned, supervised, reused-PID and unreadable-parent cases.
- A live run that kills a launcher and watches the next one reap its model server.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When the launcher dies by SIGKILL or an uncaught exception, its model server keeps running: the launcher's `uncaughtException` handler clears only the leases (`system-skill-advisor-launcher.cjs:1489-1496`). The next launcher's demand listener probes the shared socket, finds the server alive and returns `model-server-alive` without listening (`model-server-supervision.cjs:1318-1320`). Nothing supervises that server, so the 10-minute idle eviction from phase 001 never applies, and it holds about 470 MB until someone kills it.

### Purpose
A model server is never left without an owner for longer than it takes the next launcher to start.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- In `prepareModelServerDemandTarget`, when the probe says alive: read the recorded model server pid; when that process is alive, its parent is PID 1 and its command runs `hf-model-server.cjs`, log it and continue into the existing respawn-lock and reap path instead of returning `model-server-alive`.
- Do not arm the crash-loop give-up cooldown for this reap.
- Make the parent and command lookups injectable for tests.

### Out of Scope
- A model server owned by a live launcher (any parent other than 1).
- Adopting the orphan instead of reaping it: a process cannot receive exit events for a non-child.
- A periodic sweep; the check runs when a supervisor starts its demand listener.
- A `tcp://` model server address. That branch takes the respawn lock without probing, so it never sees a live orphan; the doctor orphan check still reports one.
- Telling a launcher-orphaned server from one an init system runs on the shared socket. Only the launcher writes the pid file, so this needs PID reuse; `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP=0` turns the reap off for such a setup.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/lib/model-server-supervision.cjs` | Modify | Orphan check in the demand preflight |
| `launcher-model-server-idle-eviction.vitest.ts` or a new supervision test | Modify / Create | Orphan, supervised, reused-PID and unreadable-parent cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A starting supervisor reaps an alive recorded model server whose parent is PID 1 and whose command runs `hf-model-server.cjs`, then listens for demand as usual. |
| REQ-002 | A model server whose parent is not PID 1, a recorded pid whose command is not the model server, or a parent that cannot be read is never signalled. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The reap does not arm the crash-loop give-up cooldown. |
| REQ-004 | A live run shows a killed launcher's model server reaped by the next launcher, and the next embedding served by a supervised server. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After `kill -9` of a launcher, starting the advisor again leaves no model server with parent PID 1.
- **SC-002**: The supervision suites pass with the new cases.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A reused PID is signalled | High | Check the command runs `hf-model-server.cjs` right before the reap |
| Risk | An embedding in flight on the orphan fails | Low | The hf-local client retries a reset connection and the demand path respawns |
| Dependency | `ps` reads the parent pid | Unreadable parent means no reap | Fail closed |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The extra check costs two `ps` reads, only when the probe finds a live server.

### Security
- **NFR-S01**: Never signal a pid without a matching command.

### Reliability
- **NFR-R01**: Any lookup failure keeps the current back-off behaviour.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Recorded pid missing or invalid: back off as today.
- Recorded pid alive with a live launcher parent: back off as today.

### Error Scenarios
- `ps` fails or times out: back off, never reap.
- The orphan exits during the reap: the existing reap treats it as already dead.

### State Transitions
- Two launchers start at once: the respawn lock lets one reap and listen; the other loses cleanly.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One preflight branch and its tests |
| Risk | 12/25 | Signals a process on another launcher's socket |
| Research | 6/20 | Reap path and lock already exist |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
