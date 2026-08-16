<!-- provenance: external-CLI orchestration pass; original file iter-04-sol.md -->
> **Source pass 4** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-4-sol.md`.

<!-- F5-media-upload | model=sol | lens=edge-failure | iter 4/15 | 2026-08-15T20:19:34.260Z -->

# 1. Findings for the edge-failure lens

## The baseline interaction should be familiar, but its failure semantics must be stricter

Claude and Kimi establish the expected mobile pattern: a `+` beside the composer opens attachment choices, selected media becomes part of the draft, and sending remains a separate action. Claude documents `+` → “Add files or photos”; Kimi’s mobile guide places file and photo upload behind the composer’s `+`. Pi Remote should preserve that pattern instead of introducing a separate upload page. ([Claude Help Center](https://support.claude.com/en/articles/8241126-upload-files-to-claude), [Kimi mobile guide](https://www.kimi.com/zh-cn/help/new-user-guide/overview))

Their generous consumer limits are not appropriate defaults here. Claude currently permits substantially larger uploads, and Kimi advertises files and video up to 100 MB, but Pi Remote must move bytes through a local relay, encode images into Pi’s RPC protocol, tolerate iOS suspension, and protect the host. Limits therefore need to be based on the narrowest reliable transport and model path, not competitive headline limits. ([Claude upload limits](https://support.claude.com/en/articles/8241126-upload-files-to-claude), [Kimi overview](https://www.kimi.com/zh-cn/help/new-user-guide/overview), [Pi RPC documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md))

## Use system file pickers, not a custom web camera

Implement two explicit actions:

- **Choose Photos**: a React Aria `FileTrigger` with `allowsMultiple`.
- **Take Photo**: a separate `FileTrigger` with `defaultCamera="environment"` and single selection.

React Aria already renders a visually hidden native file input and supports accepted types, multiple selection, and camera capture. WebKit’s HTML Media Capture support allows a file input to invoke the camera on iOS. ([React Aria FileTrigger](https://react-spectrum.adobe.com/v3/FileTrigger.html), [WebKit HTML Media Capture](https://webkit.org/blog/7477/new-web-features-in-safari-10-1/))

Do not use `getUserMedia()` for this feature. A file-input camera requires an immediate user gesture but does not use the persistent camera permission model that applies to `getUserMedia()`. This avoids an unnecessary permission prompt and makes “permission denied” mostly a system-picker concern rather than an application state. ([WebKit bug discussion](https://bugs.webkit.org/show_bug.cgi?id=226223), [Apple privacy guidance](https://developer.apple.com/design/human-interface-guidelines/privacy/))

Consequently, Pi Remote cannot reliably distinguish:

- the user tapping Cancel;
- reselecting the same file;
- the picker returning no file after an OS-level failure;
- some camera availability failures.

The file input’s `cancel` event explicitly covers both dismissal and unchanged selection. The correct degradation is therefore to preserve the draft and show no accusatory “permission denied” alert. ([MDN file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file))

## iOS replaces the `FileList`; Pi Remote must own accumulation

On iOS, reopening the picker replaces the input’s `FileList`; successive camera captures do not accumulate automatically. Pi Remote must copy selected `File` objects into React-owned draft state and reset the underlying input value after every picker result so selecting the same photo again can still produce a new event. ([Apple Developer Forums reproduction and confirmation](https://developer.apple.com/forums/thread/826732))

This creates several required race protections:

- Merge by a client attachment identifier, not by array index.
- Deduplicate normalized content, not filenames.
- Ignore late decode/upload callbacks after removal.
- Never read the input’s current `files` list as the authoritative draft.
- Keep photos captured in separate picker invocations until explicitly removed or sent.

## HEIC is an ingress format, not a Pi wire format

Safari 17 added HEIC decoding, and HEIC is a normal iPhone camera format. Pi’s documented image path, however, is based on base64 `ImageContent`, and Pi’s regular user-facing support lists JPEG, PNG, GIF, and WebP rather than HEIC. ([WebKit HEIC support](https://webkit.org/blog/14445/webkit-features-in-safari-17-0/), [Pi image support](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md), [Pi RPC images](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md))

Therefore:

- Accept HEIC/HEIF defensively at ingress even if the picker is asked for JPEG/PNG/WebP.
- Decode and normalize it before Pi sees it.
- Apply orientation before stripping EXIF.
- Treat a Live Photo as its still image only and say so in the picker sheet.
- Do not imply that video or Live Photo motion was sent.

Safari has had format-conversion quirks driven by the exact `accept` list, reinforcing that server-side decoding must trust neither the extension nor browser-reported MIME type. ([WebKit upload conversion bug](https://bugs.webkit.org/show_bug.cgi?id=303803), [MDN `accept` behavior](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file))

## “Offline” is an observed transfer state, not `navigator.onLine === false`

`navigator.onLine` is inherently unreliable and should only provide a hint. Connectivity must be established through actual relay responses. ([MDN `navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine))

