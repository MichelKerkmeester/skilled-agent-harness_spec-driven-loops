> **Deep research — external-CLI multi-executor run.** 15 independent iterations (5 × GPT 5.6 SOL high (--search, cli-codex), 5 × Grok 4.6 xhigh (cli-cursor), 5 × DeepSeek v4 Flash (opencode-go gateway)), no early convergence. Synthesis of all passes into one build-ready decision.
> **Provenance:** produced by external-CLI orchestration, NOT the `/deep:research` state-machine runtime — so runtime state artifacts (`deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`, observability, deltas, lineages) are intentionally absent. See `PROVENANCE.md`.
> **Canonical:** this file (`research.md`) is the synthesized output; per-pass findings live in `iterations/iteration-NNN.md`.

---

# F5-media-upload — Synthesis

## 1. Decision

Build a photos-only attachment lane: the existing composer `+` opens explicit **Photo Library** and **Take Photo** actions, selection remains local until the user presses Send, and the draft supports up to four removable previews plus an optional caption. On Send, Pi Remote uses dedicated revision-bound, one-use upload tickets and bounded binary PUTs; the relay normalizes each image in quarantine, then supplies sanitized JPEG/PNG bytes to Pi through its existing `images` RPC field—never through transcript JSON or a workspace path. The durable transcript contains metadata-minimal redacted cards, not pixels, filenames, hashes, paths, or reusable preview URLs. This combines Claude’s draft-and-review interaction with Kimi Code’s capability gating and normalization discipline, while rejecting eager upload, inline base64 HTTP, object storage, and host-file delivery as unnecessarily persistent or unsafe (iter-01, iter-03, iter-05, iter-07, iter-09). Video, audio, PDF, GIF animation, arbitrary files, and cross-device image replay are explicitly outside v1.

## 2. Build spec

### 2.1 Scope and enforceable limits

| Constraint | Required value |
|---|---:|
| Media class | Still images only |
| Accepted source formats | JPEG, PNG, WebP, HEIC, HEIF |
| Rejected | GIF/APNG/animated WebP, SVG, PDF, TIFF, RAW/DNG, audio, video, archives |
| Maximum images per turn | 4 |
| Maximum source size | 15 MiB/image |
| Maximum source batch | 30 MiB |
| Maximum decoded area | 60 megapixels |
| Maximum source edge | 12,000 px |
| Normalized output | JPEG or PNG only, 8-bit sRGB |
| Normalized longest edge | 2,000 px |
| Maximum normalized size | 2 MiB/image, 8 MiB/turn |
| Parallel uploads | 2 |
| Uncommitted host TTL | 10 minutes |
| Upload-ticket start TTL | 90 seconds |
| Upload body deadline | 120 seconds after ticket consumption |
| Rate limit | 12 attachments/5 minutes and 120 MiB/hour/device |
| Quarantine quota | 30 MiB/device; 256 MiB relay-wide, configurable |

These limits preserve screenshot legibility while remaining materially tighter than consumer-cloud limits. The 2,000 px normalization follows Pi/Kimi precedent; four images covers the important “compare screenshots” workflow without turning a coding-agent prompt into a photo album (iter-01, iter-04, iter-06, iter-09).

### 2.2 Client components

```text
SessionComposer
├── ComposerTools
│   └── AttachMenuSection
│       ├── PhotoLibraryTrigger
│       └── CameraTrigger
├── AttachmentRail
│   └── AttachmentTile
├── AttachmentPreviewDialog
├── PromptTextarea
├── UploadStatusRegion
└── PrimaryAction

AttachmentDraftProvider
├── useAttachmentDraft
├── useAttachmentSubmission
└── Map<clientId, File> held outside serializable React state
```

Implementation responsibilities:

