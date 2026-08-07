---
title: "Feature Specification: Repoint the 7 /create:* command YAMLs + README.txt"
description: "Repoint the tightest coupling (impact-map surface #1): each of the 7 /create:* commands is a thin router loading auto.yaml/confirm.yaml pairs with hardcoded sk-doc/... path literals and no fallback resolution. Repoint per-packet asset/reference paths to their "
trigger_phrases:
  - "sk-doc command rebinding"
  - "125 command rebinding"
  - "sk-doc parent phase 013"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/013-command-rebinding"
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
# Feature Specification: Repoint the 7 /create:* command YAMLs + README.txt

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
| **Depends On** | 005, 006, 007, 008, 009, 010, 011, 012 |
| **Predecessor** | `012-doc-quality/` |
| **Successor** | `014-advisor-and-skill-graph/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 013 of the sk-doc monolith to parent-hub conversion. Scaffolded as a placeholder pending the phase 001 deep-research rulings; deliverables and file lists are seeded from the foundation phase decomposition and finalized when this phase is worked.

### Purpose
Repoint the tightest coupling (impact-map surface #1): each of the 7 /create:* commands is a thin router loading auto.yaml/confirm.yaml pairs with hardcoded sk-doc/... path literals and no fallback resolution. Repoint per-packet asset/reference paths to their new child homes and shared paths; regenerate the README.txt reference table (L192-199); fix the folder_readme error-handler string. Land as an ATOMIC commit that also flips the self-hosting parent_skill_* template refs, so /create:sk-skill-parent can still find its own templates until the moment they move. Preserve shared-backbone facades so shared scripts keep resolving.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 7 repointed auto.yaml/confirm.yaml pairs
- regenerated commands/create/README.txt reference table
- sk-skill-parent.md router prose repoint
- atomic self-hosting-safe repoint commit
- per-command runtime smoke check (no missing-path breaks)

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
| REQ-001 | 7 repointed auto.yaml/confirm.yaml pairs | Deliverable exists and validates; canon invariants preserved |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | regenerated commands/create/README.txt reference table | Deliverable exists and validates; canon invariants preserved |
| REQ-003 | sk-skill-parent.md router prose repoint | Deliverable exists and validates; canon invariants preserved |
| REQ-004 | atomic self-hosting-safe repoint commit | Deliverable exists and validates; canon invariants preserved |
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
