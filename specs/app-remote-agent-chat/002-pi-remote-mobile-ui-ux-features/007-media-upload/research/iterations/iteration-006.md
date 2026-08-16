<!-- provenance: external-CLI orchestration pass; original file iter-06-grok.md -->
> **Source pass 6** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-6-grok.md`.

<!-- F5-media-upload | model=grok | lens=prior-art-github | iter 6/15 | 2026-08-15T20:10:57.333Z -->

# Iteration 6 — Prior-art GitHub (remote-CLI / coding-agent chat + mobile clients)

Lens: how other GitHub-published remote-CLI, terminal, and coding-agent chat clients get gallery/camera bytes to an agent, and which of those designs survive Pi Remote’s fixed constraints (iPhone PWA, React 19 + Vite + Tailwind 4 + react-aria-components, ink-on-parchment, ticketed + revision-checked mutations, redaction everywhere, host-enforced plan mode).

---

## 1. Findings for this lens

### 1.1 This repo already has the host-side image type — and deliberately does not expose it on the phone mutation

Pi’s own RPC already defines multimodal user turns:

```12:48:packages/pi-rpc-protocol/src/types.ts
export interface ImageContent extends JsonObject {
  readonly type: 'image';
  readonly data: string;
  readonly mimeType: string;
}
export interface PromptCommand extends PiRpcCommandBase {
  readonly type: 'prompt';
  readonly message: string;
  readonly images?: readonly ImageContent[];
  ...
}
```

That shape matches upstream pi-mono’s `ImageContent` (`type` + `mimeType` + base64 `data`) used by `@file` CLI arguments ([badlogic/pi-mono `file-processor.ts`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/cli/file-processor.ts)).

The **phone → relay** command is a different type. `PromptSubmitCommand` has no `images` field. Its guard is an exact-key allowlist and **rejects extra keys** (`PROMPT_SUBMIT_KEYS` = `type | submissionId | sessionId | message | ticket | streamingBehavior`). It also requires `message.trim().length > 0`, so an image-only turn is currently illegal ([`packages/pi-rpc-protocol/src/guards.ts`](packages/pi-rpc-protocol/src/guards.ts)). The relay then forwards only `{ type: 'prompt', message }` to Pi — images are dropped even if a client smuggled them ([`apps/pi-remote-relay/src/prompt/prompt-service.ts`](apps/pi-remote-relay/src/prompt/prompt-service.ts) lines 109–116). Transcript projection is text-only (`projectSubmittedPrompt` → `kind: 'text'`). Durable transcript kinds are `text | thinking | plan | tool_call | tool_result | file_diff | usage` — there is no attachment block.

The only `<input type="file" accept="image/*">` in the PWA is enrollment QR scanning ([`apps/pi-remote-web/src/App.tsx`](apps/pi-remote-web/src/App.tsx) ~387). The composer’s `+` is already a Claude-style tools popover (Build/Plan, slash commands) with **no attach row** ([`SessionComposer.tsx`](apps/pi-remote-web/src/SessionComposer.tsx)). Existing design notes already forbid a dead attach affordance ([`docs/design-reference/mobile-chat-apps/council-gpt-sol.md`](docs/design-reference/mobile-chat-apps/council-gpt-sol.md)).

**Implication:** the feature is not “add a picker.” It is “open a new mutation lane that is allowed to carry bytes, then map those bytes onto the ImageContent Pi already understands, without writing those bytes into the redacted transcript store.”

### 1.2 Closest analog: Happy (`slopus/happy`) — mobile Claude Code / Codex client

Happy is the nearest product: a mobile + web client that remote-controls Claude Code and Codex, with gallery/camera attach, encrypted upload, and CLI-side decrypt into provider content blocks.

Shipped contract from [issue #814](https://github.com/slopus/happy/issues/814) and [PR #1067](https://github.com/slopus/happy/pull/1067):

| Decision | Happy’s choice | Tradeoff vs Pi Remote |
|---|---|---|
| Limits | Up to **20 images / message**, **10 MB each** | 20×10 MB over a phone tailnet will stall JSON/WebSocket; OpenCode already dies at ~1 MB inline ([anomalyco/opencode#21817](https://github.com/anomalyco/opencode/issues/21817)) |
| Upload timing | Start upload **on attach**, not on send | Fast send; abandoned drafts leak blobs unless TTL/session-delete exists |
| Storage | Presigned **S3** (prod) or local fs (dev); server never sees plaintext; **no DB rows** | S3 is the wrong threat model here (private tailnet, fail-closed, no cloud). Local-fs-on-relay is closer |
| Crypto | Client-side NaCl `crypto_secretbox` (XSalsa20-Poly1305); thumbhash in the `file` event | Extra crypto is redundant on Tailscale HTTPS; thumbhash is the useful bit for redacted transcript |
| Wire | Session `file` event, then text; old CLIs ignore unknown events | Pi Remote cannot ignore unknown keys — `isPromptSubmitCommand` fail-closes |
| iOS HEIC | [#1409](https://github.com/slopus/happy/commit/645b5aa59c2fbe32563c81ea5737325ced2b634d) **normalizes picker assets to JPEG** because Codex sniffs magic bytes and skips non PNG/JPEG/GIF/WebP | Mandatory. Anthropic also rejects HEIC ([anthropic-sdk-python#1589](https://github.com/anthropics/anthropic-sdk-python/issues/1589)); Claude Code has a **session-breaking HEIC bug** ([anthropics/claude-code#16169](https://github.com/anthropics/claude-code/issues/16169)) |
| Failure | Failed attachments are **non-fatal**; text still sends | Compatible with fail-closed *upload*, fail-open *turn* |
| Image-only | Codex path supports image-only turns (no fake empty text) | Conflicts with current `message.trim().length > 0` |
| Rejected simpler design | Maintainer first proposed `writeFile` RPC into `~/.happy/attachments/` with paths in the prompt | Path-in-text is what Codex often **cannot** see ([openai/codex#2085](https://github.com/openai/codex/discussions/2085)); vision needs explicit image blocks |

Happy’s discarded `writeFile`-into-workdir idea is exactly agent-dashboard’s shipped mobile path (below). Happy abandoned it because (a) web/mobile cannot preview without a second read RPC, (b) no TTL, (c) Claude needs multimodal blocks, not a path.

### 1.3 Closest PWA analog: HAPI (`tiann/hapi`) — remote-control PWA that already lists Pi

HAPI is a Web / PWA / Telegram Mini App that remote-controls Claude Code, Codex, Cursor Agent, OpenCode, Kimi, **and Pi** ([README](https://github.com/tiann/hapi), [agents.md](https://github.com/tiann/hapi/blob/main/docs/guide/agents.md)). Attachment API ([docs](https://tiann-hapi.mintlify.app/api/sessions)):

1. `POST /api/sessions/:id/upload` — JSON `{ filename, content: base64, mimeType }`, **max 50 MB**, returns `{ path }` (e.g. `/tmp/hapi-upload-abc123-screenshot.png`).
2. `POST /api/sessions/:id/messages` — `{ text, attachments: [{ id, filename, mimeType, size, path, previewUrl? }] }`.
3. Android-only **Web Share Target** seeds the same composer ([PR #933](https://github.com/tiann/hapi/pull/933)). **iOS Safari does not implement `share_target`** ([firt.dev iOS PWA table](https://firt.dev/notes/pwa-ios); [WebShareAPI.com matrix](https://www.webshareapi.com/web-share-target-api/registering-a-web-share-target/)).

Tradeoffs: 50 MB JSON-base64 is a known footgun (33% inflation; OpenCode web becomes unresponsive at ~1 MB inline). Preview URL plus host path is the right *split* (UI vs agent), but dumping into `/tmp` with no EXIF policy and trusting client `mimeType` is weaker than Happy’s magic-byte sniff and OpenClaw’s EXIF strip.

### 1.4 Native iOS analog that already speaks Pi: Paseo (`getpaseo/paseo`)

Paseo is an Expo iOS/Android/web client for Claude Code, Codex, Copilot, OpenCode, **and Pi**, with a local daemon ([README](https://github.com/getpaseo/paseo)). Composer ([`packages/app/src/composer/index.tsx`](https://github.com/getpaseo/paseo/blob/860fcb2e/packages/app/src/composer/index.tsx)):

- **Raster images** go through `pickImages` → persist blob locally → `addImages`.
- **Non-image files** go through `uploadFileAttachments` with `MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024` and a “file too large (50MB)” toast.
- Drop handling is composer-owned so JSON drops are not silently ignored ([PR #1750](https://github.com/getpaseo/paseo/pull/1750)).
- Upload is refused when the daemon client is disconnected (same guard OpenClaw later added).

Paseo is native (PhotoKit picker, no PWA `input`), so it is a UX/limit reference, not a copy-paste. The **image vs file split** is the load-bearing idea: images become vision blocks; other files become host paths. Pi Remote v1 should ship **images only** — that is what `ImageContent` and Anthropic/Codex accept.

### 1.5 Same-network analog: OpenClaw (`openclaw/openclaw`) — Tailscale + webchat camera/gallery

OpenClaw is a self-hosted gateway with WebChat, iOS/Android nodes, and documented Tailscale remote access ([docs](https://docs.openclaw.ai/), [remote.md](https://github.com/clawdbot/clawdbot/blob/84f5d7dc/docs/gateway/remote.md)). Attachment lessons that map 1:1 onto an iPhone PWA:

- **Two inputs, not one.** [PR #35524](https://github.com/openclaw/openclaw/pull/35524): paperclip → `accept="image/*"` + `multiple`; camera → `capture="environment"`; drag-drop on desktop. MIME is re-checked with `file.type.startsWith("image/")` because browsers ignore `accept`. All three paths **no-op when disconnected**.
- **Image-only turns must not be treated as empty.** [Issue #24662](https://github.com/openclaw/openclaw/issues/24662): pasted images were dropped by an empty-text gate; fix treats `opts.images` as media.
- **Capability gate fail-closed.** Gateway rejects images when the active model’s catalog lacks image input (`UnsupportedAttachmentError`), with shims for `claude-cli` / `google-gemini-cli` ([PR #92892](https://github.com/openclaw/openclaw/pull/92892), [issue #91739](https://github.com/openclaw/openclaw/issues/91739)). OpenCode has the same trap: custom providers strip images unless `modalities.input` includes `"image"` ([#20802](https://github.com/anomalyco/opencode/issues/20802)).
- **iOS must resize + strip EXIF before the wire.** [PR #73710](https://github.com/openclaw/openclaw/pull/73710): 12–48 MP camera rolls blow a 5 MB budget; they resize to 1600 px long-edge, JPEG q=0.8 with fallback to a 3.5 MB budget, and **verified GPS/Make/Model/DateTimeOriginal are absent** (`exiftool` empty). Share Extension later used 2560 px / 5 MB ([PR #103860](https://github.com/openclaw/openclaw/pull/103860)).
- **Advertise limits at handshake.** [PR #116188](https://github.com/openclaw/openclaw/pull/116188): `hello-ok.policy.attachments = { maxBytes, maxImageBytes }`. Trap they document: a 20 MB decoded file is ~26.7 MB base64 and exceeds a 25 MiB WebSocket frame. Default decoded cap is **20 MB**, with a separate **6 MiB image hard cap** ([`chat-attachments.ts`](https://github.com/openclaw/openclaw/blob/b8ed2c32/src/gateway/chat-attachments.ts)).
- **Offload vs inline.** Large or non-image attachments are written to a host path (`Read`/`Bash`) instead of inlined as `ImageContent`. Text-only models get a bounded offload, not a silent drop.

OpenClaw’s Gemini CLI backend prestages images as workspace `@path` (`imageArg: "@"`, `imagePathScope: "workspace"`). That is a **tool-read** path, not a vision path. Pi Remote should not copy `@path` as the primary lane: Codex often cannot see path-only images ([discussion #2085](https://github.com/openai/codex/discussions/2085)); pi-mono already has first-class `ImageContent`.

### 1.6 The agent itself: pi-mono already solved conversion, size, and EXIF orientation

Do not invent a new image pipeline. Upstream coding-agent already:

- Accepts only PNG/JPEG/GIF/WebP after sniff; anything else is converted to PNG or omitted ([`image-process.ts`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/utils/image-process.ts)).
- Resizes to **2000×2000** and **4.5 MB of base64** (headroom under Anthropic’s 5 MB partner limit), JPEG quality 80 with stepwise quality + dimension fallback ([`image-resize-core.ts`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/utils/image-resize-core.ts)).
- Applies **EXIF orientation** before resize (`applyExifOrientation`).
- Injects a coordinate-mapping hint when resized: `[Image: original WxH, displayed at wxh. Multiply coordinates by S…]`.
- Web UI `MessageEditor`: `maxFiles = 10`, `maxFileSize = 20 MB`, `acceptedTypes` includes `image/*` plus documents ([MessageEditor.ts](https://github.com/badlogic/pi-mono/blob/efc58fed/packages/web-ui/src/components/MessageEditor.ts)). Documents are **text-extracted**, not native `DocumentContent` ([issue #204](https://github.com/badlogic/pi-mono/issues/204)).

Anthropic’s current vision contract ([platform.claude.com/docs vision](https://platform.claude.com/docs/en/build-with-claude/vision)): JPEG/PNG/GIF/WebP only; animations → first frame; max **8000×8000**; **10 MB** base64 on the Claude API / claude.ai, **5 MB** on Bedrock/Vertex; up to 600 images/request but 32 MB request cap; **images before text** performs best. Claude consumer app chat uploads are a different product (500 MB / 20 files) ([Claude Help](https://support.claude.com/en/articles/8241126-upload-files-to-claude)) — **do not copy those numbers** into a coding-agent relay.

Codex CLI: PNG/JPEG/GIF/WebP; community guidance **&lt; 5 MB**; HEIC/SVG/TIFF unsupported ([Inventive HQ](https://inventivehq.com/knowledge-base/openai/how-to-use-image-input)). Happy’s Codex path converts iOS HEIC → JPEG and sniffs magic bytes.

### 1.7 Other GitHub clients — patterns worth stealing, not cloning

**Worktree drop (vision-unsafe).** [bjornjee/agent-dashboard#352](https://github.com/bjornjee/agent-dashboard/pull/352): mobile PWA `+` was hidden because desktop used `osascript "choose file"` on the host. Mobile now uses `<input type="file">` + `POST /api/agents/{id}/upload` streaming into `<worktree>/.uploads/<ts>-<name>`: **50 MB**, **image-only via `http.DetectContentType`**, sanitized filename, CSRF 403, 415 non-image, 413 oversize. Cleanup is worktree-scoped. Composer inserts an **absolute host path**. This is excellent host hygiene and a terrible vision path (same Codex “paste the image, don’t give me a path” failure).

**Encrypted public blob (wrong network).** [JeroenOnNostr/codedeck](https://github.com/JeroenOnNostr/codedeck): Android/desktop Tauri client for Claude Code over **NIP-44 Nostr**, images via **AES-256-GCM Blossom** with base64 relay fallback. QR pairing (like Pi Remote enrollment). Blossom `PUT /upload` is content-addressed and must not modify bytes ([BUD-02](https://github.com/hzrd149/blossom/blob/master/buds/02.md)). Useful idea: **ciphertext as `application/octet-stream` so the store never sees plaintext MIME**. Unnecessary on a tailnet; keep the “relay never sees pixels” invariant by not persisting pixels at all.

**OpenCode file parts.** [`FilePart`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/session/message.ts) = `{ type: "file", mime, filename?, url }` (often a data URL). [PR #30153](https://github.com/anomalyco/opencode/pull/30153) saves data-URLs to disk **before** the model so a non-vision model still has a path. Warning: inlining ~1 MB already wedges the web UI ([#21817](https://github.com/anomalyco/opencode/issues/21817)).

**Goose desktop.** [block/goose ChatInput](https://github.com/block/goose/blob/58f3cc9e/ui/desktop/src/components/ChatInput.tsx) + [PR #8534](https://github.com/aaif-goose/goose/pull/8534): `MAX_IMAGES_PER_MESSAGE`, compress-on-paste, **20 MB** path-encode guard, attachment-only send, explicit error chips that auto-dismiss.

**LibreChat.** Per-MIME routing: `image/*` and PDF → provider; else text extract or none ([PR #12626](https://github.com/danny-avila/LibreChat/pull/12626)). Configured `fileLimit` / `fileSizeLimit` / `supportedMimeTypes` ([discussion #8172](https://github.com/danny-avila/LibreChat/discussions/8172)). Pi Remote should advertise the same three numbers from the relay, not hardcode them in the PWA.

**Kimi Code CLI (target bar, GitHub: `MoonshotAI/kimi-cli`).** Not a mobile client. Images/video paste via Ctrl-V; UI shows `[image:id,WxH]`; bytes live in an `AttachmentCache` and expand only on submit ([interaction docs](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html), [placeholders.py](https://github.com/MoonshotAI/kimi-cli/blob/8283d785/src/kimi_cli/ui/shell/placeholders.py)). Gated on model `image_in` / `video_in`. History stores the placeholder, not the bytes. **This is the redaction pattern to copy:** transcript shows a token; the model sees bytes; the store never does. Kimi consumer app: mobile `+` → 文件 / 照片 / 本地文件 / 微信文件; files ≤ 100 MB, ≤ 50 files ([Kimi help](https://www.kimi.com/zh-cn/help/new-user-guide/overview)) — again, consumer limits, not agent limits.

### 1.8 iPhone PWA constraints (the picker is WebKit, not PhotoKit)

A standalone PWA cannot embed `PHPickerViewController`. It gets WebKit’s `WKFileUploadPanel`, which *does* present the out-of-process Photos picker ([WebKit `WKFileUploadPanel.mm`](https://github.com/WebKit/webkit/blob/master/Source/WebKit/UIProcess/ios/forms/WKFileUploadPanel.mm); [WebKit PR #4886](https://github.com/WebKit/WebKit/pull/4886) migrating library selection to PHPicker). Apple’s privacy model: the picker runs out of process; the app/PWA receives **only selected assets**; **no Photos Library permission prompt** ([Selecting Photos and Videos in iOS](https://developer.apple.com/documentation/photokit/selecting-photos-and-videos-in-ios); WWDC 2020/2023/2025). That is the correct privacy posture — do not ask for full library access; do not ship a custom gallery.

Concrete WebKit/Safari facts:

- `accept="image/*"` without `capture` → action sheet: Photo Library / Take Photo / Choose File ([Apple Forums](https://developer.apple.com/forums/thread/734219)).
- `capture="environment"` **skips the sheet and opens the camera** (HTML `capture` attribute). OpenClaw therefore uses **two inputs**. One input cannot be both “Claude Photos” and “Claude Camera.”
- Trigger must be a **user gesture**. Hidden `display:none` inputs are flaky; the enrollment screen’s `<label>…<input type="file"></label>` pattern is the proven in-repo technique.
- `multiple` is supported on the library picker.
- Safari often transcodes HEIC toward a “compatible” JPEG (`PHPickerConfigurationAssetRepresentationModeCompatible` in WebKit). **Do not trust that.** Happy still converts; Claude Code still dies on leftover HEIC.
- Safari **strips GPS EXIF on web upload** as a privacy feature ([Ask Different](https://apple.stackexchange.com/questions/326789/gps-exif-from-iphone-photo-upload-in-safari)). OpenClaw still re-encodes because **Make/Model/timestamp and orientation** can survive, and 48 MP still blows size caps.
- File System Access API: public FS **unsupported** on iOS; OPFS exists since 15.2 ([firt.dev](https://firt.dev/notes/pwa-ios)). No drag-drop from Photos into a standalone PWA.
- Web Share Target: **unsupported on iOS** (same source). HAPI’s share-sheet flow is Android-only. Outbound `navigator.share` exists (iOS 12.1 / 15.0) and is irrelevant to ingest.
- Live Photos: the file input yields a still (usually JPEG), not the paired video. Video is out of scope unless you adopt Kimi’s `video_in` (pi has no `VideoContent`).

### 1.9 Target-bar UX (Claude iOS / Kimi) mapped onto this composer

Claude iOS ([Help: upload](https://support.claude.com/en/articles/8241126-upload-files-to-claude), [iOS intents](https://support.claude.com/en/articles/10263469-using-claude-app-intents-shortcuts-and-widgets-on-ios), [Mobbin flow “Chatting with Claude (image input)”](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1)):

- `+` at lower-left of the composer (not a competing paperclip).
- Menu: **photos / camera / files**.
- Selected image appears as a preview chip **in the composer**, then as an inline image on the user turn.
- Separate OS-level “Analyze Photo with Claude” control — **not available to a PWA**.

Kimi mobile help: `+` → 上传文件、照片、本地文件、微信文件 ([overview](https://www.kimi.com/zh-cn/help/new-user-guide/overview)).

Pi Remote already put mode + slash commands behind `+` (`aria-label="Mode and commands"`). Claude’s bar is **+ = attach + tools**. The prior-art move is to **put Photos and Camera as the first two rows of the existing popover**, not to add a second 44 pt control that fights the send button on a 320 px width.

### 1.10 What prior art agrees on (and where Pi Remote must diverge)

Agreed across Happy, OpenClaw, Paseo, HAPI, Goose, pi-mono:

1. Attach is capability-gated (hide if disconnected or model has no image input).
2. Validate **magic bytes**, not `file.type`.
3. Convert HEIC → JPEG/PNG **before** the agent.
4. Resize on the client (or host) to a few megabytes; do not ship 48 MP.
5. Preview in composer; allow remove before send.
6. Do not persist raw bytes in the chat log.

Diverge from the crowd:

- **No S3, no Blossom, no `/tmp` as source of truth.** Tailscale + ticketed relay. Bytes are a one-shot RPC field.
- **No 50 MB JSON body.** Match pi-mono’s 4.5 MB encoded / 2000 px, not HAPI/Paseo consumer caps.
- **No path-only primary lane.** Pi already has `images?: ImageContent[]`.
- **No extra paperclip.** Reuse `+`.
- **Exact-key protocol.** Any new field is a versioned, guarded change — not a silent extra JSON key.

---

## 2. Concrete spec contribution a build phase can execute

### 2.1 Product rule

v1 attaches **raster images only** (gallery + camera) into the existing composer, delivers them to Pi as `PromptCommand.images`, and shows a **redacted attachment chip** in the durable transcript. PDFs, video, WeChat files, and Share-Target ingest are non-goals.

### 2.2 Composer UX (iPhone PWA, ink-on-parchment)

**Affordance**

- Keep the existing 44×44 `composer-plus` (`aria-label` becomes **“Attach and session tools”**).
- First section of the popover, above Mode:

| Row | Control | Hidden input | Notes |
|---|---|---|---|
| Photos | `react-aria` `Button` wrapping / labelling input A | `<input type="file" accept="image/*" multiple>` **no `capture`** | Opens Photos / Files sheet |
| Camera | Same pattern, input B | `<input type="file" accept="image/*" capture="environment">` | Rear camera; no library |

Reuse the enrollment `<label>…<input>` gesture pattern. Do **not** `display:none` the inputs; visually clip them (`sr-only` / opacity-0 + 1×1 in the label). `onPress` → `input.click()` is a second-choice fallback and must run synchronously in the tap handler (OpenClaw / Safari gesture rule).

Do not render Photos/Camera when `connection !== 'live'` or `awaitingSnapshot` or the runtime catalog’s selected model `input` lacks `"image"` (OpenClaw/OpenCode gate). No greyed fake rows (existing council rule).

**Composer preview (draft, originating device only)**

- Horizontal chip row **above** the textarea, inside `.composer-tray`, max height 72 px, scroll-x if overflow.
- Each chip: 56×56 bone (`#f8f8f6`) tile, 8 px radius, 1 px carbon hairline, object-fit cover from `URL.createObjectURL(file)` (revoke on remove/send/unmount).
- Remove: 24×24 clay (`#d97757`) “×” in the top-right, 44×44 hit slop, `aria-label="Remove {filename}"`.
- Overlay states: `Preparing…` / `Too large` / `Unsupported format` as 11 px Inter on a 40% carbon scrim. Failed chips stay until dismissed (Goose), and **do not block** sending remaining valid chips + text (Happy non-fatal).
- Count badge on `+` when `n > 0` (e.g. “2”) — 16 px Inter medium, clay fill, bone text.

**Send gating**

- `canSubmit` = live + (non-empty trimmed text **OR** ≥1 ready attachment) + not sending.
- Image-only is legal (Happy Codex, OpenClaw #24662). Protocol change required (below).
- While `status === 'running'`, attachments ride **steer** the same as text (`streamingBehavior: 'steer'`). Follow-up (“Later”) may include attachments.

**Transcript (all devices)**

- Do **not** persist `ImageContent.data`.
- New optional block (exact-key, fail-closed):

```ts
interface UserAttachmentBlock extends TranscriptBlockBase {
  readonly kind: 'user_attachment';
  readonly role: 'user';
  readonly filename: string;          // sanitized, ≤ 80 chars
  readonly mimeType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
  readonly byteLength: number;        // post-process size
  readonly width: number;
  readonly height: number;
  readonly sha256: string;            // hex of processed bytes
  readonly redacted: true;            // literal
}
```

- Render: 56×56 parchment tile with a document/image glyph (not the photo), filename + `{width}×{height} · {kb} KB` in 12 px Inter, carbon ink. Originating device **may** additionally show the still-in-memory blob preview for the current session tab only; reload / other device = glyph only (Happy’s cross-device gap, accepted for v1).
- Place the chip **above** the user text bubble (Claude / council-gpt-sol: attachments sit with the owning turn).
- Redaction projector: if any future host echo includes `data:` URLs or base64 image payloads, strip to `[REDACTED_IMAGE]` and increment `fieldsRedacted` with reason `image-bytes` (extend [`redaction.ts`](apps/pi-remote-relay/src/store/redaction.ts)).

**Motion**

- Chip enter: 140 ms opacity + 8 px translateY, `ease-out`. No spring.
- Remove: 100 ms fade. Send morphs on the existing circular primary (no extra spinner on `+` — spinner lives on the chip overlay).

**A11y (react-aria + WCAG AA)**

- Photos/Camera are real `Button`s, not clickable divs.
- Popover `Dialog` `aria-label="Attach and session tools"`.
- Chip list `role="list"` / items `role="listitem"`.
- `aria-live="polite"` region: “2 photos ready”, “Photo rejected: HEIC could not be converted.”
- Contrast: carbon on bone; clay on bone for destructive × (verify 4.5:1). Dark theme: invert to ink-on-charcoal already in the DS.
- VoiceOver: filename, not “image”.
- Focus order: `+` → chips (remove) → textarea → Later → Send.

### 2.3 Client processing (before any mutation)

Run on pick, not on send (Happy), on a worker/`createImageBitmap` path so the composer stays live (OpenClaw off-MainActor):

1. **Hard reject** if `file.size > 12_000_000` (raw). Toast: “Photo is too large to attach.”
2. Read as `ArrayBuffer`. Sniff magic: JPEG `FF D8 FF`, PNG `89 50 4E 47`, GIF `GIF8`, WebP `RIFF….WEBP`.  
   - `ftypheic` / `ftypmif1` / `ftypmsf1` → convert.  
   - SVG/XML, PDF `%PDF`, ZIP `PK` → reject (XSS / polyglot).  
   - Trust **sniff**, ignore `file.type` (Happy #1409, agent-dashboard `DetectContentType`).
3. Draw via `createImageBitmap` + canvas (or `OffscreenCanvas`). Re-encode **JPEG quality 0.8**, max long edge **2000 px** (pi-mono default; stricter than OpenClaw iOS 1600/2560 but matches the host). If still > **4.5 MB base64**, drop quality 0.7 → 0.55 → 0.4 then shrink 0.75× (copy pi-mono). Failure → chip error, do not send those bytes (Claude Code HEIC session-break).
4. Output `{ mimeType: 'image/jpeg' | 'image/png', data: base64, width, height, byteLength, sha256, filename }`. PNG only if the source was PNG **and** it already fits; camera/HEIC always JPEG.
5. Cap **4 ready images** in v1 (Happy’s original web cap; Claude iOS is visually 1–4; 20 is a desktop number). 5th pick replaces with an error chip.

Do not ship `heic2any` (~1.3 MB) until canvas conversion fails in TestFlight-on-Safari; WebKit compatible mode often already yields JPEG.

### 2.4 Security / upload / how bytes reach Pi

**Do not add a durable blob store.** Happy S3, Codedeck Blossom, HAPI `/tmp`, and agent-dashboard `.uploads/` all exist because those products needed cross-device preview or tool-path access. Pi Remote’s relay already fail-closes extra fields and redacts before persist. Bytes are a **one-use, ticketed prompt field**.

**Protocol (exact, fail-closed)**

Extend `PromptSubmitCommand`:

```ts
readonly images?: readonly ImageContent[]; // max 4, each data base64, mimeType allowlisted
```

Guard changes:

- Add `'images'` to `PROMPT_SUBMIT_KEYS`.
- `isImageContent`: `type === 'image'`, `mimeType ∈ {image/jpeg,image/png,image/gif,image/webp}`, `data` is base64 with decoded size `1…4_718_592` (4.5 MB), no extra keys.
- Submit is valid iff `message.trim().length > 0` **OR** `images.length ≥ 1`.
- Max 4 images. Duplicate `sha256` in one submit → 422.

HTTP: still `POST /api/prompt/submit` after `POST /api/auth/ticket`. No new public URL. Body stays JSON (consistent with HAPI) **but** bounded to ~6 MB encoded worst case (4 × 4.5 MB would be too much — **also cap total decoded base64 of the array at 4.5 MB**, i.e. 4 small screenshots or 1 large photo). Advertise `{ maxImages: 4, maxImageBytes: 4718592, maxTotalBytes: 4718592 }` on the existing runtime/hello snapshot (OpenClaw `hello-ok.policy.attachments`).

**Relay `PromptService.submitOne`**

```ts
supervisor.send({
  type: 'prompt',
  message: command.message,
  images: command.images,          // NEW — only after re-sniff on the host
  streamingBehavior: …
});
```

Host re-sniff + `processImage()` (pi-mono). If the host omits an image, the relay still commits the user text + `user_attachment` chips for **accepted** images only, and returns `422` with `rejected: [{ index, reason }]` if **all** images fail. Never write `data` to `RelayStore`. `projectSubmittedPrompt` emits text (if any) plus N `user_attachment` blocks. Idempotency key remains `submissionId`; the replay check must hash `message + image sha256s`, not message alone.

**Plan mode.** Attachments are still a prompt, not a file write. They do not bypass host plan mode. Do not add a worktree write in v1 (that would be a second mutation class). If a future “save to repo” is needed, it is a separate ticketed `runtime.control` / tool approval.

**Auth.** Same device session + one-use ticket as today’s prompt. No anonymous multipart. CSRF is the ticket.

**Do not** send images over the WebSocket snapshot channel.

### 2.5 Visual / motion tokens (locked DS)

- Tray: bone, 24 px radius, 1 px carbon @ 12% (existing).
- Chip selected ring: clay 2 px.
- Dark: same radii; ink inverted per existing theme.
- No extra shadows, no neon, no emoji paperclip. Plus glyph stays the current stroke icon.

### 2.6 Acceptance (executable)

1. iPhone PWA, Photos: pick 1 HEIC → chip shows JPEG preview ≤ 2000 px; send; Pi receives `images[0].mimeType === 'image/jpeg'`; transcript has `user_attachment` **without** base64.
2. Camera: `capture="environment"` opens camera; photo attaches.
3. 5th image rejected; 4 remain.
4. SVG renamed to `.png` → 415/chip error (sniff).
5. Disconnected: Photos/Camera absent.
6. Text-only model: Photos/Camera absent (catalog gate).
7. Image-only send succeeds.
8. Extra JSON key on submit still 400.
9. Relay store / WS replay contains no `data:` / long base64.
10. Enrollment QR picker still works (regression).

---

## 3. Divergent / minority ideas worth considering

Resist the “plus + multipart + /tmp” convergence. These are real shipped alternatives:

1. **Kimi placeholder lane.** Keep `prompt.submit.message` as text-only; insert `[image:sha256,WxH]`; host expands from a 15-minute memory slot. Pros: zero protocol key change beyond a side cache; transcript *is* the placeholder. Cons: new cache; ticket must bind placeholder IDs; more moving parts than `images[]` which Pi already understands.

2. **Happy hybrid thumbnail.** Durable **thumbhash ~55 chars** on `user_attachment` for cross-device blurry preview; full bytes never stored. Small protocol add; Happy built this for a reason (phone checking a desktop session). Conflicts with “relay never sees pixels” only weakly (thumbhash is not the photo).

3. **Dual delivery (LibreChat / OpenCode #30153 / OpenClaw offload).** Vision models get `ImageContent`; simultaneously write processed bytes to a host-only `~/.pi-remote/attachments/<session>/<sha>.jpg` so tools can `Read` them later. Helps “open this screenshot in the repo.” It **is** a filesystem mutation — would need the same ticket + plan-mode gate as other writes. Do not sneak it in as a side effect of prompt.

4. **Agent-dashboard path-only.** Skip vision; insert a host path. Wrong for Claude/Codex screenshots; keep as a **v2 “Files” row** for logs/JSON, never for Photos.

5. **Codedeck / Happy E2E blob crypto.** Encrypt on the phone, decrypt on the host. On Tailscale this buys little against the relay operator (the relay *is* the host). Only justified if the relay is ever hosted off-machine.

6. **Two-phase presign even on localhost.** `POST /attachments/request-upload` → `PUT` raw bytes → `prompt.submit` with refs. Happy needed this for S3. On a phone it adds RTT and abandoned-blob GC. Consider only if JSON 4.5 MB bodies trip a reverse proxy.

7. **Separate Camera vs Photos as Claude-native first-class buttons** (not inside `+`). Matches some ChatGPT iOS layouts; burns 44 pt next to send. On 320 px this composer already has Later + Send. Prefer popover.

8. **Image-then-text reorder.** Anthropic: images before text perform better. The PWA can send `images[]` first in the Pi command regardless of chip order. Minority: let the user reorder chips (Kimi placeholders are editable in-text). Skip reorder in v1.

9. **GIF first-frame freeze on client.** Anthropic/Codex use frame 0. Explicitly re-encode frame 0 so a 12 MB GIF does not hit the cap.

10. **PWA “Share” as sender only.** iOS cannot receive Share Target; it *can* `navigator.share` a result. Irrelevant to ingest; do not spend design time on HAPI #933 for iPhone.

11. **Feature flag `expImageUpload` default off** (Happy). Matches this repo’s read-only-by-default culture: ship the UI behind a host capability bit in the runtime snapshot, default false until the prompt suite is green.

12. **Refuse JPEG that still contains an EXIF APP1 segment after canvas.** Canvas usually strips it; assert `FF D8` … no `Exif\0\0` needle (OpenClaw planted-needle tests). Cheap, high-signal.

---

## 4. Open questions + risks

1. **Does the selected Pi model advertise `input: ["text","image"]` on the existing runtime catalog?** If not, the attach rows must stay hidden or every turn 400s (OpenCode #20802, OpenClaw #91739). Confirm against `RuntimeModelCatalogDto`.

2. **JSON body size vs relay / Tailscale / Safari fetch.** 4.5 MB base64 is ~6 MB HTTP. Measure on a real iPhone 12 over tailnet; if Safari or the Node body parser dies, switch to multipart **with the same ticket** (agent-dashboard) without changing the Pi RPC.

3. **Idempotent retry vs bytes.** `submissionId` reuse currently compares `message` only. After images, a retried submit with different bytes must 409. Define the hash.

4. **Steer + images.** Host `SteerCommand` already has `images?`. Confirm the supervisor maps `streamingBehavior: 'steer'` + images. If not, v1 should disable attach while `status === 'running'`.

5. **Live Photos / Portrait / ProRAW.** What MIME does current iOS Safari actually hand a PWA? Needs a device matrix (HEIC, JPEG, `.photo` bundle). Until measured, keep the sniff + convert funnel.

6. **Canvas HEIC decode.** If `createImageBitmap` fails on leftover HEIC, either hide Camera/Photos with copy “Convert this photo to JPEG in Photos and retry” or add a bounded WASM decoder. Do not send raw HEIC (Claude Code #16169).

7. **Cross-device preview.** v1 glyph-only will look “broken” next to Claude iOS. Decide whether thumbhash (Happy) is in v1 or a known gap.

8. **Retention of processed bytes on the host process.** Even if the relay does not persist, Pi’s session history might. Confirm pi-mono session serialization does not write base64 to disk the phone can later sync. If it does, that is a host-side redaction issue, not a PWA one.

9. **Plan-mode screenshots of secrets.** A photo of a `.env` screen is still a secret. Redaction scanners that only look at strings will miss it. Mitigation: user-visible copy in the popover: “Photos are sent to Pi. They are not saved in this phone’s transcript.”

10. **WCAG for 56 px chips.** 56 visual / 44 hit is OK for remove; the tile itself is not a button. Do not make the preview a second tap target that re-opens Photos.

11. **Mobbin MCP was not callable in this pass** (no authenticated Mobbin tools). Claude iOS flow cited from the public Mobbin URL + Help Center, not from live MCP screens.

---

## 5. Sources

### GitHub — remote-CLI / coding-agent / mobile clients

- https://github.com/slopus/happy — mobile/web Claude Code + Codex client  
- https://github.com/slopus/happy/issues/814 — image upload design (S3 vs writeFile vs thumbnails, 20×10 MB)  
- https://github.com/slopus/happy/pull/1067 — encrypted upload, thumbhash, CLI decrypt  
- https://github.com/slopus/happy/commit/645b5aa59c2fbe32563c81ea5737325ced2b634d — Codex + iOS HEIC→JPEG + magic-byte sniff  
- https://github.com/slopus/happy/pull/991 — web paste + 3-day TTL (superseded storage)  
- https://github.com/tiann/hapi — PWA remote-control (includes Pi)  
- https://github.com/tiann/hapi/blob/main/docs/guide/agents.md  
- https://tiann-hapi.mintlify.app/api/sessions — `POST /upload` 50 MB JSON-base64  
- https://github.com/tiann/hapi/pull/933 — Web Share Target (Android)  
- https://github.com/getpaseo/paseo — iOS/Android/web daemon client (includes Pi)  
- https://github.com/getpaseo/paseo/blob/860fcb2e/packages/app/src/composer/index.tsx — 50 MB, image vs file split  
- https://github.com/getpaseo/paseo/pull/1750 — composer-owned drops  
- https://github.com/openclaw/openclaw  
- https://github.com/openclaw/openclaw/pull/35524 — attach + camera + drop, disconnect + MIME guards  
- https://github.com/openclaw/openclaw/issues/24662 — image-only empty-turn bug  
- https://github.com/openclaw/openclaw/pull/73710 — iOS resize + EXIF strip (verified)  
- https://github.com/openclaw/openclaw/pull/103860 — Share Extension 2560 px / 5 MB  
- https://github.com/openclaw/openclaw/pull/116188 — advertise attachment limits on hello  
- https://github.com/openclaw/openclaw/blob/b8ed2c32/src/gateway/chat-attachments.ts — 20 MB / 6 MiB image cap  
- https://github.com/openclaw/openclaw/pull/92892 — fail-closed image capability gate  
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/cli/file-processor.ts  
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/utils/image-process.ts  
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/utils/image-resize-core.ts — 2000×2000, 4.5 MB base64  
- https://github.com/badlogic/pi-mono/blob/efc58fed/packages/web-ui/src/components/MessageEditor.ts — max 10 files / 20 MB  
- https://github.com/badlogic/pi-mono/issues/204 — document extraction vs ImageContent  
- https://github.com/JeroenOnNostr/codedeck — Blossom AES-256-GCM attachments, QR pairing  
- https://github.com/JeroenOnNostr/codedeck-bridge-vscode — decrypt on the Claude Code host  
- https://github.com/hzrd149/blossom/blob/master/buds/02.md — `PUT /upload`  
- https://github.com/bjornjee/agent-dashboard/pull/352 — PWA upload to worktree, DetectContentType, CSRF  
- https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/session/message.ts — FilePart  
- https://github.com/anomalyco/opencode/issues/20802 — modalities.input image gate  
- https://github.com/anomalyco/opencode/issues/21817 — ~1 MB upload stalls web UI  
- https://github.com/anomalyco/opencode/pull/30153 — save data-URL to disk before model  
- https://github.com/block/goose/blob/58f3cc9e/ui/desktop/src/components/ChatInput.tsx  
- https://github.com/aaif-goose/goose/pull/8534 — 20 MB image encode guard  
- https://github.com/danny-avila/LibreChat/pull/12626 — per-MIME delivery  
- https://github.com/danny-avila/LibreChat/discussions/8172 — fileConfig limits  
- https://github.com/MoonshotAI/kimi-cli/blob/8283d785/src/kimi_cli/ui/shell/placeholders.py  
- https://github.com/MoonshotAI/kimi-cli/pull/1430  
- https://github.com/openai/codex/discussions/2085 — path vs explicit image attach  
- https://github.com/anthropics/claude-code/issues/16169 — HEIC breaks sessions  
- https://github.com/anthropics/anthropic-sdk-python/issues/1589 — no HEIC on Vision API  
- https://github.com/WebKit/webkit/blob/master/Source/WebKit/UIProcess/ios/forms/WKFileUploadPanel.mm  
- https://github.com/WebKit/WebKit/pull/4886 — PHPicker + location-metadata question  

### Official docs / HIG / platform

- https://platform.claude.com/docs/en/build-with-claude/vision — JPEG/PNG/GIF/WebP, 10 MB / 5 MB, 8000 px, images-before-text  
- https://support.claude.com/en/articles/8241126-upload-files-to-claude — `+` → Add files or photos  
- https://support.claude.com/en/articles/10263469-using-claude-app-intents-shortcuts-and-widgets-on-ios  
- https://www.kimi.com/zh-cn/help/new-user-guide/overview — mobile `+` photos/files  
- https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html — `[image:id,WxH]`, `image_in`  
- https://www.kimi.com/code/docs/en/kimi-code-cli/reference/keyboard.html  
- https://docs.openclaw.ai/  
- https://developer.apple.com/documentation/photokit/selecting-photos-and-videos-in-ios  
- https://developer.apple.com/videos/play/wwdc2020/10652/  
- https://developer.apple.com/videos/play/wwdc2023/10107/  
- https://developer.apple.com/videos/play/wwdc2025/246/ — PhotosPicker, no library permission  
- https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture  
- https://developer.apple.com/forums/thread/734219 — capture skips library sheet  
- https://firt.dev/notes/pwa-ios — `share_target` ❌, file input ✅  
- https://www.webshareapi.com/web-share-target-api/registering-a-web-share-target/ — iOS Safari no Share Target  
- https://apple.stackexchange.com/questions/326789/gps-exif-from-iphone-photo-upload-in-safari  
- https://inventivehq.com/knowledge-base/openai/how-to-use-image-input — Codex formats / ~5 MB  

### Mobbin

- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 — Claude iOS “Chatting with Claude (image input)”  

### This repo (current state)

- `apps/pi-remote-web/src/SessionComposer.tsx` — `+` tools popover, no attach  
- `apps/pi-remote-web/src/App.tsx` — enrollment-only `input type="file"`  
- `apps/pi-remote-web/src/relay.ts` — ticketed `prompt.submit` text-only  
- `apps/pi-remote-relay/src/prompt/prompt-service.ts` — forwards `message` only  
- `packages/pi-rpc-protocol/src/types.ts` — host `images?` vs phone submit; no attachment transcript kind  
- `packages/pi-rpc-protocol/src/guards.ts` — exact-key + non-empty message  
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md` — no dead attach affordance  
- `docs/design-reference/mobile-chat-apps/research-gpt-luna.md` — Claude/Kimi composer measurements
