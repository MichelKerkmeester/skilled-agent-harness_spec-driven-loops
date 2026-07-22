# styles/tests/database

Tests for the SQLite database plane (`../../lib/database/`). Uses the built-in `node:sqlite` — no
`better-sqlite3` dependency.

## Key files

- `index.mjs` — the aggregator that runs the full database suite.
- Coverage: `schema`, `indexer`, `retrieval`, `adapter`, `operator`, `telemetry`, `manifest`,
  `judgments`, `oracle`, plus `fixtures.mjs` shared setup.

## Architecture fit

Verifies the generation lifecycle (build → validate → publish → rollback), eligibility-first retrieval,
adapter mode dispatch, and shadow parity. Green here + the `../oracle/` parity is the gate for trusting
the persistent path.
