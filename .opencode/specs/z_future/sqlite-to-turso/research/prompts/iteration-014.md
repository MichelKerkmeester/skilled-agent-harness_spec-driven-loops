You are one ADVERSARIAL verification seat executing iteration 14 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

MISSION: earlier iterations produced the CHANGED/REFUTED verdicts below about Turso v0.7.0-pre.6 (vendored at .opencode/specs/z_future/sqlite-to-turso/external/turso-main/). Your job is to ATTEMPT TO REFUTE each one with fresh, independent evidence from the vendored source. Do NOT trust the earlier citations — re-locate the evidence yourself (different files where possible: tests, core implementation, bindings — not just COMPAT.md). Default to skepticism: a claim survives only if you find positive evidence.

THIS ITERATION FOCUS: W5 adversarial: trigger, MVCC, CDC family

CLAIMS TO ADVERSARIALLY VERIFY:
- CLAIM-1 (gap 8 changed): CREATE TRIGGER and DROP TRIGGER are fully supported by default (non-MVCC), including RAISE(ABORT). Verify in core translation/tests beyond COMPAT.md.
- CLAIM-2 (gap 8 caveats): CREATE TRIGGER ... INSTEAD OF (view triggers) fails, and changes()/total_changes() are only partially reliable. Verify both: the INSTEAD OF rejection path and the changes() partial status; characterize exactly when change counters are wrong.
- CLAIM-3 (gap 7 changed): AUTOINCREMENT now works under MVCC via atomic sequences (the old rejection was removed). Verify in MVCC code/tests.
- CLAIM-4: Tantivy FTS (custom index_method modules) and MVCC are mutually exclusive — custom index modules are not supported in MVCC mode. Verify the rejection site in core/.
- CLAIM-5: experimental multi-process WAL coordination exists via a .tshm sidecar, opt-in (DatabaseOpts.enable_multiprocess_wal / with_multiprocess_wal(true), default off). Verify in core/ and bindings.
- CLAIM-6 (gap 10 changed): CDC is de-unstabled: pragma named capture_data_changes_conn (per-connection, modes off/id/before/after/full, default off, capture table default turso_cdc with defined schema). Verify pragma name, modes, and schema in core/ + docs.
- CLAIM-7: contention errors surface as Busy/BusySnapshot (no SQLITE_BUSY code in the JS surface) and a busy_timeout mechanism exists (open option and/or PRAGMA busy_timeout). Verify in core error types + JS bindings.
- CLAIM-8 (gap 14 changed-worse): window function support is ONLY row_number() and aggregate functions OVER; rank/dense_rank/lag/lead etc. are unsupported. Verify in the window-function implementation or tests.

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents. Web access is unavailable in your sandbox — use only the vendored tree and the repository.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 14: W5 adversarial: trigger, MVCC, CDC family
## Focus
(one paragraph)
## Findings
(one bullet per claim verified; EACH starts with NEW|PARTIAL|KNOWN, then a verdict CONFIRMED|OVERTURNED|NUANCED, then your independent evidence with [SOURCE: path:line])
## Ruled Out
## Dead Ends
## Sources Consulted
## Reflection
- What worked: ...
- What failed: ...
- Confidence: high|medium|low + why
## Recommended Next Focus
(one sentence)

