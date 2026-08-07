# Iteration 1: Current style corpus and retrieval pipeline

## Focus
This iteration mapped the packet's requested current-state baseline: corpus identity, retrieval-manifest shape, ranking and hydration stages, file walking, and measured costs. The topic calls this a 1,291-style library, but the committed corpus evidence consistently reports 1,290; this discrepancy is preserved rather than normalized away.

## Findings
1. **The checked-in retrieval corpus currently contains 1,290 records, not 1,291.** `_retrieval-manifest.json` declares `recordCount: 1290`, while a bounded local inventory found 1,290 non-underscore style directories, 1,290 crawl records (all `captured`), and 1,290 retrieval records. Those directories contain 7,740 files totaling 116,832,354 bytes; `DESIGN.md` files account for 26,022,963 bytes, and the JSON retrieval manifest itself is 5,890,740 bytes. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:1-6] [SOURCE: .opencode/skills/sk-design/styles/_manifest.json:1-10] [SOURCE: command: bounded Node corpus inventory, 2026-07-19]
2. **Canonical identity is a UUID-first identity with slug as a distinct unique locator, but it has an explicit fallback chain.** Record creation chooses `canonical.uuid`, then crawl-manifest UUID, then slug; provenance repeats the UUID separately. Closed manifest validation requires both IDs and slugs to be unique. On unchanged content, prior derived data is reused but ID/status are refreshed from the crawl manifest, so a database migration should preserve both immutable logical ID and mutable filesystem slug rather than treating path as identity. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:245-266] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:295-315] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:483-513] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:603-621]
3. **The manifest is already a strong denormalized projection, but not a database.** Its exact schema stores generation/crawl hashes plus per-style identity, status, title/thesis/theme, token-axis counts, capabilities, facets, section names and line pointers, provenance, artifact path/size/hash tuples, estimated hydration bytes, and a content hash. Derived metadata comes from canonical JSON, token JSON, and the first 16 KiB of `DESIGN.md`; strict exact-key validation rejects schema drift. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:29-79] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:288-315] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-513] [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:7-160]
4. **Every query validates freshness by rebuilding the complete live manifest before ranking.** `runQuery` loads committed JSON, calls `buildManifest`, serializes both full structures, and refuses stale state. A build enumerates every style, enumerates and reads every artifact, hashes content, then performs a second corpus-wide pass that re-reads and hashes every artifact to detect concurrent mutation. The first pass can fan out across up to 256 styles, but artifact reads within each style are sequential. [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:119-155] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:537-580] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-637] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:640-712]
5. **Ranking is eligibility-first, then deterministic facet scoring plus lexical scoring, then bounded cards.** Eligibility excludes missing provenance, missing required facets, explicit exclusions, and uncleared exact reuse. Deterministic score weights required facets by 10, requested token axes by 2, and capabilities by 1. The preferred lexical stage creates a fresh in-memory SQLite FTS5 table on each query, sequentially reads up to 64 KiB from every eligible `DESIGN.md`, inserts all rows, and applies BM25; failure or stale accelerator identity falls back to a source scan capped at 1,290 records/24 MiB. Results are capped at five cards and 2,048 bytes per card before separately guarded hydration. [SOURCE: .opencode/skills/sk-design/styles/_engine/eligibility.mjs:27-48] [SOURCE: .opencode/skills/sk-design/styles/_engine/rank-fts.mjs:18-23] [SOURCE: .opencode/skills/sk-design/styles/_engine/rank-fts.mjs:46-73] [SOURCE: .opencode/skills/sk-design/styles/_engine/rank-fts.mjs:102-127] [SOURCE: .opencode/skills/sk-design/styles/_engine/rank-fts.mjs:203-237] [SOURCE: .opencode/skills/sk-design/styles/_engine/cards.mjs:9-12] [SOURCE: .opencode/skills/sk-design/styles/_engine/cards.mjs:68-95]
6. **The current implementation pays corpus-scan and index-build costs at read time and has no semantic or relationship channel.** One full-corpus FTS query with all 1,290 styles eligible took 6,246.5 ms locally, after which the disposable SQLite database was closed. Hydration again rebuilds and compares the complete manifest before reading selected, mode-allowlisted artifacts under a 128 KiB hard cap and verifying artifact hashes. Therefore the present accelerator supplies lexical BM25 only: there is no persisted FTS index, embedding lifecycle, semantic nearest-neighbor lookup, or style relationship graph; those are the primary capabilities a real indexed store must add without weakening generation, provenance, rights, containment, and content-hash guards. [SOURCE: .opencode/skills/sk-design/styles/_engine/rank-fts.mjs:102-127] [SOURCE: .opencode/skills/sk-design/styles/_engine/hydrate.mjs:225-291] [SOURCE: .opencode/skills/sk-design/styles/_engine/hydrate.mjs:315-370] [SOURCE: command: bounded full-corpus query benchmark, 2026-07-19] [INFERENCE: the imported modules and ranking code expose only deterministic and lexical channels; no embedding or graph stage appears in the mapped pipeline]

