# Tasks — Accessibility, visual hardening, and device proof

- [ ] Verify `aria-labelledby`, description associations, focus order, Escape restoration, read-only pending focus, one document-level status region, and no competing alert/live region.
- [ ] Ensure host strings, issue codes, and raw IDs cannot become accessible names or announcements.
- [ ] Verify 4.5:1 text contrast and 3:1 non-text contrast in bone/carbon themes.
- [ ] Verify raw clay is never the sole selected, focus, or pending signal.
- [ ] Verify 320px, 390px, 430px, landscape, 200% zoom, large text, RTL, reduced motion, keyboard-open viewport, and `env(safe-area-inset-bottom)` behavior.
- [ ] Keep browser text inflation enabled.
- [ ] Remove transforms/pulses under reduced motion while retaining fixed font and color tokens.
- [ ] Add contrast and DOM assertions for selected, focused, pending, disabled, issue, light, and dark combinations.
- [ ] Add fixtures for 320px/390px/430px, seven two-line rows, empty/off-only/inconsistent catalogs, and every failure state.
- [ ] Capture true viewport-width 390px light/dark screenshots for closed, model-open, effort-open, pending, streaming, offline, stale, and delivery-unknown states.
- [ ] Assert no horizontal scroll, clipped row, hidden focus indicator, or raw issue/ID canary in the DOM or accessibility tree.
- [ ] Run the manual standalone PWA pass on a real enrolled iPhone.
- [ ] Verify touch selection, press-cancel, Escape/Close where available, VoiceOver once-only announcements, foreground ownership, reconnect, streaming lock, delivery-unknown reconcile, light/dark, RTL, reduced motion, and keyboard/text inflation.
- [ ] Confirm Plan mode remains host/extension enforced and effort cannot approve tools or enable Build.
- [ ] Record only redacted test evidence.
- [ ] Keep tickets, cookies, enrollment payloads, paths, secrets, raw host responses, and prompt text out of screenshots, logs, and notes.
