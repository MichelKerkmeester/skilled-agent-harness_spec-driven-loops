# Checklist — Phase 3 — Persistent composer control and keyboard affordance

- [ ] The mode button is one tab stop after `+`, visible without opening the tools popover, and has a consequence-bearing accessible name.
- [ ] Menu focus movement causes no mutation; only activation does; Plan entry remains host-confirmed and Build exit opens the leave sheet before mutation.
- [ ] Bare `Tab` and outside-composer `Shift+Tab` retain browser focus behavior; all composition, repeat, modifier, pending, connection, and running-turn guards produce zero mode requests.
- [ ] Ten rapid activations produce at most one in-flight request; stale and delivery-unknown outcomes disable controls and reconcile without retry.
- [ ] Build, Plan · read-only, Mode unavailable, Checking mode, offline, forbidden, unsupported, and extension-error presentations are readable in both themes and never flash unconfirmed authority; Executing plan is reserved for confirmed host state.
- [ ] Every Build exit from Plan opens `LeavePlanSheet`; no host mutation occurs before `Switch to Build`, and `Stay in plan` preserves confirmed Plan.
- [ ] A settled mode transition announces once and does not move focus.
- [ ] Cached history cannot enable mode controls, and refresh/reconnect/foreground resume await authoritative hydration.
- [ ] `npm run typecheck` passes.
- [ ] The focused `npm run test:web -- ...` command passes for all listed Plan mode, runtime, app, and contrast tests.
- [ ] The running PWA is checked at exactly `390px` in light and dark mode with true CDP screenshots for Build, Plan, pending, unavailable, offline, and keyboard-open states where supported.
- [ ] The scoped phase diff contains only the intended web control, runtime, styling, cache, and test changes.