Background Sync is not Baseline and cannot be the reliability contract for an installed iPhone PWA. If iOS suspends or kills the web app, an in-flight JavaScript upload may stop. Pi Remote must therefore promise resumability while the selected `File` remains in memory, not invisible background completion after the app closes. ([MDN Background Synchronization](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API))

Graceful behavior is:

1. Pause visibly after a transport failure.
2. Reconcile the authoritative server offset when the page becomes visible or the relay answers again.
3. Resume only from a confirmed offset.
4. If the PWA process was killed and the local `File` no longer exists, preserve the text draft but require reselection.

Do not persist raw gallery media in IndexedDB or Cache Storage merely to simulate native background upload. That creates a new sensitive-data store, can be evicted unpredictably, and broadens the compromise surface.

## Upload progress needs XHR or chunk acknowledgements

Fetch does not expose ordinary request-upload progress to application code. `XMLHttpRequest.upload` provides progress, abort, timeout, error, and completion events and is widely available. ([MDN file upload example](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications), [MDN `XMLHttpRequest.upload`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload))

Use XHR for individual chunk progress and authoritative server acknowledgements for total progress. Never present “100%” as delivered to Pi merely because the browser finished transmitting bytes; distinguish:

- **Uploading**: bytes reaching the relay.
- **Checking**: relay decoding, normalizing, and validating.
- **Ready**: staged and eligible to accompany a prompt.
- **Sent**: Pi acknowledged the prompt command.
- **Delivery uncertain**: connection failed after delivery may have occurred.

Pi’s RPC response means the prompt was accepted, queued, or handled; later failures arrive through the event stream. UI state must follow that contract rather than infer acceptance from HTTP completion. ([Pi RPC response semantics](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md))

