<!-- provenance: external-CLI orchestration pass; original file iter-05-sol.md -->
> **Source pass 5** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-5-sol.md`.

<!-- F3-slash-commands | model=sol | lens=react-implementation | iter 5/10 | 2026-08-15T19:19:11.601Z -->

# React implementation research — iteration 5 of 10

## 1. Findings for the react-implementation lens

### Use `Autocomplete`, not `ComboBox`

The composer is not a value selector: its full text must remain independently editable while only the substring after the leading `/` filters commands. React Aria explicitly positions `Autocomplete` for command palettes and text completions, while `ComboBox` represents selection from a predefined set. `Autocomplete` also supports virtual focus, so arrow-key navigation moves through the collection while DOM focus remains in the text field. Its official inline-completion example uses a controlled textarea, a separately controlled filter substring, `Popover`, and `Menu`—almost exactly this feature. [`Autocomplete` documentation](https://react-aria.adobe.com/Autocomplete)

Recommended composition:

```tsx
<Autocomplete inputValue={slashTrigger.query}>
  <TextArea ref={inputRef} value={draft} onChange={setDraft} />
  <Popover
    triggerRef={composerShellRef}
    isOpen={slashTrigger.isOpen}
    placement="top start"
    isNonModal
    trigger="MenuTrigger"
  >
    <Menu items={rankedCommands} onAction={insertCommand}>
      {(command) => <MenuItem id={command.id}>...</MenuItem>}
    </Menu>
  </Popover>
