---
title: "Spec: 016/013/003 bge-code-v1 3-Run Confirmation + Promote"
description: "Re-run the 4-candidate code-embedder bench 3× to confirm bge-code-v1's 11/18 = 61.1% lead is reproducible. If 3/3 runs land at ≥10/18 (no run drops to the 9/18 noise plateau), swap CocoIndex's _DEFAULT_MODEL from jina-code to bge-code-v1 + update INSTALL_GUIDE / feature_catalog / CHANGELOG."
trigger_phrases:
  - "016/013/003 bge-code-v1 promote"
  - "bge-code-v1 3-run confirmation"
  - "cocoindex default swap"
  - "code embedder default change"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/013/003 bge-code-v1 Confirmation + Promote

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (2026-05-18) |
| Type | Bench + small config edit |
| Owner | Main agent |
| Parent | `../spec.md` (013-ollama-and-bge-promotion-arc) |
| Power dependency | Yes — ~3-4 hours wall, schedule when plugged in |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 004-extended-bake-off measured bge-code-v1 at **11/18 = 61.1%** — a +2-pair lead over the 9/18 three-way tie. The lead is well above the historical noise floor (~2pp from `113/005`), but:

- Only 4 unique probes account for the entire gap. Any of those could be fragile to retry variance.
- Cross-encoder reranker has tiny non-determinism (`torch.use_deterministic_algorithms` not set).
- LMDB read order can shift on warm vs cold daemon starts.

Before swapping the production default in `cocoindex_code/config.py:11`, we want 3 independent runs that all land at ≥10/18 for bge-code-v1.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- Run `evidence/run-extended-bake-off-with-hybrid-rerank.sh` 3 times against the 4 measured candidates (jina-code, gemma-300m, nomic-CodeRankEmbed, bge-code-v1).
- Capture each run's CSV to a separate file (`evidence/run-1.csv`, `run-2.csv`, `run-3.csv`).
- Calculate per-candidate variance (min / median / max hit rate across 3 runs).
- IF bge-code-v1's min hit rate across 3 runs ≥ 10/18 AND median ≥ 10/18 → **PROMOTE**:
  1. Edit `cocoindex_code/config.py:11` — change `_DEFAULT_MODEL` from `sbert/jinaai/jina-embeddings-v2-base-code` to `sbert/BAAI/bge-code-v1`.
  2. Update `cocoindex_code/registered_embedders.py:54-62` — move bge-code-v1 entry above jina-code, mark as DEFAULT in notes.
  3. Update `INSTALL_GUIDE.md` references to default embedder.
  4. Update `feature_catalog/` entries.
  5. Update CHANGELOG.md with the promotion record.
  6. Run final smoke search to verify swap works.
- IF any of 3 runs drops to 9/18 or below → **HOLD** at jina-code, document the decision in implementation-summary.md.

Out of scope:
- Adding new candidates (already done by 004-extended-bake-off).
- Bench harness refactoring (use the existing script as-is).
- Promoting in mk-spec-memory (separate concern — 004-newer-text-embedders-survey sub-phase).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | 3 separate CSV files, each with 4 candidate rows, committed to `evidence/`. |
| R2 | Aggregated variance table in `implementation-summary.md` showing min/median/max per candidate. |
| R3 | Explicit PROMOTE or HOLD decision documented with rationale. |
| R4 | If PROMOTE: config + registry + 3 doc files updated in a single coherent commit. |
| R5 | Smoke search post-promote returns expected paths for at least 5 probes. |
| R6 | Strict-validate PASSED. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:risks -->
## 5. RISKS

- **Battery drain.** 3 runs × ~75min each = ~3.5 hours wall. Must be plugged in.
- **Daemon wedge.** LMDB lock issues can stall a run; bench harness should handle but verify between runs.
- **Variance surprise.** If bge-code-v1 lands 8/18, 11/18, 10/18 across runs, decision becomes harder. Have a tiebreaker plan: take median, but if any run sits at the universal floor (7/18) suspect a bug.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- Clear PROMOTE or HOLD outcome with 3-run evidence.
- If promoted, all 4 config + doc files coherent (no mention of jina-code as default after this commit).
- If held, the decision is recorded with the run data so future re-promotion attempts have a baseline to beat.
<!-- /ANCHOR:success-criteria -->
