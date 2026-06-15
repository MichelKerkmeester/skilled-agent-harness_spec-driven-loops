---
title: "Feature Specification: cli-claude-code README"
description: "Rewrite the cli-claude-code skill README in the narrative voice, grounded in a deep-context gather and dual-model draft, fixing the stale agent roster."
trigger_phrases:
  - "cli-claude-code readme"
  - "claude code skill readme"
  - "cli-claude-code narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/002-cli-claude-code-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped cli-claude-code README via deep-context + dual-draft"
    next_safe_action: "Begin phase 003 (cli-codex README)"
    blockers: []
    key_files:
      - ".opencode/skills/cli-claude-code/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Agent roster follows SKILL.md (9 agents), not the current README's stale 11"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cli-claude-code README

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
| **Phase** | 2 of 24 |
| **Predecessor** | 001-readme-template-and-standard |
| **Successor** | 003-cli-codex-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; facts verified against SKILL.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the skill README standardization, the first skill rewritten under the locked template.

**Scope Boundary**: Only `.opencode/skills/cli-claude-code/README.md`. No SKILL.md or behavior change.

**Dependencies**:
- The narrative template and golden example from phase 001.
- The deep-context gather in this folder's `context/`.

**Deliverables**:
- A rewritten `cli-claude-code/README.md` in the narrative voice.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The cli-claude-code README is a tabular reference card with no problem-first entry point, and it carries a stale fact: it lists 11 delegatable agents (the OpenCode agent set) when the skill's own SKILL.md documents 9. A reader gets the wrong roster and no human orientation.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, with every fact verified against SKILL.md so the agent roster and flags are correct.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `cli-claude-code/README.md` to the narrative skeleton.
- Correct the agent roster to SKILL.md's 9 agents.

### Out of Scope

- The SKILL.md internal inconsistency between its 9-agent table and agent_delegation.md. That is a skill change, not a README rewrite.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-claude-code/README.md` | Modify | Narrative-voice rewrite, corrected agent roster |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Agent roster is correct | Lists SKILL.md's 9 agents, not the stale 11 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean | No em dashes, semicolons, Oxford-comma lists or banned words |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: Every flag, agent and file path cited resolves against the real skill.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft invents flags or agents | Inaccurate README | Host verified against SKILL.md; iteration 2 cross-checked |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep plus host read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Roster and voice resolved during the gather.
<!-- /ANCHOR:questions -->
