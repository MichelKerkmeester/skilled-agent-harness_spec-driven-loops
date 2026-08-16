<!-- provenance: external-CLI orchestration pass; original file iter-05-sol.md -->
> **Source pass 5** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-5-sol.md`.

<!-- F6-file-preview | model=sol | lens=react-implementation | iter 5/10 | 2026-08-15T20:04:27.091Z -->

# 1. Findings for the react-implementation lens

## Product pattern to reproduce

Claude’s useful pattern is not merely “render an attachment.” It gives substantial content a dedicated window, preserves the conversation behind it, and groups code view, copy, download, and sharing with the artifact rather than scattering those actions through chat. Claude documents this as a “dedicated window separate from the main conversation,” with code, copy, and download controls in the viewer. [Claude artifact documentation](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)

Kimi’s documented model adds several important details: Preview/Code switching, a file tree, full-screen preview, version selection, download, share, refresh, and an explicit Close control. Those are stronger reference points than a generic lightbox because they treat an artifact as inspectable working output. [Kimi Websites feature overview](https://www.kimi.com/help/websites/websites-overview)

For Pi Remote, the correct abstraction is therefore:

```text
chat attachment card
    → full-screen, history-addressable viewer shell
        → one renderer selected from relay-declared content
        → common close/share/status controls
```

The shell must never turn a path from model output into a new filesystem read. The viewer may consume only inline content or an opaque, revision-scoped resource capability already emitted by the relay. This is the most important security boundary in the implementation.

Open-source remote-agent clients reinforce the need for a first-class file surface:

- OpenCodex links `path:line` references directly into its file browser and code viewer. [mjmkk/opencodex](https://github.com/mjmkk/opencodex)
- MobileCLI exposes a remote file browser/editor alongside agent sessions. [MobileCLI/mobilecli](https://github.com/MobileCLI/mobilecli)
- Claude Code Viewer is an installable mobile PWA designed for private Tailscale access. [d-kimuson/claude-code-viewer](https://github.com/d-kimuson/claude-code-viewer)
- Happy is a mobile/web Codex and Claude Code client with end-to-end encryption. [slopus/happy](https://github.com/slopus/happy)

These establish prior art for mobile file access, but Pi Remote should remain a previewer rather than quietly becoming a general remote file browser.

## Data contract

Use a discriminated, immutable relay envelope. Never accept `path` as sufficient authority to fetch content.

```ts
type ArtifactDescriptor = Readonly<{
  artifactId: string
  revision: string
  displayName: string
  displayPath?: string
  mediaKind: 'image' | 'pdf' | 'text' | 'code' | 'unsupported'
  mimeType: string
  byteLength: number
  language?: string
  dimensions?: { width: number; height: number }
  redaction: {
    state: 'applied' | 'not-needed'
    label?: string
  }
  completeness: 'complete' | 'excerpt'
  content:
    | { kind: 'inline-text'; text: string; firstLine?: number }
    | {
        kind: 'resource'
        capabilityUrl: string
        expiresAt: string
        sha256?: string
        acceptsRanges: boolean
      }
}>
```

Contract requirements:

- `artifactId`, filename, path, MIME type, language, byte count, dimensions, and resource URL are relay-authored fields, not inferred from assistant prose.
- `capabilityUrl` is opaque and scoped to one artifact revision. It must not accept a user-provided filesystem path.
- The resource response uses `Cache-Control: no-store`; OWASP recommends `no-store` for sensitive responses and explicitly warns against placing sensitive content in service-worker caches. [OWASP TLS guidance](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html), [OWASP HTML5 security guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
- The service worker caches the application shell and renderer bundles, never `/artifacts/`, capability URLs, blobs, previews, or thumbnails.
- An excerpt stays an excerpt. The client must not derive an unredacted request from its filename or path.
- Filename and `displayPath` must themselves pass relay redaction; secrets often occur in directory names.
- MIME, extension, and file signature should agree before active rendering. OWASP recommends allowlisting types and not trusting a Content-Type header alone. [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

## React component architecture

Recommended tree:

```text
ArtifactViewerProvider
├── ArtifactCard
└── ArtifactViewerHost
    └── ModalOverlay
        └── Modal
            └── Dialog
                ├── ArtifactHeader
                │   ├── CloseButton
                │   ├── ArtifactIdentity
                │   └── ShareButton
                ├── ArtifactStatus
                ├── Suspense + RendererErrorBoundary
                │   └── ArtifactRenderer
                │       ├── ImagePreview
                │       ├── PdfPreview
                │       ├── TextPreview
                │       ├── CodePreview
                │       └── UnsupportedPreview
                └── ArtifactToolbar
