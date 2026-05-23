---
title: "Spec: launcher lease acquisition-time reclaim [template:level_1/spec.md]"
description: "Follow-on packet for atomic acquisition-time reclaim when a new launcher encounters a stale skill_graph_daemon_lease row owned by a dead PID."
trigger_phrases:
  - "launcher lease acquisition reclaim"
  - "stale lease CAS"
  - "skill_graph_daemon_lease dead pid"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded planned packet from deep-research cleanup dispatch"
    next_safe_action: "Implement atomic acquisition reclaim and race regression"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: launcher lease acquisition-time reclaim

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `006-mcp-launcher-concurrency` |
| **Predecessor** | `006-mcp-launcher-concurrency/011-sun-path-and-stale-lease-followups/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 011 asked for a dead-PID liveness probe, but that read-path probe already exists in `lease.ts:226-247`. The remaining gap is acquisition-time reclaim: `lease.ts:300-317` reads an existing row, evaluates staleness/liveness, then writes a new lease. That probe-then-set sequence is not atomic, so two launchers can race on the same stale row.

### Purpose

Make stale lease acquisition safe by adding atomic reclaim semantics, or document why the local lease format cannot support compare-and-swap and implement the narrowest equivalent guard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add acquisition-time atomic reclaim for stale rows whose PID is dead.
- Use compare-and-swap semantics with PID/liveness predicate where the local SQLite lease format supports it.
- Add a race regression where two launchers contend for the same stale lease and exactly one wins.
- Ensure the loser detects contention and retries or reports a clean held-by-other result.

### Out of Scope

- Reworking the read-path `isLeaseHeld()` liveness probe that already exists at `lease.ts:226-247`.
- Changing unrelated socket bridge behavior from packets 010-012.
- Operator manual lease cleanup recipes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modify | Atomic acquisition-time reclaim at lines 300-317 |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/daemon/lease-acquisition-reclaim.vitest.ts` | Create/modify | Two-launcher stale lease race regression |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/daemon/fixtures/` | Use | Isolated lease DB fixtures for stale PID rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Acquisition path uses atomic stale reclaim semantics | `acquireSkillGraphLease()` cannot let two launchers both win a dead-PID stale row race |
| REQ-002 | CAS impossibility is documented if SQLite/local format blocks it | Implementation summary explains the fallback and why it preserves single-writer semantics |
| REQ-003 | Race regression covers two contenders on one stale lease | Exactly one contender acquires; the loser returns held/retry state without corrupting the row |
| REQ-004 | Read-path probe stays intact | `lease.ts:226-247` behavior for ESRCH and EPERM remains covered |
| REQ-005 | Launcher tests remain deterministic | No real daemon process or long sleeps required; test controls stale heartbeat/PID state |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A stale dead-PID lease can be reclaimed by one new launcher only.
- **SC-002**: A losing launcher observes a clean contention result and can retry.
- **SC-003**: Existing live-PID and EPERM protections still hold.
- **SC-004**: Strict validation exits 0.

### Acceptance Scenarios

- **Given** a lease DB row whose PID is dead and heartbeat is stale, **When** two launchers attempt acquisition concurrently, **Then** one launcher updates the row and the other detects contention cleanly
- **Given** a lease DB row whose PID is live or EPERM-protected, **When** a new launcher attempts acquisition, **Then** the existing owner remains protected and no reclaim occurs
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | PID liveness is inherently racy | PID reuse could make a dead owner appear live | Preserve startedAt/ownerId checks and prefer CAS on observed row fields |
| Risk | SQLite transaction semantics are misunderstood | False sense of atomicity | Use one transaction and an update predicate that includes the observed incumbent values |
| Dependency | Existing launcher lease DB schema | May not include enough fields for ideal CAS | Document fallback or add minimal predicate fields if in scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- If the local format cannot express PID-liveness inside SQL, should the implementation use observed-row CAS plus post-write verification? Proposed: yes.
<!-- /ANCHOR:questions -->
