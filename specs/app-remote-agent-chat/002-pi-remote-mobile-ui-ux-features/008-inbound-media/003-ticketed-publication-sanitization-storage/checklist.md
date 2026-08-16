---
title: "Verification Checklist: Phase 2 — Ticketed publication, sanitization, and atomic artifact storage [template:level-2/checklist.md]"
description: "QA checklist for ticket binding, image sanitization, artifact cleanup, lifecycle settlement, and boundary verification."
trigger_phrases:
  - "publication sanitizer checklist"
  - "artifact store verification"
  - "ticketed image publication QA"
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
# Verification Checklist: Phase 2 — Ticketed publication, sanitization, and atomic artifact storage

# Checklist — Ticketed publication, sanitization, and atomic artifact storage

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

The phase changes only the listed relay, extension, migration, fixture, and demo areas.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

The acceptance and sanitizer-boundary items below are the authoritative QA list.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

No implementation finding is being closed by this scaffold; phase tasks remain explicit below.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

Ticket binding, decoder isolation, redaction, source allowlist, fail-closed withholding, and cleanup are included below.
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

- [ ] CHK-001 [P0] Valid JPEG, PNG, and static WebP publication creates processing and then ready with metadata and artifact references only.
- [ ] CHK-002 [P0] Unsupported, animated, malformed, over-limit, scanner-failed, and redaction-failed inputs become withheld.
- [ ] CHK-003 [P0] No original or withheld artifact bytes are readable.
- [ ] CHK-004 [P0] Replayed and context-mismatched tickets create neither a block nor an artifact.
- [ ] CHK-005 [P0] A late expected-revision completion is deleted and cannot reorder or overwrite a newer block.
- [ ] CHK-006 [P0] Stored variants contain only final sanitized bytes.
- [ ] CHK-007 [P0] Source and intermediate buffers are deleted after commit, withholding, timeout, conflict, revocation, and failure.
- [ ] CHK-008 [P0] Retention, revocation, 50 MiB session quota, and abandoned-processing cleanup are deterministic and tested.
- [ ] CHK-009 [P0] The ticket is consumed before body reads and declared length matches streamed length.
- [ ] CHK-010 [P0] Browser-origin publication and unapproved sources, paths, repository reads, and symlinks are rejected.
- [ ] CHK-011 [P0] Decoder isolation, source allowlist, redaction detectors, and fail-closed behavior receive security-owner signoff before Phase 3.
- [ ] CHK-012 [P1] The processing/withheld demo does not expose a PWA publication control.
- [ ] CHK-013 [P0] `npm run typecheck` passes.
- [ ] CHK-014 [P0] `npm test` passes.
- [ ] CHK-015 [P0] `npm run test:web` passes.
- [ ] CHK-016 [P1] The light processing screenshot is written to `/private/tmp/f8-phase-2-light.png` at true 390 CSS pixels.
- [ ] CHK-017 [P1] The dark withheld screenshot is written to `/private/tmp/f8-phase-2-dark.png` at true 390 CSS pixels.
- [ ] CHK-018 [P0] `npm run build` passes.
- [ ] CHK-019 [P0] Sanitizer tests cover exact 15 MiB, 30 MiB, 60 MP, 12,000px, four-image, worker, output, quota, and timeout boundaries.
- [ ] CHK-020 [P0] Temporary artifact directories are empty after every sanitizer fixture.
