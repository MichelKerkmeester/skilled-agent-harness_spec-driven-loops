---
title: "Tasks: Phase 9: Learning Feedback Loop Repair"
description: "Verify-first task breakdown for the learning feedback loop repair: baseline capture, 🟡 finding confirmation, twelve fix clusters and integration proof."
trigger_phrases:
  - "learning feedback loop repair tasks"
  - "track access cache hits"
  - "auto promotion demotion hysteresis"
  - "feedback ledger sweep tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/009-learning-feedback-loop-repair"
    last_updated_at: "2026-07-03T13:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Remediated REWORK: T008/T021 verify-first, T010/T023 preventive, added T035-T041"
    next_safe_action: "Execute T001 baseline capture, then verify tasks T002-T009 and T035-T037, before any code change"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-009-learning-feedback-loop-repair-authoring"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: Learning Feedback Loop Repair

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Finding references cite the deep-dive report (`../research/deep-dive-report.md`, #N / Chain E), the findings ledger (`../research/findings-ledger.md`, agent letters), and the absorbed item 028/006-review-remediation/002 P1-5. Per the program comment-hygiene rule, finding IDs live HERE, never in code comments.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Baseline & 🟡 finding verification — confirm before fix (finding-is-a-hypothesis rule).**

- [ ] T001 Capture baseline: full vitest gate result, live fuel numbers (65/33,101 rows ever accessed, measured 2026-07-03 🟢), row counts for `feedback_events`, `shadow_scoring_log`, `batch_learning_log`, `learned_feedback_audit`, `memory_promotion_audit`, `memory_conflicts`, `adaptive_signal_events`, and warm `memory_search` p50 (read-only SQL + logs; record in checklist evidence)
- [ ] T002 [P] Verify 🟡 cache-hit tracking drop: cached-response path returns without `trackAccess` and `buildCacheArgs` omits it (Chain E, B P2) (mcp_server/handlers/memory-search.ts, mcp_server/lib/search/search-utils.ts)
- [ ] T003 [P] Verify 🟡 FSRS `last_review` mixed formats (space-form `CURRENT_TIMESTAMP` parsed as local, C P2) and refresh-on-empty-call (H OPT); inventory all writers (mcp_server/lib/search/fsrs.ts, mcp_server/lib/storage/post-insert-metadata.ts, mcp_server/lib/cognitive/tier-classifier.ts)
- [ ] T004 [P] Verify 🟡 learned-term cap counts expired terms and `expireLearnedTerms`/`clearAllLearnedTriggers` have no callers (report #27, G P1) (mcp_server/lib/search/learned-feedback.ts)
- [ ] T005 [P] Verify 🟡 batch-learning positive sign for `query_reformulated` and restart double-count, and that aggregation is per-row JS (report #25 batch half, G P1/P2/OPT) (mcp_server/lib/feedback/batch-learning.ts)
- [ ] T006 [P] Verify 🟡 corrections compound the 0.25x penalty on retry and undo restores stale absolutes (G P2) (mcp_server/lib/learning/corrections.ts)
- [ ] T007 [P] Verify 🟡 auto-promotion has no demotion path/hysteresis, throttle is global 3-per-8h, negative counts fetched per row (G refinement/OPT) (mcp_server/lib/search/auto-promotion.ts)
- [ ] T008 [P] Verify absorbed P1-5 is ALREADY FIXED: confirm `memory-retention-sweep.ts:666` calls `revalidateSpareOnlyRetention(currentCandidate)` on the fresh in-tx row before DELETE (rationale comment :660-665); confirm the extend decision sees only a 7-day window (028/006/002 P1-5, G refinement) (mcp_server/lib/governance/memory-retention-sweep.ts)
- [ ] T009 [P] Verify 🟡 evaluation cluster: shadow NDCG uses query-independent labels and empty holdouts record; true-citation bare-id matches "8" in "8 packets" and anchors require all words; quality-loop returns bestContent with the last attempt's score; `prediction-error-gate.init(db)` has no caller — also record whether phase 003 already wired it (G P2/CONTRACT) (mcp_server/lib/feedback/shadow-evaluation-runtime.ts, mcp_server/lib/feedback/true-citation-emitter.ts, mcp_server/handlers/quality-loop.ts, mcp_server/lib/cognitive/prediction-error-gate.ts)
- [ ] T035 [P] Verify absorbed working-memory decay double-apply: `batchUpdateScores` re-applies full event-distance decay to the stored `attention_score` and re-adds the mention boost each pass (`working-memory.ts:601-616`), so attention degenerates toward binary (report §3 P1 #20) (mcp_server/lib/cognitive/working-memory.ts)
- [ ] T036 [P] Verify absorbed dashboard mislabel: `isHigherBetter` uses a `latency` prefix that misses `ablation_latency_*` (`reporting-dashboard.ts:179-181`) and quality-loop writes `eval_run_id=0` (`quality-loop.ts:729`) so every snapshot lands in an eternal "run-0" sprint (findings-ledger Agent G P2) (mcp_server/lib/eval/reporting-dashboard.ts, mcp_server/handlers/quality-loop.ts)
- [ ] T037 [P] Verify absorbed FSRS hybrid-decay ordering: `isHybridDecayPolicyEnabled()` is default-ON and `applyClassificationDecay` runs the hybrid NO_DECAY branch (:351) before the classification flag check (:356), combining two policies the comment says must stay separate; latent while the composite five-factor consumer is dead (findings-ledger Agent C CONTRACT) (mcp_server/lib/cognitive/fsrs-scheduler.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Track access on cache hits: cached-response path records access for returned rows; keep `trackAccess` opt-in semantics intact (preventive/latent — `trackAccess` default-off at `memory-search.ts:909` with zero prod enablers; test forces the flag on via fixture) (Chain E, B P2) (mcp_server/handlers/memory-search.ts, mcp_server/lib/search/search-utils.ts)
- [ ] T011 FSRS `last_review`: write one ISO-8601 UTC format, dual-parse legacy space-form rows, and skip refresh on empty `applyPostInsertMetadata` calls (C P2, H OPT) (mcp_server/lib/search/fsrs.ts, mcp_server/lib/storage/post-insert-metadata.ts)
- [ ] T012 Expiry-aware learned-term cap: count only live terms against `MAX_TERMS_PER_MEMORY` (report #27) (mcp_server/lib/search/learned-feedback.ts)
- [ ] T013 Wire `expireLearnedTerms` and `clearAllLearnedTriggers` into `/memory:manage` maintenance actions, handler plus command doc (G P1) (mcp_server handlers, .opencode/commands/memory/manage.md)
- [ ] T014 Batch learning: weight `query_reformulated` as negative in computed boost, consistent with `weightedHitCount` (report #25) (mcp_server/lib/feedback/batch-learning.ts)
- [ ] T015 Batch learning: per-(memory, window) idempotency key so restarts insert-or-skip (G P2) (mcp_server/lib/feedback/batch-learning.ts)
- [ ] T016 Batch learning: move aggregation into SQL instead of per-row JS (G OPT) (mcp_server/lib/feedback/batch-learning.ts)
- [ ] T017 Corrections: re-applying an active pair is a no-op (G P2) (mcp_server/lib/learning/corrections.ts)
- [ ] T018 Corrections: undo reverses by delta, never restores stale absolute values (G P2) (mcp_server/lib/learning/corrections.ts)
- [ ] T019 Auto-promotion: add demotion path with hysteresis band (G refinement) (mcp_server/lib/search/auto-promotion.ts)
- [ ] T020 Auto-promotion: per-memory throttle and batched negative-feedback counts (G refinement/OPT) (mcp_server/lib/search/auto-promotion.ts)
- [ ] T021 Absorbed P1-5 (verify-first-then-close): the in-transaction re-validation of `importance_weight`/`quality_score`/`retention_trust_score`/`created_at` before the spare-only delete ALREADY ships (`memory-retention-sweep.ts:666`); make NO change to it — the deliverable is the interleaving test (T031) (028/006/002 P1-5) (mcp_server/lib/governance/memory-retention-sweep.ts)
- [ ] T022 Retention extend-window widening beyond the 7-day view (G refinement) (mcp_server/lib/governance/memory-retention-sweep.ts)
- [ ] T023 Age-based sweeps for the seven ledgers with dry-run mode and the shadow-period MIN(timestamp) guard for `shadow_scoring_log`; validated via injected aged fixtures, not organic volume (live ledgers near-empty at 65 lifetime accesses) (G P2, C OPT) (mcp_server/lib/feedback/feedback-ledger.ts, mcp_server/lib/feedback/shadow-scoring.ts, mcp_server/lib/feedback/batch-learning.ts, mcp_server/lib/search/learned-feedback.ts, mcp_server/lib/search/auto-promotion.ts, mcp_server/lib/search/vector-index-schema.ts, mcp_server/lib/cognitive/adaptive-ranking.ts)
- [ ] T024 Shadow eval: query-scoped relevance labels or cycles marked unlabeled; empty-holdout cycles record no NDCG/promotion signal (G P2) (mcp_server/lib/feedback/shadow-evaluation-runtime.ts, mcp_server/lib/feedback/shadow-scoring.ts)
- [ ] T025 True-citation: bare-id regex requires >=2 digits, anchor match uses a 2-of-3 word subset, uniqueness scoped per session; adversarial table tests (G P2/refinement) (mcp_server/lib/feedback/true-citation-emitter.ts)
- [ ] T026 Quality loop: track `bestScore` with `bestContent` so the returned pair matches; fix log reports only applied changes (G P2) (mcp_server/handlers/quality-loop.ts)
- [ ] T027 Prediction-error-gate: wire `init(db)` at startup unless T009 found phase 003 already landed it; assert audit rows on gating decisions (G CONTRACT) (mcp_server/lib/cognitive/prediction-error-gate.ts)
- [ ] T038 Working-memory decay: separate the event-distance decay base from the re-added mention boost so repeated `batchUpdateScores` passes keep attention stable, not binary (report §3 P1 #20) (mcp_server/lib/cognitive/working-memory.ts)
- [ ] T039 Eval dashboard: match `latency`/`inversion` direction by exact metric name or `_latency`/`_ms` suffix so `ablation_latency_*` is lower-is-better; give quality-loop snapshots a real sprint/run id instead of `eval_run_id=0` (findings-ledger Agent G P2) (mcp_server/lib/eval/reporting-dashboard.ts, mcp_server/handlers/quality-loop.ts)
- [ ] T040 FSRS hybrid-decay: check the classification flag before the hybrid NO_DECAY branch in `applyClassificationDecay` and never combine both policies on one memory; keep latent-safe while the composite consumer is dead (findings-ledger Agent C CONTRACT) (mcp_server/lib/cognitive/fsrs-scheduler.ts)
- [ ] T041 Decision-record (no code): evaluate enabling `trackAccess` on the prod/auto-surface path, coordinated with phase 010's latency budget; record the recommendation in the phase summary. Do NOT force-enable `trackAccess` in this phase (mcp_server/handlers/memory-search.ts; phase 010 coordination)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T028 Unit tests green for every cluster T010-T027 and the absorbed-finding fixes T038-T040, including the seven spec.md acceptance scenarios (working-memory multi-pass stability, dashboard direction table, FSRS ordering)
- [ ] T029 Integration: repeat-query strengthening observable — repeated search increases access metadata/FSRS state for the hit rows (SC-001)
- [ ] T030 Integration: promotion/demotion cycle test with hysteresis, no flapping at the boundary (SC-002)
- [ ] T031 Integration: absorbed P1-5 interleaving test — concurrent protection raise survives the spare-only sweep (SC-004)
- [ ] T032 Ledgers bounded: run sweeps (dry-run then live), record before/after counts against the T001 baseline (SC-003)
- [ ] T033 Re-run the WHOLE vitest gate; report the delta against the T001 baseline (no unexplained regressions)
- [ ] T034 Sync docs, mark checklist with evidence, run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` to exit 0, and refresh the parent changelog entry for this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (live fuel-number recheck shows repeat access recorded)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sources**: `../research/phase-decomposition.md` (section 009), `../research/deep-dive-report.md` (Chain E; #25/#26/#27; §3 P1 #20 working-memory decay), `../research/findings-ledger.md` (Agent G ledger/dashboard, Agent C FSRS hybrid-decay), `../research/plan-review-report.md` (§4 routed silent-drops; Systemic #1 absorbed-P1-5 reclassification)
- **Absorbed item**: `../../006-review-remediation/002-memory-schema-and-concurrency/spec.md` (P1-5; phase 013 updates its pointers)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
