---
title: "Loop-Lock Heartbeat Cadence Hardening"
description: "Add an owner-scoped heartbeat driver to loop-lock.ts so a slow-but-live loop continuously refreshes its advisory lock and is distinguishable from a stale dead one."
trigger_phrases:
  - "loop-lock heartbeat"
  - "refresh-loop-lock cadence"
  - "lock heartbeat hardening"
  - "loop lock liveness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/007-loop-lock-heartbeat-hardening"
    last_updated_at: "2026-06-28T14:01:57Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-loop-lock-heartbeat-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Loop-Lock Heartbeat Cadence Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 18 |
| **Predecessor** | 006-jsonl-lock-held-merge |
| **Successor** | 008-loop-lock-single-flight-decision |
| **Handoff Criteria** | Heartbeat driver wired and verified; `phase`/`lastActivityIso` fields present in lock metadata |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the deep-loop-runtime recs specification.

**Scope Boundary**: Changes are confined to `loop-lock.ts`; no changes to the fanout runner or convergence logic.

**Dependencies**:
- `refreshLoopLock` already exists in `loop-lock.ts` and accepts the owner token — no signature changes needed.

**Deliverables**:
- Owner-scoped heartbeat driver function in `loop-lock.ts` that calls `refreshLoopLock` on a configurable cadence.
- Pause-aware metadata fields (`phase`, `lastActivityIso`) added to the lock record so a paused loop is distinguishable from a dead one.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`refreshLoopLock` exists in `loop-lock.ts` but no caller invokes it while dispatch is running; a loop that is slow but alive will let its advisory lock expire on the configured TTL. A second process polling the lock sees an expired record and may steal the lock and start a concurrent instance. There is no `phase` or `lastActivityIso` field, so a paused loop is indistinguishable from a dead one.

### Purpose
Ensure that a live loop owner continuously renews its lock during dispatch so that the lock expiry correctly signals a truly dead process, not a slow one; and expose `phase`/`lastActivityIso` fields so external tooling can distinguish paused from dead.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `startHeartbeat(ownerToken, intervalMs)` and `stopHeartbeat()` functions in `loop-lock.ts` that call `refreshLoopLock` on the given cadence while dispatch is active.
- Add `phase` (string) and `lastActivityIso` (ISO-8601 timestamp) to the lock metadata type and write them on each heartbeat tick.
- Default heartbeat interval constant set to `15_000` ms (well below the default lock TTL of 60 s).

### Out of Scope
- Socket-bind single-flight supplementary guard — deferred to phase 008.
- Changes to fanout-run.cjs or convergence.cjs — outside this phase's blast radius.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` | Modify | Add heartbeat driver, `phase`/`lastActivityIso` metadata fields |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `startHeartbeat` calls `refreshLoopLock` with the owner token on the configured cadence while dispatch is active | Unit test: mock `refreshLoopLock`, call `startHeartbeat`, advance timers by 3 × interval, assert 3 refresh calls; `stopHeartbeat` cancels the timer |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Lock metadata record includes `phase` (string) and `lastActivityIso` (ISO-8601) fields updated on each heartbeat tick | Read the lock file after a heartbeat tick; both fields are present and `lastActivityIso` matches the tick timestamp within ±1 s |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A loop running for 3 × lock TTL without explicit refresh does not lose its lock when the heartbeat driver is active (verified by integration test advancing the clock and asserting lock still held by original owner).
- **SC-002**: Reading the lock record for a paused loop shows `phase: "paused"` and a `lastActivityIso` within the last heartbeat interval, while a dead loop's lock has expired entirely — distinguishable without guessing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Heartbeat driver itself crashes or is GC'd, letting the lock expire on a live loop | Med | Keep heartbeat interval well below lock TTL (default 15 s vs 60 s TTL); log heartbeat errors without throwing so the loop continues |
| Evidence | `external/loop-cli-main/src/core/loop-controller.ts:266,333,451`; `manager.ts:257` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iters 17, 47)

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
