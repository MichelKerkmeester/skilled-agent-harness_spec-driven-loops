<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 4 — Image/PDF renderers and device release hardening

## Summary

This release phase completes typed previews with sanitized raster images and controlled PDF.js rendering, then closes accessibility, memory, offline, revocation, service-worker, PWA, and physical-device gates. It releases the full partial feature while keeping editing, galleries, host handoff, and other v1 non-goals excluded.

## Problem & Goal

Text-like previews do not cover sanitized image and PDF snapshots, and the release must prove that binary decoding, PDF workers/ranges, sharing, lifecycle cleanup, and iPhone behavior cannot disclose or retain unsafe data. The goal is to add bounded image/PDF renderers and exact-byte binary Share only after sanitization and capability checks, then verify every state and device constraint on the oldest supported iPhone.

## Scope

### In scope

- Relay-safe raster publication, thumbnails, PDF destructive sanitization, safe text-layer decision, and bounded range source.
- Native image preview with bounded decode/zoom/pan and visible alternatives.
- Lazy PDF.js worker, bounded pages/canvases, adjacent-page rendering, page controls, safe search/selection, and revision-consistent ranges.
- Share of exact sanitized image/PDF Files only after preparation and `canShare({ files })`.
- Final implementation and verification of lifecycle/content states, revocation, bfcache, PWA safe areas, a11y/i18n, memory budgets, and release evidence.

### Out of scope

- Native iframe or uncontrolled browser PDF navigation as the primary path.
- Editing, restoration, staging, approval, execution, publishing, host handoff, live filesystem reads, public URLs, mutation tickets, gallery/paging, or binary fallback that has not been sanitized and reviewed.
- Active PDF JavaScript, forms, attachments, external links, unsafe text layers, active SVG/HTML/XML/JS/WASM, service-worker artifact caching, or any design-system change.

## User-facing behavior + states

- Sanitized raster images render in a carbon stage with bounded 1×–4× zoom, fit/double-tap/pan behavior, and visible Zoom out/Fit/Zoom in alternatives.
- Safe PDFs render through lazy PDF.js with the current and adjacent pages, continuous scrolling, page labels/indicator, Previous/Next, Fit width/zoom, and selection/search only when `textLayerSafe` is verified.
- Unsafe or unverified PDFs never create a text layer and become an explicit safe `withheld` or `unsupported` state when sanitization cannot attest to safety. Image/PDF decode, worker, range, canvas, and Share failures map to explicit `corrupt`, `too-large`, `revision-conflict`, `relay-error`, `offline-unavailable`, `unsupported`, or `withheld` states.
- Revocation, expiry, close, visibility restoration, and bfcache transitions stop work and blank/purge payloads; retries and terminal states use the shared status/alert behavior without raw diagnostics.
- Deterministic fixtures cover every lifecycle/content state. Light/dark, portrait/landscape, 320px, 390px, 200% text, RTL, VoiceOver, reduced motion, Safari, installed-PWA, app-background, relay-loss, and repeated open/close behavior are verified on the oldest supported iPhone.

## Acceptance criteria

- Sanitized raster images render with bounded bytes/pixels/dimensions, safe thumbnails, no metadata disclosure, correct 1×–4× interaction, and visible non-gesture alternatives.
- Safe PDFs render with bounded pages/canvases, consistent ranges and ETags, page labels, controls, and safe selection/search. Unsafe or unverified PDFs never create a text layer and become an explicit safe state when sanitization cannot attest to safety.
- Image/PDF decode, worker, range, canvas, and Share failures map to `corrupt`, `too-large`, `revision-conflict`, `relay-error`, `offline-unavailable`, `unsupported`, or `withheld` as appropriate; no raw server/library diagnostic reaches the UI.
- All lifecycle and content states in the feature spec are reachable through deterministic fixtures and have the correct actions, announcements, cleanup, and retry behavior.
- Revocation immediately blanks payloads and stops network/renderer work. Repeatedly opening and closing large PDFs does not monotonically increase live canvases, workers, buffers, or blob URLs.
- Light/dark, portrait/landscape, 320px reflow, 390px CDP, 200% text, RTL, VoiceOver, reduced motion, Safari, and installed-PWA checks pass on the oldest supported iPhone.
- The final build contains no mutation command, host handoff, path-derived request, public artifact URL, service-worker artifact cache, or unreviewed binary fallback.

## Security & Redaction

The relay decodes/re-encodes raster images, strips metadata/profiles and active payloads from images/PDFs, derives thumbnails only from sanitized output, and returns `withheld` when safety cannot be attested. PDF text layers are enabled only after verification; active PDF content, forms, attachments, external navigation, and unsafe annotations are removed or disabled. Range responses retain exact digest/ETag identity. Binary Share prepares only the displayed exact sanitized bytes and requires policy plus `canShare({ files })`; no URL or host handoff is created. Revocation and visibility changes abort network/worker/canvas work and purge payloads. The final review must cover app-switcher exposure, bfcache, service-worker exclusion, and all negative mutation/path/public-URL controls.

## Dependencies & affected areas

- Relay sanitization/storage/http: `apps/pi-remote-relay/src/store/artifact-sanitizer.ts`, `artifact-store.ts`, `apps/pi-remote-relay/src/http/server.ts`, and the relay image/PDF/range/redaction fixtures and tests.
- Web dependencies/config: `apps/pi-remote-web/package.json`, `package-lock.json`, and `apps/pi-remote-web/vite.config.ts` for pinned PDF.js and worker configuration.
- Binary renderers/lifecycle/share: `apps/pi-remote-web/src/artifacts/ImagePreview.tsx`, `PdfPreview.tsx`, `ArtifactViewerProvider.tsx`, `ArtifactViewerHost.tsx`, `useArtifactResource.ts`, and `artifact-share.ts`.
- Web shell/state/cache/PWA: `apps/pi-remote-web/src/App.tsx`, `state.ts`, `cache.ts`, `main.tsx`, `index.html`, `style.css`, and `apps/pi-remote-web/public/service-worker.js`.
- Tests/fixtures/release: `apps/pi-remote-web/tests/ImagePreview.test.tsx`, `PdfPreview.test.tsx`, `artifact-memory.test.ts`, final state/a11y/cache regressions, `scripts/file-preview-cdp.mjs`, `apps/pi-remote-web/src/demo.ts`, and the installed-PWA physical-device verification.
- Protocol/relay contract: consumes the Phase 2 exact-revision descriptor and Phase 3 resource/share lifecycle; no mutation or host-read endpoint is added.

