# styles/library/manifests

The flat engine's manifest(s) over the bundle corpus.

## Contents

- `retrieval-manifest.json` — the flat engine's freshness + index contract over `../bundles/`. It records
  per-bundle fingerprints so retrieval can fail closed on stale or missing content.

## Architecture fit

This is distinct from the **database generation manifest** (owned by `../../lib/database/`), which tracks
published SQLite generations. This retrieval manifest is the *flat* engine's contract and stays the
authority for the default `legacy` read path.
