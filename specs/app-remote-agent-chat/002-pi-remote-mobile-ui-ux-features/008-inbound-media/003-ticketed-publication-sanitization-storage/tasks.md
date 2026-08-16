---
title: "Tasks: Phase 2 — Ticketed publication, sanitization, and atomic artifact storage [template:level-2/tasks.md]"
description: "Task breakdown for the ticketed publication route, sanitizer, artifact store, lifecycle, fixtures, and cleanup."
trigger_phrases:
  - "sanitizer tasks"
  - "artifact storage tasks"
  - "ticketed publication tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/002-pi-remote-mobile-ui-ux-features/008-inbound-media/003-ticketed-publication-sanitization-storage"
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
# Tasks — Ticketed publication, sanitization, and atomic artifact storage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

The checkbox list below carries the concrete tasks from the phase source.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Storage, sanitizer, authorization, and migration setup is included below.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Publication, lifecycle, host, and test implementation tasks are included below.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Boundary, cleanup, security, and CDP verification are defined in the companion checklist.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All concrete tasks below must be addressed before this phase is shippable.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

See `spec.md`, `plan.md`, and `checklist.md` in this folder.
<!-- /ANCHOR:cross-refs -->

- [ ] Add `apps/pi-remote-relay/src/store/artifact-store.ts` for random immutable artifact IDs, artifact revisions, variant files, digest/ETag, 24-hour retention, 50 MiB session quota, expiry, revocation purge, and filesystem permissions.
- [ ] Add `apps/pi-remote-relay/src/store/artifact-sanitizer.ts` for streaming source limits, magic-byte/decoder validation, worker isolation, one-frame checks, orientation, sRGB conversion, metadata stripping, exclusion masks, OCR secret/path detection, opaque burned-in masks, deterministic thumbnail/full encoding, and fail-closed withholding.
- [ ] Change `apps/pi-remote-relay/src/auth/policy.ts` and `apps/pi-remote-relay/src/auth/auth-service.ts` to add `artifact:publish` as a distinct action and bind one-use tickets to the required publication context and 90-second start deadline.
- [ ] Change `apps/pi-remote-relay/src/http/server.ts` to implement extension-only publish-ticket and binary publish operations; consume the ticket before reading the body, enforce declared and streamed length, reject browser-origin requests, delete partial bodies, and suppress raw errors.
- [ ] Change `apps/pi-remote-relay/src/store/relay-store.ts` and `apps/pi-remote-relay/src/store/transcript-projector.ts` to insert processing metadata, settle ready/withheld through expected-revision compare-and-swap, preserve block ID/sequence, and finalize abandoned processing after 60 seconds.
- [ ] Add the next numbered migration under `apps/pi-remote-relay/migrations/` for artifact metadata, lifecycle state, variant digests, expiry, and ownership without source bytes, paths, URLs, OCR, or decoder detail.
- [ ] Add or update `extensions/pi-remote-inbound-media/src/index.ts` so only approved capture handles or in-memory bytes enter the binary route; reject Markdown paths, arbitrary repository paths, symlinks, and unapproved source tools.
- [ ] Add relay store, sanitizer, publication, security, and extension tests under the paths specified by the phase.
- [ ] Add relay-only deterministic processing, ready, withheld, expiry, and scanner-failure fixtures with no committed image bytes and clean temporary directories.
- [ ] Add processing/withheld demo states to `apps/pi-remote-web/src/demo.ts` without making the web client a publisher.
