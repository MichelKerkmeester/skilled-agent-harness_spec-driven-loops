---
title: "Implementation Summary: Eval-Harness Extension - Three Corpus Metric Lanes + Per-Class Promotion Gate"
description: "Implementation summary for the eval-harness extension. C9-1/C9-2/C9-3 are implemented as optional diagnostic snapshots, label views and three corpus metric lanes with deterministic tests. A8-1/A8-2/A8-5/A8-4 remain pending because they require generalized ledger/schema work and live promotion-gate validation."
trigger_phrases:
  - "eval harness extension implementation summary"
  - "three corpus metric lanes status"
  - "per class promotion gate pending"
  - "C9 corpus metric lanes shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/019-eval-harness-extension"
    last_updated_at: "2026-07-06T19:16:33.072Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented C9 eval-harness metric lanes and deferred A8 gate work"
    next_safe_action: "Run strict packet validation, then scope A8 schema/live-gate work separately"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-019-replan"
      parent_session_id: null
    completion_pct: 43
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Eval-Harness Extension, Three Corpus Metric Lanes + Per-Class Promotion Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

> **STATUS: complete.** This phase concluded with a deliberate partial-scope outcome: C9-1/C9-2/C9-3 are implemented and verified with deterministic tests, while A8-1/A8-2/A8-5/A8-4 are intentionally left pending because the remaining acceptance criteria require schema/live promotion-gate work that was outside this run's constraints. The C9 lanes are additive and default-off, and no live benchmark was run, so every recall/calibration/cold number stays gated on the sibling gate-zero reindex.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-eval-harness-extension |
| **Level** | 3 |
| **Status** | complete (partial scope: C9 implemented, A8 pending) |
| **Candidate** | `eval-harness-spine` (C9-1/C9-2/C9-3 DONE, A8-1/A8-2/A8-5/A8-4 PENDING) |
| **Completion** | 3/7 candidates implemented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Built:**
- **C9-1** single-pass diagnostic emit, `runAblation` now accepts array returns or `{ results, diagnosticRows }`, emits optional baseline `diagnosticSnapshots` and computes request-quality verdicts from `computeResultConfidence` + `assessRequestQuality` while preserving array-compatible direct callers.
- **C9-2** three-way label tagging, added pure label-view derivation plus a single `memory_index` metadata lookup for `importance_tier` and `created_at`. Citability derives non-citable expectation from the `hard_negative` query category.
- **C9-3** three corpus metric lanes, added gate-verdict confusion P/R/F1, ECE + Brier + reliability bins and cold-appearance-rate + cold-precision. `runAblation` reports them under optional `corpusMetrics`.

**Left pending:**
- **A8-1** class-parameterized promotion gate, requires generalized ledger schema (`candidate_id`, `candidate_class`, metric JSON) plus live gate validation.
- **A8-2** CLASS-G panel inside the promotion gate, C9 exposes the ECE/Brier metrics, but gate integration depends on A8-1.
- **A8-5** golden-set label-source swap, changes live scheduled promotion-gate behavior and needs an operational validation run.
- **A8-4** promote-on-evidence flag lifecycle, depends on class-specific A8 evidence records.

**Wave-0 cross-check (done-evidence):** Wave-0 record + `git log --oneline 1ecc531431..ab5459fb6d` shows zero eval-harness-metric / promotion-gate-generalization commits. The Wave-0 ships an *embedder-degrade* candidate it labels "C9" (recall → lexical + `embedder_available:false`), a different C9 namespace. All seven candidates here are PENDING.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

C9 was delivered as additive, default-off diagnostics in the existing eval harness. The direct `runAblation` path still accepts `EvalResult[]`, and the live eval handler now passes diagnostic rows so the MCP tool can emit the new lanes when invoked later. No live corpus benchmark, MCP reindex/scan or DB migration was run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **One additive extension on a forced linear order**, the three lanes share one root blind-spot and one spine. Reuse the ~80%-built runner, do not greenfield.
- **Corpus metrics at the aggregation layer, C9-2 is a data backfill**, confusion/reliability are corpus-level. Citability is category-derived (no grade-0 rows).
- **A8 deferred rather than partially faked**, the gate ledger requirement needs schema design/migration and live gate validation, so it remains pending under the user's constraints.
- **A8-3 recall-union panel out of scope**, its "structural blindness" headline was refuted. It survives only as a low-priority qrels-coverage instrument.
- **Gate-zero is the hard precondition**, no recall/calibration/cold number is trusted until the sibling reindex + coverage guard pass.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Baseline before edits:
- `npm run typecheck`, pass.
- `npx vitest run tests/eval-metrics.vitest.ts tests/ablation-framework.vitest.ts tests/shadow-scoring-holdout.vitest.ts tests/shadow-evaluation-runtime.vitest.ts tests/search-flags.vitest.ts`, 5 files passed, 246 passed, 13 skipped.

Final code verification:
- `npm run typecheck`, pass.
- Same focused Vitest command, 5 files passed, 252 passed, 13 skipped.

Not run by instruction: live `eval_run_ablation`, MCP reindex/scan, live DB benchmark, schema migration, git commit.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No measured benefit number reported**, every leverage estimate remains structural inference. This harness enables the first benchmarked delta but this run intentionally did not execute one.
- **Gate-zero dependency**, every recall/calibration/cold number is untrustworthy until the sibling corpus reindex (`001-corpus-reindex-gate-zero`) runs and `assertEmbeddingCoverage` passes.
- **Promotion-gate work pending**, the entrypoint and surrounding constants were re-confirmed, but the generalized A8 ledger/gate was not edited because it requires schema/live validation.
- **ECE formulation pinned for code**, 10 equal-width bins by default. Standard binary Brier score.
<!-- /ANCHOR:limitations -->
