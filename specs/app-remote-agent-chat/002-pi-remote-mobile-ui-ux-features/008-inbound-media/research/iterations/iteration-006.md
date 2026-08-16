<!-- provenance: external-CLI orchestration pass; original file iter-06-grok.md -->
> **Source pass 6** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-6-grok.md`.

<!-- F8-inbound-media | model=grok | lens=prior-art-github | iter 6/15 | 2026-08-16T04:36:08.407Z -->

# Iteration 6 — Prior-art GitHub: inbound screenshot/image preview

Lens: remote-CLI / coding-agent chat apps and mobile clients that already move pixels into a transcript. Grounded in public repos, protocol specs, and this repo’s current wire types. Not a visual-taste pass.

---

## 1. Findings (iPhone PWA + this stack)

### 1.1 The local gap is asymmetric, not “no images anywhere”

Pi Remote already has **outbound** image content on commands:

```12:16:packages/pi-rpc-protocol/src/types.ts
export interface ImageContent extends JsonObject {
  readonly type: 'image';
  readonly data: string;
  readonly mimeType: string;
}
```

`prompt` / `steer` / `follow_up` accept `images?: ImageContent[]`. That is the F5 shape: **unbounded base64 on the command**, never a transcript kind. Durable transcript kinds are only `text | thinking | plan | tool_call | tool_result | file_diff | usage`. Unknown-but-shape-valid blocks already fail to an “Unsupported block” row that names `originalKind` ([typed-block-transcript.md](docs/feature-catalog/pwa/typed-block-transcript.md); `App.tsx` `case 'unknown'`).

Host pi RPC matches the outbound side and **still does not document an assistant image block**. `UserMessage.content` may be `TextContent | ImageContent`; `AssistantMessage.content` is `text | thinking | toolCall`; `ToolResultMessage.content` examples are text-only; `Attachment` is `{ id, type: "image", fileName, mimeType, size, content, extractedText, preview }` ([badlogic/pi-mono `packages/coding-agent/docs/rpc.md`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)). So inbound preview is not “add `ImageContent` to the PWA.” It is: **detect, sanitize, pointerize, and render** something pi does not yet emit as a first-class inbound type.

Canonical redaction already strips POSIX/Windows paths and secret-shaped strings before persistence ([canonical-redaction.md](docs/feature-catalog/transport-and-state/canonical-redaction.md); `PATH_KEYS` includes `path`, `cwd`, `fulloutputpath`, `sessionfile`, `workspacepath`). Any design that stores `/Users/…/Screenshot.png` in the ledger, or rides raw `data:` URLs in sync envelopes, fights that policy.

### 1.2 Four delivery families in the wild (do not pick the first one)

Prior art collapses into four families. Only one is compatible with “opaque artifact id + revision + digest, no raw host paths, no unbounded bytes in durable state.”

| Family | What the client stores | Who does it | Tradeoff vs Pi Remote |
|---|---|---|---|
| **A. Inline base64 in JSON** | `{ type: "image", data, mimeType }` in prompts, tool results, ACP/MCP content | ACP, MCP tools, Copilot SDK inbound, pi RPC outbound | Simple; poisons replay, balloons WS/JSONL, iPhone memory death, no digest/revision |
| **B. Host path in the transcript** | `file:///…` or `/abs/path.png` pasted or markdown-inlined | copilot-remote, pi-agent-dashboard markdown, OpenCode `file:` URIs, Kimi `@` paths | Tiny JSON; **fails this security posture** (paths are redacted; phone cannot read the Mac disk) |
| **C. Bytes-on-the-stream, once** | Custom channel (`pi-asset:`) carrying unique bytes once per session | pi-agent-dashboard | Avoids extra HTTP; still puts pixels on the chat pipe; no CAS digest; markdown still contains host paths |
| **D. Pointer + CAS/HTTP fetch** | Opaque id; bytes fetched separately under auth | Copilot SDK *file vs blob* split (runtime-side); Pi in Pocket “allowlisted path streamed to phone”; OpenCode materialize-then-admit | Matches the desired relay artifact; needs a GET that iOS `<img>` can use (cookie or blob URL, **not** `Authorization` headers) |

### 1.3 Protocol prior art (the content-block grammar)

**Agent Client Protocol (ACP)** uses MCP-identical content blocks. Image is:

```json
{ "type": "image", "mimeType": "image/png", "data": "<base64>", "uri": "<optional>" }
```

