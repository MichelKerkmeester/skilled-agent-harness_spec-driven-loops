---
title: "Feature Specification: Authored Structural-Fingerprint Cards"
description: "Author 6-8 independently-authored abstract structural-fingerprint cards for sk-design, load-on-demand, reusing only Hallmark's index/load-one-card architecture -- never its HTML/CSS recipes or catalogs."
trigger_phrases:
  - "structural fingerprint cards"
  - "load on demand design cards"
  - "authored macrostructure cards"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/003-authored-cards"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 3 specification (planned; not implemented)"
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

# Feature Specification: Authored Structural-Fingerprint Cards

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `016-hallmark-adoption` |
| **Predecessor** | `002-evidence-envelopes` |
| **Successor** | `004-brand-first-lane` |
| **Phase** | 3 of 4 |
| **Implements** | `../../014-hallmark-design-skill-research/001-research/research/` (Hallmark adoption research syntheses) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-design has no independently-authored library of abstract structural-fingerprint cards. The only comparable resource is Hallmark's own concrete catalogs -- 21 macrostructures with literal HTML/CSS sketches, ~62 component-packet recipes, N1-N13 nav / Ft1-Ft8 footer archetype codes, and a 20-name catalog theme system -- which are MIT-licensed but constitute a parallel, opinionated design system. Importing them wholesale would freeze Hallmark's taste inside sk-design. Without an sk-design-owned card set, modes and agents have no load-on-demand decision-support layer for structural diversity, and no mechanism to avoid repeating the same shapes -- the "structural sameness" failure modes (SaaS hero, 3-feature row, benefits-then-CTA, everything-fades-in, carbon-copy footer) that Hallmark's own `structure.md` documents as anti-patterns.

### Purpose

