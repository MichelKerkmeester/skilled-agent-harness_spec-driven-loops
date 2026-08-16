<!-- provenance: external-CLI orchestration pass; original file iter-03-deepseek.md -->
> **Source pass 3** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-3-deepseek.md`.

<!-- F1-change-model | model=deepseek | lens=accessibility-i18n | iter 3/5 | 2026-08-15T19:06:56.845Z -->

Apple docs are JS-gated. Pivoting to fetchable primary sources (W3C APG, React Aria, MDN/WebKit) and web search for prior art.
Good — got APG combobox + React Aria ComboBox. DuckDuckGo is bot-blocked. Switching to GitHub API + Bing + MDN for the remaining grounding.
This is the actual Pi Remote monorepo — let me ground the spec in the real web app (model switcher, sheet, tokens).
Strong grounding from the repo. Now final verification batch: contrast math, prior-art repo existence, and `<dialog>`/Tailwind direction facts.
# Pi Remote — Model Switcher · Iteration 3/5 — Accessibility & i18n Lens

**Scope of this pass:** harden the existing in-app model switcher (currently: `SessionHeader.tsx` model-trigger → `DialogTrigger` → `Popover` → `Dialog` → nested react-aria `Select` → `ListBox`) from an accessibility + internationalization angle. All claims below are grounded in verified sources, the live repo (`apps/pi-remote-web`), or computed WCAG relative-luminance math.

---

## 1. Findings — Accessibility & i18n, iPhone PWA + this stack

### 1.1 The current DOM is a nested Select-in-Dialog, which is the weakest possible VoiceOver shape

- `SessionHeader.tsx:73–97` renders the sheet as `DialogTrigger → Popover → Dialog("Model and effort") → Select → Button → Popover → ListBox`. A second nested popover inside a modal dialog means three stacked focus containers; on VoiceOver this reads as nested "popup → dialog → popup", and the sheet's own search-less list defeats typeahead.
- The WAI-ARIA APG is explicit that when a combobox's popup is a **dialog**, `aria-activedescendant` is not supported and **DOM focus must move into the dialog** ([APG combobox, "Dialog Popup Keyboard Interaction"](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)). A full-screen sheet is better built as either (a) an **editable ComboBox** whose popup is a listbox (then `aria-activedescendant` is legal and VoiceOver announces "N results, selected X" as you arrow), or (b) a `role=dialog` containing a search `input` + a `ListBox` with roving tabindex. The repo already contains a working, correct ComboBox precedent — the slash-command picker in `SessionComposer.tsx:224–251` (`menuTrigger="focus"`, `allowsEmptyCollection`, `renderEmptyState`, per-item `textValue`). The model switcher should be reshaped to that same pattern rather than a nested Select.
- **Selection semantics:** the current `Select` gives the row `aria-selected` + text color change. For a non-optimistic, host-confirmed `setModel` (`runtime.ts:170–173`, `apply()` at `runtime.ts:149–168`), the control's own selection *is* optimistic UI while the header chip only updates on acceptance. VoiceOver will announce "selected" instantly and then the header may not change for 100–800 ms — the AT user needs an explicit **result announcement**, not just a static selected state.

### 1.2 Reduced motion: only one guard exists today

- The sole `prefers-reduced-motion` rule in the app is for `.composer-spinner` (`style.css:1445–1449`). The sheet popover, its enter/exit, and every `--duration-*` transition (`--duration-fast: 120ms`, `--duration-state: 220ms`, `style.css:88–89`) are unguarded.
- `prefers-reduced-motion` is Baseline and maps to iOS **Settings → Accessibility → Motion → Reduce Motion** ([MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion); [WebKit, "Responsive design for motion"](https://webkit.org/blog/7551/responsive-design-for-motion/)).
- **WCAG 2.2 AA 2.3.3 (Animation from Interactions)** is directly in scope here: the sheet open/close is an interaction-triggered animation and must be suppressible ([WCAG 2.2, 2.3.3](https://www.w3.org/TR/WCAG22/#animation-from-interactions)). The fix is not just killing the spinner — the sheet slide must degrade to a cross-fade under `reduce`.

### 1.3 Dynamic Type: the biggest true gap for this app (custom fonts on iOS)

- The app uses Inter + Source Serif 4 with **rem-based** sizes (`style.css:22–29`, `font-size: 1rem`, `0.95rem`, `0.68rem`). On iOS, **Dynamic Type only scales system fonts**; a custom-rem page does **not** grow with Settings → Accessibility → Display & Text Size. It *does* scale with Safari **Page Zoom** and pinch-zoom, which satisfies WCAG 1.4.4 "Resize text (200%)" ([WCAG 2.2, 1.4.4](https://www.w3.org/TR/WCAG22/#resize-text)) but silently misses the Dynamic Type expectation that users on iPhone have.
- The known workaround is a measurement probe: apply `font: -apple-system-body` to a hidden element, read `getComputedStyle().fontSize`, and map it onto a `--dt-scale` custom property (documented technique used by multiple PWA shops; the font keyword is the standard way to access the accessibility font size in Safari). This is genuinely fragile — the alternative is an in-app text-size control, or formally accepting zoom-based scaling.
- `-webkit-text-size-adjust: 100%` should be pinned so iOS Safari's auto-inflation doesn't cause horizontal reflow at small viewports (relevant to WCAG 1.4.10 Reflow) ([MDN text-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust)).
- **Consequence for the sheet:** `width: min(88vw, 20rem)` (`style.css:1455`) and `.react-aria-ListBox { max-height: 50vh }` (`style.css:1595–1601`) are fixed units; at 200% zoom or at Dynamic Type XXXL the fixed `20rem` cap can clip provider labels. The list needs `min-width: 0`, wrapping, and `dvh`/fluid sizing.

### 1.4 Contrast: the clay accent fails WCAG AA in several real usages (computed)

Computed with the WCAG relative-luminance formula (`style.css` tokens):

| Pair | Ratio | Verdict |
|---|---|---|
| `#d97757` (clay) on `#f8f8f6` (bone) | **2.94:1** | ❌ fails 4.5:1 (text) **and** 3:1 (non-text UI, 1.4.11) |
| `#d97757` on `#ffffff` | **3.12:1** | ⚠️ passes 3:1, fails 4.5:1 for small text |
| `#d97757` on dark `#3a2720` (accent-soft) | **4.51:1** | ✓ |
| `--accent-ink #8a452f` on `#ffffff` | **7.06:1** | ✓ |
| `--accent-ink #8a452f` on `#f3e4de` (accent-soft) | **5.71:1** | ✓ |
| `--ink-muted #6c6a65` on bone `#f8f8f6` | **5.08:1** | ✓ (tools-label at 0.68rem passes) |
| `--ink-muted #6c6a65` on `#ffffff` | **5.40:1** | ✓ |
| dark `--ink-muted #9f998f` on `#24221f` | **5.61:1** | ✓ |
| dark selected-row `#f0b19a` on `#3a2720` | **7.69:1** | ✓ |

