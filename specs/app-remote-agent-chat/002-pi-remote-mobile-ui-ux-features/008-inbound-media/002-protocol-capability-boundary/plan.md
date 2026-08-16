---
title: "Implementation Plan: Phase 1 — Protocol and pre-stdout capability boundary [template:level-2/plan.md]"
description: "Implement the versioned protocol and gated host seam, then verify unsupported behavior without adding a binary path."
trigger_phrases:
  - "protocol implementation plan"
  - "pre-stdout host seam"
  - "inbound media phase one"
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
# Plan — Protocol and pre-stdout capability boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

The plan adds the protocol contract and strict validation before the host seam, then keeps the web surface disabled/unsupported until capability proof exists.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

The phase is ready when the source contract, scope, dependencies, and true-390px verification path are explicit; it is complete only when the listed tests and screenshots pass.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The protocol package defines metadata-only shapes, the host adapter controls pre-stdout capability, and the web client renders an existing unsupported row when unavailable.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Protocol types and guards.
2. Host seam and Plan-mode policy review.
3. Compatibility fixture and verification harness.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Protocol unit tests, host publisher-boundary tests, web compatibility tests, and light/dark CDP screenshots cover the phase.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The pinned cli-pi 0.95/0.20 interception seam is the enabling dependency; transport ceilings and the fixed design/security contracts remain unchanged.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Keep the capability disabled and retain the unsupported/redacted row if protocol compatibility or pre-stdout interception verification fails.
<!-- /ANCHOR:rollback -->

## Approach

Define the protocol union and its strict guards first, then place the host interception seam behind an explicit capability check. Keep the web branch as a compatibility and disabled-state path only, so this phase can ship independently without a binary transport, image store, or viewer.

## Steps (ordered)

1. Add the processing, ready, and terminal `inbound_image` types, artifact descriptors, safe text fields, and exact redaction/share fields.
2. Implement strict guards for keys, state/content consistency, bounded text, opaque IDs, digests, dimensions, timestamps, and supported MIME values; extend protocol fixtures with valid and hostile shapes.
3. Add the isolated inbound-media host package and publisher-boundary test, including the no-capability path when pre-stdout interception is unavailable.
4. Review Plan-mode host policy and keep capture authorization on the host.
5. Add the web unsupported/redacted compatibility branch, disabled fixture, initial CDP runner, and minimal workspace wiring.
6. Run the protocol, publisher-boundary, compatibility, and shared verification gates before recording the security review boundary for Phase 2.

## Files to change

- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `packages/pi-rpc-protocol/tests/guards.test.ts`
- `extensions/pi-remote-inbound-media/package.json`
- `extensions/pi-remote-inbound-media/tsconfig.json`
- `extensions/pi-remote-inbound-media/src/index.ts`
- `extensions/pi-remote-inbound-media/tests/publisher-boundary.test.ts`
- `extensions/pi-remote-plan/src/index.ts`
- The existing host policy contract used by the Plan-mode extension
- `apps/pi-remote-web/src/state.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/demo.ts`
- `scripts/inbound-media-cdp.mjs`
- The root workspace manifest used to register the extension package and CDP runner

## Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --screenshot /private/tmp/f8-phase-1-light.png`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --screenshot /private/tmp/f8-phase-1-dark.png`
- `npm run build`
- The publisher test spies on stdout/session writes and proves that unavailable pre-stdout interception forwards no image-bearing content.
- The CDP runner uses device metrics of exactly 390 CSS pixels and shows no feature-enabling control in both themes.

## Phase 1: Contract and capability proof

Implement the versioned protocol, strict guards, host seam, and disabled compatibility path described in the ordered steps.

## Phase 2: Verification boundary

Run the protocol, publisher-boundary, compatibility, and true-390px light/dark verification before the next binary publication phase.
