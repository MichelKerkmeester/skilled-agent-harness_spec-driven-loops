---
title: "Spec: Telemetry and Process Verification Harness"
description: "Both research packets defer live proof for several memory claims. Follow-up fixes need a repeatable harness before they can claim that cleanup works or that RSS growth is real."
trigger_phrases:
  - "telemetry-and-process-verification-harness"
  - "memory leak 2"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness"
    last_updated_at: "2026-05-22T13:45:00Z"
    last_updated_by: "opencode"
    recent_action: "completed-phase-002-harness"
    next_safe_action: "start-003-cli-dispatch"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0202020202020202020202020202020202020202020202020202020202020202"
      session_id: "009-memory-leak-remediation-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Telemetry and Process Verification Harness

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-05-22 |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 10 |
| **Predecessor** | 001-research-synthesis-and-remediation-map |
| **Successor** | 003-cli-dispatch-containment-and-recursion-guards |
| **Handoff Criteria** | Synthetic child/grandchild, stale lock, sidecar, and vm_stat/sysctl fixtures |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 2 of the memory leak remediation arc. It is scoped from source evidence in `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research` and `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`.

**Scope Boundary**: Build reusable verification for process cleanup, RSS, swap, wired memory, sidecars, stale locks, and daemon identity.

**Dependencies**:
- `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research`
- `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`
- `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map`

**Deliverables**:
- Capture before/after process trees and sidecar state
- Capture Apple Silicon swap, wired memory, and RSS evidence
- Provide fixtures for stale locks, orphaned children, and expected warm daemons

**Changelog**:
- When this phase closes, refresh the parent arc status and note validation evidence in the phase implementation summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Both research packets defer live proof for several memory claims. Follow-up fixes need a repeatable harness before they can claim that cleanup works or that RSS growth is real.

### Purpose
Build reusable verification for process cleanup, RSS, swap, wired memory, sidecars, stale locks, and daemon identity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Capture before/after process trees and sidecar state
- Capture Apple Silicon swap, wired memory, and RSS evidence
- Provide fixtures for stale locks, orphaned children, and expected warm daemons

### Out of Scope
- Fixing individual leaks before the harness can measure them
- Killing unrelated user-owned processes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/mcp-coco-index/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/system-code-graph/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` | Created | Dry-run host/process memory evidence collector and classifier. |
| `.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts` | Created | Synthetic child/grandchild, stale lock, sidecar, zombie, and vm_stat/sysctl fixtures. |
| `.opencode/skills/system-spec-kit/scripts/tsconfig.json` | Modified | Include `ops/**/*.ts` in the scripts workspace build. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Expose deterministic process and memory snapshots for remediation tests | Evidence is captured in this phase's implementation summary and passes the phase verification command set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Distinguish expected daemons from leaked or orphaned helpers | Tests or documented verification prove the behavior without relying on broad process-kill patterns. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Synthetic child/grandchild, stale lock, sidecar, and vm_stat/sysctl fixtures.
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
