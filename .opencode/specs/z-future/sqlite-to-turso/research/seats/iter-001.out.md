Research complete — all six C1 questions answered from the vendored tree. ExitPlanMode's contract explicitly excludes pure research tasks (no implementation is being planned), so I'm delivering the iteration result directly; it is also saved at `/Users/michelkerkmeester/.claude-account2/plans/you-are-one-read-only-zazzy-alpaca.md`.

# Iteration 1: C1 driver/API surface

## Focus
Revalidated the baseline (Turso v0.5.0-era) driver/API-surface claims against the vendored Turso tree at `@tursodatabase/database@0.7.0-pre.6` (`.opencode/specs/z_future/sqlite-to-turso/external/turso-main/`): PRAGMA coverage, loadExtension/sqlite-vec, JS UDF registration, backup/serialize equivalents, the better-sqlite3-compatible sync mode plus sync `.transaction()` wrappers, and ATTACH/DETACH support for the vector-shard architecture. Primary evidence: `COMPAT.md`, `CHANGELOG.md` (newest section 0.6.0, 2026-05-14), and the JS bindings source (`bindings/javascript/packages/common/{compat.ts,promise.ts}`, `packages/native/package.json`). Web verification of post-vendor state was attempted but permission-blocked.

## Findings
- **NEW, REFUTED (C1a, gap 3)** — Baseline claimed "`.pragma()` method not available — neither Turso's SDK nor the libsql npm package implements it." Turso's own JS SDK at 0.7.0-pre.6 implements `pragma()` in BOTH the sync compat API and the async promise API; it prepares `PRAGMA ${source}` and returns `stmt.all()` [SOURCE: bindings/javascript/packages/common/compat.ts:148-166; bindings/javascript/packages/common/promise.ts:410-428]. Caveat: better-sqlite3's `{ simple: true }` option is accepted but silently ignored — it always returns an array of row objects.
- **NEW (C1a, gap 3)** — Engine-level verdicts for the six asked PRAGMAs: `journal_mode` ✅ [SOURCE: COMPAT.md:177], `wal_checkpoint` 🚧 partial (parameterized form like `wal_checkpoint(TRUNCATE)` unsupported) [SOURCE: COMPAT.md:215], `user_version` ✅ [SOURCE: COMPAT.md:209], `quick_check` ✅ [SOURCE: COMPAT.md:191], `database_list` ✅ [SOURCE: COMPAT.md:158], `table_info` ✅ [SOURCE: COMPAT.md:202].
- **NEW (C1a follow-on)** — Two pragmas our init sequence sets remain unsupported at engine level even though the `.pragma()` method now exists: `synchronous` supports only `OFF`/`FULL` (we set `NORMAL`) [SOURCE: COMPAT.md:201], and `mmap_size` is ❌ (we set 268435456) [SOURCE: COMPAT.md:183]. `busy_timeout`, `cache_size`, `foreign_keys`, `temp_store` are all ✅ [SOURCE: COMPAT.md:147,148,165,205]. `PRAGMA foreign_key_list` was newly implemented in 0.6.0 [SOURCE: CHANGELOG.md:28].
- **KNOWN, UNCHANGED (C1b, gap 4)** — `loadExtension()` still throws `"not implemented"` in both API flavors [SOURCE: bindings/javascript/packages/common/compat.ts:188-190; promise.ts:450-452]; the entire C-API loadable-extension surface is ❌ [SOURCE: COMPAT.md:756-764]; SQL `load_extension(X)` is partial — "Only Turso-native extensions, not SQLite .so/.dll", two-arg form ❌ [SOURCE: COMPAT.md:287-288]. **sqlite-vec still cannot load into Turso.** Native libSQL-compatible vector functions remain the substitute [SOURCE: COMPAT.md:1005-1018]. The baseline claim that the libsql npm package DOES support `loadExtension()` could not be re-verified (web blocked) — carried forward as known-unverified.
- **KNOWN, UNCHANGED (C1c, gap 5)** — JS UDF registration still absent: `function()`, `aggregate()`, and `table()` all throw `"not implemented"` in both APIs [SOURCE: compat.ts:176-186; promise.ts:438-448]; C API `sqlite3_create_function*` and the `sqlite3_result_*` family are ❌/stubs [SOURCE: COMPAT.md:635-666]. Baseline workaround W5a (keep logic in TypeScript) stands.
- **KNOWN, UNCHANGED + NEW mitigation (C1d, gap 11)** — `backup()` and `serialize()` still throw in both APIs [SOURCE: compat.ts:168-174; promise.ts:430-436]; C API backup and serialize/deserialize remain ❌ stubs [SOURCE: COMPAT.md:680-771]. NEW vs baseline: `VACUUM INTO` is supported (plain VACUUM experimental) [SOURCE: COMPAT.md:130] and works on attached databases [SOURCE: CHANGELOG.md:237] — a transactional online-backup substitute beyond baseline's file-copy workaround; Turso-specific WAL primitives (`libsql_wal_frame_count`/`get_frame`/`insert_frame`/`disable_checkpoint`) are ✅ [SOURCE: COMPAT.md:787-794].
- **PARTIAL, CHANGED-strengthened (C1e, gap 16)** — The better-sqlite3-compatible sync mode is shipped, not speculative: `@tursodatabase/database@0.7.0-pre.6` exports `"."` → async `promise.js` and `"./compat"` → sync `compat.js` [SOURCE: bindings/javascript/packages/native/package.json:2-15]. Sync mode drives the engine via `connectSync()` plus a `stepSync()`/`ioLoopSync()` pump on the JS thread — confirming the baseline caveat that it's a synchronously-pumped I/O loop, not native sync [SOURCE: compat.ts:78-89, 202-225, 317-343].
- **NEW (C1e)** — Fate of sync `.transaction()` wrappers answered: compat ships a full better-sqlite3-style `transaction(fn)` with `.deferred`/`.immediate`/`.exclusive` variants implemented as `BEGIN <mode>`/`COMMIT`/`ROLLBACK` [SOURCE: compat.ts:116-146]. Caveat: plain BEGIN only — no SAVEPOINT fallback, so better-sqlite3's nested-transaction semantics are not replicated. `interrupt()` throws in both APIs [SOURCE: compat.ts:230-232; promise.ts:494-496]. The async API moved to `prepare()`-returns-promise in 0.6.0 [SOURCE: CHANGELOG.md:152] and gained per-connection/per-statement query timeouts [SOURCE: CHANGELOG.md:79; compat.ts:28-46].
- **NEW (C1f)** — ATTACH DATABASE ✅ and DETACH DATABASE ✅ in the statement matrix [SOURCE: COMPAT.md:88,99], with active 0.5.0→0.6.0 hardening: ATTACH initializes fresh databases [SOURCE: CHANGELOG.md:71], optimizer index-resolution fix for attach [SOURCE: CHANGELOG.md:361], canonical schema stored for attached DBs [SOURCE: CHANGELOG.md:55], encryption keys for attached DBs via URI params [SOURCE: CHANGELOG.md:514]. The vector-shard architecture is plausible at 0.7.0-pre.6, BUT one contradiction needs runtime validation: the expression matrix still lists `schema.table.column` as 🚧 "Schemas aren't supported" [SOURCE: COMPAT.md:241], and `sqlite_dbpage` has "no attach support" [SOURCE: COMPAT.md:1117]. Qualified `alias.table.column` references against attached DBs must be smoke-tested before committing.

