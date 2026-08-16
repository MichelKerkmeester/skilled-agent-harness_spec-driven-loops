<!-- provenance: external-CLI orchestration pass; original file iter-10-grok.md -->
> **Source pass 10** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-10-grok.md`.

<!-- F4-plan-mode-tab | model=grok | lens=interaction-gesture | iter 10/10 | 2026-08-15T20:41:40.544Z -->

# Interaction-gesture research: Plan-mode entry/exit + Tab affordance (Pi Remote)

**Lens:** every state and transition, touch targets, long-press, swipe, keyboard, focus order, micro-interactions.  
**Stack constraints:** installable iPhone PWA, React 19 + Vite + Tailwind 4 + react-aria-components, ink-on-parchment, WCAG AA, fail-closed ticketed `set_mode`.  
**Mobbin MCP:** not available in this session (no MCP servers registered). Public Mobbin URLs and search snippets are cited; authenticated screenshot inspection was not possible.

---

## 1. Findings for this lens

### 1.1 The current composer is a two-tap, zero-status control — and that is the interaction failure

Plan mode today lives only inside the `+` popover as a `ToggleButtonGroup` (`Build` / `Plan · read-only`). The composer itself has no live mode chrome. A `.composer-plan-chip` rule already exists in CSS and is never mounted. `RuntimeStrip` (the older persistent Build/Plan control) is also unmounted: it is imported only by its test file, not by `App.tsx`.

That is the opposite of the target-bar pattern. Claude’s own docs put the **mode selector next to the prompt / send control**, not inside an attachment menu:

- CLI: `Shift+Tab` cycles modes; the **status bar** always shows `⏸ plan mode on` (and sibling glyphs for other modes). Asking Claude in chat to change mode does **not** work. [Claude Code permission modes](https://code.claude.com/docs/en/permission-modes)
- VS Code: **click the mode indicator at the bottom of the prompt box**. Plan is session-only (not remembered per folder). [same]
- Desktop Code tab: **mode selector next to the send button**. [same]
- claude.ai + **mobile app**: **mode dropdown next to the prompt box**. Remote Control exposes Manual / Accept edits / Plan only. [same]

Kimi Code is even stricter: `Shift-Tab` **toggles** Plan (binary, not a cycle); the prompt glyph becomes `📋` and a **blue `plan` badge appears in the status bar**. Exiting Plan **requires confirmation even if YOLO is on** (Auto is the exception). [`/plan`](https://moonshotai.github.io/kimi-code/en/guides/interaction) remains available while streaming. [Kimi keyboard](https://moonshotai.github.io/kimi-code/en/reference/keyboard.html) · [Kimi interaction](https://moonshotai.github.io/kimi-code/en/guides/interaction)

OpenCode’s intro still says **Tab** switches Build ↔ Plan with an **indicator in the lower-right**. [OpenCode intro](https://opencode.ai/docs/) Current keybinds, however, map `tab` → `agent_cycle` and `shift+tab` → `agent_cycle_reverse`. [OpenCode keybinds](https://opencode.ai/docs/keybinds/) Copying “Tab = plan” from older OpenCode docs would bind the **wrong** action.

ChatGPT iOS (Mobbin) puts camera / tools in the composer — that is the **attachment** pattern Pi already copied with `+`. [ChatGPT iOS chat](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1) · [ChatGPT message input](https://mobbin.com/explore/screens/e05bba7c-01ab-4c15-9e98-a04e2943690b) Claude iOS chat uses a composer FAB for upload, not for permission mode. [Claude iOS chat detail](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8)

**Interaction claim:** burying a *safety mode* in the same popover as slash commands makes Plan a tools-drawer item. Every shipped coding-agent that treats Plan as authority puts a **persistent, tappable mode control on the prompt object**, plus a status glyph that survives keyboard-open.

### 1.2 Bare `Tab` is the wrong key on iPhone — including for hardware keyboards

Three independent constraints collide:

1. **iOS software keyboards have no Tab key.** Any Tab-only path is hardware-keyboard progressive enhancement. (Product current-state; also implied by Apple’s software-keyboard model. [HIG Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards))

2. **When a `textarea` is focused, iOS often never delivers `Tab` to the page.** Document-level listeners see Tab until the textarea is focused; then Tab is swallowed. This is reported as an iOS (not Safari-only) behavior, reproduced on Bluetooth keyboards. [SO 46248686](https://stackoverflow.com/questions/46248686/ios-bluetooth-keyboard-inputs-tab-event) · related [SO 37121648](https://stackoverflow.com/questions/37121648/javascript-ipad-tab-key-detection-w-bluetooth-keyboard)

3. **Tab is already the focus-move key.** Apple: Full Keyboard Access lets people operate iPhone 100% from a keyboard; **do not override system-defined shortcuts**; Tab moves focus, Shift-Tab reverses. [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) · [WWDC21-10120](https://developer.apple.com/videos/play/wwdc2021/10120/) · [HIG Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)  
   WCAG 2.1.1 Keyboard + 2.1.2 No Keyboard Trap + 2.4.3 Focus Order require Tab to move focus, not to mutate agent authority. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Industry prior art on *desktop TUIs* already avoided bare Tab for Plan:

| Product | Binding | Semantics |
|---|---|---|
| Claude Code CLI | `Shift+Tab` | **Cycle** default → acceptEdits → plan (optional auto/bypass after plan) |
| Kimi Code CLI | `Shift+Tab` | **Toggle** Plan on/off |
| OpenCode (docs intro) | `Tab` | Build ↔ Plan |
| OpenCode (current `tui.json`) | `tab` / `shift+tab` | **Agent cycle**, not mode |
| Upstream pi plan-mode example | `Ctrl+Alt+P` **or** `/plan` | Toggle; not Tab. [pi plan-mode extension](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/plan-mode/index.ts) |

Pi Remote’s composer already steals **Enter** (send, Shift+Enter unused — there is no newline binding; `rows={1}` grows by script). Adding a second stolen navigation key without a visible twin is how remote-control UIs become “viewport + chat box, not a control surface” — the failure mode reported on Claude iOS Remote Control, where the Plan toggle either does nothing or cannot leave Plan. [claude-code#28427](https://github.com/anthropics/claude-code/issues/28427) · [#29319](https://github.com/anthropics/claude-code/issues/29319) · [#29214](https://github.com/anthropics/claude-code/issues/29214)

**Interaction claim:** the hardware-keyboard affordance that matches Claude *and* Kimi, and that does not fight iOS Tab-swallowing as hard, is **`Shift+Tab` while the composer is focused**, implemented as *enhancement* of a visible control. Bare `Tab` must keep moving focus (or, on iOS, may never arrive). `preventDefault` must fire **only** on the handled combo; unconditional `keydown` `preventDefault` cancels iOS key-repeat (`inputType: deleteContentBackward`). [wterm#32](https://github.com/vercel-labs/wterm/issues/32) · [#41](https://github.com/vercel-labs/wterm/issues/41)

### 1.3 Touch: the plus/send targets are 40×40, and the 44px coarse rule is incomplete

Apple: hit target **at least 44×44 pt** on touchscreens. [HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) · [UI Design Dos and Don’ts](https://developer.apple.com/design/tips/)  
Apple Accessibility table: iOS **default 44×44 pt**, **minimum 28×28 pt**. [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

WCAG 2.2:

- **2.5.8 Target Size (Minimum), AA:** 24×24 CSS px (spacing / equivalent / inline exceptions). [Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- **2.5.5 Target Size (Enhanced), AAA:** 44×44 CSS px.

Current CSS:

- `.composer-plus` and `.composer-primary` are **`width/height: 2.5rem` = 40×40 CSS px** at a 16px root.
- `.session-header-icon` in the same file is already **`2.75rem` = 44×44**.
- `@media (pointer: coarse)` sets `button { min-height: 44px }` but **not min-width**, so plus/send become **40×44** capsules.

40×40 **passes 2.5.8 AA**, **fails Apple’s 44 pt rule** and **fails 2.5.5**. The header already proves 44 is in-system.

Popover Build/Plan segments have no min size of their own (`.tools-mode` is unused in CSS). On a 390-wide phone, two unlabeled-height RAC toggles inside `min(88vw, 20rem)` are the fat-finger risk for a fail-closed mutation.

### 1.4 Long-press and swipe are already assigned by the OS — do not steal them for toggle

Apple HIG Gestures:

| Gesture | Assigned meaning |
|---|---|
| Tap | Activate |
| Touch and hold | **Context menu** / extra controls |
| Swipe | Reveal actions, **dismiss**, **scroll** |
| Double tap | Zoom / select word |

[HIG Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)  
Context menus: long-press **or** trackpad secondary click; **do not** also attach an edit menu to the same target. [HIG Context menus](https://developer.apple.com/design/human-interface-guidelines/context-menus)

On the web, `Navigator.vibrate` is **not implemented** in WebKit; WebKit’s standards position is **Oppose**. Every iOS browser is WebKit. [Vibration implementation report](https://w3c.github.io/vibration/reports/implementation.html) · [Web features: Vibration](https://web-platform-dx.github.io/web-features-explorer/features/vibration/) The iOS 17.4+ `input[type=checkbox][switch]` Taptic hack is unofficial and one-pulse-only. [tappt](https://github.com/mxerf/tappt) · [Ionic #29942](https://github.com/ionic-team/ionic-framework/issues/29942)

Mobile coding-agent PWAs already consume **edge-swipe for back / session history**, not for mode. [opencode-mobile](https://github.com/Shahfarzane/opencode-mobile/) · [opencode-manager swipe-to-navigate](https://github.com/dzianisv/opencode-manager) · [threehymns/opencode-webui Plan/Build toggle](https://github.com/threehymns/opencode-webui)

**Interaction claim:** long-press on `+` or on a Plan chip must open a **menu** (Plan / Execute / Stay in Build), not silently flip `set_mode`. Horizontal swipe on the composer fights transcript scroll, iOS keyboard-dismiss, and edge-back. Mode must not be swipe-only (WCAG 2.5.7 Dragging Movements, AA: a non-drag alternative is required). [WCAG 2.2 2.5.7](https://www.w3.org/TR/WCAG22/)

### 1.5 Opening a Dialog while the software keyboard is up is a geometry fight

The composer is `position: sticky; bottom: 0` with `env(safe-area-inset-bottom)`. iOS Safari: when the keyboard opens, `position: sticky/fixed` detaches from the visual viewport (WebKit #191204 lineage). Reliable PWA composers **pre-lift on `mousedown` before focus**, then follow keyboard height (Visual Viewport or keyboard-inset). [ios-pwa-keyboard-fix](https://github.com/Crscristi28/ios-pwa-keyboard-fix) · [ios-composer.md](https://github.com/cameronapak/polyfill-virtual-keyboard-api/blob/master/docs/ios-composer.md) · [Dean Liu write-up](https://dev.to/deanliu/the-ios-safari-keyboard-scroll-bug-fixed-with-one-line-of-css-1353)

RAC `DialogTrigger` + `Popover placement="top start"` on `+` therefore:

- can dismiss or cover the caret,
- can fail WCAG **2.4.11 Focus Not Obscured (AA)** if the popover or sticky tray fully covers the focused control. [Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)

**Interaction claim:** Plan entry/exit must be possible **without opening the tools popover**, especially while the software keyboard is visible. The persistent chip is not decoration; it is the only path that survives keyboard-open.

### 1.6 React Aria already defines the keyboard model for the segmented control — do not fight it

`ToggleButtonGroup` with `selectionMode="single"` is an **ARIA radiogroup**: **Tab enters the group as one stop**, **Arrow** moves between Build/Plan, **Space/Enter** selects. [ToggleButtonGroup](https://react-spectrum.adobe.com/react-aria/ToggleButtonGroup.html)

That is correct **inside the popover**. It is the wrong primary control **in the composer tab order**, because it inserts a second Tab stop (or a trapped group) between textarea and Send. The persistent control should be **one** button/chip (`aria-pressed` or a menu button), not a two-segment group in the sequential tab order.

RAC also documents `excludeFromTabOrder` and `preventFocusOnPress` — the latter is how ComboBox incrementors avoid stealing focus. The Plan chip next to a focused textarea should use **`preventFocusOnPress`** so tapping Plan does **not** blur the composer and drop the software keyboard. [same RAC page]

### 1.7 Plan → execute is not the inverse of the toggle

Protocol fact: `set_mode` accepts **only** `'build' | 'plan'`. `executing-plan` is a **host-published** mode; sending it as a mutation is rejected. [types.ts / guards.test.ts]

The pi-remote-plan extension:

- `/plan` empty → toggle build ↔ plan  
- `/plan on` / `off`  
- `/plan execute` → restore tools, set `executing-plan`, then drop the capture  
- tool_call interceptor blocks `edit`/`write` and non-allowlisted bash **only while `mode === 'plan'`** (not during `executing-plan`)

Claude’s handoff is a **distinct prompt**, not a second Shift+Tab: Yes+auto / Yes+manual / No, keep planning. `Shift+Tab` **leaves plan without approving**. [permission-modes § Review and approve](https://code.claude.com/docs/en/permission-modes)

Kimi: after a plan, the agent **pauses**; exit requires confirmation (except Auto). [interaction](https://moonshotai.github.io/kimi-code/en/guides/interaction)

Upstream pi example uses `/plan-execute` as a **separate command** from toggle. [zach-source/pi-agent-extensions](https://github.com/zach-source/pi-agent-extensions/blob/main/plan-mode.ts)

Today’s UI collapses `plan` and `executing-plan` into `planActive`, so the chip (if shown) would lie during the dangerous window when tools are restored. Prior council text already named `Plan running` as a disabled state; it is not implemented in `SessionComposer.tsx`.

**Interaction claim:** Execute is a **one-way, confirmed** transition (sheet / action list), never a Tab tap and never the same control as “leave plan without executing.” Leaving plan without executing is `set_mode('build')`. Executing is `/plan execute` (or a new ticketed RPC that the host maps to that command). Fail closed: if the host does not confirm, the chip stays on Plan and `aria-live` announces the failure. `setMode` already refuses to fire unless `runtime.status === 'ready'`.

### 1.8 Micro-interaction physics that already exist in-repo

Local design floor (must be applied, not reinvented):

- Every control needs **pressed** feedback; press scale **0.95–1.0** (0.96 default); CSS transitions not keyframes so reverse is interruptible. [sk-design micro-interactions]
- **Never animate keyboard-initiated actions.** Frequency gate: 100+/day shortcuts get **0 ms**. [animation-decision-framework]
- Touch path may get **100–150 ms** feedback, **200–300 ms** state (tray border), **300–500 ms** sheet.
- `prefers-reduced-motion` already zeros animations globally in `style.css`.
- `touch-action: manipulation` is already set (removes 300 ms tap delay / double-tap zoom).
- `.composer-input:focus { outline: none }` with **no `:focus-visible` replacement** fails the keyboard-focus floor. [ux-quality-reference] · WCAG 2.4.7 Focus Visible (AA).

Haptics: **do not spec `navigator.vibrate`**. Selection-change feel on iPhone PWAs is visual (ink/clay border + live region), not Taptic.

### 1.9 How distinct modes are *signaled* (not just toggled)

Shipped patterns, ranked by how well they survive a phone composer:

1. **Prompt-adjacent selector + persistent label** (Claude Desktop/mobile, VS Code). Mode is a control, not a badge.
2. **Status-bar glyph + prompt prefix** (Claude CLI `⏸`, Kimi `📋` + blue badge). Glanceable when the keyboard covers chrome.
3. **Chrome recolor of the input object** (Kimi shell mode: violet border + `!` prefix). Color is paired with a glyph — WCAG 1.4.1.
4. **Lower-right indicator** (OpenCode TUI). Weak on iPhone: thumb reaches the **left** plus and **right** send; lower-right is covered by the home indicator / keyboard.
5. **Drawer-only** (Pi Remote today). Hidden the moment the popover closes.

Claude Remote Control on iOS is the anti-pattern to copy: a mode control that **does not propagate**, or that can enter Plan and never return. [issues above] Pi Remote already has the right architecture (host-confirmed `set_mode`); the UX must not look confirmed until `runtime.state.mode` updates. No optimistic toggle.

---

## 2. Concrete spec contribution (build-ready)

### 2.1 State machine (UI × host)

Host modes: `build | plan | executing-plan | unknown`.  
UI adds local overlays. **Never paint a mode the host has not confirmed.**

| UI state | Host `state.mode` | `runtime.status` | Visible | Gestures allowed |
|---|---|---|---|---|
| `Build` | `build` | `ready` | Tray default; chip idle “Plan” (secondary) | Tap chip → request `plan`; Shift+Tab → request `plan`; long-press chip → menu |
| `PlanPending` | last confirmed `build` | `pending` + `pending.type=set_mode` | Chip `aria-busy`; both ends disabled | Ignore repeat taps / keys |
| `Plan` | `plan` | `ready` | Tray clay border; chip “Plan · read-only”; `role=status` “Plan mode on, read-only” | Tap chip → request `build` (leave without execute); Shift+Tab → same; long-press → menu including **Execute plan…** |
| `PlanBlocked` | unchanged | `error` / `stale` | Chip stays on last confirmed; inline alert uses existing `.inline-alert` | Disabled until `ready` |
| `ExecuteConfirm` | `plan` | `ready` | Modal sheet (RAC `Dialog`) over composer | Confirm / Keep planning / Cancel. Esc = Keep planning. **Confirm is not the default button** (HIG: do not bind Return to a trust-expanding action) |
| `Executing` | `executing-plan` | `ready` | Chip “Plan running”; **mode changes disabled**; send still works | No Shift+Tab, no chip tap. Overflow menu: “Stop executing → Plan” only if host later exposes it; until then, wait for host |
| `BuildPending` | last `plan` | `pending` | Same as PlanPending, mirrored | Ignore |

`unknown` / `checking`: chip disabled, no shortcut.

`set_mode('executing-plan')` is illegal. Execute confirm, on primary press, inserts `/plan execute` **or** calls a dedicated ticketed command that the relay maps to the extension’s `execute` handler — same revision/one-use rules as `set_mode`.

### 2.2 Layout: persistent chip on the prompt object (not in `+`)

Composer bar, left → right, **one row**, 44 pt tall:

1. `+` (tools: model, effort, slash) — **not mode**
2. **Mode chip** (new; use existing `.composer-plan-chip` as the visual, enlarge hit slop)
3. flex spacer
4. Later (conditional)
5. Send / Stop

Match Claude Desktop/mobile: **mode next to the prompt, send stays primary.** Keep ChatGPT-style `+` for attachments/commands only. [permission-modes](https://code.claude.com/docs/en/permission-modes) · [Mobbin ChatGPT input](https://mobbin.com/explore/screens/e05bba7c-01ab-4c15-9e98-a04e2943690b)

Chip copy (visible + `aria-label`):

| State | Visible | `aria-label` |
|---|---|---|
| Build | `Plan` | `Turn on plan mode, currently build` |
| Plan | `Plan · read-only` | `Turn off plan mode, currently plan, read-only` |
| Executing | `Plan running` | `Plan is executing, mode locked` |

Do **not** encode mode in clay fill alone. Pair clay border + label + (optional) Source Serif “Plan” wordmark. WCAG 1.4.1.

Keep the popover segmented control as a **redundant** path (equivalent target for 2.5.8). Same `selectedKeys` binding.

### 2.3 Touch targets (exact)

| Control | Visual | Hit target | Notes |
|---|---|---|---|
| `+`, Send, Stop | 44×44 CSS px (`2.75rem`, same as `.session-header-icon`) | 44×44 | Replace `2.5rem` |
| Mode chip | pill, height 32–36, horizontal padding `--space-3` | **min 44×44** via padding / `::after` slop | Visual may be smaller than hit, Apple-legal if hit is 44 |
| Popover Build / Plan | height ≥ 44, each segment width ≥ 44 or 24 px gap meeting 2.5.8 spacing | 44 | `min-height: 44px; min-width: 44px` |
| Execute sheet actions | full-width, min-height 44 | 44 | Destructive/trust-expanding **not** adjacent to Cancel without 8 pt gap |
| Spacing between `+`, chip, send | ≥ 8 pt (Apple ~12 pt around bezeled controls) | — | Coarse-pointer media already exists; extend it to `min-width: 44px` |

`@media (pointer: coarse)`:

```css
button, [role='switch'], [role='radio'], .composer-plus, .composer-primary, .composer-plan-chip {
  min-height: 44px;
  min-width: 44px;
}
```

### 2.4 Gesture map (every input)

**Tap (primary)**  
Chip in Build → `setMode('plan')`. Chip in Plan → `setMode('build')` (leave **without** execute — matches Claude Shift+Tab leave). Chip in Executing → no-op + live “Plan is running”.  
`preventFocusOnPress` on chip and `+` so the software keyboard stays up. [RAC ToggleButton `preventFocusOnPress`](https://react-spectrum.adobe.com/react-aria/ToggleButtonGroup.html)

**Long-press / context menu (500 ms web `contextmenu` + RAC `onContextMenu`)**  
On chip (and optionally `+`): menu, not toggle.

- Build: `Plan mode` / `Cancel`
- Plan: `Execute plan…` / `Leave plan (stay read-write off)` / `Keep planning`
- Executing: `Cancel` only  

This matches HIG “touch and hold = menu.” Provide the same items as a VoiceOver/FKA **custom action** so long-press is never the only path. [WWDC19-250](https://developer.apple.com/videos/play/wwdc2019/250/)

**Swipe**  
**Do not** bind horizontal swipe on the tray. Optional **divergent** (see §3): a vertical drag on the chip with a 36 pt threshold revealing Execute — must also be in the long-press menu (2.5.7).

**Software keyboard**  
No Tab key. Chip remains visible above the keyboard (sticky tray + pre-lift). Do not require opening `+`.

**Hardware keyboard**

| Key | When | Action | `preventDefault` |
|---|---|---|---|
| `Shift+Tab` | composer textarea focused, `!isComposing`, status `ready`, not Executing | toggle build ↔ plan | **yes, this combo only** |
| `Tab` | anywhere | **focus next** (system / FKA) | **no** |
| `Escape` | Execute sheet or tools popover open | dismiss sheet / popover; **does not** change mode | yes if handled |
| `Enter` | textarea, existing | send / steer | yes (already) |
| `Shift+Enter` | textarea | **insert newline** (new; hardware keyboards need this — iPad/iPhone Magic Keyboard). Soft-keyboard Return stays send-or-grow per current single-line tray | yes |

Do **not** listen on `window` for bare Tab. Optional capture-phase listener **only** for `event.key === 'Tab' && event.shiftKey` when `event.target === textarea`. If iOS swallows it, the chip is still the primary.

After the first successful `Shift+Tab` in a session, show a one-line hint under the tray: `Shift-Tab · plan` (Kimi/Claude status-bar teaching). Dismiss on next tap. Do not show it on software-keyboard-only sessions.

`aria-keyshortcuts="Shift+Tab"` on the chip.

IME: ignore the shortcut when `event.isComposing || event.key === 'Process'`.

### 2.5 Focus order

Session (hardware keyboard / FKA), reading order:

1. Header back  
2. Header model  
3. Header overflow  
4. Transcript region (`tabindex=0` container, arrow-scroll internally — do not Tab every block)  
5. Composer textarea (`#session-prompt`)  
6. `+`  
7. **Mode chip** (one stop)  
8. Later (if mounted)  
9. Send / Stop  

