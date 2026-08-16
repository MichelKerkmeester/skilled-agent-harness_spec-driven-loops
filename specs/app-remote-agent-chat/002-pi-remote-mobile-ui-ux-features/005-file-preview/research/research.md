> **Deep research — external-CLI multi-executor run.** 10 independent iterations (5 × GPT 5.6 SOL high (--search, cli-codex), 5 × Grok 4.6 xhigh (cli-cursor)), no early convergence. Synthesis of all passes into one build-ready decision.
> **Provenance:** produced by external-CLI orchestration, NOT the `/deep:research` state-machine runtime — so runtime state artifacts (`deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, observability, deltas, lineages) are intentionally absent. See `PROVENANCE.md`.
> **Canonical:** this file (`research.md`) is the synthesized output; per-pass findings live in `iterations/iteration-NNN.md`.

---

# F6-file-preview — Synthesis

## 1. Decision

Build a Claude-style, in-thread file card that opens a history-backed, full-screen, read-only viewer with one shell and specialized image, PDF, text, code, and diff renderers. The viewer displays immutable, relay-issued snapshots identified by opaque artifact ID, revision, and digest; it never turns model text or a displayed path into a host filesystem read. Use a full-screen React Aria modal for every file type on iPhone, with explicit Close, browser/iOS edge-back, Escape, and VoiceOver dismissal—no custom swipe-down in the first release because it conflicts with scrolling, selection, PDF interaction, and image pan/zoom. This combines Claude’s card-to-artifact continuity with Kimi’s explicit file type and revision identity while preserving Pi Remote’s stricter security boundary (iter-01, iter-05, iter-07, iter-09, iter-10).

## 2. Build spec

### Delivery slices

1. **Foundation:** promote the existing redacted `file_diff` block into an openable card and full-screen diff viewer. This can ship without pretending that Pi Remote already has complete files.
2. **File snapshots:** add a relay-projected `file_preview` block and immutable sanitized artifact store. Enable text, code, raster image, and PDF only when that contract is available.
3. **Deferred:** office rendering, session-wide gallery, revision comparison, interactive HTML/SVG, editing, restoring, staging, and “open on host.”

The feature is incomplete—not merely unavailable—if the client infers a path from a diff or tool result and fetches the live workspace.

### Relay contract

```ts
type FilePreviewBlock = Readonly<{
  kind: "file_preview"
  artifactId: string
  revision: string
  displayName: string
  renderer: "image" | "pdf" | "text" | "code" | "diff" | "unsupported"
  mimeType: string
  byteLength: number | null
  digest: string
  language?: string
  pageCount?: number
  altText?: string
  redaction: "not-needed" | "applied" | "withheld"
  completeness: "complete" | "excerpt"
  shareAllowed: boolean
  textLayerSafe?: boolean
  thumbnailRef?: string
  content:
    | { kind: "inline-text"; text: string; firstLine?: number }
    | { kind: "artifact-ref" }
    | { kind: "none" }
}>
```

Contract invariants:

- `artifactId`, `revision`, `displayName`, MIME, renderer, size, language, thumbnail, and content are relay-authored—not inferred from assistant prose, extensions, or diff headers.
- `displayName` is a redacted basename or a generic label such as `File change`; it never contains an absolute host path.
- An artifact resource is a stored, sanitized snapshot. Fetching it never touches the current workspace.
- The browser requests an exact opaque tuple: session, artifact ID, revision. The relay verifies that the descriptor belongs to the authenticated session and returns a strong ETag matching `digest`.
- A PDF range response must carry the same revision and ETag as every other range. A mismatch destroys the document and enters `revision-conflict`.
- Artifact responses use `Cache-Control: private, no-store, max-age=0`, `X-Content-Type-Options: nosniff`, and `Cross-Origin-Resource-Policy: same-origin`. Artifact routes are network-only and excluded from the service worker.
- No access token, ticket, path, filename, or digest appears in a shareable URL. The endpoint uses the existing authenticated session, Origin, and principal checks.
- This read route does not require a mutation ticket. It cannot invoke a tool or write state.

### Component architecture

```text
ArtifactViewerProvider
├── ArtifactCard
└── ArtifactViewerHost
    └── ModalOverlay
        └── Modal
            └── Dialog
                ├── ArtifactHeader
                ├── ArtifactStatus
                ├── RendererErrorBoundary
                │   └── Suspense
                │       └── ArtifactRenderer
                │           ├── ImagePreview
                │           ├── PdfPreview
                │           ├── TextPreview
                │           ├── CodePreview
                │           ├── DiffPreview
                │           └── UnsupportedPreview
                └── PreviewControls
```

Implementation responsibilities:

- `ArtifactViewerProvider`: owns the single active viewer, history state, originating trigger, frozen revision, scroll restoration, and resource cleanup. Mount it outside the virtualized transcript.
- `ArtifactCard`: a React Aria `Button` activated through `onPress`, not `pointerdown` or a clickable generic element.
- `useArtifactResource`: owns an `AbortController`, request generation, revision/ETag checks, body validation, digest verification, and object URLs.
- `useArtifactHistory`: pushes `/session/:sessionId/file/:artifactId?rev=<opaque-revision>` and closes the viewer on `popstate`.
- `useArtifactShare`: prepares and shares only the current sanitized revision.
- Renderers are lazy-loaded at module scope. Viewer chrome must never suspend with the renderer.

Every async commit must match the active generation, artifact ID, and revision. Abort is cleanup; the generation check is the correctness boundary.

### In-thread card

- Full assistant-column width; do not auto-open.
- Minimum height: 68px. Diff cards may expand to a maximum 160px inline peek.
- Padding: 12px; radius: 16px; one-pixel `--line` border; `--surface` fill; no Material-style elevation.
- Leading or trailing preview: 44×44px.
  - Sanitized image thumbnail when supplied by the relay.
  - PDF first-page thumbnail only when supplied.
  - Otherwise a flat type glyph.
- Filename: Inter, 15px/20px, semibold, one line, middle-truncated where supported.
- Metadata: Inter, 12px/16px, for example `TypeScript · 18 KB · rev 7` or `PDF · 12 pages · Redacted`.
- Diff variant: show the first six safe lines using noninteractive span rows; retain `+`/`−` prefixes and add/remove tints.
- The whole card is one button. Do not nest Share, More, or another button inside it.
- Accessible name: `Open package-lock.json, JSON code, revision 18, partially redacted.`
- Press feedback: background/border change and `scale(.985)` for 90–120ms; activation occurs on release and cancels when the pointer leaves.
- Do not add custom long-press behavior in the first release. Hidden menus add little value and conflict with native selection/context behavior.

### Viewer presentation and history

Use controlled `ModalOverlay`, `Modal`, and `Dialog` from `react-aria-components`.

- Full-screen for all renderers; no detents, grabber, backdrop dismissal, or split pane on iPhone.
- Add `viewport-fit=cover`; never disable browser scaling.
- Height: React Aria’s `--visual-viewport-height`, falling back to `100dvh` and `100svh`.
- Blur the composer before opening so a keyboard-reduced viewport is not captured.
- Header height: 56px plus the top safe-area inset. Apply tested standalone fallback spacing when WebKit incorrectly reports a zero inset.
- Bottom controls use `max(12px, env(safe-area-inset-bottom))`.
- Opening pushes one child history entry. The iOS edge-back gesture and browser Back therefore return to the session, not the inbox.
- Close-button/Escape requests play the 180ms exit, then call `history.back()`. A `popstate` initiated by the browser gesture skips the competing JavaScript slide and unmounts directly.
- Preserve the exact chat scroll offset. Restore focus to the originating card; if virtualization removed it, focus the containing message, then the transcript region.
- A direct/reloaded viewer URL may restore only non-secret metadata until the authenticated exact revision is reacquired.

### Viewer header

- Visible title: safe filename, Inter 16px/22px, semibold.
- Subtitle: type, revision, and redaction/truncation state; Inter 12px/16px.
- Leading: 44×44 Close button, `aria-label="Close preview"`.
- Trailing: 44×44 Share button only when `shareAllowed` and the platform can perform the applicable share.
- Copy belongs in an overflow menu only when useful for text/code/diff. Do not show an empty overflow control.
- At 200% text enlargement, switch to a two-row header: actions remain on the first row; title and metadata occupy the second.
- No blur or glass. The header remains opaque and sticky.

### Content states

Lifecycle and content state are separate so modifiers such as redaction, staleness, or offline status do not duplicate every renderer state.

| State | Presentation | Available actions |
|---|---|---|
| `closed` | Transcript card | Open |
| `opening` | Full-screen shell and title immediately | Close |
| `loading` | Renderer-shaped static placeholder; polite `Opening…` status | Close |
| `loading-stalled` | After 15 seconds without headers or new bytes: `Still waiting for the Pi relay.` | Cancel, Retry |
| `ready` | Frozen renderer snapshot | Renderer controls, permitted Share/Copy, Close |
| `empty` | `This file is empty — 0 bytes.` | Share if permitted, Close |
| `whitespace-only` | Render whitespace; quiet explanatory banner | Show invisibles, Close |
| `partial-redaction` | Persistent `Some content was removed by the relay.` badge | Share sanitized copy if permitted, Close |
| `withheld` | `Preview withheld by relay policy.` No payload or sensitive metadata | Close |
| `truncated` | Sticky `Preview ends here. The relay supplied an excerpt.` banner | Share preview if permitted, Close |
| `stale` | Current revision remains untouched; `A newer revision is available.` | View latest, Dismiss banner, Close |
| `offline-loaded` | Keep the in-memory snapshot with `Offline copy` badge | Close; Share only if already prepared and policy allows |
| `offline-unavailable` | `This preview isn’t available while the relay is unreachable.` | Retry, Close |
| `denied` | `Preview not permitted for this session.` | Close |
| `expired` | `This preview has expired.` Purge existing content | Close |
| `missing` | `This revision is no longer available.` | View latest only when explicitly offered, Close |
| `revision-conflict` | `This file changed since it was referenced.` | View latest, Close |
| `unsupported` | Safe filename/type/size and `Preview isn’t available for this file type.` | Share safe bytes if permitted, Close |
| `too-large` | `This file is too large to preview safely on this iPhone.` | Share only within export budget, Close |
| `corrupt` | `This file couldn’t be rendered.` | Retry once, Close |
| `rate-limited` | Countdown based on `Retry-After` | Retry when enabled, Close |
| `relay-error` | Redacted diagnostic code, no server text | Retry, Close |
| `revoked` | Remove text, canvases, blobs, and object URLs immediately | Close |
| `aborted` | No error UI; normal result of close/replacement | — |
| `exiting` | Interaction disabled during exit | — |

Do not derive “offline” from `navigator.onLine` alone. Use the artifact request plus relay heartbeat.

### Revision behavior

Opening freezes `{artifactId, revision, digest, payload}`. Streaming or later agent changes never replace an open document, move selection, alter scroll position, or change what Share exports.

When a newer revision appears:

1. Show a nonblocking stale banner.
2. `View latest` requests the explicitly named revision.
3. Keep the old snapshot visible until the new response passes authorization, revision, MIME, size, and digest validation.
4. Swap only after a valid first render, then reset to the start/fit position and announce the new revision once.

### Renderer specifications

| Renderer | Build requirements | Controls and interaction | Failure limits |
|---|---|---|---|
| **Image** | Native `<img>` from a sanitized in-memory blob; `object-fit: contain`; no upscaling above intrinsic size until requested; carbon stage in both themes | Pinch 1×–4×; double-tap fit/2× around tap; pan only above fit; visible Zoom out/Fit/Zoom in buttons | Reject above 25MiB compressed, 40MP, or 8,192px on either side; decode failure becomes `corrupt` |
| **PDF** | Lazy `pdfjs-dist`; raw sanitized bytes/consistent range source; JavaScript, forms, editing, attachments, printing, and external navigation disabled; render visible page plus adjacent pages; DPR capped at 2 | Continuous vertical pages; page indicator; Previous/Next; Zoom out/Fit width/Zoom in; text selection/search only when `textLayerSafe` | 50MiB/500-page default cap; require ranges above 25MiB; retain at most three page canvases; 12MP maximum canvas |
| **Text** | Real DOM text; Source Serif 4, 17px/27px; 18px inline padding; wrap and reflow | Native selection, `Command+F`, Copy received content | Full DOM to 250KB/2,500 lines; explicit 500-line chunks above that; hard cap 2MiB/20,000 lines |
| **Markdown** | Parse to a strict React AST; no raw HTML, remote images, embedded frames, or executable links | Semantic headings/lists/tables; native selection; source view optional | Invalid markup falls back to plain text |
| **Code** | `<pre><code>` with a separate `aria-hidden` line-number gutter; plain first paint; lazy fine-grained highlighter in a worker | Wrap off by default; horizontal pan; visible Wrap and Find; native selection; Copy all received content | Same text caps; unknown language becomes plain text; highlighting failure never blocks reading |
| **Diff** | Reuse add/remove/context semantics on parchment; prefixes remain visible; never reconstruct the complete file | Wrap off by default; Wrap/Find/Copy controls | Display exactly the received patch |
| **Unsupported** | Metadata-only state | Share exact sanitized bytes when permitted | No “try original,” browser navigation, or host handoff |

Additional renderer rules:

- HTML, active SVG, XML, JavaScript, and WASM never execute. Redacted HTML/SVG may be shown as source code; otherwise mark unsupported.
- Raster images must be decoded and re-encoded by the relay to remove metadata and embedded profiles. SVG is never treated as a raster image.
- PDF bytes must be destructively sanitized before publication. If the relay cannot assert a safe text layer, render page canvases without creating selectable/searchable text.
- External Markdown and PDF links are inert in the first release.
- Line numbers are excluded from selection and copying.
- Large text/code uses explicit chunks rather than visual-only row virtualization, preserving a coherent accessibility tree.

### Gestures and keyboard

#### Shared gestures

- Tap/release on card: open.
- Close button: close.
- iOS left-edge swipe or browser Back: close through history.
- VoiceOver two-finger scrub and hardware `Escape`: close.
- No custom swipe-down, backdrop-tap dismissal, horizontal artifact swipe, or chat/file pane swipe in the first release.
- Content always owns scrolling, panning, zooming, and selection.
- All gesture-only functions have visible, 44×44 single-pointer alternatives.

#### Touch behavior

- Image stage alone may use `touch-action: none` while custom zoom is active.
- PDF/text/code scrollers use native pan behavior; never set `touch-action: none` on the viewer or application root.
- Text/code long-press and double-tap remain native selection.
- Horizontal movement in code/diff never changes artifact or dismisses the viewer.
- Browser page zoom remains enabled.

#### Keyboard behavior

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Remain inside the modal |
| `Escape` | Close an open menu first, then the viewer |
| `Command/Ctrl+F` | Open in-view search for text, code, and safe PDFs |
| `Command/Ctrl+C` | Native copy of the current selection |
| `+` / `=` | Zoom in when a zoomable renderer has focus |
| `-` | Zoom out |
| `0` | Fit/reset |
| `Page Up` / `Page Down` | PDF page movement or native document paging |
| `Home` / `End` | Start/end of text, code, or PDF |
| Arrow keys | Native scrolling/selection; roving focus only inside a focused toolbar |

Do not bind Space to Close or Left/Right to artifact paging.

### Accessibility and internationalization

- The dialog’s visible filename heading is its accessible name. Do not put the complete document in `aria-describedby`.
- Programmatically focus the visible heading on open. Place it first in logical DOM order; the first Tab then reaches Close, followed by Share, status actions, renderer controls, and content.
- Background chat is inert and hidden from the accessibility tree.
- The renderer is a labelled document/region, not an enormous `aria-label`.
- Text and Markdown use real semantic structure.
- Code is read once in logical order; decorative token spans and line numbers are ignored by assistive technology.
- Images use relay-supplied trusted alternative text. Otherwise announce `Image preview; description not provided.` A filename is not a semantic image description.
- PDF pages are labelled `Page N of M`. Unsafe or scanned pages announce that accessible text is unavailable.
- Loading, page changes, copying, and revision availability use one throttled `role="status"` region. Denial, revocation, and terminal corruption use one nonrepeating alert.
- All controls and cards have 44×44px minimum hit regions.
- Body text and essential metadata meet 4.5:1 contrast; controls, focus, and meaningful boundaries meet 3:1.
- Clay `#d97757` on bone is not sufficient as normal text or as the sole focus/status signal. Use a carbon/bone outline plus a clay halo, and text/icon/pattern in addition to color.
- Use `rem`, logical CSS properties, and responsive two-row chrome. Test at 200% text enlargement and 320 CSS-pixel width.
- Wrap the app in `I18nProvider`; set `lang` and `dir`; use `Intl` for size and page-count messages.
- Isolate filenames with `<bdi>`. Code, hashes, MIME types, and paths remain LTR inside an RTL shell.
- Main content never auto-hides; image chrome auto-hide is deferred.

### Visual system

- Continue the locked tokens: bone `#f8f8f6`, carbon ink, clay `#d97757`, Inter, and Source Serif 4.
- Card and chrome: parchment surfaces, carbon text, restrained hairlines, no glass blur.
- Text/Markdown: uninterrupted parchment page.
- Code: warm carbon “ink well” with AA-verified token colors; plain bone-on-carbon is the fallback.
- Diff: parchment with existing semantic add/remove tints and visible `+`/`−` prefixes.
- Image: carbon stage in both themes.
- PDF: original page colors on a quiet parchment/dark surround.
- Dark mode uses existing tokens; do not invert content or introduce a separate neon code theme.
- Clay marks active controls, progress, or a secondary focus halo. It is not body copy, a divider, or the sole error/redaction treatment.

### Motion

- Card press: 90–120ms.
- Viewer entry: overlay opacity plus `translateY(8px → 0)`, 220ms, `cubic-bezier(0.22, 1, 0.36, 1)`.
- Viewer exit: 180ms reverse.
- Valid file-to-file/revision replacement: 100ms opacity crossfade after the new renderer has a valid first frame.
- Button press: `scale(.98)`, 120ms.
- Image zoom snap: 220ms.
- No springs, overshoot, parallax, shimmer, animated blur, repeated loading pulse, or streaming-layout animation.
- Under `prefers-reduced-motion: reduce`: remove translation, scale, spring, and animated zoom; use an opacity-only transition of at most 100ms or an instant swap.
- A browser-initiated `popstate` owns its navigation animation; do not overlay a second close animation.

### Share and copy

- Share is a disclosure capability distinct from preview. The relay supplies `shareAllowed`; visibility does not imply export authority.
- Share exports only the currently displayed revision and sanitized bytes.
- Text/code/diff: call `navigator.share({ title, text })` directly from the press event.
- Image/PDF: prepare `File` bytes before enabling Share and require `navigator.canShare({ files })`.
- If bytes are not complete, the first action is `Prepare to share`; after exact-revision validation, a second explicit press invokes the share sheet.
- Partially redacted or truncated files require a confirmation: `Share the sanitized preview shown here? Removed content is not included.`
- `AbortError` is a normal cancellation and produces no error.
- Do not mint public artifact URLs or include session URLs, tickets, host paths, headers, or revision tokens.
- Text fallback is Copy. Binary content has no standalone download fallback that could navigate the PWA away from its session.

### Objective acceptance gates

The build passes only when:

- Every card opens a deterministic renderer, withheld, unsupported, too-large, or error state—never a dead surface.
- Opening artifact B while A is delayed can never render A under B’s title.
- Opening revision 7 and receiving revision 8 leaves revision 7 unchanged until `View latest`.
- Closing during fetch, stream, image decode, PDF render, highlighting, or share preparation produces no late state update or leaked object URL.
- Close, browser Back, iOS edge-back, Escape, and VoiceOver scrub all return to the same session and restore scroll/focus.
- No request contains a host path or a resource derived from message text.
- Artifact URLs and bodies never appear in Cache Storage, local storage, IndexedDB, or persisted transcript DTOs.
- Shared bytes hash to the displayed artifact digest.
- A redaction fixture’s marker is absent from DOM text, accessibility snapshots, clipboard, share file, thumbnail, logs, and caches.
- An unsafe PDF creates no text layer; a safe tagged PDF exposes page labels and logical text.
- Native selection works in text, code, diff, and safe PDF layers.
- Every multipoint or drag gesture has an onscreen alternative.
- Light/dark, 200% text, RTL, VoiceOver, Reduce Motion, portrait/landscape, Safari, and installed-PWA tests pass on the oldest supported iPhone.
- Repeatedly opening and closing a large PDF does not monotonically increase live canvases, workers, buffers, or blob URLs.

## 3. Consensus vs divergence

### Consensus

All passes converged on these decisions:

- **Card first, viewer second:** files remain compact transcript objects until the operator deliberately opens them (iter-01, iter-02, iter-06, iter-08, iter-09).
- **No auto-open:** agent sessions can emit many files; unsolicited takeover would make supervision unusable (iter-01, iter-09).
- **Full-screen on iPhone:** desktop side panes and code editors do not translate to a 390px viewport (iter-01, iter-02, iter-05, iter-06, iter-10).
- **One shell, typed renderers:** cards and toolbar behavior stay consistent while image, PDF, text, code, and diff retain appropriate interaction models.
- **Immutable revision identity:** the viewer must show and share the exact revision referenced by the transcript, never silently “latest” (iter-01, iter-02, iter-04, iter-05, iter-10).
- **Relay-authorized data only:** no live filesystem browser, path-based API, `get_tree`, or client content sniffing (iter-05, iter-06, iter-07, iter-09).
- **Inert active content:** HTML/SVG execution is outside the feature’s trust model.
- **Explicit failure states:** denied, missing, stale, offline, unsupported, redacted, too large, and corrupt are product states rather than toasts or dead filenames.
- **Platform-grade accessibility:** React Aria modality, 44px targets, selection, focus restoration, reduced motion, and AA contrast are release requirements.

### Reconciled divergences

| Divergence | Decision | Minority idea retained |
|---|---|---|
| Full-screen cover vs text/code detent sheet | Full-screen for every renderer. A file needs the available height and one navigation model. | An iPad-only trailing inspector remains valuable once tablet layout is in scope. |
| Custom swipe-down vs history-backed dismissal | No custom swipe-down in v1. System edge-back, Close, Escape, and VoiceOver scrub cover dismissal without stealing document gestures. | Prototype toolbar-only swipe-down later if real-device testing demonstrates a discoverability need. |
| PDF.js vs Safari’s native PDF iframe | Use controlled PDF.js rendering because it permits revision enforcement, bounded canvases, link disabling, and safe text-layer decisions. | Keep native Safari PDF behind a device-tested fallback flag; it may outperform PDF.js for pinch and very complex documents. |
| Live revision updates vs frozen snapshot | Freeze at open and offer `View latest`. | A revision filmstrip or side-by-side “freeze and compare” view is a strong later differentiator. |
| Visual virtualization vs accessible full DOM | Full DOM for ordinary files; explicit accessible chunks for large files. | A relay-supplied Reader/Accessible Text mode is worth adding for very large code and PDFs. |
| Share everywhere vs disable export | Separate preview from export using `shareAllowed`, exact-byte preparation, and redaction confirmation. | An administrator-level “disable all artifact sharing” policy is worth preserving. |
| Generic modal vs kind-specific canvas | Shared chrome with parchment, ink-well, image-stage, and PDF-page treatments. | A progressive View Transition card-to-viewer morph can improve polish after portal/virtualizer testing. |
| Per-turn files vs session gallery | Per-turn cards and explicit paging only in the first build. | A read-only session gallery, grouped by created/attached/referenced files, is one of the strongest Kimi/Cmux-inspired follow-ups. |
| Redaction warning vs provenance | Persistent, concise state in the header/banner. | A provenance disclosure showing safe revision, received time, completeness, and export policy should be retained for a later release. |

## 4. Security & redaction

The viewer is a read surface over a relay-published artifact store, not a remote filesystem client. The PWA cannot submit a path, infer one from a patch, browse a tree, request “latest,” or use a renderer failure to fall back to the original file. A descriptor is emitted only after the relay creates an immutable sanitized snapshot and records its artifact ID, revision, digest, safe metadata, redaction state, and export policy.

Redaction applies to every representation:

- Filename, optional display path, MIME label, dimensions, page count, language, errors, logs, thumbnails, alternative text, clipboard, and share payload.
- Text and code contain only the relay-redacted string. Redacted spans use constant placeholders and do not preserve secret length.
- Raster images are decoded and re-encoded by the relay to strip metadata and active payloads. If the relay cannot establish that the image is safe for publication, it emits `withheld`.
- PDFs must have active content, forms, attachments, metadata, unsafe annotations, and hidden/incremental content removed. `textLayerSafe` defaults to false.
- Thumbnails derive from the sanitized snapshot, never the host original.
- HTML, SVG, XML, JavaScript, and WASM never execute or receive app-origin authority.
- Copy and Share operate on the viewer buffer or prepared sanitized `File`, not DOM reconstruction or a second unqualified fetch.
- Revocation immediately aborts network/renderer work and removes DOM text, canvases, buffers, workers, and object URLs.

The viewer adds no mutation command and remains available in host-enforced Plan mode. It cannot edit, restore, stage, approve, run, publish, or open the host file. Any future action that changes the workspace must use the existing host/extension-enforced policy, a fresh one-use mutation ticket, foreground-device proof, and an expected revision; none of those controls may be implemented as client-only disabled buttons.

Service-worker and browser persistence remain fail-closed: application assets may be cached, artifact responses may not. Closing clears in-memory content; logout/revocation also clears the existing transcript cache. `pageshow` after bfcache restoration must revalidate authorization and revision before additional PDF ranges, retries, or sharing are enabled.

## 5. Open questions + risks

1. **Blocking relay decision:** will the relay persist sanitized historical artifact snapshots, or retain them only for the live session? Without historical snapshots, old cards must explicitly become unavailable after restart.
2. **Binary sanitization:** who owns destructive PDF sanitization and the image publication decision? Until that pipeline exists, image/PDF descriptors must fail closed as withheld.
3. **Safe filenames:** is an allowlisted basename acceptable, or must sensitive deployments use generic labels such as `File change`?
4. **Export policy:** should `shareAllowed` default to false, inherit a session policy, or be decided per artifact?
5. **PDF renderer validation:** PDF.js memory, pinch behavior, tagged-document reading order, and worker compatibility require physical-device testing on the minimum supported iOS. Native Safari PDF remains the fallback candidate.
6. **Supported iOS floor:** the chosen minimum affects PDF.js, AVIF, dynamic viewport units, standalone safe-area workarounds, and View Transition availability.
7. **Offline policy:** may an already-rendered in-memory snapshot remain visible after relay loss, or must disconnection blank it immediately? Revocation must always blank it.
8. **Retention and deletion:** sanitized artifacts need an explicit relationship to ledger/session retention, device revocation, and user-initiated session deletion.
9. **Size budgets:** the proposed text, image, PDF, canvas, and share limits require measurement on the oldest supported iPhone and should remain centrally configurable.
10. **Markdown and external links:** the first release should disable external navigation; a later interstitial would need a policy for hostname disclosure and tailnet exit.
11. **App-switcher snapshots:** a PWA cannot guarantee that iOS will not retain the last rendered frame. Background blanking can reduce exposure but is not equivalent to a native secure-screen API.
12. **Safe-area regressions:** installed-PWA testing must cover WebKit versions where `env(safe-area-inset-top)` incorrectly resolves to zero.
13. **Exact competitive visuals:** the public Mobbin material verifies Claude’s card and adjacent mobile patterns, but not a complete authenticated Claude/Kimi iOS artifact-open flow. Pixel-level parity should wait for versioned captures.

## 6. Sources

### Product references

- [Claude Artifacts documentation](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Claude mobile artifacts announcement](https://www.anthropic.com/news/artifacts)
- [Claude file creation on mobile](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude)
- [Kimi Websites preview interface](https://www.kimi.com/help/websites/websites-overview)
- [Kimi Code documentation](https://www.kimi.com/code/docs/en/)
- [Kimi Code file-change workflow](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html)
- [Gemini Canvas](https://support.google.com/gemini/answer/16047321)

### Platform, accessibility, and implementation

- [Apple HIG: Modality](https://developer.apple.com/design/human-interface-guidelines/modality)
- [Apple HIG: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)
- [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)
- [WAI modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG Pointer Gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html)
- [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [WebKit User Activation API](https://webkit.org/blog/13862/the-user-activation-api/)
- [MDN `touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)
- [WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [Mozilla PDF.js](https://github.com/mozilla/pdf.js)
- [PDF.js FAQ and browser support](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)
- [OWASP HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)

### Coding-agent and viewer prior art

- [Claude Code Viewer](https://github.com/d-kimuson/claude-code-viewer)
- [OpenCode iOS client](https://github.com/grapeot/opencode_ios_client)
- [Cmux iOS artifact plane](https://github.com/manaflow-ai/cmux/pull/7674)
- [OpenClaw iOS read-only files](https://github.com/openclaw/openclaw/blob/main/docs/platforms/ios.md)
- [Hugging Face Chat UI artifact implementation](https://github.com/huggingface/chat-ui/commit/89e9b33f5cf772dff52d84b67be57c4ba359c855)
- [Kimi-style FilePreview implementation](https://github.com/xy200303/spec-kimi-code/blob/main/apps/kimi-web/src/components/FilePreview.vue)
- [Safe content frame](https://github.com/assistant-ui/assistant-ui/tree/main/packages/safe-content-frame)
- [iOS PWA lightbox exit failure](https://github.com/ncvgl/slawk/pull/168)
- [Quick Look-style image interaction](https://github.com/groundfic/image-peek)

### Mobbin references worth retaining

- [Claude iOS chat detail](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8)
- [Claude iOS coding-input flow](https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b)
- [Claude Web code preview](https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3)
- [ChatGPT iOS full-screen image](https://mobbin.com/explore/screens/d95a9997-a076-4b09-be7e-4a332053f220)
- [Apple Photos iOS](https://mobbin.com/explore/screens/3d23fe0b-02d0-4bd5-902b-a42325ba5edc)
