# L9 Still-Real Verification — P2/P3 Sweep, Part B (17 findings)

Verifier: fresh Fable 5 pass, 2026-06-12. Every finding re-checked against current code/docs with fresh reads, greps, and live command runs (strict validation re-executed, ESM failure reproduced, env-var coverage re-counted). Explicit overtake check performed against today's shipped lanes (single-writer DB lock + exit-86 launcher contract, shared secret scrubber, hash-only fingerprints, --command dispatch + probe gauntlet, apply-pipeline confirm gates + retention, launcher lifecycle doc reconciliation, detect_changes review adoption, advisor doc batch).

**Result: 17/17 STILL-REAL. 0 MOVED / 0 OVERTAKEN / 0 REFUTED.**

Overtake candidates checked explicitly: tri-068 (launcher lifecycle doc reconciliation did NOT touch `mcp_server/README.md:39/239` — they still name the backend dist as the client entry), tri-084 and tri-087 (advisor doc batch did NOT touch `schema-migration.md` or the 52-case count docs), tri-079 (the dual-stack CLI paragraph and the stop-on-MCP-unavailable bullet still coexist in the same SKILL.md).

## Summary

| ID | Verdict | Fix class | Anchor evidence (current) |
|---|---|---|---|
| tri-064 | STILL-REAL | doc-only | `SPECKIT_BOOT_FTS_AUTOHEAL` read at `mcp_server/context-server.ts:382`, absent from ENV_REFERENCE.md; rescan: 205 distinct runtime `SPECKIT_*` vars, 40 undocumented |
| tri-065 | STILL-REAL | code-small | `scripts/package.json:14-16` — `test` = vitest + `test:legacy` only; `test-validation.sh`/`test-validation-extended.sh` exist but are on no npm script |
| tri-066 | STILL-REAL | code-small | `validate.sh --strict` re-run on 002/003/004: FAILED errors=4/2/2; `test-fixtures/README.md:102-104` still claims they pass |
| tri-067 | STILL-REAL | code-small | `scripts/package.json:5` `"type":"module"` + `tests/test-validation-system.js:28` `require('path')` → ReferenceError reproduced today |
| tri-068 | STILL-REAL | doc-only | `mcp_server/README.md:39,239` still call `dist/context-server.js` the client-config entry; `opencode.json:22` registers the launcher; `INSTALL_GUIDE.md:327` forbids pointing clients at dist |
| tri-079 | STILL-REAL | doc-only | `system-code-graph/SKILL.md:286` (use CLI when MCP missing/failed) vs `:294` (MCP unavailable → report state and stop) |
| tri-080 | STILL-REAL | code-small | `structural-indexer.ts:2146` silent `continue` on unsupported language; `handlers/scan.ts:745` `filesScanned: results.length`; zero `unsupported*` accounting in either file |
| tri-081 | STILL-REAL | doc-only | `system-code-graph/README.md:96` general-quarantine claim vs `tree-sitter-parser.ts:841-846` (B1/B2-only skip-list adds) |
| tri-084 | STILL-REAL | doc-only | `schema-migration.md:21` daemon bring-up claim; `lib/lifecycle/schema-migration.ts` imported only by two vitest/stress files |
| tri-087 | STILL-REAL | doc-only | `regression-suite.md:55` "Fewer than 52"; `skill_advisor_hook.md:227` "52/52"; fixture JSONL = 50 rows (wc -l) |
| tri-100 | STILL-REAL | doc-only | `lib/utils/README.md:106` decay-only claim vs `spec-doc-paths.ts:22-27,48-53` exclusion + `memory-parser.ts:1168` `!isWorkingArtifactPath` rejection |
| tri-102 | STILL-REAL | doc-only | 021 `implementation-summary.md:118` says FTS5-only; same raw LIKE in `vector-index-queries.ts:89-90` (`appendSpecFolderScope`) and `hybrid-search.ts:697,2148`; no ESCAPE anywhere |
| tri-104 | STILL-REAL | code-small | `consumption-logger.ts:239,338` define, `:512-513` export; zero non-test callers repo-wide |
| tri-105 | STILL-REAL | code-careful | `vector-index-mutations.ts:81-90` dual-write; `embedding-reconcile.ts:4-6` co-required surfaces; `computeSuccessCoverage` flags either-missing; no declared SSOT |
| tri-106 | STILL-REAL | doc-only | `database/vectors/README.md:110` "Virtual table (`sqlite-vec`)" vs `vector-index-store.ts:807-812` plain `CREATE TABLE (id INTEGER PRIMARY KEY, vec BLOB NOT NULL)` |
| tri-108 | STILL-REAL | code-small | `utils/batch-processor.ts:143-145` `Promise.all` per batch, `:149-151` delay only between batches; `memory-index-discovery.ts:156,255,278,284,322` `readdirSync`, no yields |
| tri-109 | STILL-REAL | code-careful | `memory-ingest.ts:263-287` enqueues + poll envelope; `memory-index.ts:329` `handleMemoryIndexScan` runs inline, no enqueue/job/queue references in the handler |

