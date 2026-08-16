<!-- provenance: external-CLI orchestration pass; original file iter-05-sol.md -->
> **Source pass 5** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-5-sol.md`.

<!-- F8-inbound-media | model=sol | lens=react-implementation | iter 5/15 | 2026-08-16T04:48:24.729Z -->

## 1. Findings for the react-implementation lens

### The protocol boundary must remain reference-based

Pi’s current RPC documentation supports base64 image data on user `prompt` and `follow_up` commands, but it does not define an equivalent bounded assistant-output artifact reference. Reusing the prompt schema would put unbounded base64 into JSONL events and potentially session files—the opposite of the desired durable-state posture. The new block should therefore be a Pi Remote relay type, not a generic `ImageContent` clone: the durable transcript stores only an opaque artifact reference, revision, dimensions, bounded descriptive text, and rendition digests. [Pi RPC documentation](https://pi.dev/docs/latest/rpc), [Pi session format](https://pi.dev/docs/latest/session-format)

Never accept an assistant-provided URL as the image source. Open WebUI recently had a CSRF/SSRF-class vulnerability because model/chat image URLs were fetched without adequate validation; the affected UI looked like an ordinary inline image preview. Pi Remote should construct a same-origin artifact endpoint exclusively from validated identifiers. [Open WebUI advisory GHSA-j6w6-986j-2m2m](https://github.com/open-webui/open-webui/security/advisories/GHSA-j6w6-986j-2m2m)

### React component architecture

Use this component boundary:

```text
TranscriptBlockRenderer
└── InboundImageBlock
    ├── InboundImageCard
    │   ├── ArtifactSkeleton
    │   ├── VerifiedImage
    │   └── ArtifactFailure
    └── ImageViewerController
        └── F6ImageViewer
            ├── ModalOverlay
            ├── Dialog
            ├── ZoomSurface
            └── ViewerToolbar