Tools `Popover`/`Dialog`: RAC focus trap while open; Tab cycles inside; Esc closes; restore focus to `+` (or chip if opened from chip).

Execute sheet: modal trap; initial focus on **Keep planning** (safe default), not Execute. HIG: Return must not fire the trust-expanding action while a text field is focused; here the sheet has no field — still do not make Execute the default.

**2.4.11:** `scroll-padding-bottom` on the transcript = composer height + safe-area + 8 pt so focused transcript controls are not fully hidden by the sticky tray. Plan chip / send `:focus-visible` outline 2 px `var(--focus)` offset 2 px (already used on plus/send). **Restore** textarea focus ring:

```css
.composer-input:focus { outline: none; }
.composer-input:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
```

### 2.6 Motion (pointer vs keyboard)

| Trigger | Motion | Duration | Reduced motion |
|---|---|---|---|
| Shift+Tab / any key | **none** (keyboard rule) | 0 | 0 |
| Chip / + / send press | `scale(0.96)` | 120 ms `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out-interface`) | skip transform |
| Host confirms Plan | tray `border-color` → clay; chip bg → `--accent-soft` | 200 ms color only | instant color |
| Host confirms Build | reverse | 200 ms | instant |
| Execute sheet | RAC overlay fade + sheet from bottom | 300 ms | instant appear |
| Pending | chip `aria-busy`; no spinner on the chip (spinner already means send). Optional 1 px ink pulse **only if** wait > 400 ms | — | static “Applying…” in existing `role=status` |

