---
title: "Feature Specification: Architecture decision: registry, router, shared/symlink, advisor plan"
description: "Lock the hub architecture from 001's findings in a decision-record. Finalize the modes[] array (workflowMode set, packetKind:workflow for all, backendKind vocabulary e.g. template-scaffold vs doc-quality, routingClass:metadata default + per-mode command field,"
trigger_phrases:
  - "sk-doc architecture decision"
  - "125 architecture decision"
  - "sk-doc parent phase 002"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/002-architecture-decision"
    last_updated_at: "2026-07-06T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "ADR authored from 001 research (8-packet set + facade map)"
    next_safe_action: "Operator review sign-off on 001+002; then phase 003 build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Architecture decision: registry, router, shared/symlink, advisor plan

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SCAFFOLD: placeholder phase child of skilled-agent-orchestration/125-sk-doc-parent; plan/tasks/implementation-summary authored when the phase is worked (post-001). -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (scaffold; target complexity in parent map) |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | 001 |
| **Predecessor** | `001-research-and-canon/` |
| **Successor** | `003-hub-scaffold/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 002 of the sk-doc monolith to parent-hub conversion. Scaffolded as a placeholder pending the phase 001 deep-research rulings; deliverables and file lists are seeded from the foundation phase decomposition and finalized when this phase is worked.

### Purpose
Lock the hub architecture from 001's findings in a decision-record. Finalize the modes[] array (workflowMode set, packetKind:workflow for all, backendKind vocabulary e.g. template-scaffold vs doc-quality, routingClass:metadata default + per-mode command field, command-bridge only for command-only modes); the hub-router.json schema (routerPolicy defaultMode, routerSignals bidirectionally == modes[].workflowMode, vocabularyClasses per create-* verb, tieBreak covering every mode, outcomes single/orderedBundle/defer with NO surfaceBundle); the shared/ vs per-packet script split; the symlink facade topology; the graph-metadata.json rewrite + description.json creation plan; extensions=[] confirmation; and the atomic command-repoint sequencing that survives the self-hosting hazard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- decision-record.md — final packet set, registry+router schema, extensions=[], routingClass rationale
- shared/symlink plan (canonical-in-shared, symlink-inward; the 4 critical facades)
- graph-metadata + description.json + advisor-booster rewrite spec
- command-repoint sequencing plan (atomic, self-hosting-safe)
- backendKind + vocabularyClasses discriminator vocabulary

### Out of Scope
- Work owned by another phase in the parent Phase Documentation Map.
- Rewriting doc-type doctrine content (this program moves content, it does not rewrite standards).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/` | TBD | Enumerated from the 001 deep-research rulings when this phase is worked |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | decision-record.md — final packet set, registry+router schema, extensions=[], routingClass rationale | Deliverable exists and validates; canon invariants preserved |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | shared/symlink plan (canonical-in-shared, symlink-inward; the 4 critical facades) | Deliverable exists and validates; canon invariants preserved |
| REQ-003 | graph-metadata + description.json + advisor-booster rewrite spec | Deliverable exists and validates; canon invariants preserved |
| REQ-004 | command-repoint sequencing plan (atomic, self-hosting-safe) | Deliverable exists and validates; canon invariants preserved |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase deliverables complete with evidence; `validate.sh` passes for this folder.
- **SC-002**: Zero external-coupling breakage introduced by this phase (facades resolve).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 deep-research rulings | This phase's scope may shift | Do not start build work before 001 + 002 gates clear |
| Risk | Over-decomposition / canon drift | Medium | Enforce the 124/022 packet test; one graph-metadata.json; symlinks inward |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Bound to the parent `spec.md` §4 and settled by the 001 deep research.
<!-- /ANCHOR:questions -->
