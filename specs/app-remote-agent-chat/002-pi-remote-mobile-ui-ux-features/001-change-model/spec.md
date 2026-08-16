<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# F1 — Change the active AI model

**One-line summary:** Replace the current nested model selector with one host-authoritative iPhone bottom sheet that lets a user browse and stage a model read-only, then commits only through an explicit, one-use, revision-bound **Switch model** action.

## DECISION

Replace the current nested `Popover → Select → Popover` implementation with one iPhone bottom sheet built from react-aria-components `Modal`, `Dialog`, `Autocomplete`, and grouped `ListBox` primitives. Opening, searching, and staging remain read-only. The mutation happens only after an explicit **Switch model** action, which obtains a one-use ticket bound to the target model and the current host runtime/catalog revisions. The confirmed header model remains unchanged until the host accepts the change. Stale, rejected, and delivery-unknown outcomes never retry automatically. Browsing and staging remain available during a running turn, but commit is disabled unless the host explicitly reports support for switching during streaming. Use the same sheet for every catalog size; show search at eight or more models.

Thinking effort remains a separately labelled sibling control. It is not a model variant and is never combined with `set_model` in one ticket or command.

## Problem and goal

Pi Remote already exposes a host-confirmed model label and a working `set_model` path, but the current selector nests a popover inside a select inside a popover and mutates as soon as a row is selected. That makes the mutation boundary easy to miss, gives large catalogs no search or provider structure, and leaves insufficient room for current-model, capability, streaming, and failure states.

The goal is a Claude iOS / Kimi Code-grade model switcher for an installable iPhone PWA:

- browsing, search, grouping, and staging are fast and read-only;
- the host remains the only source of truth;
- a model changes only after an explicit confirmation;
- every failure is visible, bounded, and recoverable without guessing or resending;
- the control remains usable at 320 CSS pixels, at 200% zoom, with VoiceOver, keyboard access, the software keyboard, portrait, and landscape;
- the existing ink-on-parchment design system, light/dark themes, WCAG AA target, and read-only-by-default security posture remain fixed.

## Current state

- `apps/pi-remote-web/src/SessionHeader.tsx` renders the centered host-confirmed model label and a nested RAC `DialogTrigger` / `Popover` / `Select` / `ListBox` flow.
- Selecting a model calls `setModel` immediately. There is no separate draft selection or explicit confirmation action.
- `apps/pi-remote-web/src/runtime.ts` already keeps the committed runtime state host-authoritative and represents pending, stale, error, and delivery-unknown outcomes without optimistic model text.
- `apps/pi-remote-relay/src/http/server.ts` exposes `/api/runtime/state`, `/api/runtime/models`, and ticketed `/api/runtime/control` routes.
- `apps/pi-remote-relay/src/runtime/runtime-service.ts` hydrates model and runtime state from pi, validates a model against the current catalog, checks the runtime revision, and treats uncertain delivery as terminal.
- `apps/pi-remote-relay/src/store/redaction.ts` emits a deliberately small model DTO containing provider, ID, and label.
- `packages/pi-rpc-protocol/src/types.ts` and `packages/pi-rpc-protocol/src/guards.ts` define and validate the current runtime/model contracts.
- The existing model catalog is flat and does not expose host-authored capabilities, availability reasons, a separate catalog revision, or an explicit streaming-switch capability.

## Desired end state

The session header has a single model trigger. Activating it opens a full-width bottom sheet, capped at 430px, with a labelled modal dialog, a current-model-aware grouped catalog, optional search, inline status, and a footer containing Cancel and Switch model.

The UI keeps two identities separate:

- **Confirmed model:** the model returned by the host and shown in the header. It does not change during staging or commit.
- **Draft model:** the row selected inside the sheet. It is local UI state and never consumes a ticket or sends a mutation.

The host returns a bounded catalog containing the current model, catalog revision, runtime revision, streaming state, explicit switching capability, and only authoritative model metadata. A dedicated runtime ticket is issued immediately before commit and is bound to the authenticated session, `set_model`, exact provider/model ID, expected runtime revision, expected catalog revision, and short expiry. The command is accepted only once and fails closed on any mismatch.

