# Plan — Phase 5 — Accessibility, PWA layout, and release hardening

## Approach

Run hardening against the complete feature matrix rather than a single happy path: first close layout, contrast, direction, safe-area, and reduced-motion gaps; then verify DOM semantics and exact-width browser states; finally perform manual Safari/standalone-PWA checks and release rollback drills. Treat every lifecycle transition as a rehydration boundary and inspect final artifacts for redaction and capability-gate safety.

## Steps

1. Finish responsive, focus, direction, text-scale, theme, and reduced-motion styling for the required widths and existing design tokens.
2. Update viewport/safe-area metadata and service-worker behavior so cached history cannot expose enabled controls or stale plan tokens.
3. Extend axe/DOM and component coverage for accessible names/roles, focus order, inert sheets, target size, announcements, and contrast; add an exact-width/theme/text-scale CDP fixture if needed.
4. Exercise the full state matrix in light and dark themes, including hydration, authority errors, plan lifecycle, execution, invalidation, and offline/reconnect states.
5. Perform manual Safari and installed-standalone PWA checks for keyboard, Full Keyboard Access, VoiceOver, rotation, background/resume, reconnect, safe area, Back, reduced motion, and 200% text.
6. Run release verification and rollback drills behind the capability/health gate, confirm disabling the capability is safe, then inspect for stray source changes and unredacted artifacts.

## Files to change

- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/index.html`
- `apps/pi-remote-web/public/manifest.webmanifest`
- `apps/pi-remote-web/public/service-worker.js`
- `apps/pi-remote-web/tests/contrast.test.tsx`
- `apps/pi-remote-web/tests/App.test.tsx`
- existing component tests under `apps/pi-remote-web/tests/`
- focused CDP fixture/script under `apps/pi-remote-web/tests/` if the existing harness cannot set exact width/theme/text-scale states
- release verification and rollback evidence associated with the feature capability gate

## Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- `npm run format:check`
- CDP screenshots at exact `390px` width in light and dark mode, plus exact `320px`, `375px`, and `430px` width layout checks; include 200% text and reduced-motion fixtures.
- Manual on-device sign-off in Safari and installed PWA mode for the keyboard, VoiceOver, safe-area, rotation, resume, and Full Keyboard Access cases.

