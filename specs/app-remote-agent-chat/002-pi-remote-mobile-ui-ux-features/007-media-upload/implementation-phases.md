# F5 Media Upload — Implementation Phases

The work is split into five phases. Each phase is independently verifiable and can ship with the media capability disabled until its gate passes. Phase 2 introduces the first new upload mutation surface; Phase 3 crosses the host-to-Pi/provider boundary; Phase 5 is the final enablement and security review.

## Shared verification gate for every phase

Each phase must finish with all of the following, even when the phase is backend-only:

- `npm run typecheck` exits 0.
- `npm run test` and `npm run test:web` exit 0, plus the phase-specific focused tests.
- A real CDP-controlled browser runs the web app at exactly 390 CSS px wide and captures the relevant state in both light and dark themes. The screenshot must be taken at the true viewport size, not resized after capture.
- For a relay/protocol-only phase, the screenshot proves the existing composer remains unchanged with media disabled. For a web phase, the screenshot covers the new state and its focus/overflow behavior.
- The phase’s acceptance list passes, and the worktree contains only the intended implementation changes plus generated build output that the repository already permits.

Dependency order is Phase 1 → Phase 2 → Phase 3 → Phase 5. Phase 4 depends on Phase 1’s contracts and can proceed in parallel with Phases 2 and 3; Phase 5 depends on all four earlier phases.

## Phase 1 — Protocol contracts and fail-closed capability gate

### Objective

Define the authoritative media capability, attachment references, redacted transcript block, limits, and exact-key guards before accepting a byte. Keep the product text-only and the media flag off.

### Scope

Protocol DTOs and guards; host runtime capability advertisement; route/action vocabulary; web parsing of the capability; regression coverage for the existing text path. No upload route is enabled and no pixel-bearing data is introduced.

### Concrete tasks

- Update `packages/pi-rpc-protocol/src/types.ts` with:
  - a bounded media policy DTO containing the fixed source/output/count limits;
  - authoritative active-model `imageIn` capability;
  - runtime media capability state;
  - attachment-set manifest, part ticket/status, cancellation, and submission result DTOs;
  - `PromptSubmitCommand.expectedPromptRevision`, optional `attachmentSetId`, and ordered `attachmentIds`;
  - the metadata-only `RedactedAttachmentBlock` transcript kind.
- Update `packages/pi-rpc-protocol/src/guards.ts` with exact-key, bounded guards for every new DTO and for normalized Pi image blocks. The prompt-submit guard must reject pixels, base64, filenames, paths, unknown keys, bad ordinals, invalid digests, and out-of-range limits.
- Export the new types and guards from `packages/pi-rpc-protocol/src/index.ts`.
- Add guard and boundary tests in `packages/pi-rpc-protocol/tests/guards.test.ts`, including unknown-key rejection, attachment-reference-only submission, redacted-block allowlisting, and safe treatment of unknown transcript kinds.
- Extend `apps/pi-remote-relay/src/runtime/runtime-service.ts` and its host/Pi model mapping so the runtime snapshot carries `imageIn` and the host media policy. A text-only model must report false; the client must not infer capability from the model label.
- Add the action vocabulary and default-off gate in `apps/pi-remote-relay/src/auth/policy.ts`, `apps/pi-remote-relay/src/http/server.ts`, and `apps/pi-remote-relay/src/index.ts`. Route lookup must continue to fail closed when `PI_REMOTE_MEDIA_ENABLED` is not `1`.
- Update `apps/pi-remote-web/src/relay.ts` and `apps/pi-remote-web/src/state.ts` to parse the new capability and preserve unknown transcript blocks without assuming they contain media.

### Verification gate

Run the shared typecheck and test commands, the protocol guard suite, and the existing relay/web suites. Use CDP at true 390 px in light and dark with media disabled; assert no photo rows, no attachment rail, and no changed text composer layout.

### Acceptance

- Existing text prompt, steer, follow-up, plan, approval, sync, and cache tests remain green.
- A malformed or pixel-bearing submission is rejected before relay business logic.
- The runtime snapshot is the only source of model capability and host limits.
- With the flag off, no attachment route is registered and no UI photo action exists.
- This phase does not alter the read-only behavior of any existing route.

