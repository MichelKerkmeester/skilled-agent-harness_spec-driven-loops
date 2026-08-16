# Tasks — Protocol, redaction, and bound runtime authority

- [ ] Extend `AvailableModelDto`, `RuntimeModelCatalogDto`, the model-ticket request, `set_model` control command, and bounded outcome data in `packages/pi-rpc-protocol/src/types.ts`.
- [ ] Add strict exact-key, bounded-string/number, path-free-token, enum, revision, and operation-specific guards; export all public types and guards.
- [ ] Add valid and negative protocol fixtures for unknown keys, invalid reason codes, oversized metadata, fractional/negative revisions, missing catalog revision, and malformed ticket requests.
- [ ] Update `projectAvailableModel` and `projectRuntimeModelCatalog` to emit only the declared bounded allowlist and omit unavailable metadata instead of inferring it.
- [ ] Maintain monotonic catalog revisions, host-confirmed retired current models, streaming/capability state, exact target checks, both revision checks, idempotent control IDs, and terminal delivery-unknown behavior in `RuntimeService`.
- [ ] Add an in-memory runtime-ticket binding with authenticated session/principal, action, exact target, both revisions, expiry, one-use consumption, and no persistence or logging.
- [ ] Authorize only the new runtime-ticket issuance action in policy; do not broaden unrelated mutation permissions.
- [ ] Add and validate `POST /api/runtime/ticket`, require an authenticated foreground device, recheck the fresh catalog, apply short TTL/rate limiting, and consume/compare tickets in `/api/runtime/control`.
- [ ] Cover exact target/revision checks, replay, substitution, foreground loss, stale catalog, policy denial, lifecycle loss, host rejection, transport failure, and zero automatic retries in relay/auth/security tests.
- [ ] Add the web ticket/submit flow and expanded catalog/response validation while preserving the existing non-optimistic committed state.
- [ ] Complete the explicit security posture review before enabling the route outside tests.

