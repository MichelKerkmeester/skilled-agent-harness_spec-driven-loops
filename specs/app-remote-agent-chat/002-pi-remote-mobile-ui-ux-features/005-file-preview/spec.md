<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# F6 — File Preview

> One-line summary: turn a redacted transcript file card into a Claude-style, history-backed, full-screen read-only viewer for immutable relay snapshots.

## DECISION

Build one in-thread file card that opens a history-backed, full-screen, read-only viewer with one shared shell and typed image, PDF, text, code, and diff renderers. The viewer displays immutable relay-issued snapshots identified by opaque artifact ID, revision, and digest; it never turns model text or a displayed path into a host-filesystem read. Every renderer opens full-screen on iPhone through a React Aria modal, with explicit Close, browser/iOS edge-back, Escape, and VoiceOver dismissal. Do not add a custom swipe-down dismissal in v1 because it conflicts with scrolling, selection, PDF interaction, and image pan/zoom.

This is a partial delivery: the first slice upgrades the existing redacted `file_diff` card and does not pretend that a complete file exists. Text, code, raster image, and PDF previews become available only when the relay has published the corresponding sanitized snapshot contract. The result keeps Pi Remote’s read-only-by-default, one-use-ticketed, revision-checked mutation boundary intact.

## Problem and goal

Pi Remote can show a redacted `file_diff` block, but the operator cannot deliberately open the changed file as a readable artifact. A filename or patch header must not become a filesystem query, and a live workspace read would violate the relay’s redaction and supervision model. The feature needs the continuity of Claude’s compact card-to-viewer flow while retaining explicit revision identity and Kimi-style file-type metadata.

The goal is a deliberate, fast, accessible read surface:

1. A user sees a compact file card in the assistant transcript and chooses whether to open it.
2. The viewer opens the exact relay-issued snapshot or the exact received diff, never “latest” by implication.
3. The user can read, select, copy, and—only where explicitly allowed—share the sanitized revision.
4. Closing returns to the same session, chat position, and originating card.
5. Every unavailable, unsafe, stale, redacted, offline, oversized, or corrupt condition is an explicit UI state.

## Current state

- `packages/pi-rpc-protocol/src/types.ts` contains `FileDiffBlock`, but no `FilePreviewBlock`, artifact descriptor, or artifact-resource guard.
- `apps/pi-remote-web/src/App.tsx` renders `file_diff` through `Block` and `DiffPatch` inside the virtualized `TranscriptList`; there is no file card activation or viewer host.
- `apps/pi-remote-web/src/relay.ts` reads paginated transcript DTOs and sync messages. It has no artifact resource request.
- `apps/pi-remote-relay/src/store/relay-store.ts` stores redacted envelopes and exposes transcript pages. It has no immutable sanitized artifact store.
- `apps/pi-remote-relay/src/http/server.ts` authenticates the existing read-only POST routes but has no artifact read endpoint.
- `apps/pi-remote-relay/src/store/transcript-projector.ts` derives a redacted diff from file-mutation tool output; it does not publish a complete file snapshot.
- `apps/pi-remote-web/src/cache.ts` persists a bounded redacted transcript in `localStorage`; artifact bodies must not be added to that cache.
- `apps/pi-remote-web/public/service-worker.js` already bypasses `/api/` requests, but the artifact route must have an explicit network-only regression test.
- The locked design system already supplies bone/parchment surfaces, carbon ink, clay `#d97757`, Inter, Source Serif 4, light/dark tokens, and the WCAG AA baseline.

## Desired end state

The transcript contains a full-width, single-button file card. It shows only relay-authored safe metadata: a sanitized basename or generic label, type, size or page count, revision/completeness, redaction state, and a sanitized thumbnail or type glyph. It never auto-opens.

Pressing the card opens one full-screen viewer shell mounted outside the virtualized transcript. The shell freezes `{ artifactId, revision, digest, payload }` for the lifetime of the open document. It owns a sticky opaque header, safe-area spacing, focus trapping, history-backed dismissal, status announcements, renderer cleanup, and scroll/focus restoration. Typed renderers own their content interaction while sharing the shell and controls.

