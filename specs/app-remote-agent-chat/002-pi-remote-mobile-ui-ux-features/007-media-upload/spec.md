---
title: "F5 Media Upload — Photos in Chat"
description: "F5 Media Upload — Photos in Chat"
trigger_phrases:
  - "f5 media upload — photos in chat"
importance_tier: "important"
_memory:
  continuity:
    packet_pointer: "app-remote-agent-chat/002-pi-remote-mobile-ui-ux-features/007-media-upload"
    last_updated_at: "2026-08-16T07:47:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized research and scaffolded feature spec plus build sub-phases"
    next_safe_action: "Prepare reference screens, then build sub-phase 002"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# F5 Media Upload — Photos in Chat

One-line summary: Add a photos-only iPhone gallery/camera attachment lane to the existing composer, with local draft-and-review, bounded ticketed upload, quarantine normalization, in-memory Pi image delivery, and metadata-only transcript cards.

## DECISION

Build a photos-only attachment lane. The existing composer `+` opens explicit **Photo Library** and **Take Photo** actions. Selection remains local until the user presses **Send**. A draft contains up to four removable previews and an optional caption.

On Send, Pi Remote obtains dedicated revision-bound, one-use upload tickets and performs bounded binary PUTs. The relay stores bytes only in outside-webroot quarantine, validates and normalizes each image, then supplies sanitized JPEG/PNG bytes to Pi through its existing `images` RPC field. Pixels never travel through transcript JSON or a workspace path. The durable transcript stores metadata-minimal redacted cards: no pixels, filenames, hashes, paths, or reusable preview URLs.

This adopts Claude’s draft-and-review interaction and Kimi Code’s capability gating and normalization discipline. Eager upload, inline base64 HTTP, object storage, host-file delivery, video, audio, PDF, GIF animation, arbitrary files, and cross-device image replay are not v1.

## Problem and goal

Pi Remote currently has no composer file picker or relay upload lane. The only file input is the enrollment QR scanner. Users cannot show Pi a screenshot, camera capture, or other still image from an iPhone without leaving the chat.

The goal is a reliable iOS PWA flow for attaching photos to a chat turn while preserving the product’s read-only-by-default posture. Choosing a photo is local preparation. Pressing Send is the explicit, visible mutation that authorizes the bounded attachment delivery and prompt submission.

The feature must feel native on an installed iPhone PWA, approach the interaction quality of Claude iOS and Kimi Code, and remain correct under stale revisions, model capability changes, app suspension, duplicate requests, relay failure, and ambiguous Pi acknowledgement.

## Current state

- `apps/pi-remote-web/src/SessionComposer.tsx` has the existing `+` tools popover, prompt textarea, send/steer/stop controls, mode controls, and command insertion.
- `apps/pi-remote-web/src/relay.ts` submits text through `/api/prompt/submit` after obtaining a one-use ticket.
- `apps/pi-remote-relay/src/http/server.ts` exposes the authenticated loopback HTTP routes and read-only sync socket; it has no media routes.
- `apps/pi-remote-relay/src/prompt/prompt-service.ts` sends text to Pi and projects a redacted text block.
- `packages/pi-rpc-protocol/src/types.ts` already has Pi-side image-bearing command shapes, but the ticketed prompt submission contract has no attachment references or media capability contract.
- `apps/pi-remote-web/public/service-worker.js` caches the application shell, while `apps/pi-remote-web/src/cache.ts` stores bounded read-only transcript state. Neither may receive raw media.

## Desired end state

When the host enables media, the composer exposes the photo actions, and the active model advertises image input. A user can select up to four supported still images, inspect or remove them, add an optional caption, and submit the ordered set explicitly. The UI shows honest local, upload, normalization, stale, retry, cancellation, and delivery-unknown states.

The relay accepts only authenticated, foreground, capability-gated, revision-compatible submissions. It streams bounded source bytes to quarantine, verifies type and digest, decodes and normalizes them, and deletes transient bytes at the defined lifecycle boundary. Pi receives only normalized in-memory image blocks. The transcript receives redacted attachment cards and the normal caption text; future devices receive no preview.

The feature remains disabled by default until the pinned Pi build proves that image input is accepted without persisting or echoing image payloads into the session, stdout events, or relay-visible transcript data.

