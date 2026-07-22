# styles/library

## 1. OVERVIEW

The committed style-corpus **data** and its manifests. This is the content authority — both the flat
engine and the database indexer read from here.

## Contents

- `bundles/` — the 1,290 per-style bundle folders (the raw corpus). See its own README.
- `manifests/` — the retrieval manifest (the flat engine's freshness/index contract).

## Architecture fit

Data only — no code (that is `../lib/`) and no tests (`../tests/`). The flat files here remain the content
authority even when the persistent database is enabled; the SQLite generation in `../database/` is derived
from this corpus, never the reverse.
