<!-- provenance: external-CLI orchestration pass; original file iter-14-deepseek.md -->
> **Source pass 14** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-14-deepseek.md`.

<!-- F5-media-upload | model=deepseek | lens=prior-art-github | iter 14/15 | 2026-08-15T19:59:53.803Z -->

Found strong GitHub leads. Now pulling primary sources to ground claims.
DuckDuckGo blocked; switching to Bing and targeted fetches.
Bing is noise. Pivoting to direct, authoritative fetches for the remaining claims.
Vision API limits verified from Anthropic docs. Now grounding the remaining repo/docs claims.
# Deep-Research Pass 14/15 — Lens: `prior-art-github`
**Feature:** Pi Remote → upload media from iOS gallery/camera into the chat, security-safe path to `pi`.
**Stack constants honored:** React 19 + Vite + Tailwind 4 + react-aria-components PWA, iOS Safari/standalone, ink-on-parchment + clay accent, WCAG AA, read-only-by-default, one-use-ticket + revision-checked fail-closed mutations, redaction everywhere.

---

## 1. Findings — prior art on GitHub (remote-CLI / agent chat → mobile)

### 1.1 You are not building in a void: this pattern exists, and is heavily starred

Direct prior art for "drive a terminal coding agent from a phone browser":

| Repo | Stars* | What it does | Tradeoffs for Pi Remote |
|---|---|---|---|
| `agent-of-empires/agent-of-empires` (MIT) | ~3.1k | TUI + **installable web dashboard PWA** to monitor/control Claude Code, OpenCode, Codex, Cursor, Gemini, Copilot, **Pi.dev**, **Kimi Code**, etc. Mobile-first "structured view" via ACP: plan panels, tool-call cards, **swipe-to-approve**. `R` in TUI → dashboards over HTTPS with **QR + passphrase auth via Tailscale Funnel or Cloudflare Tunnel**. tmux-persisted sessions, browser PWA push. | Closest philosophical match (Tailscale transport, PWA, approval UX). **No media/composer lane** — attachments are text/file refs, nothing touches the camera. Model for transport + swipe-to-approve, not for media. |
| `dcouple/Pane` (AGPL) | ~384 | "Run any coding agent, on any OS, from **desktop or phone**." Remote Pane = self-hosted host (repos/terminals/git/files/credentials); client connects with a `pane-remote://` code; browser app at runpane.com/app. Terminal-first, "no abstractions". | Confirms phone-as-thin-client over a host is viable. Reinforces *host owns compute & bytes, phone owns input*. No composer/attach; raw terminal stream instead of a chat transcript. |
| `siteboon/claudecodeui` (Cloud CLI UI) | ~13.3k | **Desktop + mobile responsive web UI** for Claude Code, Cursor CLI, Codex: chat, integrated terminal, file explorer, git explorer, session resume. | Largest-starred proof that mobile web chat control of CLI agents is a mainstream want. Text chat only; no camera/gallery input; files arrive via file tree, not composer. |
| `The-Vibe-Company/companion` | ~2.4k | Fleet launcher + UI; agents reachable **through Tailscale**; Open WebUI as shared chat surface. | Reinforces Tailscale-as-private-transport posture (Pi Remote already fixed to tailnet). |
| `stablyai/orca` / `milisp/codexia` | ~46k / ~883 | Agent-fleet ADEs and Codex/Claude-Code workstations, desktop, with remote control. | Desktop-affordance baselines for "approve this tool call", not mobile media. |

*Counts from GitHub API at research time; use as relative signal only.

**Takeaway:** every serious prior-art project keeps the **host as the authority and the phone as an input device**, authenticated out-of-band (QR, passphrase, `pane-remote://`). None yet ships camera/gallery attach into an agent chat — this is the open slot. Pi Remote stitching an upload lane onto this pattern is *new*, not commoditized.

### 1.2 iOS terminal clients define the gesture + focus language

- **`blinksh/blink` (~6.9k★)** — "first professional, desktop-grade terminal for iOS." Must-verify for a PWA composer: **full-screen UI**, **swipe to move between connections, slide down to close, pinch to zoom**, Mosh for always-on over mobile networks, SplitView for side-by-side, and file management via bundled `curl`/`scp`/`sftp`. Tradeoff for us: raw shells make "attach a photo" a *path you type*, which is exactly the friction the composer removes.
- **`holzschu/a-shell` (~3.9k★)** — open-source iOS terminal with **file picker + Photos access** bridging to its shell; demonstrates that even on iOS, document/photo-picker interop is solvable — and is the open-source reference for the "picker → bytes" seam.

