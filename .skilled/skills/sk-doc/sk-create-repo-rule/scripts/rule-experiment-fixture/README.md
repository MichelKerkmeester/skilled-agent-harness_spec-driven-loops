# orbit-cache

A small caching layer that sits in front of the ledger store. It serves account
balances to the web tier and keeps the ledger database from being hit on every
page load.

- `src/orbit/cache.py` holds the in-memory cache with TTL expiry.
- `src/orbit/store.py` wraps the ledger database client.
- `src/orbit/config.py` reads settings from environment variables.

Run the tests with `python3 -m pytest tests`.

Settings: `ORBIT_TTL_SECONDS` (default 30), `ORBIT_MAX_ENTRIES` (default 10000).
