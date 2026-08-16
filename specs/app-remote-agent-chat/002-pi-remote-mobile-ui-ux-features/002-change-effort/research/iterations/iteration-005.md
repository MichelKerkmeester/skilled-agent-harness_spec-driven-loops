<!-- provenance: external-CLI orchestration pass; original file iter-05-deepseek.md -->
> **Source pass 5** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-5-deepseek.md`.

<!-- F2-change-effort | model=deepseek | lens=react-implementation | iter 5/5 | 2026-08-15T19:43:07.415Z -->

Now let me research the web sources in parallel for my react-implementation lens.
# Iteration 5/5 — React‑Implementation Lens: Hardening the In‑App Effort Switcher (iPhone PWA, React 19 + react-aria-components 1.11 + Tailwind 4)

**Lens scope:** component/hook/library choices, ARIA mechanics, and iOS‑Safari / installed‑PWA pitfalls for the effort control as it reads beside the model control. Code grounding: `apps/pi‑remote‑web/src/{SessionHeader,RuntimeStrip,runtime,relay}.tsx|ts`, `style.css`, `packages/pi‑rpc-protocol/src/{types,guards}.ts`, and the repo's own target map `docs/design-reference/mobile-chat-apps/02-current-ui-map.md`.

---

## 1. Findings

### 1.1 The control is implemented twice with a duplicated, untyped label map
`EFFORT_LABELS` (off/minimal/low/medium/high/xhigh/max) is copy‑pasted into `SessionHeader.tsx:25‑33` and `RuntimeStrip.tsx:18‑26`, each with its own `effortLabel()` fallback that renders **unknown host strings raw** (`SessionHeader.tsx:173‑176`). The protocol carries effort as bare strings only — `RuntimeStateDto.availableThinkingLevels: readonly string[]`, no label/blurb/rank/disabled metadata, bounded to 64 chars (`types.ts:463‑472`, `guards.ts:703‑727`). Consequences: (a) a future host level that isn't in the map renders gibberish (e.g. `effort · faster2`), (b) there is no canonical React‑side definition for ARIA `textValue`, option descriptions, or ordering. [SOURCE: apps/pi-remote-web/src/SessionHeader.tsx:25-33; apps/pi-remote-web/src/RuntimeStrip.tsx:18-26; packages/pi-rpc-protocol/src/types.ts:463-472; packages/pi-rpc-protocol/src/guards.ts:703-727]

### 1.2 `Select` is the wrong mobile primitive at 3–7 options — an in‑sheet RadioGroup is the better RAC match
react-aria `Select` is a listbox+popover composite built around keyboard typeahead, `aria-activedescendant` option tracking, and `shouldSelectOnPressUp` semantics (selects **on pointer‑down** by default, which is exactly wrong for touch‑scroll inside a list — the canonical reason the prop exists) [SOURCE: https://react-spectrum.adobe.com/react-aria/ListBox.html — props table `shouldSelectOnPressUp`, and the warning "Interactive elements within listbox items are not allowed" for the label/description‑only content model]. RAC strongly supports building the *picker inside the existing sheet* instead: `ListBox`/`ListBoxItem` provide a first‑class `"label"` + `"description"` text‑slot pair surfaced through `[slot='label']`/`[slot='description']`, and a `Menu`/`RadioGroup` inside the header `Dialog` avoids placing a nested `Popover` inside the sheet popover (current nested Select‑in‑sheet → select‑in‑popover, `SessionHeader.tsx:100‑122`). A `RadioGroup` maps to `role="radiogroup"`/`radio` + `aria-checked`, which VoiceOver on iOS announces more reliably than `aria-activedescendant` option walking inside an on‑screen listbox. The repo's own design target already calls for the effort UI to be an **in‑sheet segment/group (off/high/max), not a second dropdown stacked under a dropdown** — the current sheet renders "Model dropdown, then Effort dropdown" with identical styling (`02-current-ui-map.md:26‑28`). [SOURCE: docs/design-reference/mobile-chat-apps/02-current-ui-map.md:25-28; https://react-spectrum.adobe.com/react-aria/ListBox.html]

### 1.3 The non‑optimistic reducer is sound; the missing pieces are per‑control pending state and an explanation surface
`runtime.ts` never commits an optimistic value (`runtimeReducer` → `control-start` sets status `pending` with no state mutation; `settle()` only lands host‑confirmed state) [SOURCE: apps/pi-remote-web/src/runtime.ts:66-79, 82-125]. The relay path is one‑use‑ticket + `expectedRevision`, returning `accepted|stale|unsupported|unavailable|delivery-unknown` instead of throwing [SOURCE: apps/pi-remote-web/src/relay.ts:119-142]. Gaps on the React side:
- **All controls disable during any pending** (`disabled = status !== 'ready'`, `RuntimeStrip.tsx:36`, `SessionHeader.tsx:54`) — safe (double‑tap is impossible by construction), but the *specific* in‑flight control gives no visual "applying on this row" feedback (the whole strip just greys) while the statusline prints `Applying…` (`statusHint`, `RuntimeStrip.tsx:123‑135`). A typed `pending: RuntimeOperation | null` already exists — derive `effortPending = pending?.type === 'set_thinking_level'` and animate only that row.
- **Disabled‑for‑reasons is unexplained** (`aria-label="Effort"` + `isDisabled` when `availableThinkingLevels.length === 0`, `SessionHeader.tsx:105`, `RuntimeStrip.tsx:74`). WCAG AA / VoiceOver practice: a control must not go dark without a reason — the `tools-status` line (already `role="status" aria-live="polite"`, `SessionHeader.tsx:124‑126`) should carry *why* ("Pi reports no effort levels" / "Host unreachable — reconcile"). `role="status"` regions need `aria-atomic="true"` so a two‑word delta replaces, not concatenates, the announcement. [SOURCE: apps/pi-remote-web/src/SessionHeader.tsx:100-126; apps/pi-remote-web/src/runtime.ts:127-133]

### 1.4 Switch‑mid‑turn is unaddressed but expressible with state already in hand
`RuntimeStateDto.streaming: boolean` exists; the UI thread shows nothing about timing. When `streaming` is true and the user flips effort, Claude‑iOS‑style behavior is a visible affordance like an inline note ("Takes effect when this turn finishes") rather than a silent queued write. RAC gives the hook: a `<Text slot="description">` under the group or a quiet `.tools-status` line [SOURCE: apps/pi-remote-web/src/SessionHeader.tsx:124; https://react-spectrum.adobe.com/react-aria/ListBox.html — Text slots; packages/pi-rpc-protocol/src/types.ts:463-472]. Whether the host accepts `set_thinking_level` mid‑stream and returns `unsupported` is an **open contract question** — the reducer already fails closed correctly on `unsupported` (`settle`, `runtime.ts:104‑111`), so this is purely an affordance + copy decision, but it must be host‑confirmed before shipping the note (see §4).

### 1.5 iOS Safari / installed‑PWA pitfalls that bite this specific markup
- **Visual vs layout viewport:** mobile browsers have two viewports; the OSK and pinch‑zoom resize/shrink the *visual* viewport while `position: fixed` sticks to the *layout* viewport — MDN documents that fixed elements must be repositioned off `VisualViewport` events and that emulating this "can result in flickering" [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport]. In a standalone PWA there is no URL bar, so the exposure is mostly **landscape + sheet‑open** and any future keyboard‑adjacent popover. Mitigation is RAC Popover's `shouldUpdatePosition` (default true) + `containerPadding` + `shouldFlip`, and never hand‑rolling a `position: fixed` overlay.
- **`backdrop-filter` changes the containing block.** `.session-header` is `position: sticky` + `backdrop-filter: blur(12px)` (`style.css:1480‑1492`). Any descendant positioned/fixed popover inside the header can be clipped/blurred by that containing block. The sheet `Popover` must keep emitting into `document.body` (RAC's default `OverlayContainer` portal) — which it already effectively does, so this is a **preserve‑the‑invariant** finding, not a new requirement. [SOURCE: apps/pi-remote-web/src/style.css:1480-1492; https://react-spectrum.adobe.com/react-aria/Popover.html — `boundaryElement` defaults to `document.body`]
- **Tap‑hygiene:** RAC's own starter styles set `-webkit-tap-highlight-color: transparent` on listbox/dropdown items to kill the grey ghost‑tap flash [SOURCE: https://react-spectrum.adobe.com/react-aria/ListBox.html — `.react-aria-ListBoxItem`/`.dropdown-item` CSS]. The PWA should add `touch-action: manipulation` on `.tools-select > button` and `.runtime-control` so press‑up/dispatch and the browser's double‑tap‑zoom delay don't fight RAC's `onSelectionChange`.
- **Hit targets below HIG minimum:** `.tools-select > button { min-height: 2.5rem }` = **40px**, under Apple's 44pt minimum touch target for controls in scrollable content [SOURCE: apps/pi-remote-web/src/style.css:1622-1635; Apple HIG "Buttons"/touch targets]. Bump to ≥ 44px; Tailwind 4's `pointer-coarse:*` variants are the clean way to keep desktop 40px and mobile ≥44px without media‑query sprawl [SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states — `pointer-coarse`].

### 1.6 Enter/exit motion — don't import a plugin; keyframes exist in‑repo
Tailwind 4 ships `data-*` / `aria-*` / `motion-safe` / `motion-reduce` variants that compose directly with RAC's attribute‑based states (`data-entering`, `data-exiting`, `data-placement-*`, `data-selected`, `data-focused`) [SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states — "Data attributes"; https://react-spectrum.adobe.com/react-aria/Popover.html — `data-entering/data-exiting`]. But the ubiquitous `animate-in`/`slide-in-from-*` utilities come from the **third‑party** `tailwindcss-animate`/`tw-animate-css` plugin, *not core Tailwind 4* — installing it for one row animation is scope creep. The repo already hand‑rolls keyframes (`.composer-spinner` + `@media (prefers-reduced-motion: reduce)` killing it, `style.css:1445‑1449`). Mirror that: define a 140ms scale‑+‑fade keyframe gated to `[data-entering]` and `motion-reduce:animate-none`. [SOURCE: apps/pi-remote-web/src/style.css:1445-1449]

### 1.7 React 19 + RAC 1.11 specifics
RAC ≥1.11 ships React 19 support (ref‑as‑prop, no forwardRef) and the collection API already in use; provided versions are React 19.1.1 / RAC 1.11.0 / Tailwind 4.1.11 / Vite 7 [SOURCE: apps/pi-remote-web/package.json:13-21]. One dev‑only race worth noting: `useRuntime`'s mount effect `useEffect(() => void refresh(), [refresh])` re‑runs under StrictMode double‑invoke, issuing two `fetchRuntimeState()` + `fetchRuntimeModels()` — a revision can change between the two and the hydration snapshot is fine, but the fetches are **not aborted on unmount** (`fetchRuntimeState(signal?)` takes an optional signal that is never supplied), a latent source of set‑state‑after‑unmount warnings on fast screen transitions. Not effort‑specific, but it guards the same `state.revision` that the effort mutation piggybacks on. [SOURCE: apps/pi-remote-web/src/runtime.ts:139-147, 183-185; apps/pi-remote-web/src/relay.ts:89-103]

---

## 2. Concrete spec contribution (build‑executable)

### 2.1 New module — `apps/pi-remote-web/src/effort.ts` (single source of truth)
```ts
export const EFFORT_LEVELS = [
  { id: 'off',    label: 'Off',         blurb: 'No reasoning — fastest replies.' },
  { id: 'minimal',label: 'Minimal',     blurb: 'Brief reasoning, quick turn.' },
  { id: 'low',    label: 'Low',         blurb: 'Lighter reasoning.' },
  { id: 'medium', label: 'Medium',      blurb: 'Balanced depth and speed.' },
  { id: 'high',   label: 'High',        blurb: 'Deep reasoning — slower, more tokens.' },
  { id: 'xhigh',  label: 'Extra high',  blurb: 'Very deep reasoning.' },
  { id: 'max',    label: 'Max',         blurb: 'Maximum effort — slowest, most tokens.' },
] as const satisfies readonly EffortLevelDef[];