## Phase 2 — Ticketed binary ingress, quarantine, and cleanup

### Objective

Implement the secure relay attachment lane independently of Pi delivery: reservation, bounded binary upload, normalization, status, cancellation, quotas, and reaping. The host flag remains off by default.

### Scope

Ephemeral attachment ownership and lifecycle, outside-webroot quarantine, streaming HTTP handling, one-use ticket binding, decoder isolation, and negative security tests. The phase must not persist raw or normalized pixels in SQLite or expose a retrievable preview.

### Concrete tasks

- Add `apps/pi-remote-relay/src/attachments/attachment-limits.ts` for the fixed limits and coarse log buckets. Keep these values shared by reservation, streaming, normalization, and tests.
- Add `apps/pi-remote-relay/src/attachments/attachment-types.ts` for opaque IDs, manifests, lifecycle states, tickets, and redacted status results. Keep pixel-bearing buffers out of DTOs.
- Add `apps/pi-remote-relay/src/attachments/attachment-service.ts` for reservation ownership, per-device quotas, submission idempotency, set atomicity, revision/model/policy binding, and status transitions.
- Add `apps/pi-remote-relay/src/attachments/attachment-normalizer.ts` plus the approved resource-limited worker/process adapter. Enforce MIME sniffing, full decode, frame/channel/pixel ceilings, orientation, sRGB conversion, metadata stripping, deterministic JPEG/PNG output, and source deletion.
- Add `apps/pi-remote-relay/src/attachments/attachment-reaper.ts` for TTL, cancellation, logout, device revocation, epoch change, shutdown, startup crash recovery, and delivery-ambiguity cleanup.
- Extend `apps/pi-remote-relay/src/auth/auth-service.ts` so reservation and cancellation tickets are operation-specific and one-use; preserve the existing ticket binding rules.
- Extend `apps/pi-remote-relay/src/auth/policy.ts` and `apps/pi-remote-relay/src/auth/rate-limit.ts` with attachment reserve/upload/status/cancel actions and the 12-per-5-minute, 120-MiB-per-hour device limits.
- Extend `apps/pi-remote-relay/src/http/server.ts` with host-gated handling for:
  - `POST /api/attachment-sets` using a one-use `attachment:reserve` ticket;
  - `PUT /api/attachment-sets/{setId}/parts/{partId}` using the per-part upload ticket;
  - `POST /api/attachment-sets/{setId}/status` as an authenticated read-only reconciliation query;
  - `POST /api/attachment-sets/{setId}/cancel` using a one-use `attachment:cancel` ticket.
- The binary handler must consume the ticket before reading, require exact `Content-Length`, count streamed bytes, stream to extensionless `0600` quarantine, compare the digest, and never pass through the global JSON body reader.
- Wire cleanup to `apps/pi-remote-relay/src/index.ts` and auth revocation/session lifecycle. Do not add a migration for pixels; quarantine is outside the repository and SQLite.
- Add `apps/pi-remote-relay/tests/attachments.test.ts`, `apps/pi-remote-relay/tests/attachment-normalization.test.ts`, and `apps/pi-remote-relay/tests/security/attachment-negative-controls.test.ts` for limits, ticket binding, malformed inputs, race/cancel behavior, cleanup, quotas, logs, and path isolation.

### Verification gate

Run shared typecheck/tests and the focused relay attachment/security suites. Use CDP at true 390 px in light and dark with the host flag off; assert the existing composer is unchanged. Exercise the endpoints with an authenticated foreground socket and with every invalid authority combination.

### Acceptance

- The upload mutation surface is reachable only with the host flag, exact origin, authenticated enrolled device, current session, live foreground socket, and operation-specific one-use ticket.
- Length, digest, MIME, decode, dimension, animation, quota, rate, timeout, and concurrency failures retain no usable bytes.
- Source bytes are deleted after normalized derivative commit; all abandoned derivatives are reaped within the defined TTL or lifecycle event.
- No attachment metadata or body is inserted into SQLite, transcript events, sync frames, service-worker cache, or logs beyond approved coarse buckets.
- Existing JSON/WebSocket limits and read-only routes are unchanged.

