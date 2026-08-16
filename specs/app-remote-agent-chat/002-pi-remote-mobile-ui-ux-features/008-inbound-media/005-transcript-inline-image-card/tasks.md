---
title: "Tasks: Phase 4 — Transcript projection and inline image card [template:level-2/tasks.md]"
description: "Task breakdown for transcript projection, standalone card components, deferred loading, state fixtures, and mobile verification."
trigger_phrases:
  - "inline card tasks"
  - "transcript projection tasks"
  - "inbound image state tasks"
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
# Tasks — Transcript projection and inline image card

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

The checkbox list below carries the concrete tasks from the phase source.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Projection and card surface setup is included below.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Card, resource, details, style, fixture, and test tasks are included below.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

DOM, disclosure, geometry, state, and CDP verification are defined in the companion checklist.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All concrete tasks below must be addressed before this phase is shippable.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

See `spec.md`, `plan.md`, and `checklist.md` in this folder.
<!-- /ANCHOR:cross-refs -->

- [ ] Change `apps/pi-remote-web/src/state.ts` to retain the typed inbound block, preserve numeric revision updates, map unknown blocks honestly, and keep processing-to-ready in the same block position.
- [ ] Change `apps/pi-remote-web/src/App.tsx` to render `InboundImageBlockView` as a standalone transcript item outside `ActivityGroup`/`DisclosurePanel` for tool-result sources.
- [ ] Add `InboundImageBlockView.tsx`, `InboundImageCard.tsx`, `ImagePlaceholder.tsx`, `VerifiedImage.tsx`, and `ImageStatus.tsx`; keep the ready card to one React Aria Button with no nested action.
- [ ] Extend `apps/pi-remote-web/src/artifacts/useArtifactResource.ts` with deferred loading until the card is near two viewport heights, one 750ms visible-card retry, actual-read/heartbeat offline wording, and terminal error mapping.
- [ ] Extend `apps/pi-remote-web/src/artifacts/ArtifactDetails.tsx` with safe authenticated details for ready/withheld states and no raw source metadata.
- [ ] Change `apps/pi-remote-web/src/turns.ts` only if the new sibling changes turn grouping; preserve order, stable keys, and no dropped blocks.
- [ ] Change `apps/pi-remote-web/src/style.css` for 16px gutters, 16px radius, reserved 180–240px well, contain fit, light/dark surfaces, checkerboard alpha treatment, 44px identity row, metadata wrapping, focus states, and no horizontal overflow.
- [ ] Extend `apps/pi-remote-web/src/demo.ts` with deterministic processing, deferred, thumbnail-fetching, verifying, decoding, inline-ready, withheld, denied, expired, missing, revision-conflict, corrupt, rate-limited, stale, revoked, unsupported, privacy-covered, closing, and aborted fixtures.
- [ ] Add `InboundImageCard.test.tsx`, `inbound-image-states.test.tsx`, `transcript-placement.test.tsx`, and `disclosure-persistence.test.tsx`.
- [ ] Extend `scripts/inbound-media-cdp.mjs` to assert card geometry, no horizontal overflow, light/dark theme, and card visibility after tool disclosure collapse.