The relay creates and stores a sanitized snapshot before emitting its descriptor. A browser request names the authenticated session, opaque artifact ID, and exact opaque revision. The relay confirms ownership and returns the stored snapshot with a digest/ETag; it never reads the current workspace in response to a browser request. A missing snapshot becomes `missing`, `withheld`, or `unsupported`, never a path-based fallback.

## Scope

### In scope for v1

- An openable card for existing redacted `file_diff` blocks.
- A `FilePreviewBlock` descriptor with relay-authored identity, safe metadata, redaction state, completeness, export policy, and inline-versus-resource content mode.
- A durable or session-retained relay artifact store for immutable sanitized snapshots, with explicit retention and revocation behavior.
- An authenticated exact-revision artifact read route with no mutation ticket and no filesystem browsing.
- Full-screen React Aria modal presentation on iPhone, including history, edge-back, Escape, VoiceOver scrub, focus restoration, safe areas, reduced motion, and 200% text enlargement behavior.
- Image, PDF, text, Markdown-as-safe-text, code, diff, and unsupported renderers.
- Loading, stalled, empty, whitespace-only, redaction, truncation, stale, offline, denied, expired, missing, conflict, rate-limit, corruption, size-limit, revocation, and retry states.
- Native selection for text/code/diff and safe PDF text layers; copy of exactly the received content.
- Share only for the currently displayed sanitized revision and only when `shareAllowed` and platform capability allow it.
- Relay-side redaction, raster re-encoding, destructive PDF sanitization, safe thumbnails/alt text, byte/digest validation, and bounded resource budgets.
- Tests for protocol guards, relay publication and reads, redaction, cache/service-worker exclusion, async races, UI state coverage, accessibility, and resource cleanup.
- True 390 CSS-pixel CDP screenshots in light and dark themes, plus physical-device verification on the oldest supported iPhone.

### Out of scope: v1 non-goals

- Editing, restoring, staging, approving, running, publishing, or opening a file on the host.
- A live filesystem browser, `get_tree`-driven file picker, path-based API, or a client request derived from assistant prose, tool output, diff headers, extensions, or filename text.
- Automatic opening, automatic “latest” replacement, horizontal artifact paging, a session-wide gallery, a split pane, or an iPad inspector.
- Custom swipe-down, backdrop-tap dismissal, artifact swipe gestures, or chat/file pane swipe gestures.
- Office document rendering, spreadsheets, archives, binary reverse engineering, or generic download fallback.
- Executing HTML, active SVG, XML, JavaScript, WASM, PDF JavaScript, PDF forms, attachments, external links, remote images, frames, or embedded content.
- Revision comparison, side-by-side snapshots, filmstrips, live multi-revision streaming into an open document, or a complete-file reconstruction from a diff.
- Public artifact URLs, shareable session URLs, host handoff, or an administrator UI for export policy.

## Relay and protocol contract

The relay-authored file preview payload is the following. The surrounding transcript transport still carries its opaque block identity and ordering fields. The artifact `revision` below is a string and must not be silently coerced into the existing numeric revision used by older transcript block kinds; model this union member explicitly so the exact artifact revision is preserved.

```ts
type FilePreviewBlock = Readonly<{
  kind: 'file_preview';
  artifactId: string;
  revision: string;
  displayName: string;
  renderer: 'image' | 'pdf' | 'text' | 'code' | 'diff' | 'unsupported';
  mimeType: string;
  byteLength: number | null;
  digest: string;
  language?: string;
  pageCount?: number;
  altText?: string;
  redaction: 'not-needed' | 'applied' | 'withheld';
  completeness: 'complete' | 'excerpt';
  shareAllowed: boolean;
  textLayerSafe?: boolean;
  thumbnailRef?: string;
  content:
    | { kind: 'inline-text'; text: string; firstLine?: number }
    | { kind: 'artifact-ref' }
    | { kind: 'none' };
}>;
```

Contract invariants:

- `artifactId`, artifact `revision`, `displayName`, MIME, renderer, size, language, page count, thumbnail reference, redaction, completeness, export policy, and content mode are relay-authored. The client never infers them from assistant text, extensions, diff headers, or a displayed path.
- `artifactId`, revision, thumbnail references, and digests are bounded opaque values. The digest is a lowercase SHA-256 value. Unknown fields are rejected at the protocol boundary.
- `displayName` is a redacted basename or generic label such as `File change`; it never contains an absolute or relative host path.
- `content: inline-text` is allowed only for a bounded, already-redacted relay string. It is an in-memory display optimization, not permission to read a file. The web cache strips it before persistence.
- `content: artifact-ref` resolves only to a stored sanitized snapshot. The artifact resource is never a live-workspace read.
- `content: none` carries no payload; it is required for withheld and metadata-only states.
- The browser requests the exact tuple `{ sessionId, artifactId, revision }`. The relay verifies the tuple belongs to the authenticated application session and returns a strong ETag matching `digest`.
- A PDF range response carries the same artifact revision and ETag as every other range. Any mismatch destroys the document and enters `revision-conflict`.
- Artifact responses use `Cache-Control: private, no-store, max-age=0`, `X-Content-Type-Options: nosniff`, and `Cross-Origin-Resource-Policy: same-origin`. Artifact reads are network-only and excluded from service-worker caches.
- No access token, mutation ticket, host path, filename, digest, or revision token is placed in a shareable URL. The read route relies on the existing authenticated session, Origin, and principal checks.
- The read route cannot invoke a Pi tool, write state, or issue a mutation ticket. It remains available in host/extension-enforced Plan mode.

## User-facing behavior

### In-thread card

- Use the full assistant-column width. Do not auto-open.
- Minimum height is 68px; padding is 12px; radius is 16px; border is one pixel using `--line`; fill is `--surface`; do not add Material-style elevation.
- The preview slot is 44×44px. Use a relay-supplied sanitized image thumbnail, a relay-supplied PDF first-page thumbnail, or a flat type glyph. Never generate a thumbnail from a host path or unsanitized bytes.
- Filename uses Inter at 15px/20px, semibold, one line, middle-truncated where supported. Wrap it in `<bdi>`.
- Metadata uses Inter at 12px/16px, for example `TypeScript · 18 KB · rev 7` or `PDF · 12 pages · Redacted`.
- The whole card is one React Aria `Button`, activated through `onPress`. Do not nest Share, More, or another button inside it.
- Accessible names include the safe display name, type, revision/completeness, and redaction state, for example `Open package-lock.json, JSON code, revision 18, partially redacted.`
- Press feedback changes background/border and scales to `.985` for 90–120ms. Activation is on release and cancels when the pointer leaves.
- Do not add custom long-press behavior in v1.
- A diff card keeps the first six safe lines as noninteractive span rows, retains `+`/`−` prefixes, and uses existing add/remove tints. It displays the received patch exactly and never reconstructs a complete file.

### Opening, history, and dismissal

- `ArtifactViewerProvider` owns the single active viewer, origin trigger, frozen source, history state, chat scroll offset, focus restoration, request generation, and cleanup. Mount it outside the virtualized transcript.
- Use controlled `ModalOverlay`, `Modal`, and `Dialog` from `react-aria-components`.
- The viewer is full-screen for every renderer on iPhone. There are no detents, grabbers, backdrop dismissal, or split panes in v1.
- Set `viewport-fit=cover`. Use React Aria’s `--visual-viewport-height`, falling back to `100dvh` and then `100svh`; never disable browser scaling.
- Blur the composer before opening. The header is 56px plus the top safe-area inset, with a tested standalone fallback when WebKit reports zero. Bottom controls use `max(12px, env(safe-area-inset-bottom))`.
- Opening pushes one child history entry under the session. Close, browser Back, and iOS edge-back return to the same session rather than the inbox.
- Close button and Escape play the 180ms exit and then call `history.back()`. A browser-initiated `popstate` skips the competing JavaScript slide and unmounts directly.
- Preserve the exact chat scroll offset. Restore focus to the originating card; if virtualization removed it, focus the containing message, then the transcript region.
- A direct or reloaded viewer URL may restore only non-secret metadata until the authenticated exact revision is reacquired.

### Viewer header and controls