- `AttachMenuSection`: first group in the existing `+` popover, followed by a divider, Mode, and Commands.
- `PhotoLibraryTrigger`: React Aria `FileTrigger`, `acceptedFileTypes={["image/*"]}`, `allowsMultiple`, no camera hint.
- `CameraTrigger`: separate `FileTrigger`, `acceptedFileTypes={["image/*"]}`, `defaultCamera="environment"`, one image.
- Keep each `FileTrigger` mounted until selection or cancellation returns; do not close/unmount the popover before native picker activation.
- `AttachmentDraftProvider`: owns ordered render metadata in a reducer and the actual `File` objects in a ref-backed map. Never place `File`, base64, tickets, hashes, original filenames, or blob URLs in persistent stores, query caches, analytics, or error objects.
- `AttachmentRail`: ordered semantic list above the textarea.
- `AttachmentPreviewDialog`: local, pre-send inspection only; no download or share action.
- `useAttachmentSubmission`: hashing, ticket acquisition, XHR transfer, status reconciliation, cancellation, prompt commit, and cleanup.
- The service worker must bypass every attachment route and never cache attachment requests, responses, tickets, or status results.

Relay-side modules:

- `AttachmentService`: reservation ownership, quarantine, validation, normalization, lifecycle, and quotas.
- `AttachmentReaper`: TTL, logout, revocation, epoch-change, shutdown, and crash-recovery cleanup.
- `PiImageBridge`: normalized buffers to `PromptCommand.images`.
- `AttachmentTranscriptProjector`: allowlisted pixel-free blocks only.

### 2.3 Composer interaction

The existing `+` and primary controls become at least 44×44 CSS px. Its accessible name becomes **“Add photo, mode, or command.”**

Popover order:

1. **Photo Library**
2. **Take Photo**
3. Quiet disclosure: **“Photos stay on this iPhone until Send. Pi and its model provider receive a prepared copy.”**
4. Divider
5. Existing Mode controls
6. Existing Commands

Behavior:

- Picker selection never sends or uploads.
- Valid selections append in selection order. Reopening the picker adds to the existing draft.
- Picker cancellation changes nothing and restores focus to `+`; it does not show an error.
- Original filenames are never displayed. Tiles are named `Photo 1`, `Photo 2`, and so on.
- Captionless photo turns are valid.
- A model switch to a text-only model retains the local draft but blocks Send with **“Current model can’t view photos.”** Never silently switch models or omit the images.
- If the host media capability is off, the two rows and upload routes do not exist.
- Plan mode does not hide attachments: inspecting an image is input, not a workspace write. The static composer cue remains **“Plan · read-only.”**
- During a running turn, attachments follow the existing **Steer** or **Later** selection. Pi’s `steer`/`follow_up` image fields receive the same ordered image set.
- Software-keyboard Return inserts a newline. Hardware `⌘ Enter` sends; Escape closes the popover or preview but never discards a draft. Ignore Send while IME composition is active.
- No required long-press, swipe, or drag gesture. Selection order is send order; v1 has no reordering.

### 2.4 Attachment rail and preview

Standard layout:

- Rail height: 72 px inside the composer, above the textarea.
- Thumbnail: 64×64 px, `object-fit: cover`, 12 px radius.
- Treatment: 3 px bone mat plus a carbon hairline, making the photo feel placed on parchment.
- Gap: 8 px.
- Horizontal native scrolling with a partial-next-item affordance; no hidden swipe action.
- Remove control: 24–28 px visible parchment disc with a real 44×44 px hit area.
- Tile tap: full-screen React Aria `Modal`/`Dialog`, bone canvas, `object-fit: contain`, visible Close and Remove actions.
- Pinch/pan may work in preview, but visible Zoom In, Zoom Out, and Close controls provide single-pointer alternatives.
- At 320 CSS px or 200% text zoom, a container query converts tiles into full-width rows with thumbnail, status, and actions; the page itself never scrolls horizontally.

Local previews use `URL.createObjectURL()`. Revoke every URL on removal, successful acknowledgement, session switch, logout, app lock, or unmount. If WebKit cannot preview a supported HEIC/HEIF source, show a neutral `Photo · preview unavailable` tile; host support—not local preview support—determines whether it can be sent.

### 2.5 Complete state model

