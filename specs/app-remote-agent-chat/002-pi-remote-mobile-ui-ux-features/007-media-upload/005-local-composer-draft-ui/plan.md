# Plan — Local Composer Draft, Preview, and Redacted-Card UI

## Approach

Keep the local draft as an explicit reducer state machine while storing non-serializable `File` objects and object-URL ownership in refs. Build the UI from React Aria primitives with generic labels and predictable focus, then wire only typed capability/status fixtures so local interaction can be verified without making an upload request. Treat cache, service-worker, lifecycle, accessibility, and responsive behavior as part of the feature boundary rather than post-hoc styling.

## Steps

1. Define the attachment reducer/state model and ref-backed draft provider for ordered selection, local validation, capability/model blocking, cancellation, and cleanup.
2. Build React Aria rail, tiles, and preview dialog with generic Photo ordinals, 44×44 targets, focus restoration, Close/Remove, and no download/share path.
3. Extend `SessionComposer` with the ordered photo menu, disclosure, rail placement, picker behavior, caption/keyboard/IME behavior, and existing Mode/Commands/Steer/Later semantics.
4. Extend App/state and transcript rendering for runtime capability, redacted cards, unknown blocks, session/lifecycle cleanup, and model changes.
5. Add responsive/accessibility/theme styling for the rail, preview, safe areas, keyboard geometry, narrow/zoom reflow, RTL, reduced motion, and light/dark contrast.
6. Exclude attachment paths and data from the service worker and cache; keep `relay.ts` limited to typed capability/status fixtures.
7. Add focused unit/component/cache tests and run exact 390 px CDP scenarios for every required local state.

## Files to change

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

## Verification gate

Run `npm run typecheck`, `npm run test`, and `npm run test:web`, plus the focused web suite and cache/service-worker tests. Use CDP at exactly 390 CSS px in both light and dark themes for menu-open, local-ready with four tiles, preview, model-blocked, and narrow/reflow states; verify actual DOM focus and horizontal overflow, not only screenshots. Confirm no network request occurs before Send and inspect the scoped worktree.

