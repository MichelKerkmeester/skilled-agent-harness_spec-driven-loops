# F6 — Implementation phases

The feature is delivered in four dependency-ordered slices. Each slice is independently deployable and leaves a useful, explicit product state behind. No phase adds editing, host handoff, live filesystem reads, a session gallery, revision comparison, active-content execution, or other v1 non-goals.

Every phase has the same release discipline: typecheck, the relevant unit/integration tests, and a true 390 CSS-pixel CDP screenshot in both light and dark themes. The CDP runner must set DevTools Protocol device metrics—not merely open a desktop browser window narrowed to 390px—and must assert the expected fixture state before capturing the screenshot. Generated screenshots belong in a temporary directory, not the repository.

## Phase 1 — Openable redacted diff foundation

### Objective

Ship the first useful slice: the existing redacted `file_diff` becomes a compact, deliberate card that opens a full-screen, history-backed, read-only diff viewer. This phase proves the iPhone shell, modal behavior, scroll/focus restoration, and race-safe viewer ownership without inventing a complete file or adding a filesystem read.

### Scope

- Existing `FileDiffBlock` only; no new complete-file source is assumed.
- One shared viewer provider and modal shell mounted outside the virtualized transcript.
- Diff renderer, safe card metadata, history dismissal, keyboard/VoiceOver dismissal, light/dark styling, safe areas, and deterministic demo fixtures.
- No relay endpoint, artifact bytes, share export, image decode, or PDF renderer.

### Concrete tasks

- Add `apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx` to own one active preview, originating trigger, frozen diff source, generation counter, scroll restoration, focus restoration, and cleanup.
- Add `apps/pi-remote-web/src/artifacts/ArtifactCard.tsx`, `ArtifactViewerHost.tsx`, `ArtifactHeader.tsx`, `ArtifactStatus.tsx`, `PreviewControls.tsx`, `useArtifactHistory.ts`, and `DiffPreview.tsx`. The diff source is the exact received `FileDiffBlock`; its opaque block ID is only an in-memory/history identity and never becomes a host path or artifact read request.
- Change `apps/pi-remote-web/src/App.tsx` so `ArtifactViewerProvider` is outside `TranscriptList`, `Block` renders `file_diff` through `ArtifactCard`, and the whole card is one React Aria `Button` with no nested controls.
- Change `apps/pi-remote-web/src/style.css` and `apps/pi-remote-web/index.html` for card dimensions, type glyph/peek lines, full-screen modal chrome, `viewport-fit=cover`, visual viewport fallback, safe-area padding, focus rings, reduced motion, and no horizontal overflow at 390px.
- Extend `apps/pi-remote-web/src/demo.ts` with a deterministic diff-open fixture and close/back states. Keep the demo double-gated and tab-local.
- Add `apps/pi-remote-web/tests/ArtifactCard.test.tsx`, `ArtifactViewer.test.tsx`, and `artifact-history.test.ts` for button semantics, no auto-open, modal focus trap, exact patch rendering, close behavior, race-safe replacement, and focus/scroll restoration.
- Add `scripts/file-preview-cdp.mjs` as the reusable CDP fixture runner. It must set width 390 CSS pixels, exercise the deterministic demo, assert the dialog and Close button, check horizontal overflow, and capture light and dark images to a temporary output directory.

### Verification gate

Run all of the following before shipping the phase:

```text
npm run typecheck
npm run test:web
node scripts/file-preview-cdp.mjs --fixture diff --viewport-width 390 --theme light --output <temporary-directory>/file-preview-light.png
node scripts/file-preview-cdp.mjs --fixture diff --viewport-width 390 --theme dark --output <temporary-directory>/file-preview-dark.png
```

The two CDP runs must exit 0, report exactly 390 CSS-pixel width, and produce stable screenshots with no clipped header, safe-area control, or horizontal scroll. Inspect both images at the gate.

### Acceptance

- Existing diff cards remain compact in the transcript and do not auto-open.
- Pressing a card opens one full-screen labelled dialog with the first safe heading focused; the six-line inline peek remains noninteractive.
- The viewer displays the exact received patch, retains visible `+`/`−` prefixes, and makes no `fetch`, WebSocket, path, or tool request when opened.
- Close, Escape, browser Back, iOS edge-back, and VoiceOver scrub return to the same session and restore chat scroll/focus.
- Opening a second diff or closing during the first open transition cannot commit stale state from the first source.
- Light and dark 390px screenshots meet the locked visual system and show no horizontal overflow.

