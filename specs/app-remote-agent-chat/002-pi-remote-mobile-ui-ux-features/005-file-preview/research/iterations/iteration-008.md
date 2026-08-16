<!-- provenance: external-CLI orchestration pass; original file iter-08-grok.md -->
> **Source pass 8** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-8-grok.md`.

<!-- F6-file-preview | model=grok | lens=visual-motion | iter 8/10 | 2026-08-15T19:58:43.280Z -->

# Iteration 8 — Visual + motion polish for the Pi Remote artifact / file viewer

Lens: render a Claude-style artifact/file preview **inside the existing ink-on-parchment system** (light + dark), with iPhone-PWA-safe spacing, type, and restrained motion. Target bar: Claude iOS + Kimi Code. Stack constraint: React 19 + Vite + Tailwind 4 + `react-aria-components` `^1.11.0`, **no motion library in `package.json`**.

---

## 1. Findings (visual-motion)

### 1.1 The design system is already tokenized; the viewer must consume it, not Claude’s hex dump

Pi Remote light/dark tokens live in `apps/pi-remote-web/src/style.css` and are contrast-tested in `apps/pi-remote-web/tests/contrast.test.tsx`. The Claude iOS reconstruction uses warmer paper (`#F8F4ED` canvas, `#2D2520` ink) ([Meliwat/awesome-ios-design-md Claude DESIGN.md](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)). **Do not retarget the PWA canvas to Claude’s cream.** Map *roles* onto the locked palette:

| Role | Pi Remote token (light / dark) | Claude iOS analogue (do not copy hex) |
|---|---|---|
| Page / chat canvas | `--canvas` `#f8f8f6` / `#181715` | Cream paper `#F8F4ED` / warm dark `#1F1B16` |
| Elevated card / viewer chrome | `--surface` `#ffffff` / `--surface-raised` `#2b2925` | Paper White `#FBF9F4` / Dark Surface 1 `#2A2520` |
| Quiet fill (user pill, chips) | `--surface-muted` `#efeeeb` / `#302e2a` | Surface Warm 1 `#F0EAE0` |
| Primary text | `--ink` `#121212` / `#f4f1eb` | Ink `#2D2520` / `#E8E0D2` |
| Secondary / meta | `--ink-secondary` `#373734`, `--ink-muted` `#6c6a65` | Graphite `#5A4F44`, Stone `#8A7E72` |
| Hairline | `--line` `#e7e6e1` / `#3b3934` | Divider Sand `#DDD2BD` |
| Clay verb (never body text) | `--accent` `#d97757`, `--accent-ink` `#8a452f` / `#f0b19a` | Claude Orange `#D97757` |
| Code well | `--surface-code` `#0f0f0e` (both themes) | Warm dark `#1F1B16` |
| Diff tints | `--diff-add` `#e4eee7` / `#203129`, `--diff-remove` `#f3e5e2` / `#3a2522` | sage/terracotta, not GitHub blue |
| Press / overlay motion | `--duration-fast` `120ms`, `--duration-state` `220ms`, `--ease-out` `cubic-bezier(0.22, 1, 0.36, 1)` | Claude artifact morph **400ms spring**; sheets **300ms ease-out** |

WCAG AA pairs already proven for this palette: ink on canvas, ink-muted on canvas, accent-ink on canvas, action-fg on action-bg, all ≥ 4.5:1; control-border and focus ring ≥ 3:1 ([`contrast.test.tsx`](apps/pi-remote-web/tests/contrast.test.tsx); WCAG 1.4.3 / 1.4.11). **Do not introduce Claude’s `#2D2520` or `#F8F4ED` as new colors.**

Clay is a *verb*, not a fill: Claude’s own don’t-list forbids orange body text, headings, and dividers ([Claude DESIGN.md §7](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)). Pi Remote already follows this: `--accent` is send, plan chip, streaming dots; `--accent-ink` is the only clay *text*.

### 1.2 Claude iOS artifact UX is a two-surface system: inline card → full-screen document

Ground-truth from the repo’s teardown (Claude conversation screenshot) plus the reconstructed iOS design system:

- **Inline card** in the assistant turn: ~16px radius, hairline, near-canvas fill, **serif title + muted Inter subtitle** (`Piano MIDI Player` / `Interactive artifact`) + a small tilted thumbnail on the right; a centered `1 artifact` pill can sit above the turn ([`docs/design-reference/mobile-chat-apps/01-visual-teardown.md`](docs/design-reference/mobile-chat-apps/01-visual-teardown.md); [Mobbin Claude iOS Chat Detail](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8)).
- **Tap → iPhone full-screen modal** with the artifact *rendered* (not a diff dump). iPad analogue is a 40% side pane ([Claude DESIGN.md §4 Artifact Card](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)).
- **Motion:** “shared-element **400ms spring** — the inline card morphs into the full-screen modal” ([Claude DESIGN.md §6 Motion](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)).
- **Material:** no glass over chat content; warm paper shadows `rgba(40, 30, 20, x)`, not cool black; sheets use 24pt top corners; full-screen artifact sits at elevation Level 5 ([Claude DESIGN.md §6–7](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)).
- **Code, even on cream:** fenced blocks and code artifacts sit on **warm dark** `#1F1B16`, JetBrains Mono 14 / 1.5, **horizontal scroll, no wrap**, 12pt radius, language + copy in a 11pt header strip ([Claude DESIGN.md §4 Code Block](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)).

