<!-- provenance: external-CLI orchestration pass; original file iter-10-grok.md -->
> **Source pass 10** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-10-grok.md`.

<!-- F6-file-preview | model=grok | lens=interaction-gesture | iter 10/10 | 2026-08-15T20:07:46.958Z -->

# Interaction + gesture design — Pi Remote artifact/file viewer  
**Lens:** every state, transition, touch target, long-press, swipe, keyboard, focus order, micro-interaction  
**Pass:** independent deep-research iteration 10 of 10 (do not converge on “full-screen modal + swipe-down”)  
**Stack lock:** installable iPhone PWA, React 19 + Vite + Tailwind 4 + react-aria-components, ink-on-parchment, WCAG AA, read-only / redaction-aware

---

## 1. Findings (lens-specific, cited)

### 1.1 The failure that actually traps iPhone PWA users is not “missing swipe-down”

On an installed iOS PWA, a full-screen file overlay that is **not** a history entry, whose close control sits under the status bar / Dynamic Island, and whose backdrop uses a plain `click` with no `cursor: pointer`, is un-exitable without force-quitting. That combination shipped and was fixed in `ncvgl/slawk` PR #168: close `X` at `top-4` with **no** `env(safe-area-inset-*)`, plus iOS Safari not firing `click` on a non-cursor element ([GitHub slawk#168](https://github.com/ncvgl/slawk/pull/168)).

Pi Remote already pads some chrome with `env(safe-area-inset-top|bottom)` in `apps/pi-remote-web/src/style.css`, but `apps/pi-remote-web/index.html` sets:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

There is **no** `viewport-fit=cover`. Without it, WebKit commonly resolves `env(safe-area-inset-*)` to `0`, which is exactly how a 44×44 close control ends up under the island. A second, version-specific trap: iOS 26.1 standalone PWA has a documented WebKit regression where `env(safe-area-inset-top)` returns `0` even when it should not ([chronosnap workaround](https://github.com/kernelkaribou/chronosnap/commit/e36f4c1b2c043d030ea794a1b0d5c4a4594a4eb3)).

**Implication for this feature:** the close target is a safe-area + hit-testing problem first, a gesture problem second.

### 1.2 iOS already owns “swipe to go back.” A PWA cannot disable it, and must not fight it

Safari / home-screen WebKit implements a system **swipe-from-left-edge** back-forward navigation gesture. There is **no** JS API to turn it off in a PWA. The only WKWebView knob (`allowsBackForwardNavigationGestures`) is unavailable to Safari and standalone PWAs ([Ionic #22299](https://github.com/ionic-team/ionic-framework/issues/22299); [W3C manifest#1041](https://github.com/w3c/manifest/issues/1041)). WebKit’s own guidance to Ionic: the practical control is the **history stack** — `pushState` enables the gesture, `replaceState` does not.

Pi Remote **already** uses History API for session navigation (`pushState` to `/session/:id`, `popstate` listener in `App.tsx`). That is the native close channel for a viewer:

- Open viewer → `pushState` a child path (e.g. `/session/:id/file/:blockId`).
- iPhone edge-swipe / hardware Back / VoiceOver escape / RAC Escape → `popstate` closes the viewer **and stays in the session**.
- If the viewer is **only** a React overlay with no history entry, the same edge-swipe **leaves the session** (or double-animates overlay + route). That is the Ionic “two swipe-backs fire at once” failure, now applied to this app.

**Divergent from the usual chat-app copy:** do **not** add a custom full-width swipe-down-to-dismiss *and* also sit on the session history stack. You will get two dismiss physics on one finger.

### 1.3 Apple’s gesture vocabulary (what “native” actually means)

Apple HIG **Gestures** maps the verbs this surface will use ([HIG Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)):

| Gesture | HIG common action | Viewer mapping |
|---|---|---|
| Tap | Activate / select | Open card; Close; Share; zoom ± |
| Touch and hold | Contextual menu | Card: Open / Share / Copy. Image: system callout or custom menu. Code: **do not steal** selection |
| Double tap | Zoom in; zoom out if already zoomed | Images/PDF only, origin at tap. Not on code (selects a word in editing contexts) |
| Swipe | Reveal actions; **dismiss views**; scroll | **Dismiss = system edge-swipe via history.** Content swipe = scroll/pan |
| Pinch | Zoom a view | Images/PDF. Forbidden as the *only* zoom (WCAG 2.5.1) |
| Drag | Move a UI element | Pan when zoom > 1. Not a close gesture while zoomed |

HIG **Sheets** adds a second, conflicting vocabulary: people expect to **swipe vertically to dismiss** a sheet; Cancel is **leading**, Done is **trailing**; a **grabber** exists only on **resizable** sheets; compose-like full-height sheets (Mail, Messages) **omit** the medium detent ([HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)). A code/PDF/image reader is **not** a compose sheet. Grabber + pinch-zoom + vertical code scroll in one surface is a gesture-arena collapse.

HIG **hit targets** are **44×44 pt**, visual size may be smaller ([Apple UI tips](https://developer.apple.com/design/tips/)). WCAG 2.2 AA is weaker: **24×24 CSS px** (2.5.8) ([Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)). For an iPhone PWA targeting Claude/Kimi *feel*, **44 pt is the build bar**, 24 px is the legal floor.

### 1.4 WCAG AA is a gesture spec, not a caption spec

These SCs are load-bearing for this lens:

- **2.5.1 Pointer Gestures (A):** any multipoint (pinch) or path-based (swipe-to-next, swipe-to-close) action needs a **single-pointer, non-path** alternative — visible Close, Prev/Next, zoom ± ([Understanding 2.5.1](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html)).
- **2.5.2 Pointer Cancellation (A):** activate on **up-event**; sliding off a control cancels. `touchstart`/`pointerdown` must not open, share, or close ([Understanding 2.5.2](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html)). Pi Remote already uses RAC `onPress` / native `click` and `button[data-pressed] { transform: scale(0.98) }` — keep that contract.
- **2.5.7 Dragging Movements (AA):** swipe-down-to-dismiss **is dragging**. It is legal only if Close (and history Back) exist. The drag itself must be **abortable** by releasing below threshold ([Understanding 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)).
- **1.4.4 Resize text (AA):** `touch-action: none` on the page, or `user-scalable=no`, fails low-vision zoom ([MDN touch-action a11y note](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)). Custom image pinch is allowed **if** ± controls exist and the **document** remains user-scalable.
- **2.1.1 Keyboard (A) / 2.4.3 Focus Order / 2.4.7 Focus Visible:** RAC Modal already: focus in on mount, trap, restore on unmount, Escape closes unless `isKeyboardDismissDisabled` ([React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)).

VoiceOver on iPhone: **two-finger Z (scrub) = Escape** to dismiss a modal or pop a nav level ([Deque VO iOS](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts); Apple `accessibilityPerformEscape` analog). RAC Dialog + real `role="dialog"` + Escape handler is how a PWA gets that for free. A `div` overlay with a custom swipe and no dialog role will **not** scrub-dismiss.

### 1.5 What Claude iOS actually does (and what it does not)

Local teardown of Claude iOS (`docs/design-reference/mobile-chat-apps/01-visual-teardown.md`) is the grounded card anatomy: ~16 px radius, hairline, title + muted subtype, **tilted thumbnail**, optional `1 artifact` pill, **tap the card** (not a nested “Open” chip) as the primary.

Official Claude: Artifacts are a **dedicated window separate from chat**; on mobile they are supported; desktop is a right pane; export is copy / download from the artifact chrome ([Claude Help: What are artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)). Third-party write-ups claim a **vertical mobile split + swipe between chat and artifact** ([aionx Claude Artifacts guide](https://aionx.co/claude-ai-reviews/claude-artifacts-explained/)) — treat that swipe as **reported, not first-party**. GitHub issue [anthropics/claude-code#78792](https://github.com/anthropics/claude-code/issues/78792) shows Claude **Code** artifacts still fail to list in the **mobile** Artifacts view: the iOS app is **not** a complete coding-agent file browser.

Mobbin (public, MCP not available this session):

- Claude iOS chat detail: [mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8)
- Claude iOS image-input flow: [mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1)
- ChatGPT iOS composer (attachment-adjacent): [mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1)
- Apple Photos chrome (filter/sort as gallery chrome reference): [mobbin.com/explore/screens/3d23fe0b-02d0-4bd5-902b-a42325ba5edc](https://mobbin.com/explore/screens/3d23fe0b-02d0-4bd5-902b-a42325ba5edc)

**Do not copy Claude’s Preview/Code toggle, publish, or in-artifact editing.** Pi Remote is read-only, redaction-aware, and `FileDiffBlock` today is `{ summary, patch }` only (`packages/pi-rpc-protocol/src/types.ts`). The gesture chrome can still match Claude’s **card → dedicated viewing surface → share/close**.

### 1.6 Kimi Code vs Kimi iOS (the target bar is two products)

- **Kimi Code** is CLI + VS Code + `kimi web` / `kimi vis` browser UI, not a documented iPhone file-viewer app ([Kimi Code docs](https://www.kimi.com/code/docs/en/); [`kimi` command / `kimi web`](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/kimi-command.html)). There is **no** first-party iOS gesture spec for a code artifact viewer.
- **Kimi iOS** (App Store id `6474233312`) is the consumer agent: Office Pilot for Word/PPT/Excel/PDF, 50-file analysis, vision ([App Store listing](https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312)). Those office types on iPhone almost always open through **system Quick Look / Files**, whose gestures are: tap Done, swipe down to dismiss preview, pinch/double-tap zoom, share from the QL toolbar.

**Reach the bar by matching Quick Look physics for binary/office-like payloads and Claude card physics for chat-native artifacts — not by inventing a third gesture language.**

### 1.7 Prior art that already solved this on mobile agents

| Project | What they actually built | Gesture lesson |
|---|---|---|
| [manaflow-ai/cmux #7674](https://github.com/manaflow-ai/cmux/pull/7674) | Native iOS full-screen viewer for Mac-hosted agent files; states: image, monospaced text, binary/unsupported, too-large (64 MB), missing, unreachable+retry; session gallery with **stable paging** | Explicit renderer states; gallery pager; **no** implied swipe-down in the PR text |
| [catatafishen/agentbridge #242](https://github.com/catatafishen/agentbridge/pull/242) | PWA **two-pane** file viewer; **swipe between chat and files**; syntax highlight; file links were previously no-ops | Horizontal pane-swipe **is** a path-based gesture → needs a tappable Files tab (they added dots + click). Collides with iOS edge-swipe if the pane is not history |
| [ncvgl/slawk #168](https://github.com/ncvgl/slawk/pull/168) | PWA lightbox/PDF modal un-exitable on iOS | Safe-area close, `cursor: pointer` on overlay, `target="_blank"` so downloads do not hijack the standalone window |
| [groundfic/image-peek](https://github.com/groundfic/image-peek) | Quick Look clone: FLIP from thumbnail, **swipe down only when not zoomed**, pinch, double-tap 1×↔2×, Esc/backdrop, mobile actions in a **bottom pill** | The correct zoom/dismiss coupling; chrome relocates to the thumb zone on phone |
| [EricZZZZhang/ai-artifact-reader](https://github.com/EricZZZZhang/ai-artifact-reader) | Native iOS reader for Claude/ChatGPT/Kimi HTML+MD because chat apps still dump raw code | Confirms the gap: chat PWAs rarely ship a real viewer |
| GitHub Mobile Copilot agent | Assign/track PRs from phone ([changelog](https://github.blog/changelog/2025-06-03-github-copilot-coding-agent-now-available-on-github-mobile/)) | **Not** an inline artifact surface; do not copy PR-review chrome into chat |

### 1.8 This stack’s current interaction surface (what to extend, not replace)

Measured in repo:

- **No artifact viewer.** `file_diff` renders as a styled `<pre class="diff-patch">` inside `Block`; it is **not** a pressable control (`App.tsx` `DiffPatch`). Plans are checklists. Tool results stay in `<pre>`.
- **Open already exists as History**, not as a router library (`navigate` + `popstate`).
- **Share already exists** on assistant text via `navigator.share({ text })`, capability-gated, no fake buttons (`AssistantActions`). Web Share requires **transient user activation** and is consumed by the call; you cannot `await fetch` then share ([WebKit User Activation](https://webkit.org/blog/13862/the-user-activation-api/); [MDN share()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)).
- **Dialogs today are Popover sheets** (`SessionHeader`, `SessionComposer` `DialogTrigger` + `Popover`). React Aria’s **Modal** is unused. Viewer must **not** reuse Popover: Popover is not focus-modal, not scroll-locked, not full-screen.
- RAC Modal: `isDismissable`, Escape, focus trap, **mobile scroll lock**, `--visual-viewport-height` / `--visual-viewport-width` on the overlay for the software keyboard, `data-entering` / `data-exiting` ([React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)). Put `isDismissable` on **`ModalOverlay`**, not the inner `Modal`, or outside-tap silently dies ([adobe/react-spectrum#6553](https://github.com/adobe/react-spectrum/issues/6553)).
- Press feedback already: `button:active { transform: scale(0.98) }`; coarse pointers `min-height: 44px` on `button` / `[role=switch]` / `.scan-button`. **A tappable `article.transcript-block` is not a `button` and will not inherit 44 px.**
- `touch-action: manipulation` is on **buttons only** (kills double-tap-zoom delay). Do **not** put `manipulation` on the viewer canvas if you implement custom double-tap zoom — `manipulation` is `pan-x pan-y pinch-zoom` and **disables double-tap-zoom** ([MDN touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)).
- Reduced motion is already a global hammer (`animation/transition → 0.01ms`). Viewer motion must ride that; do not add a second path that ignores it.
- **Haptics: do not spec them.** iOS Safari still has no supported `navigator.vibrate` for app UI; WebKit bug 288846 is unresolved; hidden-`<input type=checkbox switch>` hacks are not an interaction language ([PKMDS-Blazor#770](https://github.com/codemonkey85/PKMDS-Blazor/issues/770)). Native Taptic on **system** Share/context-menu is the only honest haptic.

### 1.9 Gesture arena (the non-obvious core)

A file viewer has **four** one-finger vertical consumers: (1) document scroll, (2) image pan when zoomed, (3) text selection, (4) swipe-to-dismiss. Horizontal: (5) code overflow, (6) PDF page, (7) artifact pager, (8) **iOS edge-back ~20 pt**. Pinch: (9) image zoom vs (10) accessibility page zoom.

**Rule that matches native Photos/QL and survives WCAG:**  
**Content owns pan/zoom/scroll/select. Chrome + history own dismiss. Never dismiss from a gesture that started on scrollable/zoomable content.**

This is the opposite of Instagram-style “drag the image down to close,” which is why Instagram disables that gesture once zoom > 1, and why `image-peek` documents “swipe down (mobile, **not zoomed**)”. Code files are **always** “zoomed” in that sense: they scroll. Therefore **code/text/diff/PDF page-scroll must never bind swipe-down-to-close.**

---

## 2. Concrete spec a build phase can execute

### 2.0 Presentation model (lock this first)

**Ship model: History-backed full-screen page overlay (Quick Look / Photos), not a detented sheet, not a chat/artifact split.**

- Component: RAC `ModalOverlay` + `Modal` + `Dialog` (not `Popover`).
- Route: `pushState` `/session/:sessionId/file/:blockId` (opaque ids only, same `isOpaqueId` gate as today). `popstate` closes viewer if `file` segment present; otherwise existing session/home logic.
- `isDismissable={false}` on the overlay **except** for an explicit Close control, Escape, and history Back. Do **not** close on backdrop tap: there is no backdrop — the surface is full-bleed parchment/carbon. Backdrop-tap is a sheet pattern and fights iOS click quirks.
- Do **not** implement custom swipe-down-to-dismiss in v1. System edge-swipe **is** the swipe-to-dismiss. Document this as intentional, not a missing animation.
- Do **not** implement horizontal swipe between chat and viewer (Claude-mobile rumor / agentbridge pane). That fights iOS edge-back in standalone (`display: standalone` in `manifest.webmanifest`).

Prerequisite (same PR as the viewer, otherwise Close is untappable):

1. Viewport: `width=device-width, initial-scale=1, viewport-fit=cover`. **Never** `user-scalable=no` / `maximum-scale=1`.
2. Close/Share padding: `padding-top: max(12px, env(safe-area-inset-top, var(--safe-area-top-fallback, 47px)))` and equivalent for bottom/home indicator. Measure `env()` once on load in standalone; if `0`, set fallback 47 px (iOS 26.1 bug).
3. Overlay `cursor: pointer` is unnecessary if there is no backdrop; Close **must** be a RAC `Button`.
4. Blur the composer (`textarea.blur()`) **before** open so `--visual-viewport-height` is the full window, not the keyboard-shrunk one (RAC sets those CSS vars on `ModalOverlay`).

### 2.1 Objects and triggers (what is tappable)

| In-flow object | Today | Trigger | Opens |
|---|---|---|---|
| `file_diff` card | Non-interactive `<pre>` | Whole card is a RAC `Button` or `Pressable` wrapping the card; **or** the card is an `article` with an inner 44 pt “Open” control. Prefer **whole-card press** to match Claude | Viewer, renderer=`diff`, payload=`block.patch`, title=`block.summary` |
| Future image (only if relay already sent bytes/URL) | n/a | Card tap | Renderer=`image` |
| Future PDF | n/a | Card tap | Renderer=`pdf` |
| Future text/code file | n/a | Card tap | Renderer=`code` or `text` |
| `tool_result` `<pre>` | Collapsed evidence | **Do not** auto-promote to viewer in v1 | — |
| Redacted/unknown | Copy only | Not pressable as a viewer | Stay inline |

**Redaction invariant:** viewer renders **exactly** the fields already on the block. No extra RPC, no “fetch full file,” no host path. If protocol later adds a ticketed read, that is a different spec; this surface stays fail-closed.

**Hit target:** card min-height 44 pt; inner glyphs may be 20–22 pt (Claude teardown). Coarse-pointer CSS must include `.artifact-card` / `[data-artifact-trigger]`, not only `button`.

**Press (2.5.2):** RAC `onPress` (up-event). Visual: existing `scale(0.98)` for 80–120 ms (`--duration-fast: 120ms`). Sliding off cancels open.

**Long-press (HIG “touch and hold” → context menu):**

- Listen to `contextmenu` (iOS 13+ Haptic Touch, ~500 ms). `preventDefault()` **only** on the card chrome, never on the viewer’s `<pre>`/`<img>` once open (selection / Save Image must survive).
- Menu (RAC `Menu` in a `Popover`, 44 pt rows): `Open` · `Copy` (summary + patch if `clipboard.writeText`) · `Share` (if `navigator.share`). No “Download” that navigates the standalone window (slawk hijack).
- If the user is mid-selection inside the card preview, **do not** steal the event.

### 2.2 State machine

```
IdleCard
  --press/up--> Opening
  --contextmenu--> CardMenu --> (Open | Copy | Share | dismiss)
