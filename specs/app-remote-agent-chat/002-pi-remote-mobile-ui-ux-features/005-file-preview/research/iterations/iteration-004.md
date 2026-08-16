<!-- provenance: external-CLI orchestration pass; original file iter-04-sol.md -->
> **Source pass 4** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-4-sol.md`.

<!-- F6-file-preview | model=sol | lens=edge-failure | iter 4/10 | 2026-08-15T20:00:36.590Z -->

## 1. Findings for the edge-failure lens

### The viewer must fail as a viewer, not throw the user back into chat

Claude treats substantial content as a dedicated window separate from the conversation and keeps export controls with it; when an artifact fails, it offers recovery beside the error. Kimi’s preview surface similarly keeps Refresh, feedback, full-screen, and Close in the preview toolbar. The useful pattern is persistent viewer chrome with local recovery—not a toast followed by dismissal. This is an inference from the documented Claude and Kimi flows. [Claude artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them), [Kimi preview panel](https://www.kimi.com/help/websites/websites-overview)

Existing coding-agent clients confirm that dedicated renderers are now the expected bar: OpenCode’s native iOS client supports code, Markdown, and zoomable image previews; Pi Web previews source, Markdown, images, audio, PDFs, and DOCX with automatic refresh; Claude Code Viewer has distinct image, PDF, and text renderers. [OpenCode iOS Client](https://github.com/grapeot/opencode_ios_client), [Pi Web](https://github.com/agegr/pi-web), [Claude Code Viewer](https://github.com/d-kimuson/claude-code-viewer)

Therefore Close, filename, revision status, and recovery actions must remain usable during loading, offline, decoding, denial, and corruption. Routine viewer failures belong inside the viewer; system alerts should be reserved for genuinely interruptive decisions, consistent with Apple’s guidance to use alerts sparingly and write specific rather than generic error titles. [Apple alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)

### “Offline” is not a boolean

`navigator.onLine` is only a hint: operating systems may report “online” when a LAN or VPN exists but the target service is unreachable. The `online` event likewise does not prove that a particular service can be reached. Pi Remote must derive connection state from the preview request and relay heartbeat, using `navigator.onLine` only to improve copy. [MDN `Navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine), [MDN `online` event](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event)

This matters particularly on a tailnet: “Tailscale connected,” “relay reachable,” “session authenticated,” and “file authorized” are four separate conditions. A generic “You’re offline” message would be false for permission expiry, a stopped relay, DNS failure, or a peer that has left the tailnet.

