# Plan — Protocol Contracts and Fail-Closed Capability Gate

## Approach

Define the smallest shared protocol surface first, with bounded exact-key guards at the browser/relay boundary and a metadata-only transcript shape. Thread capability data from the authoritative host runtime snapshot into the web client, add the default-off action gate, and prove the existing text-only path is unchanged before any byte-bearing implementation is introduced.

## Steps

1. Add bounded media-policy, runtime-capability, attachment-reference, ticket/status, cancellation/result, normalized-image, and redacted-transcript types.
2. Add exact-key guards for each new DTO and reject pixel-bearing or otherwise disallowed prompt-submit payloads.
3. Export all new types and guards and add protocol boundary tests for unknown keys, invalid digests/ordinals/limits, attachment references, redacted blocks, and unknown transcript kinds.
4. Map active-model `imageIn` and host media policy into the runtime snapshot; report false for text-only models.
5. Add the attachment action vocabulary and default-off route gate, preserving fail-closed lookup behavior.
6. Parse the capability in the web relay/state layers while preserving unknown transcript blocks safely.
7. Run the shared verification gate with media disabled and record that no photo affordance or layout change is present.

## Files to change

- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `packages/pi-rpc-protocol/tests/guards.test.ts`
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/index.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/state.ts`

## Verification gate

Run `npm run typecheck`, `npm run test`, and `npm run test:web`, plus the protocol guard suite and existing relay/web suites. Use CDP at exactly 390 CSS px in both light and dark themes with media disabled; verify no photo rows, no attachment rail, no changed text-composer layout, and no attachment route registration. Confirm the phase acceptance list and inspect the scoped worktree for intended changes only.

