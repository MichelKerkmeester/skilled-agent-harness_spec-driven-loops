# Plan — Phase 1 — Protocol and relay authority contract

## Approach

Introduce the protocol shapes and exact guards first, then thread the same discriminants through relay hydration and the authenticated mutation lane. Keep host dispatch behind guard, ticket, foreground, session, and revision checks; project only bounded redacted plan data; and use focused tests to prove stale, replay, idempotent, and delivery-unknown outcomes before the web smoke check.

## Steps

1. Add bounded plan artifact, snapshot/event, validity, command, and outcome types to the RPC protocol exports.
2. Implement exact-key and value guards for revisions, IDs, opaque tokens, `postRunMode`, bounded arrays/strings, and invalid/replay-shaped inputs; extend guard tests.
3. Extend the relay runtime service with independent runtime/plan revisions, authoritative hydration, one mutation lane, control-ID idempotency, stale rejection, and terminal delivery-unknown outcomes.
4. Make plan-status parsing accept only the pinned host mode/status contract and map malformed or unhealthy status to `unknown`, never Build.
5. Add authenticated `set_mode` and `execute_plan` ingress with foreground-device, one-use-ticket, session, revision, rate-limit, and safe error handling; keep `/api/runtime/state` read-only.
6. Apply allowlisted redaction/projectors before relay-store persistence, replay, sync, broadcast, or transcript projection; avoid raw token storage.
7. Run protocol, relay, redaction, and two-client control tests, then exercise the existing web smoke route in both themes and capture the required unavailable/hydration state when injectable.

## Files to change

- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/tests/guards.test.ts`
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`
- `apps/pi-remote-relay/src/runtime/plan-status.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/auth/rate-limit.ts`
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/src/store/redaction.ts`
- `apps/pi-remote-relay/src/replay/sync.ts`
- `apps/pi-remote-relay/src/store/relay-store.ts`
- `apps/pi-remote-relay/tests/runtime-control.test.ts`
- `apps/pi-remote-relay/tests/plan-status.test.ts`
- `apps/pi-remote-relay/tests/redaction.test.ts`
- focused plan-control integration test under `apps/pi-remote-relay/tests/`

## Verification gate

- `npm run typecheck`
- `npm test -- packages/pi-rpc-protocol/tests apps/pi-remote-relay/tests`
- Run the web smoke route with the current client and capture a true `390px` CDP screenshot in light and dark mode to prove the contract changes did not regress the live shell. Capture one hydration/unavailable state if the harness can inject it.

