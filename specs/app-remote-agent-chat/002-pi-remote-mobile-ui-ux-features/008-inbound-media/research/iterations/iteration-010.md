<!-- provenance: external-CLI orchestration pass; original file iter-10-grok.md -->
> **Source pass 10** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-10-grok.md`.

<!-- F8-inbound-media | model=grok | lens=interaction-gesture | iter 10/15 | 2026-08-16T05:11:03.618Z -->

# Iteration 10 — Interaction + gesture design for inbound preview media

**Lens:** every state, transition, touch target, long-press, swipe, keyboard, focus order, and micro-interaction for an inbound screenshot card + fullscreen viewer in Pi Remote (installable iPhone PWA).  
**Constraint:** ink-on-parchment design system is locked; security posture is read-only / fail-closed / redacted durable state. This pass does not redesign tokens or the mutation lane.  
**Method note:** Mobbin MCP was not callable in this session (no MCP servers registered). Mobbin evidence below is from public `mobbin.com` URLs plus local staged Claude screens. Apple’s live HIG pages often return a JS shell; claims are grounded in Apple’s static tips page, the published HIG URLs, and archived HIG gesture text.

---

## 1. Findings for this lens

### 1.1 The product is a Photos-class viewer inside a chat list, not a chat bubble with an `<img>`

Claude iOS treats generated/attached visuals as **inline artifact cards in the reading column**, not as full-bleed photos: ~16px radius, hairline, title + muted subtitle, small thumbnail on the right, optional `1 artifact` pill above the turn ([local teardown](docs/design-reference/mobile-chat-apps/01-visual-teardown.md); [Mobbin: Claude iOS “Chatting with Claude (image input)”](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1)). ChatGPT iOS shows generated images **in the conversation column** as tappable media ([Mobbin: ChatGPT iOS Dark Mode Conversation](https://mobbin.com/explore/screens/3aa59b0a-9d5e-451b-af8d-21acfd81064b)). Dropbox’s iOS image viewer is the chrome pattern (fullscreen overlay, icon buttons, next) ([Mobbin: Dropbox iOS Image Viewer](https://mobbin.com/explore/screens/b4f9821b-3cdf-4876-8691-e4b7741637bc)).

The **target bar is therefore two layers**:

1. **Chat layer (Claude / Kimi):** card in the turn, 44pt hit geometry, no gesture capture that fights transcript scroll.  
2. **Photos layer (iOS system + PhotoSwipe-class web viewers):** tap opens a modal; pinch zooms; double-tap toggles a secondary zoom; one-finger pan only when zoomed; vertical drag dismisses; Esc/X closes; chrome auto-hides.

Apple’s gesture vocabulary is explicit and users expect it unchanged: **pinch open = zoom in, pinch close = zoom out, double-tap = zoom in/out and center, swipe = scroll / reveal / dismiss, touch-and-hold = magnifier or rearrange / context menu**. Shortcut gestures must **supplement, not replace**, a visible control ([archived HIG Gestures](https://codershigh.github.io/guidelines/ios/human-interface-guidelines/interaction/gestures/index.html); current URL [developer.apple.com/…/gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)). Learn UI’s iOS reconstruction matches Photos: **tap X or ✓ to close a modal; swipe down on fullscreen media to dismiss** ([learnui.design iOS 26 guidelines](https://learnui.design/blog/ios-design-guidelines-templates.html)).

### 1.2 Claude Code remote currently fails this feature — do not copy that failure

The consumer Claude iOS **chat** app is the visual target. Claude **Code** remote on iOS is the anti-target:

- Playwright / Read screenshots are consumed by the model but **not rendered in the mobile chat** ([anthropics/claude-code#40157](https://github.com/anthropics/claude-code/issues/40157)).  
- `SendUserFile` of an image becomes a **generic file card**; inline render is a requested gap ([anthropics/claude-code#61995](https://github.com/anthropics/claude-code/issues/61995)).  
- Desktop preview is low-res; **mobile cannot preview images at all** ([anthropics/claude-code#41300](https://github.com/anthropics/claude-code/issues/41300)).

Matching “Claude iOS” for this feature means matching **Claude chat artifact cards + iOS Photos gestures**, not Claude Code remote’s file-chip dead-end.

Kimi’s consumer iOS listing documents **Intelligent Vision** (analyze photos) and attachment-from-plus, not a published pinch/pan contract ([App Store: Kimi K3](https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312); local reconstruction in `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`). Kimi Code’s **web** surface documents Copy/Fork, not a mobile image viewer ([Kimi Code Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)). Treat Kimi as **composer/attachment geometry (44pt plus, card in flow)**, and take **viewer physics from iOS Photos + PhotoSwipe + shipped web chat lightboxes**.

### 1.3 Pi already has outbound images; inbound is a different block family with a collapse bug waiting to happen

Host `pi` already types images as `{ type: "image", data, mimeType }` on **prompt / steer / follow_up**, and session format allows `ImageContent` on **tool results and custom messages** ([badlogic/pi-mono rpc.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md); [session-format.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/session.md)). The Pi Remote **transcript** union does not: kinds are `text | thinking | plan | tool_call | tool_result | file_diff | usage` (`packages/pi-rpc-protocol/src/types.ts`). Unknown kinds render as a non-interactive “cannot be displayed” paragraph (`apps/pi-remote-web/src/App.tsx`).

Worse for gestures: successful `tool_result` is classified as **routine evidence** and folded into an Activity disclosure (`isEvidenceBlock` in `App.tsx`). A screenshot arriving as a tool result would be **one extra tap behind “Worked · N tools”** — the opposite of Claude’s promoted artifact card and of the local design council rule that artifacts stay associated with the turn and keyboard-operable (`docs/design-reference/mobile-chat-apps/council-gpt-sol.md`). File diffs are already **not** folded. Inbound images must join that promoted set.

Durable state must stay pointer-only (`artifactId + revision + digest`). That is a **gesture constraint**, not just a storage one: the card `src` is a revisioned URL; long-press menus must not surface host paths; failed digest / redacted bytes still occupy a tappable card so the state machine never dead-ends.

### 1.4 Touch geometry: Apple 44pt, WCAG 24px AA / 44px AAA, and this app is already mixed

Apple: **hit targets ≥ 44×44 points** ([Apple Design Tips](https://developer.apple.com/design/tips/); [HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)). WCAG 2.5.8 (AA) is **24×24 CSS px** with a spacing exception ([Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)). WCAG 2.5.5 (AAA) is **44×44 CSS px** with no spacing escape hatch ([Understanding 2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced)). This product’s quality floor already states **44×44 px** (`.claude/skills/sk-design/sk-design-interface/references/design-process/ux-quality-reference.md`). Local Claude research treats 44pt as non-negotiable even when the glyph is 20–22pt (`docs/design-reference/mobile-chat-apps/research-gpt-luna.md`).

In the shipped CSS, header controls are `2.75rem` (44px at 16px root). Composer `+` / send are **`2.5rem` (40px)**; `@media (pointer: coarse)` only forces `min-height: 44px` on `button`, not `min-width` (`apps/pi-remote-web/src/style.css`). Viewer chrome must not inherit that 40px circle. Use **`min-width` and `min-height: 2.75rem` (44px)** on every viewer control, with ≥8px gap (WCAG 2.5.8 spacing spirit; HIG “space around a button”).

### 1.5 Multipoint and path gestures are allowed only if a single-pointer alternative exists

WCAG **2.5.1 Pointer Gestures (A):** pinch-zoom and directional flick **must** have a single-pointer, non-path alternative (buttons, double-tap, long-press). Keyboard-only is **not** enough for 2.5.1 ([Understanding 2.5.1](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html)).  
WCAG **2.5.7 Dragging Movements (AA):** one-finger pan must have a **non-drag** alternative (pan buttons or equivalent) ([Understanding 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)).  
WCAG **2.5.2 Pointer Cancellation (A):** activate on **up-event**; moving off the target before release aborts ([Understanding 2.5.2](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html)). React Aria `Button` / `onPress` already uses up-event; raw `touchstart` open is a fail.

Accessible image-viewer practice: plus/minus zoom, pan buttons, 44px targets, don’t rely on pinch ([Cogapp: What makes an image viewer accessible](https://www.cogapp.com/blog/what-makes-an-image-viewer-accessible)).

### 1.6 Web lightbox physics that actually ship (numbers, not vibes)

**PhotoSwipe** (the de-facto web Photos clone, [dimsemenov/PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe), [photoswipe.com/options](https://photoswipe.com/options/)):

| Contract | Default |
|---|---|
| Open/close/zoom animation | **333ms**, `cubic-bezier(.4,0,.22,1)` |
| Backdrop | `bgOpacity: 0.8` |
| `pinchToClose` | **true** |
| `closeOnVerticalDrag` | **true** |
| `clickToCloseNonZoomable` | **true** |
| `escKey` / `arrowKeys` / `trapFocus` / `returnFocus` | **true** |
| `tapAction` | `'toggle-controls'` |
| `doubleTapAction` | `'zoom'` |
| `imageClickAction` | `'zoom-or-close'` |
| Initial zoom | `'fit'` |
| Secondary zoom | **2.5× of fit**, capped 3000px wide |
| Max zoom | **4× of fit** |
| `maxWidthToAnimate` | 4000px — larger images skip open/close motion |
| Nearby preload | `[1, 2]` |
| `loop` | true only if ≥3 slides |
| v3 swipe (legacy) | **50px** travel, **250ms** max for a flick |

**HuggingFace chat-ui** lightbox (web chat, iPhone-relevant): Pointer Events; pinch about midpoint with rubber-band overshoot; one-finger pan only when zoomed; hard-clamp on release; **double-tap 1× ↔ 2.5× at tap point**; `touch-action: none`; **iOS `gesturestart`/`gesturechange`/`gestureend` still zoom the page unless `preventDefault`’d**; pointermove/up/cancel on `window`; tap-to-close overlay **only at scale 1**; X + Escape always close ([commit 2ef6c83](https://github.com/huggingface/chat-ui/commit/2ef6c831a386a9a03488339cddef1145dc363630)).

**slopus/happy** (Claude Code mobile client) had inert chat images; they added a fullscreen viewer: native pinch/pan/double-tap; web wheel-zoom, drag-pan, Esc/×. Native required a **`GestureHandlerRootView` inside the Modal** or gestures were dead ([PR #1424](https://github.com/slopus/happy/pull/1424)). For a PWA the analogue is: **gesture listeners on the overlay surface, not on a virtualized transcript row**.

### 1.7 iPhone PWA-specific gesture traps (this stack will hit all of them)

**Safari page pinch vs image pinch.** Default browser pinch zooms the *page*. Custom viewers must set `touch-action: none` on the overlay ([MDN touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action)). HuggingFace proved that is **insufficient on iOS**: WebKit’s proprietary `gesture*` events still page-zoom a fullscreen overlay. The transcript already uses `touch-action: manipulation` on `button` (kills 300ms double-tap delay — good for cards). The **viewer canvas** must override to `none` and cancel `gesturestart`.

**WCAG 1.4.4 vs `touch-action: none`.** MDN warns that `touch-action: none` can block browser zoom for low-vision users. Confine `none` to the **open overlay**, never `html/body`. Page zoom remains available in the transcript.

**Edge swipe = browser Back.** iOS Safari 13.4+ back/forward is an edge swipe. Lightboxes that pan near x=0 steal it, or get stolen by it. Fix used in the wild: `touchstart` with `{ passive: false }`, `preventDefault` only if `pageX < 20` or `> innerWidth - 20` ([GLightbox #146](https://github.com/biati-digital/glightbox/issues/146); [Pqina](https://pqina.nl/blog/blocking-navigation-gestures-on-ios-13-4/)). **Standalone PWA:** edge-swipe is **disabled unless history exists**. `history.pushState` to make Back close the viewer **re-enables** edge-swipe ([iOS PWA notes gist](https://gist.github.com/fozzedout/5e77925381991a9570151550992baf14)). That is a real fork (see §3).

**Visual viewport.** Overlay chrome must track `visualViewport` (keyboard, pinch of the *page* if it leaks) ([MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)). React Aria `ModalOverlay` sets `--visual-viewport-height` / `--visual-viewport-width` for this ([react-aria Modal](https://react-aria.adobe.com/Modal)).

**Standalone containment.** OpenClaw’s Control UI PWA overflowed in standalone until `viewport-fit=cover`, `100dvh` + `overflow: hidden` on html/body, `position: fixed; inset: 0` ([openclaw/openclaw#76072](https://github.com/openclaw/openclaw/pull/76072)). Pi Remote’s viewport meta is `width=device-width, initial-scale=1.0` with **no `viewport-fit=cover`** (`apps/pi-remote-web/index.html`). Safe-area is already used on the header/composer; a true fullscreen viewer will sit under the notch/home indicator unless the overlay pads `env(safe-area-inset-*)`.

**Keyboard-shrink bug.** Installed iOS PWAs can permanently shrink `innerHeight` / `visualViewport.height` after the first keyboard open ([DEV: standalone PWA keyboard](https://dev.to/cederhook/fixing-the-ios-standalone-pwa-keyboard-bug-that-shrinks-your-viewport-for-good-63d)). Opening the viewer while the composer is focused must **blur the textarea first**, then measure.

**Scroll chaining.** `.transcript-scroll` already has `overscroll-behavior: contain`. The overlay must lock body scroll (React Aria Modal does this) so a vertical-dismiss rubber-band does not scroll the virtualized list underneath.

**Virtualizer.** `@tanstack/react-virtual` with `overscan: 6` will **unmount the trigger card** if the user scrolls while the viewer is open (they cannot, if scroll is locked) or if a snapshot revision reflows. Focus restore must key off **`block.id`**, not a DOM node that may be recycled.

### 1.8 Long-press is a context menu, not a second open

iOS 13+ **context menus replaced Peek and Pop**. Reveal is a **system touch-and-hold**. Preview + command list; tap preview to open; do **not** ship both a context menu and an edit/callout menu on the same item ([HIG Context menus](https://developer.apple.com/design/human-interface-guidelines/context-menus)). Photos uses this for Copy / Share / Save.

On the web, iOS Safari’s default on `<img>` is **Save Image / Copy / Share** (`-webkit-touch-callout`). That menu can leak a raw URL and fights a custom long-press. Disable callout **on the card image only**, then implement a custom menu (React Aria `Menu` / `Popover`) with **Copy image**, **Share** (if allowed), never **Copy path**.

Long-press vs scroll: cancel if pointer moves beyond **~10px** (common gallery practice; PhotoSwipe v3 used 50px for a *swipe*, which is too large for “this is a scroll”). iOS hold delay is system-defined (~500ms). Spec **500ms**, movement cancel **10px**, and do not open the viewer on the same gesture.

React Aria: `Modal` + `Dialog` trap focus, restore trigger, Esc to dismiss, `isDismissable` on **`ModalOverlay` not `Modal`** ([adobe/react-spectrum#6553](https://github.com/adobe/react-spectrum/issues/6553); [react-aria Modal](https://react-aria.adobe.com/Modal)). `isKeyboardDismissDisabled` stays **false**.

### 1.9 Motion budget for this surface (product, not brand)

Local motion gate: **frequency first**. Zoom/pan during inspection is tens-of-times-per-session → **no animated delay on the transform; follow the fingers**. Open/close is occasional → **300–500ms layout transition**. Keyboard-initiated close/zoom is **instant** ([animation-decision-framework](.claude/skills/sk-design/sk-design-interface/references/motion/animation-decision-framework.md); [motion-strategy](.claude/skills/sk-design/sk-design-interface/references/motion/motion-strategy.md)). Press feedback: scale **0.95–1.0**, app already uses **0.98** on `button:active`. PhotoSwipe 333ms / `.4,0,.22,1` is inside the 300–500ms band; do **not** add bounce (`bounce: 0`). Existing `prefers-reduced-motion: reduce` already forces `animation/transition-duration: 0.01ms` globally — the viewer must still **function** (instant present, no FLIP).

### 1.10 Prior-art remote-CLI / coding-agent clients

| Client | What exists | Gesture takeaway |
|---|---|---|
| [badlogic/pi-mono](https://github.com/badlogic/pi-mono) | ImageContent on RPC + tool results; TUI `/show-images` via Kitty/iTerm | Inbound bytes exist on the host; Pi Remote is the missing viewer. |
| [slopus/happy](https://github.com/slopus/happy/pull/1424) | Fullscreen pinch/pan/double-tap for chat images | Images were inert until a dedicated viewer; gestures must live **inside** the modal root. |
| [huggingface/chat-ui](https://github.com/huggingface/chat-ui/commit/2ef6c831a386a9a03488339cddef1145dc363630) | Pointer-event lightbox | The iOS `gesture*` + `window` pointer tracking checklist. |
| [dibstern/conduit](https://github.com/dibstern/conduit) | OpenCode PWA: image paste/camera, file **preview modal**, large approve/deny targets | Preview is a **modal**, not inline expand; mobile targets are first-class. |
| [Shahfarzane/opencode-mobile](https://github.com/Shahfarzane/opencode-mobile) | Edge-swipe gestures, mobile terminal | Edge-swipe is already a competing navigation gesture in this category. |
| [openclaw/openclaw#76072](https://github.com/openclaw/openclaw/pull/76072) | iOS standalone viewport lock | Required before a fullscreen overlay can be sized correctly. |

---

## 2. Concrete spec a build phase can execute

Reuse one viewer shell (**F6**) for outbound attach chips and inbound cards. Inbound only adds: promoted transcript kind, redaction/digest states, and no “remove attachment” action.

### 2.1 Components and stacking

| ID | Role | Implementation notes |
|---|---|---|
| `ImageCard` | Transcript row | React Aria `Button` (or `Link` to `#viewer`) wrapping thumbnail + title + status. **Not** a raw `<img>` as the hit target. |
| `ImageViewer` | Fullscreen | `ModalOverlay` + `Modal` + `Dialog` from `react-aria-components`, already used for composer tools / header sheets. `isDismissable` on **Overlay**. |
| `PinchCanvas` | Gesture surface | Dedicated component (HuggingFace split). Owns pointers; parent owns chrome/focus. |
| `ImageContextMenu` | Long-press | React Aria `Menu` + `Popover`. One menu per card; no parallel `-webkit-touch-callout`. |

