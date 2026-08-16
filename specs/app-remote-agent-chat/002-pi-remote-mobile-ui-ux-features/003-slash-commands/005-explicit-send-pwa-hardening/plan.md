# Plan — Explicit Send integration and iPhone/PWA hardening

## Approach

Treat a slash draft as an untrusted, revision-bound local value until the explicit Send action performs live resolution and ticketed relay submission. Wire the orchestration through `App` and `SessionComposer` without changing ordinary non-slash behavior, then complete lifecycle invalidation and installed-PWA/mobile hardening. Validate exact request counts and zero-Pi-call failure paths in tests before running the full CDP and physical-iPhone release matrix.

## Steps

1. Implement `submitSlashDraft.ts` to require the current binding, resolve the canonical token, gate on live host/session/running authority, request one ticket, submit expected revisions, and map all fail-closed outcomes without retry.
2. Add guarded slash-submit request/response parsing in `relay.ts` and expose ticket and prompt calls so valid Send request counts are testable.
3. Pass host epoch, session revision, catalog revision, and effective running/plan availability through `App.tsx` and `SessionComposer.tsx`; show bounded revalidation progress and preserve drafted messages.
4. Update `commands.ts` and `state.ts` for refreshing, stale-offline, forbidden, incompatible, identity-change binding clears, and foreground revalidation after 30 seconds.
5. Finish installed-PWA styling, `100dvh`, `viewport-fit=cover`, safe-area, rotation, keyboard-language, visual-viewport, high-contrast, reduced-motion, and focus-retention behavior.
6. Add web and relay integration/security tests for exact ticket/request counts, stale races, denied rows, running state, plan enforcement, delivery-unknown outcomes, and draft preservation.
7. Execute the complete true-390px light/dark CDP matrix and record the physical-iPhone installed-PWA checklist across accessibility, keyboard, IME, lifecycle, and motion cases.
8. Obtain final security sign-off for ticket use, expected revisions, redaction, plan-mode enforcement, and telemetry/storage inspection.

## Files to change

- `apps/pi-remote-web/src/submitSlashDraft.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/SessionComposer.tsx`
- `apps/pi-remote-web/src/commands.ts`
- `apps/pi-remote-web/src/state.ts`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/src/useVisualViewportAnchor.ts`
- `apps/pi-remote-web/index.html`
- `apps/pi-remote-web/tests/submitSlashDraft.test.ts`
- `apps/pi-remote-web/tests/App.test.tsx`
- `apps/pi-remote-web/tests/SessionComposer.test.tsx`
- Relevant `apps/pi-remote-relay` integration tests
- `apps/pi-remote-relay/tests/security/negative-controls.test.ts`
- Physical-iPhone installed-PWA release checklist evidence

## Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- Run the complete CDP matrix at a true 390 CSS-pixel viewport in light and dark, including keyboard-open, loading, filtered, drafted, revalidating, stale, denied, running, 320px/200% text, rotation, and foreground-return states.
- Complete the physical-iPhone installed-PWA checklist and record pass/fail evidence for every accessibility and keyboard behavior; desktop emulation alone is insufficient.