Opening
  --reduced-motion--> OpenChrome
  --motion--> OpenChrome (220ms)
OpenChrome
  --idle 2.5s, image/pdf only--> ChromeHidden   [optional v2]
  --tap canvas, image/pdf--> toggle chrome
  --pinch/double-tap/± --> Zoomed
  --scroll/select--> OpenChrome (chrome stays)
  --Close | Escape | popstate | VO scrub--> Closing
Zoomed (scale>1)
  --pan--> Zoomed
  --pinch/double-tap to 1--> OpenChrome
  --Close/Escape/popstate--> Closing   (NOT swipe-down)
ShareSheet (system, blocking)
  --complete/AbortError--> previous
Unsupported | TooLarge | EmptyRedaction
  --Close/Escape/popstate--> Closing
Closing
  --restoreFocus--> IdleCard (or transcript region if virtualized away)
```

**Streaming:** if the same `block.id` patch grows while open, **freeze at open** (revision snapshot). Live-updating a scroll/selection surface under the finger is not a native QL behavior and races the virtualizer. A quiet `Updated in chat` chip (44 pt) can offer `Reload view` (tap = replace snapshot). No auto-jump.

### 2.3 Viewer chrome (layout, targets, focus)

Full-bleed `--canvas` (images: `--surface-code` / carbon `#0f0f0e` so photos don’t sit on bone glare; code/diff: bone in light, carbon in dark to match `--surface-code`).

