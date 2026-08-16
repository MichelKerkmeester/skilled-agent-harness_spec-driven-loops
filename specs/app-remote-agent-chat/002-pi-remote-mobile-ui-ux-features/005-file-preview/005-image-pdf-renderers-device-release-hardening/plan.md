# Plan — Image/PDF renderers and device release hardening

## Approach

Finish the relay safety boundary before exposing binary bytes: sanitize and bound raster/PDF output, make range responses revision-consistent, and withhold anything that cannot be attested. Add image and PDF renderers behind the existing exact-revision resource lifecycle, with explicit budgets and cleanup. Extend binary Share only after exact bytes are prepared and platform capability confirms it. Close with deterministic fixture coverage, full build/test/CDP gates, and physical-device verification across the specified accessibility, lifecycle, and memory conditions.

## Steps

1. Complete raster/PDF sanitizer behavior, thumbnails, safe text-layer decision, bounded ranges, digest/ETag consistency, expiry/revocation purge, and no-store serving.
2. Add pinned PDF.js dependency and worker configuration without making native iframe/browser PDF navigation the primary path.
3. Add bounded `ImagePreview` and `PdfPreview` renderers with visible controls, safe selection/search gating, adjacent pages, range validation, and disposal budgets.
4. Extend provider/host/resource/share lifecycle so close, revoke, expiry, visibility restoration, and bfcache abort binary work, blank/purge payloads, dispose workers/canvases, and enable binary Share only after `canShare({ files })`.
5. Update app/state/cache/PWA and CSS/index behavior for pageshow revalidation, relay-heartbeat offline states, no persistence, safe-area fallback, background/revocation behavior, 320px/200%/RTL/reduced-motion behavior, and consistent announcements.
6. Add image/PDF, memory, state, accessibility, cache, sanitizer, unsafe-text-layer, range-mismatch, redaction, and final regression tests.
7. Add deterministic demo/CDP fixtures for image, safe/unsafe PDF, too-large, corrupt, offline-loaded, and revision-conflict states; keep screenshots temporary.
8. Run the full verification gate and complete installed-PWA physical-device verification on the oldest supported iPhone in portrait and landscape.

## Files to change

- `apps/pi-remote-relay/src/store/artifact-sanitizer.ts`
- `apps/pi-remote-relay/src/store/artifact-store.ts`
- `apps/pi-remote-relay/src/http/server.ts`
- Relay image/PDF sanitizer, range-mismatch, and redaction fixtures/tests under `apps/pi-remote-relay/tests/`.
- `apps/pi-remote-web/package.json`
- `apps/pi-remote-web/package-lock.json`
- `apps/pi-remote-web/vite.config.ts`
- `apps/pi-remote-web/src/artifacts/ImagePreview.tsx`
- `apps/pi-remote-web/src/artifacts/PdfPreview.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactViewerHost.tsx`
- `apps/pi-remote-web/src/artifacts/useArtifactResource.ts`
- `apps/pi-remote-web/src/artifacts/artifact-share.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/state.ts`
- `apps/pi-remote-web/src/cache.ts`
- `apps/pi-remote-web/src/main.tsx`
- `apps/pi-remote-web/index.html`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/public/service-worker.js`
- `apps/pi-remote-web/tests/ImagePreview.test.tsx`
- `apps/pi-remote-web/tests/PdfPreview.test.tsx`
- `apps/pi-remote-web/tests/artifact-memory.test.ts`
- Final state/accessibility/cache regression tests under `apps/pi-remote-web/tests/`.
- `scripts/file-preview-cdp.mjs`
- `apps/pi-remote-web/src/demo.ts`
- Protocol/relay mutation endpoints: none; the Phase 2 exact-revision read contract remains the only artifact boundary.

## Verification gate

Run all of the following before shipping the phase:

```text
npm run typecheck
npm test
npm run test:web
npm run build
node scripts/file-preview-cdp.mjs --fixture image-pdf-release --viewport-width 390 --theme light --output <temporary-directory>/file-preview-light.png
node scripts/file-preview-cdp.mjs --fixture image-pdf-release --viewport-width 390 --theme dark --output <temporary-directory>/file-preview-dark.png
```

The CDP runner must report exactly 390 CSS-pixel width. Inspect both screenshots for safe-area/header/action clipping, theme contrast, no horizontal overflow, and stable renderer layout. The physical-device checklist must pass on the oldest supported iPhone; a desktop screenshot cannot substitute for it.

