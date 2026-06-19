---
title: "Tasks: Eval-Harness Extension — Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)"
description: "Task breakdown for the eval-harness spine: setup (gate-zero confirm, symbol re-confirm, baseline), the forced-linear C9 chain (C9-1 emit, C9-2 tagging, C9-3 metrics), the A8 gate generalization (A8-1/A8-2/A8-5/A8-4), and verification. All implementation tasks pending; Wave-0 (030) done-evidence confirms none shipped (030's 'C9' is the embedder-degrade candidate)."
trigger_phrases:
  - "tasks eval harness extension"
  - "C9 corpus metrics task breakdown"
  - "A8 promotion gate task"
  - "single pass diagnostic emit task"
  - "ECE Brier calibration metric task"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/019-eval-harness-extension"
    last_updated_at: "2026-06-19T08:00:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown for the eval-harness spine"
    next_safe_action: "Confirm gate-zero, then start C9-1 single-pass emit task"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-019-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Eval-Harness Extension — Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed or explicitly deferred with accepted evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked before completion |

**Task Format**: `T### [P?] Candidate or action (primary seam) [status/evidence]`

> **Status note:** All seven candidates are PENDING. Cross-checked against `../../../030-memory-search-intelligence-impl/spec.md` §14 and the 030 commit range (`git log --oneline 1ecc531431..ab5459fb6d`): 030 §14 row 2 ships an *embedder-degrade* candidate it labels "C9" — a different C9 namespace from these C9-1/C9-2/C9-3 metric lanes — and there are zero eval-harness-metric / promotion-gate-generalization commits. None shipped in Wave-0. No task below is pre-checked.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T003 | Gate-zero confirm + symbol re-confirm + baseline |
| M2 | T004-T010 | C9 chain + A8 gate implementation |
| M3 | T011-T016 | Verification + phase closeout |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Confirm gate-zero green: sibling `001-corpus-reindex-gate-zero` reindex run + `assertEmbeddingCoverage` passes (`ablation-framework.ts:580-586`) [Blocked on sibling phase; hard precondition for every recall/calibration/cold number].
- [ ] T002 Re-confirm the live promotion-gate entrypoint symbol (research-cited `evaluatePromotionGate`/`:547` did not grep) and pin the confirmed constants (`MIN_NDCG_IMPROVEMENT:43`, `meanNdcgDelta:68`, `is_improvement:93`, `selectHoldoutQueries:243`) in `lib/feedback/shadow-scoring.ts` [Pending].
- [ ] T003 Capture the ranking-ablation baseline for the additivity byte-checks (`SPECKIT_ABLATION=true` run of `eval_run_ablation`) [Pending].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Candidate C9-1: add a parallel per-query diagnostic capture (gate verdict + per-result resolved confidence + each row's `importance_tier`/`created_at`) in the `runAblation` baseline pass; reuse `captureScoreSnapshot` (`pipeline/types.ts:411`), `resolveAbsoluteRelevance` (`:90`), `assessRequestQuality` (`confidence-scoring.ts:385`) (`ablation-framework.ts:554`, capture `:590-606`) [Pending; gate: gate-zero. Root unblock — keep ranking metrics byte-identical].
- [ ] T005 Candidate C9-2: derive citability / binary-calibration / tier-tag label views from graded relevance(0-3) in one DB-join; citability "expect non-citable" from the `hard_negative` *category* (no grade-0 rows); tier via `SELECT FROM memory_index` (reuse the alignment join `ablation-framework.ts:247`); `GroundTruthEntry.tier?/createdAt?` already typed (`eval-metrics.ts:29-45`) [Pending; gate: data-backfill, not new plumbing].
- [ ] T006 Candidate C9-3: add three corpus-level metrics at the aggregation layer (`buildAggregatedMetrics` `ablation-framework.ts:486`) in `eval-metrics.ts`: (a) gate-verdict confusion (TP/FP/TN/FN) + P/R/F1; (b) ECE + Brier + reliability bins over `{rawValue, binary label}`; (c) cold-appearance-rate + cold-precision (EXTENDS the existing cold-start detection metric) [Pending; the actual deliverable — ECE/Brier genuinely greenfield].
- [ ] T007 Candidate A8-1: keep the gate spine (20% deterministic holdout `selectHoldoutQueries:243`, ≥2 non-regressing cycles `PROMOTION_THRESHOLD_WEEKS:32`, promote/wait/rollback, audit ledger); swap a per-class metric panel for the hardcoded `meanNdcgDelta`; generalize the ledger with `candidate_id` + `candidate_class` + metric-JSON (`lib/feedback/shadow-scoring.ts`) [Pending; depends on C9-3 metrics. Riskiest hunk — keep separable from the C9 lanes].
- [ ] T008 [P] Candidate A8-2: add the CLASS-G metric panel (ECE + Brier + precision/recall/FP-rate) inside the unified gate — the missing precondition keeping isotonic calibration frozen at opt-in (houses C9-3's ECE) [Pending].
- [ ] T009 [P] Candidate A8-5: route the gate's held-out labels through the 110-query graded golden set instead of `adaptive_signal_events` (empty-map silent cycle-skip, `shadow-evaluation-runtime.ts:137,160`) [Pending].
- [ ] T010 Candidate A8-4: encode promote-on-evidence as the flag-symbol lifecycle (`isOptInEnabled` default-OFF → `isFeatureEnabled` on ≥2 clean cycles → rollback); reuse the 027 doctrine; note the stranded shadow combiner (`search-flags.ts:517`) [Pending].
- [ ] T011 Update `spec.md` §14 candidate-status rows with final DONE (commit) / PENDING (gate) per candidate.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run Memory MCP static gates [`npm run typecheck`, `npm run build`].
- [ ] T013 Verify the existing 12 ranking metrics byte-identical to the captured baseline when the new diagnostic lanes are off.
- [ ] T014 Unit-test the three corpus metrics against fixtures (confusion + P/R/F1; ECE/Brier vs a reliability diagram; cold-rate/precision); test the gate scoring ≥2 classes off one spine and no silent cycle-skip after the label-source swap.
- [ ] T015 Run the touched-area Vitest suite and classify any broad failures against baseline evidence.
- [ ] T016 Run strict packet validation and fix structure issues [`validate.sh --strict`].
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Each candidate has a final status in `spec.md` §14 (DONE with commit, or PENDING with its gate).
- [ ] Shipped candidates have implementation, test, review, and commit evidence; the existing ranking ablation is byte-identical when the new lanes are off.
- [ ] Deferred candidates are not disguised as incomplete work; each names its block reason (gate-zero / data-backfill / shared-infra) and path.
- [ ] The three corpus lanes compute and are fixture-tested; the gate scores ≥2 classes off one spine.
- [ ] Strict validation passes for this phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially §14 candidate status.
- **Plan**: `plan.md`.
- **Checklist**: `checklist.md`.
- **Phase research**: `../research/from-008-retrieval-evaluation/research.md` (+ `iterations/iteration-{001,008,009,011,012}.md`).
- **Synthesis (the spine)**: `../../research/synthesis/08-retrieval-evaluation-findings.md`.
- **Roadmap (authoritative)**: `../../research/roadmap.md`.
- **Gate-zero precondition (sibling)**: `../001-corpus-reindex-gate-zero/`.
- **Wave-0 done-evidence (read-only)**: `../../../030-memory-search-intelligence-impl/spec.md` §14.
<!-- /ANCHOR:cross-refs -->
