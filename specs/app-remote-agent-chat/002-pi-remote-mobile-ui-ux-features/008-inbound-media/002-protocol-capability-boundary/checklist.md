---
title: "Verification Checklist: Phase 1 — Protocol and pre-stdout capability boundary [template:level-2/checklist.md]"
description: "QA checklist for the versioned protocol, host seam, unsupported behavior, and 390px verification gate."
trigger_phrases:
  - "protocol verification checklist"
  - "pre-stdout verification"
  - "inbound media phase one QA"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/002-pi-remote-mobile-ui-ux-features/008-inbound-media/002-protocol-capability-boundary"
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
# Verification Checklist: Phase 1 — Protocol and pre-stdout capability boundary

# Checklist — Protocol and pre-stdout capability boundary

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

The phase changes only the listed protocol, host, compatibility, and harness areas.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

The acceptance and verification items below are the authoritative QA list.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

No implementation finding is being closed by this scaffold; phase tasks remain explicit below.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

The no-byte, no-path, no-URL, host-authority, and fail-closed requirements are included below.
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

- [ ] CHK-001 [P0] All valid processing, ready, and terminal `inbound_image` shapes are accepted by the protocol guard.
- [ ] CHK-002 [P0] Unknown fields, unsafe paths/URLs/base64/OCR values, malformed digests or revisions, invalid bounds, and inconsistent availability/content combinations are rejected.
- [ ] CHK-003 [P1] Existing transcript kinds and F5 `ImageContent` remain type-compatible.
- [ ] CHK-004 [P1] Unknown inbound blocks render as the existing unsupported/redacted row and are not silently dropped.
- [ ] CHK-005 [P0] The host capability is advertised only after cli-pi 0.95/0.20 pre-stdout interception is proven.
- [ ] CHK-006 [P0] The unavailable-seam test proves no image-bearing content reaches stdout or session writes.
- [ ] CHK-007 [P0] No image byte, base64, path, or URL is added to JSONL, sync, transcript, or durable state.
- [ ] CHK-008 [P0] Plan mode remains read-only and the phone cannot authorize capture.
- [ ] CHK-009 [P1] The disabled/unsupported fixture shows no feature-enabling control in light and dark themes.
- [ ] CHK-010 [P1] The CDP runner uses `Emulation.setDeviceMetricsOverride` or equivalent at exactly 390 CSS pixels.
- [ ] CHK-011 [P0] `npm run typecheck` passes.
- [ ] CHK-012 [P0] `npm test` passes.
- [ ] CHK-013 [P0] `npm run test:web` passes.
- [ ] CHK-014 [P1] The light screenshot is written to `/private/tmp/f8-phase-1-light.png`.
- [ ] CHK-015 [P1] The dark screenshot is written to `/private/tmp/f8-phase-1-dark.png`.
- [ ] CHK-016 [P0] `npm run build` passes.
- [ ] CHK-017 [P0] Security review is recorded before the Phase 2 binary publication boundary is exposed.
