---
title: "Spec: Deep Loop Locks, State, and Recovery"
description: "The broad audit found advisory locks without PID/TTL/heartbeat metadata, inconsistent deep-review locking, and JSONL state recovery gaps. Interrupted runs can lose provenance or double-dispatch."
trigger_phrases:
  - "deep-loop-locks-state-and-recovery"
  - "memory leak 4"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/004-deep-loop-locks-state-and-recovery"
    last_updated_at: "2026-05-22T10:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Scaffolded concrete phase scope for the memory leak remediation arc."
    next_safe_action: "Plan and execute this child phase when its predecessor handoff criteria pass."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0404040404040404040404040404040404040404040404040404040404040404"
      session_id: "009-memory-leak-remediation-arc-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Deep Loop Locks, State, and Recovery

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-22 |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 10 |
| **Predecessor** | 003-cli-dispatch-containment-and-recursion-guards |
| **Successor** | 005-expected-daemon-classifier-and-process-sweep |
| **Handoff Criteria** | Kill-during-append, corrupt-trailing-line, dead-PID lock, concurrent run fixtures |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 4 of the memory leak remediation arc. It is scoped from source evidence in `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research` and `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`.

**Scope Boundary**: Make deep-research, deep-review, council, and related loops interruption-safe.

**Dependencies**:
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/002-telemetry-and-process-verification-harness`
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/003-cli-dispatch-containment-and-recursion-guards`

**Deliverables**:
- Add owner PID, TTL, heartbeat, and stale-lock recovery
- Make JSONL/delta writes append-safe and repairable
- Normalize executor metadata to `kind` across state and audit records

**Changelog**:
- When this phase closes, refresh the parent arc status and note validation evidence in the phase implementation summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The broad audit found advisory locks without PID/TTL/heartbeat metadata, inconsistent deep-review locking, and JSONL state recovery gaps. Interrupted runs can lose provenance or double-dispatch.

### Purpose
Make deep-research, deep-review, council, and related loops interruption-safe.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add owner PID, TTL, heartbeat, and stale-lock recovery
- Make JSONL/delta writes append-safe and repairable
- Normalize executor metadata to `kind` across state and audit records

### Out of Scope
- Changing research findings content
- Replacing the deep-loop state machine wholesale

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/deep-research/` | Modify/Create | Spec evidence and docs |
| `.opencode/skills/deep-review/` | Modify/Create | Implementation surface for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Interrupted state can be reconstructed without duplicate iteration records | Evidence is captured in this phase's implementation summary and passes the phase verification command set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Concurrent same-packet deep-loop runs are blocked or safely resumed | Tests or documented verification prove the behavior without relying on broad process-kill patterns. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Kill-during-append, corrupt-trailing-line, dead-PID lock, concurrent run fixtures.
- **SC-002**: This phase updates the parent remediation map or implementation summary with evidence and next-phase handoff notes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Source research packets | Missing evidence can cause duplicate or misordered fixes. | Keep source links in every phase summary. |
| Risk | Cleanup work kills an expected warm daemon | Can interrupt unrelated user workflows. | Require inventory, exact identity, and dry-run proof before destructive cleanup. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; phase-specific questions must be recorded in this section before implementation begins.
<!-- /ANCHOR:questions -->