Do not morph `+` into a plan icon (morphing icons are for menu↔close / play↔pause). Plan is a **mode**, not the plus’s identity. [micro-interactions morphing rules]

No haptic spec.

### 2.7 a11y checklist (AA, this feature)

- [ ] Mode not color-only (1.4.1)  
- [ ] Chip name computed (1.1.1 / 4.1.2)  
- [ ] `role="status"` `aria-live="polite"` on confirm **and** on fail-closed (`Unavailable — reconcile` already exists)  
- [ ] Contrast: clay `#d97757` on bone and `accent-ink` `#8a452f` on `accent-soft` `#f3e4de` must be verified at 4.5:1 for chip text; large UI 3:1 for the border  
- [ ] 2.5.8 24 px floor; Apple 44 pt hit  
- [ ] 2.4.7 / 2.4.11 / 2.4.3 as above  
- [ ] 2.1.1: all mode changes possible without the shortcut  
- [ ] 2.5.7: no drag-only execute  
- [ ] `disabled` + status text, never opacity-only below contrast  
- [ ] VoiceOver: announce mode on change; do not announce on every pending tick  

### 2.8 Plan → execute handoff (interaction)

1. User is in `Plan`, host-confirmed.  
2. Long-press chip **or** overflow in popover **or** (hardware) **not** Shift+Tab → `ExecuteConfirm` sheet.  
3. Sheet copy (plain, product register):  
   - Title: `Execute this plan?`  
   - Body: `Pi will leave read-only mode and can edit files.`  
   - Primary (non-default): `Execute`  
   - Secondary: `Keep planning`  
   - Tertiary: `Leave plan` → `setMode('build')` without executing  
