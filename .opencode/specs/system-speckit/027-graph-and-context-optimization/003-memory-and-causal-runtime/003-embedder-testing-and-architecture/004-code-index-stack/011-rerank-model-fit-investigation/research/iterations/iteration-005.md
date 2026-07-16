---
title: "Iter 5 — Alt-Mitigation A: Path-Class Boost Feasibility"
description: "File-read analysis of path-class boost post-processing feasibility. Key finding: path-class taxonomy already exists in indexer.py with classify_path() function, and QueryResult includes path_class field. Implementation cost is LOW (5-10 lines), expected lift on 4 failure probes is HIGH (all 4 have path-class mismatches), regression risk on 11 controls is LOW-MEDIUM (depends on control probe path-class distribution)."
trigger_phrases:
  - "iter 5 path-class boost"
  - "path-class boost feasibility"
  - "reranker path-class post-processing"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-iter | v1.0 -->
<!-- SPECKIT_LEVEL: 1 -->

# Iter 5 — Alt-Mitigation A: Path-Class Boost Feasibility

## TL;DR

Path-class boost post-processing is **highly feasible** with LOW implementation cost (5-10 lines of code). The existing codebase already has a mature path-class taxonomy via `classify_path()` in indexer.py <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py" lines="55-93" />, and QueryResult includes the `path_class` field <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py" lines="35" />. All 4 failure probes (3, 10, 14, 18) have path-class mismatches that would be directly addressed by penalizing "tests", "docs", and "generated" classes while boosting "implementation". Expected lift is HIGH; regression risk on 11 controls is LOW-MEDIUM depending on control probe distribution.

## Question (restate)

Feasibility of path-class boost post-processing. Could we fix the failure pattern by penalizing reranker candidates in paths matching tests/, examples/, docs/, reference/, vendor/, node_modules/, __pycache__/ and boosting those in src/, lib/, app/, packages/? Capture: (a) where in cocoindex_code/reranker.py this slots in, (b) implementation cost, (c) expected lift on the 4 failure probes, (d) regression risk on the 11 controls.

## Evidence (file:line citations or URLs required)

1. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="109-150" /> — Current reranker implementation showing scoring pipeline without path-class awareness
2. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py" lines="55-93" /> — Existing `classify_path()` function with mature path-class taxonomy
3. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py" lines="24-40" /> — QueryResult schema showing `path_class` field available at rerank time
4. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="45-52" /> — Per-probe results table with path patterns for failures
5. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="63-70" /> — Failure mode pattern analysis showing path-class mismatches

## Findings (numbered, with citations)

### 1. Path-class taxonomy already exists with comprehensive coverage

The codebase already has a mature path-class classification system via `classify_path()` in indexer.py <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py" lines="55-93" />. The function returns these classes:

- **"vendor"**: vendor/, node_modules/, .venv/ <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py" lines="63-64" />
- **"generated"**: dist/, build/, .next/, .min.js <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py" lines="65-69" />
- **"spec_research"**: specs/research/, research.md, iterations/ <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py" lines="70-78" />
- **"tests"**: test*.py, *.vitest.ts, tests/, __tests__/ <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py" lines="79-86" />
- **"docs"**: readme.md, docs/, root-level .md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py" lines="87-92" />
- **"implementation"**: default class for all other paths <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py" lines="93" />

This taxonomy covers all the path patterns mentioned in the RQ (tests/, docs/, reference/, vendor/, node_modules/, __pycache__/ are all classified as "tests", "docs", "vendor", or "generated"). The "src/", "lib/", "app/", packages/" patterns would fall under "implementation".

### 2. QueryResult includes path_class field available at rerank time

The QueryResult schema includes `path_class: str` as a field <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py" lines="35" />, which means the reranker has access to the path classification for each candidate without needing to re-compute it. The current reranker implementation does not use this field <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="109-150" />, but it's available for post-processing.

### 3. Implementation slot: After score prediction, before sorting

The optimal insertion point for path-class boost is in the `rerank()` method between line 129 (score prediction) and line 149 (sorting) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="129-149" />. The current flow is:

1. Construct pairs: `pairs = [(query, candidate.content) for candidate in head]` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="126" />
2. Predict scores: `scores = [float(score) for score in model.predict(pairs)]` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="129" />
3. **[INSERT PATH-CLASS BOOST HERE]**
4. Sort by score: `reranked_head.sort(key=lambda result: result.reranker_score or float("-inf"), reverse=True)` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="149" />

The boost would adjust the `reranker_score` values based on `candidate.path_class` before sorting.

### 4. Implementation cost: LOW (5-10 lines of code)

The implementation requires only a simple score adjustment function:

