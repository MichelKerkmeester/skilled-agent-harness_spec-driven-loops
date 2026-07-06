---
title: "Feature Specification: Cutover, strict validation, parent rollup, close-out"
description: "Final cutover: remove residual monolith remnants not preserved as facades, run parent-skill-check.cjs to STRICT 0/0 (checks 1,2,3,5-9), run spec validate.sh --strict on 125 + every child phase, reconcile completion metadata across spec/plan/tasks/checklist/imp"
trigger_phrases:
  - "sk-doc cutover and closeout"
  - "125 cutover and closeout"
  - "sk-doc parent phase 017"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/017-cutover-and-closeout"
    last_updated_at: "2026-07-06T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Placeholder scaffolded"
    next_safe_action: "Populate after 001 rulings"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Cutover, strict validation, parent rollup, close-out

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
| **Depends On** | 013, 014, 015, 016 |
| **Predecessor** | `016-routing-benchmark/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 017 of the sk-doc monolith to parent-hub conversion. Scaffolded as a placeholder pending the phase 001 deep-research rulings; deliverables and file lists are seeded from the foundation phase decomposition and finalized when this phase is worked.

### Purpose
Final cutover: remove residual monolith remnants not preserved as facades, run parent-skill-check.cjs to STRICT 0/0 (checks 1,2,3,5-9), run spec validate.sh --strict on 125 + every child phase, reconcile completion metadata across spec/plan/tasks/checklist/implementation-summary, roll up the 125 parent (children 001-016, status complete), verify companion-file completeness (hub SKILL.md + mode-registry + hub-router + description.json + graph-metadata + real changelog/ + manual_testing_playbook/ + benchmark/; each packet SKILL.md + README.md + real changelog/), confirm changelogs are real files never symlinked, and memory-save the close-out. Handoff: one coordinated canonical reindex to the operator.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- parent-skill-check.cjs STRICT 0/0
- recursive spec validate.sh --strict pass
- reconciled completion metadata + 125 parent rollup
- companion-file + changelog-policy completeness verification
- close-out memory save + reindex handoff note

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
| REQ-001 | parent-skill-check.cjs STRICT 0/0 | Deliverable exists and validates; canon invariants preserved |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | recursive spec validate.sh --strict pass | Deliverable exists and validates; canon invariants preserved |
| REQ-003 | reconciled completion metadata + 125 parent rollup | Deliverable exists and validates; canon invariants preserved |
| REQ-004 | companion-file + changelog-policy completeness verification | Deliverable exists and validates; canon invariants preserved |
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
