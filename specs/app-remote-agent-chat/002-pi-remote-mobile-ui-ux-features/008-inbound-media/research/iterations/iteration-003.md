<!-- provenance: external-CLI orchestration pass; original file iter-03-sol.md -->
> **Source pass 3** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-3-sol.md`.

<!-- F8-inbound-media | model=sol | lens=accessibility-i18n | iter 3/15 | 2026-08-16T04:41:34.525Z -->

# 1. Findings for the accessibility-i18n lens

## The preview is simultaneously content and a control

An inbound screenshot conveys information, but its inline thumbnail also opens a viewer. WCAG requires an equivalent text alternative for informative images, while a functional image’s accessible name should describe the action it performs rather than merely its appearance ([W3C Images Tutorial](https://www.w3.org/WAI/tutorials/images/), [Functional Images](https://www.w3.org/WAI/tutorials/images/functional/)).

Therefore:

- The inline card should be one semantic `Button`, labeled “Open screenshot preview: {summary}.”
- The thumbnail inside that button should use `alt=""` so VoiceOver does not announce the same image twice.
- The full-screen viewer should expose the full sanitized description on its non-functional `<img>`.
- Technical values such as artifact IDs, digests, tickets, host paths, and original filenames must never enter the accessible name.

Apple expects visible media and controls to have concise, context-independent VoiceOver labels, and specifically calls for descriptions of user-generated media ([Apple VoiceOver evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria)). A generic “Image” label is insufficient; an invented description is worse. The protocol therefore needs an explicit accessibility payload, not a client-side guess.

## A screenshot with text needs more than short alt text

A screenshot of a terminal, browser, diff, or error dialog may contain more meaningful text than a concise `alt` value can carry. WCAG treats screenshots as meaningful visual content and still requires an equivalent text alternative ([WCAG 2.2, 1.1.1](https://www.w3.org/TR/WCAG22/), [Images of Text explanation](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text-no-exception.html)).

Each accepted screenshot should therefore have:

- A short redacted summary, bounded to 240 grapheme clusters.
- An optional redacted OCR/text companion, stored as a separate bounded artifact rather than inline transcript data.
- A localized “Read extracted text” action in the viewer when that companion exists.
- An explicit “Text description unavailable” state when neither pi nor reliable OCR can supply one.

OCR output is sensitive content. It must pass through the same secret and path redactor as transcript text; it must not be treated as harmless accessibility metadata.

## Streaming chat needs restrained announcements

A chat transcript is a natural `role="log"` live region. That role has implicit polite announcements and is intended for ordered chat history ([MDN `log` role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role), [W3C ARIA23](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23)). Replacing “Receiving…” with “Sanitizing…” and then “Ready” inside that live region can cause repeated VoiceOver speech because live regions normally react to both additions and text changes ([MDN live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)).

Use a visually present but accessibility-hidden placeholder during transport and sanitization. Add the semantic card to the log only once it reaches a terminal state: ready, redacted, withheld, expired, or failed. Announce no byte-by-byte progress.

New images must never:

- Move focus.
- force auto-scroll when the reader has left the live edge;
- interrupt current VoiceOver speech with `aria-live="assertive"`;
- announce their complete OCR text automatically.

## The viewer is a true modal dialog

The viewer must make the transcript inert, contain focus, support `Escape`, include a visible close button, and return focus to the exact thumbnail that opened it. Those are established modal requirements ([WAI-ARIA modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)). React Aria’s `Modal`, `Dialog`, and focus management already implement containment and restoration, including Visual Viewport sizing support for mobile keyboards ([React Aria Modal](https://reactspectrum.blob.core.windows.net/reactspectrum/a1d8693d0f77c7d8a3feff1dd6844dbe735cb8d8/docs/react-aria/Modal.html), [FocusScope](https://reactspectrum.blob.core.windows.net/reactspectrum/e5df37eb83baef4c66e3e72949c156c3d8091445/docs/react-aria/FocusScope.html)).

Because the viewer contains structured content—image, caption, security status, controls, and possibly OCR text—initial focus should go to its visible heading with `tabIndex="-1"`, not directly to an unlabeled canvas. VoiceOver can then swipe forward through the image and controls in a predictable order.

## Gesture parity requires non-gesture alternatives

Pinch-to-zoom, double-tap, and swipe-down are useful iPhone conventions but cannot be the only way to zoom or close. WCAG requires alternatives to multipoint/path-based gestures, and Apple expects controls to work through VoiceOver as well as direct touch ([WCAG 2.2 input modalities](https://www.w3.org/TR/WCAG22/), [Apple VoiceOver criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria)).

Every viewer must offer:

- Close button and `Escape`.
- Zoom in, zoom out, and reset/fit buttons.
- Panning through scrollable content at magnifications above fit.
- Swipe-down dismissal only as an optional shortcut and only when scale is 1×.
- No orientation lock.

Use React Aria `Button`/`onPress`, which normalizes touch, keyboard, and pointer activation ([React Spectrum Button](https://react-spectrum.adobe.com/Button)). All targets should be at least 44×44 CSS px, matching Apple’s touch-target guidance and exceeding WCAG 2.2’s 24×24 CSS px AA floor ([Apple UI design tips](https://developer.apple.com/design/tips/), [WCAG target-size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)).

## Dynamic Type is not automatic with the fixed fonts

Inter and Source Serif 4 do not automatically guarantee iOS Dynamic Type behavior. WebKit exposes Apple text styles such as `font: -apple-system-body`, but those styles are system-font-oriented ([WebKit system font and Dynamic Type](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)). An installed PWA also lacks Safari’s normal per-site text-size toolbar.

Apple permits an equivalent in-app size control and expects at least 200% enlargement without overlap or severe truncation ([Apple Larger Text criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/larger-text-evaluation-criteria/)). WCAG AA independently requires text to reach 200% without loss of content or functionality ([WCAG Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text)).

Pi Remote should therefore ship its own text-scale preference—100%, 125%, 150%, 175%, 200%—using relative units throughout. A spike may test whether applying `font: -apple-system-body` and then overriding only `font-family` reliably imports the system’s size while retaining Inter, but the build must not depend on that undocumented combination.

## The clay accent fails important contrast roles on bone

Using the WCAG relative-luminance formula, `#d97757` against `#f8f8f6` is approximately **2.94:1**. That fails both the 4.5:1 requirement for normal text and the 3:1 requirement for necessary UI boundaries or focus indicators. WCAG requires 4.5:1 for normal text and 3:1 for meaningful non-text UI; Apple applies the same AA thresholds to its accessibility evaluation ([WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [WCAG non-text contrast](https://www.w3.org/TR/WCAG22/), [Apple Accessibility HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility/)).