- The visible title is the safe filename in Inter 16px/22px semibold. The subtitle shows type, exact revision, and redaction/truncation state in Inter 12px/16px.
- The leading Close button is 44×44px with `aria-label="Close preview"`.
- Show a 44×44px Share button only when `shareAllowed` and the platform can perform the applicable share. Visibility never implies export authority.
- Show Copy only for text, code, or diff when useful. Put it in an overflow menu only when it has a real action; do not show an empty overflow control.
- At 200% text enlargement, use a two-row header: actions stay on row one; title and metadata move to row two.
- Keep the header opaque, sticky, and free of blur or glass.
- Use one throttled `role="status"` region for loading, page changes, copying, and revision availability. Use one nonrepeating alert for denial, revocation, and terminal corruption.

### Renderer behavior

| Renderer    | Required presentation                                                                                                                      | Controls and interaction                                                                                                              | Limits and failure behavior                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Image       | Native `<img>` from a sanitized in-memory blob; `object-fit: contain`; carbon stage in both themes; no intrinsic upscaling until requested | Pinch 1×–4×, double-tap fit/2× around the tap, pan only above fit, visible Zoom out/Fit/Zoom in buttons                               | Reject above 25 MiB compressed, 40 MP, or 8,192px on either side; decode failure is `corrupt`                                         |
| PDF         | Lazy `pdfjs-dist`; sanitized bytes or consistent range source; visible page plus adjacent pages                                            | Continuous vertical pages, page indicator, Previous/Next, Zoom out/Fit width/Zoom in, text selection/search only when `textLayerSafe` | 50 MiB/500-page default cap; ranges above 25 MiB; at most three page canvases; 12 MP maximum canvas; unsafe text layer is canvas-only |
| Text        | Real DOM text in Source Serif 4 at 17px/27px with 18px inline padding; wrap and reflow                                                     | Native selection, in-view Find, Copy received content                                                                                 | Full DOM to 250 KB/2,500 lines; explicit 500-line chunks above that; hard cap 2 MiB/20,000 lines                                      |
| Markdown    | Strict React AST under the text renderer; no raw HTML or executable links                                                                  | Semantic headings, lists, and tables; native selection; safe source view optional                                                     | Invalid markup falls back to plain text; remote images, frames, and external navigation are disabled                                  |
| Code        | `<pre><code>` with a separate `aria-hidden` line-number gutter; plain first paint; lazy fine-grained highlighting in a worker              | Wrap off by default, horizontal pan, visible Wrap and Find, native selection, Copy all received content                               | Same text caps; unknown language becomes plain text; highlighting failure never blocks reading                                        |
| Diff        | Existing add/remove/context semantics on parchment; visible prefixes                                                                       | Wrap off by default, Wrap/Find/Copy controls, native selection                                                                        | Display exactly the received patch; never reconstruct the complete file                                                               |
| Unsupported | Safe metadata-only state                                                                                                                   | Share exact sanitized bytes only when policy and platform allow it                                                                    | No “try original,” browser navigation, or host handoff                                                                                |

HTML, active SVG, XML, JavaScript, and WASM never execute. Redacted HTML/SVG may be shown as source code; otherwise use `unsupported`. Raster images are decoded and re-encoded by the relay. PDF JavaScript, forms, editing, attachments, printing, external navigation, unsafe annotations, hidden content, and unsafe text layers are disabled or removed before publication.

### Lifecycle and content states

Lifecycle and content state are separate. A renderer can be `ready` while carrying a `partial-redaction` or `truncated` modifier; state handling must not multiply into bespoke components for every combination.