```

Use `ModalOverlay`, `Modal`, `Dialog`, `Button`, `ToggleButton`, `Toolbar`, and `ProgressBar` from `react-aria-components`. React Aria’s modal already hides outside content from assistive technology, contains focus, restores focus, locks background scroll on mobile, and provides entry/exit state attributes. [React Aria Modal](https://react-aria.adobe.com/Modal), [React Aria modal hook behavior](https://react-aria.adobe.com/Modal/useModalOverlay)

Use a controlled provider rather than a separate `DialogTrigger` for every message card. A centralized host allows:

- exactly one viewer at a time;
- URL/history coordination;
- reliable focus restoration after streamed chat changes;
- renderer cancellation on replacement;
- a single blob/object-URL lifecycle;
- consistent share and redaction behavior.

Suggested hooks:

```ts
useArtifactViewerController()
useArtifactResource(descriptor, isOpen)
useArtifactHistory(openArtifact, closeArtifact)
useObjectUrl(blob)
useArtifactShare(descriptor, resource)
useViewerViewport()
useDismissDrag({ scrollElement, zoomScale })
```

`useArtifactResource` must create an `AbortController` for every open operation and abort on close, artifact replacement, revision change, or unmount. Aborting also rejects unread response bodies, so cleanup must cover both `fetch()` and body consumption. [MDN Fetch cancellation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

Declare renderer imports at module scope:

```tsx
const ImagePreview = lazy(() => import('./ImagePreview'))
const PdfPreview = lazy(() => import('./PdfPreview'))
const TextPreview = lazy(() => import('./TextPreview'))
const CodePreview = lazy(() => import('./CodePreview'))
```

React’s `lazy` defers each renderer until first use and caches the resolved module; it must not be declared inside another component because that resets state across renders. [React `lazy`](https://react.dev/reference/react/lazy) React 19 commits the nearest Suspense fallback promptly, which supports opening the shell immediately while a PDF or syntax engine loads. [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

Do not suspend the entire viewer shell. The close button, title, redaction badge, and share status must remain usable if renderer loading fails.

## Renderer choices

### Images

Use a native `<img>` sourced from an object URL created from the exact relay response. Keep the object URL until the viewer closes; revoking it immediately after `load` breaks later save/share interactions. [MDN blob URL lifecycle](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob)

Implementation requirements:

- Allowlist raster formats such as PNG, JPEG, GIF, WebP, and AVIF after MIME/signature agreement.
- Treat SVG as source code by default. SVG can contain namespaces, external-resource references, and active-content attack surface; do not inject it into the app DOM. DOMPurify itself warns that SVG/HTML namespace changes and CSS/resource loading remain context-sensitive risks. [DOMPurify threat model](https://github.com/cure53/DOMPurify/wiki/Security-Goals-%26-Threat-Model)
- Use intrinsic relay dimensions to reserve layout space.
- Fit initially with `object-contain`.
- Support pinch and pan only after zoom exceeds fit scale.
- Provide visible `−`, “Fit”, and `+` buttons as single-pointer equivalents to pinch gestures.
- Avoid adopting `react-zoom-pan-pinch` without device validation; it has had concrete iPhone/Safari simultaneous-touch regressions. [react-zoom-pan-pinch issue 487](https://github.com/BetterTyped/react-zoom-pan-pinch/issues/487)
- The accessible name should be the relay-provided description if one exists; otherwise use “Preview of {safe filename}.” Do not fabricate semantic image descriptions in the client.

### PDFs

Use `pdfjs-dist`, including PDF.js’s viewer layer, text layer, and worker. Do not build a canvas-only PDF renderer: that loses selection, link handling, structural work, and accessibility improvements already maintained by PDF.js. Mozilla describes the viewer layer as the intended starting point for a custom viewer. [PDF.js getting started](https://mozilla.github.io/pdf.js/getting_started/)

Concrete implementation:

- Lazy-load `pdfjs-dist` and its worker only for PDFs.
- Pin the API and worker to the same package version.
- Use a same-origin capability URL so PDF.js can make standard Fetch requests without additional CORS exposure. [PDF.js API](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html)
- If `acceptsRanges` is true, preserve `Accept-Ranges`, `Content-Length`, `ETag`, and `206 Content-Range` behavior. PDF.js can fetch required portions automatically when the server supports byte ranges. [PDF.js FAQ](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions), [MDN range requests](https://devdoc.net/web/developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests.html)
- Render the visible page, one page ahead, and one page behind; release distant canvases. PDF.js warns that a HiDPI letter page can consume about 14 MB and explicitly recommends retaining only visible pages. [PDF.js FAQ](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)
- Cap output scale at `min(devicePixelRatio, 2)` on iPhone, then rerender the current page at increased scale after a settled zoom rather than retaining high-resolution canvases for every page. PDF.js’s official example explains the device-pixel-ratio multiplier. [PDF.js rendering example](https://mozilla.github.io/pdf.js/examples/)
- Set a `canvasMaxAreaInBytes`/pixel budget and catch allocation failures as a recoverable “Page too complex to preview” state. The option exists specifically to constrain image/canvas rendering. [PDF.js API parameters](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html)
- On close call the loading task/document cleanup APIs, cancel render tasks, clear canvas dimensions, terminate observers, and remove references.
- Disable forms, annotation editing, JavaScript, printing, and arbitrary external navigation. Links may be displayed but should require an explicit external-navigation confirmation.
- Target Safari 18 or later if using the current PDF.js legacy build; PDF.js presently lists Safari 18+ as “mostly” supported rather than fully tested. [PDF.js browser support](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)

### Text and code

Render plain text with normal React text nodes:

```tsx
<pre>
  <code>{text}</code>
