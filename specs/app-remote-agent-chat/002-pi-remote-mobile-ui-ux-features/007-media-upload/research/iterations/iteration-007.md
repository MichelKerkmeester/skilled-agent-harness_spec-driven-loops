<!-- provenance: external-CLI orchestration pass; original file iter-07-grok.md -->
> **Source pass 7** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-7-grok.md`.

<!-- F5-media-upload | model=grok | lens=security-redaction | iter 7/15 | 2026-08-15T20:35:41.367Z -->

# Iteration 7 — Security-redaction lens: iOS gallery → Pi

**Scope:** How gallery/camera bytes enter an installable iPhone PWA, cross a read-only / redaction-default relay, and reach `pi --mode rpc` without weakening ticketed fail-closed mutations or the redacted ledger.  
**Non-goals:** Visual taste, voice, video, PDF/docs, native App Store wrapping.

---

## 1. Findings

### 1.1 The current stack cannot carry a photo on any existing lane

Three independent hard caps make “put the JPEG on `/api/prompt/submit`” impossible:

| Cap | Value | Where |
| --- | --- | --- |
| HTTP body | **16 384 bytes** | `MAX_HTTP_BODY_BYTES` in `apps/pi-remote-relay/src/http/server.ts`; documented in `docs/security.md` |
| WebSocket message | **65 536 bytes** | `MAX_WS_MESSAGE_BYTES` / `maxPayload` |
| RPC **stdout** JSONL record | **1 048 576 bytes** | `DEFAULT_MAX_RECORD_BYTES` in `apps/pi-remote-relay/src/rpc/framing.ts` |

A single iPhone still is typically 1–8 MiB. Base64 inflates ~33%. The prompt JSON guard is an **exact key allowlist** (`type`, `submissionId`, `sessionId`, `message`, `ticket`, `streamingBehavior`) and requires `message.trim().length > 0` (`isPromptSubmitCommand` in `packages/pi-rpc-protocol/src/guards.ts`). Extra keys fail closed. There is no `images` field on the phone→relay command even though the **Pi child** already accepts one.

Tickets are one-use and live **20 seconds** (`DEFAULT_TICKET_TTL_MS` in `apps/pi-remote-relay/src/auth/auth-service.ts`). A cellular PUT of a multi-megabyte still will miss that window if the ticket is consumed at PUT start. Action policy has no `media:*` verb (`apps/pi-remote-relay/src/auth/policy.ts`). Unknown actions stay denied.

`PromptService.submit` forwards only `message` (plus optional `streamingBehavior`) to the child (`apps/pi-remote-relay/src/prompt/prompt-service.ts`). The protocol type `PromptCommand.images` exists in `packages/pi-rpc-protocol/src/types.ts` and matches upstream Pi RPC (`{"type":"image","data":"<base64>","mimeType":"image/png"}`) ([pi-mono `rpc.md`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md); typed client in [`rpc-client.ts`](https://github.com/badlogic/pi-mono/blob/773f91f4/packages/coding-agent/src/modes/rpc/rpc-client.ts)). **The wire to Pi is already multimodal. The relay and PWA are not.**

The only file input in the PWA is enrollment QR (`App.tsx`: `<input type="file" accept="image/*">` → `createImageBitmap` + `BarcodeDetector` in `auth.ts`). Bytes never leave the device. Reusing that control for chat would silently change a local-only decoder into an exfiltration path.

### 1.2 Text redaction is the wrong tool for pixels — and is actively hostile to base64

Policy v1 (`apps/pi-remote-relay/src/store/redaction.ts`) is a JSON walk plus regex on **strings**:

- key allowlists → `[REDACTED_PATH]`, `[REDACTED_SECRET]`, `[REDACTED_PRIVATE_TEXT]`
- `SECRET_ASSIGNMENT_PATTERN`, `BEARER_PATTERN`, `TOKEN_PATTERN` (`sk-`, `ghp_`, `xox…`)
- `POSIX_PATH_PATTERN` (`/Users/`, `/tmp/`, `/usr/`, …) and Windows paths

`docs/security.md` already states: *“Redaction is pattern-based, not a proof that arbitrary free-form text is harmless.”* Images add a stronger claim: **pixels are not strings**. GPS, faces, lock-screen OTPs, and enrollment QR payloads will not match those patterns.

Worse: if `ImageContent.data` (standard base64, alphabet `A–Za–z0–9+/`) is ever run through `redactString`, `/` is a valid base64 character, so substrings such as `/tmp/` or `/usr/` **will occur in random photo payloads**. `TOKEN_PATTERN` can also hit `sk-` inside base64. The pass would **corrupt the image, inflate `fieldsRedacted`, and persist a mutilated blob** in SQLite. Image bytes must never enter `redactEnvelope`.

Open WebUI already demonstrated the sibling failure mode: embedding base64 in session JSON makes reopen payload-bound and uncacheable ([open-webui#13103](https://github.com/open-webui/open-webui/issues/13103)). This repo’s read-only cache writes the last 500 blocks × 8 sessions into `localStorage` for 7 days (`apps/pi-remote-web/src/cache.ts`). One data-URL photo would blow quota and survive logout.

The PWA already fail-closes unknown block kinds: `parseDisplayBlock` maps non-allowlisted `kind` to `{ kind: 'unknown', originalKind }` and the UI says *“A redacted ‘…’ block cannot be displayed by this client”* (`App.tsx`). That is the correct default for a new attachment kind on old clients — **as long as the envelope payload contains no pixels**.

### 1.3 What “bytes reach pi” actually means (and what it must not mean)

Upstream Pi RPC:

- `prompt` / `steer` / `follow_up` take optional `images: ImageContent[]` ([rpc.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)).
- Session `UserMessage` includes `attachments: []`; the Attachment example carries `content` as base64 plus `fileName`, `size`, `preview` ([rpc.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)).
- `get_messages` returns `AgentMessage` objects that can include those attachments.
- Model objects expose `input: ["text","image"]` — vision is a **host-confirmed model capability**, not a phone flag.

Relay stdin write is unbounded `JSON.stringify(command)+"\n"` (`supervisor.ts`, 15 s request timeout). Stdout is capped at **1 MiB per LF record**. If Pi echoes user attachments on `message_*` events or `get_messages`, a single photo **kills the JSONL decoder and the child framing**. The projector currently ignores non-`text`/`thinking`/`toolCall` content items (images would be dropped *after* parse). The bomb is the parse, not the projector.

Writing the file into the workspace and letting Pi `read` it is a **filesystem mutation** (`edit`/`write` are the `filesystem` family in `docs/security.md`). That path requires `PI_REMOTE_MUTATION_ENABLED=1`, exact-action leases, and would be blocked in Plan mode. It also puts a POSIX path into tool I/O that policy v1 will replace with `[REDACTED_PATH]` — the phone would never see a useful filename. **Do not use the workspace as a dump tray.**

The safe path is therefore: **inert blob on the relay → RPC `images` at prompt time only → shred relay blob → project a pixel-free chip into the ledger.** Plan mode stays a host/extension concern; attaching a photo is prompt content, not a protected tool.

`/api/prompt/submit` today does **not** require a live sync socket. `/api/prompt/abort` and `/api/runtime/control` do (`foreground_required`). Uploads must follow abort/control, not submit: a backgrounded or cached PWA must not be able to push gallery bytes.

### 1.4 iPhone PWA capture is already the privacy-preserving picker — if we stay on `<input type=file>`

Native apps: **PHPicker** is out-of-process, needs no Photo Library permission, and cannot be screenshotted by the host app ([WWDC20 10652](https://developer.apple.com/videos/play/wwdc2020/10652/), [Selecting Photos and Videos in iOS](https://developer.apple.com/documentation/photokit/selecting-photos-and-videos-in-ios)). PHPicker does **not** capture; camera remains `UIImagePickerController` / `AVCapture` ([Apple DTS, 2022](https://developer.apple.com/forums/thread/702859)).

This app is a **PWA**. It has no `Info.plist`, so `NSCameraUsageDescription` / `NSPhotoLibraryUsageDescription` do not apply ([QA1937](https://developer.apple.com/library/archive/qa/qa1937/_index.html)). The web analog of PHPicker is `<input type="file" accept="image/*">`: iOS Safari presents Take Photo / Photo Library / Browse ([web.dev — capturing images](https://web.dev/articles/media-capturing-images)). `capture="environment"` **skips** the library and opens the rear camera ([MDN `capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)). The picker must be opened from a **user gesture** on the same stack; `display:none` inputs are unreliable on iOS.