| State                 | Presentation                                                                     | Available actions                                       |
| --------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `closed`              | Transcript card only                                                             | Open                                                    |
| `opening`             | Full-screen shell and safe title immediately                                     | Close                                                   |
| `loading`             | Renderer-shaped static placeholder and polite `Opening…` status                  | Close                                                   |
| `loading-stalled`     | After 15 seconds without headers or new bytes: `Still waiting for the Pi relay.` | Cancel, Retry                                           |
| `ready`               | Frozen renderer snapshot                                                         | Renderer controls, permitted Share/Copy, Close          |
| `empty`               | `This file is empty — 0 bytes.`                                                  | Share if permitted, Close                               |
| `whitespace-only`     | Render whitespace with a quiet explanatory banner                                | Show invisibles, Close                                  |
| `partial-redaction`   | Persistent `Some content was removed by the relay.` badge                        | Share sanitized copy if permitted, Close                |
| `withheld`            | `Preview withheld by relay policy.` with no payload or sensitive metadata        | Close                                                   |
| `truncated`           | Sticky `Preview ends here. The relay supplied an excerpt.` banner                | Share preview if permitted, Close                       |
| `stale`               | Keep the current revision untouched; `A newer revision is available.`            | View latest, Dismiss banner, Close                      |
| `offline-loaded`      | Keep the in-memory snapshot with `Offline copy` badge                            | Close; Share only if already prepared and policy allows |
| `offline-unavailable` | `This preview isn’t available while the relay is unreachable.`                   | Retry, Close                                            |
| `denied`              | `Preview not permitted for this session.`                                        | Close                                                   |
| `expired`             | `This preview has expired.` and purge existing content                           | Close                                                   |
| `missing`             | `This revision is no longer available.`                                          | View latest only when explicitly offered, Close         |
| `revision-conflict`   | `This file changed since it was referenced.`                                     | View latest, Close                                      |
| `unsupported`         | Safe filename/type/size and `Preview isn’t available for this file type.`        | Share safe bytes if permitted, Close                    |
| `too-large`           | `This file is too large to preview safely on this iPhone.`                       | Share only within export budget, Close                  |
| `corrupt`             | `This file couldn’t be rendered.`                                                | Retry once, Close                                       |
| `rate-limited`        | Countdown based on `Retry-After`                                                 | Retry when enabled, Close                               |
| `relay-error`         | Redacted diagnostic code, never raw server text                                  | Retry, Close                                            |
| `revoked`             | Remove text, canvases, blobs, buffers, workers, and object URLs immediately      | Close                                                   |
| `aborted`             | No error UI; normal result of close or replacement                               | None                                                    |
| `exiting`             | Interaction disabled during exit                                                 | None                                                    |

Do not derive `offline` from `navigator.onLine` alone. Use the artifact request result plus relay heartbeat. Opening freezes the exact `{ artifactId, revision, digest, payload }`; later stream revisions cannot change open text, selection, scroll, or Share bytes. When a newer revision appears, show a nonblocking stale banner, request only the explicitly named revision from `View latest`, keep the old snapshot visible until authorization, metadata, size, and digest validation pass, then swap after the first valid render and announce the new revision once.

### Gestures, keyboard, accessibility, and visual behavior

- Shared gestures are tap/release on the card, Close, iOS edge-back/browser Back, VoiceOver two-finger scrub, and hardware Escape. Do not bind Space to Close or Left/Right to artifact paging.
- Content owns scrolling, panning, zooming, and selection. Image stage alone may use `touch-action: none` while custom zoom is active; viewer, application root, PDF, text, and code scrollers must retain native pan behavior.
- Every gesture-only function has a visible 44×44px single-pointer alternative. Text/code long-press and double-tap remain native selection. Horizontal code movement never dismisses or changes artifact.
- Keep `Tab`/`Shift+Tab` inside the modal. Escape closes an open menu first, then the viewer. Command/Ctrl+F searches safe text/code/PDF; Command/Ctrl+C copies native selection; `+`, `-`, and `0` control zoom; Page Up/Page Down and Home/End retain native paging; arrow keys scroll or operate a focused toolbar only.
- The dialog’s visible filename heading is its accessible name. Focus that heading on open, keep it first in logical DOM order, then Close, Share, status actions, renderer controls, and content. Do not put the complete document in `aria-describedby`.
- Background chat is inert and hidden from the accessibility tree. The renderer is a labelled document/region, not a giant `aria-label`. Text and Markdown use real semantic structure; code decorative token spans and line numbers are ignored by assistive technology.
- Images use relay-supplied trusted alt text; otherwise announce `Image preview; description not provided.` PDFs label pages `Page N of M` and announce when accessible text is unavailable.
- Use `rem`, logical CSS properties, `<bdi>` for filenames, LTR isolation for code/hashes/MIME/path-like tokens inside RTL shells, `I18nProvider`, `lang`, `dir`, and `Intl` for sizes and page counts. Test 320 CSS-pixel reflow and 200% text enlargement.
- Continue the locked bone/carbon/clay, Inter, and Source Serif 4 system. Text/Markdown use parchment, code uses a warm carbon ink well with AA-verified colors, diffs use existing semantic tints, images use a carbon stage, and PDFs retain page colors on a quiet surround. Clay is not body copy, a divider, the sole focus signal, or the sole redaction/error signal.
- Viewer entry is overlay opacity plus `translateY(8px → 0)` over 220ms; exit is 180ms; valid replacement is a 100ms crossfade. Under reduced motion, use opacity-only at most 100ms or an instant swap.