## Scope

### In scope for v1

- Still images from the iOS Photo Library and rear camera.
- JPEG, PNG, WebP, HEIC, and HEIF ingress.
- Four images maximum per turn; ordered selection; removal; local preview; optional caption.
- Local object-URL previews that are never persisted and are revoked promptly.
- Native React Aria `FileTrigger` boundaries for gallery and camera.
- A host-advertised image capability and host-enforced media policy.
- Revision-bound reservation, one-use upload tickets, bounded streaming PUTs, quarantine validation, and deterministic normalization.
- Sanitized JPEG/PNG image blocks on the existing Pi `prompt`, `steer`, and `follow_up` paths.
- Atomic commit: a set with any rejected, failed, stale, mismatched, or expired member does not partially send.
- Redacted transcript cards, generic copy/export text, and generic push-notification wording.
- Read-only/status reconciliation after an ambiguous request; no automatic resend.
- Light and dark ink-on-parchment UI, WCAG AA, safe-area and keyboard handling, VoiceOver/Switch Control semantics, RTL, pseudo-localization, and reduced-motion behavior.
- Security, lifecycle, and real-device tests for Safari and installed-PWA execution.

### Out of scope: v1 non-goals

- Video, audio, PDF, archives, arbitrary files, SVG, TIFF, RAW/DNG, animated GIF/APNG/animated WebP, or Live Photo delivery.
- Drag/drop, long-press actions, swipe actions, image reordering, cropping, markup, OCR, model-generated alt text, face scanning, or automatic redaction of visual secrets.
- Eager remote staging before Send, third-party object storage, public listeners, host-file paths, read-only attachment mounts, or inline base64 in browser HTTP/WebSocket payloads.
- Transcript thumbnails, server preview URLs, cross-device replay, persistent attachment history, or a download/share action.
- Resumable `HEAD`/`PATCH` uploads unless real-device evidence shows the bounded PUT path is materially unreliable; that would be a separate design.
- Silent model switching, silent image omission, “send description without photo,” or a provider-specific retention promise beyond the configured provider’s documented boundary.

## Limits and transport contract

These values are product constraints, not suggestions. The host is authoritative; client-side checks only improve feedback.

| Constraint              |                                                          Required value |
| ----------------------- | ----------------------------------------------------------------------: |
| Media class             |                                                       Still images only |
| Accepted source formats |                                             JPEG, PNG, WebP, HEIC, HEIF |
| Rejected formats        | GIF/APNG/animated WebP, SVG, PDF, TIFF, RAW/DNG, audio, video, archives |
| Maximum images per turn |                                                                       4 |
| Maximum source size     |                                                        15 MiB per image |
| Maximum source batch    |                                                                  30 MiB |
| Maximum decoded area    |                                                           60 megapixels |
| Maximum source edge     |                                                               12,000 px |
| Normalized output       |                                            JPEG or PNG only, 8-bit sRGB |
| Normalized longest edge |                                                                2,000 px |
| Maximum normalized size |                                         2 MiB per image, 8 MiB per turn |
| Parallel uploads        |                                                                       2 |
| Uncommitted host TTL    |                                                              10 minutes |
| Upload-ticket start TTL |                                                              90 seconds |
| Upload body deadline    |                                    120 seconds after ticket consumption |
| Rate limit              |            12 attachments per 5 minutes and 120 MiB per hour per device |
| Quarantine quota        |                     30 MiB per device; 256 MiB relay-wide, configurable |

### End-to-end flow

