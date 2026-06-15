---
title: "Feature Specification: cli-devin README"
description: "Rewrite the cli-devin skill README in the narrative voice, leading with the family-unique cloud handoff and the four-model preset, dropping the stale version and reference count."
trigger_phrases:
  - "cli-devin readme"
  - "devin skill readme"
  - "cli-devin narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/004-cli-devin-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped cli-devin README via deep-context + dual-draft"
    next_safe_action: "Begin phase 005 (cli-opencode README)"
    blockers: []
    key_files:
      - ".opencode/skills/cli-devin/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "New template drops the version line and reference count, so both stale facts disappear"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cli-devin README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 24 |
| **Predecessor** | 003-cli-codex-readme |
| **Successor** | 005-cli-opencode-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; facts verified against SKILL.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the skill README standardization, the third cli-* skill rewritten.

**Scope Boundary**: Only `.opencode/skills/cli-devin/README.md`. No SKILL.md or behavior change.

**Dependencies**:
- The narrative template and golden example from phase 001.
- The deep-context gather in this folder's `context/`.

**Deliverables**:
- A rewritten `cli-devin/README.md` in the narrative voice.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The cli-devin README is a tabular reference card with no problem-first entry point, and it carries two stale facts: a version of 1.0.2.0 (the skill is 1.0.13.0) and a reference count of 5 (the directory holds 10). It also under-plays the skill's distinctive value: the family-unique local-to-cloud handoff and the four-model preset.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the cloud handoff and model selection and dropping the stale version and count.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `cli-devin/README.md` to the narrative skeleton.
- Lead with the cloud handoff and the four-model preset; drop the stale version and reference count.

### Out of Scope

- Any change to SKILL.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-devin/README.md` | Modify | Narrative-voice rewrite, cloud handoff and models foregrounded |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Stale facts dropped | No version line, no wrong reference count |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean | No em dashes, semicolons, Oxford-comma lists or banned words |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: Every flag, model id and file path cited resolves against the real skill.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft carries the stale version or count | Inaccurate README | Authoring prompt forbade citing version or count; host verified |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep plus host read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Models, handoff and stale facts resolved during the gather.
<!-- /ANCHOR:questions -->
