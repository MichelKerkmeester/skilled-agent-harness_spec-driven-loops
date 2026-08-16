<!-- provenance: external-CLI orchestration pass; original file iter-07-grok.md -->
> **Source pass 7** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-7-grok.md`.

<!-- F8-inbound-media | model=grok | lens=security-redaction | iter 7/15 | 2026-08-16T04:40:39.197Z -->

# Iteration 7 — Security-redaction: inbound preview media (Pi Remote)

**Lens:** security, redaction, and data-flow. How inbound screenshots can exist without breaking read-only-by-default, and the exact safe path to the agent for uploads (F5) and inbound delivery (this feature).  
**Constraint:** ink-on-parchment, WCAG AA, iPhone PWA (React 19 / Vite / Tailwind 4 / react-aria-components). Mutations remain one-use ticketed + revision-checked and fail closed.

---

## 1. Findings for this lens

### 1.1 The posture exception is real — and it is not a mutation

Pi Remote’s four boundaries are loopback, tailnet-only Serve, foreground authority, and **redaction before persist/broadcast** ([docs/security.md](docs/security.md); [ARCHITECTURE.md](ARCHITECTURE.md)). Canonical redaction is a **string walker** over path/secret/prompt keys and POSIX/Windows path regexes (`apps/pi-remote-relay/src/store/redaction.ts`). Catalogs already refuse that walker: they use **allowlist projectors** because “unknown nested shapes could slip a secret or path past” pattern redaction (`redaction.ts` lines 122–127; [canonical-redaction.md](docs/feature-catalog/transport-and-state/canonical-redaction.md)).

**Pixels cannot be pattern-redacted.** GPS, `.env` dumps, terminal tokens, and host paths inside a screenshot are not strings in JSON. An inbound image feature is therefore the same class of exception F5 already named for uploads: a **controlled, host-gated, structurally-allowlisted** path — not a relaxation of ticketed mutations ([specs/002/F5-media-upload/spec.md](specs/002/F5-media-upload/spec.md) §Security).

F6 already proved the non-mutating half: `artifact:read` is an authenticated exact-tuple read, **no mutation ticket**, available in host-enforced Plan mode, and **must not** become a filesystem client ([specs/002/F6-file-preview/spec.md](specs/002/F6-file-preview/spec.md)). Inbound screenshots must reuse that read surface. They must **not** invent a second binary GET that turns a displayed path into a host read.

HTTP today is POST-only: non-POST returns `405 { error: 'read_only' }` (`apps/pi-remote-relay/src/http/server.ts` ~305–308). JSON bodies are 16 KiB; WebSocket frames 64 KiB ([docs/security.md](docs/security.md)). The PWA service worker already ignores non-GET and bypasses `/api/` (`apps/pi-remote-web/public/service-worker.js` 24–28). **Inbound bytes must travel as a POST artifact fetch → in-memory `Blob` → `blob:` object URL**, never as `<img src="/api/artifacts/…">`. Same-origin `<img>` would still send the `SameSite=Strict` session cookie, put opaque IDs in access logs/Referer, and fight the POST-only invariant.

### 1.2 Upstream pi already has inbound image bytes — Pi Remote drops or can leak them

Mario Zechner’s pi RPC documents **outbound** `images: ImageContent[]` on `prompt` / `steer` / `follow_up` only ([pi RPC mode](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)). Assistant `content` in that same doc is `text` | `thinking` | `toolCall` — no image.

But **`@mariozechner/pi-ai` already types tool results as image-bearing:**

```ts
content: (TextContent | ImageContent)[]; // Supports text and images
```

(`ImageContent = { type: "image", data: base64, mimeType }`) — [packages/ai/src/types.ts](https://github.com/badlogic/pi-mono/blob/main/packages/ai/src/types.ts). User messages already accept the same union. Assistant image **output** is a separate, still-open-ish request ([pi-mono#3817](https://github.com/badlogic/pi-mono/issues/3817)).

Pi Remote’s projector is the actual inbound gate today:

- `projectMessage` emits only `text` / `thinking` / `toolCall` (`transcript-projector.ts` 328–345).
- `textFromContent` keeps `type === "text"` array items and **drops** other array items; if `content` is a **single object**, it `JSON.stringify`s it (`transcript-projector.ts` 457–468).

**Consequence:** a well-formed `ToolResultMessage` with `content: [{type:"image", data, mimeType}]` is silently dropped (no card). A non-array image object is **persisted as base64 in `tool_result.output`**, then run through pattern redaction (which will not strip base64), then written to SQLite and synced. That is the fail-open hole this feature must close **before** any UI ships.

Stdout JSONL is capped at **1 MiB per record** (`apps/pi-remote-relay/src/rpc/framing.ts`; [ARCHITECTURE.md](ARCHITECTURE.md)). A 2 MiB normalized PNG is ~2.7 MiB base64 and **cannot** ride stdout. F5 already recorded the echo hazard: if Pi writes image payloads into events, the framed path dies before projection ([F5 spec](specs/002/F5-media-upload/spec.md) §Pi and provider boundary). **Inbound preview therefore cannot be “parse ImageContent off stdout and show it.”** Bytes must leave the JSONL path at the host, before `redactEnvelope`.

ACP/MCP make the same mistake if copied naively: image blocks are `{ type, mimeType, data: base64 }` plus optional `uri` ([ACP v2 content](https://agentclientprotocol.com/protocol/v2/content); [MCP ContentBlock](https://modelcontextprotocol.io/specification/2026-07-28/schema#contentblock)). `uri` is a **host path/URL leak** and is forbidden in Pi Remote DTOs (path keys already redacted; F6 `displayName` is basename-or-generic only).

### 1.3 F5 vs inbound: opposite durable contracts, same sanitizer

| | F5 upload (phone → Pi) | Inbound preview (Pi → phone) |
|---|---|---|
| Mutation? | Yes: reserve + PUT + `prompt:submit` tickets | No: `artifact:read` only |
| Pixels on phone HTTP JSON / WS? | Forbidden | Forbidden |
| Durable transcript | Metadata card, `previewRetained: false`, **no replay** ([F5](specs/002/F5-media-upload/spec.md)) | Descriptor + opaque `{artifactId, revision, digest}`; **pixels only in artifact store** |
| Who sees pixels? | Pi + provider; **not** later devices | Operator on an enrolled device, after sanitization |
| Safe agent path | Host stdin `images: [{type, mimeType, data}]` only | Never back to Pi unless the user **explicitly** F5-uploads again |

F5’s safe path to the agent (normative, already specified):

1. Selection is local (`File` + object URLs). No reserve/upload until Send.
2. `POST /api/attachment-sets` with a 16 KiB manifest (digest, length, ordinal) under a one-use `attachment:reserve` ticket bound to principal, device, origin, session, epoch, prompt revision.
3. Bounded `PUT` of source bytes to outside-webroot `0700`/`0600` quarantine; ticket consumed **before** body read.
4. Decode, strip EXIF/GPS/IPTC/XMP, 8-bit sRGB, JPEG/PNG, 2 000 px / 2 MiB; delete source after derivative commit.
5. Fresh `prompt:submit` ticket; host process sends **only** normalized JPEG/PNG on Pi stdin `images`. Base64 never enters browser HTTP, WS, SQLite, JSONL session, logs, or a Pi workspace path ([F5](specs/002/F5-media-upload/spec.md) §Limits and transport; [pi RPC images](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)).

OpenCode’s V2 attachment API is a **negative** example for Pi Remote: it accepts `file://` and `data:` URIs and documents that if the resizer fails, `read` **returns the original image**, so those limits “are processing limits rather than an upload or security boundary” ([OpenCode attachments](https://opencode.ai/v2/docs/attachments)). Pi Remote must fail closed on decoder failure (`withheld`), never pass-through.