### 1.3 The agent side: how images actually reach coding agents (the byte lane)

This is the strongest prior-art cluster — five open-source agents already solved "bytes → model" and expose their limits as source:

1. **Aider (`aider-ai/aider`)** — images are *files in chat*: `/add <image-filename>`, `/paste` (clipboard), `aider <image-file>` at launch. No resize policy documented in the CLI; users are told to downsample. (Aider docs, *Images & web pages*.)
2. **Codex CLI (`openai/codex`)** — the most instructive file in the tree: `codex-rs/core/src/image_preparation.rs`. It does **client-side image preparation** with hard limits: *high-detail* → max dimension **2048 px / 2500 patches**; *unified* → **6000 px / 10 000 patches**, and crucially **fails closed with explicit placeholders**: `"image content omitted because it exceeded the supported size limit; use a smaller image"`, `"image content omitted because it could not be processed"`, `"remote image URLs are not supported"`. It also ships a `view_image` tool and image detail modes in the app-server protocol (`codex-rs/core/src/tools/handlers/view_image.rs`). **Model for our redaction/size policy text.**
3. **Kimiflare / Kimi Code (`sinameraji/kimiflare`)** — the "Kimi Code" target bar is real: Kimi K3 harness documents **image understanding: drop image paths (PNG, JPG, WebP, GIF, BMP up to 5 MB)** into any prompt, and a **`plan` mode that is a whitelist of read-only tools** (read/glob/grep/web) with writes/edits/mutating bash blocked — the exact posture Pi Remote's host/extension plan-mode requires. (`Leechael/pi-provider-kimi-code` proves Kimi-Code-plan reuse inside pi itself.)
4. **gptme (`gptme/gptme`, 4.4k★)** — has a `vision` tool ("can see images referenced in prompts, screenshots of your desktop"), a `screenshot` tool, and a `tmux` tool for persistent terminal sessions — evidence that agent-side image input is generic, so the Pi Remote side must only decide *file reference vs. base64*.
5. **Claude Code (`anthropics/claude-code`)** — images enter as file references/paths in a terminal agent (repo README; docs sitemap confirms no inline-attach docs page). Its model-side contract is what bounds our upload: Anthropic vision API accepts `image` content blocks (base64 / URL / Files-API `file_id`), **JPEG/PNG/GIF/WebP only (no HEIC)**, ≤ **10 MB base64 API / 5 MB Bedrock·GCloud / 10 MB claude.ai**, 8000×8000 px, ≤20 images/claude.ai (100 per request on 200k-ctx models, 600 otherwise), and visual-token cost `⌈w/28⌉×⌈h/28⌉` with standard-tier long-edge cap **1568 px / 1568 tokens** (high-res tier 2576 px). Anthropic **does not parse EXIF/GPS metadata** and treats images as ephemeral. (platform.claude.com vision guide.) **These numbers are the limits the Pi Remote relay must engineer to.**

### 1.4 PWA upload-lane precedent

- **`conversejs/converse.js` (3.3k★)** — XMPP **HTTP File Upload (XEP-0363)**: a browser chat PWA where files go to a dedicated upload endpoint, then a reference/link renders in the thread. This is the minimal viable architecture for Pi Remote's relay: **client → one upload endpoint → returned reference → transcript renders a card**, with the heavy bytes never round-tripping through the model's text stream.
- Adjacent: `claudiodangelis/qrcp` (10.5k★) / `sdushantha/qr-filetransfer` (1k★) — **phone↔desktop file transfer over QR+wifi**, the same transport family Pi Remote already uses for enrollment; a legitimate "manual fallback" divergent path (see §3).

### 1.5 iOS PWA facts that bound the whole feature

- `<input type="file">` + `accept` + optional `capture="user|environment"` is the *entire* native surface available; behavior is OS-dependent and **`capture` is non-Baseline** (MDN). With `accept="image/*"` **without** `capture`, iOS Safari presents the photo library picker (with a camera shortcut in the picker's context menu), matching the PHPicker interaction principle in native apps (out-of-process picker, **no full photo-library permission prompt** — Apple's PhotosUI/PHPickerController docs moved to `photosui/phpickerviewcontroller`).
- **HEIC is the silent killer:** iOS photo-library "optimized" storage hands the web app `.heic`. It is not in the Anthropic vision format list, cannot be guaranteed-decoded to canvas in every WebKit build, and is the reason `alexcorvi/heic2any` (879★) exists (libheif WASM). Any build phase **must** plan host-side transcode (libvips/Sharp) as the safety net, not rely on the client.
- Apple HIG's "Accessing the camera" page now 301s to the HIG root — treat camera-permission guidance as "defer; the system picker owns priority", and keep the AMS-style principle at the PWA layer: `multiple` attribute drives iOS's multi-select; a separate `capture` input drives instant camera.

