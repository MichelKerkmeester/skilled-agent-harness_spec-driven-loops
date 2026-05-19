# Iteration 004 — Embedder-Agnosticism and Reranker-Agnosticism

## Files reviewed
- `rerankers_jina_v3.py`:1-190 — jina v3 adapter implementation
- `config.py`:28-42 — path-class boost factors
- `reranker.py`:20-47 — path-class boost implementation
- `registered_embedders.py`:55-137 — embedder registry
- `query.py`:473-482 — path-class boost application in hybrid ranking
- `decision-record.md`:993-1029 — ADR-021 reranker verdict

## Findings

### P2 — Path-class boost factors not documented as embedder-agnostic
**File**: `config.py`:29-39
**Evidence**: 
```python
# ADR-015 Phase 2: path-class boost defaults from 011 deep-research iter 10
# Multiplies the cross-encoder score per QueryResult.path_class. Flag-gated by
# COCOINDEX_RERANK_PATH_CLASS_BOOST. Override via COCOINDEX_RERANK_PATH_CLASS_FACTORS.
_DEFAULT_PATH_CLASS_FACTORS: dict[str, float] = {
    "implementation": 1.00,
    "tests": 0.85,
    "docs": 0.85,
    "generated": 0.95,
    "vendor": 0.70,
    "spec_research": 0.90,
}
```
**Why it matters**: The path-class boost factors are hardcoded with values from "011 deep-research iter 10", but there's no documentation about whether these factors are embedder-agnostic or tuned to a specific reranker (BGE). The factors multiply the cross-encoder score, and different rerankers may have different score distributions. If the factors were tuned for BGE reranker, they may not be optimal for jina-v3 or future rerankers. This violates the embedder/reranker-agnosticism principle.
**Suggested fix**: Document whether the path-class boost factors are embedder-agnostic or reranker-specific. If they're tuned to BGE reranker, add a comment explaining this and note that operators using other rerankers should tune the factors via `COCOINDEX_RERANK_PATH_CLASS_FACTORS`. Consider adding a validation check that warns if a non-BGE reranker is used with the default factors.
**Dimension(s)**: embedder-agnosticism, reranker-agnosticism, documentation

### P2 — Jina v3 adapter file header still marks it as "THROWAWAY"
**File**: `rerankers_jina_v3.py`:1-23
**Evidence**: 
```python
"""THROWAWAY jina-reranker-v3 adapter for the 011 Phase 2 diagnostic bench.

This file is DELIBERATELY scoped to the smoke-gate measurement that decides whether
jina-reranker-v3 plausibly outranks BGE+path-class boost on the internal 18-probe
fixture. The 011 deep-research convergence flagged a gap: jina-v3 carries the
highest CoIR NDCG@10 in the candidate pool (63.28 vs BGE 24.86) but was filtered
out at Phase 1 triage on integration-cost grounds without measurement on this
codebase's fixture. This adapter exists ONLY to answer that empirical question.

If jina-v3 dominates path-class boost in the Phase 2 bench → open the production
jina-v3 adapter packet (proper error surfacing, robust batching, test coverage).
If jina-v3 ties or loses → DELETE this file (and its test file) post-investigation.
"""
```
**Why it matters**: The file header explicitly states this is a "THROWAWAY" adapter for the 011 Phase 2 diagnostic bench, and says "If jina-v3 ties or loses → DELETE this file". However, per ADR-021 and the 018 commit, jina-v3 is now the production default reranker. The file header is outdated and contradicts the current production state. This creates confusion about whether the adapter is production-ready or still a diagnostic artifact.
**Suggested fix**: Update the file header to reflect that jina-v3 is now the production default. Remove the "THROWAWAY" language and update the purpose statement. Document that the adapter graduated from diagnostic to production based on ADR-021's empirical verdict. If the adapter lacks production features (error surfacing, robust batching, test coverage), note what's missing and whether it's acceptable for production use.
**Dimension(s)**: reranker-agnosticism, documentation, traceability

