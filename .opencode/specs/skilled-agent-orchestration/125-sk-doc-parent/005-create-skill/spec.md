---
title: "Feature Specification: Build create-skill packet (heaviest; + parent-skill mode)"
description: "Build the create-skill child packet: skill_creation.md + skill_creation/ subtree, assets/skill/* (5 skill templates + 5 parent_skill_* templates), the absorbed create-command templates, and the two packet-unique scripts init_skill.py + package_skill.py. Wire c"
trigger_phrases:
  - "sk-doc create skill"
  - "125 create skill"
  - "sk-doc parent phase 005"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/005-create-skill"
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
# Feature Specification: Build create-skill packet (heaviest; + parent-skill mode)

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
| **Depends On** | 004 |
| **Predecessor** | `004-shared-backbone/` |
| **Successor** | `006-create-readme/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 005 of the sk-doc monolith to parent-hub conversion. Scaffolded as a placeholder pending the phase 001 deep-research rulings; deliverables and file lists are seeded from the foundation phase decomposition and finalized when this phase is worked.

### Purpose
Build the create-skill child packet: skill_creation.md + skill_creation/ subtree, assets/skill/* (5 skill templates + 5 parent_skill_* templates), the absorbed create-command templates, and the two packet-unique scripts init_skill.py + package_skill.py. Wire create-skill-parent as a 2nd workflowMode over the same packet. Symlink consumed shared refs/scripts inward. Establish root facades sk-doc/scripts/{init_skill,package_skill}.py and sk-doc/references/skill_creation/ so sk-code python evidence refs + the 3 sibling-hub method-doc citations resolve unchanged. Respect self-hosting: parent_skill_* templates stay readable at old path until 013's atomic repoint.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- create-skill/ SKILL.md + README.md + changelog/
- references/skill_creation + skill_creation/ subtree (with parent-hub method docs)
- assets/skill/* + absorbed command templates
- scripts/{init_skill,package_skill}.py + inward symlinks
- root facades: scripts/{init_skill,package_skill}.py, references/skill_creation/

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
| REQ-001 | create-skill/ SKILL.md + README.md + changelog/ | Deliverable exists and validates; canon invariants preserved |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | references/skill_creation + skill_creation/ subtree (with parent-hub method docs) | Deliverable exists and validates; canon invariants preserved |
| REQ-003 | assets/skill/* + absorbed command templates | Deliverable exists and validates; canon invariants preserved |
| REQ-004 | scripts/{init_skill,package_skill}.py + inward symlinks | Deliverable exists and validates; canon invariants preserved |
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
