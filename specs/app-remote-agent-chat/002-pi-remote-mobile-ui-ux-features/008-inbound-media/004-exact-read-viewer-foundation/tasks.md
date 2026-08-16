---
title: "Tasks: Phase 3 — Exact read lane and shared F6 viewer/resource foundation [template:level-2/tasks.md]"
description: "Task breakdown for exact artifact reads, integrity verification, memory-only resources, shared viewer ownership, and cache hygiene."
trigger_phrases:
  - "exact read tasks"
  - "artifact resource tasks"
  - "shared viewer foundation tasks"
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
# Tasks — Exact read lane and shared F6 viewer/resource foundation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

The checkbox list below carries the concrete tasks from the phase source.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Read policy, endpoint, store, and resource setup is included below.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Viewer, cache, CSP, and test implementation tasks are included below.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Integrity, persistence-negative, resource-lifecycle, and CDP verification are defined in the companion checklist.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All concrete tasks below must be addressed before this phase is shippable.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

See `spec.md`, `plan.md`, and `checklist.md` in this folder.
<!-- /ANCHOR:cross-refs -->

- [ ] Change `apps/pi-remote-relay/src/auth/policy.ts` to add `artifact:read` separately from `artifact:publish` and leave unknown actions denied.
- [ ] Change `apps/pi-remote-relay/src/http/server.ts` to add `POST /api/artifacts/read` with exact body fields, session membership, Origin/principal/device checks, 404/409/410/429 mapping, concurrency limits, and no-store integrity headers.
- [ ] Change `apps/pi-remote-relay/src/auth/rate-limit.ts` for 60 thumbnail reads, 30 full reads, two thumbnail requests, and one full request per device/session window.
- [ ] Extend `apps/pi-remote-relay/src/store/artifact-store.ts` with immutable exact-tuple lookup, variant streaming, ETag/Content-Digest, expiry, and revocation behavior; reject `latest` and never substitute a newer revision.
- [ ] Add or extend `apps/pi-remote-web/src/artifacts/useArtifactResource.ts` with AbortSignal ownership, streamed length checking, WebCrypto SHA-256, ETag/Content-Digest comparison, `HTMLImageElement.decode`, typed Blob creation, reference-counted object URLs, bounded LRU retention, and generation invalidation.
- [ ] Add or extend `apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx` and `ArtifactViewerHost.tsx` as shared React Aria infrastructure outside the virtualized transcript, including frozen identity/digest, history, scroll, focus, and privacy-cover responsibilities.
- [ ] Add or extend `apps/pi-remote-web/src/artifacts/ArtifactHeader.tsx`, `ArtifactDetails.tsx`, `PreviewControls.tsx`, and `useArtifactHistory.ts` for safe metadata, close/history, zoom/pan controls, and focus restoration.
- [ ] Change `apps/pi-remote-web/src/relay.ts` for exact read status mapping, same-origin credentials, no-store, redirect rejection, and no mutation-ticket use.
- [ ] Change `apps/pi-remote-web/src/cache.ts` and `apps/pi-remote-web/public/service-worker.js` so artifact resources are never persisted or cached; remove legacy artifact caches during activation.
- [ ] Change `apps/pi-remote-web/index.html` and `apps/pi-remote-web/src/main.tsx` to merge the required CSP and mount the provider without artifact URLs in markup or history.
- [ ] Add relay artifact-read/header/auth tests, web resource/cache/provider/history tests, and the deterministic in-memory read fixture in `scripts/inbound-media-cdp.mjs`.