## In scope

- Replace the model selector with one RAC modal bottom sheet.
- Fresh catalog load on sheet open and foreground reconciliation.
- Provider grouping, deterministic ordering, current-model pinning, retired-current handling, capability hints, availability states, and optional price.
- Search for catalogs with at least eight models, using in-place RAC `Autocomplete` filtering.
- Explicit draft selection and **Switch model** confirmation.
- Runtime/catalog revision binding, one-use ticket binding, foreground enforcement, and exact target validation.
- Browsing and staging during a running turn; commit gating based on the host capability.
- Accepted, stale, rejected, unavailable, policy-blocked, access-lost, offline, unreachable, and delivery-unknown UI states.
- Keyboard, VoiceOver, Switch Control, Full Keyboard Access, focus restoration, reduced motion, safe-area, visual-viewport sizing, 320/390/430px reflow, and 200% zoom behavior.
- Redacted, host-authored model metadata and bounded reason-code mapping.
- Tests, DOM assertions, protocol/relay negative controls, and true-390px CDP screenshots in light and dark themes.

## Out of scope — v1 non-goals

- Changing the ink-on-parchment design system, typography, color tokens, light/dark themes, or WCAG AA target.
- Adding a new provider, model, host RPC method, or cloud API.
- Optimistic header updates, automatic retries, ticket reuse, or background mutation.
- Combining model selection with thinking effort, plan mode, prompt submission, approvals, or any other command.
- An `Auto`, `Default`, favorite, recent, or persistent-default model row.
- Inferring capabilities, availability, pricing, or model family from a provider/model name.
- Client-side provider credentials, raw host error display, raw host payload display, or local/persistent model history.
- A separate search popover, adaptive chip picker, nested picker, swipe-to-commit, double-tap commit, long-press commit, audio feedback, vibration, or haptic substitute.
- The fragile Dynamic Type measurement probe. Preserve rem scaling and 200% Page Zoom; a user-facing text-size setting is a separate feature.
- Changing the existing thinking-effort control except to keep it visibly and semantically separate from model switching.

## Host and protocol contract

The relay remains the browser’s only authority boundary. The browser never talks directly to pi.

### Model DTO

Extend the allowlisted model projection to this shape. Every field is optional only when the host cannot authoritatively provide it; omission is preferable to guessing.

```ts
type AvailableModelDto = {
  provider: string;
  id: string;
  label: string;
  reasoning?: boolean;
  input?: Array<'text' | 'image'>;
  contextWindow?: number;
  maxTokens?: number;
  tools?: boolean;
  availability?: 'available' | 'tier_locked' | 'policy_blocked';
  availabilityReasonCode?: string;
  pricing?: {
    currency: string;
    inputPerMillion?: number;
    outputPerMillion?: number;
  };
};
```

The relay must keep provider and ID values authoritative and exact for the command binding while rendering only bounded, path-free, sanitized DTO values. Labels are display text, never command identity.

### Catalog DTO

Extend `/api/runtime/models` so the response includes:

```ts
type RuntimeModelCatalogDto = {
  sessionId: string;
  catalogRevision: number;
  runtimeRevision: number;
  currentModel: AvailableModelDto | null;
  streaming: boolean;
  canSetModelWhileStreaming: boolean;
  models: readonly AvailableModelDto[];
};
```

`currentModel` is authoritative even when it is absent from `models`. `catalogRevision` increases for each accepted fresh catalog snapshot; `runtimeRevision` identifies the host runtime state used with that snapshot. `canSetModelWhileStreaming` is host-authored. A missing, false, or unknown capability disables commit while streaming.

### Bound model ticket and command

Use a runtime-specific ticket issuance request so a generic sync or prompt ticket cannot authorize a model change. The exact HTTP shape is:

```ts
POST /api/runtime/ticket
{
  sessionId: string
  expectedRevision: number
  expectedCatalogRevision: number
  operation: { type: "set_model", provider: string, modelId: string }
}
```

The relay authenticates the application session, requires a foreground sync socket, rechecks that the target is in the current host catalog, and issues a short-lived one-use ticket bound to all request fields and the `runtime:control` action. The client then sends one `POST /api/runtime/control` command:

