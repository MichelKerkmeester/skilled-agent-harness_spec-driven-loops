---
title: "Feature Specification: Build shared/ doc-quality backbone + facade symlinks"
description: "Populate shared/ as the single source of truth: move the generic validator scripts (extract_structure, validate_document, quick_validate, frontmatter-version.mjs, check-frontmatter-versions.sh, validate-doc-model-refs.js, validate_flowchart.sh) into shared/scr"
trigger_phrases:
  - "sk-doc shared backbone"
  - "125 shared backbone"
  - "sk-doc parent phase 004"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/004-shared-backbone"
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
# Feature Specification: Build shared/ doc-quality backbone + facade symlinks

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
| **Depends On** | 003 |
| **Predecessor** | `003-hub-scaffold/` |
| **Successor** | `005-create-skill/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 004 of the sk-doc monolith to parent-hub conversion. Scaffolded as a placeholder pending the phase 001 deep-research rulings; deliverables and file lists are seeded from the foundation phase decomposition and finalized when this phase is worked.

### Purpose
Populate shared/ as the single source of truth: move the generic validator scripts (extract_structure, validate_document, quick_validate, frontmatter-version.mjs, check-frontmatter-versions.sh, validate-doc-model-refs.js, validate_flowchart.sh) into shared/scripts/; the cross-cutting global refs + frontmatter_versioning into shared/references/; the frontmatter/llms.txt/template_rules.json/flowchart assets into shared/assets/. Establish the CRITICAL root facades: sk-doc/scripts/<name> → shared/scripts/, sk-doc/assets/frontmatter_templates.md → shared/, so the ~151 external READMEs, /doctor audit_descriptions.py import, git pre-commit hook, and council test matrix resolve with ZERO edits. shared/ carries NO graph-metadata.json / description.json.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- shared/scripts/ (7 canonical validators)
- shared/references/global/ + frontmatter_versioning
- shared/assets/ (frontmatter, llms.txt, template_rules.json, flowcharts/*)
- root facade symlinks (scripts + frontmatter_templates)
- shared/README.md

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
| REQ-001 | shared/scripts/ (7 canonical validators) | Deliverable exists and validates; canon invariants preserved |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | shared/references/global/ + frontmatter_versioning | Deliverable exists and validates; canon invariants preserved |
| REQ-003 | shared/assets/ (frontmatter, llms.txt, template_rules.json, flowcharts/*) | Deliverable exists and validates; canon invariants preserved |
| REQ-004 | root facade symlinks (scripts + frontmatter_templates) | Deliverable exists and validates; canon invariants preserved |
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
