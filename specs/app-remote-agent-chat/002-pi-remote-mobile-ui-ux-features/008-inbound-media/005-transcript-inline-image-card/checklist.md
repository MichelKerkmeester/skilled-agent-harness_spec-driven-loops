---
title: "Verification Checklist: Phase 4 — Transcript projection and inline image card [template:level-2/checklist.md]"
description: "QA checklist for transcript placement, inline card interaction, lifecycle states, geometry, and accessibility signals."
trigger_phrases:
  - "inline image card checklist"
  - "transcript card verification"
  - "inbound image card QA"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/002-pi-remote-mobile-ui-ux-features/008-inbound-media/005-transcript-inline-image-card"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase docs from implementation-phases.md"
    next_safe_action: "Implement and verify this phase"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 4 — Transcript projection and inline image card

# Checklist — Transcript projection and inline image card

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

P0 items block the phase; P1 items are required; P2 items may be deferred only with an explicit reason.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

The source spec, plan, dependencies, and fixed security posture have been read.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

The phase changes only the listed web projection, card, resource, styling, fixture, test, and harness areas.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

The acceptance and state/geometry items below are the authoritative QA list.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

No implementation finding is being closed by this scaffold; phase tasks remain explicit below.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

Exact-revision reads, no-pixel terminal states, safe metadata, and no outbound actions are included below.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

The four phase documents remain synchronized to the implementation phase source.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

Only the four requested Markdown files belong in this phase folder; generated JSON metadata is deferred.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase remains open until every required checkbox below has evidence.
<!-- /ANCHOR:summary -->

- [ ] CHK-001 [P0] Tool-origin cards remain visible after their owning tool details collapse.
- [ ] CHK-002 [P0] Assistant-origin cards preserve stream order.
- [ ] CHK-003 [P1] Two to four cards stack vertically with 12px gaps.
- [ ] CHK-004 [P0] The ready card has one React Aria Button and no nested controls.
- [ ] CHK-005 [P0] Release, Enter, and Space open the ready card; a scroll gesture over it does not open the viewer.
- [ ] CHK-006 [P0] Near-viewport deferral, one automatic retry, exact revision, digest failure, rate limiting, offline wording, expiry, revocation, stale, and resync states match the state table.
- [ ] CHK-007 [P0] Processing-to-ready keeps the same block ID, stable key, sequence, and transcript position.
- [ ] CHK-008 [P1] Every demo state exposes honest copy, `aria-busy`, actions, and terminal behavior.
- [ ] CHK-009 [P0] Withheld, expired, revoked, stale, and corrupt states render no image pixels.
- [ ] CHK-010 [P0] The light 390px screenshot has 16px gutters, contained non-cropped preview geometry, readable metadata, no horizontal overflow, and no clay-only signal.
- [ ] CHK-011 [P0] The dark 390px screenshot has the same geometry and accessibility guarantees.
- [ ] CHK-012 [P1] Focus states, identity row, alpha treatment, and metadata wrapping meet the fixed WCAG AA ink-on-parchment system.
- [ ] CHK-013 [P0] No image action can send to pi, share, save, copy, download, or create a public URL.
- [ ] CHK-014 [P0] `npm run typecheck` passes.
- [ ] CHK-015 [P0] `npm test` passes.
- [ ] CHK-016 [P0] `npm run test:web` passes.
- [ ] CHK-017 [P1] The light `inline-card` screenshot is written to `/private/tmp/f8-phase-4-light.png` at true 390 CSS pixels.
- [ ] CHK-018 [P1] The dark `inline-card` screenshot is written to `/private/tmp/f8-phase-4-dark.png` at true 390 CSS pixels.
- [ ] CHK-019 [P0] `npm run build` passes.
