# styles/lib/engine

The flat-file retrieval engine and the storage-neutral facade. This is the default read path (no database
required).

## Key files

- `style-library.mjs` — the facade: `runQuery` / `runHydrate`. The single boundary every corpus consumer
  calls; it never leaks storage details.
- `persistent-adapter.mjs` — the mode switch (`legacy` / `shadow` / `persistent`), default `legacy`, plus
  the shadow parity comparator.
- Flat-file lanes: `cards.mjs`, `eligibility.mjs`, `ordering.mjs`, `rank-fts.mjs`, `hydrate.mjs`,
  `manifest.mjs`, `corpus-use-proof.mjs`.

## Architecture fit

Eligibility-first, then ranking, then hydration — read from `../../library/`. The adapter lets the same
facade serve flat files or the SQLite generation in `../database/` without changing any consumer. Tests
live in `../../tests/engine/`.
