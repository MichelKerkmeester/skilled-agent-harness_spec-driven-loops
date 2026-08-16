<!-- provenance: external-CLI orchestration pass; original file iter-15-deepseek.md -->
> **Source pass 15** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-15-deepseek.md`.

<!-- F8-inbound-media | model=deepseek | lens=security-redaction | iter 15/15 | 2026-08-16T04:33:30.246Z -->

I'll research this security-redaction lens. Let me first ground myself in the actual codebase state, then do targeted web research.
Let me read the core protocol, relay redaction/store, and web app files.
Now the relay store, transcript projector, demux, and the web-side transcript rendering + docs (F5/F6).
Now the web app's transcript rendering, and docs describing F5/F6 and the design system.
Let me see the rest of the Block renderer and check for existing image handling + specs folders.
Let me examine the F7 spec folder, F6/F5 references in the design docs, and the client relay/state layer.
Let me read the F8 brief, F5 spec (the outbound analog), prior F8 iterations, and the security doc.
Let me review the prior F8 iterations to avoid duplication and understand research state, plus key security docs and relay server.
Let me scan the other F8 iterations' lenses and the relay server/guards to ground the spec in real contracts.
Let me read the remaining security/traffic files and the client-cache boundaries.
Let me quickly confirm the client unknown-block handling and the F6 viewer SYNTHESIS decisions, then start web research.
Now web research. Let me check the PWA's CSP in index.html, then fetch security sources in parallel.
Now web research on the security-redaction lens. Fetching key sources in parallel.
The Apple App Switcher doc 404'd — let me fetch the correct Apple and other sources.
Matrix spec confirmed the redactions/content-repo context. Let me verify two more security-relevant sources: Anthropic's computer-use security notes and the Web Share API.
# Deep-Research Pass 15/15 — Lens: **security-redaction** (inbound media: threat surface, read-only/redaction posture, exact safe path pi→relay→phone)

---

## 1. Findings for this lens

### 1.1 Code-grounded fact: the current transports *cannot* carry one screenshot, structurally

The relay's postures are enforced with hard byte ceilings that make "just add an image content kind" impossible, so the delivery mechanism is dictated by the code before any design work:

- The RPC JSONL framing caps each record at **1 MiB** before an LF delimiter (`apps/pi-remote-relay/src/rpc/framing.ts:7`), and the framing error handler *destroys the buffer* on overflow (`framing.ts:29-34`) — an oversized image part would wed the whole agent stream, not just the image.
- The sync WebSocket is capped at **64 KiB** per message (`apps/pi-remote-relay/src/http/server.ts:40`) and HTTP JSON bodies at **16 KiB** (`server.ts:39`, `readBody` `server.ts:895-909`), and the server is **POST-only** (`server.ts:305`).
- The durable store redacts **before persistence and broadcast** (`redactEnvelope` at `apps/pi-remote-relay/src/store/relay-store.ts:84-88`), and the relay's policy is explicitly described as "redacts before persistence and broadcast" (`docs/security.md:35`).

**Consequence (spec-level):** inbound bytes cannot ride the RPC event, the sync WS, or any durable envelope. The only consistent path is a *separate artifact lane* written by the host extension and read by the phone through an authenticated, digest-checked binary route — exactly the shape F6 already specified for `file_preview` (`specs/002/F6-file-preview/spec.md:36-68`). F8 must reuse that store, not invent a parallel one.

### 1.2 The real threat model inverts the F5 (outbound) one, and it matters

F5's security problem was *user→relay* untrusted uploads (`specs/002/F5-media-upload/spec.md:229-273`). Inbound is different and **worse in one respect**: pi runs inside a *workspace containing untrusted third-party content*, and it may retransmit a screenshot of, or an extracted image from, that content. Anthropic's own computer-use documentation states this explicitly and is the strongest precedent for treating agent-supplied images as untrusted content on arrival:

> "In some circumstances, Claude will follow commands found in content even when they conflict with your instructions. For example, instructions on webpages **or contained in images** might override your instructions… Claude has been trained… classifiers will automatically run on your prompts to flag potential instances of prompt injections… when classifiers identify potential prompt injections **in screenshots**, they will automatically steer the model to ask for user confirmation." — [Anthropic computer use security considerations](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool#security-considerations)

Security-design consequences this forces for Pi Remote:

1. **Images are content, not trusted media.** The phone must not auto-open, must not extract URLs/tokens from a caption, must not render SVG/HTML, and must never treat anything visible inside an image as an instruction. (Pi Remote's plan-mode posture already refuses image-authority on the outbound side — `F5 spec:239` — the same rule must hold inbound.)
2. **An "attacker image" can be crafted to weaponize a decoder.** OWASP's File Upload Cheat Sheet catalogs exactly this class: parser-exploiting files, decompression/XML-bomb style amplification, client-side active content — and prescribes the defense this feature needs: never trust Content-Type; validate *file signatures (magic bytes)*; run content through a **CDR-style "image rewriting / re-encode"** that destroys injected payloads; store outside the webroot; size-limit both after decompression and at request time ([OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)).
3. **Screenshots can contain real secrets** (password managers, env tokens on screen, provider keys in a browser). The app-level mitigation is the same honesty F5 uses — a disclosure that a copy is transmitted and rendered, plus no durable retention; the pipeline-level mitigation that actually can work is metadata stripping (EXIF/IPTC/XMP) and **documented non-removal of content-level secrets** in the threat model (`iter-14` already flagged this boundary at `specs/002/F8-inbound-media/001-research/iter-14-deepseek.md:144`).

### 1.3 Redaction of the *durable transcript* must be allowlist-based, and the bytes must be absent from it entirely

The code already encodes the two-layer redaction model F8 needs:

- **Layer 1 — strip-list rewrite:** `redactString` rewrites paths/secrets with constant placeholders (`apps/pi-remote-relay/src/store/redaction.ts:23-33,94-100`). A screenshot *caption* must pass through this; a screenshot's *bytes cannot* (see §1.1).
- **Layer 2 — allowlist projection:** the runtime/command DTOs are built by explicit projectors that "emit only the exact bounded fields… a leak is structurally impossible rather than pattern-dependent" (`redaction.ts:122-127`). The inbound `image` block must be added as a **new allowlisted block kind**, not as a free-form field appended to an existing kind.

Matrix is the reference here for the key architectural point: **redaction of the message and handling of the bytes are separate primitives.** An event can be redacted while `mxc://` media is handled by the content repository with its own thumbnailing and security section; the event points at media, it does not *contain* it ([Matrix CS API — Redactions](https://spec.matrix.org/v1.11/client-server-api/#redactions); [Content repository / mxc](https://spec.matrix.org/v1.11/client-server-api/#content-repository)). Pi Remote already follows this shape for `file_diff`; F8 makes the media-reference explicit.

