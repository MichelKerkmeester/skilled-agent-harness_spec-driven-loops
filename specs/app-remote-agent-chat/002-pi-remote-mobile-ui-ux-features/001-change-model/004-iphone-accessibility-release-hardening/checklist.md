# Checklist — iPhone interaction, accessibility, visual, and release hardening

- [ ] The sheet opens, searches, stages, commits, dismisses, and reconciles without focus loss on a real 390px mobile viewport.
- [ ] Buttons/triggers meet at least 44×44px and rows meet at least 48px; 320px and 200% zoom have no horizontal scroll.
- [ ] Light and dark states use the fixed semantic palette, pass contrast/focus checks, and never use clay as the sole small-text or UI-state signal.
- [ ] Reduced-motion emulation removes transforms, springs, stagger, and spinning indicators while preserving state text.
- [ ] Safe-area, visual-viewport, `viewport-fit=cover`, portrait, landscape, and software-keyboard layouts do not clip the sheet or footer.
- [ ] VoiceOver, Switch Control, Full Keyboard Access, and hardware keyboard users can open, navigate, stage, cancel, and explicitly switch; row activation never commits.
- [ ] Header-only swipe dismisses at the specified threshold; list scrolling remains native; backdrop/close/Escape are inert during commit; iOS edge navigation is not intercepted.
- [ ] Focus containment, initial current-row focus, live status, busy descriptions, accessible naming, and `preventScroll` restoration are present.
- [ ] Message-catalog entries cover labels, state text, mapped reasons, counts, success, and reconcile barrier.
- [ ] No ticket, raw payload/error, provider/model ID, query, catalog data, or sensitive evidence appears in logs, analytics, URLs, storage, IndexedDB, service-worker caches, screenshots, or telemetry.
- [ ] Phase 1/2 ticket/revision/foreground/redaction/plan-mode controls remain unchanged and pass the security regression review.
- [ ] Manual installed-PWA checks pass in portrait and landscape with the software keyboard, VoiceOver, Switch Control, Full Keyboard Access, foreground reconciliation, offline, stale, rejected, and delivery-unknown states.
- [ ] True-390px light/dark CDP evidence covers reachable `ready`, `searching`, `staged`, `streaming_blocked`, and `delivery_unknown` states.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run test:web` passes.
- [ ] `git diff --check` passes and the final no-stray-files sweep finds only intentional changes/evidence.

