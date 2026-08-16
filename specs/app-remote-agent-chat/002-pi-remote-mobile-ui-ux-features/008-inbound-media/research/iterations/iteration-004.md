<!-- provenance: external-CLI orchestration pass; original file iter-04-sol.md -->
> **Source pass 4** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-4-sol.md`.

<!-- F8-inbound-media | model=sol | lens=edge-failure | iter 4/15 | 2026-08-16T04:46:16.057Z -->

# 1. Findings for the edge-failure lens

## The core failure principle: preserve the turn, distrust the media

An image block must never disappear merely because its bytes are unavailable. If pi’s message contains only an image and that image is rejected, expired, offline, or corrupted, removing the block would make the transcript falsely appear empty. The durable transcript therefore needs a stable metadata/tombstone record independent of artifact-byte availability.

This separation also prevents a media failure from poisoning later conversation processing. Kimi Code recently added recovery that drops unsupported media and retries instead of allowing one bad image to break every subsequent request; its changelog also records explicit fault injection for “media-degraded” and “media-stripped” recovery paths. Pi Remote should adopt the isolation principle, but not Kimi’s documented best-effort fallback of forwarding the original image when compression fails, because that violates fail-closed sanitization. [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)

The durable block and the retrievable bytes have different lifecycles:

- The transcript block is permanent, ordered and redacted.
- Sanitized artifact bytes are separately authorized, bounded and expirable.
- A failure to retrieve bytes changes presentation state, not transcript history.
- A security failure replaces pixels with a tombstone; it never falls back to raw bytes or an external URL.

## The existing Pi boundary is narrower than upstream Pi’s media model

Pi Remote’s flattened RPC transcript currently has no image kind. Upstream pi, however, already documents base64 `ImageContent` in user and tool-result messages and inline image rendering in compatible terminals. That is useful prior art for identifying the producer seam, but the base64 representation must not be copied into Pi Remote’s durable transcript because it exposes unbounded bytes and bypasses relay sanitization. [pi session format](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/session.md), [pi image support](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)

The new type should therefore be a Pi Remote artifact reference, not upstream `ImageContent`:

```text
pi/tool result bytes
    → host-only image offer
    → ticketed relay ingest
    → decode, redact, canonicalize
    → durable artifact reference
    → authenticated thumbnail/full fetch