1. The browser copies selected `File` objects out of the native `FileList`, assigns random client IDs and selection ordinals, creates local object URLs, and performs bounded local validation. No request is made.
2. Send computes SHA-256 over the exact transfer bytes in a worker and calls `POST /api/attachment-sets` with a small manifest. The request uses a one-use `attachment:reserve` ticket.
3. The relay returns an opaque set ID and one one-use upload ticket per item. Each ticket is bound to principal, device, origin, session, epoch, prompt revision, submission ID, ordinal, exact byte length, digest, and media class.
4. The browser uploads at most two source bodies concurrently with XHR to `PUT /api/attachment-sets/{setId}/parts/{partId}`. The binary route has its own byte-counted reader and deadlines; global JSON and WebSocket limits do not change.
5. The relay streams each body to an extensionless `0600` quarantine object, verifies declared and streamed length plus digest, decodes it in a bounded worker, strips metadata, applies orientation, converts to 8-bit sRGB, and writes a normalized JPEG/PNG derivative. Source bytes are deleted as soon as the derivative commits.
6. The relay verifies that every member is owned, ready, unexpired, unused, correctly ordered, capability-compatible, and revision-compatible. It then consumes a fresh `prompt:submit` ticket and submits the caption plus normalized image blocks to Pi.
7. After positive Pi acknowledgement, the relay deletes normalized bytes, publishes redacted transcript cards, and the browser revokes object URLs and clears the exact draft. A confirmed rejection preserves the local draft. An ambiguous acknowledgement becomes `delivery-unknown` and is reconciled before resend.

### Reserve manifest

The reserve JSON is bounded by the existing 16 KiB limit and contains only references and declared metadata:

```json
{
  "submissionId": "random-128-bit-id",
  "sessionId": "opaque-session-id",
  "sessionEpoch": "opaque-epoch",
  "expectedPromptRevision": 184,
  "items": [
    {
      "clientId": "random-client-id",
      "ordinal": 1,
      "declaredType": "image/heic",
      "byteLength": 4832911,
      "sha256": "base64url-digest"
    }
  ]
}
```

The ticketed prompt submission carries `expectedPromptRevision`, an optional `attachmentSetId`, and ordered `attachmentIds`; it never carries pixels, base64, filenames, paths, or browser object URLs. Reusing a submission ID with different text, ordered attachments, or normalized digests returns a conflict. Reusing an identical submission ID returns the authoritative prior result.

The host-to-Pi request is the only permitted pixel-bearing transport:

```text
prompt | steer | follow_up
message: caption or empty string
images: ordered [{ type: image, mimeType: image/jpeg|image/png, data: base64 }]
```

The base64 exists only in the host-to-Pi request. It must not enter browser HTTP JSON, the sync WebSocket, SQLite, JSONL session state, logs, analytics, crash reports, browser storage, or any Pi workspace path.

## User-facing behavior

### Capability gating and composer affordance

- The host exposes `imageIn` for the active model and a media policy in the authoritative runtime snapshot. The client does not infer capability from a model name.
- If the host media capability is off, the Photo Library and Take Photo rows and all upload routes are absent. The existing composer remains text-only and its current behavior is unchanged.
- If media is enabled but the active model cannot view images, the photo actions may be opened and a local draft may be retained, but Send is blocked with **“Current model can’t view photos.”** The draft is never silently discarded or sent without images.
- The existing `+` is reused. Its accessible name is **“Add photo, mode, or command.”** The hit area is at least 44×44 CSS px.
- The popover order is:
  1. **Photo Library**
  2. **Take Photo**
  3. **“Photos stay on this iPhone until Send. Pi and its model provider receive a prepared copy.”**
  4. Divider
  5. Existing Mode controls
  6. Existing Commands controls
- The two photo actions use React Aria `FileTrigger`. Photo Library accepts multiple `image/*` selections. Take Photo uses the rear camera (`defaultCamera="environment"`) and accepts one image. The native picker remains mounted until selection or cancellation is returned.

### Draft, validation, and local preview

