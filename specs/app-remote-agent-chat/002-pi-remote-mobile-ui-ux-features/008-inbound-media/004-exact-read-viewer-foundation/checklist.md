---
title: "Verification Checklist: Phase 3 — Exact read lane and shared F6 viewer/resource foundation [template:level-2/checklist.md]"
description: "QA checklist for exact read authorization, integrity verification, shared viewer lifecycle, and no-store cache hygiene."
trigger_phrases:
  - "exact artifact read checklist"
  - "viewer resource verification"
  - "shared F6 viewer QA"
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
# Verification Checklist: Phase 3 — Exact read lane and shared F6 viewer/resource foundation

# Checklist — Exact read lane and shared F6 viewer/resource foundation

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

The phase changes only the listed relay read, web resource/viewer, cache, CSP, test, and harness areas.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

The acceptance and integrity/persistence items below are the authoritative QA list.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

No implementation finding is being closed by this scaffold; phase tasks remain explicit below.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

Exact tuple authorization, read-only behavior, no-store delivery, integrity-before-pixels, and memory-only resources are included below.
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

- [ ] CHK-001 [P0] An authorized exact session/artifact/revision/variant tuple returns the requested sanitized variant with matching digest and ETag.
- [ ] CHK-002 [P0] `latest`, paths, URLs, cross-session tuples, unknown fields, expired/revoked tuples, and unauthorized principals are rejected with the specified status mapping.
- [ ] CHK-003 [P0] Reads cannot invoke pi, mint a mutation ticket, or change workspace state.
- [ ] CHK-004 [P0] Response headers include no-store and the required content type, length, digest, ETag, disposition, nosniff, origin, and referrer controls.
- [ ] CHK-005 [P1] Read rate limits and thumbnail/full concurrency limits are enforced.
- [ ] CHK-006 [P0] The client creates no object URL until streamed length, SHA-256, ETag/Content-Digest, and image decode pass.
- [ ] CHK-007 [P0] Strict Mode, close, abort, revision replacement, logout, revocation, and backgrounding leave no resource leak.
- [ ] CHK-008 [P0] The shared provider mounts outside the virtualized transcript with deterministic history, focus, and scroll ownership.
- [ ] CHK-009 [P0] Cache Storage, IndexedDB, localStorage, history, persisted transcript state, and service-worker caches contain no artifact resource.
- [ ] CHK-010 [P0] The web test flips a served byte and proves corruption renders zero pixels.
- [ ] CHK-011 [P1] The shared viewer foundation uses safe metadata only and does not introduce send/export/share/save/copy/download actions.
- [ ] CHK-012 [P0] Security review confirms the read surface remains read-only and no-store before Phase 4 card promotion.
- [ ] CHK-013 [P0] `npm run typecheck` passes.
- [ ] CHK-014 [P0] `npm test` passes.
- [ ] CHK-015 [P0] `npm run test:web` passes.
- [ ] CHK-016 [P1] The light `viewer-shell` screenshot is written to `/private/tmp/f8-phase-3-light.png` at true 390 CSS pixels.
- [ ] CHK-017 [P1] The dark `viewer-shell` screenshot is written to `/private/tmp/f8-phase-3-dark.png` at true 390 CSS pixels.
- [ ] CHK-018 [P0] `npm run build` passes.
