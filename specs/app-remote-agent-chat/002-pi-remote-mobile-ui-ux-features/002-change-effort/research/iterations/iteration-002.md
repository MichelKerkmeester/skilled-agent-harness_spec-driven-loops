<!-- provenance: external-CLI orchestration pass; original file iter-02-deepseek.md -->
> **Source pass 2** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-2-deepseek.md`.

<!-- F2-change-effort | model=deepseek | lens=interaction-gesture | iter 2/5 | 2026-08-15T19:30:31.820Z -->

I have a clear picture of the current implementation. Now let me do the web research in parallel.
The DuckDuckGo bot-challenge blocked searches. Let me try Bing and continue local exploration.
Bing didn't surface the specific apps. Let me dig with more targeted searches and fetch RAC docs + Apple HIG via a renderer.
Found the key Claude Code docs pages (`/docs/en/mobile`, `/docs/en/remote-control`). Let me fetch those and more prior art.
Now let me gather the remaining sources: Apple HIG (via renderer), Codex/Gemini/Qwen/Aider effort controls, and Kimi CLI Companion.
Good research base now. Let me check the protocol package to see if the host provides labels/descriptions for thinking levels (matters for the spec).
Quick gap-check on iOS-specific CSS guards before I write the report.
# Deep-Research Pass 2/5 — Lens: Interaction & Gesture Design for the In-App Effort Switcher

**Subject:** Pi Remote (iPhone PWA, React 19 + Vite + Tailwind 4 + react-aria-components), hardening the effort/reasoning-level control.
**Method:** For the gesture lens I reviewed the actual shipped control (`RuntimeStrip.tsx`, `SessionHeader.tsx`, `runtime.ts`, `style.css`, `RuntimeStrip.test.tsx`), the RAC primitives in use (Select/Popover/Dialog/usePress/useLongPress), Apple HIG, the two named benchmark surfaces (Claude app / Claude Code mobile + Kimi mobile / SSH agent-control clients), and general iOS-Safari/PWA gesture constraints. Citations are keyed `[N]` to the Sources section; each source is tagged `verified` (fetched this session) or `reference` (official page I could not re-render; used for well-known facts).

---

## 1. Findings

### 1.1 The shipped control’s gesture anatomy (and what is fragile on iPhone)
The effort switcher is currently a **react-aria-components `Select` nested inside a `Dialog`** (a `Popover`) in the header sheet (`SessionHeader.tsx:100–122`), and **a second, identical `Select`** in the bottom runtime strip (`RuntimeStrip.tsx:71–90`). Both use a `Popover > ListBox` with `max-height: 50vh` (`style.css:1595–1600`).

Three concrete iOS-gesture risks fall out of this nesting:

1. **Overlay-in-overlay focus/gesture traps.** RAC docs explicitly position Popover as "an overlay element positioned relative to a trigger" — an anchored, dismiss-on-outside-interaction surface `[6]`. Opening one popover (the sheet) and then a *second* popover (the effort Select’s ListBox) inside it means two dismissal zones stacked; the first outside-tap closes the inner ListBox, the next could close the sheet. RAC closes overlays on outside interaction by default (`shouldCloseOnInteractOutside`), and when a second overlay opens inside a first, focus management and ESC semantics become ambiguous `[6][9]`. This is the single biggest gesture-fragility source in the current implementation.
2. **Differential tap model.** RAC’s `usePress` normalizes press across touch/mouse/keyboard, cancels `onPress` when the finger scrolls, and releases-outside cancels the press (`usePress` "cancels press interactions on scroll"; release over target fires `onPress`) `[8]`. That is exactly the iOS-correct behavior, but it only applies if the effort surface is built on press primitives. A *menu-style* effort picker (animating in/out) gets drag-to-cancel and text-selection suppression from RAC; a hand-rolled `onClick` one would not `[8][9]`.
3. **Hit regions below the Apple floor.** Header-strip styled rows are `min-height: 2.5rem` = **40 px** (`style.css:1622–1635`), and ListBox items are `padding: var(--space-2) var(--space-3)` ~40–44 px. Apple HIG’s Buttons page is explicit: *"a button needs a hit region of at least 44×44 pt"*, and *"always include a press state for a custom button"* `[1]`. At 40 px (and with no per-item tap-highlight guard) the rows sit under the floor that Claude iPhor and Kimi ship at, and the only press feedback is a `transform: scale(0.98)` on `button:active` (`style.css:213–216`), which does **not** fire if the control is built as a non-`<button>` row.

### 1.2 What the two benchmark surfaces actually do (verified)
**Claude / Claude Code mobile — data I could verify this session:**
- Claude Code has **no separate mobile app**; the iOS/Android Claude app drives cloud sessions, Remote Control, and Desktop Dispatch from the **Code tab** `[3]`.
- The mobile/remote surfaces expose a **permission-**/mode-**switch as a dropdown/stepper** ("Manual / Accept edits / Plan" for remote, "Accept edits / Plan / Auto" for cloud), and **Bypass is deliberately un-selectable from the app** `[3]`. This is the closest verified precedent for a 2–3-option "mode/level" control on mobile: a top or composer-adjacent segmented/dropdown control, not a buried nested picker.
- For effort specifically, the remote client does **not** ship a bespoke effort widget: on mobile/web, **`/effort` (and `/model`) "take the argument in place of the terminal picker or slider"** `[4]`. That is a crucial, somewhat contrarian datum — Anthropic’s phone surface treats effort as a *typed command with argument*, because their terminal effort UI is a slider that does not translate to a thumbnail. The takeaway for our target bar: **a dedicated visual effort switcher is an improvement over Claude mobile**, but Claude has already *taught* users effort-takes-effect-immediately-and-per-turn semantics.
- Remote Control sessions keep the local transcript in sync across devices and show a **computer icon + green status dot** for online sessions in the session list `[4]` — gesture-layer evidence that clientside status affordances (dot/live state) on controls read as "native" to this domain.
- Mid-turn behavior: Claude Code also surface *pending/decision* states via push notifications and 5-minute forwarded-dialog expiry (`dialogExpiry`) `[4]` — i.e., the domain precedent is: **mutations that can’t be confirmed are shown as pending, then expire/refresh, never optimistic** — exactly the posture Pi Remote already implements in `runtime.ts` (no optimistic committed value; `stale`/`delivery-unknown` reconcile paths).

**Kimi — what I could verify:**
- The first-party iOS app (`com.moonshot.kimichat`, "Kimi — Kimi K3 is Live", 4+ rating, ~4.77★) is the consumer chat app `[11]`; remote *code-agent* control on iPhone is a crowded third-party space. The most representative verifiable prior art is **ServerCC** ("Claude Code & Codex … via SSH", tmux-persistent sessions, VNC view, and explicitly supports running *Kimi Code*, *OpenCode*, and *Pi* as agents) `[12]`. Its App Store description claims "the same UI and interactions as desktop … not a chat wrapper," which is the interaction stance to benchmark against for this category.
- Community repo for the Moonshot CLI exists (`JacksonTian/kimi-cli`) `[14]`, and Moonshot’s own docs/site market Kimi around agentic coding `[11]` — but I could **not verifiably reach** the "Kimi CLI Companion" iOS app listing or its screen-by-screen gesture vocabulary this session (App Store search for "Kimi CLI" returned no companion entry; Mobbin is login-gated). Where I reference Kimi/Kimi-code interaction patterns below, they are flagged **reference/likely**, not verified screenshots.

### 1.3 iOS-PWA gesture constraints that shape the spec
- `navigator.vibrate()` is a dead end on iOS Safari/standalone PWA (unsupported); haptics on iPhone web must be either **visual-only** or synthesized via WebAudio clicks. Apple HIG’s Playing-haptics page is blunt about the tradeoff: prefer **system patterns with their documented meaning**, keep haptics *optional*, and build a **clear causal relationship** between haptic and action `[2]`. On iOS the only "system" haptics reachable from a webview are the ones components like switches/pickers get natively — SwiftUI apps, not us `[2]`. Therefore **the native-feel contract for this PWA must come from motion + selection feedback + status announce, not from the Taptic Engine.**
- Apple HIG Buttons: **press state is mandatory** for custom buttons; activity indicators *inside* the control are the sanctioned way to show an in-flight action (`"Checkout" → "Checking out…"`) `[1]`. We already borrow this pattern (strip hint "Applying…") but only as a text line far from the control.
- The app is already on `touch-action: manipulation` for all `<button>`s (`style.css:203`) — this suppresses iOS double-tap zoom on the control, so **double-tap will never be required and never zoom** (good). But there is **no `-webkit-tap-highlight-color: transparent`**, no `user-select` guard, and no `-webkit-touch-callout` suppression, so iOS can still paint the grey flash / allow long-press text-selection on pressed rows; RAC’s own Select button sample CSS includes `[-webkit-tap-highlight-color:transparent]` explicitly `[5]`.
- The viewport meta allows zoom (`width=device-width, initial-scale=1.0`), which is correct for a11y, but it means gestures must never depend on pinch or on the 300 ms legacy click delay; RAC already removes any delay by working off press primitives `[8]`.
- Focus model: RAC contains focus within overlays, restores focus to the trigger on close, and exposes `data-focus-visible` only for keyboard `[9]` — the app already styles `[data-focus-visible]` (`style.css` lines 206–211). For a phone-first product the *rollover* focus-trap bug to watch is the nested-popover case in 1.1(1).

### 1.4 Effort-gradient vocab from desktop agent CLIs (prior art for "what a level means")
- Codex’s config reference ships `reasoning_effort` keys (e.g., `agents.default_subagent_reasoning_effort`) plus a dedicated **Speed** agent configuration `[10]` — establishing that "effort/speed" is a scalar rank that must be defined per-tool, not per-vendor.
- Claude Code’s own `/effort` accepts plain values and its terminal uses a **slider** `[4]`; Gemini CLI is a terminal-first agent with a config surface (`geminicli.com/docs/reference/configuration`) `[13]` for the same class.
- The Pi host already exposes the ranked vocabulary (`off | high | max` per this repo’s protocol fixtures: `availableThinkingLevels: ['off','high','max']`) as **raw strings with no labels or descriptions** — the guards only bound them (`packages/pi-rpc-protocol/src/guards.ts:710–721`, `types.ts:449–468`). So legible labels + "what each level means" **must be authored client-side** (or added to the host protocol later); there is no opportunity to pull trustworthy definitions from the wire.

---

## 2. Concrete spec contribution (build-executable)

### 2.0 Canonical interaction contract
> The effort switcher is a **binary-action** control (tap → immediate, revision-checked mutation; never staged, never optimistic). It must be operable by **tap, keyboard, and VoiceOver**; reachable in **one press** from either of its two surfaces; and must **stay visually quieter than the Model control** while being *adjacent* to it.

### 2.1 Control shape decision
- **Primary: an inline 1-of-N segmented/radio group (`ToggleButtonGroup`, `selectionMode="single"`, `disallowEmptySelection`) built from RAC ToggleButtons** — the same primitive the app already uses for Build/Plan and for Theme (`SessionHeader.tsx:150–164`, `RuntimeStrip.tsx:92–109`). Segments map 1:1 to the host’s ranked `availableThinkingLevels`. Rationale: (a) the app’s design language already ships this control; (b) there is **no nested overlay** — eliminate finding 1.1(1) entirely; (c) one-press-commit is the correct gesture for a switcher (Claude’s mobile mode-dropdown commits on tap `[3]`); (d) 2–3 segments fit the host reality (`off/high/max`) and the existing `tools-mode` styling.
- **Escape hatch:** if the host ever reports ≥5 levels, swap to a RAC `Select`+`ListBox` **in the same non-nested position** (still no parent Dialog), driven strictly by RAC’s press model `[5][8]`, and keep the 44 px floor from 2.3.
- **Explicitly remove** the nested `Select`-inside-`Dialog` effort row. In the header sheet, replace with the segmented group; in the strip it is already a flat control — keep it flat.
- Add **`<Text slot="description">`** support under the group (RAC `Select`/`Field` slot `[5]`); the description is the "what each level means" line (2.6).

### 2.2 State machine (every state × gesture × announce)
Host states already defined in `runtime.ts` (`checking/ready/pending/stale/error` + `deliveryUnknown`) — the spec maps gestures onto them explicitly.

| State | Trigger condition | Control affordance | Gesture result | AT/live announce |
|---|---|---|---|---|
| `checking` | mount/reconnect | control disabled, status "Checking…" | tap is inert (no press) | liveregion already says "Checking…" |
| `ready`, level supported | status ready, `availableThinkingLevels.length>0` | active segments, selected = `state.thinkingLevel` | tap segment → dispatch immediately | `role=status` "Effort set to <label>" |
| `ready`, no levels | `availableThinkingLevels.length===0` | control disabled + label "Unavailable on this model" (never "—") | inert | "Effort unavailable on this model" |
| `pending` (one mutation) | after `control-start` | **only the tapped segment shows a small inline spinner + "Applying…"** under it; other controls disabled; label stays host value (non-optimistic, per `runtime.ts:66–74`) | further taps inert; user may leave sheet | "Applying…" (existing path) |
| `settled` → accepted | `control-settled` accepted | selected segment = confirmed level, spinner cleared | ready again | "Effort set to <label>" |
| `stale` (revision drift) | host changed effort/mode elsewhere | control reflects *host* value + status "Refreshed — host changed"; no auto-retry (`runtime.ts:94–103`) | user may re-pick; second tap attempts fresh mutation with new revision | "Refreshed — host changed" |
| `error` / `delivery-unknown` | reject / lost delivery | all controls disabled; status "Unavailable — reconcile" | inert until user pulls-to-sync (strip currently auto-refreshes on mount only) | "Unavailable — reconcile" |
| mid-turn (`state.streaming===true`) | host is streaming a turn | control **stays enabled**, but per-level group shows footer microcopy **"Effort applies to the next turn"** (see 2.7) | allowed; mutation still revision-checked after current stream event loop | appended announce "…applies next turn" |

### 2.3 Touch targets & hit regions (numbers)
- Every interactive row/segment ≥ **44 pt** (`2.75rem`, matching the app’s `2.75rem` icon buttons already present in `style.css` header rows). Change `.tools-select > button` and the new segment rows from `min-height: 2.5rem` (40 px) to `min-height: 2.75rem`; pad list/popover variants to ≥44 pt per row `[1]`.
- 8 px gutters between segments (visual separation) but hit targets may remain contiguous.
- Add `-webkit-tap-highlight-color: transparent` on segments + rows, and `user-select: none` on the control chrome (RAC already suppresses selection during press; belt-and-brace for iOS long-press selection) `[5]`.
- Keep `touch-action: manipulation` `[style.css:203]` so double-tap never zooms the control; do **not** add `maximum-scale=1` (would break zoom a11y).

### 2.4 Gestures
- **Tap (primary):** press-start → `isPressed` visual; fire on release-over-target (RAC `usePress` semantics) `[8]`; releasing by dragging off the segment cancels ⇒ build the pressed affordance on `[data-pressed]`, not `:active` where possible.
- **Long-press:** only if paired with a visible affordance. RAC `useLongPress` (500 ms default, cancels on drag-off, kills text-selection/context-menu, and **requires a keyboard-accessible alternative** per its own doc) `[7]`. Recommended pairing: long-press on the effort group header opens a one-shot "What does each level do?" definition popover; a visible `?` icon provides the same capability. If the `?` icon ships, long-press is redundant — **drop long-press entirely** (it is a discoverability tax and *not* used by Claude mobile or the SSH agent-control clients `[3][12]`).
- **Swipe:** no swipe-to-change anywhere. Horizontal swipes near the strip bottom on the home-screen PWA risk edge-edge browser gestures; and the transcript already scrolls vertically. Decision: forbid, document in the interaction spec.
- **Keyboard (hardware/assistive):** arrow keys navigate segments; same key handling as the existing Build/Plan `ToggleButtonGroup`; Enter/Space activate.
- **Focus order:** header sheet → focus lands on the Dialog `[9]`; tab order **Model segment set, then Effort, then Status**. In the strip, keep Model → Effort → Build/Plan. Nothing between Model and Effort.
- **VoiceOver:** RAC components expose correct roles (`radio` for ToggleButton in group). Announce `role=status` text per 2.2. Disabled-state segment still focusable? No — disabled (inert), but the *label* "Unavailable on this model" stays in the DOM for the reader.

### 2.5 Micro-interactions & motion
- **Press:** keep `scale(0.98)` grow-out (already global), ensure it maps to `data-pressed`.
- **Selection confirm:** the standard iOS tick pattern — a check glyph animates in (≈90–120 ms pop) inside the selected segment; matches the app’s check-mark-free design by using a filled accent pill (`theme-option[data-selected]` precedent already exists in `style.css:346`).
- **Enter/exit:** popover/sheet entry = `data-entering`/`data-exiting` transform+opacity (RAC provides the hooks `[9]`); the app currently animates the composer spinner but not popovers — add 180 ms fade+8 px drift, and **no animation under `prefers-reduced-motion: reduce`** (the app already gates the spinner `style.css:1445–1449`; extend to all new motion).
- **Haptics/audio:** iOS PWA cannot buzz (2.3 finding §1.3, `[2]`). Ship **no fabricated haptic**; instead the selection-tick pop + a short WebAudio tick (~2 kHz, 30 ms, gain 0.05) gated by `prefers-reduced-motion` and a stored "Enable ticks" toggle (HIG’s "make haptics optional" mapped to audio) `[2]`.
- **Optimistic-fade guard:** do not flash the new label before the host confirms. The label updates only on `accepted` (already true in `runtime.ts`). The spinner must be on the *pressed* segment, not a global toggle, so the user always sees whom they pressed.

### 2.6 Copy — client-authored (host sends no labels)
Author once, central table next to `EFFORT_LABELS` (`SessionHeader.tsx:25–33` / `RuntimeStrip.tsx:18–26`); validate against the host’s real semantics before shipping.

| Level | Label | One-line definition (used as list item description / `?` popover) |
|---|---|---|
| `off` | Off | "Fast replies. No deep reasoning — best for quick checks and small edits." |
| `high` | High | "Balanced. Pi reasons before it acts; the default for most work." |
| `max` | Max | "Deepest reasoning. Slowest and most expensive; for gnarly bugs and architecture." |

Fallback for unknown host values: keep raw string (current behavior) — never fabricate a definition for an unknown level.

### 2.7 Mid-turn policy
- Gate the *presentation*, not the *mutation*: while `state.streaming`, the group stays enabled but renders the footer **"Effort applies to the next turn."** This matches domain precedent (Claude mobile’s effort is a per-prompt command argument `[4]`) and avoids the current silent surprise where a mid-turn change "does nothing visible."
- Confirmed rejected mid-turn (`unsupported`) → group flips to the `error` path + status "Not allowed while a turn is running." Prefer this copy to a bare "Unavailable".

### 2.8 How it reads next to the Model control
- **Hierarchy:** Model is the *identity* control (title, always visible, header trigger = model name). Effort is the *behavior* control: **secondary weight**, same group styling but muted borders by default; only the selected segment uses accent-ink.
- **Co-location:** the header sheet ("Model and effort") keeps Model, then Effort **immediately below it** with equal-width columns (`tools-group` already stacks them). The bottom strip keeps Model · Effort · Build/Plan in stable left→right order; effort label shows `Effort · <Label>` (unchanged) but the *segment* state must be the source of truth, since a hosted model change can shrink `availableThinkingLevels` — on hydration the segment set offs mid-flight and the control self-disables per 2.2 (`runtime.ts` hydrated path guarantees state is host-confirmed).
- **De-duplication risk:** same control in two places is fine *only* because the reducer is a single store; keep both bound to `runtime.state.thinkingLevel` — never two local `useState`s.

### 2.9 Build-phase checklist (summarized)
- [ ] Replace header-sheet nested effort Select with flat `ToggleButtonGroup` (2.1), delete inner `Popover/ListBox` there.
- [ ] Centralize an `EffortLevels` module (labels + definitions + fallback) used by both surfaces.
- [ ] Bump interactive min-heights to 44 px; add tap-highlight/user-select guards (2.3).
- [ ] Pending spinner on the tapped segment; "Applying…" live region; definition popover via `?` + optional `useLongPress` pairing (2.4–2.5).
- [ ] Mid-turn footer microcopy + `unsupported` copy (2.7).
- [ ] Entry/exit animation + reduced-motion gating for sheets/popovers (2.5).
- [ ] Tests: extend `RuntimeStrip.test.tsx` for segment tap → `setThinkingLevel`, pending spinner on pressed segment, `availableThinkingLevels: []` disabled + label, mid-turn microcopy, and non-optimistic label until accepted.

---

## 3. Divergent / minority ideas (resisted resolving)
1. **Effort as a 3-stop discrete slider** (Claude desktop’s reasoning-effort slider `[4]` transposed to a snapping `useSlider`/`Slider` from RAC). Pros: dimensional metaphor matches "effort"; cons: custom pointer-dragging on iOS is a fine-motor tax and fights scroll — minority.
2. **"Arm for next turn" queue chip.** Instead of applying immediately, show a client-local "Next turn: High" chip you pre-arm. Strong for mid-turn intent, but it is *optimistic by construction* and the security posture forbids optimistic committed values — only viable if the chip is presented as a *draft* with explicit commit on send. Divergent, needs a security-lens sign-off.
3. **Effort only in the composer-adjacent strip; remove it from the header sheet** so Model/Effort never co-exist twice. Contra: header-sheet symmetry is a design-tenet here; keep both but bind to one store.
4. **Native-like action-sheet (RAC `Menu`/`MenuTrigger`)** with each level as a full-width row + description line — the closest thing to the iOS system picker, and what the Claude mobile permission-mode dropdown approximates `[3]`. It is the right *compromise* if the product later goes 5+ levels; for 3 levels a sheet adds a dismissal gesture per change — keep for N≥5 only.
5. **Summer-quality motion: 150 ms "morph" where the pressed segment borrows the accent pill from Theme and the others dim.** This is a *distinctive mark* against Claude’s flat dropdown; low risk, high native-feel ROI — recommend prototyping it despite being non-obvious.
6. **Long-press = definitions, always** (no `?` icon). Discoverability cost real; only relevant if the header/space budget can’t hold a `?`. Probably not worth it (§2.4 evidence `[7]`).

---

## 4. Open questions + risks
- **Does `pi` accept `set_thinking_level` mid-turn at all?** If it rejects while streaming, the error path fires (fail-closed, correct), but we should pre-empt with the 2.7 gating — needs a host-lens pass on the relay RPC semantics.
- **Are levels per-model or per-session?** `availableThinkingLevels` rides on session state today; if a model switch mid-session changes the set, the segment group must handle the shrinking set without losing the selected key (`selectedKey` bound to an absent level must clear gracefully).
- **What re-yoke triggers re-sync?** Currently refresh happens on mount only; after `delivery-unknown` the only recovery is remount/reconnect. Consider an explicit "Reconnect/Retry" press on the strip in the same state-machine (gesture: tap the status pill).
- **2.6 copy is provisional** — definitions for `off/high/max` must be validated against pi’s actual behavior (tokens/latency/quality) by the host lens before shipping; wrong definitions create a trust regression worse than no definitions.
- **Crowded strip + Dynamic Type.** Model · Effort · Build/Plan + status at 44 px targets and max accessibility text on a 320 px device likely overflows. Risk to mitigate with a 2-row collapse just for the strip (survey via a small device screenshot pass).
- **Haptic expectation mismatch:** users coming from Claude iOS expect a selection tick on interaction; we can only offer a WebAudio tick that ships muted by default — expectation-settings gap, document in the changelog.
- **Unverifiable this pass:** Mobbin screens are login-gated, and the Kimi "CLI Companion" app listing wasn’t reachable via the App Store search API. Any claim above that leans on Kimi’s screen-level gesture vocabulary is **reference-grade, not verified**, and should be re-confirmed with a human holding a device before design sign-off.

---

## 5. Sources
**Verified (fetched/executed this session):**
- `[1]` Apple HIG, *Buttons* (44×44 pt hit region; press state required; in-button activity indicators) — https://developer.apple.com/design/human-interface-guidelines/buttons ✓
- `[2]` Apple HIG, *Playing haptics* (system patterns, consistency, optional, effect categories) — https://developer.apple.com/design/human-interface-guidelines/playing-haptics ✓
- `[3]` Claude Code docs, *Claude Code on mobile* (Code tab; mode-dropdown availability; no separate app) — https://code.claude.com/docs/en/mobile ✓
- `[4]` Claude Code docs, *Continue local sessions from any device with Remote Control* (`/effort` argument vs terminal picker/slider; pending/expiry/dialogExpiry; session status dot) — https://code.claude.com/docs/en/remote-control ✓
- `[5]` React Aria, *Select* (structure Label/Button/Popover/ListBox; `-webkit-tap-highlight-color` in sample CSS; single-select closes on select) — https://react-spectrum.adobe.com/react-aria/Select.html ✓
- `[6]` React Aria, *Popover* (placement/shouldFlip/shouldCloseOnInteractOutside/`data-entering|data-exiting`) — https://react-spectrum.adobe.com/react-aria/Popover.html ✓
- `[7]` React Aria, *useLongPress* (500 ms default, cancel-on-drag, requires keyboard alternative) — https://react-spectrum.adobe.com/react-aria/useLongPress.html ✓
- `[8]` React Aria, *usePress* (release-over-target fires, cancel-on-scroll, selection suppression) — https://react-spectrum.adobe.com/react-aria/usePress.html ✓
- `[9]` React Aria, components home ("Touch optimized: dragging off to cancel a press … scroll locking, multi-touch"; "Focus managed"; "Mobile ready"; Modal in component set) — https://react-spectrum.adobe.com/react-aria/react-aria-components.html ✓
- `[10]` OpenAI Codex, *Configuration Reference* (`reasoning_effort` keys; Speed agent config) — https://developers.openai.com/codex/config-reference ✓
- `[11]` App Store listing API → *Kimi — Kimi K3 is Live* (Moonshot AI, com.moonshot.kimichat, Productivity/Utilities) — https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312 ✓ (via iTunes Search API)
- `[12]` App Store listing API → *ServerCC — Claude Code & Codex* (SSH/tmux/VNC remote agent control; lists Kimi Code, OpenCode, Pi) — https://apps.apple.com/us/app/servercc-claude-code-codex/id6759306046 ✓
- `[13]` Gemini CLI repo (README; terminal agent; config docs at geminicli.com) — https://github.com/google-gemini/gemini-cli ✓
- `[14]` Community Moonshot Kimi CLI (`JacksonTian/kimi-cli`) — https://github.com/JacksonTian/kimi-cli ✓
- `[15]` **Local code (the shipped feature):** `apps/pi-remote-web/src/RuntimeStrip.tsx`, `SessionHeader.tsx`, `runtime.ts`, `style.css`, `tests/RuntimeStrip.test.tsx`, `packages/pi-rpc-protocol/src/{guards.ts,types.ts}` — current control shape, pending/non-optimistic reducer, 40 px rows, missing tap-highlight/callout guards, `toggle-button-group`/`theme-option` selected-state precedents ✓

**Reference (official pages I could not re-render this session; used for well-known/stable facts):**
- Apple HIG, *ToggleButton/switch, sheets, action sheets* guidance umbrella — https://developer.apple.com/design/human-interface-guidelines/ (index)
- Apple’s historical touch/event guidance (300 ms delay, manipulation) — https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/SafariWebContent.pdf (the canonical `TouchEvents` page has since been consolidated into the archived doc set)
- React Aria, *Modal / Dialog* component docs (bottom-sheet overlay usage) — https://react-spectrum.adobe.com/react-aria/Modal.html , https://react-spectrum.adobe.com/react-aria/Dialog.html
- Gemini CLI configuration reference — https://www.geminicli.com/docs/reference/configuration
- Mobbin, Claude iOS app + Kimi app reference flows (**login-gated; used only as target-bar evidence, not re-extracted**) — https://mobbin.com/
