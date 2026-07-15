---
title: "Feature Specification: Phase 7 — Wire precedence + crosslinks"
description: "Insert a uniform 3-tier prompt-composition precedence block into all 5 cli-* SKILL.md files, reconcile cli-devin's bespoke compose mandate, refresh the canonical card's Mirror Sync section, and repoint pattern-index.md rows to hub profiles."
trigger_phrases:
  - "wire precedence"
  - "crosslinks cli skills"
  - "3-tier prompt composition"
  - "sk-prompt-models hub reference"
  - "cli-* precedence block"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/007-wire-precedence-and-crosslinks"
    last_updated_at: "2026-06-02T18:04:15Z"
    last_updated_by: "agent"
    recent_action: "Spec completed — all requirements met"
    next_safe_action: "Proceed to phase 008-validate-sweep-changelog-reindex"
    blockers: []
    key_files:
      - ".opencode/skills/cli-devin/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-gemini/SKILL.md"
      - ".opencode/skills/sk-prompt-models/references/pattern-index.md"
      - ".opencode/skills/sk-prompt-models/SKILL.md"
    session_dedup:
      fingerprint: "sha256:38fe68bc403651b05e50bebfeb0c4b0a661aede11c5927a95189818c2d58772d"
      session_id: "007-wire-precedence-and-crosslinks-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How should cli-devin's bespoke compose mandate coexist with the 3-tier rule? Reconciled: honor the swe-1.6 profile + the 3-tier rule."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7 — Wire precedence + crosslinks

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-thin-and-standardize-cli-cards |
| **Successor** | 008-validate-sweep-changelog-reindex |
| **Handoff Criteria** | All 5 cli-* SKILL.md carry the 3-tier precedence block; cli-devin mandate reconciled; canonical card duplication-guard live; pattern-index rows point to hub profiles |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Prompt-knowledge layering across CLI skills, sk-prompt frameworks, and the sk-prompt-models model-craft hub specification.

**Scope Boundary**: SKILL.md files for all 5 cli-* skills, cli-devin's prompt_templates.md, the sk-prompt-models canonical card, and pattern-index.md. No executor mechanics, no model profile JSON, no tests.

**Dependencies**:
- Phase 006 thinned and standardized cli-* cards — this phase builds on that baseline.
- sk-prompt-models hub profiles (`references/models/`) must exist for the pattern-index repoint to be valid.

**Deliverables**:
- Identical 3-tier precedence block in all 5 cli-* SKILL.md files
- Reconciled cli-devin mandate in SKILL.md and prompt_templates.md
- Duplication-guard description replacing the stale Mirror Sync section in sk-prompt-models SKILL.md
- pattern-index.md MiniMax and MiMo rows pointing to hub profiles; cli-opencode ownership cell updated to craft-vs-mechanics

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each cli-* skill defined prompt-composition guidance independently, so a caller could not predict which rule prevailed when two constraints matched the same dispatch. cli-devin's "MUST compose through sk-prompt" mandate conflicted with the hub-profile lookup that sk-prompt-models introduced, and the canonical card's Mirror Sync section described a dead process. The pattern-index rows for MiniMax and MiMo pointed to fragmented framework notes rather than the hub profiles that are now the authoritative source.

### Purpose
Enforce a single, unambiguous 3-tier prompt-composition decision order across all 5 cli-* skills and ensure that every cross-reference in the skill layer points to the hub rather than to ad-hoc local copies.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Insert the 3-tier precedence block (fast path / model override via hub / deep path) into all 5 cli-* SKILL.md files
- Reconcile cli-devin's bespoke compose mandate in SKILL.md and prompt_templates.md to coexist with the 3-tier rule
- Replace the stale Mirror Sync section in sk-prompt-models SKILL.md with a duplication-guard description
- Repoint pattern-index.md MiniMax and MiMo rows to hub profiles; update cli-opencode ownership cell to craft-vs-mechanics

### Out of Scope
- Model profile JSON edits — owned by sk-prompt-models hub maintenance
- Executor mechanics (binary flags, invocation wrappers) — owned by cli-opencode and cli-devin
- Test fixtures or benchmark profiles — out of scope for a wiring phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-devin/SKILL.md` | Modify | Insert 3-tier precedence block; reconcile bespoke compose mandate |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | Insert 3-tier precedence block; update ownership cell description |
| `.opencode/skills/cli-claude-code/SKILL.md` | Modify | Insert 3-tier precedence block |
| `.opencode/skills/cli-codex/SKILL.md` | Modify | Insert 3-tier precedence block |
| `.opencode/skills/cli-gemini/SKILL.md` | Modify | Insert 3-tier precedence block |
| `.opencode/skills/cli-devin/references/prompt_templates.md` | Modify | Reconcile bespoke compose mandate to align with 3-tier rule |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Modify | Replace stale Mirror Sync section with duplication-guard description |
| `.opencode/skills/sk-prompt-models/references/pattern-index.md` | Modify | Repoint MiniMax and MiMo rows; update cli-opencode ownership cell |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 cli-* SKILL.md files contain the identical 3-tier precedence block | Read each file after edit and confirm the block is present and textually identical |
| REQ-002 | cli-devin mandate in SKILL.md no longer conflicts with hub-profile lookup | Both files read as consistent: honor swe-1.6 profile AND the 3-tier rule |
| REQ-003 | sk-prompt-models canonical card no longer contains Mirror Sync section | Grep for "Mirror Sync" returns no hit in the file |
| REQ-004 | pattern-index.md MiniMax and MiMo rows point to hub profiles | Rows reference `references/models/minimax.md` and `references/models/mimo.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | cli-opencode ownership cell updated to craft-vs-mechanics | pattern-index.md cell reads "craft-vs-mechanics" (or equivalent) |
| REQ-006 | cli-devin prompt_templates.md mandate reconciled | File no longer contains language that unconditionally overrides the hub profile |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every cli-* SKILL.md contains a 3-tier precedence block referencing sk-prompt-models as tier 2
- **SC-002**: cli-devin compose mandate is internally consistent across SKILL.md and prompt_templates.md
- **SC-003**: pattern-index.md hub rows point to canonical hub profile files, not to cli-* skill trees
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-prompt-models hub profiles (`references/models/`) must exist | Repoint would point at missing files | Confirm files exist before editing pattern-index.md |
| Risk | Verbatim block drift across 5 files | Tier-order inconsistency reappears | Use identical copy-paste; no per-file customisation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All questions resolved during implementation.
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
