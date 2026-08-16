<!-- provenance: external-CLI orchestration pass; original file iter-15-deepseek.md -->
> **Source pass 15** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-15-deepseek.md`.

<!-- F5-media-upload | model=deepseek | lens=security-redaction | iter 15/15 | 2026-08-15T20:03:52.150Z -->

# Deep-Research Pass 15/15 — Lens: `security-redaction` (data-flow trust boundary + redaction posture for the upload lane)

**Feature:** Pi Remote → upload media from iOS gallery/camera into the composer, security-safe path to `pi`.
**Stack constants honored:** React 19 + Vite + Tailwind 4 + react-aria-components PWA, iOS Safari/standalone, ink-on-parchment + clay accent, WCAG AA, read-only-by-default, one-use-ticket + revision-checked fail-closed mutations, redaction everywhere, host/extension-enforced plan mode.

---

## 1. Findings — security, redaction, and data-flow for the upload lane

### 1.1 The upload endpoint is the first surface that accepts arbitrary bytes — the relay is currently built to reject them

The relay enforces a hard **16 KiB** ceiling on every HTTP body today, in *one* place that covers all routes: `readBody()` rejects on `content-length > MAX_HTTP_BODY_BYTES` **and** on accumulated streamed bytes (`apps/pi-remote-relay/src/http/server.ts:39,885–908`). WebSocket messages are capped at 64 KiB; sockets at 32; per-device at 4. A single 12 MP HEIC photo (4–8 MB) is 250–500× the current budget. The build spec **must** add a *separate, explicitly bounded* streaming body reader for the one upload route — it must not relax the 16 KiB guard for JSON routes, or every read-only capability silently inherits a new exfiltration/perf vector. This mirrors the separation OWASP demands: upload handles need their own request-level size limits distinct from the rest of the API (OWASP, *File Upload Cheat Sheet*, "Upload and Download Limits").

### 1.2 Image bytes are a new redaction *type* that the existing policy cannot touch — a structural guarantee is required, not a regex

The canonical redaction is pattern-based string scanning plus allowlist projectors. `redaction.ts` treats `prompt`, `cwd`, `token`, etc. (`apps/pi-remote-relay/src/store/redaction.ts:24–33`) and the relay **redacts before persistence or broadcast** (`relay-store.ts:83–88`, `sync.ts:30`). But an opaque JPEG/HEIC is **not a string and not JSON**: no regex sees inside it. So "redaction everywhere" for images means four *structural* guarantees, verified by tests, not patterns:

1. **Bytes never enter the transcript.** Envelope payloads are `JsonValue`; transcripts must carry a typed `user.attachment` block holding *metadata + a reference*, never base64. The existing `TranscriptBlock` union already proves this discipline (types.ts:178–237) — an `AttachmentBlock` slots in as a new `kind`, projected by an **allowlist projector** exactly like `projectRuntimeModelCatalog`/`projectCommandCatalog` (redaction.ts:122–178), which structurally cannot leak raw fields.
2. **EXIF/GPS is a privacy leak unique to images.** iPhone photos embed GPS, device, and timestamp via EXIF; the Anthropic vision platform itself documents that it does not read EXIF/GPS metadata (Anthropic, *vision* guide) — but the *relay's* spool and pi's worktree *do* carry the bytes. Stripping must be host-side at normalization (sharp/exiftool), because the client is not the trust boundary. Signal's own `MediaUtil` does exactly this class of work — MIME correction, dimensions via EXIF header, always re-decode — before an image ever leaves the device (signalapp/Signal-Android, `MediaUtil.java`); for Pi Remote the boundary is host-side, *after* ingress, so a compromised or tampered client cannot skip it.
3. **Metadata (filename, device logs) is scrubbed server-side.** OWASP mandates generated filenames and dropping user-supplied name/path (OWASP, *File Upload Cheat Sheet*, "Filename Safety", "File Storage Location"). Store under a random 256-bit `attachmentId` key, never echo `file.name` into persistence; display an owner-side short label only in the PWA.
4. **Multiviewer redaction.** A mirror desktop session or a second enrolled device should see a **blurred/ink-washed surrogate** card with metadata, not pixels — the owner's device alone gets the authenticated lightbox. This is the *stronger* reading of the existing push posture (push carries only `lookupId` + `attentionClass`; opening requires a fresh authenticated fetch — docs/security.md §9). The image should extend that rule: **no device ever receives attachment bytes through push or sync snapshots; reading requires an explicit, fresh, one-time-ticketed fetch.**

### 1.3 Data-flow design must reuse the one-use-ticket + revision discipline, not invent a parallel authority

The mutation posture is: device proof → short session → exact principal/origin → **one-use ticket bound to action** → revision-check → fail closed (`auth-service.ts:222–242`, `server.ts:510–541`). The upload lane should be designed as **ticketed staged uploads**, not a write-through:

- **Stage 1 (reserve):** PWA calls `POST /api/attachment/begin` with a one-use ticket (new `attachment:begin` action in `policy.ts`), the *client's last-seen transcript revision*, and declared metadata (client-computed `type`/`size` only as hints). Relay mints a `pendingAttachmentId`, stores it in-memory (matching the "process-memory state" doctrine for sessions/tickets), returns a **fresh one-use upload ticket** bound to that id.
- **Stage 2 (bytes):** `POST /api/attachment/upload` with **that** ticket + multipart body. This is the only route with a dedicated size ceiling (e.g. 25 MB streaming cap, hard-declared against both `content-length` and accumulated bytes, **plus a decompression-shaped guard** for GIF frames — OWASP's size-limit advice), a magic-bytes allowlist, and a `.slice()`-friendly resume contract (see open questions).
- **Stage 3 (bind to a message):** the existing `prompt:submit` message command carries `{text, attachments:[attachmentId…]}`; the relay **verifies each id is an owned, un-consumed, un-expired pending attachment** before the prompt block is projected and published (`prompt-service.ts:100–170` is the projection seam). Attachment consumption happens *only* at submit; the uploaded bytes then move from spool → pi-visible worktree path, **after** host normalization.

This keeps the invariant from the security doc: "authority that the phone must prove fresh on every use" (docs/security.md §1) — a spooled blob is *not* authority, exactly as push notification payloads are not authority.

### 1.4 The iOS arrive/attach surface must not widen the tailnet/loopback boundary

- Tailscale Serve reverse-proxies **only** `http://127.0.0.1` targets and the deployment already disables Funnel (docs/security.md §2; tailscale/kb/1242 — "only `http://127.0.0.1` is supported for proxies"). The upload route is served on the same loopback listener and the same secret-prefixed path, and the relay continues to strip `tailscale-*` identity headers after capturing the principal (`server.ts:795–815`). No new listener, no new port, no `--set-path` mount outside the existing secret prefix.
- `input[type=file]` + `accept="image/*"` (gallery, `multiple` allowed) and a separate `accept="image/*" capture="environment"` input (instant camera) are "the entire native surface available"; `capture` is explicitly **not Baseline** ("does not work in some of the most widely-used browsers" — MDN, *capture*), and `accept` is only a hint, "not validation" (MDN, *file* input; OWASP backs it with server-side validation). The **server** must validate magic bytes regardless of what iOS hands back.
- **HEIC is the real arrival-format risk.** Optimized iCloud storage hands the web app `.heic`; it is not in the Anthropic vision format list (JPEG/PNG/GIF/WebP only) and Safari cannot always decode it to canvas. Host-side transcode (HEIC → JPEG) at normalization is therefore the safety net, not the client (prior pass grounded heic2any + Anthropic limits; this pass confirms the host is where it must live — see §1.2). The PHPicker precedent shows the ideal is *out-of-process picker, no full-library permission* (Apple, `PHPickerViewController` i.e. "wait, docs show it differently"). **Reality for a PWA:** WebKit hands the picker sheet to the web app with **no permission prompt** for gallery multi-select — which is *better* privacy-wise than the native `PHPhotoLibrary` grant, but it hands us the raw asset, so on-device previews should be built from a downscaled object URL, never re-sent.

