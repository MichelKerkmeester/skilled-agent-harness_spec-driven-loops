<!-- provenance: external-CLI orchestration pass; original file iter-02-sol.md -->
> **Source pass 2** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-2-sol.md`.

<!-- F8-inbound-media | model=sol | lens=interaction-gesture | iter 2/15 | 2026-08-16T04:39:29.174Z -->

# 1. Findings for the interaction-and-gesture lens

## The correct interaction model is “glance inline, inspect in place”

The transcript card should answer “what did pi send?” without interrupting reading; a single tap should expand the same object into a full-screen inspection surface and closing it must return to the identical transcript position. Claude’s own mobile app-extension guidance prescribes inline-card-to-fullscreen transitions, an explicit expansion affordance, 44×44 pt targets, and restoration of the conversation’s scroll position. It also recommends layout-matched skeletons instead of inline spinners. [Claude mobile design guidelines](https://claude.com/docs/connectors/building/mcp-apps/design-guidelines)

This is also an observed unmet need: after Mobbin began returning reference screens inline in Claude, a user specifically reported that the previews were too small and requested convenient fullscreen inspection. [Mobbin inline-screen discussion](https://www.linkedin.com/posts/liaujianjie_the-mobbin-mcp-now-displays-the-screens-inline-activity-7465351105502294016-qvs1) Kimi uses a result-card-to-preview transition for generated slide artifacts, establishing the same disclosure pattern in an adjacent AI-chat workflow. [Kimi preview-card guidance](https://www.kimi.com/help/slides/ppt-stuck)

Open-source coding clients are converging on the same model:

- OpenCode users explicitly request tool-result images inline with click-to-fullscreen preview, reusing the existing attachment viewer. [OpenCode issue #21227](https://github.com/anomalyco/opencode/issues/21227)
- The native OpenCode iOS client already advertises image preview with zoom and pan. [opencode_ios_client](https://github.com/grapeot/opencode_ios_client)
- Happy treats attachments as separately downloaded encrypted blobs rather than transcript-embedded data, and enforces a 10 MiB client-side download ceiling—useful architectural precedent, although Pi Remote needs stronger sanitization and revision binding. [Happy attachment implementation](https://github.com/slopus/happy/blob/main/packages/happy-cli/src/api/apiSession.ts)
- Claude Code UI demonstrates that responsive chat, touch navigation, and PWA installation are viable for remote coding-agent sessions, but does not define a security-grade image contract. [claude-code-ui](https://github.com/TeamADAPT/claude-code-ui)

## “Fullscreen” must be an application overlay, not the web Fullscreen API

On iPhone, non-video elements have historically not been able to enter native fullscreen reliably; Apple’s WebKit guidance identifies fullscreen support for video rather than arbitrary `div` elements. [Apple Developer Forums](https://developer.apple.com/forums/thread/133248), [WebKit bug 240312](https://www2.webkit.org/show_bug.cgi?id=240312)

Therefore F6 should be a `position: fixed` React Aria modal occupying the visual viewport, not `requestFullscreen()`. React Aria’s `ModalOverlay` already supplies focus containment, background scroll locking, outside-content hiding, Escape dismissal, trigger-focus restoration, and visual-viewport height variables for mobile keyboard handling. [React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)

Use `viewport-fit=cover`, `100dvh`, and `env(safe-area-inset-*)`. WebKit documents that safe-area padding is required to prevent controls being obscured by the sensor housing, rounded corners, or Home indicator. [WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

## Familiar gestures should remain familiar—and never be the only path

Apple assigns conventional meanings to tap, swipe, touch-and-hold, double tap, and zoom, and advises providing multiple ways to perform actions instead of assuming a user can execute a specific gesture. [Apple HIG: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures/)

For Pi Remote this means:

- Tap opens or reveals controls.
- Pinch zooms.
- Double-tap toggles magnification.
- One-finger drag pans only after zooming.
- Downward drag dismisses only at fitted scale.
- Long-press reveals secondary actions, but duplicates a visible More button.
- Close and zoom buttons duplicate every gesture.

WCAG 2.2 independently requires a non-dragging alternative for drag-based functionality and at least 24×24 CSS-pixel targets. [WCAG 2.2 changes](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) Pi Remote should use 44×44 CSS pixels, matching Apple’s recommended iOS button size and exceeding the WCAG minimum. [Apple control-size guidance](https://developer.apple.com/design/human-interface-guidelines/designing-for-games/)

## Long-press is a security boundary, not decorative polish

Allowing the browser’s default image context menu may expose “Save Image,” “Open in New Tab,” or the underlying blob URL. The image surface must therefore use React Aria’s normalized long-press behavior, which cancels ordinary press, prevents touch selection and native context menus, and supplies an accessibility description. Its standard threshold is 500 ms. [React Aria `useLongPress`](https://react-spectrum.adobe.com/react-aria/useLongPress.html)

Long-press must not unlock unique functionality. The same menu must be reachable through a visible 44×44 More button. Default actions should be limited to:

1. Open preview, when invoked inline.
2. Hide/reveal this preview locally.
3. View sanitized artifact details.

“Save,” “Share,” “Open in new tab,” and copying an artifact URL must be absent under the default read-only policy.

## The image must never become interactive before integrity verification

Uploaded-content defenses must combine an allowlist, signature validation, size limits, generated identifiers, sandboxed processing, and image rewriting; trusting the supplied MIME type or extension is insufficient. [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) OWASP specifically recommends decoding and rewriting images to remove extraneous content and deriving the served type from processed output. [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

Consequently, Pi Remote should not render:

- Agent-provided URLs.
- Raw host paths or filenames.
- Base64 transcript blocks.
- SVG, HTML, PDF, GIF, or other active/animated formats.
- Bytes whose computed SHA-256 differs from the transcript descriptor.

The browser can compute SHA-256 using `crypto.subtle.digest()` before constructing the image blob. [MDN: `SubtleCrypto.digest`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)

## Accessibility descriptions are part of redaction

Apple requires meaningful images to have alternative text that describes the information conveyed by the image without redundantly repeating surrounding captions. [Apple HIG: VoiceOver](https://developer.apple.com/design/human-interface-guidelines/voiceover/)

The accessible description must therefore be generated or approved only after irreversible pixel redaction. Raw OCR, raw tool captions, filenames, paths, and pre-redaction descriptions cannot enter the accessibility tree or durable transcript. When no safe description is available, use a bounded fallback such as:

> Screenshot from pi. A detailed description is unavailable for security. Sensitive content may have been redacted.

## Motion should track direct manipulation but remain optional

Apple recommends short, precise motion that follows the user’s gesture, can be interrupted, and is not the sole carrier of information. [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion) `prefers-reduced-motion` reflects the user’s iOS Accessibility → Motion setting and should replace spatial scaling/panning transitions with an opacity-only change. [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)

Do not make haptics part of the acceptance bar: the Vibration API remains unreliable or unavailable in iOS Safari/PWAs. [Browser support for `navigator.vibrate`](https://caniuse.com/mdn-api_navigator_vibrate)

## Mobbin evidence limitation

Mobbin documents returning screen images inline to AI clients, but authenticated application-screen results do not expose stable public Claude/Kimi screen URLs through the public crawl. [Mobbin MCP introduction](https://docs.mobbin.com/mcp/introduction) Visual signoff should therefore include an authenticated Mobbin comparison against current Claude and Kimi iOS chat/media flows. This report does not invent unavailable screen details.

# 2. Concrete spec contribution

## 2.1 Inbound image contract

### Producer-to-relay sequence

1. The pi host extension requests a one-use ingest ticket bound to:

   - Session ID.
   - Expected transcript revision.
   - Declared input byte ceiling.
   - Declared media family.
   - 30-second expiry.

2. The extension streams bytes through the ticketed binary endpoint. No host path, filename, base64, or bytes enter RPC transcript JSON.

3. The relay accepts at most 10 MiB of encoded input and terminates the stream immediately on overflow.

4. A sandboxed decoder validates the magic signature and decodes only PNG, JPEG, or static WebP.

5. Reject when any condition holds:

   - More than 16 megapixels.
   - Either dimension exceeds 8192 pixels.
   - Animation or multiple frames.
   - Decoder timeout, memory ceiling, truncated data, or inconsistent dimensions.
   - Unsupported color model.
   - Redaction pipeline unavailable or inconclusive.
   - Expected transcript revision no longer matches.

6. Normalize orientation into pixels, convert to sRGB, remove EXIF/XMP/ICC comments and textual chunks, then run source masks, OCR-based secret detection, and policy masks.

7. Burn redactions irreversibly into pixels. CSS overlays do not count as redaction.

8. Produce:

   - `thumbnail`: maximum 640-pixel long edge.
   - `display`: maximum 4096-pixel long edge and 16 megapixels.
   - PNG for UI screenshots or transparency; JPEG quality 90 for opaque photographic content.
   - No retained or downloadable original.

9. Compute SHA-256 independently for both sanitized variants.

10. Append the content block only through a one-use, expected-revision-checked transcript append. On mismatch, reject the append and delete the unreferenced outputs.

11. If processing fails, append only an `image_withheld` event with a generic reason enum. Never append decoder details, paths, OCR text, or byte samples.

This follows OWASP’s defense-in-depth requirement to combine size limits, type detection, generated identifiers, image rewriting, and authorization rather than relying on a single MIME check. [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

### Durable transcript block

```json
{
  "kind": "image_artifact",
  "schema_version": 1,
  "artifact": {
    "id": "art_<128-bit-base64url>",
    "revision": 3,
    "digest": "sha256:<64-lowercase-hex>",
    "mime": "image/png",
    "width": 1440,
    "height": 900,
    "byte_length": 482103,
    "thumbnail": {
      "digest": "sha256:<64-lowercase-hex>",
      "mime": "image/png",
      "width": 640,
      "height": 400,
      "byte_length": 92314
    }
  },
  "safe_alt": "Screenshot of a test-results panel. Sensitive values are redacted.",
  "safe_caption": "Test results",
  "redaction": "applied"
}
```

Normative constraints:

- `artifact.id` is random and is never an authorization credential.
- `revision` is an unsigned monotonically increasing integer.
- `digest` always identifies sanitized served bytes, never the source image.
- `safe_alt`: NFC-normalized, no control characters, maximum 240 Unicode scalar values and 512 UTF-8 bytes.
- `safe_caption`: maximum 80 scalar values and 192 UTF-8 bytes.
- Allowed redaction values are `none_detected` and `applied`; failure produces `image_withheld`, not a third renderable state.
- The durable record contains no URL, ticket, filename, path, source host, OCR transcript, base64, or raw bytes.
- The UI says “Sanitized,” not “Safe”; automated redaction cannot prove that an image contains no secret.

### Supersession and revocation

A transcript block never silently changes digest. If a later safety pass replaces revision 3:

1. The relay appends a bounded `artifact_superseded` event containing only the artifact ID, old revision/digest, and new revision/digest.
2. Requests for the old revision return `410 Gone`.
3. The UI clears old object URLs and byte buffers.
4. The card displays “Updated for privacy” and fetches the explicitly linked successor.
5. An unexplained revision or digest difference is treated as an integrity failure, never as an update.

## 2.2 Secure delivery

The PWA must not assign a relay URL directly to `<img src>`.

1. When a thumbnail is within two viewport heights, request a one-use read ticket.
2. Bind the ticket to session, artifact ID, revision, variant, digest, authenticated device, and a 30-second expiry.
3. Fetch with the ticket in an authorization header, not in the URL.
4. Enforce declared `Content-Length` before reading and the byte ceiling while streaming.
5. Verify MIME, dimensions, and SHA-256.
6. Only then create a `Blob` and object URL.
7. Revoke the object URL when the card unmounts, is hidden for privacy, is superseded, or the document enters the background. Blob URLs retain their underlying data until revoked. [MDN: blob URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob)
8. A consumed or partially used ticket cannot be replayed; retry obtains a new ticket.
9. The service worker must use network-only handling for `/artifacts/` and must never place responses in Cache Storage.

Artifact responses require:

```http
Cache-Control: no-store
Content-Type: image/png
X-Content-Type-Options: nosniff
Cross-Origin-Resource-Policy: same-origin
Referrer-Policy: no-referrer
Content-Disposition: inline
```

OWASP recommends `no-store` when sensitive data must not be retained in browser or intermediary caches. [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) `nosniff` prevents reinterpretation of the declared MIME type, while CORP `same-origin` blocks compatible cross-origin embedding. [MDN: `X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options), [MDN: CORP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Resource-Policy)