## Per-Item Notes

### tri-064 — Runtime env flags missing from ENV_REFERENCE — STILL-REAL (doc-only)
`SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER` (defined `system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:6`) has zero matches in ENV_REFERENCE.md, even though ENV_REFERENCE documents 17 other `SPECKIT_CODE_GRAPH_*` vars. Fresh independent re-count of spec-memory mcp_server runtime sources (tests/stress/dist excluded): 205 distinct `SPECKIT_*` vars referenced, 40 absent from ENV_REFERENCE — including operator-impacting `SPECKIT_BOOT_FTS_AUTOHEAL` (read at `context-server.ts:382`, opt-out for boot FTS auto-heal) plus `SPECKIT_DB_LOCK_DISABLE`, `SPECKIT_DB_PATH`, causal-relation caps, and continuity-snapshot controls. No env-reference audit script exists in `scripts/`. ENV_REFERENCE's frontmatter scopes itself to the Spec Kit Memory server, so the code-graph portion is arguably a scope question, but the spec-memory-scoped 40-var gap alone sustains the finding.

### tri-065 — Fixture validation not on automated test path — STILL-REAL (code-small)
`scripts/package.json:14` `test` = `vitest run … && npm run test:legacy`; line 16 `test:legacy` = build + `test-scripts-modules.js` + `test-extractors-loaders.js`. Neither `tests/test-validation.sh` nor `tests/test-validation-extended.sh` (both still present on disk) appears in any npm script, and `mcp_server/vitest.config.ts` only includes `**/*.{vitest,test}.ts` patterns.

### tri-066 — Valid baseline fixtures fail strict validation — STILL-REAL (code-small)
Re-ran current `validate.sh --strict --quiet` today: `002-valid-level1` → `RESULT: FAILED (errors=4 warnings=2)`; `003-valid-level2` → `FAILED (errors=2 warnings=3)`; `004-valid-level3` → `FAILED (errors=2 warnings=3)`. `test-fixtures/README.md:102-104` still states "valid baseline fixtures pass strict validation". Fix is fixture regeneration or reclassification plus CI gating (pairs with tri-065).

### tri-067 — test-validation-system.js unrunnable under ESM — STILL-REAL (code-small)
Reproduced today: `node scripts/tests/test-validation-system.js` → `ReferenceError: require is not defined in ES module scope` at line 28 (`const path = require('path')`; lines 29-30 likewise), because `scripts/package.json:5` sets `"type": "module"`. Trivial `.cjs` rename or ESM conversion; wiring into the test path overlaps tri-065.

### tri-068 — README points MCP clients at backend dist instead of launcher — STILL-REAL (doc-only)
Checked for overtake by the launcher lifecycle doc reconciliation lane: this README was not fixed. `mcp_server/README.md:39` still says "`dist/context-server.js` is the entry your MCP client config points at after `npm run build`" and `:239` "Compiled MCP server used by client configuration", while `opencode.json:18-22` registers `.opencode/bin/mk-spec-memory-launcher.cjs` and `INSTALL_GUIDE.md:327` explicitly says "do not point clients at `dist/context-server.js` directly".

### tri-079 — SKILL fallback contract contradicts shipped CLI fallback — STILL-REAL (doc-only)
`system-code-graph/SKILL.md:286` (dual-stack paragraph): "use the CLI when MCP transport is missing, failed or not reconnecting while the daemon is warm". `SKILL.md:294` (Fallback Contract): "**`mk_code_index` MCP unavailable:** report the state and stop." Both verified verbatim today; the contradiction stands inside one file.

### tri-080 — Unsupported includeGlobs silently disappear — STILL-REAL (code-small)
`structural-indexer.ts:2146`: `if (!language || !config.languages.includes(language)) continue;` — unsupported-extension candidates are dropped before any ParseResult. `handlers/scan.ts:745`: `filesScanned: results.length`. Case-insensitive rg for "unsupported" in both files returns zero hits; `includeGlobs` is passed through (`scan.ts:366`) with no extension validation, so dropped candidates appear in no count, error, or warning.

### tri-081 — README overstates parser_skip_list — STILL-REAL (doc-only)
`system-code-graph/README.md:96`: "Files that fail to parse land in a quarantine skip-list." Code: `tree-sitter-parser.ts:841-846` adds to the skip-list only when `SKIP_LIST_ENABLED` and `classifyError` returns B1/B2 (caught crash cohorts); syntax-error partial parses (`:808-829`) return `parseHealth`/`parseErrors` diagnostics with no skip-list row.

### tri-084 — Docs claim daemon-time schema migration code doesn't perform — STILL-REAL (doc-only)
`feature_catalog/lifecycle-routing/schema-migration.md:21`: "The migration runs internally during daemon bring-up." `lib/lifecycle/schema-migration.ts`'s only importers are `tests/lifecycle-derived-metadata.vitest.ts:35` and `stress_test/skill-advisor/lifecycle-routing-stress.vitest.ts:18` — no daemon or production caller. `README.md:108` and `references/runtime/freshness_contract.md:132-135` both state the daemon only watches/invalidates and that SQLite mutation happens only via `advisor_rebuild`/`skill_graph_scan`. Not touched by today's advisor doc batch.

