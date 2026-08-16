# Change effort / reasoning level — implementation phases

The work is split into four independently shippable vertical slices. Each phase ends with the same proof gate: typecheck, the relevant automated tests plus the full repository suites, and a true 390px CDP screenshot in both light and dark themes. A phase is not shippable when the screenshot is merely a desktop window narrowed to 390px, when the browser reports horizontal overflow, or when a failure path lacks a test.

## Phase 1 — Typed host snapshot, reconciliation, and redacted outcomes

### Objective

Give the relay and protocol one safe, read-only way to rehydrate model, effort, streaming, mode, revision, and advertised levels, while replacing arbitrary runtime failure text at the browser boundary with bounded issue codes. Existing runtime controls remain usable throughout the rollout.

### Scope

Protocol and relay only, plus the smallest web transport adapter required to keep the current UI compiling against the new response shapes. No new effort visual surface is introduced in this phase.

### Concrete tasks

- `packages/pi-rpc-protocol/src/types.ts`
  - Add a `RuntimeSnapshotDto` containing the authoritative `RuntimeStateDto` and `RuntimeModelCatalogDto` for one session.
  - Add bounded runtime issue-code constants/types for `unsupported`, `host-unavailable`, `foreground-required`, `rate-limited`, `delivery-unknown`, `invalid-response`, and local `offline` mapping.
  - Make runtime control failure variants carry an issue code rather than a browser-visible arbitrary reason string. Keep accepted and stale responses bound to host state snapshots.
- `packages/pi-rpc-protocol/src/guards.ts` and `src/index.ts`
  - Add exact-key guards and public exports for the snapshot and issue codes.
  - Reject unknown issue codes, extra keys, unbounded strings, invalid revisions, invalid levels, and snapshots whose session IDs do not match.
- `packages/pi-rpc-protocol/tests/guards.test.ts`
  - Cover valid three-, five-, and seven-level snapshots, issue-code outcomes, unknown IDs, and malformed/extra-key payloads.