```

The renderer should remain exhaustive over the transcript discriminated union. An unknown image schema version renders a bounded “Unsupported image block” card; it must not guess a URL or fall through to generic rich-text rendering.

`InboundImageCard` should use a React Aria `Button`, not an `onClick` handler on a `div`. React Aria’s `onPress` normalizes mouse, keyboard, and touch input and exposes pressed, focus-visible, disabled, and pending states through render props/data attributes. [React Aria Button](https://react-aria.adobe.com/Button)

The full-screen viewer should reuse F6’s visual surface but place it inside React Aria’s controlled `ModalOverlay → Modal → Dialog` composition. React Aria provides controlled opening, dismiss handling, enter/exit state attributes, and visual-viewport CSS variables—including the viewport remaining above an on-screen keyboard. [React Aria Modal](https://react-aria.adobe.com/Modal)

Do not add a complete lightbox framework merely for inbound images. It would duplicate F6’s modal, history, theming, and focus ownership. If F6 lacks zoom mechanics, `react-zoom-pan-pinch` is the narrower candidate: it has no external runtime dependencies and supports touch, pointer, and wheel input. Pin the exact tested release rather than a caret range; the project previously shipped a mobile pinch regression that affected iPhone Safari before being fixed. [Repository](https://github.com/BetterTyped/react-zoom-pan-pinch), [release history](https://github.com/BetterTyped/react-zoom-pan-pinch/releases), [mobile regression](https://github.com/BetterTyped/react-zoom-pan-pinch/issues/487)

### Fetch, authenticate, verify, then render

Do not assign the relay route directly to `<img src>`. That would let the browser decode and display bytes before the transcript digest is checked.

The hook should:

1. Construct the route from validated `sessionId`, `artifactId`, `revision`, and rendition name.
2. Fetch with `credentials: "same-origin"`, `cache: "no-store"`, and an `AbortSignal`.
3. Reject non-200 responses, redirects, missing or excessive `Content-Length`, and an unexpected `Content-Type`.
4. Read the bounded response into an `ArrayBuffer`.
5. calculate SHA-256 with `crypto.subtle.digest`.
6. Compare the complete digest with the transcript value.
7. Only then create a typed `Blob`, call `URL.createObjectURL`, and expose the URL to `<img>`.
8. Revoke the URL when its last consumer releases it.

`SubtleCrypto.digest` is available only in secure contexts and requires the entire input in memory, which makes a hard compressed-byte ceiling essential. Object URLs must be explicitly revoked; the API is unavailable in service workers partly because unreleased URLs can leak memory. [SubtleCrypto.digest](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest), [URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)

Use a memory-only `ArtifactImageStore`, exposed through `useSyncExternalStore`, keyed by:

```ts
`${sessionId}:${artifactId}:${revision}:${rendition}:${sha256}`
```

The store should deduplicate fetches, reference-count object URLs, retain at most 20 thumbnails and 2 full-resolution images, and never write artifact bytes or URLs to local storage, IndexedDB, TanStack persistence, or the Cache API. Service-worker caches are persistent request/response stores and intercept subresource requests, including images; the artifact route must use a network-only rule. [PWA caching](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)

Use an `AbortController` when a card leaves the transcript, its reference changes, or a viewer closes. Aborting also stops response-body consumption and streams. [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

### React 19-specific handling

Use an explicit external store and state machine rather than suspending on an Effect-created promise. React notes that Suspense does not detect data fetched from Effects or event handlers. A local Suspense wrapper could still lazy-load the viewer bundle, but it should not own the integrity-sensitive artifact fetch. [React Suspense](https://react.dev/reference/react/Suspense)

The store prevents development Strict Mode’s setup/cleanup cycle from causing duplicate downloads. Component Effects should only subscribe, increment/decrement references, and revoke resources through cleanup. React runs cleanup before an Effect restarts with changed dependencies. [React useEffect](https://react.dev/reference/react/useEffect)

Memoize the ready card by immutable artifact key. Streaming text or thinking deltas must not rerender already-decoded images. Key transcript blocks by stable `blockId`, never by array index.

Use `startTransition` only for nonurgent viewer bookkeeping, such as switching the displayed rendition after decode. Opening, closing, focus, digest failures, and security state are urgent and should update synchronously. React transitions are nonblocking and may delay visible updates. [React useTransition](https://react.dev/reference/react/useTransition)

### iPhone and installed-PWA constraints

Use `100dvh` only as a fallback. Prefer React Aria’s `--visual-viewport-height` for the modal, plus `env(safe-area-inset-*)` padding. Safari distinguishes small, large, and dynamic viewport units, and edge-to-edge layouts require `viewport-fit=cover` plus explicit safe-area padding. [WebKit viewport units](https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/), [safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

Portal the viewer directly under `document.body`; do not place it below transformed, filtered, or contained ancestors. Safari 26 has an open installed-PWA bug in which fixed and sticky elements drift during scrolling, so actual standalone-mode testing remains mandatory even with correct CSS. [WebKit bug 301172](https://bugs.webkit.org/show_bug.cgi?id=301172)

Treat browser Fullscreen API use as optional enhancement only. An app-level modal already fills an installed PWA, while the web Fullscreen API remains non-Baseline and can reject requests. If F6 uses it, request it only inside the thumbnail’s user activation and fall back silently to the modal. [MDN Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API), [Safari 26.4 Fullscreen fixes](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/)

Provide zoom-in, zoom-out, and reset controls in addition to pinch and pan. WCAG requires a single-pointer alternative to multipoint gestures; keyboard support alone is not sufficient. [WCAG pointer gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures)

Do not set `user-scalable=no` or `maximum-scale=1` globally. Limit `touch-action: none` to the zoom surface while the viewer is open. Controls use `touch-action: manipulation`.

All actionable viewer controls should have 44×44 CSS-pixel hit regions. Apple recommends at least 44×44 points, exceeding WCAG 2.2’s 24×24 CSS-pixel minimum. [Apple button guidance](https://developer.apple.com/design/human-interface-guidelines/buttons), [WCAG 2.2 target-size summary](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

### Prior-art lessons

- Claude publicly supports image and screenshot analysis and JPEG, PNG, GIF, and WebP input. That demonstrates user expectation, not an obligation to accept the same attack surface in Pi Remote’s first release. [Claude App Store](https://apps.apple.com/us/app/claude/id6473753684), [Claude file support](https://support.claude.com/en/articles/8241126-upload-files-to-claude)
- Kimi supports images among broader file workflows, but its published limits are optimized for a cloud service, not a private relay on an iPhone PWA. [Kimi overview](https://www.kimi.com/help/getting-started/overview)
- `remote-agent` and `harness-remote` demonstrate that mobile PWA control of Pi and other coding agents is viable over Tailscale/private networking. [remote-agent](https://github.com/d-kimuson/remote-agent), [harness-remote](https://github.com/giuliastro/harness-remote)
- Claush uploads images into a named host directory. That is useful prior art for workflow discoverability, but Pi Remote should explicitly avoid surfacing host paths or filenames. [Claush manual](https://claush.jp/langs/en/manual/)
- Public Claude iOS capture sets provide a reproducible visual-comparison corpus, including 80 real-device screens, even though they do not document implementation mechanics. [Claude iOS screen corpus](https://techdevnotes.com/apps/ios/claude/6473753684/screenshots)

## 2. Concrete spec contribution a build phase can execute

### Durable content-block schema

```ts
type ImageRendition = {
  mediaType: "image/png" | "image/jpeg";
  byteLength: number;
  width: number;
  height: number;
  sha256: string;
};