Card CSS: `touch-action: manipulation` (keep 300ms tap delay off). Canvas CSS: `touch-action: none`. Overlay: `overscroll-behavior: none`; pad `env(safe-area-inset-top/bottom/left/right)`; size height with `var(--visual-viewport-height, 100dvh)`.

**Do not fold** `kind: 'image'` (or whatever the protocol name) in `isEvidenceBlock`. Treat like `file_diff` / plan: prominent in the turn, between introducing prose and the assistant action row (Claude artifact placement).

### 2.2 State machine

```
CARD:
  skeleton ──(bytes+digest OK)──► ready
       └──(timeout/4xx/mismatch)──► failed
       └──(policy redacted)──► redacted
  ready ──pointerdown──► pressed
       └── move>10px ──► (cancel; transcript scroll wins)
       └── up <500ms ──► OPEN
       └── hold ≥500ms, move≤10px ──► menu
  menu ──choose Open──► OPEN
  menu ──choose Share/Copy──► stay on card
  menu ──dismiss (tap outside / Esc)──► ready
  failed/redacted ──up──► OPEN_BLOCKED (same Dialog, no canvas)

VIEWER:
  opening ──(reduced-motion? 0ms : 333ms)──► fit
  fit ──pinch/double-tap/zoom+──► zoomed
  zoomed ──pinch/double-tap/zoom− to ≤1.02──► fit
  fit ──vertical drag > threshold──► dismissing
  zoomed ──vertical drag──► (ignored; pan only)
  fit ──tap canvas──► chrome hidden/shown
  any ──Esc / Close / Back──► closing ──► CARD (focus restore)
  fit + gallery ──horizontal swipe──► neighbor
  zoomed + pan past edge + allowPanToNext──► neighbor (optional; default OFF)
```