```ts
{
  type: "runtime.control"
  controlId: string
  sessionId: string
  expectedRevision: number
  expectedCatalogRevision: number
  operation: { type: "set_model", provider: string, modelId: string }
  ticket: string
}
```

`expectedRevision` remains the runtime revision field used by the existing runtime contract; `expectedCatalogRevision` is required for `set_model` and is rejected when missing, malformed, or mismatched. The relay consumes the ticket exactly once, verifies that the command matches its binding, then calls the runtime service. A stale, rejected, unavailable, or delivery-unknown result is terminal for that command ID. No client or relay path resends it.

The existing effort control remains a sibling operation with its own explicit UI and ticketed path. It is not included in the model ticket or model command.

### Outcome contract

Keep the host-confirmed state in the response for acceptance and stale results. Use bounded reason codes for user-facing failure mapping; do not forward arbitrary host error strings.

- `accepted` returns the newly confirmed `RuntimeStateDto` and any host state needed to show a queued next-turn change.
- `stale` returns current host state and leaves the client responsible for a fresh user selection.
- `unavailable` means the target cannot be applied or the runtime is unavailable.
- `policy_blocked` means the host explicitly denied the target by policy.
- `delivery-unknown` means delivery cannot be proven; it is terminal until read-only reconciliation.

## Catalog organization and search

- Group by provider.
- Place the current model’s provider first. Sort other providers with locale-aware comparison.
- Place the current model first within its provider; sort remaining models with locale-aware comparison.
- If the current model is absent from the catalog, pin a disabled row labelled **Current · no longer available** before the available replacement rows.
- Keep tier-locked and policy-blocked models visible, disabled, and paired with an icon plus a plain-language mapped reason.
- Show only host-authored hints: context window, reasoning, vision/image input, tools, and optional price.
- Use `modelKey = `${encodeURIComponent(provider)}/${encodeURIComponent(id)}`` for React keys and draft identity. Never derive identity from a label or array index.
- Render a search field only when the authoritative catalog contains at least eight models. Do not open a second overlay.
- Filter label, provider, and ID with case- and diacritic-insensitive contains matching; boost ID-prefix matches.
- Configure the search input with `autoCapitalize="none"`, `autoCorrect="off"`, `spellCheck={false}`, and `enterKeyHint="search"`. Keep it at a minimum of 16px to prevent iOS focus zoom.
- The clear button clears the query and restores focus to the search field.
- The empty result is `No models match “{query}”.` and includes a Clear action.
- Announce `N of M models` politely without replacing the live-region node. Use `Intl.PluralRules` for the count.
- Use `useDeferredValue` for filtering so typing does not block sheet interaction.

## User-facing behavior

### Opening and layout

The header trigger is the current host-confirmed model label with an optional plan-mode badge. It has `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`, and the accessible name `Model, {label}, {provider}`. Activating it with a tap, Enter, or Space opens the single bottom sheet.

The sheet contains, in order:

```text
SessionHeader
├─ ModelTrigger
│  └─ host-confirmed model label + optional plan-mode badge
└─ ModelSwitcherSheet
   ├─ ModalOverlay
   └─ Modal
      └─ Dialog "Change model"
         ├─ SheetHeader: grabber, title, close button
         ├─ RuntimePolicyNotice
         ├─ ModelAutocomplete
         │  ├─ SearchField when catalog size ≥ 8
         │  └─ grouped ModelListBox
         ├─ CatalogStatePanel
         ├─ MutationStatus
         └─ MutationFooter: Cancel, Switch model
```

Thinking effort remains a separately labelled sibling control in the same overall runtime surface. It must not look like a model variant or share the model’s staged key.

Opening starts a fresh catalog request. A last-known in-memory list may remain visible while it refreshes, but the model action is disabled until the fresh response is accepted. Use an `AbortController`, an eight-second timeout, and a monotonically increasing request generation; an older response must never overwrite a newer response.

Initial focus goes to the current row, not the search field, so opening does not summon the iOS keyboard. `/` or Tab focuses search when it exists. Focus returns to the trigger with `preventScroll` after close.

