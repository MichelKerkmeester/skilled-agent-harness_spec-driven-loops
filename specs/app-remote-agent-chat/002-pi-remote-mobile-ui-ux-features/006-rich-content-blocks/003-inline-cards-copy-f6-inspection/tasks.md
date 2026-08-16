# Tasks — Inline cards, exact Copy, and F6 inspection

- [ ] Add `apps/pi-remote-web/src/rich-content/normalizeTranscriptBlocks.ts` with pure normalization, identity/revision handling, `callId`-only pairing, result-before-call retention, stable fence ordinals, provenance, and optimistic-prompt exclusion.
- [ ] Add `apps/pi-remote-web/src/rich-content/RichContentRouter.tsx` with exhaustive command/code/text-artifact/prose/Activity/diff/fallback routing and no actions for malformed or legacy-incomplete content.
- [ ] Add `RichBlockFrame.tsx` and `RedactionBadge.tsx` for paper chrome, headings, metadata, status, redaction provenance, focus order, and action layout.
- [ ] Add `CommandOutputCard.tsx` with separate Command/Output regions, exact lifecycle labels, tail preview, clipped-line count, stable streaming geometry, conditional Copy controls, and F6 Open.
- [ ] Add `CodeCard.tsx` with escaped plaintext `<pre><code>`, allowlisted labels, bounded preview, code-only horizontal pan, line count, Copy, and F6 Open without a first-paint highlighter.
- [ ] Add `TextArtifactCard.tsx` with trusted labels, settled `Long text` promotion, bounded Source Serif preview, count, continuation indicator, Copy, and F6 Open; keep optimistic prompts and short prose outside it.
- [ ] Add `SafeMarkdown.tsx` as a strict AST renderer that omits unsafe/raw content and falls back to plain text.
- [ ] Add `useCopyFeedback.ts` with direct `navigator.clipboard.writeText` from `onPress`, focus preservation, one persistent polite status announcement, unavailable-API hiding, and touch-and-hold recovery text.
- [ ] Add `F6ViewerAdapter.tsx` through the existing `ArtifactViewerProvider` seam, mapping frozen in-memory command/output, code, and text snapshots without a fetch or second modal.
- [ ] Wire `App.tsx`, `state.ts`, and `turns.ts` for committed rich blocks while preserving stable turn keys, provenance, replay behavior, live-edge state, optimistic prompt exclusion, and provider placement outside virtualization.
- [ ] Extend `style.css` with the established light/dark card and shell-well treatment, 44px controls, focus rings, safe areas, logical properties, reduced motion, 320px reflow, and code-only overflow rules.
- [ ] Keep `relay.ts` on transcript page/sync reads only; update `cache.ts` and `public/service-worker.js` so rich bodies and highlight output are not newly persisted or cached.
- [ ] Extend `demo.ts` with deterministic fixtures for command lifecycles/output states, code fences, explicit and long-text artifacts, stale cache, unknown/malformed fallback, result-before-call, and optimistic prompts.
- [ ] Add focused normalizer, router, card, Markdown, clipboard, F6, App, turns, cache, and service-worker tests for exact Copy, Strict Mode, virtualization, no requests, and focus/scroll restoration.
- [ ] Extend `scripts/rich-content-cdp.mjs` with `rich-core` fixture interactions for Copy, Open/Close, running tail, completed top, malformed fallback, and principal light/dark captures with measured viewport width.
