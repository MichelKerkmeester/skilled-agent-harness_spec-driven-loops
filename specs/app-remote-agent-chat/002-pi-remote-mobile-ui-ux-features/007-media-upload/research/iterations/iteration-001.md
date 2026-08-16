<!-- provenance: external-CLI orchestration pass; original file iter-01-sol.md -->
> **Source pass 1** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-1-sol.md`.

<!-- F5-media-upload | model=sol | lens=competitive-teardown | iter 1/15 | 2026-08-15T20:12:29.104Z -->

# 1. Findings for the competitive-teardown lens

Research snapshot: 15 August 2026. Mobile interfaces vary by version, account, locale, and staged rollout. Dimensions below are reconstruction targets measured from current 390–393 pt-class iPhone captures, with a practical tolerance of ±4 pt; vendors do not publish these UI measurements.

Mobbin’s public catalog confirms its role as a screen and flow reference library, but individual AI-app screen deep links are authentication-gated and the live Mobbin browser/MCP was unavailable in this pass. No Mobbin screen IDs are fabricated. Visual claims were therefore cross-checked against current screenshot libraries, official help pages, App Store listings, and first-party repositories. [Mobbin iOS catalog](https://mobbin.com/browse/ios/apps), [Mobbin MCP documentation](https://docs.mobbin.com/mcp/introduction).

## 1.1 Competitive teardown

| Product | Concrete iPhone attachment flow | Limits and processing | Transcript/host behavior |
|---|---|---|---|
| **Claude iOS** | The floating composer is approximately 346–352 pt wide on a 390 pt viewport and 88–96 pt high in its one-line state. A 44 pt `+` target sits at lower-left; the current **Add Context** modal exposes Camera, Photos, and Files. Selected context remains in the composer until the message is sent. The rightmost 40–44 pt action changes to a terracotta send circle when text is present. [Current Claude iOS screen set, including Add Context](https://techdevnotes.com/apps/ios/claude/6473753684/screenshots), [103-screen Claude flow capture](https://screensdesign.com/apps/claude-by-anthropic/), [Anthropic’s iOS launch description](https://www.anthropic.com/news/team-plan-and-ios). | Claude documents JPEG, PNG, GIF, and WebP; up to 20 files per chat, 500 MB per chat file, and 8000×8000 px images. These cloud limits are unsuitable as defaults for a self-hosted relay but establish that size rejection must happen before send, not after the turn begins. [Claude upload documentation](https://support.claude.com/en/articles/8241126-upload-files-to-claude). | Claude Code Remote Control is the closest architectural comparator: an attachment sent from mobile is downloaded to the host and passed to Claude as an `@` file reference, including captionless attachments. The remote UI is a window onto the local session. [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control), [current Remote Control documentation source](https://github.com/thevibeworks/claude-code-docs/blob/main/content/en/docs/claude-code/remote-control.md). |
| **Kimi mobile / Kimi Code** | Kimi mobile puts `+` in the bottom input and lists files, photos, local files, and WeChat files; voice remains a separate control. Kimi Code accepts paste, drag/drop, and picker input. [Kimi mobile guide](https://www.kimi.com/zh-cn/help/new-user-guide/overview), [Kimi Code input documentation](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html). | Picker limits are 10 MB/image, 20 MB/video, nine files/message, and 80 MB total. Pasted or dropped images over 5 MB are compressed to about 2 MB; current Kimi Code processing additionally caps the longest edge at 2000 px and uses a 256 KB model-read budget in image-heavy sessions. HEIC, JPEG, PNG, GIF, WebP, MP4, WebM, and MOV are named formats. [Kimi Code limits](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html), [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md). | Kimi now renders every sent file, image, and video as a chip in the user message; images can be enlarged. Unsupported inline files are staged server-side and exposed to the model as readable paths. Draft attachments are session-scoped so switching sessions does not leak them into another session. [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md). |
| **ChatGPT iOS** | Tapping the prompt-area `+` opens Photos, Camera, and Files. Current gallery flows expose recent-photo thumbnails and confirm multi-selection with an explicit **Add N Photos** action rather than sending immediately. [Official image-input instructions](https://help.openai.com/en/articles/8400551-image-inputs-for-chatgpt-faq), [visual upload-menu reference](https://zapier.com/blog/how-to-use-chatgpt/), [multi-photo picker capture](https://www.aranzulla.it/come-caricare-foto-su-chatgpt-1827602.html). | Static PNG, JPEG, and non-animated GIF are supported; video is not an image input. The limit is 20 MB/image. OpenAI states that images are resized for analysis and original filenames and metadata are not processed. [ChatGPT Image Inputs FAQ](https://help.openai.com/en/articles/8400551-image-inputs-for-chatgpt-faq), [File Uploads FAQ](https://help.openai.com/en/articles/8555545-file-uploads-faq). | The preview precedes send, can coexist with a text caption, and is then shown as message context. The important transferable pattern is the explicit review boundary: selecting media does not itself dispatch a turn. |
| **Perplexity** | Below the search bar, `+` leads directly to gallery selection or camera capture. A photographed Perplexity state shows an unusually explicit preflight panel warning that images containing people or personally identifiable information may not be processed, with separate **Photo Library** and **Take Photo** buttons. [Official mobile upload flow](https://www.perplexity.ai/help-center/en/articles/10354840-uploading-images-on-perplexity), [captured Perplexity upload panel](https://uibrary.design/apps/perplexity-ask-anything/). | JPEG, HEF/HEIF, PNG, and PDF are listed; images may be up to 40 MB and are reformatted. Perplexity says uploaded images are not stored on its servers. Enterprise sessions separately allow up to four images/query and delete session files after seven days. [Image-upload documentation](https://www.perplexity.ai/help-center/en/articles/10354840-uploading-images-on-perplexity), [enterprise limits](https://www.perplexity.ai/help-center/en/articles/12009761-enterprise-file-limits). | Perplexity’s differentiator is an explicit privacy/eligibility warning before the picker. Its weakness is that a categorical warning about people and PII is not a substitute for clear transport and retention disclosure. |
| **DeepSeek** | The original mobile upload menu separated **Photo OCR**, **Image OCR**, and **Document** rather than presenting all visual input as equivalent. This accurately communicated that the initial implementation extracted text rather than performing general vision. [Official DeepSeek app launch](https://api-docs.deepseek.com/news/news250115/), [captured upload interface](https://ai.tenorshare.com/deepseek-tips/how-to-upload-files-on-deepseek.html). | DeepSeek’s original official description promised file upload and text extraction but no public per-file limits. Its current App Store history records the addition of vision mode followed by improved photo/file uploads. Limits should not be inferred from those notes. [DeepSeek App Store listing](https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349). | DeepSeek demonstrates the value of capability-specific labeling. “Upload image” is misleading when the selected model only receives OCR; Pi Remote should name and gate the actual capability. |
| **Gemini iOS** | `Add files` in the bottom text box opens a horizontally browsable set of Files, Photos, Camera, Drive, and Notebooks; hidden choices move under **More Uploads**. Gemini’s home/lock-screen widgets can deep-link directly to camera, Files, or Photos. [Gemini iPhone upload guide](https://support.google.com/gemini/answer/14903178?co=GENIE.Platform%3DiOS&hl=en), [Gemini iOS widget guide](https://support.google.com/gemini/answer/16179553?co=GENIE.Platform%3DiOS&hl=en). | Up to ten files can be attached to one prompt. Non-video files may be 100 MB; video may be 2 GB. Base video duration is five minutes, increased to one hour on higher plans. [Gemini upload limits](https://support.google.com/gemini/answer/14903178?co=GENIE.Platform%3DiOS&hl=en). | Gemini provides the broadest source menu, but its need for horizontal scrolling and **More Uploads** shows the discoverability cost of mixing many providers into one attachment surface. |
| **Meta AI** | Meta uses a large, approximately 350 pt-wide rounded composer with `+` at lower-left and model/speed, microphone, and voice controls to the right. Tapping `+` selects from the device media library. The chosen photo becomes the subject of a conversational edit; later turns modify the same image. [Meta photo-editing walkthrough with UI captures](https://ai.meta.com/learn/ai-creativity/how-to-edit-photos-with-ai/), [Meta AI usage guide](https://ai.meta.com/learn/ai-basics/how-to-use-meta-ai). | Meta documents direct image and digital-file uploads but says supported types vary by channel; no dependable public iOS size limit is published. [Meta AI usage guide](https://ai.meta.com/learn/ai-basics/how-to-use-meta-ai). | Meta treats the image as the central conversational artifact rather than a subordinate file. That supports a larger thumbnail and tap-to-preview behavior, but not persistent raw-media retention in Pi Remote. |

## 1.2 Category-level findings

1. **The category-standard sequence is `attach → inspect/remove → add caption → send`.** Claude, ChatGPT, Gemini, Kimi, and Perplexity all preserve a review boundary between the system picker and dispatch. Pi Remote should never send immediately after camera capture.

2. **Camera and gallery are separate user intents.** Claude, ChatGPT, Gemini, and Perplexity label them separately. A generic browser chooser is a fallback, not the primary design.

3. **The `+` control has become overloaded.** Claude mixes context and tools; Gemini mixes five file sources; Pi Remote already stores Mode and Commands behind the same control in [SessionComposer.tsx](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/SessionComposer.tsx:115>). Media must therefore occupy the first two menu rows, followed by a divider and the existing controls.

4. **Kimi provides the strongest delivery precedent.** Its exact limits, 2000 px normalization, attachment chips, session-scoped drafts, and provider-capability filtering solve the operational problems Pi Remote will encounter. [Kimi Code core operations](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html), [Kimi Code changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md).

5. **Claude provides the strongest remote-agent precedent.** Mobile bytes reach the machine running the coding agent, then become local context. Pi Remote should improve on this by avoiding a workspace file altogether for images and using Pi’s existing inline `images` RPC field. That field already exists in [the current protocol](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts:10>).

6. **Remote-agent prior art exposes four transport choices:**

   - Claude Remote Control: host download plus `@` reference.
   - Kimi Code: server path for content not consumable inline.
   - MulmoClaude: temporary Firebase staging, host download into `data/attachments/`, then deletion of the cloud copy. [MulmoClaude attachment architecture](https://github.com/receptron/mulmoclaude#chat-attachments).
   - Remote Pi: one camera/gallery image, compressed on-device, base64 inline in `user_message`, then converted to Pi multimodal content. Its relay can read that payload. [Remote Pi image protocol](https://pi.dev/packages/remote-pi), [Remote Pi repository](https://github.com/jacobaraujo7/remote_pi).

   Pi Remote’s private Tailscale topology does not need third-party object storage. A same-origin, ticketed, streaming upload followed by inline delivery to Pi has the smallest trust and persistence surface.

7. **Cloud-product limits are too permissive for this relay.** Claude’s 500 MB, Gemini’s 100 MB/2 GB, and Perplexity’s 40 MB targets assume cloud-scale storage and parsing. Kimi’s 10 MB/image and aggressive normalization are the relevant baseline.

8. **No reviewed competitor provides the complete privacy contract Pi Remote needs.** Perplexity states non-retention; ChatGPT states that metadata is not processed; Kimi compresses; Claude Remote Control states where execution occurs. Pi Remote must combine all four disclosures: selection, normalization, delivery destination, and deletion.

---

# 2. Concrete spec contribution for a build phase

## 2.1 Launch scope

Launch **still-image attachment**, not generic file/video upload:

- Accepted: JPEG, PNG, WebP, HEIC, HEIF.
- Rejected: GIF/animated media, SVG, TIFF, RAW/DNG, PDF, audio, and video.
- Maximum: four images/message, 15 MB/source image, 30 MB/source batch.
- Pixel ceiling: 60 megapixels and 12,000 px on either axis.
- Normalized model input: auto-oriented, 8-bit sRGB, longest edge ≤2000 px, metadata removed, ≤2 MB/image.
- Captionless image turns are valid.
- Do not display a video option. Pi’s current RPC defines `ImageContent`, not `VideoContent`; silent frame extraction would misrepresent what Pi received.

This sits between Kimi’s 10 MB and ChatGPT’s 20 MB image limits while preventing Claude/Gemini-scale bodies from reaching the loopback relay.

## 2.2 Composer layout and interaction

### Closed composer

- Preserve the existing rounded composer island.
- Change the `+` accessible name from “Mode and commands” to **“Add photo, mode, or command.”**
- Keep a 44×44 pt hit region, matching Apple’s minimum recommendation. [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons).
- Do not add a second paperclip button.

### `+` popover order

1. **Add Photos** — photo-library icon and label.
2. **Take Photo** — camera icon and label.
3. Hairline divider.
4. Existing Mode group.
5. Existing Commands group.
6. Muted footer: **“Photos are stripped of metadata and deleted after Pi receives them.”**

Use `react-aria-components` `FileTrigger`:

- Gallery: `allowsMultiple`, accepted still-image types, no camera hint.
- Camera: one file, `defaultCamera="environment"`.
- Preserve the real file input rather than simulating a Photos grid. `FileTrigger` supports accepted types, multiple selection, and camera preference. [React Aria FileTrigger](https://react-aria.adobe.com/FileTrigger).
- Browser `accept` is only a picker hint; server validation remains mandatory. [MDN accept attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept), [MDN file input/capture](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file).

### Attachment rail

Insert a 72 pt-high row inside the composer, above the textarea:

- 64×64 pt thumbnail.
- 12 pt corner radius.
- 8 pt gap between items.
- Selection order is message order.
- Horizontal scrolling when necessary; no drag-only reorder.
- Remove control: 22 pt visible circle but a 44×44 pt hit region overlapping the top-right corner.
- Tap thumbnail: open a full-screen preview dialog with **Close** and **Remove**. Do not offer download/share.
- `object-fit: cover` in the rail; `object-fit: contain` in preview.
- The textarea’s current 140 px growth cap remains independent of the rail.

### State machine

| State | Visual state | Allowed actions | Send behavior |
|---|---|---|---|
| `local-validating` | Thumbnail plus neutral spinner | Remove | Disabled |
| `staging` | Thumbnail, thin determinate progress line, `Uploading` | Remove/cancel | Disabled until every item settles |
| `ready` | Thumbnail with clay check marker | Preview, remove, add caption | Enabled |
| `rejected` | Generic photo tile, error icon, concise reason | Remove; Retry only when retryable | Disabled while any rejected item remains |
| `removing` | Reduced opacity and spinner | None | Disabled |
| `sending` | Composer locked; thumbnails remain visible | Stop only if the prompt lane supports it | Existing send semantics |
| `delivery-unknown` | Warning tile: `Delivery could not be confirmed` | Remove; explicit **Send again** | Never retry automatically |
| `delivered` | User-turn attachment tile | Preview only while a local object URL remains | Not applicable |
| `expired` | `Photo expired before sending` | Remove, choose again | Disabled |

Upload starts after explicit picker confirmation so it can overlap caption entry. Selection does not send a prompt.

If a turn is already running, preserve the existing **Steer** and **Later** choices. Both may carry ready images; **Later** queues them with that exact draft. Attachments must remain scoped to `(deviceId, sessionId, epoch)`, following Kimi’s session-isolation precedent.

## 2.3 Upload protocol

The current generic HTTP body ceiling remains 16 KiB; binary upload gets an independent streaming lane rather than weakening that protection in [server.ts](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/http/server.ts:39>).

### Step A — hash locally

For each selected file, calculate SHA-256 with Web Crypto and construct:

```ts
interface AttachmentManifestItem {
  clientId: string;
  declaredType: string;
  byteLength: number;
  sha256: string;
}
```

Do not place bytes or base64 in React state, Redux-like stores, URLs, IndexedDB, logs, or service-worker messages. Keep each `File` and `blob:` preview URL in an in-memory draft object.

### Step B — obtain an exact upload ticket

`POST /api/attachments/ticket`

```json
{
  "type": "attachment.ticket",
  "ticket": "ticket_…",
  "sessionId": "session_…",
  "epoch": "epoch_…",
  "expectedDraftRevision": 3,
  "items": [
    {
      "clientId": "local_…",
      "declaredType": "image/heic",
      "byteLength": 4839211,
      "sha256": "base64url…"
    }
  ]
}
```

Requirements:

- Consume a normal 20-second application ticket using a new `attachment:ticket` action.
- Require the device’s authenticated sync socket to be foreground.
- Bind the returned upload ticket to the exact device, principal, origin, session, epoch, draft revision, part count, sizes, types, and hashes.
- Upload-ticket TTL: 60 seconds.
- Reject a stale draft revision with `409`.
- Reject unsupported capability or plan state with `422`.
- Do not read an upload body at this endpoint.

The current one-use ticket behavior—origin/principal binding, expiry, deletion after consumption—should be extended rather than replaced. [Current ticket implementation](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/auth/auth-service.ts:205>).

### Step C — stream the batch

`POST /api/attachments/upload`

- `multipart/form-data`.
- Upload ticket in `X-Pi-Remote-Upload-Ticket`, never in a multipart field or query string.
- Authenticate and consume the upload ticket before reading parts.
- Reject a declared body over 30 MB with `413`.
- Count streamed bytes and terminate immediately above 30 MB even when `Content-Length` is absent or false.
- Permit exactly the manifest’s part count and order.
- Compute SHA-256 while streaming and require equality with the ticket manifest.
- Ignore original filenames except for transient client-side display; never persist or log them.
- MIME-sniff and decode the content; do not trust `Content-Type` or extension.
- Return `409` and delete the entire batch if the draft revision changed while bytes were arriving.

OWASP requires allowlisted formats, signature verification, generated filenames, size limits, authenticated upload, and storage outside the webroot. [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

Successful response:

```json
{
  "draftRevision": 4,
  "attachments": [
    {
      "attachmentId": "attachment_…",
      "mediaType": "image/jpeg",
      "width": 2000,
      "height": 1500,
      "normalizedBytes": 614002,
      "expiresAt": "…"
    }
  ]
}
```

### Step D — normalize in quarantine

- Create one boot-scoped directory with `mkdtemp(join(tmpdir(), "pi-remote-upload-"))`.
- Directory mode `0700`; files `0600`.
- Never write under the workspace, PWA public directory, SQLite directory, or user-selected path.
- Use application-generated opaque filenames without the client extension.
- Decode in a bounded worker/process:
  - Five-second timeout/image.
  - Fifteen-second timeout/batch.
  - 60 MP and five-channel ceilings.
  - One page/frame only.
  - No SVG/PDF external renderer.
- Apply EXIF orientation before stripping metadata.
- Output PNG only when the source is PNG/WebP with transparency or the normalized PNG is ≤2 MB; otherwise output JPEG at quality 88 and reduce quality/dimensions until ≤2 MB.
- Do not call `keepMetadata`, `withMetadata`, `keepExif`, or equivalent. Sharp strips metadata by default; its auto-orient operation removes the orientation tag, and its constructor exposes pixel/channel safety limits. [Sharp output metadata behavior](https://sharp.pixelplumbing.com/api-output/), [Sharp auto-orient](https://sharp.pixelplumbing.com/api-operation/), [Sharp input limits](https://sharp.pixelplumbing.com/api-constructor/).

Re-encoding is the content-disarm boundary. Original bytes are deleted immediately after a normalized derivative is committed.

### Step E — remove or expire

`POST /api/attachments/remove`

```json
{
  "ticket": "ticket_…",
  "sessionId": "session_…",
  "epoch": "epoch_…",
  "expectedDraftRevision": 4,
  "attachmentId": "attachment_…"
}
```

- Fresh one-use ticket.
- Foreground device required.
- Compare-and-swap draft revision.
- Delete derivative before acknowledging success.
- Return the new revision.

Automatic cleanup:

- Unsent derivative TTL: ten minutes from the latest verified draft operation.
- Delete on send acknowledgement, logout, device revocation, epoch change, relay shutdown, and session deletion.
- On startup, sweep abandoned boot directories older than ten minutes.
- Metrics may record counts, byte buckets, latency, and rejection reason; never filename, hash, path, thumbnail, EXIF, or content.

### Step F — submit to Pi

Extend `PromptSubmitCommand` with:

```ts
expectedDraftRevision: number;
attachments?: readonly {
  attachmentId: string;
}[];
```

Rules:

- Valid when trimmed text is non-empty **or** at least one attachment exists.
- Consume a fresh `prompt:submit` ticket.
- Atomically confirm the draft revision and mark all referenced attachments `consuming`.
- Load normalized derivatives as buffers and populate the existing Pi RPC `images` array as `{type: "image", data: base64, mimeType}`.
- Do not write an attachment into the repository or expose a host path to Pi.
- Send image content in selection order, followed by caption text when present.
- If the selected Pi model lacks image input, fail before consuming the draft with `422 model_cannot_view_images`. Kimi similarly filters non-multimodal models when media is attached. [Kimi capability behavior](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html).
- On confirmed Pi acknowledgement: delete derivatives, commit the redacted transcript turn, and increment the draft revision.
- On confirmed Pi rejection: return attachments to `ready` until TTL.
- On uncertain delivery: mark the batch `delivery-unknown`, delete derivatives, publish a generic delivery-warning event, and prohibit automatic replay.

## 2.4 Transcript and redaction contract

Raw media, thumbnail bytes, filenames, host paths, attachment IDs, and hashes must never enter the durable ledger or WebSocket replay stream.

Add an allowlisted transcript block:

```ts
interface AttachmentTranscriptBlock {
  kind: "attachment";
  role: "user";
  mediaKind: "image";
  ordinal: number;
  mediaType: "image/jpeg" | "image/png";
  width: number;
  height: number;
  sizeBucket: "<512 KB" | "512 KB–2 MB";
  state: "delivered" | "delivery-unknown";
  previewRetained: false;
  revision: number;
}
```

Display:

- During the current device’s live session: 56×56 pt local thumbnail plus `Photo 1`.
- After reload or on another device: generic image tile, `Photo 1 · Delivered to Pi`, secondary text `Preview not retained`.
- Caption follows attachment tiles inside the user turn.
- Image-only turns contain attachment blocks without an empty text bubble.
- Full-screen preview is available only while the originating browser retains its in-memory object URL.
- The durable projector accepts only the fields above. It must not run arbitrary uploaded metadata through pattern-based redaction.

This preserves the Kimi/Claude “attachment visible in the transcript” affordance without violating Pi Remote’s canonical redaction boundary in [redaction.ts](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/store/redaction.ts:1>).

## 2.5 Cache and browser controls

- All attachment endpoints: `Cache-Control: no-store, private`, `Pragma: no-cache`.
- Service worker: bypass every `/api/attachments/` request and response; never place it in Cache Storage.
- Preview URLs: `URL.createObjectURL(file)` and revoke on removal, acknowledgement, session switch, logout, or unmount.
- CSP: add `blob:` only to `img-src`; do not add it to `script-src`, `frame-src`, or `object-src`.
- Never serve uploaded bytes from a public URL.
- Add `X-Content-Type-Options: nosniff`.
- If any diagnostic download is later introduced, strip path components and never use the original filename directly; user-supplied multipart filenames are advisory and unsafe for storage. [MDN Content-Disposition security guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Disposition).

## 2.6 Accessibility

- Every actionable target is at least 44×44 CSS px/pt, exceeding WCAG 2.2 AA’s 24×24 minimum and matching Apple’s touch recommendation. [WCAG 2.2 target size](https://www.w3.org/TR/WCAG22/#target-size-minimum), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/buttons).
- File triggers use semantic buttons and retain browser-native picker behavior.
- Attachment button label: `Preview photo 2 of 3, ready, 1.4 megabytes`.
- Remove label: `Remove photo 2`.
- Decorative `<img>` uses `alt=""`; the enclosing button supplies the name.
- Progress is announced through one `role="status" aria-live="polite"` region. Announce selection, 25/50/75/100%, ready, and failure—not every byte.
- Validation failure uses `role="alert"` but does not move focus away from the failed tile.
- When a popover or preview closes, restore focus to the control that opened it.
- No state relies on color alone: spinner/check/error icon and text accompany color.
- Horizontal scrolling has visible partial-next-item affordance; all items remain reachable by Tab/VoiceOver swipe.
- Removal and re-selection require taps; no drag gesture is essential. WCAG requires a non-drag alternative for drag-driven functionality. [WCAG 2.2 dragging movements](https://www.w3.org/TR/WCAG22/#dragging-movements).
- Status changes remain programmatically determinable without stealing focus. [WCAG 2.2 status messages](https://www.w3.org/TR/WCAG22/#status-messages).

## 2.7 Visual and motion specification

- Composer and preview surfaces use existing bone/carbon tokens; no new brand color.
- Ready check and active send use clay `#d97757`.
- Upload progress uses carbon at reduced opacity, not clay, so clay continues to mean “ready/actionable.”
- Error uses an AA-compliant semantic red plus icon and text in both themes.
- Thumbnail insertion/removal: 160 ms opacity plus `scale(.96 → 1)`.
- Popover/preview: existing React Aria transitions, maximum 200 ms.
- Progress width animates linearly for 120 ms.
- Under `prefers-reduced-motion: reduce`, use opacity-only transitions and instantaneous progress changes.
- Do not use indefinite pulsing; it obscures whether the upload is still advancing.
- Do not promise haptic feedback from a PWA.