| State | Visible behavior | Allowed action |
|---|---|---|
| `idle` | Normal composer | Open `+`, type |
| `menu-open` | Attach, Mode, Commands | Choose source, dismiss |
| `picker-active` | System UI owns interaction | Select or cancel |
| `local-validating` | Immediate tile, `Checking…` | Remove |
| `local-ready` | Local preview, `Ready on this iPhone` | Preview, remove, caption, Send |
| `local-rejected` | Generic tile plus stable reason | Remove or choose another |
| `model-blocked` | Tiles retained; capability explanation | Change model or remove |
| `waiting-for-connection` | Draft preserved; no optimistic progress | Retry or cancel |
| `authorizing` | `Securing upload…` | Cancel batch |
| `uploading` | Per-tile determinate progress | Cancel batch |
| `server-checking` | `Preparing securely…` | Cancel batch |
| `host-ready` | Checkmark; prompt commit begins immediately | Cancel only before commit starts |
| `committing` | Exact text and attachment order frozen | Wait |
| `stale-revision` | `Conversation changed. Review and send again.` | Refresh, review, explicit Send |
| `retryable-failure` | Network/temporary error, local files retained | Explicit Retry or remove |
| `expired` | Host set expired; local files may remain | Explicit Send again |
| `canceling` | Batch dimmed; late callbacks ignored | Wait |
| `delivery-unknown` | `Delivery could not be confirmed` | Reconcile status; never auto-resend |
| `sent` | Draft clears; transcript gets redacted cards | Continue composing |

Rules:

- A batch is atomic. Any rejected, failed, mismatched, or expired member blocks commit; no silent partial send.
- Removing an item during upload aborts the XHRs, invalidates their generation tokens, requests ticketed batch cancellation, and returns the remaining files to `local-ready`.
- A real request failure—not `navigator.onLine`—determines offline state.
- After an ambiguous request, query the read-only submission/status endpoint. Retry only after the host proves that the prior mutation did not commit.
- If iOS kills the PWA, restore text only and say **“Photos need to be attached again.”** Raw media is never persisted merely to emulate background upload.

### 2.6 Upload and delivery flow

#### A. Local preparation

On selection:

1. Copy `File` objects out of the browser `FileList`.
2. Assign random client IDs and selection ordinals.
3. Enforce count, source-byte, and advertised type limits.
4. Create local preview URLs.
5. Do not read the entire image as a data URL.
6. On Send, compute SHA-256 over the exact transfer bytes in a worker.

Client-side downscaling may later be added as a bandwidth optimization, but it is not the security boundary. Host validation and re-encoding always run.

#### B. Reserve an attachment set

`POST /api/attachment-sets`

The JSON remains under the existing 16 KiB limit and carries:

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

This request consumes a normal one-use `attachment:reserve` ticket. It requires:

- authenticated application session;
- exact origin and enrolled device;
- live foreground sync socket;
- host-enabled media capability;
- host-authoritative plan enforcement;
- active model image capability;
- exact session epoch and prompt revision;
- count, byte, rate, and quota compliance.

The response supplies an opaque set ID and one one-use upload ticket per item. Each ticket is bound to principal, device, origin, session, epoch, prompt revision, submission ID, ordinal, exact byte length, digest, and media class.

The prompt revision must advance on accepted user/runtime mutations—not streaming token events—so an active response cannot continuously invalidate a draft.

#### C. Upload raw bytes

For each item, at most two concurrently:

```http
PUT /api/attachment-sets/{setId}/parts/{partId}
Authorization: UploadTicket <one-use-token>
Content-Type: application/octet-stream
Content-Length: <exact-length>
Digest: sha-256=<digest>
```

Use XHR for upload progress. The relay must:

1. Authenticate and consume the bound ticket before reading.
2. Require exact `Content-Length`; return `411` if absent.
3. Reject declared or streamed overflow immediately.
4. Stream to a random extensionless quarantine object—never buffer the whole body in route middleware.
5. Recompute and compare the digest.
6. Ignore and never log any multipart or source filename.
7. Recheck the prompt revision after the body; if stale, delete the whole set and return `409`.
8. Make no partial object addressable.
9. Delete interrupted, mismatched, rejected, or abandoned bodies.