4. `Execute` → ticketed `/plan execute` (or mapped RPC). Stay on Plan chrome until host publishes `executing-plan`.  
5. On `executing-plan`: lock the chip; disclaimer line may stay “actions stay read-only” **only if still true** — it is **not** true here. Swap disclaimer to `Plan running · edits allowed` (host-confirmed). Lying copy is an interaction bug.  
6. If execute fails: sheet stays open or reopens with the existing inline alert; mode remains `plan`.

Mirror Claude’s three-way prompt and Kimi’s “exit requires confirmation.” Do **not** auto-execute on leaving Plan.

### 2.9 Implementation hooks (this stack)

- Chip: RAC `Button` + `preventFocusOnPress`; `onPress` / `onContextMenu`.  
- Shortcut: textarea `onKeyDown` **in addition to** Enter handler; `event.key === 'Tab' && event.shiftKey`.  
- Pending: bind `isDisabled` to `runtime.status !== 'ready' \|\| runtime.pending !== null` (popover already disables on `!ready`; **also disable during pending** to prevent double tickets).  
- Live region: reuse `.tools-status` / a composer-level `role=status` always mounted (not only inside the popover — today’s status is **invisible when the popover is closed**).  
- Keyboard geometry: if chip is in the sticky tray, pre-lift the tray with the existing composer; do not introduce a second overlay.

