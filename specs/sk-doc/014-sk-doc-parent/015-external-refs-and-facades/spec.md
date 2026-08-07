---
title: "Feature Specification: Verify external couplings + reconcile fail-open sites"
description: "Cover impact-map surfaces #2/#3/#4. Validate every preserved facade resolves: the ~151 external README/playbook validation-command refs, the 3 sibling-hub method-doc citations (sk-code:128, sk-design:188, deep-loop-workflows:137), the git pre-commit VALIDATOR,"
trigger_phrases:
  - "sk-doc external refs and facades"
  - "125 external refs and facades"
  - "sk-doc parent phase 015"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/015-external-refs-and-facades"
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
# Feature Specification: Verify external couplings + reconcile fail-open sites

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
| **Depends On** | 004, 005, 013 |
| **Predecessor** | `014-advisor-and-skill-graph/` |
| **Successor** | `016-routing-benchmark/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 015 of the sk-doc monolith to parent-hub conversion. Scaffolded as a placeholder pending the phase 001 deep-research rulings; deliverables and file lists are seeded from the foundation phase decomposition and finalized when this phase is worked.

### Purpose
Cover impact-map surfaces #2/#3/#4. Validate every preserved facade resolves: the ~151 external README/playbook validation-command refs, the 3 sibling-hub method-doc citations (sk-code:128, sk-design:188, deep-loop-workflows:137), the git pre-commit VALIDATOR, the council test-council-matrix.sh spawn + its vitest assertion. Explicitly reconcile the three FAIL-OPEN sites that degrade silently rather than error: /doctor audit_descriptions.py:45 budget-constant import (decide facade-preserve vs export from a stable shared module), the pre-commit existence guard, and the check-markdown-links.cjs:42-57 allowlist keys. No reliance on graceful degradation — explicit repoint or explicit facade per site.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- facade-resolution proof for the ~151 refs + 3 sibling hubs
- audit_descriptions.py budget-constant coupling decision applied
- pre-commit hook + council matrix + vitest verification
- check-markdown-links.cjs allowlist reconciliation
- zero-silent-degradation sign-off

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
| REQ-001 | facade-resolution proof for the ~151 refs + 3 sibling hubs | Deliverable exists and validates; canon invariants preserved |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | audit_descriptions.py budget-constant coupling decision applied | Deliverable exists and validates; canon invariants preserved |
| REQ-003 | pre-commit hook + council matrix + vitest verification | Deliverable exists and validates; canon invariants preserved |
| REQ-004 | check-markdown-links.cjs allowlist reconciliation | Deliverable exists and validates; canon invariants preserved |
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
