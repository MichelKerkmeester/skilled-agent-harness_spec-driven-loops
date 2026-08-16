---
title: "F4 — Plan mode with a Tab / keyboard affordance"
description: "F4 — Plan mode with a Tab / keyboard affordance"
trigger_phrases:
  - "f4 — plan mode with a tab / keyboard affordance"
importance_tier: "important"
_memory:
  continuity:
    packet_pointer: "app-remote-agent-chat/002-pi-remote-mobile-ui-ux-features/004-plan-mode-tab"
    last_updated_at: "2026-08-16T07:47:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized research and scaffolded feature spec plus build sub-phases"
    next_safe_action: "Prepare reference screens, then build sub-phase 002"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# F4 — Plan mode with a Tab / keyboard affordance

**Summary:** Add a persistent, host-confirmed Plan/Build control beside the sticky composer, with composer-scoped `Shift+Tab`, structured plan review, and a ticketed atomic handoff for executing the reviewed plan.

## DECISION

Build one always-visible composer-adjacent `ModeButton`, immediately after `+`, that presents the host-confirmed state as `Build`, `Plan · read-only`, `Plan ready`, `Executing plan`, or `Mode unavailable`. Tapping it opens a two-option `Build`/`Plan` menu. `Shift+Tab` is intercepted only while the composer textarea is focused and the runtime is ready, idle, and settled; bare `Tab` remains ordinary focus navigation everywhere. The client never displays a requested mode as current before host acknowledgement. Plan execution is a separate, atomic, one-use-ticketed operation bound to the reviewed plan ID, plan revision, opaque plan token, and current runtime revision; it is not `/plan execute` submitted as chat and not `set_mode(build)` followed by a prompt.

This preserves the read-only-by-default posture while reaching the Claude iOS/Kimi Code interaction bar: mobile discoverability from the persistent control, a hardware-keyboard affordance, explicit exit and execution, and fail-closed authority when state is stale, disconnected, or unverifiable.

## Problem and goal

Pi Remote currently exposes Build/Plan from the `+` popover. That control calls the existing runtime mutation lane, and the plan extension removes some write tools and publishes a plan status. There is no composer-adjacent status, no hardware-keyboard affordance, no distinct Plan-ready or executing presentation, and no reviewed-plan execution handoff.

The goal is a fast, legible Plan-mode journey for touch and hardware-keyboard sessions:

1. The user can see the authoritative mode without opening a menu.
2. The user can enter Plan quickly, leave it deliberately, and never mistake a pending request for a committed authority change.
3. A structured host plan can be reviewed, revised, or explicitly executed without turning plan content into a privileged prompt.
4. Every mutation remains one-use-ticketed, revision-checked, foreground-bound, redacted, and fail closed.

### Current state

- `apps/pi-remote-web/src/SessionComposer.tsx` renders Build/Plan inside `ComposerTools` in the `+` popover.
- `apps/pi-remote-web/src/runtime.ts` already avoids optimistic committed runtime state and has stale and delivery-unknown outcomes, but its mode control is a generic `set_mode` operation.
- `apps/pi-remote-relay/src/runtime/runtime-service.ts` hydrates host runtime state and confirms plan status through `apps/pi-remote-relay/src/runtime/plan-status.ts`.
- `extensions/pi-remote-plan/src/index.ts` currently protects the built-in edit/write tools and an allowlisted bash subset, and it has a local `/plan` command.
- The phone has no `Shift+Tab` behavior. The iOS software keyboard does not provide a Tab key, so the visible control remains the complete touch path.
- Structured plan review and an atomic plan-to-execution handoff are not available.

### Desired end state

The web client, relay, protocol, and host extension share one authoritative state model. The client hydrates before enabling mode controls or Send, receives versioned redacted plan artifacts from structured host events, and renders the following independently:

```text
confirmedMode  = build | plan | executing-plan | unknown
planPhase      = none | drafting | ready | superseded
transition     = null | entering-plan | leaving-plan | executing-plan
delivery       = settled | unknown
```

