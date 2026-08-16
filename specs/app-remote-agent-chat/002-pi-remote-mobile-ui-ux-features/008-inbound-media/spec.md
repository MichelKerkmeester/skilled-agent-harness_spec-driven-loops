<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# F8 — Inbound Media Preview

One-line summary: Show relay-sanitized screenshots and raster images from pi as metadata-only transcript blocks with a contained inline preview and an exact-revision fullscreen viewer.

## DECISION

Build inbound_image as a promoted, metadata-only transcript block backed by the shared F6 artifact store and fullscreen viewer. Pi or an approved host extension publishes bytes through a separate, one-use-ticketed and revision-checked binary lane; the relay fully decodes, redacts, re-encodes, hashes, and stores bounded JPEG/PNG variants before the PWA may fetch them. The transcript renders a large contained preview outside collapsible tool details and opens the exact immutable revision in the shared React Aria viewer. Reads are authenticated and read-only; publication is capability-bound. V1 excludes Share, Save, Copy Image, galleries, external URLs, persistent browser media caches, and automatic re-submission to pi.

The fixed ink-on-parchment system, WCAG AA target, light/dark themes, and read-only-by-default security posture remain unchanged. The feature is disabled when the pinned pi integration cannot intercept image-bearing output before stdout or session persistence.

## Problem and goal

### Problem

Pi Remote currently has no inbound image content block. The protocol carries text, thinking, plan, tool call, tool result, file diff, and usage blocks, but no raw image can be delivered from pi to the phone. The existing F5 media lane is phone-to-pi only and cannot be repurposed for inbound content.

Raising the 1 MiB pi JSONL, 64 KiB sync-frame, or 16 KiB HTTP-JSON limits would move unbounded or unsanitized bytes into transports and durable state. Rendering a pi-provided path, URL, filename, Markdown image, or base64 value would also turn a read-only transcript into an ambient file or network client.

### Goal

Let pi surface a screenshot or still raster image into the transcript so an operator can inspect it inline and, when explicitly requested, in a fullscreen viewer. The result must be useful at an iPhone width while preserving:

- metadata-only durable transcript state;
- destructive, fail-closed redaction before persistence and delivery;
- separate ticketed publication and authenticated exact-revision reads;
- host and extension authority over which sources may publish;
- no mutation, shell, filesystem, network, or pi invocation from viewing actions;
- bounded memory, no-store delivery, and immediate cleanup on privacy events.

## Current state

- The protocol transcript union has no inbound image kind.
- Pi RPC output is strict LF-delimited JSONL and is not an acceptable binary transport.
- Sync frames and HTTP JSON have fixed small limits and must remain unchanged.
- The relay projects redacted transcript metadata but has no inbound-media publication route or artifact read route.
- The web transcript is virtualized. Routine tool activity is rendered in a collapsible disclosure, so a promoted image cannot be nested inside a successful tool result.
- The browser cache and service worker are designed for shell and read-only transcript state, not artifact bytes.
- F5 defines the authoritative phone-to-pi upload flow. F8 must not create an alternate upload, attachment, or prompt-submission path.
- F6 supplies the shared artifact-store and viewer contract. F8 consumes that infrastructure and must not fork an inbound-only lightbox or persistent image cache.

## Desired end state

When an approved host integration advertises inbound media, pi output can create a sibling inbound_image block at the correct transcript position. The relay:

1. consumes a one-use artifact:publish ticket before reading bytes;
2. inserts a safe processing block;
3. streams the bounded source into an isolated quarantine;
4. validates, decodes, redacts, re-encodes, hashes, and stores only bounded derivatives;
5. atomically changes the same block to ready or withheld at the expected transcript revision;
6. deletes source and intermediate buffers.

The PWA receives only safe metadata in the transcript. Near the viewport it performs an authenticated exact-tuple read for a sanitized thumbnail, verifies length, digest, ETag, and image decode, and then paints a contained preview. Tapping, pressing Enter, or pressing Space opens the frozen artifact revision in the shared React Aria viewer. The viewer supports accessible zoom and pan alternatives, never provides export actions, and purges pixels on close, revocation, session change, logout, backgrounding, or privacy cover.

## Scope

### In scope for v1

- New sibling transcript kind inbound_image with schema version 1.
- Tool-result, assistant-output, and approved-extension source labels.
- Pi/host publication before stdout or durable pi session persistence.
- One-use, exact-context publication tickets and expected-revision compare-and-swap.
- JPEG, PNG, and static WebP inbound sources only.
- A maximum of four images per turn with a maximum 30 MiB source batch.
- Relay-side decode, orientation, 8-bit sRGB conversion, metadata removal, OCR/secret detection, opaque burned-in redaction, derivative encoding, digesting, and bounded retention.
- A metadata-only processing, ready, withheld, expired, revoked, and failure lifecycle.
- A thumbnail variant and a full variant in the F6 artifact store.
- Authenticated POST /api/artifacts/read with session, artifact ID, artifact revision, and variant.
- A bounded in-memory external image store with reference-counted object URLs.
- A contained inline card outside collapsible tool details.
- A shared fullscreen viewer with focus containment, history handling, contain-fit, zoom, pan, details, and privacy covering.
- Light and dark ink-on-parchment styling, safe-area handling, reduced-motion behavior, internationalized metadata, and WCAG AA semantics.
- Test fixtures, negative security controls, a true 390 CSS-pixel CDP runner, and manual Safari/installed-PWA device verification.

