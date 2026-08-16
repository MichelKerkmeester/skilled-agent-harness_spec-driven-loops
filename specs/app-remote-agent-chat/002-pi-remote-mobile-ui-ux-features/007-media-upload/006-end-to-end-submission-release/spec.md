<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# End-to-End Submission, Reconciliation, and Release Enablement

## Summary

This phase connects the local draft UI to the secure relay lane, completes the explicit Send lifecycle, proves failure and recovery behavior on real iOS hardware, and enables media only after all security and persistence gates pass. It is the final vertical slice for ordered photo turns, redacted cards, reconciliation, and controlled release.

## Problem & Goal

The local draft and secure relay/Pi boundaries are independently implemented, but the product still needs hashing, ticketed reserve/upload/commit orchestration, cancellation and progress, revision/model reconciliation, real-device lifecycle coverage, and release evidence. The goal is to make explicit Send the sole attachment mutation, fail closed across every stale, failure, cancellation, lifecycle, and ambiguous-acknowledgement path, and turn on the host capability only after the required reviews pass.

## Scope

### In scope

- Worker SHA-256 hashing, bounded reserve manifest, one-use ticketed XHR PUTs, exact progress, two-upload concurrency, cancellation, status reconciliation, and bounded error mapping.
- Client and relay submission state machines, atomic commit, prompt revision/model changes, Steer/Later behavior, duplicate-send suppression, retryable/stale/expired/unknown outcomes, and lifecycle cancellation.
- Relay service/reaper/Pi-bridge instantiation and route/prompt commit integration through existing auth, foreground, revision, shutdown, and revocation seams.
- End-to-end relay/web/kill-point/browser tests, exact 390 px CDP evidence, real Safari and installed-PWA tests, storage/log/service-worker/workspace scans, and security/release sign-off.
- Enabling `PI_REMOTE_MEDIA_ENABLED=1` only on a host that has passed every gate, with rollback by configuration change plus quarantine cleanup.

### Out of scope

- Any client-side path fallback, silent image omission, automatic resend after an ambiguous mutation, public/object storage, persistent raw media, or broad changes to unrelated composer behavior.
- Altering the fixed ink-on-parchment design system, Inter + Source Serif 4 typography, WCAG AA target, light/dark themes, or host/extension-enforced plan-mode security posture.
- Enabling the flag without the required Phase 2 upload review, Phase 3 Pi/provider review, pinned-Pi probe, negative tests, scans, CDP evidence, and real-device matrix.

## User-facing behavior + states

- A user selects up to four supported photos, reviews the ordered local draft, optionally adds a caption, and explicitly presses Send. Text-only, photo-only, and caption-plus-photo turns use the same prompt revision and Steer/Later behavior; image-only sends an empty text message.
- During submission, the relevant states are `waiting-for-connection`, `authorizing`, `uploading`, `server-checking`, `committing`, and `sent`; upload progress is determinate per tile with at most two active uploads and no optimistic progress before a real request failure.
- Failure and lifecycle states include `failed-retryable`, `failed-stale`, `failed-expired`, `canceled`, and `delivery-unknown`. A batch is atomic, duplicate Send is suppressed, removal/model changes/logout/revocation/epoch changes/shutdown/process death fail closed, and ambiguous acknowledgement is reconciled before any user-directed resend.
- On success, ordered generic redacted cards appear with no preview; on app process death only text is restored and the UI says **“Photos need to be attached again.”** Raw media is never persisted for background upload.

## Acceptance criteria

- A user can select, review, explicitly Send, and receive ordered redacted cards for four supported photos with or without a caption.
- Every state in the state table is reachable through a tested success, failure, cancellation, stale, expiry, or lifecycle scenario.
- No partial commit, duplicate prompt, automatic resend, path fallback, raw-media persistence, cache entry, unsafe log field, or workspace change occurs.
- Removing during upload, model switching, revision changes, logout, revocation, epoch changes, shutdown, process death, and ambiguous acknowledgement all fail closed and preserve only the allowed local/text state.
- The fixed design system, WCAG AA behavior, light/dark themes, exact 390 px screenshots, 320 px/200% reflow, reduced motion, RTL, and real iOS lifecycle checks pass.
- Security review signs off Phase 2’s upload mutation, Phase 3’s Pi/provider boundary, and this final enablement before the host flag is turned on.

## Security & Redaction

The browser hashes exact transfer bytes in a worker, sends only a bounded reference manifest, uploads through operation-specific one-use tickets with XHR, and never places bodies in JSON, the sync socket, or persistent storage. Atomic commit freezes caption/order, rechecks runtime capability, model, prompt revision, ownership, readiness, expiry, plan policy, and foreground authority, and suppresses duplicate Send. No automatic resend follows an ambiguous mutation; status reconciliation is read-only. Raw and normalized bytes are cleaned on all failure and lifecycle paths, and durable outputs remain the fixed redacted card. The flag is enabled only after all negative controls, retention/echo probes, scans, reviews, and real-device checks pass; rollback is the flag/configuration change plus quarantine cleanup. The fixed read-only-by-default and host/extension-enforced plan-mode posture remains unchanged.

## Dependencies & affected areas

- `apps/pi-remote-web/src/attachments/attachment-client.ts`
- `apps/pi-remote-web/src/attachments/useAttachmentSubmission.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/SessionComposer.tsx`
- `apps/pi-remote-relay/src/index.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- `apps/pi-remote-relay/src/prompt/prompt-service.ts`
- Attachment service, reaper, Pi bridge, auth, runtime, and revision seams from Phases 1–3
- `apps/pi-remote-relay/tests/integration/attachment-flow.test.ts`
- `apps/pi-remote-relay/tests/kill-points/attachment-recovery.test.ts`
- Web integration tests for send/reconciliation/lifecycle races
- Browser/CDP and real-device Safari/installed-PWA test matrix

