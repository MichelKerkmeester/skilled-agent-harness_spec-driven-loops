---
title: "Spec: Code Graph Launcher and DB Lifecycle"
description: "The code-index audit found stale/orphan-prone launcher and server ownership. Duplicate owners can contend for the same SQLite graph DB and shutdown does not always prove `closeDb()` ran."
trigger_phrases:
  - "code-graph-launcher-and-db-lifecycle"
  - "memory leak 7"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/032-code-graph-scatter/015-code-graph-launcher-and-db-lifecycle"
    last_updated_at: "2026-05-22T13:49:32Z"
    last_updated_by: "opencode"
    recent_action: "completed-phase-007-code-graph-launcher-and-db-lifecycle"
    next_safe_action: "start-008-sidecar-local-model-and-adapter-lifecycle"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0707070707070707070707070707070707070707070707070707070707070707"
      session_id: "009-memory-leak-remediation-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Code Graph Launcher and DB Lifecycle

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
| **Phase** | 7 of 10 |
| **Predecessor** | 006-cocoindex-remove-cancel-and-index-lifecycle |
| **Successor** | 008-sidecar-local-model-and-adapter-lifecycle |
| **Handoff Criteria** | Same-effective-DB, symlink, EPERM, PPID-1 orphan, child-survival, closeDb fixtures |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 7 of the memory leak remediation arc. It is scoped from source evidence in `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research` and `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`.

**Scope Boundary**: Enforce one code-graph launcher/server owner per effective graph DB and close DB handles on shutdown.

**Dependencies**:
- `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness`
- `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep`

**Deliverables**:
- Canonicalize effective DB identity
- Handle stale owners, orphan children, EPERM liveness, and symlink aliases
- Close DB handles on all shutdown paths

**Changelog**:
- When this phase closes, refresh the parent arc status and note validation evidence in the phase implementation summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-index audit found stale/orphan-prone launcher and server ownership. Duplicate owners can contend for the same SQLite graph DB and shutdown does not always prove `closeDb()` ran.

### Purpose
Enforce one code-graph launcher/server owner per effective graph DB and close DB handles on shutdown.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Canonicalize effective DB identity
- Handle stale owners, orphan children, EPERM liveness, and symlink aliases
- Close DB handles on all shutdown paths

### Out of Scope
- CocoIndex daemon cancel behavior
- Read-path performance optimization beyond lifecycle friction

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/system-code-graph/mcp_server/` | Modify/Create | Implementation surface for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Only one live owner serves a canonical graph DB directory | Evidence is captured in this phase's implementation summary and passes the phase verification command set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Shutdown closes graph DB handles and classifies stale/orphaned owners safely | Tests or documented verification prove the behavior without relying on broad process-kill patterns. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Same-effective-DB, symlink, EPERM, PPID-1 orphan, child-survival, closeDb fixtures.
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
