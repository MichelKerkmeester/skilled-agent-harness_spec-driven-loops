<!-- provenance: external-CLI orchestration pass; original file iter-08-grok.md -->
> **Source pass 8** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-8-grok.md`.

<!-- F3-slash-commands | model=grok | lens=visual-motion | iter 8/10 | 2026-08-15T19:07:13.616Z -->

# Typed `/` commands — visual + motion research (iPhone PWA)

**Lens:** visual-motion polish inside the locked ink-on-parchment system (light + dark), spacing/typography, and restrained motion that can match Claude iOS and Kimi Code without copying their chrome.

**Register (for this surface):** Product, not Brand. Density is efficient. Motion budget is 150–250 ms state transitions only, and this control is a high-frequency keystroke path, so the budget collapses further to **instant open/close/filter**. Color dosage is Restrained: clay is selection/state, never row text. Copy is functional.

**Current code fact:** typing `/` in `#session-prompt` does not open a list. The live catalog is only reachable from the `+` tools popover, which mounts a nested `ComboBox` with its own `<Input placeholder="/ command">` and inserts `/${name} ` without submitting (`SessionComposer.tsx`, `CommandPalette.tsx`). `.command-name` / `.command-desc` have **no CSS rules**; they inherit `.react-aria-ListBoxItem` (0.95rem, single padding block). `CommandDescriptorDto` has `name`, `description`, `source`, `enabled`, `disabledReason`, `requiresConfirmation` — **no `argumentHint` field**.

---

## 1. Findings for this lens

### 1.1 The target bar is an attached autocomplete, not an iOS popover or sheet