This phase does not cross the mutation posture because it only exposes data already present in the redacted transcript. It still requires a negative security test proving that opening a diff never turns its summary, patch, or headers into a filesystem request.

## Phase 2 — Relay-authorized immutable artifact contract

### Objective

Make complete-file preview possible without weakening the boundary: add the protocol descriptor, publish immutable sanitized snapshots in the relay, and let the web request one exact authenticated revision. The phase is shippable even when a source is unavailable: the card opens `withheld`, `missing`, `unsupported`, or another explicit metadata state instead of showing a dead surface.

### Scope

- `FilePreviewBlock` protocol type and strict guard.
- Relay artifact metadata/bytes store, sanitizer boundary, digest/ETag, retention/expiry/revocation, and exact-tuple read endpoint.
- Relay projection from an explicit allowlisted snapshot source only; existing diff projection remains intact.
- Web descriptor parsing, exact-resource client boundary, safe demo fixtures, cache stripping, and service-worker exclusion.
- No browser-side arbitrary path read, no `latest` request, and no binary renderer requirement yet.

### Concrete tasks

- Change `packages/pi-rpc-protocol/src/types.ts`, `guards.ts`, and `index.ts` to add the `FilePreviewBlock` union member and exports. Preserve the string artifact revision exactly; do not overload the numeric revision of existing block kinds.
- Extend `packages/pi-rpc-protocol/tests/guards.test.ts` with valid descriptor, inline-text, artifact-ref, none, unknown-field, path-bearing, digest, bounds, and renderer/redaction/completeness cases.
- Add `apps/pi-remote-relay/src/store/artifact-store.ts` for immutable `(session, artifactId, revision)` rows, sanitized bytes, SHA-256 digest, ETag, byte length, range reads, retention, expiry, and purge. Use the existing SQLite handle/transaction boundary.
- Add `apps/pi-remote-relay/src/store/artifact-sanitizer.ts` with an allowlisted metadata projection and fail-closed result. It must produce safe display name, MIME, renderer, redaction/completeness, export policy, optional safe thumbnail reference, and no host path. Text/code bounds are implemented here; image/PDF sanitizer capabilities may return `withheld` until Phase 4.
- Add the next numbered artifact migration pair under `apps/pi-remote-relay/migrations/` and change `apps/pi-remote-relay/src/store/relay-store.ts` to initialize, retain, read, and purge artifact records without exposing raw source data through transcript pages.
- Change `apps/pi-remote-relay/src/store/transcript-projector.ts` and `apps/pi-remote-relay/src/index.ts` to accept only an explicit relay-allowlisted snapshot payload. If the event/tool result contains no approved snapshot, emit no guessed artifact and leave the existing diff behavior unchanged.
- Change `apps/pi-remote-relay/src/auth/policy.ts` and `apps/pi-remote-relay/src/http/server.ts` to add `artifact:read`, authenticate the exact session/artifact/revision tuple, reject `latest` and path input, enforce rate/size limits, support consistent PDF ranges, and return no-store/nosniff/same-origin headers. Keep the route read-only and ticket-free.
- Add relay tests `apps/pi-remote-relay/tests/artifact-store.test.ts`, `artifact-sanitizer.test.ts`, and `artifact-http.test.ts`, plus negative cases in `tests/security/negative-controls.test.ts` and redaction regressions in `tests/redaction.test.ts`.
- Change `apps/pi-remote-web/src/relay.ts` to validate descriptor JSON and provide a direct exact-revision artifact read that validates status, headers, content type, revision, ETag, byte budget, and digest. Do not route binary bodies through the existing JSON helper.
- Change `apps/pi-remote-web/src/state.ts`, `cache.ts`, `App.tsx`, and `demo.ts` so `FilePreviewBlock` cards use the Phase 1 viewer, persisted transcript data strips inline bodies and artifact references that could retain payloads, and the demo can show ready metadata, withheld, missing, denied, and unsupported fixtures without contacting a relay.
- Change `apps/pi-remote-web/public/service-worker.js` and add a browser test that artifact requests are always network-only and never enter Cache Storage.

### Verification gate

Run all of the following before shipping the phase:

```text
npm run typecheck
npm test
npm run test:web
node scripts/file-preview-cdp.mjs --fixture artifact-states --viewport-width 390 --theme light --output <temporary-directory>/file-preview-light.png
node scripts/file-preview-cdp.mjs --fixture artifact-states --viewport-width 390 --theme dark --output <temporary-directory>/file-preview-dark.png
```

