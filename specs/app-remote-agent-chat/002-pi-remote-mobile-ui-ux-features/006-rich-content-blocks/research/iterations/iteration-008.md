<!-- provenance: external-CLI orchestration pass; original file iter-08-grok.md -->
> **Source pass 8** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-8-grok.md`.

<!-- F7-rich-content-blocks | model=grok | lens=visual-motion | iter 8/10 | 2026-08-16T04:23:17.567Z -->

# Visual-motion research — Claude-style content blocks (iteration 8 / 10)

Lens: how bash Command/Output cards, fenced-code cards, and long-text artifact cards should look and move inside Pi Remote’s **ink-on-parchment** system on an installable iPhone PWA (React 19, Vite, Tailwind 4, react-aria-components). Security is out of scope except where it constrains visuals (already-redacted text only; no host-filesystem chrome).

**Register (locked):** this is a **Product** surface. Density is efficient. Motion is 150–250 ms state transitions, no page-load choreography. Color is **Restrained** (clay ≤10%, never decoration). Copy is plain and functional. ([sk-design Brand-vs-Product register](file://.claude/skills/sk-design/shared/register.md); applied tokens in `apps/pi-remote-web/src/style.css`.)

**Category default to reject:** inverted VS Code wells + `scale(0.8→1)` zoom modals. That pairing is the median coding-chat look, and it fights both parchment and Apple’s vestibular guidance.

---

## 1. Findings

### 1.1 The live surface already has three materials — and they are mis-assigned

Pi Remote already ships a Claude-like **document** layer and a **terminal** layer, then paints almost all tool output with the terminal layer.

| Material | Tokens (light) | Tokens (dark) | Used today |
|---|---|---|---|
| Parchment canvas | `--canvas: #f8f8f6`, `--ink: #121212` | `--canvas: #181715`, `--ink: #f4f1eb` | Assistant Source Serif prose (`1.1875rem` / `line-height: 1.62`) |
| Paper card | `--surface` / `--line` / `--radius-md` (12px) / `--radius-lg` (16px) | `--surface: #24221f` | `file_diff`, Activity disclosure, plan |
| Carbon well | `--surface-code: #0f0f0e` **in both themes**; body `oklch(0.9 0.012 255)` | same `#0f0f0e` | every `transcript-block pre` (tool call, tool result, code) |

Sources: `apps/pi-remote-web/src/style.css` `:root` / `[data-theme='dark']` (lines 31–132), assistant prose (1822–1829), `pre` well (1933–1945), `file_diff` add/remove (1968–1975). Contrast inventory in `apps/pi-remote-web/tests/contrast.test.tsx` proves parchment pairs to WCAG AA and **does not test any syntax-token / carbon-well pair**.

**Dark-mode collapse.** Canvas `#181715` (RGB 24,23,21) vs well `#0f0f0e` (15,15,14) is a ~9/255 luminance step. On an iPhone OLED, that well does not read as a distinct object; it looks like the canvas got a hole. WCAG 1.4.11 requires **3:1** for UI component boundaries against adjacent color ([Understanding SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)). A 9-count RGB delta on near-black will fail that for the well’s hairline unless the well is **lifted** (`--surface-raised: #2b2925`) or given a `--line-hairline` that itself meets 3:1.

