<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Ticketed Binary Ingress, Quarantine, and Cleanup

## Summary

This phase implements the secure relay attachment lane independently of Pi delivery: ephemeral reservation, bounded binary upload, quarantine normalization, status, cancellation, quotas, and lifecycle reaping. The host media flag remains off by default, and no preview or durable pixel store is introduced.

## Problem & Goal

Pi Remote has no bounded, ticketed path for receiving an image, validating it, and disposing of transient bytes safely. The goal is to provide an authenticated, foreground-only, operation-specific upload surface whose source and normalized bytes live only in outside-webroot quarantine for the defined lifecycle, with all invalid or abandoned data cleaned up.

## Scope

### In scope

- Ephemeral attachment ownership, manifests, lifecycle states, quotas, idempotency, atomic sets, revision/model/policy binding, and redacted status results.
- Outside-webroot extensionless `0600` quarantine, bounded streaming HTTP handling, exact length/digest checks, MIME sniffing, full decode, normalization, source deletion, and resource-limited decoder isolation.
- One-use operation-specific reservation, upload, status, and cancellation tickets bound to the existing principal/session/device/origin/foreground rules.
- TTL and lifecycle cleanup for cancellation, logout, device revocation, epoch changes, shutdown, startup crash recovery, and delivery ambiguity.
- Negative security tests for malformed input, races, cleanup, quotas, logging, and path isolation.

### Out of scope

- Pi invocation, host-to-Pi image delivery, transcript projection, provider persistence probing, or end-to-end user enablement.
- Preview retrieval, public or webroot storage, SQLite/media migrations, transcript or sync persistence, and browser cache storage.
- Enabling `PI_REMOTE_MEDIA_ENABLED=1`; the default-off gate remains mandatory.
- Changes to the fixed ink-on-parchment design system, WCAG AA behavior, or the read-only-by-default posture beyond the explicitly ticketed upload exception.

## User-facing behavior + states

N/A — internal. The host flag is off and the existing composer remains unchanged; this phase exposes no user-visible photo flow. Authenticated status responses are reconciliation metadata only and contain no retrievable preview.

## Acceptance criteria

- The upload mutation surface is reachable only with the host flag, exact origin, authenticated enrolled device, current session, live foreground socket, and operation-specific one-use ticket.
- Length, digest, MIME, decode, dimension, animation, quota, rate, timeout, and concurrency failures retain no usable bytes.
- Source bytes are deleted after normalized derivative commit; all abandoned derivatives are reaped within the defined TTL or lifecycle event.
- No attachment metadata or body is inserted into SQLite, transcript events, sync frames, service-worker cache, or logs beyond approved coarse buckets.
- Existing JSON/WebSocket limits and read-only routes are unchanged.

## Security & Redaction

Every mutation is host-gated, exact-origin, authenticated, foreground-only, session-bound, and operation-specific with a one-use ticket consumed before body reading. The binary handler requires exact `Content-Length`, counts streamed bytes, compares the declared and actual digest, writes only to extensionless `0600` quarantine outside the webroot, and never uses the global JSON reader. Decoder work is resource-limited and must enforce MIME, dimensions, frames/channels, animation, sRGB, metadata stripping, and deterministic JPEG/PNG output. Raw and normalized bytes are deleted at their lifecycle boundaries; durable stores and logs receive only approved coarse, redacted status buckets. The fixed read-only-by-default posture and host/extension-enforced plan mode remain unchanged.

## Dependencies & affected areas

- `apps/pi-remote-relay/src/attachments/attachment-limits.ts`
- `apps/pi-remote-relay/src/attachments/attachment-types.ts`
- `apps/pi-remote-relay/src/attachments/attachment-service.ts`
- `apps/pi-remote-relay/src/attachments/attachment-normalizer.ts`
- Approved resource-limited worker/process adapter for normalization
- `apps/pi-remote-relay/src/attachments/attachment-reaper.ts`
- `apps/pi-remote-relay/src/auth/auth-service.ts`
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/src/auth/rate-limit.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/index.ts`
- `apps/pi-remote-relay/tests/attachments.test.ts`
- `apps/pi-remote-relay/tests/attachment-normalization.test.ts`
- `apps/pi-remote-relay/tests/security/attachment-negative-controls.test.ts`

