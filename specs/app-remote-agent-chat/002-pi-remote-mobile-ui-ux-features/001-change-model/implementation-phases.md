# F1 — Change the active AI model: implementation phases

The work is ordered around the authority boundary first, then the complete functional replacement, then interaction and visual hardening. Each phase is independently verifiable and can be released at its own boundary: Phase 1 preserves the current visible picker while hardening its path, Phase 2 replaces it with the complete functional sheet, and Phase 3 is the final iPhone/accessibility/visual release gate.

## Phase 1 — Protocol, redaction, and bound runtime authority

### Objective

Make the model catalog and mutation contract build-ready without changing the visible picker yet. The existing web control must remain usable, but every model mutation must already use the new exact-target, two-revision, one-use authority path.

### Scope

- Expand the protocol DTOs and guards.
- Project only host-authoritative, bounded model metadata.
- Add catalog revision and streaming capability.
- Add a runtime-specific bound-ticket issuance path.
- Make the relay reject mismatched, stale, unauthorized, duplicate, and uncertain operations without retrying.
- Update the existing web relay client/runtime types to consume the expanded contract while leaving the nested picker as a temporary presentation layer.

### Concrete tasks

1. In `packages/pi-rpc-protocol/src/types.ts`, extend `AvailableModelDto` with the optional host-authored reasoning, input, context, token, tools, availability, reason-code, and pricing fields. Extend `RuntimeModelCatalogDto` with `catalogRevision`, `currentModel`, `streaming`, and `canSetModelWhileStreaming`. Add the model-ticket request contract and require `expectedCatalogRevision` for `set_model` control commands. Add bounded `policy_blocked` outcome data if needed by the existing outcome union.
2. In `packages/pi-rpc-protocol/src/guards.ts` and `packages/pi-rpc-protocol/src/index.ts`, enforce exact object keys, bounded strings/numbers, path-free provider/model values, supported input/pricing/capability enums, non-negative revisions, and operation-specific required fields. Export every new public type and guard.
3. In `packages/pi-rpc-protocol/tests/guards.test.ts`, add valid fixtures and negative fixtures for unknown keys, invalid reason codes, oversized metadata, fractional/negative revisions, missing catalog revision on `set_model`, and malformed ticket requests.
4. In `apps/pi-remote-relay/src/store/redaction.ts`, update `projectAvailableModel` and `projectRuntimeModelCatalog` to emit only the declared allowlist. Bound the catalog, omit unavailable metadata rather than infer it, and ensure raw pi objects and raw error strings cannot cross the relay.
5. In `apps/pi-remote-relay/src/runtime/runtime-service.ts`, maintain a monotonic catalog revision, publish the expanded catalog, retain the host-confirmed current model even when retired, expose host streaming/capability state, and validate target plus runtime/catalog revisions before `set_model`. Preserve idempotent control IDs and terminal delivery-unknown behavior.
6. In `apps/pi-remote-relay/src/auth/auth-service.ts`, add an in-memory runtime-ticket binding containing the authenticated session/principal, action, session ID, exact target, both revisions, and expiry. Consume it once and reject altered or replayed bindings. Do not persist or log the binding.
7. In `apps/pi-remote-relay/src/auth/policy.ts`, authorize only the new runtime-ticket issuance action needed by the model path. Do not broaden prompt, approval, extension, plan, or full-access permissions.
8. In `apps/pi-remote-relay/src/http/server.ts`, add `POST /api/runtime/ticket`, validate its body, authenticate the application session, require a foreground device, recheck the fresh host catalog, apply a short TTL/rate limit, and bind the resulting ticket. Update `/api/runtime/control` to consume and compare the bound ticket before calling `RuntimeService.control`. Update `actionForRequest` and bounded outcome status mapping.
9. In `apps/pi-remote-relay/tests/runtime-control.test.ts`, `apps/pi-remote-relay/tests/auth.test.ts`, and `apps/pi-remote-relay/tests/security/negative-controls.test.ts`, cover exact target/revision checks, ticket replay, target substitution, foreground loss, stale catalog, policy denial, lifecycle loss, host rejection, transport failure, and zero automatic retries. Add a focused runtime-ticket test file if the existing fixtures become unclear.
10. In `apps/pi-remote-web/src/relay.ts`, add the model-ticket request/submit flow and validate the expanded catalog/response guards. In `apps/pi-remote-web/src/runtime.ts`, pass both revisions and the exact provider/model target while preserving the existing non-optimistic committed state.