The relay tests must cover exact tuple ownership, immutable digest identity, range consistency, redaction, revocation, expiry, and negative path/secret controls. The CDP runner must assert at least one ready metadata card and one explicit withheld/unsupported state at exactly 390 CSS pixels in both themes.

### Acceptance

- A valid descriptor is accepted by protocol guards and appears in a transcript without any host path or assistant-authored identity.
- The relay stores only sanitized bytes and metadata, publishes a digest/ETag, and rejects identity reuse with different bytes.
- An exact authenticated artifact read succeeds; a cross-session, wrong-revision, `latest`, path-bearing, unauthenticated, expired, or revoked request fails with a redacted state and no body disclosure.
- A missing or unavailable source always produces `withheld`, `missing`, or `unsupported`, never a client-inferred read or a blank/dead card.
- Artifact bodies and URLs are absent from local storage, Cache Storage, the persisted transcript cache, and the service worker cache after fixture open/close/reload.
- Phase 1 diff behavior, focus/history behavior, and light/dark 390px screenshots remain green.

This phase crosses the security posture and requires explicit review of `artifact-sanitizer.ts`, `artifact-store.ts`, `http/server.ts`, `auth/policy.ts`, migration retention/deletion, and the negative controls before deployment. It introduces a new disclosure route but no mutation authority.

## Phase 3 — Text, Markdown, code, and controlled export

### Objective

Deliver the most useful complete-file readers—text and code—along with a strict Markdown specialization, race-safe resource lifecycle, native selection, copy, and policy-gated Share. This phase makes the viewer useful for ordinary source files while keeping all content bounded, inert, and tied to one frozen revision.

### Scope

- Exact-revision `useArtifactResource` lifecycle with abort, generation, header/body validation, digest verification, and object-URL cleanup.
- Text, Markdown, code, and diff renderers under the shared shell.
- Explicit loading, stalled, ready, empty, whitespace-only, partial-redaction, truncated, stale, offline, denied, expired, missing, conflict, corrupt, rate-limited, relay-error, revoked, aborted, and exiting states for text-like content.
- Native selection, Find, Copy, and policy/capability-gated Share; no download or public URL.

### Concrete tasks

- Add or complete `apps/pi-remote-web/src/artifacts/useArtifactResource.ts` with one `AbortController` per request, a monotonically increasing generation, exact artifact ID/revision/ETag checks, body validation, digest verification, 15-second stall timer, heartbeat-aware offline result, and cleanup of buffers/object URLs.
- Add `apps/pi-remote-web/src/artifacts/TextPreview.tsx`, `MarkdownPreview.tsx`, `CodePreview.tsx`, and `UnsupportedPreview.tsx`. Use real DOM text, explicit accessible chunks above the ordinary DOM budget, strict Markdown AST rendering, no raw HTML/remote images/frames/executable links, plain first-paint code, and a lazy highlighter worker that can fail without blocking reading.
- Complete `apps/pi-remote-web/src/artifacts/DiffPreview.tsx` so the same controls and selection/copy rules apply without reconstructing a complete file.
- Change `apps/pi-remote-web/src/artifacts/ArtifactViewerHost.tsx`, `ArtifactHeader.tsx`, `ArtifactStatus.tsx`, and `PreviewControls.tsx` to keep shell chrome responsive while renderer loading suspends, announce only through the shared status/alert regions, and implement stale `View latest` as an explicit exact-revision request.
- Add `apps/pi-remote-web/src/artifacts/artifact-share.ts` for `navigator.share`/`navigator.canShare` behavior. Text/code/diff share directly from the press event; binary preparation is represented but remains disabled until Phase 4. Require confirmation for partial-redaction/truncated exports and treat `AbortError` as normal.
- Change `apps/pi-remote-web/src/relay.ts` to expose the relay heartbeat/result needed to distinguish offline from browser `navigator.onLine`, and to reject raw server diagnostics before they reach the UI.
- Change `apps/pi-remote-web/src/cache.ts` to persist only bounded transcript descriptors/metadata and never resource bodies, prepared Files, object URLs, or share buffers. Revalidate exact revision after `pageshow`/bfcache restoration.
- Change `apps/pi-remote-web/src/style.css` for Source Serif text, carbon code surface, selection colors, horizontal code scrolling, Wrap/Find controls, line-number exclusion, 200% header reflow, RTL isolation, AA contrast, reduced motion, and 320/390px reflow.
- Add `apps/pi-remote-web/tests/useArtifactResource.test.ts`, `TextPreview.test.tsx`, `CodePreview.test.tsx`, `MarkdownPreview.test.tsx`, `artifact-share.test.ts`, and race/cleanup cases in `ArtifactViewer.test.tsx`.
- Add relay fixtures for empty, whitespace-only, excerpt/truncated, partial-redaction, digest mismatch, and stale revision responses in `apps/pi-remote-relay/tests/`.