### Out of scope: v1 non-goals

- Any image bytes in pi stdout, pi JSONL, sync WebSocket frames, transcript JSON, SQLite durable transcript fields, browser HTTP JSON, logs, analytics, crash reports, or workspace paths.
- SVG, animated GIF, APNG, animated WebP, HEIC/HEIF, AVIF, PDF, TIFF, BMP, ICO, RAW, audio, video, archives, or arbitrary files.
- Model-provided URLs, Markdown image references, filesystem paths, filenames as authority, arbitrary repository reads, symlink following, or host-file mounts.
- Share, Save, Copy Image, download, Photos-library export, public links, external image URLs, native long-press image callouts, and automatic re-submission to pi.
- A carousel, contact sheet, gallery, horizontal paging, image history, or cross-device media replay.
- Browser Cache Storage, IndexedDB, OPFS, localStorage, persistent query state, or embedded thumbnails for inbound artifacts.
- A new F5 attachment type. Inbound artifact IDs are never valid F5 attachment IDs.
- Automatic capture authorization from the PWA. The host or extension remains authoritative over capture and publication.
- Claims that OCR and pixel redaction prove that a screenshot is secret-free or safe from screen capture.

## Protocol and durable-state contract

### Block identity and placement

InboundImageBlock extends the existing transcript block base of opaque block ID, numeric transcript revision, sequence number, and occurrence time. Its artifact revision is a separate opaque string. A processing-to-ready or processing-to-withheld transition increments the existing numeric block revision while preserving the block ID, sequence position, and transcript placement.

Inbound images are siblings of tool rows, not nested tool_result parts:

- Tool-origin images appear immediately after their owning tool row and outside its collapsible details.
- Assistant-origin images retain assistant stream order.
- Two to four images stack vertically with a 12px gap.
- Assistant actions render once at the end of the turn, after any inbound image siblings.
- An old client that does not know inbound_image displays its existing unsupported/redacted row; it never silently drops the block.

### Exact block shapes

Every inbound image has these exact common keys:

| Field         | Allowed value                               |
| ------------- | ------------------------------------------- |
| kind          | inbound_image                               |
| schemaVersion | 1                                           |
| mediaClass    | screenshot, raster, or generated            |
| displayName   | Screenshot or Image from pi                 |
| source        | tool_result, assistant_output, or extension |

The processing shape has only the common keys plus availability: processing. It contains no artifact, dimensions, digest, URL, path, or pixel hint.

The ready shape adds exactly:

| Field                        | Allowed value                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| availability                 | ready                                                                                          |
| artifact.id                  | Opaque, non-digest-derived ID containing at least 128 bits of cryptographic randomness         |
| artifact.revision            | Immutable opaque string                                                                        |
| artifact.expiresAt           | ISO timestamp                                                                                  |
| artifact.full                | digest, image/png or image/jpeg mediaType, width, height, byteLength                           |
| artifact.thumbnail           | digest, image/png or image/jpeg mediaType, width, height, byteLength                           |
| presentation.safeAlt         | NFC-normalized, control-free plain text, at most 240 Unicode scalar values and 512 UTF-8 bytes |
| presentation.safeDescription | Optional independently bounded and redacted plain text, at most 1,000 characters               |
| redaction.status             | not-needed or applied                                                                          |
| shareAllowed                 | false                                                                                          |
| content                      | artifact-ref                                                                                   |

The terminal shape has availability withheld, expired, or revoked and adds exactly:

| Field        | Allowed value                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| reason       | capture-permission, unsupported-type, too-large, invalid-image, redaction-unavailable, policy, or retention |
| shareAllowed | false                                                                                                       |
| content      | none                                                                                                        |

Strict exact-key guards reject unknown fields, missing fields, malformed state/content combinations, malformed opaque IDs, invalid digests, unsupported MIME types, out-of-range dimensions, invalid timestamps, unsafe text, and shareAllowed true. Durable state never contains pixels, base64, data/blob/signed URLs, source MIME claims, EXIF/XMP/ICC data, OCR text, redaction matches, tickets, decoder errors, provider payloads, raw paths, filenames, hostnames, or reusable URLs.

Abandoned processing blocks finalize as withheld after 60 seconds. Artifact bytes expire after 24 hours or on session revocation/closure, whichever comes first; the durable record then becomes expired and never falls back to an original or a path.

## Publication and storage contract

### Publication boundary

The publisher must be an in-process pi adapter or approved host extension that observes image-bearing output before it can reach pi stdout, session persistence, or the relay transcript projector. The adapter:

1. Detects an image-bearing tool result or assistant output.
2. Requests a one-use artifact:publish ticket bound to principal, host extension, session, run, turn, block ID, submission ID, expected transcript revision, declared byte length, declared media family, and a 90-second start deadline.
3. Streams the bytes to an extension-only loopback binary route. The route consumes the ticket atomically before reading the body and creates the safe processing block.
4. Requires a fresh ticket after interruption; deletes partial bodies.
5. Resolves a local file only through a capability handle created by the approved extension in its own quarantine directory. It never interprets Markdown paths, accepts repository paths, follows symlinks, or sends a path to the relay.
6. Lets the relay sanitize and commit derivatives through an expected-revision compare-and-swap.
7. On conflict, deletes staged artifacts and emits no reordered block.
8. On policy rejection or scanner failure, finalizes the existing block as withheld and suppresses raw decoder, path, and matcher details.

