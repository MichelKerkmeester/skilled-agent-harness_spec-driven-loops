---
title: "Feature Specification: Advisor + skill-graph rewrite and re-fingerprint"
description: "Execute impact-map surfaces #5/#6. Rewrite graph-metadata.json derived.trigger_phrases/intent_signals/key_files/entities/source_docs to span all workflow surfaces and repoint off monolith paths; confirm description.json shape; extend skill_advisor.py PHRASE_IN"
trigger_phrases:
  - "sk-doc advisor and skill graph"
  - "125 advisor and skill graph"
  - "sk-doc parent phase 014"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/014-advisor-and-skill-graph"
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
# Feature Specification: Advisor + skill-graph rewrite and re-fingerprint

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
| **Depends On** | 003, 005, 006, 007, 008, 009, 010, 011, 012 |
| **Predecessor** | `013-command-rebinding/` |
| **Successor** | `015-external-refs-and-facades/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 014 of the sk-doc monolith to parent-hub conversion. Scaffolded as a placeholder pending the phase 001 deep-research rulings; deliverables and file lists are seeded from the foundation phase decomposition and finalized when this phase is worked.

### Purpose
Execute impact-map surfaces #5/#6. Rewrite graph-metadata.json derived.trigger_phrases/intent_signals/key_files/entities/source_docs to span all workflow surfaces and repoint off monolith paths; confirm description.json shape; extend skill_advisor.py PHRASE_INTENT_BOOSTERS/SINGLE_WORD_INTENT for the missing verbs (benchmark/command/feature-catalog/changelog/skill); regenerate skill-graph.json via skill_graph_compiler.py and confirm skill_count keeps exactly one sk-doc entry (no phantom family); run advisor rebuild/scan so freshness re-fingerprints; verify no child packet or shared/ carries graph-metadata.json/description.json.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- rewritten graph-metadata.json (all surfaces, new paths)
- skill_advisor.py booster extensions (missing verbs)
- regenerated skill-graph.json (one sk-doc identity)
- advisor rebuild/scan + freshness re-fingerprint
- one-identity + no-child-metadata verification

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
| REQ-001 | rewritten graph-metadata.json (all surfaces, new paths) | Deliverable exists and validates; canon invariants preserved |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | skill_advisor.py booster extensions (missing verbs) | Deliverable exists and validates; canon invariants preserved |
| REQ-003 | regenerated skill-graph.json (one sk-doc identity) | Deliverable exists and validates; canon invariants preserved |
| REQ-004 | advisor rebuild/scan + freshness re-fingerprint | Deliverable exists and validates; canon invariants preserved |
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
