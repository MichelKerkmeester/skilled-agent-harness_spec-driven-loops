<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 3 — Persistent composer control and keyboard affordance

## Summary

This phase ships the complete non-execution Build/Plan interaction slice: a persistent host-confirmed composer status, a safe two-option menu, composer-scoped `Shift+Tab`, `⌘⇧M`, announcements, and authority/error handling. It makes Plan discoverable and operable on touch and hardware-keyboard sessions without adding an optimistic mode state.

## Problem & Goal

Build/Plan is currently hidden in the `+` popover, has no composer-adjacent authority presentation, and has no safe hardware-keyboard path. The goal is to expose the current host-confirmed state beside the composer, make Plan entry quick, make Plan exit deliberate, and preserve ordinary browser focus behavior everywhere else.

## Scope

### In scope

- Web runtime state for confirmed mode, transition, delivery, plan phase, runtime revision, and single-flight mode requests.
- Persistent `PlanModeButton` immediately after `+`, a React Aria two-option Build/Plan menu, status copy, pending states, and a basic `LeavePlanSheet`.
- Composer-scoped `Shift+Tab`, the `CLI-style Shift+Tab in composer` preference, `⌘⇧M`, focus preservation, and the exact keyboard guards.
- Polite and alert announcements for settled transitions, conflicts, permission loss, and delivery uncertainty.
- Read-only hydration/reconciliation, fresh one-use-ticketed `setMode` calls, cache safety, and foreground/resume behavior.
- Responsive toolbar styling, 44px targets, Plan outline, 320px/200% reflow, safe-area padding, reduced motion, and light/dark tokens within the existing design system.
- DOM-level component, runtime, app, and contrast tests.

### Out of scope

- Structured Plan artifact generation or host capability enforcement; those are Phase 2 responsibilities.
- Plan-ready card, full review sheet, atomic `execute_plan`, execution lease, and post-run restoration; those are Phase 4.
- Final on-device accessibility, installed-PWA, exact multi-width release sign-off, service-worker hardening, and rollback drills; those are Phase 5.
- Any optimistic mode toggle, queued offline mutation, prompt-channel mode command, or change to the fixed ink-on-parchment design system.

## User-facing behavior + states

- The sticky composer toolbar has one visible `PlanModeButton` tab stop immediately after `+`. It presents host-confirmed `Build`, `Plan · read-only`, `Mode unavailable`, or `Checking mode…`/pending copy and never flashes an unconfirmed Build state.
- Opening the React Aria menu moves focus only; it does not mutate authority. The menu has exactly `Build` and `Plan` rows, and only activation sends the separate host-confirmed mode request.
- From settled Build, Plan entry is immediate but remains pending until the host response and matching status/revision arrive. From Plan, every Build request opens `LeavePlanSheet` with `Leave plan mode?`, `Stay in plan`, and `Switch to Build`; cancellation leaves confirmed Plan unchanged.
- `Shift+Tab` is intercepted only while the composer textarea is focused, the preference is enabled, no overlay is open, composition/repeat/default-prevented/modifier guards pass, and the runtime is connected, ready, idle, and settled. Bare `Tab` and outside-composer `Shift+Tab` retain browser focus navigation.
- `⌘⇧M` opens the mode menu without changing mode. Escape dismisses the topmost menu/sheet and restores focus to its invoker. A transition announces once without moving focus; stale, offline, forbidden, unsupported, extension-error, and delivery-unknown states disable unsafe mutations and offer only reconciliation/recovery.
- Cached history can render as history but cannot enable mode controls. `Executing plan` remains reserved for a confirmed host state and is not authored as a client-side shortcut in this phase.

## Acceptance criteria

- The mode button is one tab stop after `+`, visible without opening the tools popover, and has the required consequence-bearing accessible name.
- Menu focus movement causes no mutation; only activation does. Plan entry is immediate but host-confirmed; Build exit opens the leave sheet in the next phase’s placeholder/disabled-safe path.
- Bare Tab and outside-composer Shift+Tab retain browser focus behavior. All specified composition, repeat, modifier, pending, connection, and running-turn guards produce zero mode requests.
- Ten rapid activations produce at most one in-flight request; stale and delivery-unknown outcomes disable controls and reconcile without retry.
- Build, Plan · read-only, Mode unavailable, Checking mode, offline, forbidden, unsupported, and extension-error presentations are readable in both themes and do not flash an unconfirmed state; Executing plan remains reserved for the confirmed host state.
- Build exit from Plan always opens `LeavePlanSheet`; no host mutation occurs before `Switch to Build`, and `Stay in plan` preserves the confirmed state.
- A mode transition announces once and does not move focus.

## Security & Redaction

The client treats `confirmedMode` as host authority and keeps transition intent, delivery uncertainty, and connection state independent. Mode mutations use separate fresh one-use tickets and strict response guards, are single-flight, and are disabled while hydrating, offline, forbidden, unsupported, unhealthy, delivery-unknown, or running. The client never sends mode controls through `submitPrompt`, never retries an uncertain mutation, and never enables controls from cached history. The existing redacted relay DTOs remain the only data rendered or announced; no ticket, token, principal, host identifier, or raw host field is exposed.

## Dependencies & affected areas

| Area | Files/components | Phase responsibility |
| --- | --- | --- |
| Web controls | `apps/pi-remote-web/src/PlanModeButton.tsx`, `PlanModeMenu.tsx`, `LeavePlanSheet.tsx`, `RuntimeModeAnnouncer.tsx` | Persistent status, exact two-row menu, safe Build exit confirmation, focus behavior, and announcements. |
| Composer/app | `apps/pi-remote-web/src/SessionComposer.tsx`, `src/App.tsx`, `src/state.ts` | Place the control after `+`, wire mode/status state, foreground hydration, and unchanged Send/Steer/Stop semantics. |
| Web runtime/client | `apps/pi-remote-web/src/runtime.ts`, `src/relay.ts`, `src/cache.ts`, `src/usePlanModeShortcut.ts` | Model authority and transitions, perform separate mode/reconciliation calls, protect cache, and implement keyboard guards. |
| Web styling | `apps/pi-remote-web/src/style.css` | Add responsive toolbar, focus, target-size, pending, safe-area, reduced-motion, and theme rules without changing the design system. |
| Verification | `apps/pi-remote-web/tests/PlanModeButton.test.tsx`, `PlanModeMenu.test.tsx`, `usePlanModeShortcut.test.tsx`, `runtime.test.tsx`, `App.test.tsx`, `contrast.test.tsx` | Prove DOM behavior, focus/keyboard guards, single-flight/reconciliation, state presentation, and contrast. |

