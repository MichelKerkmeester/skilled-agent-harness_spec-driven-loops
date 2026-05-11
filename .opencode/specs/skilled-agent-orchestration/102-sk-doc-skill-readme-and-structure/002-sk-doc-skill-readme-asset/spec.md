---
title: "Feature Specification: sk-doc skill README asset"
description: "Analyze skill README conventions and create a dedicated sk-doc skill README asset."
trigger_phrases:
  - "sk-doc skill README asset"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Prepared planning documentation"
    next_safe_action: "Run implementation phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-sk-doc-skill-readme-and-structure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-doc skill README asset

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
| **Phase** | 2 of 5 |
| **Predecessor** | 001-sk-doc-reference-relocation |
| **Successor** | 003-markdown-agent-rename |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-doc has README templates and skill creation guidance, but lacks a dedicated skill README asset for skill packages. README creation for skills currently relies on generic folder README guidance and repeated interpretation.

### Purpose
Create a reusable sk-doc skill README asset and wire it into the skill creation workflow and manual testing documentation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Analyze README patterns across .opencode/skills.
- Create a dedicated sk-doc skill README asset under .opencode/skills/sk-doc/assets/skill/.
- Derive the asset from .opencode/skills/sk-doc/assets/readme/readme_template.md, not readme_code_template.md.
- Reference the asset from relocated references/skill_creation.md, SKILL.md, and manual testing docs.

### Out of Scope
- Moving references specific files belongs to Phase 1.
- Create-agent rename belongs to Phase 3.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/*/README.md | Read | Analyze skill README conventions. |
| .opencode/skills/sk-doc/assets/skill/skill_readme_template.md | Create | Dedicated skill README asset. |
| .opencode/skills/sk-doc/SKILL.md | Modify | Reference new asset. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Analyze existing skill README structures. | Findings inform asset sections. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Create a dedicated skill README asset. | New markdown asset exists under assets/skill. |
| REQ-003 | Reference the asset from sk-doc creation guidance. | SKILL.md, references/skill_creation.md, and testing docs point to the asset. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase deliverables are implemented and verified with package, search and alignment checks.
- **SC-002**: Handoff criteria are ready for the next phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 relocation | References should target root references path | Start only after Phase 1 handoff. |
| Risk | Generic README template overfit | Asset may duplicate folder README guidance | Sample real skill READMEs first. |
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
