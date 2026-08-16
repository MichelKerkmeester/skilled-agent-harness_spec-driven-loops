# Tasks — Functional model switcher sheet and state machine

- [ ] Add pure catalog helpers for `modelKey`, provider grouping, current-provider/current-model ordering, retired-current insertion, capability/availability projection, diacritic-insensitive matching, ID-prefix ranking, and deterministic locale-aware sorting.
- [ ] Build `ModelSwitcherSheet.tsx` with RAC modal primitives, one dialog for every catalog size, in-place search at eight or more models, four skeleton rows, live status, inline errors, footer actions, and current/draft semantics.
- [ ] Replace the nested `Popover → Select → Popover` model path in `SessionHeader.tsx` with `ModelTrigger` plus `ModelSwitcherSheet`; keep effort as a separate labelled sibling.
- [ ] Extend `runtime.ts` for confirmed model, draft key, catalog phase, request generation, abort/timeout, fresh-open, fresh-foreground, streaming gate, and all terminal outcomes.
- [ ] Add validated fresh catalog fetching in `relay.ts`; ensure staging never calls the ticket endpoint and only **Switch model** invokes the ticket/control sequence.
- [ ] Trigger visibility-return reconciliation in `App.tsx`; keep catalogs, drafts, queries, and tickets out of URL state and persistent cache.
- [ ] Add functional sheet styles for full-width/capped layout, contained list scrolling, readable rows, disabled/selected/current states, inline status, safe-area padding, and existing light/dark semantic tokens.
- [ ] Add or update catalog, sheet, runtime, and app tests for state branches, request races, no-network staging, one-ticket/one-command commit, host-confirmed updates, stale/no-retry, delivery-unknown reconciliation, streaming capability, and foreground refresh.
- [ ] Complete the second security posture review before rollout.

