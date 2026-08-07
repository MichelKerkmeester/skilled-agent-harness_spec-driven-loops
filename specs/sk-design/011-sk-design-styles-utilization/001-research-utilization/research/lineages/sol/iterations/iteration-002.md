# Iteration 2: Retrieval Substrate Architecture and Repository-Native Precedents

## Focus

Compare a committed static manifest/index, a queryable structured token store, on-demand grep over `DESIGN.md`, and a layered hybrid against the current corpus and repository-native indexing patterns. The target was the narrow substrate decision: relevance, determinism, runtime/context cost, freshness, dependencies, and build/maintenance cost. Broad corpus recounting was not repeated; one current snapshot was taken only because the corpus was still being captured and substrate costs depend on its live size.

## Actions Taken

1. Inspected the repository's generated, byte-stable leaf-manifest contract and the Skill Advisor's checked-metadata-to-SQLite freshness model.
2. Inspected Spec Kit Memory's SQLite FTS5/BM25 capability probing and multi-channel lexical/vector fusion surface.
3. Inspected the styles extractor's committed crawl manifest, resumability contract, current manual README index, and the sk-design hub's smallest-useful-mode and non-flattening rules.
4. Ran a read-only in-memory benchmark over one pinned path snapshot, comparing compact metadata scan, full-file lexical scan, structured SQLite filtering, and SQLite FTS5 ranking without creating repository or temporary files.

## Findings

1. **The strongest repository-native precedent is a checked source manifest plus a rebuildable query projection, not a database as source of truth.** The advisor's `leaf-manifest.json` is generated, must be byte-stable under `--check`, and authorizes exact routable paths; its SQLite graph separately indexes checked `graph-metadata.json`, records source paths and content hashes, and reports changed or missing sources by recomputing SHA-256. The styles harness already has the beginnings of the same split: committed `_manifest.json` is lastmod-keyed crawl state, while captured artifacts remain canonical. A styles retrieval manifest should therefore be committed and checkable, while any SQLite/FTS or embedding store should be disposable and generation-bound. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:87-99] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/status.ts:114-203] [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:23-28,37-49,91-96]

2. **The current crawl state proves why a hand-maintained static index is insufficient and why every published index needs freshness metadata.** The manual `styles/README.md` says 50 of 1,290 styles, while the read-only snapshot found 1,034 `DESIGN.md` bundles and the 1,290-row crawl manifest contained 1,034 `captured` plus 256 `pending` rows. The existing manifest is useful provenance/freshness input (`uuid`, URL, `lastmod`, slug, status, capture time, error), but it has no retrieval attributes, artifact hashes, token-axis statistics, or mode eligibility. This contradiction is resolved as manual-index staleness, not corpus uncertainty. [SOURCE: .opencode/skills/sk-design/styles/README.md:1-12] [SOURCE: .opencode/skills/sk-design/styles/_manifest.json:1-18] [INFERENCE: read-only Python snapshot and manifest aggregation over `.opencode/skills/sk-design/styles/` at 2026-07-18T09:40Z]

3. **A compact committed retrieval manifest is cheap enough to make the deterministic first stage, but static metadata alone has inadequate free-text recall.** A prototype record containing id, title, up to 12 headings, token axes, artifact sizes, and exact path serialized to 502,895 bytes (486.4 bytes/style) for 1,034 styles and took 171.1 ms to derive while parsing tokens. Scanning that compact projection took about 0.95–1.08 ms/query, but exact two-term tests for `brutalist editorial`, `playful colorful`, and `reduced motion` returned zero because those attributes occur in body prose rather than titles/headings. Static-only is therefore appropriate for exact eligibility/provenance/axis filtering and deterministic candidate narrowing, not final relevance ranking unless it duplicates enough prose to cease being compact. [INFERENCE: read-only Python compact-manifest benchmark over 1,034 captured bundles; compared against the same snapshot's full `DESIGN.md` bodies]

4. **A queryable SQLite token/lexical store gives excellent query latency and expressiveness, but its footprint, native dependency, and freshness obligations make it a derived accelerator.** An in-memory table plus FTS5 index over all 1,034 style bodies ingested in 179.7 ms, occupied 29,093,888 SQLite page bytes, returned top-10 BM25 results in 0.054–0.203 ms for the three test queries, and ran a structured two-axis filter in 0.145 ms. The repository implementation likewise depends on `better-sqlite3`, probes both the FTS5 compile option and table presence, sanitizes lexical terms, weights BM25 columns, and fails open when FTS5 is unavailable. A store can support exact token/provenance filters and ranked lexical search, but it should expose its manifest generation/hash and rebuild from checked artifacts rather than be committed as canonical state. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:9-14,96-143,150-205,207-252] [SOURCE: .opencode/skills/system-skill-advisor/README.md:115-130] [INFERENCE: read-only in-memory SQLite benchmark over the pinned 1,034-document snapshot]