Do not raise the global JSON or WebSocket body limits.

#### D. Normalize in quarantine

Quarantine must be outside the repository, webroot, transcript database, and static-file tree:

- directory `0700`, objects `0600`;
- opaque generated identifiers;
- unprivileged, resource-limited worker/process;
- five-second image and fifteen-second batch wall-clock limits;
- 60 MP, 12,000 px, four-channel, and one-frame ceilings;
- MIME sniff plus successful full decode; never trust extension or `Content-Type`;
- reject active, animated, malformed, polyglot, decompression-bomb, or unsupported inputs;
- apply orientation;
- convert to 8-bit sRGB;
- strip EXIF, GPS, IPTC, XMP, embedded thumbnails, comments, dates, device/camera data, depth maps, and Live Photo associations;
- output PNG only when transparency is required and the result fits 2 MiB; otherwise JPEG quality 88, then reduce quality/dimensions deterministically until within budget;
- delete source bytes immediately after the sanitized derivative commits.

#### E. Commit the prompt

Extend the exact-key-guarded `PromptSubmitCommand` with:

```ts
expectedPromptRevision: number;
attachmentSetId?: string;
attachmentIds?: readonly string[];
```

The existing prompt endpoint stays small and consumes a fresh one-use `prompt:submit` ticket. Its idempotency record binds:

- submission ID;
- exact text hash;
- ordered attachment IDs and normalized digests;
- device, principal, origin, session, and epoch;
- expected prompt revision;
- selected model capability;
- host-authoritative plan-mode policy.

Before invoking Pi, atomically verify that every attachment is owned, ready, unexpired, unused, correctly ordered, and revision-compatible. Reusing an identical submission ID returns its authoritative prior result; reusing it with different content returns `409`.

#### F. Deliver bytes to Pi

The host adapter reads sanitized derivatives into memory and invokes Pi with:

```ts
{
  type: "prompt" | "steer" | "follow_up",
  message: caption,
  images: [
    { type: "image", mimeType: "image/jpeg", data: "<base64>" }
  ]
}
```

Images remain in selection order. Image-only turns use an empty text message; no hidden synthetic caption is added. Base64 exists only inside the host-to-Pi request and must never enter HTTP JSON, WebSocket traffic, logs, SQLite, analytics, crash reports, or browser storage. No image is written into the project or exposed as a path to Pi tools.

After positive Pi acknowledgement:

1. Delete source and normalized bytes.
2. Append redacted transcript blocks.
3. Revoke local object URLs.
4. Clear the exact draft.
5. Increment the prompt revision.

After confirmed Pi rejection, preserve the local draft for explicit retry. After ambiguous acknowledgement, delete host bytes, mark `delivery-unknown`, reconcile before allowing resend, and never replay automatically.

### 2.7 Transcript contract

Durable attachment block:

```ts
interface RedactedAttachmentBlock {
  kind: "attachment";
  role: "user";
  mediaKind: "image";
  ordinal: number;
  status: "delivered" | "delivery-unknown";
  previewRetained: false;
  revision: number;
}
```

Forbidden fields include pixels, base64, thumbnail, source or normalized filename, source MIME claim, exact byte size, digest, attachment ID, URL, path, EXIF, OCR, caption generated from the image, provider payload, and decoder error.

Rendering:

- `Photo 1 · Delivered to Pi`
- secondary copy: `Preview not retained`
- caption beneath the attachment cards
- image-only turns render cards without an empty text bubble
- copy/export emits `[photo attachment redacted]`
- push notifications say `Attachment sent`, never a filename or description
- old clients treat the new kind as an unknown redacted block

V1 has no server preview endpoint. The full preview is available only before Send on the originating device.

### 2.8 Accessibility, localization, keyboard, and motion

