# F4 — Implementation phases

The work is split into five additive phases. Each phase can be released behind the existing capability/health gates and verified on its own: the protocol and host additions are backward-compatible until the web control consumes them, the mode UX can ship before Execute is enabled, and Execute remains unavailable unless the full reviewed-plan contract is present. There is no phase that relies on a local optimistic shortcut.

Every phase has the same verification gate: repository typecheck, the phase tests, and a real CDP run at an exact 390px viewport in both light and dark themes. The screenshot must use the running web app, not a static mock or a resized desktop capture; it must cover the phase's changed surface and include the relevant pending/error state where applicable.

## Phase 1 — Protocol and relay authority contract

### Objective

Create the typed, redacted, revision-checked contract for host-confirmed mode and reviewed-plan control without exposing a new client-side authority shortcut.

### Scope

Protocol DTOs and guards, relay read/hydration, authenticated mode-control ingress, plan-artifact projection, idempotency, single-flight behavior, stale responses, and delivery-unknown reconciliation. Keep the existing model/thinking controls working while the new plan-specific operation types are introduced.

### Concrete tasks

- Update `packages/pi-rpc-protocol/src/types.ts` and `src/index.ts` with bounded `PlanArtifactDto`, plan snapshot/event payloads, plan validity values, and distinct `set_mode` and `execute_plan` command/outcome types. Keep the host-issued `planToken` opaque and never model it as derived text.
- Update `packages/pi-rpc-protocol/src/guards.ts` and `packages/pi-rpc-protocol/tests/guards.test.ts` to enforce exact keys, bounded strings/arrays, non-negative revisions, opaque IDs, valid `postRunMode`, and rejection of missing, replay-shaped, or host-only values.
- Extend `apps/pi-remote-relay/src/runtime/runtime-service.ts` with independent runtime and plan revisions, authoritative mode hydration, a single mutation lane, control-ID idempotency, and terminal delivery-unknown outcomes. Do not dispatch a host command after a stale or invalid guard result.
- Extend `apps/pi-remote-relay/src/runtime/plan-status.ts` to parse only the pinned host mode/status contract and to map unknown or unhealthy status to `unknown`, never to Build.
- Update `apps/pi-remote-relay/src/http/server.ts` and the associated auth policy/rate limiter to authenticate the two plan operations, require a live foreground device, consume a one-use ticket, and return safe distinctions for stale, unsupported, unavailable, and delivery-unknown outcomes. Keep `/api/runtime/state` read-only and return a plan snapshot only through an allowlisted projector.
- Update `apps/pi-remote-relay/src/store/redaction.ts`, `src/replay/sync.ts`, and `src/store/relay-store.ts` so plan artifacts are redacted before persistence/replay/broadcast and status/control events cannot enter transcript projections. Add a migration only if the current store schema needs plan-artifact metadata; do not persist raw tokens.
- Add/extend `apps/pi-remote-relay/tests/runtime-control.test.ts`, `tests/plan-status.test.ts`, `tests/redaction.test.ts`, and a focused plan-control integration test for two clients, ticket replay, stale revisions, and transport failure.

### Verification gate

- `npm run typecheck`
- `npm test -- packages/pi-rpc-protocol/tests apps/pi-remote-relay/tests`
- Run the web smoke route with the current client and capture a true `390px` CDP screenshot in light and dark mode to prove the contract changes did not regress the live shell. Capture one hydration/unavailable state if the harness can inject it.

### Acceptance

- Protocol guards reject extra keys, invalid IDs/tokens, mismatched revisions, and `execute_plan` without `postRunMode: "plan"`.
- Two clients using one runtime revision produce exactly one accepted mutation and one stale outcome.
- Ten repeated control submissions with one control ID cause one host mutation and one replayed response.
- Ticket expiry, consumption, replay, wrong session, non-foreground principal, and unavailable host cause no host mutation.
- A lost response produces delivery-unknown and does not trigger an automatic second request.
- Serialized plan DTOs and sync envelopes contain no raw token, secret, principal, host identifier, absolute path, or unredacted plan field.