### P2 — RRF lock documented as embedder-agnostic but only tested on bge-code-v1
**File**: `config.py`:19-21, `decision-record.md`:918-950
**Evidence**: 
```python
# config.py:19-21
_DEFAULT_HYBRID_VECTOR_WEIGHT = 0.9  # 017 empirical: tied hit rate across V=[0.7,0.9], V=0.9 picks lower p95
_DEFAULT_HYBRID_FTS5_WEIGHT = 0.5  # 017 empirical: tied hit rate across F=[0.5,0.7], F=0.5 picks lower p95
_DEFAULT_HYBRID_RRF_K = 60  # 017 empirical: K=[30,60,90,120] all tied at 12/18 hits; keep canonical 60
```
**Why it matters**: The RRF parameters are locked at (K=60, V=0.9, F=0.5) based on ADR-020's empirical sweep, but the sweep was only run on bge-code-v1 (per ADR-020: "All 7 cells produced IDENTICAL hit rate: 12/18 on baseline-bge lane"). The ADR notes that "fusion tuning is downstream of recall" and the missed probes are at the recall stage, which suggests the parameters might be embedder-agnostic. However, there's no explicit documentation that these parameters generalize to other embedders (nomic, jina-code, etc.). If a future embedder has different recall characteristics, the RRF lock might not be optimal.
**Suggested fix**: Document in ADR-020 or config.py comments that the RRF lock is based on bge-code-v1 only and may need re-sweeping for embedders with different recall profiles. Add a note in the sweep harness documentation recommending re-sweep when changing embedders. Consider making the RRF defaults embedder-specific if empirical evidence shows they don't generalize.
**Dimension(s)**: embedder-agnosticism, reproducibility, documentation

### P2 — Opt-in BGE reranker not tested in post-018 validation
**File**: `decision-record.md`:1025-1029
**Evidence**: ADR-021 documents the reranker matrix bench results:
```
| Lane | Reranker | Path-class | Hit rate | p50 ms | p95 ms |
| B | BAAI/bge-reranker-v2-m3 | OFF | 12/18 | 1758 | 12178 |
| C | BAAI/bge-reranker-v2-m3 | ON | 13/18 | 1726 | 12389 |
| D | jinaai/jina-reranker-v3 | n/a | 14/18 | 2183 | 13938 |
```
The ADR states: "Retain losing adapters as opt-in via env override." However, there's no evidence that the BGE opt-in path was validated after the 018 changes (RRF lock, jina-v3 default). If an operator sets `COCOINDEX_RERANK_MODEL=BAAI/bge-reranker-v2-m3`, will it work correctly with the new RRF defaults and path-class boost logic?
**Why it matters**: The reranker-agnosticism principle requires that opt-in alternatives remain functional. The BGE reranker was the losing candidate in the matrix bench, but it's retained as opt-in. Without validation that the BGE path still works post-018, operators who enable it may encounter unexpected behavior or bugs. This could lead to a false sense of reranker-agnosticism.
**Suggested fix**: Add a test or validation step that verifies the BGE reranker opt-in path works with the post-018 pipeline. Run a quick smoke test with `COCOINDEX_RERANK_MODEL=BAAI/bge-reranker-v2-m3` to ensure it still functions correctly. Document the validation status in the 018 spec folder or ADR-021.
**Dimension(s)**: reranker-agnosticism, tests

### P2 — Embedder registry doesn't document dimension migration requirements
**File**: `registered_embedders.py`:23-50, 94-95
**Evidence**: 
```python
@dataclass(frozen=True)
class EmbedderMetadata:
    dim: int
    """Embedding dimension. Must match the index schema or trigger a re-index on swap."""
    # ...
    EmbedderMetadata(
        name="sbert/dunzhang/stella_en_400M_v5",
        dim=1024,
        # ...
        notes="Small (400M), fast, surprisingly competitive on code + text retrieval. Default 1024d (also supports 768/512). MTEB-strong. Schema migration needed when swapping from 768d default (use vec_1024).",
    ),
```
**Why it matters**: The embedder registry documents dimension requirements for individual embedders, but there's no centralized documentation about the dimension migration process. If an operator switches from the default 768d embedder (nomic-CodeRankEmbed or jina-code-v2) to a 1024d embedder (stella_en_400M_v5 or SFR-Embedding-Code-2B_R), they need to know: (1) how to trigger a re-index, (2) whether the vector table schema needs migration, (3) what the migration process is, (4) whether it's reversible. The current documentation is scattered across individual embedder notes and ADRs.
**Suggested fix**: Add centralized documentation in the embedder registry or INSTALL_GUIDE.md explaining the dimension migration process. Document the command to trigger re-index, the schema migration steps (if any), and the rollback process. Consider adding a validation check that warns if an embedder with a different dimension is selected without a re-index.
**Dimension(s)**: embedder-agnosticism, documentation

## Dimension coverage delta
- correctness: covered
- security: covered
- traceability: covered
- maintainability: partial
- code-quality: not-yet
- architecture: not-yet
- tests: partial
- documentation: partial
- performance: partial
- embedder-agnosticism: covered
- reranker-agnosticism: covered
- reproducibility: partial

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 0
New P2 in this iter: 5