### Verification gate

Run all of the following before shipping the phase:

```text
npm run typecheck
npm test
npm run test:web
node scripts/file-preview-cdp.mjs --fixture text-code-share --viewport-width 390 --theme light --output <temporary-directory>/file-preview-light.png
node scripts/file-preview-cdp.mjs --fixture text-code-share --viewport-width 390 --theme dark --output <temporary-directory>/file-preview-dark.png
```

The web tests must include delayed A/B resources, close-during-fetch, digest mismatch, abort cleanup, stale replacement, native selection/copy, share cancellation, and cache absence. The CDP runs must assert a selectable text/code view, usable controls, no horizontal overflow outside code content, and stable light/dark screenshots at exactly 390 CSS pixels.

### Acceptance

- Text, Markdown, code, and diff render the exact received bytes of the frozen revision; Markdown never executes raw HTML or navigates externally.
- Code is readable before highlighting completes; highlighting failure leaves plain text available. Line numbers are not selectable or copyable.
- Text/code/diff selection, Find, Wrap where applicable, Copy, and keyboard alternatives work without stealing native long-press or horizontal pan behavior.
- A/B resource races cannot place one artifact’s content under another artifact’s title, revision, or Share action.
- Closing, revoking, expiring, or replacing a resource removes all late async commits, object URLs, workers, buffers, and DOM payloads as required by state.
- Share is visible only when `shareAllowed` and capability permit it, exports only the displayed revision, confirms redaction/truncation, never mints a URL, and treats user cancellation as a no-op.
- Empty, whitespace-only, partial-redaction, truncated, stale, offline, denied, expired, missing, conflict, too-large, corrupt, rate-limited, relay-error, revoked, aborted, and exiting fixtures have explicit tested UI behavior.

This phase crosses the disclosure posture because it adds Copy and Share. A privacy/security review must verify that both actions use the frozen sanitized buffer, that confirmation text does not reveal redacted values, and that no URL or second unqualified fetch can export data.

## Phase 4 — Image/PDF renderers and device release hardening

### Objective

Complete the typed renderer set with sanitized raster images and controlled PDF.js rendering, then close the cross-cutting accessibility, memory, offline, revocation, service-worker, and physical-device gates. This is the release phase for the full PARTIAL feature; deferred editing/gallery/host capabilities remain excluded.

### Scope

- Relay-safe raster publication, thumbnails, PDF destructive sanitization, safe text-layer decision, and bounded range source.
- Native image preview with bounded decode/zoom/pan and visible alternatives.
- Lazy PDF.js worker, bounded pages/canvases, adjacent-page rendering, page controls, safe search/selection, and revision-consistent ranges.
- Share of exact sanitized image/PDF Files only after preparation and `canShare({ files })`.
- Final implementation of all state transitions, revocation, bfcache, PWA safe areas, a11y/i18n, memory budgets, and release evidence.

### Concrete tasks

