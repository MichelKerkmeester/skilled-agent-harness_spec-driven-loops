---
title: "Implementation Plan: Phase 6: Thin + standardize CLI cards"
description: "Thin 4 CLI prompt-quality cards from 89-96 line inline duplicates to delegating mirrors; reconcile cli-devin semantic fork; add 3-tier precedence rule to canonical card."
trigger_phrases:
  - "thin cli cards plan"
  - "cli prompt card implementation plan"
  - "006 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/006-thin-and-standardize-cli-cards"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "sonnet-impl"
    recent_action: "Phase complete"
    next_safe_action: "Proceed to phase 007"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-006-thin-and-standardize-cli-cards"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: Thin + standardize CLI cards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-prompt framework table + CLEAR scoring |
| **Storage** | None (file edits only) |
| **Testing** | Duplication guard script |

### Overview

This phase converts 4 CLI prompt-quality cards (cli-opencode, cli-gemini, cli-codex, cli-claude-code) from 89-96 line files that each inlined the full framework table into lean delegating mirrors that link the canonical card. The cli-devin card (49 LOC) is reconciled: STAR/BUILD/ATLAS are reframed as Devin model-selection mechanics rather than prompt-construction framework labels, and the card adopts canonical CLEAR axes. The 3-tier precedence rule is added to the canonical card. All 5 cards pass the duplication guard GREEN on completion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 005 hub profiles confirmed complete for all active small models
- [x] Canonical card in sk-prompt confirmed to carry framework table + CLEAR scoring
- [x] Duplication guard script confirmed operational

### Definition of Done
- [x] All 5 delegating mirrors in place (4 thinned + 1 reconciled cli-devin)
- [x] Duplication guard exits GREEN for all 5 cards simultaneously
- [x] 3-tier precedence rule present on canonical card
- [x] No SKILL.md files modified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation delegation — each CLI card retains executor-specific dispatch mechanics and links out to the canonical layer for framework selection logic. Hub profiles carry per-model overrides.

### Key Components
- **Canonical card** (`sk-prompt/assets/cli_prompt_quality_card.md`): owns the framework table, CLEAR scoring, and 3-tier precedence rule
- **Delegating mirrors** (5 CLI `references/prompt_quality_card.md` files): own executor dispatch mechanics; link to canonical card for everything else
- **Hub profiles** (`sk-prompt-models/references/models/`): own per-model prompt-craft overrides (framework preference, token budget, output-verification contract)

### Data Flow
Executor dispatch consults local card for mechanics -> card links to canonical for framework selection -> canonical links to hub profile for per-model overrides. No duplication at any layer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| cli-opencode card | Inline framework table (duplicate) | Replace with delegating mirror | Duplication guard PASS |
| cli-gemini card | Inline framework table (duplicate) | Replace with delegating mirror | Duplication guard PASS |
| cli-codex card | Inline framework table (duplicate) | Replace with delegating mirror | Duplication guard PASS |
| cli-claude-code card | Inline framework table (duplicate) | Replace with delegating mirror | Duplication guard PASS |
| cli-devin card | STAR/BUILD/ATLAS as framework labels (semantic fork) | Reconcile — CLEAR adopted; STAR/BUILD/ATLAS as mechanics addendum | Duplication guard PASS |
| sk-prompt canonical card | Source of truth for framework table | Add 3-tier precedence rule | Manual review |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 005 hub profiles exist
- [x] Confirm canonical card content is current
- [x] Record baseline line counts for all 5 cards

### Phase 2: Core Implementation
- [x] Thin cli-opencode card 96 -> 37 lines
- [x] Thin cli-gemini card 89 -> 35 lines
- [x] Thin cli-codex card 90 -> 28 lines
- [x] Thin cli-claude-code card 90 -> 44 lines
- [x] Reconcile cli-devin card: adopt CLEAR, reframe mechanics, delegate SWE-1.6
- [x] Add 3-tier precedence rule to canonical card

### Phase 3: Verification
- [x] Duplication guard GREEN on all 5 cards individually
- [x] Full 5-card sweep exits GREEN
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Duplication guard | All 5 CLI prompt-quality cards | Duplication guard script |
| Manual review | cli-devin mechanics reframing correct | Direct file inspection |
| Line count check | 4 thinned cards at expected LOC | wc -l |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 hub profiles | Internal | Green | Delegating mirrors cannot link to missing profile paths |
| Canonical card in sk-prompt | Internal | Green | Nothing to delegate to without the canonical source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Duplication guard fails or downstream dispatch breaks due to missing framework table in a card
- **Procedure**: Revert individual card to its pre-phase state via git checkout on the specific file; the canonical card is unaffected by rollback of individual mirrors
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
