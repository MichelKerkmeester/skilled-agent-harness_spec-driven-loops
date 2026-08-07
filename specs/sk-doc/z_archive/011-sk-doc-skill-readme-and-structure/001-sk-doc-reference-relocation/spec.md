---
title: "Feature Specification: sk-doc reference relocation"
description: "Move sk-doc creation guides from references specific into the references root and update all old path references."
trigger_phrases:
  - "sk-doc reference relocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/011-sk-doc-skill-readme-and-structure/001-sk-doc-reference-relocation"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Relocated sk-doc creation references and updated stale paths"
    next_safe_action: "Continue with Phase 2 after reviewing Phase 1 handoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-sk-doc-skill-readme-and-structure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-doc reference relocation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-sk-doc-skill-readme-asset |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-doc keeps creation guides in references specific, but the requested structure moves those guides to the root references folder. Old path references exist in sk-doc docs and create command assets, so relocation must include a complete reference update.

### Purpose
Relocate the creation guides and make every path reference point to the new root references location.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move six creation guides from .opencode/skills/sk-doc/references/specific/ to .opencode/skills/sk-doc/references/.
- Remove the now-empty .opencode/skills/sk-doc/references/specific/ directory.
- Update old path references in .opencode/skills/sk-doc, .opencode/agents, and .opencode/commands.

### Out of Scope
- Dedicated skill README asset creation belongs to Phase 2.
- Create-agent rename belongs to Phase 3.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-doc/references/specific/*.md | Move | Move six creation guides to references root. |
| .opencode/skills/sk-doc/SKILL.md | Modify | Update guide paths. |
| .opencode/commands/create/** | Modify | Update create command references. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Move all six creation guides to references root. | Each file exists at the root references path and no duplicate remains under specific. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Remove the specific folder after relocation. | Directory no longer exists after implementation. |
| REQ-003 | Update old path references in requested scopes. | Exact search for sk-doc references specific returns no implementation-scope hits. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase deliverables are implemented and verified.
- **SC-002**: Handoff criteria are ready for the next phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 uses relocated skill_creation.md | Phase 2 cannot start safely until Phase 1 lands | Complete this phase before Phase 2. |
| Risk | Stale singular skill path in create README | Link checks can fail after relocation | Search for both specific and singular skill path forms. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Reference searches complete within normal repo-search time.
- **NFR-P02**: Documentation changes avoid duplicate source-of-truth files.

### Security
- **NFR-S01**: No secrets or credentials are introduced.
- **NFR-S02**: Agent policy changes preserve explicit write-scope boundaries.

### Reliability
- **NFR-R01**: All referenced paths resolve after implementation.
- **NFR-R02**: Runtime mirror updates remain consistent where mirrors exist.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing optional runtime mirror: document as not applicable.
- Existing command-family references: preserve when they refer to create commands.
- Historical notes: leave only if explicitly marked historical.

### Error Scenarios
- Validation failure: stop and fix within this phase.
- Search ambiguity: classify matches before editing.
- Partial completion: do not start the next phase until handoff criteria pass.

### State Transitions
- Draft to active: implementation begins.
- Active to complete: validation evidence recorded.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multi-file documentation and runtime-surface changes. |
| Risk | 16/25 | Path/reference drift is the main risk. |
| Research | 14/20 | Requires exact searches and pattern review. |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None blocking planning.
<!-- /ANCHOR:questions -->
