# Tasks — Openable redacted diff foundation

- [ ] Add `ArtifactViewerProvider` for one active preview, originating trigger, frozen diff source, generation counter, scroll restoration, focus restoration, and cleanup.
- [ ] Add `ArtifactCard`, `ArtifactViewerHost`, `ArtifactHeader`, `ArtifactStatus`, `PreviewControls`, `useArtifactHistory`, and `DiffPreview`; keep the source as the exact received `FileDiffBlock` and never turn its block ID into a host path or artifact request.
- [ ] Change `App.tsx` so the provider is outside `TranscriptList`, `file_diff` renders through `ArtifactCard`, and the card is one React Aria `Button` with no nested controls.
- [ ] Change `style.css` and `index.html` for card dimensions, type glyph/peek lines, full-screen modal chrome, `viewport-fit=cover`, visual-viewport fallback, safe-area padding, focus rings, reduced motion, and no horizontal overflow at 390px.
- [ ] Extend `demo.ts` with deterministic diff-open and close/back states; keep the demo double-gated and tab-local.
- [ ] Add `ArtifactCard.test.tsx`, `ArtifactViewer.test.tsx`, and `artifact-history.test.ts` for button semantics, no auto-open, modal focus trap, exact patch rendering, close behavior, race-safe replacement, focus/scroll restoration, and the negative filesystem-request control.
- [ ] Add `scripts/file-preview-cdp.mjs` to set 390 CSS-pixel DevTools metrics, exercise the deterministic demo, assert the dialog and Close button, check horizontal overflow, and capture light/dark images in a temporary directory.

