---
title: "Implementation Summary: Eval-Harness Extension — Three Corpus Metric Lanes + Per-Class Promotion Gate"
description: "Plan-only placeholder. The three corpus metric lanes (C9-1/C9-2/C9-3) and the per-class promotion gate (A8-1/A8-2/A8-5/A8-4) are NOT YET EXECUTED; this records the intended delivery and the gate-zero precondition the implementation must clear first."
trigger_phrases:
  - "eval harness extension implementation summary"
  - "three corpus metric lanes status"
  - "per class promotion gate pending"
  - "C9 A8 spine not started"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/019-eval-harness-extension"
    last_updated_at: "2026-06-19T08:00:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Seed plan-only implementation-summary (work not yet executed)"
    next_safe_action: "Confirm gate-zero, then wire C9-1 single-pass diagnostic emit"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-019-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Eval-Harness Extension — Three Corpus Metric Lanes + Per-Class Promotion Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

> **STATUS: NOT STARTED (plan-only).** This sub-phase was authored during a re-plan; none of the seven candidates have been executed. This summary records the intended delivery and the gate-zero precondition the implementation must clear first. Do not read any section below as a completion claim.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/001-speckit-memory/019-eval-harness-extension` |
| **Level** | 3 |
| **Status** | Not Started (plan-only) |
| **Candidate** | `eval-harness-spine` (C9-1/C9-2/C9-3 + A8-1/A8-2/A8-5/A8-4) — all PENDING |
| **Completion** | 0% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Nothing yet — planned scope (seven PENDING candidates):**
- **C9-1** single-pass diagnostic emit — capture the gate verdict + per-result resolved confidence + tier/created_at in `runAblation` (`ablation-framework.ts:554`), reusing `captureScoreSnapshot`/`resolveAbsoluteRelevance`/`assessRequestQuality`.
- **C9-2** three-way label tagging — derive citability / binary / tier label views from graded relevance in one `memory_index` DB-join; citability from the `hard_negative` category.
- **C9-3** three corpus metric lanes — gate-verdict confusion + P/R/F1; ECE + Brier + reliability bins; cold-appearance-rate + cold-precision; attached at `buildAggregatedMetrics` (`ablation-framework.ts:486`).
- **A8-1** class-parameterized promotion gate — keep the spine; swap a per-class panel for the hardcoded `meanNdcgDelta`; generalize the ledger (class + metric-JSON).
- **A8-2** CLASS-G (ECE/Brier/P/R/FP) panel — the missing precondition keeping isotonic calibration frozen at opt-in.
- **A8-5** golden-set label-source swap — replace `adaptive_signal_events` (empty-map silent cycle-skip) with the 110-query golden set.
- **A8-4** promote-on-evidence flag lifecycle — `isOptInEnabled`→`isFeatureEnabled`→rollback (027 doctrine).

**Wave-0 cross-check (done-evidence):** `030-memory-search-intelligence-impl/spec.md` §14 + `git log --oneline 1ecc531431..ab5459fb6d` — zero eval-harness-metric / promotion-gate-generalization commits. 030 §14 row 2 ships an *embedder-degrade* candidate it labels "C9" (recall → lexical + `embedder_available:false`), a different C9 namespace. All seven candidates here are PENDING.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Intended path (see `plan.md` §4): confirm gate-zero (sibling `001-corpus-reindex-gate-zero` reindex + `assertEmbeddingCoverage`) → re-confirm the live promotion-gate entrypoint symbol → capture the ranking-ablation baseline → C9-1 emit → C9-2 tag → C9-3 metrics → A8-1/A8-2/A8-5/A8-4 gate generalization → strict validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **One additive extension on a forced linear order** — the three lanes share one root blind-spot and one spine; reuse the ~80%-built runner, do not greenfield (ADR-001).
- **Corpus metrics at the aggregation layer; C9-2 is a data backfill** — confusion/reliability are corpus-level; citability is category-derived (no grade-0 rows) (ADR-002).
- **One promotion gate + per-class panel, not a second gate** — keep the spine, swap the metric; golden-set labels; flag-lifecycle promote-on-evidence (ADR-003).
- **A8-3 recall-union panel out of scope** — its "structural blindness" headline was refuted; survives only as a low-priority qrels-coverage instrument (ADR-004).
- **Gate-zero is the hard precondition** — no recall/calibration/cold number is trusted until the sibling reindex + coverage guard pass.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run. Required at completion (see `checklist.md`): Memory MCP `npm run typecheck` + `npm run build` exit 0; ranking-ablation byte-identical when the new lanes are off; the three corpus metrics fixture-tested (confusion + P/R/F1, ECE/Brier vs a reliability diagram, cold-rate/precision); the gate scoring ≥2 classes off one spine with no silent cycle-skip after the label-source swap; full `mcp_server/` vitest with no regression vs the captured baseline; `validate.sh --strict` green on this phase.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No measured benefit number anywhere in packet 028** — every leverage estimate is structural inference; this harness is precisely what makes the first benchmarked delta measurable, but it does not itself produce one.
- **Gate-zero dependency** — every recall/calibration/cold number is untrustworthy until the sibling corpus reindex (`001-corpus-reindex-gate-zero`) runs and `assertEmbeddingCoverage` passes.
- **Promotion-gate symbol drift** — the research-cited gate entrypoint (`evaluatePromotionGate`/`:547`) did not grep at the cited line; the surrounding constants (`MIN_NDCG_IMPROVEMENT:43`, `meanNdcgDelta:68`, `is_improvement:93`, `selectHoldoutQueries:243`) are confirmed in `lib/feedback/shadow-scoring.ts`. Re-confirm the entrypoint by symbol before editing.
- **ECE formulation open** — bin count / Brier formulation pending (tentative: 10 equal-width bins; standard Brier).
<!-- /ANCHOR:limitations -->
