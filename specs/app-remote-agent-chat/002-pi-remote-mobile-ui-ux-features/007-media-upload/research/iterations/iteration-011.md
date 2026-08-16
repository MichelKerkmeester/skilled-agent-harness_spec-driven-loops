<!-- provenance: external-CLI orchestration pass; original file iter-11-deepseek.md -->
> **Source pass 11** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-11-deepseek.md`.

<!-- F5-media-upload | model=deepseek | lens=accessibility-i18n | iter 11/15 | 2026-08-15T19:47:54.928Z -->

# Deep-Research Pass 11/15 — Accessibility + Internationalization Lens
**Feature:** Attach photos/media from the iOS gallery/camera into the "Pi Remote" composer.
**Stack:** installable iPhone PWA · React 19 · Vite · Tailwind 4 · react-aria-components · ink-on-parchment system (bone `#f8f8f6`, carbon ink, clay `#d97757`) · light+dark · WCAG AA · security posture: read-only by default, one-use tickets, fail-closed, redaction everywhere.

---

## 1. Findings for this lens (iPhone + this stack, cited)

### 1.1 The accent color fails AA — this blocks every visual state in the attach flow

Computed with the WCAG relative-luminance formula (WCAG 1.4.11 / 1.4.3, `w3.org/WAI/WCAG22/Understanding/non-text-contrast`):

| Pair | Ratio | Verdict |
|---|---|---|
| clay `#d97757` on bone `#f8f8f6` | **2.94:1** | Fails **both** 3:1 non-text (1.4.11) **and** 4.5:1 text (1.4.3) |
| clay `#d97757` on white `#ffffff` | 3.12:1 | Passes 3:1 (UI/large text) only |
| white text on clay (`#fff`/`#d97757`) | 3.12:1 | Fails AA normal text; passes large-text AA (≥3:1) |
| `#c25a2f` on bone | 4.12:1 | Passes 3:1; **fails** AA normal text (borderline) |
| `#b04a1f` on bone | 5.14:1 | **Passes AA normal text** |
| `#a8441f` on bone | 5.62:1 | **Passes AA normal text** |
| ink `#1a1a1a` on bone | 16.37:1 | Passes all levels |

**Implication (build-blocking):** raw clay cannot carry text or be the *only* identifier of the attach affordance, error/success states, focus rings, or the "redacted" marker. The design system must introduce a darkened clay for interactive/text roles (e.g., `#a8441f` light-theme text, with a parallel value recomputed per dark-mode background). The attach icon alone at clay-on-bone also fails the 3:1 non-text rule (1.4.11) — pair it with ink or use the darkened token.

### 1.2 "Dynamic Type" does not apply to a PWA — plan for WCAG Resize + Reflow instead

iOS Dynamic Type (Larger Text) is a UIKit/native-app feature; WebKit does not scale web content from the system font setting. Apple's own web guidance is the legacy `text-size-adjust`, which MDN flags as **experimental / non-Baseline** (`developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust`). What actually drives text size for this PWA:

- **Safari text-only zoom (AA menu) and pinch zoom.** That maps directly onto WCAG **1.4.4 Resize Text** (200% without loss) and **1.4.10 Reflow** (no two-dimensional scrolling at 320 CSS px ≈ 400% zoom of a 1280 px viewport) — `w3.org/WAI/WCAG22/Understanding/resize-text`, `w3.org/WAI/WCAG22/Understanding/reflow`.
- Author duties therefore: **rem-based type sizes, no fixed heights** on chips/composer, never `vw`-unit type (F94 failure), truncation allowed *only* when the full string is available on focus/activation (explicitly permitted by 1.4.4). Do **not** set `text-size-adjust: none` (kills the inflation feature and is per-MDN author-hostile for low-vision users).
- Reflow directives proven in the Understanding doc's own examples apply directly: a horizontally scrolling **carousel of chips passes** only if each single panel fits within 320 px (technique G225); focus must not be obscured by the sticky composer (the "Focus Not Obscured" overlap section of the reflow Understanding doc).

### 1.3 iOS PWA keyboard/overlay behavior is the quiet a11y killer

In a standalone PWA on iOS, the soft keyboard *overlays* the layout viewport. The correct positioning API is `VisualViewport` (`developer.mozilla.org/en-US/docs/Web/API/VisualViewport`, Baseline since 2021, iOS 13+): use `visualViewport.height` + `offsetTop` to pin the composer above the collapsed keyboard, and listen for `resize`/`scroll`. This is also what keeps the **sticky composer from obscuring keyboard focus** (reflow overlap + 2.4.11 Focus Not Obscured Minimum, referenced within the reflow Understanding doc).

