<!-- provenance: external-CLI orchestration pass; original file iter-11-deepseek.md -->
> **Source pass 11** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-11-deepseek.md`.

<!-- F8-inbound-media | model=deepseek | lens=accessibility-i18n | iter 11/15 | 2026-08-16T04:15:01.343Z -->

```markdown
# Research pass 11/15 — Accessibility + internationalization lens
**Feature:** Inbound media (`image`) content block — inline thumbnail card + full-screen viewer ("the inbound analog of F5") for the Pi Remote PWA.
**Stack:** React 19.1 / Vite / Tailwind 4.1 / react-aria-components 1.11 (verified in `apps/pi-remote-web/package.json`); spec context `specs/002/` (F5 media-upload, F6 file-preview, F7 rich-content-blocks, F8-inbound-media).
**Target bar:** Claude iOS app · Kimi Code app. Design tokens fixed (bone/ink/clay, light+dark, WCAG AA). Security posture fixed (read-only default, one-use ticketed + revision-checked mutations, redaction everywhere).

A11y+i18n is not a bolt-on for this feature: because pi's screenshots are *unpredictable pixels*, every a11y contract that F6 defines for deterministic files (alt text, states, focus, truncation) needs a new decision surface here. This pass is tuned to *this stack on iPhone* and deliberately refuses to just re-state F6.

---

## 1. Findings for this lens (iPhone + this stack, cited)

### 1.1 Screen-reader semantics change between the two surfaces