---

## 3. Divergent / minority ideas (do not collapse to “chip + Shift+Tab”)

These are evidence-backed alternatives, not decorations.

**A. Do not bind Tab *or* Shift+Tab.** Bind `Ctrl+Alt+P` to match upstream pi’s example extension, and teach `/plan`. On iPhone, Control/Alt from a Magic Keyboard are reliable; Shift+Tab still steals reverse-focus. Minority because Claude/Kimi users will expect Shift+Tab — but FKA users will thank you. [pi plan-mode](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/plan-mode/index.ts)

**B. Hardware-only “Tab hold” preview.** Keydown Shift+Tab shows clay chrome **without** mutating; keyup commits. Cancel by sliding off (like iOS camera shutter). Conflicts with the keyboard-rule (0 ms) and with iOS key-repeat. Recorded as a rejected-by-default delight.

**C. Input-accessory analog.** When `visualViewport` reports a keyboard, pin a 44 pt `Plan` key in a row *above* the tray (iOS `inputAccessoryView` clone). Soft-keyboard users get a real key; hardware users never see it. Cost: 44 pt of transcript. Strong for “iOS soft keyboards have no Tab.”

**D. Two-thumb chord.** Simultaneous press of `+` and Send toggles Plan (hard to fat-finger). No a11y equivalent unless also a button. Novelty; skip unless user-testing shows chip taps are accidental.