## Phase 2 — Host enforcement and structured plan lifecycle

### Objective

Make Plan authority real at the host boundary and publish a structured lifecycle that the relay can trust: Plan, ready-for-review, executing, superseded, and restored Plan.

### Scope

The `pi-remote-plan` extension, host capability classification, plan artifact generation/invalidation, execution lease hooks, relay event ingestion, and prompt/catalog privilege-boundary cleanup.

### Concrete tasks

- Refactor `extensions/pi-remote-plan/src/index.ts` so Plan is default-deny: built-in edit/write, mutating shell forms, unknown extension tools, and unknown MCP tools are blocked unless explicitly classified read-only. Preserve the existing read-only bash allowlist as a narrow allowlist, not as proof that other tools are safe.
- Add a host-side plan-artifact adapter beside `extensions/pi-remote-plan/src/index.ts` (for example `extensions/pi-remote-plan/src/plan-artifact.ts`) that emits a versioned artifact with stable ID, revision, opaque token, redacted projection fields, validity, and optional approaches. The adapter must not derive the token from plan text.
- Implement lifecycle publication in the extension/host bridge: publish Build or Plan on hydration and every transition; publish `plan.ready` only from the structured artifact; publish `plan.superseded` on feedback, invalidation, branch/repository change, another-client change, or host restart according to the host's authoritative invalidation policy; publish `executing-plan` only after atomic handoff succeeds.
- Add the bounded execution lease in `extensions/pi-remote-plan/src/index.ts` or its adapter. Restore Plan restrictions after success, cancellation, and failure. If restoration or handoff fails, publish the safety error and keep Plan restrictions active.
- Update `apps/pi-remote-relay/src/runtime/plan-status.ts` and `src/runtime/runtime-service.ts` to consume the structured mode/artifact events, increment the correct revision, and return `unknown` when the extension is unhealthy or the event is malformed.
- Update `apps/pi-remote-relay/src/prompt/prompt-service.ts` to reject a leading `/plan` token after leading whitespace normalization before any Pi prompt is sent. Update `apps/pi-remote-relay/src/commands/command-service.ts` to remove the extension's Plan control command from the phone catalog while retaining any safe non-control commands.
- Add negative coverage to `extensions/pi-remote-plan/tests/plan-mode.test.ts`, `apps/pi-remote-relay/tests/prompt.test.ts`, `tests/commands.test.ts`, `tests/authority-loop.test.ts`, and the plan-control/redaction tests. Assert that internal control events are not transcript blocks or model-visible prompts.

### Verification gate

- `npm run typecheck`
- `npm test -- extensions/pi-remote-plan/tests apps/pi-remote-relay/tests packages/pi-rpc-protocol/tests`
- Run the web shell against a fixture host that emits Build, Plan, plan-ready, executing-plan, superseded, and extension-error events; capture true `390px` CDP screenshots in light and dark mode for Plan and extension-error states.

### Acceptance

- Host tool-call tests prove that every unclassified mutation-capable tool is denied in Plan, including extension/MCP tools and shell control-token variants.
- A structured plan event produces a bounded artifact; assistant prose alone never produces `Plan ready`.
- Plan feedback invalidates the old artifact and makes its Execute action unavailable before any new artifact is accepted.
- Execution restoration failure leaves Plan restrictions active and publishes `Plan safety could not be verified` without sensitive details.
- `/plan`, `/plan on`, `/plan off`, and `/plan execute` never reach the host through phone prompt submission and never appear in the phone command catalog.

### Required security review

This phase crosses the read-only capability boundary. The host/relay security owner must review the default-deny tool classifier, shell allowlist, artifact/token lifecycle, invalidation rules, and restoration failure path before Phase 4 can expose Execute.

## Phase 3 — Persistent composer control and keyboard affordance