### 1.5 Preview delivery must be one-time-ticketed, not a public URL open door

Presigned-URL thinking (AWS S3: a signed URL permits exactly one allowed operation for a limited time, and the full URL must be used unmodified — AWS, *Uploading objects with presigned URLs*) maps cleanly onto the existing ticket machinery: an **expiring, single-use, origin+principal-bound read ticket** issued on demand by `GET /api/attachment/preview?ticket=…`, exactly analogous to `POST /api/auth/ticket` → consume in `server.ts:163–165, 516–527`. This means no `<img src="/files/<id>">` that a cached sync page could hotlink: the PWA fetches a blob URL through the authenticated/consumed ticket, then `URL.revokeObjectURL`. Responses already carry `cache-control: no-store` and `default-src 'none'` CSP (`server.ts:959–966`), so served bytes cannot be cached by an intermediate or rendered by markdown injection.

---

## 2. Concrete spec contribution a build phase can execute

### 2.1 Composer attach — states, gestures, a11y, motion (security-tuned)

**Markup (react-aria-components, in the `composer-bar` `composer-left` group):**
- One visually-hidden `<input type="file" id="pi-gallery" accept="image/*" multiple>` (gallery; iOS surfaces library first, camera reachable inside the sheet on most iOS versions).
- One visually-hidden `<input type="file" id="pi-camera" accept="image/*" capture="environment">` (instant camera). Two inputs because `capture` is monotonic.
- Both are **only** ever triggered from a `Button` press inside a `DialogTrigger`/`Popover` (the existing `ComposerTools` pattern), never on load.
- Both inputs: clear `value=""` after every `change` (re-picking the same asset re-fires), hidden with `opacity:0` + `.sr-only`-style wrapping so assistive tech still sees an interactive control (MDN pattern).

