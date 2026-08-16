# Plan — iPhone interaction, accessibility, visual, and release hardening

## Approach

Harden the completed functional sheet at its interaction boundaries first: focus, dismissal, keyboard, scrolling, and swipe behavior. Then apply the fixed visual tokens, safe-area/visual-viewport sizing, logical and responsive layout, message catalog, and reduced-motion rules. Verify with automated DOM/CSS/CDP checks, installed-PWA manual input-mode/device checks, and a final security/cache/diff sweep without changing authority semantics.

## Steps

1. Complete RAC focus containment, current-row initial focus, `preventScroll` restoration, live status, busy descriptions, Escape ordering, dismissal rules, header-only swipe, and list-scroll separation.
2. Finalize trigger naming/expanded state, plan-mode badge semantics, effort sibling semantics, and focus restoration target.
3. Apply fixed semantic tokens, AA focus ring, sheet geometry, safe-area and visual-viewport sizing, scroll containment, logical properties, isolated IDs, wrapped labels, reflow, and reduced-motion rules.
4. Add `viewport-fit=cover` and verify visual-viewport sizing without a second body scroll lock.
5. Add/update the message-catalog entries for all sheet labels, states, reason mappings, counts, success announcement, and reconcile barrier.
6. Extend web tests for focus, keyboard, live regions, zoom, reduced motion, no horizontal scroll, contrast/tokens, storage, logging, and telemetry boundaries.
7. Run the installed-PWA manual pass in portrait/landscape with the software keyboard, VoiceOver, Switch Control, Full Keyboard Access, foreground/background, offline, stale, rejected, delivery-unknown, swipe, and native-scroll scenarios; record redacted evidence only.
8. Rerun relay/protocol security and negative-control suites, inspect service-worker caches, and perform final diff/no-stray-file and sensitive-evidence sweeps.
9. Run the full verification gate and retain only intentional release evidence.

## Files to change

- `apps/pi-remote-web/src/ModelSwitcherSheet.tsx`
- `apps/pi-remote-web/src/SessionHeader.tsx`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/index.html`
- The existing web message-catalog source used by the sheet.
- `apps/pi-remote-web/tests/ModelSwitcherSheet.test.tsx`
- `apps/pi-remote-web/tests/App.test.tsx`
- `apps/pi-remote-web/tests/contrast.test.tsx`
- Existing relay/protocol security and negative-control test fixtures only where needed for regression coverage.

## Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- True-390px light/dark CDP screenshots using `Emulation.setDeviceMetricsOverride({ width: 390, deviceScaleFactor: 1, mobile: true })` and `Page.captureScreenshot`, covering reachable `ready`, `searching`, `staged`, `streaming_blocked`, and `delivery_unknown` states.
- CDP checks at 320px and 200% zoom prove `scrollWidth <= clientWidth`; reduced-motion emulation proves transforms/spinners are removed; computed styles prove target and focus-ring sizes.
- Manual installed-PWA portrait/landscape/software-keyboard, VoiceOver, Switch Control, Full Keyboard Access, header-only swipe, native list scroll, foreground reconciliation, and edge-navigation checks pass.
- `git diff --check`, repository type/tests, relay/protocol security suites, and a no-stray-files sweep pass with no captured ticket, raw payload, or sensitive screenshot.

