<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# Change the effort / reasoning level

**Summary:** Pi Remote gets one canonical, host-authoritative effort picker with readable level explanations, immediate but non-optimistic mutations, and recoverable fail-closed states.

## Decision

Build one reusable effort picker as full-width radio rows inside the existing Model and Effort sheet. Remove the nested effort `Select`; make the header and RuntimeStrip open this same surface. Preserve the host-advertised order and subset, render unknown levels with safe local ordinal labels, and do not invent a `Default` marker. A selection requests one fresh ticketed, revision-checked mutation and stays visually unselected until Pi confirms the new state. While Pi is streaming, effort changes are disabled until a live-host probe establishes their exact effect; the UI must not promise “next message” semantics. Failures become cause-specific, recoverable read-only states rather than the generic terminal “Unavailable” state.

## Problem and goal

The current effort control is a nested `Select` in the model sheet, with a second effort control in the RuntimeStrip. It exposes host identifiers through a small label map, provides no explanation of what a level means, and presents several authority, mid-turn, accessibility, and recovery cases as one generic unavailable state. The underlying relay already has host-confirmed runtime state, advertised thinking levels, one-use tickets, and revision-checked runtime mutations, but the UI lifecycle does not use those guarantees consistently.

The goal is a flawless in-app effort switcher that is understandable at three through seven levels, works with touch, keyboard, and VoiceOver, keeps the model and effort controls visually coherent, and never claims a mutation succeeded before the host confirms it.

## Current state

- Pi exposes the current thinking level, the available thinking-level subset and order, whether the host is streaming, the current runtime revision, model state, and Build/Plan state through the relay-backed runtime DTO.
- The relay reads Pi with `get_state`, `get_available_thinking_levels`, and `get_available_models`, and mutates through `set_thinking_level` behind a one-use ticket, foreground-device check, and expected revision.
- `apps/pi-remote-web/src/runtime.ts` is non-optimistic for settled responses, but its status vocabulary and error path are too coarse for the required recovery states. It has no synchronous same-render in-flight guard or cross-browser mutation deadline.
- `SessionHeader.tsx` owns a model-and-effort dialog with a nested effort `Select`. `RuntimeStrip.tsx` owns another effort `Select`; these are separate interaction surfaces.
- The app already uses React 19, Vite, Tailwind 4, React Aria Components, the ink-on-parchment visual system, light and dark themes, and a loopback relay.

## Desired end state

- Header and RuntimeStrip show only host-confirmed model and effort values and open one controlled `ModelEffortSheet`.
- The sheet contains the existing model control and one `EffortRadioGroup`; effort never opens a second overlay.
- Every advertised level renders in host order. Known IDs use bounded local labels and descriptions; unknown IDs remain internal values and render only as `Host-defined level N`.
- A request records a pending intent separately from confirmed state. The checked row does not move until Pi returns an accepted state.
- Streaming, offline, stale authority, foreground ownership, empty or inconsistent capability data, rate limiting, host rejection, and ambiguous delivery each have distinct copy, interaction, and recovery behavior.
- Reconcile, reconnect, foreground refresh, and sheet-open hydration are read-only. No failed intent is replayed automatically.
- The feature remains read-only by default: only an explicit row selection can request a mutation, and it cannot change Build/Plan authority or approve tools.

## In scope

- A single effort catalog module and safe formatting helpers.
- A controlled React Aria radio group with descriptions, confirmed and pending indicators, and bounded disabled-state copy.
- A single controlled Model and Effort sheet with `initialSection="model" | "effort"`.
- Header and RuntimeStrip entry points that share the sheet and mutation path.
- A typed read-only runtime snapshot/reconcile response and normalized runtime issue codes at the relay/protocol boundary.
- Rehydration on sheet open, app foreground, and sync reconnection, with in-flight read deduplication.
- A synchronous in-flight mutation guard, a 10-second cross-browser mutation deadline, and terminal delivery-unknown handling.
- Stable local copy for all user-facing and assistive outcomes.
- Light/dark styling, reduced motion, RTL, text inflation, 320px reflow, 200% zoom, safe-area padding, and a true 390px CDP screenshot check.
- Unit, protocol/relay, DOM, contrast, and real-iPhone standalone PWA verification.

