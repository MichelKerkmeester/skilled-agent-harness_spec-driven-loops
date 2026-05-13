---
title: "Implementation Plan: Update Attribution Metadata"
description: "Plan for Update NOTICE, CHANGELOG, and package metadata for Apache-2.0 upstream plus spec-kit modifications."
trigger_phrases:
  - "027 phase 005"
  - "cocoindex attribution"
  - "005-attribution"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork/005-attribution"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded child packet for Update Attribution Metadata"
    next_safe_action: "Implement scoped tasks for 005-attribution"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-001-005-attribution"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Parent decomposition and dependency order are pre-approved by orchestrator."
---
# Implementation Plan: Update Attribution Metadata

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python, shell, Markdown, JSON |
| **Framework** | MCP server and SpecKit skill packaging |
| **Storage** | Local repo files and isolated CocoIndex runtime paths where needed |
| **Testing** | Strict spec validation plus child-specific shell or pytest checks |

### Overview
Update NOTICE, CHANGELOG, and package metadata for Apache-2.0 upstream plus spec-kit modifications.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent phase folder exists.
- [x] Dependency list is encoded in `graph-metadata.json`.
- [x] Scope is limited to this child file boundary.

### Definition of Done
- [ ] Child implementation tasks complete.
- [ ] Child-specific verification commands recorded in `checklist.md`.
- [ ] Strict validation exits 0 for this child.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Topical decomposition by file-subdirectory boundary.

### Key Components
- **Input**: validated outputs from dependency children.
- **Owned surface**: files listed in this child spec.
- **Output**: validation evidence and handoff state for downstream children.

### Data Flow
Dependency child output is read first, this child updates its owned files, then validation evidence is written back into this child packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness
- [ ] Confirm dependencies have validation evidence.
- [ ] Read owned files before editing.

### Phase 2: Scoped Implementation
- [ ] Read upstream LICENSE and current NOTICE/CHANGELOG
- [ ] Update NOTICE with Apache-2.0 and modification summary
- [ ] Update CHANGELOG with complete-fork baseline entry
- [ ] Update package metadata fork version fields

### Phase 3: Verification
- [ ] Run child-specific verification.
- [ ] Run strict spec validation.
- [ ] Update checklist evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Spec validation | This child packet | `validate.sh --strict` |
| Dependency check | Required predecessor outputs | Direct file reads |
| Implementation smoke | Owned files | Child-specific shell, pytest, or doc grep checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-import-upstream` | Child phase | Required | This child cannot safely implement until 001-import-upstream validates |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: child verification fails after implementation or a dependency contract changes.
- **Procedure**: revert only this child owned file surface, preserve evidence in this child packet, and rerun strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness | 001-import-upstream | Scoped implementation |
| Scoped implementation | Readiness | Verification |
| Verification | Scoped implementation | Downstream child handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work | Estimated Effort |
|------|------------------|
| Scope implementation | ~50 LOC |
| Verification and evidence | 30-60 minutes |
<!-- /ANCHOR:effort -->


---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

1. Revert only this child owned file surface.
2. Preserve failure evidence in `implementation-summary.md`.
3. Rerun `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child-folder> --strict`.
<!-- /ANCHOR:enhanced-rollback -->
