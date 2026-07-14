---
title: "Feature Specification: Phase 13: commands [template:level_1/spec.md]"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/013-commands"
    last_updated_at: "2026-07-14T15:17:05Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/013-commands"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: commands

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [P0/P1/P2] |
| **Status** | [Draft/In Progress/Review/Complete] |
| **Created** | 2026-07-14 |
| **Branch** | `scaffold/013-commands` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 14 |
| **Predecessor** | 012-sk-git |
| **Successor** | 014-agents |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the component migration (017 parent) specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]

### Purpose
[One-sentence outcome statement. What does success look like?]
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

### Out of Scope
- [Excluded item 1] - [why]
- [Excluded item 2] - [why]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [path/to/file.js] | [Modify/Create/Delete] | [Brief description] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [Requirement description] | [How to verify it's done] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [Requirement description] | [How to verify it's done] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-create-namespace/ | [Phase 1 scope] | Pending |
| 2 | 002-deep-namespace/ | [Phase 2 scope] | Pending |
| 3 | 003-design-namespace/ | [Phase 3 scope] | Pending |
| 4 | 004-doctor-namespace/ | [Phase 4 scope] | Pending |
| 5 | 005-memory-namespace/ | [Phase 5 scope] | Pending |
| 6 | 006-scripts-namespace/ | [Phase 6 scope] | Pending |
| 7 | 007-speckit-namespace/ | [Phase 7 scope] | Pending |
| 8 | 008-loose-command-ids/ | [Phase 8 scope] | Pending |
| 9 | 009-command-assets/ | [Phase 9 scope] | Pending |
| 10 | 010-commands-gate/ | [Phase 10 scope] | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-create-namespace | 002-deep-namespace | [Criteria TBD] | [Verification TBD] |
| 002-deep-namespace | 003-design-namespace | [Criteria TBD] | [Verification TBD] |
| 003-design-namespace | 004-doctor-namespace | [Criteria TBD] | [Verification TBD] |
| 004-doctor-namespace | 005-memory-namespace | [Criteria TBD] | [Verification TBD] |
| 005-memory-namespace | 006-scripts-namespace | [Criteria TBD] | [Verification TBD] |
| 006-scripts-namespace | 007-speckit-namespace | [Criteria TBD] | [Verification TBD] |
| 007-speckit-namespace | 008-loose-command-ids | [Criteria TBD] | [Verification TBD] |
| 008-loose-command-ids | 009-command-assets | [Criteria TBD] | [Verification TBD] |
| 009-command-assets | 010-commands-gate | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->
