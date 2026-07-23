# styles/tests

## 1. OVERVIEW

The automated test suites for the styles library. Run with `node --test` (Node ≥ 22; the database suites
use the built-in `node:sqlite`).

## Contents

- `engine/` — flat-file retrieval engine tests (the default read path).
- `database/` — SQLite generation / indexer / retrieval / adapter / operator tests.
- `oracle/` — the differential-parity oracle plus its pinned golden fixtures.

## Architecture fit

`engine/` and `database/` each have an `index.mjs` aggregator. The `oracle/` proves the two
implementations agree byte-for-byte across the query matrix, so the persistent path can be trusted as a
drop-in for the flat path. The manual counterpart is `../docs/manual-testing-playbook.md`.
