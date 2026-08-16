# Tasks — Text, Markdown, code, and controlled export

- [ ] Add or complete `useArtifactResource.ts` with one `AbortController` per request, a monotonic generation, exact artifact ID/revision/ETag checks, body validation, digest verification, a 15-second stall timer, heartbeat-aware offline result, and buffer/object-URL cleanup.
- [ ] Add `TextPreview.tsx`, `MarkdownPreview.tsx`, `CodePreview.tsx`, and `UnsupportedPreview.tsx` with real DOM text, accessible chunks above the ordinary DOM budget, strict Markdown AST, no raw HTML/remote images/frames/executable links, plain first-paint code, and a nonblocking lazy highlighter worker.
- [ ] Complete `DiffPreview.tsx` so shared controls, selection, and copy apply without reconstructing a complete file.
- [ ] Change `ArtifactViewerHost.tsx`, `ArtifactHeader.tsx`, `ArtifactStatus.tsx`, and `PreviewControls.tsx` so shell chrome stays responsive while renderers load, announcements use only the shared status/alert regions, and stale `View latest` is an explicit exact-revision request.
- [ ] Add `artifact-share.ts` for `navigator.share`/`navigator.canShare`; share text/code/diff from the press event, keep binary preparation disabled until Phase 4, confirm partial-redaction/truncated exports, and treat `AbortError` as normal.
- [ ] Change `apps/pi-remote-web/src/relay.ts` to expose the heartbeat/result needed to distinguish offline from `navigator.onLine` and reject raw server diagnostics before UI display.
- [ ] Change `apps/pi-remote-web/src/cache.ts` to persist only bounded descriptors/metadata, never bodies, prepared Files, object URLs, or share buffers, and revalidate exact revisions after `pageshow`/bfcache restoration.
- [ ] Change `apps/pi-remote-web/src/style.css` for Source Serif text, carbon code, selection colors, horizontal code scrolling, Wrap/Find controls, line-number exclusion, 200% header reflow, RTL isolation, AA contrast, reduced motion, and 320/390px reflow.
- [ ] Add resource, text, code, Markdown, share, race, and cleanup tests in the listed web test files, including delayed A/B, close-during-fetch, digest mismatch, abort, stale replacement, selection/copy, cancellation, and cache absence.
- [ ] Add relay fixtures for empty, whitespace-only, excerpt/truncated, partial-redaction, digest mismatch, and stale revision responses.

