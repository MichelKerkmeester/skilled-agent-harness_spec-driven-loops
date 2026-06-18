---
title: "Implementation Plan: cli-doc-alignment"
description: "Align 9 cli-* docs to the sk-doc asset/reference templates via delegated subagents, then verify + commit."
trigger_phrases:
  - "cli doc alignment plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "130-prompt-knowledge-layering/012-cli-doc-alignment"
    last_updated_at: "2026-06-03T10:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 012 plan"
    next_safe_action: "Validate then commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli-doc-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (cli-* assets + references) |
| **Framework** | sk-doc asset + reference templates |
| **Storage** | None |
| **Testing** | card-sync guard + OVERVIEW grep + spec-ref grep + validate.sh --strict |

### Overview
Conform the executor doc surface to the sk-doc templates. The repetitive restructure was delegated
to two subagents against the exact templates (one for the 5 cards, one for the rubric + 3
references), then verified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Templates identified; per-file deviations surveyed

### Definition of Done
- [ ] 9 docs aligned; guard green; no ephemeral refs; validate --strict exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template conformance + single-source delegation. Cards stay thin and delegate the framework/CLEAR
tables to the canonical card.

### Key Components
- **cli-* cards** — asset-template shell, delegating tables.
- **confidence-scoring-rubric** — asset-template shell.
- **cli-opencode references** — reference-template shell.

### Data Flow
Operator composes a dispatch prompt: shared layer (canonical card) → model overrides (card) → precedence rule.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Survey the 9 docs' current structure; read the templates.

### Phase 2: Core Implementation
- [x] Align 5 cards to asset template (delegated)
- [x] Align rubric + 3 references to asset/reference templates + ephemeral scrub (delegated)
- [x] Version bumps + changelogs for the 5 cli skills

### Phase 3: Verification
- [ ] guard green + OVERVIEW present + no ephemeral refs + validate --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | OVERVIEW + ALL-CAPS + RELATED RESOURCES last | grep |
| Regression | Cards don't inline tables | card-sync guard |
| Hygiene | No ephemeral spec refs | grep |
| Doc | Spec-folder integrity | validate.sh --recursive --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc templates | Internal | Green | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a card starts inlining a table or a reference loses content.
- **Procedure**: per-file git revert; all changes are isolated doc edits on `main`.
<!-- /ANCHOR:rollback -->