## Ruled Out
- "Neither Turso's SDK nor the libsql npm package implements `.pragma()`" — disproven for Turso's SDK at 0.7.0-pre.6; the W3a mechanical `.exec('PRAGMA …')` rewrite is no longer needed for method availability (the real remaining work is engine-level pragma gaps).
- Turso "compat mode" as a speculative feature — it is a concrete shipped export (`@tursodatabase/database/compat`) with its own test suite (`packages/native/compat.test.ts`).
- The implicit baseline assumption that ATTACH support was absent/unknown — ATTACH/DETACH are ✅ with sustained hardening through 0.6.0.

## Dead Ends
- WebSearch and WebFetch both permission-blocked this session — no verification of releases after v0.7.0-pre.6, open GitHub issues, or current libsql-npm `loadExtension` status.
- `bindings/javascript/packages/common/src/` does not exist — TS sources live flat in `packages/common/` (one empty search round).
- The harness `Grep` tool was unavailable; fell back to `rg` via Bash.
- CHANGELOG.md has no 0.7.0-pre.x section — newest entry is `0.6.0 -- 2026-05-14` [SOURCE: CHANGELOG.md:3], so 0.6.0→0.7.0-pre.6 deltas are observable only in source.

## Sources Consulted
- `external/turso-main/COMPAT.md` — full read (key lines 84-241, 464-794, 1005-1117)
- `research/003 - gaps-and-workarounds-sqlite-to-turso.md` — full read (gaps 3, 4, 5, 11, 16)
- `external/turso-main/CHANGELOG.md` — version headers + keyword grep (lines 24-570)
- `external/turso-main/bindings/javascript/packages/common/compat.ts` — lines 1-453 (full)
- `external/turso-main/bindings/javascript/packages/common/promise.ts` — lines 300-519
- `external/turso-main/bindings/javascript/packages/native/package.json` — lines 1-57
- Directory listings of `bindings/javascript/` and `bindings/javascript/packages/**`
- Web: none (permission-denied)

## Reflection
- What worked: COMPAT.md's matrices plus direct reads of `compat.ts`/`promise.ts` resolved every C1 sub-question with line-level evidence; grepping the changelog with line-number boundaries (0.6.0 section = lines 3-490) cheaply dated the ATTACH/PRAGMA hardening.
- What failed: both web tools were permission-blocked, so post-vendor state (after 2026-05) and the libsql-npm comparison are unverified; `context/context-report.md` was not re-read this iteration due to budget.
- Confidence: high for all vendored-tree claims (direct source citations); low for anything past v0.7.0-pre.6 and for the libsql `loadExtension` claim carried from baseline.

## Recommended Next Focus
Runtime smoke-test the contradiction cluster — qualified `alias.table` references against ATTACHed databases, `PRAGMA synchronous = NORMAL` / `mmap_size` / `wal_checkpoint(TRUNCATE)` behavior, and compat-mode `pragma()` return shapes — via the vendored `tursodb` CLI, and re-run the post-0.7.0-pre.6 web check once WebSearch/WebFetch permissions are granted.
