# Research: SQLite-to-Turso Revalidation (v0.5.0 baseline → v0.7.0-pre.6)

> Canonical output of the deep-research loop (session `res-20260610-1626-sqlt`, 17 working iterations in 6 waves, Fable 5 @ xhigh). Baseline docs 001–003 remain frozen as the v0.5.0 comparison baseline; this document carries every verdict delta. Companion deliverable: `../context/context-report.md` (Phase A live-code blocker map, 396 findings).

## 1. Executive Summary

The migration picture improved materially between Turso v0.5.0 and v0.7.0-pre.6, and the baseline's headline survives in smaller form: the HARD blocker set shrinks from four to **three — no native vector index (gap 1), no FTS5 surface (gap 2), no WITH RECURSIVE (gap 6)**. Two baseline gaps are outright REFUTED (gap 3 `.pragma()` — the JS SDK now implements it; gap 7 AUTOINCREMENT-under-MVCC — fixed via atomic sequences), four CHANGED for the better (triggers default-on; VACUUM INTO unconditional; CDC pragma stabilized; a shipped better-sqlite3-compatible **sync compat mode** that defuses the sync→async rewrite), and one CHANGED for the worse (window functions are row_number-only — less than the baseline assumed). The Phase A context report's blocker map overstated reality: nine of its blocker claims were refuted by source-level verification (no-ATTACH, no-VACUUM-INTO, no-triggers, no-.pragma(), full-async-required, lease-redesign-required, plus three pragma-introspection claims). The strategic recommendation changes accordingly: baseline Path A (libSQL stepping stone) is **demoted**; the winner is **Path C-prime — DatabaseAdapter ports + de-SQLite-ism pre-work now, a compat-mode pilot behind the adapter, full migration gated on Turso 1.0 signals** (which do not exist yet: latest release IS the vendored v0.7.0-pre.6; the in-tree FAQ says Turso is below the SQLite reliability bar).

## 2. Method & Provenance