`Plan ready` means `confirmedMode=plan` plus a current valid plan artifact. It is a distinct UI state, not a fourth write-capability mode. `Executing plan` is never labelled read-only because the bounded execution lease temporarily restores the tools required by the reviewed plan and returns the session to Plan when the bounded run ends.

## In scope

- A persistent `PlanModeButton` in the sticky composer toolbar, immediately after `+`.
- A React Aria menu with exactly two selectable options: Build and Plan.
- Host-confirmed labels, pending states, stale reconciliation, delivery-unknown handling, offline handling, and extension-health errors.
- Composer-scoped `Shift+Tab`, an opt-in setting named `CLI-style Shift+Tab in composer`, and `⌘⇧M` to open the mode menu.
- Structured, versioned, redacted plan artifacts and a `PlanReadyCard`.
- A full-height `PlanReviewSheet` with safe default focus and explicit execute, revise, keep-planning, and leave-without-running actions.
- A `LeavePlanSheet` for every Plan → Build transition, including keyboard-triggered transitions.
- A separate atomic `execute_plan` control operation bound to the reviewed artifact and current host revisions.
- Default-deny Plan capability enforcement for built-in, shell, extension, and MCP tools.
- Removal of Plan control commands from the phone slash-command catalog and rejection of `/plan` in normal prompt submission.
- Canonical redaction before persistence, replay, sync, rendering, copying, and diagnostics.
- Light/dark ink-on-parchment styling, WCAG AA behavior, 44px targets, 320px reflow, 200% text scaling, safe-area handling, reduced motion, VoiceOver, Full Keyboard Access, and installed-PWA verification.
- Unit, protocol, relay, extension, DOM, integration, CDP, and on-device verification described below.

## Out of scope: v1 non-goals

- Changing the bone `#f8f8f6` / carbon / clay `#d97757` design system, Inter and Source Serif 4 typography, or the light/dark theme model.
- A global or local optimistic mode toggle, automatic retry of a timed-out mutation, queued mutations while offline, or a cached Build value presented as current authority.
- A fake Tab key on the iOS software keyboard, haptics, a gesture-only mode switch, swipe-to-execute, long-press-only access, drag affordances, or a new full-width segmented control.
- Auto-executing a plan, accepting future prompts, YOLO/auto-approve behavior, bypassing normal filesystem/process approvals, or leaving the session in durable Build after bounded execution.
- Parsing assistant prose to infer a plan, treating a transcript `PlanBlock` as executable authority, or exposing raw host plan data to the phone.
- Plan-first sessions, one-turn Plan policy, cross-session mode, child-session execution forks, or a separate plan editor. `Revise plan` returns focus to the composer.
- Push notifications containing mode, plan titles, paths, plan bodies, tickets, or host identifiers.
- A new permission system. Existing one-use ticketing, foreground principal checks, revision checks, approval flows, and fail-closed relay policy remain the security boundary.
- A promise that arbitrary read output is safe merely because it was redacted; large or sensitive results remain truncated, summarized, denied, or separately approved by host policy.

## User-facing behavior

### Authoritative state model

The web state must keep these fields independent; a single `isPlan` boolean is insufficient:

| Field                                 | Values                                                               | Meaning                                                                                            |
| ------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `confirmedMode`                       | `build`, `plan`, `executing-plan`, `unknown`                         | Last host-acknowledged capability mode.                                                            |
| `runtimeRevision`                     | non-negative integer or `null`                                       | Monotonic host revision required by every mode or execution mutation.                              |
| `connection`                          | `hydrating`, `ready`, `offline`, `forbidden`, `unsupported`, `error` | Whether a current authoritative snapshot can be trusted.                                           |
| `transition`                          | `null`, `entering-plan`, `leaving-plan`, `executing-plan`            | A visible in-flight intent; it never changes `confirmedMode`.                                      |
| `delivery`                            | `settled`, `unknown`                                                 | Whether the last mutation outcome is known. `unknown` disables all mutations until reconciliation. |
| `planPhase`                           | `none`, `drafting`, `ready`, `superseded`                            | Lifecycle of the newest structured plan artifact.                                                  |
| `planId`, `planRevision`, `planToken` | nullable                                                             | In-memory binding to the current redacted host artifact. The token is never rendered or persisted. |
| `turnState`                           | `idle`, `running`                                                    | Mode changes and execution are idle-only.                                                          |

