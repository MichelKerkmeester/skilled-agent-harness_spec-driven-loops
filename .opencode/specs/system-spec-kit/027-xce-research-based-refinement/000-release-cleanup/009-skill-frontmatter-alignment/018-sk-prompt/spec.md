---
title: "Feature Specification: Phase 18: sk-prompt Frontmatter Alignment"
description: "Apply the canonical reference/asset frontmatter contract to sk-prompt (0/2 references and 0/3 assets carry the detailed block today)."
trigger_phrases:
  - "sk-prompt frontmatter alignment"
  - "sk-prompt reference frontmatter"
  - "skill frontmatter standardization"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/018-sk-prompt"
    last_updated_at: "2026-06-11T09:37:49Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase complete: 5 docs authored and verified"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/018-sk-prompt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 18: sk-prompt Frontmatter Alignment

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
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `scaffold/018-sk-prompt` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 22 |
| **Predecessor** | 017-sk-git |
| **Successor** | 019-sk-prompt-small-model |
| **Handoff Criteria** | Coverage check green for the skill; routing smoke passes; packet docs validate strictly |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the Skill reference and asset frontmatter alignment across all public-repo skills specification.

**Scope Boundary**: Frontmatter blocks of `.opencode/skills/sk-prompt/references/**/*.md` and `.opencode/skills/sk-prompt/assets/**/*.md` only. No body-content, SKILL.md, feature_catalog, or graph-metadata.json changes.

**Dependencies**:
- 001-frontmatter-benefit-investigation must be complete and the operator must have fixed the canonical frontmatter contract it recommends.

**Deliverables**:
- Every sk-prompt reference/asset doc conforms to the canonical contract; zero drift between guidance and practice for this skill.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-prompt reference/asset frontmatter is inconsistent with the repo-wide contract: 0 of 2 references and 0 of 3 assets carry the detailed memory-style block (trigger_phrases, importance_tier, contextType), while the rest carry title+description only. The investigation phase (001) showed no runtime consumes the detailed block on these doc types, so the variance is pure drift.

### Purpose
All 2 reference and 3 asset docs in sk-prompt carry exactly the canonical frontmatter contract decided after 001, with no leftover unconsumed fields.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Frontmatter normalization for `.opencode/skills/sk-prompt/references/**/*.md` (2 docs, 0 with detailed block)
- Frontmatter normalization for `.opencode/skills/sk-prompt/assets/**/*.md` (3 docs, 0 with detailed block)
- Adding the minimal contract to any doc missing frontmatter entirely

### Out of Scope
- Doc body content changes - this phase touches only YAML frontmatter
- SKILL.md, README.md, feature_catalog/, manual_testing_playbook/ frontmatter - those have their own template contracts
- graph-metadata.json derived.trigger_phrases curation - owned by skill-advisor registration flow

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/references/**/*.md` | Modify | Normalize frontmatter to canonical contract |
| `.opencode/skills/sk-prompt/assets/**/*.md` | Modify | Normalize frontmatter to canonical contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every sk-prompt references/assets md file conforms to the canonical frontmatter contract | Sweep script reports 0 nonconforming files for sk-prompt |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No doc body content changed | git diff shows only frontmatter-block hunks |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 0 of 5 sk-prompt reference/asset docs deviate from the canonical contract
- **SC-002**: Frontmatter sweep for sk-prompt matches the repo-wide inventory expectations recorded in 001
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001 investigation outcome | Cannot start without a fixed contract | Operator decision recorded in 001 implementation-summary |
| Risk | Stripping fields a future consumer expects | Low | Contract decision documents the consumer audit; git history preserves removed values |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None - scope is mechanical once the contract is fixed by 001.
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
