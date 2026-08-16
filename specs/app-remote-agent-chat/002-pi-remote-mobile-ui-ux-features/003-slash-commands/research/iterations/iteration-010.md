<!-- provenance: external-CLI orchestration pass; original file iter-10-grok.md -->
> **Source pass 10** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-10-grok.md`.

<!-- F3-slash-commands | model=grok | lens=interaction-gesture | iter 10/10 | 2026-08-15T19:19:07.783Z -->

# Interaction-gesture research: typed `/` commands (iPhone PWA)

**Lens:** every state, transition, touch target, long-press, swipe, keyboard, focus order, and micro-interaction needed so typing `/` in the composer feels native — without auto-submit.  
**Mobbin MCP:** not callable in this session (no MCP servers registered). Public Mobbin screen URLs are cited instead.

---

## 1. Findings

### 1.1 The target apps do not ship this on iPhone — the bar is CLI typeahead inside a Claude-iOS composer silhouette

Claude Code’s documented contract is: `/` **at the start of input** opens the live catalog; further letters filter; in fullscreen, hover highlights and **click accepts** ([Claude Code interactive mode](https://code.claude.com/docs/en/interactive-mode)). Kimi Code’s contract is the same shape: typing `/` opens a completion menu that filters in real time; **Esc closes**; **no match → send as a normal message**; `/` after leading whitespace is **not** a command ([Kimi Code interaction](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html)).

Those behaviors are **CLI/TUI**, not iPhone. Anthropic’s own issues record that Claude Code **mobile / iOS Safari** still has **no typeahead** — users must type full names from memory ([issue #32051](https://github.com/anthropics/claude-code/issues/32051), [issue #56204](https://github.com/anthropics/claude-code/issues/56204)). ChatGPT iOS Mobbin frames show a bottom composer + keyboard, **not** a slash list ([ChatGPT iOS keyboard](https://mobbin.com/explore/screens/56bc3623-9899-444c-bfba-58a6335d5cf4), [message input](https://mobbin.com/explore/screens/e05bba7c-01ab-4c15-9e98-a04e2943690b)). Discord iOS Mobbin likewise shows a chat composer, not a command palette ([Discord iOS chat](https://mobbin.com/explore/screens/041a4291-f46b-48cd-8b08-dc87cceea3f7)).

**Implication:** “Match Claude iOS + Kimi Code” means **Claude’s calm composer chrome** (already the local council decision in `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`) plus **Kimi/Claude CLI slash semantics**, ported through iOS keyboard/viewport physics. Copying a desktop ComboBox into the tray will not reach that bar.

### 1.2 Current Pi Remote gestures already contradict the goal

The main composer is a `<textarea>` whose **Enter (no Shift) always submits**, and the `<form>` also submits ([`SessionComposer.tsx` 100–124](apps/pi-remote-web/src/SessionComposer.tsx)). The real catalog is only reachable from **`+` → ComboBox `<Input>`**, which inserts `/${name} ` and never submits ([`SessionComposer.tsx` 224–233](apps/pi-remote-web/src/SessionComposer.tsx); [`CommandPalette.tsx` 10–13](apps/pi-remote-web/src/CommandPalette.tsx); test in [`CommandPalette.test.tsx` 35–42](apps/pi-remote-web/tests/CommandPalette.test.tsx)). `onInsert` **always concatenates at the end of the string**, ignoring caret ([`SessionComposer.tsx` 134](apps/pi-remote-web/src/SessionComposer.tsx)).

So today: (a) typing `/` in the tray cannot open a list; (b) if a list were bolted on without gating Enter, **Return would send `/pl` as a prompt**; (c) insert-from-`+` can splice `/name ` onto unrelated text.

### 1.3 ComboBox-on-an-`<Input>` is the wrong RAC primitive for this surface

React Aria ComboBox is “label + **input** + listbox in a popover + optional button”; `menuTrigger` is `input` | `focus` | `manual`; **by default the input value reverts to the selected item on blur** unless `allowsCustomValue` ([ComboBox docs](https://react-aria.adobe.com/ComboBox.md); [ComboBox.mdx](https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/docs/ComboBox.mdx)). That model cannot own a growing multiline `<textarea>` that must keep arbitrary `/name args` after the menu closes.

The APG combobox pattern requires **DOM focus to stay on the textbox** while the list is open, with `aria-activedescendant` pointing at the highlighted option ([APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/); [list-autocomplete example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/); [MDN `aria-activedescendant`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-activedescendant)). React Aria **Autocomplete** is the component that “filters a Menu or ListBox”, keeps **virtual focus** on the collection, and is documented for **command palettes** ([Autocomplete](https://react-aria.adobe.com/Autocomplete)).

React Spectrum already documents the iOS overlay failure mode: `useDialog` / `useModalOverlay` **preventScroll** plus `height: 100%` lets the **keyboard cover the field**; the prescribed fix is constrain height to **`--visual-viewport-height` / `useViewportSize().height`**, and expect the overlay to sit **above the keyboard**, not behind it ([react-spectrum#5926](https://github.com/adobe/react-spectrum/issues/5926)). A modal ComboBox popover inside `+` is acceptable; a modal popover over the **focused composer** is not.

### 1.4 iPhone physics: the list lives in the visual viewport, not the layout viewport

MDN: the on-screen keyboard **shrinks the visual viewport without changing the layout viewport**; UI that must stay on-screen must follow `window.visualViewport` (`height`, `offsetTop`, `resize` / `scroll`) ([Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API)).

Installed iOS PWAs add a second trap: `visualViewport.height` often **does not shrink**; iOS **scrolls the layout viewport** instead, so `innerHeight - vv.height` becomes `0` and a sticky composer **rides up off-screen** ([jarela PWA composer fix](https://github.com/CircuitWall/jarela/commit/e2ce11f5cb3e23fa1d74b5c5db6c431dd3fbc271); [ios-pwa-keyboard-fix](https://github.com/Crscristi28/ios-pwa-keyboard-fix)). The working pattern is: **overflow-hidden app shell**, only the transcript scrolls, composer **pre-lifted on `mousedown` before focus**, `focus({ preventScroll: true })`, keyboard height from a **stable** visualViewport/scroll proxy (~80 ms settle), transform/inset rather than hoping `position: sticky` survives.

Pi Remote today: composer is `position: sticky; bottom: 0` with `padding-bottom: max(..., env(safe-area-inset-bottom))` ([`style.css` 1278–1286](apps/pi-remote-web/src/style.css)). Viewport meta is `width=device-width, initial-scale=1.0` only — **no `interactive-widget`** ([`index.html` 5](apps/pi-remote-web/index.html)). A list “above the composer” that does not subscribe to visualViewport will render **behind the keyboard** or **push the tray off-screen**.

Native iOS chat also treats the keyboard as layout: `scrollDismissesKeyboard(.interactively)` lets a downward pan **track the keyboard off-screen** ([SwiftUI `scrollDismissesKeyboard`](https://developer.apple.com/documentation/swiftui/view/scrolldismisseskeyboard(_:)); [`.interactively`](https://developer.apple.com/documentation/swiftui/scrolldismisseskeyboardmode/interactively); WWDC 2023 “Keep up with the keyboard” / `keyboardDismissPadding` so the gesture starts on the **input accessory**, not only the keyboard itself ([WWDC23-10281](https://developer.apple.com/videos/play/wwdc2023/10281/))). A PWA cannot use `UIKeyboardLayoutGuide`; it must approximate with visualViewport + a pan on the **transcript**, not on the command list.

### 1.5 Getting `/` onto the iPhone keyboard is a first-class gesture problem

`/` is not on the iOS alphabetic keyboard. MDN `inputmode="url"` “may have the `/` key more prominent” ([MDN `inputmode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode)). CSS-Tricks: iOS URL keyboards add `.`, `/`, and a locale `.com` key ([CSS-Tricks `inputmode`](https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/)).

