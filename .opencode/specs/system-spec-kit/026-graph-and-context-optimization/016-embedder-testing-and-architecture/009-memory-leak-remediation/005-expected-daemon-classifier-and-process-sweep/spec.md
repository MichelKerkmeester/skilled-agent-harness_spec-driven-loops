---
title: "Spec: Expected Daemon Classifier and Process Sweep"
description: "Both packets warn that broad kill commands can either miss detached helpers or terminate legitimate warm services. Cleanup needs exact process/resource identity, dry-run reports, and explicit confirmation."
trigger_phrases:
  - "expected-daemon-classifier-and-process-sweep"
  - "memory leak 5"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep"
    last_updated_at: "2026-05-22T13:13:51Z"
    last_updated_by: "opencode"
    recent_action: "completed-phase-005-daemon-classifier-sweep"
    next_safe_action: "start-006-cocoindex-remove-cancel"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0505050505050505050505050505050505050505050505050505050505050505"
      session_id: "009-memory-leak-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Expected Daemon Classifier and Process Sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-05-22 |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 10 |
| **Predecessor** | 004-deep-loop-locks-state-and-recovery |
| **Successor** | 006-cocoindex-remove-cancel-and-index-lifecycle |
| **Handoff Criteria** | Fixture process tables for ancestors, EPERM, stale PIDs, sidecars, ccc daemons, browser sessions |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 5 of the memory leak remediation arc. It is scoped from source evidence in `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research` and `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`.

**Scope Boundary**: Provide a safe inventory-first cleanup surface for daemons, sidecars, browser tooling, and CLI leftovers.

**Dependencies**:
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness`

**Deliverables**:
- Classify expected daemons, stale helpers, unknown owners, and current-session processes
- Produce dry-run reports with PID, parent, age, command, and resource identity
- Gate destructive cleanup by exact PID/resource identity

**Changelog**:
- When this phase closes, refresh the parent arc status and note validation evidence in the phase implementation summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Both packets warn that broad kill commands can either miss detached helpers or terminate legitimate warm services. Cleanup needs exact process/resource identity, dry-run reports, and explicit confirmation.

### Purpose
Provide a safe inventory-first cleanup surface for daemons, sidecars, browser tooling, and CLI leftovers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Classify expected daemons, stale helpers, unknown owners, and current-session processes
- Produce dry-run reports with PID, parent, age, command, and resource identity
- Gate destructive cleanup by exact PID/resource identity

### Out of Scope
- Pattern-based `pkill -f` cleanup
- Automatic termination of healthy unknown-owner services

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/mcp-coco-index/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/system-rerank-sidecar/` | Modify/Create | Implementation surface for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Process sweep defaults to inventory and refuses unsafe destructive actions | Evidence is captured in this phase's implementation summary and passes the phase verification command set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Expected daemons and leaked helpers are classified separately | Tests or documented verification prove the behavior without relying on broad process-kill patterns. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fixture process tables for ancestors, EPERM, stale PIDs, sidecars, ccc daemons, browser sessions.
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
