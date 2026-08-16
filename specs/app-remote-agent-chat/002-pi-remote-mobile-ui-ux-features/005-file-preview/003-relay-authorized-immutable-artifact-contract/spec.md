<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 2 — Relay-authorized immutable artifact contract

## Summary

This phase adds the strict `FilePreviewBlock` descriptor, stores immutable sanitized snapshots in the relay, and exposes one exact authenticated artifact revision to the web client. Unavailable sources remain useful and explicit through `withheld`, `missing`, `unsupported`, or another metadata state rather than becoming a blank surface or an inferred read.

## Problem & Goal

Complete-file preview requires a relay-owned identity and stored sanitized bytes, but a browser request must never turn a path, filename, diff header, or assistant-authored text into a workspace read. The goal is to make exact-revision file preview possible while preserving the boundary: strict protocol validation, allowlisted publication, immutable digest/ETag identity, authenticated tuple reads, retention/revocation, and no client-side arbitrary path or `latest` request.

## Scope

### In scope

- `FilePreviewBlock` protocol type, union member, exports, and strict guard.
- Relay artifact metadata/bytes store, sanitizer boundary, SHA-256 digest/ETag, retention, expiry, revocation, purge, and exact-tuple read endpoint.
- Relay projection from an explicit allowlisted snapshot source only; existing diff projection remains intact.
- Web descriptor parsing, exact-resource client boundary, safe demo fixtures, cache stripping, and service-worker exclusion.
- Bounded text/code handling in the sanitizer; image/PDF sanitizer capabilities may remain `withheld` until Phase 4.

### Out of scope

- Browser-side arbitrary path reads, `latest` requests, live filesystem browsing, or path-derived identity.
- Binary renderer implementation, image decoding, PDF.js, binary Share, editing, mutation tickets, downloads, public artifact URLs, or host handoff.
- Any relaxation of the read-only-by-default, redaction, or host/extension-enforced Plan mode posture.

## User-facing behavior + states

- A valid relay descriptor appears as safe metadata in the Phase 1 card/viewer; identity is relay-authored and includes exact revision, digest, renderer, redaction, completeness, and content mode.
- The demo can show ready metadata, `withheld`, `missing`, `denied`, and `unsupported` states without contacting a relay. No unavailable source produces a blank or dead card.
- An exact authenticated tuple read can supply a stored snapshot; cross-session, wrong-revision, `latest`, path-bearing, unauthenticated, expired, and revoked requests become explicit redacted failure states with no body disclosure.
- Artifact bodies, URLs, inline payloads, and artifact references are removed from persisted transcript/local-storage data and never enter Cache Storage or the service-worker cache.

## Acceptance criteria

- A valid descriptor is accepted by protocol guards and appears in a transcript without any host path or assistant-authored identity.
- The relay stores only sanitized bytes and metadata, publishes a digest/ETag, and rejects identity reuse with different bytes.
- An exact authenticated artifact read succeeds; a cross-session, wrong-revision, `latest`, path-bearing, unauthenticated, expired, or revoked request fails with a redacted state and no body disclosure.
- A missing or unavailable source always produces `withheld`, `missing`, or `unsupported`, never a client-inferred read or a blank/dead card.
- Artifact bodies and URLs are absent from local storage, Cache Storage, the persisted transcript cache, and the service worker cache after fixture open/close/reload.
- Phase 1 diff behavior, focus/history behavior, and light/dark 390px screenshots remain green.

## Security & Redaction

`artifact-sanitizer.ts` is fail-closed and projects only safe display metadata, bounded sanitized bytes, redaction/completeness, export policy, and optional safe thumbnail reference. `displayName` never contains a host path. Publication accepts only an explicit relay-allowlisted snapshot payload; absent approval emits no guessed artifact and leaves diff behavior unchanged. The read route authenticates `{ sessionId, artifactId, revision }`, rejects `latest` and path input, has no mutation ticket, and returns private no-store, nosniff, same-origin responses. Digest/ETag and immutable identity prevent byte substitution. Cache and service-worker exclusions prevent persistence or URL disclosure.

## Dependencies & affected areas

- Protocol: `packages/pi-rpc-protocol/src/types.ts`, `guards.ts`, `index.ts`, and `packages/pi-rpc-protocol/tests/guards.test.ts`.
- Relay storage/publication: `apps/pi-remote-relay/src/store/artifact-store.ts`, `artifact-sanitizer.ts`, `relay-store.ts`, `transcript-projector.ts`, `apps/pi-remote-relay/src/index.ts`, `apps/pi-remote-relay/migrations/` (next numbered artifact migration pair), `apps/pi-remote-relay/src/auth/policy.ts`, and `apps/pi-remote-relay/src/http/server.ts`.
- Relay/security tests: `apps/pi-remote-relay/tests/artifact-store.test.ts`, `artifact-sanitizer.test.ts`, `artifact-http.test.ts`, `tests/security/negative-controls.test.ts`, and `tests/redaction.test.ts`.
- Web transport/state/cache: `apps/pi-remote-web/src/relay.ts`, `state.ts`, `cache.ts`, `App.tsx`, `demo.ts`, `apps/pi-remote-web/public/service-worker.js`, and the browser cache test.
- Shared viewer: the Phase 1 artifact viewer files remain affected consumers; no Phase 1 security or history contract may regress.

