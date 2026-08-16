<!-- provenance: external-CLI orchestration pass; original file iter-13-deepseek.md -->
> **Source pass 13** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-13-deepseek.md`.

<!-- F8-inbound-media | model=deepseek | lens=react-implementation | iter 13/15 | 2026-08-16T04:23:26.844Z -->

I'll run this deep-research pass now. Starting with grounded repo exploration (max 12 tool calls), then web sources.
Good grounding. Now web research — batch one (RAC overlay patterns, `<dialog>` support, prior-art blurhash, Mobbin Claude).
RAC Dialog URL 404'd — fetching the correct Modal/DialogTrigger pages plus HIG and ARIA APG in parallel.
# Deep Research — Iteration 13/15 · Lens: **React Implementation** (React 19 + react-aria-components + Tailwind 4, iPhone PWA)

*Feature: inbound redacted image content block, inline thumbnail card + full-screen viewer. Target bar: Claude iOS, Kimi Code.*

---

## 1. Findings — react-implementation lens, iPhone + this exact stack

**F1. RAC overlay is the correct foundation, and the repo already has the pattern in use.** `react-aria-components@1.11.0` ships `DialogTrigger`, `Modal`, `Dialog`, `Popover`, `OverlayContainer` with focus scope, background inerting, `aria-modal`, Escape-to-close and focus-restore built in (`SessionHeader.tsx:11-18`, `SessionComposer.tsx:16-24` already consume `Dialog`/`DialogTrigger`/`Popover`). The full-screen viewer should be a RAC `<Modal><Dialog>`, not a hand-rolled overlay, so focus containment + restore come free. `[SOURCE: react-spectrum GitHub — packages/react-aria-components/src/{Dialog,Modal}.tsx]` `[SOURCE: repo apps/pi-remote-web/src/SessionHeader.tsx]`

**F2. The native `<dialog>` element is now viable on iOS Safari, but do not use it for this viewer.** Safari on iOS supports `<dialog>` since 15.4 and it is stable through current releases. `[SOURCE: https://caniuse.com/dialog]` — but RAC renders its own `role="dialog" aria-modal="true"` overlay without the top-layer `::backdrop` semantics, giving one consistent code path for both the transcript popovers and the lightbox. Mixing native `showModal()` top-layer behavior with RAC's portal would fork dismissal/backdrop logic on the same screen.

**F3. Layout units and PWA chrome are already handled — keep them in the viewer.** The app uses `min-height: 100dvh` (`style.css:187`), `env(safe-area-inset-top/bottom)` padding (`style.css:247,391,1285,1488`), and `backdrop-filter: blur(12px)` for sticky bars — all correct modern units. The full-screen viewer must: stay `position: fixed; inset: 0; height: 100dvh`, pad through the home-indicator with `env(safe-area-inset-bottom)`, and avoid `100vh` (collapses behind Safari chrome). `[SOURCE: https://developer.mozilla.org/en-US/docs/Web/CSS/length]` `[SOURCE: https://caniuse.com/viewport-units]`

**F4. Pinch-zoom on iOS is the single hardest interaction.** iOS Safari defaults to page/“smart” pinch zoom (they are two separate gestures), so an in-overlay pinch needs (a) `touch-action: none` on the pan surface (supported on iOS), (b) `preventDefault()` on `touchmove` inside the gesture loop, and (c) visible zoom in/out/reset buttons as the guaranteed path, since standalone PWAs can still trigger the browser's own pinch. Expect to reach for a small gesture library or a carefully bounded hand-rolled `Pointer Events` transformer. `[SOURCE: https://caniuse.com/touch-action]` `[SOURCE: https://developer.apple.com/design/human-interface-guidelines/gestures]`

**F5. Placeholder strategy: blurhash is the correct, security-compatible choice.** BlurHash produces a ~20–30-char string that fits inside the durable transcript JSON block (only metadata is persisted — aligned with “no bytes in durable state”), is decoded in a few ms at 32px, and its DC component yields the dominant color for a stain-style pre-load. `[SOURCE: https://github.com/woltapp/blurhash]`. Encode server-side at 4×3 (`Algorithm.md` guidance), send the string in the `image` block, decode in a worker-optional `canvas` util, cross-fade into the verified image (`decoding="async"` on the `<img>`). `[SOURCE: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img]`

**F6. The transcript is virtualized — image blocks need explicit reservable size + ResizeObserver re-measure.** `App.tsx:1150-1255` renders through `@tanstack/react-virtual` (`estimateSize: 180`, `measureElement`). Images load asynchronously; the row must (a) render a blurhash + a reserved `aspect-[4/3]` placeholder box before bytes arrive, (b) let `measureElement`'s ResizeObserver pick up the real height once the aspect is known, and (c) use `loading="lazy"`/feature `content-visibility` for below-fold cards so a 19MB screenshot arriving mid-stream doesn't reprocess every row (`overscan: 6`). Tailwind 4 ships `aspect-*` utilities as core. `[SOURCE: repo apps/pi-remote-web/src/App.tsx:1150-1255 + style.css]`

**F7. A11y pattern: APG Modal Dialog, adapted for a media gallery.** The card is a `Button` (with `aria-label` built from caption + dimensions + digest tail); the viewer Dialog gets `aria-modal="true"`, an accessible name via `aria-labelledby` on the caption, initial focus on the visible Close button, Escape/close, and focus return on dismissal. For gallery content APG explicitly recommends `tabindex="-1"` on the document container for screen-reader navigation over a single unbroken string — here that maps to focusing the image wrapper (`alt` = sanitized caption). `[SOURCE: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/]`

**F8. Image-bytes handling precedent already exists in-repo.** `auth.ts:108-130` (`scanQrImage`) already uses `createImageBitmap(file)` + explicit `.close()` on iOS — the same decode-then-release discipline must be applied to fetched relay bytes. The relay-facing security primitive is the `Envelope.redaction` metadata + digest/revision checks already in the protocol (`types.ts:113-138, 307-315`; single-use ticketed mutations on the approval side) — the image channel reuses revision+digest identity to make GETs fail-closed. `[SOURCE: repo packages/pi-rpc-protocol/src/types.ts]` `[SOURCE: repo apps/pi-remote-web/src/auth.ts]`

**F9. Verify-then-render is the fail-closed load path; SRI alone is not enough.** Best approach: `fetch()` the artifact → `crypto.subtle.digest('SHA-256', arrayBuffer)` → constant-time compare against `block.digest` → only then `createImageBitmap`/object-URL. Never let bytes reach the DOM pre-verification. Optionally mirror with `integrity` on the `<img>` and `X-Content-Type-Options: nosniff`. `[SOURCE: https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity]`

**F10. Mobile decode/memory caps.** Downscale variants server-side: thumbnail long-edge ≤ 640px (card), full long-edge ≤ 1920px (viewer); byte cap (~8 MiB) and MIME allowlist (PNG/JPEG/WebP; **no SVG** — scriptable). Reject HEIC unless the relay transcodes (iPhone-origin screenshots commonly arrive as HEIC and iOS Safari HEIC decode in `<img>` is not universal). Variants defeat cheap-iPhone canvas pressure during `createImageBitmap`. `[SOURCE: repo design tokens / relay posture — see open questions]`

---

## 2. Concrete spec contribution (executable)

### 2.1 Protocol + redaction (inbound content block)
Add to `packages/pi-rpc-protocol/src`:

```ts
export interface ImageBlock extends TranscriptBlockBase {
  readonly kind: 'image';
  readonly artifactId: string;          // opaque relay asset id (no host path)
  readonly revision: number;            // bump on re-sanitized re-delivery
  readonly digest: string;              // 'sha256-<b64url>'
  readonly mimeType: 'image/png' | 'image/jpeg' | 'image/webp';
  readonly caption: string | null;      // relay-sanitized, capped length
  readonly width: number | null;        // full-variant dims (for reserved box)
  readonly height: number | null;
  readonly blurhash: string | null;     // ~20-30 char LQIP (persisted — OK)
  readonly status: 'ready' | 'expired'; // artifact TTL lifecycle
}
```

Guards (`guards.ts`) and `transcript-projector.ts` accept `kind: 'image'`; the host extension captures the screenshot/paths **only at host**, the relay:
1. magic-byte MIME sniff → reject if mismatch;
2. byte cap → reject;
3. `sharp`-style metadata strip (EXIF/XMP/GPS) + re-encode → new bytes;
4. compute `sha256` → `artifactId = sha256[:16]`-based opaque id, `revision`, `digest`;
5. generate thumbnail + full variant + blurhash(4×3);
6. emit block with **no path, no raw bytes, no Exif**; `Envelope.redaction.fieldsRedacted` counts `exif/path/overlay` and `reasons` lists them (`types.ts:113-117` precedent).

### 2.2 Client component/hook surfaces (React 19 + RAC + Tailwind 4)
- `useArtifactImage(block)` hook → `{ state: 'idle'|'fetching'|'verified'|'rejected'|'expired', bitmap?, sizeBytes }`
  - `idle` until row enters view (`IntersectionObserver`);
  - `fetch` → `arrayBuffer` → `subtle.digest` compare → `createImageBitmap(blob, {imageOrientation:'from-image'})` → verify compares → else `'rejected'` (fail closed, **zero pixels rendered**); artifact 404/rev-mismatch → `'expired'`.
- `ImageBlockCard` rendered inside the virtualized row: `Button` wrapping a `div class="image-card"` — blurhash `<canvas>` under an `aspect-[4/3]`→real-aspect swap, `decoding="async"`, caption below (ink-muted), digest tail chip (institutional honesty, same as approval cards `Review` `digest.slice(0,12)`).
- `ImageLightbox` = RAC `<Modal><Dialog>`:
  - `isDismissable`, backdrop tap-to-close, Escape → close (APG), swipe-down dismiss at scale 1;
  - pan/zoom surface: `touch-action: none`, scale `1..maxScale`, double-tap 1↔2.5 with `transition-transform`, two-finger pinch via pointer-event deltas;
  - always-visible `Close`, `Zoom in/out/reset`, conditional `Share` (`navigator.share` with `{files}` — see open question below).

### 2.3 States machine (card + viewer)
`idle → fetching → verified → (dispense) ` / `→ rejected (redacted-error card, no bytes)` / `→ expired ("no longer available on the relay", re-trigger fetches `revision`)`. No partial-decode rendering — only metadata/blurhash pre-verification.

### 2.4 Motion
- Card: blurhash→image opacity cross-fade 250ms.
- Viewer entry: scrim `rgba(ink, 0.55)` + scale 0.96→1 + opacity, 180ms, `cubic-bezier(0.16,1,0.3,1)`, `transform-origin: center`; exit reverse. Respect `prefers-reduced-motion` → fade-only.
- Safe areas: `padding: max(var(--space-2), env(safe-area-inset-top))` / bottom gutter for the closing gesture area (matches `style.css:1483-1491` toolbar convention).

### 2.5 Accessibility checklist (APG conformance)
`aria-modal`, `aria-labelledby`(caption), initial focus Close, FocusScope restore (RAC), Escape, `alt` = sanitized caption, no `aria-hidden` ancestors (RAC portals in `OverlayContainer`), touch targets ≥44px, WCAG AA on ink/muted/clay per existing `contrast.test.tsx` suite.

### 2.6 Security summary
Artifact GET = `GET /api/artifacts/{artifactId}?rev={n}` with device-session capability; relay enforces MIME/byte caps, strips metadata, sets `nosniff` + `no-transform`; client verify-then-render; durable state holds only metadata/digest/blurhash (bounds ≤ ~1KB); relay bytes bounded + TTL'd. Read-only inbound — **no** one-use ticketed mutation required.

---

## 3. Divergent / minority ideas (resist converging)

1. **“Photos-style native,” not a lightbox** — give the viewer a plain full-size `<img>` and rely on iOS's own two-finger page/“smart” zoom + swipe-down, adding only min-state and a reset tap. Zero gesture code, but it conflicts with in-app zoom isolation on a standalone PWA; lower fidelity than the Claude iOS bar.
2. **Client-side OPFS blob cache keyed by digest** (bounded LRU, audited) — artifacts survive cold starts and work offline while the durable transcript still holds only metadata. Contradicts a strict “no bytes client-side” reading but is bounded and rev-derivative; good for the “dead-artifact on reopen” UX.
3. **Long-press → Save to Photos via `navigator.share({files})`** — this turns a redacted inbound read into an outbound copy the relay cannot control. Design it explicitly (user-initiated only, digest-stamped filename) or leave it out.
4. **Native `<dialog>` + `::backdrop` + View Transitions** (Safari 18+) for the card→viewer continuity at true 120fps: elegant, but iOS Safari's VE-browser gesture conflicts and `::backdrop` styling cannot match RAC portal scrims; only worth it as a post-1.0 motion layer.
5. **No new gesture library** — hand-roll a ~150-line Pointer-Events pinch/pan/tap transformer (bounded physics, velocity from `pointermove` timestamps) instead of adding `@use-gesture`; conversely the opposing camp argues velocity+inertia feel (Kimi's warp) justifies the dependency. Decision: the stack is intentionally dependency-lean; recommend the hand-rolled hook gated by tests.

---

## 4. Open questions + risks

- **F6 semantics** — the brief says “reuse F6”; the repo documents no F-key spec file I could locate. The viewer must be extracted to a shared `FullscreenMediaViewer` used by both the image lightbox and whatever F6 is, or behavior will fork.
- **Relay TTL policy** — ephemerality bounds memory but re-opens dead artifacts; needs a retention knob (epoch-aligned cache, per-session count quota).
- **HEIC** — iPhone-origin screenshots; allowlist vs transcode decision must be made at the relay before MVP.
- **Gesture/zoom interaction on installed standalone PWA** — browser pinch vs app pinch can fight on real devices; requires device testing matrix (iPhone 12/13/15, iOS 17/18).
- **Blurhash privacy** — a 4×3 blurhash leaks coarse color layout of a private screenshot; it's redacted *metadata*, but confirm it's within posture (Signal/Mastodon embed them knowingly for chat, `[SOURCE: github.com/woltapp/blurhash Users]`).
- **Virtualizer churn with many simultaneous image blocks** — re-measure storm; mitigate via reserved boxes + capped variants.
- **Focus restore in a virtualized list** — RAC restores focus to the trigger; if the triggering row was recycled, fall back to the row container.

---

## 5. Sources

Fetched during this pass:
- https://caniuse.com/dialog — Safari iOS dialog support (15.4+) — ✅ fetched
- https://github.com/woltapp/blurhash — BlurHash algorithm, 4×3, DC color, users (Signal/Mastodon/Jellyfin) — ✅ fetched
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ — Modal Dialog pattern (focus, aria-modal, Escape, initial focus) — ✅ fetched

Repo (grounding, read directly):
- `apps/pi-remote-web/package.json` — React 19.1.1, RAC 1.11.0, Tailwind 4.1.11, Vite 7, @tanstack/react-virtual
- `apps/pi-remote-web/src/App.tsx` — TranscriptList/virtualizer (1150-1255), Block() switch (1464+), approval digest chips
- `apps/pi-remote-web/src/SessionHeader.tsx` / `SessionComposer.tsx` — existing RAC Dialog/Trigger patterns
- `apps/pi-remote-web/src/auth.ts:108-130` — `createImageBitmap` + `.close()` decode discipline
- `apps/pi-remote-web/src/style.css` — 100dvh, safe-area env(), backdrop-filter, touch-action (187, 247, 391, 1483-1491)
- `apps/pi-remote-web/public/manifest.webmanifest` — `display: standalone`, theme color
- `packages/pi-rpc-protocol/src/types.ts` — TranscriptBlock union (178-239), Envelope redaction/replay metadata (113-138), digest/revision authority (302-315)
- `packages/pi-rpc-protocol/src/guards.ts`, `apps/pi-remote-relay/src/store/transcript-projector.ts` — kind dispatch points

Domain/known-URL citations:
- https://developer.mozilla.org/en-US/docs/Web/CSS/length (dvh/svh/lvh)
- https://caniuse.com/viewport-units
- https://caniuse.com/touch-action (iOS Safari gesture handling)
- https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img (decoding/loading attrs)
- https://react-spectrum.adobe.com/react-aria-components/ (RAC index; direct Dialog/Modal doc pages returned 404 during this fetch window)
- https://github.com/adobe/react-spectrum (RAC source: `packages/react-aria-components/src/Dialog.tsx`, `Modal.tsx`, `useOverlayTrigger`)
- https://developer.apple.com/design/human-interface-guidelines/gestures (pinch, swipe-dismiss conventions)
- Prior art consulted (chat-UI image rendering in remote-coding/agent clients): https://github.com/open-webui/open-webui, https://github.com/danny-avila/LibreChat
- Mobbin reference flows (`mobbin.com`): **Claude AI (Anthropic) — iOS chat artifact/image flows; Kimi AI — iOS chat media preview/full-screen** (library requires auth; screens referenced by app name, not individually captured this pass)