- Selection never sends, reserves, uploads, or changes the transcript.
- Selected files append in native selection order. Reopening either picker adds to the existing draft.
- The draft contains no more than four items. A fifth item is not silently accepted or sent; the UI explains the four-photo limit and keeps the existing draft unchanged.
- Valid selections receive stable local ordinals and display as **Photo 1**, **Photo 2**, and so on. Original filenames are never displayed, logged, copied, or placed in an error object.
- The attachment rail is an ordered named list above the textarea, for example `Draft attachments, 2 items`. It has a 72 px standard height, 64×64 px thumbnails, 12 px radius, 3 px bone mat, carbon hairline, and 8 px gaps.
- The rail scrolls horizontally with a partial-next-item affordance. It has no hidden swipe action. At 320 CSS px or 200% text zoom it changes to full-width rows and the page never scrolls horizontally.
- Every remove control has a visible 24–28 px parchment disc inside a real 44×44 px hit target. Removal revokes that object URL and returns the remaining draft to the correct state.
- Local validation enforces count, source bytes, advertised type, and readable image structure as early as practical. Host validation remains authoritative. A rejected item stays as a generic tile with a stable reason until the user removes it.
- A supported HEIC/HEIF that WebKit cannot preview uses **“Photo · preview unavailable”**. It remains sendable if host validation and normalization accept it.
- `File`, base64, tickets, hashes, original filenames, and object URLs live only in process-local memory. They never enter React persistence, localStorage, IndexedDB, Cache Storage, query caches, analytics, or error payloads.
- The app revokes every object URL on removal, successful acknowledgement, session switch, logout, app lock, and unmount. Strict Mode must not double-register listeners or leak URLs, XHRs, timers, or callbacks.

### Preview dialog

- Tapping a tile opens a full-screen React Aria `Modal`/`Dialog` on a bone canvas, with the image using `object-fit: contain`.
- The dialog has visible **Close** and **Remove** actions. It has no download or share action and no server URL.
- Pinch/pan may work, but visible Zoom In, Zoom Out, and Close controls provide single-pointer alternatives.
- Closing restores focus to the tile that opened it. Escape closes the preview without discarding the draft; if the preview is not open, Escape closes the popover without discarding the draft.

### Caption and send

- Captionless photo turns are valid. Image-only turns submit an empty text message; no synthetic caption is added.
- Software-keyboard Return inserts a newline. Hardware `⌘ Enter` sends. Send is ignored while IME composition is active.
- Before a request failure, the composer shows no optimistic upload progress. A real request failure, not `navigator.onLine`, determines the offline state.
- During a running turn, the existing **Steer** or **Later** choice applies to the same ordered image set. The Pi `steer`/`follow_up` image fields receive the images in selection order.
- Plan mode keeps the photo affordance and draft visible. Its static cue remains **“Plan · read-only.”** Image content is untrusted input and cannot grant filesystem, process, network, shell, edit, approval, or mode authority.
- If the active model changes to text-only while a draft or upload exists, the draft is retained, the set is invalidated or canceled, and Send is blocked until the user chooses an image-capable model or removes the photos.
- A batch is atomic. Any invalid, rejected, failed, mismatched, stale, expired, or unavailable member blocks commit; there is no silent partial send.
- Removing an item during upload aborts its XHRs, invalidates generation tokens, requests ticketed batch cancellation, and returns the remaining items to `local-ready`.
- If iOS kills the PWA, only text is restored. The composer says **“Photos need to be attached again.”** Raw media is never persisted to emulate background upload.

### Transcript and notification behavior

The durable attachment block is allowlisted to the following fields only:

```text
kind: attachment
role: user
mediaKind: image
ordinal: positive integer
status: delivered | delivery-unknown
previewRetained: false
revision: positive integer
```

The UI renders **“Photo 1 · Delivered to Pi”** and secondary copy **“Preview not retained”**, followed by the caption beneath the attachment cards. Image-only turns render cards without an empty text bubble. Copy/export emits **`[photo attachment redacted]`**. Push notifications say **“Attachment sent”** and never expose a filename or image description. Old clients render the new block as an unknown redacted block.

## Complete UI state model

`capability-off` is a host configuration state rather than a draft state: the photo rows and upload routes do not exist. The following are the complete user-visible states once media is enabled.

