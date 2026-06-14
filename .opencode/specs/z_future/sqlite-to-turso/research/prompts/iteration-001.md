You are one read-only research seat executing iteration 1 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

TOPIC: Revalidate the SQLite-to-Turso migration research (baseline docs written against Turso v0.5.0) against the VENDORED Turso source tree at v0.7.0-pre.6 and current web state.

THIS ITERATION FOCUS: C1 driver/API surface
Questions (answer ALL):
- C1a PRAGMA support (journal_mode, wal_checkpoint, user_version, quick_check, database_list, table_info) — gap 3
- C1b loadExtension absence + sqlite-vec loadability (libsql comparison) — gap 4
- C1c UDF registration in JS bindings — gap 5
- C1d backup()/serialize() equivalents — gap 11
- C1e sync-to-async: better-sqlite3-compatible sync/compat mode in 0.7.x JS bindings; fate of sync .transaction() wrappers — gap 16
- C1f ATTACH/DETACH DATABASE support (vector-shard architecture depends on it) — NEW vs baseline

EVIDENCE SOURCES (in priority order):
1. Vendored Turso source: .opencode/specs/z_future/sqlite-to-turso/external/turso-main/ — start with COMPAT.md (the compatibility matrix), CHANGELOG.md, bindings/javascript/, core/, docs/. Cite as [SOURCE: <repo-relative path>:<line>].
2. Baseline claims to revalidate: .opencode/specs/z_future/sqlite-to-turso/research/"003 - gaps-and-workarounds-sqlite-to-turso.md" (gap catalog), "001 - analysis-...".md, "002 - recommendations-...".md.
3. Live-code blocker map: .opencode/specs/z_future/sqlite-to-turso/context/context-report.md (what the migration actually touches today).
4. Web (WebSearch/WebFetch) for post-vendor state: Turso releases after v0.7.0-pre.6, GitHub issues, libsql releases. Cite URLs.

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 1: C1 driver/API surface
## Focus
(one paragraph)
## Findings
(one bullet per finding; EACH bullet starts with a tag NEW|PARTIAL|KNOWN — novelty vs the baseline docs — then for gap questions a verdict UNCHANGED|CHANGED|REFUTED vs the baseline claim, then the evidence with [SOURCE: path:line] or URL)
## Ruled Out
(claims/directions now disproven)
## Dead Ends
(searches/sources that yielded nothing)
## Sources Consulted
(complete list: files with line ranges, URLs)
## Reflection
- What worked: ...
- What failed: ...
- Confidence: high|medium|low + why
## Recommended Next Focus
(one sentence)
