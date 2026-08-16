# Checklist — Authoritative rich-block contract and redacted projection

- [ ] Shell-capable blocks expose stable `callId`, shell genre, authoritative lifecycle/checkpoint, completeness, block identity, and monotonic revision.
- [ ] Legacy blocks remain valid, safe, and non-rich inputs for old clients and cached data.
- [ ] Concurrent, out-of-order, duplicate, lower-revision, result-before-call, and terminal-without-result fixtures retain enough identity without adjacency matching.
- [ ] `isTranscriptBlock` and all new guards reject malformed rich fields and unknown rich variants before rendering.
- [ ] Redaction markers, not fixture sentinels, are the only sensitive values present in persistence, page responses, sync messages, cache fixtures, logs, and errors.
- [ ] Existing transcript and `/api/sync` paths remain read-only with no new mutation ticket, host-file operation, endpoint, or filesystem lookup.
- [ ] The legacy Activity/prose renderers remain the visible path before Phase 2.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run test:web` passes.
- [ ] `npm run build` passes.
- [ ] The legacy-Activity CDP light capture reports exactly 390 CSS pixels, has zero page horizontal overflow, and shows unchanged transcript/composer geometry with no clipped controls.
- [ ] The legacy-Activity CDP dark capture reports exactly 390 CSS pixels, has zero page horizontal overflow, and shows unchanged transcript/composer geometry, theme contrast, and no clipped controls.
- [ ] Security/privacy review approves rich-field propagation, redaction ordering, identity propagation, terminal/truncation semantics, fixture hygiene, and negative controls before enablement.