**Light-mode clash.** `#0f0f0e` punched into `#f8f8f6` is a VS Code import. Local Claude teardown of `screens/claude-conversation-actions.png` records artifact cards as **near-canvas fill, hairline, ~16px radius, Inter title + muted subtitle** — not inverted terminals (`docs/design-reference/mobile-chat-apps/01-visual-teardown.md` §1.2). Anthropic’s own artifact chrome is a **dedicated window beside chat**, with Copy / view-code / download in the **lower-right of that window**, for content that is “significant and self-contained, typically over 15 lines” ([Claude Help: What are artifacts](https://support.anthropic.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)).

**Hue clash.** Body text `oklch(0.9 0.012 255)` is cool blue-gray. Ink, clay `#d97757`, and parchment are warm. A 12px cool well inside a warm document is the single loudest “this was copied from a dark IDE” tell. Anti-slop rule: name the category default (VS Code One Dark) and deviate (`sk-design` anti-slop principle 7).

**Preview height is wrong for iPhone.** `transcript-block pre { max-height: 26rem }` (~416px at 16px root) on a 390×844 logical iPhone eats ~49% of the viewport before the composer. Claude iOS and Kimi’s TUI both **cap the inline preview** and push the rest to a viewer. Kimi Code explicitly redesigned Bash/subagent cards to a **fixed height** (`header + one-line summary + two-row window`) because variable bash output made the card jump ([MoonshotAI/kimi-code#1345](https://github.com/MoonshotAI/kimi-code/pull/1345); commit [5ea3ec4](https://github.com/xy200303/spec-kimi-code/commit/5ea3ec489e0a7d66b844c39ee65162fd6a8ed8b1) “distinguish command from output” / keep command preview after the result lands).

### 1.2 Motion tokens already exist — RAC’s default modal fights them

Shipped motion system (`style.css` 88–90, 28, 2287–2294):

- `--duration-fast: 120ms`
- `--duration-state: 220ms`
- `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` (same as `--ease-out-interface`)
- Global `@media (prefers-reduced-motion: reduce)` sets `animation-duration` / `transition-duration` to `0.01ms` and kills `scroll-behavior`
- Press: `button:active { transform: scale(0.98) }` (203–206)
- Evidence chevron: `transform` 220ms `--ease-out` (1893–1901)
- Streaming dots: `working-wave` 1.1s, killed under reduced motion (2019–2044)

Product motion budget from the design register: **150–250 ms state transitions**; layout/modal band in the motion strategy is **300–500 ms**; exits ~75% of enter; **ease-out on enter, ease-in on exit**; **no bounce/elastic**; compositor materials only (`transform`/`opacity`) ([motion-strategy.md](file://.claude/skills/sk-design/sk-design-interface/references/motion/motion-strategy.md); [animation-decision-framework.md](file://.claude/skills/sk-design/sk-design-interface/references/motion/animation-decision-framework.md)).

React Aria’s **documented** Modal CSS does the opposite of that budget:

```css
.react-aria-ModalOverlay[data-entering] { animation: modal-fade 200ms; }
.react-aria-ModalOverlay[data-exiting]  { animation: modal-fade 150ms reverse ease-in; }
.react-aria-Modal[data-entering] {
  animation: modal-zoom 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275); /* overshoot */
}
@keyframes modal-zoom { from { transform: scale(0.8); } to { transform: scale(1); } }
```

([React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html); overlay uses `--page-width` / `--page-height` / `--visual-viewport-height`.)

**Do not ship `modal-zoom`.** Scaling/zooming is a named vestibular trigger ([WebKit: Responsive Design for Motion](https://webkit.org/blog/7551/responsive-design-for-motion/); MDN `prefers-reduced-motion` explicitly warns that its own scale demo is a trigger ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)); Apple App Store Connect Reduced Motion criteria: “problematic types of motion are spinning or **scaling**, and other techniques used to simulate three-dimensional effects or depth”; if motion conveys hierarchy, **replace with dissolve / highlight fade / color shift**, don’t delete all motion ([Apple ASC Reduced Motion](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/))). RAC’s `cubic-bezier(0.175, 0.885, 0.32, 1.275)` is an overshoot spring — forbidden by the Product motion dial.

**Frequency gate.** Copy on every code/bash/artifact card is **tens-to-hundreds of taps per session**. Decision: **no positional motion** on Copy. Allowed: label/icon swap (`Copy` → `Copied`) and the existing 0.98 press scale (local, <150 ms, feedback purpose). Chevron rotate on Activity stays (orientation, occasional). Full-screen open is **occasional** → standard state transition. Syntax-token paint must never animate.

WCAG 2.3.3 (AAA, still the right *technique* even though the product bar is AA): interaction-triggered motion must be disableable unless essential; `prefers-reduced-motion` is the sanctioned mechanism ([Understanding SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)). Opacity/color/border are **not** “motion animation”; transforms are. Reduced-motion path = overlay **dissolve** + instant sheet presence.

### 1.3 iPhone PWA: the viewer is a sheet, not a centered dialog, and not `requestFullscreen`

**HIG hit targets.** Controls ≥ **44×44 pt** ([Apple Design Tips](https://developer.apple.com/design/tips/); WWDC24 games guidance restates 17 pt body / 44 pt targets). WCAG 2.5.8 AA is only **24×24 CSS px** ([Understanding SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)). On this PWA, Apple 44 pt wins. Existing `@media (pointer: coarse) { button { min-height: 44px } }` already encodes that — but `.turn-action` is `min-height: 2rem` (32px) (`style.css` 1843–1856). Card Copy/Expand must not copy that 32px row; they must be 44×44 on coarse pointers.

**Typography floor.** Apple: body **17 pt+**, never below **11 pt** ([Apple Design Tips](https://developer.apple.com/design/tips/); WWDC24). Card chrome today uses `0.68rem` (~10.9px at 16px root) for headers — under the 11 pt floor. Code `0.76rem` (~12.2px) clears the floor but is small for a 390-wide phone; fullscreen body should step to **13–15 px**.

**Safe area + visual viewport.** Session header already uses `padding-top: max(var(--space-2), env(safe-area-inset-top))`. RAC Modal sizes against `--visual-viewport-height` (tracks `window.visualViewport`, needed because `vh`/`dvh` and the iOS keyboard disagree across Safari vs standalone PWA — see [WebKit Safari 18 View Transitions](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/) for VT; visual-viewport is a separate RAC hook). The app shell already uses `100dvh` (`style.css` 184–188). A full-screen viewer **must**:

1. Portal to `document.body` (RAC default) so `.transcript-block { overflow: hidden }` and the virtualizer’s `position: absolute` rows cannot clip it (`style.css` 1718–1745; `App.tsx` `useVirtualizer` + `measureElement`).
2. Height `100dvh` **and** `max-height: var(--visual-viewport-height, 100dvh)`.
3. Pad `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`.
4. `overscroll-behavior: contain` on the viewer scroller (already on `.transcript-scroll`).
5. **Not** call `Element.requestFullscreen()` / `webkitRequestFullscreen()`. Open WebUI’s artifact “full screen” does exactly that on an iframe ([open-webui Artifacts.svelte](https://github.com/open-webui/open-webui/blob/53764fe6/src/lib/components/chat/Artifacts.svelte)). iOS Safari/PWA fullscreen for arbitrary elements is unreliable; a RAC `ModalOverlay` + `Dialog` is the accessible, focus-trapped, dismissible equivalent already in this stack.

**Sheets vs covers.** Apple HIG sheets: size to content; people don’t generally resize; a sheet that covers most of the window is the wrong default on iPad/visionOS, but on iPhone a **full-screen sheet** (watchOS analogue: full-screen slide-over) is the native pattern for “read this long thing” ([HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)). A centered 90vw RAC dialog with `modal-zoom` reads as a website signup modal, not an iPhone reader.

**View Transitions (Safari 18+ / iOS 18+)** can morph a named `view-transition-name` from the inline card to the sheet ([WebKit Safari 18.0](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/); [Can I use: View Transitions](https://caniuse.com/view-transitions)). That is a **minority v2**, not v1: (a) TanStack Virtual recycles rows, so named elements disappear; (b) snapshotting a long `<pre>` is expensive; (c) default VT is a cross-fade, custom morph is a scale — vestibular; (d) must be gated on `prefers-reduced-motion: no-preference`.

**F6 viewer shell is not in this repo.** `App.tsx` / `SessionComposer.tsx` / `SessionHeader.tsx` use `Dialog` **inside `Popover`**, never `ModalOverlay`. Operator brief says “reuse F6.” Treat F6 as **one shared `ArtifactViewer`**: `DialogTrigger` + `ModalOverlay` + `Modal` + `Dialog`, reused by bash, code, and text artifacts. Do not invent a second overlay.

### 1.4 What Claude / Kimi / coding-agent UIs actually do (visual, not mythology)

**Claude iOS (local teardown + Anthropic docs + Mobbin flows).** Assistant = serif, no bubble. Artifact = paper card in the flow, ~16px radius, hairline, near-canvas, title + muted subtype, optional thumbnail. Per-turn actions are a **quiet monochrome row under the answer**, not inside the card (`01-visual-teardown.md`). Artifacts that are “real work” open a **dedicated window** with Copy in the **lower-right** ([Claude Help](https://support.anthropic.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)). Claude Code’s own iOS client still **lacks** a copy control under answers ([anthropics/claude-code#61891](https://github.com/anthropics/claude-code/issues/61891)) — the **consumer Claude app** is the bar, not Claude Code iOS. Mobbin flows (MCP unauthenticated this session; cite URLs, do not invent pixels): [Claude iOS coding-input flow](https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b), [Claude iOS text-input flow](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57), [Claude Web code preview](https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3) (web split preview — **do not** copy a side-by-side editor onto 390px).

**Kimi Code (TUI, but the visual rules transfer).** Bash card streams stdout into a **running tool card**; command and output are **two tones** (`textDim` + `$` vs `textMuted` result); card height is **stabilized** so a short result does not collapse a multi-line command ([MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code); tools doc: TUI streams into the Bash card ([docs](https://moonshotai.github.io/kimi-code/en/reference/tools.html)); [PR 1345](https://github.com/MoonshotAI/kimi-code/pull/1345); [5ea3ec4](https://github.com/xy200303/spec-kimi-code/commit/5ea3ec489e0a7d66b844c39ee65162fd6a8ed8b1)). Full output opens an **in-TUI viewer** (`TaskOutputViewer`) instead of shelling out to `less` — same colors, no alt-screen flip ([task-output-viewer.ts](https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-code/src/tui/components/dialogs/task-output-viewer.ts)). Translate to PWA: **one card, two stacked regions, stable preview height, one shared viewer**.

**Cline.** Unified `CodeBlock` for shell output **and** markdown fences; Copy top-right; sticky while scrolling; **always word-wrap** (horizontal scroll on iPhone is a defect) ([cline#1583](https://github.com/cline/cline/pull/1583)). Sticky Copy on a 390px well fights the 44pt target and the fade-mask; on iPhone put Copy in the **card chrome**, not floating inside the `<pre>`.

**Open WebUI.** Artifact pane: Copy + Download + “Open in full screen” clustered **lower-right**; Copy label flips for 2s ([Artifacts.svelte](https://github.com/open-webui/open-webui/blob/53764fe6/src/lib/components/chat/Artifacts.svelte); [docs](https://github.com/open-webui/docs/blob/main/docs/features/chat-conversations/chat-features/code-execution/artifacts.md)). Download is a filesystem write — **out of scope**. Fullscreen-via-iframe — **out of scope**. Keep the **lower-right Copy + expand** clustering.

**OpenCode (`sst`/`anomalyco`).** Per-block Copy on `[data-component="markdown-code"]`; Copied state ~2s; later PRs add clipboard fallback because `navigator.clipboard` needs a **secure context** ([message-part.tsx](https://github.com/sst/opencode/blob/5d2dc888/packages/ui/src/components/message-part.tsx); [#17553](https://github.com/anomalyco/opencode/issues/17553)). Pi Remote is Tailscale HTTPS, so Clipboard API is available; still fail closed to the existing `AssistantActions` pattern (`canCopy` gate, `.catch(() => undefined)` in `App.tsx` 1387–1410).

**ChatGPT / Gemini iOS (Mobbin, corroborating).** ChatGPT chat chrome: [Mobbin ChatGPT iOS](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1). Gemini structured cards: 18–22 pt radius, 16–20 pt padding, actions **inside** the card only when they operate on that artifact (`research-gpt-luna.md` §6). Same rule here: Copy/Expand live **on the card**; turn-level Copy stays **under serif prose**.

### 1.5 Syntax highlighting is a motion-and-paint problem, not a theme-pack problem

Highlighting every tool result in a virtualized list while `pi` streams will (1) flash tokens as the string grows (Kimi’s “white flash against dim thinking” is the same bug, [PR 1345](https://github.com/MoonshotAI/kimi-code/pull/1345)), (2) force layout in `measureElement`, (3) ship a highlighter WASM/grammar table into an offline PWA. `package.json` has **no** highlighter and **no** motion library (`apps/pi-remote-web/package.json`).

**v1 paint rule:** inline preview = plain `var(--font-mono)` with language label; **tokenize only in the viewer** (or on `idle` after the block’s revision is stable). That is also the reduced-motion path: no token-color flicker.

If a highlighter is added later, tokens must be a **5-role parchment set**, not One Dark:

| Role | Light (on `--canvas-subtle #efeeeb`) | Dark (on `--surface-raised #2b2925`) | WCAG |
|---|---|---|---|
| Default | `--ink` `#121212` | `--ink` `#f4f1eb` | already tested |
| Comment | `--ink-muted` `#6c6a65` | `--ink-muted` `#b5afa5` | already tested vs canvas/surface |
| Keyword | `--ink` | `--ink` | — |
| String / success | `--success` `#37624a` | `--success` `#8fc4a4` | tested on soft, **must retest on well** |
| Accent (prompt `$`, language pill) | `--accent-ink` `#8a452f` | `--accent-ink` `#f0b19a` | tested on canvas, **must retest on well** |

Do not color keywords clay. Clay is the **signature mark** (send, streaming glyph, `$` prompt), 10% dosage.

### 1.6 `.transcript-block { overflow: hidden }` will clip the fade-mask and any sticky control

`style.css` 1740–1745 sets `overflow: hidden` + radius on every block. Fade-to-canvas masks and 44pt chrome sitting on the well’s top edge will clip. New card types need `overflow: visible` on the article; clipping lives on the **well** (`.code-well`, `max-height` + `mask-image`).

Virtualizer: expanding an inline disclosure **must** call `measureElement` (already wired). Opening the viewer **must not** change the row’s height (Kimi stable-height lesson). Otherwise the list jumps and the live-edge follower in `App.tsx` (1160–1205) fights the user.

---

## 2. Concrete spec a build phase can execute

### 2.0 Shared viewer (`ArtifactViewer` = F6)

**Stack:** `DialogTrigger` → `ModalOverlay` → `Modal` → `Dialog` from `react-aria-components` (already a dependency). `isDismissable={true}`. Portal default. One instance per open card (not a global singleton that remounts content mid-gesture).

**Geometry (iPhone, 390-wide):**

- Overlay: `position: fixed; inset: 0; background: color-mix(in oklch, #121212 40%, transparent)` light / `color-mix(in oklch, #000 55%, transparent)` dark. **No** `backdrop-filter` on the full viewport (blur ≤8px only if bounded; full-screen blur janks on A-series — motion-performance ref).
- Sheet: `width: 100%`; `height: 100dvh`; `max-height: var(--visual-viewport-height, 100dvh)`; `border-radius: 0` on iPhone (`@media (max-width: 39rem)`). Optional 12px top radii only if a 12px grabber gap is shown — full-bleed is clearer for code.
- Header: 44pt row, `padding-top: env(safe-area-inset-top)`, `background: var(--canvas)`, `border-bottom: 1px solid var(--line)`. Left: Close (44×44, `aria-label="Close"`). Center: Inter 13px / 600, `--ink-secondary`, one line, truncate. Right: Copy (44×44).
- Body: `overflow: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; padding: var(--space-4); padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom))`.
- `aria-labelledby` = heading. Focus moves to Close on enter (RAC Dialog). Escape dismisses (RAC). Overlay tap dismisses (`isDismissable`).

**Motion (default / `prefers-reduced-motion: no-preference`):**

| Piece | Enter | Exit |
|---|---|---|
| Overlay | `opacity 0→1`, **200ms**, linear-enough fade (RAC’s 200/150 is correct) | **150ms** `ease-in` reverse |
| Sheet | `transform: translateY(100%) → 0`, **320ms**, `var(--ease-out)` | `translateY(0 → 12%)` + `opacity 1→0`, **240ms** (~75%), ease-in `[0.55, 0, 1, 0.45]` |

**Forbidden:** `scale()`, RAC `modal-zoom`, overshoot bezier, `transition: all`, animating `height`/`top`, blur on the sheet.

**Reduced motion (`prefers-reduced-motion: reduce` — already global 0.01ms, but be explicit on the overlay):** overlay dissolve 1 frame; sheet `transform: none`; no translate. Hierarchy is still communicated because the overlay dim appears (color shift — Apple’s recommended substitute).

**Gestures:**

- Tap Close / overlay / hardware Escape → exit animation then unmount (RAC waits on `data-exiting`).
- Swipe down on the **header/grabber only** (not the code scroller): if `touch-start` in header and `deltaY > 80` with velocity, dismiss. Do **not** steal vertical pans from the body scroller (iOS scroll vs dismiss conflict).
- No pinch-zoom chrome; native Safari text zoom remains.

**a11y:** `role="dialog"` (RAC). `aria-modal="true"`. Background `inert` (RAC). Live region: none on open (the heading is enough). Copy: `aria-label` toggles `Copy` / `Copied`; `aria-live="polite"` on a 1-line status in the header, 1.5–2.0 s, matching `AssistantActions` (1500 ms) and Open WebUI (2000 ms). Prefer **1500 ms** for consistency with `App.tsx`.

### 2.1 Three card types (inline)

All cards: Inter chrome, hairline `1px solid var(--line)`, radius `var(--radius-lg)` (**16px**, Claude teardown), fill `var(--surface)` light / `var(--surface-raised)` dark, padding chrome `var(--space-3)` / well `var(--space-4)`, gap `var(--space-2)`. Actions **inside** the card, **44×44** on `(pointer: coarse)`, `--ink-muted` glyphs, `--ink` on press. No clay fill on Copy/Expand (Restrained dosage).

**Promote out of Activity:** bash Command/Output, fenced code, and long-text artifacts are **not** routine evidence. Today `isEvidenceBlock()` folds `tool_call` / successful `tool_result` into Activity (`App.tsx` 1312–1322). Bash-shaped tool pairs and artifact-sized text must **leave that group** (same as `file_diff` / plan / tool errors). Activity stays for thinking, usage, non-bash tools.

#### A. Bash Command/Output card

**Anatomy (one card, two wells — Kimi split, Claude paper chrome):**

```
┌─ Inter 11–13px ─────────────────────────────────── Copy  Expand ┐
│ Ran a command · {toolName}     {optional 1.2s}                  │
├─ Command well ──────────────────────────────────────────────────┤
│ $  {inputSummary}                                 (2-line clamp)│
├─ Output well ───────────────────────────────────────────────────┤
│ {output}                                          (8-line clamp │
│                                                    + fade mask) │
└─────────────────────────────────────────────────────────────────┘
```

- Header label: `Ran a command` / `Running a command` / `Command failed` (Kimi header copy). Error uses `--danger` text, not a red fill flood; well border `--danger` at 3:1.
- `$` prompt: `--accent-ink`, `font-variant-numeric: tabular-nums`, not animated.
- Command well: **carbon** (`--surface-code` light = `#1a1916` warm-black, **not** `#0f0f0e` cool; dark = `#12110f`). Text `--ink-inverse` / `oklch(0.92 0.01 85)` **warm** gray, not `oklch(... 255)`.
- Output well: same carbon, **one step dimmer** for the text (`--ink-muted` equivalent on carbon). Hairline `--line-hairline` between command and output.
- Clamp: command `2 * 1.65 * 0.8125rem` ≈ 2.7rem; output `8 * 1.65 * 0.8125rem` ≈ 10.7rem. `mask-image: linear-gradient(to bottom, #000 70%, transparent)` on the output well when truncated. Truncation **does not** change after stream-end (stable height).
- Whole card (except Copy) is the expand hit target. Copy `stopPropagation`.
- Streaming: append text, no token highlight, no height dance. Optional elapsed `tabular-nums` Inter 11px `--ink-muted` — no spinner if `working-wave` already exists under the turn; don’t double-animate.

**Fullscreen:** viewer title `Command · {toolName}`; body = command block then output, both unclamped, word-wrap (`white-space: pre-wrap; overflow-wrap: anywhere` — already on `pre`). Copy copies **command + output** as already-redacted plain text, separated by `\n`.

#### B. Fenced code card

**Light:** parchment well `--canvas-subtle #efeeeb`, text `--ink`, hairline `--line`. **Dark:** `--surface-raised #2b2925` (lighter than canvas — **lift**, don’t sink). This is the distinctive parchment move.

- Language pill: Inter 11px, `--ink-muted`, left. Copy + Expand 44pt, right (Open WebUI / Cline clustering, Cline sticky skipped).
- Preview: **12 lines** max (~16rem at 13px/1.65), fade mask, `white-space: pre-wrap`.
- Inline: **no** highlighter. Viewer: highlighter allowed; tokenize once per `block.id`+`revision`.
- Copy copies source text, not highlighted HTML (Cline review lesson).

**Fullscreen:** title `{language}` or `Code`; 15px mono; line-height 1.65; no line-number gutter on 390px (gutter steals 32px and fails 11pt). Optional line numbers only ≥600px — out of iPhone scope.

#### C. Long-text / goal-prompt artifact card

Claude: paper, near-canvas, title + subtype, not a terminal.

- Fill: `var(--surface)` / dark `var(--surface-raised)`. **Never** carbon.
- Title: Inter 15px / 600 `--ink`. Subtitle: Inter 13px `--ink-muted` (`Prompt`, `Note`, `Artifact`).
- Preview: Source Serif 4, **17px** (Apple body), line-height 1.5, **4 lines** (`-webkit-line-clamp: 4`), fade optional.
- Threshold: text blocks **>15 lines** or user-role prompts marked as goals (Anthropic “typically over 15 lines”). Short assistant prose stays borderless serif — do not card every paragraph.
- Copy + Expand in the card’s lower-right (Claude artifact window / Open WebUI).

**Fullscreen:** parchment canvas, Source Serif 19px / 1.62 (match assistant), `max-width: 66ch` (`--reading-width`), centered with `--space-4` gutters. This is a **reader**, not a terminal.

### 2.2 States (all three)

| State | Visual | Motion |
|---|---|---|
| Rest | Hairline, muted actions | none |
| Press (`:active` / `[data-pressed]`) | `scale(0.98)` on the **button**, not the card | 120ms `--ease-out` |
| Hover | **none** (`@media (hover: none)` already used elsewhere); on `(hover: hover)` only `--surface-muted` on the button | color 120ms |
| Focus-visible | `outline: 3px solid var(--focus); outline-offset: 3px` (global) | none |
| Copied | Glyph → check; label `Copied`; `--success` color | color 120ms; revert 1500ms; **no** toast fly-in |
| Copy failed | Stay `Copy`; `aria-live` “Couldn’t copy” | none |
| Truncated | Fade mask present; Expand visible | none |
| Streaming | Stable clamp; optional elapsed | no token flash |
| Error (bash) | `--danger` label + well border | none |
| Disabled (no Clipboard API) | Hide Copy (existing `canCopy` gate) | — |
| Reduced motion | Instant sheet; overlay dissolve; no scale; streaming dots static | 0.01ms global |

### 2.3 Gestures (iPhone)

| Gesture | Target | Result |
|---|---|---|
| Tap card body / Expand | card | open viewer |
| Tap Copy | 44pt control | clipboard; stopPropagation |
| Long-press inside well | native iOS text selection | do not hijack |
| Swipe down | viewer **header** | dismiss if threshold met |
| Swipe in body | scroll | native |
| Two-finger pinch | — | don’t implement; browser zoom |
| Escape / VoiceOver Escape | viewer | dismiss |

### 2.4 Accessibility (AA, iPhone)

- Icon-only buttons: visible 44pt + `aria-label`.
- Don’t rely on clay/red alone (error = label text + border) — Apple “Differentiate Without Color.”
- Contrast: add pairs to `contrast.test.tsx`: warm code text on `#1a1916`; `--ink` on `#efeeeb`; `--ink` on `#2b2925`; `--line-hairline` vs well; `--accent-ink` on carbon (may need `#f0b19a` even in light if clay-on-carbon <4.5).
- Dynamic Type: use `rem`; don’t lock `px` on chrome. 11pt floor.
- VoiceOver: card is a `group` with `aria-label` `{type} · {title}`. Expand is a button “Open full screen.” Viewer heading matches.
- Keyboard (external): RAC Dialog trap; Tab cycles Close, Copy, body. Don’t animate key-driven close (keyboard rule in animation-decision-framework).
- `prefers-reduced-motion` already mapped from iOS Settings → Accessibility → Motion ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion); [Apple iPhone: Customize onscreen motion](https://support.apple.com/guide/iphone/iph3e2e1fb3/ios)).

### 2.5 Implementation notes (this stack)

- **No new animation library.** CSS + RAC `[data-entering]` / `[data-exiting]` only.
- **No `transition: all`.** Name `opacity`, `transform`, `background-color`, `color`, `border-color`.
- Fix `.transcript-block` overflow for new kinds: `overflow: visible`; well owns clip.
- After clamp/stream, `virtualizer.measureElement` must run; viewer open must **not** change estimate.
- Word wrap always (Cline). `overflow-x: auto` only in the viewer if a single token exceeds width; prefer wrap.
- Don’t add Download, Publish, iframe preview, or `requestFullscreen`.
- Don’t syntax-highlight streaming text.
- Reuse `CopyGlyph` / copied timeout from `AssistantActions`; don’t invent a second copy idiom.

### 2.6 Acceptance (visual-motion)

On a 390-wide iPhone PWA, light **and** dark, with and without Reduce Motion:

1. Assistant prose still borderless Source Serif; cards sit in the flow with 16px paper chrome.
2. Bash is one card; command and output are two tones; height does not jump when output arrives.
3. Light code is parchment, not One Dark; dark code **lifts** off `#181715`.
4. Copy is 44pt, label-swap only, 1500 ms.
5. Expand opens a full-bleed sheet in 320 ms from the bottom (or instant + overlay dissolve if Reduce Motion).
6. No `scale()` on the sheet. No full-viewport blur.
7. Safe-area padding; home indicator does not cover last lines.
8. `contrast.test.tsx` includes well/token pairs; coarse-pointer buttons ≥44px.

---

## 3. Divergent / minority ideas (do not converge yet)

1. **All three types on parchment; carbon reserved for nothing.** Maximum brand coherence; weaker “this was a shell” genre cue. Worth a 390px screenshot A/B against §2.1A.
2. **Carbon for bash only, parchment for code *and* artifacts** (recommended). Dual-material, still restrained.
3. **Carbon for bash *and* fenced code** (category default / Cline / VS Code). Fast to ship, fights the restyle. Reject unless dark-mode lift is solved and light-mode gets a warm near-black, not `#0f0f0e` + cool blue.
4. **iOS 18 View Transition morph** from card → sheet (`view-transition-name: artifact-{id}`). Signature, but virtualizer + vestibular scale + Reduce Motion gating make it a **phase-after** experiment, not v1.
5. **Grabber + 12px top radii + mid detent** (iOS 16 sheet). More native; a mid detent is useless for 400-line output. If detents exist, use only **large**.
6. **Sticky Copy inside the well** (Cline). On 390px it collides with the fade mask and 44pt. Keep Copy in chrome.
7. **Line numbers + minimap in the viewer.** Desktop residue; fails 11pt and 44pt.
8. **Staggered token reveal / typewriter.** Decorative, high-frequency, vestibular-adjacent. Forbidden by the frequency gate.
9. **Framer Motion `AnimatePresence`.** Skill docs describe it; **this package does not depend on it**. Don’t add it for one sheet.
10. **Invert the viewer only** (parchment cards, carbon fullscreen). Material change at the moment of expand is disorienting (Apple: fades when relocating, don’t make the world move). Keep the same material in inline and viewer.
11. **Horizontal Command | Output split.** Desktop Warp/iTerm. On 390px each pane is ~170px. Stack vertically.
12. **Tap-to-expand the Activity group into bash cards.** Keeps telemetry quiet but hides the very objects this feature exists to polish. Promote bash out of Activity.
13. **Haptics on Copy** (`navigator.vibrate`). iOS Safari support is inconsistent; don’t block on it. Visual label swap is the AA-safe feedback.
14. **`requestFullscreen` fallback** (Open WebUI). Skip on iOS PWA.
15. **Newspaper column / ink-wash mask** as the signature (full-bleed parchment, no cards). Distinctive, but then bash is no longer scannable. Keep cards; spend the free axis on **warm wells + sheet-from-bottom**, not on removing structure.

---

## 4. Open questions + risks

1. **F6 is named in the operator brief but does not exist in `apps/pi-remote-web`.** Confirm the packet’s F6 is this RAC sheet and not a later desktop-only viewer. Building a second overlay would split focus-trap and motion tokens.
2. **Which tool names count as bash?** If `toolName` is redacted/generic, visual genre may have to key off `inputSummary` looking like a command. Wrong key → parchment code card vs carbon bash card flicker (a motion bug). Needs a deterministic, redaction-safe rule from the projector — visual spec assumes a boolean `genre: 'shell' | 'code' | 'prose'`.
3. **Dark hairline 3:1 on carbon.** `--line-hairline: #4a4741` on `#12110f` may fail 1.4.11. Measure; possibly use `--control-border: #807a70` for well edges only.
4. **Clay `$` on carbon.** `--accent-ink: #8a452f` on `#1a1916` may fail 4.5:1. Likely need the dark-theme `--accent-ink: #f0b19a` on carbon in **both** themes, or draw `$` in `--ink-inverse`.
5. **Virtualizer + fade mask + fonts.** Source Serif 4 + Inter are `font-display: swap` (`style.css` 1–20). Swap will remeasure rows. Viewer should not mount until fonts are idle, or accept one remeasure.
6. **iOS standalone PWA keyboard vs `100dvh`.** Opening the viewer while the composer is focused can leave a stuck visual viewport ([DEV: iOS PWA keyboard shrink](https://dev.to/cederhook/fixing-the-ios-standalone-pwa-keyboard-bug-that-shrinks-your-viewport-for-good-63d)). Spec: `blur()` composer on viewer open; size sheet to `--visual-viewport-height`.
7. **Swipe-down vs scroll.** Easy to get wrong; ship header-only swipe in v1.
8. **Syntax highlighter bundle size vs offline PWA.** If added, lazy-load inside the viewer chunk only. Risk: first expand jank. Acceptable if overlay fade covers the load; not acceptable if the sheet sits empty for 300ms — show unhighlighted text immediately, paint tokens when ready **without** a color flash (swap in one frame).
9. **Mobbin pixels were not retrieved this pass** (no authenticated Mobbin MCP). Local Claude teardown + Anthropic docs + GitHub UIs are the measurement sources. A later pass should pull the Claude coding-input flow screens and re-measure artifact radius/padding if they disagree with ~16px / near-canvas.
10. **WCAG 2.3.3 is AAA.** Product bar is AA. Still implement the Reduce Motion path: Apple’s own Reduced Motion nutrition label uses the same triggers, and iPhone users enable it in Settings.

---

## 5. Sources

### Local (this repo)

- `apps/pi-remote-web/src/style.css` — tokens, durations, wells, reduced-motion, overflow
- `apps/pi-remote-web/src/App.tsx` — Activity grouping, Block renderers, Copy, virtualizer
- `apps/pi-remote-web/src/SessionComposer.tsx` / `SessionHeader.tsx` — Dialog-in-Popover only
- `apps/pi-remote-web/package.json` — no highlighter, no motion lib
- `apps/pi-remote-web/tests/contrast.test.tsx` — WCAG pairs (no syntax/well pairs)
- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`
- `docs/design-reference/mobile-chat-apps/02-current-ui-map.md`
- `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`
- `docs/feature-catalog/pwa/typed-block-transcript.md`
- `goal.md` — Claude restyle target, F1/F2 only (no F6 in-repo)

### Apple / WebKit / WCAG

- https://developer.apple.com/design/human-interface-guidelines/motion
- https://developer.apple.com/design/human-interface-guidelines/sheets
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://developer.apple.com/design/tips/
- https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/
- https://support.apple.com/guide/iphone/customize-onscreen-motion-iph3e2e1fb3/ios
- https://developer.apple.com/videos/play/wwdc2024/10085/ (17 pt / 44 pt)
- https://webkit.org/blog/7551/responsive-design-for-motion/
- https://webkit.org/blog/15865/webkit-features-in-safari-18-0/ (View Transitions)
- https://caniuse.com/view-transitions
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

### React Aria / stack

- https://react-spectrum.adobe.com/react-aria/Modal.html (`data-entering` / `data-exiting`, `--visual-viewport-height`, default zoom)
- https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/Modal.tsx

### Claude / Kimi / coding-agent UIs

- https://support.anthropic.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
- https://github.com/anthropics/claude-code/issues/61891
- https://github.com/anthropics/claude-code/issues/78792
- https://github.com/MoonshotAI/kimi-code
- https://moonshotai.github.io/kimi-code/en/reference/tools.html
- https://github.com/MoonshotAI/kimi-code/pull/1345
- https://github.com/xy200303/spec-kimi-code/commit/5ea3ec489e0a7d66b844c39ee65162fd6a8ed8b1
- https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-code/src/tui/components/dialogs/task-output-viewer.ts
- https://github.com/cline/cline/pull/1583
- https://github.com/open-webui/open-webui/blob/53764fe6/src/lib/components/chat/Artifacts.svelte
- https://github.com/open-webui/docs/blob/main/docs/features/chat-conversations/chat-features/code-execution/artifacts.md
- https://github.com/sst/opencode/blob/5d2dc888/packages/ui/src/components/message-part.tsx
- https://github.com/anomalyco/opencode/issues/17553

### Mobbin (URLs found; screenshot pixels not fetched this pass)

- https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b — Claude iOS, coding input
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS, text input
- https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3 — Claude Web code preview
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 — ChatGPT iOS chat
- https://mobbin.com/explore/screens/a7a9fe4a-4817-4b22-ad5b-0a1e17c447d8 — Gemini iOS (corroborating chrome)

### PWA viewport (risk)

- https://dev.to/cederhook/fixing-the-ios-standalone-pwa-keyboard-bug-that-shrinks-your-viewport-for-good-63d