Author 6-8 abstract structural-fingerprint cards as sk-design's own decision-support layer. Adopt ONLY Hallmark's load-on-demand index architecture (pick one card, read only that file) paired with a stamp-based diversification check (read the existing stamp before picking; exclude what's already used). Every card's content is independently authored and grounded in `structure.md`'s six axes and the `macrostructures/*` leaf shape -- never in Hallmark's concrete recipes. This phase also fixes, for the whole card set, whether responsive collapse is a per-card property or a single shared gate (see Scope and REQ-003).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Authoring 6-8 independently-authored abstract structural-fingerprint cards, each covering: (1) regions/composition (section-heading placement + body composition); (2) the remaining rhythm axes (divider language, button voice, image treatment, reveal pattern); (3) nav + footer archetype pairing guidance; (4) an applicability guard ("reach for it when / avoid when"); (5) responsive collapse, per the decision below; (6) failure modes grounded in Hallmark's documented anti-patterns of structural sameness; (7) an evidence/stamp requirement recording the structural choice.
- A load-on-demand index: pick ONE card, read ONLY that file -- never load the whole set.
- A stamp-based diversification check: read the existing stamp before picking, exclude cards already used.
- **Responsive-collapse decision (fixed by this spec):** collapse stays a single **shared gate**, not a per-card property. Hallmark itself enforces mobile collapse globally (per-theme section-head collapse; image-track `minmax(0,1fr)`), never as a per-card rule. Baking bespoke collapse behavior into 6-8 independently-authored cards would (a) smuggle a concrete CSS recipe into what must stay an abstract fingerprint, and (b) risk the cards drifting into contradictory collapse rules. Each card's field 5 therefore only names which of its regions/axes the shared gate applies to; it does not redefine collapse.
- A short licensing note: Hallmark is MIT (`.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE`). Adopting the load-on-demand architecture as an idea needs no notice. This packet does not copy Hallmark's catalog text or recipes, so no notice obligation arises here; external images/fonts/third-party assets are skip.

### Out of Scope

- Importing any Hallmark catalog, recipe, or code table: the 21 macrostructure titles and their HTML/CSS sketches; the ~62 component-packet recipes; the N1-N13 nav / Ft1-Ft8 footer archetype codes and recipes; the 20-name catalog theme system.
- Phase 1 (`001-surgical-fixes`) and Phase 2 (`002-evidence-envelopes`) concerns -- handled by their own packets.
- Phase 4 (`004-brand-first-lane`) concerns -- brand-first application of these cards.
- Extracting or vendoring external images, fonts, or other third-party assets (skip).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/index.md` | Create | Load-on-demand index: card id + one-line applicability hint per card; explicit "read only the one you pick" instruction; stamp-based diversification check instructions |
| `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/card-*.md` (6-8 files) | Create | Independently-authored abstract structural-fingerprint cards, one file per card, each with the full seven-field set |
| `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/schema.md` | Create | Card field-set schema, mirroring the existing `shared/procedure-card-schema.md` pattern, plus the recorded responsive-collapse (shared-gate) decision and rationale |
| `.opencode/skills/sk-design/SKILL.md` | Modify | Register the new load-on-demand index as a discoverable reference for modes doing structural decisions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Author 6-8 abstract structural-fingerprint cards | 6-8 independently-authored card files exist under `shared/references/structural-fingerprint-cards/`, each self-contained and readable without loading any other card. |
| REQ-002 | Full seven-field set per card | Every card documents: regions/composition; the remaining rhythm axes (divider, button, image, reveal); nav+footer archetype pairing; an applicability guard; responsive-collapse per REQ-003; failure modes; an evidence/stamp requirement. |
| REQ-004 | Reuse ONLY the load-on-demand index architecture | The index lets a caller pick ONE card and read ONLY that file; no other Hallmark mechanism (catalogs, codes, themes) is reused. |
| REQ-005 | Never copy Hallmark's concrete catalogs | No macrostructure titles, HTML/CSS sketches, component-packet recipes, N1-N13/Ft1-Ft8 codes, or theme names appear anywhere in the authored cards, index, or schema. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Responsive-collapse decision recorded | This spec records, before any card is authored, that collapse is a single shared gate (not baked per card), with the rationale in Scope; each card's field 5 only names the axes the gate covers. |
| REQ-006 | Stamp-based diversification check | Card selection is preceded by reading the existing stamp record and excluding already-used cards, mirroring Hallmark's diversification mechanism at the architecture level only. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 6-8 independently-authored structural-fingerprint cards exist with the full seven-field set; a load-on-demand index (pick one, read only that file) is paired with a stamp-based diversification check; the responsive-collapse decision is recorded with rationale; zero Hallmark catalog titles, recipes, codes, or theme names appear in any authored artifact; `validate.sh --strict` = 0 errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Dependency:** Phase 2 (`002-evidence-envelopes`) stamp/evidence mechanism, which this phase's diversification stamp is designed to reuse or extend. `../../014-hallmark-design-skill-research/001-research/research/` syntheses (`lineages/sol-opencode/research.md` and `lineages/sol-codex/research.md`), specifically their Eliminated Alternatives sections. Hallmark's `structure.md` six axes and `macrostructures/*` leaf shape, read-only, at `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/`.
- **Risk:** unintentionally copying Hallmark's concrete language or structure into card prose (taste-freezing) -- mitigated by REQ-005's explicit exclusion list and the independently-authored requirement.
- **Risk:** ambiguity between "abstract fingerprint" and "concrete recipe" during authoring -- mitigated by grounding each card in `structure.md`'s six axes rather than any macrostructure catalog entry, and by the REQ-003 shared-gate decision keeping collapse recipes out of card content.
- **Licensing:** Hallmark is MIT (`.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE`). The load-on-demand architecture is adopted clean-room as an idea (no notice required). Hallmark's catalog text and recipes are not copied, so no MIT notice obligation arises for this packet. External images, fonts, and third-party assets are out of scope (skip).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- The index stays small enough to read cheaply without loading any card; each card file is self-contained so only the one selected card is ever read per decision.

### Security

- Cards are static, evidence-only reference content; no code execution, no network surface, and no new write paths are introduced.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact count within 6-8 and the identities/names of the cards -- finalized during implementation, grounded in `structure.md`'s six axes (non-blocking; resolved at build).
- Whether the Phase 2 (`002-evidence-envelopes`) stamp mechanism is reused as-is or extended with card-specific fields for the diversification check (resolve once Phase 2 ships).
<!-- /ANCHOR:questions -->
