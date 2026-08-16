# Plan — Openable redacted diff foundation

## Approach

Build one viewer owner outside the virtualized transcript and pass it a frozen copy of the exact received diff. Keep card semantics, modal lifecycle, history, focus/scroll restoration, status announcements, and renderer controls in the shared shell so the first slice proves the interaction boundary without introducing an artifact read. Use a deterministic, tab-local demo and CDP fixture to verify the mobile surface.

## Steps

1. Add `ArtifactViewerProvider` and `useArtifactHistory` for one active preview, its originating trigger, frozen diff source, generation counter, history entry, scroll/focus restoration, and cleanup.
2. Add `ArtifactCard`, `ArtifactViewerHost`, `ArtifactHeader`, `ArtifactStatus`, `PreviewControls`, and `DiffPreview`; preserve the exact received patch and keep the six-line card peek noninteractive.
3. Move the provider outside `TranscriptList` in `App.tsx` and route `file_diff` through one React Aria `Button` with no nested controls.
4. Apply the locked card and full-screen shell styling, safe-area and visual-viewport fallbacks, focus rings, reduced motion, and 390px overflow rules in `style.css` and `index.html`.
5. Add deterministic diff-open, close, and back fixtures in `demo.ts`, then add unit/component/history tests for button semantics, modal focus, exact rendering, dismissal, race replacement, and restoration.
6. Add the reusable CDP runner, set DevTools Protocol metrics to 390 CSS pixels, assert the fixture/dialog/Close button and overflow condition, and capture both themes into a temporary directory.

## Files to change

- `apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactCard.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactViewerHost.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactHeader.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactStatus.tsx`
- `apps/pi-remote-web/src/artifacts/PreviewControls.tsx`
- `apps/pi-remote-web/src/artifacts/useArtifactHistory.ts`
- `apps/pi-remote-web/src/artifacts/DiffPreview.tsx`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/index.html`
- `apps/pi-remote-web/src/demo.ts`
- `apps/pi-remote-web/tests/ArtifactCard.test.tsx`
- `apps/pi-remote-web/tests/ArtifactViewer.test.tsx`
- `apps/pi-remote-web/tests/artifact-history.test.ts`
- `scripts/file-preview-cdp.mjs`
- Protocol/relay endpoints: unchanged in this phase; no `packages/pi-rpc-protocol` or `apps/pi-remote-relay` file is in scope.

## Verification gate

Run all of the following before shipping the phase:

```text
npm run typecheck
npm run test:web
node scripts/file-preview-cdp.mjs --fixture diff --viewport-width 390 --theme light --output <temporary-directory>/file-preview-light.png
node scripts/file-preview-cdp.mjs --fixture diff --viewport-width 390 --theme dark --output <temporary-directory>/file-preview-dark.png
```

Both CDP runs must exit 0, report exactly 390 CSS-pixel width, assert the expected fixture state, and produce inspected screenshots with no clipped header, safe-area control, or horizontal scroll. The negative test must prove that opening a diff never creates a filesystem request.
