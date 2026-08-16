# Tasks — Shared in-memory catalog and deterministic command engine

- [ ] Evolve or split `apps/pi-remote-web/src/commands.ts` into `useHostCommandCatalog`, lifecycle/revalidation helpers, and shared command types scoped by auth epoch and session.
- [ ] Share in-flight catalog requests, use `AbortController` and a monotonic request ID, commit only matching responses, and keep catalog state in memory.
- [ ] Implement `apps/pi-remote-web/src/rankHostCommands.ts` with Unicode/case/diacritic normalization, exact ranking tiers, host-order ties, disabled-row handling, active-name retention, and matching-grapheme ranges.
- [ ] Implement `apps/pi-remote-web/src/useSlashTrigger.ts` for draft, caret, selection, focus, Escape latch, and IME-aware trigger parsing with no transport or filtering logic.
- [ ] Implement `apps/pi-remote-web/src/insertSlashCommand.ts` for complete-token replacement, synchronous draft update, caret placement, focus restoration, revision binding, and the “Not sent” announcement event.
- [ ] Update `apps/pi-remote-web/src/CommandPalette.tsx` to consume the shared catalog, ranking, canonical names, and insertion reducer without independent fetches or inferred metadata.
- [ ] Pass session, connection, and host-epoch context through `apps/pi-remote-web/src/SessionComposer.tsx` and `apps/pi-remote-web/src/App.tsx` while preserving ordinary text behavior and deferring inline rendering.
- [ ] Add guarded catalog lifecycle calls and unavailable/forbidden/incompatible/stale error classes in `apps/pi-remote-web/src/relay.ts`.
- [ ] Add ranking, trigger, insertion, catalog lifecycle, `CommandPalette`, and relevant `App` fixtures covering races, local filtering, insertion parity, binding clearing/retention, and no execution requests.