- Complete `apps/pi-remote-relay/src/store/artifact-sanitizer.ts` for raster decode/re-encode and PDF destructive sanitization. Strip metadata/profiles/active payloads, bound dimensions and bytes, derive thumbnails only from sanitized output, set `textLayerSafe` only on a verified safe layer, and return `withheld` when assurance is unavailable.
- Complete `apps/pi-remote-relay/src/store/artifact-store.ts` and `apps/pi-remote-relay/src/http/server.ts` for bounded range responses, three-page/canvas resource budgets, digest/ETag consistency, expiry, revocation purge, and no-store headers.
- Add the pinned PDF.js dependency and worker configuration in `apps/pi-remote-web/package.json`, `package-lock.json`, and `apps/pi-remote-web/vite.config.ts`. Do not expose a native iframe or uncontrolled browser PDF navigation as the primary path.
- Add `apps/pi-remote-web/src/artifacts/ImagePreview.tsx` with sanitized in-memory Blob handling, intrinsic-size rules, 1×–4× zoom, fit/double-tap behavior, carbon stage, pan ownership, visible Zoom out/Fit/Zoom in controls, and decode/limit failure states.
- Add `apps/pi-remote-web/src/artifacts/PdfPreview.tsx` with lazy worker loading, visible plus adjacent pages, continuous vertical scrolling, page labels/indicator, Previous/Next, Fit width/zoom controls, safe text-layer/search gating, consistent range validation, and bounded canvas disposal.
- Change `apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx`, `ArtifactViewerHost.tsx`, `useArtifactResource.ts`, and `artifact-share.ts` so revoke/expiry/close/visibility restoration aborts all binary work, purges all payloads, and only enables binary Share after exact bytes are prepared and `canShare` succeeds.
- Change `apps/pi-remote-web/src/App.tsx`, `state.ts`, `cache.ts`, `main.tsx`, `index.html`, `style.css`, and `public/service-worker.js` for `pageshow` revalidation, relay-heartbeat offline states, no artifact persistence, safe-area fallback, background/revocation behavior, 320px/200%/RTL/reduced-motion behavior, and consistent status/alert announcements.
- Add `apps/pi-remote-web/tests/ImagePreview.test.tsx`, `PdfPreview.test.tsx`, `artifact-memory.test.ts`, and final state/a11y/cache regressions. Add relay PDF/image sanitizer fixtures, unsafe-text-layer cases, range mismatch cases, and redaction tests.
- Update `scripts/file-preview-cdp.mjs` and `apps/pi-remote-web/src/demo.ts` with deterministic image, safe PDF, unsafe PDF, too-large, corrupt, offline-loaded, and revision-conflict fixtures. Keep screenshot output temporary.
- Run installed-PWA physical-device verification on the oldest supported iOS in portrait and landscape, including VoiceOver two-finger scrub, edge-back, native text selection, app background/bfcache restoration, relay loss, revocation, reduced motion, RTL, 200% text, and memory/open-close repetition.

### Verification gate

Run all of the following before shipping the phase:

```text
npm run typecheck
npm test
npm run test:web
npm run build
node scripts/file-preview-cdp.mjs --fixture image-pdf-release --viewport-width 390 --theme light --output <temporary-directory>/file-preview-light.png
node scripts/file-preview-cdp.mjs --fixture image-pdf-release --viewport-width 390 --theme dark --output <temporary-directory>/file-preview-dark.png
```

The gate is incomplete until the CDP runner reports exactly 390 CSS-pixel width and both screenshots have been inspected for safe-area/header/action clipping, theme contrast, no horizontal overflow, and stable renderer layout. The physical-device checklist must pass on the oldest supported iPhone; a desktop screenshot cannot substitute for it.

### Acceptance

- Sanitized raster images render with bounded bytes/pixels/dimensions, safe thumbnails, no metadata disclosure, correct 1×–4× interaction, and visible non-gesture alternatives.
- Safe PDFs render with bounded pages/canvases, consistent ranges and ETags, page labels, controls, and safe selection/search. Unsafe or unverified PDFs never create a text layer and become an explicit safe state when sanitization cannot attest to safety.
- Image/PDF decode, worker, range, canvas, and Share failures map to `corrupt`, `too-large`, `revision-conflict`, `relay-error`, `offline-unavailable`, `unsupported`, or `withheld` as appropriate; no raw server/library diagnostic reaches the UI.
- All lifecycle and content states in the feature spec are reachable through deterministic fixtures and have the correct actions, announcements, cleanup, and retry behavior.
- Revocation immediately blanks payloads and stops network/renderer work. Repeatedly opening and closing large PDFs does not monotonically increase live canvases, workers, buffers, or blob URLs.
- Light/dark, portrait/landscape, 320px reflow, 390px CDP, 200% text, RTL, VoiceOver, reduced motion, Safari, and installed-PWA checks pass on the oldest supported iPhone.
- The final build contains no mutation command, host handoff, path-derived request, public artifact URL, service-worker artifact cache, or unreviewed binary fallback.

This phase crosses the security posture and requires final security/privacy review of binary sanitization, PDF text layers, thumbnail/alt-text derivation, range serving, binary Share, revocation, bfcache, and app-switcher exposure. The review must explicitly record any unsupported binary capability as `withheld` rather than approving a permissive fallback.
