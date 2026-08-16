---
title: "Implementation Plan: Phase 6 — Approved host enablement, security signoff, and release [template:level-2/plan.md]"
description: "Finish the approved host and policy boundary, prove the real end-to-end path, and gate release on security/device evidence."
trigger_phrases:
  - "host enablement release plan"
  - "inbound media security release"
  - "Pi Remote kill switch verification"
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
# Plan — Approved host enablement, security signoff, and release

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Treat this phase as the production boundary: finish allowlisting and policy, exercise the real host seam, run negative/device/release checks, and enable only after signoff.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Readiness requires all preceding phase evidence, real pre-stdout interception, host policy, negative controls, device verification, rollback, and security approval; completion requires the full release gate.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The approved extension is the publication authority, relay policy separates publish/read, the PWA reads exact sanitized revisions, and an emergency disable path gates the capability.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Host allowlist, capability handles, Plan mode, and policy review.
2. Real host-to-relay end-to-end and production hygiene checks.
3. Negative controls, device/release verification, signoff, and enablement/rollback decision.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the real cli-pi fixture, security negative controls, production dependency/storage checks, light/dark end-to-end CDP, build/tests, release gate, and physical device matrix.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phases 1–5, the pinned cli-pi integration, approved host extension, security owner, release gate, and oldest-supported-iPhone evidence are required.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Use the emergency kill switch to disable inbound-media capability and keep the disabled/unsupported path active if any release prerequisite fails.
<!-- /ANCHOR:rollback -->

## Approach

Treat this phase as the production boundary: finish the approved host adapter and policy checks, exercise the real pinned host-to-relay seam end to end, then run negative controls, production hygiene checks, device verification, visual comparison, and release/kill-switch gates. Enable only when every prerequisite is evidenced; otherwise preserve the disabled capability path.

## Steps (ordered)

1. Finalize host source allowlist, capability handles, host policy, Plan-mode semantics, context binding, and cleanup.
2. Review relay mutation/read policy and emergency disable behavior for default-deny separation.
3. Add the cli-pi 0.95/0.20 end-to-end fixture and assert interception before stdout/session persistence through final UI privacy states.
4. Add release and kill-switch checks plus production verification for decoder isolation, network-disabled worker, filesystem permissions, retention, quota, revocation, service-worker activation, CSP, and no-store headers.
5. Run all relay security and host negative controls, including origin/principal/device mismatches, stale revision, replay, path/symlink/polyglot input, scanner timeout, and byte flip.
6. Complete authenticated visual comparison, physical device verification, and security-owner approval without changing fixed tokens or adding export behavior.
7. Run the full release gate, confirm rollback/kill-switch operation, and sweep for repository media, caches, generated files, and stray changes.

## Files to change

- `extensions/pi-remote-inbound-media/src/index.ts`
- `extensions/pi-remote-plan/src/index.ts`
- `apps/pi-remote-relay/src/policy/mutation-policy.ts`
- `apps/pi-remote-relay/src/auth/policy.ts`
- The cli-pi 0.95/0.20 host-to-relay end-to-end fixture
- `scripts/release-verify.mjs` or the existing repository release gate
- `apps/pi-remote-relay/tests/security/negative-controls.test.ts`
- The host publisher test suite
- `scripts/inbound-media-cdp.mjs`
- Production verification fixtures for decoder, worker, storage, retention, quota, revocation, service worker, CSP, and headers
- The security-owner approval and physical-device verification records kept outside generated repository media

## Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --fixture end-to-end --screenshot /private/tmp/f8-phase-6-light.png`
- `node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --fixture end-to-end --screenshot /private/tmp/f8-phase-6-dark.png`
- `npm run build`
- Run the repository release verification and rollback/kill-switch checks.
- Run the real host integration and physical device matrix.
- The final diff/no-stray-files sweep proves screenshots, decoded buffers, binary fixtures, artifact caches, and generated media remain outside the repository and only approved implementation areas changed.

## Phase 1: Approved host and policy boundary

Finalize allowlisting, Plan-mode authority, publish/read separation, context binding, and emergency disable behavior.

## Phase 2: Release and signoff boundary

Run end-to-end, negative, device, release, no-stray-files, rollback, and security-owner checks before enabling the capability.
