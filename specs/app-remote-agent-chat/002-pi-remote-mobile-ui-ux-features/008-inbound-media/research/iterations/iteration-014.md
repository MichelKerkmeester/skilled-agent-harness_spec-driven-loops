<!-- provenance: external-CLI orchestration pass; original file iter-14-deepseek.md -->
> **Source pass 14** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-14-deepseek.md`.

<!-- F8-inbound-media | model=deepseek | lens=prior-art-github | iter 14/15 | 2026-08-16T04:28:11.424Z -->

# Deep-Research Pass 14/15 — Lens: **prior-art-github** (remote-CLI / coding-agent mobile clients solving agent→user media)

---

## 1. Findings for this lens

### 1.1 The "secure mobile remote for a CLI coding agent" category is real, crowded, and architecturally convergent

Every serious entry ships the same shape: a **daemon/bridge on the dev machine** + a **phone client** speaking a JSON protocol over an **encrypted WebSocket**, connected over LAN **or Tailscale**:

| Project | Stars | Client stack | Transport/security model | Media posture |
|---|---|---|---|---|
| `stablyai/orca` | 46.2k | Native iOS (App Store) + Android APK, mobile companion | One-time pairing code → device token; "desktop is always the source of truth"; Tailscale mentioned for host address edits | Outbound-only image attachments in Chat UI; Mermaid renders in chat; no inbound agent-image content |
| `earendil-works/pi` | 90.9k | CLI/TUI host harness (the agent this app controls) | — (deliberately **no built-in permissions layer**; sandboxing delegated to container/OpenShell) | No image content kind today; this feature extends it |
| `getpaseo/paseo` | 13.8k | Expo (iOS/Android/web) + Electron + CLI | Self-hosted daemon, optional E2E-encrypted relay, "Pair Device", or direct TCP/Tailscale/VPN; Dockerized Web UI | None verified in transcripts |
| `K9i-0/ccpocket` | 1.0k | Flutter (iOS/iPad/Android/mac/win) + TS `@ccpocket/bridge` | QR/mDNS/`ws://` pairing; **Tailscale is the documented remote-access path**; `BRIDGE_ALLOWED_DIRS` gate | **Closest to the target**: Bridge serves "screenshot serving" + "image gallery"; app has gallery + `message_images` full-screen viewer; no embedded transcript content blocks |
| `nimbalyst/nimbalyst` | 1.4k | Electron + native SwiftUI iOS (`packages/ios`) | Collab sync protocol + cloud sync server | "Visual diff review: swipe through changes, tap to approve" — media adjacent, not inbound blocks |
| `tanlethanh/zedra` | 178 | Rust + GPUI + **QUIC/UDP**, iOS/Android | P2P remote control (topics: `pi-agent`) | Pre-revenue; nothing verified |
| `Shahfarzane/opencode-mobile` | 114 | Expo/React Native iOS app for OpenCode | QR pairing, Face ID | Stub-quality; no media |

