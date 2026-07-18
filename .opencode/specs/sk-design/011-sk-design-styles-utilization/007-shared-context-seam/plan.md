---
title: "Implementation Plan: shared corpus-context seam"
description: "Level-2 plan for building CORPUS_CONTEXT_PLAN v1 — the neutral corpus-context envelope, the common proof/handoff field set, and the five shared fixtures — as a schema/validator package kept out of the sk-design hub, ahead of the interface/audit pilots."
trigger_phrases:
  - "shared context seam plan"
  - "corpus context plan build"
  - "sk-design shared fixtures plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/007-shared-context-seam"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the shared-context-seam Level-2 planning scaffold"
    next_safe_action: "Build CORPUS_CONTEXT_PLAN v1 envelope and shared proof fields"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-context-seam-011-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: shared corpus-context seam

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Deliverable** | `CORPUS_CONTEXT_PLAN v1` neutral envelope + common proof/handoff fields + five shared fixtures |
| **Location** | A new shared schema/validator package kept OUT of the hub (proposed) |
| **Producer** | The hub intake/registry route (0 hydrated styles, routing-only) |
| **Cost** | ~2–4 engineer-days |
| **Depends on** | Phase 004 (retrieval) |
| **Enables** | Phases 008 (interface/audit pilots), 009, 010 |

### Overview
This phase ships the top-ranked Phase A deliverable from the 003 research: a thin shared seam. It defines one envelope schema, one common field set, and one fixture set, then a validator that enforces the fixed authority order and rejects mode-specific fields. Nothing here selects a mode or hydrates a style; the seam is the neutral substrate every later consumer plugs into. This is a scaffold — implementation is not yet started.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 retrieval output shape is available to feed the intake/registry route
- [ ] The 003 cross-mode contract matrix fields are extracted as the common field set

### Definition of Done
- [ ] `CORPUS_CONTEXT_PLAN v1` envelope validates with 0 hydrated styles
- [ ] The seven common proof/handoff fields are defined once and reused
- [ ] All five shared fixtures validate; negatives pass as successful evidence
- [ ] The fixed authority order is encoded and enforced by the validator
- [ ] No mode-specific field lives in the hub; the hub stays routing-only
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Neutral-envelope seam: the hub intake/registry route produces a `CORPUS_CONTEXT_PLAN v1` object carrying generic capability/proof planning and zero hydrated styles. Each mode later reads the envelope and populates its own mode-specific record using the shared proof/handoff field definitions. Taste and mode selection never enter the hub; the seam is a contract, not a chooser.

### Key Components
- **`CORPUS_CONTEXT_PLAN v1`** — the neutral envelope schema (generic capability/proof planning, 0 hydrated styles).
- **Common proof/handoff fields** — generation identity, source identity, provenance/use-label, semantic role, transformation, fallback, proof-state.
- **Shared fixtures** — positive, no-fit, unavailable, generation-mismatch, unknown-rights.
- **Validator** — enforces the fixed authority order, rejects mode-specific fields, treats negative results as successful evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| New shared schema/validator package (out of hub) | n/a (new, proposed) | Define envelope + fields + fixtures + validator | Envelope validates with 0 hydrated styles; five fixtures pass |
| Hub intake/registry route | Routing | Produce the neutral envelope | Route emits `CORPUS_CONTEXT_PLAN v1`; carries no taste and no mode-specific fields |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Envelope schema
- [ ] Define `CORPUS_CONTEXT_PLAN v1` with generic capability/proof planning and 0 hydrated styles
- [ ] Encode the fixed authority order and its prohibitions in the schema

### Phase 2: Common fields
- [ ] Define the seven proof/handoff fields once (generation identity, source identity, provenance/use-label, semantic role, transformation, fallback, proof-state)
- [ ] Mark proof-state so negative results (`anchor:null`) validate as successful evidence

### Phase 3: Fixtures + validator
- [ ] Author the five shared fixtures (positive, no-fit, unavailable, generation-mismatch, unknown-rights)
- [ ] Build the validator that rejects mode-specific fields and enforces routing-only hub behavior
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Validate the envelope carries 0 hydrated styles and no mode-specific fields.
- Run all five fixtures through the validator; confirm the four negative cases pass as successful evidence, not errors.
- Assert the authority-order guard blocks corpus evidence from selecting a mode, proving accessibility/performance, assigning severity, establishing copying, authorizing exact reuse, or accepting transport output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Phase 004 (retrieval)** — supplies the retrieval output the intake/registry route wraps into the envelope. Blocking.
- **003 research** — `research/lineages/sol/research.md` cross-mode contract matrix defines the common fields and authority order. Read-only.
- **The styles corpus** — consumed as evidence only, never hydrated into the hub.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The shared package is proposed and additive; it lands outside the hub. To roll back, remove the new schema/validator package and revert the intake/registry route to pass-through. Because the envelope carries 0 hydrated styles and no mode consumes it yet, removal has no runtime blast radius on the existing sk-design modes.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Parent**: ../spec.md
- **Source research**: `../003-global-modes-utilization/research/lineages/sol/research.md`
