# Checklist — Ticketed Binary Ingress, Quarantine, and Cleanup

- [ ] Reserve, upload, and cancel mutations require the host flag, exact origin, an enrolled authenticated device, current session, live foreground socket, and the correct one-use operation ticket.
- [ ] Tickets are consumed before the binary body is read and cannot be replayed or used for another operation, session, device, set, part, revision, or digest.
- [ ] The binary route requires exact `Content-Length`, counts streamed bytes, compares declared and streamed length, verifies the digest, and bypasses the global JSON reader.
- [ ] Source and normalized bytes never enter SQLite, transcript events, sync frames, service-worker cache, public/webroot paths, or unapproved logs.
- [ ] Length, digest, MIME, decode, dimension, animation, quota, rate, timeout, and concurrency failures leave no usable bytes.
- [ ] Normalization enforces the source/output limits, full decode, frame/channel/pixel ceilings, orientation, 8-bit sRGB, metadata stripping, and deterministic JPEG/PNG output.
- [ ] Source bytes are deleted after normalized derivative commit.
- [ ] Abandoned source and derivative objects are reaped for TTL expiry, cancellation, logout, device revocation, epoch changes, shutdown, startup crash recovery, and delivery ambiguity.
- [ ] Per-device limits are 12 attachments per five minutes and 120 MiB per hour, with approved coarse logging only.
- [ ] Existing JSON/WebSocket limits and read-only routes are unchanged.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run test` exits 0.
- [ ] `npm run test:web` exits 0.
- [ ] Focused relay attachment, normalization, and security suites exit 0.
- [ ] A real CDP run uses exactly 390 CSS px in light and dark themes with the host flag off.
- [ ] The CDP evidence shows the existing composer unchanged.
- [ ] Every invalid authority combination is exercised against the endpoints with an authenticated foreground socket.
- [ ] Required security review signs off the upload mutation and cleanup boundary before enablement.