`getUserMedia` would be a live camera preview, a Safari camera permission, and a much larger TCB. It is the wrong default for “attach a still.”

This stack already depends on **react-aria-components**. `FileTrigger` is the RAC wrapper: `acceptedFileTypes`, `allowsMultiple`, `defaultCamera: "environment" | "user"`, `onSelect` ([FileTrigger docs](https://react-spectrum.adobe.com/react-aria/FileTrigger.html)). The existing `+` is a RAC `Button` that opens Mode/Commands (`SessionComposer.tsx`). The design council already reserved **`Attach`, only when a real attachment path exists** as a row in that menu ([`council-gpt-sol.md`](docs/design-reference/mobile-chat-apps/council-gpt-sol.md)).

Safari often **converts HEIC → JPEG** on `<input type=file>` ([HN discussion](https://news.ycombinator.com/item?id=23261216); [SO 64093027](https://stackoverflow.com/questions/64093027/is-it-possible-to-make-ios-safari-upload-original-heic-photos-without-jpeg-conve)). Treat conversion as a gift, not a guarantee: **sniff magic bytes**, never `File.type`.

Camera JPEGs may still carry GPS. Apple documents that Camera location is a user setting, not an app guarantee ([Apple Camera & Privacy](https://www.apple.com/legal/privacy/data/en/camera/)). Canvas `drawImage` → `toBlob` **drops EXIF/IPTC/XMP** because the canvas has only pixels ([orthogonal.info](https://orthogonal.info/how-to-strip-exif-data-from-photos-before-sharing-free-browser-only/); [ExifErase](https://github.com/JeffreyHamilton6399/ExifErase)). iOS Safari canvas edge is **4096×4096**; 48 MP HEIC will freeze or black-screen without a megapixel budget ([safe-image-decode](https://github.com/Araluma/safe-image-decode): 40 MP reject, 4096 preview).

### 1.5 Target-bar numbers are not 500 MB

Claude **Help Center** (product, files/docs): 500 MB/file, 20 files/chat, 8000×8000 px; iOS `+` → “Add files or photos”; Control Center “Analyze Photo with Claude” ([Upload files to Claude](https://support.anthropic.com/en/articles/8241126-what-kinds-of-documents-can-i-upload-to-claude-ai); [iOS intents](https://support.anthropic.com/en/articles/10263469-using-claude-app-intents-and-shortcuts-on-ios)).

Claude **Vision API** (what Pi actually sends to the model): JPEG/PNG/GIF/WebP; **10 MB base64-encoded** direct API / **5 MB** on Bedrock/GCP; 8000×8000; long-edge **1568 px** before the model downscales anyway; **Claude does not parse or receive image metadata**; uploads are **ephemeral for the API request** ([Vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)). GIF animation: first frame only.

Kimi **Code** (coding-agent bar, not the consumer 500 MB chat): PNG/JPEG/GIF/WebP/HEIC; paste ≤5 MB then compress (HEIC→JPEG, ~2 MB); file-picker images ≤10 MB; **≤9 files / ≤80 MB per message**; hide non-vision models when media is attached ([Kimi Code core operations](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html)).

Cline: images as data-URLs in the webview, then `image_url` / Anthropic `source.data` base64 to the provider; gated on `selectedModelInfo.supportsImages`; combined cap `CHAT_CONSTANTS.MAX_IMAGES_AND_FILES_PER_MESSAGE` ([ChatView.tsx](https://github.com/cline/cline/blob/main/webview-ui/src/components/chat/ChatView.tsx); [openai-format.ts](https://github.com/cline/cline/blob/9dea336c/src/core/api/transform/openai-format.ts); [#8635](https://github.com/cline/cline/issues/8635)). That is a **desktop agent** pattern: local process, no 16 KiB HTTP body, no redacted replica on a phone.

Mobbin (public flow pages; MCP was not authenticated in this session): Claude iOS “Chatting with Claude (image input)” ([flow](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1)); ChatGPT iOS composer with camera affordance ([screen](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1)).

For Pi Remote, the binding constraint is **not** Claude’s 500 MB doc limit. It is **1 MiB JSONL stdout + 16 KiB JSON API + 20 s tickets + redacted replica**. Product UX can still *feel* like Claude iOS (plus menu, chips, camera vs library) while the bytes follow Kimi-Code-class limits (single-digit megabytes, single-digit count) **after re-encode**.

### 1.6 OWASP: re-encode is the image analog of `redactEnvelope`

[OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet): do not trust `Content-Type` or extension; random filenames; for images, **rewrite/re-encode** to destroy polyglots and metadata. Magic-byte checks alone lose to JPEG+PHP polyglots. Server-side `sharp(input).rotate().resize().jpeg()` (or equivalent) is policy v2 for pixels: decode → strip → bound → new hash. Original bytes never hit SQLite, never hit `/api/sync`, never hit push (`lookupId` + `attentionClass` only, `docs/security.md`).

Push, cache, and snapshots remain content-free of media. Opening a chip later, if ever allowed, is a **fresh authenticated GET** of a thumbnail that itself should not exist in v1 (see spec).

---

## 2. Concrete spec contribution (build-executable)

### 2.1 Threat model (fail closed)

| Asset | Allowed to hold pixels? |
| --- | --- |
| PWA `File` / `blob:` during compose | Yes, process-local, revoked on send/remove/unmount |
| `localStorage` cache / IndexedDB | **No** |
| `/api/prompt/submit` JSON | **No** — IDs only |
| `/api/sync` envelopes / SQLite ledger | **No** — chip metadata only |
| Push payload | **No** |
| Relay tmpfs / memory map keyed by opaque id | Yes, TTL, shredded after Pi ack or expiry |
| Pi stdin `images[]` | Yes, re-encoded JPEG/WebP only, once |
| Workspace disk / `write` tool | **No** (would be a mutation) |
| Approval cards | N/A — attach is not a protected tool |

### 2.2 Limits (relay-enforced; client may be tighter)

| Parameter | Value | Rationale |
| --- | --- | --- |
| MIME after sniff | `image/jpeg`, `image/png`, `image/webp` only | Anthropic vision set minus GIF (animation/DoS) |
| Magic bytes | JPEG `FF D8 FF`, PNG `89 50 4E 47`, WEBP `RIFF….WEBP` | OWASP; ignore `File.type` |
| HEIC/HEIF/`ftyp` | **Reject** with `unsupported_type` if it still arrives | Keep `libheif` out of the relay TCB; client canvas should have converted |
| Input megapixels | Reject `>` **40 MP** before decode | iPhone 48 MP; [safe-image-decode](https://github.com/Araluma/safe-image-decode) |
| Long edge after re-encode | **1568 px** | Claude native vision tier ([Vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)) |
| Re-encoded bytes / image | **≤ 700 KiB** JPEG q≈0.82 | Leaves headroom under 1 MiB if Pi ever echoes **one** image; far under 10 MB API |
| Images / prompt | **4** | Below Kimi 9 and Claude.ai 20; stdin JSONL size |
| Total re-encoded / prompt | **2.0 MiB** | 15 s stdin write + Tailscale |
| Concurrent PUTs / device | **1** | Same serialization as `PromptService` |
| Reserves / device / min | **10** | Distinct from 20 prompts/min |
| Blob TTL | **120 s** or until prompt consume, whichever first | Longer than 20 s ticket; shorter than 15 min session |
| Filename | **Discarded** | Paths would hit `POSIX_PATH_PATTERN`; iOS names are `IMG_1234.HEIC` anyway |

### 2.3 Exact data flow (the safe path)

```text
iOS PHPicker-equivalent (FileTrigger)
  → client: sniff + 40MP gate + canvas re-encode (EXIF gone) + sha256
  → POST /api/media/reserve   JSON ≤16KiB, ticket action media:reserve (20s, one-use)
  → PUT  /api/media/blob/{id} raw bytes, Content-Length == reserved, cookie + reservation token
  → relay: sniff again, decode w/ pixel budget, re-encode again, store tmp, return attachmentId
  → POST /api/prompt/submit   { …, attachmentIds: ["att_…"], message? }  ticket prompt:submit
  → PromptService: load blobs, supervisor.send({ type:"prompt", message, images:[{type,data,mimeType}] })
  → shred blobs (unlink)
  → project text block (redacted as today) + attachment chip (no pixels)
  → redactEnvelope on chip only → SQLite → WSS
```

**Reserve body (JSON, exact keys, fail closed on extras):**

```json
{
  "type": "media.reserve",
  "reservationId": "rsv_<opaque>",
  "sessionId": "<opaque>",
  "ticket": "<opaque>",
  "byteLength": 512000,
  "sha256": "<64 hex>",
  "mimeHint": "image/jpeg",
  "width": 1568,
  "height": 1176
}
```

Relay checks: session cookie, Origin, principal, `authorizeAction('media:reserve')`, consume ticket bound to that action, **live sync socket** (`foreground_required`), `byteLength ∈ (0, 700_000]`, `sha256` format, at most 4 outstanding reservations per device, `expectedRevision` **not** required here (blob is inert). Returns `{ uploadId, token, expiresAt, maxBytes }`. Idempotent on `reservationId` if byteLength+sha256 match; mismatch → 409.

**PUT:** `Content-Type: application/octet-stream` (not the image MIME). Compare `Content-Length` to reserve **before** buffering. Cap stream at `maxBytes`. After read: sha256 must match reserve (client-computed over **re-encoded** bytes). Then **relay re-encodes anyway** (defense in depth). New hash stored; client hash is only a transport integrity check.

**Prompt submit extension:** add optional `attachmentIds: readonly string[]` to the allowlist (max 4, each `isOpaqueId`). Allow `message` empty **iff** `attachmentIds.length ≥ 1`; projector then uses text `""` or a single space — **do not** invent `"(image)"` as a persisted prompt (it would be a lie in the ledger). Chip blocks carry the semantics. `canSubmit` in `App.tsx` becomes: live && !awaitingSnapshot && !sendingPrompt && (trim(message).length > 0 || attachments.length > 0).

**Pi send:** `mimeType` is the **sniffed/re-encoded** type (`image/jpeg` preferred). `data` is standard base64, no `data:` prefix ([Anthropic vision](https://platform.claude.com/docs/en/build-with-claude/vision)). Bind `streamingBehavior` exactly as today (`steer` / `followUp` / absent).

**Shred:** after Pi `success`, or on reserve TTL, or on device revoke / session expiry / relay restart (in-memory + tmpfs, like tickets). Restart already wipes tickets; blobs must die with them.

### 2.4 Ledger / transcript projection (redaction)

New block (protocol v1 additive):

```ts
interface AttachmentChipBlock {
  kind: 'attachment';
  role: 'user';
  attachmentId: string;      // opaque, not a path
  mediaKind: 'image';
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  byteLength: number;        // re-encoded size
  width: number;
  height: number;
  sha256: string;            // of re-encoded bytes
  status: 'sent';            // never 'preview'
}
```

No `data`, no `preview`, no `fileName`, no `blobUrl`. `redactEnvelope` sees only numbers and opaque tokens. `isTranscriptBlock` gains this kind. Old clients: `parseDisplayBlock` → `unknown` → existing redacted copy. **Do not** add a thumbnail GET in v1 (that is a new authenticated byte lane and a PII store).

Live compose preview is **not** a transcript block. Optimistic user text may appear as today; chips in the composer are local until 202. After 202, replace local chips with ledger chips (glyph + `1200×900 · 180 KB`), not with `blob:` URLs. Revoke object URLs in the same turn.

If a future client wants a thumbnail: separate table, AES-GCM like push subscriptions, `Cache-Control: private, no-store`, cookie + one-use ticket, never in snapshots. Out of v1.

### 2.5 Composer UX / gestures / a11y (Claude-shaped, capability-gated)

**Affordance.** Do not add a dead paperclip. When `media` policy is compiled in (see 2.7), add two rows at the **top** of the existing `+` popover (`ComposerTools`), matching council + Claude Help:

1. **Photo Library** — `FileTrigger` `acceptedFileTypes={['image/*']}` `allowsMultiple` no `defaultCamera`. `aria-label="Attach photos from library"`.
2. **Take Photo** — `FileTrigger` `acceptedFileTypes={['image/*']}` `defaultCamera="environment"`. `aria-label="Take a photo"`. Single-file.

Hit region **≥ 44×44 pt** ([HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)). WCAG 2.2 AA floor is 24×24 CSS px ([2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)); use Apple’s 44.

Trigger `FileTrigger` from the RAC `Button` already in the popover (user-gesture). Do not `display:none` a raw input.

If host model `input` lacks `"image"` (Pi model object, [rpc.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)): **hide both rows** (Cline `supportsImages` lesson, [#8635](https://github.com/cline/cline/issues/8635)). Do not show a disabled control. Plan mode: rows **stay available** (not a filesystem write). Disclaimer under tray when chips present: `Pi can make mistakes · photos are sent to the host agent` (WCAG AA contrast on muted ink).

**Composer chips (pre-send).** Horizontal strip **above** the textarea, inside `.composer-tray`, parchment fill, 1px carbon/20 hairline, 8pt radius, 64×64 preview (`<img alt>` required). Alt: `Photo {n}, {w} by {h} pixels, {humanSize}, not sent`. Remove: 44pt `×` (`aria-label="Remove photo {n}"`). Swipe-left on chip = remove (optional; button is the a11y path). `role="list"` / `role="listitem"`. `aria-live="polite"` on the strip: `2 photos attached`.

**States.**

| State | UI |
| --- | --- |
| `picking` | system sheet; composer unchanged |
| `compressing` | chip skeleton, no send |
| `ready` | preview; send enabled if text or ≥1 chip |
| `reserving` / `uploading` | clay hairline progress on chip; send disabled; `aria-busy` |
| `accepted` | chip check; wait for prompt 202 |
| `rejected` | existing `.inline-alert`; chip outline carbon; reason from closed set |
| `shredded_expired` | alert `Photo expired — attach again`; remove chip |

Closed error codes (map 1:1 to copy, never echo server internals): `too_large`, `too_many_pixels`, `unsupported_type`, `rate_limited`, `foreground_required`, `unauthorized`, `expired`, `hash_mismatch`, `pi_unavailable`.

**Gestures.** Tap `+` → popover. Tap Library/Camera → system UI. Tap `×` → revoke blob + DELETE reservation if any (`/api/media/reserve` with same ticket pattern, or TTL). Send = existing circular control. Steer/Later: attachments allowed on both (Pi `steer`/`follow_up` already take `images`). Stop does not upload.

**Keyboard / VO.** FileTrigger child is a RAC Button (already focusable). Popover `Dialog` already `aria-label="Session tools"`. Do not rely on color alone for upload fail (alert text). `prefers-reduced-motion`: no progress spin (existing `.composer-spinner` rule).

**Visual / motion (fixed DS).** Bone `#f8f8f6` chip fill; carbon ink glyph (simple photo mark, 20pt); clay `#d97757` only on the send circle and upload progress stroke. Inter for chip labels; no serif on chips. Progress: 150ms linear stroke; no bounce. Dark: same tokens as tray. 320px: chips wrap to two rows, never exceed prose column (council `InlineAttachmentCard`).

**Do not persist drafts with blobs.** Text draft may stay; photos die on navigation. Matches “minimum data” ([Apple privacy guidance](https://developer.apple.com/design/human-interface-guidelines/privacy) / [Protecting the User’s Privacy](https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy) — request/use only what the task needs).

### 2.6 HTTP / auth wiring (fail closed)

Add to `AuthorizedAction`: `media:reserve`, `media:put`, `media:cancel`.  
`readBody` stays 16 KiB for JSON routes. **PUT uses a separate reader** with `maxBytes` from the reservation; never call `readJsonBody` on the blob.  
`Content-Length` missing or `>` reserved → 413, no buffering.  
Rate limiter: new window, not the 120/min global (a 700 KiB PUT is not “one request” in DoS cost — count **bytes** too: 8 MiB/min/device).  
Revoke device / logout: delete reservations + files (same as tickets/sockets).  
Do not log sha256 of rejected blobs in plaintext logs if logs leave the host; log `fields: { reason, byteLength }`.

Tests to require (names only): ticket replay on reserve; PUT without reserve; PUT length mismatch; JPEG polyglot (HTML after SOS) round-trips to clean JPEG; GPS EXIF absent after re-encode; POSIX-like base64 does not hit ledger; prompt with unknown `attachmentId` → 400; prompt with another device’s id → 401; Plan mode still submits images; mutation family off still submits images; stdout fixture with a fake 2 MiB image event → decoder error handled without writing the payload to SQLite.

### 2.7 Operator switch (keep default-deny spirit)

Images are not `filesystem`/`process`/`network` tools, but they expand TCB. Compile-time/env: `PI_REMOTE_MEDIA_ENABLED=1` (default **unset/off**). When off: no routes, no `+` rows, no protocol `attachmentIds` accepted (extra key still fails closed if the guard isn’t deployed; if deployed, reject with `not_available`). Phone cannot enable it. Same story as `--full-access` in `goal-prompt.md`.

---

## 3. Divergent / minority ideas (do not converge yet)

1. **OCR-and-redact, never send pixels.** On-device or relay Tesseract → run policy v1 on the text → send only redacted text. Best posture; useless for UI screenshots and architecture diagrams (the actual coding-agent job). Keep as an operator “text-only attach” mode.

2. **Pixel redaction boxes.** After OCR, black-box `sk-`/`ghp_`/`Bearer` regions, then send the boxed JPEG. Minority because OCR is brittle on iPhone screenshots and creates a false sense of safety.

3. **Every photo is a `write` lease.** Drop re-encoded JPEG into a workspace inbox via the existing exact-action approval card. Perfectly consistent with mutation doctrine; unusable on a phone (approval per photo, paths redacted, Plan mode blocks). Reject for v1; useful as a “full-access” sibling later.

4. **Cross-device thumbnail vault.** Encrypted blob table + authenticated GET so a second enrolled phone sees the photo. Directly recreates [open-webui#13103](https://github.com/open-webui/open-webui/issues/13103) on a tailnet. Defer until someone has two phones and a threat model that wants it.

5. **Client-only re-encode, skip relay re-encode.** Faster; loses polyglot defense if a crafted JPEG decodes in Safari and exploits `sharp`. Do both.

6. **Single `<input accept="image/*">` without a Camera row.** iOS already offers Take Photo in that sheet ([web.dev](https://web.dev/articles/media-capturing-images)). Fewer controls, less Claude-like labeling. Acceptable fallback if the popover feels crowded at 320px.

7. **`getUserMedia` in-PWA shutter.** Custom viewfinder, EXIF-free frames, no Camera app GPS. Costs Safari camera permission, more JS, worse HIG. Only if FileTrigger camera is broken in standalone PWA on a measured iOS version.

8. **Raise JSONL `maxRecordBytes` to 8 MiB** so Pi may echo images. Weakens a DoS cap that exists specifically because JSONL is unbounded without it. Prefer stripping images in a **pre-JSON transform** on stdout if echo is confirmed.

9. **Perceptual hash only in the chip** (`dHash`) instead of sha256. Enables “same photo twice” UX without proving bytes. sha256 is the integrity field; dHash is optional and leaky (similar photos).

10. **Kimi-style 80 MB / 9 files.** Matches Kimi Code, blows stdin/JSONL/ticket model. Do not chase.

---

## 4. Open questions + risks

| ID | Question | Why it blocks |
| --- | --- | --- |
| Q1 | Does a live Pi child **echo** `images` / `attachments[].content` on `message_*` or `get_messages` stdout? | If yes, 1 MiB JSONL is a production incident on the first photo. Must be measured against the pinned Pi version before enabling `PI_REMOTE_MEDIA_ENABLED`. |
| Q2 | Does Pi persist attachment base64 in the **session file** on disk after prompt ack? | Relay shred does not retract host-side PII. Containment profile is not on the production entrypoint (`docs/security.md` §8). |
| Q3 | Tailscale Serve request-body / timeout limits on phone→Serve→loopback? | Undocumented here; a 700 KiB PUT may need Serve flags. |
| Q4 | Standalone iOS PWA: does `FileTrigger` + `defaultCamera` still count as a user gesture after the RAC popover closes? | If not, open the FileTrigger **before** closing the popover, or use a two-step sheet. |
| Q5 | Vision-capable model detection: is `model.input` always present on `get_state` as projected today? | `projectAvailableModel` drops path-like ids and only keeps `provider`/`id`/`label` — **`input` is not in the browser DTO**. Hiding Attach requires extending the **allowlist projector**, not parsing extra Pi JSON in the PWA. |
| Q6 | Image-only send vs `isPromptSubmitCommand` message-required: protocol bump must ship **atomically** with the PWA or old relays 400. | |
| Q7 | 15 s `DEFAULT_REQUEST_TIMEOUT_MS` vs stdin write of ~2 MiB JSON on a busy Mac. | May need a media-specific timeout, not a global raise. |
| Q8 | Screenshots of secrets (enrollment QR, `.env`, Slack OTP). Pattern redaction will not see them. | UX copy must say photos go to the host agent; no technical fix without Q1-style OCR (minority). |
| Q9 | Live Photos / spatial / screenshots-as-PNG-with-alpha. | PNG re-encode may stay large; force JPEG for camera, allow PNG only if re-encoded size ≤ 700 KiB else transcode. |
| Q10 | Mobbin MCP OAuth was not available this pass; Claude/Kimi **pixel-level** composer measurements are from Help Center + public Mobbin URLs, not authenticated screen dumps. | |

**P0 risks if this spec is skipped:** (a) stuffing base64 into `prompt.submit` or the ledger; (b) writing gallery files into the workspace; (c) trusting `File.type`; (d) 20 s ticket around a PUT; (e) showing Attach when the model cannot take images; (f) caching previews in `localStorage`.

---

## 5. Sources

### This repo
- `docs/security.md` — 16 KiB bodies, 64 KiB WS, 20 s tickets, four boundaries, redaction disclaimer  
- `ARCHITECTURE.md` §6–7 — `redactEnvelope` before persist/broadcast; prompt command never replayed  
- `apps/pi-remote-relay/src/http/server.ts` — body cap, prompt vs abort `foreground_required`  
- `apps/pi-remote-relay/src/store/redaction.ts` — policy v1 patterns  
- `apps/pi-remote-relay/src/prompt/prompt-service.ts` + `src/prompt/README.md`  
- `apps/pi-remote-relay/src/auth/policy.ts`, `auth-service.ts` (`DEFAULT_TICKET_TTL_MS = 20_000`)  
- `apps/pi-remote-relay/src/rpc/framing.ts` (`DEFAULT_MAX_RECORD_BYTES = 1_048_576`)  
- `apps/pi-remote-relay/src/rpc/supervisor.ts` (stdin JSONL write, 15 s timeout)  
- `packages/pi-rpc-protocol/src/types.ts` — `ImageContent`, `PromptCommand.images`, no attachment transcript kind  
- `packages/pi-rpc-protocol/src/guards.ts` — `PROMPT_SUBMIT_KEYS`, `isTranscriptBlock`  
- `apps/pi-remote-web/src/SessionComposer.tsx`, `App.tsx`, `cache.ts`, `state.ts`, `auth.ts` (QR file input)  
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md` — Attach only when a real path exists  

### Pi / coding-agent RPC
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md  
- https://github.com/badlogic/pi-mono/blob/773f91f4/packages/coding-agent/src/modes/rpc/rpc-client.ts  

### Apple / web platform
- https://developer.apple.com/videos/play/wwdc2020/10652/  
- https://developer.apple.com/documentation/photokit/selecting-photos-and-videos-in-ios  
- https://developer.apple.com/forums/thread/702859  
- https://developer.apple.com/design/human-interface-guidelines/buttons  
- https://www.apple.com/legal/privacy/data/en/camera/  
- https://developer.apple.com/library/archive/qa/qa1937/_index.html  
- https://web.dev/articles/media-capturing-images  
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture  
- https://react-spectrum.adobe.com/react-aria/FileTrigger.html  
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html  

### Upload / EXIF / bombs
- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet  
- https://orthogonal.info/how-to-strip-exif-data-from-photos-before-sharing-free-browser-only/  
- https://github.com/JeffreyHamilton6399/ExifErase  
- https://github.com/Araluma/safe-image-decode  

### Target-bar products
- https://support.anthropic.com/en/articles/8241126-what-kinds-of-documents-can-i-upload-to-claude-ai  
- https://support.anthropic.com/en/articles/10263469-using-claude-app-intents-and-shortcuts-on-ios  
- https://platform.claude.com/docs/en/build-with-claude/vision  
- https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html  
- https://www.kimi.com/en-cn/help/kimi-code/vscode-core-operations  
- https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312  

### Prior-art clients
- https://github.com/open-webui/open-webui/issues/13103  
- https://github.com/open-webui/open-webui/pull/17897  
- https://github.com/cline/cline/blob/main/webview-ui/src/components/chat/ChatView.tsx  
- https://github.com/cline/cline/blob/9dea336c/src/core/api/transform/openai-format.ts  
- https://github.com/cline/cline/issues/8635  

### Mobbin
- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 (Claude iOS image-input flow)  
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 (Claude chat detail / upload)  
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 (ChatGPT iOS camera-in-composer)  
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 (Claude iOS text-input flow)
