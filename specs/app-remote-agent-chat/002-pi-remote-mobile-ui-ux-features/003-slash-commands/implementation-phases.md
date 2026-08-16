# F3 — Implementation phases

This plan delivers the synthesis decision in dependency order. There are four phases: the secure authority contract, the shared client command engine, the inline surface, and final explicit-send/PWA hardening. Each phase is independently verifiable and can ship without relying on an unfinished later phase; later phases add capability on top of a stable earlier boundary.

Every phase has the same release gate: repository typecheck, targeted tests, the full relevant web/relay test suite, and a true 390 CSS-pixel CDP screenshot in both light and dark themes. A screenshot at a scaled desktop viewport does not satisfy the 390px gate.

## Phase 1 — Versioned catalog authority and fail-closed submission

### Objective

Make the real host catalog and slash-aware submission contract explicit, bounded, session-scoped, and revision-checked while leaving the current `+` browser and ordinary prompt flow usable. This phase establishes the security boundary that all client work consumes.

### Scope

- Evolve the existing `CommandCatalogDto` semantics to carry host epoch, session identity, session revision, and catalog revision.
- Preserve only authoritative descriptor fields and make optional aliases/argument hints opt-in protocol fields.
- Keep `/api/commands/list` read-only and relay-filtered.
- Make slash-command submission revalidate the current effective catalog before Pi forwarding, using one-use ticket and expected identity/revision values.
- Preserve ordinary prompt submission behavior and current UI compatibility until the inline surface is enabled.

### Concrete tasks

- `packages/pi-rpc-protocol/src/types.ts`: define or evolve the catalog DTO; add the selected binding and slash-aware expected-revision submission shape; document which fields are optional and authoritative.
- `packages/pi-rpc-protocol/src/guards.ts`: strictly validate host/session/catalog identity, bounded descriptor strings, optional metadata, slash submission fields, canonical-name constraints, and reject unknown/incompatible shapes.
- `packages/pi-rpc-protocol/src/index.ts`: export the new types and guards without widening unrelated RPC commands.
- `packages/pi-rpc-protocol/tests/guards.test.ts`: add valid, malformed, cross-session, unknown-field, control-character, bidi-override, oversized, and stale-shape fixtures.
- `apps/pi-remote-relay/src/store/redaction.ts`: extend the explicit command projector to emit only the approved fields, apply bounded caps, reject unsafe names, and never pass raw Pi data to the browser.
- `apps/pi-remote-relay/src/commands/command-service.ts`: track host epoch/session/catalog revisions, replace complete snapshots, retain the safe-name filter, expose current effective availability, and provide a fail-closed revalidation operation for Send. Do not create a fallback catalog.
- `apps/pi-remote-relay/src/http/server.ts`: keep `/api/commands/list` authenticated as `commands:list`; validate the slash-aware `/api/prompt/submit` envelope; consume the ticket once; return distinct stale/denied/incompatible outcomes without leaking host details.
- `apps/pi-remote-relay/src/prompt/prompt-service.ts`: accept expected identity/revision values, check them before `supervisor.send`, and never map a slash command to `steer` or `followUp` implicitly.
- `apps/pi-remote-relay/src/auth/policy.ts`: verify the catalog read action and prompt submit action remain separately authorized and that no new mutation action is introduced.
- `apps/pi-remote-relay/src/index.ts`: wire the real host epoch and session state into `CommandService` and `PromptService`; ensure `agent_start`/settled transitions invalidate or advance effective availability as appropriate.
- `apps/pi-remote-relay/tests/commands.test.ts`, `tests/prompt.test.ts`, `tests/security/negative-controls.test.ts`, and relevant HTTP/integration fixtures: cover redaction, privileged filtering, revision races, one-use tickets, ordinary prompt compatibility, and zero-Pi-call stale/denied paths.
- `apps/pi-remote-web/src/relay.ts`: parse the versioned catalog and slash-submit responses through protocol guards while retaining the current ordinary `submitPrompt` API for the existing composer.

### Verification gate

- `npm run typecheck`
- `npx vitest run packages/pi-rpc-protocol/tests apps/pi-remote-relay/tests`
- `npm run test:web`
- Start the existing app/fixture and capture the unchanged composer and `+` browser at exactly 390 CSS px in light and dark through CDP. The baseline must show no layout regression, no new persistence, and no exposed privileged rows.

