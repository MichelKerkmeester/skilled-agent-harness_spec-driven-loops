# 003-slash-commands — reference screens

> Real Mobbin/Refero captures gathered via code mode (Mobbin `search_screens` + Refero `refero_search_screens`, platform ios). URLs are authoritative; do not invent.

## Screens

| App | Source (real URL) | Pattern / why relevant |
|-----|-------------------|------------------------|
| Slack | https://mobbin.com/screens/70e17d52-9ff9-45b8-96ab-64419115d2e5 | **Command Options Modal** — the canonical slash-command picker: modal overlay listing `/shrug`, `/status`, `/topic`, `/who`, each a tappable row that fills the command into the composer. Returned by every slash/command query; the strongest direct precedent. |
| Linear Mobile | https://mobbin.com/screens/69322221-028e-49bf-a1ab-ab7acd8ae0c7 | Slash-command-style command list with a selection flow ("Selecting & Choosing" tagged) — command names with short labels presented as a list, hinting at keyboard+row selection. |
| Obsidian | https://mobbin.com/screens/44992a64-b821-48c5-ade2-c3e80525b978 | Command palette ("Searching & Finding" tagged) — the "command palette mobile" query hit, showing a full-command catalog as a filterable list. |
| Raycast | https://mobbin.com/screens/57642699-6b8c-43d0-bcbd-905996b59719 | Command palette ("Searching & Finding") — the "command palette mobile" hit; shows command search with results-list affordance in an iOS shell. |
| Meta AI | https://mobbin.com/screens/be18e719-3531-4efd-92e3-56954375ec05 | Appeared in the "slash command menu" query ("Selecting & Choosing" tagged) — an AI chat surface where a commands/options picker opens from the composer. |
| ChatGPT | https://mobbin.com/screens/0ff80601-99fd-44be-bd8c-fcabc870f572 | "slash command menu" hit ("Adding & Creating" tagged) — AI-composer context where an insert/command action is chosen from the input area. |
| Discord | https://mobbin.com/screens/dc3f24ee-af00-4313-bc3c-f3ff597e99d2 | "slash command menu" + "inline command autocomplete" hit ("Editing & Updating") — the messaging app whose native `/` autocomplete shows a filtered command list above the keyboard. |
| Vibecode | https://mobbin.com/screens/c281dcf3-caff-4f63-8df2-33d2adf3da75 | "slash command menu" hit ("Adding & Creating" + "Selecting & Choosing") — AI code-chat app with an insert/command selection surface near the composer. |
| Raycast | https://refero.design/screens/000c2456-4bbe-481f-a0dc-4b28c61dddb8 | Full-screen command palette: frosted-glass rounded search field + results list, keyboard up. Direct precedent for "type to filter, pick from list." |
| Raycast | https://refero.design/screens/9e320e42-8888-41c9-9b48-39a69d11038d | Expanded bottom-sheet command palette: search input at top, results list below, keyboard occupying bottom third — exact anatomy for an inline-over-composer command list. |
| Telegram (Dreams AI bot) | https://refero.design/screens/5a83693e-e433-4a23-8eef-9d150552abe0 | Bot command menu: each command is a row with a descriptive label on the left and the `/command` shortcut on the right — shows the "label + shortcut" two-column row pattern. |
| Craft | https://refero.design/screens/9b3cab3b-e586-4c78-8727-2ec9eb786099 | AI suggestion list floating above the keyboard (Generate keywords, hashtags, title…) — the closest thing to "inline list above the composer that inserts on tap." |
| Craft | https://refero.design/screens/0f092e02-9da6-415b-a3be-5bcda920ec1b | Floating contextual menu above the keyboard (Assistant, List, Indentation, Text Style) — precedent for an action list that rides above the input without stealing the screen. |
| Comet | https://refero.design/screens/c55b18a8-5fcb-4d64-ba20-712c97b8f595 | Assistant bottom-sheet overlay: elevated rounded card with blurred backdrop, title + documentation content + persistent input — anatomy for a commands sheet over a dimmed chat. |

## Reference-backed UI/UX direction

