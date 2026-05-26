# Deep Research 023 - Research Report

## Executive Summary
This investigation changes the understanding of the 013-018 arc from "benchmarked and reviewed" to "strong under the current fixture, contingent under future model and operator pressure." The shipped retrieval stack is not obviously broken; the 172-test suite passes and the best benchmark lane reached `14/18`. The blind spots are in assumptions the fixture does not stress: 768d schema lock, prompt-policy metadata, non-commercial model defaults, resource-cost clamps, narrow calibration evidence, and production diagnostics.

Verdict: **CONTINGENT**. The arc is healthy enough to keep, but the next packets should harden architecture and calibration before adding more model adapters.

## Top 5 HIGH-LATENT-RISK findings
1. **Non-768 model pressure collides with 768d schema and global daemon state.**
   - **Evidence**: active schema command returned `embedding float[768]`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:125-142` registers 2048d/1024d candidates; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:317-348` stores one `_embedder`; Jina 1.5B model card reports 1536d/Matryoshka dimensions.
   - **Follow-on packet**: 023A Dimension-flex embedder architecture.

2. **Default reranker has CC BY-NC 4.0 license risk.**
   - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:22-26`; Jina reranker v3 model card `https://huggingface.co/jinaai/jina-reranker-v3` license lines; API command reported `license: cc-by-nc-4.0`.
   - **Follow-on packet**: 023D Operator doctor + model/license UX.

3. **Prompt policy is not first-class index metadata.**
   - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:35-60`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:710-713`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:328`; BGE/Jina/Nomic model cards show model-specific instruction patterns.
   - **Follow-on packet**: 023A Dimension-flex embedder architecture.

4. **Calibration confidence is inflated by narrow fixture and boost dominance.**
   - **Evidence**: synthetic RRF gaps `0.000142-0.000238` versus hybrid boosts `0.01/0.02`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/017-rrf-fusion-and-calibration/evidence/sweep-results.md:21-40`; benchmark report `n=1 pending 3-run confirmation`.
   - **Follow-on packet**: 023B Fixture expansion + calibration study.

5. **Search cost can grow unexpectedly under offset/path/language fanout.**
   - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:149-185`, `:600-620`, `:727-728`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:21-29`.
   - **Follow-on packet**: 023E Adversarial/fuzz tests.

## Top 5 MEDIUM-OPPORTUNITY findings
1. **Residual miss taxonomy is missing.**
   - **Evidence**: benchmark report common misses in `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:104-127`.
   - **Recommended packet**: 023B.

2. **Rerank `top_k=20` lacks sensitivity evidence.**
   - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:22-26`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:818-824`.
   - **Recommended packet**: 023B.

3. **RRF alternatives are untested.**
   - **Evidence**: RRF paper supports RRF as a baseline, but local sweep tied across cells; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py:42-87`.
   - **Recommended packet**: 023B.

4. **Operator model-swap UX needs preflight cost and rollback.**
   - **Evidence**: benchmark reindex rows `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:168-175`; dimension migration text `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:22-27`.
   - **Recommended packet**: 023D.

5. **Observability lacks retrieval-stage diagnostic counters.**
   - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py:61-85`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:112-119`, `:136-140`.
   - **Recommended packet**: 023C.

## Failed hypotheses (null results)
- FTS SQL injection was not supported by the code evidence. `fts_index.py` tokenizes, quotes, and binds `MATCH ?`.
- RRF was not theoretically weak. The original RRF paper gives a credible baseline rationale.
- The current default was not shown to be broken. Tests pass and benchmark evidence supports the default under the corrected fixture.
- Reranker fallback does not necessarily crash searches; it preserves original order, which makes the risk silent quality degradation.
- Symlink/mirror bypass remains unproven. It needs a targeted fixture before being classified as an exploit.

## External landscape position
- **Now**: Nomic CodeRankEmbed is a practical 768d MIT default. Jina reranker v3 is quality-positive but governance-sensitive. Recent code embedders push 1536d/Matryoshka, task-specific prompt policies, and larger model families.
- **3 months**: Re-run model loading smoke tests and license manifest checks against latest `sentence-transformers`, Jina, BGE, Nomic, Salesforce, and Qwen/OASIS candidates.
- **6 months**: Re-benchmark default, best 768d, best dimension-flex local, and best commercial-safe reranker on expanded fixture.
- **12 months**: Revisit schema architecture if 768d models no longer compete on code retrieval.

## Calibration confidence table
| Tunable | Current value | Confidence | Reason | Recommended study |
| --- | ---: | --- | --- | --- |
| RRF `K` | 60 | LOW | Seven-cell sweep tied; full grid not run. | 4x4x4 plus expanded fixture. |
| Vector weight `V` | 0.9 | LOW | Hit pattern did not move in local sweep. | Joint fusion/boost ablation. |
| FTS weight `F` | 0.5 | LOW | Same as above; query classes not stratified. | Query-type slices. |
| Hybrid path shift | 0.01 | LOW | Numerically dwarfs adjacent RRF gaps. | Rank-flip logging. |
| Hybrid canonical boost | 0.02 | LOW | Also dwarfs adjacent RRF gaps. | Rank-flip logging. |
| Vector path/canonical boosts | 0.05/0.10 | MEDIUM-LOW | Tests exist, but sensitivity is not benchmarked. | Vector-only perturbation. |
| Rerank top-K | 20 | MEDIUM-LOW | Winning lane uses it, cutoff not swept. | Top-K 10/20/40/80. |

## Implicit-contract map
| Contract | Evidence | Missing guard |
| --- | --- | --- |
| Registry dimension must match vector table dimension. | `registered_embedders.py:37-39`, schema `float[768]`. | Dimension-aware metadata/table routing. |
| Query prompt policy must match index-time document policy. | `shared.py:35-60`, `indexer.py:328`. | Query+document prompt metadata. |
| Dedup must precede rerank. | `query.py:541-582`, `query.py:818-824`. | Contract test around pipeline order. |
| Reranker fallback must be visible. | `reranker.py:113-198`, `rerankers_jina_v3.py:146-165`. | Structured fallback counters. |
| Daemon loaded config must match project index. | `daemon.py:317-348`, `client.py:524-536`. | Effective config fingerprint. |
| Request cost must be bounded before work. | `query.py:149-185`, `query.py:600-620`, `query.py:727-728`. | Request budget validation. |

## Cross-cutting amplification analysis
- **Schema-lock + new embedders + daemon global mode**: adding a 1536d/2048d model without per-dimension schema and per-project fingerprints risks bad migrations or wrong-model searches.
- **Fixture narrowness + boost dominance + weak telemetry**: a benchmark can stay green while rank flips are dominated by heuristics and future misses are hard to debug.
- **License + stale CLI + reindex cost + silent fallback**: model swaps can become a trust-eroding operator experience unless the CLI explains what model, license, env, and index it is actually using.

## Recommended next-packet stack
1. **023A Dimension-flex embedder architecture** - highest severity; blocks safe addition of future embedders.
2. **023B Fixture expansion + calibration study** - improves evidence quality before tuning more knobs.
3. **023C Retrieval observability** - required to debug production misses and validate 023B.
4. **023D Operator doctor + model-swap UX** - reduces install drift, license surprise, and reindex confusion.
5. **023E Adversarial/fuzz tests** - bounds request cost and chunk/FTS edge behavior.

## Artifact paths
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-007.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-008.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-009.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-010.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/research-report.md`

STATUS=CONTINGENT