### Selection and commit

1. Tapping, pressing Enter on, or otherwise activating a model row changes only `draftModelKey`.
2. A row activation consumes no ticket, sends no mutation request, and never changes the header.
3. The current row has a check, visible **Current** text, and `aria-current="true"`. The staged row has an outline, visible **Selected** text, and `aria-selected="true"`.
4. Selecting the current model leaves **Switch model** disabled.
5. **Switch model** is enabled only when the draft is a different available model, the fresh catalog is current, the runtime is known, the session is authorized and foregrounded, and streaming policy permits the commit.
6. Activating **Switch model** obtains exactly one bound ticket and submits exactly one command. Disable rows, Cancel, close, backdrop, Escape, and swipe dismissal while the request is genuinely in flight.
7. On `accepted`, replace the state from the host response, close the sheet, restore focus, and announce `Model switched to {label}.` The header may change only at this point.
8. On `stale`, hydrate the returned host state, clear the draft, keep the sheet open, and show `Host state changed. Choose again.` No ticket or command is retried.
9. On `unavailable` or `policy_blocked`, keep the confirmed model unchanged, show an inline mapped reason, disable the affected row when appropriate, and allow the user to choose another row.
10. On `delivery-unknown`, never resend and never present the target as current. Allow dismissal only after the terminal state is shown, but keep an assertive **Outcome unknown · Reconcile** barrier until a read-only refresh resolves the state.
11. When the PWA returns to the foreground, reconcile current model, runtime/catalog revisions, streaming, and catalog before allowing another mutation.

### Running turns

When the host reports streaming:

- browsing and staging remain available;
- if `canSetModelWhileStreaming` is false or unknown, the footer says **Available after the current turn** and commit is disabled;
- if the host explicitly supports the operation, commit follows the host’s reported behavior;
- show `queued_by_host` / **Next turn** only when the host response explicitly confirms a next-turn switch;
- the client never queues or simulates a next-turn change locally.

### Gestures and keyboard

- Swipe down dismisses only when the gesture begins on the grabber/header strip. Dismiss after more than 30% of sheet height or downward velocity of approximately 1200px/s; otherwise snap back.
- List scrolling never drags the sheet. Apply `overscroll-behavior-y: contain` to the list and keep native touch scrolling.
- Backdrop tap, close, and Escape dismiss before commit. During commit they do nothing until a terminal result or bounded delivery-unknown timeout.
- Do not intercept iOS edge navigation.
- Arrow keys, Home, and End move through the list. Enter stages the highlighted row and never commits.
- Tab reaches Cancel and Switch model. Only activating Switch model mutates.
- Escape clears a non-empty query first; otherwise it dismisses before commit.

## Complete UI state matrix

The state machine must expose the following states. The confirmed header model is unchanged in every state except after host acceptance.

| State               | List and row behavior                                                   | Footer, status, and dismissal                                       |
| ------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `closed`            | Sheet is not rendered.                                                  | Trigger shows the host-confirmed model.                             |
| `opening`           | Sheet shell plus four skeleton rows.                                    | Actions disabled.                                                   |
| `ready`             | Grouped catalog; current row has check and **Current**.                 | Switch disabled until a different available row is staged.          |
| `searching`         | In-place filtered provider groups.                                      | Polite result count; selection remains read-only.                   |
| `search_empty`      | No-results message plus Clear.                                          | Switch disabled.                                                    |
| `catalog_empty`     | **No models configured. Configure a provider on the host.**             | Switch disabled.                                                    |
| `refreshing`        | Readable in-memory list remains visible.                                | **Refreshing…**; mutation disabled.                                 |
| `offline`           | In-memory list remains browsable when present.                          | **You’re offline**; mutation disabled.                              |
| `unreachable`       | List may remain readable.                                               | Inline Retry; mutation disabled.                                    |
| `access_denied`     | Clear sensitive in-memory runtime data.                                 | **Access expired** plus reconnect action only.                      |
| `staged`            | Draft row outlined and **Selected**; confirmed row retains **Current**. | Cancel and Switch enabled if all commit gates pass.                 |
| `streaming_blocked` | Browsing and staging remain available.                                  | **Available after the current turn**; no automatic commit.          |
| `queued_by_host`    | Target row says **Next turn**.                                          | Only shown after explicit host confirmation.                        |
| `committing`        | Target busy; every row disabled.                                        | **Applying…**; close, scrim, Escape, and swipe disabled.            |
| `accepted`          | Host-confirmed row becomes current.                                     | Close and announce success.                                         |
| `stale`             | Returned host model becomes current; draft cleared.                     | **Host state changed. Choose again.**                               |
| `unavailable`       | Target disabled when applicable; confirmed model remains current.       | Inline reason; choose another model.                                |
| `policy_blocked`    | Target remains visible but disabled; confirmed model unchanged.         | **Blocked by host policy.**                                         |
| `delivery_unknown`  | No target is presented as current.                                      | Reconcile only; never Retry. Dismissal leaves a persistent barrier. |
| `retired_current`   | Pinned disabled current row plus available catalog.                     | User may stage an available replacement.                            |

