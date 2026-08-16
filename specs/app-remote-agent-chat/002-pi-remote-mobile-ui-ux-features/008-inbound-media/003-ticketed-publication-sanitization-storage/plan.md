---
title: "Implementation Plan: Phase 2 — Ticketed publication, sanitization, and atomic artifact storage [template:level-2/plan.md]"
description: "Implement the relay publication boundary, isolated sanitizer, artifact store, and revision-safe lifecycle."
trigger_phrases:
  - "publication sanitizer plan"
  - "artifact store plan"
  - "ticketed image publication"
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
# Plan — Ticketed publication, sanitization, and atomic artifact storage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Build the relay publication boundary from storage and sanitization through authorization, HTTP operations, revision settlement, fixtures, and cleanup.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Readiness requires the ticket context, source limits, fail-closed policy, cleanup path, and verification boundaries to be explicit; completion requires the shared and sanitizer gates.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The extension publishes through a one-use ticket to the relay; an isolated worker produces bounded variants; the store and projector settle metadata through expected-revision compare-and-swap.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Artifact store and sanitizer.
2. Authorization, ticketed HTTP boundary, and lifecycle settlement.
3. Host source allowlist, fixtures, cleanup, and verification.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Relay store/sanitizer/publication/security tests, extension publication tests, deterministic lifecycle fixtures, temporary-directory assertions, and disabled PWA CDP fixtures cover the phase.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 1 supplies the contract and host seam; Phase 3 consumes only the final sanitized artifact metadata and variants.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Disable the inbound-media capability, discard staged artifacts, and retain withheld/unsupported behavior if ticket, sanitizer, cleanup, or revision checks fail.
<!-- /ANCHOR:rollback -->

## Approach

Build the relay boundary from the inside out: define artifact lifecycle/storage and the isolated sanitizer, then add authorization and the extension-only HTTP operations, and finally connect compare-and-swap transcript settlement, retention, fixtures, and the host adapter. Keep all browser reads and UI enablement for later phases, with the demo limited to deterministic processing/withheld states.

## Steps (ordered)

1. Add the bounded artifact store and metadata migration with random immutable IDs/revisions, variant files, digest/ETag support, retention, quota, expiry, revocation purge, and filesystem permissions.
2. Implement the sanitizer pipeline and exact source/output/worker limits, including decoder validation, metadata stripping, redaction, deterministic derivative encoding, and fail-closed withholding.
3. Add `artifact:publish` policy and one-use ticket creation/consumption bound to the full publication context and 90-second start deadline.
4. Add extension-only ticket and binary publish operations that consume tickets before body reads, enforce lengths, reject browser origins, clean partial bodies, and suppress raw errors.
5. Insert processing metadata and settle ready/withheld via expected-revision compare-and-swap without changing block order; finalize abandoned processing after 60 seconds.
6. Add relay and extension security fixtures, cleanup assertions, host source allowlist behavior, and processing/withheld demo fixtures.
7. Run the shared gate plus every sanitizer boundary and verify temporary artifact directories are empty before Phase 3.

## Files to change

- `apps/pi-remote-relay/src/store/artifact-store.ts`
- `apps/pi-remote-relay/src/store/artifact-sanitizer.ts`
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/src/auth/auth-service.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/store/relay-store.ts`
- `apps/pi-remote-relay/src/store/transcript-projector.ts`
- The next numbered migration under `apps/pi-remote-relay/migrations/`
- `extensions/pi-remote-inbound-media/src/index.ts`
- `apps/pi-remote-relay/tests/artifact-store.test.ts`
- `apps/pi-remote-relay/tests/artifact-sanitizer.test.ts`
- `apps/pi-remote-relay/tests/inbound-media-publish.test.ts`
- `apps/pi-remote-relay/tests/security/`
- `extensions/pi-remote-inbound-media/tests/`
- `apps/pi-remote-web/src/demo.ts`

## Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --fixture processing --screenshot /private/tmp/f8-phase-2-light.png`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --fixture withheld --screenshot /private/tmp/f8-phase-2-dark.png`
- `npm run build`
- Run the relay sanitizer fixture suite at exactly 15 MiB, 30 MiB, 60 MP, 12,000px, four-image, worker, output, quota, and timeout boundaries.
- Inspect the temporary artifact directory after each sanitizer test and assert it is empty.

## Phase 1: Publication boundary

Implement ticket binding, isolated sanitization, bounded storage, and expected-revision lifecycle settlement.

## Phase 2: Cleanup and signoff boundary

Run source/intermediate cleanup, retention, quota, revocation, security, and true-390px verification before exact reads are exposed.
