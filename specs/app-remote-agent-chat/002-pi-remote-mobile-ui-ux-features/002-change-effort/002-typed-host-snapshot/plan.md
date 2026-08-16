# Plan — Typed host snapshot, reconciliation, and redacted outcomes

## Approach

Introduce the snapshot and issue-code contract at the protocol boundary, validate it with exact-key guards, and project only bounded data through the relay. Add a deduplicated read-only reconcile endpoint while preserving the settled mutation lane and compatibility endpoints. Finish with the smallest web adapter update and security-focused tests so the current UI can consume the new shapes without gaining a new visual surface.

## Steps

1. Add `RuntimeSnapshotDto` and bounded runtime issue-code constants/types to the protocol types.
2. Add exact-key guards and public exports; reject unknown issue codes, extra keys, invalid revisions or levels, unbounded strings, and mismatched session IDs.
3. Keep relay runtime projection allowlisted and implement read-only snapshot hydration that reads state, levels, and models together, preserves advertised order/subset, and deduplicates concurrent hydrates.
4. Map host rejection, unsupported capability, and ambiguous transport failures to typed issue codes without returning raw Pi/RPC text.
5. Add `POST /api/runtime/reconcile` as a `runtime:read` operation with no ticket consumption or forwarded intent; preserve the existing runtime endpoints and return bounded `Retry-After` for rate limiting.
6. Add snapshot fetching and transport-error normalization in the web relay adapter while preserving type safety for current controls.
7. Run protocol guard, relay runtime, security negative-control, reconcile, and compatibility tests.

## Files to change

- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `packages/pi-rpc-protocol/tests/guards.test.ts`
- `apps/pi-remote-relay/src/store/redaction.ts`
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/tests/runtime-control.test.ts`
- `apps/pi-remote-relay/tests/security/negative-controls.test.ts`
- Focused reconcile tests under `apps/pi-remote-relay/tests/`
- `apps/pi-remote-web/src/relay.ts`

## Verification gate

- `npm run typecheck` exits 0.
- `npm test` and `npm run test:web` exit 0, including protocol guards, relay runtime/security tests, and existing web runtime tests.
- Start the web app against the fixture relay and capture the current session view at exactly 390 CSS px through CDP in light and dark themes. Confirm the current UI has no new overflow, no raw runtime issue text, and no changed Build/Plan behavior.