type InboundImageBlock =
  | {
      kind: "image";
      schemaVersion: 1;
      blockId: string;
      artifact: {
        id: string;
        revision: number;
        thumbnail: ImageRendition;
        full: ImageRendition;
      };
      presentation: {
        alt: string;
        caption?: string;
      };
      redaction: {
        status: "passed";
        pipelineVersion: string;
        maskedRegionCount: number;
      };
    }
  | {
      kind: "image";
      schemaVersion: 1;
      blockId: string;
      redaction: {
        status: "blocked";
        reason:
          | "unsupported_type"
          | "size_limit"
          | "pixel_limit"
          | "decode_failed"
          | "sensitive_content"
          | "scanner_unavailable"
          | "revision_conflict";
      };
      presentation: {
        alt: "Image withheld by security policy";
      };
    };
```

Forbidden durable fields:

- raw bytes, base64, data URLs, object URLs, signed URLs;
- host paths, original filenames, usernames, hostnames, tool command strings;
- original MIME declarations or unredacted EXIF/XMP/ICC data;
- OCR output, detected secret values, or redaction match text.

Validate the schema at relay ingress and again before rendering. Reject unknown properties for this block type.

### Ingestion and sanitization

The artifact creation is a durable mutation even though the eventual client interaction is read-only. Apply the existing one-use ticket and revision-check model:

1. The host extension requests an ingest ticket bound to session, run, expected transcript revision, declared byte count, declared media type, and a 30-second expiry.
2. The ticket is single-use and burned on success, rejection, timeout, or interrupted upload.
3. The host streams bytes once. The mobile client has no artifact-upload endpoint.
4. Sanitize in an isolated worker before acquiring the transcript write lock.
5. At commit, compare the bound transcript revision. On mismatch, destroy staged data and return a revision conflict; never append an unreferenced or reordered block.
6. Atomically commit artifact metadata, rendition bytes, and transcript block.
7. Append only a blocked stub on a deterministic policy rejection. Infrastructure failures should leave no transcript artifact unless the product explicitly wants a visible diagnostic.

Version-one limits:

| Limit | Value |
|---|---:|
| Accepted source codecs | PNG, JPEG |
| Encoded input | 8 MiB |
| Input pixels | 16,000,000 |
| Input channels | 4 |
| Longest input edge | 8,192 px |
| Full rendition | ≤4,096 px edge, ≤12 MP, ≤6 MiB |
| Thumbnail | ≤640 px edge, ≤256 KiB |
| Frames/pages | exactly 1 |
| Caption | 500 Unicode code points |
| Alt text | 240 Unicode code points |

Reject SVG, GIF, TIFF, PDF, HEIC, AVIF, WebP, animated images, malformed metadata, truncated pixels, and format/signature mismatches in the first release. OWASP recommends extension/type allowlists, signature validation, randomized identifiers, size limits, and image rewriting rather than trusting claimed `Content-Type`. [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

Sanitization steps:

1. Enforce byte limit while streaming.
2. Inspect magic bytes and decode from a memory buffer, never a filename.
3. Enforce pixel/channel/page limits before full rasterization.
4. Apply EXIF orientation to pixels.
5. Convert to sRGB.
6. Strip all metadata.
7. Run the configured visual-redaction stage.
8. Re-encode from decoded pixels.
9. Generate thumbnail from the sanitized full rendition.
10. Compute SHA-256 over each final encoded rendition.
11. Erase the source and intermediate buffers.

For coding screenshots, visual redaction should mask recognized credentials, authorization headers, PEM material, environment assignments, home-directory usernames, and configured tailnet identifiers. OCR text and matches must remain ephemeral. If OCR fails, the secret classifier is unavailable, or a suspected token cannot be localized with sufficient confidence, fail closed with `scanner_unavailable` or `sensitive_content`. Do not label metadata stripping alone as “content redaction.”

If the relay uses Sharp, pin `sharp >= 0.35.3`, set `limitInputPixels: 16_000_000`, `limitInputChannels: 4`, retain `failOn: "warning"`, block every loader except JPEG/PNG buffers, and run the worker with process-level CPU, memory, file, and network restrictions. Sharp’s July 2026 advisory affected untrusted-input processing below 0.35.0; the advisory was updated on August 14 with another high-severity CVE. [Sharp advisory](https://github.com/lovell/sharp/security/advisories/GHSA-f88m-g3jw-g9cj), [Sharp constructor safeguards](https://sharp.pixelplumbing.com/api-constructor/)

### Delivery endpoint

```text
GET /api/sessions/{sessionId}/artifacts/{artifactId}/revisions/{revision}/{thumbnail|full}
```

Requirements:

- authenticate the current tailnet/app session;
- verify that the artifact is referenced by the requested session;
- reject revision mismatch rather than returning “latest”;
- never redirect;
- return only the exact sanitized rendition;
- rate-limit by authenticated session and artifact;
- return `404` for unknown/not-authorized, `410` for intentionally purged, and `409` for unavailable revision.

Required response headers:

```http
Content-Type: image/png
Content-Length: …
Content-Digest: sha-256=:…:
Cache-Control: private, no-store
X-Content-Type-Options: nosniff
Cross-Origin-Resource-Policy: same-origin
Content-Disposition: inline; filename="pi-image.png"
```

`no-store` is the directive that requests no cache storage; `no-cache` alone still permits storage. [MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) `nosniff` prevents interpreting a mismatched payload as another content type. [MDN X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options)

PWA CSP contribution:

```http
default-src 'self';
img-src 'self' blob:;
connect-src 'self';
object-src 'none';
frame-src 'none';
base-uri 'none';
```

Do not add `data:` or arbitrary HTTPS origins to `img-src`. CSP supports distinct image and object restrictions; `object-src 'none'` blocks plugin/embed content. [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

### Client state machine

| State | Trigger | Inline presentation | Full-screen behavior |
|---|---|---|---|
| `deferred` | Card outside preload margin | Aspect-ratio placeholder | Opens and begins full fetch |
| `fetching` | Thumbnail/full requested | Static skeleton, `aria-busy=true` | Spinner plus “Loading image” status |
| `verifying` | Bytes received | Same skeleton; never show bytes | Same |
| `decoding` | Digest passed | Same skeleton | Same |
| `ready` | `img.decode()` succeeds | Sanitized thumbnail | Full rendition, zoom enabled |
| `blocked` | Durable policy stub | Shield icon and reason text | Cannot open |
| `offline` | Network unavailable | “Image unavailable offline” and Retry | Retry control |
| `expired` | HTTP 410 | Tombstone card | Cannot open |
| `not_found` | HTTP 404 | Generic unavailable state | Cannot open |
| `tampered` | Length/type/digest mismatch | High-priority integrity warning | Must not render or retry automatically |
| `decode_error` | `img.decode()` rejects | “Image could not be decoded” and Retry | Same |
| `unsupported` | Unknown schema/media | Bounded unsupported card | Cannot open |

`HTMLImageElement.decode()` resolves only when the image is decoded and safe to render and rejects corrupt data. [MDN image decode](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode)

A digest or content-type mismatch is not a normal network error. Abort the display, revoke any URL, record a redacted security event, and require an explicit retry after fresh metadata synchronization.

### Inline card

- Width: `min(100%, 22rem)`.
- Maximum visible thumbnail height: `18rem`.
- Reserve the exact intrinsic aspect ratio using width/height attributes and CSS `aspect-ratio`; known dimensions prevent layout shift. [MDN image performance](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Multimedia)
- Use `object-contain`, never crop screenshots.
- Entire card is a React Aria `Button` with `aria-label="Open image: {alt}"`.
- The nested thumbnail uses `alt=""` to prevent duplicate announcement; the button’s accessible name and visible caption carry the meaning.
- Caption: Source Serif 4, at most three lines inline.
- Metadata/status: Inter, tabular numerals where applicable.
- Border: one-pixel carbon token at low opacity; 12px radius.
- Background: bone token in light mode and the existing parchment-dark surface in dark mode.
- Clay `#d97757` appears only on focus, retry, or security emphasis—not as an image tint.
- Provide a visible 2px focus ring with offset and sufficient contrast.
- Do not show artifact ID, digest, path, filename, or host details.

