# Plan — Canonical sheet, effort rows, and shared entry points

## Approach

Create the effort catalog as the single source for bounded visible copy and safe formatting. Build a controlled React Aria radio group that receives confirmed and pending runtime state from the Phase 2 hook, then compose it with the existing model picker inside one top-level sheet. Route both triggers to that sheet with different initial sections, keep focus restoration and pending dismissal explicit, and apply the existing visual tokens without adding a second mutation path or overlay.

## Steps

1. Add `effort.ts` with the seven known IDs, exact labels/descriptions, localized template keys, safe unknown-ID ordinal formatting, and confirmed/pending trigger formatters.
2. Add `EffortRadioGroup.tsx` with one controlled React Aria radio per advertised level, descriptions, confirmed check, requested-row indicator, `aria-busy`, and read-only event guards.
3. Add `ModelEffortSheet.tsx`; retain the model picker, replace nested effort select/popover/listbox with the radio group, support `initialSection`, controlled open state, one top-level dialog/popover, hydrate-on-open, scrolling, safe-area padding, and pending dismissal.
4. Update SessionHeader and RuntimeStrip to render confirmed values as separate spans and use the shared controller with their required initial sections.
5. Wire SessionComposer and App to own one `ModelEffortSheet` instance per session view and restore focus to the originating trigger.
6. Add radio, sheet, trigger, issue, pending, edge-state, and responsive styles using existing light/dark tokens.
7. Add component and integration tests for catalog order/subset, unknown IDs, one dialog, keyboard/focus behavior, pending dismissal, and exact runtime routing.

## Files to change

- `apps/pi-remote-web/src/effort.ts`
- `apps/pi-remote-web/src/EffortRadioGroup.tsx`
- `apps/pi-remote-web/src/ModelEffortSheet.tsx`
- `apps/pi-remote-web/src/SessionHeader.tsx`
- `apps/pi-remote-web/src/RuntimeStrip.tsx`
- `apps/pi-remote-web/src/SessionComposer.tsx`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/tests/EffortRadioGroup.test.tsx`
- `apps/pi-remote-web/tests/ModelEffortSheet.test.tsx`
- `apps/pi-remote-web/tests/RuntimeStrip.test.tsx`
- `apps/pi-remote-web/tests/App.test.tsx`
- SessionHeader tests under `apps/pi-remote-web/tests/`

## Verification gate

- `npm run typecheck` exits 0.
- `npm test` and `npm run test:web` exit 0, including protocol/relay security tests, runtime lifecycle tests, and all new sheet/radio DOM tests.
- Exercise the actual session view through CDP at exactly 390 CSS px in light and dark themes. Capture the closed view, Model-open view, Effort-open view with three levels, and seven two-line rows; confirm one dialog, no nested effort overlay, no horizontal overflow, and no clipped safe-area content.