### Acceptance

- A real Pi `get_commands` response becomes one bounded, path-free, relay-filtered catalog with explicit host/session/catalog identity.
- A malformed, incompatible, cross-session, or stale catalog is rejected without rendering partial rows.
- Existing `+` insertion and ordinary prompt submission continue to pass their current tests.
- A slash-aware submission with a changed host/session/catalog revision is rejected before any Pi RPC; no automatic retry occurs.
- A valid explicit submission consumes exactly one ticket and forwards exactly one revision-checked prompt.
- Security review is required before this phase is merged: it changes protocol data, redaction, ticket consumption, prompt forwarding, and host/extension policy enforcement.

## Phase 2 — Shared in-memory catalog and deterministic command engine

### Objective

Give both command-discovery routes one client-side source of truth and one pure interaction model. The phase makes catalog lifecycle, trigger parsing, ranking, insertion, and revision binding independently testable before the new panel is layered onto the composer.

### Scope

- Replace the one-shot `useCommands` behavior with a session-scoped in-memory catalog lifecycle.
- Add pure trigger, ranking, insertion, binding, and stale-state logic.
- Move the existing `+` browser onto the shared catalog/ranking/insertion path without changing its visual surface yet.
- Keep all filtering local and all command execution out of this phase’s selection reducer.

### Concrete tasks

- `apps/pi-remote-web/src/commands.ts`: evolve or split into `useHostCommandCatalog`, catalog state/revalidation helpers, and the shared command types. Scope snapshots by auth epoch and session; share in-flight requests; use `AbortController` and a monotonic request ID; commit only matching responses; keep state in memory.
- `apps/pi-remote-web/src/rankHostCommands.ts`: implement Unicode/case/diacritic normalization and the exact deterministic rank tiers, host-order tie-break, disabled-row handling, active-name retention, and matching-grapheme ranges.
- `apps/pi-remote-web/src/useSlashTrigger.ts`: derive trigger range/query from draft, caret, selection, focus, Escape latch, and IME state. Keep transport and filtering out of this hook.
- `apps/pi-remote-web/src/insertSlashCommand.ts`: implement complete-token replacement, synchronous controlled-draft update, caret placement, focus restoration, local revision binding, and the “Not sent” announcement event. Expose the same reducer to inline and `+` routes.
- `apps/pi-remote-web/src/CommandPalette.tsx`: consume the shared catalog and insertion reducer; use canonical names and the shared ranking; retain no independent fetch or inferred metadata.
- `apps/pi-remote-web/src/SessionComposer.tsx` and `src/App.tsx`: pass the current session/connection/epoch context to the shared engine without rendering the inline panel yet; ensure ordinary text behavior is unchanged.
- `apps/pi-remote-web/src/relay.ts`: add the guarded catalog lifecycle calls and error classes needed to distinguish unavailable, forbidden, incompatible, and stale responses.
- Add `apps/pi-remote-web/tests/rankHostCommands.test.ts`, `useSlashTrigger.test.ts`, `insertSlashCommand.test.ts`, and catalog lifecycle tests; update `CommandPalette.test.tsx` and relevant `App.test.tsx` fixtures.

### Verification gate

- `npm run typecheck`
- `npx vitest run apps/pi-remote-web/tests/CommandPalette.test.tsx apps/pi-remote-web/tests/rankHostCommands.test.ts apps/pi-remote-web/tests/useSlashTrigger.test.ts apps/pi-remote-web/tests/insertSlashCommand.test.ts`
- `npm run test:web`
- Capture the existing `+` browser and composer at exactly 390 CSS px in light and dark through CDP. Confirm the catalog refresh does not displace the composer and the shared route has no visual regression.

### Acceptance

- A live session prefetches one catalog, shares it between inline-ready state and `+`, and stores no catalog or binding in browser persistence.
- Out-of-order responses, session changes, host-epoch changes, aborts, and foreground/reconnect refreshes cannot overwrite the current scoped snapshot.
- Ranking fixtures produce the specified order and never autocorrect a typo.
- The `+` browser inserts exactly the same canonical string and binding as the future inline route, with zero ticket or host execution.
- Unit tests prove trigger parsing is independent from transport/filtering and that editing the command token clears the binding while editing arguments retains it.
- This phase remains read-only: no new host mutation path is opened.

