---
title: "Feature Specification: sk-design shared Brand-vs-Product operating register"
description: "Planned Level-1 implementation phase: build the shared Brand-vs-Product operating register and its fill-in routing card for sk-design. The register declares whether a design IS the product or SERVES it, and gates density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity downstream. Planning record only; nothing is built yet."
trigger_phrases:
  - "sk-design shared register"
  - "brand vs product operating register"
  - "design register card"
  - "sk-design density motion gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/010-shared-register"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built shared/register.md and register_card.md, sk-design check passes"
    next_safe_action: "Execute 011-interface-audit-core (depends on this register)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-010-shared-register"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design shared Brand-vs-Product operating register

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
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
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../009-reference-asset-expansion/spec.md (the research that ranked this #1) |
| **Successor** | ../011-interface-audit-core/spec.md (planned) |
| **Handoff Criteria** | `shared/register.md` and `shared/assets/register_card.md` exist under `.opencode/skills/sk-design/`; the register declares the Brand-vs-Product distinction and gates density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity; the card operationalizes it as a one-page fill-in |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design family has no shared declaration of whether a given design IS the product or SERVES the product. A brand or landing surface wants bolder expression, more motion, and richer color; an app or task surface wants calmer, denser, restrained output. Today every mode (interface, foundations, motion, audit) makes that judgment implicitly and inconsistently, so density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity are not gated by a single shared signal. The deep-research deliverable in `../009-reference-asset-expansion/research/research.md` ranked this shared operating register the #1 must-add prerequisite, found independently by both research lineages, and the prerequisite that unblocks the most downstream work.

### Purpose
Build a single shared operating register that names the Brand-vs-Product distinction once and gates the downstream dials from it, plus a one-page fill-in routing card that operationalizes the register at the point of use. The register is shared content, not a sixth sub-skill: it is authored once under `sk-design/shared/` and referenced by the interface, audit, foundations, and motion modes. This phase is the prerequisite that the later interface, audit, foundations, and motion phases depend on. This spec is a planning record only; nothing is built yet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A shared operating register that declares whether a design IS the product (brand/landing surface) or SERVES the product (app/task surface).
- The register gating, from that single declaration, the downstream defaults for density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity.
- A one-page fill-in routing card that asks the Brand-vs-Product questions and states the downstream defaults each mode should apply.

### Out of Scope
- A sixth "intake" or "register" sub-skill — the register is shared content, not a new mode.
- The interface, audit, foundations, and motion references and assets that consume the register (each is its own later phase).
- Any change to existing `sk-design/` mode SKILLs or their current references and assets in this phase.

### Inputs (read-only)
- The ranked deliverable and rationale: `../009-reference-asset-expansion/research/research.md` (sections 3.1 "Shared base", 4 "Family-Wide Priority Ranking", 5 "Recommended Implementation Sequence").
- The live `sk-design/` tree, to confirm the `shared/` home and the consuming modes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/register.md` | Create (planned) | Brand-vs-Product operating register; gates density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity downstream |
| `.opencode/skills/sk-design/shared/assets/register_card.md` | Create (planned) | One-page fill-in routing card: Brand vs Product questions plus the downstream defaults each mode should apply |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shared register declares the Brand-vs-Product distinction | `.opencode/skills/sk-design/shared/register.md` exists and states whether a design IS the product (brand/landing) or SERVES the product (app/task), with the operating posture for each |
| REQ-002 | The register gates the downstream dials from that one declaration | The register maps the Brand-vs-Product mode to defaults for density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A one-page fill-in routing card operationalizes the register | `.opencode/skills/sk-design/shared/assets/register_card.md` exists with the Brand vs Product questions and the per-mode downstream defaults to apply |
| REQ-004 | The register is shared, not a sub-skill | The register and card live under `sk-design/shared/` and are written to be referenced by the interface, audit, foundations, and motion modes rather than duplicated in each |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.opencode/skills/sk-design/shared/register.md` declares the Brand-vs-Product distinction and gates density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity from it.
- **SC-002**: `.opencode/skills/sk-design/shared/assets/register_card.md` is a one-page fill-in card with the Brand vs Product questions plus the downstream defaults each mode should apply, and both files live under `sk-design/shared/` as referenceable shared content.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Register grows into a sixth sub-skill | Family taxonomy drifts; duplicated routing | Keep it as shared content under `sk-design/shared/`; one register, referenced by the modes |
| Risk | Downstream dials defined here conflict with each mode's existing prose | Inconsistent gating | Author the register as the single source for the dials; later mode phases reference it rather than re-declare |
| Dependency | `../009-reference-asset-expansion/research/research.md` | Scope cannot be grounded | Read sections 3.1, 4, and 5 as the rationale for the register and the card |
| Dependency | Live `sk-design/` tree | `shared/` home unconfirmed | Confirm the `shared/` location and the consuming modes before authoring |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact dial vocabulary and default values per Brand-vs-Product mode — finalize at build time against the register sources cited in the 009 research.
- Whether the card lists every downstream mode's defaults inline or links per mode — decide at build time to keep the card to one page.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
