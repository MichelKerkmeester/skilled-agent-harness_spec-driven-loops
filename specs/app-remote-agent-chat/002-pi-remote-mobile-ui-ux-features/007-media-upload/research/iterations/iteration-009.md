<!-- provenance: external-CLI orchestration pass; original file iter-09-grok.md -->
> **Source pass 9** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-9-grok.md`.

<!-- F5-media-upload | model=grok | lens=competitive-teardown | iter 9/15 | 2026-08-15T20:25:41.640Z -->

# Competitive teardown: iOS gallery/camera attach into chat  
**Lens:** how Claude iOS, Kimi Code, ChatGPT, Perplexity, DeepSeek, Gemini, and Meta AI actually attach media — and what a React 19 + Vite + Tailwind 4 + react-aria-components iPhone PWA can copy without breaking Pi Remote’s ticketed, fail-closed posture.  
**Iteration:** 9 of 15 · 2026-08-15  
**Mobbin MCP:** unavailable in this session (empty MCP catalog). Public Mobbin flow/screen URLs are cited from crawl.

---

## 1. Findings

### 1.1 What already exists in this repo (the collision, not the chrome)

Pi Remote’s composer is already a Claude-shaped tray: left circular `+` (40×40 CSS px / `2.5rem`), right circular send, Inter 17 px (`1.0625rem`) field, 140 px max grow, disclaimer above the tray ([`apps/pi-remote-web/src/SessionComposer.tsx`](apps/pi-remote-web/src/SessionComposer.tsx), [`apps/pi-remote-web/src/style.css`](apps/pi-remote-web/src/style.css) `.composer-plus` / `.composer-primary`). The `+` is **not** an attach control. Its `aria-label` is `"Mode and commands"` and the popover only contains Build/Plan + slash commands ([`SessionComposer.tsx`](apps/pi-remote-web/src/SessionComposer.tsx) L175–L196). Putting Photos inside that popover would mix two different jobs that the target apps sometimes merge (Claude, ChatGPT, Gemini) and sometimes keep apart (OpenClaw, Cmux, iMessage-class paperclip).

The only live `<input type="file">` is enrollment QR: `accept="image/*"`, single file, no `multiple`, no `capture` ([`apps/pi-remote-web/src/App.tsx`](apps/pi-remote-web/src/App.tsx) L386–L398). That is the Safari Photos/camera sheet, used as a decoder, not a chat attach lane.

The protocol already has `{ type: "image", data, mimeType }` on **host-facing** `prompt` / `steer` / `follow_up` ([`packages/pi-rpc-protocol/src/types.ts`](packages/pi-rpc-protocol/src/types.ts) L12–L48). The **phone→relay** command `prompt.submit` does **not** include `images`. The guard is a closed key set: `type | submissionId | sessionId | message | ticket | streamingBehavior` ([`packages/pi-rpc-protocol/src/guards.ts`](packages/pi-rpc-protocol/src/guards.ts) L244–L267). Extra keys fail closed. The HTTP body cap is **16 384 bytes** and the WebSocket frame cap is **65 536 bytes** ([`apps/pi-remote-relay/src/http/server.ts`](apps/pi-remote-relay/src/http/server.ts) L39–L40). A single iPhone photo cannot travel on either existing lane. OpenClaw’s gateway docs make the same math explicit: a 20 MB file is ~26.7 MB as base64 and blows a 25 MiB `maxPayload` ([openclaw PR 116188](https://github.com/openclaw/openclaw/pull/116188)).

**Implication:** matching Claude/Kimi *chrome* without a new upload lane is not a UX miss — it is a protocol/security miss. Consumer apps hide this because they own a Files API. Pi Remote does not.

---

### 1.2 Claude iOS (primary target bar) — screens, sequence, numbers

**Composer entry.** Anthropic documents the `+` in the lower-left of the chat box as the options/commands entry, including file upload ([Claude Help: Get started](https://support.claude.com/en/articles/8114491-get-started-with-claude); [Claude Help: Upload files](https://support.claude.com/en/articles/8241126-upload-files-to-claude)). Sequence on web/desktop (the documented menu copy):

1. Tap `+` (lower left of composer).
2. Choose **Add files or photos**.
3. System picker → Open / attach.
4. Optional caption; paste from clipboard is a parallel path.

On iOS the same `+` is the documented mobile entry. Third-party walkthroughs of the current iOS sheet list **gallery / take photo / Files** as the three destinations after `+` ([TechBink walkthrough](https://techbink.com/how-to-upload-files-to-claude/)). Treat the exact iOS row labels as observed-in-the-wild, not Help Center copy; Help Center copy is **Add files or photos**.

**Voice-mode overlay (same attach grammar).** Voice Mode puts a `+` on the voice screen that opens **camera, gallery, or files**; attachments stay visible on the voice surface while talking ([TestingCatalog, 2025](https://www.testingcatalog.com/anthropic-begins-testing-voice-mode-with-three-voices-in-claude-app/); [TechRepublic](https://www.techrepublic.com/article/news-anthropic-claude-ai-app-conversational-voice-mode/)). Pi Remote has no mic; do not copy the waveform. Do copy the rule: **attach is available in every composer mode, including non-text modes**.

**Native-only surfaces a PWA cannot copy.** Claude ships:

- Home-screen widget with a **camera** button that opens capture → share with Claude.
- Control Center / Lock Screen control **Analyze Photo with Claude**.

([Claude Help: intents, shortcuts, widgets](https://support.claude.com/en/articles/10263469-using-claude-app-intents-shortcuts-and-widgets-on-ios)). Installed iOS PWAs do not get Control Center controls or widget camera actions. Do not fake them.

**Mobbin flow.** [Claude iOS — Chatting with Claude (image input)](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1): user attaches an image, asks for a translation, receives OCR/translation in the thread. Timestamped beats at 0:00 / 0:03 / 0:05 / 0:07 / 0:10 / 0:12 / 0:19. Related tagged screens: [Uploading & Downloading + Recording](https://mobbin.com/explore/screens/448b88ea-3923-427c-aead-5488541ff56e), [Chat Detail + FAB + Uploading](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8). Complementary text-only composer flow: [Chatting with Claude (text input)](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57).

**Limits (first-party, claude.ai chat).** ([Upload files to Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude); [Vision docs](https://platform.claude.com/docs/en/build-with-claude/vision))

| Constraint | Value |
|---|---|
| Image MIME | JPEG, PNG, GIF, WebP — **not HEIC** |
| Chat file size | 500 MB/file (chat); images on claude.ai also cited at 10 MB in the Vision “request limits” table |
| Files per chat | 20 |
| Images per turn (claude.ai) | 20 |
| Max dimensions | 8000×8000 px |
| Recommended detail | ≥ 1000×1000 px |
| API base64 image | 10 MB (Claude API), **5 MB on Bedrock / Google Cloud** |
| API request body | 32 MB standard endpoints |
| Native vision long-edge | 1568 px (standard) / 2576 px (Claude 4.7+) before the model downscales anyway |
| Patch size | 28×28 px visual tokens |

**HEIC is a session-killer, not a warning.** Claude Code has a documented failure where HEIC/HEIF is sent, the API returns `400 Could not process image`, and the **session stays broken** ([claude-code#16169](https://github.com/anthropics/claude-code/issues/16169)). Anthropic’s Python SDK still has an open HEIC request ([anthropic-sdk-python#1589](https://github.com/anthropics/anthropic-sdk-python/issues/1589)). iPhone camera default since iOS 11 is HEIC. A Pi Remote attach that forwards HEIC to `pi` is not “format polish”; it is a known catastrophic path.

**Closest product analog: Claude Code Remote Control.** This is the same job as Pi Remote (phone drives a local coding agent). Anthropic’s contract is explicit and **split by media kind** ([Remote Control](https://code.claude.com/docs/en/remote-control); [Mobile](https://code.claude.com/docs/en/mobile)):

- **Photos** attached in the Claude app are shown to Claude **directly as part of the message** (changelog: “photos attached from the Claude app are now shown to Claude directly instead of being read from disk with a separate tool call”).
- **Other files** are downloaded onto the host machine and passed as `@` file references.

That split is the right mental model for Pi: screenshots/photos → vision content; everything else (if ever allowed) → host file, never base64 on the phone→relay JSON.

Remote Control also refuses Bypass-permissions from the app and offers Manual / Accept edits / Plan only ([Mobile limitations](https://code.claude.com/docs/en/mobile)). Attachments still reach the local session. **Plan mode does not hide attach.**

---

### 1.3 Kimi Code (second target bar) — the only competitor with published *coding-agent* media math

Kimi the consumer iOS app and Kimi Code are different surfaces. **Copy Kimi Code’s numbers, not Kimi chat’s office-agent mythology.**

**Kimi Code (VS Code / CLI) — first-party:** ([Core operations](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html); [CLI interaction](https://moonshotai.github.io/kimi-code/en/guides/interaction.html))

| Path | Limit |
|---|---|
| Formats | PNG, JPEG, GIF, WebP, **HEIC**; video MP4/WebM/MOV |
| Paste / drag-drop | Original ≤ **5 MB**; auto-compress (HEIC→JPEG, scale, quality → ~**2 MB**) |
| `+` picker or `@` menu | Images ≤ **10 MB**, videos ≤ **20 MB** |
| Per message | ≤ **9 files**, ≤ **80 MB** total |
| Non-multimodal model | Media attached → those models are **filtered out of the picker** |
| CLI paste | macOS/Linux `Ctrl-V`; placeholder in the input, replaced on submit |

**Kimi consumer iOS (App Store id 6474233312; help/overview in prior design research).** Sequence from a 2026 Android/tablet walkthrough that matches the documented `+` grammar ([YouTube: How to Upload Photos in Kimi AI](https://www.youtube.com/watch?v=R6Zld3_cq0g)):

1. Open chat.
2. Tap **`+` at bottom-right of the composer** (Kimi’s plus is right-biased vs Claude’s left-biased).
3. Tap **Photos**.
4. Select → **Done**.
5. Thumbnail appears **in the text box**.
6. Optional caption → send arrow.

That is the staging pattern to copy: **preview lives inside the composer, not in a full-screen editor, and send is a separate step.**

Kimi Code’s Plan control is a **clipboard icon left of the input**, not inside the attach menu ([Core operations — Plan Mode](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html)). Pi Remote already put Plan in `+`. Do not also hide Photos behind Plan.

---

### 1.4 ChatGPT iOS

**Sequence (first-party):** tap `+` in the prompt area → **Add photos & files**. Drag/drop and clipboard paste are web parallels ([ChatGPT Image Inputs FAQ](https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq); [File Uploads FAQ](https://help.openai.com/en/articles/8555545-file-uploads-faq)).

| Constraint | Value |
|---|---|
| Image formats | PNG, JPEG/JPG, **non-animated GIF** |
| Per-image hard limit | **20 MB** |
| Other files | **512 MB**/file |
| Surfaces | Web + iOS/Android; mobile-web can attach **before sign-in** |

Third-party guides repeat “about 10 images per message” ([Hot Shot](https://hotshot.co/how-to-upload-images-to-chatgpt/)). OpenAI’s FAQs do **not** publish a per-message image count; do not treat 10 as first-party.

**Mobbin:** [ChatGPT iOS Chat Interface](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1) is captioned “Message input field with suggested prompts and **camera icon for image input**.” That is an older/cohort camera-in-field pattern, not the current documented `+` → Add photos & files. Both exist in the wild. **Do not put a camera glyph in the Pi field** unless it is a real capture control; ChatGPT’s current docs standardized on `+`.

Voice Live also documents an **add button for images while Voice is active** ([OpenAI Help, cited in in-repo design research](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)) — same “attach survives mode changes” rule as Claude Voice.

---

### 1.5 Gemini iOS — the cleanest *source-split* sheet

Google’s Help Center is the most operationally specific of the consumer apps ([Upload & analyze files in Gemini Apps — iPhone & iPad](https://support.google.com/gemini/answer/14903178?co=GENIE.Platform%3DiOS&hl=en)).

**Gemini mobile app sequence:**

1. Focus the bottom text box (prompt can be typed before or after attach).
2. Tap **Add files**.
3. Horizontal icon row, swipeable:
   - **Files** (Files app; Google Docs/Sheets converted to PDF)
   - **Photos** (Photo Library)
   - **Camera** (new photo **or video**)
   - **Drive**
   - **Notebooks**
   - **More Uploads** if the row overflows
4. Tap **Submit**.

Web-on-iPhone uses the same labels with Photos/Camera/Files/Drive/Notebooks.

| Constraint | Value |
|---|---|
| Count | **Up to 10 files of any supported kind per prompt** (folder children count) |
| Non-video | **100 MB** |
| Video | **2 GB**, 5 min (free) / 1 h (Pro/Ultra) |
| Audio | 10 min / 3 h (paid) |
| ZIP | ≤ 10 files, ≤ 100 MB, no A/V inside |
| Errors | “Delete data to upload file” (Gemini Apps storage, **not** Drive quota); rolling “chats with files” limit; “uploads may be too large for the best results” |

**Mobbin:** [Google iOS — Asking Gemini](https://mobbin.com/explore/flows/e5b8846f-e7bb-481a-82bd-47f29bfb6653) (upload image → identify place → Maps). Web sibling: [Gemini Web — prompt with image](https://mobbin.com/explore/flows/f922cc48-a6ba-417c-8db3-5616d7b4837a).

**What to steal:** explicit **Photos vs Camera** as two destinations, not one “media” blob. Gemini’s 100 MB/2 GB ceilings are **wrong** for a Tailscale relay with a 16 KB JSON body.

---

### 1.6 Perplexity iOS — search-bar attach, one number

First-party Help Center (Cloudflare-gated in this pass; snippet from crawl + independent write-up):

- Entry: **“+ Attach”** on the search bar; drag-and-drop of files **and folders** on web ([Perplexity Help: File Uploads](https://www.perplexity.ai/help-center/en/articles/10354807-file-uploads.html)).
- Types: text, code, PDF, **images, audio, video**. Audio/video are transcribed.
- **Hard size: 40 MB for all file types.**

Third-party synthesis adds **10 files per message** and “temporary session storage” ([DataStudios](https://www.datastudios.org/post/perplexity-ai-file-upload-and-reading-formats-limits-and-workflow-integration)). Treat 10 as unverified; treat **40 MB** as first-party.

iPhone guide: tap `+` in the search bar → Upload File → Files/Photos ([Perplexity Magazine 2026](https://perplexityaimagazine.com/perplexity-hub/how-to-use-perplexity-ai-on-iphone/)).

Perplexity is search-first: attach is a **query input**, not a chat accessory. Pi Remote is a coding-agent remote. Copy the **one-tap `+` → picker → thumbnail in bar → send** rhythm, not audio/video, not 40 MB.

No first-party Perplexity iOS attach flow was found on Mobbin in this crawl.

---

### 1.7 DeepSeek iOS — paperclip + a mode trap

Official app launch post lists **file upload & text extraction** next to web search and Deep-Think ([DeepSeek API news 2025-01-15](https://api-docs.deepseek.com/news/news250115/)). Pocket-lint’s UI walkthrough: **`+` below the bar on the right** → photo, image, or document; DeepThink and Search are **chips**, not attach destinations ([Pocket-lint](https://www.pocket-lint.com/deepseek-ai-guide/)).

**Mobbin:** [DeepSeek iOS Chat Bot Screen](https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4) (chat detail, no attach-flow video in the crawl).

DeepSeek does **not** publish a first-party MB cap. Third-party iOS notes: image OCR/charts; PDFs “a few megabytes”; client-side truncation of huge files; crashes reported around ~50 MB ([deepseekai.guide](https://deepseekai.guide/guides/deepseek-on-iphone/), [mobile tutorial](https://deepseekai.guide/tutorials/deepseek-on-mobile/)).

**Mode trap (do not copy):** users reported Expert mode **dropping file upload and photo OCR** while Instant kept them ([deepseek-ai/DeepSeek-V3#1406](https://github.com/deepseek-ai/DeepSeek-V3/issues/1406)). Pi Remote’s Plan mode is the analogous “stricter” mode. **Hiding attach in Plan because “plan is read-only” is the DeepSeek Expert failure.** Vision of a screenshot is a read. Writing the file into the repo is a mutation. Keep those separate.

---

### 1.8 Meta AI iOS — Camera vs Photo library, plus a second Upload rail

First-party ([Start a chat with Meta AI](https://www.meta.com/help/artificial-intelligence/943942350800511/)):

1. Bottom field: **Ask Meta AI…**
2. Tap (attach control; Help Center uses an icon, not a word).
3. **Camera** *or* **Photo library**.
4. Type or speak the prompt. Examples: “What breed of cat is this?”

A **second** rail for edit/animate ([Edit images with Meta AI](https://www.meta.com/help/artificial-intelligence/517678174532704/)):

1. Tap **Upload** bottom-left.
2. **See all** (full library) or **Camera**.
3. Tap **Add**.
4. Type the edit prompt → **Send**.

App Store listing (id 1558240027): “Get answers from any photo, video, doc, or file… Send multiple files.” No first-party MB cap found. Voice mode can **share the live camera** — out of scope for this PWA.

Meta’s dual rail (chat-attach vs dedicated Upload) is a minority idea: Pi should **not** ship a second Upload tab. One composer attach is the Claude/Kimi/ChatGPT consensus.

No Meta AI attach flow found on Mobbin in this crawl.

---

### 1.9 Cross-app interaction sequence (what actually converges)

Every shipping iOS AI chat, despite chrome differences, uses the same **seven beats**:

| Beat | Claude | Kimi | ChatGPT | Gemini | Perplexity | DeepSeek | Meta AI |
|---|---|---|---|---|---|---|---|
| 1. Entry | `+` left | `+` right | `+` | Add files | `+ Attach` | `+` / paperclip | attach / Upload |
| 2. Source split | files or photos; voice: camera/gallery/files | Photos / file / WeChat-file | photos & files | **Photos and Camera are separate icons** | Upload File | photo or document | **Camera vs Photo library** |
| 3. System picker | native | native | native | native | native | native | native |
| 4. Stage in composer | yes | thumbnail in box | yes | yes | thumbnail near bar | yes | Add then prompt |
| 5. Caption optional | yes | yes | yes | prompt before or after | query after | yes | yes |
| 6. Send separate from pick | yes | arrow | yes | Submit | search | blue arrow | Send |
| 7. Image-only send | yes | yes | yes | yes | yes | yes | yes |

None of them upload on pick. **Staging is local; network starts on Send** (or on Gemini/Perplexity submit). That is the UX that feels “flawless” and it is also the security-correct order for a ticketed mutation: mint ticket **at send**, not at pick.

Hit geometry: 44×44 pt is the iOS floor ([WWDC20 PHPicker](https://developer.apple.com/videos/play/wwdc2020/10652/) assumes standard iOS controls; Apple HIG 44 pt). Pi’s current `+` is **40×40 CSS px** — below the floor. Attach must not inherit that.

---

### 1.10 What a PWA can and cannot copy from native Photos

**Native apps** use out-of-process `PHPickerViewController` / SwiftUI `PhotosPicker`: no Photo Library permission, multi-select, search, zoomable grid, selection-order badges (iOS 15+), Options → format Automatic/Current/Most Compatible (iOS 17+) ([WWDC20 Meet the Photos picker](https://developer.apple.com/videos/play/wwdc2020/10652/); [WWDC21 Improve access to Photos](https://developer.apple.com/videos/play/wwdc2021/10046/); [WWDC23 Embed the Photos Picker](https://developer.apple.com/videos/play/wwdc2023/10107/)).

**iOS Safari / Home Screen PWAs cannot call PHPicker.** They get the HTML file input, which Safari maps onto a **one-off / “Private Access” picker**: the site receives only the chosen items, access is not remembered, Settings shows Safari separately from Limited/Full app access ([Apple Community thread on Safari Private Access](https://discussions.apple.com/thread/255145186); [Apple Forums: no directory picker for web apps](https://developer.apple.com/forums/thread/816515)). Installing to Home Screen does **not** upgrade file access.

**Concrete HTML → iOS sheet mapping** ([MDN `capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture); [Devnote iOS file-input](https://devnote.in/fix-ios-safari-input-typefile-not-opening-camera-real-solution/); Apple Forums iOS 17 format Options [thread 743037](https://developer.apple.com/forums/thread/743037)):

| Markup | iOS result |
|---|---|
| `<input type="file" accept="image/*">` | Action sheet: **Take Photo or Video / Photo Library / Browse** |
| same + `multiple` | Photo Library allows multi-select (modern iOS) |
| `capture="environment"` | Prefers **rear camera** immediately; gallery is not the default |
| `capture="user"` | Front camera |
| `accept` includes `image/heic` | Safari 17+ **can transmute PNG/JPEG into HEIC** ([Forums 743049](https://developer.apple.com/forums/thread/743049)). **Never put `image/heic` in `accept`.** |
| `accept="image/*"` + Automatic format | iOS often **converts HEIC→JPEG before handing the `File` over**, with a silent hang after Add ([SO 79071642](https://stackoverflow.com/questions/79071642/iphone-automatically-converting-heic-hevc-files-when-using-input-type-file)). User can set picker Options → Format → **Current**, but a PWA cannot set that default. |

**Gesture constraint:** programmatic `input.click()` is unreliable on iOS. A `<label for>` tap (or RAC `FileTrigger`, which is a labelled input) is the supported user-gesture path ([NewTon QR discussion](https://github.com/skrodahl/NewTon/discussions/4)).

**Inbound share:** Web Share Target is **not implemented on iOS/iPadOS Safari at any version as of mid-2026**. Photos → Share → Pi Remote will never appear ([webshareapi.com matrix](https://www.webshareapi.com/web-share-target-api/)). Native Claude’s Control Center photo control has no PWA equivalent.

**HEIC decode in Safari:** `URL.createObjectURL` on HEIF has failed in the wild; `FileReader.readAsDataURL` is the more compatible preview path ([NewTon](https://github.com/skrodahl/NewTon/discussions/4)). After iOS Automatic conversion you usually get JPEG anyway — but do not assume it.

---

### 1.11 Coding-agent / remote-CLI prior art (GitHub)

These are closer to Pi Remote than ChatGPT.

**OpenClaw** ([ChatComposer.swift](https://github.com/openclaw/openclaw/blob/8d535fb0/apps/shared/OpenClawKit/Sources/OpenClawChatUI/ChatComposer.swift); [chat-attachments.ts](https://github.com/openclaw/openclaw/blob/b8ed2c32/src/gateway/chat-attachments.ts); [PR 116188](https://github.com/openclaw/openclaw/pull/116188); [PR 72612](https://github.com/openclaw/openclaw/pull/72612); [#68524](https://github.com/openclaw/openclaw/issues/68524); [PR 81608](https://github.com/openclaw/openclaw/pull/81608)):

- iOS: `PhotosPicker(..., maxSelectionCount: 8, matching: .images)` — **paperclip, not plus**.
- Default non-image ceiling **20 MB** (`agents.defaults.mediaMaxMb`); **images gated at ~5 MB** (`MAX_IMAGE_BYTES`) so they are not silently dropped later.
- 48MP Camera Roll attachments **OOMed / exceeded 5 MB / stacked-overflowed** until client JPEG transcode + EXIF strip + off-MainActor resize, budget ~3.5 MB with headroom under Anthropic’s 5 MB Bedrock cap.
- Gateway **advertises** `{ maxBytes, maxImageBytes }` on `hello-ok.policy.attachments` so the client can preflight. MIME lists and per-model vision are **not** in the handshake; server stays authoritative.
- Inline `{ type: "image", data: b64, mimeType }` **or** offload to host `MediaPaths` and inject an `@` path. Text-only models: refuse or offload, never silently omit.
- Browser Control UI: reject oversize **before** `FileReader.readAsDataURL()` (base64 inflates ~4/3 and can crash the tab).

OpenClaw’s wire image object is the same shape Pi already declared on `PromptCommand`. Their mistake to not repeat: sending raw PhotosPicker bytes on the main thread over a small WebSocket.

**Cmux iOS** ([PR 6102](https://github.com/manaflow-ai/cmux/pull/6102)):

- Replaced a chevron with a **paperclip**.
- `PhotosUI` multi-select; stage as removable chips; **Send works with attachments and no text**.
- Encode: PNG if ≤8 MB else JPEG quality **0.8**; downsampled thumbnail via ImageIO; off-main `Task.detached`.
- Reuses existing `terminal.paste_image` transport — **no new wire protocol**. Pi cannot do that: `prompt.submit` has no image field and a 64 KB WS cap.

**ClickUp iOS (non-AI, useful sheet)** — [Attachments screen](https://mobbin.com/explore/screens/fbb8cf1f-aee6-4f00-8b0a-57a6ba949560): in-app rows **gallery / take photo / upload file**. A PWA can fake this with **two** file inputs (no `capture` vs `capture="environment"`) plus a react-aria `Popover`/`Menu`, matching Gemini’s Photos/Camera split without waiting on Safari’s action sheet.

**WhatsApp iOS (divergent messaging, not AI)** — [Sending an image](https://mobbin.com/explore/flows/c5841e58-0961-4da8-abe0-6d4171e9a758): pick → **quality + markup editor** → send → bubble. Do not copy the editor for v1; it is the minority “annotate the screenshot before the agent sees it” idea.

---

### 1.12 Limit table a build phase can actually use

Consumer ceilings (Gemini 100 MB, Perplexity 40 MB, ChatGPT 20 MB/image, Claude chat 500 MB/file) assume hyperscale object stores. Pi Remote is a private Tailscale relay with a 16 KB JSON POST and a 64 KB WS frame. **The binding constraints are Kimi Code paste, OpenClaw iOS, and Anthropic vision — not Gemini.**

| Source | Per-image decoded | Per-message count | Long-edge | HEIC | Video |
|---|---|---|---|---|---|
| Anthropic Vision (Bedrock/GCP) | 5 MB | keep ≤20 to avoid 2000 px clamp | 1568 / 2576 native | no | no |
| Anthropic Vision (direct API) | 10 MB | 100–600 API / 20 claude.ai | 8000 hard | no | no |
| Kimi Code paste | 5 MB in → ~2 MB out | 9 / 80 MB | auto-scale | converted | yes, 20 MB picker |
| Kimi Code picker | 10 MB | 9 | — | accepted then converted | 20 MB |
| OpenClaw iOS (fixed) | ~3.5 MB JPEG budget | picker max 8 | resize to budget | transcode to JPEG | not the chat picker |
| ChatGPT | 20 MB | undocumented | — | not listed | separate |
| Gemini | 100 MB | 10 | — | not listed | 2 GB |
| Perplexity | 40 MB | 10 (unverified) | — | not listed | yes |
| **Pi Remote existing lanes** | **16 KB HTTP / 64 KB WS** | 0 | n/a | n/a | n/a |

---

## 2. Concrete spec contribution (build-executable)

### 2.1 Information architecture (do not overload the existing `+`)

Keep `composer-plus` as **Mode and commands**. Add a sibling **Attach** control in `.composer-left`, left of `+` (reading order: Attach → Mode → field → Later/Send). This matches OpenClaw/Cmux paperclip and avoids stuffing Photos into Plan/Build.

If a one-control Claude clone is forced: first row of the existing popover becomes **Photos** / **Camera**, then a divider, then Mode. That is the Claude/ChatGPT merge. It is worse here because the popover already owns runtime mutations.

### 2.2 Controls, sizes, visual, motion

Design tokens stay ink-on-parchment: bone `#f8f8f6`, carbon ink, clay `#d97757`, Inter for chrome, Source Serif 4 for assistant prose only.

| Element | Spec |
|---|---|
| Attach button | RAC `Button` **or** RAC `FileTrigger` styled identically to `.composer-plus` but **44×44 pt** (`2.75rem` at 16). Glyph: 20–22 pt plus-in-circle is taken; use a **paperclip or landscape glyph**, 2.2 stroke, `currentColor`, `aria-hidden`. |
| Hit area | 44×44 minimum. Current 40×40 plus is out of spec; bump both plus and attach together so the bar stays even. |
| `aria-label` | `"Attach photos"`. Not `"Add files"`. Video/PDF are out of v1. |
| Focus | Existing 2 px `--focus` ring, 2 px offset. |
| Hover/press | `--surface-muted` fill, same as plus. |
| Disabled | `connection !== 'live' \|\| awaitingSnapshot \|\| sendingPrompt` — same as textarea. **Not** disabled in Plan. |
| Staging row | New grid row **above** the textarea, inside `.composer-tray`. Horizontal scroll, `gap: 8px`, padding 8×4. Tray grows upward; textarea max-height stays 140 px. |
| Chip | 56×56 pt thumbnail, 10 pt radius, 1 px `--line` hairline, bone fill. Filename is not shown (iOS temp names are `image.jpg` / `tempImage….heic`). Overlay: 18×18 pt carbon `×` on a 44×44 pt invisible hit in the top-right (visual 18, hit 44). |
| Chip selected/preview | Tap chip → full-width sheet (`Dialog` + `Popover` or RAC `Modal`) with the image, `object-fit: contain`, bone canvas, clay **Remove** text button, **Close**. |
| Progress | During send: 2 px clay stroke along the chip bottom (0→100). Do not replace the send circle with a second spinner; the existing send spinner stays. |
| Error chip | Same 56×56 footprint, `--ink-muted` placeholder glyph, one-line `role="alert"` under the row: `Couldn't attach that photo.` + reason. |
| Dark | Same geometry; thumbnail unfiltered; hairline `--line-strong`. Contrast of overlay `×` on a light photo: 40% carbon disc behind the glyph so AA holds. |
| Motion | Chip enter: 120 ms fade + 8 px rise. Remove: 100 ms fade. No bounce. Honor `prefers-reduced-motion: reduce` → opacity only. |
| Disclaimer | Unchanged copy. Attach does not add a second legal line. |

WCAG AA: 44 pt targets; `aria-live="polite"` on the staging row (`"2 photos attached"`); send `aria-label` becomes `"Send message with 2 photos"` when staged; VoiceOver rotor sees chips as `"Photo 1 of 2, 1.2 megabytes, button, remove"`.

### 2.3 States

```
Idle
  → (user tap Attach) Picking
Picking
  → cancel/no files          Idle
  → files selected           Validating  (sync, <50 ms)
Validating
  → all ok                   Staged
  → some rejected            Staged + inline-alert (keep good ones)
Staged (local object URLs only; zero network)
  → tap ×                    Staged' | Idle
  → tap Attach again         Picking (append, cap remaining slots)
  → tap Send                 TicketMint
TicketMint
  → ticket fail              Staged + alert (bytes still local)
  → ticket ok                Uploading
Uploading  (one POST per attachment, serial, fail closed)
  → HTTP 4xx/5xx             Staged + alert; do not submit prompt
  → all 201                  PromptSubmit (attachmentIds[], message)
PromptSubmit
  → success                  Idle; revoke object URLs; transcript shows redacted cards
  → revision mismatch        Staged + alert; attachments remain on relay until TTL
```

**Send enablement:** `canSubmit` is true when `connection === 'live'` AND (trimmed text **OR** `staged.length > 0`) AND not sending. Image-only send is required to match Claude/Kimi/ChatGPT. Empty text + empty staged = disabled.

**Steer / Later:** attachments allowed on steer (Claude Remote Control photos ride the same message). Later/follow-up: same. Stop (empty draft, running) does not attach.

### 2.4 Gestures and iOS picker wiring

**Do not** put `capture` on the default input. Default markup must open the system sheet **Take Photo or Video / Photo Library / Browse**.

```html
<!-- Default: gallery + camera + Files, images only, multi -->
<input type="file" accept="image/*" multiple />

<!-- Optional explicit Camera row (Gemini/Meta split), hidden until chosen -->
<input type="file" accept="image/*" capture="environment" />
```

Trigger via RAC **`FileTrigger`** (labelled control, iOS-safe gesture), not `input.click()`. Reset `value = ''` after `onSelect` so the same photo can be re-picked.

`accept` **must not** include `image/heic` or `image/heif` (Safari 17 transmute bug). `accept="image/*"` is the documented way to get the camera row on the action sheet.

`multiple`: yes, cap in JS. Kimi 9 / Gemini 10 / OpenClaw 8 / Claude 20. **Pi v1 cap = 4.** Coding-agent turns are screenshots, not albums. 48MP × 4 is already a memory incident if you skip resize ([OpenClaw #68524](https://github.com/openclaw/openclaw/issues/68524)).

Optional in-app menu (ClickUp/Gemini): RAC `Menu` with Photos / Camera. Photos → input A; Camera → input B with `capture="environment"`. This is the only way a PWA can offer Gemini’s split **without** relying on Safari’s action-sheet wording.

### 2.5 Client preprocessing (mandatory, before any ticket)

Run off the main thread (`createImageBitmap` + OffscreenCanvas in a Worker, fallback to `document.createElement('canvas')`).

1. Read `file.type` and magic bytes. Allow only `image/jpeg`, `image/png`, `image/webp`, `image/gif`. If `image/heic` / `image/heif` / `ftypheic` / `ftypheif` → **transcode to JPEG**; if transcode fails → reject with `"This photo is HEIC, which Pi can't read. Choose JPEG or PNG, or set the picker Format to Most Compatible."` Never forward HEIC ([claude-code#16169](https://github.com/anthropics/claude-code/issues/16169)).
2. Decode. Long-edge **> 1568 px** → downscale to 1568 (Anthropic standard vision native size; 2576 only if the host model is known high-res). Never enlarge.
3. Re-encode JPEG quality **0.82** (Cmux 0.8; Kimi paste ~2 MB target). PNG screenshots with few colors may stay PNG if the re-encoded PNG is smaller than JPEG **and** ≤ 3.5 MB.
4. **EXIF strip:** `canvas` re-encode drops GPS/orientation chunks. Do not ship original bytes. Orientation: draw via `createImageBitmap(file, { imageOrientation: "from-image" })` so the pixels are upright after strip.
5. Size gate **after** encode: **≤ 3_500_000 bytes** per image (OpenClaw 3.5 MB budget under the 5 MB Bedrock vision cap). If still over, second pass quality 0.7, then 1280 long-edge, then reject.
6. Per-message: **≤ 4** images, **≤ 8_000_000 bytes** total decoded. GIF: first frame only (Anthropic: animations unsupported).
7. Preview: `URL.createObjectURL(processedBlob)`; revoke on remove/send/unmount. If object URL fails on HEIF leftovers, `FileReader.readAsDataURL`.

Do **not** `readAsDataURL` the original 48MP file. OpenClaw’s Control UI fix is to reject oversize **before** FileReader ([PR 72612](https://github.com/openclaw/openclaw/pull/72612)).

### 2.6 Upload + security design (the new lane)

**Forbidden:** stuffing `images: ImageContent[]` onto `prompt.submit`, raising `MAX_HTTP_BODY_BYTES` to megabytes for JSON, or sending base64 on the 64 KB WebSocket. The closed key set and the 16 KB cap are the security posture.

**Lane: ticketed binary POST, then a thin prompt.submit.**

```
1. POST /api/auth/ticket          (existing; one-use)
2. POST /api/attachments          Content-Type: multipart/form-data
     fields: ticket, sessionId, expectedRevision, submissionId
     files:  blob (one part per request)
     header: Idempotency-Key: <submissionId>:<index>
3. Repeat 1–2 for each staged image (fresh ticket each time, fail closed)
4. POST /api/prompt/submit        existing JSON, 16 KB
     message, ticket, sessionId, submissionId
     NEW optional key: attachmentIds: string[]   // opaque ids from step 2
```

`isPromptSubmitCommand` currently **rejects** unknown keys. Adding `attachmentIds` is a deliberate protocol bump: opaque ids only, `isOpaqueId` each, max 4, no `data`, no filename, no mime in the JSON (relay already has them). Empty array forbidden; omit the key when none.

**`POST /api/attachments` fail-closed rules:**

| Check | Action |
|---|---|
| Missing/expired/reused ticket | 401, no store |
| `expectedRevision` ≠ live | 409, no store |
| `Content-Length` missing or > 5_242_880 (5 MiB hard) | 413 before read |
| Declared MIME not in `{image/jpeg, image/png, image/webp, image/gif}` | 415 |
| Magic bytes ≠ declared MIME | 415 (sniff wins; never trust `filename`) |
| HEIC signatures | 415 even if client slipped |
| Decoded pixels > 8000 on an edge | 413 |
| > 4 attachments already bound to this `submissionId` | 409 |
| Rate | share `MAX_PROMPTS_PER_MINUTE` **or** a tighter `MAX_ATTACHMENTS_PER_MINUTE = 20` |
| Auth | same `__Host-pi_remote_session` + Tailscale identity headers as other POSTs |
| Filename | ignore client filename; store `att_<opaque>` |

Relay stores bytes in a **session-scoped temp** (memory or 0600 file under a relay temp dir), keyed by opaque id, TTL **120 s** or until the host ACKs consume. After `prompt.submit` succeeds, relay hands bytes to the host over the existing local RPC as `ImageContent` (this is the field that already exists on `PromptCommand`) **or** writes a host inbox file and passes `@.pi-remote/inbox/<id>.jpg` — matching Claude Remote Control’s photo-vs-file split. Prefer **inline image content to `pi`** for photos (Claude’s current Remote Control behavior). Then **delete relay temp**. Crash before ACK → TTL reaper deletes; fail closed, user retries.

Do not persist originals in the transcript store. Do not log base64. Do not put GPS into any DTO.

**Host/extension plan mode:** attachments are **context**, not writes. The host must not copy inbox bytes into the project tree without the existing ticketed write path. Plan-mode `pi` still receives the image (read). This is the opposite of DeepSeek Expert hiding upload.

### 2.7 Redaction and transcript

User turn layout stays a right-aligned bubble (existing Claude-like research). Attachments are **cards inside the user turn**, not a second transcript kind that looks like assistant artifacts.

**Wire block (redacted):**

```ts
{
  kind: "user_media",
  attachmentId: OpaqueId,
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/gif",
  byteLength: number,          // processed size
  width: number,
  height: number,
  sha256: string,              // hex, of processed bytes
  status: "delivered" | "dropped" | "redacted"
}
```

**Never** include `data`, object URLs, filenames, EXIF, or paths. The phone may render a **local** thumbnail from the still-alive object URL for the sending session only. After reload / other device: show a 56×56 parchment placeholder + `"Photo · 1280×720 · 420 KB"` (Inter 12–13 px, `--ink-muted`). That is redaction-everywhere: the relay snapshot cannot leak pixels to a second enrolled device unless a future explicit **pixel-replay** ticket exists (default off).

Assistant references to the image stay text. If `pi` echoes a path like `/var/folders/…/att_…jpg`, the existing redaction policy must treat inbox paths as redacted fields (same as file diffs today: `"Redacted file diff"` in [`App.tsx`](apps/pi-remote-web/src/App.tsx)).

Dropped/failed: keep the card footprint (no layout jump), `status: "dropped"`, alert text `"Photo didn't reach Pi."`

### 2.8 A11y extras (RAC)

- `FileTrigger` + `Button` from `react-aria-components` (already in the composer).
- Staging list: `role="list"` / each chip `role="listitem"`.
- Remove: `aria-label={`Remove photo ${i + 1} of ${n}`}`.
- During Uploading: `aria-busy="true"` on the tray; send button `aria-disabled`.
- Reduced motion as above.
- Do not announce each canvas resize step.

### 2.9 Exact interaction sequence (happy path)

1. User taps **Attach** (44 pt, left of `+`).
2. iOS sheet: Take Photo or Video / Photo Library / Browse.
3. User picks 1–4 photos. iOS may pause on Add while converting HEIC (unavoidable; show no in-app spinner until `onSelect` fires — a spinner during the system picker is impossible).
4. Worker processes; chips appear in ≤ 300 ms for already-JPEG screenshots, longer for 48MP.
5. User types optional caption (`Reply to Pi` placeholder unchanged).
6. User taps Send (clay circle). Ticket mint → N attachment POSTs → `prompt.submit` with `attachmentIds`.
7. User bubble shows chips + caption. Relay snapshot later shows placeholders + metadata, not pixels.
8. Host `pi` receives images as message content (Claude Remote Control photo path).

Cancel: sheet dismiss with no files → no state change. Mid-upload failure → chips remain, bytes local, ticket is spent (one-use) → next Send mints a new ticket and re-POSTs (idempotency key = `submissionId:index` so a retried POST does not duplicate host images).

---

## 3. Divergent / minority ideas (do not converge away)

1. **Keep attach inside `+` (Claude/ChatGPT/Gemini).** One control, fewer 44 pt targets on a 390 pt phone. Cost: Photos next to Plan, and the plus `aria-label` becomes a lie. Worth an A/B only if the left cluster feels crowded after bumping to 44 pt.

2. **Camera as a first-class composer glyph** (Mobbin ChatGPT camera-in-field; Meta/Gemini Camera row). A second 44 pt control for `capture="environment"` makes “photo of the error on my laptop” one tap, not sheet → Take Photo. Cost: three left controls (Camera, Attach, Plus). Coding-agent primary job is **gallery screenshots already on the roll**, not live camera.

3. **WhatsApp markup editor before send** ([Mobbin WhatsApp image flow](https://mobbin.com/explore/flows/c5841e58-0961-4da8-abe0-6d4171e9a758)). Crop + arrow overlay is genuinely useful for “look at this button.” It is a second product. Do not block v1 on it; leave a `annotate` stub off.

4. **Host-file-only, never vision** (Claude Remote Control’s *non-photo* path for every attachment). Write JPEG into the project inbox and send `@.pi-remote/inbox/…` as text. Works with text-only models the way Kimi filters models. Cost: `pi` must `Read` a binary; some models won’t see pixels; inbox is a write (plan-mode conflict). Use as **fallback** when the host reports no `image_in`.

5. **Kimi-style auto model filter.** If the host model cannot take images, disable Attach with an explanation, don’t fail at send. Opposite of silent drop (OpenClaw’s `text-only-image` error is the right tone).

6. **Single-photo v1 (`multiple` off).** Eliminates 48MP×N memory. Conflicts with Gemini 10 / Kimi 9 / “compare these two screenshots,” which is a real coding-agent task. Prefer cap=4 over cap=1.

7. **Skip client resize; trust iOS Automatic JPEG conversion.** Smaller code. OpenClaw’s 48MP bug says this fails. Do not.

8. **Accept HEIC and convert on the host with `sips`.** Avoids shipping a transcoder in the PWA. Relies on a macOS host binary and still needs the relay to accept HEIC (magic-byte 415 would fire). Worse fail-closed story.

9. **Web Share Target / Share Sheet inbound.** Dead on iOS ([matrix](https://www.webshareapi.com/web-share-target-api/)). Do not put it in the iPhone MVP. Android-only later.

10. **Live camera in voice** (Meta AI). No mic in this app; out of charter.

11. **Perplexity/Gemini video + 40–100 MB.** Wrong threat model for a private relay. If video ever lands, it is the Claude “download to host as `@` file” path, never vision inline.

12. **Pixel replay to other enrolled devices.** Convenience vs redaction-everywhere. Default off; would need a second ticketed GET `/api/attachments/:id` with short TTL and audit. Minority for a reason.

13. **iMessage-style “add more” tile as last chip** (OpenClaw PR 73711). Nice; 56×56 dashed parchment tile with `+`. Additive once chips exist.

14. **Don’t allow image-only send** (force a caption). Safer for agent intent, worse than every target app, bad for “here’s the screenshot.” Require caption only if host `image_in` is false.

---

## 4. Open questions + risks

1. **Does the host `pi` session actually accept `PromptCommand.images` today, or is the type vestigial?** The phone cannot discover this without a capability bit. OpenClaw advertises attachment ceilings on hello; Pi should advertise `{ maxImageBytes, maxCount, imageIn: boolean }` on runtime state. Unverified in this pass.

2. **Safari action-sheet copy on current iOS** (“Take Photo or Video” vs “Take Photo”) still includes **Video** even with `accept="image/*"` on some versions. If a `.mov` arrives, 415 it. Needs a device check on iOS 26.

3. **HEIC hang after Add** is an OS UX hole a PWA cannot fix ([Forums 743037](https://developer.apple.com/forums/thread/743037)). Risk: users think Pi froze. Mitigation: disable Attach while the document is hidden? Unreliable. Copy: after 2 s of `visibilitychange` return, toast `"Still converting the photo on iOS…"` is speculative — validate on device.

4. **Raising relay body limits** for `/api/attachments` only is a new attack surface (slowloris, 5 MiB × 32 connections). Needs a dedicated limiter, not a global `MAX_HTTP_BODY_BYTES` bump.

5. **Revision check across N uploads + 1 submit** can race with host tool output. Spec uses one `expectedRevision` at first upload; submit may 409. Product choice: freeze staging until snapshot catches up, or retry submit without re-upload (relay still holds TTL blobs).

6. **Plan mode vs inbox write.** If the implementation takes the `@file` fallback, Plan must not write the inbox. Vision-inline avoids this. Decide before coding.

7. **Second enrolled device** will not see pixels. Users comparing to Claude (which syncs images through Anthropic) will call it a bug. It is a redaction feature. Copy must say `"Photo on this phone"` vs `"Photo (hidden)"`.

8. **EU standalone PWA caveats** ([MagicBell 2026 PWA limits](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)) do not remove `<input type="file">`, but they do remove some install chrome. Attach still works in a Safari tab.

9. **Mobbin evidence is paywalled video.** Flow URLs are real; frame-by-frame layout numbers from Mobbin videos were **not** visually inspected this pass (no authenticated Mobbin MCP). Treat Mobbin as flow identity + captions, not pt measurements. Pt measurements in the in-repo `docs/design-reference/mobile-chat-apps/research-gpt-luna.md` are a prior pass.

10. **ChatGPT per-message image count** and **Perplexity per-message file count** are not first-party. Do not encode 10 into the protocol.

11. **DeepSeek MB cap** is unpublished. Do not cite it as a requirement.

12. **Token cost:** a 1568² image is hundreds to thousands of visual tokens (`⌈w/28⌉×⌈h/28⌉`). Four screenshots can dominate a small `pi` context. Cap=4 is also a context decision, not just bandwidth.

---

## 5. Sources

### First-party product docs
- https://support.claude.com/en/articles/8241126-upload-files-to-claude
- https://support.claude.com/en/articles/8114491-get-started-with-claude
- https://support.claude.com/en/articles/10263469-using-claude-app-intents-shortcuts-and-widgets-on-ios
- https://platform.claude.com/docs/en/build-with-claude/vision
- https://code.claude.com/docs/en/remote-control
- https://code.claude.com/docs/en/mobile
- https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq
- https://help.openai.com/en/articles/8555545-file-uploads-faq
- https://support.google.com/gemini/answer/14903178?co=GENIE.Platform%3DiOS&hl=en
- https://support.google.com/gemini/answer/13275745?hl=en&co=GENIE.Platform%3DiOS
- https://www.perplexity.ai/help-center/en/articles/10354807-file-uploads.html
- https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html
- https://moonshotai.github.io/kimi-code/en/guides/interaction.html
- https://www.meta.com/help/artificial-intelligence/943942350800511/
- https://www.meta.com/help/artificial-intelligence/517678174532704/
- https://ai.meta.com/learn/ai-creativity/how-to-edit-photos-with-meta-ai/
- https://api-docs.deepseek.com/news/news250115/
- https://apps.apple.com/us/app/claude-by-anthropic/id6473753684
- https://apps.apple.com/ca/app/kimi-kimi-k2-6-is-live/id6474233312
- https://apps.apple.com/us/app/meta-ai/id1558240027

### Apple / web platform
- https://developer.apple.com/videos/play/wwdc2020/10652/ (Meet the new Photos picker)
- https://developer.apple.com/videos/play/wwdc2020/10641/ (Limited Photos Library)
- https://developer.apple.com/videos/play/wwdc2021/10046/ (Improve access to Photos)
- https://developer.apple.com/videos/play/wwdc2023/10107/ (Embed the Photos Picker)
- https://developer.apple.com/documentation/photosui/phpickerviewcontroller
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture
- https://discussions.apple.com/thread/255145186 (Safari “Private Access” picker)
- https://developer.apple.com/forums/thread/816515 (no folder picker for iOS web apps)
- https://developer.apple.com/forums/thread/743037 (iOS 17 picker Format Automatic vs Current)
- https://developer.apple.com/forums/thread/743049 (Safari 17 `accept=image/heic` transmute)
- https://stackoverflow.com/questions/79071642/iphone-automatically-converting-heic-hevc-files-when-using-input-type-file
- https://www.webshareapi.com/web-share-target-api/ (iOS Share Target = no)
- https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/

### Mobbin
- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 — Claude iOS image-input chat
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS text-input chat
- https://mobbin.com/explore/screens/448b88ea-3923-427c-aead-5488541ff56e — Claude iOS uploading
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 — Claude iOS chat detail + upload
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 — ChatGPT iOS composer + camera icon
- https://mobbin.com/explore/flows/e5b8846f-e7bb-481a-82bd-47f29bfb6653 — Google iOS Asking Gemini (image upload)
- https://mobbin.com/explore/flows/f922cc48-a6ba-417c-8db3-5616d7b4837a — Gemini Web prompt with image
- https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4 — DeepSeek iOS chat
- https://mobbin.com/explore/screens/fbb8cf1f-aee6-4f00-8b0a-57a6ba949560 — ClickUp iOS gallery / take photo / file
- https://mobbin.com/explore/flows/c5841e58-0961-4da8-abe0-6d4171e9a758 — WhatsApp iOS send image (edit-before-send)
- https://mobbin.com/explore/screens/f6cbe4e8-8404-4d91-8059-fc98e2c0db5b — Slack iOS attachment options

### GitHub prior art (coding-agent / remote clients)
- https://github.com/openclaw/openclaw/blob/8d535fb0/apps/shared/OpenClawKit/Sources/OpenClawChatUI/ChatComposer.swift
- https://github.com/openclaw/openclaw/blob/b8ed2c32/src/gateway/chat-attachments.ts
- https://github.com/openclaw/openclaw/pull/116188 (advertise attachment limits)
- https://github.com/openclaw/openclaw/pull/72612 (reject oversize before FileReader)
- https://github.com/openclaw/openclaw/issues/68524 (iOS 48MP OOM)
- https://github.com/openclaw/openclaw/pull/81608 (JPEG transcode + EXIF strip)
- https://github.com/openclaw/openclaw/issues/61041 (auto-resize vs 5 MB reject)
- https://github.com/manaflow-ai/cmux/pull/6102 (iOS composer paperclip + chips + JPEG 0.8)
- https://github.com/anthropics/claude-code/issues/16169 (HEIC breaks sessions)
- https://github.com/anthropics/anthropic-sdk-python/issues/1589 (HEIC not in Vision API)
- https://github.com/deepseek-ai/DeepSeek-V3/issues/1406 (Expert mode hid uploads)
- https://github.com/skrodahl/NewTon/discussions/4 (iOS label-gesture + HEIF object URL)

### Secondary walkthroughs (labeled where not first-party)
- https://www.testingcatalog.com/anthropic-begins-testing-voice-mode-with-three-voices-in-claude-app/
- https://www.techrepublic.com/article/news-anthropic-claude-ai-app-conversational-voice-mode/
- https://techbink.com/how-to-upload-files-to-claude/
- https://www.youtube.com/watch?v=R6Zld3_cq0g (Kimi Photos via `+`)
- https://www.pocket-lint.com/deepseek-ai-guide/
- https://deepseekai.guide/guides/deepseek-on-iphone/
- https://www.datastudios.org/post/perplexity-ai-file-upload-and-reading-formats-limits-and-workflow-integration
- https://perplexityaimagazine.com/perplexity-hub/how-to-use-perplexity-ai-on-iphone/
- https://hotshot.co/how-to-upload-images-to-chatgpt/
- https://devnote.in/fix-ios-safari-input-typefile-not-opening-camera-real-solution/
- https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide

### This repo (current-state evidence)
- `apps/pi-remote-web/src/SessionComposer.tsx` — plus = Mode/commands, no attach
- `apps/pi-remote-web/src/style.css` — 2.5rem (40 px) plus/send
- `apps/pi-remote-web/src/App.tsx` — enrollment `input type="file" accept="image/*"`
- `apps/pi-remote-web/src/relay.ts` — `prompt.submit` has no images
- `packages/pi-rpc-protocol/src/types.ts` — `ImageContent` on host prompt; not on `PromptSubmitCommand`
- `packages/pi-rpc-protocol/src/guards.ts` — closed key set on `prompt.submit`
- `apps/pi-remote-relay/src/http/server.ts` — 16 384 B HTTP / 65 536 B WS
- `docs/design-reference/mobile-chat-apps/research-gpt-luna.md` — prior composer chrome pass (not attach-lane)
