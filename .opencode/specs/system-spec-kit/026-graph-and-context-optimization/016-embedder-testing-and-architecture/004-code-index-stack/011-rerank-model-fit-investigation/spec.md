---
title: "Spec: 016/004/011 Rerank Model Fit Investigation"
description: "Investigate whether BAAI/bge-reranker-v2-m3 is the right cross-encoder for code-retrieval queries on a 4-mirror codebase. The May 18 evening instrumented bench surfaced a structural failure mode: the reranker demotes implementations below tests/refs on paraphrase-heavy queries (lexical-cue density rewarded over semantic role). This packet researches alternative cross-encoder reranker models trained on code (or code-adjacent retrieval), measures the four failure-case probes (3, 10, 14, 18) against the alternatives, and recommends a swap if any alternative materially improves the failure-mode pattern."
trigger_phrases:
  - "rerank model fit"
  - "cross-encoder code retrieval"
  - "BGE-reranker v2 m3 fit"
  - "code-tuned reranker investigation"
  - "lexical density rerank failure"
  - "016/004/011 reranker swap research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation"
    last_updated_at: "2026-05-18T19:23:09Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded research-only packet"
    next_safe_action: "Execute Phase 1 per plan.md"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004011"
      session_id: "016-004-011"
      parent_session_id: null
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/004/011 Rerank Model Fit Investigation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (2026-05-18 evening) |
| Type | Research-only HF survey + targeted bench (4 failure probes only, not full 18) |
| Owner | Main agent |
| Parent | `../spec.md` (004-code-index-stack) |
| Power dependency | Light — targeted bench is ~10 min × N candidates, not the full 80-110 min |
| Triggered by | `../../007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md` §7.3 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The May 18 evening instrumented bench (per `pre-confirmation-margin-analysis.md`) found that with `BAAI/bge-reranker-v2-m3` actually firing in the CocoIndex pipeline, four probes consistently fail in a structural pattern:

| Probe | Failure pattern |
|---|---|
| 3 | Test file outranks production file (`tests/test_config.py` > `cocoindex_code/config.py`) |
| 10 | `.ts` source outranks `.js` dist artifact |
| 14 | Stress-test name outranks implementation (`walker-dos-caps.vitest.ts` > `structural-indexer.ts`) |
| 18 | Reference doc outranks integration test (`tool_reference.md` > `test_refresh_split.py`) |

Common thread: **the cross-encoder rewards lexical-cue density over semantic role.** BGE-reranker-v2-m3 was trained for general text retrieval, not code. Its scoring function appears to favor surface-token matches (where "walker" or "refresh" appears literally) over the implementation that the query is conceptually *about*.

This packet researches code-aware cross-encoder alternatives, measures them against the four failure probes, and recommends a swap if any alternative materially improves the pattern.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **HuggingFace survey** for cross-encoder rerankers trained on code retrieval, code-text pairs, or hard-negative code training. Candidates worth investigating (subject to availability/license):
  - `BAAI/bge-reranker-large` / `bge-reranker-base` (current is v2-m3 multilingual; smaller english variants may fit code better)
  - `mixedbread-ai/mxbai-rerank-large-v1` / `v2`
  - Salesforce code-related embedders (some have reranker variants)
  - Voyage code re-ranker (API-only — note that for local-first work)
  - Cohere Rerank 3 (API-only — for reference comparison)
  - Any `bge-code-reranker` if it exists (was not in the May 18 surveyed pool)
- **Targeted re-bench**: for each viable candidate, swap the reranker via `COCOINDEX_RERANK_MODEL` env var and run ONLY the 4 failure probes (3, 10, 14, 18) plus a control set of 4 probes that the current reranker hits correctly. Total ~8 probes × N candidates = small bench.
- **Failure-mode analysis**: for each alternative, capture the per-probe top-K cross-encoder scores via the existing `_maybe_log_scores` instrumentation. Same JSONL format as `benchmark-2026-05-18/rerank-scores-instrumented.jsonl`.
- **Decision write**: SWAP / HOLD recommendation with rationale.

