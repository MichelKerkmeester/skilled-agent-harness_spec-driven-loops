# styles/lib

## 1. OVERVIEW

The importable source code for the styles library. Consumers import through this tree; nothing here is
generated or mutable.

## Contents

- `paths.mjs` — the single path seam. Every filesystem location (bundle root, manifests, database root)
  resolves here, so the on-disk layout can move without editing the modules.
- `engine/` — the flat-file retrieval engine + the storage-neutral facade + the mode adapter.
- `database/` — the SQLite generation/indexer/retrieval plane (opt-in, default off).

## Architecture fit

`engine/style-library.mjs` is the facade (`runQuery` / `runHydrate`) that all four design-mode corpus
consumers call — none import the database directly. The adapter (`engine/persistent-adapter.mjs`) chooses
`legacy` (flat files, default), `shadow`, or `persistent` (SQLite). Data lives in `../library/`; tests in
`../tests/`.