- All controls have at least 44×44 px hit targets.
- Rail is a named list: `Draft attachments, 2 items`.
- Tile label: `Preview photo 2 of 3, ready, 1.4 megabytes`.
- Remove label: `Remove photo 2`.
- Thumbnail `<img>` uses `alt=""`; its enclosing button provides the name. Do not generate OCR or model-authored alt text.
- One persistent `role="status" aria-live="polite"` region announces selection, phase changes, 25/50/75/100% progress, readiness, and delivery.
- Blocking errors use one `role="alert"` announcement and remain visible inline.
- Progress never moves focus.
- Closing the popover or preview restores focus to its invoker. Removing a tile focuses the next tile, then the previous tile, then `+`.
- The transcript is a named `role="log"`; streaming assistant fragments should not be repeatedly announced.
- At 200% text and 320 CSS px, all labels and actions reflow without page-level horizontal scrolling.
- Use logical CSS properties, synchronized `lang`/`dir`, and React Aria `I18nProvider`. User captions use `dir="auto"`.
- Use localized plural messages and `Intl.NumberFormat` for counts, percentages, and sizes.
- Test English, a +40% pseudo-locale, Arabic or Hebrew RTL, and Japanese.

Visual system:

- Bone `#f8f8f6`, carbon ink, and the existing dark equivalents remain authoritative.
- Inter is used for controls, metadata, and statuses; Source Serif 4 remains reserved for conversational prose.
- Clay `#d97757` is not used as normal text or as the sole essential boundary: clay on bone is only about 2.94:1 (iter-03, iter-11).
- Clay may fill the send button or progress stroke only when paired with a carbon glyph, carbon outline, text, or shape that independently communicates state.
- Ready: carbon check plus `Ready`; uploading: progress plus text; rejected: warning icon plus reason.
- Popover: existing transition, at most 200 ms.
- Rail insertion: 160 ms opacity plus 4 px settle.
- Tile removal: 120 ms opacity/collapse.
- Progress: determinate 120 ms linear interpolation; no pulsing.
- Preview: 160 ms opacity transition on a parchment canvas, never a black cinematic surface.
- `prefers-reduced-motion: reduce`: no scale, translation, rotation, shimmer, or progress animation; use instantaneous state changes or ≤100 ms opacity.
- Use `viewport-fit=cover`, safe-area padding, and `VisualViewport` measurements so the taller composer remains above the iOS keyboard in Safari and installed-PWA modes.

## 3. Consensus vs divergence

### Consensus

Across the 15 passes, the strongest agreement was:

- Still images should ship before video or arbitrary files because Pi’s documented multimodal path is image-specific.
- Native file inputs through React Aria `FileTrigger` are the correct PWA boundary; a custom gallery or `getUserMedia` camera is unnecessary.
- Photo Library and Camera are separate intents.
- Selection must produce a reviewable composer draft; picking does not send a turn.
- The active model must authoritatively advertise image input; silent omission is unacceptable.
- HEIC/HEIF must be treated as normal iPhone ingress but converted before Pi/provider delivery.
- Server-side MIME sniffing, bounded decoding, orientation, metadata stripping, re-encoding, generated names, and outside-webroot quarantine are mandatory.
- Images must reach Pi as multimodal content, not as workspace paths.
- Base64 and pixels must never enter the transcript, WebSocket replay, browser cache, logs, or analytics.
- Plan mode remains enforced by the host/extension after the image is supplied; pixels can influence reasoning but never grant authority.
- Four images and approximately 2,000 px normalized detail are the best compromise between comparison workflows, screenshot readability, transport pressure, and model context (iter-01 through iter-10).

### Resolved divergences

- **Existing `+` versus a new paperclip:** reuse `+`. A separate 44 px control crowds the iPhone composer and diverges from Claude’s strongest pattern. The paperclip proposal from iter-09 remains a valid future usability test.
- **Local-only versus eager staging:** keep media local until Send. Eager staging improves latency and process-death recovery, but creates abandoned remote artifacts before the explicit mutation gesture.
- **Inline base64 versus a binary lane:** use a binary lane. Inline JSON conflicts with the existing 16 KiB cap, inflates payloads, weakens logging safety, and makes upload progress unreliable.
- **Host path versus Pi image blocks:** use image blocks. Paths create workspace/tool coupling and cross the plan-mode filesystem boundary.
- **Persistent thumbnails versus redacted transcript cards:** use metadata-only cards in v1. Blur is not redaction, and a preview endpoint would introduce another retention and authorization surface.
- **Strict 1,568 px/700 KiB versus 2,000 px/2 MiB:** use 2,000 px/2 MiB to preserve terminal text and UI detail. Provider-specific shrinking remains an adapter concern.

