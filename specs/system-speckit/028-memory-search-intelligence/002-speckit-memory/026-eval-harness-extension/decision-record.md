---
title: "Decision Record: Eval-Harness Extension - Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)"
description: "Load-bearing decisions for the eval-harness spine: the three lanes are ONE additive extension on a forced linear order, the metrics attach at the aggregation layer reusing the live runner, the single promotion gate gains a per-class panel rather than a second gate and the A8-3 recall-union panel is rescoped out because its 'structural blindness' headline was refuted."
trigger_phrases:
  - "decision record eval harness extension"
  - "three lanes one extension forced order"
  - "per class panel not second gate"
  - "A8-3 recall union rescoped refuted"
  - "ECE Brier aggregation layer decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/026-eval-harness-extension"
    last_updated_at: "2026-07-04T17:51:00.031Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded load-bearing decisions for the eval-harness spine"
    next_safe_action: "Use these decisions as implementation constraints once gate-zero is green"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-019-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Eval-Harness Extension, Three Corpus Metric Lanes + Per-Class Promotion Gate (028/001 impl phase)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Build the three lanes as ONE additive harness extension on a forced linear order

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author, grounded in 028/008 iter-009 + synthesis/08 |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 028 retrieval-evaluation campaign found the eval harness is already ~75-85% built (live `eval_run_ablation` runner, 110-query golden set, 12-metric library) but has zero verdict-accuracy and zero calibration metrics (`ECE`/`Brier` grep-clean). The three "missing accuracy lanes" (gate-verdict, ECE, cold) share one root blind-spot (`runAblation` captures only `EvalResult[]` and throws away the verdict/confidence/tier the pipeline already computed) and one build spine (iter-009 key finding). They are not three independent metrics.

### Constraints

- The existing 12 ranking metrics must stay byte-identical when the new lanes are off (additive-only).
- The build order is forced + linear: gate-zero reindex (sibling) → C9-1 emit → C9-2 tag → C9-3 metrics.
- No recall/calibration/cold number is trusted until gate-zero (reindex + coverage guard) is met.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Implement C9-1/C9-2/C9-3 as one additive extension of the live runner on the forced linear order, not three separate metric builds and not a greenfield harness.

**How it works**: C9-1 adds a parallel per-query diagnostic snapshot (verdict + per-result confidence + tier/created_at) reusing `captureScoreSnapshot`/`resolveAbsoluteRelevance`/`assessRequestQuality`. C9-2 derives the three label views in one DB-join. C9-3 attaches the three corpus metrics at `buildAggregatedMetrics`. Each consumes the prior.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One additive extension on the forced order** | Reuses the live runner, lanes share one capture, reversible | Strict ordering on gate-zero | 10/10 |
| Three independent metric builds | Parallelizable on paper | Triple-captures the same snapshot, redundant, breaks the shared label join | 3/10 |
| Greenfield eval harness | Clean slate | Throws away a ~80%-built runner + 110-query golden set | 1/10 |

**Why this one**: The campaign proved the lanes share one root blind-spot and one spine. The extension is the honest, reversible shape.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The harness gains gate-verdict, calibration and cold accuracy lanes off one capture pass.
- The existing ranking ablation path is untouched when the lanes are off.

**What it costs**:
- The lanes cannot be benchmarked until gate-zero (sibling reindex) lands. Mitigation: hard-block reporting until coverage is whole.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The capture extension changes ranking metrics | M | Additive capture only, byte-check ranking metrics unchanged when lanes off |
| Reporting a number against a cold index | H | Gate-zero coverage guard blocks it (sibling C9-4) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No verdict/calibration metric exists, the levers 015/017 shipped are unmeasurable |
| 2 | **Beyond Local Maxima?** | PASS | Greenfield and three-separate-builds options rejected with evidence |
| 3 | **Sufficient?** | PASS | The three lanes cover gate, calibration and cold accuracy |
| 4 | **Fits Goal?** | PASS | Goal is to make the intelligence-class roadmap measurable |
| 5 | **Open Horizons?** | PASS | Leaves A8's gate to consume the lanes' metrics |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- C9-1 per-query diagnostic capture in `runAblation`.
- C9-2 three-way label tagging in one DB-join.
- C9-3 three corpus metrics at `buildAggregatedMetrics`.

**How to roll back**: Revert each lane independently. The C9-1 emit and the C9-3 metrics are separable hunks.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Attach the corpus metrics at the aggregation layer, and treat C9-2 as a data backfill

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author, grounded in 028/008 iter-009 + iter-011 |

---

<!-- ANCHOR:adr-002-context -->
### Context

