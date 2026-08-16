<!-- provenance: external-CLI orchestration pass; original file iter-06-grok.md -->
> **Source pass 6** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-6-grok.md`.

<!-- F3-slash-commands | model=grok | lens=prior-art-github | iter 6/10 | 2026-08-15T19:00:30.117Z -->

# Prior-art GitHub — inline `/` command list for Pi Remote (iPhone PWA)

Lens: **prior-art-github** (iteration 6 of 10). Claims are grounded in shipped source, official docs, and public Mobbin flows. Mobbin MCP was not callable in this session (empty MCP catalog); Mobbin URLs below are public explore pages.

---

## 1. Findings for this lens

### 1.1 Why the current Pi Remote control cannot become the desired UX

`CommandPalette` is a **second** `ComboBox` with its **own** `Input`, opened from the `+` popover. Selection inserts `` `/${name} ` `` and never submits — that insert contract is already correct.

```25:34:apps/pi-remote-web/src/CommandPalette.tsx
    <ComboBox
      aria-label="Insert a command"
      className="command-palette"
      isDisabled={isDisabled}
      menuTrigger="focus"
      allowsEmptyCollection
      selectedKey={null}
      onSelectionChange={(key: Key | null) => {
        if (key !== null) onInsert(`/${String(key)} `);
      }}