**E. Mode as lock-screen slider.** Slide the chip to Execute (Slide to Unlock). Satisfying, fails 2.5.7 unless a tap equivalent exists; also looks like a payment confirm — maybe *correct* for leaving read-only.

**F. Refuse persistent chrome; use a blocking Plan *session* (full-screen parchment sheet).** Transcript dims; only plan markdown + Approve/Revise. Matches Claude’s “present the plan and ask.” Heavier than a chip; better for the execute handoff than for toggling.

**G. Put mode in the session header**, 44×44, always visible even when the composer is covered. Competes with back/model/overflow (already a 3-column 2.75 rem grid). Header is the only chrome that survives a *large* software keyboard if sticky-bottom fails.

**H. Soft-keyboard “123” key remap via a custom `inputmode` toolbar** — not possible in a PWA. Any design that assumes a custom key on the iOS keyboard is fiction.

**I. Treat `executing-plan` as a *steer-only* composer:** hide Send’s “new turn” and force Later/Steer, so execute cannot be confused with a fresh prompt. Minority product choice; gesture implication is Send’s morph already covers stop/steer.

**J. Opposite of Claude:** **never** allow leaving Plan from the chip. Chip only *enters* Plan; exit is `/plan off` typed or a typed confirmation `LEAVE`. Maximum fail-closed, terrible for the “fast entry/exit” goal. Worth a settings flag (`planExitRequiresType`) for `--full-access` hosts, not default.