## Phase 3 — Inline terminal-style autocomplete surface

### Objective

Ship the user-facing inline experience: a nonmodal, keyboard- and touch-operable list above the existing textarea with the complete state model, accessible relationships, and mobile-safe layout.

### Scope

- Render inline completion only for the exact leading-slash predicate.
- Keep DOM focus and editing in the one existing textarea; use virtual focus for rows.
- Implement all loading, ready, refreshing, empty, error, disabled, committing, and drafted states.
- Implement keyboard, touch, IME, outside-tap, Escape, `+` mutual exclusion, visual-viewport anchoring, safe-area, light/dark, reduced-motion, and responsive text behavior.
- Use the Phase 2 catalog/ranking/insertion engine and the Phase 1 protocol boundary; do not add a client fallback.

### Concrete tasks

- `apps/pi-remote-web/src/ComposerCommandAutocomplete.tsx`: compose React Aria `Autocomplete`, existing `TextArea` relationship, nonmodal `Popover`, `ListBox`, virtual active option, status announcements, Retry affordance, and state-specific presentation. Keep the implementation isolated so the React Aria version can be replaced if iOS VoiceOver exposes a regression.
- `apps/pi-remote-web/src/CommandOption.tsx`: render one text-only row with canonical isolated-LTR name, authoritative hint/description/source/confirmation marker, match emphasis, disabled reason, and no nested interactive descendants.
- `apps/pi-remote-web/src/SessionComposer.tsx`: integrate the component above the composer shell, route Enter/primary action according to open-panel state, preserve native multiline behavior, and prevent panel interaction from submitting.
- `apps/pi-remote-web/src/useVisualViewportAnchor.ts`: calculate available height from `visualViewport` resize/scroll and orientation/foreground changes through `requestAnimationFrame`; keep the panel above the composer with no page displacement.
- `apps/pi-remote-web/src/style.css`: add semantic panel/row/active/disabled/status styles, logical properties, 44px/56px targets, contained scrolling, `100dvh`, safe-area boundaries, no-displacement anchoring, dark tokens, increased-contrast focus, and reduced-motion rules. Preserve bone `#f8f8f6`, carbon ink, clay `#d97757`, Inter, and Source Serif 4.
- `apps/pi-remote-web/index.html` and existing app viewport helpers: verify `viewport-fit=cover`, zoom behavior, document locale direction, and the 16px textarea baseline.
- Add/update `apps/pi-remote-web/tests/ComposerCommandAutocomplete.test.tsx`, `SessionComposer.test.tsx`, `CommandPalette.test.tsx`, and `App.test.tsx` for every UI state, DOM relationship, key/pointer event, focus/caret result, no-submit guarantee, and shared-route behavior.
- Add accessibility assertions for the editor name, list label, active descendant, disabled option metadata, one atomic status region, and absence of nested focusable descendants.

### Verification gate

- `npm run typecheck`
- `npm run test:web`
- `npx vitest run apps/pi-remote-web/tests/ComposerCommandAutocomplete.test.tsx apps/pi-remote-web/tests/SessionComposer.test.tsx apps/pi-remote-web/tests/CommandPalette.test.tsx apps/pi-remote-web/tests/App.test.tsx`
- Use CDP at a true 390 CSS-pixel viewport to capture closed, loading, ready, filtered, disabled, no-match, and error/open states in both light and dark. Verify no transcript/composer displacement, no page horizontal scroll, and visible keyboard-safe composer anchoring.

### Acceptance

- Typing `/` at index zero opens the panel within one rendered frame; every invalid trigger case remains closed.
- Filtering is immediate and local; the panel shows the specified ranking, host order, descriptions, hints, source text, confirmation marker, and disabled reasons without unsafe strings.
- Enabled tap, Enter, and Insert action each insert once, retain textarea focus, place the caret after the trailing space, close the panel, announce “Not sent,” and make no network request.
- Arrow keys, Tab, Escape, Shift+Enter, outside tap, scrolling, long press, pointer/mouse compatibility handling, and IME behavior match the interaction table.
- All UI states in the feature spec have objective DOM assertions and no state accidentally enables submission.
- At 390px light/dark and 320px/200% text, the panel meets target sizes, safe-area/visual-viewport constraints, WCAG contrast, and no-displacement requirements.
- The existing `+` browser and inline panel are mutually exclusive and remain backed by one shared catalog and insertion reducer.