</pre>
```

Never use `dangerouslySetInnerHTML` for relay file content.

For code, use Shiki’s `codeToTokens` in a dedicated Web Worker and render token arrays as React `<span>` elements. Use `shiki/core`, the JavaScript regex engine, and only the languages actually needed. Shiki recommends fine-grained bundles, a reused highlighter, explicit disposal, and worker offloading for resource-constrained browser environments. [Shiki bundles](https://shiki.matsu.io/guide/bundles), [Shiki performance guidance](https://shiki.matsu.io/guide/best-performance)

Do not import `shiki`, `shiki/bundle/full`, or `shiki/bundle/web` into the initial PWA chunk. The full bundle is documented as 6.4 MB minified; even the web bundle is 3.8 MB before compression. [Shiki bundles](https://shiki.matsu.io/guide/bundles)

Large-file behavior should favor accessibility over invisible virtualization:

- Up to 2,500 lines or 250 KB: render the whole document.
- Beyond that: render relay-supplied chunks with “Load previous 500 lines” and “Load next 500 lines.”
- Keep line numbers in a separate `aria-hidden="true"` gutter.
- Expose the code itself as one logical `<pre><code>` sequence per loaded chunk.
- Do not use row virtualization as the only representation: offscreen lines disappear from the accessibility tree and browser Find. TanStack Virtual is useful for visual virtualization, but its API deliberately renders only virtual items. [TanStack Virtual](https://tanstack.com/virtual/latest/docs/api/virtualizer)
- Provide a Wrap Lines toggle. Prose defaults to wrapping; source code defaults to no wrap but remains user-switchable.

Kimi’s own read tool caps a request at 1,000 lines or 100 KB and marks truncation, providing relevant prior art for bounded remote reads. [Kimi Code file tools](https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/reference/tools.md)

## iOS Safari and installed-PWA pitfalls

- Use `height: 100dvh` with `min-height: 100svh`, not `100vh`. WebKit defines `dvh` as the viewport that changes with browser UI and `svh` as the smallest viewport. [WebKit viewport units](https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/)
- With `viewport-fit=cover`, pad the header and bottom controls using `env(safe-area-inset-*)`; WebKit introduced these variables specifically for notches, rounded corners, and the home indicator. [WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- The viewer must have one internal scroll container; do not let both `body` and the renderer scroll.
- Use `overscroll-behavior: contain` on the content scroller, but do not depend on it as the only pull-to-refresh defense.
- Do not globally apply `touch-action: none`; MDN warns that this can disable browser zoom for low-vision users. Restrict gesture capture to the currently zoomed image surface and provide button equivalents. [MDN `touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action)
- Use `VisualViewport` only to keep controls visible during page zoom or keyboard-driven search. Mobile browsers have separate layout and visual viewports, and pinch zoom changes the latter. [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- Pause PDF prerendering, syntax workers, and decode work on `visibilitychange`. Browsers stop animation frames and throttle timers in hidden pages, while iOS may suspend background tabs completely. [MDN Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [WebKit power guidance](https://webkit.org/blog/8970/how-web-content-can-affect-power-usage/)
- Do not rely on `unload` or `pagehide` for security cleanup; `pagehide` is not reliably fired on mobile. Cleanup must also occur when the viewer closes or the descriptor changes. [MDN `pagehide`](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event)
- In standalone mode there may be no browser Back button. Opening the viewer should push a same-document history entry so the iOS left-edge back gesture closes it. `popstate` is the standard signal for restoring prior SPA state. [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API)
- Do not call `window.close()`; Close means return to the chat state, not close the PWA.
- Installed Home Screen apps with `display: standalone` run as separate web apps, so physical-device testing must cover both Safari-tab and installed modes. [WebKit Home Screen web apps](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)

## Sharing

Use `navigator.share({files})` as the primary iPhone action. Gate it with `navigator.canShare({files})`; PDF, common images, and text are normally shareable, but support must be tested at runtime. The API also requires transient user activation. [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

A critical WebKit pitfall is fetching a large file inside the Share button handler: transient activation can expire before the fetch completes. WebKit documents this exact class of failure. [WebKit User Activation API](https://webkit.org/blog/13862/the-user-activation-api/)

Therefore:

- If the complete blob is already resident, Share invokes `navigator.share()` immediately.
- If it is not resident, the first press becomes “Prepare to share,” downloads the exact previewable resource, and announces completion. A second explicit press opens the native share sheet.
- For excerpts, label the action “Share preview,” generate `{basename}.redacted-preview.txt`, and include an excerpt notice in the content.
- If file sharing is unavailable, text/code falls back to Copy; binary content falls back to a user-initiated download.
- A share cancellation is not an error.
- Never refetch a different revision for sharing.

# 2. Concrete spec contribution a build phase can execute

## Viewer state machine

| State | Visible result | Allowed actions |
|---|---|---|
| `closed` | Chat card only | Open |
| `opening` | Full-screen shell and title; content skeleton | Close |
| `loading` | Determinate progress when byte count is known; otherwise “Loading preview” | Close |
| `ready` | Renderer and toolbar | Close, Share, renderer controls |
| `excerpt` | Renderer plus persistent “Redacted excerpt” banner and line/byte range | Close, Share preview |
| `offline-loaded` | Already loaded content plus “Offline — showing loaded revision” | Close, Share if complete |
| `offline-empty` | “Preview unavailable while offline” | Close, Retry |
| `expired` | “This preview has expired” | Close; no path-based recovery |
| `revision-conflict` | Expected and received revisions shown as safe opaque labels | Close |
| `unsupported` | File icon, safe metadata, explanation | Close, Share if complete |
| `blocked` | “Preview blocked because file type could not be verified” | Close |
| `error` | Short error plus Retry | Close, Retry |

Transitions must be keyed by `(artifactId, revision)`. A late response for a previously opened artifact must be discarded even if its request was not successfully aborted.

## Open, close, and history behavior

1. `ArtifactCard` is a React Aria `Button`, not a clickable `<div>`.
2. A press immediately:

   - records the trigger element and chat scroll position;
   - pushes a viewer history entry;
   - opens the shell;
   - focuses the viewer heading;
   - begins resource loading.

3. Close button, Escape, successful downward-dismiss gesture, and history Back all enter one idempotent close path.
4. Closing:

   - aborts network and renderer tasks;
   - releases PDF canvases, workers, and object URLs;
   - removes the viewer history entry without adding another;
   - restores chat scroll;
   - restores focus to the card, or to the nearest surviving message container if streaming removed it.

React Aria provides the modal focus containment and restoration baseline; WAI-ARIA additionally requires an internal focus target, trapped Tab sequence, Escape dismissal, visible close control, and return focus. [WAI-ARIA modal dialog pattern](https://w3c.github.io/wai-website/ARIA/apg/patterns/dialog-modal/)

## Header

- Height: 52 CSS px plus top safe-area inset.
- Leading: 44×44 Close button with `aria-label="Close preview"`.
- Center: basename, one line, middle truncation where feasible; optional safe relative path below.
- Trailing: 44×44 Share/Prepare Share button.
- Redaction badge appears beside the filename, never only inside scrollable content.
- Header remains visible while content scrolls.
- Use carbon text; clay is an accent and pressed/selected indicator, not small body text.
- Focus indication uses a carbon outline plus clay offset/accent so it does not depend on clay text contrast alone.

## Renderer toolbar

Use React Aria `Toolbar aria-label="Preview controls"`; it supplies toolbar semantics and arrow-key navigation. [React Aria Toolbar](https://react-aria.adobe.com/Toolbar)

Content-specific controls:

- Image: Zoom out, Fit, Zoom in.
- PDF: Previous page, page indicator, Next page, Zoom out, Fit width, Zoom in.
- Text/code: Wrap lines; code additionally offers Copy visible content.
- Unsupported: no empty toolbar.

Every control has a minimum 44×44 CSS px hit area. Claude’s own mobile design guidance specifies 44×44-point touch targets, while WCAG 2.2 requires at least 24×24 CSS px or sufficient spacing. [Claude mobile design guidelines](https://claude.com/docs/connectors/building/mcp-apps/design-guidelines), [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)

## Gestures

- Tap attachment card: open.
- iOS left-edge swipe: history Back, therefore close.
- Downward drag: available only from the header/drag region, or from content when the content scroller is at zero and zoom is exactly 1.
- Dismiss threshold: at least 72 CSS px displacement or a clearly downward release velocity; otherwise spring back.
- While dragging, translate the shell downward and reduce opacity slightly; never scale text.
- Pinch image/PDF: zoom around gesture centroid.
- One-finger pan: enabled only when zoomed beyond fit.
- Double tap image: fit ↔ 2×, but the toolbar remains the accessible equivalent.
- No horizontal swipe for file switching in the first release; it conflicts with code scrolling and iOS back navigation.
- VoiceOver or reduced-motion mode disables drag-to-dismiss animation but retains Close and Back.

## Accessibility

- `Dialog` has `aria-labelledby` pointing to the visible filename heading.
- Do not put the whole document in `aria-describedby`; WAI-ARIA advises omitting it for long, structured dialog content. [WAI-ARIA modal dialog pattern](https://w3c.github.io/wai-website/ARIA/apg/patterns/dialog-modal/)
- Initial focus goes to the heading with `tabIndex={-1}`, not Share. This prevents a large document from opening scrolled away from its start.
- Loading messages use `role="status"`; terminal failures use `role="alert"`.
- Canvas layers are hidden from assistive technology when an equivalent PDF.js text/structure layer exists.
- Page changes announce “Page N of M” once, without announcing every rendered canvas.
- Line numbers are `aria-hidden`.
- At 320 CSS px width, prose must reflow without two-dimensional scrolling. Code and zoomed media may scroll horizontally because their spatial presentation can require it, but Wrap/Fit controls must remain available. [WCAG Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)
- At 200% text size, filename, status banner, and toolbar labels must not overlap or become unreachable.
- Test with VoiceOver rotor navigation for Headings, Buttons, and Links.

## Visual and motion specification

Use the fixed parchment tokens through Tailwind 4 theme variables rather than duplicating hex values inside components. Tailwind 4 exposes theme values as CSS variables and supports data-attribute-driven styling appropriate for React Aria’s `data-pressed`, `data-focus-visible`, `data-entering`, and `data-exiting` states. [Tailwind 4 theme variables](https://tailwindcss.com/docs/theme), [React Aria styling model](https://react-aria.adobe.com/getting-started)

- Shell: bone background in light mode; established dark parchment token in dark mode.
- Text/prose: Source Serif 4.
- UI labels, metadata, controls: Inter.
- Code: existing project monospace token or `ui-monospace`; do not substitute Inter.
- PDF canvas surround: slightly darker parchment field so white pages remain legible in both themes.
- Cards and banners: 1 px carbon-alpha border; no glass blur.
- Entry: 180–220 ms opacity plus `translateY(10px → 0)`.
- Exit: 140–180 ms reverse.
- Drag cancellation: spring-like transform limited to the shell, not content.
- `motion-reduce`: no transform, at most a short opacity transition. Tailwind exposes `motion-safe` and `motion-reduce` variants for this. [Tailwind animation accessibility](https://tailwindcss.com/docs/animation)
- Use Tailwind’s mobile-first and container-query utilities so the renderer responds to its actual width rather than assuming one iPhone breakpoint. [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design)

## Acceptance checks

### Functional

- Each supported MIME opens the correct renderer.
- Malformed or mismatched MIME/signature enters `blocked`.
- Closing during fetch produces no late content flash or state update.
- Opening artifact B while A loads can never render A in B’s shell.
- Back gesture and browser Back close the viewer before leaving the session.
- Focus and chat scroll return to their pre-open positions.
- Share sends the same revision and bytes shown in the preview.
- An excerpt can only be shared as a clearly named preview.
- No network request contains a filesystem path derived from message text.
- PDF range responses return valid `206`, `Content-Range`, revision-consistent `ETag`, and `no-store`.
- The service-worker cache contains no artifact URLs or response bodies.

### Accessibility

- Automated axe scan: zero critical/serious violations in every state.
- Keyboard: Tab stays inside; Escape closes; Toolbar arrow keys work.
- VoiceOver: filename announced once; controls have unique names; page changes and errors announced once.
- 320 CSS px and 400% desktop-equivalent zoom: controls remain reachable.
- Reduced Motion: no slide, scale, or spring animations.
- Dark/light: text, focus, border, status, and disabled states meet WCAG AA.

### Physical iPhone matrix

Test both Safari and installed PWA, portrait and landscape, with:

- current iOS and the chosen minimum iOS;
- Dynamic Type/text zoom;
- VoiceOver;
- Reduce Motion;
- Increase Contrast;
- light/dark appearance;
- loss of Tailscale connectivity mid-download;
- backgrounding and returning during PDF rendering;
- 100-page PDF;
- high-resolution image;
- 10,000-line code excerpt;
- share success, cancellation, and unsupported file type.

### Performance and cleanup

- Viewer chrome appears in the next committed frame; renderer loading never blocks Close.
- PDF keeps at most three page canvases live.
- Syntax highlighting runs off the main thread.
- Scrolling produces no repeated synchronous tokenization.
- Closing leaves no active fetch, PDF render task, observer, worker owned only by the viewer, or object URL.
- Repeatedly opening and closing the same large PDF does not produce monotonically increasing live canvas or blob counts.

# 3. Divergent / minority ideas worth considering

## Reader mode as a peer to visual preview

PDF and code previews could offer a “Reader” tab that presents relay-supplied extracted text as a linear document. This is not merely an accessibility fallback: it can outperform page canvases on an iPhone, work at large text sizes, and preserve search. It must use only extraction already produced by the relay; the client must not run OCR or fetch another representation.

## Separate “inspect” and “export” capabilities

Sharing could be disabled by default even when preview is allowed. Preview and export are materially different disclosure actions: preview keeps data inside Pi Remote, while sharing intentionally copies it to another application. A relay capability such as `mayExport` would make that distinction explicit without turning Share into a remote mutation.

## Deliberately omit swipe-to-dismiss

A minority but defensible approach is to ship only Close, Escape, and history Back. Web swipe recognizers routinely collide with PDF scrolling, code horizontal scroll, browser zoom, Touch Accommodations, and the iOS back gesture. Apple expects an obvious dismissal control and often a swipe, but does not require a custom web implementation. [Apple modality guidance](https://developer.apple.com/design/human-interface-guidelines/modality)

## Quick Look handoff for office formats

Claude Mobile currently opens generated documents in the system preview or another app rather than forcing every office format into its own renderer. [Claude file creation documentation](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude) Pi Remote could follow that model for DOCX/XLSX/PPTX while keeping image, PDF, text, and code inline. This avoids importing low-fidelity office-document renderers into a security-sensitive PWA.

## Stable, expiring deep links

A route such as `/session/{opaqueSession}/artifact/{artifactId}?rev={revision}` could reopen the viewer after a PWA process restart. The route contains only opaque IDs; the content capability remains short-lived and must be reacquired from authorized session state. This gives installed-PWA navigation parity without placing a host path or token in history.

## No syntax color for very large files

For oversized code, immediate unhighlighted carbon-on-parchment text may be preferable to delayed or partial coloring. Highlight only the viewport-adjacent chunks after first paint, and retain a “Plain” toggle. This is closer to a dependable remote instrument than a miniature IDE.

# 4. Open questions + risks

- Does the relay already emit complete binary artifact resources, or only filenames and diff snippets? If only paths are available, the feature is blocked until a relay-authored preview resource exists; the PWA must not invent an arbitrary read API.
- What is the minimum supported iOS version? Current PDF.js documentation only promises “mostly” supported Safari 18+ for its legacy build.
- Does “Share” mean exporting sensitive relay content to any installed application? If that boundary is not intentional, the build needs a separate `mayExport` capability or Share must be omitted.
- Can filenames and relative paths be displayed after redaction, or should the UI show only a generic relay label?
- Are artifact capabilities reusable for PDF range requests? A strictly one-use URL is incompatible with PDF.js’s multi-range loading; a revision-scoped, expiring read capability is needed instead.
- Should PDF hyperlinks be inert, confirmed, or allowed? Opening them can leak user intent, document context, and network metadata outside the tailnet.
- Are password-protected, signed, XFA, or form-heavy PDFs in scope? PDF.js and Safari have historically had defects around complex forms; the correct fallback may be Share/Open in system preview. [PDF.js Safari form issue](https://github.com/mozilla/pdf.js/issues/13726)
- Should animated GIFs animate automatically? Reduce Motion suggests rendering the first frame or requiring an explicit Play action.
- Should text search operate only over currently supplied chunks or request more content? Requesting more must remain relay-authorized and redaction-preserving.
- A PWA cannot reliably obscure its last frame before iOS creates an app-switcher snapshot. `visibilitychange` can reduce exposure but is not a native secure-screen guarantee.
- `Cache-Control: no-store` prevents normal HTTP caching but does not erase already shared files, screenshots, clipboard contents, or another app’s storage.
- A custom downward-dismiss gesture remains a substantial iOS QA risk because it competes with scrolling, zoom, pull-to-refresh, VoiceOver, and Touch Accommodations.
- Relevant Claude/Kimi Mobbin screen IDs could not be verified from the accessible public catalog in this pass. The build should obtain authenticated Mobbin links or captured flow IDs before claiming pixel-level parity; official Claude and Kimi behavior documentation was used instead.

# 5. Sources

- [Claude: What are artifacts and how do I use them?](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Claude: Create and edit files](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude)
- [Claude mobile/MCP app design guidelines](https://claude.com/docs/connectors/building/mcp-apps/design-guidelines)
- [Kimi Websites feature overview](https://www.kimi.com/help/websites/websites-overview)
- [Kimi Code file tools](https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/reference/tools.md)
- [Mobbin iOS catalog](https://mobbin.com/browse/ios/apps)
- [Mobbin search/API documentation](https://docs.mobbin.com/api/quickstart)
- [React Aria Modal](https://react-aria.adobe.com/Modal)
- [React Aria `useModalOverlay`](https://react-aria.adobe.com/Modal/useModalOverlay)
- [React Aria Toolbar](https://react-aria.adobe.com/Toolbar)
- [React Aria Button](https://react-aria.adobe.com/Button/useButton.html)
- [React `lazy`](https://react.dev/reference/react/lazy)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Tailwind CSS 4 theme variables](https://tailwindcss.com/docs/theme)
- [Tailwind responsive design and container queries](https://tailwindcss.com/docs/responsive-design)
- [Tailwind reduced-motion variants](https://tailwindcss.com/docs/animation)
- [Apple HIG: Modality](https://developer.apple.com/design/human-interface-guidelines/modality)
- [Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [WebKit dynamic viewport units](https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/)
- [WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WebKit Home Screen web apps](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [WebKit User Activation API](https://webkit.org/blog/13862/the-user-activation-api/)
- [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [MDN `touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action)
- [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [MDN blob URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob)
- [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API)
- [MDN Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [PDF.js repository](https://github.com/mozilla/pdf.js)
- [PDF.js getting started](https://mozilla.github.io/pdf.js/getting_started/)
- [PDF.js examples](https://mozilla.github.io/pdf.js/examples/)
- [PDF.js API](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html)
- [PDF.js FAQ and browser support](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)
- [Shiki fine-grained bundles](https://shiki.matsu.io/guide/bundles)
- [Shiki performance guidance](https://shiki.matsu.io/guide/best-performance)
- [TanStack Virtual](https://github.com/TanStack/virtual)
- [DOMPurify security goals and threat model](https://github.com/cure53/DOMPurify/wiki/Security-Goals-%26-Threat-Model)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
- [WAI-ARIA modal dialog pattern](https://w3c.github.io/wai-website/ARIA/apg/patterns/dialog-modal/)
- [WCAG Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)
- [WCAG 2.2 target-size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [OpenCodex](https://github.com/mjmkk/opencodex)
- [MobileCLI](https://github.com/MobileCLI/mobilecli)
- [Claude Code Viewer](https://github.com/d-kimuson/claude-code-viewer)
- [Happy mobile/web client](https://github.com/slopus/happy)
