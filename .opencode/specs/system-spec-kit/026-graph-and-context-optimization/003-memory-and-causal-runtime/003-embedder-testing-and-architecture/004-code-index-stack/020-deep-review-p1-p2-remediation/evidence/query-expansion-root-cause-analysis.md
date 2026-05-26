# Query Expansion Regression Root-Cause Analysis

## Scope

This note addresses P1-I from the 019 deep review: packet 016 shipped deterministic query expansion as opt-in because the corrected fixture regressed, but the regression mechanism was not explicit enough for future operators.

Reviewed sources:
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query_expansion.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/baseline-bge-nomic-coderankembed.rerank-scores.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/baseline-bge-rrf-K120-V0p7-F0p7.rerank-scores.jsonl`

## Finding

The most likely root cause is surface displacement from broad FTS5 and dense fanout expansion. Query expansion creates identifier spellings and synonyms without path-class constraints, then sends the enlarged candidate set through dense and lexical retrieval. On this corpus, that admits tests and docs that match the expanded terms better than the intended implementation file.

Concrete examples:
- Probe 15, `query-time path class adjustment that favors implementation files over generated copies`, expects `cocoindex_code/query.py`. In `baseline-bge-nomic-coderankembed.rerank-scores.jsonl`, high-ranked candidates include `references/tool_reference.md` and `tests/test_query_expansion.py`, and `query.py` appears lower in the candidate list.
- Probe 9, `declarative list of vetted sentence transformer candidates for local code search`, expects `registered_embedders.py`. The same evidence shows `references/embedder-pluggability.md` outranking `registered_embedders.py`, while `query_expansion.py` also enters the candidate pool.
- `query_expansion.py` lines 187-198 build the dense variant pool by appending synonym phrases and identifier variants; lines 243-249 send the full variant pool into FTS5 OR terms. That broadens recall but does not distinguish implementation files from docs or tests.

## Hypotheses Considered

1. **Test/doc displacement**: Expanded terms match explanatory docs and tests strongly, displacing implementation files before rerank. Evidence supports this in probes 9 and 15.
2. **FTS5 over-matching**: The expanded OR clause increases lexical matches across non-implementation surfaces. Evidence supports this because `_build_fts5_clause()` includes original words plus every variant.
3. **Dense-fanout score noise**: Serially embedding variants can promote identifier spellings that are semantically adjacent but not the user intent. Evidence is plausible but secondary; the visible failures point more directly at surface class displacement.

## Conclusion

The regression is not a syntax bug in query expansion. It is an unconstrained recall-broadening problem: expansion adds candidates, but the pipeline lacks a path-class-aware admission rule that keeps implementation targets ahead of docs and tests. Keeping `COCOINDEX_QUERY_EXPANSION=false` is the correct production default until a follow-on packet tests path-class-aware expansion or implementation-only expansion.

## Deferred Fix Direction

The next research pass should test:
- Expansion only when the query has implementation intent.
- Expansion applied to implementation path classes before docs/tests.
- FTS5 expansion terms weighted or split so exact original tokens cannot be swamped by generated variants.