## Accessibility, internationalization, and visual behavior

### Accessibility and internationalization

- Use RAC modal focus containment and background inertness. The sheet is a labelled modal dialog, not a nested select overlay.
- Use RAC `Autocomplete` combobox semantics and retain `listbox` / `option` semantics for the list.
- `aria-selected` represents the staged selection. The host-confirmed row additionally has `aria-current="true"` and visible **Current** text.
- A pending row has `aria-busy="true"` and an associated **Applying…** description.
- Keep an always-mounted `role="status" aria-live="polite"` region. Use an assertive alert only for access loss and delivery-unknown outcomes.
- Accessible row descriptions include label, provider, full ID, capabilities, availability, current state, and staged state.
- Triggers and buttons are at least 44×44px. Rows are at least 48px and grow for wrapped or enlarged text.
- Focus-visible styling uses a two-pixel AA-compliant ring with a two-pixel offset; a background tint alone is insufficient.
- Pass at normal and 200% zoom, at 320 CSS pixels, without horizontal scrolling.
- Use CSS logical properties. Render IDs with `dir="ltr"`, `translate="no"`, and `unicode-bidi: isolate`; labels follow document direction and may wrap to two lines.
- Keep all UI and announcement strings in the message catalog and use `Intl.PluralRules` for result counts.

### Visual and motion system

Preserve the fixed design system. The sheet uses these established semantic values:

| Token          | Light     | Dark      |
| -------------- | --------- | --------- |
| Page           | `#f8f8f6` | `#24221f` |
| Raised sheet   | `#ffffff` | `#2d2a26` |
| Primary ink    | `#24221f` | `#f8f8f6` |
| Muted ink      | `#6c6a65` | `#9f998f` |
| Clay identity  | `#d97757` | `#d97757` |
| AA text accent | `#8a452f` | `#f0b19a` |
| AA UI accent   | `#b85f42` | `#d97757` |
| Soft selection | `#f3e4de` | `#3a2720` |

Raw clay on bone is approximately 2.94:1. Never use it for small text or as the sole state indicator; pair semantic accent tokens with check, outline, icon, and text.

- Sheet width is the full viewport up to 430px; maximum height is 92% of RAC’s visual-viewport height.
- Top radius is 24px; grabber is 36×4px; bottom padding is `max(16px, env(safe-area-inset-bottom))`.
- Header title uses Source Serif 4 at approximately 22px. Controls, rows, captions, and IDs use Inter; IDs use tabular numerals.
- Entrance translates 36px to 0 and fades over 280ms with `cubic-bezier(0.32, 0.72, 0, 1)`. Backdrop fade is 180ms; exit is 220ms; accepted-header crossfade is 150ms.
- Under `prefers-reduced-motion: reduce`, remove transforms, springs, rubber-band animation, row staggering, and spinning indicators. Use a short opacity change or a static icon plus status text.
- Add `viewport-fit=cover` to the viewport meta tag. Size the sheet from RAC’s `--visual-viewport-height`, not raw `100vh`, and rely on RAC body scroll lock only.
- Do not add vibration or WebAudio feedback.

## Security and redaction requirements

