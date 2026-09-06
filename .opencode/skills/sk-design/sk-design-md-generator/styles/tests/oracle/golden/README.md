# styles/tests/oracle/golden

## 1. OVERVIEW

The pinned **golden canonical outputs** — the byte reference the differential oracle
(`../differential-oracle.mjs`) replays against.

## Contents

- One `*.canonical.json` per query lane: `hybrid`, `fts-text`, `structured-only`, `vector-only`,
  `exact-reuse`, `facet-filter`, `exclusions`, `paged`, `degraded-disable-fts`.
- `scales.json` — the 1x/10x/100x scale fixtures.
- `index.json` — the manifest of golden files.

## Do not hand-edit

These are frozen reference bytes. Regenerate them only through the oracle's blessed path — an ad-hoc edit
silently redefines "correct" and defeats the parity gate. A change here must be a deliberate, reviewed
re-bless, not a convenience update.
