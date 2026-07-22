---
title: "Implementation Summary: Authored Structural-Fingerprint Cards"
description: "Forward-looking summary of the planned Phase 3 structural-fingerprint card set: what will be built, decisions fixed now, and verification still pending."
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
    recent_action: "Authored the forward-looking Phase 3 implementation record"
    next_safe_action: "Await Phase 2 (002-evidence-envelopes) completion, then begin Phase 3 implementation per"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-summary-session"
      parent_session_id: null
    completion_pct: 0
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
| **Status** | Planned |
| **Level** | 2 |
| **Parent Packet** | `016-hallmark-adoption` |
| **Phase** | 3 of 4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been implemented yet -- this packet's status is Planned. Once Phase 2 (`002-evidence-envelopes`) completes and implementation begins, this phase will create 6-8 independently-authored abstract structural-fingerprint cards, a load-on-demand index (pick one, read only that file), a stamp-based diversification check, and a schema doc recording the field set and the responsive-collapse decision, all under `sk-design`'s existing `shared/references/` pattern.

### Files Created / Changed

| File or Group | Action | Purpose |
|---|---|---|
| `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/index.md` | Planned | Load-on-demand index and diversification-check instructions |
| `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/card-*.md` (6-8) | Planned | Independently-authored abstract structural-fingerprint cards |
| `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/schema.md` | Planned | Field-set schema plus the recorded responsive-collapse decision |
| `.opencode/skills/sk-design/SKILL.md` | Planned | Register the new index as a discoverable reference |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Implementation is planned to proceed in three sub-phases per `plan.md` (Setup & Decision -> Card Authoring & Index -> Registration & Verification), executed only after Phase 2 (`002-evidence-envelopes`) ships its stamp/evidence mechanism, which this phase's diversification check is designed to reuse or extend.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Reuse ONLY Hallmark's load-on-demand index and stamp-diversification architecture | Copying the concrete catalogs (macrostructures, component packets, nav/footer archetype codes, theme names) would create a parallel design system and freeze Hallmark's taste inside sk-design; only the loading mechanism transfers (both syntheses' Eliminated Alternatives). |
| Cards are independently authored, abstract fingerprints, not concrete recipes | Preserves sk-design's own design authority while still giving modes and agents structural-diversity decision support. |
| Responsive collapse stays a single shared gate, not baked per card | Mirrors the only architecture element this packet is permitted to reuse from Hallmark (global gates for mobile collapse); prevents 6-8 independently-authored cards from drifting into contradictory concrete collapse rules, which would blur the abstract-fingerprint-vs-concrete-recipe boundary this packet must preserve. |
| Architecture-only adoption needs no MIT notice | Hallmark is MIT-licensed (`.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE`); the load-on-demand idea is adopted clean-room, and the only content that would trigger a notice obligation -- catalog text and recipes -- is excluded by design. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|---|---|---|
| Card field-set completeness (7 fields x 6-8 cards) | Pending | `checklist.md` CHK-003, CHK-006 |
| Zero Hallmark catalog terms present | Pending | `checklist.md` CHK-005 (planned grep) |
| Load-on-demand index (pick one, read one) | Pending | `checklist.md` CHK-004 |
| Stamp-based diversification check | Pending | `checklist.md` CHK-008 |
| Responsive-collapse decision recorded | Recorded now, in this spec | `spec.md` REQ-003; `checklist.md` CHK-002 |
| Strict packet validation | Pending | `validate.sh --strict` not yet run -- packet is Planned |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Requirement | Actual | Status |
|---|---|---|
| Architecture-only reuse (no code, no network) | Reference-markdown-only design | Planned -- holds by construction; verified via CHK-009 |
| Small load footprint (index vs. full card) | Index designed to list id plus one-line hint only | Planned -- verified via CHK-004 |
| No new write paths or execution surface | Static reference content only | Planned -- verified via CHK-009 |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- This packet has not started implementation; every item here is a forward-looking constraint, not a verified fact.
- The card count (6-8) and card identities are not finalized; the exact set depends on the Phase 1 grounding review once implementation begins.
- Phase 3 implementation is blocked on Phase 2 (`002-evidence-envelopes`) shipping its stamp/evidence mechanism, which this phase's diversification check is designed to reuse or extend.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

None yet (not started).
<!-- /ANCHOR:deviations -->