| State                    | Visible behavior                                          | Allowed action and transition                                                   |
| ------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `idle`                   | Normal composer; no attachment rail                       | Open `+` or type                                                                |
| `menu-open`              | Photo actions, disclosure, Mode, Commands                 | Choose a source or dismiss; focus returns to `+`                                |
| `picker-active`          | Native iOS picker/camera owns interaction                 | Select or cancel; cancellation changes nothing and restores focus               |
| `local-validating`       | Immediate tile with **“Checking…”**                       | Remove; valid item becomes `local-ready`, invalid item becomes `local-rejected` |
| `local-ready`            | Local preview and **“Ready on this iPhone”**              | Preview, remove, edit caption, or Send                                          |
| `local-rejected`         | Generic tile with stable reason; no filename              | Remove or choose another; any rejected member blocks Send                       |
| `model-blocked`          | Tiles retained; **“Current model can’t view photos.”**    | Change model or remove photos                                                   |
| `waiting-for-connection` | Draft preserved; no optimistic progress                   | Retry or cancel                                                                 |
| `authorizing`            | **“Securing upload…”**                                    | Cancel the batch                                                                |
| `uploading`              | Per-tile determinate progress; maximum two active uploads | Cancel the batch                                                                |
| `server-checking`        | **“Preparing securely…”**                                 | Cancel the batch                                                                |
| `host-ready`             | Checkmark; prompt commit starts immediately               | Cancel only before commit starts                                                |
| `committing`             | Caption and attachment order frozen                       | Wait; no duplicate Send                                                         |
| `stale-revision`         | **“Conversation changed. Review and send again.”**        | Refresh, review, and explicitly Send again                                      |
| `retryable-failure`      | Network or temporary error; local files retained          | Explicit Retry or remove                                                        |
| `expired`                | Host set expired; local files may remain                  | Explicit Send again                                                             |
| `canceling`              | Batch dimmed; late callbacks ignored                      | Wait for cancellation acknowledgement                                           |
| `delivery-unknown`       | **“Delivery could not be confirmed”**                     | Reconcile status; never auto-resend                                             |
| `sent`                   | Draft clears; redacted cards appear in transcript         | Continue composing                                                              |

Every phase change is announced through one persistent `role="status" aria-live="polite"` region. Blocking errors use one visible `role="alert"` and remain inline. Progress never moves focus. Removing a tile focuses the next tile, then the previous tile, then `+`.

## Security and redaction requirements

This feature is a controlled exception to read-only-by-default, not a relaxation of it.

### Authority and policy

- Media routes are registered only when the host enables `PI_REMOTE_MEDIA_ENABLED=1`; the phone cannot enable them. With the flag off, route lookup returns the existing not-found/read-only behavior.
- Reserve, upload, cancel, and prompt commit are separate exact actions with separate one-use tickets. Read-only status reconciliation is authenticated and scoped to the submitting device and opaque set ID.
- Every mutation binds the authenticated principal, enrolled device, exact origin, session, epoch, prompt revision, submission ID, ordinal, byte length, digest, and media class as applicable.
- Reservation requires a live foreground sync socket, host-enabled media, host-authoritative plan policy, and an active image-capable model.
- All DTOs use exact-key guards. Unknown fields, malformed IDs, wrong types, ticket replay, expiry, wrong origin, wrong device, wrong session, stale revision, digest mismatch, model mismatch, and plan-policy mismatch fail closed without Pi invocation.
- The host/extension remains the sole source of plan-mode policy. Client-supplied mode claims are ignored.
- Image content is explicitly untrusted user data. Instructions visible inside an image cannot authorize tools, permissions, approvals, policy changes, or mode changes.

### Network and ingress

- Keep the existing tailnet-only, loopback-backed application origin. Do not add a public listener or third-party object store.
- Keep the existing 16 KiB JSON and 64 KiB WebSocket limits. The binary upload route has its own byte-counted streaming reader, exact `Content-Length` requirement, overflow detection, and timeouts.
- Consume the upload ticket before reading the body. Stream to a random extensionless quarantine object; never buffer a full source body in route middleware and never make a partial object addressable.
- Ignore and never log source filenames, multipart names, browser MIME claims, extensions, or `accept` attributes. MIME sniffing and a successful full decode are required.
- Reject active formats, animation, malformed or polyglot files, truncated data, excessive dimensions/channels/frames, and decompression bombs.
- Apply per-device rate and byte limits, concurrency limits, device quota, and relay-wide pressure limits without revealing another user’s usage.

### Quarantine, normalization, and cleanup