The binary publication route is not exposed to ordinary PWA browser code. A concrete implementation may name the two extension-only operations as:

- POST /api/extension/artifacts/publish-ticket for the bounded declaration and ticket request;
- POST /api/extension/artifacts/publish for the ticketed binary body.

The route names are internal; the binding, one-use consumption, extension authentication, and fail-closed behavior are normative. The existing pi JSONL, sync, and HTTP-JSON ceilings must not be raised.

If the pinned cli-pi 0.95/0.20 integration cannot intercept the content before stdout or session persistence, the host advertises no inbound-media capability and the relay does not accept a publication. A UI-only fallback, raised transport limit, path chip, or base64 detour is prohibited.

### Sanitization limits

| Constraint               |                                                                         Required value |
| ------------------------ | -------------------------------------------------------------------------------------: |
| Accepted source formats  |                                                                 JPEG, PNG, static WebP |
| Rejected formats         | GIF, APNG, animated WebP, SVG, HEIC/HEIF, AVIF, PDF, TIFF, BMP, ICO, RAW, audio, video |
| Maximum images per turn  |                                                                                      4 |
| Maximum source size      |                                                                       15 MiB per image |
| Maximum source batch     |                                                                                 30 MiB |
| Maximum source edge      |                                                                              12,000 px |
| Maximum decoded area     |                                                                                  60 MP |
| Maximum channels/frames  |                                                         4 channels and exactly 1 frame |
| Concurrent sanitizations |                                                                          2 per session |
| Worker deadline          |                                           5 seconds per image and 15 seconds per batch |
| Full rendition           |                     JPEG/PNG, 8-bit sRGB, longest edge at most 2,000 px, at most 2 MiB |
| Full renditions per turn |                                                                          At most 8 MiB |
| Thumbnail                |                                           Longest edge at most 640 px, at most 256 KiB |
| Artifact retention       |                                                 24 hours or session revocation/closure |
| Session artifact quota   |                                                              50 MiB of sanitized bytes |

### Mandatory sanitization order

1. Enforce the encoded byte ceiling while streaming.
2. Validate magic bytes and decoder-detected format; ignore claimed MIME and extension.
3. Decode in an unprivileged, network-disabled, resource-limited worker.
4. Reject truncation, decoder warnings, multiple frames, excessive dimensions, decompression bombs, and unsupported color/channel models.
5. Apply orientation to pixels and convert to 8-bit sRGB.
6. Reconstruct from decoded pixels, stripping EXIF, GPS, IPTC, XMP, ICC payloads, comments, filenames, embedded thumbnails, trailing bytes, depth maps, and Live Photo associations.
7. Apply source-provided exclusion masks from approved capture adapters.
8. Run OCR-based secret/path detection for authorization headers, bearer/basic credentials, PEM keys, configured token prefixes, JWT-shaped strings, cookies/session assignments, .env secret/password/token values, credential-bearing URLs, home-directory usernames, and configured tailnet identifiers.
9. Burn confirmed masks into the raster as opaque carbon rectangles expanded by six pixels. Blur, transparency, CSS overlays, and pixelation do not count as redaction.
10. If scanning is unavailable, a probable match cannot be confidently localized, or redaction rendering fails, discard all variants and publish withheld.
11. Generate every thumbnail from the sanitized master, never from the source.
12. Preserve transparency as PNG only when it fits the limit. Otherwise encode JPEG at quality 88 and reduce quality/dimensions deterministically until bounded; reject rather than emit an unreadable result.
13. Hash final encoded variants and delete source/intermediate buffers.

The UI says Processed or Redactions applied, never Safe. Redaction state is a processing fact, not a guarantee that the image contains no sensitive content.

## Artifact read path

The shared F6 read contract is:

| Request property | Required value                           |
| ---------------- | ---------------------------------------- |
| Method and path  | POST /api/artifacts/read                 |
| Content type     | application/json                         |
| Body fields      | sessionId, artifactId, revision, variant |
| variant          | thumbnail or full                        |
| Authority        | exact session/artifact/revision tuple    |

The read is authenticated and read-only. It checks application session, Origin, principal, enrolled device, foreground/session membership, session identity, artifact:read authorization, exact artifact ID, and exact immutable revision. It issues and consumes no mutation ticket and cannot invoke pi or change workspace state.

The route rejects latest, paths, URLs, digests supplied as authority, cross-session IDs, redirects, and unknown body fields. It returns:

| Condition                       |               Status |
| ------------------------------- | -------------------: |
| Unknown or not-authorized tuple |                  404 |
| Revision conflict               |                  409 |
| Expired or revoked content      |                  410 |
| Rate limit                      | 429 with Retry-After |

Each device/session is limited to 60 thumbnail reads and 30 full reads per five minutes, with at most two thumbnail requests and one full request concurrently. Successful responses include:

- Content-Type image/png or image/jpeg;
- Content-Length;
- Content-Digest with the final variant SHA-256;
- an immutable ETag;
- Content-Disposition attachment with a generic filename such as pi-preview.png;
- Cache-Control private, no-store, max-age=0;
- X-Content-Type-Options nosniff;
- Cross-Origin-Resource-Policy same-origin;
- Referrer-Policy no-referrer.

