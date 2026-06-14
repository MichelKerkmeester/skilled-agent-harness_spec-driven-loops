You are one read-only research seat executing iteration 9 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

TOPIC: Revalidate the SQLite-to-Turso migration research (baseline v0.5.0 docs) against the VENDORED tree at v0.7.0-pre.6 and current web state.

THIS ITERATION FOCUS: C9 leftovers and post-vendor state
Questions (answer ALL):
- C3c-followup: libsql FTS5 parameterized-insert bug (gap 15) — check the libsql repo/issues and npm releases on the WEB; fixed or open?
- C6c-followup: read external/turso-main/docs production-readiness/FAQ content (it was updated in 0.6.0 but unread); what does it say about production use and 1.0?
- Post-vendor web sweep: Turso releases AFTER v0.7.0-pre.6 (current latest version, vector-index progress, FTS stabilization, MVCC+FTS exclusivity fix, CDC default-on plans, 1.0 roadmap signals). Cite URLs with dates.
- synchronous=NORMAL engine gap: how does the spec-kit init sequence (vector-index-store ensure_vector_shard_schema pragmas) degrade if synchronous only supports OFF/FULL?

ALREADY ESTABLISHED by iterations 1-6 (build on, do not re-derive): .pragma() method EXISTS in Turso JS SDK (gap 3 refuted; engine gaps: wal_checkpoint(TRUNCATE) unsupported-ish but exercised in tests for local files, synchronous=NORMAL unsupported, mmap_size gaps); better-sqlite3-compatible SYNC COMPAT mode shipped (./compat export with transaction(fn) incl. deferred/immediate/exclusive — gap 16 mostly resolved); ATTACH/DETACH supported (shard architecture survives); loadExtension/UDFs still absent (gaps 4/5 unchanged); backup()/serialize() absent but VACUUM INTO works (gaps 11/9 changed); no native vector index — linear scan only, f32 blob format sqlite-vec-compatible, quantized two-stage mitigation (gap 1 unchanged); Tantivy FTS experimental via index_method flag, fts_match/fts_score/fts_highlight intact, NoMergePolicy unconditional, FTS now in JS SDK (gaps 2/13 unchanged); WITH RECURSIVE still hard-rejected (gap 6 unchanged); CREATE TRIGGER fully supported by default, INSTEAD OF + changes() holes, recursive_triggers still off (gap 8 changed, gap 12 unchanged); AUTOINCREMENT works under MVCC (gap 7 changed); MVCC experimental journal mode AND mutually exclusive with Tantivy FTS; multi-process WAL via .tshm sidecar experimental opt-in (lease single-writer model survives); SQLITE_BUSY replaced by Busy/BusySnapshot error surface + native busy_timeout (retry predicate rewrite); window functions MORE limited than baseline (only row_number + aggregate OVER — gap 14 changed-worse); CDC de-unstabled (capture_data_changes_conn, modes off/id/before/after/full, turso_cdc table) but per-connection opt-in — not drop-in for audit triggers (gap 10 changed).

EVIDENCE SOURCES: vendored .opencode/specs/z_future/sqlite-to-turso/external/turso-main/ (COMPAT.md, CHANGELOG.md, docs/, core/, bindings/javascript/); baseline docs in .opencode/specs/z_future/sqlite-to-turso/research/ (001/002/003); the Phase A context report at .opencode/specs/z_future/sqlite-to-turso/context/context-report.md; WebSearch/WebFetch for post-vendor and libsql state. Cite [SOURCE: path:line] or URLs.

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 9: C9 leftovers and post-vendor state
## Focus
(one paragraph)
## Findings
(one bullet per finding; EACH starts with NEW|PARTIAL|KNOWN, then verdict UNCHANGED|CHANGED|REFUTED where applicable, then evidence)
## Ruled Out
## Dead Ends
## Sources Consulted
## Reflection
- What worked: ...
- What failed: ...
- Confidence: high|medium|low + why
## Recommended Next Focus
(one sentence)