On hydration, reconnect, relay restart, PWA foreground, or browser resume, the client clears current authority to `hydrating`, retains history only for display, and fetches a fresh authoritative snapshot. Cached Build or cached plan content may render as history but can never enable Send, mode selection, Review, or Execute.

### Mode button and menu

- The button is one tab stop in the sticky composer toolbar, immediately after `+`; it stays visible while the composer is visible.
- The button uses React Aria `Button`/`MenuTrigger` and exposes an accessible name containing the consequence, for example `Agent mode: Plan, read-only`.
- Its visible labels are:
  - `Build` with a neutral build/tool icon.
  - lock/document icon plus `Plan · read-only`.
  - document-check icon plus `Plan ready` when the current valid plan is ready for review.
  - play/document icon plus `Executing plan`.
  - warning/shield icon plus `Mode unavailable` when authority is unknown or safety cannot be verified.
  - `Checking mode…` during initial hydration; this is non-selectable and must not flash `Build`.
- The menu is a React Aria `Popover` containing a single-selection `Menu` named `Agent mode`.
- Rows are:
  - `Build` — `Pi may request write-capable tools; approvals still apply.`
  - `Plan` — `Read-only exploration and planning.`
- The host-confirmed selection receives the checkmark. Focus alone never changes authority; only Enter, Space, or pointer activation on release selects.
- When the runtime is pending, executing, unknown, offline, or the turn is running, selection is disabled with the relevant reason. The menu never queues a request.
- `Plan` from settled Build sends one ticketed mode request immediately; no confirmation is needed because authority decreases.
- `Build` from any Plan state opens `LeavePlanSheet`; it never restores tools directly.
- The optional `+ → Mode…` route opens the same picker and cannot create a second mode implementation.
- Tap, keyboard activation, and the optional long-press path all open the same menu. Horizontal swipe, double-tap, drag, and touch-down do nothing. Activation commits only on release inside the target.

### Mode transitions

- A request records `transition` and leaves `confirmedMode` unchanged.
- The UI changes to the new committed label only after the response and matching host status/revision are received.
- Ten rapid taps, a held shortcut, or concurrent clients produce at most one in-flight mode mutation per session.
- A stale response replaces the client view with the returned host state and presents `Updated elsewhere`; the user must act again.
- A timeout, aborted request, relay restart, or uncertain response becomes `delivery=unknown`. The client performs only a read-only reconciliation and never retries the mutation automatically.
- Leaving Plan retains the plan as a non-executable transcript artifact. It does not submit the draft and does not run the plan.

### Keyboard contract

- Bare `Tab` is never cancelled or repurposed.
- `Shift+Tab` toggles only when all of the following are true:
  - the composer textarea has DOM focus;
  - `CLI-style Shift+Tab in composer` is enabled;
  - no menu, sheet, dialog, autocomplete, or approval surface is open;
  - `event.isComposing`, `event.repeat`, and `event.defaultPrevented` are false;
  - no other modifier is pressed;
  - the runtime is ready, idle, settled, and connected.
- From Build, `Shift+Tab` requests Plan.
- From Plan, `Shift+Tab` opens `LeavePlanSheet`; it never directly restores tools.
- From Plan ready, `Shift+Tab` opens the same leave-without-running confirmation.
- From Executing plan, `Shift+Tab` is a no-op and announces `Plan execution is in progress`.
- Outside the composer, `Shift+Tab` remains reverse focus navigation.
- `⌘⇧M` opens the mode menu without changing mode. The button exposes `aria-keyshortcuts="Shift+Tab Meta+Shift+M"`.
- Escape dismisses the topmost menu or sheet without changing mode. Focus returns to the invoker.
- Hardware Full Keyboard Access testing is a release gate. If the setting is disabled, `Shift+Tab` always remains reverse focus navigation while `⌘⇧M` remains available.