</Autocomplete>
```

Use these current component entry points:

- `react-aria-components/Autocomplete`
- `react-aria-components/TextField`
- `react-aria-components/Popover`
- `react-aria-components/Menu`

`Autocomplete` is still labeled RC in the current React Aria documentation. It should therefore be pinned to an exact dependency version and isolated behind a local `SlashCommandMenu` component rather than spread through composer code. [`Autocomplete` status and API](https://react-aria.adobe.com/Autocomplete)

### The stock Pi catalog cannot fully satisfy “argument hints”

Pi RPC `get_commands` returns effective extension commands, prompt templates, and skills with `name`, optional `description`, `source`, optional `location`, and optional absolute `path`. It does not return argument syntax or aliases. Built-in TUI-only commands are deliberately absent because they cannot execute through RPC `prompt`. [`get_commands` RPC specification](https://pi.dev/docs/latest/rpc#get_commands)

Pi extensions may define `getArgumentCompletions(prefix)`, but that callback is not represented in the `get_commands` response. [`pi.registerCommand` and argument completions](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md)

Consequences:

- The UI must not invent argument hints from descriptions or parse command source files.
- `argumentHint` must be optional until the relay exposes authoritative metadata.
- Absolute `path` and other provenance details from Pi must be removed by the relay. They reveal usernames, home directories, package locations, and project layout.
- Built-in interactive Pi commands must not be hard-coded into the client: displaying them would falsely imply remote executability.

Claude Code demonstrates the fuller metadata model: skills can declare `argument-hint`, which is displayed during autocomplete. [`argument-hint` frontmatter](https://code.claude.com/docs/en/slash-commands) Pi Remote needs an equivalent relay-owned field or a Pi upstream extension before it can claim full argument-hint parity.

### The target interaction is well established

Kimi Code specifies that `/` at the start opens completion, continued typing filters in real time, aliases participate in matching, and `Esc` closes the menu. A slash after leading whitespace is ordinary text. [`Kimi Code interaction guide](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction) Its reference also exposes argument forms such as `/title [<text>]` and `/compact [<instruction>]`, validating the value of inline usage hints. [`Kimi slash-command reference](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html)

Claude Code similarly opens the command inventory on `/`, filters as letters follow, recognizes commands only at the start of the message, and passes following text as arguments. [`Claude Code commands reference](https://code.claude.com/docs/en/commands) Claude’s graphical client inserts a selected command into the input so the user can add a task before sending. [`Claude Code Desktop skills flow](https://code.claude.com/docs/en/desktop)

The key behavioral separation is:

1. Select a completion.
2. Edit or add arguments.
3. Explicitly send.

Selection is never execution.

### Use controlled text synchronously; do not transition the composer

React requires controlled textarea state to update synchronously. Transition updates cannot control text inputs; delaying the draft update risks caret jumps and reverted keystrokes. [`React textarea`](https://react.dev/reference/react-dom/components/textarea), [`useTransition` limitations](https://react.dev/reference/react/useTransition)

For a normal Pi catalog, filtering should be synchronous and memoized. Do not introduce `useDeferredValue` unless profiling proves the command list expensive: deferred results can visually lag the query, making `Enter` select a result for the previous string. React documents deferred rendering as useful for genuinely slow lists, not as a default input strategy. [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue)

When inserting a selected command, React Aria’s own inline-completion example uses `flushSync`, followed by `setSelectionRange`, so the DOM value exists before moving the caret. This is one of the narrow browser-API integrations where synchronous flushing is justified. [`Autocomplete inline completion example`](https://react-aria.adobe.com/Autocomplete#inline-completions), [`flushSync`](https://react.dev/reference/react-dom/flushSync)

### Fuzzy matching should be deterministic and name-biased

React Aria’s `useFilter` provides locale-aware prefix/contains matching, but not terminal-style fuzzy ranking. [`useFilter`](https://react-spectrum.adobe.com/react-aria/useFilter.html) Use `match-sorter` because it has deterministic tiers—exact, prefix, word-prefix, contains, acronym, ordered-character match—and supports different thresholds for object keys. [`match-sorter`](https://www.npmjs.com/package/match-sorter)

Recommended policy:

- Empty query: preserve host ordering.
- Command name: allow fuzzy ordered-character matching.
- Description: require at least substring matching.
- Argument hint: display only; do not search it initially.
- Equal scores: preserve host index.
- Do not add aliases unless the relay supplies authoritative aliases.

This prevents a vague description match from outranking an obvious command-name prefix.

### React Aria should own focus and press handling

The WAI-ARIA combobox model keeps DOM focus in the input and represents the active option with `aria-activedescendant`; `Down`, `Up`, `Enter`, and `Escape` operate the popup without moving DOM focus. [`WAI-ARIA combobox pattern`](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

React Aria `Autocomplete` supplies this virtual-focus behavior for `Menu` and `ListBox`. Avoid:

- manually focusing menu rows;
- `onMouseDown(e => e.preventDefault())` focus hacks;
- separate click and keyboard selection paths;
- interactive buttons nested inside command rows.

React Aria warns that nested interactive elements break collection keyboard and screen-reader navigation. [`React Aria collection accessibility`](https://react-spectrum.adobe.com/ComboBox#accessibility)

A standalone non-modal popover can harm screen-reader navigation. Here it is appropriate only inside the `Autocomplete` pattern, matching React Aria’s official inline example. [`Popover isNonModal warning`](https://react-aria.adobe.com/Popover)

### iPhone and installed-PWA constraints are implementation requirements

WebKit’s Visual Viewport API explicitly accounts for the onscreen keyboard and identifies custom completion popups as a use case. [`WebKit Visual Viewport support`](https://webkit.org/blog/9674/new-webkit-features-in-safari-13/) React Aria’s overlay positioning already monitors available viewport space, so custom positioning code should not compete with it.

However, standalone PWAs still have recorded WebKit defects involving unreliable `visualViewport.height` after keyboard/orientation changes and an extra bottom safe-area strip while the keyboard is open. [`WebKit bug 218983`](https://bugs.webkit.org/show_bug.cgi?id=218983), [`WebKit bug 292603`](https://bugs.webkit.org/show_bug.cgi?id=292603) Therefore:

- use `h-dvh`/`100dvh` for the application shell, not `100vh`;
- treat `visualViewport` as a measurement fallback, not the only layout truth;
- test rotation after opening and dismissing the keyboard;
- never hard-code keyboard heights;
- recompute overlay position after `orientationchange` and visual-viewport resize.

Tailwind 4 includes dynamic viewport utilities and targets Safari 16.4 or later. [`Tailwind dynamic viewport sizing`](https://tailwindcss.com/docs/height), [`Tailwind 4 compatibility`](https://tailwindcss.com/docs/compatibility)

Use `viewport-fit=cover` and apply `env(safe-area-inset-*)` only at the outer app/composer boundary. WebKit documents that `viewport-fit=cover` without safe-area padding can place controls beneath the home indicator or sensor housing. [`WebKit safe-area guidance`](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

Keep the composer textarea at a computed `16px` minimum. Kimi Code’s own web client specifically fixed iOS auto-zoom by using 16px inputs instead of disabling viewport scaling. [`Kimi Code 0.21.1 changelog`](https://www.kimi.com/code/docs/en/kimi-code-cli/release-notes/changelog.html)

### Mobile coding-agent prior art supports a shared, host-derived catalog

Relevant open-source clients include:

- [Harness Remote](https://github.com/giuliastro/harness-remote), a React/TypeScript/Vite PWA supporting Pi and other agent backends; its documentation emphasizes capability-driven UI rather than assuming every harness exposes the same commands.
- [CC Pocket](https://github.com/K9i-0/ccpocket), a mobile agent client that advertises prompt completions and Tailscale access.
- [Happy](https://github.com/slopus/happy), an open-source mobile/web remote client for Claude Code and Codex.
- [MobileCLI](https://github.com/MobileCLI/mobilecli), which recommends trusted LAN/Tailscale connectivity and challenge-response pairing.

The important prior-art lesson is not their visual styling; it is that remote clients must derive features from the connected host and current session. A second, client-maintained slash-command inventory will inevitably drift.

## 2. Concrete spec contribution a build phase can execute

### Relay contract

Return a session-scoped, already-redacted catalog:

```ts
type RemoteCommand = {
  id: string;                 // Opaque, stable within catalogRevision
  name: string;               // No leading slash
  description?: string;
  argumentHint?: string;      // Authoritative only; e.g. "[path] [format]"
  aliases?: string[];         // Authoritative only
  source: "extension" | "prompt" | "skill";
  hostOrder: number;
};

type RemoteCommandCatalog = {
  sessionId: string;
  sessionRevision: string;
  catalogRevision: string;
  commands: RemoteCommand[];
};
```

Contract requirements:

- Reject malformed names and control characters at the relay.
- Bound `name`, `description`, hint, alias count, and total catalog size.
- Strip `path`, `sourceInfo`, filesystem locations, environment values, and unrecognized fields.
- Render every string as text; never use `dangerouslySetInnerHTML`.
- Fetch on session ready/resume, reconnect, relay revision change, and after any successful command reload.
- Abort or discard responses whose `sessionId` no longer matches the active composer.
- Share this catalog with the existing `+` tools popover; there must be one cache and one normalization path.

An absent `argumentHint` renders nothing. It must not become `"…"`, `"arguments"`, or a description-derived guess.

### Component and hook boundary

```text
Composer
├── useHostCommands(sessionId)
├── useSlashTrigger(draft, selection, focus, composition)
├── useRankedCommands(catalog, query)
└── SlashCommandMenu
    ├── Autocomplete
    ├── existing TextArea
    ├── Popover
    └── Menu / MenuItem
```

`useSlashTrigger` owns only trigger detection and dismissal. `useHostCommands` owns transport and revision state. `SlashCommandMenu` owns presentation and selection. Existing message submission remains outside all three.

### Trigger grammar

Open only when all conditions pass:

```ts
draft.startsWith("/") &&
textareaIsFocused &&
selectionStart === selectionEnd &&
selectionStart >= 1 &&
!draft.slice(0, selectionStart).includes(/\s/) &&
!isComposing &&
!dismissedForCurrentSlashToken
```

Behavior:

| Input/state | Result |
|---|---|
| Empty → `/` | Open full catalog above composer |
| `/rev` | Open and fuzzy-filter by `rev` |
| ` /rev` | Do not open |
| `hello /rev` | Do not open |
| `/rev args` with caret in arguments | Closed |
| Paste `/review` into an empty composer | Open |
| Move caret back into the initial command token | Reopen unless explicitly dismissed |
| IME/composition active | Do not update trigger until `compositionend` |
| Composer blur | Close without changing draft |
| Session switch | Close, abort fetch, load new catalog |
| `Escape` | Close and preserve draft |
| Delete the leading `/` | Clear dismissal latch |
| Catalog loading | Show nonselectable “Loading commands…” state |
| Catalog failure | Show “Commands unavailable” and retry on the next explicit `/` trigger |
| Zero matches | Show “No host command matches `/query`” |

After `Escape`, keep the menu closed for that slash token. `ArrowDown` may explicitly reopen it. This respects dismissal while preserving discoverability.

### Filtering and ordering

```ts
matchSorter(commands, query, {
  keys: [
    {key: "name", threshold: rankings.MATCHES},
    {key: "aliases", threshold: rankings.WORD_STARTS_WITH},
    {key: "description", threshold: rankings.CONTAINS}
  ],
  baseSort: (a, b) => a.item.hostOrder - b.item.hostOrder
});
```

Additional rules:

- Empty query preserves the host’s extension → prompt → skill ordering.
- Empty-query results may show source section headers.
- Once filtering starts, flatten sections and sort globally by relevance.
- Do not truncate silently. The viewport scrolls through the entire filtered catalog.
- Do not virtualize initially. Add React Aria `Virtualizer` only if real catalogs exceed roughly 250 rows and profiling demonstrates a problem.

### Selection and submission isolation

On `Menu.onAction(command.id)`:

1. Resolve the command from the current `catalogRevision`.
2. Compute the first token’s end.
3. Replace only that token with `/${command.name} `.
4. Use `flushSync` for the controlled draft update.
5. Restore a collapsed selection immediately after the trailing space.
6. Keep the textarea focused.
7. Close the menu.
8. Perform no network request.

Selection must never:

- call the form submit handler;
- request a mutation ticket;
- dispatch an RPC prompt;
- execute the command;
- clear attachments;
- alter plan mode.

Add a final submission guard: while the completion menu is open, `Enter` is owned by autocomplete. The form’s submit/send handler must return without dispatching. When there are no matches, `Enter` also remains non-submitting until the menu is dismissed. The existing explicit Send gesture works normally after the menu closes.

Only Send enters the existing one-use ticket plus revision-checked mutation path. A revision failure leaves the completed command in the composer for review and retry.

### Keyboard, touch, and screen-reader behavior

| Interaction | Required result |
|---|---|
| `Down` / `Up` | Move virtual focus; textarea keeps DOM focus |
| `Home` / `End` | First/last result when the menu is active |
| `Enter` | Insert active command; never submit |
| `Escape` | Close; preserve input |
| `Tab` | Close and follow normal page tab order; do not select |
| Printable key | Edit composer and refilter |
| Touch row | Insert command; keyboard remains visible |
| Vertical swipe in list | Scroll list, not transcript |
| Tap outside | Close; preserve draft |
| VoiceOver swipe | Reach input and command options in a coherent sequence |

Set:

- textarea accessible name: `Message Pi`;
- menu label: `Available host commands`;
- each item `textValue`: `/${name} ${argumentHint ?? ""}`;
- description as React Aria’s description text slot, not a second focusable node;
- empty/loading/error text as a polite status announcement;
- no buttons, links, toggles, or badges with independent semantics inside rows.

React Aria should produce `aria-expanded`, `aria-controls`, virtual active-descendant state, menu roles, and press semantics. Test the generated accessibility tree rather than duplicating these attributes manually.

Each entire row must be tappable and at least 48 CSS pixels high. Apple recommends 44×44-point touch controls; WCAG 2.2 AA requires at least 24×24 CSS pixels, with 44×44 at the enhanced level. [`Apple touch-target guidance`](https://developer.apple.com/design/tips/), [`WCAG 2.2 target size`](https://www.w3.org/TR/WCAG22/#target-size-minimum)

### Visual specification

- Position: above composer, aligned to its leading edge.
- Gap: 8px.
- Width: `w-[var(--trigger-width)]`; React Aria exposes the trigger width as a Popover CSS variable. [`Popover styling API`](https://react-aria.adobe.com/Popover)
- Maximum height: `min(44dvh, 320px)`.
- Minimum useful landscape height: two 48px rows plus border.
- Scroll: `overflow-y-auto overscroll-contain touch-pan-y`.
- Row: `min-h-12`, 12px horizontal padding, 8px vertical padding.
- Command: Inter, 15px/20px, medium or semibold.
- Argument hint: Inter, 12px/16px, muted, no wrapping before description.
- Description: Source Serif 4, 13px/18px, maximum two visual lines.
- Surface: existing parchment token; light mode resolves to bone `#f8f8f6`.
- Text: existing carbon token.
- Clay `#d97757`: selection bar, border, or low-opacity background—not the sole normal-size text color unless its token pairing passes AA.
- Active row: carbon text plus clay-tinted background and a 2px clay leading rule.
- Focus-visible state must remain distinct from touch-pressed state.
- Dark mode uses existing semantic tokens, not inverted literal hex values.

Tailwind 4 can style React Aria’s emitted `data-focused`, `data-hovered`, `data-pressed`, `data-entering`, and `data-exiting` attributes directly. [`Tailwind data-attribute variants`](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes)

### Motion

Use opacity plus a 2–4px vertical translation:

- enter: 120ms ease-out;
- exit: 80ms linear;
- no spring, scale bounce, or transcript movement;
- filtering changes rows without animating layout.

React Aria exposes `data-entering` and `data-exiting` for interruptible overlay transitions. [`Popover state selectors`](https://react-aria.adobe.com/Popover) Under `prefers-reduced-motion: reduce`, remove translation and reduce the fade to near-instant. [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)

### iOS layout rules

```css
.app-shell {
  min-height: 100svh;
  height: 100dvh;
}

.composer-safe-area {
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}
```

Also require:

- `meta viewport="width=device-width, initial-scale=1, viewport-fit=cover"`;
- textarea `font-size: 16px`;
- no `user-scalable=no`;
- no body-level scroll while the chat transcript is the intended scroll container;
- popover anchored to the composer shell, not the caret;
- `shouldFlip={false}` so it remains above the composer and shrinks rather than appearing beneath it;
- position refresh after viewport resize and orientation change, without maintaining a competing absolute-position algorithm.

### Pass/fail verification

1. **Catalog correctness:** Fixture contains three relay commands and one stripped TUI-only command; DOM exposes exactly the three relay commands and contains no host path.
2. **Trigger matrix:** Automated table test covers beginning slash, leading whitespace, interior slash, paste, selection, caret movement, and composition.
3. **Fuzzy ordering:** Exact name > prefix > contains > ordered-character match; description-only matches never outrank a name prefix.
4. **Never submit:** Selecting by `Enter` and touch produces zero prompt/mutation requests and leaves `/${name} ` in the textarea.
5. **Revision safety:** Sending after a simulated host revision change fails closed and preserves the completed draft.
6. **Focus:** After touch selection, `document.activeElement` remains the textarea; verify additionally on a real iPhone that the software keyboard stays visible.
7. **Keyboard:** `Up`, `Down`, `Home`, `End`, `Escape`, `Tab`, and `Enter` match the interaction table.
8. **Accessibility:** Automated role/name checks plus axe pass; real-device VoiceOver announces expansion, result count, active command, hint, and description without trapping focus.
9. **Viewport:** Safari tab and installed PWA pass portrait, landscape, rotation with keyboard open, rotation after keyboard dismissal, and home-indicator devices.
10. **Reflow:** No horizontal scrolling at 320 CSS pixels or increased text size; focused content is not obscured by the sticky composer or popup. [`WCAG focus not obscured`](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
11. **Motion/theme:** Light, dark, increased contrast, and Reduce Motion all preserve active-row identification without relying on color alone.
12. **Performance:** At 500 catalog items, synchronous input plus filter work stays below one 60Hz frame on the minimum supported iPhone; no full transcript rerender occurs per keystroke.

## 3. Divergent / minority ideas worth considering

### Continue into argument completion

After selecting `/deploy `, keep the menu open and switch it from command completion to authoritative argument values such as `dev`, `staging`, and `prod`. Pi already lets extensions compute argument completions, but RPC does not expose that callback. A new relay request such as `complete_command_args(commandId, prefix, catalogRevision)` would create a closer terminal experience than static hints while avoiding client guesses.

This must be host-executed, cancellable, redacted, revision-checked, and side-effect-free.

### Caret-anchored completion on larger screens

React Aria supports `getTargetRect`, and its official inline example anchors a popup to the trigger character using caret geometry. [`Custom autocomplete anchor`](https://react-aria.adobe.com/Autocomplete#inline-completions) This could be valuable on iPad or desktop.

It should not be the iPhone default: a caret-anchored menu moves as the textarea wraps, is more vulnerable to virtual-keyboard viewport defects, and provides a smaller touch surface.

### Favorites or recency ranking

Pi already has a community extension that promotes starred commands and supports live name/description filtering. [`pi-favorites-commands`](https://pi.dev/packages/pi-favorites-commands) Pi Remote could maintain on-device recency as a secondary tie-breaker.

Risks:

- it hides the canonical host order;
- usage history can reveal sensitive workflows;
- persistence needs redaction and session/workspace scoping;
- frequently used commands should not outrank an exact current query.

Treat it as an opt-in layer after parity, never part of the authoritative catalog.

### Disabled last-known catalog while offline

Instead of an empty failure state, show the last successful catalog as disabled, labeled “Last synced,” so users can remember spelling without mistaking it for current availability. Selecting would remain unavailable until the catalog is revalidated.

This is more honest than allowing stale commands and more useful than a blank error, but it adds storage and redaction obligations. Memory-only caching is preferable initially.

### Tokenized command chips

Claude Desktop visually highlights inserted commands. Pi Remote could eventually render the selected command as a non-editable chip followed by ordinary arguments.

This is not recommended for the first build: contenteditable/chip caret behavior is fragile on iOS, complicates dictation and selection, and departs from the requested terminal-inline feel. A plain controlled textarea is the safer parity implementation.

## 4. Open questions + risks

1. **Authoritative argument hints remain a contract gap.** Stock Pi RPC cannot provide them. Decide whether to extend the Pi host, maintain relay-owned metadata for relay commands only, or ship optional hints and label full parity incomplete.

2. **Catalog invalidation is underspecified.** Determine how the relay learns that extensions, prompt templates, or skills changed. Refresh-on-reconnect alone does not catch a host-side reload during a long session.

3. **Current availability is absent.** Pi reports invokable commands but not an “available while streaming” flag. The UI must not invent disabled states. If availability matters, add it host-side.

4. **`Autocomplete` release-candidate risk.** Pin it, wrap it, and preserve a fallback plan using lower-level React Aria hooks if an upgrade changes virtual-focus or inline-textarea behavior.

5. **VoiceOver cannot be signed off through DOM inspection alone.** The non-modal portal, software keyboard, virtual focus, and touch exploration combination requires testing in both Safari and an installed PWA on physical iPhones.

6. **Standalone PWA viewport defects remain active risks.** Dynamic viewport units reduce the problem but do not remove WebKit’s keyboard/safe-area edge cases. Avoid bespoke viewport state unless a reproducible device failure requires it.

7. **Descriptions are host-controlled content.** Even after filesystem paths are stripped, an extension author could put secrets or very long values in a description. Relay redaction, length caps, control-character removal, and text-only rendering are mandatory.

8. **Command-name uniqueness needs a relay guarantee.** If multiple sources advertise the same name, the relay should return only the effective invokable command or assign an opaque ID while preserving the host’s precedence.

9. **Mobbin evidence limitation.** No authenticated Mobbin connector or direct Claude/Kimi screen URL was available in this pass. Specific screen-level behavior was therefore not inferred from inaccessible images; first-party Claude and Kimi documentation was used instead. A later visual-design pass should retrieve and cite the exact authenticated Mobbin screens before claiming pixel-level parity.

## 5. Sources

- [React Aria — Autocomplete](https://react-aria.adobe.com/Autocomplete)
- [React Aria — Popover](https://react-aria.adobe.com/Popover)
- [React Aria — ComboBox](https://react-aria.adobe.com/ComboBox)
- [React Aria — ListBox](https://react-aria.adobe.com/ListBox)
- [WAI-ARIA Authoring Practices — Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [React — textarea](https://react.dev/reference/react-dom/components/textarea)
- [React — useTransition](https://react.dev/reference/react/useTransition)
- [React — useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [React — flushSync](https://react.dev/reference/react-dom/flushSync)
- [Pi — RPC mode and `get_commands`](https://pi.dev/docs/latest/rpc)
- [Pi — extension and command API](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md)
- [Pi — `getCommands` example](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/commands.ts)
- [Pi — favorites command extension](https://pi.dev/packages/pi-favorites-commands)
- [Kimi Code — interaction and input](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction)
- [Kimi Code — slash-command reference](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html)
- [Kimi Code — changelog](https://www.kimi.com/code/docs/en/kimi-code-cli/release-notes/changelog.html)
- [Claude Code — commands](https://code.claude.com/docs/en/commands)
- [Claude Code — skills and argument hints](https://code.claude.com/docs/en/slash-commands)
- [Claude Code — Desktop](https://code.claude.com/docs/en/desktop)
- [match-sorter](https://www.npmjs.com/package/match-sorter)
- [Tailwind CSS — dynamic viewport height](https://tailwindcss.com/docs/height)
- [Tailwind CSS — data and ARIA variants](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Tailwind CSS — overscroll behavior](https://tailwindcss.com/docs/overscroll-behavior)
- [Tailwind CSS — compatibility](https://tailwindcss.com/docs/compatibility)
- [WebKit — Visual Viewport API](https://webkit.org/blog/9674/new-webkit-features-in-safari-13/)
- [WebKit — iPhone safe areas](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WebKit bug 218983 — unreliable standalone-PWA visual viewport](https://bugs.webkit.org/show_bug.cgi?id=218983)
- [WebKit bug 292603 — keyboard bottom offset](https://bugs.webkit.org/show_bug.cgi?id=292603)
- [Apple — UI design tips](https://developer.apple.com/design/tips/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Harness Remote](https://github.com/giuliastro/harness-remote)
- [CC Pocket](https://github.com/K9i-0/ccpocket)
- [Happy](https://github.com/slopus/happy)
- [MobileCLI](https://github.com/MobileCLI/mobilecli)
- [Mobbin — mobile UI reference library](https://mobbin.com/)
- [Mobbin API screen-search documentation](https://docs.mobbin.com/api/quickstart)
