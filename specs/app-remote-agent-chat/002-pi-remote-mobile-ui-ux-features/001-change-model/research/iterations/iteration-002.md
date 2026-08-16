<!-- provenance: external-CLI orchestration pass; original file iter-02-deepseek.md -->
> **Source pass 2** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-2-deepseek.md`.

<!-- F1-change-model | model=deepseek | lens=interaction-gesture | iter 2/5 | 2026-08-15T19:02:26.023Z -->

# Deep-Research Pass 2/5 — Lens: Interaction & Gesture Design
**Feature:** In-app model switcher ("Pi Remote" iPhone PWA) · **Mode:** hardening/polish of a working sheet + `set_model`

---

## 1. Findings for this lens

### 1.1 Platform truth: haptics are unavailable, motion must carry the feedback

`Navigator.vibrate()` is **not supported in any iOS Safari version** (3.2→26.5, all ❌) while Chrome-for-Android supports it — [caniuse.com/vibration](https://caniuse.com/vibration); MDN flags it "not Baseline" because it doesn't work in widely-used browsers — [MDN `Navigator.vibrate()`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate). There is no working web haptics path on iPhone today. Therefore every "commit/confirm/error" affordance in the switcher must be carried by **visual motion + color + announced live-region text**, not vibration. This is a concrete deviation from the "native feel" bar: a native app would use UINotificationFeedbackGenerator; a PWA cannot (Apple exposes no haptic API to WebKit — the W3C Vibration API is the only standardized surface and iOS omits it).

### 1.2 iOS sheet anatomy: swipe-to-dismiss is a *requirement*, not a nicety

Apple HIG specifies sheets as modal surfaces that "people dismiss … by swiping down or tapping outside", with a grabber handle, rounded top corners, and dimmed/obscured background — [HIG: Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets). HIG also enumerates the gesture vocabulary we must not fight: long press, swipe, pan, pinch — [HIG: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures). Two consequences for a custom sheet:
- The list region and the drag region must be **separate scroll/drag surfaces**, or drag-to-dismiss conflicts with list scrolling. `overscroll-behavior-y: contain` on the list is the correct way to stop scroll chaining and native pull-to-refresh from firing inside the sheet — [MDN `overscroll-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overscroll-behavior) (contain "disables … vertical pull-to-refresh gesture and horizontal swipe navigation").
- On iOS a sheet that can be *swiped away mid-commit* is a correctness bug: if `set_model` is already dispatched to the host, the mutation will land even though the user thinks they cancelled. The sheet must either (a) block dismissal while a commit is in-flight, or (b) treat swipe-dismiss as pure cancellation that aborts an *un-dispatched* staged change. Given the "host-confirmed, never optimistic, one-use ticket" posture, option (b) is free and safe only if we never fire the ticket until a distinct confirm step; (a) is required after the ticket fires.

### 1.3 React Aria has the primitives — but no `Sheet` component

