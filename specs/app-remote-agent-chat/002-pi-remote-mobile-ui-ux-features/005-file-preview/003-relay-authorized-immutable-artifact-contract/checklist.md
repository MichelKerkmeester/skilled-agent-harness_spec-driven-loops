# Checklist — Relay-authorized immutable artifact contract

- [ ] A valid `FilePreviewBlock` passes strict protocol guards and carries only relay-authored identity and safe metadata.
- [ ] Guards reject unknown fields, host paths, invalid digests, invalid bounds, and invalid renderer/redaction/completeness/content combinations.
- [ ] The relay stores only sanitized bytes and metadata, publishes SHA-256 digest/ETag identity, and rejects reuse of one identity with different bytes.
- [ ] Exact authenticated `(session, artifactId, revision)` reads succeed; cross-session, wrong-revision, `latest`, path-bearing, unauthenticated, expired, and revoked requests fail with no body disclosure.
- [ ] Artifact reads are read-only, ticket-free, rate/size bounded, range-consistent, and return private no-store/nosniff/same-origin headers.
- [ ] Missing or unavailable sources become `withheld`, `missing`, or `unsupported`; no client-inferred read or blank/dead card exists.
- [ ] Relay projection requires an explicit allowlisted snapshot and leaves existing diff projection intact when no snapshot is approved.
- [ ] Artifact bodies, references, URLs, and shareable payloads are absent from local storage, persisted transcript state, Cache Storage, and service-worker caches after open/close/reload fixtures.
- [ ] Ready metadata, withheld, missing, denied, and unsupported demo states work without relay contact.
- [ ] Phase 1 diff behavior, focus/history behavior, and locked light/dark styling remain green.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes, including relay, migration, redaction, and negative security coverage.
- [ ] `npm run test:web` passes, including cache/service-worker exclusion.
- [ ] The light artifact-state CDP command passes at exactly 390 CSS pixels and its screenshot is inspected.
- [ ] The dark artifact-state CDP command passes at exactly 390 CSS pixels and its screenshot is inspected.
- [ ] No files outside this phase folder were created or modified by the documentation scaffolding.

