---
title: "Tasks: Eval-Harness Extension - Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)"
description: "Task breakdown for the eval-harness spine: setup (gate-zero confirm, symbol re-confirm, baseline), the forced-linear C9 chain (C9-1 emit, C9-2 tagging, C9-3 metrics), the A8 gate generalization (A8-1/A8-2/A8-5/A8-4) and verification. C9-1/C9-2/C9-3 are implemented as code + deterministic tests. A8 remains pending under schema/live-gate constraints."
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
    recent_action: "Implemented and verified C9 eval-harness metric lanes"
    next_safe_action: "Plan A8 generalized ledger/gate work as a separate schema/live validation step"
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
# Tasks: Eval-Harness Extension, Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)

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

> **Status note:** C9-1/C9-2/C9-3 are implemented as code plus deterministic tests in this phase. A8-1/A8-2/A8-5/A8-4 remain pending because the acceptance criteria require generalized ledger/schema work and live promotion-gate validation. Cross-checked against the Wave-0 commit range (`git log --oneline 1ecc531431..ab5459fb6d`): the Wave-0 ships an *embedder-degrade* candidate it labels "C9", a different C9 namespace from these C9-1/C9-2/C9-3 metric lanes.
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

- [x] T001 [B] Confirm gate-zero green: sibling `001-corpus-reindex-gate-zero` reindex run + `assertEmbeddingCoverage` passes (`ablation-framework.ts:580-586`) [Accepted from user-provided precondition: gate-zero embedding coverage verified 100%, not locally re-run because live reindex/scan was explicitly forbidden].
- [x] T002 Re-confirm the live promotion-gate entrypoint symbol (research-cited `evaluatePromotionGate`/`:547` did not grep) and pin the confirmed constants (`MIN_NDCG_IMPROVEMENT:43`, `meanNdcgDelta:68`, `is_improvement:93`, `selectHoldoutQueries:243`) in `lib/feedback/shadow-scoring.ts` [Confirmed by `rg`/file read, A8 implementation left pending].
- [x] T003 Capture the ranking-ablation baseline for the additivity byte-checks (`SPECKIT_ABLATION=true` run of `eval_run_ablation`) [Deferred by explicit no-live-benchmark constraint, baseline captured with `npm run typecheck` + focused Vitest before edits].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Candidate C9-1: add a parallel per-query diagnostic capture (gate verdict + per-result resolved confidence + each row's `importance_tier`/`created_at`) in the `runAblation` baseline pass, reuse `captureScoreSnapshot` (`pipeline/types.ts:411`), `resolveAbsoluteRelevance` (`:90`), `assessRequestQuality` (`confidence-scoring.ts:385`) (`ablation-framework.ts:554`, capture `:590-606`) [DONE: optional `diagnosticSnapshots`, default direct callers remain array-compatible].
- [x] T005 Candidate C9-2: derive citability / binary-calibration / tier-tag label views from graded relevance(0-3) in one DB-join, citability "expect non-citable" from the `hard_negative` *category* (no grade-0 rows), tier via `SELECT FROM memory_index` (reuse the alignment join `ablation-framework.ts:247`), `GroundTruthEntry.tier?/createdAt?` already typed (`eval-metrics.ts:29-45`) [DONE: pure label views + one in-memory metadata-lookup test].
- [x] T006 Candidate C9-3: add three corpus-level metrics at the aggregation layer (`buildAggregatedMetrics` `ablation-framework.ts:486`) in `eval-metrics.ts`: (a) gate-verdict confusion (TP/FP/TN/FN) + P/R/F1, (b) ECE + Brier + reliability bins over `{rawValue, binary label}`, (c) cold-appearance-rate + cold-precision (EXTENDS the existing cold-start detection metric) [DONE: deterministic fixtures and optional report `corpusMetrics`].
- [ ] T007 Candidate A8-1: keep the gate spine (20% deterministic holdout `selectHoldoutQueries:243`, ≥2 non-regressing cycles `PROMOTION_THRESHOLD_WEEKS:32`, promote/wait/rollback, audit ledger), swap a per-class metric panel for the hardcoded `meanNdcgDelta`, generalize the ledger with `candidate_id` + `candidate_class` + metric-JSON (`lib/feedback/shadow-scoring.ts`) [LEFT-PENDING: requires shadow-cycle schema migration and live gate validation].
- [ ] T008 [P] Candidate A8-2: add the CLASS-G metric panel (ECE + Brier + precision/recall/FP-rate) inside the unified gate, the missing precondition keeping isotonic calibration frozen at opt-in (houses C9-3's ECE) [LEFT-PENDING: depends on A8-1 generalized gate/ledger, C9 ECE/Brier metrics now exist].
- [ ] T009 [P] Candidate A8-5: route the gate's held-out labels through the 110-query graded golden set instead of `adaptive_signal_events` (empty-map silent cycle-skip, `shadow-evaluation-runtime.ts:137,160`) [LEFT-PENDING: changes live scheduled gate behavior and needs operational validation].
- [ ] T010 Candidate A8-4: encode promote-on-evidence as the flag-symbol lifecycle (`isOptInEnabled` default-OFF → `isFeatureEnabled` on ≥2 clean cycles → rollback), reuse the 027 doctrine, note the stranded shadow combiner (`search-flags.ts:517`) [LEFT-PENDING: depends on A8-1 class-specific evidence].
- [x] T011 Update `spec.md` §14 candidate-status rows with final DONE (commit) / PENDING (gate) per candidate [DONE, no commit per user instruction].
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run Memory MCP static gates [`npm run typecheck`, `npm run build`] [DONE for requested gate: `npm run typecheck` green, build not run because user requested typecheck + focused Vitest only].
- [x] T013 Verify the existing 12 ranking metrics byte-identical to the captured baseline when the new diagnostic lanes are off [DONE at code/test level: diagnostics are opt-in, existing ablation tests pass unchanged. No live byte benchmark run per user constraint].
- [x] T014 Unit-test the three corpus metrics against fixtures (confusion + P/R/F1, ECE/Brier vs a reliability diagram, cold-rate/precision), test the gate scoring ≥2 classes off one spine and no silent cycle-skip after the label-source swap [DONE for C9 metric fixtures, A8 gate tests left pending with A8].
- [x] T015 Run the touched-area Vitest suite and classify any broad failures against baseline evidence [DONE: focused Vitest green after implementation].
- [x] T016 Run strict packet validation and fix structure issues [`validate.sh --strict`] [DONE: strict validation passed with 0 errors / 0 warnings].
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Each candidate has a final status in `spec.md` §14 (DONE with commit, or PENDING with its gate).
- [ ] Shipped candidates have implementation, test, review and commit evidence. The existing ranking ablation is byte-identical when the new lanes are off.
- [ ] Deferred candidates are not disguised as incomplete work. Each names its block reason (gate-zero / data-backfill / shared-infra) and path.
- [ ] The three corpus lanes compute and are fixture-tested. The gate scores ≥2 classes off one spine.
- [ ] Strict validation passes for this phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially §14 candidate status.
- **Plan**: `plan.md`.
- **Checklist**: `checklist.md`.
- **Phase research**: `../research/retrieval-evaluation/research.md` (+ `iterations/iteration-{001,008,009,011,012}.md`).
- **Synthesis (the spine)**: `../../research/synthesis/08-retrieval-evaluation-findings.md`.
- **Roadmap (authoritative)**: `../../research/roadmap.md`.
- **Gate-zero precondition (sibling)**: `../001-corpus-reindex-gate-zero/`.
<!-- /ANCHOR:cross-refs -->
