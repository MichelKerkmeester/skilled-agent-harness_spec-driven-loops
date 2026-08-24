# styles/library/bundles

## 1. OVERVIEW

The raw style corpus: **1,290 per-style bundle folders** (plus this README). Each bundle is one style —
`DESIGN.md`, design tokens, tailwind/css-vars, provenance, and related files.

## Do not hand-edit

These folders are **data**, not code, and are not individually documented. They are produced by the
extractor (`../../scripts/extract-refero.mjs`) and are the input the retrieval manifest and the database
indexer read. Editing a bundle by hand desynchronizes it from the manifest fingerprints.

## Architecture fit

The content authority for the whole styles library. The flat engine reads bundles directly; the SQLite
indexer derives a generation from them. Freshness is tracked by `../manifests/retrieval-manifest.json`.