## Phase 4 — Explicit Send integration and iPhone/PWA hardening

### Objective

Connect drafted slash bindings to explicit Send, handle revision races and running-state policy in the real session, and close the physical-iPhone/PWA release bar for a partial feature that is safe to ship.

### Scope

- Add client-side slash-submit orchestration over the Phase 1 relay contract.
- Make primary Send, ordinary Enter, running state, offline state, reconnect, foregrounding, and catalog refresh consult slash state correctly.
- Preserve drafts on stale/denied outcomes and never retry automatically.
- Complete locale direction, bidi/control safety, visual-viewport, keyboard-language, rotation, PWA foreground, VoiceOver, and reduced-motion hardening.
- Run final security, accessibility, performance, CDP, and physical-device verification.

### Concrete tasks

- `apps/pi-remote-web/src/submitSlashDraft.ts`: resolve the leading token against the current catalog, require the current binding, gate on live host/session state, request one ticket, submit expected revisions, and map stale/denied/incompatible/delivery-unknown outcomes without clearing the draft or retrying.
- `apps/pi-remote-web/src/relay.ts`: add the explicit slash-submit call/response parsing while keeping ticket creation and prompt submission observable in tests as exactly one request each for a valid Send.
- `apps/pi-remote-web/src/App.tsx`: pass host epoch/session revision/catalog revision and effective running/plan availability into `SessionComposer`; revalidate on session and connection transitions; keep transcript optimistic behavior only after the explicit submission path accepts the command.
- `apps/pi-remote-web/src/SessionComposer.tsx`: make the primary action show bounded revalidation progress, preserve the drafted message, distinguish local Insert from Send, disable slash Send when running-state authority is unavailable, and keep ordinary non-slash Send behavior unchanged.
- `apps/pi-remote-web/src/commands.ts` and `src/state.ts`: implement refreshing/stale-offline/forbidden/incompatible transitions, clear bindings on identity changes, and revalidate on foreground return when the snapshot exceeds 30 seconds.
- `apps/pi-remote-web/src/style.css`, `src/useVisualViewportAnchor.ts`, and `index.html`: finish `100dvh`, `viewport-fit=cover`, safe-area, rotation, keyboard-language, visual-viewport, high-contrast, reduced-motion, and focus-retention handling in installed-PWA mode.
- Add/update `apps/pi-remote-web/tests/submitSlashDraft.test.ts`, `App.test.tsx`, `SessionComposer.test.tsx`, relay integration tests, and `apps/pi-remote-relay/tests/security/negative-controls.test.ts` for exact ticket/request counts, stale races, denied rows, running state, plan enforcement, and draft preservation.
- Add the release checklist for physical iPhone testing: VoiceOver, Voice Control, Switch Control, Full Keyboard Access, Bluetooth keyboard, IME, zoom, rotation, background/foreground, offline/reconnect, light/dark, and reduced motion.

### Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- Run the complete CDP matrix at a true 390 CSS-pixel viewport in light and dark, including keyboard-open, loading, filtered, drafted, revalidating, stale, denied, running, 320px/200% text, rotation, and foreground-return states.
- Complete the physical-iPhone installed-PWA checklist and record pass/fail evidence for each accessibility and keyboard behavior; a desktop emulation alone is insufficient.

### Acceptance

- A valid slash draft sends only after one fresh ticket and one revision-checked prompt request; the host sees the canonical command plus user arguments exactly once.
- A catalog/session/host revision race makes zero Pi calls, preserves the draft, clears the unsafe binding, refreshes the catalog, and asks for reselection.
- Disabled, hidden, malformed, unknown, stale, forbidden, incompatible, and delivery-unknown paths fail closed with no automatic retry or send-as-text fallback.
- A running turn never causes a slash command to become steer/follow-up implicitly; missing authoritative running-state availability disables slash Send.
- Foreground/reconnect/session switches cannot display another session’s rows or retain another session’s binding.
- Installed-PWA screenshots and physical-device checks pass at true 390px in light and dark, with no page horizontal scroll, keyboard obstruction, focus loss, unsafe zoom behavior, or accessibility-tree regression.
- Security review signs off on the final client-to-relay execution path, including ticket use, expected revisions, redaction, plan-mode enforcement, and telemetry/storage inspection.
