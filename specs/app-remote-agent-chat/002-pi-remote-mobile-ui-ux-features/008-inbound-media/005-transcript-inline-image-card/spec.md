---
title: "Feature Specification: Phase 4 — Transcript projection and inline image card [template:level-2/spec.md]"
description: "Project inbound image blocks into stable transcript siblings and deliver the bounded inline card state matrix."
trigger_phrases:
  - "inbound image transcript card"
  - "transcript image projection"
  - "inline image card states"
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
# Phase 4 — Transcript projection and inline image card

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Scaffold |
| **Created** | 2026-08-16 |
| **Branch** | `005-transcript-inline-image-card` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Virtualized transcript rows and collapsible tool activity can hide or destabilize inbound media if it is nested inside tool results. This phase preserves block identity/order and renders the card as a standalone, accessible sibling with honest states.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

The projection, standalone card, deferred loading, state fixtures, geometry, placement, disclosure, and CDP boundaries are carried in the phase-specific sections below.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve block placement | Tool cards remain visible outside collapsed details and assistant order is preserved. |
| REQ-002 | Provide stable multi-image geometry | Two to four cards stack with 12px gaps and no horizontal overflow. |
| REQ-003 | Keep interactions accessible | One ready-card button opens only on release/keyboard activation. |
| REQ-004 | Render state truthfully | Loading, integrity, rate, offline, expiry, revocation, stale, and resync states match the table. |
| REQ-005 | Preserve security posture | No card action sends, exports, or creates a public URL. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The card is useful at 390px in light and dark themes with reserved geometry before media loads.
- Every listed state is deterministic in DOM and CDP fixtures.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3 exact read/resource foundation | Card cannot verify variants | Consume the shared resource loader and provider. |
| Risk | Virtualization/disclosure reorder | Images could disappear or move | Preserve stable keys, sequence, block ID, and sibling placement. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Fullscreen interaction remains at the shared foundation baseline until Phase 5; no second viewer is introduced here.
<!-- /ANCHOR:questions -->

## Summary

This phase promotes `inbound_image` into a stable transcript sibling with deferred thumbnail loading, honest lifecycle states, tool-collapse persistence, and a contained 390px mobile card. It connects the protocol and exact read foundation without adding publication, export, or a second viewer.

## Problem & Goal

The transcript is virtualized and tool activity is collapsible, so an inbound image cannot be treated as a nested successful tool-result part without becoming hidden or geometrically unstable. The goal is to preserve block order and revision identity while rendering a usable, accessible card outside tool disclosure details and showing every read/lifecycle outcome honestly.

## Scope

### In scope

- Typed inbound block retention, numeric revision updates, honest unknown-block mapping, and stable processing-to-ready position.
- Standalone `InboundImageBlockView` and inline card components outside `ActivityGroup`/`DisclosurePanel` for tool-origin images.
- Near-viewport resource loading, one visible-card retry, offline wording based on actual read/heartbeat, terminal error mapping, and safe authenticated details.
- Conditional turn grouping changes, deterministic demo fixtures for all listed card states, mobile card styling, card tests, transcript-placement/disclosure tests, and CDP geometry assertions.

### Out of scope

- Changing the relay publication/sanitization or exact read contract, adding a new viewer, persistent media cache, outbound mutation, send, share, save, copy, download, or public URL.
- Replacing the fixed ink-on-parchment tokens, typography, light/dark themes, safe-area behavior, or WCAG AA target.
- Treating withheld, expired, revoked, stale, corrupt, denied, or unsupported states as image pixels or exposing raw source metadata.

## User-facing behavior + states

- Tool-origin cards are sibling transcript items and remain visible when the owning tool disclosure collapses.
- Assistant-origin cards retain stream order; two to four cards stack vertically with 12px gaps.
- The card exposes processing, deferred, thumbnail-fetching, verifying, decoding, inline-ready, withheld, denied, expired, missing, revision-conflict, corrupt, rate-limited, stale, revoked, unsupported, privacy-covered, closing, and aborted fixtures with honest copy and geometry.
- The ready card is one React Aria Button with no nested action; it opens only on release, Enter, or Space, while a scroll gesture does not open it.
- The card has 16px gutters, a reserved 180–240px well, contained non-cropped previews, readable metadata, no horizontal overflow, and light/dark styling.

## Acceptance criteria

- Tool-origin image cards remain visible when their owning tool details collapse.
- Assistant-origin cards preserve stream order, and two to four cards stack vertically with 12px gaps.
- The ready card opens only on release, Enter, or Space; a scroll gesture over the card does not open it.
- Near-viewport loading, one automatic retry, exact revision, digest failure, rate limiting, offline wording, expiry, revocation, stale, and resync states match the state table.
- The 390px light/dark screenshots have 16px gutters, no horizontal scroll, contained non-cropped previews, readable metadata, and no clay-only status/boundary/focus signal.
- No image action can send to pi, share, save, copy, download, or create a public URL.

## Security & Redaction

The card reads only relay-sanitized, exact-revision variants through the Phase 3 resource loader and shows safe presentation metadata, never paths, URLs, filenames as authority, OCR matches, or raw source details. Withheld, expired, revoked, stale, and corrupt states render no pixels. Loading is deferred and bounded, retries are limited, and the card exposes no action that can send to pi, mutate workspace state, or export media. The fixed redaction, no-store, host-authority, and read-only posture remains unchanged.

## Dependencies & affected areas

- `apps/pi-remote-web/src/state.ts`, `App.tsx`, and `turns.ts` for protocol projection, placement, order, and disclosure boundaries.
- `apps/pi-remote-web/src/artifacts/InboundImageBlockView.tsx`, `InboundImageCard.tsx`, `ImagePlaceholder.tsx`, `VerifiedImage.tsx`, `ImageStatus.tsx`, `useArtifactResource.ts`, and `ArtifactDetails.tsx` for card behavior.
- `apps/pi-remote-web/src/style.css` for geometry, themes, focus, alpha treatment, and overflow.
- `apps/pi-remote-web/src/demo.ts`, web card/state/placement/disclosure tests, and `scripts/inbound-media-cdp.mjs` for deterministic fixture and visual verification.
- Phase 3 exact read/resource/viewer foundation and Phase 1 typed protocol are prerequisites; relay publication code is not changed.
