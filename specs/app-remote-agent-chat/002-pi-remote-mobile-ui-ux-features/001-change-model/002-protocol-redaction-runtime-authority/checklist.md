# Checklist — Protocol, redaction, and bound runtime authority

- [ ] Positive and negative protocol guard tests pass for expanded model/catalog/control/ticket payloads.
- [ ] Unknown keys, invalid reason codes, oversized metadata, fractional or negative revisions, missing `expectedCatalogRevision`, malformed ticket requests, and non-path-free IDs are rejected.
- [ ] `/api/runtime/models` is authenticated, read-only, bounded, and free of raw host fields and raw error strings.
- [ ] Ticket issuance rejects unknown targets and binds the authenticated principal/session, operation, exact target, runtime revision, catalog revision, and expiry.
- [ ] Ticket consumption rejects another session/device, altered target, altered revision, replay, expiry, and duplicate control use.
- [ ] Foreground, policy, rate-limit, host-liveness, target-availability, and both revision checks remain enforced.
- [ ] The existing picker switches only through the bound path and never changes the header optimistically.
- [ ] Stale, rejected, and delivery-unknown outcomes settle once and trigger zero automatic retries.
- [ ] Existing auth, policy, foreground, redaction, plan-mode, and rate-limit suites remain green.
- [ ] The explicit security review is recorded as passed for binding, authorization, consume ordering, redaction, and negative controls.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run test:web` passes.
- [ ] True-390px CDP screenshots of the unchanged visible model control pass in light and dark.
- [ ] Source/status sweep confirms no generated artifact or out-of-scope application change is included in the phase patch.

