# Iteration 001 - RQ-A1 Coco-index intent steering + query expansion

## Focus

RQ-A1 asks whether XCE's intent-steering pattern can teach `mcp-coco-index` two things: when to fire as a first-class advisor action for code-intent search, and how to expand one user query into multiple intent-tagged sub-queries before embedding and dedup.

## Actions Taken

- Read XCE public surface. XCE advertises semantic search, architecture context, traceability, and impact analysis as its public MCP value surface (`external/README.md:22-28`), recommends steering rules that call XCE before direct file reading (`external/README.md:101-119`), and states the agent "automatically calls XCE tools when it needs codebase context" after indexing and MCP connection (`external/README.md:240-243`).
- Read one concrete steering file. The Claude steering example says to always use XCE before reading files, call `xce_get_context` first, use `xce_search` for meaning-based search, and use `xce_trace` for broader architectural connection (`external/steering/CLAUDE.md:5-10`).
- Read current CocoIndex activation and query guidance. The skill already fires for "find code that does X", "where is the logic for", "how is X implemented", and unfamiliar-code exploration (`.opencode/skills/mcp-coco-index/SKILL.md:16-31`), while the search patterns doc asks users to manually start with a short concept phrase, add filters, and rephrase only after filters are exhausted (`.opencode/skills/mcp-coco-index/references/search_patterns.md:28-35`).
- Read current CocoIndex query path. `query_codebase()` receives a single `query` string and generates exactly one query embedding before KNN/full-scan retrieval (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:267-295`), then dedups and ranks rows in one merged result list (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:317-323`).
- Read MCP/CLI entrypoint path. The MCP `search` tool forwards only `query`, `languages`, `paths`, `limit`, and `offset` to the daemon client (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:141-150`), and the IPC `SearchRequest` schema has no intent or expansion fields today (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:21-28`).
- Read path-class rerank surface. `classify_path()` emits `vendor`, `generated`, `spec_research`, `tests`, `docs`, or `implementation` (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:53-91`), stores that class with each chunk (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:266-295`), and query rerank currently only boosts implementation or penalizes docs/spec research for implementation-intent queries (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:198-207`).
- Skimmed pt-01 and pt-02 boundaries. Pt-01 already concluded unconditional static steering is not portable because local advisor routing is dynamic (`research/027-xce-research-pt-01/research.md:117-126`), and pt-02 says Phase 004 needs guardrails before stronger "MUST invoke FIRST" wording (`research/027-xce-research-pt-02/research.md:43-47`).

## Findings

### F-iter001-001 - Advisor firing should ADAPT XCE's "use first" steering into a gated first-action hint

Verdict: ADAPT. LOC estimate: ~25-45. Dependencies: Phase-004.

Evidence: XCE's public recommendation is unconditional and ordering-heavy: "call XCE first" and prefer it over direct file reading (`external/README.md:101-119`; `external/steering/CLAUDE.md:5-10`). The local advisor renderer already gates recommendations by `passes_threshold` or confidence/uncertainty before emitting a brief (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-133`), but its final normal brief still says only `use ${topLabel}` (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:155-158`). CocoIndex already has advisor signals for this class of intent: lexical hints include "semantic search", "vector search", "grep not enough", "find code", and "where logic" (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts:25-30`), and explicit boosts cover `semantic`, `semantic code search`, and `vector-search` (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:55-56`; `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:154-160`).

Implication: RQ-A1(a) is viable without scorer surgery. The minimal adaptation is to make the Phase-004 first-action hint for `mcp-coco-index` say something like "semantic search FIRST for intent/code-location queries; grep after for exact verification." This should ride on the existing scorer lanes and Phase-004 renderer work, not copy XCE's unconditional global rule.

### F-iter001-002 - Query expansion belongs at the pre-embedding stage in `query_codebase()`

Verdict: ADAPT. LOC estimate: ~120-180. Dependencies: none for MVP; Phase-004 only for advisor wording.

Evidence: The current query pipeline embeds exactly the user query at `embedder.embed(query, query_prompt_name)` (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:293-295`). Retrieval then runs KNN/full-scan against that single embedding (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:300-315`) and delegates final dedup/ranking to `_dedup_and_rank_rows()` (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:317-323`). The existing user-facing advice already teaches manual expansion/rephrasing, but only as documentation: start short, add filters, rephrase after filters are exhausted, and switch to grep for exact text (`.opencode/skills/mcp-coco-index/references/search_patterns.md:28-35`).

Implication: RQ-A1(b) is technically straightforward as a local shim before line 293: classify search intent, produce a bounded set of sub-queries, embed each sub-query, collect rows with a small per-query fetch cap, and pass the combined rows through existing dedup/rank. The initial version should be rule-based, not LLM-based, to preserve the local/offline behavior of the current skill.

### F-iter001-003 - Path-class taxonomy can weight intent-tagged sub-queries, but only as a bounded rerank feature

Verdict: ADAPT. LOC estimate: ~70-100. Dependencies: none for path-class-only MVP.

Evidence: The indexer already classifies chunks into `vendor`, `generated`, `spec_research`, `tests`, `docs`, and `implementation` (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:53-91`) and persists `path_class` in the vector table (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:266-295`). Query rerank already uses that taxonomy when `_has_implementation_intent(query)` is true, adding `implementation_boost` and docs/spec penalties (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:198-207`). Current implementation intent detection is narrow keyword matching over terms like "implementation", "function", "handler", "class", "callers", and "definition of" (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:40-59`).

