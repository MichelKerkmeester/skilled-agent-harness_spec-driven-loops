<!-- provenance: external-CLI orchestration pass; original file iter-08-grok.md -->
> **Source pass 8** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-8-grok.md`.

<!-- F8-inbound-media | model=grok | lens=visual-motion | iter 8/15 | 2026-08-16T04:47:15.063Z -->

I have enough cited evidence to write the visual-motion spec against this app’s real tokens, Claude/Kimi patterns, and iPhone PWA constraints.

# Inbound image preview — visual + motion research (iteration 8 of 15)

Lens: **visual-motion** for an installable iPhone PWA (React 19 + Vite + Tailwind 4 + react-aria-components). Design system is locked: ink-on-parchment (bone `#f8f8f6` / carbon ink / clay `#d97757`; Inter + Source Serif 4), light + dark, WCAG AA. Inbound analog of F5; fullscreen **reuses F6**.

---

## 1. Findings for this lens

### 1.1 Register, dials, and what already exists in Pi Remote

This surface is a **Product** UI (task-serving chat), not a Brand landing page. That locks density to “whitespace must earn its place,” motion to **short state transitions (150–250 ms) with no page-load choreography**, and color to **Restrained** (accent ≤ ~10%, never decoration). ([Brand-vs-Product register](file://.claude/skills/sk-design/shared/register.md); applied in `apps/pi-remote-web/src/style.css`.)

The live token set already encodes that posture:

| Role | Light | Dark | Where used today |
|---|---|---|---|
| Canvas (parchment) | `#f8f8f6` | `#181715` | `--canvas` |
| Subtle mat | `#efeeeb` | `#1f1e1b` | `--canvas-subtle` / `--surface-muted` |
| Card fill | `#ffffff` | `#24221f` | `--surface` / `--surface-raised` |
| Ink | `#121212` | `#f4f1eb` | `--ink` |
| Muted meta | `#6c6a65` | `#b5afa5` | `--ink-muted` (proven ≥ 4.5:1 in `apps/pi-remote-web/tests/contrast.test.tsx`) |
| Hairline | `#e7e6e1` | `#3b3934` | `--line` |
| Clay accent | `#d97757` | `#d97757` | `--accent` — send circle, streaming glyph, **not** card chrome |
| Radius | `0.75rem` md / `1rem` lg | same | `--radius-md` / `--radius-lg` |
| Motion | `120ms` fast, `220ms` state, `cubic-bezier(0.22, 1, 0.36, 1)` | same | `--duration-fast`, `--duration-state`, `--ease-out` |

Assistant prose is already Source Serif 4 at `1.1875rem` / `line-height: 1.62`; user turns are compact trailing bubbles (`max-width: min(82%, 46ch)`, radius `1.15rem`). Promoted artifacts (plan, diff, unknown) keep a labelled header; routine thinking/tools/usage collapse. Assistant action row sits **under** assistant text. ([`style.css` `.block-role-assistant`, `.turn-actions`; `App.tsx` `Block`.](file://apps/pi-remote-web/src/style.css))

**Placement implication:** an inbound screenshot is a **promoted, non-collapsible** sibling of assistant prose — same class as plan/diff, **not** Activity evidence. The council already requires assistant artifacts to sit **between the introducing prose and the action row**. ([`docs/design-reference/mobile-chat-apps/council-gpt-sol.md`](file://docs/design-reference/mobile-chat-apps/council-gpt-sol.md)) If the image is rendered *inside* `Block` for `kind: 'text'`, the action row will attach to the wrong object; it must be its own transcript kind so `AssistantActions` stays on the prose block.

The protocol today has **no inbound image kind**. Durable kinds are `text | thinking | plan | tool_call | tool_result | file_diff | usage`. Outbound `ImageContent` already exists on `prompt`/`steer`/`follow_up` (`type: 'image', data, mimeType`) — that is F5’s payload, not a transcript card. Unknown/redacted kinds already fail closed to quiet copy: *“A redacted ‘{originalKind}’ block cannot be displayed by this client.”* ([`packages/pi-rpc-protocol/src/types.ts`](file://packages/pi-rpc-protocol/src/types.ts); `App.tsx` `case 'unknown'`.)

### 1.2 What Claude iOS actually does (target bar — do not copy blindly)

Claude’s conversation is a **reading surface**: serif, unbubbled assistant, compact user bubble, quiet action row, bone canvas, clay used only on send / brand mark. Inline **artifact cards** in the flow are measured at ~390 pt as:

- radius **~16 px** (`1rem` = Pi Remote `--radius-lg`)
- **hairline** border, **near-canvas** fill (not a second white “app card”)
- **title** (medium sans) + **muted subtitle** (`Piano MIDI Player` / `Interactive artifact`)
- **small tilted thumbnail/icon on the right**
- optional centered `1 artifact` pill above the turn
- card sits in the prose column; action row remains **outside** the card, 14–18 pt below the answer ([`docs/design-reference/mobile-chat-apps/01-visual-teardown.md`](file://docs/design-reference/mobile-chat-apps/01-visual-teardown.md); [Claude iOS App Store](https://apps.apple.com/us/app/claude-by-anthropic/id6473753684); [Claude Help: artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them); Mobbin Claude chat-detail: [screen 63d3bc73](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8), [screen c0d820f1](https://mobbin.com/explore/screens/c0d820f1-2552-4731-aac3-8b3265b6ce52))

Claude **mobile Artifacts** (GA on iOS, July 2025) open a **dedicated window**, not an in-bubble lightbox. That is the right analog for *interactive* artifacts, **wrong** analog for a coding screenshot: the pixels *are* the content, and a side panel on a 390 pt phone steals the reading column. ([Anthropic: Artifacts on iOS](https://www.anthropic.com/news/build-artifacts); [Claude Artifacts blog](https://claude.com/blog/artifacts))

Claude Code iOS still fails the *inbound* job: host-generated images often render as **file chips** that require a tap, instead of inline. Users explicitly want “display directly into the body.” That is the bar Pi Remote must clear. ([anthropics/claude-code#61995](https://github.com/anthropics/claude-code/issues/61995))

**Do not import Claude’s tilted thumbnail for screenshots.** Tilt is decorative motion/perspective (Apple’s Reduced Motion criteria call out depth simulation, parallax, and scaling as vestibular triggers). A terminal/IDE capture must stay **axis-aligned** so 1 px of UI chrome on the host remains 1 px on the phone. ([Apple Reduced Motion evaluation](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/); [HIG Accessibility — reduce zooming/scaling/peripheral motion](https://developer.apple.com/design/human-interface-guidelines/accessibility))

### 1.3 What Kimi / Kimi Code actually does (second target bar)

Kimi mobile is **tool-forward**: attachments live in the composer `+`; vision/screenshots are a first-class input. Message chrome is a **utility tray**, not glass. ([Kimi App Store](https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312); [Kimi help / new-user guide](https://www.kimi.com/zh-cn/help/new-user-guide/overview); [`research-gpt-luna.md` §2](file://docs/design-reference/mobile-chat-apps/research-gpt-luna.md))

Kimi **Code’s web client** (the closest open visual spec for “agent returned an image”) already shipped the exact two-layer UI this feature needs:

1. **`ToolMediaPreview`**: thumbnail **grid** of `MediaTile`s (`role="button"`, Enter/Space), type badge `Image`/`Video`, `onError` → `ImageOffIcon`.
2. **Fullscreen `Dialog`**: title “Media preview”, `<img>` / `<video>` inside the dialog, URL allowlist `http: | https: | data: | blob:` plus relative `/`.
3. Later: **authenticated blob URLs** (native `<img src>` cannot send `Authorization`); **IntersectionObserver** so historical media is not fetched until near the viewport. ([MoonshotAI/kimi-cli#1001](https://github.com/MoonshotAI/kimi-cli/pull/1001); [tool.tsx `ToolMediaPreview`](https://github.com/MoonshotAI/kimi-cli/blob/main/web/src/components/ai-elements/tool.tsx); [spec-kimi-code `AuthMedia` / IntersectionObserver](https://github.com/xy200303/spec-kimi-code/commit/ec758c747a95555847b8a0275ed0809010c7d5e7))

That is the motion/visual recipe to match: **grid of still tiles in the turn → one shared fullscreen dialog**. No Ken Burns, no bouncing loader, no second “Waiting…” bubble (Kimi explicitly removed that).

### 1.4 Coding-agent prior art (what *not* to look like on parchment)

| Client | Inline treatment | Fullscreen | Motion | Take for Pi Remote |
|---|---|---|---|---|
| **Cline `BrowserSessionRow`** | Aspect-ratio box via `padding-bottom: (h/w)*100%`; screenshot `object-fit` over `var(--vscode-input-background)`; URL chrome above | `FileServiceClient.openImage` (native OS viewer, **not** in-chat) | Cursor overlay `transition: top/left 0.3s ease-out` | **Steal the reserved-aspect box** (kills virtualizer jump). **Do not** steal the moving cursor or VS Code chrome. ([cline BrowserSessionRow.tsx](https://github.com/cline/cline/blob/main/webview-ui/src/components/chat/BrowserSessionRow.tsx)) |
| **pi-ai / pi-agent-core** | Tools *can* return `{ type: 'image', data, mimeType }` as LLM+UI content | TUI extensions (`pi-image-tools`, `pi-image-placeholder`) render SIXEL/half-block previews | N/A | Protocol prior art for **inbound** image blocks exists in pi itself; Pi Remote’s relay transcript simply never projected it. ([mariozechner post](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/); [pi-agent-core](https://www.npmjs.com/package/@mariozechner/pi-agent-core); [MasuRii/pi-image-tools](https://github.com/MasuRii/pi-image-tools/)) |
| **Open WebUI / computer-use** | Markdown link **or** fenced HTML iframe “artifact” | Side panel / new tab | Auto-open is a patch | On a phone, iframe-in-transcript fights the 70 dvh virtualizer. Prefer bitmap card + F6, not a nested SPA. ([Open WebUI features](https://docs.openwebui.com/features/); [open-computer-use preview valves](https://github.com/Wide-Moat/open-computer-use/commit/b08d472d989a3cabfcfafaf968fb70cb6997325f)) |

### 1.5 iPhone + PWA motion physics (this stack, this device)

**Apple HIG — when to go full-screen.** Sheets are for short tasks. For photos/video, Apple specifies a **full-screen modal** (`UIModalPresentationStyle.fullScreen`), not a page sheet, because the job is inspecting media. Provide a clear dismiss control; do not nest sheets. ([HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets); [HIG Modality](https://developer.apple.com/design/human-interface-guidelines/modality))

**Gestures (HIG).** Pinch+drag = zoom; double-tap = zoom in / zoom out if already zoomed; swipe = dismiss. In full-screen, gestures act on **the content**, not focus. Set min/max zoom so a single pixel does not fill the screen. Always offer a **button alternative** to complex gestures. ([HIG Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures); [HIG Scroll views — zoom limits](https://developer.apple.com/design/human-interface-guidelines/scroll-views); [HIG Accessibility — simplest gesture](https://developer.apple.com/design/human-interface-guidelines/accessibility))

**Reduce Motion.** Apple’s evaluation criteria: if motion conveys hierarchy (“this view is a subview of the prior view”), **do not delete it** — replace zoom/scale with a **dissolve / highlight fade / color shift**. Depth simulation, animated blur, and scaling are the triggers. WebKit is explicit that a **simple crossfade is not a known vestibular problem**; zooming/scaling is. ([Reduced Motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/); [WebKit View Transitions](https://webkit.org/blog/16967/two-lines-of-cross-document-view-transitions-code-you-can-use-on-every-website-today/); [HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion))

**WCAG mapping (AA bar + the AAA we should still honor).** Pi Remote’s bar is WCAG AA. 2.3.3 Animation from Interactions is AAA, but iOS Reduce Motion is the same user. Honor `prefers-reduced-motion` by replacing *spatial* animation with opacity/color. 2.2.2 Pause/Stop/Hide (A) forbids looping motion > 5 s beside other content — **no infinite shimmer skeletons**. 2.3.1 Three Flashes (A): no GIF/APNG that flashes > 3×/s. 1.4.11 Non-text Contrast (AA): close/zoom controls ≥ **3:1** against the overlay. 1.1.1 Non-text Content: every tile needs a textual alternative. ([WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html); [WCAG 2.2](https://www.w3.org/TR/WCAG22/); [Chrome View Transitions — reduced motion](https://developer.chrome.com/docs/web-platform/view-transitions/same-document))

**View Transitions on iPhone Safari.** Same-document `document.startViewTransition()` shipped in **Safari 18**. Shared-element morph (`view-transition-name` unique per document at capture time) is how a thumbnail becomes a hero. Fallback is instant swap. **Do not** statically name every thumbnail `hero` — two live names abort the whole transition. Assign the name **only on the tapped tile + the F6 `<img>` for the duration of the transition**. ([WebKit](https://webkit.org/blog/16967/two-lines-of-cross-document-view-transitions-code-you-can-use-on-every-website-today/); [Chrome same-document VT](https://developer.chrome.com/docs/web-platform/view-transitions/same-document); [WICG explainer](https://github.com/WICG/view-transitions/blob/main/explainer.md))

**Critical stack conflict:** react-aria `Modal` portals to `document.body` and waits on `[data-entering]` / `[data-exiting]` CSS. A View Transition morph still works **if** both snapshots exist at `startViewTransition` time, but mixing **VT group animation (width/height, often main-thread)** with **Modal overlay fade** and a **virtualized list** is how iPhone 60 Hz jank happens. Default `::view-transition-group` animates `width`/`height` (layout), not only `transform`. Cap duration at the layout band (300–500 ms) or disable the group animation and only crossfade. ([react-aria Modal](https://react-aria.adobe.com/Modal); [WICG explainer — group width/height](https://github.com/WICG/view-transitions/blob/main/explainer.md))

**iOS Safari overlay traps (must spec, not discover in QA):**

- `overflow: hidden` on `body` **does not** lock background scroll; react-aria Modal claims mobile scroll-lock — still add `overscroll-behavior: contain` on the overlay and keep the image scroller always scrollable (even at scale 1, give 1 px of slack or iOS escalates to document scroll). ([OpenReplay dialog scroll](https://blog.openreplay.com/stop-page-scrolling-dialog-open/); [iOS keyboard/visualViewport](https://dev.to/deanliu/the-ios-safari-keyboard-scroll-bug-fixed-with-one-line-of-css-1353))
- Page pinch-zoom shifts `visualViewport.offsetLeft/Top` and **drifts fixed overlays**. F6 must be `position: fixed; inset: 0` in the **layout** viewport, and **page zoom should be inert while F6 is open** via `touch-action: none` on the overlay chrome (not via `user-scalable=no` on the document — Apple rejects disabling zoom as an a11y strategy). Pinch is implemented **inside** the image layer only. ([floating-ui / WebKit pinch-zoom drift](https://github.com/ng-primitives/ng-primitives/issues/758))
- Existing shell already uses `100dvh`, `env(safe-area-inset-*)`, and `min-height: 44px` under `(pointer: coarse)`. F6 close/chrome must sit in `max(var(--space-2), env(safe-area-inset-top))` like `.session-header`. ([`style.css`](file://apps/pi-remote-web/src/style.css))
- **Theme-color mismatch (visual defect if F6 opens):** `App.tsx` sets `theme-color` to `#101319` / `#f4f5f7`, but canvas is `#181715` / `#f8f8f6`. The iOS status bar will flash a **different parchment** when the overlay paints. F6 must set `theme-color` to the overlay ink (`#121212` light-room / `#181715` dark) on open and restore on close.

**Screenshot rendering on 3× iPhone.** Default bilinear upscale **blurs UI chrome**. `image-rendering: pixelated` is for integer upscale (QR, pixel art); at 2.6× (a 390 pt card showing a 1280 px capture) it produces irregular pixel sizes. Spec: **`auto` (smooth) at fit-contain in the card**; **`pixelated` only when F6 zoom ≥ 1.0 and the displayed CSS size is within 2% of an integer multiple of natural size**; otherwise keep `auto`. ([MDN `image-rendering`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering); [MDN crisp pixel-art caveats](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look))

### 1.6 Restraint gate (what earns motion)

Frequency gate from the design system: 100×/day → never animate; occasional → standard transition; rare → delight allowed. ([animation-decision-framework](file://.claude/skills/sk-design/sk-design-interface/references/motion/animation-decision-framework.md))

| Event | Frequency in a coding session | Gate result |
|---|---|---|
| New inbound image **first paint** | tens/day (every screenshot tool) | **Opacity only**, 120 ms. No `translateY`. Streaming revisions of the same `id` = **no re-entrance**. |
| Tap card → F6 | occasional | **Orientation** (hierarchical subview). Morph **or** dissolve. |
| Pinch / pan in F6 | user-driven, essential | **Not an animation** — 1:1 follow finger. |
| Swipe-down dismiss (scale === 1) | occasional | **Spatial continuity** — follow finger; fling uses 220 ms `--ease-out`. |
| Press on tile | every tap | Existing global `button:active { transform: scale(0.98) }` — keep. Reduced motion: color only. |
| Skeleton shimmer | would loop beside prose | **Forbidden** (WCAG 2.2.2). Static `--canvas-subtle` wash. |
| Ken Burns / image content motion | never | **Forbidden**. The screenshot is evidence, not a hero. |
| Cursor overlay (Cline) | N/A | **Forbidden** on parchment; it is VS Code session chrome. |

Existing global reduced-motion hammer already sets `animation-duration: 0.01ms` and kills `.session-card` translate. F6 **must not** rely only on that hammer: View Transition pseudo-elements are **not** `*` descendants of the document tree in the way authors expect; they need an explicit `::view-transition-*` rule. ([`style.css` `@media (prefers-reduced-motion)`](file://apps/pi-remote-web/src/style.css); [Chrome VT reduced-motion snippet](https://developer.chrome.com/docs/web-platform/view-transitions/same-document))

### 1.7 Ink-on-parchment: how a *screenshot* should sit (the non-obvious part)

A coding screenshot is usually a **dark IDE on a light page** (or a dark IDE on a dark page). Claude’s near-canvas card and Kimi’s utility tile both fail in different ways if copied naively:

- **Light mode:** a near-white screenshot of a macOS window on `#f8f8f6` **vanishes**. The card needs a **mat** (`--canvas-subtle` `#efeeeb`) *around* the bitmap, plus `--line` hairline, so the photograph of a UI is framed like a print, not pasted on the page.
- **Dark mode:** a `#1e1e1e` VS Code capture on `--surface` `#24221f` also vanishes. Same mat (`--canvas-subtle` `#1f1e1b`) and hairline `--line` `#3b3934`. **Never invert or recolor the bitmap.**
- **Clay `#d97757` as a frame** would violate the 10% accent rule and fight screenshot oranges (Xcode, iTerm). Clay is reserved for: (a) the 4 px “new” pip on first unread inbound, dismissed after view; (b) F6 is not a send action — **no clay in F6 chrome**.
- **Source Serif on the caption** would compete with assistant prose. Captions use **Inter**, the same 0.68–0.72 rem / weight 680 meta as `.transcript-block > header` and `.approval-card > header`.
- **Shadow:** `--shadow-raised` is `0 4px 20px rgb(0 0 0 / 4%)` light / `24%` dark. Use it **only** on F6? No — the transcript already uses it on the composer island. On an inline card, shadow on every screenshot is product-slop. **Hairline only in-flow; shadow only on F6 is wrong too** (F6 is full-bleed). Shadow: **none** on the card; **none** on F6. Depth comes from the scrim, not a drop shadow.

Mobbin’s generic “photo / full-screen overlay” cluster (Photos, chat image bubbles, media editors) consistently uses: **full-bleed bitmap, dimmed scrim, floating close, pinch-zoom, swipe-down dismiss** — not a centered white dialog card. ([Mobbin full-screen overlay](https://mobbin.com/explore/mobile/ui-elements/full-screen-overlay); [Mobbin photo element](https://mobbin.com/explore/mobile/ui-elements/photo))

Kimi Code’s Dialog is a **centered panel** (web). On iPhone, Apple’s photo guidance wins: **full-screen**, not a 90 vw dialog with 24 px radius floating on a 50% black scrim. That would look like a website inside a PWA.

---

## 2. Concrete spec a build phase can execute

### 2.1 Objects and placement

**New transcript kind (visual contract only here):** `kind: 'image'` is promoted, non-collapsible, `collapsible = false`, `showHeader = false` (Claude card, not plan header). Grouping: `turns.ts` already buckets any non-user-text into the open turn — no grouping change. Render **after** assistant `text` blocks of the same turn and **before** `AssistantActions` of that turn. Implementation: either (a) teach `Block` to skip `AssistantActions` when a following sibling is `image`, and put actions on a turn footer, or (b) move `AssistantActions` to the turn renderer. (b) is the one that survives multiple images.

**Layouts (pick by `count` + `aspectRatio` from sanitized metadata, never from bytes in the DOM):**

| Condition | Layout id | Geometry (390 pt iPhone) |
|---|---|---|
| 1 image, any aspect | `FigureCard` | Width = prose column (full of `.transcript-scroll` minus page gutter). **Max height `min(36vh, 280px)`**. `object-fit: contain`. Mat padding `var(--space-2)` (8 px). Radius `--radius-md` (12 px) on the **mat**; bitmap `border-radius: calc(var(--radius-md) - 1px)` so hairline is outside the pixels. |
| 2–4 images | `TileGrid` | `grid-template-columns: 1fr 1fr`; gap `var(--space-2)`. Tile height `7.5rem` (120 px). `object-fit: cover` **only in the tile**; F6 always `contain`. |
| ≥ 5 | `TileGridPlus` | Same grid, 4th cell `+N` overlay in Inter 0.86 rem / 650 on `color-mix(in oklch, var(--ink) 55%, transparent)`. |

**Do not** use Claude’s right-tilted 48 px thumb for a single screenshot. That layout is for *named artifacts* (`Piano MIDI Player`). A screenshot’s name is the pixels.

**Typography (card):**

- Kicker (optional, only if `source === 'screenshot'`): Inter `0.72rem`, weight 700, letter-spacing `0.06em`, uppercase, color `--ink-muted` (**not** `--accent-ink` — that kicker is for page heroes). Copy: `SCREENSHOT` or `IMAGE`.
- Title: Inter `0.86rem`, weight 650, `--ink`, 1 line, ellipsis. Copy from sanitized `label` (`terminal`, `browser`, `ui`) — **never a host path**.
- Meta: Inter `0.68rem`, weight 550, `--ink-muted`, tabular nums. Copy: `{width}×{height} · {mime short}` e.g. `1440×900 · PNG`. If redacted: `withheld`.
- No timestamp in the card (turn already has temporal order). Timestamp remains on `occurredAt` for `time` in the accessibility name.

**Colors:**

```
.image-card {
  background: var(--canvas-subtle);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.image-card img { background: var(--canvas-subtle); } /* letterbox */
.image-card[data-state="error"],
.image-card[data-state="redacted"] { background: var(--surface); }
```

Focus: existing `button:focus-visible { outline: 3px solid var(--focus); outline-offset: 3px }` — the card **is** a `Button` (react-aria), not a clickable `<div>`. Hit target: whole card; minimum 44 px on the short side (`@media (pointer: coarse)` already forces 44 px on `button`).

### 2.2 States (visual + motion)

| `data-state` | What the user sees | Motion | A11y name |
|---|---|---|---|
| `pending` | Mat at reserved `aspect-ratio` (from metadata; fallback `16 / 10`). No shimmer. One 6 px `--line` rule at 40% height as a static “plate.” | none | `Screenshot, loading` |
| `loading` | Same box; `<img>` decoding. Optional 1 px `--accent` pip at top-left **only if this block’s `seq` is the live edge**. | pip uses existing `signal-pulse` 1.4 s; **killed** under reduced-motion | `Screenshot, loading` |
| `ready` | Bitmap contained in the mat. | First paint only: `opacity 0→1` `120ms` `--ease-out`. Revisions of same `id`: instant replace (decode-in-place). | `{label}, {w}×{h}, image. Double-tap to open full screen.` |
| `error` | No broken-image icon as the only signal. `ImageOff`-style 24 px glyph in `--ink-muted` + Inter 0.8 rem “Preview unavailable.” Secondary `Retry` text button (min 44 px). | none | `Screenshot unavailable. Retry.` |
| `redacted` | **Different from error.** No glyph that looks like a network failure. Quiet copy matching unknown blocks. No retry. | none | `Image withheld by redaction policy.` |
| `stale` | Ready, but `revision` ≠ viewer revision: 1 px `--warning` top rule (same pattern as `.session-card::after` but always on). | none | includes `Out of date` |
| `open` (F6) | Card remains in the list (virtualizer). Overlay owns focus. | see 2.4 | dialog title `Screenshot` |

**Upload is F5 (outbound).** This inbound card never shows a progress bar for *sending*. If the relay is still sanitizing, that is `pending`, not a determinate bar (determinate would leak byte size into the UI — avoid).

### 2.3 F6 fullscreen viewer (reuse — one component, two callers)

**Shell:** react-aria `ModalOverlay` + `Modal` + `Dialog`. `isDismissable` **false** while `scale > 1.02` (pinch must not close). `isKeyboardDismissDisabled={false}` (Escape always closes at any scale — HIG + RAC default). Portal: default `document.body`. ([react-aria Modal](https://react-aria.adobe.com/Modal))

**Geometry:**

```
.image-viewer-overlay {
  position: fixed; inset: 0; z-index: 40; /* above .topbar 20, .session-header 6 */
  background: color-mix(in oklch, var(--ink) 88%, transparent); /* carbon scrim, both themes */
  /* NOT backdrop-filter: blur — Apple lists animated blur as a Reduce Motion trigger;
     a static blur on the whole 390×844 viewport is also a paint bomb on iPhone. */
}
.image-viewer-stage {
  position: absolute;
  inset: 0;
  padding: max(var(--space-2), env(safe-area-inset-top))
           var(--space-4)
           max(var(--space-4), env(safe-area-inset-bottom));
  display: grid; place-items: center;
  touch-action: none; /* page pinch killed; custom pinch on the img */
  overscroll-behavior: contain;
}
.image-viewer-stage img {
  max-width: 100%; max-height: 100%;
  object-fit: contain;
  /* no radius — full-screen photo, not a card */
}
```

**Chrome (always visible — this is inspection, not cinema):**

- Leading: close `Button`, 44×44, circular, `background: color-mix(in oklch, var(--ink-inverse) 12%, transparent)`, glyph `--ink-inverse`, 3:1 vs scrim (scrim is ~88% `#121212` → check close glyph `#f8f8f6` — that pair is the existing `action-fg on action-bg` ≥ 4.5:1).
- Center: Inter 0.78 rem / 620 `--ink-inverse`, `{index} of {count}` only when count > 1.
- Trailing: optional `Open in Photos` **omitted** (PWA cannot write to Photos without a share sheet). Use **Share** only if F5 already wired `navigator.share` with the blob; otherwise omit rather than ship a dead glyph (council: no dead affordances).

**Do not** auto-hide chrome after 2 s. Photos.app does; VoiceOver + “where is close?” on a coding screenshot is a worse failure than slightly busier chrome.

**Gestures:**

| Gesture | Condition | Result |
|---|---|---|
| Tap overlay chrome / Close | always | Close F6 |
| Tap bitmap | scale === 1 | Toggle nothing (chrome stays). Avoid tap-to-toggle-chrome. |
| Double-tap bitmap | always | Toggle zoom 1.0 ↔ `min(2.0, naturalWidth / displayedWidth)` |
| Pinch | always | Clamp scale `[1, 4]`. At 1.0, additional pinch-out is ignored (no shrink-bounce). |
| Pan | scale > 1 | Pan bitmap; rubber-band at edges with CSS `overflow: auto` on an inner scroller, not JS spring |
| Swipe down | scale ≤ 1.02, vertical intent > 12 px, horizontal < 8 px | Follow finger; if translationY > 96 px **or** velocity high, dismiss; else 220 ms snap back |
| Swipe horizontal | count > 1, scale === 1 | Previous/next image (same F6 instance, swap `src`, no nested modal — HIG “one sheet”) |
| Escape / VoiceOver “dismiss” | always | Close |

Non-gesture equivalents: Close button; if count > 1, previous/next icon buttons 44×44. Double-tap zoom also available as a `Zoom` toggle in chrome for Switch Control.

**Status bar:** on open, set `meta[name=theme-color]` to `#121212` (light) / `#181715` (dark). Restore previous. Overlay `color-scheme: dark` so Safari form controls don’t flash white.

### 2.4 Motion spec (tokens only — no new library)

Do **not** add Motion/framer. react-aria already exposes `[data-entering]` / `[data-exiting]` and waits for CSS animations. Existing tokens: `--duration-fast: 120ms`, `--duration-state: 220ms`, `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` (= `--ease-out-interface`).

**Card enter (ready, first paint):**

```
.image-card img[data-enter] {
  opacity: 0;
  animation: image-card-enter var(--duration-fast) var(--ease-out) forwards;
}
@keyframes image-card-enter { to { opacity: 1; } }
```

Properties: **opacity only**. No transform (virtualizer + transform on a row is a compositor trap when the row is `position: absolute` in `.virtual-row`).

**F6 open/close — default (motion allowed):**

1. Feature-detect `document.startViewTransition`.
2. Set `view-transition-name: inbound-image` on the **tapped** `<img>` and the F6 `<img>` (clear after `finished`).
3. `startViewTransition(() => setOpen(true))`.
4. Duration: **320 ms** on `::view-transition-group(inbound-image)` with `--ease-out`. Overlay: RAC `[data-entering] { animation: overlay-in 220ms var(--ease-out); }` opacity 0→1.
5. Exit: 75% of enter → **240 ms** group + `overlay-out 165ms` (motion-strategy exit rule).

```
::view-transition-group(inbound-image) {
  animation-duration: 320ms;
  animation-timing-function: var(--ease-out);
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(inbound-image),
  ::view-transition-old(inbound-image),
  ::view-transition-new(inbound-image) {
    animation-duration: 160ms;
    animation-timing-function: linear;
  }
  /* Kill the spatial morph; keep dissolve — Apple/WebKit guidance */
  ::view-transition-group(inbound-image) {
    animation-name: none; /* no width/height/transform */
  }
}
```

If VT is unavailable: overlay dissolve 220 ms only; image appears at full size (no fake scale-from-card in JS — that *is* the vestibular zoom Apple wants gone).

**Press feedback:** inherit `button:active:not(:disabled) { transform: scale(0.98) }` (already 120 ms). Reduced-motion global already zeros this.

**Multi-image F6 paging:** no carousel slide. Instant `src` swap + 120 ms opacity. Horizontal swipe may translate **with the finger** (essential feedback) then commit; if cancelled, 220 ms snap. Reduced-motion: no follow-finger, instant swap.

**Virtualizer:** every card **must** publish `aspect-ratio` (from digest metadata) **before** decode, using Cline’s padding-box reservation so `@tanstack/react-virtual` does not restack 54 rem of transcript when the bitmap arrives. Fallback `16 / 10` (typical desktop capture). Portrait iPhone screenshots (`9 / 19.5`) still cap at `36vh` so one inbound image cannot push the composer off-screen.

### 2.5 Redaction + security as *visual* design (inbound)

The durable transcript stores **no raw host path and no unbounded bytes**. The card therefore **cannot** look like a Finder preview (filename.ext is a leak). Visual rules:

- Caption sources: `label` (enum), `pixelSize`, `mimeShort`, `artifactId` **never shown** in the clear UI (opaque id is for `src` query only).
- `src` = same-origin relay URL with `id` + `revision` + `digest` as query; `<img>` has **no** `src` until `ready`/`loading` — pending is CSS-only, so a failed-closed ticket never paints a 404 URL into the DOM for long-press “Copy image address.”
- Long-press: iOS will offer **Save Image / Copy**. That is a security/UX fork: if the bytes are already on-device, Save is appropriate; if the product forbids exfil, set `img { -webkit-touch-callout: none; user-select: none; }` **and** provide no Share. Spec default: **allow Save** (the operator already saw the pixels on their phone); **do not** show the relay URL in any toast.
- Redacted vs error: different copy, different `data-state`, no retry on redacted. Reuse unknown-block voice: Inter, `--ink-muted`, no danger red unless `isError` from the **relay** (digest mismatch). Digest mismatch = `error` + `--danger` text `Preview failed a safety check.` (that *is* a security event).
- Animated GIF/APNG: if allowed by sanitizer, F6 **must not** autoplay if `prefers-reduced-motion: reduce` **or** if `accessibility.autoplay` analog — WebKit `img` has no pause. Spec: sanitizer **strips animation to first frame** for transcript thumbs; F6 of animated types is out of scope for v1 (fail closed to still). This also satisfies WCAG 2.2.2 / 2.3.1 without a pause control.

### 2.6 A11y checklist (executable)

- Card: react-aria `Button` wrapping the figure; `aria-label` as in the state table. Do not nest a second button for “expand.”
- F6: `Dialog` with `Heading slot="title"` visually hidden if chrome shows the same string (`sr-only` already exists).
- Focus: open → Close button (predictable); close → restore to the card (RAC default).
- Alt text: sanitizer-provided `alt` (operator/agent caption, redacted). Fallback `Screenshot`. Empty `alt` only if the adjacent assistant prose is a full equivalent **and** `aria-describedby` points at it — do not ship empty alt by default.
- Dynamic Type: captions use `rem`; do not cap `img` height in `px` only — `min(36vh, 17.5rem)` so 200% text still leaves a picture.
- Contrast: no `--ink-muted` text on the carbon scrim (too low). Overlay labels use `--ink-inverse` (`#f8f8f6` on `#121212`).
- Reduced motion: VT morph off; overlay dissolve 160 ms or instant if `animation: none` from the global hammer. Pinch still works (that is not decorative animation).
- `aria-live`: do **not** announce every inbound image (high frequency). Announce only when the user is **not** at the live edge (same pattern as `.scroll-badge`).

### 2.7 iPhone QA matrix (visual/motion)

Capture at **390 CSS px**, light and dark, `prefers-reduced-motion: no-preference` and `reduce`, PWA standalone:

1. Single landscape IDE screenshot in-flow (mat visible, no clay, serif prose above, action row below).
2. Single portrait iPhone screenshot (capped 36 vh, letterboxed mat).
3. Four-tile grid + F6 pager.
4. Open/close with Reduce Motion on (dissolve, no scale).
5. Pinch to 4×, swipe-down **must not** dismiss; Close must.
6. Pinch to 1×, swipe-down dismisses.
7. Virtualizer: scroll away and back — no jump, no re-fade.
8. Redacted vs network error — visually distinct.
9. Status bar color matches overlay.
10. VoiceOver: “Screenshot, 1440 by 900, image. Button.” → double-tap → “Screenshot, dialog.”

---

## 3. Divergent / minority ideas (do not converge yet)

1. **True-black darkroom (`#000`) in F6 even in light mode.** Photos.app does this; ink-on-parchment would lose identity. **Keep the 88% carbon scrim** so parchment still rims the screen. Revisit only if pixel inspection of near-black IDE themes fails AA for the close glyph.

2. **Editorial `<figure>` in the serif column** (no card, no hairline, caption in Source Serif italic). Distinctive, bookish, anti-Claude-card. **Risk:** screenshots of light UIs disappear on bone. Only viable with a 1 px `--line` still present — at which point it *is* a card.

3. **Cline-style session pager** (URL chrome + step back/forward + cursor) for *browser tool* screenshots. Correct for a browser sub-agent; **wrong** as the default inbound type. Keep as a future `data-variant="browser-session"`; do not ship the cursor.

4. **Always-on View Transition morph, even under Reduce Motion.** Violates Apple’s “replace zoom with dissolve.” Do not.

5. **No F6 at all — CSS `transform: scale` in-place in the transcript.** Avoids portal/VT bugs. **Fails** HIG full-screen media, fights the virtualizer, and cannot pinch without blowing layout.

6. **Auto-hiding F6 chrome** (Photos). Minority for power users; reject for v1 a11y.

7. **Clay “wax seal” pip on every inbound image.** Expressive, but accent-as-decoration. Limit to live-edge unread.

8. **`image-rendering: pixelated` at all zoom levels.** Looks “honest” for terminals; looks broken for photographs and at non-integer DPR. Keep the hybrid rule in §1.5.

9. **Filmstrip under F6** (thumbnail rail). Kimi grid already did the choice in-flow; a rail duplicates it and eats safe-area. Only if `count > 4`.

10. **Shared F6 with F5 outbound drafts** using the *same* morph name `inbound-image`. Name collision if both open. Use `view-transition-name: media-hero` as the shared token, one at a time.

11. **Static blur scrim (`backdrop-filter: blur(8px)`).** Within the design-system blur budget (≤ 8 px) but a full-viewport blur on iPhone is a battery/jank defect. Prefer opaque carbon mix.

12. **Announce inbound images in `aria-live="polite"`.** Helpful when the phone is in a pocket; catastrophic when pi dumps a screenshot every tool step. Gate on “user not at live edge.”

13. **Letterboxed `object-fit: cover` in `FigureCard`** (Instagram). Makes every screenshot a pretty tile; **crops evidence**. Forbidden for `FigureCard`; allowed only in `TileGrid`.

---

## 4. Open questions + risks

1. **F6 may not exist yet as code.** HANDOVER’s F-lane is foundation restyle; this repo has no lightbox. The “reuse F6” instruction is a **shared component contract**, not a found module. Build F6 as `ImageViewer` used by outbound F5 *and* inbound.

2. **View Transitions + RAC portal + virtualizer** is the highest visual-motion risk. If morph janks or the name collides with a recycled virtual row, **ship dissolve-only** without debate. Measure on a real iPhone, not Simulator.

3. **Aspect-ratio metadata** must ride the redacted block. Without it, `pending` cannot reserve height and the live edge jumps — that jump *is* motion, and it is the worst kind (layout thrash). If protocol review cuts `width`/`height`, fallback `16/10` will mis-letterbox portrait captures.

4. **Animated images** (GIF of a failing test). v1 still-frame is the safe visual; if product wants animation, F6 needs a pause control before first play (WCAG 2.2.2).

5. **HDR / Display P3 screenshots** from a Mac. iPhone PWA will tone-map; no CSS today exposes a “match host gamma” control. May look lifted. Out of scope; do not “correct” with filters (filters are a paint cost and a Reduce Motion cousin).

6. **Long-press Save Image** vs redaction posture. Visual freeze (`-webkit-touch-callout: none`) is easy; legal/security intent is not a motion question — flag to the security lens.

7. **`theme-color` already disagrees with `--canvas`.** F6 will make it obvious. Fix the shell values (`#f8f8f6` / `#181715`) in the same change or the overlay restore will flash the wrong bone.

8. **Multiple `view-transition-name`s on recycled rows.** Virtualizer reuse can leave a stale name on a cell that is now a different image. Clear the name in `onTransitionEnd` **and** on unmount.

9. **Swipe-down vs transcript scroll.** If F6 `touch-action` is wrong, the gesture leaks and the list moves under the overlay (iOS Safari classic). Test with `overscroll-behavior: none` on `html` only while open.

10. **Dark screenshot on dark mat** may fail 3:1 for the hairline. If `--line` `#3b3934` on `#1f1e1b` is < 3:1, bump the card border to `--line-strong` `#807a70` in dark only (that pair is already in the contrast inventory as control-border).

---

## 5. Sources

### This repo (ground truth for tokens, placement, protocol)

- `apps/pi-remote-web/src/style.css` — tokens, radii, durations, reduced-motion hammer, transcript typography, 44 px coarse targets, safe-area headers
- `apps/pi-remote-web/src/App.tsx` — `Block` kinds, collapsible vs promoted, `AssistantActions` attachment, unknown/redacted copy, `theme-color`
- `apps/pi-remote-web/src/turns.ts` — turn grouping (image kinds fall into the open turn automatically)
- `apps/pi-remote-web/tests/contrast.test.tsx` — WCAG pairs for ink/muted/accent-ink/control-border
- `packages/pi-rpc-protocol/src/types.ts` — outbound `ImageContent`; inbound kinds with **no** `image`
- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md` — Claude artifact card measurements
- `docs/design-reference/mobile-chat-apps/research-gpt-luna.md` — Claude/Kimi spacing, 44 pt, action-row gap
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md` — artifacts between prose and action row; no dead affordances
- `.claude/skills/sk-design/shared/register.md` — Product motion/color dials
- `.claude/skills/sk-design/sk-design-interface/references/motion/animation-decision-framework.md`
- `.claude/skills/sk-design/sk-design-interface/references/motion/motion-strategy.md`
- `.claude/skills/sk-design/sk-design-interface/references/motion/performance-reduced-motion.md`

### Apple / WCAG / WebKit / CSS

- https://developer.apple.com/design/human-interface-guidelines/motion
- https://developer.apple.com/design/human-interface-guidelines/modality
- https://developer.apple.com/design/human-interface-guidelines/sheets
- https://developer.apple.com/design/human-interface-guidelines/gestures
- https://developer.apple.com/design/human-interface-guidelines/scroll-views
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://www.w3.org/TR/WCAG22/
- https://webkit.org/blog/16967/two-lines-of-cross-document-view-transitions-code-you-can-use-on-every-website-today/
- https://developer.chrome.com/docs/web-platform/view-transitions/same-document
- https://github.com/WICG/view-transitions/blob/main/explainer.md
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering
- https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look
- https://react-aria.adobe.com/Modal
- https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/Modal.tsx

### Claude / Kimi (target bar)

- https://apps.apple.com/us/app/claude-by-anthropic/id6473753684
- https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
- https://www.anthropic.com/news/build-artifacts
- https://claude.com/blog/artifacts
- https://github.com/anthropics/claude-code/issues/61995
- https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312
- https://www.kimi.com/zh-cn/help/new-user-guide/overview
- https://github.com/MoonshotAI/kimi-cli/pull/1001
- https://github.com/MoonshotAI/kimi-cli/blob/main/web/src/components/ai-elements/tool.tsx
- https://github.com/xy200303/spec-kimi-code/commit/ec758c747a95555847b8a0275ed0809010c7d5e7

### Mobbin (real iOS screens; MCP not callable in this pass — public URLs)

- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 — Claude iOS chat detail
- https://mobbin.com/explore/screens/c0d820f1-2552-4731-aac3-8b3265b6ce52 — Claude iOS screen
- https://mobbin.com/explore/mobile/ui-elements/full-screen-overlay — full-screen overlay pattern cluster
- https://mobbin.com/explore/mobile/ui-elements/photo — photo / full-screen image cluster
- https://mobbin.com/ — library index (ChatGPT listed among featured apps)

### Remote-CLI / coding-agent GitHub prior art

- https://github.com/cline/cline/blob/main/webview-ui/src/components/chat/BrowserSessionRow.tsx
- https://mariozechner.at/posts/2025-11-30-pi-coding-agent/
- https://www.npmjs.com/package/@mariozechner/pi-agent-core
- https://github.com/MasuRii/pi-image-tools/
- https://github.com/ZiChuanLan/pi-image-placeholder
- https://docs.openwebui.com/features/
- https://github.com/Wide-Moat/open-computer-use/commit/b08d472d989a3cabfcfafaf968fb70cb6997325f

### iOS Safari overlay / viewport

- https://blog.openreplay.com/stop-page-scrolling-dialog-open/
- https://github.com/ng-primitives/ng-primitives/issues/758
- https://dev.to/deanliu/the-ios-safari-keyboard-scroll-bug-fixed-with-one-line-of-css-1353
- https://github.com/marcin2121/iOS-Shell-Fix
