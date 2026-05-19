# Iteration 012 - Reranker license quantitative falsification [PASS-2]

## Pass 1 claim under attack
- HIGH-LATENT-RISK #2 / FINDING-002-B: default `jinaai/jina-reranker-v3` has CC BY-NC 4.0 license risk.

## Hypotheses going in
- H1: The claim is overstated if commercial-safe reranker alternatives are already abundant and easy to configure.
- H2: The claim survives if the default silently binds commercial operators before they see a warning.

## Evidence gathered
- Code evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:22-25` sets `_DEFAULT_RERANK_MODEL = "jinaai/jina-reranker-v3"` and `_DEFAULT_RERANK_TOP_K = 20`.
- Hugging Face API command output:
  - `jinaai/jina-reranker-v3`: `license "cc-by-nc-4.0"`, `downloads 1152318`.
  - `BAAI/bge-reranker-v2-m3`: `license "apache-2.0"`, `downloads 11922916`.
  - `mixedbread-ai/mxbai-rerank-base-v2`: `license "apache-2.0"`, `downloads 58755`.
  - `Qwen/Qwen3-Reranker-0.6B`: `license "apache-2.0"`, `downloads 1389535`.
  - `Alibaba-NLP/gte-multilingual-reranker-base`: `license "apache-2.0"`, `downloads 174601`.
- External evidence: Creative Commons deed for CC BY-NC 4.0 states the NonCommercial term: `https://creativecommons.org/licenses/by-nc/4.0/`.
- External evidence: Apache License 2.0 grants copyright and patent permissions for use, reproduction, distribution, and derivative works subject to terms: `https://www.apache.org/licenses/LICENSE-2.0`.
- Benchmark evidence: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:91-100` shows BGE reranker lanes are lower recall than Jina on the fixture but still viable opt-ins: `12/18` or `13/18` versus Jina `14/18`.

## Pass-1 attack outcome
- [FALSIFIED]: The strongest version of Pass 1 - "commercial-safe reranking is unavailable" - is false. At least four checked rerankers report Apache-2.0 licenses via Hugging Face API.
- [STRENGTHENED]: The actual risk is narrower and sharper: default UX and license disclosure. Users can avoid the license, but the system does not force that decision before enabling Jina.

## Findings (severity-tagged)
- **FINDING-012-A** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: FALSIFIES-#2]:
  - **What**: The license problem is not a lack of alternatives. `4/5` checked non-Jina reranker alternatives report Apache-2.0, including the previous BGE default.
  - **Why Pass 1 / deep-review missed this**: Pass 1 verified Jina's license but did not map the alternative reranker license set.
  - **Evidence**: Hugging Face API command output above; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:91-100`.
  - **What to do**: Keep Jina as a high-quality opt-in/default only when accepted, and expose BGE/Qwen/mxbai/GTE as commercial-safe alternatives.

- **FINDING-012-B** [severity: HIGH-LATENT-RISK] [Pass-1 relation: STRENGTHENS-#2]:
  - **What**: A non-commercial model remains the default. Commercial operators are bound if they run default-on rerank in a commercial context without noticing the model license.
  - **Why Pass 1 / deep-review missed this**: The benchmark optimized quality. It did not require a startup license gate or model manifest.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:22-25`; Hugging Face API output for `jinaai/jina-reranker-v3`; Creative Commons URL above.
  - **What to do**: Add a model-license manifest and a `ccc doctor license` preflight. For non-commercial defaults, print a one-time warning and a config snippet for Apache alternatives.

- **FINDING-012-C** [severity: LOW-CURIOSITY] [Pass-1 relation: ORTHOGONAL]:
  - **What**: The quality/license frontier is measurable: Jina buys `+1` to `+2` fixture hits over commercial-safe BGE lanes in the current report, not an unknowable governance trade.
  - **Why Pass 1 / deep-review missed this**: The report listed the benchmark matrix and the license finding separately.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:91-100`; Hugging Face API output above.
  - **What to do**: Add a docs table: model, license, fixture hits, p50/p95, recommended operator profile.

## Hypotheses that FAILED falsification (valuable!)
- "Jina is the only viable reranker" failed against BGE/Qwen/mxbai/GTE license and download data.
- "The license risk disappears because alternatives exist" failed because the default is still CC BY-NC.

## Updates to research-pass-2.md
- Added license scorecard and downgraded the risk from "no alternatives" to "default-model governance gate missing."

## NO-EARLY-STOP confirmation
- Iteration <= 20: continuing to next iter.