---

## 2. Concrete spec contribution a build phase can execute

### 2.1 Composer attach — states, gestures, a11y, motion

**DOM/markup**
- One hidden `<input type="file" id="gallery-picker" accept="image/*" multiple>` (gallery + multi-select; iOS surfaces library first, camera reachable in picker).
- One separate hidden `<input type="file" id="camera-picker" accept="image/*" capture="environment">` (instant camera). Two inputs because `capture` is monotonic and iOS won't offer both from one control.
- Both triggered only by user gesture; both cleared (`value=""`) after every `change` so re-picking the same asset fires again.
- react-aria-components: `Button` (attach +), `Dialog`+`Modal` for the preview sheet, `Group` for the audio-free picker, focus-trapped sheet, `aria-describedby` on error regions.

**States (exact)**
`idle` → `picking:(gallery|camera)` (system sheet; unrecoverable tab-hang risk if PWA is backgrounded) → `previewing` (attached cards in composer; part of the *pending* draft, not yet a message) → `transcoding` (optional, only if HEIC + Safari can't make a usable preview/bytes on-device; otherwise deferred to host) → `uploading` (per-asset progress) → `pending-message` (bytes on host, attachmentId minted, mutating message not yet sent) → `sent` (message event lives in transcript) → `failure` per-asset with inline retry via **raw-input replay** (re-open picker prefilled — reusing the preserved `File` objects on retry; never silently drop).

**Gestures (iPhone-native, HIG-attuned, all also available via keyboard)**
- Tap **＋** → action sheet styled like the iOS sheet: *Photo Library · Take Photo →* (using the two inputs above). No custom `capture` guess beyond `environment`.
- In preview sheet: **tap thumbnail** → full-fidelity lightbox (`Modal`); **swipe left/right** between pending assets; **swipe down or Esc** dismisses; per-card **✕** removes (with `Delete` key + screen-reader label "Remove image Alt-caption").
- In-canvas: thumbnails live in a horizontal rail above the composer textarea; **pinch-free**, plain scroll; **tap-card → edit caption/alt** (native iOS 17+ text-field behaviors respected).
- Micro-interaction guidance: iOS sheets and buttons get sensible default motion. Respect `prefers-reduced-motion`: translate the sheet vertically with a 200–280 ms ease-out-out and **no** spring/overshoot when reduced-motion is set.

**A11y (WCAG AA)**
- Every thumbnail is a focusable `button`/`link` with accessible name like `IMG_0001.jpeg, 4.2 MB — 4032×3024`; lightbox adds `role="dialog"`, `aria-modal`.
- Non-text content: require/offer an **alt caption** field per pending image (optional, but the composer shows an inline hint: "describe the photo for accessibility"); default alt = `Photo (n of N)` until user edits.
- Color: attach button ink-on-parchment, clay `#d97757` only in **selected/hover/error** accents; both themes `#d97757-on-bone` and `ink-on-parchment` variants must pass 4.5:1 (verify against Tailwind 4 token set; error uses a derived red distinct from clay).
- Live region (`aria-live="polite"`) announces "2 photos attached", "Uploading photo 1 of 2 (34%)", "Photo upload failed; retry", satisfying WCAG 4.1.3 status messages.
- Keyboard: attach (⌘/Ctrl+P convention is not native on iOS → expose a labeled **＋** button; keyboard path via the lightbox's Esc/arrows).

### 2.2 Upload + redaction + security design (crossing the read-only line deliberately)

**Principle (from §1): the phone uploads bytes to the **host relay**; pi never receives raw phone bytes in the text stream; the transcript stores references, not payloads** (Aider/image-as-file + Anthropic Files-API `file_id` precedent; converse.js reference-card precedent).

1. **Lane entitlement** — read-only posture stays default. The composer → upload lane is **disabled until the user explicitly grants "attachment lane" for the session** (one-time, host/extension-enforced, loggable). Attach button renders disabled-with-`title` until granted; granting requires the existing approval mechanism.
2. **Endpoint** — `POST /relay/upload` (host, Tailscale-bound, `Content-Type: multipart/form-data`, field `file` + `intent_ticket`).
   - **Ticket:** one-use, minted at attach time, chained to the *client's last-seen transcript revision* (fail closed if revision moved — mirrors the fixed mutation policy).
   - Server validates, in order: ticket one-time + revision; **magic bytes** allowlist (JPEG/PNG/WebP/GIF/HEIC) — reject on MIME-claim mismatch; **size caps** 20 MB raw (HEIC giants) and N-per-message (e.g., **5** — under the 20-image claude.ai and effectively under the 100/request API cap, §1.3); compute a header-parse of dimensions.
3. **Normalization at rest** (host, before anything is stored):
   - Transcode HEIC→JPEG (libvips), **EXIF strip** (GPS/maker/device → supports "redaction everywhere"; anthropic-api precedent: model would not read it anyway).
   - Downscale so the delivered artifact never exceeds **long-edge 1568 px standard-tier (≤2 048 px if target model is high-res tier = 2 048 px )**, quality ~0.82, bytes ≤ ~7.5 MB binary so base64 stays under anthropic's 10 MB/5 MB partner caps — but keep the **original-until-deleted** spool for owner-side transcript fidelity, both removed by TTL (default **60 min**) or immediately after the send is consumed.
   - Store in a **non-git, non-derivable** path keyed by a 256-bit random `attachmentId`; never commit; directory excluded in repo config.
4. **Message mutation** — `POST /relay/message` (existing one-use-ticket lane) carries `{text, attachments:[attachmentId…]}`. Transcript records an **`user.attach`** event: `{attachmentId, mediaType, width, height, bytes, owner}`.
5. **Redaction / transcript display** — transcript content itself contains **metadata + a signed, expiring preview URL**, never raw base64, never the byte path.
   - **Owner** (the device that sent it): full-fidelity lightbox, served from the authenticated spool.
   - **Any other viewer** (mirrored desktop session, etc.): **blurred/downsampled surrogate card** (`blur(14px)` ink-wash layer), metadata visible, with a "request original" action that re-validates owner on the host — i.e., *redaction everywhere* beats "nobody can see it again".
   - Model-side: pi receives **the host tmpfile path or a `file_id`** per the pi backend's capability (Kimi-plan `plan` mode = read-only → pi may *view* the file via its read tools, honoring plan mode; nothing mutates by default).
6. **Lifecycle** — attitude of §1.3: on any normalization failure or size overrun, emit an *explicit* model-side and transcript-side placeholder text ("image omitted: exceeds 20 MB limit") — copy the Codex placeholder strings, never silently drop.

### 2.3 Visual/motion summary (per design system)

- Card: parchment fill, 1 px carbon-ink/`rgba(0,0,0,0.12)` hairline, clay 2 px selected ring; lightbox scrim `ink 0.55`; motion: sheet rise 220 ms + `ease-out-quart`, thumbnails keyed by `motion-safe` classing to laser `prefers-reduced-motion`.
- Upload progress: determinate 2 px ink rail with clay fill; indeterminate shimmer = parchment-noon gradient, `animation --motion-translate-x-infinite` aware of reduced-motion.
- Error: inline, non-blocking, with the exact four-verb sentence pattern above; keeps the composer usable (fail soft) — only the *ticket* fails hard (fail closed on mutation).

---

## 3. Divergent / minority ideas (resist converging)

1. **No host disk at all — "tap the QR" lane.** Reuse the enrollment QR pattern: phone renders an attachment claim QR; host `qrcp`-style pulls the file over the tailnet directly into tmp with the same ticket. Zero persistent relay endpoint; slower UX; strongly off-model but maximally "redaction everywhere".
2. **Last-pixel-in, first-pixel-out rules:** after first failed normalization, **require `picking(gallery)` again with a visible "re-shoot" suggestion** rather than retry loops — minimizes junk bytes reaching the model (Aider's "downsample first" advice made into UX).
3. **"Camera-as-clipboard":** one tap on ＋→Camera captures and attaches *immediately* to the draft (Kimi-style momentum), instead of a confirm sheet; speeds repeat UI-screenshot flows, at the cost of accidental captures — gate behind a session toggle.
4. **Video-limited lane** (`video/*` + `capture`, ≤ 30 s, host-transcoded to 480p) as a *later* iteration only — currently out of scope; cite it so the relay won't close the door on non-image codecs.
5. **Attachment-as-workspace-file vs attachment-as-context:** minority opinion — for *coding* agents, path-to-file (Kimi `plan` vibe) is superior to base64-context (prompt pollution), but for *screenshot debugging*, base64 is what the model actually wants. Spec should make both callable (`file_id` vs path) behind one adapter, chosen per pi backend.
6. **No blur, no re-request: "metadata-only + alt text" transcript card** for every viewer including owner (iCloud-photo-privacy school). Denies future re-view, simplest privacy story; likely the strongest fit for the "redaction everywhere" doctrine — worth a deliberate trade argument.

---

## 4. Open questions + risks

- **pi's own intake surface is the biggest unknown:** does `earendil-works/pi` accept vision blocks, file references, or require a file path in the worktree? Build phase *must* probe pi's runbook/`UserMessage` schema before locking the relay response shape (`file_id` vs path vs base64).
- **Standalone-mode camera/re-HEIC degrades silently:** on-device matrix on iOS 17/18/26 PWA mode needed; `capture` in some standalone configs historically opens Files instead of camera. Put a `capture`→camera, `image/*`→library fallback test behind a runtime probe.
- **Token/cost blow-up:** a 12MP photo at high-res tier ≈ 4.7k visual tokens each (§1.3 table); default downscale must prevent surprise lifetime cost per message; surface "photo downsized to 1568px" in the card footer.
- **EXIF strip timing must be provably-host-side** so "redaction everywhere" isn't defeated by a log line containing GPS; add a redact test.
- **Multi-viewer semantics are undefined**: is "owner" the single enrolled device or any same-tailnet viewer? Transcript redaction scope (§2.5) needs the locking down in the spec.
- **Backgrounded-PWA fetch aborts mid-upload**: idempotent ticket + resume-by-replay (`File.slice`) or the lossless "restart the op" posture; measurable on WiFi-tailnet latency only in the field.
- **20-image / 200k-ctx caps** interplay with 5-image draft cap and multi-turn re-send (Anthropic resends history each turn → base64 grows; prefer `file_id`/URL to keep each turn small — the Files-API rationale restated for our relay).

---

## 5. Sources

**GitHub (verified this pass via API/README)**
- agent-of-empires/agent-of-empires — https://github.com/agent-of-empires/agent-of-empires
- dcouple/Pane — https://github.com/dcouple/Pane
- siteboon/claudecodeui — https://github.com/siteboon/claudecodeui
- The-Vibe-Company/companion — https://github.com/The-Vibe-Company/companion
- stablyai/orca — https://github.com/stablyai/orca · milisp/codexia — https://github.com/milisp/codexia
- blinksh/blink — https://github.com/blinksh/blink
- holzschu/a-shell — https://github.com/holzschu/a-shell
- aider-ai/aider — https://github.com/aider-ai/aider · docs: https://aider.chat/docs/usage/images-urls.html
- openai/codex — https://github.com/openai/codex · `codex-rs/core/src/image_preparation.rs` · `codex-rs/core/src/tools/handlers/view_image.rs`
- sinameraji/kimiflare (Kimi K3 / Kimi Code harness) — https://github.com/sinameraji/kimiflare · Leechael/pi-provider-kimi-code — https://github.com/Leechael/pi-provider-kimi-code
- gptme/gptme — https://github.com/gptme/gptme
- anthropics/claude-code — https://github.com/anthropics/claude-code
- earendil-works/pi — https://github.com/earendil-works/pi
- conversejs/converse.js — https://github.com/conversejs/converse.js
- alexcorvi/heic2any — https://github.com/alexcorvi/heic2any
- claudiodangelis/qrcp — https://github.com/claudiodangelis/qrcp · sdushantha/qr-filetransfer — https://github.com/sdushantha/qr-filetransfer
- omnimind-ai/OmniBot — https://github.com/omnimind-ai/OmniBot

**Web/platform docs (fetched this pass)**
- Anthropic vision guide (limits, formats 5 MB/10 MB, 8000px, token math, EXIF) — https://platform.claude.com/docs/en/build-with-claude/vision
- MDN `capture` attribute (non-Baseline; `user`/`environment`) — https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture
- W3C HTML Media Capture spec — https://w3c.github.io/html-media-capture/#dfn-capture
- Apple PhotosUI PHPickerViewController (out-of-process picker, no full-library permission) — https://developer.apple.com/documentation/photosui/phpickerviewcontroller
- Claude Code docs sitemap (repo docs index used) — https://code.claude.com/docs/sitemap.xml

**Mobbin (login-gated; included as reference targets, screens not directly verifiable this pass — flagging as unverified)**
- Claude iOS (attachment + transcript flow): https://mobbin.com/apps/claude-ai-chatbot · Kimi (Moonshot) mobile (composer flow): https://mobbin.com/apps/kimi