```

The main composer is a separate `<textarea>` whose `Enter` always submits:

```119:124:apps/pi-remote-web/src/SessionComposer.tsx
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
```

Every coding-agent client that feels “type `/` like a terminal” treats **the composer as the filter field**. A nested ComboBox input is the LibreChat / OpenCode *steal-focus* variant, not the Slack/Cline/Continue-CLI variant. React Aria ComboBox is built around its own `<Input>`, not a `<textarea>` ([ComboBox docs](https://react-aria.adobe.com/ComboBox.md); [RAC ComboBox source](https://cdn.jsdelivr.net/npm/react-aria-components@1.12.0/src/ComboBox.tsx)).

### 1.2 Trigger rule: first token, then hide after arguments

| Product | Repo / source | Trigger | Hide |
|---|---|---|---|
| Continue CLI | [continuedev/continue `UserInput.tsx`](https://github.com/continuedev/continue/blob/cb273098/extensions/cli/src/ui/UserInput.tsx) | `/` is the **first non-whitespace** character | Hide once an exact command match is followed by extra content; hide if **zero matches** so Enter submits normally |
| OpenCode TUI | [anomalyco/opencode `autocomplete.tsx`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx) | `/` only when `cursorOffset === 0` | Slash vs `@` are mutually exclusive |
| Cline | [cline/cline `slash-commands.ts`](https://github.com/cline/cline/blob/8a6441fd/webview-ui/src/utils/slash-commands.ts) | `/` at start **or after whitespace**; not inside URLs/paths | Hide if whitespace appears after `/`; **only the first** slash in the message |
| The Lounge (web/PWA IRC) | [thelounge/thelounge #787](https://github.com/thelounge/thelounge/pull/787) | `/` at **beginning of the line** | Commands vs `@` nicks / `#` channels / `:` emoji |
| Claude Code | [code.claude.com interactive-mode](https://code.claude.com/docs/en/interactive-mode); [anthropics/claude-code #56002](https://github.com/anthropics/claude-code/issues/56002) | Documented as `/` at start; a “anywhere in input” changelog claim is **buggy** | Do not copy “anywhere” |
| GitHub Copilot app | [GitHub docs](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands); [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/a-guide-to-slash-commands-in-the-github-copilot-app/) | Type `/` in the prompt box; keep typing to filter | Context-dependent catalog |
| Codex CLI | [learn.chatgpt.com slash-commands](https://learn.chatgpt.com/docs/cli/slash-commands) | Type `/` to open the slash popup | Tab can **queue** a command while a turn is running |
| VS Code Chat | [microsoft/vscode `chatRequestParser.ts`](https://github.com/microsoft/vscode/blob/e3550cfac4b63ca4eafca7b601f0d2885817fd1f/src/vs/workbench/contrib/chat/common/chatRequestParser.ts) | Slash is a first-class token; not after other non-agent text | One slash command per request |
| Kimi Code | [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code); [cheat sheet](https://www.kimi.com/resources/kimi-code-cheat-sheet) | Type `/` in the input to open completion; **aliases** match | Unmatched `/foo` is sent as a **normal agent message** |
| Roo Code | [RooCodeInc/Roo-Code #6263](https://github.com/RooCodeInc/Roo-Code/pull/6263) | `/` at the **beginning of a message** | Commands live in `.roo/commands/` markdown |
| Crush | [charmbracelet/crush #2219](https://github.com/charmbracelet/crush/issues/2219) | `/` **or Ctrl+P** opens a **command palette**, then Tab for user commands | Not an inline typeahead |

**Pi Remote implication:** match Continue CLI + OpenCode TUI + Roo: **first non-whitespace character is `/`**. Do **not** adopt Cline’s mid-message slash (URLs, “plan / compact”) or Claude Code’s broken anywhere-picker. After a space (argument entry), **close the name list** (Continue + Cline). Pi’s own TUI then switches to `getArgumentCompletions` ([badlogic/pi-mono `packages/tui/src/autocomplete.ts`](https://github.com/badlogic/pi-mono/blob/156a9052/packages/tui/src/autocomplete.ts)); that RPC is **not** on `get_commands`.

### 1.3 Overlay geometry: list *above* the composer, keep the keyboard up

OpenCode’s web composer is the closest **web** peer (coding-agent prompt, list above input):

- Position: `absolute inset-x-0 -top-2 -translate-y-full` (origin bottom-left, `max-h-80`).
- **`onMouseDown={(e) => e.preventDefault()}`** so clicking a row does not blur the composer ([sst/opencode `slash-popover.tsx`](https://github.com/sst/opencode/blob/69a80663/packages/app/src/components/prompt-input/slash-popover.tsx)).

Cline’s webview uses the same geometry with an explicit height cap:

- `absolute bottom-[calc(100%-10px)]`, `maxHeight: min(200px, calc(50vh))`, `overscrollBehavior: contain`, `role="listbox"`, `aria-activedescendant` ([cline `SlashCommandMenu.tsx`](https://github.com/cline/cline/blob/8a6441fd/webview-ui/src/components/chat/SlashCommandMenu.tsx)).

BlockNote’s slash menu (Notion-style, but the positioning math is reusable) uses Floating UI `autoPlacement` of `bottom-start` **and** `top-start`, plus `size()` so `maxHeight` equals **availableHeight**, and `onMouseDownCapture preventDefault` to keep the editor focused ([TypeCellOS/BlockNote `SuggestionMenuController.tsx`](https://github.com/TypeCellOS/BlockNote/blob/ba03b7d2/packages/react/src/components/SuggestionMenu/SuggestionMenuController.tsx); [docs](https://www.blocknotejs.org/docs/react/components/suggestion-menus)). BlockNote also opens the **same** menu from a `+` button — the exact dual path Pi Remote already has.

**iPhone-specific collision:** React Spectrum ComboBox does **not** use an above-field popover on small screens. Adobe’s write-up: on mobile, ComboBox becomes a **tray**; iOS Safari covered the tray with the software keyboard until they sized against `window.visualViewport.height` and `visualViewport` `resize` ([Building a ComboBox](https://react-aria.adobe.com/blog/building-a-combobox); [`useViewportSize`](https://github.com/adobe/react-spectrum/blob/main/packages/@react-aria/utils/src/useViewportSize.ts)). Vaadin independently hit the same iOS bug: layout viewport does not resize when the keyboard opens; overlays must listen to `visualViewport` `resize` **and** `scroll` ([vaadin/web-components #7214](https://github.com/vaadin/web-components/issues/7214)).

Apple HIG: menus are expected to behave like system menus ([Menus](https://developer.apple.com/design/human-interface-guidelines/menus) — iOS default layout is a **large list**). Sheets may be nonmodal when the parent task continues ([Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)). Compact-width iOS historically prefers sheets over popovers for large option sets; that **conflicts** with the “terminal list above the composer” bar. Shipped **mobile chat** prior art (Slack iOS shortcut/slash flow) keeps suggestions attached to the composer, not a full-screen sheet ([Mobbin: Slack iOS Sending a shortcut command](https://mobbin.com/explore/flows/c367fe4e-3662-4f6f-870a-93f97e5110cc); [Slack iOS Message Composition](https://mobbin.com/explore/screens/d9cdc41b-1658-471f-a65f-fe772fa3f4ed)).

Claude iOS is the **silhouette** target, not a slash-picker target: the documented Mobbin flow is ordinary text input ([Claude iOS Chatting with Claude (text input)](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57)). Discord iOS is a chat composer with slash as a platform feature ([Discord iOS Chat Interface](https://mobbin.com/explore/screens/041a4291-f46b-48cd-8b08-dc87cceea3f7); [Discord application commands](https://docs.discord.com/developers/interactions/application-commands)).

**Pi Remote implication:** overlay **above** the tray (OpenCode/Cline/Slack), cap height with **`visualViewport`** (Adobe/Vaadin), `mousedown`/`pointerdown` preventDefault (OpenCode/Cline/BlockNote). Do not use React Spectrum’s full-screen tray as the default — it breaks “type `/` and keep typing.”

### 1.4 Composer-as-filter vs steal-focus search field

Two mutually exclusive architectures exist in GitHub:

**A. Composer is the filter (terminal-faithful, better on iPhone software keyboards).**  
Cline, Continue CLI, The Lounge, Slack/Discord, Aider (`prompt_toolkit` prefix + `completions_{cmd}` in [Aider-AI/aider `io.py`](https://github.com/Aider-AI/aider/blob/5dc9490b/aider/io.py) / [`commands.py`](https://github.com/Aider-AI/aider/blob/3ec8ec5a/aider/commands.py)). The user never leaves the textarea. iPhone has **no arrow keys** on the software keyboard, so **touch rows** are the selection path; hardware keyboards still get ↑/↓.

**B. Popover steals focus into a dedicated search `<input>`.**  
OpenCode web (`requestAnimationFrame(() => el.focus())` on a `placeholder="/"` field inside the popover). LibreChat `PromptsCommand` / `$` skills: callback-ref focuses a combobox, **clears the trigger character from the textarea**, Tab/Enter/click select ([LibreChat #12677](https://github.com/danny-avila/LibreChat/pull/12677), [#12690](https://github.com/danny-avila/LibreChat/pull/12690), [`PromptsCommand.tsx`](https://github.com/danny-avila/LibreChat/blob/main/client/src/components/Chat/Input/PromptsCommand.tsx)).

Pattern B is easier for RAC ComboBox (it wants its own Input) and for VoiceOver focus. Pattern A matches the goal text (“`/` as first char opens a list above the composer; fuzzy filter **as you type**”).

**Anti-pattern in B:** LibreChat `/` **submits** a prompt template on select (`submitPrompt(...)`). Pi Remote’s contract is insert-only. LibreChat’s `$` path is the correct one: insert `` `$skill-name ` ``, close popover, do not send.

### 1.5 Filter algorithm: prefix vs contains vs fuzzy-on-description

| Source | Algorithm |
|---|---|
| Cline | Case-insensitive **prefix** on `name` only |
| Aider | Prefix on `/command`; then per-command argument completions |
| React Aria ComboBox default | `useFilter({sensitivity:'base'})` **contains** ([ComboBox.md](https://react-aria.adobe.com/ComboBox.md)) |
| Continue CLI | `name.toLowerCase().includes(filter)` |
| Roo Code | **fzf** over commands and modes ([#6286](https://github.com/RooCodeInc/Roo-Code/pull/6286)) |
| OpenCode TUI | fuzzysort-style ranked search over display text |
| Kimi Code web | Fuzzy over **name + description**, plus **pinyin / initials**; matched fragments **bold**; close on session switch and composer blur ([kimi-code CHANGELOG / #2922](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)) |

RAC already ships `useFilter`. Do not add `cmdk`, `fuse.js`, or `fzf` unless description search is required. Kimi’s description fuzzy is the quality bar named in the brief; Cline’s prefix is faster for 10–30 short tokens (Pi catalogs are capped in `projectCommandCatalog`).

### 1.6 Row content: name + description + argument hint — and a protocol gap

**Host TUI (pi-mono)** already renders argument hints in the dropdown after [PR #2780](https://github.com/badlogic/pi-mono/pull/2780):

```
→ pr   <PR-URL>       — Review PRs …
```

`SlashCommand` is `{ name, description?, argumentHint?, getArgumentCompletions? }` ([pi-mono `autocomplete.ts`](https://github.com/badlogic/pi-mono/blob/156a9052/packages/tui/src/autocomplete.ts)). Claude Code’s frontmatter key is `argument-hint: [arg1] [arg2]` ([anthropics/claude-code frontmatter-reference](https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/command-development/references/frontmatter-reference.md)). Crush extracts named `$ARGS` from markdown ([charmbracelet/crush `commands.go`](https://github.com/charmbracelet/crush/blob/95fcd888/internal/commands/commands.go)).

**VS Code Chat** learned that putting **description** in the input as ghost text is noisy; placeholders must be **`argumentHint` only** ([microsoft/vscode #324009](https://github.com/microsoft/vscode/issues/324009); [`slashCommands.ts` placeholder decorations](https://github.com/microsoft/vscode/blob/main/src/vs/sessions/contrib/chat/browser/slashCommands.ts); prompt-file field in [vscode-docs prompt-files.md](https://github.com/microsoft/vscode-docs/blob/main/docs/agent-customization/prompt-files.md)).

**Pi Remote cannot show a real argument hint today.** Host `get_commands` documents `name`, `description`, `source`, `location`, `path` — **no `argumentHint`** ([pi-mono `rpc.md`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)). The relay projector keeps only:

`name`, `description`, `source`, `enabled`, `disabledReason`, `requiresConfirmation`

and **strips paths** (`pathFreeToken` rejects `/` and `\`). Built-in TUI commands (`/settings`, `/model`, …) are **explicitly excluded** from `get_commands` and would not run if sent via `prompt`. Skills appear as `skill:brave-search` (colon is allowed; Cline’s regex is `[a-zA-Z0-9_.:@-]+`).

OpenCode web shows **source badges** (skill / mcp / custom) on the same row as `/{trigger}` + description ([`slash-popover.tsx`](https://github.com/sst/opencode/blob/69a80663/packages/app/src/components/prompt-input/slash-popover.tsx)). OpenCode **TUI** deliberately **omits** `source === "skill"` from `/` autocomplete and routes skills through Ctrl+P / `/skills` ([anomalyco/opencode #22129](https://github.com/anomalyco/opencode/issues/22129)) — web and TUI catalogs **diverge**. Kimi web vs TUI also diverged (`/usage` missing from web menu, sent as a normal message — [MoonshotAI/kimi-code #2354](https://github.com/MoonshotAI/kimi-code/issues/2354)).

**Pi Remote implication:** the list must be the **relay-filtered** catalog, not a hardcoded subset. Show `source` as a quiet badge (`extension` / `prompt` / `skill`). Disabled rows stay visible and non-selectable (`enabled` + `disabledReason`). Until RPC grows `argumentHint`, put expected args in the **description column** if the host already concatenated them; do not invent hints.

### 1.7 Select vs submit — the invariant every good client shares

- **Insert, never send:** Cline `insertSlashCommand` writes `/name ` + trailing space. Continue CLI completes then leaves the user in the buffer. OpenCode TUI sets `newText = "/" + name + " "`. Discord autocomplete fills an option; the user still hits send ([discord-api-docs](https://github.com/discord/discord-api-docs/blob/main/developers/interactions/application-commands.mdx)). Slack iOS suggests, then the user executes ([Mobbin flow](https://mobbin.com/explore/flows/c367fe4e-3662-4f6f-870a-93f97e5110cc)).
- **Enter while the list is open is Select, not Send.** The Lounge: Enter completes; Tab completes ([#1609](https://github.com/thelounge/thelounge/pull/1609)). Continue: if the filtered list is empty, **hide** so Enter submits. Codex: Tab **queues** during a run ([Codex slash-commands](https://learn.chatgpt.com/docs/cli/slash-commands)) — relevant to Pi Remote’s steer / Later states.
- **Escape closes without changing a prior choice** — W3C APG combobox vs listbox distinction ([APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/); [MDN combobox](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/combobox_role)).
- **Kimi unmatched `/foo` becomes a chat message.** Pi Remote must **not** copy that for names the phone is not allowed to see: `CommandService.isSlashCommandAllowed` re-fetches the filtered catalog and fail-closes ([`command-service.ts`](apps/pi-remote-relay/src/commands/command-service.ts)). Privileged name regex already drops `credential|password|secret|token|…|exit|quit`.

Discord is a **structured** two-phase form (command → typed options, max 25 autocomplete choices). Mattermost is server-driven nested `AutocompleteData` ([mattermost `command_autocomplete.go`](https://github.com/mattermost/mattermost-server/blob/v5.39.3/app/command_autocomplete.go); [webapp #5499](https://github.com/mattermost/mattermost-webapp/pull/5499)). Pi commands are **free-text after `/name `**, like Claude Code / pi-mono, not Discord options. Do not build an argument form unless the host exposes typed args.

### 1.8 Accessibility and iPhone chrome that GitHub + HIG actually specify

- RAC `ListBox` + `ListBoxItem` text slots (`label` / `description`) is the stack-native APG mapping ([react-aria Menu/ListBox slots](https://react-aria.adobe.com/ComboBox.md)). Combobox popovers are **`isNonModal`** so AT can still reach the input ([RAC Popover](https://react-aria.adobe.com/Popover)).
- Cline announces via `ScreenReaderAnnounce` and wires `aria-activedescendant` to `slash-command-menu-item-${i}`.
- Apple HIG hit targets: use the **large list** menu layout; rows must be thumb-sized (44 pt), not Cline’s `py-2` ~32 px webview rows ([iOS menus](https://developer.apple.com/design/human-interface-guidelines/menus)).
- `enterKeyHint`: while the list is open, `"enter"` (complete); when closed with a sendable draft, `"send"`. Otherwise iOS Return submits the form — which `SessionComposer` already does.
- Kimi web: close the panel on **blur and session switch**; restyle with scroll fade + draggable scrollbar for long lists ([#2922](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)). Kimi **dropped** a fly-out close animation on a related picker ([#1556](https://github.com/MoonshotAI/kimi-code/pull/1556)) — prefer opacity, not geometry bounce, on iOS.

### 1.9 Dual entry: `+` and `/` must share one catalog component

BlockNote: `slashMenu` + `+` side menu call the same `SuggestionMenuController`. Pi’s council already specified this (`ComposerCommandMenu` from `+` **or** leading `/`). OpenCode unified palette vs slash after duplicated definitions caused drift ([anomalyco/opencode #9114](https://github.com/anomalyco/opencode/issues/9114)). Continue GUI filters slash sources by **mode** (edit vs chat) via `slashCommandSource` — a property-name mismatch shipped a silent empty menu ([continuedev/continue #12107](https://github.com/continuedev/continue/pull/12107)). Pi Remote’s analog: `commandsDisabled` / empty catalog / plan mode must use the **same** filter in both entry points.

### 1.10 What not to vendor

- **cmdk** ([dip/cmdk](https://github.com/dip/cmdk)): excellent command palette, usually a **dialog**, extra dependency, not composer-inline.
- **Tiptap suggestion + tippy** (Continue GUI, [continuedev/continue #1794](https://github.com/continuedev/continue/issues/1794)): Continue’s GUI is a Tiptap editor. Pi Remote is a textarea. Do not add Tiptap for one menu.
- **Crush palette-on-`/`**: wrong shape for “filter as you type in the composer.”
- **React Spectrum tray as default:** fights the terminal trigger (Adobe’s own mobile ComboBox).

---

## 2. Concrete spec contribution a build phase can execute

### 2.1 Architecture (non-negotiable given this stack)

1. Keep `+` → Commands as a **discoverability** path.
2. Do **not** mount `ComboBox`’s `<Input>` in the composer. Keep `#session-prompt` as the only editable field.
3. Extract a shared `CommandList` (`ListBox` + `ListBoxItem`) fed by `useCommands()`. Both `+` and `/` render it.
4. While the inline list is open, the textarea is a **combobox** in the APG sense: `role="combobox"`, `aria-expanded`, `aria-controls={listId}`, `aria-autocomplete="list"`, `aria-activedescendant` when an option is active. RAC `ListBox` may be used **uncontrolled by ComboBox**, with `isNonModal` overlay.
5. Filter with `useFilter({ sensitivity: 'base' })` from `@react-aria/i18n` (already in the RAC tree):  
   rank **name prefix** > **name contains** > **description contains**. No new fuzzy library in v1.
6. Selection writes `` `/${name} ` `` (trailing space), restores caret after that space, **never** calls `sendPrompt`.

### 2.2 Open / close predicate

Let `t` = composer value, `i` = caret.

| State id | Predicate | UI |
|---|---|---|
| `closed` | `t` empty, or first non-whitespace ≠ `/`, or catalog `error` and user dismissed | No overlay. `enterKeyHint="send"` if `canSubmit`, else `"enter"` |
| `loading` | first non-whitespace is `/` and `status === 'loading'` | Overlay, 3-row skeleton, `aria-busy` |
| `open` | first non-whitespace is `/`, caret is inside the first token (no space after `/` yet), `status === 'ready'` | Overlay with filtered rows |
| `empty` | `open` and 0 matches | “No matching commands” (not a selectable option). **Do not** steal Enter — Continue CLI rule |
| `args` | first token is `/name` **and** a space exists after it | Overlay **closed**. Optional ghost hint (see 2.6) |
| `disabled-catalog` | `commandsDisabled` | Overlay with “Commands unavailable”; rows not selectable |

**Open** when the user types `/` as the first non-whitespace character (Continue / OpenCode / Roo / The Lounge). Leading spaces still open (Continue `trimStart`). `/` in the middle of a sentence does **not** open (reject Cline-anywhere and Claude “anywhere”).

**Close** on: Backspace through `/`; first character becomes non-`/`; Escape; successful insert; entering `args`; composer blur (Kimi); session/catalog identity change; overlay `pointerdown` outside. **Do not** close on overlay `pointerdown` inside (preventDefault).

On open, call `refresh()` so the list is the live relay-filtered catalog, not a stale mount-time snapshot.

### 2.3 Gestures (iPhone + hardware keyboard)

| Input | Behavior |
|---|---|
| Type `/` at start | Open `open` / `loading`. Filter string = text after `/` until first whitespace |
| Type more letters | Live filter; reset active index to 0; scroll active into view |
| Tap row (44×min 44 pt) | Insert `/name `, close, keyboard **stays up** (`preventDefault` on `pointerdown`) |
| Hardware ↑/↓, Home/End, PgUp/PgDn | Move `aria-activedescendant`; do not move the textarea caret |
| Enter / Return while `open` and ≥1 match | Insert active row; **preventDefault** so `SessionComposer` does not submit |
| Enter while `empty` or `closed` | Existing send / steer behavior |
| Tab while `open` | Insert (The Lounge / LibreChat `$`). Do not move focus to the next control |
| Escape | Close; leave typed `/partial` in the field (APG: Escape does not commit) |
| Swipe on list | Scroll list only (`overscroll-behavior: contain`); do not dismiss the iOS keyboard |
| `+` → Commands → tap | Same insert function; if draft does not already start with `/`, append or replace per current `onInsert` (today: append). **Inline `/` should replace the partial token**, not append (Cline `insertSlashCommand`) |

Running turn: inserting a command must **not** auto-steer. Codex’s Tab-to-queue is optional later; v1 inserts into the draft only (Steer / Later remain explicit).

### 2.4 Visual / motion (ink-on-parchment, WCAG AA)

- Overlay sits **above** `.composer-tray`, width = tray width, `border-radius` 16–20 px matching the tray, parchment `#f8f8f6` / dark equivalent, 1 px carbon hairline, clay `#d97757` **only** on the active row indicator (3 px leading bar or background at ≥3:1 against parchment).
- Row: 44 pt min height; Inter 15/16 pt `/{name}`; description Inter 13 pt muted (≥4.5:1); optional source badge 11 pt caps (`EXT` / `PROMPT` / `SKILL`). Disabled: 40% opacity + `disabledReason` as description; `aria-disabled`.
- `requiresConfirmation`: trailing “asks first” label, not a different tap target.
- Max height: `min(280px, visualViewport.height - composerHeight - 12px - safe-area-inset-top)`. Recompute on `visualViewport` `resize` and `scroll` (Adobe + Vaadin).
- Empty/loading/error copy: 13 pt muted, not a fake first option.
- Motion: 140 ms opacity + 6 px translateY; `prefers-reduced-motion: reduce` → opacity only. No scale bounce (Kimi dropped it).
- Highlight filter matches in **name** with `font-weight: 600` (Kimi #2922). Do not highlight inside descriptions if that tanks contrast.

### 2.5 Accessibility

- Textarea: `aria-label` stays “Message Pi”; when open add `aria-expanded="true"` and `aria-controls`.
- List: `role="listbox"`, `aria-label="Host commands"`. Options: `role="option"`; name + description via RAC slots so VoiceOver reads both ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)).
- Live region (polite): `{n} commands` on open and when `n` changes (Cline `ScreenReaderAnnounce`).
- Overlay `isNonModal` / no `aria-modal` — VoiceOver must remain in the composer.
- Focus never moves to the list on iPhone (composer-as-filter). Hardware arrows only change active descendant.
- WCAG 2.2 target size 24 CSS px minimum; HIG 44 pt for touch — use 44.

### 2.6 Argument hints without a protocol field (v1 vs v2)

**v1 (no DTO change):** after insert, if `description` is non-null, set `aria-describedby` on the textarea to that description until the user edits. Do **not** put the full description in the placeholder (VS Code #324009).

**v2 (only if host RPC adds it):** extend `CommandDescriptorDto` with optional bounded `argumentHint` (≤200, path-free). Render dim hint in the row (`/{name}` + hint + em dash + description — pi-mono #2780). After insert, VS Code-style ghost after the caret using a CSS overlay or `::after` on a mirror, **hint only**. Do not ship fake ghosts from description.

Do not call a non-existent `getArgumentCompletions` RPC.

### 2.7 Fail-closed

- List ⊆ last successful `GET /api/commands/list` after `isSafeCommand`.
- Send path still runs `isSlashCommandAllowed`.
- Unknown `/not-a-command` may be sent as a **prompt** only if it is not privileged (Kimi behavior, gated by the relay). Privileged tokens never appear and never send.
- `path` / filesystem location never reach the phone (already true).

### 2.8 Tests a build can copy from prior art

- Cline: `shouldShowSlashCommandsMenu`, `insertSlashCommand`, `getMatchingSlashCommands` prefix tests.
- Continue CLI: first-char, hide-on-args, hide-on-zero-matches.
- Existing `CommandPalette.test.tsx`: insert `/plan ` never submits — reuse for the inline list.
- New: Enter with list open does not call `sendPrompt`; `pointerdown` on a row does not blur the textarea; `visualViewport` cap; disabled row not selectable; `/` after `hello ` does not open.

---

## 3. Divergent / minority ideas worth considering

Resist converging on “RAC ComboBox popover above the field.”

1. **Steal-focus filter field (OpenCode web, LibreChat).** Better VoiceOver and RAC ComboBox fit; worse terminal fidelity; iOS keyboard may jump. If VoiceOver testing fails on `aria-activedescendant` in a textarea, switch to this, but still **insert, never submit**.

2. **HIG/Spectrum tray (Adobe ComboBox mobile).** Full-width sheet sized to `visualViewport`, with an inner search field. Highest iOS polish, lowest “inline like a terminal” score. Keep as fallback if the overlay is clipped by Safari’s keyboard or notch.

3. **Crush `/` = command palette (Ctrl+P).** One-shot picker, not typeahead. Acceptable for 5 commands; wrong for a live host catalog.

4. **Discord two-phase argument form.** Only if the host later exposes typed options. Overkill for `$ARGUMENTS` prompts.

5. **VS Code ghost `argumentHint` in the field** after `/name `. Best-in-class once RPC has the field; noisy if you fall back to description.

6. **Kimi `/goal` pill.** Selecting some commands arms a chip instead of leaving `/goal ` text ([kimi-code #2922](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)). Tempting for `/plan`, but Pi Remote already has a Build/Plan toggle in `+`. Do not dual-drive plan mode from slash insert unless the host command is the source of truth.

7. **OpenCode TUI: hide skills from `/`.** Skills via `/skills` only. Pi `get_commands` **includes** `skill:…`. Showing them inline is more honest for a remote catalog; hiding them recreates OpenCode’s web/TUI split ([#22129](https://github.com/anomalyco/opencode/issues/22129)).

8. **Cline prefix-only vs Kimi description fuzzy.** Prefix is enough for `compact`/`plan`; description fuzzy finds “toggle plan mode” when the user types `read`. Ranked hybrid (spec 2.1) is the compromise; full pinyin (Kimi) is unnecessary unless the product is localized.

9. **BlockNote `minQueryLength`.** Wait until one character after `/` before showing. Reduces accidental opens; hurts discoverability. Open **immediately** on `/` (Copilot, Codex, Kimi, Claude Code).

10. **Codex Tab-queues during a run.** Maps to Pi steer/Later. Do not auto-queue on insert.

11. **cmdk dialog / Raycast sheet.** Fast filter, wrong chrome for a chat PWA.

12. **The Lounge Tab-complete without a visible list** (classic IRC). Invisible on iPhone. Always show the list when open.

13. **Mattermost server-driven suggestion endpoint.** Would mean a new relay route per keystroke. Conflicts with read-only-by-default and ticketed mutations. Filter **client-side** on the already-fetched catalog.

14. **IME / hardware cursor (Kimi #1022).** If Chinese IME is in scope, a second focused input (pattern B) keeps the candidate window attached; textarea overlays often lose it. English-first PWA can ignore until proven.

---

## 4. Open questions + risks

1. **`argumentHint` is not in `get_commands` or `CommandDescriptorDto`.** v1 can only show `description`. Confirm whether a protocol bump is allowed in this feature or is a follow-up.

2. **iOS PWA keyboard vs overlay.** Adobe and Vaadin both needed `visualViewport`. Unverified in *this* app’s `env(safe-area-inset-bottom)` tray. Risk: list draws under the keyboard or under the Dynamic Island. Mitigation: cap with `visualViewport` on first implementation, not after QA.

3. **Enter vs Send on software keyboards.** Current `onKeyDown` submits on every Enter. If the list is open and the user hits Return to “choose,” they will send `/pl` as a prompt unless preventDefault is wired **before** submit. Highest functional risk.

4. **Focus steal vs `aria-activedescendant` on `<textarea>`.** RAC ComboBox assumes `<input>`. Textarea + listbox is custom. VoiceOver on iOS may ignore `aria-activedescendant`. Have a steal-focus ComboBox fallback (idea 1).

5. **Catalog drift (Kimi #2354, OpenCode skills).** If relay filtering hides a command the user still types, Kimi would send it as chat; Pi must fail closed. UX copy for “command not available on this phone” is unspecified.

6. **`+` append vs `/` replace.** Today `onInsert` concatenates. Inline selection must **replace** `/partial`. Mixing the two without tests will duplicate `/plan /plan `.

7. **Built-ins excluded from RPC.** Users coming from Claude/Kimi/Codex will look for `/model` in the list. Those live in the header / `+` tools. Do not fake them into the slash list.

8. **Disabled and confirmation rows.** Showing them (discoverable) vs hiding them (cleaner) is a product choice. Prior art (OpenCode `disabled`/`hidden` flags) shows disabled, hides hidden.

9. **Fuzzy over descriptions** can surface privileged-adjacent copy if descriptions mention tokens. Descriptions are already bounded (2000) and relay-projected; still treat as untrusted text (no HTML).

10. **Claude iOS is not a slash reference.** Matching its composer silhouette while matching Slack/Kimi slash behavior is a two-reference problem; do not wait for a Claude iOS `/` menu that the Mobbin text-input flow does not show.

---

## 5. Sources

### GitHub — coding agents / remote CLI

- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md
- https://github.com/badlogic/pi-mono/blob/156a9052/packages/tui/src/autocomplete.ts
- https://github.com/badlogic/pi-mono/pull/2780
- https://github.com/badlogic/pi-mono/issues/2761
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/examples/extensions/commands.ts
- https://github.com/cline/cline/blob/8a6441fd/webview-ui/src/utils/slash-commands.ts
- https://github.com/cline/cline/blob/8a6441fd/webview-ui/src/components/chat/SlashCommandMenu.tsx
- https://github.com/continuedev/continue/blob/cb273098/extensions/cli/src/ui/UserInput.tsx
- https://github.com/continuedev/continue/blob/cf48e740/extensions/cli/src/slashCommands.ts
- https://github.com/continuedev/continue/blob/cf48e740/gui/src/components/mainInput/ContinueInputBox.tsx
- https://github.com/continuedev/continue/issues/1794
- https://github.com/continuedev/continue/pull/12107
- https://github.com/sst/opencode/blob/69a80663/packages/app/src/components/prompt-input/slash-popover.tsx
- https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx
- https://github.com/anomalyco/opencode/issues/9114
- https://github.com/anomalyco/opencode/issues/22129
- https://github.com/MoonshotAI/kimi-code
- https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md
- https://github.com/MoonshotAI/kimi-code/issues/2354
- https://github.com/MoonshotAI/kimi-code/issues/1022
- https://github.com/MoonshotAI/kimi-code/pull/1556
- https://github.com/charmbracelet/crush
- https://github.com/charmbracelet/crush/issues/2219
- https://github.com/charmbracelet/crush/blob/95fcd888/internal/commands/commands.go
- https://github.com/Aider-AI/aider/blob/5dc9490b/aider/website/docs/usage/commands.md
- https://github.com/Aider-AI/aider/blob/3ec8ec5a/aider/commands.py
- https://github.com/Aider-AI/aider/blob/5dc9490b/aider/io.py
- https://github.com/RooCodeInc/Roo-Code/pull/6263
- https://github.com/RooCodeInc/Roo-Code/pull/6286
- https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/command-development/references/frontmatter-reference.md
- https://github.com/anthropics/claude-code/issues/56002
- https://github.com/microsoft/vscode/blob/main/src/vs/sessions/contrib/chat/browser/slashCommands.ts
- https://github.com/microsoft/vscode/blob/e3550cfac4b63ca4eafca7b601f0d2885817fd1f/src/vs/workbench/contrib/chat/common/chatRequestParser.ts
- https://github.com/microsoft/vscode/issues/324009
- https://github.com/microsoft/vscode-docs/blob/main/docs/agent-customization/prompt-files.md

### GitHub — chat / PWA / editors / a11y stacks

- https://github.com/danny-avila/LibreChat/pull/3219
- https://github.com/danny-avila/LibreChat/pull/12677
- https://github.com/danny-avila/LibreChat/pull/12690
- https://github.com/danny-avila/LibreChat/blob/main/client/src/components/Chat/Input/PromptsCommand.tsx
- https://github.com/thelounge/thelounge/pull/787
- https://github.com/thelounge/thelounge/pull/1609
- https://github.com/thelounge/thelounge/pull/1800
- https://github.com/mattermost/mattermost-server/blob/v5.39.3/app/command_autocomplete.go
- https://github.com/mattermost/mattermost-webapp/pull/5499
- https://github.com/discord/discord-api-docs/blob/main/developers/interactions/application-commands.mdx
- https://github.com/TypeCellOS/BlockNote/blob/ba03b7d2/packages/react/src/components/SuggestionMenu/SuggestionMenuController.tsx
- https://github.com/dip/cmdk
- https://github.com/adobe/react-spectrum/blob/main/packages/@react-aria/utils/src/useViewportSize.ts
- https://github.com/vaadin/web-components/issues/7214

### Official docs / HIG / ARIA

- https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands
- https://github.blog/ai-and-ml/github-copilot/a-guide-to-slash-commands-in-the-github-copilot-app/
- https://docs.github.com/en/copilot/reference/chat-cheat-sheet
- https://code.claude.com/docs/en/interactive-mode
- https://learn.chatgpt.com/docs/cli/slash-commands
- https://www.kimi.com/resources/kimi-code-cheat-sheet
- https://docs.discord.com/developers/interactions/application-commands
- https://react-aria.adobe.com/blog/building-a-combobox
- https://react-aria.adobe.com/ComboBox.md
- https://react-aria.adobe.com/Popover
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/combobox_role
- https://developer.apple.com/design/human-interface-guidelines/menus
- https://developer.apple.com/design/human-interface-guidelines/sheets
- https://www.blocknotejs.org/docs/react/components/suggestion-menus

### Mobbin (public explore URLs; MCP not used this pass)

- https://mobbin.com/explore/flows/c367fe4e-3662-4f6f-870a-93f97e5110cc — Slack iOS Sending a shortcut command
- https://mobbin.com/explore/screens/d9cdc41b-1658-471f-a65f-fe772fa3f4ed — Slack iOS Message Composition
- https://mobbin.com/explore/screens/041a4291-f46b-48cd-8b08-dc87cceea3f7 — Discord iOS Chat Interface
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS Chatting with Claude (text input)
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 — Claude iOS Chat Detail

### Local (Pi Remote)

- `apps/pi-remote-web/src/CommandPalette.tsx`
- `apps/pi-remote-web/src/SessionComposer.tsx`
- `apps/pi-remote-web/src/commands.ts`
- `apps/pi-remote-relay/src/commands/command-service.ts`
- `apps/pi-remote-relay/src/store/redaction.ts`
- `packages/pi-rpc-protocol/src/types.ts` (`CommandDescriptorDto`)
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md` (ComposerCommandMenu dual trigger)
