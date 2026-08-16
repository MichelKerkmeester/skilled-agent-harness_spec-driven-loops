# Tasks — Ticketed Binary Ingress, Quarantine, and Cleanup

- [ ] Add `apps/pi-remote-relay/src/attachments/attachment-limits.ts` with the fixed limits and coarse log buckets shared by reservation, streaming, normalization, and tests.
- [ ] Add `apps/pi-remote-relay/src/attachments/attachment-types.ts` for opaque IDs, manifests, lifecycle states, tickets, and redacted status results; keep pixel-bearing buffers out of DTOs.
- [ ] Add `apps/pi-remote-relay/src/attachments/attachment-service.ts` for reservation ownership, per-device quotas, submission idempotency, set atomicity, revision/model/policy binding, and status transitions.
- [ ] Add `apps/pi-remote-relay/src/attachments/attachment-normalizer.ts` and the approved resource-limited worker/process adapter; enforce MIME sniffing, full decode, frame/channel/pixel ceilings, orientation, sRGB conversion, metadata stripping, deterministic JPEG/PNG output, and source deletion.
- [ ] Add `apps/pi-remote-relay/src/attachments/attachment-reaper.ts` for TTL, cancellation, logout, device revocation, epoch change, shutdown, startup crash recovery, and delivery-ambiguity cleanup.
- [ ] Extend `apps/pi-remote-relay/src/auth/auth-service.ts` so reservation and cancellation tickets are operation-specific and one-use while preserving existing ticket bindings.
- [ ] Extend `apps/pi-remote-relay/src/auth/policy.ts` and `apps/pi-remote-relay/src/auth/rate-limit.ts` with attachment reserve/upload/status/cancel actions and the 12-per-5-minute, 120-MiB-per-hour device limits.
- [ ] Extend `apps/pi-remote-relay/src/http/server.ts` with host-gated reserve, binary part upload, authenticated status, and ticketed cancellation routes at the specified paths.
- [ ] Ensure the binary handler consumes the ticket before reading, requires exact `Content-Length`, counts streamed bytes, streams to extensionless `0600` quarantine, compares the digest, and bypasses the global JSON body reader.
- [ ] Wire cleanup to `apps/pi-remote-relay/src/index.ts` and auth revocation/session lifecycle without adding a pixel migration to SQLite.
- [ ] Add attachment, normalization, and security negative-control tests for limits, ticket binding, malformed inputs, race/cancel behavior, cleanup, quotas, logs, and path isolation.
- [ ] Complete the required security review of route gating, ticket semantics, filesystem permissions, decoder isolation, quotas, logging, crash cleanup, and denial behavior before enabling the flag.

