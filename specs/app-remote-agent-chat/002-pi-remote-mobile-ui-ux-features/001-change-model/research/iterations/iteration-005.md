<!-- provenance: external-CLI orchestration pass; original file iter-05-deepseek.md -->
> **Source pass 5** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-5-deepseek.md`.

<!-- F1-change-model | model=deepseek | lens=react-implementation | iter 5/5 | 2026-08-15T19:20:25.981Z -->

I have a full picture of the current implementation. Now let me research the react-implementation lens: react-aria-components patterns, iOS/PWA pitfalls, and prior art.
The current stack is clear (RAC 1.20.0, React 19.1.1, Tailwind 4.1.11). Now let me delegate prior-art research to a subagent while I verify key web sources myself.
I have strong verified material. Let me confirm the RAC Popover/ListBox API surface from the installed package, then check a couple of remaining app files.
One more RAC check — the new `Autocomplete` primitive (1.20) is directly relevant for the search-in-sheet pattern.
I have everything I need — verified against the actual repo, the installed `react-aria-components@1.20.0` source, and live docs/prior art. Here is the report.

---

# Research Pass 5/5 — React-Implementation Lens: In-App Model Switcher for "Pi Remote"

Scope: hardening the *existing* working model switcher (centered header `<model> v` → sheet listing host-confirmed models → `set_model`) into a Claude/Kimi-grade picker. This pass is grounded in the actual repo (`apps/pi-remote-web`), the installed `react-aria-components@1.20.0` + `react@19.1.1` + `tailwindcss@4.1.11` bits, and live docs/prior art. All claims cited inline.

---

## 1. Findings for this lens

### 1.1 What the shipped code actually does today (repo-grounded)

- **The "sheet" is not a sheet.** `SessionHeader.tsx:68–97` renders `DialogTrigger > Button > Popover placement="bottom" > Dialog` containing a **nested `Select`**, whose own `ListBox` popover renders *inside* the outer popover. It is an anchored, non-modal popover (`react-aria-Popover` `max-width:88vw`, `ListBox` `max-height:50vh`, `style.css:1586–1620`), not a bottom sheet.
- **Flat, index-keyed list.** `runtime.models.map((model, index) => <ListBoxItem id={String(index)}/>)` with `selectedKey={String(modelIndex)}` (`SessionHeader.tsx:81–93`, same in `RuntimeStrip.tsx:53–64`). Any catalog reorder/refetch makes keys unstable; `provider|id` composite keys are the correct ids.
- **The non-optimistic state machine is already correct** — keep it. `runtimeReducer` (`runtime.ts:51–125`) never commits an unconfirmed value; `state` only changes to what the host confirmed (`accepted`, or host value on `stale`); `deliveryUnknown` is terminal and auto-retry is forbidden. The `pending` field already holds the `RuntimeOperation` including `provider`+`modelId` — **per-row pending is derivable with zero reducer changes**.
- **Two UX gaps from the state machine:** (a) on selection the `Select` closes, and the trigger is disabled whenever `runtime.status !== 'ready'` (`SessionHeader.tsx:54`) — so during `pending` the user cannot see "Applying…" anchored to the row they chose; (b) the only feedback is a global `role="status" aria-live="polite"` line (`SessionHeader.tsx:124`).
- **Real PWA bug:** `index.html` viewport meta is `width=device-width, initial-scale=1.0` with **no `viewport-fit=cover`**, while the CSS already uses `env(safe-area-inset-*)` everywhere. On a notched iPhone `env()` resolves to `0` without `viewport-fit=cover` (WebKit safe-area blog below) — so the in-app safe-area paddings are inert today. Fix is one attribute.

### 1.2 react-aria-components 1.20 ships exactly the primitives this needs

- **`Modal`/`ModalOverlay` is the correct sheet base**, not `Popover`. Verified in the installed source: `Modal.mjs:133–134` sets `--visual-viewport-width/height` on the overlay via `useViewportSize`, which is built on `window.visualViewport` with a `resize` listener, ignores updates when `scale > 1`, and — specifically for iOS WebKit — hooks `window 'blur'` to resize early when the keyboard closes (the visual-viewport resize event lags the animation) (`react-aria/dist/private/utils/useViewportSize.js:36–58`). This is the keyboard-safe sheet you would otherwise hand-roll.
- **Sheet animations without a motion library.** `Modal.js:92–111,149–151` drives `data-entering` / `data-exiting` attributes via `useEnterAnimation`/`useExitAnimation`, so entrance *and exit* keyframe animations come from plain CSS. The official Modal docs page includes a ready "Sheet" example.
- **Search-in-sheet: prefer the new `Autocomplete` over `ComboBox`.** The RAC docs draw the line explicitly: *"Use ComboBox to select one or more values from a pre-defined set… Use Autocomplete to filter a collection"* (ComboBox docs `InlineAlert`). `Autocomplete` (new in 1.20; `useAutocomplete`/`useSearchAutocomplete`) wires an input + in-place collection with a `filter(textValue, inputValue)` function, virtual focus, `aria-activedescendant`, and `enterKeyHint`/`autoCorrect`/`autoComplete` passthrough (`Autocomplete.d.ts`, `useAutocomplete.d.ts:10,18`) — i.e. the APG combobox pattern rendered as one sheet, no separate popover. `ComboBox` still works if you accept its popup, but inside a scrolling sheet its anchored popover repositions on scroll (RAC `useOverlayPosition` listens to scroll) — the classic iOS jank. **The Claude/Kimi pattern (search field on top, grouped list below, same surface) is an Autocomplete.**
- **Grouping + empty state** come from `ListBoxSection`+`Header` and `ListBox` `renderEmptyState` (verified `ListBox.d.ts:72`).
- **`SearchField`/`TextField`/`Input`** pass through `inputMode`, `autoCapitalize`, `autoCorrect`, `spellCheck`, `enterKeyHint` — required for the iOS search field (below).
- `Virtualizer` (RAC) exists for huge catalogs, and `@tanstack/react-virtual` is already a dependency; neither is needed for the typical pi catalog (a few dozen), but it is the ceiling if a user runs a giant OpenRouter list.
- `SharedElementTransition` (1.20) exists for an iOS-style morph of the header pill → sheet title; treat as experimental polish, not core.

### 1.3 iOS Safari / installed-PWA pitfalls (stack-specific)

1. **Keyboard vs. sheet height.** The layout viewport does not shrink when the iOS keyboard opens; `100vh`/`100dvh` are wrong inside a sheet with a focused search field. RAC's `--visual-viewport-height` (populated from `visualViewport`) is the correct height source (1.2 above). Web Dev docs confirm the Visual Viewport API is the standard mechanism.
2. **Focus-zoom: search input font-size must be ≥ 16px** on iOS Safari or the page zooms into the field on focus. The app's `--space`/font scale can otherwise allow ~0.8–0.9rem; pin the sheet search input explicitly ≥ 1rem. (MDN input docs; long-standing WebKit behavior.)
3. **Safe areas.** `viewport-fit=cover` + `env(safe-area-inset-*)` (WebKit "Designing Websites for iPhone X"). Sheet needs bottom inset for the home indicator and top inset for the notch/status bar in `standalone` mode (manifest is `display: standalone` already).
4. **Scroll chaining / body scroll.** Set `overscroll-behavior: contain` on the model list so rubber-banding at its edges doesn't drag the page; RAC's `usePreventScroll` (from `@react-aria/overlays`) already locks body scroll behind the Modal — don't double-lock.
5. **`touch-action`.** App already sets `touch-action: manipulation` on buttons (`style.css:202–204`) to kill double-tap zoom and the old 300 ms delay — but do **not** apply it to the scrollable ListBox container; it would break list scrolling.
6. **Text field crutches.** Set `autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="search"` on the search input so iOS doesn't auto-capitalize/autocorrect model ids like `deepseek-v4-flash`. (`FieldInputContext` in `Autocomplete.d.ts` is built for this.)
7. **Nested-overlay bug is real today.** The current Select-in-Popover nests two overlay layers; on iOS the inner listbox repositions against a scrolling outer popover and can visually escape/clip it. Moving to one Modal sheet removes the nesting entirely.
8. **VoiceOver + `aria-modal`.** RAC Modal+Dialog provides focus containment, `aria-modal`, Escape/backdrop dismiss (`isDismissable`, `shouldCloseOnInteractOutside`, `isKeyboardDismissDisabled` — Modal docs). Keep the sheet `aria-label`; the picker is a `dialog`, the search is the combobox, the list is a `listbox`.

### 1.4 Capability hints: the data already exists host-side, the protocol drops it

The host (`pi`) model catalog carries per-model `name`, `reasoning`, `input` (`text`/`image`), `contextWindow`, `maxTokens`, `cost` (per-M-token + tiers), and `thinkingLevelMap` (which effort levels a model supports) — see the pi custom-models doc. The app's `AvailableModelDto` is only `{provider, id, label}` (`packages/pi-rpc-protocol/src/types.ts:457–461`), and `RuntimeStateDto.availableThinkingLevels` already reflects per-model effort. **Therefore:** "capability hints" (reasoning, context window, vision, price) must be a **host-confirmed protocol extension** to `AvailableModelDto` (relay passes pi's fields through + guards), never client-side invention — consistent with the read-only, host-authoritative posture. This is the single biggest differentiator vs. the current flat label list and it is cheap to add.

### 1.5 Prior art (verified)

- **Claude Code `/model` picker** — rows with per-model prices; `Enter` = switch *and save as default*, `s` = session-only; and critically: *"The picker asks for confirmation when the conversation has prior output, since the next response re-reads the full history without cached context"* — a model switch mid-conversation is a **context-cache cost event**. Picker hides/greys models excluded by `availableModels`. Mobile Claude Code-on-the-web supports switching but not editing/retrying. (code.claude.com/docs/en/model-config)
- **pi CLI** — `/model` opens the picker, footer shows current model id, `/scoped-models`, `models.json` reloads each time the picker opens. (earendil-works/pi usage.md + models.md)
- **opencode** — `/models` picker, models namespaced `provider/model`, config groups by provider (anomalyco/opencode).
- **Kimi Code** — `/model` in TUI + `kimi web` (official local REST+WS bridge that opens a browser UI) (MoonshotAI/kimi-code).
- **Closest prior art to this app:** `agegr/pi-web` (browser UI for pi with a `ModelsConfig` panel + `MobilePwaLayout`); `CloudCLI`/`siteboon/claudecodeui` (mobile UI for Claude Code, `GET /api/providers/:provider/models`); `slopus/happy` (iOS/Android for Claude Code & Codex); `The-Vibe-Company/companion`.
- **Sheet primitive:** shadcn/ui React-Aria **Sheet** is a thin `side`-prop wrapper over RAC `Modal` — good reference for the CSS/motion you'll need (ui.shadcn.com/docs/components/aria/sheet).
- **Mobbin:** login-gated, so no stable screen URL; search "Claude – AI assistant" model-picker screen by name in the app explorer for visual confirmation (flagged as requiring manual verification).

---

## 2. Concrete spec contribution a build phase can execute

### 2.1 Component architecture (React 19 + RAC 1.20, no new deps)

```
SessionHeader (keep centered pill, but trigger a Modal)
└─ <Modal isDismissable>                                  // sheet base; sets --visual-viewport-height
   └─ <Dialog aria-label="Choose model" className="model-sheet">
      ├─ sheet header: grabber · "Model" title · close (slot="close")
      ├─ <Autocomplete filter={matchModel} defaultItems={groupedCatalog}>   // combobox pattern, in-place
      │  ├─ <SearchField><Input …/></SearchField>  (autoCapitalize/autoCorrect/enterKeyHint/search, ≥16px)
      │  └─ <ListBox selectionMode="single" selectedKeys={[activeKey]} onSelectionChange={pick}>
      │     ├─ <ListBoxSection id="provider:X"> <Header>{provider}</Header> … </ListBoxSection>  // per provider
      │     └─ renderEmptyState → "No models match"
      └─ sheet footer: status line (role=status aria-live=polite) + "current model · capability hints"
