You are one read-only research seat executing iteration 8 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

TOPIC: Revalidate the SQLite-to-Turso migration research (baseline v0.5.0 docs) against the VENDORED tree at v0.7.0-pre.6 and current web state.

THIS ITERATION FOCUS: C8 spec-kit touchpoint reconciliation
Questions (answer ALL):
- C8a Which 027 additions create NEW gaps absent from the 16-gap catalog? Read the Phase A context report (context/context-report.md) sections 1-2 and 5-7, then verify its TOP claims against the vendored tree: which context-report blocker claims are REFUTED by iterations 1-6 evidence (known so far: "no ATTACH", "no VACUUM INTO", "triggers unsupported", "no .pragma()")? Produce a corrected blocker list: REAL blockers vs refuted ones, each with evidence.
- C8b For each REAL blocker, name the smallest migration-unit (file/symbol from the context report) and which Turso capability (or absence) it maps to.

ALREADY ESTABLISHED by iterations 1-6 (build on, do not re-derive): .pragma() method EXISTS in Turso JS SDK (gap 3 refuted; engine gaps: wal_checkpoint(TRUNCATE) unsupported-ish but exercised in tests for local files, synchronous=NORMAL unsupported, mmap_size gaps); better-sqlite3-compatible SYNC COMPAT mode shipped (./compat export with transaction(fn) incl. deferred/immediate/exclusive — gap 16 mostly resolved); ATTACH/DETACH supported (shard architecture survives); loadExtension/UDFs still absent (gaps 4/5 unchanged); backup()/serialize() absent but VACUUM INTO works (gaps 11/9 changed); no native vector index — linear scan only, f32 blob format sqlite-vec-compatible, quantized two-stage mitigation (gap 1 unchanged); Tantivy FTS experimental via index_method flag, fts_match/fts_score/fts_highlight intact, NoMergePolicy unconditional, FTS now in JS SDK (gaps 2/13 unchanged); WITH RECURSIVE still hard-rejected (gap 6 unchanged); CREATE TRIGGER fully supported by default, INSTEAD OF + changes() holes, recursive_triggers still off (gap 8 changed, gap 12 unchanged); AUTOINCREMENT works under MVCC (gap 7 changed); MVCC experimental journal mode AND mutually exclusive with Tantivy FTS; multi-process WAL via .tshm sidecar experimental opt-in (lease single-writer model survives); SQLITE_BUSY replaced by Busy/BusySnapshot error surface + native busy_timeout (retry predicate rewrite); window functions MORE limited than baseline (only row_number + aggregate OVER — gap 14 changed-worse); CDC de-unstabled (capture_data_changes_conn, modes off/id/before/after/full, turso_cdc table) but per-connection opt-in — not drop-in for audit triggers (gap 10 changed).

EVIDENCE SOURCES: vendored .opencode/specs/z_future/sqlite-to-turso/external/turso-main/ (COMPAT.md, CHANGELOG.md, docs/, core/, bindings/javascript/); baseline docs in .opencode/specs/z_future/sqlite-to-turso/research/ (001/002/003); the Phase A context report at .opencode/specs/z_future/sqlite-to-turso/context/context-report.md; WebSearch/WebFetch for post-vendor and libsql state. Cite [SOURCE: path:line] or URLs.

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 8: C8 spec-kit touchpoint reconciliation
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
