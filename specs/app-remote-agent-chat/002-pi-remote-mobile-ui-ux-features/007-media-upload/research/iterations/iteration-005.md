<!-- provenance: external-CLI orchestration pass; original file iter-05-sol.md -->
> **Source pass 5** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-5-sol.md`.

<!-- F5-media-upload | model=sol | lens=react-implementation | iter 5/15 | 2026-08-15T20:24:44.764Z -->

# 1. Findings for the react-implementation lens

## Use native file inputs through React Aria

`FileTrigger` from `react-aria-components` is the correct picker primitive. It wraps a pressable control with a visually hidden native `<input type="file">` and supports `acceptedFileTypes`, `allowsMultiple`, and `defaultCamera="user" | "environment"`. The trigger still needs a visible label or `aria-label`. This preserves iOS’s Photos/Camera permission and selection UI instead of recreating it in JavaScript. [React Aria FileTrigger](https://react-spectrum.adobe.com/react-aria/FileTrigger.html)

Use two direct `FileTrigger` actions inside an attachment sheet:

- **Choose Photos**: explicit image MIME types, `allowsMultiple`.
- **Take Photo**: `acceptedFileTypes={["image/*"]}`, `defaultCamera="environment"`, single-file only.

The picker must open synchronously from the user’s press. File pickers consume transient user activation; awaiting work, using `setTimeout`, or closing/unmounting the sheet before triggering the hidden input can make Safari refuse to open it. Keep the `FileTrigger` mounted until `onSelect` or cancel returns, then close the sheet. [HTML picker activation requirements](https://html.spec.whatwg.org/multipage/input.html), [WebKit user-gesture behavior](https://bugs.webkit.org/show_bug.cgi?id=47593)

`capture` is only a hint and is not consistently supported across browsers. React Aria’s `defaultCamera` maps to that native mechanism, so the camera action must always have a functional Photos fallback. [MDN capture](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)

## Scope the first release to still images

Pi’s documented native input path supports `.jpg`, `.jpeg`, `.png`, `.gif`, and `.webp`; Pi RPC accepts image content as `{type:"image", data:<base64>, mimeType}`. Pi’s model definitions separately declare whether the selected model accepts image input. There is no equivalent documented video or audio prompt input. The first release should therefore label the feature **Add photo**, not imply that videos are analyzable. [Pi image support](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md), [Pi RPC image command](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md), [Pi model input declaration](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/custom-provider.md)

Ship support for JPEG, PNG, WebP, HEIC, and HEIF inputs, normalized server-side to JPEG or PNG. Do not initially accept SVG, PDF, GIF, video, archives, or arbitrary files. SVG is executable active content; animated and container formats expand both parser and decompression risk. OWASP recommends a narrow allowlist, server-side type/signature validation, generated storage names, size limits, storage outside the web root, and CSRF protection. [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

Do not trust `File.type`, the extension, or `accept`. iOS can transcode library items and return a different representation or MIME type than expected, including JPEG/HEIC conversions. `accept` is picker guidance, not a security boundary. [WebKit iOS type-conversion report](https://bugs.webkit.org/show_bug.cgi?id=239001), [WebKit HEIC accept-order bug](https://bugs.webkit.org/show_bug.cgi?id=303803), [MDN file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)

## Keep original bytes and metadata out of the transcript

iPhone images may embed location, capture time, device, and camera metadata. Apple explicitly warns that shared photos can expose this information. The relay should auto-orient and re-encode accepted images without EXIF, IPTC, or XMP before Pi or transcript storage sees them. [Apple location-metadata guidance](https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web)

`sharp` is a suitable relay-side normalizer: it can limit decoded pixels, auto-orient using EXIF, restrict permitted decoders, and strips metadata by default unless metadata-preservation APIs are requested. Do not enable its `unlimited` option. [sharp constructor limits](https://sharp.pixelplumbing.com/api-constructor/), [sharp metadata behavior](https://github.com/lovell/sharp/blob/main/lib/index.d.ts)

Pi RPC base64 is the cleanest boundary because Pi already understands image content blocks. Do not pass a user-derived filesystem path in the prompt. The relay should read the normalized spool object, base64-encode it only immediately before the RPC call, then release the buffer. [Pi RPC documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)

Pi sessions normally auto-save, and image content is part of a user message. It is therefore a security-relevant inference that standard Pi persistence may retain base64 image data in its JSONL session. Run the controlled Pi process with `--no-session`, or use the SDK with a relay-owned session manager that stores attachment references rather than image bytes. This must be verified against the exact deployed Pi version before release. [Pi session and RPC documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)

## React state must distinguish local selection from remote mutation

Keep selected `File` objects in a component-scoped `Map<clientId, File>` held by a ref. Keep only renderable metadata and status in `useReducer`. This avoids copying large `File` objects through context/state snapshots while producing deterministic transitions. React recommends `useReducer` for state updated through explicit actions; effects that synchronize with external systems must provide matching cleanup, which React Strict Mode deliberately stress-tests. [React useReducer](https://react.dev/reference/react/useReducer), [React useEffect](https://react.dev/reference/react/useEffect)

Use `URL.createObjectURL(file)` for local previews, never `FileReader.readAsDataURL()`. Revoke every URL on removal, replacement, send completion, conversation change, and unmount. Object URLs are the browser-supported mechanism for previewing local `File` objects and have an explicit revocation API. [MDN File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)

Do not resize or convert HEIC/JPEG in the iPhone client. Decoding a 48-megapixel photo can create a much larger bitmap than its compressed file and adds orientation/color-management discrepancies. The relay has enforceable decoder limits and can normalize once.

## Use XHR for determinate upload progress

The Fetch API still does not expose standard upload progress. Use a small `XMLHttpRequest` adapter, register `xhr.upload` listeners before `open()`, and expose `abort()` to the hook. [MDN file-upload progress](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications), [MDN XMLHttpRequest progress](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest)

Limit client concurrency to two files. More parallel decodes, previews, XHR bodies, and server conversions increase memory pressure without materially improving a private-tailnet workflow.

Do not use React 19 `useOptimistic` for authoritative upload state. “Uploaded” must reflect a relay receipt, verified content, and an unconsumed attachment reference; it cannot be optimistic. A reducer plus an imperative XHR adapter makes those boundaries explicit.

## Installed-PWA uploads cannot be treated as background jobs

WebKit still has an open request for Background Sync. Mobile lifecycle events are also not guaranteed when the browser or Home Screen app is terminated. The app must reconcile upload status with the relay whenever it becomes visible instead of assuming an in-flight XHR finished. [WebKit Background Sync issue](https://bugs.webkit.org/show_bug.cgi?id=182565), [MDN page lifecycle warning](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event)

On `visibilitychange`:

- Persist text draft and serializable attachment metadata only.
- Do not claim an upload was canceled or completed.
- On return, query attachment status.
- If the ticket is consumed but no ready attachment exists, discard the partial spool and request a fresh ticket.
- Never rely on a service worker to resume the upload.

A new WebKit report indicates that Photos-picker materializations may accumulate in Safari storage and eventually cause silent picker cancellation. Web content cannot currently release those native temporary files. This warrants a documented troubleshooting path and testing on current iOS releases. [WebKit Photos-picker storage issue](https://bugs.webkit.org/show_bug.cgi?id=318572)

## The composer must tolerate iOS viewport defects

Use `viewport-fit=cover` and pad the composer with `max(12px, env(safe-area-inset-bottom))`. WebKit documents safe-area variables for avoiding the Home indicator. [WebKit safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

Keep the composer in the app’s layout grid rather than stacking several independently fixed elements. Installed PWAs have continuing bugs around safe-area values, keyboard-open viewport height, and bottom-fixed positioning. Test the attachment strip both above the keyboard and after returning from Photos/Camera. [WebKit standalone viewport issue](https://bugs.webkit.org/show_bug.cgi?id=254868), [WebKit keyboard bottom-offset issue](https://bugs.webkit.org/show_bug.cgi?id=292603)

## Prior art supports explicit per-file state, but not its trust model

Open WebUI creates an attachment item before upload and records `uploading`, `uploaded`, error, size, and server ID states. That state visibility is worth retaining, but Pi Remote should not copy its eager-upload behavior because this product’s read-only posture requires a clear mutation boundary. [Open WebUI MessageInput](https://github.com/open-webui/open-webui/blob/main/src/lib/components/chat/MessageInput.svelte)

`grok-remote`, a tailnet-oriented agent client, ships five attachments per turn at 5 MB each and writes files into an agent upload directory. This is useful evidence that mobile remote-agent attachment limits need to be explicit; Pi Remote should avoid exposing those filesystem paths to the agent and should normalize into opaque storage instead. [grok-remote](https://github.com/daniel-farina/grok-remote)

`pi-image-tools` demonstrates the Pi-side precedent of queueing image attachments before the next user message and showing an inline preview. Pi Remote should preserve that “draft first, send together” model. [pi-image-tools](https://github.com/MasuRii/pi-image-tools)

Mobbin’s public catalog confirms it contains production iOS screens and flows, but no stable public Claude/Kimi attachment-screen URL was retrievable in this pass. No implementation claim here is presented as a Mobbin observation. [Mobbin iOS catalog](https://mobbin.com/browse/ios/apps)

# 2. Concrete spec contribution

## Product limits

Ship these enforceable limits:

| Constraint | Value |
|---|---:|
| Attachments per turn | 6 |
| Original bytes per attachment | 20 MiB |
| Original aggregate per turn | 60 MiB |
| Decoded-pixel ceiling | 50 megapixels |
| Normalized longest edge | 4096 px |
| Normalized output ceiling | 8 MiB |
| Accepted input | JPEG, PNG, WebP, HEIC, HEIF |
| Pi-bound output | JPEG or PNG |
| Parallel uploads | 2 |
| Upload-ticket lifetime | 120 seconds |
| Unsent normalized-object TTL | 15 minutes |

Reject empty files, active formats, unsupported models, over-limit files, and images that cannot be fully decoded. Return a specific reason rather than a generic upload failure.

## User flow and gestures

1. The composer has a 44×44 CSS-pixel paperclip/photo `Button` labeled **Add photo**. Although WCAG 2.2 AA requires at least 24×24, 44×44 also meets its enhanced target and matches a comfortable iPhone target. [WCAG 2.2 target size](https://www.w3.org/TR/WCAG22/)

2. Tapping it opens a bottom-anchored `Modal`/`Dialog` titled **Add a photo**, containing:

   - **Choose Photos** — multiple selection.
   - **Take Photo** — rear camera, one image.
   - **Cancel**.

3. Include the one-line disclosure: **Photos stay on this iPhone until you tap Send. Location and camera metadata will be removed.**

4. On selection, close the sheet, add local previews above the textarea, and leave all bytes local. Announce “2 photos added.” Keep focus on the attachment trigger rather than forcing focus into the textarea.

5. The preview strip scrolls horizontally. Each 72×72 tile contains:

   - Cropped thumbnail.
   - Generic label such as `Photo 1`; never display the original filename.
   - 44×44 remove target whose visual close glyph may be 20×20.
   - Status overlay only after Send starts.

6. Tapping a thumbnail opens a labeled full-screen preview dialog. Support ordinary browser pinch zoom; do not disable page zoom with `user-scalable=no`.

7. Tapping Send performs validation, ticket acquisition, upload, normalization, and Pi submission. The Send button becomes **Stop** while work is cancelable. Text and all local attachments remain recoverable after validation, network, stale-revision, or Pi-rejection errors.

8. Removing an uploading attachment aborts its XHR, invalidates its local state, and asks the relay to discard any partial spool. A consumed ticket is never reused.

## React component structure

| Component/hook | Responsibility |
|---|---|
| `ComposerAttachmentButton` | `DialogTrigger`, accessible button, capability/limit state |
| `AttachmentActionSheet` | Mobile `Modal` + `Dialog`, heading, disclosure and picker actions |
| `PhotoLibraryTrigger` | `FileTrigger`, explicit MIME list, multiple |
| `CameraTrigger` | `FileTrigger`, `defaultCamera="environment"`, single |
| `AttachmentDraftProvider` | Reducer and non-serializable `File` ref-map scoped to the active composer |
| `useAttachmentDraft()` | Add, remove, validate, reset and ordered selectors |
| `useObjectUrl(file)` | Create and revoke preview URL |
| `AttachmentStrip` | Ordered semantic list and horizontal scrolling |
| `AttachmentTile` | Preview, remove action and per-file status |
| `AttachmentPreviewDialog` | Full-screen image inspection |
| `useUploadQueue()` | Two-worker XHR queue, cancel and status reconciliation |
| `UploadStatusRegion` | Aggregate progress and throttled screen-reader announcements |
| `attachmentApi` | Ticket, raw upload, status and discard calls |
| `piImageBridge` | Relay-only normalized bytes → Pi RPC image blocks |

Use React Aria components rather than hand-built button/dialog semantics. React Aria exposes interaction states through data attributes, which Tailwind can target without duplicating press/focus logic. [React Aria styling](https://react-spectrum.adobe.com/react-aria/getting-started.html)

Recommended reducer shape:

```ts
type AttachmentPhase =
  | "local"
  | "authorizing"
  | "uploading"
  | "processing"
  | "ready"
  | "sending"
  | "sent"
  | "rejected"
  | "failed"
  | "stale"
  | "cancelled";

