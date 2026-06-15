---
title: "Feature Specification: cli-opencode README"
description: "Rewrite the cli-opencode skill README in the narrative voice, leading with the full-runtime dispatch and the two non-obvious rules, dropping the stale version and provider count."
trigger_phrases:
  - "cli-opencode readme"
  - "opencode skill readme"
  - "cli-opencode narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/005-cli-opencode-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped cli-opencode README; Batch A (cli-*) complete"
    next_safe_action: "Begin phase 006 (deep-ai-council README), Batch B"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "New template drops the version line and provider count, fixing the README's two stale (and self-contradictory) facts"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cli-opencode README

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
| **Phase** | 5 of 24 |
| **Predecessor** | 004-cli-devin-readme |
| **Successor** | 006-deep-ai-council-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; facts verified against SKILL.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the skill README standardization and the last cli-* skill, closing Batch A.

**Scope Boundary**: Only `.opencode/skills/cli-opencode/README.md`. No SKILL.md or behavior change.

**Dependencies**:
- The narrative template and golden example from phase 001.
- The deep-context gather in this folder's `context/`.

**Deliverables**:
- A rewritten `cli-opencode/README.md` in the narrative voice.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The cli-opencode README is a tabular reference card with no problem-first entry point, and it carries two stale facts: a skill version of 1.0.0 (the skill is 1.3.13.0) and a provider count that contradicts itself (three in section 1, two in the FAQ, when the skill documents seven). It also under-plays the distinctive full-runtime dispatch.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the full-runtime difference and the two non-obvious rules, and dropping the stale version and provider count.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `cli-opencode/README.md` to the narrative skeleton.
- Lead with the full-runtime dispatch and the two non-obvious rules (closed stdin, no top-level `--agent`); list the seven providers accurately.

### Out of Scope

- Any change to SKILL.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-opencode/README.md` | Modify | Narrative-voice rewrite, full-runtime value and traps foregrounded |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Stale facts dropped, providers accurate | No version line, no contradictory count, seven providers listed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean | No em dashes, semicolons, Oxford-comma lists or banned words |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: Every flag, provider and file path cited resolves against the real skill.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft carries the stale version or count | Inaccurate README | Authoring prompt forbade version and count; host verified the seven providers |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep plus host SKILL.md in context |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Providers, traps and stale facts resolved during the gather.
<!-- /ANCHOR:questions -->
