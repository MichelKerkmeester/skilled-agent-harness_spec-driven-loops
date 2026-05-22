---
title: "Spec: Final Regression and Operator Runbook"
description: "Fixes across dispatch, locks, daemons, sidecars, code graph, CocoIndex, and memory runtime need one final regression story. Operators also need clear guidance for expected daemons and reboot-only Apple Silicon pressure."
trigger_phrases:
  - "final-regression-and-operator-runbook"
  - "memory leak 10"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook"
    last_updated_at: "2026-05-22T14:40:33Z"
    last_updated_by: "codex"
    recent_action: "completed-phase-010-final-regression-and-runbook"
    next_safe_action: "arc-009-closed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a"
      session_id: "009-memory-leak-remediation-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Final Regression and Operator Runbook

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
| **Phase** | 10 of 10 |
| **Predecessor** | 009-spec-memory-runtime-retention-cleanup |
| **Successor** | None |
| **Handoff Criteria** | Full harness replay, process baseline comparison, strict spec validation, memory index scan when available |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 10 of the memory leak remediation arc. It is scoped from source evidence in `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research` and `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`.

**Scope Boundary**: Prove the memory-leak remediation arc end-to-end and document operator recovery guidance.

**Dependencies**:
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards`
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery`
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep`
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle`
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle`
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle`
- `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup`

**Deliverables**:
- Run end-to-end process and memory regression checks
- Document safe cleanup/recovery commands and no-action cases
- Record reboot-only pressure guidance and final evidence links

**Changelog**:
- When this phase closes, refresh the parent arc status and note validation evidence in the phase implementation summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Fixes across dispatch, locks, daemons, sidecars, code graph, CocoIndex, and memory runtime need one final regression story. Operators also need clear guidance for expected daemons and reboot-only Apple Silicon pressure.

### Purpose
Prove the memory-leak remediation arc end-to-end and document operator recovery guidance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run end-to-end process and memory regression checks
- Document safe cleanup/recovery commands and no-action cases
- Record reboot-only pressure guidance and final evidence links

### Out of Scope
- New functional features after remediation closes
- Changing earlier phase acceptance criteria without evidence

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/` | Modify/Create | Spec evidence and docs |
| `.opencode/skills/system-spec-kit/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/mcp-coco-index/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/system-code-graph/` | Modify/Create | Implementation surface for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All P0/P1 memory/process lifecycle phases have validation evidence | Evidence is captured in this phase's implementation summary and passes the phase verification command set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Operator runbook distinguishes safe cleanup from reboot-only pressure | Tests or documented verification prove the behavior without relying on broad process-kill patterns. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Full harness replay, process baseline comparison, strict spec validation, memory index scan when available.
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
