---
title: "Spec: CLI Dispatch Containment and Recursion Guards"
description: "The broad memory audit found raw shell branches, inconsistent timeout handling, and prose-only self-invocation guards. Those gaps can create process storms before lower-level daemon fixes run."
trigger_phrases:
  - "cli-dispatch-containment-and-recursion-guards"
  - "memory leak 3"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards"
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
      fingerprint: "sha256:0303030303030303030303030303030303030303030303030303030303030303"
      session_id: "009-memory-leak-remediation-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: CLI Dispatch Containment and Recursion Guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-22 |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 10 |
| **Predecessor** | 002-telemetry-and-process-verification-harness |
| **Successor** | 004-deep-loop-locks-state-and-recovery |
| **Handoff Criteria** | Nested CLI fixtures, ignored SIGTERM child fixture, dispatch audit failure records |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 3 of the memory leak remediation arc. It is scoped from source evidence in `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research` and `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`.

**Scope Boundary**: Centralize CLI dispatch supervision and prevent same-runtime or cross-runtime recursion loops.

**Dependencies**:
- `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness`

**Deliverables**:
- Route deep-loop CLI branches through an audited supervisor
- Add process-group ownership and timeout escalation
- Enforce runtime ancestry and recursion guards before spawn

**Changelog**:
- When this phase closes, refresh the parent arc status and note validation evidence in the phase implementation summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The broad memory audit found raw shell branches, inconsistent timeout handling, and prose-only self-invocation guards. Those gaps can create process storms before lower-level daemon fixes run.

### Purpose
Centralize CLI dispatch supervision and prevent same-runtime or cross-runtime recursion loops.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Route deep-loop CLI branches through an audited supervisor
- Add process-group ownership and timeout escalation
- Enforce runtime ancestry and recursion guards before spawn

### Out of Scope
- Changing model selection semantics
- Parallel CLI execution features

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/commands/spec_kit/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/cli-*/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/system-spec-kit/mcp_server/lib/` | Modify/Create | Implementation surface for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All deep-loop CLI dispatch paths use one supervised spawn contract | Evidence is captured in this phase's implementation summary and passes the phase verification command set; B5 reconciliation routes the cited deep-review Codex branch through `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts#runAuditedExecutorCommandAsync`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Same-runtime and two-hop cross-runtime recursion are rejected before spawn | Tests or documented verification prove the behavior without relying on broad process-kill patterns. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Nested CLI fixtures, ignored SIGTERM child fixture, dispatch audit failure records.
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