**Press cancellation (2.5.2):** viewer opens on **pointerup** inside the card, not pointerdown. If the finger slides into a scroll, never open.

### 2.3 Exact gesture table (iPhone)

| Gesture | Where | Spec | Notes |
|---|---|---|---|
| Tap | Card | Open viewer | Hit area = **entire card**, min **44×44 CSS px**, typically ~120×88 thumbnail + 16px radius matching Claude artifact cards. |
| Long-press | Card | 500ms, 10px slop | Custom menu. Cancel on scroll. `-webkit-touch-callout: none; user-select: none` on the thumbnail. |
| Tap | Viewer Close | Close | Top-leading, 44×44, glyph ~20pt, 12pt from safe-area. Label `Close`. |
| Tap | Viewer canvas at scale≈1 | Toggle chrome | PhotoSwipe `tapAction: 'toggle-controls'`. Do **not** close (closing via tap fights zoom). |
| Tap | Backdrop at scale≈1 | Close | HuggingFace: only at scale 1. |
| Double-tap | Canvas | Toggle **fit ↔ 1:1 CSS pixel** at tap point | See §2.4. Window **300ms**. If `doubleTapAction` is kept, accept the tap delay on chrome toggle. |
| Pinch | Canvas | Zoom about midpoint | Min scale = fit; max = `max(4× fit, 1:1, 2× 1:1)` but never beyond **decoded pixel size × 2**. Rubber-band 8–12% then spring back on release (`bounce: 0` / ease-out). |
| Pinch-to-close | — | **Disabled** | PhotoSwipe default is wrong for screenshots (pinch is the job). |
| 1-finger pan | Canvas, scale>1.02 | Translate, clamp to bounds | Rubber-band at edges; hard-clamp on release. |
| 1-finger vertical drag | Canvas, scale≤1.02 | Dismiss | Commit if **translationY > 96px OR velocityY > 0.5 px/ms** (96px ≈ 2× 44pt; Photos-like). Else snap back 200ms. Fade backdrop with `1 - (dy / 320)`. |
| 1-finger horizontal swipe | Canvas, scale≤1.02, gallery n>1 | Previous/next | Threshold **50px / 250ms** (PhotoSwipe v3) **or** 0.3 viewport width, whichever first. `loop: false` always. |
| Two-finger rotate | — | **No-op** | Don’t steal pinch. |
| 3-finger | — | Ignore | HuggingFace: freeze pinch baseline at 2 pointers. |
| Edge touch | Overlay, x<20 or x>W−20 | `preventDefault` on `touchstart` `{passive:false}` | Only while viewer is open. Don’t apply on the transcript. |
| iOS `gesturestart/change/end` | Overlay | `preventDefault` | HuggingFace finding. |
| Esc | Viewer | Close, **0ms** | Keyboard rule. |
| ← → | Viewer gallery | Prev/next, 0ms | Disabled at ends (`loop: false`). |
| + / = | Viewer | Zoom in one step (×1.25), 0ms | Required 2.5.1 control. |
| − | Viewer | Zoom out ×1.25, 0ms | |
| 0 | Viewer | Reset to fit, 0ms | |
| 1 | Viewer | Jump to 1:1, 0ms | Coding-agent specific. |
| Space | Viewer | Toggle chrome | Optional; don’t steal composer Space (composer is inert while modal). |

