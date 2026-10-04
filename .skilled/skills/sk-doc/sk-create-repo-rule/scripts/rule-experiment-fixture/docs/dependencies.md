# Dependencies

- `redis-py` 5.0.1, MIT. Used only by the optional Redis backend.
- `psycopg` 3.1.12, LGPL-3.0. The ledger store client.
- `prometheus-client` 0.19.0, Apache-2.0. Metrics export.
- `pydantic` 1.10.9, MIT. Config parsing. Version 1 is out of support.
- `tenacity` 8.2.2, Apache-2.0. Retries in the store wrapper.
- `left-padder` 0.0.3, unlicensed. Pulled in by an old logging helper.