### Security review

Required. This is the first phase that adds a new mutation route and transient user-byte storage. Review route gating, ticket semantics, filesystem permissions, decoder isolation, quotas, logging, crash cleanup, and denial behavior before enabling the flag in any environment.

## Phase 3 — Normalized Pi image bridge and redacted transcript

### Objective

Deliver only normalized in-memory images to Pi through the existing image fields, then publish only allowlisted redacted attachment cards. Prove the pinned Pi build does not persist or echo image payloads.

### Scope

Prompt/steer/follow-up integration, revision-checked atomic commit, Pi acknowledgement lifecycle, transcript projection/redaction, idempotency, and the pinned-Pi/provider probe. The web UI may remain flag-gated while this boundary is verified.

### Concrete tasks

- Add `apps/pi-remote-relay/src/attachments/pi-image-bridge.ts` to load normalized JPEG/PNG bytes only after the final ownership, readiness, expiry, model capability, plan-policy, and revision checks. Keep base64 construction local to the host-to-Pi request.
- Extend `apps/pi-remote-relay/src/prompt/prompt-service.ts` to accept attachment references, bind `expectedPromptRevision`, submit ordered `images` for `prompt`, `steer`, and `follow_up`, and maintain submission idempotency. Image-only turns use an empty message.
- Add a prompt revision coordinator under `apps/pi-remote-relay/src/prompt/` or the existing session authority seam. Advance it on accepted user/runtime mutations, not streaming token events; stale sets must be rejected before Pi invocation.
- Add `apps/pi-remote-relay/src/attachments/attachment-transcript-projector.ts` for the fixed redacted card fields. Update `apps/pi-remote-relay/src/store/transcript-projector.ts`, `apps/pi-remote-relay/src/store/redaction.ts`, and `apps/pi-remote-relay/src/store/relay-store.ts` so pixels and arbitrary attachment metadata cannot enter durable envelopes.
- Update `packages/pi-rpc-protocol/src/types.ts`, `guards.ts`, and `index.ts` as needed for the new transcript kind and strict normalized `ImageContent` constraints. Do not expand the browser submission DTO to carry image data.
- Extend `apps/pi-remote-relay/tests/prompt.test.ts`, `transcript-projector.test.ts`, `redaction.test.ts`, and `security/negative-controls.test.ts` for ordered image delivery, image-only captions, stale revisions, model mismatch, plan mode, duplicate submission, confirmed rejection, dropped acknowledgement, export/push redaction, and workspace immutability.
- Add a pinned-Pi integration fixture/probe under `apps/pi-remote-relay/tests/integration/` that submits a real supported image through the configured supervisor and verifies no image payload is written to session JSONL or echoed in stdout events. Keep the host media capability disabled if this probe fails.
- Verify the Pi RPC framing path and the 1 MiB event-record limit before allowing image-bearing prompts. Echo suppression must happen before the framed relay path, not in a downstream transcript projector.

### Verification gate

Run shared typecheck/tests, relay prompt/redaction/security suites, and the pinned-Pi image probe. Use CDP at true 390 px in light and dark with media disabled or with a redacted-card fixture only; assert no raw image is visible in the transcript and no existing text layout regresses.

### Acceptance

- Pi receives ordered normalized image blocks and never a host path or raw source object.
- A stale, mismatched, expired, replayed, text-only-model, or plan-policy-invalid set causes no Pi invocation.
- Positive acknowledgement deletes host bytes and publishes redacted cards; ambiguous acknowledgement is `delivery-unknown` and cannot auto-resend.
- Durable DTOs, sync frames, exports, push text, logs, SQLite, and Pi-visible transcript data contain no pixels, base64, filename, path, hash, URL, EXIF, OCR, provider payload, or decoder error.
- The pinned Pi/provider persistence and echo probe passes, or the media host capability remains disabled.

### Security review

Required. This phase crosses the host-to-Pi and configured-provider boundary. Review image retention, JSONL/session behavior, event echo suppression, model/provider disclosure, prompt injection treatment, plan-mode enforcement, and ambiguous acknowledgement before any end-to-end user test with real images.