type DraftAttachment = {
  clientId: string;
  ordinal: number;
  displayName: string; // "Photo 1"
  declaredType: string;
  size: number;
  previewUrl: string;
  phase: AttachmentPhase;
  progress: number | null;
  attachmentId?: string;
  errorCode?: string;
};
```

Never store `File`, base64, original filename, local path, ticket, or authenticated media URL in reducer state, query caches, error objects, analytics, or browser persistence.

Force-remount each `FileTrigger` after selection by incrementing a `pickerEpoch` key. This clears the native input so selecting the same photo again still produces a selection event. File inputs cannot be programmatically populated and should remain uncontrolled. [React input documentation](https://react.dev/reference/react-dom/components/input)

## Mutation and upload protocol

### Ticket acquisition

```http
POST /api/sessions/{sessionId}/attachment-tickets
If-Match: "revision-42"
Content-Type: application/json
X-CSRF-Token: …
```

```json
{
  "clientId": "random-client-id",
  "declaredType": "image/heic",
  "bytes": 7341820
}
```

The relay verifies:

- Tailscale identity and enrolled device.
- Active session ownership.
- Exact session revision.
- Image-capable active Pi model.
- File and aggregate limits.
- CSRF proof.
- Upload capability allowed by server policy.

Tailscale Serve identity headers are safe only when the backend listens on localhost behind Serve; otherwise direct callers can spoof them. Bind the relay to loopback and reject requests that did not traverse the trusted proxy. [Tailscale Serve identity headers](https://tailscale.com/docs/features/tailscale-serve)

The response contains a random opaque upload ID and signed one-use ticket bound to identity, device, session, revision, client ID, declared maximum bytes, and a 120-second expiry. Do not place the ticket in a query string.

### Raw upload

```http
PUT /api/attachments/{opaqueUploadId}
Authorization: UploadTicket …
Content-Type: application/octet-stream
Content-Length: …
```

Upload one file per request. The relay consumes the ticket when body reception begins. It streams into an outside-web-root temporary object with a generated name and hard byte limit. An interrupted, malformed, expired, replayed, or oversized request deletes the partial object.

Required responses:

| Status | Meaning |
|---|---|
| `201` | Normalized attachment ready |
| `409` | Ticket replay or session revision stale |
| `413` | Byte/aggregate limit exceeded |
| `415` | Signature or decoded format not allowed |
| `422` | Decode failed or decoded-pixel limit exceeded |
| `429` | Per-device upload rate exceeded |

The normalizer must:

1. Inspect magic bytes and decoder result.
2. Allow only JPEG, PNG, WebP, HEIF/HEIC decoders.
3. Enforce 50 MP before full processing.
4. Decode exactly one still frame.
5. Auto-orient.
6. Resize to fit within 4096×4096 without enlargement.
7. Convert to sRGB.
8. Strip EXIF/IPTC/XMP and original filename.
9. Encode opaque images to JPEG; preserve transparency as PNG.
10. Delete the original spool immediately after normalized output succeeds.

### Turn submission

After all files are `ready`, use the existing one-use, revision-checked turn mutation:

```json
{
  "text": "What is causing this layout bug?",
  "attachments": [
    {"attachmentId": "opaque-id-1"},
    {"attachmentId": "opaque-id-2"}
  ]
}
```

The relay must atomically verify that every attachment:

- Belongs to the same identity, device, session, and revision.
- Is normalized and unexpired.
- Has not already been consumed by another turn.

Only then convert normalized bytes to Pi RPC image blocks. If Pi rejects the prompt before acceptance, preserve attachment readiness for a newly ticketed retry. Once Pi accepts the prompt, mark attachments consumed and append the redacted transcript event.

Upload permission must not change Pi’s tool posture. The host and Pi extension continue enforcing plan/read-only mode independently of the image pathway.

## Transcript and redaction

Persist only:

```json
{
  "kind": "image",
  "attachmentId": "opaque-id",
  "label": "Photo 1",
  "mediaType": "image/jpeg",
  "width": 3024,
  "height": 4032,
  "normalizedBytes": 1840201
}
```

Do not persist original name, original type, EXIF, local path, ticket, upload URL, base64, or original byte size.

Transcript thumbnails load through an authenticated same-origin endpoint with:

```http
Cache-Control: private, no-store
Content-Security-Policy: default-src 'none'; img-src 'self' blob:
X-Content-Type-Options: nosniff
Content-Disposition: inline; filename="photo-1.jpg"
```

The service worker must explicitly exclude `/api/attachments/**`, ticket responses, and upload/status requests from runtime caching. Error and request logging middleware must suppress multipart/raw bodies, authorization headers, tickets, attachment IDs, and Pi RPC image data.

## Accessibility

- Use React Aria `Button`, `FileTrigger`, `DialogTrigger`, `Modal`, `Dialog`, `Heading`, and `ProgressBar`.
- Label the dialog and restore focus to its trigger on dismiss.
- Represent the strip as a list. Each preview button is named `Open Photo 1 preview`; each remove action is named `Remove Photo 1`.
- Aggregate progress uses a determinate progress bar while bytes are transferring and indeterminate state during server normalization.
- Use one `aria-live="polite"` status node. Announce phase changes and progress only at 25% increments to avoid VoiceOver flooding.
- Validation and security rejection use `role="alert"` and include the affected ordinal: “Photo 2 wasn’t added: images must be 20 MB or smaller.”
- Never move focus merely because progress changed. After removal, focus the next remove button, otherwise the previous one, otherwise Add photo.
- Provide every drag-like or swipe action through a normal button; WCAG 2.2 requires a non-drag alternative. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- Status updates must be programmatically exposed without taking focus. [WAI upload progress technique](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA25)

## Visual and motion specification

- Attachment tiles: 72×72 px, 10 px radius, 1 px carbon border at low opacity.
- Strip gap: 8 px; composer-to-strip gap: 10 px.
- Local tiles use the unmodified preview. Uploading adds a low-opacity parchment scrim and clay progress edge.
- Clay `#d97757` is reserved for active selection/progress and the primary Send action; do not rely on clay alone to communicate failure.
- Use Inter for status/metadata and Source Serif 4 only for user-authored transcript text.
- Tailwind 4 should expose existing design tokens through `@theme` and use a `[data-theme=dark]` custom dark variant rather than duplicating hard-coded colors. [Tailwind theme variables](https://tailwindcss.com/docs/theme), [Tailwind dark mode](https://tailwindcss.com/docs/dark-mode)
- Sheet entrance: 160 ms translate/fade; tile insertion: 120 ms fade/scale from 0.98; removal: 100 ms fade.
- Under `prefers-reduced-motion`, remove translation, scale, and animated progress interpolation; retain instantaneous state changes.
- Apply composer bottom padding using `max(12px, env(safe-area-inset-bottom))`.

## Required pass/fail checks

- Selecting the same photo twice after removing it works.
- Camera works after backgrounding and resuming the installed PWA; failure still leaves Choose Photos operational.
- HEIC, rotated JPEG, transparent PNG, and WebP normalize with correct visible orientation.
- SVG renamed `.jpg`, HTML renamed `.png`, MIME spoofing, truncated JPEG, oversized body, and decompression-bomb dimensions fail closed.
- EXIF GPS, device model, timestamp, original filename, ticket, base64, and storage path are absent from API events, transcript JSON, logs, Pi-visible text, and exported transcript.
- Replayed, expired, wrong-device, wrong-session, and stale-revision tickets return failure and create no retained object.
- Network interruption preserves the text and local previews; retry obtains a new ticket.
- Background/resume reconciles with relay state without duplicate Pi submissions.
- VoiceOver can add, inspect, remove, cancel, retry, and send attachments without focus loss.
- Light/dark, 200% text zoom, Reduce Motion, landscape, hardware keyboard, software keyboard, Safari tab, and installed-PWA modes pass.
- Every object URL and XHR listener is cleaned up under React Strict Mode.
- No attachment API response is cached by the service worker.

# 3. Divergent / minority ideas worth considering

## Prefer one native picker over a custom action sheet

A single `FileTrigger` without `capture` lets iOS present its own Photo Library/Camera/Browse choices. This is less brand-controlled but removes a custom modal, avoids unmount/user-activation mistakes, and may survive camera regressions better. It should be A/B-tested against the explicit two-action sheet rather than dismissed as visually plain.

## Eager encrypted staging after selection

The baseline keeps bytes local until Send. An alternative is to upload immediately after the user confirms the Photos picker, but encrypt the normalized object under an unsent-draft key and delete it after a short TTL. This improves send latency and survival across PWA termination, but it weakens the clearest interpretation of “read-only until Send” and creates abandoned remote data.

## Blur historical thumbnails by default

Live draft and newly sent images could remain visible, while older transcript thumbnails render blurred with a **Reveal Photo 1** button. This reduces shoulder-surfing and accidental disclosure when revisiting a coding transcript. It is stronger than mainstream chat behavior but consistent with the product’s redaction posture.

## Feed Pi temporary paths rather than RPC base64

Pi can discover images from filesystem paths, and path delivery avoids base64 expansion. [Pi image support](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) However, this introduces path disclosure, file-lifetime coupling, shell/path-injection review, and the possibility that tools read the spool. RPC image blocks are the safer default unless server memory measurements prove unacceptable.

## Render only a derived thumbnail in the transcript

The relay could delete the full normalized image immediately after Pi accepts it and retain only a small redacted thumbnail for transcript continuity. This minimizes retained sensitive content but prevents later model retries, zoom inspection, and faithful conversation replay. Make retention a conscious product setting rather than an accidental consequence of storage implementation.

# 4. Open questions + risks

1. **Exact Pi build:** Verify the deployed Pi package/fork’s RPC image schema, model-capability reporting, maximum provider image size, and session persistence behavior. The public repository has active forks and changing package names.

2. **Session recovery:** If Pi runs `--no-session`, decide whether an agent-process crash may lose multimodal context or whether the relay must implement a redacted custom session manager.

3. **Retention:** Define whether normalized images live until conversation deletion, for a fixed number of days, or only until Pi acceptance. Transcript previews and minimal retention pull in opposite directions.

4. **HEIC decoder deployment:** Confirm that the target relay build of `sharp`/libvips includes HEIF input support on every supported host. If not, reject HEIC with actionable copy rather than silently attempting client conversion.

5. **Provider variance:** Pi supports image blocks, but the selected model may not. Decide whether Add photo is disabled, hidden, or offers a ticketed model switch when the current model is text-only.

6. **Color fidelity:** Default sRGB normalization maximizes provider compatibility but may visibly flatten Display-P3 photography. Determine whether fidelity or predictable processing is the priority.

7. **Large-photo latency:** A 20 MiB HEIC on a slower tailnet plus normalization may outlive a 120-second ticket. Tickets should be validated at upload start, with a separate bounded body deadline, rather than expiring mid-stream after legitimate progress.

8. **iOS process death:** Local-only attachments cannot be safely restored after WebKit kills the PWA without persisting sensitive bytes. The recovery message must say that text was restored but photos need to be reattached.

9. **WebKit storage regression:** The 2026 Photos-picker storage report could make repeated media use consume Safari storage beyond the app’s control. Track the WebKit issue and include a support diagnostic for repeated picker cancellation. [WebKit issue 318572](https://bugs.webkit.org/show_bug.cgi?id=318572)

10. **Camera regressions:** Home Screen camera capture has previously had resume-related black-screen and immediate-dismiss regressions. Keep a non-camera path and include real-device regression testing, not only simulator coverage. [WebKit camera/PWA issue](https://bugs.webkit.org/show_bug.cgi?id=202884), [WebKit capture dismissal regression](https://results.webkit.org/commit?id=278827%40main&repository_id=webkit)

11. **Tailscale trust boundary:** Tailscale connectivity is not sufficient application authorization. Confirm that the relay listens only on loopback behind Serve, validates the populated identity, and binds mutation tickets to that identity and enrolled device. [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve)

12. **Original-versus-normalized semantics:** Metadata stripping and re-encoding mean Pi does not receive the byte-identical original. The UI should say “prepared securely” rather than “original uploaded,” and forensic workflows may require a separately authorized mode later.

# 5. Sources

- [React Aria — FileTrigger](https://react-spectrum.adobe.com/react-aria/FileTrigger.html)
- [React Aria — Getting started and styling](https://react-spectrum.adobe.com/react-aria/getting-started.html)
- [React — `<input>`](https://react.dev/reference/react-dom/components/input)
- [React — `useReducer`](https://react.dev/reference/react/useReducer)
- [React — `useEffect`](https://react.dev/reference/react/useEffect)
- [MDN — Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)
- [MDN — File input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)
- [MDN — `capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)
- [MDN — XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest)
- [HTML Standard — input pickers and transient activation](https://html.spec.whatwg.org/multipage/input.html)
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C — ARIA upload-progress status technique](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA25)
- [WebKit — Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [WebKit — Background Sync issue](https://bugs.webkit.org/show_bug.cgi?id=182565)
- [WebKit — iOS file-type conversion issue](https://bugs.webkit.org/show_bug.cgi?id=239001)
- [WebKit — HEIC accept-order issue](https://bugs.webkit.org/show_bug.cgi?id=303803)
- [WebKit — Photos-picker storage issue](https://bugs.webkit.org/show_bug.cgi?id=318572)
- [WebKit — Home Screen camera issue](https://bugs.webkit.org/show_bug.cgi?id=202884)
- [WebKit — installed-PWA viewport issue](https://bugs.webkit.org/show_bug.cgi?id=254868)
- [WebKit — keyboard bottom-offset issue](https://bugs.webkit.org/show_bug.cgi?id=292603)
- [Apple — Manage location metadata in Photos](https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web)
- [OWASP — File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [Tailscale — Serve and identity headers](https://tailscale.com/docs/features/tailscale-serve)
- [Tailwind CSS — Theme variables](https://tailwindcss.com/docs/theme)
- [Tailwind CSS — Dark mode](https://tailwindcss.com/docs/dark-mode)
- [sharp — Constructor and decoder limits](https://sharp.pixelplumbing.com/api-constructor/)
- [Pi — Coding-agent README and image support](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)
- [Pi — RPC image protocol](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)
- [Pi — Model input declarations](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/custom-provider.md)
- [pi-image-tools](https://github.com/MasuRii/pi-image-tools)
- [Open WebUI — MessageInput attachment implementation](https://github.com/open-webui/open-webui/blob/main/src/lib/components/chat/MessageInput.svelte)
- [grok-remote](https://github.com/daniel-farina/grok-remote)
- [Public AI mobile Open WebUI client](https://github.com/forpublicai/mobile-app-2)
- [harness-remote mobile PWA](https://github.com/giuliastro/harness-remote)
- [Mobbin — public iOS app catalog](https://mobbin.com/browse/ios/apps)
- [Kimi — App Store listing](https://apps.apple.com/ca/app/kimi-%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8B-%E5%85%A8%E8%83%BDai%E8%81%8A%E5%A4%A9%E9%97%AE%E7%AD%94%E5%8A%A9%E6%89%8B/id6474233312)
