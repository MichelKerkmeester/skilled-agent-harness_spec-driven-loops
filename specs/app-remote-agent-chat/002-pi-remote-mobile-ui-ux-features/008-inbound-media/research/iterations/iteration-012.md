<!-- provenance: external-CLI orchestration pass; original file iter-12-deepseek.md -->
> **Source pass 12** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-12-deepseek.md`.

<!-- F8-inbound-media | model=deepseek | lens=edge-failure | iter 12/15 | 2026-08-16T04:22:24.070Z -->

Now the codebase grounding is solid (block types at `types.ts:178-239`, ticket flow in `relay.ts`, localStorage cache in `cache.ts`). I need web sources for the edge-failure lens. Fetching in parallel.
HIG and web.dev need different routes; fullmoon repo 404'd. Let me retarget via GitHub search API and alternate official docs.
Strong prior-art found: `K9i-0/ccpocket` (Flutter, codex/claude remote control) and `gaixianggeng/mimi-remote` (native iOS Tailscale bridge). Pulling their READMEs and the relay's HTTP surface.
One final grounding batch — existing spec folders and the relay's redaction surface — then I'll write the report.
# Pi Remote — F8 Inbound Media Preview: Edge-Failure Research Pass (Iteration 12/15)

**Lens:** edge-failure — empty/loading/error/offline/permission-denied states, race conditions, graceful degradation.
**Grounding:** I traced the actual relay + PWA code paths (see [Sources §5]), which changes this design significantly.

---

## 1. Findings (edge-failure lens; iPhone + this stack)

### 1.1 The relay is POST-only today — this is the dominant structural constraint
`apps/pi-remote-relay/src/http/server.ts` accepts **POST only** (plus a WSS upgrade at `/api/sync`); every route is gated by (a) `/_serve/{serveSecret}` path prefix with constant-time compare, (b) `Origin === publicOrigin`, (c) `tailscale-user-login` principal header, and (d) an explicit `authorityFor` scope map (`sessions:list`, `approval:decide`, `prompt:submit`, …) at lines ~823–837 [SOURCE: `apps/pi-remote-relay/src/http/server.ts:823-837`; `apps/pi-remote-relay/src/http/README.md:17`. The client sets `cache: 'no-store'` on every relay call [SOURCE: `apps/pi-remote-web/src/relay.ts:282-301`.]

**Implication:** a browser `<img src>` cannot sign itself — it rides on same-origin cookies, which the ingress guard *can* still verify on a new GET route, but three failure classes are introduced that don't exist for any current button:
- **Referrer leak / ticket replay:** a one-use ticket bound to a POST body cannot be put in a URL querystring without leaking into logs/referer history — the current `/api/auth/ticket` pattern is unusable as-is for `<img>` [SOURCE: `apps/pi-remote-web/src/relay.ts:59-87`, `147-142`]. You need a scoped, short-lived *media* ticket read by the GET handler, plus `Referrer-Policy: no-referrer`.
- **Connection-starvation:** Safari on iOS caps parallel connections per host (~6 over HTTP/1.1; the relay is Node `http`, i.e. pre-HTTP/2 unless the proxy upgrades). A screenshot-per-tool-result session will saturate the pool and starve the WebSocket + transcript pages. An unbounded `<img>` fan-out is a new denial-by-latency vector *on your own tailnet*.
- **No GET means no browser-level image caching:** `fetch` with `cache:'no-store'` gives the PWA nothing to rehydrate offline; the only cache today is JSON in localStorage (`cache.ts:9`, `MAX_BLOCKS=500`) — binary artifacts cannot live there (5 MB quota, strings only, not the place for bytes).

### 1.2 The transcript/redaction model makes the "durable-state" question easy, and makes *content* redaction a distinct pipeline
`TranscriptBlockBase` carries `id/revision/seq/occurredAt` and there is no byte field today; `redactEnvelope` runs a canonical recursive policy (reasons: `path`, `secret`, `private-text`) with counters surfaced in `redaction.fieldsRedacted` [SOURCE: `packages/pi-rpc-protocol/src/types.ts:178-239`; `apps/pi-remote-relay/src/store/redaction.ts:41-59,62-89`]. An `image` block whose payload contains only **opaque ids + digest + dims** is *already* redaction-safe at the JSON layer (there are no secret-bearing strings to scan). The real security object is the **artifact store**: bytes must be re-encoded at intake, digest-addressed, revision-bumped, and GC'd — with the durable transcript holding only pointers. This inverts the usual threat model (redact the JSON → redact the bytes via digest/revision roll).

### 1.3 Prior art proves the "spotty-network" expectations that set the target bar
- **mimi-remote** (native SwiftUI, iOS 18+, Tailscale/LAN): "Markdown, **images**, file references, voice input, and **safe Quick Look reads** work as mobile-native content"; "**Keep working on spotty networks: recover missed streaming updates, queue outgoing messages while offline, resend automatically after reconnecting**"; "Readiness checks, reconnection, diagnostics, and bounded log export help recover without returning to the desk" [SOURCE: https://github.com/gaixianggeng/mimi-remote/README.md]. Notably it renders untrusted content via the OS's non-rendering Quick Look surface and gates *all* private-HTTP at the app layer.
- **CC Pocket / bridge** (Flutter, self-hosted bridge): "**inspect git diffs and image diffs**", "**image attachments**", "**recover missed streaming updates, queue outgoing messages while offline, resend automatically after reconnecting**, iPad/macOS layouts for chat, Git, Explorer, screenshots, and images" [SOURCE: https://github.com/K9i-0/ccpocket/README.md]. These are the actionable degradation contracts: *lost deltas replay on reconnect; outgoing actions queue; reads degrade to cached truth.*

### 1.4 Where Apple/platform behavior physically forces your states
- `HTMLImageElement.decode()` fails with `EncodingError` on: **request failure, `src` changed mid-decode, or corrupted bytes** — i.e. decode is where *network* errors, *race* errors, and *corruption* errors all surface in one promise, so it (not `onload`) is the single choke point for error state [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode].
- PWA decode memory: a screenshots-at-tool-result workload on a phone decodes several 1000×+px bitmaps simultaneously → iOS Safari memory pressure/crash risk. The mitigation the ecosystem uses is **server-side re-encoding to bounded variants** and *never* client canvas re-encode; Apple's Images HIG itself is scale/dispatching guidance ("deliver art at the appropriate scale factors") and matches the "render-downscaled, decode-before-paint" rule [SOURCE: https://developer.apple.com/design/human-interface-guidelines/images (page is JS-gated; `og:description` confirms the scope)].

---

## 2. Concrete spec contribution (build-executable)

### 2.1 Protocol + delivery (the part everything else degrades from)

**New block kind** `ImageBlock` in `TranscriptBlock` union [extend `packages/pi-rpc-protocol/src/types.ts:232-239`]:

```ts
export interface ImageBlock extends TranscriptBlockBase {
  readonly kind: 'image';
  readonly artifact: {
    readonly id: string;            // opaque, e.g. img_<uuid> — never a host path
    readonly revision: number;      // bump on redaction/content replacement
    readonly digest: string;        // sha256 hex of sanitized bytes
    readonly mime: 'image/webp' | 'image/jpeg' | 'image/png';
    readonly width: number;
    readonly height: number;
    readonly byteLength: number;    // post-sanitization
    readonly caption?: string;      // pi's alt text
    readonly redacted?: boolean;    // true → placeholder card, no artifact fetch
  };
}
```
No bytes, no paths, no EXIF in the block → the existing `redactEnvelope` JSON policy still terminates safely on it [SOURCE: `apps/pi-remote-relay/src/store/redaction.ts:41-89`].

**Relay intake (`POST /api/media/ingest`, host-authenticated, NOT a mutation — a content event):** magic-byte sniff + format allowlist (PNG/JPEG/WebP; **SVG rejected by default** — scriptable), EXIF/GPS strip, server re-encode to bounded max dim (e.g. 2048px) and bounded bytes (e.g. 4 MB → WebP ~200–800 KB). Store **three cached variants** generated at ingest (thumb 96px / screen ~1200px / full ≤2048px) keyed by `digest`, with revision indexing. Persist `{id → rev → digest → bytes + variants}` in the artifact store; durable transcript stores only the block above. Size/type over-limit → emit `redacted:true` block with reason rather than fail open.

**Delivery:** new **GET** route `GET /api/media/{id}.webp?rev=&digest=&ticket=`. Gate: new authority scope `media:view` in the `authorityFor` map (`server.ts:823-837`), same ingress prefix/Origin/principal checks, plus a **short-lived media ticket** minted by a new `POST /api/media/ticket` (distinct from `/api/auth/ticket` one-use mutation tickets — media tickets are read-only, ~60 s TTL, capability "view artifact {id}" only) [compare `relay.ts:59-87`]. Respond `Content-Type: image/*` locked to the artifact's mime, `Cache-Control: private, max-age=31536000, immutable` **per digest** (digest-addressed ⇒ no-stale), `Referrer-Policy: no-referrer`. Digest mismatch → 409 (fail closed), GC/retention → 404, rev changed → 410.

### 2.2 State machine — the exact failure catalog

One artifact load = five terminal states, three transitions, all keyed by `(id, revision, digest)`:

```
idle ──(in viewport)──▶ fetching ──(decode() resolve)──▶ loaded
  │                        │  ▲                          └─▶ errored(path)
  │                        │  │decode()/fetch reject        errored(corrupt)
  │                        ▼  │retry ≤2 w/ jitter            errored(digest)
  └── redacted:true ─────────┴─ redacted-notice (no fetch)
```

| State | Trigger (mapped to real code path) | UI (ink-on-parchment) | a11y |
|---|---|---|---|
| **empty** | No `image` blocks in session | Nothing rendered — presence only (matches chat-app convention; no empty-state chrome for images) | — |
| **placeholder** | `redacted:true` block | Bone card, 1px carbon/20 border, clay/60 lozenge "Redacted", serif caption "pi withheld this capture", no retry affordance | `role="img"` `aria-label=caption||"Redacted image"`; no focus stop |
| **fetching** | In viewport + not cached | Bone 12:9 card with shimmer (carbon/8→bone sweep, 900ms loop); reserved layout size from `width/height` (zero CLS) | `aria-hidden="true"`, `aria-busy` on card; shimmer static under `prefers-reduced-motion` |
| **loaded** | `decode()` resolve (never `onload`) | Thumbnail `<img decoding="async">`; tap → F6 full-screen | `alt=caption`, keyboard Enter, `tabindex=0` |
| **errored(ticket/401)** | Media ticket expired (can't be one-use-replayed) or session revoked mid-view; relay `307/401` via digest | Card keeps `aria-busy`, banner chip (ink text on bone+clay/20 fill — **clay alone is 2.9:1 vs bone, fails AA**): "Permission for this capture expired — Retry" | `role="status"` `aria-live="polite"` fired **once** per reason change, not per attempt |
| **errored(network/offline)** | `fetch` rejects, `navigator.onLine===false`, or WS `sync.gap` mid-load | Ghost: broken-icon glyph (ink/60), "Offline — will refresh on reconnect", **no spin** | same live-region rule |
| **errored(corrupt)** | `decode()` `EncodingError` after 200 | "Couldn't decode this capture" + Retry (max 2, exponential backoff; then permanently degraded card, no loop — thundering-herd guard) | focus retained |
| **errored(digest/410/409)** | Digest/rev mismatch — bytes were redacted/replaced host-side | Swap to **"This capture was redacted"** card + (if in full-screen) dismiss to card; stale bytes never rendered — fail closed | `role="alert"` |
| **superseded** | WS delta bumps `revision` while cached bytes are old | Keep card, show `loading` overlay, refetch on new revision; during full-screen: "Capture updated" scrim (not silent teardown). Old-revision blob is renderable **only** on explicit consent (see §3 divergent #4) | flash-free, color-only alert |

### 2.3 Race-condition controls (the anti-bug matrix)
1. **Dedupe fetches:** module-level inflight map `art://{id}#{rev}:{digest}` — one promise per unique digest. A second render/key (React list virtualizer) joins, never refetches. Resolve only if the request key still equals the *current* key at completion (guards StrictMode double-render and key recycling).
2. **Scroll storm budget:** `IntersectionObserver` + `loading="lazy"` + `fetchPriority match conditional` prefetch of ±1 screen + **global inflight cap (3)** + LRU eviction in the fetch queue. Protects the WS from connection starvation (Findings §1.1).
3. **Decode-then-swap (no flicker, no memory pile):** off-DOM `new Image(); img.src=full; await img.decode()` per MDN's documented LQE/photo-album swap pattern, then punch it into the card; thumb stays until swap ↑ [SOURCE: MDN decode() URI above]. On abort/navigation, `img.src=''` (a changed `src` after `decode()` throws — which is exactly the check you want).
4. **Delta vs page boundary:** transcript paging (`fetchTranscript` loop, `relay.ts:222-242`) racing the WS delta — upsert by block `id`, never append; image rate this as **duplicate, not failure** (skip) to prevent the double-image flicker.
5. **Reconnect:** on `sync.gap` or socket close, resolution order is (cached-digest ⇒ thumb variant) before anything network; queued *fetches* (not just messages as in ccppm/ccpocket prior art) re-serialize on reconnect with backoff. Offline never shows 404 for content that WAS in the cache — the inconsistency 404 (cache says served, relay says GC'd) is surfaced as "This capture was removed" once, deduplicated per `id`.

### 2.4 Full-screen viewer (F6 reuse) + transitions
- Reuse F6's sheet; additions: `role="dialog" aria-modal="true"`, focus trap, Esc/close button, VoiceOver label "Close capture from pi"; pinch/double-tap zoom; **no swipe-to-dismiss that swallows double-tap** (guard `touchstart` vs `dblclick` timing).
- Motion: card `opacity 0→1 / translateY(4px)`, 180–260 ms `cubic-bezier(0.2,0.9,0.3,1)`; full-screen fade scrim carbon-ink/80 in 200 ms + image `scale(1.02→1)`; exit 150 ms. **All motion disabled** under `prefers-reduced-motion` (static crossfade ≤ opacity only) — mirrors mimi-remote's Reduce Motion behavior [SOURCE: mimi-remote README: "With Reduce Motion enabled, movement falls back to restrained fades or static feedback"].

### 2.5 Offline + storage design
- New **IndexedDB** store (separate version namespace from the localStorage read-only cache, `cache.ts:9`) keyed `sha256(digest)` storing `{digest, mime, w, h, variants:{thumb,screen}, rev}` → fulfills binary + quota + no JSON serialization of bytes. Network policy: **cache-first for digests present**, network-first for the rest with 20 s timeout then read-only channel degrade. Cap: LRU to ≤ 64MB.
- If no service worker exists (verify — none found in `apps/pi-remote-web/src`), do **not** add an API-intercepting SW; a minimal SW precaching app shell only, or skip — otherwise you import a whole new failure surface (stale SW + next-version cache keys) into the read-only app.

---

## 3. Divergent / minority ideas worth considering (against convergence)

1. **Thumbnails embedded in the block (no GET for the *first* view).** A downscaled, EXIF-stripped base64 thumb (≤ ~16 KB) sitting directly in `ImageBlock` makes the inline card 100% offline and race-free with zero artifact calls (syncing is just JSON, the existing `no-store` POST path, works everywhere the transcript already works). Full-res stays artifact-served. Cost: every `sync.delta` carries ~16 KB; offset by blocking the single worst failure class (connection pool). This is the honest answer to "graceful degradation" for a low-bandwidth tailnet phone.
2. **Pre-render 3 variants server-side and never resize on device.** (adopted in §2.1) — the strong default; included here to record *why*: iOS decoding+resize is where the crashes live (Findings §1.4), so the client should never draw to canvas at all. It also makes the `<img>` swap a pure cache hit.
3. **`<link rel="preload" as="image">` injection for the next offscreen screenshot** — cheap second channel on iOS; combine with the inflight budget cap (preload does not count against the 3-request pool? it does technically; set priority low).
4. **User-consented stale-cache display ("Show cached capture" affordance when 410/409)** — diverges from the fail-closed posture; worth a product decision. Under the fixed security posture the default must stay fail-closed, but exposing the *choice* is a defensible minority position.
5. **Range/partial streaming of progressive JPEG for full-screen** — rejected with reasoning: `decode()` needs complete data, WebKit doesn't progressively paint partial `fetch` bodies into `<img>`, and it reintroduces the partial-transfer failure class for zero real UX gain.
6. **SVG-first rendering in a sandboxed iframe/do-not** — rejected; SVG stays denied at intake; the cost/benefit of parsing+re-serializing SVG at the relay isn't worth the attack surface when screenshots are the actual workload.

---

## 4. Open questions + risks

- **Reverse proxy reality check:** HTTP README says the relay binds `127.0.0.1` behind the serve-secret prefix [SOURCE: `apps/pi-remote-relay/src/http/README.md:17`]. A GET `/api/media/*` must survive whatever proxy/nginx/Caddy config fronts it today (many proxies are POST-first, strip bodies, or reject GET-on-JSON routes) — **verify before spec freeze**; this is the highest build-risk item in the whole feature.
- **CSP/verifications for SVG poisoning:** even with SVG denied at intake, future hosts may slip a `polyglot` (JPEG-with-SVG payload, EXIF-carried comments). Decision needed: strict digest-verify + re-encode-at-intake (adopted) is the mitigation; note that `<img>` renderers don't execute scripts but SVG-in-`<iframe>`/`.content-visibility` holes exist — keep content pinned to `<img>/<picture>` only, never `innerHTML` for any artifact string.
- **Ticket vs capability leak:** media is read-only content by design, so "leaking" the bytes is the feature. The *capability* (your session cookie + media ticket) must not leak: one-use-by-scope tickets, 60–90 s TTL, `no-referrer`, and never in analytics/logs. Confirm ticket reuse in browser reload scenarios (a reloaded full-screen must re-mint, not replay).
- **Thundering herd on reconnect:** many artifacts at once → the 3-inflight cap must include *reconnect replays*, otherwise the queue thrashes and the first render after offline is the slowest possible path.
- **Does the host's plan mode gate what gets *ingested*?** The posture update (read-only inbound) needs the extension/host enforcement story for "pi may only send captures when plan mode / read-only content is permitted", else the artifact store is an ungoverned write channel — contradicting the fixed read-only posture.
- **Accessibility edge:** caption under WCAG — `caption` from pi is untrusted text; must be sanitized like every other string block (the `private-text`/`path` scan) before emitting as `alt`, and never used as HTML.
- **localStorage cache version skew** (`pi-remote.read-only.v1` has no media awareness — backward-compatible because blocks filter through `parseDisplayBlock`; a new `image` kind must be skipped, not crash, by old clients) — guard explicitly.

---

## 5. Sources

**Codebase (local, this repo):**
- `apps/pi-remote-relay/src/http/server.ts` (POST-only routes, ingress guard, authority scope map ~:823–837)
- `apps/pi-remote-relay/src/http/README.md` (fail-closed API, `127.0.0.1`, serve-secret prefix, one-use WS ticket)
- `apps/pi-remote-relay/src/store/redaction.ts` (canonical JSON redaction policy, `redactEnvelope`, reasons path/secret/private-text)
- `packages/pi-rpc-protocol/src/types.ts` (block kinds, `TranscriptBlock` union, `Envelope`/`RedactionMetadata`, `SyncMessage`)
- `apps/pi-remote-web/src/relay.ts` (one-use ticket flow, `no-store` POSTs, WS), `apps/pi-remote-web/src/cache.ts` (localStorage read-only cache, MAX_BLOCKS/MAX_SESSIONS)
- Existing research tree: `specs/002/F8-inbound-media/`, `specs/002/F5-media-upload/`, `specs/002/F6-file-preview/`, `specs/002/F7-rich-content-blocks/`

**Web:**
- MDN — `HTMLImageElement.decode()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode (EncodingError on request-failure/src-change/corruption; decode-then-append swap pattern)
- Apple HIG — Images: https://developer.apple.com/design/human-interface-guidelines/images (art at appropriate scale; page is JS-gated — content cited from `og:description` only)
- mimi-remote (native iOS bridge for Codex/Claude; Tailscale; images/Quick Look; offline queue + reconnect + diagnostics; Reduce Motion): https://github.com/gaixianggeng/mimi-remote (README)
- CC Pocket (Flutter mobile client for Codex/Claude; image diffs + attachments; offline queue + auto-resend; self-hosted bridge): https://github.com/K9i-0/ccpocket (README)
- Kimi Code CLI (target-bar runtime): https://github.com/MoonshotAI/kimi-code and https://github.com/MoonshotAI/kimi-cli
- Large mobile-agent-client surfaces for further screens: `tiann/hapi` (Pi/Codex/Claude/OpenCode app) and `Librechat-Mobile` / `zmNinjaNg` (monitoring-client reuse of image/diff viewers) — discovered via https://api.github.com/search/repositories
- Mobbin: not directly fetchable (JS-gated); screen-level flows for Claude/iOS image cards and Kimi image attachments were **not** cited inline to avoid fabricating Mobbin URLs — treat Claude-iOS behaviors above as baseline expectations, not verified screens.