Consequences:

- Do not use clay alone for text, thin borders, focus rings, error icons, or redaction status on bone.
- Clay may be a decorative strip or a filled control with tested carbon text.
- Focus needs a carbon outer ring; clay can be a secondary inner accent.
- “Redacted” must use text and/or a hatch or lock symbol, not clay color alone.
- Every dark-mode token pair needs its own automated contrast assertion.

## RTL should mirror interface flow, not image pixels

Apple recommends mirroring navigation and ordered controls in RTL contexts while preserving photographs and content whose direction is intrinsic ([Apple Right to Left](https://developer.apple.com/design/human-interface-guidelines/right-to-left), [Get it right (to left)](https://developer.apple.com/videos/play/wwdc2022/10107/)). The screenshot itself must never be mirrored. Close, zoom-in, zoom-out, and reset symbols are direction-neutral; previous/next controls, if later introduced, should follow logical reading order.

External text with unknown direction should use semantic `dir="auto"`. Filenames, paths, hashes, part numbers, and mixed-script identifiers are especially prone to Unicode bidi reordering and should be isolated with `<bdi>` where they must appear ([MDN `dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir), [W3C inline bidi guidance](https://www.w3.org/International/articles/inline-bidi-markup/Overview.en.php)). In the normal UI, host paths and digests should not appear at all.

## Prior art confirms the interaction, not its accessibility quality

Kimi Code’s web UI already renders media returned by tools as clickable thumbnails and documents responsive mobile behavior ([Kimi Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)). Its current image pipeline also applies downscaling, byte budgets, decompression-bomb checks, and HEIC/HEIF rejection, demonstrating that media normalization belongs at ingestion rather than in the transcript renderer ([Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)).

Open-source remote-agent clients establish adjacent precedent:

- [Happy](https://github.com/slopus/happy) provides encrypted mobile/web control for Codex and Claude Code.
- [Happier](https://github.com/happier-dev/happier) supports Pi and other agents with end-to-end-encrypted mobile clients.
- [CC Pocket](https://github.com/K9i-0/ccpocket) includes image/screenshot viewers and recommends Tailscale.
- [Harness Remote](https://github.com/giuliastro/harness-remote) is a React/Vite mobile agent client with English, Italian, and Traditional Chinese localization.

These repositories prove demand and implementation feasibility; their public documentation does not substantiate VoiceOver, Dynamic Type, or RTL conformance.

No auditable Claude/Kimi Mobbin screen URL was available in this pass. Mobbin’s public documentation says screen search requires authenticated MCP/API access and returns screen links to authorized workspaces ([Mobbin API quick start](https://docs.mobbin.com/api/quickstart), [Mobbin MCP introduction](https://docs.mobbin.com/mcp/introduction)). No screen-level claim should be invented from inaccessible records.

# 2. Concrete spec contribution a build phase can execute

## Protocol and durable representation

```ts
type InboundImageBlock = {
  kind: "image";
  artifact: {
    id: string;                 // opaque, ≥128 bits entropy
    revision: number;           // immutable transcript revision
    digest: `sha256:${string}`; // sanitized full-size bytes
    thumbnailDigest: `sha256:${string}`;
    expiresAt: string;
  };
  media: {
    type: "image/png" | "image/jpeg" | "image/webp";
    width: number;
    height: number;
    byteLength: number;
  };
  accessibility: {
    summary: string;            // redacted, ≤240 grapheme clusters
    language?: string;          // BCP 47
    textArtifact?: {
      id: string;
      revision: number;
      digest: `sha256:${string}`;
    };
  };
  redaction: {
    state: "sanitized" | "redacted" | "withheld";
    regionsApplied?: number;
    reason?: "policy" | "secret-detected" | "unverifiable";
  };
};
```

The durable transcript stores only this bounded descriptor. It stores no bytes, base64, signed URL, original filename, host path, OCR body, decoder error, or ticket.

A changed image produces a new artifact revision and a new transcript event. Clients must never silently follow an existing block to a newer revision.

## Ingestion and sanitization pipeline

1. The pi host extension submits bytes through an authenticated internal channel. It does not submit a host path or filename as display metadata.
2. Apply a 12 MiB encoded-input limit before decoding.
3. Allow only PNG, JPEG, and WebP after both signature and decoder validation. Reject SVG, GIF, PDF, TIFF, HEIC/HEIF, and all mismatches. MIME headers alone are untrusted; OWASP recommends allowlisting, signature validation, generated names, size limits, isolated storage, and image rewriting ([OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)).
4. Decode in a network-disabled worker with:
   - `limitInputPixels: 32_000_000`;
   - maximum 16,384 px on either axis;
   - `failOn: "warning"`;
   - one page/frame only;
   - 2-second CPU deadline;
   - 128 MiB memory ceiling.
   
   Sharp exposes pixel limits, strict invalid-data handling, channel limits, and safety controls intended to prevent resource exhaustion ([Sharp constructor](https://sharp.pixelplumbing.com/api-constructor/)).
5. Auto-orient, then rasterize and re-encode. Do not copy EXIF, GPS, comments, ICC names, XMP, thumbnails, or filenames.
6. Run OCR and the existing text redactor. Secret matches must be replaced with opaque solid rectangles plus a visible hatch and localized “Redacted” label. Blur and pixelation are prohibited because they can preserve recoverable information.
7. Replace the equivalent OCR span with `[redacted]`.
8. If a probable sensitive span cannot be mapped confidently to pixels, or the decoder/OCR/redactor fails, discard all variants and emit `withheld`. Fail closed.
9. Produce:
   - Full variant: longest edge ≤4096 px, ≤8 MiB.
   - Thumbnail: longest edge 960 px, ≤512 KiB.
   - Text companion: UTF-8 plaintext, ≤32 KiB after redaction.
10. Hash final sanitized bytes only. Raw bytes exist in worker memory only and are destroyed after completion.
11. Store sanitized artifacts outside the transcript store, encrypted at rest, default TTL 24 hours, hard maximum seven days.

OWASP specifically recommends rewriting accepted images and storing them under application-generated names rather than trusting filenames or client MIME data ([OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)). Scriptable SVG remains out of scope; OWASP ASVS calls out scripts and `foreignObject` as active SVG hazards ([OWASP ASVS sanitization requirements](https://github.com/OWASP/ASVS/blob/master/5.0/en/0x10-V1-Encoding-and-Sanitization.md)).

## Ticketed delivery

- The client requests a one-use fetch ticket scoped to `{session, artifactId, revision, digest, variant}`.
- It uses that ticket in an authenticated `fetch`, never in an `<img src>` URL.
- The relay atomically consumes the ticket. Replay returns a generic 410.
- The client verifies SHA-256 with Web Crypto before creating a blob URL.
- Revision or digest mismatch returns a generic “Can’t verify preview”; no newer artifact is substituted.
- The verified blob URL is assigned to `<img>` and revoked on viewer close, block removal, logout, or session change.
- The service worker must bypass artifact and ticket endpoints entirely.

Artifact responses:

```http
Content-Type: image/png
X-Content-Type-Options: nosniff
Cache-Control: private, no-store
Content-Disposition: inline; filename="preview.png"
```

Correct MIME types plus `nosniff` prevent the browser from reinterpreting content ([MDN Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Type), [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options)). Use `img-src 'self' blob:` and `object-src 'none'`; CSP can restrict image origins and block object/embed rendering ([MDN `img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/img-src), [CSP guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)).

## Inline states

| State | Visible content | Accessibility behavior |
|---|---|---|
| Receiving | Static placeholder, “Receiving screenshot…” | `aria-hidden`; no live announcement |
| Sanitizing | Static placeholder, “Checking screenshot…” | `aria-hidden`; no repeated speech |
| Ready | Thumbnail, summary, type/dimensions/size | Add one button to transcript log |
| Redacted | Thumbnail with persistent “Redactions applied” badge | Button name includes “redactions applied” |
| Withheld | Lock/shield icon and “Preview withheld by security policy” | Non-interactive status, announced once |
| Offline | Existing thumbnail removed from memory; “Reconnect to load preview” | Button only if retry is possible |
| Expired | “Preview expired” and original summary | Non-interactive terminal status |
| Verification failure | “Can’t verify preview” | `role="status"`, never expose mismatch details |
| Decode/load failure | “Preview unavailable” | No broken-image filename or URL announcement |

The card is a `react-aria-components` `Button` with `aria-haspopup="dialog"`. It contains:

- Thumbnail with `alt=""`, fixed intrinsic width/height, `object-fit: contain`.
- Visible summary in Source Serif 4.
- Localized metadata in Inter.
- A textual security badge; no color-only state.
- One focus target only—no nested button or link.

## Full-screen viewer

DOM/React Aria structure:

```tsx
<Modal isDismissable={false}>
  <Dialog aria-labelledby="viewer-title">
    <Heading id="viewer-title" slot="title" tabIndex={-1}>
      Screenshot preview
    </Heading>
    <Button slot="close">Close</Button>
    <figure>
      <img alt={summary} />
      <figcaption>{summary}</figcaption>
    </figure>
    <Toolbar aria-label="Image zoom">
      <Button>Zoom out</Button>
      <output aria-live="polite">100%</output>
      <Button>Zoom in</Button>
      <Button>Fit image</Button>
    </Toolbar>
  </Dialog>
</Modal>
```

Behavior:

- Open: focus visible heading; transcript becomes inert.
- Close by button, `Escape`, browser back integration, or optional downward swipe at 1×.
- Close: restore focus to the invoking card without changing transcript scroll position.
- Zoom steps: Fit, 100%, 150%, 200%, 300%, 400%.
- Double-tap toggles Fit ↔ 200%.
- Pinch follows the fingers with no inertial overshoot.
- At zoom >Fit, one-finger pan is enabled; zoom controls remain reachable.
- VoiceOver mode must not depend on custom two-finger gestures.
- No Save, Share, Copy Image, Open in New Tab, or download action in the first release.
- Suppress the iOS long-press image callout as UX hardening, while documenting that screenshots and OS screen capture cannot be prevented as a security boundary.

Use `100dvh`, `viewport-fit=cover`, and:

```css
padding-block-start: max(12px, env(safe-area-inset-top));
padding-block-end: max(12px, env(safe-area-inset-bottom));
padding-inline-start: max(12px, env(safe-area-inset-left));
padding-inline-end: max(12px, env(safe-area-inset-right));
```

WebKit documents these safe-area variables for edge-to-edge iPhone layouts ([WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)).

## Dynamic Type and long strings

- Store `--text-scale` as 1, 1.25, 1.5, 1.75, or 2.
- All text, gaps associated with text, and button labels use `rem`/`em`, not viewport units.
- Use unitless line heights: at least 1.45 for Inter and 1.5 for Source Serif 4.
- At 150% and above, metadata and actions stack vertically.
- At 200%, the zoom toolbar may wrap to two rows but must not cover the image or safe areas.
- Do not truncate the full viewer caption or security explanation.
- Inline summaries may clamp visually to three lines only if the complete summary appears in the viewer and accessible name.
- Apply `min-inline-size: 0` and `overflow-wrap: anywhere` to external summaries. `overflow-wrap:anywhere` creates emergency break opportunities for otherwise unbreakable strings ([MDN `overflow-wrap`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap)).
- Do not disable browser scaling with `user-scalable=no` or restrictive `maximum-scale`; W3C’s viewport rule treats those as failures of zoom availability ([W3C meta viewport rule](https://www.w3.org/WAI/standards-guidelines/act/rules/b4f0c3/)).

## RTL and localization

- Set `<html lang={locale} dir={direction}>`.
- Use CSS logical properties exclusively: `margin-inline`, `padding-inline`, `inset-inline`, `border-inline-start`.
- Set external summary/caption elements to `dir="auto"` and their declared BCP 47 `lang` when supplied.
- Preserve the screenshot at `direction:ltr` only for coordinate calculations; do not force its caption to LTR.
- Do not mirror image pixels, plus/minus icons, close icon, redaction masks, or physical pan coordinates.
- Localize all statuses, accessible names, and error messages through message catalogs. Do not concatenate “Open” + filename or number + unit.
- Format dimensions, byte sizes, zoom percentages, dates, and counts through `Intl.NumberFormat`/`Intl.DateTimeFormat`.
- Use plural-aware messages for “{count} redactions applied.”
- Isolate any necessary technical token with `<bdi dir="ltr">`.
- Test Arabic, Hebrew, German expansion, Japanese, Traditional Chinese, mixed Arabic/Latin paths, emoji, combining marks, and 200-character unbroken strings.

## Visual and motion requirements

- Inline card: preserved aspect ratio, maximum 240 CSS px tall, carbon boundary or shadow that independently reaches 3:1 where it identifies the control.
- Viewer: neutral carbon surround so image edges remain distinguishable; toolbar uses opaque parchment rather than translucent material.
- Clay is decorative on bone. It may fill a badge only when the text/icon pair passes contrast independently.
- Focus: 2 px carbon ring plus 2 px offset; never clay-only.
- Redactions: solid carbon rectangle, clay hatch, lock icon, and text label.
- Loading: static placeholder; no shimmer.
- Standard motion: opacity-only modal transition, 120–160 ms. Do not use shared-element scaling.
- Under `prefers-reduced-motion: reduce`: all modal, zoom-step, pan-snap, and swipe-dismiss transitions become instantaneous. User-driven zoom remains functional but has no interpolation. Large scaling and panning animations are known vestibular triggers, and iOS exposes Reduce Motion through this media query ([MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)).

## Objective acceptance gates

1. VoiceOver on a physical iPhone can discover, open, inspect, zoom through buttons, read extracted text, close, and return to the same transcript card without sighted assistance.
2. External keyboard operation supports `Tab`, `Shift+Tab`, `Enter`/`Space`, and `Escape`; focus never leaves the open dialog.
3. Switch Control and Voice Control can target every action by its visible localized label.
4. New-image insertion never moves focus and produces at most one polite announcement.
5. At 200% text scale and 320 CSS px viewport width, no label, status, close control, or extracted-text action is clipped or overlaps another element.
6. Portrait and both landscape orientations preserve safe-area access to all controls.
7. Arabic RTL mirrors toolbar flow but not the screenshot or physical zoom coordinates.
8. Automated contrast checks reject clay-on-bone text, border, icon, and focus-ring usage.
9. Reduced Motion produces no scale, translation, shimmer, or animated zoom transition.
10. MIME spoofing, SVG, animated WebP, malformed/truncated files, decompression bombs, EXIF GPS, ticket replay, stale revision, and digest mismatch all fail closed.
11. Accessibility-tree snapshots contain no original path, filename, artifact ID, digest, ticket, raw decoder error, or unredacted OCR text.
12. Closing or expiring a viewer revokes every associated blob URL; service-worker cache inspection contains zero artifact responses.

# 3. Divergent / minority ideas worth considering

## Make image previews opt-in per session

Display a text-first “Sanitized screenshot available” card and fetch no pixels until activated. This reduces shoulder-surfing, cellular usage, and unexpected sensitive content. A session preference could enable automatic inline thumbnails after the user has established trust.

## Require a text twin before releasing pixels

A stricter accessibility policy would withhold every screenshot until pi supplies a redacted semantic summary and text-heavy screenshots also have an extracted-text companion. This treats inaccessible media as incomplete protocol output rather than a UI limitation.

## Avoid custom pinch entirely

Use Fit/100%/200%/400% controls plus native browser/page magnification, with a scrollable image at enlarged sizes. This gives up some Claude/Photos-like tactility but avoids conflict among app pinch, Safari page zoom, VoiceOver gestures, and Switch Control.

## Separate informative and functional semantics

Instead of making the whole card one button, expose a non-interactive `<figure>` with meaningful `alt`, followed by an explicit “Open full screen” button. This adds a VoiceOver stop but cleanly separates “what the screenshot contains” from “what activation does.” It may outperform the single-card design for complex diagrams.

## Blur all previews until explicitly revealed

Keep sanitized thumbnails blurred by default, with a clearly labeled “Reveal screenshot” button. The reveal state would be memory-only and reset when the app backgrounds. This protects against casual observation but increases friction and does not defend against OS screenshots after reveal.

## Keep sanitized bytes host-side

The relay could retain only the descriptor while a ticket opens an encrypted, direct Tailscale stream from host to phone. This minimizes relay retention but weakens offline/reconnect behavior, complicates digest verification, and departs from the proposed relay-sanitized artifact model.

# 4. Open questions + risks

- **Who authors the summary?** Pi has the best semantic context, OCR has the best literal coverage, and neither is reliably safe or correct. The protocol needs precedence and provenance rules without exposing verbose provenance to users.
- **Can visual secret detection really fail closed?** OCR can miss stylized text, QR codes, canvases, masked inputs, or secrets embedded in graphics. A “sanitized” label must not imply that the screenshot is proven harmless.
- **Should text-heavy screenshots be withheld without OCR?** Shipping them without an equivalent text route fails the desired accessibility bar; withholding them may frustrate users.
- **What retention matches transcript expectations?** A durable message whose image expires after 24 hours can feel broken. Longer retention increases sensitive-data exposure. The UI needs explicit expiration semantics.
- **How should offline mode behave?** Caching artifacts improves PWA continuity but conflicts with the no-durable-bytes security posture. The proposed spec chooses no offline pixels.
- **Can iOS standalone PWAs expose system text-size changes reliably with custom fonts?** If not, the in-app 200% control is mandatory and must be easy to discover.
- **Will custom pinch interfere with browser zoom or VoiceOver?** This requires physical-device testing across current and minimum-supported iOS versions, not only Playwright simulation.
- **React Aria and iOS WebKit regressions remain possible.** Safe areas, Visual Viewport sizing, focus restoration, and VoiceOver portal behavior must be retested on each major iOS release.
- **Long-press prevention is not a security boundary.** Users can still photograph or screen-capture displayed content. The product must describe preview security as controlled delivery and retention, not DRM.
- **RTL image navigation is unresolved for future galleries.** “Previous/next” should follow reading order, while swipe physics and physical screen direction may produce competing expectations.
- **Localization coverage needs ownership.** Error, redaction, expiration, accessibility, and security copy must ship together; silently falling back to English for a security state is unacceptable.
- **Mobbin parity remains unverified.** An authenticated screen audit of current Claude iOS and Kimi mobile viewer flows is still needed before claiming pixel- or gesture-level parity.

# 5. Sources

- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/)
- [Apple Human Interface Guidelines — Right to Left](https://developer.apple.com/design/human-interface-guidelines/right-to-left)
- [Apple Human Interface Guidelines — Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Apple VoiceOver evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria)
- [Apple Larger Text evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/larger-text-evaluation-criteria/)
- [Apple UI Design Dos and Don’ts](https://developer.apple.com/design/tips/)
- [Apple WWDC22 — Get it right (to left)](https://developer.apple.com/videos/play/wwdc2022/10107/)
- [WebKit — Using the System Font in Web Content](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)
- [WebKit — Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG — Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text)
- [WCAG — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [WCAG — Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [W3C Images Tutorial](https://www.w3.org/WAI/tutorials/images/)
- [W3C Functional Images](https://www.w3.org/WAI/tutorials/images/functional/)
- [W3C ARIA23 — `role="log"`](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23)
- [W3C Inline Bidi Markup](https://www.w3.org/International/articles/inline-bidi-markup/Overview.en.php)
- [React Aria Modal](https://reactspectrum.blob.core.windows.net/reactspectrum/a1d8693d0f77c7d8a3feff1dd6844dbe735cb8d8/docs/react-aria/Modal.html)
- [React Aria FocusScope](https://reactspectrum.blob.core.windows.net/reactspectrum/e5df37eb83baef4c66e3e72949c156c3d8091445/docs/react-aria/FocusScope.html)
- [React Spectrum Button](https://react-spectrum.adobe.com/Button)
- [MDN `log` role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role)
- [MDN ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)
- [MDN `dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir)
- [MDN `overflow-wrap`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap)
- [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)
- [MDN X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options)
- [MDN CSP `img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/img-src)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP ASVS — Encoding and Sanitization](https://github.com/OWASP/ASVS/blob/master/5.0/en/0x10-V1-Encoding-and-Sanitization.md)
- [Sharp constructor and decoder safety options](https://sharp.pixelplumbing.com/api-constructor/)
- [Kimi Code Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)
- [Kimi Code repository](https://github.com/MoonshotAI/kimi-code)
- [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)
- [Happy mobile coding-agent client](https://github.com/slopus/happy)
- [Happier mobile coding-agent client](https://github.com/happier-dev/happier)
- [CC Pocket](https://github.com/K9i-0/ccpocket)
- [Harness Remote](https://github.com/giuliastro/harness-remote)
- [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)
- [Mobbin MCP introduction](https://docs.mobbin.com/mcp/introduction)
