---
title: "Feature Specification: Phase 2: lighter-advisor-launcher"
description: "Each checkout runs an advisor launcher of about 53 MB next to its advisor server, and a bare Node process alone is 47 MB, so trimming the launcher saves little. This phase decides whether the advisor server can take over the launcher's job so one process remains, and builds it only on a go."
trigger_phrases:
  - "lighter advisor launcher"
  - "advisor launcher memory"
  - "fold launcher into advisor server"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: lighter-advisor-launcher

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-21 |
| **Branch** | `main` (planning only) |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-hf-model-server-idle-default |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met or closed by a recorded decision, and strict validation of this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Advisor daemon memory specification.

**Scope Boundary**: Whether the launcher's owner lease and model server supervision can move into the advisor server, and the change itself on a go. The advisor's routing behaviour does not change.

**Dependencies**:
- Phase 001, so the model server already unloads when idle and the remaining cost is the two Node processes.
- The owner lease code in `.skilled/bin/system-skill-advisor-launcher.cjs` (`acquireOwnerLeaseFile`, `classifyOwnerLease`, the lease heartbeat timer).

**Deliverables**:
- A go or no-go decision with measurements, recorded in `decision-record.md`.
- On a go: one process per checkout instead of two, with the lease and supervision behaviour kept.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 2026-10-21 audit measured the launcher at about 53 MB and the advisor server at 62 to 100 MB for each checkout, with one pair per checkout and worktree that ran an advisor query. A bare `node -e` process measures 47 MB on the same machine, so the launcher's own logic is about 6 MB. Trimming its code cannot save much; only removing the process saves about 50 MB per checkout.

### Purpose
Decide on evidence whether the launcher process can go, and either fold its job into the advisor server or record why it stays.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Map what the launcher does: owner lease, heartbeat, idle exit, model server supervision, respawn.
- Measure both processes and a bare Node process on this machine.
- Decide go or no-go in `decision-record.md`, with the failure cases the launcher protects against.
- On a go: move the lease and supervision into the advisor server and keep the launcher entry point as a thin exec for existing callers.

### Out of Scope
- Changing advisor routing, scoring or the daemon protocol.
- The model server idle default; phase 001 owns it.
- Sharing one advisor daemon across checkouts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify (on go) | Becomes a thin exec, or stays as is on a no-go |
| Advisor server entry under `.skilled/skills/system-skill-advisor/runtime/` | Modify (on go) | Owns the lease heartbeat and model server supervision |
| `decision-record.md` (this folder) | Create | The go or no-go decision and its measurements |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A go or no-go decision exists in `decision-record.md`, with measured RSS for the launcher, the advisor server and a bare Node process. |
| REQ-002 | On a go, a checkout runs one advisor process, and owner lease takeover, idle exit and model server respawn behave as before. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | On a go, the existing launcher tests pass or are moved to the server with the same cases. |
| REQ-004 | On a no-go, the decision names the failure case that keeps the launcher and closes the phase without code changes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The decision is recorded with numbers, and either about 50 MB per checkout is saved or the reason it cannot be is written down.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The launcher isolates the server from crashes, and folding it loses that | High | Map every recovery path before deciding; a lost recovery path means no-go |
| Risk | Two sessions race for the owner lease after the change | Med | Keep the lease file format and its tests |
| Dependency | Phase 001 lands first | Measurements mix model memory into the result | Measure after 001 |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: On a go, the per-checkout advisor RSS drops by at least 40 MB.

### Security
- **NFR-S01**: The lease file keeps its permissions and its stale-owner checks.

### Reliability
- **NFR-R01**: A crashed advisor server is still restarted or cleaned up the way the launcher does today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A checkout with a stale lease from a dead launcher.
- Two sessions in one checkout starting at once.

### Error Scenarios
- The advisor server crashes while holding the lease.
- The model server fails to respawn after an eviction.

### State Transitions
- An older launcher still running when the new code lands.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two processes and their lease protocol |
| Risk | 12/25 | Touches the daemon every session queries |
| Research | 10/20 | Recovery-path mapping and a go or no-go |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which recovery path, if any, needs a separate parent process?
- Do other tools exec the launcher path directly, so it must stay as an entry point?
<!-- /ANCHOR:questions -->

---
