> **Deep research — external-CLI multi-executor run.** 5 independent iterations (5 × DeepSeek v4 Flash (opencode-go gateway)), no early convergence. Synthesis of all passes into one build-ready decision.
> **Provenance:** produced by external-CLI orchestration, NOT the `/deep:research` state-machine runtime — so runtime state artifacts (`deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, observability, deltas, lineages) are intentionally absent. See `PROVENANCE.md`.
> **Canonical:** this file (`research.md`) is the synthesized output; per-pass findings live in `iterations/iteration-NNN.md`.

---

# F1-change-model — Synthesis

## 1. Decision

Replace the current nested `Popover → Select → Popover` implementation with a single iPhone bottom sheet built from react-aria-components `Modal`, `Dialog`, `Autocomplete`, and grouped `ListBox` primitives. Opening, searching, and staging a model remain read-only; the mutation occurs only after an explicit **Switch model** action, which obtains a one-use ticket bound to the target and current host revision. The current model remains visible until the host confirms the change, and stale, rejected, or delivery-unknown outcomes never retry automatically. Use one consistent sheet for every catalog size, revealing search at eight or more models, because adaptive chip and sheet variants add navigation inconsistency without improving the common path. During a running turn, allow browsing and staging, but disable commit unless the host explicitly reports next-turn switching support.

## 2. Build spec

### Component structure

```text
SessionHeader
├─ ModelTrigger
│  └─ Host-confirmed model label and optional plan-mode badge
└─ ModelSwitcherSheet
   ├─ ModalOverlay
   └─ Modal
      └─ Dialog "Change model"
         ├─ SheetHeader
         │  ├─ Grabber
         │  ├─ Source Serif 4 title
         │  └─ CloseButton
         ├─ RuntimePolicyNotice
         ├─ ModelAutocomplete
         │  ├─ SearchField, when catalog size ≥ 8
         │  └─ ModelListBox
         │     ├─ CurrentModelSection, when the current model is retired
         │     └─ ProviderSection × N
         │        └─ ModelRow × N
         ├─ CatalogStatePanel
         ├─ MutationStatus
         └─ MutationFooter
            ├─ CancelButton
            └─ SwitchModelButton
```

Keep thinking effort as a separately labelled sibling control. It must not be represented as a model variant or combined with `set_model` in one ticket.

### Data contract

Extend the relay’s model DTO with host-confirmed, optional metadata:

```ts
type AvailableModelDto = {
  provider: string
  id: string
  label: string
  reasoning?: boolean
  input?: Array<"text" | "image">
  contextWindow?: number
  maxTokens?: number
  tools?: boolean
  availability?: "available" | "tier_locked" | "policy_blocked"
  availabilityReasonCode?: string
  pricing?: {
    currency: string
    inputPerMillion?: number
    outputPerMillion?: number
  }
}
```

The catalog response also needs `catalogRevision`, `runtimeRevision`, current model identity, streaming state, and an explicit `canSetModelWhileStreaming` capability. Omit metadata the host cannot authoritatively provide; never derive capabilities from model names.

Use stable keys:

```ts
const modelKey = `${encodeURIComponent(provider)}/${encodeURIComponent(id)}`
```

The opaque original `provider` and `id` values are retained for the command; only sanitized copies are rendered.

### Catalog organization

- Group by provider.
- Put the current model’s provider first; sort remaining providers and their models with locale-aware comparison.
- Put the current model first inside its provider.
- If the current model no longer exists in the catalog, render a pinned, disabled row labelled **Current · no longer available**.
- Disabled tier- or policy-gated models remain visible with an icon and plain-language reason.
- Show only authoritative hints: context window, reasoning, vision, tools, and optional price.
- Do not add an `Auto`, `Default`, favorite, recent, or persistent-default row until the host exposes those concepts.

### Search

Use RAC `Autocomplete` to filter the in-place list rather than opening another popover. Use React `useDeferredValue` for filtering without blocking sheet interaction.

- Render search only when the catalog contains at least eight items.
- Match label, provider, and ID using case- and diacritic-insensitive contains matching; boost ID prefix matches.
- Configure the input with `autoCapitalize="none"`, `autoCorrect="off"`, `spellCheck={false}`, and `enterKeyHint="search"`.
- Pin the input to at least `16px` to prevent iOS focus zoom.
- The clear button clears the query and restores focus.
- Empty state: `No models match “{query}”.`
- Announce `N of M models` without replacing the live-region node.

### Selection and mutation flow

1. Opening the sheet fetches a fresh catalog. A last-known in-memory catalog may render while the request completes, but mutation remains disabled until the fresh response arrives.
2. Tapping or pressing Enter on a model only changes `draftModelKey`. It consumes no ticket and does not change the header.
3. Selecting the current model leaves the primary action disabled.
4. **Switch model** obtains a one-use ticket bound to:
   - authenticated session;
   - `set_model`;
   - provider and model ID;
   - expected runtime and catalog revisions;
   - short expiry.
5. Submit the ticket once. Disable model selection, dismissal, and repeat submission while the result is genuinely in flight.
6. On acceptance, update from the returned host state, close the sheet, restore focus to the trigger, and announce `Model switched to {label}.`
7. On a revision mismatch, hydrate the returned host state, clear the staged selection, and require the user to select and confirm again.
8. On rejection, keep the confirmed model unchanged and show an inline, code-mapped reason.
9. On delivery unknown, never resend. Allow dismissal after entering the terminal state, but keep a persistent **Outcome unknown · Reconcile** barrier until a read-only host refresh resolves the state.
10. On foregrounding the PWA, reconcile current model, revisions, streaming state, and catalog before permitting another mutation.

### State matrix

| State | List and row behavior | Footer and dismissal |
|---|---|---|
| `closed` | Not rendered | Trigger shows host-confirmed model |
| `opening` | Sheet shell and four skeleton rows | Actions disabled |
| `ready` | Current row has check and “Current” text | Switch disabled until another available row is staged |
| `searching` | Filtered provider groups | Result count announced politely |
| `search_empty` | No-results message and Clear button | Switch disabled |
| `catalog_empty` | “No models configured. Configure a provider on the host.” | Switch disabled |
| `refreshing` | Existing in-memory list remains readable | “Refreshing…”; mutation disabled |
| `offline` | In-memory list remains browsable, if present | “You’re offline”; mutation disabled |
| `unreachable` | List may remain readable | Inline Retry; mutation disabled |
| `access_denied` | Clear sensitive in-memory runtime data | “Access expired”; reconnect action only |
| `staged` | Draft row gets outline and “Selected”; confirmed row retains “Current” | Cancel and Switch enabled |
| `streaming_blocked` | Browsing and staging allowed | “Available after the current turn”; no automatic commit |
| `queued_by_host` | Target row says “Next turn” | Only when explicitly supported by the host |
| `committing` | Target row is busy; all rows disabled | “Applying…”; close, scrim, Escape, and swipe disabled |
| `accepted` | Host-confirmed row becomes current | Close and announce success |
| `stale` | Returned host model becomes current; draft cleared | “Host state changed. Choose again.” |
| `unavailable` | Target becomes disabled when applicable | Inline explanation; choose another model |
| `policy_blocked` | Confirmed model remains unchanged | “Blocked by host policy.” |
| `delivery_unknown` | No target is presented as current | Reconcile only; never Retry |
| `retired_current` | Pinned disabled current row plus available catalog | User may stage an available replacement |

Catalog requests must use `AbortController`, an eight-second timeout, and a monotonically increasing request generation. An older catalog response must never replace a newer one.

### Gestures and keyboard

- Tap the header trigger to open.
- Tap a row to stage; never commit from a single tap, double-tap, swipe, or long press.
- Swipe down only from the grabber/header strip. Dismiss when travel exceeds 30% of sheet height or downward velocity exceeds approximately `1200px/s`; otherwise snap back.
- List scrolling never drags the sheet. Apply `overscroll-behavior-y: contain` to the list and leave its touch behavior native.
- Backdrop tap, close button, and Escape dismiss before commit. During commit they do nothing until a terminal result or bounded delivery-unknown timeout.
- Do not intercept iOS edge navigation or add audio as a haptic substitute.
- Enter or Space on the trigger opens the dialog.
- Initial focus goes to the current row, avoiding an unsolicited iOS keyboard. `/` or Tab focuses search.
- Arrow keys, Home, and End navigate the list. Enter stages the highlighted row but does not commit.
- Tab reaches Cancel and Switch model. Only activating Switch model mutates.
- Escape clears a non-empty search first; otherwise it dismisses before commit.
- Focus returns to the model trigger with `preventScroll` after close.

### Accessibility and internationalization

- Trigger: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`, and accessible name `Model, {label}, {provider}`.
- Sheet: labelled modal dialog with RAC focus containment and background inertness.
- Search: combobox semantics supplied by `Autocomplete`; list and rows retain `listbox` and `option` semantics.
- `aria-selected` represents the staged selection. The host-confirmed row additionally receives `aria-current="true"` and visible **Current** text.
- Pending row receives `aria-busy="true"` and an associated `Applying…` description.
- Maintain an always-mounted `role="status" aria-live="polite"` region. Use an assertive alert only for access loss and delivery-unknown outcomes.
- Rows must expose label, provider, full ID, capabilities, availability, current state, and staged state in their accessible description.
- Trigger and buttons are at least `44×44px`; rows are at least `48px` and grow for wrapped or enlarged text.
- Focus-visible styling uses a two-pixel AA-compliant ring with a two-pixel offset; background tint alone is insufficient.
- Pass WCAG AA at normal and 200% zoom, at 320 CSS pixels, without horizontal scrolling.
- Use CSS logical properties throughout. IDs are rendered `dir="ltr"`, `translate="no"`, and `unicode-bidi: isolate`; labels follow document direction and may wrap to two lines.
- Keep all UI and announcement strings in the message catalog. Use `Intl.PluralRules` for result counts.
- Do not ship the fragile Dynamic Type measurement probe in the first build. Preserve rem-based scaling and 200% Page Zoom support; evaluate a user-facing text-size setting separately.

### Visual and motion system

Light theme:

- Page: bone `#f8f8f6`
- Raised sheet: `#ffffff`
- Carbon ink: `#24221f`
- Muted ink: `#6c6a65`
- Clay identity color: `#d97757`
- AA text accent: `#8a452f`
- AA UI accent: `#b85f42`
- Soft selection: `#f3e4de`

Dark theme:

- Page: `#24221f`
- Raised sheet: `#2d2a26`
- Primary text: `#f8f8f6`
- Muted text: `#9f998f`
- Clay: `#d97757`
- Accent text: `#f0b19a`
- Soft selection: `#3a2720`

Raw clay on bone is only about `2.94:1`; never use it for small text or as the sole UI-state indicator. Use the AA semantic accent tokens plus check, outline, icon, and text.

- Sheet width: full viewport up to `430px`.
- Maximum height: 92% of RAC’s visual-viewport height.
- Top radius: `24px`; grabber: `36×4px`.
- Bottom padding: `max(16px, env(safe-area-inset-bottom))`.
- Header title: Source Serif 4, approximately `22px`.
- Controls, rows, captions: Inter; IDs remain Inter with tabular numerals rather than adding a third typeface.
- Default entrance: translate `36px → 0` and fade over `280ms` using `cubic-bezier(0.32, 0.72, 0, 1)`.
- Backdrop fade: `180ms`; exit: `220ms`; accepted header crossfade: `150ms`.
- Under `prefers-reduced-motion: reduce`, remove transforms, springs, rubber-band animation, row staggering, and spinning indicators. Use a short opacity change or static icon plus status text.
- Do not add vibration or WebAudio feedback; iPhone PWAs have no dependable haptic API.

Add `viewport-fit=cover` to the viewport meta tag. Size the sheet from RAC’s `--visual-viewport-height`, not raw `100vh`, and rely on RAC’s body scroll lock rather than adding a second lock.

### Verification gates

- A row tap produces no network mutation and consumes no ticket.
- One Switch activation produces exactly one ticket and one command.
- The command contains both expected revisions and the exact staged provider/model.
- Header text never changes before host acceptance.
- Stale, rejected, and delivery-unknown responses produce zero automatic retries.
- A late catalog response and late mutation response cannot overwrite newer host state.
- Background/foreground reconciliation restores the host-confirmed model.
- Offline and unreachable states remain browsable but cannot mutate.
- VoiceOver, Switch Control, Full Keyboard Access, and hardware-keyboard paths complete without focus loss.
- Light and dark selections, focus indicators, badges, and text pass WCAG AA.
- Installed-PWA tests pass in portrait and landscape with the software keyboard open.
- No ticket, raw error, unredacted host payload, provider ID, or custom model ID enters logs, analytics, URLs, persistent web storage, or service-worker caches.

## 3. Consensus vs divergence

### Consensus

All passes agreed that the host must remain the source of truth and that the existing non-optimistic reducer is an asset, not something to replace. The strongest shared implementation direction was a real modal sheet, provider grouping, stable provider/model keys, inline loading and failure states, focus restoration, 44px-or-larger targets, reduced-motion handling, and host-authored capability metadata (iter-01, iter-03, iter-04, iter-05).

The passes also converged on:

- refreshing the catalog when the picker opens and when the PWA returns to the foreground;
- preserving the confirmed header label while a switch is pending;
- keeping unavailable models visible with reasons;
- making failures inline rather than stacking another modal;
- treating delivery unknown as terminal until reconciliation;
- separating model identity from thinking effort;
- fixing `viewport-fit=cover` and visual-viewport sizing;
- avoiding haptics on iPhone PWAs.

### Resolved divergences

- **Tap-to-apply vs staged confirmation:** iter-01, iter-03, and iter-05 leaned toward immediate dispatch from selection; iter-02 argued for selection followed by explicit commit. The staged design wins because it directly implements the fixed read-only-by-default posture.
- **Autocomplete vs ComboBox:** iter-03 favored reusing the existing ComboBox pattern; iter-05 showed that RAC 1.20’s `Autocomplete` better fits an in-place search and list inside a modal. Use `Autocomplete`, with a controlled search field plus `ListBox` as the fallback if device QA finds regressions.
- **Swipe dismissal:** iter-02 treated it as part of native sheet behavior; iter-05 recommended omitting it initially because of iOS gesture conflicts. Keep a handle-only implementation, never whole-list dragging, and remove it if real-device testing cannot make it reliable.
- **Offline persistence:** iter-04 proposed stale-while-revalidate service-worker caching for catalogs. The stricter security decision is static-shell caching plus in-memory runtime data only; persisted offline catalog browsing requires a separate threat-model decision.
- **Adaptive chips for small catalogs:** iter-01 proposed chips for four or fewer models. Keep one sheet across sizes; hide search below eight models.
- **Mid-turn queuing:** several passes assumed “next turn,” but none verified the host contract. The default is fail-closed: stage freely, commit only when idle unless the host advertises queue semantics.

### Minority ideas worth retaining

- A host-backed **Default** row and session-only versus persistent selection, modelled on Claude Code and Kimi, once the protocol exposes those scopes (iter-01, iter-05).
- Host-authored cost, context-window, reasoning, vision, and tool chips; cost can trigger an extra warning only when the host classifies the switch as materially expensive (iter-01, iter-04, iter-05).
- A pinned current-model row, especially when the active model has been retired (iter-01, iter-05).
- A future per-turn override owned by the host, not a client-side queue (iter-03).
- Optional favourites or recent models, persisted only as references and always revalidated against the live catalog (iter-02, iter-04).
- A shared-element trigger-to-sheet transition behind a measured feature flag (iter-05).
- An explicit in-app text-size setting if Page Zoom proves inadequate for the target audience (iter-03).

Do not retain hidden double-tap commits, swipe-to-pin, audio “haptics,” name-derived capability guesses, or automatic model suggestions; they conflict with predictability or the security posture.

## 4. Security & redaction

The sheet is read-only until the user activates **Switch model**. Staging is local state and cannot acquire or consume a mutation ticket.

For every switch:

1. Obtain a short-lived one-use ticket only after explicit confirmation.
2. Bind it to the authenticated session, operation, exact provider/model target, runtime revision, catalog revision, origin, and expiry.
3. Consume it on the first submission attempt, including host rejection.
4. Require the host or extension to validate the target, revisions, availability, tier policy, and enforced plan mode.
5. Apply only the host-returned state.
6. Never replay after timeout, stale state, rejection, reconnect, foregrounding, or delivery unknown.

A model switch must not change execution policy. The request contains no plan/execution-mode field, the UI offers no local mode override, and the host/extension remains authoritative. If the chosen model is incompatible with enforced plan mode, the host returns `policy_blocked` and keeps the current model. Subsequent turns continue under host-enforced plan mode regardless of the selected model.

Redaction rules:

- Relay responses use a strict allowlist of model fields and bounded scalar sizes.
- Host errors become safe reason codes such as `stale_revision`, `unavailable`, `tier_locked`, `policy_blocked`, `access_expired`, and `delivery_unknown`; raw exceptions never reach the PWA.
- React renders catalog text as text only. No host-authored HTML, Markdown, URLs, CSS, or `dangerouslySetInnerHTML`.
- Strip control characters from display copies and isolate bidirectional text. Preserve opaque original IDs only for the command.
- Tickets, credentials, revisions, raw host payloads, custom model IDs, and provider IDs never enter URLs, browser history, clipboard, logs, analytics, crash reports, local storage, IndexedDB, or service-worker caches.
- Telemetry records only coarse outcome categories and timings, never target identity.
- The service worker caches the versioned static app shell only. Runtime catalogs and current-model state remain in memory and are cleared on logout, access denial, or session replacement.
- Foreground reconciliation is read-only. It may resolve delivery unknown but may never silently repeat the mutation.
- Access denial clears sensitive runtime state and replaces the sheet with a reconnect action.

## 5. Open questions + risks

- **Mid-turn contract:** does `pi` reject, immediately apply, or queue `set_model` while streaming? The host must expose this explicitly before queued switching is enabled.
- **Scope:** is model state session-local, global to the running agent, or persisted for future sessions? Do not add Default or persistence controls until this is defined.
- **Revision coverage:** does the existing revision protect both active runtime state and catalog membership? If not, add a distinct catalog revision.
- **Metadata exposure:** which capability, price, tier, and availability fields may the relay expose after redaction? Numeric pricing may reveal organization-specific terms.
- **Push updates:** can the host push model and catalog changes, or is refresh-on-open/foreground sufficient?
- **Plan compatibility:** can the host report which models are valid under enforced plan mode, or only reject after confirmation?
- **Autocomplete maturity:** RAC `Autocomplete` is newer than `ComboBox`; retain a controlled SearchField plus ListBox fallback and pin the tested RAC patch version.
- **Dynamic Type:** accept zoom-based scaling for the first build, add a deterministic in-app scale, or adopt the fragile `-apple-system-body` probe?
- **Offline catalog:** persistent offline browsing is intentionally excluded. Enabling it later requires storage, shared-device, logout, and access-revocation analysis.
- **Real-device sheet behavior:** swipe dismissal, VoiceOver focus restoration, keyboard resizing, landscape safe areas, and standalone-PWA backgrounding require physical iPhone testing.
- **Visual references:** the Claude and Kimi Mobbin flows were login-gated and not verified by the passes. Capture them manually before final motion and spacing sign-off.

## 6. Sources

### Product and coding-agent precedents

- [Claude Code model configuration](https://code.claude.com/docs/en/model-config) — aliases, pricing, availability, confirmation, and session/default scope (iter-01, iter-05).
- [Kimi Code](https://github.com/MoonshotAI/kimi-code) and [Kimi command reference](https://moonshotai.github.io/kimi-code/en/reference/kimi-command.html) — provider catalog, model switching, and capability metadata (iter-01, iter-05).
- [pi](https://github.com/earendil-works/pi) — host model catalog and runtime precedent (iter-01, iter-04, iter-05).
- [opencode](https://github.com/anomalyco/opencode) — provider/model namespacing and model picker (iter-01, iter-03, iter-05).
- [LobeChat](https://github.com/lobehub/lobe-chat) — large provider-grouped catalog, search, and capability badges (iter-01).
- [Open WebUI](https://github.com/open-webui/open-webui) — server-confirmed selection and empty/error handling (iter-04).
- [Enchanted](https://github.com/gluonfield/enchanted) — native-iOS self-hosted model client precedent (iter-03, iter-04).
- [agegr/pi-web](https://github.com/agegr/pi-web), [siteboon/claudecodeui](https://github.com/siteboon/claudecodeui), and [slopus/happy](https://github.com/slopus/happy) — mobile and remote coding-agent clients (iter-05).

### Platform, accessibility, and implementation

- [React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html), [Dialog](https://react-spectrum.adobe.com/react-aria/Dialog.html), [ComboBox/Autocomplete guidance](https://react-spectrum.adobe.com/react-aria/ComboBox.html), and [ListBox](https://react-spectrum.adobe.com/react-aria/ListBox.html).
- [WAI-ARIA APG Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) and [Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — contrast, motion, reflow, focus, status, and target-size requirements.
- [Apple HIG — Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets), [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/), and [Menus](https://developer.apple.com/design/human-interface-guidelines/menus/).
- [WebKit — Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/) — `viewport-fit=cover` and safe areas.
- [web.dev — Visual Viewport API](https://web.dev/articles/visual-viewport-api) and [The Offline Cookbook](https://web.dev/articles/offline-cookbook).
- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) and [`overscroll-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overscroll-behavior).

### Visual references

- [Mobbin — Anthropic Claude](https://mobbin.com/apps/anthropic-claude)
- [Mobbin — Moonshot Kimi](https://mobbin.com/apps/moonshot-kimi)
- [Mobbin mobile explorer](https://mobbin.com/explore/mobile)

The Mobbin links are app-level, login-gated pointers; exact model-picker screens still require manual verification.