### Plan lifecycle and review

- The host publishes a structured, versioned plan artifact. The client never infers readiness from assistant text or a generic transcript block.
- A valid artifact contains a stable `planId`, `planRevision`, host-issued opaque `planToken`, bounded title, redacted summary, redacted steps, optional redacted approaches, timestamp, and validity state.
- `PlanReadyCard` shows only the newest valid artifact: title, redacted summary, revision, timestamp, step count, and `Review plan`.
- Plan feedback or a planning prompt immediately disables execution for that artifact. The host then publishes `plan.superseded`; a new artifact must be acknowledged before Execute is available again.
- `Review plan` opens a full-height React Aria modal containing the complete redacted artifact. It does not expose the token, raw host fields, secrets, absolute paths, principals, or tickets.
- Initial focus is `Keep planning`, never Execute. The sheet actions are `Keep planning`, `Revise plan`, `Leave without running`, and `Execute reviewed plan`.
- Swipe-down, backdrop press, Escape, browser Back, and focus loss cancel safely and do not alter mode or execute.
- `Revise plan` closes the sheet and focuses the composer without changing authority.
- Execute uses the carbon action style, not clay. It remains disabled until the artifact, runtime revision, turn state, connection, and host status are all current.

### Atomic execution handoff

The relay exposes two distinct authenticated control operations. They may share transport plumbing, but they must remain separate protocol discriminants and separate validation paths:

```text
set_mode {
  sessionId
  target: "build" | "plan"
  expectedRuntimeRevision
  controlId
  oneUseTicket
}
```

```text
execute_plan {
  sessionId
  planId
  expectedPlanRevision
  planToken
  selectedApproachId?
  expectedRuntimeRevision
  postRunMode: "plan"
  controlId
  oneUseTicket
}
```

`execute_plan` atomically validates the one-use ticket, authenticated foreground principal, session, runtime revision, plan ID, plan revision/token, current Plan mode, valid plan status, and idle turn state before enabling execution tools and enqueuing the reviewed plan. It publishes `executing-plan` only after the handoff succeeds. It is never implemented as a prompt containing `/plan execute`, as a Build transition followed by a prompt, or as approval of later prompts.

The host applies a bounded execution lease, keeps ordinary filesystem/process approvals in force, and re-establishes Plan restrictions after completion, cancellation, or failure. If tool restoration succeeds but execution cannot start, it restores Plan restrictions before returning the error. A retained or cached artifact cannot execute without live reconciliation.

## Every UI state

| State             | Mode-button/composer presentation                                                    | Allowed actions                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Hydrating         | `Checking mode…`; no menu selection; no Build flash                                  | Edit draft only. Send and all mutations are disabled.                                                           |
| Ready Build       | `Build`; normal carbon composer outline                                              | Open menu, enter Plan, compose, and use normal Send/approval flow.                                              |
| Entering Plan     | Confirmed label remains `Build`; pending text `Applying…`                            | No duplicate mode control; draft remains intact.                                                                |
| Ready Plan        | `Plan · read-only`; lock/document icon; dashed carbon-contrast composer outline      | Planning prompts, open menu, review a current plan, or request exit. Write-capable tools remain denied by host. |
| Plan drafting     | `Plan · read-only`; no executable card                                               | Continue planning or request exit.                                                                              |
| Plan ready        | `Plan ready`; current `PlanReadyCard` with `Review plan`                             | Review, revise, keep planning, leave without running, or execute only through the atomic operation.             |
| Review sheet open | Background inert; full redacted plan visible; initial focus on `Keep planning`       | Keep planning, revise, leave without running, or execute if all live checks pass.                               |
| Execute pending   | Plan remains confirmed; Execute shows pending                                        | No second execute or mode mutation.                                                                             |
| Executing plan    | `Executing plan`; solid carbon composer outline; never `Plan · read-only`            | Steer/Stop under existing rules; no mode switch or second execute.                                              |
| Leave pending     | Plan remains confirmed; `Applying…`                                                  | No duplicate exit request.                                                                                      |
| Conflict/stale    | Returned host state plus `Updated elsewhere`                                         | Refresh/reconcile, then act again.                                                                              |
| Delivery unknown  | Last known state labelled `Unconfirmed`; alert region explains controls are disabled | Read-only reconciliation only; never replay the mutation.                                                       |
| Offline           | `Last confirmed … · offline`; timestamp visible                                      | Reconnect. No mutation is queued.                                                                               |
| Forbidden         | `Device not authorized`                                                              | Secure reconnect or device approval; no mode, prompt, or execute controls.                                      |
| Unsupported       | `Plan unavailable on this host`                                                      | Diagnostic/recovery only; no Plan or Execute action.                                                            |
| Extension error   | `Plan safety could not be verified`                                                  | Send and all escalation/mutation controls are disabled until a healthy host snapshot arrives.                   |
| Superseded plan   | Retained artifact is visibly non-executable                                          | Review history or continue planning; Execute is absent/disabled.                                                |