Application CSP:

```http
Content-Security-Policy:
  default-src 'self';
  img-src 'self' blob:;
  object-src 'none';
  frame-src 'none';
  base-uri 'none';
```

## 2.3 State machine

| State | Visible UI | Permitted interaction | Transition |
|---|---|---|---|
| `announced` | Reserved card geometry; “Preparing screenshot…” | None; `aria-disabled=true` | Sanitizer starts → `sanitizing` |
| `sanitizing` | Static parchment placeholder; no shimmer | None | Success → `available`; policy failure → `withheld`; timeout → `failed` |
| `available` | Metadata card before viewport-triggered fetch | More/details only | Near viewport → `thumbnail_fetching` |
| `thumbnail_fetching` | Layout-matched skeleton; `aria-busy=true` | More/details; open remains disabled | Bytes complete → `thumbnail_verifying`; offline → `offline` |
| `thumbnail_verifying` | Same skeleton; “Verifying preview…” for assistive technology | None | Digest/type pass → `inline_ready`; mismatch → `integrity_failure` |
| `inline_ready` | Sanitized thumbnail, caption, expansion affordance | Tap/Enter/Space opens; long-press/More opens menu | Open → `viewer_opening`; background → `privacy_locked`; supersession → `superseded` |
| `viewer_opening` | Modal with thumbnail fitted behind visible chrome | Close immediately; repeated open ignored | Main fetch begins → `full_fetching` |
| `full_fetching` | Verified thumbnail scaled to fit; small “Loading full preview…” label | Close, zoom disabled | Verified main bytes → `viewer_ready`; recoverable network failure → `viewer_degraded` |
| `viewer_ready` | Full-resolution sanitized image | All viewer gestures and controls | Close/back/swipe → `viewer_closing`; background → `privacy_locked` |
| `viewer_degraded` | Thumbnail remains visible; “Full preview unavailable” | Retry, close, inspect details | Retry → `full_fetching`; close → `inline_ready` |
| `privacy_locked` | Opaque carbon curtain; bytes and object URLs cleared | “Reveal preview” or Close | Foreground + explicit reveal → fresh ticket/fetch; close → transcript |
| `offline` | Placeholder with “Preview unavailable offline” | Retry when online; details | Network restored + explicit retry → `thumbnail_fetching` |
| `withheld` | Shield icon; “Preview withheld during sanitization” | Sanitized details only | Terminal |
| `failed` | “Preview could not be prepared” | One manual retry if policy permits | Retry → `sanitizing`; otherwise terminal |
| `integrity_failure` | No pixels; “Preview blocked because verification failed” | Close/report only | Terminal until a new signed transcript event |
| `superseded` | Old pixels cleared; “Updated for privacy” | Fetch explicit successor or close | Successor fetch → `thumbnail_fetching`; revoked without successor → `withheld` |
| `viewer_closing` | Viewer tracks close transition | No further pointer action | Animation/end → `inline_ready`, focus restored |