**Top bar** (HIG: Cancel leading, trailing action):

| Slot | Control | Size | Notes |
|---|---|---|---|
| Leading | Close `Button` “Close” (accessible name). Visual: 22 pt × in 44×44 hit, circular faint fill like Claude back (~36 visual / 44 hit) | 44×44 | `autoFocus` so keyboard/VO land on exit first |
| Center | `Heading slot="title"` one line, Inter 17/22, truncate. Subtitle `Text slot="description"`: renderer kind + “Redacted” if applicable | not a target | |
| Trailing | Share if `navigator.share` **and** `userActivation.isActive` path; else omit (same honesty as `AssistantActions`). Optional overflow `…` only if Copy also exists | 44×44 | Share **must** run in the click handler with in-memory `File`/`text`; no await network |

Bottom: **no** grabber. Home-indicator clearance `max(12px, env(safe-area-inset-bottom))`.

**Image/PDF zoom controls** (2.5.1 alternative to pinch), 44×44, bottom-trailing cluster, 8 pt gap: `−` / `+` / `Fit`. Hidden for pure text/diff if those never zoom.

**Pager** (only if the **same turn** has 2+ openable artifacts): Prev/Next 44×44 + `aria-live` `"2 of 3"`. Swipe between pages is **optional v2** and must not start in the left 20 pt (edge-back) or on a horizontally scrollable code line.

