# Reproduction: coverage graph upsert skipped

Run: `specs/system-speckit/048-doctor-command-audit/003-update/research`.
- `grep -c graphEvents deltas/iter-*.jsonl` -> 1 per delta file (10 files carry graph events).
- `grep -c graphEvents deep-research-state.jsonl` -> 0 (the projection's iteration rows have no such field).
- `sqlite3 -readonly "file:runtime/database/deep-loop-graph.sqlite?mode=ro" "select count(*) from coverage_nodes where spec_folder like '%048-doctor%'"` -> 0; edges -> 0.

Verdict: holds. The upsert step reads `graphEvents` from the state log, where they never are.