### tri-087 — Manual baseline says 52 cases, fixture has 50 — STILL-REAL (doc-only)
`manual_testing_playbook/python-compat/regression-suite.md:55` still treats "Fewer than 52 cases" as partial load; `references/hooks/skill_advisor_hook.md:227` still says "52/52 Python regression suite passed"; `mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` has exactly 50 rows (wc -l re-run today).

### tri-100 — Docs claim iteration artifacts are decay-indexed; code excludes them — STILL-REAL (doc-only)
`lib/utils/README.md:106` table row: `research/iterations/`, `review/iterations/` → "decay-only (0.2) … Indexed for discovery but penalized 5×". Code: `lib/config/spec-doc-paths.ts:22-27` lists both under `WORKING_ARTIFACT_SEGMENTS`; `:48-53` `SPEC_DISCOVERY_ONLY_EXCLUDE_DIRS` includes `'iterations'`; `memory-parser.ts:1168` requires `!isWorkingArtifactPath(...)` (helper at `spec-doc-paths.ts:73`) for spec-document classification. Iteration files are absent from retrieval, not downweighted — the README even documents this exact "decay unreachable" anti-pattern for z_archive while committing it for iterations.

### tri-102 — Known limitation documents only the FTS5 scope leak — STILL-REAL (doc-only)
021 packet `implementation-summary.md:118` (Known Limitations §3) still frames the raw `LIKE ? || '/%'` scope predicate as an FTS5-lane follow-up. The identical unescaped pattern exists in the vector lane (`vector-index-queries.ts:82-91` `appendSpecFolderScope` pushes raw `` `${specFolder}/%` ``; also `:279,540,861`) and the hybrid/keyword lane (`hybrid-search.ts:697,2148`). rg for `ESCAPE`/`escapeLike` in both files: zero hits. Exposure remains theoretical (spec-folder identifiers are charset-restricted), but the documented surface understates the shared pattern.

### tri-104 — query_hash analytics implemented but uncalled — STILL-REAL (code-small)
`lib/telemetry/consumption-logger.ts` defines `getConsumptionStats` (:239) and `getConsumptionPatterns` (:338), exported at `:512-513`. Repo-wide rg (excluding dist/node_modules) finds the names only in the defining module, its two vitest files, and spec-packet docs — zero production callers. Handlers still write consumption rows, so the table is live write-only telemetry with dormant read-side analytics.

### tri-105 — Vector storage has no declared single source of truth — STILL-REAL (code-careful)
`vector-index-mutations.ts:81-90` `writeActiveVectorPayload` dual-writes `vec_memories` (sqlite-vec) and `vec_<dim>` (BLOB payload) on every write. `embedding-reconcile.ts:4-6` header: a row "that already has both active vector surfaces (vec_memories_rowids + vec_<dim>) must not stay failed/pending/retry" — co-required, and `computeSuccessCoverage` (`:318-328`) flags a row when EITHER surface is missing. Neither surface is declared canonical-vs-derived. Architecture decision, not a quick edit.

### tri-106 — Shard README mislabels vec_<dim> as sqlite-vec virtual table — STILL-REAL (doc-only)
`database/vectors/README.md:110` table row: `vec_<dim>` → "Virtual table (`sqlite-vec`)". Implementation `vector-index-store.ts:807-812` (`ensure_vector_shard_schema`): `CREATE TABLE IF NOT EXISTS … (id INTEGER PRIMARY KEY, vec BLOB NOT NULL)` — a plain table; the sqlite-vec vec0 surface is `vec_memories`, created just below behind `sqlite_vec_available_flag`.

### tri-108 — Batching does not guarantee cooperative yielding — STILL-REAL (code-small)
`utils/batch-processor.ts:143-145` runs each batch via `Promise.all`; `:149-151` delays only BETWEEN batches. Discovery remains synchronous: `handlers/memory-index-discovery.ts` uses `fs.readdirSync` at `:156,:255,:278,:284,:322` with no `setImmediate`/async iteration. Long non-yielding stretches on large workspaces remain possible.

### tri-109 — Ingest job queue not reused for full scans — STILL-REAL (code-careful)
`handlers/memory-ingest.ts:263-287` creates a job, calls `enqueueIngestJob`, and returns a poll-able envelope pointing at `memory_ingest_status`/`memory_ingest_cancel`. `handlers/memory-index.ts:329` `handleMemoryIndexScan` executes the scan inline — rg for `enqueue|job|queue` in that handler returns nothing. The missed-reuse observation stands; generalizing the queue into a maintenance-job surface is a deliberate design change.

---
Verdict counts: STILL-REAL 17 · MOVED 0 · OVERTAKEN 0 · REFUTED 0.
Fix classes: doc-only 9 · code-small 6 · code-careful 2.
