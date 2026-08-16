# Checklist — End-to-End Submission, Reconciliation, and Release Enablement

- [ ] A user can select, review, explicitly Send, and receive ordered redacted cards for four supported photos with or without a caption.
- [ ] Text-only, photo-only, and caption-plus-photo turns preserve the same prompt revision and Steer/Later semantics; image-only turns use an empty message.
- [ ] The client hashes exact transfer bytes, sends only a bounded reference manifest, uses one-use ticketed uploads, limits concurrency to two, and reports real per-tile progress.
- [ ] No upload body enters browser JSON, the sync socket, persistent storage, cache, analytics, or error payloads.
- [ ] Every state in the feature state table is reached by a tested success, failure, cancellation, stale, expiry, or lifecycle scenario.
- [ ] Duplicate Send is suppressed and caption/order are frozen during `committing`.
- [ ] The batch is atomic: no partial commit, duplicate prompt, path fallback, silent image omission, or automatic resend occurs.
- [ ] Removing during upload, model switching, revision changes, logout, revocation, epoch changes, shutdown, process death, and ambiguous acknowledgement fail closed and preserve only allowed local/text state.
- [ ] Ambiguous acknowledgement becomes `delivery-unknown`; authenticated status reconciliation is read-only and precedes any user-directed resend.
- [ ] On process death, only text is restored and the UI says **“Photos need to be attached again.”**
- [ ] Raw and normalized media are deleted at every required success, failure, cancel, expiry, logout, revocation, epoch, shutdown, crash-recovery, and delivery-ambiguity boundary.
- [ ] No raw-media persistence, cache entry, unsafe log field, workspace change, or unapproved transcript/provider payload is observed.
- [ ] Fixed design system, WCAG AA, light/dark themes, exact 390 px screenshots, 320 px/200% reflow, reduced motion, RTL, safe-area/keyboard behavior, and real iOS lifecycle checks pass.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run test` exits 0.
- [ ] `npm run test:web` exits 0.
- [ ] All focused protocol, relay, web, security, integration, kill-point, pinned-Pi, and end-to-end browser suites exit 0.
- [ ] CDP captures use exactly 390 CSS px in both light and dark themes for principal success and failure states and verify focus/overflow/redaction.
- [ ] Real-device Safari and installed-PWA checks cover Photo Library, rear camera, HEIC/HEIF, cancellation, VoiceOver, Switch Control, RTL, backgrounding, process death, app lock, keyboard variants, and tailnet reconnection.
- [ ] Pinned-Pi persistence/echo, HEIF decoder, provider-retention disclosure, revision, workspace, service-worker, log, and storage evidence is recorded.
- [ ] Phase 2 upload-mutation security review signs off.
- [ ] Phase 3 Pi/provider-boundary security review signs off.
- [ ] Final enablement security review signs off with all required negative-test, cleanup, route/ticket, disclosure, probe, scan, snapshot, CDP, and device evidence.
- [ ] `PI_REMOTE_MEDIA_ENABLED=1` is set only on an approved host that passed every gate; default remains off elsewhere.
- [ ] Rollback is documented and tested as the flag/configuration change plus quarantine cleanup, with no client fallback to paths or silent image omission.