### Accessibility, responsive layout, and visual rules

- Use one visible label, icon, and consequence. Do not use a changing-label `aria-pressed` toggle for authority state.
- Use one permanently mounted polite `RuntimeModeAnnouncer` and a separate pre-mounted alert region only for conflicts, permission loss, or delivery uncertainty. Use visible inline errors for actionable failures.
- Modal backgrounds become inert; focus is trapped and restored. Settled mode changes never move focus or automatically open a plan sheet.
- VoiceOver must not be moved when a plan becomes ready. It receives one announcement: `Plan ready for review.`
- Every target is at least 44×44 CSS px. Focus indicators are at least 2px, offset 2px, and 3:1 against the component and surrounding surface.
- At 320px reflow and 200% text scaling, `Plan · read-only`, `Executing plan`, errors, and all actions remain readable. At narrow widths, the mode control may occupy a full-width toolbar row above the textarea.
- Use `rem`, logical CSS properties, localized complete messages, `dir="auto"` for prose, and isolated LTR rendering for paths, revisions, slash commands, and keyboard legends.
- Light canvas is bone `#f8f8f6`; dark canvas/surface is near-carbon; critical text/outlines use carbon or bone as appropriate. Clay is a secondary 3–4px status bar, dot, or soft selected tint only. Clay-on-bone is not normal text, focus, or the only state boundary.
- Plan state is redundant in words, iconography, menu checkmark, and dashed carbon outline. Execution uses a solid outline and a distinct label.
- Press feedback is 120ms opacity/background only; menu 140ms opacity; sheet 180ms ease-out with no more than 8px translation; settled chrome 140ms crossfade; pending text after 300ms. Keyboard transitions are immediate.
- `prefers-reduced-motion: reduce` removes translation, rotation, and transition delay. No bounce, pulsing security badge, marching border, full-page tint, or celebratory animation.
- Keep the control inside the existing sticky composer. Use `viewport-fit=cover` and safe-area padding; do not position a separate overlay solely from `visualViewport.height`.

## Acceptance criteria

Each criterion has an explicit proof target. A release is blocked by any failed criterion.