The browser fetches with same-origin credentials, cache no-store, redirect rejection, and an AbortSignal. It checks Content-Length before allocation, counts streamed bytes, compares transcript digest with ETag and Content-Digest, computes local WebCrypto SHA-256, requires HTMLImageElement.decode to resolve, and only then creates a typed Blob and object URL. The memory-only external store retains at most 20 thumbnails and one full image. Object URLs are reference-counted and revoked on last release, unmount, viewer close, revision change, privacy cover, logout, session switch, revocation, and backgrounding.

The service worker treats /api/artifacts/ as network-only and removes any legacy artifact cache during activation. Artifact bytes and URLs never enter Cache Storage, IndexedDB, localStorage, query persistence, analytics, crash reports, or browser history.

## User-facing behavior

### Inline placement and card

At a 390 CSS-pixel iPhone viewport:

- Transcript gutters are 16px and the card uses the full assistant-column width.
- The surface uses the existing surface token, a 1px line, a 16px radius, and no shadow.
- The identity row is at least 44px high with 12px inline padding.
- The title uses Inter at 15/20 semibold: Screenshot or Image from pi.
- Metadata uses Inter at 12/16 and exposes only Processed, revision number, Redactions applied, or a terminal state. Dimensions, byte length, digests, IDs, and redaction counts appear only in authenticated Details.
- The image well reserves the sanitized aspect ratio, fills the card width, clamps height between 180px and 240px, uses object-fit contain, and never crops a diagnostic screenshot.
- The well uses canvas-subtle in light mode and the established dark parchment/near-carbon token in dark mode. Alpha PNGs may use a quiet checkerboard.
- A ready card is one React Aria Button with aria-haspopup dialog and onPress. It has no nested interactive controls. Its inner thumbnail has alt empty; the button owns the functional accessible name.
- Processing, withheld, expired, and failed cards preserve the same footprint. No native broken-image glyph or filename is shown.
- Activation occurs on release and is cancelled if movement exceeds 10px so transcript scrolling wins.
- There is no long-press action or native image callout.

Tool-origin cards remain visible when the owning tool disclosure collapses. New media never moves focus or forces scroll. If the reader is away from the live edge, announce an aggregate N new images from pi rather than each image individually.

### Complete UI state model

Every state has a stable footprint and safe copy. The listed actions are the only actions exposed in that state.

| State               | Presentation                                                           | Actions and transition                                               |
| ------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| processing          | Reserved 16:10 parchment well; Preparing preview…                      | None; relay finalizes within 60 seconds                              |
| deferred            | Ready metadata and static well; offscreen bytes are not fetched        | Near two viewport heights triggers thumbnail fetch                   |
| thumbnail-fetching  | Static placeholder with aria-busy true                                 | Close details only; one transient automatic retry                    |
| thumbnail-verifying | Same geometry; no bytes painted                                        | Successful digest checks move to decoding; mismatch moves to corrupt |
| decoding            | Same geometry; no bytes painted                                        | Successful decode moves to inline-ready; failure moves to corrupt    |
| inline-ready        | Verified contained thumbnail                                           | Tap, Enter, or Space opens viewer                                    |
| opening             | Fullscreen shell and safe heading appear immediately                   | Close remains available                                              |
| full-fetching       | Verified thumbnail remains fitted; Opening preview…                    | Success moves to viewer-ready; 15 seconds moves to stalled           |
| viewer-ready        | Verified full rendition with zoom enabled                              | Viewer controls, Details, and Close                                  |
| details-open        | Authenticated safe metadata in the viewer Details surface              | Close Details or Close viewer; never exposes raw metadata            |
| full-degraded       | Verified thumbnail labelled Low-resolution preview                     | Retry full read or Close                                             |
| stalled             | Still waiting for the Pi relay.                                        | Retry or Cancel/Close                                                |
| offline-loaded      | Already verified foreground pixels remain; Offline copy                | Close; backgrounding purges pixels                                   |
| offline-unavailable | This preview isn’t available while the relay is unreachable.           | Manual Retry                                                         |
| capture-permission  | Screenshot not shared — capture access is off on the host.             | Host setup help only                                                 |
| withheld            | Preview withheld by relay policy. No aspect, size, or pixels are shown | Close or safe Details only                                           |
| denied              | Preview not permitted for this session.                                | Reauthenticate only after 401; do not loop after 403                 |
| expired             | Stable tombstone: This preview has expired.                            | Close                                                                |
| missing             | This revision is no longer available.                                  | Resync transcript; never substitute latest                           |
| revision-conflict   | This revision is no longer available.                                  | Resync transcript; never substitute latest                           |
| corrupt             | This image couldn’t be verified. Zero pixels are painted               | Report or one explicit retry after metadata resync                   |
| rate-limited        | Safe copy based on Retry-After                                         | Retry when enabled                                                   |
| stale               | Frozen revision remains; A newer preview is available.                 | Explicit View latest or Close                                        |
| revoked             | Opaque privacy cover; buffers and URLs are removed immediately         | Close                                                                |
| unsupported         | This client can’t display this image block.                            | None                                                                 |
| privacy-covered     | Opaque carbon/bone curtain after backgrounding                         | Foreground plus explicit reveal triggers a fresh read                |
| closing             | Exit transition; interaction is disabled                               | Restore scroll and focus                                             |
| aborted             | Silent request cancellation from close or replacement                  | None; no error UI                                                    |