**Card must not capture vertical pan.** The transcript owns scrolling. Card `touch-action: manipulation` + React Aria press. No `pointermove` pan on the card.

### 2.4 Zoom model (do not copy PhotoSwipe’s 2.5× blindly)

PhotoSwipe secondary = **2.5× of fit**. HuggingFace double-tap = **2.5×**. That is a **photo** default. A pi screenshot is often a **390×844pt iPhone capture** or a **retina 3× PNG**. The useful second stop is **1 CSS pixel = 1 screenshot pixel** (`scale = naturalWidth / (clientWidth * devicePixelRatio)` wait: 1:1 means `displayed CSS px per image px = 1`, i.e. `scale = naturalWidth / renderedWidth_at_fit` such that one image pixel occupies one CSS pixel).

| Level | Definition |
|---|---|
| `fit` | Entire image visible; letterbox on bone/carbon (`#f8f8f6` / dark canvas). Never upscale past 1:1 on open. |
| `1:1` | One image pixel = one CSS pixel (read 11pt UI text in a screenshot). Double-tap target. |
| `max` | `min(4 × fit, 2 × 1:1)` | Pinch ceiling. |

If 1:1 ≤ fit (tiny icon), double-tap is a no-op and Close/backdrop tap dismisses (`clickToCloseNonZoomable` equivalent). Show zoom buttons anyway (disabled) so 2.5.1 is met.