Implication: path classes can become intent priors for sub-query weighting: implementation queries boost implementation, test queries boost tests, documentation/architecture queries avoid penalizing docs, and research queries can include `spec_research`. Keep the existing +/- magnitude small, with an explicit cap, because path class is a weak prior and semantic distance should still dominate.

### F-iter001-004 - Public XCE docs support steering and tool-shape transfer, not internal intent-routing transfer

Verdict: SKIP for closed-source routing internals; ADAPT for public steering shape. LOC estimate: ~0 for internals, included in F-iter001-001 for public steering. Dependencies: none.

Evidence: XCE's README exposes the tool categories and PRAT name (`external/README.md:22-29`), the steering rule shape (`external/README.md:101-119`), and the high-level query flow of index/connect/query/context (`external/README.md:229-245`). It does not expose PRAT internals or implementation code, and the packet explicitly limits research to public docs and local code while ruling out PRAT reverse engineering (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:137-144`). Pt-01 already marked closed-source PRAT internals as non-adoptable and static unconditional steering as incompatible with dynamic advisor routing (`research/027-xce-research-pt-01/research.md:176-181`).

Implication: do not claim XCE teaches a concrete closed-source intent classifier. It teaches a UX contract: use context/search first for codebase-understanding intents, then verify by reading. The implementation must be local and evidence-based.

### F-iter001-005 - Expansion needs a hard cap and precision gate before default enablement

Verdict: ADAPT. LOC estimate: ~50-80 for caps/telemetry/tests on top of F-iter001-002. Dependencies: Phase-005 if evaluated in the broader adoption harness.

Evidence: The current MCP tool defaults to a small `limit=5` with allowed range 1-100 (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:105-110`) and recommends small-limit pagination (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:89-92`). The query implementation already overfetches `fetch_k = unique_k * 4` before dedup (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:297-299`). Multi-query expansion would multiply embedding calls and candidate rows unless bounded. The search-pattern guide warns that low top scores should trigger rephrasing and that weak scores are usually skippable (`.opencode/skills/mcp-coco-index/references/search_patterns.md:174-188`).

Implication: initial cap should be original query plus at most 2 sub-queries, with per-sub-query fetch no larger than the existing `fetch_k` and final output still respecting `limit`/`offset`. Gate expansion behind either an opt-in setting or conservative auto mode: only expand when the query is short/vague or intent terms match known families, and suppress expansion if the original query contains exact identifiers, file paths, quoted strings, regex-like syntax, or explicit grep/exact-match intent.

## Questions Answered

- Can XCE's steering pattern teach when CocoIndex should fire? Yes, but only as an ADAPT: make `mcp-coco-index` a first-action advisor hint for code-location and concept-search intents, using the existing advisor threshold gates (`render.ts:124-133`) and existing CocoIndex scorer signals (`lexical.ts:25-30`; `explicit.ts:55-56`, `154-160`).
- Where should an intent classifier slot in? In `query.py` immediately before `embedder.embed(query, query_prompt_name)` (`query.py:293-295`), so intent and expansions are known before retrieval while preserving the existing row dedup/rank path (`query.py:317-323`).
- Can path classes inform sub-query weighting? Yes. `classify_path()` already emits the needed taxonomy (`indexer.py:53-91`), and query rerank already applies path-class boosts/penalties for implementation intent (`query.py:198-207`).
- What does XCE publicly reveal? It reveals the tool/steering/UX pattern and high-level MCP workflow (`external/README.md:22-28`, `101-119`, `240-243`), not the PRAT internals or concrete intent-router implementation.
- What cap is reasonable? Original query plus at most 2 expansions for a 3-embedding ceiling. This keeps the fanout bounded while allowing examples like "show me error handlers" to probe "exception handling", "try-catch", and "error recovery" as related but not unbounded variants.
- What is the minimal ADAPT LOC? Approximately ~220-320 LOC total: ~25-45 for Phase-004 advisor hint text, ~120-180 for rule-based intent classifier/sub-query expander/result merger, ~70-100 for path-class intent priors, and ~50-80 for gates/telemetry/tests. These overlap, so the practical MVP should target the low end by keeping one local classifier module and reusing `_dedup_and_rank_rows()`.
- How should precision risk be gated? Use conservative triggers, exact-identifier suppression, a 3-query ceiling, small score deltas, ranking signals for transparency, and evaluation before default-on behavior.

## Questions Remaining

- Which sub-query families should ship first: implementation/test/docs only, or include error-handling/security/configuration families in the MVP?
- Should the MCP/CLI API expose expansion controls, or should expansion remain internal and visible only through ranking signals?
- Should expansion telemetry write to an existing feedback ledger in RQ-A3, or stay local to query result ranking signals until the feedback loop is designed?
- What exact precision/recall measurement belongs in Phase-005 versus a smaller CocoIndex-specific fixture suite?

## Next Focus

RQ-A2 - Coco-index rerank fusion with code-graph HLD/LLD. Investigate whether Phase 001's deterministic HLD/LLD narrative can boost CocoIndex results near module-boundary and role-anchor matches, and declare the dependency on Phase 001 explicitly.