## Security and redaction requirements

The viewer is a read surface over a relay-published artifact store, not a remote filesystem client.

- The relay creates an immutable sanitized snapshot before emitting `FilePreviewBlock`. It records opaque artifact ID, exact revision, digest, safe metadata, redaction state, completeness, and export policy.
- The browser cannot submit a path, infer one from a patch or tool result, browse a tree, request `latest`, or fall back to the original file after a renderer failure. Any absent artifact is an explicit unavailable state.
- Redaction covers filename, optional display metadata, MIME label, dimensions, page count, language, errors, logs, thumbnail, alt text, clipboard, and Share payload. Redacted spans use constant placeholders and do not preserve secret length.
- Raster images are decoded and re-encoded by the relay to remove metadata, profiles, and active payloads. If safety cannot be established, publish `withheld`.
- PDFs are destructively sanitized before publication: remove active content, forms, attachments, metadata, unsafe annotations, hidden/incremental content, and unsafe text layers. `textLayerSafe` defaults to false.
- Thumbnails derive only from sanitized bytes. HTML, SVG, XML, JavaScript, and WASM never execute or receive app-origin authority.
- Copy and Share operate on the frozen viewer buffer or a prepared sanitized `File`, never by reconstructing DOM text or performing a second unqualified fetch.
- Revocation aborts network and renderer work immediately and removes DOM text, canvases, buffers, workers, and object URLs.
- Artifact responses never enter Cache Storage, `localStorage`, IndexedDB, or the persisted transcript cache. Closing clears in-memory content; logout and revocation also use the existing transcript-cache clearing path.
- `pageshow` after bfcache restoration revalidates authorization and exact revision before additional PDF ranges, retries, or sharing are enabled.
- Share is disclosure, not mutation. Text/code/diff use `navigator.share({ title, text })` from the press event. Image/PDF require pre-prepared exact-revision `File` bytes and `navigator.canShare({ files })`. Partial or truncated content requires confirmation that removed content is not included. `AbortError` is normal cancellation.
- No artifact control is a client-only mutation gate. Future workspace-changing actions would require the existing host/extension-enforced Plan mode, fresh one-use mutation ticket, foreground-device proof, and expected revision; none are part of this feature.

## Dependencies and affected areas

### Protocol

- Change `packages/pi-rpc-protocol/src/types.ts` to add `FilePreviewBlock` and the exact artifact descriptor/content union while leaving existing block kinds compatible.
- Change `packages/pi-rpc-protocol/src/guards.ts` to validate bounded opaque IDs/revisions, digest, safe metadata, content mode, renderer, redaction, completeness, and strict keys.
- Change `packages/pi-rpc-protocol/src/index.ts` to export the type and guard.
- Extend `packages/pi-rpc-protocol/tests/guards.test.ts` with valid, malformed, unknown-field, oversized, path-bearing, digest, revision, and content-mode fixtures.

### Relay

