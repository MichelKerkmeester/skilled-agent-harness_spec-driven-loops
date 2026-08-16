<!-- provenance: external-CLI orchestration pass; original file iter-03-sol.md -->
> **Source pass 3** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-3-sol.md`.

<!-- F3-slash-commands | model=sol | lens=accessibility-i18n | iter 3/10 | 2026-08-15T19:09:32.592Z -->

# 1. Findings for the accessibility–i18n lens

## Use an inline autocomplete, not a conventional menu or mobile tray

The composer should remain the sole editing surface. Typing `/` should attach a filtered collection to the existing multiline input while DOM focus stays in that input. The WAI-ARIA combobox pattern keeps DOM focus on the editable control and exposes the active option through `aria-activedescendant`; Arrow keys move virtual focus, Enter accepts, and Escape dismisses without changing the text. This prevents the iPhone keyboard from collapsing when suggestions appear. [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

For this stack, React Aria’s `Autocomplete` is a closer fit than `ComboBox`: Adobe defines `Autocomplete` for filtering collections or providing text completions, documents virtual focus while the text input remains focused, and provides an inline-completion example using a `TextArea`, trigger character, popover, and collection. `ComboBox` is intended to select a predefined field value and may switch to a tray on mobile, which would duplicate the composer and interrupt the terminal-like flow. [React Aria Autocomplete](https://react-aria.adobe.com/Autocomplete), [React Spectrum ComboBox mobile behavior](https://react-spectrum.adobe.com/v3/ComboBox.html)

Use a `ListBox`, not a `Menu`, because choosing a row completes editable text; it does not execute the command. Each option can expose separate label and description slots, which React Aria documents as improving screen-reader announcements. Rows must not contain nested buttons or other interactive controls because those break collection keyboard and screen-reader navigation. [React Aria ListBox](https://react-aria.adobe.com/ListBox), [React Spectrum ComboBox accessibility](https://react-spectrum.adobe.com/ComboBox)

## The command source has a real data-contract gap

Pi’s RPC `get_commands` returns extension, prompt-template, and skill commands that are actually invokable through RPC. It deliberately excludes TUI-only built-ins such as `/settings` because they would not execute remotely. Its documented response includes `name`, optional `description`, `source`, `location`, and `path`. [Pi RPC documentation](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md)

Upstream currently has three mismatched representations:

- `SlashCommandInfo`, the type used for remotely available commands, has no `argumentHint`.
- `BuiltinSlashCommand` has an optional `argumentHint`, but those built-ins are not returned by RPC.
- Prompt-template loading parses `argument-hint` frontmatter, but the currently published `SlashCommandInfo` does not carry it through. [Pi slash-command types](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/slash-commands.ts), [Pi prompt-template loader](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/prompt-templates.ts)

Therefore the client must never invent argument hints. Add an optional relay field only when the authoritative host exposes it. When absent, omit the hint visually and from the accessible name. Do not infer it from descriptions, paths, command names, or extension source.

The accessibility tree is also an information surface. Absolute source paths and unredacted descriptions must not be placed in option labels, `aria-label`, `aria-description`, live regions, or hidden DOM. The same relay redaction used for visible content must run before any accessibility string is created.

## Trigger and selection behavior should copy the proven terminal rules, not merely the visual styling

Kimi Code documents that `/` at the beginning opens a completion menu, results filter live, Escape closes it, and a slash after leading whitespace remains ordinary text. Dynamic skills also appear in the command panel. [Kimi Code interaction](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction), [Kimi slash commands](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html)

Kimi’s web implementation provides particularly relevant failure evidence:

- Automatically sending a selected skill prevented users from appending arguments.
- Long names and descriptions overflowed fixed-width rows.
- Substring matching without ranking exact matches first could make `/log` select `/login`.
- The fixes retained editable text after selection, wrapped long content, and ranked exact matches before arbitrary substrings. [Kimi Code PR #878](https://github.com/MoonshotAI/kimi-code/pull/878)
- Later fixes kept the highlighted row visible during long-list navigation and retained a 16px input size on iOS instead of disabling viewport scaling. [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)

Pi’s own TUI likewise opens slash completion on `/`, displays descriptions, and treats completion separately from submission. Its RPC ordering is extensions, templates, then skills. Preserve that host order only as a tie-breaker after exact and prefix relevance. [Pi TUI autocomplete](https://github.com/badlogic/pi-mono/blob/main/packages/tui/README.md), [Pi extension documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)

## Screen-reader output must be deliberate and non-repetitive

Expected accessibility structure while open:

- Composer: accessible name “Message Pi”; editable, multiline, autocomplete=list, expanded=true.
- Composer controls the command list and references the active option.
- Popup: “Available commands” listbox.
- Row: one option with a localized “Slash command” prefix, canonical command name, description, argument hint when present, and position in the filtered set.
- DOM focus remains in the composer; the active row is represented through virtual focus.

Use React Aria’s generated semantics rather than layering duplicate hand-written roles over them. The resulting DOM must nevertheless be tested for `aria-expanded`, `aria-controls`, `aria-activedescendant`, `role=listbox`, `role=option`, and `aria-selected`.

Provide one non-focusable `role="status" aria-atomic="true"` for loading, result counts, empty results, catalog refreshes, and failures. A status role is implicitly polite and atomic; W3C specifically demonstrates it for announcing changed search-result counts without moving focus. [WAI-ARIA `status`](https://www.w3.org/TR/wai-aria/#status), [W3C search-results status example](https://www.w3.org/WAI/WCAG22/working-examples/aria-role-status-searchresults/)

Do not duplicate active-option announcements in the live region: `aria-activedescendant` already announces navigation. Debounce result-count announcements until filtering has been idle for 250–300 ms so VoiceOver does not queue one sentence per keystroke.

## Dynamic Type needs an explicit PWA strategy

Apple recommends 17 pt as the default iOS text size, at least 11 pt for custom text, support for enlargement to at least 200%, adaptive layouts, and minimal truncation at accessibility sizes. Apple also permits an in-app font-size control as an alternative route to its Larger Text requirement. [Apple typography guidance](https://developer.apple.com/design/human-interface-guidelines/typography), [Apple Larger Text criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/larger-text-evaluation-criteria)

Because Pi Remote uses Inter and Source Serif 4 rather than native Dynamic Type text styles, implement a persisted application text scale from 100% through 200%. Keep browser zoom and text adjustment enabled; never use a viewport declaration that disables zoom and never use `text-size-adjust: none`. All row heights must be content-driven.

At 200%:

- Names, hints, and descriptions must wrap without clipping or ellipsis.
- The list becomes shorter and scrollable rather than shrinking text.
- At least one complete option remains visible above the composer.
- The active option is scrolled into view with non-animated `block: nearest`.
- No horizontal scrolling is required at 320 CSS px.

These conditions implement WCAG 2.2 Resize Text and Reflow. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Clay cannot carry accessibility meaning on bone by itself

Using the WCAG relative-luminance formula, clay `#d97757` against bone `#f8f8f6` is approximately **2.94:1**. It fails the 4.5:1 requirement for normal text and narrowly misses the 3:1 requirement for meaningful non-text boundaries. WCAG requires 4.5:1 for normal text and 3:1 for large text and meaningful UI graphics. [WCAG 2.2 contrast criteria](https://www.w3.org/TR/WCAG22/#contrast-minimum)