Concrete, adoptable specifics for Pi Remote's ink-on-parchment slash-command list (read-only posture: the picker never sends anything — it only fills the composer).

1. **Trigger and placement: "/" first char opens the list above the composer, never a modal.** Slack (mobbin) and Telegram-bot (refero) prove the "fill on selection" model; Raycast's expanded bottom sheet (refero 9e320e42) and Craft's above-keyboard suggestion card (refero 9b3cab3b) prove the list belongs *between* the keyboard and the input, not as a separate screen. On parchment, render it as a bounded sheet rising from the composer's top edge, keeping the typed `/…` visible and editable the whole time.

2. **Row anatomy: bold ink command name + one muted description line + arg hint; selected row gets an ink check/ring, not a fill.** Raycast (refero) shows a compact vertical list of `command + hint` rows; Telegram (refero 5a83693e) shows the two-column "label / /shortcut" form. Translate to parchment: command in bold ink, a faded-sepia one-liner beneath, the `/name` shortcut echo right-aligned in small caps. Selection highlight is typographic (ring/checkmark in ink), consistent with the system's non-chromatic hierarchy.

3. **Fuzzy filter as you type, inline, with keyboard + touch selection.** Obsidian/Raycast (mobbin) and both Raycast refero captures show the palette filtering in place as you type. Keyboard up/down moves a single ink caret-row; Return or tap inserts `/name ` into the draft and dismisses the list. Never auto-submits — the list only composes; the user sends with the send button (read-only posture preserved).

4. **Bound the list; keep context visible.** Comet (refero c55b18a8) dims the chat beneath with a blurred/translucent scrim; Slack keeps the composer and message history peekable. On parchment, dim the thread through a parchment-bleed scrim (not flat black) and cap the list at ~60–70% of the screen so recent messages stay readable above the sheet.

5. **Argument hints as muted tokens, and description always present.** Slack's rows (mobbin) pair each `/command` with a short description; the F3 brief wants arg hints. Render optional args as bracketed ink-grey tokens after the name (e.g. `/status <text>`) — the one-line-per-row density of Telegram/Raycast keeps the list scannable even with the catalog's many commands.

6. **States: typing/empty/no-match/disabled.** Craft's suggestion card (refero 9b3cab3b) shows a generated set that disappears cleanly on selection; Raycast's palette shows results in place. Add: a muted "no command matches" ink line (never an error modal), strike-through parchment for commands the host's relay-filtered catalog marks stale, and a thin ink progress row while the real `get_commands` catalog is still loading — all calm, microcopy-driven, no busy chrome.

7. **Keyboard + a11y parity.** Keep full keyboard operation (arrows + Return), VoiceOver reads "command name, description, argument hint" per row, and minimum 44pt touch targets per Slack/Discord row precedent. The sheet must be reachable by touch too (tap a row), and dismissing (swipe down / outside tap / Esc) must never alter the draft text.

8. **Stick to the real catalog; no invented commands.** The list is the live relay-filtered `get_commands` catalog with real descriptions — matching how Slack/Discord show only the *available* slash commands. Pi Remote renders what the host reports; an unavailable command shows disabled, never removed from documentation view.

## Coverage gaps

- No reference found showing the *exact* trigger transition — a screenshot of a live `/` character opening the list (all captures show the list already open). The trigger behavior is therefore derived from Slack/Discord behavior and the composer-adjacent patterns above, not from a literal screen.
- No real Mobbin/Refero screens from Claude, Perplexity, Copilot, Manus, Grok, or Pi showing an inline slash-command list; the AI-app hits (ChatGPT, Meta AI, Vibecode, Comet) show adjacent selection/composer patterns but not a literal `/` autocomplete.
- No capture showing fuzzy-match *highlighting* of matched characters within command names (Raycast/Obsidian palette descriptions don't confirm per-character emphasis), so match highlighting remains unspecified pending a real screen.
- No dark-parchment variant exists in the reference set; light-surface screens (Raycast, Craft) are the closest, so dark-surface behavior is inferred.
- No screen showing the keyboard interaction (arrow navigation) of the command list; only touch selection is visually evidenced.