- Change `apps/pi-remote-relay/src/store/transcript-projector.ts` and `apps/pi-remote-relay/src/index.ts` to emit a preview descriptor only from an explicit relay-allowlisted snapshot source; keep diff projection exact and separate.
- Add `apps/pi-remote-relay/src/store/artifact-store.ts` for immutable artifact identity, sanitized bytes, digest/ETag, range reads, retention, expiry, and revocation purge.
- Add `apps/pi-remote-relay/src/store/artifact-sanitizer.ts` for text/code bounds, raster re-encoding, PDF destructive sanitization, safe thumbnails, constant redaction markers, and fail-closed withheld decisions.
- Change `apps/pi-remote-relay/src/store/relay-store.ts` and add the next numbered up/down migration under `apps/pi-remote-relay/migrations/` for artifact metadata and bytes. The migration must not expose host paths or raw source payloads.
- Change `apps/pi-remote-relay/src/http/server.ts` to add an authenticated exact-tuple artifact read endpoint, range/ETag handling, bounded artifact rate limiting, no-store headers, and network-only behavior while preserving POST-only behavior for all existing command routes.
- Change `apps/pi-remote-relay/src/auth/policy.ts` to authorize a dedicated `artifact:read` action and keep unknown actions denied.
- Add relay tests under `apps/pi-remote-relay/tests/` for immutable storage, sanitizer fixtures, exact revision reads, range consistency, auth/Origin/principal checks, missing/expired/revoked states, and negative path/secret controls.

### Web

- Change `apps/pi-remote-web/src/App.tsx` to mount the provider outside `TranscriptList`, replace the current `file_diff` body with `ArtifactCard`, and preserve the existing virtualized transcript behavior.
- Add `apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx`, `ArtifactCard.tsx`, `ArtifactViewerHost.tsx`, `ArtifactHeader.tsx`, `ArtifactStatus.tsx`, `PreviewControls.tsx`, `useArtifactHistory.ts`, and `useArtifactResource.ts`.
- Add typed renderers under `apps/pi-remote-web/src/artifacts/`: `DiffPreview.tsx`, `TextPreview.tsx`, `MarkdownPreview.tsx`, `CodePreview.tsx`, `ImagePreview.tsx`, `PdfPreview.tsx`, and `UnsupportedPreview.tsx`.
- Change `apps/pi-remote-web/src/relay.ts`, `state.ts`, `cache.ts`, and `demo.ts` for descriptor parsing, exact artifact reads, deterministic fixtures, cache stripping, and safe unavailable states.
- Change `apps/pi-remote-web/src/style.css`, `apps/pi-remote-web/index.html`, `apps/pi-remote-web/src/main.tsx`, and `apps/pi-remote-web/public/service-worker.js` for safe areas, modal/renderer styling, theme/reduced-motion/reflow behavior, and explicit artifact network-only exclusion.
- Add web tests under `apps/pi-remote-web/tests/` for card semantics, modal/history, all state fixtures, renderer behavior, race/abort cleanup, copy/share, accessibility, and cache/service-worker boundaries.
- Add or update the pinned PDF.js dependency and worker bundling in `apps/pi-remote-web/package.json`, `package-lock.json`, and `apps/pi-remote-web/vite.config.ts` only when the PDF phase begins.

### Verification and device dependencies

- Add a deterministic fixture path to `apps/pi-remote-web/src/demo.ts` and a CDP runner such as `scripts/file-preview-cdp.mjs`. The runner must set DevTools Protocol device metrics to a real 390 CSS-pixel width, exercise a fixture, assert the expected state, and capture light and dark screenshots without committing generated images.
- The release gate uses `npm run typecheck`, `npm test`, `npm run test:web`, and the CDP runner. Physical-device checks use an installed iPhone PWA in Safari and standalone mode, including VoiceOver, edge-back, landscape, offline relay loss, bfcache, reduced motion, RTL, 200% text, and the oldest supported iOS.

## Acceptance criteria