## Phase 4 — Local composer draft, preview, and redacted-card UI

### Objective

Ship the complete local iPhone interaction and transcript rendering as a capability-gated vertical slice. Selecting and previewing photos must remain local; the web can be tested against relay fixtures without uploading.

### Scope

Composer menu, native pickers, reducer/ref-backed file storage, object-URL lifecycle, rail, preview dialog, local validation, all UI states, responsive/accessibility styling, service-worker/cache exclusion, and redacted transcript rendering.

### Concrete tasks

- Add `apps/pi-remote-web/src/attachments/attachment-state.ts` for the reducer and explicit state machine; keep actual `File` objects in a ref-backed map outside serializable React state.
- Add `apps/pi-remote-web/src/attachments/AttachmentDraftProvider.tsx` and `useAttachmentDraft` for ordered metadata, local object URLs, selection/cancellation behavior, capability/model blocking, cleanup, session switching, app lock, and unmount handling.
- Add `apps/pi-remote-web/src/attachments/AttachmentRail.tsx`, `AttachmentTile.tsx`, and `AttachmentPreviewDialog.tsx` using React Aria list, modal, dialog, focus restoration, 44×44 hit targets, and keyboard/screen-reader labels.
- Extend `apps/pi-remote-web/src/SessionComposer.tsx` to place the attachment group first in the `+` popover, retain existing Mode/Commands controls, show the disclosure, add the rail above the textarea, implement Return/`⌘ Enter`/IME behavior, and preserve Steer/Later semantics.
- Extend `apps/pi-remote-web/src/App.tsx` and `apps/pi-remote-web/src/state.ts` to provide runtime capability, render `RedactedAttachmentBlock`, show **“Preview not retained”**, preserve unknown blocks, and clear/reconcile the local draft on session/logout/lifecycle changes.
- Extend `apps/pi-remote-web/src/style.css` for bone/carbon/clay tokens, 72 px rail, 64 px tiles, preview canvas, safe-area padding, VisualViewport keyboard geometry, 320 px/200% reflow, RTL logical properties, reduced motion, and light/dark contrast.
- Update `apps/pi-remote-web/public/service-worker.js` to bypass all attachment paths and `apps/pi-remote-web/src/cache.ts` to reject attachment-bearing data. No raw media may be placed in the offline snapshot.
- Extend `apps/pi-remote-web/src/relay.ts` only with typed capability/status fixtures in this phase; keep the real submit path behind the later integration phase.
- Add `apps/pi-remote-web/tests/AttachmentDraft.test.tsx`, `AttachmentRail.test.tsx`, `AttachmentPreviewDialog.test.tsx`, and `SessionComposer.test.tsx` for local-only selection, limits, focus, keyboard, state messages, URL cleanup, Strict Mode, model switching, and no-request-before-Send behavior. Extend `App.test.tsx` and cache/service-worker tests for redacted cards and media exclusion.

### Verification gate

Run shared typecheck/tests and the focused web suite. Use CDP at exactly 390 px in both light and dark for menu-open, local-ready with four tiles, preview, model-blocked, and narrow/reflow states. Verify actual DOM focus and horizontal overflow, not just the screenshot.

### Acceptance

- Gallery selection appends ordered local tiles and camera capture adds one tile without network traffic.
- The rail, preview dialog, all local states, focus restoration, keyboard semantics, reduced motion, RTL, and 320 px/200% layout meet the feature spec.
- Original filenames and raw media never appear in the DOM, browser storage, cache, analytics, or error strings.
- Redacted transcript cards render generically and old/unknown kinds remain safe.
- With the host capability off, the entire photo group and rail disappear without leaving a disabled/decorative action.

## Phase 5 — End-to-end submission, reconciliation, and release enablement

### Objective

Connect the local UI to the secure relay lane, complete the explicit Send lifecycle, prove failure/recovery behavior on real iOS hardware, and enable the media capability only after all security gates pass.

### Scope

Client hashing and reserve/upload/commit orchestration, XHR progress/cancellation, status reconciliation, relay wiring, runtime revision/model changes, end-to-end tests, CDP visual sign-off, and security/release review.

### Concrete tasks

