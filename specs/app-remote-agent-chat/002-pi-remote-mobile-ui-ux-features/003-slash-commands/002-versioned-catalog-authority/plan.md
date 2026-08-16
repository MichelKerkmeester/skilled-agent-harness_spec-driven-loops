# Plan — Versioned catalog authority and fail-closed submission

## Approach

Extend the existing protocol and relay boundaries in dependency order. First define and strictly guard the versioned catalog, binding, and expected-revision shapes; then project only safe host data and wire the catalog/session lifecycle; finally gate slash-aware prompt forwarding behind one-use ticket consumption and current identity/revision checks. Keep ordinary prompt handling and the existing `+` route on their current compatible path throughout.

## Steps

1. Define the versioned `CommandCatalogDto`, selected binding, and slash-aware expected-revision submission types and export them.
2. Add strict guards for identity values, bounded descriptors, optional authoritative metadata, canonical names, and incompatible or unknown shapes.
3. Extend relay redaction and command-service state to produce complete, bounded snapshots with host epoch, session, and catalog revisions.
4. Keep `/api/commands/list` authenticated as `commands:list`, and validate slash-submit envelopes without exposing host details.
5. Add fail-closed revalidation before `supervisor.send`, consume each ticket once, and keep slash commands out of implicit `steer`/`followUp` mapping.
6. Wire host epoch, session state, and `agent_start`/settled availability transitions through the relay index and policy checks.
7. Preserve and test ordinary prompt compatibility and existing `+` insertion while adding protocol, relay, security, HTTP, and integration fixtures.
8. Run the type, targeted protocol/relay, web, and true-390px light/dark verification gate, then obtain security review.

## Files to change

- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `packages/pi-rpc-protocol/tests/guards.test.ts`
- `apps/pi-remote-relay/src/store/redaction.ts`
- `apps/pi-remote-relay/src/commands/command-service.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/prompt/prompt-service.ts`
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/src/index.ts`
- `apps/pi-remote-relay/tests/commands.test.ts`
- `apps/pi-remote-relay/tests/prompt.test.ts`
- `apps/pi-remote-relay/tests/security/negative-controls.test.ts`
- Relevant `apps/pi-remote-relay` HTTP and integration fixtures
- `apps/pi-remote-web/src/relay.ts`

## Verification gate

- `npm run typecheck`
- `npx vitest run packages/pi-rpc-protocol/tests apps/pi-remote-relay/tests`
- `npm run test:web`
- Start the existing app/fixture and capture the unchanged composer and `+` browser through CDP at exactly 390 CSS pixels in both light and dark themes.
- Confirm the baseline has no layout regression, no new persistence, and no exposed privileged rows.

