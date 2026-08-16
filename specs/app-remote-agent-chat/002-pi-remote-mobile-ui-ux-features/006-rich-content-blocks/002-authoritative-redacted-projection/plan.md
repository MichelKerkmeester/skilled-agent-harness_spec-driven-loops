# Plan — Authoritative rich-block contract and redacted projection

## Approach

Establish the guarded protocol contract first, then propagate the same stable identity and authoritative state through the relay projector, redaction boundary, store, replay, and read-only transports. Add deterministic security fixtures and compatibility handling at the web boundary, and finish with a baseline CDP harness that demonstrates the existing Activity/prose layout is unchanged before rich UI is enabled.

## Steps

1. Add bounded rich-capable tool call/result fields and the trusted text-artifact type to the protocol types.
2. Add strict guards, public barrel exports, and protocol tests for valid, legacy, malformed, oversized, duplicate-identity, revision, and redaction-metadata cases.
3. Propagate one stable `callId` and monotonic block revision through tool start, update, end, Bash update, assistant tool-call, and tool-result events.
4. Preserve result-before-call evidence and emit a safe unmatched result when identity cannot be proven; do not use adjacency or output wording.
5. Project explicit text artifacts only from trusted relay metadata and keep fenced-code parsing in the future web normalizer.
6. Redact command input, output, artifact source, tool names, and metadata before persistence, replay, broadcast, logs, errors, and fixture generation while retaining bounded provenance.
7. Verify relay-store and replay serialization preserve only guarded redacted fields, and verify the existing transcript and sync paths add no route or mutation authority.
8. Add deterministic redacted relay/protocol/event fixtures covering concurrency, ordering, revisions, terminal/truncation, malformed values, legacy shapes, secrets, paths, credentials, bidi controls, and ANSI bytes.
9. Extend web transport, state, and cache parsing only enough to retain guarded fields and `relay`/`cache`/`optimistic` provenance; leave incomplete cache entries on the legacy safe path.
10. Add the legacy-Activity CDP fixture, exact CSS-pixel viewport assertion, light/dark selection, screenshot output, and zero-overflow assertion.

## Files to change

- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `packages/pi-rpc-protocol/tests/guards.test.ts`
- `apps/pi-remote-relay/src/store/transcript-projector.ts`
- `apps/pi-remote-relay/src/store/redaction.ts`
- `apps/pi-remote-relay/src/store/relay-store.ts`
- `apps/pi-remote-relay/src/replay/sync.ts`
- `apps/pi-remote-relay/src/http/server.ts` (verification only; no new endpoint)
- `apps/pi-remote-relay/tests/transcript-projector.test.ts`
- `apps/pi-remote-relay/tests/redaction.test.ts`
- `apps/pi-remote-relay/tests/store.test.ts`
- `apps/pi-remote-relay/tests/sync.test.ts`
- `apps/pi-remote-relay/tests/security/negative-controls.test.ts`
- `apps/pi-remote-relay/src/fixtures/`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/state.ts`
- `apps/pi-remote-web/src/cache.ts`
- `scripts/rich-content-cdp.mjs`

## Verification gate

Run from the repository root:

```text
npm run typecheck
npm test
npm run test:web
npm run build
node scripts/rich-content-cdp.mjs --fixture legacy-activity --viewport-width 390 --theme light --output <temporary-directory>/f7-phase-1-light.png
node scripts/rich-content-cdp.mjs --fixture legacy-activity --viewport-width 390 --theme dark --output <temporary-directory>/f7-phase-1-dark.png
```

The gate passes only when protocol and relay suites pass, the CDP runner reports exactly 390 CSS pixels, page horizontal overflow is zero, both screenshots are inspected for unchanged transcript/composer geometry, theme contrast, and unclipped controls, and security tests show the redaction marker—not the fixture sentinel—in page responses, sync messages, stored envelopes, logs, and error text.