The feature remains read-only by default. Listing, searching, and staging are read operations in the browser. Only the explicit **Switch model** action crosses the mutation boundary.

- `/api/runtime/models` and `/api/runtime/state` remain authenticated, bounded, and read-only. They never issue tickets and never call `set_model`.
- The runtime ticket is one-use, short-lived, bound to the authenticated session/principal, `runtime:control`, session ID, exact provider/model ID, expected runtime revision, expected catalog revision, and operation type. It is consumed before command execution and cannot be reused.
- The control route requires the foreground authenticated device, validates the ticket binding, checks both revisions, checks the target against the fresh host catalog, and fails closed on any mismatch.
- The runtime service remains the final host-authority gate. It validates host liveness, target availability, streaming capability, and current revision before calling pi.
- `set_model` is sent only once for one user activation. No stale, rejected, unavailable, timeout, or delivery-unknown outcome triggers a retry.
- Delivery unknown is terminal. The client must reconcile by read-only state/catalog refresh before another mutation and must not infer whether pi applied the command.
- Raw pi responses are projected through an allowlist in `apps/pi-remote-relay/src/store/redaction.ts`. Unknown fields, paths, secrets, credentials, arbitrary URLs, and raw error prose are dropped.
- Provider IDs and model IDs are bounded path-free tokens. They are never derived from labels, placed in URLs, used as DOM HTML, or logged. The command binding retains exact validated values only in the in-memory request path.
- Availability reason codes are allowlisted and mapped to static message-catalog strings. Do not render host-supplied reason prose.
- Do not write tickets, raw errors, host payloads, provider IDs, custom model IDs, search queries, or model catalog data to logs, analytics, URL query/path state, persistent web storage, IndexedDB, service-worker caches, screenshots, or telemetry.
- Do not cache model catalogs in the service worker. An in-memory last-known catalog is allowed only for browsing while a fresh read is pending; it cannot authorize mutation.
- Plan mode and host/extension policy remain enforced at the host boundary. This feature cannot grant tools, approvals, full access, or plan-mode changes.
- Rate limiting, session revocation, foreground checks, and existing relay redaction tests remain active. Any new runtime-ticket action must be included in the authorization policy and negative-control tests.

## Dependencies and affected areas

### Relay

