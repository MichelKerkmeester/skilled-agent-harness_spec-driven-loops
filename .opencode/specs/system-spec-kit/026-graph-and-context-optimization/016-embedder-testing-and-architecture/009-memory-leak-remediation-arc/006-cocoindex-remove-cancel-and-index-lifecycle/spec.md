---
title: "Spec: CocoIndex Remove, Cancel, and Index Lifecycle"
description: "The code-index audit found that remove/close can race active indexing and that index operations lack a real protocol cancel surface. Background indexing tasks can be unowned or weakly reported."
trigger_phrases:
  - "cocoindex-remove-cancel-and-index-lifecycle"
  - "memory leak 6"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/006-cocoindex-remove-cancel-and-index-lifecycle"
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
      fingerprint: "sha256:0606060606060606060606060606060606060606060606060606060606060606"
      session_id: "009-memory-leak-remediation-arc-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: CocoIndex Remove, Cancel, and Index Lifecycle

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
| **Phase** | 6 of 10 |
| **Predecessor** | 005-expected-daemon-classifier-and-process-sweep |
| **Successor** | 007-code-graph-launcher-and-db-lifecycle |
| **Handoff Criteria** | remove-during-index, load-time cancel, stale cancel identity, threadpool shutdown, post-remove search/index usability |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 6 of the memory leak remediation arc. It is scoped from source evidence in `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research` and `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`.

**Scope Boundary**: Fix CocoIndex remove-project safety, per-index cancel identity, and daemon/MCP background indexing ownership.

**Dependencies**:
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/002-telemetry-and-process-verification-harness`
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/005-expected-daemon-classifier-and-process-sweep`

**Deliverables**:
- Make remove_project cancel and bounded-await active index work before registry removal
- Add request/index cancellation identity and protocol handling
- Track daemon and MCP background indexing tasks with visible errors

**Changelog**:
- When this phase closes, refresh the parent arc status and note validation evidence in the phase implementation summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-index audit found that remove/close can race active indexing and that index operations lack a real protocol cancel surface. Background indexing tasks can be unowned or weakly reported.

### Purpose
Fix CocoIndex remove-project safety, per-index cancel identity, and daemon/MCP background indexing ownership.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make remove_project cancel and bounded-await active index work before registry removal
- Add request/index cancellation identity and protocol handling
- Track daemon and MCP background indexing tasks with visible errors

### Out of Scope
- Adapter cache cleanup
- Code-graph launcher ownership

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/` | Modify/Create | Implementation surface for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | remove_project cannot close resources under active explicit, load-time, or queued index work | Evidence is captured in this phase's implementation summary and passes the phase verification command set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Clients can cancel a specific index request without whole-daemon stop | Tests or documented verification prove the behavior without relying on broad process-kill patterns. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: remove-during-index, load-time cancel, stale cancel identity, threadpool shutdown, post-remove search/index usability.
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