It is optional, gated by prompt capability `image`. The same block appears in `session/prompt`, streamed `session/update`, **and tool-call `content`** (`type: "content"` wrapping a content block). ACP also has `resource_link` (URI + name + mimeType + size, no bytes) and `embedded resource` with `BlobResourceContents { uri, blob, mimeType }` ([ACP v2 content](https://agentclientprotocol.com/protocol/v2/content); [ACP v2 tool calls](https://agentclientprotocol.com/protocol/v2/tool-calls); [ImageContent TS](https://agentclientprotocol.github.io/typescript-sdk/types/ImageContent.html)).

Build implication: **do not invent a one-off `{kind:'image', data}`**. Align the *semantic* fields with ACP/MCP (`mimeType`, optional `uri` that we **never persist as a host path**, annotations). Replace `data` on the durable transcript with `{ artifactId, revision, digest }`. Keep ACP’s lesson that tool results are a first-class image source, not only “assistant said here’s a picture.”

**MCP tool results** already define ImageContent as `{ type: "image", data, mimeType, annotations? }` and ResourceLink as a URI without bytes ([MCP 2025-11-25 tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)). `annotations.audience: ["user"]` is the closest spec flag to “show this to the human, don’t dump it into the model as text.” Clients that ignore the distinction fail badly (below).

**GitHub Copilot SDK** is the closest *coding-agent* inbound spec: tools that return screenshots emit `"image"` blocks `{ type, data, mimeType }` on `tool.execution_complete`. Outbound is split: `type: "file"` + absolute `path` (runtime reads disk, converts, **auto-resizes** to `capabilities.limits.vision.max_prompt_image_size`) vs `type: "blob"` + base64 (in-memory screenshots). SVG is explicitly unsupported. Vision is capability-gated (`supports.vision`, `supported_media_types`, `max_prompt_images`, `max_prompt_image_size`) ([copilot-sdk `docs/features/image-input.md`](https://github.com/github/copilot-sdk/blob/main/docs/features/image-input.md)).

Build implication: **inbound tool screenshots are a solved event name** (`tool.execution_complete` / ACP `tool_call_update.content`). Pi Remote’s projector already maps bash/tool events → `tool_result` text. The missing piece is a **side-channel artifact**, not a new WS event family. Do **not** copy Copilot’s persistence of `data` into the ledger.

### 1.4 GitHub clients that are actually remote/mobile (the product class)

These are the repos that share Pi Remote’s job: phone/PWA talking to a host CLI over a private network.

**BlackBeltTechnology/pi-agent-dashboard** ([repo](https://github.com/BlackBeltTechnology/pi-agent-dashboard)) — closest pi-specific inbound renderer. Agents write `![alt](/abs/path.png)` or `![alt](./relative.png)`; the bridge inlines bytes on a streaming-safe `pi-asset:` channel; **each unique image’s bytes ride exactly once per session** even if streaming chunks repeat the token. Caps: **5 MB/image, 20 MB/message**; PNG/JPEG/GIF/WebP/SVG/AVIF/BMP; oversized/unreadable → visible placeholder, not a broken `<img>`. **Zero new HTTP routes.** Tradeoffs vs this app: (1) markdown still contains host paths, which our redactor will turn into `[REDACTED_PATH]` and break the token; (2) SVG/AVIF/BMP are XSS / decode-risk on a PWA; (3) bytes on the chat pipe fight iPhone memory and JSONL retention; (4) no digest/revision, so a rewritten file at the same path is invisible.

**huy-le/pi-bridge + Pi in Pocket** ([bridge](https://github.com/huy-le/pi-bridge), [App Store](https://apps.apple.com/us/app/pi-in-pocket-agent-viewer/id6766181905), [product](https://huddee.com/projects/pi-in-pocket)). Native SwiftUI iPhone client over Tailscale; bridge is `pi --mode rpc` + HTTP/WS + bearer token. Public bridge README documents sessions/prompt/steer/events — **no artifact GET**. LinkedIn/product copy states the iOS app can **attach photos outbound** and **preview agent-generated media (video, audio, images) streamed from an allowlisted path on the Mac**. That is family D, closed-source on the phone. Bridge does **not** yet publish an allowlist/digest contract. Treat “allowlisted path + stream” as the existence proof, not a copyable API. Token-in-query-string for WS (`/sessions/:id/events?token=`) is an anti-pattern for artifact URLs (Referer/logs).

**ygncode/pi-web** ([repo](https://github.com/ygncode/pi-web), [site](https://ygncode.github.io/pi-web/)): PWA for pi, “text, images, model switching” on resume. Token auth + Tailscale. No published sanitizer/CAS. Use as UX confirmation that pi users expect images in the mobile session, not as a security design.

**shannonfritz/copilot-portal** ([repo](https://github.com/shannonfritz/copilot-portal)) and fork **swigerb/squad-uplink**: installable PWA, QR/LAN/DevTunnel, **outbound** paste/drag/pick image attachments into Copilot CLI. Architecture: Browser → portal WS → Copilot SDK JSON-RPC. Documents vision in the model picker. **No inbound artifact id.** Mobile composer pattern is useful for F5 parity, not for inbound.

**kubestellar/copilot-remote** ([repo](https://github.com/kubestellar/copilot-remote)): React PWA + xterm. Drag image → upload to `/tmp/copilot-remote-uploads/` → **paste the host path into the terminal**. Explicit family B. On iPhone this is unusable (no drop target) and for us it is a redaction violation. Also “grab last commands” / tiled terminals — different product.

**willscott-v2/hermes-mobile-pwa** ([repo](https://github.com/willscott-v2/hermes-mobile-pwa)): React/Vite iPhone PWA, Tailscale-friendly, **attachment chips until upload succeeds**, transcript cleanup that **hides tool JSON**. Outbound screenshots/PDFs. Service worker is **app-shell only** (never caches API/WS). Copy that SW rule: artifact bytes must not be SW-cached as durable chat.

**wesnel/agent-shell-web** ([repo](https://github.com/wesnel/agent-shell-web)): Emacs-hosted PWA; transcript is `buffer-substring-no-properties` — **text only**. Proof that many remote-CLI phones never see images because the host protocol is a TTY.

**giuliastro/harness-remote** ([repo](https://github.com/giuliastro/harness-remote)): PWA/Android/Electron control plane for OpenCode, Claude Code, Codex, PI via ACP. Images would arrive as ACP ImageContent (family A) unless the control plane pointerizes them. Evidence that **ACP is the interop grammar** if pi ever grows an ACP bridge.

### 1.5 Host agents: outbound-strong, inbound-broken (the failure catalog)

These are not mobile PWAs, but they are the systems pi will interoperate with. Their bugs are the ones we must not re-ship.

**OpenCode** ([attachments docs](https://opencode.ai/v2/docs/attachments)): allowlist **PNG/JPEG/GIF/WebP**; SVG is **text, not image**; HTTP(S) attachment URLs **rejected**; data URLs allowed then materialized; **20 MiB decoded/item**; `read` tool 20 MiB; configurable `media.image`: `auto_resize` default true, `max_width/height` 2000, `max_base64_bytes` 5_242_880. If the resizer cannot load, `read` **returns the original image** — documented as **not a security boundary**. Capability gating: if `modalities.input` lacks `"image"`, attachments are **stripped client-side** ([anomalyco/opencode#20802](https://github.com/anomalyco/opencode/issues/20802)). Plugins (`alfaoz/opencode-see-image`, `showlotus/opencode-image-vision`, `martinmose/opencode-vision-bridge`) **replace pixels with prose** so text-only models work. That is the opposite of a human preview card.

**Kimi Code** ([MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code); [interaction docs](https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html); [tools.md](https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/reference/tools.md)): target-bar CLI. Paste image/video (`Ctrl-V` / `Alt-V`) → **placeholder chip in the input**, swapped for real media on submit. `ReadMediaFile` is auto-allow, **100 MB** file cap, compressed to model limits; if compression cannot meet limits it **errors without sending originals**. Speaks ACP (`kimi acp`). `kimi web` / `kimi vis` exist but are not a redacted PWA. Target-bar UX to copy: **composer placeholder, not silent attach**; **fail closed on oversize**; do **not** copy the 100 MB cap onto an iPhone.

**Cline / Playwright MCP / Continue / Claude Code / LM Studio** — inbound ImageContent is where the ecosystem currently loses:

- Continue drops MCP image blocks; Playwright `browser_take_screenshot` succeeds, model never sees pixels ([continuedev/continue#8898](https://github.com/continuedev/continue/issues/8898)).
- Claude Code prefers `structuredContent` and **discards** `content[]`, flattening ImageContent to JSON/base64 text (~10–20× tokens, no vision) ([anthropics/claude-code#54737](https://github.com/anthropics/claude-code/issues/54737), [#31208](https://github.com/anthropics/claude-code/issues/31208)).
- LM Studio **does** show an image in chat, but replaces MCP ImageContent with `{ markdown: "![Image](./file.png)", $hint: "Present the image…" }` so the model hallucinates ([lmstudio-bug-tracker#1746](https://github.com/lmstudio-ai/lmstudio-bug-tracker/issues/1746)). Dual lesson: **UI preview ≠ model vision**; **markdown path hints leak and don’t work on a phone**.
- browser-use: inline PNG blobs in MCP results **poison later Anthropic turns** (`Could not process image`); they moved to temp files + path, then to MCP ImageContent, then **away from inline blobs again** ([browser-use#3934](https://github.com/browser-use/browser-use/issues/3934), [PR #4255](https://github.com/browser-use/browser-use/pull/4255), [PR #4743](https://github.com/browser-use/browser-use/pull/4743)). Durable replay of raw screenshots is a known foot-gun.

**Vision-bridge pattern** ([DEV write-up](https://dev.to/kuaamu/give-your-text-only-coding-agent-eyes-5-minute-setup-4eh7)): never put images in agent context; return text. Fine for models, useless for “let the operator see the screenshot pi just took.”

### 1.6 Target-bar mobile UX (Claude iOS / Kimi / Mobbin), constrained to this lens

Local teardown of Claude iOS (this repo, ~390pt): **artifact cards** in the assistant turn — ~16px radius, hairline, near-canvas fill, title + muted subtitle, **small tilted thumbnail on the right**, optional `1 artifact` pill above the turn ([01-visual-teardown.md](docs/design-reference/mobile-chat-apps/01-visual-teardown.md); staged `screens/claude-conversation-actions.png`). Council plan already requires attachment/artifact cards associated with the owning turn, 44pt operable, not exceeding the 320px prose column ([council-gpt-sol.md](docs/design-reference/mobile-chat-apps/council-gpt-sol.md)).

Mobbin MCP (`mobbin_get_screen_detail`) returns **inline image content blocks** on Claude desktop/web so the human sees what the agent sees ([aos-engineer/mobbin-mcp](https://github.com/aos-engineer/mobbin-mcp); [LinkedIn, Jian Jie Liau](https://www.linkedin.com/posts/liaujianjie_the-mobbin-mcp-now-displays-the-screens-inline-activity-7465351105502294016-qvs1)). The same thread: **inline thumbs are too small for dense SaaS screens; users ask for a real fullscreen, not a modal that dumps them onto mobbin.com.** That is the F6 requirement, empirically.

iPhone PWA constraints that GitHub native viewers assume away:

- `element.requestFullscreen()` is **unsupported on iPhone**; manifest `"display": "fullscreen"` falls back to `standalone` ([firt.dev iOS PWA](https://firt.dev/notes/pwa-ios); [fozzedout gist](https://gist.github.com/fozzedout/5e77925381991a9570151550992baf14)). F6 must be an **in-app overlay**, not the Fullscreen API.
- `<img src>` **cannot send `Authorization`**. Artifact GET must be session-cookie (already in [application-sessions](docs/feature-catalog/auth-and-boundary/application-sessions.md)) or `fetch` → `blob:` URL. One-use mutation tickets ([one-use-tickets](docs/feature-catalog/auth-and-boundary/one-use-tickets.md)) **must not** be reused for `<img>` (virtualizer remount, back-swipe, and thumbnail+full would each burn the ticket).
- Do not set `user-scalable=no` / `maximum-scale=1` — WCAG 1.4.4; pinch-zoom on the **viewer** is required, on the **transcript** it should not fight Safari ([grove#20](https://github.com/GarrickZ2/grove/pull/20)).
- Standalone + `viewport-fit=cover`: overlay chrome uses `env(safe-area-inset-*)`; `100dvh` lies ([Stack Overflow 79902310](https://stackoverflow.com/questions/79902310/ios-pwa-add-to-home-screen-white-gap-below-bottom-navigation-bar-100dvh-does)).
- Hermes PWA: SW caches app-shell only. Artifact responses: `Cache-Control: private, no-store`.

### 1.7 What “inbound analog of F5” actually means on this wire

F5 (outbound) today: command carries `{ type, data, mimeType }`. Relay should already refuse oversized/non-allowlisted outbound; that is a separate ticket.

Inbound analog is **not** “put `images[]` on `tool_result`.” It is:

1. **Host/extension emits pixels** (today: markdown path, future: ACP/MCP ImageContent, Copilot-style tool image, pi `Attachment`).
2. **Relay intercepts before `redactEnvelope`**, because path redaction will destroy markdown tokens and base64-in-JSON will skip path redaction and **land unbounded bytes in the ledger**.
3. **Sanitize → CAS → pointer block** with `{ id, revision, seq, occurredAt, kind: 'image', artifactId, digest, mimeType, width, height, byteLength, alt, status }`.
4. PWA renders a Claude-like card; tap opens **shared F6** overlay using a cookie-auth GET `.../artifacts/{artifactId}?rev=&digest=`.

---

## 2. Concrete spec a build phase can execute

### 2.1 Wire: new transcript kind (additive, fail-closed)

Extend `TranscriptBlock` with `ImageBlock`. Do **not** put `data` on it. Unknown clients already have `unknown` / unsupported rendering.

```ts
interface ImageBlock extends TranscriptBlockBase {
  readonly kind: 'image';
  readonly artifactId: string;      // opaque, 128-bit hex / ULID; not a path
  readonly digest: string;          // sha256:<hex> of SANITIZED bytes
  readonly mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  readonly byteLength: number;      // sanitized full object
  readonly width: number;
  readonly height: number;
  readonly alt: string;             // already redacted; default "Screenshot" | "Image"
  readonly role: 'assistant';       // inbound; user outbound stays F5
  readonly status: ImageBlockStatus;
  readonly source: ImageSource;
}

type ImageBlockStatus =
  | 'pending'          // projector saw a candidate; CAS not ready
  | 'ready'            // digest exists; thumb may 404 until generated
  | 'rejected'         // type/size/magic mismatch; no artifact
  | 'redacted'         // policy refused to persist pixels
  | 'missing';         // CAS GC or digest mismatch at read

interface ImageSource {
  readonly via: 'tool_result' | 'markdown_ref' | 'mcp_image' | 'attachment_echo';
  readonly toolName?: string;       // redacted summary only, no args
}
```

Revision semantics: same as every other block (`id` stable, highest `revision` wins). A replacement screenshot of the same logical slot increments `revision` and **must** change `digest`. Sync payload is the pointer only.

**Explicitly forbidden on the ledger / sync envelope:** `data`, `content`, `path`, `uri` with `file:`, `fulloutputpath`, host `fileName` with directories, EXIF blobs, `preview` base64.

### 2.2 Relay sanitization (the actual security boundary)

Pipeline, fail closed, **before** `redactEnvelope`:

1. **Admit candidates**
   - Future: pi/ACP/MCP `{ type: "image", data, mimeType }`.
   - Today: `tool_result.output` markdown `![alt](url)` where url is `file:`, relative, or absolute POSIX/Windows (dashboard pattern).
   - Do **not** admit `http(s):` (OpenCode rejects these; SSRF).
   - Do **not** treat SVG as an image (OpenCode: SVG is text; Copilot: SVG unsupported; XSS in `<img src=data:image/svg+xml>`).
2. **Read cap:** 5 MiB encoded **or** 8 MiB decoded, whichever first (dashboard 5 MB; OpenCode 20 MiB is too large for iPhone + JSONL). Kimi’s 100 MB is a hard no.
3. **Magic-byte sniff**, ignore declared extension. Allow JPEG/PNG/WebP/GIF only. GIF: persist **first frame** as JPEG/WebP for thumb; full object may stay GIF if ≤ cap.
4. **Re-encode** (strip EXIF/GPS/ICC; kill polyglots). Prefer WebP or JPEG. If decode fails → `status: 'rejected'`, reason `undecodable`. This is the step OpenCode admits is missing when the resizer fails.
5. **Dimension cap:** max edge 2000 px (OpenCode default). Preserve aspect. If `auto_resize` analog fails → reject, do not store originals.
6. **Digest** SHA-256 of sanitized bytes. Store CAS object keyed by digest (content-addressed; identical shots dedupe across sessions).
7. **Thumb:** max edge 720 px, WebP q~80, separate digest `thumbDigest` optional field or `GET ...?variant=thumb`.
8. **Alt:** markdown alt or `Screenshot` / `Image`; run `redactString`. Never put the host basename if it matches `POSIX_PATH_PATTERN`.
9. **Stamp** envelope `redaction.reasons` with `image-sanitized` (new reason) and **zero** path leftovers.

If any step fails: emit `ImageBlock` with `status: 'rejected' | 'redacted'`, **no** `artifactId` fetchable, visible placeholder copy (dashboard: placeholder, not broken glyph).

### 2.3 Delivery (iPhone-safe GET)

```
GET /v1/sessions/{sessionId}/artifacts/{artifactId}?rev={n}&digest=sha256:{hex}&variant=thumb|full
```

- Auth: **application-session cookie** (same as transcript pages). No bearer in query string (pi-bridge WS anti-pattern).
- Fail closed if `rev` or `digest` mismatch (CAS swapped).
- Headers: `Content-Type` from sniffed mime; `X-Content-Type-Options: nosniff`; `Cache-Control: private, no-store`; `Content-Length`.
- **Not** one-use tickets. Tickets stay mutation-only.
- PWA: `fetch` with credentials → `URL.createObjectURL` → `<img src=blob:…>`; `revokeObjectURL` on unmount / revision change. Do not assign the authenticated URL to `<img src>` if cookie SameSite ever breaks in standalone; blob is the reliable iOS path.
- SW: never cache this route (Hermes rule).

Projector: when a `tool_result` is **only** an image candidate, still keep a collapsed `tool_result` row (Continue/Claude Code taught: dropping `content` loses the image; flattening to text wastes tokens). Promote `ImageBlock` as a sibling, same turn, after the tool row — Claude artifact placement.

### 2.4 UI states (card + F6)

Card lives in the owning assistant turn, **promoted** like `file_diff` / `plan`, not inside `TurnEvidenceStack` collapse.

| State | Card | F6 |
|---|---|---|
| `pending` | 16px-radius bone card, clay pulse on 72×72 thumb slot, subtitle “Receiving screenshot…”, `aria-busy` | Do not open; tap no-ops |
| `ready` | Thumb `object-fit: cover` 72×72, title “Screenshot” / redacted alt, subtitle `{width}×{height} · JPEG`, chevron | Opens |
| `loading-full` (viewer only) | unchanged | Scrim + spinner; previous thumb as LQ placeholder |
| `rejected` | Same card chrome, no thumb, subtitle “Couldn’t preview this image”, no tap-to-open | n/a |
| `redacted` | Card, subtitle “Redacted”, no pixels | n/a |
| `missing` | Card, subtitle “Preview expired”, retry fetch once | Close + same copy |
| `unknown` kind (old client) | existing unsupported row | n/a |

**Gestures (iPhone PWA overlay, Photos-class; F6 shared with outbound):**

- Card tap / Enter / Space → open F6 (`react-aria-components` `Dialog` + `Modal`, `isDismissable`).
- F6: **pinch-zoom 1–5×**, **double-tap zoom-to-point** (HImageViewer lesson: zoom-to-center is wrong), **pan when zoomed**, **swipe down to dismiss** if scale≈1 (threshold ~100pt or velocity), **horizontal swipe** only if the turn has N>1 images (gallery).
- Tap image toggles chrome (close + caption). Close is 44×44pt, top-right, `safe-area-inset-top`.
- Esc / VoiceOver “Dismiss” closes. Background scrim carbon @ 0.92 dark / 0.88 light.
- Do **not** use Fullscreen API.
- Long-press: iOS system sheet is OK; also expose `Share` via Web Share Level 2 (`files: [sanitized Blob]`) — iOS 15+. Saving to Photos goes through Share, not a fake download link.
- Transcript scroll: `touch-action: pan-y` on the list; viewer overlay `touch-action: none` except the image.

**A11y (WCAG AA, ink-on-parchment):**

- Card: `role="button"`, name `Screenshot, {width} by {height}. Double-tap to view full screen.`
- Rejected: not a button; `role="status"`.
- Focus ring clay 2px, 3:1 non-text contrast (1.4.11).
- Dialog: `aria-modal`, initial focus Close, restore focus to card.
- `prefers-reduced-motion`: no pulse, no swipe physics; instant opacity.
- Don’t announce every streaming thumb decode.

**Visual / motion (fixed DS):**

- Card: 16px radius, 1px hairline, fill bone / dark-canvas, 16–20pt padding, Inter 15/20 title, Inter 13 muted subtitle, Source Serif **not** used on the card (Claude uses sans on artifacts; serif stays on prose).
- Thumb 72×72, 8px radius, no clay except focus/loading.
- Open/close 180ms `ease-out` if motion allowed; shared-element zoom from thumb rect is a plus, not a gate.
- Dark: same geometry; hairline + carbon ink.

**Upload** (inbound is not user upload). If the projector also echoes F5 user images into the transcript, reuse this card with `role: 'user'` and place it on the user bubble (council: user attachments adjacent to the bubble). Same CAS. Same F6.

### 2.5 Client reducer

- New kind in `transcriptReducer`: normalize by `id`, highest `revision`.
- `pending` → `ready` is a revision bump, not a new id (avoid jump-scroll).
- Virtualizer: card min-height 88pt so windowing doesn’t hitch; **never** keep `full` blobs in the block list.
- Demo fixtures: one `ready`, one `rejected`, one `pending` for App.test.tsx (every kind already has a fixture).

---

## 3. Divergent / minority ideas (do not collapse to “new kind + blob URL”)

1. **No new `kind`.** Put a pointer on `tool_result` (`output` stays redacted text; `artifactId` sibling). Matches ACP “image lives on the tool call.” Simpler protocol bump; worse Claude-card promotion (tool rows are collapsible today).
2. **Markdown interceptor only** (dashboard). Ship inbound preview **before** pi grows ImageContent, by rewriting `![…](path)` at the projector. Highest near-term yield; must rewrite the token **before** path redaction or the image vanishes.
3. **Thumb-only durable.** Ledger stores 720px WebP; full-res is RAM/TTL CAS (15 min). iPhone-first; F6 after TTL shows “expired.”
4. **Perceptual hash as `digest`.** Survives re-encode; weaker integrity. Use pHash as `similarityId` **plus** sha256.
5. **`pi-asset:` once-per-session bytes on WS** (dashboard). Avoids HTTP. Fights this repo’s envelope size and iPhone JS heap. Reject for full objects; maybe OK for thumbs < 40 KB.
6. **Vision-bridge dual path:** card for the human, OCR/description for the model. Separate from preview; don’t block F6 on OCR.
7. **Kimi-style video.** Out of scope, but `ReadMediaFile` + Pi in Pocket already mention video. Design `kind: 'media'` with `image | video` now so the union doesn’t rot.
8. **Signed cookie scoped to `artifactId+rev+digest`** instead of the application session (narrower blast radius if XSS). Extra Set-Cookie gymnastics on iOS PWA.
9. **`<img src>` with cookie** and skip blob URLs. Fewer objectURL leaks; more SameSite/standalone risk. A/B behind a flag.
10. **Screenshot vs photograph kinds.** Screenshots get nearest-neighbor upscale and a “Screenshot” badge; photos get cover-crop. Detection: aspect + EXIF `UserComment`/`Window` — brittle; optional later.
11. **Fail open to path paste** (copilot-remote). Explicitly incompatible. Record as exhausted.
12. **Render SVG in a sandboxed iframe.** OpenCode’s “SVG as text” is safer. Don’t preview SVG as an image.
13. **ACP `resource_link` only**, bytes never on device until tap. Best privacy; worst Claude-like inline thumb (need a generated thumb at sanitize time anyway).
14. **Gallery across the session**, not per turn (Photos app). Conflicts with turn-association in the council plan. Keep per-turn; optional “all screenshots” later.

---

## 4. Open questions + risks

1. **Who emits the first inbound pixel?** Until pi adds assistant/tool ImageContent, the only proven host pattern is markdown paths (dashboard) or MCP tools (Playwright/Mobbin). Confirm whether live `pi` tool results ever include ImageContent arrays or only text. If text-only, the markdown interceptor is not optional.
2. **Does F6 already exist as a component in packet 047?** This repo has no viewer. Spec says reuse F6 — build must locate or create one overlay used by F5 outbound **and** inbound.
3. **Ticket vs cookie for GET.** Mutation tickets fail closed; image GET cannot be one-use. Needs an explicit security exception in the auth catalog so it isn’t “fixed” later into tickets.
4. **Redaction vs pixels.** Path/secret string redaction does not see secrets **inside** a screenshot of `.env`. Options: EXIF strip only (ship), optional OCR-and-redact (slow, false positives), or operator kill-switch “don’t persist inbound images.” Unresolved policy.
5. **iOS memory.** A 2000px WebP is fine; a session of 40 screenshots in the virtualizer is not if blobs aren’t revoked. Risk: Safari tab kill. Mitigate: thumb-only in DOM, one full blob at a time.
6. **Replay poison.** browser-use + Anthropic: historic inline images break later turns if they ever flow back into the model. Keep CAS bytes **out of** `get_messages` that the host model sees unless the operator is in a vision turn. Preview ≠ prompt.
7. **structuredContent trap.** If pi/MCP ever returns both `content` (images) and `structuredContent` (JSON with base64), projector must **prefer `content[]` image blocks** (Claude Code’s bug inverted).
8. **Capability gating.** OpenCode silently strips images when `modalities.input` lacks image. If we echo inbound shots back into a steer, check the host model’s `input: ["text","image"]` (pi Model type) or the send will no-op.
9. **Mobbin MCP auth** in this environment is operator-OAuth-pending; live iOS Claude/Kimi screen IDs were not re-fetched this pass. Visual numbers come from the local teardown, not a fresh Mobbin hit.
10. **Pi in Pocket media API is unpublished.** Copying “allowlisted path” without a digest is how host paths leak. Do not implement allowlist-by-prefix.
11. **GIF/WebP animation** in a transcript card will jank and burn battery. First-frame thumbs only.
12. **SW + blob URLs** in standalone iOS: confirm createObjectURL survives bfcache. If not, re-fetch on `pageshow`.

---

## 5. Sources

### This repo
- `packages/pi-rpc-protocol/src/types.ts` — `ImageContent`, transcript kinds
- `apps/pi-remote-relay/src/store/redaction.ts` — path/secret redaction
- `docs/feature-catalog/pwa/typed-block-transcript.md`
- `docs/feature-catalog/transport-and-state/canonical-redaction.md`
- `docs/feature-catalog/auth-and-boundary/one-use-tickets.md`
- `docs/feature-catalog/auth-and-boundary/application-sessions.md`
- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md` (Claude artifact card; `screens/claude-conversation-actions.png`)
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`
- `apps/pi-remote-web/src/App.tsx` — block renderers, `unknown` kind

### Protocols
- https://agentclientprotocol.com/protocol/v2/content
- https://agentclientprotocol.com/protocol/v2/tool-calls
- https://agentclientprotocol.github.io/typescript-sdk/types/ImageContent.html
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md
- https://github.com/github/copilot-sdk/blob/main/docs/features/image-input.md

### GitHub / product prior art (remote + host)
- https://github.com/BlackBeltTechnology/pi-agent-dashboard
- https://github.com/huy-le/pi-bridge
- https://apps.apple.com/us/app/pi-in-pocket-agent-viewer/id6766181905
- https://huddee.com/projects/pi-in-pocket
- https://github.com/ygncode/pi-web — https://ygncode.github.io/pi-web/
- https://github.com/shannonfritz/copilot-portal
- https://github.com/swigerb/squad-uplink
- https://github.com/kubestellar/copilot-remote
- https://github.com/willscott-v2/hermes-mobile-pwa
- https://github.com/wesnel/agent-shell-web
- https://github.com/giuliastro/harness-remote
- https://opencode.ai/v2/docs/attachments
- https://github.com/anomalyco/opencode/issues/20802
- https://github.com/alfaoz/opencode-see-image
- https://github.com/showlotus/opencode-image-vision
- https://github.com/martinmose/opencode-vision-bridge
- https://github.com/MoonshotAI/kimi-code
- https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html
- https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/reference/tools.md
- https://github.com/continuedev/continue/issues/8898
- https://github.com/anthropics/claude-code/issues/54737
- https://github.com/anthropics/claude-code/issues/31208
- https://github.com/lmstudio-ai/lmstudio-bug-tracker/issues/1746
- https://github.com/browser-use/browser-use/issues/3934
- https://github.com/browser-use/browser-use/pull/4255
- https://github.com/browser-use/browser-use/pull/4743
- https://github.com/aos-engineer/mobbin-mcp
- https://www.linkedin.com/posts/liaujianjie_the-mobbin-mcp-now-displays-the-screens-inline-activity-7465351105502294016-qvs1
- https://github.com/bradagi/awesome-cli-coding-agents
- https://dev.to/kuaamu/give-your-text-only-coding-agent-eyes-5-minute-setup-4eh7
- https://github.blog/changelog/2025-03-05-copilot-chat-users-can-now-use-the-vision-input-in-vs-code-and-visual-studio-public-preview/

### iOS PWA / viewer
- https://firt.dev/notes/pwa-ios
- https://web.dev/learn/pwa/enhancements
- https://gist.github.com/fozzedout/5e77925381991a9570151550992baf14
- https://stackoverflow.com/questions/79902310/ios-pwa-add-to-home-screen-white-gap-below-bottom-navigation-bar-100dvh-does
- https://github.com/GarrickZ2/grove/pull/20
- https://github.com/m-hamzak/HImageViewer
- https://developer.apple.com/design/human-interface-guidelines/images (fetch timed out this pass; use Photos-class gestures: pinch, double-tap, swipe-down dismiss)

### Mobbin / Claude screens
- Local staged Claude iOS: `docs/design-reference/mobile-chat-apps/screens/claude-conversation-actions.png`
- Mobbin MCP live screen search was **not** called this pass (operator OAuth pending on `api.mobbin.com/mcp`). Inline-image UX cited from Mobbin MCP + Claude desktop reports above.