5. **On-demand grep is a credible zero-build fallback and freshness oracle, but not the default substrate.** Each test query deterministically read 20,378,783 bytes across 1,034 `DESIGN.md` files and completed in 32.71–33.35 ms on the warm local checkout, finding 34, 22, and 29 all-term matches respectively. That cost is acceptable for diagnosis or when a derived index is stale/unavailable, and grep reads source truth immediately; however, every query repeats the full scan, lexical matches are unranked without additional code, structured token/provenance predicates require joins to other artifacts, and indiscriminate snippet/body loading would violate the hub's smallest-useful-mode discipline. [SOURCE: .opencode/skills/sk-design/SKILL.md:140-142,168-184] [INFERENCE: read-only full-file scan benchmark over 20,378,783 bytes of `DESIGN.md` content]

6. **The best current balance is a layered hybrid: committed manifest → deterministic filters → lexical rank → optional semantic rerank → mode-specific hydration.** The committed manifest should join crawl state with per-artifact content hashes, title/summary, token axes and counts, available motion/do-don't sections, provenance/license-known state, mode eligibility, and byte costs. Deterministic filters should first exclude pending/stale/unlicensed-for-the-request candidates and constrain mode/axis. FTS5/BM25 should rank body text; semantic ranking should be optional, versioned, and only break lexical/structured ambiguity because the repository's semantic lane adds model/runtime dependencies while its hybrid API already supports separately switchable vector, FTS, BM25, graph, and trigger channels. The hub receives only candidate cards; hydration then preserves one coherent `DESIGN.md` plus provenance for interface, token-axis slices for foundations, motion sections only for motion, do/don't plus provenance for audit, and at most one calibration pair for md-generator. This keeps retrieval broad but context narrow and preserves each mode rather than flattening their logic. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:4-18,99-145] [SOURCE: .opencode/skills/sk-design/SKILL.md:140-142,168-184,201-204] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:71-90] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:55-103] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:51-66,97-113] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:23-29,95-115] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:10-15,109-122] [INFERENCE: synthesis of findings 1-5 and iteration-1 mode-consumption evidence]

### Substrate Comparison

| Substrate | Context size | Determinism and freshness | Query expressiveness | Dependencies and measured build/runtime cost | Verdict |
|---|---|---|---|---|---|
| Committed static manifest/index | Candidate cards only; prototype 502,895 bytes total | Highest when generated, hash-bound, and byte-stable; stale if hand-maintained | Exact fields and simple lexical metadata; weak body-attribute recall | No service; 171.1 ms prototype build | Required authoritative first stage, insufficient alone |
| Queryable structured token/FTS store | Candidate rows until explicit hydration | Deterministic SQL/BM25, but derived generation can stale | Strong structured predicates plus ranked lexical body search | SQLite/FTS5/native binding; 179.7 ms ingest and 29.1 MB page footprint | Best disposable ranking/filter accelerator |
| On-demand grep over `DESIGN.md` | Compact paths if capped; snippets/bodies can balloon | Reads freshest source and is reproducible | Regex/lexical body matching; no native joins or rank | No build; about 33 ms and 20.38 MB read per query | Fallback, freshness oracle, and debugging path |
| Layered hybrid | Candidate cards first, selected fragments last | Deterministic core; semantic lane must be optional/versioned; manifest hashes expose drift | Highest: structured + lexical + optional semantic, then mode-aware hydration | Moderate build; query store optional and rebuildable | Recommended architecture |

[SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:87-99,293-311] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:150-252] [INFERENCE: read-only benchmark metrics reported in findings 2-5]

## Questions Answered

None closed. The evidence selects a provisional architecture, but the exact first key question remains open because no labeled, mode-representative top-K relevance set was used to compare static metadata, BM25, and semantic reranking. Hit counts and latency establish feasibility and cost, not precision/recall or distinctiveness.

## Questions Remaining

1. Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance? **Narrow remaining proof:** labeled mode-specific top-K relevance evaluation plus semantic-lane ablation on a quiescent snapshot.
2. What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles?
3. Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle?
4. What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns?
5. How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?

## Sources Consulted

- `.opencode/skills/system-skill-advisor/SKILL.md:80-114,285-313`
- `.opencode/skills/system-skill-advisor/README.md:115-154`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/status.ts:114-203`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:1-260`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1-260`
- `.opencode/skills/sk-design/SKILL.md:130-214`
- `.opencode/skills/sk-design/styles/_harness/README.md:13-112`
- `.opencode/skills/sk-design/styles/_manifest.json:1-24`
- `.opencode/skills/sk-design/styles/README.md:1-61`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:136-367`
- Read-only Python corpus, compact-manifest, file-scan, structured-query, and in-memory FTS5 benchmark output from the pinned 2026-07-18T09:40Z snapshot.

## Assessment

- New information ratio: **0.93**
- Novelty calculation: 4 fully new findings + 2 partially new findings = `(4 + 0.5×2) / 6 = 0.83`; resolving the stale manual-index contradiction adds the 0.10 simplicity bonus, yielding 0.93.
- Questions addressed: retrieval substrate balance; repository-native index/query/refresh tooling.
- Questions answered: none fully; the missing relevance evaluation is explicit above.
- Evidence strength: concrete repository contracts plus one pinned, read-only cost/query benchmark; no external service or embedding availability was assumed.

## Reflection

- **What worked and why:** Comparing existing checked-manifest and SQLite freshness contracts against one shared corpus snapshot made the trade-offs concrete without implementing an index. The same three queries exposed the compact-static recall gap, grep I/O cost, and FTS latency directly.
- **What did not work and why:** Query hit counts cannot establish relevance quality. There was no labeled set of mode-specific intents, and semantic ranking was not executed, so a confident precision/recall or semantic-value claim would be fabricated.
- **What I would do differently:** Pin a quiescent manifest generation first, define 10–15 representative queries with expected coherent-style candidates and attribute matches, then compare top-K overlap, provenance completeness, and context bytes across static, BM25, and optional semantic lanes.

## Edge Cases

- Ambiguous input: none; the narrower substrate-comparison interpretation was explicit in the strategy and dispatch prompt.
- Contradictory evidence: `styles/README.md` reports 50 extracted styles while the crawl manifest/snapshot reports 1,034 captured. The generated crawl state is better supported; the README is stale.
- Missing dependencies: no required dependency was missing. Semantic infrastructure was intentionally not required for the deterministic substrate benchmark.
- Partial success: substrate feasibility and cost were established, but relevance quality remains unvalidated; therefore no key question was marked answered.

## Dead Ends or Ruled Out

- **Static-manifest-only as the final ranker:** compact exact metadata missed all three body-attribute test queries.
- **Queryable database as canonical truth:** it duplicates checked artifacts and requires explicit generation/hash freshness plus native runtime support.
- **Semantic-only primary ranking:** it adds model/version/runtime variability and cannot replace deterministic provenance and eligibility filters.
- **Broad on-demand grep as the default path:** acceptable latency here does not supply structured joins, stable rank, or bounded hydration; retain it as fallback and freshness oracle.

## Next Focus

Run a read-only relevance validation on a quiescent snapshot: define mode-specific queries and expected candidate/attribute evidence, compare compact filters, BM25, and optional semantic reranking at top K, and measure hydrated context bytes. Use that ablation to close the first key question or identify the smallest remaining ranking uncertainty.
