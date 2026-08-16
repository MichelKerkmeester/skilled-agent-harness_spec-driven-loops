<!-- provenance: external-CLI orchestration pass; original file iter-02-sol.md -->
> **Source pass 2** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-2-sol.md`.

<!-- F3-slash-commands | model=sol | lens=interaction-gesture | iter 2/10 | 2026-08-15T18:58:49.219Z -->

## 1. Findings for the interaction-gesture lens

### The correct model is “terminal completion attached to the composer,” not a mobile command sheet

Typing `/` should reveal a nonmodal list directly above the existing composer while leaving the caret and software keyboard in place. Apple’s own Xcode agent UI uses this exact discovery model: typing `/` in the message field opens a scrollable command popup. Kimi Code likewise opens completion on `/`, filters in real time, and matches aliases; its web UI uses arrow-key navigation and Enter to confirm. [Apple Xcode agent documentation](https://developer.apple.com/documentation/Xcode/extending-and-customizing-agents), [Kimi interaction guide](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction), [Kimi Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)

Do not adopt React Spectrum’s high-level mobile ComboBox presentation wholesale: it deliberately changes to a tray on small screens. Pi Remote requires an anchored terminal-style completion surface and already has a multiline composer, so it needs lower-level list/press/overlay behavior instead. React Aria explicitly supports mixing components with lower-level hooks when a standard component does not fit. [React Spectrum ComboBox](https://react-spectrum.adobe.com/v3/ComboBox.html), [React Aria getting started](https://react-spectrum.adobe.com/react-aria/.../getting-started.html)

### The trigger must be lexical and caret-aware

Use the strict terminal rule demonstrated by Kimi:

- `/` must be byte/character zero of the composer value.
- A slash after leading whitespace is ordinary text.
- The caret must remain inside the first command token: from position 1 through the first whitespace.
- Deleting back to `/` reopens the complete catalog.
- Moving the caret into arguments or inserting the first whitespace closes completion.
- Pasting or dictating a value beginning with `/` may trigger completion, but IME composition must finish before filtering or selection logic runs.

Kimi explicitly treats a slash after leading whitespace as normal text, and its changelog records a production fix for IME composition during slash-command selection. [Kimi interaction guide](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction), [Kimi CLI changelog](https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md)

### Keep DOM focus and the iOS keyboard on the composer

The popup must not steal focus when it opens, filters, scrolls, or receives a normal tap. WAI’s autocomplete guidance keeps DOM focus on the text input and exposes the active suggestion through `aria-activedescendant`; the popup is not part of the normal Tab sequence. [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [MDN `aria-autocomplete`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-autocomplete)

There is an important semantic wrinkle: an ARIA `combobox` is defined as a single-line editable field, while Pi Remote’s composer is multiline. Do not replace the `<textarea>` or force `role="combobox"` merely to obtain a convenient abstraction. Retain native multiline textbox semantics and expose list autocomplete with `aria-autocomplete`, `aria-controls`, `aria-activedescendant`, status announcements, and a separately labelled `listbox`. This needs real VoiceOver testing because it is less canonical than a single-line combobox. [MDN combobox role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/combobox_role), [MDN `aria-autocomplete`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-autocomplete)

React Aria’s `preventFocusOnPress` is appropriate only where alternative keyboard interaction exists, explicitly citing ComboBox-like controls. That condition is met here because the textarea retains focus and handles arrows plus Enter. Use the library’s press abstraction instead of ad hoc click/touch duplication. [React Spectrum interaction API](https://react-spectrum.adobe.com/v3/ListView.html), [React Aria press changes](https://react-spectrum.adobe.com/v3/releases/2025-03-05.html)

### Touch must distinguish taps from scrolling

Every row should be one touch target, at least 56 CSS px high with a minimum 44×44 CSS-px hit region. Apple’s general minimum is 44×44 pt; WCAG 2.2 AA requires at least 24×24 CSS px, so the Apple value is the appropriate iPhone target. Custom controls also need a visible pressed state. [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

Required gesture behavior:

- Tap-release on a stationary row inserts the command.
- Vertical drag scrolls the command list and cancels row activation.
- Horizontal swipe has no command meaning.
- Swipe-down does not dismiss the popup.
- Long-press on a row has no hidden action; suppress row text selection and contextual menus.
- Long-press inside the composer remains native, preserving caret placement, text selection, copy/paste, and the iOS edit menu.

Apple recommends standard gestures, simple interactions for frequent actions, and visible alternatives to gestures. Hidden swipe or long-press execution would violate that guidance and be particularly unsafe for remote host commands. [Apple HIG: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures/), [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

### The keyboard contract must separate selection from submission

Kimi’s web UI establishes Up/Down plus Enter as the relevant completion controls. Pi Remote must deliberately diverge from terminal execution behavior: selecting a completion only edits the composer; it never sends or executes anything. [Kimi Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)

While the popup is open:

- `ArrowDown`/`ArrowUp`: move the active option, without wrapping.
- `Enter`: insert the active option and close the popup; call `preventDefault()` on composer submission.
- `Escape`: close the popup, retain all text, and retain composer focus.
- `Tab`: close the popup and continue normal focus traversal; do not use Tab as a hidden selection shortcut.
- `Shift+Enter`: insert a newline and close completion.
- Left/Right, Home/End, deletion, selection shortcuts, undo/redo, and modifier combinations retain native text-editing behavior.
- If there is no active option, Enter must not submit; announce “No command selected.” The user can dismiss completion and explicitly send the text.

This follows the WAI requirement not to interfere with platform text-editing keys while the editable field owns focus. [WAI-ARIA combobox keyboard guidance](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

### The overlay must follow the visual viewport, not the layout viewport

On-screen keyboards can shrink the visual viewport without changing the layout viewport. The composer and popup therefore need to respond to `visualViewport.resize` and `visualViewport.scroll`, plus orientation changes, instead of relying only on `100vh` or a layout-viewport `position: fixed`. [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)

The composer must also retain `env(safe-area-inset-bottom)` padding in standalone mode. CSS safe-area variables exist specifically to keep PWA content clear of notches, rounded corners, and bottom system UI. [MDN CSS `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env)

