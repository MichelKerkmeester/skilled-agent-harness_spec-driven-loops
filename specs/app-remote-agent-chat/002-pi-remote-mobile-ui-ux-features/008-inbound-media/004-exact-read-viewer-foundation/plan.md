---
title: "Implementation Plan: Phase 3 — Exact read lane and shared F6 viewer/resource foundation [template:level-2/plan.md]"
description: "Implement exact-revision read authorization and one shared memory-only resource/viewer foundation."
trigger_phrases:
  - "exact read plan"
  - "artifact viewer resource plan"
  - "shared F6 viewer implementation"
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
# Plan — Exact read lane and shared F6 viewer/resource foundation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Make the relay exact-tuple read authoritative, then build the shared resource store and viewer provider around integrity-verified, memory-only bytes.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Readiness requires exact authorization, integrity headers, no-store behavior, resource ownership, and persistence-negative tests; completion requires the shared and boundary gates.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The relay authenticates an immutable tuple; the web loader verifies length/digest/ETag/decode; the shared provider owns viewer history, focus, scroll, and privacy outside the transcript.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Read authorization, endpoint, rate limits, and store lookup.
2. Memory-only resource verification and shared viewer foundation.
3. Cache/CSP wiring, tests, persistence-negative controls, and CDP shell.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Relay read/header/auth tests, web resource/cache/provider/history tests, forced-byte corruption checks, persistence scans, and viewer-shell CDP fixtures cover the phase.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 2 supplies sanitized immutable variants; Phase 4 consumes the provider and resource contract for transcript cards.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Disable artifact reads and retain the non-pixel/unsupported path if exact authorization, integrity verification, or cache hygiene fails.
<!-- /ANCHOR:rollback -->

## Approach

Make the relay exact-tuple read contract authoritative, then build one shared browser resource store and viewer provider around it. Verify every boundary at the relay and prevent the web client from creating pixels or persistent media state until all integrity and decode checks pass.

## Steps (ordered)

1. Add separate `artifact:read` authorization and exact status/rate/concurrency policy.
2. Implement `POST /api/artifacts/read` with session, Origin, principal, device, exact ID/revision/variant checks, integrity headers, expiry/revocation behavior, and no-store delivery.
3. Extend the artifact store for immutable exact-tuple lookup and variant streaming without `latest` substitution.
4. Implement the memory-only resource loader with aborts, streamed length, WebCrypto digest, ETag/Content-Digest, decode, typed Blob, object URL reference counting, LRU bounds, and generation invalidation.
5. Mount the shared React Aria provider/host outside the virtualized transcript and add safe header/details/controls/history ownership.
6. Wire relay reads, cache/service-worker exclusions, CSP, and main application mounting; remove legacy artifact caches on activation.
7. Add relay/web tests and the deterministic in-memory CDP read fixture, then run the full gate and persistence-negative controls.

## Files to change

- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/auth/rate-limit.ts`
- `apps/pi-remote-relay/src/store/artifact-store.ts`
- `apps/pi-remote-web/src/artifacts/useArtifactResource.ts`
- `apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactViewerHost.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactHeader.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactDetails.tsx`
- `apps/pi-remote-web/src/artifacts/PreviewControls.tsx`
- `apps/pi-remote-web/src/artifacts/useArtifactHistory.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/cache.ts`
- `apps/pi-remote-web/public/service-worker.js`
- `apps/pi-remote-web/index.html`
- `apps/pi-remote-web/src/main.tsx`
- `apps/pi-remote-relay/tests/artifact-read.test.ts`
- `apps/pi-remote-relay/tests/artifact-headers.test.ts`
- `apps/pi-remote-relay/tests/artifact-auth.test.ts`
- `apps/pi-remote-web/tests/artifact-resource.test.ts`
- `apps/pi-remote-web/tests/artifact-cache.test.ts`
- `apps/pi-remote-web/tests/viewer-provider.test.tsx`
- `apps/pi-remote-web/tests/viewer-history.test.tsx`
- `scripts/inbound-media-cdp.mjs`

## Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --fixture viewer-shell --screenshot /private/tmp/f8-phase-3-light.png`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --fixture viewer-shell --screenshot /private/tmp/f8-phase-3-dark.png`
- `npm run build`
- Relay tests assert all response headers and exact status codes.
- Web tests flip one served byte, verify corruption with zero pixels, and prove Cache Storage, IndexedDB, localStorage, history, and persisted transcript state contain no artifact resource.

## Phase 1: Exact read and resource integrity

Implement exact authorization, response integrity, and memory-only resource verification.

## Phase 2: Shared viewer and persistence boundary

Mount shared viewer ownership outside the transcript, remove artifact persistence paths, and verify the viewer shell before card promotion.