Sources: [orca README](https://github.com/stablyai/orca/blob/main/README.md), [orca mobile docs](https://www.onorca.dev/docs/mobile), [pi README](https://github.com/earendil-works/pi/blob/main/README.md), [paseo README](https://github.com/getpaseo/paseo/blob/main/README.md), [ccpocket README](https://github.com/K9i-0/ccpocket), [ccpocket stack](https://k9i-0.github.io/ccpocket/architecture/stack.md), [nimbalyst README](https://github.com/nimbalyst/nimbalyst), [API metadata for zedra](https://api.github.com/repos/tanlethanh/zedra) and [opencode-mobile](https://api.github.com/repos/Shahfarzane/opencode-mobile).

**Takeaway:** the pairing/ticket/plan-mode posture Pi Remote already has is well-precedented (orca pairing codes + device tokens, paseo E2E relay + "Pair Device", ccpocket QR + Tailscale + `ALLOWED_DIRS`). What this lens proves is that **nobody ships inbound agent→user images as first-class, redaction-aware transcript content blocks on mobile** — the closest (ccpocket) routes media as *side surfaces* (gallery, screenshot viewer, image diffs), not as transcript content. That is the differentiation window for this feature.

### 1.2 The canonical in-protocol precedent: Anthropic computer use injects screenshots into the conversation via `tool_result`

The single most important prior art for *why* an image block belongs inside the existing transcript kind list: Claude's computer-use loop returns `screenshot` tool results back through the conversation as `tool_result` content blocks; the reference implementation ships a **web interface** for the loop, and Anthropic's own app surfaces those screenshots inline. Anthropic also documents the security frame this feature inherits — sandboxed environment, not trusting content, prompt-injection classifiers on screenshot inputs (docs explicitly warn instructions "contained in images" can override instructions). Sources: [Computer use tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool), [anthropics/anthropic-quickstarts → computer-use-demo](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo), [Claude iOS app (target bar)](https://apps.apple.com/app/claude-by-anthropic/id1508268954), [Kimi Code (target bar)](https://www.kimi.com/code/).

This maps *directly* onto pi's `tool_result` transcript kind: the least invasive, most precedented design is **attaching an `image` part to pi's existing `tool_result` block** rather than inventing a new sibling kind — preserving transcript ordering, `thinking` semantics, and the redaction hook surface.

### 1.3 Inline-bytes-over-a-text-stream precedent: iTerm2 + kitty graphics protocols (and why they're not enough)

Both terminal image protocols prove the "image inside a text-shaped transport" idea at scale, and both already encode the exact constraints this feature needs:

- **iTerm2 Inline Images** — base64 payloads in `OSC 1337`, chunked `FilePart`/`FileEnd` framing for tmux, **1 MiB per chunk cap**, `width/height/preserveAspectRatio`, `inline` vs `download` modes, feature-detection via [feature reporting](https://iterm2.com/feature-reporting). Source: [iTerm2 Inline Images Protocol](https://www.iterm2.com/documentation-images.html).
- **Kitty graphics (kovidgoyal/kitty)** — chunked transmission, RGB/PNG + animation frames, transitive placeholders, explicit deletion, **image persistence and storage quotas**, multiple transmission media. Source: [Kitty terminal graphics protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/).

**Tradeoff (why we still ship a new block):** both protocols are cell-rendering, unauthenticated, and unbounded-by-default; there is no access-control, redaction, or digesting concept — diametrically opposed to Pi Remote's fail-closed posture. They are useful as *mechanism inspiration* (chunking, quotas, placeholders), **not** as a delivery mechanism for a PWA over Tailscale.

### 1.4 Opaque-artifact addressing precedent: Matrix `mxc://` media (and why digests are the right addition)

Matrix's content repository is the mature prior art for "sanitized bytes, opaque id, no host paths in durable state": media is uploaded to the server (size-limited), addressed by opaque `mxc://serverName/mediaId` URIs, served with **server-generated thumbnails**, and governed by a documented *Security considerations* section; redaction is an event-level primitive separate from the bytes. Source: [Matrix v1.11 Client-Server API — Content repository / mxc://](https://spec.matrix.org/v1.11/client-server-api/#content-repository).

**Delta for Pi Remote:** `mxc` ids carry server name (leak channel) and no integrity check. Pi Remote's `artifactId + sha-256 digest + revision` improves on Matrix *and* on AT-Protocol's CID-style addressing (dedup for free, tamper-evidence, no path metadata). The one caveat this lens surfaces: an *opaque* random id cannot be deduplicated; a **digest-prefixed id** can.

### 1.5 What the mobile clients get wrong (the ccpocket counterexample) and what Pi Remote should do differently

ccpocket is the closest reference and also the cautionary tale:

- **Right:** explicit JSON WebSocket message vocabulary with a documented "add an explicit protocol message + graceful unsupported-message fallback" policy ([stack.md](https://k9i-0.github.io/ccpocket/architecture/stack.md)); `gallery-store.ts` persistence; `message_images` feature using `extended_image` (full-screen pinch-zoom viewer); Bridge-side "screenshot serving"; Tailscale as the documented remote path ([README](https://github.com/K9i-0/ccpocket)).
- **Wrong for us:** the Bridge performs filesystem-adjacent work and serves media it can mutate mid-stream, screenshots require host Screen-Recording permission to *capture* (a macOS grant, not an end-to-end security property), and gallery vs transcript are disconnected surfaces. Pi Remote's model — **relay-sanitized, digest-verified, ticket-gated bytes, with a redacted placeholder in the durable transcript** — is strictly stronger and directly implements the redaction posture this app is built on.

### 1.6 Negative prior art: the terminal-emulation path cannot express structured media

`blinksh/blink` (6.9k★, Mosh-based iOS terminal) is the archetypal "remote CLI, mobile" product — and its entire documented surface is SSH/Mosh, filesystem utilities, config, swipe/pinch terminal UX ([README](https://github.com/blinksh/blink)). It renders a byte stream, not a message stream, so an agent's structured image can only appear by escaping through image-protocols (1.3) that mobile emulators implement inconsistently. **This is the strategic justification for a dedicated transport**: Pi Remote must not pretend to be a terminal; it is a *document* client (transcript kinds) and media belongs in the document model, not the emulator. Secondary evidence: the whole category (1.1) converges on JSON protocols *rather than* SSH bytes because of exactly this.

**Findings → design consequences:** (a) attach image parts to `tool_result`/a dedicated part in pi's existing RPC, not a new parallel channel; (b) sanitize + digest at the relay, opaque id, one-use ticket, quota, redaction placeholder in durable state — all three precedents (Anthropic, Matrix, iTerm2/kitty) confirm each knob; (c) thumbnail size/format knobs mirror iTerm2/kitty/Matrix; (d) UX parity targets: orca Chat UI (Mermaid, markdown, photo thumbnails) + ccpocket `message_images` + consumer-chat full-screen flows.

---

## 2. Concrete spec contribution (buildable)

### 2.1 Protocol — new content part on the existing `tool_result` kind

Add an `image` part to pi's RPC content blocks (fits the existing discriminated union; **do not** mint a new top-level transcript kind — precedent 1.2, keeps redaction/schema/backfill cheap):

```ts
// Inbound (pi → Photon relay → Pi Remote app)
{ kind: "tool_result", tool, parts: [
  { kind: "text", text },
  { kind: "image",            // NEW
    artifactId: "a8J3q…",     // 128-bit random base64url; NO host paths
    revision: 3,              // per-session monotonic per artifactId
    digest: "sha256:c0ffee…",// of the SANITIZED bytes
    mediaType: "image/webp",  // only png/jpeg/webp after re-encode
    width: 512, height: 512,  // intrinsic, after sanitize
    caption: { text, role: "screenshot" | "file" | "diagram" },
    thumb: { artifactId, digest, mediaType: "image/webp", width: 320 } }
] }
```

- **Publish path:** relay exposes `PUT /relay/assets/{sessionId}` (bytes) → returns `{artifactId, revision, digest}`; the transcript block carries metadata only. `GET /relay/assets/{artifactId}?rev&digest` requires a **one-use HMAC ticket** bound to `{sessionId, artifactId, revision, digest}` (fail-closed; replay/use → 410).
- **Client verification:** bytes received must `sha-256` to `digest` before render; mismatch → persistent `failed` state (never a blank image).
- **Unsupported-client fallback:** older app builds render the part as a plain "📷 [image]" line (ccpocket's documented policy, stack.md) — the Relay **must** suppress the block for clients that don't advertise `images` capability in the session hello.

### 2.2 Sanitization pipeline (runs at the relay, before digest & storage)

Order is load-bearing — derive digest **after** purification:
1. **Default-deny MIME:** only `image/png|jpeg|webp`; sniff magic bytes, not extension; mismatch → reject (no fallback re-sniff).
2. **Metadata strip:** decode → drop *all* containers (EXIF/GPS, ICC or keep ICC, XMP — default **strip**, knob to keep ICC) → re-encode.
3. **Rebomb guards:** pixel-count cap 16 MP (e.g., `4096×4096` source hard ceiling; decode with explicit max via `{maxWidth,maxHeight}` and a decode timeout); animated formats (GIF, animated WebP) rejected/single-frame-stripped (screen-capture privacy).
4. **Downscale:** max long edge 2000px; **thumb** generated at 320px `image/webp`; both counted against per-session quota (default 50 MB, LRU; purge on session close unless pinned).
5. **Digest & pin:** `digest = sha-256(sanitized bytes)`; opaque `artifactId` minted; revision incremented on any re-push — transcript now points at a **content-addressed, path-free** object.

### 2.3 Redaction design (durable transcript)

- Durable transcript stores **only** the metadata block (2.1). Bytes live in the relay cache; they are *absent* from the transcript.
- **Redaction action** = remove the block's fields, leave a `redacted` card (kind preserved, `{sha of original block}` for audit), and revoke tickets + 410 the artifact. Mirrors Matrix's event-redaction-vs-media split (spec §Redactions) — redaction is an event primitive; bytes are handled separately.
- **Secrets never enter durable state:** captions are length-limited (≤200 chars), and the relay strips image metadata before any byte is ever persisted/published.

### 2.4 Client UX — inline card + full-screen viewer (reuse F6), React 19 + react-aria-components

**States (explicit enum, rendered per state, never a broken `<img>`):**
`pending-metadata → fetching → ready | failed | redacted | expired`
- `pending-metadata`: shimmer block at intrinsic `aspect-ratio` (layout-stable placeholder, prevents CLS).
- `fetching`: 24px spinner on bone; tap-off while not ready.
- `failed` (digest mismatch / network / quota-410): 1px ink border, `⚠ Unable to load image — tap to retry`; retry re-issues a fresh ticket.
- `redacted`: parchment hatch pattern + `Image redacted` in Source Serif caption face.
- `expired` (relay purge): same card, "was available in session".

**Inline card:** ink border 1px, `rounded-xl` (12px), caption chip overlay bottom-left in `bone` on `carbon/90`, tap → open viewer. Inner `<img>` uses `object-fit: contain` + explicit `width/height` attributes (iOS decode size hints).

**Full-screen viewer (the F6 component) — exact specs:**
- **Open:** tap card; motion `150ms` opacity + 100ms spring scale, `motion-reduce: reduce` → fade only. Backdrop carbon `98%`. Should cover Dynamic Island/safe areas through `env(safe-area-inset-*)`.
- **Gestures:** vertical-drag-to-dismiss (with rubber-band + snap-back), horizontal swipe **pages** through sibling images in the session (in-order), pinch `1×–5×`, double-tap toggles `1×↔2×`, pan clamped when zoomed. Implement with CSS `touch-action` + pointer events (RAC `Pressable`/`useMove` for taps; native pointer events for pinch) — never hijack passive scroll.
- **Close:** edge-swipe down, `<Esc>`/arrow-key navigation, swipe-back gesture (chrome default), `Enter/Space` to open, focus-trapped `Dialog` from react-aria-components (uses `OverlayContainerProvider`; modal `role="dialog"`, `aria-modal`).
- **a11y:** every card `role="img"`, `aria-label = caption || "Agent screenshot"`, `aria-describedby` dimensions; action row with `Share` via `navigator.share` (photo-picking fallback on iOS unsupported) and `Save` gated behind the existing session's approve-flow (fail-closed default). Reduced-motion + `forced-colors: active` bullets.
- **Queue:** images hydrate in transcript order; relay delivers metadata frames first, bytes stream lazily (LL of the card area, using `loading="lazy"` + IntersectionObserver).

### 2.5 Security integration (fixed posture preserved)
- **Fail closed:** the one-use ticket *is* the read authorization; missing/revoked → 410; digest mismatch → failed; plan-mode hosts never accept mutation frames (images are read-only, but any `PUT` still requires the session's plan-mode consent + host extension).
- **Redaction everywhere:** bytes never logged, never in transcript JSON; captions scanned by the same redaction regex/env-var denylist as text content.
- **Network:** all asset fetches over the existing Tailscale tunnel (HTTPS `ws/wss`); asset URLs carry **no** session/shared-secret material — ticket is HMAC-signed, single use.

---

## 3. Divergent / minority ideas worth resisting-convergence on

1. **Small images as inline base64 (iTerm2-style), no registry at all.** Pragmatic: images ≤250 KB ship inside the content block; registry only for larger. Diverges from "no unbounded bytes in durable state" — viable only if the base64 is **transit-only and never persisted** (client strips to placeholder for the transcript). Minority, but eliminates an entire service.
2. **Digest-addressed ids (CID/atproto style) instead of opaque random.** `artifactId = b32(sha256(bytes)[:20])`: free dedup + cache key + violates nothing (no path knowledge leaks from content hash). The opaque-id purists are wrong that ids must be unpredictable; HMAC ticket already provides the secrecy.
3. **"Preview fidelity" mode:** privacy-supreme option where screenshot bytes *never leave the Mac*; the relay pushes only a 56 KB downsampled provably-preview (blurred beyond ~80px unless session flow-approves). Useful as a plan-mode default, absurd for everyday UX.
4. **Gallery tray (ccpocket-style) in addition to inline:** session screenshots as a horizontal strip pinned under the composer, orthogonal to transcript. Divergent because it adds a second surface and a "seen/unseen" model.
5. **Sync-required consent for screenshots:** first image per session asks "pi wants to share screenshots — allow?" (echoing plan-mode). Anthropic's screenshot processing consent is the precedent; almost every competitor now auto-allows. Worth flagging, likely "no" in v1.

---

## 4. Open questions + risks

- **Schema placement:** extend `tool_result` with parts (recommended) vs. a new `image` *kind* — impacts session-replay hydration order and every existing pi tool_result renderer. Decide before the client work; prefer parts (1.2 precedent).
- **Quota semantics:** per-session LRU evictions can race an in-flight fetch → need `expired` state (2.4) and a "pin" API for images the transcript still references after session end.
- **PWA cache on iOS Safari:** Cache-API eviction under memory pressure with 5 MP downscaled images → the viewer must gracefully re-fetch via a still-valid ticket; define re-ticket TTL (default 24 h).
- **GPS/EXIF is not the only leak:** screenshots can contain password managers/keys by the agent's own doing. The app-level mitigation (posture) is consent gating (divergent idea #5); the pipeline-level one is EXIF/container stripping (2.2) — neither removes content-level secrets; document that boundary in the threat model.
- **Animated formats:** excluding GIF/APNG/WEBP-anim keeps pipeline simple and privacy-sound, but agents do ship animated "before/after" demos — decide whether single-frame extraction is acceptable loss.
- **Ticket replay across app rebuilds/session resume** (Orca mobile explicitly notes stale "working/idle" states and versioned mobile protocol): mirror a protocol version bump + capability handshake for `images`.

---

## 5. Sources

**Repos (verified):**
- https://github.com/earendil-works/pi — pi agent harness; packages list; permissions posture; RFCs at https://rfc.earendil.com/keyword/pi/
- https://github.com/stablyai/orca — mobile companion README; iOS/Android; pairing; Chat UI; Design Mode
- https://github.com/getpaseo/paseo — daemon/relay/E2E/Expo mobile; related relay: https://github.com/getpaseo/paseo-relay
- https://github.com/K9i-0/ccpocket — Bridge + Flutter app; Tailscale path; gallery-store; MIT
- https://github.com/K9i-0/ccpocket/tree/main/packages/bridge — Bridge server (gallery, screenshot serving)
- https://github.com/nimbalyst/nimbalyst — desktop + SwiftUI iOS; visual diff review
- https://github.com/tanlethanh/zedra — Rust/GPUI/QUIC iOS-Android remote control (metadata)
- https://github.com/Shahfarzane/opencode-mobile — Expo RN OpenCode iOS (metadata)
- https://github.com/blinksh/blink — Blink Shell (Mosh/SSH iOS terminal; negative prior art)
- https://github.com/MoonshotAI/kimi-code and https://github.com/MoonshotAI/kimi-cli — Kimi Code CLI / ACP / embedded web UI (target bar agent)
- https://github.com/Aider-AI/aider — images & web pages in chat (outbound precedent)
- https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo — reference web UI for screenshot tool_result loop

**Docs/specs:**
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool — computer use, screenshot tool_result loop, security considerations
- https://spec.matrix.org/v1.11/client-server-api/ — content repository, mxc:// URIs, thumbnails, redactions, security
- https://www.iterm2.com/documentation-images.html — inline image protocol (OSC 1337, chunking, 1 MiB caps, dims)
- https://sw.kovidgoyal.net/kitty/graphics-protocol/ — kitty graphics protocol (chunking, deletion, storage quotas)
- https://www.onorca.dev/docs/mobile — Orca mobile: pairing, Chat UI, Mermaid, image thumbnails, versioned protocol
- https://k9i-0.github.io/ccpocket/architecture/stack.md — ccpocket protocol boundary & extension policy

**App/target-bar surfaces (verified product URLs; Mobbin requires sign-in):**
- https://apps.apple.com/app/claude-by-anthropic/id1508268954 — Claude iOS app (target bar)
- https://www.kimi.com/code/ — Kimi Code (target bar)
- Mobbin reference flows (sign-in required): https://mobbin.com/apps/whatsapp (inline image card + full-screen pager), https://mobbin.com/apps/telegram-messenger (same), https://mobbin.com/apps/claude-ai
