---
title: "Feature Specification: Phase 5 — Fullscreen interaction, privacy lifecycle, and accessibility hardening [template:level-2/spec.md]"
description: "Complete the shared mobile viewer lifecycle, privacy purge behavior, accessibility alternatives, and device proof."
trigger_phrases:
  - "fullscreen inbound image viewer"
  - "artifact privacy lifecycle"
  - "mobile viewer accessibility hardening"
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
# Phase 5 — Fullscreen interaction, privacy lifecycle, and accessibility hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Scaffold |
| **Created** | 2026-08-16 |
| **Branch** | `006-fullscreen-privacy-accessibility` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Mobile image inspection requires verified full loading, accessible zoom/pan, deterministic dismissal, and synchronous privacy cleanup. This phase extends the shared viewer so lifecycle and device behavior are safe without adding export or a second lightbox.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

The viewer state machine, resource lifecycle, browser privacy events, controls, styling, tests, CDP captures, and physical-device matrix are carried in the phase-specific sections below.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Freeze exact viewer identity | ID, revision, digest, scroll, history, and focus are deterministic. |
| REQ-002 | Verify before full pixels | Thumbnail remains until full integrity/decode checks pass. |
| REQ-003 | Provide accessible interaction alternatives | Zoom/pan have direct and single-pointer/keyboard alternatives. |
| REQ-004 | Purge on privacy lifecycle events | Background, pagehide, logout, switch, revocation, and close cover/purge synchronously. |
| REQ-005 | Prove device accessibility | Supported viewport, motion, contrast, RTL, orientation, Safari, and PWA checks pass. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Viewer transitions, races, privacy covering, and accessibility semantics are testable.
- Physical Safari and installed-PWA verification passes before production enablement.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3/4 shared resource and card | Viewer could diverge from the shared contract | Extend one provider/store only. |
| Risk | Browser lifecycle or memory retention | Sensitive pixels could remain visible | Centralize synchronous cover and purge on every specified event. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Physical-device evidence, not screenshots alone, decides the accessibility and privacy readiness boundary.
<!-- /ANCHOR:questions -->

## Summary

This phase completes the mobile experience around the shared F6 viewer: exact-revision opening, bounded full reads, zoom/pan alternatives, Details, history and focus restoration, privacy covering, failure-state handling, and physical-device accessibility verification. It extends the shared viewer rather than creating a second inbound-media lightbox.

## Problem & Goal

An inline card is not sufficient for mobile inspection unless opening, full loading, zoom/pan, dismissal, lifecycle privacy, and assistive technology behavior are deterministic. The goal is to freeze the exact artifact identity, provide accessible interaction alternatives, cover and purge pixels on privacy events, and pass the supported iPhone Safari and installed-PWA matrix without export or re-send behavior.

## Scope

### In scope

- Viewer/provider transitions for opening, full-fetching, viewer-ready, full-degraded, stalled, offline-loaded, offline-unavailable, stale, revoked, privacy-covered, closing, and aborted states.
- Opaque viewer chrome, safe heading focus, Close, Details, zoom/fit, directional pan, keyboard alternatives, one history child, and exact scroll/focus restoration.
- Thumbnail retention during full load, 15-second stalled state, foreground-only offline retention, aborts, one-generation retries, and purge-on-background.
- Visibility/pagehide/logout/session-switch/revocation/transcript-supersession privacy wiring, opaque carbon stage, safe-area/visual-viewport styles, reduced motion, tests, CDP captures, and manual Safari/installed-PWA checks.

### Out of scope

- Export, capture, re-send, share, save, copy, download, public URLs, a new viewer implementation, or persistent browser media storage.
- Changing the fixed bone/carbon/clay design tokens, typography, light/dark system, safe redaction wording, read-only posture, or WCAG AA target.
- Treating screenshots as a substitute for VoiceOver dismissal, App Switcher covering, edge-back behavior, or physical memory verification.

## User-facing behavior + states

- Opening freezes the exact ID/revision/digest, blurs the composer, preserves transcript scroll, pushes one history child, traps focus, and restores focus/scroll on every close path.
- The thumbnail stays visible while the full variant loads; full pixels appear only after integrity and decode checks.
- Zoom and pan work through direct manipulation and visible single-pointer/keyboard alternatives without conflicting with transcript scroll or dismissing the viewer.
- Full-degraded, stalled, offline-loaded, offline-unavailable, denied, corrupt, stale, revoked, privacy-covered, closing, and aborted states expose bounded, honest copy.
- Backgrounding, pagehide, logout, session switch, revocation, and close synchronously cover and purge pixels and URLs.

## Acceptance criteria

- Opening freezes the exact ID/revision/digest, blurs the composer, preserves transcript scroll, pushes one history child, traps focus, and restores focus/scroll on every specified close path.
- Thumbnail remains visible while the full image fetches; full pixels appear only after all integrity and decode checks.
- Zoom and pan have both direct-manipulation and visible single-pointer/keyboard alternatives; no gesture conflicts with transcript scroll or dismisses the viewer.
- Full-degraded, stalled, offline, denied, corrupt, stale, revoked, and privacy-covered behavior matches the state table with bounded retry.
- Backgrounding, pagehide, logout, session switch, revocation, and close synchronously cover and purge pixels and URLs.
- Light/dark, 320px, 200% text, RTL, increased contrast, reduced motion, portrait, and landscape pass without obscured controls or page-level overflow.
- Manual device verification passes in Safari and installed-PWA standalone mode before Phase 6.

## Security & Redaction

The viewer opens only the exact immutable ID/revision/digest selected by the card and never creates full pixels before length, digest, ETag/Content-Digest, and decode checks pass. It has no export or outbound action. Privacy events synchronously show an opaque cover and purge pixels, object URLs, and retained resources; only foreground-scoped, bounded offline retention is allowed during the defined lifecycle. Revocation, logout, session changes, pagehide, backgrounding, close, and transcript supersession invalidate resources. Redaction remains a relay processing fact rather than a claim that an image is safe, and the host/extension authority and read-only posture are unchanged.

## Dependencies & affected areas

- `apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx`, `ArtifactViewerHost.tsx`, `ArtifactHeader.tsx`, `PreviewControls.tsx`, `ArtifactDetails.tsx`, and `useArtifactHistory.ts` for viewer state, controls, history, and focus.
- `apps/pi-remote-web/src/artifacts/useArtifactResource.ts` for full-load, offline, stalled, abort, retry, and purge behavior.
- `apps/pi-remote-web/src/App.tsx` and `src/main.tsx` for lifecycle event wiring.
- `apps/pi-remote-web/src/style.css`, `index.html`, and `public/service-worker.js` for viewer geometry, CSP, bfcache/service-worker retention checks, and no persistent media storage.
- Web viewer/race/privacy/accessibility/contrast tests and `scripts/inbound-media-cdp.mjs` for deterministic evidence.
- Safari and installed-PWA physical-device verification are release prerequisites; Phase 6 consumes the completed viewer lifecycle.