### Strong minority ideas worth keeping

- Add client-side downscale and metadata stripping as a bandwidth/privacy optimization, while still repeating normalization on the host (iter-01, iter-07, iter-09, iter-15).
- Introduce resumable `HEAD`/`PATCH` uploads if real-device testing shows 15 MiB PUTs routinely fail under iOS suspension (iter-04, iter-12).
- Store a tiny thumbhash—not a thumbnail—for cross-device visual continuity if metadata-only cards prove too austere (iter-06).
- Add a local crop/redact/markup tool for screenshots; it is valuable but should remain a separate feature (iter-04, iter-09).
- Offer **Send description without photo** for sensitive screenshots or constrained networks (iter-03).
- Add an optional privacy setting that hides even local draft thumbnails until explicitly revealed.
- Consider a dedicated ephemeral vision turn that injects only a user-approved textual result into the durable session (iter-03).
- Preserve an experimental read-only attachment mount for future non-image files, but keep it out of the photo path and require its own security design.

## 4. Security & redaction

This feature is a controlled exception to read-only-by-default, not a relaxation of it.

### Authority and policy

- Media routes are absent unless the host enables `PI_REMOTE_MEDIA_ENABLED=1`; the phone cannot enable them.
- Reserve, upload, cancel, and prompt commit are separate exact actions with separate one-use tickets.
- Every mutation binds the authenticated principal, enrolled device, exact origin, session, epoch, prompt revision, and operation-specific manifest.
- A live foreground sync socket is required before reservation.
- All DTOs retain exact-key guards; unknown keys fail closed.
- Upload never grants filesystem, process, network, shell, edit, or approval authority.
- The host extension remains the sole source of plan-mode policy. Client-supplied mode claims are ignored.
- Image content is explicitly labeled as untrusted user data. Instructions visible inside an image have no authority over tools, permissions, approvals, policy revision, or mode.
- Ticket replay, expiry, wrong-device use, stale revision, digest mismatch, model mismatch, and plan-policy mismatch perform no Pi invocation.

### Network and ingress

- Use the existing tailnet-only, loopback-backed application origin; do not create a public listener or third-party object store.
- The existing 16 KiB JSON and 64 KiB WebSocket limits remain unchanged.
- The upload route has its own byte-counted streaming reader and timeouts.
- Require `Content-Length`, but continue counting streamed bytes to defeat false declarations.
- Reject active formats, animation, malformed files, type mismatch, excessive dimensions, excessive channels/frames, and decode bombs.
- Never trust extension, source filename, browser MIME, or `accept`.
- Use opaque identifiers and store quarantine outside the repository, webroot, SQLite directory, and static assets.
- Apply per-device byte limits, request limits, concurrency limits, and relay-wide pressure limits without revealing other users’ usage.

### Storage and cleanup

- Original bytes exist only in quarantine until normalization completes.
- Normalized bytes exist only until confirmed Pi acknowledgement, explicit cancellation, delivery ambiguity, expiry, revocation, logout, epoch change, or shutdown.
- Partial and abandoned bodies are unlinked immediately or swept on startup.
- Uploaded bytes never appear in Git-visible paths or paths available to Pi tools.
- Secure erasure cannot be promised on modern filesystems; the product promise is bounded transient storage plus unlinking, not forensic overwriting.
- Raw media is never persisted in IndexedDB, Cache Storage, localStorage, the service worker, the transcript database, backups, metrics, or crash reports.

### Redaction