Focus order (2.4.3):

1. Close  
2. Share (if present)  
3. Overflow (if present)  
4. Heading (in tab order only if it is a heading; VO reads it via dialog name — set `aria-labelledby` to the heading, do not duplicate)  
5. Renderer region `tabIndex={0}` `role="document"` **inside** the dialog (lets VO “read all” / two-finger swipe down through code)  
6. Zoom − / + / Fit  
7. Prev / Next  

RAC Dialog provides the accessible name from `Heading slot="title"`. Restore focus to the card trigger; if TanStack Virtualizer recycled it, focus `[aria-label="Typed transcript"]`.

Keyboard (hardware / iPad / Bluetooth — iPhone users have this):

| Key | Action |
|---|---|
| Escape | Close (RAC default; do **not** set `isKeyboardDismissDisabled`) |
| Tab / Shift+Tab | Cycle chrome + document region |
| ↑ ↓ (in document region) | Scroll 1 page-ish (or native scroll) |
| + / = and − | Zoom if renderer supports it |
| ← → | Pager if present |
| Cmd/Ctrl+C | Native copy of selection; do not override |
| Space | Do **not** close (conflicts with page-down). Close is Escape / Close button |

iOS VoiceOver: dialog is modal; two-finger scrub → Escape → close. Rotor: Headings (the title), Form Controls (Close/Share), and the document region. Do not `aria-hidden` the document.