### Security posture review

This phase crosses the mutation posture and must receive an explicit security review before the new route is enabled outside tests. Review the ticket binding, action authorization, foreground check, revision comparison, target equality, one-use consume ordering, rate limit, error redaction, and negative controls. A green typecheck is not sufficient for this review.

### Verification gate

All of the following must pass:

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- A true-390px CDP capture of the still-visible model control in light and dark: use CDP `Emulation.setDeviceMetricsOverride` with `width: 390`, `deviceScaleFactor: 1`, and mobile emulation, then `Page.captureScreenshot`; do not use a desktop screenshot merely resized in an editor. The screenshot proves no incidental layout regression while the presentation remains unchanged.
- A source/status sweep proves only the two requested spec files are created/changed by this documentation task and no generated artifact is included in the phase patch.

### Acceptance

- The expanded DTO/catalog passes positive and negative protocol guard tests.
- `/api/runtime/models` remains read-only and returns no raw host fields.
- A model ticket cannot be issued for an unknown target, cannot be consumed by another session/device, cannot be replayed, and cannot be used with changed target or either revision.
- The existing picker’s model switch still results in a host-confirmed response through the bound path; no optimistic header change is introduced.
- A stale, rejected, or delivery-unknown result produces one settled response and zero automatic retries.
- Existing auth, policy, foreground, redaction, plan-mode, and rate-limit tests remain green.

## Phase 2 — Functional model switcher sheet and state machine

### Objective

Replace the nested picker with the complete functional bottom sheet: fresh catalog browsing, provider grouping, search, draft selection, explicit commit, every terminal state, and host reconciliation. This phase is a usable end-to-end feature even before the final motion and device polish.

### Scope

- Build the model catalog helpers and RAC sheet.
- Separate host-confirmed state from draft selection.
- Implement fresh-open, refresh, foreground, offline, unreachable, access-denied, streaming, stale, rejection, and delivery-unknown states.
- Preserve thinking effort as a separate sibling control.
- Add functional styling sufficient for a readable 320–430px sheet and a complete basic test fixture.

### Concrete tasks

1. Add `apps/pi-remote-web/src/model-catalog.ts` with `modelKey`, provider grouping, current-provider/current-model ordering, retired-current insertion, capability/availability projection, diacritic-insensitive matching, ID-prefix ranking, and deterministic locale-aware sorting. Keep it pure and independently testable.
2. Add `apps/pi-remote-web/src/ModelSwitcherSheet.tsx` using RAC `ModalOverlay`, `Modal`, `Dialog`, `Autocomplete`, `SearchField`, `ListBox`, and `ListBoxItem`. Implement the component tree in the feature spec, one dialog for every catalog size, in-place search at eight or more models, four skeleton rows, live status, inline errors, footer actions, and current/draft semantics.
3. Update `apps/pi-remote-web/src/SessionHeader.tsx` to replace the nested `Popover → Select → Popover` model path with `ModelTrigger` plus `ModelSwitcherSheet`. Keep the effort selector separately labelled and prevent it from sharing the model draft or ticket.
4. Update `apps/pi-remote-web/src/runtime.ts` to model confirmed state, draft key, catalog phase, request generation, abort/timeout, fresh-on-open, fresh-on-foreground, streaming gate, and all terminal outcomes. Keep the committed header model unchanged until the host response is `accepted`.
5. Update `apps/pi-remote-web/src/relay.ts` with a fresh catalog fetch that validates `catalogRevision`, `runtimeRevision`, current model, streaming, capability, and models. Ensure staging never calls the ticket endpoint; only `Switch model` invokes the bound ticket/control sequence.
6. Update `apps/pi-remote-web/src/App.tsx` to trigger reconciliation on visibility return and to pass the current session/connection/runtime state into the header sheet. Do not put catalog data, drafts, queries, or tickets in URL state or persistent cache.
7. Add the initial sheet styles in `apps/pi-remote-web/src/style.css`: full-width/capped sheet, scroll containment, readable rows, disabled/selected/current states, inline status, safe-area padding, and existing light/dark semantic tokens. Keep effort styling separate.
8. Add or update `apps/pi-remote-web/tests/model-catalog.test.ts`, `apps/pi-remote-web/tests/ModelSwitcherSheet.test.tsx`, `apps/pi-remote-web/tests/runtime.test.tsx`, and `apps/pi-remote-web/tests/App.test.tsx`. Cover all state-matrix branches, request-generation races, no-network staging, exact one-ticket/one-command commit, host-confirmed update, stale/no-retry, delivery-unknown reconciliation barrier, streaming capability, and foreground refresh.

