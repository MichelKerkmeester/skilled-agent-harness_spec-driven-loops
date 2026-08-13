---
title: "Decision Record: Fail-Closed Model Benchmark Reduction"
description: "Records the decision to make the model-benchmark fold exhaustive, enforce forward-only cell transitions, and preserve validity, abstention, lifecycle, pairwise, and operational evidence through ranking."
trigger_phrases:
  - "model benchmark reducer completeness decision"
  - "model benchmark fail closed fold"
  - "model benchmark evidence projection decision"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-23T14:36:30Z"
    last_updated_by: "codex"
    recent_action: "Carried cited judge abstentions into ranking eligibility"
    next_safe_action: "Consume the additive shadow projection downstream"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-projection-types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-reducers.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "model-benchmark-reducers-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every registry-admitted model event must have an explicit fold case"
      - "Only forward cell transitions may replace a matrix cell"
      - "Confirmed contamination and unresolved hard floors block ranking"
      - "Every event reference must resolve to an allowed producer stem"
      - "Blocking unresolved validity abstains ranking until evidence resolves"
      - "Cited invalid judge observations abstain unless superseded"
---
# Decision Record: Fail-Closed Model Benchmark Reduction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Preserve Evidence Before Ranking and Reject Incomplete Reduction

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-23 |
| **Deciders** | Model-benchmark FIX agent under the approved leaf scope |

---

<!-- ANCHOR:adr-001-context -->
### Context

The registry admitted seven model-specific event families that the reducer silently ignored. The scoring projection
also lacked separate pairwise and cost/latency records, allowed a completed cell to regress to admitted, and treated
an unresolved hard floor like an explicit pass. A later audit found the same failure class at the lineage boundary:
event references proved only that an ID existed, not that the referenced producer had the required event kind.
Unknown-validity events also stored required evidence without giving the blocker or unresolved references a ranking
consumer. A further ranking audit found that sealed evidence could cite an abstained judge observation while
`deriveRankings` consumed only the raw score and still returned an eligible rank. Those behaviors made a projected
result look valid while dropping evidence that could disqualify it.

### Constraints

- The landed event schema and shared deep-improvement reducer remain unchanged.
- The implementation stays additive-dark and cannot grant ranking or promotion authority.
- Replay remains deterministic, immutable, and free of external effects.
- Existing projection consumers keep the same top-level composite boundary.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Make the specific-event fold exhaustive and preserve every ranking-relevant evidence family as an
addressable projection record.

**How it works**: The reducer maintains an explicit handled-stem inventory and returns a typed rebuild requirement
when the registry contains an unhandled stem. Every event-reference assertion carries an allowed producer-stem list,
so a real seen event of the wrong kind fails closed even when its digest matches. Judge, oracle, contamination,
exposure, case lifecycle, pairwise, and cost/latency facts are folded into sorted records. Unknown-validity records
retain their blocker flag and unresolved evidence by validity plan; matching later validity evidence clears resolved
references and re-derives existing rankings. Confirmed or unresolved blockers invalidate existing rankings and block
later reductions. Ranking also joins every cited judge observation to its cited candidate score and blocks explicit
abstention, unknown or not-observed disagreement, zero confidence, and maximal uncertainty. A later observation
supersedes an earlier one only for the same evaluator identity, score, calibration slice, and ledger stream, while
matrix cells advance only through legal forward transitions.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Explicit fold inventory plus addressable evidence records** | Fails closed, keeps replay deterministic, preserves causal evidence | Adds projection fields and transition rules | 9/10 |
| Keep permissive default and infer missing evidence at ranking time | Minimal code change | Continues silent evidence loss and cannot explain replay | 2/10 |
| Move validity and lifecycle decisions into the shared reducer | Centralizes policy | Violates ownership and changes the frozen common substrate | 1/10 |

**Why this one**: The explicit inventory makes schema growth observable, while separate records retain the evidence
needed to recompute or abstain without changing shared contracts.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- A registered event cannot be accepted without a model-specific state transition.
- A lineage reference cannot bind an unrelated producer merely because its event ID exists.
- Contaminated, disclosed, retired, replaced, exposed, or unresolved evidence cannot silently remain ranked.
- Blocking unknown validity and unresolved required evidence abstain the affected ranking until resolved.
- A cited abstained or otherwise inconclusive judge observation cannot be erased by raw-score aggregation.
- Pairwise judge results and operational cost/latency facts remain independently addressable.

**What it costs**:

- The projection schema is wider. Mitigation: every new collection is canonicalized and remains under
  `modelBenchmark.scoringMatrix`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A legal trial transition is omitted | M | Table-driven forward-transition tests and typed failure codes |
| Late validity evidence leaves stale ranks | H | Re-derive existing evidence-set rankings after validity, lifecycle, exposure, or contamination changes |
| A valid event kind is omitted from a reference allowlist | H | Seventeen correct-kind controls cover every reference field beside wrong-kind rejection cases |
| Multiple observations from one evaluator over-block a corrected result | H | Only the latest cited observation for the same evaluator, score, calibration slice, and stream determines that evaluator's block |
| Pairwise semantics overstate the schema | M | Store raw judge outcome, confidence, uncertainty, and abstention without inventing a winner |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Adversarial replay reproduced silent event loss and cell regression |
| 2 | **Beyond Local Maxima?** | PASS | Shared-reducer and permissive-default alternatives were rejected against scope and safety |
| 3 | **Sufficient?** | PASS | The change adds only records and guards needed by the landed event families |
| 4 | **Fits Goal?** | PASS | Every change closes a named fold, transition, eligibility, or projection gap |
| 5 | **Open Horizons?** | PASS | Registry growth now fails closed until an explicit reducer case lands |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `model-benchmark-reducer.ts` gains seven fold cases, an exhaustive inventory guard, forward-only cell transitions,
  kind-aware reference assertions, unresolved-validity consumption, and judge-abstention-aware rank derivation.
- `model-benchmark-projection-types.ts` gains separate judge, oracle, contamination, exposure, lifecycle, pairwise,
  cost/latency, and unknown-validity record types.
- The model-benchmark reducer unit suite covers every new record and blocking transition, all seventeen reference
  fields with correct-kind controls and real wrong-kind producers, validity block and later resolution, cited judge
  abstention, genuine supporting evidence, and same-evaluator supersession.

Accepted P3 boundary: the landed schema has no event family for an abstained-cell disposition; the untested stems are
already probed by the exhaustive inventory, and reducer ordering matches the common precedent. The missing event
family is a cutover/schema-enhancement item, not an in-reducer defect.

**How to roll back**: Revert the reducer module, projection types, index export, and matching unit-test additions
together. The event ledger and shared reducer remain untouched, so the prior additive-dark projection can be rebuilt
from the same events.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