Additional transition rules:

- A new transcript message never closes the viewer. On return, preserve the previous card position and show any existing unread marker.
- Opening pushes an identifier-free in-memory history state. The iOS back gesture or browser Back closes the viewer instead of leaving the PWA. Artifact IDs and digests must never enter the URL or browser history.
- Backgrounding immediately enters `privacy_locked`; `visibilitychange`, `pagehide`, session expiry, and logout all clear decoded buffers.
- Automatic ticket renewal is allowed once when the only failure is ticket expiry. All other retries require a visible user action.

## 2.4 Inline card

### Layout

- Width: transcript column width.
- Media viewport: `clamp(160px, 48vw, 220px)`.
- Preserve the sanitized aspect ratio and use `object-fit: contain`; never crop diagnostic screenshots.
- Reserve dimensions from metadata before bytes arrive so transcript content does not jump.
- Border radius: 14 px.
- Border: 1 px carbon at 12% opacity in light mode; bone at 16% in dark mode.
- Padding: 8 px around media, 12 px in caption row.
- Media background: carbon at 4% in light mode, bone at 6% in dark mode.
- Tall or panoramic images are letterboxed, not center-cropped.
- Card accessible name: `Open screenshot preview: {safe_caption}`.
- A visible diagonal-arrows glyph communicates expansion but is not a separate nested target.
- A separate More button has a 44×44 target.