A confusion matrix and a reliability diagram are corpus-level statistics, not per-query, so the three new metrics attach at `buildAggregatedMetrics` (`ablation-framework.ts:486`), not `computeQueryMetrics`. C9-2's labels look like plumbing but iter-011 verified `GroundTruthEntry` already *types* `tier?`/`createdAt?` (`eval-metrics.ts:29-45`) while the golden *data* carries only queryId/memoryId/relevance, and relevances are grades 1-3 positive-only, with no grade-0/hard-negative rows. C9-2 is therefore a data backfill, and citability "expect non-citable" must come from the `hard_negative` *category*, not a grade-0 row.

### Constraints

- Per-query aggregation cannot host corpus-level confusion/reliability statistics.
- The golden data has no tier rows and no grade-0 rows.
- The label derivation must be one DB-join, reusing the existing `memory_index` join.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Compute the three corpus metrics at the aggregation layer (`buildAggregatedMetrics`) and implement C9-2 as a derived-label backfill (one DB-join: citability from the `hard_negative` category, binary from `relevance≥threshold`, tier-tag from a `memory_index` JOIN), not new persistent plumbing.

**How it works**: C9-2 reads graded relevance + a `memory_index` join into three label views. C9-3 reads those views + C9-1's snapshot at the corpus-aggregation seam.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Aggregation-layer metrics + derived-label backfill** | Correct level for corpus stats, reuses typed fields | Backfill must derive non-citable from a category | 10/10 |
| Per-query metrics | Symmetric with existing recall | Cannot express a corpus confusion matrix / reliability diagram | 2/10 |
| Manually annotate grade-0/tier rows into the golden set | Explicit labels | Hand-annotation, brittle, the join already has the data | 3/10 |

**Why this one**: Matches the statistic's natural level and the data that already exists.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The metrics live at the right aggregation level and the labels come from one join.

**What it costs**:
- Citability for hard-negatives is category-derived (no grade-0 ground truth). Mitigation: document the derivation, unit-test the label view.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Category-derived non-citable mislabels a query | M | Label-view unit test against the `hard_negative` set |
| Tier join drifts post-reindex | M | Run after gate-zero, re-derive on each run |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Corpus stats cannot live per-query, labels are absent from golden data |
| 2 | **Beyond Local Maxima?** | PASS | Per-query and manual-annotation options rejected |
| 3 | **Sufficient?** | PASS | One join yields all three label views |
| 4 | **Fits Goal?** | PASS | Feeds the three corpus metrics correctly |
| 5 | **Open Horizons?** | PASS | The ECE bin scheme stays an open, documented question |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- C9-3 metric fns at `buildAggregatedMetrics`.
- C9-2 label-view backfill via one `memory_index` DB-join.

**How to roll back**: Remove the metric fns and the label-view derivation. The 12 ranking metrics stand alone.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Give the single promotion gate a per-class metric panel, not a second gate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author, grounded in 028/008 iter-008 |

---

<!-- ANCHOR:adr-003-context -->
### Context

The system has exactly one promotion gate (`lib/feedback/shadow-scoring.ts`), shaped for one class because its only metric is rank-delta, `is_improvement` hardcodes `meanNdcgDelta >= MIN_NDCG_IMPROVEMENT` (`:43,68,93`). Its held-out labels come from `adaptive_signal_events`, which returns an empty map when signals cancel → silently skips cycles (`shadow-evaluation-runtime.ts:137,160`). The isotonic calibration flag is frozen at opt-in precisely because no CLASS-G (ECE/Brier) gate exists to manufacture its promote evidence, the missing piece is the gate, not a new flag (iter-008 key finding).

### Constraints

- Keep the gate's spine: 20% deterministic holdout, ≥2 non-regressing cycles, promote/wait/rollback, one audit ledger.
- A calibration candidate must be scorable on ECE/Brier, not coerced into a nDCG number.
- Promote-on-evidence must reuse the existing flag-symbol lifecycle (027 doctrine), not invent a new flag mechanism.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Generalize the one gate with a swappable per-class metric panel (A8-1), add the CLASS-G ECE/Brier panel (A8-2), route held-out labels through the golden set (A8-5) and encode promote-on-evidence as the `isOptInEnabled`→`isFeatureEnabled`→rollback lifecycle (A8-4), never a second gate.

**How it works**: The ledger records `candidate_id` + `candidate_class` + a metric-JSON. The gate selects the panel matching the candidate's class (R ranking → nDCG, G gate/calibration → ECE/Brier/P/R/FP) and reads its labels from the 110-query golden set.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One spine + per-class panel + golden-set labels** | Reuses the holdout/cycle/ledger machinery, unfreezes isotonic | Touches the live promote path | 10/10 |
| Build a second, calibration-specific gate | Isolated | Duplicates the holdout/cycle/ledger spine, two gates to maintain | 3/10 |
| Coerce calibration into the existing nDCG gate | No new code | nDCG is orthogonal to calibration reliability, cannot produce the promote signal | 1/10 |

