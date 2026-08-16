<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Local Composer Draft, Preview, and Redacted-Card UI

## Summary

This phase ships the capability-gated local iPhone interaction and transcript rendering as an independently testable vertical slice. Photo selection, validation, preview, removal, and caption editing remain local and produce no network request; relay fixtures may stand in for later upload integration.

## Problem & Goal

The existing composer has no native photo actions, local draft rail, preview dialog, or safe rendering for the new redacted attachment block. The goal is to provide the complete local draft-and-review experience with explicit accessibility, lifecycle, responsive, cache, and redaction behavior while keeping raw files and previews out of persistence and the network.

## Scope

### In scope

- Composer `+` menu with native React Aria Photo Library and rear-camera `Take Photo` actions, capability gating, and disclosure copy.
- Reducer/ref-backed local file storage, ordered metadata, local validation, object-URL lifecycle, four-item limit, removal, preview dialog, focus restoration, keyboard semantics, and all local UI states.
- Attachment rail and tile styling, safe-area/keyboard geometry, 320 px/200% reflow, RTL, reduced motion, light/dark contrast, and WCAG AA behavior.
- Redacted transcript-card rendering, unknown-block safety, service-worker/cache exclusion, session/lifecycle cleanup, and typed capability/status fixtures.
- Focused web tests for no-request-before-Send, local-only selection, limits, focus, keyboard, cleanup, Strict Mode, model changes, redacted cards, and media exclusion.

### Out of scope

- Real reserve/upload/commit orchestration, binary XHRs, hashing, relay attachment routes, Pi delivery, or release enablement; those belong to the later integration phase.
- Upload progress, delivery acknowledgement, background upload, persistent media, preview URLs, filenames, downloads, sharing, or cross-device image replay.
- Video, audio, arbitrary files, reordering, cropping, markup, OCR, generated alt text, face scanning, or automatic visual-secret redaction.
- Changes to the fixed bone/carbon/clay ink-on-parchment design system, Inter/Source Serif 4 typography, WCAG AA target, or read-only-by-default security posture.

## User-facing behavior + states

- When host capability is off, the photo group and attachment rail are absent and the existing text composer has no decorative or disabled photo action.
- When enabled, the existing `+` menu places **Photo Library** and **Take Photo** before Mode and Commands and shows the local-storage disclosure. Selection stays local and appends in native order, up to four items; a fifth item leaves the draft unchanged with an explanatory limit message.
- The ordered attachment rail is named, supports removal with real 44×44 hit targets, and displays generic Photo ordinals without original filenames. Tiles may open a full-screen bone-canvas preview with visible Close and Remove actions and focus restoration.
- Relevant local states are `menu-open`, `picker-active`, `local-validating`, `local-ready`, `local-rejected`, and `model-blocked`; a supported HEIC/HEIF with no WebKit preview remains sendable with **“Photo · preview unavailable.”**
- Return inserts a newline, hardware `⌘ Enter` is the send shortcut, IME composition suppresses Send, Escape closes preview/popover without discarding the draft, and Plan mode remains visibly read-only.
- Redacted transcript cards render **“Preview not retained”** and generic attachment copy; unknown block kinds remain safe.

## Acceptance criteria

- Gallery selection appends ordered local tiles and camera capture adds one tile without network traffic.
- The rail, preview dialog, all local states, focus restoration, keyboard semantics, reduced motion, RTL, and 320 px/200% layout meet the feature spec.
- Original filenames and raw media never appear in the DOM, browser storage, cache, analytics, or error strings.
- Redacted transcript cards render generically and old/unknown kinds remain safe.
- With the host capability off, the entire photo group and rail disappear without leaving a disabled/decorative action.

## Security & Redaction

Actual `File` objects remain in a ref-backed in-memory map, while serializable state contains only bounded, generic metadata. Object URLs are local-only, revoked on removal, successful later acknowledgement, session switch, logout, app lock, and unmount, and never enter React persistence, storage, cache, analytics, or errors. The UI never displays filenames and offers no download/share/server URL. Image content is untrusted input and cannot grant authority; Plan mode retains its host/extension-enforced read-only cue. The service worker and cache reject attachment-bearing data, and the fixed read-only-by-default, ticketed/revision-checked mutation posture is unchanged.

## Dependencies & affected areas

- `apps/pi-remote-web/src/attachments/attachment-state.ts`
- `apps/pi-remote-web/src/attachments/AttachmentDraftProvider.tsx`
- `apps/pi-remote-web/src/attachments/AttachmentRail.tsx`
- `apps/pi-remote-web/src/attachments/AttachmentTile.tsx`
- `apps/pi-remote-web/src/attachments/AttachmentPreviewDialog.tsx`
- `apps/pi-remote-web/src/SessionComposer.tsx`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/state.ts`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/public/service-worker.js`
- `apps/pi-remote-web/src/cache.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/tests/AttachmentDraft.test.tsx`
- `apps/pi-remote-web/tests/AttachmentRail.test.tsx`
- `apps/pi-remote-web/tests/AttachmentPreviewDialog.test.tsx`
- `apps/pi-remote-web/tests/SessionComposer.test.tsx`
- `apps/pi-remote-web/tests/App.test.tsx`
- Web cache/service-worker tests