- `apps/pi-remote-relay/src/store/redaction.ts`
  - Keep runtime projection allowlisted and bounded. Ensure unknown thinking IDs can remain internal values without echoing arbitrary labels or reasons into a user-facing field.
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`
  - Add a read-only snapshot hydrate that reads state, levels, and models together, preserves Pi’s advertised order/subset, and deduplicates concurrent hydrate calls.
  - Map host rejection, unsupported capability, and ambiguous transport failures to the typed issue codes. Do not return raw Pi/RPC error text to the browser contract.
  - Preserve revision checks, control-ID idempotency, lifecycle invalidation, and the existing settled mutation lane.
- `apps/pi-remote-relay/src/http/server.ts` and `src/auth/policy.ts`
  - Add `POST /api/runtime/reconcile` as a read-only `runtime:read` operation. It consumes no mutation ticket and forwards no intent.
  - Return the typed snapshot on success and a fixed machine error code on failure. Keep `/api/runtime/state`, `/api/runtime/models`, and `/api/runtime/control` compatible during rollout.
  - Return a bounded `Retry-After` header for runtime rate limiting. Do not expose host response bodies.
- `apps/pi-remote-relay/tests/runtime-control.test.ts`, `tests/security/negative-controls.test.ts`, and a focused reconcile test if needed
  - Prove atomic read hydration, no mutation/ticket consumption for reconcile, exact foreground enforcement, issue-code mapping, raw-reason absence, and no plan-mode side effect.
- `apps/pi-remote-web/src/relay.ts`
  - Add snapshot fetching and a transport-error normalizer that preserves status/retry metadata internally but never returns raw bodies or server reasons as UI copy.
  - Update the current runtime response adapter so the existing controls remain type-safe while the new contract rolls out.

### Verification gate

- `npm run typecheck` exits 0.
- `npm test` and `npm run test:web` exit 0, including protocol guards, relay runtime/security tests, and existing web runtime tests.
- Start the web app against the fixture relay and capture the current session view at exactly 390 CSS px through CDP in light and dark themes. Confirm the current UI has no new overflow, no raw runtime issue text, and no changed Build/Plan behavior.

### Acceptance

- A reconcile request returns one redacted, guarded snapshot containing host order/subset, current confirmed value, streaming, mode, model, and revision.
- Reconcile never requests or consumes a mutation ticket and never calls `set_thinking_level`.
- Runtime control responses and HTTP failures contain only bounded machine/issue codes; raw host reasons and HTTP bodies are not browser-visible.
- Existing runtime control tests still prove stale revisions fail closed, duplicate control IDs do not send a second Pi command, and foreground authority is required.

This phase crosses the security boundary because it changes the protocol and relay response contract. Review the issue-code allowlist, endpoint policy, redaction projection, and ticket behavior before merging.

## Phase 2 — Complete runtime state machine and mutation boundary

### Objective

Make the web runtime hook enforce the synthesis lifecycle before the new sheet is attached: confirmed state is never optimistic, every mutation has one guarded request, all failure states are recoverable and redacted, and rehydration occurs at the required moments.

### Scope

Web transport and runtime state only. The existing controls may still render their old surfaces, but they must use the hardened state and request path.

### Concrete tasks

- Add `apps/pi-remote-web/src/runtime-issues.ts`
  - Define the bounded local issue union and the complete local copy allowlist, including `Offline`, `Another device is controlling Pi.`, `Too many changes—try again shortly.`, `Pi is not ready to change effort.`, and delivery-unknown copy.
  - Provide formatters that accept only local catalog labels; never accept a host reason string for visible or assistive copy.
- `apps/pi-remote-web/src/relay.ts`
  - Route runtime hydration through `/api/runtime/reconcile` and validate `RuntimeSnapshotDto` before it enters React state.
  - Map offline, 403 foreground, 429 rate-limit, 503 host-unavailable, invalid payload, and abort/timeout conditions to bounded issue metadata. Parse only a bounded `Retry-After` delay.
  - Request a fresh ticket immediately before each runtime mutation and generate a unique control ID per attempt. Do not cache or persist either value.
- `apps/pi-remote-web/src/runtime.ts`
  - Expand the reducer to represent `checking`, `ready-adjustable`, `ready-off-only`, `ready-empty`, `streaming`, `pending`, `accepted`, `stale`, `unsupported`, `offline`, `foreground-required`, `rate-limited`, `host-unavailable`, `delivery-unknown`, and `inconsistent-state` behavior without duplicating the confirmed state.
  - Add a synchronous in-flight ref checked before dispatch so same-tick double taps cannot create two requests. Keep a separate pending operation/requested level.
  - Apply a cross-browser 10-second deadline to runtime mutations. A deadline is `delivery-unknown`; it clears no ticket, does not retry, and blocks further mutation until a read-only hydrate confirms state.
  - Reconcile once after stale/unsupported outcomes, automatically hydrate after connectivity returns, and require a new deliberate selection before mutating again.
  - Trigger read-only refresh on sheet-open callback, `document.visibilitychange` to visible, online recovery, and sync-connection transition to live. Deduplicate concurrent refreshes.
  - Keep model, effort, and mode mutation controls locked while any runtime mutation is pending. Do not change Build/Plan state as part of effort transitions.
- `apps/pi-remote-web/src/App.tsx`
  - Pass the session connection/live transition into the runtime hook or its refresh coordinator so sync reconnection is observable without coupling the hook to transcript state.
  - Mount one document-level polite atomic status region for runtime confirmations and failures.
- `apps/pi-remote-web/tests/runtime.test.tsx` and new transport/issue tests
  - Cover every reducer outcome, same-tick locking, exact one-request behavior, 10-second timeout, retry-after reconciliation, refresh triggers, no raw-copy leakage, and plan-mode isolation.
- Update `apps/pi-remote-web/tests/RuntimeStrip.test.tsx` so the existing control strip proves it disables on all non-ready authority states and never displays raw `error` text.

### Verification gate

- `npm run typecheck` exits 0.
- `npm test` and `npm run test:web` exit 0, including all Phase 1 protocol/relay tests and the expanded runtime state-machine tests.
- Run the existing web flow through CDP at exactly 390 CSS px in light and dark themes. Capture checking, ready, pending, streaming, offline, and delivery-unknown fixtures; confirm no horizontal overflow and no raw issue text in the DOM or accessibility tree.

### Acceptance

- The confirmed effort value never changes on `control-start`, timeout, unsupported, unavailable, or delivery-unknown.
- A selection creates one ticket/control ID/operation tuple; same-tick repeats and further input while pending are ignored.
- Streaming sends zero tickets and zero mutations. Idle re-enables only after a confirmed hydrate.
- Stale and unsupported cause one read-only reconcile and zero automatic mutation retries. Delivery-unknown remains terminal until a read-only read-back.
- Offline, foreground-required, rate-limited, host-unavailable, and invalid responses render only local bounded copy and recover according to the state table.

This phase crosses the security posture because it owns the browser’s last mutation gate. Review the in-flight ref, deadline classification, ticket timing, retry prohibition, and raw-error handling before merging.

## Phase 3 — Canonical sheet, effort rows, and shared entry points

### Objective

Replace the effort selects with the single build-ready surface and make the header and RuntimeStrip converge on one interaction path without changing the fixed design system.

### Scope

Effort catalog, React Aria components, sheet composition, triggers, responsive styling, and component-level behavior tests. Phase 2’s runtime state machine is the only mutation API used by the UI.

### Concrete tasks

- Add `apps/pi-remote-web/src/effort.ts`
  - Define the seven known IDs, exact visible labels/descriptions, localized template keys, safe unknown-ID ordinal formatting, and confirmed/pending trigger formatters.
  - Preserve host order and subset; do not add default, cost, rank, or raw host metadata to visible copy.
- Add `apps/pi-remote-web/src/EffortRadioGroup.tsx`
  - Implement a controlled React Aria `RadioGroup` with one row per advertised level, description association, confirmed check, requested-row spinner, `aria-busy`, and read-only event guards.
  - Accept confirmed level, available levels, runtime state, pending operation, issue state, and `onChange`; do not own committed model or effort state.
- Add `apps/pi-remote-web/src/ModelEffortSheet.tsx`
  - Retain the model picker and replace its nested effort `Select → Popover → ListBox` with `EffortRadioGroup`.
  - Support `initialSection="model" | "effort"`, controlled open state, one top-level Dialog/Popover, read-only hydrate on open, safe-area padding, internal scrolling, and pending dismissal.
- `apps/pi-remote-web/src/SessionHeader.tsx`
  - Remove the local model/effort nested-dialog implementation. Render the confirmed model and effort as separate spans and call the shared sheet controller with `initialSection="model"`.
- `apps/pi-remote-web/src/RuntimeStrip.tsx`
  - Replace the effort `Select` with the compact `Effort · {confirmed label}` trigger. Use the same sheet controller with `initialSection="effort"`; keep Build/Plan behavior separate and host-confirmed.
- `apps/pi-remote-web/src/SessionComposer.tsx` and `src/App.tsx`
  - Wire the RuntimeStrip trigger into the existing composer-adjacent control area without creating a second picker or mutation implementation.
  - Own one `ModelEffortSheet` instance per session view and pass the originating-trigger callback/focus target to both entry points.
- `apps/pi-remote-web/src/style.css`
  - Add radio-row, confirmed wash, accessible check, pending spinner, read-only, issue, sheet scroll, sticky heading, safe-area, 24–30px radius, and light/dark rules using existing tokens.
  - Keep the sheet at `min(92vw, 24rem)` and approximately `75dvh`; keep the existing parchment, Inter, Source Serif 4, and restrained motion language.
- Add/update `apps/pi-remote-web/tests/EffortRadioGroup.test.tsx`, `ModelEffortSheet.test.tsx`, `RuntimeStrip.test.tsx`, `App.test.tsx`, and any SessionHeader coverage.
  - Test canonical labels, order/subset, unknown IDs, all catalog edge states, one shared dialog, initial section, pending dismissal, keyboard selection, focus restoration, and exact callback/request routing.

### Verification gate

- `npm run typecheck` exits 0.
- `npm test` and `npm run test:web` exit 0, including protocol/relay security tests, runtime lifecycle tests, and all new sheet/radio DOM tests.
- Exercise the actual session view through CDP at exactly 390 CSS px in light and dark themes. Capture the closed view, Model-open view, Effort-open view with three levels, and seven two-line rows; confirm one dialog, no nested effort overlay, no horizontal overflow, and no clipped safe-area content.

### Acceptance

- Header and RuntimeStrip open the same controlled sheet and only differ in initial section.
- The effort group is a full-width radio-row list with the exact host order/subset, local explanations, 44px targets, and no raw unknown IDs.
- No local committed model or effort state exists in the sheet, header, or RuntimeStrip. Only the runtime hook can change confirmed state.
- Pending state shows the confirmed check unchanged, the requested-row indicator, `aria-busy`, read-only radios, and bounded status copy. Closing the sheet does not cancel the request.
- Streaming, empty, off-only, inconsistent, offline, foreground-required, rate-limited, host-unavailable, stale, unsupported, and delivery-unknown fixtures render the specified distinct states.

This phase exposes the hardened mutation path through new UI entry points. Review the trigger-to-hook wiring, event guards, and pending/dismissal behavior as a security-sensitive UI change.

## Phase 4 — Accessibility, visual hardening, and device proof

### Objective

Close the remaining quality risks at real mobile dimensions and prove the feature against the target bar: Claude iOS and Kimi Code interaction density without weakening Pi Remote’s fixed design or security posture.

### Scope

Final styling, accessibility and internationalization checks, contrast/reflow coverage, motion checks, CDP evidence, and a real standalone-iPhone pass. No new product behavior is introduced.

### Concrete tasks

- `apps/pi-remote-web/src/ModelEffortSheet.tsx` and `src/EffortRadioGroup.tsx`
  - Verify `aria-labelledby`, description associations, focus order, Escape restoration, read-only pending focus, one document-level status region, and no competing alert/live region.
  - Ensure host strings, issue codes, and raw IDs cannot become accessible names or announcements.
- `apps/pi-remote-web/src/style.css`
  - Verify 4.5:1 text contrast and 3:1 non-text contrast in bone/carbon themes; raw clay is never the sole selected/focus/pending signal.
  - Verify 320px, 390px, landscape, 200% zoom, large text, RTL, reduced motion, keyboard-open viewport, and `env(safe-area-inset-bottom)` behavior.
  - Keep browser text inflation enabled; remove transforms/pulses under reduced motion; retain the fixed font and color tokens.
- `apps/pi-remote-web/tests/contrast.test.tsx` and the sheet/radio tests
  - Add automated contrast and DOM assertions for selected, focused, pending, disabled, issue, light, and dark combinations.
  - Add fixtures for 320px/390px/430px, seven two-line rows, empty/off-only/inconsistent catalogs, and every failure state.
- Add or update the web CDP verification harness/fixture setup used by the project
  - Capture true viewport-width 390px light/dark screenshots for closed, model-open, effort-open, pending, streaming, offline, stale, and delivery-unknown states.
  - Assert no horizontal scroll, no clipped row, no hidden focus indicator, and no raw issue/ID canary in the DOM or accessibility tree.
- Run the manual standalone PWA pass on a real enrolled iPhone
  - Touch selection, press-cancel, Escape/Close where available, VoiceOver once-only announcements, foreground ownership, reconnect, streaming lock, delivery-unknown reconcile, light/dark, RTL, reduced motion, and keyboard/text inflation.
  - Confirm Plan mode remains host/extension enforced and that effort cannot approve tools or enable Build.
- Record only redacted test evidence. Do not place tickets, cookies, enrollment payloads, paths, secrets, raw host responses, or prompt text in screenshots, logs, or notes.

### Verification gate

- `npm run typecheck` exits 0.
- `npm test`, `npm run test:web`, and the contrast/accessibility suites exit 0.
- The CDP gate passes at a true 390px viewport in both light and dark themes for all listed states, with no horizontal overflow.
- Manual on-device verification passes on a real iPhone running the standalone PWA, including VoiceOver and the recovery paths.

### Acceptance

- All acceptance criteria in `spec.md` have a recorded automated or manual check result; no criterion is waived because the screenshot looks correct.
- VoiceOver announces pending, accepted, stale, and failure outcomes once, with no raw host text and no competing alert.
- The sheet is usable at 320px, 390px, 200% zoom, large text, RTL, reduced motion, light, dark, and safe-area conditions.
- A final security review confirms no new authority, no ticket leakage, no automatic replay, no optimistic commit, no plan-mode bypass, and no redaction regression.
- The shipped feature is limited to the synthesis decision; mid-turn semantics, defaults, cost metadata, adaptive widgets, and per-level host reasons remain explicitly deferred.

This phase still requires security sign-off because accessibility trees, screenshots, logs, and diagnostics are all data surfaces. Confirm redaction and plan-mode isolation before release.
