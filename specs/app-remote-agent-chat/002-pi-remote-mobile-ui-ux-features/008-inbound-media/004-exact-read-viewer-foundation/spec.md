---
title: "Feature Specification: Phase 3 — Exact read lane and shared F6 viewer/resource foundation [template:level-2/spec.md]"
description: "Expose exact-revision sanitized reads and establish the shared memory-only resource and viewer foundation."
trigger_phrases:
  - "exact artifact read lane"
  - "shared F6 viewer foundation"
  - "memory-only artifact resource"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/002-pi-remote-mobile-ui-ux-features/008-inbound-media/004-exact-read-viewer-foundation"
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
# Phase 3 — Exact read lane and shared F6 viewer/resource foundation

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
| **Branch** | `004-exact-read-viewer-foundation` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Sanitized variants need an exact authenticated read and a shared memory-only browser resource path before transcript cards can display them. This phase prevents latest-revision substitution, ambient URLs, persistent caches, and mutation access.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

The exact read, integrity, shared viewer/resource, cache, CSP, and verification boundaries are carried in the phase-specific sections below.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Authenticate exact reads | Authorized exact tuples return the requested variant. |
| REQ-002 | Reject unsafe authority | Latest, paths, URLs, cross-session, unknown, expired, revoked, and unauthorized requests fail. |
| REQ-003 | Keep reads read-only | Reads invoke no pi, mutation ticket, or workspace change. |
| REQ-004 | Verify before pixels | Length, digest, ETag/Content-Digest, and decode pass before object URLs. |
| REQ-005 | Prevent resource leaks | Lifecycle invalidation leaves no resource leak or persistent artifact state. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The relay and web resource contracts are exact-tuple and no-store.
- The shared provider owns deterministic history/focus outside the virtualized transcript.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 sanitized artifacts | No approved variant to read | Read only committed sanitized derivatives. |
| Risk | Integrity or cache failure | Pixels or media could leak or be stale | Verify before object URL creation and purge persistent paths. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Security review must confirm the read surface is read-only and no-store before Phase 4 promotion.
<!-- /ANCHOR:questions -->

## Summary

This phase exposes sanitized variants through an authenticated exact-revision read and establishes the shared memory-only artifact resource and React Aria viewer foundation for F8 and F6. It is a read-only surface with no send, export, persistent media cache, or inbound-only lightbox.

## Problem & Goal

Ready transcript metadata must not turn into an ambient URL, latest-revision lookup, persistent browser cache, or mutation path. The goal is to authenticate the exact session/artifact/revision/variant tuple, verify the bytes before creating pixels, and provide shared viewer ownership for history, focus, scroll, privacy, and bounded in-memory resources.

## Scope

### In scope

- Separate `artifact:read` policy, exact `POST /api/artifacts/read`, session/principal/device/origin checks, status mapping, rate limits, concurrency limits, no-store headers, digest, ETag, and exact immutable lookup.
- Shared `useArtifactResource` memory-only loading with abort ownership, length/digest/ETag checks, image decode, typed Blob creation, reference-counted object URLs, bounded LRU retention, and generation invalidation.
- Shared React Aria provider/host, header, details, preview controls, and history foundation outside the virtualized transcript.
- Relay and web tests plus a deterministic in-memory CDP read fixture without committed image bytes.
- Service-worker/cache/CSP changes needed to keep artifact resources out of persistent storage and markup/history.

### Out of scope

- Adding publication, capture, send, export, share, save, copy, download, public URLs, or any mutation ticket use.
- Promoting `inbound_image` into the transcript or completing the inline card state matrix; those are Phase 4 responsibilities.
- Persisting artifact bytes or resource state in Cache Storage, IndexedDB, OPFS, localStorage, history, transcript JSON, or service-worker caches.
- Forking an inbound-only lightbox when shared F6 infrastructure exists, changing the fixed ink-on-parchment system, or weakening read-only and redaction guarantees.

## User-facing behavior + states

- The shared viewer shell supports authenticated exact-tuple loading and safe metadata/details, with deterministic close/history/focus ownership.
- Unauthorized, latest, path/URL, cross-session, expired, revoked, unknown-field, and revision-conflict requests expose mapped non-pixel error states.
- Loading, integrity failure, decode failure, abort, close, Strict Mode, logout, revocation, revision replacement, and backgrounding leave no resource leak.
- The CDP `viewer-shell` fixture is a shared foundation check; it does not yet promote an inbound image card in the transcript.

## Acceptance criteria

- An authorized exact tuple returns the requested sanitized variant with matching digest and ETag.
- `latest`, paths, URLs, cross-session tuples, unknown fields, expired/revoked tuples, and unauthorized principals are rejected.
- Reads cannot invoke pi, mint a mutation ticket, or change workspace state.
- The client does not create an object URL until length, digest, ETag/Content-Digest, and image decode all pass.
- Strict Mode, close, abort, revision replacement, logout, revocation, and backgrounding leave no resource leak.
- The shared viewer provider mounts outside the virtualized transcript and has deterministic history/focus ownership.
- Security review confirms the read surface is read-only and no-store before the card is promoted.

## Security & Redaction

The read route accepts only the exact authenticated session/artifact/revision/variant tuple and rejects authority derived from `latest`, paths, URLs, or client-supplied redirects. It never invokes pi or mints a mutation ticket. Responses are authenticated, no-store, integrity-labeled, same-origin, and bounded by the read rate/concurrency policy. The client verifies length, SHA-256, ETag/Content-Digest, and decode before creating an object URL; resources remain memory-only and are purged on invalidation and privacy events. Only relay-sanitized variants from Phase 2 are readable, and the UI never calls them safe or exposes source metadata.

## Dependencies & affected areas

- `apps/pi-remote-relay/src/auth/policy.ts`, `src/http/server.ts`, `src/auth/rate-limit.ts`, and `src/store/artifact-store.ts` for exact read authorization and response integrity.
- `apps/pi-remote-web/src/artifacts/useArtifactResource.ts`, `ArtifactViewerProvider.tsx`, `ArtifactViewerHost.tsx`, `ArtifactHeader.tsx`, `ArtifactDetails.tsx`, `PreviewControls.tsx`, and `useArtifactHistory.ts` for shared resource/viewer behavior.
- `apps/pi-remote-web/src/relay.ts`, `src/cache.ts`, `public/service-worker.js`, `index.html`, and `src/main.tsx` for read wiring, no-store cache hygiene, CSP, and provider mounting.
- Relay and web artifact-read/resource/cache/viewer tests plus `scripts/inbound-media-cdp.mjs` for deterministic verification.
- Phase 2 sanitized artifact metadata is the producer; Phase 4 transcript projection consumes this read/viewer foundation.