### 2.4 Per-renderer gesture table (executable)

**A. Image** (`touch-action: none` **on the canvas only**, not on `html`)

| Input | Behavior |
|---|---|
| Pinch | Zoom 1.0–4.0, origin = midpoint. Rubber-band past 1.0/4.0, snap back 220 ms `--ease-out` |
| Double-tap | Toggle fit ↔ 2.0 at tap point (HIG double-tap = zoom) |
| One-finger drag at scale=1 | **Scroll nothing; ignore as dismiss** (v1). Optional v2: if vertical dy>0 and dx<12 pt and scale=1, rubber-band (see §3) |
| One-finger drag at scale>1 | Pan; clamp to image bounds |
| Two-finger pan | Pan (browser will not, because `touch-action: none`) |
| ± buttons | 1.25× steps, 2.5.1 |
| Long-press | **Do not** set `-webkit-touch-callout: none`. Let iOS Save/Copy/Share on the bitmap that was already sent |
| Share | `canShare({ files: [file] })` then `share({ files, title })` from the in-memory blob. On `AbortError`, silent. On other errors, no toast that implies a mutation |

**B. PDF**

- Prefer the **user-agent PDF view** in a same-origin blob `iframe` if the bytes are already in the block. Do **not** wrap it in custom swipe-down; nested gesture conflict with the PDF’s own pinch/scroll is a known PWA trap.
- If iframe is blocked in standalone, render page images with the **image** gesture table, plus Prev/Next page buttons (2.5.1).
- Downloads: `target="_blank" rel="noopener"` or a blob download via click — never navigate the PWA window (slawk).

