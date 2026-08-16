---
title: "Implementation Plan: Phase 4 — Transcript projection and inline image card [template:level-2/plan.md]"
description: "Implement stable transcript projection, a contained inline card, deferred loading, state fixtures, and mobile geometry checks."
trigger_phrases:
  - "inline image card plan"
  - "transcript image projection plan"
  - "inbound image card implementation"
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
# Plan — Transcript projection and inline image card

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Project the typed block into the virtualized transcript, render a standalone card, and make every card state and geometry deterministic.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Readiness requires stable block/order rules, card semantics, reserved geometry, state fixtures, and no-action boundaries; completion requires DOM and CDP evidence.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

State projection owns typed revisions; `App.tsx` places the sibling outside tool disclosure; card components consume the Phase 3 resource/provider and expose only one ready-card action.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. State projection and transcript placement.
2. Card components, resource deferral, details, and styling.
3. Fixtures, DOM tests, disclosure persistence, and CDP geometry.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Card/state/placement/disclosure tests plus 390px light/dark CDP checks cover order, collapse persistence, activation, state copy, geometry, and no-pixel terminal states.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 1 typed protocol and Phase 3 exact read/resource foundation are required; Phase 5 extends the shared viewer lifecycle.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Retain the honest unsupported/redacted row and disable card promotion if projection, disclosure, integrity, or geometry checks fail.
<!-- /ANCHOR:rollback -->

## Approach

Project the typed block into the existing virtualized transcript without changing its identity or order, then render a standalone card that consumes the shared exact-read resource. Keep tool-origin cards outside collapsible details, reserve geometry before loading, and make every success, failure, and privacy state deterministic in demo, DOM, and 390px CDP fixtures.

## Steps (ordered)

1. Extend state projection to retain typed blocks, preserve numeric revisions, map unknown blocks honestly, and keep processing-to-ready in place.
2. Add standalone block/card components and update `App.tsx` so tool-origin cards are outside `ActivityGroup`/`DisclosurePanel`.
3. Extend resource loading with near-two-viewport deferral, one 750ms visible-card retry, actual connectivity wording, exact revision use, and terminal mapping.
4. Add safe authenticated details, conditional turn grouping changes, and fixed card geometry/theme/focus styles.
5. Add every deterministic demo fixture, card/state/placement/disclosure test, and CDP geometry/collapse assertion.
6. Run the complete shared gate and verify no action path can send or export image content.

## Files to change

- `apps/pi-remote-web/src/state.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/artifacts/InboundImageBlockView.tsx`
- `apps/pi-remote-web/src/artifacts/InboundImageCard.tsx`
- `apps/pi-remote-web/src/artifacts/ImagePlaceholder.tsx`
- `apps/pi-remote-web/src/artifacts/VerifiedImage.tsx`
- `apps/pi-remote-web/src/artifacts/ImageStatus.tsx`
- `apps/pi-remote-web/src/artifacts/useArtifactResource.ts`
- `apps/pi-remote-web/src/artifacts/ArtifactDetails.tsx`
- `apps/pi-remote-web/src/turns.ts` only if sibling placement changes turn grouping
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/src/demo.ts`
- `apps/pi-remote-web/tests/InboundImageCard.test.tsx`
- `apps/pi-remote-web/tests/inbound-image-states.test.tsx`
- `apps/pi-remote-web/tests/transcript-placement.test.tsx`
- `apps/pi-remote-web/tests/disclosure-persistence.test.tsx`
- `scripts/inbound-media-cdp.mjs`

## Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --fixture inline-card --screenshot /private/tmp/f8-phase-4-light.png`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --fixture inline-card --screenshot /private/tmp/f8-phase-4-dark.png`
- `npm run build`
- The DOM suite exercises every state fixture and asserts copy, `aria-busy`, actions, reserved geometry, accessible name, no nested controls, and no pixels for withheld/expired/revoked/corrupt states.

## Phase 1: Projection and card surface

Implement stable typed projection, sibling placement, card semantics, deferred loading, safe details, and fixed geometry.

## Phase 2: State and visual verification

Exercise every state, disclosure collapse, activation path, and true-390px light/dark geometry before fullscreen hardening.