- **Loop shape**: official deep-research loop, host-written state, 17 working iterations batched into 6 waves of ≤3 concurrent read-only seats on disjoint questions (W1–W3 clusters C1–C8, W4 deep-dives, W5 adversarial verification, W6 pivot-resolution + closure).
- **Executor**: Fable 5 (`claude-fable-5`) at `--effort xhigh` via the claude2 account for iterations 1–15; iterations 16–17 ran as **native Fable 5 seats** after the claude2 session limit hit (executor fallback logged in `deep-research-state.jsonl`; native is the loop's default executor, model unchanged).
- **Evidence base**: the vendored `external/turso-main` tree at v0.7.0-pre.6 (primary; COMPAT.md cross-checked against core translation code, tests, and JS bindings), the three skills' production code, the Phase A context report, and host-gathered web evidence (`host-web-evidence.md` — the seats run without web access).
- **Verification chain**: every CHANGED/REFUTED verdict was adversarially re-verified in W5 from independent source files (deliberately avoiding COMPAT.md and prior citations). W5 itself produced one false overturn (ATTACH "not JS-enableable") that W6 corrected with test-level evidence — both directions of the chain are recorded in iterations 013 and 016.

## 3. Problem Context

Three daemon skills run on better-sqlite3 ^12.6.2: system-spec-kit (hybrid memory search: sqlite-vec KNN + FTS5 BM25 + recursive-CTE causal graph + 027-era incremental-index/statediff/tombstones), system-code-graph (AST graph, single-writer WAL), system-skill-advisor (skill graph + heartbeat lease DB). The baseline research (Turso v0.5.0) catalogued 16 gaps and recommended a phased libSQL path. Since then both sides moved: Turso shipped two stable lines (0.6.0, 0.6.1) plus the 0.7.0-pre series, and packet 027 grew the storage surface.

## 4. C1 — Driver/API Surface (gaps 3, 4, 5, 11, 16 + ATTACH)

- `.pragma()` exists in BOTH JS API flavors (async `promise.ts:410-421`, sync compat `compat.ts:148-159`) — **gap 3 REFUTED**. Engine-level pragma support is broad: `journal_mode`, `user_version`, `quick_check`, `integrity_check`, `database_list`, `table_info`, `busy_timeout` all work; `wal_checkpoint(PASSIVE|FULL|RESTART|TRUNCATE)` parses and passes tests (`core/translate/pragma.rs:891-917`, `core/storage/wal.rs:153-167`); `synchronous` accepts OFF/NORMAL/FULL with unrecognized values coerced to FULL (`core/translate/pragma.rs:650-672`). Schema-qualified PRAGMA against attached DBs works end-to-end (`PRAGMA aux.wal_checkpoint(TRUNCATE)` test, `core/connection.rs:4585-4587`).
- `loadExtension()` and UDF registration (`function()`/`aggregate()`/`table()`) remain absent — **gaps 4/5 UNCHANGED**; sqlite-vec can never load; native vectors are the only path.
- `backup()`/`serialize()` remain absent — **gap 11 UNCHANGED** — but moot: zero call sites exist and spec-kit checkpoints already snapshot via `VACUUM ... INTO`.
- **Gap 16 CHANGED-better (HIGH → MEDIUM)**: `@tursodatabase/database` ships a better-sqlite3-compatible sync `./compat` export with `transaction(fn)` + `.deferred/.immediate/.exclusive` (`compat.ts:116-144`). The sync `.transaction()` wrappers across causal-edges/ensure-ready/lease survive a swap. The compat not-implemented surface (backup, serialize, function, aggregate, table, loadExtension) has **zero production call sites** outside the vector layer (independently re-verified twice, iterations 10 and 15).
- **ATTACH/DETACH (new item, not a baseline gap)**: SQL-level ATTACH is experimental-gated (`--experimental-attach`, `core/translate/attach.rs:21-25`) but **JS-enableable** via `connect(path, { experimental: ["attach"] })` → `with_attach(true)` (`bindings/javascript/src/lib.rs:283`), with passing in-tree tests in both promise and compat APIs. Limits: not in the WASM package; the sync-SDK packages hardcode `experimental: None`. The full JS-enableable experimental list: views, custom_types, encryption, index_method, autovacuum, vacuum, attach, generated_columns, multiprocess_wal, without_rowid.

## 5. C2/C3 — Vector and FTS Layers (gaps 1, 2, 13, 15)

- **Gap 1 UNCHANGED**: no native vector index — `vector_distance_cos` is a scalar function, every search a linear scan; the only index-method modules registered are btree, fts, and a toy sparse-IVF (`core/index_method/mod.rs:14-17`). No post-vendor GA either (host web check). Mitigations strengthened: Turso's dense f32 blob is byte-identical to sqlite-vec's (raw LE f32, dims×4, no header — `core/vector/vector_types.rs:520`), distance semantics match (1 − cosine), so **data migrates without re-embedding**; quantized two-stage scan (`vector8` coarse + exact rerank) is a new cost lever. Concrete `vec_memories` replacement DDL + KNN rewrite drafted in iteration 011; the FLOAT[dim]-regex dimension-discovery fallback in `vector-index-store.ts` needs replacing.
- **Gap 2 UNCHANGED (nuanced)**: FTS5 permanently absent ("Use Turso FTS instead"); Turso FTS is Tantivy-backed, experimental behind `index_method` (JS-enableable per-connection), with `fts_match/fts_score/fts_highlight` first-class. Replacement design for `memory_fts` + its 3 sync triggers drafted in iteration 011. Adoption risk: the flag is per-connection — any process opening the DB without it breaks on the index.
- **Gap 13 UNCHANGED**: NoMergePolicy unconditional (`core/index_method/fts.rs:2956`); scheduled `OPTIMIZE INDEX` required (a bare `OPTIMIZE INDEX;` now covers all FTS indexes). Ranking drift vs FTS5 expected: weights are index-time (`WITH (weights=...)`) not query-time bm25() arguments, and per-segment BM25 stats under NoMergePolicy add variance (mechanism inferred, flagged medium-confidence).
- **Gap 15 UNCHANGED**: libsql#1811 (TypeScript client FTS5 parameterized-insert panic) verified **OPEN** on the web as of 2026-06-10 — relevant only to the demoted Path A.

## 6. C4/C5 — SQL Surface and Concurrency (gaps 6, 7, 8, 12, 14 + MVCC/WAL)

- **Gap 6 UNCHANGED**: `WITH RECURSIVE` hard-rejected at parse time; non-recursive CTEs are solid and optimized. Live dependency: `causal-boost.ts` and `memo.ts` (baseline's line anchors are stale). App-side BFS rewrite promoted to P1.5 pre-work (~2–4 days, pays off on any path).
- **Gap 7 REFUTED**: AUTOINCREMENT works under MVCC via hidden atomic sequences (`__turso_internal_autoincrement_<table>`), multiple passing tests.
- **Gap 8 CHANGED-better**: CREATE/DROP TRIGGER fully supported by default including `RAISE(ABORT)` — the 027 mutation-ledger append-only triggers survive as-is. Residual holes: `INSTEAD OF` rejected; `changes()`/`total_changes()` reliable for plain DML (test-verified) but suspect inside trigger sub-statements. ~60 `.changes` call sites split into tolerant reporting counters vs a few control-flow dependencies (pilot test item).
- **Gap 12 UNCHANGED** (recursive_triggers off — irrelevant, ours are one level deep). **Gap 14 CHANGED-worse**: only `row_number()` and default-frame aggregates-OVER execute; the rest of the WindowFunc enum is dormant plumbing. Zero production usage, so impact stays LOW.
- **MVCC**: experimental journal mode; **mutually exclusive with custom index methods, hence with Turso FTS** (`core/translate/index.rs:65-67`) — MVCC is effectively off the table for spec-kit, which is acceptable (no flow needs BEGIN CONCURRENT). Multi-process WAL coordination shipped as experimental opt-in (`.tshm` sidecar) — the daemon/lease single-writer model **survives and remains required**. Contention errors surface as `Busy`/`BusySnapshot` (no SQLITE_BUSY symbol in JS); the `runDaemonStateMutation` retry predicate needs a rewrite, with native `busy_timeout` available.

## 7. C6 — Ops, Lifecycle, Stability (gaps 9, 10)

- **Gap 9 CHANGED-better**: `VACUUM INTO` works unconditionally, **including schema-qualified `VACUUM active_vec INTO`** (the main-only rejection applies solely to bare in-place VACUUM, which stays experimental and is also rejected under multiprocess WAL). The two bare-VACUUM sites in `db-shard-migration.ts` (~:274/:282) substitute cleanly. Constraint: VACUUM INTO refuses to run inside an open transaction.
- **Gap 10 CHANGED-better (MEDIUM → MEDIUM-LOW)**: CDC pragma stabilized as `capture_data_changes_conn` (modes off/id/before/after/full, default capture table `turso_cdc`), but per-connection opt-in default-off — still not a drop-in replacement for the trigger-based audit trail.
- **Stability**: release cadence is healthy (0.4.0 → 0.5.0 → 0.6.0 → 0.6.1 + 0.7.0-pre series; the vendored pre.6 IS the latest tag as of 2026-06-10). The in-tree FAQ: Turso "powers production apps today" but is explicitly below the SQLite reliability bar; libSQL is the production-ready sibling; **no 1.0 timeline signal**. Corruption-class fixes were still landing in the 0.6.0 cycle.

## 8. C7/C8 — Strategy Re-Score and Spec-Kit Touchpoints

- **Path A (SQLite → libSQL → Turso): DEMOTED** to conditional/cloud-sync-only. Its core sale — preserving a sync better-sqlite3 API during transition — is now provided natively by Turso's compat mode; the libSQL leg adds maintenance-mode risk and keeps gap 15 alive.
- **Path B (LanceDB hybrid)**: unchanged trigger condition (>10k memories / p95 breach) with raised integration cost (statediff/tombstone split-brain risk).
- **Path C-prime (winner)**: DatabaseAdapter reshaped to **five divergence ports** (vector store, FTS, recursive traversal, maintenance/VACUUM family, contention/retry), upsized to ~1,200–2,000 LOC across ~127 production files; de-SQLite-ism pre-work (BFS rewrite, dimension discovery, retry predicate); then a Turso compat-mode pilot behind the adapter with `experimental: ["attach", "index_method"]`; full migration gated on four 1.0 signals (Tantivy stable + MVCC-coexistent, WITH RECURSIVE or BFS shipped, window parity audit, CDC maturity).
- **Shard architecture**: keep ATTACH (option a) — near-zero effort, preserves the cross-schema KNN join on the hottest path and `VACUUM active_vec INTO` snapshots; separate-connections (option b) is the contingency if experimental attach proves unstable under write load.
- **027 additions create no new SQL-surface gaps**: incremental-index uses plain parameterized SQL + `PRAGMA table_info`; statediff has zero SQL; tombstones are a plain rowid table. The single genuinely new 027-era exposure is `run().changes` reliability in trigger contexts. Revised effort estimates: adapter 1–2 weeks; compat-mode pilot swap 2–4 days mechanical; full async migration deferrable entirely.

## 9. Per-Gap Verdict Matrix (authoritative)

| # | Gap | Baseline severity | v0.7.0-pre.6 verdict | Revised workaround / severity |
|---|-----|-------------------|----------------------|-------------------------------|
| 1 | No vector indexes | CRITICAL at scale / LOW now | UNCHANGED | Brute-force + quantized two-stage; blob format migrates as-is |
| 2 | No FTS5 (Tantivy) | HIGH | UNCHANGED (nuance: JS-enableable, MVCC-exclusive) | Turso-FTS rewrite + in-memory BM25 fallback; HIGH stands |
| 3 | No `.pragma()` | HIGH | **REFUTED** | Drop to LOW (residual = engine-level pragma gaps) |
| 4 | No `loadExtension()` | CRITICAL / N/A | UNCHANGED | Native vectors mandatory |
| 5 | No `function()`/`aggregate()` | LOW | UNCHANGED | Keep logic in TypeScript; no UDF escape hatch for bm25 emulation |
| 6 | No `WITH RECURSIVE` | HIGH | UNCHANGED | App-side BFS promoted to P1.5 pre-work |
| 7 | AUTOINCREMENT + MVCC | MEDIUM | **REFUTED** | Drop to LOW |
| 8 | Triggers + MVCC | MEDIUM | CHANGED-better | Keep triggers; LOW outside MVCC; INSTEAD OF still rejected |
| 9 | No VACUUM | LOW | CHANGED-better | VACUUM INTO path unblocked (incl. schema-qualified) |
| 10 | CDC unstable | MEDIUM | CHANGED-better | Keep triggers for now; MEDIUM-LOW |
| 11 | No `backup()`/`serialize()` | LOW | UNCHANGED | File-copy/VACUUM INTO; zero call sites |
| 12 | No `recursive_triggers` | LOW | UNCHANGED | No action needed |
| 13 | Tantivy NoMergePolicy | MEDIUM | UNCHANGED | Scheduled OPTIMIZE; ranking-drift compensation at index time |
| 14 | WINDOW limitations | LOW | **CHANGED-worse** | TypeScript ranking; zero usage so LOW stands |
| 15 | libsql FTS5 param bug | MEDIUM (libSQL path) | UNCHANGED (issue OPEN) | Sync libsql package required on any libSQL path |
| 16 | Sync→async shift | HIGH / MITIGATED | **CHANGED-better** | Compat mode; HIGH → MEDIUM; adapter = 5 divergence ports |

## 10. Parameter & Effort Reference

| Move | Baseline estimate | Revised estimate | Driver |
|------|-------------------|------------------|--------|
| DatabaseAdapter (P0) | 500–800 LOC | 1,200–2,000 LOC / 1–2 weeks | 027 surface growth; ports model; ~127 prod files |
| libsql swap | 1–2 days | 2–4 days mechanical | Only if Path A revived |
| Turso compat-mode pilot | 2–3 weeks (as "compat mode") | 2–4 days mechanical behind adapter | Zero not-implemented call sites; ATTACH + index_method flags |
| Full async migration | 4–6 weeks | Deferrable entirely | Compat mode removes the forcing function |
| BFS rewrite of recursive CTEs (P1.5) | n/a | 2–4 days | Path-independent de-SQLite-ism |
| Vector scaling cliff | 10k marginal / 50k no | Unchanged | Linear scan; quantized two-stage extends headroom |

## 11. Recommendations

1. **Adopt Path C-prime.** Build the five-port DatabaseAdapter now; it pays off regardless of backend and is the precondition for any pilot.
2. **Do the de-SQLite-ism pre-work now**: BFS rewrite (causal-boost, memo), dimension-discovery replacement, `Busy/BusySnapshot` retry predicate, `.changes` control-flow audit.
3. **Run a compat-mode pilot behind the adapter** with `experimental: ["attach", "index_method"]` on a copy of a production DB; test list: cross-attached write transactions, `VACUUM active_vec INTO` under load, trigger `changes()` semantics, Tantivy ranking drift vs FTS5 on the live corpus.
4. **Keep the shard architecture (ATTACH option a)**; fall back to separate connections only if experimental attach fails under write load.
5. **Do not migrate production before Turso 1.0 signals** (four gates in §8); re-run the stability sweep (open corruption-issue census) before any go/no-go.

> **Post-synthesis addendum (2026-06-10):** a follow-on alternatives pass (`004 - gap-alternatives.md`) scored 2-6 alternatives per gap. It confirms recommendations 1-5 with one revision: the FTS lane primary changes from the Turso-Tantivy rewrite to **promoting the in-house in-memory BM25 channel** (packed engine + BM25F field weights — resolves gaps 2/13/15 at once, keeps query-time weights); Turso FTS moves to a re-score trigger. It also adds two pilot tasks: the `convertError`-vs-`SqliteError` catch-block audit and a bare-VACUUM redundancy check.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Path A as primary (libSQL stepping stone) | Compat mode removes its core value; maintenance-mode risk; gap 15 open | iteration 7 matrix; HOST-WEB item 1 | 7, 12, 17 |
| Full sync→async rewrite as a precondition | `./compat` ships sync transactions; zero not-implemented call sites | compat.ts:116-144; iterations 10/15 greps | 1, 10, 15 |
| W3a mechanical `.exec('PRAGMA …')` rewrite | `.pragma()` method exists in both APIs | promise.ts:410-421; compat.ts:148-159 | 1, 13 |
| UUID fallback for AUTOINCREMENT under MVCC | Atomic sequences fix shipped | core/mvcc/database/tests.rs:10415-10436 | 5, 14 |
| Replacing mutation-ledger triggers pre-migration | Triggers fully supported by default | core/translate/trigger.rs:143-173 | 4, 8, 14 |
| Shard consolidation into main DB (option c) | Regression vs canonical-slimming design | db-shard-migration.ts:17-47 | 16 |
| Separate-connections shard model (option b) as primary | Hottest KNN path is a cross-schema SQL join | vector-index-queries.ts:311-324 | 16 |
| "FTS promoted to stable by 0.7.0-pre.6" | Explicitly experimental-gated via index_method | experimental-features.mdx:19 | 3 |
| "Turso will never support multi-process" | .tshm sidecar shipped (experimental opt-in) | core/storage/shared_wal_coordination.rs | 5, 14 |
| MVCC adoption for spec-kit | Mutually exclusive with Turso FTS | core/translate/index.rs:65-67 | 5, 12, 14 |

## 12. Open Questions

1. ATTACH operational semantics under the experimental flag (cross-attached write-transaction scope, WAL behavior of the attached shard) — pilot-phase empirical test.
2. `changes()`/`total_changes()` exact mis-count semantics inside trigger sub-statements — read `trigger_exec.rs` n_change handling; pilot test list.
3. Per-segment BM25 drift magnitude under NoMergePolicy — targeted read of the fts.rs scoring path; corpus A/B during pilot.
4. Open corruption-class issue census on the Turso tracker — host web sweep before any pilot go/no-go.
5. libSQL maintenance-mode status — only if Path A is reconsidered for cloud sync.
6. MVCC × trigger interaction — moot for spec-kit (MVCC excluded by FTS), document only.

## 13. Risks & Caveats

- Everything load-bearing (ATTACH, index_method/FTS, multiprocess WAL, in-place VACUUM, MVCC) sits behind experimental flags — the pilot must treat flag-gated behavior as unstable API.
- The vendored tree is a pre-release; verdicts are pinned to v0.7.0-pre.6 (confirmed latest at synthesis time) and decay as upstream moves.
- Tantivy ranking drift vs FTS5 is real and partially unquantified; retrieval-quality evals (spec-kit's eval harness) must gate the FTS swap.
- Single-account quota exhaustion forced a native-executor fallback for iterations 16–17 (same model; logged); no evidence-quality impact identified.

## 14. Evidence Quality & Verification Status

| Cluster | Confidence | Dominant evidence |
|---------|------------|-------------------|
| C1 driver/API | HIGH | vendored source, adversarially re-verified |
| C2 vector | HIGH | vendored source + web corroboration |
| C3 FTS + gap 15 | HIGH (BM25-drift clause MEDIUM) | vendored source; gap 15 via web |
| C4 SQL surface | HIGH | vendored source, double-verified |
| C5 MVCC/WAL | HIGH (MVCC×trigger MEDIUM) | vendored source |
| C6 ops/stability | HIGH mechanics / MEDIUM outlook | vendored source; web partial |
| C7 strategy | MEDIUM-HIGH | grounded inference |
| C8 027 surface | HIGH | exhaustive repo greps with sanity checks |

Verification chain note: W5 adversarial seats re-derived every CHANGED/REFUTED verdict from independent files; W5's own ATTACH overturn was itself overturned by W6 with test-level evidence (grep-identifier artifact). Two iteration-1 claims (wal_checkpoint(TRUNCATE), synchronous=NORMAL) were corrected by later source-level reads — both now resolved with high confidence.

<!-- ANCHOR:sources -->
## 15. Sources

- Vendored: `external/turso-main/` @ v0.7.0-pre.6 — COMPAT.md, CHANGELOG.md, core/translate/{pragma,attach,vacuum,trigger,index}.rs, core/mvcc/database/tests.rs, core/index_method/fts.rs, core/vector/, core/storage/{wal,shared_wal_coordination}.rs, bindings/javascript/{src/lib.rs,packages/common/{promise,compat}.ts,packages/native/*.test.ts}, docs/, README FAQ.
- Live code: `.opencode/skills/{system-spec-kit,system-code-graph,system-skill-advisor}/mcp_server/lib/**` (see `../context/context-report.md`).
- Baseline: `research/001–003` (frozen, v0.5.0).
- Web (host-gathered, 2026-06-10): `host-web-evidence.md` — https://github.com/tursodatabase/libsql/issues/1811 (OPEN); https://github.com/tursodatabase/turso/releases (pre.6 latest); https://turso.tech/vector (cloud product line).
- Resource map: `resource-map.md` (reducer-emitted).
- Iteration narratives: `iterations/iteration-001..017.md`.
- Alternatives pass: `004 - gap-alternatives.md` (per-gap alternative solutions, scored; one FTS-lane revision).
<!-- /ANCHOR:sources -->

## 16. Glossary

- **Compat mode** — `@tursodatabase/database`'s `./compat` export: synchronous better-sqlite3-shaped API.
- **index_method** — Turso's experimental pluggable index extension point; Turso FTS (Tantivy) ships as one.
- **NoMergePolicy** — Tantivy writer policy disabling automatic segment merges; requires manual `OPTIMIZE INDEX`.
- **.tshm sidecar** — shared-memory file backing experimental cross-process WAL coordination.
- **C-prime** — revised Path C: adapter + pre-work + compat pilot now, full migration at 1.0 signals.
- **Five divergence ports** — adapter seams where Turso genuinely differs: vector store, FTS, recursive traversal, maintenance/VACUUM, contention/retry.

## 17. Appendix — Convergence Report

- Stop reason: converged (all charter clusters answered or explicitly carried; W5 adversarial pass completed; W6 closure produced the authoritative verdict set)
- Total iterations: 17 working (of maxIterations 22; reserve unused)
- Questions answered: 24 charter questions (C1a–C8a) answered; 6 residual items carried to §12 with named next actions
- Waves: W1 1–3 (C1–C3) · W2 4–6 (C4–C6) · W3 7–9 (C7–C8+leftovers) · W4 10–12 (deep-dives) · W5 13–15 (adversarial) · W6 16–17 (pivot resolution + closure)
- newInfoRatio trajectory: 0.722/0.563/0.438 · 0.429/0.778/0.750 · 0.850/0.389/0.813 · 0.857/0.857/0.857 · 0.429/0.063/0.071 · 1.000/0.550 — the W5 trough is the expected adversarial-confirmation signature; the W6 spike is the ATTACH pivot resolution
- Convergence threshold: 0.05 (newInfoRatio); never breached for 2 consecutive iterations before the charter completed
- Executor: cli-claude-code (claude2) iterations 1–15; native fallback 16–17 (session limit; same model)