Out of scope:
- Training a custom reranker (not in this packet's budget; could be a future packet if no off-the-shelf model wins).
- Full 18-pair re-bench across all candidates (use targeted 8-probe to keep wall under 30 min total).
- Changing the embedder default (separate decision — `007/003` handles that).
- Fixture rewrites (separate packet — `012-fixture-audit-10-probes`).
- Path-class re-weighting / boost approach (a different mitigation; can scaffold as 016/004/013 later if reranker swap doesn't fully solve).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `research.md` lists 3-6 candidate cross-encoder rerankers with size/training-data/license/Apple-Silicon-compatible properties. |
| R2 | For each viable candidate, targeted 8-probe bench results (CSV + JSONL) committed to `evidence/`. |
| R3 | Per-probe rank-1 path + cross-encoder score recorded so the failure-mode pattern can be compared across candidates. |
| R4 | Explicit SWAP / HOLD / NEEDS-CUSTOM recommendation in `implementation-summary.md`. |
| R5 | If SWAP: PR-ready change to `cocoindex_code/config.py`'s `_DEFAULT_RERANK_MODEL` + doc updates. |
| R6 | Strict-validate PASSED on this packet. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## SUCCESS CRITERIA

- All requirements satisfied per §4.
- Research evidence committed under `evidence/`.
- Strict-validate PASSED on this packet.
- Recommendation (SWAP/HOLD/NEEDS-CUSTOM for 011, or CHANGE/KEEP/AMBIGUOUS for 012) documented with rationale.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 5. APPROACH

1. **HF crawl** for cross-encoder rerankers — filter by recency (post-2024), training data (code or code-adjacent), size (≤1B params for laptop fit), Apple Silicon compatibility (no xformers gate).
2. **Triage** with SKIP / CONSIDER / MEASURE rubric similar to 007/004-newer-text-embedders-survey.
3. **Per MEASURE candidate**: set `COCOINDEX_RERANK_MODEL=<candidate-id>` + `COCOINDEX_RERANK_LOG_PATH=evidence/rerank-scores-<candidate>.jsonl`, kill daemon, run `ccc reset --force && ccc index` (only the index can re-use; reranker swap doesn't need a full re-index), then run 8 targeted probes via the bench harness's Python probe block (or a smaller script).
4. **Compare**: did the alternative get any of probes 3/10/14/18 right? Did it regress any of the 4 control hits? What's the score margin pattern?
5. **Recommend**: if any alternative fixes ≥2 of the 4 failure probes without regressing control hits → SWAP. If marginal improvement only → HOLD + flag as TODO for retraining or path-class boost.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **No code-tuned reranker exists.** General-text rerankers may all share the same lexical bias. If so, the conclusion is "off-the-shelf rerank doesn't solve this; need path-class boost or custom training".
- **Apple Silicon compatibility.** Some rerankers may have the same xformers issue stella had. Check before downloading.
- **Reranker swap with same embeddings.** Swapping just the reranker keeps the existing vec_768 / vec_1024 index intact — no re-index needed. Fast iteration.

Dependencies:
- `cocoindex_code/reranker.py` — already configurable via `COCOINDEX_RERANK_MODEL` env var
- The instrumented score logger (already in reranker.py from this session)
- Pipx editable install + harness `$CCC` resolution (from `016/005/005`)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is there a "bge-code-reranker" or "codesage-reranker" or "qodo-reranker" available? (HF crawl in step 1)
- Does Voyage's API have an offline-equivalent cross-encoder? (API-only is OK for reference but not for production local-first work)
- Should the targeted bench use only the 4 failure probes, or include 4 control hits + 4 universal-floor (always-hit) probes as a "rerank isn't regressing other things" check?
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 8. CROSS-LINKS

- **Failure-mode source:** `../../007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md` §4 (Failure Mode Pattern)
- **Sibling investigation:** `../012-fixture-audit-10-probes/` — orthogonal angle on the same data (does the fixture have wrong expected paths)
- **Risk analysis context:** `004-extended-bake-off/risk-analysis-rerank-nondeterminism.md` (predates this finding; the structural problem is bigger than non-determinism)
- **Install hygiene fix that made this measurable:** `../../005-cross-cutting-quality/005-cocoindex-install-hygiene/`
<!-- /ANCHOR:cross-links -->