## Out of scope: v1 non-goals

- Changing the bone `#f8f8f6` / carbon ink / clay `#d97757` design system, typography, light/dark themes, or WCAG AA baseline.
- Adaptive segmented controls, sliders, swipe-to-change, long-press actions, custom audio ticks, simulated haptics, or a custom swipe-to-dismiss gesture.
- Allowing effort changes during streaming before a live Pi probe proves whether they affect the next model call, the next turn, or neither. Do not promise “next message” behavior.
- A `Default` badge or any client-invented default.
- Token budgets, prices, latency promises, rank metadata, cost estimates, or quality guarantees that Pi does not supply.
- Per-level disabled reasons or localized host-authored descriptions; retain those as a future protocol capability.
- Automatic retries, automatic re-submission after reconciliation, ticket prefetching, ticket persistence, or transfer of foreground authority.
- Any change to Build/Plan semantics, extension-enforced plan mode, approval grants, tool permissions, transcript redaction, or the foreground-device security rule.
- A second effort picker implementation in the composer, header, or RuntimeStrip.

## User-facing behavior

### Entry points and sheet structure

1. Tapping the header trigger opens the shared sheet at the Model section. The trigger reads as separate localized spans for model and confirmed effort, for example `DeepSeek Flash · High`; its accessible name is one localized template.
2. Tapping the RuntimeStrip effort trigger opens the same sheet at the Effort section. The compact readout is `Effort · High` visually, with separate spans and a localized accessible name.
3. Both triggers use one controlled open state and one `ModelEffortSheet` instance. The originating trigger receives focus again when the sheet closes. The sheet is a single top-level React Aria `Dialog`/portaled `Popover`; the effort group does not open another overlay.
4. Opening the sheet starts a read-only hydrate. Until it settles, the last confirmed value is shown as checking, or an em dash is shown when no confirmed value exists. A hydrate already in flight is reused.
5. The model picker remains adjacent to effort in the same sheet. It retains its existing host-authoritative mutation behavior; it does not gain local committed state or a second effort mutation path.

### Effort catalog and copy

`effort.ts` is the single source of visible labels, descriptions, and formatting helpers. It preserves the host’s advertised order and subset.

| Host ID | Visible label | Description |
| --- | --- | --- |
| `off` | Off | No explicit reasoning; fastest for simple checks. |
| `minimal` | Minimal | Brief reasoning with a quick response. |
| `low` | Low | Light reasoning for routine work. |
| `medium` | Medium | Balanced reasoning depth and speed. |
| `high` | High | Deep reasoning for complex coding work. |
| `xhigh` | Extra high | Very deep reasoning for long-running agent work. |
| `max` | Max | Maximum available reasoning; slowest and highest use. |

Descriptions express direction, not guaranteed token counts, cost, latency, or quality. Unknown IDs remain usable as internal selection values but are never echoed. In advertised order, unknown values render as `Host-defined level 1`, `Host-defined level 2`, and so on. Raw host IDs, host labels, RPC reasons, HTTP bodies, and server strings never enter visible or accessible copy.

### Selecting a level

- A row commits on React Aria press release. Pressing and dragging away cancels; a re-tap of the confirmed row is a no-op.
- Before sending, the client captures the latest confirmed revision, creates a fresh control ID, requests a fresh one-use ticket immediately before the write, and sends the selected internal level ID through the existing runtime control endpoint.
- The checked row remains the confirmed host value. The requested row alone shows a spinner and `Applying {label}…`; the group has `aria-busy="true"` and ignores further selection through both the handler and the synchronous in-flight guard.
- The sheet may close while a request is pending. Dismissal never cancels the host mutation; the document-level status region announces the eventual bounded result.
- An accepted response is the only event that moves the check. The new state and revision come from Pi, then the UI announces `Effort set to {label}.` once and returns to ready.
- A stale or unsupported result uses the returned host state, performs one read-only reconcile, and never resends the original selection. A later user selection creates a new ticket, control ID, and expected revision.
- A timeout or transport failure that could have happened after delivery becomes delivery-unknown. The UI stays terminal until a read-only reconcile confirms the current host state; it never replays the old intent.

