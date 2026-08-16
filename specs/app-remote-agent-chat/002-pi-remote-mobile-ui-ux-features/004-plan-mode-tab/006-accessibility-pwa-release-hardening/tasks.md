# Tasks — Phase 5 — Accessibility, PWA layout, and release hardening

- [ ] Finish `apps/pi-remote-web/src/style.css` for exact focus contrast, logical properties, 320px/375px/390px/430px layouts, 200% text, `dir="auto"`, isolated LTR revision/shortcut rendering, and reduced-motion behavior.
- [ ] Update `apps/pi-remote-web/index.html` and `public/manifest.webmanifest` for `viewport-fit=cover` and safe-area behavior; update `public/service-worker.js` only to ensure cached history cannot expose enabled controls or stale plan tokens.
- [ ] Extend `apps/pi-remote-web/tests/contrast.test.tsx`, `tests/App.test.tsx`, and component tests with axe/DOM assertions for names, roles, focus order, inert sheets, target size, announcement duplication, and clay contrast; add a focused CDP fixture/script under `apps/pi-remote-web/tests/` if the existing harness cannot set exact width/theme/text-scale states.
- [ ] Exercise the full acceptance matrix in both themes: hydration, Build, Plan, Plan ready, review, execute pending, executing, stale, delivery unknown, offline, forbidden, unsupported, extension error, and superseded plan.
- [ ] Perform manual Safari and installed-standalone PWA checks with software keyboard, hardware keyboard/Full Keyboard Access, VoiceOver, rotation, background/resume, reconnect, safe-area insets, browser Back, reduced motion, and 200% text scaling.
- [ ] Run existing release verification and rollback drills after the feature is enabled behind its host capability/health gate; confirm disabling the capability leaves the old read-only UI safe and does not expose Execute.