## 2.8 Objective build checks

| Check | Pass condition |
|---|---|
| Picker | Installed PWA on supported iOS releases opens Photos from **Add Photos** and the rear camera from **Take Photo**. |
| Same-file reselection | Remove an image, choose the same file again, and receive a new `local-validating` state. |
| Limits | Fifth file, >15 MB file, >30 MB batch, >60 MP image, animated GIF, SVG, PDF, video, and malformed image are rejected before Pi invocation. |
| MIME spoof | `.jpg` containing non-image bytes and PNG bytes declared as JPEG are rejected or normalized according to decoded type—not header or extension. |
| Ticket replay | Reusing either the upload ticket or removal/send ticket returns `401/409`; no second filesystem write or Pi command occurs. |
| Revision race | Two devices act on the same draft revision; exactly one mutation commits and the other returns `409`. |
| Digest tamper | One altered upload byte causes batch rejection and deletion of every batch part. |
| Isolation | Snapshot the workspace before and after send; no uploaded or normalized media appears in it and no Git-visible file changes. |
| Plan mode | Upload and image analysis work without enabling filesystem/process/network mutation families; Pi’s protected tools remain denied by the plan extension. |
| Redaction | Seed filename, GPS EXIF, device model, path text, and a unique byte marker; none appears in SQLite, sync messages, logs, crash output, or Cache Storage. |
| Cleanup | Ready drafts disappear after ten minutes; logout, revocation, epoch change, and restart sweep leave no derivative files. |
| Delivery uncertainty | Drop the Pi RPC connection after dispatch but before acknowledgement; UI reports `delivery-unknown` and performs no automatic retry. |
| Session isolation | Select an image, switch sessions, and confirm neither the thumbnail nor attachment ID is available in the other composer. |
| Accessibility | VoiceOver announces source actions, attachment order/state, progress milestones, removal, errors, and final delivery; focus returns predictably after picker/dialog closure. |
| Appearance | Light/dark screenshots pass WCAG AA contrast; 320 CSS px reflow retains picker, rail, textarea, and send/remove controls without page-level horizontal scrolling. |

