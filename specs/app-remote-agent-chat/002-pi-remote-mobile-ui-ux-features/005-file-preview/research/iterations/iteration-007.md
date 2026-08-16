<!-- provenance: external-CLI orchestration pass; original file iter-07-grok.md -->
> **Source pass 7** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-7-grok.md`.

<!-- F6-file-preview | model=grok | lens=security-redaction | iter 7/10 | 2026-08-15T19:55:13.652Z -->

# Iteration 7 — Security, redaction, and data-flow for a Claude-style artifact/file viewer

Lens: what preview/upload exposes on an installable iPhone PWA, how to keep Pi Remote’s read-only + redaction posture intact, and the exact fail-closed path from Photos/Files into the `pi` child.

---

## 1. Findings for this lens

### 1.1 What the feature would actually expose (this app, this stack)

Pi Remote’s phone never talks to `pi` directly. The only durable phone-visible surface is the relay’s **already-redacted** envelope ledger, synced over a ticketed WebSocket and paged as typed transcript blocks (`text`, `thinking`, `plan`, `tool_call`, `tool_result`, `file_diff`, `usage`). There is **no** `artifact` / `file` / `image` block kind, **no** attachment HTTP route, and **no** client RPC to `get_tree` or host paths ([`packages/pi-rpc-protocol/src/types.ts`](packages/pi-rpc-protocol/src/types.ts); [`apps/pi-remote-relay/src/http/server.ts`](apps/pi-remote-relay/src/http/server.ts) route table; [goal.md](goal.md) §3).

A Claude-style “tap to open the file” surface therefore creates **four new leak classes** that diffs-as-cards do not:

| Leak class | Why a full viewer is worse than a diff card |
|---|---|
| **Byte completeness** | `file_diff` is a patch. A viewer of “the file” is the whole object: comments, `.env` lines, PEM blocks, EXIF, PDF JavaScript, SVG `<script>`. Canonical redaction is **pattern-based**, not a proof that free-form bytes are harmless ([docs/security.md](docs/security.md) §9; [ARCHITECTURE.md](ARCHITECTURE.md) §6). |
| **Active documents** | HTML / SVG / XML / `text/html` executed in a `blob:` URL inherit the **PWA origin**. That origin holds the enrollment P-256 key in IndexedDB and a 15-minute session cookie. Moonshot’s Kimi Code web client hit this exact bug: navigating a tab to a `blob:` of HTML/SVG ran script with the daemon credential in `localStorage` and a live `window.opener` ([MoonshotAI/kimi-code#1731](https://github.com/MoonshotAI/kimi-code/pull/1731), commit [`0b790cd`](https://github.com/MoonshotAI/kimi-code/commit/0b790cdc056475593abd572f657d010504caf752)). |
| **Path reconstitution** | Policy v1 replaces path **keys** and POSIX/Windows **absolute** path substrings with `[REDACTED_PATH]` ([`apps/pi-remote-relay/src/store/redaction.ts`](apps/pi-remote-relay/src/store/redaction.ts) `PATH_KEYS` / `POSIX_PATH_PATTERN`). Relative paths (`src/auth/policy.ts`) and unified-diff headers **survive**. A “open host file by path” API would invert that. `get_tree` on the `pi` RPC returns the raw session tree ([`packages/coding-agent/docs/rpc.md` — get_tree](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)). The phone must never call it. |
| **Tailnet exit** | Existing Copy/Share on assistant text already calls `navigator.clipboard.writeText` and `navigator.share({ text })` ([`apps/pi-remote-web/src/App.tsx`](apps/pi-remote-web/src/App.tsx) `AssistantActions`). The Web Share API is a **secure-context OS share sheet** (Messages, Mail, AirDrop) and is **not** Tailscale ([MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API); [MDN `navigator.share()` file types](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)). Sharing a `File` constructed from a preview blob is an intentional exfil of whatever the relay sent. Claude’s own help warns that sharing an artifact also shares conversation attachments ([Publish and share artifacts](https://support.anthropic.com/en/articles/9547008-discovering-publishing-customizing-and-sharing-artifacts)). |

The projector already **drops** non-text content parts: `textFromContent` keeps only `{type:'text'}` and stringifies everything else for tools; assistant `ImageContent` never becomes a block ([`transcript-projector.ts`](apps/pi-remote-relay/src/store/transcript-projector.ts) `textFromContent`). `file_diff` is synthesized only for `edit` / `write` / `apply_patch` from patch/diff fields, then redacted on append. So “preview the file Claude-style” is **not** a CSS overlay on existing bytes. It is a new typed payload, or it is a viewer over **already-redacted** `file_diff.patch` / `tool_result.output`.

### 1.2 Current fail-closed envelope (must not be bypassed)

Four boundaries are load-bearing ([docs/security.md](docs/security.md) §1; [goal.md](goal.md) §3):

1. **Loopback bind** `127.0.0.1` only; Tailscale Serve is the only ingress; Funnel off.
2. **Foreground authority**: mutations require a live authenticated sync socket plus a one-use ticket (20 s) and Origin/principal match ([`server.ts`](apps/pi-remote-relay/src/http/server.ts) `isForegroundDevice`).
3. **Redaction before persist/broadcast**: `redactEnvelope` is the only pass; stamps `policyVersion`, `fieldsRedacted`, `reasons` ([canonical-redaction.md](docs/feature-catalog/transport-and-state/canonical-redaction.md)).
4. **Default-deny mutation**: filesystem family is `edit`/`write`; process is `bash`; network is `fetch` ([`mutation-policy.ts`](apps/pi-remote-relay/src/policy/mutation-policy.ts)). Plan mode is host/extension-enforced.

Transport caps that **physically forbid** stuffing files into today’s prompt JSON:

- HTTP body **16 384 bytes**, WebSocket message **65 536 bytes** ([`MAX_HTTP_BODY_BYTES`](apps/pi-remote-relay/src/http/server.ts); [http README](apps/pi-remote-relay/src/http/README.md)).
- `PromptSubmitCommand` allowlists keys `{type, submissionId, sessionId, message, ticket, streamingBehavior}` — **no `images`** ([`guards.ts` `isPromptSubmitCommand`](packages/pi-rpc-protocol/src/guards.ts)).
- `PromptService.submit` forwards `{type:'prompt', message, streamingBehavior}` only — **images stripped even if added to the type** ([`prompt-service.ts`](apps/pi-remote-relay/src/prompt/prompt-service.ts)).
- JSON responses already send `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'` ([`sendJson`](apps/pi-remote-relay/src/http/server.ts)). The **PWA document** (`index.html`) has **no CSP meta** — Vite preview is a different Serve route (`/`). XSS in the PWA is therefore not covered by the relay JSON CSP.