### Objective

Ship the complete Build/Plan interaction slice: persistent status, safe menu behavior, composer-scoped `Shift+Tab`, `⌘⇧M`, and all non-execution authority/error states.

### Scope

Web runtime state, relay client calls, composer integration, React Aria menu/announcer, keyboard guards, focus preservation, the basic leave confirmation, responsive toolbar presentation, and DOM-level interaction tests.

### Concrete tasks

- Add `apps/pi-remote-web/src/PlanModeButton.tsx` using React Aria `Button`/`MenuTrigger`, and `apps/pi-remote-web/src/PlanModeMenu.tsx` using `Popover` and a single-selection `Menu`. Keep the visible button immediately after `+` in the sticky toolbar.
- Add `apps/pi-remote-web/src/usePlanModeShortcut.ts` for the exact composer-scoped `Shift+Tab` and `⌘⇧M` guards. Preserve textarea focus, selection, draft, and scroll; never cancel bare `Tab`.
- Add `apps/pi-remote-web/src/RuntimeModeAnnouncer.tsx` with one permanently mounted polite region and a separate alert region for conflict, permission loss, and delivery uncertainty.
- Add `apps/pi-remote-web/src/LeavePlanSheet.tsx` for every Plan → Build request, including the exact `Leave plan mode?` copy and `Stay in plan`/`Switch to Build` actions. Confirmation is required before the host mutation and cancellation is safe.
- Update `apps/pi-remote-web/src/SessionComposer.tsx` to remove the existing `ToggleButtonGroup` as the primary mode control, render `PlanModeButton` after `+`, and expose the status/disabled copy without changing the existing Send/Steer/Stop semantics.
- Update `apps/pi-remote-web/src/runtime.ts` to model `confirmedMode`, `transition`, `delivery`, `planPhase`, runtime revision, and single-flight mode requests. Keep committed state host-confirmed only; clear authority on refresh/reconnect.
- Update `apps/pi-remote-web/src/relay.ts` with separate `setMode` and read-only reconciliation calls using fresh one-use tickets and strict protocol response guards. Do not send mode commands through `submitPrompt`.
- Update `apps/pi-remote-web/src/state.ts`, `src/App.tsx`, and `src/cache.ts` so foreground/resume hydration is mandatory and cached history cannot enable mode controls. Wire the user preference `CLI-style Shift+Tab in composer` without making it a second mode state.
- Update `apps/pi-remote-web/src/style.css` for button/menu focus, 44px targets, dashed Plan outline, pending labels, 320px/200% reflow, safe-area padding, reduced motion, and light/dark tokens. Keep clay out of normal text and critical outlines.
- Add `apps/pi-remote-web/tests/PlanModeButton.test.tsx`, `tests/PlanModeMenu.test.tsx`, `tests/usePlanModeShortcut.test.tsx`, and extend `tests/runtime.test.tsx`, `tests/App.test.tsx`, and `tests/contrast.test.tsx`.

### Verification gate

- `npm run typecheck`
- `npm run test:web -- apps/pi-remote-web/tests/PlanModeButton.test.tsx apps/pi-remote-web/tests/PlanModeMenu.test.tsx apps/pi-remote-web/tests/usePlanModeShortcut.test.tsx apps/pi-remote-web/tests/runtime.test.tsx apps/pi-remote-web/tests/App.test.tsx apps/pi-remote-web/tests/contrast.test.tsx`
- Use CDP against the running PWA at exactly `390px` wide in light and dark mode. Capture Build, Plan, pending, unavailable, and offline states with the composer visible and the keyboard-open layout where supported.

### Acceptance