Silent attachment loss is a real failure pattern: Kimi has had a reported regression where the attachment appeared locally but the model received no image. Pi Remote therefore needs end-to-end assertions that the final Pi command contains the expected image count and digests, not merely a successful staging request. ([Kimi attachment regression](https://github.com/MoonshotAI/kimi-cli/issues/2151))

## Attachment bytes are both hostile files and hostile model input

`accept` is only picker guidance. The server must independently enforce size, signature, decoded format, dimensions, filename isolation, authorization, and storage location. OWASP specifically recommends allowlisting, signature checking, generated storage names, size limits, storage outside the webroot, and image rewriting. ([OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html), [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html))

An image can also contain model-readable malicious instructions. Multimodal prompt injection is explicitly recognized by OWASP; pattern filtering is not a sufficient defense. Uploaded images must be labeled as untrusted data at the host boundary, while plan mode and approval enforcement remain authoritative regardless of what the model sees. ([OWASP Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html), [OWASP LLM01](https://genai.owasp.org/llmrisk/llm01-prompt-injection/))

This is where Pi Remote’s fixed posture matters: an image may influence model reasoning, but it must never grant tools, leave plan mode, approve a mutation, or alter the host’s policy revision.

## Prior art supports explicit capabilities and bounded transports

Pi’s RPC already accepts base64 image objects on prompt, steer, and follow-up commands. The new lane should stage and sanitize bytes, then feed that existing protocol rather than writing gallery files into the project. ([Pi RPC documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md))

Relevant remote-agent clients expose useful guardrails:

- Remote Pi surfaces a per-model vision capability and disables attachment when the selected model is text-only. ([Remote Pi package documentation](https://pi.dev/packages/remote-pi))
- Pi Mobile supports image prompts but documents a 16 MiB WebSocket payload cap and no offline mode, illustrating why unbounded base64-on-WebSocket transport is fragile. ([Pi Mobile](https://github.com/ayagmar/pi-mobile))
- Claush uploads phone images into a host directory and sends a chat notification, but that approach unnecessarily creates filesystem artifacts for Pi Remote’s stricter posture. ([Claush manual](https://claush.jp/langs/en/manual/))
- Kimi Code caches attachments as visible placeholders, deduplicates them by content hash, and gates media by model capability. The placeholder and capability ideas are useful; persistent media caching is not appropriate as Pi Remote’s default. ([Kimi interaction guide](https://moonshotai.github.io/kimi-code/en/guides/interaction.html), [Kimi changelog](https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md))

# 2. Concrete specification contribution

## Scope and limits

Ship still-image support first.

| Property | Required value |
|---|---|
| Draft maximum | 4 images |
| Original file maximum | 20 MiB per selected file |
| Original decoded-pixel maximum | 40 megapixels |
| Picker hints | JPEG, PNG, WebP |
| Defensive ingress support | JPEG, PNG, WebP, HEIC, HEIF |
| Explicitly unsupported | Video, audio, animated GIF, RAW, SVG, PDF |
| Normalized longest edge | 2,000 px |
| Normalized output | JPEG or PNG only |
| Normalized maximum | 3.5 MiB per image |
| Normalized aggregate | 9 MiB per prompt |
| Chunk size | 1 MiB |
| Staging expiry | 10 minutes after last acknowledged mutation |
| Per-device staged quota | 40 MiB |
| Relay-wide staged quota | 256 MiB, configurable |

A 2,000-pixel ceiling is conservative across providers and avoids multi-image dimension limits; Anthropic recommends staying within 2,000 px when many images are present and documents lower encoded-size limits on some provider paths. ([Anthropic vision limits](https://platform.claude.com/docs/en/build-with-claude/vision))

If five images are selected, add the first four and present: “4 photos added. 1 wasn’t added because the limit is 4.” Valid selections must survive alongside rejected ones.

## Composer interaction

1. The `+` button opens a bottom sheet with:

   - **Choose Photos**
   - **Take Photo**
   - A quiet disclosure: “Selected images are sent to this Mac through Tailscale and removed after delivery.”
   - If applicable: “Live Photos are sent as still images. Video isn’t supported yet.”

2. If uploads are host-disabled, hide both media actions; do not render dead controls.

3. If the current model lacks vision:

   - Keep the general `+` available.
   - Render media actions disabled with “Current model doesn’t accept images.”
   - If the model loses vision capability after selection, retain the draft but block Send until the user removes the images or selects a capable model.

4. Selecting an image starts preparation and staging immediately. Sending remains a separate, explicit action.

5. Attachment-only messages are allowed. The visible transcript text must be “1 photo attached” or “N photos attached”; Pi receives an equivalent neutral caption. Do not insert undisclosed hidden instructions as the user’s message.

6. The composer text stays editable throughout preparation and upload.

7. Send is enabled only when every remaining attachment is `ready`. Tapping a visually disabled Send control must expose the reason through its accessible description, such as “Preparing photo 1.”

## Attachment state machine

| State | Visual treatment | Allowed actions | Transition rule |
|---|---|---|---|
| `picking` | Composer unchanged; system picker owns the screen | Cancel in picker | No file returns to prior draft without an alert |
| `preparing` | Thumbnail skeleton, label “Preparing” | Remove | Decode, orientation, local preview, initial validation |
| `reserving` | Indeterminate ring | Remove | Acquire a fresh one-use ticket and reservation |
| `uploading` | Determinate ring and percent | Remove, cancel | Progress comes from XHR plus acknowledged offsets |
| `checking` | Indeterminate ring, “Checking” | Remove | Server verifies, decodes, re-encodes, strips metadata |
| `ready` | Full thumbnail with checkmark | Preview, remove | Eligible for final prompt commit |
| `waiting-offline` | Pause glyph, “Waiting for connection” | Remove, Retry now | Enter only after a real request fails; `navigator.onLine` is advisory |
| `recovering` | “Checking upload” | Remove | Read authoritative offset/revision before resuming |
| `rejected` | Error icon, short reason | Remove; Retry only when recoverable | Invalid bytes are never retained |
| `expired` | Dimmed thumbnail, “Upload expired” | Upload again, remove | Reuse local `File` only if still in memory |
| `cancelling` | Dimmed, no progress animation | None | Ignore every callback carrying the old generation token |
| `sent` | User-turn attachment card | Open preview while available | Set only after Pi acknowledgement |
| `delivery-unknown` | Warning card, “Delivery uncertain” | Refresh transcript, remove local draft | Never automatically resend the prompt |

Actionable errors remain inline until resolved. Apple recommends nonintrusive, contextual indicators for connection failures and reserves modal alerts for critical, actionable interruptions. ([Apple alert guidance](https://developer.apple.com/design/human-interface-guidelines/alerts))

## Failure copy and recovery

| Condition | User copy | Recovery |
|---|---|---|
| Picker dismissed | None | Preserve draft and focus |
| Too many | “Only 4 photos can be attached.” | Keep first four |
| Original too large | “This photo is over 20 MB.” | Choose another |
| Unsupported media | “Video isn’t supported yet.” | Choose a still image |
| Decode failure | “This image couldn’t be read.” | Remove or choose another |
| Pixel/decompression limit | “This image is too large to process safely.” | Resize externally |
| Text-only model | “Current model doesn’t accept images.” | Change model or remove |
| Offline before reservation | “Waiting for connection” | Automatic probe while foreground; manual Retry |
| Mid-chunk disconnect | “Upload paused” | Reconcile offset, then resume |
| Ticket expired | No separate user error | Fetch a new ticket after offset reconciliation |
| Reservation expired | “Upload expired” | Upload again from retained `File` |
| Quota exceeded | “Too many uploads are waiting on this Mac.” | Remove another upload or wait |
| Session changed elsewhere | “Conversation changed on another device. Review before sending.” | Refresh and require a new Send gesture |
| Relay validation failure | “This image couldn’t be prepared safely.” | Remove or choose another |
| Pi rejects images | “The active model rejected these images.” | Change model or remove |
| Outcome unknown after final send | “Delivery uncertain. Check the conversation before trying again.” | Refresh only; never auto-resend |

Never show raw HTTP status, filesystem paths, decoder errors, MIME signatures, ticket state, or hashes.

## Upload API and revision rules

### Host capability

Uploads are off unless the host explicitly enables the media lane. A read-only capability endpoint returns:

```json
{
  "enabled": true,
  "mediaKinds": ["image"],
  "maxItems": 4,
  "maxSourceBytes": 20971520,
  "maxNormalizedBytes": 3670016,
  "maxAggregateBytes": 9437184,
  "promptRevision": 42,
  "modelAcceptsImages": true
}
```

A disabled relay returns `enabled: false`; mutation endpoints also fail closed.

### Reserve

`POST /api/media/uploads`

Requires:

- authenticated application session;
- fresh one-use mutation ticket;
- current session epoch;
- expected media-lane revision;
- client attachment ID;
- claimed byte length and MIME;
- no filename.

Success: `201 Created` with an opaque upload ID, upload revision, offset `0`, expiry, and chunk limit.

### Upload chunk

`PATCH /api/media/uploads/{uploadId}`

Headers include:

- fresh one-use ticket;
- `Upload-Offset`;
- `If-Match: "u{revision}"`;
- checksum of this chunk;
- `Content-Type: application/offset+octet-stream`.

Success: `204 No Content`, returning the new offset, revision, and expiry.

The offset/revision design follows resumable-upload practice: a mismatched offset must modify nothing, completed chunks advance an authoritative offset, and expired uploads are not resumable. ([tus protocol](https://tus.io/protocols/resumable-upload))

### Reconcile

`HEAD /api/media/uploads/{uploadId}` is read-only and returns the authoritative offset, upload revision, state, and expiry.

After a network-unknown PATCH:

1. Call `HEAD`.
2. If the offset advanced by exactly the chunk size, continue.
3. If unchanged, acquire a new ticket and resend that chunk.
4. Any other offset or digest mismatch becomes a hard error.

This is the only automatic mutation retry permitted. Final prompt delivery is never automatically retried.

### Finalize and sanitize

When all source bytes are present, the relay:

1. Verifies length and content signature.
2. Rejects unsupported or malformed containers.
3. Decodes inside a constrained worker.
4. Applies orientation.
5. Enforces decoded-pixel and memory limits.
6. Resizes to the configured edge ceiling.
7. Re-encodes to JPEG or PNG.
8. Strips EXIF, GPS, XMP, comments, original filenames, and auxiliary Live Photo data.
9. Verifies normalized and aggregate byte limits.
10. Marks the upload `ready` at a new revision.

Client processing is only a responsiveness optimization. Security decisions occur again on the relay because client MIME and `accept` restrictions are spoofable. ([OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html))

### Cancel

`DELETE /api/media/uploads/{uploadId}` requires a fresh ticket and current upload revision. It immediately removes staged bytes when possible. An uncertain DELETE is harmless because the 10-minute expiry remains authoritative.

### Send to Pi

Extend prompt submission with:

```json
{
  "type": "prompt.submit",
  "submissionId": "opaque-id",
  "sessionId": "opaque-session",
  "expectedPromptRevision": 42,
  "message": "Please compare these screenshots.",
  "attachments": [
    {
      "uploadId": "opaque-upload",
      "revision": 8
    }
  ],
  "ticket": "one-use-ticket"
}
```

The relay must atomically verify:

- ticket validity and non-reuse;
- session, device, epoch, and principal binding;
- exact prompt revision;
- upload ownership and session binding;
- every upload is `ready` and unexpired;
- exact upload revisions;
- active model accepts images;
- item and aggregate limits.

Only then does it load normalized bytes and produce Pi RPC `images` entries:

```json
{
  "type": "image",
  "mimeType": "image/jpeg",
  "data": "<base64>"
}
```

No uploaded file is written into the repository or exposed as a shell-readable path. The full normalized bytes are deleted immediately after positive Pi acknowledgement, cancellation, logout, expiry, or relay shutdown.

## Storage, logging, and transcript redaction

### Staging

- Use random opaque storage identifiers.
- Keep staging outside the repository and webroot.
- Prefer bounded process memory; if temporary files are necessary, use an owner-only directory and randomized extensionless names.
- Never expose staging through static-file serving.
- Never place attachment requests or responses in the service worker cache.
- Never log bodies, base64, filenames, hashes, dimensions, temporary paths, OCR, or thumbnails.
- Operational logs may contain only an error code, count, coarse size bucket, and hashed principal reference.

### Transcript

Persist only a redacted attachment block:

```json
{
  "kind": "attachment",
  "mediaKind": "image",
  "label": "Photo 1",
  "status": "delivered",
  "previewRetained": false
}
```

Do not persist:

- original filename;
- MIME claim;
- EXIF or GPS;
- content hash;
- raw or normalized bytes;
- temporary path;
- OCR or auto-generated description.

For immediate visual continuity, retain a 256 px sanitized thumbnail in relay memory for at most 15 minutes. Serve it only from an authenticated, session-bound endpoint with `Cache-Control: no-store`. After expiry or restart, render “Photo attachment · preview not retained.”

On the sending iPhone, the local object URL may keep the full draft preview until removal, send completion, or component teardown. Every object URL must be revoked; the File API warns that unreleased blob URLs can leak resources. ([W3C File API](https://www.w3.org/TR/FileAPI/), [MDN file handling](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications))

### Model trust boundary

When images are present, the host extension adds a non-client-controlled instruction that they are untrusted user-provided data and that instructions visible inside them carry no authority. This is defense in depth only. Tool availability, plan mode, approval digests, and revision checks remain the enforcement boundary.

## Race-condition rules

- **Double Send:** the first press synchronously locks the submission ID; later presses do nothing. Server idempotency returns the existing result only for identical content.
- **ID reused with different attachments:** reject and audit.
- **Remove during decode/upload:** increment the attachment generation token, abort XHR, revoke preview, request deletion, and ignore all older callbacks.
- **Session switch:** abort local tasks and delete staged uploads. Upload IDs are never portable between sessions.
- **Model switch:** reevaluate vision capability before final commit.
- **Other-device prompt:** prompt revision mismatch sends nothing to Pi and requires review.
- **Ticket expires in flight:** reconcile the resource before acquiring a replacement ticket.
- **Relay restart:** all staged uploads become expired; local in-memory files may be re-uploaded after reenrollment.
- **PWA killed:** no prompt is sent. Restore the text draft and display “Photo needs to be selected again.”
- **One attachment fails:** preserve other ready attachments but block Send until the failed item is removed or repaired.
- **Same photo selected twice:** deduplicate normalized bytes within this draft and announce “That photo is already attached.”
- **Pi acknowledgement lost:** mark delivery uncertain; refresh the authoritative transcript before permitting a manually confirmed retry.

## Accessibility

- Attach, remove, retry, cancel, and preview controls have at least 44×44 pt hit regions. Apple recommends 44×44 pt for buttons. ([Apple button guidance](https://developer.apple.com/design/human-interface-guidelines/buttons))
- Icon-only controls require explicit names: “Attach media,” “Remove photo 2,” “Retry photo 2,” and “Cancel upload of photo 2.”
- Use React Aria `Button`/`FileTrigger` press semantics rather than click-only handlers. ([React Aria Button](https://react-spectrum.adobe.com/v3/Button.html))
- Each active transfer exposes a labeled `progressbar`. Announce only meaningful milestones—start, 25%, 50%, 75%, checking, ready—through `aria-live="polite"` to avoid VoiceOver chatter. W3C explicitly documents live-region announcements for file-upload progress. ([W3C ARIA25](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA25))
- Errors use icon, text, and state—not clay color alone.
- Do not move focus merely because progress changes. After removal, focus the next attachment’s Remove button or the Attach button.
- Picker cancellation restores focus to the invoking menu item.
- Every swipe or drag interaction has a tap alternative; WCAG 2.2 requires non-drag alternatives and programmatically exposed status messages. ([WCAG 2.2](https://www.w3.org/TR/WCAG22/))
- Preview images are decorative beside a text label unless the user supplied alt text; do not generate an unverified description.
- At 200% text size, attachment status and actions wrap without covering the composer or send control.

## Visual and motion specification

- Attachment rail sits inside the parchment composer, above the text row.
- Thumbnails: 68×68 pt, 12 pt radius, `object-fit: cover`.
- Ready: carbon hairline plus a small checked badge.
- Uploading: clay progress ring plus textual percentage.
- Waiting: pause icon and “Waiting.”
- Error: carbon error icon, clay border, and plain-language message.
- Dark mode uses the same state hierarchy with AA-compliant text and borders; never use a translucent thumbnail overlay as the only status signal.
- New attachments fade and scale from 0.98 to 1 over 160 ms; removal fades for 120 ms.
- Under `prefers-reduced-motion: reduce`, remove scaling and progress-ring rotation, leaving instantaneous state changes or a low-motion opacity change. ([MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion))

## Pass/fail acceptance matrix

| Test | Required result |
|---|---|
| Cancel Photos picker | Draft text and attachments unchanged; no toast |
| Capture two photos in separate camera invocations | Both remain in the draft |
| Reselect the same file after removal | A new selection event is processed |
| Select 6 valid images | Exactly 4 added; count error announced |
| Select valid JPEG plus malformed PNG | JPEG remains; malformed item shows recoverable error |
| Spoof JPEG MIME over executable bytes | Relay returns type/signature rejection; zero retained bytes |
| Upload 40 MP compressed bomb | Rejected before unrestricted decode allocation |
| Airplane mode at 47% | State becomes waiting; no optimistic completion |
| Restore connection | HEAD reconciliation precedes any new PATCH |
| Replay a consumed ticket | Mutation rejected; offset and revision unchanged |
| Send from stale prompt revision | No Pi RPC command emitted |
| Double-tap Send | One submission ID and one Pi prompt |
| Remove during final chunk | No ghost thumbnail or later ready transition |
| Kill PWA mid-upload | No prompt; orphan expires; text draft can recover |
| Simulate Pi success response without image count match | Submission fails closed |
| Lose HTTP response after Pi acceptance | Delivery-unknown; no automatic resend |
| Dump transcript/log/push payloads | No base64, original filename, EXIF, hash, GPS, or temp path |
| Inspect Cache Storage | No attachment request or response present |
| VoiceOver progress test | Milestones announced without focus movement |
| Reduced Motion enabled | No scaling or continuously rotating animation |
| Light/dark automated contrast | All labels, errors, focus indicators, and controls meet WCAG AA |

# 3. Divergent or minority ideas worth considering

## Atomic, send-time-only upload

Keep bytes solely on the iPhone until Send, then perform one multipart prompt request. This eliminates abandoned server staging and makes consent unambiguous. It is materially simpler and more private, but it produces a long blocked Send state, lacks practical resume, and is vulnerable to iOS suspension. It is viable only if normalized aggregate size is reduced to roughly 2–3 MiB.

## Require a caption

Make text mandatory whenever an image is attached. This reduces accidental uploads and makes the image’s purpose explicit to Pi. It diverges from Claude’s attachment-only behavior, but may be appropriate for a coding agent where unexplained screenshots create ambiguous tasks.

## Encrypted persistent outbox as an opt-in

An opt-in “Keep uploads if the app closes” mode could store encrypted normalized media in IndexedDB, with a nonexportable key and short expiry. It would improve recovery after iOS kills the PWA, but introduces persistent sensitive content, backup/eviction uncertainty, key lifecycle complexity, and a substantially larger audit surface. It should not be the default.

## On-device crop/redact mode

Before upload, offer “Crop or hide details” with a simple rectangle crop and markup layer. This could reduce location, notification, customer-data, and unrelated-screen leakage. It is valuable for screenshots but risks turning the attachment feature into an image editor. A smaller alternative is a pre-send “Review full image” action.

## Send only a normalized screenshot derivative

Always transform every image on-device to a 2,000 px JPEG/PNG before any bytes leave the phone, and then repeat validation on the relay. This reduces tailnet traffic and removes much metadata early. It may degrade tiny code text and creates browser-specific orientation/color failures, so the original `File` should remain available in memory until the relay accepts the derivative.

## Deliberately nonpersistent transcript previews

The proposed short-lived thumbnail is less convenient than Claude’s permanent visual transcript, but it is consistent with a remote-control product whose persistent ledger is redacted. A more aggressive version would remove previews immediately after Pi acknowledgement and always render only “Photo attached.”

## Per-model adaptive normalization

Preserve 4K detail when the active provider supports it and shrink more aggressively for constrained providers. This improves screenshot legibility but makes behavior change after model switching and complicates reproducibility. A fixed 2,000 px baseline plus a later “Send full detail” override may be more understandable.

# 4. Open questions and risks

1. **What does “media” include?** Pi’s documented RPC accepts images, not general video or audio. Video should remain explicitly out of scope unless a separate host-file or provider-files protocol is designed.

2. **Can runtime state expose model capabilities authoritatively?** The attach action should not infer vision support from model names. The relay needs a host-confirmed `acceptsImages` capability, as Remote Pi already does. ([Remote Pi](https://pi.dev/packages/remote-pi))

3. **Does the launched Pi process persist image content?** Relay redaction is insufficient if Pi session serialization later writes base64 images. The build must verify the exact Pi launch mode and serializer behavior; `--no-session` is the safest posture for transient media.

4. **What retention occurs at the model provider?** Deleting relay bytes does not delete data already sent to Anthropic, OpenAI, Google, or another provider. The product disclosure must describe that boundary accurately.

5. **Can HEIC normalization preserve orientation and color on all supported iOS versions?** Safari supports HEIC, but image orientation and canvas paths have had WebKit bugs. Real-device coverage must include portrait HEIC, Display-P3 photos, screenshots, transparent PNGs, panoramas, and corrupted inputs. ([WebKit orientation bug](https://bugs.webkit.org/show_bug.cgi?id=237895), [WebKit wide-gamut canvas](https://webkit.org/blog/12058/wide-gamut-2d-graphics-using-html-canvas/))

6. **What is the minimum supported iOS version?** The answer determines whether browser-side HEIC preview and normalization can be treated as available or only best-effort.

7. **How should global staging pressure be surfaced?** Relay-wide quota exhaustion should not reveal other devices’ attachment counts or sizes.

8. **Can temporary disk deletion meet the security promise?** Unlinking is not guaranteed secure erasure on modern filesystems. If “bytes never persist” is a hard requirement, staging must stay in bounded memory.

9. **Should users be able to attach while Pi is streaming?** Pi RPC supports images on steer and follow-up, but each choice has different delivery timing. The composer should expose the existing steering behavior explicitly and bind attachments to that same mode. ([Pi RPC steer/follow-up images](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md))

10. **How is attachment-only text represented?** The visible transcript text and the Pi RPC text must remain semantically identical; invisible synthetic instructions would violate transcript fidelity.

11. **Can the sanitizer handle transparent screenshots without destroying text contrast?** PNG should remain PNG when transparency or screen-like sharp edges matter; JPEG should be preferred for camera photos.

12. **Mobbin verification remains incomplete.** No publicly accessible, stable Mobbin permalink for the Claude/Kimi attachment failure flows was available in the crawl. The build team should inspect authenticated Mobbin recordings for picker cancellation, failed upload, and offline recovery before final visual sign-off rather than treating uncited screenshots as evidence.

# 5. Sources

- [Claude Help Center — Upload files to Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude)
- [Kimi Help Center — Mobile interface and uploads](https://www.kimi.com/zh-cn/help/new-user-guide/overview)
- [Kimi Code — Interaction and media input](https://moonshotai.github.io/kimi-code/en/guides/interaction.html)
- [Kimi CLI changelog](https://github.com/MoonshotAI/kimi-cli/blob/main/CHANGELOG.md)
- [Kimi image-transmission regression](https://github.com/MoonshotAI/kimi-cli/issues/2151)
- [Pi RPC protocol](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)
- [Pi coding-agent image support](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)
- [Pi Mobile](https://github.com/ayagmar/pi-mobile)
- [Remote Pi](https://github.com/jacobaraujo7/remote_pi)
- [Remote Pi package documentation](https://pi.dev/packages/remote-pi)
- [Claush mobile remote manual](https://claush.jp/langs/en/manual/)
- [React Aria FileTrigger](https://react-spectrum.adobe.com/v3/FileTrigger.html)
- [React Aria Button](https://react-spectrum.adobe.com/v3/Button.html)
- [React Aria ProgressBar](https://react-spectrum.adobe.com/v3/ProgressBar.html)
- [MDN — File input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)
- [MDN — Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)
- [MDN — XMLHttpRequest upload](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload)
- [MDN — Navigator online status](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [MDN — Background Synchronization](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API)
- [W3C File API](https://www.w3.org/TR/FileAPI/)
- [tus resumable-upload protocol](https://tus.io/protocols/resumable-upload)
- [WebKit — HTML Media Capture](https://webkit.org/blog/7477/new-web-features-in-safari-10-1/)
- [WebKit — Safari 17 HEIC support](https://webkit.org/blog/14445/webkit-features-in-safari-17-0/)
- [Apple Developer Forums — iOS picker replacement behavior](https://developer.apple.com/forums/thread/826732)
- [WebKit — File-input camera permission behavior](https://bugs.webkit.org/show_bug.cgi?id=226223)
- [WebKit — HEIC upload conversion issue](https://bugs.webkit.org/show_bug.cgi?id=303803)
- [WebKit — Image orientation issue](https://bugs.webkit.org/show_bug.cgi?id=237895)
- [WebKit — Wide-gamut canvas serialization](https://webkit.org/blog/12058/wide-gamut-2d-graphics-using-html-canvas/)
- [Apple HIG — Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy/)
- [Apple HIG — Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)
- [Apple HIG — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C ARIA25 — Announcing upload progress](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA25)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [OWASP LLM01: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [Anthropic vision limits](https://platform.claude.com/docs/en/build-with-claude/vision)
- [Mobbin MCP catalog](https://mobbin.com/mcp) — catalog consulted; no individual screen permalink used as evidence.
