# styles/tests/oracle

The differential-parity oracle: proves the flat engine and the SQLite path return byte-for-byte identical
results across the full query matrix at 1x / 10x / 100x scales.

## Key files

- `differential-oracle.mjs` — the comparator that replays the query matrix against pinned golden bytes.
- `query-set.mjs` — the canonical query matrix.
- `replay-fixtures.mjs` — deterministic 1x/10x/100x replay fixtures.
- `relevance-judgments.mjs` + `relevance-judgments.seed.json` — the honestly-labeled relevance seed.
- `golden/` — the pinned canonical outputs the oracle replays against (see its README).

## Architecture fit

The parity gate. A byte reference can never drift from production output because both sides serialize
through one shared canonicalizer. Green oracle + green `../database/` is what lets the persistent path be
treated as a drop-in replacement for the flat path.