### 1.4 Opening the iOS file/documents picker steals focus and collapses the keyboard

The system document picker is a separate process. When the picker opens, the `<textarea>` blurs and the keyboard collapses; on **cancel** the file input fires the standard `cancel` event with no selection (MDN: "the cancel event is fired when… the file picker dialog gets closed, or canceled" — `developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file`). If we do nothing, VoiceOver focus lands on `<body>` and the composer vanishes from under the user's thumb. The build **must** listen for `cancel` (and for `change` with an empty/unchanged list) and restore focus + scroll to the composer, with a main-thread refocus delay to outlive the system sheet dismissal animation.

### 1.5 Native file input is the most accessible picker — hide it correctly, keep it focusable

`<input type="file">` "provides a button that opens up a file picker dialog" in every UA, is Baseline (2015), and is the *only* mechanism that opens the real Photos/documents sheet on iOS — a custom HTML picker that mirrors the photo grid would be a screen-reader disaster (unlabeled grid cells, no pinch/1.4.10 reflow). Right pattern per MDN example: keep the input programmatically-focusable but visually hidden via `opacity:0` — **not** `display:none`/`visibility:hidden`, which AT interprets as non-interactive (MDN file-input example page). `accept` is a hint only; server-side validation is mandatory (MDN). `capture` (non-Baseline, "limited availability") forces the camera; fall back gracefully (`developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture`).

### 1.6 Prior art: FileTrigger already exists in this exact library

`react-aria-components` ships **`FileTrigger`** with `acceptedFileTypes`, `allowsMultiple`, `defaultCamera` ("environment" | "user"), and `onSelect` — wrapping any pressable child (Button/Link/Pressable) — verified in the docs (`react-spectrum.adobe.com/react-aria/FileTrigger.html`). Its own accessibility alert is decisive for this stack: **any `<Pressable>` child must have an interactive ARIA role or use a semantic element** (docs quote), i.e., never wrap a bare `<span role="presentation">`. This gives us the hidden-input mechanics *plus* our semantic `Button` for free.

### 1.7 Open-source chat-with-attachments prior art is confirmatory but not mobile-complete

- **Open WebUI** (`github.com/open-webui/open-webui`, fetched): self-hosted AI chat, **PWA + mobile-first responsive**, chat file loads, **i18n/multilingual** — validates the PWA+attachments+i18n combination, but its file chips are desktop-origin and keyboard/touch semantics are not its strength.
- **LibreChat** (`github.com/danny-avila/LibreChat`, fetched): **19+ languages**, multimodal image upload, artifact preview, secure media serving — good i18n and redac-how-much-to-show reference; no iPhone-first attachment affordance.
- **Claude iOS app and Kimi app (target bars):** **could not be verified headlessly.** The App Store and Mobbin pages 404 on anonymous fetch (see §4, §5). Their composer-attach flows (gallery+camera+preview chip+lightbox) are the UX bar but must be **manually screen-captured** and treated as unverifiable-by-crawl in this pass.

### 1.8 Screen-reader & motion ground rules that shape the spec