| Check                                                                  | Pass condition                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Protocol guard test in `packages/pi-rpc-protocol/tests/guards.test.ts` | A valid `FilePreviewBlock` passes; unknown keys, absolute paths, invalid opaque IDs/revisions, non-SHA-256 digests, invalid MIME/renderer combinations, unbounded text, and malformed content modes fail closed. Existing transcript block fixtures remain valid.                                                                                                |
| Relay artifact-store test                                              | Publishing the same `{ session, artifactId, revision }` twice is idempotent only when digest and sanitized bytes match; a differing payload for the same identity is rejected. Stored bytes and metadata are the sanitized representation.                                                                                                                       |
| Relay HTTP/security test                                               | The artifact route requires the authenticated application session, correct Origin and principal, exact session/artifact/revision tuple, and `artifact:read`; it rejects missing revision, `latest`, cross-session identity, expired/revoked authorization, path input, mutation tickets, and unknown body fields. It cannot invoke Pi or mutate workspace state. |
| Relay header/range test                                                | Full and PDF range responses return `private, no-store, max-age=0`, `nosniff`, same-origin resource policy, the exact revision, and the same digest/ETag. A changed revision or ETag is rejected and produces `revision-conflict`.                                                                                                                               |
| Redaction fixture test                                                 | A fixture secret/path marker is absent from descriptor metadata, stored bytes, DOM text, accessibility snapshot, clipboard, Share payload, thumbnail, logs, Cache Storage, and local storage.                                                                                                                                                                    |
| Web card DOM test in `apps/pi-remote-web/tests/`                       | A diff or file preview is one 44px-target button with a safe accessible name, never auto-opens, shows safe metadata only, and has no nested action buttons. Diff preview retains received `+`/`−` lines and never requests a path.                                                                                                                               |
| Viewer DOM test                                                        | Opening a card mounts one labelled React Aria dialog outside the virtualized transcript, makes the background inert, focuses the visible safe heading, traps Tab, exposes Close, and renders a deterministic diff, text, code, image, PDF, unsupported, withheld, too-large, or explicit error state rather than a dead surface.                                 |
| State fixture test                                                     | Every state in the lifecycle/content table is rendered with the exact user-facing message class and only the listed actions. `aborted` has no error UI; `revoked` removes content; `stale` leaves the current revision untouched until `View latest`.                                                                                                            |
| Async race test                                                        | Opening artifact B while A is delayed can never render A under B’s title. Closing or replacing during fetch, stream, image decode, PDF render, highlighting, or Share preparation causes no late state update and leaves no object URL, worker, canvas, or buffer leak.                                                                                          |
| Revision test                                                          | Opening revision 7 and receiving revision 8 leaves revision 7’s content, selection, scroll, and Share bytes unchanged until the user chooses `View latest`; the replacement occurs only after exact authorization, metadata, size, and digest checks plus a valid first render.                                                                                  |
| History/focus test and device step                                     | Close, browser Back, iOS edge-back, Escape, and VoiceOver two-finger scrub return to the same session and restore the exact chat scroll offset and originating-card focus, with the containing message/transcript fallback when virtualized.                                                                                                                     |
| Renderer test                                                          | Text/code/diff use real selectable DOM content; line numbers are excluded from selection; Markdown has no raw HTML/remote navigation; unknown code language falls back to readable plain text; unsafe PDF has no text layer; safe PDF exposes labelled pages and logical text.                                                                                   |
| Share/copy test                                                        | Copy and Share use the frozen displayed revision only. Binary Share is enabled only after exact-byte preparation and `canShare({ files })`; partial/truncated content confirms sanitized export; cancelled Share produces no error; no shareable URL contains session, ticket, path, filename, digest, or revision tokens.                                       |
| Cache/service-worker test                                              | Artifact URLs, response bodies, thumbnails, and buffers are absent from Cache Storage, `localStorage`, IndexedDB, and persisted transcript DTOs after open, close, reload, logout, and service-worker fetch. The artifact route is network-only.                                                                                                                 |
| Limits test                                                            | Image, PDF, text, code, chunk, page, canvas, worker, and Share budgets produce `too-large` or `unsupported` before unsafe allocation. Repeated large-PDF open/close cycles do not monotonically increase live canvases, workers, buffers, or blob URLs.                                                                                                          |
| CDP screenshot check                                                   | The fixture runner uses DevTools Protocol device metrics at exactly 390 CSS pixels, not a merely narrow desktop window, and captures a stable card/open/close flow in both light and dark themes with no horizontal overflow, clipped safe-area controls, or contrast regression.                                                                                |
| Accessibility/manual device check                                      | On the oldest supported iPhone, installed-PWA Safari passes VoiceOver dismissal, native selection, 44×44 targets, reduced motion, landscape, 200% text enlargement, 320px reflow, RTL isolation, and keyboard fallback where available.                                                                                                                          |
| Final build gate                                                       | `npm run typecheck`, `npm test`, `npm run test:web`, the CDP light/dark checks, and the relevant production build all exit 0 with no generated artifacts or source changes outside the two implementation areas and their tests.                                                                                                                                 |