### Full-screen viewer and gestures

- Controlled `ModalOverlay`, `Modal`, and `Dialog`.
- Visible heading: “Image preview”; it may be visually compact but must remain in the accessibility tree.
- Close button auto-focused on open, 44×44 target, safe-area inset from the top and leading edge.
- Focus remains inside the viewer; Escape closes it; closing restores focus to the initiating card. These behaviors match the WAI modal-dialog pattern. [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- If virtualization would unmount the card, pin its transcript row while the viewer is open. If restoration still fails, focus the transcript container and scroll the block back into view.
- Opening pauses transcript auto-follow. Closing resumes it only if the user was already pinned to the bottom.
- Fit scale is `min(viewportWidth / imageWidth, viewportHeight / imageHeight, 1)`.
- Pinch range: fit scale through 4×.
- Double tap: zoom to 2× around the tap point; double tap again resets.
- Single-finger drag pans only when above fit scale.
- At fit scale, vertical movement scrolls nowhere and does not dismiss the viewer in version one.
- Toolbar controls: Zoom out, Reset/Fit, Zoom in. All are 44×44 and remain available to VoiceOver, Switch Control, keyboard, and single-pointer users.
- Clamp transforms after every gesture, visual-viewport resize, and orientation change.
- Reset transform when switching artifact revision.
- Do not support share, save, copy, or open-in-new-tab unless F6 already has separately authorized behavior.

Use a lightweight history marker so the installed-PWA back gesture closes the viewer before leaving the session. Pop only a marker owned by the viewer; never call `history.back()` blindly.

### Visual viewport and Tailwind 4

Representative viewer shell:

```tsx
<ModalOverlay
  isDismissable
  className="fixed inset-0 z-50 bg-carbon/90
             motion-safe:data-[entering]:animate-in
             motion-safe:data-[exiting]:animate-out
             motion-reduce:transition-none"
>
  <Modal className="h-[var(--visual-viewport-height,100dvh)] w-full">
    <Dialog className="relative h-full w-full outline-none">
      …
    </Dialog>
  </Modal>
</ModalOverlay>
```

Safe-area toolbar padding:

```text
pt-[max(0.75rem,env(safe-area-inset-top))]
pr-[max(0.75rem,env(safe-area-inset-right))]
pb-[max(0.75rem,env(safe-area-inset-bottom))]
pl-[max(0.75rem,env(safe-area-inset-left))]
```

Entry/exit motion: 160ms opacity plus scale from `0.985` to `1`; no spring. Under reduced motion, use an instantaneous opacity change with no image scaling or panning animation. Tailwind exposes `motion-safe` and `motion-reduce` variants, and large-scale zoom/pan animation can trigger vestibular discomfort. [Tailwind animation](https://tailwindcss.com/docs/animation), [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)

### Accessibility text

- Require relay-redacted `alt`; default to “Image sent by pi” when no useful description exists.
- If the image contains meaningful text not available elsewhere, provide a separate bounded “Image description” disclosure rather than placing an OCR transcript into `alt`.
- Never use the host filename as alt text.
- A blocked or expired image uses visible text and an icon, not color alone.
- Only the active full-screen loading/error state uses live announcements. Do not announce every lazy thumbnail as the user scrolls.
- The W3C image decision tree calls for brief meaningful alt text for informative images and an equivalent elsewhere for complex images. [W3C alt decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)

### Objective acceptance checks

1. Schema tests reject `path`, `url`, `data`, `base64`, unknown fields, negative sizes, malformed digests, and unsupported schema versions.
2. Ingest tests reject spoofed MIME, PNG/JPEG polyglots, SVG, animation, truncation, over-limit bytes, over-limit pixels, symlinks, and revision conflicts.
3. Sanitizer tests prove EXIF/XMP/ICC/source filename removal and deterministic digest generation.
4. Network tests prove no redirects, exact revision binding, same-session authorization, `no-store`, `nosniff`, CORP, and correct error codes.
5. A tampered fixture must fail digest verification before any `<img>` receives an object URL.
6. Service-worker tests prove artifact requests are never present in `CacheStorage`.
7. Open/close the viewer 50 times; all full-resolution object URLs must be revoked and the memory-store full-image count must return to zero.
8. Render 100 transcript images; only cards within the configured intersection margin may fetch thumbnails.
9. Axe tests report no critical violations; keyboard tests prove focus containment, Escape close, and focus restoration.
10. VoiceOver device tests verify card name, blocked state, close, zoom controls, and no duplicate image announcement.
11. Test Safari and installed standalone mode in portrait and landscape on the minimum-supported iOS, iOS 18, and Safari 26.x.
12. Test background/foreground, process eviction, offline reopen, edge-back, rotation while zoomed, Reduce Motion, Bold Text, 200% page zoom, and dark mode.
13. Security telemetry must contain reason codes and HMAC-correlated identifiers only—no paths, filenames, OCR strings, token matches, or image bytes.

## 3. Divergent / minority ideas worth considering

### Tile long screenshots instead of serving one full bitmap

A coding-agent screenshot may be extremely tall. A signed manifest plus independently digested 1,024px tiles would let the viewer decode only visible regions and bound iOS memory. It also permits progressive rendering without trusting an entire monolithic response. The cost is materially greater protocol, redaction, pan/zoom, and accessibility complexity. This is worth prototyping if long-page captures are a primary use case.

### Redaction by construction, not OCR after capture

For browser/UI screenshots, capture through an allowlisted renderer that receives structured elements and paints only approved regions. Sensitive text fields, terminal environment values, and browser chrome can be omitted before pixels exist. This is stronger than asking OCR to rediscover secrets after rasterization, but it cannot handle arbitrary images and may visually diverge from the host screen.

### Tap-to-load as a high-security mode

Render a dimensioned card and description without automatically retrieving even the thumbnail. “Load preview” would explicitly fetch sanitized bytes. This reduces sensitive pixels in memory, network traces, and accidental shoulder-surfing at the expense of Claude/Kimi-like immediacy. It could be a per-session policy rather than the default.

### Treat screenshots as ephemeral transcript projections

Keep only the blocked/available descriptor durably and expire rendition bytes when the Pi run settles or the viewer closes. The transcript would later show “Preview expired.” This is the strongest interpretation of “no unbounded durable state,” but it weakens reproducibility and session resumption.

### Separate artifact origin

Serve sanitized bytes from a cookie-less tailnet origin with an independently restrictive CSP and short-lived read capability delivered outside the transcript. This reduces the consequences of route or content-type mistakes, but complicates authentication, service-worker scope, offline behavior, and capability revocation.

### No gesture library

A scrollable `<img>` with browser page zoom avoids third-party gesture code and preserves native magnification. It will not match native image-viewer behavior, and browser zoom affects viewer chrome as well as the image. Keep this as the fallback if physical-device testing exposes persistent custom-pinch defects.

## 4. Open questions + risks

1. **Meaning of “redacted.”** Is metadata/path redaction sufficient, or must Pi Remote guarantee pixel-level secret redaction? OCR cannot provide a mathematical guarantee. The product should not label an image “redacted” unless the threat model defines the guarantee.
2. **Authorized sources.** Can pi surface any workspace image, only images created by approved tools, or only screenshots returned as capability handles? Arbitrary filesystem paths substantially enlarge the read boundary.
3. **Retention.** Define artifact TTL, per-session byte quota, encryption-at-rest requirements, deletion behavior, and whether session export includes images.
4. **F6 contract.** Confirm its modal ownership, zoom API, back-stack integration, share/save controls, and focus restoration before adding a second viewer layer.
5. **Ordering and revision conflicts.** Decide whether image sanitization pauses the Pi event stream or retries against a refreshed transcript revision. Silent reordering is unacceptable.
6. **Redaction failure UX.** Should a blocked image produce a permanent transcript stub, or should scanner/infrastructure failures remain transient diagnostics?
7. **Minimum iOS version.** The device matrix and Fullscreen fallback depend on the supported baseline; Claude currently requires iOS 18, but an installable PWA may intend a broader range. [Claude App Store](https://apps.apple.com/us/app/claude/id6473753684)
8. **Image processor patch response.** The sanitizer processes hostile bytes and therefore needs dependency pinning, SBOM monitoring, fast codec disablement, and a kill switch. The August 2026 Sharp/libvips advisory illustrates the operational risk. [Sharp advisory](https://github.com/lovell/sharp/security/advisories/GHSA-f88m-g3jw-g9cj)
9. **iOS memory.** Encoded-byte limits do not cap decoded memory; a 12MP RGBA image is roughly 48MB before additional compositor copies. Physical-device memory tests must determine whether the proposed 12MP ceiling should be lower.
10. **Installed-PWA layout bugs.** Safari 26’s fixed/sticky drift issue may require a product-specific fallback such as temporarily freezing the transcript scroller or rendering the viewer in the document flow. [WebKit bug 301172](https://bugs.webkit.org/show_bug.cgi?id=301172)
11. **Mobbin verification.** Mobbin’s screen-search API requires an authenticated Team or Enterprise key, and no public stable Claude/Kimi screen identifiers were available in this pass. Obtain authorized screen links before final visual sign-off rather than fabricating citations. [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)

## 5. Sources

- [Pi RPC mode](https://pi.dev/docs/latest/rpc)
- [Pi session-file format](https://pi.dev/docs/latest/session-format)
- [React Aria Modal](https://react-aria.adobe.com/Modal)
- [React Aria Button](https://react-aria.adobe.com/Button)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [React useEffect](https://react.dev/reference/react/useEffect)
- [React useTransition](https://react.dev/reference/react/useTransition)
- [Tailwind CSS animation and reduced-motion variants](https://tailwindcss.com/docs/animation)
- [WAI modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WAI pointer-gesture guidance](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures)
- [WCAG 2.2 target-size summary](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [W3C alt-text decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
- [Apple button guidance](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [WebKit dynamic viewport units](https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/)
- [WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WebKit installed-PWA fixed-position bug](https://bugs.webkit.org/show_bug.cgi?id=301172)
- [Safari 26.4 features](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/)
- [MDN Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
- [MDN SubtleCrypto.digest](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- [MDN URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- [MDN HTMLImageElement.decode](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode)
- [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN PWA caching](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)
- [MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
- [MDN image performance](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Multimedia)
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Open WebUI image-URL security advisory](https://github.com/open-webui/open-webui/security/advisories/GHSA-j6w6-986j-2m2m)
- [Sharp/libvips security advisory](https://github.com/lovell/sharp/security/advisories/GHSA-f88m-g3jw-g9cj)
- [Sharp constructor and resource limits](https://sharp.pixelplumbing.com/api-constructor/)
- [react-zoom-pan-pinch](https://github.com/BetterTyped/react-zoom-pan-pinch)
- [remote-agent](https://github.com/d-kimuson/remote-agent)
- [harness-remote](https://github.com/giuliastro/harness-remote)
- [Claush mobile client manual](https://claush.jp/langs/en/manual/)
- [Claude image/file support](https://support.claude.com/en/articles/8241126-upload-files-to-claude)
- [Claude App Store listing](https://apps.apple.com/us/app/claude/id6473753684)
- [Claude real-device iOS screen corpus](https://techdevnotes.com/apps/ios/claude/6473753684/screenshots)
- [Kimi overview](https://www.kimi.com/help/getting-started/overview)
- [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)