**C. Text / code / `file_diff`**

| Input | Behavior |
|---|---|
| One-finger vertical | Native scroll of the `<pre>` / virtualized lines |
| One-finger horizontal | Native overflow scroll; **never** pager, **never** dismiss |
| Pinch | **Do not** hijack. Let the page’s user-scalable zoom work (1.4.4). Optional: font-size ± in overflow menu |
| Double-tap | Native word selection (HIG: double tap selects a word in editing/reading) |
| Long-press | Native selection handles. **No** custom menu until selection UI dismisses |
| Copy control | Copies **visible** text/patch only |
| `touch-action` | `pan-x pan-y` on the scroller (`manipulation` would kill double-tap-select delay in a useful way on the scroller — acceptable here; do not use `none`) |

Diff lines stay the existing `diff-add` / `diff-remove` tokens. Full-screen adds: sticky filename/summary, line wrapping **off** by default with horizontal pan, a 44 pt `Wrap` toggle (single pointer alternative to horizontal pan — 2.5.7).

**D. Unsupported / empty / redacted**

Non-interactive explanation (existing unknown-block copy pattern) + Close. No fake Open.

### 2.5 Motion / micro-interactions (tokens already in `style.css`)

| Event | Motion | Reduced motion |
|---|---|---|
| Open | Overlay fade 200 ms; panel `translateY(8px)→0` + opacity 220 ms `--ease-out-interface` (`cubic-bezier(0.22, 1, 0.36, 1)`). Optional FLIP from card rect if `element.getBoundingClientRect()` still in view | Instant cut, 0.01 ms (global rule already) |
| Close | Reverse 180–220 ms; then `history.back()` **after** paint so iOS does not play a second push-pop animation on top (Ionic double-animation). If close **is** a popstate, **skip** JS slide and let WebKit’s back gesture own the frame | Instant |
| Button press | `scale(0.98)`, 120 ms | Instant |
| Zoom snap | 220 ms `--ease-out` | Instant scale |
| Copied | Existing 1500 ms label swap (`Copied`) | Same, no extra animation |
| Share | **Zero** custom animation; system sheet | — |
| Chrome auto-hide (images, v2) | 180 ms opacity | Keep chrome always on |

