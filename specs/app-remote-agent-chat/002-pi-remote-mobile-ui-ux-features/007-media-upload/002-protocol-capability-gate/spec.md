<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Protocol Contracts and Fail-Closed Capability Gate

## Summary

This phase defines the authoritative media capability, attachment references, bounded limits, redacted transcript block, and exact-key protocol guards before any attachment bytes are accepted. The host remains text-only with media disabled while the contracts and regression coverage are established.

## Problem & Goal

The protocol and runtime snapshot currently do not describe image capability, attachment references, or metadata-only attachment transcript blocks. The goal is to define those contracts, advertise them from the host, and keep every route and client path fail-closed until the media flag is explicitly enabled.

## Scope

### In scope

- Protocol DTOs and exact-key guards for media policy, runtime capability, attachment manifests/tickets/status/cancellation/results, prompt attachment references, normalized Pi image blocks, and redacted transcript blocks.
- Authoritative active-model `imageIn` and host media-policy advertisement in the runtime snapshot.
- Attachment action vocabulary and the default-off `PI_REMOTE_MEDIA_ENABLED` gate.
- Web parsing of the capability and preservation of unknown transcript blocks.
- Protocol guard tests and regression coverage for the existing text path.

### Out of scope

- Registering or enabling upload routes, accepting binary bodies, normalizing images, or delivering pixels to Pi.
- Composer photo rows, attachment rails, local previews, or end-to-end submission behavior.
- Any persistent media storage, transcript pixels, browser media cache, or inline browser base64.
- Changes to the fixed ink-on-parchment design system, WCAG AA posture, or read-only-by-default security model.

## User-facing behavior + states

N/A — internal. With media disabled, the existing text composer, prompt, steer, follow-up, plan, approval, sync, and cache behavior remains unchanged; no photo action or attachment rail exists.

## Acceptance criteria

- Existing text prompt, steer, follow-up, plan, approval, sync, and cache tests remain green.
- A malformed or pixel-bearing submission is rejected before relay business logic.
- The runtime snapshot is the only source of model capability and host limits.
- With the flag off, no attachment route is registered and no UI photo action exists.
- This phase does not alter the read-only behavior of any existing route.

## Security & Redaction

All new browser-facing submission shapes contain references and bounded metadata only; guards reject pixels, base64, filenames, paths, unknown keys, invalid ordinals, invalid digests, and out-of-range limits. The host runtime snapshot is authoritative for capability and limits, a text-only model reports `imageIn: false`, and the default-off route gate fails closed. The fixed read-only-by-default posture remains in force: any future mutation is one-use ticketed, revision-checked, and host/extension-enforced, while transcript blocks are metadata-minimal and redacted.

## Dependencies & affected areas

- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `packages/pi-rpc-protocol/tests/guards.test.ts`
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`
- Host/Pi model mapping used by the runtime snapshot
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/index.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/state.ts`

