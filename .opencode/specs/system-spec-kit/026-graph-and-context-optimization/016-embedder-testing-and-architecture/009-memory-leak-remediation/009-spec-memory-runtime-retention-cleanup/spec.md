---
title: "Spec: Spec Memory Runtime Retention Cleanup"
description: "The broad system-spec-kit audit found in-process retention risks inside memory scan, routing, search, ingest, retry, audit, and embedder paths. These can accumulate even without orphaned external processes."
trigger_phrases:
  - "spec-memory-runtime-retention-cleanup"
  - "memory leak 9"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup"
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
      fingerprint: "sha256:0909090909090909090909090909090909090909090909090909090909090909"
      session_id: "009-memory-leak-remediation-009"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Spec Memory Runtime Retention Cleanup

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
| **Phase** | 9 of 10 |
| **Predecessor** | 008-sidecar-local-model-and-adapter-lifecycle |
| **Successor** | 010-final-regression-and-operator-runbook |
| **Handoff Criteria** | Stress save/search/index workloads, pending-job caps, retry abort, lease cleanup, timer shutdown, audit rotation cap |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 9 of the memory leak remediation arc. It is scoped from source evidence in `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research` and `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`.

**Scope Boundary**: Bound Spec Kit Memory runtime leases, timers, caches, sessions, queues, retries, audits, and embedder sidecar cleanup.

**Dependencies**:
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness`
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery`

**Deliverables**:
- Add try/finally and shutdown cleanup for leases and timers
- Bound routing/search/session/queue/retry/audit retention
- Harden embedder sidecar timeout, parent-death, env, and shutdown policy

**Changelog**:
- When this phase closes, refresh the parent arc status and note validation evidence in the phase implementation summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The broad system-spec-kit audit found in-process retention risks inside memory scan, routing, search, ingest, retry, audit, and embedder paths. These can accumulate even without orphaned external processes.

### Purpose
Bound Spec Kit Memory runtime leases, timers, caches, sessions, queues, retries, audits, and embedder sidecar cleanup.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add try/finally and shutdown cleanup for leases and timers
- Bound routing/search/session/queue/retry/audit retention
- Harden embedder sidecar timeout, parent-death, env, and shutdown policy

### Out of Scope
- CocoIndex-specific daemon work
- Global model-provider changes outside Spec Kit Memory boundaries

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/system-spec-kit/scripts/` | Modify/Create | Implementation surface for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Spec Kit Memory runtime resources have explicit caps or cleanup paths | Evidence is captured in this phase's implementation summary and passes the phase verification command set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Embedder sidecar calls have timeout, env allowlist, and parent-death behavior | Tests or documented verification prove the behavior without relying on broad process-kill patterns. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Stress save/search/index workloads, pending-job caps, retry abort, lease cleanup, timer shutdown, audit rotation cap.
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
