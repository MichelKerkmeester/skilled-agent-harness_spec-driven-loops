---
title: "Tasks: Phase 5 — Fullscreen interaction, privacy lifecycle, and accessibility hardening [template:level-2/tasks.md]"
description: "Task breakdown for viewer transitions, controls, resource lifecycle, privacy purge, tests, CDP captures, and device verification."
trigger_phrases:
  - "fullscreen viewer tasks"
  - "privacy purge tasks"
  - "viewer accessibility tasks"
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
# Tasks — Fullscreen interaction, privacy lifecycle, and accessibility hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

The checkbox list below carries the concrete tasks from the phase source.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Viewer transition and lifecycle setup is included below.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Controls, resource, privacy, style, test, CDP, and device tasks are included below.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Automated, CDP, and physical-device verification is defined in the companion checklist.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All concrete tasks below must be addressed before this phase is shippable.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

See `spec.md`, `plan.md`, and `checklist.md` in this folder.
<!-- /ANCHOR:cross-refs -->

- [ ] Extend `ArtifactViewerProvider.tsx` and `ArtifactViewerHost.tsx` for opening, full-fetching, viewer-ready, full-degraded, stalled, offline-loaded, offline-unavailable, stale, revoked, privacy-covered, closing, and aborted transitions.
- [ ] Extend `ArtifactHeader.tsx`, `PreviewControls.tsx`, `ArtifactDetails.tsx`, and `useArtifactHistory.ts` for opaque viewer chrome, safe heading focus, Close, Details disclosure, zoom/fit, directional pan, keyboard shortcuts, one history child, and exact scroll/focus restoration.
- [ ] Extend `useArtifactResource.ts` for thumbnail retention while full loads, 15-second stalled state, foreground-only offline retention, aborts, one-generation retries, and purge-on-background.
- [ ] Change `apps/pi-remote-web/src/App.tsx` and `apps/pi-remote-web/src/main.tsx` to connect visibilitychange, pagehide, logout, session switch, revocation, and transcript supersession to the privacy curtain and resource store.
- [ ] Change `apps/pi-remote-web/src/style.css` for opaque carbon viewer stage, two-row high-scale header, safe areas, visual viewport, 100dvh/100svh, overscroll containment, active zoom-surface touch-action, focus rings, 44px controls, and reduced-motion rules.
- [ ] Change `apps/pi-remote-web/index.html` and `apps/pi-remote-web/public/service-worker.js` only if device testing reveals CSP, bfcache, or service-worker paths that can retain artifact URLs; add no persistent media storage.
- [ ] Add `InboundImageViewer.test.tsx`, `viewer-interaction.test.tsx`, `viewer-races.test.tsx`, `privacy-lifecycle.test.tsx`, `accessibility.test.tsx`, and `contrast.test.tsx`.
- [ ] Extend `scripts/inbound-media-cdp.mjs` to capture card, opening, viewer-ready, full-degraded, withheld, privacy-covered, and close states in both themes at 390px.
- [ ] Perform the manual installed-PWA and Safari checks on the oldest supported iPhone across the specified accessibility, lifecycle, viewport, motion, contrast, RTL, offline, and orientation matrix.
