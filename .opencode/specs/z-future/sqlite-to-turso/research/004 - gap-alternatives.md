# 004 — Per-Gap Alternative Solutions (similar-or-better)

> Host-authored alternatives pass (2026-06-10), follow-on to `research.md`. For each of the 16 gaps: candidate alternative solutions scored against today's better-sqlite3/SQLite results (quality, latency, effort, risk), with a recommended pick and decision triggers. Evidence: three parallel Fable 5 research seats (vector / FTS / SQL-surface clusters, each with codebase reads + dated web checks) plus host analysis for the seven already-mitigated gaps. Where this pass REVISES a `research.md` §11 recommendation, the delta is flagged explicitly.

---

## 1. Cross-Gap Summary

| # | Gap | Recommended alternative | Result vs today | Contingency |
|---|-----|------------------------|-----------------|-------------|
| 1 | No vector indexes | Turso-native linear scan + vector8 two-stage (flagged) | SIMILAR at 10k — exact-equal results | usearch ANN sidecar at >25-30k vectors or p95 >150ms |
| 2 | No FTS5 | **REVISED: promote in-house in-memory BM25 (packed engine + BM25F weights)** | SIMILAR→BETTER (query-time weights retained, zero drift) | minisearch 7.2 sidecar; better-sqlite3 FTS5 sidecar as last resort |
| 3 | No `.pragma()` | Native `.pragma()` + capability probe (gap refuted) | SIMILAR | `.exec('PRAGMA …')` shim — unnecessary |
| 4 | No `loadExtension()` | Subsumed by gap 1 pick (native vectors) | SIMILAR | Hybrid-keep sqlite-vec shard on separate connection |
| 5 | No UDFs | Keep logic in TypeScript (status quo carries over) | SIMILAR (identical) | Generated columns (experimental) for derived values |
| 6 | No `WITH RECURSIVE` | App-level BFS, one shared traversal helper | **BETTER** (CTE's OR-join defeats indexes; BFS est. ≤2ms) | Persistent adjacency cache at >100k edges |
| 7 | AUTOINCREMENT+MVCC | None needed (refuted; MVCC excluded anyway) | SIMILAR | UUID ids — unnecessary |
| 8 | Triggers | Keep triggers (now default-on) | SIMILAR | App-level append-only guard in the single-writer daemon |
| 9 | No VACUUM | VACUUM INTO at the two bare sites | SIMILAR→BETTER (compact + atomic-rename pattern) | Drop the VACUUMs (staging rebuild may make them redundant) |
| 10 | CDC unstable | Keep trigger-based audit now | SIMILAR | Adapter-set `capture_data_changes_conn` on the daemon's write connection (single-writer makes opt-in viable); re-score at 1.0 |
| 11 | No `backup()` | VACUUM INTO snapshots (checkpoints v2 already does this) | BETTER than file-copy (transactional + compacting) | Plain file-copy (current, still valid for local files) |
| 12 | No `recursive_triggers` | No action (SQLite default is OFF anyway) | SIMILAR (identical semantics) | App-code cascade inside `transaction(fn)` if ever needed |
| 13 | Tantivy NoMergePolicy | Mooted by gap-2 pick (no Tantivy) | BETTER (drift eliminated by construction) | Scheduled OPTIMIZE INDEX if Turso FTS adopted later |
| 14 | Window limitations | Keep TS-side ranking; `row_number()` covers the realistic SQL pattern | SIMILAR/BETTER | Correlated-subquery emulation — rejected (O(n²)) |
| 15 | libsql FTS5 bug | Structurally mooted by gap-2 pick (no FTS5 SQL inserts anywhere) | BETTER (bug class removed) | Sync `libsql` pkg — unverified, don't gate on it |
| 16 | Sync→async | Compat sync mode + error-class shim audit (`convertError` ≠ `SqliteError`) | SIMILAR→BETTER (lowest effort, txn semantics preserved) | AsyncWrapper bridge only if remote sync becomes a requirement |

**Recommendation deltas vs research.md §11:** (a) the FTS lane PRIMARY changes from "Turso FTS rewrite" to "promote the in-house in-memory BM25 channel" — Turso-Tantivy moves to a re-score trigger (exits experimental + configurable merge policy or query-time weights); (b) gap 16 gains a concrete new task: audit catch blocks for `SqliteError`/`.code` assumptions against the compat layer's `convertError` output. Everything else confirms §11.

---

## 2. Vector cluster (gaps 1 + 4) — seat A findings

**Load-bearing code fact:** today's hot path is NOT a vec0 ANN query — it is a plain JOIN computing the scalar `vec_distance_cosine` over rows surviving the metadata WHERE clauses, blended with importance decay (`vector-index-queries.ts:310-324`). Today is already an exact filtered linear scan; only the distance kernel is C-fast. The `vectorSource` seam (`tableName/embeddingColumn/idColumn/dim`, `vector-index-queries.ts:64-104`) already abstracts the swap point, and the staging-shard atomic rename (`reindex.ts:511-589`) is engine-agnostic.

| Alt | Quality | 10k / 50k latency | Effort | Verdict |
|-----|---------|-------------------|--------|---------|
| A. Turso-native scan + vector8 two-stage | IDENTICAL (f8 coarse property-tested to match f32: `core/vector/operations/distance_cos.rs:278-294`) | 50-150ms → 30-80ms two-stage / 250-750ms | 1-3d (+1-2d two-stage) | **SIMILAR — primary** |
| B. usearch ANN sidecar (hnswlib-node REJECTED — no release 12+ months) | recall .95-.99, exact via rerank; post-filter starvation edge | <10ms / <10ms | 3-6d | BETTER at scale |
| C. Hybrid-keep sqlite-vec shard (separate connection) | IDENTICAL | today+5-20ms / same wall | 2-4d | SIMILAR; strategic drag (retains better-sqlite3) |
| D. LanceDB sidecar | good | ms / ms | 5-8d | WORSE fit (0.x Node SDK churn; max ops weight for 15MB of vectors) |
| E. libSQL/Cloud DiskANN | good | ms / ms | re-scoped migration | WORSE (different product line; rewrite port turso#832 still Backlog, no milestone, 2026-06-10) |
| F. In-process Float32Array scan cache | EXACT | 5-20ms / 25-100ms | 2-4d | SIMILAR→BETTER; best as an A accelerator |

**Pick: A primary** (exact-equal results, zero new deps, shard layout + rebuild untouched). **Triggers → B:** corpus >25-30k, p95 >150ms, or pilot shows Turso scan >2× slower than sqlite-vec and F insufficient. **Trigger → C:** pilot hits Turso scan/ATTACH correctness blockers. **Standing watch:** turso#832 leaving Backlog converts A to a `CREATE INDEX` one-liner.

---

## 3. FTS cluster (gaps 2 + 13 + 15) — seat B findings

**Measured corpus:** 10,245 docs, 69.2 MB indexed text, avg content_text ~6.7 KB. **Load-bearing code facts:** the in-memory BM25 channel already exists, already syncs incrementally (`bm25-index.ts:304-357`), already fuses (`hybrid-search.ts:427-428`), and reserves an UNIMPLEMENTED `packed-inmemory` engine slot (`bm25-index.ts:53,487-493`); per-field weights are already exported (`BM25_FIELD_WEIGHTS`, `:73-78`) but the in-memory engine currently flattens fields (losing title×10). RRF fusion is rank-based, dampening absolute-score drift.

| Alt | Relevance vs FTS5+bm25(10,5,2,1) | RAM/latency @10k | Effort/Risk | Verdict |
|-----|----------------------------------|------------------|-------------|---------|
| A. Turso FTS (Tantivy) + OPTIMIZE schedule | ≈BM25 core, but weights INDEX-time (retune = reindex); per-segment drift between OPTIMIZEs | fine | Med / HIGH (experimental flag on every connection) | SIMILAR at best |
| B. Promote in-memory BM25 (packed engine + BM25F) | SIMILAR→BETTER: query-time weights retained, corpus-global IDF, zero drift; kills 2+13+15 at once | est. 60-150MB packed (current legacy engine would be 300-600MB — must implement packed), 1-5ms, warmup 2-5s non-blocking | Med / LOW (pure JS, already prod fallback) | **SIMILAR→BETTER — primary** |
| C. minisearch 7.2.0 sidecar (flexsearch/orama scored; lunr DEAD 2020) | per-field query-time boosts — best buy-not-build fidelity | ~100-250MB, <10ms | Low-med / LOW | SIMILAR |
| D. better-sqlite3 FTS5 sidecar DB | IDENTICAL by construction | = today | Low / dual-write drift + retains the native dep | SIMILAR; contingency only |
| E. Direct Tantivy Node binding | n/a — no production binding exists (all candidates dead/WIP, verified 2026-06-10) | — | own-a-napi-binding burden | WORSE — eliminate |
| F. Gap 15 | #1811 lives in libsql's TS client FTS5 insert path; under A/B/C there are NO FTS5 SQL inserts → structurally moot; under D better-sqlite3 does the writes → moot | — | — | resolved by construction |

**Pick: B primary** — validate against the existing `bm25-baseline` eval harness. **Triggers → C:** packed-engine spike RSS >~150MB or warmup >10s. **Trigger → D:** eval NDCG/recall regression neither B nor C closes. **Re-score A** when Turso FTS exits experimental with configurable merging or query-time weights.

---

## 4. SQL-surface cluster (gaps 6 + 12 + 14 + 16) — seat C findings

**Measured graph:** `causal_edges` = 10,240 rows (97% `supports`), max degree 22, avg ~6.6; `dependency_edges` = 0 rows and `memoization_records` = 0 rows — memo.ts's unbounded CTE is live code over dormant data. causal-boost's CTE is depth-capped at 2 and its recursive join (`ON ce.source_id = cw.node_id OR ce.target_id = cw.node_id`) defeats single-index use.

- **Gap 6 pick: app-level BFS** (one shared helper for `getNeighborBoosts` + `collectDependents`), snapshot-tested against CTE output pre-cutover; est. 0.5-2ms — likely FASTER than today. Upgrade → persistent adjacency cache (pattern already in-tree: `community-detection.ts:52 buildAdjacencyList`, invalidation via `sweep.ts:211`) past ~100k edges. REJECT closure tables (undirected 97%-generic-edge closure ≈ all-pairs blowup; trigger-maintained DELETE is the classic hard case). Unrolled JOINs only as a causal-boost-only stopgap (can't cover memo.ts).
- **Gap 12: no action** — SQLite's own default is `recursive_triggers=OFF`, so Turso reproduces today's effective semantics. Bites only under closure-trigger designs (rejected). If ever needed: cascade in app code inside `transaction(fn)`.
- **Gap 14: no action** — zero `OVER (` usage in production; TS-side ranking at 10-100-row result sets is microseconds; `row_number()` (which Turso has) covers the one realistic SQL-side pattern.
- **Gap 16 pick: compat sync mode** + one NEW task: audit catch blocks for `instanceof SqliteError` / `.code` string matching — compat errors come via `convertError` (`compat.ts:22,107`), not better-sqlite3's error class. AsyncWrapper only as a bridge if remote/embedded-replica sync ever becomes a requirement; full-async and worker-thread facades scored WORSE.

---

## 5. Remaining gaps (3, 5, 7, 8, 9, 10, 11) — host analysis

- **Gap 3 (.pragma()) — refuted.** Pick: native `.pragma()` plus a startup capability probe for the residual engine-level pragma gaps (probe-and-skip unsupported pragmas instead of failing init). The baseline `.exec('PRAGMA …')` rewrite is dead weight. SIMILAR.
- **Gap 5 (UDFs).** Pick: keep compute in TypeScript — that is already the architecture (zero UDF call sites), so the "alternative" is the status quo carrying over unchanged. Generated columns (`experimental: ["generated_columns"]`) are available for derived-value cases if one ever appears. SIMILAR (identical).
- **Gap 7 (AUTOINCREMENT+MVCC) — refuted, and MVCC is excluded by the FTS interaction anyway.** No alternative needed; the baseline UUID contingency is retired. SIMILAR.
- **Gap 8 (triggers).** Pick: keep the mutation-ledger append-only triggers (now default-on, `RAISE(ABORT)` works). Contingency: because the daemon is the single writer, an app-level append-only guard in the one write path would be equivalent — and sidesteps both the `INSTEAD OF` hole and the changes()-inside-triggers counter caveat. SIMILAR, with a cheaper escape hatch than baseline assumed.
- **Gap 9 (VACUUM).** Pick: substitute `VACUUM INTO` + rename at the two bare-VACUUM sites (`db-shard-migration.ts` ~:274/:282) — same compaction result via the atomic-rename pattern the codebase already trusts. Plausible simplification worth testing in the pilot: those VACUUMs may be redundant entirely, since shard rebuilds already write fresh staging files. SIMILAR→BETTER.
- **Gap 10 (CDC).** Pick: keep trigger-based audit now. Two genuinely viable upgrades the baseline didn't have: (a) the 027 statediff layer is an app-level change-capture mechanism already in production — extending it is a TS-only path to richer audit; (b) the per-connection opt-in objection weakens in this architecture — the daemon owns the only write connection, so the adapter could set `capture_data_changes_conn` once at connect. Both stay behind the 1.0 re-score trigger. SIMILAR now, credible BETTER later.
- **Gap 11 (backup()/serialize()).** Pick: `VACUUM INTO` snapshots — checkpoints v2 already ships this (`checkpoints.ts:2281-2284`), and it is BETTER than the baseline file-copy workaround (transactional, compacting, no torn-copy risk on a live WAL). File-copy remains valid for cold local files.

---

## 6. Consolidated decision triggers

| Trigger | Fires | Action |
|---------|-------|--------|
| Corpus >25-30k vectors OR vector p95 >150ms | gap 1 | Add usearch sidecar (B) |
| turso#832 (DiskANN in rewrite) leaves Backlog | gaps 1/4 | Replace scan with native `CREATE INDEX` |
| Packed-BM25 spike: RSS >150MB or warmup >10s | gap 2 | Switch to minisearch sidecar |
| Lexical eval regression beyond threshold | gap 2 | Fall back to better-sqlite3 FTS5 sidecar |
| Turso FTS exits experimental w/ merge policy or query-time weights | gaps 2/13 | Re-score Turso-Tantivy as native end-state |
| causal_edges >~100k or traversal in profiles | gap 6 | Promote BFS to persistent adjacency cache |
| Remote/embedded-replica sync becomes a requirement | gap 16 | AsyncWrapper bridge → staged async |
| Turso 1.0 + CDC maturity | gap 10 | Re-score CDC (adapter-set pragma on the single write connection) |

Pilot test additions from this pass: error-class shim audit (`convertError` vs `SqliteError`), bare-VACUUM redundancy check, packed-BM25 RAM/warmup spike, BFS-vs-CTE snapshot equivalence.

<!-- ANCHOR:sources -->
## 7. Sources

- Seat evidence: `iterations/`-grade citations inline above — vendored `external/turso-main` (core/vector/operations/distance_cos.rs, COMPAT.md:88, compat.ts:22-193), live code (`vector-index-queries.ts:64-324`, `reindex.ts:511-589`, `bm25-index.ts:53-510`, `hybrid-search.ts:427-1532`, `community-detection.ts:52`, `sweep.ts:211`, `checkpoints.ts:2281-2284`), live DB measurements (context-index.sqlite: 10,245 docs / 69.2MB text / 10,240 causal edges, max degree 22, dependency_edges=0).
- Web (2026-06-10): https://github.com/tursodatabase/turso/issues/832 (DiskANN port: Backlog) · https://github.com/tursodatabase/turso/issues/3778 (SIMD brute-force suggestion) · https://www.npmjs.com/package/usearch (active, v2.25.x) · hnswlib-node via Snyk advisor (dormant 12+ months) · https://www.npmjs.com/package/@lancedb/lancedb (0.30.0, Node SDK still 0.x) · npm registry: minisearch 7.2.0 / flexsearch 0.8.212 / @orama/orama 3.1.18 / lunr dead 2020 · https://github.com/tursodatabase/libsql/issues/1811 (OPEN) · https://github.com/asg017/sqlite-vec/releases (0.1.10a4, May 2026).
- Companions: `research.md` (verdict matrix §9), `../context/context-report.md` (blocker map).
<!-- /ANCHOR:sources -->
