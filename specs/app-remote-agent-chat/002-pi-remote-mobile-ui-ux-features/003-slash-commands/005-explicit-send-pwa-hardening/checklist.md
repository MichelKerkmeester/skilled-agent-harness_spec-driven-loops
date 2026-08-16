# Checklist — Explicit Send integration and iPhone/PWA hardening

- [ ] Valid slash Send uses exactly one fresh one-use ticket and exactly one revision-checked prompt request; canonical command plus arguments reaches the host once.
- [ ] Host, session, session-revision, or catalog-revision races make zero Pi calls, preserve the draft, clear the unsafe binding, refresh the catalog, and request reselection.
- [ ] Disabled, hidden, malformed, unknown, stale, forbidden, incompatible, and delivery-unknown outcomes fail closed without automatic retry or send-as-text fallback.
- [ ] Running turns never reinterpret slash commands as steer/follow-up, and missing authoritative running-state availability disables slash Send.
- [ ] Foreground, reconnect, and session switches cannot display another session’s rows or retain another session’s binding.
- [ ] Ordinary non-slash Send and Enter behavior remains unchanged.
- [ ] Draft, focus, and bounded progress behavior are preserved through revalidation, stale, denied, offline, reconnect, and foreground transitions.
- [ ] Installed-PWA true-390px light/dark checks pass with no horizontal scroll, keyboard obstruction, focus loss, unsafe zoom, or accessibility-tree regression.
- [ ] The complete CDP matrix covers keyboard-open, loading, filtered, drafted, revalidating, stale, denied, running, 320px/200% text, rotation, and foreground-return states.
- [ ] Physical iPhone checks pass for VoiceOver, Voice Control, Switch Control, Full Keyboard Access, Bluetooth keyboard, IME, zoom, rotation, background/foreground, offline/reconnect, themes, and reduced motion.
- [ ] Catalogs, bindings, tickets, arguments, and prompt content are absent from persistence, URLs, service-worker responses, telemetry, crash reports, and diagnostic logs.
- [ ] Security review signs off on ticket use, expected revisions, redaction, plan-mode enforcement, and telemetry/storage inspection.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run test:web` passes.