- **Transcript card is a *functional image*, not an *informative* one.** Per the WAI Images tutorial, an image that is also a control must have an alternative that "describe[s] the functionality of the link or button rather than the visual image" ([WAI Images tutorial](https://www.w3.org/WAI/tutorials/images/) — functional vs informative categories). So the card (`role="button"` via one RAC `Button`, per F6's `specs/002/F6-file-preview/spec.md`) must carry *one* accessible name that names the action + content + safety state (F6 already does this: `Open package-lock.json, JSON code, revision 18, partially redacted.`). The screen reader must never expose the artifact id, digest, or host paths — the same rule the app already enforces for transcripts (`specs/002/README.md` security posture).
- **Full-screen surface is an *informative/complex* image.** In the viewer the same bytes are *content*, so `alt` moves to the WAI "informative/complex" rules ([WAI Images — complex images](https://www.w3.org/WAI/tutorials/images/)); a screenshot of a terminal or diff is a complex image → needs a *short* alt plus an on-demand **long description**, which WAI recommends providing as a programmatically associated text alternative ([WAI Images: complex](https://www.w3.org/WAI/tutorials/images/complex/)). There is no safe way to generate that description from pixels on-device, so the description must be **relay-authored** (`altText` in the F6 `FilePreviewBlock` contract, `specs/002/F6-file-preview/spec.md`) or the polite fallback `Image preview; description not provided.` already fixed by F6.
- **Alt trust boundary:** A PWA previewing remote bytes must treat `alt` as untrusted inbound content — it goes through the same redaction pipeline as the pixels (F6: "Redaction covers … alt text"). A malicious pi/relay alt string must not become a script or a 10-word speech bomb in an announcement region.
- **VoiceOver rotor navigation is a real, cheap win:** keeping the inline `<img role="img">` (not `aria-hidden`) means VoiceOver rotor → Images can jump between pi's screenshots. This is the only "scan the media" affordance a screen-reader user gets in a chat; worth an explicit acceptance test.

### 1.2 Focus management must come from the dialog pattern, with one image-specific tweak

- F6 already pins the full-screen surface to `ModalOverlay / Modal / Dialog` from `react-aria-components` ([RAC Modal/Dialog docs](https://react-spectrum.adobe.com/react-aria/Dialog.html)) with focus-on-open, Tab trap, Escape, `aria-modal`, and dismissal focus restore. The WAI-ARIA Authoring Practices dialog pattern is the normative reference set: focus *into* on open, trap `Tab`/`Shift+Tab`, Escape closes, focus returns to the trigger (and to the containing message/transcript when virtualization removed the card) ([APG Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)).
- Image-specific nuance: APG explicitly permits initial focus to go to a **static element** when dialog content is large/visual ("if the dialog content includes semantic structures … add `tabindex="-1"` to a static element at the start"), and warns *against* giant `aria-describedby` dumps ([APG Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)). For a pure-image viewer, focusing the 44px Close button on open (F6's approach) both satisfies activation order and gives SR users a fast escape; focusing the image region instead prioritizes "read the visual first" — a minority position I develop in §3.
- **Keyboard parity on iPhone is mostly hypothetical but must not break:** hardware-keyboard/Switch-Control users get `+`/`-`/`0` zoom (F6 spec already lists them) and a real Tab trap. `Tab` outside the modal must be physically impossible (RAC Modal overlay handles this) — APG: "attempts to interact with the inert content cause the dialog to close."

### 1.3 Contrast fails on two specific pixels of the *existing* fixed system when images arrive

- `1.4.11 Non-text Contrast` demands 3:1 (not 2.999:1) for UI/state/focus boundaries ([Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)). Measured: **clay `#d97757` on bone `#f8f8f6` ≈ 2.94:1** (computed via the sRGB linear-luminance formula in [Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)) → **fails 3:1**. So clay is unusable as a *boundary/focus/state* indicator on bone, and as *text* on bone it is far below 4.5:1 (`1.4.3`). Clay on carbon/ink passes (~5.4:1), and bone-on-carbon passes (~15:1).
- Implication specific to inbound media: the thumbnail well, the "redacted/withheld" treatment, and the viewer chrome must not lean on clay; they need ink (focus ring), bone-on-carbon (viewer chrome), or a **darkened clay step** for interactive accents. F6 already says clay is "not the sole focus/redaction signal" (`specs/002/F6-file-preview/spec.md`); this pass quantifies why for the image card.
- Screenshots render **arbitrary contrast under the controls**. `1.4.11` is judged against *adjacent* colors; you cannot guarantee 3:1 for a button sitting in the middle of unknown pixels. Therefore controls live on the opaque chrome (header + a chrome footer), never as floating glyphs over image content.

### 1.4 Dynamic type / text scale on iOS is the weakest link, and the report has to be honest about it

- WCAG `1.4.4 Resize Text` requires text to reach 200% "without loss of content or functionality"; author-provided controls (`G178`) are an explicit acceptable mechanism, and `F94` is a failure for "incorrect use of viewport units to resize text" ([Understanding 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)). `1.4.10 Reflow` requires no two-dimensional scrolling at 320 CSS px ([Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)).
- On iOS, Safari/PWA page zoom is *magnification*, not reflow-first (the Reflow Understanding doc itself notes mobile user agents historically "magnify… rather than reflow" [Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)), and the iOS accessibility "Text Size" slider does not reliably scale custom-font web layout. So a PWA must **own** a text-scale path: rem-based sizing everywhere, an in-app ±text control (G178), and *never* `maximum-scale`/`user-scalable=no` in the viewport meta (the ACT test rule `b4f0c3` "Meta viewport allows for zoom" is the compliance check [Understanding 1.4.4 test rules](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)). `text-size-adjust: 100%` keeps iOS's inflation algorithm from fighting the rem base ([MDN text-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust)).
- Concretely for the image card: metadata line (`1280 × 720 · PNG · rev 3 · Redacted`) is the minimum the text-scale will stress; it must wrap (not ellipsize onto a second dimension), and the viewer header already has a two-row layout at 200% (F6 `spec.md`, "At 200% text enlargement, use a two-row header"). Everything must be in `rem`, no px-height clipping (`F80`).

### 1.5 Reduced motion is not cosmetic here

- `2.3.3 Animation from Interactions` (AAA) and the reduce-motion techniques (`C39`, `SCR40`) ground the rule that zoom/scale motion triggered by interaction must be removable ([Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)); MDN confirms a *scaling* animation is exactly the vestibular-trigger class that `prefers-reduced-motion` is for ([MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)). F6 already fixes: overlay fade + `translateY(8px→0)` 220ms enter / 180ms exit / 100ms crossfade replacement, opacity-only ≤100ms (or instant) under reduced motion (`specs/002/F6-file-preview/spec.md`). The image arrives from a modal, not a page-transition, so there is no large offset scroll animation to worry about; the one extra risk is the **thumbnail→viewer "morph"**: an animation connecting the card rect to the full-screen rect is exactly a scale/pan trigger and must be skipped under reduced motion.
- Loading shimmer is fine (opacity/color, no movement; the 2.3.3 definition excludes "changes of color, blurring, or opacity which do not change perceived size/shape/position").

### 1.6 RTL and long-strings: the code-flavoured, bidi-hostile part

- W3C i18n is explicit: **use markup, not CSS, for bidi** — [CSS vs. markup for bidi support](https://www.w3.org/International/questions/qa-bidi-css-markup) and its companion *Inline markup and bidirectional text in HTML*. In an RTL shell, a caption or metadata line containing code tokens, hashes, `PNG`, `1280 × 720`, or a digest must be `dir="auto"`/`<bdi>` isolated, and LTR tokens must stay LTR inside the RTL sentence (a digest must not reorder "on-screen"). F6 already mandates `<bdi>` for filenames and "LTR isolation for code/hashes/MIME/path-like tokens inside RTL shells" (`specs/002/F6-file-preview/spec.md`).
- Long-token handling is a Reflow technique: `C33` "Allowing for Reflow with Long URLs and Strings of Text" is the normative technique ([Understanding Reflow — techniques](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)); `overflow-wrap:anywhere` on the metadata/caption line keeps `rev 3`, digests, and camera-model strings from forcing horizontal scroll. Prefer *full wrap* over middle-truncation for caption text: iOS has no CSS middle-ellipsis, so "middle-truncated where supported" (F6) falls back to end-truncation or wrap, and truncating the *name* is fine but truncating the *redaction state* is not (the accessible name must keep "Redacted"/"Partially redacted").
- Directionality of the zoom cluster is a non-issue (zoom +/- are not directional); only *position* of Close and the chrome flips — build the header with logical properties (`inset-inline-start`, `ms-`, `pe-`) so Tailwind 4's logical utilities and the RAC `dir` prop do the flipping ([RAC Modal `dir` prop](https://react-spectrum.adobe.com/react-aria/Dialog.html); [MDN CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)).

### 1.7 Live region discipline: inbound media is a *stream*, not a static page

- pi pushes many blocks; turning each image into an `alert` announcement is a speech DoS. The F6 answer (one *throttled* `role="status"` + one *non-repeating* `role="alert"` for terminal states, F6 `spec.md`) is the right base. For the transcript, add a **single aggregate polite live region** — e.g. `role="status"` updated to "2 new images from pi" — and stop: the alt text is available when the user lands on the card. An image that *fails* verification mid-stream (digest mismatch, withheld, expired) is the one case for a `role="alert"`, matching F6's "denial, revocation, and terminal corruption" rule and the APG `alertdialog` boundary (never trap the user).
- Loading state in the viewer uses `aria-busy="true"` on the image region while bytes stream + verify, with an `Opening…` polite status (F6), *not* a live announcement per byte.

### 1.8 Prior art that grounds the "content block" decision

- The Anthropic `image` content block (base64 `media_type`/`data`, `url`, `file_id`; 10 MiB/5 MiB caps; JPEG/PNG/GIF/WebP; animated-GIF → first frame; **"Claude does not parse or receive any metadata from images"**) is the de-facto wire shape for agent chat image blocks and is the correct prior-art template for the new `image` transcript kind ([Anthropic Vision docs](https://docs.anthropic.com/en/docs/build-with-claude/vision)). The Files-API/`file_id` branch is precisely the "bytes live server-side, reference by opaque id" pattern this feature needs — it is what avoids copying bytes into every payload/turn (the docs call out request-size growth as the reason).
- The iTerm2 inline-images protocol is the terminal-side prior art for *bounded, sanitized, inline-rendered* bytes: it carries `name`, `size`, `width`/`height`/`preserveAspectRatio`, `inline`, is base64 over the wire, and imposes size caps (1 MiB chunks, 1 MiB overall for the multipart form) ([iTerm2 Inline Images Protocol](https://iterm2.com/documentation-images.html)). Pi Remote is the analogous "terminal" for pi, so size/type bounding + explicit dimension hints next to the bytes is established practice.
- Lightbox prior art with real accessibility is `yet-another-react-lightbox`: keyboard/mouse/touchpad/touchscreen navigation, RTL compatibility, no partially-downloaded-image flashes, captions plugin, responsive srcset (["Yet Another React Lightbox"](https://github.com/igordanchenko/yet-another-react-lightbox)). `react-zoom-pan-pinch` is the gesture library precedent for pinch/pan/double-tap with imperative `zoomIn/zoomOut/resetTransform` — i.e., exactly the "gestures + programmatic single-pointer controls" pairing we need, but it ships **no** role/label semantics for its own controls ([react-zoom-pan-pinch](https://github.com/BetterTyped/react-zoom-pan-pinch)) — we build our own labelled 44×44 buttons on top.
- WCAG `2.5.1 Pointer Gestures`: pinch/spread is explicitly the multipoint example, and `G215` "Providing controls to achieve the same result as path based or multipoint gestures" is the sufficient technique ([Understanding 2.5.1](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html)). This is the normative basis for "every gesture-only function has a visible single-pointer alternative" that F6 already states — for the viewer it means **always-visible** Zoom out / Fit / Zoom in, not controls that appear only on some toolbars.

---

## 2. Concrete spec contribution for the build phase

Applies on top of, and extends, `specs/002/F6-file-preview/spec.md`. Only deltas from F6 are called out.

### 2.1 Protocol: the inbound `image` content block (a11y/i18n fields emphasized)

Follow the F6 `FilePreviewBlock` guard rules (bounded opaque ids, SHA-256 digest, strict unknown-field rejection) and the Anthropic block shape:

```ts
type InboundImageBlock = Readonly<{
  kind: 'image';
  artifactId: string;        // opaque, bounded
  revision: string;          // opaque, exact, NOT coerceable to numeric transcript revision
  digest: string;            // lowercase sha-256, bounded
  mediaType: 'image/png' | 'image/jpeg' | 'image/webp'; // relay re-encode output only
  width: number; height: number;        // relay-measured, incl. for animated→first-frame
  byteLength: number;
  altText: string;           // relay-safe, short, NOT pixel-derived by client
  caption: string | null;    // pi-authored display text, relay-redacted
  description: string | null;// long-description source, relay-redacted, shown on demand
  redaction: 'not-needed' | 'applied' | 'withheld';
  thumbnailRef: string;      // bounded opaque ref, network-only read, no-store
  completeness: 'complete' | 'first-frame';
  content: { kind: 'artifact-ref' } | { kind: 'none' }; // never inline bytes
}>;
```

- **The `image` transcript card replaces the blob of bytes with `artifactId + revision + digest`** — bytes never enter the durable transcript cache, `localStorage`, or the sw (F6 cache rules already forbid this: `specs/002/F6-file-preview/spec.md`). Full and thumb are both network-only reads of the exact tuple; `thumb` is a small bounded variant of the same snapshot so double-rendering can't diverge.
- **Client verifies before paint** (a11y consequence: correct `corrupt` state announcement): fetch → `arrayBuffer()` → `crypto.subtle.digest('SHA-256', …)` → format lowercase hex → compare with `digest` → only then `URL.createObjectURL` + render. Handles the "relay emitted digest mismatch" case as `corrupt`, identical vocabulary to F6.

### 2.2 The transcript card (always-inline, auto-fetches thumb)

- **One RAC `Button`, full-width, min height 68px, 44px vertical target guaranteed by padding** (reuse F6 card metrics: 12px padding, 16px radius, 1px `--line` on `--surface`).
- DOM order inside the button: `<img>` thumbnail (44×44 slot, `alt=""` empty — **decorative at the card level**, because the button already announces the *function*), safe label line, metadata line. Empty alt here is the *correct* WAI choice: the alternative belongs to the functional control, and announcing both would double-read ([WAI Images — decorative](https://www.w3.org/WAI/tutorials/images/)).
- Accessible name (localized), assembled from relay-safe fields only, always ending in the safety state:
  - `altText` or fallback caption or `Screenshot from pi` → then `, {width} × {height}, {size}, revision {revision}` → then `, partially redacted.` / `, withheld.`.
  - Example target: `Terminal after npm run build, 1280 × 720, 2.4 MB, revision 4, partially redacted.`
- **`withheld` card renders no `<img>` at all** (no aspect-ratio leak: fixed placeholder shape, 16:9 slot), accessible name `Preview withheld by relay policy.` — same phrase class as F6 so speech muscle-memory carries over.
- **`applied` (partial redaction)** still shows the re-encoded thumb but flips the metadata to constant-length markers (`—` tokens), never preserving the redacted secret's length (F6 redaction rule).
- The whole card uses `dir="auto"`/`<bdi>` only on caption + metadata tokens; digest/`revision` tokens wrapped in `<bdi dir="ltr">`.

### 2.3 Transcript live-region behavior (the new streaming a11y contract)

- One aggregate `role="status"` near the top of the transcript: on new media batches set text `{n, plural, =1 {1 new image from pi} other {# new images from pi}}` (use `Intl.PluralRules` for the local pluralities; don't hardcode "1 image").
- Mark the pending card `aria-busy="true"` while the thumbnail verifies; the branded line `aria-live` reads the card name anyway when the user lands on it — no per-byte announcements.
- `role="alert"` fires **once** for: digest/verification failure, `withheld` flip, expiry, revocation. It must be the only alert region, reused (F6 rule).

### 2.4 Full-screen viewer (reuses the F6 shell verbatim)

- Same controlled `ModalOverlay/Modal/Dialog`, `viewport-fit=cover`, `--visual-viewport-height` → `100dvh` → `100svh`, safe-area chrome, focus heading → Close → controls order, Tab trap, Escape, Blur-composer, history/edge-back, scroll-offset + focus restore to the card containing message fallback (F6 `spec.md`: `opening`/edge-back sections).
- **Initial focus:** Close button on open (per F6). The image region gets `aria-label` = accessible name used above, and `role="img"`. (Minority alternative in §3.)
- **Long description affordance:** when the relay provides `description` (or a rich caption), render a `Show description` toggle button (44×44 or 44px label row) that reveals it *within the dialog* — never as a second modal and never in `aria-describedby` (APG warning). This is the WAI "complex images" pattern applied to screenshots, and it is the only honest answer to "can't read the terminal output in the screenshot." If none provided: no control, alt falls back to `Image preview; description not provided.` (F6 wording).

### 2.5 Gestures + single-pointer alternatives (normative 2.5.1/G215)

| Gesture | Behavior | Single-pointer/keyboard alternative |
|---|---|---|
| Tap / single-finger tap-reveal | Toggle chrome if hidden; does **not** close | — (tap is the alternative) |
| Pinch in/out | 1× ↔ 4× | Always-visible `Zoom out` / `Fit` / `Zoom in` (44×44, ink-on-carbon) |
| Double-tap | toggle fit ⇄ 2× around the tap point | `+` `-` `0` (hardware keyboard/Switch Control) |
| Pan | only above fit (drag to move) | `arrow keys` when a zoom toolbar or the image is focused |
| iOS edge-back / browser Back / VO two-finger scrub | dismiss to same session | `Close` (44×44, up front), `Escape` |
| Swipe between artifacts | **not in v1** (F6 non-goal) | — |

- The zoom cluster sits in an **opaque carbon chrome footer**, never over image pixels (`1.4.11` adjacency). Only the image stage itself uses `touch-action: none` while custom zoom is active (F6 already permits exactly this) — the viewer/app/transcript keep native pan so VO and Switch Control gestures keep working.
- Zoom controls carry localized `aria-label`s (`Zoom in`, `Zoom out`, `Reset zoom / Fit`) and the throttled status region announces `Zoom 2×`; imperative zoom uses the same 3 commands as react-zoom-pan-pinch's `useControls()` so implementation is exercised the same way ([react-zoom-pan-pinch](https://github.com/BetterTyped/react-zoom-pan-pinch)).

### 2.6 Visual / motion / dynamic type

- Thumbnail slot: `object-fit: cover`, `loading="lazy"` + `decoding="async"` for transcript cards far off-screen; viewer uses `object-fit: contain` on the carbon stage (F6) with **no intrinsic upscaling until requested**; intrinsic `aspect-ratio` declared from relay `width/height` so reflow never jumps.
- Motion: thumbnail**→**viewer may *optionally* run a shared-element scale/pan morph **only when** `prefers-reduced-motion: reduce` is false; under reduce → opacity-only ≤100ms or instant (C39/2.3.3); loading = static skeleton, no shimmer movement.
- Text scale: card metadata wraps (Reflow C33, `overflow-wrap:anywhere`); viewer header two-row at 200%; a `--text-scale` rem multiplier on `<html>` plus in-app ±control (G178) is the honest 1.4.4 path on iOS (see §1.4); viewport meta keeps zoom enabled (ACT b4f0c3).
- Palette discipline on this feature (quantified): thumbnail well border `--line` (ink-derived) not clay; focus ring `ink` 2px offset on bone and `bone` offset ring on the carbon stage; clay allowed only as a large decorative fill paired with ink text (ink-on-clay ≈ 5.4:1 passes), never as a focus/state/divider sole signal (1.4.11 3:1 failure is computed, not asserted).

### 2.7 i18n contract

- Use RAC `I18nProvider` + `useLocale` for `locale`/`dir`, `lang` + `dir` set on `<html>` and the `Dialog` (`dir`/`lang` props exist on RAC Dialog/Modal, verified in the API table on [react-aria Dialog docs](https://react-spectrum.adobe.com/react-aria/Dialog.html)).
- Numbers/units via `Intl` only: `Intl.NumberFormat(locale, { style:'unit', unit:'megabyte' })` for sizes, `Intl.ListFormat` for `1280 × 720` (“×” is a number separator, keep it direction-safe), `Intl.PluralRules` for media-count announcements.
- Localize these new strings at minimum: `new image(s) from pi`, `Screenshot from pi`, `Show description`, `Zoom in/out`, `Reset (fit)`, `Image preview; description not provided.` `Preview withheld by relay policy.`, `removed by the relay`, `This image couldn’t be verified.`, `× {w} × {h}`.
- RTL: logical properties everywhere (`ps-/pe-/ms-/me-`, `start/end`); `<bdi>` + `dir=auto` isolation per caption/metadata; LTR tokens stay LTR (bidi markup over CSS, [W3C bidi QA](https://www.w3.org/International/questions/qa-bidi-css-markup)).

### 2.8 Security/redaction interplay the build must not regress (from this lens)

- Redaction pipeline covers: `altText`, `caption`, `description`, `width`/`height` metadata (if considered sensitive), thumbnail, and **the accessible name** — the *accessibility tree* is a first-class redaction sink (F6 fixture test "redaction fixture … accessibility snapshot" already names it; extend it to the new block's a11y strings).
- `withheld` must not leak aspect ratio, byte lengths, or digest through **constants of fixed length** (constant placeholder slot).
- Alert/status text for errors must be a **redacted diagnostic code, never raw server text** (F6 rule) and never a readable digest/id fragment.
- Full-res fetch happens only for the exact `{ sessionId, artifactId, revision }` tuple with ETag===digest; post-`popstate`/`pageshow` re-authorize before rendering (bfcache rule from F6).
- Bytes + object URLs are revoked on close/replace/delete; thumbnail cache also excluded from sw/localStorage/IDB.

### 2.9 Acceptance tests to add (a11y/i18n only; align naming with F6’s table)

- **Card a11y DOM test:** one button, 44px effective target, accessible name = function+content+redaction state, `<img alt="">` inside, no digest/id/host-path tokens in the name, `dir` attributes correct.
- **Alt trust test:** a fixture alt containing HTML/script/braille-bombish text renders as text only, is stripped when redacted, and the `withheld` name is the constant phrase.
- **Live-region test:** N images → exactly 1 status announcement; digest-fail/withheld → exactly 1 alert class.
- **Focus test:** open → focus Close; tab-cycle stays in dialog; close via edge-back/Escape/VO-scrub → focus restored to card (message/transcript fallback under virtualization) and chat scroll preserved.
- **Contrast test:** compute-step asserts no clay-on-bone boundary/focus/state token in this feature’s CSS; focus rings on both bone and carbon surfaces ≥ 3:1 (CI-style check, since 1.4.11 rejects 2.999:1).
- **Reflow/dynamic-type test:** 200% text scale and 320 CSS px → metadata wraps (no horizontal scroll), header two-row, zoom controls still 44px and reachable.
- **Reduced-motion test:** `prefers-reduced-motion: reduce` → no scale/pan on entry, opacity-only ≤100ms or instant.
- **Verification-fail UX test:** corrupted digest → never paints bytes → `This image couldn’t be verified.` with only Retry/Close.

---

## 3. Divergent / minority ideas (resist convergence)

1. **Alt from the *caption*, not from the pixels — and require pi to co-sign an alt.** Force the content block to carry a `caption` and treat *the nearest pi-authored text* as the identity of the media in the transcript (announce the caption, brand the image with the caption). Marginal but: a screenshot inside a chat is usually *about* the tool_call that precedes it; the image block could legally inherit the *following* text block if empty. This changes "description not provided" from the default to an explicit author failure, and it keeps the relay from ever doing OCR (privacy).
2. **Focus the image itself on open, not Close.** For a media-first view, set `tabindex="-1"` on the `role="img"` region and focus it (APG allows a static focus target). SR users hear the full image name immediately; the tradeoff is one extra action before Close. Test both with real users; keep Close first in DOM order regardless.
3. **Swipe/paging between consecutive images from the same turn** — deliberately rejected by F6, but on inbound media it has *point*: pi frequently sends 2–5 screenshots in a burst, and paging is F6's non-goal. If shipping without it, at minimum batch the transcript live-region so 5 incoming cards read as "5 new images" and don't cascade.
4. **Client-side long-description generation from `document.pictureInPicture`-free fallback: none.** Anyone proposing on-device LLM/OCR for alt must be rejected at the trust boundary: description is *relay-authored prose with its own redaction*, not a client inference that could rebuild withheld content.
5. **`aria-hidden` the thumbnail while its parent card is a button — accept double read during fast-scrub.** Consider: while a user scrubs the transcript, reading both the button name and the caption is actually *redundant reinforcement*; a `caption` ≠ `alt` split (caption in the name, alt withheld to the viewer) reduces chatter. This trades 1.1.1 purity for navigation speed and deserves an A/B on VoiceOver.
6. **Publicate `--text-scale` from the system `prefers-contrast: more` hint** as an *additional* escalation for the low-vision tail: it costs one media query and gives hardware-keyboard/Readers a bigger wedge before in-app settings.

---

## 4. Open questions + risks

- **iOS Dynamic-Type reality gap (highest risk).** Whether Safari/standalone PWA reflows to the system "Text Size" slider is version-dependent; the reliable path is rem base + in-app G178 control + Safari page-zoom. Verify on the oldest supported iPhone: does 200% (I) page-zoom without clipping the zoom control footer, and (II) reflow the two-row header? If page-zoom magnification (not reflow) is all iOS gives, our in-app scale control must visibly reach 200% to keep F6's acceptance statement honest.
- **`prefers-reduced-motion` reach in standalone vs Safari tab:** confirmed supported in modern iOS WebKit ([MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)), but a checkbox must include an in-app "reduce animation" override because the CSS query is the only signal in exile.
- **Middle-truncation fallback:** iOS lacks CSS middle-ellipsis; for the card's filename we must choose full-wrap (recommended) or end-truncation + `title`; the accessible name always carries the full safe string.
- **Alt/caption as injection vector:** must run through the relay redaction pipeline with the *same* fixtures as bytes; the a11y tree is a redaction sink (no HTML, no control characters, bounded length — a "2,000-char alt" is a speech bomb).
- **`bdi` + RAC Button composition:** confirm React Aria's Button semantics survive nested `<bdi>`/`<img alt="">` in the accessible-name computation on iOS VoiceOver (name computed from contents); add a snapshot test.
- **Contrast over arbitrary pixels:** the only reliable containment is chrome-only text; a user-provided dark-mode screenshot sitting under a bone-contrast diff… mitigate by keeping all controls in the opaque header/footer, never clipping the stage.
- **Landscape + Dynamic Island:** `env(safe-area-inset-*)` on header/footer is load-bearing; the zoom footer must not be the ground of the home indicator on iPhones with gesture bars — F6 requires a standalone-mode test of exactly this.
- **Long description as second modal** was rejected (APG nesting + VO confusion) but *revealing text inside the dialog* interacts with pan/zoom state; the Scroll position of the description must not fight the image's pan transform (put description in the chrome footer, not the stage).
- **Mobbin slugs are client-rendered** and could not be crawled for this pass (fetches returned 404/empty shells); the Claude iOS and Kimi Code comparison flows must be verified by a human on mobbin.com before this feature's SYNTHESIS step.

---

## 5. Sources

**Specs / project-internal (cited as code-grounded, not web)**
- `specs/002/README.md` — feature phases, fixed design system + security posture
- `specs/002/F6-file-preview/spec.md` — FilePreviewBlock contract, viewer shell, states, a11y + redaction + cache rules, acceptance tests (all F6 quotes above)
- `specs/002/F5-media-upload/` — outbound analog / inbound pairing
- `specs/002/F8-inbound-media/` — this feature's phase folder (draft)
- `apps/pi-remote-web/package.json` — react 19.1.1, react-aria-components 1.11.0, tailwindcss 4.1.11

**W3C / standards (fetched + verified this pass)**
- WAI Accessibility Tutorial: Images (categories, alt rules, decision tree) — https://www.w3.org/WAI/tutorials/images/ · complex images https://www.w3.org/WAI/tutorials/images/complex/
- WCAG 2.2 Understanding 1.4.11 Non-text Contrast (3:1, focus, relative luminance, 2.999 fails) — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2 Understanding 1.4.4 Resize Text (G178, F80, F94, ACT rule b4f0c3) — https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- WCAG 2.2 Understanding 1.4.10 Reflow (320px, 2D exceptions, C33) — https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- WCAG 2.2 Understanding 2.5.1 Pointer Gestures (pinch = multipoint; G215) — https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html
- WCAG 2.2 Understanding 2.3.3 Animation from Interactions (C39, SCR40) — https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- WAI-ARIA APG Dialog (Modal) pattern (initial focus, aria-modal, Escape, focus return) — https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- W3C i18n: CSS vs. markup for bidi (use markup; isolate) — https://www.w3.org/International/questions/qa-bidi-css-markup

**MDN (fetched/verified)**
- `text-size-adjust` (inflation algorithm, `-webkit-` behavior) — https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust
- `prefers-reduced-motion` (baseline-wide, iOS Settings path) — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- CSS logical properties (guide bundle) — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
- `env()` safe-area insets — https://developer.mozilla.org/en-US/docs/Web/CSS/env

**Libraries / prior art (fetched + verified)**
- react-aria-components Modal/Dialog/ModalOverlay API (`dir`/`lang`/`inert`, focus, close semantics) — https://react-spectrum.adobe.com/react-aria/Dialog.html
- Yet Another React Lightbox (keyboard/touch/RTL/captions/responsive) — https://github.com/igordanchenko/yet-another-react-lightbox
- react-zoom-pan-pinch (pinch/pan/double-tap + imperative zoomIn/zoomOut/reset, no built-in control semantics) — https://github.com/BetterTyped/react-zoom-pan-pinch
- iTerm2 Inline Images Protocol (bounded base64 inline media, size caps, width/height hints) — https://iterm2.com/documentation-images.html
- Anthropic Vision (`image` content block: base64/media_type/data, url, file_id; 10 MiB / 5 MiB caps; JPEG/PNG/GIF/WebP; first-frame; no metadata parsing; size growth rationale for file_id) — https://docs.anthropic.com/en/docs/build-with-claude/vision

**Mobbin (comparison flows — verify slugs, site is client-rendered)**
- Mobbin — Claude AI iOS: image/screenshot preview in assistant chat; full-screen zoom viewer (screen-verified)
- Mobbin — Kimi (Moonshot) iOS: file-type preview cards + full-screen density (screen-verified)
- Note: mobbin.com URLs could not be validated by the crawler (SPA); list as human-verifiable before SYNTHESIS.

**Apple (cited for the accessibility/getting-started floor; pages are JS-rendered so text was not re-verified this pass — verify claims at build time)**
- Apple HIG — Accessibility — https://developer.apple.com/design/human-interface-guidelines/accessibility
- Apple HIG — Motion — https://developer.apple.com/design/human-interface-guidelines/motion
- Apple HIG — Images — https://developer.apple.com/design/human-interface-guidelines/images
```