- Quarantine is outside the repository, webroot, transcript database, SQLite directory, and static-file tree. Its directory is `0700`, objects are `0600`, and names are opaque generated identifiers.
- Use an unprivileged resource-limited decoder/worker with a five-second per-image and fifteen-second per-batch wall-clock limit. Enforce 60 MP, 12,000 px, four-channel, and one-frame ceilings.
- Apply orientation and convert to 8-bit sRGB. Strip EXIF, GPS, IPTC, XMP, embedded thumbnails, comments, dates, device/camera data, depth maps, and Live Photo associations.
- Write PNG only when transparency is required and the result fits 2 MiB. Otherwise write JPEG at quality 88, then reduce quality and dimensions deterministically until the limit is met.
- Delete source bytes immediately after the sanitized derivative commits. Delete normalized bytes after acknowledgement, cancellation, expiry, revocation, logout, epoch change, shutdown, or delivery ambiguity. Sweep interrupted and abandoned bodies on startup.
- Secure erasure is not promised on modern filesystems. The product promise is bounded transient storage plus unlinking, not forensic overwriting.

### Storage, redaction, and observability

- Raw or normalized pixels never enter IndexedDB, Cache Storage, localStorage, the service worker, transcript database, backups, metrics, crash reports, Git-visible paths, or paths available to Pi tools.
- The transcript projector uses an explicit allowlist for attachment blocks. Pattern-based text redaction is not the boundary.
- Forbidden durable or observable fields include pixels, base64, thumbnail, source/normalized filename, source MIME claim, exact byte size, digest, attachment ID, URL, path, EXIF, OCR, caption generated from the image, provider payload, decoder error, and bearer-like token.
- Logs may record only an error code, attachment count, coarse size bucket, and latency bucket. Authorization headers, tickets, bodies, IDs, hashes, source names, paths, and decoder exceptions are suppressed.
- The service worker bypasses every attachment route and never caches attachment requests, responses, tickets, status results, or bodies. The read-only cache rejects any attachment-bearing durable object.
- App-switcher/background privacy covering hides local thumbnails when the PWA is not visible.

### Pi and provider boundary

- Pi receives only host-normalized JPEG/PNG image blocks in memory, in selection order. No path fallback exists if the image bridge fails.
- Release is blocked until the pinned Pi build proves that image content is not persisted in its JSONL session or echoed through stdout events. An in-memory session manager, `--no-session`, or relay-owned redacting session adapter is required.
- If Pi echoes base64 into an event, the current 1 MiB JSONL record cap can fail before projection. The host capability remains disabled until echo suppression is proven before the framed relay path.
- The first-use disclosure names that Pi and its configured model provider receive a prepared copy and points to the configured provider’s retention policy. Relay deletion does not delete provider-side processing or retention.

## Dependencies and affected areas

| Area                     | Required change                                                                                                                                                                                                                 | Dependency or gate                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Protocol                 | Add media policy/model capability DTOs, attachment-set/status DTOs, prompt attachment references, redacted attachment block, strict guards, and exports in `packages/pi-rpc-protocol/src/types.ts`, `guards.ts`, and `index.ts` | Exact-key and size-bound tests must pass before any route is enabled                           |
| Relay HTTP/auth          | Add host-gated reserve, binary PUT, status, cancel, and prompt-commit handling in `apps/pi-remote-relay/src/http/server.ts`; add action names in `auth/policy.ts`; bind tickets through `auth-service.ts`                       | Loopback/origin/principal/session/foreground-socket checks remain mandatory                    |
| Relay attachment service | Add quarantine ownership, streaming limits, normalization, reaper, quotas, rate limits, and lifecycle handling under `apps/pi-remote-relay/src/attachments/`                                                                    | Approved decoder with HEIC/HEIF support and resource limits; no raw bytes in SQLite            |
| Relay/Pi bridge          | Extend `PromptService` and the RPC supervisor adapter to load only normalized bytes and send `images` on `prompt`, `steer`, and `follow_up`                                                                                     | Pinned Pi build must prove image acceptance, no persistence, and no event echo                 |
| Relay transcript         | Extend `TranscriptProjector`, `store/redaction.ts`, and `RelayStore` to allowlist redacted cards only                                                                                                                           | Old clients must safely treat the new kind as unknown/redacted                                 |
| Runtime capability       | Extend the host-confirmed runtime snapshot with active model `imageIn` and the host media policy; revision advances on accepted user/runtime mutations, not streaming token events                                              | Text-only model and stale revision behavior must be authoritative                              |
| Web composer             | Extend `SessionComposer.tsx`, add local draft/submit/rail/dialog components, and wire `App.tsx` and `state.ts`                                                                                                                  | React 19, React Aria, existing composer controls, and fixed visual system remain authoritative |
| Web transport/cache      | Extend `relay.ts`; update `public/service-worker.js` and `src/cache.ts` to exclude attachment traffic and data                                                                                                                  | No attachment request or response may be cacheable                                             |
| Web styling              | Extend `style.css` for rail, dialog, status, safe area, VisualViewport, 320 px/200% reflow, light/dark, and reduced motion                                                                                                      | Bone/carbon/clay, Inter, Source Serif 4, and WCAG AA remain fixed                              |
| Verification             | Add protocol, relay security, normalization, lifecycle, web DOM, Strict Mode, and CDP coverage plus real iPhone tests                                                                                                           | Exact 390 CSS px CDP screenshots in light and dark are required in every phase                 |