Apple’s compact-size-class rule is to **avoid popovers and use a sheet / full-screen modal** so content uses the whole compact canvas ([Apple HIG — Popovers](https://developer.apple.com/design/human-interface-guidelines/popovers)). A sheet would dismiss or cover the software keyboard and the composer, which is exactly wrong for a `/` trigger that must keep typing.

Shipped chat/coding UIs all treat `/` as **list autocomplete attached to the input**, which is the WAI-ARIA combobox pattern (DOM focus stays on the field; the popup is a `listbox`) ([WAI-ARIA APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/); [editable list-autocomplete example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/)):

| Product | Attachment | Visual notes | Source |
|---|---|---|---|
| Discord iOS | List above the message box after `/` | Name + description; after pick, **option chips** for arguments; frequently-used at top | [Discord slash intro](https://discord.com/blog/welcome-to-the-new-era-of-discord-apps); [Discord support](https://support.discord.com/hc/en-us/articles/31232432266647-Discord-Commands-Shortcuts-and-Navigation-Guide); [Mobbin Discord chat](https://mobbin.com/explore/screens/041a4291-f46b-48cd-8b08-dc87cceea3f7) |
| Slack iOS | Autocomplete table **above** the input bar | Historical default **max height 140 pt** | [SlackTextViewController autocomplete](https://github.com/slackhq/SlackTextViewController); [Mobbin Slack shortcut flow](https://mobbin.com/explore/flows/c367fe4e-3662-4f6f-870a-93f97e5110cc) |
| Kimi Code web (the Code-app bar) | Slash panel on the composer | Bold **matched fragments**; **scroll fade** + floating scrollbar on long lists; skills shown as `/skill: …`; **do not auto-send** on skill pick; keep highlighted row in view; wrap long names; **16px input floor on iOS** to prevent auto-zoom; closing the panel must not shift the composer | [kimi-code CHANGELOG / PR #2922](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md); [Kimi CLI slash docs](https://www.kimi.com/resources/kimi-code-cheat-sheet); [kimi-cli PR #893](https://github.com/MoonshotAI/kimi-cli/pull/893) |
| OpenCode app | `absolute inset-x-0 -top-2 -translate-y-full origin-bottom-left`, `max-h-80` (20rem), `p-2`, 10–12px radius, raised surface + shadow | `/{trigger}` + description + source badge (skill/mcp/custom); `onMouseDown preventDefault` so the input keeps focus | [`slash-popover.tsx`](https://github.com/sst/opencode/blob/69a80663/packages/app/src/components/prompt-input/slash-popover.tsx) |
| Claude iOS **chat** | No `/` picker in the consumer composer | Floating ~28–32 pt radius island, 17–18 pt input, terracotta send | Local teardown + [Mobbin Claude text-input flow](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57); [Claude Help — plus/options](https://support.claude.com/en/articles/8114491-get-started-with-claude) |
| Claude **Code** mobile / Remote Control | Desktop `/` dropdown is the intended bar; mobile has **repeated gaps** (no custom-command autocomplete; remote skills missing) | Treat “match Claude iOS” as **composer calm + insert-not-submit**, not as “copy Claude Code mobile’s current picker” | [claude-code#32051](https://github.com/anthropics/claude-code/issues/32051); [#62482](https://github.com/anthropics/claude-code/issues/62482); [insert vs execute](https://github.com/anthropics/claude-code/issues/23781); [Claude mobile docs](https://code.claude.com/docs/en/mobile) |

**Implication:** Pi Remote should look like Claude’s **composer island** (already in `.composer-tray`: 1.75rem radius, `--surface`, `--line-strong`, `--shadow-raised`) with a Kimi/OpenCode/Discord **attached list** above it — not a React Aria mobile tray, not an iOS sheet, not a second search field.

### 1.2 React Aria `ComboBox` is the wrong visual primitive on iPhone

Adobe’s own ComboBox write-up: on small screens ComboBox **switches to a tray that covers most of the screen, including the input**. iOS Safari does not shrink `window.innerHeight` for the keyboard; they had to switch to `window.visualViewport.height` + `useViewportSize` so the tray was not hidden under the OSK ([Building a ComboBox](https://react-aria.adobe.com/blog/building-a-combobox); [VisualViewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API)). ComboBox popovers also **dismiss on page scroll** because the input must stay interactive ([react-spectrum#6609](https://github.com/adobe/react-spectrum/issues/6609)).

The current `+` `ComboBox` therefore cannot be “moved” into the composer. The inline trigger needs:

- the **existing** `<textarea id="session-prompt">` as the combobox (17px / `1.0625rem` already matches iOS default body size and Kimi’s 16px anti-zoom floor — [Kimi changelog, `/new`/`/clear` note](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md));
- a sibling `ListBox` (or RAC `Autocomplete` **without** a nested `<SearchField>` / 13px input — OpenCode’s slash popover uses `text-[13px]`, which **will auto-zoom in iOS Safari**);
- `aria-autocomplete="list"`, `aria-expanded`, `aria-controls`, `aria-activedescendant` with **DOM focus remaining on the textarea** ([APG combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)).

### 1.3 iOS PWA keyboard geometry is the real layout constraint

`index.html` viewport is `width=device-width, initial-scale=1.0` only. `interactive-widget=resizes-content` is **Chrome/Firefox**; Safari still overlays the keyboard, resizes the **visual** viewport, and leaves `position: fixed` / `sticky` bottom chrome on the **layout** viewport ([HTMHell interactive-widget](https://www.htmhell.dev/adventcalendar/2024/4/); [WebKit standards-position #65](https://github.com/WebKit/standards-positions/issues/65); [Bramus explainer](https://github.com/bramus/viewport-resize-behavior/blob/main/explainer.md)).

`.composer-region` is `position: sticky; bottom: 0` with `padding-bottom: max(var(--space-3), env(safe-area-inset-bottom))`. Safe-area is the home indicator, **not** the keyboard. The list must be sized from `visualViewport.height` (same lesson as RAC’s tray), not from `50vh` (current `.react-aria-ListBox { max-height: 50vh }` would be taller than the remaining column once the keyboard is up).

Slack’s **140 pt** autocomplete cap is ~3×44 pt rows — tight but honest for an SE-class visual viewport with the keyboard open. OpenCode’s `max-h-80` (320px) will overflow that remaining column. Cap to **`min(17.5rem, 40% of visualViewport.height, remaining space above the tray − 8px)`**.

### 1.4 Ink-on-parchment tokens already decide the list’s materials

From `style.css` + `contrast.test.tsx` (WCAG 2.x arithmetic already in-repo):

| Role | Light | Dark | Use on this list |
|---|---|---|---|
| Canvas behind list | `--canvas` `#f8f8f6` | `#181715` | Transcript shows through the 8px gap only |
| List fill | `--surface-raised` `#ffffff` | `#2b2925` | Opaque. Do **not** reuse `.topbar` `backdrop-filter: blur(12px)` — blur over Source Serif 4 prose muddies the reading column and is a Reduce Motion / Increase Contrast failure mode ([Apple Reduced Motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/): animated blur is a trigger to drop) |
| Border | `--line` / `--line-strong` `#e7e6e1` / `#7b7974` | `#3b3934` / `#807a70` | 1px, same as `.composer-tray` |
| Shadow | `--shadow-raised` `0 4px 20px rgb(0 0 0 / 4%)` | `… / 24%` | Same elevation as the tray so the pair reads as one object |
| Name | `--ink` `#121212` | `#f4f1eb` | ≥4.5:1 on surface (tested) |
| Description | `--ink-muted` `#6c6a65` | `#b5afa5` | ≥4.5:1 on canvas/surface (tested). **Do not** use `.tools-label` at `0.68rem` (~10.9px) — Apple’s iOS **minimum is 11 pt** ([Apple design tips](https://developer.apple.com/design/tips/); [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)) |
| Selected row | `--accent-soft` `#f3e4de` + `--accent-ink` `#8a452f` | `#3a2720` + `#f0b19a` | Already the ListBox selected recipe |
| Clay `#d97757` as **text** on parchment | ~3.6:1 on a near-identical bone (`#d97757` on `#faf9f5`) | — | **Fails AA for 15–17 pt names** ([WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum); analogous pair in [color-accessibility-guide](https://github.com/organvm/a-i--skills/blob/main/skills/professional/brand-guidelines/references/color-accessibility-guide.md)). Clay stays on the **send circle** (icon, 3:1 non-text) and `accent-soft` tints, never on `/name` |

Source Serif 4 is reserved for `.block-role-assistant .block-copy` (1.1875rem). The list is Product chrome: **Inter**. The `/name` token is the only mono: `--font-mono` (already used on session ids and approval tool names). That is the “terminal-inline” signal without a CRT skin.

### 1.5 Motion: this control fails the frequency gate, so “polish” is mostly *no motion*

The local animation decision framework classifies **command-palette open/close as 100+/day, keyboard-driven: no animation, ever**. Keyboard-initiated actions stay instant; if a pointer path wants a 200–300 ms dropdown, the keystroke path stays instant ([`animation-decision-framework.md`](https://developer.apple.com/design/human-interface-guidelines/accessibility) analog: Apple Reduce Motion replaces axis slides with **fades**, and asks that meaning-bearing motion not be deleted — but a `/` list is not a hierarchical push).

Kimi’s own changelog had to **stop full-screen redraws when typing or toggling the slash panel** and **stop the composer from shifting after the menu closes** ([#1188](https://github.com/MoonshotAI/kimi-code/pull/1188), [#1413](https://github.com/MoonshotAI/kimi-code/pull/1413)). Those are motion/layout bugs, not missing delight.

Allowed motion on this surface:

| Event | Decision | Timing / material |
|---|---|---|
| Open on first `/` | Instant mount | No opacity, no scale, no `@starting-style`. Origin-aware scale from the slash (advanced-craft) is **rejected** here by the keyboard rule |
| Close (Esc, pick, blur, no longer first-token) | Instant unmount | Exit at 75% of enter is N/A because enter is 0 ms |
| Filter as you type | Instant list replace | No FLIP, no stagger (stagger is for related siblings on first reveal, and this list reflows on every key) ([motion-strategy staging](https://developer.apple.com/design/human-interface-guidelines/motion)) |
| Active option change (↑/↓ or pointer) | Instant background swap **or** `background-color` only at `--duration-fast` **120ms** `--ease-out` | Transform is forbidden (rows would swim while scrolling) |
| Row press | **Static** (color only) | Global `button:active { scale(0.98) }` must **not** apply; list rows are not buttons in the press-physics sense when they also scroll ([micro-interactions `static`](https://developer.apple.com/design/tips/)) |
| Highlighted row off-screen | Instant `scrollIntoView` (no smooth) | Kimi explicitly fixed “highlighted command not staying visible” ([#881](https://github.com/MoonshotAI/kimi-code/pull/881)); APG requires JS to scroll `aria-activedescendant` into view because browsers will not |
| Reduced motion | Already global `transition-duration: 0.01ms` in `style.css` | Still spec this surface as instant **even when Reduce Motion is off**, so hardware-keyboard users never wait |

The 100/300/500 rule’s 200–300 ms “dropdown” band is for occasional menus (the `+` tools popover), not for `/`.

### 1.6 Typography and row geometry that actually fit a thumb

Apple: **44×44 pt** hit targets ([design tips](https://developer.apple.com/design/tips/)); WCAG 2.2 **2.5.8** is 24×24 CSS px AA with spacing exception ([Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)). The PWA already forces `min-height: 44px` on `button` under `(pointer: coarse)` — `ListBoxItem` is **not** a `button`, so rows will ship undersized unless specified.

Two-line math at `--space-2` (8px) vertical padding:

- Name `0.95rem` (15.2px) × 1.3 ≈ 20px  
- Description `0.8125rem` (13px, above 11 pt) × 1.35 ≈ 18px  
- Padding 8+8 = 16px  
- **Total ≈ 54px** — clears 44 pt without a third line.

A third line for argument hints needs `min-height: 4rem` (64px) and blows Slack’s 140 pt cap down to two visible rows. With **no `argumentHint` on the DTO**, do not reserve a third line by default; put usage in the description and, after insert, in a one-line caption.

Match highlighting: Kimi’s restyle is **bold fragments**, not a color chip ([PR #2922](https://github.com/MoonshotAI/kimi-code/pull/2922)). Bold on Inter 550→650 keeps contrast; a clay underline on `#d97757` fails both 1.4.3 (if treated as text) and 1.4.1 (color-only meaning).

### 1.7 Collision with existing session chrome

- `.scroll-to-latest` is a 2.75rem circle, `bottom: var(--space-4)`, centered, `z-index: 2`, meant to sit **12–20 pt above the composer** (Claude teardown). The slash list occupies that exact band. **Hide the chevron while the list is open.**
- `.composer-disclaimer` sits *above* the tray today. If the list is also above the tray, disclaimer + list + tray stack past the visual viewport. **Move the disclaimer below the tray** (already the Claude/Gemini pattern in the local research) or hide it while the list is open.
- `z-index`: header `6`, composer `5`, topbar `20`. The list must paint over the transcript but under the session header: **`z-index: 6` inside `.composer-region`**.
- Enter: composer `onKeyDown` currently `Enter` (no Shift) **submits**. While the list is open, Enter must **insert** (`/name ` + trailing space) and never submit — the exact failure Claude Code users reported ([#23781](https://github.com/anthropics/claude-code/issues/23781); Kimi [#878](https://github.com/MoonshotAI/kimi-code/pull/878)).
- OpenCode’s `onMouseDown preventDefault` on the popover is required so iOS does not blur the textarea (which would close the list and bounce the visual viewport).

### 1.8 Prior-art row anatomy (coding agents)

OpenCode: `/{trigger}` (primary) + description (secondary) + source **badge** + optional keybind ([source](https://github.com/sst/opencode/blob/69a80663/packages/app/src/components/prompt-input/slash-popover.tsx)).  
Kimi TUI / kimiflare: selected prefix `› `, name column padded, dim description, source badge, **visible window of N rows** with “more below” ([kimiflare commit](https://github.com/sinameraji/kimiflare/commit/ac462fd8b62107b781966d7b353ebd44c5936b66)).  
pi-cmdr (same host family): `$` picker; **Enter sends, Tab inserts** ([mfmezger/pi-cmdr](https://github.com/mfmezger/pi-cmdr)) — invert that for this PWA (never auto-submit).  
pi-prompt-composer: aligned descriptions + usage hints in a TUI selector ([victor-software-house/pi-prompt-composer](https://github.com/victor-software-house/pi-prompt-composer/)).

Pi Remote `source` is `extension | prompt | skill`. Map to quiet Inter kickers (`Skill` / `Prompt` / `Extension`), not colored pills (Restrained dosage). Disabled rows stay visible (`enabled: false` + `disabledReason`) at `--ink-disabled` (already AA), not `opacity: 0.4` (opacity-only fails the quality floor).

---

## 2. Concrete spec a build phase can execute

### 2.1 Object and placement

- **Object:** a single card, sibling of `.composer-tray`, not a RAC `Popover` that may flip below the field.
- **Geometry:** `position: absolute; left: 0; right: 0; bottom: calc(100% + var(--space-2));` relative to `.composer-tray` (8px gap, same as OpenCode `-top-2`). Width = tray width, not `88vw`.
- **Shape:** `border: 1px solid var(--line); border-radius: var(--radius-lg);` (0.875rem / 14px — tighter than the 1.75rem island so it reads as a ledger attached to the island, not a second island). `background: var(--surface-raised); box-shadow: var(--shadow-raised);`
- **Max height:** `min(17.5rem, calc(var(--vv-height, 100dvh) * 0.4), calc(var(--vv-height, 100dvh) - var(--composer-block-height) - 8px))` with `--vv-height` written from `visualViewport.height` on `resize`/`scroll` (debounce via rAF; RAC `useViewportSize` is acceptable). Minimum height when open with ≥1 row: `2.75rem`. Empty state keeps that minimum so the tray does not jump ([Kimi #1413](https://github.com/MoonshotAI/kimi-code/pull/1413)).
- **Padding:** `var(--space-1)` (4px) around the list; items `padding: var(--space-2) var(--space-3)` (8×12).
- **Scroll:** `overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; -webkit-overflow-scrolling: touch`. Edge **static** fade: `mask-image: linear-gradient(to bottom, transparent, #000 12px, #000 calc(100% - 12px), transparent)` only when `scrollHeight > clientHeight` (Kimi scroll fade, no animation).
- **z-index:** 6. Hide `.scroll-to-latest` while open. Hide or move `.composer-disclaimer` while open.

### 2.2 Typography (Inter + mono only)

| Element | Font | Size | Weight | Color | Line-height | Constraints |
|---|---|---|---|---|---|---|
| `/name` | `--font-mono` | `0.95rem` (15.2px) | 550; **650** on matched graphemes | `--ink`; selected `--accent-ink` | 1.3 | Truncate with ellipsis at 1 line unless the name would otherwise overflow the row; wrap as last resort (Kimi #878) |
| Description | `--font-sans` | `0.8125rem` (13px) | 400 | `--ink-muted` | 1.35 | 1 line ellipsis; `text-overflow: ellipsis` |
| Source kicker | `--font-sans` | `0.75rem` (12px) | 650 | `--ink-muted` | 1 | Uppercase, `letter-spacing: 0.04em`, trailing; never color-coded |
| Disabled reason | `--font-sans` | `0.75rem` | 550 | `--ink-disabled` | 1.3 | Replaces description when `enabled === false` |
| Confirm marker | `--font-sans` | `0.75rem` | 650 | `--accent-ink` | 1 | Text `Confirm`, not a lock icon (no color-only, no icon-only) |
| Empty / loading | `--font-sans` | `0.8125rem` | 550 | `--ink-muted` | 1.4 | Centered in the min-height shell |
| Post-insert caption | `--font-sans` | `0.75rem` | 550 | `--ink-muted` | 1.4 | One line under the tray: description (argument guidance). Instant show; instant hide on next keystroke or blur |

Row layout: CSS grid `minmax(0,1fr) auto` — name+description stacked left, source kicker right. Selected row: `background: var(--accent-soft)` and a leading `›` in `--accent-ink` at `0.85rem` (TUI caret; kimiflare). Unselected: that glyph occupies the same 0.75rem column at `opacity: 0` so text does not shift (no layout animation).

**Clay `#d97757` is not used on this list.** Send-circle remains the only clay fill in the composer.

### 2.3 States (visual)

| State | Visual |
|---|---|
| Closed | Not in the tree (no `visibility: hidden` leftover height) |
| Open / catalog ready | Card + rows; first enabled match is active (`aria-activedescendant`) |
| Open / catalog loading | Three static `--surface-muted` bars, 12px height, 8px gap, **no shimmer** |
| Open / catalog error | One line: `Commands unavailable` + `--danger` (already AA on `--danger-soft` if used as a chip; as text on surface use `--danger` which is tested on `--danger-soft` — prefer a `--danger-soft` full-bleed footer inside the card) |
| Filtering | Instant subset; active option resets to first enabled match |
| Zero matches | Keep card; `No matching commands` |
| Active (keyboard) | `--accent-soft` fill + `›` + name `--accent-ink` 640 |
| Pointer hover `(hover: hover) and (pointer: fine)` only | `--surface-muted` if not active; no hover on coarse pointers |
| Pressed (coarse) | `--surface-muted` (or keep accent-soft if active); **no scale** |
| Disabled option | `--ink-disabled` name; not in the arrow-key loop; `aria-disabled="true"` |
| Inserted | List unmounts instantly; textarea value is `/name ` (trailing space); caret after the space; caption shows description if non-null |
| Reduced motion | Identical, because motion is already 0 |

### 2.4 Motion (executable)

```css
.slash-list {
  /* no transition on transform, opacity, height, max-height */
}
.slash-option {
  transition: none; /* or: background-color 120ms var(--ease-out) only */
}
.slash-option[data-pressed]:not([data-disabled]) {
  transform: none; /* override global button scale */
}
@media (prefers-reduced-motion: reduce) {
  .slash-option { transition: none; }
}
```

Do not introduce `motion/react` / `AnimatePresence` for this list (advanced-craft: do not mix animation systems; the app’s motion today is CSS tokens).

### 2.5 Gestures and keys (visual consequences)

- **Tap row:** insert, close, keyboard stays up (no blur).
- **Scroll list:** pan-y only; does not close; does not scroll the transcript (`overscroll-behavior: contain`).
- **Tap outside / on transcript:** close; **keep** the typed `/query`; do not submit.
- **Swipe-down-to-dismiss:** **off** (conflicts with list scroll).
- **↑/↓:** move active option; `scrollIntoView({ block: "nearest" })` with `behavior: "auto"`.
- **Enter / Tab (hardware):** insert, do not submit. Second Enter after close submits as today.
- **Escape:** close, keep text.
- **iOS tap-and-hold:** system text menu on the textarea only; list ignores long-press.

### 2.6 Accessibility

- Textarea: `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls="slash-listbox"`, `aria-activedescendant` when open ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/)).
- List: `role="listbox"`, `aria-label="Host commands"`. Options: `role="option"`, name announced as `/plan, Toggle plan mode`.
- Live region (polite) on open/filter: `{n} commands`. Existing `.tools-status` pattern.
- Focus ring: while open, the **row** is the visual focus (APG); the textarea keeps DOM focus. While closed, restore a visible `:focus-visible` on the textarea (today `.composer-input:focus { outline: none }` — the list must not make that worse; when closed, use the global `3px var(--focus)` ring).
- WCAG **2.4.11** Focus Not Obscured (AA): the active option must not sit under the session header or the keyboard ([WCAG 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)). Cap height from `visualViewport` and scroll the option into the list viewport.
- Touch: `min-height: 2.75rem` (44px) per option ([Apple 44 pt](https://developer.apple.com/design/tips/); [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)).
- Contrast: names `--ink` / `--accent-ink`; descriptions `--ink-muted`; never `#d97757` text; never opacity-only disabled.

### 2.7 Light / dark pair (pixel tokens)

Light: card `#ffffff`, border `#e7e6e1`, name `#121212`, desc `#6c6a65`, active fill `#f3e4de`, active name `#8a452f`, shadow 4%.  
Dark: card `#2b2925`, border `#3b3934`, name `#f4f1eb`, desc `#b5afa5`, active fill `#3a2720`, active name `#f0b19a`, shadow 24%.  
`color-scheme` already follows `[data-theme]`. Status bar `theme-color` is still `#f8f8f6` only — out of this component but dark sessions will flash bone in the status bar; not a list-token change.

### 2.8 What not to build (visual)

- Nested `/ command` search field (current ComboBox; OpenCode 13px field).
- RAC default mobile tray.
- iOS sheet / context-menu layout.
- Staggered row entrance, scale-from-slash, blur glass, Liquid Glass.
- Shimmer skeletons, bouncing highlight, `scroll-behavior: smooth` on option change.
- Source-colored pills, clay left-rail (clay on parchment fails 3:1 non-text against bone ~3.6:1, borderline-fail for UI components).

---

## 3. Divergent / minority ideas worth considering

1. **Grow the tray instead of a second card.** Expand `.composer-tray` upward with the list *inside* the 1.75rem island (one border, one shadow). Closer to a terminal. Risk: the island’s pill radius on a 220px-tall object looks like a lozenge, not a ledger; keyboard-rule still forbids height animation, so the jump is abrupt. Test at 390×844 before rejecting.

2. **Parchment ledger hairlines** between rows (`1px var(--line-hairline)`) instead of OpenCode’s 8px gap. On-brand (ruled paper). Risk: 5 hairlines + 44px rows looks like a settings table, not a command menu. If tried, hairlines only in light mode (dark `#4a4741` on `#2b2925` is noisy).

3. **Fixed 5-row window with “N more”** (kimiflare), not a scrolling 40% panel. More terminal, worse for 40+ host commands. A middle path: scroll + a `0.68rem` `--ink-muted` footer `12 more` when `scrollTop == 0 && overflow`.

4. **Discord-style argument chips after pick.** Protocol has no options schema; fabricating chips from `description` will lie. Only viable if `get_commands` grows an args array. Until then, trailing space + caption is the honest Discord subset.

5. **Ghost usage in the textarea** (`/model █provider`) via contenteditable overlay. Textareas cannot paint after-caret ghosts; contenteditable on iOS Safari is a known caret/IME minefield. Do not swap the composer to contenteditable for this feature.

6. **pi-cmdr inversion: Enter sends, Tab inserts.** Power-user fast. Directly contradicts the product rule “never auto-submits” and Claude Code #23781. Reject unless a Settings toggle exists (out of scope).

7. **`›` caret in Source Serif 4.** One serif glyph as a signature. Likely reads as an accident next to Inter/mono. Keep `›` in Inter.

8. **Match highlight with a 1px `--ink` underline** (not clay). Survives 1.4.1 (weight+underline) and contrast. Heavier than Kimi bold; try only if bold is too weak at 15px on a phone.

9. **Pointer-only 160ms `@starting-style` fade** (`opacity 0→1`, `translateY(4px)`, `--ease-out-interface`) when `/` is inserted by the `+` menu rather than typed. Keyboard path stays instant (framework split). Complexity may not be worth the one-tap case.

10. **Hide disabled commands** instead of dimming them. Cleaner, less honest (relay already strips privileged rows; remaining disabled rows are host-side). Prefer visible+dimmed for a remote-control tool.

11. **iOS input-accessory bar** (`UIInputView`) with the command list. Native, thumb-reachable above the keyboard. **Unavailable to a PWA.** Do not mock it with a second browser chrome.

12. **Haptics on select.** `navigator.vibrate` is not supported in iOS Safari. No-op; do not fake with motion.

---

## 4. Open questions + risks

1. **`argumentHint` does not exist on `CommandDescriptorDto`.** Any “arg hints” in v1 are `description` reuse or a protocol extension. Visual spec must not invent a third typographic line that will be empty for every row.

2. **Keyboard remainder vs. 44px rows.** On a short iPhone with the OSK up, 40% of `visualViewport` may be ~120–160px → **two or three rows**. That is still better than a 50vh popover under the keyboard. Measure on iPhone SE and 14 Pro before locking `17.5rem`.

3. **Sticky composer vs. visualViewport.** If sticky positioning does not track the OSK, the list will be correct relative to the tray but both may sit **under** the keyboard. Mitigation: pin `.composer-region` with `visualViewport.offsetTop` / height (same RAC lesson). This is the highest visual-risk item.

4. **Enter-to-send conflict** is a behavior bug with a visual symptom (list flashes and the command fires). Must ship in the same cut as the list.

5. **VoiceOver + `aria-activedescendant` on a `<textarea>`** is less tested than on `<input>`. Verify with iOS VoiceOver; fallback is moving DOM focus into the listbox (worse for typing).

6. **Match-fragment bold** needs a grapheme-safe highlighter; naive `split` will break CJK skill names that Kimi also searches by pinyin (Pi may not need pinyin; still need Unicode-safe slices).

7. **Catalog size.** Unbounded `ListBox` without virtualization will jank on 100+ commands during filter (the exact “100+/day, do not animate” case). If `commands.length > 40`, virtualize; do not FLIP.

8. **HIG compact-popover exception** is defensible as APG combobox, but App Review / accessibility audits that expect sheets should be documented as intentional.

9. **Mobbin MCP was not available this pass**; Claude/Discord/Slack screen URLs are public catalog links, not measured screenshots. Pixel numbers for Claude’s island come from the in-repo teardown (`docs/design-reference/mobile-chat-apps/research-gpt-luna.md`), ±2–4 pt.

10. **Dark-mode clay-on-dark:** `#d97757` on `#181715` is unused on the list; if someone “accents” matched text with clay in dark mode, re-check 4.5:1 (dark canvas helps clay more than light parchment, which is how people will be tempted).

---

## 5. Sources

### App / stack (this repo)

- `apps/pi-remote-web/src/style.css` — tokens, composer island, ListBox, reduced-motion nuke, 44px coarse targets  
- `apps/pi-remote-web/src/SessionComposer.tsx` — `+` ComboBox, Enter-to-submit  
- `apps/pi-remote-web/src/CommandPalette.tsx` — insert `/${name} `, never submit  
- `packages/pi-rpc-protocol/src/types.ts` — `CommandDescriptorDto` (no argument hint)  
- `apps/pi-remote-web/tests/contrast.test.tsx` — WCAG pairs for ink / muted / accent-ink  
- `apps/pi-remote-web/index.html` — viewport, `theme-color: #f8f8f6`  
- `docs/design-reference/mobile-chat-apps/research-gpt-luna.md` — Claude/Kimi composer measurements  

### Apple / WCAG / iOS web

- https://developer.apple.com/design/tips/  
- https://developer.apple.com/design/human-interface-guidelines/popovers  
- https://developer.apple.com/design/human-interface-guidelines/menus  
- https://developer.apple.com/design/human-interface-guidelines/accessibility  
- https://developer.apple.com/design/human-interface-guidelines/layout  
- https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/  
- https://developer.apple.com/videos/play/wwdc2019/244/  
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum  
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum  
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/  
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/  
- https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API  
- https://www.htmhell.dev/adventcalendar/2024/4/  
- https://github.com/bramus/viewport-resize-behavior/blob/main/explainer.md  
- https://github.com/WebKit/standards-positions/issues/65  

### React Aria

- https://react-aria.adobe.com/ComboBox  
- https://react-aria.adobe.com/Autocomplete  
- https://react-aria.adobe.com/blog/building-a-combobox  
- https://github.com/adobe/react-spectrum/issues/6609  

### Claude / Kimi (target bar)

- https://code.claude.com/docs/en/mobile  
- https://support.claude.com/en/articles/8114491-get-started-with-claude  
- https://github.com/anthropics/claude-code/issues/32051  
- https://github.com/anthropics/claude-code/issues/62482  
- https://github.com/anthropics/claude-code/issues/23781  
- https://www.kimi.com/resources/kimi-code-cheat-sheet  
- https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md  
- https://github.com/MoonshotAI/kimi-cli/pull/893  
- https://github.com/sinameraji/kimiflare/commit/ac462fd8b62107b781966d7b353ebd44c5936b66  

### Other chat / agent UIs

- https://discord.com/blog/welcome-to-the-new-era-of-discord-apps  
- https://support.discord.com/hc/en-us/articles/31232432266647-Discord-Commands-Shortcuts-and-Navigation-Guide  
- https://docs.discord.com/developers/interactions/application-commands  
- https://github.com/slackhq/SlackTextViewController  
- https://github.com/sst/opencode/blob/69a80663/packages/app/src/components/prompt-input/slash-popover.tsx  
- https://github.com/mfmezger/pi-cmdr  
- https://github.com/victor-software-house/pi-prompt-composer/  

### Mobbin (public catalog; MCP not callable this pass)

- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS chatting (text input)  
- https://mobbin.com/explore/screens/160dd19d-0632-49a6-8cff-a00cf361e426 — Claude iOS empty state  
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 — Claude iOS chat detail  
- https://mobbin.com/explore/flows/c367fe4e-3662-4f6f-870a-93f97e5110cc — Slack iOS slash/shortcut command  
- https://mobbin.com/explore/screens/041a4291-f46b-48cd-8b08-dc87cceea3f7 — Discord iOS chat interface  

### Contrast analog for clay-on-bone

- https://github.com/organvm/a-i--skills/blob/main/skills/professional/brand-guidelines/references/color-accessibility-guide.md — `#d97757` on `#faf9f5` ≈ 3.6:1 (AA fail for normal text)