```

## Broken-image UI is both a UX and security failure

Directly assigning agent-controlled URLs to `<img src>` creates several failure classes: external request leakage, CSRF-like requests, MIME confusion and unavailable authenticated resources. Open WebUI has had an advisory where unvalidated image URLs caused authenticated viewers to make attacker-chosen requests, and a separate stored-SVG issue showed why an image allowlist and `nosniff` are necessary. [Open WebUI image URL advisory](https://github.com/open-webui/open-webui/security/advisories/GHSA-j6w6-986j-2m2m), [SVG stored-XSS advisory](https://advisories.gitlab.com/pypi/open-webui/GHSA-3wgj-c2hg-vm6q/)

Open WebUI also provides concrete evidence for a common split-brain failure: the frontend could display an image reconstructed from a file ID while the model could not dereference that same ID. Pi Remote should have one canonical artifact resolver and test both transcript membership and byte delivery against it. [Open WebUI file-ID issue](https://github.com/open-webui/open-webui/issues/21598)

Therefore:

- Never render a URL received from pi.
- Never allow `http:`, `https:`, `file:`, `data:` or host paths in the durable image block.
- Fetch same-origin bytes, verify the declared digest, then render a local blob URL.
- A failed verification produces an integrity tombstone, not a native broken-image icon.
- Revoking the current revision must immediately cover and release any displayed blob.

## Loading must reserve space and permit continued transcript use

Apple recommends showing content or a placeholder immediately and letting people continue other work while loading. Blank regions are interpreted as application failure. [Apple HIG: Loading](https://developer.apple.com/design/human-interface-guidelines/loading)

For an inline transcript this means:

- Reserve the final aspect ratio from sanitized metadata before fetching pixels.
- Never block scrolling, composing, tool approvals or later messages on an image fetch.
- Show a determinate progress bar only when a trustworthy `Content-Length` is present; otherwise show a quiet indeterminate state.
- Stop animated loading treatment under `prefers-reduced-motion`.
- After 30 seconds, replace perpetual loading with a stable “Preview is taking longer than expected” state and an explicit Retry button.

## “Offline” cannot be inferred from `navigator.onLine`

`navigator.onLine` is explicitly unreliable and should be treated as a hint, not as authorization to disable functionality. Network failure must be established from the actual artifact request, while `online`/`offline` events may adjust messaging and retry timing. [MDN `navigator.onLine`](https://github.com/mdn/content/blob/main/files/en-us/web/api/navigator/online/index.md)

The graceful behavior is asymmetric:

- If no verified bytes have been loaded, show “Connect to view preview.”
- If a verified thumbnail is already in memory, retain it during a short outage.
- If the full viewer is already showing verified bytes, retain the current pixels until it closes or the PWA backgrounds, with “Offline — showing verified copy.”
- Do not open a previously closed image while offline.
- Purge full-resolution blobs on backgrounding, logout, permission loss or revision change.

CC Pocket explicitly advertises recovery of missed streaming updates and automatic resend after reconnecting. That is appropriate for transcript synchronization; inbound image bytes should instead be re-fetched idempotently because they are immutable per revision. [CC Pocket](https://github.com/K9i-0/ccpocket)

## iPhone memory pressure is a first-class failure mode

A compressed image can decode to far more memory than its transfer size. Sharp exposes `limitInputPixels`, retains memory-exhaustion safety features by default and can abort on malformed/truncated pixel data. Its default pixel ceiling is far too high for a mobile transcript, so Pi Remote needs a much lower product-level limit. [Sharp constructor options](https://sharp.pixelplumbing.com/api-constructor/)

The client should hold:

- All visible thumbnails within a 24 MiB decoded-image budget.
- At most one full-resolution artifact blob.
- No prefetched full-resolution artifacts.
- No blob belonging to an unmounted card or superseded revision.

`URL.revokeObjectURL()` must run when a card unmounts, a revision changes, the viewer closes or the session changes; this explicitly releases the browser’s reference to the blob. [MDN `URL.revokeObjectURL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static)

## Permission denial has multiple meanings and must not be collapsed

“Permission denied” can mean:

1. The host lacked macOS Screen Recording permission.
2. The host extension was not authorized to read the proposed source.
3. The relay rejected the ingest ticket.
4. The current iPhone identity may not read this session or artifact.
5. A previously allowed revision was revoked.
6. The Tailscale route is currently unavailable.

These need different recovery actions. A generic Retry button is harmful for permanent denial, while exposing a host path, application name or raw server error would violate redaction.