### Security posture review

This phase wires a visible user action to a mutation and therefore requires a second security review before rollout. Confirm in the browser test and relay trace that a row activation cannot issue a ticket, only **Switch model** can do so, the ticket is target/revision-bound, and the header never treats a draft or pending result as host truth. Verify that offline, access-denied, stale, and delivery-unknown states leave no mutation path enabled.

### Verification gate

All of the following must pass:

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- A true-390px CDP capture of the sheet in light and dark using mobile device metrics (`width: 390`, `deviceScaleFactor: 1`) and `Page.captureScreenshot`. Capture at least `ready`, `staged`, and `committing`; the viewport must be 390 CSS pixels, not a resized desktop image.
- DOM assertions confirm one modal dialog, no nested picker overlay, correct listbox/option semantics, current/draft labels, and no horizontal overflow.

### Acceptance

- Opening always begins a fresh catalog read, and an old response cannot replace a newer response.
- Seven models render without search; eight models render search in the same dialog.
- Provider grouping and current-model ordering are deterministic; retired current and unavailable rows are visible with mapped reasons.
- Tapping or pressing Enter on a row changes only draft UI state and makes no network mutation.
- One activation of **Switch model** produces one target/revision-bound ticket and one control command; all dismissal and repeat controls are disabled while in flight.
- Accepted changes update the header only from host state, close the sheet, restore focus, and announce success.
- Stale, unavailable, policy-blocked, and delivery-unknown outcomes keep the confirmed model, show the correct inline/barrier state, and never retry.
- A running turn permits browse/stage but blocks commit unless the host capability permits it; next-turn text appears only after host confirmation.
- Foreground reconciliation, offline, unreachable, access-denied, keyboard, and Escape/search-clear paths are all covered by automated tests.

## Phase 3 — iPhone interaction, accessibility, visual, and release hardening

### Objective

Make the functional sheet feel native on an installed iPhone PWA and close the final accessibility, motion, responsive, redaction, and visual verification gaps without changing the authority model.

### Scope

- Header-only swipe dismissal, native list scrolling, backdrop/keyboard behavior, focus containment and restoration.
- WCAG AA focus/contrast, 44px/48px targets, 320px/200% zoom, logical properties, bidirectional IDs, announcements, and message catalog.
- Visual-viewport/safe-area sizing, `viewport-fit=cover`, light/dark treatment, reduced motion, portrait/landscape, and software-keyboard behavior.
- Final security regression and release evidence.

### Concrete tasks