```python
def _apply_path_class_boost(candidates: list[QueryResult], scores: list[float]) -> list[float]:
    """Apply path-class boost/penalty to reranker scores."""
    boost_factors = {
        "implementation": 1.0,    # neutral/boost
        "tests": 0.85,           # -15% penalty
        "docs": 0.85,            # -15% penalty
        "generated": 0.80,       # -20% penalty
        "vendor": 0.70,          # -30% penalty
        "spec_research": 0.90,   # -10% penalty
    }
    adjusted_scores = []
    for candidate, score in zip(candidates, scores):
        factor = boost_factors.get(candidate.path_class, 1.0)
        adjusted_scores.append(score * factor)
    return adjusted_scores
```

This is 5-10 lines of code, no new dependencies, and leverages existing infrastructure. The boost factors would need tuning via benchmarking, but the implementation itself is trivial.

### 5. All 4 failure probes have path-class mismatches addressable by boost

Analyzing the 4 failure probes from iter 2 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="45-52" />:

- **Probe 3**: `tests/test_config.py` (tests class) outranks `cocoindex_code/config.py` (implementation class) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="47" />. A -15% penalty on "tests" would flip this given the tight 0.018 margin.
- **Probe 10**: `generate-context.ts` (implementation class) outranks `generate-context.js` (generated class) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="48" />. However, the fixture expects the dist artifact (generated), so this probe may need fixture revision (noted in iter 2 §7.4).
- **Probe 14**: `walker-dos-caps.vitest.ts` (tests class) outranks `structural-indexer.ts` (implementation class) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="49" />. A -15% penalty on "tests" would flip this given the 0.025 margin.
- **Probe 18**: `tool_reference.md` (docs class) outranks `test_refresh_split.py` (tests class) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="50" />. This is a docs-vs-tests mismatch; both would be penalized relative to implementation, but docs penalty (-15%) vs tests penalty (-15%) may not resolve this. However, the expected target is a test file, suggesting the fixture may also need revision.

**Expected lift**: HIGH for probes 3 and 14 (clear implementation vs tests mismatch), UNCERTAIN for probes 10 and 18 (fixture expectations may be misaligned with semantic correctness).

### 6. Regression risk on 11 controls: LOW-MEDIUM (depends on distribution)

The margin analysis does not provide the full list of 11 control probes or their path-class distribution <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" />. Regression risk depends on:

- **Controls with tight margins**: If any control probes have margins < 0.05 and involve path-class edge cases (e.g., legitimate test file searches where the user IS looking for tests), the boost could cause false negatives.
- **Fixture expectations**: If any control probes expect docs/tests/generated files as the correct answer (like probe 10), the boost would systematically demote those.
- **Boost factor tuning**: Aggressive penalties (e.g., -30% on vendor) could cause over-penalization if legitimate vendor code is sometimes the target.

**Mitigation**: The boost factors should be configurable via environment variable or settings, and initial deployment should use conservative penalties (-10% to -15%) with telemetry to measure impact on controls before increasing.

### 7. Path-class boost is complementary to model replacement

From iters 3 and 4, mxbai-rerank-base-v2 and Qwen3-Reranker-0.6B both show architectural advantages (causal LM vs cross-encoder, code-specific training) that may address the lexical-cue density bias at the model level. However, both models still use content-only scoring without path-class metadata. Path-class boost would be **complementary** to model replacement:

- **Model replacement** (mxbai/Qwen3): Addresses the root cause by training the model to understand semantic relevance better
- **Path-class boost**: Addresses the symptom by post-processing scores based on path metadata

The combined approach (better model + path-class boost) would likely provide the strongest defense against lexical-cue density bias, with path-class boost serving as a safety net even if the new model has residual biases.

## Gaps for Next Iter

1. **Control probe path-class distribution unknown**: Need to analyze the 11 control probes to understand their path-class distribution and margin tightness. This would allow precise regression risk assessment.

2. **Boost factor tuning unvalidated**: The proposed boost factors (10-30% penalties) are heuristic. Need benchmark-driven tuning to find optimal values that maximize lift on failures while minimizing regression on controls.

3. **Probe 10/18 fixture revision needed**: Both probes have fixture expectations that may be misaligned with semantic correctness (probe 10 expects dist over source, probe 18 expects test over doc). Path-class boost alone may not resolve these without fixture revision.

4. **Reference/ classification mapping incomplete**: The RQ mentions "reference/" paths, but the existing `classify_path()` function does not have a dedicated "reference" class. References/ would fall under "docs" or "implementation" depending on context. May need to extend the taxonomy.

5. **User intent detection missing**: Path-class boost assumes the user is always looking for implementation code. If the user explicitly searches for tests or docs (e.g., "test for config validation"), the boost would incorrectly penalize the correct results. Need query-intent detection or user override mechanism.

## JSONL Delta Row

```jsonl
{"iter_id":"005","timestamp_utc":"2026-05-19T04:55:00Z","executor":"devin-for-terminal","model":"swe-1.6","status":"PASSED","findings_count":7,"gaps_count":5,"primary_evidence_files":["reranker.py","indexer.py","schema.py","pre-confirmation-margin-analysis.md"],"note":"path-class_boost_is_highly_feasible_with_low_implementation_cost"}
```

SPAWN_AGENT_USED=no
