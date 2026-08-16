# Plan — Progressive highlighting, accessibility, and release hardening

## Approach

Add highlighting as a bounded, disposable enhancement around the existing plaintext renderer, with request/revision identity and redacted-only worker messages. Then harden safe rendering, streaming and F6 reconciliation, visual/accessibility behavior, and resource cleanup; expand automated security/integration/CDP coverage and finish with the oldest-supported-iPhone checklist. Every enhancement must preserve exact Copy, read-only authority, F6 ownership, and the fixed design system.

## Steps

1. Add the language-allowlisted worker hook/module and keep plaintext visible before completion and after failure.
2. Enforce the 20,000-character/1,000-line cutoff before dispatch; include only redacted source and bounded request/revision metadata; ignore stale responses and clear memory-only output on disposal.
3. Keep Code and F6 code semantically selectable with ordinary text nodes, safe labels, no `dangerouslySetInnerHTML`, and plaintext for unsupported languages.
4. Harden Safe Markdown and its corpus against raw HTML, unsafe schemes, data URLs, media, forms, iframes, scripts, malformed nesting, ANSI bytes, and bidi controls while keeping Copy verbatim.
5. Reconcile command cards and F6 for revisions, stale cache, connection loss, truncation, missing results, source removal, live-edge follow, jump-to-latest, and replay without refocus/reopen.
6. Update web/viewer styles for themes, syntax contrast, two-color focus, logical/RTL layout, 200% text, reflow, safe areas, overscroll, and reduced motion capped at 100ms.
7. Instrument and test worker, timer, listener, selection, focus, history, scroll-lock, DOM, and source-cache cleanup across repeated large-block open/close cycles.
8. Expand web, relay, protocol, and recorded-fixture integration/security tests for large content, stale responses, accessibility, bidi/RTL, overflow, cache, replay, connection loss, truncation, and no-secret propagation.
9. Extend the CDP runner with the complete `rich-release` state matrix, true-390px light/dark captures, overflow/hit-box/focus/scroll/live-edge assertions, and screenshot inspection evidence.
10. Run the installed-PWA physical-device checklist on the oldest supported iPhone in portrait and landscape, including assistive technology, selection, suspension, relay loss, RTL, reduced motion, streaming, large code, and repeated viewer cycles.

## Files to change

- `apps/pi-remote-web/src/rich-content/useHighlightedCode.ts`
- `apps/pi-remote-web/src/rich-content/highlight.worker.ts` or approved equivalent worker module
- `apps/pi-remote-web/src/rich-content/CodeCard.tsx`
- `apps/pi-remote-web/src/rich-content/SafeMarkdown.tsx`
- `apps/pi-remote-web/src/rich-content/CommandOutputCard.tsx`
- `apps/pi-remote-web/src/rich-content/F6ViewerAdapter.tsx`
- Existing `ArtifactViewerProvider` and viewer style files through their established seams
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/tests/`
- `apps/pi-remote-relay/tests/security/negative-controls.test.ts`
- `apps/pi-remote-relay/tests/redaction.test.ts`
- Protocol guard tests under `packages/pi-rpc-protocol/tests/`
- `apps/pi-remote-relay/tests/integration/recorded-fixture-flow.test.ts`
- `apps/pi-remote-relay/tests/transcript-projector.test.ts`
- `scripts/rich-content-cdp.mjs`
- Installed-PWA physical-device verification records for the release checklist

## Verification gate

Run:

```text
npm run typecheck
npm test
npm run test:web
npm run lint
npm run build
node scripts/rich-content-cdp.mjs --fixture rich-release --viewport-width 390 --theme light --output <temporary-directory>/f7-phase-3-light.png
node scripts/rich-content-cdp.mjs --fixture rich-release --viewport-width 390 --theme dark --output <temporary-directory>/f7-phase-3-dark.png
```

The gate passes only when all automated suites and lint pass, every requested CDP fixture reports exactly 390 CSS pixels, both theme captures are inspected, the physical-device checklist is complete, and evidence shows no clipped safe-area control, page overflow, contrast or syntax-token failure, live-edge jump, or modal focus escape.