Offline cache: `localStorage` key `pi-remote.read-only.v1`, 7 days, 8 sessions, 500 blocks, **not cleared on logout** ([`cache.ts`](apps/pi-remote-web/src/cache.ts); [`logoutDevice`](apps/pi-remote-web/src/auth.ts) only POSTs `/api/auth/logout`). Putting raw attachment bytes (or unredacted paths) into transcript blocks would persist them on-device after session revoke.

Negative controls already pin: unauthenticated / wrong Origin / ticket replay / revoked device fail closed ([`negative-controls.test.ts`](apps/pi-remote-relay/tests/security/negative-controls.test.ts)). A file route that omits ticket + Origin + principal + foreground socket is a new hole in that suite.

### 1.3 Why “just fetch the file from the Mac” is incompatible with redaction

Kimi Code’s working pattern is: upload any type → materialize into the session `attachments/` directory → replace the wire part with a **path notice** so the model `Read`s on demand ([PR #1731](https://github.com/MoonshotAI/kimi-code/pull/1731)). They then had to patch a second leak: after snapshot resync, that notice **dumped the absolute server path** into the chat until the client parsed the basename back into a chip.

Pi Remote **cannot copy that pattern**. Policy v1 would rewrite `/Users/…/attachments/…` to `[REDACTED_PATH]`, so the agent’s Read hint would be destroyed **and** the phone would still have seen the path for one envelope if redaction were skipped. Opaque ids, not paths, are the only shape that survives both redaction and XSS.

OpenCode’s `opencode-preview` plugin is the other tempting prior art: `GET /preview?file=` and `GET /api/file?path=` with “path traversal blocked, project directory only” ([Edison-A-N/opencode-preview](https://github.com/Edison-A-N/opencode-preview/blob/v0.8.2/README.md)). That is a **path-parameter read API**. On a tailnet PWA it would let any enrolled XSS (or a confused-deputy page on the same origin) read workspace files the ledger never intended to publish. It violates “browser DTOs never carry … absolute paths … or unredacted transcript content” ([goal.md](goal.md) §3).

OpenHands’ editor `view` is an **agent-side** tool, not a phone API ([OpenHands ACI `OHEditor.view`](https://github.com/All-Hands-AI/openhands-aci/blob/main/openhands_aci/editor/editor.py); [PR #8742](https://github.com/OpenHands/OpenHands/pull/8742)). The analogous Pi Remote move is: the **projector** decides what the phone may see, after `redactEnvelope`.

### 1.4 Active-content preview: HTML spec vs Claude’s interactive artifacts

Claude artifacts include “single-page HTML websites”, “SVG images”, and “interactive React components”, shown in a dedicated window, with copy/download in the lower-right ([Claude Help: What are artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them); [Artifacts GA, including iOS/Android](https://www.anthropic.com/news/artifacts)). Mobbin’s Claude **web** screens show a code/preview split and a **publish confirmation** modal — i.e. share is a first-class, gated act ([Claude Web Code Preview](https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3); [Claude Web Publish Artifact](https://mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7)). Claude **iOS** Mobbin flows captured for this repo’s teardown are chat + **image input**, not a Code-artifact sidebar ([Claude iOS image-input flow](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1); [Claude iOS text-input flow](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57); local teardown of artifact **cards** in-stream: [docs/design-reference/mobile-chat-apps/01-visual-teardown.md](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)). GitHub even records that **Claude Code–published** artifacts often **do not list on mobile** ([anthropics/claude-code#78792](https://github.com/anthropics/claude-code/issues/78792)). Matching “Claude iOS” is therefore: **in-stream card → full-screen inert preview**, not Anthropic’s hosted interactive runtime.

If Pi Remote ever framed HTML/SVG:

- A `blob:` URL **inherits the creating origin** ([Security.SE on `frame-src blob:`](https://security.stackexchange.com/questions/279235/is-it-safe-to-update-content-security-policy-to-allow-blob-urls-for-iframes); [shhnjk/Safe-Blob-URL](https://github.com/shhnjk/Safe-Blob-URL)).
- `<img src>` does **not** execute SVG script; top-level navigation and unsandboxed iframes **do** ([SVG XSS, GitHub’s `script-src 'none'; sandbox` on SVG responses](https://stackoverflow.com/questions/10557137/are-user-uploaded-svgs-an-xss-risk-how-can-you-sanitize-an-svg)).
- `sandbox="allow-scripts allow-same-origin"` on a same-origin frame lets the child **remove `sandbox` and reload** — HTML Standard: that pair “effectively break[s] out of the sandbox altogether” ([WHATWG iframe `sandbox`](https://html.spec.whatwg.org/multipage/iframe-embed-object.html)). Zeroclaw’s GHSA-class fix: **drop `allow-same-origin`**, deliver via `srcdoc`, CSP `script-src 'none'; object-src 'none'` ([zeroclaw-labs/zeroclaw#6942](https://github.com/zeroclaw-labs/zeroclaw/pull/6942)).

Kimi’s post-fix whitelist is the concrete allowlist to copy, not Claude’s HTML runtime: **PDF, non-SVG images, video/audio, non-HTML text forced to `text/plain`**. Recorded `Content-Type` is **not** trusted; the blob is **re-wrapped** with the whitelist MIME ([`openFileAttachment.ts` in `0b790cd`](https://raw.githubusercontent.com/MoonshotAI/kimi-code/0b790cdc056475593abd572f657d010504caf752/apps/kimi-web/src/lib/openFileAttachment.ts)).

OWASP: never trust upload `Content-Type`; allowlist extensions **and** magic bytes; **rename to a generated id**; `X-Content-Type-Options: nosniff`; prefer `Content-Disposition: attachment` on downloadable static files ([OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html); [Unrestricted File Upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload); [ASVS V5.2.1–5.2.2](https://asvs.dev/v5.0.0/V5-File-Handling/)).

### 1.5 The only RPC-legal way images enter `pi`

Upstream `pi` RPC already accepts vision on `prompt` / `steer` / `follow_up`:

```json
{"type":"prompt","message":"What's in this image?","images":[{"type":"image","data":"<base64>","mimeType":"image/png"}]}
```

([badlogic/pi-mono `rpc.md` Prompting](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md); types in [`rpc-types.ts`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/modes/rpc/rpc-types.ts)). Session `UserMessage.attachments[]` can carry `{id, type, fileName, mimeType, size, content}` — **`fileName` is a path-like field** and must never be persisted as-is under policy v1.

That RPC is **child-stdin JSON**. Base64 of a 2 MB JPEG is ~2.7 MB, far above the relay’s 16 KiB HTTP cap. The phone→relay hop **cannot** be the same JSON as phone→`pi`.

iPhone `<input type="file">` from Photos typically **transcodes HEIC→JPEG**. GPS EXIF stripping in Safari/WebKit is **inconsistent across iOS versions** (sometimes stripped, sometimes kept for library picks vs camera) ([Apple Stack Exchange](https://apple.stackexchange.com/questions/326789/gps-exif-from-iphone-photo-upload-in-safari); [Apple Developer Forums thread 678109](https://developer.apple.com/forums/thread/678109); [SO HEIC conversion](https://stackoverflow.com/questions/79071642/iphone-automatically-converting-heic-hevc-files-when-using-input-type-file)). Treat remaining EXIF as **untrusted**; do not rely on iOS to have stripped GPS before the bytes hit the Mac.

ChatGPT iOS: `+` → Photos / Camera / Files ([Zapier ChatGPT guide, mobile](https://zapier.com/blog/how-to-use-chatgpt/); [OpenAI: supported types](https://help.openai.com/en/articles/8983675-what-types-of-files-are-supported); [File Uploads FAQ — 512 MB/file, 20 MB/image](https://help.openai.com/en/articles/8555545-file-uploads-faq)). Those cloud limits are **not** a model for a loopback relay; they prove the UX target (chip + send) while showing why Pi Remote must pick a **much smaller** cap (ASVS 5.2.1: accept only a size the app can process without DoS).

Kimi API’s upload is a **separate** `POST /v1/files` multipart with `purpose` enum, not inline prompt JSON ([Kimi Files Upload](https://platform.kimi.ai/docs/api/files-upload)). Same split Pi Remote needs: **metadata in the ledger, bytes on a bounded side channel**.

### 1.6 Device-side persistence and XSS blast radius

- Enrollment private key: non-extractable P-256 in IndexedDB ([docs/security.md](docs/security.md) §3). XSS cannot `exportKey` if `extractable: false`, but **can call `sign()`** for the next session challenge while the compromised document is open. That is equivalent to Kimi’s “daemon token in localStorage” for the lifetime of the XSS.
- Session cookie: `HttpOnly; Secure; SameSite=Strict; __Host-` — XSS cannot read it, but **same-origin `fetch('/api/...')` will attach it**. Any preview that executes script same-origin gets a live API.
- `scanQrImage` already uses `createImageBitmap` + `BarcodeDetector` and **closes** the bitmap ([`auth.ts`](apps/pi-remote-web/src/auth.ts)) — the right pattern for “bytes on device, never `innerHTML`”.

### 1.7 UX constraints that are security-relevant on iPhone

Apple HIG: use a **full-screen modal** for photos/documents/editing, not a stacked sheet; one modal at a time; explicit dismiss ([HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets); [HIG Modality](https://developer.apple.com/design/human-interface-guidelines/modality)). A half-sheet over the composer would fail HIG **and** WCAG 2.4.11 if it does not take focus (sticky composer already occupies the bottom 44+ pt).

WCAG 2.2 AA 2.4.11: a **proper modal** passes because focus moves into it; a fake overlay that leaves focus in the transcript fails ([Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)). React Aria `Modal` + `Dialog` already in the composer: focus trap, restore, `Escape`, scroll lock, `aria-hidden` on the rest ([React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)). The viewer must use that, not a `div` + CSS.

`prefers-reduced-motion`: iOS Settings → Accessibility → Motion. Honor it; do not rely on swipe-down as the only dismiss (VoiceOver users need a Close control with a name).

---

## 2. Concrete spec contribution (build-executable)

### 2.0 Invariants (fail the PR if any is violated)

1. The PWA **never** sends a host path, never calls `get_tree` / `get_messages` / raw Pi RPC, never navigates `window.location` or `window.open` to a `blob:` or `/api/…` byte URL.
2. Anything shown in the viewer is **exactly** bytes/text the relay already emitted after `redactEnvelope`, or a **client-local** `File` that has not yet been accepted by the relay (draft only).
3. Uploads are **not** `prompt.submit` JSON. They do **not** raise the global 16 KiB cap. They do **not** write into the workspace unless mutation family `filesystem` is on **and** the operator has opted into a documented attachment-dir write (default: **no disk write**).
4. Ledger rows for attachments are **metadata only**: opaque id, mime from **server magic-bytes**, `byteLength`, `title` ∈ {`Photo`, `Image`, `PDF`, `Text`, `Code`, `File`}, `redaction` stamp. No `fileName`, no `path`, no base64.
5. `localStorage` cache **must not** store attachment bytes. Logout/revoke **must** `localStorage.removeItem('pi-remote.read-only.v1')` and `URL.revokeObjectURL` all live blobs.
6. HTML, SVG, XML, JavaScript, WASM: **unsupported** in v1 (card state `unsupported`, same footprint as redacted). No sandboxed-script artifacts until there is a **separate origin** (not this PWA).

### 2.1 Data-flow (preview of agent-produced content) — read-only

```
pi event (tool_execution_end | message_*)
  → TranscriptProjector (allowlisted fields only)
  → Envelope candidate
  → redactEnvelope (policy v1)
  → SQLite ledger + SyncHub
  → PWA DisplayTranscriptBlock
  → ArtifactCard (metadata + optional redacted text/patch already in the block)
  → tap → Modal/Dialog viewer renders THAT buffer as text/code/diff
```

**Do not** add `GET /api/files?path=`.  
**Do** add, only if a tool result is too large for a block:

`GET /api/sessions/:sessionId/artifacts/:artifactId`  
Auth = same as transcript page (`sessions` cookie + Origin + principal). **No ticket** (read). Body cap on **response** (e.g. 512 KiB text, 2 MiB image). Headers:

```
Cache-Control: no-store
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'none'; sandbox
Content-Disposition: attachment; filename="artifact.bin"
Content-Type: <server-forced whitelist mime>
```

The client **fetches** (not navigates), wraps `new Blob([buf], { type: forcedMime })`, uses the object URL only inside `<img>` or `<iframe sandbox src={pdfBlob}>` (PDF only), revokes on unmount. Filename in `Content-Disposition` is a **constant**, not the host name (OWASP rename).

**v1 mapping (no new Pi tools):**

| Source block | Card title (Inter, 15/20) | Viewer renderer |
|---|---|---|
| `file_diff` | `File change` + one-line `summary` (already redacted) | Code/text: the **patch** in `pre`, not a reconstructed file |
| `tool_result` with `output.length ≥ 40` and tool ∈ {`read`, `read_file`} if those names appear | `Read result` | Text/code: `output` as `text/plain` |
| `unknown` / redacted originalKind | `Hidden by relay` | No open action |
| Everything else | no card | — |

If `redaction.fieldsRedacted > 0` on the envelope that produced the block, the card subtitle is `Redacted · N fields` (not the reasons list — reasons can themselves be sensitive as a side channel if over-specified; v1 shows count + generic “path/secret/private-text” chips only if those exact reason tokens are already on the envelope).

### 2.2 Exact safe **upload** path (phone → agent)

This is the only mutation-adjacent path that preserves default-deny.

```
[1] Composer +  (44×44, clay glyph on bone)
      → Action list: Photo Library | Camera | Files
      → <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
           capture optional for Camera>
[2] Client gate (fail closed, no network)
      - size ≤ 3 MiB as picked
      - type allowlist (File.type is a hint only)
      - createImageBitmap → canvas max edge 2048 → JPEG q=0.82
        (drops leftover EXIF; HEIC already JPEG from iOS)
      - reject if bitmap decode fails
[3] Draft chip (not sent): local blob URL, title "Photo", size
      - revoke previous draft blob
      - sendingPrompt disabled until live + foreground
[4] On Send/Steer (same user gesture as today)
      a. POST /api/auth/ticket          (existing one-use, 20s)
      b. POST /api/prompt/attach        NEW, multipart, THIS ticket
           fields: ticket, sessionId, submissionId, image=<blob>
           Content-Length / streamed; route-local MAX = 4 MiB
           requires isForegroundDevice (same as prompt.submit)
           rate: 10/min/principal (new limiter)
      c. Relay:
           - magic bytes ∈ {jpeg, png, webp, gif} else 415
           - ignore client filename; id = opaque `att_<uuid>`
           - hold bytes in process memory Map, TTL 60s, cap 4 entries
           - do not sqlite, do not write workspace
           - respond { attachmentId, mimeType, byteLength }
      d. POST /api/prompt/submit        existing JSON
           message + ticket#2 (fresh) + attachmentIds: [att_…]
           (extend PromptSubmitCommand with optional attachmentIds:
            opaque ids only, max 4, allowlist key)
      e. PromptService:
           lookup ids in memory; miss → fail closed, no Pi write
           supervisor.send({ type:'prompt', message, images:[{
             type:'image', data: base64(bytes), mimeType }]])
           drop memory bytes after Pi ack OR delivery-unknown
           project user TextBlock (message redacted as today)
           project AttachmentCard metadata-only envelope
           redactEnvelope → persist → broadcast
[5] Delivery-unknown: do not retry attach automatically
    (same rule as prompt). User must tap Send again → new tickets.
```

**Not allowed:** base64 in `prompt.submit`; raising global `MAX_HTTP_BODY_BYTES`; forwarding `File.name`; `write` tool to dump the photo into the repo; Kimi-style `attachments/` path notices.

**Plan mode:** attach is user intent, not a host filesystem mutation. It stays allowed in Plan. It must **not** enable `write`/`edit`. If a later phase writes files to disk for PDF/text, that write is `filesystem` family + existing approval/full-access switch.

**PDF/text upload (phase 2, not v1):** same ticketed attach route, magic-byte allowlist `25 50 44 46` (PDF) / UTF-8 text with BOM check, max 256 KiB text / 1 MiB PDF, **never** `text/html`. Forwarding to `pi`: there is **no** generic file RPC on `prompt` today—only `images[]`. Phase 2 must either (a) inline a **redacted** text extract into `message` (bounded), or (b) add a Pi-side extension. Do not invent a path-based Read.

### 2.3 UI states, gestures, visual, motion, a11y

**Artifact card** (in-stream, not a chat bubble — [teardown](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)):

- Surface: bone `#f8f8f6` / dark canvas; 16px radius; 1px hairline carbon/15%; padding 14px.
- Title: Inter 15/20 medium carbon. Subtitle: Inter 13/18 muted (`Redacted file diff` / `JPEG · 420 KB` / `Hidden by relay`).
- Right glyph: 28px tilted file/photo mark, clay `#d97757` at 16% fill, not a screenshot of host UI.
- One primary: `Open` (Inter 13). No Download in v1.
- Hit target ≥ 44×44. 320px: card ≤ prose column, no horizontal overflow.
- States: `idle` | `redacted` (stamp) | `unsupported` | `error` | `loading` — **same min-height 64px** (no layout jump). `unsupported` copy: `This file type cannot be previewed on this device.` (no original path/mime if mime was `text/html`).

**Viewer** — React Aria `ModalOverlay` + `Modal` + `Dialog` (`isDismissable`, `role="dialog"`, `aria-labelledby` = filename-generic title):

| State | Body | Chrome |
|---|---|---|
| `opening` | bone full-bleed, Inter 13 “Loading preview” `role="status"` `aria-live="polite"` | Close only |
| `image` | `<img alt="">` empty alt if decorative; if photo, alt=`Photo from this chat, redacted metadata` | Close; pinch-zoom via CSS `touch-action: pinch-zoom`; no custom gesture lib |
| `pdf` | `<iframe sandbox title="PDF preview" src={blob}>` — **no** `allow-scripts`, **no** `allow-same-origin` | Close |
| `text`/`code`/`diff` | `<pre>` / `<code>` **textContent only** (never `dangerouslySetInnerHTML`). Source Serif 4 17/26 for prose markdown-as-text; Inter 13/20 tabular for code/diff. Diff colors existing `diff-add`/`diff-remove`. | Close; Copy (redacted buffer) |
| `unsupported`/`error` | quiet copy + clay text button Close | |
| `share_confirm` | only if Share is enabled; see below | |

**Gestures**

- Open: tap card or keyboard Enter/Space on `button`.
- Close: Dialog Close (44pt, leading, label `Close preview`), `Escape`, iOS VoiceOver “Dismiss”, optional swipe-down **in addition** (not instead). HIG: do not stack a second sheet.
- Forbidden: swipe to a **new** host file (would require path traversal UX).

**Motion** (`@media (prefers-reduced-motion: no-preference)` only): overlay fade 120ms, panel `translateY(8px)→0` 280ms `cubic-bezier(0.2, 0.8, 0.2, 1)`. Reduced motion: instant. `env(safe-area-inset-*)` on chrome. `theme-color` stays bone/dark matching `data-theme`.

**Share / Copy (security UX, not Claude-identical)**

- **Copy**: `clipboard.writeText` of the **viewer buffer** (already redacted). `aria-label` `Copy redacted preview`. 1.5s `Copied` as today.
- **Share**: `navigator.canShare({ text })` then `share({ text, title: 'Pi Remote preview' })`. **Do not** pass `files: [File]`. Helper text in the action sheet header is impossible on iOS; put a one-line Dialog **before** share: `This leaves your private tailnet.` Buttons: `Cancel` | `Share text` (clay). Images: Share **disabled** in v1 (caption `Sharing images is off so photos stay on this device.`).
- Close is always available; Share never blocks Close.

**A11y checklist (AA)**

- Dialog takes initial focus on Close or heading (`h2` “Preview”).
- Background `inert` / React Aria hide (SC 2.4.11).
- Focus ring ≥ 3px clay on bone (SC 1.4.11).
- Image viewer: announce `Image preview.` PDF: `PDF preview.` Code: `Redacted code, N lines.`
- Redaction chips: not color-only; text `Redacted`.
- Do not trap swipe-back without Close (SC 2.1.2).
- `aria-describedby` on Open when `fieldsRedacted > 0`: `Some paths and secrets were removed by the relay.`

**Composer attach (v1 images only)**

- Left `+` already exists; add `Attach photo` in the tools popover, gated on `connection === 'live'` && !`awaitingSnapshot`. Hidden (not disabled-decorative) when offline.
- `accept` as above; no `image/*` (that re-opens SVG).
- Draft chip removable with `aria-label="Remove photo"`.
- Error toasts: `Photo too large` / `That file type cannot be sent` / `Relay rejected the photo` — no server errno, no path.

### 2.4 Tests the build phase must add (security)

- Negative: attach without ticket / replayed ticket / wrong Origin / no foreground socket / 4 MiB+1 → 4xx, no Pi stdin write.
- Magic-byte: `Content-Type: image/jpeg` + HTML body → 415.
- SVG/`text/html`/`image/svg+xml` never get a viewer Open control.
- Projector: assistant image parts still don’t appear as navigable HTML.
- Envelope for attach metadata contains no `/Users`, no `data:`, no base64.
- `sendJson` CSP unchanged; attach GET (if any) has `sandbox` CSP + `nosniff` + `attachment`.
- Cache round-trip: 500-block save does not include binary fields.
- Logout clears transcript cache.
- `openFileAttachment`-style `window.open(blob)` is **lint-forbidden**.

---

## 3. Divergent / minority ideas (do not converge)

1. **Refuse Claude-like interactive artifacts forever.** Claude’s GA artifacts are HTML/React/SVG with code execution + file creation as a Settings capability ([Claude Help](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)). Pi Remote has no `usercontent.` origin. Matching Claude here would **weaken** the posture. Ship inert viewers; treat “interactive artifact” as a non-goal.

2. **Capability-URL byte channel with 30s expiry**, query param unguessable, **still** requiring the session cookie. Minority because cookies on GET make the URL dangerous if leaked to a screenshot; prefer `Authorization` never in query. If used, bind to deviceId + `exp` + digest, one-use.

3. **Relay-side rasterization**: render code/PDF to PNG on the Mac, phone only displays `<img>`. Copy becomes OCR-only. Strongest anti-exfil; terrible for a coding agent. Worth a flag `PI_REMOTE_PREVIEW_RASTER=1` for hostile-shoulder environments, not default.

4. **Separate Tailscale Serve host** for bytes (`preview.<node>.ts.net`) with `Cross-Origin-Resource-Policy: cross-origin` and cookie-less capability tokens — the Google `usercontent.goog` pattern ([Safe-Blob-URL rationale](https://github.com/shhnjk/Safe-Blob-URL)). Correct isolation; operationally heavy for a single-node relay.

5. **Disable Share entirely** on artifact surfaces (Copy stays). Matches threat model better than Claude/ChatGPT. UX bar suffers; document as an explicit product choice, not an accident.

6. **Kimi “materialize + Read tool”** after all, with a **host-local** path that redaction maps to an opaque id via a relay-owned symlink table. Restores PDF/text for the model without `images[]`. Conflicts with default-deny `write` unless the attach dir is outside the mutation policy (a new trusted path — high review cost).

7. **Open diffs as Apple Quick Look** via a native wrapper (not PWA). QLPreviewController cannot be driven from Safari. Would require a different app class; out of scope but the true “iOS file preview” primitive.

8. **Show redaction as selectable overlay spans** (`[REDACTED_SECRET]` in clay small-caps, `aria-label="secret removed"`). Improves honesty; risks teaching attackers the exact regex. Keep replacement tokens as today.

9. **IndexedDB encryption of viewer LRU** so rotate-to-landscape / bfcache does not keep plaintext patches in React heap after Close. Extra crypto vs simply dropping state on unmount + `revokeObjectURL`. Prefer drop.

10. **Allow `sandbox="allow-scripts"` without `allow-same-origin` + `srcdoc` CSP `default-src 'none'`** for a future HTML preview. Spec-legal opaque origin ([WHATWG](https://html.spec.whatwg.org/multipage/iframe-embed-object.html)). Still a large XSS/exfil (network from the iframe unless CSP blocks). Not v1.

---

## 4. Open questions + risks

1. **Does any deployed `pi` model actually consume `images[]` in this operator’s RPC child?** Types exist; full-access vs `--no-tools` does not answer vision. If the model `input` lacks `"image"`, attach must fail closed with `unsupported`, not silently drop (Kimi’s old `[Image omitted]` caused the agent to **search the filesystem** — [PR #1731](https://github.com/MoonshotAI/kimi-code/pull/1731)).

2. **Tool names for “read file”** on this `pi` version are not in the phone protocol. v1 should not guess; only promote `file_diff` + oversized `tool_result` until a projector allowlist is measured from live events.

3. **Redaction vs usefulness:** showing a patch whose `+++` path became `[REDACTED_PATH]` is honest and may be ugly. Relative paths remain. Operators can still paste secrets into files that **do not** match `TOKEN_PATTERN` (docs already say this). A viewer makes that worse; there is no complete fix without host-side secret scanning (gitleaks-class) — out of current policy v1.

4. **PDF JavaScript / forms** in Safari’s built-in viewer inside `iframe sandbox` (no scripts): residual risk of PDF exploitation of WebKit. Keep PDF behind the 1 MiB cap; prefer “unsupported” if sandbox is ignored on iOS WKWebView quirks — **needs a device check**, not assumed.

5. **Serve body limits / Tailscale buffers** for a 4 MiB POST are unverified in this repo. If Serve truncates, attach fails closed; do not chunk across tickets without an explicit multi-part protocol.

6. **PWA CSP gap:** relay JSON is locked down; the document origin is not. A viewer that uses `eval`/markdown-to-HTML in the PWA (e.g. `marked` → `dangerouslySetInnerHTML`) is an XSS regression **even if** the relay redacted paths. Markdown must stay `<pre>`.

7. **Claude Code artifacts on mobile are incomplete** ([#78792](https://github.com/anthropics/claude-code/issues/78792)). Do not promise a sidebar library of all host files; promise **turn-scoped cards**.

8. **Logout cache retention** is already a transcript leak of redacted patches. File bytes would make it a hard finding. Clearing cache on logout is a prerequisite, not optional polish.

9. **Mobbin MCP** was not callable in this pass (no Code Mode/Mobbin tools in-session). Screen citations are public Mobbin URLs plus the repo’s staged Claude teardown PNGs. A later pass should pull `search_screens` for “iOS file preview close share PDF” on Claude/Kimi/ChatGPT once OAuth exists.

10. **`share_target` in the web manifest** would let other apps POST files **into** the PWA ([MDN `share_target`](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target)). That is an **inbound** upload lane with no ticket. Do not add it.

---

## 5. Sources

### This repository (security/data-flow)

- [goal.md](goal.md) — non-negotiable redaction / tickets / plan-mode
- [docs/security.md](docs/security.md) — four boundaries, 16 KiB, tickets, redaction limits
- [ARCHITECTURE.md](ARCHITECTURE.md) §6–7 — `redactEnvelope` table and flows
- [docs/feature-catalog/transport-and-state/canonical-redaction.md](docs/feature-catalog/transport-and-state/canonical-redaction.md)
- [docs/feature-catalog/transport-and-state/redacted-durable-ledger.md](docs/feature-catalog/transport-and-state/redacted-durable-ledger.md)
- [`apps/pi-remote-relay/src/store/redaction.ts`](apps/pi-remote-relay/src/store/redaction.ts)
- [`apps/pi-remote-relay/src/policy/mutation-policy.ts`](apps/pi-remote-relay/src/policy/mutation-policy.ts)
- [`apps/pi-remote-relay/src/http/server.ts`](apps/pi-remote-relay/src/http/server.ts) — caps, CSP, routes
- [`apps/pi-remote-relay/src/prompt/prompt-service.ts`](apps/pi-remote-relay/src/prompt/prompt-service.ts)
- [`apps/pi-remote-relay/src/store/transcript-projector.ts`](apps/pi-remote-relay/src/store/transcript-projector.ts)
- [`packages/pi-rpc-protocol/src/types.ts`](packages/pi-rpc-protocol/src/types.ts) / [`guards.ts`](packages/pi-rpc-protocol/src/guards.ts)
- [`apps/pi-remote-web/src/cache.ts`](apps/pi-remote-web/src/cache.ts), [`App.tsx`](apps/pi-remote-web/src/App.tsx), [`index.html`](apps/pi-remote-web/index.html)
- [docs/design-reference/mobile-chat-apps/01-visual-teardown.md](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)
- [docs/design-reference/mobile-chat-apps/council-gpt-sol.md](docs/design-reference/mobile-chat-apps/council-gpt-sol.md) — “existing redacted data only”

### Pi RPC / coding-agent prior art

- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/modes/rpc/rpc-types.ts
- https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md

### Target-bar apps + Mobbin

- https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
- https://support.anthropic.com/en/articles/9547008-discovering-publishing-customizing-and-sharing-artifacts
- https://www.anthropic.com/news/artifacts
- https://github.com/anthropics/claude-code/issues/78792
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 (Claude iOS, text)
- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 (Claude iOS, image input)
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 (Claude iOS chat detail / upload)
- https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3 (Claude Web code preview)
- https://mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7 (Claude Web publish artifact)
- https://help.openai.com/en/articles/8983675-what-types-of-files-are-supported
- https://help.openai.com/en/articles/8555545-file-uploads-faq
- https://help.openai.com/en/articles/20001052-file-storage-and-library-in-chatgpt
- https://zapier.com/blog/how-to-use-chatgpt/
- https://github.com/MoonshotAI/kimi-code/pull/1731
- https://github.com/MoonshotAI/kimi-code/commit/0b790cdc056475593abd572f657d010504caf752
- https://raw.githubusercontent.com/MoonshotAI/kimi-code/0b790cdc056475593abd572f657d010504caf752/apps/kimi-web/src/lib/openFileAttachment.ts
- https://platform.kimi.ai/docs/api/files-upload

### Other remote-CLI / agent UIs

- https://github.com/Edison-A-N/opencode-preview/blob/v0.8.2/README.md
- https://github.com/All-Hands-AI/openhands-aci/blob/main/openhands_aci/editor/editor.py
- https://github.com/OpenHands/OpenHands/pull/8742
- https://www.openhands.dev/blog/opencode-vs-openhands
- https://github.com/jhlee0409/claude-code-history-viewer

### Platform / a11y / web platform security

- https://developer.apple.com/design/human-interface-guidelines/sheets
- https://developer.apple.com/design/human-interface-guidelines/modality
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- https://react-spectrum.adobe.com/react-aria/Modal.html
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Share_data_between_apps
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target
- https://html.spec.whatwg.org/multipage/iframe-embed-object.html
- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload
- https://asvs.dev/v5.0.0/V5-File-Handling/
- https://security.stackexchange.com/questions/279235/is-it-safe-to-update-content-security-policy-to-allow-blob-urls-for-iframes
- https://github.com/shhnjk/Safe-Blob-URL
- https://stackoverflow.com/questions/10557137/are-user-uploaded-svgs-an-xss-risk-how-can-you-sanitize-an-svg
- https://github.com/zeroclaw-labs/zeroclaw/pull/6942
- https://apple.stackexchange.com/questions/326789/gps-exif-from-iphone-photo-upload-in-safari
- https://developer.apple.com/forums/thread/678109
- https://stackoverflow.com/questions/79071642/iphone-automatically-converting-heic-hevc-files-when-using-input-type-file
