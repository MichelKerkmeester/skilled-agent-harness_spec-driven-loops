# Tasks — Relay-authorized immutable artifact contract

- [ ] Change `packages/pi-rpc-protocol/src/types.ts`, `guards.ts`, and `index.ts` to add and export `FilePreviewBlock`; preserve the string artifact revision exactly and do not overload existing numeric revisions.
- [ ] Extend `packages/pi-rpc-protocol/tests/guards.test.ts` with valid descriptor, inline-text, artifact-ref, none, unknown-field, path-bearing, digest, bounds, renderer, redaction, and completeness cases.
- [ ] Add `apps/pi-remote-relay/src/store/artifact-store.ts` for immutable `(session, artifactId, revision)` rows, sanitized bytes, SHA-256 digest/ETag, byte length, range reads, retention, expiry, and purge using the existing SQLite transaction boundary.
- [ ] Add `apps/pi-remote-relay/src/store/artifact-sanitizer.ts` for allowlisted metadata, safe display name, MIME/renderer, redaction/completeness, export policy, optional safe thumbnail reference, bounded text/code, and fail-closed withholding for unsupported binary sanitization.
- [ ] Add the next numbered artifact migration pair under `apps/pi-remote-relay/migrations/` and update `relay-store.ts` to initialize, retain, read, and purge artifacts without exposing raw source data through transcript pages.
- [ ] Change `transcript-projector.ts` and `apps/pi-remote-relay/src/index.ts` to accept only explicit relay-allowlisted snapshots; emit no guessed artifact when approval is absent and preserve existing diff projection.
- [ ] Change `apps/pi-remote-relay/src/auth/policy.ts` and `apps/pi-remote-relay/src/http/server.ts` to add `artifact:read`, authenticate the exact tuple, reject `latest` and paths, enforce rate/size limits, support consistent PDF ranges, and return no-store/nosniff/same-origin headers without a ticket or mutation route.
- [ ] Add `artifact-store.test.ts`, `artifact-sanitizer.test.ts`, `artifact-http.test.ts`, negative controls, and redaction regressions for ownership, identity reuse, range consistency, expiry, revocation, disclosure, and path/secret rejection.
- [ ] Change `apps/pi-remote-web/src/relay.ts` to validate descriptors and provide a direct exact-revision artifact read that checks status, headers, content type, revision, ETag, byte budget, and digest without the JSON helper.
- [ ] Change `state.ts`, `cache.ts`, `App.tsx`, and `demo.ts` so descriptor cards use the Phase 1 viewer, persisted data strips inline bodies/artifact references, and fixtures cover ready metadata, withheld, missing, denied, and unsupported without relay contact.
- [ ] Change `apps/pi-remote-web/public/service-worker.js` and add a browser test proving artifact requests are network-only and never enter Cache Storage.