### Keyboard, focus, and dismissal

- Enter or Space on either trigger opens the sheet.
- Tab enters the radio group at the confirmed option. Arrow keys follow React Aria radio behavior and select one option; the group then locks pending confirmation. Space selects the focused option.
- Escape, explicit Close, or scrim tap dismisses the sheet. Escape restores focus to the originating trigger.
- Pending controls remain focusable but read-only; they are not made unfocusable by disabling the focused radio.
- The sheet remains vertically scrollable. Do not add a custom swipe-to-dismiss gesture in this pass.
- React Aria and the inherited `dir` attribute own RTL arrow direction; no manual key reversal is allowed.

## UI state model

The table is exhaustive for the effort surface. `runtime.state` is always the last host-confirmed snapshot; pending intent and issue state are separate.

| State | Presentation | Interaction and recovery |
| --- | --- | --- |
| `closed` | Header/RuntimeStrip show confirmed values, checking, or an em dash. | Trigger opens the shared sheet and requests a read-only hydrate. |
| `checking` | Last confirmed value is marked `Checking…`; with no value, show an em dash. | All mutations are read-only. The sheet may be dismissed; hydrate failure maps to a bounded issue state. |
| `ready-adjustable` | One checked row, descriptions, and the host’s exact order/subset. | Tap, Space, or arrow selection starts exactly one mutation. |
| `ready-off-only` | Static `Off` row plus `This model does not expose adjustable reasoning.` | No effort mutation affordance. The model control remains available. |
| `ready-empty` | The group is replaced by `Pi reported no effort controls.` | Treat as inconsistent capability data. Offer `Reconcile`; do not invent `Off` or another replacement. |
| `streaming` | Confirmed value remains visible with `Available when the current turn ends.` | No ticket is requested and no effort mutation is sent. Re-enable only after a confirmed idle hydrate. |
| `pending` | Confirmed row stays checked; requested row shows spinner and `Applying {label}…`; group has `aria-busy="true"`. | Group is read-only, not unfocusable. Other runtime mutation controls are locked to avoid revision races. Dismissal does not cancel the operation. |
| `accepted` | Check moves only to the level in the accepted host state. | Announce `Effort set to {label}.` once, then return to ready. |
| `stale` | Show the host state returned by the relay and a short `Updated from Pi` status while reconciling. | Perform one read-only refresh of state, model catalog, and levels. Never resend. |
| `unsupported` | Keep the last confirmed value and show `That effort level is not available for this model.` | Reconcile once. A new user choice is required before another mutation. |
| `offline` | Keep the last confirmed value marked `Last confirmed`; show `Offline`. | Mutations are disabled. Reconcile automatically after connectivity returns, but require a new user selection to mutate. |
| `foreground-required` | Show `Another device is controlling Pi.` | Mutations are disabled. `Reconnect` may restore sync; it must not take authority or resubmit automatically. |
| `rate-limited` | Show `Too many changes—try again shortly.` | Honor the bounded `Retry-After` delay, reconcile afterward, and require a fresh selection and ticket. |
| `host-unavailable` | Show `Pi is not ready to change effort.` | Offer read-only `Reconcile`. Do not retry the mutation automatically. |
| `delivery-unknown` | Show `Pi may have received this change. Reconcile before trying again.` | Terminal until a read-only hydrate confirms state. Never replay the same intent, even with a new control ID. |
| `inconsistent-state` | Show the last confirmed value but mark it unavailable because it is absent from the advertised catalog. | Disable mutation and offer `Reconcile`; never silently select a replacement. |

