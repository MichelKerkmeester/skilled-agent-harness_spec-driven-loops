# Tasks — iPhone interaction, accessibility, visual, and release hardening

- [ ] Update `ModelSwitcherSheet.tsx` for RAC focus containment, current-row initial focus, `preventScroll` restoration, `aria-controls`, live status, busy descriptions, Escape ordering, modal dismissal rules, header-only swipe threshold, and list-scroll separation.
- [ ] Update `SessionHeader.tsx` for the final trigger accessible name, expanded state, optional plan-mode badge, separate effort sibling semantics, and focus restoration target.
- [ ] Update `style.css` for fixed bone/carbon/clay tokens, AA accent usage, two-pixel focus ring/offset, 24px sheet radius, 36×4px grabber, 92% visual-viewport cap, safe-area padding, contained overscroll, logical properties, wrapped labels, isolated LTR IDs, reduced-motion rules, and 320/390/430px reflow.
- [ ] Add `viewport-fit=cover` in `index.html`, verify RAC visual-viewport sizing, and avoid a second body scroll lock.
- [ ] Add/update message-catalog support for every sheet label, state, reason-code mapping, count announcement, success announcement, and reconcile barrier.
- [ ] Extend `ModelSwitcherSheet.test.tsx`, `App.test.tsx`, and `contrast.test.tsx` for focus, keyboard, live regions, 200% zoom, reduced motion, no horizontal scroll, token/contrast, and no-storage/no-logging assertions.
- [ ] Run the installed-PWA manual pass in portrait and landscape with the software keyboard, VoiceOver, Switch Control, Full Keyboard Access, foreground/background, offline, stale, rejected, delivery-unknown, header-only swipe, and native list-scroll scenarios; record redacted evidence only.
- [ ] Rerun relay/protocol security and negative-control suites, confirm service-worker caches contain no model/ticket data, and perform the final diff/no-stray-file sweep.

