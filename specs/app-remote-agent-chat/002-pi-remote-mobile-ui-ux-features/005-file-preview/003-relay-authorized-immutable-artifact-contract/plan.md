# Plan — Relay-authorized immutable artifact contract

## Approach

Define and validate the relay-authored descriptor at the protocol boundary first, then persist only sanitized immutable artifacts behind the existing SQLite and authentication boundaries. Project artifacts only from an explicit allowlisted snapshot event, serve only exact authenticated revisions, and make the web viewer consume metadata/resource results without path inference. Exercise unavailable and cache-exclusion states through local deterministic fixtures before any binary renderer is added.

## Steps

1. Add the `FilePreviewBlock` union member and strict guard/export surface, preserving string artifact revisions and rejecting unknown, path-bearing, out-of-bounds, invalid digest, and invalid state fields.
2. Add the artifact store and migration pair for immutable session/artifact/revision rows, sanitized bytes, digest/ETag, range metadata, retention, expiry, revocation, purge, and SQLite transaction handling.
3. Add the fail-closed sanitizer and allowlisted snapshot projection; update relay initialization/projector wiring so missing approval emits no guessed artifact and existing diffs stay unchanged.
4. Add `artifact:read` policy and the exact-tuple HTTP route with ownership, revision, path/`latest`, rate/size, range, no-store/nosniff/same-origin, and ticket-free read checks.
5. Add protocol, store, sanitizer, HTTP, redaction, and negative security tests for identity, disclosure, retention, revocation, expiry, and cross-session failures.
6. Add web descriptor validation and direct exact-revision reads with response-header/content/digest checks; strip bodies/references from persisted state and exclude artifact routes from the service worker.
7. Add deterministic ready/withheld/missing/denied/unsupported fixtures and browser cache tests, then run the Phase 1 regression and the artifact-state CDP fixture in both themes.

## Files to change

- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `packages/pi-rpc-protocol/tests/guards.test.ts`
- `apps/pi-remote-relay/src/store/artifact-store.ts`
- `apps/pi-remote-relay/src/store/artifact-sanitizer.ts`
- `apps/pi-remote-relay/src/store/relay-store.ts`
- `apps/pi-remote-relay/src/store/transcript-projector.ts`
- `apps/pi-remote-relay/src/index.ts`
- `apps/pi-remote-relay/migrations/` — next numbered artifact migration pair
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/tests/artifact-store.test.ts`
- `apps/pi-remote-relay/tests/artifact-sanitizer.test.ts`
- `apps/pi-remote-relay/tests/artifact-http.test.ts`
- `tests/security/negative-controls.test.ts`
- `tests/redaction.test.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/state.ts`
- `apps/pi-remote-web/src/cache.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/demo.ts`
- `apps/pi-remote-web/public/service-worker.js`
- Browser test for network-only artifact requests and Cache Storage exclusion.

## Verification gate

Run all of the following before shipping the phase:

```text
npm run typecheck
npm test
npm run test:web
node scripts/file-preview-cdp.mjs --fixture artifact-states --viewport-width 390 --theme light --output <temporary-directory>/file-preview-light.png
node scripts/file-preview-cdp.mjs --fixture artifact-states --viewport-width 390 --theme dark --output <temporary-directory>/file-preview-dark.png
```

Relay tests must cover exact tuple ownership, immutable digest identity, range consistency, redaction, revocation, expiry, and negative path/secret controls. The CDP runner must assert at least one ready metadata card and one explicit withheld/unsupported state at exactly 390 CSS pixels in both themes. Phase 1 diff, focus/history, and screenshot checks must remain green.

