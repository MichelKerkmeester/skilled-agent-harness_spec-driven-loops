---
title: "Feature Specification: Phase 6: Thin + standardize CLI cards"
description: "Thin the 4 CLI prompt-quality cards that inlined the framework table into delegating mirrors; reconcile the cli-devin semantic fork; pass duplication guard GREEN on all 5 cards."
trigger_phrases:
  - "thin standardize cli cards"
  - "cli prompt card delegation"
  - "cli-devin fork reconciled"
  - "duplication guard cli"
  - "prompt card mirror"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/006-thin-and-standardize-cli-cards"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "sonnet-impl"
    recent_action: "Phase 6 complete"
    next_safe_action: "Proceed to phase 007: wire 3-tier precedence rule + sentinel cross-link into all 5 CLI SKILL.md"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/references/prompt_quality_card.md"
      - ".opencode/skills/cli-gemini/references/prompt_quality_card.md"
      - ".opencode/skills/cli-codex/references/prompt_quality_card.md"
      - ".opencode/skills/cli-claude-code/references/prompt_quality_card.md"
      - ".opencode/skills/cli-devin/references/prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-006-thin-and-standardize-cli-cards"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How to handle cli-devin STAR/BUILD/ATLAS mechanics? -> Reframed as Devin model-selection MECHANICS, kept as addendum, not CLEAR axes"
      - "Where does the 3-tier precedence rule live? -> Added to the canonical card; per-model note in each delegating mirror repoints to the hub"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: Thin + standardize CLI cards

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
| **Phase** | 6 of 8 |
| **Predecessor** | 005-backfill-remaining-profiles |
| **Successor** | 007-wire-precedence-and-crosslinks |
| **Handoff Criteria** | All 5 CLI prompt-quality cards pass duplication guard GREEN; 3-tier precedence rule on canonical card; delegating mirrors in place for 4 cards; cli-devin fork reconciled |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Prompt-knowledge layering across CLI skills, sk-prompt frameworks, and the sk-prompt-models model-craft hub specification.

**Scope Boundary**: Thin the 4 CLI prompt-quality cards that inlined the full framework table down to delegating mirrors. Reconcile the cli-devin semantic fork. Add the 3-tier precedence rule to the canonical card. No changes to SKILL.md files or the model-profiles registry (those are phase 007).

**Dependencies**:
- Phase 005 complete: per-model hub profiles exist for all active small models
- Canonical card in sk-prompt carries the framework table and CLEAR scoring
- Duplication guard script operational

**Deliverables**:
- 4 thinned delegating mirror cards (cli-opencode, cli-gemini, cli-codex, cli-claude-code)
- 1 reconciled cli-devin card with canonical CLEAR adopted and STAR/BUILD/ATLAS reframed as model-selection mechanics
- 3-tier precedence rule added to canonical card
- Duplication guard GREEN on all 5 cards

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 4 CLI prompt-quality cards (cli-opencode, cli-gemini, cli-codex, cli-claude-code) each inlined the complete framework table from the canonical card, producing 89-96 line files that diverged from sk-prompt whenever the table changed. The cli-devin card used STAR/BUILD/ATLAS as framework labels, conflicting with the canonical COSTAR/TIDD-EC/RACE taxonomy. This made framework guidance fragmented across 5 files with no single source of truth.

### Purpose

Reduce all 5 CLI cards to lean delegating mirrors that link the canonical card for framework selection and CLEAR scoring, so that framework guidance has a single source of truth and the duplication guard passes GREEN.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Thin cli-opencode, cli-gemini, cli-codex, cli-claude-code cards from 89-96 lines to delegating mirrors
- Reconcile cli-devin card: adopt canonical CLEAR, reframe STAR/BUILD/ATLAS as model-selection mechanics, delegate SWE-1.6 contract to hub profile
- Add 3-tier precedence rule to canonical card in sk-prompt
- Repoint per-model notes in each mirror to the hub profiles

### Out of Scope
- Changes to CLI SKILL.md files (phase 007)
- Changes to model-profiles.json registry entries (phase 005 owned this)
- New profile creation for any model (phase 005 owned this)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-opencode/references/prompt_quality_card.md` | Modify | Thin 96 -> 37 lines; replace inline table with canonical card link |
| `.opencode/skills/cli-gemini/references/prompt_quality_card.md` | Modify | Thin 89 -> 35 lines; replace inline table with canonical card link |
| `.opencode/skills/cli-codex/references/prompt_quality_card.md` | Modify | Thin 90 -> 28 lines; replace inline table with canonical card link |
| `.opencode/skills/cli-claude-code/references/prompt_quality_card.md` | Modify | Thin 90 -> 44 lines; replace inline table with canonical card link |
| `.opencode/skills/cli-devin/references/prompt_quality_card.md` | Modify | Reconcile fork; adopt CLEAR; reframe STAR/BUILD/ATLAS; delegate SWE-1.6 |
| `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` | Modify | Add 3-tier precedence rule; refresh per-model note to point to hub |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | cli-opencode card thinned to delegating mirror | File < 50 lines; framework table absent; canonical card linked; duplication guard PASS |
| REQ-002 | cli-gemini card thinned to delegating mirror | File < 50 lines; framework table absent; canonical card linked; duplication guard PASS |
| REQ-003 | cli-codex card thinned to delegating mirror | File < 50 lines; framework table absent; canonical card linked; duplication guard PASS |
| REQ-004 | cli-claude-code card thinned to delegating mirror | File < 50 lines; framework table absent; canonical card linked; duplication guard PASS |
| REQ-005 | cli-devin card reconciled | CLEAR adopted; STAR/BUILD/ATLAS reframed as model-selection mechanics; SWE-1.6 delegated to hub; duplication guard PASS |
| REQ-006 | 3-tier precedence rule on canonical card | Rule present in sk-prompt canonical card; per-model notes in mirrors repoint to hub |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | All 5 cards pass duplication guard sweep simultaneously | Duplication guard sweep exits GREEN for all 5 cards |
| REQ-008 | No SKILL.md files modified | git diff shows no changes to any SKILL.md path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Duplication guard exits GREEN for all 5 CLI prompt-quality cards
- **SC-002**: Framework table exists only in the canonical sk-prompt card, not in any delegating mirror
- **SC-003**: cli-devin card uses canonical CLEAR taxonomy with STAR/BUILD/ATLAS scoped as model-selection mechanics, not framework labels
- **SC-004**: 3-tier precedence rule (hub profile > card default > CLEAR baseline) is present on the canonical card
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005 hub profiles | Delegating mirrors link to hub profiles; if profiles are missing links break | Phase 005 verified complete before this phase started |
| Risk | cli-devin STAR/BUILD/ATLAS ambiguity | Reframing may confuse Devin dispatchers that relied on the old labels | Added explicit "model-selection MECHANICS" header to make the distinction unambiguous |
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