Pi Remote today: `file_diff` is an in-flow card with `--diff-add` / `--diff-remove` on a **dark** `<pre class="diff-patch">` (`--surface-code`), max-height `26rem`, no open-to-viewer, no image/PDF/text renderer ([`App.tsx` `case 'file_diff'`](apps/pi-remote-web/src/App.tsx); [`style.css` `.transcript-block pre`, `.diff-patch`](apps/pi-remote-web/src/style.css)). Assistant prose already uses `--font-display` (Source Serif 4) at `1.1875rem` / `1.62` — the viewer’s markdown/text body must match that, not Inter.

Mobbin corroboration (public screens; MCP was not connected in this pass):

- [Claude iOS Chat Detail](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8) — conversation chrome, not the artifact modal itself.
- [Claude iOS image-input flow](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1) — attachments stay *in chat*, then the reply is prose; images are not a code-viewer.
- [Claude **Web** Code Preview](https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3) — **segmented code | preview** + toolbar. That split is the web artifact pattern to port; iOS collapses it to full-screen with the same toggle in the header.
- [Claude Web Publish Artifact](https://mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7) — confirmation chrome; **out of scope** here (read-only, no publish).

ChatGPT Canvas is **not** the iOS bar: OpenAI documents canvas as Web / Windows / macOS, “coming soon” to iOS ([OpenAI Help: Canvas](https://help.openai.com/en/articles/9930697-what-is-the-canvas-featue-in-chatgpt-and-how-do-i-use-it)). Matching Claude iOS + Kimi Code is the correct pair.

### 1.3 Kimi Code’s inspectable viewer is a *kinded* panel, not a generic modal

Kimi Code web (`spec-kimi-code`) is the closest open implementation of the “Kimi Code app” file surface:

- **Kind enum:** `markdown | json | html | pdf | csv | image | text | binary` with MIME + extension + `languageId` detection ([`FilePreview.vue`](https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/components/FilePreview.vue)).
- **Preview vs source** for HTML and Markdown (`htmlMode` / `markdownMode` default preview; reset on file change).
- **Images:** `fit | actual`; wrap is a centered well with `object-fit: contain`.
- **Code:** table layout, **44px line-number gutter**, `white-space: pre`, search-hit + jump-to-line backgrounds.
- **Path:** CSS `direction: rtl` + ellipsis so the **filename stays visible** when the path is long.
- **Mobile ≤640px:** hide line-count chip; markdown padding `14px 16px`; code body `-webkit-overflow-scrolling: touch` so the gutter stays while the line scrolls sideways ([same file, mobile media query](https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/components/FilePreview.vue)).
- **PDF:** iframe; explicit `pdfNoPreview` fallback copy.
- **Binary:** card + mime + size, no fake renderer.
- **TUI:** full-screen takeover for approval diffs/writes; **snapshot lines once, slice by viewport** so per-frame cost is O(visible lines) ([commit 50251a1](https://github.com/xy200303/spec-kimi-code/commit/50251a136093c27c0d69a730b267b746dea47468); [`approval-preview.ts`](https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-code/src/tui/components/dialogs/approval-preview.ts)).

Pi Remote already has `@tanstack/react-virtual` — that is the React analogue of Kimi’s “render once, slice on scroll.” Do not syntax-highlight a 4k-line file into the live DOM.

### 1.4 Apple HIG: this is a *full-screen media/document* task, not a sheet of choices

- **Sheets** are for short, distinct tasks. For videos, photos, camera, or **document/photo viewing/editing**, HIG points at **full-screen modal** (`UIModalPresentationStyle.fullScreen`) and warns against stacking sheets ([Apple HIG — Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets); [Apple HIG — Modality](https://developer.apple.com/design/human-interface-guidelines/modality)).
- **Do not nest a viewer inside the existing composer popover.** One overlay, dismiss returns to the transcript.
- **44×44 pt** default control size on iOS; 28×28 is the documented minimum, not the target ([Apple HIG — Accessibility control sizes](https://developer.apple.com/design/human-interface-guidelines/accessibility); [Apple Design Tips — Hit Targets](https://developer.apple.com/design/tips/)). Pi Remote already uses `min-height: 2.75rem` (44px) under `@media (pointer: coarse)` and `session-header-icon` at `2.75rem`.
- **Full-screen media** extends to the display edge; **controls stay in the safe area** (Dynamic Island / home indicator) ([Apple HIG — Layout](https://developer.apple.com/design/human-interface-guidelines/layout)).
- **iOS 18 zoom transition:** the tapped cell *morphs* into the incoming view and is **continuously interactive** (grab mid-flight) for both navigation and `fullScreenCover` / sheets ([WWDC24 10145](https://developer.apple.com/videos/play/wwdc2024/10145/); [WWDC24 10118](https://developer.apple.com/videos/play/wwdc2024/10118/)). That is the native motion Claude’s 400ms shared-element is copying. A PWA cannot call UIKit; the web analogue is **same-document View Transitions**, supported in **Safari on iOS 18+** ([Can I use — View Transitions](https://caniuse.com/view-transitions); [Can I use — `startViewTransition`](https://caniuse.com/mdn-api_document_startviewtransition)).

### 1.5 Restraint gate: opening a file is *occasional*; scrolling it is *high-frequency*

From the interface motion packet ([`animation-decision-framework.md`](.claude/skills/sk-design/sk-design-interface/references/motion/animation-decision-framework.md); [`motion-strategy.md`](.claude/skills/sk-design/sk-design-interface/references/motion/motion-strategy.md)):

| Event | Frequency | Gate | Allowed motion |
|---|---|---|---|
| Open / close viewer | Occasional | Yes — orientation + spatial continuity | 300–500ms layout; exit ~75% of enter |
| Header button press | Tens/day | Feedback only | 100–150ms `scale(0.98)` already global |
| Scroll, pinch, search-next | 100+/day | **No** | Instant; compositor scroll only |
| Line highlight jump | Occasional | State indication | 120ms background-color, no translate |
| Streaming artifact growth | Continuous | **No** (would be decorative + vestibular) | In-place text; no morph restart |
| Loading skeleton / shimmer | Decorative | **No** | Static Inter caption |
| Copy confirm | Occasional | State | 150ms icon morph (Claude), not a bouncing toast |

Timing tokens already in the app (`120ms` / `220ms` / ease-out-quint `cubic-bezier(0.22, 1, 0.36, 1)`) match motion-strategy’s `--ease-out-quint`. **Do not add a bounce/overshoot curve.** React Aria’s default modal example uses `cubic-bezier(0.175, 0.885, 0.32, 1.275)` zoom — that overshoot is **wrong** for parchment ([React Aria Modal CSS](https://react-aria.adobe.com/Modal)).

Materials that survive the performance packet ([`performance-reduced-motion.md`](.claude/skills/sk-design/sk-design-interface/references/motion/performance-reduced-motion.md)): **transform + opacity only**. Blur ≤ 8px and short-lived. Claude’s don’t-list forbids glass over chat ([Claude DESIGN.md §7](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)). Pi Remote’s topbar already uses `backdrop-filter: blur(12px)` — **do not add a second full-viewport blur** under the viewer. Apple Reduce Motion explicitly flags **animated blur, scaling, z-axis depth, spinning** ([Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility); [App Store Connect Reduced Motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/)). Prefer cross-fade when Reduce Motion is on ([WWDC20 10020](https://developer.apple.com/videos/play/wwdc2020/10020/?time=315); `UIAccessibility.prefersCrossFadeTransitions`).

WCAG 2.3.3 Animation from Interactions (AAA, but the product already ships a global `prefers-reduced-motion` nuke) is satisfied by technique C39: the existing `@media (prefers-reduced-motion: reduce)` sets `animation-duration` / `transition-duration` to `0.01ms` on `*` ([`style.css` L2287–2299](apps/pi-remote-web/src/style.css); [WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)). Apple’s criterion is stricter than “delete all animation”: **keep a dissolve** so open/close still communicates hierarchy. Spec a reduced-motion path of **opacity-only 120ms** (or instant if the global nuke wins — both are compliant; the dissolve is the better HIG match).

### 1.6 Stack-specific motion: CSS + React Aria states, not Framer

`package.json` has **no** `motion` / `framer-motion`. React Aria overlays expose `[data-entering]` / `[data-exiting]` and **wait for the exit animation before unmount** ([React Aria Styling](https://react-aria.adobe.com/styling); [React Aria Modal](https://react-aria.adobe.com/Modal)). `ModalOverlay` sets `--visual-viewport-height` / `--visual-viewport-width` — required on iPhone when the keyboard is up ([React Aria Modal.mdx](https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/docs/Modal.mdx)).

Correct primitive:

```tsx
<ModalOverlay isDismissable className="artifact-overlay">
  <Modal className="artifact-modal">
    <Dialog>
      <Heading slot="title">{filename}</Heading>
      {/* kinded body */}
    </Dialog>
  </Modal>
</ModalOverlay>
```

Focus trap, restore-to-trigger, Escape, and scroll-lock are free. `isDismissable` is correct (this is not a confirmation). Do **not** set `isKeyboardDismissDisabled`.

View Transitions: `document.startViewTransition` on open/close with `view-transition-name: artifact-${id}` on the **card** and the **modal surface**. Feature-detect; if absent (iOS 17 PWA), fall back to RAC `[data-entering]` opacity + `translateY(12px)` (motion-strategy’s 12px exit hint). **Do not** mix View Transitions *and* a competing CSS transform on the same node.

### 1.7 Kind-specific surfaces are the non-obvious visual decision

One parchment overlay for everything will look like a settings sheet. Claude, Photos, and Kimi all change **the well**, not just the chrome:

| Kind | Well | Type | Motion personality |
|---|---|---|---|
| Markdown / plain text / CSV | `--canvas` (paper continues) | Source Serif 4 at assistant metrics for MD; Inter for CSV headers | Paper-page morph; **no dim**, or a 6% warm scrim |
| Code / JSON / HTML source | `--surface-code` (ink well) | `--font-mono` 0.8125rem / 1.65 | Morph into a dark well; chrome stays parchment |
| Unified diff | `--canvas` with `--diff-add` / `--diff-remove` rows (not the dark pre) | Mono | Same as text; **do not** put diffs on `#0f0f0e` (current clash: parchment tints on a cool black pre) |
| Image | Warm near-black `--surface-code` full bleed | n/a | Photos: chrome fades; swipe-down to close |
| PDF | `--canvas-subtle` | native Safari plugin chrome | No page-flip; vertical page scroll |
| Binary / unknown / redacted-empty | `--surface` card on `--canvas` | Inter | Instant; no morph of empty content |

This split is how you “look like Claude” without copying Tiempos or cream: **serif document on bone, code as a warm ink well, images as a dark stage.**

Current `--surface-code` `#0f0f0e` is **cool**. Claude insists on warm-dark, never blue-tinted ([Claude DESIGN.md §7](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)). Implement the well as `color-mix(in oklch, var(--surface-code) 92%, var(--accent) 8%)` so it stays in-token and picks up clay undertone. Default code text: `--ink-inverse` (`#f8f8f6`), **not** the current `oklch(0.9 0.012 255)` (that is a cool blue-grey on black). Syntax: keywords `--accent-strong` only after a contrast check against the well; comments `--ink-muted` on dark will fail AA — use `--ink-secondary` (`#d8d3ca` dark / a lightened mix on the well). **Do not paint keywords `--accent` `#d97757` until measured ≥ 4.5:1 on the well.**

### 1.8 Typography + spacing recipe (iPhone, this stack)

Locked faces: Inter (chrome, user, meta) + Source Serif 4 (authored reading) + `--font-mono` (code). Assistant body is already `font-family: var(--font-display); font-size: 1.1875rem; line-height: 1.62` ([`style.css` `.block-role-assistant .block-copy`](apps/pi-remote-web/src/style.css)). Claude’s iOS body is Tiempos 16pt / 1.55 with Dynamic Type; Source Serif 4 is the documented substitute ([Claude DESIGN.md §3](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)).

**Viewer type scale (map to existing `--space-*`):**

| Element | Face | Size | Weight | Color | Notes |
|---|---|---|---|---|---|
| Dialog title (filename) | Inter | 1rem (16px) | 620 | `--ink` | 1-line, RTL-ellipsis like Kimi |
| Subtitle (lang · bytes · “Redacted excerpt”) | Inter | 0.75rem | 550 | `--ink-muted` | Sentence case; no `uppercase` except existing `.surface-kicker` |
| Markdown body | Source Serif 4 | 1.1875rem | 400 | `--ink` | `max-width: var(--reading-width)` (66ch); padding `--space-4` |
| MD h2 / h3 | Source Serif 4 | 1.25rem / 1.0625rem | 620 | `--ink` | +12px / +4px Claude heading rhythm, mapped to `--space-3` / `--space-1` |
| Code / diff | `--font-mono` | 0.8125rem (13px) on 320–375, 0.875rem from 390 | 400 | `--ink-inverse` on well | `font-variant-numeric: tabular-nums` on gutters |
| Line gutter | mono | 0.68rem | 550 | `--ink-muted` on well (verify ≥ 4.5:1) | sticky 2.75rem column (44px) |
| Chrome icons | currentColor | 20px glyph in 44px hit | — | `--ink-secondary` | match `.session-header-icon` |
| Segmented Preview/Source | Inter | 0.78rem | 650 | selected = `--ink` on `--surface-muted` | reuse `.theme-control` / `.theme-option` geometry, **not** clay fill |

Spacing: 4pt base already (`--space-1` = 0.25rem). Card padding 16px (`--space-4`). Viewer header: `padding-top: max(var(--space-2), env(safe-area-inset-top))` like `.session-header`. Horizontal margin 16px on iPhone (`--space-4`), not Claude’s 20pt — stay on the token scale. Bottom chrome: `padding-bottom: max(var(--space-3), env(safe-area-inset-bottom))`.

Radius: cards `--radius-md` (0.75rem ≈ 12px, Claude artifact 12pt). Viewer itself: **0 on iPhone full-screen** (true full-screen, not a 24pt sheet). If a 92% “page” variant is used (divergent), top corners `--radius-lg` (1rem), not iOS sheet 24pt — 24pt reads as Settings, not parchment.

Shadows: replace cool `--shadow-raised: 0 4px 20px rgb(0 0 0 / 4%)` **on this surface only** with warm `0 4px 16px color-mix(in oklch, var(--ink) 10%, transparent)` so elevation stays ink-on-paper ([Claude DESIGN.md §6](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)). Dark: existing `rgb(0 0 0 / 24%)` is acceptable (warm mix is invisible on `#181715`).

### 1.9 Prior art in remote-CLI / coding-agent clients (visual takeaway)

| Project | Viewer shape | Motion / mobile note |
|---|---|---|
| [xy200303/spec-kimi-code](https://github.com/xy200303/spec-kimi-code) `FilePreview.vue` | Kinded panel, preview/source, RTL path, 44px gutter | Mobile: sideways code scroll + touch momentum |
| [xy200303/spec-kimi-code](https://github.com/xy200303/spec-kimi-code) TUI `ApprovalPreviewViewer` | Full-screen snapshot, O(viewport) slice | Chose full-screen *because* inline expand fought the parent scroller |
| [dibstern/conduit](https://github.com/dibstern/conduit) | “File browser with breadcrumbs, **preview modal**, live reload”; PWA | Modal, not a route; mobile-first OpenCode relay |
| [threehymns/opencode-webui](https://github.com/threehymns/opencode-webui) | Syntax-highlighted file preview, **virtualization for large files**, unified git diff | Explicit large-file virtualization |
| [chriswritescode-dev/opencode-manager](https://github.com/chriswritescode-dev/opencode-manager) | Tree + highlighting, iOS-optimized PWA | File ops are out of scope (Pi Remote is read-only) |
| [1amageek/swift-artifact](https://github.com/1amageek/swift-artifact) | `ArtifactCard` vs `ArtifactCanvas`; streaming partial render | Card chrome ≠ canvas chrome — split the components |
| [AIpine](https://apps.apple.com/us/app/aipine/id6775947157) | Preview **and** source for Claude/ChatGPT artifacts | Confirms the segmented control as the mobile convention |
| [anthropics/claude-code#78792](https://github.com/anthropics/claude-code/issues/78792) | Mobile Artifacts list **omits** Claude Code artifacts | Discovery ≠ preview; don’t copy Claude’s mobile gap |

**Takeaway:** every serious coding-agent client that works on a phone **leaves the transcript** for the file. Inline max-height `26rem` diffs (current Pi Remote) are the thing Kimi TUI *abandoned*.

---

## 2. Concrete spec a build phase can execute

### 2.1 Components (visual, not architecture)

1. **`ArtifactCard`** — in-flow, inside the owning assistant turn, *between* serif prose and `.turn-actions`. Not a transcript “File diff” header card.
2. **`ArtifactViewer`** — one `ModalOverlay` + `Modal` + `Dialog` for all kinds; body swaps a kind renderer.
3. **Kind renderers:** `TextMarkdownView`, `CodeView`, `DiffView`, `ImageView`, `PdfView`, `BinaryView`. No HTML-execute / React-iframe (security posture: show what the relay sent; HTML is **source** unless a future ticket allows sandboxed preview).

### 2.2 Inline card (collapsed)

**Layout (390pt iPhone):**

```
[ 12px pad ]
  Title     Source Serif 4 17px/1.3  --ink     1 line
  Meta      Inter 12px/1.3           --ink-muted   "{kind} · {bytes or line count}"
  Thumb     40×40, 8px radius, 6° rotate, --accent-soft fill, --accent-ink glyph
[ hairline --line ]
  Peek      first 5–6 lines OR 72px image thumb OR “PDF · n pages” 
            OR redacted caption. Max-height 7.5rem. Fade mask last 16px
            using linear-gradient to --surface (not a gradient brand wash).
```

- Size: full prose column, `border: 1px solid var(--line)`, `border-radius: var(--radius-md)`, `background: var(--surface)`, `box-shadow: var(--shadow-raised)` (warm mix as in 1.8).
- Hit: entire card is one `Button` / RAC `Pressable`; **min-height 44px**; `aria-label="Open preview, {filename}, {kind}"`.
- Press: existing global `transform: scale(0.98)` (`style.css` `button:active`). Under reduced motion the global nuke already kills it.
- Clay: **none** on the card except optional 2px top hairline on `--accent` at **0 opacity until hover/press** (same pattern as `.session-card::after`). Default state is parchment, not a terracotta frame.
- Diff cards: peek uses `--diff-add` / `--diff-remove` on **`--canvas`**, not `--surface-code`.
- Redaction: if the relay sent a stub, peek is Inter `--ink-muted` “Redacted excerpt — open to read what the host sent.” No warning-orange banner.

### 2.3 Viewer chrome (open)

**Header (sticky, parchment, no blur):**

```
[ safe-area-top ]
[ 44px row ]  Close (x)     Filename (Dialog title)     Share
[ 32px row ]  optional: [ Preview | Source ]   optional: Wrap
[ hairline --line ]
```

- Background: `var(--canvas)` (document) or `var(--surface)` over an ink well (code/image). **`backdrop-filter: none`.**
- Close / Share: copy `.session-header-icon` (2.75rem circle, transparent, `--surface-muted` on `[data-hovered]`).
- Filename: Inter 16/620, RTL ellipsis, `Heading slot="title"`.
- Share: visible only if `navigator.canShare` succeeds for this payload ([MDN `Navigator.share`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share); [web.dev Web Share](https://web.dev/articles/web-share)). iOS: **do not** pass `url` + `files` together; call `share()` as the first `await` in the click handler ([Web Share iOS notes](https://www.webshareapi.com/web-share-api-security-contexts/browser-support-matrix-for-web-share-api/)). Fallback: Copy (already in turn actions).
- Preview | Source: only for `markdown` and `html`. Visual clone of `.theme-control` (hairline pill, selected = `--ink` on `--ink-inverse` **or** `--surface-muted` + `--ink` — **not** clay). Default Preview for markdown; Source for html (no execute).
- Focus: RAC moves focus into the Dialog; first tab stop = Close. `aria-describedby` points at a visually-hidden “Preview. {kind}. Showing only content the relay sent.”

**Body:**

- Height: `height: var(--visual-viewport-height)` minus header; `overflow: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch`.
- `100dvh` is wrong once the iOS keyboard or Safari chrome moves; RAC’s `--visual-viewport-height` is the spec ([React Aria Modal](https://react-aria.adobe.com/Modal)).

**Footer:** none. Close is in the header. Home indicator padding only.

### 2.4 Kind renderers (visual + motion)

**Markdown / text**

- `--canvas` well, Source Serif body as §1.8, `--reading-width`, padding `--space-4`.
- Tables/code fences inside MD: code fence uses the ink well (nested), 12px radius, 16px pad — same as transcript `pre` but with `--ink-inverse` text.
- Motion: none while scrolling.

**Code / JSON**

- Full-bleed ink well. Sticky gutter 44px, `border-inline-end: 1px solid color-mix(in oklch, var(--ink-inverse) 12%, transparent)`.
- `white-space: pre` + horizontal scroll (Claude + Kimi). Wrap toggle in header for 320px devices (see §3).
- Virtualize with `@tanstack/react-virtual` above ~200 lines (Kimi TUI lesson).
- Jump-to-line: `--accent-soft` row background, **no scroll-behavior: smooth** when `prefers-reduced-motion` (already global).
- Syntax: keep it to 4 token colors max, all AA-checked. If untested, ship **unstyled** `--ink-inverse` rather than pretty-but-illegal clay keywords.

**Diff**

- Stay on `--canvas`. Each line `min-height: 1.55em`, padding-inline `--space-4`. `+` rows `--diff-add`, `-` rows `--diff-remove`, context transparent. Gutter optional.
- **Do not** use the current `.diff-patch` cool oklch greens/reds on `#0f0f0e`.

**Image**

- Well: ink (`--surface-code` warm mix), image `object-fit: contain`, max 100% × 100%.
- Chrome: same header, but header background `color-mix(in oklch, var(--surface-code) 92%, var(--canvas) 8%)`, icons `--ink-inverse`.
- Gestures: pinch-zoom via CSS `touch-action: pinch-zoom` on the img **or** a transform-based pan if you need swipe-down-to-close coexistence. Swipe-down to dismiss only when `scale === 1` and `translationY > 24%` of viewport **or** velocity > 0.6 px/ms; otherwise rubber-band back (transform only). Reduced motion: swipe-down disabled; Close only.
- No Ken Burns, no fade-loop.

**PDF**

- `<object>` / `<iframe>` with `type="application/pdf"` first (Safari native). If it fails, Inter empty state + Share (Kimi `pdfNoPreview`).
- No page-curl. No pdf.js unless a later ticket accepts the weight.

**Binary / unknown / empty redaction**

- Centered `--surface` card, `--radius-md`, Inter 16 `--ink` title, 14 `--ink-muted` mime · size, Share if `canShare`.

### 2.5 Open / close choreography

**Default (motion allowed):**

1. Card press 120ms scale 0.98 (existing).
2. **Enter 380ms** `--ease-out` (`cubic-bezier(0.22, 1, 0.36, 1)`):
   - Preferred: `document.startViewTransition` morphing `view-transition-name`.
   - Fallback: overlay opacity 0→1 **200ms**; modal `translateY(12px)` + opacity 0→1 **380ms**. Overlay fill: `color-mix(in oklch, var(--ink) 28%, transparent)` for image/code; **`color-mix(in oklch, var(--canvas) 0%, transparent)` (no dim)** for markdown/text so the page feels like it *became* the file.
3. Chrome (header icons): opacity 0→1 starting at **t=80ms**, duration 200ms (staging: content first, chrome second) ([motion-strategy staging](.claude/skills/sk-design/sk-design-interface/references/motion/motion-strategy.md)).
4. **Exit 280ms** (~75%): chrome fades 120ms first, then surface `translateY(12px)` + opacity; overlay fades. RAC `[data-exiting]` keeps the node mounted ([React Aria Styling](https://react-aria.adobe.com/styling)).

**Reduced motion / `prefers-reduced-transparency`:**

- Skip View Transition, skip translate, skip any blur.
- Instant swap **or** 120ms opacity-only (HIG cross-fade).
- Overlay: solid `--canvas` / `--surface-code`, never `backdrop-filter`.

**Do not animate:** keyboard (none), virtualized row recycle, streaming token growth, search-match cycling, pinch frame updates (gesture-driven tracking is allowed by HIG — “track animations directly with people’s gestures” ([Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility))).

### 2.6 Gestures and alternatives (every gesture needs a button)

| Gesture | When | Alternative |
|---|---|---|
| Tap card | Always | Card is a button; also an “Open” text control in the card footer on first ship if discoverability is a concern (Claude card has Open) |
| Escape / Close | Always | RAC default |
| Tap overlay | `isDismissable` — only if overlay is visible (image/code dim). Markdown no-dim: Close only | Close |
| Swipe down | Image at scale 1; optional on markdown if scrollTop === 0 and dy > 80 | Close |
| Pinch | Image | Fit/Actual toggle (Kimi) in header |
| Horizontal pan | Code `pre` | Wrap toggle |
| Share tap | `canShare` | Copy |

iOS edge-swipe-back: **do not** attach a left-edge dismiss; it fights Safari. Overscroll-behavior contain on the body.

### 2.7 A11y (AA, iPhone VoiceOver, Dynamic Type)

- `Dialog` + `Heading slot="title"` (RAC names the dialog) ([React Aria Dialog](https://react-aria.adobe.com/Dialog)).
- Focus trap + restore to the card (RAC). The card must remain in the virtualized transcript **mounted** or restore will fail — keep a non-virtualized trigger ref.
- WCAG 2.5.8: 24×24 minimum AA; **ship 44×44** to meet Apple + WCAG 2.5.5 spirit ([WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum); [Apple 44pt](https://developer.apple.com/design/tips/)).
- Focus ring: existing `outline: 3px solid var(--focus); outline-offset: 3px`.
- Images: `alt` = relay caption or filename; empty alt only if decorative (never for the main preview).
- Code `<pre aria-label="{filename} source, {n} lines">` — do not expose each gutter as a button.
- Markdown: real `h2`/`h3` for the VoiceOver rotor.
- Contrast: no `--ink-muted` `#6c6a65` on `--surface-code`. No `--accent` as running text.
- `prefers-reduced-motion` path in §2.5. `prefers-contrast: more`: hairline → `--line-strong`, increase overlay opacity to 0.5.
- `forced-colors`: `border: 1px solid CanvasText` on card and header; drop shadows.
- Dynamic Type: markdown/text scale with the document (use `rem`). Chrome 44px row stays px/rem-fixed like Claude’s model chip ([Claude DESIGN.md Dynamic Type](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)). Code max ~18px.
- Announce open: dialog title is enough; do not `aria-live` the file body.
- Haptics: **none**. Vibration API is not a reliable iOS Safari PWA feature; Claude’s `.impactOccurred` is native-only.

### 2.8 Dark mode

- Same component, token-driven. Do not invert images (`color-scheme` already on `:root`).
- Code well is already dark in both themes — **do not lighten it in dark mode**. Header over the well uses `--surface-raised` + `--ink`.
- Image well: `#0f0f0e` / warm mix in both themes so photos don’t sit on bone.
- Diff tints already flip (`--diff-add` `#203129` in dark) — use those, not a second palette.
- Overlay dim in dark: `color-mix(in oklch, #000 55%, transparent)` (existing `--shadow-raised` dark is 24% — too weak for a dim).

### 2.9 States checklist

| State | Visual | Motion |
|---|---|---|
| `collapsed` | Card as §2.2 | none |
| `pressed` | scale 0.98 | 120ms |
| `opening` | morph or 12px rise | 380ms |
| `open.md` | parchment page | chrome delay 80ms |
| `open.code` | ink well | same |
| `open.image` | ink stage, contain | chrome delay; optional chrome auto-hide after 2s idle (Photos). Reduced motion: chrome always on |
| `open.pdf` | native plugin | none |
| `loading` | Inter `--ink-muted` “Loading preview” centered; existing `.composer-spinner` **forbidden** (infinite). Optional static clay 8px glyph, no pulse | none |
| `error` | `--danger-soft` / `--danger` inline, same as `.inline-alert` | none |
| `redacted` | body shows relay text; caption `--ink-muted` | none |
| `copied` | Share/Copy icon → check, `--success`, 1200ms then revert (Claude copy) | 150ms icon; no toast over the composer |
| `closing` | reverse | 280ms |
| `reduced-motion` | cross-fade or instant | ≤120ms opacity |

---

## 3. Divergent / minority ideas (do not collapse to “a sheet”)

1. **Paper-page lift, not an iOS sheet.** Full-screen with **0 radius** and **no dim** for text/markdown so the chat *becomes* the document. Bottom-sheet grabbers read as Settings. HIG full-screen is for documents ([HIG Modality](https://developer.apple.com/design/human-interface-guidelines/modality)); Claude’s own sheet is reserved for the *model picker*, not artifacts ([Claude DESIGN.md](https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md)).

2. **Kinded wells** (parchment vs ink vs photo stage) instead of one `--surface` modal. This is the highest-leverage brand move and is *not* what Conduit’s generic “preview modal” does ([dibstern/conduit](https://github.com/dibstern/conduit)).

3. **View Transition morph as the primary motion**, RAC 12px fade as fallback. Matching iOS 18 zoom ([WWDC24 10145](https://developer.apple.com/videos/play/wwdc2024/10145/)) and Claude’s 400ms shared-element — not a fade-up sheet.

4. **Wrap-by-default on `max-width: 39rem`** with a Wrap/Scroll toggle. Claude and Kimi both prefer horizontal `pre` scroll; on a 320px PWA, two-axis scroll is the #1 jank/vestibular trap. Minority: wrap first, “No wrap” for power users.

5. **Diff is a tab, not the file.** Opening a `file_diff` card shows **File | Diff**. Primary = post-change file (if the relay sent it); Diff is secondary. Today’s UI inverts that.

6. **Header chrome delay / image chrome auto-hide.** Staging is specified in motion-strategy; Photos-style auto-hide is *not* in Claude. Use auto-hide only for images, never for code (gutters need the header).

7. **No `backdrop-filter` anywhere in the viewer**, even though the session header already blurs. Claude forbids glass on content; Reduce Motion / Reduce Transparency both punish blur ([Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)).

8. **Warm-mixed `--surface-code`** instead of painting a new `#1F1B16` token. Stays inside the locked system while fixing the cool-black code well.

9. **Skip syntax highlighting v1.** Ship AA-safe mono on the ink well; add tokens only after contrast tests. Pretty-but-illegal clay keywords are a WCAG fail.

10. **92% “floating page”** with 8% canvas margin (magazine) instead of true full-screen. Distinctive, but fights HIG “extend content to the edges” ([HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout)) and shrinks reading width. Keep as an iPad-width experiment only.

11. **Interactive dismiss mid-morph** (iOS 18 zoom). Possible with View Transition types + pointer capture; high implementation risk in RAC portals. Don’t block v1 on it.

12. **Peek as a live `<canvas>` thumbnail** of the first paint (tilted 6°, Claude teardown) vs a static glyph. Cost: still-capture on first layout. Glyph is safer; thumbnail is the Claude tell.

13. **CSV as Source Serif table** (document) vs mono spreadsheet (Kimi). Minority: serif tables look editorial but scan worse; keep Inter/mono for CSV.

14. **Forced preview of HTML in a sandboxed iframe** (Claude web, AIpine, swift-artifact `ArtifactWebRenderer`). **Conflicts with fail-closed security** unless a later ticket defines CSP. Default Source.

---

## 4. Open questions + risks

1. **View Transitions vs RAC portals.** `Modal` portalled to `document.body` may not share a `view-transition-name` with a virtualized card inside `.transcript-scroll`. If morph fails in Safari 18 PWA, ship the 12px fallback and treat morph as progressive enhancement. Unverified in this pass.

2. **`--visual-viewport-height` vs `100dvh` vs iOS standalone PWA status bar.** Must be tested in `display-mode: standalone` with Dynamic Island. Wrong height clips Share or leaves a bone gap.

3. **Swipe-down vs vertical code/markdown scroll.** Gesture competition is the main UX risk (Kimi TUI left inline expand for this reason). Spec: swipe-down only for images at scale 1, and for text only at `scrollTop === 0`.

4. **Two-axis `pre` scroll on iOS.** Known Safari jank. Wrap-default (§3.4) is the mitigation; verify on a physical iPhone, not Simulator only ([motion-strategy: test on lowest device](.claude/skills/sk-design/sk-design-interface/references/motion/performance-reduced-motion.md)).

5. **Syntax color AA on the ink well.** `--accent` `#d97757` on `#0f0f0e` is unproven in `contrast.test.tsx`. Until added to that file, do not use clay for keywords.

6. **PDF in WKWebView / standalone Safari.** `<iframe>` PDF chrome is OS-controlled and may ignore parchment. Fallback copy must not look like an error if Safari just doesn’t embed.

7. **Share of redacted payloads.** Sharing can make a stub look like the whole file. Caption must travel in `text:` of `ShareData`, and Share is hidden if the payload is a redaction placeholder.

8. **Focus restore into a virtualized list.** If the card unmounts while the modal is open, RAC restores to `body`. Keep the triggering card’s node or a sentinel.

9. **Global reduced-motion nuke** (`transition-duration: 0.01ms !important` on `*`) will also kill the 120ms HIG cross-fade unless the viewer uses a class that re-enables opacity transitions under the same media query. Decide: live with instant, or add an exception `.artifact-overlay { transition-duration: 120ms }` inside the reduce block.

10. **Claude mobile still under-serves coding artifacts** ([claude-code#78792](https://github.com/anthropics/claude-code/issues/78792)). Matching Claude iOS *chat* artifacts is right; matching Claude iOS *Code* artifacts may mean copying a hole. Prefer Kimi Code’s kinded FilePreview for coding payloads.

11. **Mobbin MCP was unavailable** in this session (no MCP servers). Screen citations are public Mobbin URLs + the repo’s local teardown. A later pass with authenticated Mobbin should pull the actual iOS artifact-open flow frames if they exist; several public hits are chat-detail, not the modal.

12. **Do not add `framer-motion`.** It would violate the current dependency set and the performance packet’s “don’t mix animation systems.”

---

## 5. Sources

### In-repo
- [`apps/pi-remote-web/src/style.css`](apps/pi-remote-web/src/style.css) — tokens, type, motion, reduced-motion nuke, diff/code wells
- [`apps/pi-remote-web/tests/contrast.test.tsx`](apps/pi-remote-web/tests/contrast.test.tsx) — WCAG pair inventory
- [`apps/pi-remote-web/src/App.tsx`](apps/pi-remote-web/src/App.tsx) — `file_diff` / `DiffPatch` current UI
- [`apps/pi-remote-web/package.json`](apps/pi-remote-web/package.json) — RAC 1.11, no motion lib, tanstack-virtual
- [`docs/design-reference/mobile-chat-apps/01-visual-teardown.md`](docs/design-reference/mobile-chat-apps/01-visual-teardown.md) — Claude iOS artifact card measurements
- [`docs/design-reference/mobile-chat-apps/02-current-ui-map.md`](docs/design-reference/mobile-chat-apps/02-current-ui-map.md)
- [`docs/design-reference/mobile-chat-apps/council-gpt-sol.md`](docs/design-reference/mobile-chat-apps/council-gpt-sol.md) — artifact-card acceptance notes
- sk-design motion: [`animation-decision-framework.md`](.claude/skills/sk-design/sk-design-interface/references/motion/animation-decision-framework.md), [`motion-strategy.md`](.claude/skills/sk-design/sk-design-interface/references/motion/motion-strategy.md), [`performance-reduced-motion.md`](.claude/skills/sk-design/sk-design-interface/references/motion/performance-reduced-motion.md)

### Mobbin (public)
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 — Claude iOS Chat Detail
- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 — Claude iOS image-input flow
- https://mobbin.com/explore/screens/448b88ea-3923-427c-aead-5488541ff56e — Claude iOS
- https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3 — Claude Web Code Preview (segmented preview)
- https://mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7 — Claude Web Publish Artifact
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 — ChatGPT iOS chat (composer, not canvas)
- https://mobbin.com/explore/screens/5e55dde4-61e8-4f5d-95c0-7a9da129ec91 — ChatGPT iOS main

### Apple / WCAG / web platform
- https://developer.apple.com/design/human-interface-guidelines/sheets
- https://developer.apple.com/design/human-interface-guidelines/modality
- https://developer.apple.com/design/human-interface-guidelines/layout
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://developer.apple.com/design/tips/
- https://developer.apple.com/videos/play/wwdc2024/10145/
- https://developer.apple.com/videos/play/wwdc2024/10118/
- https://developer.apple.com/videos/play/wwdc2020/10020/?time=315
- https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- https://caniuse.com/view-transitions
- https://caniuse.com/mdn-api_document_startviewtransition
- https://react-aria.adobe.com/Modal
- https://react-aria.adobe.com/Dialog
- https://react-aria.adobe.com/styling
- https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/docs/Modal.mdx
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Share_data_between_apps
- https://web.dev/articles/web-share

### Claude / Kimi / coding-agent clients
- https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/claude/DESIGN.md
- https://github.com/anthropics/claude-code/issues/78792
- https://www.getmasset.com/resources/claude-artifacts-for-marketers
- https://help.openai.com/en/articles/9930697-what-is-the-canvas-featue-in-chatgpt-and-how-do-i-use-it
- https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/components/FilePreview.vue
- https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/composables/useFilePreview.ts
- https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-code/src/tui/components/dialogs/approval-preview.ts
- https://github.com/xy200303/spec-kimi-code/commit/50251a136093c27c0d69a730b267b746dea47468
- https://github.com/dibstern/conduit
- https://github.com/threehymns/opencode-webui
- https://github.com/chriswritescode-dev/opencode-manager
- https://github.com/Shahfarzane/opencode-mobile/
- https://github.com/1amageek/swift-artifact
- https://apps.apple.com/us/app/aipine/id6775947157