- Add `apps/pi-remote-web/src/attachments/attachment-client.ts` for SHA-256 worker hashing, reserve manifest, ticketed XHR PUTs, exact progress, two-upload concurrency, cancellation, status reconciliation, and bounded error mapping. Never put the body in `fetch` JSON, the sync socket, or persistent storage.
- Add `apps/pi-remote-web/src/attachments/useAttachmentSubmission.ts` for the state machine from `waiting-for-connection` through `sent`, generation-token cancellation, atomic batch behavior, stale revision review, expiry, retryable failure, and delivery-unknown handling.
- Extend `apps/pi-remote-web/src/relay.ts` with typed reserve/upload/status/cancel/commit functions, accepted status codes, strict DTO guards, and no automatic retry after an ambiguous mutation.
- Wire `apps/pi-remote-web/src/App.tsx` and `SessionComposer.tsx` to submit text-only, photo-only, and caption-plus-photo turns through the same prompt revision and Steer/Later behavior. Freeze caption and order during `committing`; suppress duplicate Send.
- Wire `apps/pi-remote-relay/src/index.ts` to instantiate the attachment service, reaper, and Pi bridge; pass the active runtime capability, prompt revision, foreground socket predicate, auth revocation, and shutdown hooks through the existing server seams.
- Complete `apps/pi-remote-relay/src/http/server.ts` route integration and `apps/pi-remote-relay/src/prompt/prompt-service.ts` commit integration, including read-only status reconciliation after dropped responses.
- Add end-to-end coverage in `apps/pi-remote-relay/tests/integration/attachment-flow.test.ts`, `apps/pi-remote-relay/tests/kill-points/attachment-recovery.test.ts`, and web integration tests for double Send, model switch, stale revision, cancel races, status reconciliation, and app/session changes.
- Add browser/CDP scenarios for exact 390 px light/dark menu, four-tile rail, uploading progress, stale/retry states, preview, redacted transcript, keyboard-open safe area, and no page-level horizontal scroll.
- Run real-device Safari and installed-PWA checks: Photo Library, rear camera, HEIC/HEIF, cancellation, VoiceOver, Switch Control, RTL, backgrounding, process death, app lock, keyboard variants, and tailnet reconnection.
- Record the release evidence for the pinned Pi persistence/echo probe, production HEIF decoder support, provider-retention disclosure, Steer/Later acknowledgement, prompt-revision semantics, workspace snapshot identity, service-worker inspection, and log/storage scans.
- Set `PI_REMOTE_MEDIA_ENABLED=1` only for a host that has passed all gates. The default remains off, and rollback is the flag/configuration change plus quarantine cleanup; no client-side fallback to paths or silent image omission is permitted.

### Verification gate

Run the shared typecheck/test commands, all focused protocol/relay/web/security suites, the pinned-Pi probe, and the end-to-end browser tests. Capture true 390 CSS px CDP screenshots in light and dark for the principal success and failure states. Complete the on-device test matrix on Safari and installed-PWA modes.

### Acceptance

- A user can select, review, explicitly Send, and receive ordered redacted cards for four supported photos with or without a caption.
- Every state in the state table is reachable through a tested success, failure, cancellation, stale, expiry, or lifecycle scenario.
- No partial commit, duplicate prompt, automatic resend, path fallback, raw-media persistence, cache entry, unsafe log field, or workspace change occurs.
- Removing during upload, model switching, revision changes, logout, revocation, epoch changes, shutdown, process death, and ambiguous acknowledgement all fail closed and preserve only the allowed local/text state.
- The fixed design system, WCAG AA behavior, light/dark themes, exact 390 px screenshots, 320 px/200% reflow, reduced motion, RTL, and real iOS lifecycle checks pass.
- Security review signs off Phase 2’s upload mutation, Phase 3’s Pi/provider boundary, and this final enablement before the host flag is turned on.

### Security review

Required and blocking. This phase turns the controlled exception on for real users. The reviewer must have the negative-test output, quarantine cleanup evidence, route/ticket audit, provider disclosure, pinned-Pi probe, log/storage scans, workspace snapshot comparison, service-worker inspection, CDP screenshots, and real-device results before approving enablement.