- Redaction is structural: pixel-bearing objects are unrepresentable in durable transcript DTOs.
- Transcript projectors use explicit allowlists; arbitrary uploaded metadata never reaches pattern-based text redaction.
- No filename, path, URL, ID, hash, EXIF, OCR, or provider payload is persisted.
- Logs may record only an error code, count, coarse size bucket, and latency bucket. Authorization headers, tickets, bodies, attachment identifiers, hashes, and decoder exceptions are suppressed.
- Copy/export and notifications use generic redacted placeholders.
- Local object URLs are process-local and revoked promptly.
- App-switcher/background privacy covering must hide local thumbnails when the PWA is not visible.

### Pi and provider boundary

- Pi receives only host-normalized JPEG/PNG image blocks in memory.
- The active provider receives those pixels; deletion from the relay does not delete provider-side processing or retention. First-use disclosure must name this boundary.
- Release is blocked until the pinned Pi build proves that image content is neither persisted in its JSONL session nor echoed through stdout events. Safe configurations are an in-memory `SessionManager`, `--no-session`, or a relay-owned redacting session adapter.
- If Pi echoes base64 images into an event, the current 1 MiB JSONL record cap can fail before projection. The feature must remain disabled until the host adapter suppresses such echoing before the framed relay path.
- No path fallback is permitted if the image-content bridge fails; the turn fails visibly.

### Required negative tests

- Reused, expired, wrong-origin, wrong-device, wrong-session, and stale-revision tickets fail without retained bytes or Pi commands.
- A renamed SVG/HTML/PDF, MIME-spoofed object, truncated JPEG, polyglot, decompression bomb, animated file, and excessive-pixel image fail closed.
- A planted filename, GPS coordinate, device model, timestamp, unique byte marker, path string, and bearer-like token appear nowhere in logs, SQLite, sync frames, push, Cache Storage, exports, or Pi-visible text.
- Removing during upload cannot later transition to ready.
- Double Send creates one prompt.
- Same submission ID with different text or attachment digests fails.
- A non-vision model cannot accept or silently discard the set.
- Dropping the Pi response after acceptance produces `delivery-unknown` and no automatic retry.
- Host plan mode continues rejecting protected tool families after an image-bearing turn.
- Workspace snapshots before and after upload are identical.
- Service-worker inspection finds no attachment request or response.
- React Strict Mode leaves no object URLs, XHR listeners, timers, or stale callbacks.
- Light/dark, 200% zoom, 320 px reflow, VoiceOver, Switch Control, RTL, reduced motion, Safari-tab, and installed-PWA tests pass.

## 5. Open questions + risks

1. **Pi persistence and echo behavior:** this is the release blocker. Verify the exact pinned Pi version with real image prompts before enabling the host capability.
2. **Authoritative model capability:** expose `imageIn` plus the host-enforced count/size/type policy in the runtime snapshot; do not infer support from model names.
3. **Prompt revision semantics:** confirm that only user/runtime mutations—not streamed assistant tokens—advance the revision used by reservations and commits.
4. **Minimum iOS version:** decide whether Safari 17+ is required. Older versions complicate HEIC preview and client-side optimization.
5. **HEIC deployment:** confirm the production Sharp/libvips build actually includes HEIF decoding and test real 12/24/48 MP iPhone assets.
6. **Provider retention disclosure:** define the exact first-use copy and link to the configured provider’s retention policy.
7. **Steer and Later:** verify the pinned Pi bridge accepts images on both RPC paths and acknowledges queued follow-ups before relay cleanup.
8. **Upload reliability:** measure 15 MiB XHR PUTs over the target tailnet. Adopt chunked resumable transfer only if restart-on-failure is materially inadequate.
9. **iOS lifecycle:** real-device test picker return, camera capture, keyboard restoration, app backgrounding, process death, and WebKit’s reported Photos-picker storage accumulation.
10. **Keyboard geometry:** validate `VisualViewport`, safe areas, landscape, emoji keyboard, and standalone-mode viewport shrink across supported iOS releases.
11. **Quarantine resources:** confirm the host can safely accommodate the 60 MP/384 MiB-class decoder budget; advertise lower limits when it cannot.
12. **Cross-device media:** v1 intentionally shows only redacted cards. Decide later whether thumbhash or ticketed ephemeral preview is worth the additional surface.
13. **Delivery deletion point:** confirm whether “Pi acknowledged” means RPC acceptance, provider submission, or completed turn; the UI and retention wording must match.
14. **Application relay topology:** if the application relay ever moves outside the end-to-end Tailscale peer path, add application-layer encryption so the intermediate handles ciphertext only.
15. **Dark-theme contrast:** compute and test every dark token pair; the fixed clay accent cannot be assumed to pass merely because the theme is dark.
16. **Sensitive screenshots:** pixels can contain secrets and prompt injection that string redaction cannot see. Clear disclosure and host-enforced policy are the primary controls; automatic OCR/face scanning would add privacy risks and false confidence.
17. **Mobbin validation:** authenticated frame-level review of the cited Claude, ChatGPT, Gemini, Slack, and WhatsApp flows remains useful before final visual sign-off.