- The mode button is one tab stop after `+`, visible without opening the tools popover, and has the required consequence-bearing accessible name.
- Menu focus movement causes no mutation; only activation does. Plan entry is immediate but host-confirmed; Build exit opens the leave sheet in the next phase's placeholder/disabled-safe path.
- Bare Tab and outside-composer Shift+Tab retain browser focus behavior. All specified composition, repeat, modifier, pending, connection, and running-turn guards produce zero mode requests.
- Ten rapid activations produce at most one in-flight request; stale and delivery-unknown outcomes disable controls and reconcile without retry.
- Build, Plan · read-only, Mode unavailable, Checking mode, offline, forbidden, unsupported, and extension-error presentations are readable in both themes and do not flash an unconfirmed state; Executing plan remains reserved for the confirmed host state.
- Build exit from Plan always opens `LeavePlanSheet`; no host mutation occurs before `Switch to Build`, and `Stay in plan` preserves the confirmed state.
- A mode transition announces once and does not move focus.

## Phase 4 — Plan-ready card, review sheet, and atomic execution

### Objective

Complete the Plan → review → bounded execution journey without creating a prompt-channel privilege bypass.

### Scope

Plan artifact hydration and live events in the web client, `PlanReadyCard`, `PlanReviewSheet`, `LeavePlanSheet`, execute control, host handoff, post-run restriction restoration, and end-to-end security tests.

### Concrete tasks

- Add `apps/pi-remote-web/src/PlanReadyCard.tsx` that renders only the newest valid structured artifact and exposes `Review plan`; disable or remove Execute for superseded, cached, stale, or unconfirmed artifacts.
- Add `apps/pi-remote-web/src/PlanReviewSheet.tsx` as a full-height React Aria modal with redacted complete content, initial focus on `Keep planning`, inert background, focus restoration, safe Escape/backdrop/browser-Back cancellation, and explicit `Execute reviewed plan`.
- Extend `apps/pi-remote-web/src/LeavePlanSheet.tsx` for the Plan-ready `Leave without running` path and ensure the retained artifact is non-executable after the confirmed exit.
- Extend `apps/pi-remote-web/src/runtime.ts`, `src/state.ts`, and `src/App.tsx` with plan artifact lifecycle, plan feedback invalidation, review-sheet state, execute-pending state, and `Executing plan`/post-run transitions. Keep the token in memory only.
- Extend `apps/pi-remote-web/src/relay.ts` with `executePlan`, obtaining a fresh one-use ticket immediately before dispatch and validating the structured response. It must not call `submitPrompt` or `setMode(build)` as a fallback.
- Complete `apps/pi-remote-relay/src/runtime/runtime-service.ts` and `src/http/server.ts` validation for `execute_plan`: ticket, foreground principal, session, runtime revision, plan ID/revision/token, current Plan mode, valid artifact, idle turn, and exact `postRunMode` must pass atomically before host handoff.
- Complete `extensions/pi-remote-plan/src/index.ts`/plan-artifact adapter execution hooks so `executing-plan` is published only after handoff and Plan restrictions are restored after every terminal outcome.
- Add `apps/pi-remote-web/tests/PlanReadyCard.test.tsx`, `tests/PlanReviewSheet.test.tsx`, `tests/LeavePlanSheet.test.tsx`, relay integration coverage, extension handoff coverage, and end-to-end negative controls for stale/replayed/mismatched plan bindings.

### Verification gate

- `npm run typecheck`
- `npm test -- packages/pi-rpc-protocol/tests apps/pi-remote-relay/tests extensions/pi-remote-plan/tests`
- `npm run test:web -- apps/pi-remote-web/tests/PlanReadyCard.test.tsx apps/pi-remote-web/tests/PlanReviewSheet.test.tsx apps/pi-remote-web/tests/LeavePlanSheet.test.tsx apps/pi-remote-web/tests/runtime.test.tsx`
- Run the full web/relay fixture through plan-ready, review, execute-pending, executing-plan, failure, and restored-Plan states; capture true `390px` CDP screenshots in light and dark mode for card, review sheet, and executing state.

### Acceptance