Retry policy is bounded: one automatic network/5xx retry for a visible card after 750ms, then manual retry only; one silent session refresh for 401; no loop for 403, 410, redaction failure, or digest failure; 409 aborts and retrieves the authoritative transcript snapshot; 429 honors Retry-After. navigator.onLine changes wording only; the request and relay heartbeat decide availability. Normal later revisions do not replace an open frozen image. Security revocation or privacy supersession covers and purges the old revision immediately.

### Fullscreen viewer

The viewer reuses the shared F6 React Aria ModalOverlay, Modal, and Dialog shell:

- Tap, Enter, or Space opens the exact card revision.
- Opening blurs the composer, pushes one history child under the session, freezes artifact ID, artifact revision, and digest, and preserves transcript scroll.
- Focus is contained in the dialog. The visible safe heading is focused first, followed by Close, status actions, zoom controls, pan controls, and the image region.
- Close, Escape, browser Back, iOS edge-back, and VoiceOver dismiss close the viewer. Backdrop dismissal, custom swipe-down, horizontal paging, pinch-to-close, auto-open, and long-press menus are absent.
- Initial zoom is contain-fit with no upscale beyond native size. Pinch zooms through 4x. Double-tap toggles fit and 2x around the tap point.
- One-finger pan is enabled only above fit and clamps to image bounds.
- Visible 44px controls provide Zoom out, Fit, and Zoom in. While zoomed, a Move image popover supplies four 44px directional buttons; arrow keys perform the same movement.
- Keyboard shortcuts are plus/equal for zoom in, minus for zoom out, zero for fit, arrows for 40px pan, Shift plus arrows for 120px pan, and Escape for close.
- Viewer chrome remains visible on opaque carbon header/footer surfaces and never overlays arbitrary pixels.
- Close restores focus to the originating card; if virtualized away, focus returns to the owning turn and then the transcript region.
- Details exposes only the immutable safe metadata tuple, dimensions, bounded sizes, revision, processing state, and redaction status. It does not expose source claims, OCR text, paths, filenames, IDs not already safe for the authenticated view, or raw decoder details.

### Accessibility, internationalization, and motion

- Inline accessible name: Open screenshot preview, processed, revision 3. Include only relay-supplied safe semantic context.
- The inner thumbnail is decorative and is not announced twice.
- Viewer img uses safeAlt, with fallback Image preview from pi; description not provided.
- safeDescription is behind a Show description disclosure inside the dialog, never a second modal or giant aria-describedby.
- Use one throttled polite status region for user-initiated loading and zoom changes, one nonrepeating alert for revocation/denial/corruption, and the aggregate new-image announcement when away from the live edge.
- Every target is at least 44px. Focus uses carbon on parchment and bone on carbon; clay is never the sole focus or status signal.
- Use rem, unitless line height, wrapping metadata, logical CSS properties, dir auto for captions, bdi dir ltr for revision and MIME tokens, and Intl for numbers, sizes, dates, and plurals. Pixels and physical pan coordinates do not mirror in RTL.
- Support 100–200% text scale, 320px width, portrait/landscape, increased contrast, reduced motion, VoiceOver, Switch Control, Voice Control, and hardware keyboard fallback.
- Card first paint is opacity 0 to 1 over 120ms; press feedback is a border/background change and .985 scale over 90–120ms; viewer entry is overlay opacity plus translateY 8px to 0 over 220ms; exit is 180ms; thumbnail-to-full crossfade is 100ms after verification and decode.
- With prefers-reduced-motion reduce, remove translation, scale, snap, and shared-element motion; use opacity only for at most 100ms or switch instantly.
- Use viewport-fit cover, visual-viewport variables, 100dvh with 100svh fallback, safe-area padding, overscroll-behavior contain, and touch-action none only on the active zoom surface.

## Security and redaction requirements

### Read-only and ticketed posture

- Opening, zooming, panning, retrying a read, viewing Details, and closing are read operations. They cannot invoke pi, write the workspace, change runtime mode, or mint a mutation ticket.
- artifact:read is authorized in Plan mode because it only reads a relay-sanitized immutable revision.
- Publication, transcript insertion, cancellation, and any future phone-to-pi submission use distinct one-use tickets or server-internal expected-revision compare-and-swap transitions. A replay, expiry, wrong action, wrong origin, wrong principal, wrong device, wrong session, or stale revision fails closed.
- The host extension, not the PWA, decides which tools and capture adapters may publish. Plan mode remains host-enforced. Capturing a new host screenshot is controlled egress and must be separately allowed by host policy.
- Inbound pixels are never automatically passed back to pi, the model, F5, or a later prompt. V1 has no Send this preview to pi action.
- The F5 lane remains authoritative if a future product adds re-send: it must copy the already-sanitized revision into a new attachment set and repeat attachment:reserve, binary upload, and prompt:submit tickets.

### Untrusted content and redaction

- Pixels, captions, alt text, descriptions, display names, status copy, error reasons, OCR output, visible instructions, QR codes, links, and prompt-like text inside an image are untrusted content. They cannot authorize filesystem, shell, process, network, approval, mode, or capture changes.
- Redaction occurs before durable transcript publication, artifact storage, broadcast, browser decode, or derivative generation. Captions, alt text, descriptions, notifications, logs, and transcript fields use bounded allowlist projection and canonical text redaction.
- Pixel masks are opaque carbon rectangles burned into the encoded raster before hashing. Both thumbnail and full variant derive from the same sanitized master.
- Scanner failure, timeout, uncertain localization, decode failure, unsupported type, resource exhaustion, and redaction-rendering failure publish withheld and delete all raw/intermediate data.
- Raw and sanitized files use random names outside repository, webroot, transcript database, backup set, and pi-readable workspace. Directories are 0700 and objects are 0600.