Do **not** copy RAC’s sample `zoom-in` with overshoot (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`) — that is a dialog-spring, not Photos, and fights the parchment register.

`overscroll-behavior: none` on the overlay to stop the **session transcript** rubber-banding underneath (iOS body-scroll-lock is RAC’s job; this is the remaining leak).

During `data-entering` / `data-exiting`, `pointer-events: none` on the canvas so a tap cannot double-fire Open/Close.

### 2.6 Share / close (exact)

**Close (all of these are required, equivalent):**

1. Leading Close button (up-event).  
2. Escape / RAC keyboard dismiss.  
3. History Back / iOS edge-swipe / Android back (via `popstate`).  
4. VoiceOver two-finger scrub (via dialog Escape).  

**Share (capability-gated, same policy as `AssistantActions`):**

- Text/diff: `navigator.share({ text, title })` with the **displayed** string.  
- Image/PDF: `canShare({ files })` then `share({ files: [new File([blob], filename)] })` from bytes **already on the block**.  
- If Share would require a network fetch, **omit the button** (activation would expire; WebKit).  
- Cancelled sheet → `AbortError` → no error UI.

**Copy:** existing clipboard path; 44 pt; `aria-label` toggles to “Copied”.

No download control that uses `<a href>` without `target="_blank"` in standalone.

### 2.7 Implementation map (this codebase)

- New: `ArtifactViewer` mounted next to `Session` (controlled `isOpen`, like RAC “Controlled” modal example — trigger lives inside a virtualized list, so the modal **cannot** be a child of the recycled row).
- New: `ArtifactCard` replacing non-interactive `file_diff` body; keep `DiffPatch` as the **inline preview** (first ~12 lines or 160 px, `overflow: hidden`) so the card still looks like a diff, not an icon-only tile.
- Extend `readSessionIdFromLocation` / `popstate` to parse `/session/:id/file/:blockId` without treating it as an invalid session id.
- Reuse `--focus` 3 px outline, `--radius-lg`, `--shadow-raised`, Inter for chrome, Source Serif is **not** used in the viewer chrome (code stays `--font-mono`).
- Tests: close via button, via `history.back()`, Close has safe-area offset, card `onPress` does not fire on `pointerdown`, Share omitted when `share` missing, redacted patch is what Share copies, virtualizer focus restore. Mirror slawk’s `image-lightbox-mobile-exit.spec.ts` intent.

---

## 3. Divergent / minority ideas (resist converging)

1. **No custom swipe-down at all (recommended v1).** Majority chat clones will add vaul/sheet rubber-band. On a coding PWA it collides with code scroll, PDF scroll, iOS edge-back, and 2.5.7. Ship history-back as the *only* swipe dismiss.

2. **Claude vertical split / swipe-between-chat-and-artifact.** Matches some mobile Claude write-ups and agentbridge’s pane swiper. On iPhone 390 pt it leaves ~180 pt for code and **steals** the system back gesture. Consider **only** if `display-mode: standalone` can be detected **and** the split is a **button-toggled** pane, not a swipe.

3. **True Quick Look peek:** long-press card → scaled FLIP preview; lift cancels; swipe-up commits full screen (`image-peek` / iOS 13 peek). High native feel, high implementation cost, easy 2.5.2 bugs if commit is on `touchend` outside the card.

4. **Photos chrome-autohide.** Tap canvas to hide Close/Share for immersive images. Fatal if applied to code (Close disappears). If shipped, **never** autohide when renderer is text/diff, and keep Close available to VO even when visually hidden (`aria-hidden=false`, opacity 0 is an a11y bug — use a persistent 44 pt Close).

5. **Bottom action pill** (`image-peek` mobile): Close/Share in a thumb-zone pill, empty top bar. Better for one-handed use; worse match to HIG Cancel-leading; worse match to Claude’s quiet top chrome. Worth a prototype on 390 pt.

6. **Horizontal artifact filmstrip** (Photos, cmux gallery). Powerful for a turn with many files. Path-based swipe needs Prev/Next buttons (2.5.1) and a **dead zone** of 20 pt on the left for iOS back.

7. **Pinch-below-1 to close** (Instagram). Forbidden as sole dismiss (2.5.1) and catastrophic on code. Do not.

8. **Two-finger scroll vs one-finger dismiss.** Classic map-app split. Fails 2.5.1 if one-finger cannot scroll. Never.

9. **`replaceState` the viewer** so iOS edge-swipe **cannot** close it (Ionic workaround). That makes the viewer feel like a trap. Wrong direction for this feature.

10. **Hidden switch haptic polyfill.** Reject. Not HIG, not WCAG, not honest.

11. **Detented sheet (medium + large) with grabber.** Correct for Model/Effort (already a Popover). Wrong for a file. HIG: Mail compose is full-height **without** medium detent because the content needs the height. Code needs more.

12. **iPad non-modal inspector** (HIG: Notes formatting is a nonmodal sheet). On iPhone, stay modal. If iPad is in scope later, a persistent trailing pane with **no** swipe-down is the minority-but-correct layout (Claude desktop).

13. **Line-scrubber** (right-edge drag like iOS indexed list / Xcode minimap). Single-pointer alternative: a 44 pt “Go to line” numeric field. High value for 2k-line diffs; do not bind it to the same edge as system back.

14. **Open as a real route without RAC Modal** (`/session/:id/file/:id` as a full page, no dialog). Then VoiceOver scrub = history back automatically (like `UINavigationController`). Focus restore is harder. Worth it if Modal scroll-lock fights PDF iframe.

15. **Keep native image callout, kill custom Share.** Minority: one share path (the OS). Reduces duplicate Share buttons. Loses in-app consistency with `AssistantActions`.

---

## 4. Open questions + risks

1. **Protocol gap.** `FileDiffBlock` has no MIME, bytes, filename, or thumbnail. A Claude-like image/PDF viewer **cannot** be honestly built until the relay sends those fields. v1 is a **full-screen diff/text viewer** with the same chrome. Do not mock binary renderers on placeholders.

2. **History vs RAC close animation.** If Close calls `history.back()`, WebKit may animate the whole PWA while RAC plays `data-exiting`. Pick one owner: either Close only sets React state (and `replaceState`s the URL), or Close only pops history (and React listens). Mixing is the Ionic glitch.

3. **Virtualizer + focus restore.** Opening from a recycled row: keep `{blockId, triggerEl}` in a ref at press time. If `triggerEl.isConnected === false` on close, fall back to the transcript region.

4. **Nested PDF iframe vs scroll lock.** RAC “scroll locking including mobile browsers” can freeze an iframe PDF. If observed, use the non-modal route option (§3.14) for PDF only.

5. **iOS 26.1 safe-area = 0.** Close under the island = un-exitable. Must have a numeric fallback in standalone.

6. **Share activation expiry.** Any `await` before `navigator.share` will throw `NotAllowedError` on WebKit. Share only in-memory payloads.

7. **Standalone download navigation.** `<a download>` is ignored on iOS; the PWA **navigates** to the file and there is no Back chrome. Always `target="_blank"` or blob + Share.

8. **Gesture conflict with session back.** User opens viewer then edge-swipes: they must land on the **session**, not the inbox. That requires the viewer path to be **pushed on top of** `/session/:id`, never replacing it.

9. **Composer keyboard.** Opening the viewer while the keyboard is up leaves a gap the height of the keyboard (`--visual-viewport-height`). Blur first.

10. **WCAG vs Apple targets.** `.turn-action` is visually ~32 px; coarse CSS lifts native `button` to 44 px. Artifact cards that are not buttons will fail Apple and may fail 2.5.8 if packed against the action row.

11. **Mobbin MCP** was not callable this session (no MCP servers in catalog). Screen citations are public Mobbin URLs; visual measurements of Claude’s **opened** artifact chrome remain partly inferred from Help Center + local teardown of the **card**, not of the full-screen viewer.

12. **Kimi Code has no iOS viewer spec.** Matching “the Kimi Code app” cannot mean pixel-copying a file UI that is not published. Match Kimi iOS **Quick Look / Office** dismiss + Claude **card**.

13. **Security:** Share/Copy must not un-redact. If `patch` is `'@@ redacted @@'`, that is the share body. No “Open on host” control (would be a new mutation/read lane).

14. **`status-bar-style: default`** cannot be flipped at runtime for a carbon image viewer. Either live with an opaque status bar on images, or change the meta to `black-translucent` globally and always pad. Do not assume runtime switching.

---

## 5. Sources

### Apple / WCAG / WebKit / CSS

- https://developer.apple.com/design/human-interface-guidelines/gestures  
- https://developer.apple.com/design/human-interface-guidelines/sheets  
- https://developer.apple.com/design/human-interface-guidelines/playing-haptics  
- https://developer.apple.com/design/tips/  
- https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/SupportingAccessibility.html  
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html  
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html  
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html  
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html  
- https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action  
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share  
- https://webkit.org/blog/13862/the-user-activation-api/  
- https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts  

### React Aria (this stack)

- https://react-spectrum.adobe.com/react-aria/Modal.html  
- https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/docs/Modal.mdx  
- https://github.com/adobe/react-spectrum/issues/6553  

### PWA / iOS gesture traps

- https://github.com/ionic-team/ionic-framework/issues/22299  
- https://github.com/ionic-team/ionic-framework/issues/29733  
- https://github.com/w3c/manifest/issues/1041  
- https://github.com/ncvgl/slawk/pull/168  
- https://github.com/kernelkaribou/chronosnap/commit/e36f4c1b2c043d030ea794a1b0d5c4a4594a4eb3  
- https://github.com/codemonkey85/PKMDS-Blazor/issues/770  
- https://bugs.webkit.org/show_bug.cgi?id=288846  

### Claude / Kimi / coding-agent prior art

- https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them  
- https://aionx.co/claude-ai-reviews/claude-artifacts-explained/  
- https://github.com/anthropics/claude-code/issues/78792  
- https://www.kimi.com/code/docs/en/  
- https://www.kimi.com/code/docs/en/kimi-code-cli/reference/kimi-command.html  
- https://www.kimi.com/products/download  
- https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312  
- https://github.com/manaflow-ai/cmux/pull/7674  
- https://github.com/catatafishen/agentbridge/pull/242  
- https://github.com/EricZZZZhang/ai-artifact-reader  
- https://github.com/groundfic/image-peek  
- https://github.blog/changelog/2025-06-03-github-copilot-coding-agent-now-available-on-github-mobile/  
- https://github.com/mobile  

### Mobbin (public URLs; MCP catalog empty this session)

- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 (Claude iOS chat detail)  
- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 (Claude iOS image-input flow)  
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 (ChatGPT iOS chat interface)  
- https://mobbin.com/explore/screens/3d23fe0b-02d0-4bd5-902b-a42325ba5edc (Apple Photos iOS)  
- https://mobbin.com/glossary/gallery  

### This repo (ground truth)

- `apps/pi-remote-web/src/App.tsx` — `Block` / `DiffPatch` / `navigate` / `popstate` / `AssistantActions`  
- `apps/pi-remote-web/src/style.css` — tokens, 44 px coarse rule, `touch-action: manipulation`, reduced motion  
- `apps/pi-remote-web/index.html` — viewport, status bar  
- `apps/pi-remote-web/public/manifest.webmanifest` — `display: standalone`  
- `packages/pi-rpc-protocol/src/types.ts` — `FileDiffBlock`  
- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`  
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md` (artifact card placement; no gesture spec)
