You are one read-only research seat executing iteration 10 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

TOPIC: Revalidate the SQLite-to-Turso migration research (baseline v0.5.0 docs) against the VENDORED tree at v0.7.0-pre.6 and current web state. This is a WAVE-4 DEEP-DIVE iteration.

THIS ITERATION FOCUS: W4 deep-dive: compat-mode pilot scoping for spec-kit
Questions (answer ALL):
- Enumerate ACTUAL call sites in the three skills (better-sqlite3 surface: backup(, serialize(, .function(, .aggregate(, .table(, loadExtension(, .iterate(, .raw(, .pluck(, .columns(, unsafeMode, defaultSafeIntegers) via grep across .opencode/skills/system-spec-kit/mcp_server/lib, .opencode/skills/system-code-graph/mcp_server/lib, .opencode/skills/system-skill-advisor/mcp_server/lib — which compat-mode not-implemented methods are ACTUALLY used, where, and what is the per-site workaround?
- Bare VACUUM sites: confirm the db-shard-migration.ts lines around 274 and 282 and whether VACUUM INTO can substitute; any other bare VACUUM or incremental_vacuum sites in the three skills?
- run().changes call sites: grep .changes usage across the three skills — which flows depend on accurate change counters and what breaks if the counter is unreliable?
- Schema-prefixed pragmas against ATTACHed DBs (ensure_vector_shard_schema issues schema-qualified pragmas like <schema>.journal_mode): does the vendored engine support schema-qualified PRAGMA? Evidence from core/ pragma handling.

ESTABLISHED (iterations 1-9; build on, do not re-derive): compat-mode sync API shipped (./compat, transaction(fn) variants); not-implemented compat surface = backup(), serialize(), function(), aggregate(), table(), loadExtension(); ATTACH/DETACH + CREATE TRIGGER + VACUUM INTO + database_list/quick_check/table_info/user_version pragmas all OK; synchronous=NORMAL accepted (iter-9 supersedes iter-1); WITH RECURSIVE hard-rejected; no native vector index (linear scan; f32 blob sqlite-vec-compatible; quantized two-stage lever); Tantivy FTS experimental via index_method flag, in JS SDK, NoMergePolicy unconditional, MUTUALLY EXCLUSIVE with MVCC; CDC de-unstabled but per-connection opt-in; bare in-place VACUUM experimental (real blocker at db-shard-migration.ts:274,:282); run().changes reliability partial (NEW 027-era gap); Busy/BusySnapshot replaces SQLITE_BUSY + native busy_timeout; lease single-writer survives; Path C-prime (adapter as ports model 1200-2000 LOC + compat pilot) is the leading strategy; production FAQ: powers production apps but below SQLite reliability bar, libSQL production-ready vs Turso not, no 1.0 signal.

EVIDENCE SOURCES: vendored .opencode/specs/z_future/sqlite-to-turso/external/turso-main/ (COMPAT.md, CHANGELOG.md, docs/, core/, bindings/javascript/); the three skills under .opencode/skills/*/mcp_server/lib; baseline docs + context report in the packet; WebSearch/WebFetch where the question says WEB. Cite [SOURCE: path:line] or URLs with dates.

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 10: W4 deep-dive: compat-mode pilot scoping for spec-kit
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
