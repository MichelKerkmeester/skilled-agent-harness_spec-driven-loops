<!-- provenance: external-CLI orchestration pass; original file iter-02-sol.md -->
> **Source pass 2** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-2-sol.md`.

<!-- F5-media-upload | model=sol | lens=interaction-gesture | iter 2/15 | 2026-08-15T20:10:37.971Z -->

# 1. Findings for the interaction-gesture lens

## The attachment entry point should be small in appearance, large in behavior

Place one persistent attach button at the leading edge of the composer. The visible icon may be 20–22 px, but its interactive area must be at least 44 × 44 CSS px. Apple specifies a 44 × 44 pt minimum and requires a visible pressed state; WCAG 2.2 AA independently requires at least 24 × 24 CSS px or sufficient spacing. Pi Remote should meet Apple’s stronger target. [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

Use a plus or paperclip with the accessible name “Add photo or video.” Tapping it should open a short modal tray with explicit “Choose from Photos” and “Take Photo” rows. This is clearer than making one file input rely on browser-dependent picker choices. Claude exposes a plus-button menu followed by “Add files or photos”; Perplexity similarly exposes gallery and camera beneath a plus button. [Claude file-upload flow](https://support.claude.com/en/articles/8241126-upload-files-to-claude), [Perplexity mobile image upload](https://www.perplexity.ai/help-center/en/articles/10354840-uploading-images-on-perplexity)

Implement the rows as two separate React Aria `FileTrigger`s:

- Photos: multiple-selection input with an explicit media allowlist.
- Camera: single-selection input with `capture="environment"`.

`FileTrigger` already provides the hidden file-input relationship and supports accepted types, multiple selection, and camera preference. The web `capture` attribute remains limited-availability, so “Take Photo” must degrade to the system file chooser rather than becoming disabled or producing a custom error. [React Aria FileTrigger](https://react-spectrum.adobe.com/v3/FileTrigger.html), [MDN `capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture), [WebKit HTML Media Capture](https://webkit.org/blog/7477/new-web-features-in-safari-10-1/)

The operating-system picker is the correct privacy boundary. The File API assumes files become readable only after user selection and requires that the user can cancel; Pi Remote should not build a custom gallery or request broad library access. [W3C File API security and privacy](https://www.w3.org/TR/FileAPI/)

## Native feel comes from predictable transitions, not custom gestures

Apple advises using familiar gestures for familiar actions, providing immediate feedback, and never making a gesture the sole way to perform an operation. Consequently:

- Tap activates, reveals, retries, or sends.
- Swipe left may remove a draft attachment, but every card also has a visible Remove button.
- Touch-and-hold may reveal a context menu or enter reorder mode, but it must not be required.
- Swipe down may dismiss a tray or full-screen preview, but both require a visible Close or Cancel control.
- Drag may reorder attachments, but “Move earlier” and “Move later” must exist in the context menu for keyboard, VoiceOver, and Switch Control users.

These alternatives are also required by WCAG 2.2’s dragging-movement criterion and Apple’s accessibility guidance. [Apple HIG: Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures/), [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Do not assign an action to a long-press on the attach button. It is undiscoverable, can conflict with system context-menu behavior, and would make a standard upload action depend on a custom gesture. Long-press is appropriate only on an already-visible attachment card.

## Do not hide upload progress inside the Send button

Selecting media should immediately create a draft card and begin secure staging. Each card needs its own state: inspecting, uploading, processing, ready, paused, failed, or blocked. An aggregate spinner in the Send button cannot tell the user which item failed or whether removing one item will unblock the message.

Use `XMLHttpRequestUpload` for the binary transfer because it exposes upload progress events broadly, including events for progress, abort, timeout, and failure. Safari still does not support request-body upload streams, so a Fetch-only progress design is not portable to the target PWA. [MDN `XMLHttpRequest.upload`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload), [Fetch upload-stream support](https://caniuse.com/wf-fetch-request-streams)

Progress must be both visual and programmatic. A progress ring should expose `role="progressbar"` and the current value, while a separate polite live region announces “Uploading Photo 2,” coarse progress milestones, completion, and errors without moving focus. W3C specifically documents a live region for accessible file-upload progress. [WAI ARIA upload-progress technique](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA25)

## The composer must remain usable while media is staged

Pi Remote is a coding-agent controller, so prompts are often multiline. The media strip must sit above the text row rather than replacing text-entry space. The textarea should autosize from one to six lines; beyond that it scrolls internally.

Recommended keyboard contract:

- Software-keyboard Return: newline.
- Visible Send button: sends or queues.
- Hardware `⌘ Enter`: sends.
- Hardware `Escape`: closes an open tray or preview; otherwise does not discard the draft.
- `Tab`/`Shift Tab`: normal DOM focus traversal.
- Arrow keys: move between attachment cards only after the attachment list itself has focus.
- Never submit while an IME composition is active.

This avoids accidental submission of multiline coding prompts while retaining a fast hardware-keyboard path. The textarea requires a persistent accessible label rather than depending on placeholder text. [Apple HIG: Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields), [React Aria TextArea accessibility](https://react-spectrum.adobe.com/v3/TextArea.html), [WCAG focus order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)

Opening the source tray should deliberately blur the textarea, wait for the visual viewport to settle, and then animate the tray. WebKit’s Visual Viewport API accounts for the onscreen keyboard and is intended for moving overlays around it. Safe-area padding must use `env(safe-area-inset-bottom)` when the keyboard is closed; current WebKit bugs mean the inset may remain nonzero with the keyboard open, so visual-viewport testing is required rather than trusting `100dvh` alone. [WebKit Visual Viewport support](https://webkit.org/blog/9674/new-webkit-features-in-safari-13/), [WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/), [WebKit safe-area keyboard bug](https://bugs.webkit.org/show_bug.cgi?id=217754)

## Pi’s model capability must control the interaction

Pi documents JPEG, PNG, GIF, and WebP image input, automatically resizes images beyond 2000 × 2000, and exposes model image capability through `model.input`. It also warns that images passed to a non-vision model may be silently ignored. Pi Remote must therefore block sending rather than merely warn when the current model cannot consume the selected images. [Pi coding-agent image support](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md), [Pi AI image-content API](https://github.com/badlogic/pi-mono/blob/main/packages/ai/README.md)

Prior Pi remote clients validate the interaction model but expose the architectural gap:

- `remote-pi` supports one camera/gallery image, exposes a model `vision` flag, and places base64 directly in the application message; its documentation acknowledges that this is not an end-to-end confidentiality boundary and that a binary lane remains future work. [remote-pi image protocol](https://pi.dev/packages/remote-pi)
- `pi-image-drop` stages ordered batches, supports retry/removal/reordering, applies orientation, strips metadata, and enforces Pi-compatible limits. [pi-image-drop](https://pi.dev/packages/%40narumitw/pi-image-drop)
- Grok Remote accepts five attachments, supports paste/drop/picker, and provides the agent both content blocks and filesystem references. [grok-remote](https://github.com/daniel-farina/grok-remote)
- CC Pocket combines image attachments, offline recovery, a local bridge, and Tailscale access in a mobile coding-agent client. [CC Pocket](https://github.com/K9i-0/ccpocket)

Binary media should not ride inside transcript JSON. Base64 converts every three input bytes into four encoded characters, increasing transport and log exposure while making progress and streaming harder. [RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648)

## Match benchmark breadth without copying unsafe limits

Kimi Code accepts pasted, dropped, or selected images and videos, limits a message to nine files and 80 MB, and compresses oversize images. That is a useful capability benchmark, but not an appropriate security default for a private remote-control plane. [Kimi Code media input](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html)

Pi Remote should initially support five items and 30 MiB total. That is enough for several screenshots or one short video while bounding mobile memory, relay storage, parser exposure, and denial-of-service risk. OWASP explicitly requires business-specific extension allowlists, server-side type verification, generated storage names, request/file limits, authorization, quarantine outside the webroot, and malware or sandbox inspection. [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

## Redaction must include UI behavior, not merely server logs

The transcript should show sanitized derivatives, not the selected original:

- No original filename.
- No EXIF, location, device name, local path, or library date.
- Generic labels such as “Photo 1” or “Video 1.”
- Copy/export renders `[photo attachment redacted]`.
- Notifications say “Attachment sent,” never a filename or description.
- Error messages contain a short opaque reference only when required for support.
- The relay and event stream contain attachment manifests, never base64 or temporary filesystem paths.

Image rewriting is the appropriate validation boundary because it both proves the decoder can read the image and removes extraneous metadata. User-controlled MIME types and extensions are not trustworthy. [OWASP Input Validation: image uploads](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), [MDN file-input validation warning](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)

# 2. Concrete spec contribution for the build phase

## Composer geometry

- Composer container: fixed above the safe area, maximum width inherited from the existing chat layout.
- Attachment strip: horizontally scrollable, 8 px gap, 8 px bottom spacing, no visible scrollbar.
- Draft image card: 64 × 64 px visual surface, 12 px radius.
- Draft video card: 96 × 64 px, poster frame plus duration.
- Each card’s total interactive region: at least 68 × 68 px.
- Remove button: 44 × 44 px hit region, 24 px visible carbon/bone circular control.
- Attach and Send buttons: 44 × 44 px.
- Source tray rows: 56 px high with icon, primary label, and optional one-line explanation.
- Tray bottom padding: `max(12px, env(safe-area-inset-bottom))`.
- Full-screen preview Close button: 44 × 44 px, positioned within the safe area.

Use the fixed bone/carbon/clay tokens. Clay indicates the selected/active path and upload completion; errors use the existing semantic error token rather than clay. All text, progress tracks, disabled states, and overlays must meet the fixed WCAG AA contrast requirement.

## State machine

| State | Visible behavior | Permitted transitions |
|---|---|---|
| `EMPTY` | Normal composer; attach enabled only when the session accepts media | Tap attach → `SOURCE_TRAY` |
| `SOURCE_TRAY` | Modal tray with Photos, Camera, Cancel | Choose → `SYSTEM_PICKER`; dismiss → prior state |
| `SYSTEM_PICKER` | Native iOS picker owns the screen | Selection → `INSPECTING`; cancel → prior state |
| `INSPECTING` | Immediate card with blurred local preview and “Checking…” | Valid → `TICKETING`; invalid → `REJECTED` |
| `TICKETING` | Card shows indeterminate ring | Ticket issued → `UPLOADING`; stale/offline → `PAUSED`; denied → `REJECTED` |
| `UPLOADING` | Determinate ring and percentage; Remove remains active | Complete → `PROCESSING`; abort/offline → `PAUSED`; server rejection → `REJECTED` |
| `PROCESSING` | Indeterminate ring and “Preparing for Pi…” | Sanitized → `READY`; parser/scanner failure → `REJECTED` |
| `READY` | Clear preview, type badge, generic label | Tap → preview; drag/menu → reorder; remove → `REMOVED`; model change → `BLOCKED_MODEL` |
| `BLOCKED_MODEL` | Preview dimmed; persistent text “Current model cannot read images” | Select capable model → `READY`; remove → `REMOVED` |
| `PAUSED` | Persistent Retry and Remove controls; no automatic background retry | Retry → new ticket → `UPLOADING`; remove → `REMOVED` |
| `REJECTED` | Error icon plus concrete reason; Send excludes the item | Replace → `SYSTEM_PICKER`; remove → `REMOVED` |
| `REMOVED` | Card disappears; persistent “Removed Photo 2 — Undo” action | Undo → previous safe state; subsequent send/navigation → finalize deletion |
| `COMMITTING` | Composer stays visible but controls are guarded against duplicate submit | Success → `SENT` or `QUEUED`; 409 → `STALE`; network ambiguity → `VERIFYING` |
| `VERIFYING` | “Checking whether message was sent…”; GET idempotency status only | Found → `SENT`/`QUEUED`; absent → `PAUSED` |
| `STALE` | Draft and staged media retained; “Conversation changed. Review and send again.” | Explicit Send → mint new ticket; edit/remove → `READY` |
| `QUEUED` | User bubble appears with “Queued” status and Cancel Queue action | Host starts → `SENT`; ticketed cancellation → draft restored |
| `SENT` | Draft clears only after authoritative acknowledgment | Focus returns to textarea; transcript card is rendered |

Never clear text or attachments after an ambiguous network failure. First query the idempotency status; only retry if the host proves the prior commit did not occur.

## Source selection and media limits

| Source | Accepted input | Source limit | Server output |
|---|---|---:|---|
| Photos | JPEG, PNG, WebP, GIF, HEIC/HEIF | 10 MiB/image; 40 MP decoded maximum | Orientation applied; metadata stripped; maximum 2000 × 2000; maximum 3 MiB |
| Camera | Still photo, outward-facing camera preferred | Same as image | JPEG or PNG sanitized rendition |
| Photos video | MOV or MP4 | One video/turn; 20 MiB; 60 s; 1080p | Sandboxed H.264/AAC MP4 plus a six-frame contact sheet |
| Batch | Maximum five items | 30 MiB combined | Maximum two concurrent uploads |

Animated GIFs exceeding 100 frames or 10 seconds are rejected with “Animation is too long.” Do not silently flatten animation. Live Photos must be treated as either a still image or a still-plus-video pair according to what the system picker returns; never imply that Live Photo motion was preserved unless both components were accepted.

The `accept` attribute is a picker hint only. The relay must independently validate length, magic bytes, decoder success, dimensions, duration, codecs, and the normalized output. [MDN file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)

## Gesture contract

| Surface | Tap | Touch-and-hold | Swipe/drag | Required alternative |
|---|---|---|---|---|
| Attach button | Open source tray | No custom behavior | None | Keyboard activation |
| Draft card | Open preview/details | Context menu: Replace, Move earlier/later, Remove | Long-press handle then drag to reorder | Menu commands |
| Remove button | Remove with undo | None | Card may swipe left to reveal Remove | Visible Remove button |
| Source tray | Select row | None | Swipe down to dismiss | Cancel button |
| Full-screen image | Show/hide chrome | None | Pinch zoom; pan when zoomed; swipe down at 1× to close | Close button and Zoom In/Out controls |
| Failed card | Open failure details | None | None | Retry and Remove buttons |
| Transcript attachment | Reveal preview | Menu: Hide preview, Show technical details | Swipe down closes preview | Visible Close button |

Reorder begins only after a 350 ms hold on a dedicated handle, not anywhere on the card. Horizontal scrolling must win when the initial movement exceeds 8 px before the hold threshold. While dragging, lift the card by 2 px and open a destination gap; do not use vibration because iOS PWA haptic support is not dependable.

## Focus and accessibility

DOM and sequential focus order:

1. Attachment-list group, when nonempty.
2. Individual attachment cards through roving focus.
3. Add photo or video button.
4. Message textarea.
5. Send, Queue, Stop, or Retry action according to session state.

Operational rules:

- Opening the source tray moves focus to “Choose from Photos.”
- Closing it restores focus to the attach button.
- Returning from the system picker does not programmatically reopen the keyboard.
- Adding an attachment does not move focus; announce it politely.
- After removing a card, focus the next card, previous card, or attach button in that order.
- Full-screen preview traps focus; closing restores focus to its card.
- Every icon-only control needs an `aria-label`.
- The attachment list uses an accessible name such as “Five draft attachments.”
- Card labels include ordinal, type, status, and size: “Photo 2 of 5, uploading, 63 percent, 1.8 megabytes.”
- Errors are persistent inline text linked through `aria-describedby`; do not rely on a toast.
- Announce progress at start, 25%, 50%, 75%, completion, and failure rather than every event.
- Progress updates must not steal focus.
- Disabled media controls must expose their reason with `aria-describedby`.
- Do not disable the textarea merely because an attachment is uploading.
- Use React Aria modal/dialog primitives for focus containment and restoration. React Aria overlays include focus-management and scroll-lock behavior; mobile popovers should become modal/tray presentations. [React Aria dialog guidance](https://react-spectrum.adobe.com/v3/Dialog.html), [React Aria overlay release](https://react-spectrum.adobe.com/v3/releases/2022-11-15.html)

## Upload and mutation protocol

### Ticket issuance

Request an attachment ticket through the existing authenticated control plane:

```http
POST /v1/sessions/{sessionId}/attachment-tickets
Content-Type: application/json

{
  "revision": 184,
  "items": [{
    "clientId": "local-1",
    "declaredType": "image/heic",
    "byteLength": 4821931,
    "sha256": "…"
  }]
}
```

Each returned ticket is bound to:

- Paired device identity.
- Session ID.
- Current session revision.
- One opaque attachment ID.
- Exact byte length and SHA-256 digest.
- Declared media class.
- Maximum accepted bytes.
- Plan mode.
- One upload operation.
- 90-second expiry.

Hash one file at a time in a worker so the UI thread remains responsive.

### Binary upload

Upload raw bytes rather than multipart filenames:

```http
PUT /v1/attachments/{attachmentId}
Authorization: Bearer <paired-session-token>
X-Pi-Mutation-Ticket: <one-use-ticket>
X-Content-SHA256: <digest>
Content-Type: application/octet-stream
Content-Length: <exact-length>
```

Required behavior:

- Consume the ticket atomically.
- Reject expired, replayed, wrong-device, wrong-session, wrong-revision, size-mismatched, or digest-mismatched requests before making the object available.
- Stop reading and return `413` when the bound size is exceeded.
- Return `202` while validation is pending.
- Expose validation state through authenticated `GET /v1/attachments/{id}/status`.
- Permit removal only through a separate one-use cancel ticket.
- Delete incomplete and uncommitted uploads after ten minutes.
- Rate-limit each paired device to ten attachments per five minutes and 100 MiB per hour.
- Never use a user-supplied filename as a storage key.

OWASP recommends precisely these defense layers: allowlisting, signature and content validation, generated names, size limits, authorization, storage outside the webroot, least privilege, scanning/sandboxing, and CSRF protection. [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

### Quarantine and normalization

The host must:

1. Write to an opaque, nonexecutable quarantine object outside the repository and webroot.
2. Run type detection and decoding in an unprivileged, resource-limited worker.
3. Reject decompression bombs, excessive dimensions, unsupported codecs, malformed data, and declared/detected type mismatches.
4. Apply orientation and rewrite image pixels into a supported Pi format.
5. Strip EXIF, GPS, embedded thumbnails, comments, device information, filenames, and creation dates.
6. Generate a separate 320 px transcript thumbnail.
7. Destroy the original after successful normalization.
8. Store sanitized media encrypted at rest with session-scoped authorization.
9. Serve media only through an authenticated handler with detected `Content-Type`, `X-Content-Type-Options: nosniff`, strict CSP, and no directory exposure.

Uploaded active formats such as SVG, HTML, XML, PDF, and archives are not accepted by this endpoint. OWASP notes that user content can introduce parser exploits and stored active-content attacks and recommends image rewriting plus correct response headers. [OWASP unrestricted upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload), [OWASP image-upload verification](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

### Turn commit

Sending is a second revision-checked mutation:

```http
POST /v1/sessions/{sessionId}/turns
X-Pi-Mutation-Ticket: <one-use-turn-ticket>
Idempotency-Key: <random-128-bit-value>
Content-Type: application/json

{
  "revision": 184,
  "text": "Explain the layout bug shown here.",
  "attachments": [
    {"id": "att_…", "sha256": "…"}
  ]
}
```

The turn ticket must bind the exact text hash, ordered attachment IDs and digests, session revision, device, and host-authoritative plan mode. The host consumes it atomically or fails closed. A stale revision returns `409` without invoking Pi.

The host extension, not the client, chooses plan mode. It must reject a client-supplied attempt to change mode and continue enforcing nonmutating tools after attachments are injected.

### Delivery to Pi

For images, the host adapter reads the sanitized rendition and constructs in memory:

```text
ImageContent(data: base64, mimeType: detectedType)
TextContent(userCaption)
```

Pi’s documented API accepts this structure and exposes vision capability through model metadata. [Pi AI image input](https://github.com/badlogic/pi-mono/blob/main/packages/ai/README.md)

For video:

- Store the sanitized MP4 in the session-scoped read-only attachment store.
- Provide Pi an opaque read-only attachment path plus the six-frame contact sheet.
- Mark the generated caption as “Video attachment; six sampled frames; full file available read-only.”
- Do not claim native video understanding unless the selected provider and Pi adapter explicitly advertise it.

Raw image base64 must exist only in the host adapter’s in-memory provider request. It must not enter relay messages, application logs, SSE/WebSocket events, analytics, crash reports, clipboard output, or the UI transcript.

If phone-to-host traffic uses a Tailscale address, Tailscale encrypts direct and relayed connections end to end with WireGuard; DERP cannot decrypt the traffic. If “relay” means an application server outside that device-to-device tunnel, add application-layer end-to-end encryption so it handles ciphertext only. [Tailscale encryption](https://tailscale.com/docs/concepts/tailscale-encryption), [Tailscale DERP security](https://tailscale.com/docs/reference/derp-servers)

## Transcript and privacy presentation

A sent user message renders:

- Sanitized thumbnail or video poster.
- Generic “Photo” or “Video” label.
- Dimensions or duration and sanitized byte size.
- Status: Queued, Sent to Pi, Failed, or Expired.
- No filename, original date, device, location, checksum, storage path, URL, or attachment ID.

Tap reveals the sanitized media. Transcript previews are session-authorized and never publicly addressable. Copying a message produces:

```text
Explain the layout bug shown here.
[photo attachment redacted]
```

`URL.createObjectURL()` may be used for unsent local previews, but every URL must be revoked when its card is removed, replaced, sent, or unmounted to release memory. [MDN file previews and `revokeObjectURL`](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)

When the PWA becomes hidden, immediately cover the app with the existing privacy surface and stop decoding media. Abort active uploads and show Retry after return; do not assume background execution will complete. The Page Visibility API reports when a page becomes hidden or visible. [MDN Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)

## Visual and motion specification

- Button press: opacity 0.82 and scale 0.96 over 80 ms; restore over 120 ms.
- Source tray: carbon scrim fades to 32%; tray translates from 12 px below to rest over 180 ms with no bounce.
- Draft-card insertion: 140 ms fade plus 4 px vertical settle.
- Reorder: card tracks the finger directly; surrounding cards move over 120 ms.
- Remove: 120 ms width collapse after the card fades; persistent Undo appears below the strip.
- Upload ring: determinate stroke movement, no continuous pulsing.
- Completion: one 160 ms clay checkmark draw; never loop.
- Full-screen preview: 160 ms opacity transition; no simulated depth or blur animation.
- `prefers-reduced-motion: reduce`: remove scaling, translation, card movement, and checkmark drawing; use a ≤100 ms crossfade and instantaneous reordering.

Apple recommends brief, precise feedback, cancellation without waiting for animation, and reduced movement when Reduce Motion is enabled. The web preference is exposed by `prefers-reduced-motion`. [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion), [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)

## Objective acceptance checks

- Every composer, tray, card, preview, remove, retry, and close target computes to at least 44 × 44 CSS px.
- VoiceOver announces source rows, attachment order, upload state, errors, and completion without unexpected focus jumps.
- Every swipe, drag, pinch, and long-press operation has a visible button or menu alternative.
- Hardware keyboard can traverse, add, reorder, remove, preview, close, type multiline text, and send.
- Closing any modal restores focus to its invoker.
- Selecting an invalid extension, forged MIME type, malformed image, oversized object, decode bomb, or unsupported codec fails before Pi receives an event.
- Reusing an upload or turn ticket fails.
- Changing the session revision before commit produces `409` and no Pi message.
- Changing to a non-vision model blocks an image turn rather than silently omitting the image.
- Repeated Send taps create one turn.
- Network loss preserves text and cards and exposes Retry.
- Relay, HTTP, application, Pi-extension, analytics, and crash logs contain no base64, original filename, EXIF, URL, or filesystem path.
- Copy transcript produces redacted placeholders only.
- Removing or replacing a local preview revokes its object URL.
- Host-enforced plan mode rejects attempted mutating tools after an attachment turn.
- Light, dark, increased text size, landscape, keyboard-open, keyboard-closed, VoiceOver, Switch Control, and Reduce Motion layouts pass without obscured focus or unreachable controls.

# 3. Divergent / minority ideas worth considering

## Make selection local-only until Send

The primary specification stages immediately because it provides progress, retry, and resilience before message commit. A stricter privacy mode could keep selected `File` objects exclusively on-device until Send. The preview would carry “Not uploaded” and Send would become a visibly two-phase action.

This minimizes abandoned-upload exposure but is less resilient to iOS process eviction, makes Send slower, and risks losing selected files if the PWA reloads. It is most defensible as an optional “Upload only on Send” setting, not the default.

## Default transcript thumbnails to blurred

A privacy-first mode could show every historical attachment as a blurred parchment card until tapped. The current foreground draft and just-sent message remain visible, but revisiting a session requires deliberate reveal. This reduces shoulder-surfing and app-switcher exposure while preserving a recognizable attachment layout.

The tradeoff is slower visual scanning and weaker parity with Claude/Kimi. A per-device “Hide media previews” setting is preferable to a per-message confirmation dialog.

## Treat video as a sampled-frame object, not a file

Rather than exposing a read-only video path to Pi, the host could always convert short video into a contact sheet plus audio transcript, then destroy the video. This sharply reduces parser and workspace exposure and gives image-capable models predictable input.

It also discards temporal detail and prevents Pi from inspecting the original media with tools. The UI would need to say “Six frames and audio transcript will be sent,” not “Video will be sent.”

## Use an explicit review tray before upload

For exceptionally sensitive environments, selection could open a review screen that displays:

- What will be uploaded.
- Which metadata will be removed.
- Which Pi host and model provider will receive it.
- A “Stage attachments” confirmation.

This makes data flow explicit but introduces a confirmation tax on every upload. A better compromise is to show this review only on first use and expose it later through attachment details.

## Provide a camera-first shortcut outside the composer

Claude’s iOS app exposes camera entry through widgets and Control Center. A PWA cannot match native App Intents, but it could provide a home-screen quick route such as `/capture` that opens a new plan-mode draft and immediately invokes the camera after an explicit button press. Claude demonstrates the value of one-step camera entry. [Claude iOS camera shortcuts](https://support.claude.com/en/articles/10263469-use-claude-app-intents-shortcuts-and-widgets-on-ios)

This should remain separate from the main composer and must not bypass ticketing, revision checks, or the preview step.

## Allow “Attach as read-only file” for text-only models

Instead of disabling attachments completely for text-only models, Pi Remote could offer an advanced action that stages media as a read-only filesystem artifact and sends its path. The agent could use host tools to inspect or transform it.

This is materially harder to secure and may tempt the agent to invoke mutating conversion tools. It should remain experimental until read-only attachment mounts and plan-mode tool enforcement are independently verified.

# 4. Open questions and risks

1. **Pi session persistence:** Verify whether the current Pi session manager persists `ImageContent.data` into JSONL. If it does, the adapter needs a redacted reference serializer and rehydration layer before release; API-level redaction alone is insufficient.

2. **Provider retention:** Sanitizing the image does not prevent the selected model provider from receiving its pixels. The first-use disclosure must identify that Pi’s configured model provider receives sanitized media and link to the provider’s retention policy.

3. **Video semantics:** Pi’s documented multimodal API covers images, not native video. Decide whether the first production release supports video through contact sheets/read-only paths or explicitly labels the picker “Photos” and postpones video.

4. **Animated and Live Photo fidelity:** Test how supported iOS versions materialize HEIC, animated images, edited photos, iCloud-only originals, and Live Photos. Do not infer preservation from the filename or MIME value.

5. **`capture` variability:** The `capture` attribute is not universally consistent. Camera must be feature-tested on the minimum supported iOS version, and the fallback must remain a functioning picker. [MDN `capture` compatibility warning](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)

6. **Current Safari storage regression:** An open WebKit report says Photos-picker files can accumulate in Safari “Documents & Data” and eventually break selection. Large video support should remain behind device testing until the issue is resolved or bounded operationally. [WebKit bug 318572](https://bugs.webkit.org/show_bug.cgi?id=318572)

7. **Keyboard and safe-area regressions:** Test installed Home Screen mode separately from a Safari tab. Visual viewport, `dvh`, and safe-area behavior differ across iOS releases and keyboard states.

8. **Background suspension:** The PWA cannot promise background upload completion. The contract must be “paused; tap Retry,” never an indefinite spinner.

9. **Revision granularity:** Confirm that streaming assistant tokens do not advance the revision used for user-mutation conflict checks; otherwise uploads prepared during an active turn will become stale continuously.

10. **Queued attachments:** Committed queued messages need attachment retention until the queued turn starts. Canceling a queued turn must use a ticketed mutation and must release its media afterward.

11. **Relay meaning:** Confirm whether the “relay” is merely Tailscale DERP/peer relay or an application-level service. Tailscale protects DERP traffic end to end; a separate application relay needs its own ciphertext-only design.

12. **Image-decoder attack surface:** HEIC/HEIF and video decoding expand the native parser surface. The sanitizer must run out of process with CPU, memory, time, frame-count, and output-size limits.

13. **Deletion semantics:** Define session retention and deletion guarantees for sanitized attachments, generated thumbnails, video contact sheets, provider-request caches, backups, and aborted quarantines.

14. **Mobbin access:** Mobbin’s public surface confirms its library supports real shipped screens and queries such as iOS bottom-sheet comparisons, but individual Claude/Kimi attachment screen URLs were authentication-gated in this pass. No measurements in this report are presented as observations from inaccessible Mobbin screens. [Mobbin MCP design library](https://mobbin.com/mcp)

# 5. Sources

## Platform and accessibility

- [Apple Human Interface Guidelines — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple Human Interface Guidelines — Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures/)
- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple Human Interface Guidelines — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Apple Human Interface Guidelines — Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields)
- [WebKit — Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WebKit — Visual Viewport API](https://webkit.org/blog/9674/new-webkit-features-in-safari-13/)
- [WebKit — HTML Media Capture](https://webkit.org/blog/7477/new-web-features-in-safari-10-1/)
- [W3C File API](https://www.w3.org/TR/FileAPI/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG focus-order guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- [WAI ARIA upload-progress technique](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA25)

## Web and React implementation

- [React Aria FileTrigger](https://react-spectrum.adobe.com/v3/FileTrigger.html)
- [React Aria Dialog](https://react-spectrum.adobe.com/v3/Dialog.html)
- [React Aria TextArea](https://react-spectrum.adobe.com/v3/TextArea.html)
- [MDN file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)
- [MDN `capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)
- [MDN file previews and object URLs](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)
- [MDN `XMLHttpRequest.upload`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload)
- [MDN Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)
- [WebKit safe-area keyboard issue](https://bugs.webkit.org/show_bug.cgi?id=217754)
- [WebKit Photos-picker storage issue](https://bugs.webkit.org/show_bug.cgi?id=318572)

## Security and transport

- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP Unrestricted File Upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
- [Tailscale encryption](https://tailscale.com/docs/concepts/tailscale-encryption)
- [Tailscale DERP servers](https://tailscale.com/docs/reference/derp-servers)
- [RFC 4648 Base64](https://datatracker.ietf.org/doc/html/rfc4648)

## AI-chat and coding-agent prior art

- [Claude — Upload files](https://support.claude.com/en/articles/8241126-upload-files-to-claude)
- [Claude — iOS camera shortcuts and widgets](https://support.claude.com/en/articles/10263469-use-claude-app-intents-shortcuts-and-widgets-on-ios)
- [Kimi Code — Media file input](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html)
- [Perplexity — Mobile image upload](https://www.perplexity.ai/help-center/en/articles/10354840-uploading-images-on-perplexity)
- [Pi coding-agent image support](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)
- [Pi AI image-content API](https://github.com/badlogic/pi-mono/blob/main/packages/ai/README.md)
- [remote-pi](https://pi.dev/packages/remote-pi)
- [pi-image-drop](https://pi.dev/packages/%40narumitw/pi-image-drop)
- [Pi Web](https://github.com/agegr/pi-web)
- [Harness Remote](https://github.com/giuliastro/harness-remote)
- [CC Pocket](https://github.com/K9i-0/ccpocket)
- [Grok Remote](https://github.com/daniel-farina/grok-remote)
- [Mobbin design-reference library](https://mobbin.com/mcp)
