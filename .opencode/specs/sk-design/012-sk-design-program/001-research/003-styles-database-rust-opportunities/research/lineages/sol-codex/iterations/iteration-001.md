# Iteration 1: Residency and Scale Baseline

## Focus

Establish what is actually JavaScript-resident, what is already native, what scales with corpus size, and which tempting Rust claims are false at the present 1,290-bundle corpus.

## Findings

1. The corpus contains exactly 1,290 non-internal style directories and 1,290 canonical JSON files; the full tree is about 135 MiB. That is meaningful for offline indexing but small for in-memory exact vector ranking. [SOURCE: bounded repository counts run 2026-07-20] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:670-672]
2. Persistent lexical retrieval is already SQLite FTS5 through `node:sqlite`: the schema creates an external-content FTS5 table and synchronization triggers, while `ftsLane()` executes `MATCH` plus `bm25()` in SQL. Rust cannot accelerate this by porting it because the hot work is already native SQLite. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:147-186] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:200-215]
3. The vector lane is the only query-time corpus-scaled JavaScript compute: SQLite returns JSON vectors, JavaScript parses every eligible vector, computes exact cosine, sorts all results, then keeps at most `candidateK <= 200`. Complexity is approximately `O(E×D + E log E)` for `E` eligible vectors and dimension `D`, plus JSON decode; it is not a source-tree walk. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:218-249] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:21-24]
4. The remaining JavaScript ranking work is bounded and deterministic: the tokenizer caps unique terms at 12, and weighted RRF visits only ranked lane results. At current caps, RRF processes at most roughly 600 lane entries; that is not a credible Rust boundary by itself. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:19-24] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:48-55] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:259-283]
5. Offline indexing already performs incremental metadata-hint checks, full content hashing only for candidates, a separate semantic retrieval hash, vector job supersession, and a content-addressed embedding cache. New Rust work must improve concurrency, continuous operation, local inference, or feature extraction—not rediscover these mechanisms. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:181-221] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:670-740] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:206-216] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:256-295]

## Ruled Out

- Port SQLite/FTS5 to Rust: no residency case; SQLite already owns the computation.
- Port `queryTerms()` or weighted RRF alone: bounded work with negligible scale at current caps.
- Claim that normal persistent reads scan 135 MiB of bundle files: they query the published database and hydrate only selected artifacts.

## Dead Ends

- “Rust makes search fast” without decomposing native SQLite, JS vector decode/cosine, and bounded fusion is too imprecise to support a decision.

## Edge Cases

- Ambiguous input: none; the operator supplied the relevant line anchors and scale.
- Contradictory evidence: none.
- Missing dependencies: no published `.sqlite` generation is checked into `_db`, so this iteration establishes operation counts and residency, not measured query latency.
- Partial success: exact latency and ANN crossover remain benchmark questions.

## Sources Consulted

- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:19-283`
- `.opencode/skills/sk-design/styles/_db/schema.mjs:147-229`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:181-221,622-740`
- `.opencode/skills/sk-design/styles/_db/vectors.mjs:150-315`

## Assessment

- New information ratio: 0.92
- Questions addressed: current residency and scale baseline
- Questions answered: current residency and scale baseline

## Reflection

- What worked and why: direct counts plus exact source paths separated offline corpus work, native SQLite work, and JavaScript-resident work.
- What did not work and why: no checked-in published database exists for a query benchmark.
- What I would do differently: benchmark generated fixtures at multiple scales during a future implementation spike.

## Recommended Next Focus

Pressure-test ANN architectures, their crossover scale, update behavior, determinism implications, and whether Rust is necessary or only one implementation option.