`Reconcile` is always a read-only fetch. All user-facing messages above come from a bounded local allowlist; only `{label}` is substituted from the local catalog formatter.

## Accessibility, internationalization, and visual behavior

- Use React Aria `RadioGroup` and one `Radio` per advertised level. Label the group from the visible `Effort` heading with `aria-labelledby`; associate each radio with its description through the React Aria description slot or `aria-describedby`.
- Maintain one document-level `role="status" aria-live="polite" aria-atomic="true"` for effort outcomes so announcements remain available after the sheet closes. Do not add a competing `alert` region or overlapping effort live region.
- Minimum touch target is 44×44 CSS px. Two-line rows should normally be 56–64 px high. Focus, borders, and selected indicators must remain visible in every theme.
- Preserve browser text inflation; never set `-webkit-text-size-adjust: none`. At large text sizes, descriptions wrap and the sheet scrolls internally below a fixed heading.
- Replace concatenated English strings such as `Effort · ${value}` with localized templates or separately ordered spans. Host strings and server reasons never become accessible names or live-region copy.
- Preserve the fixed design system: light canvas bone `#f8f8f6`, carbon ink, clay `#d97757`, existing accessible clay-ink tokens, Inter for controls, Source Serif 4 for the sheet title, parchment surfaces, warm hairline border, 24–30px radius, and restrained shadow.
- Raw clay `#d97757` is not sufficient as the sole selected, focus, or pending indicator on bone. Pair carbon or the accessible clay-ink token with a check, text, and shape.
- The sheet is `width: min(92vw, 24rem)`, `max-height: approximately 75dvh`, internally scrollable, and padded for `env(safe-area-inset-bottom)`. Its heading remains readable while rows scroll.
- Press feedback uses `data-pressed` scale `0.98`; sheet entry/exit uses 140–180ms opacity plus 8px movement; the confirmed check uses a 120ms scale-and-fade; pending uses the existing restrained streaming-bars language or a 12px spinner only on the requested row. Reduced motion removes transforms and pulses and uses an immediate or opacity-only change.
- Never animate the header’s confirmed value before host acceptance.

## Acceptance criteria

Each criterion below has a named objective check. No visual-only review substitutes for the listed automated or manual check.

