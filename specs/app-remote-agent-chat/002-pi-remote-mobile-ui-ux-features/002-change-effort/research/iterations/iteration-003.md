<!-- provenance: external-CLI orchestration pass; original file iter-03-deepseek.md -->
> **Source pass 3** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-3-deepseek.md`.

<!-- F2-change-effort | model=deepseek | lens=accessibility-i18n | iter 3/5 | 2026-08-15T19:32:22.400Z -->

Research round done. Let me ground the report in the actual app repo before writing.
# Accessibility + i18n Research Pass (Iteration 3/5) — In-App Effort (Reasoning Level) Switcher

**App:** Pi Remote — iPhone PWA; **Feature:** hardened Effort control; **Lens:** accessibility + internationalization (screen-reader semantics, focus, reduced-motion, dynamic type, contrast, RTL, long strings).

Grounding note: this pass reads the actual implementation at `apps/pi-remote-web/src` (`RuntimeStrip.tsx`, `SessionHeader.tsx`, `runtime.ts`, `style.css`, `tests/contrast.test.tsx`) against the pi host's real RPC contract and public a11y/i18n sources. The control is already far along (non-optimistic pending, revision-checked mutations, `role="status"`, focus rings, reduced-motion override, verified contrast). Findings below target the gaps, not a rebuild.

---

## 1. Findings (lens: accessibility-i18n)

### 1.1 The effort control's semantics are "one-of-many" but exposed as a disclose-and-pick popup
Both surfaces render Effort as react-aria `Select` (button → `Popover` → `ListBox`) — `apps/pi-remote-web/src/SessionHeader.tsx:101-121`, `RuntimeStrip.tsx:71-90`. That is a *correct but weak* semantic: the levels are a mutually exclusive 1-of-N choice, which maps to `radio`/`radiogroup`, not `listbox` selection. react-aria documents `RadioGroup` as "select a single item from a list of mutually exclusive options" ([RadioGroup](https://react-spectrum.adobe.com/react-aria/RadioGroup.html)); the label structure (`.tools-label` "Effort" + select with `aria-label="Effort"`) creates a duplicated accessible name and no programmatic link between visible label and control. Native radio-group semantics are broadly the WAI pattern for this exact widget ([APG Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)).

### 1.2 "What does this level mean?" is invisible and unannounceable
The host defines **7 levels** — `off`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max` — and a model only advertises the subset it supports via `get_available_thinking_levels` (returns `["off"]` for non-reasoning models) ([pi RPC docs — Thinking](https://pi.dev/docs/latest/rpc)). The UI today renders bare adjectives (`EFFORT_LABELS`, `SessionHeader.tsx:25-33`) with zero gloss. VoiceOver will read "Effort, High, popup" and cannot answer "what is max?". Claude's iOS model sheet pairs each model row with a sub-description; Kimi's app attaches a short explainer to its deep-thinking toggle — both are legion "label + helper text" patterns (see [Mobbin gallery](https://mobbin.com/explore/mobile), login-gated). react-aria `RadioField` has a native description slot for exactly this; `ListBoxItem` also supports a description slot — the select pattern leaves it unused.

### 1.3 Known VoiceOver-iOS pitfalls are live risks in the current wiring
- The status flavor `role="status"` + `aria-live="polite"` (e.g. `SessionHeader.tsx:124`) is correct, but MDN explicitly warns that layering `aria-live` *and* an implicit-live role on the same node causes **double-speak on iOS VoiceOver** when the role is `alert`; `status` + explicit `aria-live` is the recommended redundant combo ([MDN ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)). Do not add `role="alert"` as a second live region for failure messages — use a *separate* node.
- A richer future is `Document.ariaNotify()`/`Element.ariaNotify()`, which is **not implemented in Safari/iOS** today (listed as "See also" on the same MDN page) — keep the live-region fallback; gate on feature detection.

### 1.4 Pending-state focus loss is a real regression waiting
`runtime.ts` flips `status` to `'pending'` on `control-start` (`runtime.ts:66-74`) and **every** control reads `disabled = runtime.status !== 'ready'` (`SessionHeader.tsx:54`, `RuntimeStrip.tsx:36`). On selection the RAC Select closes the popup and the trigger button becomes `disabled` → focus drops to `<body>` on iOS (VoiceOver swipe users lose their place mid-gesture). The non-optimistic invariant is worth keeping; the *focus* behavior is not. aria-busy on the group + a polite confirmation is the standard remedy ([ARIA `aria-busy`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy); state-machine pattern already used in `runtime.ts:76-125`).

### 1.5 Host semantics for "switch mid-turn" are concrete — and the UI should say so
pi's RPC contract: `set_thinking_level` is an immediate, non-queued command (unlike `prompt`/`steer`, which need `streamingBehavior`); it takes effect for subsequent LLM calls, and `get_state` reports `thinkingLevel` + `streaming` (isStreaming) ([pi RPC docs — Thinking](https://pi.dev/docs/latest/rpc)). The app's `RuntimeStateDto` already carries `streaming` (`packages/pi-rpc-protocol/src/types.ts:470`). So the honest, a11y-safe copy when `streaming === true` is "Applies to the next message", not "Applying…" — and it should be announced via the live region, not only painted. The pi TUI itself signals the level by painting the editor border color ([pi Using docs](https://pi.dev/docs/latest/usage) — "border color indicates the current thinking level"); the mobile sheet can mirror that with the accent tokens.

### 1.6 "Off-only" and unknown levels
When `availableThinkingLevels` is `["off"]` the control correctly disables (`SessionHeader.tsx:105`) — but the reason is never told. A screen-reader user hears a disabled button with no explanation; WCAG "Labels or Instructions" / status disclosure argues for an explicit "Model doesn't support reasoning" status line. Also, `effortLabel` falls through to the raw host string for unknown levels (`RuntimeStrip.tsx:120`) while the relay *clamps* `thinkingLevel` to 64 chars under redaction (`apps/pi-remote-relay/src/store/redaction.ts:199`) — so arbitrary host text can surface in the UI. Render only known keys + a bounded "Unknown" fallback.

### 1.7 Contrast is green, with one accent caveat
The applied palette is arithmetic-tested in `tests/contrast.test.tsx` (ink `#121212` on bone `#f8f8f6` ≈ **16.4:1**; accent-text uses clay-ink `#8a452f` on `#ffffff` ≈ **7.0:1** light / `#f0b19a` on `#2b2925` ≈ **7.9:1** dark; `--control-border` `#7b7974` on canvas ≈ **4.6:1** > 3:1 non-text). The one borrow line: raw `--accent: #d97757` against bone computes to ≈ **2.9:1**, *just under* the 3:1 WCAG 2.2 non-text-contrast floor ([WCAG 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)) — fine as a decorative inline glyph, but a focus/selected affordance that is "clay fill on bone" would fail. Selected items already use `--accent-ink` text (`style.css:1617-1620`) — keep it, and use `--accent-strong` `#b85f42` for any clay-on-bone fill.

### 1.8 Dynamic type: web can't fully mirror native, but must not *block* it
iOS Safari does not scale author-set web text with the Dynamic Type slider; it applies *text inflation*, controllable/disableable via `-webkit-text-size-adjust` — MDN marks the property Non-Baseline/experimental and documents that `none` disables the inflation algorithm ([MDN text-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust)). The codebase does not set it (good — `text-size-adjust-none` is the classic bug that disables reader zoom inflation, an iOS-Safari-specific 1.4.4/1.4.10 hazard). The sheet is `rem`-based and caps at `min(88vw,20rem)` (`style.css:1455`) → it reflows rather than scrolling sideways, satisfying [WCAG 1.4.10 Reflow at 320 CSS px](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html). Apple's guidance is 15–19 pt minimum text and layouts that tolerate the value changes of Dynamic Type ([HIG — Typography](https://developer.apple.com/design/human-interface-guidelines/typography), [HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)). Native-Dynamic-Type parity is only reachable via the WebKit `-apple-system-body` font keyword (Safari ≥ iOS 16.4 area — [Safari 16.4 release notes](https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes)); treat as enhancement, verify on device. `prefers-reduced-motion` is fully supported in iOS Safari ≥ 10.3 ([caniuse](https://caniuse.com/mdn-css_at-rules_media_prefers-reduced-motion)) and is already globally honored (`style.css:2287-2300`).

### 1.9 RTL and long-string hygiene
Popovers/selects are react-aria, which flips placement and arrow keys when `dir="rtl"` is propagated (`dir` prop is on every RAC primitive — e.g. [Switch](https://react-spectrum.adobe.com/react-aria/Switch.html), [RadioGroup](https://react-spectrum.adobe.com/react-aria/RadioGroup.html)). Two concrete text hazards: (1) the trigger renders `{`Effort · ${effortLabel(...)}`}` (`RuntimeStrip.tsx:80`) — a hard-coded middot separator breaks RTL bidi and translation; (2) the trigger has no overflow rules, so "Effort · Extra high" at 200% or in a long-language translation will bleed in a header grid whose center column is `1fr` (`style.css:1485`). The `.session-model-name` already uses ellipsis (`style.css:1545-1549`) — the effort trigger needs the same. Fine-print type at `0.68rem` all-caps letterspaced `.tools-label` (`style.css:1465-1471`) is a legibility smell at 320 px + low-vision zoom.

---

## 2. Concrete spec contribution (build-phase executable)

### 2.1 Semantics & names (screen readers)
- **Replace bare `aria-label="Effort"` with an accessible-name link to the visible label:** give `.tools-label` an `id`, set `aria-labelledby` on the effort control, keep `aria-label` only as fallback token `"Effort"`. Same for the RuntimeStrip variant.
- **Choose one of two sanctioned shapes (pick A, keep B as fallback):**
  - **A (recommended):** `RadioGroup`-style one-option-per-row inside the sheet using react-aria `RadioField`/`RadioButton` with `Text slot="description"` — native 1-of-N semantics, per-option helper text (the level gloss), roving tabindex arrow-key navigation, and iOS VoiceOver reads "Effort, radio group, Off. No reasoning — fastest, cheapest. 3 of 7" ([RadioGroup API](https://react-spectrum.adobe.com/react-aria/RadioGroup.html)).
  - **B**: keep `Select`/`ListBox` but add a `<Text slot="description">` inside each `ListBoxItem` (label + gloss) and a `✓` check glyph using `--accent-ink` (current `[data-selected]` styling at `style.css:1617-1620` already reads with 7:1+).
- **Announcement policy:** one status node `role="status"` (+ redundant `aria-live="polite"`), never a second `alert` node on the same element. Copy is localized and, when `state.streaming` is true, says "Applies to the next message" (grounded in pi's non-queued `set_thinking_level` + `get_state.streaming`, [RPC docs](https://pi.dev/docs/latest/rpc)).

### 2.2 States (mapped 1:1 to the existing `RuntimeStatus` machine in `runtime.ts:17`)
| Visual / runtime status | Effort control | Focus | Announcement (polite) |
|---|---|---|---|
| `checking` / not `ready` | disabled (`isDisabled`) | stays on trigger | "Checking runtime…" (existing) |
| `ready`, host supports reasoning | enabled; current level is `[data-selected]` | — | — |
| `ready`, `availableThinkingLevels === ["off"]` | **enabled-but-communicated** (see below) or disabled + reason | keep in tab order | "This model doesn't expose reasoning." (new) |
| `pending` (mutation in flight) | keep enabled, set `aria-busy` on the row's group; **do not disable the trigger** (fixes focus drop/§1.4) | retained on trigger | "Applying High…" / "Applies to the next message" |
| `stale` (revision mismatch) | disabled; show host-committed value | focus restored | "Refreshed — host changed" (existing) |
| `error`/`delivery-unknown` | disabled; surface `outcome.reason` | focus restored | "Unavailable — reconcile" (existing + reason) |
- **Off-only disclosure (new, §1.6):** when length === 1 and levels[0] === `'off'`, render the row "Off — this model has no reasoning" and a status line rather than a silently dead control.
- **Unknown-level containment (§1.6):** render from an allowlist `EFFORT_LABELS` keys; unknown levels → bounded `"Unknown"` string; never echo the 64-char-clamped host value verbatim.

### 2.3 Gestures / input
- Every option row is a single target with **row-height ≥ 44 px** on coarse pointers (`style.css:2279-2285` already does 44 px — extend the min-height to sheet option rows), satisfying WCAG 2.2 AA 24×24 ([SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)) and the iOS-approved 44 pt ([SC 2.5.5 enhanced](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)).
- Arrow-key navigation: radio-group roving tabindex — Left/Up moves backward (reversed under RTL), Right/Down forward (APG radio pattern). Space/Enter select. RAC provides this in both shapes.
- `prefers-reduced-motion: reduce` (iOS 10.3+): selection must hide/show check + tint with **opacity crossfade only**, no slide/spring; the global override at `style.css:2287-2294` already collapses durations to 0.01 ms — keep the accent check animation inside `transition: opacity` not `transform`.

### 2.4 Visual / motion (existing token set — no new palette)
- Option row: `--surface` fill, `--ink` label at default text size (≥ 15px effective), gloss line in `--ink-muted` (`5.4:1` on white / `6.7:1` on `#2b2925`, computed; ≥ 4.5 ✓).
- Selected = `--accent-ink` label + `✓` glyph + `--accent-soft` row wash (`#f3e4de` light / `#3a2720` dark); never a filled `--accent` row (2.9:1 issue, §1.7) — if a fill is used, it must be `--accent-strong` `#b85f42`.
- Focus ring = existing `--focus` `outline: 3px solid`, `outline-offset: 3px` (`style.css:206-210`); `:focus-visible` only (never `:focus`), so it appears for keyboard/VoiceOver but not finger taps on iOS.
- A disabled state uses `--ink-disabled`/`--surface-muted` with `data-disabled`, not a new opacity hack.
- Motion budget: 120–220 ms (`--duration-fast`/`--duration-state`), ease `--ease-out-interface`; content height changes in the bottom sheet animate with height/opacity only, LCP-free.
- The bottom sheet honors `env(safe-area-inset-bottom)` (`style.css:1488` pattern) and `max-height: 75vh` with internal scroll so 7 rows × 2 lines fit landscape + AX text settings.

### 2.5 Dynamic type & reflow
- Keep `text-size-adjust` unset (do **not** ship `-webkit-text-size-adjust: none`) (§1.8).
- All sheet sizes stay `rem`-based; verify the full Effort sheet + popover at **320 CSS px logical width** and at **200% zoom** with no 2-D scroll ([1.4.10 Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)); drive with test whether disk in CI is possible.
- Enhancement (ship behind a flag, verify on device): set `font: -apple-system-body` on the sheet root so iOS Safari follows Dynamic Type tokens (Safari 16.4+; [release notes](https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes)); remove on other engines.

### 2.6 RTL & long strings
- Propagate `document.documentElement.dir` + `lang` to the sheet; RAC child components inherit `dir` for placement/arrow flips (§1.9).
- Replace every `Effort · ${level}` concatenation with an i18n ICU-style template (`{controlName} · {value}` or a same-language callout), and give the trigger `min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap` (mirrors `.session-model-name`).
- Localize the gloss per level, e.g. off="No reasoning — fastest, cheapest", minimal/low="Light reasoning — quicker answers", medium="Balanced speed and depth", high="Deep reasoning — better quality, slower", xhigh/max="Deepest reasoning — slowest, highest quality". If the relay later exposes `thinkingBudgets` ([pi settings doc](https://pi.dev/docs/latest/settings)) — render budgets via `Intl.NumberFormat(locale)` ("≈ 32 768 tokens"), never string-concatenated numerals.
- `.tools-label` all-caps 0.68 rem: bump minimum size to ≥ 0.75 rem (12 px) and keep `text-transform` (caps OK) but widen line-height ≥ 1.4 for low-vision zoom.

### 2.7 Test gates
- Extend `tests/contrast.test.tsx` with the three new pairs: **sheet gloss (`--ink-muted` on `--surface-raised`)**, **selected row (`--accent-ink` on `--accent-soft`)**, and **`--accent` vs `--canvas` (non-text, ≥ 3:1)** — the last one forces the fill decision to `--accent-strong`.
- Extend `RuntimeStrip.test.tsx`) with: pending keeps trigger focusable; `["off"]` renders disclosure + status; unknown level renders "Unknown".
- Keep the `role="status"` assertions and add one that **no alert role** is added during error settling (iOS double-speak guard, §1.3).

---

## 3. Divergent / minority ideas (deliberately not converged)

1. **RadioGroup full-width rows instead of a popup (§1.1).** The 1-of-7 choice is the *entire* intent; inline rows with descriptions make meaning *always visible* (zero interaction cost) and are the strongest screen-reader shape. Cost: the sheet grows; the collapsed strip trigger must remain a summary-only.
2. **Three-tier public segmentation over 7 raw host levels.** Expose "Fast / Balanced / Deep" and auto-map to the host's 7 (like Kimi's single deep-thinking toggle) — dramatically better comprehension and i18n behavior, at the cost of losing `off`/`xhigh`/`max` precision and adding a host-mapped state. Would need a documented mapping + fallback.
3. **Explicit "this turn vs next turn" affordance when streaming.** A minority view: when `streaming === true`, show a confirmation affordance ("Apply now (interrupt) / from next message") — pi supports `abort`, so "apply now" is physically possible. This contradicts the current non-optimistic, fail-closed posture; flag for the security-lens pass, not accepted here.
4. **`-apple-system-body` global adoption (§1.8)** for true Dynamic-Type parity with Kimi — biggest patient impact, but WebKit-only and untested in this app; needs a device matrix.
5. **Effort inherits from mode.** Auto-sync effort with Build vs Plan (plan → `off`/`minimal`), with a visible "changed for Plan" notice. Reduces cognitive load but risks surprising the user; conflicts with the host-authoritative model.

---

## 4. Open questions + risks

- **iOS VoiceOver reliability of nested popovers** (Select inside `DialogTrigger` Popover, `SessionHeader.tsx:68-128`) is historically flaky; Option A (inline RadioGroup) removes the only nested-popover case the feature ships. Needs a real-device pass before commit.
- **`role="status"` inside a closed dialog/live region** — iOS announces status from *open* dialogs inconsistently; verify the pending confirmation is actually spoken when the sheet is open, else move status to the document level.
- **Per-model reset semantics:** does switching models reset `thinkingLevel` or just the available set? `get_state.thinkingLevel` vs `get_available_thinking_levels` are separate (`types.ts:467-468`); the "applies to next message" copy must not promise cross-model persistence. Needs host confirmation (relay test `runtime-control.test.ts:86-100` only stubs this).
- **Unknown-level sanitization is both a11y and i18n:** host-clamped 64-char level strings could be non-UTF-8 or RTL-directional — must be allowlisted before rendering (relay `redaction.ts:199` allows `'unknown'` fallback; extend for arbitrary strings).
- **Contrast only "arithmetic green":** `tests/contrast.test.tsx` computes ratios but nothing audits live `data-selected` rendering or the new gloss/soft pairs; the 2.9:1 `--accent` hazard could slip back in via a new component.
- **Reduced-motion verification on PWA:** the global 0.01 ms override is aggressive but correct; confirm no `will-change`/spring utilities (Tailwind classes) bypass the `transition-duration` override for the new rows.

---

## 5. Sources

**Host contract & product behavior**
- Pi RPC mode — Thinking commands & events (set_thinking_level levels, get_state.streaming, thinking event deltas): https://pi.dev/docs/latest/rpc (also https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md)
- Pi settings — `defaultThinkingLevel`, `thinkingBudgets`, TUI editor-border signals level: https://pi.dev/docs/latest/settings · https://pi.dev/docs/latest/usage
- pi GitHub org/repo: https://github.com/earendil-works/pi
- Paseo — direct prior art: remote-control coding agents (Claude Code, Codex, Pi) from iOS/Android over Tailscale/relay: https://github.com/getpaseo/paseo

**Accessibility specifications**
- WCAG 2.1 SC 1.4.10 Reflow (320 CSS px, no 2-D scroll): https://www.w3.org/WAI/WCAG21/Understanding/reflow.html
- WCAG 2.1 SC 1.4.11 Non-text Contrast (3:1): https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html
- WCAG 2.1 SC 2.5.5 Target Size (44×44, enhanced): https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- WCAG 2.2 SC 2.5.8 Target Size (24×24, minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- MDN ARIA live regions (polite/assertive; **iOS VoiceOver double-speak** when layering roles; `ariaNotify` not in Safari): https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
- MDN `text-size-adjust` (iOS text inflation; `none` disables it — Non-Baseline): https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust
- ARIA Authoring Practices — Radio Group & Dialog patterns: https://www.w3.org/WAI/ARIA/apg/patterns/radio/ · https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

**Apple HIG / platform**
- HIG — Accessibility; HIG — Typography (15–19 pt, Dynamic Type): https://developer.apple.com/design/human-interface-guidelines/accessibility · https://developer.apple.com/design/human-interface-guidelines/typography · switches: https://developer.apple.com/design/human-interface-guidelines/switches
- Safari 16.4 release notes (Context of `-apple-system-body`/Dynamic-Type-era WebKit work): https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes
- `prefers-reduced-motion` — iOS Safari ≥ 10.3: https://caniuse.com/mdn-css_at-rules_media_prefers-reduced-motion

**Component library**
- React Aria — RadioGroup (1-of-N semantics, per-option `description` slot, arrow handling): https://react-spectrum.adobe.com/react-aria/RadioGroup.html
- React Aria — Switch/Select (native `dir`, `isDisabled`, `data-focus-visible`, `forced-colors`, `-webkit-tap-highlight-color`): https://react-spectrum.adobe.com/react-aria/Switch.html · https://react-spectrum.adobe.com/react-aria/Select.html

**Mobbin / app references**
- Mobbin, mobile-app design library (Claude iOS model-sheet + Kimi-style reasoning toggles; **login-gated**): https://mobbin.com/explore/mobile
- Kimi (Moonshot AI) — product/agent context for "Kimi Code"-style UI: https://www.kimi.com/en

**In-repo evidence (read this pass)**
- `apps/pi-remote-web/src/RuntimeStrip.tsx` (Effort Select, disable rule, pending status)
- `apps/pi-remote-web/src/SessionHeader.tsx` (model+effort sheet, `Dialog aria-label="Model and effort"`, `role="status"`)
- `apps/pi-remote-web/src/runtime.ts` (status machine: checking/ready/pending/stale/error; non-optimistic settle)
- `apps/pi-remote-web/src/style.css` (tokens, `.tools-*`, `data-selected` accent-ink, focus rings, `prefers-reduced-motion` global, pointer-coarse 44px)
- `apps/pi-remote-web/tests/contrast.test.tsx` (palette arithmetic) · `packages/pi-rpc-protocol/src/types.ts:463-478` (`thinkingLevel`, `availableThinkingLevels`, `streaming`) · `apps/pi-remote-relay/src/store/redaction.ts:199` (64-char clamp)
