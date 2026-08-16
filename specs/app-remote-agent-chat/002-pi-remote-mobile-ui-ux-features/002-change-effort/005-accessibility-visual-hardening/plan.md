# Plan — Accessibility, visual hardening, and device proof

## Approach

Treat the finished sheet, runtime state machine, and evidence surfaces as one release candidate. First verify semantic labeling, focus, announcements, and redaction in component tests; then verify contrast and responsive behavior across the required viewport/theme/motion combinations. Use the project CDP harness with a true 390px viewport for every listed state, and finish with the real standalone-iPhone pass, recording only redacted evidence and reviewing Plan-mode isolation.

## Steps

1. Verify sheet/radio labeling, description associations, focus order, Escape restoration, pending focus behavior, one document-level status region, and exclusion of host strings/raw IDs from accessible names.
2. Verify text and non-text contrast in bone/carbon themes and confirm clay is never the sole selected/focus/pending signal.
3. Verify 320px, 390px, 430px, landscape, 200% zoom, large text, RTL, reduced motion, keyboard-open viewport, safe-area padding, browser text inflation, and fixed typography/tokens.
4. Add contrast and DOM fixtures for selected, focused, pending, disabled, issue, light, dark, empty, off-only, inconsistent, and every failure state.
5. Run the CDP harness at a true 390px viewport in both themes for closed, model-open, effort-open, pending, streaming, offline, stale, and delivery-unknown; assert no overflow, clipping, hidden focus, or raw canaries.
6. Run the manual standalone-PWA pass on a real enrolled iPhone for touch, press-cancel, Escape/Close where available, VoiceOver, ownership, reconnect, streaming lock, delivery-unknown reconcile, themes, RTL, reduced motion, and keyboard/text inflation.
7. Record redacted evidence and run the final security review for authority, ticket leakage, replay, optimistic commit, Plan-mode isolation, and redaction.

## Files to change

- `apps/pi-remote-web/src/ModelEffortSheet.tsx`
- `apps/pi-remote-web/src/EffortRadioGroup.tsx`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/tests/contrast.test.tsx`
- Sheet/radio tests under `apps/pi-remote-web/tests/`
- The project’s web CDP verification harness/fixture setup used for this feature
- Redacted verification evidence in the project’s established test-evidence location only

## Verification gate

- `npm run typecheck` exits 0.
- `npm test`, `npm run test:web`, and the contrast/accessibility suites exit 0.
- The CDP gate passes at a true 390px viewport in both light and dark themes for all listed states, with no horizontal overflow.
- Manual on-device verification passes on a real iPhone running the standalone PWA, including VoiceOver and the recovery paths.
