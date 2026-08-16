# Plan — Functional model switcher sheet and state machine

## Approach

Build the pure catalog transformation layer first so identity, grouping, ordering, retired-current handling, availability, and search are deterministic and independently testable. Then implement one RAC sheet around explicit confirmed/draft state, wire fresh catalog/reconciliation and the Phase 1 ticket path, and finish with functional responsive styling and state-matrix tests. Review the mutation boundary in browser and relay traces before declaring the phase shippable.

## Steps

1. Add pure `modelKey`, grouping, ordering, retired-current, capability/availability, diacritic-insensitive matching, ID-prefix ranking, and locale-aware sort helpers.
2. Build `ModelSwitcherSheet` with one RAC modal dialog, optional in-place search at eight models, skeleton/loading states, grouped listbox rows, current/draft semantics, status, and footer actions.
3. Replace the nested picker path in `SessionHeader` with the model trigger and sheet while preserving the separately labelled thinking-effort sibling.
4. Extend runtime state for confirmed versus draft model, catalog phases, request generations, abort/timeout, foreground refresh, streaming gates, and terminal outcomes.
5. Add validated fresh catalog fetches and ensure only explicit **Switch model** invokes the Phase 1 ticket/control sequence.
6. Trigger foreground reconciliation from `App` without placing catalog, drafts, queries, or tickets in URL or persistent state.
7. Add initial sheet layout/state styles using existing semantic light/dark tokens, safe-area padding, and scroll containment.
8. Add catalog, sheet, runtime, and app tests for every functional state-matrix branch and exact call counts.
9. Complete the second security posture review and run the whole verification gate.

## Files to change

- `apps/pi-remote-web/src/model-catalog.ts`
- `apps/pi-remote-web/src/ModelSwitcherSheet.tsx`
- `apps/pi-remote-web/src/SessionHeader.tsx`
- `apps/pi-remote-web/src/runtime.ts`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/tests/model-catalog.test.ts`
- `apps/pi-remote-web/tests/ModelSwitcherSheet.test.tsx`
- `apps/pi-remote-web/tests/runtime.test.tsx`
- `apps/pi-remote-web/tests/App.test.tsx`

## Verification gate

- `npm run typecheck`
- `npm test`
- `npm run test:web`
- True-390px CDP captures of the sheet in light and dark with mobile metrics (`width: 390`, `deviceScaleFactor: 1`) and `Page.captureScreenshot`, covering at least `ready`, `staged`, and `committing`.
- DOM assertions confirm one modal dialog, no nested picker overlay, correct listbox/option semantics, current/draft labels, and no horizontal overflow.
- The second security review confirms row activation is read-only, only **Switch model** issues a ticket, the target/revision binding remains intact, and offline/access-denied/stale/delivery-unknown states leave no mutation path enabled.

