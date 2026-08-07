---
title: "Code Index Stack Phase 011: Rerank Model Fit Investigation"
description: "Two-phase research investigation into whether BAAI/bge-reranker-v2-m3 is the right cross-encoder for code-retrieval queries. Phase 1 surveyed HuggingFace candidates. Phase 2 ran a full-18-probe bench across three lanes. Verdict: HOLD. Off-the-shelf reranker swaps did not resolve the structural failure mode. Path-class boost and fixture corrections were identified as the next actions."
trigger_phrases:
  - "rerank model fit investigation"
  - "bge-reranker v2 m3 code retrieval"
  - "cross-encoder lexical density failure"
  - "path-class boost reranker research"
  - "mxbai jina reranker bench verdict"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

The May 18 instrumented bench revealed that `BAAI/bge-reranker-v2-m3` consistently demoted production implementations below tests and reference documents on four probes (3, 10, 14, 18). The failure pattern traced to the cross-encoder scoring `(query, content)` while ignoring candidate path-role metadata, rewarding lexical-cue density over semantic role.

Phase 1 surveyed HuggingFace cross-encoder rerankers trained on code or code-adjacent retrieval. It triaged eight candidates and selected `mixedbread-ai/mxbai-rerank-base-v2` and `Qwen/Qwen3-Reranker-0.6B` as MEASURE candidates, with `hq-bench/coreb-code-reranker` filed as a NEEDS-CUSTOM follow-on.

Phase 2 ran a full-18-probe bench across three lanes: baseline BGE, BGE with path-class boost plus jina-v3. The corrected run (using `code-retrieval-fixture-corrected.json` with a hardened path extractor) showed all three lanes hitting 14 of 18 probes with zero failure flips relative to the corrected baseline. The verdict was HOLD for both path-class boost and the jina-v3 candidate: neither produced net lift over the corrected baseline at full-18 scope. The investigation surfaced that three of the four original failure probes were harness or fixture artifacts, not genuine reranker failures. Probes 1, 12 and 15 remain genuine misses across all lanes.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

- 10 iteration files (`iteration-001.md` through `iteration-010.md`) in `research/iterations/`.
- `research/deep-research-state.jsonl` externalized state across all iterations.
- `research/research-convergence.md` final verdict document with candidate ranking and Phase 2 bench order.
- `research/phase2-bench/` containing per-lane JSONL result files for baseline-bge, bge-path-class plus jina-v3 across 14 fixture variants.
- `research/phase2-bench/phase2-comparison.md` initial 8-probe comparison (bge-path-class FAILS, jina-v3 HOLDS with 1 control regression).
- `research/phase2-bench/phase2-comparison-corrected.md` corrected full-18 comparison (all three lanes 14/18, zero failure flips, verdict HOLD for all candidates).
- `research/phase2-bench/phase2-comparison-baseline-vs-corrected-delta.md` audit of harness and fixture corrections that recovered 3 previously mis-measured probes.
- Strict-validate PASSED on this packet (per `implementation-summary.md` verification section).

### Files Changed

| File | What changed |
|------|--------------|
| `research/research-convergence.md` (NEW) | Final verdict. Candidate ranking, Phase 2 bench order, decision rubric, SWAP/HOLD/NEEDS-CUSTOM criteria plus follow-on packet recommendations. |
| `research/iterations/iteration-001.md` through `iteration-010.md` (NEW) | Per-iteration pass narratives from the deep-research loop. |
| `research/deep-research-state.jsonl` (NEW) | Externalized research loop state across all 10 iterations. |
| `research/phase2-bench/phase2-comparison.md` (NEW) | Initial 8-probe comparison across baseline-bge, bge-path-class plus jina-v3. |
| `research/phase2-bench/phase2-comparison-corrected.md` (NEW) | Corrected full-18 comparison with hardened harness and fixture. |
| `research/phase2-bench/phase2-comparison-baseline-vs-corrected-delta.md` (NEW) | Per-probe delta audit: harness fixes, fixture corrections plus residual misses. |
| `research/phase2-bench/baseline-bge.results.jsonl` and variants (NEW) | Per-lane JSONL result files for all fixture variants measured in Phase 2. |
| `research/phase2-bench/code-retrieval-fixture-corrected.json` (NEW) | Corrected fixture with probe 10 expected path changed from `**/dist` artifact to indexed TypeScript source. |
| `research.md` (NEW) | Phase 1 candidate survey: triage rubric, per-candidate verdict table, screened-out notes, Phase 2 measure commands plus Phase 1 recommendation. |

### Follow-Ups

- Open a path-role calibration packet to implement query-intent detection, `reference/` classification, factor tuning plus control-aware path priors.
- Open a custom reranker adapter packet to add causal-LM scoring, chat-template support, explicit warmup plus error surfacing for mxbai and Qwen3.
- Continue probe 1 and probe 12 investigation in the fixture audit packet (012) to determine whether those are genuine reranker failures or additional fixture-truth issues.
- Verify `cocoindex_code/rerankers_jina_v3.py` and `tests/test_rerankers_jina_v3.py` are deleted because jina-v3 tied the baseline without improvement.