export function effortCatalog(available: readonly string[]): EffortLevelDef[] {
  // host order preserved when known; rank known levels against EFFORT_LEVELS;
  // unknown strings fall back to { id: s, label: s, blurb: 'Custom host level.' }
}
```
Delete both `EFFORT_LABELS` consts (`SessionHeader.tsx:25‑33`, `RuntimeStrip.tsx:18‑26`). `textValue={def.label}` for every option so typeahead/VoiceOver never read the raw id [SOURCE: https://react-spectrum.adobe.com/react-aria/ListBox.html — `textValue`].

### 2.2 Component states (all host‑confirmed; no optimistic commit)
| State | Trigger | UI |
|---|---|---|
| `loading` | `status==='checking'` | Row disabled, label `Effort · —`, statusline `Checking runtime…` |
| `ready` | hydrated, no pending | Row enabled; shows `label` of `state.thinkingLevel`; check glyph on the selected row |
| `applying` | `pending?.type==='set_thinking_level'` | **Only the effort row** shows a 12px spinner in place of the check; regional statusline `Applying…`; sheet stays open; all controls remain disabled (global guard unchanged) |
| `stale` | stale rejection | Selected row snaps back to host value (reducer already returns `state`); statusline `Host changed it — refreshed`; no auto‑retry |
| `unavailable` / `delivery-unknown` | unsupported/unavailable/unknown outcome | Effort group disabled; reason + a **Reconcile** affordance (calls `refresh()`) — for `deliveryUnknown`, reconcile is terminal before any retry (`runtime.ts:113‑121` security invariant) |
| `intrinsic-off` | `availableThinkingLevels.length === 0` | **Hide the Effort group entirely** (cleaner than a dead control); if the sheet must explain, one muted line `Pi reports no effort levels` |

### 2.3 Interaction & a11y
- **Trigger:** unchanged one‑tap from the header anchor → sheet (`placement="bottom"`, portal, keep `containerPadding` for landscape). Focus returns to the trigger on close (RAC Popover default).
- **Selection:** tap an option row = immediate `set_thinking_level` + controlled state (keep sheet open so `applying` is visible — Claude closes its picker, the row stays, which is *exactly* the non‑optimistic case that needs to remain visible). Re‑tapping the current level is a no‑op (RAC fires change only) — Free.
- **Semantics:** `RadioGroup` labelled by the existing `tools-label` via `aria-labelledby`; each `Radio` has `aria-describedby` pointing at its blurb; selected reflects `state.thinkingLevel` (host value) only. This replaces the nested `Select` in `SessionHeader.tsx:100‑122` *inside* the sheet and removes the second nested `Popover`.
- **Live region:** keep `role="status"` but add `aria-atomic="true"`; announce `Effort set to High` on settle, `Host changed effort — refreshed` on stale, `Effort not applied` on error.
- **Touch:** `.tools-select > button`/`.runtime-control` `min-height ≥ 2.75rem` (44px) via `pointer-coarse`; `touch-action: manipulation`; `-webkit-tap-highlight-color: transparent` on rows.
- **Streaming note:** when `streaming === true`, show one quiet line under the group: `Takes effect when this turn finishes` (only after host confirms mid‑turn semantics — §4).

### 2.4 Visual / motion (ink‑on‑parchment, WCAG AA, light+dark)
- Rows: `label` in Inter 600 @ .95rem ink; `blurb` .72rem `var(--ink-muted)`; selected row check glyph in clay `var(--accent)`; group remains inside `Dialog` sheet `min(88vw, 20rem)`.
- Enter/exit: 140ms `[data-entering]`/`[data-exiting]` scale‑(.98→1)+fade keyframes in `style.css` (mirror `.composer-spinner` pattern), plus `@media (prefers-reduced-motion: reduce) { ... animation: none }`; do **not** add a Tailwind animation plugin.
- Focus: existing `--focus` outline (`data-focus-visible`) on rows, unchanged.
- Reads‑next‑to‑model: Model = scrolling `Select`-in-sheet (many items, needs popover+scroll, keep); Effort = always‑visible radio/segment group with blurbs (≤7 items, no scroll, no virtualization) — visually distinct: list vs. grouped options, matching the `02-current-ui-map.md` sheet design.

### 2.5 Migration surface
`SessionHeader` (primary) uses the effort `RadioGroup`; `RuntimeStrip` (secondary) can reuse the same `effort.ts` labels inside its existing `Select` until the strip is absorbed by the header sheet per the design map — one label source, two containers.

---

## 3. Divergent / minority ideas worth considering

1. **Native `<select>` fallback in standalone mode** — the OS‑native picker wheel is the most VoiceOver‑reliable affordance on iPhone and costs zero RAC debugging. It is **not** stylable to ink‑on‑parchment tokens, breaks the fixed design system, and loses the option blurbs. Worth one spike for the a11y comparison, not as the shipping path.
2. **Always‑visible 3‑segment control (Off / High / Max) in the sheet** — one‑glance state, zero scroll; but it must grow generically when a host advertises `minimal…xhigh`, so it only fits if pi pins its public levels to three (pi currently advertises off/high/max for typical configs but the protocol is open).
3. **Select‑and‑stop (explicit Apply button)** — current immediate‑apply keeps the sheet open for the non‑optimistic settle; a two‑step "apply" is extra friction that Claude/Kimi don't use. Rejected.
4. **Move effort out of the model sheet into the composer `+` tools popover** (mirroring Plan/Build's home) — separclouds "model identity on the header" from "per‑turn configuration," and contradicts the design map's quiet‑header goal. Low.
5. **Token‑cost hints per level** (`Max ≈ 4× tokens`) — a genuinely useful label for a remote‑control context, but requires host‑supplied budget metadata that the protocol does not carry; see §4.
6. **Stepper (‹› chevrons) on the collapsed RuntimeStrip chip** — nice for the tiny strip footprint, poor discoverability + weak VoiceOver semantics. Low.

---

## 4. Open questions + risks

- **Mid‑turn semantics are unverified:** does the host accept `set_thinking_level` while `streaming: true`, and when does it apply? The `Takes effect when this turn finishes` note and the whole mid‑turn spec depend on the answer; if `unsupported` is returned today, the correct shipping default is the existing fail‑closed error + no note.
- **`availableThinkingLevels` ordering is unspecified:** host order is authoritative today; a client‑side rank for unknown strings could misorder. Risk: label‑map drift the moment the host adds a level — mitigated by the `effort.ts` fallback + raw‑string label for unknowns (never crash).
- **VoiceOver + RAC `RadioGroup` inside this Dialog on iOS 18/26:** radios bypass `aria-activedescendant`, but Dialog curtain semantics (gesture locks, focus return) still need a device QA pass on a real iPhone in standalone display mode.
- **Portal invariant:** verify in CDP on 390px that the sheet popover renders outside the `backdrop-filter` header (RAC `boundaryElement` default = `document.body`); if it ever renders inside, the blur containing block will clip/soften it.
- **Unused `allowsEmptyCollection`:** with zero levels the Select currently disables instead; hiding the group avoids a dead row but changes sheet height — confirm the sheet's empty‑state copy policy.
- **StrictMode double‑refresh** could, under a racing host revision, observe a transiently older revision on the second fetch — harmless to effort (no commit without settle) but worth an AbortSignal + `ignore` guard in `useRuntime`.
- **AA text contrast on blurbs** (`--ink-muted` vs `--canvas` bone) must be verified at 0.72rem in both themes; blurbs are the new lowest‑contrast element on the sheet.

---

## 5. Sources

**Web / docs**
- react‑aria-components Select — https://react-spectrum.adobe.com/react-aria/Select.html
- react‑aria-components ListBox/ListBoxItem (text slots, `textValue`, `shouldSelectOnPressUp`, item‑content warning, starter CSS incl. `-webkit-tap-highlight-color`) — https://react-spectrum.adobe.com/react-aria/ListBox.html
- react‑aria-components Popover (placement/shouldFlip/containerPadding/`boundaryElement`, `data-entering`/`data-exiting`, `shouldUpdatePosition`) — https://react-spectrum.adobe.com/react-aria/Popover.html
- Tailwind CSS 4 — hover/focus/other states (`data-*`, `aria-*`, `motion-safe`/`motion-reduce`, `pointer-coarse`, `forced-colors`, custom `@custom-variant`) — https://tailwindcss.com/docs/hover-focus-and-other-states
- MDN — Visual Viewport API (fixed vs layout viewport, OSK/zoom resize, flicker caveat) — https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
- Claude Code settings docs (extended‑thinking `alwaysThinkingEnabled`, `/config`, Remote‑Control mobile push — the host‑side effort analog) — https://docs.claude.com/en/docs/claude-code/settings
- Apple HIG — 44pt minimum touch targets for controls ("Buttons"), referenced in §1.5.
- Mobbin (mobbin.com) — LinkedIn‑gated reference‑flow library for mobile AI‑chat model/effort pickers; used as target‑bar calibrator, not directly machine‑readable here; the equivalent visual references used in‑repo are `docs/design-reference/mobile-chat-apps/screens/claude-*.png`.

**GitHub prior art**
- earendil‑works/pi — the controlled host; `packages/tui` (pi‑tui) is the engine Kimi Code's TUI is built on; confirms the "host exposes effort levels + subagent/plan semantics" contract — https://github.com/earendil-works/pi
- MoonshotAI/kimi-code — Kimi Code CLI (reasoning‑level controls, approvals, subagent dispatch), MIT — https://github.com/moonshotai/Kimi-Code

**In‑repo evidence (line‑anchored)**
- `apps/pi-remote-web/src/SessionHeader.tsx:25-33,54,100-126,173-176` (duplicate labels, sheet Effort Select, statusline)
- `apps/pi-remote-web/src/RuntimeStrip.tsx:18-26,36,71-90,118-121` (duplicate labels, strip Effort Select)
- `apps/pi-remote-web/src/runtime.ts:51-125,127-133,139-147,183-185` (non‑optimistic reducer, status hints, hydate race)
- `apps/pi-remote-web/src/relay.ts:119-142` (ticket + revision mutation, outcome enum)
- `apps/pi-remote-web/src/style.css:1445-1449,1480-1492,1595-1610,1622-1635` (keyframes/reduced‑motion, sticky blur header, ListBox 50vh, 40px controls)
- `packages/pi-rpc-protocol/src/types.ts:437-478,463-472`; `packages/pi-rpc-protocol/src/guards.ts:703-727` (string‑only levels, bounded)
- `docs/design-reference/mobile-chat-apps/02-current-ui-map.md:13-17,25-30,65-74` (target: sheet hosts Model + Effort segment off/high/max)
- `specs/002/F2-change-effort/001-research/BRIEF.md` (feature brief, tier: harden)