## Ruled Out
- Treating `_retrieval-manifest.json` as an indexed database: it is a 5.89 MB denormalized JSON snapshot that is fully parsed and regenerated for freshness checks, while FTS is recreated in memory per query. [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:119-143] [SOURCE: .opencode/skills/sk-design/styles/_engine/rank-fts.mjs:102-127]
- Treating directory slug as canonical identity: UUID is preferred and slug is separately uniqueness-checked and used for filesystem location. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:295-308] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:483-500]
- Accepting the research topic's 1,291 count as current runtime truth: three checked-in/runtime surfaces agree on 1,290. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:1-6] [SOURCE: command: bounded Node corpus inventory, 2026-07-19]

## Dead Ends
None. The direct engine and corpus evidence was productive. The 1,291-versus-1,290 discrepancy should remain an explicit migration preflight check rather than be promoted as an exhausted approach.

## Edge Cases
- Ambiguous input: none; the requested focus was specific.
- Contradictory evidence: the topic says 1,291 styles, whereas the current crawl manifest, directory inventory, and retrieval manifest each report 1,290. The current repository state is better supported, but the missing/extra historical item is unresolved.
- Missing dependencies: the code graph is absent per strategy, so direct exact file reads and a bounded local benchmark were used as the prescribed fallback.
- Partial success: none. This iteration completed the requested current-state map; it does not answer the later target-architecture questions.

## Sources Consulted
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs:30-33,76-155`
- `.opencode/skills/sk-design/styles/_engine/manifest.mjs:29-79,245-315,434-513,537-712`
- `.opencode/skills/sk-design/styles/_engine/eligibility.mjs:27-80`
- `.opencode/skills/sk-design/styles/_engine/rank-fts.mjs:18-23,46-73,102-237`
- `.opencode/skills/sk-design/styles/_engine/cards.mjs:9-12,68-95`
- `.opencode/skills/sk-design/styles/_engine/hydrate.mjs:225-291,315-370`
- `.opencode/skills/sk-design/styles/_engine/corpus-use-proof.mjs:42-67,80-132`
- `.opencode/skills/sk-design/styles/_retrieval-manifest.json:1-160`
- `.opencode/skills/sk-design/styles/_manifest.json:1-60`
- `.opencode/skills/sk-design/styles/notion-f58e99d1/notion-f58e99d1-canonical.json:1-24`
- `.opencode/skills/sk-design/styles/notion-f58e99d1/DESIGN.md:1-80`
- Bounded Node corpus inventory and full-corpus query benchmark (2026-07-19)
- Focused engine tests: 10 passed, 0 failed (fallback, invalidation, proof)

## Assessment
- New information ratio: 1.0 (6 of 6 findings are fully new in this first iteration)
- Questions addressed: Q4 (current retrieval API and file-walking migration baseline); Q2 and Q3 prerequisites (identity, projection fields, freshness behavior)
- Questions answered: none of the five architecture questions in full; the current-state half of Q4 is now mapped

## Reflection
- What worked and why: Reading the pipeline from CLI orchestration through manifest, eligibility, ranking, cards, and hydration exposed both the authority boundaries and duplicated I/O; a bounded benchmark quantified the practical cost instead of inferring it from loops alone.
- What did not work and why: The research topic's corpus count could not be reconciled to current files; no checked-in evidence among the inspected surfaces identifies a 1,291st live style.
- What I would do differently: In the next architecture pass, preserve this baseline as explicit acceptance metrics (1,290 records, 7,740 artifacts, 116.8 MB, ~6.25 s query) and compare persistent-store designs against it rather than rereading the corpus broadly.

## Recommended Next Focus
Map the in-repo spec-memory SQLite and embedding implementation end to end: schema ownership, FTS/vector tables, content-hash incremental ingest, embedding-status lifecycle, transactional upsert/delete behavior, and query fusion. Use that evidence to identify which current manifest fields become normalized columns, child tables, FTS text, and embedding payloads while retaining flat-file generation guards.
