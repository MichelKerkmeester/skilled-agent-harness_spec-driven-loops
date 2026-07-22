---
title: "Implementation Plan: Authored Structural-Fingerprint Cards"
description: "Planned implementation route for authoring, indexing, and registering the Phase 3 structural-fingerprint card set; nothing built yet."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/003-authored-cards"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 3 implementation plan (planned)"
    next_safe_action: "Await Phase 2 (002-evidence-envelopes) completion, then begin Phase 3 implementation per"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Authored Structural-Fingerprint Cards

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Markdown-only reference content inside the `sk-design` skill; no runtime code, command, or mode-registry identity changes. Grounded in Hallmark's `structure.md` (six axes) and `macrostructures/*` (leaf shape), read read-only at `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/`, plus the 014 research syntheses (`lineages/sol-opencode/research.md`, `lineages/sol-codex/research.md`).

### Overview

Build 6-8 independently-authored abstract structural-fingerprint cards, a load-on-demand index that lets a caller read exactly one card, and a stamp-based diversification check that excludes already-used cards before selection. Register the index with `sk-design/SKILL.md` so modes can discover it. Nothing in this plan starts until Phase 2 (`002-evidence-envelopes`) ships its stamp/evidence mechanism, which the diversification check is designed to reuse or extend.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Phase 2 (`002-evidence-envelopes`) stamp/evidence envelope mechanism is available for reference, or an interim stamp shape is explicitly documented as a stand-in.
- The 014 research syntheses and Hallmark's `structure.md` / `macrostructures/*` are accessible read-only.
- The REQ-003 responsive-collapse decision (shared gate, fixed in spec.md) is understood by whoever authors the cards.

### Definition of Done

- 6-8 cards, the index, and the stamp/diversification check are authored; the responsive-collapse decision is applied consistently across all cards; a targeted grep for Hallmark catalog terms returns zero hits; `validate.sh --strict` passes; `checklist.md` is fully satisfied with evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Load-on-demand index plus independently-authored card files. The pattern (index + one-card-at-a-time read + stamp-based diversification) is reused from Hallmark; every card's content is authored fresh for sk-design.

### Data Flow

A caller (mode or agent) reads the diversification stamp, excludes cards already used, reads the index (card id + one-line applicability hint only -- never full card content), selects ONE card matching the current context, reads ONLY that one card file, applies its guidance (including the shared responsive-collapse gate, not a per-card rule), and records a new stamp entry.

### Key Components

- `index.md` -- the load-on-demand index and diversification-check instructions.
- `card-*.md` (6-8 files) -- the independently-authored cards.
- `schema.md` -- the field-set schema and the recorded responsive-collapse (shared-gate) decision.
- The Phase 2 stamp/evidence mechanism, reused or extended for card-selection diversification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup & Decision

Read the grounding references (`structure.md` six axes, `macrostructures/*` leaf shape, both synthesis documents' Eliminated Alternatives sections); confirm the REQ-003 shared-gate responsive-collapse decision is applied consistently when scaffolding the card template; scaffold the `shared/references/structural-fingerprint-cards/` directory.

### Phase 2: Card Authoring & Index

Author 6-8 independently-authored abstract cards with the full seven-field set; author the load-on-demand index; author the stamp-based diversification check, coordinated with the Phase 2 (`002-evidence-envelopes`) stamp/evidence mechanism.

### Phase 3: Registration & Verification

Register the new index in `sk-design/SKILL.md`; grep the authored files for Hallmark catalog terms and confirm zero hits; run `validate.sh --strict` and reconcile `checklist.md` with evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This is a content-only packet, so verification is manual and grep-based rather than automated unit tests. A targeted grep for Hallmark catalog terms (macrostructure titles, N1-N13/Ft1-Ft8 codes, theme names, literal HTML/CSS sketches) across every new file must return zero hits. Manual per-card review confirms all seven required fields are present. `validate.sh --strict` verifies spec-folder structural compliance.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 2 (`002-evidence-envelopes`) stamp/evidence mechanism, reused or extended for the card diversification stamp.
- `../../014-hallmark-design-skill-research/001-research/research/` syntheses (authoritative grounding and Eliminated Alternatives rationale).
- Hallmark `structure.md` (six axes) and `macrostructures/*` (leaf shape) -- read-only, architecture-only grounding at `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/` (MIT-licensed).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All changes are additive markdown reference files plus a registration edit to `SKILL.md`. Rollback is a git revert of the new `shared/references/structural-fingerprint-cards/` directory and the `SKILL.md` edit; there is no data migration or runtime state to unwind.
<!-- /ANCHOR:rollback -->
