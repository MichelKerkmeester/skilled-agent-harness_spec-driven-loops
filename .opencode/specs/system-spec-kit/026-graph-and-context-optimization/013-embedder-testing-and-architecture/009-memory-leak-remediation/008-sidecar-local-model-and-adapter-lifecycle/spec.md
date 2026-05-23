---
title: "Spec: Sidecar, Local Model, and Adapter Lifecycle"
description: "Both audits found detached sidecars and in-process adapter caches that can retain model/client state. The code-index audit keeps resident-memory severity benchmark-gated because growth is not yet proven."
trigger_phrases:
  - "sidecar-local-model-and-adapter-lifecycle"
  - "memory leak 8"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle"
    last_updated_at: "2026-05-22T14:05:26Z"
    last_updated_by: "codex"
    recent_action: "completed-phase-008-sidecar-and-adapter-lifecycle"
    next_safe_action: "start-009-spec-memory-runtime-retention"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0808080808080808080808080808080808080808080808080808080808080808"
      session_id: "009-memory-leak-remediation-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Sidecar, Local Model, and Adapter Lifecycle

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
| **Phase** | 8 of 10 |
| **Predecessor** | 007-code-graph-launcher-and-db-lifecycle |
| **Successor** | 009-spec-memory-runtime-retention-cleanup |
| **Handoff Criteria** | Healthy reuse, unknown-owner refusal, stale exact-PID cleanup, sidecar 5xx fallback RSS, adapter close idempotence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 8 of the memory leak remediation arc. It is scoped from source evidence in `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research` and `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`.

**Scope Boundary**: Bound rerank sidecar, local model, adapter, fallback, and HTTP client lifetimes.

**Dependencies**:
- `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness`
- `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep`

**Deliverables**:
- Add sidecar ledger, owner token, health payload, and stale PID cleanup
- Add idempotent close/unload for adapters, fallback adapters, and HTTP clients
- Benchmark successful-search and fallback RSS before severity escalation

**Changelog**:
- When this phase closes, refresh the parent arc status and note validation evidence in the phase implementation summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Both audits found detached sidecars and in-process adapter caches that can retain model/client state. The code-index audit keeps resident-memory severity benchmark-gated because growth is not yet proven.

### Purpose
Bound rerank sidecar, local model, adapter, fallback, and HTTP client lifetimes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add sidecar ledger, owner token, health payload, and stale PID cleanup
- Add idempotent close/unload for adapters, fallback adapters, and HTTP clients
- Benchmark successful-search and fallback RSS before severity escalation

### Out of Scope
- Unsafe process-sweep termination before ownership is known
- Unproven memory-severity escalation

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-rerank-sidecar/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/` | Modify/Create | Implementation surface for this phase |
| `.opencode/skills/system-spec-kit/` | Modify/Create | Implementation surface for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Sidecar lifecycle has explicit owner metadata and safe reuse/cleanup semantics | Evidence is captured in this phase's implementation summary and passes the phase verification command set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Adapter cache cleanup closes nested clients and fallback models before dropping refs | Tests or documented verification prove the behavior without relying on broad process-kill patterns. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Healthy reuse, unknown-owner refusal, stale exact-PID cleanup, sidecar 5xx fallback RSS, adapter close idempotence.
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