1. Update `apps/pi-remote-web/src/ModelSwitcherSheet.tsx` for RAC focus containment, initial current-row focus, focus restoration with `preventScroll`, `aria-controls`, live status, busy descriptions, Escape ordering, and modal dismissal rules. Add the header-only swipe threshold and prevent list scroll from dragging the sheet.
2. Update `apps/pi-remote-web/src/SessionHeader.tsx` for the final trigger accessible name, expanded state, optional plan-mode badge, and separate effort sibling semantics. Ensure the trigger remains the focus restoration target after accepted close.
3. Update `apps/pi-remote-web/src/style.css` for the fixed bone/carbon/clay tokens, AA accent usage, two-pixel focus ring/offset, 24px sheet radius, 36×4px grabber, 92% visual-viewport cap, safe-area padding, `overscroll-behavior-y: contain`, logical properties, two-line labels, LTR isolated IDs, reduced-motion rules, and 320/390/430px reflow.
4. Update `apps/pi-remote-web/index.html` with `viewport-fit=cover` and verify the sheet uses RAC’s visual-viewport height rather than raw `100vh`. Do not add a second body scroll lock.
5. Add/update message-catalog support for every sheet label, state, reason-code mapping, count announcement, success announcement, and reconcile barrier. Keep provider/model strings as data, not translation keys or URL fragments.
6. Extend `apps/pi-remote-web/tests/ModelSwitcherSheet.test.tsx`, `apps/pi-remote-web/tests/App.test.tsx`, and `apps/pi-remote-web/tests/contrast.test.tsx` with focus, keyboard, live-region, 200% zoom, reduced-motion, no-horizontal-scroll, token/contrast, and no-storage/no-logging assertions.
7. Run the installed-PWA manual pass in portrait and landscape with the software keyboard open, plus VoiceOver, Switch Control, Full Keyboard Access, foreground/background, offline, stale, rejected, and delivery-unknown scenarios. Record only redacted evidence.
8. Re-run the relay/protocol security and negative-control suites, confirm service-worker caches contain no model/ticket data, and perform the final diff/no-stray-file sweep.

### Security posture review

No new authority is introduced in this phase, but it must pass a security regression review because interaction changes can accidentally reopen dismissal, retry, storage, or logging paths. The review must confirm the Phase 1/2 ticket and revision checks are unchanged and that visual/device instrumentation captures no sensitive values.

### Verification gate

All of the following must pass:

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- True-390px CDP screenshots in both light and dark with `Emulation.setDeviceMetricsOverride({ width: 390, deviceScaleFactor: 1, mobile: true })` and `Page.captureScreenshot`; include `ready`, `searching`, `staged`, `streaming_blocked`, and `delivery_unknown` evidence where the state is reachable.
- CDP checks at 320px and 200% zoom prove `scrollWidth <= clientWidth`; reduced-motion emulation proves transforms/spinners are removed; computed styles prove targets and focus ring sizes.
- Manual installed-PWA checks pass in portrait and landscape with the software keyboard open, including VoiceOver, Switch Control, Full Keyboard Access, header-only swipe dismissal, native list scrolling, foreground reconciliation, and no edge-navigation interception.
- `git diff --check`, repository type/tests, and a no-stray-files sweep show only intentional implementation/spec changes and no captured ticket, raw payload, or screenshot with sensitive content.

### Acceptance

- The sheet opens, searches, stages, commits, dismisses, and reconciles without focus loss on a real 390px mobile viewport.
- All controls and rows meet the minimum target sizes; 320px and 200% zoom have no horizontal scroll.
- Light and dark states use the fixed semantic palette and pass contrast/focus checks; clay is never the sole small-text/UI-state signal.
- Reduced-motion users receive the same state information without transform, spring, stagger, or spinning-indicator motion.
- Installed-PWA safe-area, visual-viewport, portrait, landscape, and software-keyboard layouts do not clip the sheet or footer.
- VoiceOver, Switch Control, Full Keyboard Access, and hardware keyboard users can open, navigate, stage, cancel, and explicitly switch without committing from row activation.
- No sensitive ticket, raw payload, provider/model ID, query, or host error appears in logs, analytics, URLs, persistent storage, service-worker caches, or visual evidence.
- Final release evidence contains clean typecheck, tests, security review, and true-390px light/dark CDP screenshots.
