---
title: "Feature Specification: cli-codex README"
description: "Rewrite the cli-codex skill README in the narrative voice, grounded in a deep-context gather and dual-model draft, surfacing the two silent codex exec traps."
trigger_phrases:
  - "cli-codex readme"
  - "codex skill readme"
  - "cli-codex narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/003-cli-codex-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped cli-codex README via deep-context + dual-draft"
    next_safe_action: "Begin phase 004 (cli-devin README)"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "README surfaces the two codex exec traps (read-only default sandbox, explicit service_tier)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cli-codex README

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
| **Phase** | 3 of 24 |
| **Predecessor** | 002-cli-claude-code-readme |
| **Successor** | 004-cli-devin-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; facts verified against SKILL.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the skill README standardization, the second cli-* skill rewritten.

**Scope Boundary**: Only `.opencode/skills/cli-codex/README.md`. No SKILL.md or behavior change.

**Dependencies**:
- The narrative template and golden example from phase 001.
- The deep-context gather in this folder's `context/`.

**Deliverables**:
- A rewritten `cli-codex/README.md` in the narrative voice.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The cli-codex README is a tabular reference card with no problem-first entry point. It also under-states the two `codex exec` defaults that silently break tasks: the read-only default sandbox (edit tasks no-op) and the implicit service tier. A reader gets a flag list but not the traps that bite in practice.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, surfacing the two traps up front and verifying every flag against SKILL.md.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `cli-codex/README.md` to the narrative skeleton.
- State the read-only-default and explicit-service-tier traps prominently.

### Out of Scope

- Any change to SKILL.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-codex/README.md` | Modify | Narrative-voice rewrite with the two traps surfaced |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | The two codex exec traps are stated | Read-only-default and service_tier traps appear in HOW IT WORKS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean | No em dashes, semicolons, Oxford-comma lists or banned words |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: Every flag, sandbox level and file path cited resolves against the real skill.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft invents flags or non-existent options | Inaccurate README | Host verified against SKILL.md; iteration 2 cross-checked |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep plus host read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Flags and traps resolved during the gather.
<!-- /ANCHOR:questions -->