- Only a live, newest, valid structured artifact can enable Review and Execute; cached or superseded artifacts are history-only.
- Review opens with safe focus and four explicit actions; every dismissal path cancels without changing mode or executing.
- `execute_plan` is exactly one atomic operation bound to the reviewed plan and current runtime revision. Invalid, stale, replayed, expired, non-Plan, non-idle, or non-foreground requests invoke no host tools.
- Host publishes `Executing plan` only after successful handoff, never calls it read-only, and returns to Plan restrictions after success, cancellation, or failure.
- Plan feedback disables the old Execute action immediately, and a retained artifact after leaving Plan cannot execute.
- No ticket, token, raw plan, raw tool arguments, path, principal, hostname, or internal control event appears in the transcript, URL, cache, notification, error, or diagnostic output.

### Required security review

This phase is the second explicit security-posture crossing. Security review must approve the atomic validator, execution lease, host restoration on partial failure, plan invalidation policy, and redaction boundary before the Execute button is enabled for real sessions.

## Phase 5 — Accessibility, PWA layout, and release hardening

### Objective

Prove the complete feature is usable and safe on the target iPhone PWA, at narrow widths, with assistive technology, reduced motion, theme changes, and hardware keyboards.

### Scope

Visual and responsive hardening, service-worker/cache safety, CDP regression coverage, accessibility checks, manual device verification, and release rollback evidence.

### Concrete tasks

- Finish `apps/pi-remote-web/src/style.css` for exact focus contrast, logical properties, 320px/375px/390px/430px layouts, 200% text, `dir="auto"`, isolated LTR revision/shortcut rendering, and reduced-motion behavior.
- Update `apps/pi-remote-web/index.html` and `public/manifest.webmanifest` for `viewport-fit=cover` and safe-area behavior; update `public/service-worker.js` only to ensure cached history cannot expose enabled controls or stale plan tokens.
- Extend `apps/pi-remote-web/tests/contrast.test.tsx`, `tests/App.test.tsx`, and the component tests with axe/DOM assertions for names, roles, focus order, inert sheets, target size, announcement duplication, and clay contrast. Add a focused CDP fixture/script under `apps/pi-remote-web/tests/` if the existing harness cannot set exact width/theme/text-scale states.
- Exercise the full acceptance matrix in both themes: hydration, Build, Plan, Plan ready, review, execute pending, executing, stale, delivery unknown, offline, forbidden, unsupported, extension error, and superseded plan.
- Perform manual Safari and installed-standalone PWA checks with software keyboard, hardware keyboard/Full Keyboard Access, VoiceOver, rotation, background/resume, reconnect, safe-area insets, browser Back, reduced motion, and 200% text scaling.
- Run the existing release verification and rollback drills after the feature is enabled behind its host capability/health gate. Confirm disabling the capability leaves the old read-only UI safe and does not expose Execute.

### Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- `npm run format:check`
- CDP screenshots at exact `390px` width in light and dark mode, plus exact `320px`, `375px`, and `430px` width layout checks; include 200% text and reduced-motion fixtures.
- Manual on-device sign-off in Safari and installed PWA mode for the keyboard, VoiceOver, safe-area, rotation, resume, and Full Keyboard Access cases.

### Acceptance

- All controls remain visible, labeled, focusable, and unobscured at 320px, 375px, 390px, and 430px, both themes, and 200% text scaling.
- Mode state is never communicated by color alone; contrast checks reject clay-on-bone normal text and clay-only focus/state boundaries.
- VoiceOver announces each settled transition once, starts review on `Keep planning`, and never moves focus when a plan becomes ready.
- Bare Tab and configured Shift+Tab behavior pass physical keyboard testing; the setting restores reverse focus navigation when disabled.
- Reduced motion removes positional/continuous animation while retaining immediate textual state changes.
- Background/resume, rotation, reconnect, offline, relay restart, and service-worker cache behavior all force or await safe authoritative hydration before mutation controls become available.
- Release verification has no stray source-file changes, no unredacted artifacts, and a documented capability-gate rollback path.
