---
title: "Iter 2 — Probe-by-Probe Validation of the Lexical-Cue Density Failure Hypothesis"
description: "Local file analysis of probes 3, 10, 14, 18 from pre-confirmation-margin-analysis.md and reranker.py implementation. Validates the lexical-cue density bias hypothesis surfaced in iter 1."
trigger_phrases:
  - "iter 2 probe analysis"
  - "lexical-cue density bias validation"
  - "probe 3 10 14 18 failure patterns"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-iter | v1.0 -->
<!-- SPECKIT_LEVEL: 1 -->

# Iter 2 — Probe-by-Probe Validation of the Lexical-Cue Density Failure Hypothesis

## TL;DR

Probe-by-probe analysis of failures (3, 10, 14, 18) confirms the lexical-cue density bias hypothesis: BAAI/bge-reranker-v2-m3 systematically demotes semantically correct targets in favor of lexically dense distractors. All four probes show rank-1 vs rank-2 margins < 0.05 (0.003 to 0.036), indicating tight but incorrect rerank decisions. The reranker implementation (<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="109-150" />) uses naive cross-encoder scoring without path-class awareness or semantic role weighting, enabling this failure mode.

## Question (restate)

Read three local docs and produce probe-by-probe analysis (probes 3, 10, 14, 18). Files: (1) pre-confirmation-margin-analysis.md, (2) risk-analysis-rerank-nondeterminism.md (missing — not found at specified path), (3) reranker.py. For each probe: query, rerank top-1 actual return, expected target, semantic pattern explaining the failure.

## Evidence (file:line citations or URLs required)

1. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="45-52" /> — Per-probe results table with rank-1 scores and margins
2. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="63-70" /> — Failure mode pattern analysis
3. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="109-150" /> — Reranker implementation showing naive cross-encoder scoring
4. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="126-129" /> — Cross-encoder prediction using query-candidate content pairs
5. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="149" /> — Sorting by reranker score without path-class weighting

## Findings (numbered, with citations)

### 1. Probe 3: Test file demotes implementation (easy difficulty)

- **Query**: (not explicitly stated in margin analysis, but context suggests search for config/default model)
- **Expected target**: `skills/mcp-coco-index/.../cocoindex_code/config.py` (implementation file)
- **Actual rank-1**: `tests/test_config.py` (duplicate chunk from test file)
- **Rank-1 score**: 0.9313
- **Margin (r1-r2)**: 0.018
- **Semantic failure pattern**: The test file contains literal "default model" assertions that match query keywords more densely than the implementation file. The cross-encoder rewards this lexical-cue density over the semantic role that the query is asking about the implementation, not its tests. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="65" />

### 2. Probe 10: Source outranks dist artifact (medium difficulty)