A restored iPhone PWA may also display a frozen historical snapshot. `pageshow` fires when a mobile page is restored, while the back/forward cache can restore state without HTTP revalidation—even when responses use `no-cache`. On `pageshow`, Pi Remote must revalidate the active preview’s authorization and revision before resuming range requests, sharing, or loading additional pages. [MDN `pageshow`](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event), [web.dev bfcache guidance](https://web.dev/articles/bfcache), [MDN Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)

### Fetch success and preview success are different states

A `fetch()` promise resolves for HTTP errors such as 403, 404, and 500; it rejects only for request-level failures. The client must check `Response.ok`, map status codes, validate metadata, consume the body, and then complete renderer decoding before declaring success. [MDN `fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)

At minimum, the UI must distinguish:

- Authentication expired: reconnect may resolve it.
- Permission denied: retrying must not create a loop or reveal additional file metadata.
- Missing file: the referenced artifact has disappeared.
- Revision conflict: the file exists, but not at the referenced revision.
- Unsupported type: valid bytes, no safe renderer.
- Corrupt or truncated body: transport completed, rendering cannot.
- Rate limited or relay unavailable: retry later.
- Aborted request: normal consequence of Close or opening another file, not an error.

These distinctions align with HTTP’s standard 401/403/404/409/413/415/416/5xx semantics; 429 and 503 responses can also provide `Retry-After`. [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), [RFC 6585](https://www.rfc-editor.org/info/rfc6585/)

### Race conditions are a first-class UX problem

React explicitly recommends aborting or ignoring obsolete fetch results, and React 19 Strict Mode runs an additional setup/cleanup cycle in development to expose missing cleanup. An `AbortController` can stop the fetch, response-body consumption, and streams. Pi Remote needs both abort and a generation guard: abort is an optimization; the generation check is the correctness boundary if completion wins the race. [React effects](https://react.dev/learn/synchronizing-with-effects), [React Strict Mode](https://react.dev/reference/react/StrictMode), [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

Without this, a slow response for file A can replace file B after the user taps twice, a closed viewer can reopen with decoded content, or an old PDF range can be mixed with a newer revision.

### PDF failure is mostly a memory and partial-loading problem

PDF.js recommends rendering only visible pages because retaining many page canvases consumes substantial memory. It can use HTTP Range requests to render before the complete document arrives, but every range must belong to the same revision. Its examples also warn that the same canvas cannot be used for two concurrent page renders. [PDF.js FAQ](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions), [PDF.js examples](https://mozilla.github.io/pdf.js/examples/)

Safari support is not absolute; PDF.js describes Safari support as “mostly,” with reported defects. A viewer must therefore have a renderer-error state and must never interpret an iframe’s `load` event as proof that a PDF succeeded—browsers fire that event even when iframe content fails. [PDF.js FAQ](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions), [MDN iframe error behavior](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#error_and_load_event_behavior)

### Content is untrusted even when it came from the coding agent

Files may contain generated HTML, SVG, Markdown HTML, malicious filenames, or a server error document mislabeled as a file. Rendering unsanitized input into the application origin permits XSS and authenticated relay requests. `X-Content-Type-Options: nosniff` prevents browsers from converting plain text into executable HTML, but client-side allowlisting is still required. [MDN XSS](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS), [MDN `X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options)

For this feature’s image/PDF/text/code scope:

- HTML must display as source, never execute.
- SVG must display as source in the first release; do not treat it as an ordinary bitmap.
- Markdown, if added, must drop raw HTML and remote resource loading.
- PDF.js must be pinned to a supported release and configured with `isEvalSupported: false`; this is also the documented mitigation for older affected PDF.js releases. [PDF.js security discussion](https://github.com/mozilla/pdf.js/discussions/18168)
- Preview responses must bypass the service-worker cache and use `Cache-Control: no-store`. `no-cache` is insufficient because it still permits storage. [MDN Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)

### Share is a state machine, not a single button

Web Share requires HTTPS, transient user activation, supported data, and successful `navigator.canShare({files})` validation. It can fail because another share is active, the user cancels, the file type is unsupported, or transmission fails. [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API), [MDN `navigator.share()`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

A network fetch followed by `navigator.share()` may lose transient activation. If complete bytes are not already available, the first tap should prepare the exact relay-provided file; a second explicit “Share now” tap should open the native share sheet.

### Accessibility must survive every failure state

A modal viewer must trap interaction, receive initial focus, have an accessible name, contain an explicit Close button, and restore focus to its invoking file card. For large structured content, WAI recommends initially focusing a static title rather than an action that could scroll the beginning out of view. React Aria’s `Modal`, `Dialog`, and controlled-open APIs supply the appropriate foundation. [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [React Aria Modal](https://react-aria.adobe.com/Modal)

Apple recommends 44×44-point default iOS controls; WCAG 2.2’s conformance floor is 24×24 CSS pixels. Pi Remote should use 44×44 CSS-pixel toolbar targets rather than designing to the minimum. [Apple accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

### Mobbin evidence boundary

Mobbin’s public site exposes its pattern library but not verifiable public Claude or Kimi file-preview screen URLs, and the authenticated browser surface was unavailable in this pass. No behavior claim above is attributed to an unseen Mobbin screen. The benchmark evidence instead uses official Claude/Kimi documentation and open-source clients. [Mobbin](https://mobbin.com/), [Mobbin API access model](https://docs.mobbin.com/api/quickstart)

## 2. Concrete spec contribution a build phase can execute

### Viewer anatomy

Open a controlled React Aria `ModalOverlay → Modal → Dialog` immediately on file-card activation.

- Height: `100dvh`; width: full viewport.
- Top padding: `env(safe-area-inset-top)`.
- Bottom padding: `env(safe-area-inset-bottom)`.
- Persistent 56px toolbar below the safe-area inset.
- Leading: 44×44 Close button.
- Center: filename, one visual line with middle truncation; full name remains the accessible label.
- Trailing: 44×44 Share or Prepare button.
- Body: renderer, state panel, or placeholder; it must never obscure Close.
- Background: fixed bone/carbon tokens; clay is an accent, never the only error indicator.
- Error panels use icon, title, body, and action—not color alone.

The safe-area variables represent the visible rectangle that avoids notches and system UI. [MDN `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env)

### Exact state model

| State | Entry condition | Required presentation and actions |
|---|---|---|
| `loading` | Viewer opened; metadata/body/decoder incomplete | Title: “Opening {filename}.” Show type-shaped placeholder immediately. After 300ms show an accessible progress indicator. Use determinate byte progress when total size is known, otherwise indeterminate. Close remains enabled. |
| `loading-stalled` | No headers or new bytes for 15 seconds | “Still waiting for the Pi relay.” Actions: Cancel, Retry. Do not time out while bytes continue arriving. |
| `ready` | Current request generation, expected file ID/revision, integrity checks, and renderer all succeed | Show content. Enable Share only when the exact complete shareable payload is already prepared. |
| `ready-stale` | A newer revision event arrives while viewing | Keep the current content and scroll/zoom. Nonmodal banner: “A newer version is available.” Actions: Preview latest, Dismiss. Never auto-replace. |
| `ready-offline` | Relay becomes unreachable after content rendered | Retain already-rendered in-memory content; badge “Offline copy.” Disable new PDF ranges, reload, and share preparation. Existing prepared share data may be shared only if policy permits. |
| `empty` | Valid zero-byte text/code file | “This file is empty — 0 bytes.” Close and, if allowed, Share remain available. |
| `whitespace-only` | Valid text containing only whitespace | Render the content and add a quiet banner: “This file contains only whitespace.” Optional “Show invisibles” toggle. |
| `redacted` | Relay explicitly returns a redacted representation | Render only the returned bytes. Badge “Redacted.” Share label becomes “Share redacted copy” and is enabled only when `shareAllowed=true`. |
| `withheld` | Relay says content was withheld | “Preview withheld by the relay.” No Retry, copy, share, byte count, or newly revealed path. |
| `denied` | 403 or explicit preview denial | “Preview not permitted for this session.” Actions: Close only. Do not auto-retry. |
| `session-expired` | 401 or authenticated session invalid | “Connection expired. Reconnect to continue.” Actions: Reconnect, Close. Blank and release any previously decoded content. |
| `missing` | 404/410 | “This file is no longer available.” Actions: Close; Preview latest only if the relay supplies a replacement reference. |
| `revision-conflict` | 409/412 or revision/ETag mismatch | “This file changed since it was referenced.” Actions: Preview latest, Close. Offer referenced revision only when the relay explicitly retains that snapshot. |
| `unsupported` | Valid but non-allowlisted media type | Show type, safe filename, and size: “Preview isn’t available for this file type.” Allow prepared-file Share only if policy and `canShare` allow it. |
| `too-large` | Device-safety budget exceeded | “This file is too large to preview safely on this iPhone.” Actions: Close; Prepare to share only within the separate share budget. |
| `corrupt` | Decode fails, length/digest differs, PDF is encrypted, or a binary body is mislabeled as text | “This file couldn’t be rendered.” Actions: Retry once, Close. Share is disabled unless integrity is complete and failure is renderer-only. |
| `offline-unavailable` | Request fails before usable content and relay heartbeat also fails | “Can’t load this file while Pi Remote is offline.” Actions: Retry, Close. Retry automatically once after confirmed relay reconnection, never from `navigator.onLine` alone. |
| `rate-limited` | 429 | “Too many preview requests. Retry in {n}s.” Disable Retry until `Retry-After` expires. Close remains enabled. |
| `relay-error` | 5xx or protocol-invalid response | “The Pi relay couldn’t open this file.” Actions: Retry, Close; show only a redacted diagnostic code. |
| `aborted` | Close, replacement selection, unmount, or navigation aborts work | No error UI or toast. Tear down silently. |

Loading UI follows Apple’s distinction between determinate and indeterminate progress and its requirement to show continued activity rather than appearing frozen. [Apple progress indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators), [React Aria ProgressBar](https://react-aria.adobe.com/ProgressBar)

### Request and race protocol

Each open operation must create:

```text
viewerGeneration
fileId
expectedRevision
AbortController
rendererJob
objectUrls[]
```

Execution rules:

1. Increment `viewerGeneration` before changing the toolbar title.
2. Abort and dispose the previous generation.
3. Deduplicate repeated activation of the same `fileId + expectedRevision`; do not push duplicate history entries.
4. Request the referenced revision, not an unqualified “latest.”
5. Before committing any metadata, bytes, decoder result, or error, require:
   `generation === activeGeneration && fileId === activeFileId`.
6. Require response revision/strong ETag to match the requested revision.
7. A PDF Range response must carry the same revision/ETag as every prior range. On mismatch, destroy the PDF document and enter `revision-conflict`; never combine ranges.
8. Closing aborts fetch, stream, syntax-highlighting worker, image decode, and PDF render tasks.
9. Revoke object URLs only after their renderer has unmounted; revoke all URLs and zero retained buffers on replacement, denial, expiry, or Close.
10. Effect cleanup must be idempotent and pass React 19 Strict Mode’s setup-cleanup-setup cycle.

### Renderer safety budgets

These are initial product budgets, not claims about WebKit’s absolute limits. Make them centrally configurable and test them on the oldest supported iPhone.

| Renderer | Full preview budget | Degradation |
|---|---:|---|
| Syntax-highlighted code | 1 MiB or 20,000 lines | Above either threshold, switch to virtualized plain text. |
| Plain text/code | 5 MiB or 100,000 lines | Above either threshold, show `too-large`; do not allocate one giant DOM text node. |
| Bitmap image | 25 MiB compressed, 40 megapixels, maximum side 8,192px | Read dimensions from headers before decode where possible. Above budget, show `too-large`. |
| PDF with Range support | 100 MiB advertised size; visible-page rendering only | Retain at most previous/current/next page canvases. Cap each rendered canvas at 12 megapixels and effective DPR at 2. |
| PDF without Range support | 25 MiB | Above budget, do not full-buffer for preview. |
| Prepared Web Share file | 32 MiB | Above budget, sharing is unavailable in the PWA; explain without suggesting that preview failed. |

For PDFs:

- Use PDF.js’s visible-page strategy.
- Never render two pages into one canvas concurrently.
- Destroy page render tasks when zoom changes.
- Treat password-protected PDFs as `corrupt/encrypted` in version 1; do not collect document passwords.
- Canvas pages are `aria-hidden`; provide selectable text layers where available.
- Wrap pages in sections labelled “Page X of Y.”
- If a page has no extractable text, announce “Page X is image-only; no text alternative was provided.”

### Gestures and navigation

- Tapping any file card opens the viewer route and pushes one history entry.
- Browser/PWA Back closes the viewer and restores the exact conversation scroll position.
- Explicit Close performs the same transition and restores focus to the invoking file card. If that card no longer exists, focus the containing message.
- Support swipe-down dismissal only when all are true:
  - Gesture starts in the toolbar/grabber.
  - Content scroll position is zero.
  - Image/PDF zoom is exactly 1.
  - Only one pointer is active.
  - Horizontal movement remains below 24px.
- Pinch, image pan, text selection, PDF scrolling, and horizontal code scrolling must never trigger dismissal.
- A visible Close button is mandatory; swipe is only an alternative.
- Opening B while A loads keeps the viewer open, changes the title to B immediately, and replaces the body with B’s placeholder. A must never appear under B’s title.

### Share behavior

1. If a complete `File` is already prepared and `navigator.canShare({files:[file]})` succeeds, Share directly from the press handler.
2. If bytes are complete but the `File` has not been prepared, construct it synchronously before enabling Share.
3. If more bytes must be fetched, the first action is “Prepare to share.” Show byte progress and Cancel. Completion changes the button to “Share now”; the second tap invokes the native sheet.
4. Share only the exact relay-provided bytes and sanitized filename. Never reconstruct omitted or redacted content.
5. `AbortError` from the share sheet produces no alarming error toast; leave the viewer unchanged.
6. `InvalidStateError`, `NotAllowedError`, `TypeError`, or `DataError` produces a polite `role="status"` message: “Sharing isn’t available for this file.”
7. Closing while sharing must not reopen the viewer when the promise settles.

### Accessibility

- Dialog name: visible filename heading.
- Initial focus: the filename heading with `tabIndex="-1"`, not Share or Close.
- Tab and Shift+Tab remain within the viewer; Escape closes when a hardware keyboard is present.
- All icon buttons include visible or accessible names matching their action: “Close preview,” “Share {filename},” “Retry preview.”
- Loading/reconnection uses `role="status"` with `aria-live="polite"`.
- New denial, expiry, or unrecoverable corruption uses one `role="alert"` announcement. Re-renders must not repeat it.
- A progress indicator must expose filename and progress; do not announce every byte or percentage update. Throttle accessible value changes to at most once per second.
- Image fallback label: “Image file {filename}. No description was provided.” Use relay-supplied alternative text when available.
- Code uses a labelled `<pre>` or virtualized equivalent and exposes line count. Provide a Wrap lines toggle.
- Visual filename truncation must not truncate its accessible name.
- At 200% text zoom, toolbar actions remain present and the filename yields space before buttons.
- Every toolbar target is at least 44×44 CSS pixels.
- `prefers-reduced-motion: reduce` removes slide/scale movement and spinner rotation; use a static progress bar or opacity change. The media feature directly reflects the user’s reduced-motion setting. [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)

### Visual and motion behavior

- Entry: 180ms opacity plus 8px upward translation; no spring or scale.
- Exit: 140ms reverse transition.
- File-to-file replacement: 100ms crossfade only after the new renderer has a valid first frame.
- Error and empty states do not animate repeatedly.
- Under reduced motion: entry/exit is a maximum 80ms opacity transition; content replacement is immediate.
- The offline, stale, and redacted badges use text plus icon and stay adjacent to the filename, not as floating toasts.

### Required pass/fail checks

A build is not complete until all checks pass:

- A→B race: delay A by 2 seconds, return B immediately; B remains visible after A completes.
- Close race: close during each of metadata fetch, body stream, image decode, PDF render, syntax highlighting, and share preparation; no state update, toast, leaked URL, or reopened viewer occurs.
- Revision race: return PDF ranges with two ETags; no mixed document renders and `revision-conflict` appears.
- Offline false-positive: set `navigator.onLine=true` while the relay is unreachable; copy says relay unreachable/offline only after request and heartbeat evidence.
- bfcache: restore a ready viewer through `pageshow`; sharing and new PDF ranges remain disabled until revision/authorization revalidation succeeds.
- Revocation: send a permission-revoked event while ready; content disappears immediately and buffers/object URLs are released.
- Service-worker fallback: return the PWA HTML shell from a file endpoint; MIME/protocol validation enters `relay-error`, never the HTML renderer.
- Empty matrix: zero-byte, whitespace-only, truncated UTF-8, binary-as-text, corrupt image, encrypted PDF, corrupt PDF, unsupported MIME, and oversized inputs enter their specified distinct states.
- Share matrix: unsupported Web Share, failed `canShare`, user cancellation, active-share conflict, file-share rejection, and close-during-share all preserve viewer stability.
- VoiceOver: opening announces filename and dialog; loading/status changes are announced once; Close returns focus to the invoking card.
- Keyboard: Tab remains inside; Escape closes; every action operates using Enter and Space.
- Zoom/gesture: pinch and horizontal code scrolling never dismiss; valid toolbar swipe does.
- Reduced motion: no transform or rotation animation runs when the media query matches.
- Large text: at 200% zoom, Close and Share remain visible, nonoverlapping, and at least 44×44 CSS pixels.

## 3. Divergent / minority ideas worth considering

### Make “referenced snapshot” the primary object

Most viewers privilege the latest file. For an agent transcript, the version referenced by the message is usually more trustworthy: it preserves what the user was asked to review. Keep the historical snapshot as the default and treat “Preview latest” as an explicit branch. This turns revision conflicts from failures into provenance.

### Use a quarantine renderer, even for trusted tailnets

Move image header parsing, PDF.js, and syntax highlighting into workers or a separate opaque-origin frame. Do not grant `allow-same-origin`, forms, navigation, downloads, or popups. HTML and SVG remain source-only. This costs implementation effort but sharply reduces the blast radius of generated hostile files; iframe sandboxing exists specifically to restrict nested content. [MDN iframe sandbox](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/sandbox)

### Treat offline retention as a visible security choice

The default spec retains only the currently rendered, in-memory content and clears it on Close or background revalidation failure. A stricter mode could blank immediately when the relay disconnects. A less strict mode could retain encrypted offline snapshots. Expose this as an administrative policy rather than silently choosing convenience.

### Make sharing intentionally two-step for sensitive files

For redacted or path-sensitive artifacts, replace the ordinary Share button with “Review export,” showing filename, MIME, size, redaction status, and exactly what leaves Pi Remote. This is slower than Claude’s conventional export control but fits a remote-development threat model.

### Prefer system preview as a last-resort handoff, not a hidden fallback

Claude Mobile documents that downloaded files may open in the system preview or another app. Pi Remote could expose “Open in another app” through the native share sheet after preparation, but should not silently leave the PWA when its renderer fails. [Claude mobile file creation](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude)

### Add a “failure envelope”

A collapsed technical row could show only relay-approved diagnostics: request timestamp, renderer name/version, expected and received revision, and a non-sensitive error code. It would make remote troubleshooting possible without exposing raw headers, paths, tokens, or content.

## 4. Open questions + risks

- **Relay contract:** Does every preview response provide stable file ID, sanitized display name, MIME type, byte length, revision/ETag, completeness, redaction state, digest, `shareAllowed`, and Range support? Without these, several states cannot fail closed.
- **Historical revisions:** Can the relay serve the exact revision referenced in an old message, or only current filesystem state?
- **Export authority:** Is sharing already-redacted data always allowed, or is `shareAllowed` a separate relay decision?
- **Offline policy:** Is retaining an already-rendered preview in memory while disconnected acceptable, or must tailnet loss blank it immediately?
- **Background behavior:** How quickly must content be cleared when iOS backgrounds the PWA, and must resume always require authorization revalidation?
- **PDF accessibility:** Will PDFs commonly be scanned/image-only? If so, a text alternative or relay-side OCR contract is required to approach parity for VoiceOver users.
- **Large-file budgets:** The proposed thresholds require real-device validation on the oldest supported iPhone, in light/dark mode, with VoiceOver and large text enabled.
- **Range consistency:** The relay must pin all PDF ranges to one strong revision. Weak timestamps are insufficient when a file can change during preview.
- **Renderer supply chain:** PDF.js and syntax-highlighting packages parse attacker-influenced content; pin versions, monitor advisories, and keep PDF evaluation disabled.
- **Service-worker scope:** File/API routes must be explicitly network-only and never fall through to the cached app shell.
- **Error privacy:** Server messages cannot be displayed verbatim. Diagnostic copy and codes need a redaction contract.
- **External links:** Decide whether PDF annotations and future Markdown links are disabled, confirmation-gated, or opened outside the PWA.
- **Mobbin gap:** Claude/Kimi screen-level Mobbin verification remains outstanding because no authenticated screen record was available. It should be completed before pixel-level motion or toolbar-placement claims are treated as benchmark evidence.

## 5. Sources

### Product and prior-art references

- [Claude — What are artifacts and how do I use them?](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Claude — Create and edit files](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude)
- [Kimi — Websites and preview panel](https://www.kimi.com/help/websites/websites-overview)
- [OpenCode native iOS client](https://github.com/grapeot/opencode_ios_client)
- [Pi Web](https://github.com/agegr/pi-web)
- [MindFS](https://github.com/a9gent/mindfs)
- [MobileCLI](https://github.com/MobileCLI/mobilecli)
- [Claude Code Viewer](https://github.com/d-kimuson/claude-code-viewer)
- [Mobbin public library](https://mobbin.com/)
- [Mobbin screen-search API documentation](https://docs.mobbin.com/api/quickstart)

### Apple, accessibility, and interaction guidance

- [Apple HIG — Loading](https://developer.apple.com/design/human-interface-guidelines/loading)
- [Apple HIG — Progress indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators)
- [Apple HIG — Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)
- [Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple HIG — File management and Quick Look](https://developer.apple.com/design/human-interface-guidelines/file-management)
- [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.2 target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [React Aria Modal](https://react-aria.adobe.com/Modal)
- [React Aria ProgressBar](https://react-aria.adobe.com/ProgressBar)

### Web-platform and implementation references

- [React — Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React — Strict Mode](https://react.dev/reference/react/StrictMode)
- [MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN — Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
- [MDN — Navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [MDN — pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event)
- [web.dev — Back/forward cache](https://web.dev/articles/bfcache)
- [MDN — Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [MDN — Navigator.share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [MDN — Safe-area environment variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env)
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)
- [MDN — Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
- [MDN — X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options)
- [MDN — XSS](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [RFC 6585 — Additional HTTP Status Codes](https://www.rfc-editor.org/info/rfc6585/)
- [PDF.js FAQ](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)
- [PDF.js rendering examples](https://mozilla.github.io/pdf.js/examples/)
- [PDF.js security discussion](https://github.com/mozilla/pdf.js/discussions/18168)
