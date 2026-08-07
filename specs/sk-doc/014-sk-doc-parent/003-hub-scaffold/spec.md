---
title: "Feature Specification: Scaffold the sk-doc parent hub skeleton"
description: "Scaffold the two-tier hub in place at .opencode/skills/sk-doc/ using /create:sk-skill-parent (reading the parent_skill_* templates at their CURRENT monolith path, since they have not moved yet). Create the hub SKILL.md router shell (holds NO per-mode logic), m"
trigger_phrases:
  - "sk-doc hub scaffold"
  - "125 hub scaffold"
  - "sk-doc parent phase 003"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/003-hub-scaffold"
    last_updated_at: "2026-07-06T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Additive hub shell scaffolded (registry+router+9 packet dirs+shared); monolith intact")
    next_safe_action: "Phase 004 build shared/ backbone + facades (on operator go)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Feature Specification: Scaffold the sk-doc parent hub skeleton

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
| **Depends On** | 002 |
| **Predecessor** | `002-architecture-decision/` |
| **Successor** | `004-shared-backbone/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 of the sk-doc monolith to parent-hub conversion. Scaffolded as a placeholder pending the phase 001 deep-research rulings; deliverables and file lists are seeded from the foundation phase decomposition and finalized when this phase is worked.

### Purpose
Scaffold the two-tier hub in place at .opencode/skills/sk-doc/ using /create:sk-skill-parent (reading the parent_skill_* templates at their CURRENT monolith path, since they have not moved yet). Create the hub SKILL.md router shell (holds NO per-mode logic), mode-registry.json (modes[] per 002, empty-body packets), hub-router.json, description.json (new — sk-doc lacks one), and rewrite graph-metadata.json to keep exactly ONE identity skill_id:sk-doc. Create empty nested packet dirs + shared/ tree + hub-level changelog/, benchmark/, manual_testing_playbook/ companion dirs. No content migration yet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- hub SKILL.md router shell
- mode-registry.json + hub-router.json (validated bidirectional)
- description.json (new) + rewritten graph-metadata.json (one identity)
- empty packet dirs + shared/ skeleton + hub companion dirs
- parent-skill-check.cjs baseline run (expect known gaps until content lands)

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
| REQ-001 | hub SKILL.md router shell | Deliverable exists and validates; canon invariants preserved |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | mode-registry.json + hub-router.json (validated bidirectional) | Deliverable exists and validates; canon invariants preserved |
| REQ-003 | description.json (new) + rewritten graph-metadata.json (one identity) | Deliverable exists and validates; canon invariants preserved |
| REQ-004 | empty packet dirs + shared/ skeleton + hub companion dirs | Deliverable exists and validates; canon invariants preserved |
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
