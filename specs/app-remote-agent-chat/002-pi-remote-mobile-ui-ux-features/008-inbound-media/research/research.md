> **Deep research — external-CLI multi-executor run.** 15 independent iterations (5 × GPT 5.6 SOL high (--search, cli-codex), 5 × Grok 4.6 xhigh (cli-cursor), 5 × DeepSeek v4 Flash (opencode-go gateway)), no early convergence. Synthesis of all passes into one build-ready decision.
> **Provenance:** produced by external-CLI orchestration, NOT the `/deep:research` state-machine runtime — so runtime state artifacts (`deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, observability, deltas, lineages) are intentionally absent. See `PROVENANCE.md`.
> **Canonical:** this file (`research.md`) is the synthesized output; per-pass findings live in `iterations/iteration-NNN.md`.

---

# F8-inbound-media — Synthesis

## 1. Decision

Build `inbound_image` as a promoted, metadata-only transcript block backed by the existing F6 artifact store and fullscreen viewer. Pi or an approved host extension publishes bytes through a separate, one-use-ticketed and revision-checked binary lane; the relay fully decodes, redacts, re-encodes, hashes, and stores bounded JPEG/PNG variants before the PWA may fetch them. The transcript shows a large, contained inline preview that survives tool-card collapse, then opens the exact immutable revision in the shared React Aria fullscreen viewer—combining Claude’s restrained artifact chrome with Kimi’s transcript-native pixels (iter-01, iter-06, iter-09). Reads remain session-authenticated and read-only without mutation tickets; Share, Save, Copy Image, galleries, external URLs, persistent browser media caches, and automatic re-submission to pi are excluded from v1.

## 2. Build spec

### Architecture and component boundaries

```text
TranscriptTurn
├── ToolActivityDisclosure
├── InboundImageBlockView
│   ├── InboundImageCard
│   │   ├── ImagePlaceholder
│   │   ├── VerifiedImage
│   │   └── ImageStatus
│   └── ArtifactDetails
├── AssistantProse
└── AssistantActions

ArtifactViewerProvider
└── ArtifactViewer
    ├── ModalOverlay
    ├── Modal
    └── Dialog
        ├── ViewerHeader
        ├── ImageRenderer
        │   └── ZoomSurface
        ├── PanControls
        └── ViewerToolbar

ArtifactImageStore
├── useArtifactImage
├── bounded in-memory LRU
└── object-URL reference counting

PrivacyCurtain
```

- `InboundImageBlockView` is a sibling transcript kind, not a nested `tool_result` part. This guarantees an old client renders the existing unsupported/redacted row instead of silently dropping non-text content, and prevents successful tool-result collapse from hiding the screenshot (iter-06, iter-07, iter-09, iter-15).
- Tool-origin images appear immediately after their owning tool row but outside its collapsible details. Assistant-origin images retain stream order. Assistant actions render once at the end of the turn.
- Two to four images stack vertically with a 12px gap. There is no carousel, contact sheet, session gallery, or horizontal paging in v1.
- `ArtifactViewerProvider` is mounted outside the virtualized transcript and owns the frozen artifact tuple, history entry, scroll offset, focus restoration, request generation, privacy covering, and cleanup.
- Use a memory-only external store with `useSyncExternalStore` so React Strict Mode does not duplicate fetches or prematurely revoke shared object URLs. Retain at most 20 thumbnails and one full-resolution image.

### Protocol

The surrounding transcript base retains its existing numeric block revision. Artifact revision is a separate opaque string.

```ts
type InboundImageBlock =
  | {
      kind: 'inbound_image';
      schemaVersion: 1;
      availability: 'processing';
      mediaClass: 'screenshot' | 'raster' | 'generated';
      displayName: 'Screenshot' | 'Image from pi';
      source: 'tool_result' | 'assistant_output' | 'extension';
    }
  | {
      kind: 'inbound_image';
      schemaVersion: 1;
      availability: 'ready';
      mediaClass: 'screenshot' | 'raster' | 'generated';
      displayName: 'Screenshot' | 'Image from pi';
      source: 'tool_result' | 'assistant_output' | 'extension';
      artifact: {
        id: string;
        revision: string;
        expiresAt: string;
        full: {
          digest: string;
          mediaType: 'image/png' | 'image/jpeg';
          width: number;
          height: number;
          byteLength: number;
        };
        thumbnail: {
          digest: string;
          mediaType: 'image/png' | 'image/jpeg';
          width: number;
          height: number;
          byteLength: number;
        };
      };
      presentation: {
        safeAlt: string;
        safeDescription?: string;
      };
      redaction: {
        status: 'not-needed' | 'applied';
      };
      shareAllowed: false;
      content: { kind: 'artifact-ref' };
    }
  | {
      kind: 'inbound_image';
      schemaVersion: 1;
      availability: 'withheld' | 'expired' | 'revoked';
      mediaClass: 'screenshot' | 'raster' | 'generated';
      displayName: 'Screenshot' | 'Image from pi';
      reason:
        | 'capture-permission'
        | 'unsupported-type'
        | 'too-large'
        | 'invalid-image'
        | 'redaction-unavailable'
        | 'policy'
        | 'retention';
      shareAllowed: false;
      content: { kind: 'none' };
    };
```

Normative rules:

- Use strict exact-key guards. Reject unknown fields, malformed opaque IDs, invalid digests, unsupported MIME types, out-of-range dimensions, `shareAllowed: true`, and inconsistent availability/content combinations.
- `artifact.id` contains at least 128 bits of cryptographic randomness and is not digest-derived.
- `artifact.revision` is immutable. The same `{id, revision}` must always resolve to the same digest; never substitute `latest`.
- Digests cover the final sanitized encoded bytes, separately for thumbnail and full variants.
- `safeAlt` is plain text, NFC-normalized, control-character-free, at most 240 Unicode scalar values and 512 UTF-8 bytes.
- `safeDescription`, when present, is independently redacted plain text derived only from safe tool context or sanitized pixels, bounded to 1,000 characters. Raw OCR is never used as alt text.
- Durable state contains no pixels, base64, data/blob/signed URLs, paths, filenames, hostnames, source MIME claims, EXIF/XMP/ICC data, OCR text, redaction matches, tickets, decoder errors, or provider payloads.
- `processing` updates to `ready` or `withheld` by incrementing the existing transcript block revision while preserving its block ID and position. The relay finalizes abandoned processing blocks after 60 seconds.

### Pi-to-phone publication flow

Inbound bytes must bypass the 1 MiB pi JSONL, 64 KiB sync-frame, and 16 KiB HTTP-JSON ceilings (iter-06, iter-07, iter-15).

1. An in-process pi/tool adapter detects image-bearing tool output or assistant output before it reaches stdout or durable pi session data.
2. The adapter requests a one-use `artifact:publish` ticket bound to principal, host extension, session, run, turn, block ID, submission ID, expected transcript revision, declared byte length, declared media family, and a 90-second start deadline.
3. The relay atomically consumes the ticket before reading the body and inserts the safe `processing` block.
4. The adapter streams the binary body to an extension-only loopback route. Interrupted uploads require a fresh ticket; partial bodies are deleted.
5. If a tool produced a local file, the extension may resolve only a capability handle it created in its own artifact/quarantine directory. It must not interpret Markdown paths, accept arbitrary repository paths, follow symlinks, or send a path to the relay.
6. The relay sanitizes the image and creates thumbnail/full variants.
7. The relay commits variants, artifact metadata, and the `ready` block through an expected-revision compare-and-swap. On conflict, it deletes staged artifacts and emits no reordered block.
8. Policy rejection finalizes the existing block as `withheld`; raw decoder or path details are suppressed.
9. The source and intermediate buffers are deleted immediately after derivative commit.
10. If the deployed pi integration cannot intercept image content before stdout/session persistence, the capability remains disabled. Raising JSONL or WebSocket limits is not an acceptable fallback.

### Inbound limits and sanitization

| Constraint | Required value |
|---|---:|
| Accepted source formats | JPEG, PNG, static WebP |
| Rejected | GIF, APNG, animated WebP, SVG, HEIC/HEIF, AVIF, PDF, TIFF, BMP, ICO, RAW, audio, video |
| Maximum images per turn | 4 |
| Maximum source size | 15 MiB per image |
| Maximum source batch | 30 MiB |
| Maximum source edge | 12,000 px |
| Maximum decoded area | 60 MP |
| Maximum channels/frames | 4 channels, exactly 1 frame |
| Concurrent sanitizations | 2 per session |
| Worker deadline | 5 seconds per image, 15 seconds per batch |
| Full rendition | JPEG/PNG, 8-bit sRGB, longest edge ≤2,000 px, ≤2 MiB |
| Full renditions per turn | ≤8 MiB |
| Thumbnail | Longest edge ≤640 px, ≤256 KiB |
| Artifact retention | 24 hours or session revocation/closure, whichever comes first |
| Session artifact quota | 50 MiB sanitized bytes |

Sanitization order is mandatory:

1. Enforce the encoded byte ceiling while streaming.
2. Validate magic bytes and decoder-detected format; ignore the claimed MIME and extension.
3. Decode in an unprivileged, network-disabled, resource-limited worker.
4. Reject truncation, decoder warnings, multiple frames, excessive dimensions, decompression bombs, or unsupported color/channel models.
5. Apply orientation to pixels and convert to 8-bit sRGB.
6. Reconstruct from decoded pixels, stripping EXIF, GPS, IPTC, XMP, ICC payloads, comments, filenames, embedded thumbnails, trailing bytes, depth maps, and Live Photo associations.
7. Apply source-provided exclusion masks from approved capture adapters.
8. Run OCR-based secret/path detection for, at minimum, authorization headers, bearer/basic credentials, PEM keys, configured token prefixes, JWT-shaped strings, cookies/session assignments, `.env` secret/password/token values, credential-bearing URLs, home-directory usernames, and configured tailnet identifiers.
9. Burn confirmed masks into the raster as opaque carbon rectangles expanded by six pixels. Blur, transparency, CSS overlays, and pixelation are not redaction.
10. If scanning is unavailable, a probable match cannot be confidently localized, or redaction rendering fails, discard all variants and publish `withheld`.
11. Generate every thumbnail from the sanitized master, never the source.
12. Preserve transparency as PNG only when it fits the limit; otherwise encode JPEG at quality 88 and reduce quality/dimensions deterministically until bounded. Reject rather than emit an under-budget, unreadable result.
13. Hash final encoded variants and delete source/intermediate buffers.

The UI says `Processed` or `Redactions applied`, never `Safe`. Automated visual redaction reduces exposure but cannot prove the absence of content-level secrets.

### Artifact read path

Use the existing F6 read contract:

```http
POST /api/artifacts/read
Content-Type: application/json

{
  "sessionId": "…",
  "artifactId": "…",
  "revision": "…",
  "variant": "thumbnail | full"
}
```

- This is an authenticated read, not a mutation. It uses application-session, Origin, principal, enrolled-device, foreground/session, session-membership, `artifact:read`, and exact-tuple checks. It issues and consumes no mutation ticket and cannot invoke pi.
- Reject `latest`, paths, URLs, digests supplied as authority, cross-session IDs, redirects, and unknown fields.
- Use `404` for unknown/not-authorized tuples, `409` for revision conflict, `410` for expired/revoked content, and `429` with `Retry-After` for rate limiting.
- Limit each device/session to 60 thumbnail and 30 full reads per five minutes, with at most two thumbnail requests and one full request concurrently.
- Return:

```http
Content-Type: image/png
Content-Length: …
Content-Digest: sha-256=:…:
ETag: "…"
Content-Disposition: attachment; filename="pi-preview.png"
Cache-Control: private, no-store, max-age=0
X-Content-Type-Options: nosniff
Cross-Origin-Resource-Policy: same-origin
Referrer-Policy: no-referrer
```

Client sequence:

1. Fetch with `credentials: "same-origin"`, `cache: "no-store"`, an `AbortSignal`, and redirect rejection.
2. Enforce `Content-Length` before allocation and a streamed byte counter while reading.
3. Compare transcript digest, `ETag`/`Content-Digest`, and a local WebCrypto SHA-256 calculation.
4. Only after all values match, create a typed `Blob` and object URL.
5. Require `HTMLImageElement.decode()` to resolve before committing pixels to React state.
6. Revoke the URL on last-consumer release, card unmount, viewer close, revision change, privacy cover, logout, session switch, revocation, or backgrounding.
7. The service worker treats `/api/artifacts/**` as network-only and removes any legacy artifact cache during activation.
8. No artifact bytes enter Cache Storage, IndexedDB, localStorage, query persistence, analytics, crash reports, or browser history.

### Phone-to-pi upload and re-send boundary

F8 does not feed inbound pixels back into pi. If the operator later wants to submit an image, the existing F5 lane remains authoritative:

1. The browser holds selected `File` objects and preview object URLs in memory only.
2. Send hashes transfer bytes in a worker and reserves an attachment set under a one-use `attachment:reserve` ticket.
3. The relay returns one-use, revision-bound upload tickets; the browser performs at most two binary PUTs concurrently.
4. The relay quarantines and normalizes JPEG, PNG, WebP, HEIC, or HEIF sources under the F5 limits: four images, 15 MiB each, 30 MiB batch, 60 MP, 12,000px edge, normalized to JPEG/PNG at 2,000px and 2 MiB each.
5. A fresh `prompt:submit` ticket commits the ordered attachment IDs against the expected prompt revision.
6. Only the host-to-pi request may contain pixels:

```text
prompt | steer | follow_up
message: caption
images: [{ type: image, mimeType: image/jpeg|image/png, data: base64 }]
```

That base64 exists only in host memory while invoking pi. It must not enter browser HTTP JSON, sync traffic, SQLite, pi JSONL, logs, browser storage, or a workspace path.

Inbound artifact IDs are invalid as F5 attachment IDs. V1 provides no `Send this preview to pi` action; a future implementation must copy the already-sanitized revision into a new F5 attachment set and repeat the complete reserve/upload/submit ticket sequence.

### Inline card

At a 390px iPhone viewport:

- Use 16px transcript gutters and the full assistant-column width.
- Surface: `--surface`, 1px `--line`, 16px radius, no shadow.
- Identity row: minimum 44px, 12px inline padding.
- Title: Inter 15/20 semibold, `Screenshot` or `Image from pi`.
- Metadata: Inter 12/16, `Processed · revision 3`, `Redactions applied`, or a terminal state. Dimensions, byte length, digest, IDs, and redaction counts remain in the authenticated Details view.
- Image well: full width, reserved sanitized aspect ratio, height clamped between 180px and 240px; `object-fit: contain`; never crop diagnostic screenshots.
- Well background: `--canvas-subtle` in light mode and the dark parchment/near-carbon token in dark mode.
- Alpha PNGs may use a quiet checkerboard inside the well only.
- The whole ready card is one React Aria `Button` with `aria-haspopup="dialog"` and `onPress`. It contains no nested interactive controls.
- Inner thumbnail uses `alt=""`; the button owns the functional accessible name.
- Processing, withheld, expired, and failed cards preserve the same footprint. Never display a native broken-image glyph or filename.
- Card activation occurs on release and cancels if movement exceeds 10px so transcript scrolling wins.
- No long-press action or native image callout in v1.

### Complete state model

| State | Presentation | Actions and transitions |
|---|---|---|
| `processing` | Reserved 16:10 parchment well; `Preparing preview…` | None; relay finalizes within 60 seconds |
| `deferred` | Ready metadata, static well; offscreen bytes not fetched | Near two viewport heights → thumbnail fetch |
| `thumbnail-fetching` | Static placeholder, `aria-busy=true` | Close details only; one transient automatic retry |
| `thumbnail-verifying` / `decoding` | Same geometry; no bytes painted | Success → `inline-ready`; mismatch → `corrupt` |
| `inline-ready` | Verified contained thumbnail | Tap/Enter/Space → viewer |
| `opening` | Fullscreen shell and safe heading appear immediately | Close remains available |
| `full-fetching` | Verified thumbnail remains fitted; `Opening preview…` | Success → `viewer-ready`; 15 seconds → `stalled` |
| `viewer-ready` | Verified full rendition, zoom enabled | Viewer controls, Details, Close |
| `full-degraded` | Verified thumbnail labelled `Low-resolution preview` | Retry full read, Close |
| `stalled` | `Still waiting for the Pi relay.` | Retry, Cancel/Close |
| `offline-loaded` | Already verified foreground pixels remain; `Offline copy` | Close; purge on background |
| `offline-unavailable` | `This preview isn’t available while the relay is unreachable.` | Manual Retry |
| `capture-permission` | `Screenshot not shared — capture access is off on the host.` | Host setup help only |
| `withheld` | `Preview withheld by relay policy.`; no aspect, size, or pixels | Close/details only |
| `denied` | `Preview not permitted for this session.` | Reauthenticate only after `401`; no loop after `403` |
| `expired` | Stable tombstone: `This preview has expired.` | Close |
| `missing` / `revision-conflict` | `This revision is no longer available.` | Resync transcript; never substitute latest |
| `corrupt` | `This image couldn’t be verified.`; zero pixels | Report; one explicit retry only after metadata resync |
| `rate-limited` | Safe copy based on `Retry-After` | Retry when enabled |
| `stale` | Frozen revision remains; `A newer preview is available.` | Explicit `View latest`, Close |
| `revoked` | Opaque privacy cover; buffers and URLs removed immediately | Close |
| `unsupported` | `This client can’t display this image block.` | None |
| `privacy-covered` | Opaque carbon/bone curtain after backgrounding | Foreground + explicit reveal triggers a fresh read |
| `closing` / `aborted` | Exit transition or silent request cancellation | Restore scroll and focus |

Retry policy:

- Network/5xx: one automatic retry for a visible card after 750ms, then manual only.
- `401`: one silent session refresh; `403`, `410`, redaction failure, and digest failure never loop.
- `409`: abort and retrieve the authoritative transcript snapshot.
- `429`: honor `Retry-After`.
- `navigator.onLine` changes wording only; actual request and relay heartbeat determine availability.
- Normal later revisions do not replace an open frozen image. A security revocation or privacy supersession covers and purges the old revision immediately.

### Viewer interaction

The viewer reuses F6 without adding an inbound-only gesture dialect:

- Tap, Enter, or Space on the card opens it.
- Opening blurs the composer, pushes one history child under the session, freezes `{artifactId, revision, digest}`, and preserves transcript scroll.
- React Aria `ModalOverlay → Modal → Dialog` makes the chat inert and contains focus.
- Close, Escape, browser Back, iOS edge-back, and VoiceOver’s dismiss gesture close the viewer.
- There is no backdrop dismissal, custom swipe-down, horizontal paging, pinch-to-close, auto-open, or long-press menu in v1.
- Initial zoom is contain-fit with no automatic upscale beyond native size.
- Pinch zooms from fit through 4×.
- Double-tap toggles fit and 2× around the tap point.
- One-finger pan is enabled only above fit and clamps to image bounds.
- Visible 44×44 controls provide Zoom out, Fit, and Zoom in.
- While zoomed, a `Move image` popover supplies four 44×44 directional buttons as a non-drag alternative; arrow keys perform the same movement.
- Keyboard: `+`/`=` zoom in, `-` zoom out, `0` fit, arrows pan 40px, Shift+arrows pan 120px, Escape closes.
- Viewer chrome remains visible. Controls sit on opaque carbon header/footer surfaces, never over arbitrary pixels.
- Closing restores focus to the originating card; if virtualized away, restore to the owning turn, then the transcript region.

### Accessibility and internationalization

- Inline card accessible name: `Open screenshot preview, processed, revision 3.` Include safe semantic context only when supplied by the relay.
- The card’s inner image is decorative (`alt=""`) to avoid duplicate functional announcements.
- Viewer `<img>` uses `safeAlt`; fallback: `Image preview from pi; description not provided.`
- If `safeDescription` exists, expose it through a `Show description` disclosure inside the dialog, not a second modal or giant `aria-describedby`.
- Focus the visible/static dialog heading on open, followed by Close, status actions, zoom controls, pan controls, then the image region.
- All targets are at least 44×44 CSS pixels. Focus uses a carbon ring on parchment and a bone ring on carbon; clay is never the sole focus or status signal.
- Use one throttled polite status region for user-initiated loading and zoom changes, one nonrepeating alert for revocation/denial/corruption, and an aggregate `N new images from pi` announcement when the reader is away from the live edge.
- New media never moves focus or forces scroll.
- Support the application’s 100–200% text scale using `rem`, unitless line height, wrapping metadata, and a two-row viewer header at high scale. Never disable page zoom.
- Use logical CSS properties, `dir="auto"` for external captions, `<bdi dir="ltr">` for revision/MIME tokens, and `Intl` for numbers, sizes, dates, and plurals. Image pixels and physical pan coordinates never mirror in RTL.
- Test VoiceOver, Switch Control, Voice Control, hardware keyboard, 320px width, 200% text, portrait/landscape, increased contrast, light/dark mode, and reduced motion.

### Visual and motion system

- Canvas remains bone `#f8f8f6` in light mode and the established dark parchment in dark mode; images are never recolored or inverted.
- The fullscreen image stage is carbon in both themes so both white and dark screenshots retain a visible edge.
- Inter is used for cards, metadata, controls, and security state. Source Serif 4 remains reserved for assistant prose and longer descriptions.
- Clay `#d97757` on bone is approximately 2.94:1, so clay must not be body text, a thin boundary, a focus ring, or the only error/redaction cue. Use it only as a decorative accent paired with independently sufficient carbon/bone contrast.
- Loading placeholders are static. No shimmer, pulse, animated blur, spring, parallax, or Ken Burns effect.
- Card first paint: opacity 0→1 over 120ms.
- Card press: border/background change and `.985` scale over 90–120ms.
- Viewer entry: overlay opacity plus `translateY(8px → 0)` over 220ms.
- Viewer exit: 180ms.
- Thumbnail-to-full replacement: 100ms opacity crossfade after verification and decode.
- Zoom and pan track direct manipulation with no transition while pointers are down.
- Under `prefers-reduced-motion: reduce`, remove translation, scale, snap, and shared-element motion; use opacity only for at most 100ms or switch instantly.
- Use `viewport-fit=cover`, React Aria’s visual-viewport variables, `100dvh`/`100svh` fallbacks, safe-area padding, `overscroll-behavior: contain`, and `touch-action: none` only on the active zoom surface.

### Objective acceptance gates

| Gate | Pass condition |
|---|---|
| Upstream isolation | Image bytes never cross pi stdout, JSONL framing, sync WebSocket, or transcript JSON |
| Schema | Paths, filenames, URLs, pixel fields, base64, OCR, unknown keys, `shareAllowed:true`, malformed digests, and invalid state combinations are rejected |
| Ticket/revision | Replayed, expired, wrong-origin, wrong-device, wrong-session, wrong-action, or stale-revision publish tickets create no artifact or transcript update |
| Type handling | PNG/JPEG/static-WebP pass; SVG, animation, HEIC, PDF, polyglots, spoofed MIME, truncation, and malformed metadata produce `withheld` |
| Boundary limits | Exact tests cover 15 MiB/image, 30 MiB/batch, 60 MP, 12,000px, four images, two workers, 2 MiB output, and 8 MiB/turn |
| Metadata removal | Sanitized fixtures contain no EXIF, GPS, XMP, IPTC, comments, filenames, embedded thumbnails, or trailing payloads |
| Pixel redaction | Seeded path/credential fixtures are covered by opaque encoded pixels in both full and thumbnail variants |
| Fail closed | Scanner failure, timeout, or unlocalizable probable secret produces no retrievable rendition |
| Atomicity | Revision conflict deletes staged files and leaves no orphaned or reordered block |
| Read authorization | Artifact reads require exact session/artifact/revision membership and cannot invoke pi, mint a mutation ticket, or change workspace state |
| Integrity | Flipping one served byte prevents object-URL creation and renders `corrupt` |
| Revision race | Revision N finishing after N+1 is discarded; privacy revocation covers N immediately |
| Cache hygiene | Cache Storage, IndexedDB, localStorage, service-worker caches, history, analytics, and crash output contain zero artifact bytes or URLs |
| Cleanup | Fifty open/close/background cycles leave zero full-image URLs, buffers, or decoded bitmaps |
| Transcript behavior | Images remain visible when tool details collapse; processing→ready preserves block position; expired media leaves a tombstone |
| Interaction | Scroll-over-card does not open; tap/keyboard open; Back/Escape/Close restore exact scroll and focus; no long-press, paging, or swipe-dismiss exists |
| Accessibility | One coherent card name, no duplicate image announcement, trapped modal focus, 44px controls, single-pointer zoom/pan alternatives, and no forced focus/scroll |
| Responsive UI | 320px width and 200% text produce no page-level horizontal scroll or obscured Close control |
| Motion | Reduced Motion produces no translation, scale, shimmer, spring, or animated zoom |
| Theme | Automated contrast assertions reject clay-on-bone text, boundaries, focus, or color-only status |
| Resume | Kill/reopen either resolves the same exact revision or shows `expired`; it never becomes a path/file chip or fetches `latest` |

## 3. Consensus vs divergence

### Consensus

Across the 15 passes, the strongest agreement was:

- Store a durable metadata/tombstone record while keeping pixels in a separate bounded artifact store (iter-01 through iter-15).
- Never render pi-provided URLs, paths, Markdown image references, raw base64, SVG, or unsanitized bytes.
- Fully decode and re-encode accepted rasters, strip metadata, generate thumbnails from the sanitized master, and verify a digest before rendering.
- Use a large transcript-native contain preview, not a filename chip or cropped social-media tile.
- Preserve the row through failures, expiry, reload, and tool collapse.
- Reuse the F6 React Aria fullscreen shell, focus handling, exact revision reads, no-store delivery, and blob-URL cleanup.
- Provide pinch/double-tap/pan plus visible, keyboard-accessible alternatives.
- Disable Share/Save by default and avoid a second image library.
- Treat the image and every caption/alt/error/log surface as untrusted and redaction-sensitive.
- Test on physical iPhones in both Safari and installed-PWA modes.

### Resolved divergences

- **Sibling kind vs nested tool-result part:** choose the sibling `inbound_image` kind. It preserves promoted placement and gives old clients an honest unsupported block instead of silent loss (iter-06/07/15 over iter-14).
- **Read tickets vs session reads:** use authenticated exact-tuple POST reads without one-use tickets. One-use tickets remain mandatory for publication, upload, and other mutations; repeatable rendering is a read (iter-07/15 and F6 over iter-01/02/12/14).
- **Offline persistence:** retain only foreground in-memory verified pixels. Do not adopt IndexedDB, OPFS, embedded thumbnails, BlurHash, or immutable browser caching (iter-01/02/07/15 over iter-12/13).
- **Save/Share/Copy:** exclude all three in v1 and suppress native long-press callouts. Sanitized does not mean secret-free (iter-02/03/07/09 over consumer-app patterns and iter-08/10/14 minorities).
- **Viewer dismissal and paging:** inherit F6’s no-swipe-down, no-backdrop-dismissal, and no-artifact-paging decision. Close, Escape, history Back, and iOS edge-back are sufficient and avoid pan/scroll conflicts (iter-09/15 over iter-01/02/08/10/14).
- **Media limits:** align normalization with F5’s established 2,000px/2 MiB contract rather than creating a second 4K/6–8 MiB image profile.
- **Automatic thumbnail vs tap-to-reveal:** automatically load the sanitized thumbnail only near the viewport while visible. Keep tap-to-reveal as a policy mode rather than the default.
- **Visual redaction:** require deterministic masks plus OCR/secret scanning and fail closed when the pipeline cannot complete; never imply that this proves an image harmless.

### Strong minority ideas worth keeping

- **High-security tap-to-reveal mode:** fetch no pixels until explicit activation and reset on backgrounding.
- **Redaction by construction:** browser/terminal capture adapters should omit sensitive DOM regions before pixels exist; stronger than OCR and compatible with the same artifact contract.
- **Sanitized OCR companion:** an optional, separately bounded and redacted `Read extracted text` artifact would materially improve terminal-screenshot accessibility.
- **Actual-size zoom:** add a 1:1 pixel stop if device testing shows fit↔2× is insufficient for code and terminal text.
- **Tiled long-image viewer:** independently digested tiles may be justified for full-page screenshots that cannot fit the v1 memory budget.
- **Revision comparison:** two-up before/after inspection is more useful to coding workflows than a consumer gallery.
- **Single-view or shorter-retention artifacts:** useful for especially sensitive captures, provided the UI never promises screenshot-proof deletion.
- **First-image consent or host policy gating:** appropriate for stricter organizations even though it adds friction.
- **Host-sanitized end-to-end encryption:** worthwhile if the relay trust model changes, but it requires signed sanitizer provenance and is not a v1 extension.

## 4. Security & redaction

This feature preserves the fixed posture as follows:

- **Read-only client surface:** opening, zooming, panning, retrying a read, viewing Details, and closing cannot invoke pi or mutate workspace state. `artifact:read` remains available in Plan mode.
- **Every mutation is capability-bound:** artifact publication, transcript insertion, F5 upload reservation, binary upload, cancellation, and prompt submission use distinct one-use tickets or server-internal compare-and-swap transitions, all bound to exact expected revisions.
- **Host/extension enforcement remains authoritative:** the PWA cannot authorize screenshot capture. The host extension decides which read-only tools may publish captures in Plan mode; arbitrary desktop capture, repository paths, and captured windows require explicit host policy.
- **Images convey no authority:** visible instructions, QR codes, text, links, or prompt injections inside a screenshot cannot authorize filesystem, shell, process, network, approval, or mode changes. Inbound pixels are never automatically passed back to pi or a model.
- **No path-based reads:** model text, Markdown, filenames, diff headers, and displayed captions cannot cause a file read. Only an approved extension-created capability handle may become a publication body.
- **Redaction precedes persistence and broadcast:** captions, alt text, description, source labels, failure copy, notifications, logs, and transcript fields pass through bounded allowlist projection and canonical text redaction.
- **Pixel redaction is destructive:** masks are burned into the encoded raster before hashing. Thumbnails and any future exported copy derive from that same master.
- **Failure is withholding:** raw originals are never substituted when decoding, resizing, scanning, or redaction fails.
- **Artifact isolation:** raw and sanitized files use random names outside the repository, webroot, transcript database, backup set, and Pi-readable workspace. Directories are `0700`; objects are `0600`.
- **No ambient artifact URL:** reads use authenticated POST and exact body fields. IDs, revisions, digests, tickets, and session secrets never enter a shareable URL, Referer, browser history, or image `src`.
- **No persistent device copy:** artifact responses are `no-store`; the service worker, Cache API, IndexedDB, localStorage, and transcript cache reject them.
- **CSP:** production HTML must include at least `default-src 'self'; img-src 'self' blob:; connect-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'`, merged with the application’s existing script/style nonce or hash policy. Do not add `data:` or arbitrary HTTPS image sources.
- **Client memory is bounded:** only near-viewport thumbnails and one full image are retained; all resources are abortable and reference-counted.
- **Background privacy:** `visibilitychange` and `pagehide` synchronously show an opaque curtain, abort full reads, revoke object URLs, and clear decoded buffers. This reduces App Switcher exposure but cannot guarantee that iOS never captures a foreground frame.
- **Revocation wins races:** a revocation event covers visible pixels immediately and invalidates pending generations. Snapshot reconciliation repairs missed revocations after reconnect.
- **No export in v1:** `shareAllowed` is schema-fixed to `false`; there is no Save, Share, Copy Image, public link, download, Photos-library action, or native long-press menu.
- **Notifications remain content-free:** push payloads stay limited to the existing lookup and attention fields; notification copy is generic and contains no image, caption, ID, or digest.
- **Observability is coarse:** logs may contain a safe reason code, media count, coarse size bucket, and latency bucket only. They suppress bodies, paths, names, captions, OCR, matches, tickets, IDs, digests, decoder exceptions, and URLs.
- **Retention is bounded:** sanitized bytes expire after 24 hours, session revocation/closure, or quota eviction. Durable transcript metadata becomes `expired`; it never falls back to a path or original.
- **Residual risks are explicit:** OCR can miss secrets, users can photograph or screen-record the display, WebKit may snapshot foreground pixels, and a compromised same-origin application can access bytes already authorized to it. The product must not market this as DRM or guaranteed secret removal.

## 5. Open questions + risks

1. **Publisher integration:** confirm the pinned pi build exposes image-bearing tool results to an in-process extension before stdout/session persistence. If not, an extension/tool API change is required before UI work can ship.
2. **Approved source allowlist:** a human security owner must define which tools and capture adapters may publish—browser screenshots, terminal screenshots, generated diagrams, or arbitrary raster tool results.
3. **Visual-redaction policy:** define required detectors, languages, confidence thresholds, explicit-mask precedence, and which uncertain findings withhold the entire image.
4. **Retention:** ratify the proposed 24-hour/50 MiB defaults. Shorter retention improves privacy; longer retention improves transcript usefulness.
5. **Minimum iOS version:** lock the physical-device matrix and supported WebKit baseline before choosing any gesture helper.
6. **F6 delivery sequencing:** if the shared `ArtifactViewerProvider` is not implemented first, F8 must build it as shared infrastructure rather than creating an inbound-only lightbox.
7. **Decoder operations:** pin and monitor the raster decoder and libvips/codec dependencies, provide a codec kill switch, and define the emergency update process.
8. **Memory ceiling:** validate 2,000px images, repeated open/close, rotation, and rapid transcript scrolling on the oldest supported iPhone; lower the full rendition if WebKit eviction remains frequent.
9. **Safe descriptions:** decide whether generic alt text is sufficient for v1 or whether text-heavy screenshots require a separately sanitized long description before release.
10. **Plan-mode capture semantics:** viewing is clearly a read, but initiating a new host screenshot is controlled egress. The host must define whether each approved capture tool remains legal in Plan mode.
11. **App Switcher limitation:** decide whether best-effort PWA privacy covering is acceptable or whether high-security deployments require a native wrapper.
12. **Authenticated visual signoff:** perform a final current-device comparison against Claude iOS and Kimi mobile through an authorized Mobbin workspace; public references do not establish pixel-level parity.

## 6. Sources

### Project contracts

- [F5 Media Upload](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/specs/002/F5-media-upload/spec.md>)
- [F6 File Preview](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/specs/002/F6-file-preview/spec.md>)

### Pi, coding-agent, and remote-client prior art

- [Pi RPC documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)
- [Pi session format](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/session.md)
- [Kimi Code Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)
- [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)
- [Kimi CLI changelog](https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md)
- [Happy mobile coding-agent client](https://github.com/slopus/happy)
- [CC Pocket](https://github.com/K9i-0/ccpocket)
- [Pi Agent Dashboard](https://github.com/BlackBeltTechnology/pi-agent-dashboard)
- [OpenCode tool-image preview request](https://github.com/anomalyco/opencode/issues/21227)
- [Claude Code inline-image gap](https://github.com/anthropics/claude-code/issues/61995)
- [Hugging Face chat image-viewer implementation](https://github.com/huggingface/chat-ui/commit/2ef6c831a386a9a03488339cddef1145dc363630)
- [Open WebUI image-URL advisory](https://github.com/open-webui/open-webui/security/advisories/GHSA-j6w6-986j-2m2m)

### Product and interaction references

- [Claude artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Claude file creation and preview behavior](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude)
- [ChatGPT Images](https://help.openai.com/en/articles/11084440-chatgpt-image-library)
- [Apple Photos viewing gestures](https://support.apple.com/guide/iphone/view-photos-and-videos-iph3d267610/ios)
- [Apple HIG — Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures/)
- [Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/)
- [Apple HIG — Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)
- [React Aria Modal](https://react-aria.adobe.com/Modal)
- [WAI-ARIA modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C Images tutorial](https://www.w3.org/WAI/tutorials/images/)

### Security and platform references

- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Anthropic computer-use security considerations](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)
- [MDN — `SubtleCrypto.digest`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- [MDN — `HTMLImageElement.decode`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode)
- [MDN — Blob URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob)
- [MDN — Content Security Policy `img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/img-src)
- [RFC 9530 — HTTP Digest Fields](https://www.rfc-editor.org/rfc/rfc9530.html)

### Mobbin references

- [Claude iOS image-input flow](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1)
- [Claude iOS chat-detail screen](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8)
- [ChatGPT iOS generated-image conversation](https://mobbin.com/explore/screens/3aa59b0a-9d5e-451b-af8d-21acfd81064b)
- [ChatGPT iOS image-generation flow](https://mobbin.com/explore/flows/205d7105-5ad4-42b5-aa8f-9b970e1d8983)
- [Dropbox iOS image viewer](https://mobbin.com/explore/screens/b4f9821b-3cdf-4876-8691-e4b7741637bc)
- [Mobbin inline-screen/fullscreen discussion](https://www.linkedin.com/posts/liaujianjie_the-mobbin-mcp-now-displays-the-screens-inline-activity-7465351105502294016-qvs1)