Consequences:

- Do not use clay for command names, descriptions, argument hints, focus rings, or the sole active-row indicator in light mode.
- Use carbon text and a carbon 2px inset outline or leading mark for the active row.
- Clay may remain a redundant wash, decorative rail, or accent glyph.
- In dark mode, measure against the actual dark token; do not assume that passing against a representative dark color proves conformance.
- Focus and selection must remain identifiable without color, for example by outline plus weight/background change.

## iPhone sizing and keyboard geometry are functional requirements

Apple calls for 44×44 pt hit regions. Make every option’s entire row at least 44 CSS px high, with selection occurring on release inside the same row. Avoid small trailing targets. [Apple UI design tips](https://developer.apple.com/design/tips/)

The on-screen keyboard can shrink the visual viewport without shrinking the layout viewport. Position and cap the suggestion panel using `window.visualViewport`, not only `window.innerHeight`, and recompute on visual-viewport resize and scroll. [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)

The focused composer and its caret must remain visible when the popup, keyboard, safe-area inset, and 200% text coexist. WCAG 2.2 requires keyboard focus not to be entirely obscured by author-created content. [WCAG Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)

## RTL must mirror the interface without reversing protocol tokens

Set application language and direction at the document root and pass the BCP 47 locale through `I18nProvider`; React Aria derives locale from the browser/system by default and allows an application override. [React Aria I18nProvider](https://react-aria.adobe.com/I18nProvider)

Use logical CSS properties throughout: `padding-inline`, `margin-inline`, `inset-inline`, `border-inline-start`, and `text-align:start`. `top start` placement must resolve against the active direction.

Canonical command names and argument syntax remain LTR protocol tokens inside an RTL interface:

```html
<bdi dir="ltr" translate="no">/skill:code-review</bdi>
```

Descriptions use their supplied language/direction metadata; otherwise use `dir="auto"`. W3C recommends directional isolation for inserted strings and documents `dir="auto"`/`bdi` for mixed-direction runtime content. [W3C structural markup and RTL](https://www.w3.org/International/questions/qa-html-dir), [W3C bidi controls](https://www.w3.org/International/questions/qa-bidi-unicode-controls.en)

Do not embed invisible bidi override characters in generated labels. If a host-supplied command name contains bidi controls or line/control characters, show an escaped representation and disable insertion unless the host explicitly validates that syntax. Invisible controls can reorder surrounding text and are difficult to inspect. [W3C bidi-control guidance](https://www.w3.org/International/questions/qa-bidi-unicode-controls.en)

## Fuzzy matching must be locale-aware but insertion must remain canonical

React Aria’s `useFilter` performs locale-sensitive comparisons and can ignore case, diacritics, and Unicode normalization differences; plain `includes()` cannot. [React Aria `useFilter`](https://react-aria.adobe.com/useFilter)

Required ranking:

1. Exact canonical name.
2. Name prefix.
3. Name substring.
4. Ordered fuzzy subsequence of the name.
5. Description or argument-hint match.
6. Original host order as the final tie-breaker.

Comparison may use locale-aware, base-sensitivity matching, but selection must insert the exact canonical `name` received from the redacted catalog. Never insert the normalized search representation.

Suspend trigger parsing, filtering, Arrow interception, and Enter interception while `event.isComposing` is true. Recompute only after `compositionend`; otherwise Japanese, Chinese, and Korean IMEs can have their intermediate composition mistaken for navigation or submission.

## Motion should communicate state without moving the workspace

Apple recommends reducing bounce, zoom, scale, depth, blur, and axis-based motion when Reduce Motion is enabled, with fades preferred where a transition remains necessary. The web exposes the device preference through `prefers-reduced-motion`. [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility), [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

Use at most a 120 ms opacity transition for opening and closing. No scale, spring, slide, blur, or animated panel-height transition. Under reduced motion, use zero-duration state changes. Active-row scrolling must always be immediate, not smooth.

## Benchmark evidence has limits

Kimi’s official documentation and open-source web history substantiate the desired trigger, live filtering, editable selection, wrapping, and highlighted-row behavior. Claude’s official Remote Control documentation confirms iOS access to a locally running coding session but does not document a mobile slash-command autocomplete contract. [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control)

Open-source mobile remote-agent clients such as Happy and MobileCLI establish that phone-based control of local Codex/Claude sessions is active prior art, but neither repository documents a screen-reader-complete slash palette. They are ecosystem comparators, not accessibility evidence. [Happy](https://github.com/slopus/happy), [MobileCLI](https://github.com/MobileCLI/mobilecli)

No stable public Mobbin screen URL for the relevant Claude/Kimi command flow could be verified. Mobbin’s screen-search API requires authenticated workspace access, so this report does not attribute accessibility behavior to unverified screenshots. Screenshots would establish layout reference only; they cannot prove VoiceOver semantics, focus order, Dynamic Type, or RTL behavior. [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)

# 2. Concrete spec contribution for the build phase

## Trigger predicate

Open the command autocomplete only when all are true:

```text
composer value matches ^/[^\s]*$
selection is collapsed
caret is at the end of the value
the first character is ASCII U+002F
IME composition is not active
```

Leading whitespace, a newline, a second slash, ordinary prose before `/`, or an argument-space closes or does not open the list. Deleting the initial slash closes it. The `+` tools popover remains an equivalent discovery path.

## State machine

| State | Visual result | Accessible status | Exit |
|---|---|---|---|
| `closed` | No panel | Nothing announced | Valid slash trigger |
| `loading` | Panel above composer; static “Loading commands…” row | “Loading available commands.” | Success, failure, invalid trigger, Escape |
| `results` | Filtered selectable rows; first result active initially | Localized result count after debounce | Query change, selection, Escape, blur |
| `empty` | Noninteractive “No matching commands” row; panel remains open | “No commands match {query}.” | Query change, Escape |
| `error` | “Commands unavailable. Keep typing or try again.” | Same message, once | Retry/catalog recovery, invalid trigger, Escape |
| `refreshing` | Existing results remain; small nonanimated progress indicator | No announcement until result changes | New catalog or failure |
| `selected` | Transient reducer action only; no persistent UI | “Inserted slash command {name}.” only if selection was not already announced clearly | Immediately returns to `closed` |

A catalog refresh preserves the active command by stable ID when it still exists. If it disappears, activate the first remaining result and announce “Command list updated, {count} commands.”

## Data contract

The relay should provide only:

```ts
type RemoteCommand = {
  id: string;
  name: string;
  description?: string;
  argumentHint?: string;
  source: "extension" | "prompt" | "skill";
  language?: string;
};

type CommandCatalog = {
  revision: string;
  commands: RemoteCommand[];
};
```

Requirements:

- `id` is stable only within the catalog revision.
- `name`, `description`, and `argumentHint` are already redacted.
- No path, host name, user directory, extension filename, or source content reaches the client.
- `argumentHint` is omitted when the host does not authoritatively provide it.
- Selection is a local editor operation. It issues no mutation ticket and invokes no host action.
- Later submission follows the existing one-use ticket and revision-checked command path.

## React Aria structure

Implement the existing composer using:

```text
Autocomplete
├── TextArea: full composer value
└── non-modal Popover, placement="top start"
    └── ListBox: filtered RemoteCommand collection
        └── ListBoxItem
            ├── Text slot="label": canonical command
            └── Text slot="description": description + optional hint
```

Feed `Autocomplete.inputValue` only the substring after `/`; keep the full draft controlled by the `TextArea`. Use React Aria virtual focus. Do not manually move focus to an option.

Expected accessibility-tree invariants:

- Composer name: localized “Message Pi”.
- Expanded state exactly mirrors panel visibility.
- `aria-controls` refers to the mounted listbox.
- `aria-activedescendant` is absent when closed and refers to one existing option when active.
- Each option has a stable ID and concise `textValue` equal to the canonical `/name`.
- Accessible option speech order: “Slash command”, name, description, “Arguments”, hint, position/count.
- Missing description or hint produces no empty spoken label.
- No row contains another interactive element.
- Popup and status text are absent from the accessibility tree when closed.

## Keyboard and touch contract

| Input | Result |
|---|---|
| Printable character | Edits composer and refilters |
| Down Arrow | Activates next result; from none, activates first |
| Up Arrow | Activates previous result |
| Home / End while open | First / last result |
| Enter while a result is active | Prevent composer submit; insert canonical `/name `; close panel; retain composer focus |
| Enter with no active result | Follow normal multiline-composer behavior; never submit merely because the panel exists |
| Tab | Close and move focus normally; do not hijack Tab for completion |
| Escape | Close; text unchanged; focus remains in composer |
| Left / Right | Normal caret movement |
| Backspace | Normal edit; close when trigger becomes invalid |
| Single tap on row | Select on release, insert, close; never send |
| VoiceOver double-tap on row | Same as tap |
| Drag-scroll | Scroll only; releasing after a drag must not select |
| Tap outside | Close without editing |
| IME composition keys | No navigation or selection until composition ends |

Selection replaces the complete trigger token with the canonical command followed by exactly one ASCII space, places the caret after that space, and calls neither the form submit handler nor the host command endpoint. A subsequent explicit Send action retains existing behavior.

## Filtering details

- Query excludes the leading slash.
- Search canonical name, description, and authoritative hint.
- Exact name outranks prefix, which outranks substring and fuzzy matches.
- Preserve the active ID during reranking if it remains visible.
- Limit announcements, not matching: all matches remain available in the scroll region.
- Render the complete small/medium catalog rather than virtualizing it. If the catalog exceeds 200 commands, virtualization requires a separate VoiceOver validation and correct `aria-setsize`/`aria-posinset`.

## Visual and layout specification

- Panel: same inline width as composer; 8 px gap; aligned to logical start; parchment surface in light mode and established dark surface in dark mode.
- Maximum height: `min(42% of visualViewport.height, 22rem)`.
- Panel padding: 4 px; border and shadow must remain discernible in both schemes.
- Row: minimum 44 px hit height; 10 px block padding; 12 px inline padding; content-driven height.
- Command: Inter Semibold, `1rem/1.35`, carbon; LTR-isolated.
- Argument hint: Inter Regular, `0.875rem/1.4`, carbon-compatible secondary token; wrap.
- Description: Source Serif 4 Regular, `0.875rem/1.45`; `dir=auto`.
- Row layout: command and hint wrap on the first content line; description occupies subsequent lines.
- Apply `min-inline-size:0`, `max-inline-size:100%`, and `overflow-wrap:anywhere` to all externally supplied strings.
- No `line-clamp`, fixed row height, horizontal scroll, or ellipsis.
- Active row: subtle clay wash plus a carbon 2 px inset outline or logical-start rail and semibold label. Clay alone is insufficient.
- Composer focus: persistent 2 px high-contrast outline independent of active-row styling.
- At 200% type scale, switch the row to a single-column stack and preserve full text.

## Motion specification

- Open/close: opacity only, 120 ms maximum.
- Reduced Motion: zero-duration open/close.
- No translate, scale, spring, bounce, blur, or animated height.
- Keyboard navigation: immediate `scrollIntoView({block: "nearest", behavior: "auto"})`.

## Localization specification

- Wrap the application with `I18nProvider` using a BCP 47 locale.
- Set `<html lang>` and `<html dir>` from the same locale decision.
- Localize all UI/status strings with plural-aware messages; do not concatenate count, noun, and query fragments.
- Format counts with the current locale.
- Mark canonical command names `translate="no"` and `dir="ltr"`.
- Use `dir="auto"` plus language metadata for host descriptions.
- Use CSS logical properties exclusively in this component.
- Test mirrored placement, scrollbar location, label order, and focus outline in Arabic and Hebrew.
- Search comparison may normalize for matching; display and insertion must preserve canonical host strings.
- Do not treat full-width `／` as an executable slash unless the product explicitly adopts normalization and visibly converts it to `/`.

## Pass/fail verification matrix

The feature passes only when all checks succeed:

- VoiceOver, iPhone Safari: typing `/` announces availability without moving focus or hiding the keyboard.
- VoiceOver, installed standalone PWA: swipe navigation reaches every visible option and its description/hint.
- VoiceOver double-tap inserts but produces zero network mutation requests and zero form submissions.
- Bluetooth keyboard: Arrow/Enter/Escape behavior matches the table; Tab exits normally.
- Switch Control: every row is one selectable target of at least 44 px height.
- Japanese and Chinese IME: composition cannot select, close, or send a command.
- Arabic and Hebrew locales: panel mirrors; `/name` remains legible LTR; descriptions do not reorder neighboring text.
- German expansion fixture: UI strings at 200% do not overlap or truncate.
- 320 CSS px viewport at 200%: no horizontal scroll; at least one complete row and the focused composer remain visible.
- Light and dark modes: text reaches 4.5:1; meaningful boundaries and indicators reach 3:1.
- Clay `#d97757` is never the sole light-mode focus or selection indicator.
- Reduce Motion: computed animation and transition duration is zero.
- Catalog error and empty-result messages are announced through one polite status region.
- Filtering retains the active ID when possible and exact `/log` cannot resolve to `/login`.
- Every displayed command originates in the current relay-filtered catalog.
- Source paths, secrets, and redacted strings are absent from visible DOM, hidden DOM, ARIA attributes, logs, and snapshots.

# 3. Divergent / minority ideas worth considering

## Provide a discoverable “Commands” equivalent for users who cannot easily type punctuation

Keep `/` as the primary trigger, but let the existing `+` tools control expose a clearly named “Commands” action that opens the same collection without executing anything. This gives Voice Control, Switch Control, motor-impaired users, and keyboards where `/` is behind a layout layer an equivalent route. Both routes must share one catalog, filtering implementation, and selection reducer.

## Offer localized spoken aliases without changing protocol syntax

A command could expose searchable aliases such as localized “compact context” while still displaying and inserting `/compact`. This would improve Voice Control and non-English discovery without localizing the protocol token. Aliases must come from an authoritative localization bundle, never machine-generated from potentially sensitive descriptions.

## Add a temporary screen-reader command mode if iOS virtual focus proves unreliable

If device testing finds that current iOS Safari/VoiceOver cannot reliably traverse a textarea-linked listbox, use a deliberately activated full-height command picker as an accessibility fallback. It must return the selected command to the original caret and still never submit. Do not make this the default solely because React Spectrum commonly uses mobile trays; the inline flow better preserves terminal context.

## Normalize the full-width slash only as an explicit input accommodation

Japanese and Chinese keyboards may make `／` easier to enter than ASCII `/`. An optional accommodation could recognize U+FF0F only at position zero, immediately replace it visibly with U+002F, and announce “Converted to slash.” Silent normalization is inappropriate because it changes user-authored text.

## Let result verbosity be user-selectable

“Compact” rows could expose only command and hint visually while descriptions remain available to assistive technology and on expansion; “Detailed” rows show everything. This saves vertical space but risks unequal visible information and should not ship until tested with low-vision users. The default should remain fully visible, wrapped descriptions.

## Consider disabling description matching

Matching only names and aliases produces more predictable VoiceOver result sets and less reranking while typing. Description matching improves discovery but can make results appear unrelated to the visible query. A compromise is to place description-only matches after every name match and announce “matched in description.”

# 4. Open questions + risks

1. **Argument-hint authority:** Does Pi Remote’s relay already enrich `get_commands` with a host-authored `argumentHint`? Upstream’s current RPC type does not. Until resolved, hints must be optional rather than reconstructed.

2. **Built-in commands:** Are any TUI-only built-ins exposed by the relay despite upstream saying they are not remotely executable? Showing them would create dead options and violate the “actual available commands” goal.

3. **Unknown slash input:** Kimi sends an unmatched slash string as ordinary agent text. Pi Remote must decide whether to preserve that behavior or fail closed with “Unknown command”; this changes user expectations and security semantics.

4. **Catalog revision:** Define whether submission must carry the catalog revision from insertion time, send time, or both. If a command disappears after insertion, the later submit path must reject it explicitly rather than silently reinterpret it.

5. **Host string language:** Descriptions need language metadata for correct VoiceOver pronunciation. If the host cannot supply it, document the fallback as `und`/automatic direction rather than claiming they are localized.

6. **Bidi-control injection:** Extension-authored command metadata may contain invisible directional or control characters. Validation and escaping must occur before both visual and accessible rendering.

7. **Description confidentiality:** Redaction errors in an `aria-label` remain exposed to assistive technologies and browser accessibility inspection even when CSS hides the text.

8. **iOS interoperability:** React Aria documents textarea-triggered inline completion and virtual focus, but the exact combination must be tested on the minimum supported iOS version in Safari and installed-PWA modes. Automated ARIA inspection is insufficient.

9. **Dynamic text persistence:** Decide whether the 100–200% app text scale is global, per device, or per tailnet account. A local device preference avoids syncing accessibility information unnecessarily.

10. **Mobbin validation:** Exact Claude iOS and Kimi screen IDs still need an authenticated Mobbin review. Capture panel geometry, row density, and touch behavior, but do not infer VoiceOver, RTL, or Dynamic Type support from screenshots.

11. **Large catalogs:** If extensions create hundreds of commands, nonvirtualized rendering may become expensive. Virtualization should be introduced only after testing VoiceOver position announcements and active-descendant stability.

12. **Composer Enter policy:** If Pi Remote currently uses Enter to send on hardware keyboards, the command-selection reducer must consume exactly the selection Enter event. A second Enter after closure may follow the existing policy; the first must never reach submit.

# 5. Sources

- [WAI-ARIA Authoring Practices: Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA Authoring Practices: Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [WAI-ARIA 1.2: `status` role](https://www.w3.org/TR/wai-aria/#status)
- [W3C: Status message for search results](https://www.w3.org/WAI/WCAG22/working-examples/aria-role-status-searchresults/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG 2.2: Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
- [Apple Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple Human Interface Guidelines: Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Apple UI Design Dos and Don’ts](https://developer.apple.com/design/tips/)
- [Apple Larger Text evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/larger-text-evaluation-criteria)
- [React Aria: Autocomplete](https://react-aria.adobe.com/Autocomplete)
- [React Aria: ListBox](https://react-aria.adobe.com/ListBox)
- [React Aria: `useFilter`](https://react-aria.adobe.com/useFilter)
- [React Aria: `I18nProvider`](https://react-aria.adobe.com/I18nProvider)
- [React Spectrum: ComboBox](https://react-spectrum.adobe.com/v3/ComboBox.html)
- [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [W3C Internationalization: Structural markup and RTL](https://www.w3.org/International/questions/qa-html-dir)
- [W3C Internationalization: Bidi controls](https://www.w3.org/International/questions/qa-bidi-unicode-controls.en)
- [Pi RPC documentation](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md)
- [Pi slash-command types and built-ins](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/slash-commands.ts)
- [Pi prompt-template loader](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/prompt-templates.ts)
- [Pi extension and `getCommands` documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)
- [Pi TUI autocomplete](https://github.com/badlogic/pi-mono/blob/main/packages/tui/README.md)
- [Kimi Code interaction and input](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction)
- [Kimi Code slash-command reference](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html)
- [Kimi Code PR #878: editable selection, wrapping, ranking](https://github.com/MoonshotAI/kimi-code/pull/878)
- [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)
- [Open WebUI prompts and slash commands](https://docs.openwebui.com/features/workspace/prompts/)
- [Open WebUI repository](https://github.com/open-webui/open-webui)
- [Happy mobile coding-agent client](https://github.com/slopus/happy)
- [MobileCLI mobile terminal client](https://github.com/MobileCLI/mobilecli)
- [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control)
- [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)
