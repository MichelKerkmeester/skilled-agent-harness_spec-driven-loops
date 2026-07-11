---
title: "Feature Specification: Build create-readme packet (install-guide variant folded)"
description: "Build create-readme: readme_creation.md + install_guide_creation.md references, assets/readme/{readme_template, readme_code_template, install_guide_template}, and the packet-unique audit_readmes.py. Install-guide is a variant of the same README-authoring lifec"
trigger_phrases:
  - "sk-doc create readme"
  - "125 create readme"
  - "sk-doc parent phase 006"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/006-create-readme"
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
# Feature Specification: Build create-readme packet (install-guide variant folded)

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
| **Predecessor** | `005-create-skill/` |
| **Successor** | `007-create-agent/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 006 of the sk-doc monolith to parent-hub conversion. Scaffolded as a placeholder pending the phase 001 deep-research rulings; deliverables and file lists are seeded from the foundation phase decomposition and finalized when this phase is worked.

### Purpose
Build create-readme: readme_creation.md + install_guide_creation.md references, assets/readme/{readme_template, readme_code_template, install_guide_template}, and the packet-unique audit_readmes.py. Install-guide is a variant of the same README-authoring lifecycle (matches /create:folder_readme). Symlink shared standards/validators inward; add an audit_readmes.py root facade only if 001 confirms an external ref.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- create-readme/ SKILL.md + README.md + changelog/
- references/{readme_creation,install_guide_creation}.md
- assets/readme/* (incl install_guide_template)
- scripts/audit_readmes.py + inward symlinks

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
| REQ-001 | create-readme/ SKILL.md + README.md + changelog/ | Deliverable exists and validates; canon invariants preserved |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | references/{readme_creation,install_guide_creation}.md | Deliverable exists and validates; canon invariants preserved |
| REQ-003 | assets/readme/* (incl install_guide_template) | Deliverable exists and validates; canon invariants preserved |
| REQ-004 | scripts/audit_readmes.py + inward symlinks | Deliverable exists and validates; canon invariants preserved |
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
