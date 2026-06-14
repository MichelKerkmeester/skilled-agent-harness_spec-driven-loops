# Iteration 17: W6 closure: final per-gap verdict table and remaining checkboxes

## Focus
Closure pass producing the authoritative per-item verdict set for synthesis: one final row per catalog gap (research/003, 16 gaps) incorporating the W5 adversarial corrections (iterations 13-15) plus the host-gathered web evidence (gap 15 issue OPEN; vendored v0.7.0-pre.6 IS the latest release). Also re-scored the non-gap baseline items (paths A/B/C, P0-P4 ladder, the baseline docs' open-question equivalents), enumerated the genuinely unresolved key questions after iterations 1-16, and assigned per-cluster confidence. Evidence base: iterations 1-15, host-web-evidence.md, and the frozen baseline docs 001-003.

## Findings
- KNOWN — Q1 verdict table complete (below): of 16 gaps, 2 clean REFUTED (gaps 3, 7), 4 CHANGED-better (8, 9, 10, 16), 1 CHANGED-worse (14), 9 UNCHANGED (1, 2, 4, 5, 6, 11, 12, 13, 15). The baseline's "only 4 truly blocking" headline survives with the same four members (1, 2, 6, 16) but gap 16's severity drops to MEDIUM via the shipped compat mode, leaving the real HARD blocker set at three: vector index, FTS5 surface, WITH RECURSIVE — matching iteration 7's blocker-map correction.
- NEW — Gap 3 and gap 7 are the two clean REFUTED rows: `.pragma()` exists in both Turso JS APIs (iteration 13 CLAIM-1 [SOURCE: bindings/javascript/packages/common/promise.ts:410-421; compat.ts:148-159]), and AUTOINCREMENT works under MVCC via atomic sequences with passing tests (iterations 5+14 [SOURCE: core/mvcc/database/tests.rs:10415-10436; core/schema.rs:184-189]).
- NEW — Gap 14 is the sole CHANGED-worse: only row_number() plus default-frame aggregates OVER work — the fuller WindowFunc enum is dormant plumbing with no VDBE execution arms (iteration 14 CLAIM-8 [SOURCE: core/function.rs:1580; core/vdbe/execute.rs:6396,6428; COMPAT.md:132]). Impact stays LOW (zero production usage, iteration 12 sweep).
- PARTIAL — The iteration-13 ATTACH discovery does not change any of the 16 gap rows (ATTACH was never a catalog gap) but adds the one open caveat on the C-prime path — resolved by the concurrent iteration 16 fallout sweep (JS-enableable via experimental flag; recommendation (a) keep ATTACH).
- KNOWN — Q2 paths: Path A stays DEMOTED (conditional, cloud-sync-only), Path B stays conditional (>10k memories / p95 breach), C-prime (adapter + de-SQLite-ism pre-work + compat pilot) remains the winner — the ATTACH gate does not flip any matrix row. Verdict: C-prime confirmed.
- KNOWN — Q2 P0-P4 ladder final: P0 adapter KEEP/reshape to five divergence ports, upsized to 1,200-2,000 LOC over ~127 prod files; P1 REPLACED by "Turso compat-mode pilot behind adapter"; NEW P1.5 app-side BFS rewrite of the two recursive CTEs (~2-4 days, path-independent); P2 vector benchmark KEEP gated; P3 full-migration KEEP with four explicit 1.0 gates (Tantivy stable AND MVCC-coexistent; WITH RECURSIVE or BFS done; window parity audit; CDC maturity); P4 LanceDB KEEP conditional.
- NEW — Q2 baseline open-question sets: none of docs 001/002/003 contains a literal "Open Questions" section; functional equivalents are 001 §7 Current Limitations and 002 §5 Risks. Dispositions: 001 §7 beta-stability — CARRIED (still pre-1.0; latest stable v0.6.1 [HOST-WEB: Item 2]); no-vector-indexes — CONFIRMED UNCHANGED; no-FTS5 — CONFIRMED UNCHANGED; MVCC restrictions — PARTIALLY REFUTED (AUTOINCREMENT fixed; custom index modules/FTS still excluded [SOURCE: core/translate/index.rs:65-67]); query-language gaps — CONFIRMED with the gap-14 worsening. 002 §5: brute-force scaling — CARRIED unchanged; Tantivy weighted scoring — CONFIRMED (weights index-time only [SOURCE: core/index_method/fts.rs:1377-1386]); beta stability — CARRIED; async scope — ANSWERED (compat mode makes full async deferrable); NoMergePolicy maintenance — CONFIRMED UNCHANGED. 002 §4 P1 libSQL-evaluation questions — ANSWERED for Turso directly (sync: yes via compat; sqlite-vec: permanently no).
- KNOWN — Q3 carried items resolved by host: gap 15 web status CLOSED-as-OPEN (tursodatabase/libsql#1811 open 2026-06-10, no fix PR [HOST-WEB: Item 1]); post-vendor releases CLOSED (v0.7.0-pre.6 of Jun 9 is the newest tag [HOST-WEB: Item 2]).
- NEW — Q3 residual unresolved items after iterations 1-16: six, listed below; none blocks synthesis.
- KNOWN — Q4 confidence: C1/C2/C4/C8 high on vendored-source evidence; C3 high except the per-segment BM25-drift sub-clause (inference); C5 high except the MVCC-x-trigger interaction (indirect); C6 high on mechanics, medium on production-stability outlook; C7 medium-high.

### Q1 — Final per-gap verdict table (16 rows)

| # | Gap | Baseline severity | v0.7.0-pre.6 verdict | Evidence (one line) | Revised workaround / severity |
|---|-----|-------------------|----------------------|---------------------|-------------------------------|
| 1 | No vector indexes | CRITICAL at scale / LOW now | UNCHANGED | Only b-tree/FTS/toy sparse-IVF registered; vector_distance_cos is a scalar fn = linear scan [SOURCE: core/index_method/mod.rs:14-17; core/vector/mod.rs:122-133]; no post-vendor vector GA [HOST-WEB: Item 2] | W1a brute-force + quantized two-stage; CRITICAL-at-scale/LOW-now stands |
| 2 | No FTS5 (Tantivy) | HIGH | UNCHANGED (nuance) | FTS5 still absent [SOURCE: COMPAT.md:1084]; Turso FTS experimental but JS-SDK-enableable via experimental: ["index_method"] [SOURCE: bindings/javascript/src/lib.rs:273-280]; MVCC-exclusive [SOURCE: core/translate/index.rs:65-67] | W2a/W2b + pilot fallback to in-memory BM25 engine; HIGH stands |
| 3 | No .pragma() | HIGH | REFUTED | Implemented in async AND sync compat APIs [SOURCE: promise.ts:410-421; compat.ts:148-159] | W3a rewrite unnecessary; drop to LOW (residual = engine-level pragma gaps) |
| 4 | No loadExtension() | CRITICAL (sqlite-vec) / N/A | UNCHANGED | compat.ts throws not-implemented [SOURCE: compat.ts:168-194]; mitigation strengthened: f32 blob layout byte-identical to sqlite-vec, cosine semantics match [SOURCE: core/vector/vector_types.rs:520] | W4a native vectors mandatory; severity unchanged |
| 5 | No function()/aggregate() | LOW | UNCHANGED | Still throws; zero production call sites, double-verified [iters 10, 15] | W5a keep TypeScript; LOW stands; no UDF escape hatch for bm25 emulation |
| 6 | No WITH RECURSIVE | HIGH | UNCHANGED | Parse-time bailout in two planner paths, no changelog progress [iter 4]; hits causal-boost.ts + memo.ts | W6b app-side BFS, promoted to P1.5 pre-work; HIGH stands |
| 7 | AUTOINCREMENT + MVCC | MEDIUM | REFUTED | Works via atomic sequences __turso_internal_autoincrement_*, passing tests [SOURCE: core/mvcc/database/tests.rs:10415-10436] | UUID contingency unnecessary; drop to LOW |
| 8 | Triggers + MVCC | MEDIUM | CHANGED-better | Triggers default-on incl. RAISE(ABORT) [SOURCE: core/translate/trigger.rs:143-173; CHANGELOG.md:338]; changes() suspect only in trigger sub-statements [iter 14] | Keep triggers; drop to LOW outside MVCC; INSTEAD OF still rejected |
| 9 | No VACUUM | LOW | CHANGED-better | VACUUM INTO unconditional [SOURCE: core/translate/vacuum.rs:30-38]; bare VACUUM flag-gated; schema-qualified VACUUM INTO works [iter 16] | checkpoints.ts VACUUM INTO path unblocked; LOW stands |
| 10 | CDC unstable | MEDIUM | CHANGED-better | Stable pragma capture_data_changes_conn (old name aliased) [SOURCE: CHANGELOG.md:509]; per-connection opt-in, default off | Keep triggers for now; MEDIUM -> MEDIUM-LOW |
| 11 | No backup()/serialize() | LOW | UNCHANGED | Still throws; zero call sites; checkpoint path already VACUUM-INTO based [iters 10+15] | File-copy; LOW stands |
| 12 | No recursive_triggers | LOW | UNCHANGED | COMPAT.md:193 still absent; trigger compiler refuses recursive self-compile [SOURCE: core/translate/trigger_exec.rs:548] | LOW stands (our triggers one level deep) |
| 13 | Tantivy NoMergePolicy | MEDIUM | UNCHANGED | Set unconditionally on writer [SOURCE: core/index_method/fts.rs:2956]; documented limitation [docs/fts.md:455] | Scheduled OPTIMIZE; MEDIUM stands (BM25 per-segment drift = inference, unrefuted) |
| 14 | WINDOW limitations | LOW | CHANGED-worse | Custom frames unsupported entirely; only row_number() has execution arms [SOURCE: core/vdbe/execute.rs:6396,6428] | TypeScript ranking; LOW stands (zero usage) |
| 15 | libsql FTS5 param bug | MEDIUM (libSQL path) | UNCHANGED | Issue tursodatabase/libsql#1811 OPEN as of 2026-06-10, no fix PR [HOST-WEB: Item 1] | Sync libsql package still required; weight reduced since Path A demoted |
| 16 | Sync->async shift | HIGH / MITIGATED | CHANGED-better | Shipped ./compat export: sync transaction (+deferred/immediate/exclusive) and pragma [SOURCE: packages/native/package.json:14; compat.ts:116-144] | Compat mode (not libsql swap); HIGH -> MEDIUM; adapter re-scoped to 5 divergence ports |

### Q3 — Genuinely unresolved after iterations 1-16

| Item | Known | Missing | Next action |
|------|-------|---------|-------------|
| ATTACH operational semantics under experimental flag | JS-enableable; tests pass; VACUUM INTO works | Cross-attached write-transaction scope, WAL behavior of attached shard | Pilot-phase empirical test |
| changes()/total_changes() trigger failure mode | Reliable for plain DML (tested) | Exact mis-count semantics with trigger sub-statements | Read trigger_exec.rs n_change handling; pilot test list |
| Per-segment BM25 drift under NoMergePolicy | NoMergePolicy confirmed; drift mechanism is tantivy-architecture inference | Direct read of FTS scorer idf/avgdl stats plumbing | One targeted read of fts.rs scoring path |
| Post-vendor corruption/stability record | No 1.0 signals; v0.6.1 latest stable [HOST-WEB: Item 2] | Open corruption-class issue census | Host web sweep before any pilot go/no-go |
| libSQL maintenance-mode status | Cutoff-knowledge claim only; affects only demoted Path A | Current libSQL release cadence | Host web check ONLY if Path A reconsidered |
| MVCC-x-trigger interaction | Indirect: COMPAT lists no MVCC caveat on triggers | Direct core/mvcc evidence or empirical run | Empirical CLI run under experimental MVCC; pilot-phase item |

### Q4 — Confidence per cluster

| Cluster | Confidence | Dominant evidence type |
|---------|------------|------------------------|
| C1 driver/API surface | HIGH | vendored-source (adversarially re-verified) |
| C2 vector | HIGH | vendored-source + web corroboration |
| C3 FTS/Tantivy + gap 15 | HIGH (BM25-drift sub-clause MEDIUM) | vendored-source; gap 15 via web |
| C4 SQL surface | HIGH | vendored-source (double-verified) |
| C5 MVCC/WAL/contention | HIGH (MVCC-x-trigger MEDIUM) | vendored-source |
| C6 VACUUM/CDC/stability | HIGH mechanics / MEDIUM outlook | vendored-source; stability partly web |
| C7 strategy/paths | MEDIUM-HIGH | inference grounded in vendored compat + repo census |
| C8 027-surface/new gaps | HIGH | exhaustive repo greps with positive sanity checks |

## Ruled Out
- Any fifth member of the HARD blocker set: the context report's extra blockers all stand refuted; blockers are exactly vector index, FTS5 surface, WITH RECURSIVE.
- Re-elevating Path A on the strength of the W5 wave.
- A literal "Open Questions" section in baseline docs 001/002/003.
- Carrying gap 15 or post-vendor-release status as open items — both closed by host web evidence.

## Dead Ends
- grep -i "open question" over all three baseline docs returned zero hits — resolved via full heading outlines instead.
- The strategy file's KEY QUESTIONS anchors were unpopulated by the reducer; C1a-C8a definitions recovered from per-iteration prompt files.

## Sources Consulted
- research/003 - gaps-and-workarounds (overview, gaps 15-16, summary matrix)
- research/001 §7-8; research/002 §4-5, §7
- research/iterations/iteration-007.md, -013.md, -014.md, -015.md (full), -004/-005/-008/-012.md (targeted)
- research/deep-research-strategy.md (exhausted-approaches ledger)
- research/host-web-evidence.md

## Reflection
- What worked: the strategy file's exhausted-approaches ledger served as a pre-aggregated verdict index for iterations 1-12; the host-web evidence file cleanly closed the two carried web items.
- What failed: the "§open questions" pointers do not exist as literal sections (one extra verification call); iteration 16's results were concurrent (caveat delegated, since resolved).
- Confidence: high — every gap row rests on adversarially re-verified vendored source, exhaustive repo greps, or dated host web evidence.

## Recommended Next Focus
Proceed to synthesis: lift this verdict table verbatim into research.md, merge iteration 16's ATTACH resolution into the C-prime caveat, and carry the six-item residual list as the synthesis open-questions section.
