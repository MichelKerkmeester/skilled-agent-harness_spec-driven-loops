# Plan — Text, Markdown, code, and controlled export

## Approach

Make the exact-revision resource hook the sole source of text-like payloads and make its generation/abort/cleanup contract explicit before adding renderers. Render readable inert content first, layer optional highlighting afterward, and keep all announcements and controls in the shared shell. Implement Copy and text-like Share against the frozen sanitized buffer with policy/capability checks, then prove race, state, cache, and mobile behavior through focused tests and deterministic CDP fixtures.

## Steps

1. Complete `useArtifactResource` with one controller per request, monotonic generation, exact identity/ETag checks, byte/digest validation, stall timer, heartbeat-aware offline mapping, and cleanup.
2. Add text, strict Markdown, code, and unsupported renderers; complete diff controls and keep line-number gutters excluded from selection/copy.
3. Update the shared host/header/status/controls for responsive loading, one status/alert path, and explicit stale exact-revision handling.
4. Add text/code/diff Share behavior for `navigator.share`/`navigator.canShare`, direct press-event calls, redaction/truncation confirmation, cancellation no-op behavior, and no binary export before Phase 4.
5. Update relay heartbeat/error mapping, transcript cache stripping/revalidation, and CSS for Source Serif, carbon code, selection, scrolling, Wrap/Find, 200% header reflow, RTL, AA contrast, reduced motion, and 320/390px reflow.
6. Add renderer, resource, share, race, cleanup, and relay-state fixtures/tests covering every listed text-like state.
7. Run typecheck, full/unit web tests, and exact-390 light/dark CDP screenshots for the text/code/share fixture.

## Files to change

- `apps/pi-remote-web/src/artifacts/useArtifactResource.ts`
- `apps/pi-remote-web/src/artifacts/TextPreview.tsx`
- `apps/pi-remote-web/src/artifacts/MarkdownPreview.tsx`
- `apps/pi-remote-web/src/artifacts/CodePreview.tsx`
- `apps/pi-remote-web/src/artifacts/UnsupportedPreview.tsx`
- `apps/pi-remote-web/src/artifacts/DiffPreview.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactViewerHost.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactHeader.tsx`
- `apps/pi-remote-web/src/artifacts/ArtifactStatus.tsx`
- `apps/pi-remote-web/src/artifacts/PreviewControls.tsx`
- `apps/pi-remote-web/src/artifacts/artifact-share.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/cache.ts`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/tests/useArtifactResource.test.ts`
- `apps/pi-remote-web/tests/TextPreview.test.tsx`
- `apps/pi-remote-web/tests/CodePreview.test.tsx`
- `apps/pi-remote-web/tests/MarkdownPreview.test.tsx`
- `apps/pi-remote-web/tests/artifact-share.test.ts`
- `apps/pi-remote-web/tests/ArtifactViewer.test.tsx`
- `apps/pi-remote-relay/tests/` — empty, whitespace-only, excerpt/truncated, partial-redaction, digest-mismatch, and stale-revision fixtures/tests.
- `packages/pi-rpc-protocol` and relay endpoints: consume the Phase 2 exact-revision contract; no new mutation or path endpoint is in scope.

## Verification gate

Run all of the following before shipping the phase:

```text
npm run typecheck
npm test
npm run test:web
node scripts/file-preview-cdp.mjs --fixture text-code-share --viewport-width 390 --theme light --output <temporary-directory>/file-preview-light.png
node scripts/file-preview-cdp.mjs --fixture text-code-share --viewport-width 390 --theme dark --output <temporary-directory>/file-preview-dark.png
```

Web tests must include delayed A/B resources, close-during-fetch, digest mismatch, abort cleanup, stale replacement, native selection/copy, share cancellation, and cache absence. The CDP runs must assert selectable text/code, usable controls, no horizontal overflow outside code content, and stable light/dark screenshots at exactly 390 CSS pixels.