Do not use clay `#d97757` for small text. Use carbon-on-bone or bone-on-carbon for text and focus indicators; reserve clay for nonessential accent, selected state, or a background paired with sufficiently contrasting carbon text.

### Press behavior

- Pointer down: scale to `0.985` over 80 ms and darken the border.
- Pointer cancel or drag exceeding 10 px: restore without opening.
- Pointer up inside: open viewer.
- Long-press at 500 ms: cancel ordinary tap and open the same menu as More.
- Card CSS uses `touch-action: pan-y` so ordinary transcript scrolling wins over press recognition.
- No horizontal swipe action on transcript cards.

## 2.5 Full-screen viewer

### Structure

Use:

- `ModalOverlay` and `Modal` from `react-aria-components`.
- `role="dialog"`, `aria-modal="true"`.
- Visible heading “Screenshot preview.”
- `aria-describedby` referencing sanitized caption, dimensions, and redaction status.
- Fixed overlay sized with React Aria’s visual-viewport variable, falling back to `100dvh`.
- Safe-area padding on all four sides.
- Carbon canvas in both themes; bone controls; clay only for selected or progress accents.
- Top toolbar: Close, centered title, More.
- Bottom toolbar: Zoom out, zoom percentage/reset, Zoom in.
- Every control: minimum 44×44 CSS px, with at least 8 px separation.