**Pan alternatives (2.5.7):** while zoomed, expose four 44×44 pan buttons in the chrome (or a single “Move” cluster) **and** keyboard arrows. They may visually hide with chrome; they remain in the accessibility tree or reappear when VoiceOver is on (`window.navigator` cannot detect VO reliably — keep them in the Dialog, `aria-hidden` only when chrome is visually hidden **and** not a screen-reader… actually: **never `aria-hidden` the zoom/pan controls**. Hide visually with `opacity` / off-screen only for sighted chrome-toggle; AT always gets them).

### 2.5 Focus order

On open (React Aria Dialog default + explicit tab order):

1. `Dialog` title (visible or `slot="title"` sr-only): `Screenshot · {index} of {count}` plus status (`Redacted`, `Unavailable`).  
2. Close  
3. Zoom out · Zoom in · `1:1` · `Fit`  
4. Previous · Next (omitted if count=1)  
5. Share (omitted if capability off)  
6. Canvas is `tabIndex={-1}` with `aria-labelledby` title and `alt` from the redacted caption (`Screenshot from pi, {w}×{h}, {mime}`). Not in the tab loop.

On close: restore focus to the **card** for that `block.id`. If the virtualizer has not yet remounted it, `requestAnimationFrame` double-wait then `querySelector('[data-block-id="…"]')`.