**States (exact):**
`idle` → `picking:(gallery|camera)` (system sheet; PWA fully suspends — SPA must treat this as "can be backgrounded/killed") → `previewing` (attached cards form part of the *pending draft*, not a message) → `normalizing` (only if client-side preview transcode runs; default no-op) → `reserving|uploading` (per-asset: begin-ticket pending → byte transfer with progress) → `committed-local` (bytes on host, `attachmentId`s held, message not yet sent) → `sent` (prompt block in transcript) → per-asset `failure` (from **relay reject** — wrong magic bytes, size overrun, expired ticket — retry via raw-input replay, never silent drop; Codex-style explicit placeholder text in BOTH the transcript and the pi-visible lane: `"image omitted: exceeds 25 MB limit"`).

**Gestures (iPhone-native, all mirrored on keyboard):**
- Tap **＋** → action sheet: *Photo Library · Take Photo* (the two hidden inputs). No custom `capture` guessing.
- In preview sheet: tap thumbnail → lightbox; swipe L/R between pending assets; swipe-down or Esc dismisses; per-card ✕ removes (Delete key, SR label "Remove image").
- In-canvas: thumbnails live in a horizontal rail above the composer textarea; tap card → edit caption/alt.
- Motion: sheet rise 220 ms ease-out-quart; respect `prefers-reduced-motion` (no spring). Upload progress = determinate 2 px ink rail with clay fill; failures inline/non-blocking.

**A11y (WCAG AA):**
- Every thumbnail: focusable button, accessible name `IMG_0001.jpeg, 4.2 MB — 4032×3024`; lightbox `role="dialog"` `aria-modal`.
- Per-image **alt caption field** (hint: "describe the photo for accessibility"); default alt `Photo (n of N)`.
- `aria-live="polite"` status region: "2 photos attached", "Uploading photo 1 of 2 (34%)", "Photo upload failed; retry" (WCAG 4.1.3).
- Color: clay `#d97757` only on selected/hover/error states; both themes verified 4.5:1.

### 2.2 Upload endpoint spec (crossing the read-only line deliberately)