The popup must be overlay-positioned rather than participating in chat/composer layout. Kimi has separately fixed both “highlighted command not kept visible” and “input box shifting upward after the slash command menu closes,” demonstrating that scroll-following and zero layout shift are real production failure modes. [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md), [Kimi release history](https://newreleases.io/project/github/MoonshotAI/kimi-code/release/%40moonshot-ai%2Fkimi-code%400.18.0)

### Native feel should come from response and restraint, not synthetic haptics

Use immediate filtering, a clear pressed state, short opacity/position transitions, and stable geometry. Apple recommends brief, precise feedback motion and avoiding ornamental animation on frequent interactions; Reduce Motion should remove translations and scaling. [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion), [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/)

Do not ship an iPhone “haptic” workaround. The Web Vibration API is not broadly available, and the relevant WebKit request remains unresolved. Visual and accessibility feedback must be complete without vibration. [MDN Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API), [WebKit vibration issue](https://bugs.webkit.org/show_bug.cgi?id=288846)

### Prior-art conclusion

Kimi provides the strongest directly documented interaction precedent: live filtering, aliases, first-character semantics, Escape dismissal, keyboard navigation, IME fixes, stable composer position, and scroll-following. Apple’s Xcode supplies first-party confirmation that slash discovery belongs in a popup attached to the message field. Open-source mobile agent clients such as Happy, MobileCLI, OpenCodex, and CC Pocket validate the remote-control context, but their public material focuses on session transport and approvals rather than detailed slash-menu gestures. [Happy](https://github.com/slopus/happy), [MobileCLI](https://github.com/MobileCLI/mobilecli), [OpenCodex](https://github.com/mjmkk/opencodex), [CC Pocket](https://github.com/K9i-0/ccpocket)

## 2. Concrete spec contribution for the build phase

### 2.1 Authoritative data contract

The inline list and existing `+` tools popover must consume the same normalized `get_commands` result and the same `insertCommand(command)` function. No client-maintained command list or fallback descriptions.

Minimum normalized fields:

```ts
type HostCommand = {
  id: string
  name: string
  aliases: string[]
  description: string
  argumentHint: string | null
  insertText?: string
  available: boolean
  unavailableReason?: string
  catalogRevision: string
}
```

Rules:

- Stable identity is `id`, not array index or display name.
- Rendering and filtering use only relay-filtered fields.
- If `insertText` is supplied, insert it verbatim.
- Otherwise insert `/${name}` and append one space only when `argumentHint` is nonempty.
- Selection never calls the host mutation endpoint.
- A later explicit Send uses the current one-use ticket and expected catalog/session revision.
- Revision mismatch fails closed, leaves the draft intact, refreshes the catalog, and shows: “Host commands changed. Review this command before retrying.”
- A failed refresh never silently substitutes a stale or hardcoded catalog.

### 2.2 Trigger parser

```text
triggerRange(value, caret):
  reject while isComposing
  reject unless value startsWith "/"
  tokenEnd = index of first Unicode whitespace, else value.length
  reject unless 1 <= caret <= tokenEnd
  query = value.slice(1, tokenEnd)
  accept {start: 0, end: tokenEnd, query}
```

Evaluate after every committed `input`, `selectionchange`, paste, dictation insertion, undo/redo, and programmatic composer update.

### 2.3 State machine

| State | Presentation | Entry | Exit |
|---|---|---|---|
| `closed` | No inline surface | Default; trigger invalid | `/` becomes valid |
| `loading` | Anchored panel; “Loading host commands…”; two static skeleton rows after 150 ms | Valid trigger without current catalog | Success, empty, or error |
| `results` | Filtered list and result count | Catalog contains matches | Query, dismissal, insertion, refresh |
| `no-match` | “No host command matches `/query`” | Valid catalog, zero matches | Query changes or dismissal |
| `catalog-empty` | “This host exposes no commands.” | Successful empty catalog | Refresh/session change |
| `refreshing` | Existing panel retained but options temporarily non-actionable; small progress label | Host/session revision changes while open | New catalog or error |
| `unavailable` | “Host commands unavailable”; no stale options | Fetch failure/offline | Automatic reconnect or next explicit `/` |
| `inserting` | Transient, one render at most | Tap or Enter on available command | Draft updated, menu closed |
| `drafted` | Normal composer containing command text | Insertion completes | User edits, sends, or clears |

Additional transitions:

- Session change closes the panel immediately and invalidates active command identity.
- If availability changes while open, preserve the active `id` when possible; otherwise choose the next available item at the same visual index.
- If the agent is busy and the host marks commands unavailable, render them disabled with the host-provided reason. Do not infer availability client-side.
- Opening the `+` tools popover closes inline completion.

### 2.4 Filtering and active-option behavior

Filter locally after the catalog is loaded; do not issue a network request per keystroke.

Ranking order:

1. Exact canonical name.
2. Canonical-name prefix.
3. Alias prefix.
4. Token-boundary fuzzy match in canonical name or alias.
5. Fuzzy match in description or argument hint.
6. Original host order as the stable tie-breaker.

Requirements:

- Case-insensitive and diacritic-insensitive.
- Highlight matched characters visually without changing the accessible name.
- First available result becomes active after opening or query change.
- Disabled results never become active.
- Active identity follows `id` across filtering.
- Arrow navigation calls `scrollIntoView({block: "nearest"})`.
- Filter computation: ≤16 ms at p95 for 1,000 commands on the lowest supported iPhone.
- Live-region result-count announcements may be debounced 150–250 ms; visual filtering is not debounced.

### 2.5 Touch and gesture contract

| Gesture | Result |
|---|---|
| Tap an available row | Insert command, close panel, restore caret after inserted text |
| Tap a disabled row | No insertion; pressed state is suppressed; VoiceOver label includes unavailable reason |
| Finger moves more than 8 CSS px before release | Treat as scroll/drag, never as selection |
| Vertical swipe | Scroll only the command list; chat remains stationary |
| Horizontal swipe | No action |
| Swipe down from panel | Scroll; never dismiss |
| Long-press row | No special action; no text-selection/context-menu affordance |
| Long-press composer text | Native iOS selection/edit menu |
| Tap composer while panel open | Move caret normally; parser decides whether panel remains open |
| Tap conversation/outside composer | Close panel; normal blur behavior applies |
| Pinch zoom | Must remain enabled |
| Tap Send | Explicit submission remains allowed; active suggestion is never implicitly inserted |

Use `touch-action: pan-y` on the scroll container and `user-select: none` on rows, not on the composer. Activation occurs on completed press/release, not `touchstart`.

### 2.6 Hardware and software keyboard contract

| Key | Popup open |
|---|---|
| `ArrowDown` | Next available result |
| `ArrowUp` | Previous available result |
| `Enter` | Insert active result; never submit |
| `Escape` | Close; preserve text and focus |
| `Tab` | Close and follow normal DOM focus order |
| `Shift+Enter` | Insert newline; close because trigger token ends |
| `PageDown`/`PageUp` | Move one visible page; optional but recommended |
| Left/Right/Home/End | Native textarea editing |
| Cmd/Ctrl+A, C, V, X, Z, Shift+Z | Native editing |
| Printable characters | Update query |
| Enter with zero selectable results | No submit; polite announcement |

Normal focus order remains:

1. `+` tools button.
2. Composer textarea.
3. Send/stop button.

Popup options are not individual Tab stops. Arrow navigation uses active-descendant semantics while DOM focus remains on the textarea.

### 2.7 Accessibility contract

Composer:

```text
native <textarea>
accessible name: “Message Pi”
aria-autocomplete="list" only while trigger is valid
aria-controls="<command-list-id>" while panel exists
aria-activedescendant="<active-option-id>" when an option is active
aria-expanded="true|false"
```

Popup:

```text
role="listbox"
aria-label="Host commands"
aria-busy="true" during loading/refresh
```

Option:

```text
role="option"
aria-selected="true" only for the active result
aria-disabled="true" when unavailable
accessible name:
“Slash {name}. Arguments: {argumentHint}. {description}. {unavailableReason}”
```

Live announcements:

- Opening: “Host commands, 18 results. Use up and down arrows, then Enter to insert.”
- Filtering: “4 commands match.”
- Active change: command accessible name.
- Insert: “Slash plan inserted. Not sent.”
- Error: “Host commands unavailable.”
- Revision change: “Host commands changed. Results refreshed.”

Do not place buttons, links, or other interactive descendants inside option rows; React Spectrum warns that these break keyboard and screen-reader navigation. [React Spectrum ComboBox accessibility](https://react-spectrum.adobe.com/ComboBox)

Rows use `min-height`, never fixed height, and descriptions wrap at large text sizes. Apple recommends supporting at least 200% text enlargement and minimizing truncation at accessibility sizes. [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/), [Apple HIG: Typography](https://developer.apple.com/design/human-interface-guidelines/typography)

### 2.8 Layout and visual specification

Panel:

- Positioned 6 CSS px above the composer.
- Same horizontal bounds as the composer content area.
- Minimum side inset: 8 CSS px.
- Width capped at the existing desktop composer maximum.
- Opaque parchment/dark-surface background; no required backdrop blur.
- 14 px radius, 1 px low-contrast carbon border, restrained elevation.
- `max-height = min(360px, available visual-viewport space above composer − 8px)`.
- Minimum usable height: two 56 px rows. Below that, descriptions collapse before row hit targets shrink.
- Internal vertical scrolling; no horizontal scrolling.
- Panel insertion/removal causes zero change to composer or conversation geometry.

Row:

- Minimum height 56 px.
- Padding 10 px vertical, 12 px horizontal.
- Canonical command: Inter 15/20, semibold.
- Argument hint: Inter 13/18, regular.
- Description: Source Serif 4 at 14/19, maximum two visual lines at normal text size.
- Active: carbon text, clay-tinted background, plus a 3 px clay leading indicator.
- Do not use clay `#d97757` alone for small text; the accent carries selection through background/border while text retains the WCAG-AA ink token.
- Pressed: slightly stronger clay tint; no scale smaller than 0.98.
- Disabled: dedicated muted text token meeting AA contrast, plus visible reason text; do not communicate state by opacity alone.

At 200% text size, allow rows to grow and descriptions to wrap. At 320 CSS-px width, the panel must reflow without page-level horizontal scrolling, aligning with WCAG’s reflow threshold. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

### 2.9 Motion and feedback

- Open: 120 ms opacity `0→1` and translate `4px→0`, transform origin at bottom.
- Close: 80 ms opacity `1→0`; no delayed input handling.
- Filtering: no animated row reordering.
- Active highlight: 80 ms background-color transition.
- Press state begins immediately and clears on release/cancel.
- `prefers-reduced-motion: reduce`: zero translation/scale; optional ≤80 ms opacity only.
- The user may type, scroll, select, or dismiss before any animation completes.
- No synthetic haptic dependency.

### 2.10 Objective acceptance checks

- Typing `/` at position zero opens the surface; typing ` /` does not.
- Filtering, opening, and closing produce zero composer-layout displacement.
- Tap-dragging the list 100 times produces zero accidental insertions.
- Selecting by tap or Enter produces zero submit/mutation requests.
- Keyboard focus remains on the textarea through opening, filtering, arrow navigation, and insertion.
- Software keyboard remains visible after tapping a command on supported iPhones.
- Escape preserves the exact composer value and selection.
- IME composition never inserts a partially composed command.
- VoiceOver announces result count, active command, argument hint, description, disabled reason, and “Not sent.”
- Active option remains visible through 20 consecutive ArrowDown presses.
- No stale catalog is presented as current after host/session revision change.
- Popup remains fully visible above the composer in standalone PWA mode, Safari mode, portrait, landscape, and after keyboard-language changes.
- Pass at 320 CSS-px width and 200% text without page-level horizontal scrolling.
- Validate on physical iPhone with VoiceOver; desktop WebKit emulation is not sufficient for final acceptance.

## 3. Divergent / minority ideas worth considering

### Press-and-scrub command selection

Allow a user to touch and hold the `/` key or a small slash affordance, slide vertically across the command list, and release to insert. This could enable fast one-handed selection resembling native picker scrubbing. It must remain an enhancement: ordinary typing and tapping are mandatory alternatives, and release must only insert, never submit.

### Schema-driven argument completion

After selecting a command whose host catalog includes structured argument choices, keep the same panel open as a second completion stage:

```text
/model → [sonnet] [opus] [haiku]
```

This would reduce keyboard work without hardcoding command semantics. Free-form arguments still return to ordinary composer text. It requires an explicit host argument schema; parsing display hints is insufficient.

### No initial active option

Instead of activating the first match immediately, open with no active result until the user presses an arrow or touches a row. This reduces accidental Enter completion and may be preferable for a security-sensitive remote. The cost is one extra action for hardware-keyboard users and weaker terminal parity. Test this against the first-result-active baseline.

### Session-local recent commands above the full catalog

When the query is exactly `/`, show up to three recent commands in a “Recent” section followed by “All commands.” Recency must be scoped to the current host/session and cleared on logout; the actual command objects still come from the current revision. Do not persist arguments or command history because they may contain sensitive text.

### Explicit command-preview affordance

A trailing information button could open a read-only preview containing full description, argument grammar, availability, and whether execution requires approval. This is more discoverable than assigning preview to long-press, but it complicates listbox semantics because interactive descendants inside options are discouraged. A separate preview region updated by active selection is safer.

## 4. Open questions and risks

- **Catalog schema:** Does `get_commands` expose stable IDs, aliases, argument hints, availability, unavailable reasons, canonical insertion text, and a revision? Without these, the client must not infer potentially unsafe behavior.
- **Unknown slash semantics:** Does unmatched `/text` become an ordinary agent prompt, a host parse error, or a rejected command? The no-match copy and Enter behavior must follow the host contract.
- **Busy-state availability:** Can commands change availability while the agent streams, or does the catalog contain only currently executable commands? Kimi distinguishes always-available commands from idle-only commands, so Pi Remote needs equivalent host truth rather than client rules. [Kimi slash commands](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html)
- **No-argument insertion:** Confirm whether all command parsers tolerate trailing spaces. Prefer host-supplied `insertText`; do not derive parser behavior from the visual hint.
- **Multiline ARIA support:** A multiline textarea with list autocomplete is not the canonical single-line combobox pattern. VoiceOver behavior must be tested on each supported iOS/WebKit floor, including touch exploration and external keyboards.
- **Focus retention on touch:** Preventing focus movement can preserve the software keyboard but can also harm accessibility if applied indiscriminately. Verify ordinary touch, VoiceOver double-tap, Switch Control, and Full Keyboard Access separately.
- **Viewport instability:** iOS keyboard language changes, dictation, rotation, browser chrome, standalone mode, and pinch zoom can alter the visual viewport. All must update the anchor without moving the composer.
- **Large catalogs:** If plugins or skills produce thousands of commands, local filtering may require virtualization. Virtualized options must keep active DOM nodes mounted so `aria-activedescendant` never references a missing element.
- **Redaction:** Descriptions, hints, availability reasons, analytics, and error messages must already be redacted by the relay. Never log full composer text or command arguments for search telemetry.
- **Haptics:** Reliable iPhone web haptics are unavailable; any workaround based on hidden native controls is brittle and should remain out of scope.
- **Mobbin validation gap:** No authenticated Mobbin screen record was accessible in this pass. Mobbin’s screen-search API requires authenticated Team/Enterprise access, so Claude/Kimi screen-level parity should be checked in a licensed workspace before visual sign-off rather than inferred. [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)

## 5. Sources

### Platform, accessibility, and web behavior

- https://developer.apple.com/design/human-interface-guidelines/gestures/
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://developer.apple.com/design/human-interface-guidelines/buttons
- https://developer.apple.com/design/human-interface-guidelines/motion
- https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards
- https://developer.apple.com/design/human-interface-guidelines/typography
- https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/
- https://developer.apple.com/documentation/Xcode/extending-and-customizing-agents
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/TR/WCAG22/
- https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-autocomplete
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/combobox_role
- https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
- https://bugs.webkit.org/show_bug.cgi?id=288846

### React Aria / React Spectrum

- https://react-spectrum.adobe.com/react-aria/.../getting-started.html
- https://react-spectrum.adobe.com/v3/ComboBox.html
- https://react-spectrum.adobe.com/ComboBox
- https://react-spectrum.adobe.com/v3/ListBox.html
- https://react-spectrum.adobe.com/v3/ListView.html
- https://react-spectrum.adobe.com/v3/releases/2025-03-05.html

### Direct slash-command prior art

- https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction
- https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html
- https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html
- https://github.com/MoonshotAI/kimi-cli
- https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md
- https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md
- https://github.com/autohandai/code-cli
- https://github.com/justhil/pi-app

### Mobile remote-agent prior art

- https://github.com/slopus/happy
- https://github.com/happier-dev/happier
- https://github.com/MobileCLI/mobilecli
- https://github.com/mjmkk/opencodex
- https://github.com/K9i-0/ccpocket
- https://github.com/SezSab/kimi-remote

### Claude and Mobbin references

- https://apps.apple.com/us/app/claude-by-anthropic/id6473753684
- https://code.claude.com/docs/en/remote-control
- https://mobbin.com/mcp
- https://docs.mobbin.com/api/quickstart