**Implication:** any small-text or indicator that uses raw `--accent` (`#d97757`) on bone/white fails AA (1.4.3 / 1.4.11). The design system already provides `--accent-ink` (`#8a452f`) which is AA for text, and `--accent-strong` (`#b85f42`, 4.42:1 on white) which is AA-safe for UI elements. The spec must introduce explicit semantic tokens (`--accent-text`, `--accent-ui`) rather than reusing `--accent` for small text. Current selected-row styling (`ListBoxItem[data-selected]` → `color: var(--accent-ink)` + weight 640, `style.css:1617–1619`) is AA-passing but **color+weight only** — add a check glyph + tint so selection is perceivable beyond color (WCAG 1.4.1).

### 1.5 RTL & long strings: not handled at all today

- `index.html:2` hardcodes `<html lang="en" data-theme="system">` — no `dir`. There is no RTL handling anywhere (grep for `dir`/`rtl` in `src/` returns nothing).
- Tailwind 4 ships logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) confirmed in the spacing docs ([Tailwind margin docs](https://tailwindcss.com/docs/margin)); MDN documents the underlying logical-properties model ([MDN CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values/Basic_concepts)). The header's `grid-template-columns: 2.75rem 1fr 2.75rem` is direction-agnostic and fine; the risk is physical padding like `padding: 0.4rem 0.85rem` and `padding: var(--space-2) var(--space-3)` on rows — these should be `ps/pe` logical pairs.
- **Model identifiers are ASCII LTR.** In an RTL layout, `claude-sonnet-4-5-20250929` must be wrapped in `dir="ltr"` + `unicode-bidi: isolate` so hyphens and numerals don't reorder/reflect. Inter has no Arabic/Hebrew coverage; the stack must fall through to an Arabic-capable system font (`system-ui` → SF + Geeza Pro on iOS) — the current `font-synthesis: none` (`style.css:34`) is fine here but the UI must never render model/provider ids in a font that boxes them.
- Long ids already truncate on the trigger (`.session-model-name`, `style.css:1545–1549` ellipsis) — but the **full id must be in the accessible name** (`aria-label`/`title`), and the sheet list should allow 2-line wrapping (`overflow-wrap: anywhere`) rather than clipping at fixed `20rem`.

### 1.6 Focus management & AT input methods (hardware keyboard / Voice Control / Switch Control / Full Keyboard Access)

- react-aria-components `DialogTrigger`/`Popover`/`Dialog` already do the hard parts: focus moves into the dialog on open, focus returns to the trigger on close, Escape closes, and `data-focus-visible` is emitted ([React Aria Dialog](https://react-spectrum.adobe.com/react-aria/Dialog.html)). The app already styles `[data-focus-visible]` outlines using `--focus` (`style.css:1515–1518`). Two gaps:
  1. **ListBoxItem keyboard focus is background-only** (`[data-focused]` → `background: var(--surface-muted)`, `style.css:1612–1615`); `surface-muted` vs `surface-raised` is a sub-3:1 difference. Keyboard users need `outline`/`box-shadow` on `[data-focus-visible]` (WCAG 2.4.7 Focus Visible).
  2. **Touch targets below Apple's 44 pt minimum.** `.session-model-trigger` is ~33–36 px tall (`padding: 0.4rem 0.85rem` + 1rem font, `style.css:1520–1534`); `ListBoxItem` rows are ~37 px (`0.5rem` v-padding + `0.95rem` font, `style.css:1603–1610`). Apple HIG requires 44×44 pt tap targets ([Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/)); WCAG 2.2's 24×24 minimum (2.5.8) is met, but the target bar here is the Claude/Kimi apps, which are ≥44 pt. Both the trigger and list rows should be ≥44 px (`min-height: 2.75rem`).
- **iOS PWA specifics to verify on device:** standalone-mode focus restoration after modal close; `focus({ preventScroll: true })` into the search field; `100dvh` vs `100vh` for the sheet; the software keyboard covering the list (use `visualViewport` / position the sheet's list to stay above the keyboard).

### 1.7 Status/async announcements — the contract already has the states, the AT wiring doesn't

`runtime.ts` models exactly the states the feature needs: `checking | ready | pending | stale | error` (`runtime.ts:17`), a `pending` operation (`runtime.ts:23`), and a `settle()` that distinguishes `accepted | stale | unsupported | unavailable | delivery-unknown` (`runtime.ts:82–125`). The UI already renders a `role="status" aria-live="polite"` line in the sheets (`SessionHeader.tsx:124`, `SessionComposer.tsx:254`), but it only maps the coarse `runtime.status` (`statusHint`, `SessionHeader.tsx:178–191`) — it never announces **per-model** results. Because `delivery-unknown` is terminal and must never be auto-retried (`runtime.ts:113–121`), that failure class needs `role="alert"`/`aria-live="assertive"`, not polite.

### 1.8 Prior art (verified live GitHub repos, July 2026)

- **Kimi Code CLI** — `MoonshotAI/kimi-cli` (11.2k★) and `MoonshotAI/kimi-code` (6.7k★): the app itself has no mobile client, but its model/provider selection is the interaction the sheet must feel like. Related: `Leechael/pi-provider-kimi-code` (reuses Kimi plans inside pi agents — evidence of cross-agent model/provider surfacing), `Doriandarko/kimi-2-6-code` (terminal coding agent with model switching).
- **claude-code ecosystem** — `anomalyco/opencode` (197k★, the pi agent's peer, with model switching in TUI) and `cline/cline` (66k★, VS Code agent whose model picker is the closest desktop precedent: provider group headers + per-model capability captions).
- **Mobile LLM clients** — `gluonfield/enchanted` (iOS/macOS Ollama client; the only real iOS prior art for a model list inside a mobile AI app), `artcc/openclient-llm` (native iOS/macOS LLM client), `simonw/llm` (CLI model registry pattern).
- **Mobbin** — the Claude iOS and Kimi app screens are login-gated and could **not** be fetched programmatically this pass; the build phase should capture the "model picker" flows from Mobbin manually (`https://mobbin.com`, apps: Claude AI, Kimi) for the visual/motion target bar. Everything a11y/i18n-specific here is grounded in the primary sources listed in §5.

---

## 2. Concrete spec contribution (buildable)

Replace the nested `Select` (`SessionHeader.tsx:77–97`) with a **searchable `ComboBox` sheet** — reuse the repo's own `SessionComposer` command-picker pattern — and add a dedicated result-announcement region. The trigger button stays the host-confirmed chip.

### 2.1 Exact states and their a11y wiring

| State | Trigger (`aria-expanded`, `aria-controls`) | Sheet content | Announcement | Notes |
|---|---|---|---|---|
| **Collapsed** | `aria-expanded=false`, `aria-haspopup="listbox"`, accessible name = `"Model, {label}"`; full id in `aria-label`/`title` | — | — | 44 px min hit area |
| **Open / searching** | `aria-expanded=true` | search `input` (focus on open, `preventScroll:true`); `ComboBox` with `menuTrigger="focus"`, `allowsEmptyCollection`, `renderEmptyState` "No models match" | polite: result count via `aria-live` | `defaultFilter` (language-sensitive `contains`, case/diacritic-insensitive — RAC default) |
| **Highlight** (arrow keys) | — | `aria-activedescendant` (RAC) | announce `label, provider, selected` | set each option `textValue={provider + " " + label + " " + id}` so search + SR text match provider |
| **Selecting** | — | selection highlighted **optimistically inside the control** (check glyph + `--accent-soft` tint + `--accent-ink` text — not color-only, 1.4.1) | — | `setModel(provider, id)` fires once |
| **Pending** (`runtime.status==='pending'`) | `aria-busy="true"`; `isDisabled` (already the contract: `disabled = status !== 'ready'`) | spinner (static under reduced motion) | polite: "Applying…" | prevent double submit |
| **Accepted** | header chip updates (host-confirmed only) | sheet closes, focus returns to trigger | polite: "Model set to {label}" | do **not** re-announce runtime status line (dedupe) |
| **Stale** (revision mismatch) | — | list replaced with host-confirmed state; stale row visually + `aria-selected` reset; "Refresh list" button | polite: "Host updated the model — list refreshed" | never auto-retry (`runtime.ts:94–103`) |
| **Error** (`unsupported`/`unavailable`) | — | inline message in sheet, `aria-invalid` on control, `aria-describedby` links message; "Retry" re-fetches models | `role="alert"` (assertive) for terminal, polite for recoverable | keep prior selection intact |
| **Delivery unknown** | — | terminal state; block re-submit; "Reconcile" only | **assertive** | per `runtime.ts:113–121` |
| **During running turn** | — | sheet overlays, background inert only if modal; the composer/transcript stay functional server-side; announce "Model applies to the next turn" if the host defers | live region must live **inside** the sheet so VoiceOver reads it while the modal is open | close → focus returns to trigger |

### 2.2 Focus & input methods
- Open → `autofocus`/initial focus into the search `input`; Escape closes (sheet) then nested list; Tab/Switcher order: search → list → refresh/retry → close.
- Full keyboard set per APG combobox: Down/Up, Home/End, printable-char typeahead, Enter accept, Esc dismiss, `Alt+Down` reopen ([APG combobox keyboard](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)). These come free with RAC `ComboBox`.
- `[data-focus-visible]` outline (2px `--focus`, offset 2) on **rows and search**, not just background fill (2.4.7).
- 44 px min-height on trigger and every row (matches Apple HIG and Claude/Kimi).

### 2.3 Motion
- Global guard: `@media (prefers-reduced-motion: reduce)` — sheet/rows use opacity-only fade (≤150 ms), no translate/scale/spring; spinner static; `scroll-behavior: auto`; all `--duration-*` transitions collapse to `0.01ms` **only for motion-bearing properties** (respect 2.3.3). Non-motion transitions (color) may stay.
- Default (no preference): sheet slide-up + gentle scale, 220–280 ms `--ease-out`; row entrance stagger **only** if it can be killed under reduce — otherwise omit stagger (2.3.3 risk).

### 2.4 Dynamic type / resize (1.4.4, 1.4.10)
- Adopt the `-apple-system-body` probe → `--dt-scale` custom property, applied as `font-size: calc(1rem * var(--dt-scale))` at the root, so Dynamic Type sizes A…XXXL visibly grow the UI. **Fallback contract:** if the probe fails, default scale 1.0 and WCAG 1.4.4 is still satisfied via Safari Page Zoom.
- Set `-webkit-text-size-adjust: 100%`.
- Sheet geometry fluid: `width: min(88dvw, 22rem)` with `max-height: min(60dvh, 40rem)`; list `overflow-wrap: anywhere`, rows `min-height: 2.75rem`, flex children `min-width: 0`. Must pass a 320 CSS px / 200%-zoom audit with no clipping (1.4.10 Reflow).

### 2.5 Contrast tokens (from §1.4 math)
- Introduce `--accent-text` (= `--accent-ink` in light, `#f0b19a`-family in dark) for **all** small text accents; `--accent-ui` (= `--accent-strong` in light, clay in dark) for UI/non-text indicators ≥3:1. Never render small text in raw `--accent` on bone/white (2.94:1).
- Selection = check glyph + `--accent-soft` background + `--accent-ink` text; state must not rely on color alone (1.4.1).

### 2.6 RTL & long strings
- `dir="rtl"` on `<html>` (per user locale); RAC `ComboBox`/`Dialog` accept `dir` and flip placement automatically.
- Replace physical spacing with logical utilities (`ps/pe/ms/me/start/end`) in the sheet + rows; chevron flips in RTL; sheet slide uses logical inset so the motion mirrors.
- Model/provider ids: wrap in `dir="ltr" unicode-bidi: isolate` + `translate="no"`; never ellipsize without the full id in the accessible name; allow 2-line wrap in rows.
- Font stack gains explicit fallbacks for Arabic/Hebrew/CJK (e.g., `system-ui, -apple-system, 'SF Arabic', 'Geeza Pro', 'PingFang SC', sans-serif`) so RTL never boxes.

### 2.7 i18n
- Move all strings (`Model`, `Effort`, `Applying…`, `Refreshed — host changed`, `Unavailable — reconcile`, `No models match`, `Model set to {label}`, `Host updated the model`) into a message catalog; `Intl.PluralRules` for "N models", `Intl.ListFormat` for provider lists.
- The announcement strings are the highest-priority translation surface (SR users get them verbatim); keep the live region **always in the DOM**, update via `textContent` (iOS VoiceOver drops announcements on node replacement).
- `lang` per sheet for mixed content; `translate="no"` on model/provider ids.

---

## 3. Divergent / minority ideas (resisting convergence)

1. **Native `<dialog>` + `showModal()` sheet instead of RAC Popover.** Safari 15.4+ supports `<dialog>` ([caniuse/dialog](https://caniuse.com/dialog)), giving `::backdrop`, free `inert` background, and Escape handling — could *replace* the nested-popover scaffolding entirely and is the closest thing iOS PWA has to UIKit's modal presentation. The double-popover nesting is a genuine a11y smell worth removing, not patching.
2. **Keep-the-sheet-open-until-accepted** (opposite of Claude iOS): show "Applying…" in place, animate the check only on host confirmation, and only then close. More truthful to the non-optimistic contract, at the cost of a visible lag — a defensible minority trade-off that the host-confirmed architecture actually *invites*.
3. **In-app text-size control** instead of the `-apple-system-body` probe — a deterministic, testable scaling (XS→XXXL menu in the sheet) that sidesteps WebKit fragility and is auditable against 1.4.4. Minority because it duplicates the OS control.
4. **Per-turn model override**: a "model for the next turn only" toggle inside the switcher. Divergent scope, but it would make "switch during a running turn" a *feature* rather than an edge case, and matches how pi's host actually sequences model changes.
5. **Skip `--dt-scale` entirely and ship zoom-only scaling**, documenting 1.4.4 as satisfied by Page Zoom — the honest, lowest-risk option that Claude's *web* app also uses (its iOS app, being native, gets Dynamic Type for free — a bar the PWA can only approach, not match).

---

## 4. Open questions + risks

- **Does the host apply `set_model` mid-turn or queue to the next turn?** This decides the "Model applies to the next turn" announcement and whether the sheet must stay open during a running turn. Needs a host-side check; unverified.
- **VoiceOver live-region reliability during mutation + ListBox re-render** on iOS 17/18 — cannot be verified headlessly; requires device QA with VoiceOver, Full Keyboard Access, and Switch Control.
- **`-apple-system-body` probe fragility** across iOS versions and its interaction with the design system's Inter variable font (size-only vs family inheritance). Decide the fallback policy in §2.4 before building.
- **RAC `ComboBox` dual-control complexity** (`value` + `inputValue`) with a *controlled, host-confirmed* value and `allowsCustomValue=false`: a stale filtered state could show a row that's no longer in `runtime.models`. Needs a settle-on-hydrate rule.
- **Reduced-motion blanket rule risk**: a naive `* { transition-duration: 0.01ms }` kills legitimate color fades and hurts perceived responsiveness; the spec's property-scoped approach needs discipline, and 2.3.3's "essential motion" carve-out should be interpreted conservatively for a control surface.
- **Accent token ripple**: repurposing `--accent`/`--accent-strong` changes could affect existing components (status pill, switch, approval UI). Must add new tokens, never mutate.
- **Keyboard/sheet height on iPhone**: `50vh` → `dvh`, plus `visualViewport` handling when the search field's keyboard opens over the list — needs on-device verification (iOS PWA standalone quirks).
- **Focus restoration in standalone mode** after modal close is historically flaky in iOS PWA; needs a device pass and a `focus({ preventScroll: true })` fallback on the trigger.

---

## 5. Sources

**Standards & platform**
- WAI-ARIA APG, Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WAI-ARIA APG, Modal Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WCAG 2.2 (2.3.3 Animation from Interactions; 1.4.4 Resize Text; 1.4.10 Reflow; 1.4.11 Non-text Contrast; 2.4.7 Focus Visible; 2.5.8 Target Size): https://www.w3.org/TR/WCAG22/
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- WebKit Blog, "Responsive design for motion": https://webkit.org/blog/7551/responsive-design-for-motion/
- MDN `text-size-adjust`: https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust
- MDN CSS logical properties: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values/Basic_concepts
- MDN `<dialog>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog · Safari support: https://caniuse.com/dialog
- Apple HIG — Accessibility (incl. Dynamic Type, 44 pt targets, Reduce Motion): https://developer.apple.com/design/human-interface-guidelines/accessibility/
- Apple HIG — Typography / Dynamic Type: https://developer.apple.com/design/human-interface-guidelines/typography#dynamic-type
- Apple HIG — Motion: https://developer.apple.com/design/human-interface-guidelines/motion

**Stack**
- React Aria Components — ComboBox (sections, `defaultFilter`, `menuTrigger`, `allowsEmptyCollection`, controlled `value`/`inputValue`): https://react-spectrum.adobe.com/react-aria/ComboBox.html
- React Aria Components — Dialog / DialogTrigger (focus management, modal): https://react-spectrum.adobe.com/react-aria/Dialog.html
- Tailwind CSS — logical spacing utilities (`ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`): https://tailwindcss.com/docs/margin

**Prior art (all verified via GitHub API, July 2026)**
- `MoonshotAI/kimi-cli` — Kimi Code CLI: https://github.com/MoonshotAI/kimi-cli
- `MoonshotAI/kimi-code`: https://github.com/MoonshotAI/kimi-code
- `Leechael/pi-provider-kimi-code`: https://github.com/Leechael/pi-provider-kimi-code
- `Doriandarko/kimi-2-6-code`: https://github.com/Doriandarko/kimi-2-6-code
- `edison7009/EchoBird` (model switching across Claude Code/Codex/Kimi/Qwen/OpenCode/…): https://github.com/edison7009/EchoBird
- `anomalyco/opencode` (open source coding agent, model switching): https://github.com/anomalyco/opencode
- `cline/cline` (VS Code coding agent; model picker with provider groups): https://github.com/cline/cline
- `gluonfield/enchanted` (iOS/macOS Ollama client): https://github.com/gluonfield/enchanted
- `artcc/openclient-llm` (native iOS/macOS LLM client): https://github.com/artcc/openclient-llm
- `simonw/llm` (CLI model registry): https://github.com/simonw/llm

**Mobbin** — https://mobbin.com (Claude AI and Kimi app "model picker" screens; login-gated, could not be fetched this pass — capture manually in build phase). Contrast ratios in §1.4 were computed in-session from the repo's `style.css` tokens using the WCAG relative-luminance formula.

---

**Spec-folder question:** E) Skip — this pass writes no files; report returned inline as requested.