React Aria must contain focus, hide background content from assistive technology, lock transcript scrolling, support Escape, and restore focus when dismissed. [React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)

### Gesture arbitration

#### Single tap

- On image canvas: toggle toolbars.
- Toolbars begin visible.
- Never auto-hide while keyboard focus is inside a toolbar.
- Toolbars may hide only after explicit image-canvas interaction, not on a timer.
- When hidden, the next tap reveals them without performing another action.

#### Double tap

- Threshold: second tap within 260 ms and 32 px of the first.
- At fitted scale: zoom to 2× around the tapped point.
- Above fitted scale: return to fit.
- Do not alter toolbar visibility after the double-tap resolves.
- Zoom controls provide the equivalent action.

#### Pinch

- Range: fitted scale through 4×.
- During contact, allow elastic excursion to 0.85× and 4.5×.
- On release, animate to the nearest valid bound and clamp pan.
- A second pointer immediately cancels swipe-to-dismiss.
- Pinch must not rotate the image.

#### Pan

- Enabled only above fitted scale.
- One-finger movement tracks the finger 1:1.
- Pan is clamped so at least one edge remains aligned with the viewport; no permanent empty-canvas drift.
- Arrow keys and zoom buttons provide non-gesture access.

#### Swipe down to dismiss

Enabled only when:

- Scale equals fitted scale.
- Exactly one pointer is active.
- Initial movement is downward.
- Vertical movement exceeds the 8 px intent slop.
- `abs(dy) > 1.25 × abs(dx)`.

Commit dismissal when either:

- `dy ≥ 96 px`, or
- Downward velocity is at least `0.8 px/ms` after at least 24 px of travel.

Otherwise return to rest over 180 ms. During the drag, image translation follows the finger and backdrop opacity decreases by at most 45%. The Close button and Escape key provide equivalent dismissal.

#### Edge gestures

- Do not implement left/right navigation in version 1.
- Do not capture horizontal drags at fitted scale.
- Preserve the iOS system back gesture; while the viewer is open it closes the overlay through the in-memory history state.
- Keep controls outside `env(safe-area-inset-left/right)`.

#### Long-press

- Threshold: 500 ms.
- Cancel if movement exceeds 10 px or another pointer appears.
- Open the same menu as More.
- Suppress native selection and image context menus only on the controlled image surface.
- No unique long-press-only action.

## 2.6 Keyboard, focus, VoiceOver, and switch access

### Transcript order

DOM and reading order:

1. Pi/assistant label.
2. Associated explanatory text.
3. Image card/open button.
4. Caption and sanitization status.
5. More button.
6. Subsequent transcript content.

