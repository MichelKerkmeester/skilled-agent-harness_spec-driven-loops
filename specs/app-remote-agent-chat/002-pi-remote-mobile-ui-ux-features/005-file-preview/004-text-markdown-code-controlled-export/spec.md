<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 3 — Text, Markdown, code, and controlled export

## Summary

This phase delivers bounded text, strict Markdown, code, and diff readers under the shared viewer, with race-safe resource lifecycle, native selection, Find, Copy, and policy-gated Share. Every view remains tied to one frozen exact revision, renders inert sanitized content, and avoids downloads or public URLs.

## Problem & Goal

The immutable artifact contract makes exact sanitized content available, but ordinary source files are not yet useful to read and resource lifecycle races could mix content or retain payloads. The goal is to make text-like previews practical while keeping content bounded and inert: validate and verify one exact resource, render it accessibly, preserve native interaction, and export only the displayed sanitized buffer when policy and capability permit.

## Scope

### In scope

- Exact-revision `useArtifactResource` with abort, generation, response validation, digest verification, stall/offline handling, and object-URL cleanup.
- Text, Markdown, code, and diff renderers under the shared shell.
- Loading, stalled, ready, empty, whitespace-only, partial-redaction, truncated, stale, offline, denied, expired, missing, conflict, corrupt, rate-limited, relay-error, revoked, aborted, and exiting states for text-like content.
- Native selection, Find, Copy, and policy/capability-gated Share; no download or public URL.

### Out of scope

- Image/PDF rendering and binary Share preparation, which remain deferred to Phase 4.
- Editing, host handoff, live filesystem reads, path-derived requests, public URLs, downloads, mutation tickets, or active Markdown/HTML/SVG/remote content.
- Any relaxation of redaction, exact-revision, read-only, or Plan mode controls.

## User-facing behavior + states

- Text and Markdown use readable Source Serif 4 DOM content; code uses readable plain first paint with a separate nonselectable line-number gutter; diff continues to show the exact patch without reconstructing a file.
- Text/code/diff provide native selection, Find, Copy, keyboard alternatives, and Wrap where applicable without disabling native long-press or horizontal code pan. Markdown renders only a strict safe AST with no raw HTML, remote images, frames, or executable links.
- The shared shell remains responsive while content loads and announces through one throttled status region plus one terminal alert path. Stale exact revisions expose an explicit `View latest` action rather than silently replacing the frozen source.
- Text-like fixtures explicitly present loading, stalled, ready, empty, whitespace-only, partial-redaction, truncated, stale, offline, denied, expired, missing, conflict, corrupt, too-large, rate-limited, relay-error, revoked, aborted, and exiting states.
- Share appears only when `shareAllowed` and capability permit it, exports the displayed revision, confirms partial-redaction/truncation, and treats user cancellation as a no-op.

## Acceptance criteria

- Text, Markdown, code, and diff render the exact received bytes of the frozen revision; Markdown never executes raw HTML or navigates externally.
- Code is readable before highlighting completes; highlighting failure leaves plain text available. Line numbers are not selectable or copyable.
- Text/code/diff selection, Find, Wrap where applicable, Copy, and keyboard alternatives work without stealing native long-press or horizontal pan behavior.
- A/B resource races cannot place one artifact’s content under another artifact’s title, revision, or Share action.
- Closing, revoking, expiring, or replacing a resource removes all late async commits, object URLs, workers, buffers, and DOM payloads as required by state.
- Share is visible only when `shareAllowed` and capability permit it, exports only the displayed revision, confirms redaction/truncation, never mints a URL, and treats user cancellation as a no-op.
- Empty, whitespace-only, partial-redaction, truncated, stale, offline, denied, expired, missing, conflict, too-large, corrupt, rate-limited, relay-error, revoked, aborted, and exiting fixtures have explicit tested UI behavior.

## Security & Redaction

The resource hook accepts only the frozen artifact ID/revision/ETag and verifies headers, body bounds, and digest before committing content. Abort and generation checks prevent a late response from crossing artifact boundaries; cleanup removes buffers, object URLs, workers, and DOM payloads on close/revoke/expiry/replacement. Markdown is inert and external navigation is disabled. Copy and Share use only the displayed sanitized buffer, require policy/capability, confirm partial or truncated disclosure, never mint a URL, and reject raw relay diagnostics. No second unqualified fetch, download, mutation, host handoff, or path read is introduced.

## Dependencies & affected areas

- Resource/viewer: `apps/pi-remote-web/src/artifacts/useArtifactResource.ts`, `TextPreview.tsx`, `MarkdownPreview.tsx`, `CodePreview.tsx`, `UnsupportedPreview.tsx`, `DiffPreview.tsx`, `ArtifactViewerHost.tsx`, `ArtifactHeader.tsx`, `ArtifactStatus.tsx`, `PreviewControls.tsx`, and `artifact-share.ts`.
- Web transport/cache/style: `apps/pi-remote-web/src/relay.ts`, `cache.ts`, and `style.css`.
- Web tests: `apps/pi-remote-web/tests/useArtifactResource.test.ts`, `TextPreview.test.tsx`, `CodePreview.test.tsx`, `MarkdownPreview.test.tsx`, `artifact-share.test.ts`, and race/cleanup cases in `ArtifactViewer.test.tsx`.
- Relay fixtures: `apps/pi-remote-relay/tests/` for empty, whitespace-only, excerpt/truncated, partial-redaction, digest mismatch, and stale revision responses.
- Phase 2 protocol/relay exact-revision contract and Phase 1 shell/history remain dependencies; image/PDF files are not implemented here.

