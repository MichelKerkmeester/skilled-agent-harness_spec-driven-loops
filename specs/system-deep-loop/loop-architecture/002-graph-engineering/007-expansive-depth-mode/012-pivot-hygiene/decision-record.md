---
title: "Decision Record: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry"
description: "The operator decisions for Slice L, accepted 2026-11-17: the divergent pivot council seat cap counts per council attempt, 3 seat outputs per attempt, with at most one retry per pivot on a quorum failure, so one pivot uses at most 6; maxPivots 3 still caps the run."
trigger_phrases:
  - "pivot hygiene decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene"
    last_updated_at: "2026-11-17T18:00:00Z"
    last_updated_by: "operator-decision"
    recent_action: "Recorded the operator decision: the retry gets its own 3 seat outputs"
    next_safe_action: "Capture the T002 baseline, then build T003 and T004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-pivot-hygiene"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Is maxCouncilSeatOutputs per pivot or lifetime? Per pivot, decided by the operator on 2026-11-17."
      - "Does the retry fit the cap? Yes: each council attempt gets its own 3 seat outputs, with at most one retry per pivot, so one pivot uses at most 6. Decided by the operator on 2026-11-17."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Scope of the council seat cap, per pivot or lifetime

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. 3 seat outputs per council attempt, at most one retry per pivot, so at most 6 per pivot; `maxPivots: 3` still caps the run. |
| **Date** | 2026-11-17 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

`maxCouncilSeatOutputs` defaults to 9 (`divergent-pivot.ts:286`) and is checked as `usage.councilSeatOutputs + 3 > config.maxCouncilSeatOutputs` (:736), with usage carried across pivots (:1485-1486). Three pivots of three seats fill it exactly, so a resumed or failed pivot that still dispatched seats leaves later pivots short. "Council" here means divergent mode's internal three-seat vote in `runtime/lib/deep-loop/divergent-pivot.ts`, not the deprecated ai-council mode. This phase also adds one council retry on quorum failure, which costs three more seats, so the cap's scope decides whether a retry is affordable. Parent `research.md` §12 item 4 asks the operator to choose.

### Constraints

- `maxPivots: 3` (:285) already bounds the number of pivots per run.
- Persisted pivot limits list `maxCouncilSeatOutputs` as a required field (:1025), so its name stays; only its meaning can change.
- The pivot runs only in opt-in `divergent` convergence mode.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Cap council seat outputs per council attempt, at 3 per attempt, with at most one retry per pivot on a quorum failure. One pivot therefore uses at most 6 seat outputs. `maxPivots: 3` still caps the run.

**How it works**: The seat count resets for each council attempt and the cap is 3 seat outputs per attempt, one round of the three-seat vote. A first-attempt quorum failure may open one retry attempt with its own 3 seats; a second failure fails closed. The lifetime cost is bounded by `maxPivots` times 6, which is 18. A failed or resumed pivot no longer shrinks later pivots.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per pivot, default 6** | A failed or resumed pivot no longer shrinks later pivots; every pivot can afford its one retry; lifetime cost stays bounded by `maxPivots` | Changes what an existing `maxCouncilSeatOutputs` value means; worst-case lifetime seat cost rises from 9 to 18 | 7/10 |
| Lifetime, default 9 | No change in meaning or cost ceiling; smallest code change | A retry spends a later pivot's seats; a resumed pivot still burns budget silently | 6/10 |
| Lifetime, counting only completed pivots | Fixes the resumed-pivot leak without a meaning change | Needs a new definition of "completed" for partial rounds; most code of the three | 4/10 |

**Why this one**: The operator chose per-pivot scope, with 3 seat outputs per council attempt and the retry getting its own 3. It stops one pivot's seats leaking into another's budget and lets every pivot afford its one retry. The worst-case run cost rises from 9 to 18, the same ceiling the first row named. The planner scores above predate the decision and are kept as the offered record.

**Rejected**: A lifetime cap shared across pivots.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The seat cap's scope is stated and tested instead of implied.
- A transient council quorum failure no longer ends a pivot on its first occurrence.

**What it costs**:
- Changes what an existing `maxCouncilSeatOutputs` value means. Mitigation: the changelog states the new meaning.
- The worst-case seat cost of a run rises from 9 to 18 (3 pivots, each with one retry). Mitigation: the retry fires only on a quorum failure and at most once per pivot.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing configs set `maxCouncilSeatOutputs` with lifetime intent and read differently under per-pivot | L | The changelog states the new meaning; no shipped config sets the field today (it appears only in `divergent-pivot.ts` and its test) |
| A retry masks a systematic seat failure | L | Only one retry; a second failure fails closed with the original reason |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Parent §12 item 4 is open and the retry depends on it |
| 2 | **Beyond Local Maxima?** | PASS | Three scopes compared |
| 3 | **Sufficient?** | PASS | One check and one usage line change |
| 4 | **Fits Goal?** | PASS | Pivot yield is part of the widening story in parent §18 |
| 5 | **Open Horizons?** | PASS | `maxPivots` stays the outer bound |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `divergent-pivot.ts`: the default at :286 becomes 3, the check at :736 counts the current council attempt only, and the usage line at :1486 records the real seat outputs of the pivot, 3 or 6.
- The retry opens a second attempt with its own 3 seats; a pivot never gets a third attempt.

**How to roll back**: Revert the slice's commit. Usage records written meanwhile stay readable as ordinary seat counts.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| OD-001 | 2026-11-17: cap council seat outputs per pivot, 3 per pivot; `maxPivots: 3` still caps the run | A failed or resumed pivot no longer shrinks later pivots | ADR-001 Proposed status | `plan.md`, `tasks.md` T003 |
| OD-002 | 2026-11-17: "Retry gets its own 3". Each council attempt gets 3 seat outputs, with at most one retry per pivot on a quorum failure, so one pivot uses at most 6; `maxPivots: 3` still caps the run | A per-pivot cap of 3 left no room for the planned retry; giving the retry its own 3 keeps the retry and bounds it | OD-001's 3-per-pivot value, now 3 per council attempt | `plan.md`, `tasks.md` T003 and T004, `spec.md` REQ-002 and REQ-005 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

**OD-001** (2026-11-17)

- Asked: is `maxCouncilSeatOutputs` per pivot or lifetime?
- Offered: per pivot, default 6; lifetime, default 9; lifetime counting only completed pivots.
- Operator answer: cap council seat outputs per pivot, 3 per pivot; `maxPivots` 3 still caps the run. Clarified: "council" is divergent mode's internal three-seat vote in `runtime/lib/deep-loop/divergent-pivot.ts`, not the deprecated ai-council mode.

**OD-002** (2026-11-17)

- Asked: a retry costs three more seat outputs, which a per-pivot cap of 3 refuses. Does the retry stay, and under what budget?
- Operator answer: "Retry gets its own 3". Each council attempt gets 3 seat outputs, with at most one retry per pivot on a quorum failure, so one pivot uses at most 6; `maxPivots` 3 still caps the run.
<!-- /ANCHOR:operator-answers-verbatim -->

---