| # | Criterion | Check |
| --- | --- | --- |
| 1 | The effort group renders exactly the host-advertised order and subset, including three-, five-, and seven-level catalogs. | Protocol/relay fixture test plus DOM order assertion. |
| 2 | Known IDs use the specified bounded labels and descriptions; no `Default` marker appears. | Component DOM assertion over every known ID. |
| 3 | Unknown IDs remain selectable internally but their raw strings are absent from rendered text, accessible names, live-region text, and screenshots. | DOM/accessibility-tree assertion with hostile unknown IDs plus CDP screenshot inspection. |
| 4 | Header and RuntimeStrip triggers open one shared sheet, with the requested initial section, and no effort-specific second overlay. | DOM assertion for one `role="dialog"`, trigger callback identity, and section focus. |
| 5 | Header and RuntimeStrip readouts show confirmed model/effort values only and use separate spans/localized accessible names. | DOM assertion before, during, and after a mutation. |
| 6 | Selecting a different row sends exactly one fresh ticket, one fresh control ID, one `set_thinking_level` operation, and the current expected revision. | Relay/client unit test with ticket and RPC spies. |
| 7 | Same-tick double taps and keyboard repeat during the in-flight window produce one request; re-tapping the confirmed row produces zero. | Reducer/hook test with synchronous call-count assertions. |
| 8 | The checked row remains unchanged during pending and changes only from the accepted host state. | Runtime reducer test and pending/accepted DOM assertion. |
| 9 | Pending shows only the requested-row spinner, `aria-busy="true"`, bounded applying copy, and read-only focusable radios; other runtime mutations are locked. | DOM assertion and keyboard interaction test. |
| 10 | Streaming renders `Available when the current turn ends.` and sends neither a ticket request nor a mutation. | Mocked transport test and DOM assertion with `streaming: true`. |
| 11 | Accepted, stale, unsupported, and delivery-unknown outcomes produce their specified state transitions and exactly-once bounded announcements. | Runtime state-machine test plus live-region DOM assertion. |
| 12 | Stale and unsupported outcomes perform one read-only reconcile and zero automatic mutation retries. | Relay mock call-order/count test. |
| 13 | A cross-browser 10-second mutation deadline enters delivery-unknown; no automatic replay is possible before or after reconciliation. | Fake-timer test with transport left unresolved, then reconcile test. |
| 14 | Offline, foreground-required, rate-limited, host-unavailable, and invalid-response failures render local copy without raw HTTP status, body, host reason, or RPC reason. | Error-mapping unit test and DOM text/accessibility-tree assertion. |
| 15 | Rate-limited handling reads a bounded `Retry-After`, waits/reconciles as specified, and still requires a new user selection and ticket. | Relay header test and hook state-machine test. |
| 16 | `['off']`, an empty catalog, a confirmed value missing from the catalog, and a normal adjustable catalog render four distinct specified states. | Component fixture matrix test. |
| 17 | Sheet open, app foreground, and sync reconnection trigger read-only hydration; concurrent hydration calls are deduplicated. | Hook test with visibility/connection events and fetch call count. |
| 18 | Escape, Close, scrim, and focus restoration work; pending dismissal leaves the mutation running. | React Aria interaction test. |
| 19 | Radio labels, descriptions, group labeling, focus visibility, keyboard behavior, and 44px targets meet the stated accessibility contract. | DOM accessibility assertions plus keyboard test. |
| 20 | The single polite atomic status region announces pending, accepted, stale, and failure outcomes once without a competing alert. | DOM assertion and manual VoiceOver check. |
| 21 | Light, dark, selected, disabled, focus, and pending combinations meet text contrast 4.5:1 and non-text contrast 3:1. | `contrast.test.tsx`/automated contrast check plus CDP screenshots. |
| 22 | The sheet reflows at 320px and 200% zoom, has no horizontal scroll, remains scrollable at seven two-line rows, and respects safe-area insets. | CDP viewport/zoom assertion and screenshot at 320px; manual iPhone check. |
| 23 | Reduced-motion mode removes transforms/pulses; RTL inherits React Aria arrow direction; browser text inflation remains enabled. | CSS/DOM test plus manual RTL and reduced-motion checks. |
| 24 | Runtime snapshot, catalog, and outcome payloads pass protocol guards, remain bounded, and contain no paths, secrets, raw host reasons, or ticket data in rendered state, logs, or diagnostics. | Protocol guard tests, relay redaction test, and log/DOM canary sweep. |
| 25 | Effort changes cannot alter Build/Plan state, approve tools, bypass extension plan restrictions, or mutate while foreground authority is absent. | Relay security/negative-control tests plus manual Plan-mode PWA check. |
| 26 | The standalone iPhone PWA works with touch, VoiceOver, light/dark themes, reconnect, streaming, stale, and delivery-unknown recovery. | Manual on-device test using a real enrolled iPhone. |

## Security and redaction requirements

Effort is a mutation inside a read-only-by-default client. The following rules are mandatory:

- Only an explicit selection of a different available row can create a mutation attempt. Reconcile, reconnect, foreground, app-open, and hydrate paths are read-only.
- The client creates a unique control ID and requests a fresh one-use ticket immediately before each attempt. Tickets are never prefetched, persisted, logged, included in screenshots, or reused after any failure.
- Every mutation carries the selected internal level ID, the latest confirmed revision, the session binding, and the fresh ticket. The relay validates the level against Pi’s current advertised catalog before forwarding it.
- A synchronous in-flight ref closes the same-render double-tap window. The relay remains idempotent by control ID, and the client never treats idempotency as permission to replay an old intent.
- The relay requires the authenticated foreground sync device for runtime control. A 403 foreground result fails closed; reconnect may restore the read-only connection but cannot take authority or submit automatically.
- Pi remains authoritative. No UI state, header label, check mark, or accessibility value is committed optimistically. A pending intent is a separate redacted UI field.
- The relay maps host rejection and transport outcomes to bounded issue codes. The protocol and HTTP error envelopes carry enums or fixed machine codes, not arbitrary host reason strings. `relay.ts` and `runtime.ts` map them to local copy; raw HTTP bodies, RPC reasons, host IDs, and unknown level IDs never reach visible or assistive text.
- Runtime state, issue state, telemetry, and logs retain existing redaction and length bounds. New issue fields contain enums only. Tickets, session cookies, paths, secrets, prompt text, and host error bodies are absent from diagnostics.
- A stale response replaces the client view with the returned host state and starts one read-only reconcile. An unsupported response does the same. A timeout or ambiguous delivery is terminal until read-back confirms state. No path automatically sends a mutation again.
- The 10-second deadline must distinguish “the browser stopped waiting” from “Pi rejected the write”; the former is delivery-unknown and never an automatic retry.
- Streaming, offline, stale-authority, foreground-held, empty-capability, and inconsistent-catalog states disable effort mutation. The client never invents a level to make the control appear usable.
- Changing effort cannot enable Build mode, approve tools, grant edits, alter extension-enforced plan restrictions, or change foreground ownership. Any exception is a separate security decision.

## Dependencies and affected areas

| Area | Files/components | Required change |
| --- | --- | --- |
| Protocol | `packages/pi-rpc-protocol/src/types.ts`, `guards.ts`, `index.ts`, `packages/pi-rpc-protocol/tests/guards.test.ts` | Add the bounded runtime snapshot and issue-code contract, keep exact-key guards fail closed, and test accepted/rejected shapes. |
| Relay runtime | `apps/pi-remote-relay/src/runtime/runtime-service.ts`, `src/runtime/plan-status.ts`, `src/store/redaction.ts` | Reconcile state/models/levels read-only, preserve host order and revision, map failures to bounded codes, and keep raw host reasons out of the browser contract. |
| Relay HTTP/auth | `apps/pi-remote-relay/src/http/server.ts`, `src/auth/policy.ts`, runtime-control tests and security negative controls | Add the read-only reconcile path, preserve foreground enforcement and one-use ticket consumption, return fixed error codes, and expose bounded rate-limit timing only through `Retry-After`. |
| Web transport/state | `apps/pi-remote-web/src/relay.ts`, `src/runtime.ts`, new `src/runtime-issues.ts` | Fetch the snapshot, normalize transport failures, add hydrate triggers, synchronous in-flight locking, the 10-second deadline, and the complete state machine. |
| Web effort UI | New `src/effort.ts`, `src/EffortRadioGroup.tsx`, `src/ModelEffortSheet.tsx`; changes to `src/SessionHeader.tsx`, `src/RuntimeStrip.tsx`, `src/SessionComposer.tsx`, and `src/App.tsx` | Build one controlled sheet and one radio group; wire both entry points to it; keep confirmed state and model controls host-authoritative. |
| Web styling/a11y | `apps/pi-remote-web/src/style.css`, `apps/pi-remote-web/tests/contrast.test.tsx`, new sheet/radio tests | Implement the fixed visual system, responsive sheet, focus/read-only semantics, live-region behavior, reduced motion, and contrast/reflow checks. |
| Verification | `apps/pi-remote-web/tests/runtime.test.tsx`, `RuntimeStrip.test.tsx`, new `ModelEffortSheet.test.tsx`/`EffortRadioGroup.test.tsx`, relay runtime/security tests, real-iPhone test script | Prove protocol, request counts, state transitions, redaction, plan-mode isolation, keyboard/touch behavior, and light/dark 390px screenshots. |

Dependencies are limited to the existing Pi RPC commands, loopback relay, authenticated session, foreground sync socket, React Aria Components, and the existing design tokens. No new authority, storage, third-party UI primitive, or host capability is required for v1.