**Do not flip `inputmode` after `/` is already typed.** Switching layouts mid-composition resizes the keyboard and **destroys the list geometry** you just computed. The discoverable path to `/` on iPhone is the existing **`+` Commands** control (and optionally a dedicated `/` control). Typed `/` is the **power path** once the user has reached the symbols plane.

Slack’s native composer library registers `/` as a **prefix**, processes the **word nearest the caret** (not “whole field”), and inserts with `acceptAutoCompletionWithString:` **without sending** ([SlackTextViewController](https://github.com/runway20/SlackTextViewController)). Slack’s product docs separate **command** from **text after the first space**, and put parameters in a **Usage Hint** on the autocomplete row, kept short so it is not truncated ([Slack slash commands](https://docs.slack.dev/interactivity/implementing-slash-commands)). That is the same information architecture as Pi’s host `argument-hint` (see 1.10).

### 1.6 Return/Send is the lethal gesture while the list is open

MDN `enterkeyhint` values include `enter` (newline), `send` (deliver text), `done`, `search` ([MDN `enterkeyhint`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint)). iOS maps those to `UIReturnKeyType` even inside WKWebView ([SO / WKWebView](https://stackoverflow.com/questions/40644541/changing-the-keyboard-return-key-in-wkwebview)).

While the menu is open, **Return must not mean Send**. APG: **Enter accepts the focused option**, closes the popup, places the value in the box, and puts the caret at the end ([APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)). Kimi: Esc closes; unmatched `/…` may be sent as prose ([Kimi interaction](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html)). Claude Code IME bug: composition Enter (confirm kanji) must **not** submit ([claude-code#48257](https://github.com/anthropics/claude-code/issues/48257)). Safari historically fires `compositionend` **before** the completing `keydown`, so `event.isComposing === false` on the confirm key — track composition yourself and clear it on the **next** turn of the event loop ([MDN BCD / WebKit bug 311717](https://github.com/mdn/browser-compat-data/pull/30009); [IME Enter guide](https://www.programfarmer.com/en-US/articles/2025/frontend-cross-browser-keyboard-event-composition)). Lobe Editor explicitly **skips autocomplete during IME** (`isComposingRef`) ([lobehub InputEditor](https://github.com/lobehub/lobehub/blob/dd37fe7c/src/features/ChatInput/InputEditor/index.tsx)).

**Circular send is in the same state machine.** If the list is open and the clay send disc stays live, a thumb tap **submits the filter string**. ChatGPT iOS morphs that disc across states ([Mobbin ChatGPT keyboard](https://mobbin.com/explore/screens/56bc3623-9899-444c-bfba-58a6335d5cf4)); Pi already morphs send/steer/stop ([`SessionComposer.tsx` 91–167](apps/pi-remote-web/src/SessionComposer.tsx)). While slash-open, that control must **not** call `sendPrompt`.

### 1.7 Tap-to-select on iOS is a focus race, not a click handler

Headless UI: `preventDefault()` on **`mousedown`** (not `click`) so the option **never takes focus** ([headlessui#3073](https://github.com/tailwindlabs/headlessui/pull/3073)). Base UI: `pointerdown` alone is **not enough on iOS 26.4+** because Safari still synthesizes `mousedown`; they cancel **both** ([base-ui#4578](https://github.com/mui/base-ui/pull/4578)). WebKit: `preventDefault` on `pointerdown` has **not** always suppressed compatibility `mousedown` ([WebKit f375994 / rdar://174864309](https://github.com/WebKit/WebKit/commit/f375994f3f8e0c5c9c7eaf2b12c9ade8ca50dde4)). Base UI also reports **iOS 27** combobox taps failing to commit ([base-ui#5066](https://github.com/mui/base-ui/issues/5066)).

**Build implication:** commit selection on `pointerup`/`click`, but **`preventDefault` on both `pointerdown` and `mousedown`** on every row (and on the overlay chrome). Never `blur()` the textarea. After insert, `focus({ preventScroll: true })` if focus was lost. Discord iOS has repeatedly broken slash **option** autocomplete independently of command picking ([discord-api-docs#7338](https://github.com/discord/discord-api-docs/issues/7338), [#4731](https://github.com/discord/discord-api-docs/issues/4731)) — argument chips are a later phase; v1 should **insert text + arg hint**, not a second picker.

### 1.8 Touch targets: current tray fails Apple, passes WCAG; command rows will fail both if they reuse ListBoxItem padding

Apple: **44×44 pt** minimum hit target ([HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons); [UI Design Dos and Don’ts](https://developer.apple.com/design/tips/)). WCAG 2.2 AA **2.5.8** is **24×24 CSS px**, with an explicit **exception for combobox suggestion lists while they overlay** ([WCAG 2.5.8 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)). The exception is a floor, not a product bar: iPhone thumbs still miss 24 px rows.

Current CSS: `.composer-plus` and `.composer-primary` are **2.5rem (40px)**; session header icons are already **2.75rem (44px)** ([`style.css` 1348–1375 vs 1494–1498](apps/pi-remote-web/src/style.css)). `.react-aria-ListBoxItem` padding is `--space-2` / `--space-3` = **8px / 12px** at `0.95rem` type ([`style.css` 75–76, 1603–1610](apps/pi-remote-web/src/style.css)) → row height ~31–36 px. Catalog cap is **500** ([`redaction.ts` `COMMAND_CATALOG_CAP`](apps/pi-remote-relay/src/store/redaction.ts)) so the list **must virtualize** and still keep 44 pt rows.

HIG also: **always include a press state** or the control feels dead ([HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)). RAC already exposes `data-pressed` on the plus button; command rows need the same.

### 1.9 Long-press and swipe are occupied by the OS — do not steal them for “select”

iOS reveals **context menus** via Haptic Touch / long-press (Fast ≈ **200 ms**, Default ≈ **500 ms** in iOS 17) ([HIG Context menus](https://developer.apple.com/design/human-interface-guidelines/context-menus); [9to5Mac Haptic Touch](https://9to5mac.com/2023/06/22/ios-17-fast-long-press-menu/)). Providing both a context menu and an edit menu on the same target confuses intent ([HIG Context menus](https://developer.apple.com/design/human-interface-guidelines/context-menus)). SlackTextViewController uses **shake to undo**, **tap transcript to dismiss keyboard**, **pan to slide the keyboard down** ([SlackTextViewController](https://github.com/runway20/SlackTextViewController)).

**Do not** bind long-press-on-row to “accept”. A 200–500 ms press on a 44 pt row is how users **abort a tap**. Bind long-press (if at all) to a **secondary** menu: Copy `/name`, show description. **Swipe-down on the list** may dismiss the menu (sheet idiom) without blurring. **Swipe on the transcript** approximates interactive keyboard dismiss. Two-finger keyboard trackpad gestures move the **caret**; if the caret leaves the leading `/token`, the menu must close (Slack nearest-word rule).

`navigator.vibrate` is not a substitute for UIKit haptics on iOS Safari. Press feedback is **visual** (`data-pressed`, 12% ink overlay) plus the RAC press state already used on `+`.

### 1.10 Argument hints are a host TUI convention Pi Remote currently drops

Pi prompt templates parse `argument-hint` and render it **before** the description in the TUI dropdown (`<required>` / `[optional]`) ([pi `prompt-templates.md`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/prompt-templates.md); [issue #2780](https://github.com/earendil-works/pi/issues/2780); [badlogic/pi-mono#2761](https://github.com/badlogic/pi-mono/issues/2761)). `pi-skill-arg-hints` shows the hint as a **ghost placeholder after insert**, not as submitted text ([npm `pi-skill-arg-hints`](https://www.npmjs.com/package/pi-skill-arg-hints)).

`CommandDescriptorDto` has `name`, `description`, `source`, `enabled`, `disabledReason`, `requiresConfirmation` — **no `argumentHint`** ([`types.ts` 496–503](packages/pi-rpc-protocol/src/types.ts)). `projectCommandDescriptor` copies description only ([`redaction.ts` 222–239](apps/pi-remote-relay/src/store/redaction.ts)). The inline list cannot show arg hints until that field is projected (bounded, redacted). Until then, render **description only** and keep a slot in the row layout so adding the field does not change hit targets.

### 1.11 Autocapitalize / autocorrect will mutate the command token

iOS treats the first letter after `/` as a new word and will **capitalize** it (`/Plan`). While the menu is open: `autocapitalize="none"`, `autocorrect="off"`, `spellCheck={false}`, `autoComplete="off"`. Restore defaults on close. Do not toggle `inputmode`.

### 1.12 Focus order (executable)

| Stop | Control | Notes |
|---|---|---|
| 1 | Composer `<textarea>` | Only tab stop inside the slash widget. `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`, `aria-activedescendant` when a row is highlighted ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)). |
| 2 | `+` | 44×44. Opens tools; must **not** steal focus from an open slash list if the list is already up. |
| 3 | `Later` (conditional) | Existing. |
| 4 | Primary disc | Send / Steer / Stop / **Insert** (slash-open). |

The ListBox is **`tabIndex={-1}`**, virtual focus only ([Autocomplete virtual focus](https://react-aria.adobe.com/Autocomplete)). Opening the list must **not** move DOM focus (iOS would collapse the keyboard). `+` popover and slash overlay are **mutually exclusive**.

VoiceOver on iOS + `aria-activedescendant` is historically weaker than desktop VO. Announce on open: `aria-live="polite"` “{n} commands”. Each option’s accessible name is `/name, {hint}, {description}`; disabled rows include `disabledReason` and `aria-disabled`.

---

## 2. Concrete spec a build phase can execute

### 2.1 Primitive (stack)

- **Do not** reuse `CommandPalette`’s ComboBox as the composer.
- Build `ComposerCommandMenu` as React Aria **Autocomplete + ListBox + non-modal Popover**, `triggerRef` = the existing `<textarea>` (or RAC `TextArea`), `placement="top"`, `shouldFlip={false}`, `isNonModal`, **no** `usePreventScroll` / dialog overlay ([react-spectrum#5926](https://github.com/adobe/react-spectrum/issues/5926); [Autocomplete](https://react-aria.adobe.com/Autocomplete)).
- Filter **only the leading token** `^/([^\s]*)$` at the **caret**, matching Kimi (“`/` after leading whitespace is text”) and Slack (nearest prefix word) ([Kimi](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html); [SlackTextViewController](https://github.com/runway20/SlackTextViewController)).
- `+` → Commands opens the **same** overlay with query `""` (all relay-filtered rows), still **without submitting**.
- Insert replaces the `/query` token (or appends only when opened from `+` with empty token) with `/${name} ` and places the caret **after the trailing space**. Never `sendPrompt`. Revalidate on send remains the relay’s `isSlashCommandAllowed` ([`command-service.ts` 48–55](apps/pi-remote-relay/src/commands/command-service.ts)).

### 2.2 State machine

| ID | Name | Composer text (caret in token) | List | Primary disc | `enterkeyhint` | Autocap |
|---|---|---|---|---|---|---|
| S0 | Idle | no leading `/token` | closed | Send/Steer/Stop as today | `send` (idle+text) / `enter` (empty+running stop) | default |
| S1 | Open | exactly `/` | all enabled+disabled rows | **Insert** (checkmark) **disabled until a highlight exists** | `enter` | none |
| S2 | Filter | `/` + query, no space | fuzzy/contains matches | Insert = accept highlight | `enter` | none |
| S3 | Empty | `/` + query, 0 matches | empty state “No matching command — send as text” | **Send as text** (does **not** auto-fire) | `send` | none |
| S4 | Loading | `/` | 3 skeleton rows, `aria-busy` | disabled | `enter` | none |
| S5 | Error | `/` | “Commands unavailable — retry” + Retry row | Send as text | `send` | none |
| S6 | Blocked | `commandsDisabled` | closed; `/` types as text | Send | `send` | default |
| S7 | Commit | transient | closing | unchanged | — | — |
| S8 | Args | `/name ` + optional args | **closed** | Send | `send` | default; ghost hint if field exists |
| S9 | Literal | user dismissed; `/query` remains | closed | Send | `send` | default |

**Open (→ S1/S2)** when all of: connection live; catalog not blocked; caret in a **leading** `/token` with **no space yet**; `compositionend` complete.

**Close without insert (→ S9):** Esc; Backspace through `/`; caret leaves the token (arrow, two-finger keyboard swipe, tap in later text); tap transcript (menu only, keep keyboard if possible); swipe-down on list with `dy > 36` and `vy > 0.4`; `+` opening tools.

**Commit (→ S8, never submit):** tap row; keyboard Return/Enter while S1/S2 and a highlight exists; hardware Enter; primary disc in Insert mode; Space **only if** exactly one enabled match (optional — default **off**, see §3). After commit, **do not** send.

**Send (true submit):** only from S0/S3/S5/S8/S9 via disc or Return when menu is **closed**. S3 Return sends the literal `/query` (Kimi no-match path).

**IME:** ignore keydown for Enter/Space while composing; Safari-safe `isComposing` flag cleared on `setTimeout(0)` after `compositionend` ([claude-code#48257](https://github.com/anthropics/claude-code/issues/48257); [Safari ordering](https://github.com/mdn/browser-compat-data/pull/30009)).

### 2.3 Geometry (iPhone, 390-wide, keyboard up)

1. App shell: `html, body, #root { height: 100%; overflow: hidden }`; transcript `min-height: 0; overflow-y: auto; overscroll-behavior: contain`.
2. Composer + list pin to **visual viewport**: `bottom = max(0, innerHeight - vv.height - vv.offsetTop, scrollY)` with 80 ms stability filter ([ios-pwa-keyboard-fix](https://github.com/Crscristi28/ios-pwa-keyboard-fix)).
3. List max-height: `min(280px, vv.height - composerHeight - 12px - safe-area-top)`. Never cover the tray. Never extend behind the keyboard.
4. Use RAC `--visual-viewport-height` if the popover is portaled ([#5926](https://github.com/adobe/react-spectrum/issues/5926)).
5. List `overscroll-behavior: contain; touch-action: pan-y; -webkit-overflow-scrolling: touch`.
6. Rows: **min-height 44px**, full overlay width, 12 px inset; two-line layout: `/name` (Inter 16/600) + hint (Inter 13, muted) on line 1; description (Inter 13, muted, 1 line ellipsis) on line 2. Disabled: 40% opacity, not in arrow order.
7. Highlight = parchment inset fill `var(--surface-muted)` + 2 px clay leading bar (not a new color). Pressed = 8% carbon overlay.
8. `+` / primary discs: **44×44 CSS px** (change 2.5rem → 2.75rem to match header icons).

### 2.4 Gesture map

| Gesture | Target | Result |
|---|---|---|
| Type `/` as first char (after compositionend) | textarea | Open list (S1). No submit. |
| Type letters | textarea | Filter; move highlight to best match; `scrollIntoView` on `aria-activedescendant` ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/)). |
| Type space | textarea | Close list; leave `/name ` or `/query ` as args/literal (default). |
| Backspace through `/` | textarea | Close (S0). |
| Tap row | list | `preventDefault` on pointerdown **and** mousedown; on click, commit ([headlessui#3073](https://github.com/tailwindlabs/headlessui/pull/3073); [base-ui#4578](https://github.com/mui/base-ui/pull/4578)). |
| Long-press row (~Haptic Touch) | list | Do **not** commit. Optional context: Copy command. Cancel if `pointercancel` / move > 10 px. |
| Swipe down on list | list | Close menu, keep keyboard + text. |
| Pan down on transcript | transcript | Close menu; if pan continues, allow interactive keyboard dismiss. |
| Tap transcript | transcript | Close menu; **do not** blur textarea if the tap was only to dismiss the list (use a transparent catcher that `preventDefault`s mousedown). |
| Tap `+` | plus | Close slash overlay; open tools (existing). |
| Tap Insert disc | primary | Commit highlight. |
| Tap Send disc (menu closed) | primary | `sendPrompt` as today. |
| Return (software, S1/S2) | keyboard | Accept highlight; `preventDefault` on the textarea keydown that currently submits ([`SessionComposer.tsx` 119–123](apps/pi-remote-web/src/SessionComposer.tsx)). |
| Return (S0/S8/S9, not composing) | keyboard | Submit (existing). Shift+Return = newline always. |
| Escape (hardware) | keyboard | Close menu (Kimi). Second Esc = existing draft-clear only when menu already closed. |
| ArrowUp/Down (hardware) | keyboard | Move highlight; DOM focus stays in textarea ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)). |
| Tab | — | Leave textarea to `+`; **close** menu (do not park in the list). |

### 2.5 Keyboard attributes (slash-open)

```html
<textarea
  autocapitalize="none"
  autocorrect="off"
  spellcheck="false"
  autocomplete="off"
  enterkeyhint="enter"
  aria-autocomplete="list"
  aria-expanded="true"
  aria-controls="composer-command-list"
  aria-activedescendant="{id or empty}"
/>
```

Do **not** set `inputmode="url"` during S1–S5 (keyboard-height jump). Keep `inputmode` unset/`text`.

### 2.6 Motion (survives reduced-motion)

| Event | Motion | Reduced |
|---|---|---|
| Open | 140 ms `ease-out`, translateY(8px)→0, opacity 0→1, origin bottom | opacity 1, 0 ms |
| Close | 100 ms, reverse | instant |
| Filter | **no** list stagger; swap items; keep highlight | — |
| Highlight move | background 80 ms | instant |
| Insert disc morph | 120 ms, reuse `--duration-state` already on `.composer-primary` ([`style.css` 1380–1382](apps/pi-remote-web/src/style.css)) | instant |
| Skeletons | opacity pulse 1.2 s | static muted bars |

No haptics. No bounce that fights iOS rubber-banding (`overscroll-behavior: contain`).

### 2.7 A11y acceptance

- WCAG AA contrast on name / hint / description vs parchment and dark canvas (existing ink tokens).
- 44 pt rows (HIG) even though 2.5.8 exempts overlay lists ([WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)).
- Focus never leaves textarea while open.
- Disabled commands visible, not actionable, reason announced.
- `requiresConfirmation` does **not** add a picker confirm (approvals stay on the ticketed path).
- Live region on open/filter: “{n} commands”.
- Tests: (1) Enter in S2 does not call `sendPrompt`; (2) tap row calls insert once with `/name `; (3) IME Enter during composition does not insert or send; (4) `mousedown` preventDefault keeps `document.activeElement` === textarea.

### 2.8 Filter

v1: RAC `useFilter({ sensitivity: 'base' })` **contains** on `name + description + hint` ([Autocomplete `filter`](https://react-aria.adobe.com/Autocomplete)). Sort: prefix-of-name, then substring-of-name, then description. Cap render with windowing; data already capped at 500.

---

## 3. Divergent / minority ideas (do not converge away)

1. **Inverted list (best match nearest the tray).** Terminal TUIs put match #1 at the **top** (far from thumbs). iPhone Messages/Slack autocomplete often stacks so the **closest row to the field is the default**. Measure; do not assume CLI order is native.

2. **Space auto-accepts a unique match.** Fish/zsh and some CLIs do this. On a phone, Space is also how you start args. Default **off**; unique-match Space is a hidden flag.

3. **Morph primary disc to Insert vs disable it.** Disable is safer (cannot mis-tap send) but feels broken. Morph matches ChatGPT’s circular action ([Mobbin](https://mobbin.com/explore/screens/56bc3623-9899-444c-bfba-58a6335d5cf4)) and Pi’s existing morph. Prefer morph; if flicker from `enterkeyhint` switching is observed on device, **keep `enterkeyhint="send"` and intercept Return in JS** (worse label, stable keyboard chrome).

4. **Dedicated `/` key in the composer bar** (input accessory). Heavy-handed, but `/` is two keyboard planes away. Conflicts with `+` as the single extra control in the council spec. Minority: show `/` only when the catalog is ready.

5. **Temporary `inputmode="url"` while the field is empty** to expose `/`, then revert on first letter. High flicker risk; only acceptable if visualViewport remeasure is proven on a real iPhone PWA.

6. **Bottom sheet command browser** (iOS `UISheetPresentationController` idiom) instead of inline list. Better for 500 commands and VoiceOver; worse for “terminal-style as you type”. Could be the `+` path, with inline list for typed `/`.

7. **Discord-style argument chips after accept.** Discord iOS has regressed this twice ([#7338](https://github.com/discord/discord-api-docs/issues/7338), [#4731](https://github.com/discord/discord-api-docs/issues/4731)). Pi is a text agent: insert `/name ` + ghost hint ([pi-skill-arg-hints](https://www.npmjs.com/package/pi-skill-arg-hints)). Chips are a later experiment, not v1.

8. **Long-press row → Peek description** (HIG context-menu preview). Nice for `requiresConfirmation` commands; fights scroll and Fast Haptic Touch (200 ms). Keep v1 tap-only.

9. **Fuzzy (typo) matching** (Fuse.js / `useFilter` `startsWith` vs subsequence). iPhone typos are common; fuzzy can rank `/plna` → `plan`. Risk: surprising matches on a security-filtered catalog. Keep contains v1; fuzzy behind a flag.

10. **“Send as text” always the first row.** Escape hatch for people who want a prose sentence starting with `/`. Occupies a 44 pt row and fights terminal users. Offer it only in S3 (no matches), not S1.

11. **Hardware-keyboard-only arrows; touch has no persistent highlight.** Then Return cannot accept. Safer against accidental accept, worse for Magic Keyboard / Stage Manager. Prefer **highlight exists on open** (first enabled row) so Return has a target.

12. **VoiceOver branch: native-feeling `role="dialog"` list + search field.** Breaks “keyboard stays up”. Only if VO + `aria-activedescendant` fails on iOS 18/26 in QA.

---

## 4. Open questions + risks

| Risk | Why it matters | How to close |
|---|---|---|
| Standalone PWA keyboard inset = 0 | List/composer vanish or float ([jarela](https://github.com/CircuitWall/jarela/commit/e2ce11f5cb3e23fa1d74b5c5db6c431dd3fbc271)) | Device QA: Safari tab **and** Add-to-Home-Screen; globe-key emoji switch; rotate. |
| `enterkeyhint` swap resizes keyboard | List max-height wrong mid-gesture | A/B: swap vs intercept-only. |
| iOS 26/27 combobox tap regression | Rows visible but untappable ([base-ui#5066](https://github.com/mui/base-ui/issues/5066)) | pointerdown+mousedown preventDefault; `cursor: pointer` on rows; QA on latest iOS. |
| Safari IME Enter | Accidental insert/send ([#48257](https://github.com/anthropics/claude-code/issues/48257)) | Composition flag + next-tick clear. |
| `argumentHint` missing on DTO | Desired “hints” cannot render | Protocol + redaction bound (~200 chars); until then description-only. |
| Catalog 500 × 44 px | Unvirtualized list janks the keyboard | Windowed ListBox. |
| Autocapitalize `/Plan` | Filter miss | Force `autocapitalize="none"` in S1–S5. |
| VO + activedescendant on iOS | Users hear the textarea, not the row | Live region + QA with VoiceOver; fallback dialog only if fail. |
| Modal RAC Popover preventScroll | Keyboard covers composer ([#5926](https://github.com/adobe/react-spectrum/issues/5926)) | Non-modal, vv-height-capped. |
| Dual submit paths (`onKeyDown` + `onSubmit`) | One gated, one not | Both must consult slash state. |
| Privileged names hidden | Typed `/exit` still sendable as prose | Keep relay revalidation; picker must not become an allow-list bypass. |
| Claude/Kimi **apps** still lack mobile typeahead | Target bar is aspirational ([#32051](https://github.com/anthropics/claude-code/issues/32051)) | Judge against CLI semantics + Claude iOS **composer** chrome, not a missing iOS control. |
| Mobbin MCP unauthenticated here | No live screen pixels this pass | Operator OAuth, then `search_screens` for “iOS chat composer keyboard slash command picker”. |

---

## 5. Sources

### Apple / WCAG / ARIA / HTML
- https://developer.apple.com/design/human-interface-guidelines/buttons
- https://developer.apple.com/design/tips/
- https://developer.apple.com/design/human-interface-guidelines/context-menus
- https://developer.apple.com/documentation/swiftui/view/scrolldismisseskeyboard(_:)
- https://developer.apple.com/documentation/swiftui/scrolldismisseskeyboardmode/interactively
- https://developer.apple.com/videos/play/wwdc2023/10281/
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-activedescendant
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-autocomplete
- https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint
- https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing
- https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/

### React Aria / iOS overlay & tap races
- https://react-aria.adobe.com/ComboBox.md
- https://react-aria.adobe.com/Autocomplete
- https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/docs/ComboBox.mdx
- https://github.com/adobe/react-spectrum/issues/5926
- https://github.com/tailwindlabs/headlessui/pull/3073
- https://github.com/mui/base-ui/pull/4578
- https://github.com/mui/base-ui/issues/5066
- https://github.com/WebKit/WebKit/commit/f375994f3f8e0c5c9c7eaf2b12c9ade8ca50dde4
- https://github.com/Crscristi28/ios-pwa-keyboard-fix
- https://github.com/cameronapak/polyfill-virtual-keyboard-api/blob/master/docs/ios-composer.md
- https://github.com/CircuitWall/jarela/commit/e2ce11f5cb3e23fa1d74b5c5db6c431dd3fbc271

### Claude / Kimi / Slack / Discord / coding-agent prior art
- https://code.claude.com/docs/en/interactive-mode
- https://github.com/anthropics/claude-code/issues/32051
- https://github.com/anthropics/claude-code/issues/56204
- https://github.com/anthropics/claude-code/issues/48257
- https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html
- https://docs.slack.dev/interactivity/implementing-slash-commands
- https://github.com/runway20/SlackTextViewController
- https://github.com/slackhq/SlackTextViewController/pull/506
- https://github.com/discord/discord-api-docs/issues/7338
- https://github.com/discord/discord-api-docs/issues/4731
- https://github.com/lobehub/lobe-editor
- https://github.com/lobehub/lobehub/blob/dd37fe7c/src/features/ChatInput/InputEditor/index.tsx
- https://github.com/continuedev/continue
- https://docs.continue.dev/cli/tui-mode
- https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/prompt-templates.md
- https://github.com/earendil-works/pi/issues/2780
- https://github.com/badlogic/pi-mono/issues/2761
- https://www.npmjs.com/package/pi-skill-arg-hints
- https://github.com/mdn/browser-compat-data/pull/30009

### Mobbin (public screens; MCP not used this pass)
- https://mobbin.com/explore/screens/e05bba7c-01ab-4c15-9e98-a04e2943690b (ChatGPT iOS message input)
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 (ChatGPT iOS chat)
- https://mobbin.com/explore/screens/c176ae9f-5a25-45b6-acda-5620364105df (ChatGPT iOS chat)
- https://mobbin.com/explore/screens/56bc3623-9899-444c-bfba-58a6335d5cf4 (ChatGPT iOS keyboard)
- https://mobbin.com/explore/screens/041a4291-f46b-48cd-8b08-dc87cceea3f7 (Discord iOS chat)
- https://docs.mobbin.com/mcp/features
- https://mobbin.com/mcp

### Local (this repo)
- `apps/pi-remote-web/src/SessionComposer.tsx` (Enter-submits; `+` ComboBox; append-only insert)
- `apps/pi-remote-web/src/CommandPalette.tsx` (insert `/name `, never submit)
- `apps/pi-remote-web/src/style.css` (40 px discs; 8 px ListBoxItem padding; sticky composer)
- `apps/pi-remote-web/index.html` (viewport meta)
- `packages/pi-rpc-protocol/src/types.ts` (`CommandDescriptorDto` — no `argumentHint`)
- `apps/pi-remote-relay/src/store/redaction.ts` (catalog cap 500; description-only projection)
- `apps/pi-remote-relay/src/commands/command-service.ts` (relay filter + revalidation)
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md` (typed `/` as first character; never submit on select)
