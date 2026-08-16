# Tasks — Phase 3 — Persistent composer control and keyboard affordance

- [ ] Add `apps/pi-remote-web/src/PlanModeButton.tsx` using React Aria `Button`/`MenuTrigger`, and `apps/pi-remote-web/src/PlanModeMenu.tsx` using `Popover` and a single-selection `Menu`; keep the visible button immediately after `+` in the sticky toolbar.
- [ ] Add `apps/pi-remote-web/src/usePlanModeShortcut.ts` for exact composer-scoped `Shift+Tab` and `⌘⇧M` guards; preserve textarea focus, selection, draft, and scroll and never cancel bare `Tab`.
- [ ] Add `apps/pi-remote-web/src/RuntimeModeAnnouncer.tsx` with one permanently mounted polite region and a separate alert region for conflict, permission loss, and delivery uncertainty.
- [ ] Add `apps/pi-remote-web/src/LeavePlanSheet.tsx` for every Plan → Build request with exact `Leave plan mode?` copy and `Stay in plan`/`Switch to Build` actions; require confirmation before host mutation and keep cancellation safe.
- [ ] Update `apps/pi-remote-web/src/SessionComposer.tsx` to remove the existing `ToggleButtonGroup` as the primary mode control, render `PlanModeButton` after `+`, and expose status/disabled copy without changing Send/Steer/Stop semantics.
- [ ] Update `apps/pi-remote-web/src/runtime.ts` to model `confirmedMode`, `transition`, `delivery`, `planPhase`, runtime revision, and single-flight mode requests; keep committed state host-confirmed and clear authority on refresh/reconnect.
- [ ] Update `apps/pi-remote-web/src/relay.ts` with separate `setMode` and read-only reconciliation calls using fresh one-use tickets and strict response guards; never send mode commands through `submitPrompt`.
- [ ] Update `apps/pi-remote-web/src/state.ts`, `src/App.tsx`, and `src/cache.ts` so foreground/resume hydration is mandatory and cached history cannot enable mode controls; wire `CLI-style Shift+Tab in composer` as a preference rather than a second mode state.
- [ ] Update `apps/pi-remote-web/src/style.css` for button/menu focus, 44px targets, dashed Plan outline, pending labels, 320px/200% reflow, safe-area padding, reduced motion, and light/dark tokens; keep clay out of normal text and critical outlines.
- [ ] Add `PlanModeButton.test.tsx`, `PlanModeMenu.test.tsx`, `usePlanModeShortcut.test.tsx`, and extend `runtime.test.tsx`, `App.test.tsx`, and `contrast.test.tsx`.

