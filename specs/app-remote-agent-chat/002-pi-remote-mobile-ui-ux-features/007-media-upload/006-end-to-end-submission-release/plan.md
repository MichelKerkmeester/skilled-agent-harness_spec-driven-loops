# Plan — End-to-End Submission, Reconciliation, and Release Enablement

## Approach

Connect the already bounded local and relay seams through one explicit client submission state machine. Hash and reserve before binary transfer, run no more than two ticketed uploads at once, freeze the ordered draft during commit, reconcile ambiguous outcomes through authenticated read-only status, and route every cancellation, model/revision change, lifecycle event, and duplicate action through generation tokens and atomic cleanup. Finish with browser, relay, pinned-Pi, storage/log, and real-device evidence before making the default-off flag exception for an approved host.

## Steps

1. Implement worker hashing, bounded reserve/upload/status/cancel/commit client functions, typed DTO guards, progress, concurrency, cancellation, and bounded error mapping.
2. Implement the client submission state machine and wire text-only, photo-only, and caption-plus-photo sends through the existing revision and Steer/Later behavior.
3. Wire relay attachment service, reaper, Pi bridge, route integration, prompt commit, status reconciliation, foreground predicate, auth revocation, and shutdown hooks.
4. Freeze caption/order during commit, suppress duplicate Send, and make stale/model/lifecycle/cancel/ambiguous-ack paths atomic and fail closed.
5. Add relay integration and kill-point tests, web integration tests, and exact 390 px browser/CDP scenarios for success and failure states.
6. Run Safari and installed-PWA real-device checks covering the full Photo Library/camera, HEIC/HEIF, accessibility, orientation, backgrounding, process death, app lock, keyboard, and reconnection matrix.
7. Record pinned-Pi/provider, decoder, disclosure, revision, workspace, service-worker, log, storage, and snapshot evidence; complete all required security reviews.
8. Set `PI_REMOTE_MEDIA_ENABLED=1` only for a host that passes all gates; retain the default-off configuration and document rollback through configuration plus quarantine cleanup.

## Files to change

- `apps/pi-remote-web/src/attachments/attachment-client.ts`
- `apps/pi-remote-web/src/attachments/useAttachmentSubmission.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/SessionComposer.tsx`
- `apps/pi-remote-relay/src/index.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/prompt/prompt-service.ts`
- Attachment service/reaper/Pi bridge/runtime/auth/revision seams from Phases 1–3
- `apps/pi-remote-relay/tests/integration/attachment-flow.test.ts`
- `apps/pi-remote-relay/tests/kill-points/attachment-recovery.test.ts`
- Web integration tests for double Send, model switch, stale revision, cancel races, status reconciliation, and app/session changes
- Browser/CDP scenarios and real-device test evidence

## Verification gate

Run `npm run typecheck`, `npm run test`, and `npm run test:web`, all focused protocol/relay/web/security suites, the pinned-Pi probe, and end-to-end browser tests. Capture CDP screenshots at exactly 390 CSS px in both light and dark themes for principal success and failure states, verify focus/overflow and redaction, and complete the on-device Safari and installed-PWA matrix. Do not claim enablement until the required security reviews and final-state scans pass.

