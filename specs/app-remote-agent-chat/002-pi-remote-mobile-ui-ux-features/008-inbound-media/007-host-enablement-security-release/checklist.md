---
title: "Verification Checklist: Phase 6 — Approved host enablement, security signoff, and release [template:level-2/checklist.md]"
description: "QA checklist for approved host enablement, end-to-end privacy behavior, security approval, release gates, and rollback."
trigger_phrases:
  - "host enablement checklist"
  - "inbound media security release checklist"
  - "Pi Remote release signoff"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/002-pi-remote-mobile-ui-ux-features/008-inbound-media/007-host-enablement-security-release"
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
# Verification Checklist: Phase 6 — Approved host enablement, security signoff, and release

# Checklist — Approved host enablement, security signoff, and release

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

The phase changes only the listed host, plan, relay policy, release, security, fixture, harness, and approval areas.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

The acceptance, end-to-end, negative-control, device, release, and no-stray-files items below are the authoritative QA list.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

No implementation finding is being closed by this scaffold; phase tasks remain explicit below.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

Allowlisting, Plan-mode authority, default-deny policy, redaction, no-store/cache hygiene, retention, residual risk, and kill-switch approval are included below.
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

The phase remains open until every required checkbox below has evidence and security approval is recorded.
<!-- /ANCHOR:summary -->

- [ ] CHK-001 [P0] The real pinned cli-pi 0.95/0.20 host publishes through the approved pre-stdout seam, or the capability remains disabled.
- [ ] CHK-002 [P0] No fallback transport, raised limit, path, URL, base64, or stdout/session-persistence detour exists.
- [ ] CHK-003 [P0] Only allowlisted sources can publish.
- [ ] CHK-004 [P0] Host/extension policy remains authoritative in Plan mode and the phone cannot authorize capture/publication.
- [ ] CHK-005 [P0] End-to-end ready and withheld behavior passes.
- [ ] CHK-006 [P0] End-to-end expiry, revocation, stale revision, corrupt byte, offline, and background privacy behavior passes on the physical device.
- [ ] CHK-007 [P0] No outbound mutation, F5 attachment, prompt submission, pi re-send, share, save, copy, download, URL, path, or persistent browser media path exists.
- [ ] CHK-008 [P0] Decoder isolation, redaction pipeline, read authorization, no-store/cache hygiene, retention, revocation, residual risks, and kill switch receive security-owner signoff.
- [ ] CHK-009 [P0] Release and rollback/kill-switch checks pass without logging image bytes, IDs, paths, OCR, digests, URLs, or decoder exceptions.
- [ ] CHK-010 [P0] Production verification covers decoder dependency, network-disabled worker, filesystem permissions, retention, quota, revocation listener, service-worker activation, CSP, and no-store headers.
- [ ] CHK-011 [P0] Negative controls cover wrong origin, principal, device, stale revision, replayed ticket, path injection, symlink, polyglot, scanner timeout, and forced byte flip.
- [ ] CHK-012 [P1] Authenticated visual comparison is complete without changing fixed design tokens or adding export behavior.
- [ ] CHK-013 [P0] Physical Safari and installed-PWA device verification is complete.
- [ ] CHK-014 [P1] Light and dark end-to-end screenshots use true 390 CSS-pixel CDP metrics and are outside the repository.
- [ ] CHK-015 [P0] `npm run typecheck` passes.
- [ ] CHK-016 [P0] `npm test` passes.
- [ ] CHK-017 [P0] `npm run test:web` passes.
- [ ] CHK-018 [P1] The light end-to-end screenshot is written to `/private/tmp/f8-phase-6-light.png`.
- [ ] CHK-019 [P1] The dark end-to-end screenshot is written to `/private/tmp/f8-phase-6-dark.png`.
- [ ] CHK-020 [P0] `npm run build` passes.
- [ ] CHK-021 [P0] The final diff/no-stray-files sweep finds no screenshots, decoded buffers, binary fixtures, artifact caches, generated media, or unrelated changes in the repository.
- [ ] CHK-022 [P0] Security-owner approval is recorded before capability enablement.
