---
title: "Feature Specification: sk-doc README"
description: "Rewrite the sk-doc skill README in the narrative voice, leading with the structure-first quality pipeline, and dropping the heavily drifted counts."
trigger_phrases:
  - "sk-doc readme"
  - "sk-doc narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/017-sk-doc-readme"
    last_updated_at: "2026-06-07T14:25:14Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped sk-doc README via deep-context + dual-draft"
    next_safe_action: "Begin phase 018 (sk-git README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-017"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Dropped all drifted counts (version 1.5/1.6/1.7, 6-vs-8 scripts, 13-vs-14 references, 7-vs-6 flowcharts, 3-vs-5 templates); the doc-standards README now passes its own validator"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-doc README

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
| **Phase** | 17 of 24 |
| **Predecessor** | 016-sk-code-readme |
| **Successor** | 018-sk-git-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified; counts dropped |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17**, the third skill in Batch D (sk-*), and the doc-standards skill itself.

**Scope Boundary**: Only `.opencode/skills/sk-doc/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001, which sk-doc itself owns) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `sk-doc/README.md` in the narrative voice, exemplary because this skill owns the standard.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-doc README is a tabular reference card with no problem-first entry point, and it is heavily count-stale: the version (1.6.0.0) disagrees with SKILL.md (1.5.0.0) and the newest changelog (1.7.0.0), it says six scripts when there are eight, thirteen references when there are fourteen, seven flowchart patterns when there are six files, and three skill templates when there are five. As the skill that owns the README standard, its own README should be exemplary, not the worst offender for count drift.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the structure-first quality pipeline, the scripts-versus-AI split, the DQI and the document-type enforcement, with every drifted count dropped so the README stays evergreen.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `sk-doc/README.md` to the narrative skeleton; drop all brittle counts.

### Out of Scope

- Any change to SKILL.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/README.md` | Modify | Narrative-voice rewrite, exemplary for the doc-standards skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton, no table of contents |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Counts dropped | No version line and no script, reference, flowchart, template or mode count |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Core facts accurate | Structure-first principle, scripts-vs-AI split, DQI 40/30/30 bands, document-type enforcement, the six /create commands; every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The pipeline, the DQI bands, the enforcement levels and the command set match SKILL.md; every cited path resolves; no count is pinned.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model repeats a drifted count | The exemplar README stays stale | Both gather iterations enumerated the drift; authoring prompt forbade every count; host scanned the draft and found none |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The pipeline, the DQI and the command set verified during the gather.
<!-- /ANCHOR:questions -->