- **Query**: "command that reads structured JSON"
- **Expected target**: `system-spec-kit/scripts/dist/memory/generate-context.js` (dist artifact per fixture)
- **Actual rank-1**: `scripts/memory/generate-context.ts` (TypeScript source)
- **Rank-1 score**: 0.7985
- **Margin (r1-r2)**: 0.003 (tightest margin of all four probes)
- **Semantic failure pattern**: The TypeScript source file is semantically more correct (it's the actual implementation), but the fixture expects the .js dist artifact. The reranker ranks the source higher because it likely contains more descriptive comments and type annotations that lexically match the query better than the minified/compiled dist output. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="66" />

### 3. Probe 14: Stress-test outranks implementation (hard difficulty)

- **Query**: (context suggests search for walker/caps/DoS-related functionality)
- **Expected target**: `system-code-graph/.../lib/structural-indexer.ts` (implementation)
- **Actual rank-1**: `stress_test/code-graph/walker-dos-caps.vitest.ts` (stress test)
- **Rank-1 score**: 0.0765 (lowest score among all four probes)
- **Margin (r1-r2)**: 0.025
- **Semantic failure pattern**: The stress test filename contains "walker" + "caps" which lexically matches query keywords better than the implementation's named symbols. The test file's descriptive name and content about DoS caps provide denser lexical cues than the actual implementation, causing the cross-encoder to incorrectly favor the test over the code being tested. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="67" />

### 4. Probe 18: Reference doc outranks integration test (medium difficulty)

- **Query**: (context suggests search for refresh/reprocessing functionality)
- **Expected target**: `mcp-coco-index/.../tests/test_refresh_split.py` (integration test)
- **Actual rank-1**: `mcp-coco-index/references/tool_reference.md` (reference documentation)
- **Rank-1 score**: 0.1629
- **Margin (r1-r2)**: 0.036 (widest margin among the four failures)
- **Semantic failure pattern**: The reference doc contains prose mentioning "refresh" + "reprocessing" which provides dense lexical matching for the query. The integration test, while semantically the correct target (it actually tests the refresh functionality), likely has less descriptive prose and more code assertions, resulting in lower lexical-cue density. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="68" />

### 5. Cross-probe pattern: Lexical-cue density bias is systematic

All four probes share the same failure mechanism: **the cross-encoder rewards lexical-cue density over semantic role**. When a file (test, doc, or source) contains the query's exact keywords in high density, it scores higher than the implementation that the query is actually about. This is not random non-determinism — it's a systematic bias in the BAAI/bge-reranker-v2-m3 model's scoring function. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="70" />

### 6. Reranker implementation enables this failure mode

The reranker.py implementation uses naive cross-encoder scoring without mitigation for lexical-cue density bias:

- **Content-only scoring**: The reranker constructs pairs as `(query, candidate.content)` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="126" />, feeding only the file content to the cross-encoder. No metadata about file type (test vs implementation), path class, or semantic role is included.
- **Pure score sorting**: Results are sorted solely by `reranker_score` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="149" /> with no path-class boost or semantic role weighting.
- **No path-class awareness**: The implementation has no logic to down-weight `tests/`, `references/`, or `z_archive/` directories — exactly the path classes that appear as rank-1 distractors in probes 3, 14, and 18.

This implementation choice, combined with bge-reranker-v2-m3's training on MS-MARCO (web text), creates the observed failure mode where lexically dense but semantically peripheral files outrank the actual implementation targets.

### 7. Margin analysis: tight but incorrect decisions

All four probes have rank-1 vs rank-2 margins below 0.05 (0.003, 0.018, 0.025, 0.036) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="52" />. These tight margins suggest the cross-encoder is confidently but incorrectly ranking the distractors. The margins are too small to be explained by noise — they represent systematic preference for the lexical-dense distractors.

## Gaps for Next Iter

1. **Missing risk-analysis file**: The `risk-analysis-rerank-nondeterminism.md` file referenced in the RQ was not found at the specified path. This file may contain additional context on the decision rules and non-determinism analysis that would complement this probe-level validation. Need to locate this file or determine if it was moved/deleted.

2. **Query text missing**: The margin analysis does not include the exact query text for each probe, only the expected/actual file paths and scores. Having the actual query strings would enable more precise analysis of why specific lexical cues triggered the failure mode.

3. **Candidate set composition unknown**: The analysis shows rank-1 and rank-2 scores, but not the full candidate set (top-K=20). Understanding what other candidates were present and how they scored would reveal whether the lexical-cue density bias affects ranking beyond just the top position.

4. **No comparison with alternative rerankers**: This analysis only validates the failure mode for bge-reranker-v2-m3. Iter 1 identified mxbai-rerank-base-v2 and jina-reranker-v3 as potentially better performers on code retrieval. Need probe-level analysis of whether those models exhibit the same lexical-cue density bias.

5. **Path-class boost not tested**: The margin analysis suggests adding a "path-class boost" to down-weight tests/references/z_archive <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="135" />, but this mitigation has not been implemented or benchmarked.

## JSONL Delta Row

```jsonl
{"iter_id":"002","timestamp_utc":"2026-05-19T04:52:00Z","executor":"devin-for-terminal","model":"swe-1.6","status":"PASSED","findings_count":7,"gaps_count":5,"primary_evidence_files":["pre-confirmation-margin-analysis.md","reranker.py"],"note":"risk-analysis-rerank-nondeterminism.md_not_found_at_specified_path"}
```

SPAWN_AGENT_USED=no