### Browser, network, and lifecycle isolation

- Artifact reads use authenticated POST and exact body fields. IDs, revisions, digests, tickets, and session secrets never enter a shareable URL, Referer, browser history, or image src.
- Production CSP includes at least default-src self, img-src self blob:, connect-src self, object-src none, frame-src none, and base-uri none, merged with the existing script/style nonce or hash policy. data: and arbitrary HTTPS image sources are not added.
- Artifact responses are private and no-store. The service worker is network-only for the artifact route and strips legacy artifact caches on activation.
- The browser retains only near-viewport thumbnails and one full image in memory. It aborts work and revokes object URLs on close, unmount, revision change, session switch, logout, revocation, backgrounding, pagehide, and privacy cover.
- visibilitychange and pagehide synchronously show an opaque curtain, abort full reads, revoke URLs, and clear decoded buffers. Foreground reveal requires a fresh exact-revision read.
- Revocation wins races by invalidating pending request generations and covering visible pixels immediately. Snapshot reconciliation repairs missed revocations after reconnect.
- Push payloads remain content-free. Logs contain only safe reason code, media count, coarse size bucket, and latency bucket. They omit bodies, paths, names, captions, OCR, matches, tickets, IDs, digests, decoder exceptions, and URLs.
- Retention is bounded at 24 hours, session revocation/closure, or quota eviction. The transcript keeps an expired tombstone and never exposes an original.

### Residual risks

OCR can miss secrets; an operator can photograph or screen-record the display; WebKit may snapshot a foreground frame; and a compromised same-origin application can access bytes already authorized to it. The feature must not be marketed as DRM or guaranteed secret removal. Best-effort PWA privacy covering reduces exposure but cannot guarantee App Switcher protection on every iOS release.

## Acceptance criteria

Each criterion names the evidence that must be collected. A criterion passes only when the stated check exits successfully or the stated device step is observed; visual resemblance alone is not evidence.

