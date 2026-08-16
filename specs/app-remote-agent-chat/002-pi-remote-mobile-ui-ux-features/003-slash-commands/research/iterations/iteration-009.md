<!-- provenance: external-CLI orchestration pass; original file iter-09-grok.md -->
> **Source pass 9** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-9-grok.md`.

<!-- F3-slash-commands | model=grok | lens=competitive-teardown | iter 9/10 | 2026-08-15T19:13:16.607Z -->

# Iteration 9 — Competitive teardown: inline `/` command list (iPhone PWA)

Lens: how Claude iOS, Kimi Code, ChatGPT, Perplexity, DeepSeek, Gemini, and Meta AI handle **this exact interaction** (type `/` → live, filterable host-command list above the composer), plus the mobile-chat and coding-agent prior art that actually ships the pattern. Mobbin MCP was **not callable in this session** (no MCP servers registered); Mobbin evidence is the public flow/screen URLs below, plus this repo’s staged Claude composer teardown.

---

## 1. Findings for this lens

### 1.1 The target bar is a **dual-path** pattern, not “slash-only”

Anthropic’s official onboarding copy is unambiguous: in the Claude chat interface you can **click `+` in the lower left *or* type `/`** to view additional options and commands ([Claude Help Center — Get started](https://support.claude.com/en/articles/8114491-get-started-with-claude)). That is the same split Pi Remote already has on the `+` side (`SessionComposer` tools popover inserts `/${name} `) and is missing on the typed-`/` side.

Claude’s **iOS-specific** help does **not** document an in-composer slash menu. iOS is documented as widgets, App Intents, Shortcuts, and `claude://` deep links that **prefill** the composer (`q` / `prompt`, `mode=plan|code`) rather than opening a command list ([Claude iOS intents](https://support.claude.com/en/articles/10263469-using-claude-app-intents-shortcuts-and-widgets-on-ios); [Claude mobile URL scheme](https://support.claude.com/en/articles/14898120-open-the-claude-mobile-app-with-a-link)). Treat consumer-Claude iOS as: **composer island + `+` + morphing circular send**; slash is confirmed for the chat interface family, not as a pixel-specified iOS overlay.

This repo’s staged Claude iOS screens (logical width ~390pt) already pin the composer geometry Pi Remote copied: one rounded island, radius ~22–26pt, ~14pt padding, `+` left (~36–40pt), circular primary right, placeholder “Reply to Claude”, disclaimer 12–13pt ([`docs/design-reference/mobile-chat-apps/01-visual-teardown.md`](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)). Live CSS matches that island: `.composer-tray` radius `1.75rem` (28px), `.composer-input` `1.0625rem` / 17px (Safari zoom floor), max tray height 140px, `+` and send `2.5rem` (40px) ([`apps/pi-remote-web/src/style.css`](apps/pi-remote-web/src/style.css) ~1297–1374; [`SessionComposer.tsx`](apps/pi-remote-web/src/SessionComposer.tsx) `MAX_TRAY_HEIGHT_PX = 140`).

**Build implication:** keep `+` as the browse/discover path; make `/` the *same catalog* as a typeahead overlay on the **existing textarea**, not a second ComboBox inside the popover.

### 1.2 Kimi Code is the closest **coding-agent** spec — and its Enter semantics must **not** be copied

