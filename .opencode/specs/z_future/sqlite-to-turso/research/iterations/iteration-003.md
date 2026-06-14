# Iteration 3: C3 FTS layer

## Focus
Revalidate the three FTS-layer gaps from the baseline research (written against Turso v0.5.0) against the vendored Turso tree confirmed at v0.7.0-pre.6 (`Cargo.toml:87`): (C3a) Tantivy FTS status and query surface including experimental gating, (C3b) whether NoMergePolicy still forces manual `OPTIMIZE INDEX` maintenance, and (C3c) whether the libsql FTS5 parameterized-insert bug (gap 15, issue #1811) has been fixed upstream. Vendored evidence fully resolves C3a and C3b; C3c required web access that was denied in this seat.

## Findings
- **KNOWN / UNCHANGED (C3a, gap 2)** — FTS at 0.7.0-pre.6 is still Tantivy-based, not FTS5: "Turso implements FTS using Tantivy instead of SQLite's FTS3/FTS4/FTS5" with FTS3/FTS4/FTS5 explicitly ❌ [SOURCE: external/turso-main/COMPAT.md:1073-1084]. The baseline's "no FTS5, full rewrite required" framing holds.
- **KNOWN / UNCHANGED (C3a, gap 2)** — The query surface assumed by workarounds W2a/W2b is intact and first-class: `fts_match`, `fts_score`, `fts_highlight` all ✅ in the compat matrix [SOURCE: external/turso-main/COMPAT.md:1079-1082], registered as native functions in core [SOURCE: external/turso-main/core/function.rs:419-421, 1763-1765], implemented in the index module [SOURCE: external/turso-main/core/index_method/fts.rs:81,160], and documented as the official three-function API [SOURCE: external/turso-main/docs/sql-reference/functions/fts.mdx:13].
- **NEW (C3a)** — FTS is gated behind an explicit experimental feature named `index_method`: "CREATE INDEX ... USING for FTS and custom index types" is listed in the experimental-features table [SOURCE: external/turso-main/docs/sql-reference/experimental-features.mdx:19], enabled via CLI flag `--experimental-index-method` [SOURCE: experimental-features.mdx:41], Rust builder `experimental_index_method(true)` [SOURCE: experimental-features.mdx:58], and a JS SDK `experimental: [...]` connection-option array [SOURCE: experimental-features.mdx:80-86]; create-index docs confirm "This feature is experimental and must be enabled before use" [SOURCE: external/turso-main/docs/sql-reference/statements/create-index.mdx:101]. The baseline gap-2 workaround (003:141-199) never mentions this enablement prerequisite — W2a's `CREATE INDEX ... USING fts` will fail without it. Migration plans must add the experimental flag to every connection that touches the FTS index.
- **NEW (C3a)** — FTS shipped into the JS SDK path since the baseline: CHANGELOG entries "Enable FTS for JavaScript SDK" [SOURCE: external/turso-main/CHANGELOG.md:681], "Enable fts in sdk-kit" [SOURCE: CHANGELOG.md:241], "deps: upgrade tantivy and make default feature in sdk-kit" [SOURCE: CHANGELOG.md:170], and "Remove fts/tantivy as default dependency in turso-core" [SOURCE: CHANGELOG.md:810] — i.e., FTS is now an SDK-level default feature while remaining opt-in (experimental) at the SQL surface. A JS-binding test exercises FTS [SOURCE: external/turso-main/bindings/javascript/packages/native/promise.test.ts].
- **KNOWN / UNCHANGED (C3b, gap 13)** — NoMergePolicy is still hard-wired: the writer sets it unconditionally (`writer.set_merge_policy(Box::new(NoMergePolicy))`) [SOURCE: external/turso-main/core/index_method/fts.rs:2956, import at :31], and the docs list "No automatic segment merging — uses NoMergePolicy, use OPTIMIZE INDEX for manual segment merging" as a current limitation [SOURCE: external/turso-main/docs/fts.md:455]. Baseline workaround W13a (scheduled `OPTIMIZE INDEX`) remains required.
- **NEW (C3b)** — Small ergonomic improvement: a bare `OPTIMIZE INDEX;` now optimizes ALL FTS indexes in the database, alongside the per-index form [SOURCE: external/turso-main/docs/fts.md:421-430]; the optimize path flushes pending docs, merges all segments into one, and reloads the reader [SOURCE: external/turso-main/core/index_method/fts.rs:3301-3382]. W13a's maintenance task can use the no-name form instead of enumerating indexes.
- **PARTIAL / UNCHANGED-by-default (C3c, gap 15)** — The libsql FTS5 parameterized-insert bug could NOT be verified upstream this iteration: the vendored tree is turso-core, not the libsql repo, so it carries no evidence about issue #1811; WebFetch/WebSearch permissions were denied for this seat. Baseline claim stands as written: `@libsql/client` (async) crashes on parameterized FTS5 INSERT, the sync `libsql` npm package works, mitigation W15a (use sync package + run full FTS5 test suite) [SOURCE: research/003 - gaps-and-workarounds-sqlite-to-turso.md:634-653]. Treat as UNCHANGED until a web-enabled pass confirms.
- **KNOWN / UNCHANGED (context)** — The live-code blocker surface is unchanged in character: the migration must replace the FTS5 gate (`bm25-index.ts:478`, `:520`), the `memory_fts` virtual table + 3 sync triggers (`vector-index-schema.ts:1194-1223`), FTS5 `delete-all`/`rebuild` commands (`checkpoints.ts:1606`, `:1930`), and the retention sweep's FTS5 optimize [SOURCE: context/context-report.md:35-50,111-124]. The baseline's claimed upside — Tantivy is transactionally integrated, eliminating the three sync triggers (003:159, 454-455) — is consistent with the vendored design docs (tombstones applied at merge, atomic commit) [SOURCE: external/turso-main/docs/fts.md:26,56-57].

## Ruled Out
- "FTS might have been promoted to stable / non-experimental by 0.7.0-pre.6" — disproven; it is explicitly experimental-gated via the `index_method` feature [SOURCE: experimental-features.mdx:19, create-index.mdx:101].
- "Tantivy may have gained automatic segment merging in Turso by 0.7.0-pre.6" — disproven; NoMergePolicy is set unconditionally in source and documented as a limitation [SOURCE: core/index_method/fts.rs:2956, docs/fts.md:455].
- "FTS5 compatibility might have been added as a shim" — disproven; FTS3/FTS4/FTS5 remain ❌ "Use Turso FTS instead" [SOURCE: COMPAT.md:1084].

## Dead Ends
- WebFetch of github.com/tursodatabase/libsql/issues/1811 and WebSearch for post-v0.7.0-pre.6 releases: permission denied in this seat — C3c upstream status and any FTS stabilization news after the vendor snapshot remain unverified.
- Grep for "experimental" inside `core/index_method/fts.rs`: zero hits — the gating lives in the CLI/SDK connection layer, not the index module (useful negative: enabling is per-connection config, not per-index DDL).
- Two compound Bash commands rejected by sandbox policy (cd-compound, multi-statement), costing budget without yielding evidence.

## Sources Consulted
- `external/turso-main/Cargo.toml:87` (version 0.7.0-pre.6)
- `external/turso-main/COMPAT.md:58, 1073-1084`
- `external/turso-main/docs/fts.md:1-60, 212, 268, 421-455`
- `external/turso-main/docs/sql-reference/experimental-features.mdx:3-104`
- `external/turso-main/docs/sql-reference/statements/create-index.mdx:101`
- `external/turso-main/docs/sql-reference/functions/fts.mdx:13, 77-108`
- `external/turso-main/core/index_method/fts.rs:31, 81, 160, 1420-1440, 2956, 3301-3382`
- `external/turso-main/core/function.rs:389-421, 1763-1765`
- `external/turso-main/CHANGELOG.md:146, 170, 241, 449, 681, 708, 751, 810, 919`
- `research/003 - gaps-and-workarounds-sqlite-to-turso.md:94-199, 440-457, 560, 575-604, 634-653, 729-755`
- `context/context-report.md:8, 35-50, 94-124, 146-157`
- URLs: none reachable (web tools denied)

## Reflection
- What worked: COMPAT.md plus `docs/sql-reference/experimental-features.mdx` pinned C3a precisely in two reads; grepping `core/index_method/fts.rs` gave code-level (not just doc-level) confirmation of NoMergePolicy and the optimize path; the baseline 003 doc's line-numbered gap sections made verdict comparison cheap.
- What failed: WebFetch/WebSearch were permission-denied, leaving C3c's upstream fix status unverifiable from this seat; two compound Bash invocations were blocked by sandbox policy and consumed budget.
- Confidence: high for C3a and C3b (direct vendored source + docs + changelog, all agreeing); low for C3c upstream status (no new evidence — verdict is "unchanged by default", not "unchanged by proof").

## Recommended Next Focus
Dispatch a web-enabled seat to confirm libsql issue #1811's current status and scan Turso releases after v0.7.0-pre.6 for FTS stabilization (experimental→stable promotion, merge-policy changes), then close out gap 15 with a definitive verdict.