| Criterion                                                                                                                                                       | Proof target                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Initial hydration cannot present Build as current authority.                                                                                                    | `apps/pi-remote-web/tests/runtime.test.tsx` reducer test plus a DOM assertion that the mode control is `Checking mode…`/disabled until the live snapshot resolves; CDP screenshot shows no selected mode during hydration.                             |
| The persistent control is immediately after `+`, has one tab stop, and exposes its consequence in its accessible name.                                          | React Testing Library DOM assertion on `SessionComposer`/`PlanModeButton`; `getByRole('button', { name: /Agent mode.*Plan.*read-only/i })` in Plan.                                                                                                    |
| The menu contains only Build and Plan, uses a checkmark for host-confirmed state, and focus alone never mutates.                                                | Menu DOM assertion and user-event test; selecting with Arrow keys alone yields zero relay requests.                                                                                                                                                    |
| Plan entry is host-confirmed and single-flight.                                                                                                                 | Relay integration test records one `set_mode` request after ten taps/held shortcuts; web state test keeps `confirmedMode=build` until the matching acknowledgement.                                                                                    |
| Plan exit always requires `LeavePlanSheet`, including `Shift+Tab` and `Plan ready`.                                                                             | DOM/user-event test asserts the sheet, exact copy, and zero host mutation before `Switch to Build`; manual keyboard check confirms the same path.                                                                                                      |
| Bare Tab remains normal forward navigation and outside-composer Shift+Tab remains reverse navigation.                                                           | Keyboard DOM tests assert `defaultPrevented=false` and focus order in both contexts.                                                                                                                                                                   |
| Composer-scoped Shift+Tab is ignored for IME composition, repeat, autocomplete/sheet/menu/approval surfaces, pending, offline, unknown, or running-turn states. | Parameterized web keyboard test with one case per guard; each case asserts zero mode requests and unchanged draft selection/scroll.                                                                                                                    |
| `⌘⇧M` opens the same menu without changing mode.                                                                                                                | DOM keyboard test asserts menu visibility, unchanged runtime state, and restored focus after Escape.                                                                                                                                                   |
| Mode labels distinguish Plan, Plan ready, and Executing plan.                                                                                                   | State-machine test plus DOM assertions for all three labels; executing presentation contains neither `read-only` nor the lock-only affordance.                                                                                                         |
| Stale concurrent mutations accept at most one revision and reconcile the loser.                                                                                 | `apps/pi-remote-relay/tests/runtime-control.test.ts`/new plan-control integration test with two clients: one accepted, one stale, no second host mutation.                                                                                             |
| Timeout, abort, relay restart, or lost response produces delivery-unknown and never auto-retries.                                                               | Relay/web failure-injection test asserts `delivery=unknown`, disabled mutations, exactly one read-only reconciliation, and no replay.                                                                                                                  |
| Offline, forbidden, unsupported, and extension-error states fail closed with the specified copy.                                                                | DOM state-fixture test for each state; CDP screenshot captures offline and error variants in both themes.                                                                                                                                              |
| A running turn blocks mode changes with the specified reason.                                                                                                   | DOM assertion on disabled menu rows and a relay test asserting no mode operation reaches the host.                                                                                                                                                     |
| `/plan`, `/plan on`, `/plan off`, and `/plan execute` are rejected from the normal prompt path, including leading whitespace.                                   | `apps/pi-remote-relay/tests/prompt.test.ts` and command-catalog tests assert no host prompt is emitted and no Plan control command is returned to the phone catalog.                                                                                   |
| Internal mode/status events do not become user bubbles, transcript blocks, replay records, or model-visible prompts.                                            | Sync and prompt integration test inspects envelopes/transcript; status events are absent from user-facing transcript projections.                                                                                                                      |
| Plan-ready content comes only from a versioned structured host artifact.                                                                                        | Protocol guard test rejects missing ID/revision/token/version or prose-only payload; web test does not render a card from an assistant text block.                                                                                                     |
| Only the newest valid plan can expose Review/Execute, and feedback supersedes the old artifact immediately.                                                     | Plan lifecycle reducer/component test renders one card, disables Execute on feedback, and rejects an old revision/token.                                                                                                                               |
| Review sheet is redacted, accessible, and safely cancellable.                                                                                                   | DOM test asserts modal semantics, inert background, initial focus on `Keep planning`, all four actions, no token/path/secret text, and safe Escape/backdrop/Back cancellation.                                                                         |
| Execute is an atomic, explicit, reviewed-plan operation.                                                                                                        | Protocol/relay/host integration test asserts one `execute_plan` operation with the exact plan ID, revision, token, runtime revision, foreground principal, idle state, and `postRunMode=plan`; no `/plan execute` prompt or `set_mode(build)` appears. |
| Execution fails closed on any mismatch, replay, expiry, stale revision, non-Plan mode, running turn, or non-current artifact.                                   | Negative security tests assert no tool restoration or plan dispatch for each mismatch and a bounded error without sensitive details.                                                                                                                   |
| Host restrictions are default deny during Plan and are restored after execution success, cancellation, or failure.                                              | `extensions/pi-remote-plan/tests/plan-mode.test.ts` plus host/relay integration tests cover built-in writes, shell control tokens, unknown extension/MCP tools, and restoration failure. Security review sign-off is required before enabling Execute. |
| Redaction happens before every persistence, replay, sync, render, copy, notification, and diagnostic boundary.                                                  | `apps/pi-remote-relay/tests/redaction.test.ts` and plan-artifact tests use canary secrets, tickets, principals, host IDs, absolute paths, raw arguments, and unredacted plan content; all are absent from serialized outputs.                          |
| Cache and service-worker history cannot enable controls.                                                                                                        | Cache/service-worker test loads cached Build and Plan artifacts while offline; DOM asserts controls remain disabled until live hydration.                                                                                                              |
| VoiceOver receives one announcement per settled transition and focus remains stable.                                                                            | Manual iPhone VoiceOver step with a spoken-output checklist; DOM test asserts one mounted polite announcer and no duplicate `role=status`/live-region announcement.                                                                                    |
| Layout and contrast meet the fixed visual system.                                                                                                               | CDP screenshots at exact 320, 375, 390, and 430px widths in light/dark and 200% text fixture show no clipping/occlusion; `apps/pi-remote-web/tests/contrast.test.tsx` rejects clay-on-bone normal text and clay-only boundaries.                       |
| Safe-area, keyboard, rotation, resume, and reduced-motion behavior are correct in installed PWA mode.                                                           | Manual on-device steps in Safari and standalone PWA with software keyboard, hardware keyboard, rotation, background/resume, VoiceOver, Full Keyboard Access, and `prefers-reduced-motion`; screenshot gate is exact 390px in both themes.              |