Tailscale’s grants are deny-by-default and distinguish network and application capabilities. Tailnet access is therefore necessary but not sufficient: the artifact endpoint must still authorize the user, session and current revision. [Tailscale grants syntax](https://tailscale.com/docs/reference/syntax/grants), [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve)

## Competitive prior art supports enlargement, recovery and constrained media

Kimi Code ships click-to-enlarge, limits the longest delivered image edge to 2000 px, retains screenshots as lossless PNG where possible and explicitly recovers from unsupported media. These are stronger implementation references than a visual imitation alone. [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)

Happy/Happier demonstrate the relevant remote-agent topology and attachment-envelope pattern, including real-world fixes for failed blob uploads and upload hardening. [Happy repository](https://github.com/slopus/happy), [Happy attachment client](https://github.com/slopus/happy/blob/main/packages/happy-cli/src/api/apiSession.ts), [Happier repository](https://github.com/happier-dev/happier)

ChatGPT accepts images up to 20 MB and documents that filenames and metadata are not processed and images may be resized. A 20 MB raw-ingest ceiling is therefore a reasonable competitive upper bound, but Pi Remote should enforce a much smaller sanitized-delivery budget. [ChatGPT Image Inputs FAQ](https://help.openai.com/en/articles/8400551-image-inputs-for-chatgpt-faq%3F.svgz)

Mobbin’s public app catalog did not expose stable, directly citable ChatGPT, Claude or Kimi image-viewer screen URLs during this pass; its programmatic screen search also requires authenticated Team/Enterprise API access. No screen-level Mobbin behavior is asserted without that evidence. [Mobbin iOS catalog](https://mobbin.com/discover/apps/ios), [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)

# 2. Concrete spec contribution

## 2.1 Durable content block

Use a discriminated union so pending and terminal states cannot masquerade as ready content:

```ts
type ImageArtifactBlock =
  | {
      kind: "image";
      schemaVersion: 1;
      blockId: string;
      artifactId: string;       // 128-bit random opaque ID, base64url
      revision: number;         // positive monotonic integer
      state: "processing";
      label: "Screenshot" | "Image";
      announcedAt: string;
    }
  | {
      kind: "image";
      schemaVersion: 1;
      blockId: string;
      artifactId: string;
      revision: number;
      state: "ready";
      mediaType: "image/png" | "image/jpeg";
      width: number;
      height: number;
      byteLength: number;
      digest: `sha-256:${string}`; // digest of sanitized full bytes
      thumbnail: {
        width: number;
        height: number;
        byteLength: number;
        digest: `sha-256:${string}`;
      };
      alt: string;              // redacted plain text, 1–160 chars
      description?: string;     // redacted plain text, ≤1000 chars
      redaction: {
        status: "passed" | "applied";
        regionCount: number;
        policyVersion: string;
      };
      expiresAt: string;
    }
  | {
      kind: "image";
      schemaVersion: 1;
      blockId: string;
      artifactId: string;
      revision: number;
      state: "blocked" | "expired" | "revoked";
      reason:
        | "capture_permission"
        | "source_permission"
        | "unsupported_type"
        | "too_large"
        | "invalid_image"
        | "redaction_failed"
        | "policy"
        | "retention";
      label: "Screenshot" | "Image";
    };
```

Rules:

- No raw bytes, base64, original filename, URL, host path, OCR text, stack trace or signed delivery URL may appear in the block.
- `digest` is computed over canonical sanitized bytes, never over the source.
- Same `artifactId + revision` must always resolve to the same digest.
- The same revision arriving with a different digest is a protocol violation and becomes a local integrity failure.
- Higher revisions supersede lower ones. Lower or duplicate revisions are idempotently ignored.
- A tombstone remains even when the image was the message’s only content.
- Captions are plain text only. Strip control characters, Markdown links, URLs, file paths, ANSI sequences and bidi controls before durable storage.

RFC 9530 defines `Content-Digest` for HTTP content integrity; use its `sha-256` structured-field form on delivery as well as the transcript digest. [RFC 9530](https://www.rfc-editor.org/rfc/rfc9530.html)

## 2.2 Host-to-relay ingest

The producer emits a host-local `image_offer`; it is never forwarded into the transcript. The host extension resolves the source and requests a one-use ingest ticket.

Ticket claims:

```text
nonce
artifactId
sessionId
turnId
blockId
targetRevision
expectedPreviousRevision
allowedInputTypes
maxInputBytes
expiresAt
producerIdentity
```

Upload request:

```http
PUT /v1/artifact-ingests/{artifactId}/revisions/{revision}
Authorization: ArtifactTicket <one-use-token>
If-Match: "revision:{expectedPreviousRevision}"
Content-Type: application/octet-stream
```

Required behavior:

- Reserve the ticket nonce atomically before accepting bytes.
- Stream into a non-webroot quarantine with a hard byte counter and 30-second inactivity timeout.
- Delete partial quarantine content after interruption.
- A replay never repeats the mutation. It returns the already-recorded terminal result or `409`.
- A retry after an interrupted upload requires a new ticket with the same expected revision.
- Upload arriving before transcript linkage remains unreadable and is deleted after two minutes if not atomically linked.
- Processing still pending after 60 seconds becomes `blocked/redaction_failed`.
- Never accept a source URL. This removes the SSRF and image-beacon class rather than trying to filter it.
- Never use a source filename as a storage key. OWASP recommends application-generated identifiers, authorization, size limits, signature validation, non-webroot storage and image rewriting. [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

## 2.3 Exact media limits and canonicalization

| Boundary | Limit or rule |
|---|---|
| Raw input bytes | 20 MiB hard limit, enforced while streaming |
| Raw dimensions | 1–6144 px per axis |
| Raw pixel count | 12,000,000 pixels |
| Images per turn | 4 |
| Concurrent sanitizations per session | 2 |
| Input allowlist | PNG, JPEG, static WebP |
| Explicitly rejected | SVG, GIF, HEIC/HEIF, AVIF, TIFF, BMP, ICO, PDF, animated/multipage content |
| Full sanitized output | ≤8 MiB and ≤12 MP |
| Thumbnail | longest edge ≤1200 px, ≤500 KiB |
| Retention | 24 hours from readiness; metadata tombstone remains |
| Session artifact quota | 200 MiB sanitized bytes, oldest-expiring first |

Sanitization pipeline:

1. Verify signature and decoder-detected type; ignore claimed MIME and extension.
2. Decode with `failOn: "warning"`, `limitInputPixels: 12_000_000`, `limitInputChannels: 4`, `pages: 1`, `animated: false`, `unlimited: false`.
3. Apply EXIF orientation before discarding metadata.
4. Reject truncated input, invalid profiles, excess dimensions, multiple frames or decoder warnings.
5. Convert to 8-bit sRGB.
6. Strip EXIF, XMP, IPTC, comments, thumbnails, filenames, ICC profiles and trailing bytes by reconstructing from decoded pixels.
7. Run OCR/secret detection in isolated memory.
8. Replace matching regions with opaque carbon rectangles padded by 6 px; never blur.
9. If OCR, detector or bounding-box mapping fails, block the artifact.
10. Re-encode screenshots as deterministic PNG. Re-encode photographic content as JPEG quality 90 with chroma 4:4:4.
11. Generate the thumbnail from the sanitized pixels, not from the original.
12. Compute full and thumbnail SHA-256 digests after final encoding.
13. Delete source and intermediate buffers before publishing `ready`.

Sharp documents automatic orientation and subsequent removal of the orientation tag; its output defaults also avoid retaining metadata unless explicitly requested. [Sharp image operations](https://sharp.pixelplumbing.com/api-operation/), [Sharp output options](https://sharp.pixelplumbing.com/api-output/)

Secret-region detection must include, at minimum:

- PEM private-key blocks.
- `Authorization`, bearer and basic-auth values.
- Known API-token prefixes configured by the existing text redactor.
- JWT-shaped values.
- Cookie and session-token assignments.
- `.env`-style secret/password/token values.
- URLs containing userinfo credentials.
- Host-provided explicit redaction rectangles.

Store only `regionCount` and policy version. OCR strings and matched values must never enter logs, telemetry or the transcript. Automatic OCR redaction reduces risk but is not a proof that an image contains no sensitive information; this residual risk must be documented.

## 2.4 Artifact delivery

Endpoint:

```http
GET /v1/artifacts/{artifactId}/revisions/{revision}/{thumbnail|full}
```

Authorize every request against:

- Current authenticated application identity.
- Tailscale application/network capability.
- Session membership.
- Artifact membership in that session.
- Exact current revision.
- Non-expired and non-revoked state.

Responses:

| Condition | Status |
|---|---:|
| Exact current ready revision | `200` |
| Known artifact still processing | `425` |
| Auth session expired | `401` |
| Known session but artifact viewing denied | `403` |
| Unknown artifact or no session membership | `404` |
| Requested revision superseded | `409` |
| Expired or revoked | `410` |
| Rate limit | `429` with `Retry-After` |

Required headers:

```http
Cache-Control: private, no-store
Content-Type: image/png
Content-Length: …
Content-Digest: sha-256=:…:
Content-Disposition: attachment; filename="pi-preview.png"
X-Content-Type-Options: nosniff
Cross-Origin-Resource-Policy: same-origin
Content-Security-Policy: default-src 'none'; sandbox
Referrer-Policy: no-referrer
```

The PWA service worker must network-bypass `/v1/artifacts/` and must delete any legacy artifact cache during activation. `no-store` prevents new storage but does not remove an already stored response, so both controls are required. [MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)

Client pipeline:

1. Deduplicate fetches by `artifactId/revision/variant`.
2. Fetch with same-origin credentials and an `AbortController`.
3. Reject missing, invalid or oversized `Content-Length`.
4. Count streamed bytes and abort if the declared variant limit is crossed.
5. Compare HTTP `Content-Digest`, transcript digest and locally calculated SHA-256.
6. Only after all three match, create a blob URL and call `image.decode()`.
7. Publish the bitmap to React state only after decode succeeds, avoiding a partial or flashing image. [`SubtleCrypto.digest`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest), [`HTMLImageElement.decode`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode), [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

The digest detects corruption and revision races. It does not authenticate a malicious relay because both metadata and bytes come through that relay; relay authentication or a signed manifest is a separate trust decision.

## 2.5 Client state machine and recovery

| State | Inline rendering | Available action | Transition |
|---|---|---|---|
| `processing` | Reserved-ratio parchment skeleton; “Preparing secure preview…” | None initially | Push event or snapshot refresh |
| `loading-thumbnail` | Same geometry; quiet progress | Cancel only if user initiated | Ready, offline, transient error |
| `ready` | Verified thumbnail and redacted caption | Open | Full viewer |
| `slow` | Skeleton plus “Taking longer than expected” | Retry | New fetch |
| `offline-empty` | Image icon, dimensions and “Connect to view preview” | Retry remains enabled | Retry actual request |
| `offline-verified` | Existing verified thumbnail; offline badge | Open only if full bytes already open | Reconnect or purge |
| `capture-permission` | “Screenshot not shared — capture access is off on the host” | View setup help | Terminal |
| `policy-blocked` | “Preview withheld by relay” plus safe reason | None | Higher revision only |
| `expired` | “Preview expired” and timestamp | None in v1 | Terminal |
| `not-authorized` | “You no longer have access to this preview” | Reauthenticate if `401`; none for `403` | Auth or higher revision |
| `integrity-failed` | “Preview failed integrity check” | No ordinary retry | Fresh snapshot or higher revision |
| `decode-failed` | “Preview could not be decoded” | One manual retry | Ready or terminal error |
| `full-failed` | Full-screen verified thumbnail, visibly labeled “Low-resolution preview” | Retry full image, Close | Full ready or close |
| `superseded` | Immediately cover old pixels; “A newer secure revision is available” | Load update | New revision |

Retry policy:

- `425`: retry at 1, 2, 4 and 8 seconds with ±20% jitter, then enter `slow`.
- Network/5xx: one automatic retry for an on-screen card after 750 ms; subsequent attempts require user action.
- `401`: one silent session refresh, then reauthenticate.
- `403`, `410`, integrity failure and policy blocks: never loop.
- `409`: abort the fetch and retrieve the canonical transcript snapshot.
- `429`: honor `Retry-After`; do not show a countdown unless the value is under 60 seconds.
- Reconnect retries only visible cards, with a maximum of two concurrent thumbnail requests.
- Retry must not move focus, scroll the transcript or duplicate announcements.

## 2.6 Race-condition rules

- Keep the highest revision observed for each artifact.
- A response may commit to UI only if its artifact ID, revision and digest still equal current state when hashing and decode finish.
- On a higher revision: abort older requests, cover visible older pixels, revoke blob URLs and clear decoded caches before fetching the replacement.
- Upload-before-transcript is quarantined and inaccessible.
- Transcript-before-ready shows `processing`; it never polls indefinitely.
- A sequence gap in transcript events triggers one snapshot resync before any artifact retry.
- Repeated taps share one full-image promise.
- Closing the viewer aborts an unfinished full fetch.
- Backgrounding the PWA aborts full fetches and revokes full-resolution blobs.
- If permission is revoked while online, a revocation event covers displayed pixels immediately.
- A lost revocation event is repaired by snapshot revision checking on reconnect.
- If the card trigger was removed while the viewer was open, closing restores focus to the nearest surviving transcript heading rather than to the document body.

## 2.7 Inline card

- Width: transcript column width, maximum 100%.
- Reserve sanitized `aspect-ratio`; clamp rendered height to 160–280 px.
- Use `object-fit: contain`; screenshots must not be cropped.
- Surface: bone in light mode, dark parchment in dark mode, 1 px carbon border at reduced opacity.
- Header: image icon, “Screenshot” or “Image,” dimensions and redaction badge.
- Footer appears only for status, error or caption; no permanent toolbar.
- Entire preview area is a React Aria `Button` labeled `Open screenshot preview`.
- Retry remains a separate button; never nest interactive elements.
- Press state is mandatory and the hit region must be at least 44×44 CSS px, following Apple’s minimum button target. [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- Loading preserves the card’s geometry, preventing transcript jumps.
- Use icon plus text for every state; clay color alone never communicates failure or redaction.

## 2.8 Full-screen viewer

Reuse F6’s modal infrastructure, but apply these media-specific rules:

- React Aria `Modal` + `Dialog`, `aria-label="Screenshot preview"`.
- Initial focus on the Close button.
- Focus contained while open and restored to the card on close.
- Close through visible 44×44 button, Escape, browser Back and downward swipe.
- React Aria supplies modal semantics, focus containment and restoration; these also match the WAI modal pattern. [React Aria dialog](https://react-aria.adobe.com/Modal/useDialog), [WAI modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- Use `viewport-fit=cover` and pad all controls with `max(12px, env(safe-area-inset-*)))`; WebKit documents these safe-area variables for edge-to-edge iPhone layouts. [WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- Use `100dvh`, but do not depend on a fixed iPhone height.
- Initial scale: contain.
- Pinch range: 1×–4×.
- Double tap: toggle 1×/2× around the tap point.
- Pan only above 1×.
- Swipe-to-dismiss is enabled only at 1×, with one pointer, downward displacement ≥96 px and velocity ≥0.8 px/ms.
- Zoom In, Zoom Out and Reset buttons provide single-pointer alternatives to multipoint gestures, satisfying the intent of WCAG 2.5.1. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- VoiceOver announces the caption once, not on every pan.
- Zoom changes announce `Zoom 200 percent` through a debounced polite live region.
- Preserve transcript scroll position across open/close and rotation.
- On orientation change, recompute contain scale; do not lock orientation.
- No Share, Save, Copy URL or Open in new tab in v1.
- Suppress the native long-press context menu on the image surface, while acknowledging that device screenshots cannot be technically prevented.

## 2.9 Motion

Default:

- Card skeleton: 1.2-second low-contrast opacity pulse.
- Viewer open/close: 160 ms opacity and 0.98→1 scale.
- Failed swipe return: 180 ms spring.
- No parallax or animated blur.

With `prefers-reduced-motion: reduce`:

- Static skeleton.
- Viewer uses an 80 ms dissolve only.
- Swipe tracking and scale animation are disabled; Close remains available.
- No spinning indicators.

Apple recommends replacing problematic scaling, spinning and full-screen motion with simpler dissolves, fades or color changes. [Apple Reduced Motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria)

## 2.10 Accessibility content

- Ready image always has non-empty redacted `alt`.
- Generic fallback: `Screenshot from pi. No description was provided.`
- If the screenshot conveys information not already in nearby text, pi should provide a short `alt` and structured `description`; W3C recommends both a short identification and a longer textual equivalent for complex images. [W3C Complex Images](https://www.w3.org/WAI/tutorials/images/complex/)
- Loading and recoverable errors use `role="status"` and `aria-live="polite"`.
- Security revocation uses a one-time assertive announcement: `Preview access revoked.`
- Do not put dimensions, byte counts, digest values or raw failure codes in the accessible name.
- At 320 CSS px width and 400% zoom, status text reflows below the thumbnail; the image viewer may retain two-dimensional panning because images are an explicit WCAG reflow exception. [WCAG 2.2, Reflow](https://www.w3.org/TR/WCAG22/#reflow)

## 2.11 Objective acceptance matrix

The build passes only when automated integration tests prove:

| Injection | Required result |
|---|---|
| Zero-byte source | Durable `blocked/invalid_image`; no byte object stored |
| Claimed PNG containing HTML/SVG | Rejected before publication |
| Valid signature with truncated pixels | Rejected |
| 20 MiB + 1 byte stream | Connection aborted; partial quarantine deleted |
| 1×20,000 or >12 MP image | Rejected before full decode |
| Animated WebP or GIF | Rejected |
| JPEG with EXIF GPS/path/comment | Output contains none of those fields |
| Valid image with appended script bytes | Canonical output contains decoded pixels only |
| OCR/redactor timeout | `blocked/redaction_failed`; no original fallback |
| Secret match | Sanitized output has opaque pixel replacement and no OCR text in logs |
| Upload replay | Exactly one revision is created |
| Same revision, different digest | Integrity failure; no pixels rendered |
| Revision N fetch finishes after N+1 event | N is discarded and its blob URL revoked |
| Permission revoked while viewer is open | Pixels are covered and blob released |
| Network drops during fetch | Request aborts; card geometry remains |
| Offline cold start | Metadata/tombstone renders; no broken-image icon |
| Full fetch fails with verified thumbnail | Viewer retains labeled low-resolution thumbnail |
| Viewer closes during fetch | Fetch aborts and focus returns correctly |
| Twenty image cards enter viewport | No more than two thumbnail fetches run concurrently |
| Service-worker cache inspection | No artifact response exists |
| PWA background event | Full-resolution blob count becomes zero |
| VoiceOver navigation | Card, retry, close and zoom controls have unique names |
| Reduced Motion enabled | No pulse, spring, spin or scale transition runs |
| Dark/light snapshots | Text, controls, focus and state indicators meet WCAG AA |
| Log sweep | No filename, host path, OCR text, ticket, source digest or signed URL appears |

# 3. Divergent / minority ideas worth considering

## Tap-to-reveal thumbnails

Default every image to a blurred-free metadata card and fetch even the thumbnail only after a tap. This materially reduces incidental disclosure when someone opens a transcript in public. It is less competitive with Claude/Kimi’s instant inline previews, but may be appropriate as a per-device “Privacy mode.”

## Tile-based full-resolution delivery

Instead of downloading one 8 MiB image, generate authenticated 512 px tiles and fetch only visible tiles at the current zoom. This bounds iPhone memory and improves detailed code-screenshot inspection. It adds substantial request, revision and digest complexity; every tile needs membership authorization and a manifest digest.

## Direct host-to-phone media channel

Keep only the sanitized manifest at the relay and stream bytes directly from the host over the tailnet. Expiration becomes automatic when the host disconnects and relay storage disappears. The cost is worse offline/reconnect behavior and a second availability path.

## Host-sanitized, end-to-end encrypted artifacts

Run canonicalization and OCR redaction on the host, encrypt the result for the paired phone and let the relay store ciphertext only. This reduces relay trust but conflicts with the stated requirement that the relay perform sanitization. It also requires an authenticated sanitizer version and signed manifest so a compromised host cannot label raw content “sanitized.”

## Single-view artifacts

Allow pi to mark especially sensitive screenshots as `single_view`. The full viewer fetch consumes a one-use read capability and the artifact expires immediately on close. This is stronger privacy signaling, but cannot prevent screenshots or memory extraction and therefore must not be described as guaranteed deletion.

## Ticketed retention extension

Keep the default 24-hour lifetime, but offer “Keep preview for 7 days” as a revision-checked, one-use-ticketed mutation. It should live outside the viewer’s primary controls because retention is a security mutation, not a normal viewing action.

## Perceptual duplicate suppression

If pi emits the same screenshot repeatedly, show later occurrences as compact references to the first artifact rather than full cards. Use a relay-side perceptual hash only ephemerally; do not persist it because it creates cross-session correlation beyond the required content digest.

# 4. Open questions and risks

1. **Where exactly is Pi Remote flattening upstream media?** Upstream pi can already emit image-bearing tool results, while the stated Pi Remote protocol cannot. The build must identify whether the change belongs in the pi extension, RPC adapter, relay schema or all three.

2. **What counts as a screenshot eligible for pixel redaction?** OCR-based secret detection has unavoidable false negatives. Decide whether all screenshots require a host-provided capture mask, whether particular window classes are forbidden, and whether any image may bypass OCR.

3. **Is 24-hour retention acceptable?** It fits the security posture but is less persistent than mainstream chat attachments. Product should decide whether expiration is time-based, session-based or storage-pressure-based.

4. **What is the authoritative application identity?** Tailscale grants protect connectivity, but the relay still needs a stable user/session identity and must define whether Tailscale identity headers are trusted only when received from a verified Serve proxy.

5. **Does F6 already support accessible pinch/pan?** If F6 uses a generic dialog without single-pointer zoom controls, reusing its visual shell is insufficient. The gesture layer needs separate VoiceOver, Switch Control and reduced-motion testing.

6. **What happens on loss of authorization while offline?** Already displayed pixels cannot be clawed back. The proposed policy retains only the currently visible verified copy until close/background; stricter installations may prefer immediate covering on any connectivity loss.

7. **Digest authenticity remains limited.** A digest protects against corruption and stale responses, not a malicious relay that supplies both metadata and bytes. Stronger authenticity requires a signed manifest rooted in a trusted host or sanitizer key.

8. **Canonical PNG may still be large for code screenshots.** The 8 MiB ceiling can force scaling. The UI should display delivered dimensions and never imply that pixel-perfect original resolution is available.

9. **Alt text can leak what pixel redaction removed.** Caption and description redaction must run independently of image OCR. Never generate durable alt text from unredacted OCR output.

10. **Permission diagnostics can leak workstation context.** Do not expose the captured application, screen name, local username or path. “Capture access is off on the host” is sufficient.

11. **Browser cache removal needs migration coverage.** Adding `no-store` does not delete responses cached by an older service worker. Deployment requires an activation-time purge and a test against an upgraded installed PWA.

12. **Mobbin evidence needs authenticated follow-up.** Before visual sign-off, capture the exact current Claude iOS, ChatGPT iOS and Kimi mobile loading/error/fullscreen flows through an authorized Mobbin workspace. Public URLs were insufficient for reproducible screen-level citations in this pass.

# 5. Sources

- [Apple Human Interface Guidelines — Loading](https://developer.apple.com/design/human-interface-guidelines/loading)
- [Apple Human Interface Guidelines — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple Reduced Motion evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria)
- [WebKit — Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [W3C Complex Images tutorial](https://www.w3.org/WAI/tutorials/images/complex/)
- [React Aria dialog behavior](https://react-aria.adobe.com/Modal/useDialog)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [RFC 9530 — HTTP Digest Fields](https://www.rfc-editor.org/rfc/rfc9530.html)
- [MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
- [MDN `navigator.onLine`](https://github.com/mdn/content/blob/main/files/en-us/web/api/navigator/online/index.md)
- [MDN `SubtleCrypto.digest`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- [MDN `AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN `HTMLImageElement.decode`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode)
- [MDN `URL.revokeObjectURL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static)
- [Sharp constructor and input safety options](https://sharp.pixelplumbing.com/api-constructor/)
- [Sharp image operations](https://sharp.pixelplumbing.com/api-operation/)
- [Sharp output options](https://sharp.pixelplumbing.com/api-output/)
- [Tailscale grants syntax](https://tailscale.com/docs/reference/syntax/grants)
- [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve)
- [pi session format](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/session.md)
- [pi coding-agent image support](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)
- [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)
- [Happy remote coding client](https://github.com/slopus/happy)
- [Happy attachment client](https://github.com/slopus/happy/blob/main/packages/happy-cli/src/api/apiSession.ts)
- [Happier remote coding client](https://github.com/happier-dev/happier)
- [CC Pocket](https://github.com/K9i-0/ccpocket)
- [OpenCode Mobile PWA](https://github.com/newlandjia/opencode-mobile)
- [Open WebUI image URL advisory](https://github.com/open-webui/open-webui/security/advisories/GHSA-j6w6-986j-2m2m)
- [Open WebUI stored-SVG advisory](https://advisories.gitlab.com/pypi/open-webui/GHSA-3wgj-c2hg-vm6q/)
- [Open WebUI file-ID/image-access failure](https://github.com/open-webui/open-webui/issues/21598)
- [ChatGPT Image Inputs FAQ](https://help.openai.com/en/articles/8400551-image-inputs-for-chatgpt-faq%3F.svgz)
- [Mobbin iOS app catalog](https://mobbin.com/discover/apps/ios)
- [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)
