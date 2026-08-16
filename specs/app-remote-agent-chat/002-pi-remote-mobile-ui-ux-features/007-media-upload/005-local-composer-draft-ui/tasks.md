# Tasks — Local Composer Draft, Preview, and Redacted-Card UI

- [ ] Add `apps/pi-remote-web/src/attachments/attachment-state.ts` with the explicit reducer/state machine; keep actual `File` objects in a ref-backed map outside serializable React state.
- [ ] Add `apps/pi-remote-web/src/attachments/AttachmentDraftProvider.tsx` and `useAttachmentDraft` for ordered metadata, local object URLs, selection/cancellation behavior, capability/model blocking, cleanup, session switching, app lock, and unmount handling.
- [ ] Add `apps/pi-remote-web/src/attachments/AttachmentRail.tsx`, `AttachmentTile.tsx`, and `AttachmentPreviewDialog.tsx` using React Aria list/modal/dialog, focus restoration, 44×44 hit targets, and keyboard/screen-reader labels.
- [ ] Extend `apps/pi-remote-web/src/SessionComposer.tsx` to put the attachment group first in the `+` popover, retain Mode/Commands, show the disclosure, add the rail above the textarea, implement Return/`⌘ Enter`/IME behavior, and preserve Steer/Later semantics.
- [ ] Extend `apps/pi-remote-web/src/App.tsx` and `apps/pi-remote-web/src/state.ts` to provide runtime capability, render `RedactedAttachmentBlock`, show **“Preview not retained”**, preserve unknown blocks, and clear/reconcile local drafts on session/logout/lifecycle changes.
- [ ] Extend `apps/pi-remote-web/src/style.css` for bone/carbon/clay tokens, 72 px rail, 64 px tiles, preview canvas, safe-area padding, VisualViewport keyboard geometry, 320 px/200% reflow, RTL logical properties, reduced motion, and light/dark contrast.
- [ ] Update `apps/pi-remote-web/public/service-worker.js` to bypass all attachment paths and `apps/pi-remote-web/src/cache.ts` to reject attachment-bearing data; keep raw media out of the offline snapshot.
- [ ] Extend `apps/pi-remote-web/src/relay.ts` only with typed capability/status fixtures; keep the real submit path behind the later integration phase.
- [ ] Add `AttachmentDraft`, `AttachmentRail`, `AttachmentPreviewDialog`, and `SessionComposer` tests for local-only selection, limits, focus, keyboard, state messages, URL cleanup, Strict Mode, model switching, and no-request-before-Send behavior.
- [ ] Extend `App.test.tsx` and cache/service-worker tests for redacted cards and media exclusion.

