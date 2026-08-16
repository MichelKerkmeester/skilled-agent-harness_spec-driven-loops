# Tasks — Explicit Send integration and iPhone/PWA hardening

- [ ] Implement `apps/pi-remote-web/src/submitSlashDraft.ts` to resolve the leading token, require the current binding, gate on live host/session state, request one ticket, submit expected revisions, and map stale/denied/incompatible/delivery-unknown outcomes without clearing the draft or retrying.
- [ ] Update `apps/pi-remote-web/src/relay.ts` with explicit slash-submit request/response parsing and test-observable ticket and prompt request counts.
- [ ] Update `apps/pi-remote-web/src/App.tsx` to pass host epoch/session/catalog revisions and effective running/plan availability, revalidate on session/connection transitions, and apply optimistic transcript behavior only after accepted explicit submission.
- [ ] Update `apps/pi-remote-web/src/SessionComposer.tsx` to show bounded revalidation progress, preserve the draft, distinguish local Insert from Send, disable slash Send without running-state authority, and keep ordinary non-slash Send unchanged.
- [ ] Update `apps/pi-remote-web/src/commands.ts` and `apps/pi-remote-web/src/state.ts` for refreshing, stale-offline, forbidden/incompatible transitions, identity-change binding clears, and foreground refresh after 30 seconds.
- [ ] Finish installed-PWA `100dvh`, `viewport-fit=cover`, safe-area, rotation, keyboard-language, visual-viewport, high-contrast, reduced-motion, and focus-retention behavior in `apps/pi-remote-web/src/style.css`, `apps/pi-remote-web/src/useVisualViewportAnchor.ts`, and `apps/pi-remote-web/index.html`.
- [ ] Add/update `apps/pi-remote-web/tests/submitSlashDraft.test.ts`, `App.test.tsx`, `SessionComposer.test.tsx`, relay integration tests, and `apps/pi-remote-relay/tests/security/negative-controls.test.ts` for exact ticket/request counts, stale races, denied rows, running state, plan enforcement, delivery-unknown outcomes, and draft preservation.
- [ ] Add and execute the physical-iPhone release checklist for VoiceOver, Voice Control, Switch Control, Full Keyboard Access, Bluetooth keyboard, IME, zoom, rotation, background/foreground, offline/reconnect, light/dark, and reduced motion.
- [ ] Obtain final security sign-off for ticket use, expected revisions, redaction, plan-mode enforcement, and telemetry/storage inspection.