| Check                           | Evidence                                                                                 | Pass condition                                                                                                                                                                                                                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Protocol shape and strict guard | Protocol unit test in packages/pi-rpc-protocol/tests/guards.test.ts                      | Valid processing, ready, withheld, expired, and revoked blocks pass. Unknown keys, paths, filenames, URLs, base64, OCR, invalid IDs, invalid digests, unsupported MIME, unsafe text, shareAllowed true, and inconsistent availability/content pairs fail closed. Existing transcript fixtures remain valid.     |
| Upstream transport isolation    | Publisher/relay integration test with stdout, JSONL, sync, transcript, and session spies | No source or derivative image byte, base64 value, data/blob URL, or binary body crosses pi stdout, pi JSONL, sync WebSocket, transcript JSON, or durable pi session state.                                                                                                                                      |
| Pinned publisher capability     | cli-pi 0.95/0.20 host integration test and manual host setup step                        | The approved adapter intercepts image-bearing output before stdout/session persistence. If interception is unavailable, capability advertisement and publication are disabled and no transport limit is raised.                                                                                                 |
| Publish ticket binding          | Relay security test                                                                      | Replayed, expired, wrong-origin, wrong-principal, wrong-device, wrong-session, wrong-action, wrong-source, wrong-length, wrong-media-family, or stale-revision tickets create no artifact and no transcript update.                                                                                             |
| Atomic processing block         | Relay store/projector test                                                               | Ticket consumption and processing insertion happen before body read; interrupted bodies are deleted; processing resolves to ready or withheld without changing block ID or sequence.                                                                                                                            |
| Input type handling             | Sanitizer fixture test                                                                   | JPEG, PNG, and static WebP pass. SVG, animation, HEIC, AVIF, PDF, polyglots, spoofed MIME, truncation, malformed metadata, and decoder-warning fixtures become withheld with no retrievable pixels.                                                                                                             |
| Boundary limits                 | Sanitizer and quota tests                                                                | Exact boundary tests cover 15 MiB/image, 30 MiB/batch, 60 MP, 12,000px edge, four images, two workers, 2 MiB/full, 256 KiB/thumbnail, 8 MiB/turn, 50 MiB/session, and worker deadlines.                                                                                                                         |
| Metadata removal                | Sanitized-byte fixture test                                                              | Final bytes contain no EXIF, GPS, IPTC, XMP, ICC, comments, filenames, embedded thumbnails, depth maps, Live Photo associations, or trailing payloads.                                                                                                                                                          |
| Pixel redaction                 | Full and thumbnail fixture test                                                          | Seeded authorization headers, bearer/basic credentials, PEM keys, token prefixes, JWT-shaped strings, cookies, .env secrets, credential URLs, usernames, and configured tailnet identifiers are absent from both encoded variants behind opaque expanded masks.                                                 |
| Fail-closed scanning            | Sanitizer fault-injection test                                                           | Scanner unavailable, timeout, unlocalizable probable match, mask-render failure, decode failure, and quota exhaustion produce withheld and zero retrievable renditions.                                                                                                                                         |
| Revision conflict cleanup       | Relay CAS and filesystem test                                                            | A late revision N completion after N+1 is discarded; staged files and partial bodies are deleted; no orphan artifact or reordered block remains.                                                                                                                                                                |
| Exact read authorization        | Relay HTTP/auth test                                                                     | Reads require application session, Origin, principal, enrolled device, session membership, artifact:read, and exact session/artifact/revision. The route rejects latest, paths, URLs, cross-session tuples, unknown fields, redirects, and mutation tickets. It cannot invoke pi or mutate workspace state.     |
| Read response integrity         | Relay header test and web resource unit test                                             | Full and thumbnail responses carry no-store, nosniff, same-origin resource policy, Content-Length, digest, and immutable ETag. Flipping one served byte prevents object-URL creation and renders corrupt with zero painted pixels.                                                                              |
| Browser cache hygiene           | Service-worker and browser-storage test                                                  | Artifact URLs and response bodies are absent from Cache Storage, IndexedDB, localStorage, query persistence, persisted transcript DTOs, analytics, crash output, and browser history after open, close, reload, logout, and service-worker fetch.                                                               |
| Memory cleanup                  | Web race test with 50 open/close/background cycles                                       | No full-image URL, thumbnail URL, decoded bitmap, buffer, worker, or aborted request remains live after release. Strict Mode does not duplicate fetches or revoke shared URLs early.                                                                                                                            |
| Transcript placement            | Web DOM test                                                                             | Tool-origin image appears immediately after its tool row and outside the disclosure; assistant-origin image preserves stream order; two to four images stack with 12px gaps; assistant actions render once at turn end.                                                                                         |
| Collapse persistence            | Web DOM assertion                                                                        | Collapsing the owning tool disclosure leaves the inbound image card visible and operable.                                                                                                                                                                                                                       |
| Inline card semantics           | Web DOM test                                                                             | Ready card is one 44px-target React Aria button with the safe accessible name, aria-haspopup dialog, decorative inner thumbnail, no nested interactive controls, reserved aspect ratio, contain fit, and no filename or digest in the card.                                                                     |
| State fixture coverage          | Web DOM test for every state in the state table                                          | Each state renders its specified copy, geometry, aria-busy or alert behavior, and only its listed actions. Aborted has no error UI; withheld has no pixels or aspect metadata; revoked purges content; stale does not replace the frozen revision.                                                              |
| Viewer shell and history        | Web DOM test plus manual iOS Back step                                                   | One labelled dialog mounts outside the virtualized transcript, makes background chat inert, focuses the safe heading, traps focus, pushes one history child, preserves exact scroll, and restores focus to the card or owning turn on Close, Escape, Back, edge-back, or VoiceOver dismiss.                     |
| Viewer interaction              | Web DOM and pointer/keyboard test                                                        | Tap, Enter, and Space open; scroll-over-card does not. Contain fit, pinch through 4x, double-tap 2x, bounded one-finger pan, visible 44px zoom controls, Move image directional buttons, keyboard zoom/pan, and no swipe-dismissal or paging all behave as specified.                                           |
| Revision and async races        | Web integration test with delayed A/B reads and revocation                               | Opening B cannot render A under B’s title. Close, replacement, revocation, session switch, and backgrounding prevent late state commits and invalidate all old generations. A later normal revision remains stale until View latest.                                                                            |
| Accessibility and reflow        | Automated DOM/contrast assertions plus manual device step                                | No duplicate image announcement; safe alt/description behavior is correct; focus ring and status signals are independently contrast-safe; all targets are at least 44px; VoiceOver, Switch Control, Voice Control, hardware keyboard, 320px width, 200% text, increased contrast, RTL, and reduced motion pass. |
| True mobile screenshots         | CDP runner using Emulation.setDeviceMetricsOverride at exactly 390 CSS px                | Light and dark screenshots show inline card, loading/terminal states, and viewer without horizontal overflow, cropped contained pixels, obscured Close control, or unsafe clay-on-bone text/boundary/focus usage. The runner does not substitute a narrow desktop window.                                       |
| Privacy lifecycle               | Web lifecycle test plus manual background/foreground step                                | visibilitychange and pagehide cover the UI, abort full reads, revoke URLs, clear decoded buffers, and require an exact fresh read on reveal. Revocation covers pixels immediately.                                                                                                                              |
| No inbound re-send              | Protocol/relay negative test and web DOM assertion                                       | No F8 control produces F5 attachment IDs, prompt tickets, pi commands, base64 in browser HTTP, or a Send this preview to pi action.                                                                                                                                                                             |
| Plan-mode and capture policy    | Host extension test and manual policy step                                               | artifact:read remains available in Plan mode; new capture/publication is allowed only by the approved host policy; the phone cannot turn capture or publication on.                                                                                                                                             |
| Retention and resume            | Relay expiry/revocation test and reload device step                                      | After expiry, revocation, session close, or quota eviction the transcript shows an expired/revoked tombstone. Kill/reopen resolves the same exact revision or expired; it never fetches latest or becomes a path/file chip.                                                                                     |
| Release gate                    | Root typecheck, tests, web tests, CDP light/dark run, and production build               | All commands exit 0, screenshots are written outside the repository, and the diff contains no generated artifact, persistent media fixture, or source change outside the approved implementation areas.                                                                                                         |

## Dependencies and affected areas

### Shared prerequisites

