---
title: "Decision Record: stage-aware scorer — fitted/holdout split under a score-preserving invariant"
description: "ADR-001 records the stage-split scoring semantics (holdout excluded from the fitted aggregate, separate holdout score + generalization gap, negatives via the existing advisor-inversion lane) and the score-preserving invariant that anchors the refactor."
trigger_phrases:
  - "stage split scoring semantics"
  - "holdout excluded from fitted aggregate"
  - "score preserving benchmark refactor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/017-stage-aware-scorer"
    last_updated_at: "2026-07-11T21:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded ADR-001 for the stage-split scoring semantics"
    next_safe_action: "Complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/061-stage-aware-scorer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: stage-aware scorer — fitted/holdout split under a score-preserving invariant

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Split the Lane C aggregate by stage, holdout-excluded, without shifting any existing score

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator + Claude (this session) |
| **Supersedes** | n/a (first ADR for this packet) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The Lane C skill-benchmark has a `stage` axis (`routing` | `holdout` | `negative`) that is produced but not consumed. `playbook-generator.cjs` renders `stage:` into fixtures and `load-playbook-scenarios.cjs` parses it out of sk-doc YAML, but: the sk-doc loader hardcodes `negativeActivation: false` (so `stage: negative` is scored as a positive routing test), the sk-code loader emits no `stage`, and `score-skill-benchmark.cjs` `aggregate()` folds every scored row into one `aggregateScore` with no notion of holdout.

That leaves two capabilities unwired: **decontaminated holdout** evaluation (a generalization check that must NOT inflate or deflate the headline score) and **stage-declared negatives** (suppression tests routed through the existing inversion machinery). It is the wiring gap behind the benchmark-validity/circularity concern.

A pristine Mode-A router-replay baseline was captured across every playbook corpus BEFORE any edit (33 corpora produced reports; 25 have scored scenarios). Seven corpora already ship staged fixtures (14 `stage: holdout` + 5 `stage: negative` across the tree); the other 28 are holdout-free. The refactor's correctness is therefore anchored to two hard properties: holdout-free corpora must reproduce their baseline `aggregateScore` exactly, and holdout-bearing corpora must change ONLY by excluding holdout from the fitted aggregate (revealing, not hiding, the generalization gap).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Wire the consume side with a stage-split aggregate that is additive and score-preserving:**

1. **Loader honors stages.** sk-doc: `negativeActivation = stage === 'negative'`. sk-code: emit `stage` on every scenario (`negative` iff its heuristic `negativeActivation`, else `routing`).

2. **The aggregate splits by stage.** `aggregateScore` (the headline) is the mean `modeAScore` over **non-holdout** rows (the fitted set: routing + negative). `holdoutScore` is the mean over holdout rows (null when none). `generalizationGap = fittedScore − holdoutScore` (null when either side is null). `coverage` gains `holdout` + `negative` counts and a `generalization` block reports the split.

3. **Negatives use the existing inversion lane.** `negativeActivation` continues to drive the D1-intra/D2/D3 inversion and `scoreD1Inter({ negative })`; the aggregate only *counts* negatives for coverage, it does not re-score them.

4. **Score-preserving invariant (holdout-free corpora).** For any corpus with no holdout fixture, `fittedRows == rows`, so `aggregateScore` is byte-identical to the pristine baseline — verified by a before/after re-baseline diff (0 deltas on all 28 holdout-free corpora) and a unit assertion. Holdout-bearing corpora change deterministically: fitted excludes holdout, and the gap is reported (e.g. cli-opencode fitted 100 / holdout 31 / gap 69).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Additive stage-split, holdout-excluded, score-preserving** | Unwires holdout + stage-negatives without shifting any existing score; the split is inert until fixtures opt in | Slightly more code (partition + additive fields) | CHOSEN |
| **Fold holdout into the same aggregate (do nothing structural)** | No code | Holdout can never be decontaminated; a generalization check would silently inflate/deflate the headline — the exact circularity concern | Rejected |
| **Author holdout/negative fixtures into the 13 corpora now, in this packet** | Immediately exercises the machinery on real data | Conflates harness wiring with fixture authoring; large, taste-heavy, and out of this packet's scope | Rejected (deferred to a fixture-authoring follow-on) |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Holdout evaluation is now expressible: a fixture tagged `stage: holdout` is scored but excluded from the fitted aggregate, and its score + the generalization gap are reported separately.
- `stage: negative` fixtures are honored end-to-end (loader → inversion lane), closing the hardcoded-`false` bug.
- The report gains a stage column and a generalization/circularity section, making the fitted-vs-holdout distinction legible.
- 28 holdout-free corpora keep their exact headline; the 7 holdout-bearing corpora now separate fitted from holdout, immediately surfacing real generalization gaps (cli-opencode and mcp-click-up show a 69-point gap the old averaged headline masked). The gap is a measurement the harness now reports — diagnosing or closing it (is the router overfit, or are the holdout fixtures mis-decontaminated?) is a follow-on, out of this packet's scope.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The stage axis is produced but not consumed; holdout + stage-negatives are unusable today |
| 2 | **Beyond Local Maxima?** | PASS | Three options framed (additive-split / do-nothing / author-fixtures-now) with a decision criterion |
| 3 | **Sufficient?** | PASS | Loader + scorer + report + generator + tests fully wire the consume side; the re-baseline proves no regression |
| 4 | **Fits Goal?** | PASS | Enables decontaminated holdout + honest circularity reporting without disturbing existing scores |
| 5 | **Open Horizons?** | PASS | A follow-on fixture-authoring packet can declare stages and the machinery is ready |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Loader: sk-doc `negativeActivation` derived from `stage`; sk-code emits `stage`.
- Scorer: `scoreScenario` attaches `row.stage`; `aggregate()` partitions fitted/holdout, computes `holdoutScore` + `generalizationGap`, adds coverage buckets + a `generalization` block.
- Report: stage column + generalization/circularity section.
- Generator: thread per-spec `stage` through the render call.
- Tests: stage-aware + adversarial staged-fixture proof + score-preserving assertion.

**How to roll back**: Each file edit is independent (`git checkout -- <path>`). If the re-baseline shows any non-zero delta on a stage-less corpus, revert `aggregate()` to the all-rows mean and re-derive the partition so holdout exclusion is a no-op when `holdoutRows` is empty.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
