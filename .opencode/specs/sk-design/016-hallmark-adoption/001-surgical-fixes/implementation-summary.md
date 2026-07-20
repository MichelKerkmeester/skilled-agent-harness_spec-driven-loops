---
title: "Implementation Summary: Surgical Fixes to Existing sk-design Modes"
description: "Forward-looking implementation summary for the planned Phase 1 surgical fixes to existing sk-design modes; nothing has been built yet."
trigger_phrases:
  - "hallmark surgical fixes"
  - "hallmark surgical fixes planned"
  - "hero media contract planned"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/016-hallmark-adoption/001-surgical-fixes"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the forward-looking Phase 1 implementation record"
    next_safe_action: "Begin Phase 1 implementation per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/design-process/design-principles.md"
      - ".opencode/skills/sk-design/design-audit/references/anti-patterns-production.md"
      - ".opencode/skills/sk-design/design-foundations/references/layout/layout-responsive.md"
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

# Implementation Summary: Surgical Fixes to Existing sk-design Modes

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-surgical-fixes |
| **Status** | Planned |
| **Level** | 2 |
| **Parent Packet** | `016-hallmark-adoption` |
| **Phase** | 1 of 4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been implemented yet — this packet is Planned. Once built, Phase 1 will adapt five Hallmark-grounded heuristics directly into existing sk-design mode reference files, introducing no new modes or commands: a hero/media signature-role + deletion-test contract, a multi-page MUST-SHARE/MAY-DIFFER coherence lock, ~7-15 new anti-slop audit probes with cognitive/perceptual rationale fields, fallback-font metric overrides with CLS-score proof, and a target-derived responsive proof matrix. All five will be expressed inside sk-design's existing evidence-first P0-P3 severity model, not Hallmark's all-or-nothing 58-gate posture.

### Files Created / Changed

| File or Group | Action | Purpose |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/references/design-process/design-principles.md` | Will modify | Add the hero/media signature-role decision + deletion test + Tier 0 pass rule |
| `.opencode/skills/sk-design/design-interface/references/design-process/redesign-intake.md` | Will modify | Add the multi-page MUST-SHARE/MAY-DIFFER axis table + amend-don't-override rule |
| `.opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md` | Will modify | Add the multi-page diversification-rule inversion |
| `.opencode/skills/sk-design/design-audit/references/anti-patterns-production.md` | Will modify | Add ~7-15 new anti-slop probes with rationale fields |
| `.opencode/skills/sk-design/design-audit/references/ai-fingerprint-tells.md` | Will modify | Add the AI-nav and AI-footer fingerprint probes |
| `.opencode/skills/sk-design/design-audit/procedures/ai-slop-check.md` | Will modify | Sequence the pre-emit 6-axis self-critique ahead of the gate sweep |
| `.opencode/skills/sk-design/design-audit/references/audit-contract.md` | Will modify | Reaffirm the evidence-first P0-P3 severity model |
| `.opencode/skills/sk-design/design-foundations/references/type/typography-system.md` | Will modify | Add fallback-font metric overrides + CLS-score verification requirement |
| `.opencode/skills/sk-design/design-foundations/references/layout/layout-responsive.md` | Will modify | Add the proof matrix, feature-query rule, clickable-text fix order, orientation/zoom flag |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The plan calls for direct, in-place edits to nine existing sk-design reference/procedure Markdown files across the `design-interface`, `design-audit`, and `design-foundations` mode-owned trees, grounded in the `014-hallmark-design-skill-research` syntheses and clean-room ADAPTed to avoid importing Hallmark's all-or-nothing gate posture. No new files, modes, or commands are planned.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Adapt, not adopt, Hallmark's gate architecture | sk-design's evidence-first P0-P3 severity model is preserved; Hallmark's all-or-nothing 58-gate posture is explicitly out of scope (REQ-004). |
| Land fixes inside existing mode-owned reference files | No new sk-design modes or `/interface:*`/`/design:*` commands are introduced; the five workstreams extend the modes that already own hero/media, multi-page, audit, and foundations judgment. |
| Clean-room ADAPT with independently-worded heuristics | Hallmark is MIT-licensed (`.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE`); if any probe table substantially copies Hallmark's gate text, its MIT notice will be added to a third-party notice surface; external Hallmark images, fonts, and assets are SKIP — not covered by the repository's MIT grant. |
| CLS-score verification for fallback-font overrides | Layout-shift proof must be engineering-verifiable, not a visual approximation, per REQ-005. |
| Flag orientation/zoom as an sk-design extension | Hallmark's responsive testing covers width + pointer/hover only; extending to orientation/zoom (REQ-006) is net-new and must not be attributed to the Hallmark adoption. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|---|---|---|
| Hero/media Tier 0 deletion-test pass | Pending | To be verified once the deletion test is drafted (REQ-001) |
| Multi-page coherence lock documented | Pending | To be verified once the axis table lands (REQ-002) |
| Anti-slop probe count + rationale fields | Pending | To be verified once the probes land (REQ-003) |
| Evidence-first severity model preserved | Pending | To be verified against REQ-004 before completion |
| Fallback-font CLS proof requirement | Pending | To be verified once the typography reference is updated (REQ-005) |
| Responsive proof matrix | Pending | To be verified once the layout-responsive reference is updated (REQ-006) |
| Strict packet validation | Pending | `validate.sh --strict` has not yet been run — nothing is built |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Requirement | Actual | Status |
|---|---|---|
| No new modes/commands | Plan introduces none | Pending confirmation at Phase 3 |
| Documentation-only change (no runtime/perf impact) | No code changes planned | Pending confirmation at Phase 3 |
| No new network surface or mutation capability | Advisory Markdown only | Pending confirmation at Phase 3 |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Nothing has been implemented; every statement above describes the intended build, not a completed one.
- The exact target reference file per workstream may shift during implementation if a dedicated new file (e.g., a standalone `hero-media-contract.md`) proves clearer than extending `design-principles.md`.
- The CLS-score verification mechanism (manual audit step vs. a new automated check) is an open question — see `spec.md` §7.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

None yet (not started).
<!-- /ANCHOR:deviations -->