VoiceOver: card name `Screenshot, {caption}, {status}`. Custom action `Open full screen` (iOS `accessibilityCustomActions` analogue = `aria-haspopup="dialog"` + the button itself). Announce completion via existing `aria-live` polite region: `Screenshot ready` / `Screenshot blocked: {reason}` (extend `blockLabel` in `App.tsx`).

### 2.6 Loading, error, redaction (gesture-facing)

| State | Card | Viewer | Gestures |
|---|---|---|---|
| `skeleton` | Aspect-ratio box, parchment pulse, **not** tappable to open | n/a | Scroll only |
| `ready` | Thumbnail from digest URL | Pinch canvas | Full table |
| `failed` | Clay `!` 20pt in 44pt, title `Screenshot unavailable` | Dialog with retry **if** retry is a read (GET artifact). No canvas | Tap opens blocked dialog; Esc/Close |
| `redacted` | Same card chrome, hashed placeholder, subtitle `Redacted · {reason}` | No pixels. Body: reason + digest prefix + policy version | No pinch. Close only. Do not offer Share/Copy |

Retry is **not** a mutation ticket unless the protocol says so; artifact GET is read-only. Fail closed: digest mismatch → `failed`, never display bytes.

Streaming: card appears in `skeleton` as soon as the block id exists (so the virtualizer can measure). Do not open until `ready`. If the user taps during skeleton, no-op (or open blocked “Still receiving”). Prefer no-op to avoid a flash of empty modal.

`preloaderDelay`: PhotoSwipe **2000ms** is too slow for a 50ms cache hit. Use **200ms** before showing a spinner in the viewer.

### 2.7 Upload / delivery / security as they affect interaction

This lens does not invent the wire format; it constrains UX around it:

- Card `src` = `/artifacts/{opaqueId}?rev={n}&digest={hex}` (or equivalent). **No** `file://`, no host paths in `alt`, `title`, menu, or `download` filename. Filename in Share: `pi-screenshot-{id-prefix}.png`.  
- Thumbnail ≤ card CSS size × `devicePixelRatio` (cap 3). Full bytes fetched **on open**, not on transcript paint (keeps list scroll cheap). Show thumbnail in the FLIP open if already decoded.  
- Long-press **Copy image** uses `ClipboardItem` with the sanitized blob; if the Clipboard API rejects, hide the item (don’t copy a URL).  
- **Share** uses `navigator.share({ files: [file] })` when allowed. iOS PWA Share is the realistic “Save to Photos” path (`<a download>` is unreliable). Default **capability off** until a security pass signs off (pixel OCR can leak secrets redaction missed). When off, menu is only **Open**.  
- Haptics: **do not spec** `navigator.vibrate` — iOS Safari/PWA generally ignores it. Press scale 0.98 is the feedback.

### 2.8 Visual / motion (locked palette, executable)

- Card: bone fill, carbon hairline, 16px radius, Inter title 15–16px medium, Source Serif not used on the card (Claude puts serif on prose, sans on the artifact). Thumbnail right, 48×48 to 72×72, 8px radius, `object-fit: cover`. Clay accent only on focus ring / failed bang.  
- Viewer backdrop: carbon at **0.8** opacity (PhotoSwipe `bgOpacity`). Image on bone in light, `#101319` in dark (existing theme-color).  
- Open: FLIP from card thumbnail → canvas, **333ms**, `cubic-bezier(.4, 0, .22, 1)`. If `naturalWidth > 4000` or `prefers-reduced-motion`, skip FLIP (`showHideAnimationType: 'none'`). Exit at **75%** of enter ≈ **250ms**.  
- Chrome show/hide: opacity 150ms, no movement.  
- Dismiss drag: transform follows finger (no duration). Snap-back 200ms ease-out.  
- Zoom/pan: **no CSS transition on transform while pointers are down**.  
- Reduced motion: instant cut; chrome always visible (no auto-hide).  
- Dark/light: follow `data-theme`; WCAG AA on Close/zoom glyphs vs backdrop (3:1 UI).

### 2.9 History / Back

**Recommended default for this app:** **do not `pushState`**. Pi Remote is already a single-document session view; standalone PWA then **keeps edge-swipe off**. Close via X, Esc, vertical drag, VoiceOver Close. Hardware Back in Safari (not standalone) still pops the **session** — document that as a known gap or intercept `popstate` only if you later opt into history.

If product later wants Android/Safari Back-to-close: `pushState({ viewer: blockId })` on open, `popstate` closes, and enable the 20px edge `preventDefault` while open so a pan from the left does not pop twice.

### 2.10 Test matrix (gesture QA)

On a real iPhone, installed PWA **and** Safari tab:

