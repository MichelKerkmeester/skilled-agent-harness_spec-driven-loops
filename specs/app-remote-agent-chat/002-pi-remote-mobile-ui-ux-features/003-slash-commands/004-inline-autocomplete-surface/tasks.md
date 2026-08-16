# Tasks — Inline terminal-style autocomplete surface

- [ ] Compose `apps/pi-remote-web/src/ComposerCommandAutocomplete.tsx` with React Aria `Autocomplete`, the existing `TextArea` relationship, nonmodal `Popover`, `ListBox`, virtual active option, status announcements, Retry, and state-specific presentation.
- [ ] Render safe text-only rows in `apps/pi-remote-web/src/CommandOption.tsx` with isolated-LTR canonical names, authoritative hint/description/source/confirmation metadata, match emphasis, disabled reasons, and no nested interactive descendants.
- [ ] Integrate the inline component in `apps/pi-remote-web/src/SessionComposer.tsx` above the composer shell, route Enter and primary action correctly, preserve native multiline behavior, and prevent panel interaction from submitting.
- [ ] Implement `apps/pi-remote-web/src/useVisualViewportAnchor.ts` with visual-viewport resize/scroll and orientation/foreground handling through `requestAnimationFrame`, keeping the panel above the composer without page displacement.
- [ ] Update `apps/pi-remote-web/src/style.css` with semantic panel/row/active/disabled/status styles, logical properties, 44px/56px targets, contained scrolling, `100dvh`, safe-area boundaries, dark tokens, increased-contrast focus, and reduced-motion rules while preserving bone `#f8f8f6`, carbon ink, clay `#d97757`, Inter, and Source Serif 4.
- [ ] Verify `viewport-fit=cover`, zoom behavior, document locale direction, and the 16px textarea baseline in `apps/pi-remote-web/index.html` and existing viewport helpers.
- [ ] Add/update `apps/pi-remote-web/tests/ComposerCommandAutocomplete.test.tsx`, `SessionComposer.test.tsx`, `CommandPalette.test.tsx`, and `App.test.tsx` for every UI state, DOM relationship, key/pointer event, focus/caret result, no-submit guarantee, and shared-route behavior.
- [ ] Add accessibility assertions for the “Message Pi” editor name, “Available host commands” list label, active descendant, disabled option metadata, one atomic status region, and absence of nested focusable descendants.

