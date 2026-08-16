# Plan — Shared in-memory catalog and deterministic command engine

## Approach

Separate transport lifecycle from pure interaction logic. Build a guarded, session-scoped in-memory catalog hook with shared requests and race protection, then implement normalization, ranking, trigger parsing, insertion, caret/focus, and binding as independently testable functions. Migrate the existing `+` browser to those shared primitives while leaving its visual surface and all execution behavior unchanged.

## Steps

1. Define shared command and catalog lifecycle types in `apps/pi-remote-web/src/commands.ts` and scope snapshots to authenticated host epoch and session.
2. Add in-flight request sharing, `AbortController` cancellation, monotonic request IDs, and matching-response commits for reconnect, foreground, and session transitions.
3. Implement Unicode/case/diacritic normalization, exact ranking tiers, host-order tie-breaks, disabled-row handling, active-name retention, and matching-grapheme ranges.
4. Implement the leading-slash trigger predicate from draft, caret, selection, focus, Escape latch, and IME state without transport or filtering side effects.
5. Implement canonical complete-token replacement, synchronous controlled-draft update, caret placement, focus restoration, binding creation, and “Not sent” announcement dispatch.
6. Move `CommandPalette` to the shared catalog, ranking, and insertion reducer, and pass session/connection/epoch context through `SessionComposer` and `App`.
7. Add guarded relay lifecycle calls and lifecycle/pure/component fixtures proving local-only filtering and insertion parity.
8. Run the typecheck, targeted web tests, full web suite, and true-390px light/dark visual gate.

## Files to change

- `apps/pi-remote-web/src/commands.ts`
- `apps/pi-remote-web/src/rankHostCommands.ts`
- `apps/pi-remote-web/src/useSlashTrigger.ts`
- `apps/pi-remote-web/src/insertSlashCommand.ts`
- `apps/pi-remote-web/src/CommandPalette.tsx`
- `apps/pi-remote-web/src/SessionComposer.tsx`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/relay.ts`
- `apps/pi-remote-web/tests/rankHostCommands.test.ts`
- `apps/pi-remote-web/tests/useSlashTrigger.test.ts`
- `apps/pi-remote-web/tests/insertSlashCommand.test.ts`
- Catalog lifecycle tests under `apps/pi-remote-web/tests/`
- `apps/pi-remote-web/tests/CommandPalette.test.tsx`
- Relevant `apps/pi-remote-web/tests/App.test.tsx` fixtures

## Verification gate

- `npm run typecheck`
- `npx vitest run apps/pi-remote-web/tests/CommandPalette.test.tsx apps/pi-remote-web/tests/rankHostCommands.test.ts apps/pi-remote-web/tests/useSlashTrigger.test.ts apps/pi-remote-web/tests/insertSlashCommand.test.ts`
- `npm run test:web`
- Capture the existing `+` browser and composer through CDP at exactly 390 CSS pixels in light and dark.
- Confirm catalog refresh does not displace the composer and the shared route has no visual regression.