```

- **Keys:** `ListBoxItem id={`${provider}/${id}`}` everywhere; `selectedKeys` from `state.model`. Drop all `String(index)` ids.
- **State:** keep the existing reducer untouched. Derive:
  - `pendingTarget = runtime.pending?.type === 'set_model' ? `${provider}/${modelId}` : null`
  - Row states: `[data-pending]` if `pendingTarget === key`, `[data-selected]` if `activeKey === key`, `[data-disabled]` if `runtime.status !== 'ready'`.
- **Selection flow (non-optimistic):** on pick → `void setModel(provider, id)` → row shows `[data-pending]` + "Applying…" chip; sheet **stays open**; on `control-settled` (`accepted`) the row flips to selected and the header pill updates from `state.model`; on `stale` the sheet re-renders with the host's authoritative model and shows "Refreshed — host changed"; on `unavailable`/`unsupported`/`delivery-unknown` the sheet stays with an `inline-alert` and **no auto-retry** (matches `relay.ts:113–121` philosophy).

### 2.2 Exact states

| State | Trigger | Row | Sheet footer | Trigger (pill) |
|---|---|---|---|---|
| `ready` + idle | hydrated / accepted | selected row check | model + hints | enabled |
| `checking` | refresh | disabled list | "Checking runtime…" | disabled |
| `pending` | `control-start` | picked row `data-pending` + "Applying…" | "Applying…" | disabled |
| `stale` | stale rejection | host model now selected | "Refreshed — host changed" | enabled (retry is user-initiated) |
| `error` | unavailable/unsupported | none | `inline-alert` (reason) | enabled (reopen to retry) |
| `delivery-unknown` | terminal | none | barrier: "Outcome unknown — reconcile before retrying" | disabled until reconcile |
| `models` empty | catalog empty | `renderEmptyState` | "No models reported by host" | — |

Per-row pending is exact because `pending` carries `{provider, modelId}` — no reducer change required.

### 2.3 Search spec

- `useDeferredValue(query)` + `memo`ized rows; filter via `useFilter({sensitivity:'base', usage:'search'})`-style `contains` over `label + id + provider`, plus prefix-match boost on `id` (RAC `Autocomplete` `filter(textValue, inputValue)`; ComboBox default is the language-sensitive contains filter).
- Clear button (RAC `SearchField` clear) that returns focus to the field.
- Empty query → full grouped list, current model's group first, no scrolling jumps (stable `ListBoxSection` ids).

### 2.4 Gestures

- Backdrop tap / Escape close (RAC `isDismissable`). Swipe-down-to-dismiss is **optional and risky**: the home-indicator region already owns edge gestures on iPhone; if implemented, restrict the drag handle to the grabber and use `onTouchMove` threshold + `useExitAnimation`-compatible close. Minimum viable = backdrop + Escape + close button.

### 2.5 A11y

- `Dialog` `aria-label="Choose model"`; search = `role=combobox`/`aria-autocomplete=list` + `aria-controls` (RAC `Autocomplete` wires `aria-activedescendant`); list = `role=listbox`, items `role=option` with `aria-selected`.
- Footer `role="status" aria-live="polite"` (already the pattern) announces pending/stale/error; `aria-busy` on the list during `pending`.
- Search input ≥ 16px (focus-zoom), `autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="search"`.
- Sheet must not trap keyboard focus past the sheet body on rotation/keyboard toggle — rely on RAC's focus scope; verify VoiceOver reads row hints (label + capability line) via `aria-label`/`aria-describedby`.

### 2.6 Visual/motion (ink-on-parchment tokens)

- Sheet: `var(--surface-raised)`, 1px `var(--line)`, radius `1.25rem` top corners, `box-shadow: var(--shadow-raised)`; `padding-bottom: max(var(--space-6), env(safe-area-inset-bottom))`.
- **Animation:** CSS keyframes gated on `[data-entering]`/`[data-exiting]` (slide-up 36px → 0 + fade, `--duration-state`/`--ease-out`); wrap in `@media (prefers-reduced-motion: reduce)` → no transform/fade (existing pattern at `style.css:1445`). Do **not** rely on `@starting-style` (Safari coverage is too recent for an installed-PWA floor).
- Selected row: check glyph `--accent-ink`; capability chips in `--ink-muted`/mono; reasoning/vision/context badges only when host provides them (1.4).
- Optional Claude-Code-style "Default" pinned row and price line only when the host emits `cost` metadata; otherwise omit (no invented data).

---

## 3. Divergent / minority ideas worth considering

1. **Session-only vs. persisted default.** Mirror Claude Code's `Enter` vs `s`: add a small "Use as default for new sessions" toggle inside the sheet. Diverges from pi's current model (host owns `models.json`), so flag for the host/relay to confirm before building.
2. **Defer-until-turn-end.** pi applies `set_model` immediately even mid-stream; a minority option is a client-side "apply after current turn" queue with an explicit "will apply when this turn finishes" hint — reduces surprise cache-resets (Claude Code's confirmation prompt exists precisely because mid-conversation switches re-read history).
3. **Cost/`contextWindow` chips** sourced from pi's `cost`/`contextWindow` metadata (Claude Code shows prices on rows). Best differentiator against "flat label list," and fully host-confirmed.
4. **Current-model pinned chip at list top** (Claude's Default row analog) so the active model is always reachable after scrolling/filtering.
5. **No search when catalog ≤ N** — Claude iOS shows a grouped list without search when there are few models; keep search rendered-but-hidden until the catalog exceeds ~8, avoiding an empty keyboard pop on the common case. (Against the stated target bar, which explicitly wants search.)
6. **`ComboBox`-with-`manual`-trigger alternative** if the team prefers ComboBox semantics (value coercion, `allowsEmptyCollection`) over the newer `Autocomplete`; both are viable, but Autocomplete matches the sheet layout better and is newer/less battle-tested — pin a version.
7. **Shared-element morph** (header pill → sheet title) via RAC `SharedElementTransition` — iOS-flavored polish; gate behind a feature flag until Safari perf is measured.

---

## 4. Open questions + risks

- **What does `set_model` do mid-turn on the host?** Is the current streaming turn interrupted, does the change apply on the next request, and is the cache re-read a real cost the user should confirm (as Claude Code does)? The relay returns `RuntimeStateDto.streaming`, so the UI *can* know — but the *semantics* must be confirmed by the relay/host team before we choose confirm-vs-apply and copy.
- **Protocol extension for capability metadata** — new `AvailableModelDto` fields (`reasoning`, `input`, `contextWindow`, `maxTokens`, `cost`, `thinkingLevelMap`) require relay changes + guards (`guards.ts:692`). Is this in scope for the relay this cycle?
- **Catalog refresh while the sheet is open** — pi reloads `models.json` on every `/model` open; the app fetches once per mount. Should the sheet refetch on open? (Recommended: yes, mirrors pi, and the reducer's `hydrated` handles it.)
- **Retired/unknown current model** — if `state.model` is no longer in the catalog, the sheet must render it pinned and disabled rather than dropping the selection silently (Claude Code preserves the transcript model).
- **`viewport-fit=cover`** — one-line fix, but verify the app-shell borders/backdrop don't bleed into the notch; retest landscape.
- **`Autocomplete` is new in 1.20** — less field-tested than `ComboBox`; risk of needing a patch-level upgrade. Fallback is `ComboBox` with `menuTrigger="manual"` + the sheet's own ListBox.
- **Swipe-dismiss** vs. iOS home-indicator gesture — recommend skipping v1.

---

## 5. Sources

**Official docs**
- RAC Modal (sheet base; `data-entering`/`data-exiting`, `--visual-viewport-height`, `isDismissable`): https://react-spectrum.adobe.com/react-aria/Modal.html (Dialog.html)
- RAC ComboBox (`defaultFilter`/`useFilter`, `menuTrigger`, "Autocomplete vs. ComboBox" callout): https://react-spectrum.adobe.com/react-aria/ComboBox.html
- React `useDeferredValue` (interruptible background render, stale-indicator pattern): https://react.dev/reference/react/useDeferredValue
- ARIA APG Combobox pattern (roles, `aria-activedescendant`, `aria-autocomplete`): https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- Apple HIG Sheets: https://developer.apple.com/design/human-interface-guidelines/sheets
- WebKit, *Designing Websites for iPhone X* (`viewport-fit=cover`, `env(safe-area-inset-*)`, `max()`): https://webkit.org/blog/7929/designing-websites-for-iphone-x/
- web.dev, *Visual Viewport API* (keyboard/viewport): https://web.dev/articles/visual-viewport-api
- MDN `<input>` (iOS focus-zoom below 16px): https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input

**Local/installed evidence (primary source for the implementation claims)**
- `apps/pi-remote-web/src/SessionHeader.tsx`, `SessionComposer.tsx`, `runtime.ts`, `relay.ts`, `style.css`, `index.html`, `public/manifest.webmanifest`
- `packages/pi-rpc-protocol/src/types.ts` (`AvailableModelDto`, `RuntimeStateDto`, `RuntimeOperation`)
- `node_modules/react-aria-components/dist/private/Modal.js` + `Modal.mjs` (sets `--visual-viewport-*`)
- `node_modules/react-aria/dist/private/utils/useViewportSize.js` (visualViewport + iOS keyboard resize/blur handling)
- `node_modules/react-aria-components/dist/types/src/Autocomplete.d.ts`, `.../ListBox.d.ts`, `.../Popover.d.ts` (1.20 API surface)

**Prior art**
- pi CLI model switching + metadata (`/model`, `reasoning`, `contextWindow`, `cost`, `thinkingLevelMap`): https://github.com/earendil-works/pi · https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/models.md · https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/usage.md
- Claude Code `/model` picker (prices, aliases, session-only vs default, confirm-on-prior-output, allowlists): https://github.com/anthropics/claude-code · https://code.claude.com/docs/en/model-config
- opencode `/models` provider-grouped picker: https://github.com/anomalyco/opencode · https://opencode.ai/docs/models/
- Kimi Code (`/model`, `kimi web` bridge): https://github.com/MoonshotAI/kimi-code · https://moonshotai.github.io/kimi-code/en/reference/kimi-command
- Remote/mobile clients: `agegr/pi-web` (https://github.com/agegr/pi-web), `siteboon/claudecodeui` (https://github.com/siteboon/claudecodeui), `slopus/happy` (https://github.com/slopus/happy), `The-Vibe-Company/companion` (https://github.com/The-Vibe-Company/companion)
- Sheet primitive reference: shadcn React Aria Sheet (built on RAC Modal): https://ui.shadcn.com/docs/components/aria/sheet
- Mobbin (login-gated; search "Claude – AI assistant" model picker): https://mobbin.com/explore/mobile

**Key gap flagged for the build phase:** add `viewport-fit=cover` to `index.html` — the safe-area CSS is currently dead code on notch iPhones.
