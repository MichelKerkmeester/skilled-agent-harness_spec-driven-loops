<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 1 — Openable redacted diff foundation

## Summary

This phase turns the existing redacted `file_diff` transcript block into a compact, deliberate card and a full-screen, history-backed, read-only diff viewer. It establishes the iPhone modal shell, focus and scroll restoration, and race-safe viewer ownership without inventing a complete file or adding a filesystem read.

## Problem & Goal

Pi Remote can show a redacted diff, but the operator cannot deliberately open it as a readable artifact without risking a path-derived or live-workspace read. The goal is to ship the first useful slice using only the exact received `FileDiffBlock`: a compact card that opens one full-screen viewer with explicit dismissal, safe metadata, and the received patch unchanged.

## Scope

### In scope

- Existing `FileDiffBlock` only; no complete-file source is assumed.
- One shared viewer provider and modal shell mounted outside the virtualized transcript.
- Diff renderer, safe card metadata, history dismissal, keyboard/VoiceOver dismissal, light/dark styling, safe areas, and deterministic demo fixtures.
- Race-safe replacement, scroll restoration, focus restoration, and cleanup.

### Out of scope

- Relay endpoints, artifact bytes, complete-file snapshots, artifact sharing, image decoding, and PDF rendering.
- Any filesystem browser, path-based request, host handoff, mutation, or inferred file identity.
- Editing, restoring, staging, approving, running, publishing, galleries, revision comparison, active-content execution, or other v1 non-goals.
- Changes to the locked ink-on-parchment design system or the read-only-by-default security posture.

## User-facing behavior + states

- The transcript keeps a compact full-width diff card with no auto-open. The six safe peek lines remain noninteractive and retain `+`/`−` prefixes.
- Pressing the single React Aria button opens one full-screen labelled dialog. The first safe heading receives focus, and the dialog shows the exact received patch.
- The viewer has explicit Close, Escape, browser Back, iOS edge-back, and VoiceOver scrub dismissal. Closing returns to the same session and restores the originating chat position and focus.
- The shell has closed, opening, ready-diff, and exiting states; opening a second diff or closing during the first transition cannot commit stale content.
- Light and dark presentation uses the locked bone/carbon/clay system, safe-area spacing, and no horizontal overflow at 390 CSS pixels.

## Acceptance criteria

- Existing diff cards remain compact in the transcript and do not auto-open.
- Pressing a card opens one full-screen labelled dialog with the first safe heading focused; the six-line inline peek remains noninteractive.
- The viewer displays the exact received patch, retains visible `+`/`−` prefixes, and makes no `fetch`, WebSocket, path, or tool request when opened.
- Close, Escape, browser Back, iOS edge-back, and VoiceOver scrub return to the same session and restore chat scroll/focus.
- Opening a second diff or closing during the first open transition cannot commit stale state from the first source.
- Light and dark 390px screenshots meet the locked visual system and show no horizontal overflow.

## Security & Redaction

Only relay-redacted data already present in the received `FileDiffBlock` is displayed. The opaque block ID is an in-memory/history identity only; the summary, patch, headers, filename text, and displayed path never become a host path or resource request. Opening the viewer performs no filesystem, relay, WebSocket, tool, mutation-ticket, or export operation. The implementation must include a negative security test for this boundary and preserve host/extension-enforced Plan mode.

## Dependencies & affected areas

- Web viewer and UI: `apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx`, `ArtifactCard.tsx`, `ArtifactViewerHost.tsx`, `ArtifactHeader.tsx`, `ArtifactStatus.tsx`, `PreviewControls.tsx`, `useArtifactHistory.ts`, `DiffPreview.tsx`, `apps/pi-remote-web/src/App.tsx`, `apps/pi-remote-web/src/style.css`, and `apps/pi-remote-web/index.html`.
- Demo and verification: `apps/pi-remote-web/src/demo.ts`, `apps/pi-remote-web/tests/ArtifactCard.test.tsx`, `ArtifactViewer.test.tsx`, `artifact-history.test.ts`, and `scripts/file-preview-cdp.mjs`.
- Protocol and relay: no changes in this phase; the existing `FileDiffBlock` and transcript transport remain the source.