## 6. Sources

### Product and benchmark behavior

- [Claude file and image uploads](https://support.claude.com/en/articles/8241126-upload-files-to-claude)
- [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control)
- [Claude vision limits](https://platform.claude.com/docs/en/build-with-claude/vision)
- [Kimi Code media input](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html)
- [ChatGPT image inputs](https://help.openai.com/en/articles/8400551-image-inputs-for-chatgpt-faq)
- [Gemini iPhone/iPad uploads](https://support.google.com/gemini/answer/14903178?co=GENIE.Platform%3DiOS&hl=en)
- [Perplexity mobile image upload](https://www.perplexity.ai/help-center/en/articles/10354840-uploading-images-on-perplexity)

### Pi and coding-agent implementations

- [Pi RPC protocol](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)
- [Pi image-content API](https://github.com/badlogic/pi-mono/blob/main/packages/ai/README.md)
- [Pi session format](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/session.md)
- [Pi SDK and in-memory sessions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/sdk.md)
- [Pi image processing](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/utils/image-process.ts)
- [Remote Pi](https://github.com/jacobaraujo7/remote_pi)
- [pi-image-drop](https://pi.dev/packages/%40narumitw/pi-image-drop)
- [Happy mobile coding-agent client](https://github.com/slopus/happy)
- [OpenClaw](https://github.com/openclaw/openclaw)
- [Grok Remote](https://github.com/daniel-farina/grok-remote)
- [HAPI remote-control PWA](https://github.com/tiann/hapi)
- [Open WebUI attachment input](https://github.com/open-webui/open-webui/blob/main/src/lib/components/chat/MessageInput.svelte)

### Platform, accessibility, and implementation

- [React Aria FileTrigger](https://react-spectrum.adobe.com/react-aria/FileTrigger.html)
- [MDN file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)
- [MDN camera capture](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)
- [MDN object URLs and file previews](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)
- [MDN XHR upload progress](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload)
- [MDN Visual Viewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [MDN Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [Apple HIG — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Apple Photos picker privacy model](https://developer.apple.com/videos/play/wwdc2020/10652/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI upload-progress technique](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA25)
- [React internationalization guidance](https://react-spectrum.adobe.com/react-aria/internationalization.html)

### Security and transport

- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [Sharp input limits](https://sharp.pixelplumbing.com/api-constructor/)
- [Sharp orientation and resizing](https://sharp.pixelplumbing.com/api-operation/)
- [Sharp metadata behavior](https://sharp.pixelplumbing.com/api-output/)
- [Tailscale encryption](https://tailscale.com/docs/concepts/tailscale-encryption)
- [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve)
- [tus resumable-upload protocol](https://tus.io/protocols/resumable-upload)

### Mobbin and screen references

- [Claude iOS image-input flow](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1)
- [Claude iOS upload screen](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8)
- [ChatGPT iOS camera composer](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1)
- [Gemini image-upload flow](https://mobbin.com/explore/flows/e5b8846f-e7bb-481a-82bd-47f29bfb6653)
- [Slack iOS photo composition](https://mobbin.com/explore/screens/d9cdc41b-1658-471f-a65f-fe772fa3f4ed)
- [WhatsApp iOS image review flow](https://mobbin.com/explore/flows/c5841e58-0961-4da8-abe0-6d4171e9a758)
