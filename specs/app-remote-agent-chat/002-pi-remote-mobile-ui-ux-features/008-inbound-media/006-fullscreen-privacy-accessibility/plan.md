---
title: "Implementation Plan: Phase 5 — Fullscreen interaction, privacy lifecycle, and accessibility hardening [template:level-2/plan.md]"
description: "Extend the shared viewer state machine, lifecycle purge path, accessible controls, device styles, tests, and manual matrix."
trigger_phrases:
  - "fullscreen viewer plan"
  - "privacy lifecycle plan"
  - "mobile accessibility viewer implementation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/002-pi-remote-mobile-ui-ux-features/008-inbound-media/006-fullscreen-privacy-accessibility"
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
# Plan — Fullscreen interaction, privacy lifecycle, and accessibility hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Extend the shared provider and resource store as one state machine, centralize cover/purge behavior, and prove the mobile viewer through automated and physical-device checks.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Readiness requires exact identity, focus/history ownership, integrity-before-pixels, lifecycle purge, accessible alternatives, and device coverage; completion requires all automated and manual gates.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The shared provider owns viewer transitions and focus/history; the resource store owns bounded fetch/retention/purge; App/main lifecycle events invoke one privacy curtain path.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Viewer transitions and controls.
2. Resource lifecycle, privacy events, and styles.
3. Race/accessibility/contrast tests, CDP captures, and device matrix.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Viewer interaction/race/privacy/accessibility/contrast tests, light/dark viewer-ready CDP captures, and Safari/installed-PWA physical checks cover the phase.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 3 provides the shared provider/resource contract and Phase 4 provides the card opening path; Phase 6 requires the resulting device evidence.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Disable fullscreen promotion and retain the inline/unsupported path if privacy purge, integrity, accessibility, or device checks fail.
<!-- /ANCHOR:rollback -->

## Approach

Extend the shared F6 provider and resource store as a single state machine, preserving the verified thumbnail while the exact full variant loads and centralizing focus, history, scroll, and privacy ownership. Wire all browser lifecycle events to one synchronous cover-and-purge path, then verify the result through race tests, accessibility tests, true-390px CDP screenshots, and the physical Safari/PWA matrix.

## Steps (ordered)

1. Add provider/host transitions for opening, full fetch, ready/degraded/stalled/offline/stale/revoked/privacy/closing/aborted states.
2. Implement opaque chrome, safe heading focus, close/details, zoom/fit, directional pan, keyboard alternatives, one history child, and exact restoration.
3. Extend the resource store for thumbnail retention, 15-second stalled state, foreground-only offline retention, aborts, bounded one-generation retry, and purge-on-background.
4. Connect visibilitychange, pagehide, logout, session switch, revocation, and transcript supersession to the privacy curtain and resource store.
5. Apply safe-area, visual-viewport, 100dvh/100svh, overscroll, touch-action, focus-ring, control-size, and reduced-motion rules without changing fixed tokens.
6. Add viewer, race, privacy, accessibility, contrast, and CDP tests; perform the manual installed-PWA/Safari matrix.
7. Run the complete shared gate and retain the physical-device result as a prerequisite for Phase 6.

## Files to change

- `apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactViewerHost.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactHeader.tsx`
- `apps/pi-remote-web/src/artifacts/PreviewControls.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactDetails.tsx`
- `apps/pi-remote-web/src/artifacts/useArtifactHistory.ts`
- `apps/pi-remote-web/src/artifacts/useArtifactResource.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/main.tsx`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/index.html` if device testing exposes CSP/bfcache retention paths
- `apps/pi-remote-web/public/service-worker.js` if device testing exposes service-worker retention paths
- `apps/pi-remote-web/tests/InboundImageViewer.test.tsx`
- `apps/pi-remote-web/tests/viewer-interaction.test.tsx`
- `apps/pi-remote-web/tests/viewer-races.test.tsx`
- `apps/pi-remote-web/tests/privacy-lifecycle.test.tsx`
- `apps/pi-remote-web/tests/accessibility.test.tsx`
- `apps/pi-remote-web/tests/contrast.test.tsx`
- `scripts/inbound-media-cdp.mjs`
- The manual installed-PWA and Safari device test record outside the repository

## Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --fixture viewer-ready --screenshot /private/tmp/f8-phase-5-light.png`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --fixture viewer-ready --screenshot /private/tmp/f8-phase-5-dark.png`
- `npm run build`
- Complete the manual device matrix: VoiceOver, Switch Control, Voice Control, edge-back, Escape/keyboard where available, landscape, offline relay loss, bfcache, reduced motion, increased contrast, RTL, 320px, and 200% text on the oldest supported iPhone in Safari and installed-PWA standalone mode.
- Treat screenshots as insufficient evidence for VoiceOver dismissal, App Switcher covering, edge-back, or physical memory behavior.

## Phase 1: Viewer lifecycle and privacy state machine

Implement exact opening, full-load, interaction, lifecycle cover, purge, focus, and history behavior.

## Phase 2: Device accessibility boundary

Run automated tests, true-390px light/dark captures, and the full physical Safari/installed-PWA matrix before production enablement.