**Why this one**: The spine is correct and reusable. Only the metric is class-specific.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- One gate promotes any intelligence-class candidate on its own metric class.
- Isotonic calibration gets the CLASS-G gate it needs to graduate on evidence.
- Cycles no longer silently skip when `adaptive_signal_events` is empty.

**What it costs**:
- The change touches the live promote path. Mitigation: keep the ranking-class panel byte-equivalent, regression-test it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ranking-class promotion regresses under the generalization | H | Ranking-class regression test, keep its panel equivalent to today |
| Gate ledger schema change | M | Prefer additive columns (class + metric-JSON), open question recorded |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | One gate welded to one class blocks every calibration/gate candidate |
| 2 | **Beyond Local Maxima?** | PASS | Second-gate and coerce-into-nDCG options rejected |
| 3 | **Sufficient?** | PASS | Per-class panel + golden-set labels + flag lifecycle cover the need |
| 4 | **Fits Goal?** | PASS | Goal is promote-on-evidence for any intelligence-class candidate |
| 5 | **Open Horizons?** | PASS | A new candidate-class adds a panel, not a gate |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- A8-1 per-class metric panel + generalized ledger.
- A8-2 CLASS-G (ECE/Brier/P/R/FP) panel.
- A8-5 golden-set held-out label routing.
- A8-4 flag-symbol promote-on-evidence lifecycle.

**How to roll back**: Revert the per-class panel. The gate falls back to the `meanNdcgDelta` weld and `adaptive_signal_events` labels.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Keep A8-3 (recall-delta@k UNION panel) out of scope, its headline was refuted

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author, grounded in 028/008 iter-010 + synthesis/08 DROP/RESCOPED |

---

<!-- ANCHOR:adr-004-context -->
### Context

Iter-8 proposed A8-3, a recall-delta@k UNION panel, on the claim that the gate is "structurally blind to recall additions" because `compareRanks` (`rank-metrics.ts:223`) scores only the live∩shadow intersection. Adversarial verification (iter-10, synthesis/08 DROP/RESCOPED) REFUTED the headline: `ndcgDelta` *is* sensitive to judged-recall additions (`condenseJudgedRanking` keeps all judged items). The gate is blind only for per-result deltas/counts and for *unlabeled* added items, a qrels-coverage problem, not gate-blindness. It was the campaign's most-overstated claim.

### Constraints

- A load-bearing CLASS-C recall-union panel would chase a refuted premise.
- The residual (coverage of unlabeled added items) is real but low-priority.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Exclude A8-3 from this phase's build scope. The two promotable classes are R (ranking) and G (gate/calibration). A8-3's surviving value (a low-priority qrels-coverage instrument) is documented as a follow-up, not built here.

**How it works**: The gate ships with CLASS-R and CLASS-G panels. `compareRanks` is left unchanged.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exclude A8-3, ship CLASS-R + CLASS-G** | Honest to the refutation, smaller blast radius | Defers the qrels-coverage instrument | 10/10 |
| Build the recall-union panel anyway | Feature-complete on the original brief | Chases a refuted "structural blindness" headline | 2/10 |
| Build only a qrels-coverage warning | Captures the real residual | Premature, no consumer yet | 4/10 |

**Why this one**: Building on a refuted premise is the exact mistake the broadening pass was meant to catch.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The phase builds only the two classes the evidence supports.

**What it costs**:
- The unlabeled-added-item coverage residual is deferred. Mitigation: document it as a low-priority follow-up instrument.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Residual qrels-coverage gap forgotten | L | Recorded here + in spec §14 refuted/rescoped note |
| Future need for a recall-union panel | L | The per-class panel design (ADR-003) makes adding a CLASS-C panel additive |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Avoids building on a refuted premise |
| 2 | **Beyond Local Maxima?** | PASS | Build-anyway and warning-only options rejected |
| 3 | **Sufficient?** | PASS | CLASS-R + CLASS-G cover the evidenced candidates |
| 4 | **Fits Goal?** | PASS | Goal is promote-on-evidence, not promote-on-refuted-claim |
| 5 | **Open Horizons?** | PASS | Per-class panel makes a future CLASS-C additive |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- No A8-3 panel. `compareRanks` unchanged, documented as a deferred coverage instrument.

**How to roll back**: N/A, nothing built, revisit only if a CLASS-C consumer appears.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
