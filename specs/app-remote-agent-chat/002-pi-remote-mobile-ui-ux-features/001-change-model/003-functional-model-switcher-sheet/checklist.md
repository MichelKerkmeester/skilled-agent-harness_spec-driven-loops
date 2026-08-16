# Checklist — Functional model switcher sheet and state machine

- [ ] Opening always starts a fresh catalog request and an older response cannot overwrite a newer generation.
- [ ] Seven models render without a search field; eight models render search in the same dialog.
- [ ] Provider grouping, current-provider ordering, current-model ordering, retired-current insertion, and unavailable-row mapping are deterministic.
- [ ] Row activation and Enter staging change only draft state and issue no ticket or control request.
- [ ] One **Switch model** activation produces exactly one bound ticket and one control command with the exact target and both revisions.
- [ ] Dismissal and repeat controls are inert while commit is in flight.
- [ ] Accepted host state alone updates the header, closes the sheet, restores focus, and announces success.
- [ ] Stale, unavailable, policy-blocked, and delivery-unknown outcomes keep the confirmed model, show the required state, and never retry.
- [ ] Delivery-unknown requires read-only reconciliation before another commit and never presents the target as current.
- [ ] Streaming permits browsing/staging, blocks commit for false/unknown capability, and shows next-turn text only after host confirmation.
- [ ] Foreground reconciliation, offline, unreachable, access-denied, keyboard navigation, Escape, and search-clear behavior are covered by automated tests.
- [ ] The second security review confirms no mutation path exists from staging or failure states and no raw/sensitive data crosses storage, URL, log, or telemetry boundaries.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run test:web` passes.
- [ ] True-390px light/dark CDP captures cover `ready`, `staged`, and `committing`.
- [ ] DOM checks show one modal dialog, no nested picker overlay, valid listbox/option semantics, current/draft labels, and no horizontal overflow.

