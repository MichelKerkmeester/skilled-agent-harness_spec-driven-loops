<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 3 — Progressive highlighting, performance, accessibility, and release hardening

## Summary

This phase adds bounded worker-based highlighting and closes the performance, accessibility, security, visual, streaming, cleanup, and device-verification gaps around rich content. Plaintext remains fully readable, selectable, and copyable whenever highlighting is pending, unsupported, oversized, stale, or failed.

## Problem & Goal

The core cards need release-grade behavior on supported devices without making highlighting, streaming, or large payloads a prerequisite for reading. The goal is to reach the intended inspection quality, harden worker and viewer reconciliation, complete accessibility and security coverage, and produce release evidence for every state on the oldest supported iPhone.

## Scope

### In scope

- Bounded worker highlighting for the fixed language allowlist, with plaintext first paint, cutoff enforcement, stale-response protection, and memory-only output.
- Safe Markdown/control-character hardening for raw HTML, unsafe URLs, ANSI bytes, and bidirectional controls.
- Revision reconciliation, stale-cache, connection-loss, truncation, terminal-without-result, source-removal, running-tail, and replay behavior in cards and F6.
- Light/dark contrast, syntax-token contrast, focus rings, logical properties, RTL prose, 200% text, 320px/landscape reflow, safe areas, overscroll containment, and reduced motion.
- Worker/timer/listener/source cleanup instrumentation and repeated open/close leak checks.
- Full web/relay security and integration coverage, complete `rich-release` CDP matrix, and oldest-supported-iPhone physical verification.

### Out of scope

- Making highlighting mandatory for reading, selecting, or copying.
- Any unredacted worker input, persistent source/token cache, new host or mutation authority, rich-content fetch, filesystem lookup, or new transcript route.
- Changing the fixed ink-on-parchment design system, read-only-by-default posture, F6 ownership, or existing mutation gates.
- Treating bidi/control presentation as a transformed Copy value; Copy remains verbatim canonical redacted text.

## User-facing behavior + states

- Plaintext appears immediately for supported, unsupported, oversized, and worker-failure code; highlighting is skipped above 20,000 characters or 1,000 lines and never blocks selection or Copy.
- Stale worker responses and lower revisions do not overwrite newer content. Highlight output disappears when the revision changes, the viewer closes, or the session is discarded.
- Streaming keeps stable card geometry, does not continuously announce output, does not force a reader back to the tail after upward scrolling, and follows only within 96px of the bottom; Jump to latest appears when follow is disabled.
- Cards and F6 visibly represent stale cache, connection loss, upstream truncation, terminal-without-result, malformed fallback, and removed-source/last-trustworthy-snapshot states without refocus or reopen on replay.
- Safe Markdown and control-character handling preserve selectable verbatim text while preventing executable DOM, unsafe navigation/styles, misleading accessible output, and remote fetches.
- Light/dark, RTL, 200% text, 320px/landscape, safe-area, reduced-motion, external-keyboard, VoiceOver, Voice Control, and native-selection behavior remain usable on supported devices.

## Acceptance criteria

- Plaintext first paint and worker/highlighter failure remain fully readable, selectable, and copyable for every supported and unsupported language.
- Highlighting is never attempted above the configured size cutoff, never receives unredacted content, never persists source/token output, and never lets a stale worker response overwrite a newer revision.
- All command, code, artifact, viewer, cache, connection, truncation, malformed, and fallback states are reachable from deterministic fixtures and match the feature spec’s labels and actions.
- Streaming has stable geometry, no continuous accessibility announcements, no forced tail movement after the reader scrolls away, and correct follow/jump behavior at the 96px threshold.
- F6 history contains only an opaque block ID; open/close/replay/revision changes restore focus and transcript scroll, do not add duplicate entries, and never issue a network or mutation request.
- Dangerous Markdown/HTML/URL/ANSI/bidi inputs cannot create executable DOM, unsafe styles, navigation, remote fetches, or misleading accessible output.
- Light/dark, 320px/390px/430px, portrait/landscape, RTL, 200% text, external keyboard, VoiceOver, Voice Control, and reduced-motion checks pass without violating the fixed visual system or WCAG AA requirements.
- Repeated large-block open/close cycles release worker, timer, listener, history, selection, and source-cache resources; no monotonic memory or live-DOM growth is observed in the supported-device check.
- Repository negative controls find no Run, Retry, Edit, Approve, Apply, Download, Publish, Open-on-host, Share-file, raw-HTML, filesystem, mutation-ticket, or rich-content fetch path added by F7.
- The release evidence contains the typecheck, test, lint, build, true-390px light/dark screenshots, automated accessibility/security results, and the oldest-supported-iPhone sign-off.

## Security & Redaction

Worker messages contain only the already-redacted canonical source plus bounded language/theme, content hash, request ID, and revision ID. Worker responses are rejected when stale, and highlight/source data is memory-only and cleared with revision, viewer, or session disposal. Safe Markdown and control-character tests must prevent raw DOM, unsafe styles/navigation, remote fetches, and misleading accessible output without changing verbatim Copy. Release review must cover worker messages and caches, raw-DOM prevention, bidi/ANSI treatment, Universal Clipboard disclosure, F6 history, app-switcher/bfcache exposure, and the absence of new host or mutation authority.

## Dependencies & affected areas

- Highlighting: `apps/pi-remote-web/src/rich-content/useHighlightedCode.ts`, `apps/pi-remote-web/src/rich-content/highlight.worker.ts` or the approved equivalent, `CodeCard.tsx`, and the F6 code renderer.
- Safe rendering and viewer reconciliation: `apps/pi-remote-web/src/rich-content/SafeMarkdown.tsx`, `CommandOutputCard.tsx`, `F6ViewerAdapter.tsx`, the existing `ArtifactViewerProvider`, and viewer styles.
- Web styling and lifecycle: `apps/pi-remote-web/src/style.css` plus cleanup/focus/scroll/history/selection integration.
- Web and relay tests: `apps/pi-remote-web/tests/`, `apps/pi-remote-relay/tests/security/negative-controls.test.ts`, `redaction.test.ts`, protocol guard tests, `apps/pi-remote-relay/tests/integration/recorded-fixture-flow.test.ts`, and `transcript-projector.test.ts`.
- Release evidence: `scripts/rich-content-cdp.mjs` and the installed-PWA oldest-supported-iPhone checklist.
- Existing Phase 1/2 protocol, redaction, card, clipboard, and F6 seams remain dependencies; no new authority path is introduced.
