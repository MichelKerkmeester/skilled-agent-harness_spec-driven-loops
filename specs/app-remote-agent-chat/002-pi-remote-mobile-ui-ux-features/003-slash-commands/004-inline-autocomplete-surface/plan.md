# Plan — Inline terminal-style autocomplete surface

## Approach

Layer an isolated React Aria autocomplete over the existing composer without changing the textarea’s editing ownership. Connect it to the shared Phase 2 catalog, ranking, and insertion reducer; model every required lifecycle and error state explicitly; then add virtual focus, touch-safe press handling, accessibility announcements, and visual-viewport anchoring. Keep the panel nonmodal, preserve the fixed semantic design tokens, and test the complete interaction matrix at true mobile widths.

## Steps

1. Compose the React Aria `Autocomplete`, nonmodal `Popover`, `ListBox`, active-descendant relationship, status region, loading/error states, and Retry affordance in `ComposerCommandAutocomplete.tsx`.
2. Implement safe text-only rows in `CommandOption.tsx` with canonical isolated-LTR names, authoritative metadata, match emphasis, disabled reasons, and no nested interactive descendants.
3. Integrate the surface into `SessionComposer.tsx` above the composer shell, routing Enter and the primary action between local Insert and native multiline/send behavior.
4. Implement visual-viewport and orientation/foreground anchoring with `requestAnimationFrame` so the panel stays above the composer without page displacement.
5. Add semantic light/dark, focus, disabled, status, logical-property, target-size, safe-area, contained-scroll, high-contrast, and reduced-motion styling while preserving the fixed design system.
6. Verify `viewport-fit=cover`, zoom behavior, locale direction, and the 16px textarea baseline in `index.html` and existing viewport helpers.
7. Add component, composer, route, app, DOM, accessibility, key/pointer, focus/caret, IME, state, and no-submit tests for the full interaction table.
8. Run the typecheck, full web suite, targeted component suite, and true-390px light/dark CDP matrix including keyboard-safe states.

## Files to change

- `apps/pi-remote-web/src/ComposerCommandAutocomplete.tsx`
- `apps/pi-remote-web/src/CommandOption.tsx`
- `apps/pi-remote-web/src/SessionComposer.tsx`
- `apps/pi-remote-web/src/useVisualViewportAnchor.ts`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/index.html`
- Existing viewport helpers under `apps/pi-remote-web/src/`
- `apps/pi-remote-web/tests/ComposerCommandAutocomplete.test.tsx`
- `apps/pi-remote-web/tests/SessionComposer.test.tsx`
- `apps/pi-remote-web/tests/CommandPalette.test.tsx`
- `apps/pi-remote-web/tests/App.test.tsx`
- Accessibility assertions in the relevant web component tests

## Verification gate

- `npm run typecheck`
- `npm run test:web`
- `npx vitest run apps/pi-remote-web/tests/ComposerCommandAutocomplete.test.tsx apps/pi-remote-web/tests/SessionComposer.test.tsx apps/pi-remote-web/tests/CommandPalette.test.tsx apps/pi-remote-web/tests/App.test.tsx`
- Use CDP at a true 390 CSS-pixel viewport to capture closed, loading, ready, filtered, disabled, no-match, and error/open states in both light and dark.
- Verify no transcript/composer displacement, no page horizontal scroll, and visible keyboard-safe composer anchoring.

