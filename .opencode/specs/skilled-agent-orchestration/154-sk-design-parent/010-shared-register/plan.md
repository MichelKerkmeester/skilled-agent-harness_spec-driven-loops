---
title: "Plan: sk-design shared Brand-vs-Product operating register"
description: "Planned build approach for the shared sk-design operating register and its fill-in routing card. Authors register.md first, then the card, both under sk-design/shared/, gating density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity downstream. Planning record only; no phases executed yet."
trigger_phrases:
  - "sk-design shared register plan"
  - "brand vs product register build plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/010-shared-register"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Drafted the build plan; no phases executed"
    next_safe_action: "Operator approval, then execute Phase 1"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-010-shared-register"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design shared Brand-vs-Product operating register

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown authoring under `sk-design/shared/` |
| **Framework** | sk-doc template discipline; sk-design family conventions |
| **Storage** | Two new files: `shared/register.md` and `shared/assets/register_card.md` |
| **Testing** | Manual review against the 009 research rationale + `validate.sh --strict` on this packet |

### Overview
Author the shared Brand-vs-Product operating register first, then the one-page fill-in routing card that operationalizes it. The register declares whether a design IS the product (brand/landing: bolder, more expressive, more motion) or SERVES the product (app/task: calmer, denser, restrained), and from that single declaration it gates the downstream dials: density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity. The card turns that register into a one-page fill-in with the Brand vs Product questions and the per-mode defaults to apply. Both are shared content under `sk-design/shared/`, referenced by the interface, audit, foundations, and motion modes rather than duplicated. This is a planning record; no phase has run yet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `../009-reference-asset-expansion/research/research.md` sections 3.1, 4, and 5 read as the rationale and scope
- [x] The `sk-design/shared/` home and the consuming modes confirmed against the live tree
- [x] The dial vocabulary (density, motion budget, color dosage, copy register, anti-slop strictness, audit severity) agreed before authoring

### Definition of Done
- [x] `shared/register.md` declares the Brand-vs-Product distinction and gates all six downstream dials
- [x] `shared/assets/register_card.md` is a one-page fill-in card with the questions and per-mode defaults
- [x] Both files live under `sk-design/shared/` as referenceable shared content, not a new sub-skill
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Author-once shared content → referenced by multiple modes (no duplication across interface, audit, foundations, motion).

### Key Components
- **`shared/register.md`**: the operating register. Declares Brand (IS the product) vs Product (SERVES the product) and maps each to downstream defaults for density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity.
- **`shared/assets/register_card.md`**: the one-page fill-in routing card. Brand vs Product questions plus the downstream defaults each mode should apply once the mode is chosen.

### Data Flow
A design surface → answer the card's Brand-vs-Product questions → resolve the register mode → the register's per-dial defaults gate density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity in the consuming modes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds two new shared files under `sk-design/shared/` and changes no existing mode SKILL, reference, or asset. The interface, audit, foundations, and motion modes will reference the register in their own later phases; they are read-only context here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design/shared/register.md` | does not exist | create | file present; declares Brand-vs-Product and gates the six dials |
| `.opencode/skills/sk-design/shared/assets/register_card.md` | does not exist | create | file present; one-page fill-in with questions + per-mode defaults |
| `.opencode/skills/sk-design/` mode SKILLs | consuming modes | none (referenced later) | unchanged this phase |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `../009-reference-asset-expansion/research/research.md` sections 3.1, 4, and 5 for rationale and scope
- [x] Confirm the `sk-design/shared/` home and the consuming modes against the live tree
- [x] Agree the dial vocabulary and the Brand-vs-Product posture before authoring

### Phase 2: Core Implementation
- [x] Author `.opencode/skills/sk-design/shared/register.md` (Brand-vs-Product declaration + the six downstream dial defaults) FIRST
- [x] Author `.opencode/skills/sk-design/shared/assets/register_card.md` (one-page fill-in: questions + per-mode defaults)
- [x] Cross-check the card's defaults against the register so the two stay consistent

### Phase 3: Verification
- [x] Confirm the register gates all six dials and is written as referenceable shared content (not a sub-skill)
- [x] Confirm the card is a single page and resolves to the register's modes
- [x] Run `validate.sh --strict` on this packet and reconcile completion metadata
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Register declares Brand-vs-Product and gates the six dials | Read-through against 009 research rationale |
| Manual | Card is one page and resolves to the register modes | Read-through of `register_card.md` |
| Manual | Packet metadata + doc consistency | `validate.sh --strict` on this packet |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../009-reference-asset-expansion/research/research.md` | Internal | Green | Scope/rationale cannot be grounded |
| Live `sk-design/` tree | Internal | Green | `shared/` home and consumers unconfirmed |
| Operator approval to execute | External | Pending | Phase stays planned; no files built |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The register or card does not cleanly gate the downstream dials, or the shared-content shape is wrong.
- **Procedure**: The phase adds only two isolated files under `sk-design/shared/`; delete them to revert. No existing mode SKILL, reference, or asset is mutated this phase, so rollback is a two-file removal.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