- `apps/pi-remote-relay/src/http/server.ts`: add the runtime-ticket request path, bind/consume checks, action mapping, foreground enforcement, status mapping, and bounded error responses.
- `apps/pi-remote-relay/src/auth/auth-service.ts`: store and consume target/revision-bound one-use runtime tickets without exposing their bindings.
- `apps/pi-remote-relay/src/auth/policy.ts`: authorize the runtime-ticket action without broadening any other mutation family.
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`: publish catalog metadata/revisions, expose current host state and streaming capability, validate both revisions and exact target, and preserve terminal delivery-unknown behavior.
- `apps/pi-remote-relay/src/store/redaction.ts`: allowlist and bound model metadata, pricing, availability, and reason codes.
- Relay tests in `apps/pi-remote-relay/tests/runtime-control.test.ts`, `apps/pi-remote-relay/tests/auth.test.ts`, `apps/pi-remote-relay/tests/security/negative-controls.test.ts`, plus focused new runtime-ticket tests.

### Protocol

- `packages/pi-rpc-protocol/src/types.ts`: extend `AvailableModelDto`, `RuntimeModelCatalogDto`, the model control command, ticket request, and bounded runtime outcomes.
- `packages/pi-rpc-protocol/src/guards.ts`: enforce exact keys, bounded values, path-free provider/model tokens, numeric revision rules, capability enums, and operation-specific required fields.
- `packages/pi-rpc-protocol/src/index.ts`: export any new public types/guards.
- `packages/pi-rpc-protocol/tests/guards.test.ts`: add valid, malformed, unknown-field, over-limit, revision, capability, and reason-code cases.

### Web

- `apps/pi-remote-web/src/SessionHeader.tsx`: replace the nested picker with the model trigger and `ModelSwitcherSheet`, while retaining thinking effort as a sibling control.
- `apps/pi-remote-web/src/ModelSwitcherSheet.tsx`: new RAC modal sheet, grouped list, search, footer, status, focus, gestures, and state rendering.
- `apps/pi-remote-web/src/model-catalog.ts`: new pure key, grouping, ordering, filtering, and display-metadata helpers.
- `apps/pi-remote-web/src/runtime.ts`: separate confirmed and draft model state, fresh catalog generations, abort/timeout handling, foreground reconciliation, streaming gate, and terminal outcome handling.
- `apps/pi-remote-web/src/relay.ts`: validate the expanded catalog and request/submit the bound runtime ticket/control command.
- `apps/pi-remote-web/src/App.tsx`: reconcile runtime/catalog on visibility changes and pass the session/foreground state to the sheet.
- `apps/pi-remote-web/src/style.css` and `apps/pi-remote-web/index.html`: sheet layout, safe-area/visual-viewport sizing, focus states, theme tokens, motion, and `viewport-fit=cover`.
- Web tests in `apps/pi-remote-web/tests/runtime.test.tsx`, `apps/pi-remote-web/tests/App.test.tsx`, new catalog/sheet tests, and existing contrast tests.

### Runtime dependency

The feature depends on the already-supported pi RPC reads `get_state`, `get_available_models`, and `get_available_thinking_levels`, plus `set_model`. Host-authored metadata and switching capability are optional; absent metadata is omitted and absent capability fails closed. No database migration is required if runtime tickets remain in the existing in-memory auth ticket store.

## Acceptance criteria

Each criterion has an objective evidence path. A phase is not accepted on visual inspection alone.

| Check                      | Pass condition                                                                                                                                                                                  | Evidence                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Contract shape             | Valid expanded model/catalog/control payloads pass; unknown keys, non-path-free IDs, invalid revisions, invalid capability values, and over-limit metadata fail.                                | Protocol guard tests in `packages/pi-rpc-protocol/tests/guards.test.ts`.   |
| Allowlist projection       | Raw model rows emit only declared bounded fields; malformed rows and undeclared nested data are omitted.                                                                                        | Relay redaction unit tests with hostile fixtures.                          |
| Fresh open                 | Opening the sheet starts a fresh catalog request; an older response cannot replace a newer request-generation result.                                                                           | Web reducer test with deferred responses and `AbortController` assertion.  |
| Read-only staging          | Tapping or pressing Enter on a row changes only the draft key; no ticket request, control request, or header text change occurs.                                                                | RTL test with mocked `fetch` and DOM assertion.                            |
| Catalog threshold          | Search is absent for 7 models and present for 8 models; the in-place list remains one dialog.                                                                                                   | RTL DOM assertion for `role=dialog`, `role=combobox`, and request count.   |
| Search semantics           | Query matches label/provider/ID case- and diacritic-insensitively, boosts ID prefixes, and shows the exact empty message.                                                                       | Pure helper tests plus RTL result/empty-state assertions.                  |
| Ordering                   | Provider grouping, current-provider-first, current-model-first, and locale-aware ordering are deterministic.                                                                                    | Pure catalog helper test using shuffled fixtures.                          |
| Retired current            | A current host model absent from the catalog is rendered as a pinned disabled **Current · no longer available** row.                                                                            | RTL DOM assertion for disabled row, label, and `aria-current`.             |
| Availability               | Tier-locked and policy-blocked rows remain visible, disabled, icon-marked, and use mapped reason text.                                                                                          | RTL DOM assertion plus reason-code fixture test.                           |
| Current versus draft       | The confirmed row exposes `aria-current=true` and **Current**; the staged row exposes `aria-selected=true` and **Selected**; the two never collapse before acceptance.                          | RTL DOM assertions through staging and commit-pending states.              |
| Ticket binding             | A model ticket is bound to session, operation, exact provider/model, runtime revision, catalog revision, and expiry; a mismatched or reused ticket is rejected.                                 | Relay auth/runtime tests with altered fields and duplicate consume.        |
| Explicit commit            | One activation of Switch model produces exactly one ticket issuance and one control command containing the exact staged target and both expected revisions.                                     | Web relay mock call-count test and relay request-body assertion.           |
| No premature header change | During opening, staging, committing, stale, rejection, and delivery unknown, the header remains the last host-confirmed model.                                                                  | RTL DOM assertions for each reducer state.                                 |
| Accepted result            | Host acceptance replaces state from the response, closes the sheet, restores focus with `preventScroll`, and announces `Model switched to {label}.`                                             | RTL state/focus/live-region assertions.                                    |
| Stale result               | Stale response hydrates returned host state, clears the draft, shows **Host state changed. Choose again.**, and makes zero follow-up ticket/control calls.                                      | Web reducer test with call-count assertion.                                |
| Rejection results          | Unavailable and policy-blocked responses leave the confirmed model unchanged, show mapped inline text, and allow a different selection.                                                         | RTL DOM and reducer tests.                                                 |
| Delivery unknown           | Delivery-unknown is terminal, never shows the target as current, never renders Retry, and requires read-only reconciliation before another commit.                                              | Relay/web tests plus DOM assertion for barrier and absence of retry.       |
| Streaming gate             | While streaming, browsing and staging work; commit is disabled when capability is false/unknown and **Next turn** appears only after explicit host confirmation.                                | RTL tests for both capability values and queued response.                  |
| Offline/unreachable        | Offline and unreachable states preserve a readable in-memory list when present and issue zero ticket/control requests.                                                                          | Web integration test with failed fetch and call-count assertion.           |
| Access loss                | Access-denied clears sensitive in-memory runtime data and exposes only reconnect, not stale mutation controls.                                                                                  | Reducer/DOM test.                                                          |
| Foreground reconciliation  | Visibility change to foreground triggers fresh state/catalog reconciliation and blocks commit until it settles.                                                                                 | App test with visibility event and mocked relay calls.                     |
| Modal interaction          | Backdrop, close, Escape, and header swipe dismiss before commit; list scrolling does not drag the sheet; all dismissal paths are inert during commit.                                           | RTL keyboard/gesture tests plus manual iPhone PWA check.                   |
| Keyboard path              | Trigger Enter/Space opens; arrows/Home/End navigate; Enter stages; Tab reaches Cancel and Switch; Escape clears search before dismissing.                                                       | RTL user-event test and manual hardware-keyboard check.                    |
| Accessibility              | Dialog, combobox, listbox, options, names, descriptions, busy state, live status, focus containment, and focus restoration are present and valid.                                               | DOM accessibility assertions and VoiceOver/Switch Control manual step.     |
| Target sizes/reflow        | Buttons are at least 44×44px, rows at least 48px, and there is no horizontal scroll at 320px or 200% zoom.                                                                                      | CDP computed-style/scroll-width assertions and screenshot.                 |
| Visual system              | Light/dark sheet, focus ring, disabled states, current/staged states, and text meet the fixed token and contrast requirements.                                                                  | Existing contrast tests plus true-390px CDP screenshots in light and dark. |
| iPhone viewport            | `viewport-fit=cover`, safe-area padding, visual-viewport sizing, software-keyboard opening, portrait, and landscape do not clip the dialog or footer.                                           | DOM/meta assertion and manual installed-PWA step.                          |
| Reduced motion             | `prefers-reduced-motion: reduce` removes transforms, springs, staggering, and spinning indicators while preserving state text.                                                                  | CDP media emulation plus computed-style assertion.                         |
| Separation of effort       | Changing effort cannot change draft model or share a model ticket; model commit cannot change thinking level.                                                                                   | RTL command payload assertion.                                             |
| Security surface           | No ticket, raw error, host payload, provider/model ID, search query, or model catalog is written to console, analytics, URL, persistent storage, IndexedDB, service-worker cache, or telemetry. | Spied console/fetch/storage/cache test and static source scan.             |
| Existing posture           | Session auth, foreground requirement, rate limits, policy gate, redaction, host revision checks, and plan-mode enforcement remain active.                                                       | Relay security/negative-control suite and release gate output.             |

## Release and rollback note

Ship only after protocol, relay, web, DOM, security, and true-390px light/dark gates are green. The old implementation is not a second production path after the replacement is accepted. Rollback is a prior verified relay/web build; no model data or database migration is required.