- F6 artifact storage and React Aria fullscreen viewer must be available as shared infrastructure. If F6 is not yet implemented, F8 may complete that shared foundation in the viewer phase, but it must remain generic and reusable.
- The pinned cli-pi 0.95/0.20 pass must expose an approved pre-stdout interception seam. Without it, F8 remains disabled.
- A security owner must approve the source allowlist, capture adapters, OCR detectors, confidence thresholds, uncertain-match policy, retention defaults, decoder dependency, and Plan-mode capture semantics.
- The supported iOS/WebKit baseline and oldest physical iPhone must be fixed before final gesture and memory signoff.

### Protocol

- Change packages/pi-rpc-protocol/src/types.ts to add InboundImageBlock, artifact variants, safe presentation metadata, redaction state, and terminal reasons without changing existing F5 ImageContent semantics.
- Change packages/pi-rpc-protocol/src/guards.ts to add strict exact-key validation for the block, artifact descriptor, digest, timestamps, safe text, dimensions, media type, availability, and content union.
- Change packages/pi-rpc-protocol/src/index.ts to export the new type and guard.
- Extend packages/pi-rpc-protocol/tests/guards.test.ts with valid lifecycle fixtures, malformed-field fixtures, old-client compatibility fixtures, path/base64/URL rejection, digest checks, and size/text bounds.

### Relay and host integration

- Add apps/pi-remote-relay/src/store/artifact-store.ts for immutable artifact identity, sanitized bytes, variant digest/ETag, bounded retention, expiry, quota, and revocation purge.
- Add apps/pi-remote-relay/src/store/artifact-sanitizer.ts for streaming limits, decoder isolation, raster reconstruction, redaction masks, thumbnail derivation, deterministic output bounds, and fail-closed results.
- Change apps/pi-remote-relay/src/store/relay-store.ts, apps/pi-remote-relay/src/store/transcript-projector.ts, and the next numbered migration under apps/pi-remote-relay/migrations/ for processing/ready/withheld metadata and atomic revision settlement. Raw source bytes and paths must not enter the migration.
- Change apps/pi-remote-relay/src/auth/policy.ts and apps/pi-remote-relay/src/auth/auth-service.ts to authorize artifact:publish and artifact:read separately, bind publication tickets to their exact context, and keep unknown actions denied.
- Change apps/pi-remote-relay/src/http/server.ts to add extension-only ticketed publication and the authenticated POST /api/artifacts/read route with exact tuple, status, rate-limit, no-store, and integrity headers.
- Change apps/pi-remote-relay/src/auth/rate-limit.ts for thumbnail/full read budgets and concurrent request limits.
- Add a host adapter at extensions/pi-remote-inbound-media/src/index.ts, its package and tsconfig, and tests. It must use capability handles, allowlisted sources, host policy, and the pre-stdout seam; it must not turn paths or model text into reads.
- Review extensions/pi-remote-plan/src/index.ts and apps/pi-remote-relay/src/policy/mutation-policy.ts so Plan mode remains host-enforced and inbound reads do not accidentally authorize capture or workspace mutation.
- Extend apps/pi-remote-relay/tests/ with artifact store, sanitizer fixtures, publication ticket, CAS, retention, exact-read, auth/Origin/principal, rate-limit, revocation, and negative path/secret tests. Add host publisher tests under extensions/pi-remote-inbound-media/tests/.
- Do not modify the existing F5 prompt/upload transport except where shared auth or artifact primitives are reused. Inbound artifact IDs remain invalid F5 attachment IDs.

### Web

- Change apps/pi-remote-web/src/state.ts and apps/pi-remote-web/src/App.tsx to parse and render InboundImageBlock without dropping it, while preserving virtualized transcript behavior and tool-disclosure boundaries.
- Add reusable components under apps/pi-remote-web/src/artifacts/: InboundImageBlockView.tsx, InboundImageCard.tsx, ImagePlaceholder.tsx, VerifiedImage.tsx, ImageStatus.tsx, ArtifactDetails.tsx, and the shared ArtifactViewerProvider.tsx, ArtifactViewerHost.tsx, ArtifactHeader.tsx, PreviewControls.tsx, useArtifactHistory.ts, and useArtifactResource.ts where F6 has not already supplied them.
- Change apps/pi-remote-web/src/relay.ts for exact artifact reads, abort/error mapping, digest verification, and no-store behavior.
- Change apps/pi-remote-web/src/cache.ts so transcript caching strips all artifact bytes, URLs, and non-durable resource state.
- Change apps/pi-remote-web/src/demo.ts and add deterministic in-memory lifecycle fixtures for every UI state without committing image bytes.
- Change apps/pi-remote-web/src/style.css, apps/pi-remote-web/src/main.tsx, apps/pi-remote-web/index.html, and apps/pi-remote-web/public/service-worker.js for modal layering, safe areas, theme/reduced-motion/reflow rules, CSP, and network-only artifact handling.
- Add web tests under apps/pi-remote-web/tests/ for card DOM, state fixtures, exact reads, race/abort cleanup, modal history/focus, zoom/pan controls, service-worker/cache hygiene, contrast, and accessibility.
- Add scripts/inbound-media-cdp.mjs. It must set CDP device metrics to a true 390 CSS-pixel width, exercise deterministic fixtures, assert state and overflow, and capture light and dark screenshots outside the repository.

### Verification and device

The release verification set is npm run typecheck, npm test, npm run test:web, the inbound-media CDP light/dark runner, and the relevant production build. Physical-device verification covers Safari and installed-PWA standalone mode, VoiceOver, edge-back, background privacy, landscape, offline relay loss, bfcache, reduced motion, RTL, 200% text, 320px reflow, and the oldest supported iOS device.