## Security and redaction requirements

The only authority chain is:

```text
explicit user action
→ one-use ticketed control request
→ foreground/session and expected-revision validation
→ host-extension capability change or bounded execution handoff
→ authoritative status publication
→ client presentation
```

- `set_mode` and `execute_plan` are foreground-only, single-flight, rate-limited, idempotent-by-control ID, one-use-ticketed mutations.
- The relay binds every mutation to the authenticated session, device, foreground principal, host/workspace context, and expected runtime revision. `execute_plan` additionally binds plan ID, plan revision, opaque token, selected approach, idle state, current Plan mode, and `postRunMode=plan`.
- Tickets are consumed exactly once. Expired, consumed, malformed, replayed, or cross-session tickets fail closed without invoking Pi.
- A timeout or aborted HTTP request does not prove non-application. The client reconciles by read-only state fetch and never retries automatically.
- Plan mode is enforced by the host, not by hidden UI controls: built-in write/edit tools are denied; shell behavior is explicitly allowlisted for read-only use; unknown extension and MCP tools are denied until classified read-only.
- Normal filesystem/process approval leases remain active during bounded execution. Execute is not approval of later prompts, auto-accept, YOLO, or bypass mode.
- `/plan` control commands are unavailable through normal phone prompt submission. Leading whitespace is normalized before rejection. Relay-generated control prompts, if the host bridge still requires one internally, never enter the user message path, transcript, replay, model-visible chat, or command catalog.
- Redaction is applied before database persistence, ledger append, replay snapshot, sync broadcast, browser DTO creation, rendering, copying, push/notification generation, and diagnostic logging. Use allowlisted projectors for plan DTOs, tool results, diffs, and errors; generic string replacement is not sufficient as the sole proof of safety.
- Remove secrets, credentials, tickets, principals, host IDs, hostnames, absolute paths, unsafe filenames, raw environment values, raw tool arguments, and unredacted plan content. Project-relative paths appear only when policy explicitly allows them; otherwise use stable redacted aliases. Truncate or summarize large read results.
- `planToken` is held in memory only for the current live session and is never rendered, cached, copied, logged, pushed, or placed in a URL.
- Copy is user-initiated and copies only the already-redacted visible projection. Service-worker/transcript caches may render history but can never enable mode or execution controls.
- Resume, reconnect, relay restart, foreground restoration, plan feedback, another-client change, and host restart force authoritative reconciliation. A stale plan card remains non-executable.
- User-facing errors and diagnostics contain only bounded safe reasons. They omit tickets, principals, hostnames, absolute paths, raw tool arguments, and unredacted plan content.

