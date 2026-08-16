# Checklist — Inline terminal-style autocomplete surface

- [ ] `/` at index zero opens within one rendered frame, while all invalid trigger cases remain closed.
- [ ] Filtering is immediate and local and renders the specified ranking, host order, descriptions, hints, source, confirmation marker, and safe disabled reasons.
- [ ] Enabled tap, Enter, and Insert each perform one canonical insertion, place the caret after the trailing space, retain textarea focus, close the panel, announce “Not sent,” and make no network request.
- [ ] Arrow keys move only through enabled rows without wrapping; Enter is consumed while open; no-active-row Enter announces “No command selected”; Shift+Enter, Tab, Escape, outside tap, scrolling, long press, pointer/mouse compatibility, and IME follow the interaction table.
- [ ] Loading, unfiltered, filtered, refreshing, empty, no-match, stale-offline, no-snapshot, host-unavailable, forbidden, incompatible, disabled, committing, drafted, revalidating, stale-submit, denied-submit, and running-session states have objective DOM assertions and fail-closed actions.
- [ ] The existing `+` browser and inline panel are mutually exclusive and share catalog, ranking, canonical insertion, and binding behavior.
- [ ] At true 390px in light/dark and 320px with 200% text, targets, safe-area/visual-viewport anchoring, contrast, focus, and no-displacement requirements pass.
- [ ] Canonical names are isolated LTR, unsafe control/bidi strings are rejected or escaped, locale direction is applied, and no nested focusable descendants exist.
- [ ] `npm run typecheck` passes.
- [ ] `npm run test:web` passes.
- [ ] The targeted autocomplete, composer, palette, and app Vitest command passes.
- [ ] True-390px CDP captures cover closed, loading, ready, filtered, disabled, no-match, and error/open states in light and dark.
- [ ] The page has no horizontal scroll, the transcript/composer does not move, and the keyboard-safe composer remains visible.