- **2.5.8 Target Size Minimum:** 24×24 CSS px minimum; Apple HIG is stricter (≈44 pt) for touch. All attach/remove/preview controls get ≥44 pt hits (hand-tremor benefit explicitly cited in the WCAG doc; `w3.org/WAI/WCAG22/Understanding/target-size-minimum`).
- **2.5.1 Pointer Gestures:** any pinch/path gesture must have a single-pointer alternative — pinch-zoom in the lightbox needs +/− buttons and/or a slider (`w3.org/WAI/WCAG22/Understanding/pointer-gestures`).
- **1.4.11** focus/selection indicators must hit 3:1 against the *adjacent* color (the Understanding doc's focus-indicator rules + technique G195/G207).
- **Reduced motion:** no WCAG 2.2 criterion, but iOS "Reduce Motion" → `prefers-reduced-motion: reduce` is the HIG-backed proxy; motion must never be the sole state carrier (use `<progress>` + text for upload, not a spinner alone).

### 1.9 i18n for filenames, bidi, and numbers is a landmine, not a nice-to-have

- **Bidi filenames:** Arabic/Hebrew names, or mixed Latin+Hebrew like `صور رمضان.jpg`, render scrambled in a truncated chip. Fix with `dir="auto"` or `<bdi>`/`unicode-bidi: isolate` per filename (`developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir`), and for the "keep extension right-aligned under RTL truncation" case, the standard trick is `direction: ltr` + `text-overflow: ellipsis` on the name cell while the page stays RTL.
- **Logical properties:** a full app `dir` flip only works if chips/composer/lightbox use `inset-inline`, `margin-inline-start`, `border-start-*-radius` and flex/grid (not `left/right`); directional glyphs (back/close/expand) must be mirrored. MDN's Logical Properties guide is the reference (`developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values/Basic_concepts`).
- **Numbers/plurals:** "3 files attached" / "1.4 MB" must go through `Intl.NumberFormat` (with the SI-vs-IEC prefix decision made once, per MDN's file-size demo discussion) and locale plural rules — never `n + " file(s)"`.
- **Time stamps** in the transcript and time-ago labels need `Intl.RelativeTimeFormat` / `<time datetime=…>`.

---

## 2. Concrete spec contribution (buildable)

### 2.1 Interaction & component model

States (per draft attachment): `picked → (caption) → queued → uploading → uploaded:redacted | failed → retry`; transcript bubble states: `ingesting → redacted placeholder`.

```
Composer
├─ FileTrigger (photos)            accept="image/*"  allowsMultiple   → hidden input, opacity:0, tabIndex 0
├─ FileTrigger (camera)            accept="image/*"  capture="environment"  defaultCamera="environment"
├─ AttachButton ("Attach media")   semantic <Button>, ≥44×44, aria-haspopup="dialog" (sheet)
├─ ChipStrip  <ul role="list">
│   └─ AttachmentChip <li> [<img alt=""><dir=auto name><size><RemoveButton 44pt>]
│       └─ tap → Lightbox (preview dialog + caption TextField)
├─ SendButton  aria-busy while any chip is queued/uploading
└─ StatusRegion <div role="status" aria-live="polite" aria-atomic="false">
```

**Pick flow.** AttachButton opens the iOS picker (system UI — itself accessible: Photos, Files, Take Photo). Selection returns `FileList` → per-file client preflight (magic-byte type check, HEIC decode via `createImageBitmap`, re-encode to JPEG, **strip EXIF/GPS**, orientation normalize, size cap **10 MB** decoded / reported). Rejections are listed inline in `role="alert"` text (never color-only; 1.4.1 + 1.3.1). The composer stays visible (VisualViewport pinning); on `cancel`/unchanged selection, refocus the textarea + restore scroll.

**Gestures.** Tap = open/activate only. No long-press for destruction; no swipe-to-delete (path-based gesture — fails 2.5.1 without alternative). Removal is a visible 44 pt "Remove photo" button per chip. In the lightbox: pinch-zoom allowed **but** equal-function +/− buttons and an accessible `Slider` (react-aria) are the primary controls; swipe-down-to-dismiss is *prohibited* in favor of the Esc/Close button.

**Focus contract.**
1. Picker cancel/change-empty → refocus composer input.
2. Chip removal → move focus to the next logical chip's remove button (or AttachButton if last).
3. Lightbox opens as a `Dialog` (react-aria `Dialog`/`useDialog`) → FocusScope traps; initial focus on the image (`tabIndex=0` with aria-label "Photo 2 preview"); Esc/Close restores focus to the tapped chip.
4. After send → focus returns to textarea; Composer reveals an editable draft (revision-checked) — never cleared mid-flight (fail-closed retention of the draft).
5. Focus ring: ink outline 2 px offset ≥3:1 on bone in light, inverted edge (bone-on-ink) in dark.

### 2.2 Accessibility annotation table (screen-reader semantics)

| Element | Semantics |
|---|---|
| AttachButton | name: **"Attach photos"**; the two FileTriggers carry the hidden input each with `aria-label`. |
| Chip list | `role="list"` + descendants; chip accessible name = **"Attachment 2 — 1.2 MB"** (name = number, never filename content; see redaction). |
| Thumbnails | `alt=""` (decorative within a labeled chip); lightbox image gets description "Photo N preview". |
| Remove | name "Remove photo 2" (44 pt hit area). |
| Upload state | `<progress value>` with `aria-valuetext`; success/fail = text + icon (≥3:1), inside the `role="status"` region, **debounced 300 ms** to avoid narrating bursts across N files; failures additionally `role="alert"`. |
| Redacted bubble | role core: same information a sighted user has — "Media attachment — redacted by security policy". See §2.4. |
| Errors | `aria-describedby` wired to the composer; `aria-invalid` on offending control. |

### 2.3 Contrast & motion tokens

- **Tokens (light):** interactive text `#a8441f` (5.62:1); UI-fill accents/borders `#b04a1f` (5.14:1); bone backgrounds; continue ink for primary text. **Dark mode: recompute** each accent against the dark backdrop (e.g., darkened bone-on-ink pairs) — numbers above are only for the light theme.
- **Motion:** chip entrance opacity 0→1 + translateY 4 px, 160 ms ease-out; removal 120 ms fade; lightbox 180 ms opacity + 0.98 scale; focus ring none (instant). **All** overridden by `prefers-reduced-motion: reduce` → opacity-only, no parallax/shimmer. Upload progress is a `<progress>` track (static pacing is fine under reduced motion); total decorative motion budget < 250 ms.

### 2.4 Upload, redaction & security lane (a11y-relevant surface)

1. Upload hits a dedicated lane with a **one-use ticket** obtained from the agent host, scoped to (peer, conversation, revision). Reuse/replay → 410/401 (fail closed). Mutation is gated on the draft's revision hash matching the transcript baseline; any mismatch rejects the send (revision-checked fail-closed), surfaced via `role="alert"` with a Retry that re-tickets.
2. Server validates magic bytes + size again, **ingest-normalizes** (re-encode, strip metadata), then **redacts** for the transcript: the stored message carries *only* a blurred thumbnail placeholder + neutral label; the agent receives the bounded bytes for the one run.
3. **Alt-text/redaction parity rule:** the accessible name of a redacted attachment must not leak more than the pixels do. Never set alt = filename or OCR/caption text of a sensitive image. Neutral name: "Media attachment N". The "redacted" seal is conveyed to AT as part of the bubble name so VoiceOver and sight users receive the *same* information (this is the a11y half of "redaction everywhere").
4. Draft bytes stay in-memory blob URLs (`URL.createObjectURL`, revoked on send/remove); nothing cached in the service worker; lightbox renders from the memory blob.

### 2.5 i18n / RTL spec

- UI strings via a message catalog keyed by id (i18next-style); **all** announcement/error/state strings are translated; captions are user content (`dir="auto"`).
- `documentElement.lang`/`dir` derived from settings (or tailnet profile); on flip, verify: chip row order, remove-button inline-edge, lightbox action bar, progress direction, mirrored glyphs (arrow/close) — all via logical CSS.
- **Filename cells:** wrap in `dir="auto"`, `unicode-bidi: isolate`, ellipsis with `title`/`aria-label` carrying the full name; keep extension anchored to the inline-end edge under RTL (ltr-cell trick per §1.9).
- **Formatting:** `Intl.NumberFormat` (byte scale chosen once: **SI base 1000**, agreed UI-side), `Intl.RelativeTimeFormat` for transcript timestamps, `<time datetime="…">`; plural-aware attach strings.
- **320 px reflow audit:** every chip must fit/scroll independently (G225); caption field and status text wrap; composer buttons never overlap at 200% text zoom.

---

## 3. Divergent / minority ideas (resist converging)

1. **Even more secure: two-tier redaction.** Store no thumbnail at all for classified items — transcript bubble = icon + "Media attachment N (restricted)". Simplifies the redaction a11y story but degrades the attachments UX bar set by Claude/Kimi. Worth offering as an admin toggle.
2. **Native `<dialog>` + `showModal()` lightbox** instead of react-aria `Dialog`: free modal semantics + focus trap in WebKit, less to maintain; trade-off: styling/positioning of full-screen sheet is clumsier and closing-behavior customization harder. A legitimate low-code a11y shortcut for this one component.
3. **Inline camera preview via `getUserMedia`** surfaced in-app (Claude-style), rather than delegating to `capture`. Minority because iOS PWA permission prompts are fragile, and it must never be the only path (VoiceOver + single-pointer coverage is worse than the system camera experience) — pair with the `capture` fallback.
4. **Real thumbnail description for non-sensitive items**: if the ticket policy classifies the attachment as non-sensitive (host policy decision), allow a *server-generated* neutral class description ("Screenshot", "Diagram") in alt — better than "Media attachment 2" while still refusing OCR verbatim leak.
5. **Reordering chips with a fully point-free alternative** (Move-up/Move-down buttons per chip) to satisfy 2.5.1/2.5.7 while still offering drag — over-engineering risk for v1; recommend shipping order = selection order.
6. **In-app "Reduce motion" + "Larger text" toggles** as a fallback for users of older iOS where `prefers-reduced-motion` was late or where Safari text zoom is undiscoverable — cheap and egalitarian.
7. **A `role="log"`-style transcript region** that announces pi's *attachment acknowledgement* ("pi received image 2") — helpful for cognitive users; risk of verbal noise; needs a global mute.

---

## 4. Open questions + risks

1. **iOS-quirk matrix — must be device-tested:** Does the standalone (home-screen) PWA reliably open the rear camera from `input accept="image/*" capture="environment"` (capture is non-Baseline per MDN)? Does the Photos sheet return `cancel` when dismissed? Does VoiceOver's double-tap on the hidden-input-driven button reliably open the picker (native sheet, so expected yes)?
2. **Focus-refocus timing:** main-thread refocus after `cancel` must outlive the sheet's dismiss animation on iOS — needs the real delay empirically; wrong timing causes search/type in introduced, which is worse.
3. **Dynamic Type divergence:** confirm that 200% Safari text zoom + 320 px reflow holds with the memo-headers/code blocks already in the transcript (pi's output is long); the attach flow must not regress existing transcript accessibility.
4. **RTL scope:** current app may be LTR-only. Full `dir` flip is a platform-level change — decide whether this feature ships RTL-ready or only architecture-ready; shipping half-flipped is worse than LTR-only.
5. **Dark-mode contrast re-derivation:** all clay derivatives above are light-theme; dark-theme values must be recomputed against the parchment-dark background before the build, and 1.4.11 audited on real panels.
6. **Multi-file bursts & live-region noise:** debounce/throttle announcements; define exact per-batch narration (one line "3 photos attached").
7. **Source access limits (honest reporting):** Mobbin and the Apple App Store pages 404 on anonymous/headless fetch (login/JS-gated), and Apple HIG doc pages render only with JS. The Claude iOS / Kimi target-bar findings therefore rest on **manual, on-device verification**, not on this pass's crawl.
8. **HEIC memory on iPhone:** 10 MB of HEIC decodes to multi-hundred-MB pixel buffers; the preflight must downscale in a Worker to avoid killing the PWA tab mid-upload.

---

## 5. Sources

**Fetched and used as evidence**
- React Aria `FileTrigger` API + its accessibility inline-alert: https://react-spectrum.adobe.com/react-aria/FileTrigger.html
- MDN `<input type="file">` (accept/multiple/cancel event/fakepath/hide-via-opacity pattern/file-size SI discussion): https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
- MDN `capture` attribute (non-Baseline, camera mapping, fallback note): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture
- MDN `text-size-adjust` (experimental / non-Baseline): https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust
- MDN `VisualViewport` (keyboard/zoom positioning baseline API): https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
- WCAG 2.2 Understanding 1.4.11 Non-text Contrast (3:1, focus indicators, essential): https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2 Understanding 1.4.10 Reflow (320 px @ 400%, carousel G225, sticky/focus-obscured overlap): https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- WCAG 2.2 Understanding 1.4.4 Resize Text (200%, F94-vw, truncation-with-full-content rule): https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- WCAG 2.2 Understanding 2.5.8 Target Size Minimum (24×24, tremors/mobile benefits): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2 Understanding 2.5.1 Pointer Gestures (single-point alternative requirements): https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html
- Open WebUI (PWA + mobile + chat file upload + i18n prior art): https://github.com/open-webui/open-webui
- LibreChat (multilingual + multimodal upload + artifacts prior art): https://github.com/danny-avila/LibreChat

**Computed in this pass** (WCAG 1.4.11 luminance formula, per the W3C Understanding doc): all contrast ratios in §1.1.

**Cited but blocked headlessly (flag: verify manually)**
- Apple HIG — Accessibility (JS-gated; 44 pt / contrast / VoiceOver / reduce-motion principles): https://developer.apple.com/design/human-interface-guidelines/accessibility
- Apple HIG — Images (JS-gated): https://developer.apple.com/design/human-interface-guidelines/images
- Mobbin reference flows for Claude / chat attach UIs — **login/JS-gated; 404 on anonymous fetch** (https://mobbin.com/apps returned 404). Screen-level citations must be captured in-app by a human before they can be used as evidence.
- Claude iOS app store listing (404 for anonymous fetch): App Store "Claude" — on-device verification required.
- Kimi app (Moonshot) — no stable crawlable page; on-device verification required for the target-bar claim.
