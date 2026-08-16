# Plan — Inline cards, exact Copy, and F6 inspection

## Approach

Normalize guarded committed transcript blocks into stable rich projections, route them exhaustively through small card components, and keep ordinary and unsafe content on existing safe paths. Build exact Copy directly from canonical redacted strings, adapt all Open actions to the existing F6 provider without a fetch, and verify interactions, focus, virtualization, cache behavior, security negatives, and true-width screenshots with deterministic fixtures.

## Steps

1. Implement the pure normalizer with stable identity/revision handling, `callId`-only shell pairing, result-before-call state, stable fence ordinals, provenance, and optimistic-prompt exclusion.
2. Implement exhaustive routing, shared card chrome, visible redaction provenance, and safe fallback behavior for malformed or legacy-incomplete blocks.
3. Implement Command/Output cards with lifecycle labels, fixed tail previews, conditional output Copy, stable streaming geometry, and F6 Open.
4. Implement plaintext-first Code and Text Artifact cards with bounded previews, exact source preservation, safe labels, long-text promotion, Copy, and F6 Open.
5. Implement strict safe Markdown AST rendering with plain-text fallback for invalid or unsafe input.
6. Implement direct-on-press clipboard feedback with exact strings, focus preservation, persistent polite status, unavailable-API hiding, and touch-and-hold recovery text.
7. Adapt rich snapshots to the existing `ArtifactViewerProvider` through one F6 seam, including opaque history, focus/scroll restoration, completed top, running tail, follow mode, and Jump to latest.
8. Wire `App.tsx`, state, and turns without changing stable keys, optimistic prompt treatment, live-edge behavior, or virtualized row height.
9. Add the established card styles and cache/service-worker rules; opening, copying, wrapping, and closing must remain local and must not persist new rich bodies.
10. Add deterministic demo fixtures and focused component, router, normalizer, clipboard, F6, integration, cache, service-worker, and no-request tests.
11. Extend the CDP runner with `rich-core` interactions and light/dark screenshots, asserting measured 390 CSS pixels, hit boxes, focus, safe areas, and zero page overflow.

## Files to change

- `apps/pi-remote-web/src/rich-content/normalizeTranscriptBlocks.ts`
- `apps/pi-remote-web/src/rich-content/RichContentRouter.tsx`
- `apps/pi-remote-web/src/rich-content/RichBlockFrame.tsx`
- `apps/pi-remote-web/src/rich-content/RedactionBadge.tsx`
- `apps/pi-remote-web/src/rich-content/CommandOutputCard.tsx`
- `apps/pi-remote-web/src/rich-content/CodeCard.tsx`
- `apps/pi-remote-web/src/rich-content/TextArtifactCard.tsx`
- `apps/pi-remote-web/src/rich-content/SafeMarkdown.tsx`
- `apps/pi-remote-web/src/rich-content/useCopyFeedback.ts`
- `apps/pi-remote-web/src/rich-content/F6ViewerAdapter.tsx`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/state.ts`
- `apps/pi-remote-web/src/turns.ts`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/cache.ts`
- `apps/pi-remote-web/public/service-worker.js`
- `apps/pi-remote-web/src/demo.ts`
- `apps/pi-remote-web/tests/normalizeTranscriptBlocks.test.ts`
- `apps/pi-remote-web/tests/RichContentRouter.test.tsx`
- `apps/pi-remote-web/tests/CommandOutputCard.test.tsx`
- `apps/pi-remote-web/tests/CodeCard.test.tsx`
- `apps/pi-remote-web/tests/TextArtifactCard.test.tsx`
- `apps/pi-remote-web/tests/SafeMarkdown.test.tsx`
- `apps/pi-remote-web/tests/copy-feedback.test.tsx`
- `apps/pi-remote-web/tests/F6ViewerAdapter.test.tsx`
- `apps/pi-remote-web/tests/App.test.tsx`
- `apps/pi-remote-web/tests/turns.test.tsx`
- `apps/pi-remote-web/tests/` cache and service-worker tests
- `scripts/rich-content-cdp.mjs`
- Existing `ArtifactViewerProvider` files only through their established adapter boundary

## Verification gate

Run:

```text
npm run typecheck
npm test
npm run test:web
npm run build
node scripts/rich-content-cdp.mjs --fixture rich-core --viewport-width 390 --theme light --output <temporary-directory>/f7-phase-2-light.png
node scripts/rich-content-cdp.mjs --fixture rich-core --viewport-width 390 --theme dark --output <temporary-directory>/f7-phase-2-dark.png
```

The gate passes only when focused protocol/relay/web suites and the full build pass, mocked fetch/WebSocket/ticket/filesystem/host-call spies report zero rich-content calls, every visible action measures at least 44×44px, and both true-390px theme captures show safe-area and focus-visible correctness, no page overflow, stable card geometry, contrast, and unchanged composer behavior.