On arrival, announce once through a polite live region:

> Pi shared a screenshot. Preview available.

Do not announce artifact IDs, digests, dimensions, ticket status, or repeated loading updates.

### Viewer focus order

1. Close.
2. More.
3. Image inspection region.
4. Zoom out.
5. Zoom percentage/reset.
6. Zoom in.

Initial focus goes to Close. `Tab` and `Shift+Tab` remain within the modal, and closing restores focus to the originating card. If that card no longer exists, focus moves to the transcript heading. WAI’s modal pattern requires contained tab order, Escape dismissal, and logical focus restoration. [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

### Keyboard map

| Key | Behavior |
|---|---|
| `Enter` / `Space` on inline card | Open viewer |
| `Escape` | Close viewer or action menu |
| `+` / `=` | Zoom in by 25 percentage points |
| `-` | Zoom out by 25 percentage points |
| `0` | Reset to fit |
| Arrow keys | Pan 40 px when zoomed |
| `Shift` + arrow | Pan 120 px when zoomed |
| `Tab` / `Shift+Tab` | Move through viewer controls |
| Browser Back | Close viewer before navigating away |

Any keyboard input while chrome is hidden first makes chrome visible. Shortcuts are scoped to the focused viewer and never intercept typing in another control.

### Screen-reader output

The inspection region announces:

> Screenshot. {safe_alt}. Zoom {percentage} percent. Sensitive content redacted.

Requirements:

- Redaction status is text, not color-only.
- Decorative expansion and shield glyphs are hidden from assistive technology.
- Loading uses `aria-busy`; recoverable failure uses polite status; integrity failure uses a one-time alert.
- Zoom percentage changes are announced only after the gesture ends or after a button press, not continuously during pinch.
- Every gesture has a labeled button equivalent.
- Focus indicator: 2 px carbon/bone ring plus 2 px offset, maintaining at least 3:1 contrast against adjacent colors. WCAG defines a 2 CSS-pixel perimeter and 3:1 contrast as the enhanced focus-appearance benchmark. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## 2.7 Visual and motion specification

### Normal motion

- Card insertion: opacity 0→1 and translate-y 6→0 over 160 ms.
- Card press: 80 ms.
- Viewer open: shared-aspect expansion from card bounds over 220 ms; controls fade over the final 120 ms.
- Viewer close: reverse over 180 ms.
- Swipe cancellation: 180 ms ease-out.
- Full-resolution replacement: 120 ms opacity crossfade; never blur the thumbnail into the main image.
- All controls become interactive at animation start; motion must never block Close.

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- No spatial card or viewer movement.
- No press scaling.
- Open/close uses at most a 100 ms opacity change.
- Swipe-to-dismiss remains direct while the finger is down but snaps without animated travel on release.
- No shimmer, pulsing skeleton, parallax, or spring overshoot.

### Redaction appearance

- Burned-in redactions are opaque carbon rectangles.
- Where a rectangle is large enough, place a repeated bone “REDACTED” label inside the pixels before encoding.
- The thumbnail and full image derive from the same redacted master.
- Card metadata says “Sanitized” or “Sanitized · redactions applied.”
- Never reveal redaction count, rule name, OCR match, or masked string.

## 2.8 Objective build acceptance checks

### Protocol and security

- A transcript containing a host path, filename, URL, base64 field, or image bytes fails schema validation.
- PNG/JPEG/static-WebP fixtures pass; SVG, GIF, HTML-polyglots, malformed images, animation, oversized dimensions, and files over 10 MiB fail.
- Metadata is absent after decode/re-encode.
- Redaction pixels exist in the encoded output rather than as DOM overlays.
- Altering one downloaded byte causes an integrity-failure card and creates no object URL.
- A consumed ticket returns `410`; a ticket for the wrong revision, variant, session, or device returns `403` or `409`.
- A revision mismatch never silently displays newer bytes.
- Artifact responses contain `no-store`, `nosniff`, `same-origin` CORP, and `no-referrer`.
- Cache Storage and IndexedDB contain no artifact bytes after viewing.
- Backgrounding, logout, supersession, and unmount revoke all associated object URLs.
- A service-worker test proves `/artifacts/` is network-only.
- Logs and durable state are scanned for common absolute-path patterns, data URLs, source filenames, and OCR text.

### Interaction

- Tap and Enter/Space open the same viewer.
- Closing by button, Escape, Back, or valid downward swipe returns to the same transcript scroll offset.
- Scrolling the transcript from a card does not accidentally open or long-press it.
- A pinch cannot also dismiss.
- Swipe-down cannot dismiss while zoomed.
- Horizontal edge swipes do not move the image at fitted scale.
- Long-press and More expose identical commands.
- Native image context menus do not appear.
- Rotation preserves the normalized image focal point and clamps pan within new bounds.
- Opening while the composer keyboard is visible collapses the keyboard; closing focuses the card rather than reopening the composer.

### Accessibility

- All targets measure at least 44×44 CSS px.
- VoiceOver can discover the card, caption, sanitization status, Close, More, image description, and all zoom controls.
- VoiceOver can complete open, zoom, reset, details, and close without custom gestures.
- Tab order remains contained and focus returns correctly.
- At 200% text size, controls reflow without obscuring Close.
- Light and dark modes meet WCAG AA; no status is conveyed by clay color alone.
- With reduced motion enabled, automated animation inspection finds no transform-based entry/exit transition.
- Loading and failure announcements occur once and do not repeatedly interrupt streaming transcript text.

### Device matrix

Test in both Safari and an installed Home Screen PWA on:

- A 320-CSS-pixel-wide compact viewport.
- Current standard and Pro iPhone widths.
- Portrait and landscape.
- Light, dark, increased contrast, reduced motion, and 200% text.
- VoiceOver and hardware keyboard.
- Online, high-latency, packet-loss, offline, expired-ticket, superseded-revision, and integrity-failure conditions.

# 3. Divergent / minority ideas worth considering

## Privacy curtain as the default

Instead of automatically revealing even sanitized thumbnails, show a blurred-independent placeholder reading “Tap to reveal screenshot.” This is stronger against shoulder surfing and App Switcher captures, but weakens transcript scanability and falls below the Claude/Kimi immediacy target. It is better as an optional “Hide media previews” mode unless the threat model treats all screenshots as highly sensitive.

## Hold-to-reveal

Render pixels only while the user holds a 44×44 Reveal control, clearing them immediately on release. This creates a strong causal privacy gesture, but excludes users who cannot sustain touch and requires a toggle alternative under Apple and WCAG gesture guidance. It should not be the sole interaction.

## Server-tiled inspection

Serve verified 512×512 redacted tiles only for the visible zoomed region. This reduces peak browser memory and avoids delivering the entire display image, but greatly expands ticketing, gesture, retry, and integrity complexity. It is justified only for very large screenshots or a substantially stricter data-minimization threat model.

## Safe OCR mode

Offer a secondary “Read sanitized text” view generated only from the burned-redaction output. It could materially improve VoiceOver access to terminal screenshots and make code selectable. The risk is that OCR can misread redaction boundaries or create a second sensitive durable representation; it should remain ephemeral unless separately sanitized and bounded.

## No gesture chrome

A stricter accessibility-first alternative is to keep all controls permanently visible and omit double-tap, auto-hidden chrome, and swipe-to-dismiss. This is less photographic but eliminates gesture arbitration failures and makes the security state continuously visible.

## Consecutive-image stack rather than carousel

If pi emits several screenshots, stack individual cards vertically rather than creating a horizontal carousel. It costs transcript height but avoids hidden pagination, conflicts with iOS edge navigation, and ambiguous revision handling. A later viewer can add a vertical filmstrip without changing the content contract.

# 4. Open questions + risks

1. **Redaction confidence:** Which visual secrets must cause fail-closed withholding—API keys, emails, repository paths, usernames, terminal prompts, browser chrome, or arbitrary user-specified regions? OCR alone cannot guarantee complete detection.

2. **Source capture boundary:** Can the host extension capture only an approved application surface, or can pi submit arbitrary desktop screenshots? Source-side capture restriction is substantially safer than trying to repair an unrestricted full-screen capture later.

3. **F6 compatibility:** Does the existing F6 viewer already implement focus containment, safe areas, digest-gated object URLs, background clearing, and scale-aware swipe dismissal? Visual reuse without behavioral conformance would preserve vulnerabilities.

4. **Artifact retention:** How long do sanitized bytes survive after the transcript block is written? Expiry must leave a coherent durable “Preview expired” record rather than a broken card.

5. **Export policy:** Is exporting a sanitized copy to Photos or the iOS share sheet ever permitted? If yes, it needs a separate, explicit, one-use export capability and must never reuse the ordinary read ticket.

6. **App Switcher snapshots:** A PWA cannot reliably install native scene-level privacy overlays before every iOS task-switcher snapshot. `visibilitychange` clearing reduces exposure but cannot prove that no sensitive frame is captured.

7. **Compromised service worker:** `no-store` and a network-only route prevent normal persistence, but a compromised same-origin service worker or script can still intercept authenticated bytes. CSP, trusted deployment, worker-scope restriction, and a worker kill switch remain essential. OWASP notes the broad interception power and persistence of service workers. [OWASP HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)

8. **Memory duplication:** Fetching into an `ArrayBuffer`, hashing, constructing a Blob, decoding, and rendering can temporarily hold several copies. The 10 MiB encoded and 16-megapixel decoded ceilings require memory testing on older iPhones.

9. **Color fidelity versus sanitization:** Removing profiles and converting to sRGB improves consistency and privacy but may alter screenshots used for visual design review.

10. **Revision races:** A redaction supersession may arrive while revision N is already decoded. The client must clear N before fetching N+1 and must not display both during crossfade.

11. **Authenticated Mobbin validation:** Current Claude and Kimi iOS media flows should be captured through an authenticated Mobbin session before final motion, toolbar, and spacing signoff; public indexing was insufficient for a defensible screen-by-screen comparison.

12. **Alt-text authority:** Should `safe_alt` come from pi, a post-redaction vision model, or a deterministic generic fallback? Agent-authored descriptions are useful but must be treated as untrusted text and scanned independently.

# 5. Sources

- [Apple Human Interface Guidelines — Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures/)
- [Apple Human Interface Guidelines — Going full screen](https://developer.apple.com/design/human-interface-guidelines/going-full-screen)
- [Apple Human Interface Guidelines — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Apple Human Interface Guidelines — VoiceOver](https://developer.apple.com/design/human-interface-guidelines/voiceover)
- [Apple Human Interface Guidelines — Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback)
- [Apple control-size guidance](https://developer.apple.com/design/human-interface-guidelines/designing-for-games/)
- [WebKit — Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [Apple Developer Forums — Fullscreen API on iOS](https://developer.apple.com/forums/thread/133248)
- [WebKit bug 240312 — Non-video fullscreen on iPhone](https://www2.webkit.org/show_bug.cgi?id=240312)
- [Claude mobile and fullscreen design guidelines](https://claude.com/docs/connectors/building/mcp-apps/design-guidelines)
- [React Aria — Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)
- [React Aria — `useLongPress`](https://react-spectrum.adobe.com/react-aria/useLongPress.html)
- [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C — What’s new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)
- [MDN — `SubtleCrypto.digest`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- [MDN — Blob URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob)
- [MDN — `X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options)
- [MDN — Cross-Origin-Resource-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Resource-Policy)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [OWASP HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
- [Mobbin MCP introduction](https://docs.mobbin.com/mcp/introduction)
- [Mobbin inline-screen/fullscreen discussion](https://www.linkedin.com/posts/liaujianjie_the-mobbin-mcp-now-displays-the-screens-inline-activity-7465351105502294016-qvs1)
- [Kimi preview-card guidance](https://www.kimi.com/help/slides/ppt-stuck)
- [OpenCode issue #21227 — Tool-result image previews](https://github.com/anomalyco/opencode/issues/21227)
- [OpenCode native iOS client](https://github.com/grapeot/opencode_ios_client)
- [Happy mobile coding-agent client](https://github.com/slopus/happy)
- [Happy attachment transport implementation](https://github.com/slopus/happy/blob/main/packages/happy-cli/src/api/apiSession.ts)
- [Claude Code UI](https://github.com/TeamADAPT/claude-code-ui)
- [Browser support for `navigator.vibrate`](https://caniuse.com/mdn-api_navigator_vibrate)