---

## 4. Open questions + risks

1. **Does iOS 18/26 still swallow Tab/Shift+Tab in a focused textarea in standalone PWA display-mode?** SO evidence is older (2017). Must be device-tested on a Magic Keyboard + iPhone before calling the shortcut a requirement vs an enhancement. Risk: shipping Shift+Tab as the *headline* feature that never fires.

2. **Does RAC `Popover` + iOS keyboard drop `visualViewport` and leave the chip untappable?** If yes, accessory-row (§3C) or header mode (§3G) becomes mandatory.

3. **Execute RPC.** UI cannot legally `set_mode('executing-plan')`. Is inserting `/plan execute` as a user message acceptable (shows in transcript, triggers a turn), or does the relay need a new ticketed operation? Interaction depends on the answer: a slash insert feels like a message; a control should not.

4. **Disclaimer lying during `executing-plan`.** Current string is `Pi can make mistakes · actions stay read-only`. Shipping a Plan chip without rewriting this is a trust bug.

5. **Double source of truth.** Popover toggle + chip + Shift+Tab + `/plan` command palette can race the one-use ticket. Spec already disables on `pending`; verify the palette insert of `/plan` is also gated.

6. **Enter-to-send vs hardware newline.** Paseo’s iPad issue: soft Return ≠ hardware Enter. [paseo#810](https://github.com/getpaseo/paseo/issues/810) Pi already maps all Enter to send. Adding Shift+Enter newline is in this spec; confirm it does not break IME confirmation.

7. **Contrast of clay chip text** (`#8a452f` on `#f3e4de`) in both light and dark tokens — dark theme overrides not re-checked in this pass.

8. **Remote-control desync.** Claude iOS shows a mode the host is not in. Pi’s fail-closed path is better; the remaining risk is painting `PlanPending` as Plan. Do not.

9. **OpenCode keybind drift.** Tab no longer means Plan upstream. Do not cite OpenCode Tab as current gospel in UI copy (`Shift-Tab · plan` is the honest hint).

10. **Haptic temptation.** The switch-hack will be suggested in review. It is unofficial, one-pulse, and can click a hidden checkbox. Out of spec.

---

## 5. Sources

### Official docs

- https://code.claude.com/docs/en/permission-modes  
- https://moonshotai.github.io/kimi-code/en/reference/keyboard.html  
- https://moonshotai.github.io/kimi-code/en/guides/interaction  
- https://www.kimi.com/code/docs/en/kimi-code-cli/guides/getting-started  
- https://opencode.ai/docs/  
- https://opencode.ai/docs/keybinds/  
- https://open-code.ai/en/docs/modes (older Tab/`switch_mode` wording)  
- https://react-spectrum.adobe.com/react-aria/ToggleButtonGroup.html  
- https://developer.apple.com/design/human-interface-guidelines/buttons  
- https://developer.apple.com/design/human-interface-guidelines/keyboards  
- https://developer.apple.com/design/human-interface-guidelines/gestures  
- https://developer.apple.com/design/human-interface-guidelines/accessibility  
- https://developer.apple.com/design/human-interface-guidelines/playing-haptics  
- https://developer.apple.com/design/human-interface-guidelines/context-menus  
- https://developer.apple.com/design/tips/  
- https://developer.apple.com/videos/play/wwdc2021/10120/  
- https://developer.apple.com/videos/play/wwdc2019/250/  
- https://www.w3.org/TR/WCAG22/  
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum  
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html  
- https://w3c.github.io/wcag/understanding/focus-not-obscured-minimum.html  
- https://w3c.github.io/vibration/reports/implementation.html  
- https://web-platform-dx.github.io/web-features-explorer/features/vibration/  
- https://pi.dev/

### GitHub / prior art (remote CLI, plan mode, mobile clients)

- https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/plan-mode/index.ts  
- https://github.com/zach-source/pi-agent-extensions/blob/main/plan-mode.ts  
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md  
- https://github.com/MoonshotAI/kimi-code  
- https://github.com/anomalyco/opencode/issues/7928  
- https://github.com/anomalyco/opencode/blob/e35a4131/packages/web/src/content/docs/keybinds.mdx  
- https://github.com/Shahfarzane/opencode-mobile/  
- https://github.com/threehymns/opencode-webui  
- https://github.com/Ven0m0/opencode-manager  
- https://github.com/dzianisv/opencode-manager  
- https://github.com/rmk40/opencode  
- https://github.com/anthropics/claude-code/issues/28427  
- https://github.com/anthropics/claude-code/issues/29319  
- https://github.com/anthropics/claude-code/issues/29214  
- https://github.com/anthropics/claude-code/issues/52898  
- https://github.com/anthropics/claude-code/issues/71518  
- https://github.com/vercel-labs/wterm/issues/32  
- https://github.com/vercel-labs/wterm/issues/41  
- https://github.com/getpaseo/paseo/issues/810  
- https://github.com/Crscristi28/ios-pwa-keyboard-fix  
- https://github.com/cameronapak/polyfill-virtual-keyboard-api/blob/master/docs/ios-composer.md  
- https://github.com/mxerf/tappt  
- https://github.com/ionic-team/ionic-framework/issues/29942  
- https://stackoverflow.com/questions/46248686/ios-bluetooth-keyboard-inputs-tab-event  

### Mobbin (public URLs; MCP unauthenticated this session)

- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 (Claude iOS chat / FAB)  
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 (ChatGPT iOS chat)  
- https://mobbin.com/explore/screens/e05bba7c-01ab-4c15-9e98-a04e2943690b (ChatGPT iOS message input)  
- https://mobbin.com/explore/flows/4a09fc4f-3e91-4e59-befd-f9cdb986e51d (Claude iOS subscribe flow — sheet pattern, not mode)

### Local codebase (this app)

- `apps/pi-remote-web/src/SessionComposer.tsx` (popover-only toggle; Enter-to-send; no Tab)  
- `apps/pi-remote-web/src/RuntimeStrip.tsx` (unmounted persistent toggle)  
- `apps/pi-remote-web/src/style.css` (`.composer-plus` 2.5rem; unused `.composer-plan-chip`; coarse `min-height: 44px` only)  
- `apps/pi-remote-web/src/runtime.ts` (`setMode` ready-gated, non-optimistic)  
- `packages/pi-rpc-protocol/src/types.ts` (`set_mode`: build|plan only; `executing-plan` is state)  
- `extensions/pi-remote-plan/src/index.ts` (`/plan`, `execute`, tool block)