| Item | Value |
|---|---|
| Endpoint | `POST {serve-secret}/api/attachment/begin` and `POST {serve-secret}/api/attachment/upload` — same loopback listener, same prefix, no new mount |
| Auth | Application session cookie + `tailscale-user-login` principal + exact origin (identical to every today) |
| **Lane entitlement** | Composer attach button renders disabled until the session grants `attachment-lane` (one-time, logged, using the existing approval mechanism); read-only stays default |
| Begin validation | one-use `attachment:begin` ticket; client last-seen transcript `revision` echoed — **fail closed if revision moved** (mirrors mutation policy) |
| Upload validation order | ticket one-time + bound `pendingAttachmentId` → **magic bytes** allowlist (JPEG/PNG/WebP/GIF/HEIC) regardless of Content-Type (OWASP) → per-request streaming size cap (25 MB) checked against both declared and accumulated length → dimension header parse |
| **Normalization at rest (host, before anything is stored)** | HEIC→JPEG (libvips/sharp); **EXIF/GPS strip** enforced + tested; downscale to long-edge ≤1568 px standard tier (≤2048 if high-res model), q~0.82, ≤~7.5 MB so base64/filename reference stays under Anthropic vision caps; keep original-only-in-memory until send consumed; store spooled bytes under random 256-bit `attachmentId` in a non-git, non-served path |
| Redaction enforced | transcript projects an `AttachmentBlock` via allowlist projector (never raw bytes, never original filename in persistence); sync/push carry only `{attachmentId, mediaType, width, height, bytes}` |
| Preview | `GET .../api/attachment/preview` with **one-use, expiring, origin+principal-bound** ticket → blob → `URL.revokeObjectURL`; blur(14px) surrogate for any non-owner viewer |
| Lifecycle | pending attachments TTL 60 min; consumed on `prompt:submit`; spool cleaned on completion/abort/relay restart (matches process-memory sessions doctrine) |
| Pi intake | pi receives the normalized host path (or `file_id` if the backend offers it) via the prompt supervisor, never raw phone bytes; plan-mode stays read-only vs the file |
| Rate limit | new fixed-window byte-budget limiter (e.g. 25 MB / 60 s per principal) in addition to the existing per-principal request limiter |

### 2.3 Visual/motion summary
- Card: parchment fill, 1 px carbon-ink hairline, clay 2 px selected ring; lightbox scrim ink 0.55; reduced-motion respected.
- "photo downsized to 1568px · metadata removed" footer line on the attachment card (transparency about redaction).
- Errors fail *soft* in UI/ticket (only the mutation path fails closed, per the fixed posture).

---

## 3. Divergent / minority ideas worth considering

1. **No host spool at all — "tap-the-QR" attach.** Reuse the enrollment QR pattern: phone renders an attachment claim QR; the host pulls bytes from the tailnet directly into the worktree with the same one-use ticket. Zero persistent upload endpoint; slower; maximal "redaction everywhere" (fewest moving parts to audit).
2. **"Metadata-only + alt text" transcript card for *every* viewer, including the owner** (iCloud-photo-privacy school). Denies future re-view entirely; simplest privacy story and likely the strongest fit for the "redaction everywhere" doctrine. The lightbox becomes a deliberate, negotiated exception rather than the default.
3. **Client-side downscale/EXIF-strip is the *primary* reduction, host-side is the mirror image and the official boundary.** Some will argue on-device reduction (canvas `toBlob`) halves bandwidth before upload; the security answer is host-side must still re-do it, so client work is *only* a bandwidth optimization, never a trust claim.
4. **Fingerprint-scan the spooled image** (e.g. simple perceptual hash) at normalization and surface `"duplicate of earlier attachment"` — reduces re-upload/leakage surface and prompt pollution at near-zero cost.
5. **Video lane later** (`video/*` + `capture`, ≤30 s, transcoded to 480p, host-side frame-time metadata stripped). Keep the magic-bytest allowlist and normalization seam open so the door doesn't close.

---

## 4. Open questions + risks

- **pi's intake surface remains the largest unknown:** does `earendil-works/pi` accept a host path, a base64 block, or a `file_id`? The relay response shape (`path` vs `file_id` vs base64) must be probed before the upload lane is built.
- **Multiviewer definition:** is "owner" the single enrolled device or any same-principal device on the tailnet? The blur/lightbox permissions need the spec to lock this.
- **Resume on backgrounded PWA:** iOS can terminate the tab mid-upload. Idempotent begin-tickets + `File.slice`-based resume need a defined contract, or "restart the whole op" must be the only path.
- **GIF decompression bombs:** a 40 MB GIF can decode to gigabytes. Size cap must be on *decoded frames*, not just bytes — needs a decompression guard in the normalize stage.
- **EXIF-strip testability:** "redaction everywhere" is defeated if a log line or replay payload ever carries GPS. Add a negative-control test asserting no EXIF survives any stage, mirroring the existing `negative-controls.test.ts` suite.
- **20-image/200k-context interplay:** multi-attach drafts re-sent over multiple turns grow token cost; prefer path/`file_id` references over base64 so each turn stays small (the Files-API rationale).