## Dependencies and affected areas

| Area                  | Files/components                                                                                                                                                                                                   | Required change                                                                                                                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Protocol              | `packages/pi-rpc-protocol/src/types.ts`, `src/guards.ts`, `src/index.ts`, `tests/guards.test.ts`                                                                                                                   | Add guarded plan artifact/snapshot/event DTOs, exact `set_mode` and `execute_plan` control discriminants, runtime/plan validity states, bounded outcomes, and reject unknown keys or host-only values.                                                                      |
| Host extension        | `extensions/pi-remote-plan/src/index.ts`, new plan-artifact/host-adapter module if the host API needs separation, `tests/plan-mode.test.ts`                                                                        | Publish authoritative mode/revision and structured redacted artifacts; default-deny all unclassified mutation-capable tools; implement bounded execution lease and guaranteed Plan restoration.                                                                             |
| Relay runtime         | `apps/pi-remote-relay/src/runtime/runtime-service.ts`, `src/runtime/plan-status.ts`                                                                                                                                | Track confirmed mode, runtime revision, plan revision/token, transitions, execution state, and delivery uncertainty; make mode and execute operations single-flight, idempotent, and host-confirmed.                                                                        |
| Relay HTTP/auth       | `apps/pi-remote-relay/src/http/server.ts`, `src/auth/rate-limit.ts`, `src/auth/policy.ts`                                                                                                                          | Authenticate and rate-limit both plan operations, require a foreground live sync socket, consume one-use tickets, return stale/delivery-unknown distinctions, and never expose sensitive reasons.                                                                           |
| Relay sync/store      | `apps/pi-remote-relay/src/replay/sync.ts`, `src/store/relay-store.ts`, `src/store/redaction.ts`, `src/store/transcript-projector.ts`                                                                               | Persist/broadcast only redacted versioned plan events; keep control-plane status out of transcript projections; hydrate the newest valid plan without enabling cached execution. Add a migration only if the existing store schema requires durable plan-artifact metadata. |
| Relay prompt/commands | `apps/pi-remote-relay/src/prompt/prompt-service.ts`, `src/commands/command-service.ts`                                                                                                                             | Reject `/plan` variants before host submission and filter the Plan control command from the phone catalog.                                                                                                                                                                  |
| Web relay client      | `apps/pi-remote-web/src/relay.ts`                                                                                                                                                                                  | Add read-only plan hydration/event parsing and separate one-use-ticketed `setMode`/`executePlan` calls with strict response guards.                                                                                                                                         |
| Web runtime/state     | `apps/pi-remote-web/src/runtime.ts`, `src/state.ts`, `src/cache.ts`, `src/App.tsx`                                                                                                                                 | Implement the independent authority model, hydration/reconciliation rules, plan lifecycle, safe cache behavior, and session wiring.                                                                                                                                         |
| Web components        | `apps/pi-remote-web/src/SessionComposer.tsx`, new `PlanModeButton.tsx`, `PlanModeMenu.tsx`, `usePlanModeShortcut.ts`, `PlanReadyCard.tsx`, `PlanReviewSheet.tsx`, `LeavePlanSheet.tsx`, `RuntimeModeAnnouncer.tsx` | Replace the `+`-only mode toggle with the persistent control and implement all menu, sheet, keyboard, focus, announcement, and execution states.                                                                                                                            |
| Web styling/PWA       | `apps/pi-remote-web/src/style.css`, `index.html`, `public/manifest.webmanifest`, `public/service-worker.js`                                                                                                        | Preserve the fixed visual system while adding responsive toolbar layout, safe-area padding, focus/contrast/reduced-motion rules, and history-only cache behavior.                                                                                                           |
| Verification          | Existing package typechecks/tests plus new web DOM/CDP and relay/host security tests                                                                                                                               | Every acceptance check above must have a test, DOM assertion, CDP screenshot, or manual on-device result before release.                                                                                                                                                    |
