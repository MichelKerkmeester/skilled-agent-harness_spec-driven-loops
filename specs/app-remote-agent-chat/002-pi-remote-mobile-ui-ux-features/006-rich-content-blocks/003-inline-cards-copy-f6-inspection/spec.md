<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 2 — Inline cards, exact Copy, and F6 inspection

## Summary

This phase ships the first user-visible rich-content slice over the Phase 1 contract: semantic Command/Output, code, and text-artifact cards with exact unit-level Copy and explicit Open actions into the existing F6 full-screen viewer. Plaintext is the immediate and failure renderer for code, and all actions operate on committed redacted snapshots without adding a data path.

## Problem & Goal

Operators currently see tool activity and prose without compact inspection cards, exact Copy controls, or a full-screen reading surface for commands, code, and substantial text. The goal is to deliver semantic Bash Command/Output cards, code and text-artifact cards, exact unit-level Copy, and explicit full-screen Open through the existing F6 viewer while keeping plaintext available on first paint and failure.

## Scope

### In scope

- Pure transcript normalization and exhaustive routing for command, code, text-artifact, ordinary prose, Activity, diff, and safe fallback content.
- Shared rich-card frame and redaction badge.
- Command/Output, code, and text-artifact card primitives with bounded previews and explicit actions.
- Strict safe Markdown AST rendering, exact clipboard feedback, cache/source labels, and F6 adapter integration.
- Transcript virtualization wiring, deterministic core fixtures, focused DOM/unit tests, and `rich-core` CDP coverage.
- Existing light/dark design tokens, 44px actions, safe areas, logical properties, reduced motion, 320px reflow, and code-only horizontal overflow rules.

### Out of scope

- Progressive syntax highlighting or a highlighter dependency; code remains plaintext-first and highlighting cannot be a prerequisite for reading or copying.
- A second modal, browser Fullscreen API, new artifact-resource route, rich-content fetch, filesystem access, mutation ticket, host operation, or mutation action.
- Copying optimistic prompts, malformed/legacy-incomplete blocks, unsafe results, or unknown protocol values.
- A new visual language, shadow system, accent status color, or change to the fixed ink-on-parchment, light/dark, Inter/Source Serif 4, WCAG AA system.

## User-facing behavior + states

- Relay-authored shell calls/results render as Command/Output cards paired only by `callId`; result-before-call remains visibly unmatched until the same identity arrives, and malformed or legacy-incomplete content has no Copy or Open.
- Fenced code renders as a bounded plaintext-first Code card with a safe language label, line count, `Copy code`, and `Open full screen`; code may pan horizontally only within its code surface.
- Explicit artifacts and settled long text render as Text Artifact cards with trusted labels or `Long text`, bounded Source Serif previews, `Copy text`, and `Open full screen`; optimistic prompts and short prose stay in their existing renderers.
- Command cards expose exact lifecycle/status labels, bounded tail output, conditional `Copy output` or `Copy current output`, and `Open full screen`; card geometry does not grow or steal transcript scroll while streaming.
- Copy preserves the canonical redacted string, initiating focus, whitespace, Unicode, and final newlines; success, failure, and unavailable-API states are visible without a toast or network dependency.
- Open uses the shared F6 viewer with a frozen in-memory document, one opaque block ID in ephemeral history, focus trapping, Close/Escape/Back/VoiceOver dismissal, and transcript scroll/focus restoration.

## Acceptance criteria

- The router renders shell calls/results, fenced code, explicit artifacts, and settled long text as the specified cards while leaving short prose, routine tools, thinking, usage, diffs, optimistic prompts, and unsafe/unknown blocks in their specified existing paths.
- Every Command/Output lifecycle and every code/text card state has the correct visible status, bounded preview, available actions, and canonical source.
- Copy tests prove exact string equality for command, output, code, text, current streaming output, and F6 Copy all, including whitespace and final newline.
- Copy success/failure/unavailable states preserve focus and expose the required announcement or recovery text without toast, network, worker, or permission-query dependency.
- F6 Open uses one shared React Aria full-screen viewer, pushes only the block ID into ephemeral history, traps focus, supports Close/Escape/Back/VoiceOver dismissal, restores scroll/focus, and changes no virtualized row height.
- F6 opens command/output at the correct top/tail position, keeps running follow mode at the live edge only, and exposes Jump to latest after upward scroll.
- Safe Markdown and all card previews cannot create executable/raw DOM or remote navigation, and redaction markers remain the only sensitive values visible to the browser and clipboard.
- True-390px light/dark screenshots show the card hierarchy, shell-well boundary, 44px controls, safe areas, no page horizontal scroll, and unchanged composer behavior.

## Security & Redaction

This phase renders untrusted redacted Markdown/code and creates an explicit clipboard export boundary. Components receive only the committed redacted source and bounded provenance; Copy uses the canonical unit directly from the guarded block and never reads highlighted DOM, hidden content, or an unredacted backing value. Opening, copying, wrapping, and closing perform no fetch, WebSocket, mutation-ticket, host-file, filesystem, or relay endpoint call. Safe Markdown omits raw HTML, scripts, forms, media, iframes, data URLs, remote embeds, unsafe links, and language-derived styles. Security/privacy review must inspect the canonical-source path, redaction provenance, clipboard behavior, hidden DOM, safe renderer, F6 history payload, and no-network/no-ticket guarantees before live enablement.

## Dependencies & affected areas

- Rich-content components: `apps/pi-remote-web/src/rich-content/normalizeTranscriptBlocks.ts`, `RichContentRouter.tsx`, `RichBlockFrame.tsx`, `RedactionBadge.tsx`, `CommandOutputCard.tsx`, `CodeCard.tsx`, `TextArtifactCard.tsx`, `SafeMarkdown.tsx`, `useCopyFeedback.ts`, and `F6ViewerAdapter.tsx`.
- Transcript integration: `apps/pi-remote-web/src/App.tsx`, `apps/pi-remote-web/src/state.ts`, and `apps/pi-remote-web/src/turns.ts`.
- Styling and transport/cache: `apps/pi-remote-web/src/style.css`, `apps/pi-remote-web/src/relay.ts`, `apps/pi-remote-web/src/cache.ts`, and `apps/pi-remote-web/public/service-worker.js`.
- Fixtures and tests: `apps/pi-remote-web/src/demo.ts`, `apps/pi-remote-web/tests/`, cache/service-worker tests, and `scripts/rich-content-cdp.mjs`.
- F6 viewer: the existing `ArtifactViewerProvider` React Aria shell and its established typed adapter boundary; no second modal or parallel history/focus system.
- Phase 1 contract: guarded protocol and relay redaction/projection fields are prerequisites.