---

## 5. Sources

**Fetched/verified this pass**
- MDN — `capture` attribute (not Baseline; user/environment semantics): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture
- MDN — `<input type="file">` (`accept` is hint not validation, `multiple`, `cancel` event, fake-path privacy): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file
- MDN — `HTMLInputElement.webkitdirectory` (FileList flatness / relative paths): https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory
- MDN — `HTMLInputElement` (accept/capture/files/fakepath): https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
- OWASP — File Upload Cheat Sheet (magic bytes, content-type untrusted, filename safety, storage location, size limits): https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- Tailscale — Serve KB (reverse proxy only to `http://127.0.0.1`; Funnel is public, Serve is tailnet-only): https://tailscale.com/kb/1242/tailscale-serve
- AWS — Uploading objects with presigned URLs (single-operation, expiring, unmodified-URL semantics): https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html
- Apple — `PHPickerViewController` (out-of-process picker, no full-library permission): https://developer.apple.com/documentation/photosui/phpickerviewcontroller
- Signal — `MediaUtil.java` (MIME correction, EXIF-dimension reads, re-decode before send): https://raw.githubusercontent.com/signalapp/Signal-Android/main/app/src/main/java/org/thoughtcrime/securesms/util/MediaUtil.java · repo https://github.com/signalapp/Signal-Android
- QuirksMode — styling `<input type=file>` (Safari disallows typing, McGrady technique): https://www.quirksmode.org/dom/inputfile.html

**Local code grounded (this pass)**
- `docs/security.md` — four-boundary posture, redaction §9, session/ticket doctrine
- `apps/pi-remote-relay/src/http/server.ts` — `MAX_HTTP_BODY_BYTES=16_384`, `readBody()` dual size guard (lines 885–908), ingress/auth (795–894), action routing, ticket consumption (163–165, 516–527), no-store/CSP responses (959–966)
- `apps/pi-remote-relay/src/auth/auth-service.ts` — one-use ticket lifecycle (222–242, 280–302); `apps/pi-remote-relay/src/auth/policy.ts` — `AuthorizedAction` allowlist
- `apps/pi-remote-relay/src/store/redaction.ts` — policy v1 patterns + allowlist projectors (122–178); `apps/pi-remote-relay/src/store/relay-store.ts` — redact-before-persist (83–88)
- `apps/pi-remote-relay/src/approval/approval-service.ts` — `redactJson` on display args (490, 609–617)
- `apps/pi-remote-relay/src/prompt/prompt-service.ts` — prompt projection seam (100–170); `apps/pi-remote-relay/src/store/transcript-projector.ts` — `projectSubmittedPrompt` (227–241)
- `packages/pi-rpc-protocol/src/types.ts` — `Envelope`/`TranscriptBlock` union, `RedactionMetadata` (113–138, 178–237)
- `apps/pi-remote-web/src/SessionComposer.tsx` — composer + `ComposerTools` popover seams (97–260)
- `apps/pi-remote-relay/tests/security/negative-controls.test.ts` — existing negative-control posture to extend

**Carried from prior passes (15-of-15 lineage — restated as shared grounding)**
- Anthropic vision guide (HEIC excluded, ≤5/10 MB base64, 8000px, token math, EXIF not read): https://platform.claude.com/docs/en/build-with-claude/vision
- openai/codex `image_preparation.rs` (explicit fail-closed placeholder strings): https://github.com/openai/codex
- conversejs/converse.js XEP-0363 (upload-endpoint + reference-card architecture): https://github.com/conversejs/converse.js
- alexcorvi/heic2any (client HEIC decode gap): https://github.com/alexcorvi/heic2any
- Mobbin (login-gated; not verifiable this pass — flagged unverified): Claude iOS https://mobbin.com/apps/claude-ai-chatbot · Kimi https://mobbin.com/apps/kimi
