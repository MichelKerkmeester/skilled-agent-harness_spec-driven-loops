---
title: "Implementation Summary: Authored Structural-Fingerprint Cards"
description: "Implemented seven-card structural-fingerprint reference set with load-one routing, a shared responsive gate, and evidence-envelope diversification."
trigger_phrases:
  - "structural fingerprint cards"
  - "load on demand design cards"
  - "authored macrostructure cards"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/003-authored-cards"
    last_updated_at: "2026-07-22T18:39:18Z"

    last_updated_by: "implementation-agent"
    recent_action: "Implemented and verified the seven-card reference set"
    next_safe_action: "Select one unused card through the index and record its evidence entry"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/shared/references/structural-fingerprint-cards/index.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-summary-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary: Authored Structural-Fingerprint Cards

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-authored-cards |
| **Status** | Complete |
| **Level** | 2 |
| **Parent Packet** | `012-sk-design-program/004-hallmark-design-system` |
| **Phase** | 3 of 4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented seven independently-authored abstract structural-fingerprint cards, a load-on-demand index, a schema, and one evidence-envelope diversification check under `sk-design`'s shared references. Each card is self-contained, follows the same seven-field contract, and delegates responsive adaptation to one shared gate.

### Files Created / Changed

| File or Group | Action | Purpose |
|---|---|---|
| `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/index.md` | Created | Load-one routing, seven one-line hints, and the shared `structuralFingerprintSelections` evidence envelope |
| `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/card-*.md` (7) | Created | Heading Rail, Layered Body, Deliberate Seams, Action Punctuation, Image Counterweight, Staged Reveal, and Reciprocal Frame |
| `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/schema.md` | Created | Exact seven-field contract, shared responsive gate, evidence-envelope reuse, and authoring lint |
| `.opencode/skills/sk-design/SKILL.md` | Modified | One Structural decisions bullet registers the index and load-one-card rule |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two research syntheses supplied clean-room structural-axis and no-catalog constraints. The Phase 2 motion and owned-asset evidence files supplied the reusable envelope pattern: a versioned shape, explicit field contract, validation, and authority boundary. Seven card identities were then authored independently, registered with one hub-level reference line, and checked by exact exclusion grep plus a seven-heading conformance loop.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Reuse ONLY Hallmark's load-on-demand index and stamp-diversification architecture | Copying the concrete catalogs (macrostructures, component packets, nav/footer archetype codes, theme names) would create a parallel design system and freeze Hallmark's taste inside sk-design; only the loading mechanism transfers (both syntheses' Eliminated Alternatives). |
| Cards are independently authored, abstract fingerprints, not concrete recipes | Preserves sk-design's own design authority while still giving modes and agents structural-diversity decision support. |
| Responsive collapse stays a single shared gate, not baked per card | Mirrors the only architecture element this packet is permitted to reuse from Hallmark (global gates for mobile collapse); prevents 6-8 independently-authored cards from drifting into contradictory concrete collapse rules, which would blur the abstract-fingerprint-vs-concrete-recipe boundary this packet must preserve. |
| Seven cards cover six foreground axes plus one integrated frame | Heading placement, body composition, divider language, button voice, image treatment, and reveal pattern each receive one primary identity; Reciprocal Frame verifies navigation/footer coherence across the whole page. |
| Diversification uses one shared evidence-envelope collection | `structuralFingerprintSelections` reuses the Phase 2 envelope shape and keeps every card from inventing its own stamp format. |
| Architecture-only adoption needs no MIT notice | Hallmark is MIT-licensed (`.opencode/specs/sk-design/012-sk-design-program/001-research/004-hallmark-design-skill-research/external/hallmark/LICENSE`); the load-on-demand idea is adopted clean-room, and the only content that would trigger a notice obligation -- catalog text and recipes -- is excluded by design. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|---|---|---|
| Card field-set completeness (7 fields x 7 cards) | Pass | Conformance loop reported `PASS 7/7` for every card |
| Excluded catalog/theme/code terms | Pass | Required grep emitted no lines and exited 1, meaning zero matches |
| Load-on-demand index (pick one, read one) | Pass | `index.md` sections 1 and 2 |
| Evidence-envelope diversification check | Pass | `index.md` sections 3-6; second-pass dry run excludes the recorded id |
| Responsive-collapse decision recorded | Pass | `spec.md` Scope, `schema.md` section 3, and field 5 in every card |
| Strict packet validation | Pass | `validate.sh --strict`: exit 0, Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Requirement | Actual | Status |
|---|---|---|
| Architecture-only reuse (no code, no network) | Reference-markdown-only design | Pass -- verified via CHK-009 |
| Small load footprint (index vs. full card) | Index lists only id, file, and one-line hint | Pass -- verified via CHK-004 |
| No new write paths or execution surface | Static reference content only | Pass -- verified via CHK-009 |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The cards remain advisory; they do not choose target-specific values or authorize implementation behavior.
- Load-on-demand discipline depends on consumers reading the index and selection envelope without preloading all seven cards.
- The grep gate proves the requested forbidden strings are absent; independent authorship is additionally supported by synthesis-only grounding and manual semantic review.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

The raw external clone named by the planning packet was unavailable by design. Implementation followed the orchestrator's corrected route and used only the two research syntheses. The planned 6-8 range was resolved to seven, and the existing evidence-envelope pattern was reused without an interim stamp.
<!-- /ANCHOR:deviations -->
