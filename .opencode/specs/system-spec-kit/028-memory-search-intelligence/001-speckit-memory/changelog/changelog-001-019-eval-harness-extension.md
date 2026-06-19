---
title: "Changelog: Eval-Harness Extension — Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase) [001-speckit-memory/019-eval-harness-extension]"
description: "Chronological changelog for the Eval-Harness Extension — Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/019-eval-harness-extension` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

Built: - C9-1 single-pass diagnostic emit — runAblation now accepts array returns or { results, diagnosticRows }, emits optional baseline diagnosticSnapshots, and computes request-quality verdicts from computeResultConfidence + assessRequestQuality while preserving array-compatible direct callers. - C9-2 three-way label tagging — added pure label-view derivation plus a single memory_index metadata lookup for importance_tier and created_at; citability derives non-citable expectation from the hard_negative query category. - C9-3 three corpus metric lanes — added gate-verdict confusion P/R/F1, ECE + Brier + reliability bins, and cold-appearance-rate + cold-precision; runAblation reports them under optional corpusMetrics.

### Added

- Re-confirm the live promotion-gate entrypoint symbol (research-cited evaluatePromotionGate/:547 did not grep) and pin the confirmed constants (MIN_NDCG_IMPROVEMENT:43, meanNdcgDelta:68, is_improvement:93, selectHoldoutQueries:243) in lib/feedback/shadow-scoring.ts [Confirmed by rg/file read; A8 implementation left pending].
- Capture the ranking-ablation baseline for the additivity byte-checks (SPECKIT_ABLATION=true run of eval_run_ablation) [Deferred by explicit no-live-benchmark constraint; baseline captured with npm run typecheck + focused Vitest before edits].
- Candidate C9-1: add a parallel per-query diagnostic capture (gate verdict + per-result resolved confidence + each row's importance_tier/created_at) in the runAblation baseline pass; reuse captureScoreSnapshot (pipeline/types.ts:411), resolveAbsoluteRelevance (:90), assessRequestQuality (confidence-scoring.ts:385) (ablation-framework.ts:554, capture :590-606) [DONE: optional diagnosticSnapshots; default direct callers remain array-compatible].
- Candidate C9-2: derive citability / binary-calibration / tier-tag label views from graded relevance(0-3) in one DB-join; citability "expect non-citable" from the hard_negative category (no grade-0 rows); tier via SELECT FROM memory_index (reuse the alignment join ablation-framework.ts:247); GroundTruthEntry.tier?/createdAt? already typed (eval-metrics.ts:29-45) [DONE: pure label views + one in-memory metadata-lookup test].
- Run Memory MCP static gates [npm run typecheck, npm run build] [DONE for requested gate: npm run typecheck green; build not run because user requested typecheck + focused Vitest only].
- Verify the existing 12 ranking metrics byte-identical to the captured baseline when the new diagnostic lanes are off [DONE at code/test level: diagnostics are opt-in; existing ablation tests pass unchanged. No live byte benchmark run per user constraint].

### Changed

- [B] Confirm gate-zero green: sibling 001-corpus-reindex-gate-zero reindex run + assertEmbeddingCoverage passes (ablation-framework.ts:580-586) [Accepted from user-provided precondition: gate-zero embedding coverage verified 100%; not locally re-run because live reindex/scan was explicitly forbidden].
- Update spec.md §14 candidate-status rows with final DONE (commit) / PENDING (gate) per candidate [DONE; no commit per user instruction].
- CHK-001 Gate-zero confirmed: sibling 001-corpus-reindex-gate-zero reindex run + assertEmbeddingCoverage passes.
- CHK-002 Live promotion-gate entrypoint symbol re-confirmed (research-cited :547 drifted).
- CHK-004 Wave-0 done-evidence cross-checked; all seven candidates confirmed PENDING.
- CHK-010 Memory MCP typecheck passes after each candidate.

### Fixed

- Candidate C9-3: add three corpus-level metrics at the aggregation layer (buildAggregatedMetrics ablation-framework.ts:486) in eval-metrics.ts: (a) gate-verdict confusion (TP/FP/TN/FN) + P/R/F1; (b) ECE + Brier + reliability bins over {rawValue, binary label}; (c) cold-appearance-rate + cold-precision (EXTENDS the existing cold-start detection metric) [DONE: deterministic fixtures and optional report corpusMetrics].
- Unit-test the three corpus metrics against fixtures (confusion + P/R/F1; ECE/Brier vs a reliability diagram; cold-rate/precision); test the gate scoring ≥2 classes off one spine and no silent cycle-skip after the label-source swap [DONE for C9 metric fixtures; A8 gate tests left pending with A8].
- Run strict packet validation and fix structure issues [validate.sh --strict] [DONE: strict validation passed with 0 errors / 0 warnings].
- CHK-022 C9-3 three corpus metrics implemented + fixture-tested.
- CHK-FIX-001 Each candidate has a final disposition in spec.md §14 (DONE with commit, or PENDING with gate).
- CHK-FIX-002 Deferred items name their gate (gate-zero / data-backfill / shared-infra) and path.

### Verification

- Tasks complete - 12 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-011 Memory MCP build passes after each candidate.
- CHK-023 A8-1 class-parameterized gate scores ≥2 classes off one spine; ranking class unregressed.
- CHK-024 A8-2 CLASS-G panel produces a promote signal sufficient to graduate isotonic on evidence.
- CHK-025 A8-5 golden-set label routing replaces adaptive_signal_events with no silent cycle-skip.
- CHK-026 A8-4 promote-on-evidence flag lifecycle encoded.
- CHK-042 The gate's promote path does not auto-flip a production flag without ≥2 clean cycles.
