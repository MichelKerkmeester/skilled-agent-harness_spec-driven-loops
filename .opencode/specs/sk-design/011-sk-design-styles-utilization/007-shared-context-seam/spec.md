---
title: "Feature Specification: shared corpus-context seam for sk-design modes"
description: "Level-2 implementation-phase scaffold for Phase A of the global-modes utilization research: the thin, neutral corpus-context envelope (CORPUS_CONTEXT_PLAN v1) plus common proof/handoff fields and shared fixtures that let every non-md-generator sk-design mode consume the styles library without moving taste logic into the hub."
trigger_phrases:
  - "shared context seam"
  - "corpus context plan envelope"
  - "sk-design shared proof fields"
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
    open_questions:
      - "Which fixtures beyond the five seed cases must ship in v1 before the pilots consume them?"
    answered_questions:
      - "The seam is a neutral envelope; mode-specific fields stay out of the hub."
---

# Feature Specification: shared corpus-context seam for sk-design modes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete — implemented, reviewed, verified (28/28 tests) |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `../006-md-generator-study-exemplars/` |
| **Successor** | `../008-interface-audit-pilots/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 003 global-modes research settled that the styles library is a mode-owned evidence system, not a hub-level style chooser, and that its top-ranked, ship-first deliverable is a thin shared seam (Phase A). Without that seam, each non-md-generator mode — `design-interface`, `design-foundations`, `design-motion`, `design-audit`, and the `design-mcp-open-design` transport — would hand-roll its own corpus-context shape, its own proof/handoff fields, and its own fixtures, duplicating structure and risking taste logic leaking into the hub. There is no neutral envelope, no common proof vocabulary, and no shared fixture set today.

### Purpose
Build the shared, neutral corpus-context envelope that lets every sk-design mode consume the styles library without putting taste logic in the hub. The seam provides one envelope produced by the hub intake/registry route (`CORPUS_CONTEXT_PLAN v1`, zero hydrated styles), one common set of proof/handoff fields reused across modes, and one shared fixture set — while keeping every mode-specific decision field out of the hub and the hub strictly routing-only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `CORPUS_CONTEXT_PLAN v1`: a neutral envelope produced by the hub intake/registry route carrying generic capability/proof planning with **0 hydrated styles** — no taste, no mode selection.
- Common shared fields across all mode proof/handoff records: generation identity, source identity, provenance/use-label, semantic role, transformation, fallback, and proof-state.
- Shared fixtures covering the five seed cases: positive, no-fit, unavailable, generation-mismatch, and unknown-rights.
- The FIXED AUTHORITY ORDER that every consuming mode inherits (see Requirements).

### Out of Scope
- Any mode-specific field or decision logic — those stay in the mode packets (pilots land in `../008-interface-audit-pilots/` and later phases).
- The hub becoming anything other than routing-only; the hub never hydrates styles or renders taste.
- Retrieval itself (owned by phase 004) and md-generator work (owned by 002).
- Implementing the interface/audit/foundations/motion/open-design consumers.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| A new shared schema/validator package (kept OUT of the hub) | Create — proposed | The `CORPUS_CONTEXT_PLAN v1` envelope schema, the common proof/handoff field definitions, the five shared fixtures, and their validator. Marked proposed; not yet built. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Neutral envelope exists | `CORPUS_CONTEXT_PLAN v1` is produced by the hub intake/registry route with 0 hydrated styles and carries only generic capability/proof planning, no taste and no mode selection. |
| REQ-002 | Fixed authority order encoded | The seam encodes the order: user brief & owned system > selected mode judgment > target evidence & deterministic checks > corpus reference evidence > transport output. Corpus evidence may explain relationships and sharpen critique but may NOT select a mode, prove accessibility/performance, assign severity, establish copying, authorize exact reuse, or accept transport output. |
| REQ-003 | Common proof/handoff fields | The shared field set — generation identity, source identity, provenance/use-label, semantic role, transformation, fallback, proof-state — is defined once and reused by all consuming modes. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Shared fixtures ship | Positive, no-fit, unavailable, generation-mismatch, and unknown-rights fixtures exist and validate against the schema. |
| REQ-005 | Hub stays routing-only | Mode-specific fields are absent from the hub; the hub only routes and never hydrates styles or holds taste logic. |
| REQ-006 | Negative results are successful evidence | The schema treats no-fit, comparison-unavailable, and `anchor:null` as valid, successful outcomes to surface — not errors to hide. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single `CORPUS_CONTEXT_PLAN v1` envelope schema exists in the proposed shared package with 0 hydrated styles.
- **SC-002**: The seven common proof/handoff fields are defined once and referenced (not copied) by prospective mode consumers.
- **SC-003**: All five shared fixtures validate; the negative cases (no-fit, unavailable, generation-mismatch, unknown-rights) pass as successful evidence.
- **SC-004**: The fixed authority order is stated in the schema/validator such that corpus evidence cannot be used to select a mode, prove accessibility/performance, assign severity, establish copying, authorize exact reuse, or accept transport output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Taste logic leaks into the hub | High | The envelope carries 0 hydrated styles; the hub stays routing-only; mode-specific fields are rejected by the validator. |
| Risk | Shared fields over-fit the first pilot | Medium | Fields are drawn from the cross-mode contract matrix in the 003 research, not from one mode; the two contrasting pilots (interface + audit) stabilize them in `../008-interface-audit-pilots/`. |
| Dependency | Phase 004 (retrieval) | Blocking | The seam consumes retrieval output; the envelope is produced by the intake/registry route that phase 004 feeds. |
| Dependency | 003 research architecture | Read-only | `../003-global-modes-utilization/research/lineages/sol/research.md` (mode-owned-evidence model, Phase A definition) is the source of truth for field and authority-order shapes. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the shared package live under `sk-design/shared/` or a sibling schema module, given it must stay OUT of the hub while being importable by every mode?
- Which fixtures beyond the five seed cases (positive, no-fit, unavailable, generation-mismatch, unknown-rights) must ship in v1 before the interface/audit pilots consume the seam?
- How is `proof-state` represented so that a negative result (`anchor:null`) is unambiguously a success, not a validation failure?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: ../spec.md
- **Predecessor**: `../006-md-generator-study-exemplars/`
- **Successor**: `../008-interface-audit-pilots/`
- **Source research**: `../003-global-modes-utilization/research/lineages/sol/research.md` (Phase A shared contract seam)
- **Dependency**: `../004-*` (retrieval)
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
