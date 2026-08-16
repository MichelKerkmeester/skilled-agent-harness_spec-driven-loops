# Plan — Protocol, redaction, and bound runtime authority

## Approach

Extend the shared contract first, with strict guards and negative fixtures defining the accepted shape. Then project only the allowlisted host data, add monotonic catalog/revision handling, and introduce the runtime-specific ticket path with consume-before-execute checks. Finally update web contract consumers, run the explicit security review, and verify that the still-visible picker has no incidental regression.

## Steps

1. Extend the protocol model/catalog DTOs, ticket request, control command, and bounded outcomes.
2. Add exact-key, bounded-value, path-free, enum, and operation-specific guards and exports.
3. Add positive and negative protocol fixtures for metadata, revisions, reason codes, and ticket requests.
4. Update relay model/catalog redaction and ensure undeclared host data and raw errors cannot cross the boundary.
5. Add monotonic catalog revisions, host-confirmed current-model retention, streaming capability, and exact target/revision checks in `RuntimeService`.
6. Add in-memory one-use runtime-ticket binding, consume ordering, expiry, foreground/session checks, action authorization, and rate limiting.
7. Add `POST /api/runtime/ticket` and update `/api/runtime/control` to compare and consume the bound ticket before runtime execution.
8. Add relay, auth, and negative-control coverage for substitution, replay, stale state, lifecycle loss, rejection, transport failure, and zero retries.
9. Update web relay/runtime types and the existing picker path without adding optimistic committed state.
10. Complete the explicit security posture review and run the whole verification gate.

## Files to change

- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `packages/pi-rpc-protocol/tests/guards.test.ts`
- `apps/pi-remote-relay/src/store/redaction.ts`
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`
- `apps/pi-remote-relay/src/auth/auth-service.ts`
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/tests/runtime-control.test.ts`
- `apps/pi-remote-relay/tests/auth.test.ts`
- `apps/pi-remote-relay/tests/security/negative-controls.test.ts`
- A focused runtime-ticket test file only if the existing fixtures become unclear.
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/runtime.ts`

## Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- A true-390px CDP capture of the still-visible model control in light and dark, using `Emulation.setDeviceMetricsOverride` with width `390`, `deviceScaleFactor: 1`, mobile emulation, and `Page.captureScreenshot`.
- A source/status sweep proving only the two requested spec files are created/changed by this documentation task and no generated artifact is included in the phase patch.
- The explicit security review covers ticket binding, action authorization, foreground checks, revision comparison, target equality, one-use consume ordering, rate limiting, error redaction, and negative controls.

