---
title: "Feature Specification: Phase 16: sk-doc Frontmatter Alignment"
description: "Apply the canonical reference/asset frontmatter contract to sk-doc (2/14 references and 7/25 assets carry the detailed block today)."
trigger_phrases:
  - "sk-doc frontmatter alignment"
  - "sk-doc reference frontmatter"
  - "skill frontmatter standardization"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/016-sk-doc"
    last_updated_at: "2026-06-11T10:15:22Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase complete: 39 docs normalized and guidance reconciled"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/frontmatter_templates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-016-sk-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: sk-doc Frontmatter Alignment

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
| **Branch** | `scaffold/016-sk-doc` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 22 |
| **Predecessor** | 015-sk-code-review |
| **Successor** | 017-sk-git |
| **Handoff Criteria** | Coverage check green for the skill; routing smoke passes; packet docs validate strictly |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the Skill reference and asset frontmatter alignment across all public-repo skills specification.

**Scope Boundary**: Frontmatter blocks of `.opencode/skills/sk-doc/references/**/*.md` and `.opencode/skills/sk-doc/assets/**/*.md`, plus scoped Part 2 body edits in sk-doc's own guidance docs (operator decision, 2026-06-11): sk-doc prescribes frontmatter practice for every other skill, so its guidance must teach the decided contract. No SKILL.md or graph-metadata.json changes.

**Dependencies**:
- 001-frontmatter-benefit-investigation must be complete and the operator must have fixed the canonical frontmatter contract it recommends.

**Deliverables**:
- Every sk-doc reference/asset doc conforms to the canonical contract; zero drift between guidance and practice for this skill.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-doc reference/asset frontmatter is inconsistent with the repo-wide contract: 2 of 14 references and 7 of 25 assets carry the detailed memory-style block (trigger_phrases, importance_tier, contextType), while the rest carry title+description only. The decided contract (operator Option B, 2026-06-11) makes the 5-field block the Skill Advisor's flag-gated doc-routing signal. sk-doc is additionally the skill that teaches frontmatter practice to all other skills, and its guidance forbade frontmatter on knowledge files — the opposite of the decided contract — so this phase also reconciles that guidance.

### Purpose
All 14 reference and 25 asset docs in sk-doc carry exactly the canonical frontmatter contract decided after 001, with no leftover unconsumed fields, and sk-doc's own guidance teaches that contract instead of contradicting it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Frontmatter normalization for `.opencode/skills/sk-doc/references/**/*.md` (14 docs, 2 with detailed block)
- Frontmatter normalization for `.opencode/skills/sk-doc/assets/**/*.md` (25 docs, 7 with detailed block)
- Adding the minimal contract to any doc missing frontmatter entirely
- Part 2 guidance reconciliation: frontmatter_templates.md doc-type contract, scaffold skeletons in skill_reference_template.md and skill_asset_template.md, stale memory-search claim rewrites, skill_creation.md contract pointer

### Out of Scope
- Doc body content changes outside the Part 2 guidance-reconciliation file set
- SKILL.md, README.md frontmatter - those have their own template contracts
- graph-metadata.json derived.trigger_phrases curation - owned by skill-advisor registration flow

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/references/**/*.md` | Modify | Normalize frontmatter to canonical contract |
| `.opencode/skills/sk-doc/assets/**/*.md` | Modify | Normalize frontmatter to canonical contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every sk-doc references/assets md file conforms to the canonical frontmatter contract | Sweep script reports 0 nonconforming files for sk-doc |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No doc body content changed outside the Part 2 reconciliation set | git diff shows only frontmatter-block hunks plus the six Part 2 body-edit files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 0 of 39 sk-doc reference/asset docs deviate from the canonical contract
- **SC-002**: Frontmatter sweep for sk-doc matches the repo-wide inventory expectations recorded in 001
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
