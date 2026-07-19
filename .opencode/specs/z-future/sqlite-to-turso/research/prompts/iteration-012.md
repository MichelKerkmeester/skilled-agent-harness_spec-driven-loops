You are one read-only research seat executing iteration 12 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

TOPIC: Revalidate the SQLite-to-Turso migration research (baseline v0.5.0 docs) against the VENDORED tree at v0.7.0-pre.6 and current web state. This is a WAVE-4 DEEP-DIVE iteration.

THIS ITERATION FOCUS: W4 deep-dive: leftovers closure
Questions (answer ALL):
- Gap 15 FINAL: libsql FTS5 parameterized-insert bug — search the WEB (libsql GitHub issues, libsql npm changelogs) for the bug status; fixed version or still open? Cite URLs.
- Post-vendor releases: latest Turso version on the web TODAY (after v0.7.0-pre.6), with dates; any vector-index, FTS-stabilization, MVCC, or CDC milestones announced since the vendored snapshot? Cite URLs with dates.
- MVCC and FTS exclusivity implications: given spec-kit uses FTS heavily, is MVCC permanently off the table for this codebase, and does that matter (which spec-kit flows could have wanted BEGIN CONCURRENT)?
- Explicit closure for the 027 constructs: do incremental-index.ts (memo/chunk identity), statediff.ts, and the causal tombstone constructs introduce ANY SQL constructs beyond the already-cataloged set (check for: UPSERT ON CONFLICT, partial indexes, expression indexes, generated columns, json functions, STRICT tables)? Verdict per construct vs COMPAT.md.

ESTABLISHED (iterations 1-9; build on, do not re-derive): compat-mode sync API shipped (./compat, transaction(fn) variants); not-implemented compat surface = backup(), serialize(), function(), aggregate(), table(), loadExtension(); ATTACH/DETACH + CREATE TRIGGER + VACUUM INTO + database_list/quick_check/table_info/user_version pragmas all OK; synchronous=NORMAL accepted (iter-9 supersedes iter-1); WITH RECURSIVE hard-rejected; no native vector index (linear scan; f32 blob sqlite-vec-compatible; quantized two-stage lever); Tantivy FTS experimental via index_method flag, in JS SDK, NoMergePolicy unconditional, MUTUALLY EXCLUSIVE with MVCC; CDC de-unstabled but per-connection opt-in; bare in-place VACUUM experimental (real blocker at db-shard-migration.ts:274,:282); run().changes reliability partial (NEW 027-era gap); Busy/BusySnapshot replaces SQLITE_BUSY + native busy_timeout; lease single-writer survives; Path C-prime (adapter as ports model 1200-2000 LOC + compat pilot) is the leading strategy; production FAQ: powers production apps but below SQLite reliability bar, libSQL production-ready vs Turso not, no 1.0 signal.

EVIDENCE SOURCES: vendored .opencode/specs/z_future/sqlite-to-turso/external/turso-main/ (COMPAT.md, CHANGELOG.md, docs/, core/, bindings/javascript/); the three skills under .opencode/skills/*/mcp_server/lib; baseline docs + context report in the packet; WebSearch/WebFetch where the question says WEB. Cite [SOURCE: path:line] or URLs with dates.

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 12: W4 deep-dive: leftovers closure
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
