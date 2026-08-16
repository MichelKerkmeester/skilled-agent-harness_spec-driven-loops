<!-- provenance: external-CLI orchestration pass; original file iter-08-grok.md -->
> **Source pass 8** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-8-grok.md`.

<!-- F5-media-upload | model=grok | lens=visual-motion | iter 8/15 | 2026-08-15T20:18:31.709Z -->

# Visual-motion research pass — composer media attach (iteration 8/15)

**Lens:** visual + motion polish in the fixed ink-on-parchment system (light + dark), spacing/typography, and restrained motion matching Claude iOS and Kimi Code — on an installable iPhone PWA (React 19 + Vite + Tailwind 4 + react-aria-components).  
**Register:** Product surface (design serves the task). Motion ceiling is short state/feedback only; accent stays Restrained; copy stays functional. [sk-design register](https://developer.apple.com/design/human-interface-guidelines/motion)  
**Non-goal of this pass:** inventing a new palette, serif pairing, or Liquid Glass chrome. The tokens in `apps/pi-remote-web/src/style.css` are locked.

---

## 1. Findings (visual-motion, iPhone PWA + this stack)

### 1.1 What Claude and Kimi actually put on screen

Claude’s mobile composer is a single warm island: plus at lower-left, text growing upward, one circular primary on the right. Anthropic documents the plus as the entry for additional options, including files/photos; the iOS app also exposes camera/gallery/files from that plus (including in voice mode). ([Claude Help: Get started](https://support.claude.com/en/articles/8114491-get-started-with-claude); [Claude Help: Upload files](https://support.claude.com/en/articles/8241126-upload-files-to-claude); [TestingCatalog voice-mode plus menu](https://www.testingcatalog.com/anthropic-begins-testing-voice-mode-with-three-voices-in-claude-app/); [Mobbin: Claude iOS “Chatting with Claude (image input)”](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1); [IXD@Pratt Claude mobile critique](https://ixd.prattsi.org/2026/02/design-critique-claude-mobile-app/))

Repo-local teardown of Claude at ~390pt: island radius ~22–26pt, plus 20–22pt glyph in a ~44pt hit, clay filled send ~40–44pt, placeholder “Reply to Claude”, disclaimer ~12–13pt muted above the island. Pi Remote already copied that island: `.composer-tray` radius `1.75rem` (28px), plus/primary `2.5rem` (40px), placeholder “Reply to Pi”, disclaimer `0.75rem` centered. (`apps/pi-remote-web/src/style.css` `.composer-*`; `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`; `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`)

Kimi mobile: plus on the input opens **文件 / 照片 / 本地文件 / 微信文件**; voice is a separate glyph. ([Kimi 新手入门 · 手机输入框](https://www.kimi.com/zh-cn/help/new-user-guide/overview))  
Kimi Code (the coding-agent bar): plus or `@` for media; PNG/JPEG/GIF/WebP/HEIC + MP4/WebM/MOV; paste/drop compresses to ~2MB (5MB original); picker 10MB image / 20MB video; **max 9 files / 80MB per message**; non-multimodal models are filtered out when media is present. CLI shows a text placeholder such as `[#image 1]` rather than a cinematic viewer. ([Kimi Code VS Code core operations](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html); [Kimi Code CLI interaction](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html))

ChatGPT iOS (secondary): Mobbin describes a composer with a **camera icon** for image input, not only a plus. ([Mobbin: ChatGPT iOS Chat Interface](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1))  
Slack iOS (composer-with-photo prior art): selected photo sits in the composition field with keyboard and send still visible. ([Mobbin: Slack iOS Message Composition](https://mobbin.com/explore/screens/d9cdc41b-1658-471f-a65f-fe772fa3f4ed))

**Implication:** matching the target bar means (a) attach lives behind the existing plus, not a new persistent camera glyph, (b) previews occupy the island *before* send, (c) sent media belongs to the user column, (d) Kimi Code’s count/size caps are the coding-agent numbers to beat or meet, not Claude.ai’s 20-file/500MB chat caps.

### 1.2 The PWA cannot wear native picker clothes

A native Claude/Kimi iOS client can embed PHPicker (inline, compact, continuous selection) and a custom plus sheet. WWDC23 documents `.photosPickerStyle(.inline | .compact | .presentation)` — **UIKit/SwiftUI only**. ([WWDC23 10107](https://developer.apple.com/videos/play/wwdc2023/10107/); [WWDCNotes](https://wwdcnotes.com/documentation/wwdc23-10107-embed-the-photos-picker-in-your-app/))

Pi Remote is a PWA. The only gallery/camera path that works without a native shell is `input type="file"` / React Aria `FileTrigger`. On iOS Safari that presents the **system** action sheet (Take Photo / Photo Library / Choose File). The page does not get PhotoKit, does not get a compact recent-photos rail, and **cannot restyle that sheet**. ([web.dev: Capturing an image from the user](https://web.dev/articles/media-capturing-images); [MDN `capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture); [David Dal Busco PWA photo/library](https://daviddalbusco.com/blog/take-photo-and-access-the-picture-library-in-your-pwa-without-plugins))

`capture="environment"` prefers the camera. On Android it **skips the library**. On iOS it is historically unreliable; Safari often still offers both sources. Do not set `defaultCamera` on the “Photo library” trigger. Use it only on the “Camera” trigger, and still design for iOS showing its own sheet on top. ([web.dev](https://web.dev/articles/media-capturing-images); [React Aria FileTrigger `defaultCamera`](https://react-aria.adobe.com/FileTrigger))

**Motion consequence:** the 300–500ms “sheet present” choreography is owned by iOS, not by us. Spending motion budget on a custom camera shutter or a fake PHPicker rail is wasted and will desync from the system animation. Our motion starts at **chip insert after the sheet dismisses**.

**Gesture consequence:** the file picker must be opened from a **synchronous user tap**. If the plus popover unmounts (or `display:none`s the hidden `<input>`) in the same turn as `input.click()`, iOS can cancel the picker. Hidden `FileTrigger` inputs must live **outside** `.composer-tools-popover` (portaled to `composer-region` / `document.body`), and the popover must stay mounted until `onSelect` or cancel.

### 1.3 Ink-on-parchment vs photoreal pixels

Locked tokens (`:root` in `style.css`):

| Role | Light | Dark |
|---|---|---|
| Canvas (parchment) | `#f8f8f6` | `#181715` |
| Surface (island) | `#ffffff` | `#24221f` |
| Surface muted (user bubble) | `#efeeeb` | `#302e2a` |
| Ink | `#121212` | `#f4f1eb` |
| Ink muted | `#6c6a65` | `#b5afa5` |
| Line | `#e7e6e1` | `#3b3934` |
| Clay accent | `#d97757` | `#d97757` (stronger `#e18b6c`) |
| Accent-soft / accent-ink | `#f3e4de` / `#8a452f` | `#3a2720` / `#f0b19a` |
| Shadow | `0 4px 20px rgb(0 0 0 / 4%)` | `… / 24%` |

Contrast of these pairs is already asserted in `apps/pi-remote-web/tests/contrast.test.tsx` (WCAG 2.x 4.5:1 text, 3:1 non-text). Apple Dark Mode: do **not** invert or recolor photographs; invert chrome, keep image pixels. Aim ≥4.5:1 text, ≥7:1 for small custom type. ([Apple HIG Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode); [WCAG 1.4.3](https://www.w3.org/TR/WCAG22/); [WCAG 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast))

Photos are the only large saturated objects in this UI. If they sit flush as iOS-generic 12pt-radius squares on `#ffffff`, they read as ChatGPT/Slack, not parchment. The one distinctive, still-restrained treatment: a **3px bone mat** (`--canvas`) plus 1px `--line` around each thumb, so the photo is “tipped onto the page.” Do not add Polaroid captions, film sprockets, drop shadows beyond `--shadow-raised`, or clay color overlays on the pixels.

Apple: display images at intended aspect ratio; do not stretch. ([Apple Design Tips](https://developer.apple.com/design/tips/)) Use `object-fit: cover` on **composer thumbs** (fixed square) and `object-fit: contain` on **transcript / lightbox** (no crop of the evidence Pi saw).

EXIF orientation: set `image-orientation: from-image` on preview `<img>` so iPhone camera shots are not sideways. ([MDN `image-orientation`](https://developer.mozilla.org/en-US/docs/Web/CSS/image-orientation))

HEIC: iOS Photos default. Safari can often paint a HEIC blob in `<img>`; Claude vision officially lists JPEG/PNG/GIF/WebP only. ([Claude Help: Upload files](https://support.claude.com/en/articles/8241126-upload-files-to-claude); [Anthropic vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)) Visually: if decode fails, show a parchment placeholder (not an empty box) with Inter filename + “Can’t preview this format.” Kimi Code converts HEIC→JPEG on paste; we should too for the bytes Pi receives, but the **composer preview** can keep the local HEIC blob if Safari paints it.

GIF/video: WCAG 2.2.2 Pause, Stop, Hide (A) — moving content that starts automatically, lasts >5s, and sits next to other content needs a pause/stop. Apple Reduce Motion also disables auto-playing animated images. Spec: **never autoplay** GIF/video in composer or transcript; first frame + duration/type badge; tap-to-play in lightbox only. ([WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide); [Apple Reduce Motion](https://support.apple.com/en-us/111781); [accessibilityReduceMotion](https://developer.apple.com/documentation/swiftui/environmentvalues/accessibilityReduceMotion))

### 1.4 Typography: two faces, two jobs

Already shipping:

- Composer input: Inter `1.0625rem` / `line-height: 1.5` (17px). (`style.css` `.composer-input`)
- Assistant: Source Serif 4 `1.1875rem` / `1.62`. (`.block-role-assistant .block-copy`)
- User bubble: Inter `1rem` / `1.5`, trailing, `max-width: min(82%, 46ch)`, radius `1.15rem`.
- Tools labels: Inter `0.68rem`, weight 680, `letter-spacing: 0.04em`, uppercase.
- Disclaimer: Inter `0.75rem`, `--ink-muted`, centered.

Apple minimum body text: 11pt. ([Apple Design Tips](https://developer.apple.com/design/tips/))  
Filename / meta on chips must stay **Inter**, ≥`0.75rem` (12px) `--ink-muted` on `--surface` (already ≥4.5:1 in `contrast.test.tsx`). Do **not** put Source Serif on filenames, MIME types, or “Uploading 2/3” — serif is the assistant’s reading voice, not chrome. ([teardown §1.4](docs/design-reference/mobile-chat-apps/01-visual-teardown.md))

Dynamic Type: sizes are already `rem`. Chip geometry should be `rem` (`4rem` square), not `64px`, so 11pt+ text still fits when the user bumps text size.

### 1.5 Spacing and hit geometry (the 40px vs 44pt gap)

Existing plus/send are **40×40 CSS px** (`.composer-plus` / `.composer-primary` `2.5rem`). Apple HIG: **44×44 pt** hit target; iOS minimum 28×28; centers ≥60pt apart when possible. WCAG 2.5.8 Target Size (Minimum, AA) is **24×24 CSS px** (or equivalent spacing). WCAG 2.5.5 Enhanced (AAA) is 44×44. ([Apple HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons); [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility); [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html))

40px already passes WCAG AA 2.5.8. It **fails** the Apple/Claude 44pt bar. Do not make attach-dismiss glyphs 12pt with a 12pt hit. Pattern: **visible 18pt × on a 28pt bone disc, hit area 44×44** via padding/`::after`, so adjacent thumbs don’t eat the tap. Apple also wants ~12pt padding around bezeled controls. ([HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility))

Composer island padding today: `var(--space-2) var(--space-2) var(--space-2) var(--space-3)` = 8/8/8/12. Attachment rail should use the same inset, `gap: var(--space-2)` (8px), and a **single horizontal row** with `scroll-snap-type: x mandatory` so 9 Kimi-sized items don’t grow the tray into the transcript. Peek the next chip by `var(--space-4)` so overflow is learnable without a scrollbar (hide webkit scrollbar; snapping is the affordance).

User-turn photos: same trailing column as `.block-role-user` (`margin-inline-start: auto`, `max-width: min(82%, 46ch)`). Gap from image mosaic to text bubble: `var(--space-2)` (8px), not the 22–30pt turn gap (that gap is user→assistant). ([research-gpt-luna.md](docs/design-reference/mobile-chat-apps/research-gpt-luna.md))

### 1.6 Motion: Product register, not Claude starburst

Apple HIG Motion (updated 2025-09-09, including Liquid Glass guidance we will **not** copy): motion is purposeful; **don’t animate frequent UI**; make motion optional (not the only channel); let people cancel/skip; Reduce Motion → dissolve instead of zoom/slide. ([Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion); [App Store Connect Reduced Motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/); [Apple Support: Reduce Motion](https://support.apple.com/en-us/111781))

sk-design gate (this repo): 100+/day = no motion; keyboard-driven = instant; Product budget **150–250ms** state, **100–150ms** feedback; compositor properties only (`transform`/`opacity`); **never `transition: all`**; exit ≈ 75% of enter; `prefers-reduced-motion` → opacity/color, not movement. Existing CSS already uses `--duration-fast: 120ms`, `--duration-state: 220ms`, `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` (same as `--ease-out-interface` / ease-out-quint). Spinner is the only loop and is already killed under reduced motion. (`style.css`; `sk-design-interface/references/motion/*`)

Plus press is tens-of-times-per-day. **Do not add scale.** Keep the existing `[data-pressed] { background: var(--surface-muted) }` (HIG still requires a press state). ([Apple HIG Buttons — always include a press state](https://developer.apple.com/design/human-interface-guidelines/buttons); [sk-design micro-interactions](https://developer.apple.com/design/human-interface-guidelines/motion))

Chip insert is occasional → **allowed** 220ms opacity + 8px translateY. Staggering 9 chips at 30ms = 270ms of waiting on a Product surface used while typing. **No stagger.**

Height of the tray must not be animated via `height` (layout thrash, jank on A10/A11 if any leftover devices, and it fights the iOS keyboard). Either instant height or `grid-template-rows: 0fr → 1fr` with `overflow: hidden` for the rail slot only.

**Keyboard is the hard motion.** iOS Safari often does **not** shrink the layout viewport; `100dvh` and `interactive-widget=resizes-content` are Chromium/Android (WebKit bug 259770 still tracks the meta). Sticky `.composer-region { bottom: 0 }` will sit **under** the keyboard unless we follow `visualViewport` (or a keyboard-inset polyfill) and pad/transform the composer. Pi Remote’s `index.html` viewport meta has **no** `interactive-widget`. Attachment rail makes the island taller, so occlusion gets worse. ([WebKit 259770](https://bugs.webkit.org/show_bug.cgi?id=259770); [csswg #10464](https://github.com/w3c/csswg-drafts/issues/10464); [agent-of-empires composer keyboard fix](https://github.com/agent-of-empires/agent-of-empires/commit/d5741f3b59089ccf4d2537636025afcdd571c974); [ios-composer.md](https://github.com/cameronapak/polyfill-virtual-keyboard-api/blob/master/docs/ios-composer.md))

Do **not** run a second CSS transition on the composer while the keyboard is moving. Bind `bottom`/`padding-bottom` to the visual viewport in `resize`/`scroll` of `visualViewport` (or `--keyboard-inset-height`). Pre-lift on `touchstart`/`mousedown` before focus, `focus({ preventScroll: true })`.

Upload progress: `stroke-dashoffset` on a 20pt ring, **linear** (the one place linear is correct — sk-design: linear only for determinate progress). Determinate if `xhr.upload` / fetch ReadableStream progress exists; otherwise a static “Queued” / “Sending” label — **not** a second spinning glyph (send button already has `.composer-spinner`).

Send morph (chip → transcript image) is tempting (View Transitions / FLIP). iOS Safari View Transitions are still uneven; FLIP reads layout. Frequency: once per send, purpose = spatial continuity. Allowed at 220–300ms **if** `prefers-reduced-motion: reduce` skips to instant swap. Default recommendation: **instant swap** — the user already watched the system sheet; a second morph after send feels like delay on a coding remote. Minority idea kept in §3.

### 1.7 Overlay chrome on photos fails AA unless it is opaque

A 12pt white × on a translucent black disc over an unknown photo cannot be proven to meet 3:1 against adjacent pixels (WCAG 1.4.11). Same for “2.1 MB” captions drawn on the image.

**Required pattern:** opaque `--surface-raised` discs/pills that sit on the **mat**, not on the pixels:

- Remove: 28pt circle, `--ink` ×, 1px `--line`, overlapping the top-trailing corner of the mat by 6pt.
- Index (`1`…`9`, matching pi-paster `[#image n]`): 20pt pill, Inter `0.68rem` tabular, `--ink` on `--accent-soft` (clay wash, not clay fill — fill is reserved for Send). Contrast of `#8a452f` on `#f3e4de` is in the inventory.
- State (Uploading / Failed / Redacted): Inter `0.72rem` on a full-width mat caption **below** the thumb, never on the photo.

pi-paster (official Pi package) already treats submitted images as numbered placeholders and renders a conversation preview. Visual alignment with `[#image 1]` on the chip and in the user bubble caption is how a coding-agent remote should differ from consumer Claude. ([pi-paster](https://pi.dev/packages/pi-paster))

### 1.8 Redaction must not be a CSS blur of the real pixels

Relay redaction today replaces secrets/paths/prompts with `[REDACTED_*]` tokens before persist/broadcast. There is **no image block kind** yet. (`apps/pi-remote-relay/src/store/redaction.ts`; `App.tsx` “A redacted `{originalKind}` block cannot be displayed”)

Gaussian blur of a still-attached blob is not redaction: screenshots, GPU tiles, and `elementFromPoint` still hold the photo. After send:

1. Revoke the `blob:` object URL immediately.
2. Replace the composer mosaic with the **relay-projected** card (bytes never stored in the PWA transcript cache).
3. If the projector withholds pixels: parchment card, same geometry as the mosaic slot, clay seal (12pt `•` in `--accent`), Inter “Photo withheld · redacted”, optional `WIDTHxHEIGHT · type` — **no thumbnail, no blur, no broken-image icon**.

Local composer preview (pre-send) **may** show the user’s own photo. That is not a transcript leak.

Fail-closed visual: `--danger-soft` fill, `--danger` 1px line, Inter “Couldn’t attach · over 10 MB” (or type). No retry spinner; a text button “Remove” / “Choose another” at 44pt height.

### 1.9 Prior art in Pi / coding-agent UIs (visual, not infra)

| Client | Visual attach | Notes |
|---|---|---|
| [pi-paster](https://pi.dev/packages/pi-paster) | `[#image n]` placeholder + submitted preview; `/image-compress` | Canonical Pi attachment language |
| [Firstp1ck/pi-package-webui](https://github.com/Firstp1ck/pi-coding-agent-forge/tree/main/pi-package-webui) | Composer uploads, drag/drop/paste, inline images; mobile composer grows from compact | PWA; not ink-on-parchment |
| [wgnr-ai/wgnr-pi](https://github.com/wgnr-ai/wgnr-pi) | Paste/attach images for vision models | Vanilla JS PWA |
| [jbn/piface](https://github.com/jbn/piface) | Session-scoped attachments; mobile **fullscreen compose** on focus | Keyboard-occlusion workaround by leaving the chat |
| [Neonotso/pi-agent-web](https://github.com/Neonotso/pi-agent-web) | iPhone PWA, React 19 + Vite + Tailwind | **File attachment is still a TODO** — no visual to copy |
| Claude Code iOS (bug reports) | Preview can show while relay drops the file | Never treat “thumb visible” as “Pi has bytes” ([anthropics/claude-code#57882](https://github.com/anthropics/claude-code/issues/57882)) |

piface’s fullscreen-compose-on-focus is a minority mobile pattern: it solves keyboard overlap by abandoning the transcript. Claude/Kimi keep the last messages visible above the island. **Do not fullscreen-compose** if visualViewport lifting works; keep it as a fallback for reduced-height + 9 thumbs + keyboard.

### 1.10 Plus menu IA vs motion

Today `ComposerTools` popover is Mode + Commands only (`SessionComposer.tsx`). Design map already reserved “future attach” as the first tools group. (`docs/design-reference/mobile-chat-apps/02-current-ui-map.md`)

Claude: plus → “Add files or photos”. ([Upload files](https://support.claude.com/en/articles/8241126-upload-files-to-claude))  
Kimi mobile: plus → 照片 as a named row. ([Kimi 新手入门](https://www.kimi.com/zh-cn/help/new-user-guide/overview))

Visual spec: new `tools-group` **Attach** **above** Mode (attach is the more frequent plus target once it exists). Two rows, min-height `2.75rem` (44px), Inter `0.95rem` `--ink`, 20pt stroke glyphs matching `PlusGlyph` (`strokeWidth="2.2"`, round caps), **not** filled clay icons. Camera vs library differentiated by glyph, not by color (color-dosage: clay is Send only).

Do not add a persistent camera button beside plus (ChatGPT Mobbin). It would duplicate plus, fight the 40px cluster, and imply getUserMedia.

---

## 2. Concrete spec a build phase can execute

### 2.1 States (composer)

| ID | Condition | Visual | Motion | A11y |
|---|---|---|---|---|
| `idle` | No drafts, no files | Current island. Plus unchanged. Send disabled (opacity 0.4) | None | Plus `aria-label="Mode, commands, and attach"` (label must mention attach once it exists) |
| `menu-open` | Plus pressed | Existing parchment popover. First group: Attach | Existing RAC popover (do not add extra) | `Dialog aria-label="Session tools"`; focus first Attach row |
| `picking` | System sheet visible | Our UI frozen under sheet; do not dim/blur the PWA | System-owned | N/A |
| `armed` | 1–9 local files, text optional | Rail in island; Send **enabled** (clay) even with empty text | Rail slot 220ms opacity+8px Y; chips no stagger | `aria-live="polite"`: “2 photos attached”; each chip `role="listitem"` |
| `uploading` | Ticketed PUT in flight | Determinate ring or “Sending n/m” caption; Send shows existing spinner; island `inert` except Stop | Ring `stroke-dashoffset` linear; no extra spinner | `aria-busy="true"` on rail; live: “Uploading 1 of 2” |
| `rejected` | Type/size/ticket fail | Danger-soft chip, no pixels | Instant | `role="alert"` with reason |
| `sent` | Relay ACK | Rail clears; user-column mosaic appears | Instant (default) | Focus returns to textarea |
| `withheld` | Projector redacted | Parchment withheld card in user column | Instant | Alt/accessible name “Photo withheld, redacted” |

Plan mode: attach **is** allowed (bytes go to Pi for reading). Show existing `.composer-plan-chip` / “Plan · read-only” — do not add a second clay banner on each thumb.

### 2.2 Gestures

| Gesture | Result | Visible alternative |
|---|---|---|
| Tap plus | Open tools dialog | — |
| Tap “Photo library” | `FileTrigger` `acceptedFileTypes={['image/jpeg','image/png','image/gif','image/webp','image/heic','image/heif']}` `allowsMultiple` **no** `defaultCamera` | Same row |
| Tap “Camera” | Same types, `allowsMultiple={false}`, `defaultCamera="environment"` | Same row |
| iOS sheet cancel | No DOM change; popover may remain or close — **close on `onSelect` only**, not on press | — |
| Tap chip | Lightbox `Dialog` on `--canvas`, `object-fit: contain`, Close 44pt | Enter/Space on focused chip |
| Tap × | Remove chip, revoke blob URL | Keyboard Delete/Backspace when chip focused |
| Horizontal swipe on rail | Scroll chips (native pan) | Snap + peek; no swipe-to-delete (too easy to miss) |
| Send (clay) | Ticketed upload then prompt with `[#image n]` placeholders | Existing Enter-to-send |
| Escape | Close lightbox or popover; never cancel an in-flight ticket without Stop | RAC Dialog |

Paste: `onPaste` on the textarea — if `clipboardData.files` has images, same `armed` path as picker (Claude documents paste; Kimi Code documents Ctrl-V). No extra motion. ([Claude Upload files](https://support.claude.com/en/articles/8241126-upload-files-to-claude); [web.dev paste](https://web.dev/articles/media-capturing-images))

Drag/drop: not a primary iPhone path; if `DropZone` is added later, no hover-lift on iOS.

### 2.3 Layout / tokens (copy into CSS)

```css
.composer-attach-rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 4rem;          /* 64px at 16px root; scales with text size */
  gap: var(--space-2);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--space-1);
  padding: var(--space-1) var(--space-1) var(--space-2);
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.composer-chip {
  position: relative;
  scroll-snap-align: start;
  width: 4rem;
  height: 4rem;
  padding: 3px;                     /* bone mat */
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);  /* 8px — smaller than island 28px */
  background: var(--canvas);
}
.composer-chip img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: calc(var(--radius-sm) - 2px);
  image-orientation: from-image;
}
.composer-chip-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 1.75rem;                   /* 28px disc */
  height: 1.75rem;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface-raised);
  color: var(--ink);
  /* expand hit to 44px without moving neighbors */
  box-shadow: var(--shadow-raised);
}
.composer-chip-remove::after {
  content: "";
  position: absolute;
  inset: -8px;                      /* 28+16=44 */
}
.composer-chip-index {
  position: absolute;
  left: 4px;
  bottom: 4px;
  min-width: 1.15rem;
  padding: 0 0.25rem;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent-ink);
  font-size: 0.68rem;
  font-variant-numeric: tabular-nums;
  font-weight: 680;
}
```

**Transcript (user column):**

```css
.turn-media {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
  width: fit-content;
  max-width: min(82%, 46ch);
  margin-inline-start: auto;
  margin-bottom: var(--space-2);
}
.turn-media img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: contain;              /* do not crop what Pi saw */
  background: var(--surface-muted);
  border: 1px solid var(--line);
  border-radius: 1.15rem;           /* match .block-role-user */
}
.turn-media--single img { max-height: 16rem; aspect-ratio: auto; }
.turn-media-withheld {
  display: grid;
  place-items: center;
  gap: var(--space-2);
  min-height: 7.5rem;
  padding: var(--space-4);
  border: 1px dashed var(--line-strong);
  border-radius: 1.15rem;
  background: var(--canvas-subtle);
  color: var(--ink-muted);
  font-size: 0.85rem;
  text-align: center;
}
```

Lightbox: RAC `Dialog` / `Modal`, `--canvas` (not `#000`), header 44pt Close + Inter filename. Dark theme uses `--canvas: #181715`, not a cinema blackout.

### 2.4 Motion table (exact)

Use existing custom properties only.

| Event | Properties | Duration | Easing | Reduced motion |
|---|---|---|---|---|
| Plus press | background only (existing) | — | — | — |
| Tools popover | existing RAC | existing | existing | existing |
| Rail open | `opacity` 0→1, `transform: translateY(8px)→0` | `var(--duration-state)` 220ms | `var(--ease-out)` | opacity 120ms, no Y |
| Chip add/remove | `opacity` | `var(--duration-fast)` 120ms | same | instant |
| Chip press | background on × only | — | — | — |
| Progress ring | `stroke-dashoffset` | real time | **linear** | static percent text |
| Send / clear rail | none | 0 | — | — |
| Lightbox | `opacity` on overlay | 220ms | ease-out | instant |
| Keyboard lift | follow `visualViewport`, **no CSS transition** | system | system | system |
| GIF/video | none autoplay | — | — | first frame only |
| Spinner (send) | existing 0.8s rotate | existing | linear | already `animation: none` |

`@media (prefers-reduced-motion: reduce)` must also kill rail translate and lightbox fade. Do not use the nuclear `* { transition-duration: 0.01ms }` globally (it would flatten Send color). Scope to `.composer-attach-rail, .composer-chip, .media-lightbox`.

### 2.5 Upload + redaction + security (visual contract)

This pass does not design the wire protocol; it specifies what the pixels must show so security posture stays visible.

1. **Limits (match Kimi Code coding-agent bar, tighter than Claude.ai chat):** images JPEG/PNG/GIF/WebP/HEIC; 10MB/file picker; 9 files; 80MB total. Show the cap **before** send: caption “3/9 · 4.2 MB” in Inter `0.72rem` `--ink-muted` under the rail, not on photos. ([Kimi Code core operations](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html))
2. **Ticketed mutation:** the rail is the only surface that may look “pending.” Each chip’s index is the ticket ordinal. Until ACK, the transcript must **not** paint a successful user photo (Claude Code iOS bug: thumb shown, bytes dropped). ([claude-code#57882](https://github.com/anthropics/claude-code/issues/57882))
3. **Fail closed:** rejected chips stay in `rejected` until Remove; Send stays disabled if *all* chips are rejected; mixed set sends only accepted IDs.
4. **Bytes to Pi:** prompt text contains `[#image n]` in send order (pi-paster). Do not dump a data-URL into the visible textarea.
5. **Redaction:** no blur; withheld card; revoke blobs; never cache original pixels in `cache.ts` transcripts.
6. **Plan mode:** same rail; disclaimer already says “actions stay read-only.” No extra animation that implies a write.

### 2.6 A11y checklist (AA)

- WCAG 1.1.1: every chip/transcript img has alt = user-supplied caption or “Photo n, {filename}”; withheld card is text, not an empty img.
- WCAG 1.4.3 / 1.4.11: captions and × sit on opaque parchment; proven pairs from `contrast.test.tsx`. Add tests: `accent-ink on accent-soft`, `ink on surface-raised` for the × disc (light + dark).
- WCAG 2.4.7 / 2.4.13: `[data-focus-visible]` 2px `--focus` ring `outline-offset: 2px` on chips, ×, Attach rows (same as `.composer-plus`).
- WCAG 2.5.8: × hit ≥24px (we use 44px padded); Attach rows ≥44px tall.
- WCAG 2.2.2: no autoplay GIF/video.
- WCAG 2.3.1: no full-screen flash on insert.
- RAC `FileTrigger` child is a real `Button` (not a `<span>`), `aria-label` “Attach from photo library” / “Take a photo”. ([FileTrigger a11y note](https://react-aria.adobe.com/FileTrigger))
- VoiceOver: rail `role="list"` `aria-label="Attachments"`; live region already specified.
- Reduce Motion maps to `prefers-reduced-motion` (Safari honors iOS Settings → Accessibility → Motion).

### 2.7 iPhone PWA chrome

- Keep `env(safe-area-inset-bottom)` on `.composer-region`.
- Add `visualViewport` → `--keyboard-inset-height` on `:root`; `padding-bottom: max(var(--space-3), env(safe-area-inset-bottom), var(--keyboard-inset-height, 0px))`.
- When keyboard height > 0 and chip count > 3, rail stays one row (already); do not wrap.
- `index.html` viewport: leave `interactive-widget` unset until WebKit ships it; JS lift is the path. ([WebKit 259770](https://bugs.webkit.org/show_bug.cgi?id=259770))
- Hidden file inputs: `position: fixed; inset: 0; opacity: 0; pointer-events: none;` **in `composer-region`**, not inside the popover.

### 2.8 What not to build (visual)

- Liquid Glass / extra blur on the island (HIG 2025 motion update is for native materials; parchment is matte; blur is a motion trigger). ([HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion); [Reduced Motion criteria — animated blur](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/))
- Second clay cluster (filled camera button). Clay remains Send + plan chip + index wash.
- Assistant-style serif on chrome.
- Stagger, bounce, spring overshoot (`bounce: 0` if any spring is introduced).
- Fullscreen compose (piface) as the default.
- Black cinematic lightbox.
- Decorative disabled Attach rows when offline — hide or explain (`Reconnect to send` already exists).

---

## 3. Divergent / minority ideas (do not collapse to the plus-menu default)

1. **Skip the custom Attach group; one plus tap = native iOS sheet.** Fewer taps, one chrome layer. Diverges from Claude/Kimi named “Photos” rows, but is more honest about PWA capability. Use if user testing shows double-sheet fatigue.

2. **Paperclip beside plus** (Kimi-like split: plus = tools, paperclip = media). Faster attach, but the island already has a 40px plus; a second 44px control crowds Send. Only if attach outranks Plan/commands.

3. **ChatGPT camera glyph in the island** ([Mobbin ChatGPT](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1)). Fastest camera path; breaks Claude parity and implies in-app capture.

4. **In-app `getUserMedia` parchment viewfinder** with clay shutter. Distinctive, fully brandable motion — and worse than the system camera (permission prompt, no HDR/HEIC pipeline, torch/zoom missing). web.dev still recommends file input first. Reject unless Plan mode needs annotated screenshots.

5. **iMessage-style compact recent-photos rail above the keyboard.** Best attach UX on iOS 17+ native. **Impossible** in a PWA without PhotoKit. Faking it with previously attached blobs is a privacy leak.

6. **Editorial figure treatment:** Source Serif caption under a contained (not covered) image in the user column — “Screenshot 12:41”. Matches parchment reading; diverges from chat chips. Strong if Pi Remote wants to feel like a lab notebook, not iMessage.

7. **View Transition / FLIP send morph** chip → transcript. Premium spatial continuity; risk of 300ms feeling like lag on Tailscale. Ship behind `prefers-reduced-motion` off + a flag.

8. **piface fullscreen composer on focus** when `visualViewport.height < 420` **and** chips ≥ 1. Minority fallback, not default.

9. **Numbered wax-seal only, no thumbnail in composer** (security-maximal). User cannot confirm they picked the right screenshot. Unacceptable vs Claude/Kimi; keep thumbs locally, withhold after send.

10. **Video-first chips** (duration badge, no play) because Kimi Code is multimodal video. v1 photos-only will force a visual redesign if skipped; cheaper to reserve the duration badge slot now (hidden for stills).

11. **Long-press plus = camera.** Haptic Touch is not exposed to PWAs; `contextmenu` on iOS is delayed and fights scroll. Don’t.

12. **Dark-mode 4% black veil on photos** “to settle them on charcoal.” Apple says don’t. A 1px `--line` is enough.

13. **Raise plus/send to 44×44** as part of this feature (currently 40). Out of attach scope but it is the HIG miss that will show up in any screenshot comparison to Claude.

---

## 4. Open questions + risks

1. **Does current iOS Safari honor `capture="environment"` or still always show Take Photo + Library?** If the latter, two Attach rows are duplicate chrome. Verify on the target iOS before locking IA. ([web.dev](https://web.dev/articles/media-capturing-images); historical iOS ignores `capture`)

2. **HEIC preview vs Pi decode.** If the relay/agent only accepts JPEG/PNG/WebP, the composer may show a photo Pi cannot see. Visual must include a “Will convert to JPEG” caption or convert before `armed`. ([Claude formats](https://support.claude.com/en/articles/8241126-upload-files-to-claude); [Kimi HEIC→JPEG](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html))

3. **Keyboard + rail occlusion on installed PWA vs Safari tab.** Some reports say standalone PWAs *do* shrink `innerHeight`; Safari tabs don’t. Need a device matrix (iOS 18/26, Safari vs A2HS) before trusting `--keyboard-inset-height` alone. ([agent-of-empires commit](https://github.com/agent-of-empires/agent-of-empires/commit/d5741f3b59089ccf4d2537636025afcdd571c974))

4. **FileTrigger inside RAC Popover** on iOS: unmount/cancel risk is inferred from WebKit file-input-in-display-none behavior, not proven in this app. Prototype before polish.

5. **9 images × 4rem + keyboard** can still cover the last assistant line. Is covering the last 2 lines acceptable, or do we cap composer max-height below today’s 140px textarea + rail?

6. **GIF in transcript** vs WCAG 2.2.2: if Pi echoes the GIF bytes, the `<img>` will animate. Need `img` → canvas first-frame or `<video muted playsinline>` with controls. Unspecified in current projector.

7. **Mobbin flow pages** for Claude image-input and ChatGPT camera returned metadata without inspectable screenshots in this environment (MCP Mobbin catalog empty; OAuth pending). Measurements in §1 lean on repo teardowns + first-party docs; a later pass should re-open [Claude image-input flow](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1) and [Slack composition](https://mobbin.com/explore/screens/d9cdc41b-1658-471f-a65f-fe772fa3f4ed) authenticated.

8. **Send-button contrast:** white glyph on `#d97757` is already shipping. Chip index correctly uses `#8a452f` on `#f3e4de` instead. Don’t “fix” index by filling clay.

9. **Security/UX lie:** a beautiful thumb is not delivery. Any animation that celebrates send before relay ACK repeats the Claude Code iOS failure mode.

10. **Plan-mode optics:** attaching a photo of a whiteboard while Plan is on looks like an action. If legal/security wants a stronger cue, a static Inter caption “Pi can see this · host stays read-only” under the rail is enough — no extra motion.

---

## 5. Sources

### First-party product + docs
- https://support.claude.com/en/articles/8114491-get-started-with-claude  
- https://support.claude.com/en/articles/8241126-upload-files-to-claude  
- https://support.claude.com/en/articles/10263469-use-claude-app-intents-shortcuts-and-widgets-on-ios  
- https://platform.claude.com/docs/en/build-with-claude/vision  
- https://apps.apple.com/us/app/claude-by-anthropic/id6473753684  
- https://www.kimi.com/zh-cn/help/new-user-guide/overview  
- https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html  
- https://www.kimi.com/en-cn/help/kimi-code/vscode-core-operations  
- https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html  
- https://www.kimi.com/help/kimi-code/faq  
- https://www.kimi.com/help/getting-started/agentic-chat  
- https://pi.dev/packages/pi-paster  

### Apple / WCAG / web platform
- https://developer.apple.com/design/human-interface-guidelines/motion  
- https://developer.apple.com/design/human-interface-guidelines/buttons  
- https://developer.apple.com/design/human-interface-guidelines/dark-mode  
- https://developer.apple.com/design/human-interface-guidelines/accessibility  
- https://developer.apple.com/design/tips/  
- https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/  
- https://support.apple.com/en-us/111781  
- https://developer.apple.com/documentation/swiftui/environmentvalues/accessibilityReduceMotion  
- https://developer.apple.com/videos/play/wwdc2023/10107/  
- https://wwdcnotes.com/documentation/wwdc23-10107-embed-the-photos-picker-in-your-app/  
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html  
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast  
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide  
- https://www.w3.org/TR/WCAG22/  
- https://web.dev/articles/media-capturing-images  
- https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture  
- https://developer.mozilla.org/en-US/docs/Web/CSS/image-orientation  
- https://react-aria.adobe.com/FileTrigger  
- https://react-aria.adobe.com/DropZone  
- https://bugs.webkit.org/show_bug.cgi?id=259770  
- https://github.com/w3c/csswg-drafts/issues/10464  
- https://daviddalbusco.com/blog/take-photo-and-access-the-picture-library-in-your-pwa-without-plugins  

### Mobbin
- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 (Claude iOS — chatting with image input)  
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 (Claude iOS — text input)  
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 (Claude iOS chat detail / upload)  
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 (ChatGPT iOS — camera icon in composer)  
- https://mobbin.com/explore/screens/d9cdc41b-1658-471f-a65f-fe772fa3f4ed (Slack iOS — selected photo in composer)  

### GitHub / coding-agent clients
- https://github.com/Firstp1ck/pi-coding-agent-forge/tree/main/pi-package-webui  
- https://github.com/wgnr-ai/wgnr-pi  
- https://github.com/jbn/piface  
- https://github.com/Neonotso/pi-agent-web  
- https://github.com/anthropics/claude-code/issues/57882  
- https://github.com/agent-of-empires/agent-of-empires/commit/d5741f3b59089ccf4d2537636025afcdd571c974  
- https://github.com/cameronapak/polyfill-virtual-keyboard-api/blob/master/docs/ios-composer.md  

### Design write-ups
- https://ixd.prattsi.org/2026/02/design-critique-claude-mobile-app/  
- https://www.testingcatalog.com/anthropic-begins-testing-voice-mode-with-three-voices-in-claude-app/  

### This repo (ground truth for tokens/motion)
- `apps/pi-remote-web/src/style.css` (`:root` tokens, `.composer-*`, `.block-role-*`, `prefers-reduced-motion`)  
- `apps/pi-remote-web/src/SessionComposer.tsx`  
- `apps/pi-remote-web/tests/contrast.test.tsx`  
- `apps/pi-remote-relay/src/store/redaction.ts`  
- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`  
- `docs/design-reference/mobile-chat-apps/02-current-ui-map.md`  
- `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`  
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`