1. Scroll the transcript over a card — must not open.  
2. Tap card — opens; focus on Close; VoiceOver names the dialog.  
3. Long-press card — menu; lift without choosing — card remains; no viewer.  
4. Open, pinch in/out, double-tap to 1:1, pan, double-tap back to fit.  
5. Vertical drag 40px — snaps back. Drag 120px — closes, focus on card.  
6. Zoomed vertical drag — pans, does not close.  
7. Two-finger pinch near left edge — does not trigger Safari Back.  
8. Rotate phone — canvas re-fits; no horizontal document scroll.  
9. Reduce Motion on — instant open/close; zoom still works.  
10. Magic Keyboard: Esc, +, −, 0, 1, arrows.  
11. Redacted card — dialog with no image, no Share.  
12. Digest fail — failed card, retry GET only.  
13. Two images in one turn — gallery swipe, `1 of 2`, no loop from 2→1.  
14. Open viewer, receive a transcript snapshot that revises the block — viewer stays on the same id/rev or fail-closes if digest changes.  
15. Composer focused → tap card: blur first, then open (avoid PWA height shrink).

---

## 3. Divergent / minority ideas worth considering

Resist the Photos clone. These are evidence-backed alternatives, not decorations.

**A. 1:1 as the primary “zoom” stop (recommended divergence).**  
PhotoSwipe/HuggingFace 2.5×-of-fit is for vacation photos. For a coding screenshot, 2.5× of a letterboxed 390pt-wide capture is an arbitrary crop. Double-tap → **actual size** is the feature. Keep 2.5× only as a hidden `max` if 1:1 is still unreadable (rare).

**B. Disable pinch-to-close (recommended).**  
PhotoSwipe’s `pinchToClose: true` collides with “I am inspecting a dense UI.” Vertical-drag-at-fit + Close + Esc is enough dismiss. Pinch-to-close is how people accidentally lose their place.

**C. In-transcript loupe, no modal.**  
Apple documents touch-and-hold as a **magnifier** for text. A 96–128pt circular loupe at 2× following a finger on the **card** lets an operator read a toast without covering the composer. Minority: high implementation cost, fights long-press menu, still needs a modal for 1:1 of a full screen. Consider as a **later** overlay on the card if fullscreen feels heavy.

**D. In-place expand instead of a modal.**  
Twitter/X expands media in the timeline. Conflicts with `@tanstack/react-virtual` (row height jump, `measureElement` storms) and with composer occlusion. Reject unless the virtualizer is replaced. Conduit and Happy both used a **modal** for a reason.

**E. Peek-then-commit (iOS context-menu preview).**  
Long-press lifts a preview; tap preview opens F6; actions sit beside. Matches Photos/Mail. Cost: custom preview animation in a PWA will look “off” vs UIKit. A React Aria `Popover` with the full-res image is the honest web version. Do **not** combine with `-webkit-touch-callout`.

**F. View-only: no Share, no Copy, no Save.**  
Pixel buffers can contain secrets (tokens in a terminal screenshot) that string redaction never saw. Fail-closed interaction = **look, don’t exfiltrate**. Menu collapses to nothing; long-press disabled. This is the strongest security-aligned gesture set and the opposite of ChatGPT/Kimi “save image.” Flag it.

**G. `pushState` Back-to-close vs keep standalone swipe-free.**  
Picking both is how you get accidental session-exit. Choose one (spec default: no history).

**H. Horizontal filmstrip of session screenshots.**  
iOS Photos bottom scrubber. Useful when pi dumps a sequence (`before.png` / `after.png`). Cost: extra 44+8+thumb height, more artifact fetches. If gallery count ≤ 3, swipe-only is enough (`loop: false`).

**I. Two-finger rotate 90°.**  
Landscape captures in a portrait PWA. WCAG 1.3.4 is about **not locking device orientation**; rotating the bitmap is extra. Easy to confuse with pinch. Skip unless operators ask.

**J. Native `<dialog>` instead of React Aria Modal.**  
Safari 15.4+ `<dialog>` + `::backdrop`. Would fight the already-adopted RAC overlay (composer tools, header sheets) and lose `--visual-viewport-height`. Stay on RAC.

**K. Don’t steal the 20px edge — leave Safari Back intact.**  
If the viewer never pans at x<20, you can skip `preventDefault`. Then a left-edge swipe in Safari **exits the viewer only if you pushed history**, else exits the session. Worse. Prefer the deadzone **while open**.

**L. Single-tap on card = select, second tap = open (mail-style).**  
Adds latency. Chat apps do **one tap to open**. Don’t.

**M. Auto-open the viewer when pi emits a screenshot.**  
Violates the motion/frequency gate and plan-mode calm. Card in flow is the notification. The existing `aria-live` “block completed” is enough.

**N. Hardware-keyboard-only chrome (no on-screen zoom buttons).**  
Fails WCAG 2.5.1. Buttons are not optional.

---

## 4. Open questions + risks