Kimi Code’s official interaction contract ([Interaction and input](https://moonshotai.github.io/kimi-code/en/guides/interaction.html); [Slash Commands](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html)):

| Rule | Kimi Code (documented) | Pi Remote constraint |
|---|---|---|
| Trigger | Type `/` in the input → completion menu | Same, first char / start of line |
| Filter | Real-time as you type; **aliases also match** | Need alias-aware filter if host sends them; DTO today has no `aliases` |
| Close | `Esc` closes the menu | Hardware Esc; on iPhone, backspace through `/` + tap-away |
| No match | **`/`-prefixed input is sent to the agent as a regular message** | **Do not copy.** Fail-closed + never auto-submit. Unmatched `/typo` must stay in the field. |
| Idle vs streaming | Many commands blocked while streaming; `/plan`, `/help`, `/btw` always available | Phone catalog is already relay-filtered; disabled rows must not submit |
| `@` vs `/` | `@` = files; `/` after leading whitespace = **plain text**, not the menu | Copy this: leading-whitespace `/` is not a command |
| Shell | `!` at empty input enters shell mode | Host `!` is **stripped** by `CommandService` (`name.startsWith('!')` rejected) ([`command-service.ts`](apps/pi-remote-relay/src/commands/command-service.ts) 58–64) |

The **web** composer implementation (not the TUI) is the portable spec. `MoonshotAI/kimi-cli` `useSlashCommands.ts` ([raw](https://raw.githubusercontent.com/MoonshotAI/kimi-cli/main/web/src/features/chat/useSlashCommands.ts); PR [#893](https://github.com/MoonshotAI/kimi-cli/pull/893), issue [#881](https://github.com/MoonshotAI/kimi-cli/issues/881)):

1. Detect `/` only at **start of input or after `\n`**.
2. Close the menu as soon as the query contains **whitespace** (argument phase).
3. Filter with **substring** on `name` **or** `aliases` (not prefix-only, not fuzzy).
4. ArrowUp/Down wrap; **Enter and Tab insert, they do not send**; Escape closes.
5. Insert `/${name}` plus a trailing space; caret after the space.
6. **IME-safe select:** blur textarea (ends composition) → `requestAnimationFrame` set text → rAF refocus + `setSelectionRange`. This is the iPhone CJK/autocorrect-critical sequence.

Kimi’s command tables already encode **argument hints in the command label** (`/title []`, `/compact []`, `/yolo [on\|off]`, `/goal [...]`) rather than a separate column ([slash-commands.html](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html)). That is how a phone row can show hints even when the RPC DTO has no `argumentHint` field (see §1.8).

Kimi Code is **CLI + VS Code + web**, not a documented iPhone App Store “Kimi Code” with a published slash overlay. Matching “the Kimi Code app” for this feature means matching **this composer contract**, not inventing a consumer-Kimi chat chrome.

### 1.3 ChatGPT: two products; only one is a slash catalog

**Codex / ChatGPT app composer (coding agent)** — official: type `/` in the chat composer → pick from the list **or keep typing to filter** (example `/status`). Enabled skills appear in the same list; custom prompts as `/prompts: <name>`; `$` is a separate skill invoke ([Slash commands \| ChatGPT Learn](https://learn.chatgpt.com/docs/reference/slash-commands)). Catalog includes `/plan`, `/model`, `/reasoning`, `/compact`, `/status`, `/init`, `/review`, `/goal`, `/mcp`, `/worktree`. After `/goal`, **progress UI moves out of the slash list** to a row **above the composer** with pause/resume/edit/clear — slash is for *enter* mode, buttons for *manage* mode. That is the right split vs Pi Remote’s Build/Plan toggle.

**Consumer ChatGPT iOS** does **not** have a stable, documented `/` host-command list. `@` GPT mentions are the analogue; OpenAI Support has claimed they work on iOS, while users report mentions **unavailable on iOS/Android** or not applying GPT instructions ([OpenAI Community thread](https://community.openai.com/t/mentions-feature-for-custom-gpts-not-working-with-gpt-5-1-on-web-and-in-android-app/1367275)). Do not treat consumer ChatGPT iOS as the slash target bar.

### 1.4 Discord iOS is the **mobile gold standard** for `/` + keyboard; copy layout, not bot-option RPC

Discord’s product copy: type `/` in the message box → interactive menu → browse or type to filter → select → **fill required parameters** → Enter executes ([Discord support](https://support.discord.com/hc/en-us/articles/31232432266647-Discord-Commands-Shortcuts-and-Navigation-Guide); launch post stressing **mobile autocorrect** and screen readers ([Slash Commands are Here](https://discord.com/blog/slash-commands-are-here))).

Concrete API-backed layout rules ([Application commands](https://docs.discord.com/developers/interactions/application-commands)):

- Command **name 1–32** chars (`^[-_'\p{L}\p{N}…]{1,32}$`, lowercase).
- **Description 1–100** chars (the number Slack/Discord actually fit on a phone row).
- Options = arguments; max **25**; autocomplete is a **second list** after the command is chosen.
- iOS regression record: autocomplete options render **above the keyboard**; a 261.0 client broke option picking after `/ ` + select command ([discord-api-docs#7338](https://github.com/discord/discord-api-docs/issues/7338)). Earlier iOS bug: client polled autocomplete **every 500ms even with no input change**; results slower than ~100–200ms appeared stuck ([#4731](https://github.com/discord/discord-api-docs/issues/4731)).

**Copy:** list physically above the keyboard/composer; two-phase (command then args); debounce any live completion; never hammer the relay. **Do not copy:** executing on Enter after a full command — Pi Remote must **insert only**.

### 1.5 Slack iOS is the **usage-hint** prior art (and a Mobbin flow)

Slack’s slash payload is `command` + everything after the first space as one `text` blob ([Implementing slash commands](https://docs.slack.dev/interactivity/implementing-slash-commands)). Dashboard fields:

- **Short Description** — what it does.
- **Usage Hint** — parameters; Slack’s own warning: *“You'll see a preview of the autocomplete entry where this hint is displayed, so make sure you're keeping this hint brief enough not to get truncated.”*

Built-in examples encode args in the label: `/invite [@someone] [#channel]`, `/mute [#channel]`, `/rename [new channel name]` ([Slack help](https://slack.com/help/articles/360057554553-Use-shortcuts-to-take-actions-in-Slack)).

Mobbin flow **“Sending a shortcut command” on Slack iOS**: *“The user enters a slash command in a messaging app. The app suggests commands, and then executes the command, displaying the result.”* — [mobbin.com/explore/flows/c367fe4e-3662-4f6f-870a-93f97e5110cc](https://mobbin.com/explore/flows/c367fe4e-3662-4f6f-870a-93f97e5110cc) (six screens; authenticated pixels not retrieved this pass).

Slack iOS **does execute** on send. Pi Remote must stop at Slack’s **suggest + hint** step.

### 1.6 Gemini, Perplexity, DeepSeek, Meta AI: they mostly **do not** do this on iPhone

These apps are useful as **negative space** — they solve “extra capabilities” with **chips/toggles**, not a host command catalog.

| App | iPhone composer (cited) | `/` typeahead? |
|---|---|---|
| **Gemini iOS** | Text box; **Add files** tap; Submit. Model name elsewhere. ([Gemini Apps Help — iPhone](https://support.google.com/gemini/answer/13275745?hl=en&co=GENIE.Platform%3DiOS)) | **No.** Slash and `@path` live in **Gemini CLI**, not the iOS app ([gemini-cli commands](https://github.com/google-gemini/gemini-cli/blob/HEAD/docs/reference/commands.md)). This repo’s Gemini screen shows a **tool-toggle chip** in the composer, not a slash list ([`01-visual-teardown.md`](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)). |
| **DeepSeek iOS** | **DeepThink** + **Web Search** toggles **above** the compose box; paperclip attach. No model picker. ([DeepSeek on iPhone](https://deepseekai.guide/guides/deepseek-on-iphone/); thinking mode is an API param, not a slash ([API docs](https://api-docs.deepseek.com/guides/thinking_mode))) | **No.** |
| **Perplexity** | iOS: Focus/Sources **chips**, not a documented `/` overlay. **Comet / web**: type `/` for shortcuts, `@` for mentions ([Medium write-up of Comet](https://medium.com/ai-quick-tips/the-slash-command-secret-how-to-turn-perplexity-into-a-high-speed-automation-engine-cf3869c0268a) — treat as web/Comet, not verified iOS). | **Not on iPhone chat.** |
| **Meta AI** | Empty-state suggestion **rows**; composer with model pill + mic + voice ([`01-visual-teardown.md`](docs/design-reference/mobile-chat-apps/01-visual-teardown.md) `screens/meta-ai-home.png`). | **No slash catalog.** |

**Do not** replace `/` with DeepSeek-style toggles for this feature: the host catalog is dynamic (extensions + prompts + skills, cap 500) and will not fit chips. Chips remain correct for **Build/Plan** (already in `+`).

### 1.7 Coding-agent / chat-SDK prior art that already solved “inline `/` in the composer”

| Source | Concrete behavior to steal |
|---|---|
| **Stream Chat iOS** | `/` as **first character** → command suggestions; `@` → mentions. `typingCommand(in:)` / `showCommandSuggestions(for:)`. Commands are a **composer content mode** (`addCommand`) that **clears attachments and current text**. Keyboard is a first-class problem (`ComposerKeyboardHandler`). ([Stream docs](https://getstream.io/chat/docs/sdk/ios/uikit/components/message-composer/)) |
| **SlackTextViewController** | Register prefixes `@` `# `/`; autocomplete table **above** the input bar; hardware Esc exits autocomplete. ([repo](https://github.com/runway20/SlackTextViewController)) |
| **kimi-cli web** | Exact detect/filter/insert/IME sequence in §1.2. |
| **helmor** (Lexical typeahead) | Trigger `/` at **word boundary**, `minLength: 0` (bare `/` = full catalog); on select, replace slice with `/${name} ` and leave caret for args; popup **hugs composer top edge with 8px gap**. ([slash-command-plugin.tsx](https://github.com/dohooo/helmor/blob/main/src/features/composer/editor/plugins/slash-command-plugin.tsx)) |
| **assistant-ui** | `useSlashMatches`: open iff `value.startsWith("/")`; **prefix** filter on `name`; row = icon + `/{name}` + truncated description + `↵` kbd on active. Menu motion `scale` ~97→100, **disabled under `prefers-reduced-motion`**. ([docs](https://www.assistant-ui.com/elements/composer-slash-commands)) |
| **pocketshell #767** | Same product sentence as this brief: `/` opens dropdown; **bare `/` = full catalog**; live filter; **closes once you type a space** (args are free text); select **inserts, ready to review + Send**; `+arg` hint on arg-bearing commands. ([issue](https://github.com/alexeygrigorev/pocketshell/issues/767)) |
| **Hermes agent composer** | `/` and `@` as separate triggers; Space/Tab commit slash to a **chip**; IME `composingRef`; Enter with open menu does not fall through to send. ([composer/index.tsx](https://github.com/NousResearch/hermes-agent/blob/44ddc552/apps/desktop/src/app/chat/composer/index.tsx)) |
| **ProseKit Slash Menu** | Autocomplete popover + empty state; arrows / Enter / Esc. ([docs](https://prosekit-prosekit-44.mintlify.app/components/slash-menu)) |

### 1.8 Host catalog vs phone DTO: descriptions exist; **argument hints are dropped**

Pi’s host surface already has `argumentHint` on **built-in** TUI commands (`/model`, `/login`) ([`slash-commands.ts` in pi-mono](https://raw.githubusercontent.com/badlogic/pi-mono/main/packages/coding-agent/src/core/slash-commands.ts)), plus `getArgumentCompletions` on extension commands ([commands.ts example](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/examples/extensions/commands.ts)). Official extension docs: `get_commands` / `pi.getCommands()` returns **prompt-invokable** extension + prompt + skill commands, **excludes** interactive-only builtins like `/model` and `/settings` ([pi.dev extensions](https://pi.dev/docs/latest/extensions)).

Pi Remote’s phone DTO is:

```496:503:packages/pi-rpc-protocol/src/types.ts
export interface CommandDescriptorDto {
  readonly name: string;
  readonly description: string | null;
  readonly source: CommandSource;
  readonly enabled: boolean;
  readonly disabledReason: string | null;
  readonly requiresConfirmation: boolean;
}
```

Projection: name path-free max **200**; description max **2000**; **no `argumentHint`, no aliases, no sourceInfo.path** (paths must not leak) ([`redaction.ts`](apps/pi-remote-relay/src/store/redaction.ts) 222–239). Relay then **hides** names matching `credential|login|logout|reload|share|install|…` and any name with `!`, `$`, space ([`command-service.ts`](apps/pi-remote-relay/src/commands/command-service.ts)). Tests show `/plan` survives; `login`, `reload`, `install` do not ([`commands.test.ts`](apps/pi-remote-relay/tests/commands.test.ts)). Cap **500** rows.

So the “actual available host commands” list on the phone is **already a safe subset**. The inline UI must render **that** list, not the TUI’s full builtin set. Argument hints for v1 can be: (a) derive from description, (b) parse trailing `[…]` in description, or (c) add a **path-free** `argumentHint` string (Slack-length, ≤40 chars) to the DTO — do not send `sourceInfo.path`.

### 1.9 Current composer will **auto-submit** on iPhone Return — that is the flawless-UX blocker

```119:124:apps/pi-remote-web/src/SessionComposer.tsx
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
```

The tools popover ComboBox is a **second field** (`placeholder="/ command"` + `/` button), `menuTrigger="focus"`, `onSelectionChange` → `onInsert(\`/${key} \`)` ([`SessionComposer.tsx`](apps/pi-remote-web/src/SessionComposer.tsx) 222–251; [`CommandPalette.tsx`](apps/pi-remote-web/src/CommandPalette.tsx)). React Aria ComboBox inside a `<form>` historically submitted on Enter while the list was open ([react-spectrum#1646](https://github.com/adobe/react-spectrum/issues/1646)). RAC ComboBox `menuTrigger` default is `'input'` ([ComboBox docs](https://react-spectrum.adobe.com/react-aria/ComboBox.html)) — still a **separate** input, so typing `/` in `#session-prompt` cannot open it.

iOS VoiceOver: swiping **blurs** the field and APG-style comboboxes **close on blur**, so the list is unreachable ([w3c/aria-practices#1619](https://github.com/w3c/aria-practices/issues/1619)). VoiceOver/Safari does not reliably announce `aria-activedescendant`; RAC’s own write-up uses **hidden live regions** as a workaround ([Building a Combobox](https://react-aria.adobe.com/blog/building-a-combobox)).

### 1.10 iPhone PWA geometry: the list must ride **visualViewport**, not `100vh`

On iOS Safari/PWA the layout viewport often **does not shrink**; the keyboard overlays (~300pt + ~44pt QuickType). Working pattern: `html,body,#root { height:100%; overflow:hidden }`; only the transcript scrolls; composer `bottom: max(safe-area, keyboard-inset)`; measure `max(0, innerHeight - visualViewport.height - visualViewport.offsetTop)` ([meshmonitor keyboard inset](https://github.com/Yeraze/meshmonitor/pull/3121); [ios-pwa-keyboard-fix](https://github.com/Crscristi28/ios-pwa-keyboard-fix); [polyfill-virtual-keyboard-api ios-composer](https://github.com/cameronapak/polyfill-virtual-keyboard-api/blob/master/docs/ios-composer.md)). Pre-lift on `mousedown`/`pointerdown` **before** focus and `focus({ preventScroll: true })` or Safari pans the document and the overlay misses the composer.

Apple HIG: **44×44 pt** hit targets ([HIG buttons](https://developer.apple.com/design/human-interface-guidelines/buttons); [UI Design Dos and Don’ts](https://developer.apple.com/design/tips/)); **avoid popovers in compact width** — prefer a surface that does not look like an iPad popover ([HIG popovers](https://developer.apple.com/design/human-interface-guidelines/popovers)). A list **attached to the composer top edge** (Slack/Discord/helmor) is the compact-width analogue, not `Popover placement="top"` from a hidden ComboBox. WCAG 2.2 AA also requires **24×24 CSS px** minimum (2.5.8); on iPhone, **44pt wins**.

Autocorrect: Discord shipped slash partly to **beat mobile autocorrect**. While the menu is open, set the textarea to `autoCorrect="off" autoCapitalize="none" spellCheck={false} enterKeyHint="enter"` (not `"send"`).

---

## 2. Concrete spec contribution (build-executable)

### 2.1 Trigger (open)

Open **CommandList** iff all of:

1. Connection is `live`, snapshot barrier clear, `commandsDisabled === false`.
2. Caret is in a slash token: `/` at index 0 of the draft **or** immediately after `\n`.
3. The slice from that `/` to the caret contains **no whitespace**.
4. Catalog `commands.length > 0` (else open with empty state, still not submitting).

**Non-triggers (copy Kimi/helmor, not ChatGPT mid-sentence `/`):** `/` after a space or letter; `/` in the middle of a paragraph; paste of a URL path; IME composition (`event.isComposing` / `keyCode === 229`) — do not open or change highlight until composition ends.

Bare `/` shows the **full relay-filtered catalog** (pocketshell, helmor `minLength: 0`, Discord).

### 2.2 Filter

- Query = text after `/` up to caret, Unicode-lowercased.
- Match if `name` **starts with** query **or** `name.includes(query)` **or** (if present) alias match. Rank: prefix > substring; stable tie-break = host order (extensions → templates → skills).
- Do **not** fuzzy-typo-correct in v1 (avoids selecting `/plan` when the user typed `/pla` vs `/play`). Revisit Fuse.js only if catalog > ~80 visible rows.
- Highlight index resets to **0** when the filtered set’s identity changes.
- Empty filter set: keep list open; row “No matching command”; **Return must not submit**.

### 2.3 Select (never submit)

On tap of a row, or hardware/software **Enter/Tab** while list open and `filtered.length > 0`:

1. `preventDefault` + `stopPropagation` on the composer `keydown` **and** the form `submit` (today both fire).
2. IME-safe insert (kimi-cli): blur → rAF replace leading slash token with `/${name} ` → rAF focus + caret after the space.
3. Close list. Do **not** call `sendPrompt`.
4. If `requiresConfirmation === true`, do not special-case in the list; confirmation stays on the existing ticketed path when they later send.
5. Disabled rows (`enabled === false`): visible, 44pt, not highlighted by default, tap is a no-op except `aria-live` polite `disabledReason` (≤500 chars, already on DTO).

After a trailing space, list **stays closed** (argument phase). Ghost hint (optional v1.1): one muted line under the tray, Slack usage-hint length ≤ 40 characters, e.g. `[on|off]` if `argumentHint` exists.

`+` popover keeps current insert behavior so Claude’s dual path remains ([help article](https://support.claude.com/en/articles/8114491-get-started-with-claude)).

### 2.4 Dismiss

Close without changing text when: Escape; backspace deletes the triggering `/`; caret moves out of the slash token; user types whitespace (enter args); `commandsDisabled` becomes true; connection drops. Tap on transcript: close list, **do not** blur composer if the tap was only to dismiss (iOS: use `pointerdown` on overlay backdrop with `preventDefault` so the keyboard stays). VoiceOver: **do not close on `blur`** (APG 1.2 bug); close on explicit dismiss / token invalidation only ([aria-practices#1619](https://github.com/w3c/aria-practices/issues/1619)).

### 2.5 Keyboard + touch

| Input | Behavior |
|---|---|
| iPhone software Return, list **open**, matches > 0 | Insert (not send). `enterKeyHint="enter"`. |
| Return, list open, matches = 0 | No-op (field keeps `/query`). |
| Return, list **closed**, draft not a blocked slash | Existing send/steer. |
| Shift+Return | Newline; if newline starts with `/`, list may open on the new line (Kimi). |
| ArrowUp/Down (hardware) | Move highlight; wrap; `scrollIntoView` the option (APG: browsers don’t scroll `aria-activedescendant`). |
| Tab (hardware) | Insert highlighted. |
| Touch | Entire row 44×44pt min; list scrolls independently (`touch-action: pan-y`; `overscroll-behavior: contain`). |
| Send button while list open | **Disabled** or treated as insert-then-stop — never send `/partial`. Safer: disable `.composer-primary.is-send` while `CommandList.isOpen`. |

### 2.6 Layout (iPhone, this stack)

Anchor: a `position: fixed` (or compositor-layer) panel whose **bottom** is `composer-tray.top - 8px` (helmor gap), **horizontal inset** equal to the tray (page gutter). Width = tray width. Do **not** use RAC `Popover` from a second `Input`.

- **Max height:** `min(5 * 44pt + 36pt header, 42% of visualViewport.height, 280px)`. 5 rows is Discord/Slack-like; more must virtualize (`react-aria` `ListBox` + CSS `overflow-y: auto`, `-webkit-overflow-scrolling: touch`).
- **Header (36pt):** muted Inter 11–12px, `Commands` or `{n} available` — not a search field (the composer *is* the search).
- **Row (min 44pt):**  
  - Line 1: Inter 15–16 / 550–600, ink: `/{name}` with `/` at `--ink-muted`.  
  - Line 2: Inter 12–13, `--ink-muted`, **one line**, ellipsis. Prefer `description`; if longer than ~80 glyphs, CSS truncate (Discord’s 100-char budget is the visual cap even though DTO allows 2000).  
  - Trailing: optional `argumentHint` in 11px tabular/sans, `--ink-secondary`, e.g. `[focus]`.  
  - Source: do **not** show paths; optional 10px uppercase `SKILL` / `PROMPT` / `EXT` using `.tools-label` style.
- **Highlight:** 4pt clay (`#d97757`) leading bar **or** `--accent-soft` fill; not system blue. Dark mode: same tokens.
- **Chrome:** parchment `--surface`, hairline `--line-strong`, radius match tray (`1.75rem` top corners, square toward composer). Shadow `--shadow-raised`. No extra modal dim (keeps transcript readable; HIG compact: don’t fake an iPad popover).
- **Empty:** `No matching command` 13px muted, still 44pt min hit area (non-interactive).
- **Loading/stale:** if catalog fetch in flight, skeleton 3 rows; if `stale`, header `Host updated` (existing runtime copy).

Keyboard inset: reuse one `--keyboard-inset` on `:root`; composer and list both offset. When textarea grows to 140px, **recompute** list `max-height` so list + tray + keyboard ≤ visualViewport.

### 2.7 A11y (WCAG AA + iPhone VoiceOver)

- Textarea while open: `role="combobox"` `aria-expanded="true"` `aria-controls={listId}` `aria-autocomplete="list"` `aria-activedescendant={optionId}` `aria-label` stays “Message Pi”.
- List: `role="listbox"`; rows `role="option"`; disabled `aria-disabled="true"`.
- **Live region** (RAC VoiceOver workaround): polite, visually hidden, announces `{name}, {index+1} of {n}` on highlight change; `{n} commands` when the set size changes ([RAC combobox article](https://react-aria.adobe.com/blog/building-a-combobox)).
- Contrast: name vs parchment and muted description vs parchment both ≥ 4.5:1 in light and dark (fixed DS).
- Focus: DOM focus **never** leaves the textarea (APG combobox). VoiceOver swipe into the list must **not** blur-close (§2.4).
- Reduced motion: open/close `opacity` 120ms `--ease-out`; **no** translate/scale if `prefers-reduced-motion: reduce` (assistant-ui).
- Dynamic Type: row height `max(44pt, 1.3em * 2 lines)`; do not clip at 11pt (HIG minimum).

### 2.8 Motion

- Open: opacity 0→1, 120ms, optional 4px upward settle; **no** spring, no backdrop blur animation (Claude restraint; existing `--duration-state, 120ms`).
- Filter: instant list swap (no stagger).
- Highlight: background 80–120ms.
- Insert: list unmount immediately; no success toast.

### 2.9 Implementation shape (this codebase)

- **Do not** extend the popover `ComboBox` to listen to the textarea.
- Add a hook `useSlashCommandList({ prompt, caret, commands })` modeled on [kimi-cli `useSlashCommands.ts`](https://raw.githubusercontent.com/MoonshotAI/kimi-cli/main/web/src/features/chat/useSlashCommands.ts).
- Render `ListBox`/`ListBoxItem` from react-aria-components **without** ComboBox, portaled as a sibling of `.composer-tray` inside `.composer-region`.
- Gate `SessionComposer` Enter handler: `if (slashOpen) { /* insert or no-op */; return; }`.
- Disable send while `slashOpen`.
- Keep `CommandPalette` inside `+` as browse-all (Claude dual path), same `onInsert` contract.

### 2.10 Interaction sequence (acceptance)

1. Focus composer → keyboard up → tray sits on keyboard inset.  
2. Type `/` → within one frame, list of **relay-filtered** commands appears 8px above tray, first row highlighted.  
3. Type `pl` → list shrinks to prefix/substring matches (e.g. `plan`).  
4. Tap `plan` or press Return → field is `/plan ` with caret after space; list gone; keyboard still up; send still idle.  
5. Type ` focus the auth work` → send submits the **prompt path** (existing ticketed slash revalidation `isSlashCommandAllowed`).  
6. Type `/login` → **not in list** (privileged filter); Return does not send; user backspaces.  
7. VoiceOver: rotor/swipes can reach options without the list vanishing.

---

## 3. Divergent / minority ideas (do not converge yet)

1. **Discord phase-2 argument chips** after insert (`/plan` then pill `on|off`) — better than free-text args, but host `getArgumentCompletions` is not on the phone DTO and would be a new RPC. High cost, high clarity.
2. **Hermes-style chips:** replace `/plan ` with a non-editable token + args as plain text — fights iOS caret/IME; strong on desktop, risky in PWA.
3. **iOS `inputAccessoryView` chip strip** (native UIKit) — PWA cannot; closest fake is a 44pt horizontal scroller **between** list and tray. Minority because catalogs of dozens don’t chip well (DeepSeek/Gemini chips work for 1–3 modes, not 500 commands).
4. **HIG sheet** (`bottom-sheet` of commands) instead of overlay — Apple says compact width should use sheets not popovers. **Conflicts** with the software keyboard (sheet + keyboard = unusable). Only consider if slash is opened from `+`, not from `/`.
5. **Kimi “unmatched `/` sends as a message”** — convenient in a TUI, **unsafe** here (fail-closed, privileged names). Reject for Pi Remote.
6. **Prefix-only filter** (assistant-ui) vs Kimi substring vs Fuse fuzzy — prefix is more terminal-like and avoids `/play` stealing `/pl`. Worth A/B; default prefix-then-substring.
7. **Group by `source`** (Discord groups by bot; pi `/commands` groups Extensions/Prompts/Skills) — good when n>20; costs a header row (~28pt) on a 280px budget.
8. **Kill the `+` command ComboBox** once inline `/` ships — contradicts Claude’s documented dual path. Keep both.
9. **Show hidden privileged commands as locked rows** — discoverability vs the security filter’s intent (discovery must not widen reach). Keep **hidden**.
10. **QuickType / Autofill bar as the command list** — not available to PWAs.
11. **`interactive-widget=resizes-content`** on the viewport meta (iOS 16.4+) instead of visualViewport JS — simpler if the installed PWA is recent enough; verify on the operator’s iPhone before betting the layout on it.
12. **Virtualize at 500** vs cap the overlay at 50 + “Open in + to browse all” — overlay of 500 44pt rows is a 22 000pt scroll; a **visible cap of 30** with “+N more, keep typing” is the mobile-honest Discord move.

---

## 4. Open questions + risks

1. **Does Claude iOS Code tab** (`claude://code/new`) use the same `/` menu as claude.ai chat, or only `+`? Help Center documents `/` for the chat interface generally, not the Code tab. Unverified on device.
2. **Is there a Kimi Code iPhone app** with this overlay, or is the bar CLI/web only? Public docs are CLI/VS Code/web.
3. **Should `argumentHint` be added** to `CommandDescriptorDto` (path-free, ≤40 chars) or parsed from descriptions? Host already has the field for builtins.
4. **Production catalog size** after relay filter? UI max-height math changes at 8 vs 80 vs 500.
5. **IME:** kimi-cli blur/rAF is necessary; also ignore `keydown` during `isComposing` or iOS will insert mid-pinyin.
6. **Autocorrect** turning `/plan` into `/Plan` or “plain” — disable while slash-open; re-enable after close.
7. **VoiceOver + keyboard accessory “Done”** may blur and, with naive `onBlur` close, destroy the list. Spec §2.4 is mandatory.
8. **Duplicate `/plan`:** list insert vs `+` Plan toggle vs host-enforced plan mode. Inserting `/plan ` must remain a **prompt** the relay revalidates, not a client-only toggle.
9. **Enter key on Bluetooth keyboards vs software Return** — same `key === "Enter"` path; both must insert.
10. **Mobbin pixel numbers** for Slack/Claude slash rows were **not** measured this pass (MCP unauthenticated; Slack flow page is paywalled). Do not treat §2.6 pt values as photographed Slack metrics; they are HIG 44pt + this repo’s Claude island metrics + helmor 8px gap.
11. **React Aria ComboBox** is the wrong primitive; using it “because it’s already imported” will reintroduce form-Enter submit and a second focus stop.

---

## 5. Sources

### Official product / docs
- https://support.claude.com/en/articles/8114491-get-started-with-claude  
- https://support.claude.com/en/articles/10263469-using-claude-app-intents-shortcuts-and-widgets-on-ios  
- https://support.claude.com/en/articles/14898120-open-the-claude-mobile-app-with-a-link  
- https://support.claude.com/en/articles/14553413-claude-code-cheatsheet  
- https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html  
- https://moonshotai.github.io/kimi-code/en/guides/interaction.html  
- https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html  
- https://learn.chatgpt.com/docs/reference/slash-commands  
- https://support.google.com/gemini/answer/13275745?hl=en&co=GENIE.Platform%3DiOS  
- https://api-docs.deepseek.com/guides/thinking_mode  
- https://docs.slack.dev/interactivity/implementing-slash-commands  
- https://slack.com/help/articles/360057554553-Use-shortcuts-to-take-actions-in-Slack  
- https://docs.discord.com/developers/interactions/application-commands  
- https://support.discord.com/hc/en-us/articles/31232432266647-Discord-Commands-Shortcuts-and-Navigation-Guide  
- https://discord.com/blog/slash-commands-are-here  
- https://pi.dev/docs/latest/extensions  
- https://getstream.io/chat/docs/sdk/ios/uikit/components/message-composer/  
- https://developer.apple.com/design/human-interface-guidelines/buttons  
- https://developer.apple.com/design/human-interface-guidelines/popovers  
- https://developer.apple.com/design/tips/  
- https://developer.apple.com/library/archive/documentation/StringsTextFonts/Conceptual/TextAndWebiPhoneOS/InputViews/InputViews.html  
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/  
- https://react-spectrum.adobe.com/react-aria/ComboBox.html  
- https://react-aria.adobe.com/blog/building-a-combobox  

### Mobbin (public URLs; MCP not authenticated this pass)
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS “Chatting with Claude (text input)”  
- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 — Claude iOS image-input chat  
- https://mobbin.com/explore/flows/172aff65-1b76-44ad-b5ca-85187b7cbf09 — Claude iOS Home  
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 — Claude iOS Chat Detail  
- https://mobbin.com/explore/flows/c367fe4e-3662-4f6f-870a-93f97e5110cc — Slack iOS “Sending a shortcut command”  

### GitHub / implementations
- https://github.com/MoonshotAI/kimi-cli/pull/893  
- https://github.com/MoonshotAI/kimi-cli/issues/881  
- https://raw.githubusercontent.com/MoonshotAI/kimi-cli/main/web/src/features/chat/useSlashCommands.ts  
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md  
- https://raw.githubusercontent.com/badlogic/pi-mono/main/packages/coding-agent/src/core/slash-commands.ts  
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/examples/extensions/commands.ts  
- https://github.com/badlogic/pi-mono/pull/1210  
- https://github.com/google-gemini/gemini-cli/blob/HEAD/docs/reference/commands.md  
- https://github.com/discord/discord-api-docs/issues/7338  
- https://github.com/discord/discord-api-docs/issues/4731  
- https://github.com/runway20/SlackTextViewController  
- https://github.com/dohooo/helmor/blob/main/src/features/composer/editor/plugins/slash-command-plugin.tsx  
- https://github.com/alexeygrigorev/pocketshell/issues/767  
- https://github.com/NousResearch/hermes-agent/blob/44ddc552/apps/desktop/src/app/chat/composer/index.tsx  
- https://www.assistant-ui.com/elements/composer-slash-commands  
- https://github.com/adobe/react-spectrum/issues/1646  
- https://github.com/w3c/aria-practices/issues/1619  
- https://github.com/Crscristi28/ios-pwa-keyboard-fix  
- https://github.com/cameronapak/polyfill-virtual-keyboard-api/blob/master/docs/ios-composer.md  
- https://github.com/Yeraze/meshmonitor/pull/3121  
- https://github.com/googlarz/claude-code-commands  

### Local (this repo)
- [`apps/pi-remote-web/src/SessionComposer.tsx`](apps/pi-remote-web/src/SessionComposer.tsx)  
- [`apps/pi-remote-web/src/CommandPalette.tsx`](apps/pi-remote-web/src/CommandPalette.tsx)  
- [`apps/pi-remote-web/src/style.css`](apps/pi-remote-web/src/style.css) (composer island)  
- [`apps/pi-remote-relay/src/commands/command-service.ts`](apps/pi-remote-relay/src/commands/command-service.ts)  
- [`apps/pi-remote-relay/src/store/redaction.ts`](apps/pi-remote-relay/src/store/redaction.ts)  
- [`packages/pi-rpc-protocol/src/types.ts`](packages/pi-rpc-protocol/src/types.ts) (`CommandDescriptorDto`)  
- [`docs/design-reference/mobile-chat-apps/01-visual-teardown.md`](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)  

### Secondary (labeled)
- https://community.openai.com/t/mentions-feature-for-custom-gpts-not-working-with-gpt-5-1-on-web-and-in-android-app/1367275 — ChatGPT `@` on mobile, conflicting reports  
- https://medium.com/ai-quick-tips/the-slash-command-secret-how-to-turn-perplexity-into-a-high-speed-automation-engine-cf3869c0268a — Perplexity Comet `/` shortcuts (web/Comet, not iOS app QA)  
- https://deepseekai.guide/guides/deepseek-on-iphone/ — DeepSeek iOS DeepThink/Search toggles (third-party guide; cross-check with API docs above)
