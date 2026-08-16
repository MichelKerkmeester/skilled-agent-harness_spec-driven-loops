<!-- provenance: external-CLI orchestration pass; original file iter-13-deepseek.md -->
> **Source pass 13** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-13-deepseek.md`.

<!-- F5-media-upload | model=deepseek | lens=react-implementation | iter 13/15 | 2026-08-15T19:55:44.553Z -->

I'm the react-implementation researcher on this feature. Let me ground myself in the actual codebase and primary sources before writing.
Now let me read the actual composer, relay, and ticket code to ground the spec, plus fetch iOS-specific sources.
Good grounding. Now the relay wire layer plus iOS-specific APIs.
One more source to pin down `FileTrigger` internals (hidden input, value reset for re-select, camera mapping).
# Pi Remote — Upload media from the iOS gallery into the chat
**Independent deep-research pass · iteration 13/15 · lens: react-implementation (React 19 + react-aria-components + Tailwind 4 on iOS Safari / installed PWA)**

---

## 1. Findings for this lens

### 1.1 The exact primitive already in your stack is `FileTrigger` — but it is a pump, not a pipeline
`react-aria-components` ships a `FileTrigger` built for exactly this job: it wraps any pressable RAC component (your existing `Button`/`Pressable`) and renders the canonical hidden `<input type="file">`. Reading the source pins four behaviors you get for free:

- On press it **resets `input.value = ''` before calling `.click()`**, so re-selecting the *same* photo fires `change` again — this is the standard fix for the iOS "same file doesn't re-fire change" trap, already solved inside the library (`FileTrigger.tsx`, `onPress` handler) [SOURCE: https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/FileTrigger.tsx].
- `defaultCamera?: 'environment' | 'user'` maps 1:1 to the modern string-form `capture` attribute on the hidden input [SOURCE: https://react-spectrum.adobe.com/react-aria/FileTrigger.html] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file].
- `acceptedFileTypes?: ReadonlyArray<string>` is flattened via `.toString()` into `accept="image/heic,image/jpeg,…"` — so your accept allowlist is a thin array, not one fragile string.
- `onSelect(fileList: FileList | null)` is the *only* hook: you receive the `File` objects and own **everything downstream** — validation, HEIC handling, downscale, preview, objectURL lifecycle, upload. There is deliberately no EXIF, no size check, no preview, no upload in the component [SOURCE: same source].

**Two things `FileTrigger` cannot give you on iOS:** (a) a single affordance that reliably offers *both* gallery and camera — the `capture` attribute forces the camera path and suppresses gallery; omitting it puts the user-agent in charge, and iOS then shows the photo library (compat behavior varies across iOS versions — verify on device) [SOURCE: https://react-spectrum.adobe.com/react-aria/FileTrigger.html] — and (b) `multiple` is ignored whenever `capture` forces the direct-camera path (returns a single capture), which is a real UX difference between your two triggers [SOURCE: MDN file input notes, camera paths are user-agent-defined]. Conclusion: **build two sibling `FileTrigger`s** (Photo Library = `accept`+`allowsMultiple`, Camera = `+defaultCamera="environment"`), not one clever input.

### 1.2 HEIC is a first-class input you must design for — and only Safari 17+ can decode it
iPhone's default camera output is `.heic` (type `image/heic`). Decode support in `<img>` **and** canvas `drawImage` starts at **Safari/iOS Safari 17.0** per caniuse; iOS 16 and earlier cannot decode HEIC at all [SOURCE: https://caniuse.com/heic]. Consequences for this codebase:

- Every HEIC sample **must** be re-encoded to JPEG client-side before it reaches the relay or pi, or you ship bytes the rest of the world (Chrome, pi's host) may not render, and you ship 1–10 MB for what could be ~150 KB.
- The decode→re-encode path is only executable in-browser *when the browser can decode*. On a Safari 17+ device: `createImageBitmap(file)` then `canvas.toBlob('image/jpeg', 0.8)` and upload the re-encoded blob. On iOS < 17 there is no pure-JS HEIC fallback that reads HEVC payloads without a WASM codec (`heic2any` wraps libheif WASM); ship `heic2any` as a **dynamic import** for the pre-17 window, or simply reject HEIC with a clear message on old devices [SOURCE: https://caniuse.com/heic] [SOURCE: prior-art lib: https://github.com/catdad-experiments/heic2any].
- `createImageBitmap` does **not** remap EXIF orientation by default; the widely-tested workaround is the `browser-image-compression` approach — decode via an `<img>` with the blob URL and let the browser's built-in EXIF-orientation handling apply, then draw the *oriented* bitmap to canvas. That library ships exactly this normalize-then-encode pipeline and is the de-facto prior art for "compress in the browser before upload" [SOURCE: prior-art lib README: https://github.com/Donaldcwl/browser-image-compression].

### 1.3 The keyboard will eat your composer unless you track `visualViewport` — `position: fixed` alone is wrong
This PWA runs in Safari's standalone (installed) mode, where the app is full-screen under the notch and home indicator. The documented, canonical behavior: the on-screen keyboard **shrinks the visual viewport without touching the layout viewport**, and `position: fixed` elements (your bottom-anchored composer tray) do *not* follow the OSK [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport]. The section shows and warns that the platform's own `position: device-fixed` emulation needs `translate()` driven from `visualViewport.resize` and can flicker if done naively [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport#simulating_position_device-fixed]. Practical spec for this app: keep `.composer-region` in normal flow (not fixed), and when an attach sheet/preview strip opens over the keyboard, render it inside a fixed overlay whose `top`/`height` is driven by `visualViewport.height + offsetTop` recomputed on `resize`/`scroll`. Also add `viewport-fit=cover` + `env(safe-area-inset-bottom)` padding so the installed-app home indicator never covers the send button [SOURCE: MDN Viewport concepts / safe-area — verified pattern, see §2].

### 1.4 Your composer is already the right shape; the attachment state machine has no home yet
`SessionComposer.tsx` is one bottom tray: `textarea` + `.composer-bar` (`.`: left `ComposerTools` popover, right morphing circular primary). Attachment state is *new* vertical dimension that must be lifted **above** the `.composer-tray` box (`composer-region`) so the tray's `MAX_TRAY_HEIGHT_PX = 140` growth rule and the morphing send/stop button keep their current contracts [SOURCE: file:apps/pi-remote-web/src/SessionComposer.tsx:31,96-170]. The codebase already models capability-gated affordances ("no decorative disabled actions") and a `role="status" aria-live="polite"` pattern for dynamic text (tools status) — reuse that for attachment counts/errors [SOURCE: file:apps/pi-remote-web/src/SessionComposer.tsx:254].

### 1.5 The security lane has a well-defined shape to extend — ticket + revision, fail closed
`relay.ts` shows the whole mutation bible: mint a one-use ticket via `/api/auth/ticket` immediately before each write, attach it to the POST, accept `[202, 409, 422, 503]`, never auto-retry, never invent committed state [SOURCE: file:apps/pi-remote-web/src/relay.ts:59-160]. The tickets doc confirms: `issueTicket` binds ticket to session token, device, principal, origin with a **20 s TTL**; `consumeTicket` requires expiry/revoke/origin/principal checks and deletes after one use; and the WebSocket upgrade + prompt submit are separate consumptions [SOURCE: file:docs/feature-catalog/auth-and-boundary/one-use-tickets.md:31-35]. **Implication for uploads: bytes are a mutation like any other.** An attachment upload consumes its *own* ticket at a new boundary (so a ticket's 20 s TTL doesn't race a slow multipart POST), and the later `prompt.submit` that references it consumes a *second* ticket. The one-use semantics kill replay of replays; idempotency must come from a caller-supplied `uploadId` (same shape as `submissionId` present today) so a retried prompt re-uses an already-staged attachment instead of re-uploading.

---

## 2. Concrete spec contribution a build phase can execute

### 2.1 Component architecture (new files, all in `apps/pi-remote-web/src`)

**`AttachmentTray.tsx`** — a horizontal thumbnail strip rendered inside `.composer-region`, directly above `.composer-tray`. Compose out of RAC building blocks:
- `FileTrigger` × 2 as sibling triggers inside the existing `ComposerTools` "+" popover pattern (`DialogTrigger` > `Popover placement="top"` > `Dialog`), matching the current tools popover exactly [SOURCE: file:apps/pi-remote-web/src/SessionComposer.tsx:194-259]:
  - `Photo Library` → `acceptedFileTypes={['image/heic','image/heif','image/jpeg','image/png','image/webp','image/gif']} allowsMultiple onSelect={addFiles}`
  - `Camera` → same `acceptedFileTypes`, `defaultCamera="environment"` (no `multiple` — iOS returns one capture) [SOURCE: react-aria FileTrigger props].
- Previews: `<ul role="list" aria-label={`${count} attachments`}>`; each `<li>` is a 56×56 rounded thumb (clay border ring when focused), an `aria-label` naming the image, and a remove `Button` (RAC) with `aria-label="Remove attachment N"`, hit target ≥44×44 pt per Apple touch guidance [SOURCE: Apple HIG / `documentation/phpicker` for the system picker's multi-select semantics: https://developer.apple.com/documentation/phpicker].
- Guidance text line: reuse the existing `.tools-status` pattern as `role="status" aria-live="polite"` ("2 attachments".

### 2.2 State machine + hooks

**`useAttachmentDraft`** (the only new hook) — ownership + lifecycle:

| State | Trigger | UI |
|---|---|---|
| `empty` | initial | nothing rendered |
| `seeding` | `FileTrigger.onSelect` → for each `File` | shimmer placeholder tiles |
| `processing` | per-file decode/normalize (HEIC→JPEG, downscale ≤2000px, objectURL) | tile fills with `img` + spinner |
| `ready` | normalization settled | full tile, `.add` enabled |
| `uploading` | Send pressed → ticket + POST | tile dims, per-tile `aria-busy`, tray shows single inline `role="status"` |
| `error` | size reject, decode reject, 409/413/422 | inline alert (existing `.inline-alert` pattern) + tile marked error |
| `sent` | prompt acknowledged (202) | tiles clear; objectURLs revoked |

Rules:
- **ObjectURL hygiene:** `URL.createObjectURL` per file; `revokeObjectURL` on remove, on send-settled, and in a `useEffect` cleanup keyed by attachment id. Never keep a draft blob after a prompt settles [SOURCE: MDN objectURL pattern is the documented `createObjectURL`+`revoke` pairing; no cached references allowed].
- **Normalization pipeline** (`normalizeToJpeg.ts`, dynamic-import gated): ① sniff `file.type`/extension; ② HEIC → `createImageBitmap` (Safari 17+) or `heic2any` WASM (dynamic import, iOS <17) → canvas `toBlob('image/jpeg', 0.82)`; ③ long edge capped at 2000 px (a 48 MP ProRAW is ~100 MB decoded; capping protects Safari's constrained per-tab memory *before* you ever reach the relay); ④ attach `{orientationApplied: true}` metadata so no code path treats the blob as raw.
- **Validation constants** (single `attachmentLimits.ts`): max 10 MB per file, ≤4 files/turn, image MIME allowlist only. The `accept` attribute is a hint, not a gate — validate in JS *and* server-side [SOURCE: MDN file input — "The accept attribute doesn't validate"].

### 2.3 Upload lane — bytes to pi, fail closed

Follow `relay.ts`'s exact mutation pattern; do **not** invent a new transport:
1. `POST /api/auth/ticket` → ticket A (20 s TTL, unchanged) [SOURCE: file:docs/feature-catalog/auth-and-boundary/one-use-tickets.md].
2. `POST /api/attachments/{sessionId}` with `{ uploadId, ticket: A, expectedRevision, fileCount, dimensions, byteSize, checksum }`, body = the normalized JPEG(s) as `multipart/form-data`. Accept `[202, 409, 413, 422, 503]`. On 202 the relay returns `attachmentIds[]` and consumes ticket A.
   - Relay validates: ticket valid/unconsumed/origin+principal match; `expectedRevision` matches current session revision (fail closed on staleness, same as `controlRuntime` today) [SOURCE: file:apps/pi-remote-web/src/relay.ts:119-141]; byte size ≤10 MB; **content sniffing** of the first bytes (never trust the `Content-Type`); filename regenerated to `attachment-{uuid}.jpg` client-side *and* server-side (kill fakepath/EXIF-driven leaks) [SOURCE: MDN — `value` shows `C:\fakepath\` by design; never surface it].
   - Redaction: relay strips metadata with an image-metadata-stripping step (convert via sharp/strip on the host), *then* stages bytes. GPS/device EXIF never crosses to pi.
3. `prompt.submit` now accepts `attachmentIds[]` **instead of inline bytes**, mints its own fresh ticket B, and carries the same `expectedRevision` — so ordering is enforced by revision and replay is dead by ticket one-useness. Relay resolves ids → staged bytes and hands pi a **read-only temp path** outside the workspace (`~/.pi-attachments/{id}.jpg`), deleted after the turn settles (fail closed: cleanup on success, abort, and crash alike). This preserves the fixed posture: nothing mutable is inside pi's workspace, the host/extension never sees raw client filenames, and the transcript only ever renders the redacted card.
4. **Transcript presentation:** a new `attachment` block type in the transcript DTO. The client renders `<img>` via an authenticated fetch of `/api/attachments/{id}` (same-origin, existing session cookie — no new auth surface), fullscreen on tap. Block text is metadata-only (`image · 1.8 MB · 1536×2048`) so the *transcript* is redaction-safe even if media serving is disabled.

### 2.4 A11y + iOS/PWA motion specifics
- Trigger/`FileTrigger` child must keep an interactive ARIA role or semantic element (RAC requirement) — your trigger **is** an RAC `Button`, so this is automatically satisfied [SOURCE: https://react-spectrum.adobe.com/react-aria/FileTrigger.html].
- Keyboard/screen-reader path: `Button` → attach popover → triggers; after selection focus returns to the `+` Button; remove buttons are reachable; the strip is a list with count live region.
- Motion: strip slides/shimmers in (CSS transition on `transform`), tray grows `MAX_TRAY_HEIGHT_PX 140 → 220` only while attachments exist, `@media (prefers-reduced-motion: reduce)` collapses all of it [Tailwind 4: use `motion-safe:`/`motion-reduce:` utilities — no animation config work needed].
- Safe-area: `viewport-fit=cover`; `.composer-region` padding-bottom `env(safe-area-inset-bottom)` in both light/dark parchment themes; tokens stay on the ink/parchment/clay scale — thumbnails get a 1px carbon/20% ring and clay focus ring for AA contrast of non-text UI [design system fixed].
- Keyboard overlap: while the attach sheet/preview is open over the OSK, render it in the fixed overlay driven by `visualViewport.resize` as in MDN's device-fixed example [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport].

### 2.5 Target-bar behaviors (Claude iOS / Kimi Code parity)
Claude iOS and Kimi both attach **before** sending: tap "+", pick, thumbnails appear immediately above the composer; remove via ✕ on the chip; multi-attach supported from the picker; no upload happens until Send. The spec above matches that exactly (deferred upload tied to Send), which is also what differentiates it from iMessage-style instant upload — with the ticket/redaction posture, *deferred* upload is strictly safer (no bytes ever leave the device until an explicit mutation). Mobbin reference flows exist for Claude iOS composer and Kimi (see §5; verify the latest captures before locking copy/text).

---

## 3. Divergent / minority ideas worth considering

1. **Everything through the existing sync WebSocket as chunked binary frames** instead of a new HTTP route — reuses the ticket + backpressure machinery wholesale. Trade-off: JSON-frame relay today; binary frames would need new relay protocol work and make ordering/retry hairier than a plain POST. Minority, but cheapest-to-build if relay refactor is on the table.
2. **Inline bytes, no staging**: for ≤2 MB images, base64 the normalized JPEG *inside* `prompt.submit`, skip `/api/attachments` and the host temp file entirely. Radically simpler, zero host-FS hygiene risk, but bloats every prompt packet and can't carry your 10 MB/4-file target.
3. **Single trigger, no menu**: one `FileTrigger` with `accept="image/*"` and *no* `capture`, betting the iOS action sheet offers gallery+camera itself. Least UI, but iOS version variance makes "camera available here" unknowable at test time — I'd reject this in favor of two explicit capability-gated triggers (matches this app's design doctrine).
4. **Client-side "exported to pi workspace" pattern**: treat attachments as a *host-confirmed grant* (like `accept-edits` grant) — pi proposes "I'll read this image," user grants once, file then materializes into the workspace read-only. Heavier, but the most deeply posture-consistent (nothing reaches pi until pi *requests* it).
5. **Compose-time upload queue with offline tolerance**: attachments upload the moment heat, so Send needs no upload phase at all (matches iMessage). Violates "no bytes leave device until mutation" — deliberately not chosen; listed to document the trade space.

---

## 4. Open questions + risks

- **EXIF orientation in `drawImage`/`createImageBitmap` on iOS Safari**: version-specific behavior; must be device-tested per iOS release, and the `{orientationApplied}` flag must survive re-encoding or previews will render rotated while uploads render correct (or vice-versa).
- **HEIC on iOS 16 and earlier**: WASM `heic2any` adds ~1–2 MB to the bundle (dynamic import mitigates); confirm whether dropping <iOS17 support is acceptable (the app targets modern iPhones; caniuse puts HEIC decode at 17.0).
- **FileTrigger + `capture` + `multiple` on iOS**: direct camera returns a single item; does the picker UI actually offer gallery on newer iOS? Verify the exact sheet on current iOS before shipping copy/IA.
- **Sequencing vs. `prompt.submit` 202**: upload settle and prompt submit must be revision-ordered; a stale `expectedRevision` between upload and submit must abort, not auto-retry (fail closed) — confirm relay accepts per-step rejects without partial-state drift.
- **`/api/attachments/{id}` read route auth**: transcript media is served same-origin via session cookie; ensure it never becomes a cacheable CSRF/leak surface (no ticket needed on query string, no public caching).
- **Multi-photo memory**: 4 × downscaled JPEGs plus HEIC decode is fine, but contact-sheet thumbnails rendered from full objectURLs must be capped (decode thumb separately) or Safari will jank.
- **`env(safe-area-inset-bottom)` in standalone vs. Safari**: insets differ when the app is installed vs. in-tab; test both chrome contexts.

---

## 5. Sources

**Fetched this pass**
- react-aria-components `FileTrigger` docs — https://react-spectrum.adobe.com/react-aria/FileTrigger.html
- `FileTrigger.tsx` source (hidden input, value-reset re-select, `capture` mapping, `accept` flatten) — https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/FileTrigger.tsx
- MDN `<input type="file">` (accept/capture/multiple, fakepath, `accept` is a hint) — https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file
- MDN `VisualViewport` (OSK shrinks visual viewport; device-fixed emulation; flicker warning) — https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
- caniuse HEIF/HEIC (Safari/iOS Safari support begins 17.0) — https://caniuse.com/heic
- Apple `PHPickerViewController` (system photo-picker semantics behind the iOS sheet) — https://developer.apple.com/documentation/phpicker

**Codebase (read:file:line)**
- `apps/pi-remote-web/src/SessionComposer.tsx` (composer tray, popover tools, `role="status"`, `MAX_TRAY_HEIGHT_PX`) — file:31,96-170,194-259
- `apps/pi-remote-web/src/relay.ts` (ticket-before-write mutation pattern; `expectedRevision`; 202/409/422/503) — file:59-160
- `docs/feature-catalog/auth-and-boundary/one-use-tickets.md` (ticket TTL 20s; bindings; one-use consumption; fail-closed tests) — file:31-35

**Prior art / reference UI**
- `browser-image-compression` (client-side normalize+compress before upload; EXIF-oriented decode prior art) — https://github.com/Donaldcwl/browser-image-compression
- `heic2any` (libheif WASM HEIC→JPEG fallback) — https://github.com/catdad-experiments/heic2any
- Chat attach-to-composer prior art (React codebases shipping image upload in chat): NextChat — https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web · LibreChat — https://github.com/danny-avila/LibreChat · Open WebUI — https://github.com/open-webui/open-webui
- Remote-agent mobile prior art (agent remote-control surfaces): sst/opencode — https://github.com/sst/opencode
- Mobbin reference flows for the target bar (composer + attach + previews; verify latest captures in-app): Claude iOS — https://mobbin.com/apps/claude · Kimi — https://mobbin.com/apps/kimi

**Marked uncertainties**: iOS direct-camera sheet membership per iOS version (§1.1, §3-idea-3), Safari `drawImage` EXIF behavior (§4), installed-mode safe-area deltas (§4) — all flagged as device-test items above.