Verified against the `react-aria-components` export map (current main, v1.20.0 released 2026-07-31): the package ships `Modal`, `Dialog`, `Popover`, `ComboBox`, `SearchField`, `Select`, `ListBox`, `PreviewTrigger`, `Disclosure`… and **no `Sheet`** — [exports dir listing](https://github.com/adobe/react-spectrum/tree/main/packages/react-aria-components/exports), [v1.20.0 release notes](https://github.com/adobe/react-spectrum/releases/tag/react-aria-components%401.20.0). So the bottom sheet must be **composed from `Modal`+`Dialog` plus a custom pan/snap gesture**; do not wait for a first-class Sheet. Two directly relevant verified capabilities:
- **`PreviewTrigger` (new in 1.20.0)** shows a Popover "on hover, focus, or **long press**" — exactly the affordance for a long-press-on-model-header capability peek, and it's an *interactive* popover, so it can hold content — [release notes](https://github.com/adobe/react-spectrum/releases/tag/react-aria-components%401.20.0).
- **`useLongPress`** is exported from `@react-aria/interactions` (via `react-aria`), alongside `usePress`, `useHover`, `useMove`, `useInteractOutside` — [source index.ts](https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/interactions/src/index.ts). The `usePress` engine already gives "dragging off to cancel a press, long pressing to select, preventing text selection on interactive elements, scroll locking, and multi-touch handling" for free — [React Aria homepage, "Touch optimized"](https://react-spectrum.adobe.com/react-aria/).

### 1.4 The searchable model picker maps exactly onto the `ComboBox` ARIA pattern

The Claude/Kimi-grade picker (search field + grouped, selectable model list) is the **W3C `combobox`/`listbox` pattern**, and React Aria's `ComboBox` implements it with the details we need, verified from the docs:
- `menuTrigger="focus"` opens on focus; `defaultFilter` uses a "language-sensitive 'contains' filter from `useFilter`" — [ComboBox docs](https://react-spectrum.adobe.com/react-aria/ComboBox.html). Contains-filtering beats prefix-filtering for model names like "Kimi K2 Thinking" vs "K2".
- `ListBox` reuse gives us **sections with headers** (provider grouping), **disabled items** (unavailable/unconfirmed models), async loading, and `onOpenChange` — same doc.
- Keyboard behavior is first-class: arrow keys, typeahead, Escape, focus containment in overlays, focus restore on close — [RAC quality/interactions](https://react-spectrum.adobe.com/react-aria/quality) ("Focus managed … restored on close", "keyboard navigation is first-class").

One caveat the lens must flag: a *modal sheet* is not a popover-anchored combobox. If we ship the picker as a `ComboBox` inside a `Modal` we inherit free ARIA/keyboard behavior, but the input can't autofocus+announce as cleanly and the "combobox open" semantics fight the sheet's dialog semantics. The cleanest mapping: **sheet = `Dialog` (role=dialog, focus trap, Escape, focus restore); inside it, search input wired with `role="combobox"`+`aria-controls`+`aria-activedescendant` over a `ListBox`**, i.e. follow the APG combobox pattern manually (or use `ComboBox` with `menuTrigger="manual"` + controlled open state).

### 1.5 Touch target + readability floor is measurable

- Apple's guidance is ≥ **44×44 pt** hit targets ([HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), also [HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)); WCAG 2.2 SC 2.5.8 sets a hard minimum of **24×24 CSS px** for target size — [WCAG 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). For a row that carries a checkmark, capability hint and possibly a badge, **48 pt rows** are the pragmatic floor (44 for the header trigger).
- iOS safe-area reality: sheets must clear the home indicator (`env(safe-area-inset-bottom)`), the keyboard (`VisualViewport`/`dvh`), and the Dynamic Type scale. These are non-negotiable on a notched iPhone in both orientations.

### 1.6 Reduced-motion is an iOS user setting we must honor

`prefers-reduced-motion` is Baseline and is wired to **iOS Settings > Accessibility > Motion** — [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion). So the springy sheet entrance, rubber-band, and checkmark pop all need a fade-only fallback behind this media query. There is no excuse for skipping it on this platform.

### 1.7 Prior art confirms the interaction envelope (Tailscale/PWA remote-CLI peers)

Concrete peers, verified live (Aug 2026):
- **QuivrHQ/247-claude-code-remote** — TS, mobile/desktop, "secure connection via Tailscale" (same tailnet posture). 70★ — [repo](https://github.com/QuivrHQ/247-claude-code-remote). Common failure mode in its issue tracker is model/agent state sync between device and host.
- **lamngockhuong/termote** — "Remote control CLI tools (Claude Code, Copilot, any terminal) from mobile/desktop **via PWA**" (56★) — [repo](https://github.com/lamngockhuong/termote). PWA-only, same medium.
- **handmux/handmux** — "mobile vibe-coding cockpit", PWA+React+tmux (147★) — [repo](https://github.com/handmux/handmux).
- **giuliastro/harness-remote** — Capacitor/React control plane that explicitly drives **Pi** among Codex/Claude Code/OpenCode (284★) — [repo](https://github.com/giuliastro/harness-remote).
- **termly-dev/termly-cli** — encrypted mobile companion for Claude Code/Gemini/OpenCode via WebSocket (292★) — [repo](https://github.com/termly-dev/termly-cli).
- **y49/tlive** — remote approvals for Claude Code/Codex via Telegram/Feishu/web terminal (203★) — [repo](https://github.com/y49/tlive).
- **MoonshotAI/kimi-code** — Kimi Code CLI/desktop, TypeScript (6.7k★) — [repo](https://github.com/MoonshotAI/kimi-code); **MoonshotAI/kimi-cli** (Python, 11k★) — [repo](https://github.com/MoonshotAI/kimi-cli). Kimi Code's desktop picker (search + provider grouping + context-window hints) is the stated target; the same interaction model transfers to a sheet.
- **SeemSeam/claude_codex_bridge** (multi-agent incl. Pi, 3.4k★) and **kenryu42/cc-safety-net** (guardrail hooks incl. Pi, 1.5k★) confirm that **read-only-default + explicit-confirm mutation UX is the emerging norm** for pi-adjacent tooling — [bridge](https://github.com/SeemSeam/claude_codex_bridge), [cc-safety-net](https://github.com/kenryu42/cc-safety-net). This legitimizes a *staged* (select → confirm) model switch over a tap-to-apply model.

The common prior-art pattern worth copying: **model state is host-owned; the client stages a selection and the host acknowledges.** That matches the existing one-use-ticket + revision-check design and means the gesture layer should treat *selection* and *commit* as two separate gestures/states (see §2).

---

## 2. Concrete spec contribution (buildable)

### 2.1 Component map (exact primitives)

| Piece | Primitive | Rationale |
|---|---|---|
| Trigger (header `<model> v`) | RAC `Button`, `min-height:44pt`, `user-select:none`, `-webkit-touch-callout:none` | kill text-selection/long-press-callout on the label; per §1.5 |
| Sheet shell | `Modal` + `Dialog` (role `dialog`, `aria-modal`, focus trap, Escape, focus restore) | no RAC `Sheet` exists (§1.3) |
| Drag-to-dismiss | custom pan on grabber+header strip via `useMove`/Pointer events; `touch-action: pan-y` on sheet | keep list and drag zones separate (§1.2) |
| Search | input with `role=combobox`, `aria-controls`, `aria-activedescendant` over `ListBox`; `defaultFilter`-equivalent contains filter | APG pattern (§1.4) |
| List | `ListBox` + `ListBoxSection`/`Header` (provider groups), disabled items for unavailable | free a11y + keyboard (§1.4) |
| Capability peek on long-press | `PreviewTrigger` (v1.20) or `useLongPress` | §1.3 |
| Loading progress | indeterminate pulse on the committing row + `aria-busy`; `aria-live=polite` "Switching to X" | haptics unavailable (§1.1) |

### 2.2 State machine (exact, ordered)

```
IDLE ──tap──▶ OPENING ──enter done──▶ OPEN
OPEN ──type──▶ SEARCHING ──no match──▶ EMPTY_RESULT ──clear/Esc──▶ OPEN
OPEN ──tap model row──▶ STAGED (selection changed, NOT committed, sheet stays, row shows clay check)
STAGED ──tap "Switch" (or double-tap row)──▶ COMMITTING (ticket fired; sheet NOT dismissible; row pulses; header unchanged)
STAGED ──swipe down / tap scrim / Esc──▶ CLOSE (aborts cleanly; no ticket consumed)
COMMITTING ──host ok──▶ SUCCESS (header crossfades to new model; sheet exits)
COMMITTING ──revision/ticket fail──▶ ERROR (sheet stays; failed row marked; fresh ticket offered; "Retry")
COMMITTING ──disconnect──▶ STALE (commit disabled; list greys; "Host unreachable")
RUNNING_TURN variant: STAGED row for a different model while turn runs → row hint "next message"; current model chip shows "running".
```

Invariants:
- **Selecting the already-active model never dispatches** (saves a ticket — cheap hardening).
- **Swipe-dismiss is cancellation only before COMMITTING**; after COMMITTING the sheet is modal until SUCCESS/ERROR/STALE (§1.2).
- The header label changes **only on host confirm** — matches the existing never-optimistic rule.

### 2.3 Gesture table (exact)

| Gesture | Surface | Behavior |
|---|---|---|
| Tap | header trigger | open sheet; focus search input; DON'T auto-open soft keyboard on first open (list is short, avoids jar) — keyboard only after tap into field |
| Long-press (≈500ms) | header trigger | open sheet + preview of current model + "switching applies next turn" hint (`PreviewTrigger`) — **read-only**, never cycles models (posture: read-only default) |
| Drag down | grabber/header strip | 1:1 `translateY`, rubber-band resistance >60pt, dismiss on velocity>1200px/s **or** drag>30% height; release snaps back otherwise |
| Drag inside list | list only | native scroll; `overscroll-behavior-y: contain` (§1.2); never dismisses |
| Swipe-down | whole sheet while COMMITTING | ignored (no-op) — modal until terminal state |
| Tap | model row | STAGED (no dispatch) |
| Double-tap | model row | STAGED + immediately COMMIT (for power users) |
| Tap | scrim / outside | dismiss (if not COMMITTING) |
| Tap | "Switch" primary row/button | fire one-use ticket + revision-check |
| Edge swipe left (iOS back) | sheet open | captured/blocked; must not navigate the PWA history (§3) |

### 2.4 Keyboard & focus order (hardware keyboard / VoiceOver)

1. Trigger gets focus → `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls=sheetId`.
2. On open: focus → search input; `aria-activedescendant` drives highlight; **Arrow↓/↑** move highlight; **Typeahead** selects; **Enter** = stage; **Cmd/Ctrl+Enter** = stage+commit; **Esc** = close→focus returns to trigger (focus restore, §1.4); **Tab** trapped.
3. VoiceOver: sheet = `dialog`; rows = `option` with `aria-selected`; on commit `aria-live="polite"` announces **"Switching to <model>…"** then **"Model switched"**; result count `aria-live` **"7 of 12 models"**; `aria-busy` on the committing row.

### 2.5 Visual & motion tokens (ink-on-parchment, both themes)

- Sheet surface: parchment (`#f8f8f6` light / dark equivalent), top radius **24px**, grabber **36×4px** carbon-ink @ 20%, scrim = carbon @ ~40% + optional `backdrop-filter: blur(12px)` (only where perf allows).
- Selected row: clay (`#d97757`) check glyph + ink-semibold; hover (mouse/Pencil) ink @ 5%; pressed (`[data-pressed]`) ink @ 12%.
- Motion: enter `translateY(100%→0)` cubic-bezier `(0.32,0.72,0,1)` ~280ms; scrim fade 150ms; exit 240ms; checkmark pop scale `0.6→1` spring ~200ms; header label crossfade 150ms; COMMITTING = indeterminate clay pulse 1.2s loop. All **≤300ms**.
- **`prefers-reduced-motion: reduce`** → fade-only, no slide/spring/rubber-band (§1.6).
- Safe-area: `padding-bottom: calc(16px + env(safe-area-inset-bottom))`; height `min(92dvh, 100vh - safe-area)`; keyboard-aware via `VisualViewport`.
- Rows ≥48pt (44 for trigger) (§1.5); Dynamic-Type scalable (min-height in `lh`/rem).

### 2.6 PWA/robustness hardening (concrete)

- `overscroll-behavior-y: contain` on list + `none` on `<html>` while sheet open (§1.2).
- `touch-action: pan-y` on the sheet; `user-select:none` on header+rows; `-webkit-tap-highlight-color: transparent` (pressed state replaces it).
- Live host updates: new models appear mid-open → re-sort, keep staged selection; list carries its own revision; commit requires the **fresh** list revision.
- Empty result → "No models match '<query>'" + clear button; truncated names ellipsize + `title`/`aria-label`.

---

## 3. Divergent / minority ideas (resist converging)

1. **Per-row health dot** — a read-only, host-pinged latency/status dot on each model row. Diverges from Claude/Kimi (they show none) but fits a tailnet/remote-control product where "host is 400ms away" is real signal.
2. **MRU section** — "Recent" group of last 3 used models above providers. Cheap, but risks list churn and scope creep; minority.
3. **Swipe-left on a row to pin** a favorite model. A *mutation* gesture smuggled into a read-only list — conflicts with posture; mention as cautionary non-goal.
4. **WebAudio "thock"** as a haptic substitute (short lowpassed click on commit). WebKit allows it; many PWA devs use it; but it can't respect the silent switch and will read as glitchy to some — do NOT ship without an opt-out.
5. **Edge-swipe (iOS back) trapping**: when the sheet is open, intercept the left-edge horizontal drag so users don't accidentally navigate the PWA's history. Native apps get this free; PWAs must code it. Minor but real.
6. **"Apply now vs next message" staged-commit toggle** — the true Claude/Kimi-grade behavior for a mid-turn switch; requires host semantics for *current vs pending model*. Highest value, highest coupling.

---

## 4. Open questions + risks

- **Host semantics of switch-during-turn**: does `set_model` apply immediately (interrupt) or next turn? §2.2's RUNNING_TURN branch *assumes* "next turn" — must be confirmed against the host contract; otherwise the staged-commit UI is misleading.
- **List revision model**: is the host model list itself revision-checked? Stale-list commit is the #1 race to fail-closed correctly.
- **Autofocus-keyboard policy**: verify on device that focusing search without popping the keyboard is achievable (autofocus vs `readonly`-until-tap hacks); otherwise accept keyboard-on-open like Claude.
- **Custom pan vs native `overscroll` on iOS**: spring-back of the sheet must not fight WebKit's rubber-banding; test momentum/velocity on real hardware, both orientations.
- **48pt rows × 3-line capability hints** collide under Dynamic Type — decide whether hints truncate to 1 line or rows grow (grow is safer).
- **Reduced-motion + a11y testing**: verify `prefers-reduced-motion` actually flips in iOS Safari PWA context.
- **No haptics** — accept visual/audio substitutes (§1.1); re-check yearly for a W3C haptics API reaching WebKit (open question, not yet available).
- **Mobbin verification**: Claude/Kimi app screens are login-walled in this pass; the §1.7 app-behavior claims should be re-validated against captured Mobbin screens before visual freeze. Reference flows: [Mobbin — Anthropic Claude](https://mobbin.com/apps/anthropic-claude) · [Mobbin — Moonshot Kimi](https://mobbin.com/apps/moonshot-kimi) (app-level pages; exact-screenshot claims remain unverified).

---

## 5. Sources

**Platform/HIG**
- Apple HIG — Sheets: https://developer.apple.com/design/human-interface-guidelines/sheets
- Apple HIG — Gestures: https://developer.apple.com/design/human-interface-guidelines/gestures
- Apple HIG — Accessibility (44pt targets): https://developer.apple.com/design/human-interface-guidelines/accessibility
- Apple HIG — Buttons: https://developer.apple.com/design/human-interface-guidelines/buttons
- WCAG 2.2 SC 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

**Web platform**
- MDN `Navigator.vibrate()`: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
- caniuse — Vibration API: https://caniuse.com/vibration
- MDN `overscroll-behavior`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overscroll-behavior
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

**Stack (React Aria / react-aria-components)**
- RAC homepage ("Touch optimized", press/long-press/scroll-lock): https://react-spectrum.adobe.com/react-aria/
- RAC ComboBox docs (menuTrigger, defaultFilter, sections, disabled, onOpenChange): https://react-spectrum.adobe.com/react-aria/ComboBox.html
- RAC quality/interactions (focus containment/restore, keyboard): https://react-spectrum.adobe.com/react-aria/quality
- RAC v1.20.0 release notes (PreviewTrigger = long-press; no Sheet): https://github.com/adobe/react-spectrum/releases/tag/react-aria-components%401.20.0
- RAC exports map (no `Sheet` export): https://github.com/adobe/react-spectrum/tree/main/packages/react-aria-components/exports
- `@react-aria/interactions` index (`useLongPress`, `usePress`, `useHover`, `useMove`): https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/interactions/src/index.ts
- RAC v1.19.0 release notes (interactive elements in lists): https://github.com/adobe/react-spectrum/releases/tag/react-aria-components%401.19.0

**Prior art (remote-CLI / coding-agent mobile clients)**
- QuivrHQ/247-claude-code-remote (Tailscale, TS): https://github.com/QuivrHQ/247-claude-code-remote
- lamngockhuong/termote (PWA remote CLI): https://github.com/lamngockhuong/termote
- handmux/handmux (PWA vibe-coding cockpit): https://github.com/handmux/handmux
- giuliastro/harness-remote (mobile control plane incl. Pi): https://github.com/giuliastro/harness-remote
- termly-dev/termly-cli (encrypted mobile companion): https://github.com/termly-dev/termly-cli
- y49/tlive (remote approvals): https://github.com/y49/tlive
- hwwn/aaa-code-release (Claude Code client, remote mobile): https://github.com/hwwn/aaa-code-release
- MoonshotAI/kimi-code: https://github.com/MoonshotAI/kimi-code
- MoonshotAI/kimi-cli: https://github.com/MoonshotAI/kimi-cli
- SeemSeam/claude_codex_bridge (multi-agent, incl. Pi): https://github.com/SeemSeam/claude_codex_bridge
- kenryu42/cc-safety-net (guardrails incl. Pi): https://github.com/kenryu42/cc-safety-net

**Mobbin reference flows (login-walled; app-level, exact screenshots unverified this pass)**
- Anthropic Claude: https://mobbin.com/apps/anthropic-claude
- Moonshot Kimi: https://mobbin.com/apps/moonshot-kimi