1. **F6 ownership.** This repo has no viewer yet; composer has no attach chip. Confirm F6 is a shared `ImageViewer` module before inbound lands, or inbound will fork gestures.  
2. **Protocol kind vs tool_result.** If inbound images stay inside `tool_result`, `isEvidenceBlock` will hide them. The gesture spec assumes a **promoted** block.  
3. **Share/Copy capability.** Security vs Kimi/ChatGPT “save.” Needs an explicit product bit; default off.  
4. **History vs standalone edge-swipe.** Mutually exclusive niceties.  
5. **Double-tap delay vs tap-to-toggle-chrome.** PhotoSwipe lives with it; HuggingFace does too. Measure on-device whether 300ms makes Close feel sticky.  
6. **`gesturestart` preventDefault** can break other listeners (GLightbox broke inline links). Keep it scoped to the overlay node.  
7. **Virtualizer + FLIP.** Measuring a recycled row yields a wrong origin. If FLIP looks drunk, disable it (`maxWidthToAnimate` or always none on iPhone).  
8. **PWA keyboard-shrink** after composer use: if the overlay is `100dvh` of a shrunken visual viewport, Close sits in a black band. Blur-then-open is mandatory; consider OpenClaw’s standalone lock.  
9. **`viewport-fit=cover` missing** — fullscreen Close may sit under the notch until the meta tag is added.  
10. **Low-vision page zoom (1.4.4).** Overlay `touch-action: none` is OK only while open; verify transcript pinch-zoom still works.  
11. **Claude Code iOS is not a gesture oracle.** Copying its file-chip would “match Claude” in the wrong product.  
12. **Kimi Code mobile image-viewer gestures are unpublished.** Do not invent a Kimi pinch contract; cite Kimi for card/composer geometry only.  
13. **Mobbin MCP unauthenticated here.** Visual claims on Mobbin URLs should be re-checked with a Pro session before locking thumbnail size.  
14. **Haptic gap.** No reliable PWA haptic; press-scale is the only native-feeling confirmation.  
15. **Gallery across turns.** Should swipe include every image in the session or only the current turn? Session-wide swipe can surprise; turn-local is safer.

---

## 5. Sources

### Local (this repo)

- `apps/pi-remote-web/src/App.tsx` — virtualizer, `isEvidenceBlock`, unknown-block renderer, `aria-live`  
- `apps/pi-remote-web/src/SessionComposer.tsx` — existing RAC `Dialog`/`Popover`  
- `apps/pi-remote-web/src/style.css` — `touch-action: manipulation`, 2.5rem composer targets, 2.75rem header, `overscroll-behavior: contain`, reduced-motion nuke  
- `apps/pi-remote-web/index.html` — viewport meta (no `viewport-fit=cover`)  
- `packages/pi-rpc-protocol/src/types.ts` — outbound `ImageContent`; transcript kinds without image  
- `apps/pi-remote-relay/src/store/redaction.ts` — path/secret redaction (no pixel policy)  
- `docs/feature-catalog/pwa/typed-block-transcript.md`  
- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`  
- `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`  
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`

### Apple / WCAG / web platform

- https://developer.apple.com/design/tips/  
- https://developer.apple.com/design/human-interface-guidelines/buttons  
- https://developer.apple.com/design/human-interface-guidelines/gestures  
- https://developer.apple.com/design/human-interface-guidelines/context-menus  
- https://codershigh.github.io/guidelines/ios/human-interface-guidelines/interaction/gestures/index.html  
- https://learnui.design/blog/ios-design-guidelines-templates.html  
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html  
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html  
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html  
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced  
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements  
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action  
- https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport  
- https://react-aria.adobe.com/Modal  
- https://github.com/adobe/react-spectrum/issues/6553  
- https://www.cogapp.com/blog/what-makes-an-image-viewer-accessible  
- https://pqina.nl/blog/blocking-navigation-gestures-on-ios-13-4/  
- https://github.com/biati-digital/glightbox/issues/146  
- https://dev.to/cederhook/fixing-the-ios-standalone-pwa-keyboard-bug-that-shrinks-your-viewport-for-good-63d  
- https://gist.github.com/fozzedout/5e77925381991a9570151550992baf14  

### Lightbox / chat-image prior art

- https://photoswipe.com/options/  
- https://photoswipe.com/adjusting-zoom-level/  
- https://photoswipe.com/click-and-tap-actions/  
- https://github.com/dimsemenov/PhotoSwipe  
- https://github.com/huggingface/chat-ui/commit/2ef6c831a386a9a03488339cddef1145dc363630  
- https://github.com/slopus/happy/pull/1424  

### Coding-agent / remote-CLI clients

- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md  
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/session.md  
- https://github.com/anthropics/claude-code/issues/40157  
- https://github.com/anthropics/claude-code/issues/41300  
- https://github.com/anthropics/claude-code/issues/61995  
- https://github.com/dibstern/conduit  
- https://github.com/Shahfarzane/opencode-mobile  
- https://github.com/openclaw/openclaw/pull/76072  
- https://github.com/alfaoz/opencode-see-image  

### Target-bar apps

- https://apps.apple.com/us/app/claude-by-anthropic/id6473753684  
- https://support.claude.com/en/articles/8114491-get-started-with-claude  
- https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312  
- https://www.kimi.com/zh-cn/help/new-user-guide/overview  
- https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html  

### Mobbin screens / flows

- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 — Claude iOS chatting with image input  
- https://mobbin.com/explore/screens/3aa59b0a-9d5e-451b-af8d-21acfd81064b — ChatGPT iOS dark-mode conversation with generated images  
- https://mobbin.com/explore/screens/b4f9821b-3cdf-4876-8691-e4b7741637bc — Dropbox iOS image viewer  
- https://mobbin.com/explore/screens/5f30acbd-31c4-4515-97f2-2a198c9a7cd5 — Zenly iOS photo preview overlay  
- https://mobbin.com/glossary/gallery — gallery / fullscreen overlay vocabulary