Also grounded in code: **unknown-kind degradation is safe and already built.** `parseDisplayBlock` maps unrecognized kinds to `{ kind: 'unknown', originalKind }` (`apps/pi-remote-web/src/state.ts:111-112,317-318`) and `Block` renders them as "A redacted “X” block cannot be displayed" (`apps/pi-remote-web/src/App.tsx:1535-1542`). A new sibling `image` kind therefore fails *toward* the honest redacted card on old clients — not toward silent dropping. This is a security win and a reason to prefer a **sibling block kind** (close cousin of F6's `file_preview`) over attaching a part inside `tool_result` (which `textFromContent` would silently discard — `transcript-projector.ts:457-469`).

### 1.4 Phone-side redaction surfaces: where a PWA leaks the image even if the relay is perfect

The redaction posture doesn't end at the store. On an installed iPhone PWA the image can surface in places the developer gets no network decision about:

- **App-Switcher snapshot.** iOS snapshots the current screen when the app backgrounds; banking apps deliberately overwrite it. Apple's guidance for that class of leak is the HIG Privacy principle "reduce… the amount of sensitive information… on screen" and the documented UIKit approach of covering the view during `sceneWillResignActive` ([Apple HIG — Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy); the PWA equivalent is an opaque privacy overlay driven by `visibilitychange`/`pagehide`, same trick F5 already mandates as "background privacy covering" — `F5 spec:266`).
- **Notification payloads.** The existing push discipline is the model: a push contains exactly `lookupId` + `attentionClass`, never content ([push payload contract, `docs/security.md:104-107`]). Inbound images must add: never put an image or its caption in a push.
- **Share sheet / long-press.** `navigator.share` with `files` requires a pre-prepared `File` and `canShare()`; it also requires transient activation and can be rejected (`AbortError`) — and cannot be script-gated (MDN: [Navigator.share security](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#security)). Long-press "Save Image" on an `<img>` is user-initiated and unwrappable; the design must decide the posture (block `-webkit-user-select` don't prevent it; disclosure is the honest answer).
- **Screen recording / AirPlay during full-screen viewing.** Native apps can block this; a PWA cannot. It's a residual risk to record, not to try to fix client-side.
- **The read-only localStorage cache and the service worker must never receive pixels.** `cache.ts` persists bounded transcript DTOs (`saveCache`, `cache.ts:54-84`); the service worker currently caches *every same-origin GET* except `/api/` and `/health` (`apps/pi-remote-web/public/service-worker.js:24-56`). A binary artifact route under `/api/` is automatically SW-bypassed; anything else needs an explicit regression test. This mirrors F6's "artifact responses never enter Cache Storage… network-only" rule (`F6 spec:224-225`).

### 1.5 Delivery to the renderer: digest-first, decode-gated, blob-URL, CSP-clean

The rendering path is where most PWA image bugs become security/UX bugs:

- Fetch bytes via the authenticated **POST read** (the server is POST-only — `server.ts:305`; reads like `transcript:read` already work this way), return `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, `Cross-Origin-Resource-Policy: same-origin`, ETag = SHA-256 digest (matching F6's header budget, `F6 spec:110`).
- **Verify the digest in a worker before rendering.** `HTMLImageElement.decode()` fires `EncodingError` on corrupt data and resolves only when the frame is decodable — the canonical "no blank/broken image flash" gate, and it also times decode within the fetch pipeline rather than at paint ([MDN — HTMLImageElement.decode()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode)). A digest mismatch must render a persistent `failed` state, never a blank `<img>`.
- The app ships **no CSP yet** (`apps/pi-remote-web/index.html:1-19`); the relay *does* send CSP on API responses (`server.ts:930`). Adding inbound images makes a real CSP necessary: `img-src 'self' blob:` and `connect-src 'self' blob:` (MDN: [CSP img-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src)) or the blob-URL render strategy breaks under any future hardening.
- Because a bare `<img src="/api/…">` GET neither carries an Origin header nor lets us enforce the same strictness as the POST routes (and authenticates by ambient cookie), the exact-tuple fetch should be a **clear-text POST with a JSON body** that names the digest — so the response's content-integrity is checkable independently of TLS. (This is the one deliberate, justified divergence from "fetch it as an image tag".)

### 1.6 Read authorization: session-bound reads, not one-use tickets

One-use tickets exist in this system for *mutations* (`prompt:submit`, `runtime:control`, `prompt:abort` — `auth-service.ts` consumption is keyed to those action names, e.g. `server.ts:516-521,582-594`). Inbound image **reads** should not consume that machinery: the transcript references an artifact that the user may legitimately re-fetch (thumbnail, full-screen, iOS memory purge re-decode, bfcache restore). The `image` block warrants a new action `artifact:read` in `auth/policy.ts:16-23`, authenticated by the existing application-session cookie + exact `{ sessionId, artifactId, revision, digest }` tuple + principal/Origin checks from `authenticateIngress` (`server.ts:795-812`), plus its own read rate limit. This keeps the *write* side the only one-use-ticketed surface (the host extension already authenticates via the extension-authority secret — `server.ts:709-789`).

---

## 2. Concrete spec contribution (a build phase can execute this)

### 2.1 New transcript block — a sibling `image` kind (allowlisted, metadata-only)

```ts
type ImageBlock = {
  kind: 'image';                       // NEW sibling kind; NOT a part inside tool_result
  id: string;  revision: number;  seq: number;  occurredAt: string; // from TranscriptBlockBase
  artifactId: string;                 // opaque 128-bit base64url; NO host path, NO filename
  revision: string;                   // exact opaque artifact revision (never coerced into numeric)
  digest: string;                     // lowercase SHA-256 of the SANITIZED bytes
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  width: number;  height: number;     // intrinsic, post-sanitize; bounds-checked
  byteLength: number;                 // sanitized derivative size
  caption: string | null;             // already run through redactString(); ≤ 200 chars
  redaction: 'none' | 'caption-redacted' | 'withheld';
  thumbnailRef: { artifactId: string; digest: string; mimeType: 'image/webp'; width: 320 };
  source: 'screenshot' | 'retrieved' | 'unspecified';  // relay-authored label only
  shareAllowed: boolean;              // default false for screenshots
  content: { kind: 'artifact-ref' } | { kind: 'none' };
};
```

- Add guard case in `isTranscriptBlock` (`packages/pi-rpc-protocol/src/guards.ts:369-402`) with strict-key checking, bounded caption (≤200 chars, no path separators), SHA-256 digest regex, bounded opaque IDs (reuse `isOpaqueId`), integer dims within the stage cap.
- `state.ts` `parseDisplayBlock` keeps old-client behavior (→ `unknown` card, `state.ts:317`); the new kind is additive and backward-compatible.
- Storage: the block is a normal redacted envelope; `redactEnvelope` runs first (`relay-store.ts:84-88`). **Bytes never enter the envelope** — verified by a fixture that scans `envelope_json`, localStorage cache rows (`cache.ts:54-84`), and sync frames for pixel/base64/path markers.

### 2.2 Sanitization pipeline — runs at the relay before digest and before storage

Digest is computed **after** purification; order is load-bearing.

1. **Default-deny type check:** sniff magic bytes, never trust a claimed MIME/extension (`redactString`-style allowlist is inverted here — this is OWASP "file signature validation", [OWASP File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)).
2. **Decode → re-encode** in a bounded, unprivileged worker (matches F5's decoder budget: 5 s per image, [F5 spec:253]); this is the CDR "image rewriting" defense that destroys polyglot/parser-payload content ([OWASP File Upload — File Content Validation](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html#file-content-validation)).
3. **Bomb & dimension guards:** ≤ 6 MP decoded stage, longest edge ≤ 4,000 px, single frame; reject GIF/APNG/animated WebP/SVG; decompression-bomb guard counts decoded pixels, not file bytes.
4. **Metadata strip:** drop EXIF/GPS/IPTC/XMP/ICC-profiles/debug chunks on the grid when they contain paths or GPS; force 8-bit sRGB; output JPEG(q≈85) or WebP, thumb 320 px WebP.
5. **Opaque identity:** mint `artifactId` (random, not digest-derived — id must not leak content), revision on re-push, then `digest = sha-256(sanitized bytes)`. Thumbnail is a separate artifact with its own digest, also referenced by opaque id.
6. **Quota & lifecycle:** per-session bytes + artifact count budgets, LRU eviction, pinned for as long as a transcript references it; purge on session close/revocation/logout (reuse/relocate F6's `artifact-store.ts` — `F6 spec:242`). **No raw host path, filename, or source bytes** survive in any durable structure.

### 2.3 Host-extension write path (the exact safe route pi→relay)

The relay cannot trust pi's stdout (framing cap, §1.1) and must not accept bytes over the phone-visible HTTP at all. Therefore:

1. The **pi-side extension** is the only writer. It POSTs the image to the loopback extension-authority route (`/api/extension/artifact/publish`) using the existing shared-secret authority pattern (`server.ts:709-789`) — a new published action, still denied-by-default in `auth/policy.ts` until enabled.
2. The extension **pre-screens** the file (the agent's own tool output), then the relay re-runs the full sanitizer (§2.2) before committing bytes + minting identity. The relay, not pi, issues `artifactId`/revision/digest.
3. Only after the sanitized artifact commits does the relay emit the `image` block into the transcript stream (via the supervisor/projector path — add the emit in `projectToolResult`/`projectMessage`, `transcript-projector.ts:309-372`).
4. **Plan mode:** rendering/reading remains authorized in Plan mode (it is a read surface; the relay route never invokes a Pi tool — mirrors `F6 spec:112`). Host-extension enforcement decides whether pi may *capture* a screenshot in Plan mode — default host-side setting, not a client decision.

### 2.4 Phone read path and rendering

- Client calls `POST /api/artifacts/read` with `{ sessionId, artifactId, revision, digest }`. Relay validates application session, principal, Origin, exact tuple ownership, then streams `image/*` bytes with `Cache-Control: private, no-store, max-age=0`, `nosniff`, `CORP: same-origin`, ETag = digest. Route lives under `/api/` so the service worker never caches it (`service-worker.js:28`), with an explicit regression test (F6 precedent: `F6 spec:110,224-225`).
- Client **keeps bytes in a `Blob` + object URL**, revokes on close/navigation/route-change/unmount, and treats ALL bytes as process-local memory: strips them from React state, never from `localStorage`, never from Cache Storage.
- Renderer gates on `await img.decode()` after a **worker-side SHA-256 check against `digest`**; mismatch/corruption/`EncodingError` → persistent `failed` state (`"This image didn't render. Tap to retry."`), never a blank tile. Thumbnails render `loading="lazy"` + `decoding="async"`.
- CSP hygiene (required now that images exist): `img-src 'self' blob:`; `connect-src 'self' blob:`. No third-party image hosts ever.

### 2.5 UI states, gestures, a11y (security-flavored slice)

States: `pending-metadata` (aspect-ratio placeholder at intrinsic ratio, no CLS) → `fetching` (bone spinner) → `ready` / `failed` (digest/network) / `redacted` (hatch + "Image redacted" serif caption) / `expired` (artifact purged) / `withheld` (policy, no payload). Tapping opens the F6 full-screen shell; the shell freezes `{ artifactId, revision, digest, blob }`.

- Tap/release opens; iOS edge-back / Close / Esc / VoiceOver two-finger scrub dismiss via history-back; — no swipe-down dismiss in v1 (adopt F6's rationale: `F6 spec:7,201-206`). Pinch 1×–4× with visible Zoom buttons; double-tap fit↔2×.
- a11y: each card is `role="img"`, `aria-label` = `caption || "Pi sent an image"` + dimensions + redaction state; no image is `aria-hidden`; announce `Image ready`, `Image failed`, `Image redacted` in one polite status region. 44×44 controls, focus returns to origin card.
- **Privacy surfaces:** on `visibilitychange`/`pagehide`, cover the viewer with an opaque bone overlay so the iOS App-Switcher snapshot shows no pixels (Apple HIG privacy posture: [HIG — Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)); no push/payload ever contains an image or caption; Share (when `shareAllowed`) only via pre-prepared exact bytes + `canShare({ files })` (MDN: [Navigator.share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)); after logout/revoke, purge in-memory blobs and object URLs through the existing cache-clearing path.

### 2.6 Redaction rules table (durable + observable, mirroring F5's structure)

| Surface | Allowed | Never |
|---|---|---|
| Transcript block | kind, ids/revision/digest, safe dims, captions (post-redactString), redaction state | pixels, base64, paths, filenames, source MIME, EXIF, OCR, provider payloads |
| Reload/sync/cache (`cache.ts`) | the metadata block only | bytes, object URLs, thumbnails |
| Push/notifications | existing `lookupId`+`attentionClass` only ([security.md:104](docs/security.md)) | image, caption, digest |
| Logs | error code + coarse size bucket | artifact id, digest, decoder exceptions, captions |
| Screenshot/privacy overlay | bone cover while backgrounded | visible pixels in App Switcher snapshot |
| Share | pre-prepared exact-revision file only if `shareAllowed` | raw source bytes, host path, image-backed URL |

---

## 3. Divergent / minority ideas worth resisting-convergence-on

1. **Attach `image` as a part inside `tool_result` (iter-14's recommendation) instead of a sibling kind.** I argued the opposite (§1.3): `textFromContent` today silently drops non-text parts, so old clients would *lose* the image silently rather than show the honest redacted card; the codebase's block model and F6's `file_preview` precedent prefer sibling kinds. If a part-based design is chosen, the projector must *always* emit a visible placeholder even for unknown parts — the exact bug the sibling design avoids.
2. **Digest-derived artifact ids (CID-style).** Gives free dedup and cache keys, but leaks a content fingerprint into every id — and an opaque random id plus the digest-in-transcript already gives all the integrity you need. Rejected for the security lens; dedup can use the digest column internally.
3. **Small images inline as base64 in the RPC event.** Eliminates the artifact store entirely for ≤250 KB images, but 250 KB base64 ≈ 340 KB on a **64 KiB WebSocket** — impossible today. A future dedicated inbound WS message class is the only way; do not tunnel through sync.
4. **First-screenshot-per-session consent gate.** Echoes Anthropic's "inform end users and obtain consent" and plan-mode's consent posture; defensible, but it will feel like friction against Claude/Kimi parity. Ship *without* the gate; flag as a phased option.
5. **"Images never leave the host; push phonedowns."** The privacy-ultimate variant — but it sacrifices the core goal (full-screen, pinch-zoom, share). Keep the "carbon stage re-encode" as the middle ground.

---

## 4. Open questions + risks

- **Who sanitizes — relay or extension?** Pre-screening on the host keeps secrets off the loopback-LAN, but puts decoder surface into the extension process. The relay re-encoding (§2.3) is the hard requirement; pre-screening is defense-in-depth.
- **GC/eviction race:** LRU purge can hard-code a still-referenced artifact → must distinguish `expired` from `missing` and keep a "pin" for transcript-referenced ids.
- **iOS memory pressure:** 4000 px × 6 MP stage images re-decode under scroll; client must be able to re-fetch the exact revision with a still-valid session (reads are session-bound, so this works — but confirm under real iPhone bfcache/WebKit eviction).
- **Content-level secrets are NOT removable by this feature.** The threat model must say so; the only mitigations are disclosure, ephemerality, and not auto-sharing. (Iter-14 flagged the same boundary.)
- **Screen-recording/AirPlay during full-screen viewing cannot be blocked in a PWA** — a documented residual exposure, not a bug to fight.
- **Old-client transparency:** verify a full `image` block on a pre-F8 build yields the `unknown`/"redacted" card in `Block` (`App.tsx:1535`) and that the trailing `activity`-grouping rules don't fold it into a collapsed disclosure invisibly (`App.tsx:1312-1323`).
- **CSP regression risk:** the app has no CSP today; adding one alongside this feature is in-scope but must not break `blob:` URLs used by the transcript/composer.

---

## 5. Sources

**Repo/grounded (file:line)**
- `packages/pi-rpc-protocol/src/types.ts:12-16` (existing outbound `ImageContent`), `:232-239` (transcript kind union)
- `packages/pi-rpc-protocol/src/guards.ts:369-402` (`isTranscriptBlock`)
- `apps/pi-remote-relay/src/store/redaction.ts:23-33,94-127` (strip-list + allowlist projectors)
- `apps/pi-remote-relay/src/store/relay-store.ts:84-88` (redact-before-persist)
- `apps/pi-remote-relay/src/rpc/framing.ts:7,29-34` (1 MiB record cap)
- `apps/pi-remote-relay/src/rpc/demux.ts:40-65` (pinned event/response contract)
- `apps/pi-remote-relay/src/store/transcript-projector.ts:457-469` (`textFromContent` drops non-text)
- `apps/pi-remote-relay/src/http/server.ts:39-40,305,316-317,516-521,795-812` (POST-only, caps, ticket binding, ingress)
- `apps/pi-remote-relay/src/auth/policy.ts:16-23` (action allowlist)
- `apps/pi-remote-web/src/state.ts:111-112,317-318` (unknown-kind degrade), `apps/pi-remote-web/src/App.tsx:1535-1542` (redacted unsupported card)
- `apps/pi-remote-web/src/cache.ts:54-84` (bounded localStorage transcript), `apps/pi-remote-web/public/service-worker.js:24-56` (GET caching vs `/api/`)
- `docs/security.md:35,104-107` (redact posture; push = lookupId + attentionClass)
- `specs/002/F6-file-preview/spec.md:7,36-68,110-112,224-225` (viewer shell + artifact store contract)
- `specs/002/F5-media-upload/spec.md:229-273` (upload/redaction/prototype posture, outbound analog)
- `specs/002/F8-inbound-media/001-research/iter-14-deepseek.md` (prior-art pass; built on, diverged on parts-vs-kind)

**Web (verified via fetch)**
- OWASP File Upload Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html (magic-byte sniffing, image rewriting/CDR, outside-webroot, size/decompression limits)
- Anthropic computer use security — https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool (images as possible prompt-injection/instruction-override content; screenshot classifiers; consent)
- Anth – computer-use-demo (agent loop returning screenshots as `tool_result`) — https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo
- Matrix CS API v1.11 — Redactions: https://spec.matrix.org/v1.11/client-server-api/#redactions ; Content repository / mxc + thumbnails: https://spec.matrix.org/v1.11/client-server-api/#content-repository
- MDN — `HTMLImageElement.decode()` (EncodingError, decode-before-append gate): https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode
- MDN — CSP `img-src`: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src
- MDN — `Navigator.share()` (activation, canShare files, hostile-share rejection, AbortError): https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- Apple HIG — Privacy (app-switcher-screen rationale): https://developer.apple.com/design/human-interface-guidelines/privacy

**Mobbin / app (reference flows; sign-in required, per repo convention)**
- Claude iOS app (target bar; inline image + full-screen viewer) — https://apps.apple.com/app/claude-by-anthropic/id1508268954
- Kimi Code (target bar) — https://www.kimi.com/code/
- Mobbin flows — https://mobbin.com/apps/claude-ai (inbound image cards/viewer), https://mobbin.com/apps/whatsapp (image card + full-screen pager/privacy posture)