Release gates that must be resolved before enabling the host flag are the pinned Pi persistence/echo probe, authoritative model capability, prompt-revision semantics, HEIF decoder support on production hosts, Steer/Later image acknowledgement, provider-retention disclosure, and real-device iOS lifecycle behavior.

## Acceptance criteria

Each criterion has a required objective check. A phase is not accepted on visual inspection alone.

| Pass condition                                                               | Required check                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The repository typechecks without changing existing text behavior.           | Run `npm run typecheck`, `npm run test`, and `npm run test:web`; all exit 0.                                                                                                                                                                                     |
| Media disabled is fail-closed.                                               | Relay integration test proves no attachment route is registered and a 390 px light and dark CDP screenshot shows no photo rows or attachment affordance.                                                                                                         |
| The `+` control has the exact accessible name and required order/disclosure. | DOM assertion checks **“Add photo, mode, or command.”**, Photo Library, Take Photo, disclosure text, divider, Mode, and Commands in order.                                                                                                                       |
| Native source intents are distinct.                                          | DOM assertion checks two React Aria file triggers; an on-device step selects multiple library images and captures exactly one rear-camera image.                                                                                                                 |
| Selecting does not mutate remote state.                                      | Browser request log and unit test show no reserve, upload, cancel, prompt, or transcript request before Send.                                                                                                                                                    |
| Supported and rejected source classes are enforced.                          | Unit/integration fixtures cover JPEG, PNG, WebP, HEIC, HEIF and reject GIF/APNG/animated WebP, SVG, PDF, TIFF, RAW/DNG, audio, video, archives, spoofed MIME, renamed HTML, and truncated images.                                                                |
| All size, pixel, count, concurrency, TTL, and quota limits are exact.        | Boundary tests cover 15 MiB/image, 30 MiB/batch, 60 MP, 12,000 px, four images, two concurrent PUTs, TTLs, rate windows, and quotas.                                                                                                                             |
| Selection order and filenames are safe.                                      | DOM assertion shows Photo 1…Photo 4 in selection order and never exposes a fixture filename; relay assertions preserve ordinal order.                                                                                                                            |
| Local object URLs are transient and leak-free.                               | Strict Mode test spies on `URL.createObjectURL`/`revokeObjectURL` and proves cleanup on remove, acknowledgement, session switch, logout, app lock, and unmount.                                                                                                  |
| Preview is accessible and local-only.                                        | DOM assertion finds a modal/dialog with Close, Remove, Zoom In, and Zoom Out, no Download/Share, no URL, and an empty thumbnail `alt`.                                                                                                                           |
| Small screens and both themes remain usable.                                 | True 390 CSS px CDP screenshots pass in light and dark; a 320 px/200% zoom check proves no page-level horizontal scroll and all actions remain reachable.                                                                                                        |
| HEIC preview failure does not incorrectly reject send.                       | Unit test renders **“Photo · preview unavailable”** while the host submission path still accepts a supported HEIC fixture.                                                                                                                                       |
| Model capability is authoritative.                                           | Runtime fixture with `imageIn: false` retains the draft and asserts **“Current model can’t view photos.”** with no commit request; a model change invalidates any in-flight set.                                                                                 |
| Plan mode is preserved and enforced by the host.                             | DOM assertion retains the attachment rail and **“Plan · read-only”**; negative integration test proves an image cannot authorize a protected tool family.                                                                                                        |
| Caption and keyboard semantics are correct.                                  | DOM/keyboard test proves empty-caption image-only send, Return newline, `⌘ Enter` send, Escape close-without-discard, and no send during IME composition.                                                                                                        |
| Every state has honest controls and announcements.                           | Component test walks every state in the state table, asserts exact blocking copy where specified, one live status region, one inline alert for blocking errors, and no focus movement from progress.                                                             |
| Reserve is bound to the explicit action and current authority.               | Relay integration tests reject missing/replayed/expired/wrong-origin/wrong-device/wrong-session/stale-revision/model-mismatch/plan-mismatch tickets before retaining bytes or invoking Pi.                                                                       |
| The binary lane is bounded and does not weaken existing transports.          | HTTP tests require exact `Content-Length`, reject absent/overflow/mismatched length, enforce deadlines, and prove global 16 KiB JSON and 64 KiB WebSocket limits are unchanged.                                                                                  |
| Quarantine and normalization are safe.                                       | Security fixtures prove outside-webroot `0700`/`0600` storage, MIME sniff/full decode, orientation, 8-bit sRGB, 2,000 px output, metadata stripping, active/animated/polyglot/decompression-bomb rejection, and source deletion after derivative commit.         |
| No partial object is addressable.                                            | Failure-injection test interrupts upload, digest check, decode, normalization, and cancellation, then asserts no retrievable source or derivative remains.                                                                                                       |
| Commit is atomic and revision checked.                                       | Integration test rejects any failed member, stale revision, expired set, wrong ordinal, digest mismatch, or duplicate item without a partial prompt; refresh plus explicit Send succeeds after stale review.                                                     |
| Pi receives the correct content shape.                                       | RPC spy asserts ordered normalized JPEG/PNG image blocks on prompt, steer, and follow-up; image-only text is empty; no path fallback is attempted.                                                                                                               |
| Pi acknowledgement lifecycle is correct.                                     | Tests prove positive acknowledgement deletes host bytes and publishes cards, confirmed rejection retains the draft, and dropped acknowledgement becomes `delivery-unknown` with no automatic retry.                                                              |
| Duplicate Send is idempotent.                                                | Double-activation and same-submission tests produce one Pi prompt; same submission ID with changed text or digests returns conflict.                                                                                                                             |
| Transcript and export are structurally redacted.                             | Protocol/store tests reject attachment DTOs containing pixels, base64, names, MIME claims, exact sizes, hashes, IDs, URLs, paths, EXIF, OCR, provider payloads, or decoder errors; UI/export shows **“Preview not retained”** and `[photo attachment redacted]`. |
| Service worker and read-only cache never see media.                          | Browser Cache Storage inspection and `service-worker.js` tests find no attachment request/response/ticket/status; `cache.ts` rejects attachment-bearing objects.                                                                                                 |
| Logs and workspace remain clean.                                             | Negative test scans logs, SQLite, sync frames, push payloads, exports, crash fixtures, Pi-visible text, and workspace snapshots for planted filename, GPS, camera model, timestamp, marker, path, token, pixel, and base64 values.                               |
| Cancellation cannot be resurrected by a late callback.                       | Upload race test removes an item, aborts XHR, invalidates its generation token, and proves no later transition reaches ready or commit.                                                                                                                          |
| App lifecycle behavior is safe.                                              | On-device step backgrounds/kills the installed PWA, returns to the session, verifies text restoration only and **“Photos need to be attached again.”**, then verifies fresh picker selection works.                                                              |
| Accessibility and localization meet the fixed bar.                           | On-device/manual checks cover VoiceOver, Switch Control, RTL Arabic or Hebrew, Japanese, +40% pseudo-locale, localized plural/size formatting, reduced motion, 44×44 targets, and safe-area keyboard geometry.                                                   |
| The Pi/provider security gate is explicit.                                   | Release checklist records a successful pinned-Pi image prompt probe, no JSONL persistence/echo, HEIF decoder verification, Steer/Later acknowledgement, and first-use provider-retention disclosure before setting `PI_REMOTE_MEDIA_ENABLED=1`.                  |