Anthropic’s Files API `file_id` (upload once, reference many) is the right **shape** for the phone/relay contract, not for Pi stdin: Claude still wants JPEG/PNG/GIF/WebP, 10 MB API / 5 MB Bedrock, 8000×8000, and downscales to a 2000 px long edge when a request has >20 images ([Claude Vision](https://platform.claude.com/docs/en/build-with-claude/vision)). GIF is allowed there; **Pi Remote v1 rejects GIF/SVG/active formats** (F5 + OWASP). Prefer 2000 px / JPEG quality 88 to stay inside both F5 and Claude’s many-image rule.

### 1.4 Same-origin image serving is a stored-XSS problem unless the bytes are reconstructed

OWASP: restrict types, ignore client `Content-Type`, randomize names, store **outside webroot**, map `id → file`, set size limits, CDR/re-encode images ([File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)). Image rewriting “destroys any kind of malicious content injected in an image.” OWASP Unrestricted File Upload and the HTTP Headers cheat sheet: `X-Content-Type-Options: nosniff`; for untrusted files prefer `Content-Disposition: attachment` and `application/octet-stream` ([OWASP Unrestricted File Upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload); [HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)).

SVG/`image/svg+xml` executes script in the **application origin**. JPEG+HTML polyglots pass magic-byte checks and execute if sniffed as HTML. **Inbound v1: JPEG/PNG only after full decode + re-encode. No SVG, no PDF, no HTML, no original bytes to the PWA.**

F6 already requires raster re-encode, `Cache-Control: private, no-store`, `nosniff`, `Cross-Origin-Resource-Policy: same-origin` ([F6](specs/002/F6-file-preview/spec.md)). For inbound, add: response body is the **sanitized** bytes; `Content-Type` is relay-authored `image/jpeg` or `image/png`; still fetch-as-blob (do not navigate). `Content-Disposition: attachment` is compatible with `fetch()`+`blob()` and prevents accidental top-level navigation from rendering the file as a document.

Tailnet HTTPS does **not** create a separate cookie-free CDN origin. Isolation is: **reconstructed raster + blob URL + CSP `img-src blob:` (no `data:`) + never execute SVG**. The PWA `index.html` currently has **no CSP meta** (`apps/pi-remote-web/index.html`). API JSON already sends `default-src 'none'; frame-ancestors 'none'` (`server.ts` ~930). The document CSP must be tightened when images exist, or `blob:` images are an open `img-src`.

### 1.5 Visual secrets bypass Plan mode and “sensitive file” gates

Kimi Code’s YOLO mode still prompts before `.env` / SSH key **files**, and Plan mode pauses before writes ([Kimi interaction](https://moonshotai.github.io/kimi-code/en/guides/interaction.html)). A **screenshot of `.env`** is not a filesystem read of `.env`. If the operator (or the model, via F5 re-attach) treats pixels as ordinary photos, those gates never fire.

OWASP LLM01:2025 explicitly covers multimodal injection: instructions hidden in images enter the same instruction-following path as text ([LLM01](https://genai.owasp.org/llmrisk/llm01-prompt-injection/); [CSA note on image prompt injection](https://labs.cloudsecurityalliance.org/research/csa-research-note-image-prompt-injection-multimodal-llm-2026/); [MITRE ATLAS AML.T0051.002](https://redteams.ai/topics/multimodal/multimodal-prompt-injection-images)). Re-encoding strips EXIF and many polyglots; it does **not** strip typographic instructions. F5 already states: image content cannot grant filesystem/process/network/shell/approval/mode authority. Inbound must inherit that, and **must not auto-feed inbound pixels back into `prompt.images`**.

Cline’s `read_file` image work **deliberately does not open/show** the image in chat — only “Successfully read image” ([cline#4411](https://github.com/cline/cline/pull/4411)). That is the security-conservative prior art. The desired Claude/Kimi bar **does** show pixels; Pi Remote can match the **card → fullscreen** interaction (F6) while keeping Cline’s instinct on **durable state** (no pixels in history JSON).

Continue CLI pastes images as data URLs with a 10 MB cap and optional Sharp resize ([continue#7503](https://github.com/continuedev/continue/pull/7503)). Aider `/clipboard` writes temp PNGs into the chat file set ([aider#1025](https://github.com/paul-gauthier/aider/issues/1025)). `opencode-image-viewer` copies files to `%TEMP%` and serves `localhost:9876` ([npm opencode-image-viewer](https://www.npmjs.com/package/opencode-image-viewer)). **aeye** records every image the agent touches into a path-based manifest ([noamsto/aeye](https://github.com/noamsto/aeye)). All of these violate Pi Remote’s “no host path, no public/local open listener, no workspace file for Pi tools.”

### 1.6 iPhone PWA cannot use native screenshot shields — cover in JS, revoke blobs

Apple HIG Privacy: minimize data, be transparent, use system storage/transport protections ([HIG Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)). Native `privacySensitive`, App Switcher overlays, and `UIScreen.isCaptured` are **UIKit/SwiftUI**, not installed-PWA APIs ([Apple Forums on capture APIs](https://developer.apple.com/forums/thread/824922); [App Switcher snapshot pattern](https://hacknicity.medium.com/hide-sensitive-information-in-the-ios-app-switcher-snapshot-image-25ddc9b8ef5f)).

The PWA can: listen to `visibilitychange` / `document.visibilityState` ([MDN Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)), paint the existing bone privacy cover (F5 already requires this for local thumbs), **revoke object URLs and drop `ImageBitmap`/canvas contents** on `hidden`, and re-fetch on foreground. This is not FLAG_SECURE; iOS screenshots of a visible PWA still capture pixels. Product copy must say that.

WCAG 1.1.1: non-text content needs a text alternative ([Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)). OCR-generated alt from a host screenshot is itself a **secret transcript**. F6: relay-supplied alt or `Image preview; description not provided.` Inbound default is the latter unless the host policy explicitly allows a **generic** label (`Screenshot from browser tool`), never OCR.

### 1.7 Target-bar UX vs this security model (Mobbin)

Public Mobbin flows for this category are overwhelmingly **user-attach**, not **agent-inbound screenshot**:

- Claude iOS “Chatting with Claude (image input)” — user attaches, model translates ([Mobbin flow](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1)).
- Claude iOS chat detail / upload chrome ([Mobbin screen](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8)).
- ChatGPT iOS composer camera affordance ([Mobbin screen](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1)).
- Gemini iOS image identify ([Mobbin flow](https://mobbin.com/explore/flows/e5b8846f-e7bb-481a-82bd-47f29bfb6653)).

Local teardown of Claude: inline artifact cards ~16px radius, hairline, title + muted subtitle + small thumbnail; `1 artifact` pill ([01-visual-teardown.md](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)). Council notes: cards must not expose unredacted paths; loading/unavailable/redacted share one footprint ([council-gpt-sol.md](docs/design-reference/mobile-chat-apps/council-gpt-sol.md)).

Kimi Code gates paste on `image_in` / `video_in`; the TUI shows a **placeholder** until submit ([Kimi interaction](https://moonshotai.github.io/kimi-code/en/guides/interaction.html)). Video is **out of scope** for Pi Remote v1 (F5 non-goals). Capability must be **host-advertised**, never inferred from model name (F5).

**Security-first divergence from Claude’s thumbnail:** a 64×64 thumb of a host screenshot **is** the secret. Durable sync envelopes (64 KiB WS, redacted ledger, `localStorage` cache in `cache.ts`) must not carry even sanitized thumbnails. Claude’s visual bar is met by a **type-glyph card** that opens F6; optional in-memory thumbs load only while `visibilityState === "visible"`.

Push remains content-free: `lookupId` + `attentionClass` only ([docs/security.md](docs/security.md)). Notifications say a generic “Pi shared a preview”, never a filename or description.

---

## 2. Concrete spec contribution (build-executable)

### 2.1 Content block (durable, allowlisted)

Do **not** add raw `ImageContent` to `TranscriptBlock`. Add a relay-authored inbound descriptor that is a **restricted F6 `FilePreviewBlock`**, or an equivalent kind `inbound_image` with the same identity fields. Exact-key guards; unknown keys fail closed (`packages/pi-rpc-protocol` pattern).

```ts
type InboundImageBlock = Readonly<{
  kind: 'inbound_image';          // old clients → existing `unknown` redacted shell (App.tsx ~1535)
  role: 'assistant' | 'tool';
  origin: 'tool_result' | 'assistant_output' | 'extension_ui';
  mediaClass: 'screenshot' | 'raster' | 'generated';
  artifactId: string;             // OPAQUE_ID_PATTERN only
  revision: string;               // F6 string revision; do not coerce to numeric block.revision
  digest: string;                 // /^[a-f0-9]{64}$/
  displayName: string;            // "Screenshot 1" | "Image" — never basename from host
  mimeType: 'image/jpeg' | 'image/png';
  renderer: 'image';
  byteLength: number | null;      // sanitized size, or null if withheld
  pixelBucket: 'sm' | 'md' | 'lg' | 'xl'; // coarse; never exact WxH
  redaction: 'applied' | 'withheld';
  completeness: 'complete' | 'excerpt';
  shareAllowed: false;            // inbound v1: locked false
  previewInEnvelope: false;       // no thumbnail bytes/blurhash in DTO
  content: { kind: 'artifact-ref' } | { kind: 'none' };
  toolName?: string;              // path-free token, ≤200 chars (existing pathFreeToken)
}>;
```

**Forbidden durable/observable fields** (protocol test must reject): `data`, `base64`, `uri`, `path`, `fileName`, `preview`, `extractedText`, `altText` from OCR, EXIF, exact pixel dimensions, source MIME claim, attachment URL, tickets, decoder exception text. Copy/export: `[inbound image redacted]`.

Block `revision` (numeric, transcript) increments when the **descriptor** changes; artifact `revision` (string) is the immutable snapshot id. Same split F6 already requires.

### 2.2 Host intercept — before JSONL persist

New relay module (suggested): `apps/pi-remote-relay/src/store/inbound-image-bridge.ts`, called from the Pi event publisher **before** `SyncHub.publish` / `redactEnvelope`.

**Fail closed if any of these appear on a Pi event/message:**

- `type === "image"` with a `data` string
- keys `content`/`preview`/`extractedText` matching pi’s Attachment shape ([rpc.md Attachment](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md))
- string values matching `^[A-Za-z0-9+/]{512,}={0,2}$` above a cap **unless** they are already diverted

**Divert path (only when `PI_REMOTE_INBOUND_MEDIA=1` AND F6 artifact store exists AND media policy on):**

1. Copy bytes to the **same** F5 quarantine tree (outside repo/webroot/SQLite; `0700`/`0600`; opaque names).
2. Run the **same** F5 sanitizer (sniff + full decode, one frame, 60 MP / 12 000 px, no animation, no SVG/HTML/polyglot; strip metadata; 8-bit sRGB; JPEG q88 or PNG if transparency required; 2 000 px / 2 MiB).
3. Insert F6 artifact store row `{sessionId, artifactId, revision, digest, mime, bytes}`. Idempotent iff digest matches.
4. Emit `InboundImageBlock` with `content: { kind: 'artifact-ref' }` and a sibling `tool_result` whose `output` is a **constant** placeholder (`[image content held as preview]`), never JSON of the image.
5. Delete quarantine source immediately after derivative commit (F5 lifecycle).
6. If sanitizer fails: `redaction: 'withheld'`, `content: { kind: 'none' }`, no artifact bytes.

If the flag is **off**: drop image items (array case) and **reject** the envelope if stringify would persist base64 (negative control). Do not pass through.

**JSONL:** never raise the 1 MiB stdout cap to “fit images.” If Pi echoes base64 anyway, treat as supervisor error, do not persist the record, surface `relay-error` with a redacted code. Release gate (same as F5): pinned Pi build must prove no image persistence in its session JSONL and no echo on stdout ([F5](specs/002/F5-media-upload/spec.md)). `--no-session` is already the default spawn ([docs/setup.md](docs/setup.md)).

Host-internal read of a screenshot **file** the tool just wrote is allowed **only** from an allowlisted quarantine/temp owned by the relay, never from a path parsed out of tool text (F6 invariant). Prefer in-memory / quarantine over workspace PNG.

### 2.3 Delivery to the iPhone (read, not upload)

**Route:** `POST /api/artifacts/read`  
Action: `artifact:read` (add to `AuthorizedAction` in `auth/policy.ts`; default deny remains).  
**No ticket.** Session cookie + exact Origin + principal + enrolled device + live-or-recent foreground proof as for other reads. Body ≤16 KiB:

```json
{ "sessionId": "…", "artifactId": "…", "revision": "…", "variant": "full" | "thumb" }
```

Reject `latest`, missing revision, cross-session ids, unknown keys, `variant` other than the two literals. `thumb` is optional, sanitized 64×64 JPEG from the **same** snapshot, still not stored in the ledger.

**Response headers** (F6 + inbound): `Cache-Control: private, no-store, max-age=0`; `X-Content-Type-Options: nosniff`; `Cross-Origin-Resource-Policy: same-origin`; `Content-Disposition: attachment; filename="preview.jpg"` (generic name); `ETag: "<digest>"`; `X-Artifact-Revision: <revision>`. Body = sanitized bytes. Rate-limit separately (e.g. 30 full + 60 thumb per device per 5 minutes) so a stolen session cannot bulk-exfil a session’s screenshots.

Client (`useArtifactResource` from F6): `fetch` POST with credentials, `arrayBuffer` → `Blob([buf], { type: relayMime })` → `URL.createObjectURL`. Native `<img>` `src=blob:…`. **Never** `data:` URLs (they serialize into DOM dumps and cache). Revoke on close, replace, `visibilitychange`→hidden, logout, session switch, revoke-device, unmount, Strict Mode cleanup (F5 object-URL tests).

Service worker: keep bypassing `/api/`; add a regression that **POST** artifact responses never enter Cache Storage. `cache.ts` must strip/reject any block with pixel-like fields (extend F5’s attachment rejection).

Document CSP (new, on HTML responses — not only JSON):  
`default-src 'self'; img-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'`. No `data:` in `img-src`. `script-src` stays as Vite requires for the PWA.

### 2.4 Upload path (F5) — security restatement for this lens

Keep F5’s table (15 MiB source / 30 MiB batch / 4 images / 2 parallel PUTs / 10 min uncommitted TTL). Additional inbound-adjacent rules:

- Inbound artifact ids are **not** valid `attachmentIds` on `prompt.submit`. Re-sending a screenshot to Pi is a **new** F5 selection (Photos) or an explicit “Send this preview to Pi” action that copies **sanitized** bytes into a new attachment-set (still ticketed, still revision-checked). No “resend artifactId.”
- Plan mode: photo affordance may exist; image still cannot authorize tools (F5). Inbound viewer remains available (read).
- Model `imageIn` false: F5 blocks Send; inbound still displays (operator may need to see what the **previous** vision model produced).
- Provider retention disclosure (F5 first-use) applies only when pixels leave the host toward a model. Opening a preview does not.

### 2.5 UI states, gestures, a11y (reuse F6 shell)

**Card (transcript, assistant column, 68px min, 16px radius, `--surface` / `--line`, no elevation):**

| State | Visible | Actions |
|---|---|---|
| `glyph-ready` | Type glyph + `Screenshot` / `Image` + `Redacted preview` + pixelBucket | Open |
| `loading-thumb` | Same footprint; optional in-memory thumb | Open, Cancel |
| `withheld` | `Preview withheld by relay policy.` | none except Close if already open |
| `expired` / `revoked` / `missing` | F6 copy | Close |
| `offline-unavailable` | F6 copy | Retry, Close |
| `unknown-client` | existing unsupported-block copy | none |

Do **not** auto-open. Whole card = one React Aria `Button` `onPress` (F6). Accessible name: `Open screenshot preview, redacted, revision …`. Empty `alt` on decorative glyph; viewer image uses F6’s `Image preview; description not provided.` unless `displayName` is the generic label (WCAG 1.1.1).

**Viewer:** F6 `ArtifactViewerHost` image renderer only — carbon stage, `object-fit: contain`, pinch 1×–4×, double-tap fit/2×, visible Zoom out / Fit / Zoom in (44×44), Close, Escape, iOS edge-back, VoiceOver two-finger scrub. **No Share** (`shareAllowed: false`). **No Download.** Copy: none for pixels in v1 (clipboard would duplicate the secret into iOS clipboard, which other apps can read).

**Privacy cover:** on `document.visibilityState === 'hidden'`, overlay bone parchment (existing lock canvas), revoke blob URLs, clear bitmaps. On `visible`, re-fetch if the viewer is still open (generation token so a stale response cannot paint). Does not prevent iOS screenshots while foreground.

**Motion:** F6 entry 220ms overlay+`translateY(8px→0)`, exit 180ms; `prefers-reduced-motion`: opacity ≤100ms or instant. Press scale `.985` 90–120ms. Clay is not the sole error/redaction signal (F6).

**Live regions:** one `role="status"` for Opening/Loaded; one `role="alert"` for withheld/denied/corrupt. Focus heading then Close; restore to originating card (F6).

**RTL / 320px / 200%:** F6 header wrap; `<bdi>` on `displayName`; no page-level horizontal scroll.

### 2.6 Visual (fixed system)

Bone `#f8f8f6` / carbon ink / clay `#d97757`. Inter for chrome (15/20 card title, 12/16 meta); Source Serif 4 is **not** used on the card. Light + dark tokens. Contrast AA on withheld/error text without relying on clay alone.

Origin watermark (security UX, not DRM): quiet meta line `From Pi · not saved in chat history` so operators do not confuse this with F5’s “Preview not retained” user cards.

### 2.7 Tests that pin the posture

| Check | Pass |
|---|---|
| Projector | Image array items never appear as `tool_result.output` base64; object-shaped image fails closed or diverts |
| Envelope | SQLite / sync fixtures with planted base64, `/Users/…`, GPS EXIF, filename `secrets.env.png` contain none of those strings |
| Protocol | Extra keys, path-like `displayName`, non-sha256 digest, `shareAllowed: true`, `previewInEnvelope: true` rejected |
| HTTP | GET artifact URL 405; POST without session 401/403; wrong origin/device/session/revision fail closed; no Pi invocation |
| Sanitizer | SVG, HTML polyglot, GIF animation, 61 MP, truncated JPEG → `withheld`; JPEG/PNG round-trip has no EXIF |
| Cache/SW | No artifact body in Cache Storage / localStorage after open/close/reload/logout |
| URL leak | Strict Mode revoke test (F5) plus visibilitychange revoke |
| Re-injection | Submitting `artifactId` as `attachmentIds` rejected |
| CDP | 390 CSS px light/dark card + open + withheld; no horizontal overflow |

---

## 3. Divergent / minority ideas (do not converge yet)

1. **Cline-style metadata-only inbound (no pixels on the phone).** Card says “Pi viewed an image.” Matches Cline PR 4411 and F5’s `previewRetained: false`. Lowest leak surface; fails the Claude/Kimi visual bar.

2. **Do not add `inbound_image`.** Only publish F6 `file_preview` with `renderer: 'image'` and `shareAllowed: false`. One viewer, one store. Risk: F6’s thumbnail/share/export policy is too loose for screenshots unless inbound overrides are mandatory in guards.

3. **OCR withhold:** run OCR in the sanitizer worker; if POSIX path / `ghp_` / `AKIA` / `.env` patterns hit, force `withheld`. Catches some secrets; fails LLM01 (instructions need not be human-readable); OCR text must never be persisted (it **is** the secret).

4. **Ephemeral RAM artifacts:** delete bytes at `turn_end` / 10 min. History shows glyph forever; reopen is `expired`. Closest to F5 ethics; fights “scroll back and look at the screenshot.”

5. **Canvas-only paint** (`createImageBitmap` → canvas, never `<img>`). Extra control to wipe pixels on hide; more a11y work (canvas is not a replacement for `<img>` without a text alternative).

6. **Second fd / Unix socket for image bytes** instead of quarantine files, so Pi tools never see a path. Requires a Pi/RPC change; JSONL stays small. Highest engineering cost, cleanest boundary.

7. **Embed `AgentSession` instead of `pi --mode rpc`** ([RPC docs Node note](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)) so the host can intercept `ImageContent` in-process without stdout. Conflicts with current supervisor/fixture architecture.

8. **Separate `screenshot` vs `generated` policy.** Generated images (pi-mono#3817 / `ImagesOutputContent`) might allow Share; host screenshots never. Two origins in one card type.

9. **Blurhash in the envelope** for Claude-like thumbs without bytes. Blurhash of a terminal is still identifying; treat as a leak.

10. **Keep GET artifacts as F6 wrote.** Simpler `<img src>`. **Rejected by this lens** unless cookies are withheld (they cannot be, same origin) and IDs are not logged (they will be).

11. **Kimi video_in parity.** Out of F5 non-goals; would explode sanitizer/CDR scope. Do not sneak in.

12. **Watermark/steganography on inbound rasters** so leaked screenshots are attributable. Conflicts with “re-encode to strip payloads”; watermarks are payload.

---

## 4. Open questions + risks

- **Pinned Pi version:** Does the deployed binary emit `ToolResultMessage` images on RPC stdout today, or only in-process? If yes, 1 MiB framing will already drop large screenshots — confirm with a fixture, do not assume silence is safety.
- **pi-mono#3817:** If assistant `ImageContent` lands, `projectMessage` must grow a third intercept (not only `toolResult`). Treat generated images as `mediaClass: 'generated'` only after policy review.
- **HEIC inbound:** F5 accepts HEIC **ingress from iPhone**. Inbound from Pi should already be JPEG/PNG after host sanitizer; do not teach the PWA to decode HEIC from the relay.
- **App Switcher:** JS cover is best-effort. Residual risk: iOS snapshot taken while visible. Accept or require a native wrapper (out of PWA scope).
- **Stolen session cookie:** `artifact:read` plus rate limits still exfils every screenshot in-session. Consider binding reads to a short-lived, one-use **read coupon** (not a mutation ticket) issued when the card enters the viewport. Divergent; adds UX latency.
- **Decoder RCE / decompression bombs:** unprivileged worker + 5 s / 15 s walls (F5). Pick a maintained decoder; pin it.
- **LLM01 on F5 re-upload:** a hostile page Pi screenshotted can contain “ignore plan mode.” Host/extension Plan mode must remain the authority even if the model “agrees.” Add a regression: image bytes never listed in `authorizeAction`.
- **Sync page size:** many inbound cards with metadata only should stay well under 64 KiB; test a 50-screenshot turn.
- **Retention vs SQLite backups:** artifact bytes must not ride into DB dumps. Confirm migrations keep blobs in a sidecar directory excluded from the redacted ledger backup story.
- **Mobbin inbound gap:** no public Mobbin flow was found for “agent sent me a screenshot of the host.” UX bar is inferred from Claude artifact cards + ChatGPT/Gemini generated-media cards, not from a true remote-CLI analog.
- **CSP vs Vite:** tightening document CSP may break the dev server (`unsafe-eval` / module). Spec production headers separately from `vite` middleware.
- **Thumb variant:** even on-demand thumbs leak. Default `variant: "full"` only when the viewer opens; cards stay glyph-only until a later flag.

---

## 5. Sources

### This repo (normative)

- [specs/002/F5-media-upload/spec.md](specs/002/F5-media-upload/spec.md)
- [specs/002/F6-file-preview/spec.md](specs/002/F6-file-preview/spec.md)
- [docs/security.md](docs/security.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [docs/feature-catalog/transport-and-state/canonical-redaction.md](docs/feature-catalog/transport-and-state/canonical-redaction.md)
- `apps/pi-remote-relay/src/store/redaction.ts`
- `apps/pi-remote-relay/src/store/transcript-projector.ts` (`textFromContent`, `projectMessage`)
- `apps/pi-remote-relay/src/http/server.ts` (POST-only, 16 KiB, CSP on JSON)
- `apps/pi-remote-relay/src/rpc/framing.ts` (1 MiB JSONL)
- `apps/pi-remote-relay/src/auth/policy.ts`
- `apps/pi-remote-web/public/service-worker.js`
- `apps/pi-remote-web/src/cache.ts`
- `apps/pi-remote-web/src/App.tsx` (unknown/redacted block)
- `packages/pi-rpc-protocol/src/types.ts` (`ImageContent` outbound only; transcript kinds)
- [docs/design-reference/mobile-chat-apps/01-visual-teardown.md](docs/design-reference/mobile-chat-apps/01-visual-teardown.md)
- [docs/design-reference/mobile-chat-apps/council-gpt-sol.md](docs/design-reference/mobile-chat-apps/council-gpt-sol.md)

### Pi / RPC / ACP / MCP

- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md
- https://github.com/badlogic/pi-mono/blob/main/packages/ai/src/types.ts
- https://github.com/badlogic/pi-mono/issues/3817
- https://www.npmjs.com/package/@mariozechner/pi-coding-agent
- https://agentclientprotocol.com/protocol/v2/content
- https://github.com/agentclientprotocol/agent-client-protocol
- https://modelcontextprotocol.io/specification/2026-07-28/schema#contentblock

### Claude / OpenCode / Kimi (target bar + limits)

- https://platform.claude.com/docs/en/build-with-claude/vision
- https://platform.claude.com/docs/en/api/messages/create
- https://opencode.ai/v2/docs/attachments
- https://opencode.ai/docs/config/
- https://moonshotai.github.io/kimi-code/en/guides/interaction.html
- https://github.com/MoonshotAI/Kimi-code
- https://www.kimi.com/resources/kimi-code-introduction

### Coding-agent prior art (GitHub / npm)

- https://github.com/cline/cline/pull/4411
- https://github.com/continuedev/continue/pull/7503
- https://github.com/paul-gauthier/aider/issues/1025
- https://www.npmjs.com/package/opencode-image-viewer
- https://github.com/samiulsami/opencode-image-proxy
- https://github.com/noamsto/aeye
- https://github.com/can1357/oh-my-pi

### Security / a11y / platform

- https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload
- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- https://labs.cloudsecurityalliance.org/research/csa-research-note-image-prompt-injection-multimodal-llm-2026/
- https://redteams.ai/topics/multimodal/multimodal-prompt-injection-images
- https://developer.apple.com/design/human-interface-guidelines/privacy
- https://developer.apple.com/forums/thread/824922
- https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
- https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html

### Mobbin

- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 (Claude iOS image input)
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 (Claude iOS chat detail)
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 (ChatGPT iOS chat interface)
- https://mobbin.com/explore/flows/e5b8846f-e7bb-481a-82bd-47f29bfb6653 (Gemini iOS image identify)
- https://mobbin.com/explore/flows/f922cc48-a6ba-417c-8db3-5616d7b4837a (Gemini web prompt-with-image)

*Mobbin MCP was not callable in this session; citations are the public Mobbin URLs above.*
