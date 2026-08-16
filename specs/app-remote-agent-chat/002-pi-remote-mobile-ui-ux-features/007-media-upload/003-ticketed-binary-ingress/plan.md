# Plan — Ticketed Binary Ingress, Quarantine, and Cleanup

## Approach

Build the relay lane around an in-memory/ephemeral attachment service and a single shared limits module so reservation, streaming, normalization, quota accounting, tests, and reaping cannot drift. Keep the binary route separate from JSON handling, consume authority before reading bytes, normalize in a resource-limited adapter, and make every failure and lifecycle event converge on deletion without creating a preview or durable media record.

## Steps

1. Create shared fixed limits and redacted attachment types with no pixel-bearing DTO fields.
2. Implement reservation ownership, per-device quota accounting, submission idempotency, atomic set state, and revision/model/policy binding.
3. Implement one-use operation-specific reservation and cancellation tickets while preserving existing auth binding rules.
4. Implement the bounded binary PUT route with exact content length, byte counting, digest comparison, extensionless `0600` quarantine, and no global JSON reader.
5. Implement resource-limited MIME sniffing, full decode, frame/channel/pixel ceilings, orientation, sRGB conversion, metadata stripping, deterministic output, and source deletion.
6. Implement authenticated status reconciliation, cancellation, rate limits, and cleanup/reaping for every listed TTL and lifecycle event.
7. Wire auth/session/index lifecycle hooks and add focused positive/negative, race, quota, logging, and path-isolation tests.
8. Run the shared verification gate with the host flag off and exercise every invalid authority combination.
9. Complete the required security review before any environment enables the flag.

## Files to change

- `apps/pi-remote-relay/src/attachments/attachment-limits.ts`
- `apps/pi-remote-relay/src/attachments/attachment-types.ts`
- `apps/pi-remote-relay/src/attachments/attachment-service.ts`
- `apps/pi-remote-relay/src/attachments/attachment-normalizer.ts`
- `apps/pi-remote-relay/src/attachments/attachment-reaper.ts`
- `apps/pi-remote-relay/src/auth/auth-service.ts`
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/src/auth/rate-limit.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/index.ts`
- `apps/pi-remote-relay/tests/attachments.test.ts`
- `apps/pi-remote-relay/tests/attachment-normalization.test.ts`
- `apps/pi-remote-relay/tests/security/attachment-negative-controls.test.ts`

## Verification gate

Run `npm run typecheck`, `npm run test`, and `npm run test:web`, plus the focused relay attachment, normalization, and security suites. Use CDP at exactly 390 CSS px in both light and dark themes with the host flag off; verify the existing composer is unchanged. Exercise the endpoints with an authenticated foreground socket and every invalid authority combination, confirm cleanup/no-retention evidence, and complete the required security review.

