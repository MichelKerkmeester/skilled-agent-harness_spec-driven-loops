# Checklist — Phase 5 — Accessibility, PWA layout, and release hardening

- [ ] All controls remain visible, labeled, focusable, and unobscured at 320px, 375px, 390px, and 430px in both themes and at 200% text scaling.
- [ ] Mode state is not communicated by color alone; contrast checks reject clay-on-bone normal text and clay-only focus/state boundaries.
- [ ] VoiceOver announces each settled transition once, starts review on `Keep planning`, and does not move focus when a plan becomes ready.
- [ ] Physical keyboard testing passes for bare `Tab` and configured `Shift+Tab`; disabling the setting restores reverse focus navigation.
- [ ] Reduced motion removes positional/continuous animation while textual state changes remain immediate.
- [ ] Background/resume, rotation, reconnect, offline, relay restart, and service-worker cache behavior force or await safe authoritative hydration before mutation controls become available.
- [ ] Release verification finds no stray source-file changes or unredacted artifacts and records a documented capability-gate rollback path.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run test:web` passes.
- [ ] `npm run format:check` passes.
- [ ] True CDP screenshots/checks cover exact `390px` light and dark modes plus `320px`, `375px`, and `430px`, including 200% text and reduced-motion fixtures.
- [ ] Manual Safari and installed-PWA sign-off covers keyboard, VoiceOver, safe area, rotation, resume, and Full Keyboard Access.
- [ ] Disabling the capability/health gate leaves the old read-only UI safe and does not expose Execute.
- [ ] The scoped phase diff contains only intended styling, PWA metadata/cache, test, and release-verification changes.

