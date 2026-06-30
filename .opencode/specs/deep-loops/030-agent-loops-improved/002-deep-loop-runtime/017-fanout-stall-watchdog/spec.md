---
title: "Fanout Pool Stall-Watchdog Abort and Requeue"
description: "A hung lineage blocks all queued work until the hard child timeout expires; an opt-in stall-watchdog with abort-requeue settles the hung slot earlier through the existing failure_class:timeout retry ledger."
trigger_phrases:
  - "fanout stall watchdog"
  - "lag-ceiling abort-requeue"
  - "hung lineage abort"
  - "pool slot stall detection"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/002-deep-loop-runtime/017-fanout-stall-watchdog"
    last_updated_at: "2026-06-28T14:02:05Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/017-fanout-stall-watchdog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Fanout Pool Stall-Watchdog Abort and Requeue

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
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 18 |
| **Predecessor** | 016-llm-judge-hardening |
| **Successor** | 018-persisted-wait-crash-resume |
| **Handoff Criteria** | Opt-in `lagCeilingAction:"abort-requeue"` implemented; aborted items settle through `failure_class:"timeout"` retry ledger; default pool behavior unchanged; pool concurrency invariant holds after abort |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the deep-loop-runtime recs specification.

**Scope Boundary**: `fanout-pool.cjs` only — opt-in abort-requeue with lag-ceiling detection; no changes to default pool behavior or cross-process abort.

**Dependencies**:
- Existing `failure_class:"timeout"` retry ledger must be accessible from within the pool abort path
- Active-item slot structure must support attaching an abort handle

**Deliverables**:
- Opt-in `lagCeilingAction:"abort-requeue"` config field with explicit `lagCeilingMs` threshold requirement
- Active-item abort handles per slot
- Stall detection polling using the configured lag ceiling
- Settled aborted items through existing `failure_class:"timeout"` retry ledger

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A hung lineage blocks all queued work until the child timeout expires; no mechanism exists to detect a stall and free the slot sooner than the hard child timeout. All queued items behind a stalled slot wait even when the stall is clearly not making progress, reducing effective pool throughput to near zero during a hang. There are no abort handles on active pool items, so the slot cannot be freed programmatically without oversubscribing the pool.

### Purpose
Implement opt-in `lagCeilingAction:"abort-requeue"` so a stalled slot can be detected and aborted early, settling through the existing `failure_class:"timeout"` retry ledger without oversubscribing the pool.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Opt-in `lagCeilingAction:"abort-requeue"` config field; requires explicit `lagCeilingMs` threshold
- Active-item abort handles attached per slot on item start
- Stall detection using configurable lag ceiling; watchdog never activates when `lagCeilingAction` is absent
- Aborted items settled through existing `failure_class:"timeout"` retry ledger; pool active-slot count not incremented after abort (no oversubscription)

### Out of Scope
- Changing default pool behavior to abort-requeue — stays opt-in; changing the default risks unintended aborts on legitimately slow items
- Cross-process abort — requires out-of-band IPC; not in scope for this phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modify | Add opt-in stall-watchdog with abort handles and lag-ceiling detection |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `lagCeilingAction:"abort-requeue"` must require an explicit `lagCeilingMs` threshold; watchdog must never activate when `lagCeilingAction` is absent from config | Unit test: pool without `lagCeilingAction` — slow item runs to completion unaborted; pool with `lagCeilingAction` and exceeded threshold — item is aborted and requeued |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Aborted items must settle through the existing `failure_class:"timeout"` retry ledger; pool active-slot count must not increment after abort | Integration test: abort a stalled item; assert `failure_class:"timeout"` entry in retry ledger; assert pool concurrency invariant (active slots ≤ configured max) holds immediately after abort |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Without `lagCeilingAction` set, pool behavior is byte-for-byte identical to pre-patch behavior — confirmed by regression test comparing slot lifecycle events before and after the patch with default config.
- **SC-002**: With `lagCeilingAction:"abort-requeue"` and a lag ceiling of 5 seconds, a stalled item is aborted within one watchdog poll cycle after the ceiling is exceeded — confirmed by integration test with a mocked hanging item.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Aborting a stalled item that is actually making progress (just slow) causes unnecessary requeue and retry cost | Med | Require `lagCeilingAction` to be explicitly set with a `lagCeilingMs` threshold; never enable by default; document that low thresholds risk false-positive aborts |
| Evidence | `external/kasper/src/index.ts:365,424,438` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

> **Provenance:** research.md §5.1, (iter 24)

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
