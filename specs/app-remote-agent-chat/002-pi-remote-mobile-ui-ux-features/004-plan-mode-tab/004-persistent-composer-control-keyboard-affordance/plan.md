# Plan — Phase 3 — Persistent composer control and keyboard affordance

## Approach

Model host-confirmed authority and delivery state before wiring the controls so every visual state has an explicit source of truth. Replace the `+`-only primary toggle with one React Aria control and shared menu, add guarded composer keyboard shortcuts and safe leave confirmation, then connect hydration/reconciliation, cache rules, styling, and DOM tests without changing Send/Steer/Stop semantics.

## Steps

1. Add `PlanModeButton` and `PlanModeMenu` with exactly two selectable rows, host-confirmed labels, pending/disabled reasons, and placement immediately after `+`.
2. Add `usePlanModeShortcut` with the composer focus, preference, overlay, composition, repeat, modifier, connection, idle, and settled guards; preserve draft selection and scroll and leave bare `Tab` untouched.
3. Mount one polite `RuntimeModeAnnouncer` and a separate alert region, and add `LeavePlanSheet` with safe cancellation and focus restoration.
4. Update `SessionComposer` and `App` wiring to remove the primary `ToggleButtonGroup`, preserve existing composer actions, and expose accessible status/disabled copy.
5. Extend `runtime.ts` and `relay.ts` with independent authority fields, single-flight `setMode`, read-only reconciliation, fresh one-use tickets, strict response guards, and hydration clearing on refresh/reconnect.
6. Update `state.ts` and `cache.ts` so foreground/resume hydration is mandatory and cached history cannot enable mutations; wire the named Shift+Tab preference as a preference only.
7. Add responsive/theme/focus/reduced-motion rules, then run component, runtime, app, contrast, type, web-test, and exact-width CDP verification.

## Files to change

- `apps/pi-remote-web/src/PlanModeButton.tsx`
- `apps/pi-remote-web/src/PlanModeMenu.tsx`
- `apps/pi-remote-web/src/usePlanModeShortcut.ts`
- `apps/pi-remote-web/src/RuntimeModeAnnouncer.tsx`
- `apps/pi-remote-web/src/LeavePlanSheet.tsx`
- `apps/pi-remote-web/src/SessionComposer.tsx`
- `apps/pi-remote-web/src/runtime.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/state.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/cache.ts`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/tests/PlanModeButton.test.tsx`
- `apps/pi-remote-web/tests/PlanModeMenu.test.tsx`
- `apps/pi-remote-web/tests/usePlanModeShortcut.test.tsx`
- `apps/pi-remote-web/tests/runtime.test.tsx`
- `apps/pi-remote-web/tests/App.test.tsx`
- `apps/pi-remote-web/tests/contrast.test.tsx`

## Verification gate

- `npm run typecheck`
- `npm run test:web -- apps/pi-remote-web/tests/PlanModeButton.test.tsx apps/pi-remote-web/tests/PlanModeMenu.test.tsx apps/pi-remote-web/tests/usePlanModeShortcut.test.tsx apps/pi-remote-web/tests/runtime.test.tsx apps/pi-remote-web/tests/App.test.tsx apps/pi-remote-web/tests/contrast.test.tsx`
- Use CDP against the running PWA at exactly `390px` wide in light and dark mode. Capture Build, Plan, pending, unavailable, and offline states with the composer visible and the keyboard-open layout where supported.

