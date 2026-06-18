---
title: "Feature Specification: sk-git README"
description: "Finalize and confirm the sk-git skill README, which was authored as the narrative golden example in phase 001 and is the reference exemplar for the whole packet."
trigger_phrases:
  - "sk-git readme"
  - "sk-git readme finalize"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/018-sk-git-readme"
    last_updated_at: "2026-06-07T14:29:02Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Confirmed sk-git README (golden example from phase 001) current and valid"
    next_safe_action: "Begin phase 019 (sk-prompt-small-model README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-018"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "sk-git README needs no rewrite: it is the phase-001 golden example, validates 0 issues, is HVR-clean and all 9 cited paths resolve; re-drafting the exemplar would risk regressing the standard"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-git README

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
| **Phase** | 18 of 24 |
| **Predecessor** | 017-sk-doc-readme |
| **Successor** | 019-sk-prompt-small-model-readme |
| **Handoff Criteria** | README confirmed current: passes validate_document.py --type readme and HVR; all cited paths resolve |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18**, the fourth skill in Batch D (sk-*). It is a finalize, not a rewrite.

**Scope Boundary**: Only `.opencode/skills/sk-git/README.md`. The README was authored as the narrative golden example in phase 001 and shipped then.

**Dependencies**: Phase 001, which produced both the narrative template and this README as the canonical exemplar.

**Deliverables**: Confirmation that the sk-git README is current, valid and accurate, plus this phase's continuity docs. No README change.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The packet plan lists sk-git as one of the twenty-two skill READMEs to standardize. Its README was already rewritten in phase 001 as the golden example that defines the narrative voice for every other phase, so a second full rewrite would be redundant and would risk regressing the reference exemplar through model drift.

### Purpose

Finalize phase 018 by confirming the sk-git README is current and accurate rather than re-drafting it: validate its structure, re-check its voice, and verify every cited path still resolves against the current sk-git skill. Record the confirmation so the packet's phase map reflects sk-git as complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Confirm `sk-git/README.md` is current: structure validation, HVR re-check, path resolution.

### Out of Scope

- A rewrite of the README. It is the phase-001 golden example and the voice reference; re-drafting it is explicitly avoided.
- Any change to SKILL.md or the skill's behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| (none) | Confirm | `sk-git/README.md` is unchanged since the phase-001 commit and remains valid |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README is the narrative golden example | Full nine-section numbered skeleton present |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | All cited paths resolve | The nine cited references, assets and the playbook all exist |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: All nine cited paths resolve and the README is unchanged since the phase-001 golden-example commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Re-drafting the exemplar through a model would regress the reference voice | Loss of the canonical standard | Finalize by confirmation only; no gather or dual-draft was run for this phase |
| Dependency | Phase 001 golden example | The README under confirmation | Authored and committed in phase 001; unchanged since |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The README is the established golden example and verifies clean.
<!-- /ANCHOR:questions -->