---

# 3. Divergent / minority ideas worth considering

## 3.1 Strip metadata before any network transfer

For JPEG/PNG/WebP that Safari can decode reliably, use an off-main-thread canvas or WebCodecs worker to auto-orient, resize, and re-encode before upload; the relay still validates and re-encodes again. This means GPS/device metadata never crosses even the tailnet. Remote Pi already demonstrates on-device compression before inline delivery. [Remote Pi image protocol](https://pi.dev/packages/remote-pi).

Do not make this mandatory for HEIC until device coverage proves reliable; a failed client decoder must not convert a valid iPhone photo into an unexplained rejection.

## 3.2 “Local preview only” as an explicit product virtue

Most competitors persist thumbnails. Pi Remote can visibly label its stricter behavior:

> Local preview · removed after delivery

After reload, use a generic delivered tile. This deliberately trades transcript fidelity for a verifiable non-retention promise and aligns with Perplexity’s non-storage claim while being more visibly honest.

## 3.3 Long-press `+` for camera

A long-press could open **Take Photo** directly for screenshot-debugging workflows. Keep normal tap and keyboard activation opening the complete menu; long-press must remain an optional accelerator, never the only route.

## 3.4 Optional pre-send privacy inspection

Offer a non-default **Inspect metadata** action showing only categories found—Location, Date, Device, Description—not raw values. Confirm that all listed categories will be removed. This turns redaction into a visible property without teaching the transcript or logs the private metadata.

## 3.5 Screenshot-optimized normalization

A “Screenshot” detector could retain PNG when edge density/text content is high and use JPEG for camera photos. Kimi’s universal compression is simpler, but a two-profile output avoids making terminal text unreadable. The detector must affect encoding only; it must not OCR, classify, or log the content.

## 3.6 Future encrypted relay lane

If Pi Remote ever moves outside direct Tailscale Serve, encrypt attachment bytes in the browser to a boot-scoped host key and make the host pull ciphertext from object storage. This avoids the trust weakness in Remote Pi’s relay-visible inline base64 and MulmoClaude’s third-party staging. It is unnecessary complexity for the present same-origin tailnet architecture.

---

# 4. Open questions and risks

1. **Model capability discovery:** Does the Pi runtime expose a trustworthy `image_in` capability for the active provider/model? Without it, the relay needs an allowlisted capability map. Never silently switch models; show **“This model can’t view photos”** and link to the existing model picker.

2. **Video scope:** The requested phrase “photos/media” may imply video. Pi’s current RPC has image content but no defined video transport. Video requires a separate protocol, provider-capability contract, duration/codec limits, preview controls, and decision on whether Pi receives native video or extracted frames. Do not smuggle video in as a path or silent contact sheet.

3. **HEIC deployment:** Sharp/libvips HEIC decoding depends on the deployed binary build. Release verification must include an actual iPhone HEIC and a 48 MP source; UI support cannot be claimed from TypeScript alone.

4. **Captionless turns:** Current `PromptSubmitCommand` rejects blank messages. The protocol, projector, replay reducer, and Pi invocation must all support an attachment-only user turn. Claude Remote Control previously had a real defect where captionless attachments were dropped, demonstrating why this needs a regression test. [Claude Remote Control source documentation](https://github.com/thevibeworks/claude-code-docs/blob/main/content/en/docs/claude-code/remote-control.md).

5. **RPC size:** Four 2 MB derivatives become roughly 10.7 MB after base64 plus JSON overhead. The Pi supervisor needs an explicit frame limit and backpressure behavior; otherwise normalization must target a smaller per-image budget such as Kimi’s 256 KB model-read budget.

6. **Parser attack surface:** Re-encoding removes metadata and active payloads from successful outputs, but the decoder still touches untrusted input. Timeout, pixel/channel ceilings, current Sharp/libvips patching, and rejection of SVG/PDF/multi-frame content are release blockers.

7. **iOS suspension:** Standalone PWAs may be backgrounded while Photos or Camera is open or while a large upload is running. An interrupted ticket must resolve to a definite deleted partial or `delivery-unknown`; never infer success from local progress.

8. **Draft revision ownership:** Decide whether drafts are per device or shared across devices. Per-device is safer and avoids remote draft leakage; shared drafts would require replaying private attachment metadata and conflict resolution.

9. **Retention wording:** “Deleted after Pi receives them” must mean after confirmed Pi acknowledgement, not merely after HTTP upload. Delivery-unknown requires deletion plus honest uncertainty.

10. **Provider retention:** Deleting relay derivatives does not mean the selected model provider forgets the image. The first-use disclosure should state: **“Pi and its active model provider receive the normalized image.”**

11. **Plan-mode semantics:** The relay performs a transient disk write even though the workspace remains read-only. Security documentation should classify this as a narrowly scoped input-staging mutation, guarded by tickets and revisions, rather than claiming the whole process is physically write-free.

12. **Service-worker regression:** A broad API cache rule could silently retain images. The no-cache route needs a test that inspects Cache Storage after successful, failed, and interrupted uploads.

13. **Local preview leakage:** Screenshots of the app switcher can expose composer thumbnails. Consider obscuring previews on `visibilitychange` only if testing shows it does not create a confusing flash when returning from Photos.

14. **Faces and PII:** Perplexity blocks or warns about identifiable individuals. A private coding-agent remote should not inspect or classify uploads merely to enforce such a policy. Clear retention/provider disclosure is less invasive than face detection.

15. **Original filenames:** Filenames often contain person, client, ticket, or project names. The UI can show `Photo 1` instead; keeping original names offers little value for image-only Pi context.

---

# 5. Sources

## Mobbin and visual-flow references

- [Mobbin iOS app catalog](https://mobbin.com/browse/ios/apps)
- [Mobbin MCP introduction](https://docs.mobbin.com/mcp/introduction)
- [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)
- [Claude current iOS screenshot library](https://techdevnotes.com/apps/ios/claude/6473753684/screenshots)
- [Claude 103-screen captured flow](https://screensdesign.com/apps/claude-by-anthropic/)
- [ChatGPT visual upload-menu reference](https://zapier.com/blog/how-to-use-chatgpt/)
- [ChatGPT multi-photo picker capture](https://www.aranzulla.it/come-caricare-foto-su-chatgpt-1827602.html)
- [Perplexity captured upload panel](https://uibrary.design/apps/perplexity-ask-anything/)
- [DeepSeek captured upload interface](https://ai.tenorshare.com/deepseek-tips/how-to-upload-files-on-deepseek.html)

## Official product documentation

- [Anthropic: Claude iOS launch](https://www.anthropic.com/news/team-plan-and-ios)
- [Claude file uploads](https://support.claude.com/en/articles/8241126-upload-files-to-claude)
- [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control)
- [Kimi mobile guide](https://www.kimi.com/zh-cn/help/new-user-guide/overview)
- [Kimi Code core operations](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html)
- [ChatGPT Image Inputs FAQ](https://help.openai.com/en/articles/8400551-image-inputs-for-chatgpt-faq)
- [ChatGPT File Uploads FAQ](https://help.openai.com/en/articles/8555545-file-uploads-faq)
- [Perplexity image uploads](https://www.perplexity.ai/help-center/en/articles/10354840-uploading-images-on-perplexity)
- [Perplexity enterprise file limits](https://www.perplexity.ai/help-center/en/articles/12009761-enterprise-file-limits)
- [DeepSeek app launch](https://api-docs.deepseek.com/news/news250115/)
- [DeepSeek App Store listing](https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349)
- [Gemini iPhone/iPad file uploads](https://support.google.com/gemini/answer/14903178?co=GENIE.Platform%3DiOS&hl=en)
- [Gemini iOS widgets and media shortcuts](https://support.google.com/gemini/answer/16179553?co=GENIE.Platform%3DiOS&hl=en)
- [Meta AI usage guide](https://ai.meta.com/learn/ai-basics/how-to-use-meta-ai)
- [Meta AI photo-editing flow](https://ai.meta.com/learn/ai-creativity/how-to-edit-photos-with-ai/)

## Remote-agent and coding-client prior art

- [Kimi Code repository/changelog](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)
- [Claude Remote Control documentation source](https://github.com/thevibeworks/claude-code-docs/blob/main/content/en/docs/claude-code/remote-control.md)
- [MulmoClaude](https://github.com/receptron/mulmoclaude)
- [Remote Pi](https://github.com/jacobaraujo7/remote_pi)
- [Remote Pi package documentation](https://pi.dev/packages/remote-pi)
- [Pi usage and image-file arguments](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/usage.md)
- [pi-web](https://github.com/agegr/pi-web)
- [Yep Anywhere](https://github.com/kzahel/yepanywhere)
- [OpenCode iOS client](https://github.com/grapeot/opencode_ios_client)

## Platform, accessibility, and security

- [Apple HIG: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple PhotosPicker privacy behavior](https://developer.apple.com/documentation/swiftui/view/photospicker%28ispresented%3Aselection%3Amatching%3Apreferreditemencoding%3Aphotolibrary%3A%29)
- [MDN file input and camera capture](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)
- [MDN accept attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept)
- [React Aria FileTrigger](https://react-aria.adobe.com/FileTrigger)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [Sharp constructor and input limits](https://sharp.pixelplumbing.com/api-constructor/)
- [Sharp auto-orientation](https://sharp.pixelplumbing.com/api-operation/)
- [Sharp metadata stripping](https://sharp.pixelplumbing.com/api-output/)
- [MDN Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Disposition)
